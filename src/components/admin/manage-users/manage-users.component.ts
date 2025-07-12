import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BookService } from '../../../services/book.service';
import { User } from '../../../models/user.model';
import { BorrowTransaction } from '../../../models/book.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-users-container">
      <div class="page-header">
        <h1>👥 Manage Users</h1>
        <div class="stats">
          <span class="stat-item">Total Users: {{ users.length }}</span>
        </div>
      </div>

      <div class="search-section">
        <input
          type="text"
          placeholder="Search users by name or email..."
          [(ngModel)]="searchTerm"
          (input)="filterUsers()"
          class="search-input"
        >
      </div>

      <div *ngIf="filteredUsers.length === 0" class="empty-state">
        <p>No users found.</p>
      </div>

      <div class="users-grid">
        <div *ngFor="let user of filteredUsers" class="user-card">
          <div class="user-header">
            <div class="user-info">
              <h3>{{ user.firstName }} {{ user.lastName }}</h3>
              <p class="user-email">{{ user.email }}</p>
            </div>
            <div class="user-role">
              <span class="role-badge" [class]="'role-' + user.role">{{ user.role }}</span>
            </div>
          </div>

          <div class="user-stats">
            <div class="stat">
              <span class="stat-label">Borrow Limit</span>
              <span class="stat-value">{{ user.borrowLimit }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Currently Borrowed</span>
              <span class="stat-value">{{ getUserBorrowedCount(user.id) }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Transactions</span>
              <span class="stat-value">{{ getUserTotalTransactions(user.id) }}</span>
            </div>
          </div>

          <div class="user-actions">
            <button (click)="viewUserTransactions(user)" class="btn btn-outline">
              📊 View Transactions
            </button>
          </div>

          <div class="user-footer">
            <small>Member since: {{ user.createdAt | date:'mediumDate' }}</small>
          </div>
        </div>
      </div>

      <!-- User Transactions Modal -->
      <div *ngIf="selectedUser" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ selectedUser.firstName }} {{ selectedUser.lastName }} - Transactions</h2>
            <button (click)="closeModal()" class="close-btn">✕</button>
          </div>

          <div class="modal-body">
            <div class="user-summary">
              <div class="summary-item">
                <span class="label">Email:</span>
                <span class="value">{{ selectedUser.email }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total Transactions:</span>
                <span class="value">{{ userTransactions.length }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Currently Borrowed:</span>
                <span class="value">{{ getCurrentlyBorrowedCount() }}</span>
              </div>
            </div>

            <div *ngIf="userTransactions.length === 0" class="no-transactions">
              <p>No transactions found for this user.</p>
            </div>

            <div *ngIf="userTransactions.length > 0" class="transactions-list">
              <div *ngFor="let transaction of userTransactions" class="transaction-item">
                <div class="transaction-header">
                  <h4>{{ transaction.bookTitle }}</h4>
                  <span class="status-badge" [class]="'status-' + transaction.status">
                    {{ transaction.status | titlecase }}
                  </span>
                </div>
                <div class="transaction-details">
                  <div class="detail-item">
                    <span class="detail-label">Borrowed:</span>
                    <span class="detail-value">{{ transaction.borrowDate | date:'medium' }}</span>
                  </div>
                  <div *ngIf="transaction.returnDate" class="detail-item">
                    <span class="detail-label">Returned:</span>
                    <span class="detail-value">{{ transaction.returnDate | date:'medium' }}</span>
                  </div>
                  <div *ngIf="!transaction.returnDate" class="detail-item">
                    <span class="detail-label">Days Borrowed:</span>
                    <span class="detail-value">{{ getDaysBorrowed(transaction.borrowDate) }} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-users-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      color: #1f2937;
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .stats {
      display: flex;
      gap: 1rem;
    }

    .stat-item {
      background: #f3f4f6;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      color: #374151;
    }

    .search-section {
      margin-bottom: 2rem;
    }

    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .user-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .user-card:hover {
      transform: translateY(-2px);
    }

    .user-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .user-info h3 {
      margin: 0 0 0.25rem 0;
      color: #1f2937;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .user-email {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-admin {
      background: #fef3c7;
      color: #d97706;
    }

    .role-user {
      background: #d1fae5;
      color: #065f46;
    }

    .user-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1.5rem;
    }

    .stat {
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .user-actions {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      width: 100%;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
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

    .user-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .user-footer small {
      color: #6b7280;
      font-size: 0.75rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }

    .close-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .user-summary {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .summary-item:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 600;
      color: #374151;
    }

    .value {
      color: #1f2937;
      font-weight: 500;
    }

    .no-transactions {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .transaction-item {
      background: #f8fafc;
      border-radius: 0.5rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
    }

    .transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .transaction-header h4 {
      margin: 0;
      color: #1f2937;
      font-size: 1rem;
      font-weight: 600;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.status-borrowed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.status-returned {
      background: #d1fae5;
      color: #047857;
    }

    .transaction-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      font-weight: 500;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .detail-value {
      color: #374151;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .manage-users-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .users-grid {
        grid-template-columns: 1fr;
      }

      .user-stats {
        grid-template-columns: 1fr;
      }

      .modal-overlay {
        padding: 1rem;
      }

      .modal-content {
        max-height: 95vh;
      }

      .transaction-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }

      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }
  `]
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  selectedUser: User | null = null;
  userTransactions: BorrowTransaction[] = [];
  allTransactions: BorrowTransaction[] = [];

  constructor(
    private authService: AuthService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTransactions();
  }

  loadUsers(): void {
    this.users = this.authService.getAllUsers();
    this.filteredUsers = this.users;
  }

  loadTransactions(): void {
    this.bookService.getAllTransactions().subscribe(transactions => {
      this.allTransactions = transactions;
    });
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
  }

  getUserBorrowedCount(userId: string): number {
    return this.allTransactions.filter(t => t.userId === userId && t.status === 'borrowed').length;
  }

  getUserTotalTransactions(userId: string): number {
    return this.allTransactions.filter(t => t.userId === userId).length;
  }

  viewUserTransactions(user: User): void {
    this.selectedUser = user;
    this.userTransactions = this.allTransactions
      .filter(t => t.userId === user.id)
      .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime());
  }

  closeModal(): void {
    this.selectedUser = null;
    this.userTransactions = [];
  }

  getDaysBorrowed(borrowDate: Date): number {
    const now = new Date();
    const borrowed = new Date(borrowDate);
    const diffTime = Math.abs(now.getTime() - borrowed.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getCurrentlyBorrowedCount(): number {
    return this.userTransactions.filter(t => t.status === 'borrowed').length;
  }
}