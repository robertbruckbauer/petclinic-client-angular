import { TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  function mockSystem(dark: boolean) {
    vi.stubGlobal('matchMedia', () => ({ matches: dark }));
  }

  async function render() {
    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  afterEach(() => vi.unstubAllGlobals());

  it('falls back to the system preference', async () => {
    mockSystem(true);
    await render();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('prefers the stored choice over the system preference', async () => {
    mockSystem(true);
    localStorage.setItem('theme', 'light');
    await render();
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('persists the choice on toggle', async () => {
    mockSystem(false);
    const input = await render();
    input.click();
    TestBed.tick();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
