import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/white-star.svg";

const SignupCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 relative">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate("/signup/profile")}
        className="absolute top-4 left-4"
        aria-label="뒤로가기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* 프로그레스 바 */}
      <div className="h-0.5 w-full bg-neutral-700 mt-10 mb-8 relative">
        <div className="h-full bg-red-500 w-full absolute top-0 left-0" />
      </div>

      {/* 내용 */}
      <div className="flex flex-col items-center justify-center flex-1">
        <img src={logo} alt="Banddy" className="w-14 h-14 mb-8" />

        <h1 className="text-lg font-semibold mb-2">
          회원가입이 완료되었습니다.
        </h1>
        <p className="text-sm text-neutral-400 text-center mb-10 leading-relaxed">
          사전테스트를 통해
          <br />
          나와 더 잘 맞는 밴드를 찾아 보세요!
        </p>

        <button
          onClick={() => navigate("/pretest")}
          className="w-full py-3 rounded-[24px] bg-red-600 hover:bg-red-700 font-semibold text-white mb-4"
        >
          사전 테스트 하러 가기
        </button>
        <button
          disabled
          className="w-full py-3 rounded-[24px] bg-neutral-700 text-neutral-400 font-semibold cursor-default"
        >
          로그인 하러 가기
        </button>
      </div>
    </div>
  );
};

export default SignupCompletePage;
