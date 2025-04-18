// dashboard.component.ts
import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { DarkModeService } from '../../services/dark-theme/dark-mode.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatToolbarModule, 
    MatSidenavModule,
    CustomSidenavComponent,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  collapsed = signal(true);
  notificationCount = signal(""); 
  currentLanguage = signal('English');

  constructor(public darkModeService: DarkModeService) {}
  // Methods
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  setTheme(theme: string) {
    if (theme === 'auto') {
      localStorage.removeItem('darkMode');
      this.darkModeService.darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      const isDark = theme === 'dark';
      this.darkModeService.darkMode.set(isDark);
      localStorage.setItem('darkMode', String(isDark));
    }
  }

  setLanguage(lang: string) {
    this.currentLanguage.set(lang === 'en' ? 'English' : 'हिन्दी');
  }

  logout() {
    // Implement logout logic
  }

  sidenavWidth = computed(() => (this.collapsed() ? '64px' : '250px'));
}