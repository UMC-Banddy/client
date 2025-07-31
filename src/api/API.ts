import axios from "axios";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";

// 아티스트 타입 정의
export interface Artist {
  id: number;
  spotifyId: string;
  name: string;
  genre: string;
  imageUrl: string;
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Survey 제출 데이터 타입 정의
export interface SurveyData {
  selectedArtists: string[];
  profileImage?: File;
  mediaFile?: File;
}

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
          `${import.meta.env.VITE_API_BASE_URL}${
            API_ENDPOINTS.AUTH.REFRESH_TOKEN
          }`,
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

// 아티스트 관련 API 함수들
export const artistAPI = {
  // 아티스트 목록 조회
  getArtists: async (): Promise<Artist[]> => {
    try {
      const response = await API.get(API_ENDPOINTS.SURVEY.ARTIST);
      return response.data;
    } catch (error) {
      console.error("아티스트 목록 조회 실패:", error);
      throw error;
    }
  },

  // 아티스트 검색
  searchArtists: async (query: string): Promise<Artist[]> => {
    try {
      const response = await API.get(
        `${API_ENDPOINTS.SURVEY.ARTIST_SEARCH}?query=${encodeURIComponent(
          query
        )}`
      );
      return response.data;
    } catch (error) {
      console.error("아티스트 검색 실패:", error);
      throw error;
    }
  },
};

// Survey 관련 API 함수들
export const surveyAPI = {
  // Survey 제출
  submitSurvey: async (data: SurveyData): Promise<void> => {
    try {
      const formData = new FormData();

      // 선택된 아티스트 ID들을 JSON 문자열로 변환하여 추가
      formData.append("selectedArtists", JSON.stringify(data.selectedArtists));

      // 파일이 있는 경우에만 추가
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      if (data.mediaFile) {
        formData.append("mediaFile", data.mediaFile);
      }

      const response = await API.post(API_ENDPOINTS.SURVEY.SUBMIT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Survey 제출 실패:", error);
      throw error;
    }
  },
};
