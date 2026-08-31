---
title: One Repo / One Agent
description: Start with the smallest useful unit: one bounded Run, one repository, one explicit result.
type: Start here
section: start-here
order: 11
readTime: 4 min read
slug: start-here/one-repo-one-agent
---

## The minimal pattern

Give one agent one repository and one bounded task. The agent reads the relevant context, makes a change in an isolated Run, validates it, and returns a Candidate.

```text
human request
     ↓
bounded Run → isolated checkout → validation
                                     ↓
                                  Candidate
```

The useful constraint is not the number of agents. It is the bounded lifecycle:

1. create a Run with a clear objective;
2. provide the context it needs;
3. isolate its mutation scope;
4. validate the result;
5. promote or discard the Candidate.

## What belongs in a Run?

A Run needs an objective, a target repository, an Agent Profile, and a lifecycle status. It may also produce Intent, Events, and a Candidate.

It should not assume ownership of the canonical checkout or the final integration decision.

## Why start here?

This pattern makes the lifecycle visible before coordination becomes complicated. It provides a clean seam for later additions: more repositories can become context, more agents can receive separate worktrees, and scheduled roles can create repeated Runs.

## Limitation

One Run / one repository does not solve cross-repository consistency, shared ports, or semantic conflicts. Those are deliberately introduced as separate patterns instead of hidden inside this baseline.

See [Agent Worktree Isolation](../patterns/p02-agent-worktree-isolation) when the canonical checkout must remain untouched.
