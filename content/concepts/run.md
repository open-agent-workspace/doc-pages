---
title: Run
description: One bounded execution of an Agent Profile against an explicit scope.
type: Concept
section: concepts
order: 23
readTime: 4 min read
slug: concepts/run
---

## Definition

A Run is a bounded agent execution inside a Task Workspace, with an objective,
Agent Profile, selected context, execution provider, lifecycle, and result.

## Why it exists

Boundaries make agent work observable, repeatable, interruptible, and safe to schedule. A Run can fail or expire without making the whole workspace unusable.

## Lifecycle

```text
queued → starting → active → validating → candidate
                       ├→ failed
                       └→ cancelled
```

## Shared or private?

The Run’s status and Intent are shared. Its detailed plan and transient scratch state are private by default.

## Durable or runtime?

The Run record and selected Events may be durable. Full telemetry, logs, and every intermediate thought do not need permanent storage.

## Default implementation

The reference CLI uses an isolated Git worktree, selected repository context,
and a command adapter for the agent provider. It does not yet create a full
Task Workspace from a System/Layer/Resource catalog.

## Trade-offs

Bounded Runs add lifecycle bookkeeping. In return, they make concurrency and repeated scheduled roles composable.
