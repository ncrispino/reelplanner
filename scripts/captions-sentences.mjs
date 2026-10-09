#!/usr/bin/env node
// Rebuild the caption track at SENTENCE level from the SCRIPT, using whisper only for timing.
// The stock captions builder groups whisper's own transcription into 2–4-word karaoke chunks, which
// (a) leaks mis-heard words ("ride ahead" for "write-ahead") and (b) is too short to hold context.
// This aligns each frame's script words to that frame's whisper words (DP on normalised tokens),
// carries the whisper timings over, and regroups at sentence / clause boundaries (≤ MAX_WORDS).
// Then it swaps the GROUPS array inside compositions/captions.html and rewrites caption_groups.json.
//
// Names (names.md, the project's list): each tool and product is shown as the list says, a tool's name in
// code markup (a word's `code`, drawn by the caption layer as <code class="cap-code"> inside its word span);
// the script and the narration are untouched.
//
// Written and said (lib/say.mjs): a script writes `claude -p`, `plan.md`, `/work`; the voice said "claude dash
// p", "plan dot md", "slash work". Each written word is aligned by the words it was said as, and shown as
// written, one word over their times; a flag, a path or a file name is code. A script from before that says
// the spoken form itself ("names dot md") is shown written too (unspell: "names.md", one word over the run).
//
// usage: reelplanner captions-sentences <project-dir> [--max-words 14]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { numerals } from "./numerals.mjs";
import { ROOT } from "./lib/env.mjs";
import { namesFor, showNames, withCaptionCode, ensureCaptionCodeFonts } from "./lib/names.mjs";
import { saidWords, unspell } from "./lib/say.mjs";

const dir = process.argv[2]; if (!dir) { console.error("usage: reelplanner captions-sentences <project-dir>"); process.exit(1); }
const mi = process.argv.indexOf("--max-words"); const MAX = mi > 0 ? Number(process.argv[mi + 1]) : 14;
const TAIL = 0.12;
const NAMES = namesFor(dir, ROOT);

const sb = readFileSync(join(dir, "STORYBOARD.md"), "utf8");
const script = readFileSync(join(dir, "SCRIPT.md"), "utf8");
const meta = JSON.parse(readFileSync(join(dir, "audio_meta.json"), "utf8"));
const capPath = join(dir, "compositions/captions.html");
if (!existsSync(capPath)) { console.error(`✗ no compositions/captions.html in ${dir}: run reelplanner finish-project ${dir}, which builds it first`); process.exit(1); }

