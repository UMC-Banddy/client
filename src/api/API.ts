
import axios from "axios";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";

// Axios 인스턴스 생성
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: accessToken 있으면 헤더에 자동 추가
API.interceptors.request.use((config) => {
  const token = authStore.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 재발급 시도
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 + retry 방지 플래그
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authStore.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {
            refreshToken: authStore.refreshToken,
          }
        );

        const newAccessToken = res.data.accessToken;
        authStore.accessToken = newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // 새로운 accessToken으로 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패", refreshError);
        authStore.accessToken = null;
        authStore.refreshToken = null;
        authStore.isAuthenticated = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
