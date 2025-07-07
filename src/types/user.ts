export type UserRole = "admin" | "manager";

export interface User {
  id: string;
  name: string;
  login: string;
  role: UserRole;
}
