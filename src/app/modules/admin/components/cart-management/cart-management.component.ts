import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { Cart } from '../../../../models/product.model';

@Component({
  selector: 'app-cart-management',
  templateUrl: './cart-management.component.html',
  styleUrls: ['./cart-management.component.css']
})
export class CartManagementComponent implements OnInit {
  carts: Cart[] = [];
  loading = true;
  selectedCart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCarts();
  }

  loadCarts(): void {
    this.cartService.getAllCarts().subscribe((carts: Cart[]) => {
      this.carts = carts;
      this.loading = false;
    });
  }

  viewCartDetails(cart: Cart): void {
    this.selectedCart = cart;
    // يمكنك إضافة منطق إضافي هنا لعرض تفاصيل السلة
    console.log('Selected cart:', cart);
  }
} 