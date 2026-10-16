import { Component, effect, signal } from '@angular/core';

function stored(): string | null {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected readonly dark = signal(
    (stored() ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) ===
      'dark',
  );

  constructor() {
    effect(() => {
      const theme = this.dark() ? 'dark' : 'light';
      document.documentElement.dataset['theme'] = theme;
      try {
        localStorage.setItem('theme', theme);
      } catch {}
    });
  }
}
