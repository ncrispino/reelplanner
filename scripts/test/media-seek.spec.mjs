#!/usr/bin/env node
// The production review server must serve seekable narration. A fully buffered MP3 served chunked
// with no byte ranges can report seekable=[0,0]: seeks land at zero while the video's clock advances.
// Exercise the real CLI bundle/server and the shipped MP3, then rewind, pause and resume its player.
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium } from "playwright-core";
import { ROOT, testPort, serverUp, scratchCopy, launchOpts } from "../lib/env.mjs";
import { until, pageHold, still } from "../../packages/player/test/wait.mjs";

const scratch = realpathSync(mkdtempSync(join(tmpdir(), "reel-media-seek-")));
const video = join(scratch, "videos/l2-upload-resume"), bundle = join(scratch, "bundle");
scratchCopy(join(ROOT, "videos/l2-upload-resume"), video);
execFileSync("git", ["init", "-q", scratch]);
// Review questions are independent of seeking. Clear their stops only in this scratch copy so the
// branch narration can play continuously without answering choices or changing the owner's record.
const mapPath = join(video, "plan-map.json"), map = JSON.parse(readFileSync(mapPath, "utf8"));
for (const key of ["decisions", "autonomy", "quizzes", "chapters"]) map[key] = [];
writeFileSync(mapPath, JSON.stringify(map));
const port = testPort(8932), base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [join(ROOT, "bin/reelplanner.mjs"), "review", video,
  "--no-open", "--no-notify", "--port", String(port), "--out", bundle],
{ cwd: scratch, env: { ...process.env, REELPLANNER_HOME: join(scratch, "home") } });
let log = "", failed = 0, browser;
server.stdout.on("data", (s) => { log += s; }); server.stderr.on("data", (s) => { log += s; });
const check = (name, yes, detail = "") => { console.log(`${yes ? "✓" : "✗"} ${name}${!yes && detail ? ` — ${detail}` : ""}`); if (!yes) failed++; return yes; };
const response = async (url, options) => { const r = await fetch(url, options); return { status: r.status, headers: r.headers, body: Buffer.from(await r.arrayBuffer()) }; };
try {
  await serverUp(port, { child: server, timeout: 120000 });
  const library = await (await fetch(`${base}/library.json`)).json(), slug = library.slugs[0];
  const audioUrl = `${base}/${slug}/assets/voice/07.mp3`, bytes = readFileSync(join(bundle, slug, "assets/voice/07.mp3"));
  let r = await response(audioUrl);
  const modified = r.headers.get("last-modified");
  check("production MP3: complete bytes with a length and byte-range support", r.status === 200 && r.body.equals(bytes)
    && r.headers.get("content-length") === String(bytes.length) && r.headers.get("accept-ranges") === "bytes", `${r.status} ${JSON.stringify(Object.fromEntries(r.headers))}`);
  for (const [name, range, start, end] of [["bounded", "bytes=100-199", 100, 199], ["suffix", "bytes=-100", bytes.length - 100, bytes.length - 1], ["open ended", "bytes=100-", 100, bytes.length - 1]]) {
    r = await response(audioUrl, { headers: { range } });
    check(`${name} range: 206 and the exact requested bytes`, r.status === 206 && r.body.equals(bytes.subarray(start, end + 1))
      && r.headers.get("content-range") === `bytes ${start}-${end}/${bytes.length}` && r.headers.get("content-length") === String(end - start + 1), `${r.status} ${r.headers.get("content-range")} (${r.body.length} bytes)`);
  }
  r = await response(audioUrl, { headers: { range: `bytes=${bytes.length}-` } });
  check("out-of-file range: 416 with the full file size", r.status === 416 && r.headers.get("content-range") === `bytes */${bytes.length}` && r.body.length === 0, `${r.status} ${r.headers.get("content-range")}`);
  r = await response(audioUrl, { method: "HEAD" });
  check("HEAD: full size and no body", r.status === 200 && r.headers.get("content-length") === String(bytes.length) && r.body.length === 0);
  r = await response(audioUrl, { method: "HEAD", headers: { range: "bytes=100-199" } });
  check("HEAD ignores Range and returns the full size without a body", r.status === 200 && r.headers.get("content-length") === String(bytes.length) && !r.headers.has("content-range") && r.body.length === 0);
  r = await response(audioUrl, { headers: { range: "bytes=0-9,20-29" } });
  check("unsupported multiple ranges: ordinary full response", r.status === 200 && r.body.equals(bytes) && !r.headers.has("content-range"));
  r = await response(audioUrl, { headers: { range: "bytes=100-199", "if-range": modified } });
  check("If-Range matching Last-Modified retains the partial response", r.status === 206 && r.body.equals(bytes.subarray(100, 200)) && r.headers.get("content-range") === `bytes 100-199/${bytes.length}`);
  for (const validator of ["Thu, 01 Jan 1970 00:00:00 GMT", '"unrecognized-etag"']) {
    r = await response(audioUrl, { headers: { range: "bytes=100-199", "if-range": validator } });
    check(`If-Range ${validator.startsWith('"') ? "wrong entity tag" : "stale date"} returns the full file`, r.status === 200 && r.body.equals(bytes) && !r.headers.has("content-range"));
  }
  r = await response(audioUrl, { headers: { range: "bytes=100-999999999999999999999999999999" } });
  check("an oversized range end is clamped to the file's last byte", r.status === 206 && r.body.equals(bytes.subarray(100)) && r.headers.get("content-range") === `bytes 100-${bytes.length - 1}/${bytes.length}`);
  r = await response(audioUrl, { headers: { range: "bytes=999999999999999999999999999999-" } });
  check("an enormous out-of-file start returns 416 without rounding", r.status === 416 && r.headers.get("content-range") === `bytes */${bytes.length}` && r.body.length === 0);

  browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } }), errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/?project=${encodeURIComponent(slug)}`);
  await page.waitForFunction(() => { const rp = document.querySelector("#rp"); return rp?.player?.ready && rp.planMap; }, null, { timeout: 60000 });
  const snapshot = (id = "el-07-branch-1b-voice") => page.evaluate((id) => {
    const hp = document.querySelector("#rp").player, doc = hp.iframeElement.contentDocument, a = doc.getElementById(id);
    return { timeline: hp.currentTime, paused: hp.paused, audio: a.currentTime, audioPaused: a.paused, seeking: a.seeking,
      duration: a.duration, start: Number(a.dataset.start), muted: a.muted, volume: a.volume, owner: hp._audioOwner,
      playing: [...doc.querySelectorAll("audio")].filter((el) => !el.paused).map((el) => el.id),
      seekable: Array.from({ length: a.seekable.length }, (_, i) => [a.seekable.start(i), a.seekable.end(i)]) };
  }, id);
  await until(page, () => { const a = document.querySelector("#rp").player.iframeElement.contentDocument.getElementById("el-07-branch-1b-voice"); return a.readyState === 4; });
  let s = await snapshot();
  check("fully loaded branch MP3 is seekable through its duration", s.seekable.some(([start, end]) => start <= 0.01 && end >= s.duration - 0.05), JSON.stringify(s));
  await page.evaluate(() => { const hp = document.querySelector("#rp").player; hp.seek(65); const a = hp.iframeElement.contentDocument.getElementById("el-07-branch-1b-voice"); a.currentTime = 2; });
  await until(page, () => !document.querySelector("#rp").player.iframeElement.contentDocument.getElementById("el-07-branch-1b-voice").seeking);
  await pageHold(page, 150); s = await snapshot();
  check("seeking the branch MP3 to two seconds stays there", Math.abs(s.audio - 2) < 0.1, JSON.stringify(s));

  const advancing = async (before, by = 0.25, id = "el-07-branch-1b-voice") => until(page, ([before, by, id]) => {
    const hp = document.querySelector("#rp").player, a = hp.iframeElement.contentDocument.getElementById(id);
    return !hp.paused && !a.paused && !a.seeking && a.currentTime > before + by && Math.abs(a.currentTime - (hp.currentTime - Number(a.dataset.start))) < 0.3;
  }, [before, by, id], 5000);
  await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.start(); rp.player.seek(65); rp.player.play(); });
  await advancing(65 - 64.533); s = await snapshot();
  const started = check("Play at timeline 65: actual branch narration advances in sync", !s.paused && !s.audioPaused && !s.muted && s.volume > 0
    && s.audio > 0.7 && Math.abs(s.audio - (s.timeline - s.start)) < 0.3, JSON.stringify(s));
  if (started) for (let cycle = 1; cycle <= 2; cycle++) {
    await page.evaluate(() => document.querySelector("#rp").player.pause()); await still(page);
    const paused = await snapshot(); await pageHold(page, 200); s = await snapshot();
    check(`pause ${cycle}: timeline and narration stay still`, s.paused && s.audioPaused && Math.abs(s.audio - paused.audio) < 0.03 && Math.abs(s.timeline - paused.timeline) < 0.04, JSON.stringify(s));
    await page.evaluate(() => document.querySelector("#rp").player.play()); await advancing(s.audio); s = await snapshot();
    check(`resume ${cycle}: narration advances with the timeline`, !s.paused && !s.audioPaused && s.audio > paused.audio + 0.2 && Math.abs(s.audio - (s.timeline - s.start)) < 0.3, JSON.stringify(s));
    const rewind = await page.evaluate(() => {
      const rp = document.querySelector("#rp"), hp = rp.player, a = hp.iframeElement.contentDocument.getElementById("el-07-branch-1b-voice"), before = a.currentTime;
      rp.seekBy(-0.5);
      return { before, landed: a.currentTime, target: hp.currentTime - Number(a.dataset.start) };
    });
    await advancing(rewind.target, 0.1); s = await snapshot();
    check(`rewind ${cycle}: narration lands earlier and continues in sync`, rewind.landed < rewind.before - 0.25 && Math.abs(rewind.landed - rewind.target) < 0.15
      && !s.paused && !s.audioPaused && s.audio > rewind.target + 0.08 && Math.abs(s.audio - (s.timeline - s.start)) < 0.3, JSON.stringify({ rewind, ...s }));
  }
  if (started) {
    const priorVoice = "el-06-branch-1a-voice";
    await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.player.seek(65); rp.player.play(); });
    await advancing(65 - 64.533);
    // Capture at the key event, before the real player's shortcut handles it: test-process scheduling
    // between evaluate() and press() must not turn an exact five-second jump into a timing assertion.
    await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.focus(); rp.addEventListener("keydown", () => { window.__mediaRewindFrom = rp.player.currentTime; }, { once: true, capture: true }); });
    await page.keyboard.press("ArrowLeft");
    const cross = await page.evaluate(() => ({ from: window.__mediaRewindFrom, to: document.querySelector("#rp").player.currentTime }));
    check("ArrowLeft moves five seconds back across the narration boundary", Math.abs(cross.from - cross.to - 5) < 0.15 && cross.to > 58.496 && cross.to < 64.533, JSON.stringify(cross));
    await advancing(cross.to - 58.496, 0.25, priorVoice); s = await snapshot(priorVoice);
    check("cross-clip rewind plays only the earlier voice in sync", !s.paused && !s.audioPaused && !s.muted && s.volume > 0 && s.playing.length === 1 && s.playing[0] === priorVoice
      && Math.abs(s.audio - (s.timeline - s.start)) < 0.3, JSON.stringify(s));
    await page.evaluate(() => document.querySelector("#rp").player.pause()); await still(page);
    const paused = await snapshot(priorVoice); await pageHold(page, 200); s = await snapshot(priorVoice);
    check("pause after crossing clips stops every voice", s.paused && s.playing.length === 0 && Math.abs(s.audio - paused.audio) < 0.03, JSON.stringify(s));
    await page.evaluate(() => document.querySelector("#rp").player.play()); await advancing(s.audio, 0.25, priorVoice); s = await snapshot(priorVoice);
    check("resume after crossing clips advances only the earlier voice", !s.paused && !s.audioPaused && s.audio > paused.audio + 0.2 && s.playing.length === 1 && s.playing[0] === priorVoice
      && Math.abs(s.audio - (s.timeline - s.start)) < 0.3, JSON.stringify(s));
  }
  check("production review playback has no page errors", errors.length === 0, errors.join("; "));
} catch (e) { check("media seek regression completes", false, `${e.stack}\n${log.slice(-3000)}`); }
finally { await browser?.close(); server.kill(); await new Promise((r) => server.exitCode != null ? r() : server.once("exit", r)); rmSync(scratch, { recursive: true, force: true }); }
console.log(failed ? `\n${failed} failing` : "\nall media seek checks passed");
process.exit(failed ? 1 : 0);
