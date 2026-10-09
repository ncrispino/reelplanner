#!/usr/bin/env node
// GET /api/review/status?id= on the review server (scripts/review.mjs), against a scratch repo: where one sent review
// is, read from the inbox and claim files, for the page's line after Send.
//   waiting   — in the inbox, nobody has it; `since` is when it was sent
//   working   — claimed by a waiting session, or by a headless run that is still going (`finishing up` once it
//               marked the review done but has not exited: the page is rebuilt only when it does)
//   done      — in inbox/done/; for a run the server started, after the run ended and the page was rebuilt
//   stopped   — a headless run ended without marking it done; `log` is its log
//   build     — the served video's build signature: the plan map's changes.at, so a rebuild shows as a new value
// A run left by an earlier server is judged by its pid. An unknown id is a 404, a malformed one a 400, and another
// site's page is refused.
// A repo set up with `reel init` is one with .reelplanner/decisions.json: a .reelplanner/ holding only setup files
// (.env, config.json: the hosted voice's, made before any plan) is not, so its videos' reviews download (a POST is
// a 409, and the startup line says so), `review` with no video says it is not set up, and so does `inbox --wait`.
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, hostname } from "node:os";
import { ROOT, testPort } from "../lib/env.mjs";
import { writeReview, claim, markDone } from "../lib/inbox.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (f, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = await f(); if (v) return v; await sleep(100); } return null; };

const tmp = mkdtempSync(join(tmpdir(), "reel-status-"));
const rp = join(tmp, ".reelplanner"), pd = join(rp, "plans/2026-01-01-demo"), vd = join(pd, "video");
mkdirSync(join(vd, "compositions"), { recursive: true });
writeFileSync(join(pd, "plan.md"), "# Demo\n");
writeFileSync(join(vd, "index.html"), "<!doctype html><title>demo</title>\n");
const MAP = { project: "video", title: "Demo plan", planDir: ".reelplanner/plans/2026-01-01-demo", totalSeconds: 30, decisions: [], autonomy: [], quizzes: [],
  frames: [{ index: 1, compositionId: "f1", start: 0, end: 30 }], changes: { at: "2026-01-01T00:00:00.000Z", changedFrames: [] } };
writeFileSync(join(vd, "plan-map.json"), JSON.stringify(MAP));
// the headless agent: a review whose note is "finish" is rebuilt (a new changes.at) and marked done, then the run
// lingers a moment before it exits, as a real one commits; any other note runs a moment and exits without finishing
const agent = join(tmp, "agent.mjs");
writeFileSync(agent, `import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";\nimport { dirname, basename, join } from "node:path";\n` +
  `const f = process.env.REELPLANNER_REVIEW, row = JSON.parse(readFileSync(f, "utf8"));\n` +
  `if (row.note === "finish") { const m = ${JSON.stringify(join(vd, "plan-map.json"))}; const map = JSON.parse(readFileSync(m, "utf8")); map.changes = { ...map.changes, at: "2026-02-02T00:00:00.000Z" }; writeFileSync(m, JSON.stringify(map));\n` +
  `  mkdirSync(join(dirname(f), "done"), { recursive: true }); renameSync(f, join(dirname(f), "done", basename(f))); }\n` +
  `setTimeout(() => process.exit(row.note === "finish" ? 0 : 1), 2500);\n`);
writeFileSync(join(rp, "config.json"), JSON.stringify({ agent: { command: [process.execPath, agent] } }));
writeFileSync(join(rp, "decisions.json"), JSON.stringify({ decisions: [] }));   // set up: `reel init` ran here
const row = (at, extra = {}) => ({ status: "submitted", submittedAt: at, project: "video", planDir: ".reelplanner/plans/2026-01-01-demo", title: "Demo plan", note: "", verdict: "changes",
  review: { exportedAt: at, annotations: [{ kind: "comment", t: 3, text: "clearer, please" }] }, ...extra });

