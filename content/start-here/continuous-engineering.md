---
title: From Interactive Work to Continuous Engineering
description: Scheduled engineering roles are repeated bounded Runs with checkpoints, not immortal sessions.
type: Start here
section: start-here
order: 14
readTime: 5 min read
slug: start-here/continuous-engineering
---

## The shift

An interactive coding Run starts with a human request from the workspace-root
driver. A housekeeper, dependency maintainer, or bug fixer starts with a
schedule, trigger, or queue owned by an external orchestrator. The execution
model can remain the same: each role supplies caller-owned Task intent and
invokes a bounded `ws run` against an isolated managed-repository worktree.

```text
schedule / trigger
        ↓
bounded Run → inspect → propose → validate → checkpoint
        ↑                                      │
        └──────────── next Run reads ─────────┘
```

Continuity comes from durable Workstream goals, loop definitions, state,
history, and semantic checkpoints owned by the caller. It does not require
keeping the same process, Task Workspace, worktree, or agent session alive
forever.
`AGENTS.md` and `.agents/skills/` are regenerated when the System Workspace
map or shared conventions change.

## Roles, not personalities

An Agent Profile describes an engineering role: interactive coder, housekeeper, dependency maintainer, or bug fixer. The profile can define defaults for tools, scope, and validation without becoming a mandatory implementation policy.

## Safety boundary

Scheduled Runs should produce Candidates and evidence. They should not silently bypass repository review, resource limits, or integration policy. [Scheduled Housekeeper](../patterns/p10-scheduled-housekeeper) describes the default.

## The bigger picture

Continuous engineering composes an external Planner/orchestrator with bounded
`ws` primitives: context composition, isolated Task Workspace execution,
explicit coordination, result/lineage records, durable knowledge promotion,
and separate integration.
