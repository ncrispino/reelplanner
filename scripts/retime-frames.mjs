#!/usr/bin/env node
// Move every frame's animation cues onto the words they were authored against, after the narration
// has been re-synthesised at a different pace.
//
// A frame's GSAP positions are hardcoded seconds — 2.38 for "card A pops in", 14.28 for "the coral
// appears". They were written to land on particular spoken words. Re-synthesising the line moves
// those words, so the numbers stop meaning what they meant: the cue fires while a different word is
// being said. Nothing catches that — every check still passes, the video is just off its own beat.
//
// What makes this mechanical rather than a re-authoring job: the OLD word timings say which word
// each cue currently lands on, and the NEW ones say when that word is now spoken. So each position
// is remapped through the old→new correspondence, piecewise-linearly between word starts. A cue
// that landed 40% of the way through "recommend" still lands 40% of the way through "recommend".
//
// The old timings come from git (the last committed build, as plan-diff does it); --against
// overrides with a path.
//
// It only rewrites positions that are plain numbers, plus the `DUR`/`D` constant a frame holds its
// own length in. A frame whose positions are computed (`LIFT[i] + 0.08`, `at + 0.12`) is reported
// and left alone — guessing at which array element is a time and which is an opacity is how you
// silently wreck a hand-authored frame.
//
// usage: reelplanner retime-frames <project-dir> [--against <ref|file>] [--helpers name[@i],…] [--ignore name,…] [--dry-run]
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve, relative } from "node:path";

const argv = process.argv.slice(2);
const project = argv.find((a) => !a.startsWith("--")) || "";
const DRY = argv.includes("--dry-run");
const ai = argv.indexOf("--against");
const against = ai >= 0 ? argv[ai + 1] : "HEAD";
if (!project) { console.error("usage: reelplanner retime-frames <project-dir> [--against <ref|file>] [--helpers name[@i],…] [--ignore name,…] [--dry-run]"); process.exit(1); }
const dir = resolve(project);   // relative to the caller, not to wherever reelplanner is installed
const metaPath = join(dir, "audio_meta.json");
if (!existsSync(metaPath)) { console.error(`✗ no audio_meta.json in ${project}`); process.exit(1); }

const now = JSON.parse(readFileSync(metaPath, "utf8"));
let prev;
if (existsSync(against)) prev = JSON.parse(readFileSync(against, "utf8"));
else {
  // `<rev>:./<path>` is relative to cwd, so git run in the project reads the project's own repo
  const rel = relative(dir, metaPath);
  try { prev = JSON.parse(execFileSync("git", ["show", `${against}:./${rel}`], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })); }
  catch { console.error(`✗ no previous audio_meta.json at ${against}:${rel} — nothing to remap from`); process.exit(1); }
}

const byFrame = (m) => Object.fromEntries((m.voices || []).map((v) => [v.frame, v]));
const P = byFrame(prev), N = byFrame(now);

