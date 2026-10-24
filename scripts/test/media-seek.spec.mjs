#!/usr/bin/env node
// The review server serves narration a browser can seek (issue #30). Served as one 200 with no byte ranges, an
// <audio> reports nothing seekable past 0: whenever the HyperFrames runtime sets its currentTime (a seek, a start in
// the middle of a scene, a speed change, a drift fix) the clip drops to 0 and stalls there, silent, while the video's
// clock goes on, until the next scene's clip starts from its beginning.
//
// On a scratch copy of L2, through the real `reelplanner review` bundle and server:
//   the server   a voice file whole with Accept-Ranges and its length; a byte range (bounded, suffix, open-ended) as
//                206 with exactly those bytes; one past the end as 416; HEAD with no body; several ranges at once,
//                or an If-Range that does not match, as the whole file
//   the player   the clip seekable through its length; a start in the middle of a scene; 1× to 1.5× in the middle of
//                a clip, after a seek into its scene and after playing into it; pause, resume and a short rewind; a
//                rewind across into the clip before: in each, the playing clip's currentTime advances with the
//                timeline (within 0.3 s of the video's time less the clip's start), and only one clip plays
// The decision and quiz stops are cleared in the scratch copy, so the narration plays on without answering them.
//
// usage: node scripts/test/media-seek.spec.mjs
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium } from "playwright-core";
import { ROOT, testPort, serverUp, scratchCopy, launchOpts } from "../lib/env.mjs";
import { until, pageHold, still } from "../../packages/player/test/wait.mjs";

const scratch = realpathSync(mkdtempSync(join(tmpdir(), "rp-media-seek-")));
const video = join(scratch, "videos/l2-upload-resume"), bundle = join(scratch, "bundle");
scratchCopy(join(ROOT, "videos/l2-upload-resume"), video, (p) => !/\/(renders|snapshots|node_modules)$/.test(p));
execFileSync("git", ["init", "-q", scratch]);
const mapPath = join(video, "plan-map.json"), map = JSON.parse(readFileSync(mapPath, "utf8"));
for (const key of ["decisions", "autonomy", "quizzes", "chapters"]) map[key] = [];
writeFileSync(mapPath, JSON.stringify(map));
const port = testPort(8932), base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [join(ROOT, "bin/reelplanner.mjs"), "review", video, "--no-open", "--no-notify", "--port", String(port), "--out", bundle],
  { cwd: scratch, env: { ...process.env, REELPLANNER_HOME: join(scratch, "home") } });
let log = "", failed = 0, browser;
server.stdout.on("data", (s) => { log += s; }); server.stderr.on("data", (s) => { log += s; });
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; return cond; };
const response = async (url, options) => { const r = await fetch(url, options); return { status: r.status, headers: r.headers, body: Buffer.from(await r.arrayBuffer()) }; };

