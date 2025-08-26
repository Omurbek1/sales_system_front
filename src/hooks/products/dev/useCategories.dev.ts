import { useProductsDevStore } from "@/stores/productsDevStore";

export function useCategories() {
  const { categories } = useProductsDevStore();
  // имитируем сигнатуру react-query
  return {
    data: categories,
    isLoading: false,
    isSuccess: true,
    refetch: async () => categories,
  };
}
