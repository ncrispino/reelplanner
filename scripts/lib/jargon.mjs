// Likely jargon in a video's words, found by the build (D-216): what check-terms holds to a label.
// A word a newcomer may not know, said or shown with no meaning the viewer can open, is a △ line
// ("frame 7 says "merge" (4×) with no meaning"), and fails a `terms_check: strict` storyboard (D-217).
// Labelled means a meaning is one hover away: a glossary row (its core table, or its "Other words"), a
// `terms: x = …` in the storyboard, or a bare `terms: x` whose meaning the glossary or another video gives.
//
// What counts as likely jargon, in narration and on-screen text (a real thing's own text, `data-artifact`,
// and a code block, `<pre>`, are left out: they are the thing, glossed in place):
//   an acronym        2 to 5 capitals (PR, CI, HTML, TTS), plural too (PRs); not a plain word in capitals
//                     (NEW, STEP), a roman numeral or an id
//   code              on screen, a code run (<code>, a mono face): its tool (names.md), a file by its bare
//                     name (plan.md), or the run itself when it is one word that reads as code
//                     (`data-detail`, `terms_check`; not a key's name or a plain word in the mono); said, a tool
//                     names.md shows in code (git, npm), written in its lower case
//   a compound        camel case (definedIn, HyperFrames) or hyphenated with a jargon part (pre-commit,
//                     frame-lint, pr-check)
//   a software word   SEED: common words of the trade (repo, branch, merge, clone, commit, diff, pull
//                     request, fork, test suite, flag, prompt, agent, template, dependency, lint, spec…),
//                     used only to detect; a repo's glossary gives the meanings
//   reelplanning's    OWN: the system's own concept words (walkthrough, plan video, code check, brief,
//                     storyboard, audit, plan mode, kit…)
// A word that is plain English in this video ("a brief look", a flag the author means plainly) is marked
// plain by the storyboard: `plain: flag, brief`. The product's own name (the repo's) is never flagged.
import { codeKind } from "./say.mjs";

/** Common software words: detection only, never meanings (a repo's glossary, or a storyboard's terms:, gives those). */
export const SEED = ["repo", "repository", "branch", "main branch", "merge", "merge conflict", "clone", "commit", "diff", "pull request", "fork",
  "squash", "rebase", "stash", "checkout", "upstream", "test suite", "flag", "prompt", "agent", "template", "dependency", "lint", "linter",
  "spec", "schema", "config", "hook", "token", "bundle", "render", "deploy", "runtime", "codebase", "refactor", "pipeline", "fixture",
  "snapshot", "changelog", "semver", "terminal", "command line", "shell", "localhost", "endpoint", "frontend", "backend", "regex",
  "iframe", "markdown", "webhook", "environment variable", "headless", "sandbox", "mock", "stub", "compile", "cron", "dev server"];
/** reelplanning's own concept words: detection only; the repo's glossary says what each is. */
export const OWN = ["walkthrough", "walkthrough video", "plan video", "system video", "code check", "brief", "storyboard", "audit", "plan mode",
  "kit", "glossary", "decision log", "quick check", "detail page", "plan map", "terms index"];
/** Plain English: an all-capitals word that is one of these is emphasis, not an acronym. */
export const COMMON = new Set(("a an the and or but not no yes of to in on at by for from with as is are was were be been it its this that these those "
  + "i we you he she they me us him her them my our your his their what which who whom whose when where why how all any each every some many "
  + "much more most few one two three four five six ten new old now then here there up down out off over under again only just also very too "
  + "so if do does did done can will would should could may might must has have had get got go goes gone make made see seen say said ask "
  + "use used step steps plan plans video part parts next back last first end start stop play open close save send show hide keep read "
  + "note notes live free full main fix fixed test tests run runs ran add adds sum why ok okay hey hi wow yay nope sure new tip tips aim "
  + "time day days week today now soon late early near far left right top low high big small good bad best less least same own other else "
  + "such both few once twice true false yes nope why who what how into onto upon about after before while until since done step one "
  + "note mark marks chapter scene scenes frame frames answer check checks choice choices label labels accept flag finish watch view "
  + "code file files line lines word words page pages box card cards list item items name names way ways thing things real how").split(" "));
