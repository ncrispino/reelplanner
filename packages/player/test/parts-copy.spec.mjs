#!/usr/bin/env node
// Four asks from the reviewer:
//   1. play on into the next part (a card names it in the corner), with "Pause between parts" to get
//      the old stop back, saved per viewer as rp:pauseParts; questions still stop the video;
//   2. each kind of point on the timeline has its own shape, and the hover label names the kind;
//   3. every answered item in the record, and every comment, copies as one line of text;
//   4. on the agent's call, "own words" says what it does: it is a change, not an acceptance.
// Runs on L2 with the richer fixture map (three parts, three choices, a quick check, a call).
// usage: node packages/player/test/parts-copy.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, when, frames, seeked, still, settled, asked, loaded, flush, now, movedOn } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-richer.json";
const port = testPort(8883);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`;
const ready = (p) => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
const open = async (opts = {}) => {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, ...opts });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
  await p.goto(url);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} });
  await p.reload(); await loaded(p);
  // the clipboard, stubbed: what a copy button writes is what the test reads back
  await p.evaluate(() => { window.__copied = []; Object.defineProperty(navigator, "clipboard", { value: { writeText: (t) => { window.__copied.push(t); return Promise.resolve(); } }, configurable: true }); });
  return p;
};
const T = (p) => p.evaluate(() => { const pl = document.querySelector("#rp").player; return { t: pl.currentTime, paused: pl.paused }; });
const seekPause = (p, t) => p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, t);
const R = (p, fn, arg) => p.evaluate(fn, arg);
// a seek landed and the video is still there
const seekStill = async (p, t) => { await seekPause(p, t); await seeked(p, t); await still(p); };
// the record pulled up (or put away), drawn
const pulled = async (p, on = true) => { await until(p, (on) => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled") === on, on); await frames(p); };
// an element's transitions (a copy button fading in on hover or focus) have run to their end
const shown = (loc) => loc.evaluate((x) => new Promise((r) => { const f = () => (x.getAnimations().some((a) => a.playState === "running") ? requestAnimationFrame(f) : r()); requestAnimationFrame(f); }));
// a copy button pressed: its line has reached the clipboard (a stub here), and the button says so
const copy = async (p, press) => { const n = await R(p, () => window.__copied.length); await press(); await until(p, (n) => window.__copied.length > n, n); await flush(p); };
// answered, the video goes on: playing (not just asked to) before the pause that follows, and still after it
const pauseAfterGoOn = async (p, t0) => { await movedOn(p, t0); await R(p, () => document.querySelector("#rp").player.pause()); await still(p); };

const p = await open();
const rp = p.locator("#rp");
const pm = await R(p, () => document.querySelector("#rp").planMap);
const [ch1, ch2, ch3] = pm.chapters;

// ---- 1. autoplay across a part boundary: no stop, a card in the corner, gone by itself
{
  const tog = await R(p, () => { const l = document.querySelector("#rp").shadowRoot.querySelector(".pauseparts:not(.checksbox)"); return { shown: !l.hidden && l.getBoundingClientRect().width > 0, on: l.querySelector("input").checked, text: l.textContent.trim() }; });
  ok(tog.shown && !tog.on && tog.text === "Pause between chapters", `"Pause between chapters" is offered (D-127: chapter, not part), and off by default — ${JSON.stringify(tog)}`);
  await seekStill(p, ch1.end - 2);
  await rp.locator('[data-act="play"]').click();
  await p.waitForFunction((e) => document.querySelector("#rp").player.currentTime >= e + 0.8, ch1.end, { timeout: 20000 });
  const at = await R(p, () => { const el = document.querySelector("#rp"), r = el.shadowRoot, c = r.querySelector(".partcard"); return { paused: el.player.paused, chend: r.querySelector(".chend").classList.contains("on"), card: c.classList.contains("on"), k: c.querySelector(".k").textContent, t: c.querySelector(".t").textContent, op: getComputedStyle(c).opacity, pe: getComputedStyle(c).pointerEvents }; });
  ok(!at.paused && !at.chend, `playing across the end of part 1 does not stop, nor show the end-of-part sheet — ${JSON.stringify({ paused: at.paused, chend: at.chend })}`);
  ok(at.card && at.k === `Chapter 2 of ${pm.chapters.length}` && at.t === ch2.title && at.pe === "none", `a card names the part it plays into — "${at.k} · ${at.t}"`);
  await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".partcard").classList.contains("on"), null, 30000);   // its own few seconds
  const later = await R(p, () => { const el = document.querySelector("#rp"); return { card: el.shadowRoot.querySelector(".partcard").classList.contains("on"), paused: el.player.paused }; });
  ok(!later.card && !later.paused, "the card goes by itself, and the video is still playing");
  await R(p, () => document.querySelector("#rp").player.pause());
}

// ---- 1b. with the toggle on: the old stop, the old sheet, and "Next part" goes on
{
  await rp.locator(".grab").click(); await pulled(p);
  await rp.locator(".pauseparts:not(.checksbox)").click(); await until(p, () => localStorage.getItem("rp:pauseParts") != null);
  ok((await R(p, () => localStorage.getItem("rp:pauseParts"))) === "1", "turning it on is saved as rp:pauseParts");
  await R(p, () => document.querySelector("#rp").closePull()); await pulled(p, false);
  await seekStill(p, ch2.end - 2);
  await rp.locator('[data-act="play"]').click();
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".chend").classList.contains("on"), null, { timeout: 20000 });
  const st = await T(p);
  const card = await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".partcard").classList.contains("on"));
  ok(st.paused && Math.abs(st.t - ch2.end) < 0.8 && !card, `with it on, the video stops at the end of part 2 with the end-of-part sheet — t=${st.t.toFixed(2)} (ends ${ch2.end})`);
  // where it goes on from: read the moment it plays on (a look a while later is that much further on)
  const t0 = await now(p);
  await rp.locator('[data-act="ch-next"]').click();
  const nx = (await when(p, (t0) => { const pl = document.querySelector("#rp").player; return !pl.paused && pl.currentTime !== t0 && { t: pl.currentTime, paused: pl.paused }; }, t0)) || await T(p);
  ok(!nx.paused && Math.abs(nx.t - ch3.start) < 2.5, `"Next part" goes on into part 3 — t=${nx.t.toFixed(2)}`);
  await R(p, () => document.querySelector("#rp").player.pause());
  await p.reload(); await loaded(p);
  ok(await R(p, () => document.querySelector("#rp").shadowRoot.querySelector("[data-pauseparts]").checked), "and it is still on after a reload");
  await R(p, () => document.querySelector("#rp").setPauseParts(false));
  ok((await R(p, () => localStorage.getItem("rp:pauseParts"))) === "0", "turned off, it is saved off");
  await p.evaluate(() => { window.__copied = []; Object.defineProperty(navigator, "clipboard", { value: { writeText: (t) => { window.__copied.push(t); return Promise.resolve(); } }, configurable: true }); });
}

// ---- 1c. a quick check still stops the video, toggle off or not
const q = pm.quizzes[0];
{
  await seekStill(p, q.at - 1.2);
  await rp.locator('[data-act="play"]').click();
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
  const st = await T(p);
  ok(st.paused && Math.abs(st.t - q.at) < 0.8, `with parts playing on, a quick check still stops the video — t=${st.t.toFixed(2)}`);
  await rp.locator(`.decision .opt[data-quiz="${q.answer}"]`).click();
  await until(p, (id) => !!document.querySelector("#rp").quizzes[id], q.id);
  const t0 = await now(p);
  await R(p, () => document.querySelector("#rp").skipWait()); await until(p, () => !document.querySelector("#rp").pendingId());
  await pauseAfterGoOn(p, t0);
}

// ---- 2. the timeline's points: one shape per kind, the hover names the kind, a legend in the record
{
  const ticks = await R(p, () => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".scrub .tick")].map((t) => { const cs = getComputedStyle(t); return { kind: t.dataset.kind, id: t.dataset.id, answered: t.dataset.answered, radius: cs.borderRadius, transform: cs.transform, bg: cs.backgroundColor, border: cs.borderTopWidth, w: t.getBoundingClientRect().width }; }));
  const by = (k) => ticks.filter((t) => t.kind === k);
  ok(by("choice").length === pm.decisions.length && by("check").length === pm.quizzes.length && by("call").length === pm.autonomy.length, `a point per question, each with its kind — ${ticks.map((t) => t.kind).join(" ")}`);
  const c = by("choice")[0], k = by("check")[0], a = by("call")[0];
  ok(c.transform !== "none" && c.bg === "rgb(184, 85, 46)", `a plan question is the coral diamond (the darker coral, D-142: it waits on you) — ${c.transform}, ${c.bg}`);
  ok(k.radius === "50%" && k.border === "2px" && k.transform === "none", `a quick check is a ring — radius ${k.radius}, border ${k.border}`);
  ok(a.radius !== "50%" && a.transform === "none" && a.bg !== c.bg, `the agent's call is an ink square — radius ${a.radius}, ${a.bg}`);
  ok(new Set([c, k, a].map((t) => `${t.radius}|${t.transform}|${t.bg}`)).size === 3, "the three shapes all differ");
  ok(k.answered === "true" && a.answered === "false" && c.answered === "false", `the answered quick check is marked answered, the rest not — ${ticks.map((t) => `${t.id}:${t.answered}`).join(" ")}`);
  const kop = await R(p, () => { const t = document.querySelector('#rp').shadowRoot.querySelector('.scrub .tick[data-kind="check"]'); const cs = getComputedStyle(t); return { op: cs.opacity, bg: cs.backgroundColor }; });
  // answered, a point all but goes: the ring fills in the faintest ink (the next open one is the full-ink one)
  ok(/rgba\(20, 20, 19, 0.2\)/.test(kop.bg), `answered, the ring fills, in a faint ink — ${JSON.stringify(kop)}`);
  // hover over the quick check's point
  const sc = await rp.locator(".scrub").boundingBox(); const dur = await R(p, () => document.querySelector("#rp").dur());
  await p.mouse.move(sc.x + (q.at / dur) * sc.width + 2, sc.y + sc.height / 2); await flush(p);
  const hv = await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".scrub .hover").textContent);
  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  ok(hv.startsWith("Quick check") && hv.endsWith(`· ${fmt(q.at)}`), `hovering its point names the kind and the moment — "${hv}"`);
  const au = pm.autonomy[0];
  await p.mouse.move(sc.x + (au.at / dur) * sc.width, sc.y + sc.height / 2); await flush(p);
  ok((await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".scrub .hover").textContent)) === `The agent's choice · ${fmt(au.at)}`, "and the agent's choice names itself too (D-127: choice, not call)");
  await p.mouse.move(sc.x + (30 / dur) * sc.width, sc.y + sc.height / 2); await flush(p);
  ok(/^Chapter 1 · /.test(await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".scrub .hover").textContent)), "away from a point, the hover still names the part");
  await p.mouse.move(sc.x, sc.y + 300);
  const leg = await R(p, () => { const l = document.querySelector("#rp").shadowRoot.querySelector(".legend"); return { shown: !l.hidden, kinds: [...l.querySelectorAll(".mk")].map((m) => m.dataset.kind), text: l.textContent }; });
  ok(leg.shown && leg.kinds.join() === "choice,check,call" && /Quick check/.test(leg.text), `a one-line legend in the record — "${leg.text}"`);
}

