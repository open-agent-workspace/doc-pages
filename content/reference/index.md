---
title: Reference Implementation
description: A concrete mapping from open patterns to local primitives, including the Git control-repository workspace convention.
type: Reference
section: reference
order: 90
readTime: 6 min read
slug: reference
---

## Pattern to primitive

The `repos/reference-implmentation/` repository demonstrates one local
implementation of the architecture. It is a TypeScript 7 pnpm monorepo with
separate `@agentic-workspace/core` and `@agentic-workspace/cli` packages:

| Open pattern | Reference primitive |
| --- | --- |
| Workspace | Git control repository root, `.workspace/workspace.yaml`, generated `AGENTS.md`, and `.agents/skills/` |
| Bounded Run | `RunOrchestrator` and SQLite run record |
| Isolated Run | `GitWorktreeExecutionProvider` |
| Operational coordination | `OperationalStore` backed by local SQLite |
| Agent execution | `CommandAgentProvider` with argv profiles |
| Runtime Resource | Local port/process providers |
| Candidate | Git commit or unchanged base snapshot |
| Durable workspace knowledge | Git-tracked Markdown / YAML in the control repository |
| Integration | Locked rebase, validation, and fast-forward merge |

The implementation’s provider seams are intentionally replaceable. Git
invocation is argv-based (no shell), missing URL-backed repositories can be
materialized below the ignored `repos/` directory, a writable worktree is
created lazily for the mutation repository, and selected context repositories
are materialized as detached commit snapshots. Integration requires the
operational store lock, and a failed validation, rebase, or merge leaves the
candidate worktree available for inspection. Completed Runs promote concise
YAML history rather than full agent telemetry.

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

Create or open the Git control repository as the coding-agent project root.
Managed repositories are independently Git-managed checkouts under ignored
`repos/`:

```text
dogfood-workspace/
├── AGENTS.md
├── .agents/skills/
├── .gitignore                    # includes repos/
├── .workspace/
└── repos/
    ├── doc-pages/
    ├── reference-implmentation/
    └── example-workspace/
```

`ws init` creates the control-repository metadata. Use URL-backed clone
entries for a fresh workspace, or `repo add` for existing local checkouts:

```sh
cd /path/to/dogfood-workspace
ws init
ws repo clone https://github.com/example/doc-pages.git \
  --name docs --role documentation --path repos/doc-pages
ws repo clone https://github.com/example/reference-implmentation.git \
  --name reference --role implementation --path repos/reference-implmentation
ws repo clone https://github.com/example/example-workspace.git \
  --name example --role primary --path repos/example-workspace
ws generate
git add AGENTS.md .agents .workspace .gitignore
git commit -m "Configure dogfood workspace"
```

The manifest records both `path` and `url` for each entry:

```yaml
repositories:
  - name: example
    path: repos/example-workspace
    url: https://github.com/example/example-workspace.git
    role: primary
  - name: reference
    path: repos/reference-implmentation
    url: https://github.com/example/reference-implmentation.git
    role: implementation
  - name: docs
    path: repos/doc-pages
    url: https://github.com/example/doc-pages.git
    role: documentation
```

Then run the CLI from the workspace root. The example fixture includes a
deterministic `coder` profile and fake agent that edits only
`src/message.txt` using `WS_PROMPT`:

```sh
ws repo sync [name]
ws status
ws run coder "Add a greeting" --repo example \
  --context-repo reference --context-repo docs --no-integrate
ws runs
ws inspect <run-id>
ws integrate <candidate-id>
```

For a fully automatic local-Git handoff, omit `--no-integrate`. The
workspace-root driver checkout and managed repositories’ canonical checkouts
remain unchanged while the agent runs; only the explicit integration step
updates the target repository’s branch. `ws repo add <path> [--url <url>]`
infers a URL from `origin` when available.

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
tests and the dogfood fixture provide executable verification of the mapping;
the documentation can be checked with `npm run check` in `doc-pages`.
