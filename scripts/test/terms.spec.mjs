#!/usr/bin/env node
// Accessible videos, the tooling side: what plan-map writes for the player (prerequisites, terms,
// glossary, ids, walk-throughs) and what check-terms holds a script to. Against a scratch project record.
//   - `before: <video>[#part N] | <what it gives you>` resolves each video's title, length (a part's own
//     length), and the words it defines; with none, the system video; `before: none` and `kind: system`, none
//   - glossary[] from the nearest glossary.md; ids{} glossed from decisions.json, a prerequisite plan's
//     walkthrough.md, and the storyboard's own checks; a quick check's `- walk_me_through:`; a beat's `- defines:`
//   - check-terms: an id alone warns, and fails on `terms_check: strict`; a word said before it is defined
//     warns (and fails with --strict); a word a prerequisite defines, or one defined at its first use, passes
//   - videos-you-can-follow: the glossary's "On screen" word (D-127) as `display`, said too; each row's
//     `definedIn`, from the terms index; the system video fails while a row has no defining beat; a quick
//     check with no walk-through fails, an answer its beat never shows or an id in `explain` warns;
//     `before: <video>#chapter N`
//   - quick checks later, on a new case (D-197, D-198): a check right after the beat that explains its rule
//     warns, and so does one on that beat's own names and numbers; a later one on a case of its own is clean,
//     its worked-out count not held against "the answer was not shown"
//   - better-visuals: a data-artifact's own text is glossed in place (no word warning; an id a △ even on a
//     strict storyboard); a data-gloss word on it is the video's own; on-screen lines split on block elements only
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { parseGlossary, rowFor, splitMeaning, termsOf, plainOf } from "../lib/terms.mjs";
import { findJargon, saysForm } from "../lib/jargon.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-terms-spec-")), RP = join(tmp, ".reelplanning");
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const w = (p, s) => { mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, s); };
const run = (script, args) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...args], { encoding: "utf8", cwd: tmp, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
// the glossary's "Other words" (D-216): meanings only, for the words the fixtures say that a newcomer may not know
const OTHER = "\n## Other words\n\n| Term | id | Meaning | Also called | On screen |\n|---|---|---|---|---|\n| The agent | — | The AI assistant that builds the code | | |\n| A flag | — | The answer that says change this | | |\n| A quick check | — | A question on what the plan will do | | |\n";
const map = (v) => JSON.parse(readFileSync(join(v, "plan-map.json"), "utf8"));
const video = (dir, fm, frames, script = null) => {
  mkdirSync(join(dir, "compositions", "frames"), { recursive: true });
  w(join(dir, "STORYBOARD.md"), `---\n${fm}\n---\n\n` + frames.map((f, i) => `## Frame ${i + 1} — ${f.title || `beat ${i + 1}`}\n\n- src: compositions/frames/f${i + 1}.html\n- duration: ${f.duration || 5}s\n${Object.entries(f.meta || {}).map(([k, v]) => `- ${k}: ${v}\n`).join("")}`).join("\n"));
  frames.forEach((f, i) => w(join(dir, "compositions", "frames", `f${i + 1}.html`), `<div data-composition-id="f${i + 1}"><div class="k">${f.screen || ""}</div><script>/* D-999 */</script></div>`));
  if (script) w(join(dir, "SCRIPT.md"), `# SCRIPT\n\n---\n\n${script.map((t, i) => `## Line ${i + 1} — beat (Frame ${i + 1})\n\n    ${t}\n`).join("\n")}`);
};

try {
  // the project record: a glossary, a decision, the system video, and an earlier plan with its walkthrough video
  w(join(RP, "glossary.md"), "# Glossary\n\n| Term | id (`system.json`) | Meaning | Also called (do not use) |\n|---|---|---|---|\n| The review player | `player` | Where you watch and answer | |\n| A tag | — | A label the agent puts on a choice it made alone | |\n| A streak | — | How many times in a row you accepted calls with the same tag | |\n| A miss | — | Something a review let through that was changed later | |\n" + OTHER);
  w(join(RP, "decisions.json"), JSON.stringify({ decisions: [{ id: "D-056", question: "Where does the plan text go?", chosen: "Beside the video", status: "active" }] }));
  const SYS = join(RP, "system-video");
  video(SYS, 'title: "The whole system"\nkind: system\nplan_dir: .reelplanning\nterms: review player, call', [{}]);
  w(join(SYS, "plan-map.json"), JSON.stringify({ title: "The whole system", totalSeconds: 480, watchedSeconds: 476, chapters: [] }));
  const ALPHA = join(RP, "plans", "2026-01-01-alpha");
  w(join(ALPHA, "plan.md"), "# Alpha\n\n### Step 1 — one\n\nText.\n");
  w(join(ALPHA, "walkthrough.md"), "# Walkthrough\n\n| id | step | chose | instead of | why | check |\n|---|---|---|---|---|---|\n| A3 | 1 | Accept and Flag sit in the band [visible] | a sheet | fewer clicks | `player` |\n");
  const AW = join(ALPHA, "walkthrough-video");
  video(AW, 'title: "Alpha, as built"\nplan_dir: .reelplanning/plans/2026-01-01-alpha\nterms: miss', [{}]);
  w(join(AW, "plan-map.json"), JSON.stringify({ title: "Alpha, as built", totalSeconds: 200, watchedSeconds: 190, chapters: [{ id: "ch1", title: "Calls", start: 0, end: 90, linearSeconds: 90, watchedSeconds: 88 }, { id: "ch2", title: "Misses and streaks", start: 90, end: 200, linearSeconds: 110, watchedSeconds: 62.4 }] }));
  const AV = join(ALPHA, "video");
  video(AV, 'title: "Alpha"\nplan_dir: .reelplanning/plans/2026-01-01-alpha', [{ meta: { voiceover: '"The review player shows it."' } }]);

  // the video under test: a later plan's video, leaning on part 2 of alpha's walkthrough
  const BETA = join(RP, "plans", "2026-01-02-beta"), BV = join(BETA, "video");
  w(join(BETA, "plan.md"), "# Beta\n\n### Step 1 — one\n\nText.\n");
  const betaFrames = [
    { screen: "Accept · Flag", meta: { voiceover: '"A tag, a label the agent puts on a choice it made alone, stops the video. Decision D-056 put the plan text beside it."', defines: "tag", plan_step: 1 } },
    { meta: { voiceover: '"A streak is how many times in a row you accepted that tag."', defines: "streak", plan_step: 1 } },
    { meta: { quiz: "k1", plan_step: 1, question: "What did choice A3 put in the band?", option_a: "Accept and Flag", option_b: "Nothing", answer: "a", explain: "the choice put Accept and Flag there", explained_at: "1", walk_me_through: "The band sits under the frame. A3 moved Accept and Flag into it, so a call is answered where the video is." } },
  ];
  video(BV, 'title: "Beta"\nplan_dir: .reelplanning/plans/2026-01-02-beta\nbefore: 2026-01-01-alpha--walkthrough#part 2 | what a miss and a streak are\nterms: streak', betaFrames);
  let r = run("plan-map.mjs", [BV]);
  const m = map(BV), pre = m.prerequisites || [];
  ok("plan-map: a `before:` line names its video, its part, what it gives, its title and that part's length", r.code === 0 && pre.length === 1 && pre[0].video === "2026-01-01-alpha--walkthrough" && pre[0].part === 2 && pre[0].partTitle === "Misses and streaks" && pre[0].title === "Alpha, as built" && pre[0].gives === "what a miss and a streak are" && pre[0].seconds === 62.4 && !pre[0].default, JSON.stringify(pre) + r.out);
  ok("…and the words that video defines (its storyboard's terms:)", JSON.stringify(pre[0].terms) === '["miss"]', JSON.stringify(pre[0]));
  ok("plan-map: terms[] are the words this video defines; a beat's `- defines:` is on its frame", JSON.stringify(m.terms) === '["streak"]' && JSON.stringify(m.frames[1].defines) === '["streak"]' && m.frames[0].terms.includes("tag"), JSON.stringify({ t: m.terms, f: m.frames.map((f) => [f.terms, f.defines]) }));
  ok("plan-map: glossary[] from the nearest glossary.md, term and meaning", m.glossary.length === 7 && m.glossary.filter((g) => g.other).length === 3 && m.glossary.some((g) => g.term === "A tag" && /label the agent puts/.test(g.meaning) && g.forms.includes("tag")) && m.glossary.find((g) => g.id === "player")?.forms[0] === "review player", JSON.stringify(m.glossary));
  ok("plan-map: ids{} — a decision from decisions.json, a prerequisite plan's call from its walkthrough.md, the video's own check", m.ids["D-056"]?.kind === "decision" && /plan text.*Beside the video/.test(m.ids["D-056"].gloss) && m.ids.A3?.kind === "choice" && /Accept and Flag sit in the band/.test(m.ids.A3.gloss) && m.ids.k1?.kind === "quick check" && m.ids.k1.n === 1 && /choice A3/.test(m.ids.k1.gloss), JSON.stringify(m.ids));
  ok("plan-map: a quick check carries its walk-through; the video its review-page name", /band sits under the frame/.test(m.quizzes[0].walkMeThrough || "") && m.slug === "2026-01-02-beta", JSON.stringify({ q: m.quizzes[0], s: m.slug }));
  r = run("plan-map.mjs", [AV]);
  const a = map(AV).prerequisites;
  ok("plan-map: with no `before:`, the system video comes first, with its title and length", a.length === 1 && a[0].video === "system" && a[0].default === true && a[0].title === "The whole system" && a[0].seconds === 476 && /what the parts are/.test(a[0].gives) && JSON.stringify(a[0].terms) === '["review player","call"]', JSON.stringify(a));
  w(join(AV, "STORYBOARD.md"), readFileSync(join(AV, "STORYBOARD.md"), "utf8").replace("---\n\n", "before: none\n---\n\n"));
  run("plan-map.mjs", [AV]);
  ok("plan-map: `before: none` opts out", map(AV).prerequisites.length === 0);
  run("plan-map.mjs", [SYS]);
  ok("plan-map: the system video (kind: system) has nothing before it", map(SYS).prerequisites.length === 0 && map(SYS).slug === "system");

  // check-terms
  let c = run("check-terms.mjs", [BV]);
  ok("check-terms: every word defined before use (or by a video before it), no id alone: clean", c.code === 0 && /^✓ terms:/m.test(c.out) && !/△|✗/.test(c.out), c.out);
  // an id alone, said and shown
  const said = (v, lines) => w(join(v, "SCRIPT.md"), `# SCRIPT\n\n---\n\n${lines.map((t, i) => `## Line ${i + 1} — beat (Frame ${i + 1})\n\n    ${t}\n`).join("\n")}`);
  said(BV, ["A tag, a label the agent puts on a choice it made alone, stops the video. D-056 is why.", "A streak is how many times in a row you accepted that tag.", "Quick check."]);
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: an id said alone is a warning on an older storyboard, and the build goes on", c.code === 0 && /△ frame 1, said: D-056 alone/.test(c.out) && /1 bare id/.test(c.out), c.out);
  w(join(BV, "STORYBOARD.md"), readFileSync(join(BV, "STORYBOARD.md"), "utf8").replace("terms: streak", "terms: streak\nterms_check: strict"));
  c = run("check-terms.mjs", [BV]);
  ok("…and fails on a `terms_check: strict` storyboard", c.code === 1 && /✗ frame 1, said: D-056 alone/.test(c.out) && /failing/.test(c.out), c.out);
  said(BV, ["A tag, a label the agent puts on a choice it made alone, stops the video. Decision D-056 is why.", "A streak is how many times in a row you accepted that tag.", "Quick check."]);
  w(join(BV, "compositions", "frames", "f2.html"), '<div data-composition-id="f2"><div class="chip"><span>decided</span> · <span>D-056</span></div></div>');
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: said with what it is, it passes; shown alone on a frame, it fails", c.code === 1 && !/frame 1, said/.test(c.out) && /✗ frame 2, on screen: D-056 alone/.test(c.out), c.out);
  w(join(BV, "compositions", "frames", "f2.html"), '<div data-composition-id="f2"><div class="chip"><span>decision</span> · <span>D-056</span></div></div>');
  // a word before it is defined
  said(BV, ["A tag, a label the agent puts on a choice it made alone, stops the video until its streak is ten.", "A streak is how many times in a row you accepted that tag.", "Quick check."]);
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: a word said before the beat that defines it warns, naming where it is defined", c.code === 0 && /△ frame 1, said: "streak" before frame 2 defines it/.test(c.out) && !/"tag"/.test(c.out), c.out);
  ok("…a word a video before this one defines does not (miss, from alpha's walkthrough)", !/"miss"/.test(c.out), c.out);
  c = run("check-terms.mjs", [BV, "--strict"]);
  ok("…and --strict makes it fail", c.code === 1 && /✗ frame 1, said: "streak"/.test(c.out), c.out);
  said(BV, ["A tag, a label the agent puts on a choice it made alone, stops the video, even after a miss.", "A streak is how many times in a row you accepted that tag.", "Quick check."]);
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: defined where it is first said, it passes", c.code === 0 && /^✓ terms:/m.test(c.out), c.out);
  // the same video with no prerequisite: "miss" is now a word before its definition
  w(join(BV, "STORYBOARD.md"), readFileSync(join(BV, "STORYBOARD.md"), "utf8").replace(/^before: .*\n/m, "before: none\n"));
  c = run("check-terms.mjs", [BV]);
  ok("…without the video that defines it, the same word warns", c.code === 0 && /"miss" before any beat defines it/.test(c.out), c.out);

  // ── videos-you-can-follow ──────────────────────────────────────────────────────────────────────────
  // the glossary's On screen column (D-127): the plain word a viewer sees and hears, said too
  w(join(RP, "glossary.md"), "# Glossary\n\n| Term | id (`system.json`) | Meaning | Also called (do not use) | On screen (D-127) |\n|---|---|---|---|---|\n| The review player | `player` | Where you watch and answer | | |\n| A tag | — | A label the agent puts on a choice it made alone | | label |\n| A streak | — | How many times in a row you accepted choices with the same label | | accepted in a row |\n| A miss | — | Something a review let through that was changed later | | late fix |\n" + OTHER);
  run("plan-map.mjs", [BV]);
  const g2 = map(BV).glossary, tag = g2.find((g) => g.term === "A tag");
  ok("plan-map: a row's on-screen word is its `display`, and a form it is said by, after the term's (the key stays)", tag?.display === "label" && JSON.stringify(tag.forms) === '["tag","label"]' && !("display" in g2.find((g) => g.term === "The review player")) && g2.find((g) => g.term === "A streak").forms.includes("accepted in a row"), JSON.stringify(g2));
  ok("plan-map: each row says where it is explained (`definedIn`): no system-video beat yet, so the first video that defines it", tag?.definedIn?.video === "2026-01-02-beta" && tag.definedIn.frame === 1 && !g2.find((g) => g.term === "A miss").definedIn, JSON.stringify(tag));
  // the system video: every row needs a beat that defines it; a row without one fails its build, by name
  const sysFrames = (defs, said) => { video(SYS, 'title: "The whole system"\nkind: system\nplan_dir: .reelplanning\nterms: review player', [{ meta: { voiceover: `"${said}"`, defines: defs, chapter_start: "The words" } }]); };
  sysFrames("review player, tag, miss", "The review player plays it. A label says why you might look at a choice. A late fix is a review's miss.");
  c = run("check-terms.mjs", [SYS]);
  ok("check-terms: the system video fails while a glossary row has no beat, naming it (\"streak has no beat\")", c.code === 1 && /✗ the system video: streak has no beat .*`- defines: streak`, in its plain word \("accepted in a row"\)/.test(c.out) && !/review player has no beat|tag has no beat|miss has no beat/.test(c.out), c.out);
  sysFrames("review player, tag, miss, streak", "The review player plays it. A label says why you might look at a choice. A late fix is a review's miss. Ten accepted in a row, and a label stops pausing.");
  c = run("check-terms.mjs", [SYS]);
  ok("…and passes once a beat defines it, said in the plain word (\"accepted in a row\")", c.code === 0 && /every glossary row explained \(4\)/.test(c.out) && !/never says it/.test(c.out), c.out);
  sysFrames("review player, tag, miss, streak", "The review player plays it. It says why you might look at a choice. A late fix. Ten accepted in a row.");
  c = run("check-terms.mjs", [SYS]);
  ok("…and fails when the scene that defines a row never says it, nor its on-screen word", c.code === 1 && /✗ frame 1 defines tag but never says it \(nor "label", its word on screen\)/.test(c.out), c.out);
  sysFrames("review player, label, miss, streak", "The review player plays it. A tag says why you might look at a choice. A late fix. Ten accepted in a row.");
  c = run("check-terms.mjs", [SYS]);
  ok("…a defining beat may name the row by its on-screen word (`- defines: label`)", c.code === 0 && !/tag has no beat/.test(c.out), c.out);
  // the terms index: which video explains each word, repo-wide; system video first
  r = run("terms-index.mjs", [BV]);
  const idx = JSON.parse(readFileSync(join(RP, "terms-index.json"), "utf8"));
  ok("terms-index: every video's defines, keyed by the glossary row, the system video first; none undefined", r.code === 0 && idx.words.tag?.[0]?.video === "system" && idx.words.tag.some((x) => x.video === "2026-01-02-beta" && x.frame === 1) && idx.words.tag[0].chapter === 1 && idx.words.tag[0].chapterTitle === "The words" && idx.undefined.length === 0, r.out + JSON.stringify(idx.words.tag));
  run("plan-map.mjs", [BV]);
  ok("plan-map: once the system video defines it, a row's `definedIn` is that beat, with its chapter", map(BV).glossary.find((g) => g.term === "A tag")?.definedIn?.video === "system", JSON.stringify(map(BV).glossary));
  // quick checks: a walk-through each (the build fails without one); an id in `explain` and an answer the
  // beat never shows are warnings
  const qFrames = (q) => [{ screen: "Accept · Flag", meta: { voiceover: '"A tag, a label the agent puts on a choice it made alone, stops the video, even after a miss."', defines: "tag", plan_step: 1 } }, { meta: { voiceover: '"A streak is how many times in a row you accepted that tag."', defines: "streak", plan_step: 1 } }, { meta: { quiz: "k1", plan_step: 1, question: "What did the choice put in the band?", option_a: "Accept and Flag", option_b: "Nothing", answer: "a", ...q } }];
  const fmB = 'title: "Beta"\nplan_dir: .reelplanning/plans/2026-01-02-beta\nbefore: 2026-01-01-alpha--walkthrough#chapter 2 | what a miss and a streak are\nterms: streak';
  video(BV, fmB, qFrames({ explain: "D-056 says so", explained_at: "1" }));
  rmSync(join(BV, "SCRIPT.md"), { force: true });
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: a quick check with no walk-through fails; an id in its explain warns", c.code === 1 && /✗ frame 3, quick check k1: no `- walk_me_through:`/.test(c.out) && /△ frame 3, quick check k1: its explain names D-056/.test(c.out), c.out);
  video(BV, fmB, qFrames({ explain: "the choice put them there", walk_me_through: "Choice A3 moved Accept and Flag into the band.", explained_at: "2" }));
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: a right answer the beat it names never says or shows warns (the answer was not shown)", c.code === 0 && /△ frame 3, quick check k1: its answer \(“Accept and Flag”\) uses "flag", never said or shown in frame 2 \(explained_at\)/.test(c.out), c.out);
  video(BV, fmB, qFrames({ explain: "the choice put them there", walk_me_through: "Choice A3 moved Accept and Flag into the band.", explained_at: "1" }));
  c = run("check-terms.mjs", [BV]);
  ok("…and passes when that beat shows it", c.code === 0 && !/quick check k1/.test(c.out), c.out);
  // later, on a case of its own (D-197, D-198): a check right after the beat that explains its rule, or on
  // that beat's own names and numbers, is a warning; a later check on a new case, worked out, is clean
  const pauseFrames = (q, extra = []) => [{ meta: { voiceover: '"A tag, a label the agent puts on a choice it made alone, stops the video. Step 4 has two choices that stop, and they share one pause; plan.md says so."', defines: "tag", plan_step: 1 } }, ...extra, { meta: { voiceover: '"A streak is how many times in a row you accepted that tag."', defines: "streak", plan_step: 2 } }, { meta: { quiz: "k1", plan_step: 1, option_a: "Once", option_b: "Twice", option_c: "Four times", answer: "b", explain: "the choices that stop share one pause, and a change off the plan has its own", walk_me_through: "The three choices share one pause. The change off the plan pauses on its own. That is two.", ...q } }];
  const GOOD = "A step with three choices that stop and one off-plan change: how many pauses?";
  video(BV, fmB, pauseFrames({ question: GOOD, explained_at: "1" }));
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: a check after the next step's scenes, on a new case (three choices, not step 4's two), is clean; its count is worked out, so the answer was shown", c.code === 0 && !/quick check k1/.test(c.out), c.out);
  video(BV, fmB, pauseFrames({ question: GOOD, explained_at: "2" }));
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: a check right after the beat that explains it warns (the viewer only recalls the last sentence)", c.code === 0 && /△ frame 3, quick check k1: right after frame 2, which explains its rule \(explained_at\)/.test(c.out) && /1 quick check right after the beat that explains it/.test(c.out), c.out);
  video(BV, fmB, pauseFrames({ question: GOOD }));
  c = run("check-terms.mjs", [BV]);
  ok("…and with no `explained_at`, the beat before it is taken as the one that explains it, so it warns too", /△ frame 3, quick check k1: right after frame 2, which explains its rule \(the beat before it\)/.test(c.out), c.out);
  video(BV, fmB, pauseFrames({ question: "The video just said step 4 has two choices. How many pauses?", explained_at: "1" }));
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: a check on the explaining beat's own case (step 4, two choices) warns, naming what it reuses", c.code === 0 && /△ frame 3, quick check k1: its case is frame 1's again \(explained_at\): "4", "2" said or shown there/.test(c.out) && !/right after/.test(c.out), c.out);
  video(BV, fmB, pauseFrames({ question: "Your plan.md has a step with three choices that stop. How many pauses?", explained_at: "1" }));
  c = run("check-terms.mjs", [BV]);
  ok("…one reused name among others (plan.md, but three choices) does not; the whole case, or two of its names and numbers, does", !/its case is/.test(c.out), c.out);
  video(BV, fmB, pauseFrames({ question: "What does plan.md say?", explained_at: "1" }));
  c = run("check-terms.mjs", [BV]);
  ok("…a case that is only the beat's file name again warns", /its case is frame 1's again \(explained_at\): "plan\.md"/.test(c.out), c.out);
  // walkthroughs-that-help step 3: in a walkthrough video a check asks what the change about to run will do,
  // just before the scene that runs it: right after the beat that sets it up, on the run's own case, is its place
  const BW = join(BETA, "walkthrough-video");
  video(BW, fmB, pauseFrames({ question: "The video just said step 4 has two choices. How many pauses?", explained_at: "2" }));
  c = run("check-terms.mjs", [BW]);
  ok("check-terms, a walkthrough video: a check right after its beat, on that beat's own case, is its place (no warning)", c.code === 0 && !/right after frame/.test(c.out) && !/its case is/.test(c.out), c.out);
  run("plan-map.mjs", [BV]);
  const gg = parseGlossary("| Term | id | Meaning | Also | On screen |\n|---|---|---|---|---|\n| A beat | — | one scene | | scene |\n| A grouped beat | — | the rest | | grouped scene |\n| A detail | — | a page | | |\n| The details check | — | checks them | | |\n");
  ok("rowFor: a defined word names its own row, never a shorter one it contains (grouped beat, details check)", rowFor(gg, "grouped beat")?.term === "A grouped beat" && rowFor(gg, "grouped scene")?.term === "A grouped beat" && rowFor(gg, "details check")?.term === "The details check" && rowFor(gg, "scene")?.term === "A beat" && rowFor(gg, "beats")?.term === "A beat");
  // a row's own term comes before another row's word on screen: "guide" is The guide, though "Guide" is a part of it on screen
  const gd = parseGlossary("| Term | id | Meaning | Also | On screen |\n|---|---|---|---|---|\n| A part of the guide | — | a page over the frame | | Guide |\n| The guide | `guide` | the page behind a video | | |\n");
  ok("rowFor: a row's own term first, then another row's word on screen (guide, the guide, part of the guide)", rowFor(gd, "guide")?.term === "The guide" && rowFor(gd, "the guide")?.term === "The guide" && rowFor(gd, "part of the guide")?.term === "A part of the guide");
  // a meaning split for the viewer (the Terms panel): where the files say it goes to `files`, Markdown is kept
  const sp = parseGlossary("| Term | id | Meaning | Also | On screen |\n|---|---|---|---|---|\n| A call | — | A choice the agent made, one the plan did not cover (one row in `walkthrough.md`). Labelled *visible* or *close* | | choice |\n| The answer band | — | The answer bar. A frame with no cards gets it in the lowest eighth (`data-band=\"bottom\"`) | | answer bar |\n| The decision log | — | `decisions.md`: every answer you gave | | |\n| A beat | — | One scene of a video | | scene |\n");
  const [spCall, spBand, spLog, spBeat] = sp;
  ok("parseGlossary: `said` is the meaning in plain words, *emphasis* kept, a parenthesis with code moved to `files`", spCall.said === "A choice the agent made, one the plan did not cover. Labelled *visible* or *close*." && JSON.stringify(spCall.files) === JSON.stringify(["one row in `walkthrough.md`"]) && spCall.meaning.includes("walkthrough.md"), JSON.stringify(spCall));
  ok("…a first sentence that only says the plain word again goes; an attribute in code is a note on the files", spBand.said === "A frame with no cards gets it in the lowest eighth." && spBand.files[0] === '`data-band="bottom"`', JSON.stringify(spBand));
  ok("…a file the meaning starts with goes to `files`, the rest capitalised; a row with none has no `files`", spLog.said === "Every answer you gave." && spLog.files[0] === "`decisions.md`" && spBeat.said === "One scene of a video." && !("files" in spBeat), JSON.stringify([spLog, spBeat]));
  ok("splitMeaning: an older plan map's meaning (backticks gone) splits the same way", JSON.stringify(splitMeaning("One numbered part of a plan (### Step N in plan.md); the video tells each", ["A step"])) === JSON.stringify({ said: "One numbered part of a plan; the video tells each.", files: ["### Step N in plan.md"] }));
  ok("plan-map: `before: <video>#chapter N` reads as part N", map(BV).prerequisites[0]?.part === 2 && map(BV).prerequisites[0]?.partTitle === "Misses and streaks", JSON.stringify(map(BV).prerequisites));

  // better-visuals step 2: a real thing's own text (data-artifact) is glossed in place; lines split on blocks only
  const fmS = 'title: "Beta"\nplan_dir: .reelplanning/plans/2026-01-02-beta\nbefore: none\nterms: streak\nterms_check: strict';
  const artFrames = (screen) => [{ screen, meta: { voiceover: '"A tag, a label the agent puts on a choice it made alone, stops the video, even after a late fix, a miss."', defines: "tag, miss", plan_step: 1 } }, { meta: { voiceover: '"A streak is how many times in a row you accepted that tag."', defines: "streak", plan_step: 1 } }];
  video(BV, fmS, artFrames('<div data-artifact="walkthrough.md"><span>the streak</span> <span>D-110</span></div>'));
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: a real thing's own words (data-artifact) are glossed in place, and an id in them is a △, not a failure, on a strict storyboard", c.code === 0 && /△ frame 1, in the real thing \(data-artifact\): D-110/.test(c.out) && !/"streak" before/.test(c.out) && /1 id in a real thing's own text/.test(c.out), c.out);
  video(BV, fmS, artFrames('<div class="card"><span>the streak</span> <span>D-110</span></div>'));
  c = run("check-terms.mjs", [BV]);
  ok("…the same text on a card is the video's own: the id fails and the word warns", c.code === 1 && /✗ frame 1, on screen: D-110 alone/.test(c.out) && /△ frame 1, on screen: "streak" before frame 2 defines it/.test(c.out), c.out);
  video(BV, fmS, artFrames('<div data-artifact="walkthrough.md">tags · <em data-gloss="streak">accepted in a row</em></div>'));
  c = run("check-terms.mjs", [BV]);
  ok("…a word pinned on the real thing (data-gloss) is the video's word, held to the rules", c.code === 0 && /△ frame 1, on screen: "streak" before frame 2 defines it .*“accepted in a row”/.test(c.out), c.out);
  video(BV, fmS, artFrames('<div class="row"><span>the choice,</span>\n    <span>D-110</span></div>'));
  c = run("check-terms.mjs", [BV]);
  ok("check-terms: text splits on block elements only, so a line wrapped over spans on several source lines is one line", c.code === 0 && !/D-110 alone/.test(c.out), c.out);

  // ── jargon with no meaning (D-216, D-217) ─────────────────────────────────────────────────────────
  // the build finds the words a newcomer may not know; a label is a glossary row (its core table or its
  // "Other words"), a `terms: x = …`, or a bare `terms: x` another video or the glossary gives a meaning
  ok("formPattern: a word is found in its plural and verb forms, whole words only", saysForm("it was merged", "merge") && saysForm("merging it", "merge") && saysForm("two commits, committed", "commit") && saysForm("its dependencies", "dependency") && saysForm("open pull requests", "pull request") && !saysForm("the plan-diff", "diff") && saysForm("two PRs", "pr") && !saysForm("a pr of", "pr"));
  const tl = termsOf("terms: branch = a line of work kept apart until it is merged; merge = to bring a branch in\nterms: pull request, CI = the checks that run on every pull request");
  ok("termsOf: `terms: x = …; y = …` gives meanings, the bare form still reads, and the two mix", JSON.stringify(tl) === JSON.stringify([{ term: "branch", meaning: "a line of work kept apart until it is merged" }, { term: "merge", meaning: "to bring a branch in" }, { term: "pull request" }, { term: "CI", meaning: "the checks that run on every pull request" }]) && JSON.stringify(termsOf("terms: streak, tag")) === '[{"term":"streak"},{"term":"tag"}]', JSON.stringify(tl));
  const og = parseGlossary("| Term | id | Meaning |\n|---|---|---|\n| A tag | — | a label |\n\n## Other words\n\n| Term | id | Meaning |\n|---|---|---|\n| A pull request / PR | — | a change asked to be merged |\n");
  ok("parseGlossary: a row under \"Other words\" is `other: true`; a two-capital acronym is a form (PR)", !og[0].other && og[1].other === true && JSON.stringify(og[1].forms) === '["pull request","pr"]', JSON.stringify(og));
  const J = (text, o = {}) => findJargon(text, { said: true, ...o }).map((x) => `${x.key}:${x.why}`);
  const found = J("Merge the branch, open a PR, and CI runs frame-lint on the HTML; definedIn says where. OK, NEW step.");
  ok("findJargon: a software word (in any form), an acronym, a compound with a jargon part, camel case; not OK or a plain word in capitals", ["merge:a software word", "branch:a software word", "pr:an acronym", "ci:an acronym", "html:an acronym", "frame-lint:a compound", "definedin:a compound"].every((x) => found.includes(x)) && !found.some((x) => /^(ok|new|step):/.test(x)), JSON.stringify(found));
  const code = findJargon("Press Enter, then run plan.md check", { segs: [{ text: "Press ", code: false }, { text: "Enter", code: true }, { text: ", then ", code: false }, { text: "data-detail", code: true }, { text: " and ", code: false }, { text: "plan.md", code: true }, { text: " and ", code: false }, { text: "NextAcceptFlag", code: false }] }).map((x) => x.key);
  ok("findJargon: in code on screen, a file by its name and one word that reads as code; not a key's name, nor plain words run together", code.includes("data-detail") && code.includes("plan.md") && !code.includes("enter") && !code.some((k) => /nextaccept/.test(k)), JSON.stringify(code));
  ok("findJargon: a labelled word, and its file, are not found; nor a word marked plain", !J("The agent opens walkthrough.md on a branch", { labels: ["agent", "walkthrough"], plain: ["branch"] }).length);
  ok("findJargon: \"a brief look\" is the adjective; \"the video's brief\" is the word", !J("Take a brief look.").length && J("The video's brief says so.").includes("brief:a reelplanning word"));

  const GAMMA = join(RP, "plans", "2026-01-03-gamma"), GV = join(GAMMA, "video");
  w(join(GAMMA, "plan.md"), "# Gamma\n\n### Step 1 — one\n\nText.\n");
  const gammaFrames = (screen = "") => [
    { screen, meta: { voiceover: '"A contributor opens a pull request from a branch, and the maintainer merges it when CI passes."', plan_step: 1 } },
    { screen: '<pre>git merge --squash feature</pre><div data-artifact="log">rebase onto main</div>', meta: { voiceover: '"The branch is merged. Then it is merged again, with a flag."', plan_step: 1 } },
  ];
  const fmG = (extra = "") => `title: "Gamma"\nplan_dir: .reelplanning/plans/2026-01-03-gamma\nbefore: none\nterms_check: strict${extra}`;
  video(GV, fmG(), gammaFrames());
  c = run("check-terms.mjs", [GV]);
  ok("check-terms: a word said with no meaning is one line a word, where first said and how often, with where to add one (D-216)", /✗ frame 1 says "branch" \(2×\) with no meaning: add a row to the glossary, or `terms: branch = …` in the storyboard/.test(c.out) && /✗ frame 1 says "pull request" with no meaning/.test(c.out) && /✗ frame 1 says "CI" with no meaning/.test(c.out) && /✗ frame 1 says "merge" \(3×\)/.test(c.out), c.out);
  ok("…it fails a `terms_check: strict` storyboard (D-217); a code block and a real thing's own text are left out; a glossary row labels (flag, in Other words)", c.code === 1 && /words? with no meaning — failing/.test(c.out) && !/"squash"|"rebase"|"git"/.test(c.out) && !/"flag"/.test(c.out), c.out);
  video(GV, fmG().replace("terms_check: strict", ""), gammaFrames());
  c = run("check-terms.mjs", [GV]);
  ok("…and warns on a storyboard from before it", c.code === 0 && /△ frame 1 says "branch" \(2×\) with no meaning/.test(c.out), c.out);
  video(GV, fmG("\nterms: branch = a line of work kept apart until it is merged; merge = to bring a branch's changes in; pull request, CI\nplain: contributor"), gammaFrames());
  c = run("check-terms.mjs", [GV]);
  ok("check-terms: `terms: x = …` labels a word, and no beat has to define it first; a bare `terms: x` no glossary row or other video gives a meaning is still unlabelled", !/"branch"|"merge"/.test(c.out) && /"pull request" with no meaning/.test(c.out) && /"CI" with no meaning/.test(c.out), c.out);
  // another video gives the meaning: a bare term here takes it, and the plan map carries it for the player
  video(join(RP, "plans", "2026-01-04-delta", "video"), 'title: "Delta"\nbefore: none\nterms: pull request = a change someone asks to have merged; CI = the checks run on every pull request', [{}]);
  c = run("check-terms.mjs", [GV]);
  ok("…a bare `terms: x` another video gives a meaning is labelled", c.code === 0 && !/no meaning/.test(c.out), c.out);
  run("plan-map.mjs", [GV]);
  const gm = map(GV);
  ok("plan-map: termMeanings, the video's own `terms: x = …` and a bare word's meaning from another video (the player shows them on hover)", gm.termMeanings?.branch === "a line of work kept apart until it is merged" && gm.termMeanings?.["pull request"] === "a change someone asks to have merged" && gm.termMeanings?.ci === "the checks run on every pull request" && JSON.stringify(gm.terms) === '["branch","merge","pull request","CI"]' && gm.glossary.some((g) => g.other && g.term === "A flag"), JSON.stringify({ t: gm.terms, m: gm.termMeanings }));
  ok("plainOf: the `plain:` words", JSON.stringify(plainOf("plain: flag, Brief")) === '["flag","brief"]');
  // "Other words" never make the system video behind: no beat need define them
  r = run("terms-index.mjs", [GV]);
  ok("terms-index: an \"Other words\" row is not a word the system video is behind on", !JSON.parse(readFileSync(join(RP, "terms-index.json"), "utf8")).undefined.some((k) => /agent|flag|quick check/.test(k)), r.out);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ terms: prerequisites, glossary, ids and walk-throughs in the plan map; check-terms holds the script to them");
process.exit(failed ? 1 : 0);
