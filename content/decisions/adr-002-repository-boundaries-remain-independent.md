---
title: ADR-002 — Repository Boundaries Remain Independent
description: A workspace does not turn related repositories into one release or history boundary.
type: ADR
section: decisions
order: 52
readTime: 3 min read
slug: decisions/adr-002-repository-boundaries-remain-independent
---

## Status

Accepted

## Context

Systems often combine repositories with different owners, release cadences, and CI pipelines.

## Decision

Keep Git history, CI, release lifecycle, and integration policy at the
repository boundary. Repositories may be physically nested below the ignored
`repos/` directory of the Git control repository, but remain independently
cloned and managed. Record each one with a workspace-relative `path` and Git
`url`; do not use submodules by default.

## Alternatives considered

Move to a monorepo or implement a multi-repo transaction layer.

## Consequences

Adoption remains incremental and repository-native. `ws repo clone` and
`ws repo sync` provide convenience without merging histories; `ws repo add`
can register an existing checkout and infer its remote URL. Cross-repository
changes need explicit coordination.

## Trade-offs

Independent boundaries preserve autonomy but make atomic system changes out of scope.

## Extension path

Add a higher-level release coordinator without changing repository ownership.
