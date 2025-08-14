import { useQuery } from "@tanstack/react-query";
import { bandKeys } from "./keys";
import {
  getRecommendedFromSimilar,
  getBandProfile,
  getBandDetail,
  getBandMembers,
  getBandTracks,
  getBandArtists,
} from "@/store/userStore";
import type { BandProfile, BandDetail } from "@/types/band";

// 상세 정보 목업 (API 500/404 등 실패 시 안전 폴백)
function getMockBandDetail(bandId: string): BandDetail {
  return {
    bandId: Number(bandId),
    bandName: "밴디 (임시)",
    profileImageUrl: "/assets/profile1.png",
    ageRange: "20-30",
    genderCondition: "무관",
    region: "서울",
    district: "강남구",
    description: "임시 밴드 소개입니다. 서버 데이터가 없을 때 표시됩니다.",
    endDate: undefined,
    snsList: [],
  };
}

// 안전 폴백: 추천 밴드가 없거나 404면 빈 배열
export function useRecommendedBands() {
  return useQuery({
    queryKey: bandKeys.recommended(),
    queryFn: async () => {
      try {
        const result = await getRecommendedFromSimilar();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

// 안전 폴백: 밴드 프로필 500/404시 최소 스켈레톤 데이터
export function useBandProfile(bandId: string) {
  return useQuery({
    queryKey: bandKeys.profile(bandId),
    queryFn: async (): Promise<{
      profile: BandProfile;
      detail?: BandDetail;
    }> => {
      try {
        const [profile, detail] = await Promise.all([
          getBandProfile(bandId),
          getBandDetail(bandId).catch(() => undefined),
        ]);
        // 상세가 없으면 목업으로 대체
        const safeDetail = detail ?? getMockBandDetail(bandId);
        return { profile: profile ?? ({} as BandProfile), detail: safeDetail };
      } catch {
        // 프로필까지 모두 실패하면 최소 구조로 반환
        return {
          profile: {} as BandProfile,
          detail: getMockBandDetail(bandId),
        };
      }
    },
    enabled: !!bandId,
    staleTime: 60 * 1000,
  });
}

export function useBandMembers(bandId: string) {
  return useQuery({
    queryKey: [...bandKeys.profile(bandId), "members"],
    queryFn: async () => {
      try {
        const data = await getBandMembers(bandId);
        return Array.isArray(data) ? data : [];
      } catch {
        return [] as unknown[];
      }
    },
    enabled: !!bandId,
    staleTime: 60 * 1000,
  });
}

export function useBandTracks(bandId: string) {
  return useQuery({
    queryKey: [...bandKeys.profile(bandId), "tracks"],
    queryFn: async () => {
      try {
        const data = await getBandTracks(bandId);
        return Array.isArray(data) ? data : [];
      } catch {
        return [] as unknown[];
      }
    },
    enabled: !!bandId,
    staleTime: 60 * 1000,
  });
}

export function useBandArtists(bandId: string) {
  return useQuery({
    queryKey: [...bandKeys.profile(bandId), "artists"],
    queryFn: async () => {
      try {
        const data = await getBandArtists(bandId);
        return Array.isArray(data) ? data : [];
      } catch {
        return [] as unknown[];
      }
    },
    enabled: !!bandId,
    staleTime: 60 * 1000,
  });
}
