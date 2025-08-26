"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, AuthUser, UseLogin } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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

// Реальный логин через API
export const useLogin: UseLogin = () => {
  const login = useAuthStore((s) => s.login);

  return async ({ username, password }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let msg = "Ошибка авторизации";
      try {
        const e = await res.json();
        if (e?.message) msg = e.message;
      } catch {}
      throw new Error(msg);
    }

    // Ожидаемый ответ — подстрой под свой бэк
    // { token: string, user: { name: string, role: "admin" | "manager", email?, avatar? } }
    const data = await res.json();

    const user: AuthUser = {
      name: data.user?.name ?? username,
      role: data.user?.role ?? "manager",
      email: data.user?.email,
      avatar: data.user?.avatar,
    };

    login(user, data.token ?? null);
  };
};
