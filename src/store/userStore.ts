import { proxy } from "valtio";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import type { BandProfile, BandDetail, BandRecruitDetail } from "@/types/band";

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
    if (import.meta.env.DEV) {
      console.log(`밴드 ${bandId} 상세정보 조회 시작`);
    }

    const response = await API.get(API_ENDPOINTS.BANDS.DETAIL(bandId));
    const data = response.data.result || response.data;

    if (import.meta.env.DEV) {
      console.log(`밴드 ${bandId} 상세정보 조회 성공:`, data);
    }

    return data as BandDetail;
  } catch (error) {
    // HTTP 500 에러 등 서버 오류 시 null 반환하여 에러 전파 방지
    if (import.meta.env.DEV) {
      // axios 오류 형태를 안전하게 추출
      type MaybeAxiosError = {
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown;
        };
        message?: string;
      };
      const e = error as MaybeAxiosError;
      console.error(`밴드 ${bandId} 상세정보 조회 실패:`, {
        bandId,
        error,
        status: e?.response?.status,
        statusText: e?.response?.statusText,
        data: e?.response?.data,
        message: e?.message,
      });
    } else {
      console.warn(`밴드 ${bandId} 상세정보 조회 실패:`, error);
    }
    return null; // 에러 대신 null 반환
  }
};

// 신규 상세 스펙(모집 공고) 조회 API
export const getBandRecruitDetail = async (
  bandId: string
): Promise<{
  isSuccess: boolean;
  result: BandRecruitDetail | null;
  message?: string;
} | null> => {
  try {
    const res = await API.get(API_ENDPOINTS.RECRUITMENT.DETAIL(bandId));
    const isSuccess: boolean = Boolean(res?.data?.isSuccess ?? true);
    const result = (res.data?.result ||
      null) as Partial<BandRecruitDetail> | null;
    const message = (res?.data?.message as string | undefined) ?? undefined;
    return {
      isSuccess,
      result: (result || null) as BandRecruitDetail | null,
      message,
    };
  } catch (error) {
    console.warn("밴드 모집 상세 조회 실패:", { bandId, error });
    return null;
  }
};

// 홈 전용: 리쿠르팅 목록 캐시 (간단 TTL 캐시)
let recruitingListCache: {
  expiresAt: number;
  data: Array<Record<string, unknown>>;
} | null = null;

