//로그아웃 등 유틸

import { authStore } from "@/store/authStore";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("memberId");

  authStore.accessToken = null;
  authStore.refreshToken = null;
  authStore.isAuthenticated = false;
  authStore.role = null;
  authStore.email = "";
  authStore.password = "";

  // 로그아웃 후 로그인 페이지로 리다이렉트
  window.location.href = "/login";
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

