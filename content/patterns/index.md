---
title: Patterns
description: Twelve composable patterns for isolated, concurrent, and continuous engineering.
type: Pattern index
section: patterns
order: 30
readTime: 8 min read
slug: patterns
---

## How to read a pattern

Every pattern separates the problem from the mechanism. The default describes a useful starting point, not a universal policy. Each page calls out trade-offs, failure modes, extension points, and when the pattern is unnecessary.

## The progression

| Stage | Patterns | Question |
| --- | --- | --- |
| Bounded work | P01–P03 | How can one Run work with a clear scope? |
| System context | P04–P05 | How should context and coordination travel? |
| Concurrency | P06–P08 | How can Runs coexist and integrate? |
| Durable continuity | P09–P11 | What should survive a Run? |
| Composition | P12 | How do roles work together over time? |

## Pattern catalogue

- [P01 — One Repo / One Agent](p01-one-repo-one-agent)
- [P02 — Agent Worktree Isolation](p02-agent-worktree-isolation)
- [P03 — Read Many / Write One](p03-read-many-write-one)
- [P04 — Multi-Repo System Context](p04-multi-repo-system-context)
- [P05 — Private Plan / Public Intent](p05-private-plan-public-intent)
- [P06 — Multiple Agents / Same Repository](p06-multiple-agents-same-repository)
- [P07 — Runtime Resource Isolation](p07-runtime-resource-isolation)
- [P08 — Candidate-Based Integration](p08-candidate-based-integration)
- [P09 — Durable Knowledge Promotion](p09-durable-knowledge-promotion)
- [P10 — Scheduled Housekeeper](p10-scheduled-housekeeper)
- [P11 — Loop Agent as Repeated Runs](p11-loop-agent-as-repeated-runs)
- [P12 — Concurrent Coding + Housekeeping](p12-concurrent-coding-housekeeping)

The reference implementation maps these patterns to Git worktrees, local coordination, command adapters, and Git-tracked knowledge. Alternative providers can implement the same boundaries.