// the clips this uses: L2's branch 1b (64.533–70.293) and branch 1a just before it (58.496–64.533)
const VOICE = "el-07-branch-1b-voice", BEFORE = "el-06-branch-1a-voice", START = 64.533, BEFORE_START = 58.496;
try {
  await serverUp(port, { child: server, timeout: 120000 });
  const library = await (await fetch(`${base}/library.json`)).json(), slug = library.slugs[0];

  // ── the server ──
  const audioUrl = `${base}/${slug}/assets/voice/07.mp3`, bytes = readFileSync(join(bundle, slug, "assets/voice/07.mp3"));
  let r = await response(audioUrl);
  const modified = r.headers.get("last-modified");
  ok("a voice file: whole, with its length and Accept-Ranges", r.status === 200 && r.body.equals(bytes)
    && r.headers.get("content-length") === String(bytes.length) && r.headers.get("accept-ranges") === "bytes", `${r.status} ${JSON.stringify(Object.fromEntries(r.headers))}`);
  for (const [name, range, start, end] of [["a bounded", "bytes=100-199", 100, 199], ["a suffix", "bytes=-100", bytes.length - 100, bytes.length - 1], ["an open-ended", "bytes=100-", 100, bytes.length - 1]]) {
    r = await response(audioUrl, { headers: { range } });
    ok(`…${name} range: 206 with exactly those bytes`, r.status === 206 && r.body.equals(bytes.subarray(start, end + 1))
      && r.headers.get("content-range") === `bytes ${start}-${end}/${bytes.length}` && r.headers.get("content-length") === String(end - start + 1), `${r.status} ${r.headers.get("content-range")} (${r.body.length} bytes)`);
  }
  r = await response(audioUrl, { headers: { range: `bytes=${bytes.length}-` } });
  ok("…a range past the end: 416, with the file's size", r.status === 416 && r.headers.get("content-range") === `bytes */${bytes.length}` && r.body.length === 0, `${r.status} ${r.headers.get("content-range")}`);
  r = await response(audioUrl, { headers: { range: "bytes=100-999999999999999999999999999999" } });
  ok("…an end past the file: up to its last byte", r.status === 206 && r.body.equals(bytes.subarray(100)) && r.headers.get("content-range") === `bytes 100-${bytes.length - 1}/${bytes.length}`);
  r = await response(audioUrl, { headers: { range: "bytes=999999999999999999999999999999-" } });
  ok("…a start far past the file: 416", r.status === 416 && r.headers.get("content-range") === `bytes */${bytes.length}` && r.body.length === 0);
  r = await response(audioUrl, { method: "HEAD", headers: { range: "bytes=100-199" } });
  ok("…HEAD: the whole size and no body, a range or not", r.status === 200 && r.headers.get("content-length") === String(bytes.length) && !r.headers.has("content-range") && r.body.length === 0);
  r = await response(audioUrl, { headers: { range: "bytes=0-9,20-29" } });
  ok("…several ranges at once: the whole file", r.status === 200 && r.body.equals(bytes) && !r.headers.has("content-range"));
  r = await response(audioUrl, { headers: { range: "bytes=100-199", "if-range": modified } });
  ok("…If-Range with the file's Last-Modified: the range", r.status === 206 && r.body.equals(bytes.subarray(100, 200)));
  for (const validator of ["Thu, 01 Jan 1970 00:00:00 GMT", '"an-etag"']) {
    r = await response(audioUrl, { headers: { range: "bytes=100-199", "if-range": validator } });
    ok(`…If-Range with ${validator.startsWith('"') ? "an entity tag" : "an older date"}: the whole file`, r.status === 200 && r.body.equals(bytes) && !r.headers.has("content-range"));
  }
  r = await response(`${base}/?project=${encodeURIComponent(slug)}`);
  ok("the page itself: still no-store, and still marked as served by the review server", r.status === 200 && /no-store/.test(r.headers.get("cache-control") || "") && /reelplanning-review-server/.test(r.body.toString()));

  // ── the player ──
  browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } }), errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/?project=${encodeURIComponent(slug)}`);
  await page.waitForFunction(() => { const rp = document.querySelector("#rp"); return rp?.player?.ready && rp.planMap; }, null, { timeout: 60000 });
  const snapshot = (id = VOICE) => page.evaluate((id) => {
    const hp = document.querySelector("#rp").player, doc = hp.iframeElement.contentDocument, a = doc.getElementById(id);
    return { timeline: hp.currentTime, paused: hp.paused, rate: hp.playbackRate, audio: a.currentTime, audioPaused: a.paused, audioRate: a.playbackRate,
      seeking: a.seeking, duration: a.duration, start: Number(a.dataset.start), muted: a.muted, volume: a.volume,
      playing: [...doc.querySelectorAll("audio")].filter((el) => !el.paused).map((el) => el.id),
      seekable: Array.from({ length: a.seekable.length }, (_, i) => [a.seekable.start(i), a.seekable.end(i)]) };
  }, id);
  // the clip playing and in step: not paused or seeking, past `before` by `by`, and within 0.3 s of the timeline
  const advancing = (before, by = 0.25, id = VOICE) => until(page, ([before, by, id]) => {
    const hp = document.querySelector("#rp").player, a = hp.iframeElement.contentDocument.getElementById(id);
    return !hp.paused && !a.paused && !a.seeking && a.currentTime > before + by && Math.abs(a.currentTime - (hp.currentTime - Number(a.dataset.start))) < 0.3;
  }, [before, by, id], 8000);
  const inStep = (s) => !s.paused && !s.audioPaused && !s.muted && s.volume > 0 && Math.abs(s.audio - (s.timeline - s.start)) < 0.3;

  await until(page, (id) => document.querySelector("#rp").player.iframeElement.contentDocument.getElementById(id).readyState === 4, VOICE);
  let s = await snapshot();
  ok("a loaded clip is seekable through its whole length", s.seekable.some(([a, b]) => a <= 0.01 && b >= s.duration - 0.05), JSON.stringify(s));

  // a start in the middle of a scene: the clip starts where the timeline is, not at 0
  await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.start(); rp.player.seek(65); rp.player.play(); });
  await advancing(65 - START); s = await snapshot();
  const started = ok("Play from the middle of a scene (65 s): its clip plays from there, in step with the timeline", inStep(s) && s.audio > 65 - START + 0.2, JSON.stringify(s));

  // 1× to 1.5× in the middle of a clip. The runtime then syncs the clip once more, and sets its currentTime if it has
  // drifted over 20 ms from the timeline (a busy machine; it is under that here, idle): set so, it must carry on from
  // there, not drop to 0. Twice: after a seek into the scene, and played into the clip from its scene's start
  const speedUp = async (name, at) => {
    await page.evaluate(() => document.querySelector("#rp").setSpeed(1.5));
    await until(page, (t) => document.querySelector("#rp").player.currentTime > t + 1.2, at.timeline, 8000);
    const now = await snapshot();
    ok(`1× to 1.5× ${name}: the clip plays on, faster, in step with the timeline (not back at 0)`, inStep(now) && now.rate === 1.5 && now.audio > at.audio + 1
      && now.playing.length === 1 && now.playing[0] === VOICE, JSON.stringify({ at, now }));
    await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.player.pause(); rp.setSpeed(1); }); await still(page);
  };
  if (started) await speedUp("after a seek into the scene", s);
  await page.evaluate((t) => { const rp = document.querySelector("#rp"); rp.player.seek(t); rp.player.play(); }, START - 0.6);
  const into = await advancing(0, 0.6);
  const at = await snapshot();
  if (ok("played into the clip from its scene's start: it plays from 0, in step", into && inStep(at), JSON.stringify(at))) await speedUp("played into the clip", at);

  // pause, resume and a short rewind, twice
  if (started) {
    await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.player.seek(65); rp.player.play(); });
    await advancing(65 - START);
    for (let cycle = 1; cycle <= 2; cycle++) {
      await page.evaluate(() => document.querySelector("#rp").player.pause()); await still(page);
      const paused = await snapshot(); await pageHold(page, 200); s = await snapshot();
      ok(`pause ${cycle}: the timeline and the clip stay still`, s.paused && s.audioPaused && Math.abs(s.audio - paused.audio) < 0.03 && Math.abs(s.timeline - paused.timeline) < 0.04, JSON.stringify(s));
      await page.evaluate(() => document.querySelector("#rp").player.play()); await advancing(s.audio); s = await snapshot();
      ok(`resume ${cycle}: the clip plays on from where it was, in step`, inStep(s) && s.audio > paused.audio + 0.2, JSON.stringify(s));
      const rewind = await page.evaluate((id) => {
        const rp = document.querySelector("#rp"), hp = rp.player, a = hp.iframeElement.contentDocument.getElementById(id), before = a.currentTime;
        rp.seekBy(-0.5);
        return { before, landed: a.currentTime, target: hp.currentTime - Number(a.dataset.start) };
      }, VOICE);
      await advancing(rewind.target, 0.1); s = await snapshot();
      ok(`rewind ${cycle}: the clip lands earlier and plays on, in step`, rewind.landed < rewind.before - 0.25 && Math.abs(rewind.landed - rewind.target) < 0.15
        && inStep(s) && s.audio > rewind.target + 0.08, JSON.stringify({ rewind, ...s }));
    }
  }

  // a rewind across into the clip before: only that one plays, from the right place
  if (started) {
    await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.player.seek(65); rp.player.play(); });
    await advancing(65 - START);
    // the time the key is pressed at, read in the page as it is handled (not a moment later, from here)
    await page.evaluate(() => { const rp = document.querySelector("#rp"); rp.focus(); rp.addEventListener("keydown", () => { window.__rewindFrom = rp.player.currentTime; }, { once: true, capture: true }); });
    await page.keyboard.press("ArrowLeft");
    const cross = await page.evaluate(() => ({ from: window.__rewindFrom, to: document.querySelector("#rp").player.currentTime }));
    ok("← goes 5 s back, into the clip before", Math.abs(cross.from - cross.to - 5) < 0.15 && cross.to > BEFORE_START && cross.to < START, JSON.stringify(cross));
    await advancing(cross.to - BEFORE_START, 0.25, BEFORE); s = await snapshot(BEFORE);
    ok("…and only that clip plays, in step", inStep(s) && s.playing.length === 1 && s.playing[0] === BEFORE, JSON.stringify(s));
  }
  ok("no page errors", errors.length === 0, errors.join("; "));
} catch (e) { ok("the media checks ran to the end", false, `${e.stack}\n${log.slice(-3000)}`); }
finally {
  await browser?.close(); server.kill();
  await new Promise((r) => (server.exitCode != null ? r() : server.once("exit", r)));
  rmSync(scratch, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ media-seek: narration a browser can seek, in step after a seek, a speed change, a pause and a rewind");
process.exit(failed ? 1 : 0);
