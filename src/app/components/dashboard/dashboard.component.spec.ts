import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DarkModeService } from '../../services/dark-theme/dark-mode.service';
import { ResponsiveService } from '../../services/responsive.service';
import { UserComponent } from "../../common/user/user.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let darkModeService: DarkModeService;
  let responsiveService: ResponsiveService;

  beforeEach(async () => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        UserComponent,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatMenuModule,
        MatTooltipModule,
        MatBadgeModule,
        NoopAnimationsModule
      ],
      providers: [
        DarkModeService,
        ResponsiveService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    darkModeService = TestBed.inject(DarkModeService);
    responsiveService = TestBed.inject(ResponsiveService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with collapsed false', () => {
      expect(component.collapsed()).toBe(false);
    });

    it('should initialize with English as default language', () => {
      expect(component.currentLanguage()).toBe('English');
    });
  });

  describe('toggleFullScreen', () => {
    beforeEach(() => {
      jest.spyOn(document.documentElement, 'requestFullscreen').mockImplementation(() => Promise.resolve());
      jest.spyOn(document, 'exitFullscreen').mockImplementation(() => Promise.resolve());
    });

    it('should enter fullscreen when not in fullscreen', () => {
      Object.defineProperty(document, 'fullscreenElement', { value: null, writable: true });
      component.toggleFullScreen();
      expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    });

    it('should exit fullscreen when in fullscreen', () => {
      Object.defineProperty(document, 'fullscreenElement', { value: true, writable: true });
      component.toggleFullScreen();
      expect(document.exitFullscreen).toHaveBeenCalled();
    });

    it('should handle fullscreen error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      Object.defineProperty(document, 'fullscreenElement', { value: null, writable: true });
      jest.spyOn(document.documentElement, 'requestFullscreen').mockImplementation(() => Promise.reject(new Error('Fullscreen error')));
      component.toggleFullScreen();
      expect(consoleSpy).toHaveBeenCalledWith('Error attempting to enable fullscreen: Fullscreen error');
    });

    it('should not exit fullscreen if exitFullscreen is not available', () => {
      Object.defineProperty(document, 'fullscreenElement', { value: true, writable: true });
      Object.defineProperty(document, 'exitFullscreen', { value: undefined, writable: true });
      component.toggleFullScreen();
      expect(document.exitFullscreen).toBeUndefined();
    });

    it('should handle when requestFullscreen is not available', () => {
      Object.defineProperty(document.documentElement, 'requestFullscreen', { value: undefined, writable: true });
      Object.defineProperty(document, 'fullscreenElement', { value: null, writable: true });
      expect(() => component.toggleFullScreen()).not.toThrow();
    });
  });

  describe('setTheme', () => {
    beforeEach(() => {
      jest.spyOn(localStorage, 'setItem');
      jest.spyOn(localStorage, 'removeItem');
    });

    it('should set light theme', () => {
      component.setTheme('light');
      expect(darkModeService.darkMode()).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
    });

    it('should set dark theme', () => {
      component.setTheme('dark');
      expect(darkModeService.darkMode()).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });

    it('should set auto theme with dark mode preferred', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: jest.fn()
      }));
      component.setTheme('auto');
      expect(localStorage.removeItem).toHaveBeenCalledWith('darkMode');
      expect(darkModeService.darkMode()).toBe(true);
    });

    it('should set auto theme with light mode preferred', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        addEventListener: jest.fn()
      }));
      component.setTheme('auto');
      expect(localStorage.removeItem).toHaveBeenCalledWith('darkMode');
      expect(darkModeService.darkMode()).toBe(false);
    });

    it('should handle theme change event listener', () => {
      const addEventListenerMock = jest.fn();
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: addEventListenerMock
      }));
      
      component.setTheme('auto');
      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should handle theme change from dark to light', () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: jest.fn((event, callback) => {
          if (event === 'change') {
            callback({ matches: false });
          }
        })
      };
      window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);
      
      component.setTheme('auto');
      expect(darkModeService.darkMode()).toBe(true);
      
      mockMediaQuery.addEventListener.mock.calls[0][1]({ matches: false });
      expect(darkModeService.darkMode()).toBe(false);
    });

    it('should handle null matches in theme change', () => {
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: null,
        addEventListener: jest.fn()
      }));
      
      component.setTheme('auto');
      expect(darkModeService.darkMode()).toBe(false);
    });
  });

  describe('setLanguage', () => {
    it('should set language to English', () => {
      component.setLanguage('en');
      expect(component.currentLanguage()).toBe('English');
    });

    it('should set language to French', () => {
      component.setLanguage('fr');
      expect(component.currentLanguage()).toBe('French');
    });

    it('should handle unknown language codes', () => {
      component.setLanguage('es');
      expect(component.currentLanguage()).toBe('English');
    });

    it('should handle empty language code', () => {
      component.setLanguage('');
      expect(component.currentLanguage()).toBe('English');
    });

    it('should handle null language code', () => {
      component.setLanguage(null as any);
      expect(component.currentLanguage()).toBe('English');
    });
  });

  describe('sidenavWidth', () => {
    it('should return 280px when mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      expect(component.sidenavWidth()).toBe('280px');
    });

    it('should return 80px when collapsed and not mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      component.collapsed.set(true);
      expect(component.sidenavWidth()).toBe('80px');
    });

    it('should return 280px when not collapsed and not mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      component.collapsed.set(false);
      expect(component.sidenavWidth()).toBe('280px');
    });

    it('should handle undefined responsiveService', () => {
      (component as any).responsiveService = undefined;
      expect(component.sidenavWidth()).toBe('280px');
    });
  });

  describe('sidenavMode', () => {
    it('should return "over" when mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      expect(component.sidenavMode()).toBe('over');
    });

    it('should return "side" when not mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      expect(component.sidenavMode()).toBe('side');
    });

    it('should handle undefined responsiveService', () => {
      (component as any).responsiveService = undefined;
      expect(component.sidenavMode()).toBe('side');
    });
  });

  describe('sidenavOpened', () => {
    it('should return true when not mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      expect(component.sidenavOpened()).toBe(true);
    });

    it('should return true when mobile and not collapsed', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      component.collapsed.set(false);
      expect(component.sidenavOpened()).toBe(true);
    });

    it('should return false when mobile and collapsed', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      component.collapsed.set(true);
      expect(component.sidenavOpened()).toBe(false);
    });

    it('should handle undefined responsiveService', () => {
      (component as any).responsiveService = undefined;
      expect(component.sidenavOpened()).toBe(true);
    });
  });

  describe('toggleSidenav', () => {
    it('should toggle collapsed state', () => {
      const initialValue = component.collapsed();
      component.toggleSidenav();
      expect(component.collapsed()).toBe(!initialValue);
      component.toggleSidenav();
      expect(component.collapsed()).toBe(initialValue);
    });

    it('should handle undefined collapsed signal', () => {
      (component as any).collapsed = undefined;
      expect(() => component.toggleSidenav()).not.toThrow();
    });
  });

  describe('Template', () => {
    it('should render toolbar with title', () => {
      const title = fixture.debugElement.query(By.css('span.ml-2'));
      expect(title.nativeElement.textContent).toContain('Angular');
    });

    it('should render menu button', () => {
      const button = fixture.debugElement.query(By.css('button[aria-label="Menu"]'));
      expect(button).toBeTruthy();
    });

    it('should render fullscreen button', () => {
      const button = fixture.debugElement.query(By.css('button[aria-label="Fullscreen toggle"]'));
      expect(button).toBeTruthy();
    });

    it('should render theme selector', () => {
      const button = fixture.debugElement.query(By.css('button[aria-label="Theme selector"]'));
      expect(button).toBeTruthy();
    });

    it('should render language selector', () => {
      const button = fixture.debugElement.query(By.css('button[aria-label="Language selector"]'));
      expect(button).toBeTruthy();
    });

    it('should render user component', () => {
      const userComponent = fixture.debugElement.query(By.directive(UserComponent));
      expect(userComponent).toBeTruthy();
    });

    it('should apply dark mode class when dark mode is enabled', () => {
      darkModeService.darkMode.set(true);
      fixture.detectChanges();
      const container = fixture.debugElement.query(By.css('.dashboard-container.dark-mode'));
      expect(container).toBeTruthy();
    });

    it('should not apply dark mode class when dark mode is disabled', () => {
      darkModeService.darkMode.set(false);
      fixture.detectChanges();
      const container = fixture.debugElement.query(By.css('.dashboard-container.dark-mode'));
      expect(container).toBeNull();
    });

    it('should close sidenav on content click when mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      const sidenavCloseSpy = jest.spyOn(component, 'toggleSidenav');
      
      const sidenavContent = fixture.debugElement.query(By.css('mat-sidenav-content'));
      sidenavContent.triggerEventHandler('click', null);
      
      expect(sidenavCloseSpy).toHaveBeenCalled();
    });

    it('should not close sidenav on content click when not mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      const sidenavCloseSpy = jest.spyOn(component, 'toggleSidenav');
      
      const sidenavContent = fixture.debugElement.query(By.css('mat-sidenav-content'));
      sidenavContent.triggerEventHandler('click', null);
      
      expect(sidenavCloseSpy).not.toHaveBeenCalled();
    });
  });

  describe('Responsive Behavior', () => {
    it('should update layout when window is resized', () => {
      const mockEvent = new Event('resize');
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      
      window.dispatchEvent(mockEvent);
      fixture.detectChanges();
      
      expect(component.sidenavMode()).toBe('over');
      expect(component.sidenavWidth()).toBe('280px');
    });

    it('should update computed properties when responsive service changes', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      expect(component.sidenavMode()).toBe('over');
      expect(component.sidenavWidth()).toBe('280px');
      
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      expect(component.sidenavMode()).toBe('side');
      expect(component.sidenavWidth()).toBe('280px');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null fullscreenElement', () => {
      Object.defineProperty(document, 'fullscreenElement', { value: null, writable: true });
      const requestSpy = jest.spyOn(document.documentElement, 'requestFullscreen');
      component.toggleFullScreen();
      expect(requestSpy).toHaveBeenCalled();
    });

    it('should handle undefined fullscreen APIs', () => {
      Object.defineProperty(document, 'fullscreenElement', { value: undefined, writable: true });
      Object.defineProperty(document.documentElement, 'requestFullscreen', { value: undefined, writable: true });
      Object.defineProperty(document, 'exitFullscreen', { value: undefined, writable: true });
      
      expect(() => component.toggleFullScreen()).not.toThrow();
    });

    it('should handle theme change with null event', () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: jest.fn((event, callback) => {
          if (event === 'change') {
            callback(null);
          }
        })
      };
      window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);
      
      expect(() => component.setTheme('auto')).not.toThrow();
    });

    it('should handle undefined darkModeService', () => {
      (component as any).darkModeService = undefined;
      expect(() => component.setTheme('light')).not.toThrow();
    });

    it('should handle undefined responsiveService in computed properties', () => {
      (component as any).responsiveService = undefined;
      expect(component.sidenavMode()).toBe('side');
      expect(component.sidenavWidth()).toBe('280px');
      expect(component.sidenavOpened()).toBe(true);
    });
  });
});