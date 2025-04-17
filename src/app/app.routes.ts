import { Routes } from '@angular/router';
import { ContentComponent } from './pages/content/content.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { Dashboard_Component } from './pages/dashboard/dashboard.component';

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
        path: 'analytics', 
        component: AnalyticsComponent,
      },
      { 
        path: 'comments', 
        component: ContentComponent,
        
      },
    

];