// Which voice line a composition speaks. audio_meta.json is keyed by the storyboard's `## Frame N`
// number, but a revise that inserts or deletes beats renumbers the storyboard while keeping each
// beat's composition id (so plan-diff reads it as edited, not delete-and-add). So the file name's
// own number says nothing after a revise: pair lines through the storyboard's `- src:` instead, the
// old storyboard (at --against) for the old line and the current one for the new. A frame with no
// old counterpart is new and has nothing to remap from.
// Each block's `- duration:` is the beat's length (its line, or its hold when that is longer:
// hold-durations), which is where a frame's end-of-timeline marker sits.
const storyboardAt = (text) => {
  const ids = {}, len = {};
  for (const b of text.split(/^(?=## Frame \d+)/m)) {
    const n = Number(b.match(/^## Frame (\d+)/)?.[1]), src = b.match(/^- src:\s*(\S+)/m)?.[1], d = b.match(/^- duration:\s*([\d.]+)\s*s?\s*$/m)?.[1];
    if (n && src) ids[src.split("/").pop()] = n;
    if (n && d) len[n] = parseFloat(d);
  }
  return { ids, len };
};
const sbPath = join(dir, "STORYBOARD.md");
const nowSb = existsSync(sbPath) ? storyboardAt(readFileSync(sbPath, "utf8")) : { ids: {}, len: {} };
// --against <file> names only the old audio_meta.json: with no old storyboard beside it, the
// numbering is taken as unchanged (and the old beat lengths as unknown)
let prevSb = { ids: nowSb.ids, len: {} };
if (!existsSync(against)) try { prevSb = storyboardAt(execFileSync("git", ["show", `${against}:./${relative(dir, sbPath)}`], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })); } catch {}
const useSb = Object.keys(nowSb.ids).length > 0;
const frameOf = (f, ids) => useSb ? ids[f] : Number(f.match(/^(\d+)/)?.[1]);   // a storyboard without src lines: the old file-name rule

// Piecewise-linear through the word starts, with the line's end as the last knot. Outside the
// knots it falls back to the overall duration ratio, which is what a lead-in or a held tail wants.
function mapper(pv, nv) {
  const pw = pv?.words || [], nw = nv?.words || [];
  const ratio = (nv?.duration_s || 0) / (pv?.duration_s || 1);
  if (!pw.length || pw.length !== nw.length) return { fn: (t) => t * ratio, exact: false, ratio };
  const xs = pw.map((w) => w.start).concat([pv.duration_s]);
  const ys = nw.map((w) => w.start).concat([nv.duration_s]);
  return {
    exact: true, ratio,
    fn: (t) => {
      if (t <= xs[0]) return +(t * (ys[0] / (xs[0] || 1) || ratio)).toFixed(3);
      for (let i = 0; i + 1 < xs.length; i++) {
        if (t >= xs[i] && t <= xs[i + 1]) {
          const span = xs[i + 1] - xs[i];
          const f = span > 1e-9 ? (t - xs[i]) / span : 0;
          return +(ys[i] + f * (ys[i + 1] - ys[i])).toFixed(3);
        }
      }
      return +(ys[ys.length - 1] + (t - xs[xs.length - 1]) * ratio).toFixed(3);
    },
  };
}

const framesDir = join(dir, "compositions", "frames");
const files = existsSync(framesDir) ? readdirSync(framesDir).filter((f) => f.endsWith(".html")).sort() : [];
if (!files.length) { console.error(`✗ no frames in ${project}/compositions/frames`); process.exit(1); }

// A GSAP call's position is its last argument: `, 2.38);` — but that exact shape also occurs on
// calls whose last argument is a LENGTH, not a time: `Math.min(L * 0.5, 83)` is an SVG path length,
// `prepDraw(edge, 215)` a stroke-dash length. Remapping those through the word timings would
// silently wreck the drawing. So every match is resolved to its callee and only known
// time-takers are rewritten — and an unrecognised one stops the run rather than being guessed at
// either way. Skipping silently is just as bad: `reveal`, `swap` and `fillSlot` are project-local
// wrappers that really do take a timeline position, and quietly leaving them stale would put back
// exactly the drift this exists to remove.
const POS = /(,\s*)(\d+(?:\.\d+)?)(\s*\);)/g;
const TIMELINE = /(?:^|\.)(?:to|from|fromTo|set|call|add|addLabel)$/;   // tl.to, gsap.fromTo, chained .to
const names = (flag) => { const i = argv.indexOf(flag); return i >= 0 ? (argv[i + 1] || "").split(",").map((s) => s.trim()).filter(Boolean) : []; };
// --helpers name takes a timeline position as its last argument; name@i as its argument i (0-based):
// `pop(tl, el, at, dy)` is pop@2, its last argument a y-offset
const HELPERS = new Map(names("--helpers").map((h) => { const [n, i] = h.split("@"); return [n, i == null ? "last" : Number(i)]; }));
const IGNORE = new Set(names("--ignore"));     // takes a length or a count: leave it, and do not stop for it
// A frame's own helpers say which argument is the time by naming it: `pop = function (tl, el, at, d)`,
// `function fill(tl, n, at)`. A parameter called `at` is a timeline position; a helper with one is
// read as such unless --helpers or --ignore says otherwise.
const AT_PARAM = /(?:\b([A-Za-z_$][\w$]*)\s*=\s*(?:function\s*)?|\bfunction\s+([A-Za-z_$][\w$]*)\s*)\(([^()]*)\)/g;
function declaredHelpers(body) {
  const found = new Map();
  for (const m of body.matchAll(AT_PARAM)) {
    const name = m[1] || m[2], params = m[3].split(",").map((x) => x.trim().replace(/=.*$/, "").trim());
    const i = params.indexOf("at");
    if (name && i >= 0) found.set(name, i === params.length - 1 ? "last" : i);
  }
  return found;
}
// split a call's arguments at its top level: from just after "(" to its matching ")"
function callArgs(body, open) {
  const args = []; let depth = 0, start = open + 1, q = null;
  for (let i = open + 1; i < body.length; i++) {
    const c = body[i];
    if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") q = c;
    else if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) { if (depth === 0) { args.push([start, i]); return { args, close: i }; } depth--; }
    else if (c === "," && depth === 0) { args.push([start, i]); start = i + 1; }
  }
  return null;
}

// walk back from a match's ")" to its matching "(" and read the callee that precedes it
function calleeOf(body, closeIdx) {
  let depth = 0, i = closeIdx;
  for (; i >= 0; i--) { const c = body[i]; if (c === ")") depth++; else if (c === "(") { depth--; if (depth === 0) break; } }
  if (i < 0) return null;
  return (body.slice(Math.max(0, i - 80), i).match(/([A-Za-z_$][\w$.]*)\s*$/) || [null, null])[1];
}
// A frame ends its timeline with a marker at its beat's length less a millisecond,
// `tl.to({ hold: 0 }, { hold: 1, duration: 0.001 }, 4.499)`. It is not a cue on a word: remapped through
// the words it lands past the frame's end. A position at an old length less 0.001 (the beat's, the
// line's or DUR's) goes to the matching new length less 0.001.
// One already at the new beat's end stays there (a frame authored fresh for the new line).
const endMark = (lens) => (t) => {
  if (lens[0][1] > 0 && Math.abs(t - (lens[0][1] - 0.001)) < 0.01) return t;
  for (const [a, b] of lens) if (a > 0 && Math.abs(t - (a - 0.001)) < 0.01) return +(b - 0.001).toFixed(3);
  return null;
};
const DURDEF = /\b((?:const|var|let)\s+(?:DUR|D)\s*=\s*)(\d+(?:\.\d+)?)/g;
// positions that are not plain numbers (excluding the `DUR - 0.001` tail every frame ends with)
const COMPUTED = /,\s*(?!DUR\s*-\s*0\.001\s*\);)([A-Za-z_][A-Za-z0-9_]*\s*\[[^\]]*\][^)]*|[A-Za-z_][A-Za-z0-9_]*\s*[-+]\s*[0-9.]+)\s*\);/;

