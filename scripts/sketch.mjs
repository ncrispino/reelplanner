#!/usr/bin/env node
// Sketch how you think something works, as input for a video: draw, talk and type on one full-screen canvas, and
// the page hands what you made to the repo as one folder.
//
//   reelplanning sketch                                   by hand: type what you're explaining on the page
//   reelplanning sketch "<what you are explaining>" --once  from an agent: the question filled in, and it exits
//                                                         after Send, printing `sketch: <folder>` as its last line
//   [--port <n>] [--out <dir>] [--no-open]
//
// The question is optional: it only fills the page's "What are you explaining?" box, which names the folder and
// heads sketch.md, and the person can change it there. An agent passes the topic from the request so the box is
// filled when the page opens. --once is for an agent: it runs the command in the background and waits for it to
// exit, then reads the folder it printed. Without --once the page stays up for another sketch until Ctrl-C.
//
// It serves the sketch page (packages/sketch/, an Excalidraw canvas) on localhost and opens it. Record, then
// draw and talk; type a note and it lands on the canvas. Finish shows what will be sent; Send saves it here:
//   .reelplanning/sketches/<date>-<slug>/   in a repo that keeps a record (reel init), else
//   videos/sketches/<date>-<slug>/          (--out <dir> to choose)
// holding:
//   sketch.md          what an agent reads first: the question, what was said with a picture at each pause, the
//                      typed notes, the final drawing as boxes and arrows, the note left at Send
//   session.json       the same, all of it on the recording's clock (format reelplanning-sketch/1; docs/sketch.md)
//   recording.webm     the canvas as it was drawn, with the voice and the pointer
//   keyframes/*.png    the canvas at each pause; final.png and final.excalidraw, the finished drawing and its scene
// The recording and pictures stay on disk and out of git (a .gitignore in sketches/ says so), as a render does;
// the text is committed. The folder is a source like any other: `reelplanning explain "<question>" <folder> <code>`.
//
// The page needs Excalidraw built once on this machine (vendor-excalidraw, run here on first use). It reads the
// microphone only while recording, and the live transcript is the browser's own (Chrome's sends audio to Google;
// the recording keeps the audio either way, so it can be transcribed locally instead: transcribe-missing).
import { createServer } from "node:http";
import { existsSync, mkdirSync, writeFileSync, createReadStream, statSync, renameSync, rmSync } from "node:fs";
import { join, resolve, relative, normalize, extname, sep, basename } from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { platform } from "node:os";
import { Readable } from "node:stream";
import { ROOT, rpInitialized } from "./lib/env.mjs";
import { TYPES } from "./lib/static-server.mjs";
import { slugOf, repoTop } from "./lib/explainer.mjs";
import { excalidrawVendor, buildExcalidrawVendor } from "./vendor-excalidraw.mjs";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : null; };
const die = (m) => { console.error(`✗ sketch: ${m}`); process.exit(1); };
const VALUED = new Set(["--port", "--out"]);
const question = args.filter((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1])).join(" ").trim();
const port = Number(flag("port") || 8790);
const once = args.includes("--once");

