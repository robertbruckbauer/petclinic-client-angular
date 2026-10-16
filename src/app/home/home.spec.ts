import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  async function render(respond: (req: ReturnType<HttpTestingController['expectOne']>) => void) {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await Promise.resolve();
    respond(http.expectOne('VERSION'));
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('.badge')?.textContent;
  }

  it('shows the content of VERSION', async () => {
    expect(await render((r) => r.flush('1.2.3\n'))).toContain('1.2.3');
  });

  it('shows a placeholder when VERSION is not available', async () => {
    expect(await render((r) => r.flush('', { status: 404, statusText: 'Not Found' }))).toContain(
      '—',
    );
  });
});
