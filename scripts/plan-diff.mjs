#!/usr/bin/env node
// Work out what changed between this build of a video and the last one, and record it in
// plan-map.json so the review player can offer to play only the changed beats.
//
// The point: after a plan is revised, a reviewer should not have to rewatch three minutes to find
// the thirty seconds that moved.
//
// The previous build is read from git (the last committed plan-map for this project), because that
// is already the record of what the reviewer last saw, and it means no extra state to keep in sync.
// --against <ref|file> overrides it.
//
// Frames are matched by composition id first, then by title, because inserting a beat renumbers
// everything after it and an index-based diff would call the whole tail "changed".
//
// Each matched frame is classified by what actually differs, which is more useful than a bit:
//   said     — the narration for this beat changed
//   shown    — the words on screen changed
//   restyled — neither, but the frame's markup did (a layout or motion change)
//   retimed  — only its duration moved
//
// The build (`changes.build`): which build this is, for fresh eyes, whose rounds belong to one (a rebuild is a
// new build, D-227): the previous build's plan map, hashed ("first" when there is none). Rebuilding before the
// next commit keeps it; committing the video ends it. A video rebuilt with nothing changed since the last
// commit IS that build: the committed map's own `changes` (and each frame's) are kept, so neither the page's
// "just the changes" nor fresh eyes lose what that build changed from the one before it.
// It also says what fresh eyes left as it is for this build (`freshEyes`, the page's Before you watch): only this
// build's rounds, never an earlier build's, and of its third round's kept findings only those an earlier round
// had not kept for the same reason (`left`; the rest are `again`, D-245).
//
// usage: reelplanner plan-diff <project-dir> [--against HEAD]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { leftAfter } from "./lib/fresh-eyes.mjs";
import { execFileSync } from "node:child_process";
import { resolve, join, relative } from "node:path";
import { createHash } from "node:crypto";
import { otherRpPath } from "./lib/env.mjs";

const args = process.argv.slice(2);
const project = args.find((a) => !a.startsWith("--")) || "";
const againstIdx = args.indexOf("--against");
const against = againstIdx >= 0 ? args[againstIdx + 1] : "HEAD";
const dir = resolve(project);   // relative to the caller, not to wherever reelplanner is installed
const mapPath = join(dir, "plan-map.json");
if (!existsSync(mapPath)) { console.error(`✗ no plan-map.json in ${project}`); process.exit(1); }

const h = (s) => createHash("sha1").update(s).digest("hex").slice(0, 12);
const norm = (s) => String(s || "").replace(/\s+/g, " ").trim().toLowerCase();

