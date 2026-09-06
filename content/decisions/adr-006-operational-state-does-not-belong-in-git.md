---
title: ADR-006 — Operational State Does Not Belong in Git
description: Active leases, process IDs, and transient coordinator state live outside durable repository history.
type: ADR
section: decisions
order: 56
readTime: 2 min read
slug: decisions/adr-006-operational-state-does-not-belong-in-git
---

## Status

Accepted

## Context

Task execution state changes frequently and may contain machine-local paths,
PIDs, or secrets. It is distinct from a future Runtime Workspace manifest,
which is canonical deployed state and may be durable.

## Decision

Keep Task operational state in the control repository’s ignored
`.workspace/runtime/` directory and local state engine, separate from
Git-tracked knowledge. The managed repositories below ignored `repos/` remain
independent and must not be used as the runtime state store.

## Consequences

Repositories remain clean and portable. Task operational state needs its own
backup and recovery expectations; a future Runtime Workspace will need an
explicit revision and deployment policy.

## Extension path

SQLite is the default; a daemon, Redis, or another local state engine can replace it.
