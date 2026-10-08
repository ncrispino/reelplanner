// The plan guide's plan folder (.reelplanning/plans/2026-09-28-plan-guide) in a scratch repo of its own, with a history
// its guide can read. Two parts of a plan's guide come from git: the Built side (the changes of the commits that
// walkthrough.md's **Commits:** names) and "Revised since your review" (plan.md as the review watched it, the last commit
// of it before the review's first play). This repo's own history starts at the public release, one commit (D-310), and a
// CI checkout is one commit deep, so neither is here; the specs that look at them run on this repo instead:
//
//   2026-09-20  the record and the plan folder, plan.md as the review saw it (without its "After the approval" and
//               "After prototype v4" sections, both written after it), and each file the plan's categories of change
//               name with a block of its lines not written yet
//   2026-09-30  plan.md as it is now                                        (walkthrough.md's Started from)
//   2026-10-02  the files the categories name, as they are now: the build   (walkthrough.md's Commits)
//   2026-10-03  walkthrough.md naming those two
//
// Everything is the working tree's, copied (copy-on-write where the disk can), never this repo's committed files changed.
// The guide's pictures already taken of these videos' scenes (their .cache, built output) are copied too, so a second
// run does not take them again.
// usage: import { planGuideRepo } from "./plan-guide-repo.mjs"; const repo = planGuideRepo(join(T, "repo"));
import { execFileSync } from "node:child_process";
import { constants, copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ROOT } from "../../../scripts/lib/env.mjs";
import { readWalkthrough } from "../../../scripts/lib/guide/built.mjs";

export const PLAN = ".reelplanning/plans/2026-09-28-plan-guide";
const PLANS = ".reelplanning/plans/";

export function planGuideRepo(dir) {
  const tracked = execFileSync("git", ["-C", ROOT, "ls-files", "-z", "--", ".reelplanning", "scripts", "templates", "packages", "skills", "docs", "CHANGELOG.md", ".gitignore"], { encoding: "utf8", maxBuffer: 64 << 20 })
    .split("\0").filter((p) => p && existsSync(join(ROOT, p)));
  // what the categories of change name: a file, or a folder's files (of a folder, those about the guide: the real build
  // changed those, not every spec in scripts/test/); a plan folder's are left as they are
  const named = readWalkthrough(join(ROOT, PLAN, "walkthrough.md")).categories.flatMap((c) => c.paths).filter((p) => !p.startsWith(PLANS));
  const changed = tracked.filter((p) => named.some((n) => p === n || (n.endsWith("/") && p.startsWith(n) && /guide/.test(p))));
  // the record (its own files and theme), every plan's own files (another plan's plan.md says what it superseded), this
  // plan's folder whole, and the files changed
  const record = (p) => p.startsWith(".reelplanning/") && (!p.slice(".reelplanning/".length).includes("/") || p.startsWith(".reelplanning/theme/"));
  const planOwn = (p) => p.startsWith(PLANS) && p.slice(PLANS.length).split("/").length === 2;
  const files = tracked.filter((p) => record(p) || planOwn(p) || p.startsWith(`${PLAN}/`) || changed.includes(p));
  for (const p of files) { mkdirSync(dirname(join(dir, p)), { recursive: true }); copyFileSync(join(ROOT, p), join(dir, p), constants.COPYFILE_FICLONE); }
  for (const v of ["video", "walkthrough-video"]) { const c = join(ROOT, PLAN, v, "guide", ".cache"); if (existsSync(c)) cpSync(c, join(dir, PLAN, v, "guide", ".cache"), { recursive: true }); }

  const git = (args, at) => execFileSync("git", ["-C", dir, "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_AUTHOR_NAME: "reelplanning spec", GIT_AUTHOR_EMAIL: "spec@example.invalid", GIT_COMMITTER_NAME: "reelplanning spec", GIT_COMMITTER_EMAIL: "spec@example.invalid", ...(at ? { GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at } : {}) } });
  const commit = (msg, at) => { git(["add", "-A"]); git(["commit", "-q", "--no-verify", "-m", msg], at); return git(["rev-parse", "--short=7", "HEAD"]).trim(); };
  const read = (p) => readFileSync(join(dir, p), "utf8"), write = (p, s) => writeFileSync(join(dir, p), s);
  git(["init", "-q"]);

  // plan.md as the review saw it: the sections written after the approval not there yet
  const plan = read(`${PLAN}/plan.md`), reviewed = plan.replace(/^## After (the approval|prototype v4)\b[\s\S]*?(?=^## )/gm, "");
  if (reviewed === plan) throw new Error(`${PLAN}/plan.md has no "## After the approval" section to leave out`);
  write(`${PLAN}/plan.md`, reviewed);
  // each changed file with a block of its lines (about a tenth, from 40 % in) not written yet
  const now = new Map(changed.map((p) => [p, read(p)]));
  for (const [p, text] of now) {
    if (text.includes("\0")) continue;
    const lines = text.split("\n"), k = Math.max(1, Math.min(24, Math.floor(lines.length / 10))), a = Math.min(lines.length - k, Math.floor(lines.length * 0.4));
    write(p, [...lines.slice(0, a), ...lines.slice(a + k)].join("\n"));
  }
  commit("Before the plan guide", "2026-09-20T12:00:00Z");
  write(`${PLAN}/plan.md`, plan);
  const started = commit("The plan guide: the plan, after its review", "2026-09-30T12:00:00Z");
  for (const [p, text] of now) write(p, text);
  const built = commit("The plan guide: the build", "2026-10-02T12:00:00Z");
  const wt = read(`${PLAN}/walkthrough.md`);
  write(`${PLAN}/walkthrough.md`, wt.replace(/(\*\*Started from:\*\*\s*`)[0-9a-f]{7,40}`/, `$1${started}\``).replace(/(\*\*Commits:\*\*)\s*(?:[0-9a-f]{7,40}\s*)+/, `$1 ${built} `));
  commit("The plan guide: its walkthrough", "2026-10-03T12:00:00Z");
  return dir;
}
