---
title: P12 — Concurrent Coding + Housekeeping
description: Let different engineering roles share durable knowledge while keeping execution environments isolated.
type: Pattern
section: patterns
order: 42
readTime: 5 min read
slug: patterns/p12-concurrent-coding-housekeeping
---

## Problem

Product work and maintenance happen together, but maintenance must not disturb active coding Runs.

## Context

Interactive coders, dependency maintainers, and resource housekeepers operate
in the same Git control-repository workspace. The interactive driver stays at
the root while every role receives its own bounded Run and managed-repository
worktree.

## Pattern

Share workspace context and coordination signals. Give each role a separate Run, worktree, resource set, and Candidate lifecycle.

## Diagram

```text
                 shared durable context
                 /                  \
interactive Run /                    \ housekeeper Run
 isolated env /                      \ isolated env
       Candidate ───── integration ─── Candidate
```

## Example

The coding agent changes a feature in one worktree while the housekeeper audits
stale resources in another. Both publish evidence; neither edits the control
repository, the other Run’s checkout, or a context-only repository.

## Trade-offs

Maintenance becomes continuous without blocking product work. Shared context and runtime resources still need explicit ownership.

## Failure modes

The housekeeper treats active resources as stale, or a maintenance Candidate changes assumptions the coding Run relied on.

## Extension points

Add priority queues, resource leases, integration windows, or stronger sandbox providers.

## When not to use

Do not run housekeeping concurrently when the repository is undergoing a migration that makes all other work unsafe.
