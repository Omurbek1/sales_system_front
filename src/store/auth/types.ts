export type Role = "admin" | "manager";

export interface AuthUser {
  name: string;
  role: Role;
  email?: string;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token?: string | null;
  login: (user: AuthUser, token?: string | null) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

// хук для логина (реализация отличается в dev/prod)
export type UseLogin = () => (values: {
  username: string;
  password: string;
}) => Promise<void>;
