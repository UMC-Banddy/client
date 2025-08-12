import { useEffect } from "react";
import { authStore } from "@/store/authStore";
import webSocketService from "@/services/WebSocketService";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    // 앱 시작 시 localStorage에서 토큰 확인
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      // 토큰이 있으면 인증 상태 복원
      authStore.accessToken = accessToken;
      authStore.refreshToken = refreshToken;
      authStore.isAuthenticated = true;
      authStore.role = "USER";

      // 토큰 복원 직후 WS 연결 시도 (헤더 포함) - 전역에서 1회만
      webSocketService
        .connect()
        .catch((e) => console.warn("WS connect 실패(AuthProvider)", e));
    } else {
      // 토큰이 없으면 인증 상태 초기화
      authStore.accessToken = null;
      authStore.refreshToken = null;
      authStore.isAuthenticated = false;
      authStore.role = null;
    }
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
