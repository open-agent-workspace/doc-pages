---
title: Example 04 — Housekeeper + Coding Agent
description: Scheduled maintenance and interactive feature work share context while retaining separate execution environments.
type: Example
section: examples
order: 104
readTime: 5 min read
slug: examples/04-housekeeper-and-coding-agent
---

## Architecture

```text
                    shared workspace context
                   /                         \
coding Run → feature Candidate       housekeeper Run → report/Candidate
     worktree + resources                 worktree + resources
                   \                         /
                     separate integration policy
```

## Workspace config

```yaml
profiles:
  - name: interactive-coder
  - name: housekeeper
    schedule: "0 3 * * 0"
    checkpoint: .workspace/checkpoints/housekeeper.md
```

## Expected lifecycle

The coding Run changes a feature. The scheduled Run inspects stale worktrees and dependencies in a separate environment, then reports or proposes a Candidate. Neither Run assumes the other’s resources are disposable.

## Example commands

```sh
workspace run create --profile interactive-coder --write api-service
workspace schedule run --profile housekeeper --once
workspace resource list --owned-by housekeeper
```

## Trade-offs

Maintenance becomes continuous and restartable. It needs idempotent checks, ownership-aware cleanup, and a policy for whether housekeeping Candidates can merge automatically.
