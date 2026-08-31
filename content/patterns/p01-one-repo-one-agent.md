---
title: P01 — One Repo / One Agent
description: One bounded Run works against one repository and returns one explicit result.
type: Pattern
section: patterns
order: 31
readTime: 4 min read
slug: patterns/p01-one-repo-one-agent
---

## Problem

An agent needs a clear unit of work and a clear handoff. An unbounded process with implicit ownership is difficult to validate or stop.

## Context

Use this for a small coding task with one repository and no need for concurrent mutation.

## Pattern

Create one Run, give it one objective and one mutation scope, then validate its Candidate before integration.

## Diagram

```text
request → Run → isolated checkout → validate → Candidate → integrate
```

## Example

```text
profile: interactive-coder
target: api-service
objective: add request ID middleware
result: commit + test evidence
```

## Trade-offs

This is easy to reason about and cheap to operate. It does not solve cross-repository context, concurrency, runtime collisions, or scheduled maintenance.

## Failure modes

The Run grows beyond its stated objective, edits the canonical checkout, or reports success without validation evidence.

## Extension points

Swap the Agent Provider, execution provider, or integration policy without changing the Run boundary.

## When not to use

Do not add a workspace coordinator just to run a single, short, human-supervised command.
