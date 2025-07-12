import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { UserProfile } from '../../models/user.model';
import { Book, BorrowTransaction } from '../../models/book.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome, {{ currentUser?.firstName }}!</h1>
        <p class="role-badge" [class]="'role-' + currentUser?.role">{{ currentUser?.role }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" *ngIf="currentUser?.role === 'admin'">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ totalBooks }}</h3>
            <p>Total Books</p>
          </div>
        </div>

        <div class="stat-card" *ngIf="currentUser?.role === 'admin'">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ totalUsers }}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div class="stat-card" *ngIf="currentUser?.role === 'admin'">
          <div class="stat-icon">📖</div>
          <div class="stat-content">
            <h3>{{ activeBorrows }}</h3>
            <p>Active Borrows</p>
          </div>
        </div>

        <div class="stat-card" *ngIf="currentUser?.role === 'user'">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ availableBooks }}</h3>
            <p>Available Books</p>
          </div>
        </div>

        <div class="stat-card" *ngIf="currentUser?.role === 'user'">
          <div class="stat-icon">📖</div>
          <div class="stat-content">
            <h3>{{ userBorrowedBooks }}</h3>
            <p>Your Borrowed Books</p>
          </div>
        </div>

        <div class="stat-card" *ngIf="currentUser?.role === 'user'">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>{{ (currentUser?.borrowLimit || 0) - userBorrowedBooks }}</h3>
            <p>Remaining Limit</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <ng-container *ngIf="currentUser?.role === 'admin'">
            <button routerLink="/admin/books" class="action-btn primary">
              <span class="btn-icon">➕</span>
              Add New Book
            </button>
            <button routerLink="/admin/users" class="action-btn secondary">
              <span class="btn-icon">👥</span>
              Manage Users
            </button>
            <button routerLink="/admin/transactions" class="action-btn accent">
              <span class="btn-icon">📊</span>
              View Transactions
            </button>
          </ng-container>

          <ng-container *ngIf="currentUser?.role === 'user'">
            <button routerLink="/user/books" class="action-btn primary">
              <span class="btn-icon">🔍</span>
              Browse Books
            </button>
            <button routerLink="/user/borrowed" class="action-btn secondary">
              <span class="btn-icon">📖</span>
              My Borrowed Books
            </button>
            <button routerLink="/profile" class="action-btn accent">
              <span class="btn-icon">👤</span>
              Edit Profile
            </button>
          </ng-container>
        </div>
      </div>

      <div *ngIf="recentActivity.length > 0" class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div *ngFor="let activity of recentActivity" class="activity-item">
            <div class="activity-icon" [class]="'status-' + activity.status">
              {{ activity.status === 'borrowed' ? '📚' : '✅' }}
            </div>
            <div class="activity-content">
              <h4>{{ activity.bookTitle }}</h4>
              <p *ngIf="currentUser?.role === 'admin'">{{ activity.userName }} ({{ activity.userEmail }})</p>
              <small>{{ activity.borrowDate | date:'medium' }}</small>
            </div>
            <div class="activity-status" [class]="'status-' + activity.status">
              {{ activity.status | titlecase }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .dashboard-header h1 {
      color: #1f2937;
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .role-badge {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2rem;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 0.75rem;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-content p {
      margin: 0;
      color: #6b7280;
      font-weight: 500;
    }

    .quick-actions {
      margin-bottom: 3rem;
    }

    .quick-actions h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: white;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
    }

    .action-btn.secondary {
      background: linear-gradient(135deg, #059669, #047857);
    }

    .action-btn.accent {
      background: linear-gradient(135deg, #ea580c, #dc2626);
    }

    .btn-icon {
      font-size: 1.25rem;
    }

    .recent-activity h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .activity-list {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      font-size: 1.5rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
    }

    .activity-icon.status-borrowed {
      background: #dbeafe;
    }

    .activity-icon.status-returned {
      background: #d1fae5;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content h4 {
      margin: 0 0 0.25rem 0;
      color: #1f2937;
      font-weight: 600;
    }

    .activity-content p {
      margin: 0 0 0.25rem 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .activity-content small {
      color: #9ca3af;
      font-size: 0.75rem;
    }

    .activity-status {
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .activity-status.status-borrowed {
      background: #dbeafe;
      color: #1e40af;
    }

    .activity-status.status-returned {
      background: #d1fae5;
      color: #047857;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;
  totalBooks = 0;
  totalUsers = 0;
  activeBorrows = 0;
  availableBooks = 0;
  userBorrowedBooks = 0;
  recentActivity: BorrowTransaction[] = [];

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load books data
    this.bookService.getBooks().subscribe(books => {
      this.totalBooks = books.length;
      this.availableBooks = books.filter(book => book.availableCopies > 0).length;
    });

    // Load user data for admin
    if (this.currentUser?.role === 'admin') {
      this.totalUsers = this.authService.getAllUsers().length;
    }

    // Load transactions
    this.bookService.getAllTransactions().subscribe(transactions => {
      this.activeBorrows = transactions.filter(t => t.status === 'borrowed').length;
      
      if (this.currentUser?.role === 'user') {
        this.userBorrowedBooks = transactions.filter(
          t => t.userId === this.currentUser?.id && t.status === 'borrowed'
        ).length;
        
        // Recent activity for user
        this.recentActivity = transactions
          .filter(t => t.userId === this.currentUser?.id)
          .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
          .slice(0, 5);
      } else {
        // Recent activity for admin
        this.recentActivity = transactions
          .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
          .slice(0, 10);
      }
    });
  }
}