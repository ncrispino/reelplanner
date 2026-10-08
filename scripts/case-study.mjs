#!/usr/bin/env node
// reel case-study — one prompt, three arms (text only, HTML, ours), each to a finished site, and the page
// that sets them side by side (the case-study plan, .reelplanning/plans/2026-09-26-case-study/).
//
//   reel case-study <slug> --prompt <file> [--from <commit>] [--folder <name>] [--title <words>]
//                   [--model <id>] [--claude-code <version>] [--into <dir>]
//       make <into>/<slug>/ (default eval/case-studies/<slug>/): the prompt, the start, one folder per arm
//       with its sheet, its container and its preflight, the feedback sheet, the rubric, the judge's
//       prompt, the write-up's words (README.md) and numbers (data/), and REPLICATE.md filled in
//   reel case-study report <slug|dir> [--publish] [--into <dir>]
//       build case-study.html from the folder, the nine sections of TEMPLATE.md in order, and warn on each
//       section still empty; with --publish, refuse (exit 1, nothing written) until all nine are filled
//   reel case-study keep <slug|dir> <arm> [<site-dir>] [--replace] [--into <dir>]
//       when an arm ends, keep its finished site (D-247): its files in arms/<arm>/site/, its history (HEAD,
//       branches, tags) as arms/<arm>/site.bundle, checked with `git bundle verify`; a history holding a voice
//       file or a render is refused (D-305). <site-dir> is the arm's own site/ (the default, the folder its
//       container mounted: its .git goes once the bundle verifies) or a clone elsewhere (its tracked files copied in)
//   reel case-study keep <slug|dir> --check
//       each arm's kept site: its files there, no .git of its own, and its site.bundle verifies (exit 1 if not)
//   reel case-study provenance <slug|dir> <arm> <transcript-dir> [--site <site-dir>] [--into <dir>]
//       add to arms/<arm>/provenance.json (kit/provenance.sh writes the rest) what the arm's transcripts say ran:
//       the models and Claude Code versions, the first and last times, prompts, responses and tool calls, from
//       metadata only; with --site, the voice and model each video was narrated with
//
// The kit it copies is in eval/case-studies/ (TEMPLATE.md, REPLICATE.md, kit/). Same as `reelplanning case-study`.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, statSync, chmodSync, rmSync, mkdtempSync, realpathSync, cpSync } from "node:fs";
import { resolve, join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { ROOT, VERSION } from "./lib/env.mjs";

const KIT = join(ROOT, "eval", "case-studies");
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const has = (n) => argv.includes(`--${n}`);
const read = (p) => readFileSync(p, "utf8");
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };
const today = () => new Date().toISOString().slice(0, 10);

// Pinned in each arm's Dockerfile, and recorded in REPLICATE.md (A1 in the plan's walkthrough).
export const MODEL = "claude-opus-5-5";
export const CLAUDE_CODE = "2.1.283";

export const STAGES = ["plan", "review", "revise", "build", "check the result", "fix", "done"];
/** The three arms, and what happens at each of the seven stages (the plan's table, step 1). */
export const ARMS = [
  { id: "text", title: "Text only", claudeArgs: " --permission-mode plan", do: [
    "plan mode, the prompt as typed; answer its questions in chat",
    "read the plan, answer its questions in chat",
    "the agent edits the plan",
    "approve; it builds",
    "its closing summary and `git diff --stat`, then open the site",
    "ask in chat",
    "you would ship it"] },
  { id: "html", title: "HTML", claudeArgs: "", do: [
    "the prompt, plus the HTML paragraph (`prompt.txt`)",
    "read `plan.html` in a browser, notes in chat",
    "the agent edits `plan.html`",
    "\"build what plan.html says\"",
    "ask for `report.html` (`report.prompt.txt`), read it, then open the site",
    "ask in chat",
    "you would ship it"] },
  { id: "ours", title: "Ours (reelplanning)", claudeArgs: "", do: [
    "\"Use reelplanning to plan: \" and the prompt; the plan video",
    "the plan video on the review page",
    "revised steps, rebuilt scenes",
    "build, choices recorded, stop at a step's fifth",
    "code check by a fresh agent, `reel audit`, the walkthrough video",
    "flags on the walkthrough, fixes",
    "accepted; the system video current"] },
];
export const ARM_IDS = ARMS.map((a) => a.id);
const MEASURES = ["asked", "engaging", "phone", "facts", "change"];

const COPY_NOTE = "This is this case study's own copy (the generic one is `eval/case-studies/REPLICATE.md`), with the\nversions, the model, the dates and the container filled in. Keep it up to date as you go (the dates\nespecially).\n\n";
const fill = (s, v) => s.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in v ? v[k] : m));
const pad = (n) => String(n).padStart(2, "0");
const stageFile = (i) => `${pad(i + 1)}-${STAGES[i].replace(/\s+/g, "-")}.png`;

