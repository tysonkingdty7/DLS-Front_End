import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  editingCategory: Category | null = null;
  showForm = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      if (this.editingCategory) {
        this.categoryService.updateCategory(this.editingCategory.id, categoryData)
          .subscribe(() => {
            this.loadCategories();
            this.resetForm();
          });
      } else {
        this.categoryService.createCategory(categoryData)
          .subscribe(() => {
            this.loadCategories();
            this.resetForm();
          });
      }
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue(category);
    this.showForm = true;
  }

  deleteCategory(id: number): void {
    if (confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      this.categoryService.deleteCategory(id)
        .subscribe(() => {
          this.loadCategories();
        });
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.editingCategory = null;
    this.showForm = false;
  }
} 