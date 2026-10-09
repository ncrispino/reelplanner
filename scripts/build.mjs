#!/usr/bin/env node
// Build a video once its storyboard, script and frames are written: each stage its own command, run in
// order:
//
//   check-terms         no id said alone, no word used before it is defined (check-terms.mjs; warnings go on)
//   check-sources       an explainer's quoted lines word for word in their pinned sources, no secret or home path in
//                       its text, no decision beat (check-sources.mjs; skipped for a video that names no source)
//   narrate             only the lines whose text, voice, speed or model changed (narrate.mjs)
//   fetch-sfx           the storyboard's sound effects (faceless-explainer's audio.mjs)
//   transcribe-missing  any line that came back without word timings
//   sync-durations      every frame to its voice length (audio.mjs)
//   hold-durations      the held beats held again (.hyperframes/holds.json)
//   retime-frames       cues moved onto their words, in the frames whose lines changed; skipped when none did
//   finish-project      captions, index, transitions, theme, plan map, plan diff, details, check
//   verify              lint, check, details, fresh eyes, snapshot (and --render); what it read of fresh eyes
//                       is a line of its own (a finding with no answer stops it, D-225)
//   guide               the video's guide built again with the new pictures, and checked (guide.mjs --check); a
//                       scene whose picture is missing is a △ (skipped for a video with no plan or sources beside it)
//
// Then the video's watched length against its budget (lib/length.mjs): a △ past it, never a stop; and
// whether its scenes vary (lib/variety.mjs): a △ when over 70% share one layout or one transition, or
// when BRIEF.md does not say the video's medium, layouts and main transition.
//
// One line per stage, with its time; the first stage that fails stops the build and prints what it
// said. Every command above still runs on its own.
//
// Which frames retime-frames moves: the ones whose voice line changed since the narration the frames
// were timed to. That narration is kept in .hyperframes/frames-timed-to.json from the moment narrate
// is about to change it until retime-frames has moved the cues, so a build stopped in between (on
// retime-frames' "calls this does not recognise", say: re-run with --helpers or --ignore) still
// retimes those frames on the next run, and a frame is never moved twice for one change. When lines
// were inserted or removed since then (the frames renumbered), the pairing comes from the last commit
// instead (retime-frames' own default).
//
// usage: reelplanner build <video-dir> [--speed 1.25] [--voice <id>] [--helpers <names>] [--ignore <names>] [--against <ref>] [--render] [--verbose]
//        (also `reel build <video-dir> …`)
//   --speed, --voice      handed to narrate
//   --helpers, --ignore   handed to retime-frames (what its "unrecognised call" stop asks for)
//   --against <ref>       handed to plan-diff: the build this one is compared against, when it is not the last
//                         commit (a video committed before its fresh eyes were done; lib/fresh-eyes.mjs buildOf)
//   --render              handed to verify: render the MP4 as well
//   --verbose             show every stage's own output as it runs, not just its last line
import { existsSync, readFileSync, writeFileSync, rmSync, mkdirSync, mkdtempSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/env.mjs";
import { skillsDir } from "./hyperframes-skills.mjs";
import { recordPath } from "./lib/narration.mjs";
import { videoLength, lengthLine } from "./lib/length.mjs";
import { videoVariety, varietyLines } from "./lib/variety.mjs";

const argv = process.argv.slice(2);
const VALUED = ["--speed", "--voice", "--helpers", "--ignore", "--against"];
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null; };
const project = argv.find((a, i) => !a.startsWith("--") && !VALUED.includes(argv[i - 1]));
if (!project) { console.error("usage: reelplanner build <video-dir> [--speed 1.25] [--voice <id>] [--helpers <names>] [--ignore <names>] [--against <ref>] [--render] [--verbose]"); process.exit(1); }
const dir = resolve(project);   // relative to the caller, never to where reelplanner is installed
for (const f of ["STORYBOARD.md", "SCRIPT.md"]) if (!existsSync(join(dir, f))) { console.error(`✗ build: no ${f} in ${project}`); process.exit(1); }
const VERBOSE = argv.includes("--verbose");
const S = join(skillsDir(), "faceless-explainer", "scripts");
const SCRIPTS = join(ROOT, "scripts");
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const env = { ...process.env, HYPERFRAMES_NO_TELEMETRY: "1", HYPERFRAMES_NO_UPDATE_CHECK: "1", HYPERFRAMES_SKIP_SKILLS: "1",
  HYPERFRAMES_TTS_CONCURRENCY: process.env.HYPERFRAMES_TTS_CONCURRENCY || "1", HYPERFRAMES_TRANSCRIBE_TIMEOUT_MS: process.env.HYPERFRAMES_TRANSCRIBE_TIMEOUT_MS || "600000" };
