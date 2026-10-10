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
// A repo set up with `reel init` is one with .reelplanner/decisions.json, and its reviews land in its .reelplanner/inbox/
// (never in the machine's). One that is not (one video, the skill's level 1: no .reelplanner/ at all, or one holding
// only setup files, the hosted voice's .env and config.json) still takes Send: the review lands in this machine's
// ~/.reelplanner/inbox/<repo-key>/ (REELPLANNER_HOME here), nothing is added to the repo, `review --wait` there picks it
// up (waiting, or sent while it waits), `inbox done` finishes it, and the status line follows it. `review` with no
// video still says the repo is not set up. Once `reel init` sets the repo up, a review left in the machine's inbox is
// named by `inbox` and finished by `inbox done`, and `--wait` never takes it: nothing is lost or handled twice.
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, existsSync, realpathSync } from "node:fs";
import { join, dirname, basename, sep } from "node:path";
import { tmpdir, hostname, homedir } from "node:os";
import { ROOT, testPort } from "../lib/env.mjs";
import { writeReview, claim, markDone, repoKey } from "../lib/inbox.mjs";

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
  const home = join(tmp, "home"), machine = (repo) => join(home, "inbox", repoKey(repo));
  // a machine inbox's path as a line and a response show it (from ~ when it is under your home folder)
  const tilde = (p) => p.startsWith(homedir() + sep) ? `~${p.slice(homedir().length)}` : p;
  ok("…and nothing in this machine's inbox: a set-up repo uses its own", !existsSync(join(home, "inbox")), existsSync(join(home, "inbox")) ? readdirSync(join(home, "inbox")).join() : "");

  // ---- one video (level 1): no .reelplanner/ at all, so Send lands in this machine's inbox and nothing in the repo ----
  // (its own folder, outside the set-up repo above, whose .reelplanner/ it would otherwise be found under; a git repo)
  const env2 = { ...process.env, REELPLANNER_HOME: home };
  const plain = join(mkdtempSync(join(tmpdir(), "reel-status-plain-")), "plain"), pv = join(plain, "videos", "demo");
  mkdirSync(join(pv, "compositions"), { recursive: true }); execFileSync("git", ["-C", plain, "init", "-q"]);
  writeFileSync(join(pv, "index.html"), "<!doctype html><title>demo</title>\n");
  writeFileSync(join(pv, "plan-map.json"), JSON.stringify({ ...MAP, project: "demo", planDir: null }));
  procs.push({ kill: () => rmSync(dirname(plain), { recursive: true, force: true }) });
  const box = machine(plain);
  ok("level 1: the repo's name in the machine's inbox is its folder's and a short hash of where it is", /^plain-[0-9a-f]{8}$/.test(basename(box)) && repoKey(join(plain, "videos", "..")) === basename(box), box);
  const srv2 = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), pv, "--no-open", "--no-notify", "--port", String(testPort(20000 + Math.floor(Math.random() * 10000), 1)), "--out", join(tmp, "bundle2")], { cwd: plain, env: env2 });
  procs.push(srv2);
  let log2 = ""; srv2.stdout.on("data", (d) => (log2 += d)); srv2.stderr.on("data", (d) => (log2 += d));
  const url2 = await until(() => log2.match(/review page: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1], 120000);
  ok("level 1: the page is served, and Send files the review in this machine's inbox for the repo", !!url2 && log2.includes(`files the review in ${tilde(box)}/ (this machine's folder: the repo has no set-up .reelplanner/, and nothing is added to it)`), log2);
  if (!url2) throw new Error("no level-1 server");
  const api2 = `${url2}/api/review`, post2 = (body) => fetch(api2, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => ({ code: r.status, body: await r.json() }));
  const status2 = async (id) => (await (await fetch(`${url2}/api/review/status?id=${encodeURIComponent(id)}`)).json());
  const g2 = await (await fetch(api2)).json();
  ok("level 1: GET /api/review answers (Send is offered): kept on this machine, no session waiting, no agent command", g2.ok === true && g2.where === "machine" && g2.sessionWaiting === false && g2.agentCommand === null && g2.unsandboxed === null, JSON.stringify(g2));
  const lrow = (at) => row(at, { project: "demo", planDir: null });
  const p1 = await post2(lrow("2026-01-06T00:00:00Z"));
  ok("level 1: a posted review lands in the machine's inbox; no session waiting → saved there, said plainly", p1.code === 200 && p1.body.handledBy === "inbox" && p1.body.path === tilde(join(box, "demo-20260106T000000Z.json"))
    && /saved on this machine, not in the repo; tell your agent it's sent/.test(p1.body.message) && existsSync(join(box, "demo-20260106T000000Z.json")), JSON.stringify(p1.body));
  ok("level 1: nothing was added to the repo (no .reelplanner/)", !existsSync(join(plain, ".reelplanner")) && readdirSync(plain).sort().join() === ".git,videos", readdirSync(plain).join());
  ok("level 1: the status line follows it: waiting", (await status2(p1.body.id)).state === "waiting");
  const run2 = (cwd, ...a) => new Promise((done) => { const c = spawn(process.execPath, [join(ROOT, "bin/reelplanner.mjs"), ...a], { cwd, env: env2 }); let o = "", e = ""; c.stdout.on("data", (d) => (o += d)); c.stderr.on("data", (d) => (e += d)); c.on("close", (code) => done({ code, out: o, err: e })); });
  const same = (a, b) => { try { return realpathSync(a) === realpathSync(b); } catch { return false; } };
  const w1 = await run2(plain, "review", "--wait", "--timeout", "20");
  ok("level 1: `review --wait` picks up the review waiting there, prints its path and exits 0", w1.code === 0 && same(w1.out.trim(), join(box, `${p1.body.id}.json`)) && /waiting for a review in .*this machine's folder/.test(w1.err), JSON.stringify(w1));
  ok("…claimed by the session: working", (await status2(p1.body.id)).state === "working");
  // one sent while a session waits: it has it at once
  const waiting = run2(plain, "review", "--wait", "--timeout", "30");
  ok("level 1: the server sees the waiting session", !!(await until(async () => (await (await fetch(api2)).json()).sessionWaiting)));
  const p2 = await post2(lrow("2026-01-07T00:00:00Z"));
  const w2 = await waiting;
  ok("level 1: a review sent while `review --wait` runs is the session's, and --wait exits with its path", p2.body.handledBy === "session" && w2.code === 0 && same(w2.out.trim(), join(box, `${p2.body.id}.json`)), JSON.stringify({ p2: p2.body, w2 }));
  const d1 = await run2(plain, "inbox", "done", p1.body.id);
  ok("level 1: `inbox done` moves it to done/, and the status line says done", d1.code === 0 && existsSync(join(box, "done", `${p1.body.id}.json`)) && (await status2(p1.body.id)).state === "done", d1.out + d1.err);
  const ls = await run2(plain, "inbox");
  ok("level 1: `inbox` lists the machine's inbox for the repo", ls.code === 0 && ls.out.includes(`1 review(s) in ${tilde(box)}/ (this machine's folder`) && ls.out.includes(`${p2.body.id}.json`), ls.out);
  ok("level 1: still nothing in the repo", !existsSync(join(plain, ".reelplanner")));
  srv2.kill();

  // ---- a .reelplanner/ of setup files only (no decisions.json) is not set up either: the same, and nothing written in it ----
  const bare = join(tmp, "bare"), bareRp = join(bare, ".reelplanner"), bv = join(bare, "videos", "demo");
  mkdirSync(bareRp, { recursive: true }); mkdirSync(join(bv, "compositions"), { recursive: true });
  writeFileSync(join(bareRp, ".env"), "REELPLANNER_TTS=openrouter\n");
  writeFileSync(join(bareRp, "config.json"), JSON.stringify({ narration: { tts: "openrouter" } }));
  writeFileSync(join(bv, "index.html"), "<!doctype html><title>demo</title>\n");
  writeFileSync(join(bv, "plan-map.json"), JSON.stringify({ ...MAP, project: "demo", planDir: null }));
  const srv3 = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), bv, "--no-open", "--no-notify", "--port", String(testPort(20000 + Math.floor(Math.random() * 10000), 2)), "--out", join(tmp, "bundle3")], { cwd: bare, env: env2 });
  procs.push(srv3);
  let log3 = ""; srv3.stdout.on("data", (d) => (log3 += d)); srv3.stderr.on("data", (d) => (log3 += d));
  const url3 = await until(() => log3.match(/review page: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1], 120000);
  const bbox = machine(bare);
  ok("setup files only: Send files the review in this machine's inbox for the repo", !!url3 && log3.includes(`files the review in ${tilde(bbox)}/`), log3);
  const p3 = url3 && await fetch(`${url3}/api/review`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(row("2026-01-08T00:00:00Z", { project: "demo", planDir: null })) }).then((r) => r.json());
  ok("…a posted review lands there; nothing written in .reelplanner/", p3?.handledBy === "inbox" && existsSync(join(bbox, `${p3.id}.json`)) && readdirSync(bareRp).sort().join() === ".env,config.json", JSON.stringify(p3) + " " + readdirSync(bareRp).join());
  const lib = await run2(bare, "review", "--no-open", "--no-notify");
  ok("…`review` with no video: not set up yet, pass a video folder", lib.code === 1 && /\.reelplanner is not set up yet \(no decisions\.json, only setup files\)/.test(lib.out + lib.err), lib.out + lib.err);
  srv3.kill();
  // `reel init` sets it up later: its own inbox from then on; the review left in the machine's is named, never taken
  writeFileSync(join(bareRp, "decisions.json"), JSON.stringify({ decisions: [] }));
  const wInit = await run2(bare, "review", "--wait", "--timeout", "1");
  ok("set up later: `review --wait` waits on .reelplanner/inbox/ and does not take the review left in the machine's", wInit.code === 2 && existsSync(join(bbox, `${p3.id}.json`)) && !existsSync(join(bbox, `${p3.id}.claim`)) && /waiting for a review in \.reelplanner\/inbox\//.test(wInit.err), JSON.stringify(wInit));
  const lsInit = await run2(bare, "inbox");
  ok("…`inbox` names it, where it is", /△ 1 review\(s\) sent before `reel init`/.test(lsInit.out) && lsInit.out.includes(`${p3.id}.json`), lsInit.out);
  const dInit = await run2(bare, "inbox", "done", p3.id);
  ok("…and `inbox done` finishes it there, once", dInit.code === 0 && existsSync(join(bbox, "done", `${p3.id}.json`)) && !/sent before/.test((await run2(bare, "inbox")).out), dInit.out + dInit.err);
} catch (e) {
  failed++; console.log(`✗ ${e.stack}`);
} finally {
  for (const p of procs) try { p.kill(); } catch { /* gone */ }
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ review-status: all passed");
process.exit(failed ? 1 : 0);
