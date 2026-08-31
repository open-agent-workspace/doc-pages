import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
execFileSync(process.execPath, [path.join(root, 'build.mjs')], { stdio: 'inherit' });
const site = path.join(root, 'site');
const port = Number(process.env.PORT ?? 4173);
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

http.createServer((request, response) => {
  const urlPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const requested = path.join(site, urlPath);
  const target = fs.existsSync(requested) && fs.statSync(requested).isFile() ? requested : path.join(requested, 'index.html');
  const fallback = fs.existsSync(target) ? target : path.join(site, '404.html');
  response.writeHead(fallback.endsWith('404.html') ? 404 : 200, { 'Content-Type': mime[path.extname(fallback)] ?? 'text/plain' });
  response.end(fs.readFileSync(fallback));
}).listen(port, '127.0.0.1', () => console.log(`Docs running at http://localhost:${port}`));
