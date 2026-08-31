---
title: ADR-016 — Mechanisms Over Mandatory Policies
description: Provide useful primitives and boundaries without prescribing one team’s complete operating policy.
type: ADR
section: decisions
order: 66
readTime: 2 min read
slug: decisions/adr-016-mechanisms-over-mandatory-policies
---

## Status

Accepted

## Context

Teams have different review, scheduling, security, and deployment requirements.

## Decision

Expose mechanisms such as isolation, Intent, resource allocation, and Candidates. Let teams compose their own policies around them.

## Consequences

Adoption is flexible, but documentation must be clear about which guarantees are absent by default.
