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

## Reference module and package map

This is a compact map of the current reference implementation, not a required
layout for every Agent Workspace. It is deliberately source-readable: an agent
can use the package names, paths, and arrows below to choose a starting point
without first scanning the whole repository.

```diagram
agentic-workspace-reference-implementation/  (pnpm workspace)
│
├─ @agentic-workspace/cli                     command surface
│  ├─ bin/ws.js                               executable entrypoint
│  └─ src/
│     ├─ cli.ts                               command dispatch and runtime wiring
│     ├─ args.ts                              CLI parsing and option validation
│     └─ output.ts                            human and JSON output
│                  │ imports public API only
│                  ▼
└─ @agentic-workspace/core                    reusable workspace engine
   ├─ src/index.ts                            public export boundary
   ├─ workspace.ts                            manifest, repository, and profile model
   ├─ system.ts                               System/Layer/Resource registry discovery
   ├─ run.ts                                  bounded Run lifecycle and Candidate creation
   ├─ store.ts                                local SQLite operational state
   ├─ git.ts                                  Git inspection and command helpers
   ├─ agent-guidance.ts                       generated AGENTS.md and workspace skills
   ├─ errors.ts, constants.ts                 shared domain primitives
   └─ src/providers/                          replaceable infrastructure seams
      ├─ contracts.ts                         provider method contracts
      ├─ agent-command.ts                     local agent command adapter
      ├─ git-worktree.ts                      writable and context worktrees
      ├─ process.ts                           process and port resources
      ├─ integration.ts                       rebase, validate, and fast-forward merge
      └─ knowledge-files.ts                   Markdown/YAML durable knowledge

Control workspace data  ──workspace.ts/system.ts──► manifest + system/ + .workspace/context/
Run lifecycle           ──run.ts──► providers + store.ts ──► .workspace/runtime/ (disposable)
Candidate integration   ──integration.ts──► Git repository history (reviewed, durable)

Dependency rule: cli → core; core never imports cli. Providers depend on
core contracts and may be replaced without changing the command surface.
```

### Fast path for agents

| Need | Start here | Then follow |
| --- | --- | --- |
| Add or change a `ws` command | `packages/cli/src/cli.ts` | `args.ts`, `output.ts`, then the matching core export and CLI test. |
| Change workspace or repository discovery | `packages/core/src/workspace.ts` | `system.ts` for declared topology and `packages/core/tests/workspace.test.ts`. |
| Change Run, Candidate, or recovery behavior | `packages/core/src/run.ts` | `store.ts`, the relevant provider, and `packages/core/tests/run.test.ts`. |
| Replace an infrastructure concern | `packages/core/src/providers/contracts.ts` | The matching provider implementation and its focused test. |

`packages/*/tests/` mirrors the module groups above. Treat the diagram as an
orientation index; inspect the named module and its tests before changing a
contract or provider boundary.

## Execution Provider

**Default:** Git worktree.

Possible replacements include Docker, devcontainers, VMs, Nix environments, or a custom sandbox. Choose a stronger provider when the workload needs security or dependency isolation rather than routine workflow separation.

## Agent Provider

The Agent Profile can adapt Codex CLI, Claude Code, Copilot CLI, Gemini CLI, OpenCode, or a custom command. The workspace should depend on the adapter contract, not the agent’s brand.

## Coordinator

**Default:** local process plus SQLite for the current Run lifecycle. A
daemon, Redis, external scheduler, or another local state engine may own Task
intent, loops, retries, budgets, and orchestration. The coordinator should
consume the versioned result/lineage boundary rather than duplicate repository
or runtime authority.

Existing candidates include `cmwen/coding-agent-orchestrator`, which already
owns tmux sessions, queues, schedules, and filesystem state. Assess whether it
can consume the Agent Workspace interface before extracting a new
`agent-orchestration` repository; reuse is the default and no competing
scheduler is implied.

## Runtime Workspace adapter

PM2, Docker Compose, and Git/FS can implement a Runtime Workspace owned by a
runtime system such as LocalLink. The existing `cmwen/locallink` and
`cmwen/locallink-workspace` repositories are compatibility candidates. This
extension is an interface assessment, not a claim that `ws` owns service
lifecycle or deployment.

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

The reference CLI is one path through this matrix, not a conformance test for
every implementation. External Planner, scheduler, loop, and runtime owners
must remain explicit.
