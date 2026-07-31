import path from 'path';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { spawn, execFile } from 'child_process';
import net from 'net';

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

// ---- business cards -----------------------------------------------------------
const CARDS_DIR = path.join(ROOT, 'public', 'businesscard');
const CONTACTS_DIR = path.join(CARDS_DIR, 'contacts');
const REDIRECTS_FILE = path.join(ROOT, 'public', '_redirects');
const CARD_MARKER = '<!-- ietech-cms-card -->';
/** Profiles that came from the original card-app build — vcf editable, page/delete protected. */
const ORIGINAL_CARDS = ['aditya', 'jayraj', 'rishi'];

interface CardFields {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  note: string;
}

const vcfEscape = (v: string) => v.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\r?\n/g, '\\n');
const vcfUnescape = (v: string) => v.replace(/\\n/g, '\n').replace(/\\([,;])/g, '$1').replace(/\\\\/g, '\\');

function buildVcf(f: CardFields) {
  const parts = f.fullName.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  const first = parts.slice(0, parts.length > 1 ? -1 : undefined).join(' ');
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vcfEscape(last)};${vcfEscape(first)};;;`,
    `FN:${vcfEscape(f.fullName.trim())}`,
    'ORG:i.e. tech',
    `TITLE:${vcfEscape(f.title.trim())}`,
    `TEL;TYPE=CELL,VOICE:${f.phone.replace(/[^\d+]/g, '')}`,
    `EMAIL;TYPE=PREF,INTERNET:${f.email.trim()}`,
    'URL:https://ietech.ai',
    ...(f.note.trim() ? [`NOTE:${vcfEscape(f.note.trim())}`] : []),
    'END:VCARD',
    '',
  ].join('\n');
}

function parseVcf(raw: string): CardFields {
  const get = (re: RegExp) => vcfUnescape((re.exec(raw)?.[1] || '').trim());
  return {
    fullName: get(/^FN:(.*)$/m),
    title: get(/^TITLE:(.*)$/m),
    phone: get(/^TEL[^:]*:(.*)$/m),
    email: get(/^EMAIL[^:]*:(.*)$/m),
    note: get(/^NOTE:(.*)$/m),
  };
}

const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Standalone profile page for CMS-created cards (original app pages are never overwritten). */
function cardPageHtml(slug: string, f: CardFields) {
  const name = esc(f.fullName.trim());
  const phoneClean = f.phone.replace(/[^\d+]/g, '');
  return `<!doctype html>
