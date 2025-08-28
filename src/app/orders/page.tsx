"use client";

import MainLayout from "@/components/layout/MainLayout";
import OrderTable from "@/components/orders/OrderTable";
import OrderFilters from "@/components/orders/OrderFilters";
import OrderForm from "@/components/orders/OrderForm";

import { Alert, Button, Modal, Spin, Typography, Space, App } from "antd";
import { useMemo, useState } from "react";
import { Order, OrderStatus, PaymentType } from "@/types/order";
import { useAuthStore } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";

import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from "@/hooks/orders"; // ✅

const OrdersPage = () => {
  const qc = useQueryClient();
  const { message } = App.useApp();

  const { data, isLoading, error } = useOrders();

  const { user } = useAuthStore();
  const managerName = user?.name ?? "Неизвестный менеджер";

  const [filters, setFilters] = useState<{
    status: OrderStatus | null;
    payment: PaymentType | null;
    manager: string | null;
  }>({ status: null, payment: null, manager: null });

  const filteredData: Order[] = useMemo(() => {
    return (data ?? []).filter(
      (order: Order) =>
        (!filters.status || order.status === filters.status) &&
        (!filters.payment || order.payment === filters.payment) &&
        (!filters.manager || order.manager === filters.manager)
    );
  }, [data, filters]);

  const allManagers = [...new Set((data ?? []).map((o: Order) => o.manager))];

  // модалка + режим
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const openCreate = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  const handleSubmit = async (formData: Omit<Order, "id" | "createdAt">) => {
    try {
      if (editingOrder) {
        await updateOrder.mutateAsync({ ...editingOrder, ...formData });
        message.success("Заказ обновлён");
      } else {
        await createOrder.mutateAsync(formData);
        message.success("Заказ добавлен");
      }
      setIsModalOpen(false);
      setEditingOrder(null);
    } catch (e: any) {
      message.error(e?.message || "Ошибка сохранения заказа");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder.mutateAsync(id);
      message.success("Заказ удалён");
      qc.invalidateQueries({ queryKey: ["orders"] });
    } catch (e: any) {
      message.error(e?.message || "Ошибка удаления");
    }
  };

  return (
    <MainLayout>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Список заказов
        </Typography.Title>
        <Button type="primary" onClick={openCreate}>
          Новый заказ
        </Button>
      </Space>

      <OrderFilters {...filters} onChange={setFilters} managers={allManagers} />

      {isLoading && <Spin />}
      {error && <Alert type="error" message="Ошибка загрузки заказов" />}
      {data && (
        <OrderTable
          data={filteredData}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        title={editingOrder ? "Редактировать заказ" : "Новый заказ"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        destroyOnHidden
        footer={null}
        maskClosable={false}
      >
        <OrderForm
          onSubmit={handleSubmit}
          managerName={editingOrder ? editingOrder.manager : managerName}
          initial={editingOrder ?? undefined}
          loading={createOrder.isPending || updateOrder.isPending}
        />
      </Modal>
    </MainLayout>
  );
};

export default OrdersPage;
