---
title: ADR-003 — Context Scope May Exceed Mutation Scope
description: Runs can read the system context they need while keeping their write boundary narrow.
type: ADR
section: decisions
order: 53
readTime: 3 min read
slug: decisions/adr-003-context-scope-may-exceed-mutation-scope
---

## Status

Accepted

## Context

Understanding a change may require related repositories, but editing them all creates unnecessary coupling.

## Decision

Support Read Many / Write One as a first-class pattern. A Run must declare or otherwise make its mutation scope explicit.

## Alternatives considered

Clone and edit the entire system or limit every Run to one repository’s local context.

## Consequences

Agents can reason across boundaries while Candidates remain reviewable.

## Trade-offs

Read context can drift, and multi-repository changes still need multiple Candidates.
