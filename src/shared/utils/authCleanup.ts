import { authStore } from "@/store/authStore";
import webSocketService from "@/services/WebSocketService";

export interface ClearAuthOptions {
  /** 토큰 제거 후 이동할 경로 (지정 시 즉시 location 이동) */
  redirectTo?: string;
  /** WebSocket 연결도 함께 종료할지 여부 (기본값: true) */
  disconnectWs?: boolean;
}

/**
 * 인증 상태와 저장된 토큰을 안전하게 제거합니다.
 * - localStorage: accessToken, refreshToken, memberId 제거
 * - authStore: 상태 초기화
 * - WebSocket: 기본적으로 연결 종료
 * - 옵션 전달 시 특정 경로로 리다이렉트
 */
export function clearAuthState(options: ClearAuthOptions = {}): void {
  const { redirectTo, disconnectWs = true } = options;

  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("memberId");
  } catch {
    // storage 접근 실패는 무시
  }

  authStore.accessToken = null;
  authStore.refreshToken = null;
  authStore.isAuthenticated = false;
  authStore.role = null;

  if (disconnectWs) {
    try {
      webSocketService.disconnect();
    } catch {
      // 연결 종료 중 오류는 무시
    }
  }

  if (redirectTo) {
    try {
      window.location.href = redirectTo;
    } catch {
      // SSR 등 환경에서는 무시
    }
  }
}

/**
 * refreshToken 만료/무효 감지 시 호출하는 헬퍼.
 * 기본적으로 리다이렉트는 하지 않고, 재사용성을 위해 토큰 정리만 수행합니다.
 */
export function handleRefreshTokenExpired(): void {
  clearAuthState({ disconnectWs: true });
}


