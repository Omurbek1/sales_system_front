"use client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, Col, Row, Statistic, Typography, Space, Divider } from "antd";
import {
  ShoppingOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useProductsList } from "@/hooks/products";
const { Title, Text } = Typography;

const weeklySalesData = [
  { week: "W26", Acel: 50000, Jamal: 30000 },
  { week: "W27", Acel: 70000, Jamal: 35000 },
  { week: "W28", Acel: 65000, Jamal: 45000 },
  { week: "W29", Acel: 80000, Jamal: 42000 },
];

const totalSalesData = [
  { name: "Acel", value: 265000 },
  { name: "Jamal", value: 152000 },
];

const COLORS = ["#8884d8", "#82ca9d"];
export default function DashboardPage() {
  const { productsListQuery, productsQueryParams, setProductsQueryParams } =
    useProductsList();
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const isAdmin = user.role === "admin";

  const stats = {
    orders: 72,
    products: productsListQuery.data?.total,
    managers: 5,
    salesToday: 130000,
    yourOrders: 12,
    yourSales: 54000,
  };

  return (
    <MainLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={3}>👋 Добро пожаловать, {user.name}</Title>

        <Divider orientation="left">
          {isAdmin ? "Общая статистика (Админ)" : "Ваша статистика (Менеджер)"}
        </Divider>

        <Row gutter={16}>
          {isAdmin ? (
            <>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Всего заказов"
                    value={stats.orders}
                    prefix={<ShoppingOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Товары"
                    value={stats.products}
                    prefix={<AppstoreOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Менеджеры"
                    value={stats.managers}
                    prefix={<UsergroupAddOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Продажи сегодня"
                    value={stats.salesToday}
                    prefix={<DollarOutlined />}
                    suffix="сом"
                  />
                </Card>
              </Col>
            </>
          ) : (
            <>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Ваши заказы"
                    value={stats.yourOrders}
                    prefix={<ShoppingOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Ваши продажи"
                    value={stats.yourSales}
                    prefix={<DollarOutlined />}
                    suffix="сом"
                  />
                </Card>
              </Col>
            </>
          )}
        </Row>
        {isAdmin && (
          <>
            <Divider orientation="left">📈 График продаж по менеджерам</Divider>
            <Card>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={weeklySalesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Acel"
                    stroke="#8884d8"
                    name="Acel"
                  />
                  <Line
                    type="monotone"
                    dataKey="Jamal"
                    stroke="#82ca9d"
                    name="Jamal"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Divider orientation="left">
              📈 Продажи по неделям (LineChart)
            </Divider>
            <Card>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Acel"
                    stroke="#8884d8"
                    name="Acel"
                  />
                  <Line
                    type="monotone"
                    dataKey="Jamal"
                    stroke="#82ca9d"
                    name="Jamal"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Divider orientation="left">🧁 Доля продаж (PieChart)</Divider>
            <Card>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={totalSalesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {totalSalesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Divider orientation="left">
              📊 Выручка по менеджерам (BarChart)
            </Divider>
            <Card>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={totalSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </Space>
    </MainLayout>
  );
}
