# Skaffold plan

Skaffold the Angular client in the repository root so that it fulfils the capabilities in `openspec/specs/`:
`client-platform`, `client-language`, `client-container`, `client-ui-home`.

Guiding rule (see `AGENTS.md`): write the least code possible.
Use Angular CLI generators and defaults, and add no dependency that a spec does not demand.

## Decisions

| Topic | Decision | Reason |
|---|---|---|
| Project location | Repository root, project name `petclinic-client-angular` | `Dockerfile`, `VERSION` and `angular.json` live side by side, the `VERSION` asset needs no `..` path |
| Zoneless | Angular 22 default, no `zone.js`, no `provideZonelessChangeDetection()` unless the generated config lacks it | spec allows the default equivalent |
| Test runner | `@angular/build:unit-test` with `runner: vitest` | `client-platform` |
| Styling | `tailwindcss` + `@tailwindcss/postcss` (Angular supports it natively) + `daisyui`, nothing else | `client-platform` |
| PWA | `ng add @angular/pwa` | generates manifest, icons, `ngsw-config.json`, registers the service worker |
| Version display | Publish `VERSION` as a static asset and load it at runtime with `httpResource`/`fetch`; show `—` on failure | one source of truth, satisfies "version not available" and "version in the container" |
| Theme persistence | `localStorage` key `theme`, applied through `data-theme` on `<html>` | native platform feature |
| Container | Two-stage `Dockerfile`, `nginx:alpine` runtime, `nginx.conf` with SPA fallback | `client-container` |

## Steps

### 1. Generate the workspace

1. Run `npx @angular/cli@22 new petclinic-client-angular --directory . --style tailwind --routing --ssr=false --zoneless --test-runner vitest --skip-git --package-manager npm --ai-config none --defaults --interactive=false`.
   All flags were checked against `ng new --help` of `@angular/cli@22`.
   `--style tailwind` already installs and wires `tailwindcss` (step 3 then only adds `daisyui`).
   Keep the existing `README.adoc`, `AGENTS.md`, `VERSION`, `.github`, `.agents`, `openspec`, `obsidian`, `pages` and `plans`.
   If the CLI refuses a non-empty directory, generate into the scratchpad and copy the files over.
2. Verify that `package.json` declares every `@angular/*` package, `@angular/cli`, `@angular/build` and `@angular/compiler-cli` in the `22.x` range and does not declare `zone.js`.
3. Verify `angular.json` uses `@angular/build:application`, `@angular/build:dev-server` and `@angular/build:unit-test` with `"runner": "vitest"`, and that `polyfills` contains no `zone.js`.
4. Pin `typescript` to the newest release inside the peer range of `@angular/compiler-cli@22`
   (`npm view @angular/compiler-cli@22 peerDependencies.typescript`, then `npm install -D typescript@<latest in range>`).
5. Verify `tsconfig.json` has `strict: true` and `angularCompilerOptions.strictTemplates: true`.
6. Confirm `src/main.ts` calls `bootstrapApplication(App, appConfig)` and that no `@NgModule` exists.

### 2. Prettier (`client-language`)

1. `npm install -D prettier`.
2. Add `.prettierrc` (single config in root, e.g. `{ "singleQuote": true, "printWidth": 100 }`).
3. Add `.prettierignore` with `node_modules`, `dist`, `.angular`.
4. Add scripts to `package.json`:
   - `"lint": "prettier --check ."`
   - `"format": "prettier --write ."`
5. Run `npm run format` once, then `npm run lint` must pass.
   Check that Prettier's scope (Markdown, JSON, `.adoc` is not parsed) does not touch `openspec/` and `obsidian/` in an unwanted way.
   If it would, narrow the scripts or extend `.prettierignore` rather than reformatting the knowledge graph.

### 3. Styling (`client-platform`)

1. `npm install daisyui`.
   `tailwindcss`, `@tailwindcss/postcss`, `postcss` and `.postcssrc.json` come from `--style tailwind` in step 1; verify they are present and add them only if not.
2. Verify `src/styles.css` starts with `@import 'tailwindcss';`.
3. Add the daisyUI plugin so that `src/styles.css` contains:

   ```css
   @import 'tailwindcss';
   @plugin 'daisyui' {
     themes: light --default, dark --prefersdark;
   }
   ```

   `--prefersdark` makes the initial theme follow `prefers-color-scheme`.
4. Do not add Bootstrap, Angular Material or hand-written CSS.

### 4. Routing and SPA shell (`client-platform`)

1. `src/app/app.routes.ts`:
   - `''` → `loadComponent: () => import('./home/home').then(m => m.Home)`
   - `'**'` → `redirectTo: ''`
2. `src/app/app.config.ts` provides `provideRouter(routes)`, `provideBrowserGlobalErrorListeners()` and `provideServiceWorker` (step 6).
3. `src/app/app.html`: daisyUI `navbar` with a router link to home and the theme toggle, plus `<router-outlet />`.
4. Only one `index.html` and one root component.

### 5. Home page and version (`client-ui-home`)

