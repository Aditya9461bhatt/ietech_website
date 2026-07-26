import path from 'path';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { spawn, execFile } from 'child_process';

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const UPLOADS = path.join(ROOT, 'public', 'uploads');

const TYPES: Record<string, string> = { blogs: 'blogs', 'case-studies': 'case-studies' };
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseFrontmatter(raw: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {} as Record<string, string>, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[line.slice(0, idx).trim()] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}

function serializePost(meta: Record<string, string>, body: string) {
  const lines = Object.entries(meta)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      const val = String(v);
      // Quote values that would break the single-line frontmatter format.
      return /[:#]|^\s|\s$/.test(val) || val === '' ? `${k}: "${val.replace(/"/g, "'")}"` : `${k}: ${val}`;
    });
  return `---\n${lines.join('\n')}\n---\n\n${body.trim()}\n`;
}

function readBody(req: import('http').IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function git(args: string[]): Promise<{ code: number; out: string }> {
  return new Promise((resolve) => {
    execFile('git', args, { cwd: ROOT }, (err, stdout, stderr) =>
      resolve({ code: err ? 1 : 0, out: (stdout + stderr).trim() }),
    );
  });
}

function cmsApi(): Plugin {
  return {
    name: 'cms-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api', async (req, res) => {
        const url = new URL(req.url || '/', 'http://localhost');
        const send = (status: number, data: unknown) => {
          res.statusCode = status;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(data));
        };
        try {
          // ---- site.json ----
          if (url.pathname === '/site' && req.method === 'GET') {
            return send(200, JSON.parse(await fs.readFile(path.join(CONTENT, 'site.json'), 'utf8')));
          }
          if (url.pathname === '/site' && req.method === 'PUT') {
            const body = JSON.parse((await readBody(req)).toString('utf8'));
            await fs.writeFile(path.join(CONTENT, 'site.json'), JSON.stringify(body, null, 2) + '\n');
            return send(200, { ok: true });
          }

          // ---- posts ----
          const postMatch = /^\/posts\/(blogs|case-studies)(?:\/([a-z0-9-]+))?$/.exec(url.pathname);
          if (postMatch) {
            const dir = path.join(CONTENT, TYPES[postMatch[1]]);
            await fs.mkdir(dir, { recursive: true });
            const slug = postMatch[2];
            if (!slug && req.method === 'GET') {
              const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
              const posts = await Promise.all(
                files.map(async (f) => {
                  const { meta, body } = parseFrontmatter(await fs.readFile(path.join(dir, f), 'utf8'));
                  return { slug: f.replace(/\.md$/, ''), meta, content: body.trim() };
                }),
              );
              posts.sort((a, b) => (Date.parse(b.meta.dateISO || b.meta.date || '') || 0) - (Date.parse(a.meta.dateISO || a.meta.date || '') || 0));
              return send(200, posts);
            }
            if (slug) {
              const file = path.join(dir, `${slug}.md`);
              if (req.method === 'GET') {
                if (!existsSync(file)) return send(404, { error: 'not found' });
                const { meta, body } = parseFrontmatter(await fs.readFile(file, 'utf8'));
                return send(200, { slug, meta, content: body.trim() });
              }
              if (req.method === 'PUT') {
                if (!SLUG_RE.test(slug)) return send(400, { error: 'Slug must be lowercase letters/numbers separated by hyphens.' });
                const { meta, content } = JSON.parse((await readBody(req)).toString('utf8'));
                if (url.searchParams.get('new') === '1' && existsSync(file)) {
                  return send(409, { error: `"${slug}" already exists — pick another slug or edit the existing one.` });
                }
                await fs.writeFile(file, serializePost(meta, content || ''));
                return send(200, { ok: true });
              }
              if (req.method === 'DELETE') {
                if (existsSync(file)) await fs.unlink(file);
                return send(200, { ok: true });
              }
            }
          }

          // ---- image upload ----
          if (url.pathname === '/upload' && req.method === 'POST') {
            const original = decodeURIComponent(String(req.headers['x-filename'] || 'image'));
            const ext = (path.extname(original) || '.png').toLowerCase();
            if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
              return send(400, { error: 'Only png/jpg/gif/webp/svg images are allowed.' });
            }
            const base = path.basename(original, path.extname(original)).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
            await fs.mkdir(UPLOADS, { recursive: true });
            let name = `${base}${ext}`;
            let i = 1;
            while (existsSync(path.join(UPLOADS, name))) name = `${base}-${i++}${ext}`;
            await fs.writeFile(path.join(UPLOADS, name), await readBody(req));
            return send(200, { path: `/uploads/${name}` });
          }

          // ---- git status of content ----
          if (url.pathname === '/status' && req.method === 'GET') {
            const status = await git(['status', '--porcelain', '--', 'content', 'public/uploads']);
            const last = await git(['log', '-1', '--format=%h %ad %s', '--date=format:%Y-%m-%d %H:%M']);
            return send(200, {
              changes: status.out ? status.out.split('\n') : [],
              lastCommit: last.out,
            });
          }

          // ---- publish: commit content, then build + deploy, streaming logs ----
          if (url.pathname === '/publish' && req.method === 'POST') {
            res.statusCode = 200;
            res.setHeader('content-type', 'text/plain; charset=utf-8');
            res.setHeader('cache-control', 'no-cache');
            const log = (line: string) => res.write(line + '\n');

            log('▸ Committing content changes…');
            await git(['add', '--', 'content', 'public/uploads']);
            const commit = await git(['commit', '-m', 'content: update via CMS']);
            log(commit.out || '(nothing new to commit)');

            const push = await git(['push']);
            log(push.code === 0 ? '▸ Pushed to git remote.' : `▸ Git push skipped/failed (${push.out.split('\n')[0]}) — your partner can still pull after you push manually.`);

            log('▸ Building and deploying…');
            const child = spawn('bash', ['scripts/publish.sh'], { cwd: ROOT, env: process.env });
            child.stdout.on('data', (d) => res.write(d));
            child.stderr.on('data', (d) => res.write(d));
            child.on('close', (code) => {
              log(code === 0
                ? '✔ Published — the live site is updated.'
                : `✖ Deploy failed (exit ${code}). The site was NOT updated.`);
              res.end();
            });
            return;
          }

          send(404, { error: 'unknown endpoint' });
        } catch (err) {
          send(500, { error: String(err) });
        }
      });
    },
  };
}

export default defineConfig({
  root: __dirname,
  publicDir: path.join(ROOT, 'public'),
  plugins: [react(), cmsApi()],
  resolve: {
    alias: { '@site': path.join(ROOT, 'src') },
  },
  server: {
    port: 5199,
    strictPort: true,
    host: '127.0.0.1',
  },
});
