
import { API } from "@/api/API";
import { authStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/constants";

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await API.post(API_ENDPOINTS.AUTH.LOGIN, data);
    // const { accessToken, refreshToken } = res.data;
    const { accessToken, refreshToken, memberId } = res.data;
    
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("memberId", memberId.toString());

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
  return res.data;
};

export const sendEmailCode = async (email: string) => {
  const res = await API.post(API_ENDPOINTS.AUTH.SEND_CODE, { email });
  return res.data as string;
};

export const verifyEmailCode = async (code: string) => {
  const res = await API.post(API_ENDPOINTS.AUTH.VERIFY_CODE, { code });
  return res.data as { verified: boolean; message: string };
};

export const checkNickname = async (nickname: string) => {
  const res = await API.get(
    `${API_ENDPOINTS.AUTH.CHECK_NICKNAME}?nickname=${nickname}`
  );
  return res.data;
};


