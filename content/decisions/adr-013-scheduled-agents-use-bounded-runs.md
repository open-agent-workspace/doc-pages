---
title: ADR-013 — Scheduled Agents Use Bounded Runs
description: Scheduled engineering roles repeat the Run lifecycle instead of holding an immortal session.
type: ADR
section: decisions
order: 63
readTime: 2 min read
slug: decisions/adr-013-scheduled-agents-use-bounded-runs
---

## Status

Accepted

## Context

Maintenance needs continuity but long-lived processes are hard to recover and clean up.

## Decision

Schedules create bounded Runs. Checkpoints and durable context carry continuity between Runs.

## Consequences

Recovery and observability improve; checkpoints need maintenance.
