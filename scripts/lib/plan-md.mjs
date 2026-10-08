// A plan's own text, read from its plan.md: the title, the problem and each step's body as Markdown.
// plan-map puts it in plan-map.json, where the player and the guide read it.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { repoRoot } from "./env.mjs";
import { diagramBlocks } from "./guide/diagram.mjs";
import { forGuideOf } from "./guide/depth.mjs";
const stepHasExamples = (s, fg) => /^#### +(?:worked )?examples\b/im.test(s.text || "") || !!(fg?.steps?.[s.n]?.examples || []).length;

/** plan.md for a video: `plan_dir` is relative to the repo root; a video copied or moved elsewhere finds it one folder up. */
export function planMdFor(videoDir, planDir) {
  if (!planDir) return null;
  const v = resolve(videoDir);
  return [join(resolve(repoRoot(v), planDir), "plan.md"), join(dirname(v), "plan.md")].find((p) => existsSync(p)) || null;
}

// a section runs to the next heading of its own level or above
const upTo = (rest, levels) => { const end = rest.search(new RegExp(`^#{1,${levels}} `, "m")); return (end < 0 ? rest : rest.slice(0, end)).trim(); };

/**
 * A plan's steps: `### Step N` then a dash (—, – or -) or a colon, then the title. The one step parser:
 * `reel check`, `reel stage`, `reel record`, `reel audit` and plan-map all read steps here, so
 * a plan written "### Step 1: …" has the same steps for every one of them.
 */
