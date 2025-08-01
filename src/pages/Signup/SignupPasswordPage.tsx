import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";
import SignupHeader from "./_components/SignupHeader";
import SignupStepTitle from "./_components/SignupStepTitle";
import SignupInputField from "./_components/SignupInputField";
import SignupButton from "./_components/SignupButton";

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
      <SignupHeader progress={50} />

      <div className="flex flex-col px-6 pt-[180px]">
        <SignupStepTitle step={2} title="비밀번호를 설정해 주세요." />

        <SignupInputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle={true}
          onPasswordToggle={() => setShowPassword(!showPassword)}
          isPasswordVisible={showPassword}
        />

        {/* 조건 메시지 */}
        {password && !valid && (
          <p className="text-[#DF0001] text-sm mt-2 text-right">
            영문과 숫자 조합, 8~12자리
          </p>
        )}
      </div>

      <div className="px-6 mt-35">
        <SignupButton
          onClick={handleNext}
          disabled={!valid}
        >
          다음
        </SignupButton>
      </div>
    </div>
  );
};

export default SignupPasswordPage;
