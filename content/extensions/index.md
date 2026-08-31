---
title: Extensions
description: Replace implementation choices while keeping the open workspace patterns intact.
type: Extension guide
section: extensions
order: 70
readTime: 6 min read
slug: extensions
---

## The substitution rule

The architecture names boundaries and lifecycles. Providers implement them. Replace a provider when its trade-offs no longer fit the environment, and keep the surrounding contract explicit.

## Execution Provider

**Default:** Git worktree.

Possible replacements include Docker, devcontainers, VMs, Nix environments, or a custom sandbox. Choose a stronger provider when the workload needs security or dependency isolation rather than routine workflow separation.

## Agent Provider

The Agent Profile can adapt Codex CLI, Claude Code, Copilot CLI, Gemini CLI, OpenCode, or a custom command. The workspace should depend on the adapter contract, not the agent’s brand.

## Coordinator

**Default:** local process plus SQLite. A daemon, Redis, external scheduler, or another local state engine can own Run status, Intent, leases, and resource records.

## Integration

**Default:** rebase, validate, merge. Pull requests, human review, CI gates, and custom policy engines are valid integration providers.

## Knowledge Store

**Default:** Markdown and structured Git files. SQLite, Dolt, a knowledge graph, vector index, or external knowledge base can store durable context if it preserves reviewability and clear promotion semantics.

## Extension checklist

Before replacing a default, ask:

- Does the provider preserve the same conceptual boundary?
- Which guarantee becomes stronger or weaker?
- What new cleanup, recovery, or operational state does it introduce?
- How will a Candidate or durable Event remain portable?

The reference CLI is one path through this matrix, not a conformance test for every implementation.
