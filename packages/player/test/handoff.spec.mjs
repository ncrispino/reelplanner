#!/usr/bin/env node
// The handoff: what a reviewer is told to do with the file the browser just downloaded. Export
// used to end their job in a downloads folder — the plan, the ledger and the revise all live in
// the repo, and nothing on screen said how to get there.
// usage: node packages/player/test/handoff.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer, RP_COMMAND } from "../../../scripts/lib/env.mjs";
import { until, frames } from "./wait.mjs";
const project = process.argv[2] || "videos/w1-upload-resume";
const planDir = "eval/projects/media-service/.reelplanning/plans/2026-09-12-upload-resume";
const port = testPort(8874);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts({ args: ["--no-sandbox"] }));
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 140)));
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload();
await p.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 });
const rp = p.locator("#rp");
// the panel open, built from what the page heard back from its host (claude.use("db"), asked once, early: the
// Send block goes on top of the commands when it answers), and drawn
const opened = async (pg) => { await pg.evaluate(() => document.querySelector("#rp")._claudeReady); await until(pg, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden); await frames(pg); };

ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden),
  "closed before any export — there is no file to move yet");

await rp.locator(".composer textarea").fill("16 MB parts change the retry cost on mobile");
await rp.locator('[data-act="post"]').click();
// Export sits at the bottom of a scrolling column, so drive it by its shortcut — which also
// checks that E still reaches it.
await rp.focus(); await p.keyboard.press("e");
await opened(p);

const got = await p.evaluate(() => {
  const el = document.querySelector("#rp"), box = el.shadowRoot.querySelector(".handoff");
  return { hidden: box.hidden, codes: [...box.querySelectorAll("li code")].map((c) => c.textContent),
    warn: !!box.querySelector(".warn"), lede: box.querySelector(".lede").textContent.trim(), text: el.handoffText() };
});
ok(!got.hidden, "opens on export");
// it heads the record and does not take it over: what the reviewer said stays listed under it, to read and edit
const under = await p.evaluate(() => { const S = document.querySelector("#rp").shadowRoot, shown = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).display !== "none";
  const box = S.querySelector(".handoff").getBoundingClientRect(), m = S.querySelector(".marks");
  return { cols: shown(S.querySelector(".cols")), list: shown(m), below: m.getBoundingClientRect().top >= box.bottom, field: S.querySelector('.marks textarea[data-comment]')?.value || "", fold: S.querySelector(".handoff .hfold")?.getAttribute("aria-expanded") }; });
ok(under.cols && under.list && under.below && /retry cost/.test(under.field) && under.fold === "true", `the comments stay listed under it, editable — ${JSON.stringify(under)}`);
ok(!got.warn, "no placeholder warning — this video's storyboard names its plan directory");
ok(got.codes.length === 2, `two commands — ${got.codes.length}`);
ok(got.codes.every((c) => c.includes(planDir)), "every line names the real plan directory");
ok(got.codes[0].startsWith(`${RP_COMMAND} reel record `) && /^\S+ ~\/Downloads\/annotations\.json$/.test(got.codes[0].slice(`${RP_COMMAND} reel record `.length)), `line 1 is reel record on the download, run as people run reelplanner (RP_COMMAND, "${RP_COMMAND}"; it files it in reviews/) — "${got.codes[0]}"`);
ok(got.codes.every((c) => !/\bmv\b|resolved\.md|revise-scope/.test(c)), "no file is moved by hand, and no old file is named");
ok(got.codes[1].includes("git push"), "line 2 pushes — that is what starts the revise");
ok(got.text.trim().split("\n").length === 2, "what Copy puts on the clipboard is the commands, with none of the prose");
ok(got.lede.includes("1 comment"), `the lede counts what was recorded — "${got.lede.slice(0, 48)}…"`);

await rp.focus(); await p.keyboard.press("Escape"); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden);
ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden), "Escape closes it");

// The lede names what the file carries, whatever kind of review it was. A walkthrough has verdicts
// and checks and usually no decisions at all; "0 decisions" would read as a failure.
const ledes = await p.evaluate(() => {
  const el = document.querySelector("#rp"), read = () => el.shadowRoot.querySelector(".lede").textContent.trim();
  const keep = [el.autonomy, el.quizzes, el.annotations];
  el.autonomy = { a1: {}, a2: {} }; el.quizzes = { k1: {} }; el.showHandoff(); const walk = read();
  el.autonomy = {}; el.quizzes = {}; el.annotations = []; el.showHandoff(); const none = read();
  [el.autonomy, el.quizzes, el.annotations] = keep; el.showHandoff();
  return { walk, none };
});
ok(ledes.walk.startsWith("2 verdicts, 1 quick check and 1 comment are in"), `a walkthrough's lede names verdicts and checks — "${ledes.walk.slice(0, 48)}…"`);
ok(/^How much you watched is in/.test(ledes.none), `an empty review is not reported as a row of zeroes — "${ledes.none.slice(0, 40)}…"`);

