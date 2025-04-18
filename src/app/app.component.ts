import { Component } from '@angular/core';
import { TranslocoRootModule } from './transloco-root.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
    selector: 'app-root',
    standalone: true,  
    imports: [ TranslocoRootModule, DashboardComponent], 
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular Starter';
}