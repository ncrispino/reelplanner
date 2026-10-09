#!/usr/bin/env node
// Open a built video in the review player, from any repo, and leave it running.
//
// It packs the player and the project(s) with bundle-player.mjs, serves the folder on localhost and
// opens the browser: what the agent runs, in the background, the moment a video is ready.
//
// It is also where a local review comes back (plan step 3). Finish opens a panel that says what will happen (from GET /api/review), and its Send POSTs the review row to
// `/api/review`; the server writes it into the repo's .reelplanning/inbox/ and then:
//   - a main session is waiting (`reelplanning review --wait` running as one of its background
//     tasks, which keeps a heartbeat in the inbox): that command claims the review, prints its path
//     and exits, and the session wakes;
//   - no session is waiting: the server claims it and starts the repo's headless agent command
//     (`agent.command` in .reelplanning/config.json: `claude -p`, `codex exec`, `opencode run`) on it;
//   - no command either: it waits in the inbox for the next session to pick up.
// When a headless run it started exits, the server tells the reviewer: it rebuilds its page and sends
// "ready" if the run finished the review (`inbox done`), or says the run stopped short. The run cannot
// do that itself: in Claude Code's sandbox (D-082) its shell has its own network and process
// namespaces, so it can neither see nor reach this server, and `review --detach` from inside such a
// run (REELPLANNING_REVIEW set) only says so.
// Where that command turns on a sandbox that cannot run on this machine (checked once, without a model:
// scripts/lib/sandbox.mjs), the run goes ahead without it (the owner's call on A18: do more rather than
// hold back): the sandbox is turned off in the command's --settings, auto mode, --permission-prompts
// and the hook that keeps file writes in the repo stay. The server says so once when it starts (and
// `--detach` repeats it), notifies the reviewer once, at the first such run, and GET /api/review
// carries it for the Finish panel (`unsandboxed`).
// Another agent's command (codex exec, opencode run) is never probed: it starts as it is.
// A review is claimed exactly once (scripts/lib/inbox.mjs), so one review never starts two runs.
// Once the page is up it also sends the "video ready" notification (scripts/lib/notify.mjs).
// Each video named on the command line has its version kept first, so `reel rebuild` can build it again once the video
// has moved on (scripts/lib/versions.mjs): the files the repo leaves out that nothing makes again, in .reelplanning/media/.
//
// The server has to outlive the session that started it: "no session is open" (the laptop was
// closed, the session ended) is the case a headless run is for, and a server started as one of the
// session's own background tasks dies with it. `--detach` starts it in its own process group, logging
// to .reelplanning/inbox/server.log, records it in .reelplanning/inbox/.server.json ({ pid, port, url,
// … }), prints the URL and returns. A second `--detach` reuses the running server: it bundles the
// videos asked for into that server's folder (it serves from disk, so a rebuilt video is current) and
// prints the URL; there is one server per repo. `--stop` stops it.
//
// usage: reelplanning review [<video-dir> …] [--out <dir>] [--port <n>] [--no-open] [--no-notify] [--detach]
//        reelplanning review --stop                     stop the detached server
//        reelplanning review --wait [--timeout <s>]     wait for a review to land (see `inbox`)
//   <video-dir>   a built project (has index.html), relative to YOUR working directory. With none,
//                 the whole repo: its system video, every plan's video and walkthrough video, and every
//                 explainer, under a library that lists every plan and how far it has got. Or a folder
//                 bundle-player already packed (a PR's video branch, video/pr-<n>, cloned beside the
//                 PR's checkout; the contributing plan, D-215): served as it is, nothing rebuilt or
//                 packed again, and Send lands in the inbox of the repo you run it in. Each of its
//                 videos' plan map is compared with the checkout's, and a difference is said: the
//                 video was built from another version of the plan.
//   --out         where to put the bundle (default: <tmp>/reelplanning-review/<first project>)
//   --port        first port to try (default 8787; the next free one is used)
//   --no-open     print the URL, don't launch a browser
//   --no-notify   don't send the "video ready" notification
//   --detach      run the server on its own, past this session; reuse it when one is running
//
// POST /api/review   a review row as JSON → { ok, id, path, duplicate, handledBy: session|agent|inbox, message }
// POST /api/ask      a question asked on the page (Ask about this) → { ok, id, handledBy: session|review, message }
// GET  /api/ask?id=  { ok, answered, answer?, from? }: the waiting session's answer, once it has written it
// GET  /api/review   { sessionWaiting, agentCommand, unsandboxed, inbox, known }: what Send will do, shown when Finish opens the panel;
//                    `known`, what ~/.reelplanning/you.jsonl says you know ({ looked: [word keys], watched: [videos] }, D-218)
// GET  /api/review/status?id=   { ok, id, state: waiting|working|done|stopped, by: session|agent|null, step?, since, build, log? }:
//                    where one sent review is, for the page's strip after Send. Read from the inbox and claim files (and, for
//                    a headless run this server started, from that run's end), nothing the agent writes for it. `build` is
//                    the build signature of the review's video as served here (its plan map's changes.at, else its frames,
//                    as the player's buildSig()), so the page can tell a rebuilt video from the one it was sent from
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync, openSync, closeSync, unlinkSync } from "node:fs";
import { resolve, join, dirname, basename, extname, normalize, relative } from "node:path";
import { tmpdir, platform, hostname } from "node:os";
import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ROOT, repoRoot, rpInitialized, hasRp, realPath } from "./lib/env.mjs";
import { notify, waitingLine, readPlanMap, splitCommand } from "./lib/notify.mjs";
import { sandboxProblem, unsandboxedNote } from "./lib/sandbox.mjs";
import { rowProblem, writeReview, liveWaiters, startAgent, claimOf, readConfig, listInbox, writeQuestion, readQuestion } from "./lib/inbox.mjs";
import { readYou, youKnows, pendingPath, repoName } from "./lib/memory.mjs";
import { keepVersion, keepLines } from "./lib/versions.mjs";

