#!/usr/bin/env node
// After Send: the reviewer sees the review being worked on, not a page that has gone quiet. A line above the frame
// follows the review (GET /api/review/status?id= on the local page; the row's status on the hosted one): waiting,
// working (with its step), done or stopped, with the time since Send and a quiet pulse (none under reduced motion).
// It survives closing the panel and a reload. Done with a rebuilt video (the build signature is not the one sent
// from) opens "The new version is ready": its button takes the keyboard and reloads into just the changes; Esc closes
// it. Done with no new video says so, stops asking, and goes on dismiss.
// usage: node packages/player/test/working.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs"; import { join, normalize, extname } from "node:path";
import { launchOpts, testPort, ROOT } from "../../../scripts/lib/env.mjs";
import { until, frames } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const MAP = JSON.parse(readFileSync(join(ROOT, project, "plan-map.json"), "utf8"));
const sigOf = (m) => m.changes?.at || JSON.stringify((m.frames || []).map((f) => [f.compositionId, f.start, f.end]));
const SIG = sigOf(MAP), NEW = "2099-01-01T00:00:00.000Z";
// the rebuilt video's plan map: one scene changed since the build the review was sent from
const REBUILT = { ...MAP, changes: { ...(MAP.changes || {}), at: NEW, baseline: false, changedFrames: [MAP.frames[2].index], changedSeconds: 15.4, totalSeconds: MAP.totalSeconds } };
// a static server over the repo that is also the review server: /api/review takes the review, /api/review/status
// says where it is (`status`, set by the spec), and the plan map is the rebuilt one once `rebuilt` is set
function serve(port) {
  const st = { status: { state: "waiting", by: null, build: SIG }, rebuilt: false, asked: 0, handledBy: "session" };
  const srv = createServer((req, res) => {
    const u = new URL(req.url, "http://x"), path = u.pathname, send = (code, body) => res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(body));
    if (path === "/api/review/status") { st.asked++; return u.searchParams.get("id") === "l2-test" ? send(200, { ok: true, id: "l2-test", ...st.status }) : send(404, { ok: false, error: "no such review" }); }
    if (path === "/api/review") {
      if (req.method === "GET") return send(200, { ok: true, sessionWaiting: st.handledBy === "session", agentCommand: null, inbox: 0 });
      let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => send(200, { ok: true, id: "l2-test", path: ".reelplanner/inbox/l2-test.json", duplicate: false, handledBy: st.handledBy, message: "your open session has it" }));
      return;
    }
    if (path === `/${project}/plan-map.json`) { res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(st.rebuilt ? REBUILT : MAP)); return; }
    const file = join(ROOT, normalize(decodeURIComponent(path)));
    if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) { const idx = join(file, "index.html"); if (existsSync(idx)) { res.writeHead(200, { "content-type": "text/html" }).end(readFileSync(idx, "utf8").replace(/<head>/i, '<head><meta name="reelplanning-review-server" content="1">')); return; } res.writeHead(404).end(); return; }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" }).end(readFileSync(file));
  }).listen(port, "127.0.0.1");
  return { srv, st };
}
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const b = await chromium.launch(launchOpts({ args: ["--no-sandbox"] }));
const port = testPort(8891), A = serve(port);
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}`;
const loaded = async (p) => { await p.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 }); await p.evaluate(() => document.querySelector("#rp").reachLocal()); await p.evaluate(() => { document.querySelector("#rp")._workMs = 250; }); };
async function open({ motion = "no-preference" } = {}) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: motion });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 140)));
  await p.goto(url);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} });
  await p.reload(); await loaded(p);
  return p;
}
const strip = (p) => p.evaluate(() => {
  const el = document.querySelector("#rp"), s = el.shadowRoot, box = s.querySelector(".working"), pop = s.querySelector(".wready"), dot = s.querySelector(".working .wdot i");
  return { shown: !!box && !box.hidden && box.getBoundingClientRect().height > 0, text: box?.querySelector(".wtext").textContent || "", time: box?.querySelector(".wtime").textContent || "", live: box?.dataset.live,
    btns: [...(box?.querySelectorAll(".wbtns button") || [])].map((x) => x.textContent), anim: dot ? getComputedStyle(dot).animationName : null, aria: box?.getAttribute("aria-live"),
    pop: !!pop && !pop.hidden, focus: s.activeElement?.dataset?.act || null, above: box ? box.getBoundingClientRect().bottom <= s.querySelector(".stage").getBoundingClientRect().top + 1 : false,
    saved: (() => { try { return JSON.parse(localStorage.getItem(`reelplanning:annotations:${el.src}:working`) || "null"); } catch { return null; } })() };
});
const textIs = (p, re) => until(p, (re) => new RegExp(re).test(document.querySelector("#rp").shadowRoot.querySelector(".working .wtext")?.textContent || ""), re.source);
const sendReview = async (p, verdict = null) => {
  await p.evaluate(() => { const el = document.querySelector("#rp"); el.shadowRoot.querySelector(".handoff").hidden = true; el.closePull?.(); });
  await p.locator("#rp").locator(".composer textarea").fill(`16 MB parts change the retry cost on mobile (${verdict})`);
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.composer [data-act="post"]').click());
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="finish"]').click());
  if (verdict) await p.evaluate((v) => document.querySelector("#rp").setVerdict(v), verdict);
  await until(p, () => !!document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="send-local"]'));
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="send-local"]').click());
};

// ---- a review sent, worked on, and the new version ready ----
{
  A.st.status = { state: "waiting", by: null, build: SIG };
  const p = await open();
  ok(!(await strip(p)).shown, "before Send there is no line above the frame");
  await sendReview(p, "changes");
  await textIs(p, /^Waiting for your agent to pick it up$/);
  let s = await strip(p);
  ok(s.shown && s.above && s.text === "Waiting for your agent to pick it up" && s.aria === "polite", `after Send a line above the frame says the review waits — "${s.text}"`);
  ok(/^\d+:\d\d$/.test(s.time) && s.live === "1" && s.anim === "rp-wpulse", `it shows the time since Send and a quiet pulse — "${s.time}", ${s.anim}`);
  ok(s.saved?.id === "l2-test" && s.saved.sig === SIG, "it remembers the review and the build it was sent from, beside :round");
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="handoff-close"]').click());
  ok((await strip(p)).shown, "closing the Finish panel leaves it there");
  A.st.status = { state: "working", by: "session", step: "revising step 2", since: new Date().toISOString(), build: SIG };
  await textIs(p, /working/);
  s = await strip(p);
  ok(s.text === "Your agent is working on your review — revising step 2" && s.live === "1", `it moves to working, with the step — "${s.text}"`);
  // a reload: the same review, asked about again
  await p.reload(); await loaded(p);
  await textIs(p, /working/);
  s = await strip(p);
  ok(s.shown && s.text === "Your agent is working on your review — revising step 2", `it survives a reload — "${s.text}"`);
  // the tab hidden: no asking; shown again: asked at once
  await p.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await p.waitForTimeout(300); const n0 = A.st.asked; await p.waitForTimeout(1200);
  ok(A.st.asked === n0, `with the tab hidden it stops asking — ${A.st.asked - n0} asks in 1.2 s`);
  await p.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
  await p.waitForTimeout(600);
  ok(A.st.asked > n0, `shown again, it asks again — ${A.st.asked - n0} asks`);
  // done, with the video rebuilt and served
  A.st.rebuilt = true; A.st.status = { state: "done", by: "session", build: NEW };
  await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".wready").hidden);
  await frames(p);
  s = await strip(p);
  ok(s.pop && s.text === "Done: the new version is ready" && s.live === "0" && s.btns.join() === "Watch what changed", `done with a new build: "The new version is ready" opens over the player — "${s.text}"`);
  ok(s.focus === "ready-watch", `its primary button has the keyboard — ${s.focus}`);
  const n1 = A.st.asked; await p.waitForTimeout(900);
  ok(A.st.asked === n1, "and it stops asking");
  await p.keyboard.press("Escape"); await frames(p);
  s = await strip(p);
  ok(!s.pop && s.shown && s.btns.join() === "Watch what changed", "Esc closes it (Later); the line keeps the way to the new version");
  await p.evaluate(() => document.querySelector("#rp").showReady()); await frames(p);
  await p.evaluate(() => { window.__before = 1; });
  await Promise.all([p.waitForEvent("load"), p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.wready [data-act="ready-watch"]').click())]);
  await loaded(p); await frames(p);
  const after = await p.evaluate(() => { const el = document.querySelector("#rp"); return { reloaded: window.__before === undefined, sig: el.buildSig(), only: !!el._only, revised: !el.shadowRoot.querySelector(".revised").hidden }; });
  s = await strip(p);
  ok(after.reloaded && after.sig === NEW && after.only && after.revised, `"Watch what changed" reloads into the new version, in just the changes — ${JSON.stringify(after)}`);
  ok(!s.shown && !s.saved, "and the round is over: the line is gone, and forgotten");
  await p.close();
}

// ---- done with no new video: said, no popup, no more asking, gone on dismiss ----
{
  A.st.rebuilt = false; A.st.status = { state: "waiting", by: null, build: SIG };
  const p = await open();
  await sendReview(p, "approve");
  await textIs(p, /Waiting/);
  A.st.status = { state: "done", by: "agent", build: SIG, log: ".reelplanner/inbox/runs/l2-test.log" };
  await textIs(p, /^Done/);
  let s = await strip(p);
  ok(s.text === "Done: recorded, no new video" && !s.pop && s.live === "0" && s.time === "", `done without a rebuild: no popup, the line says so — "${s.text}"`);
  const n = A.st.asked; await p.waitForTimeout(900);
  ok(A.st.asked === n, "and it stops asking");
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.working [data-act="work-dismiss"]').click());
  s = await strip(p);
  ok(!s.shown && !s.saved, "dismissed, it goes, and stays gone");
  // Request changes, marked done by a waiting session before its new video is up: it waits on for the video
  A.st.status = { state: "waiting", by: null, build: SIG };
  await sendReview(p, "changes");
  await textIs(p, /Waiting/);
  A.st.status = { state: "done", by: "session", build: SIG };
  await textIs(p, /^Recorded/);
  s = await strip(p);
  ok(s.text === "Recorded. Your agent is making the new video" && s.live === "1" && !s.pop, `changes asked for, done by the session, video not up yet: it waits on for it — "${s.text}"`);
  A.st.rebuilt = true; A.st.status = { state: "done", by: "session", build: NEW };
  await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".wready").hidden);
  ok((await strip(p)).pop, "…and opens the popup when it comes");
  A.st.rebuilt = false;
  await p.close();
}

// ---- a run that stopped short, and reduced motion ----
{
  A.st.status = { state: "waiting", by: null, build: SIG };
  const p = await open({ motion: "reduce" });
  await sendReview(p, "changes");
  await textIs(p, /Waiting/);
  let s = await strip(p);
  ok(s.anim === "none" && s.live === "1", `under reduced motion the line does not move — animation ${s.anim}`);
  A.st.status = { state: "stopped", by: "agent", build: SIG, log: ".reelplanner/inbox/runs/l2-test.log" };
  await textIs(p, /stopped/);
  s = await strip(p);
  ok(s.text === "The run stopped before it finished: its log is .reelplanner/inbox/runs/l2-test.log" && s.live === "0" && !s.pop, `stopped: the line says so, with the run's log — "${s.text}"`);
  await p.close();
}

