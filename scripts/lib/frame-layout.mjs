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
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./env.mjs";
import { storyboardFrames } from "./terms.mjs";

const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const srcOf = (f) => String(f.meta.src || "").replace(/^\.\//, "");

// HyperFrames 0.8.52 collapses layout findings by selector, without their source file.
// A shared class in two scenes can therefore lose one scene's finding in a batch. Ask for
// raw findings and apply the pinned persistence rules independently to each source. The
// frame-tools browser regression compares these severities with separate pinned checks.
// Pinned source: hyperframes/dist/cli.js, collapseStaticLayoutIssues/applyPersistenceTier;
// checkPipeline's buildOverlapSampleTimes (8 fps, 600 cap) and contrastFailureHeld below.
const TIERED = new Set(["text_box_overflow", "clipped_text", "canvas_overflow", "container_overflow", "content_overlap", "text_occluded", "escaped_container", "panel_out_of_canvas", "connector_detached", "connector_orphan"]);
export function collapsedLayout(findings, sampleCounts = null, fallbackSamples = new Set(findings.map((x) => x.time)).size) {
  const groups = new Map(), format = (v) => Number.isInteger(v) ? String(v) : Number(v).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  for (const x of findings) {
    const overflow = x.overflow ? ["left", "right", "top", "bottom"].flatMap((k) => x.overflow[k] == null ? [] : `${k} ${format(x.overflow[k])}px`).join(", ") : "";
    const position = ["frame_out_of_frame", "connector_detached", "connector_orphan"].includes(x.code) ? `${Math.round(x.rect.left)},${Math.round(x.rect.top)}` : "";
    const key = [x.sourceFile, x.code, x.severity, x.selector, x.containerSelector ?? "", ["content_overlap", "text_occluded"].includes(x.code) ? "" : x.text ?? "", overflow, position].join("|");
    if (!groups.has(key)) groups.set(key, { x, times: [] });
    groups.get(key).times.push(x.time);
  }
  return [...groups.values()].map(({ x, times }) => {
    const sorted = [...new Set(times)].sort((a, b) => a - b), firstSeen = sorted[0], lastSeen = sorted.at(-1);
    let start = firstSeen, previous = firstSeen, heldMs = 0;
    for (const t of sorted) { if (t - previous > 1) { heldMs = Math.max(heldMs, (previous - start) * 1000); start = t; } previous = t; }
    heldMs = Math.max(heldMs, (lastSeen - start) * 1000);
    let severity = x.severity;
    if ((sampleCounts?.get(String(x.sourceFile || "").replace(/^\.\//, "")) ?? fallbackSamples) > 1 && TIERED.has(x.code)) {
      if (sorted.length <= 1) severity = "info";
      else if (x.code === "content_overlap" && heldMs >= 500) severity = "error";
      else if (x.code === "canvas_overflow" && x.overflow && x.containerRect && Math.max(...Object.values(x.overflow).filter((v) => typeof v === "number")) >= Math.min(x.containerRect.width, x.containerRect.height) * 0.05 && Math.min(x.rect.right, x.containerRect.right) > Math.max(x.rect.left, x.containerRect.left) && Math.min(x.rect.bottom, x.containerRect.bottom) > Math.max(x.rect.top, x.containerRect.top)) severity = "warning";
    }
    return { ...x, severity, time: firstSeen, firstSeen, lastSeen, occurrences: sorted.length, heldMs };
  });
}

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
 * { ran: true, byFrame: Map(index → { errors: [...], warnings: [...] }), missing: [index…] } or { ran: false, why }.
 */
export function layoutCheck(dir, frames) {
  const slots = frames.map((f) => ({ f, src: srcOf(f), slot: slotOf(dir, srcOf(f)) }));
  const missing = slots.filter((s) => !s.slot).map((s) => s.f.index), placed = slots.filter((s) => s.slot);
  if (!placed.length) return { ran: false, why: "not in index.html yet", missing };
  const pinned = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).dependencies.hyperframes;
  if (pinned !== "0.8.52") return { ran: false, why: `frame layout persistence is verified against hyperframes 0.8.52, found ${pinned}: update its differential checks before using it`, missing: [] };
  const moments = ({ start, duration: d }) => [start + d * 0.25, start + d * 0.6, start + Math.max(0, d - 0.4)].map((t) => +t.toFixed(3));
  const ownTimes = new Map(placed.map((s) => [s.src, new Set(moments(s.slot))]));
  const at = [...new Set(placed.flatMap(({ slot }) => moments(slot)))].sort((a, b) => a - b);
  // A batch must not lose findings to the whole-video limit before they are assigned to frames.
  const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "check", "--at", at.join(","), "--max-issues", "1000000", "--no-collapse-static", "--json"], { cwd: dir, encoding: "utf8", maxBuffer: 64 << 20 });
  const out = r.stdout || "", i = out.indexOf("\n{") >= 0 ? out.indexOf("\n{") + 1 : out.startsWith("{") ? 0 : -1;
  let j = null;
  try { j = i >= 0 ? JSON.parse(out.slice(i)) : null; } catch { j = null; }
  if (!j) return { ran: false, why: `hyperframes check said ${((r.stderr || out).trim().split("\n").at(-1)) || "nothing"}`, missing };
  const byFrame = new Map(placed.map((s) => [s.f.index, { errors: [], warnings: [] }]));
  const bySrc = new Map(placed.map((s) => [s.src, s.f.index]));
  const global = { errors: [], warnings: [] }, blockers = [];
  const duration = j.layout?.duration || 0, overlapCount = Math.min(600, Math.max(2, Math.ceil(duration * 8) + 1));
  const overlapTimes = new Set(Array.from({ length: overlapCount }, (_, i) => +(i * duration / (overlapCount - 1)).toFixed(3)));
  for (const part of ["lint", "runtime", "layout", "motion", "contrast"]) {
    const raw = (j[part]?.findings || []).filter((x) => {
      const times = ownTimes.get(String(x.sourceFile || "").replace(/^\.\//, ""));
      return !times || !["layout", "contrast"].includes(part) || times.has(x.time) || part === "layout" && x.code === "content_overlap" && overlapTimes.has(x.time);
    });
    let findings = part === "layout" ? collapsedLayout(raw, new Map([...ownTimes].map(([src, times]) => [src, times.size])), at.length) : part === "motion" ? collapsedLayout(raw) : raw;
    if (part === "contrast") findings = raw.map((x) => ({ ...x, severity: (ownTimes.get(String(x.sourceFile || "").replace(/^\.\//, ""))?.size ?? at.length) < 2 || new Set(raw.filter((y) => y.sourceFile === x.sourceFile && y.selector === x.selector && y.text === x.text).map((y) => y.time)).size >= 2 ? "error" : "warning" }));
    for (const x of findings) {
      const n = bySrc.get(String(x.sourceFile || "").replace(/^\.\//, ""));
      if (!["error", "warning"].includes(x.severity)) continue;
      const finding = { part, ...x };
      (n === undefined ? global : byFrame.get(n))[x.severity === "error" ? "errors" : "warnings"].push(finding);
      if (["lint", "runtime"].includes(part) && x.severity === "error") blockers.push(finding);
    }
  }
  // Valid JSON is also returned when lint skips the browser or browser startup fails.
  // Neither is a successful layout check, even if no finding names an asked frame.
  const sampled = Array.isArray(j.layout?.samples) && at.every((t) => j.layout.samples.some((s) => Math.abs(s - t) < 0.001));
  const why = j.error || (j.layout?.truncated ? "hyperframes truncated its layout findings" : !sampled ? "hyperframes did not check every requested layout moment" : null);
  return { ran: !why, ...(why ? { why } : {}), byFrame, global, blockers, missing, at };
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
      const frame = bySrc.get(String(x.sourceFile || "").replace(/^\.\//, "")) ?? null;
      (x.severity === "error" ? errors : warnings).push({ part, frame, ...x });
    }
  }
  if (j.error || !j.layout?.samples?.length && !errors.length) errors.push({ part: "runtime", frame: null, code: "frame_check_incomplete", severity: "error", message: j.error || "hyperframes did not run its browser layout check" });
  return { ran: true, errors, warnings };
}

/** One line a finding: what, where in the frame, when. */
export const findingLine = (x) => `${x.part}: ${String(x.message || x.code).replace(/\.$/, "")} (${[x.code, x.selector && `\`${x.selector}\``, x.text && `“${String(x.text).slice(0, 40)}”`, Number.isFinite(x.time) && `${x.time}s`].filter(Boolean).join(", ")})${x.fixHint ? ` — ${x.fixHint}` : ""}`;
