import { proxy } from "valtio";

export type UserRole = "USER" | "ADMIN" | null;

export interface AuthState {
  // 회원가입/로그인 입력값 관련 상태
  email: string;
  password: string;
  nickname: string;
  gender: string;
  region: string;
  age: number;

  // UI 상태
  showPassword: boolean;
  errorMessage: string;

  // 인증/인가 관련 상태
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: UserRole;
}

export const authStore = proxy<AuthState>({
  // 회원정보
  email: "",
  password: "",
  nickname: "",
  gender: "",
  region: "",
  age: 0,

  // UI
  showPassword: false,
  errorMessage: "",

  // 인증상태
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  role: null,
});

