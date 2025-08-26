import { useProductsDevStore } from "@/stores/productsDevStore";
import { useMemo } from "react";

export function useProductsList() {
  const { products, queryParams, setQueryParams } = useProductsDevStore();

  const filtered = useMemo(() => {
    let list = products;
    if (queryParams.name) {
      const q = queryParams.name.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (queryParams.category) {
      list = list.filter(
        (p) =>
          p.category?.id === queryParams.category ||
          p.category?.name === queryParams.category
      );
    }
    return list;
  }, [products, queryParams.name, queryParams.category]);

  const start = (queryParams.page - 1) * queryParams.limit;
  const pageItems = filtered.slice(start, start + queryParams.limit);

  return {
    productsListQuery: {
      isSuccess: true,
      isLoading: false,
      data: { results: pageItems, total: filtered.length },
    },
    productsQueryParams: queryParams,
    setProductsQueryParams: setQueryParams,
  };
}
