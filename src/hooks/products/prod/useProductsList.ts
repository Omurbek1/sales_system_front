import { useCallback, useState } from "react";
import {
  useQuery,
  keepPreviousData,
  type UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/config";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  margin: number;
  commissionPercent: number;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProductsResponse {
  results: Product[];
  total: number;
}

export interface ProductsQueryParams {
  page: number;
  limit: number;
  name?: string;
  category?: string;
}

const DEFAULT_PARAMS: ProductsQueryParams = {
  page: 1,
  limit: 10,
  name: undefined,
  category: undefined,
};

type UseProductsList = (
  options?: Omit<
    UseQueryOptions<PaginatedProductsResponse>,
    "queryKey" | "queryFn"
  >
) => {
  productsListQuery: UseQueryResult<PaginatedProductsResponse, Error>;
  productsQueryParams: ProductsQueryParams;
  setProductsQueryParams: (params: Partial<ProductsQueryParams>) => void;
};

export const useProductsList: UseProductsList = (options) => {
  const [queryParams, setQueryParams] =
    useState<ProductsQueryParams>(DEFAULT_PARAMS);

  const setProductsQueryParams = useCallback(
    (params: Partial<ProductsQueryParams>) => {
      setQueryParams((prev) => ({
        ...prev,
        ...params,
        page: params.page ?? 1,
      }));
    },
    []
  );

  const productsListQuery = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: queryParams.page.toString(),
        limit: queryParams.limit.toString(),
        ...(queryParams.name ? { search: queryParams.name } : {}),
        ...(queryParams.category ? { category: queryParams.category } : {}),
      });

      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      if (!res.ok) throw new Error("Ошибка загрузки списка товаров");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,

    ...options,
  });

  return {
    productsListQuery,
    productsQueryParams: queryParams,
    setProductsQueryParams,
  };
};
