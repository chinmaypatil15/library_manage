import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private users: User[] = [
    {
      id: '1',
      email: 'admin@library.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      borrowLimit: 0,
      createdAt: new Date()
    }
  ];

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  register(userData: Omit<User, 'id' | 'createdAt'>): Observable<{success: boolean, message: string}> {
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return of({success: false, message: 'Email already exists'});
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      borrowLimit: userData.role === 'user' ? 6 : 0
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    return of({success: true, message: 'Registration successful'});
  }

  login(email: string, password: string): Observable<{success: boolean, message: string, user?: UserProfile}> {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }

    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        borrowLimit: user.borrowLimit,
        borrowedBooks: this.getBorrowedBooksCount(user.id)
      };
      
      this.currentUserSubject.next(userProfile);
      localStorage.setItem('currentUser', JSON.stringify(userProfile));
      return of({success: true, message: 'Login successful', user: userProfile});
    }
    
    return of({success: false, message: 'Invalid credentials'});
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  updateProfile(updatedData: Partial<UserProfile>): Observable<{success: boolean, message: string}> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return of({success: false, message: 'No user logged in'});
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }

    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      this.users[userIndex] = {...this.users[userIndex], ...updatedData};
      localStorage.setItem('users', JSON.stringify(this.users));
      
      const updatedProfile = {...currentUser, ...updatedData};
      this.currentUserSubject.next(updatedProfile);
      localStorage.setItem('currentUser', JSON.stringify(updatedProfile));
      
      return of({success: true, message: 'Profile updated successfully'});
    }
    
    return of({success: false, message: 'User not found'});
  }

  getAllUsers(): User[] {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    return this.users.filter(u => u.role === 'user');
  }

  private getBorrowedBooksCount(userId: string): number {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    return transactions.filter((t: any) => t.userId === userId && t.status === 'borrowed').length;
  }
}