// src/hooks/products/useCategorySelect.ts (PROD)
export async function handleCategoryChange(
  name: string
): Promise<{ id: string; name: string }> {
  const trimmed = name.trim();

  // 1) поиск категории по имени
  const resSearch = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/category?name=${encodeURIComponent(
      trimmed
    )}`
  );
  if (resSearch.ok) {
    const list = await resSearch.json();
    if (Array.isArray(list) && list.length) {
      const found = list[0];
      return { id: found.id, name: found.name };
    }
  }

  // 2) если не нашли — создаём
  const resCreate = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    }
  );
  if (!resCreate.ok) throw new Error("Ошибка при создании категории");
  const created = await resCreate.json();
  return { id: created.id, name: created.name };
}