// frame starts (cumulative durations, storyboard order)
const durs = [...sb.matchAll(/^- duration:\s*([\d.]+)s?/gm)].map((m) => parseFloat(m[1]));
const starts = []; let t = 0; for (const d of durs) { starts.push(t); t += d; }
// script lines per frame: "## Line N — … (Frame N)" then the indented spoken block
const lines = {};
for (const m of script.matchAll(/^## Line \d+ —[^\n]*\(Frame (\d+)\)[\s\S]*?\n\n((?:    [^\n]*\n?)+)/gm)) {
  lines[Number(m[1])] = m[2].split("\n").map((l) => l.replace(/^ {4}/, "")).join(" ").replace(/\s+/g, " ").trim();
}
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9%]/g, "");
const NUM = { zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10", ninety: "90" };
const sim = (a, b) => { a = norm(a); b = norm(b); if (!a || !b) return 0; if (a === b) return 1; if ((NUM[a] || a) === (NUM[b] || b)) return 0.9; if (a.startsWith(b) || b.startsWith(a)) return 0.6; let c = 0; for (const ch of a) if (b.includes(ch)) c++; return 0.4 * c / Math.max(a.length, b.length); };

// Needleman–Wunsch: script tokens vs whisper tokens; gaps allowed both ways
function align(S, W) {
  const n = S.length, m = W.length, GAP = -0.5;
  const dp = Array.from({ length: n + 1 }, () => new Float64Array(m + 1)); const bt = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1));
  for (let i = 1; i <= n; i++) { dp[i][0] = i * GAP; bt[i][0] = 1; } for (let j = 1; j <= m; j++) { dp[0][j] = j * GAP; bt[0][j] = 2; }
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const d = dp[i - 1][j - 1] + sim(S[i - 1], W[j - 1].text) * 2 - 0.5, u = dp[i - 1][j] + GAP, l = dp[i][j - 1] + GAP;
    dp[i][j] = Math.max(d, u, l); bt[i][j] = dp[i][j] === d ? 0 : dp[i][j] === u ? 1 : 2;
  }
  const pairs = new Array(n).fill(null); let i = n, j = m;
  while (i > 0 || j > 0) { const b = i === 0 ? 2 : j === 0 ? 1 : bt[i][j]; if (b === 0) { pairs[i - 1] = j - 1; i--; j--; } else if (b === 1) i--; else j--; }
  return pairs;
}
const groups = []; let gi = 0;
const skipped = [];   // a frame with no whisper words gets NO captions at all — say so, loudly
for (const v of meta.voices || []) {
  const fi = v.frame, text = lines[fi];
  if (!text || !v.words?.length) { skipped.push(`${fi}${!text ? " (no script line)" : " (no word timings)"}`); continue; }
  // the script's words, each as the words the voice said for it (`-p` → dash, p), aligned to whisper's
  const written = text.split(" ").filter(Boolean), said = written.flatMap((w, k) => saidWords(w).map((t) => ({ t, k })));
  const S = said.map((x) => x.t), W = v.words, pairs = align(S, W), off = starts[fi - 1] || 0, cap = (v.duration_s || durs[fi - 1] || 1e9);
  // timing per said word: matched → whisper's; unmatched → interpolate between neighbours
  const saidTimed = S.map((w, k) => ({ text: w, start: pairs[k] != null ? W[pairs[k]].start : null, end: pairs[k] != null ? W[pairs[k]].end : null }));
  for (let k = 0; k < saidTimed.length; k++) if (saidTimed[k].start == null) {
    let a = k - 1; while (a >= 0 && saidTimed[a].end == null) a--; let b = k + 1; while (b < saidTimed.length && saidTimed[b].start == null) b++;
    const s0 = a >= 0 ? saidTimed[a].end : (b < saidTimed.length ? saidTimed[b].start - 0.3 : 0), s1 = b < saidTimed.length ? saidTimed[b].start : s0 + 0.3;
    const span = b - a - 1, idx = k - a - 1; saidTimed[k].start = s0 + (s1 - s0) * idx / span; saidTimed[k].end = s0 + (s1 - s0) * (idx + 1) / span;
  }
  for (const w of saidTimed) { w.start = Math.min(w.start, cap); w.end = Math.min(w.end, cap); }
  // back to the written words: each spans the words it was said as
  const timed = written.map((w, k) => { const ts = saidTimed.filter((_, j) => said[j].k === k); return { text: w, start: ts[0].start, end: ts[ts.length - 1].end, n: ts.length }; });
  const shown = showNames(numerals(unspell(timed)), NAMES);
  // regroup: hard break on . ? ! ; soft break on , ; : — when the clause already has ≥ 6 words; cap at MAX
  // (a group's length is counted in words said, so `claude -p` weighs what "claude dash p" did: a script
  // moved to the written form, or an old one shown written, keeps its groups)
  let cur = [], size = 0;
  const flush = () => { size = 0; if (!cur.length) return; groups.push({ id: `caption-group-${gi}`, frame: fi, start: +(off + cur[0].start).toFixed(3), end: +(off + cur[cur.length - 1].end + TAIL).toFixed(3), text: cur.map((w) => w.text).join(" "), words: cur.map((w, wi) => ({ id: `caption-word-${gi}-${wi}`, text: w.text, start: +(off + w.start).toFixed(3), end: +(off + w.end).toFixed(3), ...(w.code ? { code: w.code } : {}), ...(w.run ? { run: w.run } : {}) })) }); gi++; cur = []; };
  for (const w of shown) { cur.push(w); size += w.n ?? 1; const hard = /[.?!]$/.test(w.text), soft = /[,;:—]$/.test(w.text) || w.text === "—"; if (hard || size >= MAX || (soft && size >= 6)) flush(); }
  flush();
}
// clamp: no word past its frame's voice, global time order, and no overlap between consecutive groups
groups.sort((a, b) => a.start - b.start);
for (let k = 0; k + 1 < groups.length; k++) if (groups[k].end > groups[k + 1].start) groups[k].end = +(groups[k + 1].start - 0.01).toFixed(3);
let html = readFileSync(capPath, "utf8");
const re = /var GROUPS = \[[\s\S]*?\];\n/;
if (!re.test(html)) { console.error(`✗ ${capPath} has no \`var GROUPS = [...]\` line to fill: rebuild it with reelplanner finish-project ${dir}`); process.exit(1); }
html = html.replace(re, `var GROUPS = ${JSON.stringify(groups)};\n`);
const coded = withCaptionCode(html);
if (coded.error) console.error(`△ captions-sentences: ${coded.error}; names show as plain words`);
else html = coded.html;
// the code chip's face, in a new project that has no assets/fonts/ yet (else `hyperframes check` fails on a 404)
if (!coded.error) for (const f of ensureCaptionCodeFonts(dir, ROOT)) console.log(`  font for the code chips → ${f}`);
writeFileSync(capPath, html); writeFileSync(join(dir, "caption_groups.json"), JSON.stringify(groups, null, 2) + "\n");
const avg = groups.reduce((a, g) => a + g.words.length, 0) / groups.length;
const codeWords = groups.reduce((a, g) => a + g.words.filter((w) => w.code).length, 0);
console.log(`✓ captions-sentences: ${groups.length} groups from the script (avg ${avg.toFixed(1)} words, max ${MAX})${codeWords ? `, ${codeWords} word(s) of tool names in code markup` : ""} → ${capPath}`);
// a frame with no word timings would lose every caption it has: the audio step drops them under load
// often enough that this fails rather than going on without them
if (skipped.length) {
  console.error(`✗ captions-sentences: ${skipped.length} frame(s) got NO captions — ${skipped.join(", ")}`);
  console.error(`  Word timings missing? Run: reelplanner transcribe-missing ${dir}`);
  process.exit(1);
}
