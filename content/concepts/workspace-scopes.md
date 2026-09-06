---
title: Workspace Scopes
description: Four workspace scopes separate architecture, intent, execution, and deployed state.
type: Concept
section: concepts
order: 22
readTime: 6 min read
slug: concepts/workspace-scopes
---

## Why four scopes?

“Workspace” is useful as a general word, but one directory should not be
asked to mean architecture, planning, an active coding session, and deployed
runtime state at the same time. The system uses four scopes with different
lifetimes and authorities:

```text
System Workspace   → canonical architecture
Workstream         → canonical intent and planning
Task Workspace     → disposable execution
Runtime Workspace  → canonical deployed state
```

The scopes can be materialized in different directories or services. A local
Git control repository is a practical V1 implementation of the System
Workspace; it is not the definition of all four scopes.

## System Workspace

The System Workspace answers:

- What exists?
- Why does each resource exist?
- Which systems, layers, contracts, and policies relate?
- What shared patterns and conventions have been promoted?

It is durable and long-lived. A useful shape is `systems.yaml`,
`layers.yaml`, `resources.yaml`, `repos.yaml`, contracts, policies, decisions,
and shared knowledge. The existing Git control repository and its durable
`.workspace/context/` plus the declaration-only `system/` registries are the
reference implementation’s current slice of this scope. The CLI can discover,
validate, and report this topology without launching or reconciling runtime
adapters.

## Workstream

A Workstream is durable intent for a product, capability, or multi-repository
effort. It records the goal, plan, backlog, decisions, preferences, loop
definitions, state, and history that should survive individual tasks.

```text
workstreams/agent-platform/
├── workspace.yaml
├── goal.md
├── plan.md
├── backlog.md
├── decisions/
├── learnings/
├── loops/
├── state/
└── history/
```

The Planner primarily operates here. Detailed plans for one execution may
remain private to its Task Workspace, while the Workstream plan remains the
canonical statement of what should happen next.

## Task Workspace

A Task Workspace is the disposable execution context for one task. The Task
Resolver composes it from the relevant systems, layers, resources, policies,
worktrees, and Workstream state. It may contain a task manifest, goal,
selected context, scratch space, handoff, run manifest, and Git worktrees.

```text
Workstream goal + System model
             ↓
       Task Resolver
             ↓
     Task Workspace
             ↓
       Agent Run
```

The current reference CLI’s bounded Run and per-Run Git worktree implement
important parts of this scope. The filesystem is disposable; its result,
lineage, and promoted learning are not.

## Runtime Workspace

The Runtime Workspace describes canonical deployed or operational state:
which services, jobs, infrastructure, and runtime agents should exist and
which revisions are deployed. It is distinct from a Task Workspace’s temporary
ports, processes, logs, and worktrees.

PM2, Docker Compose, and Git/FS are possible runtime adapters. They translate
the canonical model into local mechanisms. The reference CLI does not yet
implement a full Runtime Workspace or claim `start`, `stop`, `reconcile`, or
`deploy` for it.

## Planner and Task Resolver

Planner is a capability, not another mandatory application. It reads a
Workstream goal, plan, recent history, and System Workspace model; it proposes
the next task and updates durable Workstream intent. The Task Resolver then
selects relevant systems, layers, and resources and composes a Task Workspace.

```text
Planner → Workstream intent → Task Resolver → Task Workspace → Agent
```

This keeps planning durable even after a Task Workspace is removed.