const procs = [];
try {
  const srv = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), vd, "--no-open", "--no-notify", "--port", String(testPort(20000 + Math.floor(Math.random() * 10000))), "--out", join(tmp, "bundle")],
    { cwd: tmp, env: { ...process.env, REELPLANNER_HOME: join(tmp, "home"), REELPLANNER_RECHECK_MS: "1500" } });
  procs.push(srv);
  let log = ""; srv.stdout.on("data", (d) => (log += d)); srv.stderr.on("data", (d) => (log += d));
  const url = await until(() => log.match(/review page: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1], 120000);
  ok("server: starts", !!url, log);
  if (!url) throw new Error("no server");
  const status = async (id, headers = {}) => { const r = await fetch(`${url}/api/review/status?id=${encodeURIComponent(id)}`, { headers }); return { code: r.status, body: await r.json() }; };
  const post = (body) => fetch(`${url}/api/review`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());

  // ---- what it refuses ----
  ok("an unknown review is a 404", (await status("video-20990101T000000Z")).code === 404);
  ok("a malformed id is a 400 (no path in it)", (await status("../config")).code === 400 && (await status("")).code === 400);
  ok("another site's page is refused", (await status("video-20990101T000000Z", { origin: "http://evil.example" })).code === 403);
  const wrongMethod = await fetch(`${url}/api/review/status?id=x`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  ok("only GET", wrongMethod.status === 405);

  // ---- waiting → working (a session) → done, from the files alone ----
  const w = writeReview(rp, row("2026-01-02T10:00:00Z"));
  let s = (await status(w.id)).body;
  ok("in the inbox, nobody's: waiting, since it was sent", s.ok && s.state === "waiting" && s.by === null && s.since === "2026-01-02T10:00:00Z" && !("step" in s), JSON.stringify(s));
  ok("build: the served video's build signature (its plan map's changes.at)", s.build === "2026-01-01T00:00:00.000Z", JSON.stringify(s));
  claim(rp, w.id, "session");
  s = (await status(w.id)).body;
  ok("claimed by a waiting session: working, by the session, since the claim", s.state === "working" && s.by === "session" && /^\d{4}-/.test(s.since || "") && !s.log, JSON.stringify(s));
  markDone(rp, w.id);
  s = (await status(w.id)).body;
  ok("in inbox/done/: done, by the session; the build as served", s.state === "done" && s.by === "session" && s.build === "2026-01-01T00:00:00.000Z", JSON.stringify(s));

  // ---- a headless run that stops short ----
  const r1 = await post(row("2026-01-03T09:30:00Z", { note: "stop" }));
  ok("no session waiting: the server starts the run", r1.handledBy === "agent", JSON.stringify(r1));
  s = (await status(r1.id)).body;
  ok("while the run goes: working, by the agent, with its log", s.state === "working" && s.by === "agent" && s.log === `.reelplanner/inbox/runs/${r1.id}.log`, JSON.stringify(s));
  s = await until(async () => { const x = (await status(r1.id)).body; return x.state !== "working" && x; });
  ok("it ended without `inbox done`: stopped, with the run's log", s?.state === "stopped" && s.by === "agent" && s.log === `.reelplanner/inbox/runs/${r1.id}.log` && /^\d{4}-/.test(s.since || ""), JSON.stringify(s));

  // ---- a headless run that finishes: done only once it has exited and the page is rebuilt ----
  const r2 = await post(row("2026-01-04T08:00:00Z", { note: "finish" }));
  const fin = await until(async () => { const x = (await status(r2.id)).body; return x.step === "finishing up" && x; });
  ok("marked done while the run still goes: working, finishing up, the old build still served", fin?.state === "working" && fin.by === "agent" && fin.build === "2026-01-01T00:00:00.000Z", JSON.stringify(fin));
  s = await until(async () => { const x = (await status(r2.id)).body; return x.state === "done" && x; });
  ok("once it exits: done, and the build is the rebuilt video's", s?.state === "done" && s.by === "agent" && s.build === "2026-02-02T00:00:00.000Z", JSON.stringify(s));
  ok("…which is what the page now serves", JSON.parse(readFileSync(join(tmp, "bundle", "2026-01-01-demo", "plan-map.json"), "utf8")).changes.at === "2026-02-02T00:00:00.000Z");

  // ---- a run started by an earlier server: its pid says whether it still runs ----
  const w3 = writeReview(rp, row("2026-01-05T00:00:00Z"));
  writeFileSync(join(rp, "inbox", `${w3.id}.claim`), JSON.stringify({ by: "agent", pid: 1, host: hostname(), at: new Date().toISOString(), runPid: 2 ** 22 + 12345 /* no such process */, log: `.reelplanner/inbox/runs/${w3.id}.log` }) + "\n");
  s = (await status(w3.id)).body;
  ok("an earlier server's run that is gone: stopped", s.state === "stopped" && s.by === "agent", JSON.stringify(s));
  writeFileSync(join(rp, "inbox", `${w3.id}.claim`), JSON.stringify({ by: "agent", pid: 1, host: hostname(), at: new Date().toISOString(), runPid: process.pid }) + "\n");
  s = (await status(w3.id)).body;
  ok("one that still runs: working", s.state === "working" && s.by === "agent", JSON.stringify(s));
  ok("set up (decisions.json): Send files the review in the inbox", /files the review in \.reelplanner\/inbox\//.test(log), log);

  // ---- a .reelplanner/ of setup files only (no decisions.json): not set up, so the review downloads ----
  const bare = join(tmp, "bare"), bareRp = join(bare, ".reelplanner"), bv = join(bare, "videos", "demo");
  mkdirSync(bareRp, { recursive: true }); mkdirSync(join(bv, "compositions"), { recursive: true });
  writeFileSync(join(bareRp, ".env"), "REELPLANNER_TTS=openrouter\n");
  writeFileSync(join(bareRp, "config.json"), JSON.stringify({ narration: { tts: "openrouter" } }));
  writeFileSync(join(bv, "index.html"), "<!doctype html><title>demo</title>\n");
  writeFileSync(join(bv, "plan-map.json"), JSON.stringify({ ...MAP, planDir: null }));
  const env2 = { ...process.env, REELPLANNER_HOME: join(tmp, "home") };
  const srv2 = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), bv, "--no-open", "--no-notify", "--port", String(testPort(20000 + Math.floor(Math.random() * 10000), 1)), "--out", join(tmp, "bundle2")], { cwd: bare, env: env2 });
  procs.push(srv2);
  let log2 = ""; srv2.stdout.on("data", (d) => (log2 += d)); srv2.stderr.on("data", (d) => (log2 += d));
  const url2 = await until(() => log2.match(/review page: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1], 120000);
  ok("setup files only: the page is served, and Send downloads the review (no inbox)", !!url2 && /files the review in a download/.test(log2), log2);
  const p2 = url2 && await fetch(`${url2}/api/review`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(row("2026-01-06T00:00:00Z")) });
  ok("…a POST to /api/review is refused (409), saying to download it; nothing written in .reelplanner/", p2?.status === 409 && /download the review instead/.test((await p2.json()).error) && !readdirSync(bareRp).includes("inbox"), String(p2?.status));
  const run2 = (...a) => new Promise((done) => { const c = spawn(process.execPath, [join(ROOT, "bin/reelplanner.mjs"), ...a], { cwd: bare, env: env2 }); let o = ""; c.stdout.on("data", (d) => (o += d)); c.stderr.on("data", (d) => (o += d)); c.on("close", (code) => done({ code, out: o })); });
  const lib = await run2("review", "--no-open", "--no-notify");
  ok("…`review` with no video: not set up yet, pass a video folder", lib.code === 1 && /\.reelplanner is not set up yet \(no decisions\.json, only setup files\)/.test(lib.out), lib.out);
  const wait = await run2("review", "--wait", "--timeout", "1");
  ok("…`review --wait`: not set up yet, a review there downloads", wait.code === 1 && /is not set up yet .*a review there downloads/.test(wait.out), wait.out);
} catch (e) {
  failed++; console.log(`✗ ${e.stack}`);
} finally {
  for (const p of procs) try { p.kill(); } catch { /* gone */ }
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ review-status: all passed");
process.exit(failed ? 1 : 0);
