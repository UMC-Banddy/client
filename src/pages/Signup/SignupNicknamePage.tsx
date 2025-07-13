import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/white-star.svg";

const SignupNicknamePage: React.FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  // 조건 검사
  const regex = /^[A-Za-z0-9]{2,10}$/;
  const isValid = regex.test(nickname);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 relative">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate("/signup/password-confirm")}
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
            d="M6 12h12M6 12l6-6M6 12l6 6"
          />
        </svg>
      </button>

      {/* 프로그레스 바 */}
      <div className="h-0.5 w-full bg-neutral-700 mt-10 mb-8 relative">
        <div className="h-full bg-red-500 w-3/4 absolute top-0 left-0" />
      </div>

      {/* 로고 */}
      <img src={logo} alt="Banddy" className="w-8 h-8 absolute top-4 right-4" />

      {/* 내용 */}
      <div className="mt-20 flex-1 flex flex-col justify-center">
        <div>
          <p className="text-sm text-neutral-400 mb-1">Step. 3</p>
          <h1 className="text-lg font-semibold mb-8">닉네임을 설정해 주세요.</h1>

          {/* 입력 */}
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full border-b border-neutral-500 bg-transparent py-2 focus:outline-none"
          />

          {/* 검증 메시지 */}
          {nickname && (
            <p
              className={`mt-2 text-sm ${
                isValid ? "text-green-400" : "text-red-500"
              }`}
            >
              {isValid
                ? "사용 가능한 닉네임입니다."
                : "영문/숫자 가능, 2~10자"}
            </p>
          )}
        </div>

        {/* 완료 버튼 */}
        <button
          disabled={!isValid}
          onClick={() => navigate("/signup/profile")}
          className={`w-full py-3 mt-12 rounded-[24px] font-semibold transition ${
            isValid
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-neutral-700 text-neutral-400 cursor-default"
          }`}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default SignupNicknamePage;