// A video whose storyboard does not name its plan directory says so, rather than inventing a path.
const ph = await p.evaluate(() => { const el = document.querySelector("#rp");
  el.planMap = { ...el.planMap, planDir: null }; el.showHandoff();
  const box = el.shadowRoot.querySelector(".handoff");
  return { warn: !!box.querySelector(".warn"), first: box.querySelector("li code").textContent }; });
ok(ph.warn && ph.first.includes("<plan-dir>"), "a silent storyboard gets a flagged placeholder, not a guess");

// ---- a quick video: its repo keeps no decision log (bundle-player's record="none") ----
// There is no .reelplanner/ to file the review in, so no `reel record`, no plan_dir to name and nothing to run from
// the repo root: Finish's act is the download, and one plain line says to tell the agent where the file is.
const TELL = "Then tell your agent where the file is (e.g. ~/Downloads/annotations.json): it reads your answers and comments and revises.";
const quickPanel = (setup) => p.evaluate(({ setup }) => {
  const el = document.querySelector("#rp"), keep = el.planMap;
  if (setup === "explainer") el.planMap = { ...keep, kind: "explainer", decisions: [] };
  if (setup === "walkthrough") el.planMap = { ...keep, project: "walkthrough-video", decisions: [], autonomy: [{ id: "a1", title: "a call" }] };
  if (setup === "system") el.planMap = { ...keep, project: "system-video", planDir: ".reelplanner", kind: "system", reviewDir: ".reelplanner/system-video" };
  el.setVerdict(setup === "explainer" ? "done" : "changes");   // as Finish does: Request changes where there are comments
  el.showHandoff({ finishing: setup !== "export" });
  const box = el.shadowRoot.querySelector(".handoff"), text = box.textContent.replace(/\s+/g, " ");
  const r = { h: box.querySelector("h5").textContent, download: [...box.querySelectorAll('[data-act="download"]')].map((b) => b.className), tell: box.querySelector(".tell")?.textContent || null,
    codes: box.querySelectorAll("li code").length, warn: !!box.querySelector(".warn"), diy: !!box.querySelector(".diy"), copy: !!box.querySelector('[data-act="handoff-copy"]'),
    record: /reel record|system-review/.test(text), plandir: /plan_dir|plan-dir/.test(text), root: /repo root/i.test(text), log: /decision log/.test(text), verdicts: box.querySelectorAll("[data-review]").length };
  el.planMap = keep; return r;
}, { setup });
await p.evaluate(() => { const el = document.querySelector("#rp"); el.planMap = { ...el.planMap, planDir: null }; el.setAttribute("record", "none"); });
const q1 = await quickPanel("plan");
ok(q1.download.length === 1 && q1.download[0] === "sendbtn", `quick, Finish: the one act is the Download button — ${JSON.stringify(q1.download)}`);
ok(q1.tell === TELL, `…then one plain line: tell your agent where the file is — "${q1.tell}"`);
ok(!q1.codes && !q1.diy && !q1.copy && !q1.record && !q1.plandir && !q1.warn && !q1.root, `…and no reel record, no plan_dir warning, no repo-root commands — ${JSON.stringify(q1)}`);
ok(q1.verdicts === 2 && q1.h === "Finish your review", "…the verdict is asked as on any plan video");
const qe = await quickPanel("export");
ok(!qe.download.length && qe.tell === TELL.replace(/^Then tell/, "Tell") && !qe.codes && !qe.diy && !qe.record && qe.h === "Now hand this review to your agent",
  `quick, after Export (the file already saved): no button, the same line — "${qe.tell}", "${qe.h}"`);
