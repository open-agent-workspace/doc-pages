---
title: ADR-001 — Workspace Has a Git Control-Repository Root
description: The workspace is a logical system boundary with a concrete Git root for coding-agent work.
type: ADR
section: decisions
order: 51
readTime: 3 min read
slug: decisions/adr-001-workspace-represents-a-system-not-a-folder
---

## Status

Accepted

## Context

Related repositories, shared knowledge, and active Runs need a common scope.
An abstract boundary alone is difficult for a coding agent to open, discover,
and operate. The agent needs one project root while repository ownership must
remain independent.

## Decision

Define Workspace as a logical boundary around a software system and its
engineering activity, represented by a Git-managed control repository. Open
that repository as the coding-agent project root. Keep independently
Git-managed repositories under its ignored `repos/` directory, and keep the
manifest’s repository entries portable with a workspace-relative `path` and
Git `url`. Generate root `AGENTS.md` and `.agents/skills/` so the interactive
driver can discover and follow the convention.

## Alternatives considered

A monorepo, unrelated sibling checkouts, a workspace folder with no Git
history, or no shared boundary. A submodule-based control repository was also
considered, but is not the default because it couples checkout pointers to the
control history.

## Consequences

System relationships become explicit while repository histories stay
independent. A coding agent can work from one folder, and `ws repo clone`,
`ws repo add`, `ws repo sync`, and `ws generate` provide a reproducible local
lifecycle. The control repository must review generated guidance and manifest
changes, while `repos/` remains ignored.

## Trade-offs

The map needs maintenance and must not become a second source of truth for
repository behavior. URL-backed sync needs credentials and a policy for local
changes. A true root improves agent orientation but adds a small control
repository to maintain.

## Extension path

Replace local metadata with a catalog or graph while retaining the logical boundary.
