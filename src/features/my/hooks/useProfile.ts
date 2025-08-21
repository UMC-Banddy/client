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
        console.log("프로필 API 응답:", response.data);

        // 응답 구조 확인 및 안전한 처리
        if (response.data?.result) {
          return response.data.result;
        } else if (response.data) {
          // result가 없는 경우 전체 응답 반환
          console.warn("API 응답에 result 필드가 없음:", response.data);
          return response.data;
        } else {
          console.error("API 응답이 비어있음");
          throw new Error("프로필 데이터를 불러올 수 없습니다");
        }
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        throw error;
      }
    },
    enabled: !!authStore.accessToken,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5분으로 증가 (기존 1분)
    gcTime: 10 * 60 * 1000, // 10분으로 증가 (기존 5분)
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
  });
};
