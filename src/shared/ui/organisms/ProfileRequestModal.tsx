import { useState } from "react";
import CustomButton from "@/shared/ui/atoms/CustomButton";
import { sendFriendRequest, sendChatRequest } from "@/store/friendApi";

interface ProfileRequestModalProps {
  open: boolean;
  type: "chat" | "friend";
  profileName: string;
  message: string;
  onMessageChange: (msg: string) => void;
  onSend: (toastMessage: string) => void;
  onClose: () => void;
  targetMemberId: number;
}

const ProfileRequestModal: React.FC<ProfileRequestModalProps> = ({
  open,
  type,
  profileName,
  message,
  onMessageChange,
  onSend,
  onClose,
  targetMemberId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  // API 호출 및 토스트 처리
  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      if (type === "friend") {
        await sendFriendRequest(targetMemberId, message);
      } else if (type === "chat") {
        await sendChatRequest(targetMemberId, message);
      }
      
      // 모달 닫고 토스트 표시
      onSend(type === "friend" ? "친구 신청을 보냈습니다." : "채팅 요청을 보냈습니다.");
    } catch (error) {
      console.error("요청 실패:", error);
      
      // 에러 메시지 처리
      let errorMessage = "요청 전송에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 500) {
          errorMessage = "이미 요청을 보냈습니다.";
        } else if (axiosError.response?.status === 409) {
          errorMessage = "이미 요청이 존재합니다.";
        } else if (axiosError.response?.status === 404) {
          errorMessage = "존재하지 않는 사용자입니다.";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "로그인이 필요합니다.";
        }
      }
      
      onSend(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-[85.49vw] flex flex-col items-center px-[48px] py-[40px] max-w-[342px]">
        <div className="text-hakgyo-b-24 text-gray-700 mb-[2vh]">{type === "chat" ? "채팅 요청" : "친구 신청"}</div>
        <div className="text-hakgyo-r-14 text-[#555555] mb-[2.5vh] text-center break-keep">
          ‘{profileName}’ 님께 {type === "chat" ? "채팅을 요청하시겠습니까?" : "친구 신청을 하시겠습니까?"}<br />
          상대방이 수락하면 {type === "chat" ? "채팅이 시작됩니다." : "친구로 맺어집니다."}
        </div>
        <div className="w-full text-wanted-sb-13 text-[#555555] mb-[1vh]">전달할 메시지</div>
        <textarea
          id="profile-request-message"
          className="w-full h-20 bg-[#CACACA] p-[8px] text-hakgyo-r-14 text-[#555555] resize-none mb-[2vh] outline-none focus:outline-none"
          maxLength={50}
          placeholder="이곳에 메시지를 입력하세요.
(50자 제한)"
          value={message}
          onChange={e => onMessageChange(e.target.value)}
        />
        <div className="flex w-full gap-3 mt-[0.5vh]">
          <CustomButton className="flex-1" bgColor="bg-[#CACACA]" textColor="text-[#B42127]" onClick={onClose} disabled={isLoading}>아니오</CustomButton>
          <CustomButton className="flex-1" bgColor="bg-[#B42127]" onClick={handleSendRequest} disabled={isLoading}>
            {isLoading ? "전송 중..." : "보내기"}
          </CustomButton>
        </div>
      </div>
      
    </div>
  );
};

export default ProfileRequestModal;
