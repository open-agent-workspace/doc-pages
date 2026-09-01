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

An agent may need to read many repositories to understand a system while
changing only one repository. This is the **Read Many / Write One** shape. The
workspace control repository gives the interactive driver one project root;
the managed repositories remain independent checkouts under `repos/`.

```text
             read
      ┌─────────────────┐
      │  repos/service-a│
      │  repos/service-b│───┐
      │  repos/infra    │   │
      └─────────────────┘   ▼
                       Run: write one target
```

The distinction keeps the write boundary reviewable. Related repositories can remain independently owned, released, and integrated.

## What a workspace adds

The workspace control repository can record repository relationships, paths,
Git URLs, shared policies, generated skills, and durable architectural
context. It can answer “what else should this Run know about?” without
pretending the repositories are one atomic history. `ws repo clone` and `ws
repo sync` make URL-backed checkouts reproducible while leaving their Git
boundaries intact.

## What it does not add

A workspace does not create an atomic multi-repository transaction. If a change spans multiple repositories, each repository still needs its own Candidate and integration path.

## Driver and bounded Run

Start the interactive driver at the workspace root. It uses the generated
`AGENTS.md` and `.agents/skills/` to select context and invoke `ws run`. The
bounded Run starts in an isolated worktree for the one write target; its
context repositories are read-only snapshots for that Run.

## A practical rule

Start with the narrowest mutation scope that can complete the task. Expand read
context when understanding requires it. Expand write scope only when the
integration plan explicitly calls for it. If more than one repository must
change, create separate Candidates and coordinate their integration.

See [Multi-Repo System Context](../patterns/p04-multi-repo-system-context) and [Read Many / Write One](../patterns/p03-read-many-write-one).
