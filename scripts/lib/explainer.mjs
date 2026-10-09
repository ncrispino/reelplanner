// An explainer (explain-first, steps 1, 2 and 5; D-250): a video of something that is already there, made so
// you understand it before deciding anything. What it can be of is open (files changed in an agent session or
// outside one, an experiment's output, a transcript, a log, a period…), so nothing here knows kinds of explainer.
// It knows sources: each one pinned by its FORM (how it is read and hashed) and described by its SHAPE (how a
// video and a guide show it), and one rule for the guide, by size.
//
//   <.reelplanner>/explainers/<date>-<slug>/
//     explain.md      what you asked, in your words; what it will cover and leave out
//     sources.json    { question, title, created, commit, sources: [pinned source …] }
//     video/          the video (kind: explainer), built as any other
//     reviews/        explainer-<time>.json and .md: Done, Explain more or Plan this; nothing in the decision log
//
// A pinned source: { id, form, shape, size: { lines, files? }, hash, guide, parts?, … } where
//   form   path (a file or a folder in the repo, at `commit`), outside (a file outside the repo: its path shown
//          as ~/…, its hash and line count, never its text, D-249), git (a commit or a range), worktree (what is
//          changed and not committed), since (the commits, decisions and reviews since a day), pr, ci, decision
//   shape  sequence (entries in time order), files, table (rows and columns), text
//   guide  whether it needs a guide part: far bigger than a video can show (GUIDE_LINES), by size, never kind
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative, dirname, extname, sep } from "node:path";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";
import { rpDirOf } from "./env.mjs";

/** Over this many lines a source is far longer than a video can show: it gets a guide part (plan step 1). */
export const GUIDE_LINES = 200;
export const SHAPES = ["sequence", "files", "table", "text"];
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const sha = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 16);
const linesOf = (text) => { const s = String(text); if (!s) return 0; const n = s.split("\n").length; return s.endsWith("\n") ? n - 1 : n; };
const git = (repo, ...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "pipe"] });
const tryGit = (repo, ...a) => { try { return git(repo, ...a); } catch { return null; } };

/** A path as it may be shown: your home as ~ (never /home/<you>/ on screen or in git). */
export function tilde(p) {
  const h = homedir(); const s = String(p);
  return h && (s === h || s.startsWith(h + sep)) ? `~${s.slice(h.length)}` : s;
}
const untilde = (p) => (String(p).startsWith("~/") || p === "~" ? join(homedir(), String(p).slice(2)) : String(p));

/** The shape of a file by what it holds: a line a time-ordered entry, rows and columns, or text. */
export function shapeOfFile(path, text = null) {
  const ext = extname(path).toLowerCase();
  if ([".jsonl", ".ndjson", ".log"].includes(ext)) return "sequence";
  if ([".csv", ".tsv"].includes(ext)) return "table";
  if (ext === ".json") {
    try { const j = JSON.parse(text ?? readFileSync(path, "utf8")); if (Array.isArray(j) && j.length && j.every((r) => r && typeof r === "object" && !Array.isArray(r))) return "table"; } catch { /* not JSON: text */ }
  }
  return "text";
}

