#!/usr/bin/env node
// Fresh eyes (videos-that-make-sense, steps 1 and 2; D-225): before a video reaches its reviewer, two fresh
// agents look at it, given only what a viewer gets, like the code check's second agent (D-001):
//
//   the newcomer  lists every phrase or thing on screen it could not explain from what the video had shown
//                 by then, what it guessed, and the questions a newcomer would ask
//   the designer  looks at each scene's picture for the seven rules of how a frame reads (style guide §5,
//                 "A frame a newcomer can read"): stand-ins, reading order, a label apart from its thing, a
//                 question that doesn't say what is decided, something covering content, text too small,
//                 and whether it is pleasing
//
// This script does not look. It writes what each agent gets, and prints the prompt that starts it:
//
//   fresh-eyes/shots/scene-NN.png      each scene at rest (its last moment), taken through the review page,
//                                      so the player's chips, captions and a detail's glyph are in it
//   fresh-eyes/newcomer-brief.md       each scene's narration and picture, the glossary, the words this video
//                                      gives a meaning, the recap lines of the videos it leans on (`before:`),
//                                      and what viewers were lost on before (reviews: words looked up,
//                                      "Explain this more", "wdym", checks missed, questions asked). Nothing
//                                      from the plan.
//   fresh-eyes/designer-brief.md       each scene's picture and narration, and the seven rules
//   fresh-eyes/stamp.json              the round, the build it belongs to, the scenes in scope, and what they
//                                      saw (each scene's narration and frame, hashed)
//
// The agent building the video launches each with exactly `fresh-eyes <video-dir> --prompt <role>` and nothing
// else, as a fresh agent with no context of its conversation, from a scratch folder of its own outside the
// repository (lib/agents.mjs freshAgentHow: how, per agent), so neither knows what the author meant. Each
// writes one file, at the exact path the prompt names (fresh-eyes/<role>.md), one finding a line, and nothing
// else. The author answers every finding under it (fixed, meaning, or kept with the reason), rebuilds, and runs
// this again for a second look, on the scenes whose words the first round's answers changed: at most two rounds a
// build (plans/2026-10-10-cheaper-videos, step 2). A new round moves the last one's files to
// round-<n>/, and never starts while a finding of the last is unanswered.
//
// Rounds belong to a build (lib/fresh-eyes.mjs buildOf: plan-diff's `changes.build`, the last committed build
// the video is compared against). When the video is at another build than the last set's (a rebuild after that
// set was committed: D-227, a rebuild is a new build), this moves the whole set to build-<n>/ and starts round 1.
// A rebuild's briefs cover the scenes plan-diff says changed, each with the scene before and after it marked
// context only; the other scenes are not in them. A first build covers every scene, and so does `--all`.
//
// usage: reelplanner fresh-eyes <video-dir>                        write the briefs (a new round)
//        reelplanner fresh-eyes <video-dir> --script               the script's brief, before frames: the storyboard and
//                                                                  script against BRIEF.md's `- Ask:` and the last review
//                                                                  (--prompt newcomer, --check work on it with --script)
//        reelplanner fresh-eyes <video-dir> --prompt newcomer|designer    print the prompt that starts one agent
//        reelplanner fresh-eyes <video-dir> --check                where it stands (what `verify` runs):
//                                                                  exit 1 on a finding with no answer (D-225),
//                                                                  or on this round's findings written elsewhere
//   --all        every scene, on a rebuild too (it holds for the rest of the build's rounds)
//   --no-shots   write the briefs without pictures (a test; the skill never does)
//   --width <n>  the review page's width for the pictures (default 1440; height 900)
import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync, rmSync, readdirSync, mkdtempSync } from "node:fs";
import { join, resolve, relative, basename, extname, dirname } from "node:path";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import { ROOT, launchOpts } from "./lib/env.mjs";
import { feDir, readStamp, stampOf, scenesOf, saidSince, freshEyesState, findingsOf, parseFindings, planOf, answerProblem, buildOf, buildOfStamp, buildsKept, contextOf, inScope, ROUNDS, rolesFor, factChecked } from "./lib/fresh-eyes.mjs";
import { explainerDirOf, readSources, sourceLine } from "./lib/explainer.mjs";
import { frontMatter, fmValue, glossaryFor, termsOf, rpDirFor, slugOf, storyboardFrames } from "./lib/terms.mjs";
import { lostBefore } from "./lib/memory.mjs";
import { sceneContent, visibleContent } from "./lib/scene-content.mjs";
import { freshAgentHow } from "./lib/agents.mjs";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null; };
const die = (m) => { console.error(`✗ fresh-eyes: ${m}`); process.exit(1); };
const target = args.find((a, i) => !a.startsWith("--") && !["--prompt", "--width"].includes(args[i - 1]));
if (!target) die("usage: fresh-eyes <video-dir> [--script] [--prompt newcomer|designer|checker] [--check]");
const dir = resolve(target), fe = feDir(dir);
for (const f of ["STORYBOARD.md", "SCRIPT.md"]) if (!existsSync(join(dir, f))) die(`${target} has no ${f}`);
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const rel = (p) => relative(process.cwd(), p) || ".";

