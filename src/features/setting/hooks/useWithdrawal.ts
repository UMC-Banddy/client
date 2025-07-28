import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { withdrawUser } from "@/store/settingApi";

export const useWithdrawal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        
        alert("회원탈퇴가 완료되었습니다. 7일 후 모든 정보가 삭제됩니다.");
        navigate("/login");
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
    handleWithdrawal,
  };
}; 