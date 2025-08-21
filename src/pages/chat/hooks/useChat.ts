import { useCallback, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { chatStore, chatActions } from "@/store/chatStore";
import { useWebSocket } from "./useWebSocket";
import { getChatMessages, leaveChatRoom } from "@/store/chatApi";
import type { ChatMessage } from "@/types/chat";
import webSocketService from "@/services/WebSocketService";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

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
    // connect, // eslint 에러로 인해 임시 주석
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
    [isLoadingMessages] // snap.messages 제거하여 무한 루프 방지
  );

  // 채팅방 입장 (loadMessages 선언 이후로 이동)
  const enterChatRoom = useCallback(
    async (
      roomId: string,
      roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER"
    ) => {
      // HomePage에서 WebSocket 연결을 관리하므로 여기서는 연결 상태만 확인
      if (!isConnected) {
        console.warn(
          "WebSocket이 연결되지 않았습니다. HomePage에서 연결을 확인해주세요."
        );
        return;
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
    [isConnected, joinRoom, loadMessages]
  );

  // 메시지 전송
  const sendMessage = useCallback(
    async (
      text: string,
      roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER",
      receiverId?: number
    ) => {
      // 디버깅 로그 추가
      console.log("sendMessage 호출:", {
        currentRoomId,
        isConnected,
        roomType,
        text: text.substring(0, 20) + (text.length > 20 ? "..." : ""),
        receiverId,
      });

      // WebSocket 서비스 상태도 확인
      const wsConnected = webSocketService.isConnected();
      const isSubscribed = currentRoomId
        ? webSocketService.getSubscriptionStatus(currentRoomId)
        : false;

      console.log("WebSocket 상세 상태:", {
        storeConnected: isConnected,
        serviceConnected: wsConnected,
        roomSubscribed: isSubscribed,
        currentRoomId,
      });

      if (!currentRoomId || !isConnected) {
        console.error("채팅방에 입장하지 않았거나 WebSocket이 연결되지 않음", {
          currentRoomId,
          isConnected,
          wsConnected,
          isSubscribed,
        });
        // 추가 디버깅을 위해 WebSocket 상태 출력
        webSocketService.logConnectionStatus();
        return;
      }

      try {
        // PRIVATE의 경우 receiverId 자동 추출 (memberInfo.memberId)
        let resolvedReceiverId: number | undefined = receiverId;
        if (roomType === "PRIVATE" && !resolvedReceiverId) {
          try {
            const res = await API.get(
              API_ENDPOINTS.CHAT.ROOM_MEMBERS(currentRoomId)
            );
            const payload = res?.data?.result ?? res?.data ?? {};
            const currentUserId = Number(localStorage.getItem("memberId"));

            if (payload?.memberInfo?.memberId) {
              resolvedReceiverId = Number(payload.memberInfo.memberId);
            } else if (Array.isArray(payload?.memberInfos)) {
              const other =
                payload.memberInfos.find(
                  (m: { memberId: number }) =>
                    Number(m.memberId) !== currentUserId
                ) || payload.memberInfos[0];
              resolvedReceiverId = other ? Number(other.memberId) : undefined;
            }

            console.log("PRIVATE receiverId 자동 추출:", resolvedReceiverId);
          } catch (e) {
            console.warn(
              "ROOM_MEMBERS 조회 실패, receiverId 자동 추출 불가",
              e
            );
          }
        }

        // 전송
        await sendWebSocketMessage(text, roomType, resolvedReceiverId);

        // 밴드 채팅은 서버 브로드캐스트만 사용 (낙관적 추가 없음)
        if (roomType === "BAND-APPLICANT" || roomType === "BAND-MANAGER") {
          console.log("밴드 채팅: 서버 브로드캐스트 대기 중...");
          return;
        }

        // PRIVATE 채팅만 낙관적 추가 (중복 방지 로직 포함)
        if (roomType === "PRIVATE") {
          // 임시 messageId 생성 (서버에서 받은 메시지와 구분하기 위해)
          const tempMessageId = `temp-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          const newMessage: ChatMessage = {
            id: tempMessageId,
            type: "me",
            name: "Beck", // TODO: 실제 사용자 이름으로 변경
            avatar: "/src/assets/images/profile1.png",
            text,
            time: new Date().toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            unreadCount: 0,
            isOptimistic: true,
          };

          console.log("개인채팅 낙관적 메시지 추가:", tempMessageId);
          chatActions.addMessage(newMessage);
        }

        // GROUP 채팅은 서버 브로드캐스트만 사용
        if (roomType === "GROUP") {
          console.log("그룹 채팅: 서버 브로드캐스트 대기 중...");
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
    if (
      !currentRoomId ||
      snap.messages.length === 0 ||
      !currentRoomTypeRef.current
    )
      return;
    const last = snap.messages[snap.messages.length - 1];
    const lastId = Number(last.id);
    if (!Number.isFinite(lastId)) return;
    if (lastReadSentIdRef.current === lastId) return;
    try {
      sendLastRead(currentRoomId, lastId, currentRoomTypeRef.current);
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
