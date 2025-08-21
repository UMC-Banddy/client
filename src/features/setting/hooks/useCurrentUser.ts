import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";

interface CurrentUserInfo {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  bio: string;
  tags: string[];
  savedTracks: Array<{
    title: string;
    imageUrl: string;
    externalUrl: string;
  }>;
}

export const useCurrentUser = () => {
  return useQuery<CurrentUserInfo>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.SELF);
      return response.data.result;
    },
    enabled: !!authStore.accessToken,
    staleTime: 10 * 60 * 1000, // 10분으로 증가 (기존 5분)
    gcTime: 20 * 60 * 1000, // 20분으로 증가 (기존 10분)
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
  });
};
