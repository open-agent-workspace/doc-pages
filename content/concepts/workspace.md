---
title: Workspace
description: A logical boundary around the system context an engineering team and its agents share.
type: Concept
section: concepts
order: 21
readTime: 4 min read
slug: concepts/workspace
---

## Definition

A Workspace groups related repositories, shared engineering knowledge, policies,
skills, agent Runs, and runtime resources. In the reference convention it is
also a Git-managed control repository: the directory opened as the coding
agent’s project root.

## Why it exists

The system an agent needs to understand can be larger than the repository it is allowed to modify. A workspace gives that context a durable name and a place for relationships to live.

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

## Lifecycle

`ws init` creates or adopts the Git control-repository root. `ws repo clone`
materializes URL-backed repositories under `repos/`, while `ws repo add`
registers an existing local checkout and records its URL when it can infer one
from `origin`. `ws generate` refreshes the root `AGENTS.md` and
`.agents/skills/`. Runs execute within the workspace, and durable knowledge is
promoted back into the control repository. `ws repo sync [name]` explicitly
materializes missing URL-backed checkouts and leaves existing ones unchanged. The workspace can
outlive any particular Run.

## Driver and bounded Run contexts

The interactive driver agent starts at the control-repository root. It reads
the generated `AGENTS.md` and workspace skills, maintains the manifest and
context, and orchestrates `ws` commands. A bounded `ws run` agent starts in a
Git worktree of one selected mutation repository. It can read selected context
repositories but only returns a Candidate for its declared write target.

## Shared or private?

The workspace boundary is shared. Individual plans, temporary files, and transient telemetry can remain private to a Run.

## Durable or runtime?

Relationships, policies, and promoted knowledge are durable. Processes, allocated ports, and active Run state are runtime concerns.

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

[Repository](repository), [Workspace Context](workspace-context), [Run](run), and [Resource](resource).
