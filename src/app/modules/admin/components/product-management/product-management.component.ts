import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  editingProduct: Product | null = null;
  showForm = false;
  loading = true;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.loading = false;
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.editingProduct) {
        this.productService.updateProduct(this.editingProduct.id, productData)
          .subscribe(() => {
            this.loadProducts();
            this.resetForm();
          });
      } else {
        this.productService.createProduct(productData)
          .subscribe(() => {
            this.loadProducts();
            this.resetForm();
          });
      }
    }
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue(product);
    this.showForm = true;
  }

  deleteProduct(id: number): void {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      this.productService.deleteProduct(id)
        .subscribe(() => {
          this.loadProducts();
        });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productForm.patchValue({ image: reader.result });
        this.productForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.editingProduct = null;
    this.showForm = false;
    this.imagePreview = null;
  }
} 