import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";
import type { OtherProfileData } from "@/types/profile";

export const useOtherProfile = (memberId: number | null) => {
  const { data: profile, isLoading, error } = useQuery<OtherProfileData>({
    queryKey: ["otherProfile", memberId],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.OTHER(memberId!.toString()));
      return response.data;
    },
    enabled: !!authStore.accessToken && !!memberId,
  });

  return {
    profile,
    isLoading,
    error: error?.message || null,
  };
}; 