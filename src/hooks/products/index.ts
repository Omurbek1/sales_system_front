import * as devHooks from "./devIndex";
import * as prodHooks from "./prodIndex";

const isDev = process.env.NEXT_PUBLIC_APP_MODE === "dev";
const M = isDev ? devHooks : prodHooks;

// Важно: devIndex и prodIndex должны экспортировать ОДИНАКОВЫЕ имена
export const {
  useCreateProduct,
  useProductsList,
  useUpdateProduct,
  useDeleteProduct,
  useCategories,
  handleCategoryChange,
} = M;