// ---- 4. own words on the agent's call is a change; on a plan question it keeps its wording
{
  await R(p, () => { const el = document.querySelector("#rp"); el.askDecision(el.planMap.decisions[1]); }); await asked(p, pm.decisions[1].id); await settled(p);
  await rp.locator(".own .ownbtn").click(); await flush(p);
  const dq = await R(p, () => { const r = document.querySelector("#rp").shadowRoot; const h = r.querySelector(".ownhint"); return { hint: h.getBoundingClientRect().height > 0, save: r.querySelector('[data-act="own-save"]').textContent }; });
  ok(!dq.hint && dq.save === "Save", `a plan question's own-words box has no hint and says "Save" — ${JSON.stringify(dq)}`);
  await R(p, () => { const el = document.querySelector("#rp"); el.closeCard(); el.player.pause(); });
  await R(p, () => { const el = document.querySelector("#rp"); el.askAutonomy(el.planMap.autonomy[0]); }); await asked(p, pm.autonomy[0].id); await settled(p);
  const before = await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".ownhint").getBoundingClientRect().height);
  await rp.locator(".own .ownbtn").click(); await flush(p);
  const aq = await R(p, () => { const r = document.querySelector("#rp").shadowRoot; const h = r.querySelector(".ownhint"); return { hint: h.getBoundingClientRect().height > 0 ? h.textContent : null, save: r.querySelector('[data-act="own-save"]').textContent }; });
  ok(aq.hint === "Your words become an instruction: the agent changes the code to match." && aq.save === "Send as a change", `on the agent's call it says what own words do, and the button names the act — ${JSON.stringify(aq)}`);
  ok(before === 0, "the hint shows with the box, not before it is opened");
  await rp.locator(".own textarea").fill("return 422 and list the missing parts");
  let t0 = await now(p);
  await rp.locator('[data-act="own-save"]').click(); await until(p, () => !!document.querySelector("#rp").autonomy.atest && !document.querySelector("#rp").pendingId());
  await pauseAfterGoOn(p, t0);
  const au = await R(p, () => document.querySelector("#rp").autonomy.atest);
  ok(au?.verdict === "own" && au.own === "return 422 and list the missing parts", "it is recorded as the reviewer's own words");
  // and the next plan question is back to its own wording
  await R(p, () => { const el = document.querySelector("#rp"); el.askDecision(el.planMap.decisions[0]); }); await asked(p, pm.decisions[0].id); await settled(p);
  await rp.locator(".own .ownbtn").click(); await flush(p);
  ok(await R(p, () => { const r = document.querySelector("#rp").shadowRoot; return r.querySelector(".ownhint").getBoundingClientRect().height === 0 && r.querySelector('[data-act="own-save"]').textContent === "Save"; }), "the next plan question has no hint again");
  await p.keyboard.press("Escape");
  // answer q1 with an option and a note, for the copy checks below
  await rp.locator("[data-note]").fill("only if the platform team runs it");
  t0 = await now(p);
  await rp.locator('.decision .opt[data-choose="c"]').click(); await until(p, () => !!document.querySelector("#rp").decisions.q1 && !document.querySelector("#rp").pendingId());
  await pauseAfterGoOn(p, t0);
}

