// Knowledge level skip, quiz beat, autonomy beat, quick checks on or off: e2e on L2 with a synthetic map.
import { chromium } from "playwright-core"; import { existsSync } from "node:fs"; import { resolve } from "node:path";
import { launchOpts, testPort, serverUp, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, now, movedOn, countedDown } from "./wait.mjs";
const root = resolve(new URL("../../..", import.meta.url).pathname);
const project = process.argv[2] || "videos/l2-upload-resume", map = process.argv[3] || "packages/player/test/fixtures/l2-quiz-autonomy.json";
const port = testPort(8801); const server = staticServer(port, { dir: root }); await serverUp(port, { child: server });
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } }); const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
let ok = true; const check = (n, c, x = "") => { console.log(`${c ? "✓" : "✗"} ${n}${x ? " — " + x : ""}`); if (!c) ok = false; };
// answered, and its Continue up (what the answer lays out, drawn)
const answered = async (id) => { await until(page, (id) => { const el = document.querySelector("#rp"), g = el.shadowRoot.querySelector(".gobtn"); return !!el.quizzes[id] && !!g && !g.hidden; }, id); await frames(page); };
// the sheet gone and the video playing on from t0
const goneOn = async (t0) => { await until(page, () => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on")); await movedOn(page, t0); };
const P = () => page.evaluate(() => { const p = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return { t: p.currentTime, paused: p.paused }; });
try {
  await page.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`);
  await page.evaluate(() => { try { localStorage.clear(); } catch {} }); await page.reload();
  await page.waitForFunction(() => { const p = document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player"); return p && p.ready && document.querySelector("#rp").planMap; }, null, { timeout: 60000 });
  const pm = await page.evaluate(() => document.querySelector("#rp").planMap);
  // 1. knowledge level: as "owner", playing into frame 3 (tagged new,familiar) must skip to frame 4
  check("level selector shown with per-level seconds", await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".level").style.display !== "none" && /s at this level/.test(document.querySelector("#rp").shadowRoot.querySelector(".lvl-len").textContent)));
  await page.locator("#rp").locator("select[data-level]").selectOption("owner");
  const f3 = pm.frames.find((f) => f.index === 3), f4 = pm.frames.find((f) => f.index === 4);
  await page.evaluate((t) => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").seek(t), f3.start - 0.8);
  await page.locator("#rp").locator('[data-act="play"]').click();
  await page.waitForFunction((s) => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").currentTime >= s - 0.3, f4.start, { timeout: 15000 });
  const afterSkip = await P(); check("owner level skips the cast frame", afterSkip.t >= f4.start - 0.3 && afterSkip.t < f4.start + 2.5, `t=${afterSkip.t.toFixed(2)} frame4 starts ${f4.start}`);
  await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").pause());
  // 2. quiz: seek before it, play, answer wrong, feedback shows the right one, then playback resumes
  const q = pm.quizzes[0];
  await page.evaluate((t) => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").seek(t), q.at - 1.2);
  await page.locator("#rp").locator('[data-act="play"]').click();
  await page.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 15000 });
  const qs = await page.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { opts: r.querySelectorAll('.decision .opt[data-quiz]').length, k: r.querySelector(".decision .k").textContent }; });
  check("quiz overlay with three options", qs.opts === 3 && /Quick check/.test(qs.k), JSON.stringify(qs));
  await page.locator("#rp").locator('.decision .opt[data-quiz="a"]').click();
  const fb = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision .feedback").textContent);
  check("wrong answer gets the correction + explanation", /Not quite/.test(fb) && /idempotent/.test(fb), fb.slice(0, 60));
  // 10 s after a quick check is answered (answer-on-the-video step 5): the count runs down to the end, and the video
  // plays on from where it waited (its time moving, not just asked to: paused reads true for a moment after a play)
  const tQ = await now(page), counted = await countedDown(page), afterQ = await P();
  check("playback resumes after the explanation", counted && !!(await movedOn(page, tQ)), JSON.stringify({ counted, ...afterQ }));
  // 2b. moving the playhead during the countdown closes the answered check; the next one starts clean
  await page.evaluate((qq) => { const el = document.querySelector("#rp"); el.player.pause(); delete el.quizzes[qq.id]; el.askQuiz(qq); }, q);
  await page.locator("#rp").locator('.decision .opt[data-quiz="b"]').click(); await until(page, (id) => !!document.querySelector("#rp").quizzes[id], q.id);
  await page.evaluate((t) => document.querySelector("#rp").jump(t), Math.max(0, q.at - 6));   // what a scrub click does
  const moved = await page.evaluate(() => { const el = document.querySelector("#rp"); return { on: el.shadowRoot.querySelector(".decision").classList.contains("on"), pending: !!el._pendingDecision }; });
  check("a scrub during the countdown closes the answered quick check", !moved.on && !moved.pending, JSON.stringify(moved));
  await page.evaluate((qq) => { const el = document.querySelector("#rp"); delete el.quizzes[qq.id]; el.askQuiz(qq); }, q);
  const fresh = await page.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { fb: r.querySelector(".decision .feedback").style.display, dis: [...r.querySelectorAll(".decision .opt[data-quiz]")].some((b) => b.disabled) }; });
  check("and the next quick check opens clean, not showing the last one's answer", fresh.fb === "none" && !fresh.dis, JSON.stringify(fresh));
  await page.locator("#rp").locator('.decision .opt[data-quiz="a"]').click();
  // its 10 s wait, then it goes on and is met once in this pass: the sheet gone and the video playing past it (by the
  // page's own clock: a loaded machine's page runs its timers late). Past it, so the next play (2c) cannot meet it again
  // while the test is still looking: met again, answered, it waits 4 s, and on a loaded machine the look came that late
  await until(page, (at) => { const el = document.querySelector("#rp"); return !el.shadowRoot.querySelector(".decision").classList.contains("on") && !el.player.paused && el.player.currentTime > at + 1; }, q.at, 60000);
  // 2c. once answered, Continue is the way on, and it takes the focus: a clicked option is disabled by
  // the answer, and focus used to fall to <body>, out of the player, so space did nothing (the owner's bug)
  const qstate = () => page.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { on: r.querySelector(".decision").classList.contains("on"), paused: el.player.paused, act: r.activeElement?.dataset?.act || null, host: document.activeElement === el, body: document.activeElement === document.body, go: !!r.querySelector(".gobtn") && !r.querySelector(".gobtn").hidden, hint: r.querySelector(".decision .hint").textContent }; });
  await page.evaluate((qq) => { const el = document.querySelector("#rp"); el.player.pause(); delete el.quizzes[qq.id]; el.askQuiz(qq); }, q);
  await page.locator("#rp").locator('.decision .opt[data-quiz="a"]').click(); await answered(q.id);
  let qs2 = await qstate();
  check("answered by a click, Continue shows and has the focus", qs2.on && qs2.go && qs2.act === "quiz-go" && qs2.host && /Continues in \d+ s/.test(qs2.hint), JSON.stringify(qs2));
  let t0 = await now(page); await page.keyboard.press(" "); await goneOn(t0);
  qs2 = await qstate();
  check("then space goes on at once: the sheet closes and the video plays", !qs2.on && !qs2.paused, JSON.stringify(qs2));
  check("and the keys stay with the player, not <body>", qs2.host && !qs2.body, JSON.stringify(qs2));
  await page.evaluate((qq) => { const el = document.querySelector("#rp"); el.player.pause(); delete el.quizzes[qq.id]; el.askQuiz(qq); }, q);
  await page.keyboard.press("a"); await answered(q.id);
  qs2 = await qstate();
  check("answered by its key, Continue has the focus too", qs2.on && qs2.act === "quiz-go", JSON.stringify(qs2));
  t0 = await now(page); await page.locator("#rp").locator('[data-act="quiz-go"]').click(); await goneOn(t0);
  qs2 = await qstate();
  check("a click on Continue goes on at once", !qs2.on && !qs2.paused && !qs2.body, JSON.stringify(qs2));
  // 3. autonomy: seek before it, play, Flag → annotation of kind flag on the step
  const a = pm.autonomy[0];
  await page.evaluate((t) => { const p = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); p.pause(); p.seek(t); }, a.at - 1.2);
  await page.locator("#rp").locator('[data-act="play"]').click();
  await page.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 15000 });
  const as = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision .k").textContent);
  check("autonomy overlay shown, named in plain words (D-127: choice, not call)", /^The agent's choice ATEST · step/.test(as), as);
  await page.locator("#rp").locator('.decision .opt[data-verdict="flag"]').click(); await until(page, (id) => !!document.querySelector("#rp").autonomy[id] && document.querySelector("#rp").annotations.some((x) => x.kind === "flag"), a.id);
  const flagged = await page.evaluate(() => document.querySelector("#rp").annotations.filter((x) => x.kind === "flag").map((x) => ({ step: x.plan?.step, c: x.comment })));
  check("Flag creates a step-anchored annotation", flagged.length === 1 && flagged[0].step === 3, JSON.stringify(flagged));
  const ex = await page.evaluate(() => new Promise((res) => { const el = document.querySelector("#rp"); el.addEventListener("annotations", (e) => res(e.detail), { once: true }); el.export(); }));
  check("export carries quiz, autonomy and level", ex.quizzes?.length === 1 && ex.quizzes[0].correct === false && ex.autonomy?.[0]?.verdict === "flag" && ex.knowledgeLevel === "owner", JSON.stringify({ q: ex.quizzes, a: ex.autonomy, l: ex.knowledgeLevel }).slice(0, 200));
  check("and that quick checks were on", ex.checks === "on", String(ex.checks));
  check("no page errors", errors.length === 0, errors.join(" | "));
  await checksOnOff();
} catch (e) { ok = false; console.error("✗", e.message); }
await browser.close(); server.kill(); process.exit(ok ? 0 : 1);

// 4. Quick checks on or off (on by default). The map gets a quick check that is a scene of its own, on frame 4 (its
// frame tagged with it, as plan-map.mjs tags every check's frame); ktest stays a check over a regular scene (frame 8).
// Each page is a fresh browser context: its own storage, so what one remembers the next starts without.
async function checksOnOff() {
  const name = map.split("/").pop();
  const withScene = (extra = {}) => async (route) => {
    const r = await route.fetch(), m = await r.json(), f4 = m.frames.find((f) => f.index === 4);
    f4.quiz = "kscene";
    m.quizzes.push({ id: "kscene", frameIndex: 4, planStep: 1, question: "Send part two twice. What does the second PUT do?", options: [{ id: "a", label: "nothing" }, { id: "b", label: "stores it again" }], answer: "a", explain: "the bit is set", at: +(f4.start + f4.durationSeconds - 0.05).toFixed(3) });
    await route.fulfill({ response: r, json: Object.assign(m, extra) });
  };
  const open = async (qs = "", extra = {}, pg = null) => {
    pg ||= await browser.newPage({ viewport: { width: 1400, height: 900 } }); pg.on("pageerror", (e) => errors.push(String(e)));
    await pg.route((u) => u.pathname.endsWith(`/${name}`), withScene(extra));
    await pg.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}${qs}`);
    await pg.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.planMap?.quizzes?.length === 2 && el.player?.ready; }, null, { timeout: 60000 });
    return pg;
  };
  const state = (pg) => pg.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, b = r.querySelector(".checksbtn"), cb = r.querySelector("[data-checks]");
    let stored = null; try { stored = localStorage.getItem("rp:checks"); } catch {}
    return { on: el.checksOn, shown: !b.hidden, aria: b.getAttribute("aria-checked"), text: b.innerText.replace(/\s+/g, " ").trim(), box: !cb.closest("label").hidden && cb.checked, stored,
      faded: r.querySelectorAll(".scrub .seg s.skp").length, faint: [...r.querySelectorAll('.scrub .tick[data-kind="check"][data-skipped]')].map((t) => t.dataset.id).join() }; });
  const pm2 = await (async () => { const pg = await open(); const s = await state(pg);
    check("quick checks: on by default, the switch in the controls row says so, and Steps' box is ticked", s.on && s.shown && s.aria === "true" && /Quick checks: on/.test(s.text) && s.box && s.stored === null && s.faded === 0 && !s.faint, JSON.stringify(s));
    // turned off with the switch: remembered for this viewer, the check's own scene faded on the timeline, its mark faint
    await pg.locator("#rp").locator(".checksbtn").click();
    const s2 = await state(pg);
    check("the switch turns them off: said, remembered, the check's own scene faded on the timeline and both marks faint", !s2.on && s2.aria === "false" && /Quick checks: off/.test(s2.text) && !s2.box && s2.stored === "off" && s2.faded === 1 && s2.faint === "ktest,kscene", JSON.stringify(s2));
    await pg.evaluate(() => document.querySelector("#rp").focus()); await pg.keyboard.press("k");
    const k1 = (await state(pg)).on; await pg.keyboard.press("k");
    check("K switches them too", k1 === true && (await state(pg)).on === false);
    return { pg, m: await pg.evaluate(() => document.querySelector("#rp").planMap) }; })();
  const { pg } = pm2, m = pm2.m, f4 = m.frames.find((f) => f.index === 4), f5 = m.frames.find((f) => f.index === 5), kt = m.quizzes.find((q) => q.id === "ktest");
  // watch for a sheet the whole time: off, none may open, not even for a moment
  await pg.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; window.__sheet = false; setInterval(() => { if (r.querySelector(".decision").classList.contains("on")) window.__sheet = true; }, 30); });
  // off, played into the check's own scene: skipped as it plays, on to the next scene without a stop
  await pg.evaluate((t) => document.querySelector("#rp").jump(t), f4.start - 1.2);
  await pg.locator("#rp").locator('[data-act="play"]').click();
  const w0 = Date.now(), past = await until(pg, (t) => document.querySelector("#rp").player.currentTime >= t - 0.1, f5.start, 20000), took = (Date.now() - w0) / 1000;
  const sk = await pg.evaluate(() => { const el = document.querySelector("#rp"); return { t: el.player.currentTime, paused: el.player.paused, pending: el.pendingId(), sheet: window.__sheet }; });
  check("off: the check's own scene is skipped as the video plays, with no stop", !!past && took < f4.durationSeconds - 2 && !sk.pending && !sk.sheet, JSON.stringify({ ...sk, took, scene: f4.durationSeconds }));
  // off, played across a check over a regular scene: the scene plays, the check does not open
  // (played on by the player itself, not the Play button: just after a seek, paused can read true while it plays)
  await pg.evaluate((t) => { const el = document.querySelector("#rp"); el.jump(t); el.player.play(); }, kt.at - 1.2);
  const across = await until(pg, (t) => document.querySelector("#rp").player.currentTime > t + 1, kt.at, 20000);
  const ov = await pg.evaluate(() => { const el = document.querySelector("#rp"); return { t: el.player.currentTime, paused: el.player.paused, pending: el.pendingId(), sheet: window.__sheet, answered: Object.keys(el.quizzes) }; });
  check("off: a check over a regular scene does not open, and the video plays on past it", !!across && !ov.paused && !ov.pending && !ov.sheet && !ov.answered.length, JSON.stringify(ov));
  await pg.evaluate(() => document.querySelector("#rp").player.pause());
  // the review: says they were off, and counts nothing as wrong or missed; Finish's missed-checks line stays quiet
  const rv = await pg.evaluate(() => document.querySelector("#rp").exportPayload());
  check("off: the review says so, with no check in it as wrong or missed", rv.checks === "off" && rv.quizzes.length === 0 && rv.confusion.wrongChecks === 0, JSON.stringify({ checks: rv.checks, quizzes: rv.quizzes, confusion: rv.confusion }));
  const guard = await pg.evaluate(() => { const el = document.querySelector("#rp"); el.quizzes = { ktest: { answer: "a", correct: false }, kscene: { answer: "b", correct: false } };
    const off = el.guardLine(); el.setChecks(true); const on = el.guardLine(); el.setChecks(false); el.quizzes = {}; return { off, on: !!on }; });
  check("Finish's missed-checks line is quiet with checks off (and there with them on)", guard.off === "" && guard.on, JSON.stringify(guard));
  // turned off with a check waiting: it goes, and the video plays on
  await pg.evaluate(() => { const el = document.querySelector("#rp"); el.setChecks(true); el.player.pause(); el.askQuiz(el.planMap.quizzes.find((q) => q.id === "ktest")); });
  const waiting = await pg.evaluate(() => document.querySelector("#rp").pendingId());
  await pg.locator("#rp").locator(".checksbtn").click();
  const gone = await until(pg, () => { const el = document.querySelector("#rp"); return !el.pendingId() && !el.shadowRoot.querySelector(".decision").classList.contains("on") && !el.player.paused; });
  check("turned off with a check waiting: the sheet goes and the video plays on", waiting === "ktest" && !!gone);
  await pg.evaluate(() => document.querySelector("#rp").player.pause());
  // remembered: the same viewer, the page opened again, starts with them off
  await pg.reload(); await pg.waitForFunction(() => document.querySelector("#rp")?.planMap?.quizzes?.length === 2, null, { timeout: 60000 });
  const re = await state(pg);
  check("remembered for this viewer: opened again, still off", !re.on && re.aria === "false" && re.stored === "off", JSON.stringify(re));
  // ?checks=on wins over what was remembered, for this page, and does not change it
  await open("&checks=on", {}, pg);
  const qon = await state(pg);
  check("?checks=on wins over the remembered off, and leaves it remembered", qon.on && qon.aria === "true" && qon.stored === "off" && qon.faded === 0, JSON.stringify(qon));
  await pg.close();
  // ?checks=off on a first visit: off, and nothing remembered
  const p3 = await open("&checks=off"); const qoff = await state(p3);
  check("?checks=off: off on a first visit, nothing remembered", !qoff.on && qoff.stored === null && qoff.faded === 1, JSON.stringify(qoff));
  await p3.close();
  // a video that ships with them off (plan-map `checks: "off"`, from its brief): off until the viewer turns them on, and then on
  const p4 = await open("", { checks: "off" }); const d1 = await state(p4);
  await p4.locator("#rp").locator(".checksbtn").click();
  await open("", { checks: "off" }, p4); const d2 = await state(p4);
  check("a video's own default off, and the viewer's choice wins over it", !d1.on && d1.stored === null && d2.on && d2.stored === "on", JSON.stringify({ d1, d2 }));
  await p4.close();
  // a video with no quick checks has no switch
  const p5 = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await p5.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`);
  await p5.evaluate(() => { try { localStorage.clear(); } catch {} });
  await p5.route((u) => u.pathname.endsWith(`/${name}`), async (route) => { const r = await route.fetch(), mm = await r.json(); mm.quizzes = []; await route.fulfill({ response: r, json: mm }); });
  await p5.reload(); await p5.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 60000 });
  const none = await p5.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { b: r.querySelector(".checksbtn").hidden, box: r.querySelector(".checksbox").hidden }; });
  check("a video with no quick checks has no switch", none.b && none.box, JSON.stringify(none));
  await p5.close();
  check("no page errors with checks off", errors.length === 0, errors.join(" | "));
}
