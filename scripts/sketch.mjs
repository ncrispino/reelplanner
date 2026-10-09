#!/usr/bin/env node
// Sketch how you think something works, as input for a video: draw, talk and type on one full-screen canvas, and
// the page hands what you made to the repo as one folder.
//
//   reelplanner sketch                                   by hand: type what you're explaining on the page
//   reelplanner sketch "<what you are explaining>" --once  from an agent: the question filled in, and it exits
//                                                         after Send, printing `sketch: <folder>` as its last line
//   [--port <n>] [--out <dir>] [--no-open] [--partner openrouter|local|off] [--partner-model <id>]
//
// --partner: a model that asks one short question beside the canvas when something in the picture is unclear
// (scripts/lib/sketch-partner.mjs; docs/sketch.md, "Questions while you sketch"). By default OpenRouter's
// anthropic/claude-haiku-5.5 when OPENROUTER_API_KEY is set, else a local model server's vision model, else none.
//
// The question is optional: it only fills the page's "What are you explaining?" box, which names the folder and
// heads sketch.md, and the person can change it there. An agent passes the topic from the request so the box is
// filled when the page opens. --once is for an agent: it runs the command in the background and waits for it to
// exit, then reads the folder it printed. If the page is closed without Send (after a 20 s grace, which a reload
// stays within; REELPLANNER_SKETCH_GRACE_S), or no page opens in 15 min (REELPLANNER_SKETCH_OPEN_WAIT_S), it exits 1
// with no `sketch:` line. Without --once the page stays up for another sketch until Ctrl-C.
//
// It serves the sketch page (packages/sketch/, an Excalidraw canvas) on localhost and opens it. Record, then
// draw and talk; type a note and it lands on the canvas. Finish shows what will be sent; Send saves it here:
//   .reelplanner/sketches/<date>-<slug>/   in a repo that keeps a record (reel init), else
//   videos/sketches/<date>-<slug>/          (--out <dir> to choose)
// holding:
//   sketch.md          what an agent reads first: the question, what was said with a picture at each pause, the
//                      typed notes, the final drawing as boxes and arrows, the note left at Send
//   session.json       the same, all of it on the recording's clock (format reelplanner-sketch/1; docs/sketch.md)
//   recording.webm     the canvas as it was drawn, with the voice and the pointer
//   keyframes/*.png    the canvas at each pause; final.png and final.excalidraw, the finished drawing and its scene
// The recording and pictures stay on disk and out of git (a .gitignore in sketches/ says so), as a render does;
// the text is committed. The folder is a source like any other: `reelplanner explain "<question>" <folder> <code>`.
//
// The page needs Excalidraw built once on this machine (vendor-excalidraw, run here on first use). It reads the
// microphone only while recording, and the live transcript is the browser's own (Chrome's sends audio to Google).
// With none (Firefox, or blocked), local whisper transcribes the recording after Send when whisper.cpp is here
// (scripts/lib/sketch-transcript.mjs; before the `sketch:` line with --once); `sketch-transcribe <folder>` does it
// for any sketch, later.
import { createServer } from "node:http";
import { existsSync, mkdirSync, writeFileSync, createReadStream, statSync, renameSync, rmSync } from "node:fs";
import { join, resolve, relative, normalize, extname, sep, basename } from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { platform } from "node:os";
import { Readable } from "node:stream";
import { ROOT, rpInitialized, rpDirOf, RP_COMMAND } from "./lib/env.mjs";
import { TYPES } from "./lib/static-server.mjs";
import { slugOf, repoTop } from "./lib/explainer.mjs";
import { excalidrawVendor, buildExcalidrawVendor } from "./vendor-excalidraw.mjs";
import { sketchMd, sketchTranscriber, transcribeSketch, transcriberName } from "./lib/sketch-transcript.mjs";
import { resolvePartner, askPartner, partnerLabel } from "./lib/sketch-partner.mjs";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : null; };
const die = (m) => { console.error(`✗ sketch: ${m}`); process.exit(1); };
const VALUED = new Set(["--port", "--out", "--partner", "--partner-model"]);
const question = args.filter((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1])).join(" ").trim();
const port = Number(flag("port") || 8790);
const once = args.includes("--once");

