#!/usr/bin/env node
// Build an earlier version of a video again: the one a review was of, after the video has moved on.
//
// Each version a reviewer opened is kept (scripts/lib/versions.mjs says what and where): the commit its scenes are in,
// the files git leaves out that nothing makes again (screenshots, captured text) in .reelplanning/media/, and the
// tools and narration it was built with. This puts that version together in a folder of its own, outside the repo,
// and builds it there; the current video is not touched.
//
//   1. a git worktree of the whole repo at the version's commit (`git worktree add --detach`): the scenes, plan.md, the
//      ledger, runs/, walkthrough.md and the history are all as they were then, so the guide and the plan map are made
//      from what that version was made from, and the build compares against that version as the last one committed
//   2. the kept files back in their places, each checked against the hash kept with it; the fonts and sounds the tools
//      ship, from the tools installed here
//   3. `reelplanning build` on it: the voice is made again (the recorded voice and speed; this machine's engine, said
//      when it is not the one recorded), then the captions, index, plan map, checks, pictures and the guide with them.
//      With --no-build, only the guide is built (without the scenes' pictures, which need the build's snapshots)
// It says what came back exactly, what was made again, and anything it could not bring back.
//
// usage: reelplanning rebuild <video-dir>                       list the versions kept (1 = the oldest)
//        reelplanning rebuild <video-dir> --version <n|build|commit> [--out <dir>] [--no-build]
//        reelplanning rebuild <video-dir> --keep                keep the current version now (review and record do it)
//        (also `reel rebuild …`)
//   --version   the version's number in the list, its build id or signature, or (a prefix of) its commit
//   --out       where the worktree goes (default: <tmp>/reelplanning-rebuild/<plan>-<video>-v<n>), outside the repo; it
//               must be empty or a rebuild this command made (that one is replaced). The video is at <out>/<its path>
//   --no-build  put it together and build its guide, then stop: `reelplanning build <out-video>` builds the rest
//   then:       reelplanning review <out-video>   (a review sent from there lands in the worktree's own inbox)
//               git worktree remove --force <out>  when you are done with it
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative, basename, sep } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { ROOT } from "./lib/env.mjs";
import { videoInfo, listVersions, keepVersion, keepLines, restoreFiles, restoreShipped, buildSig, sigId, AV } from "./lib/versions.mjs";

const argv = process.argv.slice(2);
const VALUED = ["--version", "--out"];
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null; };
const USAGE = "usage: reelplanning rebuild <video-dir> [--version <n|build|commit>] [--out <dir>] [--no-build] | --keep";
const project = argv.find((a, i) => !a.startsWith("--") && !VALUED.includes(argv[i - 1]));
const die = (m) => { console.error(`✗ rebuild: ${m}`); process.exit(1); };
if (!project) die(USAGE);
if (!existsSync(project)) die(`${project}: no such folder`);
const info = videoInfo(project);
if (info.skip) die(`${project}: ${info.skip}, so it keeps no versions`);
const rel = (p) => relative(process.cwd(), p) || ".";
const short = (c) => (c ? c.slice(0, 7) : "none");
const git = (cwd, args, opts = {}) => spawnSync("git", args, { cwd, maxBuffer: 1 << 30, encoding: "utf8", ...opts });

if (argv.includes("--keep")) {
  const r = keepVersion(info.dir, { by: "keep" });
  if (r.status === "skip") die(r.why);
  const lines = keepLines(r);
  console.log(lines.length ? lines.join("\n") : `· version ${r.n} of ${info.rel} is kept already (${rel(r.file)})`);
  process.exit(0);
}

const versions = listVersions(info);
const mapNow = (() => { try { return JSON.parse(readFileSync(join(info.dir, "plan-map.json"), "utf8")); } catch { return null; } })();
const nowId = mapNow ? sigId(buildSig(mapNow)) : null;

if (!flag("version")) {
  if (!versions.length) { console.log(`· ${info.rel}: no versions kept yet (\`reelplanning review ${rel(info.dir)}\` keeps the one it opens; \`--keep\` keeps it now)`); process.exit(0); }
  console.log(`versions of ${info.rel} (reel rebuild ${rel(info.dir)} --version <n> builds one again):`);
  for (const v of versions) {
    const kinds = (v.files || []).length ? `${v.files.length} file(s) kept` : "nothing kept outside git";
    const when = String(v.keptAt || "").replace("T", " ").slice(0, 16);
    console.log(`  ${String(v.n).padStart(2)}  ${when}  build ${v.id}  commit ${short(v.commit)}${v.dirty?.length ? ` (+${v.dirty.length} uncommitted)` : ""}  ${kinds}  · ${v.keptBy}${v.id === nowId ? "  ← the video now" : ""}`);
  }
  process.exit(0);
}

