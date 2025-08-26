"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Manager } from "@/types/manager";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Хелпер для fetch
async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
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

// -------- Queries & Mutations (PROD) --------

export function useManagers() {
  return useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      // Ожидаем ответ: Manager[]
      return api<Manager[]>(`${API_BASE}/managers`);
    },
  });
}

export function useCreateManager() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["manager.create"],
    mutationFn: async (data: Omit<Manager, "id" | "createdAt">) => {
      // Ожидаем ответ: созданный Manager
      return api<Manager>(`${API_BASE}/managers`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}

export function useUpdateManager() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["manager.update"],
    mutationFn: async (data: Manager) => {
      // Ожидаем ответ: обновлённый Manager
      return api<Manager>(`${API_BASE}/managers/${data.id}`, {
        method: "PUT", // или PATCH — подстрой под бэк
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}

export function useDeleteManager() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["manager.delete"],
    mutationFn: async (id: string) => {
      await api<void>(`${API_BASE}/managers/${id}`, { method: "DELETE" });
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}
