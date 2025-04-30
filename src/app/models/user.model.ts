export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
} 