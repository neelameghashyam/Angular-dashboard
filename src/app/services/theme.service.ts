import { effect, Injectable, signal } from '@angular/core';

export interface Theme {
  id: string;
  primary: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themes: Theme[] = [
    {
      id: 'deep-blue-dark',
      primary: '#1976D2',
      displayName: 'Deep Blue Dark',
    },
    { id: 'green', primary: '#00796B', displayName: 'Green' },
    { id: 'orange', primary: '#E65100', displayName: 'Orange' },
    { id: 'purple', primary: '#6200EE', displayName: 'Purple' },
    { id: 'red', primary: '#C2185B', displayName: 'Red' },
  ];

  currentTheme = signal<Theme>(this.themes[0]);

  constructor() {
    // Initialize theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = this.themes.find(t => t.id === savedTheme);
      if (theme) this.currentTheme.set(theme);
    }

    // Set up theme effect
    this.updateThemeClass();
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find((t) => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
      localStorage.setItem('theme', themeId);
    }
  }

  private updateThemeClass() {
    effect(() => {
      const theme = this.currentTheme();
      // Remove all theme classes
      document.body.classList.remove(...this.themes.map((t) => `${t.id}-theme`));
      // Add current theme class
      document.body.classList.add(`${theme.id}-theme`);
    });
  }
}