// chat-routing.module.ts
import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { EmptyConversationComponent } from './components/empty-conversation/empty-conversation.component';
import { chatResolver } from './services/chat.resolver';

export const chatroutes: Routes = [
  { 
    path: '', 
    component: ChatComponent,
    children: [
      { 
        path: '', 
        component: ChatsComponent,
        children: [
          { path: '', component: EmptyConversationComponent, pathMatch: 'full' },
          { 
            path: ':id', 
            component: ConversationComponent,
            resolve: {
              conversation: chatResolver
            }
          }
        ]
      }
    ]
  }
];