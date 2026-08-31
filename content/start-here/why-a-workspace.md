---
title: Why a Workspace?
description: A repository is a source boundary. A workspace is the wider engineering context agents need around it.
type: Start here
section: start-here
order: 10
readTime: 5 min read
slug: start-here/why-a-workspace
---

## Definition

A workspace is a logical boundary around related repositories, shared engineering knowledge, policies, skills, resources, and agent Runs.

It is not necessarily a folder. It is a way to describe the system an engineering team is working on, even when that system is split across independent repositories.

## The problem with “just a repository”

The traditional development environment assumes one developer, one working tree, and one active change. Agents stretch that model in several directions:

- a Run may work for hours without supervision;
- multiple Runs may be active at the same time;
- useful context may live in sibling repositories or durable notes;
- housekeeping and maintenance work may happen on a schedule;
- ports, processes, and services become shared runtime resources.

The repository still owns its history and release lifecycle. It simply stops being the complete map of the engineering environment.

## A useful separation

The workspace describes shared context and coordination. A repository remains the primary mutation and integration boundary.

```text
workspace
├── related repositories
├── policies + skills
├── durable knowledge
├── active Runs
└── runtime resources
```

This separation lets teams add coordination without turning every repository into a distributed system.

## Trade-offs

The workspace concept simplifies cross-repository orientation and shared conventions. It adds a boundary that must be named, documented, and kept current. For a small project with one human and one short-lived agent, a repository may be all you need.

When the environment starts to accumulate sibling repositories, repeated agent roles, or local services, the workspace becomes a useful level of abstraction.

## Continue

Next, see [One Repo / One Agent](one-repo-one-agent) for the smallest usable pattern.
