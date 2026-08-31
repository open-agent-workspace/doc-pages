---
title: From Repository to System
description: Context scope can be larger than mutation scope.
type: Start here
section: start-here
order: 12
readTime: 5 min read
slug: start-here/from-repository-to-system
---

## The key move

An agent may need to read many repositories to understand a system while changing only one repository. This is the **Read Many / Write One** shape.

```text
             read
      ┌─────────────────┐
      │  service-a      │
      │  service-b      │───┐
      │  infra          │   │
      └─────────────────┘   ▼
                       Run: write one target
```

The distinction keeps the write boundary reviewable. Related repositories can remain independently owned, released, and integrated.

## What a workspace adds

The workspace can record repository relationships, shared policies, skills, and durable architectural context. It can answer “what else should this Run know about?” without pretending the repositories are one atomic history.

## What it does not add

A workspace does not create an atomic multi-repository transaction. If a change spans multiple repositories, each repository still needs its own Candidate and integration path.

## A practical rule

Start with the narrowest mutation scope that can complete the task. Expand read context when understanding requires it. Expand write scope only when the integration plan explicitly calls for it.

See [Multi-Repo System Context](../patterns/p04-multi-repo-system-context) and [Read Many / Write One](../patterns/p03-read-many-write-one).
