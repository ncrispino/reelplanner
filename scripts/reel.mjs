#!/usr/bin/env node
// reel — manage a project's .reelplanning/ directory (docs/project-dir.md).
//   init <repo> --name <n> --kind greenfield|brownfield     create .reelplanning/ from templates/reelplanning
//        [--agent claude|codex|none]                       config.json's headless command (default: the agent this runs in; lib/agents.mjs)
//                                                            a .reelplanning/ with no decisions.json (only .env, config.json:
//                                                            setup files) is set up over: .env kept, config.json merged, yours winning
//   new-plan <repo> <slug> --plan <plan.md>                  create plans/<date>-<slug>/ with the plan
//   new-plan <repo> <slug> --from <explainer-dir> [--plan <f>]  a plan that starts from an explainer: plan.md opens "Explained
//                                                            first: `<explainer>`", and its problem quotes your review of it (explain-first step 4)
//   stage <plan-dir>                                         write video/.hyperframes/stage-snippet.html from system.json + theme + the plan's steps
//   check <plan-dir> [--blocks] [--base <ref>]               decision guard + component names (exit 1 on a failure); an approved plan
//                                                            against the ledger as it stood at its approval. The rules on what it touches
//                                                            (the owner's answers) must be cited; accepted calls are history, warned
//                                                            about only with --base, when the diff from there changes their lines (D-306)
//   record <plan-dir> [review.json]                          file the review in reviews/ (never over another), add its decisions to the
//                                                            ledger, and write reviews/<id>.md: what to act on
//   record <explainer-dir> [review.json]                     an explainer's review: filed as reviews/explainer-<time>, its .md by scene;
//                                                            nothing in the ledger (an explainer asks no questions: explain-first step 3)
//   audit <plan-dir>                                         walkthrough.md covers every plan step and decision, and says where to look (exit 1 on a failure;
//                                                            a walkthrough already accepted is settled: what it breaks is a note, D-309)
//   stops <plan-dir>                                         which of walkthrough.md's calls pause the walkthrough video and which go on its list, by which rule, and the beats by step
//                                                            (a call outside the steps: by its ask, the word in its step column, else its id)
//   prereqs <plan-dir> [--walkthrough] [--dry-run]           write the video's `before:` lines: the system video's chapters on the parts the plan
//                                                            touches, and up to two earlier plans' videos it builds on; and its `recap:` lines,
//                                                            one for every earlier video it builds on, for the recap scene
//   status <repo>                                            each plan's stage, whether the system video is behind the spec, and
//                                                            what reviews show (at most seven lines of memory; a retro when one is due)
//   memory [<repo>] [<id>] [--you]                           the memory lines, or the evidence behind one (--you: yours, across repos)
//   retro [<repo>]                                           start a retro plan: the evidence memory holds, and skill edits to propose
//   fold [<repo>] <component> [--dry-run] [--apply]          draft folds/<component>.md: the component's rules as a section of spec.md, for
//                                                            the owner's approval; --apply puts it in spec.md and marks them folded (D-306)
//   build <video-dir> [options]                              narrate → … → verify, one line a stage (scripts/build.mjs)
//   case-study <slug> --prompt <file> [--from <commit>]      a case study's folder: one prompt, three arms (scripts/case-study.mjs)
//   case-study report <slug> [--publish]                     its page, case-study.html; --publish refuses until every section is filled
//   case-study keep <slug> <arm> [<site-dir>] [--check]      an arm's finished site kept: plain files in site/, its history as site.bundle (D-247)
//   case-study provenance <slug> <arm> <transcript-dir>      what the arm ran: models, Claude Code versions, times, counts, from its transcripts
//   rebuild <video-dir> [--version <n|build|commit>] [--out <dir>] [--no-build] | --keep
//                                                            the versions of a video kept (each one a review opened or recorded), or one of
//                                                            them built again in a folder of its own, the voice made anew (scripts/rebuild.mjs)
//   pr-check [<repo>] [--base <ref>] [--merge] [--tidy]       a pull request against the line for a video, its videos against their text,
//                                                            no media, ids, what lands on main (scripts/pr-check.mjs)
//   renumber [<repo>] [--base <ref>] [--dry-run]             the branch's new decisions after the base's last, and their mentions in its
//                                                            plan folders (D-171; scripts/renumber.mjs)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, statSync, rmSync } from "node:fs";
import { resolve, join, dirname, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { parseCalls, stopFor, beatsByStep, listedOf, callLoad, askOf, placeOf, MANY_CALLS, STEP_CALLS, TAGS } from "./lib/autonomy.mjs";
import { componentsIn, stepComponents, repoMemory, youMemory, youPath, pendingPath, reviewFacts, recordYou, movePending, repoName, findMisses, lostWords, sinceRetro, youKnows, readYou, walkthroughBar, LINES } from "./lib/memory.mjs";
import { parseSteps, readPlanBlocks, blockFindings, blocksDue, BLOCKS_FROM, supersedesOf } from "./lib/plan-md.mjs";
import { fileReview, listReviews, reviewKind, reviewOf, reviewTime, reviewsDir, planStage, asksMore, approvalOf, lastChanged } from "./lib/reviews.mjs";
import { walkthroughScope, actOnMarkdown, distinctive, editsOf } from "./lib/review-scope.mjs";
import { ARM_IDS, preflightOf, missing as caseStudyMissing } from "./case-study.mjs";
import { definesIndex, storyboardFrames, frontMatter, listOf, glossaryFor, saysWord, rowFor, slugOf } from "./lib/terms.mjs";
import { explainerReviewMd, planQuotes, endOf, END_WORDS, commentsOf, askedOf, nextOf } from "./lib/explainer.mjs";
import { maintainersOf, maintainerOf, identityOf, roleOf, writeLedger } from "./lib/contributing.mjs";
import { AGENTS, detectAgent, agentBlock } from "./lib/agents.mjs";
import { rpInitialized, hasRp } from "./lib/env.mjs";
import { splitCommand } from "./lib/notify.mjs";
import { inForce, isRule, isHistory, specCites, specHas, FOLDED_INTO } from "./lib/ledger.mjs";
import { callsTouched, callsOutlived, callWords } from "./lib/call-lines.mjs";
import { keepVersion, keepLines } from "./lib/versions.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TPL = join(ROOT, "templates", "reelplanning");
const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const today = () => new Date().toISOString().slice(0, 10);
const read = (p) => readFileSync(p, "utf8");
const json = (p) => JSON.parse(read(p));
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

// locate the .reelplanning dir from a repo path or a plan dir; null when there is none
function findRpDir(p) {
  let d = resolve(p);
  for (let i = 0; i < 6; i++) {
    if (basename(d) === ".reelplanning") return d;
    if (hasRp(d)) return join(d, ".reelplanning");
    d = dirname(d);
  }
  return null;
}
// the same, set up: it holds the decision log (a folder of setup files only, .env and config.json, is not yet)
const NOT_SET_UP = (rp) => `${relative(process.cwd(), rp) || rp} is not set up yet (no decisions.json, only setup files): the first plan runs \`reel init ${relative(process.cwd(), dirname(rp)) || "."}\`, which keeps them`;
function rpDir(p) {
  const rp = findRpDir(p);
  if (!rp) die(`no .reelplanning/ at or above ${p} (run: reel init <repo>)`);
  if (!rpInitialized(rp)) die(NOT_SET_UP(rp));
  return rp;
}

// ---------- plan.md parsing (the harness's plan-mode Markdown; no schema) ----------
function section(md, title) {
  const re = new RegExp(`^## ${title}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "mi");
  const m = md.match(re); return m ? m[1].trim() : "";
}
function parsePlan(md) {
  // "### Step N — title", or with – - or : (lib/plan-md.mjs, shared with plan-map and detail)
  const all = parseSteps(md), steps = all.map(({ n, title }) => ({ n, title }));
  const stepBodies = Object.fromEntries(all.map((s) => [s.n, s.text]));
  const compLines = section(md, "Components(?: touched)?").split("\n").filter((l) => /^- /.test(l));
  const components = compLines.map((l) => { const m = l.match(/^- \*\*([^*]+)\*\*/); return m ? m[1].trim() : l.replace(/^- /, "").split(/[:(]/)[0].trim(); });
  const ids = (s) => [...s.matchAll(/\bD-\d{3}\b/g)].map((m) => m[0]);
  const inForce = ids(section(md, "Decisions in force")), specCited = specCites(section(md, "Decisions in force"));
  // "## Supersedes": what each line replaces (its lead id, once), and every id the section names (all of them cite)
  const supersedeLines = supersedesOf(section(md, "Supersedes"));
  const supersedes = supersedeLines.map((l) => l.id), supersedesNamed = [...new Set(ids(section(md, "Supersedes")))];
  const asked = [...section(md, "Open questions(?: for the reviewer)?").matchAll(/^\d+\.\s+\*\*([^*]+)\*\*([^\n]*)/gm)];
  const questions = asked.map((m) => m[1].trim());
  // the steps a question is about: "(step 2)", "(steps 1 and 3)", "(step 2, step 4)"; each question's, and all of them
  const stepsOfQuestion = asked.map((m) => [...((m[2].match(/\(steps? ([^)]*)\)/i) || [])[1] || "").matchAll(/\d+/g)].map((x) => Number(x[0])));
  const questionSteps = [...new Set(stepsOfQuestion.flat())];
  return { steps, stepBodies, components, inForce, specCites: specCited, supersedes, supersedesNamed, supersedeLines, questions, questionSteps, stepsOfQuestion };
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set("the a an of to in on for and or is are do does how where who what which when we it this that with by from as be at into".split(" "));
const words = (s) => new Set(norm(s).split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
const overlap = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n; };

// match a plan's component names to system.json ids (name, id, aliases)
const findComponent = (n, list) => {
  const k = norm(n);
  return (list || []).find((c) => norm(c.name) === k || c.id === k || (c.aliases || []).some((a) => norm(a) === k) || k.includes(norm(c.name)) || norm(c.name).includes(k));
};
function matchComponents(names, sys) {
  const out = [], unknown = [];
  for (const n of names) { const c = findComponent(n, sys.components); if (c) out.push(c.id); else unknown.push(n); }
  return { ids: [...new Set(out)], unknown };
}

// ---------- commands ----------
function init() {
  const usage = "usage: reel init <repo> [--name <n>] [--kind greenfield|brownfield] [--agent claude|codex|none]";
  const repo = resolve(argv[1] || die(usage));
  const name = flag("name", basename(repo)), kind = flag("kind", "brownfield");
  // the headless command a review starts when no session waits (lib/agents.mjs): --agent, else the agent this runs in
  const asked = flag("agent");
  if (asked && !AGENTS.includes(asked)) die(`--agent ${asked}: one of ${AGENTS.join(", ")}\n${usage}`);
  const { agent, why } = asked ? { agent: asked, why: "--agent" } : detectAgent();
  const dir = join(repo, ".reelplanning");
  // set up means a decision log: a folder holding only setup files (the hosted voice's .env and config.json, made
  // before any plan) is set up over, keeping them; a real one is left alone
  if (rpInitialized(dir)) die(`${dir} exists already: \`reel status ${argv[1]}\` says where its plans stand`);
  const before = existsSync(dir) ? readdirSync(dir) : null;
  let theirs = null;
  if (before?.includes("config.json")) {
    try { theirs = JSON.parse(read(join(dir, "config.json"))); } catch (e) { die(`${join(dir, "config.json")} is not valid JSON (${e.message}): fix it or move it aside, then run reel init again`); }
    if (!theirs || typeof theirs !== "object" || Array.isArray(theirs)) die(`${join(dir, "config.json")} is not a JSON object: fix it or move it aside, then run reel init again`);
  }
  mkdirSync(join(dir, "theme"), { recursive: true }); mkdirSync(join(dir, "plans"), { recursive: true });
  const fill = (s) => s.replaceAll("{{name}}", name).replaceAll("{{kind}}", kind);
  const kept = [];
  const write = (f, text) => { if (existsSync(join(dir, f))) kept.push(f); else writeFileSync(join(dir, f), text); };
  for (const f of ["README.md", "spec.md", "glossary.md", "names.md", "decisions.md", "decisions.json", "system.json"]) write(f, fill(read(join(TPL, f))));
  const config = JSON.parse(fill(read(join(TPL, "config.json"))));
  config.agent = agentBlock(agent, config.agent);
  // an existing config.json goes into the template's, its keys winning (an object a level deep: its narration over
  // none, its agent.command over the template's); an agent named with --agent now wins over the one it had
  let agentKept = false;
  if (theirs) {
    for (const [k, v] of Object.entries(theirs)) {
      if (k === "agent" && asked) continue;
      config[k] = v && typeof v === "object" && !Array.isArray(v) && config[k] && typeof config[k] === "object" && !Array.isArray(config[k]) ? { ...config[k], ...v } : v;
      if (k === "agent" && v?.command !== undefined) agentKept = true;
    }
  }
  writeFileSync(join(dir, "config.json"), JSON.stringify(config, null, 2) + "\n");
  // .gitignore: the template's lines, then any of its own the folder had (its .env line is the template's too)
  const tplIgnore = read(join(TPL, "gitignore")), had = existsSync(join(dir, ".gitignore")) ? read(join(dir, ".gitignore")).split("\n").map((l) => l.trim()) : [];
  const extra = had.filter((l) => l && !l.startsWith("#") && !tplIgnore.split("\n").includes(l));
  writeFileSync(join(dir, ".gitignore"), tplIgnore + (extra.length ? `\n# kept from the .gitignore here before \`reel init\`\n${extra.join("\n")}\n` : ""));
  for (const f of ["frame.md", "motion-language.md"]) if (existsSync(join(dir, "theme", f))) kept.push(`theme/${f}`); else copyFileSync(join(TPL, "theme", f), join(dir, "theme", f));
  console.log(`✓ ${dir} (${kind}: ${name})`);
  if (before) {
    const what = [before.includes(".env") && "kept .env (its keys, untouched)",
      theirs && `merged your config.json into the template's (yours kept: ${Object.keys(theirs).filter((k) => !(k === "agent" && asked)).join(", ") || "nothing in it"})`,
      before.includes(".gitignore") && `.gitignore is the template's${extra.length ? `, with your ${extra.length} other line${extra.length === 1 ? "" : "s"} kept` : ""}`,
      kept.length && `kept ${kept.join(", ")}`].filter(Boolean);
    console.log(`✓ set up over the setup files already there (no decision log yet): ${what.join("; ") || "nothing in it to keep"}`);
  }
  const command = config.agent?.command;
  const said = agentKept ? `kept from your config.json` : `${agent} (${why})`;
  console.log(`✓ agent: ${said}${!command ? ": reviews sent while no session waits stay in the inbox" : `: a review sent while no session waits starts \`${splitCommand(command)[0]}\``}; --agent claude|codex|none picks another`);
}

function newPlan() {
  const rp = rpDir(argv[1] || die("usage: reel new-plan <repo> <slug> --plan <plan.md> | --from <explainer-dir>"));
  const slug = argv[2] || die("usage: reel new-plan <repo> <slug> --plan <plan.md> | --from <explainer-dir> (no <slug> given: the plan folder's name after its date)"); const src = flag("plan"), from = flag("from");
  if (!src && !from) die("usage: reel new-plan <repo> <slug> --plan <plan.md> | --from <explainer-dir> (one of them: the plan's text, or an explainer it starts from)");
  const text = from ? fromExplainer(resolve(from), src ? read(resolve(src)) : null) : read(resolve(src));
  const dir = makePlan(rp, slug, text);
  console.log(`✓ ${dir}${from ? `: explained first by ${basename(resolve(from))}; its problem quotes your review of it` : ""}`);
  if (from && !src) console.log("next: write the plan's steps from what you said (its problem), then `reel check` it as any plan; its video leans on the explainer (`reel prereqs` lists it first, D-248)");
}
// Plan this (explain-first step 4): a plan whose plan.md opens with the explainer it starts from, and whose problem
// quotes your review of it: your comments by scene, the questions you asked, what you want next. With --plan, that
// plan with the line and the quotes put in; without, a draft with the problem only, for the agent to write the steps.
function fromExplainer(ed, text) {
  if (!existsSync(join(ed, "explain.md"))) die(`${ed} is not an explainer (no explain.md)`);
  const name = basename(ed), last = listReviews(ed).filter((r) => r.kind === "explainer").at(-1);
  const title = (read(join(ed, "explain.md")).match(/^#\s+(.+)$/m) || [])[1] || name;
  const line = `Explained first: \`${name}\`${last ? ` (its review: \`reviews/${last.id}.md\`)` : ""}`;
  const quotes = planQuotes({ name, review: last?.review || null, reviewId: last?.id || null });
  if (!last) console.log(`△ ${name} has no review filed yet: the plan names it, and quotes nothing (reel record it first to quote your words)`);
  // what was picked at Finish, a suggestion drawn from the video or your own words (step 3): the draft's title
  const nx = nextOf(last?.review), want = nx?.end === "plan" ? String(nx.words || nx.pick?.text || "").trim().split("\n")[0] : "";
  const head = want ? want.replace(/^a plan (?:to|for this:)\s*/i, "").replace(/[.;]\s*$/, "") : "";
  if (!text) return `# ${head ? head.charAt(0).toUpperCase() + head.slice(1) : `From the explainer: ${title.charAt(0).toLowerCase()}${title.slice(1)}`}\n\n${line}\n\n## The problem\n\n${quotes}\n\n## Steps\n\n### Step 1 — <from what you said${head ? `: ${head}` : ""}>\n\n<!-- the agent writes the steps from the problem above, then deletes this comment -->\n`;
  let out = /^#\s+.+$/m.test(text) ? text.replace(/^(#\s+.+)$/m, `$1\n\n${line}`) : `${line}\n\n${text}`;
  out = /^## The problem\s*$/m.test(out) ? out.replace(/^## The problem\s*\n/m, `## The problem\n\n${quotes}\n\n`) : out.replace(line, `${line}\n\n## The problem\n\n${quotes}`);
  return out;
}
function makePlan(rp, slug, text) {
  const dir = join(rp, "plans", `${flag("date", today())}-${slug}`);
  if (existsSync(dir)) die(`${dir} exists already: pick another <slug>`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "plan.md"), text);
  return dir;
}

