// Fresh eyes (videos-that-make-sense, steps 1 and 2; D-225): two fresh agents look at a video before the
// reviewer does, given only what a viewer gets, and every finding is answered before the page opens.
//
//   <video-dir>/fresh-eyes/stamp.json        the round, and what the agents saw: each scene's narration and
//                                            frame, hashed, so a later change is found scene by scene
//   <video-dir>/fresh-eyes/newcomer-brief.md what the newcomer gets: each scene's narration and picture, the
//                                            glossary, this video's own words, the recap lines of the videos
//                                            it leans on, and what viewers were lost on before
//   <video-dir>/fresh-eyes/designer-brief.md what the designer gets: each scene's picture and narration, and
//                                            the seven rules for how a frame reads (style guide §5)
//   <video-dir>/fresh-eyes/newcomer.md       the newcomer's findings (N1, N2 …), one a line, each answered
//   <video-dir>/fresh-eyes/designer.md       the designer's findings (G1, G2 …), the same way
//   <video-dir>/fresh-eyes/round-<n>/        an earlier round of this build's, moved there when the next begins
//   <video-dir>/fresh-eyes/build-<n>/round-<k>/  an earlier build's rounds (a rebuild is a new build, D-227):
//                                            kept as history, never read by the page or `verify`
//   <video-dir>/fresh-eyes/shots/            the pictures (kept out of git: made again by the next run)
//
// Rounds belong to a build. A build is what plan-diff compares against: the plan map last committed (git
// HEAD's), hashed, as the plan map's `changes.build` ("first" when there is none). Rebuilding while the rounds
// go on keeps it (the commit has not moved); the next commit of the video ends it. When the build is not the
// last set's, `fresh-eyes` moves that set to build-<n>/ and starts at round 1: the rounds are per build.
// On a rebuild, the agents get the scenes plan-diff says changed (edited, added or restyled), each with the
// scene before and after it for context only; a finding on any other scene is out of scope, not counted and
// needing no answer. A first build, or `--all`, gets every scene.
//
// The agents write one file each, at the exact path their prompt names (`fresh-eyes/<role>.md`, absolute), and
// nothing else; the session building the video launches each from a scratch folder of its own, outside the
// repository. `--check` looks for this round's findings anywhere else in the repository (a file whose first line
// is its heading with this round's stamp) and fails on one: it is not read from there.
//
// A finding is one line, and its answer the indented line under it, written by the author:
//
//   - N1 · scene 4 · "the list": which list? I guessed the list of plans.
//     - Answer: kept: scene 5 says what the list is, "the choices that don't pause".
//
// An answer is `fixed` (what changed, and where), `meaning` (the phrase kept, with a meaning a viewer can
// click: the glossary's "Other words", or the storyboard's `terms:`), or `kept` with the reason.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, realpathSync } from "node:fs";
import { join, resolve, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { parseScript } from "./narration.mjs";
import { storyboardFrames, frontMatter, termsOf, glossaryFor } from "./terms.mjs";
import { depthOf } from "./depth.mjs";

export const DIR = "fresh-eyes";
// One round a build, and a second only on what the first's answers changed in what a scene says (its narration, or
// the scenes' order): never a third (plans/2026-10-10-cheaper-videos, step 2, superseding D-231's third round).
export const ROUNDS = 2;
export const ROLES = { newcomer: "N", designer: "G" };
// the fact check (explain-first step 5): a third fresh agent reads an explainer's narration against its sources, never
// the author's account, where the video sums up more than it quotes (a source that needs a guide part)
export const CHECKER = { checker: "F" };
/** Whether a video gets the fact check: an explainer with a source far longer than the video can show. */
export function factChecked(videoDir) {
  const dir = resolve(videoDir);
  if (!/^kind:\s*explainer\s*$/m.test(frontMatter(read(join(dir, "STORYBOARD.md"))))) return false;
  for (const d of [join(dir, ".."), dir]) { const s = readJson(join(d, "sources.json")); if (s) return (s.sources || []).some((x) => x.guide); }
  return false;
}
export const ALL_ROLES = { ...ROLES, ...CHECKER };
/**
 * The fresh agents a round gets, at the video's depth (lib/depth.mjs, #34): at high the newcomer and the designer,
 * and the checker for a fact-checked explainer; at medium the newcomer and the checker, and in a second round the
 * checker alone; at low the checker alone, or no one. round: the stamp's, by default.
 */
export function rolesFor(videoDir, round = readStamp(videoDir)?.round || 1) {
  const depth = depthOf(videoDir), checked = factChecked(videoDir);
  if (depth === "low") return checked ? CHECKER : {};
  if (depth === "medium") return round > 1 ? (checked ? CHECKER : {}) : checked ? { newcomer: ROLES.newcomer, ...CHECKER } : { newcomer: ROLES.newcomer };
  return checked ? ALL_ROLES : ROLES;
}
/** How many rounds a build gets: two at high; at medium one, and a second for the checker where there is one; one at low. */
export const roundsFor = (videoDir) => { const depth = depthOf(videoDir); return depth === "high" || (depth === "medium" && factChecked(videoDir)) ? ROUNDS : 1; };
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const hash = (s) => createHash("sha256").update(String(s)).digest("hex").slice(0, 12);

export const feDir = (videoDir) => join(resolve(videoDir), DIR);
export const readStamp = (videoDir) => readJson(join(feDir(videoDir), "stamp.json"));

/**
 * The build a video is at, as plan-diff recorded it in plan-map.json's `changes` → { id, scope, changes }:
 *   id     the build's signature: `changes.build` (the previous build's plan map, hashed), "first" when there is
 *          no previous build to compare against
 *   scope  the scenes a rebuild changed (plan-diff's edited, added and restyled: a restyle is what the designer
 *          judges), in order; null for a first build (every scene)
 */
export function buildOf(videoDir, map = readJson(join(resolve(videoDir), "plan-map.json"))) {
  const c = map?.changes;
  if (!c?.baseline) return { id: "first", scope: null, changes: c || null };
  const scope = [...new Set([...(c.changedFrames || []), ...(c.restyledFrames || [])])].sort((a, b) => a - b);
  return { id: c.build || `at ${c.at}`, scope, changes: c };
}
/** The build a set of rounds belongs to: its stamp's (a stamp from before builds were stamped: "first"). */
export const buildOfStamp = (stamp) => stamp?.build || "first";
/** The scenes a brief shows for context only: the scene before and after each in scope, not in scope itself. */
export function contextOf(scope, scenes) {
  if (!scope) return [];
  const all = new Set(scenes), s = new Set(scope);
  return [...new Set(scope.flatMap((n) => [n - 1, n + 1]))].filter((n) => all.has(n) && !s.has(n)).sort((a, b) => a - b);
}
/** A finding is in the round's scope: every scene on a whole-video round; else its scene is one the build changed. */
export const inScope = (stamp, f) => !Array.isArray(stamp?.scope) || !f.scene || stamp.scope.includes(f.scene);
/** The earlier builds' folders, in order: [build numbers]. */
export const buildsKept = (videoDir) => { const d = feDir(videoDir); return existsSync(d) ? readdirSync(d).map((x) => Number((/^build-(\d+)$/.exec(x) || [])[1])).filter(Boolean).sort((a, b) => a - b) : []; };

/** Each scene as a viewer meets it: { scene, title, src, narration }, in order. */
export function scenesOf(videoDir) {
  const dir = resolve(videoDir), sb = read(join(dir, "STORYBOARD.md"));
  const said = Object.fromEntries(parseScript(read(join(dir, "SCRIPT.md"))).map((l) => [l.frame, l.text]));
  return storyboardFrames(sb).filter((f) => f.meta.src).map((f) => ({ scene: f.index, title: f.title, src: f.meta.src,
    narration: said[f.index] ?? String(f.meta.voiceover || "").replace(/^"(.*)"$/, "$1") }));
}

/** What the agents saw, scene by scene: the narration and the frame's HTML, hashed. */
export function stampOf(videoDir) {
  const dir = resolve(videoDir);
  const scenes = scenesOf(dir).map((s) => ({ scene: s.scene, narration: hash(s.narration), frame: hash(read(join(dir, s.src))) }));
  const plan = planOf(dir);
  return { id: hash(JSON.stringify(scenes)), scenes, ...(plan ? { plan: hash(read(plan)) } : {}) };
}

const sourceNameOf = (videoDir) => /^kind:\s*explainer\s*$/m.test(frontMatter(read(join(resolve(videoDir), "STORYBOARD.md")))) ? "explain.md" : "plan.md";
/** The video's source document: explain.md for an explainer, plan.md for a plan/walkthrough, or null. */
export function planOf(videoDir) {
  const p = join(resolve(videoDir), "..", sourceNameOf(videoDir));
  return existsSync(p) ? p : null;
}

/**
 * The scenes whose words changed since the stamp: narration rewritten, a scene added or removed, or the scenes put in
 * another order. A frame redrawn with its words as they were is not one: a second round looks only at these (step 2).
 */
export function saidSince(videoDir, stamp) {
  if (!stamp?.scenes) return [];
  const now = stampOf(videoDir).scenes, was = new Map(stamp.scenes.map((s) => [s.scene, s]));
  const out = now.filter((s) => { const w = was.get(s.scene); return !w || w.narration !== s.narration; }).map((s) => s.scene);
  for (const s of stamp.scenes) if (!now.some((x) => x.scene === s.scene)) out.push(s.scene);
  // the same lines in another order: each moved scene counts
  const order = (xs) => xs.map((s) => s.narration).join("|");
  if (out.length === 0 && order(now) !== order(stamp.scenes) && now.length === stamp.scenes.length)
    now.forEach((s, i) => { if (stamp.scenes[i]?.narration !== s.narration) out.push(s.scene); });
  return [...new Set(out)].sort((a, b) => a - b);
}

/** The scenes whose narration or frame changed since the stamp (or were added or removed). */
export function changedSince(videoDir, stamp) {
  if (!stamp?.scenes) return [];
  const now = stampOf(videoDir).scenes, was = new Map(stamp.scenes.map((s) => [s.scene, s]));
  const out = now.filter((s) => { const w = was.get(s.scene); return !w || w.narration !== s.narration || w.frame !== s.frame; }).map((s) => s.scene);
  for (const s of stamp.scenes) if (!now.some((x) => x.scene === s.scene)) out.push(s.scene);
  return [...new Set(out)].sort((a, b) => a - b);
}

const ANSWER = /^\s+[-*]\s*\**answer\**\s*:?\**\s*(fixed|meaning|kept|plan|ask)\b\**\s*[:,;.—–-]?\s*(.*)$/i;
/**
 * A findings file's findings: [{ id, scene, phrase, text, plan, answer: { kind, text } | null }]. `phrase` is the first
 * quoted phrase of the finding ("…" or “…”), the thing a `meaning` answer gives a meaning to; `plan` is a finding the
 * agent marked `[plan]`: about the plan, not the video. A `## Advisory` section (the designer's notes that do not
 * block a viewer) holds no findings: nothing under it is counted or needs an answer, up to the next heading.
 */
export function parseFindings(md) {
  const out = [];
  let cur = null, advisory = false;
  for (const line of String(md).replace(/\r\n/g, "\n").split("\n")) {
    const h = /^#{1,6}\s+(.*)$/.exec(line);
    if (h) { advisory = /^advisory\b/i.test(h[1].trim()); cur = null; continue; }
    if (advisory) continue;
    const m = /^[-*]\s+\**([NGF]\d+)\**\b\s*(.*)$/.exec(line);
    if (m) {
      const rest = m[2].replace(/^[\s·:,.—–-]+/, "");
      cur = { id: m[1], scene: Number((/\bscenes?\s+(\d+)/i.exec(rest) || [])[1]) || null, phrase: (/["“]([^"”]{2,80})["”]/.exec(rest) || [])[1] || null, text: rest.trim(), plan: /\[plan\]/i.test(rest), answer: null };
      out.push(cur); continue;
    }
    if (!cur) continue;
    if (/^\S/.test(line)) { cur = null; continue; }
    const a = ANSWER.exec(line);
    if (a && !cur.answer) cur.answer = { kind: a[1].toLowerCase(), text: a[2].trim() };
  }
  return out;
}

/** The phrase has a meaning a viewer can open: a glossary row (its "Other words" included) or the storyboard's `terms:`. */
export function hasMeaning(videoDir, phrase) {
  const p = String(phrase || "").trim().toLowerCase().replace(/^(the|an?)\s+/, "");
  if (!p) return true;
  const own = termsOf(frontMatter(read(join(resolve(videoDir), "STORYBOARD.md")))).filter((t) => t.meaning).map((t) => t.term.toLowerCase().replace(/^(the|an?)\s+/, ""));
  if (own.includes(p)) return true;
  return glossaryFor(videoDir).some((g) => (g.forms || []).includes(p) || String(g.display || "").toLowerCase() === p);
}

// A kept reason that sends the viewer somewhere else (the guide, a detail, a linked document): the video still tells the
// whole story (style guide §10), so what a viewer could not follow is fixed in it, given a meaning, or asked about.
const ELSEWHERE = /\b(?:linked|supporting|full|written|separate|source-grounded)\s+(?:review|document|doc|report|notes|page|write-?up)\b|\b(?:the|its)\s+(?:guide|detail page|details? panel|appendix|documentation)\b|\bdetails\/[\w.-]+/i;

/**
 * One answer's problem, or null when it answers the finding. A `[plan]` finding is answered `plan: <what plan.md now
 * says>` (plan.md changed since the agents looked) or `ask: <the question put to the person>`, never kept, fixed in
 * the video or given a meaning (step 3: the web address raised three times and kept). `plan:` and `ask:` answer any
 * finding the author takes to be about the plan. A `kept` reason may not send the viewer elsewhere, and a `fixed`
 * answer needs its scene, or a scene it names, changed since the agents looked: an answer that leaves the video as
 * they saw it has not answered what they could not follow.
 */
export function answerProblem(videoDir, f, stamp = readStamp(videoDir)) {
  if (!f.answer) return "no answer";
  const words = f.answer.text.split(/\s+/).filter(Boolean).length;
  const sourceName = sourceNameOf(videoDir);
  if (f.plan && !["plan", "ask"].includes(f.answer.kind)) return `is about the plan: answer \`plan: <what ${sourceName} now says>\` or \`ask: <the question for the person>\``;
  if (f.answer.kind === "ask" && words < 3) return "ask, with no question";
  if (f.answer.kind === "plan") {
    const plan = planOf(videoDir);
    if (!plan) return `plan:, but this video has no ${sourceName}: answer \`ask: <the question for the person>\``;
    if (words < 2) return `plan:, but not what ${sourceName} now says`;
    if (stamp?.plan && hash(read(plan)) === stamp.plan) return `plan:, but ${sourceName} is unchanged since the agents looked`;
  }
  if (f.answer.kind === "kept" && words < 3) return "kept, with no reason";
  const away = f.answer.kind === "kept" && ELSEWHERE.exec(f.answer.text);
  if (away) return `kept, but the reason sends the viewer elsewhere ("${away[0]}"): the video has to make sense to someone who opens nothing (style guide §10): fix the scene, give the phrase a meaning, or ask`;
  if (f.answer.kind === "fixed" && words < 2) return "fixed, but not where";
  if (f.answer.kind === "fixed" && stamp?.scenes) {
    // the fix is in the finding's scene or in one the answer names: one of them differs from what the agents saw
    const named = [...new Set([f.scene, ...[...f.answer.text.matchAll(/\bscenes?\s+(\d+)/gi)].map((m) => Number(m[1]))].filter(Boolean))];
    if (named.length && !named.some((n) => changedSince(videoDir, stamp).includes(n)))
      return `fixed, but scene${named.length === 1 ? "" : "s"} ${named.join(", ")} ${named.length === 1 ? "is" : "are"} as the agents saw ${named.length === 1 ? "it" : "them"}: change its narration or frame, or answer it another way`;
  }
  if (f.answer.kind === "meaning" && f.phrase && !hasMeaning(videoDir, f.phrase)) return `a meaning, but "${f.phrase}" has none in the glossary or the storyboard's terms:`;
  return null;
}

/** Every finding of the current round, by role: { newcomer: [..] | null, designer: [..] | null } (null: no file yet). */
export function findingsOf(videoDir) {
  const d = feDir(videoDir), out = {};
  for (const role of Object.keys(rolesFor(videoDir))) { const p = join(d, `${role}.md`); out[role] = existsSync(p) ? parseFindings(read(p)) : null; }
  return out;
}
/** The stamp line a findings file carries (its first heading's `stamp <id>`), or null. */
export const fileStamp = (md) => (/\bstamp\s+([0-9a-f]{12})\b/.exec(String(md)) || [])[1] || null;
/** The role a findings file's first line names (`# Fresh eyes: designer · round 1 · stamp …`), or null. */
export const fileRole = (md) => (/^\s*#\s*Fresh eyes:\s*(newcomer|designer|checker)\b/i.exec(String(md).replace(/^\s*\n/, "")) || [])[1]?.toLowerCase() || null;

/**
 * This round's findings written anywhere but where they belong (the scratch-folder contract: an agent writes one
 * file, at the exact path its prompt names). Looked for in the repository's files git does not hold as they are
 * (untracked, or changed), and in every file under the video's folder, the ignored ones too (its earlier rounds and
 * builds aside): a file whose first line is a findings heading with this round's stamp. → [{ path, role }]
 */
export function strayFindings(videoDir, stamp) {
  if (!stamp?.id) return [];
  // every path by its real one, as git names its top (macOS's /private/var/… for a /var/… folder), so a file is the
  // same path from git and from the walk
  let dir; try { dir = realpathSync(videoDir); } catch { dir = resolve(videoDir); }
  const fe = feDir(dir), expected = new Set(Object.keys(rolesFor(dir)).map((r) => join(fe, `${r}.md`)));
  const files = new Set();
  const g = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: dir, encoding: "utf8" });
  if (g.status === 0) {
    const top = g.stdout.trim();
    const ls = spawnSync("git", ["ls-files", "-z", "--others", "--modified", "--exclude-standard"], { cwd: top, encoding: "utf8", maxBuffer: 64 << 20 });
    if (ls.status === 0) for (const f of ls.stdout.split("\0").filter(Boolean)) files.add(join(top, f));
  }
  const SKIP = new Set(["node_modules", "renders", "snapshots", "assets", "shots", ".git"]);
  const walk = (d, depth) => {
    let es = []; try { es = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of es) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (depth < 6 && !SKIP.has(e.name) && !(d === fe && /^(round|build)-\d+$/.test(e.name))) walk(p, depth + 1); }
      else if (e.isFile()) files.add(p);
    }
  };
  walk(dir, 0);
  const archived = (p) => { const r = relative(fe, p); return !r.startsWith("..") && /^(round|build)-\d+$/.test(r.split(sep)[0]); };
  const out = [];
  for (const p of files) {
    if (expected.has(p) || archived(p) || !/\.(md|txt|markdown)$|^[^.]+$/i.test(p.split(sep).pop())) continue;
    let st; try { st = statSync(p); } catch { continue; }
    if (!st.isFile() || st.size > 512 << 10) continue;
    const md = read(p), first = md.split("\n").find((l) => l.trim()) || "";
    const role = fileRole(first);
    if (role && fileStamp(first) === stamp.id) out.push({ path: p, role });
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}


/**
 * Where a video stands with fresh eyes, as `verify` reads it (step 2; D-225: every finding answered before
 * you see it). → { state, round, lines: [{ level: "fail"|"warn"|"ok", text }], unanswered, changed, outOfScope, stray, build }
 *   none      no run yet on this build (a warning: the first build comes before the first look; a rebuild's
 *             changed scenes wait for theirs)
 *   waiting   a brief written, a findings file not there yet (a warning)
 *   open      a finding with no answer, or a bad one, or this round's findings written somewhere else (a failure)
 *   stale     answered, but the scenes changed since the agents looked (a warning: one more look, on the scenes whose words changed)
 *   done      answered, and nothing changed since
 * A finding on a scene outside the round's scope (a rebuild's context scene) is out of scope: listed, not counted.
 */
export function freshEyesState(videoDir) {
  const said = (stamp) => saidSince(videoDir, stamp);
  const stamp = readStamp(videoDir), cur = buildOf(videoDir);
  const build = { id: cur.id, scope: cur.scope };
  // a low-depth video that is not a fact-checked explainer has no fresh eyes at all (#34)
  if (!Object.keys(rolesFor(videoDir, 1)).length) return { state: "done", round: 0, lines: [{ level: "ok", text: `fresh eyes: none at ${depthOf(videoDir)} depth (BRIEF.md's depth:)` }], unanswered: [], changed: [], said: [], outOfScope: [], stray: [], build };
  const R = roundsFor(videoDir);
  if (!stamp) return { state: "none", round: 0, lines: [{ level: "warn", text: `fresh eyes: not run yet${cur.scope ? ` on this build (scene${cur.scope.length === 1 ? "" : "s"} ${cur.scope.join(", ")} changed)` : ""}: run \`reelplanner fresh-eyes\` on it, launch ${Object.keys(rolesFor(videoDir, 1)).map((r) => `the ${r}`).join(" and ")} (each a fresh agent with no context of this conversation: the command prints how, per agent), and answer each finding` }], unanswered: [], changed: [], outOfScope: [], stray: [], build };
  const round = stamp.round || 1, f = findingsOf(videoDir), lines = [], unanswered = [], outOfScope = [];
  const sameBuild = buildOfStamp(stamp) === cur.id, nothingNew = !sameBuild && cur.scope && !cur.scope.length;
  const missing = Object.keys(rolesFor(videoDir)).filter((r) => !f[r]);
  const stray = strayFindings(videoDir, stamp), rel = (p) => relative(process.cwd(), p) || p;
  if (sameBuild) for (const r of missing) if (!stray.some((x) => x.role === r)) lines.push({ level: "warn", text: `fresh eyes, round ${round}: no ${r}.md yet (launch the ${r}, a fresh agent with no context of this conversation, with exactly the prompt from \`reelplanner fresh-eyes <video-dir> --prompt ${r}\`: it prints how, per agent)` });
  for (const r of Object.keys(rolesFor(videoDir)).filter((x) => f[x])) {
    const md = read(join(feDir(videoDir), `${r}.md`)), s = fileStamp(md), role = fileRole(md);
    if (role && role !== r) lines.push({ level: "fail", text: `fresh eyes: ${r}.md holds the ${role}'s findings (its first line says so): each agent writes its own file, at the path its prompt names` });
    if (s && s !== stamp.id) lines.push({ level: "warn", text: `fresh eyes: ${r}.md is from another run (stamp ${s}, this round's is ${stamp.id})` });
    for (const x of f[r]) {
      if (!inScope(stamp, x)) { outOfScope.push({ ...x, role: r }); continue; }
      const p = answerProblem(videoDir, x, stamp); if (p) unanswered.push({ ...x, role: r, problem: p });
    }
  }
  if (stray.length) lines.unshift({ level: "fail", text: `fresh eyes, round ${round}: findings written outside ${rel(feDir(videoDir))}/ (the agent writes one file, at the exact path its prompt names, and nothing else): ${stray.map((x) => `the ${x.role}'s at ${rel(x.path)}`).join("; ")}. They are not read from there: move each to ${rel(feDir(videoDir))}/<role>.md (or run that agent again), and delete the stray` });
  if (unanswered.length) lines.unshift({ level: "fail", text: `fresh eyes, round ${round}: ${unanswered.length} finding${unanswered.length === 1 ? "" : "s"} not answered: ${unanswered.map((x) => `${x.id}${x.scene ? ` (scene ${x.scene})` : ""} ${x.problem}`).join("; ")}. Answer each under it: \`- Answer: fixed: …\`, \`meaning: …\`, \`kept: <the reason>\`, or for one about the plan \`plan: …\` or \`ask: …\`` });
  if (outOfScope.length) lines.push({ level: "warn", text: `fresh eyes, round ${round}: ${outOfScope.map((x) => `${x.id} (scene ${x.scene})`).join(", ")} ${outOfScope.length === 1 ? "is on a scene" : "are on scenes"} this build did not change (context only): out of scope, not counted, no answer needed` });
  const changed = changedSince(videoDir, stamp), saidNow = said(stamp);
  const all = Object.values(f).filter(Boolean).flat().filter((x) => inScope(stamp, x));
  const scopeWord = Array.isArray(stamp.scope) ? ` (scene${stamp.scope.length === 1 ? "" : "s"} ${stamp.scope.join(", ")}, what ${round > 1 ? "the last round's answers" : "this build"} changed)` : "";
  if (!sameBuild) {
    // the set on disk is an earlier build's: the rebuild has not had its look yet (or changed nothing a viewer sees)
    if (nothingNew) lines.push({ level: "ok", text: `fresh eyes: nothing a viewer sees changed since the last build (plan-diff): its rounds stand` });
    else lines.push({ level: "warn", text: `fresh eyes: this build has not had fresh eyes yet (${cur.scope ? `scene${cur.scope.length === 1 ? "" : "s"} ${cur.scope.join(", ")} changed since the last build` : "every scene"}): run \`reelplanner fresh-eyes\` (round 1 of ${R} of this build; the last build's rounds go to fresh-eyes/build-${(buildsKept(videoDir).at(-1) || 0) + 1}/)` });
  } else if (!unanswered.length && !missing.length && !stray.length) {
    const by = (k) => all.filter((x) => x.answer?.kind === k).length;
    const tally = all.length ? `${all.length} finding${all.length === 1 ? "" : "s"} answered (${by("fixed")} fixed, ${by("meaning")} a meaning, ${by("kept")} kept${by("plan") ? `, ${by("plan")} into the plan` : ""}${by("ask") ? `, ${by("ask")} asked of you` : ""})` : "no findings";
    // a second round only on scenes whose words changed; a frame redrawn as the answers said needs no new look
    if (saidNow.length && round < R) lines.push({ level: "warn", text: `fresh eyes, round ${round}${scopeWord}: ${tally}; scene${saidNow.length === 1 ? "" : "s"} ${saidNow.join(", ")} say${saidNow.length === 1 ? "s" : ""} something new since they looked: one more round, on ${saidNow.length === 1 ? "it" : "those"} (round ${round + 1} of ${R})` });
    else if (round >= R && changed.length) lines.push({ level: "ok", text: `fresh eyes: ${R} round${R === 1 ? "" : "s"} done on this build, round ${round}'s ${tally}; what is left is said on the page ("Before you watch") and in the notification` });
    else lines.push({ level: "ok", text: `fresh eyes, round ${round}${scopeWord}: ${tally}${changed.length ? ` (scene${changed.length === 1 ? "" : "s"} ${changed.join(", ")} redrawn, ${changed.length === 1 ? "its" : "their"} words as they were: no further round)` : ""}` });
  }
  const state = unanswered.length || stray.length || lines.some((l) => l.level === "fail") ? "open" : !sameBuild ? (nothingNew ? "done" : "none") : missing.length ? "waiting" : saidNow.length && round < R ? "stale" : "done";
  return { state, round, lines, unanswered, changed, said: saidNow, outOfScope, stray, build };
}

/**
 * What is left for the viewer (step 2): after this build's third round, its findings the author kept as they are,
 * each with the reason (in scope only: a context scene's finding was never this build's). Earlier rounds leave
 * nothing: a fourth look is what they get instead; an earlier build's rounds (build-<n>/, or a set on disk from
 * before this rebuild) leave nothing either. `build` is the build to show it for (default: plan-map.json's).
 *
 * Only new ones (D-245, narrowing D-231): a finding the third round kept that an earlier round of this build had
 * already kept with the same reason is not listed again; it is in `again`, with the earlier finding it repeats,
 * and the page folds those into one line with their count. The rule is `sameKept` below.
 * → { rounds, left: [...], again: [{ ..., as: "round 2 · N5" }] } | null
 */
export function leftAfter(videoDir, { build } = {}) {
  const stamp = readStamp(videoDir); if (!stamp) return null;
  const cur = build ? { id: build.id, scope: build.scope } : buildOf(videoDir);
  if (buildOfStamp(stamp) !== cur.id && !(cur.scope && !cur.scope.length)) return null;
  const round = stamp.round || 1, f = findingsOf(videoDir);
  const done = round >= roundsFor(videoDir) || !saidSince(videoDir, stamp).length;
  // a question the author put to the person (ask:) is shown first, whatever the round (step 3)
  const asks = Object.entries(f).filter(([, xs]) => xs).flatMap(([role, xs]) => xs.filter((x) => x.answer?.kind === "ask" && inScope(stamp, x)).map((x) => ({ id: x.id, role, scene: x.scene, what: x.text, ask: x.answer.text })));
  const kept = done ? Object.entries(f).filter(([, xs]) => xs).flatMap(([role, xs]) => xs.filter((x) => x.answer?.kind === "kept" && inScope(stamp, x)).map((x) => ({ id: x.id, role, scene: x.scene, what: x.text, why: x.answer.text }))) : [];
  const earlier = kept.length ? keptEarlier(videoDir, stamp) : [], left = [], again = [];
  for (const x of kept) {
    const was = earlier.find((e) => sameKept(x, e));
    if (was) again.push({ ...x, as: `round ${was.round} · ${was.id}` }); else left.push(x);
  }
  return { rounds: round, left, again, asks };
}

// The words a finding's subject or an answer's reason is made of: lower case, the small words dropped, a plural's s.
const SMALL = new Set("a an the and or of to in on at is it its as by for with this that these those be are was were i my me not no but if then than so what which who how where when there here from into over under up down only each one two three all you your they them their do does did has have had can could would should will just also very more some such".split(" "));
export const wordsOf = (t) => new Set(String(t || "").toLowerCase().replace(/[’']s\b/g, "").split(/[^a-z0-9✓]+/).filter((w) => w && !SMALL.has(w)).map((w) => (w.length > 3 ? w.replace(/(?<!s)s$/, "") : w)));
/** How much of the shorter one's words the other has (0 to 1): the overlap coefficient. */
export function overlap(a, b) {
  const A = wordsOf(a), B = wordsOf(b); if (!A.size || !B.size) return 0;
  let n = 0; for (const w of A) if (B.has(w)) n++;
  return n / Math.min(A.size, B.size);
}
/** A finding's first quoted phrase ("…" or “…”, however long): the thing the agent points at. */
export const pointedAt = (what) => (/["“]([^"”]{2,240})["”]/.exec(String(what || "")) || [])[1] || null;
/**
 * One kept finding repeats another (D-245): the same role, the same scene, the same thing, and kept for the same
 * reason or near it. An agent looking again words its finding its own way, and the author answers it much as
 * before, so each is matched on its words (lower case, the small words dropped), not letter for letter:
 *   the thing   the first quoted phrase of each, two thirds of the shorter one's words in the other ("frame-lint …
 *               fails the two a program can see" is "frame-lint, a check the build runs, fails the two a program
 *               can see"; "rule 1: grey lines" is not "rule 5: a button"), or the whole lines, half the shorter
 *               one's words in the other (the same point quoted by another phrase: the three questions, by
 *               their chip or by the first of them)
 *   the reason  half the shorter one's words in the other
 * A finding an earlier round fixed, or gave a meaning, is never a repeat: kept now, it is new.
 */
export function sameKept(a, b) {
  if (a.role !== b.role || (a.scene || null) !== (b.scene || null)) return false;
  const pa = pointedAt(a.what), pb = pointedAt(b.what);
  const thing = (pa && pb && overlap(pa, pb) >= 2 / 3) || overlap(a.what, b.what) >= 1 / 2;
  return thing && overlap(a.why, b.why) >= 1 / 2;
}
/** This build's earlier rounds' kept findings (round-<n>/, the set's own build): [{ round, id, role, scene, what, why }]. */
export function keptEarlier(videoDir, stamp = readStamp(videoDir)) {
  const out = [];
  for (const r of roundsKept(videoDir)) {
    const d = join(feDir(videoDir), `round-${r}`), st = readJson(join(d, "stamp.json"));
    if (!st || buildOfStamp(st) !== buildOfStamp(stamp) || r >= (stamp?.round || 1)) continue;
    for (const role of Object.keys(ALL_ROLES)) {
      const p = join(d, `${role}.md`); if (!existsSync(p)) continue;
      for (const x of parseFindings(read(p))) if (x.answer?.kind === "kept" && inScope(st, x)) out.push({ round: r, id: x.id, role, scene: x.scene, what: x.text, why: x.answer.text });
    }
  }
  return out;
}

/** The earlier rounds' folders, in order: [round numbers]. */
export const roundsKept = (videoDir) => { const d = feDir(videoDir); return existsSync(d) ? readdirSync(d).map((x) => Number((/^round-(\d+)$/.exec(x) || [])[1])).filter(Boolean).sort((a, b) => a - b) : []; };
