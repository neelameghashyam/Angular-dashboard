import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge'; // Make sure this is imported
import { RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Chat, Profile } from '../../types/chat.types';
import { Subject, takeUntil } from 'rxjs';
import { NewChatComponent } from '../new-chat/new-chat.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule, 
    RouterModule,
    NewChatComponent,
    ProfileComponent
    
  ]
})
export class ChatsComponent implements OnInit, OnDestroy {
  chats: Chat[];
  filteredChats: Chat[];
  profile: Profile;
  selectedChat: Chat;
  drawerOpened = false;
  drawerComponent: 'profile' | 'new-chat' = 'profile';
  
  private _unsubscribeAll = new Subject<void>();

  constructor(private _chatService: ChatService) {}

  ngOnInit(): void {
    this._chatService.chats$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(chats => {
        this.chats = this.filteredChats = chats;
      });

    this._chatService.profile$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(profile => {
        this.profile = profile;
      });

    this._chatService.chat$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(chat => {
        this.selectedChat = chat;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._chatService.resetChat();
  }

  filterChats(query: string): void {
    if (!query) {
      this.filteredChats = this.chats;
      return;
    }
    this.filteredChats = this.chats.filter(chat => 
      chat.contact.name.toLowerCase().includes(query.toLowerCase()));
  }

  openDrawer(component: 'profile' | 'new-chat'): void {
    this.drawerComponent = component;
    this.drawerOpened = true;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}