// ---------- the scaffold ----------
function claudeVersion() {
  try { return (execFileSync("claude", ["--version"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).match(/\d+\.\d+\.\d+/) || [])[0] || CLAUDE_CODE; } catch { return CLAUDE_CODE; }
}

function sheet(arm, v) {
  const stages = STAGES.map((s, i) => [
    `## ${i + 1}. ${s}`, "",
    `What you do: ${arm.do[i]}.`, "",
    "- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_",
    "- Questions the agent asked, and your answers, word for word:",
    "- What you saw, and what you said (your feedback points: which, and how):",
    `- Screenshots: \`shots/${stageFile(i)}\``, ""].join("\n")).join("\n");
  return fill(read(join(KIT, "kit", "SHEET.md")), { ...v, arm_title: arm.title, first_prompt: v.first[arm.id].trimEnd(), stages });
}

// reelplanning is not on npm yet (`npm view reelplanning` says 404): it installs from GitHub (docs/reference.md,
// "Install"), and while the repo is private from a tarball `npm pack` makes in a checkout. The one place the kit names it.
export const GITHUB = "github:ncrispino/reelplanning";
const lines = (...l) => l.join("\n") + "\n";
const dockerExtra = {
  text: { root: "", user: "", net: "" },
  html: { root: "", user: "", net: "" },
  // this arm only: reelplanning, its skill and its video tools (ffmpeg, a headless Chrome, TTS, whisper.cpp)
  ours: {
    // the review page `reelplanning review` serves inside the container, on its 127.0.0.1:8787, opens in your browser
    net: " --network host",
    root: lines(
      "# this arm only: what reelplanning's video tools need (ffmpeg; unzip for Chrome; Python for the TTS; a compiler for whisper.cpp; a headless Chrome's libraries)",
      "RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg unzip python3 python3-pip python3-venv cmake build-essential \\",
      " && npx -y playwright-core install-deps chromium && rm -rf /var/lib/apt/lists/*",
      "# this arm only: reelplanning itself, not on npm yet: a reelplanning-<version>.tgz beside this file when there is one (`npm pack`",
      "# in a checkout, while the repo is private: REPLICATE.md, \"1. Install\"), else from GitHub",
      `ARG REELPLANNING=${GITHUB}`,
      "COPY smoke.sh reelplanning*.tgz /opt/case-study/",
      "RUN t=$(ls /opt/case-study/reelplanning*.tgz 2>/dev/null | head -n1); npm i -g \"${t:-$REELPLANNING}\" && rm -f /opt/case-study/reelplanning*.tgz"),
    user: "\n" + lines(
      "# this arm only: the skill (from the package just installed), reelplanning's setup, and a smoke render that proves",
      "# the image makes a video: a line of speech, its word timings, ten seconds of video (REPLICATE.md, \"1. Install\")",
      "RUN npx -y skills add \"$(npm root -g)/reelplanning\" --skill plan-to-video -g -y -a claude-code \\",
      " && reelplanning setup && sh /opt/case-study/smoke.sh").trimEnd(),
  },
};

const MEDIA_EXT = ["wav", "mp3", "m4a", "mp4", "webm", "mov"];
/**
 * What the site's git leaves out, written to its .git/info/exclude when the arm starts (start.sh; RUNBOOK.md in a
 * cloud session): the built videos' media, as in a shared repo (templates/gitignore), and any voice file, video or
 * render under .reelplanning/. D-305: no voice files or renders are committed anywhere, and a kept site's history
 * is committed here, as site.bundle.
 */
export function siteExclude() {
  const shared = read(join(ROOT, "templates", "gitignore")).split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  return lines("# reel case-study: the built videos' media stay out of the site's history (D-305; `reel case-study keep` refuses a history holding them)",
    ...shared, ".reelplanning/system-video/assets/", ".reelplanning/system-video/capture/", ".reelplanning/**/renders/",
    ...MEDIA_EXT.map((e) => `.reelplanning/**/*.${e}`), "# keys (narration's OPENROUTER_API_KEY …) stay out of the history: the site is published", ".env", "**/.env");
}
/** A path a kept site's history must not hold (D-305): a voice file, a video or a render under .reelplanning/. */
export const isMedia = (p) => p.startsWith(".reelplanning/") && (new RegExp(`\\.(${MEDIA_EXT.join("|")})$`, "i").test(p) || p.includes("/renders/"));

function scaffold() {
  const slug = argv[0];
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug || "")) die("usage: reel case-study <slug> --prompt <file> [--from <commit>] [--folder <name>] (a slug is lower-case letters, digits and dashes)");
  const promptPath = flag("prompt") || die("case-study: --prompt <file> (the user's words, as typed)");
  if (!existsSync(promptPath)) die(`no such prompt file: ${promptPath}`);
  const dir = resolve(flag("into", "eval/case-studies"), slug);
  if (existsSync(dir)) die(`${relative(process.cwd(), dir) || dir} exists: a case study is made once (edit its files, or pick another slug)`);
  const prompt = read(promptPath), from = flag("from"), folder = flag("folder", slug);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(folder)) die(`--folder ${folder}: one folder name, no slashes`);
  const rel = relative(process.cwd(), dir) || ".";
  const html = { plan: read(join(KIT, "kit", "html-plan.txt")).trim(), report: read(join(KIT, "kit", "html-report.txt")).trim() };
  const first = { text: prompt, html: `${prompt.trimEnd()}\n\n${html.plan}\n`, ours: `Use reelplanning to plan: ${prompt}` };
  // the start: nothing (greenfield), or a commit and its file list
  let start = "empty (greenfield)", startFiles = { "README.md": "# The start\n\nNothing: the agent starts in an empty folder (`git init` only). This case study is greenfield.\n" };
  if (from) {
    let sha, subject, files;
    try {
      sha = execFileSync("git", ["rev-parse", "--verify", `${from}^{commit}`], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
      subject = execFileSync("git", ["log", "-1", "--format=%s", sha], { encoding: "utf8" }).trim();
      files = execFileSync("git", ["ls-tree", "-r", "--name-only", sha], { encoding: "utf8" });
    } catch { die(`--from ${from}: not a commit in the repo here`); }
    const n = files.split("\n").filter(Boolean).length;
    start = `commit \`${sha.slice(0, 12)}\` (${n} files)`;
    startFiles = {
      "README.md": `# The start\n\nEach arm starts from commit \`${sha}\` ("${subject}"), ${n} files, listed in \`files.txt\`. Check it out into the arm's \`site/\` before its container starts (\`git -C <repo> archive ${sha.slice(0, 12)} | tar -x -C site\`, then commit it there as the first commit), and say in the sheet that the folder was not empty on purpose: the preflight's first line will be ✗.\n`,
      "commit.txt": `${sha}\n`, "files.txt": files,
    };
  }
  const cc = flag("claude-code", claudeVersion()), model = flag("model", MODEL);
  const v = { slug, dir: rel, folder, version: VERSION, claude_code_version: cc, model, start, date: today(), first,
    title: flag("title", slug.replace(/-/g, " ")), html_plan_paragraph: html.plan, html_report_prompt: html.report };

  mkdirSync(join(dir, "start"), { recursive: true }); mkdirSync(join(dir, "data"), { recursive: true });
  copyFileSync(promptPath, join(dir, "prompt.md"));   // byte for byte
  for (const [f, s] of Object.entries(startFiles)) writeFileSync(join(dir, "start", f), s);
  for (const arm of ARMS) {
    const a = join(dir, "arms", arm.id);
    for (const d of ["site", "shots"]) mkdirSync(join(a, d), { recursive: true });
    writeFileSync(join(a, "SHEET.md"), sheet(arm, v));
    writeFileSync(join(a, "prompt.txt"), first[arm.id]);
    if (arm.id === "html") writeFileSync(join(a, "report.prompt.txt"), `${html.report}\n`);
    writeFileSync(join(a, "Dockerfile"), fill(fill(read(join(KIT, "kit", "Dockerfile")), dockerExtra[arm.id]), { ...v, arm: arm.id }));
    writeFileSync(join(a, "start.sh"), fill(read(join(KIT, "kit", "start.sh")), { ...v, claude_args: arm.claudeArgs }));
    copyFileSync(join(KIT, "kit", "preflight.sh"), join(a, "preflight.sh"));
    writeFileSync(join(a, "site.exclude"), siteExclude());
    if (arm.id === "ours") copyFileSync(join(KIT, "kit", "smoke.sh"), join(a, "smoke.sh"));
    for (const f of ["start.sh", "preflight.sh", "smoke.sh"]) if (existsSync(join(a, f))) chmodSync(join(a, f), 0o755);
  }
  writeFileSync(join(dir, "FEEDBACK.md"), read(join(KIT, "kit", "FEEDBACK.md")));
  writeFileSync(join(dir, "RUBRIC.md"), read(join(KIT, "kit", "RUBRIC.md")));
  writeFileSync(join(dir, "JUDGE.md"), fill(read(join(KIT, "kit", "JUDGE.md")), v));
  // (the template links the kit's RUBRIC.md and JUDGE.md where it sits; the copy has its own beside it)
  writeFileSync(join(dir, "README.md"), fill(read(join(KIT, "TEMPLATE.md")).replace(/^<!--[\s\S]*?-->\s*/, ""), v).replaceAll("](kit/", "]("));
  // the copy says it is one, in place of the generic page's paragraph about copies
  writeFileSync(join(dir, "REPLICATE.md"), fill(read(join(KIT, "REPLICATE.md")), v).replace(/^`reel case-study <slug>[^\n]*\n(?:[^\n]+\n)*?\n/m, COPY_NOTE)
    // the copy is a folder deeper than the generic page: its relative links go up one more
    .replace(/\]\((?!https?:|#|\/)([^)]+)\)/g, "](../$1)"));
  for (const [f, d] of Object.entries(emptyData())) writeFileSync(join(dir, "data", f), JSON.stringify(d, null, 2) + "\n");

  console.log(`✓ ${rel}: the case study's folder (the start: ${start})`);
  for (const l of tree(dir)) console.log(`  ${l}`);
  console.log(`next: write FEEDBACK.md from the prompt alone, then run the arms (ours first, a day between), each as REPLICATE.md says. At the end: reel case-study report ${slug}`);
}

/** The numbers files the page reads, empty (A3 in the plan's walkthrough). Each says what it holds. */
export function emptyData() {
  const perArm = (f) => Object.fromEntries(ARM_IDS.map((a) => [a, f(a)]));
  return {
    "times.json": { about: "Minutes per stage, per arm, from the sheets: on the clock, and how much of it was yours.", unit: "minutes", stages: STAGES,
      arms: perArm(() => Object.fromEntries(STAGES.map((s) => [s, { clock: null, yours: null }]))) },
    "counts.json": { about: "Per arm: the questions the agent asked you, the decisions recorded in its plan and chat, and how many of those the code kept to (the code check, run on all three).",
      arms: perArm(() => ({ questions: null, decisions: null, kept: null })) },
    "sites.json": { about: "Per arm: how to run the finished site, and its screenshots, the same three screens at 390 px (phone) and 1440 px (desktop).",
      arms: perArm((a) => ({ run: "", phone: [1, 2, 3].map((i) => `arms/${a}/shots/site-phone-${i}.png`), desktop: [1, 2, 3].map((i) => `arms/${a}/shots/site-desktop-${i}.png`) })) },
    "judge.json": { about: "The blind judge's answer, as JUDGE.md asks for it: each site's five scores (1 to 5) with a line of evidence each, its ranking, and its reasons.",
      measures: MEASURES, sites: Object.fromEntries(["X", "Y", "Z"].map((k) => [k, { scores: Object.fromEntries(MEASURES.map((m) => [m, { score: null, evidence: "" }])) }])), ranking: [], reasons: "" },
    "key.json": { about: "Which arm each of X, Y and Z is. Filled in only once the judge's scores are in.", X: null, Y: null, Z: null },
    "ranking.json": { about: "Your own ranking of the three arms' sites, best first, made before you read the judge's scores.", ranking: [], why: "" },
    "links.json": { about: "Every artifact, per arm: the plans, the reviews, the videos, the pages, the commits. Each is { kind, label, href }.",
      arms: perArm(() => []) },
  };
}

function tree(dir) {
  const out = [];
  const walk = (d, pre) => {
    const es = readdirSync(d).sort((a, b) => (statSync(join(d, b)).isDirectory() - statSync(join(d, a)).isDirectory()) || a.localeCompare(b));
    es.forEach((e, i) => {
      const p = join(d, e), last = i === es.length - 1, isDir = statSync(p).isDirectory();
      out.push(`${pre}${last ? "└─" : "├─"} ${e}${isDir ? "/" : ""}`);
      if (isDir) walk(p, `${pre}${last ? "   " : "│  "}`);
    });
  };
  walk(dir, "");
  return out;
}

// ---------- keeping a finished site (D-247) ----------
const gitIn = (cwd, ...a) => spawnSync("git", a, { cwd, encoding: "utf8", maxBuffer: 256 << 20 });
/** The site's history, as kept: HEAD, its branches and its tags (not refs/original/ a filter-branch leaves, nor a stash). */
const SITE_REFS = ["HEAD", "--branches", "--tags"];
/** The case study's folder, from a slug (under --into, default eval/case-studies) or a path. */
const studyDir = (target) => (existsSync(join(resolve(target), "README.md")) ? resolve(target) : resolve(flag("into", "eval/case-studies"), target));
/**
 * A bundle verifies: `git bundle verify` (run in a new empty repository, since git wants one to verify in; a
 * bundle made with --all needs nothing from it) and it has a HEAD. → { ok, heads, error }
 */
export function verifyBundle(path) {
  if (!existsSync(path)) return { ok: false, heads: [], error: "no site.bundle" };
  const scratch = mkdtempSync(join(tmpdir(), "reel-bundle-"));
  try {
    gitIn(scratch, "init", "-q");
    const v = gitIn(scratch, "bundle", "verify", resolve(path));
    const heads = gitIn(scratch, "bundle", "list-heads", resolve(path)).stdout.split("\n").filter(Boolean).map((l) => l.split(" ")[1]);
    if (v.status !== 0) return { ok: false, heads, error: (v.stderr || v.stdout).trim().split("\n").pop() };
    return heads.includes("HEAD") ? { ok: true, heads } : { ok: false, heads, error: "it has no HEAD" };
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}
/** An arm's kept site: { ok, files, problems } (files in site/, none of them a .git; site.bundle verifies). */
export function keptSite(dir, arm) {
  const site = join(dir, "arms", arm, "site"), problems = [];
  const files = existsSync(site) ? readdirSync(site).filter((f) => f !== ".git" && f !== ".gitkeep") : [];
  if (!files.length) problems.push("no files in site/");
  if (existsSync(join(site, ".git"))) problems.push("site/ still has its own .git (git would keep only a pointer to it)");
  const b = verifyBundle(join(dir, "arms", arm, "site.bundle"));
  if (!b.ok) problems.push(`site.bundle: ${b.error}`);
  return { ok: !problems.length, files: files.length, problems };
}

function keep() {
  const [, target, arm, siteArg] = argv.filter((x, i) => !x.startsWith("--") && argv[i - 1] !== "--into");
  const usage = "usage: reel case-study keep <slug|dir> <arm> [<site-dir>] [--replace]  (or: keep <slug|dir> --check)";
  if (!target) die(usage);
  const dir = studyDir(target);
  if (!existsSync(join(dir, "README.md"))) die(`no case study at ${target} (make one with: reel case-study <slug> --prompt <file>)`);
  const rel = (p) => relative(process.cwd(), p) || ".";
  if (has("check")) {
    let bad = 0;
    for (const a of ARM_IDS) {
      if (!existsSync(join(dir, "arms", a, "site.bundle")) && !(existsSync(join(dir, "arms", a, "site")) && readdirSync(join(dir, "arms", a, "site")).length)) { console.log(`· ${a}: not kept yet`); continue; }
      const k = keptSite(dir, a);
      if (!k.ok) bad++;
      console.log(`${k.ok ? "✓" : "✗"} ${a}: ${k.ok ? "site/ as plain files, site.bundle verifies" : k.problems.join("; ")}`);
    }
    process.exit(bad ? 1 : 0);
  }
  if (!ARM_IDS.includes(arm)) die(`${usage}\n  the arm is one of ${ARM_IDS.join(", ")}`);
  const armDir = join(dir, "arms", arm), dest = join(armDir, "site"), bundle = join(armDir, "site.bundle");
  const src = resolve(siteArg || dest);
  if (!existsSync(src)) die(`no such folder: ${rel(src)}`);
  // the site's own repository: its .git right there (not one above it, which would be this repo)
  if (!existsSync(join(src, ".git"))) die(`${rel(src)} has no .git of its own: nothing to keep the history from (${src === dest && existsSync(bundle) ? "it looks kept already: reel case-study keep --check" : "the arm's container runs git init in it"})`);
  const top = gitIn(src, "rev-parse", "--show-toplevel");
  if (top.status !== 0 || realpathSync(top.stdout.trim()) !== realpathSync(src)) die(`${rel(src)}: not the top of a git repository`);
  if (gitIn(src, "rev-parse", "--verify", "-q", "HEAD").status !== 0) die(`${rel(src)}: no commit yet, so no history to keep`);
  const dirty = gitIn(src, "status", "--porcelain").stdout.trim();
  if (dirty) die(`${rel(src)} has changes not committed (${dirty.split("\n").length} path(s)): commit them there first, so the files kept and the history's last commit are the same site`);
  // D-305: the bundle is committed here, so the site's history must hold no voice file, video or render
  const media = [...new Set(gitIn(src, "log", ...SITE_REFS, "--name-only", "--format=").stdout.split("\n").filter(isMedia))];
  if (media.length) {
    const specs = [...MEDIA_EXT.map((e) => `'.reelplanning/*.${e}'`), "'.reelplanning/*/renders/*'"].join(" ");
    const ex = join(armDir, "site.exclude");
    if (!existsSync(ex)) { mkdirSync(armDir, { recursive: true }); writeFileSync(ex, siteExclude()); }
    die(`${rel(src)}: its history holds ${media.length} voice file(s), video(s) or render(s) under .reelplanning/ (${media.slice(0, 3).join(", ")}${media.length > 3 ? ", …" : ""}), and no voice file or render is committed in this repo (D-305), a bundle included. ` +
      `The arm's start lists them in the site's .git/info/exclude (site.exclude). For a history that has them: ignore them, stop tracking them (they stay on disk), and take them out of every commit (the commit hashes change), then keep it again:\n` +
      `  cat ${rel(ex)} >> ${rel(join(src, ".git", "info", "exclude"))}\n` +
      `  git -C ${rel(src)} rm -r --cached --ignore-unmatch -q -- ${specs} && git -C ${rel(src)} commit -qm "Stop tracking the built videos' media"\n` +
      `  git -C ${rel(src)} filter-branch -f --prune-empty --index-filter "git rm -r --cached --ignore-unmatch -q -- ${specs}" -- --branches --tags`);
  }
  const inPlace = existsSync(dest) && realpathSync(src) === realpathSync(dest);   // (arms/<arm>/site/ need not exist: git keeps no empty folder)
  if (!inPlace && existsSync(dest) && readdirSync(dest).filter((f) => f !== ".gitkeep").length) {
    if (!has("replace")) die(`${rel(dest)} is not empty: this arm's site is kept already (--replace keeps this one instead)`);
    rmSync(dest, { recursive: true, force: true });
  }
  // the history first, checked before anything is taken away
  mkdirSync(armDir, { recursive: true });
  const tmpBundle = `${bundle}.new`;
  const made = gitIn(src, "bundle", "create", tmpBundle, ...SITE_REFS);
  if (made.status !== 0) { rmSync(tmpBundle, { force: true }); die(`git bundle create failed: ${(made.stderr || made.stdout).trim()}`); }
  const v = verifyBundle(tmpBundle);
  if (!v.ok) { rmSync(tmpBundle, { force: true }); die(`the bundle does not verify (${v.error}): nothing kept`); }
  rmSync(bundle, { force: true }); cpSync(tmpBundle, bundle); rmSync(tmpBundle, { force: true });
  const commits = Number(gitIn(src, "rev-list", ...SITE_REFS, "--count").stdout.trim()) || 0;
  // then the files: in place, the site's own .git goes (the bundle holds it); from elsewhere, what git tracks there
  const files = gitIn(src, "ls-files", "-z").stdout.split("\0").filter(Boolean);
  // in place, what the site's git ignored (its node_modules, the built videos' media its .git/info/exclude named) stays
  // on disk, so the videos still play, and out of this repo: arms/<arm>/.gitignore names it, since info/exclude goes with .git
  const left = inPlace ? gitIn(src, "ls-files", "-z", "--others", "--ignored", "--exclude-standard", "--directory").stdout.split("\0").filter(Boolean) : [];
  if (left.length) writeFileSync(join(armDir, ".gitignore"), lines("# reel case-study keep: what the site's own git ignored, kept on disk and out of this repo (D-305: no voice file or render committed)",
    ...left.map((p) => `/site/${p.replace(/^([#!])/, "\\$1")}`)));
  if (inPlace) rmSync(join(dest, ".git"), { recursive: true, force: true });
  else {
    mkdirSync(dest, { recursive: true });
    for (const f of files) { mkdirSync(dirname(join(dest, f)), { recursive: true }); cpSync(join(src, f), join(dest, f), { verbatimSymlinks: true }); }
  }
  rmSync(join(dest, ".gitkeep"), { force: true });
  console.log(`✓ ${rel(dest)}/: the finished site, ${files.length} file(s), as plain files${inPlace ? " (its own .git taken out)" : ` (the files git tracks in ${rel(src)})`}`);
  if (left.length) console.log(`✓ ${rel(join(armDir, ".gitignore"))}: ${left.length} path(s) the site's git ignored, left on disk and out of this repo (${left.slice(0, 2).join(", ")}${left.length > 2 ? ", …" : ""})`);
  console.log(`✓ ${rel(bundle)}: its history, ${commits} commit(s), ${v.heads.filter((h) => h !== "HEAD").length} ref(s); git bundle verify: ok`);
  console.log(`next: commit ${rel(armDir)}/ (the sheet, the shots, site/ and site.bundle). To see the history: git clone ${rel(bundle)} <folder>`);
}

// ---------- provenance: what ran, from the arm's transcripts ----------
/** Every .jsonl under a folder (a Claude Code config's projects/: sessions, and their subagents/ beside them). */
function jsonlFiles(root) {
  const out = [];
  const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p); else if (e.name.endsWith(".jsonl")) out.push(p);
  } };
  walk(root);
  return out;
}
const tally = (o, k, n = 1) => { if (k !== undefined && k !== null && k !== "") o[k] = (o[k] || 0) + n; };
/**
 * What the transcripts say ran, from metadata fields only (never a message's text): each model that served a
 * response, with how many; the Claude Code versions the lines carry; the first and last timestamps; the
 * person's prompts, the model's responses, the tool calls (by tool, and the skills loaded); permission modes and
 * effort as recorded; the cost the session last reported. A response is one API message (message.id), which a
 * transcript writes as one line a content block.
 */
