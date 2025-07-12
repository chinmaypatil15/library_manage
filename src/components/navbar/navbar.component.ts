import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>📚 LibraryApp</h2>
        </div>
        
        <div class="nav-links" *ngIf="currentUser">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          
          <div *ngIf="currentUser.role === 'admin'" class="admin-links">
            <a routerLink="/admin/books" routerLinkActive="active">Manage Books</a>
            <a routerLink="/admin/users" routerLinkActive="active">Manage Users</a>
            <a routerLink="/admin/transactions" routerLinkActive="active">Transactions</a>
          </div>
          
          <div *ngIf="currentUser.role === 'user'" class="user-links">
            <a routerLink="/user/books" routerLinkActive="active">Browse Books</a>
            <a routerLink="/user/borrowed" routerLinkActive="active">My Books</a>
          </div>
          
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
        </div>
        
        <div class="nav-actions">
          <div *ngIf="currentUser" class="user-info">
            <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <span class="user-role" [class]="'role-' + currentUser.role">{{ currentUser.role }}</span>
            <button class="btn btn-outline" (click)="logout()">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 0 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }

    .nav-brand h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .admin-links,
    .user-links {
      display: flex;
      gap: 1.5rem;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-links a:hover,
    .nav-links a.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      font-weight: 600;
    }

    .user-role {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-admin {
      background: #f59e0b;
      color: white;
    }

    .role-user {
      background: #059669;
      color: white;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-outline {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }

      .admin-links,
      .user-links {
        gap: 0.5rem;
      }
    }
  `]
})
export class NavbarComponent {
  currentUser: UserProfile | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}