const args = process.argv.slice(2);
// the waiting half: no server, no bundle — wait on the inbox and exit with the review's path
if (args.includes("--wait")) { const { main } = await import("./inbox.mjs"); process.exit(await main(args)); }
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const valued = new Set(["--out", "--port", "--timeout", "--repo"]);
// each by where it really is, as the working directory and git name it, so a path shown relative to here, or
// written relative to the repo, never climbs out through a link (macOS's /var/… for /private/var/…)
const projects = args.filter((a, i) => !a.startsWith("--") && !valued.has(args[i - 1])).map((p) => realPath(p));

// ---------- the detached server: .reelplanning/inbox/.server.json ----------
// a repo's .reelplanning/ once `reel init` set it up (its decisions.json): a folder of setup files only (the hosted
// voice's .env and config.json) has no record to file a review in, so the review downloads instead
const findRp = (from) => { const r = join(repoRoot(from), ".reelplanning"); return rpInitialized(r) ? r : null; };
const serverFile = (r) => join(r, "inbox", ".server.json");
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };
// the recorded server, when its process is alive and its endpoint answers. Its first answer can wait on the
// sandbox probe (up to 10 s, scripts/lib/sandbox.mjs), so it gets 15 s: given less, a busy machine made a second
// `--detach` take a live server for a dead one and start another beside it
async function runningServer(r) {
  let s; try { s = JSON.parse(readFileSync(serverFile(r), "utf8")); } catch { return null; }
  if (!s?.pid || !alive(s.pid)) return null;
  try { const res = await fetch(new URL("api/review", s.base), { signal: AbortSignal.timeout(15000) }); if (res.ok && (await res.json()).ok) return s; } catch {}
  return null;
}
if (args.includes("--stop")) {
  const r = findRp(projects[0] || process.cwd());
  if (!r) { console.error("✗ no .reelplanning/ here or above"); process.exit(1); }
  // only a process that answers as this repo's review server is stopped: a recorded pid may since
  // have gone to something else
  const s = await runningServer(r);
  if (!s) { try { unlinkSync(serverFile(r)); } catch {} console.log("· no review server running"); process.exit(0); }
  try { process.kill(s.pid, "SIGTERM"); } catch {}
  for (let i = 0; i < 50 && alive(s.pid); i++) await new Promise((ok) => setTimeout(ok, 100));
  if (alive(s.pid)) try { process.kill(s.pid, "SIGKILL"); } catch {}
  try { unlinkSync(serverFile(r)); } catch {}
  console.log(`✓ stopped the review server (pid ${s.pid}, ${s.base})`);
  process.exit(0);
}
let rp = null;
if (!projects.length) {
  // the whole repo: find its .reelplanning/ and every built video in it
  let setupOnly = null;
  // (the nearest .reelplanning/ is this repo's: one of setup files only stops the search, never a parent's past it)
  for (let d = process.cwd(), i = 0; i < 8 && !rp && !setupOnly; i++, d = dirname(d)) if (hasRp(d)) { if (rpInitialized(join(d, ".reelplanning"))) rp = join(d, ".reelplanning"); else setupOnly = join(d, ".reelplanning"); }
  if (!rp) { console.error(setupOnly ? `✗ ${relative(process.cwd(), setupOnly) || setupOnly} is not set up yet (no decisions.json, only setup files): no library to open — pass a video folder: reelplanning review <video-dir>` : "✗ no .reelplanning/ here or above — pass a video folder: reelplanning review <video-dir>"); process.exit(1); }
  const built = (d) => existsSync(join(d, "index.html"));
  if (built(join(rp, "system-video"))) projects.push(join(rp, "system-video"));
  const plans = existsSync(join(rp, "plans")) ? readdirSync(join(rp, "plans")).sort().reverse() : [];
  for (const p of plans) for (const v of ["video", "walkthrough-video"]) if (built(join(rp, "plans", p, v))) projects.push(join(rp, "plans", p, v));
  // explainers (explain-first step 2): each built one, a row of its own kind on the page
  const exps = existsSync(join(rp, "explainers")) ? readdirSync(join(rp, "explainers")).sort().reverse() : [];
  for (const e of exps) if (built(join(rp, "explainers", e, "video"))) projects.push(join(rp, "explainers", e, "video"));
  if (!projects.length) { console.error(`✗ ${rp} has no built videos yet (${plans.length} plan(s)) — ask your agent for a plan, or load the plan-to-video skill (/plan-to-video in Claude Code, $plan-to-video in Codex)`); process.exit(1); }
}
for (const p of projects) if (!existsSync(join(p, "index.html"))) { console.error(`✗ ${p}: no index.html (build the video first)`); process.exit(1); }

