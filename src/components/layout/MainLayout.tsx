"use client";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./Header";
import { ShoppingOutlined } from "@ant-design/icons";
import ProtectedPage from "../auth/ProtectedPage";

const { Sider, Content } = Layout;
const { Header } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
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
        <Header
          style={{
            background: "#fff",
            padding: 0,
            position: "sticky",
            top: 0,
            zIndex: 90,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <AppHeader />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            background: "#fff",
            padding: 24,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
