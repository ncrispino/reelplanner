#!/usr/bin/env node
// Fresh eyes (videos-that-make-sense, steps 1 and 2; D-225), on a scratch project record with a built-looking
// video (its storyboard, script, frames, plan map and index), without pictures (`--no-shots`: the pictures
// through the review page are the part a browser takes, run on real videos by the skill):
//   step 1  - the two briefs: every scene's narration in order; the newcomer's has the glossary, the video's own
//             words with their meanings, the recap lines, and what viewers were lost on before (a word looked
//             up, "Explain this more", a "wdym" note on a check, a question asked on the page), and nothing from
//             the plan; the designer's has the seven rules; each gives the findings' shape with the round's stamp
//           - the prompt names the brief and the findings file, and nothing else to read
//           - a video not built yet is refused
//   step 2  - --check: no run is a warning; a finding with no answer fails (exit 1), a kept with no reason too,
//             and a meaning whose phrase has none; every one answered passes; a changed scene is named and asks
//             for another round
//           - a new round moves the last one's files to round-1/ and is refused while a finding is unanswered;
//             after the third round a fourth is refused, and what the author kept is what is left (leftAfter), in the
//             plan map for the page's Before you watch, and in the notification's line; only the new ones (D-245):
//             one an earlier round of the build kept for the same reason is folded apart (`again`, sameKept)
//   rebuilds - rounds belong to a build (plan-diff's `changes.build`, the last committed build): a video built again
//             with nothing changed since its commit is that build (its changes kept, the legacy map's build worked
//             out from git); a rebuild is a new build, whose first run moves the last set to build-<n>/ and starts
//             round 1 (three rounds a build); its briefs hold the changed scenes, each with the scene before and after
//             for context only, and no other; a finding on a context scene is out of scope (not counted, no answer);
//             Before you watch has only this build's kept findings, never an earlier build's; `--all` looks at every
//             scene, for the rest of the build; a rebuild that changed nothing a viewer sees has nothing to look at
//           - the prompt names the exact findings path (absolute) and says it is the only file written; `--check`
//             fails on this round's findings written anywhere else (not read from there), and on one role's
//             findings in the other's file
//   step 3  - a question asked on the page: reviews/<id>.md lists it (answered, with where from, or to answer in the next
//             version), and it counts in `reel memory lost`
//   step 5  - fix-clip-durations restamps a frame shorter than its slot (found by the system video's fresh eyes)
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { parseFindings, leftAfter, freshEyesState, sameKept, pointedAt } from "../lib/fresh-eyes.mjs";
import { waitingLine } from "../lib/notify.mjs";
import { actOnMarkdown } from "../lib/review-scope.mjs";
import { reviewFacts, memoryLines } from "../lib/memory.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-fresh-eyes-spec-"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const RP = join(tmp, ".reelplanner"), PD = join(RP, "plans", "2026-10-01-sample"), V = join(PD, "video");
const run = (...a) => spawnSync(process.execPath, [join(ROOT, "scripts", "fresh-eyes.mjs"), ...a], { cwd: tmp, encoding: "utf8" });

mkdirSync(join(V, "compositions", "frames"), { recursive: true }); mkdirSync(join(PD, "reviews"), { recursive: true });
execFileSync("git", ["init", "-q"], { cwd: tmp });
writeFileSync(join(RP, "glossary.md"), "# Glossary\n\n| Term | id | Meaning |\n|---|---|---|\n| The review page | `page` | Where a video is watched and answered |\n\n## Other words\n\n| Term | id | Meaning |\n|---|---|---|\n| A branch | — | A line of work kept apart from the main code until it is merged |\n");
writeFileSync(join(PD, "plan.md"), "# Sample plan\n\n## The problem\n\nSECRET-PLAN-TEXT\n\n### Step 1 — One\n\nx\n");
writeFileSync(join(V, "STORYBOARD.md"), `---
title: "A sample video"
plan_dir: .reelplanner/plans/2026-10-01-sample
terms: saved review file = the file the page writes when you press Send
recap: 2026-09-01-older | Older: what the older plan decided
---

## Frame 1 — Opening

- chapter_start: The start
- voiceover: "The review page shows the video."
- src: compositions/frames/01-opening.html
- duration: 4s

## Frame 2 — The list

- voiceover: "Then the list waits at the end."
- src: compositions/frames/02-the-list.html
- duration: 5s
`);
writeFileSync(join(V, "SCRIPT.md"), "# SCRIPT\n\n## Line 1 — Opening (Frame 1)\n\n    The review page shows the video.\n\n## Line 2 — The list (Frame 2)\n\n    Then the list waits at the end.\n");
writeFileSync(join(V, "compositions", "frames", "01-opening.html"), "<div>one</div>\n");
writeFileSync(join(V, "compositions", "frames", "02-the-list.html"), "<div>two</div>\n");
// a review of an earlier video, with things a viewer was lost on
writeFileSync(join(PD, "reviews", "plan-20260930T100000Z.json"), JSON.stringify({ exportedAt: "2026-09-30T10:00:00Z",
  confusion: { termsLookedUp: ["maintainer"] }, decisions: [{ id: "q1", option: "unclear", question: "Who watches a PR's video?", note: "need more" }],
  quizzes: [{ id: "k1", correct: false, note: "wdym drops the video" }], questions: [{ question: "what's the saved review file?", t: 3 }], annotations: [] }));