// narrate's test seam (a stand-in for media-use's audio engine) reaches fetch-sfx too, the way narrate hands it to audio.mjs
if (flag("against")) env.RP_PLAN_DIFF_AGAINST = flag("against");   // finish-project hands it to plan-diff
if (process.env.REELPLANNER_TTS_ENGINE && !env.HF_MEDIA_ENGINE) env.HF_MEDIA_ENGINE = resolve(process.env.REELPLANNER_TTS_ENGINE);

// the HyperFrames skill scripts the stages run must load before anything is touched (finish-project.sh says why)
{ const c = spawnSync(process.execPath, [join(ROOT, "scripts", "hyperframes-skills.mjs"), "--check"], { encoding: "utf8" });
  if (c.status !== 0) { console.error(`${c.stdout || ""}${c.stderr || ""}✗ build: not started — the HyperFrames skills above cannot load`); process.exit(1); } }

// ── what the frames are timed to ────────────────────────────────────────────────────────────────────
const PENDING = join(dir, ".hyperframes", "frames-timed-to.json");
const meta = () => readJson(join(dir, "audio_meta.json"));
const record = () => readJson(recordPath(dir));
// taken before narrate changes anything; an earlier build that stopped before retiming left its own
const timedTo = readJson(PENDING) || (meta() ? { audioMeta: meta(), record: record() } : null);
if (timedTo && !existsSync(PENDING)) { mkdirSync(join(dir, ".hyperframes"), { recursive: true }); writeFileSync(PENDING, JSON.stringify(timedTo) + "\n"); }

function retime() {
  if (!timedTo) { rmSync(PENDING, { force: true }); return { skip: "a first narration: the frames were written against these words" }; }
  const now = meta(), key = (v) => JSON.stringify([v.duration_s, (v.words || []).map((w) => [w.text, w.start])]);
  const before = Object.fromEntries((timedTo.audioMeta.voices || []).map((v) => [v.frame, key(v)]));
  const changed = (now?.voices || []).filter((v) => before[v.frame] !== key(v)).map((v) => v.frame);
  if (!changed.length && (now?.voices || []).length === (timedTo.audioMeta.voices || []).length) { rmSync(PENDING, { force: true }); return { skip: "no line changed" }; }
  // renumbered: a kept line (same key) now sits under another id, or lines were added or removed
  const was = timedTo.record?.lines, is = record()?.lines;
  const idOf = Object.fromEntries(Object.entries(was || {}).map(([id, e]) => [e.key, id]));
  const renumbered = (timedTo.audioMeta.voices || []).length !== (now?.voices || []).length
    || !!(was && is && Object.entries(is).some(([id, e]) => idOf[e.key] && idOf[e.key] !== id));
  const extra = ["--helpers", "--ignore"].flatMap((f) => (flag(f.slice(2)) ? [f, flag(f.slice(2))] : []));
  let against = [], tmp = null;
  if (renumbered) {
    const inGit = spawnSync("git", ["show", "HEAD:./audio_meta.json"], { cwd: dir, stdio: ["ignore", "ignore", "ignore"] }).status === 0;
    if (!inGit) { rmSync(PENDING, { force: true }); return { skip: "frames renumbered since they were timed, and nothing committed to pair them by: check the changed frames' cues by hand", warn: true }; }
  } else {
    tmp = mkdtempSync(join(tmpdir(), "rp-build-"));
    writeFileSync(join(tmp, "audio_meta.json"), JSON.stringify(timedTo.audioMeta));
    against = ["--against", join(tmp, "audio_meta.json")];
  }
  try {
    const r = run(["node", [join(SCRIPTS, "retime-frames.mjs"), ".", ...against, ...extra]]);
    if (r.status === 0) rmSync(PENDING, { force: true });
    return r;
  } finally { if (tmp) rmSync(tmp, { recursive: true, force: true }); }
}

