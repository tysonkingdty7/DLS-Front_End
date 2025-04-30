import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { CartManagementComponent } from './components/cart-management/cart-management.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'products', component: ProductManagementComponent },
  { path: 'categories', component: CategoryManagementComponent },
  { path: 'carts', component: CartManagementComponent }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ProductManagementComponent, 
    CategoryManagementComponent,
    CartManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { } 