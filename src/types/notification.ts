export interface Notification {
  notificationId: number;
  title: string;
  type: string;
  imageUrl: string | null;
  createdAt: string;
  senderId: number;
  friendRequestId: number | null;
}

export interface NotificationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Notification[];
} 