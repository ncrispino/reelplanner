#!/usr/bin/env node
// Play a built video into Claude Code's /reel pane (skills/plan-to-video/hooks/): the frames of its render,
// at the video's own pace, as lines a hooks module can read (its process stream carries text, not bytes).
//
// The render is the video's own, made once by HyperFrames at 12 fps (draft quality: the terminal shows a few
// dozen pixels across, or a kitty picture) and kept in <video-dir>/renders/terminal.mp4, which git leaves out.
// `--render` makes it when it is missing or older than the video's sources, printing its progress.
//
// Without --render, the stretch [--from, --to) plays: ffmpeg decodes it in real time and each frame is printed
// in the form the pane draws (--as):
//   raster   cells for a Raster: each cell a block element over four pixels (2 × 2), the two colors that fit
//            them best as its foreground and background, so a cell draws a quarter, a half, a diagonal or
//            three quarters (--cols × --rows cells from a frame of 2·cols × 2·rows pixels; every truecolor
//            terminal). --blocks half draws one '▀' per two pixels instead (cols × 2·rows).
//   image    a raw RGB frame written to a ring of files under --dir, for an Image (kitty, Ghostty)
//   jpeg     the frame as a small JPEG, for an Svg on a surface with no terminal (the desktop and mobile apps)
// and the sound plays alongside, on this machine (ffplay, or afplay on macOS), unless --no-audio.
//
// One line per event:
//   V <seconds> <cols> <rows>          the video's length and the frame size (pixels for image and jpeg)
//   P <percent>                        render progress
//   R <path>                           the render is ready
//   A <player> | A none <why>          the sound started, or why not
//   F <t> <base64>                     a frame (raster cells, or the JPEG's bytes)
//   I <t> <path> <generation>          a frame written for an Image
//   E <t>                              the stretch ended
//   X <message>                        it failed
//
// usage: reelplanner reel-frames <video-dir> --render
//        reelplanner reel-frames <video-dir> [--from <s>] [--to <s>] [--as raster|image|jpeg] [--cols <n>] [--rows <n>]
//                                [--width <px>] [--dir <ring-dir>] [--fps <n>] [--no-audio]
import { existsSync, statSync, readdirSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { hyperframesBin } from "./lib/env.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const VALUED = new Set(["--from", "--to", "--as", "--cols", "--rows", "--width", "--dir", "--fps", "--blocks"]);
const dirArg = args.find((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1]));
if (!dirArg || args.includes("--help")) {
  console.log("usage: reelplanner reel-frames <video-dir> --render | [--from s] [--to s] [--as raster|image|jpeg] [--cols n] [--rows n] [--width px] [--dir d] [--fps n] [--no-audio]");
  process.exit(dirArg ? 0 : 1);
}
const say = (line) => process.stdout.write(line + "\n");
const fail = (m) => { say(`X ${m}`); process.exit(1); };
const dir = resolve(dirArg);
if (!existsSync(join(dir, "index.html"))) fail(`no built video at ${dir} (index.html is missing)`);
const mp4 = join(dir, "renders", "terminal.mp4");
const FPS = Number(flag("fps", 12));

// --- the render ----------------------------------------------------------------------------------------
function newest(d, depth = 0) {
  let t = 0;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (["renders", "snapshots", "node_modules", ".hyperframes", "fresh-eyes", ".producer", ".debug"].includes(e.name)) continue;
    const p = join(d, e.name);
    if (e.isDirectory()) { if (depth < 3) t = Math.max(t, newest(p, depth + 1)); }
    else t = Math.max(t, statSync(p).mtimeMs);
  }
  return t;
}
const fresh = () => existsSync(mp4) && statSync(mp4).mtimeMs >= newest(dir);

