"use client";

import * as dev from "./dev";
import * as prod from "./prod";

const isDev = process.env.NEXT_PUBLIC_APP_MODE === "dev";
const M = isDev ? dev : prod;

export const useOrders = M.useOrders;
export const useCreateOrder = M.useCreateOrder;
export const useUpdateOrder = M.useUpdateOrder;
export const useDeleteOrder = M.useDeleteOrder;
