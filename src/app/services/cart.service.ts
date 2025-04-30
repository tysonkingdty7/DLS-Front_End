import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.getCart();
    const existingItem = currentCart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.items.push({ product, quantity });
    }

    this.updateCart(currentCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.getCart();
    currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCart(currentCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.getCart();
    const item = currentCart.items.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      this.updateCart(currentCart);
    }
  }

  clearCart(): void {
    this.updateCart({ items: [], total: 0 });
  }

  private updateCart(cart: Cart): void {
    cart.total = this.calculateTotal(cart);
    this.cartSubject.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getAllCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${environment.apiUrl}/carts`);
  }
} 