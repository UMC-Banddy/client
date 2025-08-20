import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import whiteStar from "../../assets/logos/white-star.svg";
import SignupButton from "./_components/SignupButton";
import { login } from "@/store/auth";
import toast from "react-hot-toast";

const SignupCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const autoLogin = async () => {
      const { email, password } = location.state || {};
      if (email && password) {
        try {
          const data = await login({ email, password });
          if (data && data.memberId) {
            toast.success("로그인 되었습니다.");
          }
        } catch (error) {
          console.error("자동 로그인 실패:", error);
          toast.error("자동 로그인에 실패했습니다. 다시 로그인해주세요.");
          // 자동 로그인 실패 시 로그인 페이지로 보낼 수도 있습니다.
          // navigate("/login");
        }
      }
    };

    autoLogin();
  }, [location.state, navigate]);

  const handleGoToPreTest = () => {
    navigate("/pre-test/artist");
  };

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      {/* 프로그레스 바 */}
      <div className="w-full h-0.5 bg-[#959595]">
        <div className="w-full h-full bg-[#C7242D]" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col items-center justify-center px-6 pt-[180px] pb-10 text-center">
        <img src={whiteStar} alt="완료" className="w-24 h-24 mb-10" />

        <h1 className="text-lg font-semibold mb-2">회원가입이 완료되었습니다.</h1>
        <p className="text-sm text-[#CACACA] mb-10 leading-relaxed">
          사전테스트는 선택사항입니다.
          <br />
          지금 하거나 나중에 언제든지 할 수 있어요!
        </p>

        <SignupButton onClick={handleGoToPreTest} className="mb-4">
          사전 테스트 하러 가기
        </SignupButton>

        <SignupButton onClick={() => navigate("/login")} variant="secondary">
          로그인 하러 가기
        </SignupButton>
      </div>
    </div>
  );
};

export default SignupCompletePage;
