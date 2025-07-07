import { Form, Input, Select, Button, Space } from "antd";
import { Order, OrderStatus, PaymentType } from "@/types/order";

interface Props {
  onSubmit: (data: Omit<Order, "id" | "createdAt">) => void;
  loading?: boolean;
  managerName: string;
}

const statusOptions: OrderStatus[] = [
  "бронь",
  "оформили",
  "отправлено",
  "получили",
  "возврат",
];
const paymentOptions: PaymentType[] = ["в наличии", "в рассрочку", "на заказ"];

const OrderForm: React.FC<Props> = ({ onSubmit, loading, managerName }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item
        name="clientName"
        label="Имя клиента"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="clientPhone"
        label="Телефон клиента"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="clientAddress"
        label="Адрес клиента"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="product" label="Товар" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="Статус заказа"
        rules={[{ required: true }]}
      >
        <Select options={statusOptions.map((s) => ({ value: s, label: s }))} />
      </Form.Item>
      <Form.Item name="payment" label="Тип оплаты" rules={[{ required: true }]}>
        <Select options={paymentOptions.map((p) => ({ value: p, label: p }))} />
      </Form.Item>

      <Form.Item label="Менеджер">
        <Input value={managerName} disabled />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Сохранить заказ
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;
