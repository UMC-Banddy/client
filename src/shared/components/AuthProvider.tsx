import { useEffect } from "react";
import { authStore } from "@/store/authStore";

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