if (args.includes("--render")) {
  if (fresh()) { say(`R ${mp4}`); process.exit(0); }
  mkdirSync(join(dir, "renders"), { recursive: true });
  const tmp = join(dir, "renders", "terminal.part.mp4");
  const child = spawn(process.execPath, [hyperframesBin(), "render", dir, "--fps", String(FPS), "--quality", "draft", "-o", tmp], { stdio: ["ignore", "pipe", "pipe"] });
  let last = -1, tail = "";
  const read = (b) => {
    const s = b.toString();
    tail = (tail + s).slice(-2000);
    for (const m of s.matchAll(/(\d{1,3})%/g)) { const p = Number(m[1]); if (p !== last && p <= 100) { last = p; say(`P ${p}`); } }
  };
  child.stdout.on("data", read); child.stderr.on("data", read);
  child.on("exit", (code) => {
    if (code !== 0 || !existsSync(tmp)) fail(`the render failed (exit ${code}): ${tail.replace(/\s+/g, " ").slice(-300)}`);
    spawnSync("mv", [tmp, mp4]);
    say(`R ${mp4}`);
    process.exit(0);
  });
} else {
  play();
}

// --- playing a stretch ---------------------------------------------------------------------------------
function duration(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  return Number(r.stdout.trim()) || 0;
}

function play() {
  if (!existsSync(mp4)) fail(`no render yet: run reelplanner reel-frames ${dirArg} --render`);
  const as = flag("as", "raster");
  const total = duration(mp4);
  const from = Math.max(0, Number(flag("from", 0)));
  const to = Math.min(total, Number(flag("to", total)) || total);
  if (to <= from) { say(`E ${from}`); process.exit(0); }
  let W, H;
  const quad = flag("blocks", "quad") !== "half";
  const cols = Number(flag("cols", 64)), rows = Number(flag("rows", 18));
  if (as === "raster") { W = quad ? 2 * cols : cols; H = 2 * rows; }
  else { W = Number(flag("width", as === "jpeg" ? 384 : 640)) & ~1; H = Math.round((W * 9) / 16) & ~1; }
  say(as === "raster" ? `V ${total.toFixed(3)} ${cols} ${rows}` : `V ${total.toFixed(3)} ${W} ${H}`);

  const children = [];
  const stop = () => { for (const c of children) { try { c.kill("SIGTERM"); } catch { /* gone */ } } };
  for (const s of ["SIGTERM", "SIGINT", "SIGHUP"]) process.on(s, () => { stop(); process.exit(0); });
  process.stdout.on("error", () => { stop(); process.exit(0); }); // the pane stopped reading

  // the sound: a child that also watches this process, so it never plays on after the pane stopped it
  if (!args.includes("--no-audio")) {
    const len = (to - from).toFixed(3);
    let cmd = null;
    if (spawnSync("sh", ["-c", "command -v ffplay"]).status === 0) {
      cmd = `ffplay -nodisp -autoexit -loglevel quiet -vn -ss ${from} -t ${len} '${mp4}'`;
    } else if (spawnSync("sh", ["-c", "command -v afplay"]).status === 0) {
      const cut = join(mkdtempSync(join(tmpdir(), "reel-audio-")), "a.m4a");
      spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(from), "-t", len, "-i", mp4, "-vn", "-c:a", "aac", cut]);
      cmd = `afplay '${cut}'; rm -rf '${join(cut, "..")}'`;
    }
    if (cmd) {
      const watch = `(${cmd}) & p=$!; while kill -0 ${process.pid} 2>/dev/null && kill -0 $p 2>/dev/null; do sleep 0.3; done; kill $p 2>/dev/null`;
      children.push(spawn("sh", ["-c", watch], { stdio: "ignore" }));
      say(`A ${cmd.split(" ")[0]}`);
    } else say("A none no audio player (ffplay or afplay) on this machine");
  }

  const vf = `fps=${FPS},scale=${W}:${H}:flags=area`;
  const out = as === "jpeg" ? ["-f", "image2pipe", "-c:v", "mjpeg", "-q:v", "7", "pipe:1"] : ["-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"];
  const ff = spawn("ffmpeg", ["-loglevel", "error", "-re", "-ss", String(from), "-i", mp4, "-t", String(to - from), "-an", "-vf", vf, ...out], { stdio: ["ignore", "pipe", "inherit"] });
  children.push(ff);

  const frameBytes = W * H * 3;
  const ring = as === "image" ? resolve(flag("dir", mkdtempSync(join(tmpdir(), "reel-frames-")))) : null;
  if (ring) mkdirSync(ring, { recursive: true });
  let buf = Buffer.alloc(0), n = 0;
  const at = () => (from + n / FPS).toFixed(3);
  ff.stdout.on("data", (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    if (as === "jpeg") {
      // split the MJPEG stream at each image's end marker
      let end;
      while ((end = buf.indexOf(Buffer.from([0xff, 0xd9]))) >= 0) {
        const jpg = buf.subarray(0, end + 2);
        buf = buf.subarray(end + 2);
        say(`F ${at()} ${jpg.toString("base64")}`);
        n++;
      }
      return;
    }
    while (buf.length >= frameBytes) {
      const px = buf.subarray(0, frameBytes);
      buf = buf.subarray(frameBytes);
      if (as === "raster") say(`F ${at()} ${quad ? quadCells(px, cols, rows) : cells(px, cols, rows)}`);
      else {
        const path = join(ring, `frame-${n % 8}.rgb`);
        writeFileSync(path, px);
        say(`I ${at()} ${path} ${n}`);
      }
      n++;
    }
  });
  ff.on("exit", () => {
    say(`E ${to.toFixed(3)}`);
    if (ring && !flag("dir")) rmSync(ring, { recursive: true, force: true });
    process.exit(0);
  });
}

