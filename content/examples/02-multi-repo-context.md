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
client contract ─┐
deployment notes ─┼─read→ Run →write→ api-service Candidate
api source ───────┘
```

## Workspace config

```yaml
repositories:
  - name: web-client
    access: read
  - name: api-service
    access: read-write
  - name: infra
    access: read
```

## Expected lifecycle

The Run inspects the client and infrastructure contracts, publishes Intent for `api-service`, changes only that repository, and returns one Candidate.

## Example commands

```sh
workspace context add web-client --read-only
workspace context add infra --read-only
workspace run create --write api-service
```

## Trade-offs

The agent gains system understanding without creating a multi-repository transaction. Contracts can drift and may require follow-up Candidates.
