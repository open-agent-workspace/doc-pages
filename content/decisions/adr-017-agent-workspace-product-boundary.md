---
title: ADR-017 — Agent Workspace Product Boundary
description: Keep Agent Workspace focused on independent-repository understanding, bounded execution, results, and lineage.
type: ADR
section: decisions
order: 67
readTime: 5 min read
slug: decisions/adr-017-agent-workspace-product-boundary
---

## Status

Accepted

## Context

Earlier ADRs established a Git control repository, independent repository
boundaries, isolated Runs, Candidates, and optional knowledge promotion. The
four-scope vocabulary introduced later is useful across an ecosystem, but it
can be misread as a requirement for `ws` to own planning, scheduling, loops,
or deployed runtime state.

The product’s durable problem is narrower: agents need to understand and work
across independent repositories with shared context while keeping mutation
scope explicit and execution disposable.

## Decision

Agent Workspace owns:

- repository and declared shared-context discovery;
- context composition and selected-only materialization;
- bounded Task execution and write limits;
- Run, Candidate, result, and lineage records.

A **Task** is durable intent supplied by a caller. A **Run** is one bounded
attempt. A **Candidate** is the reviewable result. The Task Workspace is the
disposable execution environment for that attempt.

The System Workspace, Workstream, Task Workspace, and Runtime Workspace remain
ecosystem scopes with explicit ownership. A declaration-only System registry
is optional. Planner goals, prioritisation, schedules, retries, budgets, and
loop definitions remain caller-owned. PM2, Docker Compose, Git/FS, LocalLink,
or another runtime owner owns deployed state and lifecycle.

## Consequences

The product can be used directly from a user objective without prescribing a
repository list, while preserving the current one-mutated-repository-per-Run
default. Multi-repository understanding is core; a future multi-Candidate
flow still does not imply an atomic multi-repository transaction.

The current `discover` capability is membership filtering over declared
relationships, not semantic discovery. Richer on-demand context resolution is
an interface proposal that must be versioned and tested before being described
as implemented.

Earlier ADRs remain historical decisions. Where “workspace” was used as a
catch-all term, read it through the four-scope vocabulary and this product
boundary; do not silently expand `ws` ownership.

## Rejected expansion

Do not create a competing Planner/scheduler or absorb an existing orchestrator
without a compatibility assessment. Do not create `system-workspace` or
`agent-orchestration` repositories now; evaluate them only at the gates in the
implementation plan. Do not duplicate runtime configuration owned by LocalLink
or another deployed-state system.
