---
title: Composition CLI Reference
description: Create, inspect, validate and repair references to existing independently owned workspaces.
type: Guide
section: reference
order: 93
readTime: 8 min read
slug: reference/composable-workspaces
---

Run these commands from the coordinating workspace. The nearest ancestor
`.workspace/workspace.yaml` selects the coordinator, matching existing `repo`
commands. Each coordinator owns one optional composition. Use another
coordinating workspace for another composition; reuse the same member IDs.

| Command | Behavior |
| --- | --- |
| `ws compose create [name]` | Create optional composition metadata; defaults to the workspace name. |
| `ws compose add <alias> <workspace-path>` | Reference an exact existing workspace root and verify its ID. |
| `ws compose remove <alias>` | Remove only the reference, even when its target is offline. |
| `ws compose relocate <alias> <workspace-path>` | Update a locator only if the new root has the original ID. |
| `ws compose list` | List the current composition's direct members and their status. |
| `ws compose inspect` | Show identity, responsibility, repository names, nested membership and errors. |
| `ws compose validate` | Validate references and nesting; exit nonzero on invalid declarations or members. |

Every command supports `--json`. `add` also accepts `--role <description>` and
`--access read-only|read-write`; access defaults to `read-only`. Aliases contain
lowercase letters, digits, hyphens or underscores and are unique within their
composition. Member IDs must also be unique among direct members.

```sh
ws compose create 'Agent Control System'
ws compose add dashboard ../dashboard --role 'Routes controller commands'
ws compose add companion ../companion --role 'Activates desktop sessions' --access read-write
ws compose inspect --json
ws compose validate --json
```

Paths resolve from the workspace root, not the shell's nested working directory.
Writers save relative locators; readers also accept absolute paths. A missing
root is never initialized or resolved upward to a parent workspace. There is no
global workspace scan or automatic rebinding when paths change.

## Validation and missing members

Inspection reports each unresolved reference and continues with available
siblings. Validation checks schema version, owner ID, aliases, member identity,
exact roots, nested schemas, cycles and a maximum traversal depth of 64 edges.
It does not validate source code, skills, hardware or Run integration.
Newly added and relocated subtrees must validate; existing unrelated unavailable
members do not block adding a valid member or removing a stale reference.

`ws validate` still validates the System model. Use `ws compose validate` for
composition references. Workspaces without a composition continue unchanged.

## Persistence and recovery

Only `.workspace/composition.yaml` is mutated. An exclusive sibling `.lock`
serializes writers; replacement is atomic, so readers see a complete manifest.
If a writer is interrupted, verify it has stopped before deleting a stale
`composition.yaml.lock` or temporary file. Do not commit locks, temporary files
or `.workspace/runtime` data. Synchronize the declaration using the coordinator's
Git history; resolve conflicts explicitly before using it.

## Implemented limits

These commands read manifests only and never start agents or copy member skills.
The access label grants no authority and is not a filesystem sandbox. Context
composition, `compose context`, coordinated Task dispatch and aggregate status
remain proposed in the [design](composable-workspaces-design). Start existing
bounded Runs inside each member using that member's normal profile and policy.
See the [worked example](../examples/05-composable-workspaces).
