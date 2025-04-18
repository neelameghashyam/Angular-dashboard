// custom-sidenav.component.ts
import { Component, computed, Input, signal, inject, HostListener } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {
  public responsiveService = inject(ResponsiveService);
  
  menuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'dashboard' },
    { icon: 'assignment', label: 'Form', route: 'form' },
    { icon: 'video_library', label: 'Content', route: 'content' },
    { icon: 'analytics', label: 'Analytics', route: 'analytics' },
    { icon: 'comment', label: 'Comments', route: 'comments' },
  ]);

  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  shouldShowLabel = computed(() => {
    return !this.sideNavCollapsed() || this.responsiveService.isMobile();
  });

  itemPadding = computed(() => {
    if (this.responsiveService.isMobile()) return '12px 16px';
    if (this.responsiveService.isTablet()) {
      return this.sideNavCollapsed() ? '12px 0' : '12px 16px';
    }
    return this.sideNavCollapsed() ? '16px 0' : '16px 24px';
  });

  iconSize = computed(() => {
    if (this.responsiveService.isMobile()) return '24px';
    return this.sideNavCollapsed() ? '28px' : '24px'; // Larger when collapsed
  });

  @HostListener('window:resize')
  onResize() {
    if (!this.responsiveService.isMobile() && this.sideNavCollapsed()) {
      this.sideNavCollapsed.set(false);
    }
  }

  constructor(public darkModeService: DarkModeService) {}
}