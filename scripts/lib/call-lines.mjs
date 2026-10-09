// Accepted agent calls are history (D-306, lib/ledger.mjs): one comes back only when a change touches the lines its plan's
// commits wrote. This places each call on those lines, the way the guide's Built side places a plan (lib/guide/built.mjs:
// the same commits, the same categories, the same cached `git blame`).
//
//   placeCalls(rp, ledger, { repo })      every accepted call in force: { d, row, plan, commits: [full sha], files: [path] },
//                                         and the ones it cannot place: { d, plan, why }
//   callsTouched(rp, ledger, { repo, base, head, skipPlan })
//                                         the calls whose lines the diff base..head changes: [{ d, row, plan, lines: { path: n } }]
//   callsOutlived(rp, ledger, { repo })   { outlived: [...], live: n, unplaced: [...] }: a call none of whose lines is left in HEAD
//   callWords(x)                          the call in plain words, for a warning
//
// A call's commits are its step's **Commits:** line in walkthrough.md, else the plan's (its **Commits:** line, else the
// commits after **Started from** whose message names the plan). Its files are those of its commits that its autonomy row's
// "where to check" names; else those the Categories of change give its step; else every file its commits changed. Never
// the plan's own folder, nor a generated file. Its lines are the lines `git blame` gives to its commits in those files:
// in a file, its own commits' lines when they wrote any there (a step with no **Commits:** line of its own takes the
// plan's commits, and of those the ones whose message names the call's step or its id are its own), else the plan's.
// A change only to comments or spacing (a comment reworded, a line re-indented, a blank line) touches no call.
// The blame is cached in .reelplanner/.cache/blame.json, by each file's blob: the same file text, the same lines.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { readWalkthrough, planCommits, pathIn, globRe, blameByCommit, isGenerated } from "./guide/built.mjs";
import { isHistory } from "./ledger.mjs";

const tryGit = (repo, ...a) => { try { return execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "ignore"] }); } catch { return null; } };
const CACHE_MAX = 3000;

