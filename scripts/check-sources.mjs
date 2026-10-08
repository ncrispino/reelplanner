#!/usr/bin/env node
// Facts from their sources, and only them (explain-first, step 5; D-249). Run by `build` after check-terms, on an
// explainer (`kind: explainer`) and on any video whose scenes name a `- source:`:
//
//   ✗  a quoted line (text inside a `data-artifact`, outside a `data-label` or `data-gloss`) its source does not hold
//      word for word (whitespace aside; "…" marks a cut, and each piece is checked). A repo file is read as it was
//      at the pinned commit
//   ✗  a `- source:` that is not pinned in sources.json (a source's id, a file in one, `:<from>-<to>` for lines)
//   ✗  a secret (a key such as sk-… or ghp_…, a private key, a password=), an email address, or a path in a home
//      folder, anywhere in the video's text: the text is committed (D-249), so it is masked in the text
//      (ghp_…REDACTED), never blurred on screen, and a home path is shown as ~/…
//   ✗  a `- decision:` beat in an explainer: it asks nothing to decide
//   △  a scene that states a number, or quotes a thing, with no `- source:`; ✗ under `sources_check: strict`
//   △  a source that cannot be read here (a transcript on another machine), or changed since it was pinned
//
// usage: reelplanning check-sources <video-dir>
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { storyboardFrames, frontMatter, fmValue } from "./lib/terms.mjs";
import { parseScript } from "./lib/narration.mjs";
import { explainerDirOf, readSources, resolveRefs, sourceText, privateIn, cut, maskOf, repoTop } from "./lib/explainer.mjs";

const target = process.argv[2];
if (!target) { console.error("usage: reelplanning check-sources <video-dir>"); process.exit(1); }
const dir = resolve(target), read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const sb = read(join(dir, "STORYBOARD.md"));
if (!sb) { console.error(`✗ check-sources: no STORYBOARD.md in ${target}`); process.exit(1); }
const fm = frontMatter(sb), kind = fmValue(fm, "kind"), strict = fmValue(fm, "sources_check") === "strict";
const frames = storyboardFrames(sb);
const explainer = kind === "explainer";
if (!explainer && !frames.some((f) => f.meta.source)) { console.log("· check-sources: nothing to check (not an explainer, and no scene names a `- source:`)"); process.exit(0); }

const fails = [], warns = [], seen = new Set();
const fail = (t) => fails.push(t), warn = (t) => { if (!seen.has(t)) { seen.add(t); warns.push(t); } };
const edir = explainerDirOf(dir), pinned = edir ? readSources(edir) : readSources(dir);
const repo = repoTop(dir) || resolve(dir, "..");
if (!pinned) fail(`no sources.json ${edir ? `in ${relative(process.cwd(), edir)}` : "beside this video"}: nothing is pinned, so no fact can name its source (\`reelplanning explain\` writes it)`);
const sources = pinned?.sources || [];

// ── the text of a frame: what is quoted (inside a data-artifact), and all of what shows ─────────────────
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", mdash: "—", ndash: "–", rarr: "→", larr: "←", middot: "·", times: "×", minus: "−" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENT[e.toLowerCase()] ?? m);
const BLOCK = new Set("div p li ul ol tr td th table pre h1 h2 h3 h4 h5 h6 section article header footer br hr code".split(" "));
const VOID = new Set("br hr img input meta link source wbr area col embed".split(" "));
function frameText(html) {
  const body = String(html).replace(/<!--[\s\S]*?-->/g, "").replace(/<\/?template\b[^>]*>/gi, "").replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "");
  const quoted = [], all = []; const stack = []; let buf = "", bufArt = null;
  const flush = () => { const t = buf.replace(/\s+/g, " ").trim(); if (t) { if (bufArt != null) quoted.push({ text: t, artifact: bufArt }); } buf = ""; };
  const inArt = () => { for (let i = stack.length - 1; i >= 0; i--) if (stack[i].artifact != null) return stack[i].artifact; return null; };
  const skipped = () => stack.some((x) => x.skip);
  for (const m of body.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>|([^<]+)/g)) {
    if (m[3] != null) { const t = decode(m[3]); all.push(t); const a = inArt(); if (a != null && !skipped()) { if (bufArt !== a) { flush(); bufArt = a; } for (const [i, piece] of t.split("\n").entries()) { if (i) flush(); buf += piece; } } continue; }
    const tag = m[1].toLowerCase(), closing = m[0][1] === "/", attrs = m[2] || "";
    if (BLOCK.has(tag)) flush();
    if (closing) { const i = stack.map((x) => x.tag).lastIndexOf(tag); if (i >= 0) stack.length = i; continue; }
    if (VOID.has(tag) || /\/\s*$/.test(attrs)) continue;
    const art = /\bdata-artifact(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/.exec(attrs);
    stack.push({ tag, artifact: art ? decode(art[1] ?? art[2] ?? art[3] ?? "") : null, skip: /\bdata-(?:label|gloss)\b/.test(attrs) });
  }
  flush();
  return { quoted, all: all.join(" ").replace(/\s+/g, " ") };
}

