// A changed frame's layout, checked in seconds (plans/2026-10-10-cheaper-videos, step 11). verify runs HyperFrames'
// `check` (layout, contrast, runtime) on the whole video at the end of a build, a minute or more in; a revision's
// builds failed there 6 times in 13, mostly on text overflowing a frame. This runs the same check at a few moments of
// the frames asked for, in their slots of the assembled video (index.html), in one browser, and keeps only what is
// found in those frames' files: about 10 seconds. frame-check runs it on one frame; build's first stage on the frames
// changed since the last build.
//
// HyperFrames samples the whole video's motion too, so a finding can come from another frame: each finding names its
// file (sourceFile), and only the asked frames' are kept. The rest are verify's.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./env.mjs";
import { storyboardFrames } from "./terms.mjs";

const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const srcOf = (f) => String(f.meta.src || "").replace(/^\.\//, "");

/** A frame's slot in the assembled video: { start, duration } from index.html, or null when it is not there. */
export function slotOf(dir, src) {
  const el = [...read(join(dir, "index.html")).matchAll(/<div\b[^>]*>/g)].map((m) => m[0]).find((t) => t.includes(`data-composition-src="${src}"`));
  const num = (k) => Number((new RegExp(`${k}="([\\d.]+)"`).exec(el || "") || [])[1]);
  return el && Number.isFinite(num("data-start")) && Number.isFinite(num("data-duration")) ? { start: num("data-start"), duration: num("data-duration") } : null;
}

/** The storyboard's frames whose file changed since the last build (newer than index.html, which finish-project writes last). */
export function changedFrames(dir) {
  const html = join(dir, "index.html");
  if (!existsSync(html)) return null;
  const built = statSync(html).mtimeMs;
  return storyboardFrames(read(join(dir, "STORYBOARD.md")))
    .filter((f) => srcOf(f) && existsSync(join(dir, srcOf(f))) && statSync(join(dir, srcOf(f))).mtimeMs > built)
    .sort((a, b) => a.index - b.index);
}

/**
 * HyperFrames' check on the frames' slots: three moments in each (a quarter in, past the middle, at rest near its
 * end). frames: storyboard frames (storyboardFrames). →
 * { ran: true, byFrame: Map(index → { errors: [...], warnings: [...] }), missing: [index…] } or { ran: false, why }.
 */
export function layoutCheck(dir, frames) {
  const slots = frames.map((f) => ({ f, src: srcOf(f), slot: slotOf(dir, srcOf(f)) }));
  const missing = slots.filter((s) => !s.slot).map((s) => s.f.index), placed = slots.filter((s) => s.slot);
  if (!placed.length) return { ran: false, why: "not in index.html yet", missing };
  const at = [...new Set(placed.flatMap(({ slot: { start, duration: d } }) => [start + d * 0.25, start + d * 0.6, start + Math.max(0, d - 0.4)].map((t) => +t.toFixed(3))))].sort((a, b) => a - b);
  const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "check", "--at", at.join(","), "--json"], { cwd: dir, encoding: "utf8", maxBuffer: 64 << 20 });
  const out = r.stdout || "", i = out.indexOf("\n{") >= 0 ? out.indexOf("\n{") + 1 : out.startsWith("{") ? 0 : -1;
  let j = null;
  try { j = i >= 0 ? JSON.parse(out.slice(i)) : null; } catch { j = null; }
  if (!j) return { ran: false, why: `hyperframes check said ${((r.stderr || out).trim().split("\n").at(-1)) || "nothing"}`, missing };
  const byFrame = new Map(placed.map((s) => [s.f.index, { errors: [], warnings: [] }]));
  const bySrc = new Map(placed.map((s) => [s.src, s.f.index]));
  for (const part of ["lint", "runtime", "layout", "motion", "contrast"]) {
    for (const x of j[part]?.findings || []) {
      const n = bySrc.get(String(x.sourceFile || "").replace(/^\.\//, ""));
      if (n === undefined || !["error", "warning"].includes(x.severity)) continue;
      byFrame.get(n)[x.severity === "error" ? "errors" : "warnings"].push({ part, ...x });
    }
  }
  return { ran: true, byFrame, missing, at };
}

/** One line a finding: what, where in the frame, when. */
export const findingLine = (x) => `${x.part}: ${String(x.message || x.code).replace(/\.$/, "")} (${[x.code, x.selector && `\`${x.selector}\``, x.text && `“${String(x.text).slice(0, 40)}”`, Number.isFinite(x.time) && `${x.time}s`].filter(Boolean).join(", ")})${x.fixHint ? ` — ${x.fixHint}` : ""}`;
