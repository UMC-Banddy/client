import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type Notification } from "@/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.NOTIFICATIONS);
  return response.data;
};

export const markNotificationAsRead = async (type: string, notificationId: number): Promise<void> => {
  await API.patch(`${API_ENDPOINTS.PROFILE.MARK_NOTIFICATION_READ}?type=${type}&notificationId=${notificationId}`);
}; 