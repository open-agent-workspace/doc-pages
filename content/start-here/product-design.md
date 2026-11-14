---
title: Product Design
description: Agent Workspace helps agents understand and work across independent repositories with shared context and narrow execution boundaries.
type: Start here
section: start-here
order: 11
readTime: 8 min read
slug: start-here/product-design
---

## Product boundary

Agent Workspace is a local-first coordination layer for coding agents. Its
core job is to help an agent understand and work across independently managed
repositories without turning them into a monorepo or requiring every task to
load every checkout.

The product owns:

- repository and shared-context discovery;
- composing the smallest useful context for a task;
- bounded agent execution with explicit write limits;
- result and Candidate records;
- durable lineage across disposable execution environments.

The product does not own every planning or operations concern around an agent.
Goals, prioritisation, scheduling, retries, budgets, and long-lived loops may
belong to a caller, a Planner, or another orchestration system.

## The core user promise

Given an objective, an agent should be able to discover the relevant repository
and shared context, work within a narrow mutation boundary, and return a
reviewable result with enough provenance to continue or recover later.

The default write boundary is one repository per Run. The read boundary may
include several independent repositories and shared context. A future flow
may produce several coordinated Candidates, but the product does not promise
an atomic multi-repository transaction.

```text
user objective
      ↓
ws discovers declared context and repository relationships
      ↓
compose disposable Task Workspace
      ↓
bounded Run → Candidate / result / lineage
```

## Four scopes, different owners

These are ecosystem terms, not a requirement to create four directories for
every installation:

| Scope | Meaning | Default owner |
| --- | --- | --- |
| System Workspace | Durable architecture: Systems, Layers, Resources, relationships, contracts, and policies. | Workspace metadata / system owner |
| Workstream | Durable caller intent: goal, plan, prioritisation, decisions, and loop state. | Caller, Planner, or product workflow |
| Task Workspace | Disposable execution context assembled for one Task and Run. | Agent Workspace execution boundary |
| Runtime Workspace | Deployed services, jobs, infrastructure, and operational state. | Runtime owner such as LocalLink, PM2, Docker, or another adapter |

The current product is strongest at the System-to-Task path. Workstream and
Runtime Workspace integrations are contracts for other owners, not hidden
features that `ws` must absorb.

## Vocabulary and lifecycle

```text
System model ──┐
               ├─→ context composition → Task Workspace → Run → Candidate
Caller Task ───┘                                             ↓
                                                        result + lineage
```

- **System** answers why a resource exists: a responsibility or product
  boundary.
- **Layer** answers which architectural role it plays: for example
  capability, execution, knowledge, observability, runtime, or experience.
- **Resource** answers what exists: a repository, service, MCP, skill, script,
  job, UI, contract, or capability. An allocated port or process is a
  **Runtime Resource**, a narrower execution concern.
- **Task** is durable intent owned by the caller. It can reference a goal,
  requested scope, constraints, and expected result.
- **Run** is one bounded attempt to execute a Task.
- **Candidate** is the reviewable result of a Run.
- **Task Workspace** is disposable filesystem/context state used by a Run.

## Discovery is progressive, not speculative

The System Workspace may provide explicit membership and relationships so an
agent can ask for relevant repositories and context without guessing from
directory shape. The current `ws discover` surface filters declared
membership by supported fields such as System, Layer, or kind; it is not
semantic search and does not infer a complete dependency graph.

A proposed later interface is on-demand context discovery: resolve a Task’s
declared need to relevant Resources, explain why each was selected, and let a
caller approve or constrain the result. That interface must preserve selected-
only snapshots and should not make an unavailable, unrelated repository block
an otherwise valid task.

## Planning and loops stay outside the core

Planner is a useful capability that can read a Workstream and propose Tasks,
but it is not a required `ws` service. Goals, prioritisation, retries,
schedules, budgets, and loop definitions remain caller-owned. A loop execution
may call `ws` repeatedly; each call gets a disposable Task Workspace and
should produce a durable Run Manifest as the result contract. The current
history path does not yet make that guarantee for every outcome. Continuity
comes from caller state plus lineage, not an immortal `ws` process.

## Runtime integration boundary

PM2, Docker Compose, Git/FS, LocalLink, or another runtime owner may consume
Results or a declared Runtime Workspace contract. Agent Workspace may expose
the references and lineage needed for that integration, but it does not claim
to start, stop, reconcile, or deploy those systems.

## Design principles

1. Keep repository histories independent.
2. Read broadly enough to understand the system; write narrowly enough to
   review the change.
3. Make context selection and mutation scope inspectable.
4. Preserve lineage when execution files disappear.
5. Make external ownership explicit instead of growing a competing planner,
   scheduler, or runtime control plane.

## Compose independently owned workspaces

The initial [Composable Workspaces](../concepts/composable-workspaces) capability
references existing workspaces through stable IDs and local locators, preserving
their repository/context ownership and standalone workflows. It supports metadata
inspection and validation; task-scoped context resolution and coordinated
dispatch remain proposed. Membership access labels do not grant permissions.
