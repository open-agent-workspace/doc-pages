---
title: Implementation Plan
description: A phased plan for making Agent Workspace useful across independent repositories without expanding its product boundary.
type: Reference
section: reference
order: 91
readTime: 10 min read
slug: reference/implementation-plan
---

## Scope and guardrails

This plan turns the [Product Design](../start-here/product-design) into a
small, testable progression. It keeps `ws` focused on repository/context
discovery, Task Workspace composition, bounded Runs, results, and lineage.
It does not create a mandatory four-workspace setup, a competing scheduler, or
an unowned runtime control plane.

New repositories required now: **zero**.

Reuse the existing repositories and preserve their actual names and history:

| Repository | Role in the pilot |
| --- | --- |
| `open-agent-workspace/doc-pages` | Product design, contracts, patterns, and acceptance evidence. |
| `open-agent-workspace/reference-implmentation` | `ws` implementation; preserve the existing `implmentation` spelling. |
| `open-agent-workspace/example-workspace` | Deterministic fixture and safe mutation target. |
| Local dogfood workspace | Cross-repository integration and review surface. |
| `cmwen/coding-agent-orchestrator` | Existing tmux session/queue/schedule/filesystem-state candidate; assess reuse and integration, which are not implemented by this plan. |
| `cmwen/locallink` | Runtime candidate for service/resource/status compatibility assessment. |
| `cmwen/locallink-workspace` | Existing runtime topology/configuration candidate; assess compatibility and authority boundaries. |

Do not create repos, remotes, pushes, or deployments as part of this plan.
No proposed repository is registered in the dogfood workspace at this stage.

If the conditional `agent-orchestration` gate fails, its initial extraction is
limited to a small implementation package for the versioned Task/result
interface and caller-owned orchestration state (for example `packages/core/`
and `packages/cli/` plus tests). It does not include a new UI, contracts repo,
or knowledge repo by default.

## Repository creation and migration gate

No proposed repository is registered in the dogfood workspace now. Any new
repository requires an explicit gate after the pilot, with an owner and a
non-duplicating boundary:

| Proposed repository | Type / initial contents | Owner | Create when | Dependencies / gate |
| --- | --- | --- | --- | --- |
| `system-workspace` | Configuration/catalog repo: reviewed System topology, Layers, Resources, contracts, and links to existing runtime declarations. | Architecture/System owner | Only after P1 proves cross-workspace durable context is needed. | Selectively migrate reviewed dogfood topology and Workstream intent; preserve old IDs and Run lineage; link `cmwen/locallink-workspace` rather than copy its runtime authority. |
| `agent-orchestration` | Conditional implementation package for caller-owned Tasks, loops, queues, schedules, retries, and budgets. | Orchestration owner | Only if the P3 reuse gate proves `cmwen/coding-agent-orchestrator` cannot consume the versioned `ws` interface. | Written incompatibility and extraction decision; no competing scheduler, UI, contracts, or knowledge repo by default. |

Migration steps for `system-workspace` are: inventory declarations and owners;
validate links and stable IDs before switching readers; move only reviewed
System/Workstream material; retain product-specific context, fixture, and
history in dogfood; link existing runtime configuration; then switch one
consumer at a time while preserving historical lineage. Do not create a
second source of truth during the transition.

## Ownership contract

| Concern | Agent Workspace (`ws`) | Caller / external owner |
| --- | --- | --- |
| Repository and declared context discovery | Owns | May provide constraints |
| Context composition and selected snapshots | Owns | May approve or narrow |
| Task goal and prioritisation | Consumes | Caller / Planner owns |
| Loop definitions, schedules, retries, budgets | Consumes a single Task at a time | Caller / orchestrator owns |
| Bounded execution, write limits, result | Owns | Agent provider executes |
| Candidate validation/integration policy | Exposes result/evidence | Repository policy or integration owner decides |
| Deployed services and runtime state | Exposes references only | LocalLink, PM2, Docker, or another runtime owner |

## Phases

### D0 — Documentation and contracts

**Owner:** docs + implementation maintainers. **Dependencies:** none.

Define the Task, Run, Candidate, System, Layer, Resource, Runtime Resource,
and four-scope vocabulary. Record the interface boundary for caller-owned
intent and external runtime ownership. Keep the declaration-only System
registry optional; an existing repository manifest remains a valid setup.

**Acceptance:** docs describe one clear product boundary; no page implies a
mandatory four-directory setup or that `ws` owns Planner, schedules, loops,
retries, budgets, or runtime lifecycle.

