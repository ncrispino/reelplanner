#!/usr/bin/env node
// The local review page (`reelplanner review`): the Finish panel says what will happen to the review
// before it is sent (GET /api/review, asked again each time the panel opens), and its Send POSTs the
// review row to the page's own server, /api/review, in the same shape the hosted page writes to its
// store; only when that endpoint answers, and quietly not otherwise. Anything changed after a send
// (a comment, not only the verdict) is offered as a new send. And a system-video review names
// the video's own folder.
// usage: node packages/player/test/local-review.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs"; import { join, normalize, extname } from "node:path";
import { launchOpts, testPort, ROOT } from "../../../scripts/lib/env.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
// a static server over the repo; `api` decides whether it also answers /api/review and marks the top page
// as its own (the meta tag the review server adds), as the review server does
function serve(port, api) {
  const posts = [], state = { sessionWaiting: true, agentCommand: null };
  const srv = createServer((req, res) => {
    const path = new URL(req.url, "http://x").pathname;
    if (path === "/api/review") {
      if (!api) { res.writeHead(404).end(); return; }
      // the review server in a repo with no decision log (review.mjs: no .reelplanner/decisions.json): it takes no review
      if (api === "norecord") { posts.push({ refused: req.method }); res.writeHead(409, { "content-type": "application/json" }).end(JSON.stringify({ ok: false, error: "not set up: download the review instead" })); return; }
      if (req.method === "GET") { res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ ok: true, ...state, inbox: 0 })); return; }
      let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
        posts.push({ type: req.headers["content-type"], row: JSON.parse(body) });
        res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ ok: true, id: "l2-test", path: ".reelplanner/inbox/l2-test.json", duplicate: false, handledBy: "session", message: "your open session has it" }));
      });
      return;
    }
    const file = join(ROOT, normalize(decodeURIComponent(path)));
    if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) { const idx = join(file, "index.html"); if (existsSync(idx)) { const html = readFileSync(idx, "utf8"); res.writeHead(200, { "content-type": "text/html" }).end(api ? html.replace(/<head>/i, '<head><meta name="reelplanning-review-server" content="1">') : html); return; } res.writeHead(404).end(); return; }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
  }).listen(port, "127.0.0.1");
  return { srv, posts, state };
}
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const b = await chromium.launch(launchOpts({ args: ["--no-sandbox"] }));
async function open(port) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 140)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} });
  await p.reload();
  await p.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 });
  await p.evaluate(() => document.querySelector("#rp").reachLocal());
  return p;
}
const comment = async (p, text) => { await p.locator("#rp").locator(".composer textarea").fill(text); await p.locator("#rp").locator('[data-act="post"]').click(); };
const send = async (p) => { await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="send-local"]').click()); await p.waitForTimeout(700); };
const next = (p) => p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".handoff [data-next]")?.textContent || "");
const finish = async (p) => { await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="finish"]').click()); await p.waitForTimeout(700); };

// ---- served by the review server: the panel says what will happen, then Send sends the row ----
const A = serve(testPort(8881), true);
const p = await open(testPort(8881));
await comment(p, "16 MB parts change the retry cost on mobile");
await finish(p);
ok(A.posts.length === 0 && (await next(p)) === "Your open session picks this up.", `before sending, the Finish panel says what will happen — "${await next(p)}"`);
// asked again each time the panel opens: the session went away meanwhile, and the repo names its agent
Object.assign(A.state, { sessionWaiting: false, agentCommand: "claude -p" });
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="handoff-close"]').click());
await finish(p);
ok((await next(p)) === "No session is open: claude -p starts on it.", `reopened, it asks again — "${await next(p)}"`);
Object.assign(A.state, { sessionWaiting: false, agentCommand: null });
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="handoff-close"]').click());
await finish(p);
ok((await next(p)) === "Saved for your next session.", `and with neither, the review waits — "${await next(p)}"`);
// Claude Code's sandbox cannot run on this machine: the run still starts, without it, and the same line says so
Object.assign(A.state, { agentCommand: "claude -p", unsandboxed: "Claude Code's sandbox can't run on this machine" });
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="handoff-close"]').click());
await finish(p);
ok((await next(p)) === "No session is open: claude -p starts on it, without Claude Code's sandbox (Claude Code's sandbox can't run on this machine): its shell commands aren't fenced to the repo.", `where the sandbox can't run, the run goes ahead without it, and the panel says so in the same line — "${await next(p)}"`);
Object.assign(A.state, { agentCommand: null }); delete A.state.unsandboxed;
await p.evaluate(() => { const i = document.querySelector("#rp").shadowRoot.querySelector(".handoff [data-send-note]"); i.value = "start with step 2"; });
await send(p);
const row = A.posts[0]?.row;
ok(A.posts.length === 1 && A.posts[0].type === "application/json" && row?.note === "start with step 2", `Send POSTs the review to /api/review, with the note — ${A.posts.length} post(s)`);
ok(row && ["status", "submittedAt", "project", "planDir", "title", "verdict", "note", "review"].every((k) => k in row) && row.status === "submitted" && Array.isArray(row.review?.annotations) && row.review.annotations.some((a) => /retry cost/.test(a.comment)) && !("id" in row),
  `in the hosted row's shape, with the comment — ${row ? Object.keys(row).join(",") : "none"}`);
