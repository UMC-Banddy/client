import axios from "axios";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { handleRefreshTokenExpired } from "@/shared/utils/authCleanup";

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

// 사전 테스트 키워드 타입
export interface SurveyKeywordItem {
  id: number;
  content: string;
}

export type SurveyKeywordMap = Record<string, SurveyKeywordItem[]>;

// 사전 테스트 장르 타입
export interface Genre {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
}

// Survey 제출 데이터 타입 정의
export interface SurveyData {
  selectedArtists: string[];
  profileImage?: File;
  mediaFile?: File;
}

// Session 타입 정의 (API 응답)
export interface Session {
  id: number;
  name: string;
}

// Session with levels (UI용)
export interface SessionWithLevels {
  id: string;
  name: string;
  levels?: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }[];
}

// Session 선택 데이터 타입 정의
export interface SessionData {
  selectedSessions: Record<string, string>; // sessionId: levelId
}

// 음악 검색 결과 타입 정의
export interface MusicSearchResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  imageUrl?: string;
  type: "track" | "artist" | "album";
}

// API 문서에 따른 아티스트 검색 결과 타입
export interface ArtistSearchResult {
  spotifyId: string;
  name: string;
  genres: string;
  imageUrl: string;
  externalUrl: string;
}

// 자동완성 결과 타입 정의
export interface AutocompleteResult {
  id: string;
  name: string;
  type: "track" | "artist" | "album";
  imageUrl?: string;
}

// API 응답 타입 정의
export interface AutocompleteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    results: string[];
  };
}

// Axios 인스턴스 생성
const viteEnv =
  (import.meta as unknown as { env?: Record<string, string | undefined> })
    .env || {};
