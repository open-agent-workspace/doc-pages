---
title: ADR-004 — Git Worktree Is the Default Run Isolation
description: Git worktrees are the lightweight reference implementation for separate Run mutation surfaces.
type: ADR
section: decisions
order: 54
readTime: 3 min read
slug: decisions/adr-004-git-worktree-is-the-default-run-isolation
---

## Status

Accepted

## Context

Concurrent Runs need independent checkouts without requiring a heavyweight sandbox.

## Decision

Use a Git worktree and branch per Run as the default execution provider.

## Alternatives considered

Docker, devcontainers, VMs, Nix, or shared canonical checkout.

## Consequences

The default is fast, Git-native, and easy to inspect. Providers can be swapped when stronger isolation is required.

## Trade-offs

Worktrees are not security isolation and do not isolate ports, processes, or external services.
