// Commands, flags, paths and file names: written in SCRIPT.md as they are written, said by the voice as spoken.
//
// A script says `claude -p`, `--dry-run`, `plan.md`, `/work`, `~/.reelplanner/you.jsonl`. Kokoro drops a
// flag's dashes ("claude p"), reads `plan.md` as "plan MD" and `~/` as "tilde slash", so the voice is handed
// the spoken form (`say`, run by narrate on each line's text before the TTS and the line's key). The
// captions show the script's own words, and a word that is a flag, a path or a file name is code
// (`codeWord`, the caption chip). A line with nothing written that way is handed over unchanged, so a
// script written in spoken words keeps its key and its audio.
//
// Scripts from before this said the spoken form themselves ("claude dash p", "names dot md"). Their
// captions show the written form (`unspell`: a spoken run becomes one word spanning its words' times),
// and check-terms warns on such a run in a script (write it as it is written; the voice says it).
//
//   written                         said (say)                                   shown again (unspell)
//   -p, --dry-run                   dash p, dash dash dry-run                    "dash p" → -p, "dash dash you" → --you
//   plan.md, you.jsonl              plan dot md, you dot json L                  "dot md", "dot M D", "dot json L" → .md, .jsonl
//   /work, scripts/narrate.mjs      slash work, scripts slash narrate dot mjs    "slash work" → /work
//   ~/.reelplanner                  home dot reelplanner                         "tilde slash" → ~/
//   snake_case                      snake underscore case                        "underscore" → _
//   noreply@anthropic.com           noreply at anthropic dot com                 (the domain only: anthropic.com)
//   D-110                           D-110 (Kokoro says "D one hundred ten", as the ledger reads it)
//
// An extension is said the way Kokoro says it well (EXT_SAID): most as they are ("dot md" is "dot em dee",
// "dot mjs", "dot html"); jsonl as "json L" (Kokoro says "jsonl" as one mumbled word), yml as "yaml".

/** The file extensions a word must end in to be a file name (and a domain's endings). */
export const EXT = new Set(("md mdx mjs cjs js jsx ts tsx json jsonl html htm css sh bash zsh py rb go rs java yml yaml toml ini txt log env lock "
  + "wav mp3 mp4 webm png jpg jpeg svg gif webp pdf csv tsv zip gz tar diff patch gitignore com org io dev ai net app").split(" "));
/** How an extension is said, where Kokoro would say it badly as written. */
export const EXT_SAID = { jsonl: "json L", yml: "yaml", io: "I O", gitignore: "git ignore", htm: "H T M" };
const SEP_SAID = { "/": "slash", ".": "dot", "_": "underscore", "@": "at" };
const SEP_SHOWN = { slash: "/", dot: ".", underscore: "_" };

