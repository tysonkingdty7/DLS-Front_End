import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegisterData } from '../models/register-data.model';
import { LoginCredentials } from '../models/login-credentials.model';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // تحميل بيانات المستخدم من localStorage عند بدء التشغيل
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: RegisterData): Observable<RegisterResponse> {
    const url = `${this.apiUrl}User/Register`;
    console.log('Register request:', {
      url,
      data: userData,
      headers: this.httpOptions.headers
    });
    
    return this.http.post<RegisterResponse>(url, userData, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('Registration successful:', response);
        }),
        catchError(this.handleError)
      );
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}User/Login`,
      JSON.stringify(credentials),
      this.httpOptions
    ).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.user?.roles?.includes('Admin') || false;
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.user?.roles?.includes('User') || false;
  }

  /**
   * Fetch the current user's roles from the backend and update the currentUserSubject
   */
  refreshUserRoles(): void {
    this.http.get<any>(`${this.apiUrl}User/Profile`, this.httpOptions).subscribe({
      next: (profile) => {
        const current = this.getCurrentUser();
        if (current && profile && profile.roles) {
          const updatedUser = {
            ...current,
            user: {
              ...current.user,
              roles: profile.roles
            }
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      },
      error: (err) => {
        console.error('Error refreshing user roles:', err);
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير متوقع';
    let errorDetails = '';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ في الاتصال: ${error.error.message}`;
      errorDetails = 'خطأ في الاتصال بالخادم';
    } else {
      if (error.status === 0) {
        errorMessage = 'تعذر الاتصال بالخادم';
        errorDetails = `يرجى التحقق من:
1. أن الخادم يعمل على المنفذ 7050
2. عنوان الخادم: ${this.apiUrl}
3. إعدادات CORS في الباك إند
4. أن الخادم يستمع على جميع الواجهات (0.0.0.0)`;
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'بيانات غير صحيحة';
      } else if (error.status === 401) {
        errorMessage = 'غير مصرح لك بالوصول';
      } else if (error.status === 404) {
        errorMessage = 'المورد غير موجود';
      } else if (error.status === 500) {
        errorMessage = 'حدث خطأ في الخادم';
      }
    }
    
    console.error('Error details:', {
      status: error.status,
      message: error.message,
      url: error.url,
      error: error.error,
      details: errorDetails,
      apiUrl: this.apiUrl,
    });
    
    return throwError(() => new Error(errorMessage + (errorDetails ? '\n' + errorDetails : '')));
  }
} 