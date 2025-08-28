"use client";

import { useEffect } from "react";
import { Form, Input, Select, Button, Space, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import MaskedInput from "antd-mask-input";
import { Order, OrderStatus, PaymentType } from "@/types/order";

interface Props {
  onSubmit: (data: Omit<Order, "id" | "createdAt">) => void;
  loading?: boolean;
  managerName: string; // менеджер по умолчанию (для создания)
  initial?: Partial<Order>; // ← добавлено: данные для редактирования
}

const statusOptions: OrderStatus[] = [
  "бронь",
  "оформили",
  "к отправку",
  "отправлено",
  "получили",
  "возврат",
  "выкуп",
];

const paymentOptions: PaymentType[] = [
  "в наличии",
  "на заказ",
  "в рассрочку (МПлюс)",
  "в рассрочку (Зеро 3 мес)",
  "в рассрочку (Зеро 8 мес)",
  "в рассрочку (Компаньон)",
];

const OrderForm: React.FC<Props> = ({
  onSubmit,
  loading,
  managerName,
  initial,
}) => {
  const [form] = Form.useForm();

  // вотчер статуса
  const status = Form.useWatch<OrderStatus>("status", form);
  const isBron = status === "бронь";

  // при смене initial обновляем форму
  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      form.setFieldsValue(initial);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const handleFinish = (values: any) => {
    let installmentProvider: Order["installmentProvider"];
    let installmentMonths: Order["installmentMonths"];

    switch (values.payment as PaymentType) {
      case "в рассрочку (МПлюс)":
        installmentProvider = "mplus";
        installmentMonths = 3;
        break;
      case "в рассрочку (Зеро 3 мес)":
        installmentProvider = "zero";
        installmentMonths = 3;
        break;
      case "в рассрочку (Зеро 8 мес)":
        installmentProvider = "zero";
        installmentMonths = 8;
        break;
      case "в рассрочку (Компаньон)":
        installmentProvider = "kompanion";
        installmentMonths = 12;
        break;
    }

    const payload: Omit<Order, "id" | "createdAt"> = {
      ...values,
      // суммы брони только если статус "бронь"
      depositAmount: isBron ? values.depositAmount : undefined,
      buyoutAmount: isBron ? values.buyoutAmount : undefined,
      installmentProvider,
      installmentMonths,
      // при создании — менеджер от текущего пользователя,
      // при редактировании можно оставить manager из initial (он уже в values, если был передан)
      manager: values.manager ?? initial?.manager ?? managerName,
    };

    onSubmit(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        status: "бронь" as OrderStatus,
        payment: "в наличии" as PaymentType,
        deliveryType: "from_us",
        // если редактирование — подмешаем
        ...initial,
      }}
    >
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
        rules={[{ required: true, message: "Введите номер телефона" }]}
      >
        <MaskedInput mask="+996 (000) 000-000" />
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

      {/* Поля для БРОНИ */}
      {isBron && (
        <>
          <Form.Item
            name="depositAmount"
            label="Сумма брони"
            rules={[
              { required: true, message: "Укажите сумму брони" },
              { type: "number", min: 0, message: "Не меньше 0" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="0" />
          </Form.Item>

          <Form.Item
            name="buyoutAmount"
            label="Сумма выкупа"
            rules={[
              { required: true, message: "Укажите сумму выкупа" },
              { type: "number", min: 0, message: "Не меньше 0" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
        </>
      )}

      {/* Доставка */}
      <Form.Item
        name="deliveryType"
        label="Доставка"
        rules={[{ required: true, message: "Выберите тип доставки" }]}
      >
        <Select
          options={[
            { value: "from_us", label: "От нас" },
            { value: "from_client", label: "От клиента" },
          ]}
        />
      </Form.Item>

      <Form.Item name="deliveryComment" label="Комментарий по доставке">
        <TextArea rows={3} placeholder="Например: курьер завтра после 17:00" />
      </Form.Item>

      {/* Менеджер (только показ) */}
      <Form.Item label="Менеджер">
        <Input value={initial?.manager ?? managerName} disabled />
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
