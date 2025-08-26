import { useProductsDevStore } from "@/stores/productsDevStore";

export function useCreateProduct() {
  const { addProduct } = useProductsDevStore();
  return {
    isLoading: false,
    mutateAsync: async (payload: any) => {
      // payload: { name, categoryId, price, cost, commissionPercent, stock, images?, createdBy? }
      const id = addProduct(payload);
      return { id };
    },
  };
}
