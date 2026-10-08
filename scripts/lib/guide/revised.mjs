// What a revision changed, for the guide: each part of plan.md whose words changed since the version the last plan
// review saw, the way the video marks its changed scenes ("Revised since the last build", scripts/plan-diff.mjs).
//
// The baseline ("since your review"): plan.md as it was when the last plan review in reviews/ was watched (the review's
// own record: when its video started playing, else when it was sent), read from git as the last commit of plan.md at or
// before that time. With no plan review, or none git can place, the previous version of plan.md in git: HEAD's when
// plan.md has changed since, else the commit before the last one that touched it. The page says which it compares with.
//
// What "changed" means is plan-diff's: the words, with spacing and case set aside (a restyle is no change). Parts are
// matched as plan-diff matches scenes, by name first, then by place, so a step put in before another does not mark
// everything after it: a step by its title, then its number; a case by its name, then its row; a question by its title,
// then its number; a block of a step and a section of plan.md by its heading.
//
// The parts (each one key, the page's id for it where it has one; guide.js marks each, `guide --check` holds the page
// to the list):
//   step-<n>              the step's title and its words before its blocks
//   step-<n>-cases        its Cases block's own words and header (a case taken out is listed here)
//   step-<n>-case-<i>     each case, its row
//   step-<n>-interface    its Interface block
//   step-<n>-example      its Example
//   step-<n>-other-<k>    each other #### block, in order
//   question-<q>          an open question, whole
//   decisions-in-force    the "Decisions in force" section
//   plan-<slug>           every other section (as the guide's "The plan, in its own words" names them), and the words
//                         before the first section (plan-opening); the open questions' section by its words before them
// What the review said that asked for it (lib/review-scope.mjs: its comments, notes on answers, answers, "explain this
// more", quick checks, rewinds, suggested edits) rides with the part it was on, or, when that part did not change, with
// the first part of the same step that did; the review's own words, quoted.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { planBlocksOf, tableRows } from "../plan-md.mjs";
import { listReviews, verdictOf, asksMore, askedWords } from "../reviews.mjs";
import { reviseScope, editsOf, mapFor } from "../review-scope.mjs";
import { slugify } from "./built.mjs";

