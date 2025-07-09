"use client";
import { useMemo, useState } from "react";
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
  TableColumnType,
  Menu,
  Dropdown,
} from "antd";
import * as yup from "yup";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  EllipsisOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Search } = Input;

import MainLayout from "@/components/layout/MainLayout";
import {
  useCategories,
  handleCategoryChange,
  useCreateProduct,
  useProductsList,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/products";
import { toBase64 } from "@/utils/utils";
import { UpdateProductDto } from "@/types/products";

const productSchema = yup.object().shape({
  name: yup.string().required("Введите название товара"),

  price: yup
    .number()
    .typeError("Цена должна быть числом")
    .required("Введите цену товара"),
  cost: yup
    .number()
    .typeError("Себестоимость должна быть числом")
    .required("Введите себестоимость товара"),
  commissionPercent: yup
    .number()
    .typeError("Процент должен быть числом")
    .required("Введите процент менеджеру"),
  stock: yup
    .number()
    .typeError("Количество должно быть числом")
    .required("Введите количество товара в наличии"),
});

export default function ProductsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<UpdateProductDto | null>(
    null
  );
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const { productsListQuery, productsQueryParams, setProductsQueryParams } =
    useProductsList();
  const { data: categoryList = [], refetch: refetchCategories } =
    useCategories();

  const handleSearch = (value: string) => {
    setProductsQueryParams({
      name: value,
      page: 1,
    });
  };

  const handleCategoryFilter = (category: string | null) => {
    if (!category) {
      setProductsQueryParams({ category: undefined });
      return;
    }
    setProductsQueryParams({ category });
  };

  const handleTableChange = (pagination: any) => {
    setProductsQueryParams({
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  const handleAddProduct = () => {
    form.resetFields();
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product: UpdateProductDto) => {
    form.setFieldsValue({ ...product, images: [] });
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await productSchema.validate(values, { abortEarly: false });
      console.log("Validated values:", values);

      const payload = {
        name: values.name,
        categoryId: values.categoryId,
        price: +values.price,
        cost: +values.cost,
        commissionPercent: +values.commissionPercent,
        stock: +values.stock,
        images: [], // images пока не используется
        createdBy: "admin",
      };

      if (editingProduct?.id) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...payload });
        message.success("Товар обновлён!");
      } else {
        await createProduct.mutateAsync(payload);
        message.success("Товар добавлен!");
      }

      setModalOpen(false);
      form.resetFields();
      setEditingProduct(null);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        err.name === "ValidationError"
      ) {
        // Type assertion for yup.ValidationError
        const validationError = err as yup.ValidationError;
        validationError.inner.forEach((validationErrorItem) => {
          form.setFields([
            {
              name: validationErrorItem.path,
              errors: [validationErrorItem.message],
            },
          ]);
        });
      } else {
        console.error(err);
        message.error("Ошибка при сохранении товара");
      }
    }
  };

  const normFile = (e: any): any[] => (Array.isArray(e) ? e : e?.fileList);

  const columns: TableColumnType[] = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Категория",
      dataIndex: ["category", "name"],
      key: "category",
      filters: categoryList.map((cat) => ({
        text: cat.name,
        value: cat.id,
      })),
      onFilter: (value, record) =>
        record.category?.id === value || record.category?.name === value,
    },
    {
      title: "Цена ($)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Себестоимость",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Маржа",
      dataIndex: "margin",
      key: "margin",
    },
    {
      title: "% Менеджеру",
      dataIndex: "commissionPercent",
      key: "commissionPercent",
    },
    {
      title: "В наличии",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Фото",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images?.length ? (
          <Image
            src={images[0]}
            width={50}
            height={50}
            style={{ cursor: "pointer" }}
            preview={false}
            onClick={() => {
              setPreviewImages(images);
              setImageModalOpen(true);
            }}
          />
        ) : (
          <span>Нет фото</span>
        ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu
            onClick={async ({ key }) => {
              if (key === "edit") {
                handleEditProduct(record as UpdateProductDto);
              } else if (key === "delete") {
                try {
                  await deleteProduct.mutateAsync(record.id);
                  message.success("Товар удалён!");
                } catch (err) {
                  console.error(err);
                  message.error("Ошибка при удалении товара");
                }
              }
            }}
          >
            <Menu.Item key="edit">Редактировать</Menu.Item>
            <Menu.Item key="delete" danger>
              Удалить
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Search
          placeholder="Поиск по названию товара"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) {
              handleSearch("");
            }
          }}
          style={{ width: 300 }}
        />
        <Button
          onClick={handleAddProduct}
          icon={<PlusOutlined />}
          type="primary"
        >
          Добавить товар
        </Button>
      </div>

      {productsListQuery.isSuccess && (
        <Table
          columns={columns}
          dataSource={productsListQuery.data.results}
          loading={productsListQuery.isLoading}
          pagination={{
            current: productsQueryParams.page,
            pageSize: productsQueryParams.limit,
            total: productsListQuery.data.total,
            showSizeChanger: true,
            onChange: (page, pageSize) =>
              setProductsQueryParams({ page, limit: pageSize }),
          }}
          onChange={handleTableChange}
          rowKey="id"
        />
      )}

      <Modal
        open={modalOpen}
        title={editingProduct ? "Редактировать товар" : "Добавить товар"}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
        okText={editingProduct ? "Обновить" : "Добавить"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryName"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию" }]}
          >
            <Select
              showSearch
              open={categoryDropdownOpen}
              onOpenChange={setCategoryDropdownOpen}
              onSearch={(input) => setCategoryInput(input)}
              onInputKeyDown={async (e) => {
                if (e.key === "Enter" && categoryInput) {
                  const input = categoryInput.trim();

                  const found = categoryList.find(
                    (cat) => cat.name.toLowerCase() === input.toLowerCase()
                  );

                  if (!found) {
                    try {
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name: input }),
                        }
                      );

                      if (!res.ok)
                        throw new Error("Ошибка при создании категории");

                      const newCategory = await res.json();
                      await refetchCategories();

                      form.setFieldsValue({
                        categoryName: newCategory.name,
                        categoryId: newCategory.id,
                      });
                      message.success("Категория создана и выбрана");
                      setCategoryDropdownOpen(false);
                    } catch (err) {
                      message.error("Ошибка при создании категории");
                    }
                  } else {
                    form.setFieldsValue({ categoryId: found.name });
                    setCategoryDropdownOpen(false);
                  }

                  e.preventDefault(); // предотвращаем закрытие dropdown
                }
              }}
              onChange={(value, option) => {
                const opt = option as { label: string; value: string };
                if (opt && typeof opt.label === "string") {
                  form.setFieldsValue({ categoryName: opt.label });
                }
                setCategoryDropdownOpen(false);
              }}
              options={categoryList.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
              placeholder="Выберите или введите категорию"
            />
          </Form.Item>

          <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="cost"
            label="Себестоимость"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="commissionPercent"
            label="% Менеджеру"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="В наличии"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          {/* <Form.Item
            name="images"
            label="Фото"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload listType="picture" beforeUpload={() => false} multiple>
              <Button icon={<UploadOutlined />}>Загрузить</Button>
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>

      <Modal
        open={imageModalOpen}
        footer={null}
        onCancel={() => setImageModalOpen(false)}
        title="Фотографии товара"
      >
        <Carousel autoplay effect="fade">
          {previewImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="product"
              style={{ width: "100%", maxHeight: 400 }}
            />
          ))}
        </Carousel>
      </Modal>
    </MainLayout>
  );
}
