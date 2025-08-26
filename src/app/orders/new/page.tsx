"use client";
import MainLayout from "@/components/layout/MainLayout";
import OrderForm from "@/components/orders/OrderForm";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Typography, message } from "antd";
import { Order } from "@/types/order";
import { v4 as uuidv4 } from "uuid";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useOrders } from "@/hooks/useOrders";
import { useAuthStore } from "@/store/auth";

const OrderCreatePage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();
  const currentUser = user?.name;
  const { data: currentOrders } = useOrders();

  const handleSubmit = (formData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      id: uuidv4(),
      createdAt: new Date().toISOString().split("T")[0],
      ...formData,
      manager: currentUser ?? "Неизвестный менеджер",
    };

    const updatedOrders = [...(currentOrders ?? []), newOrder];
    queryClient.setQueryData(["orders"], updatedOrders);
    message.success("Заказ создан");
    router.push("/orders");
  };

  return (
    <MainLayout>
      <Typography.Title level={2}>Создание заказа</Typography.Title>
      <OrderForm
        onSubmit={handleSubmit}
        managerName={currentUser ?? "Неизвестный менеджер"}
      />
    </MainLayout>
  );
};

export default OrderCreatePage;