// A folder bundle-player packed (its library.json and the player beside it): served as it is. It is not
// in the repo it reviews (a clone of the PR's video branch), so a review lands in the repo run from.
const packedDir = projects.length === 1 && existsSync(join(projects[0], "library.json")) && existsSync(join(projects[0], "reelplanning-player.js")) ? projects[0] : null;
if (!packedDir && projects.some((p) => existsSync(join(p, "library.json")) && existsSync(join(p, "reelplanning-player.js")))) { console.error("✗ a packed folder is served on its own: pass it alone"); process.exit(1); }

// where a review submitted on this page lands: the repo the videos belong to
const RP = rp || findRp(packedDir ? process.cwd() : projects[0]);
if (packedDir) {
  // each video's plan map against the checkout's: the same, or built from another version of the plan
  // (a video carried only for "Before you watch", one the packed videos build on, is not checked: it is not this PR's)
  let slugs = []; try { const lib = JSON.parse(readFileSync(join(packedDir, "library.json"), "utf8")); slugs = (lib.slugs || []).filter((s) => !(lib.carried || []).includes(s)); } catch {}
  const mine = (slug) => RP && (slug === "system" ? join(RP, "system-video", "plan-map.json") : join(RP, "plans", slug.replace(/--walkthrough$/, ""), /--walkthrough$/.test(slug) ? "walkthrough-video" : "video", "plan-map.json"));
  const same = (a, b) => { try { return JSON.stringify(JSON.parse(readFileSync(a, "utf8"))) === JSON.stringify(JSON.parse(readFileSync(b, "utf8"))); } catch { return false; } };
  console.log(`· ${relative(process.cwd(), packedDir) || "."}: packed already (${slugs.length} video${slugs.length === 1 ? "" : "s"}), served as it is`);
  for (const slug of slugs) {
    const theirs = join(packedDir, slug, "plan-map.json"), ours = mine(slug);
    if (!ours || !existsSync(ours)) console.log(`△ ${slug}: this checkout has no ${ours ? relative(process.cwd(), ours) : "plan map for it"}: run this in the PR's checkout, so the video is checked against its plan and Send lands in its inbox`);
    else if (!existsSync(theirs)) console.log(`△ ${slug}: the packed video carries no plan map to compare`);
    else if (same(theirs, ours)) console.log(`✓ ${slug}: its plan map is the checkout's ${relative(process.cwd(), ours)}`);
    else console.log(`△ ${slug}: its plan map is not the checkout's ${relative(process.cwd(), ours)}: this video was built from another version of the plan (the PR's branch moved on, or the video's branch is older); ask for a rebuild before trusting it`);
  }
}

