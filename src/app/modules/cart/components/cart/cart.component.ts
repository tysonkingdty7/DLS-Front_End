import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { Cart } from '../../../../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.cart = this.cartService.getCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
    this.cart = this.cartService.getCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cart = this.cartService.getCart();
  }
} 