let changed = 0, skipped = 0, approx = 0;
const needsEyes = [], unknown = [], pending = [];
for (const f of files) {
  const n = frameOf(f, nowSb.ids), was = frameOf(f, prevSb.ids);
  const pv = P[was], nv = N[n];
  const path = join(framesDir, f);
  let src = readFileSync(path, "utf8");
  if (!pv || !nv) { skipped++; continue; }                       // a new frame, or one with no voice line
  if (Math.abs((pv.duration_s || 0) - (nv.duration_s || 0)) < 0.005) { skipped++; continue; }  // nothing moved
  const m = mapper(pv, nv);
  if (!m.exact) approx++;
  const oldDur = +(src.match(/\b(?:const|var|let)\s+(?:DUR|D)\s*=\s*(\d+(?:\.\d+)?)/)?.[1] || 0);
  const atEnd = endMark([[prevSb.len[was], nowSb.len[n] ?? nv.duration_s], [pv.duration_s, nv.duration_s], [oldDur, nv.duration_s]]);
  const at = (num) => atEnd(num) ?? +m.fn(num).toFixed(3);   // the scaled fallback is not rounded of itself
  if (COMPUTED.test(src)) needsEyes.push(`${f} (frame ${n})`);
  const before = src;
  // ONLY inside <script>. The same `, 0.08);` shape occurs in CSS — `rgba(var(--rp-shadow-rgb),0.08);`
  // — and remapping a shadow's alpha onto a timeline position would be a silent disaster.
  src = src.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, body, close) => {
    const helpers = new Map([...declaredHelpers(body)].filter(([k]) => !IGNORE.has(k)));
    for (const [k, v] of HELPERS) helpers.set(k, v);
    // helpers whose time is not their last argument: rewrite that argument where it is a plain number,
    // back to front so earlier offsets stay good. Their last argument is then not a time.
    const edits = [];
    for (const [name, i] of helpers) {
      if (i === "last") continue;
      for (const mm of body.matchAll(new RegExp(`(?<![\\w$.])${name.replace(/\$/g, "\\$")}\\s*\\(`, "g"))) {
        if (/function\s*$/.test(body.slice(Math.max(0, mm.index - 12), mm.index))) continue;   // its own definition
        const call = callArgs(body, mm.index + mm[0].length - 1); if (!call || !call.args[i]) continue;
        const [s0, s1] = call.args[i], raw = body.slice(s0, s1), num = raw.match(/^(\s*)(\d+(?:\.\d+)?)(\s*)$/);
        if (num) edits.push([s0, s1, `${num[1]}${at(parseFloat(num[2]))}${num[3]}`]);
        else needsEyes.push(`${f} (frame ${n}): ${name}(… ${raw.trim()} …)`);
      }
    }
    for (const [s0, s1, t] of edits.sort((x, y) => y[0] - x[0])) body = body.slice(0, s0) + t + body.slice(s1);
    let b = body.replace(POS, (whole, a, num, tail, off) => {
      const callee = calleeOf(body, off + whole.indexOf(")"));
      if (callee && helpers.has(callee) && helpers.get(callee) !== "last") return whole;   // its time was an earlier argument
      if (callee && (TIMELINE.test(callee) || helpers.has(callee))) return `${a}${at(parseFloat(num))}${tail}`;
      if (!callee || !IGNORE.has(callee)) unknown.push(`${f}: ${callee ?? "?"}(… ${num})`);
      return whole;   // left exactly as it was; an unacknowledged one stops the run rather than guessing
    });
    b = b.replace(DURDEF, (_m, a) => `${a}${+(nv.duration_s).toFixed(3)}`);
    return open + b + close;
  });
  if (src !== before) {
    changed++;
    console.log(`  ${f}${was !== n ? ` (frame ${was} → ${n})` : ""}: ${pv.duration_s}s → ${nv.duration_s}s  (${m.exact ? `${(pv.words || []).length} words anchored` : `no word anchors — scaled ×${m.ratio.toFixed(4)}`})`);
    pending.push([path, src]);
  } else skipped++;
}
// Nothing is written until every frame has been read: a run that bails halfway would leave the
// project with some frames on the new timebase and some on the old, which is worse than either.
if (!unknown.length && !DRY) for (const [p, s] of pending) writeFileSync(p, s);

console.log(`${DRY ? "(dry run) " : ""}${unknown.length ? `· ${project}: ${changed} frame(s) to retime, none written` : `✓ ${project}: ${changed} frame(s) retimed`}, ${skipped} unchanged${approx ? `, ${approx} scaled without word anchors` : ""}`);
if (needsEyes.length) {
  console.log(`△ ${needsEyes.length} frame(s) also hold computed positions (LIFT[i] + …, at + …) that were NOT rewritten — check these by hand:`);
  for (const f of needsEyes) console.log(`    ${f}`);
}
if (unknown.length) {
  console.error(`\n✗ ${unknown.length} trailing number(s) on calls this does not recognise, so no frame was written:`);
  for (const u of [...new Set(unknown)]) console.error(`    ${u}`);
  console.error("  Re-run naming each one: --helpers <name,…> if it takes a timeline position (it gets remapped;");
  console.error("  name@i when the time is its argument i, 0-based, not its last: pop@2 for pop(tl, el, at, dy)),");
  console.error("  --ignore <name,…> if it is a length or a count (it stays exactly as it is).");
  process.exit(1);
}
