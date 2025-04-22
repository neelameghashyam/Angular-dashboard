import { Component, computed, inject, signal } from '@angular/core';
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
import { ThemeService } from 'src/app/services/theme.service';

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
  collapsed = signal(true);
  currentLanguage = signal('English');
  themeService = inject(ThemeService);
  constructor(
    public darkModeService: DarkModeService,
    public responsiveService: ResponsiveService
  ) {}

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

  setLanguage(lang: string) {
    this.currentLanguage.set(lang === 'en' ? 'English' : 'French');
  }

  sidenavWidth = computed(() => {
    if (this.responsiveService.isMobile()) return '280px';
    return this.collapsed() ? '64px' : '280px';
  });

  sidenavMode = computed(() => {
    return this.responsiveService.isMobile() ? 'over' : 'side';
  });

  sidenavOpened = computed(() => {
    return !this.responsiveService.isMobile() || !this.collapsed();
  });

  toggleSidenav() {
    this.collapsed.set(!this.collapsed());
  }
}