import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";

export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile", "my"],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.SELF);
      return response.data.result;
    },
    enabled: !!authStore.accessToken,
  });
}; 