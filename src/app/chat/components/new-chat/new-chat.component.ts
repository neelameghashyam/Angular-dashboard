// components/new-chat/new-chat.component.ts
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDrawer } from '@angular/material/sidenav';
import { ChatService } from '../../services/chat.service';
import { Contact } from '../../types/chat.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class NewChatComponent implements OnInit, OnDestroy {
  @Input() drawer: MatDrawer;
  contacts: Contact[] = [];
  private _unsubscribeAll = new Subject<void>();

  constructor(private _chatService: ChatService) {}

  ngOnInit(): void {
    this._chatService.contacts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(contacts => {
        this.contacts = contacts;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}