"use client";

import { Menu } from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  DollarOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    // { key: "/login", icon: <LoginOutlined />, label: "Авторизация" },
    { key: "/products", icon: <ShoppingOutlined />, label: "Товары" },
    { key: "/managers", icon: <UserOutlined />, label: "Менеджеры" },
    { key: "/orders", icon: <FileTextOutlined />, label: "Заказы" },
    { key: "/orders/new", icon: <PlusCircleOutlined />, label: "Новый заказ" },
    { key: "/cashbox", icon: <DollarOutlined />, label: "Касса" },
    
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      onClick={(e) => router.push(e.key)}
      items={items}
    />
  );
};

export default Sidebar;
