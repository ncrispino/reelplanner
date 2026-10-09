#!/usr/bin/env node
// Pack the review player plus one or more built video projects into a self-contained folder that
// can be hosted anywhere static (an Artifact, a bucket, a docs site). Everything the page needs is
// copied in and the repo-relative paths are rewritten; nothing is fetched from node_modules or the
// repo root at run time.
//
// Voice audio is transcoded wav → mp3 (about 6× smaller) and the composition's <audio src> values
// are rewritten to match, which is what keeps a three-project bundle inside a hosting size budget.
//
// Every project carries the same fonts (and their licences) and the same gsap.min.js. Those are
// written once, under shared/fonts/ and shared/vendor/, deduped by content hash, and each project's
// HTML is pointed at the shared copy: without it a seven-video bundle is 540 files, over the 512
// an Artifact version may hold. Only byte-identical files are shared; a project whose Inter-400.woff2
// differs from the one already in shared/ keeps its own copy under its own assets/.
//
// With more than one video the page gets a library: what needs the reviewer, then the repo's system video
// and the recent plans, the rest folded behind "Earlier plans (N)"; each plan is one row with a Plan | Built
// switch (walkthroughs-that-help step 5), and the page's header carries the same switch for the video open. Pass
// `--reelplanning <dir>` to list every plan in that record, including ones with no video yet.
//
// Every path argument is relative to the caller's working directory; the only things read from where
// reelplanning is installed are the player itself and the HyperFrames runtime it depends on.
//
// A plan's or an explainer's video gets its guide beside it, <slug>/guide/ (the plan guide): the full page and its
// pictures as `reelplanning guide` builds them, built here first when missing or older than its plan.md,
// walkthrough.md or sources.json. The part pages are left out: this page reads a part in the guide under the video.
// Any other video with parts (details/) gets a full page made from them (scripts/lib/guide-page.mjs).
// The page shows the open video's guide under its player (D-264, superseding D-228): <reelplanning-guide>, which frames
// guide/index.html?embed=1 as tall as the window; scrolled to, the video goes on in a small player in the corner. The
// plan's row links it, Guide beside Plan | Built: that video, with the page down at its guide (?project=<slug>#guide).
// guide/index.html still opens on its own, as a fallback.
//
// The videos a bundled video builds on (its plan map's prerequisites, "Before you watch": the system video or one of its
// chapters, the explainer or the plan it starts from) come with it, when they are built in this repo's .reelplanning/:
// a page opened for one video (`reelplanning review <video-dir>`) plays them too, a row's link opening that video at its
// chapter. Only those named directly (not what they build on in turn), each at most once, and only while the page stays
// within FILE_BUDGET files (the 512 an Artifact version may hold); one carried this way gets its guide only when one is
// built and current (a guide is never built for it here). A row the page cannot carry says why (its `away` in the
// packed plan map: not built yet, not found in this repo, left off for size), which the player puts in plain words.
//
// The page names the repo its videos belong to (`repo` on the player, <meta name="reelplanning-repo"> in each guide):
// the review server uses one port for every repo (8787) and a browser keeps one localStorage per origin, so the player
// keeps a review's record and its watched marks under that name (reelplanning-player.js recordKey). It is the repo's
// folder name and a short hash of its origin remote (the same in every clone and worktree), or of its path when it has
// none.
//
// usage: reelplanning bundle-player <out-dir> <project-dir> [<project-dir> …] [--reelplanning <.reelplanning dir>]
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { resolve, join, basename, dirname, sep, relative, posix } from "node:path";
import { execFileSync, spawnSync, execFile } from "node:child_process";
import { cpus } from "node:os";
import { createHash } from "node:crypto";
import { ROOT, depFile, GSAP, repoRoot, rpInitialized, realPath } from "./lib/env.mjs";
import { rpDirFor, videoDirFor } from "./lib/terms.mjs";
import { planStage, openQuestions, lastChanged, listReviews, verdictOf } from "./lib/reviews.mjs";
import { guidePage, pointFaces } from "./lib/guide-page.mjs";
import { guideTarget } from "./lib/guide/model.mjs";
import { readWalkthrough } from "./lib/guide/built.mjs";
import { choicesOf, choiceCounts } from "./lib/guide/reader.mjs";
import { readSources, commitsSince, plannedFrom, endOf, END_WORDS } from "./lib/explainer.mjs";
const argv = process.argv.slice(2);
const rpAt = argv.indexOf("--reelplanning"); const RP = rpAt >= 0 ? resolve(argv[rpAt + 1]) : null;
// (only when --reelplanning was given: with rpAt = -1, `i !== rpAt + 1` would drop the out dir and
// make the first project the out dir — which the rmSync below then deletes)
const [outArg, ...projects] = rpAt < 0 ? argv : argv.filter((a, i) => i !== rpAt && i !== rpAt + 1);
if (!outArg || !projects.length) { console.error("usage: reelplanning bundle-player <out-dir> <project-dir> …"); process.exit(1); }
const OUT = resolve(outArg);
// the out dir is emptied first, so refuse anything that would take the package or a project with it
const installed = ROOT.split(sep).includes("node_modules"); // an npx / npm install, not a checkout's own dist/
if (OUT === ROOT || ROOT.startsWith(OUT + sep) || (installed && OUT.startsWith(ROOT + sep))) { console.error(`✗ ${outArg}: the bundle cannot go inside reelplanning's own install (${ROOT})`); process.exit(1); }
if (projects.some((p) => resolve(p) === OUT || resolve(p).startsWith(OUT + sep))) { console.error(`✗ ${outArg}: would delete a project it bundles — pick another out dir`); process.exit(1); }
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "vendor"), { recursive: true });

