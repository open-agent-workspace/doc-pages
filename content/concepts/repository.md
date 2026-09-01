---
title: Repository
description: An independent source, history, CI, release, and ownership boundary.
type: Concept
section: concepts
order: 22
readTime: 3 min read
slug: concepts/repository
---

## Definition

A Repository remains the unit that owns Git history, branches, CI, release
lifecycle, and normal integration policy. A workspace entry identifies the
checkout with a stable name, a workspace-relative `path`, and, when it is
portable, a Git `url`.

## Why it exists

Keeping repository boundaries independent lets teams adopt a workspace without
forcing a monorepo or a distributed transaction model. The recommended
checkout location is `repos/<name>` beneath the workspace control repository;
the control repository ignores that directory so it does not absorb another
repository’s files or history.

## Lifecycle

A repository is cloned with `ws repo clone <url>`, or registered with
`ws repo add <path>`. `repo add` infers the `origin` URL when possible and can
take `--url` explicitly. The entry becomes workspace context, is attached to a
Run’s read or write scope, and eventually receives an integrated Candidate
through its own history. `ws repo sync [name]` materializes a missing
URL-backed checkout and leaves an existing checkout unchanged.

## Shared or private?

Repository metadata can be shared within the workspace. Working trees and uncommitted changes should be private to their owning Run.

## Default implementation

Git repositories and Git worktrees provide the reference implementation. The
manifest remains portable because paths are relative to the control-repository
root and URLs identify where a missing checkout can be cloned.

## Trade-offs

Independent histories preserve autonomy but make multi-repository changes
harder to integrate atomically. URL-backed sync also needs a policy for local
changes and credentials. These limitations are intentional; see
[ADR-002](../decisions/adr-002-repository-boundaries-remain-independent) and
[ADR-014](../decisions/adr-014-multi-repo-atomic-integration-is-out-of-scope).