export function transcriptProvenance(root) {
  const files = jsonlFiles(root);
  const all = { models: {}, claude_code_versions: {}, first: null, last: null, sessions: 0, prompts: 0, responses: 0, tool_calls: 0,
    tools: {}, skills: {}, permission_modes: {}, effort: {}, entrypoints: {}, reported_cost_usd: null };
  const per = [];
  const sessions = new Set();
  for (const f of files) {
    const one = { path: relative(root, f), kind: /(^|\/)subagents\//.test(relative(root, f)) ? "subagent" : "session", first: null, last: null, responses: 0, tool_calls: 0, models: {} };
    const seen = new Set();
    let cost = null;
    for (const line of read(f).split("\n")) {
      if (!line.trim()) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      if (o.sessionId && one.kind === "session") sessions.add(o.sessionId);
      if (typeof o.timestamp === "string" && !Number.isNaN(Date.parse(o.timestamp))) {
        for (const x of [one, all]) {
          if (!x.first || Date.parse(o.timestamp) < Date.parse(x.first)) x.first = o.timestamp;
          if (!x.last || Date.parse(o.timestamp) > Date.parse(x.last)) x.last = o.timestamp;
        }
      }
      if (typeof o.version === "string") tally(all.claude_code_versions, o.version);
      if (typeof o.entrypoint === "string") tally(all.entrypoints, o.entrypoint);
      if (o.type === "cost-state" && typeof o.totalCostUSD === "number") cost = o.totalCostUSD;
      const m = o.message && typeof o.message === "object" ? o.message : {};
      const blocks = Array.isArray(m.content) ? m.content : [];
      if (o.type === "assistant") {
        const id = m.id || `${f}:${o.uuid}`;
        if (!seen.has(id)) {
          seen.add(id); one.responses++;
          if (typeof o.effort === "string") tally(all.effort, o.effort);
          if (m.model && m.model !== "<synthetic>") { tally(one.models, m.model); tally(all.models, m.model); }
        }
        for (const b of blocks) if (b && b.type === "tool_use") {
          one.tool_calls++; tally(all.tools, b.name);
          if (b.name === "Skill" && typeof b.input?.skill === "string") tally(all.skills, b.input.skill);
        }
      }
      if (o.type === "user") {
        if (typeof o.permissionMode === "string") tally(all.permission_modes, o.permissionMode);
        const toolResult = blocks.some((b) => b && b.type === "tool_result");
        const kind = o.origin && typeof o.origin === "object" ? o.origin.kind : "human";
        if (one.kind === "session" && !o.isSidechain && !o.isMeta && !o.isCompactSummary && !toolResult && kind === "human") all.prompts++;
      }
    }
    all.responses += one.responses; all.tool_calls += one.tool_calls;
    if (cost !== null) all.reported_cost_usd = Math.round(((all.reported_cost_usd || 0) + cost) * 100) / 100;
    per.push(one);
  }
  all.sessions = sessions.size;
  // the most first, ties by name; the sessions' own files before their subagents'
  const byCount = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
  for (const k of ["models", "claude_code_versions", "tools", "skills", "permission_modes", "effort", "entrypoints"]) all[k] = byCount(all[k]);
  per.sort((a, b) => (a.kind === b.kind ? a.path.localeCompare(b.path) : a.kind === "session" ? -1 : 1));
  return { about: "What the arm's Claude Code transcripts say ran, from their metadata only (reel case-study provenance): models count responses, versions count lines, prompts are the person's own messages.",
    files: per.length, ...all, per_file: per };
}
/** The voice each video was narrated with: every .hyperframes/narration.json under the site (voice, speed, model). */
export function narrationProvenance(site) {
  const out = [];
  const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === "node_modules" || e.name === ".git") continue;
    const p = join(d, e.name), n = join(p, "narration.json");
    if (e.name === ".hyperframes" && existsSync(n)) {
      const j = jsonOr(n, {});
      out.push({ video: relative(site, d) || ".", voice: j.voice ?? null, speed: j.speed ?? null, model: j.model ?? null, lines: Object.keys(j.lines || {}).length });
    } else walk(p);
  } };
  walk(site);
  return out.sort((a, b) => a.video.localeCompare(b.video));
}

