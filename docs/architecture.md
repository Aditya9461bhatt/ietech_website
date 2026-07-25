# How This Website Works — A Plain-English Guide

> **Who this is for:** anyone (human or AI coding tool) who needs to understand this codebase
> before changing it. No prior knowledge assumed. Every term is explained the first time it appears.

---

## The 30-second summary

Your website used to be built in a way that **worked fine for humans but was invisible to Google.**
We changed how the site is built and served so that search engines can read every page, and we put a
real lock on your database. Everything a visitor sees is the same — it's the plumbing that changed.

Three things got fixed:

1. **Findability** — Google can now read and rank each blog post and case study individually.
2. **Security** — your database now has its own lock, instead of trusting the browser.
3. **Speed** — pages load faster because the site ships less code and pre-made pages.

---

# Part 1 — Words you'll keep seeing

Read this once and the rest of the document will make sense.

### SPA (Single-Page Application)
A website where the browser downloads one JavaScript app, and that app draws every page.
When you click "Blogs", the browser doesn't fetch a new page from the server — the JavaScript
redraws the screen. Your site is an SPA (built with React).

**Why it matters:** it's fast to click around, but the *server* only ever sends one nearly-empty
file. If a visitor (or Google) can't run JavaScript, they see nothing.

### Route
Just a URL path that shows a particular screen. `/blogs` is a route. `/blog/ai-revolution-erp` is a route.

### Rendering
"Drawing the page." Two places it can happen:
- **Client-side rendering** — the browser draws it (what your site did before, and still does for interactivity).
- **Prerendering** — we draw it *ahead of time*, during the build, and save the finished HTML to a file.

### Prerendering (this is the big one)
Before deploying, we open your website in an invisible robot browser, let it fully load a page,
then **save a photograph of the finished HTML** to a file. Now the server has a real, complete page
to hand out instantly.

