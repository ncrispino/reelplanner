#!/usr/bin/env node
// Build <project>/plan-map.json from STORYBOARD.md: the bridge between the video's clips
// (composition ids in index.html) and the plan (step numbers, open questions).
// The annotation player reads this to turn a stroke at t=41s into "step 2".
//
// usage: reelplanner plan-map <project-dir>
//        reelplanner plan-map <project-dir> --thumbs    only each frame's thumbnail, from the snapshots/ there now
//                                                       (snapshot.sh runs it after taking them: lib/thumbs.mjs)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve, relative, sep } from "node:path";
import { planMdFor, readPlanMd } from "./lib/plan-md.mjs";
import { repoRoot } from "./lib/env.mjs";
import { parseCalls, splitTags } from "./lib/autonomy.mjs";
import { addAccess } from "./lib/terms.mjs";
import { leftAfter } from "./lib/fresh-eyes.mjs";
import { parseScript } from "./lib/narration.mjs";
import { snapshotsIn, attachThumbs } from "./lib/thumbs.mjs";
import { guideParts } from "./lib/guide/model.mjs";
import { nextSuggestions } from "./lib/explainer.mjs";

const dir = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!dir) { console.error("usage: reelplanner plan-map <project-dir> [--thumbs]"); process.exit(1); }
// --thumbs: the map as it is, each frame's thumbnail set again from the pictures taken since it was written
if (process.argv.includes("--thumbs")) {
  const p = join(dir, "plan-map.json");
  if (!existsSync(p)) { console.error(`✗ plan-map --thumbs: no plan-map.json in ${dir} (reelplanner plan-map ${dir} writes it)`); process.exit(1); }
  const map = JSON.parse(readFileSync(p, "utf8")), frames = map.frames || [], snaps = snapshotsIn(dir);
  const n = attachThumbs(frames, snaps);
  writeFileSync(p, JSON.stringify(map, null, 2) + "\n");
  console.log(`${n === frames.length ? "✓" : "△"} plan-map.json thumbnails: ${n} of ${frames.length} frames, from ${snaps.length} snapshot(s)${n < frames.length ? ` (none for frame${frames.length - n > 1 ? "s" : ""} ${frames.filter((f) => !f.thumb).map((f) => f.index).join(", ")}: reelplanner snapshot ${dir})` : ""}`);
  process.exit(0);
}
const sb = readFileSync(join(dir, "STORYBOARD.md"), "utf8");

