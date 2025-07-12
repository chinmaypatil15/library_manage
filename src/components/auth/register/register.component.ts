import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>📚 Join Library</h2>
          <p>Create your account to get started</p>
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                [(ngModel)]="formData.firstName"
                required
                #firstName="ngModel"
                class="form-control"
                [class.error]="firstName.invalid && firstName.touched"
              >
              <div *ngIf="firstName.invalid && firstName.touched" class="error-text">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                [(ngModel)]="formData.lastName"
                required
                #lastName="ngModel"
                class="form-control"
                [class.error]="lastName.invalid && lastName.touched"
              >
              <div *ngIf="lastName.invalid && lastName.touched" class="error-text">
                Last name is required
              </div>
            </div>
          </div>

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
              minlength="6"
              #password="ngModel"
              class="form-control"
              [class.error]="password.invalid && password.touched"
            >
            <div *ngIf="password.invalid && password.touched" class="error-text">
              <div *ngIf="password.errors?.['required']">Password is required</div>
              <div *ngIf="password.errors?.['minlength']">Password must be at least 6 characters</div>
            </div>
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select
              id="role"
              name="role"
              [(ngModel)]="formData.role"
              required
              #role="ngModel"
              class="form-control"
              [class.error]="role.invalid && role.touched"
            >
              <option value="">Select a role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div *ngIf="role.invalid && role.touched" class="error-text">
              Please select a role
            </div>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="btn btn-primary btn-full"
          >
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
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
      max-width: 500px;
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
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
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

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
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

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.formData as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }

  private isFormValid(): boolean {
    return !!(this.formData.firstName && this.formData.lastName && 
             this.formData.email && this.formData.password && this.formData.role);
  }
}