// the punctuation around a word that is the sentence's, not the word's (a path's trailing / is its own)
const PRE = /^[("'“‘\[`]*/, POST = /[.,;:!?)"'”’\]`]*$/;
const around = (text) => {
  const t = String(text), pre = t.match(PRE)[0], rest = t.slice(pre.length), post = rest.match(POST)[0];
  return { pre, core: rest.slice(0, rest.length - post.length), post };
};

const FLAG = /^(--?)([A-Za-z][\w-]*)(?:=(\S+))?$/;
const EMAIL = /^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/;
const extOf = (core) => { const m = /\.([A-Za-z0-9]+)$/.exec(core); return m ? m[1].toLowerCase() : null; };
const isFile = (core) => /^\.?[\w-]+(?:\.[\w-]+)*\.[A-Za-z0-9]+$/.test(core) && /[A-Za-z]/.test(core.replace(/\.[^.]+$/, "")) && EXT.has(extOf(core));
const isDotfile = (core) => /^\.[A-Za-z][\w-]*(?:\.[\w-]+)*$/.test(core);
function isPath(core) {
  if (!/[A-Za-z]/.test(core) || /\s/.test(core)) return false;
  if (/^https?:\/\/\S+$/.test(core)) return true;
  if (/^(?:~\/|\.{1,2}\/|\/)[\w.~-]/.test(core) || core === "~" || core === "~/") return true;
  if (!core.includes("/")) return false;
  // a slash between two plain words ("and/or", "A/B") is not a path: it takes a folder's slash at the end,
  // a file at the end, or a dotted folder in it
  const segs = core.split("/");
  return core.endsWith("/") || isFile(segs[segs.length - 1]) || segs.some((s) => isDotfile(s));
}
/** What kind of code a word is: "flag", "path", "file", "email", or null (a plain word). */
export function codeKind(core) {
  if (FLAG.test(core)) return "flag";
  if (EMAIL.test(core)) return "email";
  if (isPath(core)) return "path";
  if (isFile(core) || isDotfile(core)) return "file";
  return null;
}
/** A caption word that is a flag, a path or a file name → { pre, core, post } (the core is the code), else null. */
export function codeWord(text) {
  const a = around(text);
  return a.core && codeKind(a.core) ? a : null;
}

// a path, file or address said part by part: "~/.reelplanner/you.jsonl" → "home dot reelplanner slash you dot json L"
function sayPath(core) {
  let s = core.replace(/^https?:\/\//, "");
  const out = [];
  if (s === "~" || s.startsWith("~/")) { out.push("home"); s = s.slice(2); }
  s = s.replace(/\/+$/, "");
  const pieces = s.split(/([/._@])/).filter((p) => p !== "");
  pieces.forEach((p, i) => {
    if (SEP_SAID[p]) out.push(SEP_SAID[p]);
    else if (i === pieces.length - 1 && pieces[i - 1] === "." && EXT.has(p.toLowerCase())) out.push(EXT_SAID[p.toLowerCase()] || p);
    else out.push(p);
  });
  return out.join(" ");
}
/** One written word → its spoken form (the same word when it is not a flag, a path or a file name). */
export function sayWord(word) {
  const { pre, core, post } = around(word);
  const kind = core && codeKind(core);
  if (!kind) return word;
  const bare = (s) => s.replace(/`/g, "");
  if (kind === "flag") {
    const [, dashes, name, value] = FLAG.exec(core);
    return bare(pre) + [...Array(dashes.length).fill("dash"), name, ...(value ? ["equals", codeKind(value) ? sayPath(value) : value] : [])].join(" ") + bare(post);
  }
  return bare(pre) + sayPath(core) + bare(post);
}
/** A script line → the text the voice is handed. Only flags, paths and file names change; a line with none is returned as it is. */
export const say = (text) => String(text).replace(/\S+/g, (w) => sayWord(w));
/** A written word → the words the voice says for it (what the captions align to the transcription). */
export const saidWords = (word) => sayWord(word).split(/\s+/).filter(Boolean);

// ── spoken → shown: the captions of a script that says the spoken form itself ─────────────────────────
const lw = (ws, i) => (i < ws.length ? around(ws[i].text).core.toLowerCase() : null);
const bareTok = (ws, i) => { if (i >= ws.length) return false; const a = around(ws[i].text); return !a.pre && !a.post; };
const segAt = (ws, i) => { if (i >= ws.length) return null; const a = around(ws[i].text); return !a.pre && /^[A-Za-z0-9][\w-]*$/.test(a.core) ? a : null; };
// an extension said at i: a word ("md", "jsonl"), spelled letters ("M D", "m j s"), or a word and letters ("json L")
function extAt(ws, i) {
  const toks = [];
  for (let k = i; k < ws.length; k++) {
    const a = segAt(ws, k); if (!a) break;
    if (k > i && a.core.length !== 1) break;       // after the first, only single letters join
    toks.push(a);
    if (a.post) break;
  }
  for (let n = toks.length; n >= 1; n--) {
    const ext = toks.slice(0, n).map((t) => t.core).join("").toLowerCase();
    if (EXT.has(ext) && (n === 1 || toks.slice(0, n).every((t, j) => j === 0 || t.core.length === 1)) && toks.slice(0, n - 1).every((t) => !t.post)) return { ext, post: toks[n - 1].post, end: i + n };
  }
  return null;
}
// the English words a spoken "slash" or "dash" may stand in front of ("a slash of red", "in a dash, a moment later")
const ENGLISH = new Set("a an and the of to in on or is it at as by for with from that this i".split(" "));
function flagAt(ws, i) {
  if (lw(ws, i) !== "dash" || !bareTok(ws, i)) return null;
  if (lw(ws, i + 1) === "dash" && bareTok(ws, i + 1)) {
    const a = segAt(ws, i + 2); if (!a || !/^[A-Za-z]/.test(a.core)) return null;
    return { text: `--${a.core}${a.post}`, end: i + 3 };
  }
  const a = segAt(ws, i + 1);
  return a && /^[A-Za-z]$/.test(a.core) && !ENGLISH.has(a.core.toLowerCase()) ? { text: `-${a.core}${a.post}`, end: i + 2 } : null;
}
// a folder or file name at i, after a lead or a slash: a word, or "dot" and a word (a dotfile: "dot reelplanner")
const partAt = (ws, i, dotOk) => {
  if (dotOk && lw(ws, i) === "dot" && bareTok(ws, i)) { const a = segAt(ws, i + 1); return a ? { core: `.${a.core}`, post: a.post, pre: "", end: i + 2 } : null; }
  const a = segAt(ws, i); return a ? { ...a, end: i + 1 } : null;
};
function pathAt(ws, i) {
  let j = i, lead = "";
  if (lw(ws, j) === "tilde" && bareTok(ws, j) && lw(ws, j + 1) === "slash" && bareTok(ws, j + 1)) { lead = "~/"; j += 2; }
  else if (lw(ws, j) === "slash" && bareTok(ws, j)) { lead = "/"; j += 1; }
  const first = partAt(ws, j, !!lead); if (!first || (lead && ENGLISH.has(first.core.toLowerCase()))) return null;
  const pre = lead ? "" : first.pre;
  const parts = [lead, first.core];
  let post = first.post, dotted = false, slashes = lead ? 1 : 0, under = false;
  j = first.end;
  // The longest run that is a path: one with an extension at its end, a lead slash ("slash work"), two
  // slashes, or an underscore. One slash between two words is not enough ("open slash work" is open /work).
  // A dot carries on only to an extension further on ("plan dot resolved dot M D").
  const path = () => lead || slashes >= 2 || under;
  let best = path() ? { n: parts.length, j, post } : null;
  while (!post) {
    const sep = SEP_SHOWN[lw(ws, j)];
    if (!sep || !bareTok(ws, j)) break;
    if (sep === ".") {
      const e = extAt(ws, j + 1);
      if (e) { parts.push(".", e.ext); post = e.post; j = e.end; best = { n: parts.length, j, post }; break; }
    }
    const seg = partAt(ws, j + 1, sep === "/"); if (!seg) break;
    parts.push(sep, seg.core); post = seg.post; j = seg.end;
    if (sep === ".") dotted = true;
    else { if (sep === "/") slashes++; else under = true; if (!dotted && path()) best = { n: parts.length, j, post }; }
  }
  return best && best.j - i > 1 ? { text: pre + parts.slice(0, best.n).join("") + best.post, end: best.j } : null;
}
/**
 * Caption words ({ text, start, end }) of a script that says a flag, a path or a file name aloud → the same
 * words with each spoken run shown written ("claude dash p" → claude -p, "names dot md:" → names.md:), one
 * word spanning the run's times, carrying `said` (the words it was) and `n` (how many words were said). Every
 * other word passes through untouched.
 */
export function unspell(words) {
  const out = [];
  for (let i = 0; i < words.length;) {
    const m = flagAt(words, i) || pathAt(words, i);
    if (m && m.end - i > 1) {
      const run = words.slice(i, m.end);
      // said: the words it was ("claude dash p"); n: how many words were said (a word's own n, else 1)
      out.push({ ...words[i], text: m.text, start: run[0].start, end: run[run.length - 1].end, said: run.map((w) => w.text).join(" "), n: run.reduce((k, w) => k + (w.n ?? 1), 0) });
      i = m.end;
    } else out.push(words[i++]);
  }
  return out;
}
/** A script line's spelled-out forms → [{ said: "claude dash p", shown: "-p" }] (check-terms warns on each). */
export function spelledOut(text) {
  const ws = String(text).split(/\s+/).filter(Boolean).map((t) => ({ text: t, start: 0, end: 0 }));
  return unspell(ws).filter((w) => w.said).map((w) => ({ said: w.said.replace(POST, ""), shown: around(w.text).core }));
}
