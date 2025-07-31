import { proxy } from "valtio";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";

interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const userStore = proxy<UserState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

// Actions
export const userActions = {
  setUser: (user: User) => {
    userStore.user = user;
    userStore.isAuthenticated = true;
    userStore.error = null;
  },

  clearUser: () => {
    userStore.user = null;
    userStore.isAuthenticated = false;
    userStore.error = null;
  },

  setLoading: (isLoading: boolean) => {
    userStore.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    userStore.error = error;
  },

  updateProfile: (updates: Partial<User>) => {
    if (userStore.user) {
      userStore.user = { ...userStore.user, ...updates };
    }
  },
};

// 상대방 프로필 조회 API
export const getOtherProfile = async (memberId: string) => {
  try {
    if (import.meta.env.DEV) {
      console.log("상대방 프로필 조회 요청:", {
        url: API_ENDPOINTS.PROFILE.OTHER(memberId),
        memberId,
      });
    }

    const response = await API.get(API_ENDPOINTS.PROFILE.OTHER(memberId));

    if (import.meta.env.DEV) {
      console.log("상대방 프로필 조회 성공:", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("상대방 프로필 조회 실패:", error);
    throw error;
  }
};

// 상대방 저장한 곡 조회 API
export const getOtherSavedTracks = async (memberId: string) => {
  try {
    const response = await API.get(
      API_ENDPOINTS.PROFILE.OTHER_TRACKS(memberId)
    );
    return response.data;
  } catch (error) {
    console.error("상대방 저장 곡 조회 실패:", error);
    throw error;
  }
};

// 상대방 태그 조회 API
export const getOtherTags = async (memberId: string) => {
  try {
    const response = await API.get(API_ENDPOINTS.PROFILE.OTHER_TAGS(memberId));
    return response.data;
  } catch (error) {
    console.error("상대방 태그 조회 실패:", error);
    throw error;
  }
};

// 여러 사용자 프로필 조회 API (홈페이지 캐러셀용)
export const getMultipleProfiles = async (memberIds: string[]) => {
  try {
    if (import.meta.env.DEV) {
      console.log("여러 사용자 프로필 조회 요청:", memberIds);
    }

    // 병렬로 여러 프로필 조회
    const promises = memberIds.map((id) => getOtherProfile(id));
    const results = await Promise.all(promises);

    if (import.meta.env.DEV) {
      console.log("여러 사용자 프로필 조회 성공:", results);
    }

    return results;
  } catch (error) {
    console.error("여러 사용자 프로필 조회 실패:", error);
    throw error;
  }
};

// 추천 사용자 목록 조회 API (홈페이지용)
export const getRecommendedProfiles = async () => {
  try {
    if (import.meta.env.DEV) {
      console.log("추천 사용자 목록 조회 요청");
    }

    // TODO: 실제 추천 API 엔드포인트로 변경
    // const response = await API.get("/api/recommendations/profiles");
    // return response.data;

    // 임시로 하드코딩된 사용자 ID들 사용
    const recommendedMemberIds = ["12", "13", "14"]; // 실제 API에서 받아올 ID들
    const profiles = await getMultipleProfiles(recommendedMemberIds);

    if (import.meta.env.DEV) {
      console.log("추천 사용자 목록 조회 성공:", profiles);
    }

    return profiles;
  } catch (error) {
    console.error("추천 사용자 목록 조회 실패:", error);
    throw error;
  }
};

// 밴드 프로필 조회 API
export const getBandProfile = async (bandId: string) => {
  try {
    if (import.meta.env.DEV) {
      console.log("밴드 프로필 조회 요청:", {
        url: API_ENDPOINTS.BANDS.PROFILE(bandId),
        bandId,
      });
    }

    const response = await API.get(API_ENDPOINTS.BANDS.PROFILE(bandId));

    if (import.meta.env.DEV) {
      console.log("밴드 프로필 조회 성공:", response.data);
    }

    // API 응답 구조에 따라 result 필드에서 데이터 추출
    return response.data.result || response.data;
  } catch (error) {
    console.error("밴드 프로필 조회 실패:", error);
    throw error;
  }
};

// 밴드 상세정보 조회 API
export const getBandDetail = async (bandId: string) => {
  try {
    if (import.meta.env.DEV) {
      console.log("밴드 상세정보 조회 요청:", {
        url: API_ENDPOINTS.BANDS.DETAIL(bandId),
        bandId,
      });
    }

    const response = await API.get(API_ENDPOINTS.BANDS.DETAIL(bandId));

    if (import.meta.env.DEV) {
      console.log("밴드 상세정보 조회 성공:", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("밴드 상세정보 조회 실패:", error);
    throw error;
  }
};

// 추천 밴드 목록 조회 API (홈페이지용)
export const getRecommendedBands = async () => {
  try {
    if (import.meta.env.DEV) {
      console.log("추천 밴드 목록 조회 요청");
    }

    // 먼저 백엔드 추천 API 시도
    try {
      const response = await getRecommendedBandsFromAPI();
      if (import.meta.env.DEV) {
        console.log("백엔드 추천 API 성공:", response);
      }
      return response;
    } catch (apiError: unknown) {
      if (import.meta.env.DEV) {
        console.log(
          "백엔드 추천 API 실패, fallback 방식 사용:",
          (apiError as Error).message
        );
      }

      // 백엔드 API가 없으면 fallback으로 여러 ID 시도
      const possibleBandIds = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
      ];

      const validProfiles = [];

      // 순차적으로 처리하여 404 에러를 적절히 처리
      for (const id of possibleBandIds) {
        try {
          const profile = await getBandProfile(id);
          validProfiles.push(profile);
          if (import.meta.env.DEV) {
            console.log(`밴드 ${id} 조회 성공`);
          }
        } catch (error: unknown) {
          // 모든 에러를 무시하고 계속 진행
          if (import.meta.env.DEV) {
            console.log(
              `밴드 ${id} 조회 실패 (무시됨):`,
              (error as Error).message
            );
          }
          continue;
        }
      }

      if (import.meta.env.DEV) {
        console.log("Fallback 방식으로 조회 성공:", validProfiles);
      }

      // 최소한 하나의 밴드라도 있으면 반환, 없으면 빈 배열 반환
      return validProfiles;
    }
  } catch (error) {
    console.error("추천 밴드 목록 조회 실패:", error);
    // 최종 에러 시에도 빈 배열 반환하여 앱이 중단되지 않도록 함
    return [];
  }
};

// 밴드 상세 정보 조회 API 함수들
export const getBandMembers = async (bandId: string) => {
  try {
    if (import.meta.env.DEV) {
      console.log("밴드 멤버 조회 요청:", { bandId });
    }
    const response = await API.get(`/api/band/${bandId}/members`);
    if (import.meta.env.DEV) {
      console.log("밴드 멤버 조회 성공:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("밴드 멤버 조회 실패:", error);
    throw error;
  }
};

export const getBandTracks = async (bandId: string) => {
  try {
    if (import.meta.env.DEV) {
      console.log("밴드 곡 목록 조회 요청:", { bandId });
    }
    const response = await API.get(`/api/band/${bandId}/tracks`);
    if (import.meta.env.DEV) {
      console.log("밴드 곡 목록 조회 성공:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("밴드 곡 목록 조회 실패:", error);
    throw error;
  }
};

export const getBandArtists = async (bandId: string) => {
  try {
    if (import.meta.env.DEV) {
      console.log("밴드 선호 아티스트 조회 요청:", { bandId });
    }
    const response = await API.get(`/api/band/${bandId}/artists`);
    if (import.meta.env.DEV) {
      console.log("밴드 선호 아티스트 조회 성공:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("밴드 선호 아티스트 조회 실패:", error);
    throw error;
  }
};

// 모든 밴드 목록 조회 API
export const getAllBands = async () => {
  try {
    if (import.meta.env.DEV) {
      console.log("모든 밴드 목록 조회 요청");
    }
    const response = await API.get(API_ENDPOINTS.BANDS.LIST);
    if (import.meta.env.DEV) {
      console.log("모든 밴드 목록 조회 성공:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("모든 밴드 목록 조회 실패:", error);
    throw error;
  }
};

// 추천 밴드 목록 조회 API
export const getRecommendedBandsFromAPI = async () => {
  try {
    if (import.meta.env.DEV) {
      console.log("추천 밴드 목록 조회 요청");
    }
    const response = await API.get(API_ENDPOINTS.BANDS.RECOMMENDED);
    if (import.meta.env.DEV) {
      console.log("추천 밴드 목록 조회 성공:", response.data);
    }
    // API 응답 구조에 따라 result 필드에서 데이터 추출
    return response.data.result || response.data;
  } catch (error) {
    console.error("추천 밴드 목록 조회 실패:", error);
    throw error;
  }
};
