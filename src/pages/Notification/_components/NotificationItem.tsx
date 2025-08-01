import right from "@/assets/icons/notification/chevronright.svg";
import { type Notification } from "@/types/notification";
import { useOtherProfile } from "@/features/profile/hooks/useOtherProfile";
import noImg from "@/assets/icons/profile/no_img.svg";

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { profile } = useOtherProfile(notification.senderId);

  const getMessage = (notification: Notification, nickname?: string) => {
    const senderName = nickname || notification.title;
    
    switch (notification.type) {
      case "CHAT":
        return `'${senderName}' 님이 매칭을 요청하셨습니다.`;
      case "FRIEND":
        return `'${senderName}' 님이 당신을 원합니다.`;
      case "BAND":
        return `'${senderName}' 밴드에서 당신을 원합니다.`;
      case "BAN":
        return "제제 내역입니다.";
      default:
        return `'${senderName}' 님이 알림을 보냈습니다.`;
    }
  };

  const message = getMessage(notification, profile?.nickname);
  return (
    <div
      className="flex items-center py-[12px] hover:bg-[#292929] transition cursor-pointer"
      onClick={onClick}
    >
      <div className="w-[16vw] h-[16vw] max-w-[64px] max-h-[64px] rounded-full bg-[#E9E9E9] flex items-center justify-center overflow-hidden flex-shrink-0 mr-[20px]">
        {notification.imageUrl ? (
          <img src={notification.imageUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <img src={noImg} alt="no image" className="w-[60%] h-[60%] opacity-50" />
        )}
      </div>
      <span className="text-[#FFFFFF] flex-1 text-left text-hakgyo-r-16">{message}</span>
      <img src={right} alt="right" className="w-[12.2vw] h-[12.2vw] max-w-[48px] max-h-[48px] text-left ml-[2vw]" />
    </div>
  );
}