// The version opened, kept for `reel rebuild` (scripts/lib/versions.mjs): each video named here (the library opens
// every video, and keeps none), once per build; a video it cannot keep is no reason to stop the page.
if (!packedDir && !rp && !process.env.REELPLANNING_REVIEW_DETACHED) for (const p of projects) {
  try { for (const l of keepLines(keepVersion(p, { by: "review" }))) console.log(l); }
  catch (e) { console.log(`△ ${relative(process.cwd(), p) || "."}: its version not kept for \`reel rebuild\` (${e.message})`); }
}

const bundle = (dir) => packedDir ? undefined : execFileSync(process.execPath, [join(ROOT, "scripts", "bundle-player.mjs"), dir, ...projects, ...(rp ? ["--reelplanning", rp] : [])], { stdio: ["ignore", "inherit", "inherit"] });
// one video: open it; the whole repo: open on the library
const pageUrl = (base, dir) => rp ? base : `${base}?project=${encodeURIComponent(JSON.parse(readFileSync(join(dir, "library.json"), "utf8")).slugs[0])}`;
const announce = (url) => {
  // A video was just built and its page is up: say so, with what is waiting. (The library, opened on
  // demand, is not news.) It never fails the page: a missing notifier is only a line on stdout.
  if (!rp && !args.includes("--no-notify")) {
    const map = readPlanMap(projects[0]);
    notify({ title: map?.title || basename(projects[0]), line: map ? waitingLine(map) : "", url }).then((r) => { if (!r.shown) console.log(`  (no desktop notification: ${r.error || r.via})`); });
  }
  if (!args.includes("--no-open")) {
    const [cmd, cmdArgs] = platform() === "darwin" ? ["open", [url]] : platform() === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
    try { spawn(cmd, cmdArgs, { stdio: "ignore", detached: true }).on("error", () => console.log("  (no browser to open here — open the URL yourself)")).unref(); }
    catch { console.log("  (no browser to open here — open the URL yourself)"); }
  }
};

if (args.includes("--detach")) {
  if (process.env.REELPLANNING_REVIEW) {
    // a headless run the review server started: in a sandbox it would not find that server and would
    // start a second one that dies with the command. The server notifies when this run exits.
    console.log("· started by the review server on a review: when this run exits, that server rebuilds its page and tells the reviewer");
    process.exit(0);
  }
  if (!RP) { console.error(`✗ --detach needs the videos to be in a repo set up with \`reel init\` (.reelplanning/decisions.json; it records the server there); run \`reelplanning review\` without it`); process.exit(1); }
  const running = await runningServer(RP);
  if (running && packedDir) { console.error(`✗ the review server already running (pid ${running.pid}) serves its own folder; a packed folder needs a server of its own: \`reelplanning review --stop\`, then this again (or run it without --detach)`); process.exit(1); }
  if (running) {
    // one server per repo: put these videos in the folder it serves, and point at them
    bundle(running.out);
    const url = pageUrl(running.base, running.out);
    console.log(`✓ review page: ${url}`);
    console.log(`  (the review server already running, pid ${running.pid}; \`reelplanning review --stop\` stops it)`);
    if (running.unsandboxed) console.log(running.unsandboxed);
    announce(url);
    process.exit(0);
  }
  // start it on its own: its own process group, no terminal, its output in the inbox
  mkdirSync(join(RP, "inbox"), { recursive: true });
  try { unlinkSync(serverFile(RP)); } catch {}
  const log = join(RP, "inbox", "server.log"), fd = openSync(log, "a");
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), ...args.filter((a) => a !== "--detach")], { cwd: process.cwd(), detached: true, stdio: ["ignore", fd, fd], env: { ...process.env, REELPLANNING_REVIEW_DETACHED: "1" } });
  child.unref(); closeSync(fd);
  let s = null;
  for (let i = 0; i < 1200 && !s; i++) {
    await new Promise((ok) => setTimeout(ok, 100));
    try { const j = JSON.parse(readFileSync(serverFile(RP), "utf8")); if (j.pid === child.pid) s = j; } catch {}
    if (!s && !alive(child.pid)) break;
  }
  if (!s) { console.error(`✗ the review server did not start; its output is in ${relative(process.cwd(), log)}`); process.exit(1); }
  console.log(`✓ review page: ${s.url}`);
  console.log(`  (a review server of its own, pid ${s.pid}: it outlives this session; logs in ${relative(process.cwd(), log)}; \`reelplanning review --stop\` stops it)`);
  if (s.unsandboxed) console.log(s.unsandboxed);
  process.exit(0);
}