// the shared stage: rail slots from the plan's steps, nodes/edges from system.json, CSS from the theme (fixed)
function stageHtml(sys, plan, name) {
  const rail = sys.stage?.rail || { x: 80, y: 150, w: 500, slotH: 90, gap: 20, slots: 6 };
  const comps = (sys.components || []).filter((c) => c.stage);
  const slots = plan.steps.slice(0, rail.slots).map((s, i) => `  <div class="FID-slot" id="FID-slot-${s.n}" data-plan-step="${s.n}" style="top:${i * (rail.slotH + rail.gap)}px"><span class="n">${s.n}</span><span class="t">${(s.short || s.title).slice(0, 26)}</span></div>`);
  const nodes = comps.map((c) => `<div class="FID-node${c.stage.navy || c.kind === "store" && comps.filter((x) => x.kind === "store").indexOf(c) === 0 ? " navy" : ""}" id="FID-node-${c.id}" data-plan-component="${c.id}" style="left:${c.stage.x}px; top:${c.stage.y}px; width:${c.stage.w}px; height:${c.stage.h}px"><span class="l">${c.name}</span></div>`);
  const byId = Object.fromEntries(comps.map((c) => [c.id, c]));
  const edges = (sys.edges || []).filter((e) => byId[e.from] && byId[e.to]).map((e) => {
    if (e.path) return `  <path id="FID-e-${e.from}-${e.to}" d="${e.path}" />`;
    const a = byId[e.from].stage, b = byId[e.to].stage; const ay = a.y + a.h / 2, by = b.y + b.h / 2;
    let d;
    if (a.x + a.w <= b.x) { const mx = Math.round((a.x + a.w + b.x) / 2); d = ay === by ? `M${a.x + a.w} ${ay} L${b.x} ${by}` : `M${a.x + a.w} ${ay} L${mx} ${ay} L${mx} ${by} L${b.x} ${by}`; }
    else if (b.x + b.w <= a.x) { const mx = Math.round((b.x + b.w + a.x) / 2); d = ay === by ? `M${a.x} ${ay} L${b.x + b.w} ${by}` : `M${a.x} ${ay} L${mx} ${ay} L${mx} ${by} L${b.x + b.w} ${by}`; }
    else { const ax = a.x + a.w / 2, bx = b.x + b.w / 2; d = a.y < b.y ? `M${ax} ${a.y + a.h} L${ax} ${b.y}` : `M${ax} ${a.y} L${bx} ${b.y + b.h}`; }
    return `  <path id="FID-e-${e.from}-${e.to}" d="${d}" />`;
  });
  const css = read(join(TPL, "theme", "stage.css"));
  return `<!-- SHARED STAGE for ${name} (generated by reel stage from .reelplanning/system.json — do not hand-edit; change system.json).
     Paste into your <template>, replace every FID with "f" + your frame_id (e.g. f04-step-1). Positions/sizes are LAW so the
     stage is pixel-identical across frames and across every video for this project; per frame you change only: which slots are
     filled, opacity/dim, which edges exist, which ONE element is coral, and the small supporting elements your packet names. -->
<style>
${css.trim()}
</style>

<div class="FID-rail" id="FID-rail" style="left:${rail.x}px; top:${rail.y}px; width:${rail.w}px">
${slots.join("\n")}
</div>
<!-- empty (not yet reached) slots: dashed outline only, .n/.t at opacity 0 -->

${nodes.join("\n")}

<svg class="FID-edges" id="FID-edges" viewBox="0 0 1920 1080">
${edges.join("\n")}
</svg>

<!-- decision beats only (the player answers on these: the heading's data-question, each card's data-option): -->
<div class="FID-q" id="FID-q" data-question style="left:700px">The question, in a few words?</div>
<div class="FID-opt" id="FID-opt-a" data-option="a" data-plan-option="a" style="left:700px"><span class="k">A · RECOMMENDED</span><span class="l">Option A</span></div>
<div class="FID-opt" id="FID-opt-b" data-option="b" data-plan-option="b" style="left:1320px"><span class="k">B</span><span class="l">Option B</span></div>
`;
}
function stage() {
  const pd = resolve(argv[1] || die("usage: reel stage <plan-dir> [--out <file>]")); const rp = rpDir(pd);
  const sys = json(join(rp, "system.json")); const plan = parsePlan(read(join(pd, "plan.md")));
  // a placed component sits inside the 1920×1080 frame, with numbers for x, y, w and h (one with no `stage` is left off it)
  const misplaced = (sys.components || []).filter((c) => c.stage).filter(({ stage: s }) => ![s.x, s.y, s.w, s.h].every(Number.isFinite)
    || s.x < 0 || s.y < 0 || s.w <= 0 || s.h <= 0 || s.x + s.w > 1920 || s.y + s.h > 1080);
  if (misplaced.length) die(`reel stage: ${misplaced.map((c) => `${c.id} (${JSON.stringify(c.stage)})`).join(", ")} in system.json ${misplaced.length === 1 ? "needs" : "need"} numbers for stage x, y, w and h that keep it inside the 1920×1080 frame`);
  const out = flag("out", join(pd, "video", ".hyperframes", "stage-snippet.html"));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, stageHtml(sys, plan, basename(pd)));
  console.log(`✓ ${out}: ${plan.steps.length} slots, ${(sys.components || []).filter((c) => c.stage).length} nodes, ${(sys.edges || []).length} edges`);
}

