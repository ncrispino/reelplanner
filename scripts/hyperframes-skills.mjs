#!/usr/bin/env node
// Install HyperFrames' skills at the version this repo pins, and check that what is installed can run.
//
// The pipeline runs HyperFrames' skill scripts straight out of the installed skills directory (faceless-explainer's
// captions / assemble-index / transitions / audio, media-use's TTS engine). `hyperframes skills
// update` and `hyperframes init` both refresh those from GitHub main — not from the CLI version in
// package-lock.json — so an upstream commit can break the pipeline with nothing on our side
// changing. That happened on 2026-09-21: heygen-com/hyperframes#4230 (first shipped in v0.8.59) left
// media-use/scripts/lib/media-fetch.mjs re-exporting "../../../../packages/cli/src/media-use/lib/
// media-fetch.mjs", a path that exists in their monorepo and nowhere in an installed skill. Every
// script that loads the audio helpers died on import, and finish-project.sh with it, at step four.
//
// So: the skills are installed from the git tag matching the pinned `hyperframes` dependency in
// package.json, and each refresh re-applies patch-tts-speed.mjs (which every reinstall reverts).
// `--check` walks the relative imports of every skill script we run and names the first one that
// does not resolve, so a broken install stops a build before it starts rather than half-way through.
//
// Where they go: `npx skills add … -g` (vercel-labs/skills) with no agent named, which puts the real
// files in ~/.agents/skills — read directly by Codex, Cursor, Amp and the other "universal" agents —
// and links them into every other agent it detects (~/.claude/skills for Claude Code). One copy, so
// one TTS patch covers every agent. REELPLANNER_SKILLS_AGENTS="claude-code codex" limits the agents;
// REELPLANNER_SKILLS_DIR overrides where the pipeline reads (and patches) them.
//
// usage: reelplanner hyperframes-skills             ensure: install the pinned skills unless they
//                                                   already check out clean, then patch TTS speed
//        reelplanner hyperframes-skills --force     reinstall even if the check passes
//        reelplanner hyperframes-skills --check     report only; exit 1 if a script cannot load
//        reelplanner hyperframes-skills --dry-run   say what ensure would do, change nothing
//        reelplanner hyperframes-skills --dir       print the skills directory the pipeline reads
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, RP_COMMAND } from "./lib/env.mjs";
// Where the skills are read from: an explicit override; else wherever they are installed AND load —
// ~/.agents/skills (the `skills` CLI's canonical copy), or ~/.claude/skills (an install from before,
// copied there for Claude Code alone; either may also hold a stale copy from `hyperframes skills
// update`); else wherever they are installed at all; else the canonical place, where an install puts them.
export const CANDIDATE_DIRS = [join(homedir(), ".agents", "skills"), join(homedir(), ".claude", "skills")];
const installedIn = () => CANDIDATE_DIRS.filter((d) => existsSync(join(d, "faceless-explainer", "SKILL.md")));
export function skillsDir() {
  if (process.env.REELPLANNER_SKILLS_DIR) return process.env.REELPLANNER_SKILLS_DIR;
  const found = installedIn();
  return found.find((d) => !brokenImports(d, ENTRIES).length) || found[0] || CANDIDATE_DIRS[0];
}
const SKILL_LOCK = join(homedir(), ".agents", ".skill-lock.json");
// the `skills` installer the HyperFrames CLI itself shells out to, pinned for the same reason
const SKILLS_CLI = "skills@1.7.0";

// HyperFrames' core set at the pinned tag, plus the one workflow skill reelplanner drives
export const INSTALL = ["hyperframes", "hyperframes-animation", "hyperframes-audio", "hyperframes-cli", "hyperframes-core",
  "hyperframes-creative", "hyperframes-keyframes", "hyperframes-registry", "hyperframes-studio", "media-use", "faceless-explainer"];

