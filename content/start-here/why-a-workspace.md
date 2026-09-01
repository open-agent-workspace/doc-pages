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

A workspace is a logical boundary around related repositories, shared
engineering knowledge, policies, skills, resources, and agent Runs. The
recommended coding-agent convention gives that boundary a concrete home: a
Git-managed control repository opened as the project root.

The managed repositories remain independent Git checkouts below the ignored
`repos/` directory. This lets the coding agent work from one folder without
turning the system into a monorepo.

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
workspace/                         # Git control repository / agent root
├── AGENTS.md                      # generated root instructions
├── .agents/skills/                # generated workspace skills
├── .workspace/                    # manifest, context, history, runtime
├── .gitignore                     # ignores repos/ and runtime state
└── repos/                         # ignored independent Git repositories
    ├── service/
    └── documentation/
```

The control repository owns the workspace map and durable guidance. Each
nested repository owns its own source, branches, CI, release lifecycle, and
integration. This separation lets teams add coordination without turning every
repository into a distributed system.

## One project root, two execution scopes

Open the control-repository root in the interactive coding agent. The
generated `AGENTS.md` points the driver to `.workspace/`, `.agents/skills/`,
and the `ws` workflow. The driver can clone or sync repositories, update
workspace knowledge, regenerate guidance, and start bounded Runs.

`ws run` then gives a task agent an isolated worktree for one mutation
repository. It can read selected context repositories, but its Candidate and
integration path belong to the declared write target. The driver and the
bounded Run therefore share one workspace map without sharing a writable
checkout.

## Bootstrap

```sh
mkdir my-workspace && cd my-workspace
ws init
ws repo clone <git-url> --name service --role primary --path repos/service
ws repo clone <git-url> --name docs --role documentation --path repos/docs
ws generate
git add AGENTS.md .agents .workspace .gitignore
git commit -m "Initialize coding-agent workspace"
```

Use `ws repo add <path> [--url <git-url>]` for an existing checkout and
`ws repo sync [name]` when you explicitly want to materialize a missing URL-backed
repository. No submodule is needed for this convention.

## Trade-offs

The workspace concept simplifies cross-repository orientation and shared conventions. It adds a boundary that must be named, documented, and kept current. For a small project with one human and one short-lived agent, a repository may be all you need.

When the environment starts to accumulate sibling repositories, repeated agent roles, or local services, the workspace becomes a useful level of abstraction.

## Continue

Next, see [One Repo / One Agent](one-repo-one-agent) for the smallest usable pattern.