/** The slug of what you asked: its first few plain words. */
export function slugOf(text, max = 6) {
  const stop = new Set("a an the of to in on for and or is are do does what whats how why me us this that please explain show tell walk through".split(" "));
  const words = String(text).toLowerCase().replace(/['’]/g, "").split(/[^a-z0-9]+/).filter(Boolean);
  const kept = words.filter((w) => !stop.has(w));
  return (kept.length ? kept : words).slice(0, max).join("-") || "explainer";
}

/** The repo's top folder from any path in it. */
export function repoTop(from) { const t = tryGit(existsSync(from) && statSync(from).isDirectory() ? from : dirname(from), "rev-parse", "--show-toplevel"); return t ? t.trim() : null; }

/** Claude Code's transcripts of a folder live under ~/.claude/projects/<the folder, its separators as dashes>/. */
export function sessionDir(repo) { return join(homedir(), ".claude", "projects", resolve(repo).replace(/[\\/.:]/g, "-")); }
/** The newest session transcript of this repo, or null. */
export function thisSession(repo) {
  const d = sessionDir(repo); if (!existsSync(d)) return null;
  const all = readdirSync(d).filter((f) => f.endsWith(".jsonl")).map((f) => ({ f: join(d, f), t: statSync(join(d, f)).mtimeMs })).sort((a, b) => b.t - a.t);
  return all[0]?.f || null;
}

// a file's pin: its hash, its lines, its shape, and whether it needs a guide part
function pinFile(abs, relPath, text) {
  const buf = text != null ? Buffer.from(text) : readFileSync(abs), t = buf.toString("utf8"), lines = linesOf(t);
  return { path: relPath, hash: sha(buf), lines, shape: shapeOfFile(abs, t) };
}
function filesUnder(repo, abs) {
  // tracked and untracked (not ignored) files under a folder of the repo; outside a repo, every file
  const inRepo = tryGit(repo, "ls-files", "-co", "--exclude-standard", "--", relative(repo, abs) || ".");
  if (inRepo != null) return inRepo.split("\n").filter(Boolean).map((p) => join(repo, p)).filter((p) => existsSync(p) && statSync(p).isFile());
  const out = []; const walk = (d) => { for (const f of readdirSync(d)) { if (f.startsWith(".")) continue; const p = join(d, f); statSync(p).isDirectory() ? walk(p) : out.push(p); } }; walk(abs); return out;
}

/**
 * Pin one source, given as you would name it. `repo` is the repo's top folder, `rp` its .reelplanner/.
 * Throws with a plain reason when it cannot be pinned (nothing by that name, gh not there).
 */
export function pinSource(spec, { repo, rp = rpDirOf(repo), head = null } = {}) {
  const s = String(spec).trim(); if (!s) throw new Error("an empty source");
  const HEAD = head || tryGit(repo, "rev-parse", "--short=12", "HEAD")?.trim() || null;
  // a decision, by its id
  if (/^D-\d{3,4}$/.test(s)) {
    const d = (readJson(join(rp, "decisions.json"))?.decisions || []).find((x) => x.id === s);
    if (!d) throw new Error(`${s} is not in the decision log`);
    const text = decisionText(d);
    return { id: s, form: "decision", shape: "text", size: { lines: linesOf(text) }, hash: sha(text), guide: false, said: `${s}: ${d.question} → ${d.chosen}` };
  }
  // the commits, decisions and reviews since a day
  let m = /^since:(\d{4}-\d{2}-\d{2})$/.exec(s);
  if (m) {
    const log = git(repo, "log", `--since=${m[1]}T00:00:00`, "--format=%h %ad %s", "--date=short");
    const commits = log.split("\n").filter(Boolean), first = commits.at(-1)?.split(" ")[0] || null;
    const decisions = (readJson(join(rp, "decisions.json"))?.decisions || []).filter((d) => String(d.date || "") >= m[1]).map((d) => d.id);
    const text = sinceText(repo, rp, m[1], HEAD);
    const lines = linesOf(text);
    return { id: s, form: "since", shape: "sequence", day: m[1], until: HEAD, from: first, size: { lines, commits: commits.length, decisions: decisions.length }, hash: sha(text), guide: lines > GUIDE_LINES };
  }
  // a pull request, through gh
  m = /^pr:(\d+)$/.exec(s);
  if (m) {
    let meta, diff; try { meta = JSON.parse(execFileSync("gh", ["pr", "view", m[1], "--json", "headRefOid,title,additions,deletions,files"], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })); diff = execFileSync("gh", ["pr", "diff", m[1]], { cwd: repo, encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "pipe"] }); }
    catch (e) { throw new Error(`gh could not read pull request ${m[1]} (${String(e.stderr || e.message).split("\n")[0]})`); }
    const changed = (meta.additions || 0) + (meta.deletions || 0);
    return { id: s, form: "pr", shape: "files", commit: meta.headRefOid?.slice(0, 12), title: meta.title, files: (meta.files || []).map((f) => ({ path: f.path })), size: { lines: changed, files: (meta.files || []).length }, hash: sha(diff), guide: changed > GUIDE_LINES };
  }
  // a CI run's log, through gh: its hash and line count; its text is read again where it is, never kept
  m = /^ci:(\d+)$/.exec(s);
  if (m) {
    let log; try { log = execFileSync("gh", ["run", "view", m[1], "--log"], { cwd: repo, encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "pipe"] }); }
    catch (e) { throw new Error(`gh could not read the log of run ${m[1]} (${String(e.stderr || e.message).split("\n")[0]})`); }
    const lines = linesOf(log);
    return { id: s, form: "ci", shape: "sequence", size: { lines }, hash: sha(log), guide: lines > GUIDE_LINES };
  }
  // what is changed and not committed
  if (s === "worktree") {
    const names = git(repo, "diff", "HEAD", "--numstat").split("\n").filter(Boolean).map((l) => l.split("\t")), untracked = git(repo, "ls-files", "-o", "--exclude-standard").split("\n").filter(Boolean);
    const changed = names.reduce((a, [p, d]) => a + (Number(p) || 0) + (Number(d) || 0), 0) + untracked.reduce((a, f) => a + linesOf(readFileSync(join(repo, f), "utf8")), 0);
    const files = [...names.map((x) => x[2]), ...untracked];
    const text = git(repo, "diff", "HEAD") + untracked.map((f) => `\n+++ ${f}\n${readFileSync(join(repo, f), "utf8")}`).join("");
    return { id: s, form: "worktree", shape: "files", commit: HEAD, files: files.map((p) => ({ path: p, hash: existsSync(join(repo, p)) ? sha(readFileSync(join(repo, p))) : null })), size: { lines: changed, files: files.length }, hash: sha(text), guide: changed > GUIDE_LINES };
  }
  // this repo's newest Claude Code session: a file outside the repo, read where it is
  if (s === "this-session") {
    const f = thisSession(repo); if (!f) throw new Error(`no Claude Code transcript for this repo under ${tilde(sessionDir(repo))}`);
    return { ...pinOutside(f), id: "this-session" };
  }
  // a path: in the repo (at the commit it is pinned at), or outside it (its path, hash and lines; never its text)
  const abs = resolve(untilde(s));
  if (existsSync(abs)) {
    const inside = !relative(repo, abs).startsWith("..") && !relative(repo, abs).startsWith(sep) && resolve(repo, relative(repo, abs)) === abs;
    if (!inside) return pinOutside(abs);
    const rel = relative(repo, abs).split(sep).join("/") || ".";
    const dirty = (p) => !!tryGit(repo, "status", "--porcelain", "--", p)?.trim();
    if (statSync(abs).isDirectory()) {
      const files = filesUnder(repo, abs).map((f) => pinFile(f, relative(repo, f).split(sep).join("/")));
      const lines = files.reduce((a, f) => a + f.lines, 0), parts = files.filter((f) => f.lines > GUIDE_LINES).map((f) => f.path);
      return { id: rel, form: "path", shape: "files", commit: HEAD, dirty: dirty(rel), files, size: { lines, files: files.length }, hash: sha(files.map((f) => `${f.path} ${f.hash}`).join("\n")), guide: parts.length > 0, ...(parts.length ? { parts } : {}) };
    }
    // a file of the repo is one of its files (the guide shows it whole, its lines marked); one that holds a log or
    // a table keeps that shape
    const f = pinFile(abs, rel), shape = f.shape === "text" ? "files" : f.shape;
    return { id: rel, form: "path", shape, commit: HEAD, dirty: dirty(rel), ...(shape === "files" ? { files: [f] } : {}), size: { lines: f.lines, ...(shape === "files" ? { files: 1 } : {}) }, hash: f.hash, guide: f.lines > GUIDE_LINES };
  }
  // a commit or a range of commits: the change to files it makes
  const range = /\.\./.test(s) ? s : `${s}^!`;
  const ends = s.split(/\.\.\.?/).filter(Boolean);
  if (ends.every((e) => tryGit(repo, "rev-parse", "--verify", "--quiet", `${e}^{commit}`))) {
    const num = git(repo, "diff", "--numstat", ...(/\.\./.test(s) ? [s] : [`${s}^`, s])).split("\n").filter(Boolean).map((l) => l.split("\t"));
    const changed = num.reduce((a, [p, d]) => a + (Number(p) || 0) + (Number(d) || 0), 0);
    const commits = Number(git(repo, "rev-list", "--count", range).trim()) || 0;
    const to = git(repo, "rev-parse", "--short=12", `${ends.at(-1)}^{commit}`).trim(), from = /\.\./.test(s) ? git(repo, "rev-parse", "--short=12", `${ends[0]}^{commit}`).trim() : null;
    return { id: s, form: "git", shape: "files", range: from ? `${from}..${to}` : `${to}^!`, commit: to, files: num.map((x) => ({ path: x[2] })), size: { lines: changed, files: num.length, commits }, hash: sha(git(repo, "diff", ...(from ? [`${from}..${to}`] : [`${to}^`, to]))), guide: changed > GUIDE_LINES };
  }
  throw new Error(`"${s}" is none of: a path, a commit or a range (a..b), worktree, since:<date>, pr:<n>, ci:<run-id>, this-session, a decision (D-233)`);
}
function pinOutside(abs) {
  const f = pinFile(abs, tilde(abs));
  return { id: tilde(abs), form: "outside", shape: f.shape, path: tilde(abs), size: { lines: f.lines }, hash: f.hash, guide: f.lines > GUIDE_LINES };
}
const decisionText = (d) => [`${d.id} (${d.date || ""}) ${d.question}`, `chosen: ${d.chosen}`, d.why ? `why: ${d.why}` : "", d.own ? `their words: ${d.own}` : "", d.note ? `note: ${d.note}` : ""].filter(Boolean).join("\n");
function sinceText(repo, rp, day, until) {
  const log = tryGit(repo, "log", `--since=${day}T00:00:00`, ...(until ? [until] : []), "--format=%h %ad %s%n%b", "--date=short") || "";
  const ds = (readJson(join(rp, "decisions.json"))?.decisions || []).filter((d) => String(d.date || "") >= day).map(decisionText).join("\n\n");
  return `${log}\n${ds}`;
}

