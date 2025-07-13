import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logos/white-star.svg";

const SignupVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(299); // 4분 59초
  const [showPopup, setShowPopup] = useState(false);

  // 타이머 감소
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

  const handleConfirm = () => {
    setShowPopup(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 pt-6 relative">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate("/signup")}
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
        <div className="h-full bg-red-500 w-1/4 absolute top-0 left-0" />
      </div>

      {/* 로고 */}
      <img src={logo} alt="Banddy" className="w-8 h-8 absolute top-4 right-4" />

      {/* 내용 */}
      <div className="mt-20 flex-1 flex flex-col justify-center">
        <div>
          <p className="text-sm text-neutral-400 mb-1">Step. 1</p>
          <h1 className="text-lg font-semibold mb-8">
            인증번호를 입력해 주세요.
          </h1>

          {/* 인증번호 입력 */}
          <input
            type="text"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            className="w-full text-center tracking-widest text-2xl bg-transparent border-b border-neutral-500 py-2 focus:outline-none"
          />

          {/* 타이머 */}
          <div className="flex justify-end mt-2 text-sm">
            <span className={timeLeft <= 10 ? "text-red-500" : "text-neutral-400"}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* 재전송 */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setTimeLeft(299);
              setCode("");
            }}
            className="text-sm text-green-400 underline"
          >
            인증번호가 오지 않았나요? 재전송
          </button>
        </div>

        {/* 확인 버튼 */}
        <button
          disabled={code.length < 6}
          onClick={handleConfirm}
          className={`w-full py-3 mt-12 rounded-[24px] font-semibold transition ${
            code.length === 6
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-neutral-700 text-neutral-400 cursor-default"
          }`}
        >
          확인
        </button>
      </div>

      {/* 팝업 */}
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
              className="bg-white rounded-2xl p-6 w-72 text-center"
            >
              <img src={logo} alt="Banddy" className="w-8 h-8 mx-auto mb-4" />
              <p className="mb-6 text-black">인증이 완료되었습니다. Yay!</p>
              <button
                onClick={() => navigate("/signup/password")}
                className="w-full py-2 rounded-[24px] bg-red-600 hover:bg-red-700 text-white font-semibold"
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
