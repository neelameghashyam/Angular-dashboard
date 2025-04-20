import { Routes } from '@angular/router';
import { ContentComponent } from './pages/content/content.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { Dashboard_Component } from './pages/dashboard/dashboard.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { chatroutes } from './chat/chat-routing.module';
export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: Dashboard_Component,
  },
  { 
    path: 'content', 
    component: ContentComponent,
  },
  { 
    path: 'form', 
    component: UserFormComponent,
  },
  { 
    path: 'analytics', 
    component: AnalyticsComponent,
  },
  { 
    path: 'comments', 
    component: ContentComponent,
  },
  // Add the chat routes
  { 
    path: 'chat', 
    children: chatroutes
  }
];