#!/usr/bin/env node
// A round on the review page (find-the-gaps, #57, steps 2 and 3), against a scratch repo set up with a headless command:
//   reelplanner review <round>  — the page at /round/?r=<name>, from the player's package; no video to bundle
//   GET  /api/round             — the fronts: assume first, then predict, then say; never an answer, a why or the lines
//   POST /api/round/answer      — one record with the chat's (answers.json, via "page"); a predict card answered turns
//                                 over to its lines and why, and says whether it was a gap; Not sure settles only Got it
//                                 or Show me more; a Got it lands once in your file, however often it is sent
//   POST /api/round/say         — your words, a question for the waiting session (never a headless run); its claims,
//                                 once `align answer` records them, come back on GET
//   POST /api/round/transcribe  — audio only; with no whisper it says to type instead
//   POST /api/round/send        — the round into the inbox, kind "align", with what each gap settled to; skipped cards
//                                 are Assumed, not checked; a configured headless command is never started
//   another site's page is refused; in the browser, keys answer a card and it turns over to the code's lines
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, testPort } from "../lib/env.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2500)}` : ""}`); if (!cond) failed++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (f, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = await f(); if (v) return v; await sleep(100); } return null; };
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

const tmp = mkdtempSync(join(tmpdir(), "reel-align-page-"));
const home = join(tmp, "home"), RH = join(home, ".reelplanner"); mkdirSync(home, { recursive: true });
const env = { ...process.env, HOME: home, REELPLANNER_HOME: RH };
const repo = join(tmp, "app"); mkdirSync(join(repo, "src"), { recursive: true });
const git = (...a) => execFileSync("git", a, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
git("init", "-q", "-b", "main"); git("config", "user.email", "sam@example.com"); git("config", "user.name", "Sam"); git("config", "commit.gpgsign", "false");
writeFileSync(join(repo, "src/send.mjs"), ["// how a review is handed on", "export function send(review, { waiting, command }) {", "  if (waiting) return \"the waiting session\";", "  if (command) return \"a headless run\";", "  return \"the inbox\";", "}", ""].join("\n"));
git("add", "-A"); git("commit", "-q", "-m", "start");
// set up (`reel init` ran), with a headless command a review would start: a round must never start it
const RP = join(repo, ".reelplanner"), marker = join(tmp, "agent-ran"); mkdirSync(RP, { recursive: true });
writeFileSync(join(RP, "decisions.json"), JSON.stringify({ decisions: [] }));
writeFileSync(join(RP, "config.json"), JSON.stringify({ agent: { command: [process.execPath, "-e", `require("fs").writeFileSync(${JSON.stringify(marker)}, "")`] } }));
const align = (...a) => { try { return { code: 0, out: execFileSync(process.execPath, [join(ROOT, "scripts/align.mjs"), ...a], { cwd: repo, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };

align("how a review is handed on", "src/send.mjs", "--slug", "handed-on", "--date", "2026-11-18");
const dir = join(RP, "align", "2026-11-18-handed-on"), name = "2026-11-18-handed-on";
const md = read(join(dir, "align.md"));
const predict = (id, q, answer) => `### ${id} · predict\n- question: ${q}\n- option_a: The inbox\n- option_b: A headless run\n- option_c: The waiting session\n- answer: ${answer}\n- source: src/send.mjs:3-5\n- quote: "if (command) return"\n- why: A session waiting takes it first; then a set command; then the inbox.\n- likely_wrong: it looks like it always waits\n- matters: who works on it\n`;
writeFileSync(join(dir, "align.md"), `${md.slice(0, md.indexOf("## Cards"))}## Cards\n\n### c1 · say\n- question: Say how you think a review is handed on.\n- likely_wrong: three ways run together\n- matters: the whole picture\n\n${predict("c2", "No session is waiting and a command is set. Where does the review go?", "b")}\n${predict("c3", "A session is waiting and a command is set. Where does it go?", "c")}\n${predict("c4", "Nobody waits and no command is set. Where does it go?", "a")}\n### c5 · assume\n- question: I'm assuming "the agent" in your words is the session you have open.\n- likely_wrong: your words say the agent\n- matters: step 2\n`);
mkdirSync(join(dir, "checker"), { recursive: true }); writeFileSync(join(dir, "checker", "answers.md"), "- c2: b\n- c3: c\n- c4: a\n");
ok("the scratch round passes --check", align(dir, "--check").code === 0, align(dir, "--check").out);

const procs = [];
try {
  const port = testPort(20000 + Math.floor(Math.random() * 10000));
  const srv = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), dir, "--no-open", "--no-notify", "--port", String(port), "--out", join(tmp, "bundle")],
    { cwd: repo, env: { ...env } });
  procs.push(srv);
  let log = ""; srv.stdout.on("data", (d) => (log += d)); srv.stderr.on("data", (d) => (log += d));
  const base = await until(() => log.match(/review page: (http:\/\/127\.0\.0\.1:\d+\/)/)?.[1], 60000);
  ok("review <round>: a page with no video to build", !!base && /round\/\?r=2026-11-18-handed-on/.test(log), log);
  if (!base) throw new Error("no server");
  const page = await fetch(`${base}round/?r=${name}`).then((r) => r.text());
  ok("/round/ serves the round page, marked as served here", /id="card"/.test(page) && /reelplanning-review-server/.test(page));
  ok("…and its fonts", (await fetch(`${base}round/fonts/inter-latin-wght-normal.woff2`)).status === 200);
  const get = (p) => fetch(`${base}${p}`).then((r) => r.json());
  const post = (p, body, headers = {}) => fetch(`${base}${p}`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) }).then(async (r) => ({ code: r.status, ...(await r.json()) }));

  const front = await get(`api/round?r=${name}`);
  ok("GET /api/round: assume first, then predict, then say", front.ok && front.cards.map((c) => c.kind).join(",") === "assume,predict,predict,predict,say", JSON.stringify(front).slice(0, 400));
  ok("…and no answer, why or lines before you answer", !/headless run\\";|A session waiting takes it first|"answer":"b"/.test(JSON.stringify(front)) && front.words === "how a review is handed on", JSON.stringify(front));
  ok("an unknown round is a 404", (await fetch(`${base}api/round?r=nope`)).status === 404);
  ok("another site's page is refused", (await post("api/round/answer", { r: name, card: "c2", answer: "a" }, { origin: "http://evil.example" })).code === 403);

  let r = await post("api/round/answer", { r: name, card: "c2", answer: "a" });
  ok("a wrong pick turns the card over: the lines, the answer and why, a gap", r.ok && r.back.gap === "gap" && r.back.answer === "b" && /if \(command\) return "a headless run";/.test(r.back.lines) && /waiting takes it first/.test(r.back.why), JSON.stringify(r));
  ok("…settled four ways", r.back.settles.join(",") === "got-it,change-plan,code-wrong,show-more", JSON.stringify(r.back));
  r = await post("api/round/answer", { r: name, card: "c2", answer: "a", settled: "got-it" });
  r = await post("api/round/answer", { r: name, card: "c2", answer: "a", settled: "got-it" });
  const knows = read(join(RH, "you.jsonl")).split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((f) => f.kind === "knows");
  ok("Got it, sent twice, lands once in your file", knows.length === 1 && knows[0].path === "src/send.mjs", read(join(RH, "you.jsonl")));
  r = await post("api/round/answer", { r: name, card: "c2", answer: "c" });
  ok("a card answered again with another pick is settled again, not by the old way", r.ok && r.back.gap === "gap" && !JSON.parse(read(join(dir, "answers.json"))).cards.c2.settled, JSON.stringify(JSON.parse(read(join(dir, "answers.json"))).cards.c2));
  r = await post("api/round/answer", { r: name, card: "c2", answer: "a", settled: "got-it" });
  r = await post("api/round/answer", { r: name, card: "c3", answer: "not-sure" });
  ok("Not sure settles only Got it or Show me more", r.ok && r.back.gap === "not-sure" && r.back.settles.join(",") === "got-it,show-more", JSON.stringify(r));
  r = await post("api/round/answer", { r: name, card: "c3", answer: "not-sure", settled: "change-plan" });
  ok("…and refuses Change the plan", r.code === 400, JSON.stringify(r));
  r = await post("api/round/answer", { r: name, card: "c3", answer: "not-sure", settled: "show-more" });
  r = await post("api/round/answer", { r: name, card: "c5", answer: "right" });
  ok("an assume card: Right is recorded, with no back of lines", r.ok && !r.back.lines, JSON.stringify(r));
  const rec = JSON.parse(read(join(dir, "answers.json")));
  ok("one record, the chat's, each answer via the page", rec.cards.c2.via === "page" && rec.cards.c3.settled === "show-more" && rec.cards.c5.answer === "right", JSON.stringify(rec));

  r = await post("api/round/say", { r: name, card: "c1", words: "It always waits for my session, and otherwise it is lost." });
  const qdir = join(RP, "inbox", "questions");
  const q = existsSync(qdir) ? readdirSync(qdir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(read(join(qdir, f)))).find((x) => x.kind === "say") : null;
  ok("your words: a question for the waiting session, with the command that records its claims", r.ok && q && /align answer/.test(q.question) && /otherwise it is lost/.test(q.question), JSON.stringify(r));
  ok("…not checked yet", (await get(`api/round/say?r=${name}&card=c1`)).checked === false);
  writeFileSync(join(tmp, "claims.json"), JSON.stringify([{ words: "It always waits for my session", verdict: "differs", source: "src/send.mjs:3-5" }, { words: "otherwise it is lost", verdict: "differs", source: "src/send.mjs:5-5" }]));
  const a = align("answer", dir, "c1", join(tmp, "claims.json"));
  const claims = await get(`api/round/say?r=${name}&card=c1`);
  ok("…its claims come back once `align answer` records them", a.code === 0 && claims.checked && claims.claims.length === 2, `${a.out}\n${JSON.stringify(claims)}`);

  const audio = await fetch(`${base}api/round/transcribe`, { method: "POST", headers: { "content-type": "text/plain" }, body: "x" });
  ok("transcribe takes audio only", audio.status === 415);
  const noWhisper = await fetch(`${base}api/round/transcribe`, { method: "POST", headers: { "content-type": "audio/webm" }, body: "x" }).then((x) => x.json());
  ok("…and with no whisper here, says to type instead", noWhisper.ok === false && /type your words instead/.test(noWhisper.error), JSON.stringify(noWhisper));

  r = await post("api/round/send", { r: name, skipped: ["c4"] });
  const rows = readdirSync(join(RP, "inbox")).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(read(join(RP, "inbox", f))));
  const row = rows.find((x) => x.review?.kind === "align");
  ok("Send: the round into the inbox, kind align, with what each gap settled to", r.ok && row && /c2 Got it/.test(row.review.summary) && /1 skipped/.test(row.review.summary), JSON.stringify(r));
  ok("…skipped cards listed as Assumed, not checked", JSON.parse(read(join(dir, "answers.json"))).skipped.includes("c4"));
  await sleep(1500);
  ok("…and the configured headless command never ran", !existsSync(marker) && r.handledBy !== "agent", JSON.stringify(r));
  // the say question answered (the session checked the words), the waiter takes the round, and says what to do with it
  execFileSync(process.execPath, [join(ROOT, "scripts/inbox.mjs"), "answer", q.id, "checked", "--from", "the round's sources"], { cwd: repo, env, stdio: "ignore" });
  const w = spawnSync(process.execPath, [join(ROOT, "scripts/inbox.mjs"), "--wait", "--timeout", "5"], { cwd: repo, env, encoding: "utf8" });
  ok("`review --wait` takes the round and says what to do with it, no decision log", /\.json/.test(w.stdout) && /🃏 the round \.reelplanner\/align\/2026-11-18-handed-on/.test(w.stderr) && /Nothing goes into the decision log/.test(w.stderr), `${w.stdout}${w.stderr}`);

  // ── in the browser ──
  let chromium = null; try { ({ chromium } = await import("playwright-core")); } catch {}
  if (chromium) {
    // a fresh round, nothing answered
    align("the fresh one", "src/send.mjs", "--slug", "fresh", "--date", "2026-11-18");
    const d2 = join(RP, "align", "2026-11-18-fresh");
    const m2 = read(join(d2, "align.md"));
    writeFileSync(join(d2, "align.md"), `${m2.slice(0, m2.indexOf("## Cards"))}## Cards\n\n${predict("c1", "No session is waiting and a command is set. Where does the review go?", "b")}\n${predict("c2", "Nobody waits and no command is set. Where does it go?", "a")}`);
    let browser; try { browser = await chromium.launch(); } catch { try { browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); } catch {} }
    if (browser) {
      const p = await browser.newPage();
      await p.goto(`${base}round/?r=2026-11-18-fresh`);
      await p.waitForSelector(".opt");
      ok("the page: one card at a time, its question in the serif", /Where does the review go\?/.test(await p.textContent("h2")) && (await p.$$(".opt")).length === 4);
      await p.keyboard.press("a");
      await p.waitForSelector(".slab");
      ok("a key answers it, and it turns over to the code's own lines", /a headless run/.test(await p.textContent(".slab")) && /A gap/.test(await p.textContent(".verdict")));
      ok("…Next waits until it is settled", await p.$eval("#next", (b) => b.disabled));
      await p.keyboard.press("1");
      await p.waitForFunction(() => /Nobody waits/.test(document.querySelector("h2").textContent), null, { timeout: 5000 }).catch(() => {});
      ok("1 settles it Got it, and the next card comes", /Nobody waits/.test(await p.textContent("h2")), await p.textContent("main"));
      await p.keyboard.press("a");
      await p.waitForSelector(".verdict", { timeout: 5000 }).catch(() => {});
      ok("a right pick: Same picture, and it moves on by itself", /Same picture/.test(await p.textContent(".verdict")));
      await p.waitForFunction(() => /Send/.test(document.querySelector("main").textContent), null, { timeout: 5000 });
      await p.click("#send");
      await p.waitForFunction(() => /waiting for a session|sent to the session/.test(document.getElementById("status").textContent), null, { timeout: 5000 });
      ok("Send says where it went, never a headless run", /a round never starts a headless run|sent to the session/.test(await p.textContent("#status")), await p.textContent("#status"));
      await browser.close();
    } else console.log("· skipped the in-browser checks: no Chromium here");
  } else console.log("· skipped the in-browser checks: playwright-core is not installed");
} finally { for (const p of procs) p.kill(); }
console.log(failed ? `\n✗ ${failed} check(s) failed` : "\n✓ align-page: all checks passed");
process.exit(failed ? 1 : 0);
