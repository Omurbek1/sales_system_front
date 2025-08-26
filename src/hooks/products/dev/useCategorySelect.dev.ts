import { useProductsDevStore } from "@/stores/productsDevStore";

export async function handleCategoryChange(
  name: string
): Promise<{ id: string; name: string }> {
  const { upsertCategoryByName } = useProductsDevStore.getState();
  return upsertCategoryByName(name.trim()); // { id, name }
}
