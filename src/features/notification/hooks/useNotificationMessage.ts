import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { authStore } from "@/store/authStore";
import { type NotificationResponse } from "@/types/notification";

export const useNotificationMessage = (notificationId: number | null) => {
  const { data: response, isLoading, error } = useQuery<NotificationResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await API.get(API_ENDPOINTS.PROFILE.NOTIFICATIONS);
      return response.data;
    },
    enabled: !!authStore.accessToken,
  });

  const notifications = response?.result || [];

  // 전체 알림 목록에서 특정 notificationId의 메시지 찾기
  const targetNotification = notifications.find(n => n.notificationId === notificationId);

  return {
    message: targetNotification?.message,
    isLoading,
    error: error?.message || null,
  };
};
