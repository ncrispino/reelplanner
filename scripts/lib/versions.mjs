// The versions of a video a reviewer saw, kept so `reel rebuild` can build any of them again (scripts/rebuild.mjs).
//
// Git keeps a video's text: its storyboard, script, frames, plan map and narration record. It leaves out what the
// build makes again (renders, snapshots, the vendored animation library, the guide), the voice (made again by
// `narrate`), and, in a repo set up as reelplanning's templates say, the rest of `assets/` and `capture/`. Some of
// that cannot be made again: a screenshot shown in a scene, the text a video was captured from, an image fetched or
// generated at build time. A later version that recaptures a screenshot under the same name overwrites it, and the
// earlier version is gone. So each reviewed version keeps those files, small and committed:
//
//   .reelplanning/media/<sha256, 16 hex>.<ext>          the store: one file per content, shared by every video and
//                                                         version (a PNG is kept as lossless WebP when that is smaller
//                                                         and gives back the same pixels; anything else as it is)
//   <plan-dir>/versions/<video>/<build id>.json          a version: what it was built from (below). <video> is the
//                                                         folder's name (video, walkthrough-video); an explainer's is
//                                                         under its folder, the system video's under .reelplanning/
//
//   { "format": 1, "video": ".reelplanning/plans/<plan>/video", "build": "<the player's buildSig()>", "id": "<build id>",
//     "keptAt": "…", "keptBy": "review" | "record" | "keep",
//     "commit": "<HEAD when kept>", "dirty": [<files of the video that differed from it>],
//     "scenes": { "<path>": "<sha256, 16 hex>" },          every file of the video git has (or will have): what a
//                                                         rebuild checks the commit's scenes against
//     "files": [{ "path": "assets/shots/a.png", "sha256": "…", "size": 91337, "store": "media/<key>.webp", "as": "webp-lossless" }],
//     "shipped": [{ "path": "assets/fonts/Inter-400.woff2", "sha256": "…", "from": "skills:hyperframes-creative/…" }],
//     "regenerated": { "assets/voice/": 12, "audio_meta.json": 1, … },   the voice and its word timings: voiced again
//     "rebuilt": ["renders/", "guide/", …],               made again by the build
//     "lost": [{ "path", "sha256", "size", "why" }],      neither kept nor reproducible (audio or video never is: D-305)
//     "tools": { "reelplanning": "0.2.0", "hyperframes": "0.8.52", "skills": { "ref": "v0.8.52", "faceless-explainer": "<folder hash>", … } },
//     "narration": { "voice", "speed", "model", "provider", "lines" }, "audio": { "sfx": [...], "bgm": … } }
//
// "Version" is the build signature the review player already uses (its buildSig(): the plan map's `changes.at`, else
// its frames), so one version is one build a reviewer could have watched. Keeping it is idempotent: the same build
// kept again changes nothing, except that a version kept before its video was committed points at the commit once the
// video is committed with the same scenes. `reelplanning review <video-dir>` keeps the version it opens, `reel record`
// the version a review was of; `reel rebuild <video-dir> --keep` keeps the current one by hand.
//
// Only a video inside a set-up `.reelplanning/` (plans, explainers, the system video) in a git repo keeps versions.
// Audio and video files are never stored (D-305): a sound effect from the pinned media catalog is fetched again by the
// build; one that is not is listed as lost.
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, realpathSync, rmSync, mkdtempSync } from "node:fs";
import { join, resolve, dirname, basename, relative, extname, sep } from "node:path";
import { tmpdir, homedir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { ROOT, VERSION, pkgDir, depFile, GSAP, rpInitialized } from "./env.mjs";
import { skillsDir } from "../hyperframes-skills.mjs";

export const STORE = "media";
export const SIZE_WARN = 5e6;   // a version that adds more than this to the store is said
export const AV = /\.(wav|mp3|m4a|aac|ogg|oga|opus|flac|aiff?|mp4|m4v|mov|webm|mkv|avi)$/i;
// what the pipeline makes again, by its path in the video folder: never kept
// the voice and its word timings: voiced again by `narrate` (the owner accepts a re-voice)
const REGENERATED = ["assets/voice/", "audio_meta.json", "audio_engine_meta.json", ".hyperframes/narration-progress/", ".hyperframes/frames-timed-to.json"];
// the build's own output and HyperFrames' scratch
const REBUILT = ["renders/", "snapshots/", "node_modules/", "assets/vendor/", ".hyperframes/", "fresh-eyes/shots/", "guide/", ".producer/", ".debug/"];
const under = (p, list) => list.find((x) => (x.endsWith("/") ? p.startsWith(x) : p === x));

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const fileSha = (p) => sha256(readFileSync(p));
const git = (cwd, ...args) => { const r = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", "pipe", "pipe"] }); return r.status === 0 ? r.stdout : null; };
const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
export const human = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;

/** The review player's build signature (reelplanning-player.js buildSig()): a version's name. */
export const buildSig = (map) => map ? map.changes?.at || JSON.stringify((map.frames || []).map((f) => [f.compositionId, f.start, f.end])) : null;
/** A version's file name: the signature, hashed (a signature can be a list of frames, or hold colons). */
export const sigId = (sig) => createHash("sha1").update(String(sig)).digest("hex").slice(0, 12);

/**
 * Where a video's versions go, or `{ skip }`: the `.reelplanning/` the video folder is in (set up: decisions.json),
 * the git repo it is in, the folder the manifests go in and the store.
 */
export function videoInfo(videoDir) {
  const dir = real(videoDir);
  let rp = null;
  for (let d = dirname(dir); d !== dirname(d); d = dirname(d)) if (basename(d) === ".reelplanning") { rp = d; break; }
  if (!rp || !rpInitialized(rp)) return { dir, skip: "not a video of a set-up .reelplanning/ (plans, explainers, the system video)" };
  const top = git(dir, "rev-parse", "--show-toplevel");
  if (!top) return { dir, skip: "not in a git repository" };
  const owner = dirname(dir), name = basename(dir);
  return { dir, rp, top: real(top.trim()), owner, name, rel: relative(real(top.trim()), dir).split(sep).join("/"), versions: join(owner, "versions", name), store: join(rp, STORE) };
}

// ── what a video holds ───────────────────────────────────────────────────────────────────────────────
const nul = (s) => (s || "").split("\0").filter(Boolean);
function walk(abs, rel, out) {
  let st; try { st = statSync(abs); } catch { return out; }
  if (st.isDirectory()) { for (const e of readdirSync(abs).sort()) walk(join(abs, e), rel ? `${rel}/${e}` : e, out); }
  else if (st.isFile()) out.push(rel);
  return out;
}

/** Every file of the video git has or will have (tracked, or new and not ignored), each with its hash: its scenes. */
export function scenesOf(dir) {
  const out = {};
  for (const p of nul(git(dir, "ls-files", "-z", "-c", "-o", "--exclude-standard", "--", ".")).sort()) {
    const abs = join(dir, p);
    if (existsSync(abs) && statSync(abs).isFile()) out[p] = fileSha(abs).slice(0, 16);
  }
  return out;
}
/** The video's files that differ from HEAD (changed, new, deleted), relative to the video folder. */
function dirtyOf(info) {
  const lines = nul(git(info.dir, "status", "--porcelain", "-z", "--untracked-files=all", "--", "."));
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i], code = l.slice(0, 2), p = l.slice(3);
    if (/R|C/.test(code)) i++;   // a rename's source follows it
    const rel = relative(info.dir, join(info.top, p)).split(sep).join("/");
    if (!rel.startsWith("..")) out.push(rel);
  }
  return [...new Set(out)].sort();
}