/** Acronyms everyone reads: units and a few words. */
const KNOWN = new Set(["OK", "TV", "AI", "US", "UK", "EU", "AM", "PM", "KB", "MB", "GB", "TB", "FAQ", "ID"]);
const ROMAN = /^(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XX|XL|L|C|D|M|MM)$/;
const ESC = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * A word or phrase, as a pattern that also finds its plural and its verb forms: merge → merges, merged,
 * merging; commit → committed; dependency → dependencies. Each word of a phrase may take them ("pull
 * requests"). Whole words only: "diff" is not found in "plan-diff".
 */
export function formPattern(form) {
  const one = (w) => {
    const e = ESC(w);
    if (!/[a-z]$/i.test(w)) return e;
    const alts = [`${e}(?:s|es|ed|d|ing|'s|’s)?`];
    if (/e$/i.test(w)) alts.push(`${ESC(w.slice(0, -1))}ing`);
    if (/[^aeiou][aeiou][bdgklmnprt]$/i.test(w)) alts.push(`${e}${ESC(w.slice(-1))}(?:ed|ing)`);
    if (/[^aeiou]y$/i.test(w)) alts.push(`${ESC(w.slice(0, -1))}ies`);
    return `(?:${alts.join("|")})`;
  };
  return `(?<![\\w-])${String(form).trim().split(/[\s-]+/).map(one).join("[\\s-]+")}(?![\\w-])`;
}
const reCache = new Map();
export const formRe = (form, flags = "gi") => { const k = `${flags}|${form}`; if (!reCache.has(k)) reCache.set(k, new RegExp(formPattern(form), flags)); const r = reCache.get(k); r.lastIndex = 0; return r; };
const TWO = /^[a-z]{2}$/i;
const acronymRe = (form) => new RegExp(`(?<![\\w-])${ESC(form.toUpperCase())}s?(?![\\w-])`, "g");
/** Whether `text` says `form` (its plural or a verb form too). A two-letter form is an acronym: said in capitals. */
export const saysForm = (text, form) => { const r = TWO.test(form) ? acronymRe(form) : formRe(form); r.lastIndex = 0; return r.test(String(text || "")); };

const blank = (s, a, b) => s.slice(0, a) + " ".repeat(b - a) + s.slice(b);
/** Every place `form` is said in `text`, as [start, end] ranges. */
function spans(text, form) {
  const out = [], re = TWO.test(form) ? acronymRe(form) : formRe(form);
  for (const m of String(text).matchAll(re)) out.push([m.index, m.index + m[0].length]);
  return out;
}

/**
 * The likely jargon in one line of a video, with what is labelled taken out first.
 *   text     the line (a sentence said, or a block on screen)
 *   segs     on screen: its runs, each { text, code }; a code run is looked at as code
 *   labels   the forms a viewer can open a meaning for (glossary rows, the storyboard's terms)
 *   plain    the words this video marks plain (`plain:`)
 *   names    names.md's rows (lib/names.mjs parseNames); a code row is a tool
 *   product  the product's own name(s), never flagged
 * → [{ key, word, why }]: `key` the word as a label would name it (lower case, singular), `word` as written.
 */
export function findJargon(text, { segs = null, labels = [], plain = [], names = [], product = [], said = false } = {}) {
  const out = [], seen = new Set(), plainSet = new Set(plain.map((p) => p.toLowerCase()));
  // reelplanning itself, the tool every one of these videos is made with, is the system video's to explain
  const productSet = new Set([...product, "reelplanning"].map((p) => p.toLowerCase()));
  const labelForms = [...new Set(labels.map((l) => String(l).toLowerCase().trim()).filter(Boolean))].sort((a, b) => b.length - a.length);
  const isPlain = (k) => plainSet.has(k) || [...plainSet].some((p) => saysForm(k, p));
  const tools = names.filter((n) => n.code && !productSet.has(n.shown.toLowerCase()));
  const toolOf = (w) => tools.find((n) => n.forms.some((f) => f.length === 1 && f[0] === w))?.shown.toLowerCase() || null;
  const labelled = (k) => labelForms.some((f) => f === k || saysForm(k, f) || f.startsWith(`${k} `));
  const push = (key, word, why) => {
    key = String(key).trim(); if (!key || productSet.has(key.toLowerCase())) return;
    const k = key.toLowerCase();
    if (isPlain(k) || labelled(k)) return;
    const id = `${k}|${word}`; if (seen.has(id)) return; seen.add(id);
    out.push({ key: k, word, why });
  };
  // 0. what is labelled is taken out first: a phrase a meaning covers is not looked at again ("the code check")
  const unlabel = (t) => { let s = String(t); for (const f of labelForms) for (const [a, b] of spans(s, f)) s = blank(s, a, b); return s; };
  // 1. code on screen: its tool, its files, or the run itself when it is one word
  let rest = String(text);
  if (segs) {
    rest = segs.filter((g) => !g.code).map((g) => g.text).join(" ");
    for (const g of segs.filter((x) => x.code)) {
      const t = g.text.trim(); if (!t) continue;
      // a labelled word's file is labelled with it (walkthrough.md, BRIEF.md): push checks the whole name
      const words = t.split(/\s+/).filter(Boolean), tool = toolOf(words[0]);
      if (tool) push(tool, words[0], "a tool");
      // a file by its bare name (plan.md); a path or a name with a number in it is one real thing's (video/pr-42)
      for (const w of words) { const c = w.replace(/^[("'“`]+|[.,;:!?)"'”`]+$/g, ""); if (codeKind(c) === "file" && !/[\/…]/.test(c)) push(c, c, "a file"); }
      const one = words.length === 1 ? words[0].replace(/[.,;:!?]+$/, "") : "";
      // one word in code is code when it reads as code (data-detail, terms_check, definedIn); a plain word set in
      // the mono (a key's name, a chip's "question") is left to the rules below
      if (one && !tool && !codeKind(one) && /^[A-Za-z][\w-]*$/.test(one) && !/\d/.test(one) && /[-_]|[a-z][A-Z]/.test(one) && !one.split(/[-_]|(?=[A-Z])/).every((p) => COMMON.has(p.toLowerCase()))) push(one, one, "code");
      else if (one && !tool) rest += ` ${one}`;
    }
  }
  let s = unlabel(rest);
  // 2. a file or a path outside code is left to names.md's rule (it is code in the captions); taken out, so
  //    "spec" is not found in "spec.md"
  s = s.replace(/\S+/g, (w) => { const c = w.replace(/^[("'“`]+|[.,;:!?)"'”`]+$/g, ""); const kind = codeKind(c); return kind === "file" || kind === "path" || kind === "flag" ? " ".repeat(w.length) : w; });
  // 3. the words of the trade and the system's own, longest first
  for (const f of [...SEED, ...OWN].sort((a, b) => b.length - a.length)) {
    for (const [a, b] of spans(s, f)) {
      const word = s.slice(a, b);
      // "a brief look", "in brief": the adjective, not the video's brief
      if (f === "brief" && /\b(?:a|in)\s+$/i.test(s.slice(Math.max(0, a - 4), a)) && /^\s+[a-z]/i.test(s.slice(b, b + 2))) continue;
      push(f, word, OWN.includes(f) ? "a reelplanning word" : "a software word"); s = blank(s, a, b);
    }
  }
  // 4. a tool said aloud (names.md shows it in code), in its own lower case: "git", "npm", "reel"
  if (said) for (const n of tools) for (const f of n.forms) {
    const phrase = f.join(" "); if (phrase !== phrase.toLowerCase()) continue;
    for (const m of s.matchAll(new RegExp(`(?<![\\w-])${ESC(phrase)}(?![\\w-])`, "g"))) { push(n.shown.toLowerCase(), m[0], "a tool"); s = blank(s, m.index, m.index + m[0].length); }
  }
  // 5. acronyms
  for (const m of s.matchAll(/(?<![\w-])([A-Z]{2,5})(s?)(?![\w-])/g)) {
    const w = m[1]; if (ROMAN.test(w) || KNOWN.has(w) || COMMON.has(w.toLowerCase())) continue;
    push(w, m[0], "an acronym");
  }
  // 6. compounds: camel case, or hyphenated with a jargon part
  // camel case: not when every piece is a plain word (inline labels run together on screen: "NextAcceptFlag")
  for (const m of s.matchAll(/(?<![\w-])(?:[a-z]+[A-Z][A-Za-z]*|[A-Z][a-z]+[A-Z][A-Za-z]*)(?![\w-])/g)) {
    if (m[0].split(/(?=[A-Z])/).every((p) => COMMON.has(p.toLowerCase()))) continue;
    push(m[0], m[0], "a compound");
  }
  const JPART = new Set([...SEED, ...OWN].filter((x) => !/\s/.test(x)).concat(["pr", "ci", "cli", "api", "css", "html", "json", "url", "tts", "npm", "git"]));
  for (const m of s.matchAll(/(?<![\w-])[A-Za-z]+(?:-[A-Za-z]+)+(?![\w-])/g)) {
    const parts = m[0].toLowerCase().split("-");
    if (parts.some((p) => JPART.has(p) || JPART.has(p.replace(/(?:s|es|ed|ing)$/, "")))) push(m[0].toLowerCase(), m[0], "a compound");
  }
  return out;
}
