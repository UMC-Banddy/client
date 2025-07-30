import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import whiteStar from "../../assets/logos/white-star.svg";
import eyeOpen from "../../assets/icons/login/eye-open.svg";
import eyeClosed from "../../assets/icons/login/eye-closed.svg";
import { authStore } from "../../store/authStore"; 

const SignupPasswordConfirmStep: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState(authStore.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      {/* 프로그레스 바 */}
      <div className="w-full h-0.5 bg-[#959595]">
        <div className="w-2/4 h-full bg-[#C7242D]" />
      </div>

      <img src={whiteStar} alt="step" className="absolute right-6 top-[18px] w-8 h-8" />

      <div className="flex flex-col px-6 pt-[180px]">
        <p className="text-sm text-[#959595] mb-1">Step. 2</p>
        <h1 className="text-lg font-semibold mb-8">비밀번호를 설정해 주세요.</h1>

        {/* 비밀번호 입력 */}
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-[#959595] bg-transparent py-2 pr-12 focus:outline-none text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2"
          >
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="toggle visibility"
              className="w-5 h-5 opacity-70"
            />
          </button>
        </div>

        <h1 className="text-lg font-semibold mb-2">비밀번호를 확인해 주세요.</h1>

        {/* 비밀번호 확인 입력 */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b border-[#959595] bg-transparent py-2 pr-12 focus:outline-none text-white"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2"
          >
            <img
              src={showConfirm ? eyeOpen : eyeClosed}
              alt="toggle visibility"
              className="w-5 h-5 opacity-70"
            />
          </button>
        </div>

        {/* 검증 메시지 */}
        {confirmPassword.length > 0 && (
          <p
            className={`mt-2 text-sm text-right ${
              isMatch ? "text-[#64B1A4]" : "text-[#DF0001]"
            }`}
          >
            {isMatch
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
          </p>
        )}
      </div>

      {/* 다음 버튼 */}
      <div className="px-6 mt-16">
        <button
          disabled={!isMatch}
          onClick={() => navigate("/signup/nickname")}
          className={`w-full py-3 rounded-[24px] font-semibold transition ${
            isMatch
              ? "bg-[#C7242D] text-black"
              : "bg-[#959595] text-[#555555] cursor-default"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SignupPasswordConfirmStep;
