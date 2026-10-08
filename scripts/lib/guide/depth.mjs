// What the guide holds that the video does not (D-265): how each step works, drawn; worked examples, each case with its
// input, what happens, its real output from a saved run and its edge cases; and the depth the video skips (why it works
// this way, what else was considered, what breaks it, its limits, the exact files and commands). All of it is written by
// the author, never by the builder: in a step of plan.md or walkthrough.md (a ```diagram block, a `#### Worked examples`
// block), or, for a plan already reviewed, in a section of its own that says it was written after, for the guide:
//
//   ## For the guide
//   *Written after the build, for the guide: …*
//   **In one sentence:** …                       the page's one line (reader.mjs reads it wherever it is)
//   ```diagram … ```                              an overview: how the whole fits together
//   ### For step 2 — <its title, or none>   (never "### Step 2": that heading is the step itself to every tool)
//   **In short:** …                               the step's opening line on the Built side, in place of the plan's
//                                                 first sentence (which stays in the plan's words, a click away)
//   ```diagram … ```                              how the step works (as many as it needs)
//   #### Worked examples
//   ##### A plan with no Interface block          one case
//   - **Input:** `reel check .reelplanning/plans/2026-10-01-quiet-output`
//   - **What happens:** …
//   - **Output:** `runs/reel-check-new-plan.txt` (lines 1-3)     a saved run, never typed in
//   - **Predict:** What does it do with step 2?   optional: the output waits for a click
//   - **Edge cases:**
//     - …
//   - **Before:** … / **After:** …               optional: the page toggles them
//   #### Why it works this way                    and any other heading: the depth, each folded under its heading
//
// and, once, at the top of the section: `**Ran in a scratch repo:** \`runs/x.txt\`, … — <setup>` (which runs were made
// in a scratch repo, not this one), `#### Since then` (a Not done line settled by a later commit, a choice changed
// since, or `- **Step 3**: …` what a step does today: scratchOf, sinceOf) and `#### In plain words` (plainOf)
import { diagramBlocks, withoutDiagrams } from "./diagram.mjs";
import { globRe } from "./built.mjs";

