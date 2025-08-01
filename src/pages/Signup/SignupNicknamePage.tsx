import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkNickname } from "../../store/auth";
import { authStore } from "../../store/authStore";
import SignupHeader from "./_components/SignupHeader";
import SignupStepTitle from "./_components/SignupStepTitle";
import SignupInputField from "./_components/SignupInputField";
import SignupButton from "./_components/SignupButton";

const SignupNicknamePage: React.FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [isValidFormat, setIsValidFormat] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  const validateFormat = (value: string) => {
    const regex = /^[A-Za-z0-9]{2,10}$/;
    return regex.test(value);
  };

  const handleChange = (value: string) => {
    setNickname(value);
    const valid = validateFormat(value);
    setIsValidFormat(valid);
    setIsAvailable(null);
    if (value.length === 0) {
      setMessage("");
    } else if (!valid) {
      setMessage("영문/숫자 가능, 2~10자");
    } else {
      setMessage("");
    }
  };

  const handleCheckDuplicate = async () => {
    if (!isValidFormat) return;

    try {
      const res = await checkNickname(nickname);
      if (res.available) {
        setIsAvailable(true);
        setMessage("사용 가능한 닉네임입니다.");
        authStore.nickname = nickname;
      } else {
        setIsAvailable(false);
        setMessage("사용 불가능한 닉네임입니다.");
      }
    } catch (err) {
      console.error("닉네임 중복확인 오류:", err);
      setIsAvailable(false);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  const handleNext = () => {
    authStore.nickname = nickname;
    navigate("/signup/profile");
  };

  const canSubmit = isValidFormat && isAvailable;

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      <SignupHeader progress={75} />

      <div className="flex flex-col px-6 pt-[180px]">
        <SignupStepTitle step={3} title="닉네임을 설정해 주세요." />

        <div className="relative">
          <SignupInputField
            type="text"
            value={nickname}
            onChange={(e) => handleChange(e.target.value)}
            className="pr-[0px]"
          />
          <button
            type="button"
            onClick={handleCheckDuplicate}
            disabled={!isValidFormat}
            className={`absolute right-0 top-1/2 -translate-y-1/2 px-4 py-[6px] text-sm rounded-[7px] border ${
              isValidFormat
                ? "border-white text-white"
                : "border-[#555555] text-[#555555] cursor-default"
            }`}
          >
            중복확인
          </button>
        </div>

        {message && (
          <p
            className={`text-sm mt-2 text-right ${
              isAvailable === true
                ? "text-[#79D000]"
                : isAvailable === false
                ? "text-[#DF0001]"
                : !isValidFormat
                ? "text-[#DF0001]"
                : "text-[#959595]"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="px-6 mt-36">
        <SignupButton
          onClick={handleNext}
          disabled={!canSubmit}
        >
          다음
        </SignupButton>
      </div>
    </div>
  );
};

export default SignupNicknamePage;