const qx = await quickPanel("explainer");
ok(qx.verdicts === 3 && qx.download.length === 1 && qx.tell === TELL && !qx.codes && !qx.diy && !qx.record && !qx.log, `a quick explainer: Done / Explain more / Plan this, the download and the line, and no word of a decision log there is none of — ${JSON.stringify(qx)}`);
const qw = await quickPanel("walkthrough");
ok(qw.download.length === 1 && qw.tell === TELL && !qw.codes && !qw.diy && !qw.record, `a quick walkthrough: the download and the line — ${JSON.stringify(qw)}`);
const qs = await quickPanel("system");
ok(qs.codes === 2 && qs.record && !qs.tell, "a system video is never quick: its commands stay (it lives in a set-up record)");
// Download, clicked: the file the line points at
const [dl] = await Promise.all([p.waitForEvent("download", { timeout: 10000 }), p.evaluate(() => { const el = document.querySelector("#rp"); el.showHandoff({ finishing: true }); el.shadowRoot.querySelector('.handoff [data-act="download"]').click(); })]);
ok(dl.suggestedFilename() === "annotations.json", `quick, Download saves annotations.json — ${dl.suggestedFilename()}`);
// the whole pipeline (no record="none"): today's panel, to the byte
const same = await p.evaluate(() => { const el = document.querySelector("#rp"), html = () => el.shadowRoot.querySelector(".handoff").innerHTML;
  el.removeAttribute("record"); el.showHandoff({ finishing: true }); const a = html();
  el.setAttribute("record", "none"); el.showHandoff({ finishing: true }); const quick = html();
  el.removeAttribute("record"); el.showHandoff({ finishing: true }); const b = html();
  return { same: a === b, differs: a !== quick, codes: el.shadowRoot.querySelectorAll(".handoff li code").length, tell: !!el.shadowRoot.querySelector(".handoff .tell") }; });
ok(same.same && same.differs && same.codes === 2 && !same.tell, `with a decision log the panel is today's: the commands, no quick line — ${JSON.stringify(same)}`);

// ---- hosted as an Artifact: the page can hand the review to Claude itself ----
// Everything above is the fallback — what a reviewer sees anywhere the page cannot reach Claude.
// Here, stand in for the Artifact runtime so the send path runs for real: the same click, the
// same document, and the live status line that follows it.
const p2 = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p2.on("pageerror", (e) => fails.push("page error (hosted): " + String(e).slice(0, 140)));
await p2.addInitScript(() => {
  const store = (window.__db = { docs: {}, watchers: {} });
  const doc = (path) => ({
    async set(data) { store.docs[path] = data; (store.watchers[path] || []).forEach((f) => f({ data: () => store.docs[path] })); },
    onSnapshot(next) { (store.watchers[path] ||= []).push(next); next({ data: () => store.docs[path] }); return () => {}; },
  });
  window.claude = { use: async (n) => (n === "db" ? { doc } : null) };
});
await p2.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
await p2.evaluate(() => { try { localStorage.clear(); } catch {} });
await p2.reload();
await p2.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 });
const rp2 = p2.locator("#rp");
await rp2.locator(".composer textarea").fill("the 16 MB default needs a number before this lands");
await rp2.locator('[data-act="post"]').click();
await rp2.focus(); await p2.keyboard.press("e");
await opened(p2);

ok(await p2.evaluate(() => !!document.querySelector("#rp").shadowRoot.querySelector('[data-act="send"]')),
  "hosted, the panel offers to send the review to Claude");
ok(await p2.evaluate(() => document.querySelector("#rp").shadowRoot.querySelectorAll(".handoff li code").length === 2),
  "and still shows the commands, for a reviewer who would rather run them");

await p2.evaluate(() => { document.querySelector("#rp").shadowRoot.querySelector("[data-send-note]").value = "start with step 2"; });
await p2.locator("#rp").locator('[data-act="send"]').click();
await until(p2, () => Object.keys(window.__db.docs).length > 0 && !!document.querySelector("#rp").shadowRoot.querySelector(".handoff .sent"));
const row = await p2.evaluate(() => { const k = Object.keys(window.__db.docs)[0]; return { path: k, body: window.__db.docs[k] }; });
ok(/^reviews\/w1-upload-resume-\d{8}T\d{6}Z$/.test(row.path || ""), `one review document, named for its project and moment — ${row.path}`);
ok(row.body?.status === "submitted", "it arrives marked submitted, for Claude to pick up");
ok(row.body?.planDir === planDir, "it carries the plan directory, so Claude knows where it belongs");
ok(row.body?.note === "start with step 2", "and whatever the reviewer wanted Claude to know");
ok(row.body?.review?.annotations?.length === 1 && row.body.review.version === 1,
  "the review inside is the same object Export downloads");
ok(await p2.evaluate(() => /Sent\./.test(document.querySelector("#rp").shadowRoot.querySelector(".handoff .sent").textContent)),
  "the button is replaced by what happened, not left to be clicked twice");

// Claude marks the row as it works; the reviewer watches it land.
await p2.evaluate(() => { const k = Object.keys(window.__db.docs)[0];
  window.__db.docs[k] = { ...window.__db.docs[k], status: "recorded", commit: "a1b2c3d4e5f6", branch: "claude/revise" };
  window.__db.watchers[k].forEach((f) => f({ data: () => window.__db.docs[k] })); });
