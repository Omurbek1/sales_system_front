import { Table, Tag, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Order, OrderStatus } from "@/types/order";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  data: Order[];
}

const statusOptions: OrderStatus[] = [
  "бронь",
  "оформили",
  "отправлено",
  "получили",
  "возврат",
];

const OrderTable: React.FC<Props> = ({ data }) => {
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();

  const canEditStatus = (order: Order) => {
    return currentUser.role === "admin" || currentUser.name === order.manager;
  };

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    const prevOrders = queryClient.getQueryData<Order[]>(["orders"]) || [];
    const updated = prevOrders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    queryClient.setQueryData(["orders"], updated);
    message.success("Статус обновлён");
  };

  const columns: ColumnsType<Order> = [
    { title: "Клиент", dataIndex: "clientName", key: "clientName" },
    { title: "Телефон", dataIndex: "clientPhone", key: "clientPhone" },
    { title: "Адрес", dataIndex: "clientAddress", key: "clientAddress" },
    { title: "Товар", dataIndex: "product", key: "product" },
    { title: "Сумма", dataIndex: "amount", key: "amount" },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status, record) =>
        canEditStatus(record) ? (
          <Select
            value={status}
            onChange={(value) => updateStatus(record.id, value)}
            style={{ width: 150 }}
            options={statusOptions.map((s) => ({ label: s, value: s }))}
          />
        ) : (
          <Tag color="blue">{status}</Tag>
        ),
    },
    {
      title: "Оплата",
      dataIndex: "payment",
      key: "payment",
      render: (p) => <Tag color="green">{p}</Tag>,
    },
    { title: "Менеджер", dataIndex: "manager", key: "manager" },
    { title: "Дата", dataIndex: "createdAt", key: "createdAt" },
  ];

  return <Table rowKey="id" columns={columns} dataSource={data} />;
};

export default OrderTable;
