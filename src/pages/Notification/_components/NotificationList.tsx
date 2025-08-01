import NotificationItem from "./NotificationItem";
import { useNavigate } from "react-router-dom";
import { type Notification } from "@/types/notification";

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({ notifications }: NotificationListProps) {
  const navigate = useNavigate();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center w-full h-full">
        <span className="text-hakgyo-r-16 text-[#959595] text-base">새 소식이 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[3vw]">
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