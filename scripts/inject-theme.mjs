#!/usr/bin/env node
// Put the theme tokens into a built project's index.html, and write the dark entry point.
//
// The tokens must land in <head>, before any frame's script runs, because those scripts read
// window.__RP while building their timeline. Re-running replaces the block rather than stacking it.
//
// There is deliberately no second "index-dark.html": the runtime does not boot from a differently
// named entry point. The review player switches the theme on the HTML; no dark MP4 is rendered.
//
// usage: reelplanning inject-theme <project-dir> [--captions-only]
//   --captions-only   only repoint the captions layer (after the caption steps are re-run on their own,
//                     which rewrite compositions/captions.html from the skin); index.html is left alone
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

import { ROOT } from "./lib/env.mjs";   // the template is ours; the project is the caller's
const dir = resolve(process.argv.slice(2).find((a) => !a.startsWith("--")) || ".");
const CAPTIONS_ONLY = process.argv.includes("--captions-only");
const idx = join(dir, "index.html");
if (!CAPTIONS_ONLY && !existsSync(idx)) { console.error(`✗ ${idx} does not exist — assemble the index first`); process.exit(1); }

if (!CAPTIONS_ONLY) {
const block = readFileSync(join(ROOT, "templates/reelplanning/theme/tokens.html"), "utf8").trim();
let html = readFileSync(idx, "utf8");

html = html.replace(/\n?<!-- The video's colour system[\s\S]*?<\/script>\n?/, "\n");   // drop a previous block
if (/<head[^>]*>/i.test(html)) html = html.replace(/(<head[^>]*>)/i, `$1\n${block}\n`);
else html = html.replace(/(<html[^>]*>)/i, `$1\n${block}\n`);                          // no <head>: still before the body

// the body background is painted by the theme now, not by a fixed cream
html = html.replace(/(\s*)background:\s*#FAF9F5;[^\n]*/g, "$1background: var(--rp-paper);");
writeFileSync(idx, html);
}

// The captions layer carries its own brand tokens, and the runtime scopes that stylesheet to the
// sub-composition's container. A scoped definition on a nearer ancestor beats a document-level one
// by inheritance, not cascade, so no amount of specificity up here can reach it — the values have
// to be repointed in the file itself. Done on every build, so regenerating captions.html is safe.
const CAP = {
  "--ink": "--rp-ink", "--cream": "--rp-paper", "--tile": "--rp-tile", "--tile-strong": "--rp-tile-2",
  "--coral": "--rp-coral", "--navy": "--rp-data", "--navy-soft": "--rp-slab", "--navy-elev": "--rp-slab-bar",
  "--cap-ink": "--rp-ink", "--cap-canvas": "--rp-paper", "--cap-accent": "--rp-coral", "--cap-accent-2": "--rp-tile-2",
};
const caps = join(dir, "compositions/captions.html");
if (existsSync(caps)) {
  let cap = readFileSync(caps, "utf8"); let n = 0;
  for (const [name, token] of Object.entries(CAP)) {
    // the definition itself
    const def = new RegExp(`(${name}\\s*:\\s*)(#[0-9a-fA-F]{3,8}|var\\(--rp-[a-z0-9-]+\\))`, "g");
    cap = cap.replace(def, (m, head) => { n++; return `${head}var(${token})`; });
    // …and every fallback that backs it. The runtime scopes this stylesheet, so its :root block may
    // not match at all and the fallback is what actually paints. Mapping by the variable the
    // fallback backs — not by the CSS property it sits in — is what keeps a canvas a canvas even
    // when it appears inside a color-mix() as a text colour.
    const fb = new RegExp(`(var\\(\\s*${name}\\s*,\\s*)(#[0-9a-fA-F]{3,8}|var\\(--rp-[a-z0-9-]+\\))(\\s*\\))`, "g");
    cap = cap.replace(fb, (m, head, _v, tail) => { n++; return `${head}var(${token})${tail}`; });
  }
  writeFileSync(caps, cap);
  console.log(`theme: ${n} caption brand token(s) repointed at the theme`);
}

if (!CAPTIONS_ONLY) console.log("theme: tokens injected → index.html");
