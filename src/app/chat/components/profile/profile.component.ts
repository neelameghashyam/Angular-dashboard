// components/profile/profile.component.ts
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDrawer } from '@angular/material/sidenav';
import { ChatService } from '../../services/chat.service';
import { Profile } from '../../types/chat.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Input() drawer: MatDrawer;
  profile: Profile;
  private _unsubscribeAll = new Subject<void>();

  constructor(private _chatService: ChatService) {}

  ngOnInit(): void {
    this._chatService.profile$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(profile => {
        this.profile = profile;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}