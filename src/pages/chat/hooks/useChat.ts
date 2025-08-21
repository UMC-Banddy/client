import { useCallback, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { chatStore, chatActions } from "@/store/chatStore";
import { useWebSocket } from "./useWebSocket";
import { getChatMessages, leaveChatRoom } from "@/store/chatApi";
import type { ChatMessage } from "@/types/chat";

export const useChat = () => {
  const snap = useSnapshot(chatStore);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);

  // WebSocket 훅 사용
  const {
    isConnected,
    currentRoomId,
    connect,
    joinRoom,
    leaveRoom,
    sendMessage: sendWebSocketMessage,
    sendLastRead,
  } = useWebSocket();
  // 현재 방 타입과 마지막으로 전송한 읽음 메시지 ID를 저장
  const currentRoomTypeRef = useRef<
    "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER" | null
  >(null);
  const lastReadSentIdRef = useRef<number | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [snap.messages]);

  // 채팅방 입장 (loadMessages 이후에 선언되어야 함)

  // 채팅방 나가기
  const isLeavingRef = useRef(false);
  const exitChatRoom = useCallback(async () => {
    if (!currentRoomId || isLeavingRef.current) return;
    isLeavingRef.current = true;
    try {
      // WebSocket 구독 해제 먼저 수행(중복 수신/에러 방지)
      leaveRoom();

      // REST API로 채팅방 나가기 시도
      try {
        await leaveChatRoom(currentRoomId);
      } catch (e: unknown) {
        // 이미 나간 방 등으로 400이 반환될 수 있음 → 워닝만 남기고 계속 진행
        const err = e as { response?: { status?: number } };
        if (err?.response?.status === 400) {
          console.warn("채팅방 나가기 400 무시 (이미 나간 상태 가능)");
        } else {
          throw e;
        }
      }

      // 메시지 초기화
      chatActions.clearMessages();
      chatActions.clearRealtimeMessages();

      console.log(`채팅방 ${currentRoomId} 나가기 완료`);
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      // 여기서 throw하면 언마운트/뒤로가기 시 Uncaught 발생 → 로그만 남김
    } finally {
      isLeavingRef.current = false;
    }
  }, [currentRoomId, leaveRoom]);

  // 메시지 로드
  const loadMessages = useCallback(
    async (roomId: string, cursor?: number) => {
      if (isLoadingMessages) return;

      setIsLoadingMessages(true);
      try {
        const response = await getChatMessages(roomId, cursor);

        // API 응답을 ChatMessage 형식으로 변환 (서버 timestamp 활용)
        const chatMessages: ChatMessage[] = response.result.messages.map(
          (msg) => ({
            id: msg.messageId.toString(),
            type: "other", // 기본값, 실제로는 현재 사용자 ID와 비교해야 함
            name: msg.senderName,
            avatar: "/src/assets/images/profile1.png", // 기본 아바타
            text: msg.content,
            time: new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            timestamp: msg.timestamp, // 서버에서 제공하는 원본 timestamp 저장
            unreadCount: 0,
          })
        );

        if (cursor) {
          // 무한 스크롤: 기존 메시지 앞에 추가
          chatActions.setMessages([...chatMessages, ...snap.messages]);
        } else {
          // 초기 로드: 메시지 교체
          chatActions.setMessages(chatMessages);
        }

        setHasMoreMessages(response.result.hasNext);
        setLastMessageId(response.result.lastMessageId);

        console.log(`${chatMessages.length}개의 메시지 로드 완료`);
      } catch (error) {
        console.error("메시지 로드 실패:", error);
        throw error;
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [isLoadingMessages, snap.messages]
  );

  // 채팅방 입장 (loadMessages 선언 이후로 이동)
  const enterChatRoom = useCallback(
    async (
      roomId: string,
      roomType:
        | "PRIVATE"
        | "GROUP"
        | "BAND-APPLICANT"
        | "BAND-MANAGER"
    ) => {
      if (!isConnected) {
        console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
        try {
          await connect();
        } catch (error) {
          console.error("WebSocket 연결 실패:", error);
          return;
        }
      }

      try {
        // WebSocket 채팅방 입장 (역할별로 적절한 타입 유지)
        await joinRoom(roomId, roomType);

        // 현재 룸타입 저장 (읽음 상태 전송에 사용)
        currentRoomTypeRef.current = roomType;

        // 기존 메시지 로드
        await loadMessages(roomId);

        console.log(`채팅방 ${roomId} 입장 완료 (타입: ${roomType})`);
      } catch (error) {
        console.error("채팅방 입장 실패:", error);
      }
    },
    [isConnected, connect, joinRoom, loadMessages]
  );

  // 메시지 전송
  const sendMessage = useCallback(
    (
      text: string,
      roomType:
        | "PRIVATE"
        | "GROUP"
        | "BAND-APPLICANT"
        | "BAND-MANAGER",
      receiverId?: number
    ) => {
      if (!currentRoomId || !isConnected) {
        console.error("채팅방에 입장하지 않았거나 WebSocket이 연결되지 않음");
        return;
      }

      try {
        sendWebSocketMessage(text, roomType, receiverId);

        // 밴드 채팅은 서버 브로드캐스트만 사용 (낙관적 추가 없음)
        if (roomType === "BAND-APPLICANT" || roomType === "BAND-MANAGER") {
          // 서버에서 메시지가 브로드캐스트될 때까지 대기
          return;
        }

        // PRIVATE 채팅만 낙관적 추가
        if (roomType === "PRIVATE") {
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            type: "me",
            name: "Beck",
            avatar: "/src/assets/images/profile1.png",
            text,
            time: new Date().toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            unreadCount: 0,
          };
          chatActions.addMessage(newMessage);
        }
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        throw error;
      }
    },
    [currentRoomId, isConnected, sendWebSocketMessage]
  );

  // 밴드 채팅방 첫 방문 시 봇 메시지 추가
  const addBandBotMessage = useCallback(
    (
      roomType: string,
      bandInfo?: { profileImageUrl?: string; description?: string }
    ) => {
      if (roomType === "BAND-APPLICANT" || roomType === "BAND-MANAGER") {
        const now = new Date();
        const botMessage: ChatMessage = {
          id: `bot-${now.getTime()}`,
          type: "system",
          name: "Banddy Bot",
          avatar:
            bandInfo?.profileImageUrl || "/src/assets/images/profile1.png",
          text:
            bandInfo?.description ||
            "밴드 채팅방입니다. 밴드 멤버들과 소통해보세요.",
          time: now.toLocaleTimeString("ko-KR", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          unreadCount: 0,
        };
        chatActions.addMessage(botMessage);
      }
    },
    []
  );

  // 메시지 목록이 갱신될 때마다 마지막 메시지를 기준으로 읽음 상태 전송
  useEffect(() => {
    if (!currentRoomId || snap.messages.length === 0 || !currentRoomTypeRef.current) return;
    const last = snap.messages[snap.messages.length - 1];
    const lastId = Number(last.id);
    if (!Number.isFinite(lastId)) return;
    if (lastReadSentIdRef.current === lastId) return;
    try {
      sendLastRead(
        currentRoomId,
        lastId,
        currentRoomTypeRef.current
      );
      lastReadSentIdRef.current = lastId;
    } catch {
      // no-op
    }
  }, [snap.messages, currentRoomId, sendLastRead]);

  // 무한 스크롤로 더 많은 메시지 로드
  const loadMoreMessages = useCallback(() => {
    if (!currentRoomId || isLoadingMessages || !hasMoreMessages) return;

    loadMessages(currentRoomId, lastMessageId || undefined);
  }, [
    currentRoomId,
    isLoadingMessages,
    hasMoreMessages,
    lastMessageId,
    loadMessages,
  ]);

  // 기존 기능들 (호환성 유지)
  const sendAudio = useCallback(() => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "me",
      name: "Beck",
      avatar: "/src/assets/images/profile1.png",
      audio: {
        duration: 30,
        isPlaying: false,
        onPlay: () => console.log("Play audio"),
      },
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      unreadCount: 0,
    };

    chatActions.addMessage(newMessage);
  }, []);

  const sendImage = useCallback((imageFile: File) => {
    console.log("Image file:", imageFile);
    // TODO: Implement image upload logic
  }, []);

  const sendCalendar = useCallback(() => {
    console.log("Calendar event creation");
    // TODO: Implement calendar event creation
  }, []);

  const handleAudioPlay = useCallback(
    (messageId: string) => {
      // Stop currently playing audio
      if (snap.playingAudioId && snap.playingAudioId !== messageId) {
        chatActions.setPlayingAudioId(null);
      }

      // Toggle current audio
      chatActions.setPlayingAudioId(
        snap.playingAudioId === messageId ? null : messageId
      );
    },
    [snap.playingAudioId]
  );

  const markMessageAsRead = useCallback((messageId: string) => {
    chatActions.markAsRead(messageId);
  }, []);

  return {
    // 상태
    messages: snap.messages,
    currentRoom: snap.currentRoom,
    isLoading: snap.isLoading || isLoadingMessages,
    isTyping: snap.isTyping,
    playingAudioId: snap.playingAudioId,
    isConnected,
    currentRoomId,
    error: snap.error,
    hasMoreMessages,

    // refs
    messagesEndRef,

    // 채팅방 관리
    enterChatRoom,
    exitChatRoom,

    // 메시지 관리
    sendMessage,
    loadMoreMessages,
    markMessageAsRead,

    // 기존 기능들
    sendAudio,
    sendImage,
    sendCalendar,
    handleAudioPlay,
    addBandBotMessage,
  };
};
