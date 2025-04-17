import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, CommonModule, MatButtonModule, MatIconModule, 
    MatToolbarModule, MatSidenavModule,MatIcon,CustomSidenavComponent,MatMenuModule,MatBadgeModule,MatTooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  collapsed = signal(false);
  currentTheme = 'light';

notificationCount = signal(""); 
currentLanguage = signal('English');

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
 
  
}

setLanguage(lang: string) {
  this.currentLanguage.set(lang === 'en' ? 'English' : 'हिन्दी');
}

logout() {
  
}

  sidenavWidth = computed(() => (this.collapsed() ? '64px' : '250px'));
}
