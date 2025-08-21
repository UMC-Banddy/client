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

  // 핵심: ref로 상태 관리하여 불필요한 리렌더 방지
  const mountedOnceRef = useRef(false); // StrictMode 이중 마운트 방지
  const joinedRoomsRef = useRef<Set<string>>(new Set()); // join 한번만
  const subscribedRoomIdRef = useRef<string | null>(null);
  const isJoiningRef = useRef(false);

  // 메시지 핸들러
  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log("실시간 메시지 수신:", message);

    // 1. 기본 유효성 검사
    if (!message?.messageId || !message?.roomId) {
      console.warn("유효하지 않은 메시지:", message);
      return;
    }

    // 2. 현재 방 메시지인지 확인
    if (
      chatStore.currentRoomId &&
      chatStore.currentRoomId.toString() !== message.roomId.toString()
    ) {
      console.log(
        `다른 방(${message.roomId}) 메시지 무시, 현재 방: ${chatStore.currentRoomId}`
      );
      return;
    }

    // 3. 중복 메시지 방지 (messageId 기반)
    const existingMessage = chatStore.messages.find(
      (msg) =>
        msg.id === message.messageId.toString() ||
        (msg.isOptimistic && msg.text === message.content)
    );

    if (existingMessage) {
      console.log(
        `중복 메시지 무시: ${message.messageId} (${message.content})`
      );

      // 낙관적 메시지가 있다면 중복으로 처리
      if (existingMessage.isOptimistic) {
        console.log("낙관적 메시지와 중복된 서버 메시지 무시");
      }
      return;
    }

    // 4. 메시지 추가
    console.log("새 메시지 추가:", message.messageId);
    chatActions.addRealtimeMessage(message);
  }, []);

  // WebSocket 연결 상태 - HomePage에서 관리하므로 여기서는 상태만 확인
  const isConnected = snap.webSocketConnected;
  const currentRoomId = snap.currentRoomId;

  // 연결 함수 - HomePage에서 이미 연결되어 있으므로 상태만 확인
  const connect = useCallback(async () => {
    if (!authSnap.accessToken) return;

    // HomePage에서 이미 연결되어 있는지 확인
    if (webSocketService.isConnected()) {
      console.log("WebSocket이 이미 연결되어 있습니다 (HomePage에서 관리)");
      return;
    }

    // 연결이 안되어 있다면 HomePage에서 연결을 시도하도록 함
    console.log(
      "WebSocket 연결이 안되어 있습니다. HomePage에서 연결을 시도합니다."
    );
    throw new Error(
      "WebSocket 연결이 안되어 있습니다. HomePage에서 연결을 시도합니다."
    );
  }, [authSnap.accessToken]);

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

  // 연결 해제 함수 - HomePage에서 관리하므로 여기서는 구독만 해제
  const disconnect = useCallback(() => {
    console.log(
      "useWebSocket에서 disconnect 호출 - 구독만 해제하고 연결은 유지"
    );
    // 연결은 끊지 않고 구독만 해제
    if (subscribedRoomIdRef.current) {
      webSocketService.unsubscribeFromRoom(subscribedRoomIdRef.current);
      subscribedRoomIdRef.current = null;
    }
  }, []);

  // 채팅방 나가기
  const leaveRoom = useCallback(() => {
    if (currentRoomId) {
      try {
        if (subscribedRoomIdRef.current) {
          console.log(`채팅방 ${subscribedRoomIdRef.current} 구독 해제 중...`);
          webSocketService.unsubscribeFromRoom(subscribedRoomIdRef.current);
          subscribedRoomIdRef.current = null;
        }
        chatActions.setCurrentRoomId(null);
        console.log(`채팅방 ${currentRoomId} 나가기 완료`);
      } catch (error) {
        console.error("채팅방 나가기 실패:", error);
      }
    }
  }, [currentRoomId]);

  // 채팅방 입장 - 핵심: idempotent join + 구독 1회 보장
  const joinRoom = useCallback(
    async (
      roomId: string,
      roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER"
    ) => {
      // 동일 방 재입장, 혹은 진행 중이면 무시
      if (isJoiningRef.current) {
        console.log("이미 방 입장 진행 중...");
        return;
      }

      // 이미 같은 방에 구독 중인지 더 엄격하게 체크
      if (
        subscribedRoomIdRef.current === roomId &&
        webSocketService.isConnected()
      ) {
        console.log(`이미 ${roomId} 방에 구독 중입니다.`);
        return;
      }

      console.log(`채팅방 ${roomId} 입장 시도 (타입: ${roomType})`);

      try {
        isJoiningRef.current = true;

        // 다른 방에 구독 중이면 해제 (더 안전하게)
        if (
          subscribedRoomIdRef.current &&
          subscribedRoomIdRef.current !== roomId
        ) {
          console.log(`기존 방 ${subscribedRoomIdRef.current} 구독 해제 중...`);
          try {
            webSocketService.unsubscribeFromRoom(subscribedRoomIdRef.current);
            subscribedRoomIdRef.current = null;
            // 구독 해제 후 더 긴 대기 시간
            await new Promise((resolve) => setTimeout(resolve, 300));
          } catch (error) {
            console.warn("구독 해제 중 오류:", error);
            subscribedRoomIdRef.current = null;
          }
        }

        // WebSocket 연결 상태 확인 (HomePage에서 관리)
        if (!webSocketService.isConnected()) {
          console.error(
            "WebSocket 연결 실패. HomePage에서 연결을 확인해주세요."
          );
          return;
        }

        // idempotent join: 방에 한 번만 join
        if (!joinedRoomsRef.current.has(roomId)) {
          joinedRoomsRef.current.add(roomId);
          // HTTP join은 별도로 처리 (여기서는 WebSocket 구독만)
          console.log(`방 ${roomId} join 완료 (idempotent)`);
        }

        // 새로운 방 구독 - 1회 보장
        if (
          roomType === "PRIVATE" ||
          roomType === "BAND-APPLICANT" ||
          roomType === "BAND-MANAGER"
        ) {
          // 개인 채팅방 구독 (/user/queue/room/{roomId})
          console.log(`개인 채팅방 ${roomId} 구독 시작...`);
          webSocketService.subscribeToPrivateRoom(roomId, handleMessage);
        } else if (roomType === "GROUP") {
          // 그룹 채팅방 구독 (/topic/room/{roomId})
          console.log(`그룹 채팅방 ${roomId} 구독 시작...`);
          webSocketService.subscribeToGroupRoom(roomId, handleMessage);
        }

        chatActions.setCurrentRoomId(roomId);
        subscribedRoomIdRef.current = roomId;

        console.log(`채팅방 ${roomId} 입장 성공 (타입: ${roomType})`);
        console.log(`chatStore.currentRoomId 설정됨:`, roomId);
        console.log(
          `subscribedRoomIdRef.current 설정됨:`,
          subscribedRoomIdRef.current
        );
      } catch (error) {
        console.error(`채팅방 ${roomId} 입장 실패:`, error);
      } finally {
        isJoiningRef.current = false;
      }
    },
    [handleMessage]
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
      roomType: "PRIVATE" | "GROUP" | "BAND-APPLICANT" | "BAND-MANAGER"
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