// ── --script: the storyboard and script read against what the person asked, before any frame ─────────────
// (plans/2026-10-10-cheaper-videos, step 4). The costliest misses were a video that was not what was asked and a
// video in build order, not big picture first; read here, a fix is a line of the script, not a frame. One newcomer,
// from the storyboard, the script and the person's words (BRIEF.md's `- Ask:` lines, and the last review's comments),
// writes fresh-eyes/script/newcomer.md; its findings are answered like any round's, before frames are drawn.
if (args.includes("--script")) {
  const sd = join(fe, "script"), briefP = join(sd, "newcomer-brief.md"), outP = join(sd, "newcomer.md"), stampP = join(sd, "stamp.json");
  const stampS = (() => { try { return JSON.parse(read(stampP)); } catch { return null; } })();
  const sbS = read(join(dir, "STORYBOARD.md")), fmS = frontMatter(sbS), titleS = fmValue(fmS, "title") || basename(dir);
  const framesS = sceneContent(sbS, read(join(dir, "SCRIPT.md")));
  const asks = [...read(join(dir, "BRIEF.md")).matchAll(/^- Ask:[ \t]*(.+)$/gm)].map((m) => m[1].trim());
  const planDir = planOf(dir) ? dirname(planOf(dir)) : null;
  const lastReview = (() => { if (!planDir) return null; const rd = join(planDir, "reviews"); if (!existsSync(rd)) return null; const md = readdirSync(rd).filter((f) => f.endsWith(".md")).sort().at(-1); return md ? read(join(rd, md)) : null; })();
  const glossS = glossaryFor(dir), ownS = termsOf(fmS);
  const version = 1;
  const input = { version, title: titleS, scenes: framesS.map((f) => ({ index: f.index, title: f.title, scene: f.meta.scene || "", visible: f.visible, narration: f.narration })), asks, lastReview,
    terms: ownS, glossary: glossS.map((g) => ({ term: g.display || g.term, meaning: g.said || g.meaning })) };
  const idS = createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 12);
  const findingsHeader = (id) => `# Fresh eyes: newcomer · script · stamp ${id}`;
  const headerMatches = () => stampS && read(outP).split(/\r?\n/)[0] === findingsHeader(stampS.id);
  if (args.includes("--check")) {
    if (stampS?.version != null && (stampS.version !== version || stampS.id !== idS)) {
      console.log("✗ fresh eyes on the script: stale reviewer-visible input; fix the explanation and regenerate --script for an independent rereview"); process.exit(1);
    }
    if (stampS && stampS.version == null) console.log("△ legacy script stamp: readable, but it did not certify the versioned visible-content contract; regenerate and rereview");
    if (existsSync(outP) && !headerMatches()) { console.log("✗ fresh eyes on the script: newcomer.md header does not match this script stamp"); process.exit(1); }
    if (!existsSync(outP)) { console.log(`△ fresh eyes on the script: ${existsSync(briefP) ? "no newcomer.md yet (launch the newcomer: --script --prompt newcomer)" : "not run (reelplanner fresh-eyes <video-dir> --script)"}`); process.exit(0); }
    const open = parseFindings(read(outP)).map((x) => ({ ...x, problem: answerProblem(dir, x, stampS) })).filter((x) => x.problem);
    if (open.length) { console.log(`✗ fresh eyes on the script: ${open.length} finding${open.length === 1 ? "" : "s"} not answered: ${open.map((x) => `${x.id}${x.scene ? ` (scene ${x.scene})` : ""} ${x.problem}`).join("; ")}`); process.exit(1); }
    console.log(`✓ fresh eyes on the script: ${parseFindings(read(outP)).length} finding(s) answered`); process.exit(0);
  }
  if (args.includes("--prompt")) {
    if (!existsSync(briefP)) die(`no script brief yet: run \`reelplanner fresh-eyes ${rel(dir)} --script\` first`);
    console.error(`launch the newcomer as ${freshAgentHow({ writes: sd })}, with exactly the prompt below and nothing else`);
    console.log(`You are a newcomer reading the script of a short narrated video before it is drawn. You did not write it: judge it
from what you are given. Everything you get is in one file:

  ${briefP}

Read it in full. Do not open any other file in the repository.

Write your findings to exactly this file, in exactly the shape the brief gives (its first line too):

  ${outP}

It is the only file you write. Then reply with how many findings you wrote and the path.`);
    process.exit(0);
  }
  if (existsSync(outP)) {
    if (!headerMatches()) die("newcomer.md header does not match this script stamp; preserve and reconcile the findings before regenerating");
    const open = parseFindings(read(outP)).filter((x) => answerProblem(dir, x, stampS));
    if (open.length) die(`the script still has findings with no answer (${open.map((x) => x.id).join(", ")}): answer each before regenerating`);
  }
  mkdirSync(sd, { recursive: true });
  if (stampS && stampS.version === version && stampS.id === idS && existsSync(briefP)) {
    console.log(`✓ fresh eyes on the script: reviewer-visible input unchanged; preserved brief, stamp and findings in ${rel(sd)}`);
    process.exit(0);
  }
  if ([stampP, briefP, outP].some(existsSync)) {
    const n = Math.max(0, ...readdirSync(sd).map((f) => Number(/^review-(\d+)$/.exec(f)?.[1]) || 0)) + 1;
    const archive = join(sd, `review-${n}`); mkdirSync(archive);
    for (const p of [stampP, briefP, outP]) if (existsSync(p)) renameSync(p, join(archive, basename(p)));
  }
  writeFileSync(stampP, JSON.stringify({ version, id: idS, at: new Date().toISOString(), ...(planOf(dir) ? { plan: createHash("sha256").update(read(planOf(dir))).digest("hex").slice(0, 12) } : {}) }, null, 2) + "\n");
  writeFileSync(briefP, `# Fresh eyes: the newcomer's script brief · ${titleS}

You are a newcomer to this project, reading the script of "${titleS}", a narrated video of ${framesS.length} scenes,
before any picture is drawn: what each scene will show and what it says. You also have what the person who asked for
the video said, in their words. You have nothing else: not the plan, not the code.

Read it as the person would watch it, and list:

- **What they asked that it does not do.** Their words are first below: a thing they asked to see that the video
  only names or describes, a question they asked that it does not answer.
- **Where it loses the big picture.** A video that goes step by step, in the order things are built, before saying
  what the whole is and why: say where you first needed the whole and did not have it.
- **Every word or phrase you could not explain from what the script had said by then**, and what you guessed. A word
  with a meaning below counts as explained.
- **What the plan itself leaves out**, as far as the script shows it (a step, a case, a cost): mark those \`[plan]\`.

## The shape of newcomer.md (keep it exactly)

\`\`\`
# Fresh eyes: newcomer · script · stamp ${idS}

- N1 · scene 4 · "the phrase": what you could not follow, and what you guessed; why it matters
- N2 [plan] · scene 7 · …
\`\`\`

One finding a line, in scene order. Write "- none" if you have nothing. Do not answer or fix anything yourself.

## What the person asked, in their words

${asks.length ? asks.map((a) => `- ${a}`).join("\n") : "- (BRIEF.md has no \`- Ask:\` line)"}
${lastReview ? `\n### Their last review\n\n${lastReview}\n` : ""}
## The words this video gives a meaning

${ownS.length ? ownS.map((t) => `- **${t.term}**${t.meaning ? `: ${t.meaning}` : " (defined in the video itself)"}`).join("\n") : "- none"}

## The glossary

${glossS.length ? glossS.map((g) => `- **${g.display || g.term}**: ${g.said || g.meaning}`).join("\n") : "- none"}

## The video, scene by scene

${framesS.map((f) => `### Scene ${f.index}${f.title ? ` · ${f.title}` : ""}\n\n${visibleContent(f)}`).join("\n\n")}
`);
  console.log(`✓ fresh eyes on the script: ${rel(briefP)} (${framesS.length} scenes${asks.length ? `, ${asks.length} line${asks.length === 1 ? "" : "s"} of what was asked` : ", no \`- Ask:\` in BRIEF.md: add the person's words"}${lastReview ? ", the last review" : ""})`);
  console.log(`next: launch one fresh agent, ${freshAgentHow({ writes: sd })}, with the prompt from \`fresh-eyes ${rel(dir)} --script --prompt newcomer\`; answer each finding under it in ${rel(outP)} before drawing frames`);
  process.exit(0);
}