// ── a source's text, normalized once: whitespace collapsed, and a JSON-escaped line (a transcript's) read plainly ──
const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const unescapeJson = (s) => String(s).replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\n|\\t|\\r/g, " ").replace(/\\(["\\/])/g, "$1");
const textCache = new Map();
function haystack(ref) {
  const key = `${ref.source.id}|${ref.path || ""}|${ref.from || ""}-${ref.to || ""}`;
  if (textCache.has(key)) return textCache.get(key);
  const { text, note } = sourceText(ref.source, { repo, path: ref.path });
  if (note) warn(`${ref.path || ref.source.id}: ${note}`);
  let t = text;
  if (t != null && ref.from) t = t.split("\n").slice(ref.from - 1, ref.to).join("\n");
  const h = t == null ? null : `${norm(t)}\u0000${norm(unescapeJson(t))}`;
  textCache.set(key, h); return h;
}

// ── each scene ─────────────────────────────────────────────────────────────────────────────────────────
const said = Object.fromEntries(parseScript(read(join(dir, "SCRIPT.md"))).map((l) => [l.frame, l.text]));
const NOT_A_FACT = /\b(?:steps?|scenes?|parts?|chapters?|questions?|lines?|frames?|options?|round|choice)\s+\d+(?:\s*(?:,|and|to|or|–|-)\s*\d+)*|\b[DAdak]-?\d+\b|\b[kq]\d+\b/gi;
let nQuoted = 0, nScenes = 0;
for (const f of frames) {
  const scene = `scene ${f.index}`;
  if (explainer && f.meta.decision) fail(`${scene} · a \`- decision:\` beat: an explainer asks nothing to decide (a quick check goes where there is something to predict)`);
  const refs = f.meta.source ? resolveRefs(f.meta.source, sources) : [];
  for (const r of refs.filter((x) => x.missing)) fail(`${scene} · \`- source: ${r.ref}\` is not pinned in sources.json (a source's id, a file in one, or either with :<from>-<to>)`);
  const good = refs.filter((x) => !x.missing);
  const html = f.meta.src ? read(join(dir, f.meta.src)) : "", { quoted, all } = frameText(html);
  const narration = said[f.index] ?? String(f.meta.voiceover || "").replace(/^"(.*)"$/, "$1");
  nScenes++;
  // the private things: anywhere in what shows or is said
  for (const p of privateIn(`${all}\n${narration}`)) fail(`${scene} · ${p.what} in its text (${cut(p.found)}): the build stops until the text itself is cut or masked (${/@/.test(p.found) ? "name@…" : p.what.startsWith("a path") ? "~/…" : maskOf(p.found)}); a blur would leave it in the committed text`);
  // a number said, or a thing quoted, with no source
  const numbers = narration.replace(NOT_A_FACT, " ").match(/\b\d[\d,.]*\d\b|\b\d\b/g);
  if (!good.length && (numbers || quoted.length)) (strict ? fail : warn)(`${scene} · ${quoted.length ? "quotes a thing" : `says ${numbers.slice(0, 2).map((n) => `"${n}"`).join(", ")}`} with no \`- source:\`${strict ? " (sources_check: strict)" : ""}`);
  // each quoted line, word for word
  if (!good.length) continue;
  const names = [...good.flatMap((r) => [r.source.id, r.path, r.source.commit, r.source.range, r.source.path]), ...quoted.map((q) => q.artifact)].filter(Boolean).map(norm);
  const hay = good.map((r) => haystack(r)), readable = hay.filter((h) => h != null);
  for (const q of quoted) {
    // a masked secret (ghp_…REDACTED) is a cut too: the pieces around it are checked, the mask itself never
    const pieces = q.text.replace(/REDACTED/g, "…").split(/…|\.\.\./).map(norm).filter((p) => p.length >= 3 && /[A-Za-z0-9]/.test(p));
    for (const p of pieces) {
      nQuoted++;
      if (names.some((n) => n.includes(p))) continue;          // the artifact's own name, a path or a commit it shows
      if (!readable.length) continue;                          // said above: the source cannot be read here
      if (readable.some((h) => h.includes(p))) continue;
      if (privateIn(p).length) continue;                        // failed above already, and never printed whole
      fail(`${scene} · quoted line not in ${good.map((r) => r.ref).join(", ")}: "${p.length > 90 ? `${p.slice(0, 89)}…` : p}"`);
    }
  }
}
// the rest of the explainer's text that goes into git: its storyboard, script, explain.md and details
const rest = [["STORYBOARD.md", sb], ["SCRIPT.md", read(join(dir, "SCRIPT.md"))], ...(edir ? [["explain.md", read(join(edir, "explain.md"))]] : []),
  ...(existsSync(join(dir, "details")) ? readdirSync(join(dir, "details")).filter((x) => x.endsWith(".html")).map((x) => [`details/${x}`, frameText(read(join(dir, "details", x))).all]) : [])];
for (const [name, text] of rest) for (const p of privateIn(text)) fail(`${name} · ${p.what} (${cut(p.found)}): cut or mask it in the text`);

for (const f of fails) console.log(`✗ ${f}`);
for (const w of warns) console.log(`△ ${w}`);
const tail = `${nScenes} scene${nScenes === 1 ? "" : "s"}, ${nQuoted} quoted piece${nQuoted === 1 ? "" : "s"} against ${sources.length} pinned source${sources.length === 1 ? "" : "s"}`;
console.log(fails.length ? `✗ check-sources: ${fails.length} failure(s), ${warns.length} warning(s) · ${tail}` : warns.length ? `△ check-sources: ${warns.length} warning(s) · ${tail}` : `✓ check-sources: ${tail}`);
process.exit(fails.length ? 1 : 0);
