import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Book, BorrowTransaction } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  public books$ = this.booksSubject.asObservable();

  private transactionsSubject = new BehaviorSubject<BorrowTransaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  private books: Book[] = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      genre: 'Classic Literature',
      description: 'A classic American novel set in the Jazz Age.',
      totalCopies: 5,
      availableCopies: 5,
      addedAt: new Date(),
      addedBy: 'admin@library.com'
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      genre: 'Classic Literature',
      description: 'A gripping tale of racial injustice and childhood innocence.',
      totalCopies: 3,
      availableCopies: 3,
      addedAt: new Date(),
      addedBy: 'admin@library.com'
    }
  ];

  private transactions: BorrowTransaction[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    }
    this.booksSubject.next(this.books);

    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    }
    this.transactionsSubject.next(this.transactions);
  }

  private saveBooks(): void {
    localStorage.setItem('books', JSON.stringify(this.books));
    this.booksSubject.next(this.books);
  }

  private saveTransactions(): void {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
    this.transactionsSubject.next(this.transactions);
  }

  getBooks(): Observable<Book[]> {
    return of(this.books);
  }

  getAvailableBooks(): Observable<Book[]> {
    return of(this.books.filter(book => book.availableCopies > 0));
  }

  addBook(bookData: Omit<Book, 'id' | 'addedAt'>): Observable<{success: boolean, message: string}> {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      addedAt: new Date()
    };

    this.books.push(newBook);
    this.saveBooks();
    return of({success: true, message: 'Book added successfully'});
  }

  updateBook(id: string, bookData: Partial<Book>): Observable<{success: boolean, message: string}> {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      this.books[bookIndex] = {...this.books[bookIndex], ...bookData};
      this.saveBooks();
      return of({success: true, message: 'Book updated successfully'});
    }
    return of({success: false, message: 'Book not found'});
  }

  borrowBook(bookId: string, userId: string, userName: string, userEmail: string): Observable<{success: boolean, message: string}> {
    const book = this.books.find(b => b.id === bookId);
    if (!book) {
      return of({success: false, message: 'Book not found'});
    }

    if (book.availableCopies <= 0) {
      return of({success: false, message: 'No copies available'});
    }

    // Check user's borrow limit
    const userBorrowedCount = this.transactions.filter(t => t.userId === userId && t.status === 'borrowed').length;
    if (userBorrowedCount >= 5) {
      return of({success: false, message: 'Borrow limit reached'});
    }

    const transaction: BorrowTransaction = {
      id: Date.now().toString(),
      userId,
      userName,
      userEmail,
      bookId,
      bookTitle: book.title,
      borrowDate: new Date(),
      status: 'borrowed'
    };

    this.transactions.push(transaction);
    book.availableCopies--;
    
    this.saveBooks();
    this.saveTransactions();
    
    return of({success: true, message: 'Book borrowed successfully'});
  }

  returnBook(transactionId: string): Observable<{success: boolean, message: string}> {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) {
      return of({success: false, message: 'Transaction not found'});
    }

    const book = this.books.find(b => b.id === transaction.bookId);
    if (book) {
      book.availableCopies++;
    }

    transaction.status = 'returned';
    transaction.returnDate = new Date();

    this.saveBooks();
    this.saveTransactions();

    return of({success: true, message: 'Book returned successfully'});
  }

  getUserBorrowedBooks(userId: string): Observable<BorrowTransaction[]> {
    const userTransactions = this.transactions.filter(t => t.userId === userId && t.status === 'borrowed');
    return of(userTransactions);
  }

  getAllTransactions(): Observable<BorrowTransaction[]> {
    return of(this.transactions);
  }
}