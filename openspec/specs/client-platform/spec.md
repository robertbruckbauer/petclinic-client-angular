# client-platform Specification

## Purpose

Defines the platform and framework baseline of a zoneless, standalone Angular single page application.

## Requirements

### Requirement: Angular 22 framework baseline

The client application SHALL be built on Angular major version 22.
All `@angular/*` runtime packages and the Angular CLI tooling (`@angular/cli`, `@angular/build`, `@angular/compiler-cli`) SHALL resolve to the same major version 22.
The client application SHALL use Vite for build management.
The client application SHALL use Vitest for unit testing.

#### Scenario: Application builds with Angular 22

- **WHEN** the production build of the client is executed
- **THEN** the build completes successfully using the Angular 22 toolchain

#### Scenario: Angular packages declare version 22

- **WHEN** the dependencies of the client are inspected
- **THEN** every `@angular/*` package is declared with a version in the 22.x range

#### Scenario: Mixed Angular major versions are rejected

- **WHEN** an `@angular/*` package resolves to a major version other than 22
- **THEN** the dependency set is considered non-conformant and MUST be aligned to 22

### Requirement: Zoneless change detection

The client application SHALL run without Zone.js.
It SHALL enable zoneless change detection through `provideZonelessChangeDetection()` (or the Angular 22 default equivalent) and SHALL NOT depend on `zone.js`.
Components SHALL trigger view updates through signals, the `async` pipe, or other Angular-notified mechanisms rather than relying on Zone.js patching.

#### Scenario: Zoneless change detection is provided

- **WHEN** the application config of the client is inspected
- **THEN** it enables zoneless change detection, either explicitly through `provideZonelessChangeDetection()` or through the Angular 22 default

#### Scenario: Zone.js is absent

- **WHEN** the dependencies and build polyfills of the client are inspected
- **THEN** `zone.js` is neither declared as a dependency nor listed in the build `polyfills`

#### Scenario: Vite-based builder is configured

- **WHEN** the build and serve targets in `angular.json` are inspected
- **THEN** they use the `@angular/build:application` builder and the `@angular/build:dev-server` builder

#### Scenario: Development server runs on Vite

- **WHEN** the development server of the client is started
- **THEN** it is served by the Vite-based dev server with hot module replacement

#### Scenario: Unit tests run on Vitest

- **WHEN** the test target in `angular.json` is inspected
- **THEN** it uses the `@angular/build:unit-test` builder with the `vitest` runner

#### Scenario: Unit tests are executed

- **WHEN** the unit tests of the client are executed
- **THEN** they run with Vitest and the run fails if any test fails

### Requirement: Standalone components only

The client application SHALL be bootstrapped with `bootstrapApplication` and SHALL use standalone components, directives, and pipes exclusively.
The application SHALL NOT declare any `NgModule`.

#### Scenario: No NgModule is declared

- **WHEN** the source code of the client is searched for `@NgModule`
- **THEN** no declaration is found

#### Scenario: Application bootstraps from an application config

- **WHEN** the application entry point is inspected
- **THEN** it calls `bootstrapApplication` with an `ApplicationConfig`

### Requirement: Single page application

The client application SHALL be a single page application served from one HTML document, with a single `index.html` and a single bootstrapped root component.
Navigation between views SHALL be handled client-side by the Angular router, configured through `provideRouter` with routes in the application config, without full page reloads.
Feature views SHOULD be loaded lazily through `loadComponent` routes.
Deep links to any route SHALL resolve to the application shell when the application is served.

#### Scenario: Single entry document

- **WHEN** the production build output is inspected
- **THEN** it contains one `index.html` that hosts the root component

#### Scenario: Router is configured in the application config

- **WHEN** the application config of the client is inspected
- **THEN** it provides the router through `provideRouter` with an application route table

#### Scenario: Navigation does not reload the page

- **WHEN** the user navigates between views through a router link
- **THEN** the view changes without a full page reload

