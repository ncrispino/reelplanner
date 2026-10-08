// The guide's data (the plan guide, steps 1, 2 and 5): everything the page shows, read from the repo and never typed in.
//
//   a plan video        plan.md (each step's prose and its four blocks), the ledger, the plan map (each scene's time and
//                       picture), and after the build walkthrough.md, git and runs/ (lib/guide/built.mjs)
//   a walkthrough video the same guide, opening on its Built side
//   an explainer        sources.json: a part for each source that needs one (`needsPart`, or `guide`, true), the source
//                       itself organized by its shape (explain-first step 1): never retyped (D-244)
//
// A video's guide is written to <video-dir>/guide/: index.html (the full page), <part>.html (each part the player opens
// over the frame) and parts.json. None of it is committed (D-213): it is built again from its sources.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, relative, resolve } from "node:path";
import { readPlanBlocks, blockFindings, answeredIn } from "../plan-md.mjs";
import { repoRoot } from "../env.mjs";
import { approvedAt } from "../reviews.mjs";
import { readSources, sourceText, privateIn, maskOf } from "../explainer.mjs";
import { storyboardFrames, glossaryFor, splitMeaning } from "../terms.mjs";
import { builtSide, readWalkthrough, slugify, runsAdded, commitsSince, commitInfo, runsOf } from "./built.mjs";
import { namePromise, askedOf, firstSentence, latestReview, tryItOf, choicesOf, choiceCounts, thinOf, oneSentence, changesOf, canOf, canLine, whereRan, WRITES_RECORD, pathsIn } from "./reader.mjs";
import { drawDiagram, stepsDiagram, filesDiagram, changeMap } from "./diagram.mjs";
import { forGuideOf, stepDepth, inScratch } from "./depth.mjs";
import { revisedOf } from "./revised.mjs";
import { pictureOf, prunePictures, stepPictures, themedPicture } from "./pictures.mjs";

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const has = (p) => existsSync(p);

/** What a folder is to the guide: { kind, videoDir, planDir, explainerDir, outDir, slug, own } — or { kind: "none", why }. */
export function guideTarget(dir) {
  const d = resolve(dir), name = basename(d), up = dirname(d);
  const planVideo = (p) => has(join(p, "plan.md"));
  if (has(join(d, "plan.md"))) {   // a plan folder: its videos, or the folder itself when it has none
    const vids = ["video", "walkthrough-video"].map((v) => join(d, v)).filter((v) => has(join(v, "STORYBOARD.md")) || has(join(v, "plan-map.json")));
    return vids.length ? { kind: "plan", many: vids.map((v) => guideTarget(v)) } : { kind: "plan-only", planDir: d, outDir: join(d, "guide"), slug: basename(d), own: "plan" };
  }
  if (has(join(d, "explain.md")) || has(join(d, "sources.json"))) return has(join(d, "video")) ? guideTarget(join(d, "video")) : { kind: "none", why: `${dir}: an explainer with no video/ yet, so no guide to build (\`reelplanning explain\` starts its video/)` };
  const sb = has(join(d, "STORYBOARD.md")) ? readFileSync(join(d, "STORYBOARD.md"), "utf8") : "";
  if (/^kind:\s*system\b/m.test(sb) || name === "system-video") return { kind: "none", why: `${dir}: the system video has no guide` };
  if (has(join(up, "sources.json")) || /^kind:\s*explainer\b/m.test(sb)) return { kind: "explainer", videoDir: d, explainerDir: up, outDir: join(d, "guide"), slug: `${basename(up)}--explainer`, own: "explainer" };
  if (planVideo(up) && name === "walkthrough-video") return { kind: "walkthrough", videoDir: d, planDir: up, outDir: join(d, "guide"), slug: `${basename(up)}--walkthrough`, own: "built" };
  if (planVideo(up)) return { kind: "plan-video", videoDir: d, planDir: up, outDir: join(d, "guide"), slug: basename(up), own: "plan" };
  return { kind: "none", why: `${dir}: not a plan folder, a plan's video/ or walkthrough-video/, or an explainer's video/ (no plan.md or sources.json here or beside it): give one of those` };
}

/** Each part a video's guide has, cheaply (no git): [{ name, title, kind, planStep }]. plan-map reads it for `- guide:` tags. */
export function guideParts(dir) {
  const t = guideTarget(dir);
  if (t.kind === "explainer") {
    const s = readSources(t.explainerDir) || {};
    return [{ name: "sources", title: "The sources", kind: "overview", planStep: null },
      ...(s.sources || []).filter(needsPart).map((x) => ({ name: sourcePart(x), title: x.id, kind: "source", planStep: null }))];
  }
  if (!["plan-video", "walkthrough", "plan-only"].includes(t.kind)) return [];
  const plan = readPlanBlocks(join(t.planDir, "plan.md"));
  const out = plan.steps.map((s) => ({ name: `step-${s.n}`, title: `Step ${s.n} · ${s.title}`, kind: "step", planStep: s.n }));
  out.push({ name: "decisions", title: "Decisions in force", kind: "decisions", planStep: null });
  const wt = has(join(t.planDir, "walkthrough.md")) ? readWalkthrough(join(t.planDir, "walkthrough.md")) : null;
  if (wt) {
    out.push({ name: "what-changed", title: "What changed, in full", kind: "overview", planStep: null });
    for (const c of wt.categories) out.push({ name: c.id, title: c.name, kind: "category", planStep: c.steps?.length === 1 ? c.steps[0] : null });
    if (wt.calls.length) out.push({ name: "choices", title: "Every choice the agent made", kind: "choices", planStep: null });
  }
  return out;
}
export const needsPart = (s) => !!(s.needsPart ?? s.guide) || !!s.parts?.length;
export const sourcePart = (s) => `source-${slugify(s.id)}`;

// ── the video's scenes: time, picture, step, what they open ──
function scenesOf(videoDir, { thumbs = true } = {}) {
  const map = readJson(join(videoDir, "plan-map.json")); if (!map) return null;
  const sb = has(join(videoDir, "STORYBOARD.md")) ? storyboardFrames(readFileSync(join(videoDir, "STORYBOARD.md"), "utf8")) : [];
  const gaps = [];
  const frames = (map.frames || []).map((f) => {
    const tag = sb.find((x) => x.index === f.index)?.meta || {};
    let thumb = null;
    if (thumbs && f.thumb) { thumb = has(join(videoDir, f.thumb)) || null; if (!thumb) gaps.push({ where: `scene ${f.index}`, what: `no picture (${f.thumb} is not there)` }); }
    else if (thumbs) gaps.push({ where: `scene ${f.index}`, what: "no picture in the plan map" });
    return { file: f.thumb ? join(videoDir, f.thumb) : null, n: f.index, title: f.title, start: +(+f.start || 0).toFixed(2), end: +((+f.start || 0) + (+f.durationSeconds || 0)).toFixed(2), step: f.planStep ?? null, thumb,
      guide: f.guide || tag.guide || null, detail: f.detail || null, narration: f.narration || "", branch: !!f.branch };
  });
  // where the video stops for you: a pause on choices, the list, a quick check, a plan question, the open question.
  // The choices, as the player plays them (plan-map): `autonomy`, a pause on one choice (a deviation's, or one alone on
  // its step); a group with `stop`, a pause on each of its choices; with `list`, the list at the end; a group with
  // neither, an older walkthrough's grouped beat: its choices shown on one sheet that Accept all takes, not a pause on each
  const at = (n) => frames.find((f) => f.n === n)?.start ?? null;
  const idOf = (x) => String(x).toUpperCase().replace(/^M/, "m");
  // `t` is the scene's start (where "Watch it" goes), `at` the moment the player stops (the plan map's own `at`)
  const when = (x) => (x.at != null && Number.isFinite(+x.at) ? +(+x.at).toFixed(2) : null);
  const stops = [
    ...(map.autonomy || []).map((a) => ({ kind: "choices", n: a.frameIndex, ids: [idOf(a.id)], at: when(a) })),
    ...(map.autonomyGroups || []).map((g) => ({ kind: g.list ? "list" : g.stop ? "choices" : "shown", n: g.frameIndex, ids: (g.ids || []).map(idOf), at: when(g) })),
    ...(map.quizzes || []).map((q) => ({ kind: "check", n: q.frameIndex, text: q.question, at: when(q) })),
    ...(map.decisions || []).map((d) => ({ kind: "question", n: d.frameIndex, text: d.question, id: d.id, at: when(d) })),
    ...(map.openQuestion ? [{ kind: "open", n: map.openQuestion.frameIndex, text: map.openQuestion.question, at: when(map.openQuestion) }] : []),
  ].filter((x) => x.n != null).map((x) => ({ ...x, t: at(x.n) })).sort((a, b) => (a.at ?? a.t ?? 0) - (b.at ?? b.t ?? 0));
  return { title: map.title, total: map.totalSeconds, frames, map, gaps, stops };
}
// a scene's picture is its snapshot (`thumb` above only says it is there: nothing on the page draws a scene small); the
// picture a step shows is made by lib/guide/pictures.mjs, as files beside the page at the sizes it is drawn at
const slim = (d) => d && ({ id: d.id, date: d.date, plan: d.plan, step: d.step, question: d.question, chosen: d.chosen, chosenId: d.chosenId, why: d.why, note: d.note || null, status: d.status, kind: d.kind || null,
  options: (d.options || []).map((o) => ({ id: o.id, label: o.label, why: o.why, recommended: !!o.recommended })), supersedes: d.supersedes || [], supersededBy: d.supersededBy || null, supersededByPlan: d.supersededByPlan || null, foldedInto: d.foldedInto || null, verdict: d.verdict || null });
