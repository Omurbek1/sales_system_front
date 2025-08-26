"use client";
import * as dev from "./dev";
import * as prod from "./prod";

const isDev = process.env.NEXT_PUBLIC_APP_MODE === "dev";
const M = isDev ? dev : prod;

export const useManagers = M.useManagers;
export const useCreateManager = M.useCreateManager;
export const useUpdateManager = M.useUpdateManager;
export const useDeleteManager = M.useDeleteManager;
