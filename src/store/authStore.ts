import { proxy } from "valtio";

export interface AuthState {
  email: string;
  password: string;
  showPassword: boolean;
  errorMessage: string;
  role: "USER" | "ADMIN" | null;
}

export const authStore = proxy<AuthState>({
  email: "",
  password: "",
  showPassword: false,
  errorMessage: "",
  role: null,
});
