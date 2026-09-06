---
title: System Model
description: Model systems, architectural layers, and broad resources without relying on filesystem layout.
type: Concept
section: concepts
order: 23
readTime: 5 min read
slug: concepts/system-model
---

## The three-part model

The optional System Workspace registry describes architecture explicitly rather
than making an agent infer it from sibling directories:

```text
System   = why does this resource exist?
Layer    = what architectural role does it play?
Resource = what actually exists?
```

## System

A System is a responsibility or product boundary. Examples include an agent
platform, knowledge system, observability system, or local development
control-plane. A resource can belong to more than one System when it serves
multiple responsibilities.

## Layer

A Layer is an architectural role or capability class. Useful layers include
capability, execution, knowledge, observability, runtime, and experience.
Layers provide a second discovery direction independent of product
boundaries:

```text
show everything related to Knowledge
show everything in the Observability layer
```

## Resource

A Resource is any named thing that exists in the system model. Resources may
include:

- repositories and worktrees;
- services, jobs, scripts, and Docker infrastructure;
- MCP servers, skills, and agent capabilities;
- contracts, schemas, knowledge bases, and policies;
- UIs, dashboards, and other experience surfaces.

Resources should have stable identity, kind, ownership, lifecycle, relations,
and (where relevant) the systems and layers they serve.

## Runtime Resources are a separate term

A **Runtime Resource** is an allocated instance needed by an active Task or
Run: for example a TCP port, process, temporary database namespace, browser
profile, or ephemeral service. Runtime Resources have ownership and an
allocation lifecycle:

```text
requested → allocated → in use → released
                          └→ leaked / observed
```

The broad Resource model is the canonical inventory. Runtime Resource
allocation is an execution concern and must not redefine the whole model.

## Relationships and revisions

The model should record relations such as `calls`, `deploys`, `provides`,
`documents`, `observes`, and `depends_on`. A System revision identifies the
model used to compose a Task Workspace. This makes stale context and semantic
conflicts visible even when Git worktrees have no textual merge conflict.

The current reference implementation supports declaration-only
`system/systems.yaml`, `system/layers.yaml`, `system/resources.yaml`, and
`system/repos.yaml` registries. `ws validate` and topology status inspect the
declarations; `ws discover` currently filters declared membership by fields
such as System, Layer, or kind. It is not semantic search or automatic
dependency inference. On-demand context resolution is a proposed interface,
not a current command. Planner, caller-owned Task Resolver logic, and deployed
Runtime Workspace adapters remain external capabilities.
