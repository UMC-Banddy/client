import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";
import { type NotificationResponse } from "@/types/notification";

export const useNotificationCount = () => {
  const { data: response, isLoading, error, refetch } = useQuery<NotificationResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.NOTIFICATIONS);
      return response.data;
    },
    enabled: !!authStore.accessToken,
  });

  const notifications = response?.result || [];

  return {
    count: notifications.filter(notification => notification.isRead === "UNREAD").length,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}; 