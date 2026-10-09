// The Built side of a plan's guide (the plan guide, step 5): what landed, made from `walkthrough.md`, git and the runs the
// implement step saved, never typed in. walkthrough.md names:
//
//   **Commits:** 4dc6bfc df9c961 …          the plan's commits (top level, and optionally under each step's heading)
//   **Started from:** `a9896c9`              without a Commits line, the commits after it whose message names the plan
//   ## Categories of change                  what landed, by kind:
//   - **The build gate** {build-gate} (`scripts/verify.sh`, `scripts/lib/fresh-eyes.mjs`) (step 2): a finding with no answer stops it
//     Runs: `runs/build-stops.txt`
//     ({id}: the part's name, which a scene's `- guide:` opens, else one made from the name; paths in backticks: its files, or folders, or globs; a bare commit in the parentheses, `(df9c961)`, keeps only that
//     commit's changes to them, so one file's changes can be two kinds; the first category that claims a change has it)
//   ### Step N — … ✅                         what landed for a step; `#### Interface as built` under it
//
// runs/<name>.txt is a run as it ran: `$ <command>`, what it printed, whole, and `exit <n>` last.
// A category's diff is every file of the plan's commits under its paths, each hunk with ten lines around it, and each
// file whole at the plan's last commit that touched it, the lines `git blame` gives to the plan's commits marked (cached
// in <guide>/.cache/, since blame is the slow part). Files no category claims go under "Everything else": never cut.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { execFile, execFileSync } from "node:child_process";
import { join, basename, relative, sep } from "node:path";
import { parseCalls } from "../autonomy.mjs";
import { interfaceParts, stepsNamed } from "../plan-md.mjs";