const out = packedDir || resolve(flag("out", join(tmpdir(), "reelplanning-review", rp ? basename(dirname(rp)) : basename(projects[0]))));
bundle(out);

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".mp4": "video/mp4", ".vtt": "text/vtt", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf", ".txt": "text/plain" };
// ---------- the review coming back ----------
const RECHECK_MS = Number(process.env.REELPLANNING_RECHECK_MS) || 15000;
const json = (res, code, body) => res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(body));
const agentCommand = () => { const c = readConfig(RP)?.agent?.command; return c ? [].concat(c).join(" ") : null; };
// Unattended runs go ahead without the sandbox on this machine when agent.command turns on Claude
// Code's sandbox and the sandbox cannot run here (scripts/lib/sandbox.mjs; probed once per server).
// Another agent's command (codex exec, opencode run) is never probed. → null, or the problem
// ({ detail, reason, filesFenced })
const unsandboxed = async () => { if (!RP) return null; return sandboxProblem(splitCommand(readConfig(RP)?.agent?.command), { cwd: dirname(RP) }); };
const unsandboxedLine = (p) => `△ unattended runs here go ahead without Claude Code's sandbox: ${unsandboxedNote(p)} (docs/reference.md, "Review a video and annotate it").`;

// A headless run ended: tell the reviewer, since the run may not be able to (see the top). Finished
// (the review is in done/): rebuild the page from disk and say it is ready. Otherwise say it stopped.
const afterRun = (id) => ({ code, signal, done }) => {
  let row = {};
  try { row = JSON.parse(readFileSync(join(RP, "inbox", ...(done ? ["done"] : []), `${id}.json`), "utf8")); } catch { /* moved or gone */ }
  const rel = (p) => relative(dirname(RP), p).split("\\").join("/");
  const video = projects.find((p) => row.planDir && (rel(p) === row.planDir || rel(p).startsWith(`${row.planDir}/`))) || projects[0];
  const map = readPlanMap(video);
  const title = row.title || map?.title || basename(video);
  let line;
  if (done) {
    try { bundle(out); } catch (e) { console.error(`✗ rebuilding the page after ${id}: ${e.message}`); }
    line = `revised after your review${map ? `: ${waitingLine(map)}` : ""}`;
  } else line = `the run on your review stopped before it finished (exit ${code ?? signal}); its log: .reelplanning/inbox/runs/${id}.log`;
  ran.set(id, { ended: true, done, at: new Date().toISOString() });   // after the rebuild: the page asks for its build next
  console.log(`${done ? "✓" : "△"} run on ${id} ended (exit ${code ?? signal}): ${line}`);
  if (!args.includes("--no-notify")) notify({ title, line, url }).then((r) => { if (!r.shown) console.log(`  (no desktop notification: ${r.error || r.via})`); });
};

