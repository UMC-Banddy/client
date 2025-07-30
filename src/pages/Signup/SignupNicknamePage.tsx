import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos/white-star.svg";
import { checkNickname } from "../../store/auth";
import { authStore } from "../../store/authStore"; 

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
        authStore.nickname = nickname; // 중복 확인 성공 시 저장
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
    authStore.nickname = nickname; // 마지막 방어
    navigate("/signup/profile");
  };

  const canSubmit = isValidFormat && isAvailable;

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      <div className="w-full h-0.5 bg-[#959595]">
        <div className="w-3/4 h-full bg-[#C7242D]" />
      </div>

      <img src={logo} alt="step" className="absolute right-6 top-[18px] w-8 h-8" />

      <div className="flex flex-col px-6 pt-[180px]">
        <p className="text-sm text-[#959595] mb-1">Step. 3</p>
        <h1 className="text-lg font-semibold mb-8">닉네임을 설정해 주세요.</h1>

        <div className="relative">
          <input
            type="text"
            value={nickname}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full border-b border-[#959595] bg-transparent py-2 pr-[95px] focus:outline-none text-white"
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
        <button
          disabled={!canSubmit}
          onClick={handleNext}
          className={`w-full py-3 rounded-[24px] font-semibold transition ${
            canSubmit
              ? "bg-[#C7242D] text-[#000000]"
              : "bg-[#959595] text-[#555555] cursor-default"
          }`}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default SignupNicknamePage;
