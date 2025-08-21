import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";
import webSocketService from "@/services/WebSocketService";

/**
 * HomePage에서 WebSocket 연결을 관리하는 훅
 * 앱 전체 생명주기 동안 WebSocket 연결을 유지하고,
 * 채팅방 입장/퇴장 시에는 구독만 관리
 */
export const useWebSocketConnection = () => {
  const authSnap = useSnapshot(authStore);
  const mountedOnceRef = useRef(false);
  const connectionAttemptRef = useRef<number>(0);
  const lastConnectionAttemptRef = useRef<number>(0);
  const connectionCooldownRef = useRef<number>(5000); // 5초 쿨다운

  // WebSocket 연결 관리
  useEffect(() => {
    if (mountedOnceRef.current) return; // StrictMode 이중 마운트 방지
    mountedOnceRef.current = true;

    const connectWebSocket = async () => {
      if (!authSnap.accessToken) {
        console.log("토큰이 없어 WebSocket 연결을 시도하지 않습니다.");
        return;
      }

      // 쿨다운 체크
      const now = Date.now();
      if (
        now - lastConnectionAttemptRef.current <
        connectionCooldownRef.current
      ) {
        console.log("연결 시도 쿨다운 중...");
        return;
      }

      // 이미 연결되어 있으면 무시
      if (webSocketService.isConnected()) {
        console.log("WebSocket이 이미 연결되어 있습니다.");
        return;
      }

      try {
        lastConnectionAttemptRef.current = now;
        connectionAttemptRef.current++;

        console.log(`HomePage에서 WebSocket 연결 시도 ${connectionAttemptRef.current}...`);
        await webSocketService.connect();
        console.log("HomePage에서 WebSocket 연결 성공");
      } catch (error) {
        console.error("HomePage에서 WebSocket 연결 실패:", error);
      }
    };

    // 컴포넌트 마운트 시 자동 연결
    connectWebSocket();

    // 컴포넌트 언마운트 시에도 연결은 유지 (앱 전체 생명주기)
    return () => {
      console.log("HomePage 언마운트 - WebSocket 연결은 유지");
      // 연결을 끊지 않고 그대로 유지
    };
  }, [authSnap.accessToken]);

  // 토큰 변경 시 재연결
  useEffect(() => {
    if (!mountedOnceRef.current) return; // 첫 마운트 시에는 무시

    if (authSnap.accessToken && !webSocketService.isConnected()) {
      console.log("토큰 변경 감지, WebSocket 재연결 시도...");
      const connectWebSocket = async () => {
        try {
          await webSocketService.connect();
          console.log("토큰 변경 후 WebSocket 재연결 성공");
        } catch (error) {
          console.error("토큰 변경 후 WebSocket 재연결 실패:", error);
        }
      };
      connectWebSocket();
    }
  }, [authSnap.accessToken]);

  return null; // 이 훅은 부작용만 있고 값을 반환하지 않음
};
