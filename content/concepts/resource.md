---
title: Resource
description: A runtime dependency that must be allocated, observed, and released.
type: Concept
section: concepts
order: 28
readTime: 3 min read
slug: concepts/resource
---

## Definition

A Resource is something an active Run needs at runtime: a port, process, service, database namespace, browser profile, or other local capability.

## Why it exists

File isolation alone does not stop two Runs from binding the same port or terminating each other’s processes.

## Lifecycle

```text
requested → allocated → in use → released
                          └→ leaked / reconciled
```

## Default implementation

A local allocator and process registry. Stronger isolation can be provided by containers, VMs, or a remote execution provider.

See [Runtime Resource Isolation](../patterns/p07-runtime-resource-isolation).
