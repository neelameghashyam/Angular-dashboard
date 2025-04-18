// dark-mode.service.spec.ts
import { DarkModeService } from './dark-mode.service';
import { effect } from '@angular/core';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.matchMedia
const matchMediaMock = (matches: boolean) => {
  return jest.fn((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('DarkModeService', () => {
  let service: DarkModeService;
  let originalMatchMedia: typeof window.matchMedia;
  let bodyClassList: DOMTokenList;

  beforeEach(() => {
    // Reset localStorage
    (localStorage as any).clear();
    
    // Mock body classList
    bodyClassList = new Set() as unknown as DOMTokenList;
    bodyClassList.toggle = jest.fn();
    Object.defineProperty(document.body, 'classList', { value: bodyClassList });
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', { value: originalMatchMedia });
    }
  });

  describe('initialization', () => {
    it('should initialize with dark mode from localStorage if set to true', () => {
      localStorage.setItem('darkMode', 'true');
      service = new DarkModeService();
      expect(service.darkMode()).toBe(true);
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', true);
    });

    it('should initialize with light mode from localStorage if set to false', () => {
      localStorage.setItem('darkMode', 'false');
      service = new DarkModeService();
      expect(service.darkMode()).toBe(false);
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', false);
    });

    it('should initialize with system preference (dark) when no localStorage value', () => {
      originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', { value: matchMediaMock(true) });
      service = new DarkModeService();
      expect(service.darkMode()).toBe(true);
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', true);
    });

    it('should initialize with system preference (light) when no localStorage value', () => {
      originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', { value: matchMediaMock(false) });
      service = new DarkModeService();
      expect(service.darkMode()).toBe(false);
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', false);
    });
  });

  describe('system preference changes', () => {
    let mediaQueryListener: (e: { matches: boolean }) => void;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
      const mock = matchMediaMock(false);
      mock.mockImplementation(query => {
        const result = matchMediaMock(false)(query);
        result.addEventListener = jest.fn((_, listener) => {
          mediaQueryListener = listener;
        });
        return result;
      });
      Object.defineProperty(window, 'matchMedia', { value: mock });
    });

    it('should update dark mode when system preference changes and no localStorage value', () => {
      service = new DarkModeService();
      expect(service.darkMode()).toBe(false);
      
      // Simulate system preference change to dark
      mediaQueryListener({ matches: true });
      expect(service.darkMode()).toBe(true);
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', true);
    });

    it('should not update dark mode when system preference changes but localStorage value exists', () => {
      localStorage.setItem('darkMode', 'false');
      service = new DarkModeService();
      
      // Simulate system preference change to dark
      mediaQueryListener({ matches: true });
      expect(service.darkMode()).toBe(false);
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      service = new DarkModeService();
      jest.clearAllMocks();
    });

    it('should toggle dark mode from false to true', () => {
      service.darkMode.set(false);
      service.toggle();
      expect(service.darkMode()).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', true);
    });

    it('should toggle dark mode from true to false', () => {
      service.darkMode.set(true);
      service.toggle();
      expect(service.darkMode()).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', false);
    });
  });

  describe('effect', () => {
    it('should update body class when darkMode changes', () => {
      service = new DarkModeService();
      jest.clearAllMocks();
      
      // Directly change the signal value
      service.darkMode.set(true);
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', true);
      
      service.darkMode.set(false);
      expect(bodyClassList.toggle).toHaveBeenCalledWith('dark-mode', false);
    });
  });
});