// Where one sent review is (GET /api/review/status): from the inbox and its claim files. A headless run this server
// started is done only once it has ended and the page was rebuilt (`inbox done` comes before the run's commit and
// exit); one that ended without `inbox done` stopped. A run started by an earlier server: its pid says whether it runs.
const ran = new Map();   // id → { ended, done?, at? }, for the runs this server started
const sigOf = (m) => m ? m.changes?.at || JSON.stringify((m.frames || []).map((f) => [f.compositionId, f.start, f.end])) : null;
// the review's video: its folder from the row (planDir and project, as plan-map.mjs names them), its slug as
// bundle-player names it, and the plan map served under that slug (else the one in the repo)
function buildFor(row) {
  const pd = String(row.planDir || "").replace(/\/+$/, ""), proj = String(row.project || "");
  const path = !pd ? proj : basename(pd) === proj ? pd : `${pd}/${proj}`;
  const m = path.match(/\.reelplanning\/(?:plans\/([^/]+)\/(video|walkthrough-video)|(system-video))$/), e = path.match(/\.reelplanning\/explainers\/([^/]+)\/video$/);
  const slug = e ? `${e[1]}--explainer` : m?.[3] ? "system" : m ? (m[2] === "video" ? m[1] : `${m[1]}--walkthrough`) : basename(path);
  const read = (f) => { try { return JSON.parse(readFileSync(f, "utf8")); } catch { return null; } };
  const own = projects.find((p) => basename(p) === proj);
  return sigOf(read(join(out, slug, "plan-map.json")) || read(join(dirname(RP), path, "plan-map.json")) || (own && read(join(own, "plan-map.json"))));
}
function reviewStatus(id) {
  const dir = join(RP, "inbox"), read = (f) => { try { return JSON.parse(readFileSync(f, "utf8")); } catch { return null; } };
  const when = (f) => { try { return statSync(f).mtime.toISOString(); } catch { return null; } };
  const doneRow = read(join(dir, "done", `${id}.json`)), row = doneRow || read(join(dir, `${id}.json`));
  if (!row) return null;
  // `inbox done` moves the claim beside the review; one moved by hand may have left it behind
  const c = (doneRow && read(join(dir, "done", `${id}.claim`))) || claimOf(RP, id) || {}, run = ran.get(id);
  const by = run || c.by === "agent" ? "agent" : c.by ? "session" : null;
  const log = by === "agent" ? (c.log || relative(dirname(RP), join(dir, "runs", `${id}.log`))).split("\\").join("/") : null;
  let state, step = null, since;
  if (by === "agent" && (run ? !run.ended : c.runPid ? c.host !== hostname() || alive(Number(c.runPid)) : !doneRow)) {
    state = "working"; since = c.at || null; if (doneRow) step = "finishing up";
  } else if (doneRow) { state = "done"; since = run?.at || when(join(dir, "done", `${id}.json`)); }
  else if (by === "agent") { state = "stopped"; since = run?.at || when(join(dirname(RP), log)); }
  else if (by) { state = "working"; since = c.at || null; }
  else { state = "waiting"; since = row.submittedAt || when(join(dir, `${id}.json`)); }
  return { id, state, by, ...(step ? { step } : {}), since, build: buildFor(row), ...(log ? { log } : {}) };
}

// Start the headless run on a review. Where the command's sandbox cannot run on this machine
// (scripts/lib/sandbox.mjs), it runs without it; the reviewer is told so once, at the first such run
// (the server's start line said it too).
let toldUnsandboxed = false;
async function startRun(id) {
  const r = await startAgent(RP, id, { onExit: afterRun(id) });
  if (r.started && !ran.has(id)) ran.set(id, { ended: false });
  if (r.started && r.unsandboxed && !toldUnsandboxed) {
    toldUnsandboxed = true;
    const line = `running without Claude Code's sandbox: ${unsandboxedNote(r.unsandboxed)}`;
    console.log(`△ ${id}: ${line}`);
    if (!args.includes("--no-notify")) {
      let row = {}; try { row = JSON.parse(readFileSync(join(RP, "inbox", `${id}.json`), "utf8")); } catch { /* gone */ }
      notify({ title: row.title || "Review started", line, url }).then((n) => { if (!n.shown) console.log(`  (no desktop notification: ${n.error || n.via})`); });
    }
  }
  return r;
}

// Who takes this review: the waiting session, else a headless run, else the next session.
async function deliver(id) {
  if (liveWaiters(RP).length) {
    // the waiter claims it within half a second; if it died between our look and its next poll,
    // don't strand the review — look again, and start a run if it is still nobody's
    setTimeout(async () => {
      if (claimOf(RP, id) || liveWaiters(RP).length) return;
      const r = await startRun(id);
      console.log(r.started ? `  ↳ ${id}: the waiting session went away; started ${agentCommand()} (pid ${r.pid})` : `  ↳ ${id}: the waiting session went away; ${r.reason} — it waits in the inbox`);
    }, RECHECK_MS);
    return { handledBy: "session", message: "your open session has it" };
  }
  const r = await startRun(id);
  if (r.started) return { handledBy: "agent", message: `no session was open: started \`${agentCommand()}\` on it${r.unsandboxed ? ", without Claude Code's sandbox (it can't run on this machine)" : ""}`, pid: r.pid };
  if (r.claim) return { handledBy: r.claim.by === "agent" ? "agent" : "session", message: "already being handled" };
  return { handledBy: "inbox", message: `saved; the next session picks it up (${r.reason})` };
}

// What your file across repos (~/.reelplanning/you.jsonl, D-106) says you know (D-218): the words you looked up in
// any review, and the videos of this repo you watched. The player shows a known word plainly, not underlined.
function knownHere() {
  try {
    // your file, and this repo's summaries still waiting to reach it
    const repo = repoName(dirname(RP)), k = youKnows([...readYou(), ...(RP ? readYou(pendingPath(RP)) : [])]);
    return { looked: [...k.looked.keys()].sort(), watched: [...new Set(k.watched.filter((w) => !repo || !w.repo || w.repo === repo).map((w) => w.video))].sort() };
  } catch { return { looked: [], watched: [] }; }
}

