---
title: Boundaries & Limitations
description: What the reference architecture intentionally does not guarantee or solve.
type: Limitation
section: limitations
order: 80
readTime: 6 min read
slug: limitations
---

## Why a dedicated boundary page?

Limitations shape safe adoption. They should be visible at the same level as the patterns, not hidden in a FAQ or implied by a demo.

## Single machine only

The first reference architecture assumes one machine. It does not provide distributed locks, remote workers, or multi-machine scheduling.

## No hard sandbox guarantee

Git worktrees prevent normal workflow collisions. They do not isolate credentials, processes, the kernel, or the repository object store. Use a stronger Execution Provider for untrusted or sensitive code.

## No atomic multi-repo transaction

Repositories retain independent histories. A system-wide change requires
separately integrated Candidates or an additional release coordinator. The
current Run mutates one repository; later multi-repository workflows must
coordinate several Candidates and still do not imply an atomic transaction.

## Discovery is not semantic search

The current `ws discover` capability filters declared System/Layer/Resource
membership. It does not infer semantic dependencies, search every repository,
or guarantee that the best context has been found. On-demand context
resolution is a proposed interface and must explain selections and tolerate
unavailable unrelated repositories.

## Planning and loops are external

Agent Workspace consumes caller-owned Task intent. It does not own goals,
prioritisation, schedules, retries, budgets, or durable loop state. An external
Planner or orchestrator can invoke bounded Runs repeatedly and retain its own
Workstream state.

## Runtime Workspace is external

The reference CLI does not own canonical deployed state or runtime lifecycle.
PM2, Docker Compose, Git/FS, LocalLink, or another runtime owner must provide
that adapter and policy. Task Runtime Resources and process cleanup should not
be mistaken for a deployed Runtime Workspace.

## Runtime resource isolation is best effort by default

Local port allocation and process tracking reduce collisions but do not provide the guarantees of containers, VMs, or a remote execution platform.

## Some status paths are operational

`ws status` is useful for inspection, but local SQLite initialization or schema
migration may occur. It should not be treated as a fully read-only probe.

## Semantic conflicts cannot be completely prevented

Intent can lower the probability of routine collisions. It cannot determine whether two changes are compatible. Tests, review, and integration remain necessary.

## What to do with a limitation

Treat each limitation as an extension seam. Pick a stronger provider, add a policy, or keep the simpler default when its trade-off is appropriate. A limitation is not a failure of the pattern; it is part of its contract.
