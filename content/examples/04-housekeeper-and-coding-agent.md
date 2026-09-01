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
             workspace-root driver + generated skills
                    shared workspace context
                   /                         \
coding Run → feature Candidate       housekeeper Run → report/Candidate
     worktree + resources                 worktree + resources
                   \                         /
                     separate integration policy
```

The control repository is the one folder opened by the interactive driver.
Coding and housekeeping Runs work in isolated worktrees of independently
managed repositories below `repos/`; neither Run edits the driver checkout.

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
ws generate
ws run coder "Implement the feature" --repo api-service --no-integrate
ws run housekeeper "Audit stale worktrees and dependencies" \
  --repo api-service --no-integrate
ws status
```

An external scheduler can invoke the housekeeper command from the workspace
root. The generated `AGENTS.md` and `.agents/skills/` remain durable control
repository guidance; runtime leases and worktrees remain disposable.

## Trade-offs

Maintenance becomes continuous and restartable. It needs idempotent checks, ownership-aware cleanup, and a policy for whether housekeeping Candidates can merge automatically.
