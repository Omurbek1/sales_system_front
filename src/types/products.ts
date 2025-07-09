export interface ProductDto {
  name: string;
  categoryId: string;
  price: number;
  cost: number;
  commissionPercent: number;
  stock: number;
  images: string[]; // base64 строки или URL
  createdBy?: string; // нужно только при создании
}

export interface UpdateProductDto {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  cost: number;
  commissionPercent: number;
  stock: number;
  images: string[];
}
