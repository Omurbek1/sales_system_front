import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "./useProductsList";
import { API_BASE_URL } from "@/config/config";
import { UpdateProductDto } from "@/types/products";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateProductDto): Promise<Product> => {
      const res = await fetch(`${API_BASE_URL}/products/${dto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error("Ошибка при обновлении товара");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
