export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  providerId?: string;
  discount?: number;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  total: number;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
} 