ok(row?.planDir && row.planDir === (await p.evaluate(() => document.querySelector("#rp").planMap.planDir)) && !row.kind, `a plan video's row names its plan directory — ${row?.planDir}`);
const panel = await p.evaluate(() => { const box = document.querySelector("#rp").shadowRoot.querySelector(".handoff"); return { text: box.querySelector(".send")?.textContent || "", download: !!box.querySelector('.acts .sendbtn[data-act="download"]'), diy: box.querySelector(".diy summary")?.textContent }; });
ok(/Sent to the repo\. Your open session has it/.test(panel.text) && !panel.download && panel.diy === "Do it yourself instead", `the panel says where it went, and the commands fold away — "${panel.text.trim().slice(0, 90)}"`);
await p.evaluate(() => document.querySelector("#rp").postLocal()); await p.waitForTimeout(400);
ok(A.posts.length === 1, "sending again with nothing new sends nothing new");
const offered = () => p.evaluate(() => !!document.querySelector("#rp").shadowRoot.querySelector('.handoff .send.done [data-act="send-local"]'));
ok(!(await offered()), "right after sending, nothing is offered to send again");
// a comment added after the send, with the verdict unchanged, is sendable too, as a new row
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="handoff-close"]').click());
await p.locator("#rp").locator(".composer textarea").fill("and the resume token expires too soon");
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.composer [data-act="post"]').click());
await finish(p);
const again = await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".handoff .send.done .state")?.textContent || "");
ok((await offered()) && /Your review changed after it was sent/.test(again), `a comment added after sending offers "Send the change" — "${again.trim()}"`);
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.handoff .send.done [data-act="send-local"]').click()); await p.waitForTimeout(700);
const row2 = A.posts[1]?.row;
ok(A.posts.length === 2 && row2?.review.annotations.some((a) => /resume token/.test(a.comment)) && row2.submittedAt !== row.submittedAt, `…and sends a new row with it — ${A.posts.length} post(s)`);
ok(!(await offered()), "…after which nothing is offered again");
await p.close(); A.srv.close();

// ---- a plain static server (no /api/review): nothing is sent, the download is the act ----
const B = serve(testPort(8881, 1), false);
const q = await open(testPort(8881, 1));
await comment(q, "a comment");
await finish(q);
const plain = await q.evaluate(() => !!document.querySelector("#rp").shadowRoot.querySelector('.handoff .acts .sendbtn[data-act="download"]'));
ok(B.posts.length === 0 && plain && !(await next(q)), "without the endpoint nothing is asked or sent, and the download is the act");

// ---- a quick video: the review server, in a repo with no decision log, takes no review (409), and the page says the
// repo has none (bundle-player's record="none"): the download is the act, one line says to hand it to the agent, and
// there is no reel record, plan_dir or repo-root command to run ----
const C = serve(testPort(8881, 2), "norecord");
const r = await open(testPort(8881, 2));
await r.evaluate(() => document.querySelector("#rp").setAttribute("record", "none"));
await comment(r, "a comment");
await finish(r);
const quick = await r.evaluate(() => { const box = document.querySelector("#rp").shadowRoot.querySelector(".handoff"), t = box.textContent.replace(/\s+/g, " ");
  return { download: !!box.querySelector('.acts .sendbtn[data-act="download"]'), send: !!box.querySelector('[data-act="send-local"]'), tell: box.querySelector(".tell")?.textContent || "",
    cmds: box.querySelectorAll("li code").length, diy: !!box.querySelector(".diy"), words: /reel record|plan_dir|plan-dir|repo root/i.test(t) }; });
ok(!C.posts.some((x) => x.refused === "POST") && quick.download && !quick.send && !(await next(r)), `quick: nothing is sent, and the download is the act — ${JSON.stringify(C.posts)}`);
ok(/^Then tell your agent where the file is \(e\.g\. ~\/Downloads\/annotations\.json\): it reads your answers and comments and revises\.$/.test(quick.tell) && !quick.cmds && !quick.diy && !quick.words,
  `…then one plain line, and no reel record, plan_dir or repo-root commands — ${JSON.stringify(quick)}`);
await r.close(); C.srv.close();

// ---- the system video: its row and its commands name the video's own folder ----
const sys = await q.evaluate(() => {
  const rp = document.querySelector("#rp");
  rp.planMap = { ...rp.planMap, project: "system-video", planDir: ".reelplanner", kind: "system", reviewDir: ".reelplanner/system-video" };
  const row = rp.reviewRow(rp.exportPayload());
  const old = (() => { const m = rp.planMap; rp.planMap = { ...m, kind: undefined, reviewDir: undefined }; const r = rp.reviewTarget(); rp.planMap = m; return r; })();
  return { planDir: row.planDir, kind: row.kind, text: rp.handoffText(), old };
});
ok(sys.planDir === ".reelplanner/system-video" && sys.kind === "system", `a system-video row names the video's folder — ${sys.planDir} (${sys.kind})`);
ok(/system-review ~\/Downloads\/annotations\.json --video \.reelplanner\/system-video$/m.test(sys.text) && !/reel record|\bmv\b/.test(sys.text), `its commands sort it with system-review (it files the download in reviews/), not reel record:\n${sys.text}`);
ok(sys.old === ".reelplanner/system-video", "a system video's map from before `kind` is still found by its project name");
await q.close(); B.srv.close();

await b.close();
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
