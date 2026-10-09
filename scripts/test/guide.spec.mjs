#!/usr/bin/env node
// The plan guide (plan 2026-09-28-plan-guide), against a scratch repo:
//   the four blocks   — plan.md's Cases (a Trace column: the beats in order), Interface (a part a line, its meaning after
//                       `#`, a flag's line and what it prints under it), Example; "Decisions in force" lines by step
//   reel check        — on a plan written since the blocks were asked for: no Cases table, no Interface block, an open
//                       question's option with no example fail; a case with no trace, a part with no meaning, a decision
//                       with no step are warnings; an older plan is not held to them (--blocks holds it)
//   reelplanner guide — a plan video's guide: the full page and a part a step, a category of change and an overview;
//                       the page answers a reader's questions in order (guide-clarity.md): what it is and why, what it
//                       lets you do, how to try it, what was decided, what needs you, what is left out, then the code;
//                       made from plan.md, the ledger, the plan map, walkthrough.md (Commits, Categories of change), git
//                       and runs/; gaps listed, never filled in; --check passes on it, and fails a run named that runs/
//                       does not hold and a first layer that says the narration again; an explainer's part a source;
//                       "In short" says what each step lets you do (its `**You can now:**` line, else a "You …" sentence
//                       of the step, else its title, listed as missing); the words with a special meaning folded to
//                       one line, each marked where it first appears, its meaning on hover or a tap
//   plan-map          — a scene's `- guide: <part>` opens that part over the frame (details[].src guide/<part>.html);
//                       check-details takes its data-detail mark, and warns (never fails) where the frame marks nothing
//   diagrams (D-265)  — a ```diagram block (flow, sequence, state, compare) drawn at build time as static SVG, a wide
//                       and a phone layout, its labels real text; its stages in words; a node's link; the steps and
//                       what each needs, and which file imports which, drawn from structure; reel check warns on a new
//                       plan's step with none
//   worked examples   — "## For the guide" (### For step N): each case's input, what happens, its saved run (lines
//                       kept in view), edge cases, predict; on the page as tabs, the real output a click away; an
//                       example naming a run runs/ does not hold fails --check
//   its pictures      — a step's scene from a 2× snapshot, as files beside the page at 1×, 2× and whole: on a 2× screen
//                       the file shown has twice the pixels it is drawn across; clicked, it opens whole in the lightbox
//   round 1's readers — the walkthrough video's stops from the plan map (a pause, several, the list, an older grouped
//                       beat "Shown, not a pause"), each choice it stops on linked to its moment, --check failing a stop
//                       the timeline leaves out; the choices counted once, the same everywhere; the code check's answers
//                       whole; a Markdown fence drawn as code (in a list item too), --check failing one left as text;
//                       a run made in a scratch repo tagged and shown apart, "It writes" only from its ✓ line; a Not
//                       done line settled since said so; the decisions and the plan's words left out of Open everything
//   round 3's readers — "In plain words" for the record's own words (a choice's lead, a short step with the Not done
//                       line it names said once, a Not done line); a step's "In short" and "Today"; a step's answer a
//                       later plan changed, in that plan's own Supersedes words and step, the ledger's link said too;
//                       one decision count, the check's, its differences folded; a stopped run says why
//   reel record       — a suggested edit: one ledger entry (the reviewer's words chosen over the plan's), and
//                       reviews/<id>.md's "Edits to apply", with the scenes it rebuilds (the guide only, when none says it)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, launchOpts, chromiumEnv } from "../lib/env.mjs";
import { pathToFileURL } from "node:url";
import { stepBlocks, traceBeats, stepsNamed, readPlanBlocks, blockFindings, hasExample } from "../lib/plan-md.mjs";
import { readWalkthrough, pathIn } from "../lib/guide/built.mjs";
import { paragraphsOf, checkGuide } from "../lib/guide/check.mjs";
import { canLine, youPhrase, canOf, thinOf, wroteOf, whereRan, choicesOf, choiceCounts, firstSentence } from "../lib/guide/reader.mjs";
import { guideTarget, buildModel, supersedesLine } from "../lib/guide/model.mjs";
import { webpEncoder } from "../lib/guide/pictures.mjs";
import { parseDiagram, drawDiagram, stepsDiagram, importsAmong, wrap, balance, textWidth, diagramGeometry, diagramBlocks, segHitsBox } from "../lib/guide/diagram.mjs";
import { forGuideOf, parseExample, parseChunk, withoutForGuide, scratchOf, sinceOf, plainOf, inScratch } from "../lib/guide/depth.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-guide-"));
const home = join(tmp, "home"); mkdirSync(home, { recursive: true });
const repo = join(tmp, "repo"), rp = join(repo, ".reelplanner");
const env = { ...process.env, HOME: home, REELPLANNER_HOME: join(home, ".reelplanner"), ...chromiumEnv() };   // (Playwright looks for its browser under HOME)
const git = (...a) => execFileSync("git", a, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", cwd: repo, env, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const reel = (...a) => run("reel.mjs", ...a);
const write = (p, text) => { mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, text); };
const commit = (msg) => { git("add", "-A"); git("commit", "-q", "-m", msg); return git("rev-parse", "--short", "HEAD").trim(); };
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2500)}` : ""}`); if (!cond) failed++; };

const PLAN = (withBlocks) => `# Rename the flag: --out becomes --to

## The problem

The flag says where, not what.

## Steps

### Step 1 — Rename the flag

*Independent.*

The command's \`--out\` becomes \`--to\`; \`--out\` still works, with a warning.
${withBlocks ? `
#### Cases

| Case | Example | What happens | Trace |
|---|---|---|---|
| The new flag | \`build --to a.html\` | writes a.html | you type: build --to a.html; it writes: a.html; you see: ✓ a.html |
| The old flag | \`build --out a.html\` | writes a.html, and warns | you type: build --out a.html; it warns: --out is --to now; it writes: a.html |
| Both | \`build --out a --to b\` | refused | you type: both; it says: one of them |

#### Interface

\`\`\`
reelplanner build <dir>        # build the page
  --to <file>                   # where the page goes
  ✓ a.html · 12 KB
\`\`\`

#### Example

You run \`build --out a.html\`: it warns once, and writes a.html.
` : ""}
### Step 2 — Say it in the help
${withBlocks ? `
*Needs step 1.*

The help text names \`--to\`.

#### Cases

| Case | Example | What happens |
|---|---|---|
| The help | \`build --help\` | shows --to |

No interface: wording only.
` : "\nThe help text names `--to`.\n"}
## Components touched

- **The reel CLI** — the flag (steps 1, 2)

## Open questions for the reviewer

1. **Keep --out working?** (step 1)
Say a script of yours runs \`build --out a.html\`.
- **A · Keep it, with a warning.** Your script still runs, and prints one warning line.
- **B · Drop it.** It stops.
I recommend A: nothing breaks.

## Decisions in force

- **D-001** Reviews go to the inbox: kept. (step 2)
- **D-002** Plain words.
`;

