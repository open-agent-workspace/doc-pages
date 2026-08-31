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

An agent needs to continue a multi-step objective across time or triggers.

## Pattern

Represent the loop as repeated bounded Runs. Each Run reads a checkpoint, performs one safe slice, and writes the next checkpoint.

## Diagram

```text
checkpoint → Run 1 → checkpoint → Run 2 → checkpoint → …
```

## Example

An upgrade agent records packages inspected, blockers, and next action. A later Run resumes from that durable state in a fresh worktree.

## Trade-offs

Recovery and cleanup are easier. Checkpoints need a schema and can become stale or overly detailed.

## Failure modes

The next Run cannot tell completed from pending work, or a checkpoint is treated as canonical truth without validation.

## Extension points

Use Git files, SQLite, a queue, or a workflow engine for checkpoints.

## When not to use

Short, deterministic tasks should remain one Run.
