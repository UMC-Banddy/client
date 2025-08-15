import { API } from "@/api/API";
import { authStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/constants";

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await API.post(API_ENDPOINTS.AUTH.LOGIN, data);
    const { accessToken, refreshToken, memberId } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (memberId !== undefined && memberId !== null) {
      localStorage.setItem("memberId", String(memberId));
    }

    authStore.accessToken = accessToken;
    authStore.refreshToken = refreshToken;
    authStore.isAuthenticated = true;
    authStore.role = "USER";
    authStore.errorMessage = "";

    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      authStore.errorMessage = "아이디 또는 비밀번호가 맞지 않습니다.";
    }
    throw error;
  }
};

export const signupMember = async (data: {
  email: string;
  password: string;
  nickname: string;
  gender: string;
  region: string;
  age: number;
}) => {
  const res = await API.post(API_ENDPOINTS.AUTH.SIGNUP, data);

  // 서버가 토큰을 즉시 내려주면 자동 로그인 처리
  const { accessToken, refreshToken, memberId } = res.data ?? {};

  if (accessToken && refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (memberId !== undefined && memberId !== null) {
      localStorage.setItem("memberId", String(memberId));
    }

    authStore.accessToken = accessToken;
    authStore.refreshToken = refreshToken;
    authStore.isAuthenticated = true;
    authStore.role = "USER";
    authStore.errorMessage = "";
  }

  return res.data;
};

export const sendEmailCode = async (email: string) => {
  try {
    const res = await API.post(API_ENDPOINTS.AUTH.SEND_CODE, { email });
    return res.data as string;
  } catch (error: any) {
    // 이미 가입된 이메일이면 400
    if (error?.response?.status === 400) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }
    throw error;
  }
};

export const verifyEmailCode = async (email: string, code: string) => {
  try {
    const res = await API.post(API_ENDPOINTS.AUTH.VERIFY_CODE, { email, code });
    return res.data as { verified: boolean; message: string };
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("서버 오류로 인증에 실패했습니다.");
  }
};

export const checkNickname = async (nickname: string) => {
  const res = await API.get(
    `${API_ENDPOINTS.AUTH.CHECK_NICKNAME}?nickname=${encodeURIComponent(nickname)}`
  );
  return res.data;
};
