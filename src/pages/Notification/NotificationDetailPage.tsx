import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { useOtherProfile } from "@/features/profile/hooks/useOtherProfile";
import { useMarkNotificationAsRead } from "@/features/notification/hooks/useMarkNotificationAsRead";
import { useFriendRequestActions } from "@/features/notification/hooks/useFriendRequestActions";
import right from "@/assets/icons/notification/chevronright.svg";
import arrow_back from "@/assets/icons/back.svg";
import noImg from "@/assets/icons/profile/no_img.svg";
import CommonBtn from "@/shared/components/CommonBtn";

export default function NotificationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);
  const { notifications, isLoading, error } = useNotifications();
  
  // 커스텀 훅 사용
  const { actionToast, handleAcceptFriend, handleRejectFriend } = useFriendRequestActions();

  // API에서 가져온 notifications에서 해당 notification 찾기
  const notification = notifications.find(n => n.notificationId.toString() === id);
  const { profile } = useOtherProfile(notification?.senderId || null);

  // API hooks
  const markAsReadMutation = useMarkNotificationAsRead();

  // 친구 신청 수락 핸들러
  const handleAcceptFriendClick = () => {
    if (!notification?.friendRequestId) return;
    handleAcceptFriend(notification.friendRequestId);
  };

  // 친구 신청 거절 핸들러
  const handleRejectFriendClick = () => {
    if (!notification?.friendRequestId) return;
    handleRejectFriend(notification.friendRequestId);
  };

  // 채팅 요청 수락 핸들러 (임시)
  const handleAcceptChat = () => {
    // TODO: 채팅 수락 API 구현 필요
    console.log("채팅 요청 수락");
  };

  // 요청 거절 핸들러 (임시)
  const handleReject = () => {
    // TODO: 거절 API 구현 필요
    console.log("요청 거절");
  };

  useEffect(() => {
    if (notification) {
      // 알림 읽음 처리 (한 번만 실행)
      markAsReadMutation.mutate({
        type: notification.type,
        notificationId: notification.notificationId
      });

      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000); // 2초 후 사라짐

      return () => clearTimeout(timer);
    }
  }, [notification]); 

  // 로딩 중이거나 에러가 있으면 처리
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <div className="text-white text-hakgyo-b-24">알림을 찾을 수 없습니다.</div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 text-white text-hakgyo-r-14 underline"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-stretch relative">
      <header className="w-full flex items-center justify-start h-[12vh] fixed top-0 left-4 z-20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <img src={arrow_back} alt="arrow-back" className="w-[10vw] h-[10vw] max-w-[40px] max-h-[40px]" />
        </button>
        <span className="text-[#e5e7eb] text-hakgyo-b-17 ml-[3vw]">전체 알림</span>
      </header>
      {notification.imageUrl && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20 blur-sm z-0"
          style={{
            backgroundImage: `url(${notification.imageUrl})`,
            filter: "blur(20px) brightness(0.3)"
          }}
        />
      )}
      

      {/* 기존 토스트 */}
      <div className={`fixed top-[0vh] left-1/2 -translate-x-1/2 bg-black text-white text-hakgyo-r-16 rounded-full px-[18px] py-[8.5px] z-50 border-white border-[0.5px] transition-transform duration-1000 ${showToast ? "translate-y-[20vh]" : "-translate-y-full"} ${showToast ? "opacity-100" : "opacity-0"}`}>
        <span className="whitespace-nowrap">
          {notification.type === "CHAT" || notification.type === "BAND" 
            ? "새로운 채팅 요청이 왔어요!" 
            : notification.type === "FRIEND" 
              ? "새로운 친구 요청이 왔어요!" 
              : "알림 상세 페이지 진입"
          }
        </span>
      </div>

      {/* 액션 토스트 */}
      <div className={`fixed top-[0vh] left-1/2 -translate-x-1/2 bg-black text-white text-hakgyo-r-16 rounded-full px-[18px] py-[8.5px] z-50 border-white border-[0.5px] transition-transform duration-1000 ${actionToast.visible ? "translate-y-[20vh]" : "-translate-y-full"} ${actionToast.visible ? "opacity-100" : "opacity-0"}`}>
        <span className="whitespace-nowrap">
          {actionToast.message}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 w-full min-h-[70vh] relative z-10">
        <div className="w-[44vw] h-[44vw] max-w-[173px] max-h-[173px] rounded-full bg-[#E9E9E9] flex items-center justify-center overflow-hidden">
          {notification.imageUrl ? (
            <img src={notification.imageUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <img src={noImg} alt="no image" className="w-[60%] h-[60%] opacity-50" />
          )}
        </div>
        <div className="flex justify-center items-center mt-[3vh]">
        <img src={right} alt="right" className="w-[12.2vw] h-[12.2vw] max-w-[31px] max-h-[31px] text-[#FFFFFF]/70 text-left mr-[2vw] invisible" />
          <div className="text-[#FFFFFF] text-hakgyo-b-24">{profile?.nickname || "알림"}</div>
            <img 
              src={right} 
              alt="right" 
              className="w-[12.2vw] h-[12.2vw] max-w-[31px] max-h-[31px] text-[#FFFFFF]/70 text-left ml-[2vw] cursor-pointer z-10" 
              onClick={() => navigate(`/profile-detail/${notification.senderId}`)} 
            />
        </div>
        <div className="flex gap-[3vw] mt-[6vh]">
          <CommonBtn 
            color="gray" 
            onClick={notification.type === "FRIEND" ? handleRejectFriendClick : handleReject}
          >
            거절
          </CommonBtn>
          {notification.type === "CHAT" && (
            <CommonBtn color="red" onClick={handleAcceptChat}>채팅 수락</CommonBtn>
          )}  
          {notification.type === "BAND" && (
            <CommonBtn color="red" onClick={handleAcceptChat}>채팅 수락</CommonBtn>
          )}
          {notification.type === "FRIEND" && (
            <CommonBtn color="red" onClick={handleAcceptFriendClick}>친구 수락</CommonBtn>
          )}
        </div>
      </div>
    </div>
  );
}