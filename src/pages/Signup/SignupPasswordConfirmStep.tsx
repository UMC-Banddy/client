import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/white-star.svg";

export const SignupPasswordConfirmStep: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 pt-6 relative">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate("/signup/password")}
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
        <div className="h-full bg-red-500 w-2/4 absolute top-0 left-0" />
      </div>

      {/* 로고 */}
      <img src={logo} alt="Banddy" className="w-8 h-8 absolute top-4 right-4" />

      {/* 내용 */}
      <div className="mt-20 flex-1 flex flex-col justify-center">
        <div>
          <p className="text-sm text-neutral-400 mb-1">Step. 2</p>
          <h1 className="text-lg font-semibold mb-8">비밀번호를 설정해 주세요.</h1>

          {/* 비밀번호 입력 */}
          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-neutral-500 bg-transparent py-2 pr-12 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.973 9.973 0 012.195-6.275m3.36-2.15a10.014 10.014 0 0110.185 1.575M19.8 14.15a9.996 9.996 0 01-3.585 3.675m-4.83.675a10.016 10.016 0 01-7.38-2.825M9 12a3 3 0 006 0 3 3 0 00-6 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <h1 className="text-lg font-semibold mb-2">비밀번호를 확인해 주세요.</h1>

          {/* 비밀번호 확인 입력 */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b border-neutral-500 bg-transparent py-2 pr-12 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2"
            >
              {showConfirm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.973 9.973 0 012.195-6.275m3.36-2.15a10.014 10.014 0 0110.185 1.575M19.8 14.15a9.996 9.996 0 01-3.585 3.675m-4.83.675a10.016 10.016 0 01-7.38-2.825M9 12a3 3 0 006 0 3 3 0 00-6 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* 검증 메시지 */}
          {confirmPassword.length > 0 && (
            <p
              className={`mt-2 text-sm ${
                isMatch ? "text-green-400" : "text-red-500"
              }`}
            >
              {isMatch
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        {/* 다음 버튼 */}
        <button
          disabled={!isMatch}
          onClick={() => navigate("/signup/nickname")}
          className={`w-full py-3 mt-12 rounded-[24px] font-semibold transition ${
            isMatch
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-neutral-700 text-neutral-400 cursor-default"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SignupPasswordConfirmStep;