<html lang="en">
<head>
${CARD_MARKER}
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>i.e. TECH | ${name}</title>
<meta name="description" content="Digital business card — ${name}, ${esc(f.title)} at i.e. tech">
<meta name="robots" content="noindex">
<meta property="og:title" content="i.e. TECH | ${name}">
<meta property="og:description" content="${esc(f.title)} at i.e. tech">
<meta property="og:type" content="profile">
<meta property="og:url" content="https://ietech.ai/businesscard/${slug}">
<meta property="og:image" content="https://ietech.ai/businesscard/og-card.png">
<link rel="icon" type="image/svg+xml" href="/businesscard/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { min-height: 100vh; background: #0a0a0a; color: #fff; font-family: 'Montserrat', sans-serif; display: grid; place-items: center; padding: 24px; }
  .card { width: 100%; max-width: 380px; border: 1px solid rgba(255,255,255,0.12); background: #000; padding: 40px 32px; text-align: center; }
  .logo { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 28px; }
  .logo .box { background: #fff; color: #000; font-weight: 700; font-size: 20px; padding: 2px 8px; }
  .logo .tech { color: #7fa3cf; font-weight: 700; font-size: 20px; letter-spacing: -0.5px; }
  h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
  .role { margin-top: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #3F618C; }
  .note { margin-top: 14px; font-size: 13px; line-height: 1.6; color: #9ca3af; }
  .rows { margin-top: 28px; display: grid; gap: 10px; text-align: left; }
  .rows a { display: block; border: 1px solid rgba(255,255,255,0.12); padding: 12px 14px; color: #d4d4d4; text-decoration: none; font-size: 13px; transition: border-color .2s, color .2s; }
  .rows a:hover { border-color: #3F618C; color: #fff; }
  .rows a span { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; margin-bottom: 3px; }
  .save { display: block; margin-top: 22px; background: #fff; color: #000; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; padding: 14px; text-decoration: none; transition: background .2s; }
  .save:hover { background: #d4d4d4; }
  .site { display: inline-block; margin-top: 20px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #6b7280; text-decoration: none; }
  .site:hover { color: #7fa3cf; }
</style>
</head>
<body>
  <main class="card">
    <div class="logo"><span class="box">i.e.</span><span class="tech">TECH</span></div>
    <h1>${name}</h1>
    <p class="role">${esc(f.title)}</p>
    ${f.note.trim() ? `<p class="note">${esc(f.note)}</p>` : ''}
    <div class="rows">
      <a href="tel:${phoneClean}"><span>Call</span>${esc(f.phone)}</a>
      <a href="mailto:${esc(f.email)}"><span>Email</span>${esc(f.email)}</a>
    </div>
    <a class="save" href="/businesscard/contacts/${slug}.vcf" download="${slug}.vcf">Save contact</a>
    <a class="site" href="https://ietech.ai/">ietech.ai</a>
  </main>
</body>
</html>
`;
}

/** Rewrite the managed vcard-shortcut block in public/_redirects from the contacts dir. */
async function syncCardRedirects() {
  const slugs = existsSync(CONTACTS_DIR)
    ? (await fs.readdir(CONTACTS_DIR)).filter((f) => f.endsWith('.vcf')).map((f) => f.replace(/\.vcf$/, '')).sort()
    : [];
  const START = '# --- vcard-shortcuts (managed by the CMS Business Cards panel — do not edit by hand) ---';
  const END = '# --- end vcard-shortcuts ---';
  const lines = slugs.flatMap((s) => [
    `/businesscard_${s} /businesscard/contacts/${s}.vcf 302`,
    `/buisnesscard_${s} /businesscard/contacts/${s}.vcf 302`,
  ]);
  const block = [START, ...lines, END].join('\n');
  let raw = existsSync(REDIRECTS_FILE) ? await fs.readFile(REDIRECTS_FILE, 'utf8') : '';
  const si = raw.indexOf(START);
  const ei = raw.indexOf(END);
  if (si !== -1 && ei > si) {
    raw = raw.slice(0, si) + block + raw.slice(ei + END.length);
  } else {
    raw = `${raw.trimEnd()}\n\n${block}\n`;
  }
  await fs.writeFile(REDIRECTS_FILE, raw.endsWith('\n') ? raw : raw + '\n');
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

/** Live preview needs the real site dev server — start one if none is running. */
function ensurePreviewServer() {
  const sock = net.connect(5173, '127.0.0.1');
  sock.once('connect', () => sock.destroy());
  sock.once('error', () => {
    console.log('[cms] starting site preview server on http://localhost:5173 …');
    const child = spawn('npx', ['vite', '--port', '5173', '--strictPort'], {
      cwd: ROOT,
      stdio: 'ignore',
    });
    const stop = () => { try { child.kill(); } catch { /* gone */ } };
    process.on('exit', stop);
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  });
}

function cmsApi(): Plugin {
  return {
    name: 'cms-api',
    configureServer(server: ViteDevServer) {
      ensurePreviewServer();
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

          // ---- business cards ----
          if (url.pathname === '/cards' && req.method === 'GET') {
            await fs.mkdir(CONTACTS_DIR, { recursive: true });
            const files = (await fs.readdir(CONTACTS_DIR)).filter((f) => f.endsWith('.vcf'));
            const cards = await Promise.all(
              files.map(async (f) => {
                const slug = f.replace(/\.vcf$/, '');
                const fields = parseVcf(await fs.readFile(path.join(CONTACTS_DIR, f), 'utf8'));
                const pageFile = path.join(CARDS_DIR, slug, 'index.html');
                const pageExists = existsSync(pageFile);
                const generated = pageExists && (await fs.readFile(pageFile, 'utf8')).includes(CARD_MARKER);
                return { slug, ...fields, pageExists, original: ORIGINAL_CARDS.includes(slug), generated };
              }),
            );
            cards.sort((a, b) => a.fullName.localeCompare(b.fullName));
            return send(200, cards);
          }
          const cardMatch = /^\/cards\/([a-z0-9-]+)$/.exec(url.pathname);
          if (cardMatch) {
            const slug = cardMatch[1];
            const vcfFile = path.join(CONTACTS_DIR, `${slug}.vcf`);
            const pageFile = path.join(CARDS_DIR, slug, 'index.html');
            if (req.method === 'PUT') {
              if (!SLUG_RE.test(slug)) return send(400, { error: 'Slug must be lowercase letters/numbers separated by hyphens.' });
              const f = JSON.parse((await readBody(req)).toString('utf8')) as CardFields;
              if (!f.fullName?.trim() || !f.email?.trim() || !f.phone?.trim() || !f.title?.trim()) {
                return send(400, { error: 'Name, title, phone, and email are all required.' });
              }
              if (url.searchParams.get('new') === '1' && existsSync(vcfFile)) {
                return send(409, { error: `"${slug}" already exists — pick another slug or edit the existing card.` });
              }
              await fs.mkdir(CONTACTS_DIR, { recursive: true });
              await fs.writeFile(vcfFile, buildVcf(f));
              // Never overwrite an original card-app page; (re)generate CMS pages only.
              const canWritePage = !existsSync(pageFile) || (await fs.readFile(pageFile, 'utf8')).includes(CARD_MARKER);
              if (canWritePage) {
                await fs.mkdir(path.dirname(pageFile), { recursive: true });
                await fs.writeFile(pageFile, cardPageHtml(slug, f));
              }
              await syncCardRedirects();
              return send(200, { ok: true, pageGenerated: canWritePage });
            }
            if (req.method === 'DELETE') {
              if (ORIGINAL_CARDS.includes(slug)) {
                return send(400, { error: 'The founder cards are protected — edit them instead of deleting.' });
              }
              if (existsSync(vcfFile)) await fs.unlink(vcfFile);
              if (existsSync(pageFile) && (await fs.readFile(pageFile, 'utf8')).includes(CARD_MARKER)) {
                await fs.rm(path.dirname(pageFile), { recursive: true, force: true });
              }
              await syncCardRedirects();
              return send(200, { ok: true });
            }
          }

          // ---- git status of content ----
          if (url.pathname === '/status' && req.method === 'GET') {
            const status = await git(['status', '--porcelain', '--', 'content', 'public/uploads', 'public/businesscard', 'public/_redirects']);
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
            await git(['add', '--', 'content', 'public/uploads', 'public/businesscard', 'public/_redirects']);
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
  // Own dep cache — sharing node_modules/.vite with the site dev server makes
  // the two invalidate each other's optimized deps (504 Outdated Optimize Dep).
  cacheDir: path.join(__dirname, '.vite'),
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
