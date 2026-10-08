#!/usr/bin/env node
// Cut the linear render into one MP4 per chapter (from plan-map.json chapters[]), frame-accurate.
//
// --no-checks leaves the quick checks out. In the player a quick check stops the video, takes your answer and shows
// why; an MP4 cannot stop, so its viewer would see the question and cards and never the answer. With the flag, each
// quick check's scene is cut out of its chapter (the system video's chapters are made this way), and the rest of the
// chapter joined up around it.
//
// usage: reelplanning chapters <project-dir> [--no-checks]
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
const args = process.argv.slice(2), dir = args.find((a) => !a.startsWith("--")), NO_CHECKS = args.includes("--no-checks");
if (!dir) { console.error("usage: reelplanning chapters <project-dir> [--no-checks]"); process.exit(1); }
const map = JSON.parse(readFileSync(join(dir, "plan-map.json"), "utf8"));
const src = join(dir, "renders/video.mp4"); if (!existsSync(src)) { console.error(`✗ no ${src}: render it first (reelplanning verify ${dir} --render)`); process.exit(1); }
if (!map.chapters?.length) { console.log("no chapters tagged (add `- chapter_start: <title>` to frames)"); process.exit(0); }
mkdirSync(join(dir, "renders/chapters"), { recursive: true });
const r3 = (x) => +x.toFixed(3);
// the spans of the quick checks' scenes, [start, end) in the linear render
const checks = NO_CHECKS ? (map.quizzes || []).map((q) => map.frames.find((f) => f.index === q.frameIndex)).filter(Boolean).map((f) => [f.start, r3(f.start + f.durationSeconds)]) : [];
/** a chapter's [start, end) with the checks' spans taken out */
function keep(c) {
  let parts = [[c.start, c.end]];
  for (const [a, b] of checks) parts = parts.flatMap(([s, e]) => (b <= s || a >= e ? [[s, e]] : [[s, a], [b, e]].filter(([x, y]) => y - x > 0.05)));
  return parts;
}
const enc = ["-c:v", "libx264", "-preset", "fast", "-crf", "18", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart"];
for (const c of map.chapters) {
  const out = join(dir, `renders/chapters/${c.id}.mp4`), parts = keep(c), cut = parts.length !== 1 || parts[0][0] !== c.start || parts[0][1] !== c.end;
  if (!cut) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(c.start), "-to", String(c.end), "-i", src, ...enc, out]);
  else if (!parts.length) { console.log(`${c.id}: ${c.title} — nothing left once its quick checks are out; not written`); continue; }
  else {
    // each kept span trimmed from the render, then joined: video and sound together, timestamps from zero
    const f = parts.map(([s, e], i) => `[0:v]trim=start=${s}:end=${e},setpts=PTS-STARTPTS[v${i}];[0:a]atrim=start=${s}:end=${e},asetpts=PTS-STARTPTS[a${i}];`).join("")
      + parts.map((_, i) => `[v${i}][a${i}]`).join("") + `concat=n=${parts.length}:v=1:a=1[v][a]`;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-filter_complex", f, "-map", "[v]", "-map", "[a]", ...enc, out]);
  }
  const secs = r3(parts.reduce((n, [s, e]) => n + e - s, 0)), left = r3(c.end - c.start - secs);
  console.log(`${c.id}: ${c.title} — frames ${c.fromFrame}–${c.toFrame}, ${c.linearSeconds}s linear / ${c.watchedSeconds}s watched${left ? `, ${secs}s once its quick check${checks.filter(([a, b]) => a < c.end && b > c.start).length === 1 ? " is" : "s are"} out` : ""} → ${out}`);
}