// ── the stages ──────────────────────────────────────────────────────────────────────────────────────
const narrateArgs = ["--speed", "--voice"].flatMap((f) => (flag(f.slice(2)) ? [f, flag(f.slice(2))] : []));
const STAGES = [
  // the words before the voice: an id said alone, or a word used before it is defined (check-terms.mjs).
  // Its warnings show as a △ line and the build goes on; a bare id fails it on a `terms_check: strict` storyboard.
  ["check-terms", () => { const r = run(["node", [join(SCRIPTS, "check-terms.mjs"), "."]]); if (r.status === 0 && /^△/.test(last(r.out))) r.warn = true; return r; }],
  // facts from their sources (explain-first step 5): an explainer's quoted lines against its pinned sources, a secret
  // or a home path in its text, a `- decision:` in it. A video that is no explainer and names no source skips it.
  ["check-sources", () => { const r = run(["node", [join(SCRIPTS, "check-sources.mjs"), "."]]); if (r.status === 0 && /^·/.test(last(r.out))) return { skip: last(r.out).replace(/^·\s*check-sources:\s*/, "") }; if (r.status === 0 && /^△/.test(last(r.out))) r.warn = true; return r; }],
  ["narrate", () => run(["node", [join(SCRIPTS, "narrate.mjs"), ".", ...narrateArgs]])],
  ["fetch-sfx", () => run(["node", [join(S, "audio.mjs"), "fetch-sfx", "--storyboard", "./STORYBOARD.md", "--hyperframes", "."]])],
  ["transcribe-missing", () => run(["node", [join(SCRIPTS, "transcribe-missing.mjs"), "."]])],
  ["sync-durations", () => run(["node", [join(S, "audio.mjs"), "sync-durations", "--audio-meta", "./audio_meta.json", "--storyboard", "./STORYBOARD.md"]])],
  ["hold-durations", () => run(["node", [join(SCRIPTS, "hold-durations.mjs"), "."]])],
  ["retime-frames", retime],
  ["finish-project", () => run(["bash", [join(SCRIPTS, "finish-project.sh"), "."]])],
  ["verify", () => run(["bash", [join(SCRIPTS, "verify.sh"), ".", ...(argv.includes("--render") ? ["--render"] : [])]])],
  // the guide again, now with the scenes' pictures verify took, and its check (the plan guide, step 2): a layer with no
  // way in, a paragraph of plan.md missing, a made-up run, the narration said again… stop it; gaps are listed. A scene
  // whose picture the plan map names and is not there is a △ (step 3).
  ["guide", () => {
    const r = run(["node", [join(SCRIPTS, "guide.mjs"), ".", "--check"]]);
    if (r.status === 0 && /^·/.test(last(r.out))) return { skip: last(r.out).replace(/^·\s*/, "") };
    const pics = (readJson(join(dir, "guide", "parts.json"))?.gaps || []).filter((g) => /^scene \d+$/.test(g.where) && /picture/.test(g.what));
    const unopened = (r.out || "").split("\n").find((l) => /^\s*△ not opened in a browser/.test(l));
    if (r.status === 0 && unopened) { r.warn = true; r.out = `${(r.out || "").split("\n").find((l) => /^✓ /.test(l)) || ""}\n${unopened.trim()}\n`; }
    else if (r.status === 0 && pics.length) { r.warn = true; r.out += `\n△ ${pics.length} scene picture(s) missing: ${pics.map((g) => g.where.replace("scene ", "")).join(", ")} (reelplanner snapshot .)\n`; }
    else if (r.status === 0) r.out = (r.out || "").split("\n").filter((l) => /^✓ /.test(l.trim())).at(0) || r.out;
    return r;
  }],
];

