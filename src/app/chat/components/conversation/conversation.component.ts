// components/conversation/conversation.component.ts
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../types/chat.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSidenavModule,
    MatDividerModule,
    TextFieldModule,
    RouterModule,
    DatePipe
    // Removed ContactInfoComponent since it's not used in template
  ]
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild('messageInput') messageInput: ElementRef;
  chat: Chat;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened = false;
  private _unsubscribeAll = new Subject<void>();

  constructor(
    private _chatService: ChatService
  ) {}

  @HostListener('input')
  @HostListener('ngModelChange')
  private _resizeMessageInput(): void {
    setTimeout(() => {
      this.messageInput.nativeElement.style.height = 'auto';
      this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
    });
  }

  ngOnInit(): void {
    this._chatService.chat$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(chat => {
        this.chat = chat;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  openContactInfo(): void {
    this.drawerOpened = true;
  }

  resetChat(): void {
    this._chatService.resetChat();
    this.drawerOpened = false;
  }

  toggleMuteNotifications(): void {
    this.chat.muted = !this.chat.muted;
    this._chatService.updateChat(this.chat.id, this.chat).subscribe();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}