**Analogy:** Before, every customer waited while you cooked their meal from scratch. Now you bake
everything in the morning; when someone walks in, the food is ready. (They can still customize it
after — that's the JavaScript still running.)

### Crawler / bot
Google's program that visits your site to decide what to put in search results.

### Meta tags
Hidden lines in a page's HTML that describe the page. They don't show on screen. They control your
Google result and your WhatsApp/LinkedIn link preview. Example:

```html
<title>How AI is Revolutionizing Custom ERP Solutions | i.e tech</title>
<meta name="description" content="Everyone wants to build the next great customized software...">
```

### Canonical tag
A meta tag that says *"this is the one true address for this page."* It stops Google from thinking
two URLs are duplicate content.

```html
<link rel="canonical" href="https://ietech.ai/blog/ai-revolution-erp">
```

### Structured data (JSON-LD)
A hidden, machine-readable summary of the page, written in a format Google understands. It's what
lets Google show the author and date under your search result instead of a plain blue link.

### Firestore
Your database (part of Firebase). It stores your blogs, case studies, and contact-form submissions.

### Firestore security rules
A small rulebook that lives *inside the database* saying who may read and write what.
This is a real lock. (More in Part 3 — this is the most important security concept here.)

### nginx
The web server program that sits in front of your files and decides what to send back for each URL.

---

# Part 2 — The findability problem (and how we fixed it)

## 2.1 The killer issue: hash URLs

**What it was:** your blog links looked like this:

```
https://ietech.ai/#/blog/ai-revolution-erp
                  ↑
                  everything from here on is a "hash fragment"
```

**Why that was fatal:** web browsers never send the part after `#` to the server. It's meant for
jumping to a section on the *same* page (like `#about`). So to Google, all of these are **the exact
same page**:

```
https://ietech.ai/#/blog/ai-revolution-erp   →  Google sees: https://ietech.ai/
https://ietech.ai/#/blog/cad-integration     →  Google sees: https://ietech.ai/
https://ietech.ai/#/projects                 →  Google sees: https://ietech.ai/
```

Your entire blog was, to a search engine, one single homepage. No individual post could ever rank,
no matter how good it was.

**What we did:** switched to normal URLs.

```
Before:  https://ietech.ai/#/blog/ai-revolution-erp
After:   https://ietech.ai/blog/ai-revolution-erp
```

Now each post is a genuine, separate address that Google can index and rank.

**How this works in the code:** we use a library called **React Router**. The route list lives in
`src/App.tsx`:

| URL | What shows |
|---|---|
| `/` | Homepage |
| `/blogs` | List of blog posts |
| `/projects` | List of case studies |
| `/blog/:slug` | One blog post (`:slug` = the post's ID, e.g. `ai-revolution-erp`) |
| `/project/:slug` | One case study |
| `/admin` | CMS dashboard (login required) |
| anything else | 404 "page not found" |

---

## 2.2 The pages were empty until JavaScript ran

**What it was:** if you had right-clicked your blog post and chosen "View Page Source", you'd have
seen essentially this — no article anywhere:

```html
<body>
  <div id="root"></div>                      <!-- ← completely empty! -->
  <script src="/assets/index-abc123.js"></script>
</body>
```

The article text only appeared *after* the browser downloaded the JavaScript, ran it, and fetched
the post from Firestore. Anything that doesn't patiently do all three steps — many crawlers, and
almost every link-preview bot (WhatsApp, LinkedIn, Slack) — saw a blank page.

**What we did:** prerendering. During the build we open each page in a robot browser, wait for the
content to load, and save the finished HTML. Now "View Page Source" shows the real article:

```html
<body>
  <div id="root">
    <article>
      <h1>How AI is Revolutionizing Custom ERP Solutions</h1>
      <p>Everyone wants to build the next great customized software. It can be an
         extremely profitable way to make some money if you know what you're doing...</p>
      <!-- ...the whole post, as real HTML... -->
```

**Where it happens:** `scripts/prerender.mjs`, triggered by `npm run build:static`.

**Real result:** a blog post page went from *not existing as a URL at all* to scoring **100/100 on
Google Lighthouse's SEO check**.

---

## 2.3 Every page now describes itself

**What it was:** the whole site shared one title and description — the homepage's. So every blog
post showed up (if it showed up at all) as "i.e tech | Industry 4.0 Solutions".

**What we did:** made a small reusable component, `src/components/Seo.tsx`, that each page uses to
declare its own identity. Using it looks like this:

```jsx
<Seo
  title="How AI is Revolutionizing Custom ERP Solutions"
  description="Custom ERP systems adapt to your business instead of..."
  path="/blog/ai-revolution-erp"
  type="article"
/>
```

That one component generates all of this into the page:

```html
<title>How AI is Revolutionizing Custom ERP Solutions | i.e tech</title>
<meta name="description" content="Custom ERP systems adapt to your business instead of...">
<link rel="canonical" href="https://ietech.ai/blog/ai-revolution-erp">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:title" content="How AI is Revolutionizing Custom ERP Solutions | i.e tech">
<meta property="og:image" content="https://ietech.ai/logo.svg">
<!-- ...plus Twitter tags -->
```

The `og:` ones ("Open Graph") are what make a nice card appear when someone pastes your link into
WhatsApp or LinkedIn.

> **A bug worth knowing about.** We first used a popular library called `react-helmet-async` for
> this. React 19 has its *own* built-in way of handling these tags, and the two fought each other —
> every page ended up with **three** canonical tags:
>
> ```html
> <link rel="canonical" href="https://ietech.ai/">                     <!-- wrong -->
> <link rel="canonical" href="https://ietech.ai/">                     <!-- wrong -->
> <link rel="canonical" href="https://ietech.ai/blog/ai-revolution-erp">  <!-- right -->
> ```
>
> When Google sees multiple canonical tags it **ignores all of them**. We removed the library and
> used React 19's built-in support. Now there's exactly one of each. **Don't re-add that library.**

---

## 2.4 Structured data — how you get a *rich* Google result

Plain result vs. rich result: structured data is the difference between a bare blue link and a
result showing the author, date, and headline.

We add a hidden block to each page describing what it is. For a blog post:

```json
{
  "@type": "BlogPosting",
  "headline": "How AI is Revolutionizing Custom ERP Solutions",
  "datePublished": "October 12, 2023",
  "author": { "@type": "Person", "name": "IETECH Technical Team" },
  "publisher": { "@type": "Organization", "name": "i.e tech" }
}
```

Three kinds are in use:
- **`Organization`** on the homepage — tells Google who your company is (name, logo, contact).
- **`BlogPosting`** on blog posts.
- **`Article`** on case studies.

These are filled in automatically from your CMS fields — you don't write them by hand.

**Check yours anytime:** paste a URL into <https://search.google.com/test/rich-results>.

---

## 2.5 The sitemap and robots.txt

**`sitemap.xml`** — a list of every page on your site, handed to search engines so they don't have
to guess. Yours is **regenerated automatically on every build** by asking your database for the
current list of posts. So it's never out of date.

```xml
<url><loc>https://ietech.ai/</loc></url>
<url><loc>https://ietech.ai/blog/ai-revolution-erp</loc></url>
<url><loc>https://ietech.ai/project/macpower-cnc</loc></url>
```

**`robots.txt`** — instructions for crawlers. Yours says "index everything except the admin area,
and here's the sitemap":

```
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://ietech.ai/sitemap.xml
```

**One-time task:** submit `https://ietech.ai/sitemap.xml` in Google Search Console.

---

# Part 3 — Security

## 3.1 Why a check in the browser is not security

Your admin page had this check:

```js
const ALLOWED_ADMIN_EMAILS = ['138aditya@gmail.com'];
if (!ALLOWED_ADMIN_EMAILS.includes(user.email)) return <AccessDenied />;
```

That's a fine way to *hide the editor* from the wrong person. It is **not** a lock.

**Why:** that code runs on the visitor's own computer, and your database lives on the internet
independently of your website. Anyone can talk to the database **directly**, skipping your site
entirely. Here's a real command that talks to your database with no website involved:

```bash
curl "https://firestore.googleapis.com/v1/projects/ietech-ai/databases/(default)/documents/blogs?key=..."
```

**Analogy:** it's a "Staff Only" sign on an unlocked door. It works on polite people. It stops no one.

> The key that appears in that URL is *supposed* to be public — every Firebase website exposes it.
> It identifies your project; it doesn't grant permission. Permission comes from the rules below.

## 3.2 The real lock: Firestore security rules

These rules live **inside the database**, so they apply no matter how someone connects. Here's yours,
translated line by line:

```js
function isAdmin() {
  return request.auth != null                              // they're signed in
    && request.auth.token.email_verified == true           // with a verified email
    && request.auth.token.email == "138aditya@gmail.com";  // and it's you
}

match /blogs/{docId} {
  allow read:  if true;      // anyone may READ blog posts (they're public content)
  allow write: if isAdmin(); // only you may CREATE / EDIT / DELETE them
}

match /contact_submissions/{docId} {
  allow create: if isValidLead(); // anyone may SUBMIT the contact form...
  allow read:   if isAdmin();     // ...but only you may READ the submissions
}
```

Two things worth highlighting:

**`email_verified`** — without this, if you ever turned on email/password signup, someone could
register an account claiming your email address. Requiring a *verified* email closes that door.

**`isValidLead()`** — the contact form is open to the public, so we check the *shape* of what's
submitted: only the fields `email`, `phone`, `createdAt`, a sane email format, and size limits.
Without this, someone could script your form to write unlimited giant junk records into your
database and run up your bill.

**Important:** these rules are deployed **separately** from the website:

```bash
firebase deploy --only firestore:rules --project ietech-ai
```

This is deliberate — it means pushing website code can never accidentally weaken your data protection.

**Still recommended:** turn on **App Check** in the Firebase console. Rules verify *who* is calling;
App Check verifies the call is coming from *your actual website*. It's the best defence against
someone scripting your public contact form.

## 3.3 Security headers

Headers are instructions the server attaches to every response, telling the browser how to behave.
Your site previously sent none of these. Now (`nginx/security-headers.conf`):

| Header | In plain English |
|---|---|
| `Content-Security-Policy` | A list of which sites are allowed to run code/load resources on your page. Blocks injected malicious scripts. |
| `Strict-Transport-Security` | "Always use HTTPS for this site, never plain HTTP." |
| `X-Frame-Options` | Stops attackers embedding your site inside theirs to trick users into clicking things (clickjacking). |
| `X-Content-Type-Options` | Stops the browser guessing file types, a classic attack trick. |
| `Referrer-Policy` | Limits how much of your URL leaks to other sites when a user clicks away. |
| `Permissions-Policy` | Turns off camera, microphone, geolocation, etc. — this site never needs them. |

---

# Part 4 — Speed

Two changes did nearly all the work.

**1. The code was split into smaller pieces.** The site used to ship as one ~1 MB JavaScript file —
every visitor downloaded the admin CMS, the blog reader, and the markdown engine even when just
viewing the homepage. Now it's split so pieces load only when needed:

```
Before:  one file, ~1 MB
After:   main app        ~380 KB   (loaded always)
         firebase        ~512 KB   (loaded always — see note)
         animation       ~130 KB
         markdown        ~157 KB   (only on blog/case-study pages)
         admin           ~24 KB    (only at /admin)
```

**2. Images and fonts stopped blocking.** Images below the fold now load only as you scroll
(`loading="lazy"`), and the web font no longer delays the first paint.

**Measured result:** Lighthouse Performance went from **79 → 85**, and it was previously measured on
a homepage that at least existed — the blog pages weren't even indexable before.

> Note: the Firebase chunk still loads on the homepage. That's the biggest remaining speed
> opportunity if you ever want to chase 90+.

---

# Part 5 — How it all actually runs

## 5.1 The build (turning code into a website)

One command does all of it: `npm run build:static`

```
STEP 1  Check the TypeScript, bundle the app with Vite
           ↓
STEP 2  A normal website app lands in the dist/ folder
           ↓
STEP 3  Ask the database: "what blog posts and case studies exist right now?"
           ↓
STEP 4  Open an invisible robot browser. Visit every page. Wait for it to fully
        load. Save the finished HTML to a file.
           ↓
STEP 5  Write sitemap.xml listing every page
           ↓
STEP 6  Docker packages it all behind nginx → deploy to Google Cloud Run
```

After step 4, the `dist/` folder physically contains:

```
dist/
├── index.html                              ← the homepage, fully rendered
├── blogs/index.html                        ← the blog list page
├── blog/ai-revolution-erp/index.html       ← one real file per post
├── blog/cad-integration/index.html
├── project/macpower-cnc/index.html
├── 404.html
├── _shell.html                             ← explained below
└── sitemap.xml
```

**Two important commands — don't mix them up:**

| Command | What it does |
|---|---|
| `npm run build` | App only. **No prerendering, no sitemap.** |
| `npm run build:static` | App **+ prerendering + sitemap**. ← this is the one that deploys |

**A safety net worth knowing:** the robot browser (Chromium) needs to start inside the build
machine. If it can't, the build **does not fail** — it ships the normal app and prints a loud
`[prerender] ⚠️` warning. Worst case you get a working site without the SEO boost; you'd never get a
broken deploy. Watch your build logs for that warning.

## 5.2 Serving (what happens when someone visits)

A visitor's request travels: **their browser → Cloudflare → Google Cloud Run → nginx**.
nginx then decides, top to bottom:

| The URL looks like… | What nginx sends |
|---|---|
| `/assets/…`, `.js`, `.css`, images | The file, cached aggressively |
| `/admin` | The app shell — admin always draws in the browser after login |
| `/blog/…` or `/project/…` | The prerendered file if it exists; **if not, a blank shell** (see below) |
| `/`, `/blogs`, `/projects` | The matching prerendered page |
| anything else | A real **404** with your styled error page |

### Why `/blog/` has that special fallback

Prerendering happens at *build* time. So a post you publish **today** has no prerendered file until
the next deploy. Rather than show a 404 for a real, live post, nginx falls back to a blank shell
(`_shell.html`) and lets the browser draw the post immediately.

**The practical effect for you:**

- Publish a post → **it's live and shareable right away** (drawn in the browser).
- Deploy again later → that post gets its prerendered file, which improves its Google result and
  link previews.
- A genuinely wrong URL (typo) → shows "Post not found", marked `noindex` so Google won't keep it.

> That blank shell is deliberately *pristine* — it contains no homepage content or tags. An earlier
> version reused the homepage file as the fallback, which leaked the homepage's title and canonical
> onto blog URLs. Keep it pristine.

---

# Part 6 — Rules you must not break

Each of these encodes a decision that took real debugging. Here's what goes wrong if it's undone.

### 1. Never re-add `react-helmet-async` (or another head-tag library)
**If you do:** every page gets 3 titles and 3 canonical tags, and Google ignores canonical entirely.
**Instead:** use `src/components/Seo.tsx`, which relies on React 19's built-in support.

### 2. Never go back to hash (`#/`) URLs
**If you do:** every blog post instantly becomes un-indexable again. This was the whole problem.

### 3. Every page must render a `<Seo />` with a unique `path`
**If you forget:** that page inherits no description/canonical and competes with other pages in search.

### 4. Deploy with `build:static`, not `build`
**If you use `build`:** you ship an app with no prerendered pages and a stale sitemap — silently
losing all the SEO work. Nothing will look broken, which is what makes this dangerous.

### 5. Keep the admin email in sync in **three** places
`firestore.rules`, `src/components/AdminCMS.tsx`, `src/components/AdminDashboard.tsx`.
**If they drift:** you either lock yourself out of the CMS, or the UI lets someone in whose writes
the database then rejects.

### 6. The prerender must serve its shell from memory, not from `dist/index.html`
**If changed:** once `/` is prerendered, `dist/index.html` *becomes* the homepage. Reusing it as the
shell stamps homepage titles and canonicals onto every other page. (This was a real bug we fixed.)

### 7. Keep `createRoot`, don't switch to `hydrateRoot`
**Why:** your animation library writes moment-by-moment styles into the prerendered snapshot.
`hydrateRoot` expects the saved HTML to match what React draws, and it won't — you'd get a flood of
console errors on every animated element.

### 8. Firestore rules deploy separately
**Why:** so a website deploy can never quietly change who can read your customer leads.

### 9. New below-the-fold `<img>` gets `loading="lazy" decoding="async"`
Keep the Hero logos eager — they're at the top and should load immediately.

### 10. Adding a new *static* page? Update two files
Add the route in `src/App.tsx` **and** add its path to the `routes` list in `scripts/prerender.mjs`.
**If you only do the first:** the page works when clicked, but has no prerendered file and isn't in
the sitemap. (Blog/case-study posts are automatic — no code change needed.)

---

# Part 7 — "How do I…?"

### …publish a new blog post or case study
Write it in the CMS at `/admin`. It's live immediately. Run `./scripts/deploy_gcp.sh` when convenient
to give it a prerendered page and add it to the sitemap.

### …deploy a code change
```bash
./scripts/deploy_gcp.sh
```

### …change who can edit the CMS
Update the email in all three places (Rule #5), then deploy the code **and** the rules:
```bash
firebase deploy --only firestore:rules --project ietech-ai
```

### …check a page's SEO is working
1. Open the page, right-click → **View Page Source**.
2. You should see your real content in the HTML — not an empty `<div id="root"></div>`.
3. Search the source for `canonical` — there should be exactly **one**, pointing at that page's URL.
4. Paste the URL into <https://search.google.com/test/rich-results>.

### …test everything locally before deploying
```bash
npm run build:static   # build + prerender
npm run preview        # serve it at http://localhost:4173
```

### …see if prerendering actually ran
Look in the build output for `[prerender] ✓ /blog/...` lines (good) or a `[prerender] ⚠️` warning
(Chromium failed — site still works, but with no prerendered SEO).

---

# Part 8 — What each file does

| File | In plain English |
|---|---|
| `scripts/prerender.mjs` | The robot browser. Visits every page, saves finished HTML, writes the sitemap. |
| `src/components/Seo.tsx` | Sets each page's title, description, canonical, social preview, structured data. |
| `src/App.tsx` | The list of URLs and which screen each one shows. |
| `src/main.tsx` | Starts the app; clears prerendered tags so the live app owns them. |
| `src/components/NotFound.tsx` | The styled 404 page. |
| `src/components/Navbar.tsx` | Top navigation, using real links. |
| `src/components/BlogDetail.tsx` / `ProjectDetail.tsx` | One post / one case study, plus its SEO tags. |
| `src/components/BlogSection.tsx` / `Projects.tsx` | The list pages. |
| `src/components/AdminCMS.tsx` / `AdminDashboard.tsx` | The CMS editor and dashboard. |
| `src/context/ContactContext.tsx` | Makes the "Get in touch" popup available on every page. |
| `firestore.rules` | **The database lock.** Who may read/write what. |
| `nginx/default.conf` | Which URL gets which file; the `/blog` fallback; real 404s. |
| `nginx/security-headers.conf` | The protective headers on every response. |
| `Dockerfile` | Packages the site for deployment; installs the robot browser. |
| `vite.config.ts` | Splits the code into smaller downloadable chunks. |
| `index.html` | The bare page skeleton. Deliberately has **no** title/description — `Seo.tsx` owns those. |
| `public/robots.txt` | Crawler instructions. |
| `docs/hosting.md` | The deploy checklist. |

---

# Appendix — Things intentionally left undone

- **WebP/AVIF image conversion** — skipped. The images that actually load are referenced by URL
  inside your database records, so renaming them means updating the CMS entries too. Low payoff.
- **Delete unused images** — `public/` contains large PNGs (`shipping_logistics*`, `foundry_casting*`,
  `cnc_machining*`, `media__*`) that nothing references. They never load, so they don't slow the site
  down; deleting them just slims the repo.
- **Remove `three.js`** — it's listed as a dependency but imported nowhere, so it's already stripped
  out of what ships. Removing it only speeds up installs.
- **Auto-rebuild when publishing** — not needed. The `/blog` fallback (Part 5.2) already makes new
  posts live instantly.
- **Enable App Check** — a toggle in the Firebase console, recommended (Part 3.2).
