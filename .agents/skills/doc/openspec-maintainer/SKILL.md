---
name: openspec-maintainer
description: 'Maintain openspec directory as the normative behavior contract by editing capability specs directly; use for prompts like "Add a requirement for ..." or "Update the capability for ...".'
---

## Task preconditions

You MUST NOT generate a spec change if even one of the preconditions is not met.

### Identify target capability

Extract the capability name from the request.
Check that `openspec/specs/{capability}/spec.md` exists, or that a new capability is explicitly being requested.
Replace placeholder `{capability}` with the given name.

### Route UI-facing content to `client-shell` vs. `client-style`

A request touching UI behavior lands in exactly one of these two capabilities — never split across both, never left in whichever file happens to be open:

- **`client-shell`**: the per-entity screen inventory (a lister, an editor, a viewer exists) and behavior driven by a backend call or the security posture — REST-conventions-based filtering/pagination, optimistic-concurrency conflicts, validation-error mapping, explicit loading/empty states, error-toast triggering, auth/session handling.
The test: does the requirement exist *because of* a REST/GraphQL response, an ETag, or an auth rule?
- **`client-style`**: everything about a screen's concrete composition (header, footer, menus, field order/type, table columns and row-action order, filter widget choice, picklist sourcing) and its visual appearance (color, iconography, control shape, typography, responsive breakpoint, motion).
The test: Does it exist *regardless* of what the backend does — it's about how the screen is laid out or how it looks? → `client-style`.

If a requirement genuinely doesn't fit either description, put it into the per-entity capability's `## UI Requirements` section which references both `client-shell` and `client-style`.

### Route platform-specific content to `client-platform`

Any requirement that is specific to a particular platform is be placed in the `client-platform` capability. This ensures that platform-specific behavior is clearly separated from general UI requirements.

### Check precedence before editing

Precedence when artifacts disagree about a current-state fact: code and tests, then `openspec`, then `obsidian`.

## Task steps

### Edit the capability spec directly

Add, change, or remove `### Requirement:` or `#### Scenario:` entries directly in `openspec/specs/{capability}/spec.md` — a wording fix and a behavior change are both made this way, in place, with no separate draft step.

## Validation checklist

- [ ] Every capability spec still uses only `### Requirement:` and the `#### Scenario:` (Given/When/Then) structure
- [ ] Every general layout detail was added to `client-shell`
- [ ] Every general styling detail was added to `client-style`
- [ ] Every technology stack detail was added `client-platform`
- [ ] No file under `pages/` is referenced from the spec
- [ ] No file under `plans/` is referenced from the spec

## Task output

Report which capability was changed and a one-line summary of the change.
