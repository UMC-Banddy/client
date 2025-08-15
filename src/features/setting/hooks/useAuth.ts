//로그아웃 등 유틸

import { authStore } from "@/store/authStore";
import { clearAuthState } from "@/shared/utils/authCleanup";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

export const logout = () => {
  // 이메일/비밀번호 입력 상태는 별도 관리라면 초기화 유지, 여기서는 토큰/상태만 정리
  clearAuthState({ redirectTo: "/login" });
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Refresh token 없음");

  const res = await API.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refreshToken,
  });

  const newAccessToken = res.data.accessToken;
  localStorage.setItem("accessToken", newAccessToken);
  authStore.accessToken = newAccessToken;
  authStore.isAuthenticated = true;

  return newAccessToken;
};

