---
title: P03 — Read Many / Write One
description: Let a Run understand the wider system while keeping its mutation scope explicit.
type: Pattern
section: patterns
order: 33
readTime: 5 min read
slug: patterns/p03-read-many-write-one
---

## Problem

A repository-local change may depend on contracts, schemas, or deployment behavior in sibling repositories. Copying everything into one mutation scope creates unnecessary coupling.

## Context

Use when system understanding crosses repository boundaries but the Candidate
belongs primarily to one repository. The workspace root provides one driver
context while the managed checkouts remain below ignored `repos/`.

## Pattern

Declare many repositories as selected context and one repository as the write
target. Context expansion must never expand the write permissions.

## Diagram

```text
read:  web-app ─┐
       platform ─┼──→ Run → write: api-service → Candidate
       infra ────┘
```

## Example

An agent changing an API handler can read the client contract and infrastructure
health checks, but only creates a Candidate in `api-service`:

```sh
ws run coder "Align the API handler with the client contract" \
  --repo api-service \
  --context-repo web-client --context-repo infra --no-integrate
```

The repository entries carry workspace-relative paths and Git URLs so the
driver can clone or sync context explicitly.

## Trade-offs

This preserves independent repository boundaries while improving decisions. Read context can become stale, and the final change may still need coordinated Candidates elsewhere.

## Failure modes

The Run accidentally edits a context repository, or the context list is so
broad that the task becomes unfocused. Current context-only worktrees are
checked after execution rather than enforceably read-only filesystem mounts.

## Extension points

Use repository relationship metadata, read-only mounts, sparse checkouts, or a remote code index.

## When not to use

If the task is genuinely local, keep context and setup small.
