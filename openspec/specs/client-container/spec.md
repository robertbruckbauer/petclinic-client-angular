# client-container Specification

## Purpose

Defines how the Angular client is packaged and served as a container image.

## Requirements

### Requirement: Container image with nginx

The client application SHALL be packaged as a container image built from a `Dockerfile` with two stages.
The build stage SHALL install the dependencies and execute the production build of the client.
The runtime stage SHALL be based on nginx, SHALL contain only the prebuilt static files copied from the build stage, and SHALL NOT contain Node.js, the sources, or `node_modules`.
nginx SHALL serve the static files and SHALL fall back to `index.html` for routes that match no file, so that deep links of the single page application resolve.

#### Scenario: Dockerfile has two stages

- **WHEN** the `Dockerfile` of the client is inspected
- **THEN** it declares a build stage and a runtime stage
- **AND** the runtime stage copies the production build output from the build stage with `COPY --from`

#### Scenario: Runtime image serves static files only

- **WHEN** the container image is inspected
- **THEN** its base is nginx
- **AND** it contains neither Node.js nor `node_modules` nor the application sources

#### Scenario: Container serves the application

- **WHEN** a container is started from the image
- **THEN** nginx serves the application at the root URL

#### Scenario: Deep link falls back to the application shell

- **WHEN** a route URL that matches no static file is requested from the container
- **THEN** nginx responds with `index.html`

#### Scenario: Service worker files are not cached by the server

- **WHEN** `ngsw.json` or `ngsw-worker.js` is requested from the container
- **THEN** the response disables HTTP caching so that updates are detected

#### Scenario: The health check succeeds independently of the backend

- **GIVEN** the nginx container is running
- **WHEN** `/healthz` is requested
- **THEN** it returns `200` with an empty body regardless of whether the backend is reachable
