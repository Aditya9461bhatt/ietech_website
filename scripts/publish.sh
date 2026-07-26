#!/usr/bin/env bash
# Publish the site: full static build, then deploy.
#
# Default target is Cloudflare Pages (free static hosting, seconds to deploy).
# One-time setup per machine:
#   npx wrangler login
#   npx wrangler pages project create ietech-website   # once per account
# Fallback: PUBLISH_TARGET=gcp ./scripts/publish.sh    # old Cloud Run path
set -euo pipefail
cd "$(dirname "$0")/.."

TARGET="${PUBLISH_TARGET:-pages}"
PROJECT="${CF_PAGES_PROJECT:-ietech-website}"

echo "▸ Building static site (vite build + prerender)…"
npm run build:static

if [ "$TARGET" = "gcp" ]; then
  echo "▸ Deploying to Cloud Run (legacy path)…"
  exec bash scripts/deploy_gcp.sh
fi

if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "✖ Not logged in to Cloudflare. Run:  npx wrangler login   (one time), then publish again." >&2
  exit 1
fi

echo "▸ Deploying dist/ to Cloudflare Pages project '${PROJECT}'…"
npx wrangler pages deploy dist --project-name "$PROJECT" --branch main --commit-dirty=true
echo "✔ Deployed to Cloudflare Pages."