// ---- 3. copy any single answer, and any comment
{
  await seekPause(p, 42); await seeked(p, 42); await frames(p);
  await rp.locator(".composer textarea").fill("Why not validate at commit time?");
  await rp.locator('[data-act="post"]').click(); await until(p, () => document.querySelector("#rp").annotations.some((a) => /commit time/.test(a.comment || "")));
  await R(p, () => document.querySelector("#rp").openPull()); await pulled(p);
  const btns = await R(p, () => [...document.querySelector("#rp").shadowRoot.querySelectorAll("[data-copy]")].map((x) => x.dataset.copy));
  ok(["dec:q1", "quiz:ktest", "call:atest"].every((k) => btns.includes(k)) && btns.some((k) => k.startsWith("ann:")), `each answered item and each comment has a copy button — ${btns.join(" ")}`);
  const row = rp.locator(".decisions .dec", { has: p.locator('[data-copy="dec:q1"]') });
  const cp = rp.locator('[data-copy="dec:q1"]');
  const op0 = await cp.evaluate((x) => getComputedStyle(x).opacity);
  await row.hover(); await shown(cp);
  const op1 = await cp.evaluate((x) => getComputedStyle(x).opacity);
  ok(op0 === "0" && op1 === "1", `the button shows on hover — opacity ${op0} → ${op1}`);
  await copy(p, () => cp.click());
  const q1 = pm.decisions[0];
  let got = await R(p, () => window.__copied.at(-1));
  ok(got === `Q: ${q1.question} → Redis with a TTL (Note: only if the platform team runs it)`, `a decision copies as one line — "${got}"`);
  ok((await cp.textContent()) === "Copied", "and the button says Copied");
  await until(p, () => document.querySelector("#rp").shadowRoot.querySelector('[data-copy="dec:q1"]').textContent === "copy");   // its own moment
  ok((await cp.textContent()) === "copy", "for a moment, then goes back");
  await copy(p, () => rp.locator('[data-copy="quiz:ktest"]').click());
  got = await R(p, () => window.__copied.at(-1));
  const right = q.options.find((o) => o.id === q.answer).label;
  ok(got === `Q: ${q.question} → ${right} (right)`, `a quick check copies its answer's words — "${got}"`);
  await copy(p, () => rp.locator('[data-copy="call:atest"]').click());
  got = await R(p, () => window.__copied.at(-1));
  ok(got === `${pm.autonomy[0].chose} → change: return 422 and list the missing parts`, `the agent's call copies what it chose and what was said — "${got}"`);
  const rec = await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".autolog").textContent);
  ok(/Sent as a change: return 422/.test(rec), "the record calls own words on a call a change");
  // by keyboard: the button is reachable by focus, shows on focus, and Enter copies
  const ann = rp.locator('.list [data-copy^="ann:"]').first();   // newest first
  await ann.focus(); await shown(ann);
  const opf = await ann.evaluate((x) => getComputedStyle(x).opacity);
  await copy(p, () => p.keyboard.press("Enter"));
  got = await R(p, () => window.__copied.at(-1));
  ok(opf === "1" && /^0:4\d · step \d+ — Why not validate at commit time\?$|^0:4\d — Why not validate at commit time\?$/.test(got), `a comment copies by keyboard, the button visible on focus — "${got}"`);
  // the flag of a call copies as "flagged"
  await R(p, () => { const el = document.querySelector("#rp"); el.autonomy.atest = { verdict: "flag", t: 96.367 }; el.renderAutonomy(); });
  await copy(p, () => rp.locator('[data-copy="call:atest"]').click());
  ok((await R(p, () => window.__copied.at(-1))) === `${pm.autonomy[0].chose} → flagged`, "a flagged call copies as flagged");
}
await p.context().close();

// ---- 3b. on a touch screen there is no hover: the buttons are simply there
{
  const t = await open({ viewport: { width: 430, height: 900 }, hasTouch: true, isMobile: true });
  const hoverNone = await R(t, () => matchMedia("(hover:none)").matches);
  await R(t, () => { const el = document.querySelector("#rp"); el.comment("on a phone"); el.openPull(); }); await pulled(t); await shown(t.locator("#rp").locator('.list [data-copy^="ann:"]').first());
  const op = await t.locator("#rp").locator('.list [data-copy^="ann:"]').first().evaluate((x) => getComputedStyle(x).opacity);
  ok(!hoverNone || op === "1", `where nothing hovers, the copy button is always shown — hover:none ${hoverNone}, opacity ${op}`);
  await t.context().close();
}

ok(!fails.some((f) => /^page error/.test(f)), "no page errors");
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
