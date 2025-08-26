import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/config";

export interface Category {
  id: string;
  name: string;
}

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/category`);
      if (!res.ok) throw new Error("Ошибка загрузки категорий");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};
