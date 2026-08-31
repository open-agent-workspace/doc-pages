---
title: Example 01 — Single Repo / Single Agent
description: The smallest complete lifecycle for a focused coding task.
type: Example
section: examples
order: 101
readTime: 4 min read
slug: examples/01-single-repo-single-agent
---

## Architecture

```text
human → Run → worktree → tests → Candidate → human integrates
```

## Workspace config

```yaml
workspace: checkout-lab
repository: api-service
profile: interactive-coder
write_scope: api-service
```

## Expected lifecycle

1. Create a Run with a narrow objective.
2. Create a worktree and branch.
3. Let the agent implement and validate.
4. Review the Candidate and integrate it.

## Example commands

```sh
git worktree add .runs/run-001 -b run/001 main
agent run --cwd .runs/run-001 --task "add request IDs"
git -C .runs/run-001 diff --check
```

## Trade-offs

This is easy to understand and operate. It leaves concurrency, shared resources, and system context for later patterns.
