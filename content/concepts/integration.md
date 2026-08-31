---
title: Integration
description: The separate process that validates and promotes a Candidate into canonical repository history.
type: Concept
section: concepts
order: 29
readTime: 3 min read
slug: concepts/integration
---

## Definition

Integration is the process of validating a Candidate and promoting it into canonical history through repository policy.

## Why it exists

The agent that writes a change does not have to be the authority that publishes it. Separating the two keeps review and CI meaningful.

## Default implementation

Rebase, validate, and merge. Pull requests, human review, and custom policy engines are valid extensions.

## Trade-offs

Integration adds latency and a handoff. That cost buys a clear decision point for tests, compatibility, and canonical history.
