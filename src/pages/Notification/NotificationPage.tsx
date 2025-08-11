import NotificationList from "./_components/NotificationList";
import { useNotifications } from "@/features/notification/hooks/useNotifications";

export default function NotificationPage() {
  const { notifications, isLoading, error } = useNotifications();

  // if (isLoading) {
  //   return (
  //     <div className="min-h-[100dvh] w-full flex items-center justify-center">
  //       <div className="text-white">로딩 중...</div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col">
      <NotificationList notifications={notifications} isLoading={isLoading} />
    </div>
  );
}