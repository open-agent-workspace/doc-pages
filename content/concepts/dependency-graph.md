---
title: Dependency Graph
description: Use explicit repository and module relationships to navigate a large system.
type: Concept
section: concepts
order: 24
readTime: 4 min read
slug: concepts/dependency-graph
---

## Why keep a graph?

Repositories remain independent ownership and release boundaries, but they
are rarely independent at the system level. A dependency graph gives agents a
small, inspectable map of what to read next and gives developers a high-level
view of how the system is connected.

The graph belongs in the System Workspace as `system/dependencies.yaml`. It is
reviewed architecture metadata, not generated build output. Use repository
endpoints for broad relationships and add module paths when a narrower edge
matters to navigation or execution context.

## Edge shape

```yaml
version: 1
dependencies:
  - id: docs-describe-reference
    from: { repository: docs }
    to: { repository: reference }
    kind: documents
    description: Documentation explains the reference implementation.
  - id: cli-imports-core
    from: { repository: reference, module: packages/cli }
    to: { repository: reference, module: packages/core }
    kind: imports
    required: true
```

`from` is the dependent and `to` is the dependency. `kind` explains the
relationship. `required` is optional and defaults to true for consumers that
need a simple required/optional view. Endpoint repositories must exist in the
workspace manifest; module paths are relative to those repositories and cannot
escape them.

## Querying the graph

The reference CLI exposes the declared graph without scanning every checkout:

```sh
ws dependencies --repository reference
ws dependencies --repository reference --direction outgoing
ws dependencies --module packages/core --direction incoming --json
```

The command is a declaration query, not semantic search. A missing or stale
edge is a metadata maintenance problem and should be corrected through a
reviewed change. A graph can propose context for a Task Resolver, but the
caller still approves the selected read set and the Run keeps its narrow write
boundary.
