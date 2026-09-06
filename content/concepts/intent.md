---
title: Intent
description: Minimal coordination information that a Run exposes to other Runs.
type: Concept
section: concepts
order: 25
readTime: 3 min read
slug: concepts/intent
---

## Definition

Intent is a concise Task or Run statement describing the objective, expected
scope, constraints, and conflict signals. Task intent is durable and
caller-owned; Run intent describes the current bounded attempt.

## Why it exists

Other Runs need enough information to avoid obvious collisions without requiring every private plan to become a shared document.

## What it is not

Intent is not a complete plan, a lock, or a guarantee of semantic compatibility. Validation and integration still decide whether Candidates fit.

## Default implementation

A small structured record associated with a Run. It can be stored locally, emitted as an event, or exposed through a coordinator API.

See [Private Plan / Public Intent](../patterns/p05-private-plan-public-intent).
