export const calcMargin = (price: number, cost: number) =>
  +(price - cost).toFixed(2);

export const calcCommissionAmount = (price: number, percent: number) =>
  +((price * percent) / 100).toFixed(2);

export const normalizeProductPayload = (v: any) => ({
  name: v.name?.trim(),
  categoryId: v.categoryId,
  price: +v.price,
  cost: +v.cost,
  commissionPercent: +v.commissionPercent,
  stock: +v.stock,
  images: Array.isArray(v.images) ? v.images : [],
  createdBy: v.createdBy ?? "admin",
});
