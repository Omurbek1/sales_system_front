"use client";

// login page ui with ant design beautiful and modern

import { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (
        (values.username === "admin" || values.username === "manager") &&
        values.password === "1234"
      ) {
        login({
          name: values.username,
          role: values.username === "admin" ? "admin" : "manager",
        });
        message.success("Успешный вход!");
        router.push("/");
      } else {
        message.error("Неверный логин или пароль");
      }
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          width: 380,
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          borderRadius: 16,
        }}
        styles={{
          body: {
            padding: 32,
          },
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 0 }}>
            Вход в систему
          </Title>
          <span style={{ color: "#888" }}>CRM Система продаж</span>
        </div>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Логин"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Введите логин"
              size="large"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Введите пароль"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                borderRadius: 8,
                fontWeight: 500,
                marginTop: 8,
                background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
                border: "none",
              }}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