// the skill scripts our own scripts and the plan-to-video skill actually run
export const ENTRIES = [
  "faceless-explainer/scripts/captions.mjs",
  "faceless-explainer/scripts/assemble-index.mjs",
  "faceless-explainer/scripts/transitions.mjs",
  "faceless-explainer/scripts/audio.mjs",
  "faceless-explainer/scripts/build-frame.mjs",
  "faceless-explainer/scripts/frame-packets.mjs",
  "media-use/scripts/prefs.mjs",
  "media-use/scripts/transcribe.mjs",
  "media-use/audio/scripts/lib/tts.mjs",
];

/** The HyperFrames git tag to install skills from: the exact `hyperframes` version package.json pins. */
export function pinnedRef() {
  const v = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).dependencies?.hyperframes || "";
  if (!/^\d+\.\d+\.\d+$/.test(v)) throw new Error(`package.json must pin hyperframes to an exact version (found "${v}"), so the skills can be pinned to its tag`);
  return `v${v}`;
}

const IMPORT_RE = /(?:^|[\s;])(?:import|export)\s[^'"`;]*?from\s*["']([^"']+)["']|(?:^|[\s;])import\s*["']([^"']+)["']|import\(\s*["'`]([^"'`$]+)["'`]\s*\)/g;

/**
 * Walk the relative imports reachable from `entries` (paths under `dir`) and return every one that
 * does not exist, with the chain that reached it. Static and deliberately simple: it reads import
 * specifiers, it does not execute anything, so checking a CLI script cannot run that CLI.
 */
export function brokenImports(dir, entries) {
  const broken = [], seen = new Set();
  const visit = (file, chain) => {
    if (seen.has(file)) return;
    seen.add(file);
    const src = readFileSync(file, "utf8").replace(/^\s*\/\/.*$/gm, "");
    for (const m of src.matchAll(IMPORT_RE)) {
      const spec = m[1] || m[2] || m[3];
      if (!spec.startsWith("./") && !spec.startsWith("../")) continue;
      const target = resolve(dirname(file), spec);
      if (!existsSync(target)) broken.push({ importer: file, spec, target, chain: [...chain, file] });
      else if (/\.m?js$/.test(target)) visit(target, [...chain, file]);
    }
  };
  for (const e of entries) {
    const f = join(dir, e);
    if (!existsSync(f)) broken.push({ importer: null, spec: e, target: f, chain: [] });
    else visit(f, []);
  }
  return broken;
}

/** Where each skill we install came from, per the `skills` CLI's lock file (ref undefined = main). */
function installedRefs() {
  try {
    const lock = JSON.parse(readFileSync(SKILL_LOCK, "utf8")).skills || {};
    return Object.fromEntries(INSTALL.filter((s) => lock[s]).map((s) => [s, lock[s].ref || "main"]));
  } catch { return {}; }
}

const tilde = (p) => p.startsWith(homedir()) ? "~" + p.slice(homedir().length) : p;
const skillRel = (p) => relative(skillsDir(), p);

/** Human-readable report of a broken install; empty string when it is fine. */
export function describe(broken, ref) {
  if (!broken.length) return "";
  const lines = [];
  for (const b of broken) {
    if (!b.importer) { lines.push(`✗ missing ${tilde(b.target)} — the skill is not installed`); continue; }
    lines.push(`✗ ${tilde(b.importer)} imports "${b.spec}"`);
    lines.push(`    → ${tilde(b.target)} does not exist`);
    if (b.chain.length > 1) lines.push(`    needed by ${b.chain.map(skillRel).join(" → ")}`);
  }
  lines.push(`  fix: ${RP_COMMAND} hyperframes-skills   (reinstalls HyperFrames' skills at ${ref}, the version reelplanner pins, and re-applies the TTS speed patch)`);
  lines.push("  cause: `hyperframes init` and `hyperframes skills update` refresh the skills from GitHub main; run init with HYPERFRAMES_SKIP_SKILLS=1");
  return lines.join("\n");
}

/** The `npx skills add` arguments that install the pinned set for every agent on this machine. */
export function installArgs(ref) {
  const agents = (process.env.REELPLANNER_SKILLS_AGENTS || "").split(/[\s,]+/).filter(Boolean);
  return ["-y", SKILLS_CLI, "add", `https://github.com/heygen-com/hyperframes/tree/${ref}/skills`,
    "-g", "-y", ...agents.flatMap((a) => ["-a", a]), ...INSTALL.flatMap((s) => ["-s", s])];
}

function install(ref) {
  console.log(`▶ installing HyperFrames skills at ${ref} for every agent found: npx ${installArgs(ref).join(" ")}`);
  // stdin closed: with -y nothing should ask, and if something does it must fail, not hang
  execFileSync("npx", installArgs(ref), { stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, DISABLE_TELEMETRY: "1" } });
}

function main() {
  const argv = process.argv.slice(2);
  const CHECK = argv.includes("--check"), FORCE = argv.includes("--force"), DRY = argv.includes("--dry-run");
  if (argv.includes("--dir")) { console.log(skillsDir()); return; }
  const ref = pinnedRef();
  let broken = brokenImports(skillsDir(), ENTRIES);
  const refs = installedRefs();
  const drifted = Object.entries(refs).filter(([, r]) => r !== ref);

  if (CHECK) {
    if (broken.length) { console.error(describe(broken, ref)); process.exit(1); }
    if (drifted.length) console.log(`△ skills installed from ${[...new Set(drifted.map(([, r]) => r))].join(", ")}, not ${ref} (${drifted.map(([s]) => s).join(", ")}) — they load, but \`reelplanner hyperframes-skills\` puts back the pinned set`);
    console.log(`✓ HyperFrames skills load: ${ENTRIES.length} scripts, every relative import resolves`);
    return;
  }

  // a stale copy anywhere an agent reads counts: that agent would run it
  const staleIn = process.env.REELPLANNER_SKILLS_DIR ? [] : installedIn().filter((d) => brokenImports(d, ENTRIES).length);
  const need = FORCE || broken.length || staleIn.length || drifted.length || !INSTALL.every((s) => existsSync(join(skillsDir(), s)));
  if (DRY) {
    if (!need) console.log(`✓ HyperFrames skills already at ${ref} in ${tilde(skillsDir())} and loading — nothing to install`);
    else console.log(`· would install HyperFrames skills at ${ref}: npx ${installArgs(ref).join(" ")}` +
      (!process.env.REELPLANNER_SKILLS_DIR && !installedIn().length ? `\n  (now: not installed for any agent)`
        : broken.length || staleIn.length ? `\n  (now: scripts cannot load in ${[...new Set([...(broken.length ? [skillsDir()] : []), ...staleIn])].map(tilde).join(", ")})`
        : drifted.length ? `\n  (now: installed from ${[...new Set(drifted.map(([, r]) => r))].join(", ")})`
        : `\n  (now: not installed in ${tilde(skillsDir())})`));
    console.log("· would then re-apply the TTS speed patch (reelplanner patch-tts-speed)");
    return;
  }
  if (need) {
    install(ref);
    broken = brokenImports(skillsDir(), ENTRIES);
    if (broken.length) {
      console.error(`✗ the skills at ${ref} do not load either — this is upstream; pin a different hyperframes version`);
      console.error(describe(broken, ref));
      process.exit(1);
    }
    console.log(`✓ HyperFrames skills at ${ref} in ${tilde(skillsDir())}; every script we run loads`);
  } else {
    console.log(`✓ HyperFrames skills already at ${ref} and loading — nothing to install`);
  }
  // every reinstall reverts this, and it is idempotent when nothing did
  execFileSync(process.execPath, [join(ROOT, "scripts", "patch-tts-speed.mjs")], { stdio: "inherit" });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