const frames = [];
const blocks = sb.split(/\n(?=## Frame )/).slice(1);
// each scene's narration as it is said (SCRIPT.md), for Ask about this (videos-that-make-sense step 3): what the
// scene says is what a question about it is answered from, with the plan and the glossary
const narration = existsSync(join(dir, "SCRIPT.md")) ? Object.fromEntries(parseScript(readFileSync(join(dir, "SCRIPT.md"), "utf8")).map((l) => [l.frame, l.text])) : {};
for (const b of blocks) {
  const head = b.match(/^## Frame (\d+) — (.+)$/m);
  const meta = {};
  for (const m of b.matchAll(/^- ([a-z_]+):\s*(.*)$/gm)) meta[m[1]] = m[2].trim();
  if (!meta.src) continue;
  const compId = basename(meta.src).replace(/\.html$/, "");
  const f = {
    index: Number(head[1]),
    title: head[2].trim(),
    compositionId: compId,
    type: meta.type || null,
    durationSeconds: parseFloat(meta.duration) || null,
    planStep: meta.plan_step ? Number(meta.plan_step) : null,
    planQuestions: meta.plan_questions ? meta.plan_questions.split(",").map((s) => Number(s.trim())) : [],
    // what the frame explains (system video): the spec.md section and the system.json parts. A comment
    // on the frame lands on these, so a review of the system video names the parts it is about.
    specSection: meta.spec_section || null,
    components: meta.components ? meta.components.split(",").map((x) => x.trim()).filter(Boolean) : [],
    decision: meta.decision || null,          // e.g. "q1": this frame asks the reviewer to choose
    branch: meta.branch || null,              // e.g. "q1=a": this frame is the consequence of option a
    question: meta.question || null,
    chapterStart: meta.chapter_start || null,
    knowledge: meta.knowledge ? meta.knowledge.split(",").map((x) => x.trim()).filter(Boolean) : null,   // levels that include this frame; null = all
    quiz: meta.quiz || null, answer: meta.answer || null, explain: meta.explain || null,
    explainedAt: meta.explained_at || null,   // a quick check: the beat that explains what it tests (a frame number or composition id)
    autonomy: meta.autonomy || null, autonomyGroup: meta.autonomy_group ? meta.autonomy_group.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean) : null,
    autonomyList: meta.autonomy_list ? meta.autonomy_list.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean) : null, chose: meta.chose || null, insteadOf: meta.instead_of || null, why: meta.why || null, check: meta.check || null,
    kind: meta.kind || null,                  // "multi": pick all that apply (richer-review step 2)
    summary: meta.summary || null,            // e.g. "q1": the one frame a multi-select answer plays (D-004)
    // a page from a template (deep-dives step 1): details/<detail>.html, which the player opens over this scene
    detail: meta.detail || null, detailTitle: meta.detail_title || null, detailKind: meta.detail_kind || null, detailWhy: meta.detail_why || null,
    // a part of the guide (the plan guide, step 3): `- guide: <part>[#<place>]`, opened over the frame as a detail is
    guide: meta.guide || null, guideTitle: meta.guide_title || null, guideWhy: meta.guide_why || null,
    options: ["a", "b", "c", "d"].filter((k) => meta[`option_${k}`]).map((k) => ({ id: k, label: meta[`option_${k}`], why: meta[`why_${k}`] || "", recommended: (meta.recommended || "a") === k,
      // answer in the frame: the fuller text the player shows on a card ("more"), and a quick check's per-option
      // why (right or wrong), shown on its card once answered, never before
      ...(meta[`option_${k}_more`] ? { more: meta[`option_${k}_more`] } : {}), ...(meta[`option_${k}_why`] ? { afterWhy: meta[`option_${k}_why`] } : {}) })),
    questionMore: meta.question_more || null,   // the full question, behind the frame's heading
    openQuestion: meta.open_question || null,   // a walkthrough's ending: one open question, answered in the reviewer's words (walkthroughs-that-help step 3)
    ...(meta.source ? { source: meta.source } : {}),   // an explainer's scene: where its facts come from (explain-first step 5)
    // an explainer's scene: what Explain more or Plan this would mean from here, offered at Finish (step 3)
    ...(meta.next_more ? { nextMore: meta.next_more } : {}), ...(meta.next_plan ? { nextPlan: meta.next_plan } : {}),
    ...(narration[Number(head[1])] ? { narration: narration[Number(head[1])] } : {}),
  };
  frames.push(f);
}
// cumulative starts, same rule the assembler uses (frames are sequential on track 1)
let t = 0;
for (const f of frames) { f.start = +t.toFixed(3); t += f.durationSeconds || 0; }
// a thumbnail per frame from snapshots/ (lib/thumbs.mjs): the pictures there now, the last build's until verify
// takes this one's and sets them again (snapshot.sh)
attachThumbs(frames, snapshotsIn(dir));
// decisions: a decision frame + its branch frames (one per option) that directly follow it
const decisions = frames.filter((f) => f.decision).map((f) => {
  const opts = f.options.map((o) => {
    const b = frames.find((x) => x.branch === `${f.decision}=${o.id}`);
    return { ...o, branch: b ? { frameIndex: b.index, compositionId: b.compositionId, start: b.start, end: +(b.start + b.durationSeconds).toFixed(3) } : null };
  });
  // a pick-all-that-apply question plays one summary frame of the picks, not a branch per pick (D-004)
  const s = frames.find((x) => x.summary === f.decision);
  const summary = s ? { frameIndex: s.index, compositionId: s.compositionId, start: s.start, end: +(s.start + s.durationSeconds).toFixed(3) } : null;
  const branchEnds = [...opts.map((o) => o.branch?.end), summary?.end].filter(Boolean);
  return { id: f.decision, kind: f.kind === "multi" ? "multi" : "one", frameIndex: f.index, compositionId: f.compositionId, planStep: f.planStep, question: f.question, ...(f.questionMore ? { questionMore: f.questionMore } : {}), at: +(f.start + f.durationSeconds - 0.05).toFixed(3), resumeAt: branchEnds.length ? Math.max(...branchEnds) : +(f.start + f.durationSeconds).toFixed(3), options: opts, summary };
});
// chapters: each frame tagged chapter_start opens one; a chapter runs to the frame before the next start
const chapters = [];
for (const f of frames) if (f.chapterStart) chapters.push({ id: `ch${chapters.length + 1}`, title: f.chapterStart, fromFrame: f.index, toFrame: null, start: f.start, end: null });
for (let i = 0; i < chapters.length; i++) { const nxt = chapters[i + 1]; const last = nxt ? frames.find((x) => x.index === nxt.fromFrame - 1) : frames[frames.length - 1]; chapters[i].toFrame = last.index; chapters[i].end = +(last.start + last.durationSeconds).toFixed(3); }
for (const c of chapters) {
  const skipped = decisions.filter((d) => d.frameIndex >= c.fromFrame && d.frameIndex <= c.toFrame).reduce((a, d) => a + d.options.filter((o) => o.branch && !o.recommended).reduce((b, o) => b + (o.branch.end - o.branch.start), 0), 0);
  c.linearSeconds = +(c.end - c.start).toFixed(3); c.watchedSeconds = +(c.end - c.start - skipped).toFixed(3);
  c.decisions = decisions.filter((d) => d.frameIndex >= c.fromFrame && d.frameIndex <= c.toFrame).map((d) => d.id);
}
// quiz beats: pause at the end, ask, reveal the answer. `- explained_at: <frame number or composition id>`
// names the beat "Back to where this was explained" goes to; without it the player goes to the first beat of
// the quick check's step, else the start of its part.
const explainedFrame = (f) => { const v = String(f.explainedAt || "").trim(); if (!v) return null;
  const x = /^\d+$/.test(v) ? frames.find((y) => y.index === Number(v)) : frames.find((y) => y.compositionId === v || y.compositionId === basename(v).replace(/\.html$/, ""));
  if (!x) console.warn(`frame ${f.index} (${f.quiz}): explained_at "${v}" names no frame; the player falls back to its step`);
  return x || null; };
const quizzes = frames.filter((f) => f.quiz).map((f) => { const x = explainedFrame(f); return { id: f.quiz, frameIndex: f.index, planStep: f.planStep, question: f.question, ...(f.questionMore ? { questionMore: f.questionMore } : {}), options: f.options.map(({ id, label, more, afterWhy }) => ({ id, label, ...(more ? { more } : {}), ...(afterWhy ? { why: afterWhy } : {}) })), answer: f.answer, explain: f.explain, at: +(f.start + f.durationSeconds - 0.05).toFixed(3), ...(x ? { explainedAt: x.start, explainedFrame: x.index } : {}) }; });
// the open question a walkthrough ends on (walkthroughs-that-help step 3): the player asks it where the review
// is finished, with room for the reviewer's words
const oqf = frames.filter((f) => f.openQuestion).at(-1), openQuestion = oqf ? { question: oqf.openQuestion, frameIndex: oqf.index, at: +(oqf.start + (oqf.durationSeconds || 0) - 0.05).toFixed(3) } : null;
for (const f of frames) { delete f.explainedAt; delete f.questionMore; delete f.openQuestion; for (const o of f.options) { delete o.more; delete o.afterWhy; } }
// a stop beat names every call of its step that stops (fewer-better-stops step 1): `- autonomy: a3, a4, a5`.
// It pauses once, lists each call with its own Accept and Flag, and goes on once each has a verdict. One id
// is a call's own beat, as before (a deviation's, or a video built before this).
for (const f of frames) { const ids = String(f.autonomy || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean); if (ids.length > 1) { f.autonomyStop = ids; f.autonomy = null; } }
// grouped calls (step 8): the calls `reel stops` lets through share one beat at the end of their part
// (`- autonomy_group: a5, a7`), one sheet listing each. What each chose and replaced is its row in
// walkthrough.md, beside the plan; `- chose_a5:` / `- instead_of_a5:` on the beat say it instead.
const fm = (sb.match(/^---\n([\s\S]*?)\n---/) || ["", ""])[1];
const wtRows = (() => { const pdir = (fm.match(/^plan_dir:\s*"?(.+?)"?\s*$/m) || [])[1]; const pm = planMdFor(dir, pdir); const w = pm && join(pm, "..", "walkthrough.md");
  return w && existsSync(w) ? Object.fromEntries(parseCalls(readFileSync(w, "utf8")).map((r) => [r.key, r])) : {}; })();
// autonomy beats (walkthrough videos): pause at the end, Accept or Flag. What the beat does not say
// (`- chose:`, `- instead_of:`, `- why:`, `- check:`) is its row in walkthrough.md.
const autonomy = frames.filter((f) => f.autonomy).map((f) => { const r = wtRows[String(f.autonomy).toLowerCase()] || {};
  return { id: f.autonomy, frameIndex: f.index, planStep: f.planStep, chose: f.chose || r.chose || null, insteadOf: f.insteadOf || r.insteadOf || null, why: f.why || r.why || null, check: f.check || r.check || null, at: +(f.start + f.durationSeconds - 0.05).toFixed(3) }; });
// A stop beat is carried the same way, with `stop: true`: its calls stop, so it has no Accept all.
// The list (walkthroughs-that-help step 2): the calls that do not pause share one beat at the end of the
// video (`- autonomy_list: a1, a4`), carried with `list: true`: each call a line with its own Flag, and
// going on takes the rest as listed, not judged (D-221).
const autonomyGroups = frames.filter((f) => f.autonomyGroup || f.autonomyStop || f.autonomyList).map((f) => {
  const b = blocks.find((x) => Number((x.match(/^## Frame (\d+)/m) || [])[1]) === f.index) || "";
  const own = (k, id) => (b.match(new RegExp(`^- ${k}_${id}:\\s*(.*)$`, "mi")) || [])[1]?.trim();
  const stop = !!f.autonomyStop, list = !stop && !!f.autonomyList, ids = f.autonomyStop || f.autonomyList || f.autonomyGroup;
  const calls = ids.map((id) => { const r = wtRows[id] || {}; return { id, planStep: r.step ?? f.planStep, chose: splitTags(own("chose", id) || r.chose || id).chose, insteadOf: own("instead_of", id) || r.insteadOf || null, why: own("why", id) || r.why || null, check: own("check", id) || r.check || null }; });
  if (stop) for (const c of calls) if (!wtRows[c.id] && !own("chose", c.id)) console.warn(`frame ${f.index}: stop beat names ${c.id}, which is neither a row in walkthrough.md nor a \`- chose_${c.id}:\` on the beat`);
  return { id: `${stop ? "stop" : list ? "list" : "group"}-${f.index}`, ...(stop ? { stop: true } : {}), ...(list ? { list: true } : {}), frameIndex: f.index, planStep: f.planStep, ids, calls, at: +(f.start + f.durationSeconds - 0.05).toFixed(3) };
});
for (const f of frames) { if (!f.autonomyGroup) delete f.autonomyGroup; if (!f.autonomyStop) delete f.autonomyStop; if (!f.autonomyList) delete f.autonomyList; }
// knowledge levels: watched seconds per level (frames outside a level are skipped by the player)
const LEVELS = ["new", "familiar", "owner"];
const levels = Object.fromEntries(LEVELS.map((l) => [l, +frames.filter((f) => !f.knowledge || f.knowledge.includes(l)).reduce((a, f) => a + (f.durationSeconds || 0), 0).toFixed(3)]));
const hasLevels = frames.some((f) => f.knowledge);
const title = (fm.match(/^title:\s*"?(.+?)"?\s*$/m) || [])[1] || (existsSync(resolve(dir, "BRIEF.md")) ? (readFileSync(resolve(dir, "BRIEF.md"), "utf8").match(/^#\s+(.+)$/m) || [])[1] : null) || basename(dir);
// Where this video's plan directory lives, relative to the repo root. The player needs it to tell
// a reviewer exactly where their exported annotations.json goes and what to run on it — without it
// the handoff back into the repo is guesswork the reviewer has to do by hand.
const planDir = (fm.match(/^plan_dir:\s*"?(.+?)"?\s*$/m) || [])[1] || null;
// A system video (`kind: system`) has no plan: its review is filed in its own folder. `reviewDir` is
// that folder, relative to the repo root, and it is what the player sends as the review's target.
const kind = (fm.match(/^kind:\s*"?(.+?)"?\s*$/m) || [])[1] || null;
// Quick checks off by default for this video (`checks: off` in its BRIEF.md front matter, or its storyboard's): the player
// starts with them off, as for a video watched to learn rather than to review; the viewer's own choice still wins.
const briefFm = existsSync(resolve(dir, "BRIEF.md")) ? (readFileSync(resolve(dir, "BRIEF.md"), "utf8").match(/^---\n([\s\S]*?)\n---/) || ["", ""])[1] : "";
const checksDefault = ((briefFm.match(/^checks:\s*"?(on|off)"?\s*$/m) || fm.match(/^checks:\s*"?(on|off)"?\s*$/m) || [])[1]) || null;
const reviewDir = kind === "system" ? (relative(repoRoot(resolve(dir)), resolve(dir)).split(sep).join("/") || null) : null;
// the pages scenes open: one entry per scene that opens one (the check is check-details.mjs; the player reads this)
const details = frames.filter((f) => f.detail).map((f) => ({ name: f.detail, src: `details/${f.detail}.html`, title: f.detailTitle || f.title, kind: f.detailKind || null, why: f.detailWhy || null,
  frameIndex: f.index, compositionId: f.compositionId, planStep: f.planStep, start: f.start, end: +(f.start + (f.durationSeconds || 0)).toFixed(3), autonomy: f.autonomy || null }));
// the guide's parts (the plan guide, step 3): a scene's `- guide: <part>[#<place>]` opens that part of the video's guide
// over the frame, as a detail opens (the frame marks its thing data-detail="<part>"); the page is built by `reelplanner
// guide` into guide/<part>.html, after this map. Every part is listed too, for the plan text's "Open:" under its step.
const parts = guideParts(dir), partNamed = (n) => parts.find((p) => p.name === n);
for (const f of frames.filter((x) => x.guide && !x.detail)) {
  const [name, at] = String(f.guide).split("#"), p = partNamed(name);
  if (!p) console.warn(`frame ${f.index}: - guide: ${f.guide} names no part of this video's guide (${parts.map((x) => x.name).join(", ") || "it has none"})`);
  const why = f.guideWhy || { step: "Open it for every case, the whole interface, the example and the decisions of this step, and what landed for it.", category: "Open it for every line of this kind of change, whole, and the runs that show it.",
    overview: "Open it for every kind of change with its counts, each a click from its full diff.", decisions: "Open it for every decision in force, each with its ledger entry.", choices: "Open it for every choice the agent made, by step.", source: "Open it for the source itself, whole, organized by its shape." }[p?.kind] || null;
  details.push({ name, src: `guide/${name}.html${at ? `#${name}-${at}` : ""}`, title: f.guideTitle || p?.title || name, kind: "guide", guide: true, why,
    frameIndex: f.index, compositionId: f.compositionId, planStep: f.planStep ?? p?.planStep ?? null, start: f.start, end: +(f.start + (f.durationSeconds || 0)).toFixed(3), autonomy: f.autonomy || null });
  f.detail = name;
}
for (const f of frames) { const d = f.detail; delete f.detailTitle; delete f.detailKind; delete f.detailWhy; delete f.guideTitle; delete f.guideWhy; delete f.detail; if (!f.guide) delete f.guide; if (d) f.detail = d; }
// the plan's own text (deep-dives step 5): the player shows it beside the video, one section per step
const planMd = planMdFor(dir, planDir), plan = planMd ? readPlanMd(planMd) : null;
// an explainer (explain-first): what was asked and its pinned sources, which Ask about this answers from (step 3)
// and what Finish offers under Explain more and Plan this for this video, made here so a hosted page has them with no
// server (lib/explainer.mjs, nextSuggestions): from its scenes, its long sources and explain.md's open threads
const explainerOf = () => { try { const s = JSON.parse(readFileSync(resolve(dir, "..", "sources.json"), "utf8")); const md = existsSync(resolve(dir, "..", "explain.md")) ? readFileSync(resolve(dir, "..", "explain.md"), "utf8") : "";
  return { question: s.question, commit: s.commit, created: s.created, sources: (s.sources || []).map((x) => ({ id: x.id, form: x.form, shape: x.shape, lines: x.size?.lines ?? null, guide: !!x.guide })), next: nextSuggestions({ frames, sources: s.sources || [], explainMd: md }) }; } catch { return null; } };
const explainer = kind === "explainer" ? explainerOf() : null;
for (const f of frames) { delete f.nextMore; delete f.nextPlan; }
if (explainer?.next) console.log(`Finish's suggestions: ${explainer.next.more.length} for Explain more, ${explainer.next.plan.length} for Plan this`);
const out = { project: basename(resolve(dir)), title, planDir, ...(kind ? { kind } : {}), ...(checksDefault === "off" ? { checks: "off" } : {}), ...(explainer ? { explainer } : {}), ...(reviewDir ? { reviewDir } : {}), totalSeconds: +t.toFixed(3), chapters, levels: hasLevels ? levels : null, quizzes, autonomy, ...(autonomyGroups.length ? { autonomyGroups } : {}), ...(openQuestion ? { openQuestion } : {}), watchedSeconds: +(t - decisions.reduce((a, d) => a + d.options.filter((o) => o.branch && !o.recommended).reduce((b, o) => b + (o.branch.end - o.branch.start), 0), 0)).toFixed(3), frames, decisions, details, ...(parts.length ? { guide: { parts: parts.map(({ name, title, planStep, kind: k }) => ({ name, title, planStep, kind: k, src: `guide/${name}.html` })) } } : {}), ...(plan ? { plan } : {}) };
if (details.length) console.log(`${details.length} detail(s): ${details.map((d) => `${d.name} (${d.kind || "?"}, frame ${d.frameIndex})`).join(", ")}`);
if (parts.length) console.log(`guide: ${parts.length} part(s), built by reelplanner guide: ${parts.map((p) => p.name).join(", ")}`);
if (plan) console.log(`plan text: ${plan.steps.length} step(s) from plan.md`);
if (chapters.length) console.log("chapters: " + chapters.map((c) => `${c.id} frames ${c.fromFrame}–${c.toFrame} ${c.linearSeconds}s/${c.watchedSeconds}s watched`).join(" · "));
// what the viewer needs to follow it (lib/terms.mjs): the videos to watch first, the words it defines, the glossary, every id it says glossed
{ const { missing } = addAccess(out, { dir, sb });
  for (const v of missing) console.warn(`before: "${v}" names no video in this project record (system, a plan's folder, <plan>--walkthrough, or <explainer>--explainer)`);
  if (out.prerequisites.length) console.log(`before you watch: ${out.prerequisites.map((p) => `${p.video}${p.part ? `#part ${p.part}` : ""}`).join(", ")} · ${out.terms.length} term(s) of its own · ${Object.keys(out.ids).length} id(s) glossed`); }
// what fresh eyes left as it is after three rounds (videos-that-make-sense step 2): the page's "Before you watch"
// and the notification say it, each with the author's reason; only the new ones, a finding kept again for the
// reason an earlier round of the build gave is in `again`, one line with its count (D-245)
{ const fe = leftAfter(dir); if (fe?.left.length || fe?.again?.length) { out.freshEyes = fe; console.log(`fresh eyes: ${fe.left.length} finding(s) left as they are after ${fe.rounds} rounds${fe.again.length ? `, ${fe.again.length} more kept again for the reason an earlier round gave` : ""}`); } }
writeFileSync(join(dir, "plan-map.json"), JSON.stringify(out, null, 2) + "\n");
if (hasLevels) console.log("knowledge levels (seconds): " + JSON.stringify(levels));
if (quizzes.length || autonomy.length || autonomyGroups.length) console.log(`${quizzes.length} quiz beat(s), ${autonomy.length} autonomy beat(s)${[[autonomyGroups.filter((g) => g.stop), "stop"], [autonomyGroups.filter((g) => g.list), "list"], [autonomyGroups.filter((g) => !g.stop && !g.list), "grouped"]].filter(([gs]) => gs.length).map(([gs, k]) => `, ${gs.length} ${k} beat(s) of ${gs.reduce((a, g) => a + g.ids.length, 0)} call(s)`).join("")}`);
console.log(`plan-map.json: ${frames.length} frames, ${out.totalSeconds}s linear / ${out.watchedSeconds}s watched (recommended path), ${decisions.length} decisions, steps ${frames.filter((f) => f.planStep).map((f) => f.planStep).join(",") || "none tagged"}`);