export function parseSteps(md) {
  md = String(md).replace(/\r\n/g, "\n");
  return [...md.matchAll(/^### Step (\d+)\s*[—–:-]\s*(.+)$/gm)].map((m) => ({ n: Number(m[1]), title: m[2].trim(), text: upTo(md.slice(m.index + m[0].length), 3) }));
}

/** { title, problem, steps: [{ n, title, text }] } from plan.md's text. */
export function readPlanMd(path) {
  const md = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const pm = md.match(/^## The problem[^\n]*$/m);
  return { title: (md.match(/^# (.+)$/m) || [])[1]?.trim() || null, problem: pm ? upTo(md.slice(pm.index + pm[0].length), 2) : null, steps: parseSteps(md) };
}

// ---------- the four blocks a step carries (the plan guide, step 2), and the rest of plan.md, for the guide ----------
// A step's text is its prose, then `####` blocks: Cases (a table: Case | Example | What happens | Trace), Interface (a
// fenced block, one part a line with its meaning after `#`, or "No interface: …"), Example (one worked example). Its
// Decisions are generated (the ledger by step, and each "Decisions in force" line that names the step). Nothing here
// fills a gap: a block not written is null, and the guide shows it as not written.

const sectionOf = (md, re) => { const m = md.match(re); return m ? upTo(md.slice(m.index + m[0].length), 2) : null; };
/** A Markdown table's rows as arrays of cells (the header row first; the |---| line dropped). */
export function tableRows(text) {
  const rows = [];
  for (const line of String(text).split("\n")) {
    if (!/^\s*\|/.test(line)) { if (rows.length) break; continue; }
    const cells = line.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
    rows.push(cells);
  }
  return rows;
}
// "you write: …; sent: …; filed: …" → [{ label, text }], in order; a beat with no label keeps label null
export function traceBeats(cell) {
  const s = String(cell || "").trim(); if (!s || /^[—–-]$/.test(s)) return null;
  return s.split(/\s*;\s+|\s*→\s*/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const m = /^([^:`]{1,32}):\s+(.+)$/.exec(b);
    return m && m[1].trim().split(/\s+/).length <= 4 ? { label: m[1].trim(), text: m[2].trim() } : { label: null, text: b };
  });
}
// the #### blocks of a step: { head, body }[] after its prose
function blocksOf(text) {
  const parts = String(text).split(/^#### +/m);
  const prose = parts.shift();
  return { prose: prose.trim(), blocks: parts.map((p) => { const nl = p.indexOf("\n"); return { head: (nl < 0 ? p : p.slice(0, nl)).trim(), body: nl < 0 ? "" : p.slice(nl + 1).trim() }; }) };
}
/** An Interface block's parts: each unindented line of its fenced block a part; an indented line with a `# meaning`,
 *  or a flag (`--quiet`), a part of it; any other indented line what the part prints. { line, meaning, out[], subs[] }. */
export function interfaceParts(body) {
  const fences = [...String(body).matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map((m) => m[1]);
  const parts = [];
  const split = (l) => { const m = /^(.*?\S)\s{2,}#\s+(.+)$/.exec(l); return m ? { text: m[1], meaning: m[2].trim() } : { text: l.replace(/\s+$/, ""), meaning: null }; };
  for (const block of fences) for (const raw of block.split("\n")) {
    if (!raw.trim()) continue;
    const indented = /^\s/.test(raw), s = split(raw);
    if (!indented || !parts.length) { parts.push({ line: s.text.trim(), meaning: s.meaning, out: [], subs: [] }); continue; }
    const cur = parts[parts.length - 1];
    if (s.meaning || /^\s+--?[a-z]/i.test(raw)) cur.subs.push({ line: s.text.trim(), meaning: s.meaning, out: [] });
    else (cur.subs.length && /^\s{4,}/.test(raw) ? cur.subs[cur.subs.length - 1].out : cur.out).push(raw.replace(/^\s{2}/, ""));
  }
  return parts;
}
const NO_IFACE = /^\s*(?:\*\*)?no interface\b[^\n]*/im;
/** A step's blocks: { prose, deps, cases, interface, example, other: [{ head, body }] } */
export function stepBlocks(text) {
  const { prose, blocks } = blocksOf(text);
  const deps = (/^\*([^*\n]+)\*\s*$/m.exec(prose) || [])[1]?.trim() || null;
  const find = (re) => blocks.find((b) => re.test(b.head));
  const cb = find(/^cases\b/i), ib = find(/^interface\b(?! as built)/i), eb = find(/^examples?\b(?!:)/i) || find(/^example\b/i);
  let cases = null;
  if (cb) {
    const rows = tableRows(cb.body);
    if (rows.length > 1) {
      const head = rows[0].map((h) => h.toLowerCase()), col = (re) => head.findIndex((h) => re.test(h));
      const ci = Math.max(0, col(/^case/)), ei = col(/example/), wi = col(/what happens|happens|result/), ti = col(/^trace/);
      cases = { head: rows[0], rows: rows.slice(1).map((r, i) => ({ i: i + 1, case: r[ci] || "", example: ei >= 0 ? r[ei] || "" : "", happens: wi >= 0 ? r[wi] || "" : "", trace: ti >= 0 ? traceBeats(r[ti]) : null, cells: r })), hasTrace: ti >= 0, intro: cb.body.split(/\n\s*\|/)[0].trim() };
    } else cases = { head: [], rows: [], hasTrace: false, intro: cb.body };
  }
  let iface = null;
  if (ib) {
    const none = (NO_IFACE.exec(ib.body) || [])[0]?.replace(/\*\*/g, "").trim() || null;
    iface = { none, parts: interfaceParts(ib.body), text: ib.body, after: ib.body.replace(/```[^\n]*\n[\s\S]*?```/g, "").trim() };
  } else { const none = (NO_IFACE.exec(text) || [])[0]?.replace(/\*\*/g, "").trim(); if (none) iface = { none, parts: [], text: none, after: "" }; }
  const other = blocks.filter((b) => b !== cb && b !== ib && b !== eb);
  return { prose, deps, cases, interface: iface, example: eb ? eb.body : null, other };
}
// "(step 4)", "(steps 1, 3)", "(steps 1 to 3)", "(all steps)" at a line's end → [4] / [1,3] / [1,2,3] / "all"
export function stepsNamed(s) {
  const m = /\((all steps|steps?\s+[^)]*)\)\s*\.?\s*$/i.exec(String(s).trim()); if (!m) return null;
  if (/^all/i.test(m[1])) return "all";
  const r = /(\d+)\s*(?:to|–|-)\s*(\d+)/.exec(m[1]);
  if (r) { const out = []; for (let i = +r[1]; i <= +r[2]; i++) out.push(i); return out; }
  const n = [...m[1].matchAll(/\d+/g)].map((x) => +x[0]); return n.length ? n : null;
}
const bullets = (text) => { const out = []; for (const line of String(text || "").split("\n")) { if (/^- /.test(line)) out.push(line.slice(2)); else if (out.length && /^\s+\S/.test(line)) out[out.length - 1] += " " + line.trim(); } return out; };
/** The open questions: [{ n, title, steps, setup, options: [{ letter, label, text }], recommend, answered: { text, ids } | null, text }] */
export function parseQuestions(md) {
  const sec = sectionOf(md, /^## Open questions[^\n]*$/m); if (!sec) return [];
  const qs = [];
  for (const m of sec.split(/^(?=\d+\.\s+\*\*)/m)) {
    const h = /^(\d+)\.\s+\*\*([^*]+)\*\*([^\n]*)\n?([\s\S]*)$/.exec(m.trim()); if (!h) continue;
    const body = h[4], lines = body.split("\n");
    const options = []; let setup = [], rec = null, answered = null;
    for (const line of lines) {
      const o = /^- \*\*([A-Z])\s*[·.:-]\s*([^*]+?)\.?\*\*\s*(.*)$/.exec(line);
      if (o) { options.push({ letter: o[1], label: o[2].trim(), text: o[3].trim() }); continue; }
      if (/^\s+\S/.test(line) && options.length && !rec && !answered) { options[options.length - 1].text += " " + line.trim(); continue; }
      if (/^I recommend\b/i.test(line)) { rec = line.trim(); continue; }
      if (/^\*{1,2}(?:answered|decided)\b/i.test(line.trim()) || (answered && line.trim())) { answered = { text: ((answered?.text || "") + " " + line.replace(/^\*+|\*+$/g, "").trim()).trim() }; continue; }
      if (rec && line.trim()) { rec += " " + line.trim(); continue; }
      if (!options.length && line.trim()) setup.push(line.trim());
    }
    if (answered) answered.ids = [...answered.text.matchAll(/\bD-\d{3,4}\b/g)].map((x) => x[0]);
    qs.push({ n: +h[1], title: h[2].trim(), steps: stepsNamed(h[3]) || [...(h[3].match(/\d+/g) || [])].map(Number), setup: setup.join(" "), options, recommend: rec, answered, text: m.trim() });
  }
  return qs;
}
/** Whether an option gives an example: a value, a quote, a command or a number, or says "say"/"e.g."/"for example";
 *  or, when the question sets one up ("Say a script of yours runs …"), says what happens in it (a word of it, five letters or more). */
export const hasExample = (text, setup = "") => /`[^`]+`|\d|["“][^"”]{2,}["”]|\be\.g\.|\bfor example\b|\bexample\b|\bsay\b|\bsays\b/i.test(String(text || ""))
  || (/^\s*(?:say|suppose|imagine|for example)\b/i.test(setup) && String(setup).toLowerCase().match(/[a-z]{5,}/g)?.filter((w) => !/^(which|there|their|these|those|about|would|could|should|every|other)$/.test(w)).some((w) => String(text).toLowerCase().includes(w)));
/** Everything the guide reads from plan.md: the title, its sections in order, each step and its blocks, the questions,
 *  the decisions in force (each with its steps), the parts touched and the plan's own parts. */
export function readPlanBlocks(path) { return planBlocksOf(readFileSync(path, "utf8")); }
/** The same, from plan.md's text (an earlier version of it: the guide's "Changed since your review", lib/guide/revised.mjs). */
export function planBlocksOf(text) {
  const md = String(text).replace(/\r\n/g, "\n");
  const title = (md.match(/^# (.+)$/m) || [])[1]?.trim() || null;
  const sections = [...md.matchAll(/^## (.+)$/gm)].map((m) => ({ title: m[1].trim(), text: upTo(md.slice(m.index + m[0].length), 2) }));
  const steps = parseSteps(md).map((s) => ({ ...s, ...stepBlocks(s.text) }));
  const inForce = bullets(sectionOf(md, /^## Decisions in force[^\n]*$/m)).map((line) => ({ text: line, ids: [...line.matchAll(/\bD-\d{3,4}\b/g)].map((x) => x[0]), steps: stepsNamed(line) }));
  const touched = bullets(sectionOf(md, /^## Components(?: touched)?[^\n]*$/m)).map((line) => ({ name: (/^\*\*([^*]+)\*\*/.exec(line) || [])[1]?.trim() || line.split(/[:(—]/)[0].trim(), text: line, steps: stepsNamed(line) || [...((/\(steps?\s+([^)]*)\)/i.exec(line) || [])[1] || "").matchAll(/\d+/g)].map((x) => +x[0]) }));
  const parts = bullets(sectionOf(md, /^## Parts[^\n]*$/m)).map((line) => ({ name: (/^\*\*([^*]+)\*\*/.exec(line) || /^`([^`]+)`/.exec(line) || [])[1]?.trim() || line.split(/[:—]/)[0].trim(), text: line }));
  const pm = md.match(/^## The problem[^\n]*$/m);
  return { md, title, problem: pm ? upTo(md.slice(pm.index + pm[0].length), 2) : null, sections, steps, questions: parseQuestions(md), inForce, touched, parts };
}

/** Plans written from this day on carry the four blocks, and `reel check` holds them to it (the plan guide, step 2). */
export const BLOCKS_FROM = "2026-09-30";
export const blocksDue = (planDir) => { const d = (/(\d{4}-\d{2}-\d{2})-/.exec(String(planDir).split(/[\\/]/).filter(Boolean).pop() || "") || [])[1]; return !!d && d >= BLOCKS_FROM; };
/** Whether a question is decided: its own "Answered/Decided" line, or the ledger's answer to it. */
export function answeredIn(q, ledger = [], planName = null) {
  if (q.answered) return q.answered;
  const d = [...ledger].reverse().find((x) => x.plan === planName && x.kind !== "autonomy" && (x.questionId === `q${q.n}` || String(x.question || "").trim() === q.title.trim()) && x.status !== "superseded");
  return d ? { text: `${d.chosen} (${d.id})`, ids: [d.id] } : null;
}
/**
 * What the blocks lack (the plan guide, step 2): `fails` a plan written from BLOCKS_FROM on cannot pass `reel check`
 * with (a step with no Cases table; no Interface block and no "No interface" line; an open question whose options have
 * no example), and `gaps`, which never fail: each a { where, what } the guide shows as not written in plan.md (a case
 * with no trace, an interface part with no meaning, a decision in force with no step; on an older plan, a missing block too).
 */
export function blockFindings(plan, { ledger = [], planName = null } = {}) {
  const fails = [], gaps = [], fg = forGuideOf(plan.md);
  for (const s of plan.steps) {
    if (!s.cases) fails.push({ where: `step ${s.n}`, what: `has no Cases table (a table under "#### Cases", one row a case)` });
    else if (!s.cases.rows.length) fails.push({ where: `step ${s.n}`, what: "its Cases block has no table rows" });
    if (!s.interface) fails.push({ where: `step ${s.n}`, what: `has no Interface block (a fenced block under "#### Interface", or the line "No interface: …")` });
    if (!s.example && !stepHasExamples(s, fg)) gaps.push({ where: `step ${s.n}`, what: "no Example" });
    // how the step works, drawn (D-265): a ```diagram block in the step, or under its "For step N" in "For the guide"
    if (!diagramBlocks(s.text).length && !(fg?.steps?.[s.n]?.diagrams || []).length) gaps.push({ where: `step ${s.n}`, what: "no diagram (a ```diagram block: how it works, drawn in the guide)" });
    for (const r of s.cases?.rows || []) if (!r.trace?.length) gaps.push({ where: `step ${s.n} · case ${r.i}`, what: "no trace" });
    for (const p of s.interface?.parts || []) {
      if (!p.meaning) gaps.push({ where: `step ${s.n} · interface part \`${p.line.length > 48 ? p.line.slice(0, 47) + "…" : p.line}\``, what: "no meaning" });
      for (const sub of p.subs) if (!sub.meaning) gaps.push({ where: `step ${s.n} · interface part \`${sub.line}\``, what: "no meaning" });
    }
  }
  for (const q of plan.questions) {
    if (answeredIn(q, ledger, planName)) continue;
    for (const o of q.options) if (!hasExample(o.text, q.setup)) fails.push({ where: `question ${q.n}'s option ${o.letter}`, what: "has no example (a value, a quote, a command or a number: what happens in the question's example)" });
  }
  for (const d of plan.inForce) if (!d.steps) gaps.push({ where: d.ids.join(", ") || d.text.slice(0, 40), what: "no step" });
  return { fails, gaps };
}

// The lines of a plan's "## Supersedes", one a decision it replaces: `- **D-214** "…" Narrowed for small pull requests
// (step 4).` Only the line's lead id (the bold head, else its first id) is replaced; another id on the line ("Replaced by
// D-220: step 2's judgment") says what replaces it, or is context. Each id once, on its first line. The step or question
// the line names, and the ids after its head, are how `reel record` finds the decision that replaces it.
// → [{ id, step, question, refs }]
export function supersedesOf(text) {
  const idsIn = (s) => [...String(s).matchAll(/\bD-\d{3}\b/g)].map((m) => m[0]);
  const bullets = [...String(text || "").matchAll(/^[-*] ([^\n]*(?:\n(?![-*] )[^\n]*)*)/gm)].map((m) => m[1].replace(/\s+/g, " ").trim());
  // no list: every id the section names, as before, with nothing to say which decision replaces it
  if (!bullets.length) return [...new Set(idsIn(text))].map((id) => ({ id, step: null, question: null, refs: [] }));
  const out = [], seen = new Set();
  for (const b of bullets) {
    const head = /^\*\*([^*]+)\*\*/.exec(b), lead = head ? idsIn(head[1]) : idsIn(b).slice(0, 1);
    // what the line says after its head and the old decision's quoted words
    const rest = (head ? b.slice(head[0].length) : b.replace(/\bD-\d{3}\b/, "")).trim().replace(/^"[^"]*"\s*|^“[^”]*”\s*/, "");
    const step = /\bsteps? (\d+)\b/i.exec(rest), question = /\bquestions? (\d+)\b/i.exec(rest);
    for (const id of lead) if (!seen.has(id)) { seen.add(id); out.push({ id, step: step ? +step[1] : null, question: question ? +question[1] : null, refs: idsIn(rest).filter((r) => !lead.includes(r)) }); }
  }
  return out;
}
