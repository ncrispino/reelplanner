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
// last set's, `fresh-eyes` moves that set to build-<n>/ and starts at round 1: the three rounds are per build.
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

export const DIR = "fresh-eyes";
export const ROUNDS = 3;
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
/** The fresh agents a video gets: the newcomer and the designer, and the checker for a fact-checked explainer. */
export const rolesFor = (videoDir) => (factChecked(videoDir) ? { ...ROLES, ...CHECKER } : ROLES);
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
  return { id: hash(JSON.stringify(scenes)), scenes };
}

/** The scenes whose narration or frame changed since the stamp (or were added or removed). */
export function changedSince(videoDir, stamp) {
  if (!stamp?.scenes) return [];
  const now = stampOf(videoDir).scenes, was = new Map(stamp.scenes.map((s) => [s.scene, s]));
  const out = now.filter((s) => { const w = was.get(s.scene); return !w || w.narration !== s.narration || w.frame !== s.frame; }).map((s) => s.scene);
  for (const s of stamp.scenes) if (!now.some((x) => x.scene === s.scene)) out.push(s.scene);
  return [...new Set(out)].sort((a, b) => a - b);
}

const ANSWER = /^\s+[-*]\s*\**answer\**\s*:?\**\s*(fixed|meaning|kept)\b\**\s*[:,;.—–-]?\s*(.*)$/i;
/**
 * A findings file's findings: [{ id, scene, phrase, text, answer: { kind, text } | null }]. `phrase` is the first
 * quoted phrase of the finding ("…" or “…”), the thing a `meaning` answer gives a meaning to.
 */
