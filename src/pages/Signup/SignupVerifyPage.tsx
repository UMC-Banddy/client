import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import whiteStar from "../../assets/logos/white-star.svg";
import blackStar from "../../assets/logos/black-star.svg";
import { verifyEmailCode } from "../../store/auth";

const SignupVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(299);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");

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
        setShowPopup(true);
      } else {
        setError(res.message || "인증에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류로 인증에 실패했습니다.");
      console.error(err);
    }
  };

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      {/* 프로그레스바 */}
      <div className="w-full h-0.5 bg-[#959595]">
        <div className="w-1/4 h-full bg-[#C7242D]" />
      </div>

      {/* 별아이콘 */}
      <img
        src={whiteStar}
        alt="step"
        className="absolute right-6 top-[25px] w-8 h-8"
      />

      <div className="flex flex-col px-6 pt-[200px]">
        <p className="text-sm text-[#959595] mb-1">Step. 1</p>
        <h1 className="text-lg font-semibold mb-8">인증번호를 입력해 주세요.</h1>

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
            onClick={() => {
              setTimeLeft(299);
              setCode(["", "", "", "", ""]);
              setError("");
              const firstInput = document.getElementById("code-0");
              if (firstInput) firstInput.focus();
            }}
            className="text-[#64B1A4] focus:outline-none"
          >
            재전송
          </button>
        </div>

        <button
          disabled={code.join("").length !== 5}
          onClick={handleConfirm}
          className={`w-full py-3 mt-8 rounded-[24px] font-semibold transition ${
            code.join("").length === 5
              ? "bg-[#AD3634] text-[#000000]"
              : "bg-[#959595] text-[#696969] cursor-default"
          }`}
        >
          확인
        </button>
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
                인증이 완료되었습니다.
              </p>
              <button
                onClick={() => navigate("/signup/password")}
                className="w-[130px] mx-auto py-2 rounded-[24px] bg-[#AD3634] text-white font-semibold"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignupVerifyPage;
