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

## Dependencies connect resources and modules

A **Dependency** is a directed relationship from a source endpoint to a target
endpoint. Each endpoint names a registered repository and may optionally name
a repository-relative module path. The edge means “the source depends on the
target”; it can describe imports, build inputs, documentation, deployment,
data, or another deliberately named relationship.

```yaml
version: 1
dependencies:
  - id: cli-imports-core
    from: { repository: reference, module: packages/cli }
    to: { repository: reference, module: packages/core }
    kind: imports
    required: true
```

Dependencies are durable navigation metadata, not package-manager lockfiles.
They should be added or updated with the same review as the architecture they
describe. A repository-level endpoint lets a developer see the system at a
high level; module-level endpoints let an agent narrow the context before it
opens a large checkout. Incoming and outgoing views make the direction
explicit.

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
`system/systems.yaml`, `system/layers.yaml`, `system/resources.yaml`,
`system/repos.yaml`, and `system/dependencies.yaml` registries. `ws validate`
and topology status inspect the declarations; `ws discover` filters declared
membership by fields such as System, Layer, or kind, and `ws dependencies`
queries dependency edges by repository, module, direction, or kind. It is not
semantic search or automatic dependency inference. On-demand context
resolution is a proposed interface, not a current command. Planner,
caller-owned Task Resolver logic, and deployed Runtime Workspace adapters
remain external capabilities.