async function check() {
  const pd = resolve(argv[1] || die("usage: reel check <plan-dir> [--blocks]")); const rp = rpDir(pd);
  const sys = json(join(rp, "system.json")); const all = json(join(rp, "decisions.json")).decisions || [];
  // An approved plan is judged against the ledger as it stood when it was approved (its approving plan
  // review's day; for one approved in conversation and built, the ledger in the commit its build started
  // from): a decision made later did not exist for it to cite. A plan not approved: the ledger as it is.
  const approval = approvalOf(pd, all), ledger = approval.ledger;
  const plan = parsePlan(read(join(pd, "plan.md")));
  const fails = [], warns = [];
  // 1. components the plan names exist in system.json (greenfield: the first plan may introduce them → warn, not fail)
  const { ids: touched, unknown } = matchComponents(plan.components, sys);
  const planName = basename(pd), named = [];
  // A part since taken out of the system is kept in system.json's "retired", with the day it went and
  // the plan that took it out. Like the ledger, the parts are as they stood: a plan approved on or before
  // that day, or the plan that retired it, named it rightly, and is checked with it (by its old id, which
  // the ledger's decisions from then carry). Any other plan is told what does its work now.
  for (const u of unknown) {
    const r = findComponent(u, sys.retired);
    if (r && (r.plan === planName || (approval.day && approval.day <= String(r.on)))) { touched.push(r.id); named.push(`${r.name} (retired ${r.on}${r.decision ? `, ${r.decision}` : ""})`); }
    else if (r) fails.push(`component "${u}" was retired on ${r.on} (${r.decision || r.plan}); its work is now in ${(r.now || []).map((id) => (sys.components || []).find((c) => c.id === id)?.name || id).join(" and ") || "other parts"}: name that instead`);
    else (sys.components?.length ? fails : warns).push(`component "${u}" is not in system.json (add it, or use its glossary name)`);
  }
  // 2. every rule on a touched component is cited as in force or superseded (D-306: the owner's answers,
  // lib/ledger.mjs). An agent's accepted call is history: never asked for by component; it comes back
  // only when a diff changes the lines it wrote (--base, below). A rule folded into spec.md is cited by
  // its section there ("spec.md#rules-player"), or by its id. This plan's own decisions are not asked
  // for: a revised plan builds on what its own review just decided, and the ledger already ties them
  // to it. The same holds for the re-ask gate below.
  const rules = ledger.filter((d) => isRule(d) && d.plan !== planName);
  const cited = new Set([...plan.inForce, ...plan.supersedesNamed]), sections = new Set(plan.specCites), unfolded = new Map();
  for (const d of rules) {
    const on = (d.components || []).filter((c) => touched.includes(c));
    if (!on.length || cited.has(d.id)) continue;
    if (d.status === "folded") { if (!sections.has(d.foldedInto)) unfolded.set(d.foldedInto, [...(unfolded.get(d.foldedInto) || []), d.id]); }
    else fails.push(`${d.id} (${d.question} → ${d.chosen}) is on a component this plan touches [${on.join(", ")}] but is neither in "Decisions in force" nor in "Supersedes"`);
  }
  for (const [at, ids] of unfolded) fails.push(`${at} holds the rules on a component this plan touches (folded there: ${ids.join(", ")}), and the plan does not cite it in "Decisions in force"`);
  for (const id of cited) if (!all.find((d) => d.id === id)) fails.push(`${id} is cited but not in the ledger`);
  const specText = existsSync(join(rp, "spec.md")) ? read(join(rp, "spec.md")) : "";
  for (const s of sections) if (!specHas(specText, s)) fails.push(`${s} is cited, but spec.md has no such section`);
  // superseded by one of this plan's own decisions is what its Supersedes asked for, once recorded
  const ownPlan = (sid) => all.find((x) => x.id === sid)?.plan === planName;
  for (const id of plan.supersedes) { const d = ledger.find((x) => x.id === id); if (d && !inForce(d) && !ownPlan(d.supersededBy) && d.supersededByPlan !== planName) fails.push(`${id} is already superseded by ${d.supersededBy || (d.supersededByPlan ? `the plan ${d.supersededByPlan}` : "a later decision")}`); }
  // 3. open questions that re-ask a decided question (keyword overlap with a rule's question + chosen) and do not supersede it
  for (const q of plan.questions) for (const d of rules) {
    if (plan.supersedes.includes(d.id)) continue;
    // An own-words answer is a paragraph: its common words ("video", "want") overlap almost any new
    // question. Match on the question it answered, and on the chosen option only when it is a label.
    const label = d.chosenId !== "own" && String(d.chosen).split(/\s+/).length <= 8;
    const o = overlap(words(q), new Set([...words(d.question), ...(label ? words(d.chosen) : [])]));
    if (o >= 2) fails.push(`open question "${q}" re-asks ${d.id} ("${d.question}" → ${d.chosen}); cite it as in force and drop the question, or list it under Supersedes with the reason`);
  }
  // 4. against a base (--base <ref>): the accepted calls whose lines the diff from there changes, in their own words
  // (lib/call-lines.mjs). A warning: the plan keeps the call, or supersedes it, and says so.
  let touchedCalls = null;
  if (flag("base")) {
    const repo = execFileSync("git", ["-C", pd, "rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
    touchedCalls = await callsTouched(rp, all, { repo, base: flag("base"), skipPlan: planName });
    if (touchedCalls == null) fails.push(`--base ${flag("base")}: git does not know it`);
    else for (const x of touchedCalls.filter((c) => !cited.has(c.d.id))) warns.push(`the diff from ${flag("base")} changes lines of ${callWords(x)} (${Object.entries(x.lines).map(([f, n]) => `${n} in ${f}`).join(", ")}): cite it in "Decisions in force" if the plan keeps it, or list it under "Supersedes"`);
  }
  // As many questions as the plan needs, one per part of about a minute (richer-review step 3). Past
  // six, the plan is probably not ready to review: say so, but do not block it.
  if (plan.questions.length > 6) warns.push(`${plan.questions.length} open questions: a plan this open may not be ready to review (one question per part means ${plan.questions.length} parts)`);
  // No format warnings (step 9, D-085): how a plan says what changes, and what each step needs, is advice
  // in the skill, not a rule this check enforces. A plan with no steps it can read is worth saying, though.
  if (!plan.steps.length) warns.push(`no steps found: write each as "### Step N — <title>" (a colon or a plain dash works too)`);
  // The four blocks (the plan guide, step 2), on a plan written since they were asked for (BLOCKS_FROM), or any plan
  // with --blocks: a step with no Cases table, or no Interface block and no "No interface" line, fails, and so does an
  // open question whose options have no example; a case with no trace, an interface part with no meaning, and a
  // "Decisions in force" line with no step are warnings. The guide shows each warning where it is.
  const due = blocksDue(pd) || argv.includes("--blocks");
  if (due) {
    const b = blockFindings(readPlanBlocks(join(pd, "plan.md")), { ledger: all, planName });
    for (const f of b.fails) fails.push(`${f.where} ${f.what}`);
    if (b.gaps.length) warns.push(b.gaps.map((g) => `${g.where}: ${g.what}`).join(" · "));
  }
  for (const f of fails) console.log(`✗ ${f}`); for (const w of warns) console.log(`△ ${w}`);
  console.log(`${fails.length ? "✗" : "✓"} ${basename(pd)}: ${plan.steps.length} steps, touches [${touched.join(", ")}], ${plan.inForce.length} in force${plan.specCites.length ? ` (and ${plan.specCites.join(", ")})` : ""}, ${plan.supersedes.length} superseded, ${fails.length} failure(s), ${warns.length} warning(s)${touchedCalls ? `; ${touchedCalls.length} accepted call(s) whose lines the diff from ${flag("base")} changes` : ""}${named.length ? `; names ${named.join(", ")}, as the system stood then` : ""}${approval.by ? `; ${approval.by === "review" ? `approved ${approval.day}` : `built from ${approval.sha} (${approval.day}), approved in conversation`}, so against the ledger as it stood then: ${ledger.length} decision(s), ${all.length - ledger.length} later one(s) left out` : ""}${due ? "" : `; its four blocks not held to (written before ${BLOCKS_FROM}; --blocks holds it)`}`);
  process.exit(fails.length ? 1 : 0);
}

// The review `reel record` records: the file named (an export, a hosted row, or one already in reviews/), else
// `fallback`, else the newest filed one, recorded again. → { given, row, ann }: `row` is the file as read, `ann`
// the review in it, with what the reviewer's browser had watched (D-128), which a hosted row may carry beside it.
function reviewToRecord(dir, fallback = null) {
  const given = argv[2] && !argv[2].startsWith("--") ? resolve(argv[2]) : fallback || listReviews(dir).at(-1)?.path;
  if (!given) die(`no review to record: pass the file the player downloaded (reel record ${relative(process.cwd(), dir) || "."} ~/Downloads/annotations.json)`);
  if (!existsSync(given)) die(`${given} not found (export it from the review player)`);
  const row = json(given), sent = reviewOf(row);
  if (!Array.isArray(sent?.annotations)) die(`${given} carries no review (no annotations)`);
  return { given, row: row === sent ? null : row, ann: row !== sent && row.watched && !sent.watched ? { ...sent, watched: row.watched } : sent };
}
// Files it under <dir>/reviews/, unless it is one filed there already. → fileReview's { id, path, again }
function fileGiven(dir, { given, row }, ann, kind) {
  if (resolve(dirname(given)) === reviewsDir(dir)) return { id: basename(given, ".json"), path: given, again: true };
  return fileReview(dir, ann, { kind, at: reviewTime(ann, row), note: row ? row.note : "", row });
}

// The version a review was of, kept for `reel rebuild` (scripts/lib/versions.mjs): once per build, as `review` keeps
// the one it opens. A video that keeps none (not built, not in git) says nothing; an error is a line, never a stop.
function keepReviewed(videoDir) {
  if (!existsSync(join(videoDir, "plan-map.json"))) return;
  try { for (const l of keepLines(keepVersion(videoDir, { by: "record" }))) console.log(l); }
  catch (e) { console.log(`△ the version reviewed not kept for \`reel rebuild\` (${e.message})`); }
}

function record() {
  const pd = resolve(argv[1] || die("usage: reel record <plan-dir> [review.json]")); const rp = rpDir(pd);
  if (existsSync(join(pd, "explain.md"))) return recordExplainer(pd, rp);
  // a review left loose in the plan folder by an older handoff (`mv … <plan-dir>/annotations.json`) moves into reviews/
  const loose = ["annotations.json", "walkthrough-annotations.json"].map((f) => join(pd, f)).find((p) => existsSync(p));
  const got = reviewToRecord(pd, loose), { given, row, ann } = got;
  // Which review this is. A plan review answers the plan's open questions; a walkthrough review judges
  // calls the agent made afterwards. Both are kept, each under its own name, every round.
  // (a review's file name says it when it has one: walkthrough-annotations.json, reviews/walkthrough-<time>.json)
  const named = /^walkthrough-/.test(basename(given)) ? "walkthrough" : /^plan-/.test(basename(given)) && resolve(dirname(given)) === reviewsDir(pd) ? "plan" : null;
  const kind = ["plan", "walkthrough"].includes(flag("kind")) ? flag("kind") : named || reviewKind(ann, row);
  const filed = fileGiven(pd, got, ann, kind);
  const mapPath = [join(pd, "video", "plan-map.json"), flag("map", "")].find((p) => p && existsSync(p));
  const map = mapPath ? json(mapPath) : null;
  const sys = json(join(rp, "system.json")); const ledgerPath = join(rp, "decisions.json"); const ledger = json(ledgerPath);
  const before = JSON.parse(JSON.stringify(ledger.decisions));
  const plan = parsePlan(read(join(pd, "plan.md"))); const { ids: touched } = matchComponents(plan.components, sys);
  const planName = basename(pd); let n = ledger.decisions.length; const added = []; const date = flag("date", (ann.exportedAt || "").slice(0, 10) || today());
  const unclear = [];
  // a decision is on the components its step names, else on every component the plan touches
  const componentsOf = (step) => { const own = step ? componentsIn(`${step.title}\n${plan.stepBodies[step.n] || ""}`, sys) : []; return own.length ? own : touched; };
  for (const made of ann.decisions || []) {
    // "Explain this more" is not an answer: nothing enters the ledger, and the question stays open
    if (asksMore(made)) { unclear.push(made); continue; }
    const q = map?.decisions?.find((d) => d.id === made.id);
    // already recorded: the same question, not just the same id. A revise can ask a new question under
    // an old id (the question that was q2 becomes q1 once the others are decided).
    const qText = q?.question || made.question || made.id;
    if (ledger.decisions.some((d) => d.plan === planName && d.questionId === made.id && (d.question === qText || !q))) continue;
    const step = plan.steps.find((s) => s.n === (made.planStep ?? q?.planStep));
    const id = `D-${String(++n).padStart(3, "0")}`;
    const entry = { id, date, plan: planName, step: step?.n ?? null, stepTitle: step?.title ?? null, questionId: made.id, question: q?.question || made.id,
      options: (q?.options || []).map((o) => ({ id: o.id, label: o.label, why: o.why, recommended: !!o.recommended })),
      chosen: made.label, chosenId: made.option, recommended: !!made.recommended, why: q?.options?.find((o) => o.id === made.option)?.why || "",
      ...(made.option === "multi" ? { chosenIds: made.options || [] } : {}),   // pick all that apply: the set, in order
      ...((made.note || "").trim() ? { note: made.note.trim() } : {}),          // the reviewer's note on the answer
      components: componentsOf(step), status: "active", supersedes: [] };
    ledger.decisions.push(entry); added.push(entry);
  }
  // A suggested edit (the plan guide, step 4; D-229) is an answer too: the reviewer's words chosen over the plan's, one
  // entry each, which the revise applies to plan.md exactly (reviews/<id>.md, "Edits to apply").
  if (kind !== "walkthrough") for (const e of editsOf(ann)) {
    if (ledger.decisions.some((d) => d.plan === planName && d.kind === "edit" && d.before === e.before && d.chosen === e.after)) continue;
    const step = plan.steps.find((s) => s.n === e.step);
    const id = `D-${String(++n).padStart(3, "0")}`;
    const entry = { id, date, plan: planName, step: step?.n ?? null, stepTitle: step?.title ?? null, questionId: `edit-${e.id || n}`, kind: "edit",
      question: `${step ? `Step ${step.n}'s ${String(e.block || "text").toLowerCase()}` : e.block || "The plan"}: the reviewer's edit`,
      options: [{ id: "after", label: e.after, why: "the reviewer's words", recommended: false }, { id: "before", label: e.before, why: "the plan's", recommended: true }],
      chosen: e.after, chosenId: "after", recommended: false, why: e.note || "the reviewer's words, applied exactly (D-229)", before: e.before, ...(e.anchor ? { anchor: e.anchor } : {}),
      components: componentsOf(step), status: "active", supersedes: [] };
    ledger.decisions.push(entry); added.push(entry);
  }
  // What the plan supersedes, once this review has answered (the plan said so, the review confirmed it): each decision
  // under its "## Supersedes" is replaced by the decision its line points to, never simply by the review's first answer
  // (that filed D-214, "narrowed for small pull requests (step 4)", under step 2's D-221). In order: a decision of this
  // plan's the line names by id; the answer to the question it names; this review's answer for the step it names, else
  // the step's decision in force from an earlier round. A line naming a question still open, or a step whose question is
  // still open, waits for that answer: the decision stays in force until a review gives it. A line that names none of
  // these (a step with no question, or no step) is replaced by the plan as a whole (`supersededByPlan`). Each id once.
  const planOwn = (d) => d.plan === planName && !["autonomy", "edit"].includes(d.kind);
  // (a line may name one of this plan's own earlier answers: it is never replaced by itself)
  const answeredNow = added.filter(planOwn), openQ = (k) => k >= 1 && k <= plan.questions.length && !answeredNow.some((d) => d.questionId === `q${k}`);
  const replaced = [], waiting = [];
  for (const l of plan.supersedeLines) {
    const d = ledger.decisions.find((x) => x.id === l.id && inForce(x)); if (!d) continue;   // a rule folded into spec.md too
    const other = (x) => x.id !== d.id;
    const byRef = l.refs.map((r) => ledger.decisions.find((x) => x.id === r && planOwn(x) && other(x) && x.status !== "superseded")).find(Boolean);
    const byQuestion = l.question != null ? answeredNow.find((x) => x.questionId === `q${l.question}` && other(x)) : null;
    const byStep = l.step != null ? answeredNow.find((x) => x.step === l.step && other(x)) || ledger.decisions.filter((x) => planOwn(x) && other(x) && x.step === l.step && inForce(x)).at(-1) : null;
    const by = byRef || byQuestion || byStep || null;
    if (!by && l.question != null && openQ(l.question)) { waiting.push(`${l.id} waits for question ${l.question}`); continue; }
    const stepOpen = l.step != null && plan.stepsOfQuestion.some((st, k) => st.includes(l.step) && openQ(k + 1));
    if (!by && stepOpen) { waiting.push(`${l.id} waits for step ${l.step}'s question`); continue; }
    d.status = "superseded"; d.supersededOn = date;
    if (by) { d.supersededBy = by.id; by.supersedes = [...new Set([...(by.supersedes || []), d.id])]; replaced.push(`${d.id} by ${by.id}${byRef ? "" : byQuestion ? ` (question ${l.question})` : ` (step ${l.step})`}`); }
    else { d.supersededByPlan = planName; replaced.push(`${d.id} by the plan as a whole${l.step != null ? ` (step ${l.step} has no decision)` : ""}`); }
  }
  // A walkthrough review's accepted calls are decisions too: the reviewer ratified a choice the plan
  // never made, and the next plan must not quietly undo it. The ledger keeps every verdict (step 8,
  // D-084): a flagged call, or one answered in the reviewer's own words, is recorded as well, with
  // status "flagged" or "own", so it is never a decision in force but its tags count for `reel stops`.
  // A quick check the reviewer disagreed with is a fix there too, even in a review with no calls.
  const wtPath = join(pd, "walkthrough.md"), wt = existsSync(wtPath) ? read(wtPath) : "";
  // the video this review came from defines its checks and calls: the walkthrough's own map for a walkthrough review
  const wtMapPath = [join(pd, "walkthrough-video", "plan-map.json"), flag("walkthrough-map", "")].find((p) => p && existsSync(p));
  const reviewedMap = kind === "walkthrough" && wtMapPath ? json(wtMapPath) : map;
  if (kind === "walkthrough" && !wt) console.log(`△ this review judged ${(ann.autonomy || []).length} call(s) and answered ${(ann.quizzes || []).length} check(s), but ${wtPath} does not exist — nothing to judge them against`);
  // Several people (the contributing plan, step 2): in a repo whose config.json lists `maintainers`, a
  // walkthrough review by anyone else is the contributor's own check before the PR. Its reviews/<id>.md
  // (the flags for their agent to fix) is written as always; its verdicts decide nothing, so none joins the
  // log. A maintainer's do. A plan review's answers join the log whoever gave them (D-201 keeps the last).
  const maintainers = maintainersOf(rp), filedAs = reviewOf(json(filed.path)), reviewer = filedAs?.recorded?.reviewer || "";
  const { id: viewerId } = identityOf(filedAs), whose = maintainerOf(filedAs, maintainers);
  const contributors = kind === "walkthrough" && maintainers.length && !whose.is;
  if (contributors) console.log(`△ a contributor's walkthrough review (${reviewer || "no reviewer recorded"}${viewerId && viewerId !== reviewer ? `, ${viewerId}` : ""} is not in config.json's maintainers: ${maintainers.join(", ")}): its accepts and flags help fix things before the PR, and add nothing to the decision log. If this is a maintainer, add ${viewerId ? `"${viewerId}"` : "them"} to \`maintainers\` and record it again.`);
  if (maintainers.length && whose.warn) console.log(`△ ${reviewer}'s review: ${whose.warn}`);
  if (kind === "walkthrough" && wt && !contributors) {
    const sc = walkthroughScope(ann, { wt, ledger: before, map: reviewedMap, planName }), own = Object.fromEntries((ann.autonomy || []).map((v) => [String(v.id).toLowerCase(), (v.own || "").trim()]));
    // a call on the list the reviewer left is logged "listed, not judged" (D-221): never a decision in force,
    // so a later plan that touches it is not warned by it
    for (const c of [...sc.accepted.map((x) => ({ ...x, verdict: "accept" })), ...sc.listed.map((x) => ({ ...x, verdict: "listed" })), ...sc.fixes.filter((f) => f.verdict === "flag" || f.verdict === "own")]) {
      const qid = `autonomy-${c.id.toLowerCase()}`, ownWords = c.verdict === "own" ? own[c.id.toLowerCase()] || "" : "";
      // the same verdict recorded already (record run twice, or a later round exporting it again) adds nothing
      const last = ledger.decisions.filter((d) => d.plan === planName && d.questionId === qid).at(-1);
      if (last && (last.verdict || "accept") === c.verdict && (last.own || "") === ownWords) continue;
      const step = plan.steps.find((s) => s.n === c.step);
      const id = `D-${String(++n).padStart(3, "0")}`;
      // judged again after a fix: the earlier verdict in force gives way to this one
      if (last?.status === "active") { last.status = "superseded"; last.supersededBy = id; last.supersededOn = date; }
      const said = c.verdict === "accept" ? "accepted" : c.verdict === "listed" ? "listed, not judged," : c.verdict === "flag" ? "flagged" : "answered in the reviewer's own words";
      const entry = { id, date, plan: planName, step: step?.n ?? c.step, stepTitle: step?.title ?? null, questionId: qid, kind: "autonomy",
        question: `${c.chose}, or ${c.insteadOf || "something else"}? (the agent's own call ${c.id}, ${said} in the walkthrough)`,
        options: [{ id: "chose", label: c.chose, why: c.why, recommended: true }, ...(c.insteadOf ? [{ id: "instead", label: c.insteadOf, why: "", recommended: false }] : [])],
        chosen: c.chose, chosenId: "chose", recommended: true, why: c.why, verdict: c.verdict, tags: c.tags || [], ...(ownWords ? { own: ownWords } : {}),
        components: componentsOf(step), status: c.verdict === "accept" ? "active" : c.verdict === "listed" ? "listed" : c.verdict === "flag" ? "flagged" : "own", supersedes: last?.status === "superseded" && last.supersededBy === id ? [last.id] : [] };
      ledger.decisions.push(entry); added.push(entry);
    }
  }
  // the human-readable ledger is regenerated from the data (append-only is enforced on the data): lib/contributing.mjs
  writeLedger(rp, ledger);
  // What to act on, next to the review: written once. The same review recorded again keeps the file
  // (and anything the agent wrote into it, a reply to the reviewer say) unless --force.
  const mdPath = join(reviewsDir(pd), `${filed.id}.md`), rel = (p) => relative(process.cwd(), p) || ".";
  const kept = filed.again && existsSync(mdPath) && !argv.includes("--force");
  // a call judged in an earlier walkthrough review of this plan is not "never judged" here
  const filedAt = reviewTime(json(filed.path)), earlier = listReviews(pd).filter((r) => r.kind === kind && r.id !== filed.id && (!filedAt || !r.at || r.at <= filedAt)).map((r) => r.review);
  if (!kept) writeFileSync(mdPath, actOnMarkdown({ id: filed.id, kind, review: json(filed.path), planName, map: reviewedMap, wt, ledgerBefore: before, ledger: ledger.decisions, earlier, videoDir: join(pd, kind === "walkthrough" ? "walkthrough-video" : "video") }));
  if (given === loose) rmSync(loose);   // it is in reviews/ now; the plan folder keeps no loose copy
  const filedReview = json(filed.path), stamp = filedReview.recorded;
  console.log(`✓ ${rel(filed.path)}${filed.again ? " (filed before)" : ""}, a ${kind} review${given === loose ? ` (moved from ${basename(loose)})` : ""}${stamp ? `, by ${stamp.reviewer || "an unknown reviewer"}${stamp.id && stamp.id !== stamp.reviewer ? ` (${stamp.id})` : ""} (reelplanning ${stamp.reelplanning})` : ""}`);
  console.log(kept ? `△ ${rel(mdPath)}: recorded before; kept as it is (--force rewrites it)` : `✓ ${rel(mdPath)}: what to act on`);
  console.log(`✓ ledger: +${added.length} (${added.map((d) => `${d.id} ${d.chosen}${d.status === "flagged" || d.status === "own" || d.status === "listed" ? ` (${d.status === "listed" ? "listed, not judged" : d.status}, not in force)` : ""}`).join("; ") || "nothing new"}), ${ledger.decisions.length} total`);
  if (replaced.length) console.log(`✓ supersedes: ${replaced.join("; ")}`);
  if (waiting.length) console.log(`△ supersedes, not yet: ${waiting.join("; ")} (still in force; a later round's record replaces it)`);
  if (unclear.length) console.log(`△ asked to explain more, not decided: ${unclear.map((d) => d.id).join(", ")} — the revise explains ${unclear.length === 1 ? "it" : "them"} with examples and asks again`);
  keepReviewed(join(pd, kind === "walkthrough" ? "walkthrough-video" : "video"));
  // Your memory (step 3, D-106): a short summary of this review goes into your own file, outside any
  // repo, so `reel memory --you` can work out your taste across repos. Once per review; said here, so
  // it is never a surprise that it went there.
  // the video reviewed, by the review page's name for it: what the review watched is recorded under it (D-128)
  const facts = reviewFacts({ id: filed.id, kind, at: reviewTime(filedReview), review: filedReview },
    { plan: planName, map: reviewedMap, calls: parseCalls(wt), ledger: ledger.decisions, steps: stepComponents(pd, sys), repo: repoName(pd), video: kind === "walkthrough" ? `${planName}--walkthrough` : planName });
  // A run fenced to the repo (D-082's sandbox) may not write there: the summary then waits in the repo's
  // .reelplanning/you.pending.jsonl, committed with the review, and the next record (or `reel memory
  // --you`) that can write your file moves it in (A15, as the owner answered it).
  const yp = youPath().replace(process.env.HOME || "\0", "~"), pp = rel(pendingPath(rp));
  const you = recordYou(facts, rp), why = you.error ? ` (${you.error.code || you.error.message})` : "";
  const moved = you.moved ? `; ${you.moved === 1 ? "1 summary" : `${you.moved} summaries`} waiting in ${pp} moved there too` : "";
  console.log({
    added: `✓ your memory: a summary of this review added to ${yp} (reel memory --you)${moved}`,
    again: `· your memory: this review is already in ${yp}${moved}`,
    "no-repo": `· your memory: not in a git repo, so nothing added to ${yp}`,
    pending: `△ your memory: could not write ${yp}${why}, so a summary of this review is kept in ${pp} (commit it with the review); the next \`reel record\` or \`reel memory --you\` that can write ${yp} moves it there`,
    "pending-again": `△ your memory: could not write ${yp}${why}; this review is already kept in ${pp}, to be moved there by the next run that can write it`,
    lost: `△ your memory: could not write ${yp} nor ${pp}${why}; this review is recorded, but not in your memory`,
  }[you.status]);
}

// An explainer's review (explain-first step 3): filed under the explainer's reviews/ as explainer-<time>, with a .md of
// your comments by scene, your questions and what you want next. Nothing goes into the decision log: it holds only
// answers to a plan's questions, and an explainer asks none. Your memory gets what you watched and looked up (D-218).
function recordExplainer(ed, rp) {
  const got = reviewToRecord(ed), had = got.ann;
  // filed as the plan's interface says it: { kind: "explainer", end: "done" | "more" | "plan", … } (a page from before the
  // player said them has only its verdict)
  const ann = had.kind === "explainer" && had.end !== undefined ? had : { ...had, kind: "explainer", end: endOf(had) };
  const filed = fileGiven(ed, got, ann, "explainer");
  const review = json(filed.path), name = basename(ed), rel = (p) => relative(process.cwd(), p) || ".";
  const mdPath = join(reviewsDir(ed), `${filed.id}.md`), kept = filed.again && existsSync(mdPath) && !argv.includes("--force");
  if (!kept) writeFileSync(mdPath, explainerReviewMd({ id: filed.id, review, name }));
  const end = endOf(review);
  console.log(`✓ ${rel(filed.path)}${filed.again ? " (filed before)" : ""}, an explainer review: ${end ? END_WORDS[end] : "not finished"}; ${commentsOf(review).length} comment(s), ${askedOf(review).length} question(s)`);
  console.log(kept ? `△ ${rel(mdPath)}: recorded before; kept as it is (--force rewrites it)` : `✓ ${rel(mdPath)}: your comments by scene, your questions, what you want next`);
  console.log("· ledger: nothing added (an explainer asks no questions, and only an answer is a decision)");
  keepReviewed(join(ed, "video"));
  const map = existsSync(join(ed, "video", "plan-map.json")) ? json(join(ed, "video", "plan-map.json")) : null;
  const facts = reviewFacts({ id: filed.id, kind: "explainer", at: reviewTime(review), review }, { plan: name, map, repo: repoName(ed), video: `${name}--explainer` });
  const you = recordYou(facts, rp), yp = youPath().replace(process.env.HOME || "\0", "~");
  console.log(you.status === "added" ? `✓ your memory: what you watched and looked up added to ${yp}` : you.status === "again" ? `· your memory: this review is already in ${yp}` : `△ your memory: ${you.status} (${yp})`);
  // what was picked at Finish (step 3): a suggestion drawn from this video, or your own words; the next step starts from it
  const nx = nextOf(review), picked = nx && nx.end === end ? String(nx.words || nx.pick?.text || "").trim().split("\n")[0] : "";
  if (picked) console.log(`· what you want next${nx.pick ? `, picked from Finish's suggestions${nx.edited ? " and edited" : ""}` : ", in your words"}: "${picked}"${nx.pick?.scene != null ? ` (scene ${nx.pick.scene})` : ""}`);
  if (end === "plan") console.log(`next: Plan this: \`reel new-plan ${relative(process.cwd(), dirname(rp)) || "."} <slug> --from ${rel(ed)}\`, then write its steps from what you said${picked ? " (the draft is titled by what you picked)" : ""}`);
  else if (end === "more") console.log(`next: Explain more: ${picked ? `start from what you picked${nx.pick?.scene != null ? `, rebuilding scene ${nx.pick.scene}` : ", a scene for it"}; ` : ""}rebuild the scenes the comments are on, add a scene for each question, and build again (fresh eyes again)`);
}

// The floor under the code check (close-the-lifecycle, step 3): before a walkthrough video is built,
// its report must account for the whole plan. Deterministic on purpose — an agent reviewing the diff
// catches drift; this catches a report that simply leaves things out.
function audit() {
  const pd = resolve(argv[1] || die("usage: reel audit <plan-dir>")); const rp = rpDir(pd);
  const wtPath = join(pd, "walkthrough.md"); if (!existsSync(wtPath)) die(`${wtPath} not found (the implement step writes it)`);
  const wt = read(wtPath); const plan = parsePlan(read(join(pd, "plan.md"))); const planName = basename(pd);
  const ledger = json(join(rp, "decisions.json")).decisions || [];
  const fails = [];
  const stepSection = (n) => { const m = wt.match(new RegExp(`^### Step ${n}\\b[^\\n]*\\n([\\s\\S]*?)(?=^#{2,3} |(?![\\s\\S]))`, "m")); return m ? m[1] : null; };
  const namesFile = (s) => /`[^`\s]*(\/|\.[a-z0-9]{1,5}\b)[^`]*`/i.test(s || "");
  // 1. every plan step has an entry
  for (const s of plan.steps) if (stepSection(s.n) == null) fails.push(`step ${s.n} (${s.title}) has no "### Step ${s.n}" entry in walkthrough.md`);
  // 2. every decision this plan made, and every one it cites, is said to hold — and this plan's own
  //    decisions point at the code that carries them
  const own = ledger.filter((d) => d.plan === planName && isRule(d));
  const cited = plan.inForce.map((id) => ledger.find((d) => d.id === id)).filter(Boolean);
  // said = the id appears, or every word of the chosen option appears on one line ("server manifest id" says "Server id")
  const said = (d) => { const w = String(d.chosen).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); return new RegExp(`\\b${d.id}\\b`).test(wt) || wt.toLowerCase().split("\n").some((l) => w.every((x) => l.includes(x))); };
  for (const d of [...own, ...cited.filter((c) => !own.includes(c))]) if (!said(d)) fails.push(`${d.id} (${d.question} → ${d.chosen}) is never mentioned: say whether the code holds to it`);
  for (const d of own) if (d.step != null && stepSection(d.step) != null && !namesFile(stepSection(d.step))) fails.push(`${d.id} (${d.chosen}) is on step ${d.step}, but that step's entry names no file to check it in`);
  // 3. every call the agent made on its own says where to look; a tag it does not know is named
  const warns = [];
  for (const c of parseCalls(wt).filter((x) => x.kind !== "small")) {
    if (!c.check) fails.push(`${c.id} (${c.chose}) has no "check" — where should the reviewer look?`);
    if (c.unknown.length) warns.push(`${c.id} has tag${c.unknown.length > 1 ? "s" : ""} ${c.unknown.join(", ")} that no rule knows (the tags are ${TAGS.join(", ")})`);
  }
  //    a step with five or more choices and no question about it in plan.md fails (D-110): at the fifth,
  //    the implementer stops and puts that step's biggest open choice into plan.md as a question
  //    (a plan dated before D-110 was not bound by it: a warning)
  const d110 = ledger.find((d) => d.id === "D-110"), before110 = !!(d110?.date && (planName.match(/^\d{4}-\d{2}-\d{2}/) || [])[0] < d110.date);
  //    a question already answered counts too: it left plan.md's open questions for the decision log
  const asked = new Set(ledger.filter((d) => d.plan === planName && d.kind !== "autonomy" && d.step != null).map((d) => d.step));
  //    calls outside the plan's steps (an ask of the owner's during the build, its step column a word such as
  //    "zoom") are counted by that word, each ask on its own, not lumped together as one step "?" (`askOf`,
  //    as `reel stops` beats them: a call whose column names no ask, "—", is an ask of its own)
  const outside = new Map(parseCalls(wt).filter((c) => c.step == null).map((c) => [c.id, askOf(c)]));
  const perStep = new Map();
  for (const c of parseCalls(wt).filter((x) => x.kind === "call")) { const k = c.step ?? outside.get(c.id) ?? null; perStep.set(k, [...(perStep.get(k) || []), c.id]); }
  for (const [step, ids] of [...perStep].sort((a, b) => (typeof a[0] === "number" ? a[0] : Infinity) - (typeof b[0] === "number" ? b[0] : Infinity)))
    if (typeof step === "string") { if (ids.length >= STEP_CALLS) warns.push(`"${step}" (outside the plan's steps) has ${ids.length} choices (${ids.join(", ")}): at its ${STEP_CALLS}th choice, the biggest open one is asked of the owner (D-110)`); }
    else if (ids.length >= STEP_CALLS && !plan.questionSteps.includes(step) && !asked.has(step)) (before110 ? warns : fails).push(`${before110 ? `(before D-110, so not a failure) ` : ""}step ${step ?? "?"} has ${ids.length} choices (${ids.sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))).join(", ")}) and no question about it was asked (none in plan.md's open questions or the decision log): at its ${STEP_CALLS}th choice, stop and put the step's biggest open choice into plan.md's open questions as "(step ${step ?? "?"})" (D-110)`);
  //    and past a dozen calls in the whole walkthrough (calls and deviations, whichever steps they are in)
  //    the plan left too much open: a warning, not a failure, even when no step reaches five (fewer-better-stops step 3)
  const load = callLoad(parseCalls(wt).map((c) => ({ ...c, step: c.step ?? outside.get(c.id) ?? null })));
  if (load.total > MANY_CALLS) warns.push(`${load.total} calls; ${typeof load.step === "string" ? `"${load.step}"` : `step ${load.step ?? "?"}`} has ${load.n}. Past ${MANY_CALLS}, the plan left too much open: a step expected to need ${STEP_CALLS} or more calls asks its biggest as a question instead, and a step that reaches its ${STEP_CALLS}th during the build waits for one (D-110)`);
  // 4. the second agent's code check (D-001): every ✗ it raised is answered in walkthrough.md's
  //    "## Code check" section — as a deviation, a new autonomy row, or why it is not one. Findings are
  //    reported, never fixed quietly, and never dropped.
  const findingsPath = join(pd, "code-check", "findings.md");
  if (!existsSync(findingsPath)) warns.push(`no code check yet: \`reelplanning code-check ${basename(pd)} --base <ref>\`, then a fresh agent writes code-check/findings.md`);
  else {
    const cc = (wt.match(/^## Code check\b[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m) || [])[1];
    // a finding's verdict is "— ✗" right after its key; a ✗ quoted inside a ✓ line is not one
    const keys = read(findingsPath).split("\n").filter((l) => /^- (Step \d+|D-\d{3}|`[^`]+`) — ✗/.test(l)).map((l) => (l.match(/^- (Step \d+|D-\d{3}|`[^`]+`)/) || [])[1]).filter(Boolean);
    for (const k of keys) if (!(cc || "").includes(k)) fails.push(`code check ✗ ${k} is not answered in walkthrough.md's "## Code check" section${cc == null ? " (there is none yet)" : ""}`);
  }
  // A walkthrough the owner has accepted is settled history (D-309): what it breaks of these rules is said,
  // as notes, and fails nothing. One not yet accepted (to review, fixes to make, fixed, a new round) is held
  // to every rule, and so is one a contributor accepted in a repo that lists its maintainers (their own check
  // before the PR, which settles nothing).
  const st = planStage(pd, { ledger }), role = st.lastWalk ? roleOf(st.lastWalk.review, maintainersOf(rp)) : null;
  const settled = st.stage === "accepted" && role !== "contributor", acceptedOn = String(st.lastWalk?.at || "").slice(0, 10);
  if (st.stage === "accepted" && !settled && fails.length) warns.push(`accepted by a contributor, not one of config.json's maintainers: held to every rule until a maintainer accepts it`);
  for (const f of fails) console.log(settled ? `△ (accepted${acceptedOn ? ` on ${acceptedOn}` : ""}, so not a failure) ${f}` : `✗ ${f}`);
  for (const w of warns) console.log(`△ ${w}`);
  const failing = settled ? 0 : fails.length;
  console.log(`${failing ? "✗" : "✓"} ${planName}: ${plan.steps.length} step(s), ${own.length} own decision(s), ${cited.length} cited, ${failing} failure(s)${settled && fails.length ? `; ${fails.length} rule break(s) kept as notes: this walkthrough was accepted${acceptedOn ? ` on ${acceptedOn}` : ""}, so it is settled history` : ""}`);
  process.exit(failing ? 1 : 0);
}

// Which of the agent's calls pause the walkthrough video (walkthroughs-that-help step 2), read while its
// storyboard is written: an off-plan change always pauses; a call you'd notice (`visible`) or can't easily
// undo (`hard-to-undo`) pauses, the calls of a step on one stop beat (`- autonomy: a3, a4`), its scene showing
// it running; every other call goes on the list at the video's end (`- autonomy_list: a5, a7`, D-221). The
// rule is `stopFor` in lib/autonomy.mjs.
function stops() {
  const pd = resolve(argv[1] || die("usage: reel stops <plan-dir>")); const rp = rpDir(pd);
  const wtPath = join(pd, "walkthrough.md"); if (!existsSync(wtPath)) die(`${wtPath} not found (the implement step writes it)`);
  const ledger = json(join(rp, "decisions.json")).decisions || [];
  const calls = parseCalls(read(wtPath)).filter((c) => c.kind !== "small");
  if (!calls.length) { console.log(`· ${basename(pd)}: no calls in walkthrough.md's autonomy table`); return; }
  const w = Math.max(...calls.map((c) => c.id.length));
  // a recent miss (a late fix) makes a call pause when it shares a label with it (D-122); a miss with no
  // labels pauses nothing directly (D-109)
  const sys = existsSync(join(rp, "system.json")) ? json(join(rp, "system.json")) : {};
  const misses = findMisses(rp, { ledger, sys }).filter((m) => m.recent);
  const res = calls.map((c) => ({ c, ...stopFor(c, misses) }));
  // where each call sits: its step, or the ask it answers when it is outside the plan's steps (an ask of
  // the owner's during the build, its step column a word such as "zoom"; one with no word, its own id)
  const pw = Math.max(8, ...calls.map((c) => placeOf(c).length));
  for (const { c, stops: s, why } of res) console.log(`${c.id.padEnd(w)}  ${placeOf(c).padEnd(pw)} ${s ? "pauses" : "listed"}  ${why}${c.tags.length ? `  [${c.tags.join(", ")}]` : ""}`);
  // the beats, by step (fewer-better-stops step 1): a step's calls that pause share one beat, a deviation
  // keeps its own; the listed calls share one list at the end of the video. Calls outside the steps are
  // beaten the same way per ask, each ask on its own, never lumped together as one step "?".
  const beats = beatsByStep(res), ids = (xs) => xs.join(", "), list = listedOf(beats), paused = beats.filter((b) => b.stop.length || b.deviations.length);
  const bw = Math.max(8, ...beats.map((b) => b.place.length));
  console.log(`\nThe beats${paused.some((b) => b.step == null) ? ", by step, then each ask outside the steps" : ", by step"} (each line is one pause, in the scene that shows it running):`);
  if (!paused.length) console.log("  (none: nothing you'd notice or can't easily undo, and no off-plan change)");
  for (const b of paused) {
    const lines = [b.stop.length && `- autonomy: ${ids(b.stop)}${b.stop.length > 1 ? `   (${b.stop.length} calls share this pause)` : ""}`,
      ...b.deviations.map((d) => `- autonomy: ${d}   (an off-plan change: a pause of its own)`)].filter(Boolean);
    lines.forEach((l, i) => console.log(`  ${(i ? "" : b.place).padEnd(bw)}  ${l}`));
  }
  if (list.length) console.log(`  ${"the end".padEnd(bw)}  - autonomy_list: ${ids(list)}   (the list: one line each, each with its own Flag; Approve takes the rest, listed, not judged)`);
  const nStop = res.filter((r) => r.stops && r.c.kind !== "deviation").length, nDev = res.filter((r) => r.c.kind === "deviation").length;
  const stopBeats = beats.filter((b) => b.stop.length).length;
  console.log(`\n${nStop} call(s) pause, in ${stopBeats} stop beat(s) (one per step${beats.some((b) => b.step == null) ? " or ask" : ""}); ${nDev} off-plan change(s), each on its own beat; ${list.length} on the list. The video pauses ${stopBeats + nDev} time(s) for what you'd notice or can't easily undo${list.length ? ", and once at the end for the list" : ""}. An off-plan change said only in prose still pauses.`);
}

// The accepted calls none of whose lines is left (lib/call-lines.mjs), or null outside git.
async function outlivedOf(rp, ledger) {
  let repo; try { repo = execFileSync("git", ["-C", rp, "rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return null; }
  return callsOutlived(rp, ledger, { repo });
}

async function status() {
  // a folder of setup files only (the hosted voice's .env, config.json): said plainly, not a crash on decisions.json
  { const at = findRpDir(argv[1] || "."); if (at && !rpInitialized(at)) { console.log(`· ${NOT_SET_UP(at)}`); return; } }
  const rp = rpDir(argv[1] || "."); const plans = existsSync(join(rp, "plans")) ? readdirSync(join(rp, "plans")).filter((p) => existsSync(join(rp, "plans", p, "plan.md"))).sort() : [];
  const ledger = json(join(rp, "decisions.json")).decisions || [];
  // where each plan stands: from its files, its reviews/ and the ledger (lib/reviews.mjs planStage)
  console.log(`| plan | stage | reviews | decisions |\n|---|---|---|---|`);
  for (const p of plans) {
    const st = planStage(join(rp, "plans", p), { ledger });
    const rv = [st.reviews.plan && `${st.reviews.plan} plan`, st.reviews.walkthrough && `${st.reviews.walkthrough} walkthrough`].filter(Boolean).join(", ") || "·";
    const ids = ledger.filter((x) => x.plan === p).map((x) => x.id);
    console.log(`| ${p} | ${st.label} | ${rv} | ${ids.length ? ids.length > 6 ? `${ids.length}: ${ids[0]}…${ids.at(-1)}` : ids.join(" ") : "·"} |`);
  }
  // the rules a plan is held to, and the accepted calls kept as history (D-306, lib/ledger.mjs)
  const folded = ledger.filter((d) => d.status === "folded").length;
  console.log(`\n${ledger.filter(isRule).length} rule(s) in force${folded ? ` (${folded} folded into spec.md)` : ""}, ${ledger.filter(isHistory).length} accepted call(s) kept as history, ${ledger.length} decision(s) in all; ${json(join(rp, "system.json")).components?.length || 0} component(s)`);
  const calls = await outlivedOf(rp, ledger);
  if (calls) console.log(`${calls.outlived.length ? "△" : "·"} accepted calls: ${calls.live} still on lines their commits wrote${calls.outlived.length ? `, ${calls.outlived.length} outlived (none of their lines left: \`reel memory outlived\`)` : ""}${calls.unplaced.length ? `, ${calls.unplaced.length} not placed (their plan names no commits)` : ""}`);
  systemVideoStatus(rp);
  // What reviews show (memory, step 2): at most seven lines, worked out now from the ledger and every
  // plan's reviews/, each with the id `reel memory <id>` takes; then a retro when one is due (D-107).
  const mem = repoMemory(rp), at = relative(process.cwd(), dirname(rp)) || ".";
  if (mem.lines.length) console.log(`\nWhat reviews show (\`reel memory <id>\` for the evidence):\n${mem.lines.map((l) => `  ${`[${l.id}]`.padEnd(14)}${l.text}`).join("\n")}`);
  if (mem.retro.due) console.log(`\n△ a retro is due: ${mem.retro.why.join("; ")}. \`reel retro ${at}\` starts its plan; you decide whether to hold it.`);
  // walkthroughs-that-help step 6: the first three timed walkthrough reviews all missed the bar. The agent's next
  // plan proposes dropping the walkthrough video, as a plan reviewed like any other; nothing changes until it is approved.
  const bar = walkthroughBar(mem.facts);
  if (bar.due) console.log(`\n△ walkthroughs: still accepted without a look (${bar.missed} of ${bar.reviews.length}), a plan to drop the walkthrough video is due`);
}

function systemVideoStatus(rp) {
  // The system video is made from spec.md, system.json and glossary.md. When any of them moved on
  // since it was last built, it describes a system that no longer exists — and new people trust it.
  const sv = join(rp, "system-video");
  if (!existsSync(join(sv, "index.html"))) { console.log("· no system video yet"); return; }
  // rendering the video to MP4 (renders/, and the .gitignore line that tracks them) is not rebuilding it:
  // a render committed after a spec change must not make a stale video read as current
  const built = lastChanged(sv, ["renders", ".gitignore"]); const newer = ["spec.md", "system.json", "glossary.md"].filter((f) => existsSync(join(rp, f)) && lastChanged(join(rp, f)) > built);
  // glossary.md edited since: behind only when a row it explains changed. Its "Other words" (D-216) are
  // meanings only, so a row added there leaves the video current (spec-diff reads the rows themselves)
  let sd = null; const specDiff = () => (sd ??= (() => { try { return JSON.parse(execFileSync("node", [join(ROOT, "scripts", "spec-diff.mjs"), rp, "--json"], { encoding: "utf8" })); } catch { return null; } })());
  if (newer.includes("glossary.md")) { const g = specDiff()?.glossary; if (g && ![...g.added, ...g.changed, ...g.removed].length) newer.splice(newer.indexOf("glossary.md"), 1); }
  // a glossary row no beat of the system video explains (a new row, say) makes it behind, however recent the
  // build: the system video is the promise that every word is explained (videos-you-can-follow, step 1)
  const undef = existsSync(join(sv, "STORYBOARD.md")) ? definesIndex(rp).undefined : [];
  if (!newer.length && !undef.length) { console.log("✓ the system video is current"); return; }
  if (undef.length && !newer.includes("glossary.md")) newer.push("glossary.md");
  console.log(`△ the system video is behind ${newer.join(", ")}${undef.length ? `: no beat explains ${undef.length > 6 ? `${undef.slice(0, 6).join(", ")} and ${undef.length - 6} more` : undef.join(", ")}` : ""}`);
  // what an update would touch, before anything runs (D-003: it has to stay cheap, so say the cost first)
  try {
    const d = specDiff(); if (!d) throw new Error("no spec-diff");
    const sb = existsSync(join(sv, "STORYBOARD.md")) ? read(join(sv, "STORYBOARD.md")) : "";
    const total = (sb.match(/^## Frame /gm) || []).length;
    // the cost is the lines to narrate (`reelplanning narrate` keeps every other line), not the whole video
    console.log(`  an update would rebuild ${d.frames.length} of ${total} frame(s): ${d.frames.map((f) => f.frame).join(", ") || "none"}${d.narration ? `\n  with ${d.narration.sentence}` : ""}`);
    console.log(`  \`reelplanning spec-diff ${relative(process.cwd(), rp) || "."}\` says why each one; nothing is rebuilt or rendered until you ask`);
  } catch { console.log(`  \`reelplanning spec-diff ${relative(process.cwd(), rp) || "."}\` names the frames to rebuild`); }
}

// `reel prereqs <plan-dir> [--walkthrough] [--dry-run]` (videos-you-can-follow, step 2): what a viewer
// should watch before this plan's video, written as its storyboard's `before:` lines, so the author no
// longer guesses them.
//   - the system video, always: the chapter whose scenes say most of what the plan's steps say (the
//     distinctive words they share, over the root of the chapter's own; ties go to the chapter showing
//     more of the parts the plan touches), and a second within 90% of it. With no system video, all of it.
//   - an earlier plan's video, when this plan builds on one of its decisions ("Decisions in force" and
//     "Supersedes"; a bullet that says "not touched" does not count), or its video is the only one that
//     defines a word this video says (the terms index). A decision on a call points to the walkthrough.
//   - at most two besides the system video: the ones it builds on most, to watch first.
//   - `recap:` lines, one for every earlier video it builds on, the two listed included (the owner's review of
//     videos-you-can-follow, its quick check k2): the short recap scene for new viewers (`- knowledge: new`)
//     sums up each in one line, so a viewer who watches none of them still has the gist.
// Each line says when your file across repos (D-106, D-128) has the video as watched; the card ticks it off.
const PREREQ_PLANS = 2;
function prereqs() {
  const pd = resolve(argv[1] && !argv[1].startsWith("--") ? argv[1] : die("usage: reel prereqs <plan-dir> [--walkthrough] [--dry-run]")), rp = rpDir(pd);
  if (!existsSync(join(pd, "plan.md"))) die(`no plan.md in ${pd}: prereqs takes a plan folder, .reelplanning/plans/<plan>`);
  const walk = argv.includes("--walkthrough"), vdir = join(pd, walk ? "walkthrough-video" : "video"), sbPath = join(vdir, "STORYBOARD.md");
  const plan = parsePlan(read(join(pd, "plan.md"))), sys = existsSync(join(rp, "system.json")) ? json(join(rp, "system.json")) : {};
  const touched = new Set(matchComponents(plan.components, sys).ids), name = (id) => (sys.components || []).find((c) => c.id === id)?.name || id;
  const lines = [];
  // 1. the system video's chapters on the parts this plan touches
  const svSb = existsSync(join(rp, "system-video", "STORYBOARD.md")) ? read(join(rp, "system-video", "STORYBOARD.md")) : "";
  if (svSb) {
    const ch = []; let cur = null;
    for (const f of storyboardFrames(svSb).sort((a, b) => a.index - b.index)) {
      if (f.meta.chapter_start) ch.push(cur = { n: ch.length + 1, title: f.meta.chapter_start, text: "", parts: new Set(), weight: 0 });
      if (!cur) continue;
      cur.text += ` ${f.title} ${f.meta.voiceover || ""}`;
      const comps = listOf(f.meta.components), hit = comps.filter((c) => touched.has(c)); for (const c of hit) cur.parts.add(c);
      if (comps.length) cur.weight += hit.length / comps.length;
    }
    const steps = distinctive(parseSteps(read(join(pd, "plan.md"))).map((x) => `${x.title} ${x.text}`).join(" "));
    for (const c of ch) { const cw = distinctive(c.text); let n = 0; for (const w of steps) if (cw.has(w)) n++; c.score = cw.size ? n / Math.sqrt(cw.size) : 0; }
    const best = ch.filter((c) => c.score > 0).sort((a, b) => b.score - a.score || b.weight - a.weight || a.n - b.n);
    const pick = best.filter((c, i) => i < 2 && c.score >= best[0].score * 0.9).sort((a, b) => a.n - b.n);
    const lower = (t) => t.charAt(0).toLowerCase() + t.slice(1);
    for (const c of pick) lines.push({ video: "system", part: c.n, gives: `${lower(c.title)}${c.parts.size ? `, with ${[...c.parts].map((id) => lower(name(id))).join(", ")}` : ""}` });
  }
  if (!lines.length) lines.push({ video: "system", gives: "what the parts are and how a review goes" });
  // 2. earlier plans: the decisions this plan builds on, and the words only their videos explain
  const ledger = existsSync(join(rp, "decisions.json")) ? json(join(rp, "decisions.json")).decisions || [] : [];
  const md = read(join(pd, "plan.md")), me = basename(pd), by = new Map();
  const cited = [...section(md, "Decisions in force").split(/\n(?=- )/).filter((b) => !/not touched/i.test(b)).flatMap((b) => [...b.matchAll(/\bD-\d{3}\b/g)].map((m) => m[0])), ...plan.supersedes];
  const videoOf = (p, onCall) => { const w = join(rp, "plans", p, "walkthrough-video"), v = join(rp, "plans", p, "video"), has = (d) => existsSync(join(d, "STORYBOARD.md")) || existsSync(join(d, "plan-map.json"));
    return onCall && has(w) ? `${p}--walkthrough` : has(v) ? p : has(w) ? `${p}--walkthrough` : null; };
  const clip = (t, n = 70) => { t = String(t || "").replace(/\s+/g, " ").trim(); return t.length > n ? `${t.slice(0, n - 1).replace(/[\s,;:]+\S*$/, "")}…` : t; };
  [...new Set(cited)].forEach((id, order) => {
    const d = ledger.find((x) => x.id === id); if (!d || d.plan >= me) return;   // an earlier plan's, never this one's
    const v = videoOf(d.plan, d.kind === "autonomy"); if (!v) return;
    const e = by.get(v) || { video: v, score: 0, first: order, ids: [], what: clip(d.kind === "autonomy" ? d.chosen : d.question, 60) }; e.score++; e.ids.push(id); by.set(v, e);
  });
  for (const e of by.values()) e.why = [`decision${e.ids.length > 1 ? "s" : ""} ${e.ids.join(", ")}: ${e.what.charAt(0).toLowerCase()}${e.what.slice(1)}`];
  if (existsSync(sbPath)) {
    const idx = definesIndex(rp), glossary = glossaryFor(rp), sb = read(sbPath);
    const said = storyboardFrames(sb).map((f) => f.meta.voiceover || "").join(" ") + " " + (existsSync(join(vdir, "SCRIPT.md")) ? read(join(vdir, "SCRIPT.md")) : "");
    const ownDefs = new Set(storyboardFrames(sb).flatMap((f) => listOf(f.meta.defines)).map((w) => rowFor(glossary, w)?.forms[0] || w.toLowerCase()));
    for (const [key, where] of Object.entries(idx.words)) {
      if (ownDefs.has(key) || where.some((x) => x.video === "system")) continue;
      const forms = rowFor(glossary, key)?.forms || [key];
      if (!forms.some((w) => saysWord(said, w))) continue;
      const other = where.find((x) => x.video !== slugOf(vdir) && x.video.replace(/--walkthrough$/, "") < me); if (!other) continue;
      const e = by.get(other.video) || { video: other.video, score: 0, first: Infinity, why: [] }; e.score++; e.why.push(`explains "${key}"`); by.set(other.video, e);
    }
  }
  // most decisions first; then the one the plan cites first (a plan lists what it builds on most first)
  const ranked = [...by.values()].sort((a, b) => b.score - a.score || a.first - b.first || b.video.localeCompare(a.video));
  const plans = ranked.slice(0, PREREQ_PLANS), rest = ranked.slice(PREREQ_PLANS);
  for (const p of plans) lines.push({ video: p.video, gives: p.why.slice(0, 2).join("; ") });
  // a plan that starts from an explainer (explain-first step 4, D-248) leans on it: it comes first under Before you
  // watch, and the recap scene says it in a line for anyone who did not watch it; the plan video starts at what changes
  const ex = (md.match(/^Explained first: `([^`]+)`/m) || [])[1], exDir = ex && join(rp, "explainers", ex);
  const exWhat = exDir && existsSync(join(exDir, "explain.md")) ? (read(join(exDir, "explain.md")).match(/^#\s+(.+)$/m) || [])[1] || ex : null;
  if (ex && !exWhat) console.log(`△ plan.md says it was explained first by ${ex}, but .reelplanning/explainers/${ex}/ has no explain.md`);
  const exLine = exWhat ? { video: `${ex}--explainer`, gives: `the explainer this plan starts from: ${exWhat.charAt(0).toLowerCase()}${exWhat.slice(1)}, and what you said on it` } : null;
  if (exLine) lines.unshift(exLine);
  // the recap: every earlier video, in the same order, each with its plan's title and what it gives this one
  const titleOf = (v) => { const f = join(rp, "plans", v.replace(/--walkthrough$/, ""), "plan.md"); return existsSync(f) ? (read(f).match(/^#\s+(.+)$/m)?.[1] || "").replace(/^plan:\s*/i, "").trim() : ""; };
  const recap = [...(exLine ? [`recap: ${exLine.video} | ${clip(exWhat, 60)}: the explainer you watched first, and your review of it (say it in two lines)`] : []),
    ...ranked.map((r) => { const t = titleOf(r.video); return `recap: ${r.video} | ${t ? `${clip(t, 60)}: ` : ""}${r.why.slice(0, 2).join("; ")}`; })];
  // what your file says you have watched, in this repo (D-128): said beside each line
  let seen = new Set(); try { const repo = repoName(pd); seen = new Set(youKnows(readYou()).watched.filter((w) => !repo || !w.repo || w.repo === repo).map((w) => w.video)); } catch { /* no file yet */ }
  const text = lines.map((l) => `before: ${l.video}${l.part ? `#part ${l.part}` : ""} | ${l.gives}`);
  const rel = (p) => relative(process.cwd(), p) || ".";
  console.log(`What to watch before ${walk ? "the walkthrough video" : "the plan video"} of ${me}:`);
  lines.forEach((l, i) => console.log(`  ${text[i]}${seen.has(l.video) || (l.part && seen.has(`${l.video}#part ${l.part}`)) ? "   (your file: watched)" : ""}`));
  if (recap.length) {
    console.log(`The recap scene for new viewers (\`- knowledge: new\`) sums up ${recap.length === 1 ? "the one earlier video" : `all ${recap.length} earlier videos`} it builds on${rest.length ? `, the ${plans.length} listed above included (the other ${rest.length} are not on the card)` : ""}: one plain line each, about 3 s a line, so a viewer who watches none of them still has the gist:`);
    const recapVideos = [...(exLine ? [exLine.video] : []), ...ranked.map((r) => r.video)];
    recap.forEach((l, i) => console.log(`  ${l}${seen.has(recapVideos[i]) ? "   (your file: watched)" : ""}`));
  }
  if (argv.includes("--dry-run")) return;
  if (!existsSync(sbPath)) { console.log(`· no ${rel(sbPath)} yet: these lines go in its front matter (run this again once it exists, and they are written there)`); return; }
  const sb = read(sbPath), fm = frontMatter(sb); if (!fm && !/^---\n/.test(sb)) die(`${rel(sbPath)} has no front matter to write \`before:\` into`);
  const kept = fm.split("\n").filter((l) => !/^(before|recap):/.test(l));
  writeFileSync(sbPath, sb.replace(/^---\n[\s\S]*?\n---/, `---\n${[...kept, ...text, ...recap].join("\n")}\n---`));
  console.log(`✓ ${rel(sbPath)}: ${text.length} \`before:\` line(s)${recap.length ? ` and ${recap.length} \`recap:\` line(s)` : ""} written (the ones there before replaced)`);
}

// `reel memory [<repo>] [<id>] [--you]` (memory, steps 2–3): the lines `reel status` ends with, or the
// evidence behind one: the reviews, the words, the times. --you: your own memory, across every repo you
// have reviewed in (~/.reelplanning/you.jsonl, D-106).
async function memory() {
  const you = argv.includes("--you"), rest = argv.slice(1).filter((a) => !a.startsWith("--"));
  const ids = [...LINES, "flagged", "outlived"], id = rest.find((a) => ids.includes(a)), other = rest.filter((a) => a !== id);
  if (other.length > (you ? 0 : 1) || (other.length && !existsSync(other[0]))) die(`memory: "${other.at(-1)}" is neither a repo nor a line id (the ids: ${ids.join(", ")})`);
  let mem, where;
  if (you) {
    // the summaries this repo keeps pending (a run that could not write your file) move in now, or are
    // read beside it where your file still cannot be written
    let top = null; try { top = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { /* not in git */ }
    const rp = [process.cwd(), top].filter(Boolean).map((d) => join(d, ".reelplanning")).find((d) => existsSync(d));
    let pending = null;
    if (rp && existsSync(pendingPath(rp))) {
      try {
        const m = movePending(rp), n = (k) => (k === 1 ? "1 summary" : `${k} summaries`);
        if (m.moved + m.already) console.log(`✓ waiting in ${relative(process.cwd(), pendingPath(rp))}: ${[m.moved && `${n(m.moved)} moved to ${youPath()}`, m.already && `${n(m.already)} already there`].filter(Boolean).join(", ")}${existsSync(pendingPath(rp)) ? "" : "; the file is removed"}\n`);
      }
      catch (e) { pending = pendingPath(rp); console.log(`△ could not write ${youPath()} (${e.code || e.message}): the summaries waiting in ${relative(process.cwd(), pending)} are read beside it, and move in when it can be written\n`); }
    }
    mem = youMemory(youPath(), pending); where = `your memory across repos, from ${youPath()}${pending ? ` and ${relative(process.cwd(), pending)}` : ""}`;
    if (!mem.facts.length) { console.log(`· ${youPath()} holds nothing yet: a summary of each review is added when \`reel record\` records it`); return; }
  } else {
    const rp = rpDir(other[0] || "."); mem = repoMemory(rp); where = `${relative(process.cwd(), rp) || rp}: the ledger and every plan's reviews/`;
    // the accepted calls none of whose lines is left in HEAD (D-306): said here, never written into the log
    const calls = await outlivedOf(rp, json(join(rp, "decisions.json")).decisions || []);
    if (calls?.outlived.length) mem.lines.push({ id: "outlived", text: `${calls.outlived.length} accepted call(s) outlived: none of the lines their commits wrote is left in HEAD`,
      evidence: calls.outlived.map((x) => `${callWords(x)} (${x.files.join(", ")})`) });
  }
  if (!id) {
    console.log(`What reviews show (${where}):`);
    for (const l of mem.lines) console.log(`  ${`[${l.id}]`.padEnd(14)}${l.text}`);
    if (!mem.lines.length) console.log("  nothing yet: no review is recorded");
    // what your file says you know (D-106, D-128): so a video need not explain a word you know, in any repo
    if (you) { const k = youKnows(mem.facts); if (k.watched.length || k.looked.size) console.log(`\nWatched: ${k.watched.length ? `${k.watched.length} video${k.watched.length === 1 ? "" : "s"} (${k.watched.slice(-4).map((w) => `${w.repo ? `${w.repo}: ` : ""}${w.video}`).join(", ")}${k.watched.length > 4 ? ", …" : ""})` : "none recorded"}. Words looked up: ${k.looked.size ? [...k.looked].sort((a, b) => b[1] - a[1]).map(([w, n]) => (n > 1 ? `${w} ×${n}` : w)).join(", ") : "none"}.`); }
    console.log(`\n\`reel memory <id>${you ? " --you" : ""}\` prints the evidence behind a line.`);
    return;
  }
  const line = mem.lines.find((l) => l.id === id);
  if (!line) { console.log(`· [${id}] nothing to show (${where})`); return; }
  console.log(`[${line.id}] ${line.text}\n\nThe evidence (${where}):`);
  for (const e of line.evidence) console.log(`- ${e}`);
}

// What the Bob Dylan benchmark has, and what it still lacks (a retro is checked against it, D-107's plan).
function benchmark(repo) {
  const base = [repo, ROOT].find((d) => existsSync(join(d, "eval", "plans", "bob-dylan-site")));
  const later = ["a run of the example with the skill before and after the retro (step 2 makes it)"];
  if (!base) return { base: null, have: [], missing: ["the Bob Dylan example itself: it is in reelplanning's own repo, under eval/, not in this install", ...later] };
  const have = [], missing = [], rel = (p) => relative(base, p);
  for (const [label, p] of [["the plan and its walkthrough report", "eval/plans/bob-dylan-site"], ["the example project's record", "eval/projects/bob-dylan-site/.reelplanning"], ["its plan video", "videos/g1-bob-dylan-site"]])
    (existsSync(join(base, p)) ? have : missing).push(`${label} (\`${p}/\`)`);
  const files = [];
  const walk = (d, depth = 0) => { if (!existsSync(d) || depth > 3) return; for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) { if (!f.startsWith(".")) walk(p, depth + 1); } else files.push(rel(p)); } };
  for (const d of ["eval/plans/bob-dylan-site", "eval/baselines", "eval/bob-dylan-site"]) walk(join(base, d));
  for (const [label, re] of [["the prompt the example is made from", /(^|\/)prompt\.(md|txt)$/i], ["the text baseline (the harness's own plan, e.g. Claude Code plan mode)", /^(?!.*prompt).*(baseline.*(text|\.md$)|plan-?mode|text-?plan)/i], ["the HTML baseline (an HTML plan from the same prompt)", /\.html?$/i]]) {
    const hit = files.find((f) => re.test(f));
    (hit ? have : missing).push(hit ? `${label} (\`${hit}\`)` : label);
  }
  // the case studies (eval/case-studies/<slug>/, `reel case-study`): each arm run to a finished site, and its page
  const cs = join(base, "eval", "case-studies");
  const studies = existsSync(cs) ? readdirSync(cs).filter((f) => existsSync(join(cs, f, "README.md")) && existsSync(join(cs, f, "arms"))) : [];
  for (const slug of studies) {
    const run = ARM_IDS.filter((a) => existsSync(join(cs, slug, "arms", a, "SHEET.md")) && /preflight:/.test(preflightOf(read(join(cs, slug, "arms", a, "SHEET.md")))));
    const open = Object.values(caseStudyMissing(join(cs, slug))).filter((m) => m.length).length;
    (run.length === ARM_IDS.length ? have : missing).push(`the case study \`eval/case-studies/${slug}/\`: ${run.length ? `arms run: ${run.join(", ")}` : "no arm run yet"}; its page ${open ? `has ${open} of 9 sections still empty` : "is ready"}`);
  }
  if (!studies.length) missing.push("a case study of the three arms, each to a finished site (`reel case-study <slug> --prompt <file>`)");
  return { base, have, missing: [...missing, ...later] };
}

// `reel retro [<repo>]` (memory, step 5; D-107): start a plan whose draft lists the evidence memory holds
// and leaves "Proposed skill edits" for the agent to fill, each citing its evidence. Nothing edits the
// skill: the retro is reviewed like any plan.
function retro() {
  const rp = rpDir(argv[1] && !argv[1].startsWith("--") ? argv[1] : ".");
  const sys = existsSync(join(rp, "system.json")) ? json(join(rp, "system.json")) : {}, ledger = json(join(rp, "decisions.json")).decisions || [];
  const mem = repoMemory(rp), you = youMemory(), bench = benchmark(dirname(rp));
  const skill = (sys.components || []).find((c) => c.id === "skill" || /plan-to-video skill/i.test(c.name));
  const inForce = ledger.filter((d) => isRule(d) && ((skill && (d.components || []).includes(skill.id)) || /\bretro\b/i.test(d.question)));
  const since = mem.retro.last ? `since the last retro (${mem.retro.last})` : "so far";
  const MAX = 12, block = (l) => [`### [${l.id}] ${l.text}`, "", ...l.evidence.slice(0, MAX).map((e) => `- ${e}`), ...(l.evidence.length > MAX ? [`- … ${l.evidence.length - MAX} more: \`reel memory ${l.id}${l === you.lines.find((y) => y.id === l.id) ? " --you" : ""}\``] : []), ""];
  const md = [`# Retro: what the reviews ${since} say about the skill`, "",
    "## The problem", "",
    `${mem.retro.due ? `A retro is due: ${mem.retro.why.join("; ")}.` : "A retro was asked for."} The reviews already record what went well and what did not; this plan reads them (\`reel memory\`) and proposes skill edits the evidence supports, each citing it.`, "",
    "A retro adds no text the evidence doesn't need. That is not a quota to cut words: an edit may add, cut or reword, as long as each one answers something the evidence shows, and nothing is added for its own sake. The aim is the right questions, not fewer of them.", "",
    "## The evidence", "",
    `From this repo (the ledger and every plan's reviews/, worked out when this plan was started):`, "",
    ...(mem.lines.length ? mem.lines.flatMap(block) : ["Nothing yet: no review is recorded.", ""]),
    ...(you.lines.length ? [`From your own memory across repos (${you.facts.length} review${you.facts.length === 1 ? "" : "s"}, \`reel memory --you\`):`, "", ...you.lines.flatMap(block)] : []),
    ...(() => { const ws = lostWords(mem.facts, { since: sinceRetro(rp).plans }); return ws.length ? ["### Words looked up in three reviews or more", "",
      "Their explanation is not working: rewrite the word's scene in the system video (the beat tagged `- defines: <word>`), or its glossary row (videos-you-can-follow, step 3; D-065 says how a system-video change goes).", "",
      ...ws.map((w) => `- **${w.word}**, looked up in ${w.count} reviews (\`reel memory lost\`)`), ""] : []; })(),
    "## Proposed skill edits", "",
    "<!-- The agent fills this in, then deletes this comment. One bullet per edit: where in the skill, the change (the words added, cut or replaced), and the evidence it answers by its memory id and the review or decision (e.g. [own-words] D-022). No edit without evidence; no words the evidence doesn't need. If the evidence asks for nothing, say so and stop here. -->", "",
    "- (none yet)", "",
    "## The benchmark", "",
    "Before this retro is accepted, the skill is checked against something outside the loop's own numbers, which could \"improve\" by asking less: the Bob Dylan example, redone from the same prompt with the old skill and the new one, next to the case study's text-only and HTML arms (`eval/case-studies/`), or its headless baselines where no case study has run.", "",
    `- **Exists${bench.base ? ` (in ${bench.base === dirname(rp) ? "this repo" : "reelplanning's own checkout"})` : ""}:** ${bench.have.join("; ") || "nothing"}.`,
    `- **Missing:** ${bench.missing.join("; ")}.`, "",
    "## Steps", "",
    "### Step 1 — Edit the skill as proposed", "", "Each edit in \"Proposed skill edits\", as written there, and nothing else.", "",
    "#### Cases", "", "| Case | Example | What happens | Trace |", "|---|---|---|---|", "| An edit the evidence asks for | the first of \"Proposed skill edits\" | the skill says it, as written | you read: the edit and its evidence; the agent writes: it into the skill; you see: the next video made with it |", "",
    "#### Interface", "", "No interface: wording only (the skill's text).", "",
    "### Step 2 — Check it against the benchmark", "", "Make what the benchmark is missing, then redo the Bob Dylan example from the same prompt with the skill before and after step 1, next to the case study's text-only and HTML arms (or its baselines, where no case study has run). Say what changed, in the questions asked and in what the reviewer had to write in their own words.", "",
    "#### Cases", "", "| Case | Example | What happens | Trace |", "|---|---|---|---|", "| The benchmark, before and after | the Bob Dylan example from the same prompt | both runs side by side, with what changed | the agent runs: the prompt, with the skill before step 1; then: after it; you see: the questions asked and your own words, side by side |", "",
    "#### Interface", "", "No interface: a comparison, written up.", "",
    ...(skill ? ["## Components touched", "", `- **${skill.name}** — the edits proposed above`, ""] : ["The skill is outside this repo (its installed copy, or reelplanning upstream): the edits are proposed here and made there.", ""]),
    ...(inForce.length ? ["## Decisions in force", "", ...inForce.map((d) => `- **${d.id}** ${d.question} → ${String(d.chosen).split(/\s+/).length > 14 ? `${String(d.chosen).split(/\s+/).slice(0, 14).join(" ")} …` : d.chosen} (all steps)`), ""] : []),
    "## Not in this plan", "", "An edit with no evidence behind it. Editing the skill before this plan is reviewed.", ""].join("\n");
  const date = flag("date", today()), taken = (s) => existsSync(join(rp, "plans", `${date}-${s}`));
  let slug = "retro"; for (let i = 2; taken(slug); i++) slug = `retro-${i}`;
  const dir = makePlan(rp, slug, md);
  console.log(`✓ ${relative(process.cwd(), dir) || dir}: a draft retro, with the evidence ${mem.lines.length ? `of ${mem.lines.length} memory line(s)` : "(none yet)"}${you.lines.length ? " and yours across repos" : ""}`);
  console.log(`next: fill "Proposed skill edits" in its plan.md, each edit citing its evidence (\`reel memory <id>\` has it all), then \`reel check\` and review it like any plan. Nothing edits the skill until it is approved and the benchmark says the new skill is no worse.`);
}

// `reel fold [<repo>] <component> [--dry-run] [--apply]` (D-306): a component's rules, out of the log and into spec.md.
// Drafts folds/<component>.md, for the owner's approval: the section of spec.md that states the rules in force on the
// component, written from them, and the decisions it folds. Nothing changes until the owner approves it and it is applied
// (--apply): the section goes into spec.md under "## Rules in force", and each decision it folds is marked `folded`, with
// `foldedInto` and `foldedOn`. A plan touching the component then cites the section ("spec.md#rules-<id>") in place of
// each id. --dry-run prints the draft and writes nothing.
const FOLD_START = "<!-- fold:section -->", FOLD_END = "<!-- /fold:section -->";
function fold() {
  const pos = argv.slice(1).filter((a) => !a.startsWith("--"));
  const [repoArg, name] = pos.length > 1 ? pos : [".", pos[0]];
  if (!name) die("usage: reel fold [<repo>] <component> [--dry-run] [--apply]");
  const rp = rpDir(repoArg), sys = json(join(rp, "system.json")), c = findComponent(name, sys.components);
  if (!c) die(`"${name}" is not a component in system.json (${(sys.components || []).map((x) => x.id).join(", ")})`);
  const ledger = json(join(rp, "decisions.json")), at = FOLDED_INTO(c.id), anchor = at.replace(/^spec\.md#/, "");
  const draftPath = join(rp, "folds", `${c.id}.md`), rel = (p) => relative(process.cwd(), p) || p;
  if (argv.includes("--apply")) {
    if (!existsSync(draftPath)) die(`no ${rel(draftPath)} to apply: \`reel fold ${repoArg} ${c.id}\` drafts it`);
    const draft = read(draftPath), body = (draft.split(FOLD_START)[1] || "").split(FOLD_END)[0].trim();
    if (!body) die(`${rel(draftPath)} has no section between ${FOLD_START} and ${FOLD_END}`);
    const ids = [...(draft.split(/^## Folds\s*$/m)[1] || "").matchAll(/^- (D-\d{3})\b/gm)].map((m) => m[1]);
    const bad = ids.filter((id) => { const d = ledger.decisions.find((x) => x.id === id); return !d || d.status !== "active" || !isRule(d) || !(d.components || []).includes(c.id); });
    if (bad.length) die(`${bad.join(", ")}: not a rule in force on ${c.id} any more (superseded, folded, or another component's since the draft): draft it again`);
    if (!ids.length) die(`${rel(draftPath)} folds no decision (its "## Folds" lists none)`);
    const spec = existsSync(join(rp, "spec.md")) ? read(join(rp, "spec.md")) : "# Spec\n";
    const block = `<!-- rules:${c.id} -->\n<a id="${anchor}"></a>\n${body.replace(/^<a id="[^"]*"><\/a>\n?/m, "")}\n<!-- /rules:${c.id} -->`;
    const was = new RegExp(`<!-- rules:${c.id} -->[\\s\\S]*?<!-- /rules:${c.id} -->`);
    const out = was.test(spec) ? spec.replace(was, () => block) : /^## Rules in force\s*$/m.test(spec) ? `${spec.trimEnd()}\n\n${block}\n` : `${spec.trimEnd()}\n\n## Rules in force\n\nWhat each part must keep doing, folded from the decision log (\`reel fold\`); a plan touching the part cites its section here.\n\n${block}\n`;
    writeFileSync(join(rp, "spec.md"), out);
    const on = flag("date", today());
    for (const id of ids) Object.assign(ledger.decisions.find((x) => x.id === id), { status: "folded", foldedInto: at, foldedOn: on });
    writeLedger(rp, ledger);
    writeFileSync(draftPath, draft.replace(/^(# .+)$/m, `$1\n\nApplied ${on}: in spec.md (${at}); ${ids.length} decision(s) marked folded.`));
    console.log(`✓ spec.md: the rules on ${c.name}, at ${at}\n✓ ledger: ${ids.length} decision(s) folded into it (${ids.join(", ")})\nnext: a plan touching ${c.id} cites ${at} in "Decisions in force"; the system video is behind spec.md until it is rebuilt`);
    return;
  }
  const rules = ledger.decisions.filter((d) => d.status === "active" && isRule(d) && (d.components || []).includes(c.id));
  if (!rules.length) { console.log(`· no rule in force on ${c.name} to fold`); return; }
  const one = (s) => String(s || "").replace(/\s+/g, " ").trim();
  const md = [`# Fold: the rules on ${c.name} into spec.md`, "",
    `Drafted ${flag("date", today())} by \`reel fold\`, for the owner's approval. Nothing changes until it is applied (\`reel fold ${relative(process.cwd(), dirname(rp)) || "."} ${c.id} --apply\`): the section below goes into spec.md, under "## Rules in force", at \`${at}\`, and each decision under "Folds" is marked folded into it. A plan touching ${c.id} then cites \`${at}\` in place of each id.`, "",
    "Edit the section's words before applying it: say each rule once, in plain words, and merge the ones that say the same. Drop a line from \"Folds\" to keep that decision cited by its id.", "",
    "## The section", "", FOLD_START, `<a id="${anchor}"></a>`, `### ${c.name}`, "",
    // a rule as the question it answers and the answer, with the reason the answer gave: the agent rewrites it as one sentence
    ...rules.map((d) => `- **${one(d.question)}** ${one(d.chosen).replace(/[.;]\s*$/, "")}${d.why ? `: ${one(d.why).replace(/[.;]\s*$/, "")}` : ""}. (${d.id})`), "", FOLD_END, "",
    "## Folds", "", ...rules.map((d) => `- ${d.id} — ${one(d.question)} → ${one(d.chosen)} (${d.plan}, ${d.date})`), ""].join("\n");
  if (argv.includes("--dry-run")) { console.log(md); console.log(`· dry run: nothing written (${rules.length} rule(s) on ${c.id})`); return; }
  mkdirSync(dirname(draftPath), { recursive: true }); writeFileSync(draftPath, md);
  console.log(`✓ ${rel(draftPath)}: the rules on ${c.name} (${rules.length}), drafted for spec.md at ${at}\nnext: tighten the section's words, ask the owner to approve it, then \`reel fold ${repoArg} ${c.id} --apply\``);
}

// `reel build`, `reel rebuild`, `reel case-study`, `reel pr-check` and `reel renumber` are the scripts of the same name
// (`reelplanning build …`): scripts/<name>.mjs with the rest of the arguments
const script = (name) => () => { const r = spawnSync(process.execPath, [join(ROOT, "scripts", `${name}.mjs`), ...argv.slice(1)], { stdio: "inherit" }); process.exit(r.status ?? 1); };

// `reel`, `reel --help`, `reel help [<command>]` and `reel <command> --help` print the usage at the top of this
// file (all of it, or that command's lines) and run nothing: `reel init --help` once took `--help` for <repo>
// and made a folder of that name. `reel case-study --help` is case-study.mjs's own, longer usage.
function usage(only) {
  const lines = read(fileURLToPath(import.meta.url)).split("\n").slice(1);
  const top = lines.slice(0, lines.findIndex((l) => !l.startsWith("//"))).map((l) => l.replace(/^\/\/ ?/, ""));
  if (!only) return `${top.join("\n")}\n\nreel <command> --help: one command's lines`;
  const out = []; let on = false;
  for (const l of top.slice(1)) { if (/^  \S/.test(l)) on = l.trim().split(/\s/)[0] === only; if (on) out.push(l); }
  return out.join("\n");
}
const COMMANDS = ["init", "new-plan", "stage", "check", "record", "audit", "stops", "prereqs", "status", "memory", "retro", "fold", "build", "rebuild", "case-study", "pr-check", "renumber"];
const HELP = ["-h", "--help"];
if (!cmd || cmd === "help" || HELP.includes(cmd)) {
  const of = cmd === "help" && COMMANDS.includes(argv[1]) ? argv[1] : null;
  (cmd ? console.log : console.error)(usage(of)); process.exit(cmd ? 0 : 1);
}
if (COMMANDS.includes(cmd) && cmd !== "case-study" && argv.slice(1).some((a) => HELP.includes(a))) { console.log(usage(cmd)); process.exit(0); }

({ init, "new-plan": newPlan, stage, check, record, audit, stops, prereqs, status, memory, retro, fold, build: script("build"), rebuild: script("rebuild"), "case-study": script("case-study"), "pr-check": script("pr-check"), renumber: script("renumber") }[cmd] || (() => die(`no such command: reel ${cmd} (one of ${COMMANDS.join(", ")}; reel --help says what each does)`)))();
