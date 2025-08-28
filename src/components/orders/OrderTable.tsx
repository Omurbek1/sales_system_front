import {
  Table,
  Tag,
  Select,
  message,
  Dropdown,
  Button,
  MenuProps,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Order, OrderStatus } from "@/types/order";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { EllipsisOutlined } from "@ant-design/icons";

interface Props {
  data: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

const statusOptions: OrderStatus[] = [
  "бронь",
  "оформили",
  "отправлено",
  "получили",
  "возврат",
];

const ellipsisCell = (text?: string) =>
  text ? (
    <span
      title={text}
      style={{
        display: "inline-block",
        maxWidth: 220,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  ) : (
    "—"
  );
const OrderTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
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
    {
      title: "Адрес",
      dataIndex: "clientAddress",
      key: "clientAddress",
      render: ellipsisCell,
    },
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
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => {
        const items: MenuProps["items"] = [
          { key: "edit", label: "Редактировать" },
          {
            key: "delete",
            label: (
              <Popconfirm
                title="Удалить заказ?"
                okText="Удалить"
                cancelText="Отмена"
                onConfirm={async () => {
                  try {
                    await onDelete(record.id);
                    message.success("Заказ удалён!");
                  } catch (err) {
                    console.error(err);
                    message.error("Ошибка при удалении заказа");
                  }
                }}
              >
                <span>Удалить</span>
              </Popconfirm>
            ),
          },
        ];
        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                if (key === "edit") onEdit(record);
              },
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={data} />;
};

export default OrderTable;