1. `ng generate component home` (standalone, signals-based).
2. Add the asset in `angular.json` build options:
   `{ "glob": "VERSION", "input": ".", "output": "." }`.
   This copies the repository-root `VERSION` to `/VERSION` on every build, so the version is edited in exactly one place.
3. `Home` loads `/VERSION` with `httpResource.text('VERSION')`
   (add `provideHttpClient()` only if `httpResource` needs it) and renders `value()?.trim() ?? '—'`.
   Render the page even when the request fails.
4. Use daisyUI classes only (`hero`, `badge`, ...) and theme color tokens, no hard-coded colors.

### 6. PWA (`client-platform`)

1. `ng add @angular/pwa --skip-confirmation`.
2. Verify:
   - `public/manifest.webmanifest` has `name`, `icons`, `display` and `start_url`.
   - `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000' })`.
   - `ngsw-config.json` is referenced by the production configuration only.
3. Add `VERSION` to the `ngsw-config.json` asset group `app` if it shall be available offline; otherwise leave it as a network resource.

### 7. Theme switcher (`client-platform`)

1. A small `ThemeToggle` standalone component using the daisyUI `swap`/`toggle` control in the navbar.
2. State is a signal initialised from `localStorage.getItem('theme')`, falling back to `matchMedia('(prefers-color-scheme: dark)')`.
3. An `effect` sets `document.documentElement.dataset.theme` and writes `localStorage`.
4. Stored choice takes precedence over system preference.
   Wrap storage access in `try/catch` so a blocked storage does not break rendering.
5. To avoid a flash of the wrong theme, no inline script is added unless the flash is observed during verification (YAGNI).

### 8. Container (`client-container`)

1. `Dockerfile`:

   ```dockerfile
   FROM node:24-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine AS runtime
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   COPY --from=build /app/dist/petclinic-client-angular/browser /usr/share/nginx/html
   EXPOSE 80
   ```

   Because the whole context is copied, `VERSION` is baked in at image build time.
2. `nginx.conf`:
   - `root /usr/share/nginx/html;`
   - `location / { try_files $uri $uri/ /index.html; }`
   - `location = /ngsw.json` and `location = /ngsw-worker.js` with `add_header Cache-Control "no-cache, no-store, must-revalidate";`
   - `location = /healthz { access_log off; default_type text/plain; return 200 ''; }` (no proxying, no backend dependency).
3. `.dockerignore`: `node_modules`, `dist`, `.angular`, `.git`, `plans`, `obsidian`, `openspec`, `pages`.

### 9. Unit tests

1. Keep the generated `App` spec working and add:
   - `home.spec.ts`: shows the content of `VERSION` when the request succeeds, shows the placeholder when it fails.
   - `theme-toggle.spec.ts`: stored choice wins, toggle persists the choice, system preference is the fallback.
2. `npm test -- --watch=false` runs on Vitest and fails on any failing test.

### 10. CI (`.github/workflows/build.yml`)

Extend the existing `build` job after checkout with: `actions/setup-node` (Node 24, npm cache), `npm ci`, `npm run lint`, `npm test -- --watch=false`, `npm run build`, and `docker build .`.
Image publishing is out of scope for this plan.

### 11. Build management help

Document `npm start`, `npm run lint`, `npm run format`, `npm test`, `npm run build` and `docker build`/`docker run -p 8080:80` in `README.adoc`
(one sentence per line, per the asciidoc checklist in `AGENTS.md`).

## Verification matrix

| Spec scenario | Check |
|---|---|
| Build with Angular 22, mixed majors rejected | `npm run build`, `npm ls @angular/core @angular/build @angular/cli @angular/compiler-cli` |
| No zone.js, Vite builders, Vitest | `grep zone.js package.json angular.json` returns nothing, inspect `angular.json` |
| No `NgModule`, `bootstrapApplication` | `grep -r "@NgModule" src` returns nothing |
| Single `index.html`, `manifest.webmanifest`, `ngsw.json` | list `dist/petclinic-client-angular/browser` |
| Service worker only in production | serve `dist` and the dev server, inspect Application tab |
| Deep link and unknown route | `docker run`, `curl -i localhost:8080/foo` returns `index.html`, router redirects to home |
| tailwind/daisyUI declared and enabled | inspect `package.json` and `src/styles.css` |
| Theme: system preference, toggle, stored choice | manual check in a browser plus the unit tests |
| Strict TypeScript, type errors fail the build | inspect `tsconfig.json`, introduce a deliberate type error once |
| Prettier lint and format | `npm run lint`, break a file, `npm run format`, `npm run lint` |
| Container image is nginx only | `docker run --rm <img> sh -c "which node; ls /app"` finds nothing |
| Cache headers on `ngsw.json` | `curl -I localhost:8080/ngsw.json` |
| `/healthz` | `curl -i localhost:8080/healthz` returns `200` with an empty body |
| Version shown, follows `VERSION`, in container | edit `VERSION`, rebuild, reload; check in container |
| Version unavailable | unit test with a failing request |

## Follow-ups after implementation

Per `AGENTS.md`, finish with the `obsidian-maintainer` skill to update the knowledge graph, then the `consistency-checker` skill.
Code and tests win over `openspec`, and `openspec` wins over `obsidian` when they disagree.
