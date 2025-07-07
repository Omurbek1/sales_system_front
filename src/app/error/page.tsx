"use client";

import { Typography, Button } from "antd";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#fef2f2",
      }}
    >
      <Typography.Title level={2} style={{ color: "#b91c1c" }}>
        ⛔ Доступ запрещён
      </Typography.Title>
      <Typography.Text style={{ marginBottom: 24 }}>
        Пожалуйста, войдите в систему для доступа к CRM.
      </Typography.Text>
      <Button type="primary" onClick={() => router.push("/login")}>
        Перейти к входу
      </Button>
    </div>
  );
}
