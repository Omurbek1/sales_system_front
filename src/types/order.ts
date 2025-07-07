export type OrderStatus =
  | "бронь"
  | "оформили"
  | "отправлено"
  | "получили"
  | "возврат";
export type PaymentType = "в наличии" | "в рассрочку" | "на заказ";

export interface Order {
  id: string;
  clientName: string; // имя
  clientPhone: string; // номер телефона
  clientAddress: string; // адрес
  product: string;
  status: OrderStatus;
  payment: PaymentType;
  manager: string;
  createdAt: string;
  amount: number;
}
