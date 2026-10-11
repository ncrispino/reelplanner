#!/usr/bin/env node
import { mkdtempSync, mkdirSync, writeFileSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { ROOT } from "../lib/env.mjs";
import { discoverReviewProjects } from "../lib/review-projects.mjs";

const scratch = realpathSync(mkdtempSync(join(tmpdir(), "reel-discovery-")));
const parent = join(scratch, "parent"), child = join(parent, "child"), nested = join(child, "src", "pages");
const video = (path) => { mkdirSync(path, { recursive: true }); writeFileSync(join(path, "index.html"), "<!doctype html><title>scratch</title>"); return path; };
try {
  mkdirSync(nested, { recursive: true });
  for (const repo of [parent, child]) execFileSync("git", ["init", "-q", repo]);
  const outer = video(join(parent, "videos", "outer")), inner = video(join(child, "videos", "inner"));
  const plan = video(join(parent, ".reelplanner", "plans", "2026-10-11-test", "video"));
  writeFileSync(join(parent, ".reelplanner", "decisions.json"), '{"decisions":[]}');
  const found = discoverReviewProjects(nested);
  assert.equal(found.find((p) => p.path === inner)?.repo, child);
  assert.equal(found.find((p) => p.path === outer)?.repo, parent);
  assert.equal(found.find((p) => p.path === plan)?.repo, parent);
  assert.equal(new Set(found.map((p) => p.path)).size, found.length);
  console.log("✓ current and ancestor videos retain their owning repo, with no duplicates");
  const listed = execFileSync(process.execPath, [join(ROOT, "bin/reelplanner.mjs"), "review", "--list"], { cwd: nested, encoding: "utf8" });
  for (const path of [inner, outer, plan]) assert.ok(listed.includes(path));
  assert.ok(listed.includes(`owning repo: ${child}`) && listed.includes(`owning repo: ${parent}`));
  console.log("✓ CLI discovery shows actual paths and owner repos without opening or creating a server");
  const mixed = spawnSync(process.execPath, [join(ROOT, "scripts/review.mjs"), inner, outer, "--no-open", "--no-notify"], { cwd: nested, encoding: "utf8" });
  assert.equal(mixed.status, 1); assert.match(mixed.stderr, /different repos/);
  console.log("✓ a mixed-owner bundle is rejected before Send could target the wrong inbox");
} finally { rmSync(scratch, { recursive: true, force: true }); }
