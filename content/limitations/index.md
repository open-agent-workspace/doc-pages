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

Repositories retain independent histories. A system-wide change requires separately integrated Candidates or an additional release coordinator.

## Runtime resource isolation is best effort by default

Local port allocation and process tracking reduce collisions but do not provide the guarantees of containers, VMs, or a remote execution platform.

## Semantic conflicts cannot be completely prevented

Intent can lower the probability of routine collisions. It cannot determine whether two changes are compatible. Tests, review, and integration remain necessary.

## What to do with a limitation

Treat each limitation as an extension seam. Pick a stronger provider, add a policy, or keep the simpler default when its trade-off is appropriate. A limitation is not a failure of the pattern; it is part of its contract.