await until(p2, () => /Recorded/.test(document.querySelector("#rp").shadowRoot.querySelector("[data-state]")?.textContent || ""));
const state = await p2.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("[data-state]").textContent);
ok(/Recorded and pushed — a1b2c3d4 on claude\/revise/.test(state), `the status line follows Claude's own row — "${state}"`);
ok(!("viewer" in (row.body || {})), "no `user` capability here: the row names no viewer, and intake stamps it with git's user.email");

// Who sent it: with `user` declared beside `db`, the row carries { id, owner } (an opaque id, never a
// name); intake records "owner" or id:<id>. A user namespace that never answers must not hold the send.
async function hostedSend(kind) {
  const pg = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  pg.on("pageerror", (e) => fails.push(`page error (hosted, ${kind}): ` + String(e).slice(0, 140)));
  await pg.addInitScript((kind) => {
    const store = (window.__db = { docs: {} });
    const doc = (path) => ({ async set(data) { store.docs[path] = data; }, onSnapshot(next) { next({ data: () => store.docs[path] }); return () => {}; } });
    const people = { owner: { id: "u_owner123", owner: true }, other: { id: "u_colleague9", owner: false }, anon: { id: null, owner: false } };
    const user = kind === "hang" ? null : Object.freeze({ id: async () => people[kind].id, isOwner: async () => people[kind].owner, name: async () => "Ada Lovelace", me: async () => ({ ...people[kind], name: "Ada Lovelace", isOwner: people[kind].owner }) });
    window.claude = { use: (n) => (n === "db" ? Promise.resolve({ doc }) : n === "user" ? (kind === "hang" ? new Promise(() => {}) : Promise.resolve(user)) : Promise.resolve(null)) };
  }, kind);
  await pg.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
  await pg.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 });
  const r = pg.locator("#rp");
  await r.locator(".composer textarea").fill("a comment to send"); await r.locator('[data-act="post"]').click();
  await r.focus(); await pg.keyboard.press("e"); await opened(pg);
  const t0 = Date.now();
  await r.locator('[data-act="send"]').click();
  await pg.waitForFunction(() => Object.keys(window.__db.docs).length > 0, null, { timeout: 10000 }).catch(() => {});
  const took = Date.now() - t0;
  const body = await pg.evaluate(() => Object.values(window.__db.docs)[0] || null);
  await pg.close();
  return { body, took };
}
const own = await hostedSend("owner");
ok(JSON.stringify(own.body?.viewer) === JSON.stringify({ id: "u_owner123", owner: true }), `the page's owner: the row carries viewer { id, owner: true } — ${JSON.stringify(own.body?.viewer)}`);
ok(!/Ada|Lovelace/.test(JSON.stringify(own.body || {})), "and no name anywhere in the row: ids only");
const other = await hostedSend("other");
ok(JSON.stringify(other.body?.viewer) === JSON.stringify({ id: "u_colleague9", owner: false }), `anyone else: viewer { id, owner: false } — ${JSON.stringify(other.body?.viewer)}`);
const anon = await hostedSend("anon");
ok(!!anon.body && !("viewer" in anon.body), "a viewer with no identity there (no id, not the owner): the field is left out");
const hang = await hostedSend("hang");
ok(!!hang.body && !("viewer" in hang.body) && hang.took < 5000, `a user capability that never answers holds the send ${hang.took} ms at most, and the row goes without a viewer`);
// what intake makes of each row: the stamp recordedBy writes
{
  const { recordedBy } = await import("../../../scripts/lib/reviews.mjs");
  const { mkdtempSync, rmSync } = await import("node:fs"); const { tmpdir } = await import("node:os"); const { join } = await import("node:path"); const { execFileSync } = await import("node:child_process");
  const g = mkdtempSync(join(tmpdir(), "handoff-g-")); execFileSync("git", ["-C", g, "init", "-q"]); execFileSync("git", ["-C", g, "config", "user.email", "agent@example.com"]);
  const who = [own, other, anon].map((x) => recordedBy(g, { row: x.body }).reviewer);
  ok(who[0] === "owner" && who[1] === "id:u_colleague9" && who[2] === "agent@example.com", `intake records them as "owner", id:<id>, and git's user.email — ${JSON.stringify(who)}`);
  rmSync(g, { recursive: true, force: true });
}

// A page that cannot reach Claude must not lose the manual path — the whole point of the fallback.
const p3 = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p3.addInitScript(() => { window.claude = { use: async () => null }; });
await p3.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
await p3.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 });
await p3.locator("#rp").focus(); await p3.keyboard.press("e");
await opened(p3);
ok(await p3.evaluate(() => { const sr = document.querySelector("#rp").shadowRoot;
  return !sr.querySelector('[data-act="send"]') && sr.querySelectorAll(".handoff li code").length === 2; }),
  "a refused db offers no send button and the full set of commands");

console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
