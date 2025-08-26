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
  MenuProps,
  Tooltip,
  Tag,
} from "antd";
import * as yup from "yup";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  EllipsisOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

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
  const [previewImages, setPreviewImages] = useState<string[]>([]);
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

  const handleAddProduct = () => {
    form.resetFields();
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (
    product: UpdateProductDto & { category?: { id: string; name: string } }
  ) => {
    // 1) подготовим список файлов для Upload
    const initialFiles: UploadFile[] = (product.images || []).map(
      (url, idx) => ({
        uid: `${product.id}-${idx}`,
        name: `image-${idx + 1}`,
        status: "done",
        url, // важное поле для уже загруженного изображения
      })
    );

    // 2) подставим значения в форму
    form.setFieldsValue({
      name: product.name,
      description: (product as any).description, // если есть в типе
      categoryId: product.category?.id ?? product.categoryId,
      price: product.price,
      cost: product.cost,
      commissionPercent: product.commissionPercent,
      stock: product.stock,
      images: initialFiles, // <-- вот сюда кладём UploadFile[]
    });

    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await productSchema.validate(values, { abortEarly: false });
      console.log("Validated values:", values);

      // конвертируем в base64
      const images: string[] = [];
      if (values.images && values.images.length) {
        for (const file of values.images as UploadFile[]) {
          if (file.originFileObj) {
            // новое изображение: в base64
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file.originFileObj as File);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (err) => reject(err);
            });
            images.push(base64);
          } else if (file.url) {
            // старое изображение с URL
            images.push(file.url);
          } else if ((file as any).thumbUrl) {
            // запасной вариант — превью, если originFileObj уже не доступен
            images.push((file as any).thumbUrl);
          }
        }
      }
      const payload = {
        name: values.name,
        categoryId: values.categoryId,
        price: +values.price,
        cost: +values.cost,
        commissionPercent: +values.commissionPercent,
        stock: +values.stock,
        images,
        description: values.description?.trim() || undefined,
        createdBy: "admin",
      };

      if (editingProduct?.id) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...payload });
        message.success("Товар обновлён!");
      } else {
        await createProduct.mutateAsync(payload as any);
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
      title: "Описание",
      key: "description",
      render: (_: any, rec: any) =>
        rec?.description ? (
          <Tooltip title={rec.description}>
            <Tag color="blue" style={{ cursor: "help" }}>
              подробнее
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#999" }}> нет описании</span>
        ),
    },
    {
      title: "Категория",
      dataIndex: ["category", "name"],
      key: "category",
      filters: categoryList.map((cat) => ({
        text: cat.name,
        value: cat.id,
      })),
      onFilter: (value, record) => {
        const v = String(value);
        return record.category?.id === v || record.category?.name === v;
      },
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
      render: (images: string[]) =>
        images?.length ? (
          <div style={{ display: "flex", gap: 4 }}>
            {images.slice(0, 3).map((src, i) => (
              <Image
                key={i}
                src={src}
                width={40}
                height={40}
                style={{ cursor: "pointer", objectFit: "cover" }}
                preview={false}
                onClick={() => {
                  setPreviewImages(images as never);
                  setImageModalOpen(true);
                }}
              />
            ))}
            {images.length > 3 && (
              <Tag
                color="blue"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setPreviewImages(images as never);
                  setImageModalOpen(true);
                }}
              >
                +{images.length - 3}
              </Tag>
            )}
          </div>
        ) : (
          <span>Нет фото</span>
        ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => {
        const menu = {
          items: [
            {
              key: "edit",
              label: "Редактировать",
            },
            {
              key: "delete",
              label: "Удалить",
              danger: true,
            },
          ],
          onClick: async ({ key }: { key: string }) => {
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
          },
        };

        return (
          <Dropdown menu={menu} trigger={["click"]}>
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
          rowKey="id"
        />
      )}

      <Modal
        open={modalOpen}
        title={editingProduct ? "Редактировать товар" : "Добавить товар"}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingProduct(null);
        }}
        onOk={handleModalOk}
        okText={editingProduct ? "Обновить" : "Добавить"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию" }]}
          >
            <Select
              showSearch
              open={categoryDropdownOpen}
              onOpenChange={setCategoryDropdownOpen}
              onSearch={setCategoryInput}
              optionFilterProp="label"
              onChange={() => setCategoryDropdownOpen(false)}
              onInputKeyDown={async (e) => {
                if (e.key === "Enter" && categoryInput.trim()) {
                  try {
                    const created = await handleCategoryChange(
                      categoryInput.trim()
                    );
                    await refetchCategories?.();
                    form.setFieldsValue({ categoryId: created.id }); // ставим id
                    message.success("Категория создана и выбрана");
                  } catch {
                    message.error("Ошибка при создании категории");
                  }
                  setCategoryDropdownOpen(false);
                  e.preventDefault();
                }
              }}
              options={categoryList.map((cat) => ({
                label: cat.name, // отображаемое
                value: cat.id, // хранимое
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
          <Form.Item
            name="images"
            label="Фото"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false} // запрет на автозагрузку, будем хранить base64
              multiple
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Загрузить</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={imageModalOpen}
        footer={null}
        onCancel={() => setImageModalOpen(false)}
        title="Фотографии товара"
      >
        <Carousel autoplay effect="fade" infinite autoplaySpeed={3000}>
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