// ── which version ───────────────────────────────────────────────────────────────────────────────────────
const want = flag("version");
const v = (/^\d+$/.test(want) && Number(want) >= 1 && Number(want) <= versions.length ? versions[Number(want) - 1] : null)
  || versions.find((x) => x.id === want || x.build === want)
  || (/^[0-9a-f]{4,40}$/i.test(want) ? (() => { const c = versions.filter((x) => x.commit?.startsWith(want.toLowerCase()) || x.id.startsWith(want.toLowerCase())); return c.length ? c.at(-1) : null; })() : null);
if (!v) die(`no version "${want}" of ${info.rel}: ${versions.length ? `one of 1-${versions.length}, a build id or a commit (reel rebuild ${rel(info.dir)} lists them)` : "none kept yet"}`);
if (!v.commit) die(`version ${v.n} was kept before the repo had a commit: its scenes are nowhere to take them from`);
if (git(info.top, ["cat-file", "-e", `${v.commit}^{commit}`]).status !== 0) die(`version ${v.n}'s commit ${short(v.commit)} is not in this clone (a shallow clone, or history rewritten): \`git fetch --unshallow\`, or fetch that commit`);

// ── 1. a worktree of the whole repo at the version's commit ─────────────────────────────────────────────
// (the mark that it is ours sits in the worktree's own git folder, never in the repo's tree or its info/exclude)
const MARK = "reelplanning-rebuild.json";
const slug = `${basename(info.owner)}-${info.name}-v${v.n}`.replace(/^\.reelplanning-/, "");
const out = resolve(flag("out") || join(tmpdir(), "reelplanning-rebuild", slug));
if (out === info.top || info.top.startsWith(out + sep) || out.startsWith(info.top + sep)) die(`--out ${rel(out)}: put it outside the repo (it is a worktree of its own)`);
const markOf = (dir) => { const g = git(dir, ["rev-parse", "--absolute-git-dir"]); return g.status === 0 ? join(g.stdout.trim(), MARK) : null; };
const G = ["-c", "core.hooksPath=/dev/null"];   // no hook of the repo's runs on this checkout
if (existsSync(out) && readdirSync(out).length) {
  const m = existsSync(join(out, ".git")) && markOf(out);
  if (!m || !existsSync(m)) die(`--out ${rel(out)} is not empty, and not a rebuild this command made: pick another folder`);
  const r = git(info.top, [...G, "worktree", "remove", "--force", out]);
  if (r.status !== 0) die(`could not replace the earlier rebuild in ${rel(out)}: ${r.stderr.trim()} (git worktree remove --force ${rel(out)})`);
}
mkdirSync(out, { recursive: true });
git(info.top, ["worktree", "prune"]);
const add = git(info.top, [...G, "worktree", "add", "--detach", "-q", out, v.commit], { env: { ...process.env, GIT_LFS_SKIP_SMUDGE: "1" } });
if (add.status !== 0) die(`git worktree add at ${short(v.commit)} failed: ${add.stderr.trim()}`);
writeFileSync(markOf(out), JSON.stringify({ from: info.rel, repo: info.top, version: v.n, id: v.id, commit: v.commit, at: new Date().toISOString() }, null, 2) + "\n");
const outVideo = join(out, info.rel);
if (!existsSync(join(outVideo, "STORYBOARD.md"))) die(`commit ${short(v.commit)} has no ${info.rel}/STORYBOARD.md: the video was not committed there (the worktree is in ${rel(out)})`);

// the scenes against the ones kept: what the commit holds that the reviewer did not see
const kept = v.scenes || {}, got = scenesOfTree(outVideo);
const differ = Object.keys({ ...kept, ...got }).filter((p) => !AV.test(p) && kept[p] !== got[p]).sort();
function scenesOfTree(dir) {
  // the same hashes the version kept, over the files checked out (only what the commit has is there yet)
  const outp = {};
  const walk = (abs, r) => { for (const e of readdirSync(abs)) { const a = join(abs, e), p = r ? `${r}/${e}` : e; if (statSync(a).isDirectory()) walk(a, p); else outp[p] = sha(a); } };
  walk(dir, "");
  return outp;
}
function sha(p) { return createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 16); }

// ── 2. the kept files, and what the tools ship ──────────────────────────────────────────────────────────
const back = restoreFiles(info.rp, v, outVideo), tools = restoreShipped(v, outVideo);


// ── what it says ────────────────────────────────────────────────────────────────────────────────────────
console.log(`rebuild ${info.rel}, version ${v.n} of ${versions.length} (build ${v.id}, kept ${String(v.keptAt).slice(0, 10)} by ${v.keptBy}) → ${rel(outVideo)}`);
console.log(differ.length
  ? `△ scenes from commit ${short(v.commit)}, but ${differ.length} file(s) differ from the ones reviewed${v.dirty?.length ? " (they were not committed when the version was kept)" : ""}: ${differ.slice(0, 8).join(", ")}${differ.length > 8 ? ", …" : ""}`
  : `✓ scenes from commit ${short(v.commit)}: every file as reviewed (${Object.keys(kept).length})`);
