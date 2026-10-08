#!/usr/bin/env node
// Build the public repo (D-310) in a scratch folder: a fresh git repo whose `main` is one commit holding exactly
// the tracked tree of a ref of this repo, tagged v<version>. The public repo carries none of this repo's history;
// this private repo keeps all of it, and nothing here changes it. Nothing is pushed: the script ends with the
// push command for the owner to run (docs/releasing.md, "Going public").
//
//   1. refuse a tree that holds a .wav, an .mp4 or a renders/ path (D-305: no voice file or render is committed)
//   2. `git archive <ref>` into <out>/reelplanning, a new repo on `main`; every file added (ignored ones too, as
//      they are tracked here), and the tree checked: it must be <ref>'s tree, object for object
//   3. one line added to .reelplanning/README.md: the commit ids the record cites (decisions, reviews,
//      walkthroughs, versions) name commits of the development history, which is not public
//   4. one commit, "reelplanning <version>" (package.json at <ref>), by --author or this repo's git user; the tag
//      v<version>; repack, and print the size and the push command
//
// usage: node scripts/release/make-public.mjs [<public-remote-url>] [--ref HEAD] [--out <dir>] [--repo <checkout>]
//                                             [--author "Name <email>"] [--date <date>]
//   <public-remote-url>  only printed, in the push command (default https://github.com/ncrispino/reelplanning.git)
//   --ref     the commit whose tree is exported (default HEAD of --repo); what is committed, not the working tree
//   --out     where the new repo goes (default a new folder under the system's temp dir); <out>/reelplanning must
//             not exist yet
//   --repo    the checkout to export from (default the one this script is in); a shallow clone is fine
//   --author  the commit's author and committer (default user.name and user.email of --repo's git config)
//   --date    the commit's date (default now), in any form git takes
//
// Not shipped in the npm package (package.json `files` takes scripts/*.mjs, not scripts/release/).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const PUBLIC = "https://github.com/ncrispino/reelplanning.git";
// the paths no public tree may hold (D-305), as pr-check refuses them in a PR
const MEDIA = /\.(wav|mp4)$|(^|\/)renders\//i;
const NOTE = "Commit ids in this record (decisions, reviews, walkthroughs, versions) name commits of reelplanning's development history, which is not public: this repo starts at one commit holding the tree of the release.";

const argv = process.argv.slice(2);
const FLAGS = ["--ref", "--out", "--repo", "--author", "--date"];
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d; };
const die = (m) => { console.error(`✗ make-public: ${m}`); process.exit(1); };
if (argv.includes("--help") || argv.includes("-h")) {
  const head = readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1);
  console.log(head.slice(0, head.findIndex((l) => !l.startsWith("//"))).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}
const unknown = argv.filter((a, i) => a.startsWith("--") && !FLAGS.includes(a) && !FLAGS.includes(argv[i - 1]));
if (unknown.length) die(`unknown option ${unknown.join(", ")} (--help lists them)`);
const url = argv.find((a, i) => !a.startsWith("--") && !FLAGS.includes(argv[i - 1])) || PUBLIC;
const SRC = resolve(flag("repo", join(dirname(fileURLToPath(import.meta.url)), "..", "..")));
const REF = flag("ref", "HEAD");
const OUT = resolve(flag("out", "") || mkdtempSync(join(tmpdir(), "reelplanning-public-")));
const DIR = join(OUT, "reelplanning");

const gitIn = (cwd) => (...a) => execFileSync("git", ["-C", cwd, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 30 });
const src = gitIn(SRC);
const say = (m) => console.log(m);

let tip, tree;
try { tip = src("rev-parse", "--verify", `${REF}^{commit}`).trim(); tree = src("rev-parse", `${tip}^{tree}`).trim(); }
catch { die(`${REF} is not a commit of ${SRC}`); }
let version;
try { version = JSON.parse(src("show", `${tip}:package.json`)).version; } catch { /* below */ }
if (!version) die(`no version in package.json at ${REF}`);
const conf = (k) => { try { return src("config", k).trim(); } catch { return ""; } };
const author = flag("author", "") || (conf("user.name") && conf("user.email") ? `${conf("user.name")} <${conf("user.email")}>` : "");
const who = author.match(/^\s*(.+?)\s*<([^<>]+)>\s*$/);
if (!who) die(author ? `--author "${author}" is not "Name <email>"` : `no author: pass --author "Name <email>", or set user.name and user.email in ${SRC}`);

