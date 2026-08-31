const base = window.__DOCS_BASE__ || '';
const docUrl = (route) => `${base}/${route ? `${route}/` : ''}`;

function applyTheme() {
  const saved = localStorage.getItem('agentic-docs-theme');
  const theme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = theme;
}

function setupTheme() {
  applyTheme();
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('agentic-docs-theme', next);
  });
}

function setupMobileMenu() {
  const button = document.querySelector('[data-mobile-menu]');
  const sidebar = document.querySelector('[data-sidebar]');
  if (!button || !sidebar) return;
  button.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => sidebar.classList.remove('open')));
}

function setupToc() {
  const target = document.querySelector('[data-toc]');
  if (!target) return;
  const headings = [...document.querySelectorAll('.prose h2, .prose h3')];
  if (!headings.length) { target.closest('.toc')?.remove(); return; }
  target.innerHTML = headings.map((heading) => `<a href="#${heading.id}" class="toc-${heading.tagName.toLowerCase()}">${heading.textContent}</a>`).join('');
  const links = [...target.querySelectorAll('a')];
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    }
  }), { rootMargin: '-15% 0px -72% 0px' });
  headings.forEach((heading) => observer.observe(heading));
}

function setupSearch() {
  const dialog = document.querySelector('[data-search-dialog]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  if (!dialog || !input || !results) return;
  let index = [];
  let selected = -1;
  fetch(`${base}/search-index.json`).then((response) => response.json()).then((data) => { index = data; }).catch(() => {});
  const close = () => { dialog.hidden = true; document.body.style.overflow = ''; };
  const open = () => { dialog.hidden = false; document.body.style.overflow = 'hidden'; input.focus(); input.select(); };
  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', open));
  document.querySelectorAll('[data-search-close]').forEach((button) => button.addEventListener('click', close));
  const render = () => {
    const query = input.value.trim().toLowerCase();
    if (!query) { results.innerHTML = '<div class="search-empty">Start typing to search the field guide.</div>'; return; }
    const matches = index.filter((item) => `${item.title} ${item.description} ${item.text} ${item.type}`.toLowerCase().includes(query)).slice(0, 10);
    selected = Math.min(selected, matches.length - 1);
    results.innerHTML = matches.length ? matches.map((item, position) => `<a class="search-result ${position === selected ? 'selected' : ''}" href="${docUrl(item.route)}"><div class="search-result-title"><span>${item.title}</span><span class="search-result-type">${item.type}</span></div><p>${item.description}</p></a>`).join('') : '<div class="search-empty">No pages match that search.</div>';
  };
  input.addEventListener('input', () => { selected = -1; render(); });
  input.addEventListener('keydown', (event) => {
    const items = [...results.querySelectorAll('.search-result')];
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowDown') { event.preventDefault(); selected = Math.min(selected + 1, items.length - 1); render(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
    if (event.key === 'Enter' && items[selected]) items[selected].click();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') { event.preventDefault(); open(); }
    if (event.key === 'Escape' && !dialog.hidden) close();
  });
}

function setupCopyButtons() {
  document.querySelectorAll('.prose pre').forEach((pre) => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.textContent = 'copy';
    button.addEventListener('click', async () => {
      await navigator.clipboard?.writeText(pre.innerText);
      button.textContent = 'copied';
      setTimeout(() => { button.textContent = 'copy'; }, 1400);
    });
    pre.append(button);
  });
}

function setupPwa() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {});
}

setupTheme();
setupMobileMenu();
setupToc();
setupSearch();
setupCopyButtons();
setupPwa();
