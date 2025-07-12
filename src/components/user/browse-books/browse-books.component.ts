import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../models/book.model';
import { UserProfile } from '../../../models/user.model';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="browse-books-container">
      <div class="page-header">
        <h1>📚 Browse Books</h1>
        <div class="user-stats">
          <span class="stat">Borrowed: {{ userBorrowedCount }}/{{ currentUser?.borrowLimit }}</span>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search books by title, author, or genre..."
            [(ngModel)]="searchTerm"
            (input)="filterBooks()"
            class="search-input"
          >
        </div>
        
        <div class="filter-options">
          <select [(ngModel)]="selectedGenre" (change)="filterBooks()" class="filter-select">
            <option value="">All Genres</option>
            <option *ngFor="let genre of genres" [value]="genre">{{ genre }}</option>
          </select>
          
          <select [(ngModel)]="availabilityFilter" (change)="filterBooks()" class="filter-select">
            <option value="">All Books</option>
            <option value="available">Available Only</option>
          </select>
        </div>
      </div>

      <div *ngIf="filteredBooks.length === 0" class="empty-state">
        <p>No books found matching your criteria.</p>
      </div>

      <div class="books-grid">
        <div *ngFor="let book of filteredBooks" class="book-card">
          <div class="book-header">
            <h3>{{ book.title }}</h3>
            <div class="availability-badge" [class]="book.availableCopies > 0 ? 'available' : 'unavailable'">
              {{ book.availableCopies > 0 ? 'Available' : 'Not Available' }}
            </div>
          </div>
          
          <div class="book-info">
            <p><strong>Author:</strong> {{ book.author }}</p>
            <p><strong>Genre:</strong> {{ book.genre }}</p>
            <p><strong>ISBN:</strong> {{ book.isbn }}</p>
            <p class="book-description">{{ book.description }}</p>
          </div>

          <div class="book-stats">
            <div class="stat-item">
              <span class="stat-label">Available Copies</span>
              <span class="stat-value" [class]="book.availableCopies > 0 ? 'available' : 'unavailable'">
                {{ book.availableCopies }} / {{ book.totalCopies }}
              </span>
            </div>
          </div>

          <div class="book-actions">
            <button
              (click)="borrowBook(book)"
              [disabled]="book.availableCopies <= 0 || userBorrowedCount >= (currentUser?.borrowLimit || 0) || isLoading"
              class="btn btn-primary"
            >
              {{ isLoading ? 'Processing...' : 'Borrow Book' }}
            </button>
          </div>

          <div *ngIf="book.availableCopies <= 0" class="unavailable-message">
            All copies are currently borrowed
          </div>

          <div *ngIf="userBorrowedCount >= (currentUser?.borrowLimit || 0)" class="limit-message">
            You have reached your borrowing limit
          </div>
        </div>
      </div>

      <div *ngIf="message" class="toast" [class]="messageType === 'success' ? 'toast-success' : 'toast-error'">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .browse-books-container {
      padding: 2rem;
      max-width: 1200px;
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

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
      font-size: 1.125rem;
      font-weight: 600;
      flex: 1;
      line-height: 1.4;
    }

    .availability-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .availability-badge.available {
      background: #d1fae5;
      color: #047857;
    }

    .availability-badge.unavailable {
      background: #fee2e2;
      color: #dc2626;
    }

    .book-info {
      padding: 1rem 1.5rem;
    }

    .book-info p {
      margin: 0 0 0.5rem 0;
      color: #374151;
      font-size: 0.875rem;
    }

    .book-description {
      color: #6b7280;
      line-height: 1.5;
      margin-top: 0.75rem;
    }

    .book-stats {
      padding: 1rem 1.5rem;
      background: #f8fafc;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 700;
    }

    .stat-value.available {
      color: #059669;
    }

    .stat-value.unavailable {
      color: #dc2626;
    }

    .book-actions {
      padding: 1.5rem;
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
      color: #ffffff;
      cursor: not-allowed;
      transform: none;
    }

    .unavailable-message,
    .limit-message {
      padding: 0.75rem 1.5rem;
      background: #fef2f2;
      color: #dc2626;
      font-size: 0.875rem;
      text-align: center;
      border-top: 1px solid #fecaca;
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
      .browse-books-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .filter-options {
        flex-direction: column;
      }

      .filter-select {
        min-width: auto;
        width: 100%;
      }

      .books-grid {
        grid-template-columns: 1fr;
      }

      .toast {
        top: 1rem;
        right: 1rem;
        left: 1rem;
      }
    }
  `]
})
export class BrowseBooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  genres: string[] = [];
  searchTerm = '';
  selectedGenre = '';
  availabilityFilter = '';
  currentUser: UserProfile | null = null;
  userBorrowedCount = 0;
  message = '';
  messageType: 'success' | 'error' = 'success';
  isLoading = false;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBooks();
    this.loadUserBorrowedCount();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.filteredBooks = books;
      this.extractGenres();
    });
  }

  loadUserBorrowedCount(): void {
    if (this.currentUser) {
      this.bookService.getUserBorrowedBooks(this.currentUser.id).subscribe(transactions => {
        this.userBorrowedCount = transactions.length;
      });
    }
  }

  extractGenres(): void {
    const genreSet = new Set(this.books.map(book => book.genre));
    this.genres = Array.from(genreSet).sort();
  }

  filterBooks(): void {
    let filtered = this.books;

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term)
      );
    }

    // Filter by genre
    if (this.selectedGenre) {
      filtered = filtered.filter(book => book.genre === this.selectedGenre);
    }

    // Filter by availability
    if (this.availabilityFilter === 'available') {
      filtered = filtered.filter(book => book.availableCopies > 0);
    }

    this.filteredBooks = filtered;
  }

  borrowBook(book: Book): void {
    if (!this.currentUser) return;

    if (this.userBorrowedCount >= (this.currentUser.borrowLimit || 0)) {
      this.showMessage('You have reached your borrowing limit', 'error');
      return;
    }

    if (book.availableCopies <= 0) {
      this.showMessage('No copies available', 'error');
      return;
    }

    this.isLoading = true;

    this.bookService.borrowBook(
      book.id,
      this.currentUser.id,
      `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      this.currentUser.email
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showMessage(response.message, 'success');
          this.loadBooks(); // Refresh books to update available copies
          this.loadUserBorrowedCount(); // Update user's borrowed count
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Failed to borrow book. Please try again.', 'error');
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}