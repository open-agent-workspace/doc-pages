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
                 api-service
                /           \
feature Run / worktree   bug Run / worktree
       ↓ Candidate A       ↓ Candidate B
                \         /
                 validation + integration
```

## Workspace config

```yaml
runs:
  - id: feature-12
    write_scope: api-service
  - id: bug-44
    write_scope: api-service
```

## Expected lifecycle

Both Runs publish Intent, use different branches and worktrees, validate independently, and hand off Candidates. Integration rebases each Candidate against current canonical history.

## Example commands

```sh
git worktree add .runs/feature-12 -b run/feature-12 main
git worktree add .runs/bug-44 -b run/bug-44 main
```

## Trade-offs

Wall-clock time improves, but merge and semantic conflicts remain possible. Add [Runtime Resource Isolation](../patterns/p07-runtime-resource-isolation) when either Run starts local services.
