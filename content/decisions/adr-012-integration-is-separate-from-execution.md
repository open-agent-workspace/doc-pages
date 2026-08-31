---
title: ADR-012 — Integration Is Separate From Execution
description: Validation and promotion are separate from the Run that produced a Candidate.
type: ADR
section: decisions
order: 62
readTime: 2 min read
slug: decisions/adr-012-integration-is-separate-from-execution
---

## Status

Accepted

## Context

Repository policy, CI, and human review must remain meaningful when agents write changes.

## Decision

Keep integration as a separate process that can rebase, validate, review, and merge.

## Consequences

The handoff introduces latency but preserves accountability and extension options.
