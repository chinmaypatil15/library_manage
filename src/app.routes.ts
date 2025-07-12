import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/books',
    loadComponent: () => import('./components/admin/manage-books/manage-books.component').then(m => m.ManageBooksComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./components/admin/manage-users/manage-users.component').then(m => m.ManageUsersComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/transactions',
    loadComponent: () => import('./components/admin/transactions/transactions.component').then(m => m.TransactionsComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'user/books',
    loadComponent: () => import('./components/user/browse-books/browse-books.component').then(m => m.BrowseBooksComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'user/borrowed',
    loadComponent: () => import('./components/user/borrowed-books/borrowed-books.component').then(m => m.BorrowedBooksComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];