// The files the pinned tools ship, by content: a font from a frame preset, a sound from media-use's catalog, the
// player's own fonts. A file of the video with the same bytes comes back with the tools, and is not stored.
let SHIPPED = null;
export function shippedIndex() {
  if (SHIPPED) return SHIPPED;
  SHIPPED = new Map();
  const add = (base, label) => {
    if (!base || !existsSync(base)) return;
    for (const rel of walk(base, "", [])) {
      if (/(^|\/)(node_modules|\.git)\//.test(rel)) continue;
      const abs = join(base, rel); if (statSync(abs).size > 20e6) continue;
      const h = fileSha(abs); if (!SHIPPED.has(h)) SHIPPED.set(h, `${label}${rel}`);
    }
  };
  try { add(skillsDir(), "skills:"); } catch { /* no skills installed: nothing counts as shipped by them */ }
  add(join(ROOT, "packages", "player", "fonts"), "reelplanning:packages/player/fonts/");
  try { const g = depFile(...GSAP); SHIPPED.set(fileSha(g), "gsap:dist/gsap.min.js"); } catch { /* not installed */ }
  return SHIPPED;
}

/**
 * The files git leaves out of the video, each sorted into what becomes of it: kept (stored per version), shipped by
 * the pinned tools, regenerated (the voice), rebuilt by the build, or lost (audio or video no tool makes again).
 */
export function classify(dir) {
  const keep = [], shipped = [], lost = [], regenerated = {}, rebuilt = new Set();
  const idx = shippedIndex();
  for (const entry of nul(git(dir, "ls-files", "-z", "-o", "-i", "--exclude-standard", "--directory", "--", "."))) {
    const isDir = entry.endsWith("/"), e = entry.replace(/\/$/, "");
    // a whole folder the build makes (renders/, node_modules/), not walked: unless the voice may be in it (.hyperframes/)
    const b0 = isDir && under(entry, REBUILT);
    if (b0 && !REGENERATED.some((g) => g.startsWith(entry) && g !== entry)) { rebuilt.add(b0); continue; }
    for (const p of isDir ? walk(join(dir, e), e, []) : [e]) {
      const g = under(p, REGENERATED); if (g) { regenerated[g] = (regenerated[g] || 0) + 1; continue; }
      const b = under(p, REBUILT); if (b) { rebuilt.add(b); continue; }
      const abs = join(dir, p), buf = readFileSync(abs), h = sha256(buf);
      if (idx.has(h)) { shipped.push({ path: p, sha256: h, from: idx.get(h) }); continue; }
      if (AV.test(p)) { lost.push({ path: p, sha256: h, size: buf.length, why: "audio or video, never committed (D-305), and not one the pinned tools ship" }); continue; }
      keep.push({ path: p, sha256: h, size: buf.length, abs });
    }
  }
  return { keep, shipped, lost, regenerated, rebuilt: [...rebuilt].sort() };
}

// ── the store ────────────────────────────────────────────────────────────────────────────────────────
const have = (bin) => spawnSync(bin, ["-version"], { stdio: "ignore" }).status === 0;
let FF = null;
const ffmpeg = () => (FF ??= have("ffmpeg") && have("ffprobe"));
const pixels = (file) => { const r = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-f", "rawvideo", "-pix_fmt", "rgba", "-"], { maxBuffer: 1 << 30 }); return r.status === 0 ? sha256(r.stdout) : null; };
// 8-bit pictures only: a 16-bit PNG would lose its precision in WebP, and is kept as it is
const EIGHT_BIT = new Set(["rgb24", "rgba", "gray", "ya8", "pal8", "monob", "monow", "gray8", "bgr24", "bgra"]);
/** A PNG as lossless WebP, when that is smaller and decodes to the same pixels; else null. */
function webpOf(png) {
  if (!ffmpeg()) return null;
  const fmt = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=pix_fmt", "-of", "csv=p=0", png], { encoding: "utf8" }).stdout?.trim();
  if (!EIGHT_BIT.has(fmt)) return null;
  const t = mkdtempSync(join(tmpdir(), "rp-webp-")), out = join(t, "x.webp");
  try {
    const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", png, "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", out], { stdio: "ignore" });
    if (r.status !== 0 || !existsSync(out) || statSync(out).size >= statSync(png).size) return null;
    const a = pixels(png), b = pixels(out);
    return a && a === b ? readFileSync(out) : null;
  } finally { rmSync(t, { recursive: true, force: true }); }
}

/** One file into the store (once per content). → { store: "media/<key>.<ext>", as, added: bytes new to the store } */
export function storeFile(storeDir, f) {
  mkdirSync(storeDir, { recursive: true });
  const key = f.sha256.slice(0, 16), ext = (extname(f.path) || ".bin").toLowerCase();
  const there = readdirSync(storeDir).find((n) => n.startsWith(`${key}.`));
  const as = (name) => (ext === ".png" && name.endsWith(".webp") ? "webp-lossless" : "as-is");
  if (there) return { store: `${STORE}/${there}`, as: as(there), added: 0 };
  const webp = ext === ".png" ? webpOf(f.abs) : null;
  const name = webp ? `${key}.webp` : `${key}${ext}`;
  if (webp) writeFileSync(join(storeDir, name), webp); else copyFileSync(f.abs, join(storeDir, name));
  return { store: `${STORE}/${name}`, as: as(name), added: statSync(join(storeDir, name)).size };
}

// ── the tools a version was built with ────────────────────────────────────────────────────────────────
function toolsNow() {
  const hf = (() => { try { return readJson(join(pkgDir("hyperframes"), "package.json"))?.version || null; } catch { return null; } })();
  const lock = readJson(join(homedir(), ".agents", ".skill-lock.json"))?.skills || {};
  const skills = {};
  for (const s of ["faceless-explainer", "media-use", "hyperframes-creative"]) if (lock[s]) { skills.ref ??= lock[s].ref || "main"; skills[s] = lock[s].skillFolderHash || null; }
  // reelplanning run from a checkout (its own repo, `npm link`): the commit too, since the version moves slower than the code
  const own = existsSync(join(ROOT, ".git")) ? git(ROOT, "rev-parse", "HEAD")?.trim() || null : null;
  return { reelplanning: VERSION, ...(own ? { reelplanningCommit: own } : {}), hyperframes: hf, skills };
}
function narrationOf(dir) {
  const rec = readJson(join(dir, ".hyperframes", "narration.json")), eng = readJson(join(dir, "audio_engine_meta.json"));
  if (!rec && !eng) return null;
  return { voice: rec?.voice ?? eng?.voice_id ?? null, speed: rec?.speed ?? null, model: rec?.model ?? null, provider: eng?.tts_provider ?? null, lines: rec ? Object.keys(rec.lines || {}).length : (eng?.voices || []).length };
}
function audioOf(dir) {
  const m = readJson(join(dir, "audio_meta.json"));
  return m ? { sfx: m.sfx || [], bgm: m.bgm || null } : null;
}

// ── versions ──────────────────────────────────────────────────────────────────────────────────────────
/** The versions kept of a video, oldest first, each with its number `n` (1 the oldest) and its file. */
export function listVersions(info) {
  if (!existsSync(info.versions)) return [];
  return readdirSync(info.versions).filter((f) => f.endsWith(".json")).map((f) => ({ ...readJson(join(info.versions, f)), file: join(info.versions, f) }))
    .filter((m) => m.id).sort((a, b) => String(a.keptAt).localeCompare(String(b.keptAt)) || a.id.localeCompare(b.id)).map((m, i) => ({ ...m, n: i + 1 }));
}

/**
 * Keep the video's current version. → { status: "kept" | "again" | "updated" | "skip", why?, n, id, file, files, added,
 * lost, big } — never throws for a video it cannot keep (it says why in `why`).
 */
export function keepVersion(videoDir, { by = "keep" } = {}) {
  const info = videoInfo(videoDir);
  if (info.skip) return { status: "skip", why: info.skip };
  const map = readJson(join(info.dir, "plan-map.json")), sig = buildSig(map);
  if (!sig) return { status: "skip", why: "no plan-map.json: not built yet" };
  const id = sigId(sig), file = join(info.versions, `${id}.json`);
  const head = git(info.dir, "rev-parse", "HEAD")?.trim() || null, dirty = dirtyOf(info);
  const numbered = () => listVersions(info).find((v) => v.id === id)?.n;
  if (existsSync(file)) {
    const m = readJson(file);
    // kept before the video was committed: once it is, with the scenes it was kept with, it points at that commit
    if (m?.dirty?.length && !dirty.length && head) {
      const now = scenesOf(info.dir);
      if (JSON.stringify(now) === JSON.stringify(m.scenes)) {
        m.commit = head; m.dirty = [];
        writeFileSync(file, JSON.stringify(m, null, 2) + "\n");
        return { status: "updated", info, id, file, n: numbered(), commit: head };
      }
    }
    return { status: "again", info, id, file, n: numbered() };
  }
  const c = classify(info.dir);
  let added = 0;
  const files = c.keep.map((f) => { const s = storeFile(info.store, f); added += s.added; return { path: f.path, sha256: f.sha256, size: f.size, store: s.store, as: s.as }; });
  const manifest = {
    format: 1, video: info.rel, build: sig.length <= 80 ? sig : null, id, keptAt: new Date().toISOString(), keptBy: by,
    commit: head, dirty, scenes: scenesOf(info.dir),
    files, shipped: c.shipped, regenerated: c.regenerated, rebuilt: c.rebuilt, lost: c.lost.map(({ abs, ...x }) => x),
    tools: toolsNow(), narration: narrationOf(info.dir), audio: audioOf(info.dir),
  };
  mkdirSync(info.versions, { recursive: true });
  writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n");
  return { status: "kept", info, id, file, n: numbered(), files: files.length, added, lost: manifest.lost, big: added > SIZE_WARN, dirty };
}

/** The lines `review` and `record` print for a keep: nothing for a version kept already, or a video that keeps none. */
export function keepLines(r, cwd = process.cwd()) {
  const rel = (p) => relative(cwd, p) || ".";
  if (r.status === "updated") return [`✓ version ${r.n} of ${r.info.rel}: now at commit ${r.commit.slice(0, 7)} (reel rebuild)`];
  if (r.status !== "kept") return [];
  const out = [`✓ version ${r.n} of ${r.info.rel} kept for \`reel rebuild\`: ${r.files} file(s) git leaves out${r.files ? `, +${human(r.added)} in ${rel(r.info.store)}` : ""} (${rel(r.file)})`];
  if (r.big) out.push(`△ that version adds ${human(r.added)} to ${rel(r.info.store)}, over ${human(SIZE_WARN)}: large screenshots? crop them to the part that matters (style guide §5)`);
  if (r.lost?.length) out.push(`△ not kept, and not made again by a rebuild: ${r.lost.map((l) => l.path).join(", ")} (audio or video, never committed: D-305)`);
  if (r.dirty?.length) out.push(`· its scenes are not all committed yet (${r.dirty.length} file(s)): once the video is committed as it is, the version points at that commit`);
  return out;
}

/**
 * The files the tools shipped (a preset's fonts, a catalog sound) back into `outDir`, from the tools installed here:
 * the build does not stage them again (faceless-explainer's start does). → { back: [paths], missing: [{ path, why }] }
 */
export function restoreShipped(manifest, outDir) {
  const back = [], missing = [], idx = shippedIndex();
  const where = (from) => {
    const [kind, ...r] = String(from).split(":"), rel = r.join(":");
    try { return kind === "skills" ? join(skillsDir(), rel) : kind === "reelplanning" ? join(ROOT, rel) : kind === "gsap" ? depFile(...GSAP) : null; } catch { return null; }
  };
  for (const s of manifest.shipped || []) {
    let src = where(s.from);
    if (!src || !existsSync(src) || fileSha(src) !== s.sha256) {
      // the tools here moved it, or ship other bytes under that name: the same bytes anywhere else they ship will do
      const alt = idx.get(s.sha256); src = alt ? where(alt) : null;
    }
    if (!src || !existsSync(src)) { missing.push({ path: s.path, why: `the tools here no longer ship it (${s.from})` }); continue; }
    mkdirSync(dirname(join(outDir, s.path)), { recursive: true });
    copyFileSync(src, join(outDir, s.path)); back.push(s.path);
  }
  return { back, missing };
}

/**
 * The version's stored files back into `outDir` (a video folder). → { exact: [paths], same: [paths, same pixels,
 * re-encoded], missing: [{ path, why }] }
 */
export function restoreFiles(rp, manifest, outDir) {
  const exact = [], same = [], missing = [];
  for (const f of manifest.files || []) {
    const src = join(rp, f.store), dst = join(outDir, f.path);
    if (!existsSync(src)) { missing.push({ path: f.path, why: `${f.store} is not in the store (not committed, or removed)` }); continue; }
    mkdirSync(dirname(dst), { recursive: true });
    if (f.as === "webp-lossless") {
      const r = ffmpeg() ? spawnSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-f", "image2", "-c:v", "png", dst], { stdio: "ignore" }) : { status: 1 };
      if (r.status !== 0) { copyFileSync(src, dst); missing.push({ path: f.path, why: "kept as WebP, and no ffmpeg here to make it a PNG again: the WebP is in its place (a browser shows it all the same)" }); continue; }
      (fileSha(dst) === f.sha256 ? exact : same).push(f.path);
    } else {
      copyFileSync(src, dst);
      if (fileSha(dst) === f.sha256) exact.push(f.path); else missing.push({ path: f.path, why: `${f.store} does not hold the bytes kept (its hash differs)` });
    }
  }
  return { exact, same, missing };
}
