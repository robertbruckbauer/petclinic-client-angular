# Agent instructions for `openspec/`

## Role of this directory

`openspec/` contains the normative behavior contracts for the implementation — requirements and scenarios are normative, not descriptive-after-the-fact.

## How a document is produced or updated

- A capability with the `-platform` suffix is technology-specific by design, its whole purpose being to pin that module's current technology stack as a requirement rather than abstract away from it. 
- A significant behavior change must not land in code before its `specs/` update.

Editing files in `openspec/` is a documentation change. It never includes editing source files.
