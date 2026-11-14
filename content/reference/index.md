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
| System Workspace (V1 slice) | Git control repository root, `.workspace/workspace.yaml`, generated `AGENTS.md`, and `.agents/skills/` |
| Workstream | Caller-owned Task intent; not a first-class `ws` object |
| Task Workspace (V1 slice) | Per-Run Git worktree, selected repository snapshots, context files, and runtime working state |
| Runtime Workspace | Not implemented as canonical deployed state |
| System / Layer / Resource catalog | Optional declaration-only `system/*.yaml` registries; `ws discover` filters declared membership, while `ws validate` and topology status inspect it |
| Planner / Task Resolver | External capabilities; the interactive driver and explicit CLI options provide a narrower flow |
| Bounded Run | `RunOrchestrator` and SQLite run record |
| Isolated Run | `GitWorktreeExecutionProvider` |
| Operational coordination | `OperationalStore` backed by local SQLite |
| Agent execution | `CommandAgentProvider` with argv profiles |
| Runtime Resource | Local port/process providers; this is narrower than the broad System Resource concept |
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
YAML history rather than full agent telemetry. This V1 history contains useful
repository/context snapshots, but it is not yet the full Workstream-linked Run
Manifest described below.

## Four scopes and implementation status

The target architecture distinguishes:

```text
System Workspace   → topology, contracts, policies, shared learning
Workstream         → goals, plans, loops, state, and durable intent
Task Workspace     → disposable context and worktrees for one task
Runtime Workspace  → canonical deployed state
```

The reference CLI currently implements the System Workspace as a Git control
repository plus optional declaration-only System/Layer/Resource registries.
`ws discover` filters declared membership; `ws validate` and topology status
inspect declarations. It implements Task execution as bounded Runs with
isolated worktrees and a narrow Runtime Resource allocator for ports/processes.
It does not claim a Planner, Task Resolver, or canonical Runtime Workspace.

PM2, Docker Compose, and Git/FS are future adapter choices for a Runtime
Workspace owned by an external runtime system. The documentation does not
imply that the CLI currently owns Runtime Workspace `start`, `stop`,
`reconcile`, or `deploy` operations.

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

## Durable lineage and Run Manifest

Task files and worktrees may be deleted after execution. The durable record
should retain lineage instead:

```yaml
task: TASK-123
workstream: agent-platform
systems: [agent-platform]
layers: [execution, knowledge]
resources: [agent-runtime, event-schema]
system_revision: c319efa
plan_revision: 54c817
agent: codex
status: completed
repos:
  agent-runtime:
    base: 4fa19de
    branch: task/TASK-123
```

The current CLI records several of these ingredients—Run identity, profile,
repository snapshots, context revision, Candidates, and Events—but does not
yet persist this complete Workstream/Task/System manifest.

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

## Composable workspaces

Use the [composition CLI](composable-workspaces) to reference existing workspaces.
The [assessment and phased plan](composable-workspaces-design) distinguishes
implemented metadata/discovery from planned scoped context and dispatch.