const repo = repoTop(process.cwd());
const git = (...a) => { try { return execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const rp = repo && join(repo, ".reelplanning");
const base = flag("out") ? resolve(flag("out")) : repo ? (rpInitialized(rp) ? join(rp, "sketches") : join(repo, "videos", "sketches")) : resolve("sketches");
const context = {
  repoName: repo ? basename(repo) : basename(process.cwd()), repo: repo ? "." : null,
  remote: repo ? git("remote", "get-url", "origin") || null : null,
  commit: repo ? git("rev-parse", "HEAD") || null : null, branch: repo ? git("branch", "--show-current") || null : null,
  dirty: repo ? !!git("status", "--porcelain") : false,
};

let vendor = excalidrawVendor();
if (!vendor.ready) {
  try { await buildExcalidrawVendor(); vendor = excalidrawVendor(); }
  catch (e) { die(`the sketch page needs Excalidraw built once: ${e.message}`); }
}
const PAGE = join(ROOT, "packages", "sketch");

// ---------- the folder a sketch is saved to, and what an agent reads first ----------
const ALLOWED = /^(session\.json|recording\.(webm|mp4)|final\.png|final\.excalidraw|keyframes\/kf-\d{3}\.png)$/;
const mmss = (s) => s == null ? "–" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function sketchMd(s, dir) {
  const els = s.final?.elements || [], byId = new Map(els.map((e) => [e.id, e]));
  const name = (id) => { const e = byId.get(id); return e ? `"${(e.label || e.text || e.name || e.kind).replace(/\s+/g, " ")}"` : "(nothing)"; };
  const shapes = els.filter((e) => !["arrow", "line", "freedraw", "text"].includes(e.kind));
  const arrows = els.filter((e) => e.kind === "arrow");
  const texts = els.filter((e) => e.kind === "text");
  const free = els.filter((e) => e.kind === "freedraw").length;
  const lines = [
    `# Sketch: ${s.question || "(no question given)"}`, "",
    `How someone thinks this works, drawn and said on a canvas: their model, not the code's. Compare it with the code; don't treat it as true.`, "",
    `- **When:** ${s.created} · ${mmss(s.duration_s)} recorded${s.recording?.has_audio ? " with voice" : " (no voice)"}`,
    `- **Code it is about:** ${s.context?.repoName || "?"} at \`${(s.context?.commit || "no commit").slice(0, 12)}\`${s.context?.branch ? ` on \`${s.context.branch}\`` : ""}${s.context?.dirty ? " (with uncommitted changes)" : ""}`,
    `- **Files:** \`${s.recording?.file}\` (the canvas with the voice; the pointer is the orange dot), \`keyframes/\`, \`final.png\`, \`final.excalidraw\`, \`session.json\` (everything, timed)`,
    `- **Transcript:** ${s.transcript?.source === "browser-speech" ? "the browser's live speech recognition (may have errors; the audio is in the recording)" : "none made live; transcribe the recording's audio"}`,
    "",
  ];
  if (s.feedback) lines.push(`## Their note when sending`, "", `> ${s.feedback.replace(/\n/g, "\n> ")}`, "");
  lines.push(`## What they said and drew, in order`, "", `Each picture is the canvas when a thought ended; the text is what they said or typed since the one before.`, "");
  for (const k of s.keyframes || []) lines.push(`- **${mmss(k.t)}** ${k.said ? k.said : "_(drawing, nothing said)_"}${k.file ? ` → [picture](${k.file})` : ""}`);
  if (!(s.keyframes || []).length) lines.push("_(no pictures: nothing was drawn or said while recording)_");
  lines.push("", `## The final drawing`, "", s.final?.png ? `![final drawing](final.png)` : "_(empty canvas)_", "");
  if (shapes.length) { lines.push(`**Boxes and shapes**`, ""); for (const e of shapes) lines.push(`- ${e.kind}${e.label ? ` "${e.label.replace(/\s+/g, " ")}"` : " (no label)"}`); lines.push(""); }
  if (arrows.length) { lines.push(`**Arrows**`, ""); for (const a of arrows) lines.push(`- ${name(a.from)} → ${name(a.to)}${a.label ? ` (labeled "${a.label.replace(/\s+/g, " ")}")` : ""}`); lines.push(""); }
  if (texts.length) { lines.push(`**Text on the canvas**`, ""); for (const t of texts) lines.push(`- "${t.text.replace(/\s+/g, " ")}"`); lines.push(""); }
  if (free) lines.push(`Plus ${free} freehand stroke${free === 1 ? "" : "s"}: see the pictures.`, "");
  if ((s.notes || []).length) { lines.push(`## Typed notes`, ""); for (const n of s.notes) lines.push(`- **${mmss(n.t)}** ${n.text}`); lines.push(""); }
  if (s.before_recording) lines.push(`_${s.before_recording} element${s.before_recording === 1 ? " was" : "s were"} drawn before recording started._`, "");
  return lines.join("\n");
}

async function save(req) {
  const form = await new Request("http://x/", { method: "POST", headers: req.headers, body: Readable.toWeb(req), duplex: "half" }).formData();
  const got = new Map();
  for (const [path, value] of form) {
    if (!ALLOWED.test(path) || typeof value === "string") throw new Error(`unexpected part: ${path}`);
    got.set(path, Buffer.from(await value.arrayBuffer()));
  }
  if (!got.has("session.json")) throw new Error("no session.json");
  const s = JSON.parse(got.get("session.json").toString("utf8"));
  if (s.format !== "reelplanning-sketch/1") throw new Error(`unknown format ${s.format}`);
  const date = new Date().toLocaleDateString("en-CA"); // this machine's day, as yyyy-mm-dd
  const slug = slugOf(s.question || "sketch").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "sketch";
  let name = `${date}-${slug}`; for (let i = 2; existsSync(join(base, name)); i++) name = `${date}-${slug}-${i}`;
  const dir = join(base, name);
  mkdirSync(join(dir, "keyframes"), { recursive: true });
  for (const [path, buf] of got) writeFileSync(join(dir, path), buf);
  // a browser's recording has no duration or seek index in it; copied once by ffmpeg (no re-encode) it has both,
  // so a player or a model can jump to a moment. Without ffmpeg it stays as recorded, which still plays.
  const rec = [...got.keys()].find((p) => p.startsWith("recording."));
  if (rec) try {
    const tmp = join(dir, `.fixed${extname(rec)}`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", join(dir, rec), "-c", "copy", tmp], { stdio: "ignore", timeout: 120000 });
    renameSync(tmp, join(dir, rec));
  } catch { rmSync(join(dir, `.fixed${extname(rec)}`), { force: true }); }
  writeFileSync(join(dir, "sketch.md"), sketchMd(s, dir));
  const ignore = join(base, ".gitignore");
  if (!existsSync(ignore)) writeFileSync(ignore, "# a sketch's text is committed; its recording and pictures stay on disk, as a render does\n*/recording.*\n*/keyframes/\n*/final.png\n");
  const rel = relative(process.cwd(), dir) || ".";
  const next = rpInitialized(rp)
    ? `Next: reelplanning explain "${(s.question || "how this works").replace(/"/g, "'")}" ${rel} <the code it is about>`
    : `Next: give your agent ${rel}/sketch.md`;
  console.log(`✓ sketch saved → ${rel}/ (${got.size} files)\n  ${next}`);
  return { ok: true, dir: rel, next, closing: once };
}

// ---------- the server ----------
const json = (res, code, body) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
function serve(res, root, urlPath) {
  const file = join(root, normalize(urlPath));
  if (!file.startsWith(resolve(root) + sep) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  createReadStream(file).pipe(res);
}
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
  if (path === "api/sketch/context") return json(res, 200, { ok: true, question, context, saveTo: relative(process.cwd(), base) || "." });
  if (path === "api/sketch" && req.method === "POST") return save(req).then((r) => {
    json(res, 200, r);
    // --once: the agent waiting on this command reads the last line, then carries on with the folder
    if (once) res.on("finish", () => { console.log(`sketch: ${r.dir}`); server.close(); setTimeout(() => process.exit(0), 200).unref(); });
  }, (e) => { console.error(`✗ sketch: ${e.message}`); json(res, 400, { ok: false, error: e.message }); });
  if (path === "" || path === "index.html") return serve(res, PAGE, "index.html");
  if (path === "sketch.js") return serve(res, PAGE, "sketch.js");
  if (path.startsWith("vendor/")) return serve(res, vendor.dir, path.slice("vendor/".length));
  res.writeHead(404); res.end("not found");
});
server.on("error", (e) => die(e.code === "EADDRINUSE" ? `port ${port} is in use (--port <n> to pick another)` : e.message));
server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`✓ sketch page at ${url}\n  saving to ${relative(process.cwd(), base) || "."}/ · Ctrl-C to stop`);
  if (!args.includes("--no-open")) {
    const [cmd, a] = platform() === "darwin" ? ["open", [url]] : platform() === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
    try { spawn(cmd, a, { stdio: "ignore", detached: true }).on("error", () => {}).unref(); } catch {}
  }
});
