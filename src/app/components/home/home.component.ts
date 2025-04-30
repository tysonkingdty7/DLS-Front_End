import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  categories: string[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadNewProducts();
  }

  loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 4);
    });
  }

  loadNewProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.newProducts = products.slice(-4);
    });
  }
} 