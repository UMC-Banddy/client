import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";
import { type Notification } from "@/types/notification";

export const useNotificationCount = () => {
  const { data: notifications = [], isLoading, error } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.NOTIFICATIONS);
      return response.data;
    },
    enabled: !!authStore.accessToken,
  });

  return {
    count: notifications.length,
    isLoading,
    error: error?.message || null,
    refetch: () => {},
  };
}; 