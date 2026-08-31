---
title: Workspace
description: A logical boundary around the system context an engineering team and its agents share.
type: Concept
section: concepts
order: 21
readTime: 4 min read
slug: concepts/workspace
---

## Definition

A Workspace groups related repositories, shared engineering knowledge, policies, skills, agent Runs, and runtime resources.

## Why it exists

The system an agent needs to understand can be larger than the repository it is allowed to modify. A workspace gives that context a durable name and a place for relationships to live.

## Lifecycle

A workspace is created, repositories and policies are registered, Runs execute within it, and durable knowledge is promoted back into it. It can outlive any particular Run.

## Shared or private?

The workspace boundary is shared. Individual plans, temporary files, and transient telemetry can remain private to a Run.

## Durable or runtime?

Relationships, policies, and promoted knowledge are durable. Processes, allocated ports, and active Run state are runtime concerns.

## Default implementation

The reference CLI represents a workspace with local structured files and SQLite-backed operational state. Neither choice defines the concept.

## Trade-offs

The boundary improves orientation and reuse, but introduces metadata to maintain. Avoid creating a workspace abstraction for a one-off script that has no shared context.

## Related concepts

[Repository](repository), [Workspace Context](workspace-context), [Run](run), and [Resource](resource).
