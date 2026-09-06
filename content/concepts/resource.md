---
title: Resource
description: Any named thing in the System model, distinct from an allocated Runtime Resource.
type: Concept
section: concepts
order: 28
readTime: 3 min read
slug: concepts/resource
---

## Definition

A Resource is any named thing that exists in the System Workspace: a
repository, service, MCP server, skill, script, job, Docker component, UI,
contract, knowledge base, or capability. It has an identity, kind, ownership,
and relationships to Systems and Layers. See [System Model](system-model) for
the broader vocabulary.

## Why it exists

The broad inventory lets agents discover architecture without guessing from
filesystem layout. It also gives the Task Resolver stable inputs when it
composes a Task Workspace.

## Runtime Resources

A Runtime Resource is the allocated, usually temporary instance that an active
Task or Run needs: a port, process, temporary database namespace, browser
profile, or ephemeral service. File isolation alone does not stop two Runs
from binding the same port or terminating each other’s processes.

### Lifecycle

```text
requested → allocated → in use → released
                          └→ leaked / reconciled
```

## Default implementation

The reference CLI implements this narrow Runtime Resource slice with a local
allocator and process registry. It also supports declaration-only System
Resource registries and discovery/validation. Stronger isolation can be
provided by containers, VMs, or a remote execution provider; deployed Runtime
Workspace adapters remain future work.

See [Runtime Resource Isolation](../patterns/p07-runtime-resource-isolation).