### P1 — Agent Workspace self-dogfood discovery pilot

**Owner:** reference implementation maintainer. **Dependencies:** D0.

Use Agent Workspace itself as the first real multi-repository project: the
`open-agent-workspace/doc-pages` contract, the
`open-agent-workspace/reference-implmentation` reference implementation, the
optional `open-agent-workspace/example-workspace` fixture, and the local
dogfood control workspace. A second real application spanning multiple
repositories is a later generalisation, not a prerequisite for this phase.
Establish one metadata authority for repository identity and relationships.
Exercise declared System/Layer/Resource membership and on-demand context
selection at the interface level. Compose selected-only read snapshots and one
writable repository with explicit write limits. An unavailable unrelated
repository must not block a task that did not select it.

The first concrete scenario is: **“A bounded task must not fail because an
unrelated registered repository is unavailable.”** The agent receives the
objective, the workspace entrypoint, and read/write permissions—not an
expected repository or file list. Discovery should trace the docs contract to
the reference implementation and its tests, use the example fixture only when
useful, and include root metadata as context. The agent writes the reference
implementation only after explicit selection and approval; any later docs
change is a separate Candidate, not an implicit side effect of discovery.

Ordered work items:

1. Inventory Agent Workspace’s repositories, contracts, and ownership; keep
   `.workspace/workspace.yaml` as the canonical identity/path/URL mapping for
   existing product repositories, and record System Resource references by
   those repository IDs.
2. Declare the smallest useful System/Layer/Resource relationships and validate
   links before running an agent. Reject duplicated mappings that can drift;
   if duplicates exist, propose a migration without changing stable IDs.
3. Define the proposed selection/materialization boundary: selection returns
   resource IDs, reasons, revisions, and constraints; materialization turns
   only approved selections into read snapshots and one writable worktree.
4. Exercise direct objective input with no prescribed repository list. The
   resolver may propose a selection, but the caller can approve or narrow it.
5. Verify that expanding read context never expands write permissions: the
   selected mutation target remains the only writable target, even though the
   current context-only filesystem boundary is checked after execution.
6. Use a safe temporary fixture or temporary checkout omission to simulate an
   unavailable checkout for an unrelated registered repository and repeat the
   task. Keep the registration intact; never remove, rename, or damage a live
   managed repository. Selected-only materialization must still succeed.

**Acceptance evidence:**

- The self-dogfood objective without a prescribed repository list can use the
  proposed context-selection interface to identify the declared docs contract,
  reference implementation/test, optional fixture, and root metadata, with an
  inspectable discovery trace, selection reasons, and selected revisions. This
  is an aspirational pilot acceptance criterion, not a claim about today’s
  membership-filtering command.
- A task can select one mutation repository while reading several independent
  repositories.
- An unavailable, unrelated repository does not fail the task.
- The baseline limitation—that the current snapshot path reads every
  registered checkout before selected context is materialized—is recorded. The
  target regression result is selected-only materialization, followed by
  Candidate validation; this plan does not claim that this scenario has already
  been executed or completed.
- Context-only snapshots are not writable by the Run workflow and unrelated
  repositories are not materialized merely because they exist in a broad
  workspace. The current context-only worktrees are Git workflow isolation
  checked after the Run, not an enforceable read-only filesystem boundary.
- Existing repository URLs, names, and the `reference-implmentation` spelling
  remain intact.

The current `ws discover` command is only declared-membership filtering. Do
not present it as semantic search; define any richer resolver interface as a
proposal until implemented and tested. Direct objective input should remain
usable without requiring the caller to manufacture a separate Task object;
Task objects are the durable caller contract, not a mandatory CLI ceremony.

Proposed selection/materialization exchange (not a current CLI command):

```yaml
request:
  objective: A bounded task must not fail because an unrelated registered repository is unavailable.
  workspace_entrypoint: dogfood-workspace
  allowed_read:
    - open-agent-workspace/doc-pages
    - open-agent-workspace/reference-implmentation
    - open-agent-workspace/example-workspace
    - dogfood-workspace
  allowed_write:
    - open-agent-workspace/reference-implmentation
result:
  selected:
    - open-agent-workspace/doc-pages
    - open-agent-workspace/reference-implmentation
    - local-dogfood-control
  reasons:
    - "doc-pages defines the discovery contract"
    - "reference-implmentation contains the implementation and tests"
    - "dogfood-workspace supplies the workspace metadata"
  selected_revisions: "revisions recorded by discovery; no hash is prescribed here"
  materialization: selected snapshots + writable reference-implmentation worktree
  approval: explicit caller approval required before writing
```

