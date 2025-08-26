import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DevCategory = { id: string; name: string };

export type DevProduct = {
  id: string;
  name: string;
  price: number;
  cost: number;
  commissionPercent: number;
  stock: number;
  images?: string[];
  categoryId?: string;
  category?: { id: string; name: string };
  createdBy?: string;
};

type QueryParams = {
  page: number;
  limit: number;
  name?: string;
  category?: string;
};

interface ProductsDevState {
  products: DevProduct[];
  categories: DevCategory[];
  queryParams: QueryParams;

  setQueryParams: (patch: Partial<QueryParams>) => void;

  setProducts: (list: DevProduct[]) => void;
  addProduct: (payload: Omit<DevProduct, "id">) => string;
  updateProduct: (id: string, patch: Partial<DevProduct>) => void;
  deleteProduct: (id: string) => void;

  upsertCategoryByName: (name: string) => DevCategory;
}

export const useProductsDevStore = create<ProductsDevState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      queryParams: { page: 1, limit: 10 },

      setQueryParams: (patch) =>
        set({ queryParams: { ...get().queryParams, ...patch } }),

      setProducts: (list) => set({ products: list }),

      addProduct: (payload) => {
        const id = crypto.randomUUID();
        const cat = payload.categoryId
          ? get().categories.find((c) => c.id === payload.categoryId)
          : payload.category || undefined;

        set({
          products: [
            ...get().products,
            {
              ...payload,
              id,
              category: cat ?? payload.category,
            },
          ],
        });
        return id;
      },

      updateProduct: (id, patch) =>
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        }),

      deleteProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),

      upsertCategoryByName: (name) => {
        const n = name.trim();
        const found = get().categories.find(
          (c) => c.name.toLowerCase() === n.toLowerCase()
        );
        if (found) return found;
        const cat = { id: crypto.randomUUID(), name: n };
        set({ categories: [...get().categories, cat] });
        return cat;
      },
    }),
    { name: "products-dev-store" }
  )
);
