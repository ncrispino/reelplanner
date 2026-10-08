// Names: how each tool and product is written in a script and how it is shown, kept once for the project
// in .reelplanning/names.md (the package's templates/reelplanning/names.md when a repo has none).
//
//   | Written | Shown | A command's next words |
//   | reelplanning, ReelPlanning | `reelplanning` | build, review, setup |
//   | github | GitHub | |
//
// A Shown in backticks is code: the name of a tool or a command, shown in code markup (the mono chip)
// wherever it appears, in its own spelling ("Reel status" in a script shows as `reel status`). A Shown
// without backticks is a plain word, shown with that case ("github" → GitHub, "cli" → CLI). A command's
// next words are the words that carry its code run on ("reel status", "claude -p", "npx reelplanning
// build"); another code name next to it carries it on too.
//
// captions-sentences applies it to each caption word (showNames); check-terms warns on a listed name on
// screen that is spelled the wrong way, or a code name outside code markup (namesOnScreen).
//
// A word that is itself a flag, a path or a file name (`-p`, `--dry-run`, `/work`, `plan.md`, lib/say.mjs's
// codeWord) is code too, listed or not, and joins a code name next to it: `claude -p` is one chip.
import { existsSync, readFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { rpDirFor } from "./terms.mjs";
import { codeWord } from "./say.mjs";

const readText = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** names.md's table → [{ shown, code, forms: [["reel","planning"], ["reelplanning"]], then: [["dash","p"]] }]. */
export function parseNames(md) {
  const rows = [];
  let cols = null;
  for (const line of String(md).split("\n")) {
    if (!/^\|/.test(line) || /^\|\s*:?-/.test(line)) continue;
    const c = line.split("|").slice(1, -1).map((s) => s.trim());
    if (/^written\b/i.test(c[0] || "")) { cols = { then: c.findIndex((h) => /next words|then/i.test(h)) }; continue; }
    if (!cols || c.length < 2 || !c[1]) continue;
    const shownRaw = c[1], code = /^`[^`]+`$/.test(shownRaw), shown = shownRaw.replace(/`/g, "").trim();
    const list = (s) => String(s || "").replace(/`/g, "").split(",").map((x) => x.trim()).filter(Boolean).map((x) => x.split(/\s+/));
    const forms = list(c[0]); if (!forms.some((f) => f.join(" ") === shown)) forms.push(shown.split(/\s+/));
    rows.push({ shown, code, forms, then: cols.then >= 0 ? list(c[cols.then]) : [] });
  }
  return rows;
}

/** The names a video uses: its repo's .reelplanning/names.md, else the package's. */
export function namesFor(dir, root) {
  const rp = rpDirFor(dir);
  const own = rp && join(rp, "names.md");
  if (own && existsSync(own)) return parseNames(readText(own));
  return root ? parseNames(readText(join(root, "templates", "reelplanning", "names.md"))) : [];
}

// A caption word's core: the word without the punctuation around it or a possessive ("reelplanning's," → reelplanning).
const split = (text) => {
  const m = /^([^\p{L}\p{N}]*)(.*?)((?:['’]s)?[^\p{L}\p{N}]*)$/u.exec(String(text));
  return m ? { pre: m[1], core: m[2], post: m[3] } : { pre: "", core: String(text), post: "" };
};
// a word that is itself a path, a flag, a file or code (bin/reelplanning.mjs, --you, .reelplanning, `x`) is left as it is
const CODEY = /[\/\\@=$`<>{}]|^[-.]|\.[a-z]{1,5}$/i;

/** The row a run of words starting at k spells (the longest form; an exact spelling before a case-blind one) → { row, n } or null. */
function rowAt(cores, k, names) {
  let best = null;
  for (const exact of [true, false]) {
    for (const row of names) for (const f of row.forms) {
      if (f.length > cores.length - k) continue;
      const ok = f.every((w, j) => exact ? cores[k + j] === w : cores[k + j].toLowerCase() === w.toLowerCase());
      if (ok && (!best || f.length > best.n)) best = { row, n: f.length };
    }
    if (best) return best;
  }
  return null;
}

/**
 * Caption words ({ text, start, end }) shown by the list: each listed name in the Shown spelling, a code
 * name (and its command run) marked `code` (the part of the text shown as code) and, in a run of more
 * than one word, `run` (start, mid, end). A multi-word name is shown word by word, so the timings stay
 * the words'. A flag, a path or a file name is code as it is written. Returns new word objects; the rest
 * pass through untouched.
 */
export function showNames(words, names = []) {
  const out = words.map((w) => ({ ...w })), code = out.map((w) => codeWord(w.text));
  const parts = out.map((w, i) => code[i] || split(w.text));
  const cores = parts.map((p, i) => (code[i] || CODEY.test(p.core) ? "\u0000" : p.core));
  const codeAt = code.map((c) => (c ? c.core : null));   // the core shown as code, per word
  for (let k = 0; k < out.length; k++) {
    const hit = rowAt(cores, k, names); if (!hit) continue;
    const { row, n } = hit, shown = row.shown.split(/\s+/);
    for (let j = 0; j < n; j++) {
      const i = k + j, s = shown.length === n ? shown[j] : j === 0 ? row.shown : "";
      out[i].text = parts[i].pre + s + parts[i].post; parts[i].core = s;
      if (row.code) codeAt[i] = s;
    }
    // a command carries its code run on over its next words ("reel status"), or another code name ("npx reelplanning")
    let e = k + n;
    if (row.code) for (let cur = row; cur && e < out.length && !/[.,;:!?)\u2014]$/.test(parts[e - 1].post) && !parts[e].pre;) {
      const next = cur.then.filter((t) => t.length <= out.length - e && t.every((w, j) => cores[e + j].toLowerCase() === w.toLowerCase())).sort((a, b) => b.length - a.length)[0];
      if (next) { for (let j = 0; j < next.length; j++) { const p = parts[e + j]; p.core = p.core.toLowerCase(); codeAt[e + j] = p.core; out[e + j].text = p.pre + p.core + p.post; } e += next.length; continue; }
      const also = rowAt(cores, e, names);
      if (!also?.row.code) break;
      const sh = also.row.shown.split(/\s+/);
      for (let j = 0; j < also.n; j++) { const p = parts[e + j], x = sh.length === also.n ? sh[j] : j === 0 ? also.row.shown : ""; p.core = x; codeAt[e + j] = x; out[e + j].text = p.pre + x + p.post; }
      e += also.n; cur = also.row;
    }
    k = e - 1;
  }
  // the script's own code markup over several words (`reel fold`, `npx skills add`): every word of it is code,
  // one run, though names.md lists only its first word or none of it (else "fold`" showed its backtick)
  const ticks = (s) => (String(s).match(/`/g) || []).length;
  for (let i = 0; i < out.length; i++) {
    if (ticks(words[i].text) % 2 === 0) continue;
    let j = i + 1; while (j < out.length && ticks(words[j].text) % 2 === 0) j++;
    if (j >= out.length) break;
    for (let x = i; x <= j; x++) { const core = parts[x].core.replace(/`/g, ""); if (core && !codeAt[x]) { codeAt[x] = core; parts[x].core = core; } }
    i = j;
  }
  // …and over one word (`jq`, `todo`.): code too, though names.md does not list it (else it showed both backticks)
  for (let i = 0; i < out.length; i++) if (!codeAt[i] && parts[i].core && /`$/.test(parts[i].pre) && /^`/.test(parts[i].post)) codeAt[i] = parts[i].core;
  for (let i = 0; i < out.length; i++) {
    if (codeAt[i] == null || !codeAt[i]) continue;
    out[i].code = codeAt[i];
    const prev = i > 0 && codeAt[i - 1] && !parts[i - 1].post && !parts[i].pre, next = i + 1 < out.length && codeAt[i + 1] && !parts[i].post && !parts[i + 1].pre;
    if (prev || next) out[i].run = prev && next ? "mid" : prev ? "end" : "start";
  }
  return out;
}

