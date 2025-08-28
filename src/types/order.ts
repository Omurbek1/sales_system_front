export type OrderStatus =
  | "бронь"
  | "оформили"
  | "к отправку"
  | "отправлено"
  | "получили"
  | "возврат"
  | "выкуп";

export type PaymentType =
  | "в наличии"
  | "на заказ"
  | "в рассрочку (МПлюс)"
  | "в рассрочку (Зеро 3 мес)"
  | "в рассрочку (Зеро 8 мес)"
  | "в рассрочку (Компаньон)";

export interface Order {
  id: string;
  clientName: string; // имя
  clientPhone: string; // номер телефона
  clientAddress: string; // адрес
  product: string;
  status: OrderStatus;
  payment: PaymentType;
  manager: string;
  // если используешь «бронь»
  depositAmount?: number;
  buyoutAmount?: number;

  // доставка
  deliveryType?: "from_us" | "from_client";
  deliveryComment?: string;

  // детали рассрочки (необязательно, но удобно)
  installmentProvider?: "mplus" | "zero" | "kompanion";
  installmentMonths?: number;

  createdAt: string;
  amount: number;
}
