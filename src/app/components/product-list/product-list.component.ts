import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.categories = [...new Set(products.map(p => p.category))];
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category) {
      this.productService.getProductsByCategory(category).subscribe(products => {
        this.filteredProducts = products;
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  searchProducts(): void {
    if (this.searchQuery) {
      this.productService.searchProducts(this.searchQuery).subscribe(products => {
        this.filteredProducts = products;
      });
    } else {
      this.filteredProducts = this.products;
    }
  }
} 