/**
 * Pin every source; → { sources, errors }. Two names for one source are pinned once. A folder outside the repo (an
 * experiment's output, a folder of logs) has no commit to pin it at: each file in it is pinned on its own, by its
 * ~/ path, hash and lines, with its own shape (a results table, a config's text).
 */
export function pinAll(specs, opts) {
  const sources = [], errors = [], add = (p) => { if (!sources.some((x) => x.id === p.id)) sources.push(p); };
  for (const s of specs) {
    try {
      const abs = resolve(untilde(String(s).trim())), rel = relative(opts.repo, abs);
      if (existsSync(abs) && statSync(abs).isDirectory() && (rel.startsWith("..") || resolve(opts.repo, rel) !== abs)) {
        const files = filesUnder(dirname(abs), abs).sort();
        if (!files.length) throw new Error("an empty folder");
        for (const f of files) add(pinOutside(f));
      } else add(pinSource(s, opts));
    } catch (e) { errors.push(`${s}: ${e.message}`); }
  }
  return { sources, errors };
}

/** One line a source, as `explain` prints it and explain.md lists it. */
export function sourceLine(src) {
  const size = src.shape === "files" ? `${src.size.files ?? "?"} file${src.size.files === 1 ? "" : "s"}, ${src.size.lines} line${src.size.lines === 1 ? "" : "s"}${src.form === "git" || src.form === "pr" || src.form === "worktree" ? " changed" : ""}`
    : src.form === "since" ? `${src.size.commits} commits, ${src.size.decisions} decisions` : `${src.size.lines} line${src.size.lines === 1 ? "" : "s"}`;
  const at = src.form === "path" ? ` at ${src.commit}${src.dirty ? " (with changes not committed)" : ""}` : src.form === "git" ? ` (${src.range})` : src.form === "outside" ? " (outside the repo: its path and hash only, never its text)" : "";
  const guide = src.parts?.length ? `; a guide part for ${src.parts.join(", ")}` : src.guide ? "; needs a guide part" : "";
  return `\`${src.id}\` · ${src.shape} · ${size}${at}${guide}`;
}

