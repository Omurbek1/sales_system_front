"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, AuthUser, UseLogin } from "./types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user: AuthUser, token?: string | null) =>
        set({ user, token: token ?? null }),
      logout: () => set({ user: null, token: null }),
      setUser: (user: AuthUser) => set({ user }),
    }),
    { name: "auth-storage" }
  )
);

// Доп. хук: мок-логин
export const useLogin: UseLogin = () => {
  const login = useAuthStore((s) => s.login);

  return async ({ username, password }) => {
    // мок-правила
    if (
      (username === "admin" || username === "manager") &&
      password === "1234"
    ) {
      const user: AuthUser = {
        name: username,
        role: username === "admin" ? "admin" : "manager",
      };
      login(user, null);
      return;
    }
    throw new Error("Неверный логин или пароль (DEV)");
  };
};
