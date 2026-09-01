---
title: Architecture Decisions
description: The decisions behind the open workspace patterns, including what the reference implementation deliberately does not promise.
type: ADR index
section: decisions
order: 50
readTime: 8 min read
slug: decisions
---

## Why publish decisions?

Patterns are easier to reuse when their boundaries are visible. These ADRs record the reasoning behind the default architecture and make replacement paths explicit.

## Decision catalogue

- [ADR-001 — Workspace Has a Git Control-Repository Root](adr-001-workspace-represents-a-system-not-a-folder)
- [ADR-002 — Repository Boundaries Remain Independent](adr-002-repository-boundaries-remain-independent)
- [ADR-003 — Context Scope May Exceed Mutation Scope](adr-003-context-scope-may-exceed-mutation-scope)
- [ADR-004 — Git Worktree Is the Default Run Isolation](adr-004-git-worktree-is-the-default-run-isolation)
- [ADR-005 — Worktree Isolation Is Not Security Isolation](adr-005-worktree-isolation-is-not-security-isolation)
- [ADR-006 — Operational State Does Not Belong in Git](adr-006-operational-state-does-not-belong-in-git)
- [ADR-007 — Durable Engineering History May Be Stored in Git](adr-007-durable-engineering-history-may-be-stored-in-git)
- [ADR-008 — Do Not Store Full Agent Telemetry Permanently](adr-008-do-not-store-full-agent-telemetry-permanently)
- [ADR-009 — Agent Plans Are Private by Default](adr-009-agent-plans-are-private-by-default)
- [ADR-010 — Coordination Intent Is Shared](adr-010-coordination-intent-is-shared)
- [ADR-011 — Agents Produce Candidates](adr-011-agents-produce-candidates)
- [ADR-012 — Integration Is Separate From Execution](adr-012-integration-is-separate-from-execution)
- [ADR-013 — Scheduled Agents Use Bounded Runs](adr-013-scheduled-agents-use-bounded-runs)
- [ADR-014 — Multi-Repo Atomic Integration Is Out of Scope](adr-014-multi-repo-atomic-integration-is-out-of-scope)
- [ADR-015 — The CLI Is a Reference Implementation](adr-015-the-cli-is-a-reference-implementation)
- [ADR-016 — Mechanisms Over Mandatory Policies](adr-016-mechanisms-over-mandatory-policies)

All decisions are accepted for the first documentation slice. A future decision can supersede an earlier one; the history should stay visible.
