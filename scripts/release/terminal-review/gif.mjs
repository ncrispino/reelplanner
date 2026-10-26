#!/usr/bin/env node
// The README's terminal-review GIF (docs/media/terminal-review.gif), cut from a trial's screen recording
// (terminal-review.sh --record: trial.mp4, and events.txt for when each step happened). Each segment is a stretch of
// the recording at a speed, with its sentence in the caption card the videos use (compositions/captions.html: EB
// Garamond on the cream card, a hairline border, one soft shadow) and, above the recording, a mono place label saying
// how fast it plays. The recording sits on cream paper and the card in the band under it, so nothing covers the
// terminal. Chromium draws the paper from HTML with the theme's own fonts (packages/player/fonts); ffmpeg lays each
// stretch of the recording on it and makes the GIF as record-tour.mjs does: frames that differ by nothing but noise
// dropped, one palette, no dithering.
//
// usage: node scripts/release/terminal-review/gif.mjs <trial.mp4> <segments.txt> <out.gif> [--width 1100] [--fps 10] [--colors 96]
//   segments.txt: a segment a line, `<from s>|<to s>|<speed>|<label>|<sentence>`. The README's, from the Codex run:
//     1|4|1|Codex in Ghostty, with tmux|You ask Codex to open the plan video's review beside you.
//     680|724|5|5× speed|It opens in a split, right beside Codex.
//     724|844|10|10× speed · a scripted reviewer|You watch, answer each question and leave a comment.
//     844|862|1.5|1.5× speed|You press Send: the split closes, and Codex wakes with your review.
//     862|1090|20|20× speed · about four minutes|Codex takes the review in, fixes the frame, rebuilds and commits.
//     1090|1105|1.5|1.5× speed|The new version opens beside you, with the change marked.
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, launchOpts } from "../../lib/env.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const WIDTH = +opt("--width", 1100), FPS = +opt("--fps", 10), COLORS = +opt("--colors", 96);
const [REC, LIST, OUT] = args.map((a) => resolve(a));
if (!OUT) { console.error("usage: node scripts/release/terminal-review/gif.mjs <trial.mp4> <segments.txt> <out.gif> [--width 1100] [--fps 10] [--colors 96]"); process.exit(2); }
const segs = readFileSync(LIST, "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#")).map((l) => {
  const [from, to, speed, label = "", text = ""] = l.split("|");
  return { from: +from, to: +to, speed: +speed, label: label.trim(), text: text.trim() };
});

// the page: the 1920×1080 recording a little inside cream paper, its place label above it (as a video's frame has
// one), and the caption band under it, the card's bottom 40 px from the edge (captions.html)
const M = 40, TOP = 72, W = 1920 - 2 * M, VH = Math.round(W * 9 / 16), H = TOP + VH + 200;
const face = (f) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, "packages/player/fonts", f)).toString("base64")}) format("woff2")`;
const FACES = `@font-face { font-family: "EB Garamond"; src: ${face("eb-garamond-latin-wght-normal.woff2")}; font-weight: 400 800; }
@font-face { font-family: "JetBrains Mono"; src: ${face("jetbrains-mono-latin-wght-normal.woff2")}; font-weight: 100 800; }`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const paper = (s) => `<!doctype html><meta charset="utf-8"><style>${FACES}
html, body { margin: 0; width: 1920px; height: ${H}px; background: #FAF9F5; }
.label { position: absolute; left: ${M}px; top: ${TOP - 48}px; font: 500 26px/1 "JetBrains Mono"; letter-spacing: 0.06em; color: rgb(20 20 19 / 62%); }
.rec { position: absolute; left: ${M}px; top: ${TOP}px; width: ${W}px; height: ${VH}px; background: #141413;
  box-shadow: 0 0 0 1px rgb(20 20 19 / 12%), 0 1px 3px rgb(20 20 19 / 8%), 0 4px 16px rgb(20 20 19 / 4%); }
.band { position: absolute; left: 0; right: 0; bottom: 40px; display: flex; justify-content: center; }
.card { max-width: 78%; padding: 18px 40px 22px; background: #FAF9F5; border: 1px solid rgb(20 20 19 / 12%); border-radius: 12px;
  box-shadow: 0 1px 3px rgb(20 20 19 / 8%), 0 4px 16px rgb(20 20 19 / 4%);
  font: 500 46px/1.24 "EB Garamond", Georgia, serif; letter-spacing: -0.02em; color: #141413; text-align: center; }
</style><div class="label">${esc(s.label)}</div><div class="rec"></div><div class="band"><div class="card">${esc(s.text)}</div></div>`;

const T = mkdtempSync(join(tmpdir(), "rp-terminal-gif-"));
const b = await chromium.launch(launchOpts()), p = await b.newPage({ viewport: { width: 1920, height: H } });
for (const [i, s] of segs.entries()) {
  await p.setContent(paper(s), { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(T, `paper${i}.png`) });
}
await b.close();
// each stretch: cut, played at its speed, scaled into the paper's frame; kept lossless until the GIF
for (const [i, s] of segs.entries()) {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-nostdin", "-ss", String(s.from), "-t", String(s.to - s.from), "-i", REC,
    "-loop", "1", "-framerate", String(FPS), "-i", join(T, `paper${i}.png`), "-filter_complex",
    `[0:v]setpts=PTS/${s.speed},fps=${FPS},scale=${W}:${VH}:flags=lanczos[v];[1:v][v]overlay=${M}:${TOP}:shortest=1,format=rgb24`,
    "-c:v", "ffv1", join(T, `seg${i}.mkv`)], { stdio: "inherit" });
}
writeFileSync(join(T, "list.txt"), segs.map((_, i) => `file 'seg${i}.mkv'`).join("\n") + "\n");
execFileSync("ffmpeg", ["-y", "-v", "error", "-nostdin", "-f", "concat", "-safe", "0", "-i", join(T, "list.txt"), "-c", "copy", join(T, "all.mkv")], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-v", "error", "-nostdin", "-i", join(T, "all.mkv"), "-vf",
  `scale=${WIDTH}:-1:flags=lanczos,mpdecimate=hi=768:lo=320:frac=0.33,split[a][b];[a]palettegen=max_colors=${COLORS}:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`,
  "-fps_mode", "vfr", OUT], { stdio: "inherit" });
const secs = segs.reduce((n, s) => n + (s.to - s.from) / s.speed, 0);
console.log(`✓ ${OUT}: ${(statSync(OUT).size / 1e6).toFixed(1)} MB, ${secs.toFixed(1)} s, ${WIDTH}×${Math.round(WIDTH * H / 1920)}`);
rmSync(T, { recursive: true, force: true });
