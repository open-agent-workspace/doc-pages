# Agentic Engineering Workspace Documentation

An implementation-independent field guide for building workspaces where coding agents can work safely, concurrently, and continuously.

The site is Markdown-first and statically generated. The `content/` tree is the source of truth; `site/` is the generated GitHub Pages artifact.

The architecture is intentionally independent of any particular CLI. In the
full workspace checkout, the optional concrete implementation lives beside
this repository at `../reference-implmentation/` (the directory name is
historical), and its deterministic dogfood fixture is at
`../example-workspace/`.

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

To exercise the optional implementation, initialize the sibling fixture with a
base commit before asking it to create a worktree:

```sh
cd ../example-workspace
git branch -M main
git add .
git commit -m "Create example workspace fixture"
node ../reference-implmentation/bin/ws.js run coder "Add a greeting" --no-integrate
```

The CLI records a bounded Run and Candidate while the canonical checkout stays
clean. See [Reference Implementation](content/reference/index.md) for the
provider mapping, inspection/integration flow, and explicit V1 limitations.
The implementation can be verified independently with `pnpm test` (or
`pnpm check`) from `reference-implmentation/`.

## Deployment

`.github/workflows/pages.yml` builds the site and deploys it to GitHub Pages on pushes to `master` or `main`. The build accepts `SITE_BASE` and `SITE_URL` so the same output works under a project subpath or a future custom domain.