### P2 — Results, recovery, and minimal consumer interface

**Owner:** reference implementation maintainer with caller representatives.
**Dependencies:** P1.

Make Run results, Candidate evidence, failure/interruption state, and lineage
usable by a consumer without retaining the Task filesystem. Target a Run
Manifest for every loop execution, while acknowledging that current history
is not durable for every outcome yet. Version the
minimal result/Run Manifest shape: Task reference, Run identity, selected
resources/repositories, base revisions, agent/provider, status, Candidate,
validation evidence, and relevant System/plan revisions when supplied by the
caller.

Choose the initial transport and compatibility policy before the P3 reuse
assessment: a versioned file/JSON result boundary is the smallest pilot
contract, with explicit error/status fields and forward-compatible additions.
An API or event transport can be evaluated later; it is not a current command.

**Acceptance evidence:**

- A failed or interrupted Run retains a durable record and can be inspected
  after its execution process exits.
- A fresh setup can discover the workspace and execute a bounded fixture Run.
- Candidate worktrees are preserved until policy marks them safe to remove.
- A consumer can read the versioned result without depending on SQLite internals
  or a live agent process.
- Every loop execution eventually has a durable Run Manifest, including failed
  and interrupted outcomes; the current implementation must close this gap
  before claiming that guarantee.
- Status behavior is documented honestly: `ws status` may open or migrate
  local SQLite state, so it is not treated as a fully read-only probe.

### P3 — Evaluate orchestration reuse and gated System Workspace migration

**Owner:** architecture owner. **Dependencies:** P2 plus real pilot evidence.

First assess whether `cmwen/coding-agent-orchestrator` can consume the minimal
result/context interface. It already owns tmux-backed sessions, queues,
schedules, and filesystem state; integration is an assessment target, not an
assumed capability. Prefer reuse when its ownership and contracts fit.

Only if the existing orchestrator cannot consume the interface should a new
`agent-orchestration` implementation repository be proposed. The gate must
record the incompatibility, the smallest extraction boundary, and why reuse
would create unacceptable coupling. No competing scheduler is created by
default.

After the pilot demonstrates a durable need for cross-workspace context,
evaluate the `system-workspace` migration gate above. Selectively migrate
reviewed dogfood topology and Workstream intent; retain product-specific
context, fixture, and history in dogfood; link existing runtime configuration
instead of copying it or creating duplicate authority. Validate links and IDs
before switching consumers, retain the old read path during rollback, switch
one consumer at a time, and preserve historical lineage. This repository is
proposed after the pilot, not required now.

**Acceptance:** a written reuse-vs-extract decision, no duplicate scheduler or
runtime authority, and a migration map with owners for every moved declaration.

### P4 — External runtime integration

**Owner:** runtime owner(s). **Dependencies:** P2 result contract and P3
compatibility decisions.

Assess compatibility with `cmwen/locallink` and
`cmwen/locallink-workspace`. Define how Runtime Workspace declarations,
service topology, PM2/Docker state, and Agent Workspace results reference one
another. Keep PM2, Docker Compose, and Git/FS as adapters owned by the runtime
system. Agent Workspace should not grow `start`, `stop`, `reconcile`, or
`deploy` commands to make this integration appear complete.

**Acceptance:** an external runtime owner can consume versioned result and
resource references without taking ownership of Task planning or repository
integration; compatibility gaps and security boundaries are recorded.

## Test matrix

The pilot should demonstrate these cases:

| Case | Expected evidence |
| --- | --- |
| Self-dogfood objective without a repository list | Finds the docs contract, reference implementation/test, optional fixture, and root metadata through context resolution, records trace/reasons/revisions, then keeps the write target narrow. |
| Self-dogfood unavailable unrelated repository | A safe temporary fixture simulates the missing checkout; the task succeeds because it was not selected. No live managed repository is removed. |
| Failed/interrupted Run | Durable Run/Candidate state remains inspectable after process exit. |
| Fresh setup | A new control root can load declarations, validate them, and run the fixture path. |
| Later second application | A separate non-fixture application spanning multiple repositories generalises the self-dogfood result and proves independent integration boundaries. |

The test suite should distinguish declaration membership filtering from future
semantic discovery and should avoid claiming command behavior that is not
implemented.
