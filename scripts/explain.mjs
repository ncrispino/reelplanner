#!/usr/bin/env node
// Start an explainer (explain-first, step 2; D-250): a video of something already there, before any plan.
//
//   reelplanner explain "<what you asked>" <source> … [--slug <slug>] [--date <yyyy-mm-dd>] [--dry-run]
//
// It takes your question and the sources that hold the answer, and nothing that names a kind of explainer: what an
// explainer can be of is open, so the command knows only how to pin each source (lib/explainer.mjs). A source is a
// path (a file or a folder, in the repo or outside it), a commit or a range (`main..HEAD`), `worktree` (what is
// changed and not committed), `since:<date>`, `pr:<n>`, `ci:<run-id>`, `this-session` (Claude Code's transcript
// of this repo's newest session) or a decision (`D-233`).
//
// It makes .reelplanner/explainers/<date>-<slug>/:
//   explain.md     your words; what it will cover and leave out (the agent fills those two in from the sources)
//   sources.json   the commit it starts from, and each source pinned: its form, shape, size, hash, and whether it
//                  needs a guide part; a file outside the repo by its path (~/…), hash and line count, never its text
//   video/         BRIEF.md and STORYBOARD.md started (kind: explainer, sources_check: strict), to write and build
// A second ask makes a new folder: an explainer is a snapshot, never rebuilt on its own.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { pinAll, sourceLine, slugOf, repoTop, GUIDE_LINES } from "./lib/explainer.mjs";
import { sourcePart } from "./lib/guide/model.mjs";
import { hyperframesBin, rpInitialized, rpDirOf } from "./lib/env.mjs";

const args = process.argv.slice(2);
const VALUED = new Set(["--slug", "--date", "--repo"]);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : null; };
const die = (m) => { console.error(`✗ explain: ${m}`); process.exit(1); };
const plain = args.filter((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1]));
const [question, ...specs] = plain;
if (!question || !specs.length) die(`usage: reelplanner explain "<what you asked>" <source> … [--slug <slug>]
  a source: a path (file or folder, in the repo or outside it), a commit or a range (a..b), worktree,
            since:<yyyy-mm-dd>, pr:<n>, ci:<run-id>, this-session, or a decision (D-233)`);
const repo = repoTop(resolve(flag("repo") || process.cwd())) || die("not inside a git repo");
const rp = rpDirOf(repo);
if (!rpInitialized(rp)) die(`${existsSync(rp) ? `${rp} is not set up yet (no decisions.json, only setup files)` : `no .reelplanner/ in ${repo}`} (reel init first; without it, the skill's one-off video under videos/ stays as it is)`);
const date = flag("date") || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die(`--date ${date}: a day as yyyy-mm-dd`);
const slug = (flag("slug") || slugOf(question)).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "explainer";

