import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import whiteStar from "../../assets/logos/white-star.svg";
import eyeOpen from "../../assets/icons/login/eye-open.svg";
import eyeClosed from "../../assets/icons/login/eye-closed.svg";
import { authStore } from "../../store/authStore";

const SignupPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState(authStore.password || "");
  const [showPassword, setShowPassword] = useState(false);

  const isValidPassword = (value: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
    return regex.test(value);
  };

  const valid = isValidPassword(password);

  const handleNext = () => {
    authStore.password = password;
    navigate("/signup/password-confirm");
  };

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

        <div className="relative">
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

        {/* 조건 메시지 */}
        {password && !valid && (
          <p className="text-[#DF0001] text-sm mt-2 text-right">
            영문과 숫자 조합, 8~12자리
          </p>
        )}
      </div>

      <div className="px-6 mt-35">
        <button
          disabled={!valid}
          onClick={handleNext}
          className={`w-full py-3 rounded-[24px] font-semibold transition ${
            valid
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

export default SignupPasswordPage;
