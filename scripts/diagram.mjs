#!/usr/bin/env node
// Write a diagram explainer's frames from its scene files with the diagram kit (templates/diagram/, docs/diagram-kit.md):
// a world of two or three actors, each with an item and a destination slot with a lock, arrows of who can deliver to
// whom, a shared area, and the kit's moves, each put on the word the narration says it.
//
// usage: reelplanner diagram <video-dir> [--silent] [<frame number> …]
//
// In:  <video>/world.json             the actors, their items and slots, the arrows, the slots' states, the clock,
//                                     and any other strings a scene shows (docs/diagram-kit.md says each field)
//      <video>/scenes/NN-slug.html    a scene: its own markup, then <script> … </script> with its moves on K, each
//                                     at an anchor. Its head comments say where it starts and how long it holds:
//                                       <!-- start: {"layout": "ring", "areas": true, "names": true, …} -->
//                                       <!-- tail: 1.2 -->   seconds after its line (or <!-- hold: 3 --> with no line)
//      <video>/audio_meta.json        the narration's word times (`reelplanner narrate`); not read with --silent
// Out: <video>/compositions/frames/NN-slug.html   the frame its storyboard's `- src:` names
//      <video>/assets/diagram/kit.js, assets/vendor/gsap.min.js   the moves and gsap, copied
//      <video>/.hyperframes/caption-skin.html     captions in the frames' type, when the video has no skin of its own
//      <video>/.hyperframes/holds.json            each scene's tail or hold, read by `build`
//
// Anchors, in a scene's script: @@a phrase@@ (the second the line says it), @@a phrase+0.4@@, @@word#2@@ (its
// second time), @@END@@ (the line's end), @@DUR@@ (the frame's length: its line plus its tail). With --silent (no
// voice yet) each frame is as long as its hold (8 s by default) and the phrases are spread through it in order: a
// frame to look at before narrating. Run it again after every narrate and every edit to a scene; `build` does not.
//
// Every word of the world is static markup with data-label, so lint, the layout and contrast checks and a source
// check read it. Each actor's colour, and the good and warn tones, are darkened (hue and saturation kept) until they
// read at 4.6:1 on the paper, the card and the shared area.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, copyFileSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { ROOT, depFile, GSAP } from "./lib/env.mjs";

