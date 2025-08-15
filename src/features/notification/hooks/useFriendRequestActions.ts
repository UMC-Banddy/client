import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptFriendRequest, rejectFriendRequest } from "@/store/friendApi";

export const useFriendRequestActions = () => {
  const navigate = useNavigate();
  const [actionToast, setActionToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  // 친구 신청 수락 핸들러
  const handleAcceptFriend = async (friendRequestId: number) => {
    try {
      await acceptFriendRequest(friendRequestId.toString());
      setActionToast({ message: "친구 신청을 수락했습니다.", visible: true });
      setTimeout(() => {
        setActionToast({ message: "", visible: false });
        navigate(-1); // 뒤로 가기
      }, 2000);
    } catch (error) {
      console.error("친구 신청 수락 실패:", error);
      setActionToast({ message: "친구 신청 수락에 실패했습니다.", visible: true });
      setTimeout(() => setActionToast({ message: "", visible: false }), 2000);
    }
  };

  // 친구 신청 거절 핸들러
  const handleRejectFriend = async (friendRequestId: number) => {
    try {
      await rejectFriendRequest(friendRequestId.toString());
      setActionToast({ message: "친구 신청을 거절했습니다.", visible: true });
      setTimeout(() => {
        setActionToast({ message: "", visible: false });
        navigate(-1); // 뒤로 가기
      }, 2000);
    } catch (error) {
      console.error("친구 신청 거절 실패:", error);
      setActionToast({ message: "친구 신청 거절에 실패했습니다.", visible: true });
      setTimeout(() => setActionToast({ message: "", visible: false }), 2000);
    }
  };

  return {
    actionToast,
    handleAcceptFriend,
    handleRejectFriend,
  };
};
