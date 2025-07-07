"use client";
import { Modal, Form, Input } from "antd";
import { Manager } from "@/types/manager";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<Manager, "id" | "createdAt">) => void;
  initialValues?: Partial<Manager>;
}

const ManagerFormModal: React.FC<Props> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    }
  }, [open, initialValues]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? "Редактировать менеджера" : "Добавить менеджера"}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
        }}
      >
        <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="login" label="Логин" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: !initialValues, message: "Введите пароль" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManagerFormModal;
