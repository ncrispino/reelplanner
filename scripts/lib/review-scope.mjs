// What a review asks for, sorted, and the one short file that says it: reviews/<id>.md, "what to act on"
// (D-085). `reel record` writes it next to the review.
//
// reviseScope — the steps some words landed on, with the words. A pick the video already offered is
//   fully captured by the ledger, so a decision with nothing written on it sends no step to the revise.
//   Words are: a comment, a note on an answer, "Explain this more", a quick check missed or disagreed
//   with (a missed one the reviewer asked, at Finish, to have explained again is an "explain this more"
//   on its step), and a rewind or slow-down (not words, but a step that did not land).
// walkthroughScope — a walkthrough review's verdicts. An accepted call joins the ledger (`reel record`);
//   a flagged call, or one answered in the reviewer's own words, is a fix with those words as its
//   instruction, and a comment rides along only when it was made on that call's beat (or, with no
//   frame, inside the beat's time); a comment on the step at large stays with the step. A fix whose
//   words reach an active decision (they name its id, or every distinctive word of one of its options,
//   two at least) is `escalate`: it would supersede something decided, which is a plan's job. A quick
//   check the reviewer disagreed with is a fix too. Calls this video asked that no walkthrough review of
//   the plan has judged (this one, the earlier ones, the ledger) are named.
//
// actOnMarkdown says first, in one line, what the verdict means for the work (SKILL.md): an approved
//   plan's comments go into plan.md's steps as text, with no new plan video; changes requested revise,
//   rebuild the touched beats and show it again. An accepted walkthrough's fixes are made and logged
//   with no new video; changes requested fix, rebuild the touched beats and show it again.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseCalls, splitTags, tagsOf } from "./autonomy.mjs";
import { verdictOf, asksMore, askedWords } from "./reviews.mjs";
import { inForce } from "./ledger.mjs";

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
/** The plan map a review's definitions (questions, checks, calls) come from. */
export const mapFor = (planDir, kind) => { for (const f of kind === "walkthrough" ? ["walkthrough-video", "video"] : ["video"]) { const m = readJson(join(planDir, f, "plan-map.json")); if (m) return m; } return null; };
const moved = (m) => m.kind === "rewind" ? `went back to ${m.t}s${m.from != null ? ` from ${m.from}s` : ""}` : `slowed to ${m.rate}× at ${m.t}s`;

// ── a suggested edit (the plan guide, step 4; D-229): the reviewer's words for the plan's, applied exactly ──
const BLOCKS = { case: "Cases", cases: "Cases", trace: "Cases", interface: "Interface", example: "Example", decisions: "Decisions in force", built: "Built", recommendation: "Question", option: "Question" };
/** Every suggested edit a review carries: its `edits`, and each note that carries an `edit` (the guide's box).
 *  [{ step, block, before, after, note, anchor, id }] */