export const getRecruitingBandSummaries = async (options?: {
  page?: number;
  size?: number;
  useCache?: boolean;
  cacheMs?: number;
  includeBandIds?: number[]; // 추가 포함 대상(보장 노출)
}): Promise<Array<Record<string, unknown>>> => {
  const page = options?.page ?? 0;
  const size = options?.size ?? 40;
  const useCache = options?.useCache !== false;
  const cacheMs = options?.cacheMs ?? 60 * 1000;
  const includeBandIds = Array.isArray(options?.includeBandIds)
    ? Array.from(new Set(options!.includeBandIds!))
    : [];

  if (
    useCache &&
    recruitingListCache &&
    recruitingListCache.expiresAt > Date.now()
  ) {
    return recruitingListCache.data;
  }

  const normalize = (item: Record<string, unknown>) => ({
    bandId: Number(item?.bandId ?? item?.id ?? 0) || undefined,
    name: item?.name ?? item?.bandName ?? undefined,
    description: item?.description ?? undefined,
    profileImageUrl: item?.profileImageUrl ?? item?.imageUrl ?? undefined,
    sessions: Array.isArray(item?.sessions) ? (item.sessions as string[]) : [],
    artists: Array.isArray(item?.artists)
      ? (item.artists as Record<string, unknown>[])
      : [],
    tracks: Array.isArray(item?.tracks)
      ? (item.tracks as Record<string, unknown>[])
      : [],
    jobs: Array.isArray(item?.jobs) ? (item.jobs as string[]) : [],
    averageAge: item?.averageAge,
    maleCount: item?.maleCount,
    femaleCount: item?.femaleCount,
    representativeSongFile: item?.representativeSongFile ?? null,
    status: item?.status,
  });

  const viaIdsFallback = async () => {
    try {
      const idsBase = (await getRecruitingBandIds()) ?? [];
      const ids = Array.from(new Set([...includeBandIds, ...idsBase])).slice(
        0,
        size
      );
      const batchSize = 8;
      const results: Array<ReturnType<typeof normalize>> = [];
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (id) => {
            const recruitRes = await getBandRecruitDetail(String(id));
            const recruit = recruitRes?.result;
            if (recruitRes?.isSuccess && recruit?.status === "RECRUITING") {
              return normalize({ ...recruit, bandId: id });
            }
            return null;
          })
        );
        results.push(
          ...batchResults.filter(
            (item): item is ReturnType<typeof normalize> => item !== null
          )
        );
      }

      if (useCache) {
        recruitingListCache = {
          expiresAt: Date.now() + cacheMs,
          data: results,
        };
      }
      return results;
    } catch (e) {
      console.warn("리쿠르팅 목록 ID 폴백 실패:", e);
      return [];
    }
  };

  try {
    // 방법 1: /api/recruitments로 전체 목록 조회 시도
    try {
      const res = await API.get(API_ENDPOINTS.BANDS.RECRUIT, {
        params: { page, size },
      });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.result)
        ? res.data.result
        : [];

      if (Array.isArray(list) && list.length > 0) {
        // 서버에서 전체 목록을 가져온 경우
        const normalized = list.map(normalize);

        // includeBandIds를 서버 결과에 합치기(중복 제거)
        for (const mustId of includeBandIds) {
          const exists = normalized.some(
            (item) => Number(item.bandId) === Number(mustId)
          );
          if (!exists) {
            try {
              const recruitRes = await getBandRecruitDetail(String(mustId));
              const recruit = recruitRes?.result;
              if (recruitRes?.isSuccess && recruit?.status === "RECRUITING") {
                normalized.unshift(normalize({ ...recruit, bandId: mustId }));
              }
            } catch (error) {
              console.warn(`포함 밴드 ${mustId} 조회 실패:`, error);
            }
          }
        }

        if (useCache) {
          recruitingListCache = {
            expiresAt: Date.now() + cacheMs,
            data: normalized,
          };
        }
        return normalized;
      }
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { status?: number; data?: unknown };
      };
      console.warn(
        "전체 모집 공고 목록 조회 실패:",
        errorResponse?.response?.status,
        errorResponse?.response?.data
      );
    }

    // 방법 2: /api/bands로 전체 밴드 목록 조회 시도
    try {
      const res = await API.get(API_ENDPOINTS.BANDS.LIST, {
        params: { page, size },
      });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.result)
        ? res.data.result
        : [];

      if (Array.isArray(list) && list.length > 0) {
        // 서버에서 전체 밴드 목록을 가져온 경우
        let normalized = list
          .map(normalize)
          .filter((x) => !x.status || x.status === "RECRUITING");

        // includeBandIds 상단 합류
        for (const mustId of includeBandIds) {
          const exists = normalized.some(
            (item) => Number(item.bandId) === Number(mustId)
          );
          if (!exists) {
            try {
              const recruitRes = await getBandRecruitDetail(String(mustId));
              const recruit = recruitRes?.result;
              if (recruitRes?.isSuccess && recruit?.status === "RECRUITING") {
                normalized.unshift(normalize({ ...recruit, bandId: mustId }));
              }
            } catch (error) {
              console.warn(`상단 포함 밴드 ${mustId} 조회 실패:`, error);
            }
          }
        }

        normalized = normalized
          .filter(
            (v, i, arr) =>
              i === arr.findIndex((x) => x && x.bandId === v.bandId)
          )
          .slice(0, size);

        if (useCache) {
          recruitingListCache = {
            expiresAt: Date.now() + cacheMs,
            data: normalized,
          };
        }
        return normalized;
      }
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { status?: number; data?: unknown };
      };
      console.warn(
        "전체 밴드 목록 조회 실패:",
        errorResponse?.response?.status,
        errorResponse?.response?.data
      );
    }

    // 방법 3: includeBandIds가 있으면 해당 밴드들의 상세 정보를 조회
    if (includeBandIds.length > 0) {
      const results: Array<ReturnType<typeof normalize>> = [];
      for (const bandId of includeBandIds) {
        try {
          const recruitRes = await getBandRecruitDetail(String(bandId));
          const recruit = recruitRes?.result;
          if (recruitRes?.isSuccess && recruit?.status === "RECRUITING") {
            results.push(normalize({ ...recruit, bandId }));
          }
        } catch (error) {
          console.warn(`밴드 ${bandId} 상세 조회 실패:`, error);
        }
      }

      if (results.length > 0) {
        if (useCache) {
          recruitingListCache = {
            expiresAt: Date.now() + cacheMs,
            data: results,
          };
        }
        return results;
      }
    }

    // 방법 4: 모든 방법이 실패한 경우 최종 폴백
    return await viaIdsFallback();
  } catch (error: unknown) {
    // 401(인증 실패), 405(메서드 불허), 404(엔드포인트 없음) 등은 자연스럽게 폴백
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    if (status === 401) {
      console.warn(
        "리쿠르팅 목록 조회 인증 실패 (401):",
        (error as { response?: { data?: unknown } })?.response?.data
      );
      // 인증 실패 시 사용자에게 알림을 주거나 로그인 페이지로 리다이렉트할 수 있음
    } else if (status === 405 || status === 404) {
      console.warn(
        "리쿠르팅 목록 API 미지원 (405/404):",
        (error as { response?: { data?: unknown } })?.response?.data
      );
    } else {
      console.warn("리쿠르팅 목록 조회 실패:", error);
    }
    return await viaIdsFallback();
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

// 모집중 밴드 ID 조회 (재사용 가능):
// 1) 환경변수 VITE_RECRUITING_BAND_IDS="4,10,11" 우선 사용
// 2) 서버에 /api/recruitments?status=RECRUITING 지원 시 시도 (GET 미지원이면 무시)
// 3) 마지막으로 하드코딩된 임시 목록(운영 전환 시 제거)
export const getRecruitingBandIds = async (): Promise<number[]> => {
  // 1) ENV 우선
  const envIdsRaw = (import.meta as { env?: Record<string, unknown> })?.env
    ?.VITE_RECRUITING_BAND_IDS as string | undefined;
  if (typeof envIdsRaw === "string" && envIdsRaw.trim().length > 0) {
    return envIdsRaw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
  }

  // 2) 서버 목록 시도 - 여러 방법으로 시도
  try {
    // 방법 1: /api/recruitments로 전체 목록 조회 시도
    try {
      const res = await API.get(API_ENDPOINTS.BANDS.RECRUIT, {
        params: { page: 0, size: 1000 },
      });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.result)
        ? res.data.result
        : [];
      const ids = list
        .map((r: Record<string, unknown>) => Number(r?.bandId ?? r?.id))
        .filter((n: number) => Number.isFinite(n));
      if (ids.length > 0) {
        console.log("서버에서 전체 모집 공고 목록 조회 성공:", ids);
        return Array.from(new Set(ids));
      }
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { status?: number; data?: unknown };
      };
      console.warn(
        "전체 모집 공고 목록 조회 실패:",
        errorResponse?.response?.status,
        errorResponse?.response?.data
      );
    }

    // 방법 2: /api/bands로 전체 밴드 목록 조회 시도
    try {
      const res = await API.get(API_ENDPOINTS.BANDS.LIST, {
        params: { page: 0, size: 1000 },
      });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.result)
        ? res.data.result
        : [];
      const ids = list
        .map((r: Record<string, unknown>) => Number(r?.bandId ?? r?.id))
        .filter((n: number) => Number.isFinite(n));
      if (ids.length > 0) {
        console.log("서버에서 전체 밴드 목록 조회 성공:", ids);
        return Array.from(new Set(ids));
      }
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { status?: number; data?: unknown };
      };
      console.warn(
        "전체 밴드 목록 조회 실패:",
        errorResponse?.response?.status,
        errorResponse?.response?.data
      );
    }

    // 방법 3: 기존 하드코딩된 ID들로 개별 조회하여 RECRUITING 상태 확인
    const hardcodedIds = [
      4, 10, 11, 12, 13, 14, 15, 16, 17, 18, 28, 42, 45, 49, 51, 63, 64, 65, 67,
      68, 76,
    ];
    const recruitingIds: number[] = [];

    // 배치 처리로 API 호출 최적화
    const batchSize = 5;
    for (let i = 0; i < hardcodedIds.length; i += batchSize) {
      const batch = hardcodedIds.slice(i, i + batchSize);
      const batchPromises = batch.map(async (id) => {
        try {
          const recruitRes = await getBandRecruitDetail(String(id));
          if (
            recruitRes?.isSuccess &&
            recruitRes.result?.status === "RECRUITING"
          ) {
            return id;
          }
        } catch (error) {
          console.warn(`밴드 ${id} 상태 확인 실패:`, error);
        }
        return null;
      });

      const batchResults = await Promise.all(batchPromises);
      recruitingIds.push(
        ...batchResults.filter((id): id is number => id !== null)
      );
    }

    if (recruitingIds.length > 0) {
      console.log("하드코딩된 ID로 확인된 리쿠르팅 밴드들:", recruitingIds);
      return recruitingIds;
    }

    // 방법 4: 범위별 점진적 조회 (1~20, 21~40, 41~60, 61~80 등)
    try {
      const rangeSize = 20;
      const maxRange = 200; // 최대 200까지 시도 (더 넓게)
      let emptyRangeCount = 0;
      let totalFound = 0;

      for (let start = 1; start <= maxRange; start += rangeSize) {
        const end = start + rangeSize - 1;
        const rangeIds = Array.from({ length: rangeSize }, (_, i) => start + i);

        console.log(
          `범위 ${start}-${end} 조회 시도... (현재까지 ${totalFound}개 발견)`
        );

        const batchPromises = rangeIds.map(async (id) => {
          try {
            const recruitRes = await getBandRecruitDetail(String(id));
            if (
              recruitRes?.isSuccess &&
              recruitRes.result?.status === "RECRUITING"
            ) {
              return id;
            }
          } catch (error) {
            // 에러가 발생하면 해당 범위는 건너뛰기
            const errorResponse = error as { response?: { status?: number } };
            if (errorResponse?.response?.status === 404) {
              return null; // 404는 정상적인 상황 (존재하지 않는 밴드)
            }
            console.warn(
              `밴드 ${id} 조회 중 에러:`,
              errorResponse?.response?.status
            );
          }
          return null;
        });

        const batchResults = await Promise.all(batchPromises);
        const validIds = batchResults.filter((id): id is number => id !== null);

        if (validIds.length > 0) {
          recruitingIds.push(...validIds);
          totalFound += validIds.length;
          console.log(
            `범위 ${start}-${end}에서 ${validIds.length}개 밴드 발견:`,
            validIds
          );
        }

        // 연속으로 5개 범위에서 아무것도 찾지 못하면 중단
        if (validIds.length === 0) {
          emptyRangeCount++;
          if (emptyRangeCount >= 5) {
            console.log(
              `연속 ${emptyRangeCount}개 범위에서 밴드를 찾지 못함. 조회 중단. 총 ${totalFound}개 발견.`
            );
            break;
          }
        } else {
          emptyRangeCount = 0; // 리셋
        }

        // 충분한 밴드를 찾았으면 중단
        if (totalFound >= 50) {
          console.log(`충분한 밴드를 찾았습니다 (${totalFound}개). 조회 중단.`);
          break;
        }
      }
    } catch (error: unknown) {
      console.warn("범위별 조회 중 에러 발생:", error);
    }
  } catch (error: unknown) {
    console.warn("서버 리쿠르팅 밴드 ID 조회 실패:", error);
  }

  // 3) 임시 하드코딩 (운영 API 준비 전까지만 사용)
  // 76번 밴드가 보이지 않는 문제 해결을 위해 최신 ID들 포함
  return [
    // 4, 10, 11, 12, 13, 14, 15, 16, 17, 18, 28, 42, 45, 49, 51, 63, 64, 65, 67,
    // 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  ];
};