const args = process.argv.slice(2), SILENT = args.includes("--silent");
const pos = args.filter((a) => !a.startsWith("--"));
const die = (m) => { console.error(`✗ diagram: ${m}`); process.exit(1); };
if (!pos[0]) die("usage: reelplanner diagram <video-dir> [--silent] [<frame number> …]");
const dir = resolve(pos[0]), only = new Set(pos.slice(1).map(Number));
const KIT = join(ROOT, "templates", "diagram");
if (!existsSync(join(dir, "world.json"))) die(`no world.json in ${pos[0]} (docs/diagram-kit.md)`);
const W = JSON.parse(readFileSync(join(dir, "world.json"), "utf8"));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ── colour: an hsl() darkened until it reads ───────────────────────────────────────────────────────────────────
function hslRgb(c) {
  const m = /hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/.exec(c); if (!m) return null;
  const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100, q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
}
const lum = (rgb) => { const [r, g, b] = rgb.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** `c` with its lightness stepped down 0.5% at a time until it reaches 4.6:1 on every one of `grounds`. */
function readable(c, grounds) {
  const m = /hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/.exec(c); if (!m) die(`colour ${c} is not hsl(H S% L%)`);
  const bs = grounds.map(hslRgb); let l = +m[3];
  while (l > 5 && bs.some((b) => ratio(hslRgb(`hsl(${m[1]} ${m[2]}% ${l}%)`), b) < 4.6)) l -= 0.5;
  return `hsl(${m[1]} ${m[2]}% ${l}%)`;
}
const T = { paper: "hsl(45 33% 97%)", chrome: "hsl(38 33% 91%)", card: "hsl(0 0% 100%)", rule: "hsl(40 14% 84%)", "rule-2": "hsl(40 10% 70%)",
  ink: "hsl(60 3% 8%)", "ink-2": "hsl(40 5% 33%)", good: "hsl(150 55% 32%)", warn: "hsl(16 62% 42%)", ...(W.tokens || {}) };
const GROUNDS = [T.paper, T.card, T.chrome];
for (const k of ["ink-2", "good", "warn"]) T[k] = readable(T[k], GROUNDS);

// ── the world ──────────────────────────────────────────────────────────────────────────────────────────────────
const actors = W.actors || [];
if (actors.length < 2 || actors.length > 3) die("world.json: two or three actors (the layouts are drawn for those)");
const A = actors.map((a) => a.id), by = Object.fromEntries(actors.map((a) => [a.id, a]));
for (const a of actors) for (const k of ["id", "name", "color", "item", "slot"]) if (!a[k]) die(`world.json: actor ${a.id || "?"} has no "${k}"`);
const COL = Object.fromEntries(actors.map((a) => [a.id, readable(a.color, GROUNDS)]));
const arrows = (W.arrows || []).map((e) => { if (!by[e.from] || !by[e.to]) die(`world.json: arrow ${e.from}>${e.to} names no actor`); return e; });
const states = W.states || [{ key: "empty", text: "empty" }];
const giver = (a) => arrows.find((e) => e.to === a);
const words = (s, a) => String(s).replace(/\{(\w+)\}/g, (m, k) => k === "from" ? (giver(a) ? by[giver(a).from].name : "") : by[a][k] ?? m);

const RING = A.length === 2 ? [[520, 420], [1400, 420]] : [[960, 215], [380, 700], [1540, 700]], HW = 300, HH = 160, CEN = [960, 540];
const clip = (c, d, hw, hh) => { const t = Math.min(d[0] ? hw / Math.abs(d[0]) : 1e9, d[1] ? hh / Math.abs(d[1]) : 1e9); return [c[0] + d[0] * t, c[1] + d[1] * t]; };
const edges = arrows.map((e) => {
  const a = RING[A.indexOf(e.from)], b = RING[A.indexOf(e.to)], d = [b[0] - a[0], b[1] - a[1]];
  const s = clip(a, d, HW, HH), en = clip(b, [-d[0], -d[1]], HW + 12, HH + 12), m = [(s[0] + en[0]) / 2, (s[1] + en[1]) / 2];
  let nx = -(en[1] - s[1]), ny = en[0] - s[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
  // three actors: each arrow bows away from the middle; two: each bows to its own side, so the pair never overlap
  if (A.length === 3 && (m[0] - CEN[0]) * nx + (m[1] - CEN[1]) * ny < 0) { nx = -nx; ny = -ny; }
  const c = [m[0] + nx * 70, m[1] + ny * 70], pts = [];
  for (let k = 0; k <= 24; k++) { const t = k / 24, u = 1 - t; pts.push([Math.round(u * u * s[0] + 2 * u * t * c[0] + t * t * en[0]), Math.round(u * u * s[1] + 2 * u * t * c[1] + t * t * en[1])]); }
  const [p1, p2] = [pts[23], pts[24]], ul = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) || 1, vx = (p2[0] - p1[0]) / ul, vy = (p2[1] - p1[1]) / ul;
  const tip = [en[0] + vx * 4, en[1] + vy * 4], head = [tip, [tip[0] - vx * 26 - vy * 13, tip[1] - vy * 26 + vx * 13], [tip[0] - vx * 26 + vy * 13, tip[1] - vy * 26 - vx * 13]];
  let len = 0; for (let k = 1; k < pts.length; k++) len += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
  // the arrow's words beside it, never on it: out to the side of a steep arrow, above or below a flat one
  const mid = pts[12], w = String(e.words || "").length * 13.6 + 20;
  const lab = Math.abs(nx) > Math.abs(ny) ? [Math.round(mid[0] + Math.sign(nx) * (w / 2 + 26)), Math.round(mid[1])] : [Math.round(mid[0]), Math.round(mid[1] + Math.sign(ny) * 40)];
  return { ...e, pts, d: `M${s[0].toFixed(1)} ${s[1].toFixed(1)} Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${(en[0] - vx * 18).toFixed(1)} ${(en[1] - vy * 18).toFixed(1)}`, head, len: Math.ceil(len), lab };
});
const LOCK = (a) => `<svg class="dk-lock" data-lock="${a}" viewBox="0 0 30 36"><path class="sh" d="M8 16V11a7 7 0 0 1 14 0v5" style="fill:none;stroke:var(--ink-2);stroke-width:3.4"/><rect x="3" y="16" width="24" height="18" rx="4" style="fill:var(--ink-2)"/></svg>`;
const SHEET = '<div class="dk-sheet">' + [0, 1, 2, 3, 4].map((k) => `<i style="top:${14 + k * 11}px"></i>`).join("") + "</div>";
function worldMarkup() {
  let h = `<div class="dk-enclosure" data-label><span>${esc(W.enclosure || "")}</span></div> <div class="dk-at dk-shared"><span class="dk-sharedlab" data-label>${esc(W.shared || "")}</span></div>`;
  for (const a of A) {
    const c = `var(--a-${a})`, X = by[a];
    h += ` <div class="dk-at dk-area" data-area="${a}" style="--c:${c}"><span class="dk-arealab" data-label>${esc(X.area || "")}</span></div>`
      + `<div class="dk-at dk-name" data-name="${a}" style="--c:${c}" data-label><i></i>${esc(X.name)}</div>`
      + `<div class="dk-at dk-cursor" data-cursor="${a}">${esc(W.cursor || "›")}<b></b></div>`
      + `<div class="dk-at dk-item" data-item="${a}" style="--c:${c}">${SHEET}<span class="dk-itemlab" data-label>${esc(X.item)}</span></div>`
      + `<div class="dk-at dk-slot" data-slot="${a}" style="--c:${c}"><div class="dk-scap" data-label><b>${esc(X.name)}</b>${esc(W.slotSuffix ?? "’s slot")}<span class="dk-locked" data-locked="${a}">${esc(words(W.locked || "", a))}</span></div>`
      + `<div class="dk-sline">${LOCK(a)}<span class="dk-slotname" data-label>${esc(X.slot)}</span></div> `
      + states.map((s) => `<span class="dk-state${s.tone ? " " + s.tone : ""}" data-state="${a}:${s.key}" data-label>${esc(words(s.text, a))}</span> `).join("")
      + `</div> <div class="dk-at dk-item" data-copy="${a}" style="--c:${c}">${SHEET}</div>`
      + `<div class="dk-at dk-ping" data-ping="${a}" style="--c:${c}"></div>`;
  }
  let svg = `<svg class="dk-svg" width="1920" height="1080" viewBox="0 0 1920 1080">`;
  for (const e of edges) svg += `<g class="dk-arrow" data-arrow="${e.from}>${e.to}" data-len="${e.len}" data-pts="${esc(JSON.stringify(e.pts))}" style="--c:var(--a-${e.from})"><path class="l" d="${e.d}"/><polygon points="${e.head.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}"/>${[0, 1, 2].map(() => '<circle r="7" cx="-50" cy="-50"/>').join("")}</g>`;
  svg += "</svg>";
  const labs = edges.filter((e) => e.words).map((e) => `<div class="dk-words" data-words="${e.from}>${e.to}" style="--c:var(--a-${e.from});position:absolute;left:${e.lab[0]}px;top:${e.lab[1]}px;transform:translate(-50%,-50%)" data-label>${esc(e.words)}</div>`).join(" ");
  return `<div class="dk-at dk-cam" style="width:1920px;height:1080px;transform-origin:0 0"><div class="dk-world">${svg}${h} ${labs}</div></div>`;
}
const G = { actors: actors.map((a) => ({ id: a.id, name: a.name })), arrows: arrows.map((e) => ({ from: e.from, to: e.to })), first: states[0].key, clock: W.clock || { unit: "", length: 1 } };
const fill = (t, f) => t.replace(/\{\{(\w+)(?::([\w-]+))?\}\}/g, (m, k, a) => {
  if (a) { if (!by[a]) die(`${f}: {{${k}:${a}}} names no actor`); if (k === "color") return `var(--a-${a})`; if (k === "from") return esc(words("{from}", a)); if (by[a][k] != null) return esc(by[a][k]); }
  else if (W.strings && W.strings[k] != null) return esc(W.strings[k]);
  die(`${f}: no {{${m.slice(2, -2)}}} in world.json`);
});

// ── anchors: each @@phrase@@ on the second the line says it ────────────────────────────────────────────────────
const ANCHOR = /@@(.+?)@@/g, norm = (w) => w.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]/g, "");
const split = (a) => { const m = /^(.*?)([+-]\d+(?:\.\d+)?)$/.exec(a.trim()); return m && !m[1].endsWith(" ") ? [m[1].trim(), +m[2]] : [a.trim(), 0]; };
function resolveText(code, voice, dur) {
  const ws = [], st = [];
  for (const w of voice.words) for (const part of String(w.text).split(/[-/]+/)) if (norm(part)) { ws.push(norm(part)); st.push(w.start); }
  const missing = [], repeated = new Set();
  const out = code.replace(ANCHOR, (m, raw) => {
    let [a, off] = split(raw);
    if (a === "DUR") return (dur + off).toFixed(2);
    if (a === "END") return (voice.duration_s + off).toFixed(2);
    let nth = 1; if (a.includes("#")) { const i = a.lastIndexOf("#"); nth = +a.slice(i + 1); a = a.slice(0, i); }
    const want = a.split(/[\s\-/]+/).map(norm).filter(Boolean), hits = [];
    for (let i = 0; i + want.length <= ws.length; i++) if (want.every((w, j) => ws[i + j] === w)) hits.push(i);
    if (hits.length > 1 && nth === 1) repeated.add(a);
    if (hits.length >= nth) return Math.max(0, st[hits[nth - 1]] + off).toFixed(2);
    missing.push(raw); return "0";
  });
  return { out, missing, repeated: [...repeated] };
}
function silentText(code, dur) {
  const names = []; for (const m of code.matchAll(ANCHOR)) { const a = split(m[1])[0]; if (a !== "DUR" && a !== "END" && !names.includes(a)) names.push(a); }
  return code.replace(ANCHOR, (m, raw) => { const [a, off] = split(raw); if (a === "DUR") return (dur + off).toFixed(2); if (a === "END") return (dur - 0.6 + off).toFixed(2);
    return Math.max(0, 0.4 + (dur - 1.6) * names.indexOf(a) / Math.max(1, names.length) + off).toFixed(2); });
}