const nFiles = (v.files || []).length;
if (nFiles) console.log(`${back.missing.length ? "△" : "✓"} kept files back: ${back.exact.length} byte for byte${back.same.length ? `, ${back.same.length} the same pixels (kept as lossless WebP)` : ""}${back.missing.length ? `; not back: ${back.missing.map((m) => `${m.path} (${m.why})`).join("; ")}` : ""}`);
else console.log("· no files to bring back: git holds all of this version but its voice and build");
if ((v.shipped || []).length) console.log(`${tools.missing.length ? "△" : "✓"} ${tools.back.length} file(s) the tools ship (fonts, sounds) back from the tools installed here${tools.missing.length ? `; not back: ${tools.missing.map((m) => `${m.path} (${m.why})`).join("; ")}` : ""}`);
if ((v.lost || []).length) console.log(`△ not brought back, nothing makes them again: ${v.lost.map((l) => l.path).join(", ")}`);
const regen = Object.entries(v.regenerated || {}).map(([p, n]) => `${p}${n > 1 ? ` (${n})` : ""}`);
const N = v.narration;
console.log(`· made again: the voice and its word timings${N ? ` (${N.lines} line(s), ${N.voice} ×${N.speed}${N.model ? `, ${N.model}` : ""})` : ""}${regen.length ? ` [${regen.join(", ")}]` : ""}; then by the build: ${[...new Set([...(v.rebuilt || []), "guide/"])].join(", ")}`);
const T = v.tools || {}, nowPkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const ownNow = existsSync(join(ROOT, ".git")) ? String(git(ROOT, ["rev-parse", "HEAD"]).stdout || "").trim() : "";
const toolDiff = [T.reelplanning && T.reelplanning !== nowPkg.version && `reelplanning ${T.reelplanning} (now ${nowPkg.version})`,
  T.reelplanning === nowPkg.version && T.reelplanningCommit && ownNow && T.reelplanningCommit !== ownNow && `reelplanning at ${short(T.reelplanningCommit)} (now ${short(ownNow)})`,T.hyperframes && T.hyperframes !== nowPkg.dependencies?.hyperframes && `HyperFrames ${T.hyperframes} (now ${nowPkg.dependencies?.hyperframes})`].filter(Boolean);
if (toolDiff.length) console.log(`△ built then with ${toolDiff.join(", ")}: frames may come out a little differently`);

// the narration this machine would use, against the one recorded
if (N?.model) {
  const d = spawnSync(process.execPath, [join(ROOT, "scripts", "narrate.mjs"), outVideo, "--dry-run", "--json"], { encoding: "utf8", env: process.env });
  let now = null; try { now = JSON.parse(d.stdout); } catch { /* no engine to ask */ }
  if (now && (now.model !== N.model || now.voice !== N.voice || Number(now.speed) !== Number(N.speed)))
    console.log(`△ the voice was made with ${N.model} (${N.voice} ×${N.speed}); here it is ${now.model} (${now.voice} ×${now.speed}): it will not sound the same (narration settings: .reelplanning/config.json, REELPLANNING_TTS)`);
  else if (now) console.log(`· the voice: ${now.model}, ${now.voice} ×${now.speed}, as recorded`);
}

const done = `when you are done with it: git worktree remove --force ${rel(out)}`;
if (argv.includes("--no-build")) {
  // the guide, from what the commit has (plan.md, the ledger, runs/, git); its scenes' pictures wait for the build
  const g = spawnSync(process.execPath, [join(ROOT, "scripts", "guide.mjs"), outVideo, "--no-thumbs", "--quiet"], { encoding: "utf8", env: process.env });
  console.log(g.status === 0 ? `✓ its guide, made from the commit (without the scenes' pictures: the build takes them)` : `△ its guide did not build: ${`${g.stdout}${g.stderr}`.trim().split("\n").at(-1)}`);
  console.log(`· not built (--no-build): reelplanning build ${rel(outVideo)}\nthen: reelplanning review ${rel(outVideo)}\n${done}`);
  process.exit(back.missing.length || tools.missing.length ? 1 : 0);
}
console.log(`▶ reelplanning build ${rel(outVideo)}`);
const b = spawnSync(process.execPath, [join(ROOT, "scripts", "build.mjs"), outVideo], { stdio: "inherit", env: { ...process.env, REELPLANNING_REBUILD: "1" }, cwd: process.cwd() });
if (b.status !== 0) { console.log(`✗ version ${v.n} put together in ${rel(outVideo)}, but its build stopped (above): fix what it says there and run \`reelplanning build ${rel(outVideo)}\`\n${done}`); process.exit(1); }
console.log(`✓ version ${v.n} of ${info.rel} built again in ${rel(outVideo)}${back.missing.length || tools.missing.length || v.lost?.length ? " (all but what is said above)" : ""}; the voice is new\nopen it: reelplanning review ${rel(outVideo)}\n${done}`);
