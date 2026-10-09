// What a reader asks of a guide, answered from the plan's own files (guide-clarity.md in the plan guide's folder): what
// this is and why it matters, what you can do now (shown working), how to try it, what the agent decided alone, what
// needs you, what isn't done, and only then the code. Nothing here is written for one plan: each answer is read from
// plan.md, walkthrough.md, runs/, the reviews and the ledger, and where they are too thin the answer says so and the
// page lists it under "What the plan should add".
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { stopFor } from "../autonomy.mjs";

const COMMAND = /^(?:\$\s*)?(?:npx\s+reelplanner|reelplanner|reel|npm|npx|node|git|gh)\s+\S/;
const OWN = /^(?:npx\s+reelplanner|reelplanner|reel|npm|node\s+bin)\b/;   // the project's own commands; another tool's needs more than its verb to be a way to try it
const clean = (s) => String(s || "").replace(/\s+/g, " ").trim();
/** "What changes", as the plan numbers them: each item's bold lead ("You can ask for an explainer") and its steps. */
export function changesOf(md) {
  return [...String(md || "").matchAll(/^\d+\.\s+\*\*([^*]+)\*\*\s*(?:\(([^)]*)\))?/gm)].map((m) => ({ lead: clean(m[1]).replace(/[.:]$/, ""), steps: [...String(m[2] || "").matchAll(/\d+/g)].map((x) => +x[0]) }));
}
/** The author's one sentence, `**In one sentence:** …` near the top of plan.md or walkthrough.md, if written. */
export function oneSentence(md) { const m = /^\*\*In one sentence:\*\*\s*([^\n]+(?:\n(?!\n|\*\*|#)[^\n]+)*)/m.exec(String(md || "")); return m ? clean(m[1]) : null; }

/** What a step lets you do, as a short verb phrase ("Open a full page under each video …"): the author's own
 *  `**You can now:** …` line in the step (walkthrough.md; plan.md's may say `**It lets you:** …`), else a sentence of the
 *  step that says it to you ("You answer, comment and edit right in the page, and …" → "Answer, comment and edit right
 *  in the page"), else null: the page then shows the step's title and lists the phrase as missing. → { text, from } */
const CAN_LINE = /^\s*[-*]?\s*\*\*(?:You can now|It lets you|You'll be able to|You will be able to)\s*:?\*\*\s*:?\s*([^\n]+(?:\n(?!\s*\n|\s*[-*] |\s*\*\*|\s*#)[^\n]+)*)/im;
export function canLine(md) { const m = CAN_LINE.exec(String(md || "")); if (!m) return null; const t = clean(m[1]).replace(/[.;]\s*$/, ""); return t ? t.charAt(0).toUpperCase() + t.slice(1) : null; }
export function youPhrase(md) {
  const text = String(md || "").replace(/\r\n/g, "\n").replace(/```[\s\S]*?```/g, "").split("\n").filter((l) => !/^\s*(#|\||>)/.test(l)).join("\n");
  const codes = []; const y = text.replace(/`[^`]*`/g, (c) => `\u0001${codes.push(c) - 1}\u0002`).replace(/\*\*/g, "");
  for (const raw of y.split(/(?<=[.!?])\s+|\n\s*\n|\n\s*[-*] /)) {
    const s = clean(raw).replace(/^[-*]\s+/, "");
    const m = /^You (?:can )?([a-z]+)(?![a-z'’])(.*)$/.exec(s); if (!m || /^(?:can|cannot|would|will|have|had|are|were|may|might|should|must|need|do|did|get|got)$/.test(m[1])) continue;
    let p = (m[1] + m[2]).split(/:\s|;\s|\s—\s|\s–\s|,\s+(?:and|but|so)\s+(?:it|this|that|the|each|every)\b|,\s+as\b|\s\(/)[0].replace(/[.!?,]+$/, "").trim();
    p = p.replace(/\u0001(\d+)\u0002/g, (_, k) => codes[+k]);
    const n = p.split(/\s+/).length; if (n < 3 || n > 16 || /["“”]/.test(p)) continue;
    return p.charAt(0).toUpperCase() + p.slice(1);
  }
  return null;
}
export function canOf({ built = null, prose = null, lead = null } = {}) {
  const said = canLine(built) || canLine(prose); if (said) return { text: said, from: "said" };
  const got = youPhrase(lead) || youPhrase(built) || youPhrase(prose); return got ? { text: got, from: "derived" } : null;
}

/** The plan's name and its promise: its title split at the first colon ("The plan guide: the video first, …"). */
export function namePromise(title) {
  const t = clean(title), i = t.indexOf(": ");
  if (i < 0) return { name: t, promise: null };
  const p = t.slice(i + 2);
  return { name: t.slice(0, i), promise: p.charAt(0).toUpperCase() + p.slice(1) };
}

/** The reader's own words that asked for the change: the first quote under "The problem", and who said it. */
export function askedOf(problem) {
  const lines = String(problem || "").replace(/\r\n/g, "\n").split("\n");
  const at = lines.findIndex((l) => /^>\s?/.test(l)); if (at < 0) return null;
  const q = []; for (let i = at; i < lines.length && /^>\s?/.test(lines[i]); i++) q.push(lines[i].replace(/^>\s?/, ""));
  let who = null; for (let i = at - 1; i >= 0; i--) { if (!lines[i].trim()) { if (who != null) break; continue; } if (/^#/.test(lines[i])) break; who = clean(lines[i] + " " + (who || "")); }
  const quote = clean(q.join(" ")).replace(/^["“]|["”]$/g, "");
  // the lead: the first plain paragraph after the quotes, if it says what is wrong today (not a list, a heading or another speaker's line)
  let lead = null; const after = lines.slice(at).join("\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  for (const p of after) { if (/^(>|#|[-*] |\d+\. |\|)/.test(p) || /:$/.test(p)) continue; lead = clean(p); break; }
  return { who: who && who.length < 160 ? who.replace(/:$/, "") : null, quote, lead };
}

/** The first plain sentence of a step's prose: past its "*Needs step 1.*" line and a "Decided: …" note. */
export function firstSentence(md) {
  let s = String(md || "").replace(/\r\n/g, "\n").replace(/```[\s\S]*?```/g, "");
  // past the step's "*Needs step 1.*" line, one line or several ("*Stands alone; … Decided: …\n… (D-202).*")
  s = s.split(/\n\s*\n/).map((p) => p.trim().replace(/^\*[^*\s][^*]*\*(?:\s+|$)/, "").trim()).filter((p) => p && !/^#/.test(p) && !/^\|/.test(p))[0] || "";
  s = clean(s.replace(/^[-*] /, ""));
  // a lead is plain words: an emphasis left open by the cut, or a stray star, goes
  s = s.replace(/(^|\s)\*(?=\S)(?![^*]*\*)/g, "$1").replace(/(\S)\*(?=\s|$)(?<!\*[^*]*\S\*)/g, "$1");
  const codes = []; const y = s.replace(/`[^`]*`/g, (c) => `\u0001${codes.push(c) - 1}\u0002`);
  const m = /^(.+?[.!?])(?=\s+[A-Z(“"*`\u0001]|$)/.exec(y);
  let out = (m ? m[1] : y).replace(/\u0001(\d+)\u0002/g, (_, k) => codes[+k]);
  // too long, it ends where a clause of it ends (a comma or semicolon before the 45th word), never inside one
  if (out.split(/\s+/).length > 60) { const w = out.split(/\s+/); for (let i = 44; i >= 8; i--) { const head = w.slice(0, i + 1).join(" ");
    if (/[,;]$/.test(w[i]) && (head.match(/`/g) || []).length % 2 === 0 && (head.match(/\(/g) || []).length === (head.match(/\)/g) || []).length) { out = head.replace(/[,;]$/, "."); break; } } }
  return out || null;
}

/** The latest review of this kind on file (reviews/<kind>-<time>.md): its date, verdict, and what it accepted. */
export function latestReview(planDir, kind) {
  const d = join(planDir, "reviews"); if (!existsSync(d)) return null;
  const f = readdirSync(d).filter((x) => x.startsWith(`${kind}-`) && x.endsWith(".md")).sort().at(-1); if (!f) return null;
  const md = readFileSync(join(d, f), "utf8"), head = /^# [^·\n]+·\s*([^·\n]+?)\s*·\s*([^\n]+)$/m.exec(md);
  const ids = (re) => { const m = re.exec(md); return m ? [...m[1].matchAll(/\b([AD]\d+|m\d+)\b/g)].map((x) => x[1]) : []; };
  return { file: `reviews/${f}`, date: head ? head[1].replace(/\s*UTC$/, "") : null, verdict: head ? head[2].trim() : null,
    accepted: ids(/^Accepted[^:]*:\s*([^\n.]*)/m), unjudged: ids(/Never judged[^:]*:\s*([^\n]*)/m), flagged: ids(/^Flagged[^:]*:\s*([^\n.]*)/m) };
}

// a command a person can run, from a line of code: `$ ` and trailing comments cut
const asCommand = (line) => { const l = clean(String(line).replace(/\s{2,}#.*$/, "").replace(/\s{3,}\(.*$/, "")).replace(/^\$\s*/, ""); return COMMAND.test(l) && l.length < 160 ? l : null; };
// the clause of a sentence that names `needle` (to its `;` or full stop, the sentence's own lead kept when the needle
// is in its first clause), never cut inside: too long whole, it is left out (null)
const sentenceWith = (text, needle) => { const t = clean(String(text).replace(/```[\s\S]*?```/g, "")); const i = t.indexOf(needle); if (i < 0) return null;
  const a = Math.max(t.lastIndexOf(". ", i) + 2, t.lastIndexOf("\n", i) + 1, 0), b0 = t.indexOf(". ", i + needle.length), b = b0 < 0 ? t.length : b0 + 1;
  const sc = t.lastIndexOf("; ", i), c0 = sc >= a ? sc + 2 : a, se = t.indexOf("; ", i + needle.length), c1 = se >= 0 && se < b ? se : b;
  let s = t.slice(c0, c1).replace(/^[-*]\s*/, "").replace(/\s*\([^()]*`[^()]*\)/g, "").trim();
  if (!/[.!?]$/.test(s)) s += ".";
  return s.split(/\s+/).length > 45 ? null : s.charAt(0).toUpperCase() + s.slice(1); };

/** How to try it, per step: the commands that ran (runs/), those the build says it has (Interface as built), those its
 *  words name, and the plan's (planned). Each with where it comes from; the same command once, the most real kept. */
export function tryItOf({ plan, built, steps, runStep = {}, exRuns = {} }) {
  const out = [], key2 = (c) => c.split(/\s+/).slice(0, 2).join(" ");
  const add = (x, { unlessKey = false } = {}) => {
    const k = x.cmd.replace(/\s+/g, " ");
    if (out.some((y) => y.cmd.replace(/\s+/g, " ") === k)) return;
    if (unlessKey && out.some((y) => key2(y.cmd) === key2(k))) return;
    out.push(x);
  };
  const named = (text, n, from) => { text = String(text || "").replace(new RegExp(CAN_LINE.source, "gim"), ""); for (const m of String(text || "").matchAll(/`([^`\n]{6,150})`/g)) { const c = asCommand(m[1]); if (!c || c.split(/\s+/).length < (OWN.test(c) ? 3 : 4)) continue;
    let what = sentenceWith(text, m[0]); what = what && what.replace(m[0], "this").replace(/\*\*this\*\*/g, "this"); add({ cmd: c, from, step: n, what: what && what.replace(/[*`]/g, "").length > 24 ? what : null }, { unlessKey: true }); } };
  const runsHere = built ? built.runs || {} : Object.fromEntries(Object.entries(exRuns).filter(([k]) => runStep[k] != null));
  if (built || Object.keys(runsHere).length) {
    for (const r of Object.values(runsHere)) {
      if (!r.cmd) continue; const cat = (built?.cats || []).find((c) => c.runs.includes(r.name));
      const note = (/\s{2,}\((.+)\)\s*$/.exec(r.cmd) || [])[1] || null;
      const wrote = wroteOf(r.text);
      add({ cmd: r.cmd.replace(/\s{2,}\(.+\)\s*$/, ""), from: "ran", step: cat?.steps?.[0] ?? runStep[r.name] ?? null, run: r.name, what: note, part: cat ? cat.name : null, partSum: cat?.sum ? clean(cat.sum.split("\n")[0]) : null, exit: r.exit, wrote, outside: outsideOf(r.text) });
    }
    if (built) for (const s of built.steps || []) for (const p of s.ifaceBuilt?.parts || []) { const c = asCommand(p.line); if (c) add({ cmd: c, from: "built", step: s.n, what: p.meaning || null }, { unlessKey: true }); }
    if (built) for (const s of built.steps || []) named(s.text, s.n, "named");
  }
  for (const s of steps) for (const p of s.interface?.parts || []) { const c = asCommand(p.line); if (c) add({ cmd: c, from: "planned", step: s.n, what: p.meaning || null, out: p.out || [] }, { unlessKey: !!built }); }
  for (const s of steps) named(s.prose, s.n, "planned");
  return out;
}

/** The agent's choices, each with why it is worth a look (or not) in plain words, what your review said of it, and
 *  what the walkthrough video does with it (`stops`: that video's, from its plan map): "pause", "list" (its end list),
 *  "shown" (an older video's grouped beat: on one sheet, not a pause on each), or null (only on this page). */
export function choicesOf(calls, review, stops = null) {
  const WHY = { deviation: "Changed from the plan", notice: "You'll notice it", undo: "Hard to undo later", miss: "Like something a recent review caught late", listed: null };
  const where = (id) => { const s = (stops || []).find((x) => ["choices", "list", "shown"].includes(x.kind) && (x.ids || []).includes(id)); return s ? { choices: "pause", list: "list", shown: "shown" }[s.kind] : null; };
  return (calls || []).map((c) => { const s = stopFor(c); return { id: c.id, look: s.stops, why: WHY[s.rule] || null, video: stops ? where(c.id) : undefined,
    judged: review ? (review.accepted.includes(c.id) ? "accepted" : review.flagged.includes(c.id) ? "flagged" : review.unjudged.includes(c.id) ? "not judged" : null) : null }; });
}
/** One breakdown of the choices, for every place the page counts them: { total, look, pause, list, shown, only, video }
 *  (ids each; `video` false when there is no walkthrough video to say what it does with them). */
export function choiceCounts(choices) {
  const C = choices || [], ids = (f) => C.filter(f).map((c) => c.id), video = C.some((c) => c.video !== undefined);
  return { total: C.length, look: ids((c) => c.look), pause: ids((c) => c.video === "pause"), list: ids((c) => c.video === "list"), shown: ids((c) => c.video === "shown"), only: ids((c) => video && !c.video), video };
}

// ── where a saved run was made, and what a command does to the repo ──
// a command that writes to the project's record (.reelplanner/: plans, reviews, the decision log): the page warns first
export const WRITES_RECORD = /^(?:npx\s+)?(?:reel\s+(?:record|renumber(?![^|]*--dry-run)|new-plan|retro|decide|init|adopt)|reelplanner\s+(?:explain|record|init))\b/;
// the repo paths a command names (.reelplanner/…, scripts/…, a folder with a slash), for "does this repo have it?"
export const pathsIn = (cmd) => [...String(cmd).matchAll(/(?:^|\s)((?:\.reelplann(?:er|ing)|scripts|packages|templates|skills|docs|src|\.github)\/[^\s'"|)]+)/g)].map((m) => m[1].replace(/[.,;:]+$/, ""));
/** Where a run was made: this repo, or a scratch one (walkthrough.md says so, or the run names a plan this repo does
 *  not have, or a made-up reviewer). → { scratch: bool, why, setup, missing: [paths] } */
export function whereRan(run, { scratch = null, inScratch = () => false, has = () => true } = {}) {
  const said = inScratch(scratch, run.name);
  const cmd = String(run.cmd || ""), note = (/\s{2,}\((.+)\)\s*$/.exec(cmd) || [])[1] || "";
  const missing = pathsIn(cmd.replace(/\s{2,}\(.+\)\s*$/, "")).filter((p) => !has(p));
  const why = said ? "said" : /\bscratch\b/i.test(note) ? "note" : missing.length ? "path" : /@example\.com/.test(run.text || "") ? "example" : null;
  return { scratch: !!why, why, said, setup: said ? scratch.setup : null, missing };
}
/** Where a run wrote outside the checkout: its ✓ line naming a path above it (`✓ ../wth-review: 181 files, 25.9 MB`),
 *  with the size it printed. → { path, size } | null */
const outsideOf = (text) => { for (const l of String(text || "").split("\n").slice(1)) { const m = /^\s*✓\s+((?:\.\.\/|\/|~\/)[^\s:·,]+)/.exec(l); if (m) return { path: m[1], size: (/(\d[\d.,]*\s*[KMG]B)\b/.exec(l) || [])[1] || null }; } return null; };
/** The file a run says it wrote: the path its own ✓ line starts with (`✓ guide/index.html · 5 steps`), never a name in
 *  what it printed about something else. */
export const wroteOf = (text) => { for (const l of String(text || "").split("\n").slice(1)) { const m = /^\s*✓\s+(\S+\.(?:html|json|md|txt|zip))(?=\s|$|[·,:])/.exec(l); if (m) return m[1]; } return null; };

/** What the plan's files are too thin to say, in the reader's words: one line a kind, with how many. */
export function thinOf({ gaps = [], steps = [], tryIt = [], hasPromise = true, asked = null, built = null, kind = "plan", summary = null, can = [], canBuilt = !!built }) {
  const T = [], n = (re) => gaps.filter((g) => re.test(g.what)).length, plural = (k, w) => `${k} ${w}${k === 1 ? "" : "s"}`;
  if (!summary) T.push({ what: `What it ${built ? "lets you do now" : "would let you do"}, in one plain sentence: an \`**In one sentence:**\` line near the top`, where: built ? "walkthrough.md" : "plan.md" });
  const noCan = can.filter((c) => !c.can).map((c) => c.n);
  if (noCan.length) T.push({ what: `What ${noCan.length === can.length && can.length > 1 ? "each step" : `step${noCan.length > 1 ? "s" : ""} ${noCan.join(", ")}`} ${canBuilt ? "lets you do" : "would let you do"}, as a short phrase (the page shows ${noCan.length === 1 ? "its title" : "their titles"} instead): ${canBuilt ? "a \`**You can now:**\` line under each step" : "an \`**It lets you:**\` line in each step"}`, where: canBuilt ? "walkthrough.md" : "plan.md" });
  if (built && !Object.keys(built.runs || {}).length) T.push({ what: "A saved run of it working: no command's output is saved (`runs/<name>.txt`: the command, what it printed, and its exit)", where: "the plan's runs/ folder" });
  if (!hasPromise) T.push({ what: "A one-line promise: plan.md's title has no \"<name>: <what it lets you do>\"", where: "plan.md" });
  if (!asked) T.push({ what: "Why it matters: \"The problem\" has no quote of what was asked", where: "plan.md" });
  if (kind !== "explainer") {
    const untried = steps.filter((s) => !tryIt.some((x) => x.step === s.n)).map((s) => s.n);
    if (untried.length) T.push({ what: `How to try ${untried.length === steps.length ? "any step" : `step${untried.length > 1 ? "s" : ""} ${untried.join(", ")}`}: no command to run is written for ${untried.length === 1 ? "it" : "them"}${built ? " (an \"Interface as built\" block, or a saved run in runs/)" : " (an Interface block)"}`, where: built ? "walkthrough.md" : "plan.md" });
    const k = [[/^no trace/, (x) => `A step-by-step trace for each case: ${plural(x, "case")} ${x === 1 ? "has" : "have"} none (a Trace column)`],
      [/^no meaning/, (x) => `What each interface line means: ${plural(x, "line")} ${x === 1 ? "has" : "have"} no \`# meaning\``],
      [/^no step$/, (x) => `Which step each earlier decision applies to: ${plural(x, "line")} under "Decisions in force" name${x === 1 ? "s" : ""} none`],
      [/^no Example/, (x) => `A worked example: ${plural(x, "step")} ${x === 1 ? "has" : "have"} none`],
      [/^no diagram/, (x) => `A diagram of how it works: ${plural(x, "step")} ${x === 1 ? "has" : "have"} none (a diagram block in the step, which the guide draws)`],
      [/^no worked example/, (x) => `Worked examples, each case with its saved run: ${plural(x, "step")} ${x === 1 ? "has" : "have"} none`],
];
    const noCases = steps.filter((s) => !s.cases).length, noIface = steps.filter((s) => !s.iface).length;
    if (noCases) T.push({ what: `The cases (what happens in each situation, with an example): ${plural(noCases, "step")} ${noCases === 1 ? "has" : "have"} no Cases table`, where: "plan.md" });
    if (noIface) T.push({ what: `The interface (the command, file or screen it adds): ${plural(noIface, "step")} ${noIface === 1 ? "has" : "have"} no Interface block`, where: "plan.md" });
    for (const [re, say] of k) { const x = n(re); if (x) T.push({ what: say(x), where: "plan.md" }); }
    if (built && !built.cats.length) T.push({ what: "What changed, grouped: walkthrough.md has no \"Categories of change\"", where: "walkthrough.md" });
  }
  return T;
}