export const API = axios.create({
  baseURL: viteEnv.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: accessToken 있으면 헤더에 자동 추가
API.interceptors.request.use((config) => {
  const token = authStore.accessToken;

  // 사전테스트 관련 API는 토큰이 없어도 호출 가능 (아이디 기반 저장)
  const isPretestAPI =
    config.url?.includes("/member/survey") ||
    config.url?.includes("/member/check-nickname");

  if (token && !isPretestAPI) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 재발급 시도
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // refreshToken 엔드포인트에서의 401은 재시도 금지 (무한 루프 방지)
    const requestUrl: string = originalRequest?.url || "";
    const isRefreshEndpoint = requestUrl.includes(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN
    );
    if (isRefreshEndpoint) {
      return Promise.reject(error);
    }

    // accessToken 만료 + retry 방지 플래그
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authStore.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        // 공용 인스턴스(API)가 아닌 별도 axios로 호출하여 인터셉터 재귀 방지
        const apiBase = import.meta.env.VITE_API_BASE_URL || "";
        const refreshUrl = apiBase
          ? `${apiBase}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`
          : API_ENDPOINTS.AUTH.REFRESH_TOKEN;
        const res = await axios.post(refreshUrl, {
          refreshToken: authStore.refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        authStore.accessToken = newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // 새로운 accessToken으로 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패", refreshError);
        // refreshToken 만료/무효 시 전역 정리
        handleRefreshTokenExpired();
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
  searchArtists: async (keyword: string): Promise<Artist[]> => {
    try {
      const response = await API.get(
        `${API_ENDPOINTS.SURVEY.ARTIST_SEARCH}?keyword=${encodeURIComponent(
          keyword
        )}`
      );
      return response.data;
    } catch (error) {
      console.error("아티스트 검색 실패:", error);
      throw error;
    }
  },
};

// 음악 검색 관련 API 함수들
export const musicAPI = {
  // 전체 음악 검색 (SEARCH_ALL 엔드포인트 사용)
  searchAll: async (
    query: string = "",
    limit: number = 20,
    offset: number = 0
  ): Promise<ArtistSearchResult[]> => {
    try {
      // 빈 쿼리인 경우 기본 검색어 사용
      const searchQuery = query.trim() || "artist";

      const response = await API.get(
        `${API_ENDPOINTS.MUSIC.SEARCH_ALL}?q=${encodeURIComponent(
          searchQuery
        )}&limit=${limit}&offset=${offset}`
      );

      // API 문서에 따른 응답 구조 처리
      if (response.data && response.data.isSuccess && response.data.result) {
        return response.data.result;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn("예상치 못한 API 응답 구조:", response.data);
        return [];
      }
    } catch (error) {
      console.error("전체 음악 검색 실패:", error);
      // 에러 발생 시 빈 배열 반환하여 앱이 중단되지 않도록 함
      return [];
    }
  },

  // 아티스트 검색
  searchArtists: async (
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<MusicSearchResult[]> => {
    try {
      const response = await API.get(
        `${API_ENDPOINTS.MUSIC.SEARCH_ARTISTS}?q=${encodeURIComponent(
          query
        )}&limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      console.error("아티스트 검색 실패:", error);
      throw error;
    }
  },

  // 자동완성
  getAutocomplete: async (
    query: string,
    limit: number = 20
  ): Promise<AutocompleteResult[]> => {
    try {
      const response = await API.get<AutocompleteResponse>(
        `${API_ENDPOINTS.MUSIC.AUTOCOMPLETE_ARTISTS}?query=${encodeURIComponent(
          query
        )}&limit=${limit}`
      );

      // API 응답 구조에 맞게 변환
      const results = response.data.result.results;
      return results.map((name, index) => ({
        id: `artist-${index}`,
        name: name,
        type: "artist" as const,
        imageUrl: undefined,
      }));
    } catch (error) {
      console.error("자동완성 조회 실패:", error);
      throw error;
    }
  },
};

// 아티스트 저장 API 함수
export const artistSaveAPI = {
  // 아티스트 저장
  saveArtist: async (
    spotifyId: string
    // ): Promise<{ isSuccess: boolean; result: any }> => {
  ): Promise<{ isSuccess: boolean; result: unknown }> => {
    try {
      const response = await API.post(
        API_ENDPOINTS.ARTISTS.SAVE,
        {
          spotifyId: spotifyId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("아티스트 저장 실패:", error);
      throw error;
    }
  },
};

// 프로필 수정 API 함수
export const profileAPI = {
  // 프로필 조회
  // getProfile: async (): Promise<{ isSuccess: boolean; result: any }> => {
  getProfile: async (): Promise<{ isSuccess: boolean; result: unknown }> => {
    try {
      const response = await API.get(API_ENDPOINTS.PROFILE.SELF);
      return response.data;
    } catch (error: unknown) {
      console.error("프로필 조회 실패:", error);
      throw error;
    }
  },

  // 프로필 수정
  updateProfile: async (profileData: {
    nickname?: string;
    age?: number;
    gender?: string;
    region?: string;
    district?: string;
    bio?: string;
    profileImage?: string | FormData;
    mediaUrl?: string;
    availableSessions?: Array<{
      sessionType: string;
      level: string;
    }>;
    genres?: string[];
    artists?: string[];
    keywords?: string[];
    // }): Promise<{ isSuccess: boolean; result: any }> => {
  }): Promise<{ isSuccess: boolean; result: unknown }> => {
    try {
      // FormData인 경우와 일반 데이터인 경우를 구분
      const isFormData = profileData.profileImage instanceof FormData;

      // profileImage가 FormData인 경우 별도 처리
      if (isFormData) {
        const response = await API.put(
          API_ENDPOINTS.PROFILE.UPDATE,
          profileData.profileImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } else {
        // profileImage가 문자열이거나 없는 경우 JSON으로 전송
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profileImage: _, ...jsonData } = profileData;

        // 최소 전송 규칙: 빈 문자열/빈 배열/undefined/null 제거 + 세션/레벨 정규화
        const sessionTypeMapping: Record<string, string> = {
          "🎤 보컬 🎤": "vocal",
          보컬: "vocal",
          "🎸 일렉 기타 🎸": "electric_guitar",
          "일렉 기타": "electric_guitar",
          "🪕 어쿠스틱 기타 🪕": "acoustic_guitar",
          "어쿠스틱 기타": "acoustic_guitar",
          "🎵 베이스 🎵": "bass",
          베이스: "bass",
          "🥁 드럼 🥁": "drums",
          드럼: "drums",
          "🎹 키보드 🎹": "keyboard",
          키보드: "keyboard",
          "🎻 바이올린 🎻": "violin",
          바이올린: "violin",
          "🎺 트럼펫 🎺": "trumpet",
          트럼펫: "trumpet",
        };

        type Updatable = typeof jsonData & {
          availableSessions?: Array<{ sessionType: string; level: string }>;
        };

        const sanitizePayload = (data: Updatable) => {
          const result: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(data)) {
            if (value === undefined || value === null) continue;
            if (typeof value === "string" && value.trim() === "") continue;
            if (Array.isArray(value) && value.length === 0) continue;

            if (key === "availableSessions" && Array.isArray(value)) {
              const normalized = (
                value as Array<{ sessionType: string; level: string }>
              )
                .map((item) => ({
                  sessionType:
                    sessionTypeMapping[item.sessionType] ?? item.sessionType,
                  level: (item.level || "").toUpperCase(),
                }))
                .filter(
                  (item) =>
                    item.sessionType && item.level && item.level.length > 0
                );
              if (normalized.length > 0) {
                result[key] = normalized;
              }
              continue;
            }

            result[key] = value;
          }
          return result;
        };

        const sanitized = sanitizePayload(jsonData as Updatable);

        const response = await API.put(
          API_ENDPOINTS.PROFILE.UPDATE,
          sanitized,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      }
    } catch (error: unknown) {
      console.error("프로필 수정 실패:", error);
      throw error;
    }
  },
};

// Survey 관련 API 함수들
export const surveyAPI = {
  // Survey 제출 (아이디 기반 저장 지원)
  submitSurvey: async (data: SurveyData, memberId?: string): Promise<void> => {
    try {
      // memberId가 있으면 아이디 기반 저장, 없으면 토큰 기반 저장
      const requestData = {
        selectedArtists: data.selectedArtists,
        ...(memberId && { memberId }), // memberId가 있으면 포함
      };

      // 파일이 있는 경우에만 FormData 사용, 없으면 JSON 사용
      if (data.profileImage || data.mediaFile) {
        const formData = new FormData();

        console.log("Survey 제출 데이터 (FormData):", requestData);
        formData.append("request", JSON.stringify(requestData));

        // 파일이 있는 경우에만 추가
        if (data.profileImage) {
          formData.append("profileImage", data.profileImage);
        }

        if (data.mediaFile) {
          formData.append("mediaFile", data.mediaFile);
        }

        console.log("FormData 내용:");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await API.post(API_ENDPOINTS.SURVEY.SUBMIT, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      } else {
        // 파일이 없으면 JSON 형식으로 전송
        console.log("Survey 제출 데이터 (JSON):", requestData);

        const response = await API.post(
          API_ENDPOINTS.SURVEY.SUBMIT,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      }
    } catch (error: unknown) {
      console.error("Survey 제출 실패:", error);
      console.error("에러 상세 정보:", (error as AxiosError).response?.data);
      throw error;
    }
  },

  // Session 목록 조회
  getSessions: async (): Promise<Session[]> => {
    try {
      const response = await API.get(API_ENDPOINTS.SURVEY.SESSION);
      return response.data;
    } catch (error) {
      console.error("Session 목록 조회 실패:", error);
      throw error;
    }
  },

  // 카테고리별 키워드 전체 조회
  getKeywords: async (): Promise<SurveyKeywordMap> => {
    try {
      const response = await API.get(API_ENDPOINTS.SURVEY.KEYWORD);
      return response.data;
    } catch (error) {
      console.error("키워드 목록 조회 실패:", error);
      throw error;
    }
  },

  // 사전 테스트 장르 전체 조회
  getGenres: async (): Promise<Genre[]> => {
    try {
      const response = await API.get(API_ENDPOINTS.SURVEY.GENRE);
      return response.data;
    } catch (error) {
      console.error("장르 목록 조회 실패:", error);
      throw error;
    }
  },

  // 사전 테스트 장르 키워드 검색
  searchGenres: async (keyword: string): Promise<Genre[]> => {
    try {
      const response = await API.get(
        `${API_ENDPOINTS.SURVEY.GENRE_SEARCH}?keyword=${encodeURIComponent(
          keyword
        )}`
      );
      return response.data;
    } catch (error) {
      console.error("장르 검색 실패:", error);
      throw error;
    }
  },

  // Session 데이터 제출 (아이디 기반 저장 지원)
  submitSessionData: async (
    data: SessionData,
    memberId?: string
  ): Promise<void> => {
    try {
      const formData = new FormData();

      // memberId가 있으면 아이디 기반 저장, 없으면 토큰 기반 저장
      const requestData = {
        selectedSessions: data.selectedSessions,
        ...(memberId && { memberId }), // memberId가 있으면 포함
      };
      formData.append("request", JSON.stringify(requestData));

      const response = await API.post(API_ENDPOINTS.SURVEY.SUBMIT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Session 데이터 제출 실패:", error);
      throw error;
    }
  },
};
