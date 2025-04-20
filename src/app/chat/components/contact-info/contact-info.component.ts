// components/contact-info/contact-info.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from '../../types/chat.types';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule
  ]
})
export class ContactInfoComponent {
  @Input() chat: Chat;
  @Input() drawer: MatDrawer;
}