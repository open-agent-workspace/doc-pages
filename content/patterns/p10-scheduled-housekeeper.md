---
title: P10 — Scheduled Housekeeper
description: Run recurring maintenance as bounded, inspectable engineering work.
type: Pattern
section: patterns
order: 40
readTime: 5 min read
slug: patterns/p10-scheduled-housekeeper
---

## Problem

Dependencies, generated files, stale worktrees, and local resources need care even when no human is actively coding.

## Context

A workspace needs repeated housekeeping without an immortal agent session.

## Pattern

Schedule a Housekeeper Agent Profile that creates bounded Runs with a narrow objective, evidence, and checkpoint.

## Diagram

```text
schedule → inspect → bounded change → validate → Candidate / report
```

## Example

Weekly Run: inspect stale worktrees, report active resources, and propose cleanup. A separate policy decides whether deletion is allowed.

## Trade-offs

Repeated Runs are restartable and observable. Scheduling adds operational state and requires idempotent tasks.

## Failure modes

The housekeeper changes too much, repeats work after a timeout, or assumes a resource is abandoned without checking ownership.

## Extension points

Cron, an external scheduler, a daemon, or a queue can trigger Runs.

## When not to use

Do not schedule maintenance that has no stable validation or safe rollback path.
