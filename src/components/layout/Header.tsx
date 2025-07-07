"use client";

// Header component with ant design beautiful and modern with logo and menu and user and etc

import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/store/authStore";

const { Header } = Layout;
const { Text } = Typography;

const userMenu = (
  <Menu
    items={[
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Настройки",
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Выйти",
      },
    ]}
  />
);

const AppHeader: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleMenuClick = (e: any) => {
    if (e.key === "products") router.push("/products");
    if (e.key === "orders") router.push("/orders");
    if (e.key === "profile") router.push("/managers");
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      logout();
      router.push("/login");
    }
    if (key === "settings") {
      router.push("/profile");
    }
  };

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        height: 64,
      }}
    >
      <Space align="center">
        <Text
          strong
          style={{
            fontSize: 22,
            letterSpacing: 1,
            color: "#1e293b",
            fontFamily: "inherit",
          }}
        >
          CRM Система продаж
        </Text>
      </Space>

      <Dropdown
        trigger={["click"]}
        menu={{ items: userMenu.props.items, onClick: handleUserMenuClick }}
      >
        <Space style={{ cursor: "pointer" }}>
          <Avatar
            size="large"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
            }}
            icon={<UserOutlined />}
          />
          <span style={{ fontWeight: 500, color: "#334155" }}>
            {user?.name} ({user?.role})
          </span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