// ── --check: what verify reads ─────────────────────────────────────────────────────────────────────────
if (args.includes("--check")) {
  const s = freshEyesState(dir);
  for (const l of s.lines) console.log(`${l.level === "fail" ? "✗" : l.level === "warn" ? "△" : "✓"} ${l.text}`);
  process.exit(s.state === "open" ? 1 : 0);
}

// ── --prompt: the one message that starts a fresh agent ────────────────────────────────────────────────
if (args.includes("--prompt")) {
  const role = flag("prompt");
  const roles = rolesFor(dir);
  if (!roles[role]) die(role === "checker" ? "the fact check is for an explainer with a source far longer than the video can show (a source in sources.json with guide: true); this video has the newcomer and the designer" : `--prompt newcomer, or --prompt designer${roles.checker ? ", or --prompt checker" : ""}`);
  const brief = join(fe, `${role}-brief.md`), out = join(fe, `${role}.md`);
  if (!existsSync(brief)) die(`no brief yet: run \`reelplanner fresh-eyes ${rel(dir)}\` first`);
  // absolute paths: the agent runs from a scratch folder of its own, so a path relative to here would land there
  const top = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: dir, encoding: "utf8" }).stdout?.trim() || dir;
  // the launcher's instruction goes to stderr, so the prompt on stdout is exactly what the agent gets
  console.error(`launch the ${role} as ${freshAgentHow({ writes: fe })}, with exactly the prompt below and nothing else`);
  console.log(`You are ${role === "newcomer" ? "a newcomer" : role === "designer" ? "a designer" : "a fact checker"} looking at a short narrated video before anyone reviews it. You did not
make it: judge it from what you are given, not from anything the agent that made it said. ${role === "checker" ? "What you check it against is in one file" : "Everything you get is in one file"}:

  ${brief}

${role === "checker" ? `Read it in full. Then read each source it lists, the way it says to read it, from the repository's top folder:

  ${top}

Open nothing else: not the plan, not the storyboard's notes, not the author's account of what the sources say. The
sources are the only authority; the narration is what you check.` : `Read it in full and look at every picture it names, in order (a picture's path is relative to the brief's own
folder, ${fe}). Do not open any other file in the repository:
${role === "newcomer" ? "a viewer has only what the brief gives, and that is the point." : "judge only what the pictures and the narration show."}`}

Write your findings to exactly this file, in exactly the shape the brief gives (its first line too: it carries
this round's stamp):

  ${out}

It is the only file you write: no notes, drafts or copies anywhere else, not in your working folder and not
elsewhere in the repository (a findings file anywhere else is refused, not read). Then reply with how many
findings you wrote and the path.`);
  process.exit(0);
}

