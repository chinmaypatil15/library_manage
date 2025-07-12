import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-books-container">
      <div class="page-header">
        <h1>📚 Manage Books</h1>
        <button (click)="showAddForm = !showAddForm" class="btn btn-primary">
          {{ showAddForm ? 'Cancel' : '+ Add New Book' }}
        </button>
      </div>

      <!-- Add Book Form -->
      <div *ngIf="showAddForm" class="add-book-form">
        <h2>Add New Book</h2>
        <form (ngSubmit)="addBook()" #bookForm="ngForm" class="book-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="newBook.title"
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                [(ngModel)]="newBook.author"
                required
                class="form-control"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                [(ngModel)]="newBook.isbn"
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                [(ngModel)]="newBook.genre"
                required
                class="form-control"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="newBook.description"
              required
              class="form-control"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="totalCopies">Total Copies</label>
            <input
              type="number"
              id="totalCopies"
              name="totalCopies"
              [(ngModel)]="newBook.totalCopies"
              required
              min="1"
              class="form-control"
            >
          </div>

          <div *ngIf="message" class="alert" [class]="messageType === 'success' ? 'alert-success' : 'alert-error'">
            {{ message }}
          </div>

          <button type="submit" [disabled]="bookForm.invalid" class="btn btn-primary">
            Add Book
          </button>
        </form>
      </div>

      <!-- Books List -->
      <div class="books-section">
        <h2>All Books ({{ books.length }})</h2>
        
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search books..."
            [(ngModel)]="searchTerm"
            class="search-input"
          >
        </div>

        <div *ngIf="filteredBooks.length === 0" class="empty-state">
          <p>No books found.</p>
        </div>

        <div class="books-grid">
          <div *ngFor="let book of filteredBooks" class="book-card">
            <div class="book-header">
              <h3>{{ book.title }}</h3>
              <div class="book-actions">
                <button (click)="editBook(book)" class="btn btn-sm btn-outline">
                  ✏️ Edit
                </button>
              </div>
            </div>
            
            <div class="book-info">
              <p><strong>Author:</strong> {{ book.author }}</p>
              <p><strong>Genre:</strong> {{ book.genre }}</p>
              <p><strong>ISBN:</strong> {{ book.isbn }}</p>
              <p class="book-description">{{ book.description }}</p>
            </div>

            <div class="book-stats">
              <div class="stat">
                <span class="stat-label">Total Copies</span>
                <span class="stat-value">{{ book.totalCopies }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Available</span>
                <span class="stat-value" [class]="book.availableCopies > 0 ? 'available' : 'unavailable'">
                  {{ book.availableCopies }}
                </span>
              </div>
              <div class="stat">
                <span class="stat-label">Borrowed</span>
                <span class="stat-value">{{ book.totalCopies - book.availableCopies }}</span>
              </div>
            </div>

            <div class="book-footer">
              <small>Added: {{ book.addedAt | date:'short' }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Book Modal -->
      <div *ngIf="editingBook" class="modal-overlay" (click)="cancelEdit()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Edit Book</h2>
          <form (ngSubmit)="updateBook()" #editForm="ngForm" class="book-form">
            <div class="form-row">
              <div class="form-group">
                <label for="editTitle">Title</label>
                <input
                  type="text"
                  id="editTitle"
                  name="editTitle"
                  [(ngModel)]="editingBook.title"
                  required
                  class="form-control"
                >
              </div>
              <div class="form-group">
                <label for="editAuthor">Author</label>
                <input
                  type="text"
                  id="editAuthor"
                  name="editAuthor"
                  [(ngModel)]="editingBook.author"
                  required
                  class="form-control"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="editIsbn">ISBN</label>
                <input
                  type="text"
                  id="editIsbn"
                  name="editIsbn"
                  [(ngModel)]="editingBook.isbn"
                  required
                  class="form-control"
                >
              </div>
              <div class="form-group">
                <label for="editGenre">Genre</label>
                <input
                  type="text"
                  id="editGenre"
                  name="editGenre"
                  [(ngModel)]="editingBook.genre"
                  required
                  class="form-control"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="editDescription">Description</label>
              <textarea
                id="editDescription"
                name="editDescription"
                [(ngModel)]="editingBook.description"
                required
                class="form-control"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="editTotalCopies">Total Copies</label>
              <input
                type="number"
                id="editTotalCopies"
                name="editTotalCopies"
                [(ngModel)]="editingBook.totalCopies"
                required
                min="1"
                class="form-control"
              >
            </div>

            <div class="modal-actions">
              <button type="button" (click)="cancelEdit()" class="btn btn-outline">
                Cancel
              </button>
              <button type="submit" [disabled]="editForm.invalid" class="btn btn-primary">
                Update Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-books-container {
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

    .add-book-form {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .add-book-form h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .book-form {
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

    .alert {
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
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

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .books-section h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .search-bar {
      margin-bottom: 2rem;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
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
    }

    .book-actions {
      display: flex;
      gap: 0.5rem;
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
    }

    .book-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #f8fafc;
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
    }

    .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-value.available {
      color: #059669;
    }

    .stat-value.unavailable {
      color: #dc2626;
    }

    .book-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .book-footer small {
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
      padding: 2rem;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-content h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
      .manage-books-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .books-grid {
        grid-template-columns: 1fr;
      }

      .modal-overlay {
        padding: 1rem;
      }

      .modal-content {
        padding: 1.5rem;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ManageBooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm = '';
  showAddForm = false;
  editingBook: Book | null = null;
  message = '';
  messageType: 'success' | 'error' = 'success';

  newBook = {
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    addedBy: ''
  };

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    const currentUser = this.authService.getCurrentUser();
    this.newBook.addedBy = currentUser?.email || '';
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.filterBooks();
    });
  }

  filterBooks(): void {
    if (!this.searchTerm) {
      this.filteredBooks = this.books;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term) ||
        book.isbn.toLowerCase().includes(term)
      );
    }
  }

  addBook(): void {
    this.newBook.availableCopies = this.newBook.totalCopies;
    
    this.bookService.addBook(this.newBook).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = response.message;
          this.messageType = 'success';
          this.resetForm();
          this.loadBooks();
          setTimeout(() => {
            this.message = '';
            this.showAddForm = false;
          }, 2000);
        } else {
          this.message = response.message;
          this.messageType = 'error';
        }
      },
      error: () => {
        this.message = 'Failed to add book. Please try again.';
        this.messageType = 'error';
      }
    });
  }

  editBook(book: Book): void {
    this.editingBook = { ...book };
  }

  updateBook(): void {
    if (!this.editingBook) return;

    this.bookService.updateBook(this.editingBook.id, this.editingBook).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadBooks();
          this.cancelEdit();
        }
      }
    });
  }

  cancelEdit(): void {
    this.editingBook = null;
  }

  private resetForm(): void {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      description: '',
      totalCopies: 1,
      availableCopies: 1,
      addedBy: this.authService.getCurrentUser()?.email || ''
    };
  }

  ngOnChanges(): void {
    this.filterBooks();
  }
}