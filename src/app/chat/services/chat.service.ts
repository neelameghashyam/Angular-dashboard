// services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Chat, Contact, Profile } from '../types/chat.types';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _chat = new BehaviorSubject<Chat>(null);
  private _chats = new BehaviorSubject<Chat[]>(null);
  private _contacts = new BehaviorSubject<Contact[]>(null);
  private _profile = new BehaviorSubject<Profile>(null);

  constructor(private _httpClient: HttpClient) {}

  // Getters
  get chat$(): Observable<Chat> { return this._chat.asObservable(); }
  get chats$(): Observable<Chat[]> { return this._chats.asObservable(); }
  get contacts$(): Observable<Contact[]> { return this._contacts.asObservable(); }
  get profile$(): Observable<Profile> { return this._profile.asObservable(); }

  // Methods
  getChats(): Observable<Chat[]> {
    return this._httpClient.get<Chat[]>('api/apps/chat/chats').pipe(
      tap((response) => this._chats.next(response))
    );
  }

  getContacts(): Observable<Contact[]> {
    return this._httpClient.get<Contact[]>('api/apps/chat/contacts').pipe(
      tap((response) => this._contacts.next(response))
    );
  }

  getProfile(): Observable<Profile> {
    return this._httpClient.get<Profile>('api/apps/chat/profile').pipe(
      tap((response) => this._profile.next(response))
    );
  }

  getChatById(id: string): Observable<Chat> {
    return this._httpClient.get<Chat>('api/apps/chat/chat', { params: { id } }).pipe(
      map((chat) => {
        this._chat.next(chat);
        return chat;
      }),
      switchMap((chat) => {
        if (!chat) {
          return throwError(() => new Error('Could not find chat with id of ' + id + '!'));
        }
        return of(chat);
      })
    );
  }

  updateChat(id: string, chat: Chat): Observable<Chat> {
    return this.chats$.pipe(
      take(1),
      switchMap(chats => this._httpClient.patch<Chat>('api/apps/chat/chat', { id, chat }).pipe(
        map((updatedChat) => {
          const index = chats.findIndex(item => item.id === id);
          chats[index] = updatedChat;
          this._chats.next(chats);
          return updatedChat;
        }),
        switchMap(updatedChat => this.chat$.pipe(
          take(1),
          filter(item => item && item.id === id),
          tap(() => this._chat.next(updatedChat))
        ))
      ))
    );
  }

  resetChat(): void {
    this._chat.next(null);
  }
}