// ── a new round ────────────────────────────────────────────────────────────────────────────────────────
const map = (() => { try { return JSON.parse(readFileSync(join(dir, "plan-map.json"), "utf8")); } catch { return null; } })();
if (!map?.frames?.length || !existsSync(join(dir, "index.html"))) die(`${target} is not built yet (no plan-map.json or index.html): run \`reelplanner build ${target}\` first`);
const was = readStamp(dir), build = buildOf(dir, map), sameBuild = was && buildOfStamp(was) === build.id;
// what the agents look at: a rebuild's changed scenes (plan-diff), a first build's every one; --all, once in a
// build, holds for its later rounds
const all = args.includes("--all") || (sameBuild && was.all === true);
let scope = all ? null : build.scope;
if (scope && !scope.length) {
  console.log(`✓ fresh eyes: nothing a viewer sees changed since the last build (plan-diff: ${build.changes?.retimed || 0} scene(s) retimed only), so there is nothing new to look at; its rounds stand. \`--all\` looks at the whole video.`);
  process.exit(0);
}
// the script's look comes first: its findings answered before the frames get theirs
{
  const sp = join(fe, "script", "newcomer.md");
  if (existsSync(sp)) {
    const st = (() => { try { return JSON.parse(read(join(fe, "script", "stamp.json"))); } catch { return null; } })();
    const open = parseFindings(read(sp)).filter((x) => answerProblem(dir, x, st)).map((x) => x.id);
    if (open.length) die(`the script's fresh eyes still have findings with no answer (${open.join(", ")}) in ${rel(sp)}: answer each first`);
  }
}
let round = 1, archived = null;
const moveRound = (from, to) => {   // the round's files: its briefs, findings and stamp
  mkdirSync(to, { recursive: true });
  for (const r of Object.keys(rolesFor(dir))) for (const n of [`${r}.md`, `${r}-brief.md`]) if (existsSync(join(from, n))) renameSync(join(from, n), join(to, n));
  if (existsSync(join(from, "stamp.json"))) renameSync(join(from, "stamp.json"), join(to, "stamp.json"));
};
if (was) {
  const f = findingsOf(dir), open = Object.entries(f).filter(([, xs]) => xs).flatMap(([r, xs]) => xs.filter((x) => inScope(was, x) && answerProblem(dir, x)).map((x) => x.id));
  if (open.length) die(`round ${was.round || 1} still has findings with no answer (${open.join(", ")}): answer each first (fixed, meaning, or kept with the reason)`);
  const any = Object.values(f).some(Boolean);
  const earlier = readdirSync(fe).filter((x) => /^round-\d+$/.test(x));
  if (!sameBuild) {
    // a rebuild is a new build (D-227): the last build's rounds are kept as they were, under build-<n>/, and this
    // build starts at round 1 with rounds of its own
    if (any || earlier.length) {
      const n = (buildsKept(dir).at(-1) || 0) + 1, keep = join(fe, `build-${n}`);
      mkdirSync(keep, { recursive: true });
      for (const d of earlier) renameSync(join(fe, d), join(keep, d));
      moveRound(fe, join(keep, `round-${was.round || 1}`));
      archived = keep;
    }
  } else {
    if (any && (was.round || 1) >= ROUNDS) die(`${ROUNDS} rounds done on this build: what is left is said on the page ("Before you watch") and in the notification; no further look (a rebuild, once this build is committed, starts a new set)`);
    if (any) {
      // the second round looks only at the scenes whose words the first's answers changed (step 2): a frame
      // redrawn with its words as they were needs no new look
      const said = saidSince(dir, was).filter((n) => !build.scope || build.scope.includes(n));
      if (!all && !said.length) die(`round ${was.round || 1}'s answers changed no scene's words (redrawn frames only): no second round is needed; build, then open it`);
      if (!all) scope = said;
      round = (was.round || 1) + 1; moveRound(fe, join(fe, `round-${was.round || 1}`));
    }
    else round = was.round || 1;   // a brief written again before anyone looked: the same round
  }
}
mkdirSync(fe, { recursive: true });
const allScenes = scenesOf(dir), context = contextOf(scope, allScenes.map((s) => s.scene));
const shown = new Set(scope ? [...scope, ...context] : allScenes.map((s) => s.scene));
const scenes = allScenes.filter((s) => shown.has(s.scene));
const stamp = { ...stampOf(dir), round, at: new Date().toISOString(), video: slugOf(dir), build: build.id, scope, ...(scope ? { context } : {}), ...(all && build.scope ? { all: true } : {}) };
const role = (s) => (!scope ? "" : scope.includes(s.scene) ? " · look at this one" : " · context only: it did not change, list nothing on it");
// a scene at rest: 0.4 s before its end, when its animations are done (a detail's thing rests for the last 3 s) but
// the next scene's first caption, which leads its words by a moment, is not up yet (the system video's first look
// took them 0.12 s before the end, and a caption of the next scene was judged as this one's)
const at = (s) => { const f = map.frames.find((x) => x.index === s.scene); return f ? +(f.start + Math.max(0, (f.durationSeconds || 0) - 0.4)).toFixed(3) : null; };

