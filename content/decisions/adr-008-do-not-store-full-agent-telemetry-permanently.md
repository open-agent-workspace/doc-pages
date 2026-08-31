---
title: ADR-008 — Do Not Store Full Agent Telemetry Permanently
description: Runtime logs and traces expire unless they carry durable engineering value.
type: ADR
section: decisions
order: 58
readTime: 2 min read
slug: decisions/adr-008-do-not-store-full-agent-telemetry-permanently
---

## Status

Accepted

## Context

Full telemetry is noisy, costly, and may expose sensitive implementation detail.

## Decision

Retain operational telemetry for its useful lifetime. Promote selected provenance, decisions, and findings into durable Events or knowledge.

## Consequences

The durable record stays useful, but promotion needs a clear review path.
