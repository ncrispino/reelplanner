#!/usr/bin/env node
// Move plan folders made before reviews/ existed (revise-loop step 9, D-085) to the layout the tools
// now read: every review in <plan-dir>/reviews/<kind>-<time>.json with its what-to-act-on
// <kind>-<time>.md beside it, and nothing else about the review.
//
//   annotations.json, walkthrough-annotations.json   → reviews/, one file per review, EVERY version:
//       each was overwritten by the next round, so each version still in git history is filed too
//   plan.resolved.md, walkthrough.resolved.md,
//   revise-scope.json, walkthrough-scope.json,
//   walkthrough-revise-scope.json, README.md          → removed (what they said is in reviews/<id>.md,
//       the ledger and `reel status`; git history keeps them)
//
// A historical review's what-to-act-on file is written against the plan map and walkthrough.md the
// reviewer saw (the commit before it was recorded), and the ledger as it stood then. Nothing is added
// to the ledger: those reviews are in it already. Running it again changes nothing.
//
// usage: reelplanning migrate-reviews [<dir>] [--dry-run]   (every .reelplanning/plans/*/ under <dir>, default .)
import { existsSync, readFileSync, writeFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve, relative, dirname, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { fileReview, reviewKind, reviewTime, reviewsDir, reviewOf, ledgerFor, listReviews } from "./lib/reviews.mjs";
import { actOnMarkdown } from "./lib/review-scope.mjs";
import { realPath } from "./lib/env.mjs";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const top = resolve(args.find((a) => !a.startsWith("--")) || ".");
const OLD = ["plan.resolved.md", "walkthrough.resolved.md", "revise-scope.json", "walkthrough-scope.json", "walkthrough-revise-scope.json", "README.md"];
const SKIP = new Set(["node_modules", ".git", "renders", "snapshots"]);

// every <…>/.reelplanning/plans/<plan>/ with a plan.md
function planDirs(d, out = [], depth = 0) {
  if (depth > 8) return out;
  let entries; try { entries = readdirSync(d, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (!e.isDirectory() || SKIP.has(e.name)) continue;
    const p = join(d, e.name);
    if (e.name === ".reelplanning" && existsSync(join(p, "plans"))) { for (const x of readdirSync(join(p, "plans"))) if (existsSync(join(p, "plans", x, "plan.md"))) out.push(join(p, "plans", x)); }
    else planDirs(p, out, depth + 1);
  }
  return out;
}

const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 });
const tryGit = (cwd, ...a) => { try { return git(cwd, ...a); } catch { return null; } };
const parse = (t) => { try { return JSON.parse(t); } catch { return null; } };

let repo = tryGit(top, "rev-parse", "--show-toplevel")?.trim() || null;
// a file's path in the repo, from where it really is (git's top is the real path; `top` may name it through a link)
const inRepo = (abs) => relative(repo, realPath(abs)).split("\\").join("/");
const at = (rev, abs) => (repo && rev ? tryGit(repo, "show", `${rev}:${inRepo(abs)}`) : null);

let filedN = 0, removedN = 0;
for (const pd of planDirs(top).sort()) {
  const planName = basename(pd), rel = relative(process.cwd(), pd) || ".";
  const said = [];
  for (const [file, fixed] of [["annotations.json", null], ["walkthrough-annotations.json", "walkthrough"]]) {
    const abs = join(pd, file);
    // every version: the committed ones oldest first, then the working copy
    const versions = [];
    if (repo) for (const rev of (tryGit(repo, "log", "--format=%H", "--", inRepo(abs)) || "").split("\n").filter(Boolean).reverse()) {
      const text = at(rev, abs); if (text != null) versions.push({ rev, text });
    }
    if (existsSync(abs)) versions.push({ rev: null, text: readFileSync(abs, "utf8") });
    const seen = new Set();
    for (const v of versions) {
      const review = reviewOf(parse(v.text));
      if (!review || !Array.isArray(review.annotations)) continue;
      const k = JSON.stringify(review); if (seen.has(k)) continue; seen.add(k);
      const kind = fixed || reviewKind(review);
      if (DRY) { said.push(`would file a ${kind} review of ${reviewTime(review) || "?"}${v.rev ? ` (from ${v.rev.slice(0, 7)})` : ""}`); continue; }
      const f = fileReview(pd, review, { kind, at: reviewTime(review), stamp: false });
      const md = join(reviewsDir(pd), `${f.id}.md`);
      if (!existsSync(md)) {
        // what the reviewer saw: the files as they were just before the review was recorded
        const before = v.rev ? `${v.rev}^` : null;
        const pick = (p) => parse(at(before, p) ?? at(v.rev, p) ?? (existsSync(p) ? readFileSync(p, "utf8") : null));
        const map = kind === "walkthrough" ? pick(join(pd, "walkthrough-video", "plan-map.json")) || pick(join(pd, "video", "plan-map.json")) : pick(join(pd, "video", "plan-map.json"));
        const wtPath = join(pd, "walkthrough.md");
        const wt = at(before, wtPath) ?? at(v.rev, wtPath) ?? (existsSync(wtPath) ? readFileSync(wtPath, "utf8") : "");
        const ledgerPath = join(dirname(dirname(pd)), "decisions.json");
        const L = parse(at(before, ledgerPath) ?? "null");
        const ledgerBefore = Array.isArray(L) ? L : L?.decisions || (v.rev ? [] : ledgerFor(pd));
        const filedAt = reviewTime(review), earlier = listReviews(pd).filter((r) => r.kind === kind && r.id !== f.id && (!filedAt || !r.at || r.at <= filedAt)).map((r) => r.review);
        writeFileSync(md, actOnMarkdown({ id: f.id, kind, review, planName, map, wt, ledgerBefore, ledger: ledgerFor(pd), earlier }));
      }
      if (!f.again) { filedN++; said.push(`filed reviews/${f.id}.json + .md${v.rev ? ` (from ${v.rev.slice(0, 7)})` : ""}`); }
    }
    if (existsSync(abs)) { if (!DRY) rmSync(abs); removedN++; said.push(`${DRY ? "would remove" : "removed"} ${file}`); }
  }
  // A plan folder's README.md goes only when it is the old stage checklist `reel new-plan` wrote; one
  // someone wrote by hand stays.
  const checklist = (f) => f !== "README.md" || /^\| Stage \| Artefact \| Done \|$/m.test(readFileSync(join(pd, f), "utf8"));
  for (const f of OLD) if (existsSync(join(pd, f)) && statSync(join(pd, f)).isFile()) {
    if (!checklist(f)) { said.push(`kept ${f} (not the old checklist)`); continue; }
    if (!DRY) rmSync(join(pd, f)); removedN++; said.push(`${DRY ? "would remove" : "removed"} ${f}`);
  }
  if (said.length) console.log(`${rel}\n${said.map((s) => `  ${s}`).join("\n")}`);
}
console.log(`${DRY ? "(dry run) " : ""}✓ ${filedN} review(s) filed in reviews/, ${removedN} old file(s) ${DRY ? "to remove" : "removed"}`);
