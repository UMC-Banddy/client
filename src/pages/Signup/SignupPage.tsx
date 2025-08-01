import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import blackstar from "../../assets/logos/black-star.svg";
import { authStore } from "../../store/authStore";
import { sendEmailCode } from "../../store/auth";
import SignupHeader from "./_components/SignupHeader";
import SignupStepTitle from "./_components/SignupStepTitle";
import SignupInputField from "./_components/SignupInputField";
import SignupButton from "./_components/SignupButton";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState(authStore.email);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) return;
    try {
      const message = await sendEmailCode(email);
      console.log("이메일 전송 응답:", message);

      authStore.email = email;

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
      <SignupHeader progress={25} />

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col  justify-center px-6 text-left min-h-[calc(100vh-180px)]">
        <SignupStepTitle step={1} title="이메일 아이디를 입력해주세요." />

        <SignupInputField
          type="email"
          placeholder="example@banddy.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* 인증번호 발송 버튼 */}
      <div className="px-6 pb-8 bottom-10 left-0 right-0 max-w-md mx-auto bg-black">
        <SignupButton
          onClick={handleSendCode}
          disabled={!email}
        >
          인증번호 발송
        </SignupButton>
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
              <SignupButton
                onClick={() => {
                  setShowPopup(false);
                  navigate("/signup/verify");
                }}
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

export default SignupPage;
