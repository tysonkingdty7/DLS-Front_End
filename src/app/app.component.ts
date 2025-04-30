import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  get currentUrl(): string {
    return this.router.url;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
