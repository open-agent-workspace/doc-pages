---
title: Composable Workspaces
description: Reference independent workspaces through stable identity without taking ownership of their repositories.
type: Guide
section: concepts
order: 29
readTime: 8 min read
slug: concepts/composable-workspaces
---

A composition is an optional capability of a coordinating workspace. Its members
are references to existing independent workspaces, each of which may contain
several repositories or research and documentation resources. Membership does
not change the original workspace identity, repositories, instructions or skills.
A member may participate in several compositions and remain usable by itself.

## Ownership and persistence

The coordinator owns `.workspace/composition.yaml`; members continue owning
`.workspace/workspace.yaml`, agent profiles, source, skills and Run state.
The composition uses the coordinator's existing ID and the current YAML
conventions. No standalone migration or new database is required.

```yaml
version: 1
workspace_id: <coordinator-id>
name: Agent Control System
members:
  - workspace_id: <dashboard-id>
    alias: dashboard
    path: ../dashboard
    role: Routes hardware actions to desktop sessions
    access: read-only
```

Workspace IDs establish identity. Paths locate exact workspace roots and are
stored relative to the coordinator. Paths are not repository registrations:
no cloning, moving or copying happens when a workspace joins. Shared architecture
and contracts can live in the coordinator's existing context/System conventions;
an optional integration repository owns only its own contracts and tests.

## Discovery and recovery

`ws compose inspect` shows member responsibility, repository names, IDs and
nested membership. It reads manifests, not member instructions, skills, source,
profiles or private agent history. Unavailable references receive diagnostics
without hiding available siblings; validation returns nonzero. Removing a member
only removes its reference. Relocation updates a locator after verifying the
original ID. Nesting is supported with ancestor-cycle detection; shared
non-cyclic descendants are valid. Newly added or relocated subtrees must validate.

## Access and execution boundaries

`access` defaults to `read-only` and describes the composition dispatcher write ceiling.
It grants no OS permissions and does not authorize modification or agent startup.
Explicit Task dispatch intersects this membership ceiling with task grants and member profile policy. Existing member `ws run`
commands continue independently, with one mutation repository and one Candidate
per Run. Git histories and integration policies remain independent.

Task-scoped instruction/skill resolution and explicit subtask dispatch are
implemented. They preserve scoped instruction provenance, lazy skill discovery,
explicit read/write grants and separate member execution contexts. A parent Task can already supply
correlation through ordinary Run `--intent`; `ws` does not own its schedule,
or retries. The CLI provides observational aggregate execution status.

See the [command reference](../reference/composable-workspaces),
[design and plan](../reference/composable-workspaces-design),
[ADR-018](../decisions/adr-018-composable-workspaces), and
[multi-application example](../examples/05-composable-workspaces).

See the [execution contract](../reference/composition-execution) for task files,
explicit attempts, integration gates and recovery.
