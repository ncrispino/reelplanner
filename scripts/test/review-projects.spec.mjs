#!/usr/bin/env node
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { ROOT } from "../lib/env.mjs";
import { discoverReviewProjects } from "../lib/review-projects.mjs";

const scratch = realpathSync(mkdtempSync(join(tmpdir(), "reel-discovery-")));
const parent = join(scratch, "parent"), child = join(parent, "child"), nested = join(child, "src", "pages");
const video = (path) => { mkdirSync(path, { recursive: true }); writeFileSync(join(path, "index.html"), "<!doctype html><title>scratch</title>"); return path; };
const liveRepos = [], outputs = new Set();
const serverInfo = (repo) => JSON.parse(readFileSync(join(repo, ".reelplanner/inbox/.server.json"), "utf8"));
const cli = (repo, args) => {
  try { return execFileSync(process.execPath, [join(ROOT, "bin/reelplanner.mjs"), "review", ...args],
    { cwd: repo, env: { ...process.env, REELPLANNER_HOME: join(scratch, "home") }, encoding: "utf8", timeout: 120000 }); }
  catch (e) { const log = join(repo, ".reelplanner/inbox/server.log"); if (existsSync(log)) console.error(readFileSync(log, "utf8")); throw e; }
};
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

  // Same project name and same clone folder name used to share one temp bundle. Run both
  // real servers and inspect what they serve after the second one bundles its own files.
  const repos = [join(scratch, "left", "clone"), join(scratch, "right", "clone")];
  const slug = "2026-10-11-isolation", relVideo = `.reelplanner/plans/${slug}/video`;
  const markers = ["Left reading plan", "Right reading plan"];
  for (const [i, repo] of repos.entries()) {
    mkdirSync(repo, { recursive: true }); execFileSync("git", ["init", "-q", repo]);
    const vd = video(join(repo, relVideo));
    mkdirSync(join(vd, "compositions"));
    writeFileSync(join(repo, ".reelplanner/decisions.json"), '{"decisions":[]}');
    writeFileSync(join(vd, "plan-map.json"), JSON.stringify({ project: "video", title: markers[i],
      planDir: `.reelplanner/plans/${slug}`, totalSeconds: 1, decisions: [], autonomy: [], quizzes: [], frames: [] }));
    liveRepos.push(repo);
    cli(repo, [relVideo, "--detach", "--no-open", "--no-notify", "--port", "0"]);
    outputs.add(serverInfo(repo).out);
  }
  const left = serverInfo(repos[0]), right = serverInfo(repos[1]);
  const served = async (s) => (await (await fetch(`${s.base}${slug}/plan-map.json`)).json()).title;
  assert.notEqual(left.out, right.out);
  assert.equal(await served(left), markers[0]); assert.equal(await served(right), markers[1]);
  console.log("✓ two live repos with identically named clones/videos serve separate bundles");

  // Rebundling one server must neither replace the other's files nor change its port/pid.
  const leftMap = join(repos[0], relVideo, "plan-map.json");
  const revised = JSON.parse(readFileSync(leftMap, "utf8")); revised.title = "Left revised reading plan";
  writeFileSync(leftMap, JSON.stringify(revised));
  const alias = join(scratch, "left-alias"); symlinkSync(repos[0], alias, "dir");
  cli(alias, [relVideo, "--detach", "--no-open", "--no-notify"]);
  assert.equal(serverInfo(repos[0]).pid, left.pid); assert.equal(serverInfo(repos[0]).out, left.out);
  assert.equal(await served(left), revised.title); assert.equal(await served(right), markers[1]);
  console.log("✓ canonical repo spelling reuses its server and rebuilds only its own files");

  for (const [i, s] of [left, right].entries()) {
    const response = await fetch(`${s.base}api/review`, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "submitted", submittedAt: `2026-10-11T12:00:0${i}Z`, project: "video",
        planDir: `.reelplanner/plans/${slug}`, title: markers[i], verdict: "changes", note: markers[i],
        review: { exportedAt: `2026-10-11T12:00:0${i}Z`, annotations: [] } }) });
    const saved = await response.json(); assert.equal(saved.ok, true); assert.equal(saved.handledBy, "inbox");
    const row = JSON.parse(readFileSync(join(repos[i], saved.path), "utf8")); assert.equal(row.note, markers[i]);
    assert.equal(existsSync(join(repos[1-i], saved.path)), false);
  }
  console.log("✓ each live page saves review data only in its owning repo's inbox");

  cli(repos[0], ["--stop"]);
  cli(repos[0], [relVideo, "--detach", "--no-open", "--no-notify", "--port", "0"]);
  const restarted = serverInfo(repos[0]);
  assert.equal(restarted.out, left.out); assert.equal(await served(restarted), revised.title);
  assert.equal(await served(right), markers[1]);
  console.log("✓ restart retains the repo's default folder without disturbing another live server");

  cli(repos[0], ["--stop"]);
  const explicit = join(scratch, "explicit-bundle");
  cli(repos[0], [relVideo, "--out", explicit, "--detach", "--no-open", "--no-notify", "--port", "0"]);
  const custom = serverInfo(repos[0]); assert.equal(custom.out, explicit);
  cli(repos[0], [relVideo, "--detach", "--no-open", "--no-notify"]);
  assert.equal(serverInfo(repos[0]).pid, custom.pid); assert.equal(serverInfo(repos[0]).out, explicit);
  assert.equal(await served(custom), revised.title); assert.equal(await served(right), markers[1]);
  console.log("✓ explicit output survives reuse and keeps the other repo's page intact");
} finally {
  for (const repo of liveRepos) {
    try { cli(repo, ["--stop"]); } catch { /* only this spec's recorded servers are eligible */ }
  }
  for (const out of outputs) rmSync(out, { recursive: true, force: true });
  rmSync(scratch, { recursive: true, force: true });
}
