import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { routes } from './app.routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="showNavbar"></app-navbar>
      <main class="main-content" [class.with-navbar]="showNavbar">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f8fafc;
    }

    .main-content {
      min-height: 100vh;
      transition: all 0.3s ease;
    }

    .main-content.with-navbar {
      padding-top: 0;
      min-height: calc(100vh - 80px);
    }

    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class App {
  showNavbar = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.url);
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.updateNavbarVisibility(this.router.url);
    });
  }

  private updateNavbarVisibility(url: string): void {
    const authPages = ['/login', '/register'];
    const isAuthPage = authPages.some(page => url.includes(page));
    const isLoggedIn = this.authService.isLoggedIn();
    
    this.showNavbar = !isAuthPage && isLoggedIn;
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});