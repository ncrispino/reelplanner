#!/usr/bin/env node
// Hold a video's words to what its viewer knows (plan: accessible videos). Run by `reelplanning build`
// before narrate, and on its own.
//
//   a real thing    text inside a `data-artifact` container (the real table, diff or command run a scene
//                   shows) is the thing's own: its words are glossed in place (by a pinned `data-gloss`
//                   word or the narration), so they are not a use before a definition, and an id in it is
//                   a warning, never a failure. On-screen text is split into lines by block elements only.
//   a bare id       an id (D-056, A12, D1, k3, q2) said or shown with no word in the same sentence that
//                   says what it is — decision, choice or call, quick check, question (or deviation):
//                   "D-056 stops every call" names nothing a viewer can hold. With `terms_check: strict`
//                   in the storyboard's front matter (what the skill writes on a new storyboard) or
//                   --strict, it fails the build; on a video from before that, it is a warning.
//   a word early    a glossary term, a word from the jargon list (templates/reelplanning/jargon.txt, and
//                   the repo's own .reelplanning/jargon.txt) or one of this video's `terms:`, said or shown
//                   before a beat defines it (`- defines: <term>` at or before its first use) and not
//                   among the words a video before this one defines (its `before:` videos' `terms:`).
//                   A warning; --strict makes it fail.
//   the system video every glossary row has a beat of the system video (`kind: system`) that explains
//                   it, tagged `- defines: <term>` (the term, or its on-screen word): a row without one
//                   fails the system video's build, by name ("streak has no beat"), and so does a defining
//                   beat that says neither the term nor its on-screen word (D-127: explained in the plain word).
//   no meaning      (D-216, D-217) a word a newcomer may not know (lib/jargon.mjs: an acronym, code, a
//                   technical compound, a common software word or one of reelplanning's own) said or shown
//                   with no meaning the viewer can open: no glossary row (its core table or its "Other words"),
//                   no `terms: x = …` in the storyboard, and not a bare `terms: x` the glossary or another video
//                   gives a meaning. One line a word, where it is first said or shown and how often:
//                   △ frame 7 says "merge" (4×) with no meaning: add a row to the glossary, or `terms: merge = …`.
//                   It fails a `terms_check: strict` storyboard. A real thing's own text and a code block are
//                   left out; a word the video uses plainly is marked `plain: flag` in the storyboard.
//   names           (names.md) a tool's name on screen outside code markup (`reelplanning` in a sans label,
//                   not in the mono or a <code>), or a listed name spelled another way ("ReelPlanning",
//                   "Github"), outside a real thing's own text: a warning.
//   spelled out     (lib/say.mjs) a flag, a path or a file name the script spells out ("claude dash p", "names
//                   dot md", "slash work"): a warning. Write it as it is written (`claude -p`); narrate
//                   hands the voice the spoken form, and the captions show it as written.
//   quick checks    (videos-you-can-follow, step 4) a check with no `- walk_me_through:` fails the
//                   build (write one, and it goes on); the words of its right
//                   answer that the beat explaining the rule (`- explained_at:`, else the beat before the
//                   check) never says or shows are a warning (the answer was not shown, D-140), except the
//                   check's own case: a word of its question, and a count worked out from a question that
//                   gives numbers; an id in its `explain` is a warning (give the reason in words).
//                   A check tests the rule later, on a case the video did not show (D-197, D-198): a
//                   check right after the beat that explains it (that beat is the one before it) is a
//                   warning, and so is one that reuses that beat's case: its question's numbers and names
//                   (digits, two to twenty in words, a file name, code, an id) all said or shown in that
//                   beat, or two of them. Not in a walkthrough video (walkthroughs-that-help step 3): there
//                   a check asks what the change about to run will do, just before the scene that runs
//                   it, so it follows the beat that sets it up and asks about the run's own case.
//
// usage: reelplanning check-terms <video-dir> [--strict] [--verbose]
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ROOT } from "./lib/env.mjs";
import { parseHtml, decode, BLOCK, cssRules, styleOf } from "./lib/frame-html.mjs";
import { namesFor, namesOnScreen } from "./lib/names.mjs";
import { findJargon } from "./lib/jargon.mjs";
import { spelledOut } from "./lib/say.mjs";
import { kindOf } from "./lib/length.mjs";
import { basename, dirname } from "node:path";
import { frontMatter, fmValue, listOf, termsOf, plainOf, storyboardFrames, parseBefore, resolvePrereqs, glossaryFor, jargonFor, saysWord, ID_RE, normId, rowFor, rpDirFor, termsElsewhere } from "./lib/terms.mjs";

