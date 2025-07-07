import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  name: string;
  role: "admin" | "manager";
  email?: string;
  avatar?: string;
}

interface AuthStore {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage", // key для localStorage
    }
  )
);
