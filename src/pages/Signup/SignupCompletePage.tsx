import React from "react";
import { useNavigate } from "react-router-dom";
import whiteStar from "../../assets/logos/white-star.svg";
import SignupButton from "./_components/SignupButton";

const SignupCompletePage: React.FC = () => {
  const navigate = useNavigate();

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
          사전테스트를 통해
          <br />
          나와 더 잘 맞는 밴드를 찾아 보세요!
        </p>

        <SignupButton
          onClick={() => navigate("/pre-test/artist")}
          className="mb-4"
        >
          사전 테스트 하러 가기
        </SignupButton>

        <SignupButton
          onClick={() => navigate("/login")}
          variant="secondary"
        >
          로그인 하러 가기
        </SignupButton>
      </div>
    </div>
  );
};

export default SignupCompletePage;
