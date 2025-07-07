export type PaymentSource = "в наличии" | "в рассрочку" | "на заказ";

export interface CashEntry {
  id: string;
  manager: string;
  amount: number;
  source: PaymentSource;
  date: string; // YYYY-MM-DD
  product?: string;
}
