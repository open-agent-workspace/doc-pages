---
title: ADR-005 — Worktree Isolation Is Not Security Isolation
description: Filesystem separation in the normal workflow is not a hard security boundary.
type: ADR
section: decisions
order: 55
readTime: 2 min read
slug: decisions/adr-005-worktree-isolation-is-not-security-isolation
---

## Status

Accepted

## Context

Worktrees reduce accidental interference but share a machine, credentials, kernel, and repository object store.

## Decision

Document worktree isolation as workflow isolation only. Use a stronger execution provider for adversarial or sensitive workloads.

## Alternatives considered

Treating a worktree as a sandbox.

## Consequences

Security requirements stay visible instead of being implied by the default.

## Extension path

Use containers, VMs, permissions boundaries, or remote workers.
