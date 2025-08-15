export interface Notification {
  notificationId: number;
  title: string;
  type: string;
  imageUrl: string | null;
  isRead: "READ" | "UNREAD";
  createdAt: string;
  senderId: number;
  friendRequestId: number | null;
  message: string | null;
}

export interface NotificationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Notification[];
} 