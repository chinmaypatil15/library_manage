import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { BorrowTransaction } from '../../../models/book.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transactions-container">
      <div class="page-header">
        <h1>📊 Transaction History</h1>
        <div class="stats">
          <span class="stat-item">Total: {{ transactions.length }}</span>
          <span class="stat-item active">Active: {{ getActiveTransactions() }}</span>
          <span class="stat-item returned">Returned: {{ getReturnedTransactions() }}</span>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search by book title, user name, or email..."
            [(ngModel)]="searchTerm"
            (input)="filterTransactions()"
            class="search-input"
          >
        </div>
        
        <div class="filter-options">
          <select [(ngModel)]="statusFilter" (change)="filterTransactions()" class="filter-select">
            <option value="">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
          </select>
          
          <select [(ngModel)]="sortBy" (change)="sortTransactions()" class="filter-select">
            <option value="borrowDate">Sort by Borrow Date</option>
            <option value="bookTitle">Sort by Book Title</option>
            <option value="userName">Sort by User Name</option>
            <option value="returnDate">Sort by Return Date</option>
          </select>
        </div>
      </div>

      <div *ngIf="filteredTransactions.length === 0" class="empty-state">
        <p>No transactions found matching your criteria.</p>
      </div>

      <div *ngIf="filteredTransactions.length > 0" class="transactions-list">
        <div *ngFor="let transaction of filteredTransactions" class="transaction-card">
          <div class="transaction-header">
            <div class="transaction-info">
              <h3>{{ transaction.bookTitle }}</h3>
              <p class="user-info">{{ transaction.userName }} ({{ transaction.userEmail }})</p>
            </div>
            <div class="status-badge" [class]="'status-' + transaction.status">
              {{ transaction.status | titlecase }}
            </div>
          </div>

          <div class="transaction-details">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Borrowed Date</span>
                <span class="detail-value">{{ transaction.borrowDate | date:'medium' }}</span>
              </div>
              
              <div class="detail-item" *ngIf="transaction.returnDate">
                <span class="detail-label">Returned Date</span>
                <span class="detail-value">{{ transaction.returnDate | date:'medium' }}</span>
              </div>

              <div class="detail-item" *ngIf="!transaction.returnDate">
                <span class="detail-label">Days Borrowed</span>
                <span class="detail-value days-overdue" [class.overdue]="getDaysBorrowed(transaction.borrowDate) > 14">
                  {{ getDaysBorrowed(transaction.borrowDate) }} days
                  <span *ngIf="getDaysBorrowed(transaction.borrowDate) > 14" class="overdue-text">(Overdue)</span>
                </span>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Transaction ID</span>
                <span class="detail-value transaction-id">{{ transaction.id }}</span>
              </div>

              <div class="detail-item" *ngIf="transaction.returnDate">
                <span class="detail-label">Duration</span>
                <span class="detail-value">{{ getBorrowDuration(transaction.borrowDate, transaction.returnDate) }} days</span>
              </div>
            </div>
          </div>

          <div class="transaction-footer" *ngIf="transaction.status === 'borrowed' && getDaysBorrowed(transaction.borrowDate) > 14">
            <div class="overdue-warning">
              ⚠️ This book is overdue. Consider following up with the user.
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Summary -->
      <div class="statistics-section">
        <h2>📈 Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <h3>{{ getActiveTransactions() }}</h3>
              <p>Books Currently Borrowed</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3>{{ getReturnedTransactions() }}</h3>
              <p>Books Returned</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⚠️</div>
            <div class="stat-content">
              <h3>{{ getOverdueTransactions() }}</h3>
              <p>Overdue Books</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>{{ getAverageReturnTime() }}</h3>
              <p>Avg. Return Time (days)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
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
      flex-wrap: wrap;
    }

    .stat-item {
      background: #f3f4f6;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      color: #374151;
    }

    .stat-item.active {
      background: #dbeafe;
      color: #1e40af;
    }

    .stat-item.returned {
      background: #d1fae5;
      color: #047857;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .search-bar {
      margin-bottom: 1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .filter-options {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 0.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      background: white;
      min-width: 150px;
    }

    .filter-select:focus {
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

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .transaction-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .transaction-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .transaction-info h3 {
      margin: 0 0 0.5rem 0;
      color: #1f2937;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .user-info {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
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
      padding: 1.5rem;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .detail-row:last-child {
      margin-bottom: 0;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
    }

    .detail-value {
      color: #1f2937;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .transaction-id {
      font-family: monospace;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }

    .days-overdue.overdue {
      color: #dc2626;
      font-weight: 600;
    }

    .overdue-text {
      font-size: 0.75rem;
      color: #dc2626;
    }

    .transaction-footer {
      padding: 1rem 1.5rem;
      background: #fef2f2;
      border-top: 1px solid #fecaca;
    }

    .overdue-warning {
      color: #dc2626;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .statistics-section {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .statistics-section h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #e5e7eb;
    }

    .stat-icon {
      font-size: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-content p {
      margin: 0;
      color: #6b7280;
      font-weight: 500;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .transactions-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filter-options {
        flex-direction: column;
      }

      .filter-select {
        min-width: auto;
        width: 100%;
      }

      .transaction-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .detail-row {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: BorrowTransaction[] = [];
  filteredTransactions: BorrowTransaction[] = [];
  searchTerm = '';
  statusFilter = '';
  sortBy = 'borrowDate';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.bookService.getAllTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.sortTransactions();
    });
  }

  filterTransactions(): void {
    let filtered = this.transactions;

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.bookTitle.toLowerCase().includes(term) ||
        transaction.userName.toLowerCase().includes(term) ||
        transaction.userEmail.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (this.statusFilter) {
      filtered = filtered.filter(transaction => transaction.status === this.statusFilter);
    }

    this.filteredTransactions = filtered;
    this.sortFilteredTransactions();
  }

  sortTransactions(): void {
    this.filterTransactions();
  }

  private sortFilteredTransactions(): void {
    this.filteredTransactions.sort((a, b) => {
      switch (this.sortBy) {
        case 'borrowDate':
          return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
        case 'bookTitle':
          return a.bookTitle.localeCompare(b.bookTitle);
        case 'userName':
          return a.userName.localeCompare(b.userName);
        case 'returnDate':
          if (a.returnDate && b.returnDate) {
            return new Date(b.returnDate).getTime() - new Date(a.returnDate).getTime();
          }
          if (a.returnDate && !b.returnDate) return -1;
          if (!a.returnDate && b.returnDate) return 1;
          return 0;
        default:
          return 0;
      }
    });
  }

  getActiveTransactions(): number {
    return this.transactions.filter(t => t.status === 'borrowed').length;
  }

  getReturnedTransactions(): number {
    return this.transactions.filter(t => t.status === 'returned').length;
  }

  getOverdueTransactions(): number {
    return this.transactions.filter(t => 
      t.status === 'borrowed' && this.getDaysBorrowed(t.borrowDate) > 14
    ).length;
  }

  getAverageReturnTime(): number {
    const returnedTransactions = this.transactions.filter(t => t.status === 'returned' && t.returnDate);
    if (returnedTransactions.length === 0) return 0;

    const totalDays = returnedTransactions.reduce((sum, transaction) => {
      return sum + this.getBorrowDuration(transaction.borrowDate, transaction.returnDate!);
    }, 0);

    return Math.round(totalDays / returnedTransactions.length);
  }

  getDaysBorrowed(borrowDate: Date): number {
    const now = new Date();
    const borrowed = new Date(borrowDate);
    const diffTime = Math.abs(now.getTime() - borrowed.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getBorrowDuration(borrowDate: Date, returnDate: Date): number {
    const borrowed = new Date(borrowDate);
    const returned = new Date(returnDate);
    const diffTime = Math.abs(returned.getTime() - borrowed.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}