// ── where an explainer lives, and what it holds ─────────────────────────────────────────────────────────
/** The explainer folder a path is in (the folder itself, its video/, a file in it), or null. */
export function explainerDirOf(p) {
  let d = resolve(p);
  for (let i = 0; i < 4 && d !== dirname(d); i++, d = dirname(d)) if (existsSync(join(d, "explain.md")) && existsSync(join(d, "sources.json"))) return d;
  return null;
}
export const readSources = (dir) => readJson(join(dir, "sources.json"));
/** The plans that start from an explainer: their plan.md says "Explained first: `<name>`" (explain-first step 4). */
export function plannedFrom(rp, name) {
  const d = join(rp, "plans"); if (!existsSync(d)) return [];
  const re = new RegExp(`^Explained first: \`${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\``, "m");
  return readdirSync(d).filter((p) => { try { return re.test(readFileSync(join(d, p, "plan.md"), "utf8")); } catch { return false; } }).sort();
}
/** How many commits have landed since the commit an explainer explains; null when that commit is not here. */
export function commitsSince(repo, commit) {
  if (!commit) return null;
  const n = tryGit(repo, "rev-list", "--count", `${commit}..HEAD`); return n == null ? null : Number(n.trim());
}
/** An explainer's review ends: done, more (Explain more) or plan (Plan this). */
export const END_WORDS = { done: "Done", more: "Explain more", plan: "Plan this" };
export const endOf = (review) => { const e = review?.end ?? review?.verdict; return ["done", "more", "plan"].includes(e) ? e : null; };

// ── reading a source again: what check-sources holds a quoted line against ──────────────────────────────
/**
 * The text a pinned source holds (for one file of it, `path`, when it is files). Repo files are read as they were
 * at the pinned commit, so a later edit never makes an old explainer fail. → { text, note } (text null when it
 * cannot be read here; `note` says why, or that it changed since it was pinned).
 */
