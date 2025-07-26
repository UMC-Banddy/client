import React from "react";
import { useSnapshot } from "valtio";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import logo from "../../assets/logos/LOGO1.svg";
import eyeOpen from "../../assets/icons/login/eye-open.svg";
import eyeClosed from "../../assets/icons/login/eye-closed.svg";
//import { login } from "././store/auth"; //연동시에 주석 해제

const LoginPage: React.FC = () => {
  const snap = useSnapshot(authStore);
  const navigate = useNavigate();

  const handleLogin = () => { //const handleLogin = async () => { //연동시에 주석 해제
    if (!snap.email || !snap.password) return;

    if (snap.email === "admin@banddy.com" && snap.password === "admin123") {
      authStore.role = "ADMIN";
      toast.success("로그인 되었습니다.");
      navigate("/home");
    } else if (snap.email === "user@banddy.com" && snap.password === "user123") {
      authStore.role = "USER";
      toast.success("로그인 되었습니다.");
      navigate("/home");
    } else {
      authStore.errorMessage = "아이디 또는 비밀번호가 맞지 않습니다.";
    }
  };

  const handleSignUp = () => {
    navigate("/signup/email");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center px-6 pt-[120px] pb-10 w-full">
      {/* 로고 */}
      <motion.img
        src={logo}
        alt="Banddy"
        className="mb-[64px] w-[165px] h-[42px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      <div className="w-[321px] space-y-6">
        {/* 아이디 */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-[#E9E9E9]">
            아이디
          </label>
          <input
            id="email"
            type="email"
            placeholder="이메일 또는 아이디"
            value={snap.email}
            onChange={(e) => {
              authStore.email = e.target.value;
              authStore.errorMessage = "";
            }}
            className="w-full h-[49px] bg-[#292929] text-white placeholder-[#959595] rounded-[9px] px-4 py-[13px] focus:outline-none"
          />
        </div>

        {/* 비밀번호 */}
        <div className="space-y-2 relative">
          <label htmlFor="password" className="block text-sm text-[#E9E9E9]">
            비밀번호
          </label>
          <input
            id="password"
            type={snap.showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={snap.password}
            onChange={(e) => {
              authStore.password = e.target.value;
              authStore.errorMessage = "";
            }}
            className="w-full h-[49px] bg-[#292929] text-white placeholder-[#959595] rounded-[9px] px-4 py-[13px] pr-12 focus:outline-none"
          />
          <button
            type="button"
            className="absolute right-4 top-[38px]"
            onClick={() => (authStore.showPassword = !authStore.showPassword)}
          >
            <img
              src={snap.showPassword ? eyeOpen : eyeClosed}
              alt="toggle visibility"
              className="w-5 h-5 opacity-70"
            />
          </button>
        </div>

        {/* 에러 메시지 */}
        {snap.errorMessage && (
          <p className="text-red-500 text-sm mt-1">{snap.errorMessage}</p>
        )}

        {/* 아이디/비밀번호 찾기 */}
        <div className="text-right mt-2 mb-[64px]">
          <button className="text-sm underline text-[#E9E9E9] opacity-70 cursor-default" disabled>
            아이디/비밀번호 찾기
          </button>
        </div>

        {/* 로그인 버튼 */}
        <button
          className="w-full h-[49px] bg-[#C7242D] text-black font-semibold rounded-[24px] py-[13px]"
          onClick={handleLogin}
        >
          LOG IN
        </button>

        {/* 회원가입 버튼 */}
        <button
          className="w-full h-[49px] bg-[#555555] text-[#CACACA] font-semibold rounded-[24px] py-[13px]"
          onClick={handleSignUp}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
