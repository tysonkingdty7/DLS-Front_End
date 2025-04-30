export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  userType: string;
  roles?: string[];
} 