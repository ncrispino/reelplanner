#!/usr/bin/env node
// Carry package.json's version into every place that pins it: the skill's `npx -y reelplanner@<v>`,
// the docs, scripts/release/install.sh and the Claude Code plugin manifests. And carry how people run reelplanner
// (RP_COMMAND in scripts/lib/env.mjs: `reelplanner` while the package is not on npm, `npx -y
// reelplanner@<v>` once it is) into the player's after-export lines and the guide's export
// (guide-review.js), which run in a browser and so keep a copy of it.
//
// Runs as the `version` npm script, so `npm version <patch|minor|x.y.z>` bumps package.json, then
// this, then commits all of it and tags — one version everywhere. scripts/test/version.spec.mjs
// fails `npm test` when anything is left behind.
//
// Not shipped in the npm package (package.json `files` takes scripts/*.mjs, not scripts/release/).
//
// usage: node scripts/release/sync-version.mjs [--check]
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { RP_COMMAND } from "../lib/env.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const VERSION = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;
const PIN = /reelplanner@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g;
// scripts/release/install.sh's default: VERSION="${REELPLANNER_VERSION:-<version>}"
const DEFAULT = /(REELPLANNER_VERSION:-)(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/g;
// the browser's copy of RP_COMMAND: const RP_COMMAND = "<the command>";
const RP_CONST = /(const RP_COMMAND = )"([^"]*)"/g;
export const RP_FILES = ["packages/player/reelplanner-player.js", "packages/player/guide-review.js"];

const md = (d) => existsSync(join(ROOT, d)) ? readdirSync(join(ROOT, d)).filter((f) => f.endsWith(".md")).map((f) => join(d, f)) : [];
/** Every text file that pins the package as `reelplanner@<version>`. */
export const PINNED_FILES = [
  "skills/plan-to-video/SKILL.md", ...md("skills/plan-to-video/references"),
  "README.md", ...md("docs"), "scripts/release/install.sh", "packages/player/reelplanner-player.js", "packages/player/guide-review.js",
].filter((f) => existsSync(join(ROOT, f)));
/** The plugin manifests, whose version fields must match. */
export const MANIFESTS = [".claude-plugin/plugin.json", ".claude-plugin/marketplace.json"];

/** Every place a version is written down that is not VERSION: [{ file, found }]. */
export function stale() {
  const out = [];
  for (const f of PINNED_FILES) for (const m of readFileSync(join(ROOT, f), "utf8").matchAll(PIN)) if (m[0] !== `reelplanner@${VERSION}`) out.push({ file: f, found: m[0] });
  for (const f of PINNED_FILES) for (const m of readFileSync(join(ROOT, f), "utf8").matchAll(DEFAULT)) if (m[2] !== VERSION) out.push({ file: f, found: m[0] });
  for (const f of RP_FILES) {
    const found = [...readFileSync(join(ROOT, f), "utf8").matchAll(RP_CONST)];
    if (!found.length) out.push({ file: f, found: "no RP_COMMAND" });
    for (const m of found) if (m[2] !== RP_COMMAND) out.push({ file: f, found: `RP_COMMAND "${m[2]}", env.mjs says "${RP_COMMAND}"` });
  }
  const plugin = JSON.parse(readFileSync(join(ROOT, MANIFESTS[0]), "utf8"));
  if (plugin.version !== VERSION) out.push({ file: MANIFESTS[0], found: plugin.version });
  for (const p of JSON.parse(readFileSync(join(ROOT, MANIFESTS[1]), "utf8")).plugins || []) if (p.name === "reelplanner" && p.version !== VERSION) out.push({ file: MANIFESTS[1], found: p.version });
  return out;
}

function sync() {
  for (const f of PINNED_FILES) {
    const src = readFileSync(join(ROOT, f), "utf8"), out = src.replace(PIN, `reelplanner@${VERSION}`).replace(DEFAULT, `$1${VERSION}`)
      .replace(RP_CONST, (m, head) => RP_FILES.includes(f) ? `${head}${JSON.stringify(RP_COMMAND)}` : m);
    if (out !== src) { writeFileSync(join(ROOT, f), out); console.log(`✓ ${f}`); }
  }
  const plugin = JSON.parse(readFileSync(join(ROOT, MANIFESTS[0]), "utf8"));
  if (plugin.version !== VERSION) { plugin.version = VERSION; writeFileSync(join(ROOT, MANIFESTS[0]), JSON.stringify(plugin, null, 2) + "\n"); console.log(`✓ ${MANIFESTS[0]}`); }
  const market = JSON.parse(readFileSync(join(ROOT, MANIFESTS[1]), "utf8"));
  let touched = false;
  for (const p of market.plugins || []) if (p.name === "reelplanner" && p.version !== VERSION) { p.version = VERSION; touched = true; }
  if (touched) { writeFileSync(join(ROOT, MANIFESTS[1]), JSON.stringify(market, null, 2) + "\n"); console.log(`✓ ${MANIFESTS[1]}`); }
  console.log(`✓ everything pins reelplanner@${VERSION}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--check")) {
    const s = stale();
    for (const x of s) console.error(`✗ ${x.file}: ${x.found}, package.json is ${VERSION}`);
    if (s.length) { console.error("  fix: node scripts/release/sync-version.mjs"); process.exit(1); }
    console.log(`✓ everything pins reelplanner@${VERSION}`);
  } else sync();
}
