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

const OrderCreatePage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const { data: currentOrders } = useOrders();

  const handleSubmit = (formData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      id: uuidv4(),
      createdAt: new Date().toISOString().split("T")[0],
      ...formData,
      manager: currentUser.name,
    };

    const updatedOrders = [...(currentOrders ?? []), newOrder];
    queryClient.setQueryData(["orders"], updatedOrders);
    message.success("Заказ создан");
    router.push("/orders");
  };

  return (
    <MainLayout>
      <Typography.Title level={2}>Создание заказа</Typography.Title>
      <OrderForm onSubmit={handleSubmit} managerName={currentUser.name} />
    </MainLayout>
  );
};

export default OrderCreatePage;
