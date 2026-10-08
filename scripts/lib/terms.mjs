// What a viewer needs to follow a video (plan: accessible videos), read from its storyboard and the
// project record. plan-map puts it in plan-map.json for the player; check-terms reads the same things
// to hold the script to them.
//
//   prerequisites  the videos to watch first: repeatable `before: <video>[#part N] | <what it gives you>`
//                  in the storyboard's front matter, where <video> is `system`, a plan's folder name, or
//                  `<plan>--walkthrough` (the names the review page uses). With none, a video that is not
//                  the system video has the system video before it; `before: none` opts out.
//   terms          the words this video defines itself: `terms: a, b, c`. A beat that defines one says so
//                  with `- defines: <term>`.
//   glossary       term → meaning, from the nearest .reelplanning/glossary.md (the lookup frame-lint uses);
//                  each row's `display`, the plain word a viewer sees and hears where it differs from the
//                  files' name (D-127: "choice" for a call), and `definedIn`, the beat that explains it
//                  (the system video's, from the repo's terms index)
//   terms index    every video's `- defines:` lines, repo-wide: word → the videos and beats that explain it
//                  (definesIndex; finish-project writes it to .reelplanning/terms-index.json)
//   ids            every id the script says (D-056, A12, D1, k3, q2) → what it is, in a few words, from
//                  decisions.json, the plan's walkthrough.md (or a prerequisite's), or this storyboard
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { parseCalls } from "./autonomy.mjs";

export const DEFAULT_BEFORE = { video: "system", gives: "what the parts are and how a review goes" };
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const readText = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const unquote = (s) => String(s ?? "").trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").trim();

export const frontMatter = (sb) => (String(sb).match(/^---\n([\s\S]*?)\n---/) || ["", ""])[1];
export const fmValue = (fm, k) => { const m = String(fm).match(new RegExp(`^${k}:\\s*(.+?)\\s*$`, "m")); return m ? unquote(m[1]) : null; };
export const listOf = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
/**
 * A storyboard's `terms:` (every such line): the words the video defines itself, each with the meaning a viewer
 * opens on hover when the line gives one (D-216). `terms: branch = a line of work kept apart until it is merged;
 * merge = …` (entries with a meaning between semicolons); the older bare form, `terms: a, b, c`, still reads, and
 * the two mix ("pull request, CI = the checks that run on every pull request"). → [{ term, meaning? }]
 */
