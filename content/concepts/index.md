---
title: Concepts
description: The small vocabulary that makes agentic workspace patterns precise.
type: Concept index
section: concepts
order: 20
readTime: 7 min read
slug: concepts
---

## The vocabulary

The patterns use a compact set of terms. Each term describes a boundary, a lifecycle, or an information flow. Together they make it possible to discuss agentic engineering without conflating the principle with one implementation.

| Concept | Short definition |
| --- | --- |
| Workspace scopes | System, Workstream, Task, and Runtime scopes with different authorities and lifetimes. |
| System | A responsibility or product boundary in the canonical architecture. |
| Layer | An architectural role such as capability, knowledge, observability, runtime, or experience. |
| Resource | Any named thing that exists in the System model. |
| Runtime Resource | An allocated port, process, namespace, or ephemeral service used by a Task or Run. |
| Repository | Independent Git history, CI, release, and engineering boundary. |
| Agent Profile | A reusable definition of an engineering role. |
| Planner | A capability that turns Workstream intent into proposed next tasks. |
| Task Resolver | A capability that composes a Task Workspace from Systems, Layers, and Resources. |
| Workstream | Durable goals, plans, loops, state, and history for an ongoing effort. |
| Task Workspace | Disposable execution context assembled for one task. |
| Runtime Workspace | Canonical deployed or operational state, distinct from task execution state. |
| Run | One bounded agent execution. |
| Workspace Context | Shared durable knowledge available to Runs. |
| Intent | Minimal coordination information exposed to other Runs. |
| Candidate | A proposed result awaiting validation or integration. |
| Event | Durable provenance or engineering history. |
| Knowledge Proposal | A suggestion to promote a discovery or decision into shared knowledge. |
| Integration | Validation and promotion of a Candidate into canonical history. |

## A lifecycle view

```text
System model + caller objective → context selection → Task Workspace
                                                   ↓
                                                  Run → Candidate → Integration
                                                   ↓
                                            result + durable lineage
```

The vocabulary is intentionally implementation-independent. Agent Workspace
owns the repository/context and bounded-execution path; callers may own Task
intent and loops, while runtime owners expose deployed state. A local SQLite
coordinator, a daemon, or an external scheduler can expose compatible objects.

## Read next

Start with [Workspace Scopes](workspace-scopes) and the [System Model](system-model), then read [Run](run) and [Integration](integration). The more operational terms become useful once you reach the patterns.

## Independent workspace composition

[Composable Workspaces](composable-workspaces) references independently owned
workspaces without importing their repositories, instructions or skills.
