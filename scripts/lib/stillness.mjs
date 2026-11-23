// How still a rendered video is, measured on the MP4 itself (scripts/stillness.mjs, and verify after --render).
//
// motion-static reads the timeline source: a tween is movement. This looks at the picture: a stretch is still when
// no sample in it differs from the first by more than `noise` (ffmpeg's freezedetect, the mean absolute difference
// from 0 to 1) for at least `min` seconds. The picture is sampled 10 times a second at 480 px wide, and the caption
// band (the bottom sixth, HyperFrames' captionBand, where nothing else is drawn) is cropped off, since captions
// change on every phrase and would hide a still stage above them. A pause under 1.5 s reads as a beat between two
// moves, not as stillness, so it is not counted.
//
// The bar: under 25% of the video in still stretches, and none over 3 s. A video one reviewer called "most things
// not changing" measured 97% still with a 10.6 s stretch; redesigned so that every spoken phrase had a move, 13% and
// 2.6 s. The number says how static a video is, never whether its motion means anything.
//
// Jolts are reported beside it: a single frame at which the whole picture jumps (ffmpeg's scene score over `jolt`,
// with the frames either side scoring under a third of it). On a continuous stage a jolt is usually a mistake (a
// transform reset at a scene cut, an element that starts somewhere else than where the last scene left it); a hard
// cut to a new picture is one too, so jolts are listed, not judged.
import { spawnSync } from "node:child_process";

export const BAR = { share: 0.25, longest: 3.0 };
export const DEFAULTS = { noise: 0.002, min: 1.5, jolt: 0.03, band: 0.1667, fps: 10, width: 480 };

const crop = (band) => `crop=iw:trunc(ih*${(1 - band).toFixed(4)}/2)*2:0:0`;

// freezedetect's lines (on stderr) to [start, end] stretches; a stretch still at the end has no freeze_end
export function parseFreezes(stderr, duration) {
  const starts = [...String(stderr).matchAll(/freeze_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...String(stderr).matchAll(/freeze_end: ([\d.]+)/g)].map((m) => +m[1]);
  return starts.map((s, i) => [s, ends[i] ?? duration]);
}

// metadata=print's lines (on stdout) to jolts: [seconds, score] where one frame scores over `bar` and its neighbours
// under a third of it
export function parseJolts(stdout, bar = DEFAULTS.jolt) {
  const pts = [...String(stdout).matchAll(/pts_time:([\d.]+)/g)].map((m) => +m[1]);
  const sc = [...String(stdout).matchAll(/scene_score=([\d.]+)/g)].map((m) => +m[1]);
  const out = [];
  for (let k = 1; k < sc.length - 1; k++)
    if (sc[k] > bar && Math.max(sc[k - 1], sc[k + 1]) < sc[k] / 3) out.push([round(pts[k], 2), round(sc[k], 3)]);
  return out;
}

const round = (x, n = 1) => Math.round(x * 10 ** n) / 10 ** n;

// the numbers from the stretches: the still share, the longest stretch and where, every stretch of 2 s or more
export function summarize(runs, duration, bar = BAR) {
  const still = runs.reduce((a, [s, e]) => a + (e - s), 0);
  const longest = runs.reduce((a, r) => (r[1] - r[0] > a[1] - a[0] ? r : a), [0, 0]);
  const share = duration ? still / duration : 0;
  return {
    seconds: round(duration, 2), stillSeconds: round(still, 2), stillShare: round(share, 3),
    longest: round(longest[1] - longest[0], 2), longestAt: [round(longest[0]), round(longest[1])],
    stretches: runs.filter(([s, e]) => e - s >= 2).map(([s, e]) => [round(s), round(e)]),
    passes: !!duration && share < bar.share && longest[1] - longest[0] <= bar.longest,
  };
}

export const hasFfmpeg = () => spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0
  && spawnSync("ffprobe", ["-version"], { stdio: "ignore" }).status === 0;

// measure one MP4: { seconds, stillSeconds, stillShare, longest, longestAt, stretches, jolts, passes }
export function measure(path, o = {}) {
  const opt = { ...DEFAULTS, ...o };
  const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], { encoding: "utf8" });
  const duration = parseFloat(probe.stdout);
  if (probe.status !== 0 || !Number.isFinite(duration)) throw new Error(`ffprobe could not read ${path}: ${(probe.stderr || "").trim()}`);
  const vf = `fps=${opt.fps},scale=${opt.width}:-2,${crop(opt.band)},freezedetect=n=${opt.noise}:d=${opt.min}`;
  const f = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", path, "-vf", vf, "-map", "0:v", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 64 << 20 });
  if (f.status !== 0) throw new Error(`ffmpeg freezedetect failed on ${path}: ${(f.stderr || "").trim().split("\n").at(-1)}`);
  const r = summarize(parseFreezes(f.stderr, duration), duration);
  const j = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", path, "-vf",
    `scale=${opt.width}:-2,${crop(opt.band)},select='gte(scene,0)',metadata=print:file=-`, "-an", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 256 << 20 });
  r.jolts = j.status === 0 ? parseJolts(j.stdout, opt.jolt) : [];
  return r;
}

const pct = (x) => `${Math.round(x * 100)}%`;
// the report: one verdict line (✓, or △ past the bar: never a stop), then the stretches and jolts
export function stillnessLines(r, bar = BAR) {
  const head = `stillness  ${pct(r.stillShare)} still (${r.stillSeconds} s of ${r.seconds} s), ${r.longest ? `longest ${r.longest} s at ${r.longestAt[0]}–${r.longestAt[1]} s` : `no still stretch of ${DEFAULTS.min} s or more`}`
    + `${r.jolts?.length ? `, ${r.jolts.length} jolt${r.jolts.length > 1 ? "s" : ""}` : ""}`
    + ` (the bar: under ${pct(bar.share)}, none over ${bar.longest} s)`;
  return [
    { warn: !r.passes, text: head },
    ...r.stretches.map(([s, e]) => ({ detail: true, text: `still ${s}–${e} s (${round(e - s)} s)` })),
    ...(r.jolts || []).map(([t, v]) => ({ detail: true, text: `jolt at ${t} s: the whole picture jumps in one frame (score ${v})` })),
  ];
}
