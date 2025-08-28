"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import type { Order } from "@/types/order";

const LS_KEY = "orders-dev";

const initialMock: Order[] = [
  {
    id: uuidv4(),
    createdAt: "2025-08-28",
    clientName: "Комбо клиент",
    clientPhone: "+996 709 190 947",
    clientAddress:
      "Ош область, Алай район, Конур-добо айыл аймагы, Арпа-Тектир айылы",
    product: "Комбо",
    amount: 38400,
    status: "бронь",
    payment: "в наличии",
    manager: "Dev Manager",
    depositAmount: 1000,
    buyoutAmount: 38400,
    deliveryType: "from_us",
    deliveryComment: "Курьер завтра",
    installmentProvider: undefined,
    installmentMonths: undefined,
  },
];

function loadFromLS(): Order[] {
  if (typeof window === "undefined") return initialMock;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : initialMock;
  } catch {
    return initialMock;
  }
}

function saveToLS(list: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      return loadFromLS();
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["order.create"],
    mutationFn: async (data: Omit<Order, "id" | "createdAt">) => {
      await new Promise((r) => setTimeout(r, 120));
      const now = new Date().toISOString().split("T")[0];
      const newItem: Order = { id: uuidv4(), createdAt: now, ...data };
      const current = loadFromLS();
      const next = [...current, newItem];
      saveToLS(next);
      return newItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["order.update"],
    mutationFn: async (data: Order) => {
      await new Promise((r) => setTimeout(r, 120));
      const current = loadFromLS();
      const next = current.map((o) =>
        o.id === data.id ? { ...o, ...data } : o
      );
      saveToLS(next);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["order.delete"],
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 120));
      const current = loadFromLS();
      const next = current.filter((o) => o.id !== id);
      saveToLS(next);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
