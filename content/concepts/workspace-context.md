---
title: Workspace Context
description: Shared durable knowledge that helps Runs make consistent engineering decisions.
type: Concept
section: concepts
order: 24
readTime: 3 min read
slug: concepts/workspace-context
---

## Definition

Workspace Context is the durable, shared material that Runs can read: policies,
coding standards, architectural context, repository relationships, and reusable
skills. It is part of the System Workspace when it describes architecture, and
may be supplied by a caller-owned Workstream when it describes Task intent.
In the coding-agent workspace convention, the control repository keeps the
first category in `.workspace/context/`, with generated root `AGENTS.md` and
workspace skills under `.agents/skills/` providing the driver agent’s entry
point.

## Why it exists

Without durable context, every Run rediscovers the same constraints and
decisions. Context turns repeated work into cumulative engineering knowledge,
and a root guide lets an interactive coding agent discover that knowledge from
the workspace project root.

## Driver versus Run context

The interactive driver reads the generated `AGENTS.md` and `.agents/skills/`
from the control repository. A bounded `ws run` receives the selected context
repositories and workspace context needed for one mutation, but does not write
back to the control repository or context-only checkouts. The current
`ws discover` capability filters declared membership; a caller may later add a
semantic/on-demand resolver, but that is not a current command or promise.

## Shared or private?

System context is shared and reviewable. A Run’s unverified discovery is
private until it becomes a Knowledge Proposal and is promoted by the owning
caller or System Workspace policy.

## Default implementation

Markdown and structured files tracked in the control repository are the
reference implementation. `ws generate` derives `AGENTS.md` and
`.agents/skills/` from the manifest and context. SQLite, a knowledge graph, or
an external knowledge base can serve the same purpose, provided the driver and
Run boundaries remain explicit.

## Trade-offs

Git-tracked context is portable and diffable, but promotion requires judgment and stale knowledge needs maintenance.
