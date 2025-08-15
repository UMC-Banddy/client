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
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    gcTime: 10 * 60 * 1000, // 10분간 캐시
  });
};
