import { Component, computed, Input, signal, inject } from '@angular/core';
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
  public darkModeService = inject(DarkModeService);
  
  menuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'dashboard' },
    { icon: 'assignment', label: 'Form', route: 'form' },
    { icon: 'chat', label: 'Chat', route: 'chat' },
    { icon: 'analytics', label: 'Analytics', route: 'analytics' },
    { icon: 'comment', label: 'Comments', route: 'comments' },
  ]);

  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
}