export function parseFindings(md) {
  const out = [];
  let cur = null;
  for (const line of String(md).replace(/\r\n/g, "\n").split("\n")) {
    const m = /^[-*]\s+\**([NGF]\d+)\**\b\s*(.*)$/.exec(line);
    if (m) {
      const rest = m[2].replace(/^[\s·:,.—–-]+/, "");
      cur = { id: m[1], scene: Number((/\bscenes?\s+(\d+)/i.exec(rest) || [])[1]) || null, phrase: (/["“]([^"”]{2,80})["”]/.exec(rest) || [])[1] || null, text: rest.trim(), answer: null };
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

/** One answer's problem, or null when it answers the finding. */
export function answerProblem(videoDir, f) {
  if (!f.answer) return "no answer";
  const words = f.answer.text.split(/\s+/).filter(Boolean).length;
  if (f.answer.kind === "kept" && words < 3) return "kept, with no reason";
  if (f.answer.kind === "fixed" && words < 2) return "fixed, but not where";
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
 *   stale     answered, but the scenes changed since the agents looked (a warning: look again, up to three rounds)
 *   done      answered, and nothing changed since
 * A finding on a scene outside the round's scope (a rebuild's context scene) is out of scope: listed, not counted.
 */
export function freshEyesState(videoDir) {
  const stamp = readStamp(videoDir), cur = buildOf(videoDir);
  const build = { id: cur.id, scope: cur.scope };
  if (!stamp) return { state: "none", round: 0, lines: [{ level: "warn", text: `fresh eyes: not run yet${cur.scope ? ` on this build (scene${cur.scope.length === 1 ? "" : "s"} ${cur.scope.join(", ")} changed)` : ""}: run \`reelplanning fresh-eyes\` on it, launch the newcomer and the designer (each a fresh agent with no context of this conversation: the command prints how, per agent), and answer each finding` }], unanswered: [], changed: [], outOfScope: [], stray: [], build };
  const round = stamp.round || 1, f = findingsOf(videoDir), lines = [], unanswered = [], outOfScope = [];
  const sameBuild = buildOfStamp(stamp) === cur.id, nothingNew = !sameBuild && cur.scope && !cur.scope.length;
  const missing = Object.keys(rolesFor(videoDir)).filter((r) => !f[r]);
  const stray = strayFindings(videoDir, stamp), rel = (p) => relative(process.cwd(), p) || p;
  if (sameBuild) for (const r of missing) if (!stray.some((x) => x.role === r)) lines.push({ level: "warn", text: `fresh eyes, round ${round}: no ${r}.md yet (launch the ${r}, a fresh agent with no context of this conversation, with exactly the prompt from \`reelplanning fresh-eyes <video-dir> --prompt ${r}\`: it prints how, per agent)` });
  for (const r of Object.keys(rolesFor(videoDir)).filter((x) => f[x])) {
    const md = read(join(feDir(videoDir), `${r}.md`)), s = fileStamp(md), role = fileRole(md);
    if (role && role !== r) lines.push({ level: "fail", text: `fresh eyes: ${r}.md holds the ${role}'s findings (its first line says so): each agent writes its own file, at the path its prompt names` });
    if (s && s !== stamp.id) lines.push({ level: "warn", text: `fresh eyes: ${r}.md is from another run (stamp ${s}, this round's is ${stamp.id})` });
    for (const x of f[r]) {
      if (!inScope(stamp, x)) { outOfScope.push({ ...x, role: r }); continue; }
      const p = answerProblem(videoDir, x); if (p) unanswered.push({ ...x, role: r, problem: p });
    }
  }
  if (stray.length) lines.unshift({ level: "fail", text: `fresh eyes, round ${round}: findings written outside ${rel(feDir(videoDir))}/ (the agent writes one file, at the exact path its prompt names, and nothing else): ${stray.map((x) => `the ${x.role}'s at ${rel(x.path)}`).join("; ")}. They are not read from there: move each to ${rel(feDir(videoDir))}/<role>.md (or run that agent again), and delete the stray` });
  if (unanswered.length) lines.unshift({ level: "fail", text: `fresh eyes, round ${round}: ${unanswered.length} finding${unanswered.length === 1 ? "" : "s"} not answered: ${unanswered.map((x) => `${x.id}${x.scene ? ` (scene ${x.scene})` : ""} ${x.problem}`).join("; ")}. Answer each under it: \`- Answer: fixed: …\`, \`meaning: …\` or \`kept: <the reason>\`` });
  if (outOfScope.length) lines.push({ level: "warn", text: `fresh eyes, round ${round}: ${outOfScope.map((x) => `${x.id} (scene ${x.scene})`).join(", ")} ${outOfScope.length === 1 ? "is on a scene" : "are on scenes"} this build did not change (context only): out of scope, not counted, no answer needed` });
  const changed = changedSince(videoDir, stamp);
  const all = Object.values(f).filter(Boolean).flat().filter((x) => inScope(stamp, x));
  const scopeWord = Array.isArray(stamp.scope) ? ` (scene${stamp.scope.length === 1 ? "" : "s"} ${stamp.scope.join(", ")}, what this build changed)` : "";
  if (!sameBuild) {
    // the set on disk is an earlier build's: the rebuild has not had its look yet (or changed nothing a viewer sees)
    if (nothingNew) lines.push({ level: "ok", text: `fresh eyes: nothing a viewer sees changed since the last build (plan-diff): its rounds stand` });
    else lines.push({ level: "warn", text: `fresh eyes: this build has not had fresh eyes yet (${cur.scope ? `scene${cur.scope.length === 1 ? "" : "s"} ${cur.scope.join(", ")} changed since the last build` : "every scene"}): run \`reelplanning fresh-eyes\` (round 1 of ${ROUNDS} of this build; the last build's rounds go to fresh-eyes/build-${(buildsKept(videoDir).at(-1) || 0) + 1}/)` });
  } else if (!unanswered.length && !missing.length && !stray.length) {
    const by = (k) => all.filter((x) => x.answer?.kind === k).length;
    const tally = all.length ? `${all.length} finding${all.length === 1 ? "" : "s"} answered (${by("fixed")} fixed, ${by("meaning")} a meaning, ${by("kept")} kept)` : "no findings";
    if (changed.length && round < ROUNDS) lines.push({ level: "warn", text: `fresh eyes, round ${round}${scopeWord}: ${tally}; scene${changed.length === 1 ? "" : "s"} ${changed.join(", ")} changed since they looked: run fresh eyes again (round ${round + 1} of ${ROUNDS})` });
    else if (changed.length) lines.push({ level: "ok", text: `fresh eyes: ${ROUNDS} rounds done on this build, round ${round}'s ${tally}; what is left is said on the page ("Before you watch") and in the notification` });
    else lines.push({ level: "ok", text: `fresh eyes, round ${round}${scopeWord}: ${tally}` });
  }
  const state = unanswered.length || stray.length || lines.some((l) => l.level === "fail") ? "open" : !sameBuild ? (nothingNew ? "done" : "none") : missing.length ? "waiting" : changed.length && round < ROUNDS ? "stale" : "done";
  return { state, round, lines, unanswered, changed, outOfScope, stray, build };
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
  const kept = round >= ROUNDS ? Object.entries(f).filter(([, xs]) => xs).flatMap(([role, xs]) => xs.filter((x) => x.answer?.kind === "kept" && inScope(stamp, x)).map((x) => ({ id: x.id, role, scene: x.scene, what: x.text, why: x.answer.text }))) : [];
  const earlier = kept.length ? keptEarlier(videoDir, stamp) : [], left = [], again = [];
  for (const x of kept) {
    const was = earlier.find((e) => sameKept(x, e));
    if (was) again.push({ ...x, as: `round ${was.round} · ${was.id}` }); else left.push(x);
  }
  return { rounds: round, left, again };
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
    for (const role of Object.keys(rolesFor(videoDir))) {
      const p = join(d, `${role}.md`); if (!existsSync(p)) continue;
      for (const x of parseFindings(read(p))) if (x.answer?.kind === "kept" && inScope(st, x)) out.push({ round: r, id: x.id, role, scene: x.scene, what: x.text, why: x.answer.text });
    }
  }
  return out;
}

/** The earlier rounds' folders, in order: [round numbers]. */
export const roundsKept = (videoDir) => { const d = feDir(videoDir); return existsSync(d) ? readdirSync(d).map((x) => Number((/^round-(\d+)$/.exec(x) || [])[1])).filter(Boolean).sort((a, b) => a - b) : []; };
