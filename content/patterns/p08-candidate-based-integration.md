---
title: P08 — Candidate-Based Integration
description: A Run proposes a result; a separate integration step decides whether it enters canonical history.
type: Pattern
section: patterns
order: 38
readTime: 4 min read
slug: patterns/p08-candidate-based-integration
---

## Problem

An agent that writes code should not automatically become the authority that publishes it.

## Context

Candidates need validation, review, compatibility checks, or repository-specific
policy. The workspace-root driver performs that handoff; the control repository
itself is not the mutation target unless the task explicitly changes workspace
configuration.

## Pattern

End a Run with a Candidate and evidence. Perform validation and integration as a separate lifecycle.

## Diagram

```text
Run → Candidate + evidence → validate → review/policy → canonical history
```

## Example

The reference flow is `ws inspect <candidate-id>`, rebase, run tests, and
`ws integrate <candidate-id>`. A pull request workflow is equally valid. For a
multi-repository change, create and integrate one Candidate per independent
repository.

## Trade-offs

The handoff adds latency but creates a deliberate safety and accountability boundary.

## Failure modes

Candidates lack evidence, integration skips repository policy, or stale Candidates are merged without rebasing.

## Extension points

Human review, CI gates, policy-as-code, or a promotion service.

## When not to use

Temporary exploratory changes that will be discarded do not need a promotion path.
