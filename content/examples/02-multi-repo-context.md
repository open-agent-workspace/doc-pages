---
title: Example 02 — Multi-Repo Context
description: Read a client contract and deployment repository while changing only the API service.
type: Example
section: examples
order: 102
readTime: 4 min read
slug: examples/02-multi-repo-context
---

## Architecture

```text
workspace-root driver
        │
        ├─ repos/web-client   ─┐
        ├─ repos/infra        ─┼─read→ bounded Run →write→ repos/api-service Candidate
        └─ repos/api-service ──┘
```

All three checkouts are independently Git-managed and ignored by the control
repository’s `repos/` entry. The manifest records each checkout’s path and Git
URL.

## Workspace config

```yaml
repositories:
  - name: web-client
    path: repos/web-client
    url: https://github.com/example/web-client.git
    access: read
  - name: api-service
    path: repos/api-service
    url: https://github.com/example/api-service.git
    access: read-write
  - name: infra
    path: repos/infra
    url: https://github.com/example/infra.git
    access: read
```

## Expected lifecycle

The Run inspects the client and infrastructure contracts, publishes Intent for `api-service`, changes only that repository, and returns one Candidate.

## Example commands

```sh
ws init
ws repo clone https://github.com/example/web-client.git \
  --name web-client --role secondary --path repos/web-client
ws repo clone https://github.com/example/infra.git \
  --name infra --role secondary --path repos/infra
ws repo clone https://github.com/example/api-service.git \
  --name api-service --role primary --path repos/api-service
ws generate
ws run coder "Update the API contract" --repo api-service \
  --context-repo web-client --context-repo infra --no-integrate
```

If a checkout already exists, use `ws repo add <path> [--url <git-url>]`.
Use `ws repo sync [name]` later to materialize a missing URL-backed checkout;
an existing checkout is deliberately left unchanged.

## Trade-offs

The agent gains system understanding without creating a multi-repository transaction. Contracts can drift and may require follow-up Candidates.