function provenance() {
  const pos = argv.filter((x, i) => !x.startsWith("--") && !["--into", "--site"].includes(argv[i - 1]));
  const [, target, arm, transcripts] = pos;
  const usage = "usage: reel case-study provenance <slug|dir> <arm> <transcript-dir> [--site <site-dir>]";
  if (!target || !transcripts) die(usage);
  const dir = studyDir(target);
  if (!existsSync(join(dir, "README.md"))) die(`no case study at ${target}`);
  if (!ARM_IDS.includes(arm)) die(`${usage}\n  the arm is one of ${ARM_IDS.join(", ")}`);
  if (!existsSync(transcripts)) die(`no such folder: ${transcripts}`);
  const t = transcriptProvenance(resolve(transcripts));
  if (!t.files) die(`no transcript (.jsonl) under ${transcripts}`);
  const file = join(dir, "arms", arm, "provenance.json");
  let p = {};
  if (existsSync(file)) { try { p = JSON.parse(read(file)); } catch (e) { die(`${relative(process.cwd(), file)} is not JSON (${e.message}): fix it, or run provenance.sh again`); } }
  else console.log(`△ no ${relative(process.cwd(), file)} from provenance.sh yet: it gets the transcript's part only`);
  p.transcript = t;
  const site = flag("site");
  if (site) { if (!existsSync(site)) die(`no such folder: ${site}`); p.narration = narrationProvenance(resolve(site)); }
  writeFileSync(file, JSON.stringify(p, null, 2) + "\n");
  const list = (o) => Object.entries(o).map(([k, n]) => `${k} ×${n}`).join(", ") || "none";
  console.log(`✓ ${relative(process.cwd(), file) || file}: ${t.files} transcript file(s), ${t.sessions} session(s), ${t.first} – ${t.last}`);
  console.log(`  models: ${list(t.models)} · Claude Code: ${list(t.claude_code_versions)}`);
  console.log(`  ${t.prompts} prompt(s), ${t.responses} response(s), ${t.tool_calls} tool call(s)${t.reported_cost_usd !== null ? ` · cost reported: $${t.reported_cost_usd}` : ""}`);
  if (p.narration) { const v = {}; for (const n of p.narration) tally(v, `${n.voice}, ${n.model}, speed ${n.speed}`); console.log(`  narration: ${p.narration.length ? `${p.narration.length} video(s): ${list(v)}` : "none in the site"}`); }
}

