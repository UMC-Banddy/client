import NotificationItem from "./NotificationItem";
import NotificationListSkeleton from "./NotificationListSkeleton";
import { useNavigate } from "react-router-dom";
import { type Notification } from "@/types/notification";

interface NotificationListProps {
  notifications: Notification[];
  isLoading?: boolean;
}

export default function NotificationList({ notifications, isLoading = false }: NotificationListProps) {
  const navigate = useNavigate();

  // 로딩 중인 경우 스켈레톤 표시
  if (isLoading) {
    return <NotificationListSkeleton count={3} />;
  }

  // 알림이 없는 경우
  if (notifications.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center w-full h-full">
        <span className="text-hakgyo-r-16 text-[#959595] text-base">새 소식이 없습니다.</span>
      </div>
    );
  }

  // 정상적인 알림 목록 표시
  return (
    <div className="flex flex-col px-[3.8vw] pr-[3vw]">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.notificationId}
          notification={notification}
          onClick={() => navigate(`/my/notifications/${notification.notificationId}`)}
        />
      ))}
    </div>
  );
}