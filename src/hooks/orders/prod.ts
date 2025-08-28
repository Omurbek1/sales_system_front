"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/types/order";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    // credentials: "include", // если нужны куки
    ...init,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => api<Order[]>("/orders"),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["order.create"],
    mutationFn: async (data: Omit<Order, "id" | "createdAt" | "id">) =>
      api<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["order.update"],
    mutationFn: async (data: Order) =>
      api<Order>(`/orders/${data.id}`, {
        method: "PUT", // или 'PATCH'
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["order.delete"],
    mutationFn: async (id: string) => {
      await api<void>(`/orders/${id}`, { method: "DELETE" });
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
