import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>👤 My Profile</h1>
        <div class="profile-badge" [class]="'role-' + currentUser?.role">
          {{ currentUser?.role | titlecase }}
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <div class="card-header">
            <h2>Profile Information</h2>
            <button
              (click)="toggleEdit()"
              class="btn btn-outline"
            >
              {{ isEditing ? 'Cancel' : 'Edit Profile' }}
            </button>
          </div>

          <form (ngSubmit)="updateProfile()" #profileForm="ngForm" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="formData.firstName"
                  [readonly]="!isEditing"
                  required
                  class="form-control"
                  [class.readonly]="!isEditing"
                >
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="formData.lastName"
                  [readonly]="!isEditing"
                  required
                  class="form-control"
                  [class.readonly]="!isEditing"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="formData.email"
                readonly
                class="form-control readonly"
              >
              <small class="form-text">Email cannot be changed</small>
            </div>

            <div class="form-group">
              <label for="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                [value]="formData.role | titlecase"
                readonly
                class="form-control readonly"
              >
              <small class="form-text">Role cannot be changed</small>
            </div>

            <div *ngIf="formData.role === 'user'" class="form-group">
              <label for="borrowLimit">Borrow Limit</label>
              <input
                type="number"
                id="borrowLimit"
                name="borrowLimit"
                [value]="formData.borrowLimit"
                readonly
                class="form-control readonly"
              >
              <small class="form-text">Currently borrowed: {{ formData.borrowedBooks || 0 }} books</small>
            </div>

            <div *ngIf="message" class="alert" [class]="messageType === 'success' ? 'alert-success' : 'alert-error'">
              {{ message }}
            </div>

            <div *ngIf="isEditing" class="form-actions">
              <button
                type="button"
                (click)="toggleEdit()"
                class="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="profileForm.invalid || isLoading"
                class="btn btn-primary"
              >
                {{ isLoading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>

        <div class="stats-card" *ngIf="currentUser?.role === 'user'">
          <h3>Your Library Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ currentUser?.borrowedBooks || 0 }}</div>
              <div class="stat-label">Currently Borrowed</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ (currentUser?.borrowLimit || 0) - (currentUser?.borrowedBooks || 0) }}</div>
              <div class="stat-label">Remaining Limit</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ currentUser?.borrowLimit || 0 }}</div>
              <div class="stat-label">Total Limit</div>
            </div>
          </div>
        </div>

        <div class="account-info-card">
          <h3>Account Information</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Account Type</span>
              <span class="info-value">{{ currentUser?.role | titlecase }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Member Since</span>
              <span class="info-value">{{ getCurrentDate() | date:'mediumDate' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="info-value status-active">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .profile-header h1 {
      color: #1f2937;
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .profile-badge {
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .role-admin {
      background: #fef3c7;
      color: #d97706;
    }

    .role-user {
      background: #d1fae5;
      color: #065f46;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .profile-card,
    .stats-card,
    .account-info-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .profile-card {
      grid-column: 1;
      grid-row: 1 / 3;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .profile-form {
      padding: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
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

    .form-control.readonly {
      background: #f9fafb;
      border-color: #e5e7eb;
      color: #6b7280;
      cursor: not-allowed;
    }

    .form-text {
      color: #6b7280;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
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
    }

    .btn-outline {
      background: transparent;
      color: #374151;
      border: 2px solid #e5e7eb;
    }

    .btn-outline:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .stats-card h3,
    .account-info-card h3 {
      margin: 0;
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      color: #1f2937;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1.5rem;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
    }

    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
    }

    .info-list {
      padding: 1.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 600;
      color: #374151;
    }

    .info-value {
      color: #1f2937;
      font-weight: 500;
    }

    .status-active {
      color: #059669;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .profile-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .profile-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .profile-card {
        grid-column: 1;
        grid-row: auto;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .card-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: UserProfile | null = null;
  isEditing = false;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    borrowLimit: 0,
    borrowedBooks: 0
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.formData = { ...this.currentUser };
    }
  }

  toggleEdit(): void {
    if (this.isEditing && this.currentUser) {
      // Reset form data when canceling
      this.formData = { ...this.currentUser };
    }
    this.isEditing = !this.isEditing;
    this.message = '';
  }

  updateProfile(): void {
    this.isLoading = true;
    this.message = '';

    const updateData = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.message = response.message;
          this.messageType = 'success';
          this.isEditing = false;
          this.currentUser = this.authService.getCurrentUser();
          if (this.currentUser) {
            this.formData = { ...this.currentUser };
          }
        } else {
          this.message = response.message;
          this.messageType = 'error';
        }
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Failed to update profile. Please try again.';
        this.messageType = 'error';
      }
    });
  }

  getCurrentDate(): Date {
    return new Date();
  }
}