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

### Requirement: Container runs as a non-root user

The runtime stage SHALL run nginx as a non-root user and SHALL NOT run any process as `root`.
nginx SHALL listen on an unprivileged port (above 1023) and SHALL only write to paths that this user owns.

#### Scenario: Image declares a non-root user

- **WHEN** the container image configuration is inspected
- **THEN** its default user is not `root` and not UID `0`

#### Scenario: Container processes do not run as root

- **WHEN** a container is started from the image
- **THEN** the nginx master and worker processes run as a non-root user

#### Scenario: Container serves the application without privileges

- **WHEN** a container is started from the image with all Linux capabilities dropped
- **THEN** nginx serves the application on its unprivileged port
