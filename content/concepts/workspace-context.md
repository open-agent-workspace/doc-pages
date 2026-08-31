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

Workspace Context is the durable, shared material that Runs can read: policies, coding standards, architectural context, repository relationships, and reusable skills.

## Why it exists

Without durable context, every Run rediscovers the same constraints and decisions. Context turns repeated work into cumulative engineering knowledge.

## Shared or private?

Context is shared and reviewable. A Run’s unverified discovery is private until it becomes a Knowledge Proposal and is promoted.

## Default implementation

Markdown and structured files tracked in Git are the reference implementation. SQLite, a knowledge graph, or an external knowledge base can serve the same purpose.

## Trade-offs

Git-tracked context is portable and diffable, but promotion requires judgment and stale knowledge needs maintenance.
