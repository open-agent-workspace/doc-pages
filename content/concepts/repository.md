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

A Repository remains the unit that owns Git history, branches, CI, release lifecycle, and normal integration policy.

## Why it exists

Keeping repository boundaries independent lets teams adopt a workspace without forcing a monorepo or a distributed transaction model.

## Lifecycle

A repository is registered as workspace context, attached to a Run’s read or write scope, and eventually receives an integrated Candidate through its own history.

## Shared or private?

Repository metadata can be shared within the workspace. Working trees and uncommitted changes should be private to their owning Run.

## Default implementation

Git repositories and Git worktrees provide the reference implementation.

## Trade-offs

Independent histories preserve autonomy but make multi-repository changes harder to integrate atomically. That limitation is intentional; see [ADR-014](../decisions/adr-014-multi-repo-atomic-integration-is-out-of-scope).
