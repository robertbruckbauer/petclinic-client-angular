---
category: building
related:
  - moc.md
  - container-runtime-image.md
status: current
updated: 2026-10-23
---

# Service worker update files must never be cached

The Angular service worker learns about a new release only by re-fetching `ngsw.json` (the hashed file manifest) and `ngsw-worker.js`.
If the web server or a browser cache serves a stale copy of either, installed clients keep running the old build indefinitely, even though the new hashed bundles are already deployed.
[nginx.conf](../../nginx.conf) therefore sends `Cache-Control: no-cache, no-store, must-revalidate` for exactly these two locations; every other file is left to default caching.
The requirement itself is in the [client-container spec](../../openspec/specs/client-container/spec.md).

Pitfalls:

- The SPA fallback `try_files $uri $uri/ /index.html` answers unknown paths with `index.html` and status 200.
  A request for a missing `ngsw.json` or bundle therefore looks like a success; check the response body, not the status code.
- The worker is registered by `provideServiceWorker` in [app.config.ts](../../src/app/app.config.ts) only outside dev mode and only after the app is stable (or 30 s have passed).
  `ng serve` never exercises it; verify update behaviour against the built container, not the dev server.
- `ngsw.json` is generated at build time from [ngsw-config.json](../../ngsw-config.json), so it only exists in the output of `npm run build`.
