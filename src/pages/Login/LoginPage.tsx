import React from "react";
import { useSnapshot } from "valtio";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import logo from "../../assets/logos/LOGO1.svg";

const LoginPage: React.FC = () => {
  const snap = useSnapshot(authStore);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!snap.email || !snap.password) {
      // 아무 변화 없음
      return;
    }

    // 간단한 인증 로직 (백엔드 연동 시 axios로 대체)
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 w-full bg-black text-white">
      <motion.img
        src={logo}
        alt="Banddy"
        className="mb-12 w-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />
      <div className="w-full max-w-sm space-y-4">
        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-sm mb-1">아이디</label>
          <input
            id="email"
            type="email"
            value={snap.email}
            onChange={(e) => {
              authStore.email = e.target.value;
              authStore.errorMessage = "";
            }}
            className="w-full bg-neutral-800 rounded-[9px] px-4 py-3 focus:outline-none"
          />
        </div>
        {/* 비밀번호 */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm mb-1">비밀번호</label>
          <input
            id="password"
            type={snap.showPassword ? "text" : "password"}
            value={snap.password}
            onChange={(e) => {
              authStore.password = e.target.value;
              authStore.errorMessage = "";
            }}
            className="w-full bg-neutral-800 rounded-[9px] px-4 py-3 focus:outline-none pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-9"
            onClick={() => (authStore.showPassword = !authStore.showPassword)}
          >
            {snap.showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.973 9.973 0 012.195-6.275m3.36-2.15a10.014 10.014 0 0110.185 1.575M19.8 14.15a9.996 9.996 0 01-3.585 3.675m-4.83.675a10.016 10.016 0 01-7.38-2.825M9 12a3 3 0 006 0 3 3 0 00-6 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {/* 에러 메시지 */}
        {snap.errorMessage && (
          <p className="text-red-500 text-sm mt-1">{snap.errorMessage}</p>
        )}
        {/* 아이디/비밀번호 찾기 */}
        <div className="text-right">
          <button className="text-sm underline opacity-70 cursor-default" disabled>
            아이디/비밀번호 찾기
          </button>
        </div>
        {/* 버튼 */}
        <button
          className="w-full py-3 mt-2 rounded-[24px] bg-red-600 hover:bg-red-700 font-semibold text-black"
          onClick={handleLogin}
        >
          LOG IN
        </button>
        <button
          className="w-full py-3 rounded-[24px] bg-neutral-700 hover:bg-neutral-600 font-semibold"
          onClick={handleSignUp}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