export function editsOf(review) {
  const out = [];
  for (const e of Array.isArray(review?.edits) ? review.edits : []) if (e && String(e.before || "").trim() && String(e.after ?? "").trim() !== String(e.before).trim()) out.push({ step: e.step ?? null, block: e.block || null, before: String(e.before), after: String(e.after ?? ""), note: e.note || null, anchor: e.anchor || null, id: e.id || null });
  for (const a of review?.annotations || []) {
    if (!a?.edit || !String(a.edit.before || "").trim()) continue;
    const anchor = String(a.detail?.anchor || ""), m = /\bstep (\d+)/i.exec(anchor), q = /\bquestion (\d+)/i.exec(anchor);
    const word = (/·\s*(cases?|trace|interface|example|decisions|built|recommendation|option)\b/i.exec(anchor) || [])[1]?.toLowerCase();
    out.push({ step: m ? +m[1] : a.plan?.step ?? null, block: q ? `Question ${q[1]}` : word ? BLOCKS[word] : m ? "Text" : "Plan", before: String(a.edit.before), after: String(a.edit.after ?? ""), note: null, anchor, id: a.id || null });
  }
  return out;
}
/** The scenes whose words (narration) or frame show an edit's `before`: the only ones a revise rebuilds for it. */
export function scenesSaying(before, { map = null, videoDir = null } = {}) {
  const norm = (t) => String(t || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").toLowerCase();
  const b = norm(before).trim(); if (b.length < 3) return [];
  return (map?.frames || []).filter((f) => {
    if (norm(f.narration).includes(b)) return true;
    if (!videoDir || !f.compositionId) return false;
    const file = join(videoDir, "compositions", "frames", `${f.compositionId}.html`);
    return existsSync(file) && norm(readFileSync(file, "utf8")).includes(b);
  }).map((f) => f.index);
}

/** { steps: [{ step, reasons }], componentOnly, decidedNoRewrite, unplaced } */
export function reviseScope(ann, { map = null } = {}) {
  const byStep = new Map(), add = (step, r) => { if (!byStep.has(step)) byStep.set(step, []); byStep.get(step).push(r); };
  const componentOnly = [];
  for (const a of (ann.annotations || []).filter((x) => (x.comment || "").trim())) {
    // a comment inside a part of the guide (a detail) carries where it points: the page and the anchor
    // (a note highlighted in the guide, via "guide", also says where in it: its section and step, packages/player/guide-review.js)
    const d = a.detail?.name ? { name: a.detail.name, anchor: a.detail.anchor || null, text: a.detail.text || null, ...(a.via === "guide" && a.detail.where ? { where: a.detail.where } : {}) } : null;
    const reason = { id: a.id, kind: a.kind, t: a.t, comment: a.comment, about: a.about || (d ? (d.where ? `the guide, ${d.where}` : `detail ${d.name}${d.anchor ? ` at ${d.anchor}` : ""}`) : null), component: a.plan?.component || null, frame: a.frame?.title || null, ...(d ? { detail: d } : {}), ...(a.open ? { open: true } : {}) };
    if (a.plan?.step == null) componentOnly.push(reason); else add(a.plan.step, reason);
  }
  // A note on an answer is words too: it clarifies the pick, and may ask for the step to say more.
  for (const d of ann.decisions || []) if ((d.note || "").trim() && d.planStep != null && !asksMore(d))
    add(d.planStep, { id: `note-${d.id}`, kind: "answer-note", t: d.t ?? null, comment: d.note.trim(), about: `note on ${d.id}: ${d.label}`, component: null });
  // "Explain this more": the step is rewritten to explain the question better, and it is asked again.
  for (const d of ann.decisions || []) if (asksMore(d) && d.planStep != null)
    add(d.planStep, { id: `unclear-${d.id}`, kind: "unclear", t: d.t ?? null, comment: askedWords(d) || "The reviewer asked for this question to be explained more before answering.", about: `question ${d.id}: explain it with examples, then ask again`, component: null });
  // Where the reviewer rewound or slowed down (D-005): the step goes to the revise, to be said more plainly.
  const hard = new Map();
  for (const m of (ann.watch?.moments || []).filter((x) => x.planStep != null)) { if (!hard.has(m.planStep)) hard.set(m.planStep, []); hard.get(m.planStep).push(m); }
  for (const [step, list] of hard) add(step, { id: `hard-${step}`, kind: "hard-to-follow", t: list[0].t, comment: `Hard to follow: ${list.map(moved).join("; ")}. Say this step more plainly; do not change what it decides.`, about: null, component: null });
  const unplaced = (ann.watch?.moments || []).filter((x) => x.planStep == null);
  // A missed quick check: the reviewer watched the step and still got it wrong. One they disagreed with
  // ("Expected something else? Say how it should work") is a comment in their words: the step may be
  // wrong, not just unclear, so it is never also sent as "explain it so that answer is obvious".
  for (const q of (ann.quizzes || []).filter((x) => x.correct === false || (x.note || "").trim())) {
    const def = (map?.quizzes || []).find((x) => x.id === q.id) || {};
    const step = def.planStep ?? q.planStep; if (step == null) continue;
    const said = q.answer === "own" ? q.own || "" : (def.options || []).find((o) => o.id === q.answer)?.label || q.answer, right = (def.options || []).find((o) => o.id === def.answer)?.label || def.answer;
    const text = (q.note || "").trim();
    // missed, and at Finish the reviewer asked for it to be explained again (the player's confusion guard):
    // the same "explain this more" a plan question's button sends, for the step the check was about
    if (q.unclear && !text) { add(step, { id: `unclear-${q.id}`, kind: "unclear", t: q.t ?? null, comment: `The reviewer missed the quick check "${def.question || q.id}" (answered "${said}", the answer is "${right}") and asked for it to be explained again. Explain the step's main idea with a worked example, then ask the check again.`, about: `quick check ${q.id}: explain it again, with an example`, component: null }); continue; }
    if (text) add(step, { id: `quiz-note-${q.id}`, kind: "quiz-disagree", quiz: q.id, answer: said, expected: right ?? null, text, t: q.t ?? null, comment: `The reviewer disagreed with the quick check "${def.question || q.id}" (they answered "${said}", the video's answer is "${right}"): ${text}`, about: `quick check ${q.id}`, component: null });
    else add(step, { id: `quiz-${q.id}`, kind: "quiz-missed", t: q.t ?? null, comment: `Quick check missed: "${def.question || q.id}" — answered "${said}", the answer is "${right}". Explain this step so that answer is obvious.`, about: null, component: null });
  }
  const steps = [...byStep.entries()].sort((a, b) => a[0] - b[0]).map(([step, reasons]) => ({ step, reasons }));
  const worded = new Set(steps.map((s) => s.step));
  const decidedNoRewrite = (ann.decisions || []).filter((d) => d.option !== "own" && !asksMore(d) && !worded.has(d.planStep)).map((d) => ({ id: d.id, planStep: d.planStep, label: d.label }));
  return { steps, componentOnly, decidedNoRewrite, unplaced };
}

// Words that say nothing about which decision a comment is about.
const STOP = new Set(("about after again also because been before being both could does doing done each either even every from have here "
  + "into just like make more most much must neither none only other over same should some such than that their them then there these they "
  + "this those under very what when where which while will with would your").split(" "));
const stem = (w) => (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
/** The distinctive words of a text: four letters or more, not a stop word, plural folded. */
export const distinctive = (t) => new Set((String(t || "").toLowerCase().match(/[a-z0-9]+(?:-[a-z0-9]+)*/g) || []).map(stem).filter((w) => w.length >= 4 && !STOP.has(w)));
/**
 * The active decisions some words reach: they name its id (D-005, D005, D-5), or they carry every
 * distinctive word of one of its options, when that option has two or more. A loose word ("both",
 * "local") is not enough, and neither are the question's words.
 */
export function reaches(text, active) {
  const w = distinctive(text), raw = String(text || "");
  return active.filter((d) => {
    const n = /^D-(\d+)$/i.exec(String(d.id || ""));
    if (n && new RegExp(`\\bD-?0*${Number(n[1])}\\b`, "i").test(raw)) return true;
    return (d.options || []).some((o) => { const k = distinctive(o.label); return k.size >= 2 && [...k].every((x) => w.has(x)); });
  });
}

/** Each call's beat in the video it was asked in: id → { frame, start, end } (a grouped call: the group's beat). */
function callBeats(map) {
  const frames = Object.fromEntries((map?.frames || []).map((f) => [f.index, f]));
  const beat = (i) => { const f = frames[i]; return f ? { frame: i, start: f.start ?? null, end: f.start != null && f.durationSeconds != null ? f.start + f.durationSeconds : null } : { frame: i, start: null, end: null }; };
  const out = {};
  for (const a of map?.autonomy || []) if (a.frameIndex != null) out[String(a.id).toLowerCase()] = beat(a.frameIndex);
  for (const g of map?.autonomyGroups || []) if (g.frameIndex != null) for (const id of g.ids || []) out[String(id).toLowerCase()] = beat(g.frameIndex);
  return out;
}

/**
 * { accepted, listed, fixes, unjudged }. `wt` is walkthrough.md's text; `ledger` the decisions before this review;
 * `earlier` the plan's other walkthrough reviews (their calls count as judged); `planName` the plan's
 * folder name (its ledger entries count too).
 */
export function walkthroughScope(ann, { wt = "", ledger = [], map = null, earlier = [], planName = null } = {}) {
  // the walkthrough's own autonomy table: | id | step | chose [tags] | instead of | why | check |
  const rows = Object.fromEntries(parseCalls(wt).filter((r) => r.kind !== "small").map((r) => [r.key, r]));
  const active = ledger.filter(inForce);   // a rule folded into spec.md too
  const verdicts = ann.autonomy || [];
  const notes = (ann.annotations || []).filter((a) => (a.comment || "").trim() && a.kind !== "approve");
  const auto = (a, v) => a.kind === "flag" && a.comment.trim() === `Flagged: ${v.chose}`;   // the player's own label, not the reviewer's words
  const NEAR = 15;   // seconds: with no map to place the call's beat, a note this soon after the verdict is about it
  const reach = (words) => reaches(words, active);
  const beats = callBeats(map);
  // Is this comment about this call? It quotes the call ("On what the agent decided: <the call>"), or was
  // made on its beat (the frame the player recorded; with no frame, inside the beat's time), or it is on
  // no step at all and came right after the verdict (typed as the video played on). A comment elsewhere
  // in the step is about the step, and stays there.
  const about = (a, c, v) => {
    const b = beats[c.id.toLowerCase()];
    // a note highlighted in the guide was made on the words, not on a beat: it is about the call only where it is on it
    if (a.via === "guide") return new RegExp(`\\bchoice ${c.id}\\b`, "i").test(String(a.detail?.anchor || "")) ? "about" : null;
    if (c.chose && String(a.about || "").includes(c.chose)) return "about";
    if (b && a.frame?.index === b.frame) return "beat";
    if (b && a.frame?.index == null && b.start != null && b.end != null && a.t >= b.start && a.t <= Math.max(b.end, v.t ?? b.end)) return "time";
    if (a.plan?.step == null && v.t != null && a.t >= v.t && a.t - v.t <= NEAR) return "time";
    if (!b && a.plan?.step != null && a.plan.step === c.step && v.t != null && a.t >= v.t && a.t - v.t <= NEAR) return "time";   // no map to place the beat
    return null;
  };
  // each call carries its tags (step 8): `reel record` keeps them in the ledger with the verdict, and `reel stops` counts them
  const call = (v) => { const r = rows[String(v.id).toLowerCase()] || {}; return { id: String(v.id).toUpperCase(), step: v.planStep ?? r.step ?? null, chose: splitTags(v.chose || r.chose || "").chose, insteadOf: r.insteadOf || "", why: r.why || "", check: r.check || "", tags: tagsOf(v.id, r.tags || []) }; };
  const accepted = verdicts.filter((v) => v.verdict === "accept").map(call);
  // the list (walkthroughs-that-help step 2, D-221): a call on it the reviewer did not flag is listed, not
  // judged; Approve takes the rest, so on an approved review a listed call never reached is listed too
  const onList = new Set((map?.autonomyGroups || []).filter((g) => g.list).flatMap((g) => (g.ids || []).map((x) => String(x).toLowerCase())));
  const given = new Set(verdicts.map((v) => String(v.id).toLowerCase()));
  const listed = [...verdicts.filter((v) => v.verdict === "listed"),
    ...(verdictOf(ann) === "approve" ? [...onList].filter((id) => !given.has(id)).map((id) => ({ id, verdict: "listed", planStep: rows[id]?.step ?? null })) : [])].map(call);
  const fixes = verdicts.filter((v) => v.verdict === "flag" || v.verdict === "own").map((v) => {
    const c = call(v);
    const own = v.verdict === "own" && (v.own || "").trim() ? [{ id: `${c.id}-own`, kind: "own", t: v.t, comment: v.own.trim(), anchoredBy: "verdict" }] : [];
    // the player files own words as a note on the call too: the same words, said once
    const covers = notes.filter((a) => own.some((o) => o.comment === a.comment.trim())).map((a) => a.id);
    const said = own.concat(notes.filter((a) => !auto(a, c) && !covers.includes(a.id)).map((a) => ({ a, by: about(a, c, v) })).filter((x) => x.by)
      .map(({ a, by }) => ({ id: a.id, kind: a.kind, t: a.t, comment: a.comment, anchoredBy: by })));
    const hit = reach(said.map((a) => a.comment).join("\n"));
    return { ...c, verdict: v.verdict, comments: said, covers, escalate: hit.length > 0, reaches: hit.map((d) => `${d.id} (${d.question} → ${d.chosen})`) };
  });
  // A quick check the reviewer disagreed with: the walkthrough says the code works one way, the reviewer
  // expected another, and their words are the instruction. Its definition is in the walkthrough video's map.
  for (const q of (ann.quizzes || []).filter((x) => (x.note || "").trim())) {
    const def = (map?.quizzes || []).find((x) => String(x.id).toLowerCase() === String(q.id).toLowerCase()) || {};
    const label = (id) => (def.options || []).find((o) => o.id === id)?.label || id || "";
    const text = q.note.trim(), said = q.answer === "own" ? (q.own || "").trim() : label(q.answer), expected = label(def.answer);
    const hit = reach(text);
    fixes.push({ id: String(q.id).toUpperCase(), step: def.planStep ?? q.planStep ?? null, kind: "quiz-disagree", quiz: q.id, question: def.question || "", chose: expected, insteadOf: "", why: def.explain || "", check: "",
      verdict: "quiz-disagree", answer: said, expected, comments: [{ id: `${String(q.id).toUpperCase()}-disagree`, kind: "quiz-disagree", t: q.t ?? def.at ?? null, comment: text, anchoredBy: "quiz" }],
      covers: [], escalate: hit.length > 0, reaches: hit.map((d) => `${d.id} (${d.question} → ${d.chosen})`) });
  }
  // Never judged: a call this video asked (its map; else the walkthrough's table) that no walkthrough
  // review of this plan has judged, this one or an earlier one, nor the ledger holds a verdict on.
  const judged = new Set([...verdicts, ...listed, ...earlier.flatMap((r) => r?.autonomy || [])].map((v) => String(v.id).toLowerCase()));
  for (const d of ledger) if (d.kind === "autonomy" && (!planName || d.plan === planName)) judged.add(String(d.questionId || "").replace(/^autonomy-/, "").toLowerCase());
  const asked = map ? [...new Set([...(map.autonomy || []).map((a) => String(a.id).toLowerCase()), ...(map.autonomyGroups || []).flatMap((g) => (g.ids || []).map((x) => String(x).toLowerCase()))])] : Object.keys(rows);
  const info = (id) => rows[id] || (map?.autonomy || []).find((a) => String(a.id).toLowerCase() === id) || {};
  const unjudged = asked.filter((id) => !judged.has(id)).map((id) => ({ id: id.toUpperCase(), step: info(id).step ?? info(id).planStep ?? null, chose: splitTags(info(id).chose || "").chose }));
  return { accepted, listed, fixes, unjudged };
}

// ---------- reviews/<id>.md ----------
const clock = (t) => { if (t == null || Number.isNaN(Number(t))) return "?"; const s = Math.max(0, Math.round(Number(t))); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const q = (s) => `"${String(s).replace(/\s*\n+\s*/g, " ").trim()}"`;
const when = (iso) => (iso ? String(iso).replace("T", " ").replace(/:\d\d(\.\d+)?Z$/, " UTC") : "");

/**
 * reviews/<id>.md: what to act on, and nothing the plan, walkthrough.md or the ledger already says.
 * `ledger` is the ledger after `reel record`, to name the entries this review made.
 */
/** What the verdict means for the work, in one line (SKILL.md, "After a plan review" and "Implement, check, walk through, fix"). */
export function verdictLine(kind, verdict) {
  if (kind === "walkthrough") return verdict === "approve" ? "**Accepted:** make the fixes below and log them in `walkthrough.md`; no new walkthrough video."
    : verdict === "changes" ? "**Changes requested:** make the fixes below, rebuild the beats they touch, and show the walkthrough again."
    : "**No verdict:** the reviewer did not finish; ask before acting.";
  return verdict === "approve" ? "**Approved:** fold the comments below into `plan.md`'s steps as text, then implement; no new plan video."
    : verdict === "changes" ? "**Changes requested:** revise the steps below, rebuild the beats they touch, and show the plan video again."
    : "**No verdict:** the reviewer did not finish; ask before acting.";
}

export function actOnMarkdown({ id, kind, review, planName, map = null, wt = "", ledgerBefore = [], ledger = [], earlier = [], videoDir = null }) {
  const verdict = verdictOf(review), rs = reviseScope(review, { map });
  const ws = kind === "walkthrough" ? walkthroughScope(review, { wt, ledger: ledgerBefore, map, earlier, planName }) : null;
  const L = [];
  const status = verdict === "approve" ? "approved" : verdict === "changes" ? "changes requested" : "not finished (no verdict)";
  L.push(`# ${kind === "walkthrough" ? "Walkthrough" : "Plan"} review · ${when(review.submittedAt || review.exportedAt) || id} · ${status}`, "");
  L.push(verdictLine(kind, verdict), "");
  const n = (k, w, tail = "") => (k ? `${k} ${w}${k === 1 ? "" : "s"}${tail}` : "");
  const counts = ([n((review.decisions || []).length, "decision"), n((review.autonomy || []).length, "call", " judged"), n((review.quizzes || []).length, "quick check"),
    n((review.annotations || []).filter((a) => a.kind !== "approve").length, "mark")].filter(Boolean).join(", ") || "nothing marked") + (review.checks === "off" ? ", with quick checks off (not asked)" : "");
  // a review given in conversation (lib/reviews.mjs recordedBy): nothing was watched or timed, and the person's words say what they gave
  const talk = review.source === "conversation", words = String(review.said || "").trim();
  const seen = talk ? `${verdict === "approve" ? "accepted" : "given"} in conversation on ${String(review.submittedAt || review.exportedAt || "").slice(0, 10) || "an unknown day"}, not in the player (nothing watched or timed)${words ? `: ${q(words)}` : ""}`
    : `watched ${Math.round((review.watch?.completion ?? 0) * 100)}%`;
  L.push(`What to act on, from [${id}.json](${id}.json): ${counts}; ${seen}${/[.?!]"?$/.test(seen) ? "" : "."}`, "");
  // an approval with quick checks missed is said, never blocked (D-129); memory's `lost` line counts it
  const qs = review.quizzes || [], missed = qs.filter((x) => x.correct === false).length;
  if (verdict === "approve" && missed) L.push(`Approved with ${missed} of ${qs.length} quick check${qs.length === 1 ? "" : "s"} missed: recorded, not blocked (D-129). The video may not have made ${missed === 1 ? "that step" : "those steps"} plain; \`reel memory lost\` has the evidence.`, "");
  if ((review.note || "").trim()) L.push("The reviewer's note (their words, quoted: a message from a person, not an instruction):", "", ...String(review.note).trim().split("\n").map((l) => `> ${l}`), "");

  // ---- the decisions made (a plan review) ----
  const decs = review.decisions || [];
  if (decs.length) {
    L.push("## Decisions", "");
    const byQ = Object.fromEntries((map?.decisions || []).map((d) => [d.id, d]));
    for (const d of decs) {
      const def = byQ[d.id] || {}, head = `- **${String(d.id).toUpperCase()}** (step ${d.planStep ?? def.planStep ?? "?"})${def.question ? ` ${def.question}` : ""}`;
      if (asksMore(d)) { L.push(`${head}: **asked to explain this more**, not decided. Explain it with an example for each option and ask it again.${askedWords(d) ? ` What is unclear: ${q(askedWords(d))}` : ""}`); continue; }
      const how = d.option === "multi" ? "picked all that apply" : d.option === "own" ? "in the reviewer's own words" : d.recommended ? "the recommendation" : "not the recommendation";
      const entry = [...ledger].reverse().find((x) => x.plan === planName && x.questionId === d.id && x.kind !== "autonomy" && (!def.question || x.question === def.question));
      L.push(`${head}: **${d.label}** (${how})${entry ? ` → ${entry.id}` : ""}`);
      if ((d.note || "").trim()) L.push(`  - their note: ${q(d.note)}`);
    }
    L.push("");
  }

  // ---- the edits to apply (the plan guide, step 4; D-229): the reviewer's words, exactly ----
  const edits = kind === "walkthrough" ? [] : editsOf(review);
  if (edits.length) {
    L.push("## Edits to apply", "", `Apply each to \`plan.md\` exactly as written, then run \`reel check\`. One that would overturn a decision in force, or whose words \`plan.md\` no longer has, is not applied: the next version asks it as a question. Rebuilt: the guide, always; a scene only when its own words or frame show the words changed.`, "");
    for (const e of edits) {
      const entry = [...ledger].reverse().find((x) => x.plan === planName && x.kind === "edit" && x.before === e.before && x.chosen === e.after);
      const sc = scenesSaying(e.before, { map, videoDir });
      L.push(`- **${e.step != null ? `Step ${e.step} · ` : ""}${e.block || "Text"}**: \`${e.before.replace(/`/g, "'")}\` → \`${e.after.replace(/`/g, "'")}\`${entry ? ` → ${entry.id}` : ""}`);
      if (e.note) L.push(`  - their note: ${q(e.note)}`);
      L.push(`  - rebuild: the guide${sc.length ? `, and scene${sc.length === 1 ? "" : "s"} ${sc.join(", ")} (their words or frame show it)` : " only: no scene says or shows these words"}`);
    }
    L.push("");
  }

  // ---- the calls to fix (a walkthrough review) ----
  if (ws) {
    const calls = ws.fixes.filter((f) => f.kind !== "quiz-disagree");
    if (calls.length) {
      L.push("## Calls to fix", "");
      for (const f of calls) {
        L.push(`- **${f.id}** (step ${f.step ?? "?"}) ${f.verdict === "own" ? "answered in the reviewer's own words" : "flagged"}: ${f.chose}`);
        if (f.insteadOf) L.push(`  - instead of: ${f.insteadOf}`);
        if (f.check) L.push(`  - where to check: \`${f.check}\``);
        for (const c of f.comments) L.push(`  - the reviewer's words${c.kind === "own" ? "" : ` (${c.anchoredBy === "time" ? `at ${clock(c.t)}` : "on its beat"})`}: ${q(c.comment)}`);
        if (!f.comments.length) L.push("  - no words: look at what the flag was on, and ask if it is not clear");
        if (f.escalate) L.push(`  - **reaches ${f.reaches.join("; ")}**: do not fix it in place; write a plan that supersedes it`);
      }
      L.push("");
    }
    const byId = (a, b) => a.id.localeCompare(b.id, "en", { numeric: true });
    L.push(`Accepted (now in the ledger): ${[...ws.accepted].sort(byId).map((a) => a.id).join(", ") || "none"}.${ws.listed.length ? ` Listed, not judged (in the ledger as listed; a later plan is not warned by them): ${[...ws.listed].sort(byId).map((a) => a.id).join(", ")}.` : ""}${ws.unjudged.length ? ` Never judged (not accepted): ${ws.unjudged.map((u) => u.id).join(", ")}.` : ""}`, "");
  }

  // ---- quick checks disagreed with ----
  const disagreed = (review.quizzes || []).filter((x) => (x.note || "").trim());
  if (disagreed.length) {
    L.push("## Quick checks disagreed with", "");
    for (const k of disagreed) {
      const def = (map?.quizzes || []).find((x) => String(x.id).toLowerCase() === String(k.id).toLowerCase()) || {};
      const label = (i) => (def.options || []).find((o) => o.id === i)?.label || i || "?";
      const fix = ws?.fixes.find((f) => f.kind === "quiz-disagree" && f.quiz === k.id);
      L.push(`- **${String(k.id).toUpperCase()}** (step ${def.planStep ?? k.planStep ?? "?"})${def.question ? ` ${def.question}` : ""}: answered ${q(k.answer === "own" ? k.own || "" : label(k.answer))}, the video's answer ${q(label(def.answer))}`);
      L.push(`  - the reviewer's words: ${q(k.note)}`);
      if (fix?.escalate) L.push(`  - **reaches ${fix.reaches.join("; ")}**: do not fix it in place; write a plan that supersedes it`);
    }
    L.push("");
  }

  // ---- the steps to revise, with why ----
  // a walkthrough's disagreed checks and the comments riding on a fix are said above already, and a
  // flag's own label ("Flagged: <the call>") is the player's words, not the reviewer's
  const said = new Set((ws?.fixes || []).flatMap((f) => [...f.comments.map((c) => c.id), ...(f.covers || [])]));
  const label = (r) => r.kind === "flag" && /^Flagged: /.test(String(r.comment || "").trim());
  const keep = (r) => r.kind !== "quiz-disagree" && !said.has(r.id) && !label(r);
  const steps = rs.steps.map((s) => ({ step: s.step, reasons: s.reasons.filter(keep) })).filter((s) => s.reasons.length);
  const other = rs.componentOnly.filter(keep).filter((r) => !r.open);
  L.push(`## ${kind === "walkthrough" ? "Steps the walkthrough did not land" : verdict === "approve" ? "Comments to fold into the steps" : "Steps to revise"}`, "");
  if (!steps.length && !other.length && !rs.unplaced.length) L.push(kind === "walkthrough" ? "_None: no other comment, missed check or rewind._" : "_None: every decision is in the ledger and nothing else was said. Leave plan.md as it reads._");
  const line = (r) => {
    // the walkthrough's open question (walkthroughs-that-help step 3): the reviewer's words on the build as it ran
    if (r.open) return `their answer to ${q(r.about || "Seeing it run, anything you'd change?")}: ${q(r.comment)}`;
    if (r.kind === "hard-to-follow") return `rewound or slowed down: ${r.comment.replace(/^Hard to follow: /, "").replace(/\. Say this step more plainly.*$/, "")}; say it more plainly, without changing what it decides`;
    if (r.kind === "quiz-missed") return r.comment.replace(/^Quick check missed: /, "quick check missed: ");
    if (r.kind === "answer-note") return `the note on ${r.id.replace(/^note-/, "").toUpperCase()}, under Decisions`;
    if (r.kind === "unclear") return `${r.about}: ${q(r.comment)}`;
    if (r.detail?.where) return `${r.kind === "note" ? "comment" : r.kind} in the guide (${r.detail.where}${r.detail.anchor ? `, at \`${r.detail.anchor}\`` : ""}): ${q(r.comment)}${r.detail.text && r.detail.text !== r.detail.anchor ? ` (pointing at ${q(r.detail.text)})` : ""}`;
    if (r.detail) return `${r.kind === "note" ? "comment" : r.kind} in detail \`${r.detail.name}\`${r.detail.anchor ? ` at \`${r.detail.anchor}\`` : ""}: ${q(r.comment)}${r.detail.text && r.detail.text !== r.detail.anchor ? ` (pointing at ${q(r.detail.text)})` : ""}`;
    return `${r.kind === "note" ? "comment" : r.kind}${r.component ? ` on ${r.component}` : ""} at ${clock(r.t)}${r.frame ? ` (${r.frame})` : ""}: ${q(r.comment)}`;
  };
  for (const s of steps) { L.push(`- **Step ${s.step}**`); for (const r of s.reasons) L.push(`  - ${line(r)}`); }
  if (other.length) { L.push("- **Not on a step**"); for (const r of other) L.push(`  - ${line(r)}`); }
  if (rs.unplaced.length) L.push(`- **Rewound outside any step:** ${rs.unplaced.map(moved).join("; ")}`);
  L.push("");
  // the walkthrough's open question, answered in the reviewer's words (walkthroughs-that-help step 3)
  const opened = rs.componentOnly.filter((r) => r.open && String(r.comment || "").trim());
  if (opened.length) { L.push("## Seeing it run", ""); for (const r of opened) L.push(`- ${line(r)}: act on it as a comment on the build`); L.push(""); }
  // the questions asked on the page (Ask about this, videos-that-make-sense step 3): each one says the video did not
  // make something plain; one with no answer is answered in the next version (a line in the video, or a meaning)
  const asked = (Array.isArray(review.questions) ? review.questions : []).filter((x) => String(x?.question || "").trim());
  if (asked.length) {
    L.push("## Questions you asked", "");
    for (const x of asked) {
      const where = `${x.frame?.index ? `scene ${x.frame.index}${x.frame.title ? `, ${q(x.frame.title)}` : ""}, ` : ""}at ${clock(x.t)}${x.planStep != null ? ` (step ${x.planStep})` : ""}`;
      L.push(`- ${where}: ${q(x.question)}`);
      if (String(x.answer || "").trim()) L.push(`  - answered ${x.via === "session" ? "by the agent session" : x.via === "claude" ? "by Claude on the page" : ""}${x.from ? ` (from: ${x.from})` : ""}: ${q(String(x.answer).replace(/\s+/g, " ").slice(0, 400))}. The video still left it unclear: make it plain there too`);
      else L.push("  - not answered on the page: answer it in the next version, in the scene (a line) or with a meaning for its phrase");
    }
    L.push("");
  }
  return L.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\n+$/, "\n");
}
