---
title: P02 — Agent Worktree Isolation
description: Keep every active Run out of the human or canonical checkout.
type: Pattern
section: patterns
order: 32
readTime: 5 min read
slug: patterns/p02-agent-worktree-isolation
---

## Problem

An agent can overwrite human changes, leave generated files behind, or make it unclear which process owns a checkout.

## Context

Multiple active Runs or a human working alongside an agent require separate mutation surfaces.

## Pattern

Create an isolated Git worktree per Run. The Run owns its branch, working directory, and cleanup lifecycle.

## Diagram

```text
canonical checkout (human / integration)
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
   Run A    Run B    Run C
  worktree worktree worktree
```

## Example

```text
git worktree add .runs/run-a -b run/run-a main
agent --cwd .runs/run-a
git worktree remove .runs/run-a
```

## Trade-offs

Worktrees are lightweight and Git-native. They share the underlying repository object store and are not security sandboxes.

## Failure modes

Stale worktrees accumulate, two Runs reuse a branch, or a process continues running after its worktree is removed.

## Extension points

Docker, devcontainers, VMs, Nix environments, and custom sandboxes can implement stronger execution isolation.

## When not to use

For a read-only analysis Run, a separate worktree may be unnecessary if no local mutation occurs.