// ── 1. no voice file or render in the tree ───────────────────────────────────────────────────────────────────
const paths = src("ls-tree", "-r", "-z", "--name-only", tip).split("\0").filter(Boolean);
const media = paths.filter((p) => MEDIA.test(p));
if (media.length) die(`${REF}'s tree holds ${media.length} voice file(s), video(s) or render(s), and none goes public (D-305): ${media.slice(0, 5).join(", ")}${media.length > 5 ? ", …" : ""}. Take them out of the tree (git rm --cached) and commit first.`);
if (existsSync(DIR)) die(`${DIR} exists already: pass another --out`);
say(`make-public: ${SRC} at ${tip.slice(0, 12)} (${REF}), reelplanning ${version}: ${paths.length} files → ${DIR}`);
if (REF === "HEAD") {
  const dirty = (() => { try { return src("status", "--porcelain", "--untracked-files=no").split("\n").filter(Boolean).length; } catch { return 0; } })();
  if (dirty) say(`△ ${dirty} uncommitted change(s) in ${SRC} are not exported: the export is HEAD as committed`);
}

// ── 2. the tree, in a new repo ───────────────────────────────────────────────────────────────────────────────
mkdirSync(DIR, { recursive: true });
const git = (...a) => execFileSync("git", ["-C", DIR, "-c", "core.autocrlf=false", "-c", "core.safecrlf=false", "-c", "commit.gpgsign=false", "-c", "tag.gpgsign=false", ...a],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 30, env: { ...process.env, ...ident() } });
git("init", "-q");
git("symbolic-ref", "HEAD", "refs/heads/main");
const tar = join(OUT, "tree.tar");
src("archive", "--format=tar", "-o", tar, tip);
execFileSync("tar", ["-xf", tar, "-C", DIR], { stdio: ["ignore", "ignore", "inherit"] });
rmSync(tar);
git("add", "-A", "-f");
const got = git("write-tree").trim();
if (got !== tree) {
  const list = (out) => new Map(out.split("\0").filter(Boolean).map((l) => { const t = l.indexOf("\t"); return [l.slice(t + 1), l.slice(0, t)]; }));
  const want = list(src("ls-tree", "-r", "-z", tip)), have = list(git("ls-tree", "-r", "-z", got));
  const diff = [...new Set([...want.keys(), ...have.keys()])].filter((p) => want.get(p) !== have.get(p));
  die(`the exported tree is not ${REF}'s (${diff.length} path(s) differ: ${diff.slice(0, 5).join(", ")}); nothing was committed in ${DIR}`);
}
say(`· the tree: ${REF}'s, object for object (${tree.slice(0, 12)})`);

// ── 3. the record says where its commit ids point ────────────────────────────────────────────────────────────
const readme = join(DIR, ".reelplanning", "README.md");
if (existsSync(readme)) {
  const text = readFileSync(readme, "utf8");
  if (!text.includes(NOTE)) {
    writeFileSync(readme, `${text.replace(/\n*$/, "\n")}\n${NOTE}\n`);
    git("add", "-f", "--", ".reelplanning/README.md");
    say("· .reelplanning/README.md: one line added, saying the commit ids the record cites are in the development history");
  }
}

// ── 4. one commit, the tag, the size, the push ───────────────────────────────────────────────────────────────
git("commit", "-q", "-m", `reelplanning ${version}`);
git("tag", "-a", `v${version}`, "-m", `reelplanning ${version}`);
git("gc", "--quiet", "--aggressive", "--prune=now");
const count = git("rev-list", "--count", "--all").trim();
const pack = Number((git("count-objects", "-v").match(/^size-pack: (\d+)$/m) || [])[1] || 0) * 1024;
const files = git("ls-files", "-z").split("\0").filter(Boolean).length;
say(`✓ ${DIR}: main, ${count} commit, "reelplanning ${version}" by ${who[1]} <${who[2]}>, tag v${version}; ${files} files, pack ${(pack / 1e6).toFixed(1)} MB; no .wav, .mp4 or renders/`);
say(`  nothing was pushed. To publish it (once, to the new, empty public repo):`);
say(`    git -C ${DIR} push ${url} main --tags`);

function ident() {
  const date = flag("date", "");
  return { GIT_AUTHOR_NAME: who[1], GIT_AUTHOR_EMAIL: who[2], GIT_COMMITTER_NAME: who[1], GIT_COMMITTER_EMAIL: who[2],
    ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}) };
}
