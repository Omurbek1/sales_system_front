"use client";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./Header";
import { ShoppingOutlined } from "@ant-design/icons";
import ProtectedPage from "../auth/ProtectedPage";

const { Sider, Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} style={{ background: "#fff" }}>
        {/* logo company from antd icons */}
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            lineHeight: "32px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <ShoppingOutlined style={{ fontSize: 24 }} />
          <span style={{ fontSize: 18, fontWeight: "bold" }}>Sales System</span>
        </div>

        <Sidebar />
      </Sider>
      <Layout>
        <AppHeader />
        <Content
          style={{ margin: "24px 16px", background: "#fff", padding: 24 }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
