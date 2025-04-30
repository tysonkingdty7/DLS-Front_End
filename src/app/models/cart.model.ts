import { Product } from './product.model';

export interface Cart {
  id?: number;
  items: CartItem[];
  total: number;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type { Product }; 