export function sourceText(src, { repo, rp = rpDirOf(repo), path = null } = {}) {
  const at = (commit, p) => tryGit(repo, "show", `${commit}:${p}`);
  const disk = (p) => { try { return readFileSync(p, "utf8"); } catch { return null; } };
  switch (src.form) {
    case "decision": { const d = (readJson(join(rp, "decisions.json"))?.decisions || []).find((x) => x.id === src.id); return d ? { text: decisionText(d) } : { text: null, note: `${src.id} is no longer in the decision log` }; }
    case "since": return { text: sinceText(repo, rp, src.day, src.until) };
    case "outside": {
      const t = disk(untilde(src.path)); if (t == null) return { text: null, note: `${src.path} is not on this machine, so its quoted lines are not checked here` };
      return { text: t, ...(sha(Buffer.from(t)) !== src.hash ? { note: `${src.path} changed since it was pinned` } : {}) };
    }
    case "path": {
      const p = path || src.id;
      const t = (!src.dirty && src.commit ? at(src.commit, p) : null) ?? disk(join(repo, p));
      if (t == null) return { text: null, note: `${p} is neither at ${src.commit} nor on disk` };
      const pin = src.files ? src.files.find((f) => f.path === p) : { hash: src.hash };
      return { text: t, ...(src.dirty && pin && sha(Buffer.from(t)) !== pin.hash ? { note: `${p} changed since it was pinned (it had changes not committed then)` } : {}) };
    }
    case "git": {
      const [from, to] = src.range.endsWith("^!") ? [`${src.commit}^`, src.commit] : src.range.split("..");
      if (path) { const t = at(to, path) ?? at(from, path); return t != null ? { text: `${t}\n${tryGit(repo, "diff", from, to, "--", path) || ""}` } : { text: null, note: `${path} is not in ${src.range}` }; }
      const t = tryGit(repo, "log", "--format=%H%n%s%n%b", `${from}..${to}`), d = tryGit(repo, "diff", from, to);
      return t == null ? { text: null, note: `${src.range} is not in this clone` } : { text: `${t}\n${d}` };
    }
    case "worktree": {
      if (path) { const t = disk(join(repo, path)); return t == null ? { text: null, note: `${path} is gone` } : { text: t }; }
      return { text: tryGit(repo, "diff", src.commit || "HEAD") || "", note: "what was not committed may have been committed or changed since" };
    }
    case "pr": case "ci": {
      try { const t = execFileSync("gh", src.form === "pr" ? ["pr", "diff", src.id.slice(3)] : ["run", "view", src.id.slice(3), "--log"], { cwd: repo, encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "pipe"] }); return { text: t }; }
      catch { return { text: null, note: `gh could not read ${src.id} here, so its quoted lines are not checked` }; }
    }
    default: return { text: null, note: `${src.id}: a source form this version does not read (${src.form})` };
  }
}

/**
 * A scene's `- source:` refs → [{ ref, source, path, from, to }] or { ref, missing: true }. A ref is a pinned
 * source's id, a file in a pinned folder or change, or either with `:<line>` or `:<from>-<to>` after it.
 */
export function resolveRefs(value, sources) {
  return String(value || "").split(/\s*[,;]\s+|\s+·\s+/).map((x) => x.replace(/^`|`$/g, "").trim()).filter(Boolean).map((ref) => {
    const lm = /^(.*?):(\d+)(?:-(\d+))?$/.exec(ref), name = lm ? lm[1] : ref, lines = lm ? [Number(lm[2]), Number(lm[3] || lm[2])] : null;
    for (const cand of lm ? [ref, name] : [ref]) {
      const whole = sources.find((x) => x.id === cand);
      if (whole) return { ref, source: whole, path: null, ...(cand === name && lines ? { from: lines[0], to: lines[1] } : {}) };
      const inner = sources.find((x) => (x.files || []).some((f) => f.path === cand));
      if (inner) return { ref, source: inner, path: cand, ...(cand === name && lines ? { from: lines[0], to: lines[1] } : {}) };
    }
    return { ref, missing: true };
  });
}

