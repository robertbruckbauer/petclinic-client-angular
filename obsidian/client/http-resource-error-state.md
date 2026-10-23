---
category: client
related:
  - moc.md
status: current
updated: 2026-10-16
---

# `httpResource` throws when read in an error state

Calling `value()` on an `httpResource` whose request failed throws instead of returning `undefined`.
A template such as `version.value()?.trim() ?? '—'` therefore breaks rendering on a 404 and never reaches its fallback.
Guard the read with `hasValue()`, as in [home.html](../../src/app/home/home.html): `version.hasValue() ? version.value().trim() : '—'`.

A related test pitfall: jsdom does not implement `matchMedia`.
Specs that render [ThemeToggle](../../src/app/theme-toggle/theme-toggle.ts), directly or through `App`, must stub it, e.g. `vi.stubGlobal('matchMedia', () => ({ matches: false }))`.