const git = (repo, ...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "pipe"] });
const tryGit = (repo, ...a) => { try { return git(repo, ...a); } catch { return null; } };
const gitAsync = (repo, ...a) => new Promise((ok) => execFile("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 256 << 20 }, (e, out) => ok(e ? null : out)));
export const slugify = (s) => String(s).toLowerCase().replace(/[`*_]/g, "").replace(/^(the|a|an)\s+/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "part";

/** walkthrough.md, read for the guide. */
export function readWalkthrough(path) {
  const md = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const sectionAt = (re, level = 2) => { const m = md.match(re); if (!m) return null; const rest = md.slice(m.index + m[0].length); const end = rest.search(new RegExp(`^#{1,${level}} `, "m")); return (end < 0 ? rest : rest.slice(0, end)).trim(); };
  const shas = (line) => [...String(line).matchAll(/\b[0-9a-f]{7,40}\b/g)].map((m) => m[0]);
  const top = md.split(/^### /m)[0];
  const commits = shas(((/\*\*Commits:\*\*([^\n]*(?:\n(?!\n|#|\*\*)[^\n]*)*)/.exec(top) || [])[1] || "").replace(/\*\*[^*]+:\*\*[\s\S]*$/, ""));
  const started = (/\*\*Started from:\*\*\s*`?([0-9a-f]{7,40})`?/.exec(md) || [])[1] || null;
  const steps = [...md.matchAll(/^### Step (\d+)\s*[—–:-]\s*(.+)$/gm)].map((m) => {
    const rest = md.slice(m.index + m[0].length), end = rest.search(/^#{1,3} /m), text = (end < 0 ? rest : rest.slice(0, end)).trim();
    const ib = /^#### Interface as built[^\n]*\n([\s\S]*?)(?=^#### |(?![\s\S]))/m.exec(text);
    const title = m[2].trim(), status = /✅/.test(title) ? "done" : /⏳/.test(title) ? "waiting" : /❌|✗/.test(title) ? "not done" : null;
    return { n: +m[1], title: title.replace(/\s*[✅⏳❌✗].*$/, "").trim(), status, text: text.replace(/^#### Interface as built[\s\S]*?(?=^#### |(?![\s\S]))/m, "").trim(),
      commits: shas((/^\*\*Commits:\*\*([^\n]*)/m.exec(text) || [])[1] || ""), ifaceBuilt: ib ? { parts: interfaceParts(ib[1]), text: ib[1].trim() } : null };
  });
  const catText = sectionAt(/^## Categories of change[^\n]*$/m);
  const cats = [];
  if (catText) for (const line of catText.split("\n")) {
    const b = /^- \*\*([^*]+)\*\*\s*(?:\{([a-z0-9][a-z0-9-]*)\}\s*)?(.*)$/.exec(line);
    if (b) { cats.push({ name: b[1].trim(), id: b[2] || null, rest: b[3] }); continue; }
    if (cats.length && /^\s+\S/.test(line)) cats[cats.length - 1].rest += "\n" + line.trim();
  }
  const categories = cats.map(({ name, id, rest }) => {
    const [first, ...more] = rest.split("\n");
    const paren = [...first.matchAll(/\(([^()]*)\)/g)].map((m) => m[1]);
    const paths = paren.flatMap((p) => [...p.matchAll(/`([^`]+)`/g)].map((m) => m[1])).filter((p) => !/^runs\//.test(p));
    // commits named bare in the parentheses: only those commits' changes to its paths are this category's (one file can
    // hold two kinds of change, each in its own commit)
    const commits = paren.flatMap((p) => [...p.replace(/`[^`]*`/g, "").matchAll(/\b[0-9a-f]{7,40}\b/g)].map((m) => m[0]));
    const steps = paren.map((p) => stepsNamed(`(${p})`)).find(Boolean) || null;
    const runs = [...rest.matchAll(/`(runs\/[^`]+)`/g)].map((m) => m[1]);
    const sum = first.replace(/\([^()]*\)/g, "").replace(/^\s*[:—–-]\s*/, "").trim();
    return { id: id || slugify(name), name, paths, commits, steps: steps === "all" ? null : steps, runs, sum: [sum, ...more.filter((l) => !/^Runs:/i.test(l))].filter(Boolean).join("\n") };
  });
  const text = (re) => sectionAt(re);
  return { md, commits, started, steps, categories, hasCategories: !!catText, calls: parseCalls(md),
    texts: { tests: text(/^## Tests(?: run)?[^\n]*$/m), notDone: text(/^## Not done[^\n]*$/m), codeCheck: text(/^## Code check[^\n]*$/m), video: text(/^## The walkthrough video[^\n]*$/m) } };
}

/** A saved run's text as a reader sees it: a run that reads an HTML file (a `grep` of a frame) printed its entities as
 *  they are in the file (`you&#x27;d`); what it printed is decoded to the characters they stand for, its command kept. */
export function runText(text) {
  const lines = String(text).split("\n"), cmd = (/^\$ (.+)$/.exec(lines[0]) || [])[1] || "";
  if (!/\.html?\b/.test(cmd.replace(/\s{2,}\(.+\)\s*$/, ""))) return text;
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", hellip: "…", middot: "·", rarr: "→", times: "×" };
  return [lines[0], ...lines.slice(1).map((l) => l.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : +e.slice(1)) : named[e.toLowerCase()] ?? m)))].join("\n");
}

/** The plan's saved runs (runs/*.txt and *.log), each as it ran: { "runs/x.txt": { name, title, cmd, exit, text } }. */
export function runsOf(planDir) {
  const runs = {}, rd = join(planDir, "runs"); if (!existsSync(rd)) return runs;
  for (const f of readdirSync(rd).filter((f) => /\.(txt|log)$/.test(f)).sort()) {
    const text = runText(readFileSync(join(rd, f), "utf8").replace(/\r\n/g, "\n").replace(/\n+$/, ""));
    const lines = text.split("\n"), cmd = (/^\$ (.+)$/.exec(lines[0]) || [])[1] || null, ex = /^exit (\d+)\s*$/.exec(lines.at(-1) || "");
    runs[`runs/${f}`] = { name: `runs/${f}`, title: basename(f).replace(/\.(txt|log)$/, ""), cmd, exit: ex ? +ex[1] : null, text };
  }
  return runs;
}

// what the build writes, not a person: listed with its counts, never shown line by line
const GENERATED = /(?:^|\/)(?:plan-map\.json|terms-index\.json|caption_groups\.json|captions\.html|audio_request\.json|audio_meta\.json|audio_engine_meta\.json|stamp\.json|[a-z]+-brief\.md|decisions\.md|package-lock\.json|narration\.json|holds\.json)$|\/(?:snapshots|assets|\.hyperframes|renders)\/|(?:^|\/)(?:video|walkthrough-video|system-video)\/index\.html$|\.(?:png|jpe?g|webp|wav|mp3|mp4|woff2?|zip|bundle)$/;
export const isGenerated = (p) => GENERATED.test(p);

/** The plan's commits: walkthrough.md's Commits lines, else those after Started from whose message names the plan. */
export function planCommits(repo, wt, { planTitle = "" } = {}) {
  const listed = [...new Set([...wt.commits, ...wt.steps.flatMap((s) => s.commits)])];
  const info = (sha) => { const o = tryGit(repo, "show", "-s", "--format=%h%x09%H%x09%cs%x09%s", sha); if (!o) return { sha, missing: true }; const [h, full, date, subject] = o.trim().split("\t"); return { sha: h, full, date, subject }; };
  if (listed.length) return { from: "listed", commits: listed.map(info) };
  if (!wt.started) return { from: null, commits: [] };
  const short = String(planTitle).split(":")[0].trim().toLowerCase();
  const log = tryGit(repo, "log", "--reverse", "--format=%h%x09%H%x09%cs%x09%s", `${wt.started}..HEAD`) || "";
  const commits = log.split("\n").filter(Boolean).map((l) => { const [sha, full, date, subject] = l.split("\t"); return { sha, full, date, subject }; })
    .filter((c) => short && c.subject.toLowerCase().startsWith(short));
  return { from: "named", commits };
}

// a path belongs to a category when it is one of its paths, under one (a folder), or matches one (a glob)
export const globRe = (g) => new RegExp(`^${g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*").replace(/\?/g, ".")}$`);
export const pathIn = (path, paths) => paths.some((p) => { const q = p.replace(/^\.\//, ""); return path === q || path.startsWith(q.replace(/\/?$/, "/")) || (/[*?]/.test(q) && globRe(q).test(path)); });

const CUT = 2000;
const cutLine = (s) => (s.length > CUT ? `${s.slice(0, 400)}\u0000${s.length - 400}` : s);
function hunksOf(repo, sha, path) {
  const out = tryGit(repo, "show", "-U10", "--format=", "--no-color", "--no-ext-diff", sha, "--", path); if (out == null) return [];
  const hunks = []; let cur = null;
  for (const line of out.split("\n")) {
    if (line.startsWith("@@")) { cur = { h: line.replace(/^(@@ [^@]+ @@).*$/, "$1"), l: [] }; hunks.push(cur); continue; }
    if (!cur || /^\\ No newline/.test(line)) continue;
    if (line === "") { cur.l.push(" "); continue; }
    if (!"+- ".includes(line[0])) continue;
    cur.l.push(line[0] + cutLine(line.slice(1)));
  }
  for (const hk of hunks) while (hk.l.length && hk.l.at(-1) === " ") hk.l.pop();
  return hunks;
}

/** The Built side's data: the commits, each category with its files (diffs and whole files), the runs, the calls. */
export async function builtSide(planDir, { repo, planTitle, cacheDir = null, whole = true } = {}) {
  const wtPath = join(planDir, "walkthrough.md"); if (!existsSync(wtPath)) return null;
  const wt = readWalkthrough(wtPath), gaps = [];
  const { from, commits } = planCommits(repo, wt, { planTitle });
  for (const c of commits.filter((c) => c.missing)) gaps.push({ where: `commit ${c.sha}`, what: "named in walkthrough.md, not in this clone", fail: true });
  const ok = commits.filter((c) => !c.missing);
  if (!from) gaps.push({ where: "walkthrough.md", what: "names no commits (a **Commits:** line) and no **Started from:**, so there is no diff" });
  else if (from === "named") gaps.push({ where: "walkthrough.md", what: `names no commits: the ${ok.length} after its Started from whose message names the plan are taken (write a **Commits:** line)` });
  // every change of every commit: a file in a commit, with its lines + and −
  const pairs = [];
  for (const c of ok) {
    const num = tryGit(repo, "show", "--numstat", "--format=", "--no-renames", c.full) || "";
    const created = new Set((tryGit(repo, "show", "--diff-filter=A", "--name-only", "--format=", c.full) || "").split("\n").filter(Boolean));
    for (const l of num.split("\n").filter(Boolean)) { const [a, d, path] = l.split("\t"); const bin = a === "-"; pairs.push({ c, path, add: bin ? 0 : +a, del: bin ? 0 : +d, bin, isNew: created.has(path) }); }
  }
  const allPaths = [...new Set(pairs.map((x) => x.path))];
  // the categories: walkthrough.md's, else one per top folder (said as a gap), and everything else
  let cats = wt.categories.map((c) => ({ ...c, files: [] }));
  if (!wt.hasCategories && pairs.length) {
    gaps.push({ where: "walkthrough.md", what: "has no ## Categories of change: the files are grouped by folder" });
    const top = (p) => p.split("/").slice(0, /^\.reelplann(?:er|ing)\/plans\//.test(p) ? 3 : p.includes("/") ? (p.split("/").length > 2 ? 2 : 1) : 0).join("/") || "(the repo's top)";
    const groups = new Map(); for (const p of allPaths) { const t = top(p); groups.set(t, [...(groups.get(t) || []), p]); }
    cats = [...groups.entries()].sort((a, b) => b[1].length - a[1].length).map(([t, ps]) => ({ id: slugify(t.split("/").filter(Boolean).slice(-1)[0] || t), name: t === "(the repo's top)" ? t : `\`${t}/\``, paths: t.includes("(") ? ps : [t], commits: [], steps: null, runs: [], sum: "", files: [] }));
  }
  // the plan's own folder (its walkthrough video's text, walkthrough.md, the code check, the runs), where no category of
  // walkthrough.md claims it: a group of its own, so "everything else" is only what nothing names
  const own = relative(repo, planDir).split(sep).join("/");
  if (own && !own.startsWith("..") && wt.hasCategories) cats.push({ id: "the-record", name: "The walkthrough video and the plan's record", paths: [`${own}/`], commits: [], steps: null, runs: [], sum: "", files: [], record: true });
  const rest = { id: "everything-else", name: "Everything else", paths: [], commits: [], steps: null, runs: [], sum: "Files of the plan's commits no category names: here so that nothing is left out.", files: [] };
  const claims = (cat, x) => (cat.paths.length || cat.commits.length) && (!cat.paths.length || pathIn(x.path, cat.paths)) && (!cat.commits.length || cat.commits.some((s) => x.c.full.startsWith(s)));
  const byCat = new Map();
  for (const x of pairs) {
    const cat = cats.find((k) => claims(k, x)) || rest, m = byCat.get(cat) || new Map(); byCat.set(cat, m);
    const e = m.get(x.path) || { path: x.path, add: 0, del: 0, isNew: false, generated: isGenerated(x.path) || x.bin, commits: [] };
    e.add += x.add; e.del += x.del; e.isNew ||= x.isNew; e.generated ||= x.bin;
    e.commits.push({ sha: x.c.sha, full: x.c.full, label: x.c.subject.split(":")[0].slice(0, 60) });
    m.set(x.path, e);
  }
  for (const [cat, m] of byCat) cat.files = [...m.values()];
  if (rest.files.length) cats.push(rest);
  const seen = new Set(); for (const c of cats) { let id = c.id, i = 2; while (seen.has(id)) id = `${c.id}-${i++}`; c.id = id; seen.add(id); }
  // hunks now; whole files with blame marks, in parallel and cached (blame is the slow part: about a second a file)
  const cache = cacheDir ? (() => { try { return JSON.parse(readFileSync(join(cacheDir, "blame.json"), "utf8")); } catch { return {}; } })() : {};
  const order = ok.map((c) => c.full);
  const jobs = [], wholes = {};
  for (const c of cats) for (const f of c.files) {
    f.commits.sort((a, b) => order.indexOf(a.full) - order.indexOf(b.full));
    for (const x of f.commits) x.hunks = f.generated ? [] : hunksOf(repo, x.full, f.path);
    if (!whole || f.generated) continue;
    const at = f.commits.at(-1).full, key = `${at}:${f.path}`;
    jobs.push(async () => {
      const text = await gitAsync(repo, "show", `${at}:${f.path}`); if (text == null || text.length > 1.5e6) return;
      // each line the plan's commits wrote, with the commit (cached: blame is the slow part); marked when this kind's
      const by = (await blameByCommit(repo, at, f.path, cache)) || {};
      const mine = f.commits.map((x) => x.full), mark = Object.entries(by).filter(([sha]) => mine.includes(sha)).flatMap(([, ls]) => ls).sort((a, b) => a - b);
      // the file's text once for every kind that shows it (wholes), each kind its own marks
      if (!wholes[key]) wholes[key] = text.replace(/\n$/, "").split("\n").map(cutLine);
      f.whole = { at: at.slice(0, 7), key, n: wholes[key].length, mark };
    });
  }
  let i = 0; await Promise.all(Array.from({ length: 8 }, async () => { while (i < jobs.length) await jobs[i++](); }));
  if (cacheDir) { mkdirSync(cacheDir, { recursive: true }); writeFileSync(join(cacheDir, "blame.json"), JSON.stringify(cache)); }
  for (const c of cats) {
    const code = c.files.filter((f) => !f.generated);
    c.counts = { files: c.files.length, add: code.reduce((a, f) => a + f.add, 0), del: code.reduce((a, f) => a + f.del, 0), gen: c.files.length - code.length };
    c.commits = [...new Set(c.files.flatMap((f) => f.commits.map((x) => x.sha)))];
    c.files.sort((a, b) => Number(a.generated) - Number(b.generated) || (b.add + b.del) - (a.add + a.del));
  }
  // the record's group says what it holds: the plan folder's own parts, as git has them
  for (const c of cats.filter((x) => x.record)) { const tops = [...new Set(c.files.map((f) => f.path.slice(own.length + 1).split("/")[0]))];
    const hand = c.files.filter((f) => !f.generated).length;
    c.sum = tops.length ? `The plan's own folder, where no group above claims it: ${tops.map((t) => `\`${t}${c.files.some((f) => f.path.startsWith(`${own}/${t}/`)) ? "/" : ""}\``).join(", ")}${hand ? "" : ", all of it generated"}.` : ""; }
  cats = cats.filter((c) => c.files.length || c.runs.length || (c.sum && !c.record));
  // the runs, as they ran
  const runs = runsOf(planDir);
  for (const c of cats) for (const r of c.runs) if (!runs[r]) gaps.push({ where: `category "${c.name}"`, what: `names ${r}, which is not in runs/ (a real output comes from a saved run)`, fail: true });
  const claimed = new Set(cats.flatMap((c) => c.runs));
  const loose = Object.keys(runs).filter((r) => !claimed.has(r));
  // the counts, each file once: a file two kinds of change share is one file (a sum over the kinds counts it twice)
  const genPath = new Set(pairs.filter((x) => isGenerated(x.path) || x.bin).map((x) => x.path));
  const kindsOf = (p) => cats.filter((c) => c.files.some((f) => f.path === p)).length;
  const totals = { files: allPaths.length, hand: allPaths.filter((p) => !genPath.has(p)).length, gen: genPath.size, shared: allPaths.filter((p) => !genPath.has(p) && kindsOf(p) > 1).length, sharedGen: allPaths.filter((p) => genPath.has(p) && kindsOf(p) > 1).length, add: 0, del: 0, gadd: 0, gdel: 0 };
  for (const x of pairs) if (isGenerated(x.path) || x.bin) { totals.gadd += x.add; totals.gdel += x.del; } else { totals.add += x.add; totals.del += x.del; }
  return { from, commits: ok.map(({ sha, full, date, subject }) => ({ sha, full, date, subject })), started: wt.started, cats, wholes, runs, looseRuns: loose, totals,
    steps: wt.steps, calls: wt.calls, texts: wt.texts, gaps };
}

/** `git blame` of a file at a commit: { <full sha>: [line numbers it wrote] } for every commit with a line left, or null
 *  when git cannot blame it. Cached in `cache` under `key` (by default the commit and path: a file's blame at a commit
 *  never changes); `reel check --base` and `reel status` key theirs by the file's blob (lib/call-lines.mjs). */
export async function blameByCommit(repo, at, path, cache = {}, key = `${at}:${path}`) {
  if (cache[key]?.all) return cache[key].all;
  const b = await gitAsync(repo, "blame", "-s", "-l", at, "--", path); if (b == null) return null;
  const all = {}; for (const l of b.split("\n")) { const m = /^\^?([0-9a-f]{39,40})\s+(\d+)\)/.exec(l); if (m) (all[m[1]] ||= []).push(+m[2]); }
  cache[key] = { all };
  return all;
}

/** When each saved run came into the repo, from git: the commit that added `runs/<name>`, and whether it is one of the
 *  plan's own commits (saved while it was built) or a later one (saved after, for the guide). A file not committed yet
 *  says so. → { "runs/x.txt": { sha, date, subject, during } | { sha: null } } */
export function runsAdded(repo, planDir, names, planShas = []) {
  const out = {};
  for (const name of names) {
    const o = tryGit(repo, "log", "--diff-filter=A", "--follow", "--format=%h%x09%H%x09%cs%x09%s", "--", join(planDir, name));
    const last = o && o.trim().split("\n").filter(Boolean).at(-1);
    if (!last) { out[name] = { sha: null }; continue; }
    const [sha, full, date, subject] = last.split("\t");
    out[name] = { sha, date, subject, during: planShas.some((s) => full.startsWith(s) || s.startsWith(sha)) };
  }
  return out;
}
/** The commits after `since` (a sha) that touch `paths`, those whose subject matches `subject` (a RegExp) when given:
 *  what a Not done line's thing became since the build. → [{ sha, date, subject }] */
export function commitsSince(repo, since, { paths = [], subject = null } = {}) {
  const log = tryGit(repo, "log", "--format=%h%x09%cs%x09%s", `${since}..HEAD`, "--", ...paths) || "";
  return log.split("\n").filter(Boolean).map((l) => { const [sha, date, s] = l.split("\t"); return { sha, date, subject: s }; }).filter((c) => !subject || subject.test(c.subject));
}
/** A commit named in the text, as git has it (null when this clone does not have it). */
export const commitInfo = (repo, sha) => { const o = tryGit(repo, "show", "-s", "--format=%h%x09%cs%x09%s", sha); if (!o) return null; const [h, date, subject] = o.trim().split("\t"); return { sha: h, date, subject }; };
