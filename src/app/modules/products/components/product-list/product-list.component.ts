import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  filterForm: FormGroup;
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onFilterChange(): void {
    const { category, search } = this.filterForm.value;
    
    if (category) {
      this.productService.getProductsByCategory(category).subscribe({
        next: (products) => {
          this.products = this.filterBySearch(products, search);
        },
        error: (error) => {
          console.error('Error filtering products:', error);
        }
      });
    } else {
      this.loadProducts();
    }
  }

  filterBySearch(products: Product[], search: string): Product[] {
    if (!search) return products;
    
    const searchTerm = search.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
} 