// ── the pictures, through the review page ──────────────────────────────────────────────────────────────
const shotsDir = join(fe, "shots");
let shotNote = "";
const shots = {};
if (!args.includes("--no-shots")) {
  rmSync(shotsDir, { recursive: true, force: true }); mkdirSync(shotsDir, { recursive: true });
  const r = await pagePictures();
  if (r.error) {
    shotNote = r.error;
    const hf = framePictures();
    if (hf.error) die(`no pictures: ${r.error}; and the frames alone could not be taken either: ${hf.error}`);
  }
} else shotNote = "no pictures (--no-shots)";
for (const s of scenes) { const p = join(shotsDir, `scene-${String(s.scene).padStart(2, "0")}.png`); if (existsSync(p)) shots[s.scene] = p; }

async function pagePictures() {
  let chromium; try { ({ chromium } = await import("playwright-core")); } catch { return { error: "playwright-core is not installed" }; }
  const out = mkdtempSync(join(tmpdir(), "rp-fresh-eyes-"));
  try {
    const b = spawnSync(process.execPath, [join(ROOT, "scripts", "bundle-player.mjs"), out, dir], { encoding: "utf8", maxBuffer: 64 << 20 });
    if (b.status !== 0) return { error: `bundle-player failed: ${(b.stderr || b.stdout || "").trim().split("\n").at(-1)}` };
    const slug = JSON.parse(readFileSync(join(out, "library.json"), "utf8")).slugs[0];
    const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".vtt": "text/vtt" };
    const srv = createServer((req, res) => {
      let p = join(out, decodeURIComponent(new URL(req.url, "http://x").pathname)); if (!p.startsWith(out)) { res.writeHead(403).end(); return; }
      if (existsSync(p) && !extname(p)) p = join(p, "index.html");
      if (!existsSync(p)) { res.writeHead(404).end(); return; }
      res.writeHead(200, { "content-type": TYPES[extname(p).toLowerCase()] || "application/octet-stream" }); res.end(readFileSync(p));
    });
    await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
    let browser;
    try { browser = await chromium.launch(launchOpts()); } catch (e) { srv.close(); return { error: `Chromium did not start: ${String(e.message).split("\n")[0]}` }; }
    try {
      const w = Number(flag("width")) || 1440;
      const page = await browser.newPage({ viewport: { width: w, height: Math.round(w * 0.625) } });
      await page.goto(`http://127.0.0.1:${srv.address().port}/?project=${encodeURIComponent(slug)}`);
      await page.waitForFunction(() => { const el = document.querySelector("reelplanner-player, #rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 120000 });
      await page.evaluate(() => { const el = document.querySelector("reelplanner-player, #rp"); el.start?.(); });
      for (const s of scenes) {
        const t = at(s); if (t == null) continue;
        await page.evaluate((t) => { const el = document.querySelector("reelplanner-player, #rp"); el.player.pause(); el.player.seek(t); }, t);
        await page.waitForTimeout(900);   // the frame settled, the player's tab and chips laid out again
        const clip = await page.evaluate(() => { const el = document.querySelector("reelplanner-player, #rp"), r = el.stage.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
        await page.screenshot({ path: join(shotsDir, `scene-${String(s.scene).padStart(2, "0")}.png`), clip });
      }
    } finally { await browser.close(); srv.close(); }
    return {};
  } catch (e) { return { error: String(e.message || e).split("\n")[0] }; }
  finally { rmSync(out, { recursive: true, force: true }); }
}
// Without a browser to drive the page: the frames alone, at the same moments (HyperFrames' snapshot). The
// player's tab and chips are then not in them, and the brief says so.
function framePictures() {
  const times = scenes.map(at).filter((t) => t != null);
  const tmp = mkdtempSync(join(tmpdir(), "rp-fresh-eyes-hf-"));
  const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "snapshot", "-o", tmp, "--at", times.join(","), "--no-end", "--describe", "false"], { cwd: dir, encoding: "utf8", maxBuffer: 64 << 20 });
  if (r.status !== 0) { rmSync(tmp, { recursive: true, force: true }); return { error: (r.stderr || r.stdout || "").trim().split("\n").at(-1) }; }
  const files = readdirSync(tmp).filter((f) => f.endsWith(".png")).map((f) => ({ f, t: parseFloat((/-at-([\d.]+)s\.png$/.exec(f) || [])[1]) })).filter((x) => Number.isFinite(x.t));
  for (const s of scenes) { const t = at(s), x = files.sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0]; if (x && Math.abs(x.t - t) < 0.5) renameSync(join(tmp, x.f), join(shotsDir, `scene-${String(s.scene).padStart(2, "0")}.png`)); }
  rmSync(tmp, { recursive: true, force: true });
  shotNote += "; the frames alone instead (the player's tab, chips and captions are not in them)";
  return {};
}

// ── the briefs ─────────────────────────────────────────────────────────────────────────────────────────
const sb = read(join(dir, "STORYBOARD.md")), fm = frontMatter(sb), title = fmValue(fm, "title") || map.title || basename(dir);
// a picture's path is relative to the brief's own folder: the agent runs from a scratch folder elsewhere, and the
// committed brief holds no machine's paths
const pic = (s) => (shots[s.scene] ? `\`${relative(fe, shots[s.scene])}\`` : "_(no picture)_");
const gap = (a, b) => (a === b ? `scene ${a}` : `scenes ${a} to ${b}`);
const sceneList = (withPics) => scenes.map((s, i) => `${scope && i && scenes[i - 1].scene !== s.scene - 1 ? `_(${gap(scenes[i - 1].scene + 1, s.scene - 1)}: not changed, not here)_\n\n` : ""}### Scene ${s.scene}${map.frames.find((f) => f.index === s.scene)?.chapterStart ? ` · part: ${map.frames.find((f) => f.index === s.scene).chapterStart}` : ""}${role(s)}\n\n${withPics ? `Picture: ${pic(s)}\n\n` : ""}> ${s.narration || "(no narration)"}\n`).join("\n");
const nScenes = allScenes.length;
// a rebuild's briefs say what they cover, and that nothing else is in scope
const scopeNote = !scope ? "" : `
**This is a rebuild: look only at what it changed.** Scene${scope.length === 1 ? "" : "s"} ${scope.join(", ")} of the ${nScenes} ${scope.length === 1 ? "is" : "are"} new or changed since
the last build, and ${scope.length === 1 ? "it is" : "those are"} what you look at. ${context.length ? `Scene${context.length === 1 ? "" : "s"} ${context.join(", ")} ${context.length === 1 ? "is" : "are"} here for context only,
the scene just before or after a changed one: ${context.length === 1 ? "it has" : "they have"} not changed and had ${context.length === 1 ? "its" : "their"} look, so list nothing on ${context.length === 1 ? "it" : "them"}. ` : ""}The
other scenes are not here: they have not changed since their own look. A finding on a scene not marked "look at
this one" is out of scope and is not counted.
`;
const findingsShape = (role) => { const k = rolesFor(dir)[role]; return `## The shape of ${role}.md (keep it exactly)

\`\`\`
# Fresh eyes: ${role} · round ${round} · stamp ${stamp.id}

- ${k}1 · scene 4 · "the phrase or thing": what you ${role === "newcomer" ? "could not explain, and what you guessed" : role === "designer" ? "saw, and which rule it breaks" : "could not find in the sources, and what they say instead (the source, and where)"}; why it matters
- ${k}2 · scene 7 · …
\`\`\`

One finding a line, numbered ${k}1, ${k}2 … in scene order, each starting with its scene${scope ? ` (only scene${scope.length === 1 ? "" : "s"} ${scope.join(", ")})` : ""}. Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding \`[plan]\` right after its number (\`- ${k}3 [plan] · scene 9 · …\`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.`; };

const gloss = glossaryFor(dir), own = termsOf(fm);
const before = [...fm.matchAll(/^recap:\s*(.+?)\s*$/gm)].map((m) => m[1]);
const lost = (() => { const rp = rpDirFor(dir); try { return rp ? lostBefore(rp) : []; } catch { return []; } })();
const newcomer = `# Fresh eyes: the newcomer's brief · ${title}

You are a newcomer to this project. You are about to watch "${title}", a narrated video of ${nScenes} scenes,
the way a viewer would: the narration of each scene as it is said, and a picture of the scene at its last moment
as the review page shows it (the player's buttons, tabs and captions included). You also have what a viewer can
open on the page: the glossary, the meanings this video gives its own words, and a line on each earlier video this
one leans on. You have nothing else: not the plan, not the code, not what the author meant.

List every phrase or thing on screen you could not explain from what the video had shown **by then**, what you
guessed it means, and every question a newcomer would ask. A word with a meaning below counts as explained. A
plain phrase with no meaning (made of ordinary words, like "the saved review file" or "drops the video") counts as
unexplained when the video never says what it is or where it comes from. Be specific: say the scene, the words,
and what you would need to follow.
${scope ? `${scopeNote}
A scene not here may have explained a phrase before the scene you look at: flag the phrase if that scene leaves you
unable to follow it, and the author will say where it is explained.
` : ""}${shotNote ? `\n_Pictures: ${shotNote}._\n` : ""}
${findingsShape("newcomer")}

## Viewers were lost on these before

What the people who review this project's videos did not follow in earlier videos (words they looked up, questions
they asked, "Explain this more", checks they missed). Watch for the same kind of phrase here.

${lost.length ? lost.map((x) => `- ${x.what} (${x.where}): ${x.words}`).join("\n") : "- nothing recorded yet"}

## The videos this one leans on (a line each)

${before.length ? before.map((l) => `- ${l.replace(/\s*\|\s*/, ": ")}`).join("\n") : "- none named"}

## The words this video gives a meaning

${own.length ? own.map((t) => `- **${t.term}**${t.meaning ? `: ${t.meaning}` : " (defined in the video itself)"}`).join("\n") : "- none"}

## The glossary (every word a viewer can look up)

${gloss.length ? gloss.map((g) => `- **${g.display || g.term}**${g.display ? ` (in the files: ${g.term})` : ""}: ${g.said || g.meaning}`).join("\n") : "- none"}

## The video, scene by scene

${sceneList(true)}`;

const designer = `# Fresh eyes: the designer's brief · ${title}

You are a designer looking at "${title}", a narrated video of ${nScenes} scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.
${scopeNote}${shotNote ? `\n_Pictures: ${shotNote}._\n` : ""}
## The seven rules (a frame a newcomer can read)

1. **Show the thing, never a stand-in.** Words, not grey lines or an empty box where words go.
2. **One reading order,** top to bottom, left to right, in the order the narration says it.
3. **A label sits on what it labels, and a qualifier with what it qualifies.** Never a column of chips apart from
   the things they name.
4. **A question says what you decide.** "Drop the walkthrough video after each build? Approve or not", never "you
   approve, or not" alone.
5. **Nothing covers content.** The player's "More in the guide ↓" label has room above the thing it opens; no chip
   or caption sits on words.
6. **Readable at a glance.** Text big enough to read in the picture, text inside a screenshot too, and sharp (a
   screenshot stretched soft breaks it); at most three type sizes.
7. **Pleasing.** One focal point; the same gap between like things; the frame used in balance, not a column of
   chips with an empty half.

List only what stops a viewer: a place a picture breaks rules 1–6 so that they cannot read, find or trust what is
there (cut off, covered, too small or faint to read, in an order the narration contradicts, a stand-in where the
thing should be), with the rule's number and what would fix it in a few words. What only makes a frame less
pleasing (rule 7: a gap, the balance, a nicer layout) goes after your findings under a heading \`## Advisory\`, a
line each with no number: the author reads it and need not answer it.

${findingsShape("designer")}

## The video, scene by scene

${sceneList(true)}`;

writeFileSync(join(fe, "newcomer-brief.md"), newcomer);
writeFileSync(join(fe, "designer-brief.md"), designer);
// the fact check (explain-first step 5): an explainer that sums up more than it quotes gets a third agent, who reads
// the narration against the sources, never the author's account
const checked = factChecked(dir);
if (checked) {
  const edir = explainerDirOf(dir), pinned = (edir && readSources(edir)) || readSources(dir) || { sources: [] };
  const how = (x) => x.form === "path" ? (x.shape === "files" && x.files?.length > 1 ? `the files under \`${x.id}/\` as they were at ${x.commit}: \`git ls-tree -r --name-only ${x.commit} -- ${x.id}\`, then \`git show ${x.commit}:<file>\`` : `\`git show ${x.commit}:${x.id}\``)
    : x.form === "outside" ? `the file \`${x.path}\` (outside the repository; read it where it is)` : x.form === "git" ? `\`git log -p ${x.range}\``
    : x.form === "since" ? `\`git log --since=${x.day} ${x.until || "HEAD"}\` and the rows of \`.reelplanner/decisions.json\` dated ${x.day} or later`
    : x.form === "decision" ? `its row in \`.reelplanner/decisions.json\`` : x.form === "worktree" ? `\`git diff ${x.commit}\` (what was not committed then)`
    : x.form === "pr" ? `\`gh pr diff ${x.id.slice(3)}\`` : x.form === "ci" ? `\`gh run view ${x.id.slice(3)} --log\`` : "as its id says";
  const said = Object.fromEntries(storyboardFrames(sb).filter((f) => f.meta.source).map((f) => [f.index, f.meta.source]));
  const checker = `# Fresh eyes: the fact checker's brief · ${title}

You are checking "${title}", a narrated explainer of ${nScenes} scenes, against its sources before anyone watches it.
The agent that made it read the sources and wrote the narration; you did not see how, and that is the point (the
code check's reason: the one who did the work is the worst judge of its own account).

For every sentence of the narration that states a fact (a number, an order of events, a cause, a quote, who did
what), find it in the sources below. List each sentence the sources do not support: say what they say instead, and
where (the source, and a line or a commit). A sentence that is a plain summary of what the sources show is supported.
Do not judge style or wording; only whether the sources hold it.
${scopeNote}
${findingsShape("checker")}

## The question the video answers

> ${String(pinned.question || "").replace(/\n/g, " ")}

## The sources, pinned (read each as it says; nothing else)

${(pinned.sources || []).map((x) => `- ${sourceLine(x)}\n  read: ${how(x)}`).join("\n") || "- none pinned"}

## The narration, scene by scene (each with the sources it names)

${scenes.map((x) => `### Scene ${x.scene}${role(x)}\n\nSources named: ${said[x.scene] ? `\`${said[x.scene]}\`` : "none"}\n\n> ${x.narration || "(no narration)"}\n`).join("\n")}`;
  writeFileSync(join(fe, "checker-brief.md"), checker);
}
writeFileSync(join(fe, "stamp.json"), JSON.stringify(stamp, null, 2) + "\n");
const n = Object.keys(shots).length;
if (archived) console.log(`✓ a new build: the last build's rounds are kept in ${rel(archived)}/`);
console.log(`✓ fresh eyes, round ${round} of ${ROUNDS}${scope ? ` of this build, on scene${scope.length === 1 ? "" : "s"} ${scope.join(", ")} (what it changed${context.length ? `; ${context.join(", ")} for context` : ""})` : build.scope ? " of this build, every scene (--all)" : ""}: ${rel(join(fe, "newcomer-brief.md"))} and ${rel(join(fe, "designer-brief.md"))}; ${n} of ${scenes.length} scene picture${n === 1 ? "" : "s"}${shotNote ? ` (${shotNote})` : ""}; ${lost.length} thing${lost.length === 1 ? "" : "s"} viewers were lost on before`);
console.log(`next: launch ${checked ? "three" : "two"} fresh agents, each ${freshAgentHow({ writes: fe })}: one with the prompt from \`fresh-eyes ${rel(dir)} --prompt newcomer\`, one with \`--prompt designer\`${checked ? ", one with `--prompt checker` (the fact check: a source here is far longer than the video)" : ""}, and nothing else; each writes only ${rel(join(fe, "<role>.md"))}; answer every finding under it in ${rel(join(fe, "newcomer.md"))}${checked ? `, ${rel(join(fe, "designer.md"))} and ${rel(join(fe, "checker.md"))}` : ` and ${rel(join(fe, "designer.md"))}`}`);
