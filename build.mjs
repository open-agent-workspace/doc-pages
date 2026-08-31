import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(root, 'content');
const outputDir = path.join(root, 'site');
const basePath = (process.env.SITE_BASE ?? '').replace(/\/$/, '');
const siteOrigin = (process.env.SITE_URL ?? 'https://example.github.io/agentic-engineering-workspace').replace(/\/$/, '');
const checkOnly = process.argv.includes('--check');

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slugify = (value) => value.toLowerCase().trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_]+/g, '-')
  .replace(/-+/g, '-');

function parseFrontMatter(source, filePath) {
  if (!source.startsWith('---')) {
    throw new Error(`Missing front matter: ${filePath}`);
  }
  const end = source.indexOf('\n---', 3);
  if (end === -1) throw new Error(`Unclosed front matter: ${filePath}`);
  const raw = source.slice(4, end).trim().split('\n');
  const data = {};
  for (const line of raw) {
    const match = line.match(/^([\w-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[match[1]] = value;
  }
  return { data, body: source.slice(end + 4).trim() };
}

function inlineMarkdown(value) {
  let text = esc(value);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${esc(href)}">${label}</a>`);
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text;
}

function markdownToHtml(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const html = [];
  let paragraph = [];
  let listType = null;
  let code = null;
  let tableOpen = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };
  const closeCode = () => {
    if (code) {
      const className = code.lang === 'diagram' ? ' class="diagram"' : '';
      html.push(`<pre${className}><code>${esc(code.lines.join('\n'))}</code></pre>`);
      code = null;
    }
  };
  const closeTable = () => {
    if (tableOpen) {
      html.push('</tbody></table>');
      tableOpen = false;
    }
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushParagraph();
      closeList();
      if (code) closeCode();
      else code = { lang: line.slice(3).trim(), lines: [] };
      continue;
    }
    if (code) {
      code.lines.push(line);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      closeList();
      closeTable();
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      closeTable();
      const level = heading[1].length;
      const text = heading[2].replace(/[`*_]/g, '').trim();
      html.push(`<h${level} id="${slugify(text)}">${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      closeList();
      closeTable();
      html.push('<hr>');
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      closeList();
      closeTable();
      html.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
      continue;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      closeTable();
      const nextType = unordered ? 'ul' : 'ol';
      if (listType !== nextType) {
        closeList();
        listType = nextType;
        html.push(`<${listType}>`);
      }
      html.push(`<li>${inlineMarkdown((unordered ?? ordered)[1])}</li>`);
      continue;
    }
    if (line.includes('|') && line.trim().startsWith('|')) {
      flushParagraph();
      closeList();
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
      if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;
      if (!tableOpen) {
        tableOpen = true;
        html.push('<table><thead><tr>' + cells.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('') + '</tr></thead><tbody>');
      } else {
        html.push('<tr>' + cells.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('') + '</tr>');
      }
      continue;
    }
    closeTable();
    paragraph.push(line.trim());
  }
  flushParagraph();
  closeList();
  closeCode();
  closeTable();
  return html.join('\n');
}

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? getMarkdownFiles(target) : target.endsWith('.md') ? [target] : [];
  });
}

function routeFor(meta, filePath) {
  if (Object.hasOwn(meta, 'slug')) return meta.slug.replace(/^\//, '').replace(/\/$/, '');
  return path.relative(contentDir, filePath).replace(/\.md$/, '').replace(/\\/g, '/');
}

function assetUrl(file) {
  return `${basePath}/assets/${file}` || `/assets/${file}`;
}

const files = getMarkdownFiles(contentDir);
const pages = files.map((filePath) => {
  const parsed = parseFrontMatter(fs.readFileSync(filePath, 'utf8'), filePath);
  const meta = parsed.data;
  return {
    ...meta,
    order: Number(meta.order ?? 99),
    route: routeFor(meta, filePath),
    filePath,
    body: parsed.body,
    html: markdownToHtml(parsed.body),
  };
}).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

const groups = [
  { key: 'start-here', label: 'Start here', icon: '01' },
  { key: 'concepts', label: 'Concepts', icon: '02' },
  { key: 'patterns', label: 'Patterns', icon: '03' },
  { key: 'decisions', label: 'Decisions', icon: '04' },
  { key: 'extensions', label: 'Extensions', icon: '05' },
  { key: 'limitations', label: 'Boundaries', icon: '06' },
  { key: 'examples', label: 'Examples', icon: '07' },
  { key: 'reference', label: 'Reference', icon: '08' },
];

function pageUrl(route) {
  return `${basePath}/${route ? `${route}/` : ''}` || '/';
}

function navHtml(currentRoute) {
  return groups.map((group) => {
    const items = pages.filter((page) => page.section === group.key).sort((a, b) => a.order - b.order);
    if (!items.length) return '';
    return `<div class="nav-group"><div class="nav-label"><span>${group.icon}</span>${group.label}</div>${items.map((page) => `<a class="nav-link ${page.route === currentRoute ? 'active' : ''}" href="${pageUrl(page.route)}" data-nav-route="${page.route}">${esc(page.title)}</a>`).join('')}</div>`;
  }).join('');
}

function layout(page, content, isHome = false) {
  const title = isHome ? 'Agentic Engineering Workspace' : `${page.title} — Agentic Engineering Workspace`;
  const description = page?.description ?? 'Open patterns for building a workspace where coding agents can work safely, concurrently, and continuously.';
  const canonical = `${siteOrigin}/${page?.route ? `${page.route}/` : ''}`;
  const activeRoute = page?.route ?? '';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0b1117">
    <meta name="description" content="${esc(description)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:type" content="website">
    <link rel="canonical" href="${canonical}">
    <link rel="manifest" href="${basePath}/manifest.webmanifest">
    <link rel="icon" href="${assetUrl('icon.svg')}" type="image/svg+xml">
    <link rel="stylesheet" href="${assetUrl('styles.css')}">
    <title>${esc(title)}</title>
  </head>
  <body data-route="${esc(activeRoute)}">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="${pageUrl('')}" aria-label="Agentic Engineering Workspace home">
          <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
          <span><strong>agentic</strong><small>engineering workspace</small></span>
        </a>
        <div class="topbar-actions">
          <button class="icon-button mobile-menu-button" type="button" aria-label="Open navigation" aria-expanded="false" data-mobile-menu>☰</button>
          <button class="search-trigger" type="button" data-search-open><span class="search-glyph">⌕</span><span>Search docs</span><kbd>/</kbd></button>
          <button class="icon-button" type="button" aria-label="Toggle color theme" data-theme-toggle>◐</button>
          <a class="github-link" href="https://github.com/" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
        </div>
      </header>
      <div class="body-grid">
        <aside class="sidebar" data-sidebar>
          <div class="sidebar-intro"><span class="eyebrow">FIELD GUIDE / V1</span><p>Open patterns for continuous engineering with coding agents.</p></div>
          <nav aria-label="Documentation">${navHtml(activeRoute)}</nav>
          <div class="sidebar-footer"><span class="status-dot"></span>Static · offline-ready</div>
        </aside>
        <main id="main-content" class="main-content">
          ${content}
        </main>
      </div>
    </div>
    <div class="search-dialog" data-search-dialog hidden>
      <div class="search-backdrop" data-search-close></div>
      <section class="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div class="search-panel-head"><span id="search-title">Search documentation</span><button class="icon-button" type="button" aria-label="Close search" data-search-close>×</button></div>
        <label class="search-input-wrap"><span class="search-glyph">⌕</span><input type="search" placeholder="Try “worktree”, “intent”, or “offline”" autocomplete="off" data-search-input></label>
        <div class="search-results" data-search-results><div class="search-empty">Start typing to search the field guide.</div></div>
        <div class="search-hint"><kbd>↑</kbd><kbd>↓</kbd> to navigate <span>·</span> <kbd>Esc</kbd> to close</div>
      </section>
    </div>
    <script>window.__DOCS_BASE__ = ${JSON.stringify(basePath)};</script>
    <script src="${assetUrl('app.js')}" defer></script>
  </body>
</html>`;
}

function pageContent(page, index, allPages) {
  const siblings = allPages.filter((item) => item.section === page.section).sort((a, b) => a.order - b.order);
  const position = siblings.findIndex((item) => item.route === page.route);
  const previous = siblings[position - 1];
  const next = siblings[position + 1];
  const typeClass = (page.type ?? 'doc').toLowerCase().replaceAll(' ', '-');
  return `<article class="doc-page">
    <div class="breadcrumbs"><a href="${pageUrl('')}">Home</a><span>/</span><span>${esc(groups.find((g) => g.key === page.section)?.label ?? 'Docs')}</span><span>/</span><span>${esc(page.title)}</span></div>
    <header class="doc-header">
      <div class="doc-kicker"><span class="type-pill ${typeClass}">${esc(page.type ?? 'DOC')}</span><span class="read-time">${esc(page.readTime ?? '6 min read')}</span></div>
      <h1>${inlineMarkdown(page.title)}</h1>
      <p class="lede">${inlineMarkdown(page.description ?? '')}</p>
    </header>
    <div class="doc-layout"><div class="prose">${page.html}</div><aside class="toc" aria-label="On this page"><div class="toc-title">ON THIS PAGE</div><div data-toc></div></aside></div>
    <footer class="doc-footer"><div class="doc-nav">${previous ? `<a href="${pageUrl(previous.route)}" class="doc-nav-link"><span>← Previous</span><strong>${esc(previous.title)}</strong></a>` : '<span></span>'}${next ? `<a href="${pageUrl(next.route)}" class="doc-nav-link next"><span>Next →</span><strong>${esc(next.title)}</strong></a>` : '<span></span>'}</div><div class="source-note">Source-controlled Markdown · <a href="https://github.com/">Suggest an edit ↗</a></div></footer>
  </article>`;
}

function homeContent(page) {
  const start = pages.filter((item) => item.section === 'start-here').sort((a, b) => a.order - b.order);
  return `<section class="home-hero">
    <div class="hero-copy"><div class="eyebrow">A FIELD GUIDE FOR AGENTIC SYSTEMS</div><h1>Engineering work needs a <em>workspace.</em></h1><p class="hero-lede">When coding agents run for hours, in parallel, across related repositories, the repository is no longer the whole environment.</p><div class="hero-actions"><a class="button primary" href="${pageUrl(start[0]?.route ?? 'start-here/why-a-workspace')}">Start here <span>→</span></a><a class="text-link" href="${pageUrl('patterns')}">Browse patterns <span>↗</span></a></div></div>
    <div class="hero-diagram"><div class="diagram-label">THE SHIFT</div><div class="diagram-stack"><div><span class="step-no">01</span><strong>Repository</strong><small>source + history</small></div><i>↓</i><div class="highlight"><span class="step-no">02</span><strong>Workspace</strong><small>system context</small></div><i>↓</i><div><span class="step-no">03</span><strong>Isolated runs</strong><small>bounded execution</small></div><i>↓</i><div><span class="step-no">04</span><strong>Continuous engineering</strong><small>roles that keep going</small></div></div></div>
  </section>
  <section class="home-section manifesto"><div class="section-index">00 / MANIFESTO</div><div><h2>The architecture is open.<br><span>The reference implementation is only one implementation.</span></h2><p>These docs describe principles, trade-offs, and boundaries for self-managed agentic engineering. The goal is a shared language—not another CLI manual.</p></div></section>
  <section class="home-section route-cards"><div class="section-index">01 / ORIENTATION</div><div class="card-grid"><a class="feature-card" href="${pageUrl(start[0]?.route ?? 'start-here/why-a-workspace')}"><span class="card-number">01</span><h3>Start with the why</h3><p>Move from one repository and one agent to a system that can support concurrency.</p><span class="card-arrow">→</span></a><a class="feature-card" href="${pageUrl('concepts')}"><span class="card-number">02</span><h3>Learn the vocabulary</h3><p>Workspace, Run, Intent, Candidate, Event, Resource, Integration.</p><span class="card-arrow">→</span></a><a class="feature-card dark-card" href="${pageUrl('patterns')}"><span class="card-number">03</span><h3>Use the patterns</h3><p>Twelve composable patterns, each with limits and extension points.</p><span class="card-arrow">→</span></a></div></section>
  <section class="home-section home-callout"><div class="quote-mark">“</div><blockquote>Context scope can be larger than mutation scope.</blockquote><p>Agents may read across a system while every Run keeps its write boundary explicit and isolated.</p><a class="text-link" href="${pageUrl('patterns/p03-read-many-write-one')}">See the pattern <span>→</span></a></section>
  <section class="home-section home-meta"><div><span class="eyebrow">DOCUMENTATION STATUS</span><strong>${pages.length - 1} pages in the first slice</strong></div><div><span class="eyebrow">DELIVERY MODEL</span><strong>Static HTML · PWA · GitHub Pages</strong></div><div><span class="eyebrow">SOURCE OF TRUTH</span><strong>Markdown in the repository</strong></div></section>`;
}

function writeFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

if (!checkOnly) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.cpSync(path.join(root, 'assets'), path.join(outputDir, 'assets'), { recursive: true });
  writeFile(path.join(outputDir, 'manifest.webmanifest'), JSON.stringify({
    name: 'Agentic Engineering Workspace', short_name: 'Agentic Workspace', start_url: `${basePath}/`, scope: `${basePath}/`, display: 'standalone', background_color: '#0b1117', theme_color: '#0b1117', description: 'Open patterns for continuous engineering with coding agents.', icons: [{ src: `${basePath}/assets/icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
  }, null, 2));
  for (const page of pages) {
    const body = page.route === '' ? homeContent(page) : pageContent(page, pages.indexOf(page), pages);
    writeFile(path.join(outputDir, page.route, 'index.html'), layout(page, body, page.route === ''));
  }
  const searchIndex = pages.map(({ title, description, type, section, route, body }) => ({ title, description, type, section, route, text: body.replace(/[#>*_`-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1200) }));
  writeFile(path.join(outputDir, 'search-index.json'), JSON.stringify(searchIndex));
  const precache = ['/', '/manifest.webmanifest', '/search-index.json', '/assets/styles.css', '/assets/app.js', '/assets/icon.svg', ...pages.map((page) => `/${page.route ? `${page.route}/` : ''}`)];
  const sw = fs.readFileSync(path.join(root, 'assets', 'sw.js'), 'utf8').replace('__BASE_PATH__', JSON.stringify(basePath)).replace('__PRECACHE_URLS__', JSON.stringify(precache));
  writeFile(path.join(outputDir, 'sw.js'), sw);
  writeFile(path.join(outputDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${siteOrigin}/${page.route ? `${page.route}/` : ''}</loc></url>`).join('')}</urlset>`);
  writeFile(path.join(outputDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`);
  writeFile(path.join(outputDir, '404.html'), layout(pages.find((page) => page.route === 'limitations') ?? pages[0], `<section class="empty-page"><span class="eyebrow">404 / NOT FOUND</span><h1>This route drifted.</h1><p>The page you’re looking for isn’t in this workspace yet.</p><a class="button primary" href="${pageUrl('')}">Return home <span>→</span></a></section>`));
}

console.log(`${checkOnly ? 'Validated' : 'Built'} ${pages.length} documentation pages${basePath ? ` for ${basePath}` : ''}.`);
