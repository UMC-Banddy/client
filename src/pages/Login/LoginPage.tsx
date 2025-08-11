import React from "react";
import { useSnapshot } from "valtio";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import logo from "../../assets/logos/LOGO1.svg";
import { login } from "@/store/auth";
import LoginInputField from "./_components/LoginInputField";

const LoginPage: React.FC = () => {
  const snap = useSnapshot(authStore);
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!snap.email || !snap.password) {
    authStore.errorMessage = "이메일과 비밀번호를 모두 입력해주세요.";
    return;
  }

  try {
    await login({
      email: snap.email,
      password: snap.password,
    });

    toast.success("로그인 되었습니다.");
    navigate("/");
  } catch  {
    // 에러 메시지는 login 함수 내에서 이미 authStore에 저장됨 밑 코드 삭제
    //toast.error("로그인에 실패했습니다.");
  }
};
  /*
  const handleLogin = async () => {
    if (!snap.email || !snap.password) return;

    try {
      const res = await login({ email: snap.email, password: snap.password });

      // 로그인 성공 후 토큰 저장 (localStorage 또는 상태관리)
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      authStore.role = "USER"; // 기본값, 실제 role 분기 있으면 처리 필요

      toast.success("로그인 되었습니다.");
      navigate("/");
    } catch (err: any) {
      console.error("로그인 실패", err);
      authStore.errorMessage = "아이디 또는 비밀번호가 맞지 않습니다.";
    }
  };
*/
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
        <LoginInputField
          id="email"
          label="아이디"
          type="email"
          placeholder="이메일 아이디"
          value={snap.email}
          onChange={(e) => {
            authStore.email = e.target.value;
            authStore.errorMessage = "";
          }}
        />

        {/* 비밀번호 */}
        <LoginInputField
          id="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호"
          value={snap.password}
          onChange={(e) => {
            authStore.password = e.target.value;
            authStore.errorMessage = "";
          }}
          showPasswordToggle={true}
          onPasswordToggle={() => (authStore.showPassword = !authStore.showPassword)}
          isPasswordVisible={snap.showPassword}
        />

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