// the checks a rebuild of an earlier version goes on past (above): they judge words and pages, and make nothing
const SOFT_IN_REBUILD = new Set(["check-terms", "check-sources", "guide"]);

// Each stage's own output is kept and shown in full only when it fails (or with --verbose); a line
// that passes shows the last thing it said.
function run([cmd, args]) {
  const r = spawnSync(cmd, args, { cwd: dir, env, encoding: "utf8", maxBuffer: 256 << 20, stdio: VERBOSE ? ["ignore", "inherit", "inherit"] : ["ignore", "pipe", "pipe"] });
  const out = `${r.stdout || ""}${r.stderr || ""}`;
  return { status: r.status ?? (r.error ? 1 : 0), out: r.error ? `${out}${r.error.message}\n` : out };
}
const secs = (ms) => `${(ms / 1000).toFixed(1)} s`;
const last = (out) => (out || "").split("\n").map((l) => l.trim()).filter((l) => l && !/^[-─=]+$/.test(l)).at(-1) || "";

console.log(`build ${relative(process.cwd(), dir) || "."}`);
const w = Math.max(...STAGES.map(([n]) => n.length));
const t0 = Date.now();
for (const [name, fn] of STAGES) {
  const t = Date.now(), r = fn();
  if (r.skip) { console.log(`${r.warn ? "△" : "·"} ${name.padEnd(w)}  ${secs(Date.now() - t).padStart(7)}  skipped: ${r.skip}`); continue; }
  // a version built again (`reel rebuild`, REELPLANNER_REBUILD=1) is built as it was reviewed: a check that has grown
  // stricter since judges it, but does not stop it (verify.sh goes on past its own checks the same way)
  if (r.status !== 0 && process.env.REELPLANNER_REBUILD === "1" && SOFT_IN_REBUILD.has(name)) {
    console.log(`△ ${name.padEnd(w)}  ${secs(Date.now() - t).padStart(7)}  failed, and a rebuild goes on (the version as it was reviewed): ${last(r.out).replace(/^[✗△]\s*/, "").slice(0, 110)}`);
    continue;
  }
  if (r.status !== 0) {
    console.log(`✗ ${name.padEnd(w)}  ${secs(Date.now() - t).padStart(7)}  stopped here (exit ${r.status}); what it said:`);
    if (!VERBOSE) console.log((r.out || "").replace(/\n+$/, "").split("\n").slice(-60).map((l) => `    ${l}`).join("\n"));
    if (name === "retime-frames") console.log(`  nothing after it ran. Re-run \`reelplanner build ${project}\` with the flags it asks for: the frames still to retime are kept in ${relative(process.cwd(), PENDING)}`);
    process.exit(1);
  }
  console.log(`${r.warn ? "△" : "✓"} ${name.padEnd(w)}  ${secs(Date.now() - t).padStart(7)}  ${VERBOSE ? "" : last(r.out).replace(/^[✓△]\s*/, "").slice(0, 110)}`);
  // what verify read of fresh eyes (videos-that-make-sense step 2, D-225), its own line: a finding with no answer
  // stopped verify above; no run yet, or scenes changed since the agents looked, is a △ here
  if (name === "verify" && !VERBOSE) for (const l of (r.out || "").split("\n").filter((x) => /^[✓△] fresh eyes/.test(x.trim()))) console.log(`${l.trim()[0]} ${"fresh-eyes".padEnd(w)}  ${"".padStart(7)}  ${l.trim().replace(/^[✓△]\s*fresh eyes[,:]?\s*/, "").slice(0, 150)}`);
}
console.log(`✓ built ${relative(process.cwd(), dir) || "."} in ${secs(Date.now() - t0)}`);
// the watched length against the budget (style guide §1): said, never a failure
const len = videoLength(dir);
if (len) console.log(`${len.verdict === "ok" ? "✓" : "△"} length  ${lengthLine(len)}`);
// one layout or one transition on over 70% of scenes, and a brief that does not say how the video varies: said, never a failure
for (const l of varietyLines(videoVariety(dir))) console.log(`${l.warn ? "△" : "✓"} variety  ${l.text}`);
