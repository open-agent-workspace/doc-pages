---
title: P06 — Multiple Agents / Same Repository
description: Let several Runs work on one repository through distinct worktrees and explicit Candidates.
type: Pattern
section: patterns
order: 36
readTime: 5 min read
slug: patterns/p06-multiple-agents-same-repository
---

## Problem

Two agents in one checkout create file, branch, dependency, and generated-artifact collisions.

## Context

Independent tasks target the same repository at the same time.

## Pattern

Give every Run its own worktree and branch. Coordinate through Intent; integrate Candidates through the repository policy.

## Diagram

```text
same repo
 ├─ Run A → branch A → Candidate A ┐
 └─ Run B → branch B → Candidate B ─┴→ validation / integration
```

## Example

Run A addresses a bug while Run B upgrades dependencies. Neither edits the other’s files or branch.

## Trade-offs

Routine collisions drop sharply. Merge conflicts and semantic conflicts still exist and may be discovered only at integration.

## Failure modes

Shared external services, shared ports, or generated artifacts still collide even when Git worktrees are separate.

## Extension points

Pair worktree isolation with resource allocation and CI-based integration.

## When not to use

Avoid concurrency when the tasks have a strict sequential dependency and parallelism has no benefit.