export function termsOf(fm) {
  const out = [];
  for (const m of String(fm).matchAll(/^terms:\s*(.+?)\s*$/gm)) for (const piece of unquote(m[1]).split(";")) {
    const i = piece.indexOf("=");
    const names = listOf(i < 0 ? piece : piece.slice(0, i)), meaning = i < 0 ? "" : piece.slice(i + 1).trim();
    names.forEach((t, j) => { if (!out.some((x) => x.term.toLowerCase() === t.toLowerCase())) out.push({ term: t, ...(meaning && j === names.length - 1 ? { meaning } : {}) }); });
  }
  return out;
}
/** A storyboard's `terms:` words alone. */
export const termNames = (fm) => termsOf(fm).map((t) => t.term);
/** A storyboard's `plain:` words: ones the build would take for jargon that this video uses plainly (D-216). */
export const plainOf = (fm) => [...String(fm).matchAll(/^plain:\s*(.+?)\s*$/gm)].flatMap((m) => listOf(unquote(m[1]))).map((x) => x.toLowerCase());
const clip = (s, n = 80) => { s = String(s || "").replace(/\s+/g, " ").trim(); if (s.length <= n) return s; const cut = s.slice(0, n - 1); return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), n - 20)).replace(/[,;:.\s]+$/, "")}…`; };

/** The storyboard's frames: index, title, meta (every `- key: value` line), in order. */
export function storyboardFrames(sb) {
  return String(sb).split(/\n(?=## Frame )/).slice(1).map((b) => {
    const head = b.match(/^## Frame (\d+) — (.+)$/m) || [];
    const meta = {}; for (const m of b.matchAll(/^- ([a-z_]+):\s*(.*)$/gm)) meta[m[1]] = m[2].trim();
    return { index: Number(head[1]), title: (head[2] || "").trim(), meta };
  }).filter((f) => Number.isFinite(f.index));
}

/** `before:` lines → [{ video, part, gives }]; the default (the system video) when there are none. */
export function parseBefore(fm, kind = null) {
  const lines = [...String(fm).matchAll(/^before:\s*(.+?)\s*$/gm)].map((m) => unquote(m[1]));
  if (lines.some((l) => /^none$/i.test(l))) return [];
  if (!lines.length) return kind === "system" ? [] : [{ ...DEFAULT_BEFORE, part: null, default: true }];
  return lines.map((l) => {
    const i = l.indexOf("|"), ref = (i < 0 ? l : l.slice(0, i)).trim(), gives = i < 0 ? "" : l.slice(i + 1).trim();
    const m = /^(.+?)\s*#\s*(?:part\s*|chapter\s*)?(\d+)$/i.exec(ref);
    return { video: (m ? m[1] : ref).trim(), part: m ? Number(m[2]) : null, gives };
  });
}

/** The .reelplanning folder a video belongs to: the one it sits in, or the nearest one above it. */
export function rpDirFor(dir) {
  let d = resolve(dir);
  for (let i = 0; i < 12 && d !== dirname(d); i++, d = dirname(d)) {
    if (basename(d) === ".reelplanning") return d;
    if (existsSync(join(d, ".reelplanning", "glossary.md")) || existsSync(join(d, ".reelplanning", "decisions.json"))) return join(d, ".reelplanning");
  }
  return null;
}
/** A video's folder from its review-page name: system, <plan>, <plan>--walkthrough, <explainer>--explainer. */
export function videoDirFor(rp, video) {
  if (!rp) return null;
  if (video === "system") return join(rp, "system-video");
  const e = /^(.+)--explainer$/.exec(video);
  if (e) return join(rp, "explainers", e[1], "video");
  const w = /^(.+)--walkthrough$/.exec(video);
  return w ? join(rp, "plans", w[1], "walkthrough-video") : join(rp, "plans", video, "video");
}
/** The review page's name for a video folder (bundle-player's slugFor, without its -2 for a clash). */
export function slugOf(dir) {
  const p = resolve(dir).split(sep).join("/").replace(/\/+$/, "");
  const e = p.match(/\.reelplanning\/explainers\/([^/]+)\/video$/);
  if (e) return `${e[1]}--explainer`;
  const m = p.match(/\.reelplanning\/(?:plans\/([^/]+)\/(video|walkthrough-video)|(system-video))$/);
  return m?.[3] ? "system" : m ? (m[2] === "video" ? m[1] : `${m[1]}--walkthrough`) : basename(p);
}

/** Each prerequisite with what the review page shows for it: its title, its length, the words it defines. */
export function resolvePrereqs(dir, list) {
  const rp = rpDirFor(dir), out = [], missing = [];
  // the system video comes first by default only for a video of the project record itself (a plan's, a
  // walkthrough's); a video kept elsewhere in the repo (an example, an eval) names what it needs, if anything
  const inRecord = resolve(dir).split(sep).includes(".reelplanning");
  for (const b of list) {
    if (b.default && !inRecord) continue;
    const vdir = videoDirFor(rp, b.video), map = vdir ? readJson(join(vdir, "plan-map.json")) : null;
    const sbText = vdir ? readText(join(vdir, "STORYBOARD.md")) : "";
    if (!map && !sbText) { if (!b.default) missing.push(b.video); if (b.default) continue; }
    const ch = b.part && map?.chapters ? map.chapters[b.part - 1] : null;
    const title = map?.title || fmValue(frontMatter(sbText), "title") || (b.video === "system" ? "The system video" : b.video);
    const terms = termNames(frontMatter(sbText)).length ? termNames(frontMatter(sbText)) : (map?.terms || []);
    out.push({ video: b.video, ...(b.part ? { part: b.part, partTitle: ch?.title || null } : {}), title, gives: b.gives || "",
      seconds: ch ? +(ch.watchedSeconds ?? ch.linearSeconds ?? 0).toFixed(1) : map ? +(map.watchedSeconds ?? map.totalSeconds ?? 0).toFixed(1) : null,
      terms, found: !!(map || sbText), ...(b.default ? { default: true } : {}) });
  }
  return { prerequisites: out, missing };
}

/** The ways a glossary term is said: "The review player" → ["review player"]; "Approve / Request changes" → both. */
export function termForms(term) {
  // an acronym of two capitals is a form too (PR, CI); any other form is three letters or more
  return String(term).replace(/`/g, "").replace(/\([^)]*\)/g, " ").split(/\s+\/\s+/)
    .map((x) => x.trim().replace(/^(the|an?)\s+/i, "").replace(/\s+/g, " ")).filter((x) => x.length >= 3 || /^[A-Z]{2}$/.test(x)).map((x) => x.toLowerCase());
}
/** The nearest glossary.md above a video (frame-lint's lookup): [{ term, id, meaning, forms, display }]. */
export function glossaryFor(dir) {
  for (let d = resolve(dir), i = 0; i < 12 && d !== dirname(d); i++, d = dirname(d)) {
    const g = basename(d) === ".reelplanning" ? join(d, "glossary.md") : join(d, ".reelplanning", "glossary.md");
    if (!existsSync(g)) continue;
    return parseGlossary(readFileSync(g, "utf8"));
  }
  return [];
}
/** Code in a meaning: a `span`, or, in a meaning whose backticks were taken out, a file, folder, element,
 *  attribute, heading or command written bare. The review player has the same test (CODEISH), for older maps. */
