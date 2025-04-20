// components/empty-conversation/empty-conversation.component.ts
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-conversation',
  templateUrl: './empty-conversation.component.html',
  styleUrls: ['./empty-conversation.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule]
})
export class EmptyConversationComponent {}