/** Raster cells: [codePoint, foreground, background] little-endian u32s, one '▀' per two pixels upright. */
function cells(px, cols, rows) {
  const words = new Uint32Array(cols * rows * 3);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const top = ((2 * y) * cols + x) * 3, bottom = ((2 * y + 1) * cols + x) * 3, i = (y * cols + x) * 3;
      words[i] = 0x2580;
      words[i + 1] = (px[top] << 16) | (px[top + 1] << 8) | px[top + 2];
      words[i + 2] = (px[bottom] << 16) | (px[bottom + 1] << 8) | px[bottom + 2];
    }
  }
  return Buffer.from(words.buffer).toString("base64");
}

// The block element for each set of lit quarters (bit 0 upper left, 1 upper right, 2 lower left, 3 lower right).
const QUADS = [0x20, 0x2598, 0x259d, 0x2580, 0x2596, 0x258c, 0x259e, 0x259b, 0x2597, 0x259a, 0x2590, 0x259c, 0x2584, 0x2599, 0x259f, 0x2588];

/** Raster cells of 2 × 2 pixels: for each cell, the split of its four pixels into two colors with the least error. */
function quadCells(px, cols, rows) {
  const W = cols * 2;
  const words = new Uint32Array(cols * rows * 3);
  const p = [0, 0, 0, 0].map(() => [0, 0, 0]);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (let k = 0; k < 4; k++) {
        const o = ((2 * y + (k >> 1)) * W + 2 * x + (k & 1)) * 3;
        p[k][0] = px[o]; p[k][1] = px[o + 1]; p[k][2] = px[o + 2];
      }
      let best = Infinity, bestMask = 0, fg = [0, 0, 0], bg = [0, 0, 0];
      // masks 0..7 are enough: mask m and 15 - m are the same split with the colors swapped
      for (let m = 0; m < 8; m++) {
        const a = [0, 0, 0], b = [0, 0, 0];
        let na = 0, nb = 0;
        for (let k = 0; k < 4; k++) {
          const t = (m >> k) & 1 ? a : b;
          t[0] += p[k][0]; t[1] += p[k][1]; t[2] += p[k][2];
          if ((m >> k) & 1) na++; else nb++;
        }
        if (na) { a[0] /= na; a[1] /= na; a[2] /= na; }
        if (nb) { b[0] /= nb; b[1] /= nb; b[2] /= nb; }
        let err = 0;
        for (let k = 0; k < 4; k++) {
          const t = (m >> k) & 1 ? a : b;
          err += (p[k][0] - t[0]) ** 2 + (p[k][1] - t[1]) ** 2 + (p[k][2] - t[2]) ** 2;
        }
        if (err < best) { best = err; bestMask = m; fg = a; bg = b; }
      }
      const i = (y * cols + x) * 3;
      const rgb = (c) => (Math.round(c[0]) << 16) | (Math.round(c[1]) << 8) | Math.round(c[2]);
      // mask 0 is one color for the whole cell: a space on it
      words[i] = QUADS[bestMask];
      words[i + 1] = bestMask ? rgb(fg) : 0x01000000;
      words[i + 2] = rgb(bg);
    }
  }
  return Buffer.from(words.buffer).toString("base64");
}
