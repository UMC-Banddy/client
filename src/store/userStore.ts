import { proxy } from "valtio";

interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const userStore = proxy<UserState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

// Actions
export const userActions = {
  setUser: (user: User) => {
    userStore.user = user;
    userStore.isAuthenticated = true;
    userStore.error = null;
  },

  clearUser: () => {
    userStore.user = null;
    userStore.isAuthenticated = false;
    userStore.error = null;
  },

  setLoading: (isLoading: boolean) => {
    userStore.isLoading = isLoading;
  },

  setError: (error: string | null) => {
    userStore.error = error;
  },

  updateProfile: (updates: Partial<User>) => {
    if (userStore.user) {
      userStore.user = { ...userStore.user, ...updates };
    }
  },
};