try {
  mkdirSync(repo, { recursive: true });
  git("init", "-q", "-b", "main"); git("config", "user.email", "sam@example.com"); git("config", "user.name", "Sam"); git("config", "commit.gpgsign", "false");
  reel("init", repo, "--name", "demo", "--kind", "greenfield");
  // a word with a special meaning here, which the page marks where it first appears
  writeFileSync(join(rp, "glossary.md"), readFileSync(join(rp, "glossary.md"), "utf8").replace(/\n*$/, "\n") + "| The walkthrough video | — | The video made after the code is built: what was built, step by step | | |\n");
  const sys = json(join(rp, "system.json")); sys.components = [{ id: "cli", name: "The reel CLI", aliases: [] }]; writeFileSync(join(rp, "system.json"), JSON.stringify(sys, null, 2));
  const led = json(join(rp, "decisions.json")); led.decisions.push({ id: "D-001", date: "2026-09-20", plan: "earlier", question: "Where do reviews go?", chosen: "The inbox", why: "one place", status: "active", components: [] }, { id: "D-002", date: "2026-09-20", plan: "earlier", question: "Words?", chosen: "Plain", why: "", status: "active", components: [] });
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(led, null, 2));
  write(join(repo, "src/build.mjs"), "// build\nexport const flag = '--out';\n");
  const start = commit("start");

  // ── the four blocks ──
  const b = stepBlocks(PLAN(true).split("### Step 1 — Rename the flag")[1].split("### Step 2")[0]);
  ok("blocks: a Cases table's rows, each with its trace, in order", b.cases?.rows.length === 3 && b.cases.hasTrace && b.cases.rows[1].trace.map((x) => x.label).join("|") === "you type|it warns|it writes", JSON.stringify(b.cases));
  ok("blocks: an Interface's part, its meaning, a flag under it with its own, and what it prints", b.interface?.parts.length === 1 && b.interface.parts[0].meaning === "build the page" && b.interface.parts[0].subs[0]?.line === "--to <file>" && b.interface.parts[0].subs[0].meaning === "where the page goes" && /a\.html · 12 KB/.test(b.interface.parts[0].out[0] || ""), JSON.stringify(b.interface));
  ok("blocks: the Example, and the step's first italic line as what it needs", /writes a\.html/.test(b.example || "") && b.deps === "Independent.");
  ok("blocks: a trace cell split into beats, a label only where it is one", JSON.stringify(traceBeats("sent: the review; filed → you see it")) === JSON.stringify([{ label: "sent", text: "the review" }, { label: null, text: "filed" }, { label: null, text: "you see it" }]));
  ok("blocks: the steps a line keeps, at its end", JSON.stringify([stepsNamed("… kept. (step 4)"), stepsNamed("… (steps 1, 3)"), stepsNamed("… (steps 1 to 3)."), stepsNamed("… (all steps)"), stepsNamed("… nothing")]) === JSON.stringify([[4], [1, 3], [1, 2, 3], "all", null]));
  ok("blocks: an option gives an example when it has a value, a quote, a command or a number", hasExample("Your script still runs, and prints `one` warning") && !hasExample("It stops."));

  // ── diagrams: the format, drawn as SVG at build time ──
  { const g = parseDiagram("flow: How it builds\nplan.md (file) -> model: steps | the model reads every step\nmodel --> page: sometimes\nmodel -x git: never committed\nmodel = The model | scripts/lib/guide/model.mjs\n// a comment\n");
    ok("diagram: a flow's title, its nodes (a kind, a label, a link) and edges (label, sentence, dashed, refused)", g.kind === "flow" && g.title === "How it builds" && g.nodes.find((n) => n.id === "plan.md")?.shape === "file" && g.nodes.find((n) => n.id === "model")?.label === "The model" && g.nodes.find((n) => n.id === "model").link === "scripts/lib/guide/model.mjs" && g.edges[0].label === "steps" && g.edges[0].text === "the model reads every step" && g.edges[1].style === "dash" && g.edges[2].style === "stop" && !g.errors.length, JSON.stringify(g));
    ok("diagram: a line it cannot read is an error, said with its line", parseDiagram("flow: x\na -> b\nthis is not an edge").errors.some((e) => /^line 3:/.test(e)));
    const d = drawDiagram(g, { id: "t1" });
    const texts = (svg) => [...svg.matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map((m) => m[1]);
    ok("diagram: drawn twice as static SVG, wide and for a phone, each label real text, no NaN, no script", /^<svg class="dg-svg dg-wide"/.test(d.wide) && /^<svg class="dg-svg dg-narrow"/.test(d.narrow) && texts(d.wide).includes("The model") && texts(d.narrow).includes("plan.md") && !/NaN|undefined|<script/.test(d.wide + d.narrow) && /role="group" aria-labelledby="t1-wide-t"/.test(d.wide) && /<title id="t1-wide-t">How it builds<\/title>/.test(d.wide), d.wide.slice(0, 400));
    ok("diagram: a node with a link can be reached from the keyboard, named for what it opens", /data-link="scripts\/lib\/guide\/model\.mjs" tabindex="0" role="link" aria-label="The model: open scripts\/lib\/guide\/model\.mjs"/.test(d.wide));
    ok("diagram: its stages in words, in the order written (the text alternative and the step-through)", d.steppable && d.stages.map((x) => x.words).join(" / ") === "plan.md → The model: steps. the model reads every step / The model → page: sometimes (sometimes) / The model stops at git: never committed", JSON.stringify(d.stages.map((x) => x.words)));
    ok("diagram: labels wrap to their width, a long word cut at a slash", wrap("scripts/lib/guide/a-very-long-name.mjs and more", 90, 13).length >= 3 && wrap("short", 90, 13).length === 1);
    { const b = balance("off-plan, visible, hard to undo, or like a late fix", 200, 14), w = b.map((l) => textWidth(l, 14));
      ok("diagram (round 1, D9): a label's lines balanced, no word alone on its last line", b.length === 2 && b.at(-1).includes(" ") && Math.max(...w) - Math.min(...w) < 40 && balance("frames, narration, storyboard", 200, 14).length === 1, JSON.stringify(b)); }
    // no label on a line, nor on a box, and no word left alone on a label's last line where one more fits there: every
    // flow and state diagram of this repo's plans, wide and on a phone, and a few that crowd (a fan, a loop back, a refusal)
    { const srcs = [];
      const plans = join(ROOT, ".reelplanner", "plans");
      for (const d of existsSync(plans) ? readdirSync(plans) : []) for (const f of ["plan.md", "walkthrough.md"]) { const p = join(plans, d, f); if (existsSync(p)) for (const x of diagramBlocks(readFileSync(p, "utf8"))) srcs.push([`${d}/${f}`, x.src]); }
      srcs.push(["a fan", "flow: A fan\na file -> sequence: .jsonl, .ndjson, .log\na file -> table: .csv, .tsv, a JSON list of rows\na file -> files: anything else, in the repo\na file -> text: anything else, outside it\n"]);
      srcs.push(["a loop back", "flow: Back\nyou -> the video: a question and its sources\nthe video -> check: in the build\nthe video -> Finish: you watch it\ncheck -x the video: a line its source lacks, or a secret\nFinish -> Done: nothing more\nFinish -> Explain more: a new version\nFinish -> Plan this: reel new-plan --from\n"]);
      const bad = [];
      for (const [where, src] of srcs) for (const G of diagramGeometry(src)) for (const L of G.labels) {
        const fits = (t) => textWidth(t, G.labelFont) <= G.labelMax, words = L.lines.join(" ").split(" ");
        const onLine = G.polys.some((P) => P.some((q, i) => i && segHitsBox(P[i - 1], q, L.box)));
        const onBox = G.nodes.some((B) => L.box.x0 < B.x1 && B.x0 < L.box.x1 && L.box.y0 < B.y1 && B.y0 < L.box.y1);
        const alone = L.lines.length > 1 && !L.lines.at(-1).includes(" ") && (fits(L.lines.join(" ")) || (words.length >= 3 && L.lines.at(-2).includes(" ") && fits(`${L.lines.at(-2).split(" ").at(-1)} ${L.lines.at(-1)}`) && textWidth(L.lines.at(-2).split(" ").slice(0, -1).join(" "), G.labelFont) >= textWidth(`${L.lines.at(-2).split(" ").at(-1)} ${L.lines.at(-1)}`, G.labelFont) / 4));
        if (onLine || onBox || alone) bad.push(`${where} (${G.variant}): "${L.lines.join(" / ")}"${onLine ? " on a line" : ""}${onBox ? " on a box" : ""}${alone ? " a word alone" : ""}`);
      }
      ok(`diagram (round 1, D9): no label on a line or a box, no word alone on a last line (${srcs.length} diagrams, wide and on a phone)`, srcs.length > 3 && !bad.length, bad.join("\n"));
      // (round 2, 9): on a phone a drawing is shown at 85 % or more (wider than the column, it scrolls at 85 %), each of its
      // words at 13 px or more, so none reads under 11 px; and a node's name is never cut in two
      const tiny = [], cutWord = [];
      for (const [where, src] of srcs) { const d = drawDiagram(src); for (const svg of d.panels ? d.panels.map((p) => p.narrow) : [d.narrow]) { if (!svg) continue;
        const W = +/width="(\d+)"/.exec(svg)[1], min = /min-width:(\d+)px/.exec(svg), scale = Math.max(Math.min(1, 358 / W), min ? +min[1] / W : 0);
        for (const m of svg.matchAll(/font-size:([\d.]+)px/g)) if (+m[1] * scale < 11) tiny.push(`${where}: ${m[1]} px at ${scale.toFixed(2)}`);
        for (const m of svg.matchAll(/<g class="dg-n[^"]*"[^>]*>[\s\S]*?<\/g>/g)) { const ts = [...m[0].matchAll(/<tspan x[^>]*>([^<]*)<\/tspan>/g)].map((x) => x[1]); ts.slice(0, -1).forEach((t, i) => { if (/[./-]$/.test(t) && !/\s/.test(t.slice(-2)) && /^[a-z]/i.test(ts[i + 1] || "")) cutWord.push(`${where}: "${t}|${ts[i + 1]}"`); }); } } }
      ok(`diagram (round 2, 9): on a phone no word under 11 px, no node's name cut in two (${srcs.length} diagrams)`, !tiny.length && !cutWord.length, [...tiny, ...cutWord].join("\n")); }
    { const back = drawDiagram("flow: Back\na -> b: go\nb -> c: on\nc -x a: refused\n");
      ok("diagram (round 1, D9): a line back goes round the outside, its × at its middle, no underline on a node, a ↗ on a link", /class="dg-e stop back"/.test(back.wide) && /class="dg-stop"/.test(back.wide) && !/text-decoration/.test(back.wide) && /class="dg-lk"[^>]*>↗/.test(drawDiagram("flow: L\na -> b: x\nb = B | #top\n").wide), back.wide.slice(0, 300)); }
    const st = drawDiagram("state: A plan\n[*] -> Draft: new-plan\nDraft -> Approved: approve\nApproved -> Draft: changes\nApproved -> [*]\n");
    ok("diagram: a state diagram's [*] is its start and its end; a cycle is drawn, not refused", /class="dg-dot"/.test(st.wide) && /class="dg-ring"/.test(st.wide) && st.stages[0].words === "It starts at Draft: new-plan" && st.stages.at(-1).words === "From Approved, it ends" && !/NaN/.test(st.wide), JSON.stringify(st.stages));
    const sq = drawDiagram("sequence: Sent\nYou (person) -> Page: a note\nPage -> reel record: the review\nreel record -> decisions.json (file): an entry\nreel record -> reviews/x.md (file): Edits to apply\nnote reel record: the guide only\n");
    ok("diagram: a sequence has a column a participant and a row a message, a note over one; on a phone, too wide, a row a message", /class="dg-life"/.test(sq.wide) && /dg-note/.test(sq.wide) && sq.stages.length === 5 && sq.size.narrow[0] <= 350 && /class="dg-num"/.test(sq.narrow), JSON.stringify(sq.size));
    const cp = drawDiagram("compare: Where it lives\nbefore: planned\nvideo -> details/x.html (file): committed\nafter: built\nvideo -> guide/x.html (file): not committed\n");
    ok("diagram: compare holds a before and an after, each drawn, for the page to toggle", cp.panels?.length === 2 && cp.panels[0].side === "before" && /details\/x\.html/.test(cp.panels[0].wide) && /guide\/x\.html/.test(cp.panels[1].narrow), JSON.stringify(cp).slice(0, 300));
    const sd = stepsDiagram([{ n: 1, title: "Rename the flag", deps: "Independent." }, { n: 2, title: "Say it in the help", deps: "Needs step 1." }]);
    ok("diagram from structure: the steps and what each needs (\"Needs step 1\"), each a link to its step; none when no step needs another", sd?.auto && sd.nodes.find((n) => n.id === "s1")?.link === "#step-1" && sd.stages[0].words === "1. Rename the flag → 2. Say it in the help" && stepsDiagram([{ n: 1, title: "a", deps: "Independent." }, { n: 2, title: "b" }]) === null, JSON.stringify(sd?.stages));
    const texts2 = { "src/a.mjs": 'import { b } from "./lib/b.mjs";\nconst x = await import("./c.mjs");', "src/lib/b.mjs": 'export const b = 1;', "src/c.mjs": 'import "node:fs";' };
    ok("diagram from structure: which file imports which, among a set, from their own import lines", JSON.stringify(importsAmong(Object.keys(texts2), (p) => texts2[p]).map((e) => `${e.from}>${e.to}`)) === JSON.stringify(["src/a.mjs>src/lib/b.mjs", "src/a.mjs>src/c.mjs"])); }

  // ── worked examples and the depth, written for the guide ──
  { const FG = "# x\n\n## For the guide\n\n*Written after the build, for the guide.*\n\n**In one sentence:** it renames a flag.\n\n```diagram\nflow: All of it\na -> b\n```\n\n### For step 1 — Rename\n\n```diagram\nflow: Which flag wins\n--to -> a.html (file): written\n```\n\n#### Worked examples\n\n##### The old flag\n- **Input:** `reelplanner build site --out a.html`\n- **What happens:** it warns,\n  and writes a.html.\n- **Predict:** does it write a.html?\n- **Output:** `runs/build.txt` (lines 2-3)\n- **Edge cases:**\n  - both flags: refused\n  - neither:\n    the default\n\n#### Why it works this way\n\nOld scripts keep running.\n\n## Next\n";
    const f = forGuideOf(FG), e = f.steps[1]?.examples[0];
    ok("for the guide: its note, its overview diagram, a step's diagram, worked example and depth (### For step N, never ### Step N)", f.note === "Written after the build, for the guide." && f.overview.diagrams.length === 1 && f.steps[1].diagrams.length === 1 && f.steps[1].depth[0]?.head === "Why it works this way" && !withoutForGuide(FG).includes("Which flag wins") && withoutForGuide(FG).includes("## Next"), JSON.stringify(f).slice(0, 600));
    ok("for the guide: an example's input, what happens, its prediction, its run with the lines kept in view, its edge cases a line each", e?.name === "The old flag" && e.input === "`reelplanner build site --out a.html`" && /warns,\nand writes/.test(e.happens) && e.predict === "does it write a.html?" && JSON.stringify(e.runs) === JSON.stringify([{ name: "runs/build.txt", from: 2, to: 3 }]) && JSON.stringify(e.edges) === JSON.stringify(["both flags: refused", "neither: the default"]), JSON.stringify(e));
    ok("for the guide: before and after, toggled on the page", (() => { const x = parseExample("x", "- **Before:** `--out`\n- **After:** `--to`\n"); return x.before === "`--out`" && x.after === "`--to`"; })()); }

  // ── what a step lets you do, a short phrase: the author's line, else a sentence said to you, else none ──
  ok("what it lets you do: the step's `**You can now:**` line, whole, capitalised", canLine("- x\n\n**You can now:** click something in the video to jump to its part,\nand back.\n\n- y") === "Click something in the video to jump to its part, and back" && canLine("**It lets you:** see `--to` in the help") === "See `--to` in the help" && canLine("nothing here") === null);
  ok("what it lets you do: a sentence that says it to you, cut at its first clause; never one that says what you can't", youPhrase("The same player. You answer, comment and edit right in the page, and it all goes out in the same review.") === "Answer, comment and edit right in the page" && youPhrase("You can't easily undo it: a format.") === null && youPhrase("You'd notice it.") === null && youPhrase("It writes a.html.") === null, JSON.stringify([youPhrase("The same player. You answer, comment and edit right in the page, and it all goes out in the same review."), youPhrase("You can't easily undo it: a format.")]));
  ok("what it lets you do: the line said beats a sentence found; none is null", canOf({ built: "**You can now:** run it twice.", lead: "You type less." })?.from === "said" && canOf({ lead: "You type less and see more." })?.text === "Type less and see more" && canOf({ lead: "It writes a.html." }) === null);
  { const t = thinOf({ can: [{ n: 1, can: null }, { n: 2, can: { text: "x" } }], built: { runs: { a: 1 }, cats: [1] }, summary: "s", asked: {}, steps: [] });
    ok("what it lets you do: a step with no phrase is listed as what the walkthrough should add", t.some((x) => /^What step 1 lets you do, as a short phrase/.test(x.what) && x.where === "walkthrough.md"), JSON.stringify(t)); }

  // ── round 1's readers: where a run was made, what it wrote, the choices counted once ──
  { const sc = scratchOf("x\n\n**Ran in a scratch repo:** `runs/pr-*.txt`, `runs/rec.txt` — a repo with an origin.\n\ny");
    ok("scratch runs: the For the guide line names the runs (globs too) and the setup; every run, said so", sc?.runs.length === 2 && sc.setup === "a repo with an origin." && inScratch(sc, "runs/pr-small.txt") && !inScratch(sc, "runs/build.txt") && scratchOf("**Ran in a scratch repo:** every run in `runs/` — as the spec sets it up")?.all === true, JSON.stringify(sc));
    const has = (p) => !/2026-10-09-gone/.test(p);
    ok("scratch runs: a run is from a scratch repo when the line says so, its note says so, or it names a plan this repo does not have", whereRan({ name: "runs/rec.txt", cmd: "reel record x", text: "" }, { scratch: sc, inScratch, has }).scratch && whereRan({ name: "runs/a.txt", cmd: "reel check .reelplanner/plans/2026-10-09-gone", text: "" }, { has }).why === "path" && whereRan({ name: "runs/b.txt", cmd: "reel stops .   (a scratch repo: two plans)", text: "" }, { has }).why === "note" && !whereRan({ name: "runs/c.txt", cmd: "reel stops .reelplanner/plans/2026-09-01-here", text: "" }, { has }).scratch);
    ok("\"It writes\": only the file a run's own ✓ line starts with, never a name in what it printed", wroteOf("$ build\n✓ out/a.html · 12 KB\nexit 0") === "out/a.html" && wroteOf("$ grep -n guide x.json\n12: \"src\": \"guide/step-1.html\"\nexit 0") === null && wroteOf("$ check-details x\n✓ check-details: 3 page(s) ok: a.html, b.html\nexit 0") === null);
    const since = sinceOf("#### Since then\n\n- **Open point: who `owner` is**: answered in code (`abc1234`).\n\n**In one sentence:** x");
    // round 3: the record's words said plainly, a step's opening line, a later plan's Supersedes line
    const pl = plainOf("#### In plain words\n\n- **A12**: each kind of change is one line,\n  its name first\n- **Step 5**, with Not done's **Hand-built things**: Step 5 is built except two things.\n- **13 calls**: 13 choices\n\n**In one sentence:** x");
    ok("in plain words (round 3): an item a line, headed by what it says again; a short step names the Not done lines said with it", pl.length === 3 && pl[0].head === "A12" && pl[0].md === "each kind of change is one line, its name first" && pl[1].head === "Step 5" && pl[1].also.join() === "Hand-built things" && /^Step 5 is built except/.test(pl[1].md) && pl[2].head === "13 calls" && !pl.some((x) => /one sentence/.test(x.md)), JSON.stringify(pl));
    const ch = parseChunk("**In short:** the box now reads\n\"you'd notice\".\n\n```diagram\nflow: x\na -> b\n```\n\n#### Why it works this way\n\nIt does.\n");
    ok("a step's In short (round 3): its opening line on the Built side, taken out of the words before its diagram", ch.lead === "the box now reads \"you'd notice\"." && ch.intro === "" && ch.diagrams.length === 1 && ch.depth[0]?.head === "Why it works this way", JSON.stringify(ch));
    { const later = join(tmp, "later-plan"); mkdirSync(later, { recursive: true });
      writeFileSync(join(later, "plan.md"), "# Later\n\n## Supersedes\n\n- **D-083** \"How many checks?\" For the walkthrough only, replaced by step 3's check.\n- **D-214** \"When does a PR need a video? Choices or size only.\" Narrowed for small pull requests (step 4).\n\n## Not in this plan\n\n- x\n");
      const a = supersedesLine(later, "D-214"), b2 = supersedesLine(later, "D-083"), c3 = supersedesLine(later, "D-001");
      ok("supersedes (round 3): a later plan's own line for a decision it replaced or narrowed: its words and the step it names", a?.words === "Narrowed for small pull requests" && a.step === 4 && b2?.step === 3 && /^For the walkthrough only, replaced by/.test(b2.words) && c3 === null, JSON.stringify({ a, b2, c3 })); }
    ok("since then: a Not done line settled later, named by its bold lead; the block ends where its list does", since.length === 1 && since[0].head === "Open point: who `owner` is" && /abc1234/.test(since[0].md) && !/one sentence/.test(since[0].md), JSON.stringify(since));
    const calls = [{ id: "A1", tags: ["visible"] }, { id: "A2", tags: [] }, { id: "A3", tags: [] }, { id: "D1", tags: [] }, { id: "m1", tags: [] }];
    const K = choiceCounts(choicesOf(calls, null, [{ kind: "choices", ids: ["A1"] }, { kind: "choices", ids: ["D1"] }, { kind: "shown", ids: ["A3"] }, { kind: "list", ids: ["A2"] }]));
    ok("the choices, counted once: those the video pauses on, shows without a pause, lists at the end, and those only on the page", K.total === 5 && K.pause.join() === "A1,D1" && K.shown.join() === "A3" && K.list.join() === "A2" && K.only.join() === "m1" && K.look.join() === "A1,D1" && K.video, JSON.stringify(K));
    ok("a step's lead: past its \"*Stands alone; …*\" line, several lines long, and no stray star", firstSentence("*Stands alone; its checks run in CI\nwith step 5.*\n\nThe checks run in CI. More.") === "The checks run in CI." && !/\*/.test(firstSentence("*Stands alone; its checks run in CI with step 5. And more")), firstSentence("*Stands alone; its checks run in CI with step 5. And more")); }

  // ── reel check: the blocks, on a plan written since they were asked for ──
  write(join(tmp, "plan-bare.md"), PLAN(false));
  reel("new-plan", repo, "bare", "--plan", join(tmp, "plan-bare.md"), "--date", "2026-10-01");
  const bare = join(rp, "plans", "2026-10-01-bare");
  const cb = reel("check", bare);
  ok("reel check: a new plan's step with no Cases table, or no Interface, fails", cb.code === 1 && /step 1 has no Cases table/.test(cb.out) && /step 1 has no Interface block/.test(cb.out) && /step 2 has no Cases table/.test(cb.out), cb.out);
  ok("reel check: an open question's option with no example fails", /question 1's option B has no example/.test(cb.out), cb.out);
  write(join(tmp, "plan-full.md"), PLAN(true));
  reel("new-plan", repo, "flag", "--plan", join(tmp, "plan-full.md"), "--date", "2026-10-01");
  const pd = join(rp, "plans", "2026-10-01-flag");
  // the question's option B, given its example
  writeFileSync(join(pd, "plan.md"), readFileSync(join(pd, "plan.md"), "utf8").replace("- **B · Drop it.** It stops.", "- **B · Drop it.** Your script stops with `unknown flag --out`."));
  const cf = reel("check", pd);
  ok("reel check: the four blocks written, it passes; a case with no trace, a part with no meaning, a decision with no step are warnings", cf.code === 0 && /step 2 · case 1: no trace/.test(cf.out) && /D-002: no step/.test(cf.out) && !/step 1 · case/.test(cf.out), cf.out);
  ok("reel check (D-265): a new plan's step with no diagram is a warning, never a failure", cf.code === 0 && /step 1: no diagram/.test(cf.out) && /step 2: no diagram/.test(cf.out), cf.out);
  mkdirSync(join(rp, "plans", "2026-09-20-old"), { recursive: true }); writeFileSync(join(rp, "plans", "2026-09-20-old", "plan.md"), PLAN(false));
  const co = reel("check", join(rp, "plans", "2026-09-20-old")), cob = reel("check", join(rp, "plans", "2026-09-20-old"), "--blocks");
  ok("reel check: an older plan is not held to the blocks; --blocks holds it", co.code === 0 && /four blocks not held to/.test(co.out) && cob.code === 1 && /no Cases table/.test(cob.out), `${co.out}\n${cob.out}`);

  // ── a built plan: its video, walkthrough.md, commits, runs ──
  write(join(repo, "src/build.mjs"), "// build\nexport const flag = '--to';\nexport const old = '--out';\n"); const c1 = commit("Rename the flag, step 1: --to");
  write(join(repo, "docs/help.md"), "# help\n\n--to <file>: where the page goes\n"); const c2 = commit("Rename the flag, step 2: the help");
  const vd = join(pd, "video");
  const frames = [
    { index: 1, title: "The flag", compositionId: "01-flag", durationSeconds: 10, start: 0, planStep: null, narration: "A flag that says where, and a flag that says what." },
    { index: 2, title: "Step 1: the new flag", compositionId: "02-step-1", durationSeconds: 12, start: 10, planStep: 1, narration: "Step one renames the flag, and the old one still works." },
    { index: 3, title: "Step 2: the help", compositionId: "03-step-2", durationSeconds: 8, start: 22, planStep: 2, narration: "Step two says it in the help." },
  ];
  write(join(vd, "STORYBOARD.md"), `---\nplan_dir: .reelplanner/plans/2026-10-01-flag\ndetails_check: strict\n---\n\n## Frame 1 — The flag\n\n- voiceover: "x"\n\n## Frame 2 — Step 1: the new flag\n\n- plan_step: 1\n- guide: step-1#cases\n\n## Frame 3 — Step 2: the help\n\n- plan_step: 2\n- guide: step-2\n`);
  write(join(vd, "compositions/frames/02-step-1.html"), `<div data-band="bottom"><table data-detail="step-1"><tr><td>--to</td></tr></table></div>\n`);
  write(join(vd, "compositions/frames/03-step-2.html"), `<div data-band="bottom"><p>the help</p></div>\n`);
  write(join(vd, "plan-map.json"), JSON.stringify({ project: "video", title: "Rename the flag", planDir: ".reelplanner/plans/2026-10-01-flag", totalSeconds: 30, frames, decisions: [{ id: "q1", question: "Keep --out working?", planStep: 1, options: [{ id: "a", label: "Keep it, with a warning", recommended: true }, { id: "b", label: "Drop it" }] }], details: [] }, null, 2));
  write(join(pd, "runs", "build.txt"), "$ reelplanner build site --to a.html\n✓ a.html · 12 KB\nexit 0\n");
  write(join(pd, "walkthrough.md"), `# Walkthrough: Rename the flag\n\n**Started from:** \`${start}\` · **Commits:** ${c1} ${c2}\n\n## Categories of change\n\n- **The flag** {flag} (\`src/\`) (step 1): \`--to\` is the flag; \`--out\` still works.\n  Runs: \`runs/build.txt\`\n- **The help** (\`docs/help.md\`) (step 2): the help names \`--to\`.\n\n## What was done, per step\n\n### Step 1 — Rename the flag ✅\n\n**You can now:** write \`--to\` where you wrote \`--out\`, and old scripts still run.\n\n- \`--to\` in \`src/build.mjs\`.\n\n#### Interface as built\n\n\`\`\`\nreelplanner build <dir>   # build the page\n  --to <file>              # where the page goes\n\`\`\`\n\n### Step 2 — Say it in the help ⏳\n\nThe help, next.\n\n## Choices the plan did not specify\n\n| # | Step | Chose | Instead of | Why | Where to check |\n|---|---|---|---|---|---|\n| A1 | 1 | a warning once per run [visible] | every time | quieter | \`src/build.mjs\` |\n\n## For the guide\n\n*Written after the build, for the guide.*\n\n### For step 1 — Rename the flag\n\n\`\`\`diagram\nflow: Which flag wins\nbuild --to a.html -> a.html (file): written | the new flag writes the page\nbuild --out a.html -> a warning: once\na warning -> a.html: written anyway\na.html = a.html | src/build.mjs\n\`\`\`\n\n#### Worked examples\n\n##### The new flag\n- **Input:** \`reelplanner build site --to a.html\`\n- **What happens:** it writes a.html.\n- **Predict:** what does it print?\n- **Output:** \`runs/build.txt\`\n\n##### Both flags\n- **Input:** \`build --out a --to b\`\n- **What happens:** refused.\n- **Edge cases:**\n  - the old flag alone warns\n\n#### Why it works this way\n\nOld scripts keep running.\n`);
  const wt = readWalkthrough(join(pd, "walkthrough.md"));
  ok("walkthrough.md: its commits, its categories (an id of its own, paths, steps, runs), each step's Interface as built", wt.commits.join(" ") === `${c1} ${c2}` && wt.categories[0].id === "flag" && wt.categories[0].paths[0] === "src/" && wt.categories[0].steps[0] === 1 && wt.categories[0].runs[0] === "runs/build.txt" && wt.categories[1].id === "help" && wt.steps[0].ifaceBuilt?.parts.length === 1 && wt.steps[1].status === "waiting", JSON.stringify(wt.categories));
  ok("walkthrough.md: a category claims a file, a folder or a glob", pathIn("src/build.mjs", ["src/"]) && pathIn("docs/a/b.md", ["docs/**/*.md"]) && !pathIn("docs/a.mjs", ["docs/*.md"]));
  // the plan map says the scenes' parts: a real video of this repo's, copied (its storyboard's `- guide:` tags)
  { const name = "2026-09-27-walkthroughs-that-help", from = join(ROOT, ".reelplanner", "plans", name), to = join(rp, "plans", name);
    for (const f of ["plan.md", "walkthrough.md", "video/STORYBOARD.md", "video/index.html", "video/audio_meta.json", "video/compositions"]) execFileSync("cp", ["-r", join(from, f), join(to, f)], { stdio: "ignore" }, mkdirSync(join(to, f, ".."), { recursive: true }));
    const pm = run("plan-map.mjs", join(to, "video")), map = json(join(to, "video", "plan-map.json")), d1 = map.details?.find((d) => d.name === "step-1");
    ok("plan-map: a scene's `- guide:` opens its part over the frame (guide/<part>.html), with the why its kind of part gives", pm.code === 0 && d1?.src === "guide/step-1.html" && d1.guide === true && d1.planStep === 1 && /every case/.test(d1.why || "") && map.frames.find((f) => f.index === d1.frameIndex)?.detail === "step-1" && map.guide?.parts.some((p) => p.name === "pauses" && p.src === "guide/pauses.html"), `${pm.out}\n${JSON.stringify(map.details)}`); }
  write(join(vd, "plan-map.json"), JSON.stringify({ project: "video", title: "Rename the flag", planDir: ".reelplanner/plans/2026-10-01-flag", totalSeconds: 30, frames: frames.map((f) => ({ ...f, ...(f.index === 2 ? { guide: "step-1#cases", detail: "step-1" } : f.index === 3 ? { guide: "step-2", detail: "step-2" } : {}) })), decisions: [{ id: "q1", question: "Keep --out working?", planStep: 1, options: [{ id: "a", label: "Keep it, with a warning", recommended: true }, { id: "b", label: "Drop it" }] }],
    details: [{ name: "step-1", src: "guide/step-1.html#step-1-cases", guide: true, kind: "guide", frameIndex: 2, planStep: 1, start: 10, end: 22 }, { name: "step-2", src: "guide/step-2.html", guide: true, kind: "guide", frameIndex: 3, planStep: 2, start: 22, end: 30 }] }, null, 2));

  // ── the guide ──
  const g = run("guide.mjs", pd, "--no-thumbs");
  const gd = join(vd, "guide"), parts = existsSync(join(gd, "parts.json")) ? json(join(gd, "parts.json")) : null;
  ok("guide: a plan folder builds its video's guide: the full page and each part", g.code === 0 && existsSync(join(gd, "index.html")) && ["step-1", "step-2", "decisions", "what-changed", "flag", "help", "choices"].every((p) => existsSync(join(gd, `${p}.html`))), `${g.out}\n${JSON.stringify(parts?.parts)}`);
  const html = readFileSync(join(gd, "index.html"), "utf8"), data = JSON.parse(html.match(/<script type="application\/json" id="guide-data">([\s\S]*?)<\/script>/)[1]);
  const s1 = data.steps[0];
  ok("guide: a step's cases with their traces, its interface parts, its example, its question, from plan.md", s1.cases.rows.length === 3 && s1.cases.rows[0].trace.length === 3 && s1.iface.parts[0].subs.length === 1 && /writes a\.html/.test(s1.example) && s1.questions[0]?.options.length === 2, JSON.stringify(s1).slice(0, 800));
  ok("guide: the Built side from git: each category's files and diffs, the run as it ran, the step's calls", data.built.cats.find((c) => c.id === "flag")?.files[0]?.path === "src/build.mjs" && data.built.cats.find((c) => c.id === "flag").files[0].commits[0].hunks.length > 0 && data.built.cats.find((c) => c.id === "flag").files[0].whole?.mark.length > 0 && data.built.runs["runs/build.txt"]?.exit === 0 && s1.choices[0] === "A1", JSON.stringify(data.built.cats).slice(0, 600));
  ok("guide: a decision in force goes under its step; one with no step is a gap on the page", data.steps[1].inForce[0]?.ids[0] === "D-001" && data.gaps.some((x) => x.where === "D-002" && x.what === "no step") && data.gaps.some((x) => /step 2 · case 1/.test(x.where)), JSON.stringify(data.gaps));
  const R = data.reader;
  ok("guide: what each step lets you do, from walkthrough.md's line; a step still waiting has none, and is not listed as missing", data.steps[0].can?.text === "Write `--to` where you wrote `--out`, and old scripts still run" && data.steps[0].can.from === "said" && data.steps[1].can === null && !R.thin.some((x) => /lets you do, as a short phrase/.test(x.what)), JSON.stringify({ c: data.steps.map((s) => s.can), t: R.thin }));
  ok("guide: what it is, from the title (its name and promise) and why, from the problem's quote", R.name === "Rename the flag" && R.promise === "--out becomes --to" && (R.asked === null || typeof R.asked.quote === "string"), JSON.stringify({ name: R.name, promise: R.promise, asked: R.asked }));
  ok("guide: how to try it: the command that ran (runs/), with what it wrote; the build's own line for the same command left out", R.tryIt.find((x) => x.from === "ran")?.cmd === "reelplanner build site --to a.html" && R.tryIt.find((x) => x.from === "ran").exit === 0 && R.tryIt.find((x) => x.from === "ran").wrote === "a.html" && !R.tryIt.some((x) => x.from === "built" && x.cmd === "reelplanner build <dir>"), JSON.stringify(R.tryIt));
  ok("guide: the agent's choice worth a look says why in plain words; what the plan does not say is listed as what to add", R.choices.find((c) => c.id === "A1")?.look && R.choices.find((c) => c.id === "A1").why === "You'll notice it" && R.thin.some((x) => /trace for each case/.test(x.what)), JSON.stringify({ c: R.choices, t: R.thin }));
  const dep = data.steps[0].depth;
  ok("guide (D-265): a step's diagram drawn from walkthrough.md's For the guide, its examples with their runs, its depth; the auto diagram of the steps", dep?.diagrams.length === 1 && /dg-wide/.test(dep.diagrams[0].wide) && dep.examples.length === 2 && dep.examples[0].runs[0]?.name === "runs/build.txt" && data.exRuns["runs/build.txt"]?.exit === 0 && dep.depth[0]?.head === "Why it works this way" && data.auto.steps?.stages.length === 1 && !data.gaps.some((g) => /^step 1$/.test(g.where) && /no diagram/.test(g.what)) && data.gaps.some((g) => g.where === "step 2" && /no diagram/.test(g.what)), JSON.stringify({ dep: dep && { d: dep.diagrams.length, e: dep.examples.length }, gaps: data.gaps.filter((g) => /step [12]$/.test(g.where)) }));
  ok("guide: nothing committed (the video's guide/ is left out of git)", !git("status", "--porcelain").includes("guide/") || /^plans\/\*\/\*video\/guide\/$/m.test(readFileSync(join(ROOT, "templates", "reelplanner", "gitignore"), "utf8")));
  ok("guide: each plan.md paragraph listed for the check", paragraphsOf(PLAN(true)).some((p) => /The flag says where/.test(p)) && paragraphsOf(PLAN(true)).some((p) => /The new flag/.test(p)));

  // --check in a browser: passes; then a run the category names that runs/ does not hold fails, and so does the narration said again
  let chromium = null; try { ({ chromium } = await import("playwright-core")); } catch {}
  if (chromium) {
    const c = run("guide.mjs", vd, "--check", "--no-thumbs");
    ok("guide --check: passes on a guide made from its sources", c.code === 0 && /every heading and paragraph of plan\.md in the page/.test(c.out) && /each opens its layer, each by a visible control/.test(c.out), c.out);
    // the page reads in the order a person asks, in plain words: no stat line first, the questions as its headings
    { const b = await chromium.launch(launchOpts()); try { const pg = await b.newPage({ viewport: { width: 900, height: 900 } }); await pg.route(/^(https?|wss?):/, (r) => r.abort());
      await pg.goto(pathToFileURL(join(gd, "index.html")).href); await pg.waitForTimeout(150);
      const got = await pg.evaluate(() => ({ can: [...document.querySelectorAll(".inshort ul.can li")].map((x) => x.textContent.trim()), words: (() => { const d = document.querySelector("details#words"); return d ? { open: d.open, summary: d.querySelector("summary").textContent } : null; })(), marks: document.querySelectorAll(".gw").length, h1: document.querySelector("h1")?.textContent, promise: document.querySelector(".promise")?.textContent, heads: [...document.querySelectorAll("section.q > h2")].map((x) => x.textContent), text: document.querySelector("main").innerText, short: !!document.querySelector(".inshort"), codeFolded: !!document.querySelector("details.code:not([open])"), watch: document.querySelectorAll("a.wm[href*='t=']").length }));
      const want = ["What it would let you do", "How you would try it", "What's already decided, and why", "What needs you", "What it leaves out", "Where it would change the code"];
      ok("guide page: the reader's questions in order, each a heading (then, once built, the agent's choices and the code, the diff folded)", got.h1 === "Rename the flag" && /--out becomes --to/.test(got.promise || "") && want.every((w, i) => got.heads[i] === w) && got.heads.includes("Where the code is") && got.short && got.codeFolded && got.watch > 0, JSON.stringify(got.heads));
      ok("guide page: In short says what each step lets you do, a phrase each (its title where there is none)", /^Write --to where you wrote --out, and old scripts still run\s*step 1$/.test(got.can[0] || "") && /^Say it in the help \(still waiting\)\s*step 2$/.test(got.can[1] || ""), JSON.stringify(got.can));
      ok("guide page: the words with a special meaning are one folded line, each marked where it first appears", !!got.words && (!got.words.open && /words? here (has|have) a special meaning/.test(got.words.summary) && /Show (them|it)/.test(got.words.summary) && got.marks > 0), JSON.stringify({ w: got.words, m: got.marks }));
      { await pg.locator(".gw").first().click(); await pg.waitForTimeout(80);
        const tipGot = await pg.evaluate(() => { const t = document.querySelector(".gtip"), g = document.querySelector(".gw"); return { shown: !!t && !t.hidden, text: t?.textContent || "", exp: g.getAttribute("aria-expanded") }; });
        ok("guide page: a tap on a marked word shows its meaning under it, and a link to all of them", tipGot.shown && tipGot.exp === "true" && /Every word with a special meaning here/.test(tipGot.text) && tipGot.text.length > 40, JSON.stringify(tipGot));
        await pg.keyboard.press("Escape"); ok("guide page: Escape closes the meaning", await pg.evaluate(() => document.querySelector(".gtip").hidden)); }
      { const dg = await pg.evaluate(() => { const f = document.querySelector("#step-1 figure.dg"); return f && { svg: !!f.querySelector("svg.dg-wide text tspan"), stepper: !!f.querySelector("[data-dgstep=start]"), words: f.querySelector(".dg-words")?.textContent || "", selectable: getComputedStyle(f.querySelector("svg text")).userSelect }; });
        ok("guide page: a step's diagram, inline SVG with its labels as text, a step-through, its words folded under it", dg?.svg && dg.stepper && /the new flag writes the page/i.test(dg.words) && dg.selectable !== "none", JSON.stringify(dg));
        await pg.click("#step-1 figure.dg [data-dgstep=start]"); await pg.click("#step-1 figure.dg [data-dgstep=next]");
        const on = await pg.evaluate(() => { const f = document.querySelector("#step-1 figure.dg"); return { stepping: f.classList.contains("stepping"), on: [...f.querySelectorAll("svg.dg-wide .dg-e.on")].map((e) => e.dataset.from), now: f.querySelector(".dg-now").textContent, row: f.querySelector(".dg-cap > p.on")?.textContent || "", mark: f.querySelector("svg.dg-wide .dg-mk text")?.textContent }; });
        ok("guide page: stepping through lights one stage and says it in a sentence, in a row under the drawing, its number on the lit line", on.stepping && on.on.join() === "build --out a.html" && /^Once, from build --out a\.html to a warning\.$/.test(on.now) && /^2\s*Once, from build --out a\.html to a warning\.$/.test(on.row) && on.mark === "2", JSON.stringify(on));
        // (round 2 of the guide's review, 1): the caption is never over the drawing: at every stage, it covers no box and no
        // label of it; the stage's number sits on its line clear of every box and label; the control never changes width
        { const w0 = await pg.evaluate(() => document.querySelector("#step-1 figure.dg .dg-sc").getBoundingClientRect().width);
          const bad = [], seen = [];
          await pg.click("#step-1 figure.dg [data-dgstep=all]"); await pg.click("#step-1 figure.dg [data-dgstep=start]");
          for (let k = 0; k < 3; k++) {
            if (k) await pg.click("#step-1 figure.dg [data-dgstep=next]");
            seen.push(await pg.evaluate(() => document.querySelector("#step-1 figure.dg .dg-sc").getBoundingClientRect().width));
            bad.push(...await pg.evaluate(() => { const f = document.querySelector("#step-1 figure.dg"), svg = [...f.querySelectorAll(".dg-v svg")].find((x) => x.getBoundingClientRect().width), out = [];
              const cap = f.querySelector(".dg-cap > p.on").getBoundingClientRect(), mk = svg.querySelector(".dg-mk circle")?.getBoundingClientRect();
              const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
              for (const el of svg.querySelectorAll(".dg-n rect, .dg-la text")) { const r = el.getBoundingClientRect(); if (hit(cap, r)) out.push(`caption over ${el.textContent || el.parentNode.textContent}`); if (mk && hit(mk, r)) out.push(`the stage's number over ${el.textContent || el.parentNode.textContent}`); }
              if (!mk) out.push("no number on the lit line"); return out; }));
          }
          ok("guide page (round 2): the stage in words never covers a box or a label, its number on its line clear of them; the control keeps its width", !bad.length && seen.every((w) => Math.abs(w - w0) < 1), JSON.stringify({ bad, w0, seen })); }
        const ex = await pg.evaluate(() => { const b = document.querySelector("#step-1-examples"); return b && { tabs: [...b.querySelectorAll("[role=tab]")].map((t) => t.textContent), shown: [...b.querySelectorAll(".ex-p")].map((p) => !p.hidden), out: !!document.querySelector("#step-1-ex-1-out")?.hidden }; });
        ok("guide page: worked examples a tab a case, the first shown, its real output waiting for a click", ex && ex.tabs.join("|") === "The new flag|Both flags" && ex.shown.join() === "true,false" && ex.out, JSON.stringify(ex));
        await pg.click("#step-1-examples [role=tab]:nth-child(2)"); await pg.click('#step-1-ex-1 [data-reveal]').catch(() => {});
        const ex2 = await pg.evaluate(() => ({ shown: [...document.querySelectorAll("#step-1-examples .ex-p")].map((p) => !p.hidden), out: document.querySelector("#step-1-ex-1-out")?.textContent || "" }));
        ok("guide page: another case's tab shows it; the output, revealed, is the saved run", ex2.shown.join() === "false,true", JSON.stringify(ex2));
        await pg.click("#step-1-examples [role=tab]:nth-child(1)"); await pg.click("#step-1-ex-1 [data-reveal]");
        ok("guide page: the saved run, whole", /✓ a\.html · 12 KB/.test(await pg.evaluate(() => document.querySelector("#step-1-ex-1-out").textContent))); }
      { const t = await pg.evaluateHandle(() => [...document.querySelectorAll("pre.term")].find((e) => e.offsetParent && e.getBoundingClientRect().height > 0) || null);
        const el = t.asElement();
        if (!el) ok("guide page (round 1, D1): a terminal is on the page to hover", false);
        else { await el.scrollIntoViewIfNeeded(); const rest = await el.evaluate((e) => getComputedStyle(e).backgroundColor); await el.hover(); await pg.waitForTimeout(60);
          const hov = await el.evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, hovered: e.matches(":hover") }));
          ok("guide page (round 1, D1): a hovered terminal keeps its background (a mark in the gutter, never a repaint)", hov.hovered && hov.bg === rest && !/rgba\(0, 0, 0, 0\)|transparent/.test(hov.bg), JSON.stringify({ rest, hov })); } }
      // (round 2 of the guide's review, 3 and 9): on a phone, a command to copy wraps whole beside its Copy, never cut under
      // it; a diagram is never drawn so small that a label reads under 11 px
      { await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true))); await pg.waitForTimeout(200);
        const ph = await pg.evaluate(() => {
          const cut = [...document.querySelectorAll(".ex-in pre, .cmdline code")].filter((c) => c.getClientRects().length).flatMap((c) => { const r = c.getBoundingClientRect(), cp = c.parentElement.querySelector(".copy")?.getBoundingClientRect();
            return c.scrollWidth > c.clientWidth + 1 || (cp && r.right > cp.left + 1) ? [c.textContent.slice(0, 60)] : []; });
          const cmds = document.querySelectorAll(".ex-in pre, .cmdline code").length, small = [];
          for (const svg of document.querySelectorAll(".dg-v svg")) { const w = svg.getBoundingClientRect().width; if (!w) continue; const s = w / +svg.getAttribute("width");
            for (const t of svg.querySelectorAll("text")) { const px = parseFloat(getComputedStyle(t).fontSize) * s; if (px < 11 - 0.01) small.push(`${t.textContent.slice(0, 24)}: ${px.toFixed(1)} px`); } }
          return { cut, cmds, small, drawn: [...document.querySelectorAll(".dg-v svg")].filter((x) => x.getBoundingClientRect().width).length };
        });
        ok("guide page (round 2): on a phone no command to copy is cut under its Copy", ph.cmds > 0 && !ph.cut.length, JSON.stringify(ph));
        ok("guide page (round 2): on a phone no diagram label reads under 11 px", ph.drawn > 0 && !ph.small.length, JSON.stringify(ph));
        await pg.setViewportSize({ width: 900, height: 900 }); }
      ok("guide page: no count line or internal word on the first layer", !/interface parts? ·|kinds? of change|\bbeats?\b|\blayers?\b|\bgaps?\b/i.test(got.text), got.text.match(/.{0,40}(interface parts? ·|kinds? of change|\bbeats?\b|\blayers?\b|\bgaps?\b).{0,40}/i)?.[0]);
    } finally { await b.close(); } }
    writeFileSync(join(pd, "walkthrough.md"), readFileSync(join(pd, "walkthrough.md"), "utf8").replace("Runs: `runs/build.txt`", "Runs: `runs/build.txt`, `runs/typed-in.txt`"));
    const map2 = json(join(vd, "plan-map.json")); map2.frames[1].narration = "The new flag writes a.html, and the old flag still writes it too."; writeFileSync(join(vd, "plan-map.json"), JSON.stringify(map2));
    // the plan's example, shown on the plan video's first layer, made the narration's sentence
    writeFileSync(join(pd, "plan.md"), readFileSync(join(pd, "plan.md"), "utf8").replace("You run `build --out a.html`: it warns once, and writes a.html.", "The new flag writes a.html, and the old flag still writes it too."));
    writeFileSync(join(pd, "walkthrough.md"), readFileSync(join(pd, "walkthrough.md"), "utf8").replace("- **Output:** `runs/build.txt`", "- **Output:** `runs/never-saved.txt`"));
    const c2x = run("guide.mjs", vd, "--check", "--no-thumbs");
    ok("guide --check (D-265): an example naming a run runs/ does not hold fails", c2x.code === 1 && /step 1 · example "The new flag": names runs\/never-saved\.txt, which is not in runs\//.test(c2x.out), c2x.out);
    ok("guide --check: a run shown as real that runs/ does not hold fails", c2x.code === 1 && /runs\/typed-in\.txt, which is not in runs\//.test(c2x.out), c2x.out);
    ok("guide --check: a first layer that says the narration again fails", /says scene 2's sentence again/.test(c2x.out), c2x.out);

    // ── round 1's readers, on a walkthrough video: its stops, the choices counted once, the code check whole, fences,
    //    scratch runs, a Not done line settled since, the reference folds left out of Open everything ──
    {
      // back to a guide that passes (the runs named are real again), then more of a walkthrough: choices of every kind,
      // a code check and Not done, a fence under a list item, a scratch run, a decision replaced since
      const wtp = join(pd, "walkthrough.md");
      writeFileSync(wtp, readFileSync(wtp, "utf8").replace(", `runs/typed-in.txt`", "").replace("runs/never-saved.txt", "runs/build.txt")
        .replace("| A1 | 1 | a warning once per run [visible] | every time | quieter | `src/build.mjs` |", ["| A1 | 1 | a warning once per run [visible] | every time | quieter | `src/build.mjs` |",
          "| A2 | 1 | the old flag's warning goes to stderr | stdout | scripts read stdout | `src/build.mjs` |", "| A3 | 2 | the help lists --to first | in the order of the alphabet | the new flag first | `docs/help.md` |",
          "| D1 | 2 | the help is a Markdown file, `docs/help.md` | the --help text | it is what the site shows | `docs/help.md` |", "| m1 | 1 | --to takes a folder too | only a file | index.html inside | `src/build.mjs` |"].join("\n"))
        .replace("## For the guide", `## Code check\n\nA fresh agent checked: **steps 1 of 2 ✓, decisions 2 of 2 ✓ (D-002 read as not in the diff's files: it is about words), unexplained 0 ✗**.\n\n- **✗ Step 2** (the help's example): not built yet, as step 2 says (D-001: it waits for the help's review). The rest of the step is carried, and this sentence is the last of a long answer that is never cut.\n\n## Not done\n\n- **Where the page opens** is D-003's answer, not built yet.\n- **The help's example** waits on step 2.\n- **The help's wording** is the owner's to write.\n\n## For the guide`)
        .replace("*Written after the build, for the guide.*", "*Written after the build, for the guide.*\n\n**Ran in a scratch repo:** `runs/scratch-*.txt` — a scratch repo with a plan of its own, `2026-10-09-gone`.\n\n#### Since then\n\n- **The help's example**: written since, in `" + c2 + "`.\n- **A2**: the warning went to stdout again, in `" + c2 + "`.\n- **Step 1**: today, the page opens under the video, in `" + c2 + "`.\n\n#### In plain words\n\n- **A3**: the help puts the new flag first\n- **Step 2**, with Not done's **The help's example**: Step 2 is built except its example, which waits for the help's review.\n- **The help's wording**: the owner writes the help's words")
        .replace("- `--to` in `src/build.mjs`.", "- `--to` in `src/build.mjs`; `reel audit <plan-dir>` then checks the walkthrough against it.")
        .replace("#### Why it works this way\n\nOld scripts keep running.", "#### Why it works this way\n\nOld scripts keep running.\n\n#### Files and commands\n\n- To see it for yourself:\n\n  ```sh\n  reelplanner build site --to a.html\n  cat a.html\n  ```\n\n  then open a.html in a browser.\n"));
      // round 2: a run that greps a frame's HTML (its entities read as the characters they are); the code check's own list
      write(join(pd, "walkthrough-video", "frame.html"), "<p>you&#x27;d notice it &amp; more</p>\n");
      write(join(pd, "runs", "frame-words.txt"), "$ grep -o 'you[^<]*' .reelplanner/plans/2026-10-01-flag/walkthrough-video/frame.html   (this repo: the frame's words)\nyou&#x27;d notice it &amp; more\nexit 0\n");
      write(join(pd, "code-check", "findings.md"), "# Code check\n\n## Steps\n\n- Step 1 — ✓\n\n## Decisions\n\n- D-001 — ✓ holds\n- D-002 — n/a for this check: about words\n\n## Unexplained\n\n- none\n");
      write(join(pd, "runs", "scratch-record.txt"), "$ reel record .reelplanner/plans/2026-10-09-gone ../review.json   (a scratch repo: a review of its own plan)\n✓ .reelplanner/plans/2026-10-09-gone/reviews/walkthrough-1.json, by demo@example.com\nexit 0\n");
      const led2 = json(join(rp, "decisions.json")); led2.decisions.push({ id: "D-003", date: "2026-09-21", plan: "2026-10-01-flag", step: 1, question: "Where does the page open?", chosen: "Its own page", status: "superseded", supersededBy: "D-004", components: [] }, { id: "D-004", date: "2026-09-22", plan: "2026-10-01-flag", step: 1, question: "Where does the page open?", chosen: "Under the video", status: "active", supersedes: ["D-003"], components: [] });
      // round 3: a later plan narrows step 1's answer (its Supersedes line says step 1), and the ledger links the change to
      // that plan's step 2 answer instead
      led2.decisions.push({ id: "D-007", date: "2026-09-20", plan: "2026-10-01-flag", step: 1, question: "Does the old flag warn?", chosen: "Every time", status: "superseded", supersededBy: "D-009", components: [] },
        { id: "D-008", date: "2026-10-05", plan: "2026-10-05-later", step: 1, question: "Which scripts stay quiet?", chosen: "Those that pass --quiet", status: "active", components: [] },
        { id: "D-009", date: "2026-10-05", plan: "2026-10-05-later", step: 2, question: "What does the list show?", chosen: "Listed, not judged", status: "active", supersedes: ["D-007"], components: [] });
      write(join(rp, "plans", "2026-10-05-later", "plan.md"), "# Later\n\n## The problem\n\nx\n\n## Steps\n\n### Step 1 — Quiet\n\nIt is quiet.\n\n## Supersedes\n\n- **D-007** \"Does the old flag warn? Every time.\" Narrowed for scripts (step 1).\n");
      write(join(rp, "plans", "2026-10-05-later", "walkthrough.md"), "# Walkthrough: Later\n\n## What was done, per step\n\n### Step 1 — Quiet ✅\n\n**You can now:** keep a script quiet with `--quiet`.\n");
      writeFileSync(join(rp, "decisions.json"), JSON.stringify(led2, null, 2));
      commit("A decision replaced after the build");   // (git dates it: a step's "Since then" is a decision the log took in after the plan's last commit)
      const wvd = join(pd, "walkthrough-video");
      write(join(wvd, "STORYBOARD.md"), "---\nplan_dir: .reelplanner/plans/2026-10-01-flag\n---\n\n## Frame 1 — What was built\n\n- voiceover: \"It changed two files.\"\n");
      const wframes = [["What was built", 0, 10, null], ["Step 1: the new flag, and choice A1", 10, 12, 1], ["Step 2: the help, a change from the plan", 22, 8, 2], ["Step 2: a smaller choice", 30, 6, 2], ["The list", 36, 6, null]]
        .map(([title, start, d, st], i) => ({ index: i + 1, title, compositionId: `0${i + 1}-x`, start, durationSeconds: d, planStep: st, narration: i ? "" : "It changed two files." }));
      write(join(wvd, "plan-map.json"), JSON.stringify({ project: "walkthrough-video", title: "Rename the flag, built", totalSeconds: 42, frames: wframes, details: [], decisions: [],
        autonomy: [{ id: "d1", frameIndex: 3, planStep: 2, at: 29.9 }],
        autonomyGroups: [{ id: "stop-2", stop: true, frameIndex: 2, planStep: 1, ids: ["a1"], calls: [], at: 21.9 }, { id: "group-4", frameIndex: 4, planStep: 2, ids: ["a3"], calls: [], at: 35.9 }, { id: "list-5", list: true, frameIndex: 5, planStep: null, ids: ["a2"], calls: [], at: 41.9 }] }, null, 2));
      const gw = run("guide.mjs", wvd, "--check", "--no-thumbs");
      ok("guide --check (round 1): passes on a walkthrough video with a pause on one choice, a pause on another, a grouped beat and the list", gw.code === 0 && /4 stops on the video's timeline, 4 of 5 choice cards linked to their moment/.test(gw.out), gw.out);
      const wgd = join(wvd, "guide"), wdata = JSON.parse(readFileSync(join(wgd, "index.html"), "utf8").match(/id="guide-data">([\s\S]*?)<\/script>/)[1]);
      const uniq = new Set(wdata.built.cats.flatMap((c) => c.files.filter((f) => !f.generated).map((f) => f.path))).size, perCat = wdata.built.cats.reduce((a, c) => a + c.files.filter((f) => !f.generated).length, 0);
      ok("guide (round 1): the files of the change counted once each, by hand and generated; the video's own number read", wdata.built.totals.hand === uniq && perCat >= uniq && wdata.built.totals.hand + wdata.built.totals.gen === wdata.built.totals.files && wdata.reader.videoFiles?.n === 2 && wdata.reader.videoFiles.scene === 1, JSON.stringify({ t: wdata.built.totals, v: wdata.reader.videoFiles }));
      ok("guide (round 1): a Not done line settled since: a decision replaced (the ledger), and the walkthrough's own Since then (its commit from git)", wdata.reader.notDone?.find((x) => /Where the page opens/.test(x.head))?.settled[0]?.ids.join() === "D-003,D-004" && wdata.reader.notDone.find((x) => /help's example/.test(x.head))?.settled[0]?.commits[0]?.sha === c2 && !wdata.reader.notDone.find((x) => /wording/.test(x.head)).settled.length, JSON.stringify(wdata.reader.notDone));
      const b = await chromium.launch(launchOpts());
      try {
        const pg = await b.newPage({ viewport: { width: 1280, height: 900 } }); await pg.route(/^(https?|wss?):/, (r) => r.abort());
        await pg.goto(pathToFileURL(join(wgd, "index.html")).href); await pg.waitForTimeout(150);
        const w = await pg.evaluate(() => {
          const t = (sel) => document.querySelector(sel)?.innerText || "";
          const dd = [...document.querySelectorAll(".inshort dt")].map((d) => [d.textContent.trim(), d.nextElementSibling?.innerText || ""]);
          return { tl: [...document.querySelectorAll(".tl-list li.tl-i")].map((li) => ({ kind: li.dataset.kind, ids: li.dataset.ids, text: li.innerText })),
            cards: [...document.querySelectorAll("li.call")].map((c) => ({ id: c.id, wm: !!c.querySelector(".xl .wm"), label: c.querySelector(".xl")?.textContent || "", lead: c.querySelector(".chose")?.textContent || "", first: c.firstElementChild?.className, last: c.lastElementChild?.className })),
            look: (dd.find(([k]) => k === "Worth your look") || [])[1], say: t("#choices > .say"), folds: [...document.querySelectorAll("#choices details > summary")].map((x) => x.textContent),
            hero: t(".hero .status"), cc: [...document.querySelectorAll("#checked .raised li")].map((li) => li.innerText), notDone: t(".inshort dl"), nd: t("#not-done .nd"),
            here: document.querySelector("#try-here")?.textContent || "", named: document.querySelector("#try-named")?.textContent || "", scratch: document.querySelector("#try-scratch")?.textContent || "", warn: !!document.querySelector("#try-scratch .warn"), made: t("#made"),
            since: [...document.querySelectorAll("li.call .since")].map((x) => ({ id: x.closest("li.call").id, text: x.textContent })), stepSince: document.querySelector("#step-1 > .since")?.textContent || "", ccFull: t("#checked"),
            stepSinceAll: [...document.querySelectorAll("#step-1 > .since")].map((x) => x.textContent), today: document.querySelector("#step-1 > .since.today")?.textContent || "",
            short2: document.querySelector("#step-2 > .since.short")?.textContent || "", kicker2: document.querySelector("#step-2 .kicker")?.textContent || "",
            ccLead: document.querySelector("#checked > p:not(.lab)")?.textContent || "", ccCount: document.querySelector("#code-check .cc-count")?.textContent || "",
            tlT: [...document.querySelectorAll(".tl-list li.tl-i")].map((li) => ({ ids: li.dataset.ids, t: li.querySelector(".tl-t")?.textContent, watch: li.querySelector(".wm .wl")?.textContent || "" })),
            saysTwo: [...document.querySelectorAll("main p.say")].every((p) => (p.textContent.match(/[.!?](?=\s+[A-Z0-9“"(])/g) || []).length <= 1),
            pre: [...document.querySelectorAll("#step-1 pre.code")].map((p) => ({ text: p.textContent, next: p.nextElementSibling?.textContent || "" })),
            ref: [...document.querySelectorAll("[data-noexpand]")].map((d) => d.id), text: document.querySelector("main").innerText };
        });
        const tl = Object.fromEntries(w.tl.map((x) => [x.ids, x]));
        ok("stops (round 1): the timeline has each stop as the player plays it: a pause on A1, a pause on D1, A3 shown without a pause, A2 on the list", tl.A1?.kind === "choices" && tl.D1?.kind === "choices" && tl.A3?.kind === "shown" && /Shown, not a pause/.test(tl.A3.text) && tl.A2?.kind === "list" && w.tl.length === 4, JSON.stringify(w.tl));
        ok("stops (round 1): each choice the video stops on links to that moment, said for what it is; one only on the page has none", ["A1", "D1", "A2", "A3"].every((id) => w.cards.find((c) => c.id === `choice-${id}`)?.wm) && !w.cards.find((c) => c.id === "choice-m1")?.wm && /The video pauses on it\.\s*Watch its scene · 0:22/.test(w.cards.find((c) => c.id === "choice-D1").label) && /list at the end/.test(w.cards.find((c) => c.id === "choice-A2").label) && /not a pause/.test(w.cards.find((c) => c.id === "choice-A3").label), JSON.stringify(w.cards));
        const line = "five choices: two the walkthrough video stops on, one it shows on a sheet without pausing, one on its list at the end and one smaller one only on this page";
        ok("counts (round 1): one breakdown of the choices, the same in In short and in the choices' own section", (w.look || "").toLowerCase().includes(`in all: ${line}.`) && w.say.toLowerCase().includes(`${line}.`) && w.folds.some((f) => /The other three choices: one on the video's list at the end, one shown on a sheet in the video and one only on this page/.test(f)), JSON.stringify({ look: w.look, say: w.say, folds: w.folds }));
        ok("cards (round 1): a card leads with the choice's words, its number last and muted", w.cards.every((c) => /\bwhy\b|\bchose\b/.test(c.first) && c.last === "meta"), JSON.stringify(w.cards));
        ok("code check (round 1): each answer whole, never cut, a decision's bare number said as a decision (round 2); decisions read as outside the diff said apart", w.cc.some((x) => /not built yet, as step 2 says \((?:an earlier|this plan's) decision: it waits for the help's review\)\. The rest of the step is carried, and this sentence is the last of a long answer that is never cut\./.test(x)) && /the one decision in force it checked against this diff \(one other was read as not in the diff's files: it is about words\)/.test(w.text) && !/earlier decisions? it/.test(w.text), JSON.stringify(w.cc));
        ok("not done (round 1): a line settled since shows as settled, in the list and in In short", /Since then: The decision it names was replaced on 22 Sep 2026: “Under the video”/.test(w.nd) && /Since then: Written since/.test(w.nd) && /Settled since:/.test(w.notDone) && /The owner writes the help's words/.test(w.notDone), `${w.nd}\n${w.notDone}`);
        ok("try it (round 1): a run made in a scratch repo is shown apart, folded, warned as writing to the record; this repo's run to run here; all of them named in How this page was made", /reelplanner build site --to a\.html/.test(w.here) && !/2026-10-09-gone/.test(w.here) && /reel record \.reelplanner\/plans\/2026-10-09-gone/.test(w.scratch) && w.warn && /runs\/scratch-record\.txt/.test(w.made) && /scratch repo/i.test(w.made), JSON.stringify({ here: w.here.slice(0, 300), scratch: w.scratch.slice(0, 300), made: w.made }));
        const tA1 = w.tlT.find((x) => x.ids === "A1"), cA1 = w.cards.find((c) => c.id === "choice-A1");
        ok("stops (round 2, N5; round 3, designer 6): the timeline gives each stop's own moment (the plan map's at), not its scene's start; the card one time, its scene's", tA1?.t === "0:21" && /Watch its scene/.test(tA1.watch) && /^The video pauses on it\.\s*Watch its scene · 0:10/.test(cA1?.label || "") && (cA1.label.match(/\d:\d\d/g) || []).length === 1, JSON.stringify({ tA1, label: cA1?.label }));
        ok("since (round 2): a choice's own Since then is on its card; a step's answer replaced since says so at the step", w.since.some((x) => x.id === "choice-A2" && /Since then: The warning went to stdout again/.test(x.text)) && /Since then: on 22 Sep 2026 the answer to “Where does the page open\?” changed to “Under the video”, no longer “Its own page”/.test(w.stepSince), JSON.stringify({ since: w.since, step: w.stepSince }));
        const later = w.stepSinceAll.find((x) => /later's step 1/.test(x)) || "";
        ok("since (round 3, N1): a step's answer a later plan changed is said in that plan's own Supersedes words and step, its answer then, and what it does today; the ledger's other link said too", /on 5 Oct 2026, later's step 1 changed this step's answer to “Does the old flag warn\?” \(“Every time”\): “Narrowed for scripts” \(“Which scripts stay quiet\?” → “Those that pass --quiet”\)\. Today: Keep a script quiet with --quiet\. This step was planned and built before that\./.test(later) && /The decision log links the change to another answer of that plan \(its step 2: “Listed, not judged”\); the plan's own list of what it supersedes names step 1/.test(later), JSON.stringify(w.stepSinceAll));
        ok("today (round 3, N6): a step's Since then item says what the step does today, under its Since then", /^Today: today, the page opens under the video/.test(w.today), w.today);
        ok("plain words (round 3): a step still waiting is not said short of the plan, its plain words kept for when it is built", /Built: 1 of 2 steps; step 2 still waiting/.test(w.hero) && !w.short2 && w.cc.some((x) => /not built yet, as step 2 says/.test(x)), JSON.stringify({ hero: w.hero, short2: w.short2, cc: w.cc }));
        ok("plain words (round 3, N7): a choice's lead and a Not done line in the walkthrough's plain words, the record's own a click away", w.cards.find((c) => c.id === "choice-A3")?.lead === "The help puts the new flag first." && /the owner writes the help's words/i.test(w.notDone) && /The help's wording is the owner's to write/.test(w.nd), JSON.stringify({ cards: w.cards.map((c) => c.lead), nd: w.notDone }));
        ok("one count (round 3, N2): the check's decisions said once, the page's own list and the summary's number only in the fold", /the one decision in force it checked/.test(w.ccLead) && !/lists below|summary line/.test(w.ccLead) && /How it counted: .*The decisions this page lists below number|How it counted: the decisions this page lists below number/.test(w.ccCount), JSON.stringify({ lead: w.ccLead, count: w.ccCount }));
        ok("try it (round 2): a command only named, never run, is under Named, not run, not Run this here; a run that greps HTML shows its words decoded", /Named, not run/.test(w.named) && /reel audit <plan-dir>/.test(w.named) && !/reel audit/.test(w.here) && /you'd notice it & more/.test(w.here) && !/&#x27;|&amp;/.test(w.here), JSON.stringify({ here: w.here.slice(0, 400), named: w.named.slice(0, 200) }));
        ok("leads (round 2): a section's large lead is at most two sentences", w.saysTwo);
        ok("fences (round 1): a fenced block under a list item is drawn as code, in its place, the item's words after it", w.pre.some((p) => /cat a\.html/.test(p.text) && /then open a\.html/.test(p.next)), JSON.stringify(w.pre));
        ok("reference (round 1): the decisions it was built on and the plan's own words are one folded line each, left out of Open everything", w.ref.join() === "decisions-all,the-plan-all" && await pg.evaluate(() => { window.RPGuide.expandAll(true); const a = [...document.querySelectorAll("[data-noexpand]")].every((d) => !d.open); window.RPGuide.expandAll(true, { everything: true }); return a && [...document.querySelectorAll("[data-noexpand]")].every((d) => d.open); }));
        await pg.close();
        // round 3, N3: step 2 built short of the plan: said in the walkthrough's plain words where it stands, in In short,
        // at the step and in the check, and the Not done line it names said once with it
        const wt0 = readFileSync(wtp, "utf8"); writeFileSync(wtp, wt0.replace("### Step 2 — Say it in the help ⏳", "### Step 2 — Say it in the help ✅"));
        const gs = run("guide.mjs", wvd, "--no-thumbs"); writeFileSync(wtp, wt0);
        const p2 = await b.newPage({ viewport: { width: 1280, height: 900 } }); await p2.route(/^(https?|wss?):/, (r) => r.abort());
        await p2.goto(pathToFileURL(join(wgd, "index.html")).href); await p2.waitForTimeout(150);
        const v = await p2.evaluate(() => ({ hero: document.querySelector(".hero .status")?.innerText || "", notDone: document.querySelector(".inshort dl")?.innerText || "",
          short2: document.querySelector("#step-2 > .since.short")?.textContent || "", kicker2: document.querySelector("#step-2 .kicker")?.textContent || "", cc: [...document.querySelectorAll("#checked .raised li")].map((li) => li.innerText) }));
        await p2.close();
        const ndOnly = (v.notDone.split("Not done")[1] || "").split("Checked")[0];
        ok("plain words (round 3, N3): a short step said in the walkthrough's plain words where it stands, in In short, at the step and in the check, the Not done line it names said once with it", gs.code === 0 && /Built: step 1\. Step 2 is built except its example, which waits for the help's review/.test(v.hero) && /Step 2 is built except its example/.test(ndOnly) && !/help's example/i.test(ndOnly.replace(/Step 2 is built except its example/, "")) && /Step 2 is built except its example/.test(v.short2) && /built, short of the plan/.test(v.kicker2) && v.cc.some((x) => /^Step 2 is built except its example/.test(x)), JSON.stringify(v));
      } finally { await b.close(); }
      run("guide.mjs", wvd, "--no-thumbs");
      // the check's own failures: a stop the timeline leaves out; a fence left as text
      const model = await buildModel(guideTarget(wvd), { thumbs: false });
      model.data.videos.built.stops.push({ kind: "choices", n: 4, ids: ["m1"], t: 30 });
      const r1 = await checkGuide({ model, outDir: wgd, full: join(wgd, "index.html"), partFiles: [] });
      ok("guide --check (round 1): a stop the video makes that the page's timeline leaves out fails", r1.fails.some((f) => /stops at scene 4 \(a pause on m1\), and the page's timeline does not say so/.test(f)), JSON.stringify(r1.fails));
      // round 2: a choice card whose lead is empty fails (its words cut to nothing): the page as built from such a row
      { const wt0 = readFileSync(wtp, "utf8"); writeFileSync(wtp, wt0.replace("| m1 | 1 | --to takes a folder too |", "| m1 | 1 | `x`: |"));
        const ge = run("guide.mjs", wvd, "--check", "--no-thumbs");
        ok("guide --check (round 2): a choice card with no lead in words fails", ge.code === 1 && /choice card\(s\) with no lead in words[^\n]*m1/.test(ge.out), ge.out);
        writeFileSync(wtp, wt0); }
      writeFileSync(wtp, readFileSync(wtp, "utf8").replace("- **The help's wording** is the owner's to write.", "- **The help's wording** is the owner's to write: ```sh left open."));
      const gf = run("guide.mjs", wvd, "--check", "--no-thumbs");
      ok("guide --check (round 1): a Markdown fence left as text fails", gf.code === 1 && /a Markdown fence left as text, not drawn as code: "[^"]*```sh/.test(gf.out), gf.out);
      writeFileSync(wtp, readFileSync(wtp, "utf8").replace(": ```sh left open.", "."));
    }

    // a step's picture is sharp (the guide's pictures, 2026-09-30): made from a 2× snapshot as files beside the page, at
    // the widths it is drawn at; on a 2× screen the file it shows has at least twice the pixels it is drawn across, on a
    // desktop and a phone; clicked, it opens whole in the lightbox, which Esc and a click close
    let ffmpeg = true; try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); } catch { ffmpeg = false; }
    const webp = ffmpeg && webpEncoder();
    if (webp) {
      mkdirSync(join(vd, "snapshots"), { recursive: true });
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "testsrc2=s=3840x2160", "-frames:v", "1", join(vd, "snapshots", "frame-01-at-16s.png")]);
      const mp = json(join(vd, "plan-map.json")); mp.frames.find((f) => f.index === 2).thumb = "snapshots/frame-01-at-16s.png"; writeFileSync(join(vd, "plan-map.json"), JSON.stringify(mp));
      const gp = run("guide.mjs", vd), pics = existsSync(join(gd, "pics")) ? readdirSync(join(gd, "pics")) : [], page = readFileSync(join(gd, "index.html"), "utf8");
      ok("guide pictures: a step's scene as files beside the page (1×, 2× and whole, WebP), none inline", gp.code === 0 && ["w760", "w1520", "w3840"].every((w) => pics.some((f) => f.endsWith(`-${w}.webp`))) && !/data:image\/(?:jpeg|png|webp);base64/.test(page), `${gp.out}\n${pics.join(" ")}`);
      const b = await chromium.launch(launchOpts());
      try {
        for (const [w, h] of [[1280, 900], [390, 844]]) {
          const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); await pg.route(/^(https?|wss?):/, (r) => r.abort());
          await pg.goto(pathToFileURL(join(gd, "index.html")).href); const img = await pg.$("figure.shot a.zoom img");
          if (!img) { ok(`guide pictures at ${w} px: the step's picture is on the page`, false); await pg.close(); continue; }
          await img.scrollIntoViewIfNeeded(); await pg.waitForFunction((el) => el.complete && el.naturalWidth > 0, img);
          const m = await img.evaluate(async (el) => { const probe = new Image(); probe.src = el.currentSrc; await probe.decode(); return { shown: el.getBoundingClientRect().width, pixels: probe.naturalWidth, src: el.currentSrc.split("/").pop() }; });
          ok(`guide pictures at ${w} px, 2× screen: the file shown has at least twice the pixels it is drawn across`, m.shown > 0 && m.pixels >= 2 * m.shown, JSON.stringify(m));
          if (w === 1280) {
            await pg.click("figure.shot a.zoom"); await pg.waitForFunction(() => /w3840\.webp$/.test(document.querySelector(".lb .lb-img")?.currentSrc || ""), null, { timeout: 10000 }).catch(() => {});
            const o = await pg.evaluate(() => { const lb = document.querySelector(".lb"), i = lb?.querySelector(".lb-img"); return { open: !!lb && !lb.hidden, whole: i?.naturalWidth, src: (i?.currentSrc || "").split("/").pop(), t0: i?.style.transform }; });
            await pg.mouse.move(640, 450); await pg.mouse.wheel(0, -400); await pg.waitForTimeout(100);
            const t1 = await pg.evaluate(() => document.querySelector(".lb .lb-img").style.transform);
            await pg.keyboard.press("Escape"); const esc = await pg.evaluate(() => ({ open: !document.querySelector(".lb").hidden, back: document.activeElement?.classList.contains("zoom") }));
            await pg.click("figure.shot a.zoom"); await pg.mouse.click(8, 450); const click = await pg.evaluate(() => !document.querySelector(".lb").hidden);
            ok("guide pictures: clicked, the picture opens whole in the lightbox, zooms, and Esc or a click closes it (the focus back on the picture)", o.open && o.whole === 3840 && t1 !== o.t0 && !esc.open && esc.back && !click, JSON.stringify({ o, t1, esc, click }));
          }
          await pg.close();
        }
      } finally { await b.close(); }
    } else console.log(`· guide pictures not checked: ${ffmpeg ? "nothing here makes WebP (ffmpeg without libwebp, and no cwebp: brew install webp)" : "ffmpeg is not installed"}`);
    // a step's own picture (round 1, D4): cropped to what is on the frame, 48 px round it (96 at 2×), then no taller
    // than 3:2 and no wider than 12:5, kept inside the frame
    { const { cropOf } = await import("../lib/guide/pictures.mjs"), F = { W: 3840, H: 2160 };
      const tall = cropOf({ ...F, l: 1600, t: 200, r: 2200, b: 1800 }), strip = cropOf({ ...F, l: 200, t: 200, r: 3600, b: 500 }), mid = cropOf({ ...F, l: 180, t: 120, r: 3660, b: 1500 }), edge = cropOf({ ...F, l: 0, t: 0, r: 900, b: 2160 });
      const ar = (c) => c.w / c.h, inside = (c) => c.x >= 0 && c.y >= 0 && c.x + c.w <= F.W && c.y + c.h <= F.H;
      ok("guide pictures: cropped to the content and 48 px round it, between 3:2 and 12:5, inside the frame", Math.abs(ar(tall) - 1.5) < 0.01 && Math.abs(ar(strip) - 2.4) < 0.01 && mid.x === 84 && mid.y === 24 && mid.w === 3672 && ar(mid) <= 2.4 + 0.01 && ar(mid) >= 1.5 && [tall, strip, mid, edge].every(inside), JSON.stringify({ tall, strip, mid, edge })); }
  } else console.log("· guide --check not run: playwright-core is not installed");

  // check-details: the guide part's mark is taken; a scene that marks nothing warns, never fails, even strict
  const cd = run("check-details.mjs", vd, "--no-browser");
  ok("check-details: a `- guide:` scene's mark and its part in guide/; an unmarked one warns under strict", cd.code === 0 && /guide part step-2: nothing in its frame is marked/.test(cd.out) && /step-1\.html/.test(cd.out), cd.out);

  // ── an explainer's part: its source, whole ──
  const ex = run("explain.mjs", "what does the build do?", "src/build.mjs", "--date", "2026-10-01", "--slug", "build");
  const ed = join(rp, "explainers", "2026-10-01-build"), src = json(join(ed, "sources.json"));
  src.sources[0].needsPart = true; writeFileSync(join(ed, "sources.json"), JSON.stringify(src, null, 2));
  write(join(ed, "video", "plan-map.json"), JSON.stringify({ title: "The build", frames: [{ index: 1, title: "It", start: 0, durationSeconds: 5, narration: "x" }], details: [] }));
  const ge = run("guide.mjs", join(ed, "video"), "--no-thumbs");
  const edata = existsSync(join(ed, "video", "guide", "source-src-build-mjs.html")) ? JSON.parse(readFileSync(join(ed, "video", "guide", "index.html"), "utf8").match(/id="guide-data">([\s\S]*?)<\/script>/)[1]) : null;
  ok("guide: an explainer's source marked needsPart gets a part, the file whole as it was pinned", ex.code === 0 && ge.code === 0 && edata?.sources[0].files?.[0].lines.join("\n").includes("export const flag = '--to'"), `${ex.out}\n${ge.out}`);

  // ── reel record: a suggested edit ──
  const review = { version: 2, src: ".reelplanner/plans/2026-10-01-flag/video/index.html", verdict: "changes", exportedAt: "2026-10-02T10:00:00Z", decisions: [], quizzes: [], annotations: [
    { id: "e1", kind: "note", t: 12, comment: "Suggested edit: “--to <file>” → “--into <file>”", detail: { name: "step-1", anchor: "step 1 · interface · --to" }, edit: { before: "--to <file>", after: "--into <file>" }, plan: { step: 1 } },
    { id: "e2", kind: "note", t: 12, comment: "Suggested edit", detail: { name: "step-1", anchor: "step 1 · case 3" }, edit: { before: "refused", after: "refused, with the reason" }, plan: { step: 1 } }] };
  write(join(tmp, "review.json"), JSON.stringify(review));
  const rr = reel("record", pd, join(tmp, "review.json"));
  const ledNow = json(join(rp, "decisions.json")).decisions.filter((d) => d.kind === "edit");
  ok("reel record: a suggested edit is one ledger entry: the reviewer's words chosen, the plan's not", rr.code === 0 && ledNow.length === 2 && ledNow[0].chosen === "--into <file>" && ledNow[0].options.find((o) => o.id === "before")?.label === "--to <file>" && ledNow[0].step === 1, `${rr.out}\n${JSON.stringify(ledNow)}`);
  const mdPath = readFileSync(join(pd, "reviews", `${rr.out.match(/reviews\/([^ ]+)\.json/)?.[1]}.md`), "utf8");
  ok("reel record: reviews/<id>.md lists the edits to apply, each with what it rebuilds", /## Edits to apply/.test(mdPath) && /\*\*Step 1 · Interface\*\*: `--to <file>` → `--into <file>`/.test(mdPath) && /\*\*Step 1 · Cases\*\*: `refused`/.test(mdPath) && /rebuild: the guide only: no scene says or shows these words/.test(mdPath), mdPath);

  // ── reel record: a note highlighted in the guide (packages/player/guide-review.js), under its step, pointing at its quote ──
  const hl = { version: 1, src: ".reelplanner/plans/2026-10-01-flag/video/index.html", verdict: "changes", exportedAt: "2026-10-03T10:00:00Z", decisions: [], quizzes: [], annotations: [
    { id: "g1", kind: "note", t: 22, via: "guide", comment: "Say which help page", plan: { step: 2 }, frame: { index: 3, title: "Step 2: the help" },
      detail: { name: "step-2", anchor: "step 2 · in short", text: "says it in the help", where: "What it would let you do · step 2", section: "What it would let you do", step: 2 },
      hl: { id: "step-2", anchor: "step 2 · in short", q: "says it in the help", pre: "", suf: "", n: 0 } }] };
  write(join(tmp, "review-hl.json"), JSON.stringify(hl));
  const rh = reel("record", pd, join(tmp, "review-hl.json"));
  const hmd = readFileSync(join(pd, "reviews", `${rh.out.match(/reviews\/([^ ]+)\.json/)?.[1]}.md`), "utf8");
  ok("reel record: a note highlighted in the guide is filed under its step, saying where in the guide, pointing at the words", rh.code === 0 && /- \*\*Step 2\*\*\n  - comment in the guide \(What it would let you do · step 2, at `step 2 · in short`\): "Say which help page" \(pointing at "says it in the help"\)/.test(hmd), hmd);
} finally { rmSync(tmp, { recursive: true, force: true }); }
console.log(failed ? `\n${failed} failed` : "\nall passed");
process.exit(failed ? 1 : 0);