function readBody(req, limit = 5e6) {
  return new Promise((ok, fail) => {
    let n = 0; const chunks = [];
    req.on("data", (c) => { n += c.length; if (n > limit) { fail(Object.assign(new Error("too large"), { status: 413 })); req.destroy(); } else chunks.push(c); });
    req.on("end", () => ok(Buffer.concat(chunks).toString("utf8")));
    req.on("error", fail);
  });
}

async function handleApi(req, res, path) {
  if (path !== "api/review" && path !== "api/ask" && path !== "api/review/status") return json(res, 404, { ok: false, error: "no such endpoint" });
  // This endpoint can start an agent run, so only this page may call it: no other site's Origin
  // (a plain form post skips CORS preflight), and a Host that is us (a rebinding DNS name is not).
  const hosts = [`127.0.0.1:${port}`, `localhost:${port}`];
  if (!hosts.includes(String(req.headers.host))) return json(res, 403, { ok: false, error: "wrong host" });
  if (req.headers.origin && !hosts.some((h) => req.headers.origin === `http://${h}`)) return json(res, 403, { ok: false, error: "cross-origin" });
  if (!RP) return json(res, 409, { ok: false, error: "these videos are not in a repo set up with reel init (.reelplanning/decisions.json) — download the review instead" });
  if (path === "api/ask") return handleAsk(req, res);
  if (path === "api/review/status") {
    if (req.method !== "GET") return json(res, 405, { ok: false, error: "GET it, with ?id=" });
    const id = new URL(req.url, "http://x").searchParams.get("id") || "";
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/.test(id)) return json(res, 400, { ok: false, error: "no review id" });
    const s = reviewStatus(id);
    return s ? json(res, 200, { ok: true, ...s }) : json(res, 404, { ok: false, error: "no such review" });
  }
  // where the command's sandbox cannot run, the run still starts, without it: the Finish panel says so
  // in the same quiet line (`unsandboxed`: why, or null)
  if (req.method === "GET") { const off = await unsandboxed(); return json(res, 200, { ok: true, sessionWaiting: liveWaiters(RP).length > 0,
    agentCommand: agentCommand(), unsandboxed: off ? "Claude Code's sandbox can't run on this machine" : null, inbox: listInbox(RP).filter((r) => !r.claim).length, known: knownHere() }); }
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST a review row" });
  if (!/^application\/json\b/i.test(String(req.headers["content-type"] || ""))) return json(res, 415, { ok: false, error: "content-type must be application/json" });
  let row;
  try { row = JSON.parse(await readBody(req)); } catch (e) { return json(res, e.status || 400, { ok: false, error: e.status ? "review too large" : "body is not JSON" }); }
  const problem = rowProblem(row);
  if (problem) return json(res, 400, { ok: false, error: problem });
  const w = writeReview(RP, row);
  const rel = relative(dirname(RP), w.path).split("\\").join("/");
  let d;
  if (w.duplicate) { const c = claimOf(RP, w.id); d = { handledBy: c ? (c.by === "agent" ? "agent" : "session") : liveWaiters(RP).length ? "session" : "inbox", message: "already received" }; }
  else d = await deliver(w.id);
  console.log(`📥 review ${w.id}${w.duplicate ? " (again)" : ""} → ${rel}: ${d.message}`);
  return json(res, 200, { ok: true, id: w.id, path: rel, duplicate: w.duplicate, ...d });
}

