import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>📚 Welcome Back</h2>
          <p>Sign in to your library account</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="formData.email"
              required
              email
              #email="ngModel"
              class="form-control"
              [class.error]="email.invalid && email.touched"
              placeholder="Enter your email"
            >
            <div *ngIf="email.invalid && email.touched" class="error-text">
              <div *ngIf="email.errors?.['required']">Email is required</div>
              <div *ngIf="email.errors?.['email']">Please enter a valid email</div>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="formData.password"
              required
              #password="ngModel"
              class="form-control"
              [class.error]="password.invalid && password.touched"
              placeholder="Enter your password"
            >
            <div *ngIf="password.invalid && password.touched" class="error-text">
              Password is required
            </div>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="btn btn-primary btn-full"
          >
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="demo-accounts">
          <h4>Demo Accounts</h4>
          <div class="demo-buttons">
            <button (click)="loginAsDemo('admin')" class="btn btn-demo">
              Login as Admin
            </button>
            <button (click)="loginAsDemo('user')" class="btn btn-demo">
              Login as User
            </button>
          </div>
        </div>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create one here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .auth-card {
      background: white;
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      width: 100%;
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h2 {
      color: #1f2937;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .auth-header p {
      color: #6b7280;
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #2563eb;
    }

    .form-control.error {
      border-color: #ef4444;
    }

    .error-text {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }

    .btn-full {
      width: 100%;
    }

    .demo-accounts {
      text-align: center;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 0.5rem;
    }

    .demo-accounts h4 {
      margin: 0 0 1rem 0;
      color: #374151;
      font-size: 1rem;
    }

    .demo-buttons {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .btn-demo {
      background: #059669;
      color: white;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }

    .btn-demo:hover {
      background: #047857;
      transform: translateY(-1px);
    }

    .auth-footer {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .auth-footer a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .auth-container {
        padding: 1rem;
      }

      .auth-card {
        padding: 2rem;
      }

      .demo-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.formData.email || !this.formData.password) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.formData.email, this.formData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }

  loginAsDemo(role: 'admin' | 'user'): void {
    if (role === 'admin') {
      this.formData.email = 'admin@library.com';
      this.formData.password = 'admin123';
    } else {
      // Create a demo user if doesn't exist
      this.authService.register({
        firstName: 'Demo',
        lastName: 'User',
        email: 'user@library.com',
        password: 'user123',
        role: 'user',
        borrowLimit: 5 // Add this line with an appropriate default value
      }).subscribe(() => {
        this.formData.email = 'user@library.com';
        this.formData.password = 'user123';
        this.onSubmit();
      });
      return;
    }
    this.onSubmit();
  }
}