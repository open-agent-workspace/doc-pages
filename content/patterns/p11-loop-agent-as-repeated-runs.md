---
title: P11 — Loop Agent as Repeated Runs
description: Preserve continuity with checkpoints and context instead of one immortal process.
type: Pattern
section: patterns
order: 41
readTime: 4 min read
slug: patterns/p11-loop-agent-as-repeated-runs
---

## Problem

Long-lived processes accumulate stale state, are hard to recover, and make ownership ambiguous.

## Context

An agent needs to continue a multi-step objective across time or triggers. The
loop definition belongs to a durable Workstream; each execution may use a new
disposable Task Workspace.

## Pattern

Represent the loop as repeated bounded Runs. Each Run reads Workstream goal,
plan, state, and history; performs one safe slice in a Task Workspace; and
writes the next semantic checkpoint back to the Workstream.

## Diagram

```text
Workstream loop definition
          ↓
checkpoint → Task 1 / Run 1 → checkpoint → Task 2 / Run 2 → …
```

## Example

An upgrade loop records packages inspected, blockers, and next action in its
Workstream state. A later Planner/Task Resolver invocation resumes from that
durable state in a fresh Task Workspace and managed-repository worktree.

## Trade-offs

Recovery and cleanup are easier, and deleting a Task Workspace does not delete
the loop’s intent or history. Checkpoints need a schema and can become stale
or overly detailed.

## Failure modes

The next Run cannot tell completed from pending work, or a checkpoint is treated as canonical truth without validation.

## Extension points

Use Git files, SQLite, a queue, or a workflow engine for checkpoints.

## When not to use

Short, deterministic tasks should remain one Run.
