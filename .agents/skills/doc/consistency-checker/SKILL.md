---
name: consistency-checker
description: 'Validate the consistency of documentation artifacts; use for prompts like "Validate documentation" or "check documentation consistency".'
---

## Task steps

### Check Obsidian structural rules

- Every knowledge note under `obsidian/` has frontmatter with `category`, `related`, `status`, `updated:`.
- `category` is one of the existing category directories under `obsidian/`; no category directory exists without a `moc.md`.
- Every category has exactly one MOC at `obsidian/{category}/moc.md`, with frontmatter `category`, `type: moc`, `related`, `status`, `updated:`.
- The vault root `obsidian/index.md` exists, with frontmatter `type: index`, `related`, `status`, `updated:`, and links to every category's `moc.md` file.
- No `[[wikilink]]` syntax appears anywhere — only standard Markdown links.
- No orphan notes: every knowledge note is linked from its category's `moc.md`, and has at least one `related:` entry (frontmatter or body). No broken relative links anywhere, including in `moc.md`/`index.md`.
- A note with `status: stale` or `status: superseded` carries a one-line explanation and is not cited elsewhere as if it were current guidance; a `superseded` note keeps a link to whatever superseded it, and vice versa.

### Check OpenSpec structural rules

- Every `openspec/specs/{capability}/spec.md` uses only `### Requirement:` / `#### Scenario:` structure.

### Check the don't repeat yourself (DRY) principle

- No information should be duplicated across multiple documentation artifacts; each piece of knowledge should have a single authoritative source.
- Precedence when artifacts have duplicate facts: code and tests, then `openspec`, then `obsidian`.
- Conflicts should be resolved by replacing the duplicated information in the lower-precedence artifact with a reference to the authoritative source, e.g. a note in `obsidian/` linking to the relevant `openspec` requirement or a code fragment included as an example in the `openspec` file.
- Conflicts should be reported.

## Validation checklist

- [ ] Every check above was actually run, not assumed passing
- [ ] Every code fragment in an documentation artefact actually exists in a source file.
- [ ] No file under `plans/` is referenced from any documentation artifact

## Task output

A findings list grouped by check title, each entry naming the file(s) and the specific rule violated.
An empty list for a category is reported as "checked, no issues" — not omitted.
