"use client";

import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
  Space,
  Upload,
  Avatar,
  Flex,
  UploadProps,
  GetProp,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  LogoutOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";

const { Title, Text } = Typography;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export default function ProfilePage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!user) return;
      setUser({ ...user, ...values });
      message.success("Профиль обновлён");
      setEditing(false);
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleAvatarChange = async (info: any) => {
    const file = info?.file?.originFileObj;
    if (!file || !(file instanceof File)) {
      message.error("Файл не выбран или формат неверный");
      return;
    }

    try {
      const base64 = await getBase64(file); // getBase64 из твоего кода выше
      setUser({ ...user!, avatar: base64 });
      message.success("Аватар обновлён");
    } catch (error) {
      message.error("Ошибка при загрузке файла");
      console.error("Avatar upload error:", error);
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      <Card>
        <Title level={3}>👤 Профиль пользователя</Title>

        <Flex gap={8} dir="column" align="center">
          <Space
            direction="vertical"
            align="center"
            style={{ marginBottom: 24 }}
          >
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              accept="image/*"
            >
              <Avatar
                size={80}
                src={user.avatar}
                icon={!user.avatar && <UserOutlined />}
                style={{
                  cursor: "pointer",
                  background: !user.avatar ? "#dbeafe" : undefined,
                  border: "2px solid #ddd",
                }}
              />
            </Upload>
          </Space>
          {!editing ? (
            <>
              <Space direction="vertical" size="middle">
                <Text>
                  <strong>Имя:</strong> {user.name}
                </Text>
                <Text>
                  <strong>Email:</strong> {user.email || "Не указано"}
                </Text>
                <Text>
                  <strong>Роль:</strong>{" "}
                  {user.role === "admin" ? "Админ" : "Менеджер"}
                </Text>
              </Space>

              <Space style={{ marginTop: 24 }}>
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  onClick={() => {
                    form.setFieldsValue({ name: user.name, email: user.email });
                    setEditing(true);
                  }}
                >
                  Редактировать
                </Button>
                <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                  Выйти
                </Button>
              </Space>
            </>
          ) : (
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item
                name="name"
                label="Имя"
                rules={[{ required: true, message: "Введите имя" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Введите email" },
                  { type: "email", message: "Неверный формат email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Сохранить
                </Button>
                <Button onClick={() => setEditing(false)}>Отменить</Button>
              </Space>
            </Form>
          )}
        </Flex>
      </Card>
    </MainLayout>
  );
}
