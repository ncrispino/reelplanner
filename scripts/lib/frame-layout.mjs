// A frame's layout, checked in seconds (plans/2026-10-10-cheaper-videos, step 11). verify runs HyperFrames' `check`
// (layout, contrast, runtime) on the whole video at the end of a build, a minute or more in.
//
//   videoCheck    that same check, as verify runs it (its own nine moments over the whole video), on the video as last
//                 assembled: what it stops on, verify would stop on. build's first stage runs it on a rebuild before
//                 anything is voiced, about 15 seconds.
//   layoutCheck   the check at three moments in each frame asked for (a quarter in, past the middle, at rest), keeping
//                 what is found in those frames' files: frame-check's look at one frame. Advice, never a stop: looking
//                 three times at one frame makes an overlap that verify's nine moments pass over (a note there, seen
//                 once) count as held, and a bench run's builds stopped on such overlaps, in 92 s each.
//
// HyperFrames samples the whole video's motion too, so a finding can come from another frame: each finding names its
// file (sourceFile).
import { existsSync, readFileSync, writeFileSync, mkdirSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./env.mjs";
import { storyboardFrames } from "./terms.mjs";

const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const srcOf = (f) => String(f.meta.src || "").replace(/^\.\//, "");
// the file a finding is in, relative to the video: layout's findings name it (sourceFile), lint's by its full path (file)
// (by their real paths: on macOS a temporary folder's /var is /private/var to HyperFrames)
const real = (p) => { try { return realpathSync(p); } catch { return p; } };
const fileOf = (dir, x) => (x.sourceFile ? String(x.sourceFile) : x.file ? relative(real(dir), real(String(x.file))) : "").replace(/^\.\//, "");

/** A frame's slot in the assembled video: { start, duration } from index.html, or null when it is not there. */
export function slotOf(dir, src) {
  const el = [...read(join(dir, "index.html")).matchAll(/<div\b[^>]*>/g)].map((m) => m[0]).find((t) => t.includes(`data-composition-src="${src}"`));
  const num = (k) => Number((new RegExp(`${k}="([\\d.]+)"`).exec(el || "") || [])[1]);
  return el && Number.isFinite(num("data-start")) && Number.isFinite(num("data-duration")) ? { start: num("data-start"), duration: num("data-duration") } : null;
}

// what each frame's file was when a build last passed: .hyperframes/frames-built.json, { "<src>": "<sha1>" }, written by
// build at its end. (index.html's time is no measure: the build leaves it untouched when its content is the same.)
const RECORD = (dir) => join(dir, ".hyperframes", "frames-built.json");
const hashOf = (p) => createHash("sha1").update(readFileSync(p)).digest("hex");
// the words and scenes the assembly is made from: when either changed, the last assembly is stale (voice files
// renumbered, scenes added), and only the build that follows can judge the video
const SOURCES = ["STORYBOARD.md", "SCRIPT.md"];
/** Every storyboard frame's file, hashed, and the storyboard's and script's: { "<path>": "<sha1>" }. */
export function frameHashes(dir) {
  const out = {};
  for (const f of SOURCES) if (existsSync(join(dir, f))) out[f] = hashOf(join(dir, f));
  for (const f of storyboardFrames(read(join(dir, "STORYBOARD.md")))) { const s = srcOf(f); if (s && existsSync(join(dir, s))) out[s] = hashOf(join(dir, s)); }
  return out;
}
/** Write the record, at the end of a build that passed. */
export function recordFrames(dir) { mkdirSync(join(dir, ".hyperframes"), { recursive: true }); writeFileSync(RECORD(dir), JSON.stringify(frameHashes(dir), null, 2) + "\n"); }

/** The storyboard or script changed since a build last passed (or none has recorded them): the assembly is stale. */
export function sourcesChanged(dir) {
  let was = null; try { was = JSON.parse(readFileSync(RECORD(dir), "utf8")); } catch { return true; }
  return SOURCES.some((f) => existsSync(join(dir, f)) && was[f] !== hashOf(join(dir, f)));
}

/**
 * The storyboard's frames whose file changed since a build last passed: null when nothing is assembled yet (a first
 * build); every frame when no build has recorded them.
 */
export function changedFrames(dir) {
  if (!existsSync(join(dir, "index.html"))) return null;
  let was = null; try { was = JSON.parse(readFileSync(RECORD(dir), "utf8")); } catch { was = null; }
  return storyboardFrames(read(join(dir, "STORYBOARD.md")))
    .filter((f) => srcOf(f) && existsSync(join(dir, srcOf(f))) && (!was || was[srcOf(f)] !== hashOf(join(dir, srcOf(f)))))
    .sort((a, b) => a.index - b.index);
}

/**
 * HyperFrames' check on the frames' slots: three moments in each (a quarter in, past the middle, at rest near its
 * end). frames: storyboard frames (storyboardFrames). →
 * { ran: true, byFrame: Map(index → { errors: [...], warnings: [...] }), missing: [index…], at: [t…], atOf: Map(index → its
 * three [t…]) } or { ran: false, why }.
 */
export function layoutCheck(dir, frames) {
  const slots = frames.map((f) => ({ f, src: srcOf(f), slot: slotOf(dir, srcOf(f)) }));
  const missing = slots.filter((s) => !s.slot).map((s) => s.f.index), placed = slots.filter((s) => s.slot);
  if (!placed.length) return { ran: false, why: "not in index.html yet", missing };
  const atOf = new Map(placed.map(({ f, slot: { start, duration: d } }) => [f.index, [start + d * 0.25, start + d * 0.6, start + Math.max(0, d - 0.4)].map((t) => +t.toFixed(3))]));
  const at = [...new Set([...atOf.values()].flat())].sort((a, b) => a - b);
  const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "check", "--at", at.join(","), "--json"], { cwd: dir, encoding: "utf8", maxBuffer: 64 << 20 });
  const out = r.stdout || "", i = out.indexOf("\n{") >= 0 ? out.indexOf("\n{") + 1 : out.startsWith("{") ? 0 : -1;
  let j = null;
  try { j = i >= 0 ? JSON.parse(out.slice(i)) : null; } catch { j = null; }
  if (!j) return { ran: false, why: `hyperframes check said ${((r.stderr || out).trim().split("\n").at(-1)) || "nothing"}`, missing };
  const byFrame = new Map(placed.map((s) => [s.f.index, { errors: [], warnings: [] }]));
  const bySrc = new Map(placed.map((s) => [s.src, s.f.index]));
  for (const part of ["lint", "runtime", "layout", "motion", "contrast"]) {
    for (const x of j[part]?.findings || []) {
      const n = bySrc.get(fileOf(dir, x));
      if (n === undefined || !["error", "warning"].includes(x.severity)) continue;
      byFrame.get(n)[x.severity === "error" ? "errors" : "warnings"].push({ part, ...x });
    }
  }
  return { ran: true, byFrame, missing, at, atOf };
}

/**
 * HyperFrames' check as verify runs it (scripts/verify.sh: `hf check`, its defaults), on the video as last assembled.
 * → { ran: true, errors: [{ ...finding, frame }], warnings: [...] } (frame: the storyboard's number for the finding's
 * file, or null for the video's own) or { ran: false, why }.
 */
export function videoCheck(dir) {
  if (!existsSync(join(dir, "index.html"))) return { ran: false, why: "not assembled yet" };
  const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "check", "--json"], { cwd: dir, encoding: "utf8", maxBuffer: 64 << 20 });
  const out = r.stdout || "", i = out.indexOf("\n{") >= 0 ? out.indexOf("\n{") + 1 : out.startsWith("{") ? 0 : -1;
  let j = null;
  try { j = i >= 0 ? JSON.parse(out.slice(i)) : null; } catch { j = null; }
  if (!j) return { ran: false, why: `hyperframes check said ${((r.stderr || out).trim().split("\n").at(-1)) || "nothing"}` };
  const bySrc = new Map(storyboardFrames(read(join(dir, "STORYBOARD.md"))).map((f) => [srcOf(f), f.index]));
  const errors = [], warnings = [];
  for (const part of ["lint", "runtime", "layout", "motion", "contrast"]) {
    for (const x of j[part]?.findings || []) {
      if (!["error", "warning"].includes(x.severity)) continue;
      const frame = bySrc.get(fileOf(dir, x)) ?? null;
      (x.severity === "error" ? errors : warnings).push({ part, frame, ...x });
    }
  }
  return { ran: true, errors, warnings };
}

