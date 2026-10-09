#!/usr/bin/env node
// A question is a stop however late the page's ticks come. On a slow or busy machine the page can go seconds without
// a tick, and the video's clock (the wall's) runs on meanwhile: the next tick lands seconds past the question. The
// video must still stop on it, back at its time, never sail past it. Here the page is held busy for seconds (its main
// thread, which the frame's runtime shares) just after Play, as a loaded machine holds it:
//   - a quick check, a choice, a call and a grouped call each stop the video, at their time, after a 5 s hold
//   - a hold across two questions stops on the first; at 2× too
//   - what is not playing across is as before: a seek past a question (the timeline's jump, or a seek and Play, a tick
//     from the old place arriving after it)
//     lands where it was sent and plays on, and with quick checks off the video plays on past one
// The `npm run test:full` failure this guards: answer-on-frame's band-in unit, under the full run's load, "playing into
// 149.17: no question came up" (the player only counted a crossing between two ticks less than 3 s apart).
// usage: node packages/player/test/stall.spec.mjs
import { chromium } from "playwright-core";
import { launchOpts, testPort, serverUp, staticServer } from "../../../scripts/lib/env.mjs";
import { until, seeked, still, movedOn, now } from "./wait.mjs";
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };

const PLAN = ".reelplanner/plans/2026-09-24-answer-on-the-video/video";
const WALK = ".reelplanner/plans/2026-09-22-m3-revise-loop/walkthrough-video";
const port = testPort(8903);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());

async function open(project) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push(`page error (${project}): ` + String(e).slice(0, 160)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`); await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el._mapTried && el.stage?.dataset.ready; }, null, { timeout: 90000 });
  const pts = await p.evaluate(() => document.querySelector("#rp").points().map((x) => ({ kind: x.kind, id: x.q.id, at: x.q.at })).sort((a, b) => a.at - b.at));
  return { p, pts, pt: (id) => pts.find((x) => x.id === id) };
}
const look = (p) => p.evaluate(() => { const el = document.querySelector("#rp"); return { pending: el.pendingId(), paused: el.player.paused, t: +el.player.currentTime.toFixed(2) }; });
// put away whatever is up, and stop the video
const clear = (p) => p.evaluate(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); });
// From `lead` s before `at`, press Play; once the video is moving, `then` (the hold, or a seek) runs on the page
async function playFrom(p, at, then, lead = 1.2) {
  await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, at - lead);
  await seeked(p, at - lead); await still(p);
  const t0 = await now(p);
  await p.locator("#rp").locator('[data-act="play"]').click();
  await movedOn(p, t0);
  await then();
}
// the page's main thread held busy for ms, as a loaded machine holds it (the frame's runtime is on it too)
const hold = (p, ms) => p.evaluate((ms) => { const s = performance.now(); while (performance.now() - s < ms); }, ms);
// played into `pt` with a hold of ms on the way: it stops there, at its time
async function stopsAfterHold(P, pt, ms, why = "") {
  await playFrom(P.p, pt.at, () => hold(P.p, ms));
  await until(P.p, () => !!document.querySelector("#rp").pendingId(), null, 8000);
  const s = await look(P.p);
  ok(s.pending === pt.id && s.paused && Math.abs(s.t - pt.at) < 0.15, `${pt.kind} ${pt.id} (${pt.at} s): the page held ${ms / 1000} s just after Play${why}, and the video still stops on it, back at its time — ${JSON.stringify(s)}`);
  await clear(P.p);
}

try {
  // ---- this plan's video: quick checks and a choice
  let P = await open(PLAN);
  await stopsAfterHold(P, P.pt("k1"), 5000);
  await stopsAfterHold(P, P.pt("q1"), 5000);
  // one hold across two questions: the first stops it (k1 at 79.0, k2 8 s on)
  await stopsAfterHold(P, P.pt("k1"), 11000, `, long enough to cross ${P.pt("k2").id} too: the first one met`);
  // at 2× the clock runs twice as fast, and so may the playhead
  await P.p.evaluate(() => document.querySelector("#rp").setSpeed(2));
  await stopsAfterHold(P, P.pt("k3"), 3000, " at 2×");
  await P.p.evaluate(() => document.querySelector("#rp").setSpeed(1));

  // a seek past questions while playing is not playing across them: it lands where it was sent and plays on
  const k1 = P.pt("k1"), k2 = P.pt("k2");
  for (const how of ["the timeline's jump", "a seek and Play"]) {
    // and a tick from the old place still on its way after the seek (as the runtime's can be) does not make it one
    await playFrom(P.p, k1.at, () => P.p.evaluate(([jump, t]) => { const el = document.querySelector("#rp"), old = el.player.currentTime;
      if (jump) el.jump(t); else { el.player.seek(t); el.player.play(); }
      el.player.dispatchEvent(new CustomEvent("timeupdate", { detail: { currentTime: old } })); }, [how.includes("jump"), k2.at + 1.5]), 3);
    await until(P.p, (t) => { const el = document.querySelector("#rp"); return el.pendingId() || (!el.player.paused && el.player.currentTime > t); }, k2.at + 2.5);
    const s = await look(P.p);
    ok(!s.pending && !s.paused && s.t > k2.at + 2.4, `${how} from before ${k1.id} to past ${k2.id}, while playing: it lands there and plays on, stopping on neither — ${JSON.stringify(s)}`);
    await clear(P.p);
  }
  // quick checks off: the reviewer chose to play past them, and a hold does not change that
  await P.p.evaluate(() => document.querySelector("#rp").setChecks(false));
  await playFrom(P.p, k1.at, () => hold(P.p, 4000));
  await until(P.p, (t) => { const el = document.querySelector("#rp"); return el.pendingId() || (!el.player.paused && el.player.currentTime > t); }, k1.at + 4);
  let s = await look(P.p);
  ok(!s.pending && !s.paused && s.t > k1.at + 3.9, `quick checks off: a hold across ${k1.id} plays on past it, as without one — ${JSON.stringify(s)}`);
  await clear(P.p);
  await P.p.evaluate(() => document.querySelector("#rp").setChecks(true));
  await P.p.close();

  // ---- the walkthrough: a call, and a grouped call
  P = await open(WALK);
  await stopsAfterHold(P, P.pts.find((x) => x.kind === "call"), 5000);
  await stopsAfterHold(P, P.pts.find((x) => x.kind === "group"), 5000);
  await P.p.close();
} catch (e) { fails.push("threw: " + String(e?.stack || e).slice(0, 400)); console.log(e); }
finally { await b.close(); srv.kill(); }
console.log(fails.length ? `✗ ${fails.length} failed` : "✓ stall: all passed");
process.exit(fails.length ? 1 : 0);
