# The CMS — how it works

The CMS is a **local-only app**. It is never part of the public website — no
admin pages, no login, no CMS code ships to visitors at all. It runs on your
own computer and edits plain files in this repo.

## Run it

```bash
npm run cms          # opens http://127.0.0.1:5199 in your browser
```

What you can edit:

- **Blogs** and **Case Studies** — markdown with a live preview. Use the 🖼
  toolbar button (or paste an image straight into the text) to upload and
  insert images/graphs inline. Each post has a Draft/Published switch;
  drafts never appear on the site.
- **Site Text** — every extracted string on the website: hero, products,
  navigation menus, contact popup, footer, page headers, and the contact
  people (name/email/phone used everywhere).

**Saving only writes files on your computer.** The live website changes
only when you press **🚀 Publish to Live**, which:

1. commits your content changes to git (and pushes, so your partner can pull),
2. rebuilds the static site (`npm run build:static`),
3. deploys it — by default to **Cloudflare Pages** (free, takes seconds).

One-time setup per machine for publishing:

```bash
npx wrangler login                                  # sign in to Cloudflare
npx wrangler pages project create ietech-website    # once per account
```

Then point the `ietech.ai` custom domain at the Pages project in the
Cloudflare dashboard (Pages → ietech-website → Custom domains). After that,
the old Cloud Run service, load balancer, and proxy worker can be shut down.
Until you switch the domain, the legacy path still works:
`PUBLISH_TARGET=gcp ./scripts/publish.sh`.

## Setting up your business partner

On their machine, once:

```bash
git clone <this repo>
cd ietech_website
npm install
npx wrangler login         # needed only for the Publish button
npm run cms
```

Before editing, pull the latest content (`git pull`) so you don't overwrite
each other. Everything content-related lives in:

- `content/site.json` — site text
- `content/blogs/*.md`, `content/case-studies/*.md` — posts
- `public/uploads/` — uploaded images

## Notes

- The public site no longer uses Firestore for content — it's fully static.
  Firestore's only remaining job is storing contact-form leads, which
  requires fixing the Firebase project (billing) at some point; until then
  lead capture shows a friendly "not configured" message and the site is
  otherwise unaffected.
- A production build needs **no `.env` at all**. `.env` is ignored by the
  Docker image (see `.dockerignore`).
