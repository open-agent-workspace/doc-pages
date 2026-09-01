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
workspace-root driver → ws run → repo worktree → tests → Candidate → integrate
```

The workspace root is a Git control repository. The managed repository remains
an independent checkout below the ignored `repos/` directory.

## Workspace config

```yaml
workspace: checkout-lab
repository: api-service
profile: interactive-coder
write_scope: api-service

repositories:
  - name: api-service
    path: repos/api-service
    url: https://github.com/example/api-service.git
    role: primary
```

## Expected lifecycle

1. Create a Run with a narrow objective.
2. Create a worktree and branch.
3. Let the agent implement and validate.
4. Review the Candidate and integrate it.

## Example commands

```sh
ws init
ws repo clone https://github.com/example/api-service.git \
  --name api-service --role primary --path repos/api-service
ws generate
ws run coder "Add request IDs" --repo api-service --no-integrate
```

The interactive agent runs from the workspace root and uses generated
`AGENTS.md`/`.agents/skills/`; the bounded task agent runs in the isolated
worktree and returns a Candidate.

## Trade-offs

This is easy to understand and operate. It leaves concurrency, shared resources, and system context for later patterns.