// the words a viewer can actually read on the frame, in document order
const visibleText = (html) => {
  const body = html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  return (body.match(/>([^<>]+)</g) || []).map((m) => m.slice(1, -1).replace(/&[a-z#0-9]+;/gi, " ").trim()).filter((t) => /[a-z0-9]/i.test(t)).join(" | ");
};

// the voiceover line per frame, from the storyboard. The end-of-input lookahead is `(?![\s\S])`, the
// absolute end: under /m, `\n*$` would match at the first line end and every voiceover would read "".
function voiceovers(sb) {
  const out = {};
  for (const m of sb.matchAll(/^## Frame (\d+) —([^\n]*)\n([\s\S]*?)(?=\n## Frame |(?![\s\S]))/gm)) {
    const body = m[3], v = body.match(/^- voiceover:\s*"?([\s\S]*?)"?\s*$/m);
    out[m[1]] = { title: m[2].trim(), voice: v ? v[1] : "" };
  }
  return out;
}

function build(mapText, readFrame, sbText) {
  const map = JSON.parse(mapText);
  const vo = voiceovers(sbText || "");
  return (map.frames || []).map((f) => {
    const html = readFrame(f.compositionId) || "";
    return {
      id: f.compositionId, index: f.index, title: f.title,
      dur: +(f.durationSeconds || 0).toFixed(2), start: f.start,
      said: h(norm(vo[String(f.index)]?.voice || "")),
      shown: h(norm(visibleText(html))),
      look: h(norm(html)),
    };
  });
}

const cur = build(readFileSync(mapPath, "utf8"),
  (id) => { const p = join(dir, "compositions/frames", `${id}.html`); return existsSync(p) ? readFileSync(p, "utf8") : ""; },
  existsSync(join(dir, "STORYBOARD.md")) ? readFileSync(join(dir, "STORYBOARD.md"), "utf8") : "");

// ---- the previous build
// `<rev>:./<path>` is read relative to cwd, so running git in the project finds the project's own repo
// (a build from before the rename, D-312, is at the record folder's old name: tried second, from the repo's top)
const prefix = (() => { try { return execFileSync("git", ["rev-parse", "--show-prefix"], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } })();
const git = (p, rev = against) => {
  for (const at of [`./${p}`, otherRpPath(prefix + p)].filter(Boolean)) try { return execFileSync("git", ["show", `${rev}:${at}`], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { /* not there */ }
  return null;
};
let prev = null, prevText = null;
if (existsSync(against)) prev = build(prevText = readFileSync(against, "utf8"), () => "", "");
else {
  const prevMap = prevText = git(relative(dir, mapPath));
  if (prevMap) prev = build(prevMap,
    (id) => git(relative(dir, join(dir, "compositions/frames", `${id}.html`))) || "",
    git(relative(dir, join(dir, "STORYBOARD.md"))) || "");
}

const map = JSON.parse(readFileSync(mapPath, "utf8"));
// what fresh eyes left as it is, for this build only (the plan map's own run read the map on disk, the last run's)
const write = () => {
  const fe = leftAfter(dir, { build: { id: map.changes.build, scope: map.changes.baseline ? [...new Set([...(map.changes.changedFrames || []), ...(map.changes.restyledFrames || [])])] : null } });
  if (fe?.left.length || fe?.again?.length) map.freshEyes = fe; else delete map.freshEyes;
  writeFileSync(mapPath, JSON.stringify(map, null, 2) + "\n");
};
if (!prev) {
  map.changes = { against, baseline: false, build: "first", note: "no previous build to compare against" };
  for (const f of map.frames) delete f.change;
  write();
  console.log(`plan-diff: no previous build at ${against} — every beat is new, so there is nothing to narrow to`);
  process.exit(0);
}

const byId = new Map(prev.map((p) => [p.id, p]));
const byTitle = new Map(prev.map((p) => [norm(p.title), p]));
const used = new Set();
const counts = { added: 0, edited: 0, restyled: 0, retimed: 0, same: 0 };
let changedSeconds = 0;

for (let i = 0; i < cur.length; i++) {
  const c = cur[i];
  const p = byId.get(c.id) || byTitle.get(norm(c.title));
  const frame = map.frames[i];
  if (!p) { frame.change = { status: "added" }; counts.added++; changedSeconds += c.dur; continue; }
  used.add(p.id);
  const said = p.said !== c.said, shown = p.shown !== c.shown, look = p.look !== c.look, retimed = Math.abs(p.dur - c.dur) > 0.05;
  let status = "same";
  if (said || shown) status = "edited";
  else if (look) status = "restyled";
  else if (retimed) status = "retimed";
  frame.change = { status, said, shown, retimed, wasIndex: p.index };
  counts[status]++;
  if (status === "added" || status === "edited") changedSeconds += c.dur;
}
const removed = prev.filter((p) => !used.has(p.id)).map((p) => ({ index: p.index, title: p.title }));

// Nothing changed since the previous build, and it is the same length: this is that build, built again. Keep
// what it said it changed (its `changes` and each frame's), its build with them.
const prevMap = (() => { try { return JSON.parse(prevText); } catch { return null; } })();
if (counts.same === cur.length && !removed.length && prev.length === cur.length && prevMap) {
  const pc = prevMap.changes || {};
  // a map from before builds were stamped: its build is the one before it, the commit of the plan map before this
  const older = () => {
    if (existsSync(against)) return null;
    try {
      const revs = execFileSync("git", ["log", "-2", "--format=%H", against, "--", "plan-map.json"], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().split("\n").filter(Boolean);
      return revs[1] ? git(relative(dir, mapPath), revs[1]) : null;
    } catch { return null; }
  };
  const was = (() => { if (pc.build) return pc.build; if (!pc.baseline) return "first"; const t = older(); return t ? h(t) : "first"; })();
  const byIdPrev = new Map((prevMap.frames || []).map((f) => [f.compositionId, f]));
  for (const f of map.frames) { const pf = byIdPrev.get(f.compositionId); if (pf?.change) f.change = pf.change; else delete f.change; }
  map.changes = pc.baseline ? { ...pc, build: was, kept: `nothing changed since ${against}: its build, built again` } : { against, baseline: false, build: "first", note: pc.note || "no previous build to compare against" };
  if (!pc.baseline) for (const f of map.frames) delete f.change;
  write();
  const n = map.changes.changedFrames?.length || 0;
  console.log(`plan-diff vs ${against}: nothing changed, so this is that build, built again: its changes kept (${pc.baseline ? `${n} beat(s) to rewatch${n ? `: ${map.changes.changedFrames.join(", ")}` : ""}` : "a first build"})`);
  process.exit(0);
}

map.changes = {
  against, baseline: true, at: new Date().toISOString(), build: h(prevText),
  ...counts, removed,
  // What a reviewer has to rewatch is what the plan now says or shows. A restyle is not a revision: a
  // repo-wide restyle touches every frame's markup and would mark the whole video as changed. Restyled
  // beats are counted and listed, not queued for rewatching.
  changedFrames: map.frames.filter((f) => ["added", "edited"].includes(f.change?.status)).map((f) => f.index),
  restyledFrames: map.frames.filter((f) => f.change?.status === "restyled").map((f) => f.index),
  changedSeconds: +changedSeconds.toFixed(2),
  totalSeconds: map.totalSeconds,
};
write();

const n = map.changes.changedFrames.length;
console.log(`plan-diff vs ${against}: ${counts.added} added, ${counts.edited} edited, ${counts.restyled} restyled, ${counts.retimed} retimed, ${counts.same} unchanged${removed.length ? `, ${removed.length} removed` : ""}`);
console.log(n
  ? `  → ${n} beat(s) to rewatch, ${map.changes.changedSeconds}s of ${(map.totalSeconds || 0).toFixed(0)}s${counts.restyled ? ` (${counts.restyled} restyled beat(s) not queued: the markup moved, the plan did not)` : ""}`
  : `  → nothing to rewatch${counts.restyled ? `; ${counts.restyled} beat(s) were restyled only` : ""}`);
