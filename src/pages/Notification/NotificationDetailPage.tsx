import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import arrow_back from "@/assets/icons/back.svg";
import CommonBtn from "@/shared/components/CommonBtn";

export default function NotificationDetailPage() {
  const navigate = useNavigate();
  // const { id } = useParams();

  // 일단은 목데이터
  const notification = {
    icon: <img src="https://i.playboard.app/p/AATXAJx9xhPSANXOwHmFoY6GExI19QhCC8STelIzPP6J/default.jpg" alt="apple" className="w-[44vw] h-[44vw] rounded-full" />,
    name: "링고",
    type: "매칭 요청",
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center bg-[radial-gradient(ellipse_at_center,_#551013_0%,_#121212_100%)]">
      <header className="absolute top-0 left-0 w-full flex items-center h-[13vh] px-[4vw] text-[#FFFFFF]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <img src={arrow_back} alt="arrow-back" className="w-[10vw] h-[10vw]" />
        </button>
        <span className="text-[#e5e7eb] text-hakgyo-b-17 ml-[3vw]">전체 알림</span>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 w-full min-h-[70vh]">
        <div>{notification.icon}</div>
        <div className="flex justify-center items-center mt-[3vh]">
          <ChevronLeft size={24} className="text-[#FFFFFF]/70 mr-[3vw] invisible" />
          <div className="text-[#FFFFFF] text-hakgyo-b-24">{notification.name}</div>
          <ChevronRight size={24} className="text-[#FFFFFF]/70 ml-[3vw] cursor-pointer" onClick={() => navigate("/profile-detail")} />
        </div>
        <div className="flex gap-[3vw] mt-[6vh]">
          <CommonBtn color="gray">거절</CommonBtn>
          <CommonBtn color="red">채팅 수락</CommonBtn>
        </div>
      </div>
    </div>
  );
}