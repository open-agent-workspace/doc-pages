---
title: ADR-014 — Multi-Repo Atomic Integration Is Out of Scope
description: Independent repositories keep independent histories; the reference architecture does not provide a distributed transaction.
type: ADR
section: decisions
order: 64
readTime: 2 min read
slug: decisions/adr-014-multi-repo-atomic-integration-is-out-of-scope
---

## Status

Accepted

## Context

Related repositories may need coordinated changes, but atomic multi-repo commits are expensive and implementation-specific.

## Decision

Produce separate Candidates and use an explicit orchestration or release
process when multiple repositories must move together. Nesting independent
checkouts under an ignored `repos/` directory improves discoverability but
does not change this boundary; submodules are not used as an implicit atomic
integration mechanism.

## Consequences

The core remains simple and portable. Cross-repository promotion can require additional tooling.
