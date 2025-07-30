//React Query로 사용자 정보 캐싱


import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";

export interface SavedTrack {
  title: string;
  imageUrl: string;
}

export interface UserProfile {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  bio: string;
  tags: string[];
  savedTracks: SavedTrack[];
}

export const useUser = () =>
  useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.SELF);
      return response.data.result;
    },
    enabled: !!authStore.accessToken,
  });



