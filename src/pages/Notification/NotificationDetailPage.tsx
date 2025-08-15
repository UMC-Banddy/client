import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { useOtherProfile } from "@/features/profile/hooks/useOtherProfile";
import { useMarkNotificationAsRead } from "@/features/notification/hooks/useMarkNotificationAsRead";
import { useFriendRequestActions } from "@/features/notification/hooks/useFriendRequestActions";
import { useNotificationMessage } from "@/features/notification/hooks/useNotificationMessage";
import { createDirectChat } from "@/store/chatApi";
import { deleteChatRequest } from "@/store/friendApi";
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
  
  // 채팅 수락 토스트 상태
  const [chatToast, setChatToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  // API에서 가져온 notifications에서 해당 notification 찾기
  const notification = notifications.find(n => n.notificationId.toString() === id);
  const { profile } = useOtherProfile(notification?.senderId || null);
  
  // 특정 알림의 메시지 가져오기
  const { message: notificationMessage } = useNotificationMessage(notification?.notificationId || null);

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

  // 채팅 요청 수락 핸들러
  const handleAcceptChat = async () => {
    if (!notification?.senderId) {
      console.error("❌ 발신자 ID가 없습니다.");
      return;
    }

    try {
      console.log("💬 채팅 요청 수락 시작:", notification.senderId);
      
      // 채팅방 생성/입장 API 호출
      const response = await createDirectChat({ memberId: notification.senderId });
      
      console.log("✅ 채팅방 생성 성공:", response);
      
      // 성공 토스트 표시
      setChatToast({ message: "채팅방이 생성되었습니다.", visible: true });
      
      // 2초 후 채팅방으로 이동
      setTimeout(() => {
        setChatToast({ message: "", visible: false });
        // navigate(`/home/private-chat?roomId=${response.roomId}&receiverId=${notification.senderId}`);
        navigate("/home/private-chat");
      }, 2000);
      
    } catch (error) {
      console.error("❌ 채팅 요청 수락 실패:", error);
      
      // 에러 메시지 처리
      let errorMessage = "채팅방 생성에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          errorMessage = "존재하지 않는 사용자입니다.";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "로그인이 필요합니다.";
        } else if (axiosError.response?.status === 409) {
          errorMessage = "이미 채팅방이 존재합니다.";
        }
      }
      
      setChatToast({ message: errorMessage, visible: true });
      setTimeout(() => setChatToast({ message: "", visible: false }), 2000);
    }
  };

  // 채팅 요청 거절 핸들러
  const handleRejectChat = async () => {
    if (!notification?.notificationId) {
      console.error("❌ 알림 ID가 없습니다.");
      return;
    }

    try {
      console.log("💬 채팅 요청 거절 시작:", notification.notificationId);
      
      // 채팅 요청 삭제 API 호출
      await deleteChatRequest(notification.notificationId);
      
      console.log("✅ 채팅 요청 거절 성공");
      
      // 성공 토스트 표시
      setChatToast({ message: "채팅 요청을 거절했습니다.", visible: true });
      
      // 2초 후 뒤로 가기
      setTimeout(() => {
        setChatToast({ message: "", visible: false });
        navigate(-1);
      }, 2000);
      
    } catch (error) {
      console.error("❌ 채팅 요청 거절 실패:", error);
      
      // 에러 메시지 처리
      let errorMessage = "채팅 요청 거절에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          errorMessage = "존재하지 않는 요청입니다.";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "로그인이 필요합니다.";
        } else if (axiosError.response?.status === 403) {
          errorMessage = "권한이 없습니다.";
        }
      }
      
      setChatToast({ message: errorMessage, visible: true });
      setTimeout(() => setChatToast({ message: "", visible: false }), 2000);
    }
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
      
      {/* 채팅 토스트 */}
      <div className={`fixed top-[0vh] left-1/2 -translate-x-1/2 bg-black text-white text-hakgyo-r-16 rounded-full px-[18px] py-[8.5px] z-50 border-white border-[0.5px] transition-transform duration-1000 ${chatToast.visible ? "translate-y-[20vh]" : "-translate-y-full"} ${chatToast.visible ? "opacity-100" : "opacity-0"}`}>
        <span className="whitespace-nowrap">
          {chatToast.message}
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
            onClick={
              notification.type === "FRIEND" 
                ? handleRejectFriendClick 
                : notification.type === "CHAT" || notification.type === "BAND"
                  ? handleRejectChat
                  : handleReject
            }
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
        
        {/* 메시지 표시 */}
        {notificationMessage && (
          <div className="w-full px-[24px] mt-[3.7vh]">
            <div className="text-[#FFFFFF] text-hakgyo-r-16 text-center leading-relaxed">
              {notificationMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}