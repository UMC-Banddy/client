import NotificationItem from "./NotificationItem";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: "1",
    icon: <img src="/assets/apple.png" alt="apple" className="w-8 h-8" />, // 예시: 사과 아이콘
    name: "링고",
    message: "'링고' 님이 매칭을 요청하셨습니다.",
    type: "matching",
  },
  {
    id: "2",
    avatarUrl: "/assets/band.jpg",
    message: "'우리밴드 정상영업합니다' 밴드에서 당신을 원합니다.",
    type: "band",
  },
  {
    id: "3",
    avatarUrl: "/assets/flowerboy.jpg",
    message: "'Flowerboy' 님이 당신을 원합니다.",
    type: "matching",
  },
  {
    id: "4",
    icon: <AlertCircle size={28} className="text-red-500" />,
    message: "제제 내역입니다.",
    type: "ban",
  },
];

export default function NotificationList() {
  const navigate = useNavigate();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center w-full h-full">
        <span className="text-gray-400 text-base">새 소식이 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[3vw]">
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          avatarUrl={n.avatarUrl}
          icon={n.icon}
          message={n.message}
          onClick={() => navigate(`/my/notifications/${n.id}`)}
        />
      ))}
    </div>
  );
}