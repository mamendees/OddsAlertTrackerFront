import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
   imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  showHeader = false;
  darkMode = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Load dark mode preference
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.applyDarkMode();

    // Watch route changes to show/hide header
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showHeader = this.authService.isLoggedIn() && 
                       this.router.url !== '/login';
    });

    // Check initial login state
    this.showHeader = this.authService.isLoggedIn() && 
                     this.router.url !== '/login';
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.applyDarkMode();
  }

  applyDarkMode() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  logout() {
    this.authService.logout();
  }
}