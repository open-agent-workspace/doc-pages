---
title: P09 — Durable Knowledge Promotion
description: Promote useful discoveries and decisions; let transient runtime noise expire.
type: Pattern
section: patterns
order: 39
readTime: 5 min read
slug: patterns/p09-durable-knowledge-promotion
---

## Problem

Keeping every log, trace, and intermediate artifact forever creates noise and cost. Keeping nothing makes future Runs repeat mistakes.

## Context

Runs discover constraints, make decisions, and produce evidence of varying
long-term value. Durable workspace knowledge belongs in the Git control
repository, alongside the manifest and generated driver guidance; runtime
logs and nested repository checkouts do not.

## Pattern

Classify outputs. Promote durable knowledge, provenance, and decisions into reviewed workspace context; retain telemetry only for its operational lifetime.

Promotion has an intentional ladder rather than one undifferentiated memory:

```text
Task observation
      ↓ review
Workstream learning
      ↓ repeated evidence
System pattern
      ↓ adopted preference
System convention / policy
      ↓ explicit scope
Global preference
```

An observation should not become a policy merely because one Run recorded it.
Keep the source Task, Workstream, Run, and review decision attached to every
promotion so later agents can understand provenance and correct stale guidance.

## Diagram

```text
Run output → classify → durable knowledge / Event
                    └→ transient telemetry → expire
```

## Example

A Run discovers that a service must start before contract tests. Promote that
constraint to `.workspace/context/policies.md` or an example, then run
`ws generate` if the driver guidance or a workspace skill should change; do not
commit the full process log.

## Trade-offs

Promotion keeps the knowledge base useful and portable. It requires judgment,
scope-aware storage, provenance, and a path for correcting stale decisions.

## Failure modes

Everything is promoted, nothing is promoted, or a discovery becomes “truth” without review.

## Extension points

Markdown pull requests, structured events, SQLite, a knowledge graph, or an external KB.

## When not to use

Do not create durable records for disposable debugging noise.
