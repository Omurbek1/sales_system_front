import { useProductsDevStore } from "@/stores/productsDevStore";

export function useUpdateProduct() {
  const { updateProduct } = useProductsDevStore();
  return {
    isLoading: false,
    mutateAsync: async ({ id, ...patch }: any) => {
      updateProduct(id, patch);
      return true;
    },
  };
}

export function useDeleteProduct() {
  const { deleteProduct } = useProductsDevStore();
  return {
    isLoading: false,
    mutateAsync: async (id: string) => {
      deleteProduct(id);
      return true;
    },
  };
}