#### Scenario: Deep link resolves to the application shell

- **WHEN** a route URL other than the root is requested directly from the server
- **THEN** the application shell is served and the router renders the matching view

#### Scenario: Unknown route is handled

- **WHEN** the user opens a URL that matches no route
- **THEN** the router renders a not-found view or redirects to a default route

### Requirement: Progressive Web App

The client application SHALL be a Progressive Web App.
It SHALL provide a web app manifest and register an Angular service worker for production builds.

#### Scenario: Manifest is served

- **WHEN** the production build output is inspected
- **THEN** it contains a `manifest.webmanifest` with name, icons, `display`, and `start_url`

#### Scenario: Service worker is registered in production

- **WHEN** the application runs from a production build
- **THEN** the Angular service worker is registered and its `ngsw.json` is served

#### Scenario: Service worker is inactive in development

- **WHEN** the application runs from a development build
- **THEN** no service worker is registered

#### Scenario: Application is installable

- **WHEN** the production build is opened in a browser that supports installation
- **THEN** the browser offers to install the application

### Requirement: tailwindCSS as styling foundation

The client application SHALL use tailwindCSS as the foundation for all styling.
tailwindCSS SHALL be registered in the global stylesheet, and the application SHALL NOT depend on another CSS framework or component library.

#### Scenario: tailwindCSS is declared

- **WHEN** the dependencies of the client are inspected
- **THEN** `tailwindcss` is declared
- **AND** no other CSS framework such as Bootstrap or Angular Material is declared

#### Scenario: tailwindCSS is registered in the stylesheet

- **WHEN** the global stylesheet of the client is inspected
- **THEN** it imports tailwindCSS

#### Scenario: Custom styling uses Tailwind

- **WHEN** an element needs styling beyond a daisyUI component
- **THEN** it is styled with Tailwind utility classes rather than hand-written CSS

### Requirement: daisyUI as graphical language and style guide

The client application SHALL use daisyUI, built on top of tailwindCSS, as its graphical language and style guide.
daisyUI SHALL be enabled as a tailwindCSS plugin in the global stylesheet.
UI elements SHALL use daisyUI component classes and theme tokens for appearance, so that look and feel is defined by the daisyUI theme.

#### Scenario: daisyUI is declared and enabled

- **WHEN** the dependencies and the global stylesheet of the client are inspected
- **THEN** `daisyui` is declared
- **AND** the stylesheet enables the daisyUI plugin after importing tailwindCSS

#### Scenario: Components use daisyUI classes

- **WHEN** a UI element such as a button, table, form control, or navigation bar is rendered
- **THEN** it uses the corresponding daisyUI component classes

#### Scenario: Colors come from the theme

- **WHEN** a color is applied to a UI element
- **THEN** it uses a daisyUI theme color token such as `primary` or `base-100`
- **AND** no hard-coded color value is used

### Requirement: Dark mode support

The client application SHALL support a light and a dark appearance using daisyUI themes.
The initial theme SHALL follow the operating system preference through `prefers-color-scheme`.
The user SHALL be able to switch the theme, and the choice SHALL be persisted across sessions.

#### Scenario: Themes are configured

- **WHEN** the global stylesheet of the client is inspected
- **THEN** the daisyUI plugin enables a light and a dark theme

#### Scenario: Initial theme follows system preference

- **WHEN** the application is opened without a stored theme choice and the operating system prefers a dark color scheme
- **THEN** the dark theme is applied

#### Scenario: User switches the theme

- **WHEN** the user toggles the theme control
- **THEN** the application switches between the light and dark theme without reloading
- **AND** the choice is stored in the browser

#### Scenario: Stored choice takes precedence

- **WHEN** the application is opened with a stored theme choice
- **THEN** the stored theme is applied regardless of the operating system preference

#### Scenario: All views remain legible in both themes

- **WHEN** any view is rendered in the light or the dark theme
- **THEN** it uses daisyUI theme color tokens only, so that text and background keep sufficient contrast
