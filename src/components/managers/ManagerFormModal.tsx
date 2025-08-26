"use client";
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import type { Manager } from "@/types/manager";
import { MaskedInput } from "antd-mask-input";

type ManagerFormValues = Omit<Manager, "id" | "createdAt"> & {
  login: string;
  password?: string;
};

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: ManagerFormValues) => void; // <-- теперь отдаём и login/password
  initialValues?: Partial<Manager> & { login?: string }; // пароль не сохраняем в initial
  submitting?: boolean;
}

const ManagerFormModal: React.FC<Props> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  submitting = false,
}) => {
  const [form] = Form.useForm<ManagerFormValues>();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (open) {
      form.setFieldsValue((initialValues as any) || {});
    }
  }, [open, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? "Редактировать менеджера" : "Добавить менеджера"}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okButtonProps={{ loading: submitting }}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          // если instagram пустой — генерируем автоматически
          if (!values.instagramUsername && values.name) {
            values.instagramUsername = values.name
              .toLowerCase()
              .replace(/\s+/g, "_");
          }

          onSubmit(values);
          form.resetFields();
        }}
      >
        <Form.Item name="login" label="Логин" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}>
          <MaskedInput mask="+996 (000) 000-000" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input placeholder="example@gmail.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: !isEdit, message: "Введите пароль" }]}
          extra={isEdit ? "Оставьте пустым, чтобы не менять пароль" : undefined}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="instagramUsername"
          label="Instagram"
          tooltip="Можно оставить пустым — сгенерируется из имени"
        >
          <Input prefix="@" placeholder="username" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManagerFormModal;
