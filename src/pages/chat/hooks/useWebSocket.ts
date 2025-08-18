import { useState, useEffect, useCallback, useRef } from "react";
import { useSnapshot } from "valtio";
import { chatStore, chatActions } from "@/store/chatStore";
import webSocketService from "@/services/WebSocketService";
import type { WebSocketMessage } from "@/types/chat";
import { authStore } from "@/store/authStore";
import { useSnapshot as useVSnapshot } from "valtio";

export const useWebSocket = () => {
  const snap = useSnapshot(chatStore);
  const authSnap = useVSnapshot(authStore);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      webSocketService.subscribeToUnread((payload: any) => {
        try {
          const roomId = Number(payload?.data?.roomId);
          if (Number.isFinite(roomId)) {
            chatActions.incrementUnreadCount(roomId);
          }
        } catch {}
      });
    } catch (e) {
      console.warn("UNREAD 구독 실패", e);
    }
  }, [isConnected]);

  const unsubscribeUnread = useCallback(() => {
    try {
      webSocketService.unsubscribeUnread();
    } catch {}
  }, []);

  // 연결 해제 함수
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  // 채팅방 입장
  const joinRoom = useCallback(
    (roomId: string, roomType: "PRIVATE" | "GROUP" | "BAND" = "GROUP") => {
      if (!isConnected) {
        console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
        connect().then(() => {
          joinRoom(roomId, roomType);
        });
        return;
      }

      // 현재 채팅방 ID 설정
      chatActions.setCurrentRoomId(roomId);

      // 채팅방 구독 (roomType에 따라 분기)
      const onMessage = (message: WebSocketMessage) => {
        console.log("실시간 메시지 수신:", message);
        chatActions.addRealtimeMessage(message);
      };
      if (roomType === "PRIVATE") {
        webSocketService.subscribeToPrivateRoom(roomId, onMessage);
      } else {
        webSocketService.subscribeToGroupRoom(roomId, onMessage);
      }

      console.log(`채팅방 ${roomId} 입장 완료`);
    },
    [isConnected, connect]
  );

  // 채팅방 나가기
  const leaveRoom = useCallback(() => {
    if (currentRoomId) {
      webSocketService.unsubscribeFromRoom(currentRoomId);
      chatActions.setCurrentRoomId(null);
      console.log(`채팅방 ${currentRoomId} 나가기 완료`);
    }
  }, [currentRoomId]);

  // 메시지 전송
  const sendMessage = useCallback(
    (
      content: string,
      roomType: "PRIVATE" | "GROUP" | "BAND" = "GROUP",
      receiverId?: number
    ) => {
      if (!currentRoomId) {
        console.error("현재 채팅방이 설정되지 않았습니다.");
        return;
      }

      if (!isConnected) {
        console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
        connect().then(() => {
          sendMessage(content, roomType, receiverId);
        });
        return;
      }

      try {
        webSocketService.sendMessage(
          currentRoomId,
          content,
          roomType,
          receiverId
        );
        console.log("메시지 전송 완료:", content);
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        throw error;
      }
    },
    [currentRoomId, isConnected, connect]
  );

  // 연결 상태 확인
  const checkConnection = useCallback(() => {
    return webSocketService.isConnected();
  }, []);

  // 현재 구독 중인 채팅방 목록
  const getSubscriptions = useCallback(() => {
    return webSocketService.getCurrentSubscriptions();
  }, []);

  // 수동 재연결
  const reconnect = useCallback(async () => {
    if (isConnecting) return;

    console.log("수동 재연결 시도...");
    disconnect();

    // 잠시 대기 후 재연결
    reconnectTimeoutRef.current = setTimeout(async () => {
      try {
        await connect();

        // 이전 채팅방 재구독
        if (currentRoomId) {
          joinRoom(currentRoomId);
        }
      } catch (error) {
        console.error("재연결 실패:", error);
      }
    }, 1000);
  }, [isConnecting, disconnect, connect, currentRoomId, joinRoom]);

  return {
    // 상태
    isConnected,
    isConnecting,
    currentRoomId,
    error: snap.error,

    // 연결 관리
    connect,
    disconnect,
    reconnect,
    checkConnection,

    // 채팅방 관리
    joinRoom,
    leaveRoom,

    // 메시지 관리
    sendMessage,

    // 구독 관리
    getSubscriptions,
    subscribeUnread,
    unsubscribeUnread,

    // 읽음 상태 전송
    sendLastRead: webSocketService.sendLastRead.bind(webSocketService),
  };
};
