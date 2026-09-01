---
title: From One Agent to Many
description: Concurrency becomes manageable when every active Run has an explicit execution boundary.
type: Start here
section: start-here
order: 13
readTime: 5 min read
slug: start-here/from-one-agent-to-many
---

## Isolation before concurrency

Two agents working in the same checkout are not two independent workers. Their
file changes, generated artifacts, processes, and assumptions can collide. The
workspace root is the interactive driver’s checkout; it is not a shared
mutation checkout for bounded Runs.

Give each active Run its own execution environment. A Git worktree is the default reference implementation, but Docker, devcontainers, VMs, or another provider can implement the same isolation principle.

```text
workspace control repo / driver
     │
     └── repos/api (canonical managed repo)
             ├── Run A / worktree-a / feature
             ├── Run B / worktree-b / bugfix
             └── Run C / worktree-c / housekeeping
```

## Coordination is separate

Isolation prevents routine file collisions. It does not decide whether two
changes are compatible. The driver shares minimal coordination information—
usually Intent and status—while Run plans remain private by default. Generated
`AGENTS.md` and `.agents/skills/` tell the driver how to maintain this split.

## The integration seam

Each Run produces a Candidate. Validation and integration happen after execution, with the repository’s normal review and CI mechanisms still in charge.

This is the point at which the architecture becomes a system of bounded Runs rather than a collection of immortal agent processes.

Continue with [Multiple Agents / Same Repository](../patterns/p06-multiple-agents-same-repository).