/**
 * On-screen text held to the list: [{ text, code, artifact }] (code: inside code markup or a mono face;
 * artifact: a real thing's own words, which keep theirs) → [{ text, found, want, why }]. A code name
 * outside code markup is a warning, and so is a listed name spelled another way outside code ("ReelPlanning",
 * "Github"). A word inside a path or a command line (bin/reelplanning.mjs) is part of it and passes.
 */
export function namesOnScreen(units, names) {
  const out = [];
  for (const u of units) {
    if (u.artifact) continue;
    for (const row of names) for (const f of row.forms) {
      const re = new RegExp(`(?<![\\p{L}\\p{N}_./\\\\@\`-])${f.map(esc).join("\\s+")}(?![\\p{L}\\p{N}_/\\\\@\`-]|\\.[a-z])`, "giu");
      for (const m of String(u.text).matchAll(re)) {
        const said = m[0], owner = rowAt(said.split(/\s+/), 0, names);
        if (owner?.row !== row) continue;   // "HyperFrames" is the plain name's row, not `hyperframes`'s
        if (row.code && !u.code) out.push({ text: u.text, found: said, want: `\`${row.shown}\``, why: "a tool's name, shown in code markup" });
        else if (!row.code && !u.code && said !== row.shown) out.push({ text: u.text, found: said, want: row.shown, why: "spelled as the names list shows it" });
      }
    }
  }
  const seen = new Set();
  return out.filter((x) => { const k = `${x.text}\u0000${x.found}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

// ── the caption layer: a code word renders as <code class="cap-code"> inside its .caption-word ──────────
export const CAPTION_CODE_JS = `/* rp-caption-code: a caption word's code part (names.md) in code markup, inside its .caption-word span, so the karaoke className sets on the word leave it alone */
function __rpShowWord(span, w, tail) {
  var t = String(w.text), c = w.code ? String(w.code) : "", i = c ? t.indexOf(c) : -1;
  if (i < 0) { span.textContent = t + (tail || ""); return; }
  // the script's backticks mark the code; the chip shows it, so they are never shown as letters beside it
  var before = t.slice(0, i).replace(/\x60/g, ""), after = t.slice(i + c.length).replace(/\x60/g, "");
  if (before) span.appendChild(document.createTextNode(before));
  var code = document.createElement("code"); code.className = "cap-code"; if (w.run) code.setAttribute("data-run", w.run); code.textContent = c; span.appendChild(code);
  if (after || tail) span.appendChild(document.createTextNode(after + (tail || "")));
}
`;
export const CAPTION_CODE_CSS = `<style data-rp-caption-code>
  /* names.md: a tool's name in the captions, in the frames' code voice (JetBrains Mono), on a solid chip
     the caption's own text colour fills: the chip is the words' colour and its letters the caption's
     ground, so it reads at full contrast on either skin and in either theme, at the words' own size and
     weight. The fill follows the word's karaoke state (still to come a little softer, said full); no
     coral (coral is only "yours, waiting on you", D-142). The old chip (--rp-tile-2 at 0.8em, the word's
     colour on it) was white on cream on the dark pill: too pale to read. */
  @font-face { font-family: 'JetBrains Mono'; src: url('assets/fonts/JetBrainsMono-400.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: block; }
  @font-face { font-family: 'JetBrains Mono'; src: url('assets/fonts/JetBrainsMono-700.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: block; }
  .caption-word .cap-code {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-weight: inherit;
    font-size: 1em;
    letter-spacing: 0;
    font-variant-ligatures: none;
    color: inherit;
    /* the default layer: white words on a dark pill, so a light chip with dark letters. The word's colour
       is laid over an opaque light grey, so the chip is solid in either karaoke state (the words still to
       come are white at 55%) and the chips of one command meet without a seam where they overlap */
    background: linear-gradient(currentColor, currentColor) #b8b7b3;
    -webkit-text-fill-color: #181715;
    padding: 0.02em 0.22em 0.06em;
    border-radius: 0.18em;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
  /* the preset skin's card: ink words on the canvas (cream in light, dark in dark), so an ink chip with
     canvas letters, pulled towards full ink so a word still to come is not a pale grey */
  .caption-pill .caption-word .cap-code {
    background: color-mix(in srgb, currentColor, var(--cap-ink, var(--rp-ink)) 60%);
    -webkit-text-fill-color: var(--cap-canvas, var(--rp-paper));
  }
  /* a command of several words reads as one chip: each chip but the last reaches over the gap between
     the caption's words (0.3em of the line and the words' own padding, 0.34em, or a space) and a little more, so no
     hairline shows at the join, and the inner corners are square */
  .caption-word .cap-code[data-run="start"], .caption-word .cap-code[data-run="mid"] { border-top-right-radius: 0; border-bottom-right-radius: 0; margin-right: -0.38em; }
  .caption-word .cap-code[data-run="end"], .caption-word .cap-code[data-run="mid"] { border-top-left-radius: 0; border-bottom-left-radius: 0; }
</style>`;

/**
 * The caption layer (compositions/captions.html) made to show code words: the word builder calls
 * __rpShowWord instead of setting textContent, and the chip's style is added. Idempotent. Knows the two
 * layers the captions builder writes (the preset skin's and its default) → { html, patched } or
 * { html, error } when the builder is a shape it does not know.
 */
/**
 * The faces CAPTION_CODE_CSS loads, put in a project that lacks them: a new project has no assets/fonts/, and the
 * caption layer's @font-face would 404 there (`hyperframes check` fails on it). Copied from the player's own
 * JetBrains Mono (a variable face, so one file serves both weights), with its licence. Returns the files written.
 */
export function ensureCaptionCodeFonts(dir, root) {
  const src = join(root, "packages", "player", "fonts"), fonts = join(dir, "assets", "fonts"), wrote = [];
  if (!existsSync(join(src, "jetbrains-mono-latin-wght-normal.woff2"))) return wrote;
  for (const [from, to] of [["jetbrains-mono-latin-wght-normal.woff2", "JetBrainsMono-400.woff2"], ["jetbrains-mono-latin-wght-normal.woff2", "JetBrainsMono-700.woff2"], ["OFL-jetbrains-mono.txt", "OFL-jetbrains-mono.txt"]]) {
    if (existsSync(join(fonts, to)) || !existsSync(join(src, from))) continue;
    mkdirSync(fonts, { recursive: true }); copyFileSync(join(src, from), join(fonts, to)); wrote.push(`assets/fonts/${to}`);
  }
  return wrote;
}

export function withCaptionCode(html) {
  let s = String(html);
  s = s.replace(/\n?<style data-rp-caption-code>[\s\S]*?<\/style>/, "");
  if (!s.includes("function __rpShowWord(")) {
    let n = 0;
    s = s.replace(/(\b\w+)\.textContent = String\(w\.text\);/g, (m, v) => { n++; return `__rpShowWord(${v}, w);`; })
      .replace(/(\b\w+)\.textContent = w\.text \+ " ";/g, (m, v) => { n++; return `__rpShowWord(${v}, w, " ");`; });
    if (!n) return { html, error: "the caption word builder is not a shape this knows (no `….textContent = String(w.text)`)" };
    s = s.replace(/(\n[ \t]*)(var GROUPS = )/, (m, ind, v) => `${ind}${CAPTION_CODE_JS.trim().split("\n").join(ind)}${ind}${v}`);
  }
  s = /<\/template>\s*$/.test(s) ? s.replace(/<\/template>(\s*)$/, `${CAPTION_CODE_CSS}\n</template>$1`) : `${s.replace(/\s*$/, "")}\n${CAPTION_CODE_CSS}\n`;
  return { html: s, patched: true };
}
