---
title: Candidate
description: A proposed result from a Run that is ready for validation or integration.
type: Concept
section: concepts
order: 26
readTime: 3 min read
slug: concepts/candidate
---

## Definition

A Candidate is the output of a Run: usually a commit, branch, patch, or other reviewable artifact plus validation evidence.

## Why it exists

Separating production from integration keeps agent execution bounded and keeps canonical history under an explicit integration policy.

## Default implementation

The reference CLI uses a Git commit or branch in an isolated worktree. A pull request or artifact bundle is also a valid implementation.

## Trade-offs

Candidates create an extra handoff, but that handoff is where validation, human review, and repository policy can operate.
