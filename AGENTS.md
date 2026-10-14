# Agent Instructions

## Development

The best code is the code never written.
Ask the following questions:
- **Does this need to exist at all?**
Skip it (YAGNI principle).
- **Already in this codebase?**
Reuse it.
- **Native platform feature covers it?**
Use it.
- **Already-installed dependency solves it?**
Use it.

## Documentation

This repository has a documentation approach with a clear separation of concerns:

- **`openspec`** — contains the normative behavior contracts for the implementation — requirements and scenarios are normative, not descriptive-after-the-fact.
- **`obsidian`** — contains the knowledge graph maintained exclusively by AI agents — never by direct human edit.

No documentation artifact references a file under `plans/` directly — a plan is a transient working document for a single change, not part of the durable documentation graph. A fact from a plan that needs to persist is written directly into the artifact instead.

## Truth model and precedence

This repository has artifacts that describe the same current-state fact. When two of them disagree, resolve in this order:

1. Code and tests — the ground truth.
2. `openspec` — the normative contract.
3. `obsidian` — the explanatory knowledge graph written only by AI agents through its maintenance skills — never by direct human edit.

## Instructions

At the end of each successful request you MUST:
1. Invoke the `obsidian-maintainer` skill and update the knowledge graph.
2. Invoke the `consistency-checker` skill and report the result.

At the end of each request you MUST:
- Show a list of applied skills.
- Show a list of changed files.

## Checklists

For skill files (.agents/skills/**/SKILL.md):
- [ ] Has markdown front matter
- [ ] Has non-empty `description` field wrapped in single quotes
- [ ] Has `name` field matching the skill directory name
- [ ] Skill directory name is lower case with hyphens

For asciidoc files (*.adoc)
- [ ] Create a newline after each sentence in a paragraph.
- [ ] No line breaks within a sentence in a paragraph.
- [ ] Use the `xref` directive with for linking other asciidoc files with base path `relrootdir` defined in the same file. 

## Repository Structure

```
.
├── obsidian           # Knowledge graph
├── openspec           # Normative specifications
├── pages              # Source for GitHub pages
├── plans              # Implementation plans
├── AGENTS.md          # Agent settings
├── PROMPT.adoc        # Prompt engineering help
├── README.adoc        # Build management help
└── VERSION            # Version of this application
```

## Artifact locations

### `openspec`

| Artifact | Pattern | Location |
|---|---|---|
| OpenSpec capability spec | `spec.md` | `openspec/specs/{capability}/` |

### `obsidian`

| Artifact | Pattern | Location |
|---|---|---|
| Knowledge note | `{topic}.md` | `obsidian/{category}/` |
| Category map of contents | `moc.md` | `obsidian/{category}/` |
| Vault index | `index.md` | `obsidian/` |
