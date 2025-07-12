import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { BorrowTransaction } from '../../../models/book.model';
import { UserProfile } from '../../../models/user.model';

@Component({
  selector: 'app-borrowed-books',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="borrowed-books-container">
      <div class="page-header">
        <h1>📖 My Borrowed Books</h1>
        <div class="user-stats">
          <span class="stat">Borrowed: {{ borrowedBooks.length }}/{{ currentUser?.borrowLimit }}</span>
        </div>
      </div>

      <div *ngIf="borrowedBooks.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>No books borrowed yet</h3>
        <p>Browse our collection and borrow your first book!</p>
        <a routerLink="/user/books" class="btn btn-primary">Browse Books</a>
      </div>

      <div *ngIf="borrowedBooks.length > 0" class="borrowed-books-list">
        <div *ngFor="let transaction of borrowedBooks" class="book-card">
          <div class="book-header">
            <h3>{{ transaction.bookTitle }}</h3>
            <div class="status-badge borrowed">
              Borrowed
            </div>
          </div>
          
          <div class="book-info">
            <div class="info-row">
              <span class="label">Borrowed Date:</span>
              <span class="value">{{ transaction.borrowDate | date:'medium' }}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Days Borrowed:</span>
              <span class="value">{{ getDaysBorrowed(transaction.borrowDate) }} days</span>
            </div>

            <div class="info-row">
              <span class="label">Transaction ID:</span>
              <span class="value transaction-id">{{ transaction.id }}</span>
            </div>
          </div>

          <div class="book-actions">
            <button
              (click)="returnBook(transaction)"
              [disabled]="isLoading"
              class="btn btn-success"
            >
              {{ isLoading ? 'Processing...' : '✅ Return Book' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Return Confirmation Modal -->
      <div *ngIf="showReturnModal" class="modal-overlay" (click)="cancelReturn()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Confirm Book Return</h2>
          <p>Are you sure you want to return "<strong>{{ selectedTransaction?.bookTitle }}</strong>"?</p>
          
          <div class="modal-actions">
            <button (click)="cancelReturn()" class="btn btn-outline">
              Cancel
            </button>
            <button (click)="confirmReturn()" class="btn btn-success">
              Yes, Return Book
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="message" class="toast" [class]="messageType === 'success' ? 'toast-success' : 'toast-error'">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .borrowed-books-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
      position: relative;
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

    .user-stats {
      background: #f3f4f6;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      border: 2px solid #e5e7eb;
    }

    .stat {
      font-weight: 600;
      color: #374151;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #1f2937;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .borrowed-books-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .book-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .book-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .book-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem 1.5rem 1rem;
      background: #f8fafc;
    }

    .book-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
      flex: 1;
      line-height: 1.4;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .status-badge.borrowed {
      background: #dbeafe;
      color: #1e40af;
    }

    .book-info {
      padding: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .info-row:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .value {
      color: #1f2937;
      font-weight: 500;
    }

    .transaction-id {
      font-family: monospace;
      font-size: 0.75rem;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .book-actions {
      padding: 1.5rem;
      background: #f8fafc;
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
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .btn-success {
      background: #059669;
      color: white;
      width: 100%;
    }

    .btn-success:hover:not(:disabled) {
      background: #047857;
      transform: translateY(-1px);
    }

    .btn-success:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
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
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .modal-content h2 {
      color: #1f2937;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .modal-content p {
      color: #6b7280;
      margin-bottom: 2rem;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .toast {
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    .toast-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .toast-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .borrowed-books-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .book-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .modal-overlay {
        padding: 1rem;
      }

      .modal-actions {
        flex-direction: column;
      }

      .toast {
        top: 1rem;
        right: 1rem;
        left: 1rem;
      }
    }
  `]
})
export class BorrowedBooksComponent implements OnInit {
  borrowedBooks: BorrowTransaction[] = [];
  currentUser: UserProfile | null = null;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  showReturnModal = false;
  selectedTransaction: BorrowTransaction | null = null;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBorrowedBooks();
  }

  loadBorrowedBooks(): void {
    if (this.currentUser) {
      this.bookService.getUserBorrowedBooks(this.currentUser.id).subscribe(transactions => {
        this.borrowedBooks = transactions.sort((a, b) => 
          new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
        );
      });
    }
  }

  getDaysBorrowed(borrowDate: Date): number {
    const now = new Date();
    const borrowed = new Date(borrowDate);
    const diffTime = Math.abs(now.getTime() - borrowed.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  returnBook(transaction: BorrowTransaction): void {
    this.selectedTransaction = transaction;
    this.showReturnModal = true;
  }

  confirmReturn(): void {
    if (!this.selectedTransaction) return;

    this.isLoading = true;
    this.showReturnModal = false;

    this.bookService.returnBook(this.selectedTransaction.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showMessage(response.message, 'success');
          this.loadBorrowedBooks(); // Refresh the list
        } else {
          this.showMessage(response.message, 'error');
        }
        this.selectedTransaction = null;
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Failed to return book. Please try again.', 'error');
        this.selectedTransaction = null;
      }
    });
  }

  cancelReturn(): void {
    this.showReturnModal = false;
    this.selectedTransaction = null;
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}