// Studio's wish for an id on every element it shows (studio_missing_editable_id): for editing in HyperFrames' Studio,
// which a reelplanner video never is. A bench run's agent added ids to every frame for it, and built again.
const STUDIO_ONLY = new Set(["studio_missing_editable_id"]);

/**
 * HyperFrames' lint (static: nothing assembled needed), what the frames' files hold of it. frames: storyboard frames. →
 * { ran: true, byFrame: Map(index → { errors: [...], warnings: [...] }) } or { ran: false, why }.
 */
export function hfLint(dir, frames) {
  const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "lint", ".", "--json"], { cwd: dir, encoding: "utf8", maxBuffer: 64 << 20 });
  const out = r.stdout || "", i = out.indexOf("{");
  let j = null;
  try { j = i >= 0 ? JSON.parse(out.slice(i)) : null; } catch { j = null; }
  if (!j || !Array.isArray(j.findings)) return { ran: false, why: `hyperframes lint said ${((r.stderr || out).trim().split("\n").at(-1)) || "nothing"}` };
  const byFrame = new Map(frames.map((f) => [f.index, { errors: [], warnings: [] }]));
  const bySrc = new Map(frames.map((f) => [srcOf(f), f.index]));
  for (const x of j.findings) {
    const n = bySrc.get(fileOf(dir, x));
    if (n === undefined || STUDIO_ONLY.has(x.code) || !["error", "warning"].includes(x.severity)) continue;
    byFrame.get(n)[x.severity === "error" ? "errors" : "warnings"].push({ part: "lint", ...x });
  }
  return { ran: true, byFrame };
}

/** One line a finding: what, where in the frame, when. */
export const findingLine = (x) => `${x.part}: ${String(x.message || x.code).replace(/\.$/, "")} (${[x.code, x.selector && `\`${x.selector}\``, x.text && `“${String(x.text).slice(0, 40)}”`, Number.isFinite(x.time) && `${x.time}s`].filter(Boolean).join(", ")})${x.fixHint ? ` — ${x.fixHint}` : ""}`;
