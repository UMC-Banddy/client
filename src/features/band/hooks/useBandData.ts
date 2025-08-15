import { useQuery } from "@tanstack/react-query";
import { bandKeys } from "./keys";
import { getRecommendedFromSimilar, getBandProfile, getBandDetail, getBandMembers } from "@/store/userStore";
import type { BandProfile, BandDetail } from "@/types/band";

// 상세 폴백은 화면에서 에러 처리로 대체 (목업 제거)

// 프로필 스키마 정규화 (빈 값 기본값 치환)
function sanitizeProfile(data?: Partial<BandProfile>): BandProfile {
  const goalTracks = Array.isArray(data?.goalTracks) ? data!.goalTracks! : [];
  const preferredArtists = Array.isArray(data?.preferredArtists)
    ? data!.preferredArtists!
    : [];
  const composition = data?.composition ?? undefined;
  const sns = Array.isArray(data?.sns) ? data!.sns! : [];
  const sessions = Array.isArray(data?.sessions) ? data!.sessions! : [];
  const jobs = Array.isArray(data?.jobs) ? data!.jobs! : [];

  return {
    goalTracks,
    preferredArtists,
    composition,
    sns,
    sessions,
    jobs,
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
    enabled: !window.location.pathname.startsWith('/pre-test'), // 사전테스트 중에는 비활성화
    staleTime: 60 * 1000,
  });
}

// 상세만 단독 조회 (스펙: GET /api/band/{bandId}/detail)
export function useBandDetail(bandId: string) {
  return useQuery({
    queryKey: [...bandKeys.profile(bandId), "detail-only"],
    queryFn: async (): Promise<BandDetail> => {
      // 에러는 상위 컴포넌트에서 에러 화면으로 처리하도록 전달
      const detail = await getBandDetail(bandId);
      if (!detail) throw new Error("Band detail not found");
      return detail;
    },
    enabled: !!bandId,
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
        const profile = await getBandProfile(bandId);
        const safeProfile = sanitizeProfile(profile as Partial<BandProfile>);
        return { profile: safeProfile };
      } catch {
        return { profile: sanitizeProfile(undefined) };
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
        // 서버에 /api/band/{id}/tracks 미구현(404) → 프로필의 goalTracks 사용
        const profile: BandProfile = (await getBandProfile(
          bandId
        )) as BandProfile;
        const tracks = Array.isArray(profile.goalTracks)
          ? profile.goalTracks
          : [];
        return tracks;
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
        // 서버에 /api/band/{id}/artists 미구현(404) → 프로필의 preferredArtists 사용
        const profile: BandProfile = (await getBandProfile(
          bandId
        )) as BandProfile;
        const artists = Array.isArray(profile.preferredArtists)
          ? profile.preferredArtists
          : [];
        return artists;
      } catch {
        return [] as unknown[];
      }
    },
    enabled: !!bandId,
    staleTime: 60 * 1000,
  });
}
