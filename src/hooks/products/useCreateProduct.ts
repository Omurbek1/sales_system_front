import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Product } from "./useProductsList";
import { API_BASE_URL } from "@/config/config";
import { ProductDto } from "@/types/products";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ProductDto): Promise<Product> => {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Ошибка создания товара:", res.status, errorText);
        throw new Error("Ошибка при создании товара");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