const sectionOf = (md, re) => { const m = re.exec(md); if (!m) return null; const rest = md.slice(m.index + m[0].length); const e = rest.search(/^## /m); return e < 0 ? rest : rest.slice(0, e); };
const FOR_GUIDE = /^## For the guide[^\n]*$/m;
/** plan.md or walkthrough.md without its `## For the guide` section (the page shows that section's parts where they belong). */
export const withoutForGuide = (md) => { const s = String(md || ""), m = FOR_GUIDE.exec(s); if (!m) return s; const rest = s.slice(m.index + m[0].length), e = rest.search(/^## /m); return s.slice(0, m.index) + (e < 0 ? "" : rest.slice(e)); };

const FIELD = { input: /^(?:input|you run|you type|given|the input)$/i, happens: /^(?:what happens|it does|then)$/i, output: /^(?:output|real output|it prints|what it printed|what it prints)$/i, edges: /^(?:edge cases?|edges|and if)$/i, predict: /^(?:predict|ask yourself|guess first)$/i, before: /^before$/i, after: /^after$/i, why: /^(?:why|note|so)$/i };
const fieldOf = (label) => Object.keys(FIELD).find((k) => FIELD[k].test(label.trim())) || null;

/** One worked example's Markdown (after its `##### name`) → { name, input, happens, output, runs: [{ name, from, to }], edges: [], predict, before, after, why, rest } */
export function parseExample(name, body) {
  const ex = { name: name.trim(), input: null, happens: null, output: null, runs: [], edges: [], predict: null, before: null, after: null, why: null, rest: "" };
  let cur = null; const buf = { rest: [] };
  const lines = String(body || "").replace(/\r\n/g, "\n").split("\n");
  let fence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) fence = !fence;
    const m = !fence && /^- \*\*([^*]+?):?\*\*:?\s*(.*)$/.exec(line);
    const k = m && fieldOf(m[1].replace(/:$/, ""));
    if (k) { cur = k; (buf[k] ||= []).push(m[2]); continue; }
    (buf[cur || "rest"] ||= []).push(line.replace(/^ {2}/, ""));
  }
  const text = (k) => (buf[k] ? buf[k].join("\n").replace(/\n{3,}/g, "\n\n").trim() : null) || null;
  for (const k of ["input", "happens", "output", "predict", "before", "after", "why"]) ex[k] = text(k);
  ex.rest = text("rest") || "";
  const edges = text("edges"); if (edges) ex.edges = edges.split("\n").reduce((a, l) => { if (!l.trim()) return a; if (/^\s*[-*]\s/.test(l) || !a.length) a.push(l.replace(/^\s*[-*]\s+/, "").trim()); else a[a.length - 1] += " " + l.trim(); return a; }, []).filter(Boolean);
  // "lines 3-9" after a run keeps those lines in view (the rest one click away)
  if (ex.output) for (const m of ex.output.matchAll(/`(runs\/[^`\s]+)`(?:\s*\((?:lines?\s+)?(\d+)(?:\s*[-–]\s*(\d+))?\))?/g)) ex.runs.push({ name: m[1], from: m[2] ? +m[2] : null, to: m[3] ? +m[3] : m[2] ? +m[2] : null });
  return ex;
}

/** A step's (or the overview's) chunk → { intro, diagrams: [src], examples: [..], depth: [{ head, md }] } */
export function parseChunk(md) {
  const out = { intro: "", after: "", diagrams: diagramBlocks(md).map((d) => d.src), examples: [], depth: [], lead: null };
  // the step's opening line, said for the guide: `**In short:** …` before its first heading
  const IN_SHORT = /^\*\*In short:\*\*\s*([^\n]+(?:\n(?!\n|\*\*|#|```)[^\n]+)*)\n*/m, h0 = String(md).search(/^#### +/m), ls = IN_SHORT.exec(h0 < 0 ? String(md) : String(md).slice(0, h0));
  if (ls) { out.lead = ls[1].replace(/\s+/g, " ").trim(); md = String(md).replace(ls[0], ""); }
  // the words before the first heading: those written before the chunk's first diagram lead it; those written after it
  // follow the diagrams on the page ("The rules are checked in that order" points at the drawing above it)
  const h = String(md).search(/^#### +/m), head = h < 0 ? String(md) : String(md).slice(0, h), dg = head.search(/^```diagram/m);
  const parts = withoutDiagrams(h < 0 ? "" : String(md).slice(h)).split(/^#### +/m);
  parts.shift();
  out.intro = withoutDiagrams(dg < 0 ? head : head.slice(0, dg)).trim();
  out.after = dg < 0 ? "" : withoutDiagrams(head.slice(dg)).trim();
  for (const p of parts) {
    const nl = p.indexOf("\n"), head = (nl < 0 ? p : p.slice(0, nl)).trim(), body = nl < 0 ? "" : p.slice(nl + 1);
    if (/^(?:worked )?examples?\b/i.test(head)) {
      const ex = body.split(/^##### +/m); const lead = ex.shift().trim(); if (lead) out.examplesLead = lead;
      for (const e of ex) { const k = e.indexOf("\n"); out.examples.push(parseExample(k < 0 ? e : e.slice(0, k), k < 0 ? "" : e.slice(k + 1))); }
      continue;
    }
    if (body.trim()) out.depth.push({ head, md: body.trim() });
  }
  return out;
}

// where the runs were made, said once for the guide (written after the build):
//   **Ran in a scratch repo:** `runs/pr-check-*.txt`, `runs/record-contributor.txt` — set up as `scripts/test/x.spec.mjs` does: …
//   **Ran in a scratch repo:** every run in `runs/` — …
// the runs it names (globs allowed; "every run" is all of them), and the setup after the dash
const SCRATCH = /^\*\*Ran in a scratch (?:repo|clone):\*\*\s*([^\n]+(?:\n(?!\n|\*\*|#)[^\n]+)*)/m;
export function scratchOf(text) {
  const m = SCRATCH.exec(String(text || "")); if (!m) return null;
  const t = m[1].replace(/\s+/g, " ").trim(), cut = t.search(/\s[—–]\s/);
  const list = cut < 0 ? t : t.slice(0, cut), setup = cut < 0 ? null : t.slice(cut).replace(/^\s*[—–]\s*/, "").trim() || null;
  return { all: /\bevery run\b|\ball (?:the )?runs\b/i.test(list), runs: [...list.matchAll(/`(runs\/[^`]+)`/g)].map((x) => x[1]), setup };
}
/** Is this run one the scratch line names? */
export const inScratch = (sc, name) => !!sc && (sc.all || sc.runs.some((g) => g === name || (/[*?]/.test(g) && globRe(g).test(name))));
// what a Not done line became since the build, said after it for the guide (walkthrough.md's For the guide):
//   #### Since then
//   - **Open point: who `owner` is**: answered in code (`eed4d14`, `3f5c919`): …
// each item names a Not done line by the start of its bold lead; its commits are checked in git by the builder
// the block is its heading and its list: it ends at the first line that is neither an item, an item's indented line,
// nor blank
const SINCE = /^#### +Since then[ \t]*\n((?:[ \t]*\n|[-*] [^\n]*\n?|[ \t]+\S[^\n]*\n?)*)/m;
export function sinceOf(md) {
  const m = SINCE.exec(String(md || "")); if (!m) return [];
  return [...m[1].matchAll(/^[-*] \*\*([^*]+)\*\*:?\s*([^\n]*(?:\n(?![-*] )[^\n]*)*)/gm)].map((x) => ({ head: x[1].trim(), md: x[2].replace(/\s+/g, " ").replace(/^[:\s]+/, "").trim() }));
}

// what a line of the record says in the record's own words, said plainly for the page (the record stays as it was, its
// words a click away): `#### In plain words`, an item a line, headed by what it says again:
//   - **A12**: …                                   a choice: its card's lead
//   - **13 calls**: …                              a Not done line (the start of its bold lead): its line in "In short"
//   - **Step 5**, with Not done's **Hand-built things to do**: …
//                                                  a step the code check found short: said in these words everywhere it
//                                                  is said (where it stands, In short, the step, the check), and the Not
//                                                  done lines it names said once with it
// → [{ head, also: [heads], md }]
const PLAIN = /^#### +In plain words[ \t]*\n((?:[ \t]*\n|[-*] [^\n]*\n?|[ \t]+\S[^\n]*\n?)*)/m;
export function plainOf(md) {
  const m = PLAIN.exec(String(md || "")); if (!m) return [];
  return [...m[1].matchAll(/^[-*] ([^\n]*(?:\n(?![-*] )[^\n]*)*)/gm)].map((x) => {
    const t = x[1].replace(/\s+/g, " ").trim(), lead = /^(.*?\*\*[^*]+\*\*[^:*]*?):\s+(.*)$/.exec(t);
    if (!lead || !/^\*\*/.test(lead[1])) return null;
    const heads = [...lead[1].matchAll(/\*\*([^*]+)\*\*/g)].map((h) => h[1].trim());
    return { head: heads[0], also: heads.slice(1), md: lead[2].trim() };
  }).filter(Boolean);
}

/** A file's `## For the guide` → { note, overview: chunk, steps: { n: chunk }, scratch, since, plain } or null. */
export function forGuideOf(md) {
  const sec = sectionOf(String(md || "").replace(/\r\n/g, "\n"), FOR_GUIDE); if (sec == null) return null;
  const pieces = sec.split(/^### +/m);
  let head = pieces.shift();
  const scratch = scratchOf(head), since = sinceOf(head), plain = plainOf(head);
  head = head.replace(SCRATCH, "").replace(SINCE, "").replace(PLAIN, "");
  // its opening line in italics says it was written after the build: kept for the page's "How this page was made"
  const NOTE = /^\s*\*(?!\*)([^*]+?)\*\s*$/m;
  const note = (NOTE.exec(head) || [])[1]?.replace(/\s+/g, " ").trim() || null;
  const overview = parseChunk(head.replace(NOTE, "").replace(/^\*\*In one sentence:\*\*[^\n]*(?:\n(?!\n)[^\n]*)*/m, ""));
  const steps = {};
  for (const p of pieces) {
    const nl = p.indexOf("\n"), title = nl < 0 ? p : p.slice(0, nl), body = nl < 0 ? "" : p.slice(nl + 1);
    const m = /^For step\s+(\d+)\b/i.exec(title.trim());
    if (m) steps[+m[1]] = parseChunk(body);
    else { const c = parseChunk(body); overview.diagrams.push(...c.diagrams); overview.examples.push(...c.examples); if (c.intro || c.depth.length) overview.depth.push({ head: title.trim(), md: [c.intro, ...c.depth.map((d) => `**${d.head}.** ${d.md}`)].filter(Boolean).join("\n\n") }); }
  }
  return { note, overview, steps, scratch, since, plain };
}

/** A step's material from every place it can be written: its own text (plan.md, walkthrough.md) and each file's
 *  `## For the guide`, in that order. → { diagrams: [{ src, from }], examples, depth, intro } */
export function stepDepth(n, { planText = "", builtText = "", fgPlan = null, fgBuilt = null } = {}) {
  const own = [["plan.md", parseChunkOwn(planText)], ["walkthrough.md", parseChunkOwn(builtText)], ["plan.md", fgPlan?.steps?.[n] || null], ["walkthrough.md", fgBuilt?.steps?.[n] || null]];
  const out = { diagrams: [], examples: [], depth: [], intro: [], after: [], lead: null };
  for (const [from, c] of own) {
    if (!c) continue;
    if (c.lead) out.lead = { md: c.lead, from };   // the walkthrough's, when both say one
    out.diagrams.push(...c.diagrams.map((src) => ({ src, from })));
    out.examples.push(...c.examples.map((e) => ({ ...e, from })));
    out.depth.push(...c.depth.map((d) => ({ ...d, from })));
    if (c.intro && c.forGuide !== false) out.intro.push({ md: c.intro, from });
    if (c.after && c.forGuide !== false) out.after.push({ md: c.after, from });
  }
  return out;
}
// a step's own text: only its diagrams and its `#### Worked examples` (its other blocks are the plan's, shown as they are)
function parseChunkOwn(text) {
  if (!text) return null;
  const c = { intro: "", diagrams: diagramBlocks(text).map((d) => d.src), examples: [], depth: [], forGuide: false };
  const m = /^#### +(?:worked )?examples\b[^\n]*\n([\s\S]*?)(?=^#### |(?![\s\S]))/im.exec(text);
  if (m) for (const e of m[1].split(/^##### +/m).slice(1)) { const k = e.indexOf("\n"); c.examples.push(parseExample(k < 0 ? e : e.slice(0, k), k < 0 ? "" : e.slice(k + 1))); }
  return c;
}

