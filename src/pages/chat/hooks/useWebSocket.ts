import { useState, useEffect, useCallback, useRef } from "react";
import { useSnapshot } from "valtio";
import { chatStore, chatActions } from "@/store/chatStore";
import webSocketService from "@/services/WebSocketService";
import type { WebSocketMessage } from "@/types/chat";
import { authStore } from "@/store/authStore";
import { useSnapshot as useVSnapshot } from "valtio";

interface UnreadPayload {
  data: {
    roomId: number;
  };
}

export const useWebSocket = () => {
  const snap = useSnapshot(chatStore);
  const authSnap = useVSnapshot(authStore);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isJoiningRef = useRef(false);
  const subscribedRoomIdRef = useRef<string | null>(null);

  // 메시지 핸들러
  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log("실시간 메시지 수신:", message);
    // 현재 방만 반영 (다른 방 브로드캐스트로 인한 중복 방지)
    if (
      message?.roomId &&
      chatStore.currentRoomId &&
      chatStore.currentRoomId.toString() !== message.roomId.toString()
    ) {
      return;
    }
    chatActions.addRealtimeMessage(message);
  }, []);

  // WebSocket 연결 상태
  const isConnected = snap.webSocketConnected;
  const currentRoomId = snap.currentRoomId;

  // 자동 연결 관리 (토큰이 있을 때만 시도)
  useEffect(() => {
    const connectWebSocket = async () => {
      if (!authSnap.accessToken) {
        return;
      }
      if (!isConnected && !isConnecting) {
        setIsConnecting(true);
        try {
          await webSocketService.connect();
        } catch (error) {
          console.error("WebSocket 연결 실패:", error);
        } finally {
          setIsConnecting(false);
        }
      }
    };

    // 컴포넌트 마운트 시 자동 연결
    connectWebSocket();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      webSocketService.disconnect();
    };
  }, [isConnected, isConnecting, authSnap.accessToken]);

  // 연결 함수
  const connect = useCallback(async () => {
    if (!authSnap.accessToken) return;
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    try {
      await webSocketService.connect();
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting, authSnap.accessToken]);

  // 목록 화면에서만 사용할 수 있도록 공개용 함수 제공
  const subscribeUnread = useCallback(() => {
    if (!isConnected) return;
    try {
      webSocketService.subscribeToUnread((data: unknown) => {
        try {
          const payload = data as UnreadPayload;
          const roomId = Number(payload?.data?.roomId);
          if (Number.isFinite(roomId)) {
            chatActions.incrementUnreadCount(roomId);
          }
        } catch {
          // 오류 처리
        }
      });
    } catch {
      console.warn("UNREAD 구독 실패");
    }
  }, [isConnected]);

  const unsubscribeUnread = useCallback(() => {
    try {
      webSocketService.unsubscribeUnread();
    } catch {
      // 구독 해제 실패 시 무시
    }
  }, []);

  // 연결 해제 함수
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  // 채팅방 나가기
  const leaveRoom = useCallback(() => {
    if (currentRoomId) {
      try {
        if (subscribedRoomIdRef.current) {
          webSocketService.unsubscribeFromRoom(subscribedRoomIdRef.current);
        }
        chatActions.setCurrentRoomId(null);
        subscribedRoomIdRef.current = null;
        console.log(`채팅방 ${currentRoomId} 나가기 완료`);
      } catch (error) {
        console.error("채팅방 나가기 실패:", error);
      }
    }
  }, [currentRoomId]);

  // 채팅방 입장
  const joinRoom = useCallback(
    async (roomId: string, roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER") => {
      // 동일 방 재입장, 혹은 진행 중이면 무시
      if (isJoiningRef.current) return;
      if (subscribedRoomIdRef.current === roomId) return;

      if (!isConnected) {
        console.warn("WebSocket이 연결되지 않음. 연결 시도 중...");
        try {
          await connect();
          // 연결 후 잠시 대기
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("WebSocket 연결 실패:", error);
          return;
        }
      }

      if (!isConnected) {
        console.error("WebSocket 연결 실패. 채팅방 입장 불가.");
        return;
      }

      console.log(`채팅방 ${roomId} 입장 시도 (타입: ${roomType})`);

      try {
        isJoiningRef.current = true;
        // 다른 방에 구독 중이면 해제
        if (
          subscribedRoomIdRef.current &&
          subscribedRoomIdRef.current !== roomId
        ) {
          webSocketService.unsubscribeFromRoom(subscribedRoomIdRef.current);
          subscribedRoomIdRef.current = null;
        }

        // 새로운 방 구독
        if (roomType === "PRIVATE" || roomType === "BAND-APPLICANT" || roomType === "BAND-MANAGER") {
          // 개인 채팅방 구독 (/user/queue/room/{roomId})
          webSocketService.subscribeToPrivateRoom(roomId, handleMessage);
        } else if (roomType === "GROUP") {
          // 그룹 채팅방 구독 (/topic/room/{roomId})
          webSocketService.subscribeToGroupRoom(roomId, handleMessage);
        }

        chatActions.setCurrentRoomId(roomId);
        subscribedRoomIdRef.current = roomId;

        console.log(`채팅방 ${roomId} 입장 성공 (타입: ${roomType})`);
      } catch (error) {
        console.error(`채팅방 ${roomId} 입장 실패:`, error);
      } finally {
        isJoiningRef.current = false;
      }
    },
    [isConnected, connect]
  );

  // 메시지 전송
  const sendMessage = useCallback(
    async (
      content: string,
      roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER",
      receiverId?: number
    ) => {
      if (!isConnected || !currentRoomId) {
        console.error("WebSocket이 연결되지 않았거나 채팅방에 입장하지 않음");
        return;
      }

      try {
        await webSocketService.sendMessage(
          currentRoomId,
          content,
          roomType,
          receiverId
        );
        console.log("메시지 전송 성공:", content);
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        throw error;
      }
    },
    [isConnected, currentRoomId]
  );

  // 마지막 읽음 시간 전송 (roomId, messageId, roomType)
  const sendLastRead = useCallback(
    (
      roomId: string,
      messageId: number,
      roomType: "PRIVATE" | "GROUP" | "BAND" = "GROUP"
    ) => {
      if (!isConnected) return;
      try {
        webSocketService.sendLastRead(roomId, messageId, roomType);
        console.log("마지막 읽음 시간 전송 성공:", {
          roomId,
          messageId,
          roomType,
        });
      } catch (error) {
        console.error("마지막 읽음 시간 전송 실패:", error);
      }
    },
    [isConnected]
  );

  return {
    isConnected,
    isConnecting,
    currentRoomId,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendLastRead,
    subscribeUnread,
    unsubscribeUnread,
    error: snap.error,
  };
};
