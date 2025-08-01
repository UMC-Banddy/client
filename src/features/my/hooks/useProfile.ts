import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";

export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile", "my"],
    queryFn: async () => {
      try {
        const response = await API.get(API_ENDPOINTS.PROFILE.SELF);
        return response.data.result;
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        throw error;
      }
    },
    enabled: !!authStore.accessToken,
    retry: 3, // 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (React Query v5)
  });
}; 