import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, NgClass],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'] // Make sure this is correctly linked
})
export class UserComponent {
  showAvatar = true;
  user = {
    avatar: '../../assets/image.png',
    email: 'user@example.com',
    status: 'online' // Default status
  };

  updateUserStatus(status: 'online' | 'away' | 'busy' | 'not-visible'): void {
    this.user.status = status;
  }

  signOut(): void {
    console.log('Sign out clicked');
  }
}