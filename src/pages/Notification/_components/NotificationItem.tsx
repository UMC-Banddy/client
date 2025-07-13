import { ChevronRight } from "lucide-react";

interface NotificationItemProps {
  avatarUrl?: string;
  icon?: React.ReactNode;
  message: string;
  onClick?: () => void;
}

export default function NotificationItem({ avatarUrl, icon, message, onClick }: NotificationItemProps) {
  return (
    <div
      className="flex items-center py-[3vh] hover:bg-[#FFFFFF]/10 transition rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="w-[16vw] h-[16vw] rounded-full bg-[#808080] flex items-center justify-center overflow-hidden flex-shrink-0 mr-[4vw]">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          icon
        )}
      </div>
      <span className="text-[#FFFFFF] flex-1 text-left text-hakgyo-r-16">{message}</span>
      <ChevronRight size={22} className="text-[#FFFFFF]/70 text-left ml-[2vw]" />
    </div>
  );
}