import { CashEntry } from "@/types/cashbox";
import { Manager } from "@/types/manager";
import { Order } from "@/types/order";

export let mockManagers: Manager[] = [
  {
    id: "1",
    name: "Асел",
    login: "asel",
    email: "asel@mail.com",
    createdAt: "2024-12-10",
  },
  {
    id: "2",
    name: "Бакыт",
    login: "bakyt",
    email: "bakyt@mail.com",
    createdAt: "2025-01-15",
  },
  {
    id: "3",
    name: "Нуржан",
    login: "nurzhan",
    email: "nurzhan@mail.com",
    createdAt: "2025-03-22",
  },
];

export const mockOrders: Order[] = [
  {
    id: "1",
    clientName: "Асел",
    clientPhone: "+996701111111",
    clientAddress: "г. Бишкек, ул. Абдрахманова 12",
    product: "Принтер Epson L3250",
    status: "бронь",
    payment: "в наличии",
    manager: "Асел",
    createdAt: "2025-07-01",
    amount: 15000,
  },
  {
    id: "2",
    clientName: "Бакыт",
    clientPhone: "+996702222222",
    clientAddress: "г. Ош, ул. Ленина 45",
    product: "Ноутбук Acer Aspire",
    status: "отправлено",
    payment: "в рассрочку",
    manager: "Бакыт",
    createdAt: "2025-07-04",
    amount: 60000,
  },
  {
    id: "3",
    clientName: "Жанна",
    clientPhone: "+996703333333",
    clientAddress: "г. Кара-Балта, ул. Советская 8",
    product: "Флешка 128GB",
    status: "получили",
    payment: "на заказ",
    manager: "Асел",
    createdAt: "2025-06-28",
    amount: 1200,
  },
];

export const mockCashbox: CashEntry[] = [
  {
    id: "1",
    manager: "Асел",
    amount: 5000,
    source: "в наличии",
    date: "2025-07-05",
  },
  {
    id: "2",
    manager: "Асел",
    amount: 12000,
    source: "в рассрочку",
    date: "2025-07-06",
  },
  {
    id: "3",
    manager: "Бакыт",
    amount: 8000,
    source: "на заказ",
    date: "2025-07-06",
  },
  {
    id: "4",
    manager: "Асел",
    amount: 4000,
    source: "в наличии",
    date: "2025-07-07",
  },
];
