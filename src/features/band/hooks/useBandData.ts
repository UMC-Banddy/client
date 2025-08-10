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
        return { profile: profile ?? {}, detail };
      } catch {
        return { profile: {} as BandProfile };
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
