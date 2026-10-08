#!/usr/bin/env node
// A question met again (the owner: "we should be able to go back to the timestamp before a question
// or quiz and that should reappear"), and the line under a quick check that says it is wrong.
//   - played back through, an answered question shows again, answered, Continue focused, and goes on
//     by itself in 4 s (a quick check just answered waits 10 s: answer-on-the-video step 5); it does not
//     stop again until the playhead goes back before it
//   - its mark on the timeline, or its time in the record, opens it at once, paused, no countdown
//   - a call or a choice met again can be changed: the record and the export follow; a quiz's answer stands
//   - "Expected something else?" under a quick check: the countdown waits while it is written in,
//     Enter keeps it as the quiz's note, in the record, the copy text and the export
// Runs on L2 with the quiz fixture: choices q1–q3 with branches, quick check ktest, the agent's call atest.
// usage: node packages/player/test/revisit.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { tmpdir } from "node:os"; import { join } from "node:path";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-quiz-autonomy.json";
const port = testPort(8879);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`;
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
const ready = () => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el.stage?.dataset.ready && el._bandIn !== undefined; }, null, { timeout: 90000 });
await p.goto(url); await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload(); await ready();
const rp = p.locator("#rp");
const E = (f, a) => p.evaluate(f, a);
// Every wait is on what it waits for, never a fixed time: a loaded machine (the full run) outlasts any.
// until: wait for a state; the check after it says whether it came.
const until = (f, a) => p.waitForFunction(f, a, { timeout: 20000, polling: 50 }).catch(() => null);
// a hold: this many ms by the page's own clock (a "nothing happens for a while" check: the page's timers are what it is about)
const pageHold = async (ms) => { const t0 = await E(() => performance.now()); await p.waitForFunction(([t0, ms]) => performance.now() - t0 >= ms, [t0, ms], { timeout: ms + 60000, polling: 100 }).catch(() => {}); };
const sheetOn = (on = true) => until((on) => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on") === on, on);
// the video going on is playing, its time moving (a pause sent while a play is still on its way into the frame's
// page is overtaken by it)
const movesOn = async () => { const t0 = await E(() => document.querySelector("#rp").player.currentTime); await until((t0) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime > t0 + 0.02; }, t0); };
// where the video plays from after an action: its time when the player is told to play (a look once it plays is
// later by however long the page took to get there)
const playsFrom = async (act) => {
  await E(() => { const pl = document.querySelector("#rp").player; window.__rpPlayAt = null; if (!pl.__rpArmed) { const o = pl.play.bind(pl); pl.play = (...a) => { if (window.__rpPlayAt == null) window.__rpPlayAt = pl.currentTime; return o(...a); }; pl.__rpArmed = true; } });
  await act(); await until(() => window.__rpPlayAt != null && !document.querySelector("#rp").player.paused); return E(() => window.__rpPlayAt); };
const T = () => E(() => { const pl = document.querySelector("#rp").player; return { t: pl.currentTime, paused: pl.paused }; });
const sheet = () => E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision");
  return { on: d.classList.contains("on"), k: d.querySelector(".k").textContent, fb: d.querySelector(".feedback").style.display === "block" ? d.querySelector(".feedback").textContent : "", go: !d.querySelector(".gobtn").hidden, focus: r.activeElement?.dataset?.act || r.activeElement?.tagName || null, hint: d.querySelector(".hint").textContent, live: "live" in d.querySelector(".hint").dataset,
    chosen: [...d.querySelectorAll('.opt[data-chosen="true"]')].map((o) => o.dataset.quiz || o.dataset.choose || o.dataset.verdict).join(), disabled: [...d.querySelectorAll(".opt")].every((o) => o.disabled),
    dis: d.querySelector(".disagree").classList.contains("on"), wrong: "wrong" in d.querySelector(".disagree").dataset, pending: !!el._pendingDecision }; });
const seekPause = (t) => E((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, t);
// Into a question as a reviewer meets it, waiting on what each step waits for rather than a time (a loaded machine
// outlasts any): the seek landed and the video still (a play on its way into the frame's page lands first, and Play
// is then a play), the question up, and laid out for good (the frame looked at again, recheckCards; drawn since)
const playInto = async (at) => {
  await seekPause(at - 1.2);
  await p.waitForFunction((t) => { const pl = document.querySelector("#rp").player, w = (window.__rpStill ||= { t: null, n: 0 }); if (!pl.paused || Math.abs(pl.currentTime - t) > 0.1 || pl.currentTime !== w.t) { w.t = pl.currentTime; w.n = 0; return false; } return ++w.n >= 5; }, at - 1.2, { timeout: 20000, polling: 50 }).catch(() => {});
  await E(() => { delete window.__rpStill; });
  await rp.locator('[data-act="play"]').click();
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
  await p.waitForFunction(() => !document.querySelector("#rp")._cardsT && document.fonts.status === "loaded", null, { timeout: 20000 }).catch(() => {});
  await E(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
};
const pm = await E(() => document.querySelector("#rp").planMap);
const q = pm.quizzes[0], a = pm.autonomy[0], d = pm.decisions[0];
// a mark on the timeline, clicked where it is drawn: measured once the page has stopped moving (the record sheet put
// away slides the timeline back; measured on the way, the click missed the mark and only sought)
const clickTick = async (at) => { await until(() => document.querySelector("#rp").shadowRoot.getAnimations().every((a) => a.playState !== "running" || a.effect?.getComputedTiming().endTime === Infinity)); const sc = await rp.locator(".scrub").boundingBox(); const dur = await E(() => document.querySelector("#rp").dur()); await p.mouse.click(sc.x + (at / dur) * sc.width + 1, sc.y + sc.height / 2); await until(() => { const el = document.querySelector("#rp"); return el.shadowRoot.querySelector(".decision").classList.contains("on") && el.player.paused; }); };

try {
  // ---- 3. a quick check answered wrong: the line to say it is wrong, and the countdown waiting on it
  await playInto(q.at);
  await p.keyboard.press("a"); await p.waitForFunction((id) => { const el = document.querySelector("#rp"); return !!el.quizzes[id] && el.shadowRoot.querySelector(".decision .disagree").classList.contains("on"); }, q.id, { timeout: 20000 }).catch(() => {});
  let s = await sheet();
  const lab = await E(() => { const r = document.querySelector("#rp").shadowRoot, l = r.querySelector(".disagree label"), i = r.querySelector(".disagree textarea"); const b = l.getBoundingClientRect(); return { text: l.textContent, ph: i.placeholder, color: getComputedStyle(l).color, h: b.height, w: b.width }; });
  ok(s.dis && s.wrong && lab.text === "Expected something else?" && /Say how it should work/.test(lab.ph) && lab.h > 0, `answered wrong, "Expected something else? Say how it should work" shows under the answer — ${JSON.stringify(lab)}`);
  ok(lab.color === "rgb(156, 69, 36)", `and, wrong, its question is in the text coral — ${lab.color}`);
  ok(s.go && s.focus === "quiz-go" && s.live, "Continue still has the keyboard and counts down");
  await rp.locator("[data-disagree]").click();
  await p.keyboard.type("a second PUT should say it was already stored");
  await pageHold(10800);
  s = await sheet();
  ok(s.on && (await T()).paused, "writing in it, the 10 s countdown waits");
  ok(await E(() => document.querySelector("#rp").quizzes.ktest.answer === "a"), "and the letters typed answer nothing again");
  await p.keyboard.press("Enter"); await until(() => !!document.querySelector("#rp").quizzes.ktest?.note);
  const kept = await E(() => { const el = document.querySelector("#rp"); return { note: el.quizzes.ktest.note, stored: JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.endsWith(":quiz")))).ktest.note, row: el.shadowRoot.querySelector('textarea[data-qnote="ktest"]')?.value, line: el.lineFor("quiz:ktest"), text: el.reviewText(), ex: el.exportPayload().quizzes.find((x) => x.id === "ktest") }; });
  ok(kept.note === "a second PUT should say it was already stored" && kept.stored === kept.note, `Enter keeps it as the quick check's note, saved — ${JSON.stringify(kept.note)}`);
  ok(kept.row === kept.note && /Expected something else: a second PUT/.test(kept.line) && /## Quick checks[\s\S]*a second PUT/.test(kept.text), "it is in the record under the answer, and in the copy text");
  ok(kept.ex?.note === kept.note && kept.ex.correct === false, `and the review carries it on that quiz — ${JSON.stringify(kept.ex)}`);
  s = await sheet();
  ok(s.focus === "quiz-go" && (s.live || /Waits while you are here/.test(s.hint)), `Enter hands the keys back to Continue, and the countdown starts again (or waits while the pointer is on the band) — ${s.hint}`);
  await p.mouse.move(5, 5);   // the pointer off the band: the count runs (answer-on-the-video step 5)
  await p.waitForFunction(() => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 13000 });
  await movesOn();
  ok(!(await T()).paused, "then it goes on by itself");
  await E(() => document.querySelector("#rp").player.pause());

  // ---- 2. played back through, the answered quick check shows again, answered, and goes on
  await playInto(q.at);
  s = await sheet();
  ok(/answered/.test(s.k) && /Not quite — it is B/.test(s.fb) && /idempotent/.test(s.fb) && s.chosen === "a" && s.disabled, `replayed, the quick check comes back with its answer, the right one and why — ${JSON.stringify({ k: s.k, fb: s.fb, chosen: s.chosen })}`);
  ok(s.go && s.focus === "quiz-go" && /Continues in \d+ s/.test(s.hint), "Continue has the focus, counting down");
  ok(await E(() => document.querySelector("#rp").shadowRoot.querySelector("[data-disagree]").value === "a second PUT should say it was already stored"), "the words kept under it are there to read or change");
  await p.keyboard.press("b"); await E(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));   // a key is handled as it lands
  ok(await E(() => document.querySelector("#rp").quizzes.ktest.answer === "a"), "a quick check's first answer stands: a letter does not change it");
  await p.waitForFunction(() => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 7000 });
  await until((t) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime > t; }, q.at + 0.5);
  let st = await T();
  ok(!st.paused && st.t > q.at + 0.5 && !(await sheet()).on, `it goes on by itself after 4 s, and does not stop there again — t=${st.t.toFixed(2)}`);
  // a little back, but not before it: still met once
  await E((t) => document.querySelector("#rp").player.seek(t), q.at + 0.1); await pageHold(700);
  ok(!(await sheet()).on, "landing just after it, once it has been met, does not stop again");
  await E(() => document.querySelector("#rp").player.pause());

  // ---- 2. its mark on the timeline opens it at once, paused, and it waits for the reviewer
  await seekPause(30); await until(() => { const pl = document.querySelector("#rp").player; return pl.paused && Math.abs(pl.currentTime - 30) < 0.1; });
  await E(() => document.querySelector("#rp").player.play()); await movesOn();
  await clickTick(q.at);
  st = await T(); s = await sheet();
  ok(s.on && st.paused && Math.abs(st.t - q.at) < 0.8 && /answered/.test(s.k) && s.chosen === "a", `clicking the answered quick check's circle opens it, paused, answered — t=${st.t.toFixed(2)} ${s.k}`);
  await pageHold(4600);
  s = await sheet();
  ok(s.on && s.go && !s.live, "opened on purpose, it has no countdown: it stays until Continue");
  await p.keyboard.press(" "); await sheetOn(false); await movesOn();
  s = await sheet(); st = await T();
  ok(!s.on && !st.paused, `space goes on — ${JSON.stringify({ on: s.on, paused: st.paused, t: st.t.toFixed(2) })}`);
  await E(() => document.querySelector("#rp").player.pause());

  // ---- 2. the agent's call: judged, met again, changed; the export follows
  await playInto(a.at);
  await p.keyboard.press("a"); await until(() => document.querySelector("#rp").autonomy.atest?.verdict === "accept");
  ok(await E(() => document.querySelector("#rp").autonomy.atest?.verdict === "accept"), "the call accepted");
  await movesOn(); await E(() => document.querySelector("#rp").player.pause());
  await playInto(a.at);
  s = await sheet();
  ok(/answered/.test(s.k) && /You accepted it/.test(s.fb) && s.chosen === "accept" && s.focus === "quiz-go", `replayed, the call comes back with its verdict ringed — ${JSON.stringify({ k: s.k, fb: s.fb, chosen: s.chosen })}`);
  const ring = await E(() => getComputedStyle(document.querySelector("#rp").shadowRoot.querySelector('.decision .opt[data-chosen="true"]')).boxShadow);
  ok(/184, 85, 46/.test(ring), `the ring is the coral of your verdict — ${ring}`);
  await p.keyboard.press("b"); await until(() => document.querySelector("#rp").autonomy.atest?.verdict === "flag"); await sheetOn(false); await movesOn();
  let ex = await E(() => { const el = document.querySelector("#rp"); return { v: el.exportPayload().autonomy.find((x) => x.id === "atest")?.verdict, flags: el.annotations.filter((x) => x.kind === "flag").length, on: el.shadowRoot.querySelector(".decision").classList.contains("on"), playing: !el.player.paused }; });
  ok(ex.v === "flag" && ex.flags === 1 && !ex.on && ex.playing, `B on the call met again flags it instead: the export says flag, and it goes on — ${JSON.stringify(ex)}`);
  await E(() => document.querySelector("#rp").player.pause());
  // its time in the record opens it too
  await rp.locator(".grab").click(); await until(() => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled"));
  await rp.locator('.autolog [data-point="call:atest"]').click(); await until(() => { const el = document.querySelector("#rp"); return el.shadowRoot.querySelector(".decision").classList.contains("on") && el.player.paused; });
  s = await sheet(); st = await T();
  ok(s.on && st.paused && Math.abs(st.t - a.at) < 0.8 && /You flagged it/.test(s.fb) && !(await E(() => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled"))), `its time in the record opens it on the video, paused, the record put away — ${s.fb}`);
  await p.keyboard.press("a"); await until(() => document.querySelector("#rp").autonomy.atest?.verdict === "accept");
  ex = await E(() => { const el = document.querySelector("#rp"); return { v: el.exportPayload().autonomy.find((x) => x.id === "atest")?.verdict, flags: el.annotations.filter((x) => x.kind === "flag").length, log: el.shadowRoot.querySelector(".autolog").textContent }; });
  ok(ex.v === "accept" && ex.flags === 0 && /Accepted/.test(ex.log), `and changed back to accepted, the flag it made goes with it — ${JSON.stringify(ex)}`);
  await E(() => document.querySelector("#rp").player.pause());

  // ---- 2. a plan choice: answered, opened from its diamond, changed, routed as a fresh answer
  await playInto(d.at);
  await p.keyboard.press("a"); await until(() => !!document.querySelector("#rp").decisions.q1); await movesOn();
  await E(() => document.querySelector("#rp").player.pause());
  await seekPause(20); await until(() => { const pl = document.querySelector("#rp").player; return pl.paused && Math.abs(pl.currentTime - 20) < 0.1; });
  await clickTick(d.at);
  s = await sheet();
  const tag = await E(() => document.querySelector("#rp").shadowRoot.querySelector('.decision .opt[data-chosen="true"] .tag')?.textContent);
  ok(s.on && /answered/.test(s.k) && s.chosen === "a" && tag === "your answer" && !s.disabled && (await T()).paused, `clicking the choice's diamond opens it, its answer marked, the others still pickable — ${JSON.stringify({ k: s.k, chosen: s.chosen, tag })}`);
  // its frame has a card per option: the card is what is clicked (answer-on-the-video step 1)
  const from = await playsFrom(() => rp.locator('.hits .hit[data-hit="b"]').click());
  const ob = d.options.find((o) => o.id === "b");
  st = await T(); if (from != null) st.t = from;
  ex = await E(() => document.querySelector("#rp").exportPayload().decisions.find((x) => x.id === "q1"));
  ok(ex?.option === "b" && ex.label === ob.label && !(await sheet()).on && Math.abs(st.t - ob.branch.start) < 1.2 && !st.paused, `picking another replaces the answer and plays its branch — ${JSON.stringify({ option: ex?.option, t: st.t.toFixed(2) })}`);
  await E(() => document.querySelector("#rp").player.pause());
  // the quick check's time in the record opens it, answered
  await rp.locator(".grab").click(); await until(() => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled"));
  await rp.locator('.decisions [data-point="check:ktest"]').click(); await until(() => { const el = document.querySelector("#rp"); return el.shadowRoot.querySelector(".decision").classList.contains("on") && el.player.paused; });
  s = await sheet();
  ok(s.on && /Not quite/.test(s.fb) && Math.abs((await T()).t - q.at) < 0.8, "a quick check's time in the record opens it too");
  await p.keyboard.press(" "); await sheetOn(false); await movesOn(); await E(() => document.querySelector("#rp").player.pause());

  // ---- a question never answered, opened from its mark, is asked as usual
  const d2 = pm.decisions[1];
  await clickTick(d2.at);
  s = await sheet();
  ok(s.on && !/answered/.test(s.k) && !s.go && !s.chosen && (await T()).paused, `an open question's mark asks it, as reaching it would — ${s.k}`);
  await p.keyboard.press("a"); await until(() => !!document.querySelector("#rp").decisions.q2);
  ok(await E(() => document.querySelector("#rp").decisions.q2?.option === "a"), "and it is answered from there");
  await movesOn(); await E(() => document.querySelector("#rp").player.pause());

  // ---- light and dark: the answered sheet with the line under it
  await clickTick(q.at);
  await p.screenshot({ path: join(tmpdir(), "rp-revisit-light.png") });
  await E(() => document.querySelector("#rp").setTheme("dark")); await E(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const dk = await E(() => { const r = document.querySelector("#rp").shadowRoot; return { label: getComputedStyle(r.querySelector(".disagree label")).color, input: getComputedStyle(r.querySelector(".disagree textarea")).color }; });
  ok(dk.label === "rgb(227, 161, 132)" && dk.input === "rgb(242, 239, 232)", `in dark, the question is the light text coral and the words ink — ${JSON.stringify(dk)}`);
  await p.screenshot({ path: join(tmpdir(), "rp-revisit-dark.png") });
  await E(() => document.querySelector("#rp").setTheme("light"));
} catch (e) { fails.push(e.message); console.error("✗", e.message); }
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
