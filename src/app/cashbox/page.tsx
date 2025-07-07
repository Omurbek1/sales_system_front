// pages/cashbox.tsx
"use client";
import MainLayout from "@/components/layout/MainLayout";
import { useCashbox } from "@/hooks/useCashbox";
import { useOrders } from "@/hooks/useOrders";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CashEntry, PaymentSource } from "@/types/cashbox";
import {
  Typography,
  Spin,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Space,
  Button,
  message,
  Radio,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import CashboxChart from "@/components/cashbox/CashboxChart";
import CashboxPieChart from "@/components/cashbox/CashboxPieChart";
import CashboxAddModal from "@/components/cashbox/CashboxAddModal";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const CashboxPage = () => {
  const { data, isLoading } = useCashbox();
  const { data: orders } = useOrders();
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();

  const [manager, setManager] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(6, "day"),
    dayjs(),
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  const allManagers = [...new Set((data ?? []).map((e) => e.manager))];
  const allProducts = [
    ...new Set((orders ?? []).map((o) => o.product ?? "Не указан")),
  ];

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((entry) => {
      const matchManager = !manager || entry.manager === manager;
      const matchDate =
        !range || dayjs(entry.date).isBetween(range[0], range[1], null, "[]");
      const matchProduct =
        !selectedProduct || (entry.product ?? "Не указан") === selectedProduct;
      return matchManager && matchDate && matchProduct;
    });
  }, [data, manager, range, selectedProduct]);

  const total = useMemo(() => {
    return filtered.reduce((sum, e) => sum + e.amount, 0);
  }, [filtered]);

  const productTotals = useMemo(() => {
    const grouped: Record<string, { full: number; reserve: number }> = {};
    (orders ?? []).forEach((order) => {
      const key = order.product || "Не указан";
      if (!grouped[key]) grouped[key] = { full: 0, reserve: 0 };
      if (order.status === "бронь") {
        grouped[key].reserve += (order.amount || 0) * 0.2;
      } else if (order.status === "получили") {
        grouped[key].full += order.amount || 0;
      }
    });
    return grouped;
  }, [orders]);

  const orderChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    (orders ?? []).forEach((order) => {
      if (order.status === "получили") {
        const dateKey = dayjs(order.createdAt).format("YYYY-MM-DD");
        grouped[dateKey] = (grouped[dateKey] || 0) + order.amount;
      }
    });
    return Object.entries(grouped).map(([date, amount]) => ({ date, amount }));
  }, [orders]);

  const handleAdd = (formData: {
    amount: number;
    source: PaymentSource;
    date: string;
    product?: string;
  }) => {
    const newEntry: CashEntry = {
      id: uuidv4(),
      amount: formData.amount,
      source: formData.source,
      date: dayjs(formData.date).format("YYYY-MM-DD"),
      manager: currentUser.name,
      product: formData.product || "Не указан",
    };

    const currentData =
      queryClient.getQueryData<CashEntry[]>(["cashbox"]) ?? [];
    queryClient.setQueryData(["cashbox"], [...currentData, newEntry]);
    message.success("Поступление добавлено");
    setModalOpen(false);
  };

  return (
    <MainLayout>
      <Typography.Title level={2}>💰 Касса</Typography.Title>

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space wrap>
            <Select
              allowClear
              placeholder="Менеджер"
              value={manager ?? undefined}
              onChange={(val) => setManager(val ?? null)}
              options={allManagers.map((m) => ({ value: m, label: m }))}
              style={{ width: 180 }}
            />
            <Select
              allowClear
              placeholder="Товар"
              value={selectedProduct ?? undefined}
              onChange={(val) => setSelectedProduct(val ?? null)}
              options={allProducts.map((p) => ({ value: p, label: p }))}
              style={{ width: 180 }}
            />
            <RangePicker
              value={range}
              onChange={(dates) => setRange(dates as any)}
              style={{ width: 300 }}
            />
            <Radio.Group
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              options={[
                { label: "По дням", value: "day" },
                { label: "По неделям", value: "week" },
                { label: "По месяцам", value: "month" },
              ]}
              optionType="button"
              buttonStyle="solid"
            />
          </Space>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            ➕ Добавить поступление
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Typography.Title level={4}>
          Общая сумма: {total.toLocaleString()} сом
        </Typography.Title>
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="График поступлений">
            {isLoading ? (
              <Spin />
            ) : (
              <CashboxChart data={filtered} groupBy={groupBy} />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="По источникам оплаты">
            {isLoading ? <Spin /> : <CashboxPieChart data={filtered} />}
          </Card>
        </Col>
      </Row>

      <Card title="График заказов (полученные)" style={{ marginTop: 24 }}>
        <ul>
          {orderChartData.map((point) => (
            <li key={point.date}>
              {point.date}: {point.amount.toLocaleString()} сом
            </li>
          ))}
        </ul>
      </Card>

      <Card
        title="Сумма по товарам (бронь и получено)"
        style={{ marginTop: 24 }}
      >
        <ul>
          {Object.entries(productTotals).map(([product, { full, reserve }]) => (
            <li key={product}>
              <strong>{product}</strong>: Бронь: {reserve.toLocaleString()} сом,
              Получено: {full.toLocaleString()} сом
            </li>
          ))}
        </ul>
      </Card>

      <CashboxAddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        defaultDate={dayjs()}
      />
    </MainLayout>
  );
};

export default CashboxPage;
