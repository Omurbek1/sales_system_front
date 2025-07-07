// Мок-данные для пользователей
export const users = [
  { id: 1, name: "Иван Иванов", role: "manager" },
  { id: 2, name: "Петр Петров", role: "manager" },
  { id: 3, name: "Админ", role: "admin" },
];

// Возможные статусы заказа
export const orderStatuses = [
  "бронь",
  "оформили",
  "отправлено",
  "получили",
  "возврат",
];

// Возможные типы кассы
export const paymentTypes = ["рассрочка", "в наличии", "на заказ"];

// Мок-данные для заказов
export const orders = [
  {
    id: 101,
    client: "ООО Ромашка",
    status: "бронь",
    paymentType: "рассрочка",
    amount: 120000,
    date: "2024-06-01",
    managerId: 1,
  },
  {
    id: 102,
    client: "ИП Васильев",
    status: "оформили",
    paymentType: "в наличии",
    amount: 85000,
    date: "2024-06-02",
    managerId: 2,
  },
  {
    id: 103,
    client: "ООО Лотос",
    status: "отправлено",
    paymentType: "на заказ",
    amount: 45000,
    date: "2024-06-03",
    managerId: 1,
  },
  {
    id: 104,
    client: "ИП Сидоров",
    status: "получили",
    paymentType: "рассрочка",
    amount: 99000,
    date: "2024-06-04",
    managerId: 2,
  },
  {
    id: 105,
    client: "ООО Альфа",
    status: "возврат",
    paymentType: "в наличии",
    amount: 150000,
    date: "2024-06-05",
    managerId: 1,
  },
];