// ---- hosted: the row's own status drives the same line ----
{
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push("page error (hosted): " + String(e).slice(0, 140)));
  await p.addInitScript(() => {
    const store = (window.__db = { docs: {}, watchers: {} });
    const doc = (path) => ({
      async set(data) { store.docs[path] = data; (store.watchers[path] || []).forEach((f) => f({ data: () => store.docs[path] })); },
      onSnapshot(next) { (store.watchers[path] ||= []).push(next); next({ data: () => store.docs[path] }); return () => {}; },
    });
    window.__mark = (patch) => { const k = Object.keys(store.docs)[0]; store.docs[k] = { ...store.docs[k], ...patch }; (store.watchers[k] || []).forEach((f) => f({ data: () => store.docs[k] })); };
    window.claude = { use: async (n) => (n === "db" ? { doc } : null) };
  });
  await p.goto(url); await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 });
  await p.evaluate(() => document.querySelector("#rp")._claudeReady);
  await p.locator("#rp").locator(".composer textarea").fill("a comment");
  await p.locator("#rp").locator('[data-act="post"]').click();
  await p.evaluate(() => { const el = document.querySelector("#rp"); el.shadowRoot.querySelector('[data-act="finish"]').click(); el.setVerdict("changes"); });
  await until(p, () => !!document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="send"]'));
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="send"]').click());
  await textIs(p, /Waiting for Claude/);
  ok((await strip(p)).text === "Waiting for Claude to pick it up", "hosted: submitted → waiting");
  await p.evaluate(() => window.__mark({ status: "working", step: "recording the review" }));
  await textIs(p, /working/);
  ok((await strip(p)).text === "Claude is working on your review — recording the review", "hosted: working, with its step");
  await p.evaluate(() => window.__mark({ status: "recorded", commit: "a1b2c3d4" }));
  await textIs(p, /^Done/);
  const s = await strip(p);
  ok(s.text === "Done — reload to watch the new version" && s.btns.join() === "Reload" && !s.pop, `hosted: recorded → done, with Reload (the page cannot see a republish coming) — "${s.text}"`);
  await p.close();
}

A.srv.close();
await b.close();
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
