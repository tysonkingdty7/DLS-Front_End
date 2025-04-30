import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/Product/GetAll`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/Product/GetById/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/Product/products/category/${category}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/Product/products/search`, {
      params: { q: query }
    });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/Product/AddProducts`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/Product/UpDate/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Product/Delete/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/Product/GetByCategory`);
  }
} 