// ── the frames ─────────────────────────────────────────────────────────────────────────────────────────────────
const sdir = join(dir, "scenes"), files = existsSync(sdir) ? readdirSync(sdir).filter((f) => /^\d+-.+\.html$/.test(f)).sort() : [];
if (!files.length) die("no scenes/NN-slug.html");
const voices = SILENT ? {} : existsSync(join(dir, "audio_meta.json")) ? Object.fromEntries(JSON.parse(readFileSync(join(dir, "audio_meta.json"), "utf8")).voices.map((v) => [v.frame, v]))
  : die("no audio_meta.json: narrate first (`reelplanner narrate`), or --silent for a frame to look at before then");
const holdsPath = join(dir, ".hyperframes", "holds.json");
mkdirSync(join(dir, ".hyperframes"), { recursive: true });
const holds = existsSync(holdsPath) ? JSON.parse(readFileSync(holdsPath, "utf8")) : {};
for (const d of ["compositions/frames", "assets/diagram", "assets/vendor"]) mkdirSync(join(dir, d), { recursive: true });
copyFileSync(join(KIT, "kit.js"), join(dir, "assets/diagram/kit.js"));
try { copyFileSync(depFile(...GSAP), join(dir, "assets/vendor/gsap.min.js")); } catch (e) { die(e.message); }
// captions in the frames' type (Inter on a dark pill), not HyperFrames' default Roboto pill; a video's own skin is kept
const skin = join(dir, ".hyperframes", "caption-skin.html");
if (!existsSync(skin)) { copyFileSync(join(KIT, "caption-skin.html"), skin); console.log("· .hyperframes/caption-skin.html: the kit's captions, in the frames' type"); }
const CSS = readFileSync(join(KIT, "kit.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*\n/g, "\n").trim();
const TOK = [...Object.entries(T).map(([k, v]) => `--${k}:${v}`), ...A.map((a) => `--a-${a}:${COL[a]}`)].join(";");
const WORLD = worldMarkup();
let bad = 0;
for (const f of files) {
  const id = f.replace(/\.html$/, ""), n = parseInt(f, 10);
  if (only.size && !only.has(n)) continue;
  const src = readFileSync(join(sdir, f), "utf8");
  const start = JSON.parse((/<!--\s*start:\s*(\{[\s\S]*?\})\s*-->/.exec(src) || [0, "{}"])[1]);
  const tail = +((/<!--\s*tail:\s*([\d.]+)\s*-->/.exec(src) || [0, 0])[1]), hold = +((/<!--\s*hold:\s*([\d.]+)\s*-->/.exec(src) || [0, 0])[1]);
  const sm = /<script>([\s\S]*?)<\/script>/.exec(src); if (!sm) die(`${f}: no <script> with the scene's moves`);
  const markup = fill(src.slice(0, sm.index).replace(/<!--[\s\S]*?-->/g, "").trim(), f);
  const voice = voices[n];
  let dur, code, note = "";
  if (SILENT) { dur = hold || +holds[n] || 8; code = silentText(sm[1].trim(), dur); note = "silent"; }
  else if (!voice) {
    if (!hold) { console.log(`✗ ${id}: no line in audio_meta.json, and no <!-- hold: … -->`); bad++; continue; }
    dur = hold; holds[n] = hold; ({ out: code } = resolveText(sm[1].trim(), { words: [], duration_s: hold }, dur)); note = "no line";
  } else {
    dur = Math.max(voice.duration_s + (tail || +holds.tail || 0), hold); dur = Math.round(dur * 100) / 100;
    if (tail || hold) holds[n] = dur; else delete holds[n];
    const r = resolveText(sm[1].trim(), voice, dur); code = r.out;
    if (r.missing.length) { console.log(`✗ ${id}: not said in its line: ${r.missing.join(", ")}`); bad++; }
    if (r.repeated.length) console.log(`  △ ${id}: said more than once, the first taken (name another with #2): ${r.repeated.join(", ")}`);
  }
  const html = `<template>
<!-- Written by \`reelplanner diagram\` from scenes/${f}: edit the scene, not this file. -->
<style>
#root{${TOK}}
${CSS}
</style>
<div id="root" class="dk-root" data-composition-id="${id}" data-width="1920" data-height="1080" data-duration="${dur.toFixed(2)}" data-band="bottom">
${WORLD}
${markup}
</div>
<script src="assets/vendor/gsap.min.js"></script>
<script src="assets/diagram/kit.js"></script>
<script>
(function () {
  var root = document.querySelector('[data-composition-id="${id}"]'); window.__timelines = window.__timelines || {};
  var tl = gsap.timeline({ paused: true }); window.__timelines["${id}"] = tl;
  var G = ${JSON.stringify(G)}, DUR = ${dur.toFixed(2)}, K = DiagramKit(root, tl, G, DUR);
  K.start(${JSON.stringify(start)});
${code}
  tl.to({}, { duration: 0.001 }, DUR - 0.001);
})();
</script>
</template>
`;
  writeFileSync(join(dir, "compositions", "frames", f), html);
  console.log(`✓ ${id}: ${dur.toFixed(2)} s${note ? ` (${note})` : ""}`);
}
if (!SILENT) {
  for (const k of Object.keys(holds)) if (/^\d+$/.test(k) && !files.some((f) => parseInt(f, 10) === +k)) delete holds[k];
  writeFileSync(holdsPath, JSON.stringify(holds, null, 1) + "\n");
}
for (const f of readdirSync(join(dir, "compositions", "frames"))) if (/^\d+-.+\.html$/.test(f) && !files.includes(f)) { unlinkSync(join(dir, "compositions", "frames", f)); console.log(`· removed compositions/frames/${f}: no scene of that name`); }
if (bad) process.exit(1);
console.log(SILENT ? "next: look (`reelplanner shoot`), then narrate and run this again" : "next: reelplanner build <video-dir> --render");
