"use client";
import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Select,
  Upload,
  Image,
  Carousel,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Search } = Input;

import MainLayout from "@/components/layout/MainLayout";

type Product = {
  key: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  margin: number;
  commissionPercent: number;
  stock: number;
  images: string[];
};

const initialProducts: Product[] = [];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Смартфоны",
    "Ноутбуки",
    "Наушники",
    "Смарт-часы",
    "Акустика",
    "Принтеры",
    "Камеры",
  ]);

  const filteredData = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filteredCategory
      ? product.category === filteredCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleTableChange = (pagination: any) => {
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
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    form.setFieldsValue({ ...product, images: [] });
    setEditingProduct(product);
    setModalOpen(true);
  };
  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const margin = values.price - values.cost;
      const images = (values.images || []).map((file: any) =>
        URL.createObjectURL(file.originFileObj)
      );
      const updatedProduct: Product = {
        key: editingProduct?.key || (products.length + 1).toString(),
        name: values.name,
        category: values.category,
        price: values.price,
        cost: values.cost,
        margin,
        commissionPercent: values.commissionPercent,
        stock: values.stock,
        images: images.length ? images : editingProduct?.images || [],
      };

      const updatedProducts = editingProduct
        ? products.map((p) =>
            p.key === editingProduct.key ? updatedProduct : p
          )
        : [updatedProduct, ...products];

      setProducts(updatedProducts);

      if (!categories.includes(values.category)) {
        setCategories([...categories, values.category]);
      }

      setModalOpen(false);
      setEditingProduct(null);
      message.success(
        editingProduct ? "Товар обновлён!" : "Товар успешно добавлен!"
      );
    } catch (err) {
      // validation error
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  interface ProductColumn {
    title: string;
    dataIndex?: keyof Product | string;
    key: string;
    sorter?: (a: Product, b: Product) => number;
    filters?: { text: string; value: string }[];
    onFilter?: (value: string, record: Product) => boolean;
    render?: (value: any, record?: Product, index?: number) => React.ReactNode;
  }

  const columns: ProductColumn[] = [
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
      title: "Себестоимость",
      dataIndex: "cost",
      key: "cost",
      render: (val: number) => `$${val}`,
    },
    {
      title: "Маржа",
      dataIndex: "margin",
      key: "margin",
      render: (val: number) => (
        <span style={{ color: val >= 0 ? "#52c41a" : "#f5222d" }}>${val}</span>
      ),
    },
    {
      title: "% Менеджеру",
      dataIndex: "commissionPercent",
      key: "commissionPercent",
      render: (val: number) => `${val}%`,
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
    {
      title: "Фото",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) =>
        images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt="Product"
            width={50}
            height={50}
            style={{ borderRadius: 8, objectFit: "cover", cursor: "pointer" }}
            preview={false}
            onClick={() => {
              setPreviewImages(images);
              setImageModalOpen(true);
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>Нет фото</span>
        ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record?: Product) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => record && handleEditProduct(record)}
        />
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
        open={imageModalOpen}
        footer={null}
        onCancel={() => setImageModalOpen(false)}
        title="Фотографии товара"
      >
        <Carousel autoplay dots style={{ marginBottom: 16 }} effect="fade">
          {previewImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              style={{
                width: "100%",
                maxHeight: 400,
                objectFit: "contain",
                borderRadius: 8,
              }}
              alt={`product-${idx}`}
            />
          ))}
        </Carousel>
      </Modal>
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
            rules={[
              { required: true, message: "Выберите или введите категорию" },
            ]}
          >
            <Select
              placeholder="Выберите или введите категорию"
              showSearch
              allowClear
              onBlur={() => {
                const value = form.getFieldValue("category");
                if (value && !categories.includes(value)) {
                  setCategories((prev) => [...prev, value]);
                }
              }}
              options={categories.map((cat) => ({ label: cat, value: cat }))}
              popupRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: 8 }}>
                    <Button
                      type="link"
                      onClick={() => {
                        const value = form.getFieldValue("category");
                        if (value && !categories.includes(value)) {
                          setCategories((prev) => [...prev, value]);
                          message.success(
                            `Добавлена новая категория: ${value}`
                          );
                        }
                      }}
                    >
                      ➕ Добавить новую категорию
                    </Button>
                  </div>
                </>
              )}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Цена ($)"
            rules={[
              { required: true, message: "Введите цену" },
              {
                validator: (_, value) =>
                  value === undefined || value < 0
                    ? Promise.reject("Цена не может быть отрицательной")
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              placeholder="Введите цену"
            />
          </Form.Item>
          <Form.Item
            name="cost"
            label="Себестоимость ($)"
            rules={[
              { required: true, message: "Введите себестоимость" },
              {
                validator: (_, value) =>
                  value === undefined || value < 0
                    ? Promise.reject(
                        "Себестоимость не может быть отрицательной"
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Введите себестоимость"
            />
          </Form.Item>
          <Form.Item
            name="commissionPercent"
            label="% менеджеру от продажи"
            rules={[
              { required: true, message: "Введите процент менеджеру" },
              {
                validator: (_, value) =>
                  value === undefined || value < 0
                    ? Promise.reject("Процент не может быть отрицательным")
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="Процент менеджеру от продажи"
            />
          </Form.Item>
          <Form.Item
            name="stock"
            label="В наличии"
            rules={[
              { required: true, message: "Введите количество" },
              {
                validator: (_, value) =>
                  value === undefined || value < 0
                    ? Promise.reject("Количество не может быть отрицательным")
                    : Promise.resolve(),
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
          <Form.Item
            name="images"
            label="Фотографии"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Загрузите хотя бы одно фото" }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              multiple
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Загрузить</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}
