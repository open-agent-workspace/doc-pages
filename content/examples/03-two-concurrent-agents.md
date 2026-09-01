---
title: Example 03 — Two Concurrent Agents
description: A feature Run and a bug-fix Run work on one repository without sharing a checkout.
type: Example
section: examples
order: 103
readTime: 4 min read
slug: examples/03-two-concurrent-agents
---

## Architecture

```text
      workspace-root driver
               │
           repos/api-service
                /           \
feature Run / worktree   bug Run / worktree
       ↓ Candidate A       ↓ Candidate B
                \         /
                 validation + integration
```

The driver coordinates from the control repository root. Both bounded Runs
target the same independent nested repository, but each receives its own Git
worktree and branch.

## Workspace config

```yaml
runs:
  - id: feature-12
    write_scope: api-service
    repository_path: repos/api-service
  - id: bug-44
    write_scope: api-service
    repository_path: repos/api-service
```

## Expected lifecycle

Both Runs publish Intent, use different branches and worktrees, validate independently, and hand off Candidates. Integration rebases each Candidate against current canonical history.

## Example commands

```sh
ws run coder "Implement feature 12" --repo api-service --no-integrate &
ws run coder "Fix bug 44" --repo api-service --no-integrate &
wait
ws runs
ws inspect <candidate-a-or-run-id>
ws inspect <candidate-b-or-run-id>
```

## Trade-offs

Wall-clock time improves, but merge and semantic conflicts remain possible. Add [Runtime Resource Isolation](../patterns/p07-runtime-resource-isolation) when either Run starts local services.
