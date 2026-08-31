---
title: P05 — Private Plan / Public Intent
description: Share the coordination surface other Runs need without exposing every implementation detail.
type: Pattern
section: patterns
order: 35
readTime: 4 min read
slug: patterns/p05-private-plan-public-intent
---

## Problem

Full plans are noisy and may change rapidly, but zero visibility makes collisions more likely.

## Context

Concurrent Runs need to know what areas or resources another Run expects to touch.

## Pattern

Keep the detailed plan private. Publish a small Intent containing objective, target, expected files or resources, and conflict hints.

## Diagram

```text
private plan ──derives──→ public Intent ──helps──→ other Runs
```

## Example

```yaml
intent:
  objective: update auth token refresh
  write_scope: api/auth
  resources: [api-test-port]
  status: active
```

## Trade-offs

This reduces coordination noise and protects flexibility. It cannot guarantee semantic compatibility or replace review.

## Failure modes

Intent is too vague to be useful, or becomes a second detailed plan that is expensive to keep current.

## Extension points

Add conflict hints, ownership labels, resource claims, or a coordinator query API.

## When not to use

For a solitary Run, publishing Intent may add more ceremony than value.
