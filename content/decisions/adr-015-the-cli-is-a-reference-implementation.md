---
title: ADR-015 — The CLI Is a Reference Implementation
description: The reference CLI demonstrates the patterns but does not define their specification.
type: ADR
section: decisions
order: 65
readTime: 2 min read
slug: decisions/adr-015-the-cli-is-a-reference-implementation
---

## Status

Accepted

## Context

Users need a concrete implementation while the architecture must remain open to alternatives.

## Decision

Document the CLI as one reference mapping from patterns to primitives,
including the Git control-repository convention (`ws init`, URL-backed
`repo clone`/`repo sync`, local `repo add`, and `ws generate`), not as the only
correct implementation. Alternative tooling should preserve the same
driver-versus-bounded-Run and independent-repository boundaries.

## Consequences

Docker, another agent provider, a daemon, or a different knowledge store can remain compatible with the patterns.
