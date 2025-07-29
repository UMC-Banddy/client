import { API } from "@/api/API";

// 회원가입 API
export const signupMember = async (data: {
  email: string;
  password: string;
  nickname: string;
  gender: string;
  region: string;
  district: string;
  age: number;
}) => {
  const res = await API.post("/member", data);
  return res.data;
};

// 이메일 인증번호 발송 API
export const sendEmailCode = async (email: string) => {
  const res = await API.post("/auth/send", { email });
  return res.data;
};

// 닉네임 중복 확인
export const checkNickname = async (nickname: string) => {
  const res = await API.get(`/member/check-nickname?nickname=${nickname}`);
  return res.data;
};
