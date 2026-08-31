---
title: ADR-011 — Agents Produce Candidates
description: Agent output is proposed work, not automatically canonical history.
type: ADR
section: decisions
order: 61
readTime: 2 min read
slug: decisions/adr-011-agents-produce-candidates
---

## Status

Accepted

## Context

Production and publication have different validation and authority requirements.

## Decision

Every mutating Run ends with a Candidate and evidence suitable for validation or review.

## Consequences

Integration remains a deliberate, replaceable lifecycle.
