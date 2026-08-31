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

Runtime state changes frequently and may contain machine-local paths, PIDs, or secrets.

## Decision

Keep operational state in a local state engine or coordinator, separate from Git-tracked knowledge.

## Consequences

Repositories remain clean and portable. Operational state needs its own backup and recovery expectations.

## Extension path

SQLite is the default; a daemon, Redis, or another local state engine can replace it.