// ---------- the report ----------
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "").trim();
const BLANK = /_fill in:[^_\n]*_/;
const jsonOr = (p, d) => { try { return JSON.parse(read(p)); } catch { return d; } };
const num = (x) => typeof x === "number" && Number.isFinite(x) && x >= 0;

/** README.md's sections: { n: { title, words } }, words without the template's comments. */
export function readmeSections(md) {
  const out = {};
  const re = /^## (\d)\. (.+)$/gm; const hits = [...md.matchAll(re)];
  hits.forEach((m, i) => { const end = i + 1 < hits.length ? hits[i + 1].index : md.length; out[m[1]] = { title: m[2].trim(), words: stripComments(md.slice(m.index + m[0].length, end)) }; });
  return out;
}
/** The preflight block of a sheet: the lines pasted under "## Preflight", or "". */
export function preflightOf(sheetMd) {
  const sec = (sheetMd.match(/^## Preflight\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m) || [])[1] || "";
  return ((sec.match(/```[a-z]*\n([\s\S]*?)```/) || [])[1] || "").trim();
}
/** FEEDBACK.md's table: [{ n, point, cells: { text, html, ours } }] (rows with a point only), and the notes list. */
export function feedbackOf(md) {
  const rows = [];
  for (const l of md.split("\n")) {
    const c = l.split("|").slice(1, -1).map((s) => s.trim());
    if (c.length < 5 || !/^\d+$|^new$/i.test(c[0])) continue;
    if (!c[1] || BLANK.test(c[1])) continue;
    rows.push({ n: c[0], point: c[1], cells: { text: c[2], html: c[3], ours: c[4] } });
  }
  const notes = ((md.match(/^## Where[^\n]*\n([\s\S]*)$/m) || [])[1] || "").trim();
  return { rows, notes };
}

/** What each of the nine sections still lacks: { n: [what is missing] }; an empty list is a filled section. */
export function missing(dir) {
  const sec = readmeSections(existsSync(join(dir, "README.md")) ? read(join(dir, "README.md")) : "");
  const d = (f) => jsonOr(join(dir, "data", f), null);
  const file = (p) => (existsSync(join(dir, p)) ? read(join(dir, p)) : "");
  const words = (n, need) => { const w = sec[n]?.words || ""; return BLANK.test(w) ? ["words in README.md (a _fill in_ blank is left)"] : need && !w ? ["words in README.md"] : []; };
  // one line for the arms that lack a thing: "times for text, html (data/times.json)"
  const lacking = (what, where, ok) => { const as = ARM_IDS.filter((a) => !ok(a)); return as.length ? [`${what} for ${as.join(", ")} (${where})`] : []; };
  const perm = (xs, of) => Array.isArray(xs) && xs.length === of.length && of.every((x) => xs.includes(x));
  const t = d("times.json"), c = d("counts.json"), s = d("sites.json"), j = d("judge.json"), k = d("key.json"), r = d("ranking.json"), l = d("links.json");
  const fb = feedbackOf(file("FEEDBACK.md"));
  const shots = (a) => { const x = s?.arms?.[a] || {}, ps = [...(x.phone || []), ...(x.desktop || [])]; return ps.length > 0 && ps.every((p) => existsSync(join(dir, p))); };
  const judged = ["X", "Y", "Z"].every((x) => MEASURES.every((m) => { const v = j?.sites?.[x]?.scores?.[m]; return Number.isInteger(v?.score) && v.score >= 1 && v.score <= 5 && String(v.evidence || "").trim(); }))
    && perm(j?.ranking, ["X", "Y", "Z"]) && String(j?.reasons || "").trim();
  return {
    1: [...words(1, false), ...lacking("the preflight's output", "arms/<arm>/SHEET.md", (a) => /preflight:/.test(preflightOf(file(`arms/${a}/SHEET.md`))))],
    2: [...words(2, true),
      ...lacking("the times", "data/times.json", (a) => STAGES.every((st) => num(t?.arms?.[a]?.[st]?.clock) && num(t?.arms?.[a]?.[st]?.yours))),
      ...lacking("the counts", "data/counts.json", (a) => ["questions", "decisions", "kept"].every((x) => num(c?.arms?.[a]?.[x])))],
    3: [...words(3, false), ...(!fb.rows.length ? ["the points (FEEDBACK.md)"] : lacking("a cell on every point", "FEEDBACK.md", (a) => fb.rows.every((row) => row.cells[a])))],
    4: words(4, true),
    5: [...words(5, false), ...lacking("how to run it", "data/sites.json", (a) => String(s?.arms?.[a]?.run || "").trim()), ...lacking("the screenshots", "data/sites.json", shots),
      ...lacking("the site kept", "arms/<arm>/site/ and site.bundle: reel case-study keep", (a) => keptSite(dir, a).ok)],
    6: [...words(6, true), ...(judged ? [] : ["the judge's scores, ranking and reasons (data/judge.json)"]),
      ...(perm(["X", "Y", "Z"].map((x) => k?.[x]), ARM_IDS) ? [] : ["which arm is X, Y and Z (data/key.json)"]),
      ...(perm(r?.ranking, ARM_IDS) ? [] : ["your ranking (data/ranking.json)"])],
    7: words(7, true),
    8: words(8, true),
    9: [...words(9, false), ...lacking("a link", "data/links.json", (a) => (l?.arms?.[a] || []).some((x) => x && x.href))],
  };
}

export const SECTIONS = ["The prompt and the empty start", "The arms, stage by stage", "The feedback sheet", "What each review caught, and what slipped through",
  "The sites", "The scores, the judge and your ranking", "The process, and what felt different", "What we would change", "Links"];

function report() {
  const target = argv[1] || die("usage: reel case-study report <slug|dir> [--publish]");
  const dir = existsSync(join(resolve(target), "README.md")) ? resolve(target) : resolve(flag("into", "eval/case-studies"), target);
  if (!existsSync(join(dir, "README.md"))) die(`no case study at ${target} (make one with: reel case-study <slug> --prompt <file>)`);
  const miss = missing(dir), empty = Object.entries(miss).filter(([, m]) => m.length);
  const rel = relative(process.cwd(), dir) || ".";
  for (const [n, m] of empty) console.log(`△ section ${n} (${SECTIONS[n - 1]}) is empty: ${m.join("; ")}`);
  if (has("publish") && empty.length) {
    console.log(`✗ not ready to publish: ${empty.length} of 9 sections are empty (${empty.map(([n]) => n).join(", ")}). Nothing written. Fill them in, then run this again.`);
    process.exit(1);
  }
  writeFileSync(join(dir, "case-study.html"), page(dir, miss));
  if (empty.length) console.log(`✓ ${rel}/case-study.html: a draft, ${9 - empty.length} of 9 sections filled (not ready to publish)`);
  else console.log(`✓ ${rel}/case-study.html: all 9 sections filled${has("publish") ? ": ready to publish, the way the review page is published" : " (ready: --publish says so)"}`);
}

// ---------- the page ----------
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function inline(s) {
  const code = [];
  let t = esc(s).replace(/`([^`]+)`/g, (_, c) => `\u0000${code.push(c) - 1}\u0000`);
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, h) => `<img src="${h}" alt="${a}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, a, h) => `<a href="${h}">${a}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${code[i]}</code>`);
}
/** A small Markdown renderer: headings, paragraphs, lists, tables, code blocks and quotes. */
export function markdown(md) {
  const lines = stripComments(md).split("\n"), out = [];
  for (let i = 0; i < lines.length;) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l)) { const b = []; i++; while (i < lines.length && !/^```/.test(lines[i])) b.push(lines[i++]); i++; out.push(`<pre><code>${esc(b.join("\n"))}</code></pre>`); continue; }
    const h = l.match(/^(#{1,6})\s+(.*)$/); if (h) { const n = Math.min(6, h[1].length + 1); out.push(`<h${n}>${inline(h[2])}</h${n}>`); i++; continue; }
    if (/^\|/.test(l)) { const rows = []; while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]); out.push(table(rows)); continue; }
    if (/^>\s?/.test(l)) { const b = []; while (i < lines.length && /^>\s?/.test(lines[i])) b.push(lines[i++].replace(/^>\s?/, "")); out.push(`<blockquote>${markdown(b.join("\n"))}</blockquote>`); continue; }
    const li = /^(\s*)([-*]|\d+\.)\s+/;
    if (li.test(l)) {
      const ordered = /\d/.test(l.match(li)[2]), items = [];
      while (i < lines.length && lines[i].trim() && (li.test(lines[i]) || /^\s{2,}/.test(lines[i]))) {
        if (li.test(lines[i])) items.push(lines[i].replace(li, "")); else items[items.length - 1] += ` ${lines[i].trim()}`;
        i++;
      }
      out.push(`<${ordered ? "ol" : "ul"}>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`); continue;
    }
    const p = []; while (i < lines.length && lines[i].trim() && !/^(```|#{1,6}\s|\||>|\s*([-*]|\d+\.)\s)/.test(lines[i])) p.push(lines[i++]);
    out.push(`<p>${inline(p.join(" "))}</p>`);
  }
  return out.join("\n");
}
function table(rows) {
  const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const body = rows.filter((r) => !/^\|[\s:|-]+\|$/.test(r)).map(cells);
  const [head, ...rest] = body;
  return `<div class="tw"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rest.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function fontFaces() {
  try {
    const f = JSON.parse(read(join(ROOT, "packages", "player", "fonts", "faces.json")));
    return f.faces.map((x) => `@font-face{font-family:"${x.family}";src:url(data:font/woff2;base64,${readFileSync(join(ROOT, "packages", "player", "fonts", x.file)).toString("base64")}) format("woff2");font-weight:${x.weight};font-style:${x.style};font-display:swap;unicode-range:${f.ranges[x.unicodeRange] || "U+0000-FFFF"}}`).join("\n");
  } catch { return ""; }
}

function page(dir, miss) {
  const armTitle = Object.fromEntries(ARMS.map((a) => [a.id, a.title]));
  const md = read(join(dir, "README.md")), sec = readmeSections(md);
  const title = (md.match(/^# (.+)$/m) || [])[1] || basename(dir);
  const intro = stripComments(md.slice(md.indexOf("\n", md.search(/^# /m)) + 1, (md.match(/^## 1\. /m) || { index: md.length }).index));
  const d = (f) => jsonOr(join(dir, "data", f), {});
  const img = (p, alt) => existsSync(join(dir, p)) ? `<img src="${esc(p)}" alt="${esc(alt)}" loading="lazy">` : `<div class="noimg">${esc(p)}</div>`;
  const words = (n) => (sec[n]?.words && !BLANK.test(sec[n].words) ? markdown(sec[n].words) : "");
  const sheetOf = (a) => existsSync(join(dir, "arms", a, "SHEET.md")) ? read(join(dir, "arms", a, "SHEET.md")) : "";
  const body = {};
  // 1. the prompt and the empty start
  body[1] = `<blockquote class="prompt">${markdown(read(join(dir, "prompt.md")))}</blockquote>
${existsSync(join(dir, "start", "README.md")) ? markdown(read(join(dir, "start", "README.md")).replace(/^# .*\n/, "")) : ""}
<div class="arms">${ARM_IDS.map((a) => `<div class="arm a-${a}"><h4>${esc(armTitle[a])}: the preflight</h4><pre><code>${esc(preflightOf(sheetOf(a)) || "(not run yet)")}</code></pre></div>`).join("")}</div>${words(1)}`;
  // 2. the arms, stage by stage
  const t = d("times.json"), c = d("counts.json");
  const max = Math.max(1, ...ARM_IDS.flatMap((a) => STAGES.map((s) => Number(t.arms?.[a]?.[s]?.clock) || 0)));
  const bar = (a, s) => { const x = t.arms?.[a]?.[s] || {}; const cl = num(x.clock) ? x.clock : null, yo = num(x.yours) ? x.yours : null;
    return `<div class="bar a-${a}" title="${esc(armTitle[a])}: ${cl ?? "?"} min on the clock, ${yo ?? "?"} yours"><span class="lbl">${esc(armTitle[a])}</span><span class="track"><span class="clock" style="width:${((cl || 0) / max * 100).toFixed(1)}%"><span class="yours" style="width:${cl ? Math.min(100, (yo || 0) / cl * 100).toFixed(1) : 0}%"></span></span></span><span class="v">${cl == null ? "–" : `${cl} min`}${yo == null ? "" : ` · ${yo} yours`}</span></div>`; };
  body[2] = `${words(2)}
<div class="arms">${ARM_IDS.map((a) => `<figure class="arm a-${a}">${img(`arms/${a}/shots/${stageFile(1)}`, `${armTitle[a]}: the plan review`)}<figcaption>${esc(armTitle[a])}: the plan review</figcaption></figure>`).join("")}</div>
<div class="tw"><table><thead><tr><th></th>${ARM_IDS.map((a) => `<th>${esc(armTitle[a])}</th>`).join("")}</tr></thead><tbody>
${[["questions", "Questions asked"], ["decisions", "Decisions recorded"], ["kept", "Decisions the code kept to"]].map(([k, l]) => `<tr><td>${l}</td>${ARM_IDS.map((a) => `<td class="n">${num(c.arms?.[a]?.[k]) ? c.arms[a][k] : "–"}</td>`).join("")}</tr>`).join("")}
</tbody></table></div>
<p class="key"><span class="sw sw-clock"></span> on the clock <span class="sw sw-yours"></span> your own time, in minutes</p>
<div class="times">${STAGES.map((s) => `<div class="stage"><div class="sn">${esc(s)}</div>${ARM_IDS.map((a) => bar(a, s)).join("")}</div>`).join("")}</div>`;
  // 3. the feedback sheet
  const fb = feedbackOf(existsSync(join(dir, "FEEDBACK.md")) ? read(join(dir, "FEEDBACK.md")) : "");
  const tag = (s) => { const k = (String(s).match(/^\s*(raised|covered|missed|new)/i) || [])[1]; return k ? `<span class="tag t-${k.toLowerCase()}">${k.toLowerCase()}</span>${inline(String(s).replace(/^\s*\w+\s*:?\s*/, "")) ? ` ${inline(String(s).replace(/^\s*\w+\s*:?\s*/, ""))}` : ""}` : inline(s || "–"); };
  body[3] = `<div class="tw"><table class="fb"><thead><tr><th>#</th><th>Point</th>${ARM_IDS.map((a) => `<th>${esc(armTitle[a])}</th>`).join("")}</tr></thead><tbody>
${fb.rows.map((r) => `<tr><td>${esc(r.n)}</td><td>${inline(r.point)}</td>${ARM_IDS.map((a) => `<td>${tag(r.cells[a])}</td>`).join("")}</tr>`).join("\n")}</tbody></table></div>
${fb.notes ? `<h4>Where a format made a point easier or harder to raise</h4>${markdown(fb.notes)}` : ""}${words(3)}`;
  body[4] = words(4);
  // 5. the sites
  const s = d("sites.json");
  body[5] = `<div class="arms">${ARM_IDS.map((a) => { const x = s.arms?.[a] || {}; return `<div class="arm a-${a}"><h4>${esc(armTitle[a])}</h4><p class="run">${x.run ? inline(x.run) : "How to run it: not filled in yet."}</p>${existsSync(join(dir, "arms", a, "site.bundle")) ? `<p class="dim">Kept: <a href="arms/${a}/site/">the site</a>, and its history, <a href="arms/${a}/site.bundle">site.bundle</a> (<code>git clone site.bundle</code>)</p>` : ""}<div class="shots phone">${(x.phone || []).map((p, i) => img(p, `${armTitle[a]} on a phone, screen ${i + 1}`)).join("")}</div><div class="shots desk">${(x.desktop || []).map((p, i) => img(p, `${armTitle[a]} on a desktop, screen ${i + 1}`)).join("")}</div></div>`; }).join("")}</div>${words(5)}`;
  // 6. the scores
  const j = d("judge.json"), k = d("key.json"), r = d("ranking.json");
  const who = (x) => (k[x] ? `${x} <span class="dim">(${esc(armTitle[k[x]] || k[x])})</span>` : x);
  const names = { asked: "Does what the prompt asked", engaging: "More engaging than a reference article", phone: "Works on a phone", facts: "Facts right", change: "Easy to change" };
  body[6] = `<div class="tw"><table class="scores"><thead><tr><th>The rubric</th>${["X", "Y", "Z"].map((x) => `<th>${who(x)}</th>`).join("")}</tr></thead><tbody>
${MEASURES.map((m) => `<tr><td>${names[m]}</td>${["X", "Y", "Z"].map((x) => { const v = j.sites?.[x]?.scores?.[m] || {}; return `<td><span class="score">${Number.isInteger(v.score) ? v.score : "–"}</span>${v.evidence ? `<span class="ev">${inline(v.evidence)}</span>` : ""}</td>`; }).join("")}</tr>`).join("\n")}
<tr class="total"><td>Total (of 25)</td>${["X", "Y", "Z"].map((x) => `<td class="n">${MEASURES.reduce((n, m) => n + (Number(j.sites?.[x]?.scores?.[m]?.score) || 0), 0) || "–"}</td>`).join("")}</tr></tbody></table></div>
<div class="two"><div><h4>The blind judge's ranking</h4>${(j.ranking || []).length ? `<ol>${j.ranking.map((x) => `<li>${who(x)}</li>`).join("")}</ol>` : "<p class=\"dim\">Not in yet.</p>"}${j.reasons ? `<p>${inline(j.reasons)}</p>` : ""}</div>
<div><h4>Your ranking, made before the judge's</h4>${(r.ranking || []).length ? `<ol>${r.ranking.map((a) => `<li>${esc(armTitle[a] || a)}</li>`).join("")}</ol>` : "<p class=\"dim\">Not in yet.</p>"}${r.why ? `<p>${inline(r.why)}</p>` : ""}</div></div>${words(6)}`;
  body[7] = words(7); body[8] = words(8);
  const l = d("links.json");
  body[9] = `<div class="arms">${ARM_IDS.map((a) => `<div class="arm a-${a}"><h4>${esc(armTitle[a])}</h4><ul>${(l.arms?.[a] || []).filter((x) => x && x.href).map((x) => `<li>${x.kind ? `<span class="dim">${esc(x.kind)}:</span> ` : ""}<a href="${esc(x.href)}">${esc(x.label || x.href)}</a></li>`).join("") || "<li class=\"dim\">None yet.</li>"}</ul></div>`).join("")}</div>${words(9)}`;

  const empty = Object.entries(miss).filter(([, m]) => m.length).map(([n]) => Number(n));
  const sections = SECTIONS.map((name, i) => { const n = i + 1, m = miss[n] || [];
    return `<section id="s${n}"><h2><span class="num">${n}</span>${esc(sec[n]?.title || name)}</h2>${m.length ? `<p class="todo">Not filled in yet: ${m.map(esc).join("; ")}.</p>` : ""}${body[n] || ""}</section>`; }).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title.replace(/^Case study:\s*/i, ""))}: a case study</title>
<style>
${fontFaces()}
/* the review page's tokens (packages/player/index.html), light and dark */
:root{--ground:#F1EFE8;--paper:#FAF9F5;--ink:#141413;--ink-2:#3D3B37;--ink-3:#5C5953;--ink-rgb:20,20,19;--accent:#B8552E;--accent-text:#9C4524;--arm-text:#6E6A62;--arm-html:#3F6E8C;--arm-ours:var(--accent);color-scheme:light dark}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ground:#0E0D0B;--paper:#141310;--ink:#F2EFE8;--ink-2:#CFCAC1;--ink-3:#A6A196;--ink-rgb:242,239,232;--accent:#D2693F;--accent-text:#E3A184;--arm-text:#9C978C;--arm-html:#6FA3C4}}
:root[data-theme="dark"]{--ground:#0E0D0B;--paper:#141310;--ink:#F2EFE8;--ink-2:#CFCAC1;--ink-3:#A6A196;--ink-rgb:242,239,232;--accent:#D2693F;--accent-text:#E3A184;--arm-text:#9C978C;--arm-html:#6FA3C4}
:root{--line:rgba(var(--ink-rgb),.12);--soft:rgba(var(--ink-rgb),.06);--sans:"Inter",ui-sans-serif,system-ui,sans-serif;--serif:"EB Garamond",Georgia,serif;--mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);font:16px/1.55 var(--sans)}
main{max-width:920px;margin:0 auto;padding:40px 24px 80px}
header h1{font:400 40px/1.15 var(--serif);margin:0 0 16px}
header .intro{color:var(--ink-2);font-size:17px}
.draft{background:var(--paper);border-left:3px solid var(--accent);padding:12px 16px;border-radius:6px;margin:0 0 24px;color:var(--ink-2)}
nav ol{columns:2;padding-left:20px;color:var(--ink-3);font-size:14px;margin:24px 0 8px}
nav a{color:var(--ink-2);text-decoration:none}
nav a:hover{color:var(--accent-text)}
section{background:var(--paper);border-radius:10px;padding:24px 28px;margin:24px 0;box-shadow:0 0 0 1px var(--line)}
h2{font:400 28px/1.2 var(--serif);margin:0 0 16px;display:flex;gap:12px;align-items:baseline}
h2 .num{font:500 14px/1 var(--mono);color:var(--accent-text)}
h3,h4{font-weight:600;margin:20px 0 8px}h3{font-size:18px}h4{font-size:15px;color:var(--ink-2)}
p,li{color:var(--ink-2)}strong{color:var(--ink)}
a{color:var(--accent-text)}
code{font:13px/1.4 var(--mono);background:var(--soft);padding:1px 4px;border-radius:4px}
pre{background:var(--soft);padding:12px;border-radius:6px;overflow-x:auto;margin:8px 0}pre code{background:none;padding:0;white-space:pre-wrap;word-break:break-word}
blockquote{margin:12px 0;padding:4px 16px;border-left:3px solid var(--line)}
blockquote.prompt{border-color:var(--accent);font:400 20px/1.45 var(--serif)}blockquote.prompt p{color:var(--ink)}
.tw{overflow-x:auto;margin:12px 0}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}
th{font-weight:600;color:var(--ink)}td.n{font:500 14px/1.4 var(--mono)}
.arms{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:12px 0}
.arm{margin:0;border-top:3px solid var(--c);padding-top:8px;min-width:0}
.a-text{--c:var(--arm-text)}.a-html{--c:var(--arm-html)}.a-ours{--c:var(--arm-ours)}
.arm h4{margin-top:4px}
figure img,.shots img{width:100%;height:auto;border-radius:6px;box-shadow:0 0 0 1px var(--line);display:block}
figcaption{font-size:13px;color:var(--ink-3);margin-top:6px}
.shots{display:grid;gap:8px;margin:8px 0}.shots.phone{grid-template-columns:repeat(3,1fr)}
.noimg{font:12px/1.3 var(--mono);color:var(--ink-3);border:1px dashed var(--line);border-radius:6px;padding:12px 8px;word-break:break-all;min-height:60px}
.todo{color:var(--accent-text);font-size:14px;border:1px dashed var(--accent);border-radius:6px;padding:8px 12px}
.dim{color:var(--ink-3)}
.key{font-size:13px;color:var(--ink-3)}.sw{display:inline-block;width:12px;height:12px;border-radius:2px;vertical-align:-1px;margin:0 4px 0 12px}.sw-clock{background:rgba(var(--ink-rgb),.25);margin-left:0}.sw-yours{background:var(--ink-2)}
.stage{padding:8px 0;border-bottom:1px solid var(--line)}.sn{font-weight:600;font-size:14px;margin-bottom:4px}
.bar{display:grid;grid-template-columns:150px 1fr 130px;gap:10px;align-items:center;font-size:13px;margin:3px 0}
.bar .lbl{color:var(--ink-2)}.bar .v{font:12px/1 var(--mono);color:var(--ink-3)}
.track{height:12px;background:var(--soft);border-radius:3px;overflow:hidden}
.clock{display:block;height:100%;background:color-mix(in srgb,var(--c) 40%,transparent)}.yours{display:block;height:100%;background:var(--c)}
.tag{font:500 11px/1 var(--mono);text-transform:uppercase;letter-spacing:.04em;padding:3px 6px;border-radius:4px;background:var(--soft);color:var(--ink-2)}
.t-raised{color:var(--arm-html)}.t-covered{color:var(--ink-2)}.t-missed{color:var(--accent-text)}.t-new{color:var(--ink)}
.score{font:600 18px/1 var(--mono);display:block}.ev{display:block;font-size:13px;color:var(--ink-3);margin-top:4px}
tr.total td{font-weight:600}
.two{display:grid;grid-template-columns:1fr 1fr;gap:24px}
footer{color:var(--ink-3);font-size:13px;margin-top:32px}
@media (max-width:720px){main{padding:24px 16px 60px}table.scores,table.fb{min-width:600px}header h1{font-size:30px}section{padding:18px 16px}.arms,.two{grid-template-columns:1fr}nav ol{columns:1}.bar{grid-template-columns:90px 1fr;}.bar .v{grid-column:2}}
</style>
</head>
<body>
<main>
<header>
<h1>${inline(title)}</h1>
${empty.length ? `<p class="draft"><strong>Draft.</strong> ${9 - empty.length} of 9 sections are filled in; section${empty.length > 1 ? "s" : ""} ${empty.join(", ")} ${empty.length > 1 ? "are" : "is"} not yet.</p>` : ""}
<div class="intro">${markdown(intro)}</div>
<nav><ol>${SECTIONS.map((n, i) => `<li><a href="#s${i + 1}">${esc(sec[i + 1]?.title || n)}</a></li>`).join("")}</ol></nav>
</header>
${sections}
<footer>Built by <code>reel case-study report</code> from this folder: README.md holds the words, data/ the numbers, and the sheets, the feedback sheet and the screenshots sit beside them.</footer>
</main>
</body>
</html>
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!argv[0] || argv[0] === "-h" || argv[0] === "--help") { console.log(read(fileURLToPath(import.meta.url)).split("\n").slice(1, 25).map((l) => l.replace(/^\/\/ ?/, "")).join("\n")); process.exit(argv[0] ? 0 : 1); }
  if (argv[0] === "report") report(); else if (argv[0] === "keep") keep(); else if (argv[0] === "provenance") provenance(); else scaffold();
}
