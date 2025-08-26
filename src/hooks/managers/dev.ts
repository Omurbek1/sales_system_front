"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import type { Manager } from "@/types/manager";

// Ключ хранилища
const LS_KEY = "managers-dev";

// Инициализация мок-данных
const initialMock: Manager[] = [
  {
    id: uuidv4(),
    name: "Иван Петров",
    phone: "+996 555 11-22-33",
    email: "ivan@example.com",
    createdAt: "2025-08-01",
    role: "manager",
  },
  {
    id: uuidv4(),
    name: "Ольга Сидорова",
    phone: "+996 700 44-55-66",
    email: "olga@example.com",
    createdAt: "2025-08-10",
    role: "manager",
  },
];

function loadFromLS(): Manager[] {
  if (typeof window === "undefined") return initialMock;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Manager[]) : initialMock;
  } catch {
    return initialMock;
  }
}

function saveToLS(list: Manager[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

// -------- Queries & Mutations (DEV) --------

export function useManagers() {
  return useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return loadFromLS();
    },
  });
}

export function useCreateManager() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["manager.create"],
    mutationFn: async (data: Omit<Manager, "id" | "createdAt">) => {
      await new Promise((r) => setTimeout(r, 150));
      const now = new Date().toISOString().split("T")[0];
      const newItem: Manager = { id: uuidv4(), createdAt: now, ...data };
      const current = loadFromLS();
      const next = [...current, newItem];
      saveToLS(next);
      return newItem;
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
      await new Promise((r) => setTimeout(r, 150));
      const current = loadFromLS();
      const next = current.map((m) =>
        m.id === data.id ? { ...m, ...data } : m
      );
      saveToLS(next);
      return data;
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
      await new Promise((r) => setTimeout(r, 150));
      const current = loadFromLS();
      const next = current.filter((m) => m.id !== id);
      saveToLS(next);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}
