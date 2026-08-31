---
title: ADR-010 — Coordination Intent Is Shared
description: Runs expose a minimal coordination record describing objective and expected scope.
type: ADR
section: decisions
order: 60
readTime: 2 min read
slug: decisions/adr-010-coordination-intent-is-shared
---

## Status

Accepted

## Context

Concurrent Runs need enough awareness to reduce routine collisions.

## Decision

Share Intent containing objective, target, expected scope, and relevant resource hints.

## Consequences

Coordination improves without turning Intent into a lock or full plan.