// 모든 밴드 목록 조회 API
export const getAllBands = async () => {
  try {
    const response = await API.get(API_ENDPOINTS.BANDS.LIST);
    return response.data;
  } catch (error) {
    // 404 에러 등은 정상적인 상황이므로 warn으로 처리
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
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
        if (import.meta.env.DEV) {
          console.log(`밴드 ${id} 상세정보 조회 시도 중...`);
        }
        const detail = await getBandDetail(String(id));
        if (detail && detail.bandName) {
          if (import.meta.env.DEV) {
            console.log(`밴드 ${id} 상세정보 조회 성공:`, detail.bandName);
          }
          return detail;
        } else {
          if (import.meta.env.DEV) {
            console.warn(
              `밴드 ${id} 상세정보는 조회되었지만 bandName이 비어있음:`,
              detail
            );
          }
          return null;
        }
      } catch (error) {
        // 에러 로그만 남김
        if (import.meta.env.DEV) {
          console.error(`밴드 ${id} 조회 중 예외 발생:`, error);
        } else {
          console.warn(`밴드 ${id} 조회 실패:`, error);
        }
        return null;
      }
    });

    // 병렬로 모든 요청 처리
    const detailResults = await Promise.all(detailPromises);
    const validDetails = detailResults.filter(Boolean) as BandDetail[];

    // 결과 개수 제한
    results.push(...validDetails.slice(0, limit));
  } catch {
    // Similar API 실패 시 fallback으로 기본 ID 사용
    const fallbackIds = options?.candidateIds ?? [1, 2, 3, 4, 5];

    for (const id of fallbackIds) {
      if (results.length >= limit) break;

      try {
        if (import.meta.env.DEV) {
          console.log(`Fallback 밴드 ${id} 상세정보 조회 시도 중...`);
        }
        const detail = await getBandDetail(String(id));
        if (detail && detail.bandName) {
          if (import.meta.env.DEV) {
            console.log(
              `Fallback 밴드 ${id} 상세정보 조회 성공:`,
              detail.bandName
            );
          }
          results.push(detail);
        } else {
          if (import.meta.env.DEV) {
            console.warn(
              `Fallback 밴드 ${id} 상세정보는 조회되었지만 bandName이 비어있음:`,
              detail
            );
          }
        }
      } catch (error) {
        // 에러 로그만 남김
        if (import.meta.env.DEV) {
          console.error(`Fallback 밴드 ${id} 조회 중 예외 발생:`, error);
        } else {
          console.warn(`Fallback 밴드 ${id} 조회 실패:`, error);
        }
        continue;
      }
    }
  }

  return results;
};