// ── step 1 ──
{
  const r = run(V, "--no-shots");
  ok("a video not built yet is refused", r.status !== 0 && /not built yet/.test(r.stderr), r.stderr);
}
writeFileSync(join(V, "index.html"), "<html></html>\n");
writeFileSync(join(V, "plan-map.json"), JSON.stringify({ title: "A sample video", frames: [{ index: 1, start: 0, durationSeconds: 4, chapterStart: "The start" }, { index: 2, start: 4, durationSeconds: 5 }] }));
{
  const r = run(V, "--no-shots");
  ok("fresh-eyes writes both briefs and a stamp (round 1)", r.status === 0 && /round 1 of 3/.test(r.stdout) && ["newcomer-brief.md", "designer-brief.md", "stamp.json"].every((f) => existsSync(join(V, "fresh-eyes", f))), r.stdout + r.stderr);
  const nb = readFileSync(join(V, "fresh-eyes", "newcomer-brief.md"), "utf8"), db = readFileSync(join(V, "fresh-eyes", "designer-brief.md"), "utf8"), st = JSON.parse(readFileSync(join(V, "fresh-eyes", "stamp.json"), "utf8"));
  ok("each brief has every scene's narration, in order", [nb, db].every((b) => b.indexOf("The review page shows the video.") > 0 && b.indexOf("The review page shows the video.") < b.indexOf("Then the list waits at the end.")));
  ok("the newcomer's brief: the glossary (Other words too), the video's own words with their meanings, the recap lines", /Where a video is watched and answered/.test(nb) && /A line of work kept apart/.test(nb) && /\*\*saved review file\*\*: the file the page writes/.test(nb) && /Older: what the older plan decided/.test(nb));
  ok("the newcomer's brief: what viewers were lost on before (a word looked up, Explain this more, a wdym note, a question asked)", /a word looked up[^\n]*maintainer/.test(nb) && /"Explain this more"[^\n]*Who watches a PR's video\?/.test(nb) && /wdym drops the video/.test(nb) && /a question asked on the page[^\n]*saved review file/.test(nb), nb.split("## Viewers were lost")[1]?.slice(0, 600));
  ok("the newcomer's brief has nothing from the plan", !/SECRET-PLAN-TEXT/.test(nb) && !/SECRET-PLAN-TEXT/.test(db));
  ok("the designer's brief has the seven rules", ["Show the thing, never a stand-in", "One reading order", "A label sits on what it labels", "A question says what you decide", "Nothing covers content", "Readable at a glance", "Pleasing"].every((x) => db.includes(x)));
  ok("each brief gives the findings' shape with the round and the stamp", nb.includes(`# Fresh eyes: newcomer · round 1 · stamp ${st.id}`) && db.includes(`# Fresh eyes: designer · round 1 · stamp ${st.id}`) && /- G1 · scene 4 · "/.test(db));
  ok("the stamp: each scene's narration and frame, hashed", st.round === 1 && st.scenes.length === 2 && st.scenes.every((s) => /^[0-9a-f]{12}$/.test(s.narration) && /^[0-9a-f]{12}$/.test(s.frame)));
  const p = run(V, "--prompt", "newcomer");
  ok("the prompt names the brief and the findings file, and nothing else to read", p.status === 0 && /fresh-eyes\/newcomer-brief\.md/.test(p.stdout) && /fresh-eyes\/newcomer\.md/.test(p.stdout) && /Do not open any other file/.test(p.stdout), p.stdout);
}

// ── step 2 ──
const st1 = () => JSON.parse(readFileSync(join(V, "fresh-eyes", "stamp.json"), "utf8")).id;
{
  const c = run(V, "--check");
  ok("--check: agents not back yet is a warning, not a failure", c.status === 0 && /no newcomer\.md yet/.test(c.stdout), c.stdout);
  writeFileSync(join(V, "fresh-eyes", "newcomer.md"), `# Fresh eyes: newcomer · round 1 · stamp ${st1()}\n\n- N1 · scene 2 · "the list": which list? I guessed the list of plans.\n- N2 · scene 1 · "saved review file": never said what is in it.\n`);
  writeFileSync(join(V, "fresh-eyes", "designer.md"), `# Fresh eyes: designer · round 1 · stamp ${st1()}\n\n- none\n`);
  const f = parseFindings(readFileSync(join(V, "fresh-eyes", "newcomer.md"), "utf8"));
  ok("the findings read: id, scene, phrase", f.length === 2 && f[0].id === "N1" && f[0].scene === 2 && f[0].phrase === "the list" && f[1].phrase === "saved review file", JSON.stringify(f));
  const u = run(V, "--check");
  ok("--check: a finding with no answer fails (D-225), naming it", u.status === 1 && /2 findings not answered/.test(u.stdout) && /N1 \(scene 2\) no answer/.test(u.stdout), u.stdout);
  const nm = join(V, "fresh-eyes", "newcomer.md");
  writeFileSync(nm, readFileSync(nm, "utf8").replace("plans.\n", "plans.\n  - Answer: kept\n").replace("in it.\n", "in it.\n  - Answer: meaning: the storyboard's terms say it\n"));
  const k = run(V, "--check");
  ok("--check: kept with no reason fails", k.status === 1 && /N1 \(scene 2\) kept, with no reason/.test(k.stdout) && !/N2/.test(k.stdout), k.stdout);
  writeFileSync(nm, readFileSync(nm, "utf8").replace("  - Answer: kept\n", "  - Answer: kept: scene 2 says what the list is, the choices that don't pause\n").replace('"saved review file"', '"the saved review page"'));
  const m = run(V, "--check");
  ok("--check: a meaning whose phrase has none in the glossary or terms: fails", m.status === 1 && /N2 \(scene 1\) a meaning, but "the saved review page" has none/.test(m.stdout), m.stdout);
  writeFileSync(nm, readFileSync(nm, "utf8").replace('"the saved review page"', '"saved review file"'));
  const a = run(V, "--check");
  ok("--check: every finding answered passes, with the tally", a.status === 0 && /round 1: 2 findings answered \(0 fixed, 1 a meaning, 1 kept\)/.test(a.stdout), a.stdout);
  writeFileSync(join(V, "compositions", "frames", "02-the-list.html"), "<div>two, redrawn</div>\n");
  const s = run(V, "--check");
  ok("--check: a scene changed since they looked is named, and asks for round 2 (a warning)", s.status === 0 && /scene 2 changed since they looked: run fresh eyes again \(round 2 of 3\)/.test(s.stdout), s.stdout);
  ok("freshEyesState says stale", freshEyesState(V).state === "stale");
}
{
  // round 2 is refused while a finding is unanswered
  writeFileSync(join(V, "fresh-eyes", "designer.md"), `# Fresh eyes: designer · round 1 · stamp ${st1()}\n\n- G1 · scene 1 · "Open": the tab sits on the heading (rule 5)\n`);
  const r = run(V, "--no-shots");
  ok("a new round is refused while a finding is unanswered", r.status !== 0 && /G1/.test(r.stderr), r.stderr);
  writeFileSync(join(V, "fresh-eyes", "designer.md"), readFileSync(join(V, "fresh-eyes", "designer.md"), "utf8") + "  - Answer: fixed: the heading moved down 48 px, compositions/frames/01-opening.html\n");
  const r2 = run(V, "--no-shots");
  ok("round 2 moves round 1's files to round-1/", r2.status === 0 && /round 2 of 3/.test(r2.stdout) && existsSync(join(V, "fresh-eyes", "round-1", "newcomer.md")) && existsSync(join(V, "fresh-eyes", "round-1", "stamp.json")) && !existsSync(join(V, "fresh-eyes", "newcomer.md")), r2.stdout + r2.stderr);
  ok("leftAfter: nothing is left before the third round", leftAfter(V).left.length === 0 && leftAfter(V).rounds === 2);
  writeFileSync(join(V, "fresh-eyes", "newcomer.md"), `# Fresh eyes: newcomer · round 2 · stamp ${st1()}\n\n- N1 · scene 2 · "the list": still unsure which list.\n  - Answer: kept: scene 2 names it, the choices that don't pause\n`);
  writeFileSync(join(V, "fresh-eyes", "designer.md"), `# Fresh eyes: designer · round 2 · stamp ${st1()}\n\n- none\n`);
  const r3 = run(V, "--no-shots"); ok("round 3", r3.status === 0 && /round 3 of 3/.test(r3.stdout), r3.stdout + r3.stderr);
  // round 3: the list again, worded its own way and kept for the same reason (a repeat); the list for another
  // reason, a phrase not flagged before, and the designer's "Open" that round 1 fixed, kept now (each new)
  writeFileSync(join(V, "fresh-eyes", "newcomer.md"), `# Fresh eyes: newcomer · round 3 · stamp ${st1()}\n\n`
    + `- N1 · scene 2 · "the list" (on the left): which list is it? I guessed the plans.\n  - Answer: kept: scene 2 names the list, "the choices that don't pause"\n`
    + `- N2 · scene 2 · "the list": it has no title.\n  - Answer: kept: a title would repeat the narration, which says it as the list appears\n`
    + `- N3 · scene 1 · "shows the video": shows it where?\n  - Answer: kept: the review page is on screen, its name in the glossary\n`);
  writeFileSync(join(V, "fresh-eyes", "designer.md"), `# Fresh eyes: designer · round 3 · stamp ${st1()}\n\n- G1 · scene 1 · "Open": the tab still sits near the heading (rule 5)\n  - Answer: kept: the tab is 48 px below the heading now, on no words\n`);
  const r4 = run(V, "--no-shots");
  ok("a fourth round is refused", r4.status !== 0 && /3 rounds done/.test(r4.stderr), r4.stderr);
  const left = leftAfter(V);
  ok("after the third round, what the author kept is what is left, with the reason", left.rounds === 3 && left.left.length === 3 && /title would repeat/.test(left.left.find((x) => x.id === "N2")?.why), JSON.stringify(left));
  ok("…only the new ones (D-245): a finding kept again for the reason an earlier round gave is not listed, it is in `again` with the finding it repeats", left.left.map((x) => x.id).join() === "N2,N3,G1" && left.again.length === 1 && left.again[0].id === "N1" && left.again[0].as === "round 1 · N1" && /choices that don't pause/.test(left.again[0].why), JSON.stringify(left));
  const pm = spawnSync(process.execPath, [join(ROOT, "scripts", "plan-map.mjs"), V], { cwd: tmp, encoding: "utf8" }), map = JSON.parse(readFileSync(join(V, "plan-map.json"), "utf8"));
  ok("plan-map carries what is left, for the page's Before you watch, and the repeats folded apart", pm.status === 0 && map.freshEyes?.rounds === 3 && map.freshEyes.left.length === 3 && map.freshEyes.left[0].role === "newcomer" && map.freshEyes.again?.length === 1 && /3 finding\(s\) left as they are after 3 rounds, 1 more kept again/.test(pm.stdout), pm.stdout + pm.stderr);
  ok("the notification's line says the new ones", /3 things fresh eyes left as they are/.test(waitingLine(map)), waitingLine(map));
  writeFileSync(join(V, "compositions", "frames", "01-opening.html"), "<div>one, again</div>\n");
  const c = run(V, "--check");
  ok("after three rounds a changed scene is not asked for again", c.status === 0 && /3 rounds done/.test(c.stdout), c.stdout);
}

// ── D-245: a kept finding repeats one an earlier round kept (same role, scene, thing, reason or near it) ──
{
  const f = (role, scene, what, why) => ({ role, scene, what, why });
  const a = f("newcomer", 12, 'scene 12 · "frame-lint … fails the two a program can see": I guessed frame-lint is a command.', "the narration says it plainly, a check the build runs, and the frame puts frame-lint fails it under the two rules");
  const b = f("newcomer", 12, 'scene 12 · "frame-lint, a check the build runs, fails the two a program can see": what is the build?', "the narration names it plainly, a check the build runs, with frame-lint fails it under the two rules");
  ok("sameKept: the same thing quoted another way, kept for near the same reason, is a repeat", sameKept(b, a));
  ok("sameKept: another role, or another scene, is not", !sameKept({ ...b, role: "designer" }, a) && !sameKept({ ...b, scene: 11 }, a));
  ok("sameKept: the same thing kept for another reason is not", !sameKept({ ...b, why: "whether the video stops on it is for another scene to say" }, a));
  const g1 = f("designer", 12, 'scene 12 · "rule 1: grey lines, no words": the label touches the box.', "the tag sits beside the box, on no words");
  const g2 = f("designer", 12, 'scene 12 · "rule 5: a button over words": the tag hovers over the chip.', "the tag sits above the button, on no words");
  ok("sameKept: another thing on the same scene, kept for a like reason, is not (rule 1's tag is not rule 5's)", !sameKept(g1, g2));
  ok("pointedAt: a finding's first quoted phrase, however long", pointedAt('scene 13 · "A phrase fresh eyes flagged, and the author kept, gets a meaning: it\'s underlined": x') === "A phrase fresh eyes flagged, and the author kept, gets a meaning: it's underlined");
}

// ── rebuilds: rounds belong to a build ──
{
  const B = join(RP, "plans", "2026-10-02-rebuild", "video"), FE = join(B, "fresh-eyes");
  const git = (...a) => spawnSync("git", ["-c", "user.email=spec@example.com", "-c", "user.name=spec", ...a], { cwd: tmp, encoding: "utf8" });
  const commit = (m) => { git("add", "-A", "."); return git("commit", "-q", "-m", m).status === 0; };
  const diff = () => spawnSync(process.execPath, [join(ROOT, "scripts", "plan-diff.mjs"), B], { cwd: tmp, encoding: "utf8" });
  const fe = (...a) => spawnSync(process.execPath, [join(ROOT, "scripts", "fresh-eyes.mjs"), B, ...a], { cwd: tmp, encoding: "utf8" });
  const mapOf = () => JSON.parse(readFileSync(join(B, "plan-map.json"), "utf8"));
  const stamp = () => JSON.parse(readFileSync(join(FE, "stamp.json"), "utf8"));
  const say = (n) => `Scene ${n} says its own thing, number ${n}.`;
  mkdirSync(join(B, "compositions", "frames"), { recursive: true });
  const N = 7, ids = Array.from({ length: N }, (_, i) => `0${i + 1}-s${i + 1}`);
  writeFileSync(join(B, "STORYBOARD.md"), `---\ntitle: "A rebuilt video"\nplan_dir: .reelplanner/plans/2026-10-02-rebuild\n---\n\n` + ids.map((id, i) => `## Frame ${i + 1} — S${i + 1}\n\n- voiceover: "${say(i + 1)}"\n- src: compositions/frames/${id}.html\n- duration: 4s\n`).join("\n"));
  writeFileSync(join(B, "SCRIPT.md"), "# SCRIPT\n\n" + ids.map((id, i) => `## Line ${i + 1} — S${i + 1} (Frame ${i + 1})\n\n    ${say(i + 1)}\n`).join("\n"));
  ids.forEach((id, i) => writeFileSync(join(B, "compositions", "frames", `${id}.html`), `<div>words of scene ${i + 1}</div>\n`));
  writeFileSync(join(B, "index.html"), "<html></html>\n");
  const frames = (durs = []) => ids.map((id, i) => ({ index: i + 1, compositionId: id, title: `S${i + 1}`, start: i * 4, durationSeconds: durs[i] ?? 4 }));
  writeFileSync(join(B, "plan-map.json"), JSON.stringify({ title: "A rebuilt video", totalSeconds: N * 4, frames: frames() }));
  const answerAll = (role, n, lines) => writeFileSync(join(FE, `${role}.md`), `# Fresh eyes: ${role} · round ${n} · stamp ${stamp().id}\n\n${lines || "- none"}\n`);
  const kept = (id, scene, what) => `- ${id} · scene ${scene} · "${what}": unclear here.\n  - Answer: kept: scene ${scene} says it plainly already\n`;

  // the first build: every scene, three rounds
  const d0 = diff();
  ok("plan-diff: no previous build is the first build", d0.status === 0 && mapOf().changes.build === "first" && mapOf().changes.baseline === false, d0.stdout + d0.stderr);
  const r1 = fe("--no-shots"), b1 = readFileSync(join(FE, "newcomer-brief.md"), "utf8");
  ok("a first build: round 1, every scene in the briefs, nothing marked context", r1.status === 0 && /round 1 of 3:/.test(r1.stdout) && ids.every((_, i) => b1.includes(say(i + 1))) && !/context only/.test(b1) && stamp().build === "first" && stamp().scope === null, r1.stdout + r1.stderr);
  answerAll("newcomer", 1, kept("N1", 4, "the thing")); answerAll("designer", 1);
  ok("…round 2 and round 3 of the first build", fe("--no-shots").status === 0 && (answerAll("newcomer", 2, kept("N1", 4, "the thing")), answerAll("designer", 2), fe("--no-shots").status === 0) && stamp().round === 3);
  answerAll("newcomer", 3, kept("N1", 4, "the old thing") + kept("N2", 5, "another old thing")); answerAll("designer", 3);
  ok("…and no fourth look at the same build", /3 rounds done on this build/.test(fe("--no-shots").stderr));
  spawnSync(process.execPath, [join(ROOT, "scripts", "plan-map.mjs"), B], { cwd: tmp, encoding: "utf8" });
  writeFileSync(join(B, "plan-map.json"), JSON.stringify({ ...mapOf(), frames: mapOf().frames.map((f, i) => ({ ...f, compositionId: ids[i], title: `S${i + 1}` })) }));
  diff();
  ok("the first build's Before you watch: its kept findings, the one kept in round 1 for the same reason folded apart (D-245)", mapOf().freshEyes?.left?.map((x) => x.id).join() === "N2" && mapOf().freshEyes.again?.map((x) => x.as).join() === "round 1 · N1", JSON.stringify(mapOf().freshEyes));
  ok("the first build is committed", commit("build 1"));

  // built again, nothing changed: the same build
  const d1 = diff();
  ok("plan-diff: built again with nothing changed since the commit, it is that build (its build kept)", d1.status === 0 && /nothing changed/.test(d1.stdout) && mapOf().changes.build === "first", d1.stdout + d1.stderr);
  const c1 = fe("--check");
  ok("…so fresh eyes stands: 3 rounds done, nothing asked for", c1.status === 0 && freshEyesState(B).state === "done" && !/not had fresh eyes/.test(c1.stdout), c1.stdout);

  // a rebuild: scenes 2 and 6 change
  writeFileSync(join(B, "compositions", "frames", `${ids[1]}.html`), "<div>words of scene 2, rewritten</div>\n");
  writeFileSync(join(B, "compositions", "frames", `${ids[5]}.html`), "<div>words of scene 6, rewritten</div>\n");
  const d2 = diff(), build2 = mapOf().changes.build;
  ok("plan-diff: a rebuild is a new build, named by the build it is compared against", d2.status === 0 && /^[0-9a-f]{12}$/.test(build2) && mapOf().changes.changedFrames.join() === "2,6", d2.stdout + JSON.stringify(mapOf().changes));
  ok("Before you watch: nothing from the earlier build's rounds once the video is rebuilt", !mapOf().freshEyes && leftAfter(B) === null, JSON.stringify(mapOf().freshEyes));
  const c2 = fe("--check");
  ok("--check: the rebuild has not had fresh eyes yet, naming its changed scenes (a warning)", c2.status === 0 && /this build has not had fresh eyes yet \(scenes 2, 6 changed since the last build\)/.test(c2.stdout) && freshEyesState(B).state === "none", c2.stdout);
  const r2 = fe("--no-shots"), nb = readFileSync(join(FE, "newcomer-brief.md"), "utf8"), db = readFileSync(join(FE, "designer-brief.md"), "utf8");
  ok("a new build: the last set moves to build-1/ (its three rounds kept) and this one starts at round 1", r2.status === 0 && /a new build: the last build's rounds are kept in/.test(r2.stdout) && /round 1 of 3 of this build, on scenes 2, 6/.test(r2.stdout) && [1, 2, 3].every((n) => existsSync(join(FE, "build-1", `round-${n}`, "newcomer.md")) && existsSync(join(FE, "build-1", `round-${n}`, "stamp.json"))) && !existsSync(join(FE, "round-1")) && !existsSync(join(FE, "newcomer.md")), r2.stdout + r2.stderr);
  ok("…its stamp: the build, the scenes in scope, the context scenes", stamp().round === 1 && stamp().build === build2 && stamp().scope.join() === "2,6" && stamp().context.join() === "1,3,5,7", JSON.stringify(stamp()));
  ok("the rebuild's briefs: the changed scenes, the one before and after each marked context only, and no other", [nb, db].every((b) => [1, 2, 3, 5, 6, 7].every((n) => b.includes(say(n))) && !b.includes(say(4)) && /### Scene 2 · look at this one/.test(b) && /### Scene 6 · look at this one/.test(b) && /### Scene 5 · context only/.test(b) && /_\(scene 4: not changed, not here\)_/.test(b) && /This is a rebuild: look only at what it changed/.test(b) && /\(only scenes 2, 6\)/.test(b)), nb.split("## The video, scene by scene")[1]);
  const p = fe("--prompt", "designer");
  ok("the prompt names the exact findings file (an absolute path), and says it is the only file written", p.status === 0 && p.stdout.includes(`  ${join(FE, "designer.md")}\n`) && p.stdout.includes(`  ${join(FE, "designer-brief.md")}\n`) && /It is the only file you write/.test(p.stdout), p.stdout);

  // a finding on a context scene is out of scope
  writeFileSync(join(FE, "newcomer.md"), `# Fresh eyes: newcomer · round 1 · stamp ${stamp().id}\n\n- N1 · scene 5 · "number 5": the old scene is unclear.\n- N2 · scene 6 · "rewritten": rewritten how?\n`);
  answerAll("designer", 1);
  const c3 = fe("--check");
  ok("--check: a finding on a context scene is out of scope (named, not counted, no answer needed); one in scope still needs its answer", c3.status === 1 && /N1 \(scene 5\) is on a scene this build did not change/.test(c3.stdout) && /1 finding not answered: N2 \(scene 6\) no answer/.test(c3.stdout), c3.stdout);
  writeFileSync(join(FE, "newcomer.md"), readFileSync(join(FE, "newcomer.md"), "utf8") + "  - Answer: kept: scene 6 says how in its narration\n");
  const c4 = fe("--check");
  ok("…answered, it passes, the tally counting only the scenes in scope", c4.status === 0 && /round 1 \(scenes 2, 6, what this build changed\): 1 finding answered \(0 fixed, 0 a meaning, 1 kept\)/.test(c4.stdout), c4.stdout);

  // the scratch-folder contract: this round's findings anywhere else are refused
  const good = readFileSync(join(FE, "designer.md"), "utf8");
  rmSync(join(FE, "designer.md"));
  writeFileSync(join(tmp, "designer.md"), `# Fresh eyes: designer · round 1 · stamp ${stamp().id}\n\n- G1 · scene 2 · "rewritten": too small (rule 6)\n`);
  mkdirSync(join(FE, "scratch"), { recursive: true }); writeFileSync(join(FE, "scratch", "notes.md"), `# Fresh eyes: designer · round 1 · stamp ${stamp().id}\n\n- none\n`);
  const c5 = fe("--check");
  ok("--check: findings written outside the expected path fail, each named (the repo's root, a folder under fresh-eyes), and are not read", c5.status === 1 && /findings written outside/.test(c5.stdout) && /the designer's at designer\.md/.test(c5.stdout) && /fresh-eyes\/scratch\/notes\.md/.test(c5.stdout) && freshEyesState(B).state === "open" && !/G1/.test(c5.stdout.replace(/findings written outside[^\n]*/, "")), c5.stdout);
  rmSync(join(tmp, "designer.md")); rmSync(join(FE, "scratch"), { recursive: true });
  writeFileSync(join(FE, "designer.md"), readFileSync(join(FE, "newcomer.md"), "utf8"));
  const c6 = fe("--check");
  ok("--check: one role's findings in the other's file fail", c6.status === 1 && /designer\.md holds the newcomer's findings/.test(c6.stdout), c6.stdout);
  writeFileSync(join(FE, "designer.md"), good);
  ok("…the file back where it belongs, it passes", fe("--check").status === 0);

  // three rounds a build: rounds 2 and 3 of this build, then no fourth
  ok("round 2 and round 3 of this build (the cap is per build)", fe("--no-shots").status === 0 && stamp().round === 2 && stamp().build === build2 && (answerAll("newcomer", 2), answerAll("designer", 2), fe("--no-shots").status === 0) && stamp().round === 3 && stamp().scope.join() === "2,6");
  writeFileSync(join(FE, "newcomer.md"), `# Fresh eyes: newcomer · round 3 · stamp ${stamp().id}\n\n- N1 · scene 3 · "number 3": context.\n- N2 · scene 6 · "rewritten": still unsure how.\n  - Answer: kept: the rewritten frame draws each step while it is spoken\n`);
  answerAll("designer", 3);
  ok("…and a fourth is refused", /3 rounds done on this build/.test(fe("--no-shots").stderr));
  diff();
  const left = mapOf().freshEyes?.left || [];
  ok("Before you watch: only this build's kept findings in scope (not the earlier build's two, not a context scene's)", left.length === 1 && left[0].id === "N2" && left[0].scene === 6 && leftAfter(B).left.length === 1, JSON.stringify(mapOf().freshEyes));
  ok("the rebuild is committed", commit("build 2"));

  // a committed build built again keeps its changes and its build; a map from before builds were stamped gets its build from git
  const d3 = diff();
  ok("plan-diff: the committed rebuild built again keeps its changes and its build", /nothing changed/.test(d3.stdout) && mapOf().changes.build === build2 && mapOf().changes.changedFrames.join() === "2,6" && mapOf().frames[1].change?.status === "edited" && mapOf().freshEyes?.left?.length === 1, d3.stdout + JSON.stringify(mapOf().changes));
  { const m = mapOf(); delete m.changes.build; writeFileSync(join(B, "plan-map.json"), JSON.stringify(m, null, 2) + "\n"); git("commit", "-q", "--amend", "-a", "--no-edit"); }
  const d4 = diff();
  ok("…a map from before builds were stamped: its build is the plan map committed before it, hashed", /nothing changed/.test(d4.stdout) && mapOf().changes.build === build2, d4.stdout + JSON.stringify(mapOf().changes));

  // a rebuild that changed nothing a viewer sees: nothing to look at
  writeFileSync(join(B, "plan-map.json"), JSON.stringify({ ...mapOf(), frames: mapOf().frames.map((f, i) => ({ ...f, durationSeconds: i === 0 ? 4.5 : f.durationSeconds })) }, null, 2));
  diff();
  const r5 = fe("--no-shots"), c7 = fe("--check");
  ok("a rebuild that only moved a scene's length: nothing new to look at, the set stays", r5.status === 0 && /nothing a viewer sees changed/.test(r5.stdout) && !existsSync(join(FE, "build-2")) && c7.status === 0 && /its rounds stand/.test(c7.stdout) && leftAfter(B)?.left.length === 1, r5.stdout + c7.stdout);
  writeFileSync(join(B, "plan-map.json"), JSON.stringify({ ...mapOf(), frames: mapOf().frames.map((f) => ({ ...f, durationSeconds: 4 })) }, null, 2));

  // --all: every scene, and it holds for the build's later rounds
  writeFileSync(join(B, "compositions", "frames", `${ids[6]}.html`), "<div>words of scene 7, rewritten</div>\n");
  diff();
  const r6 = fe("--no-shots", "--all"), ab = readFileSync(join(FE, "newcomer-brief.md"), "utf8");
  ok("--all on a rebuild: every scene, none context, and the last set kept in build-2/", r6.status === 0 && /every scene \(--all\)/.test(r6.stdout) && ids.every((_, i) => ab.includes(say(i + 1))) && !/context only/.test(ab) && stamp().scope === null && stamp().all === true && existsSync(join(FE, "build-2", "round-3", "stamp.json")), r6.stdout + r6.stderr);
  answerAll("newcomer", 1); answerAll("designer", 1);
  ok("…and the build's next round is the whole video too", fe("--no-shots").status === 0 && stamp().round === 2 && stamp().scope === null);
}

// ── step 3: a question asked on the page, in the record ──
{
  const review = { exportedAt: "2026-10-01T10:00:00Z", verdict: "approve", annotations: [], quizzes: [],
    questions: [{ question: "what's the saved review file?", t: 62, frame: { index: 4, title: "The file" }, planStep: 3, answered: false },
      { question: "and the list?", t: 70, frame: { index: 5, title: "The list" }, planStep: 3, answer: "The choices that don't pause.", from: "the plan, step 2", via: "claude" }] };
  const md = actOnMarkdown({ id: "plan-x", kind: "plan", review, planName: "p" });
  ok("reviews/<id>.md lists the questions asked: one unanswered, to answer in the next version; one answered, with where from", /## Questions you asked/.test(md) && /scene 4, "The file", at 1:02 \(step 3\): "what's the saved review file\?"\n  - not answered on the page: answer it in the next version/.test(md) && /answered by Claude on the page \(from: the plan, step 2\)/.test(md), md.split("## Questions")[1]);
  const f = reviewFacts({ id: "plan-x", kind: "plan", at: review.exportedAt, review }, { plan: "p" });
  const lost = memoryLines([f]).find((l) => l.id === "lost");
  ok("a question asked counts in `reel memory lost` like a word looked up", f.lost.asked.length === 2 && /2 questions asked on the page/.test(lost?.text || "") && /what's the saved review file\?/.test(lost?.evidence?.join(" ") || ""), JSON.stringify(lost));
}

// ── step 5: the system video's fresh eyes found frames blank for their last moment (a voice line re-voiced longer
// than the frame's own length): fix-clip-durations restamps a frame to its slot in index.html
{
  const P = join(tmp, "clips"); mkdirSync(join(P, "compositions", "frames"), { recursive: true });
  writeFileSync(join(P, "STORYBOARD.md"), "## Frame 1 — A\n\n- src: compositions/frames/01-a.html\n");
  writeFileSync(join(P, "index.html"), '<div id="el-01-a" class="scene" data-composition-id="01-a" data-composition-src="compositions/frames/01-a.html" data-start="0" data-duration="14.715" data-track-index="1"></div>\n');
  writeFileSync(join(P, "compositions", "frames", "01-a.html"), '<div id="root" data-composition-id="01-a" data-duration="13.34"><div class="clip a-bg" data-start="0" data-duration="13.34"></div><div class="clip a-scene" data-start="0" data-duration="13.34"></div></div>\n');
  const r = spawnSync(process.execPath, [join(ROOT, "scripts", "fix-clip-durations.mjs"), P], { encoding: "utf8" }), f = readFileSync(join(P, "compositions", "frames", "01-a.html"), "utf8");
  ok("fix-clip-durations restamps a frame shorter than its slot, root and full-length layers", r.status === 0 && (f.match(/data-duration="14\.715"/g) || []).length === 3 && /1 frame root\(s\) restamped/.test(r.stdout), r.stdout + f);
}

rmSync(tmp, { recursive: true, force: true });
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ fresh-eyes: all passed");
process.exit(failed ? 1 : 0);
