import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import blackStar from "../../assets/logos/black-star.svg";
import { verifyEmailCode, sendEmailCode } from "../../store/auth";
import { authStore } from "../../store/authStore";
import SignupHeader from "./_components/SignupHeader";
import SignupStepTitle from "./_components/SignupStepTitle";
import SignupButton from "./_components/SignupButton";

const SignupVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(299);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    if (value && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleConfirm = async () => {
    const finalCode = code.join("");
    if (finalCode.length !== 5) return;

    try {
      const res = await verifyEmailCode(finalCode);
      if (res.verified) {
        setPopupMessage("인증이 완료되었습니다.");
        setIsSuccess(true);
        setShowPopup(true);
      } else {
        setPopupMessage("인증번호가 맞지 않습니다.");
        setIsSuccess(false);
        setShowPopup(true);
      }
    } catch (err) {
      setPopupMessage("서버 오류로 인증에 실패했습니다.");
      setIsSuccess(false);
      setShowPopup(true);
      console.error(err);
    }
  };

  const handleResend = async () => {
    // 이메일이 없다면 첫 단계로 유도
    if (!authStore.email) {
      setError("이메일 정보가 없습니다. 처음 단계에서 다시 시도해 주세요.");
      return;
    }
    try {
      setResendLoading(true);
      await sendEmailCode(authStore.email); // 재전송 API 호출
      // 팝업 알림 + 타이머/입력 초기화
      setPopupMessage("인증번호가 발송되었습니다.");
      setIsSuccess(false); // 팝업 확인 시 이동 없이 닫히도록 함
      setShowPopup(true);

      setTimeLeft(299);
      setCode(["", "", "", "", ""]);
      setError("");

      const firstInput = document.getElementById("code-0");
      if (firstInput) firstInput.focus();
    } catch (err) {
      console.error("인증번호 재발송 실패", err);
      setError("인증번호 재발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setResendLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (isSuccess) {
      navigate("/signup/password");
    }
  };

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      <SignupHeader progress={25} />

      <div className="flex flex-col px-6 pt-[200px]">
        <SignupStepTitle step={1} title="인증번호를 입력해 주세요." />

        <div className="flex justify-between mb-2 gap-[8px]">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(i, e.target.value)}
              className="w-[48px] h-[48px] text-center text-lg rounded-[6px] bg-[#959595] text-white placeholder-transparent focus:outline-none"
            />
          ))}
        </div>

        <div
          className={`text-right text-sm mt-1 ${
            timeLeft <= 10 ? "text-[#DF0001]" : "text-[#CACACA]"
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex flex-col items-center px-6 mt-20">
        <div className="text-sm mt-6">
          <span className="text-[#666666]">인증번호가 오지 않았나요? </span>
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-[#64B1A4] focus:outline-none disabled:opacity-50"
          >
            {resendLoading ? "재전송 중..." : "재전송"}
          </button>
        </div>

        <SignupButton
          onClick={handleConfirm}
          disabled={code.join("").length !== 5}
          className="mt-8"
        >
          확인
        </SignupButton>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#E9E9E9] rounded-[18px] p-6 w-[300px] text-center"
            >
              <img
                src={blackStar}
                alt="Banddy"
                className="w-12 h-12 mx-auto mb-4"
              />
              <p className="mb-6 text-[#292929] text-base font-medium">
                {popupMessage}
              </p>
              <SignupButton
                onClick={handlePopupClose}
                variant="popup"
                className="mx-auto"
              >
                확인
              </SignupButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignupVerifyPage;
