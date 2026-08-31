---
title: Reference Implementation
description: A concrete mapping from open patterns to local primitives, presented as an optional implementation.
type: Reference
section: reference
order: 90
readTime: 6 min read
slug: reference
---

## Pattern to primitive

The sibling `reference-implmentation/` repository demonstrates one local
implementation of the architecture:

| Open pattern | Reference primitive |
| --- | --- |
| Workspace | `.workspace/workspace.yaml` plus Markdown context |
| Bounded Run | `RunOrchestrator` and SQLite run record |
| Isolated Run | `GitWorktreeExecutionProvider` |
| Operational coordination | `OperationalStore` backed by local SQLite |
| Agent execution | `CommandAgentProvider` with argv profiles |
| Runtime Resource | Local port/process providers |
| Candidate | Git commit or unchanged base snapshot |
| Durable workspace knowledge | Git-tracked Markdown / YAML |
| Integration | Locked rebase, validation, and fast-forward merge |

The implementation’s provider seams are intentionally replaceable. Git
invocation is argv-based (no shell), a writable worktree is created lazily for
the mutation repository, and selected context repositories are materialized as
detached commit snapshots. Integration requires the operational store lock,
and a failed validation, rebase, or merge leaves the candidate worktree
available for inspection. Completed Runs promote concise YAML history rather
than full agent telemetry.

## The relationship

```text
open patterns
      ↓
reference architecture
      ↓
reference CLI
```

The direction matters. The CLI is a useful demonstration and a place to start experimenting. Its commands, storage, and provider adapters can change without invalidating the underlying principles.

## Try the concrete CLI

From a checkout containing these sibling directories:

```text
agent-workspace/
├── doc-pages/
├── reference-implmentation/
└── example-workspace/
```

The example fixture is at `../example-workspace/` relative to the
implementation repository. It includes a deterministic `coder` profile and a
fake agent that edits only `src/message.txt` using `WS_PROMPT`. First create
the fixture’s required base commit:

```sh
cd ../example-workspace
git branch -M main
git add .
git commit -m "Create example workspace fixture"
```

Then point the CLI at it (from the fixture directory):

```sh
node ../reference-implmentation/bin/ws.js status
node ../reference-implmentation/bin/ws.js run coder "Add a greeting" --no-integrate
node ../reference-implmentation/bin/ws.js runs
node ../reference-implmentation/bin/ws.js inspect <run-id>
node ../reference-implmentation/bin/ws.js integrate <candidate-id>
```

For a fully automatic local-Git handoff, omit `--no-integrate`. The human
checkout remains unchanged while the agent runs; only the explicit
integration step updates its branch.

## A reference lifecycle

```text
create Run → allocate worktree/resources → invoke provider
     ↓                                      ↓
 publish Intent                       collect evidence
     └──────────────→ Candidate → validate → integrate
```

## What an implementation should make inspectable

- the Run’s objective and mutation scope;
- the execution boundary and allocated Resources;
- the Intent visible to other Runs;
- the Candidate and validation evidence;
- which Events or knowledge were promoted;
- which policy made the integration decision.

## Why not prescribe the CLI?

Teams may need Docker, a different agent provider, a remote scheduler, or an external knowledge store. The reference implementation should make those substitutions easier, not make them contradictory.

## Defaults and boundaries

This implementation is a concrete V1, not a stronger guarantee than the
patterns themselves. It assumes one machine, uses Git worktrees for workflow
isolation rather than security isolation, and does not provide distributed
coordination, CI, a built-in scheduler, or atomic multi-repository commits.
Runtime SQLite state is disposable; unintegrated candidates are preserved.

The CLI is optional. Read the patterns and concepts independently, or replace
its execution, agent, resource, integration, and knowledge providers while
keeping the same conceptual boundaries. The implementation repository’s own
tests and the sibling fixture provide executable verification of the mapping;
the documentation can be checked with `npm run check` in `doc-pages`.
