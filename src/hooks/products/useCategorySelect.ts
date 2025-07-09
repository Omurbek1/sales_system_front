import { message } from "antd";

export const handleCategoryChange = async (
  value: string[],
  form: any,
  categoryList: any[],
  refetchCategories: () => void
) => {
  const lastValue = value[value.length - 1];

  const found = categoryList.find(
    (cat) =>
      cat.id === lastValue ||
      cat.name.toLowerCase() === lastValue?.toLowerCase()
  );

  if (found) {
    form.setFieldValue("categoryId", [found.id]);
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: lastValue }),
      }
    );

    if (!res.ok) throw new Error("Ошибка при создании категории");

    const created = await res.json();

    // Сразу обновляем категории
    await refetchCategories();

    form.setFieldValue("categoryId", [created.id]);
  } catch (err) {
    message.error("Не удалось создать категорию");
  }
};
