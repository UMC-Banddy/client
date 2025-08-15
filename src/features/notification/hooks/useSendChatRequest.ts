import { useState } from "react";
import { sendChatRequest } from "@/store/friendApi";

export const useSendChatRequest = () => {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  // 채팅 요청 보내기 핸들러
  const handleSendChatRequest = async (targetMemberId: number, message?: string) => {
    try {
      await sendChatRequest(targetMemberId, message);
      setToast({ message: "채팅 요청을 보냈습니다.", visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      return true; // 성공
    } catch (error) {
      console.error("채팅 요청 실패:", error);
      
      // 더 구체적인 에러 메시지
      let errorMessage = "요청 전송에 실패했습니다.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        if (axiosError.response?.status === 500) {
          errorMessage = "이미 요청을 보냈습니다.";
        } else if (axiosError.response?.status === 409) {
          errorMessage = "이미 채팅 요청이 존재합니다.";
        } else if (axiosError.response?.status === 404) {
          errorMessage = "존재하지 않는 사용자입니다.";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "로그인이 필요합니다.";
        }
      }
      
      setToast({ message: errorMessage, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
      return false; // 실패
    }
  };

  return {
    toast,
    handleSendChatRequest,
  };
};
