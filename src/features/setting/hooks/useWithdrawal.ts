import { useState } from "react";
import { withdrawUser } from "@/store/settingApi";

export const useWithdrawal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleWithdrawal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // localStorage에서 토큰과 memberId 가져오기
      const refreshToken = localStorage.getItem("refreshToken");
      const memberId = localStorage.getItem("memberId");
      
      if (!refreshToken || !memberId) {
        setError("로그인이 필요합니다.");
        return;
      }

      const response = await withdrawUser({
        memberId: parseInt(memberId),
        refreshToken: refreshToken,
      });

      if (response.isSuccess) {
        // 로컬 스토리지 정리
        localStorage.clear();
        sessionStorage.clear();
        
        setIsSuccess(true);
      } else {
        setError(response.message || "회원탈퇴 처리 중 오류가 발생했습니다.");
      }
    } catch (err: unknown) {
      console.error("회원탈퇴 중 오류 발생:", err);
      
      // API 에러 메시지 처리
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as { response?: { status?: number } };
        if (errorResponse.response?.status === 403) {
          setError("권한이 없습니다. 다시 로그인해주세요.");
        } else if (errorResponse.response?.status === 401) {
          setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          setError("회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        setError("회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isSuccess,
    handleWithdrawal,
  };
}; 