// plan-diff's own: a change of spacing or case is no change
const norm = (s) => String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "4 Oct" (with the year when it is not this one's) from an ISO time, in UTC as the reviews are filed. */
export const dayOf = (iso, now = new Date()) => { const d = new Date(iso); if (Number.isNaN(+d)) return ""; return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}${d.getUTCFullYear() !== now.getUTCFullYear() ? ` ${d.getUTCFullYear()}` : ""}`; };

// ── the baseline ──
const gitIn = (repo, ...a) => { try { return execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 }); } catch { return null; } };
// the commits that touched plan.md, newest first, each with plan.md's path then (a plan folder renamed since is followed)
function planCommits(repo, rel, before = null) {
  const out = gitIn(repo, "log", "--follow", "--format=%x00%H%x09%cI", "--name-only", ...(before ? [`--before=${before}`] : []), "--", rel);
  if (!out) return [];
  return out.split("\0").filter((x) => x.trim()).map((b) => { const [head, ...rest] = b.trim().split("\n"); const [sha, at] = head.split("\t"); return { sha, at, path: rest.map((x) => x.trim()).find(Boolean) || rel }; });
}
const showAt = (repo, c) => gitIn(repo, "show", `${c.sha}:${c.path}`);

/** What the guide compares plan.md with: { kind: "review"|"git", text, commit, committed, review?, at?, day, words, mark } or null. */
export function planBaseline(planDir, repo) {
  const file = join(planDir, "plan.md"); if (!existsSync(file)) return null;
  const rel = relative(repo, file).split("\\").join("/");
  const review = listReviews(planDir).filter((r) => r.kind === "plan").at(-1) || null;
  if (review) {
    // when the reviewer saw it: the video's first play, else when the review was sent
    const saw = review.review?.watch?.firstPlayAt || review.at;
    const c = saw ? planCommits(repo, rel, saw)[0] : null, text = c ? showAt(repo, c) : null;
    if (text != null) return { kind: "review", text, commit: c.sha.slice(0, 7), committed: c.at, review: review.id, reviewMd: existsSync(review.md) ? relative(planDir, review.md) : null, at: review.at, saw, verdict: verdictOf(review.review), day: dayOf(review.at),
      words: `since your review of ${dayOf(review.at)}`, mark: "Changed since your review", ann: review.review };
  }
  // no review git can place: the previous version of plan.md in git
  const all = planCommits(repo, rel), now = readFileSync(file, "utf8");
  const head = all[0] ? showAt(repo, all[0]) : null;
  const prev = head != null && head !== now ? all[0] : all[1];
  const text = prev ? showAt(repo, prev) : null;
  if (text == null) return null;
  return { kind: "git", text, commit: prev.sha.slice(0, 7), committed: prev.at, day: dayOf(prev.at), words: `since the version of ${dayOf(prev.at)}`, mark: "Changed since the last version", why: review ? `the review of ${dayOf(review.at)} came before plan.md was first committed` : "no plan review yet" };
}

// ── the parts ──
const sectionsOf = (md) => [...md.matchAll(/^## (.+)$/gm)].map((m, i, all) => { const end = all[i + 1]?.index ?? md.length; return { title: m[1].trim(), text: md.slice(m.index + m[0].length, end).trim() }; });
/** Every part of a plan.md, in order: [{ key, kind, step, n, title, label, text, name }] (`name` matches it across versions). */
export function partsOfPlan(md) {
  const plan = planBlocksOf(md), text = plan.md, out = [];
  for (const s of plan.steps) {
    const st = `step-${s.n}`;
    out.push({ key: st, kind: "step", step: s.n, label: `step ${s.n}'s words`, title: s.title, text: `${s.title}\n\n${s.prose}`, name: norm(s.title) });
    const cb = /^#### +cases\b[^\n]*\n([\s\S]*?)(?=^#### |(?![\s\S]))/im.exec(s.text);
    if (s.cases) {
      const rows = cb ? tableRows(cb[1]) : [];
      out.push({ key: `${st}-cases`, kind: "cases", step: s.n, label: `step ${s.n}'s cases`, text: [s.cases.intro && !/^\|/.test(s.cases.intro) ? s.cases.intro : "", (rows[0] || []).join(" | ")].filter(Boolean).join("\n"), name: "cases" });
      for (const r of s.cases.rows) out.push({ key: `${st}-case-${r.i}`, kind: "case", step: s.n, i: r.i, label: `step ${s.n}, case ${r.i}`, title: r.case, text: (rows[r.i] || [r.case, r.example, r.happens]).join(" | "), name: norm(r.case) });
    }
    if (s.interface) out.push({ key: `${st}-interface`, kind: "interface", step: s.n, label: `step ${s.n}'s interface`, text: s.interface.text, name: "interface" });
    if (s.example != null) out.push({ key: `${st}-example`, kind: "example", step: s.n, label: `step ${s.n}'s example`, text: s.example, name: "example" });
    s.other.forEach((o, k) => out.push({ key: `${st}-other-${k + 1}`, kind: "other", step: s.n, label: `step ${s.n}: ${o.head}`, title: o.head, text: o.body, name: norm(o.head) }));
  }
  for (const q of plan.questions) out.push({ key: `question-${q.n}`, kind: "question", q: q.n, steps: q.steps, label: `question ${q.n}`, title: q.title, text: q.text, name: norm(q.title) });
  const opening = (() => { const m = /^# .+$/m.exec(text); if (!m) return ""; const after = text.slice(m.index + m[0].length), n = after.search(/^## /m); return (n < 0 ? after : after.slice(0, n)).trim(); })();
  if (opening) out.push({ key: "plan-opening", kind: "section", label: "the words before its first section", title: "Before its first section", text: opening, name: "plan-opening" });
  for (const x of sectionsOf(text)) {
    if (/^steps$/i.test(x.title) || /^for the guide/i.test(x.title)) continue;
    if (/^decisions in force/i.test(x.title)) { out.push({ key: "decisions-in-force", kind: "in-force", label: "the decisions in force", title: x.title, text: x.text, name: "decisions-in-force" }); continue; }
    // the open questions' section by its own words before its first question (each question is a part of its own)
    const q1 = /^open questions/i.test(x.title) ? x.text.search(/^\d+\.\s+\*\*/m) : -1, body = q1 >= 0 ? x.text.slice(0, q1).trim() : x.text;
    out.push({ key: `plan-${slugify(x.title)}`, kind: "section", label: `“${x.title}”`, title: x.title, text: body, name: `section:${norm(x.title)}` });
  }
  return out;
}

// match the parts of two versions: a step by its title then its number, everything else by its name within its step
// (a case by its name, then its row; a block by its heading), a question by its title then its number
function matchParts(was, now) {
  const map = new Map(), used = new Set();
  const take = (cur, cand) => { const b = cand.find((x) => !used.has(x)); if (b) { used.add(b); map.set(cur, b); } return b; };
  const steps = (P) => P.filter((p) => p.kind === "step");
  const stepOf = new Map();   // the current step's number → the earlier step's number
  for (const s of steps(now)) { const b = take(s, steps(was).filter((x) => x.name === s.name)); if (b) stepOf.set(s.step, b.step); }
  for (const s of steps(now)) if (!map.has(s)) { const b = take(s, steps(was).filter((x) => x.step === s.step)); if (b) stepOf.set(s.step, b.step); }
  for (const p of now.filter((x) => x.kind !== "step")) {
    if (p.step != null) {
      const bs = stepOf.get(p.step); if (bs == null) continue;
      const same = was.filter((x) => x.kind === p.kind && x.step === bs);
      if (!take(p, same.filter((x) => x.name === p.name)) && p.kind === "case") take(p, same.filter((x) => x.i === p.i));
      if (!map.has(p) && p.kind === "other") take(p, same.filter((x) => x.key.endsWith(`-other-${p.key.split("-").pop()}`)));
    } else if (p.kind === "question") { if (!take(p, was.filter((x) => x.kind === "question" && x.name === p.name))) take(p, was.filter((x) => x.kind === "question" && x.q === p.q)); }
    else take(p, was.filter((x) => x.kind === p.kind && x.name === p.name));
  }
  return { map, gone: was.filter((x) => !used.has(x)), stepOf };
}

/** Which parts changed between two plan.md texts: { parts: [..every current part, with `status` "same"|"edited"|"added", `was`], gone: [..], fromWas: Map(earlier key → current key) }. */
export function compareParts(wasMd, nowMd) {
  const was = partsOfPlan(wasMd), now = partsOfPlan(nowMd), { map, gone, stepOf } = matchParts(was, now);
  const fromWas = new Map();
  const parts = now.map((p) => { const b = map.get(p); if (b) fromWas.set(b.key, p.key); return { ...p, was: b ? b.text : null, wasKey: b?.key || null, status: !b ? "added" : norm(b.text) === norm(p.text) ? "same" : "edited" }; });
  return { parts, gone, fromWas, stepOf };
}

// ── the words that changed: a word diff (Myers), the long runs that did not change cut to their ends ──
// a word, or a mark of punctuation, each with the space after it ("works," is the word and its comma: "works" kept, "," taken out)
const toks = (s) => String(s || "").match(/[\p{L}\p{N}_'’-]+\s*|[^\p{L}\p{N}_'’\s-]\s*|\s+/gu) || [];
/** [[op, text]…], op "=" the same, "-" taken out, "+" put in, "…" a run of unchanged words left out. */
export function wordDiff(a, b, { context = 14 } = {}) {
  const A = toks(a), B = toks(b), key = (t) => t.trim();
  let pre = 0; while (pre < A.length && pre < B.length && key(A[pre]) === key(B[pre])) pre++;
  let suf = 0; while (suf < A.length - pre && suf < B.length - pre && key(A[A.length - 1 - suf]) === key(B[B.length - 1 - suf])) suf++;
  const a1 = A.slice(pre, A.length - suf), b1 = B.slice(pre, B.length - suf), ops = [];
  const N = a1.length, M = b1.length, max = N + M, off = max + 1;
  const mid = (() => {
    if (!N) return b1.map((t) => ["+", t]); if (!M) return a1.map((t) => ["-", t]);
    if (N * M > 4e6 && max > 6000) return [...a1.map((t) => ["-", t]), ...b1.map((t) => ["+", t])];
    let v = new Int32Array(2 * max + 3); const trace = [];
    for (let d = 0; d <= max; d++) {
      trace.push(v.slice());
      for (let k = -d; k <= d; k += 2) {
        let x = k === -d || (k !== d && v[off + k - 1] < v[off + k + 1]) ? v[off + k + 1] : v[off + k - 1] + 1, y = x - k;
        while (x < N && y < M && key(a1[x]) === key(b1[y])) { x++; y++; }
        v[off + k] = x;
        if (x >= N && y >= M) {
          const out = []; let cx = N, cy = M;
          for (let e = d; e > 0; e--) { const pv = trace[e], kk = cx - cy, down = kk === -e || (kk !== e && pv[off + kk - 1] < pv[off + kk + 1]), pk = down ? kk + 1 : kk - 1, px = pv[off + pk], py = px - pk;
            while (cx > px && cy > py) { out.push(["=", b1[--cy]]); cx--; }
            if (down) out.push(["+", b1[--cy]]); else out.push(["-", a1[--cx]]); }
          while (cx > 0 && cy > 0) { out.push(["=", b1[--cy]]); cx--; }
          return out.reverse();
        }
      }
    }
    return [];
  })();
  for (const t of B.slice(0, pre)) ops.push(["=", t]);
  ops.push(...mid);
  for (const t of B.slice(B.length - suf)) ops.push(["=", t]);
  // one op a run, and the runs that did not change cut to `context` words at each end
  const runs = [];
  for (const [op, t] of ops) { const last = runs.at(-1); if (last && last.op === op) last.t.push(t); else runs.push({ op, t: [t] }); }
  // a change read as a whole: a word or two kept between two changes (a comma, "a") goes with them, the words taken
  // out said together, then the new, never "works" "-," "+for one release,"
  const small = (r, i) => r.op === "=" && i > 0 && i < runs.length - 1 && runs[i - 1].op !== "=" && runs[i + 1].op !== "=" && (r.t.length <= 2 || r.t.every((t) => !/[\p{L}\p{N}]/u.test(t)));
  const grouped = [];
  for (let i = 0; i < runs.length;) {
    if (runs[i].op === "=") { grouped.push(runs[i++]); continue; }
    let del = "", ins = "";
    while (i < runs.length && (runs[i].op !== "=" || small(runs[i], i))) { const r = runs[i++], t = r.t.join(""); if (r.op !== "+") del += t; if (r.op !== "-") ins += t; }
    if (del) grouped.push({ op: "-", t: [del] }); if (ins) grouped.push({ op: "+", t: [ins] });
  }
  runs.splice(0, runs.length, ...grouped);
  const out = [];
  runs.forEach((r, i) => {
    if (r.op !== "=") { out.push([r.op, r.t.join("")]); return; }
    const first = i === 0, lastRun = i === runs.length - 1, keepHead = first ? 0 : context, keepTail = lastRun ? 0 : context;
    if (r.t.length <= keepHead + keepTail + 6) { out.push(["=", r.t.join("")]); return; }
    if (keepHead) out.push(["=", r.t.slice(0, keepHead).join("")]);
    out.push(["…", ""]);
    if (keepTail) out.push(["=", r.t.slice(r.t.length - keepTail).join("")]);
  });
  // plan.md's lines wrapped at its width read as one paragraph: a line break is kept only before a list item, a table
  // row, a heading or a fence, and a blank line is one break
  return out.map(([op, t], i) => [op, t.replace(/\n[ \t]*(\n\s*)?/g, (m, blank, off, s) => {
    if (blank) return "\n";
    const after = s.slice(off + m.length) || out.slice(i + 1).find((x) => x[1])?.[1] || "";
    return /^(?:[-*+] |\d+\. |\||#|```)/.test(after) ? "\n" : " ";
  })]);
}

// ── what the review said ──
// the part a review's words were on: its anchor in the guide ("step 3 · case 2", "question 2 · option B"), its
// question, its step; in the earlier version's numbering, which the reviewer saw
function partOfAnchor(anchor) {
  const a = String(anchor || "").toLowerCase();
  let m = /^question (\d+)/.exec(a); if (m) return `question-${m[1]}`;
  m = /^step (\d+)(?:\s*·\s*(.*))?/.exec(a); if (!m) return /^decisions in force/.test(a) ? "decisions-in-force" : null;
  const n = m[1], rest = m[2] || "", c = /^case (\d+)/.exec(rest);
  if (c) return `step-${n}-case-${c[1]}`;
  if (/^cases\b/.test(rest)) return `step-${n}-cases`;
  if (/^interface\b(?! as built)/.test(rest)) return `step-${n}-interface`;
  if (/^example\b/.test(rest)) return `step-${n}-example`;
  return `step-${n}`;
}
/** Each thing the review said, with the earlier version's part it was on: [{ part, step, kind, words, label, t }]. */
export function reviewSaid(ann, { map = null, wasParts = [] } = {}) {
  if (!ann) return [];
  const out = [], qByTitle = (t) => wasParts.find((p) => p.kind === "question" && p.name === norm(t))?.key || null;
  const qOf = (id) => { const d = (map?.decisions || []).find((x) => x.id === id); const n = /^q(\d+)$/i.exec(String(id))?.[1]; return qByTitle(d?.question) || (n ? `question-${n}` : null); };
  const scope = reviseScope(ann, { map });
  const decIds = new Set((ann.decisions || []).map((d) => `unclear-${d.id}`));
  for (const s of scope.steps) for (const r of s.reasons) {
    if (r.kind === "answer-note" || decIds.has(r.id)) continue;   // said with its answer, below
    const anchor = r.detail?.anchor || null, part = anchor ? partOfAnchor(anchor) : `step-${s.step}`;
    const base = { part, step: s.step, t: r.t ?? null };
    if (r.kind === "hard-to-follow") out.push({ ...base, kind: "rewind", label: "You went back over this part of the video" });
    else if (r.kind === "quiz-missed") out.push({ ...base, kind: "check", label: `You missed the quick check “${(/"([^"]+)"/.exec(r.comment) || [])[1] || "on this step"}”` });
    else if (r.kind === "quiz-disagree") out.push({ ...base, kind: "check", label: `On the quick check, you expected something else`, words: r.text });
    else if (r.kind === "unclear") out.push({ ...base, kind: "unclear", label: "You asked for this to be explained more", words: /^The reviewer /.test(r.comment) ? null : r.comment });
    else out.push({ ...base, kind: "comment", label: r.detail ? "Your note on the guide" : "Your comment", words: r.comment });
  }
  for (const d of ann.decisions || []) {
    const part = qOf(d.id) || (d.planStep != null ? `step-${d.planStep}` : null); if (!part) continue;
    if (asksMore(d)) { out.push({ part, step: d.planStep ?? null, kind: "unclear", label: "You asked for this question to be explained more", words: askedWords(d) || null, t: d.t ?? null }); continue; }
    out.push({ part, step: d.planStep ?? null, kind: "answer", label: d.option === "own" ? "Your answer, in your words" : `Your answer: ${String(d.option || "").toUpperCase()}`, words: d.option === "own" ? d.label : null, chose: d.option === "own" ? null : d.label, note: String(d.note || "").trim() || null, t: d.t ?? null });
  }
  const seen = new Set(out.map((x) => x.words).filter(Boolean));
  for (const e of editsOf(ann)) {
    const part = e.anchor ? partOfAnchor(e.anchor) : e.step != null ? `step-${e.step}` : null; if (!part) continue;
    out.push({ part, step: e.step, kind: "edit", label: "Your suggested edit", before: e.before, after: e.after, words: e.note && !seen.has(e.note) ? e.note : null });
  }
  return out;
}

/** The guide's `revised`: { against, mark, words, units: { key: { label, status, diff, asked, scenes } }, order, gone, total } or null. */
export function revisedOf(planDir, { repo, videoDir = null } = {}) {
  const base = planBaseline(planDir, repo); if (!base) return null;
  const now = readFileSync(join(planDir, "plan.md"), "utf8");
  const { parts, gone, fromWas, stepOf } = compareParts(base.text, now);
  const changed = parts.filter((p) => p.status !== "same");
  const against = { kind: base.kind, commit: base.commit, committed: base.committed, day: base.day, ...(base.kind === "review" ? { review: base.review, reviewMd: base.reviewMd, at: base.at, saw: base.saw, verdict: base.verdict } : { why: base.why }) };
  if (!changed.length && !gone.length) return { against, words: base.words, mark: base.mark, units: {}, order: [], gone: [], total: parts.length };
  const units = {};
  for (const p of changed) units[p.key] = { label: p.label, title: p.title || null, kind: p.kind, step: p.step ?? null, status: p.status, diff: p.status === "edited" ? wordDiff(p.was, p.text) : null, asked: [], gone: [] };
  // a part taken out: said with its step's cases (a case), its step (a block), or on its own at the top
  const top = [];
  for (const g of gone) {
    const host = g.kind === "case" ? fromWas.get(`step-${g.step}-cases`) || fromWas.get(`step-${g.step}`) : g.step != null && g.kind !== "step" ? fromWas.get(`step-${g.step}`) : null;
    const item = { label: g.label, title: g.title || null, text: g.text };
    if (host) { const cur = parts.find((p) => p.key === host); units[host] ||= { label: cur.label, title: cur.title || null, kind: cur.kind, step: cur.step ?? null, status: "edited", diff: null, asked: [], gone: [] }; units[host].gone.push(item); }
    else top.push(item);
  }
  // what the review said, with the part it was on (or the first changed part of that step)
  if (base.kind === "review") {
    const map = videoDir ? (() => { try { return JSON.parse(readFileSync(join(videoDir, "plan-map.json"), "utf8")); } catch { return null; } })() : mapFor(planDir, "plan");
    const wasParts = partsOfPlan(base.text);
    const stepNow = (n) => [...stepOf].find(([, w]) => w === n)?.[0] ?? null;
    const firstIn = (steps) => parts.find((p) => p.step != null && steps.includes(p.step) && units[p.key])?.key || null;
    for (const x of reviewSaid(base.ann, { map, wasParts })) {
      const cur = parts.find((p) => p.key === fromWas.get(x.part)) || null;
      const steps = cur ? (cur.kind === "question" ? cur.steps || [] : [cur.step]) : [stepNow(x.step)];
      const at = cur && units[cur.key] ? cur.key : firstIn(steps.filter((n) => n != null));
      if (at) { const { part, step, ...said } = x; units[at].asked.push(said); }
    }
  }
  // the video's own scenes of a changed step that its last build marked changed (plan-diff): watch them from here
  const pm = videoDir && existsSync(join(videoDir, "plan-map.json")) ? (() => { try { return JSON.parse(readFileSync(join(videoDir, "plan-map.json"), "utf8")); } catch { return null; } })() : null;
  if (pm?.changes?.baseline) for (const [k, u] of Object.entries(units)) if (u.kind === "step") u.scenes = (pm.frames || []).filter((f) => f.planStep === u.step && ["added", "edited"].includes(f.change?.status)).map((f) => ({ n: f.index, t: f.start ?? null, title: f.title }));
  return { against, words: base.words, mark: base.mark, units, order: parts.filter((p) => units[p.key]).map((p) => p.key), gone: top, total: parts.length };
}
