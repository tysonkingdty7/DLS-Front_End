import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { RegisterData } from 'src/app/models/register-data.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      userType: ['', Validators.required],
      roles: [[]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = null;

      const userData: RegisterData = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        phone: this.registerForm.get('phone')?.value,
        userType: this.registerForm.get('userType')?.value,
        roles: this.registerForm.get('roles')?.value
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.loading = false;
          if (error.error && error.error.message) {
            this.error = error.error.message;
          } else if (error.status === 400) {
            this.error = 'بيانات غير صالحة. يرجى التحقق من المدخلات.';
          } else if (error.status === 409) {
            this.error = 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل.';
          } else {
            this.error = 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 