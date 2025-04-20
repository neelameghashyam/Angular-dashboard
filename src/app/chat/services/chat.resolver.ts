// services/chat.resolver.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ChatService } from './chat.service';
import { catchError, throwError } from 'rxjs';

export const chatResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const chatService = inject(ChatService);
  const router = inject(Router);

  return chatService.getChatById(route.paramMap.get('id')).pipe(
    catchError((error) => {
      console.error(error);
      const parentUrl = state.url.split('/').slice(0, -1).join('/');
      router.navigateByUrl(parentUrl);
      return throwError(() => error);
    })
  );
};