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
import { UserComponent } from "../../common/user/user.component";
import { ResponsiveService } from '../../services/responsive.service';
import { MatSidenav } from '@angular/material/sidenav';

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
    MatTooltipModule,
    UserComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  collapsed = signal(false);
  notificationCount = signal(""); 
  currentLanguage = signal('English');

  constructor(
    public darkModeService: DarkModeService,
    public responsiveService: ResponsiveService
  ) {}

  // Full screen toggle method
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Theme setting method
  setTheme(theme: 'light' | 'dark' | 'auto') {
    if (theme === 'auto') {
      localStorage.removeItem('darkMode');
      this.darkModeService.darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      const isDark = theme === 'dark';
      this.darkModeService.darkMode.set(isDark);
      localStorage.setItem('darkMode', String(isDark));
    }
  }

  // Language setting method
  setLanguage(lang: string) {
    this.currentLanguage.set(lang === 'en' ? 'English' : 'French');
  }

  // Sidenav responsive properties
  sidenavWidth = computed(() => {
    if (this.responsiveService.isMobile()) return '0px';
    if (this.responsiveService.isTablet()) {
      return this.collapsed() ? '70px' : '220px';
    }
    return this.collapsed() ? '80px' : '280px';
  });

  sidenavMode = computed(() => {
    return this.responsiveService.isMobile() ? 'over' : 'side';
  });

  sidenavOpened = computed(() => {
    return !this.responsiveService.isMobile() || this.collapsed();
  });

  toggleSidenav() {
    this.collapsed.set(!this.collapsed());
  }
}