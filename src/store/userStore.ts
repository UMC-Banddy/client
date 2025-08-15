import { proxy } from "valtio";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type { BandProfile, BandDetail } from "@/types/band";

interface User {
  id?: string;
  email?: string;
  nickname?: string;
  profileImage?: string;
  bio?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  user?: User | null;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  error?: string | null;
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
export const getBandProfile = async (
  bandId: string
): Promise<BandProfile | null> => {
  try {
    const response = await API.get(API_ENDPOINTS.BANDS.PROFILE(bandId));
    const data = response.data.result || response.data;
    return (data || {}) as BandProfile;
  } catch (error) {
    // HTTP 500 에러 등 서버 오류 시 null 반환하여 에러 전파 방지
    console.warn(`밴드 ${bandId} 프로필 조회 실패:`, error);
    return null; // 에러 대신 null 반환
  }
};

// 밴드 상세정보 조회 API
export const getBandDetail = async (
  bandId: string
): Promise<BandDetail | null> => {
  try {
    const response = await API.get(API_ENDPOINTS.BANDS.DETAIL(bandId));
    const data = response.data.result || response.data;
    return data as BandDetail;
  } catch (error) {
    // HTTP 500 에러 등 서버 오류 시 null 반환하여 에러 전파 방지
    console.warn(`밴드 ${bandId} 상세정보 조회 실패:`, error);
    return null; // 에러 대신 null 반환
  }
};

// 추천 밴드 목록 조회 API (홈페이지용)
export const getRecommendedBands = async () => {
  try {
    // 먼저 similar API를 통해 실제 존재하는 밴드들을 가져옴
    try {
      const [tracksRes] = await Promise.all([
        API.get(API_ENDPOINTS.TRACKS.SIMILAR),
        API.get(API_ENDPOINTS.ARTISTS.SIMILAR),
      ]);

      // similar API에서 밴드 프로필 정보를 직접 제공하는 경우
      if (
        tracksRes.data &&
        Array.isArray(tracksRes.data) &&
        tracksRes.data.length > 0
      ) {
        const similarProfiles = tracksRes.data
          .filter(
            (track: { bandId?: number; bandProfile?: unknown }) =>
              track.bandId || track.bandProfile
          )
          .map(
            (track: {
              bandId?: number;
              bandProfile?: unknown;
              bandName?: string;
              profileImageUrl?: string;
            }) => {
              // API 응답 구조에 따라 적절히 매핑
              if (track.bandProfile) {
                return track.bandProfile;
              } else if (track.bandId) {
                // bandId만 있다면 기본 프로필 구조로 변환
                return {
                  bandId: track.bandId,
                  bandName: track.bandName || `밴드 ${track.bandId}`,
                  profileImageUrl: track.profileImageUrl || null,
                  // 기타 필요한 필드들...
                };
              }
              return null;
            }
          )
          .filter(Boolean);

        if (similarProfiles.length > 0) {
          return similarProfiles;
        }
      }

      // similar API에서 프로필을 직접 제공하지 않는 경우, 상세 정보 조회
      const similarBandIds =
        tracksRes.data
          ?.filter((track: { bandId?: number }) => track.bandId)
          ?.map((track: { bandId?: number }) => track.bandId)
          ?.slice(0, 10) || [];

      if (similarBandIds.length > 0) {
        const validProfiles = [];
        for (const id of similarBandIds) {
          try {
            const profile = await getBandProfile(String(id));
            if (profile) {
              validProfiles.push(profile);
            }
          } catch (error: unknown) {
            // 에러 로그만 남김
            console.warn(`Similar 밴드 ${id} 프로필 조회 실패:`, error);
            continue;
          }
        }

        if (validProfiles.length > 0) {
          return validProfiles;
        }
      }

      throw new Error("Similar API에서 유효한 밴드 정보를 찾을 수 없음");
    } catch {
      // Similar API가 실패하면 fallback으로 기본 ID 시도 (최소한으로만)
      const fallbackBandIds = ["1", "2", "3", "4", "5"];
      const validProfiles = [];

      for (const id of fallbackBandIds) {
        try {
          const profile = await getBandProfile(id);
          if (profile) {
            validProfiles.push(profile);
          }
        } catch (error: unknown) {
          // 에러 로그만 남김
          console.warn(`Fallback 밴드 ${id} 조회 실패:`, error);
          continue;
        }
      }

      return validProfiles;
    }
  } catch {
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
    const response = await API.get(API_ENDPOINTS.BANDS.MEMBERS(bandId));
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
    const response = await API.get(API_ENDPOINTS.BANDS.TRACKS(bandId));
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
    const response = await API.get(API_ENDPOINTS.BANDS.ARTISTS(bandId));
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
    const response = await API.get(API_ENDPOINTS.BANDS.LIST);
    return response.data;
  } catch (error) {
    // 404 에러 등은 정상적인 상황이므로 warn으로 처리
    const status = (error as any)?.response?.status;
    if (status === 404) {
      console.warn("모든 밴드 목록 API가 존재하지 않습니다 (404)");
    } else {
      console.warn("모든 밴드 목록 조회 실패:", error);
    }
    // 에러 발생 시 빈 배열 반환하여 앱 중단 방지
    return { result: [], isSuccess: false, message: "API not available" };
  }
};

// 추천 밴드 목록 조회 API
// 사용 중단: 서버에 엔드포인트가 없어 호출하지 않음

// 대체 추천 소스: 비슷한 트랙/아티스트로 추천 카드(프로필 호환) 구성
export const getRecommendedFromSimilar = async (): Promise<BandProfile[]> => {
  try {
    const [tracksRes, artistsRes] = await Promise.all([
      API.get(API_ENDPOINTS.TRACKS.SIMILAR),
      API.get(API_ENDPOINTS.ARTISTS.SIMILAR),
    ]);

    const tracks: Array<{
      title?: string;
      artist?: string;
      imageUrl?: string;
    }> = Array.isArray(tracksRes.data) ? tracksRes.data : [];
    const artists: Array<{ name?: string; imageUrl?: string }> = Array.isArray(
      artistsRes.data
    )
      ? artistsRes.data
      : [];

    const maxLen = Math.max(tracks.length, artists.length, 0);
    const result: BandProfile[] = [];

    for (let i = 0; i < maxLen; i += 1) {
      const t = tracks[i];
      const a = artists[i];
      result.push({
        goalTracks: t
          ? [
              {
                title: t.title || "",
                artist: t.artist || "",
                imageUrl: t.imageUrl || "",
              },
            ]
          : [],
        preferredArtists: a
          ? [
              {
                name: a.name || "",
                imageUrl: a.imageUrl || "",
              },
            ]
          : [],
        composition: undefined,
        sns: [],
        sessions: [],
        jobs: [],
      });
    }

    return result;
  } catch (error: unknown) {
    console.error("대체 추천(유사 트랙/아티스트) 구성 실패:", error);
    return [];
  }
};

// 선택적 보강: similar로 걸러진 밴드들의 상세 정보만 조회하여 카드 타이틀/이미지에 반영
export const probeSomeBandDetails = async (options?: {
  limit?: number;
  candidateIds?: number[];
}): Promise<BandDetail[]> => {
  const limit = options?.limit ?? 5;
  const results: BandDetail[] = [];

  // 사전테스트 중에는 API 호출 최소화
  if (window.location.pathname.startsWith("/pre-test")) {
    return results;
  }

  try {
    // similar API를 통해 실제 존재하는 밴드 ID들을 가져옴
    const [tracksRes, artistsRes] = await Promise.all([
      API.get(API_ENDPOINTS.TRACKS.SIMILAR),
      API.get(API_ENDPOINTS.ARTISTS.SIMILAR),
    ]);

    // similar API 결과에서 밴드 ID 추출
    let similarBandIds: number[] = [];

    // tracksRes.data에서 bandId 필드가 있다면 추출
    if (tracksRes.data && Array.isArray(tracksRes.data)) {
      similarBandIds = tracksRes.data
        .filter(
          (track: { bandId?: number }): track is { bandId: number } =>
            track.bandId !== undefined && typeof track.bandId === "number"
        )
        .map((track: { bandId: number }) => track.bandId);
    }

    // artistsRes.data에서도 bandId 추출 시도
    if (artistsRes.data && Array.isArray(artistsRes.data)) {
      const artistBandIds = artistsRes.data
        .filter(
          (artist: { bandId?: number }): artist is { bandId: number } =>
            artist.bandId !== undefined && typeof artist.bandId === "number"
        )
        .map((artist: { bandId: number }) => artist.bandId);

      // 중복 제거하면서 합치기
      similarBandIds = [...new Set([...similarBandIds, ...artistBandIds])];
    }

    // similar API에서 밴드 ID를 제공하지 않는다면, 기존 candidateIds 사용
    if (similarBandIds.length === 0) {
      similarBandIds = options?.candidateIds ?? [1, 2, 3, 4, 5];
    }

    // ID 개수 제한 (너무 많은 API 호출 방지)
    const maxIdsToCheck = Math.min(limit * 2, 20);
    similarBandIds = similarBandIds.slice(0, maxIdsToCheck);

    // similar로 걸러진 밴드들만 상세 정보 조회 (병렬 처리로 성능 향상)
    const detailPromises = similarBandIds.map(async (id) => {
      try {
        const detail = await getBandDetail(String(id));
        return detail && detail.bandName ? detail : null;
      } catch (error) {
        // 에러 로그만 남김
        console.warn(`밴드 ${id} 조회 실패:`, error);
        return null;
      }
    });

    // 병렬로 모든 요청 처리
    const detailResults = await Promise.all(detailPromises);
    const validDetails = detailResults.filter(Boolean) as BandDetail[];

    // 결과 개수 제한
    results.push(...validDetails.slice(0, limit));
  } catch (error) {
    // Similar API 실패 시 fallback으로 기본 ID 사용
    const fallbackIds = options?.candidateIds ?? [1, 2, 3, 4, 5];

    for (const id of fallbackIds) {
      if (results.length >= limit) break;

      try {
        const detail = await getBandDetail(String(id));
        if (detail && detail.bandName) {
          results.push(detail);
        }
      } catch (error) {
        // 에러 로그만 남김
        console.warn(`Fallback 밴드 ${id} 조회 실패:`, error);
        continue;
      }
    }
  }

  return results;
};
