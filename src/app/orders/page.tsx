"use client";
import MainLayout from "@/components/layout/MainLayout";
import { useOrders } from "@/hooks/useOrders";
import OrderTable from "@/components/orders/OrderTable";
import OrderFilters from "@/components/orders/OrderFilters";
import { Alert, Spin, Typography } from "antd";
import { useState, useMemo } from "react";
import { OrderStatus, PaymentType } from "@/types/order";

const OrdersPage = () => {
  const { data, isLoading, error } = useOrders();
  const [filters, setFilters] = useState<{
    status: OrderStatus | null;
    payment: PaymentType | null;
    manager: string | null;
  }>({ status: null, payment: null, manager: null });

  const filteredData = useMemo(() => {
    return (data ?? []).filter((order) => {
      return (
        (!filters.status || order.status === filters.status) &&
        (!filters.payment || order.payment === filters.payment) &&
        (!filters.manager || order.manager === filters.manager)
      );
    });
  }, [data, filters]);

  const allManagers = [...new Set((data ?? []).map((o) => o.manager))];

  return (
    <MainLayout>
      <Typography.Title level={2}>Список заказов</Typography.Title>

      <OrderFilters {...filters} onChange={setFilters} managers={allManagers} />

      {isLoading && <Spin />}
      {error && <Alert message="Ошибка загрузки заказов" type="error" />}
      {data && <OrderTable data={filteredData} />}
    </MainLayout>
  );
};

export default OrdersPage;
