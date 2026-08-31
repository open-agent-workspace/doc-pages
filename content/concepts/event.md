---
title: Event
description: Durable provenance or engineering history selected for future use.
type: Concept
section: concepts
order: 27
readTime: 3 min read
slug: concepts/event
---

## Definition

An Event records something that happened or was decided: a Run completed, a Candidate was rejected, a resource was allocated, or a decision was promoted.

## Why it exists

Events provide provenance without requiring the workspace to retain every runtime detail forever.

## Durable or runtime?

Operational telemetry is runtime by default. Only selected Events with future engineering value should be promoted to durable history.

See [Durable Knowledge Promotion](../patterns/p09-durable-knowledge-promotion) and [ADR-008](../decisions/adr-008-do-not-store-full-agent-telemetry-permanently).
