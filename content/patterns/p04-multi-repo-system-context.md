---
title: P04 — Multi-Repo System Context
description: Model a software system across independent repositories without forcing a monorepo.
type: Pattern
section: patterns
order: 34
readTime: 5 min read
slug: patterns/p04-multi-repo-system-context
---

## Problem

Related repositories are often treated as unrelated projects, so agents and humans repeatedly reconstruct their relationships.

## Context

A workspace contains services, infrastructure, clients, documentation, or tools that evolve together but retain separate histories.

## Pattern

Record repository roles and relationships in shared workspace context. Keep each repository’s lifecycle independent.

## Diagram

```text
workspace system map
 ├─ client ──calls──→ api
 ├─ api ──deploys──→ infra
 └─ docs ──explains──→ all
```

## Example

```yaml
repositories:
  - name: api
    role: service
  - name: infra
    role: deployment
    relates_to: [api]
```

## Trade-offs

System context improves orientation and discovery. Relationships need owners and can drift from reality.

## Failure modes

The map becomes a second stale source of truth or implies an atomic release process that does not exist.

## Extension points

Use a manifest, graph, catalog service, or generated dependency map.

## When not to use

Do not model relationships that are not useful to engineering decisions.