export const CODEISH = /`[^`]+`|(?:^|[\s("'])(?:~?[\w.<>*-]*[\w>*]\/[\w.<>\/*-]*|[\w<>*-]+\.(?:md|json|jsonl|mjs|js|sh|html|css|png|txt)\b|<[a-z][\w-]*>|data-[\w-]+=|#{2,}\s|--[a-z][\w-]*|reel(?:planning)? (?:review|build|record|status|memory|retro|setup)\b)/i;
/**
 * A glossary meaning, split for the viewer (the Terms panel, a word's card): `said`, the meaning in plain
 * words, and `files`, where the files and the code say it. A parenthesis that holds code goes to `files`
 * ("(`### Step N` in `plan.md`)"), and so does a name in code the meaning starts with ("`decisions.md`: every
 * answer…"); a first sentence that only says the row's word again ("The answer bar.") goes. Nothing else is
 * dropped: the player shows the first plain sentence or two and keeps the rest behind "more". `names` are the
 * row's words (its term and on-screen word). → { said, files: [] }, both Markdown. The review player splits an
 * older plan map's meaning (its backticks taken out) the same way: keep the two alike.
 */
export function splitMeaning(md, names = []) {
  const files = [], bare = (x) => String(x || "").toLowerCase().replace(/[`*_.:;!?]/g, "").replace(/^(the|an?)\s+/, "").trim();
  let t = String(md || "").replace(/\s+/g, " ").trim();
  t = t.replace(/\s*\(([^()]*)\)/g, (all, inner) => (CODEISH.test(inner) ? (files.push(inner.trim()), "") : all));
  const pre = /^(`[^`]+`|<[a-z][\w-]*>|reel(?:planning)? [a-z-]+|[^\s:;,]+)\s*[:;,]\s+/i.exec(t);
  if (pre && CODEISH.test(pre[1])) { files.unshift(pre[1]); t = t.slice(pre[0].length); }
  t = t.replace(/\s+([,;:.])(?=\s|$)/g, "$1").trim();
  if (t && !/[.!?]$/.test(t)) t += ".";
  if (!/^\S*[-/.<`]/.test(t)) t = t.charAt(0).toUpperCase() + t.slice(1);   // "check-details, run by…" and code keep their case
  const first = /^(.+?[.!?])\s+(?=[A-Z*"“`(<~])/.exec(t);
  if (first && names.some((n) => n && bare(first[1]) === bare(n))) t = t.slice(first[0].length);
  return { said: t, files };
}
/**
 * A glossary table's rows. The columns are Term, id, Meaning, then any; a column headed "On screen" gives
 * the plain word the viewer sees and hears where it differs from the term (D-127: plain words on screen,
 * the files keep theirs). A row under a heading "Other words" is a meaning only (`other: true`, D-216): a
 * general word of the trade (repo, merge, pull request) the player labels, which the system video does not
 * have to explain. → [{ term, id?, meaning, forms, display?, said?, files?, other? }]: `forms` are the ways
 * the row is said, the term's first (forms[0] is its key), then the on-screen word's; `display` only where one
 * is given; `meaning` without its backticks; `said` and `files`, the meaning split for the viewer (splitMeaning).
 */
export function parseGlossary(md) {
  const rows = [];
  let onScreen = -1, other = false;
  for (const line of String(md).split("\n")) {
    const h = /^#{1,6}\s+(.+?)\s*$/.exec(line); if (h) { other = /^other words\b/i.test(h[1]); continue; }
    if (!/^\|/.test(line) || /^\|\s*-/.test(line)) continue;
    const c = line.split("|").slice(1, -1).map((s) => s.trim());
    if (/^term$/i.test(c[0] || "")) { onScreen = c.findIndex((h) => /^on screen\b/i.test(h)); continue; }
    if (c.length < 3) continue;
    const id = (c[1].match(/^`([^`]+)`$/) || [])[1] || null;
    const forms = termForms(c[0]); if (!forms.length || !c[2]) continue;
    const display = onScreen >= 0 ? String(c[onScreen] || "").replace(/`/g, "").trim() : "";
    const said = display ? termForms(display).filter((f) => !forms.includes(f)) : [];
    // `said` and `files` (splitMeaning): the meaning in the viewer's words, Markdown kept, and where the files say it
    const v = splitMeaning(c[2], [c[0], display]);
    rows.push({ term: c[0].replace(/`/g, ""), ...(id ? { id } : {}), meaning: c[2].replace(/`/g, ""), forms: [...forms, ...said], ...(display ? { display } : {}), ...(v.said ? { said: v.said } : {}), ...(v.files.length ? { files: v.files } : {}), ...(other ? { other: true } : {}) });
  }
  return rows;
}
/** The glossary row a defined word names (`- defines: tag`, or its on-screen word, "label"), else null: the
 *  row whose term is that word first (the guide, though "Guide" is another row's word on screen), then the row
 *  with that exact form, else the row whose longest form the word says ("grouped beats" → grouped beat, never
 *  beat). */
export const rowFor = (glossary, word) => {
  const w = String(word || "").trim().toLowerCase().replace(/^(the|an?)\s+/, ""); if (!w) return null;
  const exact = glossary.find((g) => g.forms[0] === w) || glossary.find((g) => g.forms.includes(w)); if (exact) return exact;
  let best = null, len = 0;
  for (const g of glossary) for (const f of g.forms) if (f.length > len && saysWord(w, f)) { best = g; len = f.length; }
  return best;
};

// ── the terms index: which video explains each word ────────────────────────────────────────────────
/** The videos of a project record that can define words: the system video, then each plan's videos. */
export function recordVideos(rp) {
  if (!rp) return [];
  const out = [join(rp, "system-video")], plans = join(rp, "plans");
  if (existsSync(plans)) for (const p of readdirSync(plans).sort()) for (const v of ["video", "walkthrough-video"]) out.push(join(plans, p, v));
  return out.filter((d) => existsSync(join(d, "STORYBOARD.md")));
}
/** One video's defining beats: [{ word, frame, title, start, chapter, chapterTitle }], from its storyboard (and
 *  its plan map's starts, when built). `frames` overrides the plan map's (plan-map passes the one it is writing). */
export function definingBeats(dir, { sb = null, frames = null } = {}) {
  const text = sb ?? readText(join(dir, "STORYBOARD.md")), starts = Object.fromEntries((frames || readJson(join(dir, "plan-map.json"))?.frames || []).map((f) => [f.index, f.start]));
  const out = []; let chapter = 0, chapterTitle = null;
  for (const f of storyboardFrames(text).sort((a, b) => a.index - b.index)) {
    if (f.meta.chapter_start) { chapter++; chapterTitle = f.meta.chapter_start; }
    for (const word of listOf(f.meta.defines)) out.push({ word: word.toLowerCase(), frame: f.index, title: f.title, ...(starts[f.index] != null ? { start: starts[f.index] } : {}), ...(chapter ? { chapter, chapterTitle } : {}) });
  }
  return out;
}
/**
 * The repo-wide list of which video explains each word (step 1 of videos-you-can-follow): every video's
 * `- defines:` lines, keyed by the glossary row's key (forms[0]) when the word is a glossary word, else by
 * the word. The system video's beats come first. → { words: { key: [{ video, frame, title, start?, chapter?,
 * chapterTitle? }] }, undefined: [glossary keys no system-video beat defines] }. `current` ({ dir, sb, frames })
 * stands in for a video being built, whose plan map is not written yet.
 */
export function definesIndex(rp, { glossary = null, current = null } = {}) {
  glossary ||= rp && existsSync(join(rp, "glossary.md")) ? parseGlossary(readText(join(rp, "glossary.md"))) : [];
  const words = {}, cur = current && resolve(current.dir);
  const dirs = recordVideos(rp); if (cur && !dirs.includes(cur) && existsSync(join(cur, "STORYBOARD.md"))) dirs.push(cur);
  for (const d of dirs) {
    const video = slugOf(d), beats = d === cur ? definingBeats(d, { sb: current.sb, frames: current.frames }) : definingBeats(d);
    for (const b of beats) {
      const key = rowFor(glossary, b.word)?.forms[0] || b.word;
      const { word, ...where } = b;
      (words[key] ||= []).push({ video, ...where });
    }
  }
  for (const k of Object.keys(words)) words[k].sort((a, b) => (a.video === "system" ? 0 : 1) - (b.video === "system" ? 0 : 1) || a.video.localeCompare(b.video) || a.frame - b.frame);
  // a row under "Other words" is a meaning only: the system video need not explain it
  const undef = glossary.filter((g) => !g.other && !(words[g.forms[0]] || []).some((x) => x.video === "system")).map((g) => g.forms[0]);
  return { words, undefined: undef };
}
/**
 * What the other videos of a project record say a word means (D-216): each video's `terms: x = …` meanings, and
 * the words a beat of it defines (`- defines:`). A bare `terms: x` in a video counts as labelled when one of these
 * (or the glossary) has x; the plan map then gives the viewer that meaning. → Map(word → { video, meaning? })
 */
export function termsElsewhere(rp, dir = null) {
  const out = new Map(), me = dir ? resolve(dir) : null;
  for (const d of recordVideos(rp)) {
    if (me && resolve(d) === me) continue;
    const sb = readText(join(d, "STORYBOARD.md")), video = slugOf(d);
    for (const t of termsOf(frontMatter(sb))) { const k = t.term.toLowerCase(), e = out.get(k); if (t.meaning && !e?.meaning) out.set(k, { video, meaning: t.meaning }); else if (!e) out.set(k, { video }); }
    for (const b of definingBeats(d, { sb, frames: [] })) if (!out.has(b.word)) out.set(b.word, { video });
  }
  return out;
}
/** Words a newcomer trips on that the glossary may not carry: the repo's own list, then the package's. */
export function jargonFor(dir, root) {
  const rp = rpDirFor(dir), words = new Set();
  for (const f of [rp && join(rp, "jargon.txt"), join(root, "templates", "reelplanning", "jargon.txt")].filter(Boolean))
    for (const l of readText(f).split("\n")) { const w = l.replace(/#.*$/, "").trim().toLowerCase(); if (w) words.add(w); }
  return [...words];
}

/** A word said (or shown) in text, as a whole word, its plural too (of any word of a phrase: "parts of the system"). */
export const saysWord = (text, form) => new RegExp(`(^|[^\\w-])${form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "(?:s|es)?[\\s-]+")}(?:s|es)?(?![\\w-])`, "i").test(String(text || ""));

// ── ids ─────────────────────────────────────────────────────────────────────────────────────────────
export const ID_RE = /(?<![\w-])(D-\d{1,4}|[AD]\d{1,3}|[kKqQ]\d{1,2})(?![\w-])/g;
/** One spelling per id: D-056, A12, D1, k3, q2. */
export function normId(id) {
  const s = String(id).trim(), d = /^D-(\d+)$/i.exec(s);
  if (d) return `D-${d[1].padStart(3, "0")}`;
  return /^[kq]/i.test(s) ? s.toLowerCase() : s.toUpperCase();
}
export const idKind = (id) => /^D-/.test(id) ? "decision" : /^A/.test(id) ? "choice" : /^D/.test(id) ? "off-plan change" : /^k/.test(id) ? "quick check" : "question";

/**
 * ids{}: every id in `texts`, plus this video's own quick checks, questions and calls → { kind, gloss }.
 * `planDirs` are the plan folders whose walkthrough.md may name an A<n> or D<n> (this plan first).
 */
export function idGlosses({ texts = [], rp = null, planDirs = [], quizzes = [], decisions = [], calls = [] }) {
  const said = new Set();
  for (const t of texts) for (const m of String(t || "").matchAll(ID_RE)) said.add(normId(m[1]));
  for (const x of [...quizzes, ...decisions, ...calls]) if (x?.id && /^([kq]\d+|[ad]\d+)$/i.test(x.id)) said.add(normId(x.id));
  const ledger = rp ? (readJson(join(rp, "decisions.json"))?.decisions || []) : [];
  const rows = {};
  for (const d of planDirs) { const w = join(d, "walkthrough.md"); if (!existsSync(w)) continue; for (const r of parseCalls(readText(w))) if (!rows[r.key]) rows[r.key] = { ...r, plan: basename(d) }; }
  const out = {};
  for (const id of [...said].sort()) {
    const kind = idKind(id); let gloss = null, n = null;
    if (kind === "decision") { const e = ledger.find((x) => x.id === id); if (e) gloss = e.kind === "autonomy" ? clip(e.chosen) : clip(`${String(e.question || "").replace(/\s*\(the agent's own call.*$/, "")} ${e.chosen || ""}`); }
    else if (kind === "choice" || kind === "off-plan change") { const c = calls.find((x) => normId(x.id) === id), r = rows[id.toLowerCase()]; gloss = clip(c?.chose || r?.chose || "") || null; }
    else if (kind === "quick check") { const q = quizzes.find((x) => normId(x.id) === id); n = Number(id.slice(1)); gloss = q ? clip(q.question) : null; }
    else { const q = decisions.find((x) => normId(x.id) === id); n = Number(id.slice(1)); gloss = q ? clip(q.question) : null; }
    out[id] = { kind, ...(n != null ? { n } : {}), gloss };
  }
  return out;
}

/**
 * Everything plan-map adds for the viewer, written onto `out` (the plan map being built): slug,
 * prerequisites, terms, glossary, ids, termsCheck; each frame's terms (the glossary words and this
 * video's terms its voice line says) and defines; each quick check's walkMeThrough.
 */
export function addAccess(out, { dir, sb }) {
  const fm = frontMatter(sb), kind = fmValue(fm, "kind"), sbFrames = storyboardFrames(sb);
  const byIndex = Object.fromEntries(sbFrames.map((f) => [f.index, f]));
  const { prerequisites, missing } = resolvePrereqs(dir, parseBefore(fm, kind));
  const termList = termsOf(fm), terms = termList.map((t) => t.term), glossary = glossaryFor(dir);
  const forms = [...glossary.map((g) => ({ key: g.forms[0], forms: g.forms })), ...terms.map((t) => ({ key: t.toLowerCase(), forms: [t.toLowerCase()] }))];
  for (const f of out.frames || []) {
    const m = byIndex[f.index]?.meta || {};
    const defines = listOf(m.defines).map((x) => x.toLowerCase());
    const said = [m.voiceover, m.question, m.explain].join(" ");
    const has = [...new Set([...defines, ...forms.filter((x) => x.forms.some((w) => saysWord(said, w))).map((x) => x.key)])];
    if (has.length) f.terms = has; if (defines.length) f.defines = defines;
  }
  for (const q of out.quizzes || []) { const w = byIndex[q.frameIndex]?.meta?.walk_me_through; if (w) q.walkMeThrough = w; }
  const rp = rpDirFor(dir), planDirs = [];
  // a walkthrough's A<n> and D<n> are its own plan's calls; a plan video comes before its plan has any, so
  // the ones it names are an earlier plan's, and only a video it lists in `before:` says which
  if (out.planDir && rp && basename(resolve(dir)) === "walkthrough-video") planDirs.push(resolve(dirname(rp), out.planDir));
  if (rp) for (const p of prerequisites) { const w = /^(.+?)(?:--walkthrough)?$/.exec(p.video)[1]; if (p.video !== "system" && existsSync(join(rp, "plans", w))) planDirs.push(join(rp, "plans", w)); }
  const texts = [readText(join(dir, "SCRIPT.md")), ...sbFrames.map((f) => Object.values(f.meta).join("\n"))];
  const calls = [...(out.autonomy || []), ...(out.autonomyGroups || []).flatMap((g) => g.calls || [])];
  out.slug = slugOf(dir);
  out.prerequisites = prerequisites;
  out.terms = terms;
  // the meanings a viewer opens on hover for this video's own words (D-216): its `terms: x = …`, and for a bare
  // word the glossary does not carry, the meaning another video gives it
  const meanings = {}, elsewhere = rp ? termsElsewhere(rp, dir) : new Map();
  for (const t of termList) {
    const k = t.term.toLowerCase();
    if (t.meaning) meanings[k] = t.meaning;
    else if (!rowFor(glossary, k) && elsewhere.get(k)?.meaning) meanings[k] = elsewhere.get(k).meaning;
  }
  if (Object.keys(meanings).length) out.termMeanings = meanings;
  // where each glossary word is explained: the system video's beat (its chapter, and where it starts), else
  // the first video that defines it; the player's link plays that beat
  const index = rp ? definesIndex(rp, { glossary, current: { dir, sb, frames: out.frames } }) : { words: {} };
  out.glossary = glossary.map((g) => { const at = (index.words[g.forms[0]] || [])[0]; return at ? { ...g, definedIn: at } : g; });
  out.ids = idGlosses({ texts, rp, planDirs, quizzes: out.quizzes || [], decisions: out.decisions || [], calls });
  const tc = fmValue(fm, "terms_check"); if (tc) out.termsCheck = tc;
  return { missing };
}
