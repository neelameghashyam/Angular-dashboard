import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TranslocoRootModule } from './transloco-root.module';
import { TranslocoModule } from '@jsverse/transloco';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslocoRootModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toBe('Angular Starter');
  });

  it('should render the title in the template', () => {
    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent).toContain('Angular Starter');
  });

  it('should contain the dashboard component', () => {
    const dashboardElement = compiled.querySelector('app-dashboard');
    expect(dashboardElement).toBeTruthy();
  });
});