const size = (p) => statSync(p).size;
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const human = (n) => n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1e3)} KB`;

// ---- shared: the runtime, the web component, the annotation layer ----
// (resolved, not ROOT/node_modules: under npx the dependencies sit beside reelplanning in the cache)
cpSync(depFile("@hyperframes/core", "dist/hyperframe.runtime.iife.js"), join(OUT, "vendor/hyperframe.runtime.iife.js"));
cpSync(depFile("@hyperframes/player", "dist/hyperframes-player.js"), join(OUT, "vendor/hyperframes-player.js"));
writeFileSync(join(OUT, "reelplanning-player.js"),
  readFileSync(join(ROOT, "packages/player/reelplanning-player.js"), "utf8")
    .replace('import "../../node_modules/@hyperframes/player/dist/hyperframes-player.js";', 'import "./vendor/hyperframes-player.js";'));
// The page's own typefaces (not the videos'): packages/player/fonts/faces.json lists them, and only what it
// lists is copied, with each face's licence, beside the player as fonts/. The player declares them in the
// page's head; the page gets the list inline and a preload per file (below), so they are declared at once.
const FONTS = join(ROOT, "packages/player/fonts"), FACES = JSON.parse(readFileSync(join(FONTS, "faces.json"), "utf8"));
mkdirSync(join(OUT, "fonts"), { recursive: true });
for (const f of new Set(["faces.json", ...FACES.faces.flatMap((x) => [x.file, x.licence].filter(Boolean))])) cpSync(join(FONTS, f), join(OUT, "fonts", f));
const FONT_HEAD = `<script type="application/json" id="rp-faces">${JSON.stringify(FACES).replace(/</g, "\\u003c")}</script>\n`
  + FACES.faces.map((x) => `<link rel="preload" href="fonts/${x.file}" as="font" type="font/woff2" crossorigin>\n`).join("");

// Every plan's video lives in a folder called video/, so the folder name can't be the slug: a plan
// video is named for its plan, a walkthrough for its plan plus "--walkthrough", the system video
// "system", anything else for its folder.
function slugFor(src, taken) {
  const m = src.replace(/\/+$/, "").match(/\.reelplanning\/(?:plans\/([^/]+)\/(video|walkthrough-video)|(system-video))$/);
  const e = src.replace(/\/+$/, "").match(/\.reelplanning\/explainers\/([^/]+)\/video$/);   // an explainer: <name>--explainer
  const base = e ? `${e[1]}--explainer` : m?.[3] ? "system" : m ? (m[2] === "video" ? m[1] : `${m[1]}--walkthrough`) : basename(src);
  let s = base; for (let i = 2; taken.includes(s); i++) s = `${base}-${i}`;
  return s;
}
// The repo these videos belong to, as the page keeps its saved state under it (see the top): <name>-<hash>, from the
// folder holding .reelplanning/ (or the git top level); its origin remote when that folder is a git repo's top, else
// its path. Never the enclosing repo's remote for a folder inside another repo.
function repoIdOf(dir) {
  const root = resolve(dir), git = (...a) => { try { return execFileSync("git", ["-C", root, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
  const top = git("rev-parse", "--show-toplevel"), remote = top && realPath(top) === realPath(root) ? git("remote", "get-url", "origin") : "";
  const at = remote ? remote.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").replace(/^[^@/]*@/, "").replace(/^([^/:]+):(?!\d+\/)/, "$1/").replace(/\.git$/i, "").replace(/\/+$/, "").toLowerCase() : root;
  const name = (remote ? at.split("/").pop() : basename(root)).toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "repo";
  return `${name}-${createHash("sha256").update(at).digest("hex").slice(0, 8)}`;
}
const REPO_ID = repoIdOf(RP ? dirname(RP) : repoRoot(projects[0]));
// Whether that repo keeps a decision log (.reelplanning/decisions.json), found as the review server finds it (review.mjs
// findRp): without one a review has no record to go into and downloads, and the page tells the player so (`record="none"`),
// whose Finish then asks for the download and tells the reviewer to hand the file to their agent, with no `reel record`.
const RECORD = rpInitialized(RP || join(repoRoot(projects[0]), ".reelplanning"));
// (a guide page names it too: its notes and answers are kept where the review page's player keeps them)
const withRepo = (html) => html.replace(/<head>/i, () => `<head>\n<meta name="reelplanning-repo" content="${REPO_ID}">`);
const where = {}; // slug → source dir, for the library
const guides = new Set(); // slugs with a full guide page beside them

// ---- shared assets: fonts and gsap, one copy per distinct file ----
const SHARED = join(OUT, "shared");
const sharedByHash = new Map(), sharedByPath = new Map(); // content hash → shared file; shared file → hash
const hashOf = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const filesUnder = (d) => existsSync(d) ? readdirSync(d, { recursive: true }).map(String).filter((f) => statSync(join(d, f)).isFile()) : [];
// the shared copy of `file` (as shared/<kind>/<rel>), or null when that name is already taken by a
// different file: then the project keeps its own
function share(kind, rel, file) {
  const h = hashOf(file);
  if (sharedByHash.has(h)) return sharedByHash.get(h);
  const at = join(SHARED, kind, rel);
  if (sharedByPath.has(at)) return null;
  mkdirSync(dirname(at), { recursive: true }); cpSync(file, at);
  sharedByHash.set(h, at); sharedByPath.set(at, h);
  return at;
}
// Point a bundled HTML file's asset references at the shared copies. `moved` maps a project-relative
// path ("assets/fonts/Inter-400.woff2") to its shared file. A plain "assets/…" is resolved against
// the project root (the document the compositions are mounted into); a "../…" against the file itself,
// which is also how the HyperFrames runtime rebases a sub-composition's "../" src, href and url():
// so the rewritten path is always relative to the file's own folder, however deep it sits.
const REF = /(["'(]\s*)((?:\.\.?\/)*(?:[^"'()\s?#]*\/)?assets\/(?:fonts|vendor)\/[^"'()\s?#]+)/g;
function pointAtShared(html, fileRel, dstFile, moved) {
  return html.replace(REF, (all, lead, ref) => {
    const key = posix.normalize(ref.startsWith("../") ? posix.join(posix.dirname(fileRel), ref) : ref);
    const to = moved.get(key);
    return to ? lead + relative(dirname(dstFile), to).split(sep).join("/") : all;
  });
}

// ---- each project ----
const slugs = [];
// the videos asked for, then (pushed once those are packed) the built videos they build on, each `carried` under the
// name its rows give it; one that would take the page past FILE_BUDGET files is taken out again (`away`: too-big)
const FILE_BUDGET = 480;
const VOICE = [];   // wav → mp3 still to do: { slug, from, to }
const items = projects.map((p) => ({ p, carried: null })), away = new Map();   // video → why it is not on the page
// the built videos the asked-for ones name in "Before you watch", not on the page yet: [{ p, carried: <video> }]
function prerequisitesOf() {
  const out = [], asked = new Set(projects.map((p) => resolve(p)));
  for (const p of projects) {
    const src = resolve(p), rp = rpDirFor(src), pm = readJson(join(src, "plan-map.json"));
    for (const q of Array.isArray(pm?.prerequisites) ? pm.prerequisites : []) {
      const v = String(q?.video || ""), dir = q?.found !== false && rp && v ? videoDirFor(rp, v) : null;
      if (!dir || slugs.includes(v) || out.some((o) => o.carried === v) || asked.has(resolve(dir)) || !existsSync(join(dir, "index.html"))) continue;
      out.push({ p: dir, carried: v });
    }
  }
  return out;
}
for (let i = 0; i < items.length; i++) {
  const { p, carried } = items[i];
  const src = resolve(p), slug = slugFor(src, slugs);
  if (!existsSync(join(src, "index.html"))) { console.error(`✗ ${p}: no index.html (build it first)`); process.exit(1); }
  // (a video carried for a row is opened by the row's name: under any other name, the link would open another video)
  if (carried && slug !== carried) continue;
  const sharedBefore = new Set(sharedByPath.keys());
  slugs.push(slug); where[slug] = src;
  const dst = join(OUT, slug);
  mkdirSync(join(dst, "assets/voice"), { recursive: true });
  cpSync(join(src, "compositions"), join(dst, "compositions"), { recursive: true });
  // fonts and gsap: into shared/ when identical to (or new to) what is there, else kept here
  const moved = new Map(), own = [];
  const place = (kind, rel, file) => {
    const at = share(kind, rel, file), key = `assets/${kind}/${rel.split(sep).join("/")}`;
    if (at) moved.set(key, at);
    else { mkdirSync(dirname(join(dst, key)), { recursive: true }); cpSync(file, join(dst, key)); own.push(key); }
  };
  for (const kind of ["fonts", "vendor"]) for (const f of filesUnder(join(src, "assets", kind))) place(kind, f, join(src, "assets", kind, f));
  // assets/vendor is build output (vendor-gsap), git-ignored by the project record, so a fresh clone
  // of a built video has frames pointing at a gsap.min.js that is not there: supply ours
  if (!existsSync(join(src, "assets/vendor/gsap.min.js"))) place("vendor", "gsap.min.js", depFile(...GSAP));
  for (const f of filesUnder(join(dst, "compositions")).filter((f) => f.endsWith(".html"))) {
    const p = join(dst, "compositions", f), html = readFileSync(p, "utf8");
    const out = pointAtShared(html, `compositions/${f.split(sep).join("/")}`, p, moved);
    if (out !== html) writeFileSync(p, out);
  }
  // Anything else under assets/ that a frame or the page points at (a screenshot, an image): copied as
  // it is, only what is referenced. Voice, fonts and gsap are handled above and below.
  const refd = new Set();
  for (const f of [...filesUnder(join(dst, "compositions")).filter((x) => x.endsWith(".html")).map((x) => join(dst, "compositions", x)), join(src, "index.html")])
    for (const m of readFileSync(f, "utf8").matchAll(/(?:^|["'(\s\/])(assets\/(?!voice\/|fonts\/|vendor\/)[^"'()\s?#]+)/g)) refd.add(m[1]);
  for (const r of refd) if (existsSync(join(src, r)) && statSync(join(src, r)).isFile()) { mkdirSync(dirname(join(dst, r)), { recursive: true }); cpSync(join(src, r), join(dst, r)); }
  if (existsSync(join(src, "plan-map.json"))) cpSync(join(src, "plan-map.json"), join(dst, "plan-map.json"));
  const pm = readJson(join(src, "plan-map.json"));
  // a walkthrough's choices counted once, as its guide counts them (lib/guide/reader.mjs choiceCounts): how many there are
  // in all (walkthrough.md) and how many only the guide lists, so the page's words and the guide's never disagree
  { const t = guideTarget(src), wmd = t.planDir ? join(t.planDir, "walkthrough.md") : null;
    if (t.kind === "walkthrough" && existsSync(wmd) && pm) try {
      const idOf = (x) => String(x).toUpperCase().replace(/^M/, "m");
      const stops = [...(pm.autonomy || []).map((a) => ({ kind: "choices", ids: [idOf(a.id)] })), ...(pm.autonomyGroups || []).map((g) => ({ kind: g.list ? "list" : g.stop ? "choices" : "shown", ids: (g.ids || []).map(idOf) }))];
      const c = choiceCounts(choicesOf(readWalkthrough(wmd).calls, null, stops));
      const counts = { total: c.total, pause: c.pause.length, list: c.list.length, shown: c.shown.length, only: c.only.length };
      writeFileSync(join(dst, "plan-map.json"), JSON.stringify({ ...pm, choiceCounts: counts }, null, 2) + "\n");
    } catch {} }
  // the pages its scenes open from a template (details/): self-contained, so the folder as it is (plan-map's details[].src points into it)
  // (only the pages its plan map still opens: a scene whose detail became a part of the guide leaves its page behind)
  if (existsSync(join(src, "details"))) {
    const opened = new Set((pm?.details || []).filter((d) => !d.guide).map((d) => `${d.name}.html`));
    if (!pm || opened.size) cpSync(join(src, "details"), join(dst, "details"), { recursive: true, filter: (f) => !pm || !/\.html$/.test(f) || opened.has(basename(f)) });
  }
  // its guide (the plan guide, prototype v5): the page its video's own builder made, else one made from its parts; the
  // faces are the bundle's (fonts/, two folders up)
  // A plan's or an explainer's video has its guide built from its sources (`reelplanning guide`, run by `build`); one not
  // built here yet (a fresh clone: the guide is never committed), or built before its plan.md last changed, is built now.
  // (one at a time per video, under guide/.lock: two bundles of the same video at once, from two specs or two review
  // servers, would both find it stale and build it, and one's pictures be pruned and rewritten while the other copies them)
  { const guideStep = () => { const own = join(src, "guide", "index.html"), t = guideTarget(src);
    // (and what draws it: a guide built before its page's code changed, such as the embed block the review page frames
    // it with, D-264, is built again)
    const drawnBy = ["templates/guide/guide.js", "templates/guide/guide.css", "templates/guide/pictures.js", "templates/guide/pictures.css", "packages/player/guide-review.js", "scripts/lib/guide/page.mjs", "scripts/lib/guide/pictures.mjs"].map((f) => join(ROOT, f));
    const sourceOf = [join(t.planDir || "", "plan.md"), join(t.planDir || "", "walkthrough.md"), join(t.explainerDir || "", "sources.json"), join(src, "plan-map.json"), ...drawnBy].filter((f) => existsSync(f));
    const stale = !existsSync(own) || sourceOf.some((f) => statSync(f).mtimeMs > statSync(own).mtimeMs), built = ["plan-video", "walkthrough", "explainer"].includes(t.kind);
    // (a video carried for "Before you watch" takes its guide as it is, when current: it is never built for it here)
    if (built && stale && !carried) {
      const r = spawnSync(process.execPath, [join(ROOT, "scripts", "guide.mjs"), src, "--quiet"], { encoding: "utf8" });
      if (r.status !== 0) console.log(`△ ${slug}: its guide could not be built (${(r.stderr || r.stdout || "").trim().split("\n").at(-1)}); published without it`);
    }
    const g = existsSync(own) && !(carried && stale) ? pointFaces(readFileSync(own, "utf8"), "../../fonts/") : !(carried && built) && pm?.details?.length ? guidePage({ map: pm, slug }) : null;
    if (g) {
      mkdirSync(join(dst, "guide"), { recursive: true }); writeFileSync(join(dst, "guide", "index.html"), withRepo(g)); guides.add(slug);
      // (not its part pages, guide/<part>.html: on this page a part is read in the guide under the video, and one asked
      // for before the guide is attached waits for it (the player's openDetail), so none is ever opened here; they were
      // a third of a bundle's size. The local review page, which has no guide under its player, still opens them.)
      // its pictures: a step's scene at 1×, 2× and whole (guide/pics/, which each build of the guide prunes to what its
      // pages point at: lib/guide/pictures.mjs)
      if (existsSync(own) && existsSync(join(src, "guide", "pics"))) cpSync(join(src, "guide", "pics"), join(dst, "guide", "pics"), { recursive: true });
    } };
    if (["plan-video", "walkthrough", "explainer"].includes(guideTarget(src).kind)) withGuideLock(src, guideStep); else guideStep(); }
  // the captions composition asks for it at load; without it every page load logs a 404
  if (existsSync(join(src, "caption-overrides.json"))) cpSync(join(src, "caption-overrides.json"), join(dst, "caption-overrides.json"));

  // voice: wav → mp3, and rewrite the references. A video whose page already plays mp3 (the worked examples
  // under videos/, which commit their narration as mp3 since no wav is committed, D-305) has
  // those copied as they are; only a file the page points at is taken, so a stale mp3 beside a re-voiced wav
  // is never used.
  let html = readFileSync(join(src, "index.html"), "utf8");
  const voiceDir = join(src, "assets/voice");
  // (the wav files are transcoded after the loop, several at a time: VOICE; the page points at the mp3 already)
  let before = 0, toMp3 = 0;
  if (existsSync(voiceDir)) {
    for (const f of readdirSync(voiceDir).filter((f) => /\.(wav|mp3)$/.test(f) && html.includes(`assets/voice/${f}`))) {
      const mp3 = f.replace(/\.wav$/, ".mp3");
      if (f.endsWith(".mp3")) cpSync(join(voiceDir, f), join(dst, "assets/voice", f));
      else { VOICE.push({ slug, from: join(voiceDir, f), to: join(dst, "assets/voice", mp3) }); toMp3++; }
      before += size(join(voiceDir, f));
      html = html.replaceAll(`assets/voice/${f}`, `assets/voice/${mp3}`);
    }
  }
  writeFileSync(join(dst, "index.html"), pointAtShared(html, "index.html", join(dst, "index.html"), moved));
  console.log(`· ${slug}: ${filesUnder(dst).length + toMp3} files, voice ${human(before)}${toMp3 ? ` (${toMp3} to mp3)` : ""}${own.length ? `, ${own.length} asset(s) of its own (differ from shared/): ${own.join(", ")}` : ""}${carried ? " (carried for Before you watch)" : ""}`);
  if (carried) {
    const n = filesUnder(OUT).length + VOICE.length;
    if (n > FILE_BUDGET) {
      // over the budget: out again, with the shared files only it brought
      rmSync(dst, { recursive: true, force: true });
      for (const at of [...sharedByPath.keys()]) if (!sharedBefore.has(at)) { sharedByHash.delete(sharedByPath.get(at)); sharedByPath.delete(at); rmSync(at, { force: true }); }
      slugs.pop(); delete where[slug]; guides.delete(slug); away.set(carried, "too-big");
      for (let k = VOICE.length - 1; k >= 0; k--) if (VOICE[k].slug === slug) VOICE.splice(k, 1);
      console.log(`· ${slug}: left off (the page would be ${n} files, over ${FILE_BUDGET}); its row says so`);
    }
  }
  if (i === projects.length - 1) items.push(...prerequisitesOf());
}
// the voice, wav → mp3 (about 6× smaller), a few files at a time: one after another, a page carrying two narrated videos
// took most of a minute
if (VOICE.length) {
  const run = (j) => new Promise((ok, fail) => execFile("ffmpeg", ["-y", "-loglevel", "error", "-i", j.from, "-codec:a", "libmp3lame", "-b:a", "96k", j.to], (e) => (e ? fail(e) : ok())));
  const queue = [...VOICE], workers = Array.from({ length: Math.max(1, Math.min(8, cpus().length)) }, async () => { for (let j; (j = queue.shift()); ) await run(j); });
  await Promise.all(workers);
  const was = VOICE.reduce((a, j) => a + size(j.from), 0), now = VOICE.reduce((a, j) => a + size(j.to), 0);
  console.log(`· voice: ${VOICE.length} file${VOICE.length > 1 ? "s" : ""} to mp3, ${human(was)} → ${human(now)}`);
}
// Each bundled video's "Before you watch" rows: one this page does not carry says why, where that is known (the player's
// awayWords): its video is not built yet (its plan or explainer is here, its video folder is not, or has no index.html),
// this repo has no video by that name, or it was left off for size. A built one this page does not carry (one a carried
// video builds on in turn) gets no reason: "Not on this page".
function awayOf(src, video) {
  const rp = rpDirFor(src), dir = rp && video ? videoDirFor(rp, video) : null;
  if (!dir) return "not-found";
  if (existsSync(join(dir, "index.html"))) return null;
  return existsSync(dir) || existsSync(video === "system" ? rp : dirname(dir)) ? "not-built" : "not-found";
}
for (const slug of slugs) {
  const f = join(OUT, slug, "plan-map.json"), m = readJson(f);
  if (!Array.isArray(m?.prerequisites) || !m.prerequisites.length) continue;
  let changed = false;
  for (const q of m.prerequisites) {
    if (!q || q.found === false || slugs.includes(q.video)) continue;
    const why = away.get(q.video) || awayOf(where[slug], q.video);
    if (why) { q.away = why; changed = true; }
  }
  if (changed) writeFileSync(f, JSON.stringify(m, null, 2) + "\n");
}
console.log(`· shared: ${sharedByPath.size} files (fonts, licences, gsap) used by ${slugs.length} video${slugs.length > 1 ? "s" : ""}`);

// ---- the library: what the page lists ----
const titleOf = (slug) => readJson(join(where[slug], "plan-map.json"))?.title || null;
const planTitle = (dir) => { try { return (readFileSync(join(dir, "plan.md"), "utf8").match(/^# (.+)$/m) || [])[1]?.trim() || null; } catch { return null; } };
const bySrc = Object.fromEntries(Object.entries(where).map(([s, d]) => [d.replace(/\/+$/, ""), s]));
const planDirs = new Set();
if (RP && existsSync(join(RP, "plans"))) for (const d of readdirSync(join(RP, "plans"))) if (existsSync(join(RP, "plans", d, "plan.md"))) planDirs.add(join(RP, "plans", d));
for (const d of Object.values(where)) { const m = d.match(/^(.*\/\.reelplanning\/plans\/[^/]+)\/(?:video|walkthrough-video)\/?$/); if (m) planDirs.add(m[1]); }
// Where each plan stands comes from its reviews/ and the ledger (lib/reviews.mjs planStage): whether
// its questions are all answered (openQuestions: matched on the question's words, since ids come round
// again when a plan is revised), and each review's own time.
const STAGE = Object.fromEntries([...planDirs].map((d) => [d, planStage(d)]));
const listWalks = (d) => listReviews(d).filter((r) => r.kind === "walkthrough");
// The plan and what was built, together (walkthroughs-that-help step 5, D-224): one row per plan, with a
// Plan | Built switch. `steps` is where each video's scenes of a plan step start, so the switch lands on the
// same step: in the walkthrough, the first scene tagged with that step (its running scene); a step the
// walkthrough has no scene for shows "Nothing to run for this step".
const stepStarts = (m) => { const o = {}; for (const f of m?.frames || []) if (f.planStep != null && f.planStep > 0 && o[f.planStep] == null) o[f.planStep] = f.start ?? null; return o; };
// the words a row says where the plan stands, and on whom it waits (the reviews and the ledger, planStage): on you
// ("plan to review", "walkthrough to review", "questions to answer") or on the agent ("building", "revising",
// "fixing"), or done ("approved"). The page puts every plan waiting on you under "Needs you", its video on this
// page or not.
const STATUS_WORD = { accepted: "approved", fixed: "approved", done: "built, no walkthrough", approved: "building", built: "building", "changes requested": "revising", "fixes to make": "fixing",
  "questions open": "questions to answer", "plan video to review": "plan to review", "walkthrough to review": "walkthrough to review", reviewed: "reviewed", planned: "no video yet" };
const LIBRARY = {
  system: slugs.includes("system") ? { slug: "system", title: titleOf("system") || "The system video" } : null,
  plans: [...planDirs].sort().reverse().map((d) => {
    const name = basename(d), has = (f) => existsSync(join(d, f));
    const video = bySrc[join(d, "video")] || null, walkthrough = bySrc[join(d, "walkthrough-video")] || null;
    return { plan: name, date: /^\d{4}-\d{2}-\d{2}/.test(name) ? name.slice(0, 10) : "", title: planTitle(d) || name.replace(/^\d{4}-\d{2}-\d{2}-/, ""),
      video, walkthrough, status: STATUS_WORD[STAGE[d].stage] || STAGE[d].stage,
      // the plan's guide: what was built's, where there is one, else the plan video's
      guide: [walkthrough, video].find((s) => s && guides.has(s)) || null,
      ...(video && walkthrough ? { steps: { plan: stepStarts(readJson(join(d, "video", "plan-map.json"))), built: stepStarts(readJson(join(d, "walkthrough-video", "plan-map.json"))) } } : {}),
      stages: { decided: STAGE[d].decided, built: has("walkthrough.md"), reviewed: !!STAGE[d].lastWalk, stage: STAGE[d].stage },
      // a plan that starts from an explainer (explain-first step 4): its row links back to it
      ...(() => { const n = (() => { try { return (readFileSync(join(d, "plan.md"), "utf8").match(/^Explained first: `([^`]+)`/m) || [])[1] || null; } catch { return null; } })();
        return n ? { explainedFirst: { name: n, slug: slugs.includes(`${n}--explainer`) ? `${n}--explainer` : null } } : {}; })() };
  }),
  // explainers (explain-first step 2): a row of their own kind, each with the commit it explains and how many have
  // landed since (a snapshot, never rebuilt on its own), and what came of it: Done, or the plans it started
  explainers: slugs.filter((s) => /\.reelplanning\/explainers\/[^/]+\/video\/?$/.test(where[s])).map((s) => {
    const ed = dirname(where[s].replace(/\/+$/, "")), src = readSources(ed) || {}, last = listReviews(ed).filter((r) => r.kind === "explainer").at(-1) || null;
    const repoDir = RP ? dirname(RP) : dirname(dirname(dirname(ed))), since = commitsSince(repoDir, src.commit), end = endOf(last?.review);
    return { slug: s, name: basename(ed), title: titleOf(s) || src.title || basename(ed), date: src.created || basename(ed).slice(0, 10), at: src.commit ? String(src.commit).slice(0, 7) : null, since,
      seconds: readJson(join(where[s], "plan-map.json"))?.watchedSeconds ?? null, end: end ? END_WORDS[end] : null, reviewed: !!last, reviewedAt: last?.at || null,
      planned: RP ? plannedFrom(RP, basename(ed)) : [] };
  }),
  other: slugs.filter((s) => s !== "system" && !/\.reelplanning\/(?:plans|explainers)\//.test(where[s])).map((s) => ({ slug: s, title: titleOf(s) || s })),
};
// an explainer's Finish offers "explain the commits since" (explain-first step 3): the packed plan map says how many
// have landed since the commit it explains, and the first few of them, so a hosted page can say so with no server
for (const e of LIBRARY.explainers) {
  const p = join(OUT, e.slug, "plan-map.json"), m = readJson(p); if (!m?.explainer || !e.since) continue;
  const ed = dirname(where[e.slug].replace(/\/+$/, "")), repoDir = RP ? dirname(RP) : dirname(dirname(dirname(ed)));
  let subjects = []; try { subjects = execFileSync("git", ["-C", repoDir, "log", "--format=%s", "-n", "3", `${readSources(ed)?.commit}..HEAD`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").filter(Boolean); } catch {}
  m.explainer.since = e.since; m.explainer.sinceSubjects = subjects;
  writeFileSync(p, JSON.stringify(m, null, 2) + "\n");
}
// ---- what needs the reviewer: the page opens on a short list, not on a library to explore ----
// A plan video needs a review when nobody has reviewed it yet, or when it was revised after the last
// review; a walkthrough needs one when it has not been judged, or it was fixed after it was. Times
// are git commit times (an uncommitted change counts as now), the same as `reel status` uses.
// A review's own time is when the reviewer finished it.
const when = lastChanged, reviewedAt = (r) => (r?.at ? Date.parse(r.at) / 1000 || 0 : 0);
const mins = (sec) => sec >= 90 ? `${Math.round(sec / 60)} min` : `${Math.round(sec)} s`;
const sigOf = (m) => m?.changes?.at || JSON.stringify((m?.frames || []).map((f) => [f.compositionId, f.start, f.end]));
const TO_REVIEW = [], STATUS = {};   // STATUS: per walkthrough, what is still open on the record
for (const p of LIBRARY.plans) {
  const d = [...planDirs].find((x) => basename(x) === p.plan);
  // once a plan is built (walkthrough.md exists), its plan video is history: only the walkthrough asks,
  // unless the plan grew a new round whose questions the plan video now asks
  const vm = p.video ? readJson(join(d, "video", "plan-map.json")) : null, fresh = vm ? openQuestions(d, vm) : [];
  if (p.video && existsSync(join(d, "walkthrough.md")) && fresh.length) {
    const changed = vm?.changes?.changedSeconds || 0, total = vm?.totalSeconds || 0;
    TO_REVIEW.push({ slug: p.video, title: p.title, kind: "Plan video, new round", sig: sigOf(vm),
      what: `The plan grew new steps after its walkthrough. Press "Play just the changes", answer the ${fresh.length} new question${fresh.length > 1 ? "s" : ""}, then Finish review.`, time: mins(changed && changed < total - 1 ? changed : total) });
  } else if (p.video && !existsSync(join(d, "walkthrough.md"))) {
    const m = readJson(join(d, "video", "plan-map.json")), last = STAGE[d].lastPlan;
    const n = (m?.decisions || []).length, total = m?.totalSeconds || 0, changed = m?.changes?.changedSeconds || 0;
    const partial = changed && changed < total - 1;
    if (!last) TO_REVIEW.push({ slug: p.video, title: p.title, kind: "Plan video", sig: sigOf(m),
      what: n ? `Watch it and answer its ${n} question${n > 1 ? "s" : ""} as it stops (keys A–D). Then Finish review.` : "Watch it, comment where you disagree, then Finish review.", time: mins(total) });
    else if (when(join(d, "video", "plan-map.json")) > reviewedAt(last) + 60) TO_REVIEW.push({ slug: p.video, title: p.title, kind: "Plan video, revised", sig: sigOf(m),
      what: `Revised after your review. Press "Play just the changes"${n ? `, answer the ${n} open question${n > 1 ? "s" : ""}` : ""}, then Finish review: approve it, or ask for more.`, time: mins(partial ? changed : total) });
  }
  if (p.walkthrough) {
    const m = readJson(join(d, "walkthrough-video", "plan-map.json")), last = STAGE[d].lastWalk;
    const calls = [...(m?.autonomy || []), ...(m?.autonomyGroups || []).flatMap((g) => g.calls || [])];   // a grouped beat's calls count one by one (step 8)
    const n = calls.length, total = m?.totalSeconds || 0, changed = m?.changes?.changedSeconds || 0;
    // Reviewed is not the same as done: a call with no verdict on the record (added after the review),
    // or one whose own-words answer the agent replied to and is "waiting on the reviewer", is still open.
    // A verdict in any round counts: every walkthrough review is kept (reviews/), each round's under its own name.
    // A reply the agent wrote under a call in the last review's what-to-act-on file (reviews/<id>.md) and
    // left "waiting on the reviewer" is open until the reviewer answers it.
    const judged = new Set(listWalks(d).flatMap((r) => (r.review.autonomy || []).filter((a) => a.verdict).map((a) => String(a.id).toLowerCase())));
    const text = last && existsSync(last.md) ? readFileSync(last.md, "utf8") : "";
    const replies = [...text.matchAll(/^- \*\*([A-Z]+\d+)\*\*[\s\S]*?(?=^- \*\*[A-Z]+\d+\*\*|^#|(?![\s\S]))/gm)].filter((b) => /waiting on the reviewer/i.test(b[0])).map((b) => b[1].toLowerCase());
    const open = last ? calls.map((a) => String(a.id).toLowerCase()).filter((id) => !judged.has(id)) : [];
    STATUS[p.walkthrough] = { calls: n, reviewed: !!last, open: open.map((x) => x.toUpperCase()), replies: replies.map((x) => x.toUpperCase()) };
    // a walkthrough with a list (walkthroughs-that-help step 2): it pauses only for what you'd notice or can't
    // easily undo, and lists the rest at the end, each with a Flag
    const listed = (m?.autonomyGroups || []).filter((g) => g.list).reduce((k, g) => k + (g.calls || []).length, 0), paused = n - listed;
    if (!last) TO_REVIEW.push({ slug: p.walkthrough, title: p.title, kind: "Walkthrough", sig: sigOf(m),
      what: listed ? `The agent built it: watch it run. ${paused ? `It pauses at ${paused === 1 ? "the choice" : `the ${paused} choices`} you'd notice or can't easily undo: accept or flag each. ` : ""}The other ${listed === 1 ? "choice is" : `${listed} are`} a list at the end: flag any you'd change. Then Finish review.`
        : `The agent built it. ${(m?.autonomyGroups || []).some((g) => g.stop) ? `The video stops for the ${n} calls it made on its own, a step's calls together: accept or flag each` : `At each of the ${n} calls it made on its own, the video stops: press A to accept or B to flag`}${(m?.autonomyGroups || []).some((g) => !g.stop) ? " (the smaller ones together, at the end of their part)" : ""}. Then Finish review.`, time: mins(total) });
    else if (open.length || replies.length) TO_REVIEW.push({ slug: p.walkthrough, title: p.title, kind: `Walkthrough, ${open.length ? `${open.length} call${open.length > 1 ? "s" : ""} open` : ""}${open.length && replies.length ? ", " : ""}${replies.length ? `${replies.length} repl${replies.length > 1 ? "ies" : "y"} to read` : ""}`, sig: sigOf(m),
      what: `Still open: ${[...open.map((x) => x.toUpperCase()), ...replies.map((x) => `${x.toUpperCase()} (the agent's reply)`)].join(", ")}. Then Finish review.`, time: mins(total) });
    // Rebuilt after the last review: that review asked for changes, so the rebuilt beats come back to
    // the reviewer to accept or ask again (the owner's rule); after an approval a fix is only there to see.
    else if (when(join(d, "walkthrough-video", "plan-map.json")) > reviewedAt(last) + 60) {
      const asked = verdictOf(last.review) === "changes";
      TO_REVIEW.push({ slug: p.walkthrough, title: p.title, kind: asked ? "Walkthrough, revised" : "Walkthrough, fixed", optional: !asked, sig: sigOf(m),
        what: asked ? `Revised after your review. Press "Play just the changes" to rewatch what changed, then Finish review: accept it, or ask for more.` : `Optional: the fix for what you changed or flagged is in. Press "Play just the changes" to see it.`, time: mins(changed || total) });
    }
  }
}
// an explainer needs you until it is reviewed, and again when Explain more rebuilt it after that review
for (const e of LIBRARY.explainers) {
  const m = readJson(join(where[e.slug], "plan-map.json")), total = m?.totalSeconds || 0;
  const what = "Nothing to decide. Watch it, comment or Ask about this where it is unclear, then Finish: Done, Explain more, or Plan this.";
  if (!e.reviewed) TO_REVIEW.push({ slug: e.slug, title: e.title, kind: "Explainer", sig: sigOf(m), what, time: mins(total) });
  else if (when(join(where[e.slug], "plan-map.json")) > reviewedAt({ at: e.reviewedAt }) + 60) TO_REVIEW.push({ slug: e.slug, title: e.title, kind: "Explainer, explained more", sig: sigOf(m), what: `Rebuilt after your review. ${what}`, time: mins(total) });
}
// the page opens on the first video that needs the reviewer; failing that, the newest plan's newest video
const FIRST = TO_REVIEW.find((t) => !t.optional)?.slug || LIBRARY.plans.map((p) => p.walkthrough || p.video).find(Boolean) || null;

const LIBRARY_UI = `
<style>
  /* One bar: the title and one quiet line of what to do here on the left; "Videos" on the right opens
     a popover whose first section is what needs you, and whose second is every video in the repo. */
  #here { margin: 1px 0 0; font-size: 14px; font-weight: 500; line-height: 1.35; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #here[hidden] { display: none; }
  #here b { font-weight: 600; color: var(--ink); }
  .sr { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  #switch .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  /* The popover: what needs you, then every video, one row each: a plan is one row (its short name, its
     date, one word for where it stands, its Plan | Built switch); the row you are on is tinted and ruled in
     ink (coral is only for what needs you). */
  #videos { position: absolute; right: 0; top: 52px; z-index: 30; width: min(560px, calc(100vw - 32px)); max-height: calc(100vh - 80px); max-height: calc(100dvh - 80px); overflow: auto; overscroll-behavior: contain; padding: 8px 0 12px; background: var(--paper); border-radius: 10px; box-shadow: 0 0 0 1px var(--ink-12), 0 16px 40px -16px rgba(20,20,19,.3); }
  #videos[hidden] { display: none; }
  #videos h2 { margin: 14px 20px 6px; font: 600 13px/1.3 var(--sans); color: var(--ink-2); }
  #videos section:first-child h2 { margin-top: 8px; }
  #todo { display: block; }
  #todo[hidden] { display: none; }
  #todo .none { margin: 0 20px 4px; font-size: 13px; color: var(--ink-3); }
  #library { display: block; margin-top: 12px; border-top: 1px solid var(--ink-12); }
  #library .row { display: flex; align-items: center; gap: 12px; min-height: 36px; margin: 0 8px; padding: 0 12px; border-radius: 6px; font-size: 14px; color: var(--ink-2); text-decoration: none; }
  #library a.row:hover { background: var(--ink-06); color: var(--ink); }
  #library .row .k { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #library .row .wd { color: var(--ink-3); }
  #library .row .st { flex: none; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-3); }
  #library .row .st[data-need] { color: var(--accent-text); }
  #library .row .st[data-need]::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  #library a.row[aria-current="page"] { color: var(--ink); }
  #library a.row[aria-current="page"] .st { color: var(--ink); font-weight: 600; }
  #library a.row[aria-current="page"] .st::before { display: none; }
  #library .row.none { color: var(--ink-3); }
  /* walkthroughs-that-help step 5 (D-224): one row per plan, on one line: its short name, its date, one word
     for where it stands, and its Plan | Built switch; what needs you first, then the recent plans, the rest
     behind "Earlier plans (N)" */
  .prow { display: flex; align-items: center; gap: 10px; min-height: 40px; margin: 0 8px; padding: 6px 12px; border-radius: 6px; }
  .prow[data-here] { background: var(--ink-06); box-shadow: inset 2px 0 0 var(--ink); border-radius: 0 6px 6px 0; }
  .prow .pn { flex: 1 1 auto; min-width: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow-wrap: anywhere; font-size: 15px; font-weight: 500; line-height: 1.3; color: var(--ink); }
  .prow .off { flex: none; font-size: 13px; color: var(--ink-3); white-space: nowrap; }
  .prow .pd { flex: none; font-size: 12px; color: var(--ink-3); font-variant-numeric: tabular-nums; }
  .prow .ps { flex: none; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-3); white-space: nowrap; }
  .prow .ps[data-need] { color: var(--accent-text); }
  .prow .ps[data-need]::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  .seg { flex: none; display: inline-flex; padding: 2px; border-radius: 7px; background: var(--ink-06); box-shadow: inset 0 0 0 1px var(--ink-12); }
  .seg > a, .seg > span { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-width: 44px; height: 26px; padding: 0 10px; border-radius: 5px; font: 500 13px/1 var(--sans); color: var(--ink-2); text-decoration: none; white-space: nowrap; }
  .seg > a:hover { color: var(--ink); background: var(--ink-06); }
  .seg > a[aria-current="page"] { background: var(--paper); color: var(--ink); box-shadow: 0 0 0 1px var(--ink-20), 0 1px 2px rgba(var(--ink-rgb),.12); }
  .seg > span[aria-disabled] { color: var(--ink-3); opacity: .55; cursor: default; }
  .seg > a[data-need]::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  .seg > a:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }
  /* the plan guide (prototype v5): the plan's guide, beside its Plan | Built */
  .prow .gl { flex: none; display: inline-flex; align-items: center; height: 26px; padding: 0 10px; border-radius: 5px; font: 500 13px/1 var(--sans); color: var(--ink-2); text-decoration: none; box-shadow: inset 0 0 0 1px var(--ink-12); }
  .prow .gl:hover { color: var(--ink); background: var(--ink-06); }
  .prow .gl:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }
  /* the guide under the video (D-264): the open video's guide under the player, edge to edge; the page scrolls to it,
     so its scroll bar's room is kept from the first draw (it would otherwise narrow the video when the guide arrives) */
  html { scrollbar-gutter: stable; background: var(--ground); }
  reelplanning-guide { margin: 32px -24px 0; }
  /* at the guide, the page's scroll bar's room is the guide's paper, not a stripe of the page's ground beside it (the
     frame is the whole window then; <reelplanning-guide> marks it) */
  html[data-rp-at-guide] { background: var(--paper); scrollbar-color: var(--ink-20) var(--paper); }
  /* a phone-wide window: the guide runs the window's full width (a desktop scroll bar's kept room left it 375 px of 390);
     the page scrolls by touch or wheel as before */
  @media (max-width: 600px) { html { scrollbar-gutter: auto; scrollbar-width: none; } reelplanning-guide { margin: 24px 0 0; } }
  /* an explainer's row (explain-first step 2): the same row, its kind said before its title */
  .xrow .xk { font-size: 12px; font-weight: 600; color: var(--ink-3); letter-spacing: .02em; }
  .xrow .pn { flex: 1 1 45%; }
  .xrow .ps { flex: 0 1 45%; min-width: 0; white-space: normal; line-height: 1.3; }
  #videos details.earlier { margin: 8px 0 0; border-top: 1px solid var(--ink-12); }
  #videos details.earlier > summary { list-style: none; display: flex; align-items: center; gap: 8px; min-height: 40px; margin: 4px 8px 0; padding: 0 12px; border-radius: 6px; font: 600 13px/1.3 var(--sans); color: var(--ink-2); cursor: pointer; }
  #videos details.earlier > summary::-webkit-details-marker { display: none; }
  #videos details.earlier > summary::before { content: ""; width: 5px; height: 5px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(-45deg); transition: transform .15s; }
  #videos details.earlier[open] > summary::before { transform: rotate(45deg); }
  #videos details.earlier > summary:hover { background: var(--ink-06); color: var(--ink); }
  /* the page's own Plan | Built switch, by the title */
  #pb { flex: none; display: flex; align-items: center; gap: 10px; }
  #pb[hidden] { display: none; }
  #pb .seg > a, #pb .seg > span { height: 30px; min-width: 56px; font-size: 14px; }
  #pb .pbnote { font-size: 13px; color: var(--ink-3); white-space: nowrap; }
  #pb .pbnote:empty { display: none; }
  @media (hover: none) { #library .row { min-height: 44px; } .prow { min-height: 48px; } .seg > a, .seg > span { height: 36px; } }
  /* a phone: the name gets the row's width, and the word for where it stands sits under it */
  @media (max-width: 600px) { .prow .pd { display: none; } .prow { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 12px; margin: 0 4px; padding: 6px 12px; }
    .prow .pn { grid-column: 1; grid-row: 1; } .prow .ps { grid-column: 1; grid-row: 2; font-size: 12px; } .prow .ps:empty { display: none; } .prow .seg, .prow .off { grid-column: 2; grid-row: 1 / span 2; align-self: center; }
    #pb .pbnote { display: none; } #pb .seg > a, #pb .seg > span { min-width: 48px; padding: 0 8px; }
    .prow:has(.gl) .seg, .prow:has(.gl) .off { grid-row: 1; } .prow .gl { grid-column: 2; grid-row: 2; justify-self: end; height: 30px; } }
  @media (max-width: 600px) { #here { white-space: normal; font-size: 13px; } #switch .long { display: none; } #videos { top: 44px; right: 16px; } #videos h2, #todo .none { margin-left: 16px; margin-right: 16px; } #library .row { margin-left: 4px; margin-right: 4px; } }
</style>
<div id="videos" hidden role="dialog" aria-label="Videos">
<section id="todo" aria-label="What needs you"></section>
<nav id="library" aria-label="Every video in this repo"></nav>
</div>`;
const LIBRARY_JS = `
  const LIBRARY = ${JSON.stringify(LIBRARY)};
  const pop = document.getElementById("videos"), lib = document.getElementById("library"), sw = document.getElementById("switch");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  // what needs you: every video still open for the reviewer, one row each, what to do in its tooltip
  const TO_REVIEW = ${JSON.stringify(TO_REVIEW)}, STATUS = ${JSON.stringify(STATUS)};
  // (this repo's keys, as the player keeps them: reelplanning-player.js recordKey and watchedPrefix, under REPO)
  const recordOf = (slug) => (REPO ? "reelplanning@" + REPO : "reelplanning") + ":annotations:" + slug + "/index.html", watchedOf = (slug) => (REPO ? "rp@" + REPO : "rp") + ":watched:" + slug;
  const sent = (t) => { try { const r = JSON.parse(localStorage.getItem(recordOf(t.slug) + ":round") || "null"); return !!(r && r.sig === t.sig); } catch { return false; } };
  const items = TO_REVIEW.map((t) => ({ ...t, done: sent(t) }));
  // only what is still open; every video, optional ones included, is in the library under it
  const need = items.filter((t) => !t.optional && !t.done);
  const todoEl = document.getElementById("todo");
  // "Deep dives: the video opens…" → "Deep dives", and the rest for the line under it
  const split = (s) => { const i = String(s).indexOf(": "); return i > 0 ? [s.slice(0, i), s.slice(i + 2)] : [String(s), ""]; };
  const short = (s) => split(s)[0];
  // every video: a plan is one row (walkthroughs-that-help step 5): its short name, its date, one word, and its Plan | Built switch
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = (d) => { const m = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(d || ""); if (!m) return ""; return \`\${Number(m[3])} \${MON[Number(m[2]) - 1]}\${Number(m[1]) === new Date().getFullYear() ? "" : \` \${m[1]}\`}\`; };
  const needs = (slug) => need.find((t) => t.slug === slug) || null;
  // watched, as the player marks it (80 % seen, or a review sent), or as your file says (the review server's known,
  // D-128, once the player has it): the same word "Before you watch" shows
  const watched = (slug) => { try { const w = JSON.parse(localStorage.getItem(watchedOf(slug)) || "null"); if (w && (w.seen || w.sent)) return true; } catch {} return !!document.getElementById("rp")._serverKnown?.watched?.includes(slug); };
  const cell = (slug, label, title) => \`<a href="?project=\${encodeURIComponent(slug)}"\${slug === project ? ' aria-current="page"' : ""}\${needs(slug) ? " data-need" : ""} title="\${esc(title + (needs(slug) ? " · needs you" : watched(slug) ? " · watched" : ""))}">\${esc(label)}</a>\`;
  // the switch only where there is something to open: both videos on this page, a Plan | Built switch; one, its
  // one link; neither, a short "not on this page"
  const seg = (p) => !p.video && !p.walkthrough ? '<span class="off">not on this page</span>'
    : \`<span class="seg" role="group" aria-label="\${esc(split(p.title)[0])}: the plan, or what was built">\${p.video ? cell(p.video, "Plan", "The plan video") : ""}\${p.walkthrough ? cell(p.walkthrough, "Built", "The walkthrough: the change running") : ""}</span>\`;
  const ONYOU = new Set(["plan to review", "walkthrough to review", "questions to answer"]);
  // where a plan stands, one word, and whether it waits on you: a video of it on this page still to review says
  // which; one sent from this browser is "sent"; else the plan's own stage, on you whether its video is here or not
  const stateOf = (p) => { const mine = TO_REVIEW.filter((t) => !t.optional && [p.video, p.walkthrough].includes(t.slug)), open = mine.filter((t) => !sent(t));
    if (open.length) return { word: /^Walkthrough/.test(open[0].kind) ? "walkthrough to review" : "plan to review", needs: true, time: open.map((t) => t.time).join(" + "), why: open.map((t) => \`\${t.kind}: \${t.what}\`).join("\\n") };
    if (mine.length) return { word: "sent", needs: false };
    return { word: p.status || "", needs: ONYOU.has(p.status) }; };
  const waitingOf = (p) => (stateOf(p).needs ? [p] : []);
  const prow = (p) => { const s = stateOf(p), here = [p.video, p.walkthrough].includes(project);
    return \`<div class="prow" data-plan="\${esc(p.plan)}"\${here ? " data-here" : ""}><span class="pn" title="\${esc(p.title)}">\${esc(split(p.title)[0])}</span><span class="pd">\${esc(day(p.date))}</span><span class="ps"\${s.needs ? " data-need" : ""} title="\${esc(s.why || "")}">\${esc(s.word)}\${s.time ? \` · \${esc(s.time)}\` : ""}</span>\${seg(p)}\${p.explainedFirst ? (p.explainedFirst.slug ? \`<a class="gl" href="?project=\${encodeURIComponent(p.explainedFirst.slug)}" title="Explained first: \${esc(p.explainedFirst.name)}, the explainer this plan starts from">Explainer</a>\` : \`<span class="off" title="Explained first: \${esc(p.explainedFirst.name)}">from an explainer</span>\`) : ""}\${p.guide ? \`<a class="gl" href="?project=\${encodeURIComponent(p.guide)}#guide" title="The plan's guide, under its video: every part of it, each with Watch this moment, the video going on small in the corner">Guide</a>\` : ""}</div>\`; };
  // the system video and any other video: a row with its one video
  const vrow = (slug, name, title, date = "") => { const t = needs(slug);
    return \`<div class="prow"\${slug === project ? " data-here" : ""}><span class="pn" title="\${esc(title || name)}">\${esc(name)}</span><span class="pd">\${esc(date)}</span><span class="ps"\${t ? " data-need" : ""} title="\${esc(t ? t.what : "")}">\${t ? \`to review · \${esc(t.time)}\` : ""}</span><span class="seg">\${cell(slug, "Watch", title || name)}</span></div>\`; };
  // an explainer (explain-first step 2): its title, its date, the commit it explains and how many since, what came of it
  const xrow = (e) => { const t = needs(e.slug), came = e.planned.length ? \`planned: \${e.planned.map((p) => p.replace(/^\\d{4}-\\d{2}-\\d{2}-/, "")).join(", ")}\` : e.end || "";
    const r = Math.round(e.seconds || 0), len = r ? \`\${Math.floor(r / 60)}:\${String(r % 60).padStart(2, "0")}\` : "";
    const at = e.at ? \`explained at \${e.at}\${e.since != null ? \`, \${e.since} commit\${e.since === 1 ? "" : "s"} since\` : ""}\` : "";
    return \`<div class="prow xrow"\${e.slug === project ? " data-here" : ""} data-explainer="\${esc(e.name)}"><span class="pn" title="\${esc(e.title)}"><span class="xk">Explainer</span> \${esc(e.title)}</span><span class="pd">\${esc(day(e.date))}</span><span class="ps"\${t ? " data-need" : ""} title="\${esc(t ? t.what : at)}">\${esc(t ? \`to review · \${t.time}\` : [len, at, came].filter(Boolean).join(" · "))}</span><span class="seg">\${cell(e.slug, "Watch", e.title)}</span></div>\`; };
  const waitingX = LIBRARY.explainers.filter((e) => needs(e.slug)), restX = LIBRARY.explainers.filter((e) => !needs(e.slug));
  // first what needs you, then the recent plans, then the rest behind one "Earlier plans (N)"
  const RECENT = 5;
  const waitingPlans = LIBRARY.plans.filter((p) => waitingOf(p).length), restPlans = LIBRARY.plans.filter((p) => !waitingOf(p).length);
  const sysNeeds = LIBRARY.system && needs(LIBRARY.system.slug), otherNeeds = LIBRARY.other.filter((o) => needs(o.slug));
  const sysRow = LIBRARY.system ? vrow(LIBRARY.system.slug, "The system video", LIBRARY.system.title) : "";
  const needN = waitingPlans.length + (sysNeeds ? 1 : 0) + otherNeeds.length + waitingX.length;
  todoEl.innerHTML = needN ? \`<h2>Needs you</h2>\${sysNeeds ? sysRow : ""}\${waitingPlans.map(prow).join("")}\${waitingX.map(xrow).join("")}\${otherNeeds.map((o) => vrow(o.slug, o.title, o.title)).join("")}\`
    : '<h2>Nothing needs you</h2><p class="none">Every video here is reviewed.</p>';
  let html = "<h2>All videos</h2>";
  if (LIBRARY.system && !sysNeeds) html += sysRow;
  else if (!LIBRARY.system) html += '<p class="row none">No system video yet</p>';
  const recent = restPlans.slice(0, RECENT), earlier = restPlans.slice(RECENT), others = LIBRARY.other.filter((o) => !needs(o.slug));
  html += recent.map(prow).join("");
  // the rest, folded: opened already when the video playing is in it
  const inEarlier = earlier.some((p) => [p.video, p.walkthrough].includes(project)) || others.some((o) => o.slug === project);
  if (restX.length) html += \`<h2>Explainers</h2>\${restX.map(xrow).join("")}\`;
  if (earlier.length) html += \`<details class="earlier"\${inEarlier ? " open" : ""}><summary>Earlier plans (\${earlier.length})</summary>\${earlier.map(prow).join("")}</details>\`;
  if (others.length) html += \`<details class="earlier"\${others.some((o) => o.slug === project) ? " open" : ""}><summary>Other videos (\${others.length})</summary>\${others.map((o) => vrow(o.slug, o.title, o.title)).join("")}</details>\`;
  lib.innerHTML = html;
  // The page's own Plan | Built switch, by the title (step 5): on a plan video it goes to what was built, at the
  // same step's running scene ("See it built"); on a walkthrough, back to that step in the plan ("See the plan").
  // A step the walkthrough runs nothing for says "Nothing to run for this step".
  const mine = LIBRARY.plans.find((p) => [p.video, p.walkthrough].includes(project)), pb = document.getElementById("pb");
  if (mine && mine.video && mine.walkthrough && pb) {
    const onBuilt = project === mine.walkthrough;
    pb.innerHTML = \`\${seg(mine)}<span class="pbnote" aria-live="polite"></span>\`; pb.hidden = false;
    const other = pb.querySelector(\`.seg > a:not([aria-current])\`), note = pb.querySelector(".pbnote");
    const stepNow = () => { const el = document.getElementById("rp"), m = el.planMap, t = el.player?.currentTime ?? 0; if (!m) return null; const f = (m.frames || []).find((x) => t >= x.start && t < x.start + (x.durationSeconds || 0)) || null; return f?.planStep > 0 ? f.planStep : null; };
    // (a tenth of a second into the scene: the player seeks to a frame, and the frame before its start is the scene before)
    const sync = () => { if (!other) return;
      const st = stepNow(), table = mine.steps ? (onBuilt ? mine.steps.plan : mine.steps.built) : null, at = st != null && table ? table[st] : undefined;
      const slug = onBuilt ? mine.video : mine.walkthrough;
      other.href = \`?project=\${encodeURIComponent(slug)}\${at != null ? \`&t=\${(Math.max(0, at) + 0.1).toFixed(2)}\` : ""}\`;
      other.title = onBuilt ? (at != null ? \`See the plan: step \${st}\` : "See the plan video") : at != null ? \`See it built: step \${st}, running\` : "See it built: the walkthrough";
      note.textContent = !onBuilt && st != null && table && at === undefined ? "Nothing to run for this step" : ""; };
    sync(); setInterval(sync, 500);
  }
  // what your file says you watched arrives after the list is drawn: each video's link says it too
  document.getElementById("rp").addEventListener("known", () => { for (const a of pop.querySelectorAll('a[href^="?project="]')) { const s = new URLSearchParams(a.getAttribute("href").slice(1)).get("project"); if (s && !needs(s) && watched(s) && !/ · watched$/.test(a.title)) a.title += " · watched"; } });
  // what to do in the video that is open, in one quiet line under the title
  const here = document.getElementById("here");
  document.getElementById("rp").addEventListener("plan", (e) => {
    // (a revised video says so in one line above the frame, with its Play just the changes; not here too)
    // the calls to judge: not the list's (walkthroughs-that-help step 2), which are flagged or left
    // (counted once, as the guide counts them: the player's choiceCounts, from the plan map bundle-player packed)
    const m = e.detail || {}, rp = document.getElementById("rp"), cc = rp.choiceCounts(), a = cc.pause + cc.list + cc.shown, q = (m.decisions || []).length;
    const lead = '<span class="sr">What to do here: </span>';
    const st = STATUS[project], mineOpen = need.some((t) => t.slug === project);
    const ids = (xs) => xs.join(", ");
    here.innerHTML = lead + (project === "system" ? "Nothing to decide. Watch it; the quick checks along the way are for you."
      : m.kind === "explainer" ? "Nothing to decide. Watch it, comment or <b>Ask about this</b> where it is unclear, then <b>Finish</b>: Done, Explain more, or Plan this."
      : st?.reviewed && mineOpen ? \`Still open: \${[st.open.length ? \`\${st.open.length} call\${st.open.length > 1 ? "s" : ""} (\${ids(st.open)})\` : "", st.replies.length ? \`the agent's reply on \${ids(st.replies)}\` : ""].filter(Boolean).join(" and ")}. It stops at each call: <b>A</b> accept, <b>B</b> flag. Then <b>Finish review</b>.\`
      : st?.reviewed ? \`Reviewed; nothing is open here. If you watch it again, \${cc.pause ? \`it still stops on its \${cc.pause} choice\${cc.pause > 1 ? "s" : ""}\` : "its choices are on its list again"}.\`
      : a ? \`\${rp.choiceWords({ long: true })}: <b>A</b> accept, <b>B</b> flag. Then <b>Finish review</b>.\`
      : q ? \`\${q} question\${q > 1 ? "s" : ""} to answer as it stops: <b>A–D</b> to pick. Then <b>Finish review</b>.\`
      : \`Watch it, comment where you disagree, then <b>Finish review</b>.\`);
    const mine = TO_REVIEW.find((t) => t.slug === project);
    if (mine && sent(mine)) here.innerHTML = '<span class="sr">Done here: </span>Your review was sent. Nothing more to do until the video changes.';
    here.title = here.textContent.replace(/^(What to do here|Done here): /, "");
    here.hidden = false;
  });
  const many = BUNDLED.length > 1 || LIBRARY.plans.length > 1 || LIBRARY.explainers.length > 0;
  sw.innerHTML = needN ? \`<span class="dot" aria-hidden="true"></span>Videos<span class="long">· \${needN} need\${needN > 1 ? "" : "s"} you</span>\` : "Videos";
  sw.setAttribute("aria-expanded", "false"); sw.setAttribute("aria-haspopup", "dialog"); sw.hidden = !many;
  // closed by default: the video gets the room, and every video is one click away
  const show = (on) => { pop.hidden = !on; sw.setAttribute("aria-expanded", String(on)); };
  sw.addEventListener("click", () => show(pop.hidden));
  document.addEventListener("pointerdown", (e) => { if (!pop.hidden && !pop.contains(e.target) && !sw.contains(e.target)) show(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !pop.hidden) { show(false); sw.focus(); } });
  // a Guide link to the video already open: the same page, down to its guide (reelplanning-guide); the list goes away
  addEventListener("hashchange", () => { if (location.hash === "#guide") show(false); });`;

// ---- the page: same markup, paths pointed at the bundle, and the library over the bundled projects ----
let page = readFileSync(join(ROOT, "packages/player/index.html"), "utf8");
page = page
  .replace('rp.setAttribute("runtime-src", "../../node_modules/@hyperframes/core/dist/hyperframe.runtime.iife.js"); // served from the repo root; offline-safe',
           'rp.setAttribute("runtime-src", "vendor/hyperframe.runtime.iife.js"); // bundled; offline-safe')
  // the videos on this page: a "Before you watch" row for one that is not here says so rather than link to it; and the
  // repo they belong to, which the player keeps this page's state under (set before the plan map and the video)
  .replace('rp.setAttribute("plan-map", map ? `../../${map}` : `../../${project}/plan-map.json`);', 'rp.setAttribute("videos", BUNDLED.join(" "));\n  rp.setAttribute("repo", REPO);\n' + (RECORD ? "" : '  rp.setAttribute("record", "none"); // no decision log in this repo: Finish downloads the review\n') + '  rp.setAttribute("plan-map", `${project}/plan-map.json`);')
  .replace('rp.setAttribute("src", `../../${project}/index.html`);', 'rp.setAttribute("src", `${project}/index.html`);')
  .replace('const project = new URLSearchParams(location.search).get("project") || "videos/l1-upload-resume";',
           `const BUNDLED = ${JSON.stringify(slugs)};\n  const REPO = ${JSON.stringify(REPO_ID)};\n  const FIRST = ${JSON.stringify(FIRST)};\n  const project = BUNDLED.includes(new URLSearchParams(location.search).get("project")) ? new URLSearchParams(location.search).get("project") : (FIRST || BUNDLED[0]);`)
  // there is no server to browse, so the free-text path becomes the library of what is bundled
  .replace(/<form id="open"[\s\S]*?<\/form>/, () => LIBRARY_UI)
  .replace('<div class="ttl"><h1 id="title"></h1></div>', '<div class="ttl"><h1 id="title"></h1><p id="here" hidden></p></div><nav id="pb" hidden aria-label="The plan, or what was built"></nav>')
  .replace('document.getElementById("p").value = project;', () => LIBRARY_JS)
  .replace(/\n  document\.getElementById\("switch"\)\.addEventListener\([^\n]*\n/, "\n")
  // a bundle's projects are named by their slugs already: the dev page's slug-to-folder redirect would loop here
  .replace(/\n  \/\/ dev-only:[^\n]*\n[^\n]*\n/, "\n")
  // the page's faces: their list inline and each file preloaded, so the player declares them before it first draws
  .replace("</head>", () => `${FONT_HEAD}</head>`)
  // the open video's guide, under its player (D-264): shown once the player finds the video's guide/index.html
  .replace('<reelplanning-player id="rp"></reelplanning-player>', '<reelplanning-player id="rp"></reelplanning-player>\n<reelplanning-guide id="rp-guide" for="rp"></reelplanning-guide>');
if (!page.includes("<reelplanning-guide")) { console.error("✗ the review page has no <reelplanning-player id=\"rp\"> to put the guide under"); process.exit(1); }
writeFileSync(join(OUT, "index.html"), page);
writeFileSync(join(OUT, "library.json"), JSON.stringify({ slugs, repo: REPO_ID, carried: items.filter((x) => x.carried && slugs.includes(x.carried)).map((x) => x.carried), ...LIBRARY }, null, 2) + "\n"); // what was bundled, under which names

const all = readdirSync(OUT, { recursive: true }).filter((f) => statSync(join(OUT, f)).isFile());
console.log(`✓ ${outArg}: ${all.length} files, ${human(all.reduce((a, f) => a + size(join(OUT, f)), 0))}, projects: ${slugs.join(", ")}`);

// One build of a video's guide at a time (see the guide step above). The lock is a folder (mkdir is atomic) holding the
// holder's pid; one left by a process that is gone, or older than 10 minutes, is taken over. guide/ is never committed.
function withGuideLock(src, fn) {
  const dir = join(src, "guide"), lock = join(dir, ".lock"), sleep = new Int32Array(new SharedArrayBuffer(4));
  mkdirSync(dir, { recursive: true });
  for (;;) {
    try { mkdirSync(lock); break; } catch (e) {
      if (e.code !== "EEXIST") throw e;
      let pid = 0; try { pid = Number(readFileSync(join(lock, "pid"), "utf8")) || 0; } catch { /* not written yet */ }
      let gone = false; if (pid) { try { process.kill(pid, 0); } catch (k) { gone = k.code === "ESRCH"; } }
      let old = false; try { old = Date.now() - statSync(lock).mtimeMs > 10 * 60e3; } catch { continue; }
      if (gone || old) { rmSync(lock, { recursive: true, force: true }); continue; }
      Atomics.wait(sleep, 0, 0, 200);
    }
  }
  writeFileSync(join(lock, "pid"), String(process.pid));
  try { return fn(); } finally { rmSync(lock, { recursive: true, force: true }); }
}
