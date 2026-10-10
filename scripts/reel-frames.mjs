#!/usr/bin/env node
// Play a built video into Claude Code's /reel pane (skills/plan-to-video/hooks/): the frames of its render,
// at the video's own pace, as lines a hooks module can read (its process stream carries text, not bytes).
//
// The render is the video's own, made once by HyperFrames at 12 fps (draft quality) and kept in
// <video-dir>/renders/terminal.mp4, which git leaves out.
// `--render` makes it when it is missing or older than the video's sources, printing its progress.
//
// Without --render, the stretch [--from, --to) plays: ffmpeg decodes it in real time and each frame is printed
// in the form the pane draws (--as):
//   image    a raw RGB frame written to a ring of files under --dir, for an Image (kitty, Ghostty)
//   jpeg     the frame as a small JPEG, for an Svg on a surface with no terminal (the desktop and mobile apps)
// A terminal without kitty graphics gets neither: drawn in its character cells the video is unreadable, so the
// pane opens the browser player there instead.
// and the sound plays alongside, on this machine (ffplay, or afplay on macOS), unless --no-audio.
//
// One line per event:
//   V <seconds> <cols> <rows>          the video's length and the frame size (pixels for image and jpeg)
//   P <percent>                        render progress
//   R <path>                           the render is ready
//   A <player> | A none <why>          the sound started, or why not
//   F <t> <base64>                     a frame: the JPEG's bytes
//   I <t> <path> <generation>          a frame written for an Image
//   E <t>                              the stretch ended
//   X <message>                        it failed
//
// usage: reelplanner reel-frames <video-dir> --render
//        reelplanner reel-frames <video-dir> [--from <s>] [--to <s>] [--as image|jpeg] [--width <px>] [--dir <ring-dir>]
//                                [--fps <n>] [--no-audio]
import { existsSync, statSync, readdirSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { hyperframesBin } from "./lib/env.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const VALUED = new Set(["--from", "--to", "--as", "--width", "--dir", "--fps"]);
const dirArg = args.find((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1]));
if (!dirArg || args.includes("--help")) {
  console.log("usage: reelplanner reel-frames <video-dir> --render | [--from s] [--to s] [--as image|jpeg] [--width px] [--dir d] [--fps n] [--no-audio]");
  process.exit(dirArg ? 0 : 1);
}
const say = (line) => process.stdout.write(line + "\n");
const fail = (m) => { say(`X ${m}`); process.exit(1); };
const dir = resolve(dirArg);
if (!existsSync(join(dir, "index.html"))) fail(`no built video at ${dir} (index.html is missing)`);
const mp4 = join(dir, "renders", "terminal.mp4");
const FPS = Number(flag("fps", 12));

// --- the render ----------------------------------------------------------------------------------------
// what the picture is made of: the page and its compositions and assets. The plan map, the storyboard and the
// other records beside them do not change a frame, so rewriting them (plan-map does, every build) renders nothing again.
function newest(d, depth = 0) {
  let t = 0;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (depth === 0 && !["index.html", "compositions", "assets"].includes(e.name)) continue;
    const p = join(d, e.name);
    if (e.isDirectory()) { if (depth < 4) t = Math.max(t, newest(p, depth + 1)); }
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
    if (code !== 0 || !existsSync(tmp)) {
      // a fresh clone: the narration is made by the build and left out of git, so there is no sound to mix
      if (/Source not found for audio element/.test(tail)) fail(`the video's narration is not on this machine (it is made by the build, and git leaves it out): \`reelplanner reel rebuild\` on its plan makes it again, then play`);
      fail(`the render failed (exit ${code}): ${tail.replace(/\s+/g, " ").slice(-300)}`);
    }
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
  const as = flag("as", "image");
  if (!["image", "jpeg"].includes(as)) fail(`--as ${as}: image (kitty graphics) or jpeg`);
  const total = duration(mp4);
  const from = Math.max(0, Number(flag("from", 0)));
  const to = Math.min(total, Number(flag("to", total)) || total);
  if (to <= from) { say(`E ${from}`); process.exit(0); }
  const W = Number(flag("width", as === "jpeg" ? 384 : 640)) & ~1, H = Math.round((W * 9) / 16) & ~1;
  say(`V ${total.toFixed(3)} ${W} ${H}`);

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
      const path = join(ring, `frame-${n % 8}.rgb`);
      writeFileSync(path, px);
      say(`I ${at()} ${path} ${n}`);
      n++;
    }
  });
  ff.on("exit", () => {
    say(`E ${to.toFixed(3)}`);
    if (ring && !flag("dir")) rmSync(ring, { recursive: true, force: true });
    process.exit(0);
  });
}

