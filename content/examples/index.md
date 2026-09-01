---
title: Examples
description: Four small system stories showing how the patterns compose in practice.
type: Examples
section: examples
order: 100
readTime: 5 min read
slug: examples
---

## Read the examples as compositions

Each example starts with a concrete operating shape and names the patterns doing
the work. They use the workspace convention: open the Git control repository
as the coding-agent project root, keep managed repositories below ignored
`repos/`, and let `ws run` create bounded mutation worktrees. None of them is a
mandatory deployment blueprint.

- [01 — Single Repo / Single Agent](01-single-repo-single-agent)
- [02 — Multi-Repo Context](02-multi-repo-context)
- [03 — Two Concurrent Agents](03-two-concurrent-agents)
- [04 — Housekeeper + Coding Agent](04-housekeeper-and-coding-agent)

As complexity increases, the underlying lifecycle stays recognizable: bounded Run, explicit scope, Candidate, validation, and integration.

The dogfood workspace is the concrete end-to-end example: its control
repository manages the independent reference implementation, documentation,
and fixture repositories through the same manifest and CLI lifecycle.
