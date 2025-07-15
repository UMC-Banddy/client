import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logos/white-star.svg";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/signup/verify"); // 인증번호 입력 화면 경로
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-white px-6 pt-6 relative">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate("/")}
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

      {/* Progress Bar */}
      <div className="h-0.5 w-full bg-neutral-700 mt-10 mb-8 relative">
        <div className="h-full bg-red-500 w-1/4 absolute top-0 left-0" />
      </div>

      {/* 로고 */}
      <img src={logo} alt="Banddy" className="w-8 h-8 absolute top-4 right-4" />

      {/* 안내 */}
      <div className="mt-20">
        <p className="text-sm text-neutral-400 mb-1">Step. 1</p>
        <h1 className="text-lg font-semibold mb-8">이메일 아이디를 입력해주세요.</h1>

        {/* 입력창 */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@banddy.com"
          className="w-full border-b border-neutral-500 bg-transparent py-2 focus:outline-none placeholder-gray-500"
        />
      </div>

      {/* 인증번호 발송 버튼 */}
      <button
        disabled={!email}
        onClick={handleSendCode}
        className={`w-full py-3 mt-10 rounded-[24px] font-semibold transition ${
          email
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-neutral-700 text-neutral-400 cursor-default"
        }`}
      >
        인증번호 발송
      </button>

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
              className="bg-neutral-900 rounded-2xl p-6 w-72 text-center"
            >
              <img src={logo} alt="Banddy" className="w-8 h-8 mx-auto mb-4" />
              <p className="mb-6">인증번호가 발송되었습니다.</p>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/signup/verify");
                }}
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

export default SignupPage;
