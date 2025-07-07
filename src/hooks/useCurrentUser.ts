import { User } from "@/types/user";

export const useCurrentUser = (): User => {
  // эмуляция авторизованного менеджера
  return {
    id: "1",
    name: "Асел",
    login: "asel",
    role: "manager",
  };
};
