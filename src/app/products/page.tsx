"use client";
import { useState } from "react";
import { Table, Input, Button, Modal, Form, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

import MainLayout from "@/components/layout/MainLayout";

type Product = {
  key: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const initialProducts: Product[] = [
  {
    key: "1",
    name: "iPhone 15 Pro",
    category: "Смартфоны",
    price: 1200,
    stock: 15,
  },
  {
    key: "2",
    name: "MacBook Air M2",
    category: "Ноутбуки",
    price: 1500,
    stock: 8,
  },
  {
    key: "3",
    name: "Samsung Galaxy S24",
    category: "Смартфоны",
    price: 1100,
    stock: 20,
  },
  {
    key: "4",
    name: "Sony WH-1000XM5",
    category: "Наушники",
    price: 400,
    stock: 30,
  },
  {
    key: "5",
    name: "Apple Watch Series 9",
    category: "Смарт-часы",
    price: 500,
    stock: 12,
  },
  {
    key: "6",
    name: "Dell XPS 13",
    category: "Ноутбуки",
    price: 1400,
    stock: 6,
  },
  {
    key: "7",
    name: "JBL Charge 5",
    category: "Акустика",
    price: 180,
    stock: 25,
  },
  {
    key: "8",
    name: "Xiaomi Mi Band 8",
    category: "Смарт-часы",
    price: 60,
    stock: 40,
  },
  {
    key: "9",
    name: "HP LaserJet Pro",
    category: "Принтеры",
    price: 250,
    stock: 10,
  },
  {
    key: "10",
    name: "Canon EOS R10",
    category: "Камеры",
    price: 900,
    stock: 5,
  },
];

const categories = [
  "Смартфоны",
  "Ноутбуки",
  "Наушники",
  "Смарт-часы",
  "Акустика",
  "Принтеры",
  "Камеры",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchText, setSearchText] = useState("");
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  // Filtered and searched data
  const filteredData = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filteredCategory
      ? product.category === filteredCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleCategoryFilter = (category: string | null) => {
    setFilteredCategory(category);
    setPagination({ ...pagination, current: 1 });
  };

  const handleAddProduct = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const newProduct: Product = {
        key: (products.length + 1).toString(),
        ...values,
      };
      setProducts([newProduct, ...products]);
      setModalOpen(false);
      message.success("Товар успешно добавлен!");
    } catch (err) {
      // validation error
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value: string, record: Product) => record.category === value,
      sorter: (a: Product, b: Product) => a.category.localeCompare(b.category),
    },
    {
      title: "Цена ($)",
      dataIndex: "price",
      key: "price",
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number) => (
        <span style={{ color: "#1677ff", fontWeight: 500 }}>{price}</span>
      ),
    },
    {
      title: "В наличии",
      dataIndex: "stock",
      key: "stock",
      sorter: (a: Product, b: Product) => a.stock - b.stock,
      render: (stock: number) => (
        <span style={{ color: stock > 10 ? "#52c41a" : "#faad14" }}>
          {stock}
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Search
            placeholder="Поиск по названию или категории"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 320 }}
            onSearch={handleSearch}
          />
          <Button
            onClick={() => handleCategoryFilter(null)}
            type={!filteredCategory ? "primary" : "default"}
            size="large"
          >
            Все категории
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              type={filteredCategory === cat ? "primary" : "default"}
              size="large"
            >
              {cat}
            </Button>
          ))}
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAddProduct}
          style={{
            background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
            border: "none",
            borderRadius: 8,
            fontWeight: 500,
          }}
        >
          Добавить товар
        </Button>
      </div>
      <Table
        columns={columns as any}
        dataSource={filteredData}
        pagination={{
          ...pagination,
          total: filteredData.length,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          showTotal: (total) => `Всего: ${total}`,
        }}
        onChange={handleTableChange}
        bordered
        size="middle"
        rowClassName={(_, idx) =>
          idx % 2 === 0 ? "ant-table-row-light" : "ant-table-row-dark"
        }
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        }}
      />
      <Modal
        title="Добавить новый товар"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={loading}
        okText="Добавить"
        cancelText="Отмена"
        styles={{
          body: { paddingTop: 24, paddingBottom: 0 },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="addProduct"
          initialValues={{ price: 0, stock: 1 }}
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: "Введите название товара" }]}
          >
            <Input placeholder="Введите название товара" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию" }]}
          >
            <Input placeholder="Введите категорию" list="category-list" />
          </Form.Item>
          <datalist id="category-list">
            {categories.map((cat) => (
              <option value={cat} key={cat} />
            ))}
          </datalist>
          <Form.Item
            name="price"
            label="Цена ($)"
            rules={[
              { required: true, message: "Введите цену" },
              {
                type: "number",
                min: 0,
                message: "Цена не может быть отрицательной",
              },
            ]}
          >
            <Input type="number" min={0} step={1} placeholder="Введите цену" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="В наличии"
            rules={[
              { required: true, message: "Введите количество" },
              {
                type: "number",
                min: 0,
                message: "Количество не может быть отрицательным",
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Введите количество"
            />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}