let head = "";
try { head = execFileSync("git", ["-C", repo, "rev-parse", "--short=12", "--verify", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
catch { die(`${repo} has no commit yet: an explainer is pinned to the commit it explains, so commit once first`); }
const { sources, errors } = pinAll(specs, { repo, rp, head });
if (errors.length) die(`could not pin ${errors.length === 1 ? "a source" : `${errors.length} sources`}:\n${errors.map((e) => `  ${e}`).join("\n")}`);

let name = `${date}-${slug}`; for (let i = 2; existsSync(join(rp, "explainers", name)); i++) name = `${date}-${slug}-${i}`;
const dir = join(rp, "explainers", name), rel = (p) => relative(process.cwd(), p) || ".";
const title = question.replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase()).replace(/[?.!]*$/, "");
const guided = sources.filter((s) => s.guide);
const shapes = Object.entries(sources.reduce((a, s) => ({ ...a, [s.shape]: (a[s.shape] || 0) + 1 }), {})).map(([k, n]) => `${k} ${n}`).join(", ");
const summary = `${sources.length} source${sources.length === 1 ? "" : "s"} (${shapes}) · ${guided.length ? `${guided.length} need${guided.length === 1 ? "s" : ""} a guide part` : "none needs a guide part"} · pinned at ${head.slice(0, 7)}`;
if (args.includes("--dry-run")) { console.log(`· would make ${rel(dir)}/ · ${summary}`); for (const s of sources) console.log(`  ${sourceLine(s)}`); process.exit(0); }

// the HyperFrames project first, at the pinned version: `hyperframes init` refuses a folder with files in it, and
// BRIEF.md and STORYBOARD.md go in next (so the video is built with no init of the agent's own)
mkdirSync(dir, { recursive: true });
let hf;
try {
  hf = spawnSync(process.execPath, [hyperframesBin(), "init", join(dir, "video"), "--non-interactive", "--example=blank", "--skill=faceless-explainer"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 120000, env: { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1", HYPERFRAMES_NO_TELEMETRY: "1", HYPERFRAMES_NO_UPDATE_CHECK: "1" } });
} catch (e) { hf = { status: 1, stderr: e.message }; }
const started = hf.status === 0 && existsSync(join(dir, "video", "hyperframes.json"));
mkdirSync(join(dir, "video"), { recursive: true });
const pinned = { question, title, created: date, commit: head, guideLines: GUIDE_LINES, sources };
writeFileSync(join(dir, "sources.json"), JSON.stringify(pinned, null, 2) + "\n");
writeFileSync(join(dir, "explain.md"), `# ${title}

**You asked:** "${question.replace(/"/g, "'")}"

**Explained at:** \`${head.slice(0, 7)}\` (${date}). A snapshot: it plays as it was built, and the review page says how
many commits have landed since. To see a later state explained, ask again.

## What it will cover

<!-- The agent fills this in from the sources, then deletes this comment: the one question the video answers (your
words), its one to three chapters, and the places that carry the idea (explain-first step 1, "What goes in the video"). -->

## What it leaves out

<!-- What the sources hold that the video does not show, and where it is: a guide part (below), or the source itself. One
line each: Finish offers each as a way to Explain more; end a line with "(scene N)" when a scene comes closest to it. -->

## Open threads

<!-- What the sources leave open or unsettled, one line each, said as what a plan would do where you can ("make the
sweeper run on a timer (scene 5)"). Finish offers each under Plan this, so what it offers is this video's, not a template. -->

## Sources

${sources.map((s) => `- ${sourceLine(s)}`).join("\n")}
${guided.length ? `\nFar longer than a video can show (over about ${GUIDE_LINES} lines), so each gets a guide part, opened from the scene that
shows it: ${guided.map((s) => `\`${s.id}\``).join(", ")}. \`reelplanner build\` builds it with the video's guide (\`reelplanner guide\`).\n` : ""}`);

const planDir = relative(repo, dir).split("\\").join("/");
writeFileSync(join(dir, "video", "BRIEF.md"), `---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "<one sentence: the answer to the question below, in plain words>"
destination: embed
aspect: 1920x1080
language: en
audience: whoever asked, in their words: "${question.replace(/"/g, "'")}"
length: 2–4 minutes${guided.length ? " (up to 5: a source here is far longer than a video can show)" : ""}
angle: explainer
narration: yes
style_preset: .reelplanner/theme/frame.md (the project theme)
music: none
kind: explainer
---

## Intent

An explainer: a video of something already there, made so the viewer understands it before deciding anything. It
asks no plan questions and changes nothing. Its sources are pinned in \`../sources.json\`; the video says only what
they say.

## Customizations

- Medium: <what the sources are: files, a transcript, a table of results …>
- Layouts: <the map, the real lines, a picture where the real thing is hard to read …>
- Main transition: <one>
- Real things: <the scenes that show a source's own lines, each with \`- source:\`>
`);
writeFileSync(join(dir, "video", "STORYBOARD.md"), `---
title: "${title.replace(/"/g, "'")}"
format: 1920x1080
kind: explainer
plan_dir: ${planDir}
message: "<the answer, in one sentence>"
audience: whoever asked: "${question.replace(/"/g, "'")}"
music: none
sources_check: strict
terms_check: strict
details_check: strict
---

## Video direction

- YOUR QUESTION FIRST: the first scene says what was asked, in its own words; each scene after helps answer it.
- THE SHAPE BEFORE THE DETAIL: what it is and what it is for; its parts or its order as a map; then the one or two
  places that carry the idea.
- THE REAL THING, QUOTED WORD FOR WORD, inside a \`data-artifact\`, each scene naming where it comes from with
  \`- source:\` (a source's id in ../sources.json, a file in it, \`:<from>-<to>\` for lines). A label that is not a
  quote (a file name, a commit) carries \`data-label\`.
- WHAT MOVED; WHAT IS SETTLED AND WHAT IS OPEN. No \`- decision:\` beats: an explainer asks nothing to decide. A quick
  check only where there is something to predict, just before the scene that shows it.
- WHAT NEXT, FROM THIS VIDEO: Finish offers what Explain more and Plan this would mean here, from explain.md's "What it
  leaves out" and "Open threads", each long source, and a scene's own \`- next_more:\` (what going deeper from it would
  show) and \`- next_plan:\` (a plan it points to, "make the sweeper run on a timer"); the viewer's marks, comments and
  rewinds refine them at Finish.
- ${guided.length ? `A GUIDE PART for ${guided.map((s) => `\`${s.id}\``).join(", ")}: the scene that shows it opens it (\`- guide: ${sourcePart(guided[0])}\`) and marks it (\`data-detail="${sourcePart(guided[0])}"\`).` : "No source needs a guide part: each is small enough to show whole."}

## Frame 1 — What you asked

- chapter_start: What you asked
- source: ${sources[0].id}
- scene: <your question, in its words, and what the video will show>
- voiceover: "<…>"
`);

console.log(`✓ ${rel(dir)}/ · ${summary}`);
for (const s of sources) console.log(`  ${sourceLine(s)}`);
console.log(started ? "  video/: a HyperFrames project (hyperframes init), BRIEF.md and STORYBOARD.md started in it"
  : `△ video/: \`hyperframes init\` did not run (${String(hf.stderr || hf.stdout || "").trim().split("\n").at(-1) || `exit ${hf.status}`}): init one in a scratch folder and copy its hyperframes.json, index.html, meta.json and package.json in`);
console.log(`next: fill explain.md's "What it will cover", "What it leaves out" and "Open threads" from the sources, write video/STORYBOARD.md and
SCRIPT.md (each scene that says a fact names its \`- source:\`), then \`reelplanner build ${rel(join(dir, "video"))}\`: it checks
every quoted line against its source (check-sources), and fresh eyes look at it${guided.length ? ", with a fact check (a source here is far longer than the video)" : ""}.`);
