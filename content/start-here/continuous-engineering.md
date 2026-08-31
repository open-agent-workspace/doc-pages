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

An interactive coding Run starts with a human request. A housekeeper, dependency maintainer, or bug fixer starts with a schedule, trigger, or queue. The execution model can remain the same.

```text
schedule / trigger
        ↓
bounded Run → inspect → propose → validate → checkpoint
        ↑                                      │
        └──────────── next Run reads ─────────┘
```

Continuity comes from durable context and checkpoints. It does not require keeping the same process, worktree, or agent session alive forever.

## Roles, not personalities

An Agent Profile describes an engineering role: interactive coder, housekeeper, dependency maintainer, or bug fixer. The profile can define defaults for tools, scope, and validation without becoming a mandatory implementation policy.

## Safety boundary

Scheduled Runs should produce Candidates and evidence. They should not silently bypass repository review, resource limits, or integration policy. [Scheduled Housekeeper](../patterns/p10-scheduled-housekeeper) describes the default.

## The bigger picture

Continuous engineering is a composition of bounded primitives: isolated execution, explicit coordination, durable knowledge promotion, and separate integration.