const firstToken = (line) => { const w = String(line).trim().split(/\s+/); return /^(reelplanning|reel|npm|npx|node|git|gh)$/.test(w[0]) && w[1] && !/^[-<[]/.test(w[1]) ? `${w[0]} ${w[1]}` : w[0]; };
const sentences = (md) => String(md).replace(/```[\s\S]*?```/g, "").replace(/\n(?!\n)/g, " ").split(/(?<=[.!?])\s+(?=[A-Z*`(])|\n\n+/).map((s) => s.trim()).filter((s) => s.length > 12);

/** The whole of one video's guide: { data, parts: { name: data }, gaps, counts }. */
export async function buildModel(t, { thumbs = true, whole = true, outside = false, pageDir = t.outDir } = {}) {
  const repo = repoRoot(t.videoDir || t.planDir || t.explainerDir);
  const cacheDir = join(t.outDir, ".cache");
  const scenes = t.videoDir ? scenesOf(t.videoDir, { thumbs }) : null;
  const gaps = [...(scenes?.gaps || [])];
  const made = [];
  if (t.kind === "explainer") return explainerModel(t, { repo, scenes, gaps, made, outside });

  // ── a plan ──
  const planName = basename(t.planDir), plan = readPlanBlocks(join(t.planDir, "plan.md"));
  const rp = join(repo, ".reelplanning"), ledgerAll = readJson(join(rp, "decisions.json"))?.decisions || [];
  const sys = readJson(join(rp, "system.json"));
  const { gaps: blockGaps } = blockFindings(plan, { ledger: ledgerAll, planName });
  // the other video of the plan: a plan video's guide knows the walkthrough's scenes too, and the other way round
  const other = t.kind === "plan-video" ? join(t.planDir, "walkthrough-video") : t.kind === "walkthrough" ? join(t.planDir, "video") : null;
  const otherScenes = other && has(join(other, "plan-map.json")) ? scenesOf(other, { thumbs }) : null;
  const vid = (s, slug, dir) => s && ({ slug, title: s.title, dir: relative(repo, dir), total: s.total, scenes: s.frames.map(({ narration, file, ...f }) => f), stops: s.stops });
  const videos = {
    plan: t.kind === "plan-video" ? vid(scenes, t.slug, t.videoDir) : t.kind === "walkthrough" ? vid(otherScenes, planName, other) : null,
    built: t.kind === "walkthrough" ? vid(scenes, t.slug, t.videoDir) : t.kind === "plan-video" ? vid(otherScenes, `${planName}--walkthrough`, other) : null,
  };
  const built = await builtSide(t.planDir, { repo, planTitle: plan.title, cacheDir, whole });
  if (built) { gaps.push(...built.gaps); made.push(built.from === "listed" ? `Diffs: \`git show -U10\` of the ${built.commits.length} commits walkthrough.md names, grouped by its categories of change; each file whole at the plan's last commit that touched it, the lines \`git blame\` gives to the plan's commits marked.` : built.commits.length ? `Diffs: the ${built.commits.length} commits after ${built.started} whose message names the plan (walkthrough.md names none).` : "No diff: walkthrough.md names no commits."); if (Object.keys(built.runs).length) made.push(`Runs: the ${Object.keys(built.runs).length} saved in \`runs/\`, whole, as they ran.`); }
  const ledgerIds = new Set();
  const steps = plan.steps.map((s) => {
    const own = ledgerAll.filter((d) => d.plan === planName && d.step === s.n && d.kind !== "autonomy");
    own.forEach((d) => ledgerIds.add(d.id));
    const inForce = plan.inForce.filter((x) => Array.isArray(x.steps) && x.steps.includes(s.n));
    inForce.forEach((x) => x.ids.forEach((id) => ledgerIds.add(id)));
    const qs = plan.questions.filter((q) => (q.steps || []).includes(s.n)).map((q) => {
      const a = answeredIn(q, ledgerAll, planName), d = a?.ids?.map((id) => ledgerAll.find((x) => x.id === id)).find(Boolean);
      if (d) ledgerIds.add(d.id);
      const letter = d ? (q.options.find((o) => o.label.toLowerCase().replace(/[^a-z0-9]/g, "") === String(d.chosen).toLowerCase().replace(/[^a-z0-9]/g, "")) || q.options.find((o) => o.letter.toLowerCase() === String(d.chosenId).toLowerCase()))?.letter || null : null;
      const mapQ = (videos.plan ? scenes?.map?.decisions || otherScenes?.map?.decisions : null)?.find((x) => x.id === `q${q.n}` || x.question === q.title);
      return { n: q.n, title: q.title, text: q.text, steps: q.steps, setup: q.setup, recommend: q.recommend, options: q.options.map((o) => ({ ...o })), answered: a ? { text: a.text, ids: a.ids || [], letter, own: d?.chosenId === "own" } : null, mapId: mapQ?.id || null };
    });
    const parts = (s.interface?.parts || []).map((p, i) => {
      const tok = firstToken(p.line), mentions = tok.length > 2 ? sentences(s.prose).filter((x) => x.includes(tok)).slice(0, 4) : [];
      return { i: i + 1, ...p, token: tok, mentions };
    });
    const touched = plan.touched.filter((c) => (c.steps || []).includes(s.n)).map((c) => c.name);
    const bs = built?.steps.find((x) => x.n === s.n) || null;
    const cats = built ? built.cats.filter((c) => c.steps?.includes(s.n)).map((c) => c.id) : [];
    return { n: s.n, id: `step-${s.n}`, title: s.title, deps: s.deps, prose: s.prose, text: s.text,
      cases: s.cases && s.cases.rows.length ? { head: s.cases.head, hasTrace: s.cases.hasTrace, intro: s.cases.intro, rows: s.cases.rows.map(({ cells, ...r }) => r) } : null,
      iface: s.interface ? { none: s.interface.none, parts, after: s.interface.after } : null, example: s.example, other: s.other,
      decisions: own.map((d) => d.id), inForce: inForce.map((x) => ({ text: x.text, ids: x.ids })), questions: qs, touched,
      built: bs ? { status: bs.status, title: bs.title, md: bs.text, ifaceBuilt: bs.ifaceBuilt, commits: bs.commits } : built ? { status: null, title: null, md: null } : null,
      choices: built ? built.calls.filter((c) => c.step === s.n).map((c) => c.id) : [], cats,
      gaps: blockGaps.filter((g) => g.where === `step ${s.n}` || g.where.startsWith(`step ${s.n} ·`)) };
  });
  for (const x of plan.inForce) x.ids.forEach((id) => ledgerIds.add(id));
  // ── what a reader asks, in order (guide-clarity.md): each answer from the plan's files ──
  const ownKey = t.kind === "walkthrough" ? "built" : "plan", ownVid = videos[ownKey];
  const picsDir = join(t.outDir, "pics"), pics = new Set();
  if (ownVid && scenes && thumbs) {   // the scene that shows each step, as a picture big enough to read (lib/guide/pictures.mjs)
    const shows = steps.map((s) => [s, ownVid.scenes.find((x) => x.step === s.n && !x.branch && !/^quick check/i.test(x.title))]).filter(([, f]) => f);
    const taken = await stepPictures(t.videoDir, shows.map(([, f]) => f), { cacheDir: join(cacheDir, "pics") });
    for (const [s, f] of shows) {
      const own = taken?.get(f.n), file = scenes.frames.find((x) => x.n === f.n)?.file;
      const pic = own ? themedPicture(own, { picsDir, pageDir, made: pics }) : file ? pictureOf(file, { picsDir, pageDir, made: pics }) : null;
      if (pic) { f.pic = pic; s.shown = { video: ownKey, n: f.n }; }
    }
  }
  if (resolve(pageDir) === resolve(t.outDir)) prunePictures(picsDir, pics);
  const gitTime = (...a) => { try { return execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").find(Boolean) || null; } catch { return null; } };
  const writtenAt = built?.commits.at(-1)?.full ? gitTime("show", "-s", "--format=%aI", built.commits.at(-1).full) : approvedAt(t.planDir);
  const laterThanPlan = (id) => { const at = gitTime("log", "--format=%aI", "--reverse", `-S"id": "${id}"`, "--", relative(repo, join(rp, "decisions.json")));
    return !!(writtenAt && at && Date.parse(at) > Date.parse(writtenAt)); };
  for (const s of steps) { const ps = plan.steps.find((x) => x.n === s.n); s.lead = firstSentence(ps?.prose); if (s.built?.md) s.built.lead = firstSentence(s.built.md);
    // what it lets you do, a short phrase: the walkthrough's line once it is built, the plan's before; a step still
    // waiting has none yet (the page says it is waiting)
    s.can = ["waiting", "not done"].includes(s.built?.status) ? null : canOf({ built: s.built?.md, prose: ps?.prose, lead: s.lead });
    // since the plan was written: an answer of this step's replaced by a later one (the ledger's supersededBy)
    const mine = [...new Set([...(s.decisions || []), ...s.questions.flatMap((q) => q.answered?.ids || [])])];
    s.since = mine.map((id) => ledgerAll.find((d) => d.id === id)).filter((d) => d?.supersededBy || d?.supersededByPlan).map((d) => {
      // replaced by a later plan as a whole (no one decision of it): that plan's own Supersedes line says how
      if (!d.supersededBy) { const p = d.supersededByPlan; if (!(p > planName)) return null;
        const via = supersedesLine(join(dirname(t.planDir), p), d.id);
        return { question: d.question, was: d.chosen, now: null, date: d.supersededOn, ids: [d.id], same: false, nowQuestion: null, nowPlan: p.replace(/^\d{4}-\d{2}-\d{2}-/, ""), wholePlan: true,
          via: { words: via?.words || null, step: via?.step ?? null, today: via?.step != null ? todayOf(join(dirname(t.planDir), p), via.step) : null } }; }
      const nd = ledgerAll.find((x) => x.id === d.supersededBy);
      // since: a later plan's decision, or this plan's own made after the step was written (built: after its last
      // commit; else after its plan review approved it), each time from git, when the log took the entry in
      if (!nd || !(nd.plan !== planName ? nd.plan > planName : laterThanPlan(nd.id))) return null;
      const y = { question: d.question, was: d.chosen, now: nd.chosen, date: nd.date, ids: [d.id, nd.id], same: nd.question === d.question, nowQuestion: nd.question, nowPlan: nd.plan !== d.plan ? nd.plan.replace(/^\d{4}-\d{2}-\d{2}-/, "") : null };
      // the later plan's own words for what it did to this decision (its plan.md's "## Supersedes": "Narrowed for small
      // pull requests (step 4)") win over the ledger's link, which can name another step's answer of that plan: then
      // the step it names, that step's own decision, and what it says today (its walkthrough's), the ledger's link said too
      const via = nd.plan !== planName ? supersedesLine(join(dirname(t.planDir), nd.plan), d.id) : null;
      if (via) { const vd = via.step != null ? ledgerAll.filter((x) => x.plan === nd.plan && x.step === via.step && !["autonomy", "edit"].includes(x.kind)).at(-1) : null;
        Object.assign(y, { via: { words: via.words, step: via.step, today: via.step != null ? todayOf(join(dirname(t.planDir), nd.plan), via.step) : null },
          ...(vd ? { now: vd.chosen, nowQuestion: vd.question, date: vd.date, same: vd.question === d.question, ids: [d.id, vd.id] } : {}),
          ledgerSays: vd && vd.id !== nd.id ? { id: nd.id, step: nd.step, chosen: nd.chosen } : null }); }
      return y; }).filter(Boolean); }
  // what the video can't hold (D-265): each step's diagrams, worked examples and depth, from plan.md, walkthrough.md
  // and each one's "For the guide"; the diagrams drawn here, as SVG, never at run time
  const wtMd = has(join(t.planDir, "walkthrough.md")) ? readFileSync(join(t.planDir, "walkthrough.md"), "utf8") : "";
  const fgPlan = forGuideOf(plan.md), fgBuilt = forGuideOf(wtMd), exRuns = runsOf(t.planDir), runStep = {};
  const linkOf = (l) => (l && /^step-\d+$/.test(l) ? `#${l}` : l);
  const drawAll = (list, pre) => list.map((d, k) => { const g = drawDiagram(d.src, { id: `${pre}-${k + 1}`, anchor: `${pre.replace(/^dg-/, "").replace(/-/g, " ")} · diagram ${k + 1}` }); for (const n of g.nodes || []) n.link = linkOf(n.link); return { ...g, from: d.from }; });
  for (const s of steps) {
    const ps = plan.steps.find((x) => x.n === s.n);
    const d = stepDepth(s.n, { planText: ps?.text, builtText: s.built?.md, fgPlan, fgBuilt });
    s.depth = { diagrams: drawAll(d.diagrams, `dg-step-${s.n}`), examples: d.examples, depth: d.depth, intro: d.intro, after: d.after, lead: d.lead };
    for (const g of s.depth.diagrams) { if (g.errors.length) gaps.push({ where: `step ${s.n} · diagram "${g.title || "untitled"}"`, what: g.errors.join("; "), fail: !g.wide && !g.panels }); }
    for (const e of d.examples) for (const r of e.runs) { runStep[r.name] ??= s.n; if (!exRuns[r.name]) gaps.push({ where: `step ${s.n} · example "${e.name}"`, what: `names ${r.name}, which is not in runs/ (a real output comes from a saved run)`, fail: true }); }
    // plan.md's own findings say "no diagram" and "no Example" from plan.md alone: walkthrough.md's may answer them
    if (s.depth.diagrams.length) s.gaps = s.gaps.filter((g) => !/^no diagram/.test(g.what));
    else if (!s.gaps.some((g) => /^no diagram/.test(g.what))) s.gaps.push({ where: `step ${s.n}`, what: "no diagram (a ```diagram block: how it works, drawn in the guide)" });
    if (d.examples.length) s.gaps = s.gaps.filter((g) => !/^no Example/.test(g.what));
    else if (s.built?.md) s.gaps.push({ where: `step ${s.n}`, what: "no worked example (#### Worked examples: each case, its input, what happens, its saved run)" });
  }
  const overview = { diagrams: drawAll([...(fgPlan?.overview.diagrams || []).map((src) => ({ src, from: "plan.md" })), ...(fgBuilt?.overview.diagrams || []).map((src) => ({ src, from: "walkthrough.md" }))], "dg-overview"),
    depth: [...(fgPlan?.overview.depth || []), ...(fgBuilt?.overview.depth || [])], intro: [fgPlan?.overview.intro, fgBuilt?.overview.intro].filter(Boolean), after: [fgPlan?.overview.after, fgBuilt?.overview.after].filter(Boolean), note: fgBuilt?.note || fgPlan?.note || null };
  for (const g of overview.diagrams) if (g.errors.length) gaps.push({ where: `diagram "${g.title || "untitled"}"`, what: g.errors.join("; "), fail: !g.wide && !g.panels });
  // and those made from structure: the steps and what each needs; each part of the change's files, and the parts' use of each other
  const auto = { steps: stepsDiagram(plan.steps), change: null };
  if (built) {
    const textOf = (p) => { for (const c of built.cats) { const f = c.files.find((x) => x.path === p); if (f?.whole?.key && built.wholes[f.whole.key]) return built.wholes[f.whole.key].join("\n"); } return null; };
    auto.change = changeMap(built.cats, textOf);
    for (const c of built.cats) { const g = filesDiagram(c, textOf, { id: `dg-files-${c.id}` }); if (g) c.diagram = g; }
  }
  const review = built ? latestReview(t.planDir, "walkthrough") : null, planReview = latestReview(t.planDir, "plan");
  const tryIt = tryItOf({ plan, built, steps: plan.steps, runStep, exRuns });
  // where each saved run was made, and when it came into the repo (git): the page says "saved while it was built" only
  // of a run one of the plan's own commits added, and tags a run made in a scratch repo as one
  const hasPath = (p) => has(join(repo, p.replace(/\/$/, "")));
  const scratch = fgBuilt?.scratch || fgPlan?.scratch || null;
  const allRuns = { ...exRuns, ...(built?.runs || {}) };
  const added = runsAdded(repo, t.planDir, Object.keys(allRuns), (built?.commits || []).map((c) => c.full || c.sha));
  const runWhere = {};
  for (const [name, r] of Object.entries(allRuns)) {
    const w = whereRan(r, { scratch, inScratch, has: hasPath });
    runWhere[name] = { ...w, added: added[name] || null };
    for (const x of [built?.runs?.[name], exRuns[name]].filter(Boolean)) { x.scratch = w.scratch; x.setup = w.setup; x.missing = w.missing; x.added = added[name] || null; }
    if (w.scratch && !w.said) gaps.push({ where: name, what: `looks like a run made in a scratch repo (${w.why === "path" ? `it names ${w.missing.join(", ")}, which this repo does not have` : w.why === "note" ? "its own note says so" : "a made-up reviewer"}); walkthrough.md's For the guide does not say so (a **Ran in a scratch repo:** line)` });
  }
  for (const x of tryIt) {
    const w = x.run ? runWhere[x.run] : null;
    x.scratch = !!w?.scratch; x.setup = w?.setup || null; x.added = w?.added || null;
    x.missing = w ? w.missing : pathsIn(x.cmd).filter((p) => !hasPath(p));
    x.writes = WRITES_RECORD.test(x.cmd);
  }
  if (scratch?.setup) made.push(`Scratch repo: ${scratch.setup}`);
  const np = namePromise(plan.title), asked = askedOf(plan.problem);
  const sectionText = (re) => plan.sections.find((x) => re.test(x.title))?.text || null;
  const summary = (built && has(join(t.planDir, "walkthrough.md")) && t.kind === "walkthrough" ? oneSentence(readFileSync(join(t.planDir, "walkthrough.md"), "utf8")) : null) || oneSentence(plan.md);
  const reader = { ...np, summary, changes: changesOf(sectionText(/^what changes/i)), asked, review, planReview, tryIt, whatChanges: sectionText(/^what changes/i), notIn: sectionText(/^not in this plan/i),
    choices: built ? choicesOf(built.calls, review, videos.built ? videos.built.stops : null) : [], codeCheck: built?.texts?.codeCheck ? { summary: (/\*\*([^*]*[✓✗][^*]*)\*\*/.exec(built.texts.codeCheck) || [])[1] || null, misses: (built.texts.codeCheck.match(/^\s*[-*] \*\*✗/gm) || []).length } : null };
  reader.counts = choiceCounts(reader.choices);
  // the code check's own list of the decisions it checked (code-check/findings.md, "## Decisions"): each id with how it
  // was judged, so the page counts what the check listed, not the summary's number (they can differ)
  if (reader.codeCheck) { const f = join(t.planDir, "code-check", "findings.md"), fm = has(f) ? readFileSync(f, "utf8") : "";
    const sec = (/^## Decisions[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(fm) || [])[1] || "", by = {};
    for (const l of sec.split("\n").filter((l) => /^[-*] /.test(l))) { const [head, ...rest] = l.split(/\s+[—–-]\s+/), how = rest.join(" — "), st = /✗/.test(how) ? "no" : /✓/.test(how) ? "ok" : /\bn\/a\b/i.test(how) ? "na" : "ok";
      for (const id of head.match(/\bD-\d{3,4}\b/g) || []) by[id] ??= st; }
    if (Object.keys(by).length) reader.codeCheck.decisions = { file: relative(repo, f), ids: Object.keys(by), ok: Object.keys(by).filter((id) => by[id] === "ok"), no: Object.keys(by).filter((id) => by[id] === "no"), na: Object.keys(by).filter((id) => by[id] === "na") }; }
  reader.scratch = scratch;
  // walkthrough.md's Not done, a line each, and what each became since the build (settled: a later decision, a
  // commit, a plan built since, or the walkthrough's own "Since then" written for the guide)
  // a "Since then" item headed by a choice's number (`- **A3**: …`) is that choice's: shown on its card
  const sinceAll = [...(fgPlan?.since || []), ...(fgBuilt?.since || [])], isCall = (x) => /^[ADm]\d+$/.test(x.head), isStep = (x) => /^Step \d+$/i.test(x.head);
  // a "Since then" item headed by a step (`- **Step 3**: today, …`): what that step does today, under its own Since then
  for (const x of sinceAll.filter(isStep)) { const n = +/\d+/.exec(x.head)[0], st = steps.find((z) => z.n === n);
    const commits = [...new Set(x.md.match(/\b[0-9a-f]{7,40}\b/g) || [])].map((sha) => commitInfo(repo, sha) || { sha, missing: true });
    for (const c of commits.filter((c) => c.missing)) gaps.push({ where: `Since then: ${x.head}`, what: `names ${c.sha}, which is not in this clone` });
    if (!st) { gaps.push({ where: `Since then: ${x.head}`, what: "names no step of the plan" }); continue; }
    (st.today ||= []).push({ md: x.md, commits: commits.filter((c) => !c.missing) }); }
  // the record's words said plainly (walkthrough.md's "In plain words"): a choice's lead; a step the code check found
  // short, with the Not done lines it names; a Not done line's short line
  const plainAll = [...(fgPlan?.plain || []), ...(fgBuilt?.plain || [])];
  reader.callPlain = {}; reader.shortPlain = {};
  for (const x of plainAll) {
    if (/^[ADm]\d+$/.test(x.head)) { if (!built?.calls.some((c) => c.id === x.head)) gaps.push({ where: `In plain words: ${x.head}`, what: "names no choice of the walkthrough" }); else reader.callPlain[x.head] = x.md; }
    else if (/^(?:✗\s*)?Step \d+$/i.test(x.head)) { const n = +/\d+/.exec(x.head)[0]; if (!codeShort(built?.texts?.codeCheck).some((c) => c.step === n)) gaps.push({ where: `In plain words: ${x.head}`, what: "names no step the code check found short" }); else reader.shortPlain[n] = { md: x.md, also: x.also }; }
  }
  const plainNd = plainAll.filter((x) => !/^[ADm]\d+$/.test(x.head) && !/^(?:✗\s*)?Step \d+$/i.test(x.head));
  const withStep = plainAll.filter((x) => /^(?:✗\s*)?Step \d+$/i.test(x.head)).flatMap((x) => x.also.map((h) => ({ head: h, step: +/\d+/.exec(x.head)[0] })));
  if (built) reader.notDone = notDoneOf(built.texts.notDone, { ledger: ledgerAll, repo, planDir: t.planDir, planName, since: sinceAll.filter((x) => !isCall(x) && !isStep(x)), plain: plainNd, withStep, last: built.commits.at(-1), gaps, approved: /approved/.test(review?.verdict || "") });
  if (built) { reader.callSince = {};
    for (const x of sinceAll.filter(isCall)) { const id = x.head, commits = [...new Set(x.md.match(/\b[0-9a-f]{7,40}\b/g) || [])].map((sha) => commitInfo(repo, sha) || { sha, missing: true });
      for (const c of commits.filter((c) => c.missing)) gaps.push({ where: `Since then: ${id}`, what: `names ${c.sha}, which is not in this clone` });
      if (!built.calls.some((c) => c.id === id)) gaps.push({ where: `Since then: ${id}`, what: "names no choice of the walkthrough" });
      (reader.callSince[id] ||= []).push({ md: x.md, commits: commits.filter((c) => !c.missing) }); } }
  // the number of files the walkthrough video says, beside this page's (they can count different things)
  if (built) reader.videoFiles = videoFilesOf(t.kind === "walkthrough" ? t.videoDir : other, built.texts.codeCheck);
  // the rest of plan.md: every section, so every paragraph lands in the page (the steps and questions are above)
  //    the open questions section by its own words before its first question (the questions themselves are drawn
  //    under What needs you), and any words between the title and the first section
  const opening = (() => { const m = /^# .+$/m.exec(plan.md); if (!m) return ""; const after = plan.md.slice(m.index + m[0].length), n = after.search(/^## /m); return (n < 0 ? after : after.slice(0, n)).trim(); })();
  const qLead = (text) => [String(text).split(/^(?=\d+\.\s+\*\*)/m)[0].trim(), "Its questions are under What needs you, above, each with the step it names."].filter(Boolean).join("\n\n");
  const rest = [...(opening ? [{ id: "plan-opening", title: "Before its first section", md: opening }] : []),
    ...plan.sections.filter((x) => !/^steps$/i.test(x.title) && !/^decisions in force/i.test(x.title) && !/^for the guide/i.test(x.title))
      .map((x) => ({ id: `plan-${slugify(x.title)}`, title: x.title, md: /^open questions/i.test(x.title) ? qLead(x.text) : x.text }))];
  const ledger = Object.fromEntries([...ledgerIds].map((id) => [id, slim(ledgerAll.find((d) => d.id === id))]).filter(([, d]) => d));
  for (const g of blockGaps.filter((g) => !/^step \d+/.test(g.where))) gaps.push(g);
  for (const s of steps) for (const g of s.gaps) gaps.push(g);
  // the plan video's scenes: each step's, and a step with no scene says the video leaves it out
  if (videos.plan) for (const s of steps) if (!videos.plan.scenes.some((f) => f.step === s.n) && !/not in the video/i.test(s.text)) gaps.push({ where: `step ${s.n}`, what: `has no scene in the plan video, and does not say "not in the video"`, fail: t.kind === "plan-video" });
  made.unshift(`The plan's words: \`${relative(repo, join(t.planDir, "plan.md"))}\`, every section; its decisions from \`.reelplanning/decisions.json\`${scenes ? `; the scenes and their pictures from the plan map` : ""}.`);
  const side = t.kind === "walkthrough" ? "built" : "plan";
  // every open question, with where it sits (a question naming no step of this plan is shown whole here)
  const questions = plan.questions.map((q) => { const placed = (q.steps || []).find((n) => steps.some((s) => s.n === n)); return { n: q.n, title: q.title, step: placed ?? null, answered: !!answeredIn(q, ledgerAll, planName), text: placed == null ? q.text : null }; });
  const data = { v: 1, kind: "plan", title: plan.title, planName, own: t.own, side, slug: t.slug, videos, steps, rest, questions, inForce: plan.inForce.map((x) => ({ text: x.text, ids: x.ids, steps: x.steps })),
    ledger, parts: plan.parts, allParts: (sys?.components || []).map((c) => c.name), touchedAll: plan.touched.map((c) => ({ name: c.name, steps: c.steps })),
    built: built && { commits: built.commits, started: built.started, cats: built.cats, runs: built.runs, looseRuns: built.looseRuns, totals: built.totals, calls: built.calls, texts: built.texts, from: built.from },
    gaps, made, reader, overview, auto, exRuns };
  // what changed since the version of plan.md the last plan review saw (lib/guide/revised.mjs): a plan's own page only
  if (t.own === "plan") {
    data.revised = revisedOf(t.planDir, { repo, videoDir: t.kind === "plan-video" ? t.videoDir : null });
    const A = data.revised?.against;
    if (A) made.push(A.kind === "review" ? `What changed since your review: plan.md compared, part by part, with its version at \`${A.commit}\`, the one you watched for the review of ${A.day} (\`${A.reviewMd || `reviews/${A.review}.json`}\`); the words that asked for each change from that review.`
      : `What changed: plan.md compared, part by part, with its previous version in git (\`${A.commit}\`, ${A.day}), since ${A.why}.`);
  }
  // (that section's own note on when it was written is shown apart, folded, in guide.js's colophon)
  if (fgPlan || fgBuilt) made.push(`The diagrams, worked examples and depth under each step: from the "For the guide" section of ${[fgPlan && "plan.md", fgBuilt && "walkthrough.md"].filter(Boolean).join(" and ")}, drawn as SVG when the page is built; the ones marked "made from" are drawn from the files themselves.`);
  reader.words = wordsOf(t.videoDir || t.planDir);
  reader.thin = thinOf({ gaps, steps, tryIt, hasPromise: !!np.promise, asked, built: data.built, kind: "plan", summary, can: steps.filter((s) => !["waiting", "not done"].includes(s.built?.status)).map((s) => ({ n: s.n, can: s.can })) });
  reader.missingPics = gaps.filter((g) => /^no picture/.test(g.what)).length;
  return { data, target: t, repo, parts: partsOf(data) };
}

// ── what a Not done line became since ──
const NUMS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const numberOf = (w) => { if (/^\d+$/.test(w)) return +w; return String(w).toLowerCase().split("-").reduce((a, x) => (NUMS[x] != null ? a + NUMS[x] : NaN), 0); };
const dayOf = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ""); return m ? `${+m[3]} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m[2] - 1]} ${m[1]}` : d || ""; };
const norm = (s) => String(s || "").toLowerCase().replace(/`/g, "").replace(/[^a-z0-9]+/g, " ").trim();
// the steps a walkthrough's code check found short of the plan and not fixed since: "- **✗ Step 5** (no "…", no "…"):
// not built, …" → [{ step: 5, missing: 2 }] (missing: the things it names as absent, `no "…"`)
function codeShort(md) {
  return [...String(md || "").matchAll(/^[-*] (?:the first )?\*\*✗\s*Step (\d+)\*\*([^\n]*(?:\n(?![-*] |\n)[^\n]*)*)/gm)].map((m) => {
    const rest = m[2].replace(/\s+/g, " "), paren = /^\s*\(((?:[^()]|\([^()]*\))*)\)/.exec(rest), after = rest.slice(paren ? paren[0].length : 0).replace(/^\s*:\s*/, "");
    return { step: +m[1], missing: paren ? (paren[1].match(/(?:^|,\s*)no\s+["“]/g) || []).length : 0, fixed: /^fixed\b/i.test(after) };
  }).filter((x) => !x.fixed);
}
// the line "## Supersedes" in a later plan's plan.md gives a decision it replaced or narrowed: `- **D-214** "…" Narrowed
// for small pull requests (step 4).` → { words: "Narrowed for small pull requests", step: 4 } | null
export function supersedesLine(planDir, id) {
  const f = join(planDir, "plan.md"); if (!has(f)) return null;
  const md = readFileSync(f, "utf8").replace(/\r\n/g, "\n"), m = /^## Supersedes[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(md); if (!m) return null;
  const item = [...m[1].matchAll(/^[-*] ([^\n]*(?:\n(?![-*] |\n)[^\n]*)*)/gm)].map((x) => x[1].replace(/\s+/g, " ").trim()).find((x) => new RegExp(`^\\*\\*${id}\\*\\*`).test(x));
  if (!item) return null;
  const rest = item.replace(/^\*\*[^*]+\*\*\s*/, "").replace(/^"[^"]*"\s*|^“[^”]*”\s*/, "");
  const step = /\(steps? (\d+)\)|\bsteps? (\d+)\b/i.exec(rest);
  return { words: rest.replace(/\s*\(steps? \d+[^)]*\)/i, "").replace(/[.\s]+$/, "").trim(), step: step ? +(step[1] || step[2]) : null };
}
// what a plan's step does today, in its own walkthrough's words: its For the guide "In short", else its "You can now"
function todayOf(planDir, n) {
  const f = join(planDir, "walkthrough.md"); if (!has(f)) return null;
  const md = readFileSync(f, "utf8"), fg = forGuideOf(md), lead = fg?.steps?.[n]?.lead;
  if (lead) return lead;
  const st = readWalkthrough(f).steps.find((x) => x.n === n); return st ? canLine(st.text) : null;
}
function notDoneOf(md, { ledger, repo, planDir, planName, since = [], plain = [], withStep = [], last = null, gaps, approved = false }) {
  const items = [...String(md || "").matchAll(/^[-*] \*\*([^*]+)\*\*([^\n]*(?:\n(?![-*] )[^\n]*)*)/gm)].map((m) => ({ head: m[1].trim(), rest: m[2], md: m[0].replace(/^[-*]\s+/, "").replace(/\n\s+/g, " ").trim(), settled: [] }));
  const plansDir = dirname(planDir), slug = planName.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const otherPlans = (() => { try { return readdirSync(plansDir).filter((d) => d !== planName && has(join(plansDir, d, "plan.md"))); } catch { return []; } })();
  for (const it of items) {
    const text = `${it.head} ${it.rest}`;
    // a decision it names, replaced since by a later one
    for (const id of new Set(text.match(/\bD-\d{3,4}\b/g) || [])) { const d = ledger.find((x) => x.id === id), nd = d?.supersededBy && ledger.find((x) => x.id === d.supersededBy);
      if (!nd && d?.supersededByPlan) it.settled.push({ md: `the decision it names was replaced on ${dayOf(d.supersededOn)} by the plan ${d.supersededByPlan.replace(/^\d{4}-\d{2}-\d{2}-/, "")}`, ids: [id], from: "the decision log" });
      if (nd) it.settled.push({ md: `the decision it names was replaced on ${dayOf(nd.date)}: “${nd.chosen}”`, ids: [id, nd.id], from: "the decision log" }); }
    // another plan it waits on, built since (its walkthrough says every step is done)
    for (const d of otherPlans) { const title = (/^# (.+)$/m.exec(readFileSync(join(plansDir, d, "plan.md"), "utf8")) || [])[1] || ""; const name = title.split(":")[0].trim();
      if (name.split(/\s+/).length < 2 || !new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:'s)?\\b`, "i").test(text) || !has(join(plansDir, d, "walkthrough.md"))) continue;
      const w = readWalkthrough(join(plansDir, d, "walkthrough.md")), done = w.steps.filter((s) => s.status === "done").length;
      if (w.steps.length && done === w.steps.length) { const cs = codeShort(w.texts.codeCheck);
        it.settled.push({ md: `${name.replace(/^The /, "the ")} has been built: its walkthrough says all ${w.steps.length} steps are done${cs.length ? `, and its code check found ${cs.map((x) => `step ${x.step} short of the plan${x.missing ? ` (${x.missing === 1 ? "one thing" : `${Object.keys(NUMS)[x.missing - 1] || x.missing} things`} missing)` : ""}`).join(" and ")}` : ""}`, from: `${d}/walkthrough.md` }); } }
    // the system video, brought up to date for this plan since (its commit says so: "System video current with <plan>")
    if (/system video/i.test(text) && last) for (const c of commitsSince(repo, last.sha, { paths: [".reelplanning/system-video"], subject: new RegExp(`^System video current with ${slug.replace(/-/g, "[- ]")}\\b`, "i") }))
      it.settled.push({ md: `a later commit brought it up to date: “${c.subject}”`, commits: [c], from: "git" });
    // …or by what it names: the glossary rows it says the system video lacks, which a later commit gave a scene
    // (a `- defines:` line of its storyboard), whichever plan that commit was for
    const rows = /system video/i.test(text) && /glossary/i.test(text) ? [...text.matchAll(/\(([^()]+)\)/g)].flatMap((m) => m[1].split(/,\s*|\s+and\s+/)).map((w) => w.trim().replace(/^(?:the|a|an)\s+/i, "").toLowerCase()).filter((w) => w && w.split(/\s+/).length <= 5 && !/\bD-\d/.test(w)) : [];
    if (rows.length && last && !it.settled.length) {
      const SB = ".reelplanning/system-video/STORYBOARD.md", got = new Map(), bare = (w) => w.trim().replace(/^(?:the|a|an)\s+/i, "").toLowerCase();
      for (const c of commitsSince(repo, last.sha, { paths: [SB] }).reverse()) {
        let diff = "", then = ""; try { diff = execFileSync("git", ["-C", repo, "show", "--format=", c.sha, "--", SB], { encoding: "utf8", maxBuffer: 64 << 20 }); then = execFileSync("git", ["-C", repo, "show", `${c.sha}:${SB}`], { encoding: "utf8", maxBuffer: 64 << 20 }); } catch {}
        const terms = (l) => l.replace(/^[+-]\s*-\s*defines:\s*/, "").split(/,\s*/).map(bare);
        const removed = new Set(diff.split("\n").filter((l) => /^-\s*-\s*defines:/.test(l)).flatMap(terms));
        const added = new Set(diff.split("\n").filter((l) => /^\+\s*-\s*defines:/.test(l)).flatMap(terms).filter((w) => !removed.has(w)));
        // the scene each row is defined in now, and the words its line defines beside it (a row added to a scene's
        // existing line is defined there, beside what that scene already defined: never "a scene of its own")
        const frames = then.split(/^## Frame /m).slice(1).map((b) => ({ n: +(/^(\d+)/.exec(b) || [])[1], line: (/^- defines:\s*(.+)$/m.exec(b) || [])[1] || "" })).filter((f) => f.n && f.line);
        for (const r of rows) if (added.has(r) && !got.has(r)) { const f = frames.find((x) => x.line.split(/,\s*/).map(bare).includes(r)); got.set(r, { c, scene: f?.n ?? null, line: f ? f.line.split(/,\s*/).map((w) => w.trim()) : [] }); }
      }
      if (got.size) { const vals = [...got.values()], cs = [...new Set(vals.map((v) => v.c))], said = [...got.keys()].map((r) => `“${r}”`), left = rows.filter((r) => !got.has(r));
        const and = (xs) => xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}` : xs.join("");
        const where = [...new Set(vals.map((v) => v.scene))].map((n) => { const v = vals.find((x) => x.scene === n), others = v.line.filter((w) => !got.has(bare(w)));
          return n == null ? "" : `scene ${n}${others.length ? `, with ${and(others)}` : ""}`; }).filter(Boolean).join("; ");
        it.settled.push({ md: `${and(said)} ${got.size === 1 ? "is" : "are"} now defined in the system video${where ? ` (${where})` : ""}, since ${cs.map((c) => `“${c.subject}”`).join(", ")}${left.length ? `; ${left.map((r) => `“${r}”`).join(" and ")} not yet` : ""}${approved ? "" : "; the rest of its catch-up for this plan still waits on this walkthrough's acceptance"}`, commits: cs, from: "git", partial: !approved || left.length > 0 }); }
    }
    // the walkthrough's own "Since then", its commits as git has them
    for (const x of since.filter((x) => norm(it.head).startsWith(norm(x.head)) || norm(x.head).startsWith(norm(it.head)))) {
      const commits = [...new Set((x.md.match(/\b[0-9a-f]{7,40}\b/g) || []))].map((sha) => commitInfo(repo, sha) || { sha, missing: true });
      for (const c of commits.filter((c) => c.missing)) gaps.push({ where: `Since then: ${x.head}`, what: `names ${c.sha}, which is not in this clone` });
      it.settled.push({ md: x.md, commits: commits.filter((c) => !c.missing), from: "walkthrough.md" });
      x.used = true;
    }
  }
  for (const x of since.filter((x) => !x.used)) gaps.push({ where: `Since then: ${x.head}`, what: "names no line of Not done (its bold lead starts the line's)" });
  // the line said plainly (walkthrough.md's "In plain words"), and a line said with a step the code check found short
  const hit = (a, b) => norm(a).startsWith(norm(b)) || norm(b).startsWith(norm(a));
  for (const it of items) { const p = plain.find((x) => hit(it.head, x.head)); if (p) { it.plain = p.md; p.used = true; }
    const w = withStep.find((x) => hit(it.head, x.head)); if (w) { it.withStep = w.step; w.used = true; } }
  for (const x of [...plain, ...withStep].filter((x) => !x.used)) gaps.push({ where: `In plain words: ${x.head}`, what: "names no line of Not done (its bold lead starts the line's)" });
  return items.map(({ rest, ...x }) => x);
}
// the files the walkthrough video says the change touched ("It changed thirty-seven files"), and where that number is
// said in the code check ("over this plan's 37 files"): the page's own count, from git, can count more
function videoFilesOf(videoDir, codeCheck) {
  if (!videoDir) return null;
  const map = readJson(join(videoDir, "plan-map.json")) || {}, sb = has(join(videoDir, "STORYBOARD.md")) ? readFileSync(join(videoDir, "STORYBOARD.md"), "utf8") : "";
  // each scene's words, from the plan map (newer videos) or the storyboard's voiceover lines, with the scene's number
  const said = (map.frames || []).filter((f) => f.narration).map((f) => ({ n: f.index, t: f.narration }));
  if (!said.length) for (const b of sb.split(/^## Frame /m).slice(1)) { const n = +(/^(\d+)/.exec(b) || [])[1]; const v = (/^- voiceover:\s*"?(.+?)"?\s*$/m.exec(b) || [])[1]; if (n && v) said.push({ n, t: v }); }
  const hit = said.find((x) => FILES_SAID.test(x.t)); if (!hit) return null;
  const words = hit.t;
  const m = FILES_SAID.exec(words);
  if (!m) return null; const n = numberOf(m[1]); if (!Number.isFinite(n)) return null;
  const cc = new RegExp(`(?:\\b[a-z'’]+\\s+){0,3}${n}\\s+files\\b(?:\\s*\\([^)]*\\))?`).exec(String(codeCheck || "").replace(/`/g, "").replace(/\s+/g, " "));
  return { n, said: m[0], scene: hit.n, codeCheck: cc ? cc[0].trim() : null };
}
// "37 files", "thirty-seven files": the number is the first group
const FILES_SAID = /\b(\d+|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)(?:-(?:one|two|three|four|five|six|seven|eight|nine))?)\s+files\b/i;

// ── an explainer ──
async function explainerModel(t, { repo, scenes, gaps, made, outside }) {
  const pinned = readSources(t.explainerDir) || { sources: [] };
  const explain = has(join(t.explainerDir, "explain.md")) ? readFileSync(join(t.explainerDir, "explain.md"), "utf8") : "";
  const sb = has(join(t.videoDir, "STORYBOARD.md")) ? storyboardFrames(readFileSync(join(t.videoDir, "STORYBOARD.md"), "utf8")) : [];
  // the lines each scene quotes (`- source: <id>[:<from>-<to>]`), to mark them in their source
  const quoted = {};
  for (const f of sb) for (const ref of String(f.meta.source || "").split(/\s*[,;]\s+|\s+·\s+/).map((x) => x.replace(/`/g, "").trim()).filter(Boolean)) {
    const m = /^(.*?)(?::(\d+)(?:-(\d+))?)?$/.exec(ref); if (!m) continue;
    (quoted[m[1]] ||= []).push({ scene: f.index, from: m[2] ? +m[2] : null, to: m[3] ? +m[3] : m[2] ? +m[2] : null });
  }
  const mask = (text) => { let s = String(text); for (const p of privateIn(s)) s = s.split(p.found).join(maskOf(p.found)); return s; };
  const sources = (pinned.sources || []).map((src) => {
    const base = { id: src.id, part: needsPart(src) ? sourcePart(src) : null, form: src.form, shape: src.shape, size: src.size, commit: src.commit || null, hash: src.hash || null, range: src.range || null, said: src.said || null, quoted: quoted[src.id] || [], note: null };
    if (!base.part) return base;
    if (src.form === "outside" && !outside) return { ...base, note: `Kept outside the repo (D-249): the guide carries its path, hash and ${src.size?.lines ?? "?"} lines, not its text. \`reelplanning guide <video-dir> --outside\` builds a copy with it, masked, for this machine only.` };
    const fileList = src.files?.length ? src.files.map((f) => f.path) : null;
    if (src.shape === "files" && fileList) {
      const files = fileList.slice(0, 200).map((p) => { const r = sourceText(src, { repo, path: p }); return { path: p, lines: r.text == null ? null : mask(r.text).replace(/\n$/, "").split("\n"), note: r.note || null, quoted: (quoted[p] || []).concat(quoted[src.id] && fileList.length === 1 ? quoted[src.id] : []) }; });
      if (fileList.length > 200) base.note = `The first 200 of its ${fileList.length} files.`;
      return { ...base, files };
    }
    const r = sourceText(src, { repo }); if (r.text == null) return { ...base, note: r.note };
    const text = mask(r.text);
    if (src.shape === "table") return { ...base, table: tableOf(text, src.id), note: r.note || null };
    if (src.shape === "sequence") return { ...base, entries: text.replace(/\n$/, "").split("\n"), note: r.note || null };
    return { ...base, text, note: r.note || null };
  });
  for (const s of sources) if (s.part && !s.files && !s.entries && !s.table && s.text == null) gaps.push({ where: `source ${s.id}`, what: s.note || "its text could not be read here" });
  made.push("The sources: `sources.json`, each read as it was pinned (a repo file at its commit), secrets, email addresses and home paths masked.");
  const data = { v: 1, kind: "explainer", title: pinned.title || scenes?.title || basename(t.explainerDir), question: pinned.question || null, created: pinned.created || null, commit: pinned.commit || null,
    explain, own: "explainer", side: "plan", slug: t.slug, videos: { explainer: scenes && { slug: t.slug, title: scenes.title, dir: relative(repo, t.videoDir), total: scenes.total, scenes: scenes.frames.map(({ narration, file, ...f }) => f) } },
    sources, gaps, made, reader: { ...explainerReader(explain, pinned), words: wordsOf(t.videoDir) } };
  return { data, target: t, repo, parts: partsOf(data) };
}
// the glossary's plain meanings, for the words the page uses (the page marks each where it first appears)
function wordsOf(dir) {
  try { return glossaryFor(dir).map((x) => ({ term: x.display || x.term.replace(/^(The|An?)\s+/, "").split(" / ")[0], forms: x.forms, said: splitMeaning(x.meaning, [x.term, x.display].filter(Boolean)).said })).filter((x) => x.said); } catch { return []; }
}
// explain.md's own sections, for the reader: what it covers, what it leaves out, what is still open
function explainerReader(explain, pinned) {
  const sec = (re) => { const m = new RegExp(`^## ${re.source}[^\\n]*$`, "mi").exec(explain); if (!m) return null; const rest = explain.slice(m.index + m[0].length); const e = rest.search(/^## /m); const t = (e < 0 ? rest : rest.slice(0, e)).replace(/<!--[\s\S]*?-->/g, "").trim(); return t || null; };
  const title = pinned.title || (/^# (.+)$/m.exec(explain) || [])[1] || "";
  const thin = [];
  const cover = sec(/What it will cover/), leaves = sec(/What it leaves out/), open = sec(/Open threads/);
  if (!cover) thin.push({ what: "What the video covers: explain.md's \"What it will cover\" is empty", where: "explain.md" });
  if (!leaves) thin.push({ what: "What it leaves out: explain.md's \"What it leaves out\" is empty", where: "explain.md" });
  return { name: title, promise: null, asked: pinned.question ? { who: "You asked", quote: pinned.question, lead: null } : null, cover, leaves, open, thin, tryIt: [], choices: [] };
}
function tableOf(text, id) {
  const t = String(text).trim();
  if (/^\s*\[/.test(t)) { try { const rows = JSON.parse(t); const head = [...new Set(rows.flatMap((r) => Object.keys(r)))]; return { head, rows: rows.map((r) => head.map((h) => (r[h] == null ? "" : typeof r[h] === "object" ? JSON.stringify(r[h]) : String(r[h])))) }; } catch {} }
  const sep = /\.tsv$/i.test(id) || (t.split("\n")[0].includes("\t") && !t.split("\n")[0].includes(",")) ? "\t" : ",";
  const parse = (line) => { if (sep === "\t") return line.split("\t"); const out = []; let cur = "", q = false; for (let i = 0; i < line.length; i++) { const c = line[i]; if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; } else if (c === '"') q = true; else if (c === ",") { out.push(cur); cur = ""; } else cur += c; } out.push(cur); return out; };
  const lines = t.split("\n").filter(Boolean); return { head: parse(lines[0] || ""), rows: lines.slice(1).map(parse) };
}

// what a part does not show, left out of it: another step's blocks, a scene's picture it does not link, another kind's lines
const stepStub = (s) => ({ n: s.n, id: s.id, title: s.title, cats: s.cats, choices: s.choices, questions: [], decisions: [], inForce: [], gaps: [], touched: [], other: [] });
const catStub = (c) => ({ ...c, files: c.files.map((f) => ({ path: f.path, add: f.add, del: f.del, isNew: f.isNew, generated: f.generated, commits: f.commits.map(({ sha, label }) => ({ sha, label, hunks: [] })) })), lite: true });
function slimVideos(videos, keep) {
  return Object.fromEntries(Object.entries(videos || {}).map(([k, v]) => [k, v && { ...v, scenes: v.scenes.map((f) => (keep(k, f) ? f : { ...f, thumb: null })) }]));
}
function slimBuilt(B, { cats = [], runs = [], calls = null, texts = false } = {}) {
  if (!B) return B;
  const full = B.cats.filter((c) => cats.includes(c.id)), keys = new Set(full.flatMap((c) => c.files.map((f) => f.whole?.key).filter(Boolean)));
  return { ...B, cats: B.cats.map((c) => (cats.includes(c.id) ? c : catStub(c))), wholes: Object.fromEntries(Object.entries(B.wholes || {}).filter(([k]) => keys.has(k))),
    runs: Object.fromEntries(Object.entries(B.runs).filter(([k]) => runs.includes(k))), calls: calls ? B.calls.filter(calls) : B.calls, texts: texts ? B.texts : {} };
}
/** The parts of a guide, and each one's own data (a part carries only what it shows). */
export function partsOf(G) {
  const P = [];
  if (G.kind === "explainer") {
    P.push({ name: "sources", title: "The sources", kind: "overview", planStep: null, data: { ...G, sources: G.sources.map((s) => ({ ...s, files: undefined, entries: undefined, table: undefined, text: undefined })) } });
    for (const s of G.sources.filter((x) => x.part)) P.push({ name: s.part, title: s.id, kind: "source", planStep: null, data: { ...G, sources: G.sources.map((x) => (x === s ? x : { ...x, files: undefined, entries: undefined, table: undefined, text: undefined })) } });
    return P;
  }
  const base = { ...G, rest: [], questions: [], gaps: [], made: [] };
  const stubs = (keep = null) => G.steps.map((x) => (x === keep ? x : stepStub(x)));
  const ledgerOf = (ids) => Object.fromEntries(Object.entries(G.ledger || {}).filter(([k]) => ids.includes(k)));
  const catScenes = (ids) => (k, f) => k === "built" && ids.some((id) => f.guide === id || f.detail === id || (G.built?.cats.find((c) => c.id === id)?.steps || []).includes(f.step));
  for (const s of G.steps) {
    const cats = (G.built?.cats || []).filter((c) => s.cats.includes(c.id)), ids = [...s.decisions, ...s.inForce.flatMap((x) => x.ids), ...s.questions.flatMap((q) => q.answered?.ids || [])];
    P.push({ name: s.id, title: `Step ${s.n} · ${s.title}`, kind: "step", planStep: s.n, data: { ...base, steps: stubs(s), ledger: ledgerOf(ids), inForce: [],
      videos: slimVideos(G.videos, (k, f) => f.step === s.n), built: slimBuilt(G.built, { cats: [], runs: cats.flatMap((c) => c.runs), calls: (c) => c.step === s.n }) } });
  }
  P.push({ name: "decisions", title: "Decisions in force", kind: "decisions", planStep: null, data: { ...base, steps: stubs(), videos: slimVideos(G.videos, () => false), built: slimBuilt(G.built) } });
  if (G.built) {
    P.push({ name: "what-changed", title: "What changed, in full", kind: "overview", planStep: null, data: { ...base, steps: stubs(), ledger: {}, videos: slimVideos(G.videos, () => false), built: slimBuilt(G.built, { runs: G.built.looseRuns, texts: true }) } });
    for (const c of G.built.cats) P.push({ name: c.id, title: c.name.replace(/`/g, ""), kind: "category", planStep: c.steps?.length === 1 ? c.steps[0] : null,
      data: { ...base, steps: stubs(), ledger: {}, videos: slimVideos(G.videos, catScenes([c.id])), built: slimBuilt(G.built, { cats: [c.id], runs: [...c.runs, ...(c.id === "everything-else" ? G.built.looseRuns : [])], calls: (x) => (c.steps || []).includes(x.step) }) } });
    if (G.built.calls.length) P.push({ name: "choices", title: "Every choice the agent made", kind: "choices", planStep: null, data: { ...base, steps: stubs(), ledger: {}, videos: slimVideos(G.videos, () => false), built: slimBuilt(G.built) } });
  }
  return P;
}
