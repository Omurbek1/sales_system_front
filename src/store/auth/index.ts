"use client";
import * as dev from "./dev";
import * as prod from "./prod";

const isDev = process.env.NEXT_PUBLIC_APP_MODE === "dev";
const M = isDev ? dev : prod;

export const useAuthStore = M.useAuthStore;
export const useLogin = M.useLogin;
