---
title: ADR-001 — Workspace Represents a System, Not a Folder
description: The workspace is a logical system boundary that may span independent locations and repositories.
type: ADR
section: decisions
order: 51
readTime: 3 min read
slug: decisions/adr-001-workspace-represents-a-system-not-a-folder
---

## Status

Accepted

## Context

Related repositories, shared knowledge, and active Runs need a common scope, but a filesystem folder is too narrow and too implementation-specific.

## Decision

Define Workspace as a logical boundary around a software system and its engineering activity. It may be represented by files, a database, or a service.

## Alternatives considered

A monorepo, a single project folder, or no shared boundary.

## Consequences

System relationships become explicit while repository histories stay independent.

## Trade-offs

The map needs maintenance and must not become a second source of truth for repository behavior.

## Extension path

Replace local metadata with a catalog or graph while retaining the logical boundary.
