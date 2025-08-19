import { useCallback, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { chatStore, chatActions } from "@/store/chatStore";
import { useWebSocket } from "./useWebSocket";
import { getChatMessages, joinChatRoom, leaveChatRoom } from "@/store/chatApi";
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
    joinRoom,
    leaveRoom,
    sendMessage: sendWebSocketMessage,
    error: webSocketError,
    sendLastRead,
  } = useWebSocket();
  // 현재 방 타입과 마지막으로 전송한 읽음 메시지 ID를 저장
  const currentRoomTypeRef = useRef<"PRIVATE" | "GROUP" | "BAND">("GROUP");
  const lastReadSentIdRef = useRef<number | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [snap.messages]);

  // 채팅방 입장 (loadMessages 이후에 선언되어야 함)

  // 채팅방 나가기
  const exitChatRoom = useCallback(async () => {
    if (!currentRoomId) return;

    try {
      // REST API로 채팅방 나가기
      await leaveChatRoom(currentRoomId);

      // WebSocket 구독 해제
      leaveRoom();

      // 메시지 초기화
      chatActions.clearMessages();
      chatActions.clearRealtimeMessages();

      console.log(`채팅방 ${currentRoomId} 나가기 완료`);
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      throw error;
    }
  }, [currentRoomId, leaveRoom]);

  // 메시지 로드
  const loadMessages = useCallback(
    async (roomId: string, cursor?: number) => {
      if (isLoadingMessages) return;

      setIsLoadingMessages(true);
      try {
        const response = await getChatMessages(roomId, cursor);

        // API 응답을 ChatMessage 형식으로 변환
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
      roomType: "PRIVATE" | "GROUP" | "BAND" = "GROUP"
    ) => {
      // 현재 방 아이디를 먼저 설정하여 sendMessage 가드 통과
      chatActions.setCurrentRoomId(roomId);
      currentRoomTypeRef.current = roomType;
      lastReadSentIdRef.current = null;
      try {
        // REST join 시도(이미 참가자 등록 시 실패 가능) → 실패해도 WS 진행
        await joinChatRoom(roomId);
      } catch (error) {
        console.warn("REST join 실패, WS로 우회 진행:", error);
      }

      try {
        // WebSocket 구독
        joinRoom(roomId, roomType);

        // 기존 메시지 로드
        await loadMessages(roomId);

        console.log(`채팅방 ${roomId} 입장 완료`);
      } catch (error) {
        console.error("채팅방 입장 실패:", error);
        throw error;
      }
    },
    [joinRoom, loadMessages]
  );

  // 메시지 전송
  const sendMessage = useCallback(
    (
      text: string,
      roomType: "PRIVATE" | "GROUP" | "BAND" = "GROUP",
      receiverId?: number
    ) => {
      if (!currentRoomId) {
        console.error("현재 채팅방이 설정되지 않았습니다.");
        return;
      }

      if (!isConnected) {
        console.warn(
          "WebSocket이 연결되지 않았습니다. 로컬 메시지로 처리합니다."
        );
        // WebSocket이 연결되지 않은 경우 로컬 메시지로 처리
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
        return;
      }

      try {
        // WebSocket으로 메시지 전송
        sendWebSocketMessage(text, roomType, receiverId);

        // 로컬에 즉시 메시지 추가 (낙관적 업데이트)
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
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        throw error;
      }
    },
    [currentRoomId, isConnected, sendWebSocketMessage]
  );

  // 메시지 목록이 갱신될 때마다 마지막 메시지를 기준으로 읽음 상태 전송
  useEffect(() => {
    if (!currentRoomId || snap.messages.length === 0) return;
    const last = snap.messages[snap.messages.length - 1];
    const lastId = Number(last.id);
    if (!Number.isFinite(lastId)) return;
    if (lastReadSentIdRef.current === lastId) return;
    try {
      sendLastRead(
        currentRoomId,
        lastId,
        currentRoomTypeRef.current || "GROUP"
      );
      lastReadSentIdRef.current = lastId;
    } catch (e) {
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
    error: snap.error || webSocketError,
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
  };
};
