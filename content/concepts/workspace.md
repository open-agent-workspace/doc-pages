---
title: Workspace
description: A general term for scoped architecture, intent, execution, and runtime state.
type: Concept
section: concepts
order: 21
readTime: 4 min read
slug: concepts/workspace
---

## Definition

A Workspace is a general term, not one lifecycle boundary. Use [Workspace
Scopes](workspace-scopes) to distinguish the durable System Workspace,
Workstream intent, disposable Task Workspace, and canonical Runtime
Workspace. These scopes can be owned by different systems; a four-directory
setup is optional. In the reference convention, the Git-managed control
repository is the practical root for the System Workspace and interactive
driver.

## Why it exists

The system an agent needs to understand can be larger than the repository it is
allowed to modify. Explicit scopes let architecture and intent outlive a task
without making every execution share one mutable checkout.

## Physical convention

The control repository owns the workspace manifest, durable context, generated
agent guidance, and coordination history. Independently Git-managed
repositories live below its ignored `repos/` directory:

```text
workspace/                         # Git control repository; open this folder
├── AGENTS.md                      # generated driver-agent instructions
├── .agents/skills/                # generated workspace skills
├── .workspace/workspace.yaml      # manifest and durable context
├── .workspace/runtime/            # ignored, disposable runtime state
├── .gitignore                     # ignores repos/ and runtime state
└── repos/                         # ignored by the control repository
    ├── service/.git/              # independent repository
    └── docs/.git/                 # independent repository
```

This layout is a convention, not a monorepo. Each entry keeps its own Git
history, branch, CI, release lifecycle, and integration policy. Submodules are
not required and are not the default.

## Current V1 mapping

`ws init` creates or adopts the Git control-repository root. `ws repo clone`
materializes URL-backed repositories under `repos/`, while `ws repo add`
registers an existing local checkout and records its URL when it can infer one
from `origin`. `ws generate` refreshes the root `AGENTS.md` and
`.agents/skills/`. Runs execute within the workspace, and durable knowledge is
promoted back into the control repository. `ws repo sync [name]` explicitly
materializes missing URL-backed checkouts and leaves existing ones unchanged.
The control repository can outlive any particular Run. It currently combines
most System Workspace material with the V1 driver entry point. Workstream
intent, Planner/loop state, and canonical Runtime Workspace remain owned by
callers or external runtime systems.

## Driver and bounded Run contexts

The interactive driver agent starts at the control-repository root. It reads
the generated `AGENTS.md` and workspace skills, maintains the manifest and
context, and orchestrates `ws` commands. A bounded `ws run` agent starts in a
Git worktree of one selected mutation repository. It can read selected context
repositories but only returns a Candidate for its declared write target.

## Shared or private?

The System Workspace boundary is shared. Workstream plans are durable intent;
individual task plans, temporary files, and transient telemetry can remain
private to a Task Workspace or Run.

## Durable or runtime?

Relationships, policies, and promoted knowledge are durable. Processes,
allocated Runtime Resources, and active Run state are execution concerns. Do
not confuse those temporary concerns with the separate Runtime Workspace
owned by a runtime system and describing canonical deployed state.

## Default implementation

The reference CLI represents a workspace with a Git control repository, local
structured files, generated agent guidance, and SQLite-backed operational
state. Neither the file layout nor the CLI defines the underlying concept, but
the convention makes one project root practical for a coding agent.

## Trade-offs

The boundary improves orientation and reuse, but introduces metadata to
maintain. Ignoring `repos/` keeps the control history focused, while requiring
explicit URL/path metadata and sync operations. Avoid creating a workspace
abstraction for a one-off script that has no shared context.

## Related concepts

[Workspace Scopes](workspace-scopes), [System Model](system-model), [Repository](repository), [Workspace Context](workspace-context), [Run](run), and [Resource](resource).
