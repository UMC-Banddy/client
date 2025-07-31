import { API } from "@/api/API";
import { API_ENDPOINTS } from "@/constants";
import { type Notification } from "@/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await API.get(API_ENDPOINTS.PROFILE.NOTIFICATIONS);
  return response.data;
}; 