// Ask about this (videos-that-make-sense step 3): a question asked on the page goes to the agent session waiting on
// it (`review --wait`, which claims it, prints its path and exits; the session answers with `inbox answer`); the page
// asks GET /api/ask?id= until it has the answer. With no session waiting nothing is written: the page keeps the
// question in the review, to be answered in the next version. Nothing here starts a headless run.
async function handleAsk(req, res) {
  if (req.method === "GET") {
    const id = new URL(req.url, "http://x").searchParams.get("id"); const q = id ? readQuestion(RP, id) : null;
    if (!q) return json(res, 404, { ok: false, error: "no such question" });
    return json(res, 200, { ok: true, id: q.id, answered: !!q.answer, ...(q.answer ? { answer: q.answer, from: q.from || null, answeredAt: q.answeredAt || null } : {}) });
  }
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST a question" });
  if (!/^application\/json\b/i.test(String(req.headers["content-type"] || ""))) return json(res, 415, { ok: false, error: "content-type must be application/json" });
  let q; try { q = JSON.parse(await readBody(req, 64e3)); } catch (e) { return json(res, e.status || 400, { ok: false, error: e.status ? "question too large" : "body is not JSON" }); }
  const text = typeof q?.question === "string" ? q.question.trim() : "";
  if (!text || text.length > 2000) return json(res, 400, { ok: false, error: "a question is 1 to 2000 characters" });
  if (!liveWaiters(RP).length) return json(res, 200, { ok: true, handledBy: "review", message: "no agent session is waiting on this page: the question goes with your review" });
  const str = (v, n) => (typeof v === "string" ? v.slice(0, n) : null);
  const w = writeQuestion(RP, { id: str(q.id, 80), video: str(q.video, 200), planDir: str(q.planDir, 300), title: str(q.title, 300), question: text, t: Number(q.t) || 0,
    frame: q.frame && typeof q.frame === "object" ? { index: Number(q.frame.index) || null, title: str(q.frame.title, 200) } : null, planStep: Number.isFinite(Number(q.planStep)) && q.planStep != null ? Number(q.planStep) : null,
    narration: str(q.narration, 4000), quote: str(q.quote, 400) });
  console.log(`❓ question ${w.id}${w.duplicate ? " (again)" : ""} → ${relative(dirname(RP), w.path)}: the waiting session has it`);
  return json(res, 200, { ok: true, id: w.id, handledBy: "session", message: "the agent session waiting on this page has it" });
}

const server = createServer((req, res) => {
  const api = new URL(req.url, "http://x").pathname.replace(/^\/+|\/+$/g, "");
  if (api === "api" || api.startsWith("api/")) { handleApi(req, res, api).catch((e) => { console.error(`✗ /${api}: ${e.message}`); if (!res.headersSent) json(res, 500, { ok: false, error: e.message }); }); return; }
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  let file = join(out, path);
  if (!file.startsWith(out)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) { res.writeHead(404).end("not found"); return; }
  res.writeHead(200, { "content-type": TYPES[extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
  // the top page says it is served here, so the player asks /api/review only when there is one (a
  // plain static server would answer that probe with a 404 in the console)
  // (a video's guide page too: its questions go to the waiting session the same way)
  if (file === join(out, "index.html") || /[\\/]guide[\\/]index\.html$/.test(file)) { res.end(readFileSync(file, "utf8").replace(/<head>/i, '<head>\n<meta name="reelplanning-review-server" content="1">')); return; }
  res.end(readFileSync(file));
});

const listen = (port, tries = 20) => new Promise((ok, fail) => {
  server.once("error", (e) => (e.code === "EADDRINUSE" && tries > 0 ? listen(port + 1, tries - 1).then(ok, fail) : fail(e)));
  server.listen(port, "127.0.0.1", () => ok(port));
});
const port = await listen(Number(flag("port", 8787)));
const base = `http://127.0.0.1:${port}/`, url = pageUrl(base, out);
console.log(`✓ review page: ${url}`);
console.log(`  (serving until stopped; Finish, then Send, files the review in ${RP ? `${relative(process.cwd(), join(RP, "inbox")) || "."}/ — POST /api/review` : "a download"})`);
// say it once, at the start, where the reviewer (or the session that started this) reads it
const off = await unsandboxed();
if (off) console.log(unsandboxedLine(off));
// started by --detach: say where this server is, so the next --detach reuses it and --stop finds it
if (process.env.REELPLANNING_REVIEW_DETACHED === "1" && RP) {
  const file = serverFile(RP);
  writeFileSync(file, JSON.stringify({ pid: process.pid, port, url, base, out, projects: projects.map((p) => relative(dirname(RP), p)), startedAt: new Date().toISOString(), ...(off ? { unsandboxed: unsandboxedLine(off) } : {}) }, null, 2) + "\n");
  const forget = () => { try { if (JSON.parse(readFileSync(file, "utf8")).pid === process.pid) unlinkSync(file); } catch {} };
  process.on("exit", forget);
  for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => process.exit(0));
  process.on("SIGHUP", () => {});   // no terminal to hang up: it runs until --stop
}
announce(url);
