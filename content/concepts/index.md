---
title: Concepts
description: The small vocabulary that makes agentic workspace patterns precise.
type: Concept index
section: concepts
order: 20
readTime: 7 min read
slug: concepts
---

## The vocabulary

The patterns use a compact set of terms. Each term describes a boundary, a lifecycle, or an information flow. Together they make it possible to discuss agentic engineering without conflating the principle with one implementation.

| Concept | Short definition |
| --- | --- |
| Workspace | Git control-repository root for related repos, context, policies, Runs, and resources. |
| Repository | Independent Git history, CI, release, and engineering boundary. |
| Agent Profile | A reusable definition of an engineering role. |
| Run | One bounded agent execution. |
| Workspace Context | Shared durable knowledge available to Runs. |
| Intent | Minimal coordination information exposed to other Runs. |
| Candidate | A proposed result awaiting validation or integration. |
| Event | Durable provenance or engineering history. |
| Knowledge Proposal | A suggestion to promote a discovery or decision into shared knowledge. |
| Resource | A runtime dependency such as a port, process, service, or namespace. |
| Integration | Validation and promotion of a Candidate into canonical history. |

## A lifecycle view

```text
Workspace Context → Run → Intent → Candidate → Integration
                        │          │
                        └→ Events  └→ Knowledge Proposal
```

The vocabulary is intentionally implementation-independent. A local SQLite coordinator, a daemon, or an external scheduler can expose the same conceptual objects.

## Read next

Start with [Workspace](workspace), then [Run](run) and [Integration](integration). The more operational terms become useful once you reach the patterns.
