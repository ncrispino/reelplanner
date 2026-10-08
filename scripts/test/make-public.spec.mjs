#!/usr/bin/env node
// scripts/release/make-public.mjs (D-310), against a small scratch repo with a few commits (a .wav in an early one,
// taken out since), a second branch and a tag, a tracked file its .gitignore matches, a symlink and an executable:
//   - the new repo is one commit on main, "reelplanning <version>", by --author (or the repo's git user), tagged
//     v<version>, with no remote and nothing from the history (the old .wav is in no object)
//   - its tree is the ref's, path for path and blob for blob, except .reelplanning/README.md, which gains the one
//     line saying the record's commit ids are in the development history (once, however often it is run)
//   - a tree holding a .wav, an .mp4 or a renders/ path is refused before anything is made
//   - nothing is pushed (a local bare "public" repo stays empty; the push is printed), and the source is untouched
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync, chmodSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-make-public-"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2000)}` : ""}`); if (!cond) failed++; };
const ENV = { ...process.env, GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t" };
const gitIn = (cwd) => (...a) => execFileSync("git", ["-C", cwd, "-c", "commit.gpgsign=false", ...a], { encoding: "utf8", env: ENV, stdio: ["ignore", "pipe", "pipe"] }).trim();
const SRC = join(tmp, "src"), src = gitIn(SRC);
const write = (rel, text) => { mkdirSync(dirname(join(SRC, rel)), { recursive: true }); writeFileSync(join(SRC, rel), text); };
const commit = (msg) => { src("add", "-A", "-f"); src("commit", "-q", "-m", msg); return src("rev-parse", "HEAD"); };
const SCRIPT = join(ROOT, "scripts", "release", "make-public.mjs");
const run = (...a) => spawnSync(process.execPath, [SCRIPT, ...a], { encoding: "utf8", env: ENV });
const tree = (g, ref) => new Map(g("ls-tree", "-r", ref).split("\n").filter(Boolean).map((l) => { const t = l.indexOf("\t"); return [l.slice(t + 1), l.slice(0, t)]; }));

try {
  mkdirSync(SRC);
  src("init", "-q", "-b", "work");
  src("config", "user.name", "Repo Owner"); src("config", "user.email", "owner@example.invalid");
  write("package.json", JSON.stringify({ name: "reelplanning", version: "1.2.3" }) + "\n");
  write("README.md", "a\n");
  write(".reelplanning/README.md", "# .reelplanning\n\nThe record.\n");
  write(".reelplanning/decisions.md", "D-1 was built in 1234abc.\n");
  commit("first");
  write("videos/x/assets/voice/01.wav", "RIFF"); write("videos/x/assets/voice/01.mp3", "ID3"); commit("a voice");
  src("rm", "-q", "--cached", "videos/x/assets/voice/01.wav"); rmSync(join(SRC, "videos/x/assets/voice/01.wav"));
  write(".gitignore", "*.log\n"); write("kept.log", "tracked though ignored\n");
  write("bin/run.sh", "#!/bin/sh\necho hi\n"); chmodSync(join(SRC, "bin/run.sh"), 0o755);
  symlinkSync("../README.md", join(SRC, "videos", "link.md"));
  const tip = commit("the voice out, the rest in");
  src("branch", "other", tip); src("tag", "v0", tip);
  const refsBefore = src("for-each-ref", "--format=%(refname) %(objectname)");
  const PUB = join(tmp, "public.git");
  execFileSync("git", ["init", "-q", "--bare", PUB]);

  // ── the export ──
  const out = join(tmp, "out");
  const r = run(PUB, "--repo", SRC, "--out", out, "--author", "Release Person <release@example.invalid>", "--date", "2026-10-08T12:00:00Z");
  const said = `${r.stdout}${r.stderr}`;
  const DIR = join(out, "reelplanning");
  ok("it finishes and prints the push, never running it", r.status === 0 && said.includes(`git -C ${DIR} push ${PUB} main --tags`) && /nothing was pushed/.test(said), said);
  if (r.status === 0) {
    const dst = gitIn(DIR);
    ok("one commit on main, nothing else: no other branch, no remote", dst("rev-list", "--count", "--all") === "1" && dst("symbolic-ref", "HEAD") === "refs/heads/main" && dst("remote") === "",
      dst("for-each-ref", "--format=%(refname)"));
    ok("the tag v<version> is on it, and only that tag", dst("for-each-ref", "--format=%(refname)", "refs/tags") === "refs/tags/v1.2.3" && dst("rev-parse", "v1.2.3^{commit}") === dst("rev-parse", "main"));
    // (the instant, as seconds: a newer git, 2.50 among them, writes UTC's %aI as Z, an older one as +00:00)
    ok("its message is \"reelplanning <version>\", by --author, at --date",
      dst("log", "-1", "--format=%B").trim() === "reelplanning 1.2.3" && dst("log", "-1", "--format=%an <%ae>|%cn <%ce>|%at") === `Release Person <release@example.invalid>|Release Person <release@example.invalid>|${Date.parse("2026-10-08T12:00:00Z") / 1000}`,
      dst("log", "-1", "--format=%an <%ae>|%cn <%ce>|%aI|%B"));
    const want = tree(src, tip), have = tree(dst, "main");
    const differ = [...new Set([...want.keys(), ...have.keys()])].filter((p) => want.get(p) !== have.get(p));
    ok("the tree is the ref's, blob for blob (the ignored file, the symlink and the executable bit too), but for the record's README",
      differ.length === 1 && differ[0] === ".reelplanning/README.md" && have.get("kept.log") && have.get("videos/link.md")?.startsWith("120000") && have.get("bin/run.sh")?.startsWith("100755"), differ.join(" "));
    const readme = readFileSync(join(DIR, ".reelplanning", "README.md"), "utf8");
    ok("the record's README is the ref's with one line: its commit ids are in the development history, which is not public",
      readme.startsWith("# .reelplanning\n\nThe record.\n\n") && /Commit ids in this record .* development history, which is not public/.test(readme) && readme.trim().split("\n").length === 5, readme);
    ok("…and the record itself is left as it is (its commit ids not touched)", readFileSync(join(DIR, ".reelplanning", "decisions.md"), "utf8") === "D-1 was built in 1234abc.\n");
    const objects = dst("rev-list", "--objects", "--all").split("\n").map((l) => l.slice(41)).filter(Boolean);
    ok("nothing of the history: the .wav an early commit held is in no object, the working tree is clean", !objects.some((p) => p.endsWith(".wav")) && dst("status", "--porcelain") === "", objects.join(" "));
    ok("nothing was pushed: the public repo is still empty", gitIn(PUB)("for-each-ref") === "");
    ok("the size is printed", /pack \d+\.\d MB/.test(said), said);
  }
  ok("the source is untouched: its refs, its HEAD, its working tree", src("for-each-ref", "--format=%(refname) %(objectname)") === refsBefore && src("status", "--porcelain") === "");

  // ── defaults: the author from the repo's git config; the URL the public repo's ──
  const out2 = join(tmp, "out2");
  const d = run("--repo", SRC, "--out", out2);
  ok("without --author, the repo's git user; without a URL, the public repo's", d.status === 0 && gitIn(join(out2, "reelplanning"))("log", "-1", "--format=%an <%ae>") === "Repo Owner <owner@example.invalid>"
    && d.stdout.includes("push https://github.com/ncrispino/reelplanning.git main --tags"), `${d.stdout}${d.stderr}`);
  const again = run("--repo", SRC, "--out", out2);
  ok("an <out> already holding a reelplanning/ is refused", again.status === 1 && /exists already/.test(again.stderr), again.stderr);
  // a README that already says it gets no second line
  write(".reelplanning/README.md", readFileSync(join(out2, "reelplanning", ".reelplanning", "README.md"), "utf8")); commit("the note in the record");
  const out3 = join(tmp, "out3");
  const n = run("--repo", SRC, "--out", out3);
  const readme3 = n.status === 0 ? readFileSync(join(out3, "reelplanning", ".reelplanning", "README.md"), "utf8") : "";
  ok("a record that already says it is exported as it is, the tree identical", n.status === 0 && readme3.match(/Commit ids in this record/g)?.length === 1
    && gitIn(join(out3, "reelplanning"))("rev-parse", "main^{tree}") === src("rev-parse", "HEAD^{tree}"), `${n.stdout}${n.stderr}`);

  // ── refused: a voice file, a video or a render in the tree ──
  for (const [rel, what] of [["videos/x/assets/voice/02.WAV", "a .wav"], ["demo.mp4", "an .mp4"], ["videos/x/renders/chapters/ch1.webm", "a renders/ path"]]) {
    const before = src("rev-parse", "HEAD");
    write(rel, "media"); commit(`add ${what}`);
    const o = join(tmp, `out-media-${what.replace(/\W/g, "")}`);
    const m = run("--repo", SRC, "--out", o);
    ok(`${what} in the tree is refused, named, and nothing is made`, m.status === 1 && m.stderr.includes(rel) && /none goes public \(D-305\)/.test(m.stderr) && !existsSync(join(o, "reelplanning")), m.stderr);
    src("reset", "-q", "--hard", before);
  }
  // --ref exports that commit, not HEAD
  const out4 = join(tmp, "out4");
  const f = run("--repo", SRC, "--out", out4, "--ref", tip);
  ok("--ref exports that commit's tree", f.status === 0
    && gitIn(join(out4, "reelplanning"))("ls-files") === src("ls-tree", "-r", "--name-only", tip), `${f.stdout}${f.stderr}`);
  ok("no author anywhere is refused", (() => { src("config", "--unset", "user.name"); const x = spawnSync(process.execPath, [SCRIPT, "--repo", SRC, "--out", join(tmp, "out5")], { encoding: "utf8", env: { ...ENV, HOME: tmp, XDG_CONFIG_HOME: tmp, GIT_CONFIG_NOSYSTEM: "1" } }); return x.status === 1 && /no author: pass --author/.test(x.stderr); })());
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ make-public: one commit with the ref's tree, media refused, never pushed");
process.exit(failed ? 1 : 0);
