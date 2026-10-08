#!/usr/bin/env bash
# Vendor GSAP into a project and rewrite CDN <script> tags to the local copy, so check/render/preview
# work offline (and behind proxies whose CA headless Chrome does not trust). Idempotent.
# usage: reelplanning vendor-gsap <project-dir>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
. "$ROOT/scripts/lib/project-dir.sh"
P="$(resolve_project "${1:?usage: reelplanning vendor-gsap <project-dir>}")"
mkdir -p "$P/assets/vendor"
# gsap is hoisted beside reelplanning under npx, not inside it: ask node where it is
cp "$(node "$ROOT/scripts/lib/env.mjs" dep gsap dist/gsap.min.js)" "$P/assets/vendor/gsap.min.js"
# index.html + captions + frames: replace any jsdelivr gsap tag with the local file
find "$P" -maxdepth 3 -name "*.html" -not -path "*/node_modules/*" -print0 | xargs -0 -r perl -0pi -e \
  's#<script src="https://cdn\.jsdelivr\.net/npm/gsap@[0-9.]+/dist/gsap\.min\.js"[^>]*></script>#<script src="assets/vendor/gsap.min.js"></script>#g'
echo "✓ gsap vendored → $1/assets/vendor/gsap.min.js ($(grep -rl 'assets/vendor/gsap.min.js' "$P" --include=*.html | wc -l) files rewired)"
