import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import whiteStar from "../../assets/logos/white-star.svg";
import blackstar from "../../assets/logos/black-star.svg";

import { authStore } from "../../store/authStore";
import { sendEmailCode } from "../../store/auth";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState(authStore.email);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  /* 이전꺼
  const handleSendCode = () => {
    if (!email) return;
    authStore.email = email; // 전역 상태에 저장
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/signup/verify");
    }, 1500);
  };
  */
 const handleSendCode = async () => {
  if (!email) return;
  try {
    await sendEmailCode(email); 
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/signup/verify");
    }, 1500);
  } catch (error) {
    console.error("이메일 인증 요청 실패", error);
    
  }
};

  return (
    <div className="relative w-full min-h-screen max-w-md mx-auto bg-black text-white overflow-hidden">
      {/* Progress bar*/}
      <div className="w-full h-0.5 bg-[#959595]">
        <div className="w-1/4 h-full bg-[#C7242D]" />
      </div>

      {/* 별 아이콘 */}
      <img src={whiteStar} alt="step" className="absolute right-6 top-[25px] w-8 h-8" />

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col items-start justify-center px-6 text-left min-h-[calc(100vh-180px)]">
        <p className="text-sm text-[#959595] mb-1">Step. 1</p>
        <h1 className="text-lg font-semibold mb-8">이메일 아이디를 입력해주세요.</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@banddy.com"
          className="w-full border-b border-[#959595] bg-transparent py-2 focus:outline-none placeholder-[#959595] text-sm"
        />
      </div>

      {/* 인증번호 발송 버튼*/}
      <div className="px-6 pb-8 bottom-10 left-0 right-0 max-w-md mx-auto bg-black">
        <button
          onClick={handleSendCode}
          disabled={!email}
          className={`w-full h-[49px] rounded-[24px] font-semibold transition ${
            email
              ? "bg-[#C7242D] text-white"
              : "bg-[#959595] text-[#696969] cursor-default"
          }`}
        >
          인증번호 발송
        </button>
      </div>

      {/* 팝업 애니메이션 */}
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
              <img src={blackstar} alt="Banddy" className="w-12 h-12 mx-auto mb-4" />
              <p className="mb-6 text-[#292929] font-medium text-base">
                인증번호가 발송되었습니다.
              </p>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/signup/verify");
                }}
                className="w-[130px] mx-auto py-2 rounded-[24px] bg-[#C7242D] text-white font-semibold"
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
