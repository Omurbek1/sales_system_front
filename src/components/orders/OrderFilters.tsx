import { Select, Space } from "antd";
import { OrderStatus, PaymentType } from "@/types/order";

interface Props {
  status: OrderStatus | null;
  payment: PaymentType | null;
  manager: string | null;
  onChange: (filters: {
    status: OrderStatus | null;
    payment: PaymentType | null;
    manager: string | null;
  }) => void;
  managers: string[]; // список всех менеджеров для фильтра
}

const statusOptions: OrderStatus[] = [
  "бронь",
  "оформили",
  "отправлено",
  "получили",
  "возврат",
];
const paymentOptions: PaymentType[] = ["в наличии", "в рассрочку", "на заказ"];

const OrderFilters: React.FC<Props> = ({
  status,
  payment,
  manager,
  onChange,
  managers,
}) => {
  return (
    <Space style={{ marginBottom: 16 }} wrap>
      <Select
        placeholder="Статус"
        allowClear
        style={{ width: 160 }}
        value={status ?? undefined}
        options={statusOptions.map((s) => ({ value: s, label: s }))}
        onChange={(value) =>
          onChange({ status: value ?? null, payment, manager })
        }
      />
      <Select
        placeholder="Тип оплаты"
        allowClear
        style={{ width: 160 }}
        value={payment ?? undefined}
        options={paymentOptions.map((p) => ({ value: p, label: p }))}
        onChange={(value) =>
          onChange({ status, payment: value ?? null, manager })
        }
      />
      <Select
        placeholder="Менеджер"
        allowClear
        style={{ width: 160 }}
        value={manager ?? undefined}
        options={managers.map((m) => ({ value: m, label: m }))}
        onChange={(value) =>
          onChange({ status, payment, manager: value ?? null })
        }
      />
    </Space>
  );
};

export default OrderFilters;
