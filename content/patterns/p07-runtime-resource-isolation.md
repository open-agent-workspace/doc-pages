---
title: P07 — Runtime Resource Isolation
description: Treat ports, processes, services, and namespaces as resources with ownership and cleanup.
type: Pattern
section: patterns
order: 37
readTime: 5 min read
slug: patterns/p07-runtime-resource-isolation
---

## Problem

Separate files do not stop two Runs from binding the same port, reusing a database namespace, or terminating each other’s processes.

## Context

Runs start local servers, test databases, browsers, or background services.

## Pattern

Model runtime dependencies as Resources. Allocate them before use, record ownership, observe health, and release or reconcile them after the Run.

## Diagram

```text
Run → request resource → allocator → owned port/process/service
                                  ↓
                              release / reconcile
```

## Example

```text
Run A → port 4311
Run B → port 4312
Run end → stop process → release port
```

## Trade-offs

Explicit allocation reduces collisions. Best-effort local allocation can still race or leak; stronger providers are more expensive.

## Failure modes

Orphan processes survive a failed Run, a port is assumed free without checking, or a service is shared without a compatibility contract.

## Extension points

Use containers, namespaces, ephemeral databases, a daemon, or a remote scheduler.

## When not to use

Read-only Runs with no runtime dependencies do not need a resource allocator.