// ── what must never be committed: a secret, an email address, a path in your home (step 5, D-249) ──────
const SECRETS = [
  ["an OpenAI or Anthropic key", /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{16,}/],
  ["a GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}/],
  ["an AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["a Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["a Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["a private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["a password", /\b(?:password|passwd|pwd|secret|token|api_?key)\s*[=:]\s*["']?(?!\S*REDACTED)[^\s"'`<>…]{6,}/i],
];
const EMAIL = /[A-Za-z0-9._%+-]+@(?!example\.(?:com|org|net)\b)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;
const HOME_PATH = /(?:^|[\s"'`(=])(\/home\/[^/\s"'`]+\/|\/Users\/[^/\s"'`]+\/|[A-Za-z]:\\Users\\[^\\\s"'`]+\\)/;
/** What in a text must be masked before it is committed: [{ what, found }] (the found text itself cut short). */
export function privateIn(text) {
  const out = [], s = String(text || "");
  for (const [what, re] of SECRETS) { const m = re.exec(s); if (m) out.push({ what, found: m[0] }); }
  const e = EMAIL.exec(s); if (e) out.push({ what: "an email address", found: e[0] });
  const h = HOME_PATH.exec(s); if (h) out.push({ what: "a path in a home folder (show it as ~/…)", found: h[1] });
  return out;
}
/** A found secret, shown by its kind's prefix only (`ghp_…`), so the check's own output never repeats any of it. */
const PREFIX = /^(?:sk-(?:ant-|proj-)?|gh[pousr]_|github_pat_|AKIA|AIza|xox[abprs]-|-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:password|passwd|pwd|secret|token|api_?key)\s*[=:]\s*["']?)/i;
export const cut = (s) => { const t = String(s), m = PREFIX.exec(t); return m ? `${m[0]}…` : t.length > 8 ? `${t.slice(0, 3)}…` : t; };
/** The masked form to put in the text instead: the prefix, then …REDACTED (`ghp_…REDACTED`). */
export const maskOf = (s) => `${cut(s).replace(/…$/, "")}…REDACTED`;

// ── what Finish offers next (step 3, after the walkthrough review) ──────────────────────────────────────────
// Explain more and Plan this are not templates: for the video just watched, Finish offers what each would mean, drawn
// from the explainer's own content. These are the ones made at build time, into the plan map (`explainer.next`), so a
// hosted page offers them with no server; the player adds the viewer's own (a comment, a rewind, a word looked up, a
// question asked) and puts the ones on scenes the viewer went back to first.
//   more   a scene's `- next_more:`; each source long enough for a guide part, on the scene that quotes it ("go deeper
//          on …"); each line of explain.md's "What it leaves out"
//   plan   a scene's `- next_plan:`; each line of explain.md's "Open threads"
// Each is { id, text, why, scene? , source? }. A line ending "(scene N)" is on that scene.
/** The bullets of one `## <heading>` section of explain.md, the comment that asks for them left out. */
export function mdSection(md, heading) {
  const m = new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$([\\s\\S]*?)(?=^##\\s|(?![\\s\\S]))`, "mi").exec(String(md || ""));
  if (!m) return [];
  return m[1].replace(/<!--[\s\S]*?-->/g, "").split("\n").map((l) => /^\s*[-*]\s+(.+)$/.exec(l)?.[1].trim()).filter(Boolean);
}
// a line's own scene, "(scene 4)" at its end, taken off it
const onScene = (line) => { const m = /\s*\(scenes?\s+(\d+)[^)]*\)\s*\.?$/i.exec(line); return m ? { text: line.slice(0, m.index).trim(), scene: Number(m[1]) } : { text: line.trim(), scene: null }; };
// the words of a thing a plan would do ("make the sweeper run on a timer") read as a plan: "A plan to make …"
const DOING = /^(?:make|add|let|move|split|drop|keep|stop|run|show|turn|give|allow|support|fix|change|remove|rename|replace|write|build|cache|check|retry|limit|merge|cut|send|save|store|track|log|warn|ask|test|measure|compare|speed|time|put|use|read|file|open|close|start|end|clear|clean|say|name|list|tell|mark|sort|group|hide|link|count|wake|notify|poll|queue|lock|expire|pin|mask|explain|document|record|keep)\b/i;
const lowerFirst = (s) => /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
const upperFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const asPlan = (line) => { const t = String(line).trim().replace(/[.;]\s*$/, ""); return /^a plan\b/i.test(t) ? t.replace(/^a/, "A") : DOING.test(t) ? `A plan to ${lowerFirst(t)}` : `A plan for what is open: ${lowerFirst(t)}`; };
/**
 * What Finish offers under Explain more and Plan this, for one explainer: → { more: [...], plan: [...] }.
 * `frames` are the plan map's (index, title, source, chapterStart, nextMore, nextPlan); `sources` its pinned sources;
 * `explainMd` the explainer's explain.md.
 */
export function nextSuggestions({ frames = [], sources = [], explainMd = "" } = {}) {
  const more = [], plan = [], seen = new Set();
  const push = (list, s) => { const k = `${list === more ? "m" : "p"}:${s.text.toLowerCase()}`; if (!s.text || seen.has(k)) return; seen.add(k); list.push({ id: `${list === more ? "m" : "p"}${list.length + 1}`, ...s }); };
  const title = (n) => frames.find((f) => f.index === n)?.title || null;
  // the agent's own, on the scene it is about
  for (const f of frames) if (f.nextMore) push(more, { text: upperFirst(f.nextMore.trim().replace(/[.;]\s*$/, "")), why: `scene ${f.index}${f.title ? `, "${f.title}"` : ""}`, scene: f.index });
  // a source far longer than the video: go deeper on it, from the scene that quotes it
  for (const s of sources.filter((x) => x.guide)) {
    const names = s.parts?.length ? s.parts : [s.path && s.form === "outside" ? s.path : s.id];
    for (const name of names) {
      const f = frames.find((x) => x.source && resolveRefs(x.source, sources).some((r) => r.source?.id === s.id && (!s.parts?.length || r.path === name)));
      const lines = s.parts?.length ? (s.files || []).find((x) => x.path === name)?.lines : s.size?.lines;
      push(more, { text: `Go deeper on \`${name}\`${f ? `, past the lines scene ${f.index} quotes` : ""}`, why: `${lines ? `${lines} lines` : "a long source"}, far more than the video shows${f ? ` · scene ${f.index}${f.title ? `, "${f.title}"` : ""}` : ""}`, ...(f ? { scene: f.index } : {}), source: name });
    }
  }
  for (const line of mdSection(explainMd, "What it leaves out")) { const { text, scene } = onScene(line); push(more, { text: `Explain what it left out: ${lowerFirst(text).replace(/[.;]\s*$/, "")}`, why: `explain.md, what it leaves out${scene ? ` · scene ${scene}${title(scene) ? `, "${title(scene)}"` : ""}` : ""}`, ...(scene ? { scene } : {}) }); }
  for (const f of frames) if (f.nextPlan) push(plan, { text: asPlan(f.nextPlan), why: `scene ${f.index}${f.title ? `, "${f.title}"` : ""}`, scene: f.index });
  for (const line of mdSection(explainMd, "Open threads")) { const { text, scene } = onScene(line); push(plan, { text: asPlan(text), why: `explain.md, open threads${scene ? ` · scene ${scene}${title(scene) ? `, "${title(scene)}"` : ""}` : ""}`, ...(scene ? { scene } : {}) }); }
  // nothing of its own to go deeper on: each chapter, by its title
  if (!more.length) for (const f of frames.filter((x) => x.chapterStart)) push(more, { text: `Go deeper on "${f.chapterStart}"`, why: `the chapter from scene ${f.index}`, scene: f.index });
  return { more, plan };
}
/** What was picked at Finish, as the review carries it: { end, pick: { id, text, why, scene? } | null, words, edited }. */
export const nextOf = (review) => { const n = review?.next; return n && typeof n === "object" ? n : null; };

// ── a review of an explainer (step 3): comments by scene, the questions asked, what you want next ──────────
const clock =(t) => { const s = Math.max(0, Math.round(Number(t) || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const quote = (s) => `"${String(s).replace(/\s+/g, " ").trim()}"`;
/** Your comments, each on its scene: [{ scene, title, t, text }] (the page's own marks with no words left out). */
export function commentsOf(review) {
  return (review?.annotations || []).filter((a) => a.kind !== "approve" && !a.open && String(a.comment || "").trim())
    .map((a) => ({ scene: a.frame?.index ?? null, title: a.frame?.title || null, t: a.t ?? null, text: String(a.comment).trim(),
      // a note highlighted in the guide (packages/player/guide-review.js): where in it, and the words it is on
      ...(a.via === "guide" && a.detail ? { where: a.detail.where || null, quote: a.detail.text || null } : {}) }))
    .sort((a, b) => (a.scene ?? 1e9) - (b.scene ?? 1e9) || (a.t ?? 0) - (b.t ?? 0));
}
/** The questions asked on the page (Ask about this), with their answers where there are. */
export const askedOf = (review) => (Array.isArray(review?.questions) ? review.questions : []).filter((x) => String(x?.question || "").trim());
/** What you want next: your words under Finish (the note the page keeps with `open: true`), and the review's note. */
export const wantNextOf = (review) => [...(review?.annotations || []).filter((a) => a.open && String(a.comment || "").trim()).map((a) => String(a.comment).trim()), ...(String(review?.note || "").trim() ? [String(review.note).trim()] : [])];

/** reviews/<id>.md for an explainer's review: what came of it, and nothing for the decision log. */
export function explainerReviewMd({ id, review, name }) {
  const end = endOf(review), L = [];
  const day = String(review?.submittedAt || review?.exportedAt || "").replace("T", " ").slice(0, 16);
  L.push(`# Explainer review · ${day || id} · ${end ? END_WORDS[end] : "not finished"}`, "");
  L.push(end === "done" ? "**Done:** you know what you wanted to know. Nothing to rebuild." : end === "more" ? "**Explain more:** the next version rebuilds the scenes your comments are on, and adds a scene for each question below; fresh eyes again. It is a new build of the same explainer."
    : end === "plan" ? `**Plan this:** a plan starts from what you said: \`reel new-plan <repo> <slug> --from .reelplanner/explainers/${name}\` quotes it in the plan's problem, and its video leans on this explainer (D-248).` : "**Not finished:** ask before acting.", "");
  L.push("**Nothing goes into the decision log.** It holds only answers to a plan's questions, and an explainer asks none: a comment here is kept with this review, and reaches a decision only by way of a plan (Plan this).", "");
  const cs = commentsOf(review), qs = askedOf(review), next = wantNextOf(review), checks = review?.quizzes || [];
  L.push(`From [${id}.json](${id}.json): ${[cs.length && `${cs.length} comment${cs.length === 1 ? "" : "s"}`, qs.length && `${qs.length} question${qs.length === 1 ? "" : "s"}`, checks.length && `${checks.length} quick check${checks.length === 1 ? "" : "s"}`].filter(Boolean).join(", ") || "nothing said"}; watched ${Math.round((review?.watch?.completion ?? 0) * 100)}%.`, "");
  L.push("## Comments by scene", "");
  if (!cs.length) L.push("_None._");
  for (const c of cs) L.push(`- ${c.scene != null ? `**Scene ${c.scene}**${c.title ? ` (${c.title})` : ""}` : "**Not on a scene**"}${c.t != null ? `, at ${clock(c.t)}` : ""}: ${quote(c.text)}${c.where || c.quote ? ` (in the guide${c.where ? `, ${c.where}` : ""}${c.quote ? `, pointing at ${quote(c.quote)}` : ""})` : ""}`);
  L.push("", "## Questions you asked", "");
  if (!qs.length) L.push("_None._");
  for (const x of qs) {
    L.push(`- ${x.frame?.index ? `scene ${x.frame.index}` : "no scene"}${x.t != null ? `, at ${clock(x.t)}` : ""}: ${quote(x.question)}`);
    L.push(String(x.answer || "").trim() ? `  - answered${x.from ? ` from ${x.from}` : ""}: ${quote(String(x.answer).slice(0, 400))}` : "  - not answered on the page: answer it in the next version (Explain more), or in the plan (Plan this)");
  }
  L.push("", "## What you want next", "");
  const nx = nextOf(review), pick = nx?.pick && (!nx.end || nx.end === end) ? nx.pick : null;
  if (pick) L.push(`- **Picked** from what Finish suggested for ${END_WORDS[nx.end || end] || "this video"}: ${quote(pick.text)} (${pick.why || "suggested"})${nx.edited ? "; then edited, your words below" : ""}`, "");
  const own = next.filter((w) => !(pick && !nx.edited && w === pick.text));
  if (own.length || !pick) L.push(...(own.length ? own.map((w) => `> ${w.replace(/\n/g, "\n> ")}`) : ["_Nothing written._"]));
  if (end === "more") { const scenes = [...new Set([pick?.scene, ...cs.map((c) => c.scene)].filter((x) => x != null))].sort((a, b) => a - b);
    L.push("", `**For the next version:** ${[scenes.length ? `rebuild scene${scenes.length === 1 ? "" : "s"} ${scenes.join(", ")}` : "", qs.length ? `a scene for each question above` : "", pick && pick.scene == null ? `a scene for ${quote(nx.edited && next[0] ? next[0] : pick.text)}` : ""].filter(Boolean).join("; ") || "what you wrote above"}, keeping frame ids; fresh eyes again.`); }
  const missed = checks.filter((k) => k.correct === false);
  if (checks.length) L.push("", "## Quick checks", "", `${checks.length - missed.length} of ${checks.length} answered as the video did${missed.length ? `; missed: ${missed.map((k) => String(k.id).toUpperCase()).join(", ")} (the scene before it may not have made it plain)` : ""}.`);
  return L.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

/** The words a plan quotes in its problem when it starts from an explainer (step 4): the review's, by scene. */
export function planQuotes({ name, review, reviewId }) {
  const cs = commentsOf(review), qs = askedOf(review), next = wantNextOf(review), L = [];
  L.push(`What you said on the explainer \`${name}\`${reviewId ? ` (\`reviews/${reviewId}.md\`)` : ""}:`, "");
  for (const c of cs) L.push(`- **Scene ${c.scene ?? "?"}**${c.title ? ` (${c.title})` : ""}: ${quote(c.text)}`);
  for (const x of qs) L.push(`- **You asked**${x.frame?.index ? ` on scene ${x.frame.index}` : ""}: ${quote(x.question)}${String(x.answer || "").trim() ? `, answered${x.from ? ` from ${x.from}` : ""}: ${quote(String(x.answer).slice(0, 300))}` : " (not answered on the page)"}`);
  const nx = nextOf(review), pick = nx?.pick && (!nx.end || nx.end === "plan") ? nx.pick : null;
  if (pick) L.push(`- **Picked at Finish:** ${quote(pick.text)} (suggested from ${pick.why || "the video"})${nx.edited ? ", then put in your words:" : ""}`);
  for (const w of next) if (!(pick && !nx.edited && w === pick.text)) L.push(`- **What you want next:** ${quote(w)}`);
  if (!cs.length && !qs.length && !next.length && !pick) L.push("- (nothing written in the review: the plan's problem is in your words from the conversation)");
  return L.join("\n");
}