const repo = repoTop(process.cwd());
const git = (...a) => { try { return execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const rp = repo && rpDirOf(repo);
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

// the partner that asks questions while they sketch (scripts/lib/sketch-partner.mjs): OpenRouter, local, or off
let partner;
try { partner = await resolvePartner({ dir: process.cwd(), choice: flag("partner"), model: flag("partner-model") }); }
catch (e) { die(e.message); }
const PARTNER_GAP_S = Number(process.env.REELPLANNER_SKETCH_PARTNER_GAP_S ?? 20), PARTNER_MAX = 8;
const readJsonBody = (req, limit = 12e6) => new Promise((done, fail) => {
  let n = 0; const parts = [];
  req.on("data", (c) => { n += c.length; if (n > limit) { fail(new Error("too large")); req.destroy(); } else parts.push(c); });
  req.on("end", () => { try { done(JSON.parse(Buffer.concat(parts).toString("utf8"))); } catch { fail(new Error("not JSON")); } });
  req.on("error", fail);
});

// ---------- the folder a sketch is saved to, and what an agent reads first ----------
const ALLOWED = /^(session\.json|recording\.(webm|mp4)|final\.png|final\.excalidraw|keyframes\/kf-\d{3}\.png)$/;
async function save(req) {
  const form = await new Request("http://x/", { method: "POST", headers: req.headers, body: Readable.toWeb(req), duplex: "half" }).formData();
  const got = new Map();
  for (const [path, value] of form) {
    if (!ALLOWED.test(path) || typeof value === "string") throw new Error(`unexpected part: ${path}`);
    got.set(path, Buffer.from(await value.arrayBuffer()));
  }
  if (!got.has("session.json")) throw new Error("no session.json");
  const s = JSON.parse(got.get("session.json").toString("utf8"));
  if (s.format !== "reelplanner-sketch/1") throw new Error(`unknown format ${s.format}`);
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
    ? `Next: ${RP_COMMAND} explain "${(s.question || "how this works").replace(/"/g, "'")}" ${rel} <the code it is about>`
    : `Next: give your agent ${rel}/sketch.md`;
  console.log(`✓ sketch saved → ${rel}/ (${got.size} files)\n  ${next}`);
  // no live transcript: local whisper makes one from the recording, when it is here (never a hosted API unasked)
  const by = s.transcript?.source === "none" && s.recording?.has_audio && got.has(s.recording.file) ? sketchTranscriber({ dir, api: false }) : null;
  if (by && !by.kind) console.log(`  no live transcript, and ${by.why}: \`${RP_COMMAND} sketch-transcribe ${rel}\` makes one later`);
  return { ok: true, dir: rel, abs: dir, next, closing: once, transcribing: by?.kind ? transcriberName(by) : null, by };
}

async function transcribeAfterSend(r) {
  if (!r.by?.kind) return;
  console.log(`· no live transcript: transcribing the voice with ${r.transcribing} (it stays on this machine) …`);
  try { const t = await transcribeSketch(r.abs, r.by); console.log(`✓ ${t.words.length} words → ${r.dir}/sketch.md`); }
  catch (e) { console.error(`✗ sketch: could not transcribe it (${e.message}); \`${RP_COMMAND} sketch-transcribe ${r.dir}\` tries again`); }
}

// ---------- the server ----------
const json = (res, code, body) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
function serve(res, root, urlPath) {
  const file = join(root, normalize(urlPath));
  if (!file.startsWith(resolve(root) + sep) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  createReadStream(file).pipe(res);
}
// --once: the agent waiting on this command must not wait for ever. The page holds a connection open (api/sketch/live);
// when the last page goes and nothing was sent, a short grace (a reload comes back within it) and then this exits 1.
// And if no page opens at all, it gives up after a while.
const GRACE_S = Number(process.env.REELPLANNER_SKETCH_GRACE_S) || 20, OPEN_WAIT_S = Number(process.env.REELPLANNER_SKETCH_OPEN_WAIT_S) || 900;
let pages = 0, opened = false, sending = false, goneTimer = null;
function gone(why, hint = "") {
  if (sending) return;
  console.error(`✗ sketch: ${why}; nothing was saved.${hint && ` ${hint}`}`);
  process.exit(1);
}
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
  if (path === "api/sketch/context") return json(res, 200, { ok: true, question, context, saveTo: relative(process.cwd(), base) || ".",
    partner: partner.off ? null : { provider: partner.provider, model: partner.model, where: partner.where, label: partnerLabel(partner), gap_s: PARTNER_GAP_S, max: PARTNER_MAX } });
  if (path === "api/sketch/partner" && req.method === "POST") {
    if (partner.off) return json(res, 404, { ok: false, error: "no partner" });
    return readJsonBody(req).then((b) => askPartner(partner, b)).then((text) => json(res, 200, { ok: true, text }),
      (e) => { console.error(`△ sketch: the partner did not answer (${e.message})`); json(res, 502, { ok: false, error: e.message }); });
  }
  if (path === "api/sketch/live") {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store" });
    res.write(": open\n\n");
    pages++; opened = true; clearTimeout(goneTimer);
    const ping = setInterval(() => res.write(": ping\n\n"), 15000);
    req.on("close", () => {
      clearInterval(ping); pages--;
      if (once && !pages) goneTimer = setTimeout(() => gone("the page was closed without Send", "If they used Download instead, ask them for the .zip."), GRACE_S * 1000);
    });
    return;
  }
  if (path === "api/sketch" && req.method === "POST") {
    sending = true;
    return save(req).then((r) => {
      const { abs, by, ...body } = r;
      json(res, 200, body);
      // --once: the agent waiting on this command reads the last line, then carries on with the folder (and its
      // transcript, when one is made here); without it, the page stays up and the transcript follows in the background
      if (once) res.on("finish", async () => { await transcribeAfterSend(r); console.log(`sketch: ${r.dir}`); server.close(); setTimeout(() => process.exit(0), 200).unref(); });
      else res.on("finish", () => { sending = false; transcribeAfterSend(r); });
    }, (e) => {
      sending = false; console.error(`✗ sketch: ${e.message}`); json(res, 400, { ok: false, error: e.message });
      if (once && !pages) goneTimer = setTimeout(() => gone("the page was closed and its Send failed"), GRACE_S * 1000);
    });
  }
  if (path === "" || path === "index.html") return serve(res, PAGE, "index.html");
  if (path === "sketch.js") return serve(res, PAGE, "sketch.js");
  if (path.startsWith("vendor/")) return serve(res, vendor.dir, path.slice("vendor/".length));
  res.writeHead(404); res.end("not found");
});
server.on("error", (e) => die(e.code === "EADDRINUSE" ? `port ${port} is in use (--port <n> to pick another)` : e.message));
server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`✓ sketch page at ${url}\n  saving to ${relative(process.cwd(), base) || "."}/ · ${once ? "exits after Send" : "Ctrl-C to stop"}\n  questions while sketching: ${partnerLabel(partner)}`);
  if (once) setTimeout(() => { if (!opened) gone(`no page opened in ${OPEN_WAIT_S >= 60 ? `${Math.round(OPEN_WAIT_S / 60)} min` : `${OPEN_WAIT_S} s`} (${url})`); }, OPEN_WAIT_S * 1000).unref();
  if (!args.includes("--no-open")) {
    const [cmd, a] = platform() === "darwin" ? ["open", [url]] : platform() === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
    try { spawn(cmd, a, { stdio: "ignore", detached: true }).on("error", () => {}).unref(); } catch {}
  }
});
