export interface Manager {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string; // YYYY-MM-DD
  role?: "manager";
  instagramUsername?: string; // например: "ivan_petrov"
}
