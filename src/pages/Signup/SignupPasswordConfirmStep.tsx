import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";
import SignupHeader from "./_components/SignupHeader";
import SignupStepTitle from "./_components/SignupStepTitle";
import SignupInputField from "./_components/SignupInputField";
import SignupButton from "./_components/SignupButton";

const SignupPasswordConfirmStep: React.FC = () => {
  const navigate = useNavigate();

  // 앞 단계에서 저장된 비밀번호를 그대로 사용
  const [password, setPassword] = useState(authStore.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 비밀번호 유효성 검사: 영문 + 숫자 조합, 8~12자리
  const isValidPassword = (value: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
    return regex.test(value);
  };

  const validPassword = isValidPassword(password as string);
  const isMatch =
    confirmPassword.length > 0 && (password as string) === confirmPassword;

  const handleNext = () => {
    if (!validPassword || !isMatch) return;
    // 최종 확정 비밀번호 저장
    authStore.password = password as string;
    navigate("/signup/nickname");
  };

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      <SignupHeader progress={50} />

      <div className="flex flex-col px-6 pt-[180px]">
        <SignupStepTitle step={2} title="비밀번호를 설정해 주세요." />

        {/* 비밀번호 입력 */}
        <div className="mb-8">
          <SignupInputField
            type="password"
            value={password as string}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle={true}
            onPasswordToggle={() => setShowPassword(!showPassword)}
            isPasswordVisible={showPassword}
          />
          {/* 조건 메시지 */}
          {password && !validPassword && (
            <p className="mt-2 text-sm text-right text-[#DF0001]">
              영문과 숫자 조합, 8~12자리
            </p>
          )}
        </div>

        <h1 className="text-lg font-semibold mb-8">비밀번호를 확인해 주세요.</h1>

        {/* 비밀번호 확인 입력 */}
        <SignupInputField
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPasswordToggle={true}
          onPasswordToggle={() => setShowConfirm(!showConfirm)}
          isPasswordVisible={showConfirm}
        />

        {/* 검증 메시지: 유효한 비밀번호일 때만 일치 여부 표시 */}
        {confirmPassword.length > 0 && validPassword && (
          <p
            className={`mt-2 text-sm text-right ${
              isMatch ? "text-[#64B1A4]" : "text-[#DF0001]"
            }`}
          >
            {isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
          </p>
        )}
      </div>

      {/* 다음 버튼 */}
      <div className="px-6 mt-16">
        <SignupButton onClick={handleNext} disabled={!validPassword || !isMatch}>
          다음
        </SignupButton>
      </div>
    </div>
  );
};

export default SignupPasswordConfirmStep;