const argv = process.argv.slice(2);
const dir = argv.find((a) => !a.startsWith("--"));
if (!dir) { console.error("usage: reelplanning check-terms <video-dir> [--strict] [--verbose]"); process.exit(1); }
const V = resolve(dir), read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
if (!existsSync(join(V, "STORYBOARD.md"))) { console.error(`✗ check-terms: no STORYBOARD.md in ${dir}`); process.exit(1); }
const sb = read(join(V, "STORYBOARD.md")), fm = frontMatter(sb), frames = storyboardFrames(sb).sort((a, b) => a.index - b.index);
const STRICT = argv.includes("--strict"), IDS_FAIL = STRICT || /^strict$/i.test(fmValue(fm, "terms_check") || "");
// a walkthrough video's quick checks come just before the scene that runs the change (walkthroughs-that-help
// step 3): D-197's "later" and D-198's "a case of its own" are the plan and system videos' rules, not its
const WALKTHROUGH = kindOf(V, sb) === "walkthrough";

// ── what is said and shown, in order ────────────────────────────────────────────────────────────────
// narration: SCRIPT.md's line for the frame (its indented text), else the storyboard's voiceover
const lines = {};
for (const b of read(join(V, "SCRIPT.md")).split(/\n(?=## Line )/)) {
  const n = (b.match(/^## Line .*\(Frame (\d+)\)/m) || [])[1]; if (!n) continue;
  const text = b.split("\n").filter((l) => /^ {4}\S/.test(l)).map((l) => l.trim()).join(" ");
  if (text) lines[n] = text;
}
const sentences = (t) => String(t || "").replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z0-9"'“])/).map((s) => s.trim()).filter(Boolean);
// on screen: the frame's text, one block per block-level element. Only an element splits it: a line the
// frame wraps over several spans (a terminal's output row, a code line) is one line, however its source
// is broken. A real thing on screen, inside a `data-artifact` container (a table, a diff, a command's
// run), keeps its own words: they are marked `artifact`, glossed in place by the words pinned on it
// (`data-gloss`) and the narration, so a word there is not a use before its definition and an id
// there is a warning at most. A pinned word's own text is the video's, and is held to the rules.
// A line's `segs`: its text in runs, each `code` when it is in code markup (<code>, <pre>, <kbd>, <samp>)
// or set in a mono face, where a tool's name belongs (names.md). Code does not split a line.
const CODE_TAGS = new Set(["code", "pre", "kbd", "samp", "tt"]);
function onScreen(html) {
  const out = [], rules = cssRules(html); let cur = null;
  const flush = () => { if (cur) { const t = cur.text.replace(/\s+/g, " ").trim(); if (t) out.push({ text: t, artifact: cur.artifact, segs: cur.segs, ...(cur.block ? { block: true } : {}) }); } cur = null; };
  const monoOf = (el, code) => {
    if (CODE_TAGS.has(el.tag)) return true;
    const st = styleOf(el, rules), f = st["font-family"] || (st.font && /["'a-z]/i.test(st.font) ? st.font : "");
    return f ? /mono|monospace|--rp-mono|--font-mono|--rp-code/i.test(f) : code;
  };
  const add = (t, code) => { const last = cur.segs[cur.segs.length - 1]; if (last && last.code === code) last.text += t; else cur.segs.push({ text: t, code }); cur.text += t; };
  // `pre`: inside a code block (<pre>), which is the code itself, not the video's words about it
  const walk = (node, artifact, code, pre) => {
    for (const c of node.children || []) {
      if (!c.tag) { const t = decode(c.text); if (!t.trim()) { if (cur) add(t, code); continue; } if (cur && cur.artifact !== artifact) flush(); cur = cur || { text: "", artifact, segs: [], block: pre }; add(t, code); continue; }
      if (c.tag === "script" || c.tag === "style") continue;
      const inside = "data-gloss" in c.attrs ? false : artifact || "data-artifact" in c.attrs;
      const block = BLOCK.has(c.tag);
      if (block || inside !== artifact) flush();
      walk(c, inside, monoOf(c, code), pre || c.tag === "pre");
      if (block || inside !== artifact) flush();
    }
  };
  walk(parseHtml(html), false, false, false);
  flush();
  return out;
}
const units = [];   // { frame, where, text }
for (const f of frames) {
  for (const s of sentences(lines[f.index] || f.meta.voiceover?.replace(/^"|"$/g, ""))) units.push({ frame: f.index, where: "said", text: s });
  const src = f.meta.src && join(V, f.meta.src);
  if (src && existsSync(src)) for (const t of onScreen(read(src))) units.push({ frame: f.index, where: t.artifact ? "in the real thing" : "on screen", text: t.text, artifact: t.artifact, segs: t.segs, ...(t.block ? { block: true } : {}) });
}

// ── 1. no id alone ──────────────────────────────────────────────────────────────────────────────────
const NAMING = /\b(decision|decisions|choice|choices|call|calls|quick check|quick checks|question|questions|deviation|deviations|off-plan)\b/i;
const bare = [], bareShown = [];   // bareShown: in a real thing's own text (data-artifact), a warning at most
for (const u of units) {
  const ids = [...u.text.matchAll(ID_RE)].map((m) => m[1]);
  if (ids.length && !NAMING.test(u.text.replace(ID_RE, " "))) (u.artifact ? bareShown : bare).push({ ...u, ids: [...new Set(ids.map(normId))] });
}

// ── 2. a word before it is defined ──────────────────────────────────────────────────────────────────
const glossary = glossaryFor(V), termList = termsOf(fm);
const words = new Map();   // key → forms
// a row under "Other words" is a meaning only (D-216): labelled on hover, never a word a beat has to define first
for (const g of glossary.filter((x) => !x.other)) words.set(g.forms[0], g.forms);
for (const w of jargonFor(V, ROOT)) if (![...words.values()].some((fs) => fs.includes(w))) words.set(w, [w]);
// a word the storyboard gives a meaning (`terms: x = …`) is a label, like an "Other words" row: the viewer opens it
// on hover, so no beat has to define it first (D-216); a bare `terms: x` is the video's to define in a beat
const bareTerms = termList.filter((t) => !t.meaning).map((t) => t.term.toLowerCase());
for (const t of bareTerms) if (![...words.values()].some((fs) => fs.includes(t))) words.set(t, [t]);
const { prerequisites } = resolvePrereqs(V, parseBefore(fm, fmValue(fm, "kind")));
const known = new Set(prerequisites.flatMap((p) => (p.terms || []).map((t) => t.toLowerCase())));
const defines = frames.map((f) => ({ frame: f.index, words: listOf(f.meta.defines).map((x) => x.toLowerCase()) }));
const early = [], never = [];
for (const [key, forms] of words) {
  const first = units.find((u) => !u.artifact && forms.some((w) => saysWord(u.text, w)));   // a real thing's own words are glossed in place
  const def = defines.find((d) => d.words.some((w) => forms.includes(w) || forms.some((x) => saysWord(w, x))));
  if (bareTerms.includes(key) && !def) never.push(key);
  if (!first) continue;
  if (forms.some((w) => known.has(w))) continue;
  if (def && def.frame <= first.frame) continue;
  early.push({ key, ...first, def: def?.frame ?? null });
}

// ── 3. the system video explains every glossary row ─────────────────────────────────────────────────
const SYSTEM = /^system$/i.test(fmValue(fm, "kind") || ""), noBeat = [], unsaid = [];
if (SYSTEM) {
  for (const g of glossary.filter((x) => !x.other)) {   // "Other words" are meanings only (D-216)
    const d = frames.find((f) => listOf(f.meta.defines).some((w) => rowFor(glossary, w) === g));
    if (!d) { noBeat.push(g); continue; }
    if (!units.some((u) => u.frame === d.index && g.forms.some((w) => saysWord(u.text, w)))) unsaid.push({ g, frame: d.index });
  }
}

// ── 5. no meaning: likely jargon said or shown with no label (D-216, D-217) ──────────────────────────
// labelled: a glossary row (core or "Other words"), a `terms: x = …`, or a bare `terms: x` the glossary or
// another video gives a meaning (its `terms: x = …`, or a beat of it that defines x)
const RP = rpDirFor(V), elsewhere = RP ? termsElsewhere(RP, V) : new Map();
const labels = [...glossary.flatMap((g) => g.forms), ...termList.filter((t) => t.meaning || rowFor(glossary, t.term) || elsewhere.has(t.term.toLowerCase())).map((t) => t.term.toLowerCase())];
const product = (() => { const root = RP ? dirname(RP) : null; if (!root) return []; let name = null; try { name = JSON.parse(read(join(root, "package.json")) || "{}").name; } catch {} return [name, basename(root)].filter(Boolean).map((x) => String(x).toLowerCase()); })();
const namesRows = namesFor(V, ROOT), plain = plainOf(fm), noMeaning = new Map();   // key → { frame, where, word, n }
for (const u of units.filter((x) => !x.artifact && !x.block)) {
  for (const j of findJargon(u.text, { segs: u.where === "on screen" ? u.segs : null, labels, plain, names: namesRows, product, said: u.where === "said" })) {
    const e = noMeaning.get(j.key);
    if (e) e.n++; else noMeaning.set(j.key, { frame: u.frame, where: u.where, word: j.word, why: j.why, n: 1, text: u.text });
  }
}
const unlabelled = [...noMeaning].map(([key, e]) => ({ key, ...e, shown: /^[A-Z]{2,5}s?$/.test(e.word) ? e.word.replace(/s$/, "") : e.why === "a file" ? e.word : key }));

// ── names: a tool's name in code markup, every listed name spelled the list's way (names.md) ──────────
const misnamed = [];
const NAMES = namesFor(V, ROOT);
for (const u of units.filter((x) => x.segs && !x.artifact)) for (const m of namesOnScreen(u.segs.map((g) => ({ text: g.text.replace(/\s+/g, " ").trim(), code: g.code })), NAMES)) misnamed.push({ frame: u.frame, ...m, text: u.text });

// ── spelled out: a flag, a path or a file name written as it is said (lib/say.mjs) ────────────────────
const spelled = [];
for (const [frame, text] of Object.entries(lines)) for (const x of spelledOut(text)) spelled.push({ frame: Number(frame), ...x });

// ── 4. quick checks: a walk-through each, the rule shown before it, a case of its own, reasons in words ─
const noWalk = [], unshown = [], idIn = [], tooSoon = [], sameCase = [];
const STOP = new Set("that this with from what when which where there their them they your have will would into only more than then each every none nothing just also about after before been does doesn't isn't it's".split(" "));
// a word's stem, near enough to match "waits" with "wait" and "sixteen" with "16" (the script says numbers in words)
const NUM = { ...Object.fromEntries("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split(" ").map((w, i) => [w, String(i)])), once: "1", twice: "2", thrice: "3" };
const stem = (w) => { w = w.toLowerCase().replace(/[^a-z0-9-]/g, ""); if (NUM[w]) return NUM[w]; if (w.length > 4) w = w.replace(/(?:ing|ed|es|s)$/, ""); return w.slice(0, 5); };
const contentWords = (t) => [...new Set(String(t || "").toLowerCase().replace(/[’']s\b/g, "").match(/[a-z][a-z0-9'-]{3,}|\d+/g) || [])].filter((w) => !STOP.has(w));
// a case's numbers and names (D-198): digits, two to twenty in words ("one" is every other sentence's), a file
// name, code, an id. The same ones in the beat that explains the rule is that beat's case again.
const FILE_RE = /(?<![\w/.-])[\w-]+\.(?:md|json|html?|mjs|cjs|js|ts|tsx|txt|css|py|sh|ya?ml|wav|mp4|png|svg)(?![\w-])/gi;
const caseOf = (t) => {
  const s = String(t || ""), out = new Set();
  for (const m of s.matchAll(/(?<![\w.:-])\d+(?![\w-])/g)) out.add(m[0]);
  for (const m of s.toLowerCase().matchAll(/[a-z]+/g)) if (NUM[m[0]] && Number(NUM[m[0]]) >= 2 && !/^(?:twice|thrice)$/.test(m[0])) out.add(NUM[m[0]]);
  for (const m of s.matchAll(/`([^`]+)`/g)) out.add(m[1].trim().toLowerCase());
  for (const m of s.matchAll(FILE_RE)) out.add(m[0].toLowerCase());
  for (const m of s.matchAll(ID_RE)) out.add(normId(m[1]));
  return out;
};
const COUNTED = /(?<![\w.:-])\d+(?![\w-])|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/i;
for (const f of frames.filter((x) => x.meta.quiz)) {
  const k = f.meta.quiz;
  if (!String(f.meta.walk_me_through || "").trim()) noWalk.push({ frame: f.index, k });
  for (const [field, text] of [["explain", f.meta.explain]]) {
    const ids = [...String(text || "").matchAll(ID_RE)].map((m) => normId(m[1]));
    if (ids.length) idIn.push({ frame: f.index, k, field, ids: [...new Set(ids)] });
  }
  const answer = f.meta[`option_${String(f.meta.answer || "").trim().toLowerCase()}`];
  const at = String(f.meta.explained_at || "").trim();
  const base = (x) => String(x || "").replace(/^.*\//, "").replace(/\.html$/, "");
  const shown = at ? frames.find((x) => (/^\d+$/.test(at) ? x.index === Number(at) : base(x.meta.src) === base(at))) : [...frames].reverse().find((x) => x.index < f.index && !x.meta.quiz);
  if (!shown) continue;
  const by = at ? "explained_at" : "the beat before it", there = units.filter((u) => u.frame === shown.index);
  // later, not right after (D-197): the beat that explains the rule is not the one just before the check
  const prev = [...frames].reverse().find((x) => x.index < f.index);
  if (prev && prev.index === shown.index && !WALKTHROUGH) tooSoon.push({ frame: f.index, k, shown: shown.index, by });
  // a case of its own (D-198): the question's numbers and names are not that beat's, all of them or two
  const asked = [f.meta.question, f.meta.question_more].filter(Boolean).join(" "), mine = caseOf(asked);
  if (mine.size && !WALKTHROUGH) {
    const theirs = caseOf(there.map((u) => u.text).join(" \n ")), again = [...mine].filter((x) => theirs.has(x));
    if (again.length && (again.length === mine.size || again.length >= 2)) sameCase.push({ frame: f.index, k, shown: shown.index, by, again });
  }
  if (!answer) continue;
  // the answer was not shown (D-140): the rule's words, not the case's; a question's own words are the
  // case, and a count is worked out from a question that gives numbers
  const said = new Set(there.flatMap((u) => contentWords(u.text).map(stem)));
  const caseWords = new Set(contentWords(asked).map(stem)), counts = COUNTED.test(asked);
  const missing = contentWords(answer).filter((w) => { const x = stem(w); return !said.has(x) && !caseWords.has(x) && !(counts && /^\d+$/.test(x)); });
  if (missing.length) unshown.push({ frame: f.index, k, shown: shown.index, by, missing, answer });
}
const WALK_FAILS = true;

// ── report ──────────────────────────────────────────────────────────────────────────────────────────
const quote = (s) => `“${s.length > 90 ? `${s.slice(0, 89)}…` : s}”`;
for (const b of bare) console.log(`${IDS_FAIL ? "✗" : "△"} frame ${b.frame}, ${b.where}: ${b.ids.join(", ")} alone — say what ${b.ids.length > 1 ? "they are" : "it is"} (decision, choice, quick check, question): ${quote(b.text)}`);
for (const b of bareShown) console.log(`△ frame ${b.frame}, in the real thing (data-artifact): ${b.ids.join(", ")} — pin a word on it or say in the narration what ${b.ids.length > 1 ? "they are" : "it is"}: ${quote(b.text)}`);
for (const e of early) console.log(`${STRICT ? "✗" : "△"} frame ${e.frame}, ${e.where}: "${e.key}" before ${e.def ? `frame ${e.def} defines it` : "any beat defines it"} — define it where it is first ${e.where === "said" ? "said" : "shown"} (\`- defines: ${e.key}\`), or name a video that does in \`before:\`: ${quote(e.text)}`);
for (const k of never) console.log(`${STRICT ? "✗" : "△"} "${k}" is in terms: but no beat says \`- defines: ${k}\``);
for (const g of noBeat) console.log(`✗ the system video: ${g.forms[0]} has no beat — every glossary row is explained by a beat tagged \`- defines: ${g.forms[0]}\`${g.display ? `, in its plain word ("${g.display}")` : ""}`);
for (const u of unsaid) console.log(`✗ frame ${u.frame} defines ${u.g.forms[0]} but never says it${u.g.display ? ` (nor "${u.g.display}", its word on screen)` : ""}`);
for (const m of misnamed) console.log(`△ frame ${m.frame}, on screen: "${m.found}" — show it as ${m.want} (${m.why}; names.md): ${quote(m.text)}`);
for (const x of unlabelled) console.log(`${IDS_FAIL ? "✗" : "△"} frame ${x.frame} ${x.where === "said" ? "says" : "shows"} "${x.shown}"${x.n > 1 ? ` (${x.n}×)` : ""} with no meaning: ${glossary.length ? `add a row to the glossary, or \`terms: ${x.shown} = …\` in the storyboard` : `add \`terms: ${x.shown} = …\` to the storyboard`}${x.why ? ` (${x.why})` : ""}`);
for (const x of spelled) console.log(`△ frame ${x.frame}, said: "${x.said}" — write it as it is written, ${x.shown} (narrate says it aloud, the captions show it as written)`);
for (const q of noWalk) console.log(`${WALK_FAILS ? "✗" : "△"} frame ${q.frame}, quick check ${q.k}: no \`- walk_me_through:\` (two to four plain sentences working the check's own case through)`);
for (const q of unshown) console.log(`△ frame ${q.frame}, quick check ${q.k}: its answer (“${q.answer}”) uses ${q.missing.map((w) => `"${w}"`).join(", ")}, never said or shown in frame ${q.shown} (${q.by}) — show the answer before asking, or name the beat that does`);
for (const q of tooSoon) console.log(`△ frame ${q.frame}, quick check ${q.k}: right after frame ${q.shown}, which explains its rule (${q.by}) — ask it later, after the next step's scenes, so the viewer applies the rule rather than recalls the last sentence`);
for (const q of sameCase) console.log(`△ frame ${q.frame}, quick check ${q.k}: its case is frame ${q.shown}'s again (${q.by}): ${q.again.map((x) => `"${x}"`).join(", ")} said or shown there — ask about a case the video did not show: other names, other numbers`);
for (const q of idIn) console.log(`△ frame ${q.frame}, quick check ${q.k}: its ${q.field} names ${q.ids.join(", ")} — give the reason in words, not an id`);
const fails = (IDS_FAIL ? bare.length + unlabelled.length : 0) + (STRICT ? early.length + never.length : 0) + noBeat.length + unsaid.length + (WALK_FAILS ? noWalk.length : 0);
const n = (k, w) => `${k} ${w}${k === 1 ? "" : "s"}`;
const bits = [bare.length && n(bare.length, "bare id"), bareShown.length && `${n(bareShown.length, "id")} in a real thing's own text`, early.length && `${n(early.length, "word")} before ${early.length === 1 ? "its" : "their"} definition`, never.length && `${n(never.length, "term")} never defined`,
  noBeat.length && `${n(noBeat.length, "glossary row")} the system video never explains`, unsaid.length && `${n(unsaid.length, "defining beat")} not saying ${unsaid.length === 1 ? "its word" : "their words"}`,
  unlabelled.length && `${n(unlabelled.length, "word")} with no meaning`, misnamed.length && `${n(misnamed.length, "name")} on screen not as names.md shows ${misnamed.length === 1 ? "it" : "them"}`, spelled.length && `${spelled.length} ${spelled.length === 1 ? "flag, path or file name" : "flags, paths or file names"} spelled out in the script`, noWalk.length && `${n(noWalk.length, "quick check")} with no walk-through`, unshown.length && `${n(unshown.length, "quick check")} whose answer was not shown`, tooSoon.length && `${n(tooSoon.length, "quick check")} right after ${tooSoon.length === 1 ? "the beat that explains it" : "the beats that explain them"}`, sameCase.length && `${n(sameCase.length, "quick check")} on ${sameCase.length === 1 ? "its" : "their"} explaining beat's own case`, idIn.length && `${n(idIn.length, "quick check")} explained by an id`].filter(Boolean);
if (!bits.length) console.log(`✓ terms: no id alone, every word defined before it is used and labelled${SYSTEM ? `, every glossary row explained (${glossary.filter((g) => !g.other).length})` : ""} (${units.length} lines and on-screen blocks, ${words.size} words watched${prerequisites.length ? `, ${known.size} from ${prerequisites.map((p) => p.video).join(", ")}` : ""})`);
else console.log(`${fails ? "✗" : "△"} terms: ${bits.join(", ")}${fails ? " — failing" : " (warnings"}${!fails && bare.length && !IDS_FAIL ? "; terms_check: strict makes a bare id fail)" : !fails ? ")" : ""}`);
process.exit(fails ? 1 : 0);
