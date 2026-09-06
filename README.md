# Agentic Engineering Workspace Documentation

An implementation-independent field guide for helping coding agents understand
and work across independent repositories with shared context, narrow mutation
boundaries, and durable results.

The site is Markdown-first and statically generated. The `content/` tree is the source of truth; `site/` is the generated GitHub Pages artifact.

The architecture is intentionally independent of any particular CLI. The
recommended physical convention is a Git-managed System Workspace control
repository opened as the coding agent’s project root. Independently
Git-managed repositories are checked out below its ignored `repos/` directory.
In the dogfood checkout, this repository is therefore expected at
`repos/doc-pages/`, alongside `repos/reference-implmentation/` and
`repos/example-workspace/`.

Read [Product Design](content/start-here/product-design.md) for the product
boundary and [Implementation Plan](content/reference/implementation-plan.md)
for phased work, ownership, repository reuse, and acceptance evidence.

## Local development

Requires Node.js 18+.

```sh
npm run build
npm run dev
```

Open <http://localhost:4173>. To test a GitHub Pages subpath locally:

```sh
SITE_BASE=/agentic-workspace npm run build
```

## Content map

```text
content/
├── start-here/
├── concepts/
├── patterns/
├── decisions/
├── extensions/
├── limitations/
├── examples/
└── reference/
```

Each Markdown page starts with front matter for `title`, `description`, `type`, `section`, `order`, `readTime`, and `slug`.

## Verify the reference mapping

To exercise the optional implementation, run it from the Git control
repository—the directory you open in the coding agent. `ws init` creates the
durable `.workspace/` metadata, and `ws generate` creates the root
`AGENTS.md` and workspace skills under `.agents/skills/`:

```sh
cd /path/to/dogfood-workspace
ws init
ws repo clone https://example.com/example-workspace.git \
  --name example --role primary --path repos/example-workspace
ws repo clone https://example.com/reference-implmentation.git \
  --name reference --role implementation --path repos/reference-implmentation
ws repo clone https://example.com/doc-pages.git \
  --name docs --role documentation --path repos/doc-pages
ws generate
ws run coder "Add a greeting" --repo example \
  --context-repo reference --context-repo docs --no-integrate
```

The CLI records a bounded Run and Candidate while the canonical nested
repository stays clean. `ws repo sync [name]` materializes missing URL-backed
checkouts and leaves existing ones unchanged; `ws repo add` registers a local
Git checkout and infers its `origin` URL unless `--url` is supplied. See
[Reference Implementation](content/reference/index.md) for the provider
mapping, inspection/integration flow, and explicit V1 limitations. The
implementation can be verified independently with `pnpm test` (or
`pnpm check`) from `repos/reference-implmentation/`.

## Deployment

`.github/workflows/pages.yml` builds the site and deploys it to GitHub Pages on pushes to `master` or `main`. The build accepts `SITE_BASE` and `SITE_URL` so the same output works under a project subpath or a future custom domain.
