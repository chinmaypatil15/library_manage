export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedAt: Date;
  addedBy: string;
}

export interface BorrowTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  borrowDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned';
}