// "`guideTarget` in `scripts/lib/guide/model.mjs`; templates/guide/" → ["scripts/lib/guide/model.mjs", "templates/guide/"]
const pathsNamed = (text) => [...new Set(String(text || "").replace(/`/g, " ").split(/[\s,;()]+/)
  .map((t) => t.replace(/[.:]+$/, "").replace(/:\d+(?:[-–]\d+)?$/, "").replace(/^\.\//, ""))
  .filter((t) => t.length > 2 && (/\//.test(t) || /\.[a-z]{1,5}$/i.test(t))))];
// the row's "where to check" as written, backticks kept: `| A3 | 1 | … | … | … | `todosFor` in `templates/guide/guide.js` |`
const rawCheck = (md, row) => { if (!row) return ""; const l = String(md).split("\n").find((x) => new RegExp(`^\\|\\s*${row.id}\\b`, "i").test(x)); return l ? l.split("|").slice(1, -1)[5] || "" : ""; };
// the code it names: `memoryLines`, `LINES`, `record` in backticks, and a bare camelCase or CONSTANT word ("recordedBy")
const IDENT = /^[A-Za-z_$][\w$]*$/;
function identsNamed(raw) {
  const quoted = [...String(raw).matchAll(/`([^`]+)`/g)].map((m) => m[1].replace(/\(\)$/, "").trim()).filter((t) => IDENT.test(t) && t.length > 2);
  const bare = String(raw).replace(/`[^`]*`/g, " ").split(/[\s,;()]+/).filter((t) => IDENT.test(t) && (/[a-z][A-Z]/.test(t) || /^[A-Z][A-Z0-9_]{2,}$/.test(t)));
  return [...new Set([...quoted, ...bare])];
}
const esc = (s) => s.replace(/[$]/g, "\\$");
/** The lines (1-based, inclusive) of `id`'s definition in a file's text, if it defines it near the left edge: a function,
 *  a const, a class, or a method, up to the line that closes it. → [[from, to]] */
function regionsOf(text, id) {
  const lines = String(text).split("\n"), out = [];
  const def = new RegExp(`^(\\s{0,2})(?:export\\s+)?(?:default\\s+)?(?:async\\s+)?(?:function\\*?\\s+${esc(id)}\\b|(?:const|let|var|class)\\s+${esc(id)}\\b|${esc(id)}\\s*\\([^)]*\\)\\s*\\{)`);
  lines.forEach((l, i) => {
    const m = def.exec(l); if (!m) return;
    const k = m[1].length; let end = i;
    for (let j = i + 1; j < lines.length; j++) {
      const t = lines[j]; if (!t.trim()) continue;
      const ind = t.length - t.trimStart().length;
      if (ind <= k) { end = /^[})\]]/.test(t.trimStart()) ? j : j - 1; break; }
      end = j;
    }
    out.push([i + 1, end + 1]);
  });
  return out;
}
const names = (file, tok) => file === tok || file.endsWith(`/${tok}`) || file.startsWith(`${tok.replace(/\/$/, "")}/`) || (/[*?]/.test(tok) && globRe(tok).test(file));

/** The steps a commit message names: "step 3", "steps 1 to 4", "steps 2–3", "steps 1, 2 and 5". → Set of numbers */
export function stepsNamed(msg) {
  const out = new Set();
  for (const m of String(msg || "").matchAll(/\bsteps?\s+(\d+)((?:\s*(?:to|through|–|-)\s*\d+)?)((?:\s*(?:,|and|&)\s*\d+)*)/gi)) {
    const a = +m[1], b = m[2] ? +m[2].match(/\d+/)[0] : a;
    for (let k = a; k <= Math.min(b, a + 50); k++) out.add(k);
    for (const x of (m[3] || "").match(/\d+/g) || []) out.add(+x);
  }
  return out;
}
/** Does a commit's message name this call: its step, or its id ("A2", "D1") as a word? */
const namesCall = (msg, step, id) => (step != null && stepsNamed(msg).has(+step)) || (!!id && /^\w+$/.test(id) && new RegExp(`\\b${id}\\b`, "i").test(String(msg || "")));

/** The accepted calls in force, each with the commits and files it is on. → { placed, unplaced } */
export function placeCalls(rp, ledger, { repo } = {}) {
  const placed = [], unplaced = [], byPlan = new Map(), textAt = new Map();
  for (const d of ledger.filter(isHistory)) byPlan.set(d.plan, [...(byPlan.get(d.plan) || []), d]);
  for (const [plan, ds] of byPlan) {
    const dir = join(rp, "plans", plan), wtPath = join(dir, "walkthrough.md");
    if (!existsSync(wtPath)) { for (const d of ds) unplaced.push({ d, plan, why: "its plan has no walkthrough.md" }); continue; }
    const wt = readWalkthrough(wtPath), title = existsSync(join(dir, "plan.md")) ? (readFileSync(join(dir, "plan.md"), "utf8").match(/^#\s+(.+)$/m) || [])[1] || "" : "";
    const ok = planCommits(repo, wt, { planTitle: title }).commits.filter((c) => !c.missing && c.full);
    if (!ok.length) { for (const d of ds) unplaced.push({ d, plan, why: "its walkthrough.md names no commits this clone has" }); continue; }
    const own = [".reelplanner", ".reelplanning"].map((d) => `${d}/plans/${plan}/`), filesOf = new Map(), said = new Map();   // (its commits from before the rename, D-312: .reelplanning/)
    for (const c of ok) filesOf.set(c.full, (tryGit(repo, "show", "--name-only", "--no-renames", "--format=", c.full) || "").split("\n").filter((p) => p && !own.some((o) => p.startsWith(o)) && !isGenerated(p)));
    for (const c of ok) said.set(c.full, tryGit(repo, "show", "-s", "--format=%B", c.full) || c.subject || "");
    for (const d of ds) {
      const key = String(d.questionId || "").replace(/^autonomy-/, ""), row = wt.calls.find((c) => c.key === key) || null;
      const stepShas = wt.steps.find((s) => s.n === d.step)?.commits || [];
      const commits = stepShas.length ? ok.filter((c) => stepShas.some((s) => c.full.startsWith(s))) : ok;
      // with no commits of its own step listed, the plan's commits whose message names its step or its id
      const mine = stepShas.length ? [] : commits.filter((c) => namesCall(said.get(c.full), d.step, row?.id));
      const all = [...new Set(commits.flatMap((c) => filesOf.get(c.full) || []))];
      const named = pathsNamed(row?.check), cats = wt.categories.filter((c) => !c.steps || c.steps.includes(d.step));
      let files = all.filter((f) => named.some((t) => names(f, t)));
      if (!files.length) files = all.filter((f) => cats.some((c) => c.paths.length && pathIn(f, c.paths)));
      if (!files.length) files = all;
      if (!files.length) { unplaced.push({ d, plan, why: "its commits change no file outside the plan's own folder" }); continue; }
      // the code the row names, per file: the names the file defined as the call's commits left it (its region there
      // is the call's; a name since gone from the file takes its lines with it). A file defining none of them: all of it.
      const idents = identsNamed(rawCheck(wt.md, row)), identsIn = {};
      if (idents.length) for (const f of files) {
        const last = [...commits].reverse().find((c) => (filesOf.get(c.full) || []).includes(f)); if (!last) continue;
        const k = `${last.full}:${f}`; if (!textAt.has(k)) textAt.set(k, tryGit(repo, "show", k) || "");
        const there = idents.filter((id) => regionsOf(textAt.get(k), id).length);
        if (there.length) identsIn[f] = there;
      }
      placed.push({ d, row, plan, commits: commits.map((c) => c.full), own: mine.length < commits.length ? mine.map((c) => c.full) : [], files, identsIn });
    }
  }
  return { placed, unplaced };
}

function readCache(rp) { try { return JSON.parse(readFileSync(join(rp, ".cache", "blame.json"), "utf8")); } catch { return {}; } }
function writeCache(rp, cache) {
  try {
    const keys = Object.keys(cache), keep = keys.length > CACHE_MAX ? Object.fromEntries(keys.slice(-CACHE_MAX).map((k) => [k, cache[k]])) : cache;
    mkdirSync(join(rp, ".cache"), { recursive: true }); writeFileSync(join(rp, ".cache", "blame.json"), JSON.stringify(keep));
  } catch { /* a cache only: the next run blames again */ }
}
/** The blob of each of `paths` at `at` (absent: not in the tree then). */
function blobsAt(repo, at, paths) {
  const out = new Map(); if (!paths.length) return out;
  for (let i = 0; i < paths.length; i += 200) {
    for (const l of (tryGit(repo, "ls-tree", "-r", at, "--", ...paths.slice(i, i + 200)) || "").split("\n")) { const m = /^\d+ blob ([0-9a-f]+)\t(.+)$/.exec(l); if (m) out.set(m[2], m[1]); }
  }
  return out;
}
/** Each file at `at`: its blame by commit (eight at a time, cached by blob) and its text when asked for.
 *  → Map(path → { by: { sha: [lines] }, text() }) */
async function filesAt(repo, rp, at, paths) {
  const cache = readCache(rp), blobs = blobsAt(repo, at, paths), out = new Map(), todo = [...blobs];
  let i = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (i < todo.length) {
      const [p, blob] = todo[i++], key = `blob:${blob}:${p}`, hit = cache[key];
      if (hit) { delete cache[key]; cache[key] = hit; }   // kept longest when used last
      let text; out.set(p, { by: (await blameByCommit(repo, at, p, cache, key)) || {}, text: () => (text ??= tryGit(repo, "cat-file", "-p", blob) || "") });
    }
  }));
  writeCache(rp, cache);
  return out;
}
/** The lines of `path` the call's commits wrote (its own commits', when they wrote any here), within the code its row
 *  names there (none, once that code is gone). */
function callLines(x, file, path) {
  const by = file?.by || {}, own = (x.own || []).filter((c) => by[c]?.length);
  const all = (own.length ? own : x.commits).flatMap((c) => by[c] || []), ids = x.identsIn?.[path] || [];
  if (!all.length || !ids.length) return all;
  const regions = ids.flatMap((id) => regionsOf(file.text(), id));
  return all.filter((n) => regions.some(([a, b]) => n >= a && n <= b));
}

// A line as code: its comments and its spacing taken out ("" for a comment or a blank line), by the file's kind. Leading
// spacing is kept where it means something (YAML, Python); elsewhere a re-indented line is the same line.
const HASH = /\.(ya?ml|sh|bash|zsh|py|rb|toml|ini|cfg|conf|env|mk|r)$|(^|\/)(Dockerfile|Makefile|\.[\w-]*ignore|\.gitattributes)$/i;
const SLASH = /\.(m?[jt]sx?|c[jt]s|css|scss|less|c|h|cc|cpp|hpp|java|go|rs|swift|kt|jsonc)$/i;
const ANGLE = /\.(html?|svg|xml|vue|md)$/i;
const INDENTED = /\.(ya?ml|py)$/i;
export function asCode(path, line) {
  let l = String(line);
  if (HASH.test(path)) l = l.replace(/(^|\s)#.*$/, "");
  else if (SLASH.test(path)) l = l.replace(/\/\*.*?\*\//g, "").replace(/(^|\s)\/\/.*$/, "").replace(/^\s*(?:\/\*\*?|\*\/?)(?:\s.*)?$/, "");
  else if (ANGLE.test(path)) l = l.replace(/<!--.*?-->/g, "");
  const lead = INDENTED.test(path) && l.trim() ? l.match(/^\s*/)[0].replace(/\t/g, "  ") : "";
  return l.trim() ? lead + l.trim().replace(/\s+/g, " ") : "";
}
/** Does a hunk change nothing but comments and spacing? (its old and new lines the same code, in the same order) */
const cosmetic = (path, old, add) => { const code = (ls) => ls.map((l) => asCode(path, l)).filter(Boolean).join("\n"); return code(old) === code(add); };

/** What base..head does to each file's old side: the lines it loses or changes, and where it inserts lines (after line `a`).
 *  A hunk that changes only comments or spacing is left out; in one that changes code, an old line that is only a comment
 *  or blank is not counted (unless every old line is: then the code it brings in is on them). */
function changedLines(repo, base, head) {
  const out = new Map(); let cur = null, h = null;
  const close = () => {
    if (!h) return; const s = out.get(cur), hk = h; h = null;
    if (cosmetic(cur, hk.old, hk.add)) return;
    if (!hk.n) { s.ins.add(hk.a); return; }
    const code = hk.old.map((l, k) => [hk.a + k, asCode(cur, l)]), kept = code.filter(([, c]) => c);
    for (const [k] of kept.length ? kept : code) s.lines.add(k);
  };
  for (const l of (tryGit(repo, "diff", "-U0", "--no-renames", "--no-color", "--no-ext-diff", base, head) || "").split("\n")) {
    if (h && (h.left > 0 || h.right > 0)) {   // inside a hunk: its lines, counted by its header (a line "--- x" is one of them)
      if (l.startsWith("-") && h.left > 0) { h.old.push(l.slice(1)); h.left--; continue; }
      if (l.startsWith("+") && h.right > 0) { h.add.push(l.slice(1)); h.right--; continue; }
    }
    if (l.startsWith("\\")) continue;   // "\ No newline at end of file"
    close();
    if (l.startsWith("diff --git ")) { cur = null; continue; }
    if (l.startsWith("--- ")) { cur = l === "--- /dev/null" ? null : l.replace(/^--- (?:a\/)?/, ""); if (cur && !out.has(cur)) out.set(cur, { lines: new Set(), ins: new Set() }); continue; }
    const m = cur && /^@@ -(\d+)(?:,(\d+))? \+\d+(?:,(\d+))? @@/.exec(l); if (!m) continue;
    const n = m[2] == null ? 1 : +m[2];
    h = { a: +m[1], n, old: [], add: [], left: n, right: m[3] == null ? 1 : +m[3] };
  }
  close();
  return out;
}

/** The accepted calls whose lines the diff from where head left base changes (none of `skipPlan`'s own).
 *  → [{ d, row, plan, lines: { path: n } }], or null when git does not know `base` */
export async function callsTouched(rp, ledger, { repo, base, head = "HEAD", skipPlan = null } = {}) {
  const from = (tryGit(repo, "merge-base", base, head) || "").trim();
  if (!from) return null;
  const changed = changedLines(repo, from, head);
  const { placed } = placeCalls(rp, ledger.filter((d) => d.plan !== skipPlan), { repo });
  const near = placed.filter((x) => x.files.some((f) => changed.has(f)));
  if (!near.length) return [];
  const at = await filesAt(repo, rp, from, [...new Set(near.flatMap((x) => x.files.filter((f) => changed.has(f))))]);
  const out = [];
  for (const x of near) {
    const lines = {};
    for (const f of x.files.filter((p) => changed.has(p))) {
      // a line it changes, or lines inserted inside the call's code (between two of its lines)
      const mine = new Set(callLines(x, at.get(f), f)), c = changed.get(f);
      const n = [...mine].filter((k) => c.lines.has(k)).length + [...c.ins].filter((a) => mine.has(a) && mine.has(a + 1)).length;
      if (n) lines[f] = n;
    }
    if (Object.keys(lines).length) out.push({ ...x, lines });
  }
  return out;
}

/** The accepted calls none of whose lines is left at `at` (HEAD): outlived. Said, never written into the log.
 *  → { outlived: [{ d, row, plan, files }], live: n, unplaced: [{ d, plan, why }] } */
export async function callsOutlived(rp, ledger, { repo, at = "HEAD" } = {}) {
  const { placed, unplaced } = placeCalls(rp, ledger, { repo });
  const files = await filesAt(repo, rp, at, [...new Set(placed.flatMap((x) => x.files))]);
  const outlived = placed.filter((x) => !x.files.some((f) => callLines(x, files.get(f), f).length));
  return { outlived, live: placed.length - outlived.length, unplaced };
}

const short = (plan) => String(plan || "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
/** "D-212, the contributing plan's call A3: “Reviews go in reviews/”, instead of “one file”" */
export const callWords = (x) => `${x.d.id}, the ${short(x.plan || x.d.plan)} plan's call ${x.row?.id || String(x.d.questionId || "").replace(/^autonomy-/, "").toUpperCase()}: “${x.d.chosen}”${x.row?.insteadOf ? `, instead of “${x.row.insteadOf}”` : ""}`;
