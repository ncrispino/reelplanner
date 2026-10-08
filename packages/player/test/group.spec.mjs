#!/usr/bin/env node
// Grouped calls (revise-loop step 8): the calls that do not stop on their own share one beat at the end
// of their part, and one band under the frame (answer-on-the-video step 2: the frame lists the calls).
//   - the band has Accept all and one Flag per call, named by its id; each Flag's title says what the
//     call chose and what it replaced
//   - one call flagged stays flagged; Accept all (A) accepts the rest, and the video goes on
//   - the verdicts are the per-call records a call's own sheet makes: the record, the timeline, the export
//   - met again, it shows what was given, and a flag can be taken back
//   - light and dark: the flag in the text coral, the band on paper
// Runs on L2 with the group fixture: the quiz fixture plus one grouped beat (a5, a6, a7) at the end of frame 10.
// usage: node packages/player/test/group.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { tmpdir } from "node:os"; import { join } from "node:path";
import * as W from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-autonomy-group.json";
const port = testPort(8883);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
// Every wait is on what it waits for, never a time: a loaded machine (the full run, specs side by side) outlasts any.
// ready: the player, its plan map and its frames mounted (where the band goes decided)
const ready = () => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el.stage?.dataset.ready && el._bandIn !== undefined; }, null, { timeout: 90000 });
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`); await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload(); await ready();
const rp = p.locator("#rp");
const E = (f, a) => p.evaluate(f, a);
// the waits in ./wait.mjs, on this page
const until = (f, a) => W.until(p, f, a), frames = () => W.frames(p), settled = () => W.settled(p), still = () => W.still(p);
const sheet = () => E(() => { const el = document.querySelector("#rp"), d = el.shadowRoot.querySelector(".decision");
  return { on: d.classList.contains("on"), k: d.querySelector(".k").textContent, q: d.querySelector(".q").textContent, own: !d.querySelector(".own").hidden,
    rows: [...d.querySelectorAll(".gflag")].map((f) => ({ id: f.dataset.gflag, text: f.textContent, title: f.title, flag: f.getAttribute("aria-pressed") })),
    band: d.classList.contains("band"), reason: getComputedStyle(d.querySelector(".reason")).display !== "none", under: d.getBoundingClientRect().top >= el.shadowRoot.querySelector(".stage").getBoundingClientRect().bottom - 0.5, q: getComputedStyle(d.querySelector(".q")).display !== "none",
    fb: d.querySelector(".feedback").style.display === "block" ? d.querySelector(".feedback").textContent : "", pending: el._pendingDecision?.kind || null }; });
const playInto = async (at) => {
  await E((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, at - 1.2);
  await until((t) => Math.abs(document.querySelector("#rp").player.currentTime - t) < 0.05, at - 1.2); await still();
  await rp.locator('[data-act="play"]').click();
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
  await settled();
};
const pressed = (id, v) => until(([id, v]) => document.querySelector("#rp").shadowRoot.querySelector(`.decision [data-gflag="${id}"]`)?.getAttribute("aria-pressed") === v, [id, v]);
const gone = () => until(() => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"));
// the video going on is playing, its time moving, before it is paused again: a pause sent while the play is still on
// its way into the frame's page is overtaken by it, and the video runs on under what comes next
const movesOn = async () => { const t0 = await E(() => document.querySelector("#rp").player.currentTime); await until((t0) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime > t0 + 0.02; }, t0); };
const g = (await E(() => document.querySelector("#rp").planMap)).autonomyGroups[0];

try {
  // ---- the sheet
  await playInto(g.at);
  let s = await sheet();
  ok(s.on && s.pending === "group" && /the rest, in one list · 3 choices/.test(s.k) && s.rows.map((r) => r.id).join() === "a5,a6,a7", `the grouped beat stops the video on one band with a Flag for each of its three calls — ${JSON.stringify({ k: s.k, rows: s.rows.map((r) => r.text) })}`);
  ok(s.band && s.under && s.q && !s.reason, `the band is under the frame, says what waits in one line, and does not list the calls again — ${JSON.stringify({ band: s.band, under: s.under, q: s.q, reason: s.reason })}`);
  ok(s.rows.every((r, i) => r.text.includes(g.calls[i].id.toUpperCase()) && r.title.includes(g.calls[i].chose) && r.title.includes(`Instead of: ${g.calls[i].insteadOf}`)), "each Flag names its call as the frame does, and says what it chose and what it replaced");
  ok(!s.own && await E(() => !!document.querySelector("#rp").shadowRoot.querySelector('.decision [data-gaccept]')), "one Accept all, and no own-words box on it");
  const mk = await E(() => { const t = document.querySelector("#rp").shadowRoot.querySelector('.scrub .tick[data-kind="group"]'); return t && { id: t.dataset.id, bg: getComputedStyle(t).backgroundColor }; });
  ok(mk?.id === g.id, `its mark on the timeline is the calls' shape — ${JSON.stringify(mk)}`);
  await p.screenshot({ path: join(tmpdir(), "group-light.png") });

  // ---- one flagged, the rest accepted
  await rp.locator('.decision [data-gflag="a6"]').click(); await pressed("a6", "true");
  s = await sheet();
  const lf = await E(() => { const c = getComputedStyle(document.querySelector("#rp").shadowRoot.querySelector('[data-gflag="a6"]')); return { color: c.color, bg: c.backgroundColor }; }), light = lf.color;
  await p.screenshot({ path: join(tmpdir(), "group-flagged.png") });
  ok(s.on && s.rows.find((r) => r.id === "a6").flag === "true" && /Flagged/.test(s.rows.find((r) => r.id === "a6").text), "Flag on one call marks its button, and the band stays up");
  ok(light === "rgb(156, 69, 36)" && lf.bg === "rgba(0, 0, 0, 0)", `the flag is in the text coral on the paper, light — ${JSON.stringify(lf)}`);
  await E(() => document.querySelector("#rp").setAttribute("theme", "dark")); await frames();
  const dark = await E(() => { const r = document.querySelector("#rp").shadowRoot; return { flag: getComputedStyle(r.querySelector('[data-gflag="a6"]')).color, fbg: getComputedStyle(r.querySelector('[data-gflag="a6"]')).backgroundColor, bg: getComputedStyle(r.querySelector(".decision")).backgroundColor, ink: getComputedStyle(r.querySelector(".decision [data-gaccept]")).backgroundColor }; });
  ok(dark.flag === "rgb(227, 161, 132)" && dark.fbg === "rgba(0, 0, 0, 0)" && dark.bg === "rgb(20, 19, 16)" && dark.ink === "rgb(242, 239, 232)", `and in dark, on dark paper — ${JSON.stringify(dark)}`);
  await p.screenshot({ path: join(tmpdir(), "group-dark.png") });
  await E(() => document.querySelector("#rp").setAttribute("theme", "light"));
  ok(await E(() => document.querySelector("#rp").annotations.some((a) => a.kind === "flag" && /Flagged: the manifest keeps/.test(a.comment))), "the flag is a note on its step, as a call's own Flag is");
  await p.keyboard.press("a"); await gone(); await movesOn();
  const v = await E(() => { const el = document.querySelector("#rp"); return { a: Object.fromEntries(["a5", "a6", "a7"].map((id) => [id, el.autonomy[id]?.verdict])), on: el.shadowRoot.querySelector(".decision").classList.contains("on"), playing: !el.player.paused, count: el.shadowRoot.querySelector(".autosec .count").textContent, tick: el.shadowRoot.querySelector('.scrub .tick[data-kind="group"]').dataset.answered }; });
  ok(v.a.a5 === "accept" && v.a.a6 === "flag" && v.a.a7 === "accept", `A accepts every call not flagged; the flagged one stays flagged — ${JSON.stringify(v.a)}`);
  ok(!v.on && v.playing, "and the video goes on");
  ok(v.count === " · 3 of 4" && v.tick === "true", `the record counts each call, and the mark reads answered — ${JSON.stringify({ count: v.count, tick: v.tick })}`);
  const ex = await E(() => { const el = document.querySelector("#rp"); return { rows: el.exportPayload().autonomy, stored: JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.endsWith(":autonomy")))), line: el.lineFor("call:a6") }; });
  const by = Object.fromEntries(ex.rows.map((r) => [r.id, r]));
  ok(by.a5?.verdict === "accept" && by.a6?.verdict === "flag" && by.a7?.verdict === "accept" && by.a6.planStep === g.planStep && by.a6.chose === g.calls[1].chose && Math.abs(by.a6.t - g.at) < 0.01, `the export carries each call's verdict, as its own record — ${JSON.stringify(ex.rows.map((r) => [r.id, r.verdict]))}`);
  ok(ex.stored.a6?.verdict === "flag" && /the manifest keeps its bitmap as a hex string → flagged/.test(ex.line), "saved with the review, and copied as one line");
  await E(() => document.querySelector("#rp").player.pause());

  // ---- met again: what was given, and a flag taken back
  await playInto(g.at);
  s = await sheet();
  ok(/answered/.test(s.k) && /You accepted 2 and flagged 1/.test(s.fb) && s.rows.find((r) => r.id === "a6").flag === "true", `replayed, it comes back with its verdicts — ${JSON.stringify({ k: s.k, fb: s.fb })}`);
  await rp.locator('.decision [data-gflag="a6"]').click(); await pressed("a6", "false");
  s = await sheet();
  const back = await E(() => { const el = document.querySelector("#rp"); return { a6: el.autonomy.a6, flags: el.annotations.filter((a) => a.kind === "flag").length }; });
  ok(s.on && s.rows.find((r) => r.id === "a6").flag === "false" && !back.a6 && back.flags === 0, `taking the flag back leaves the call to Accept all, and its note goes — ${JSON.stringify(back)}`);
  await p.keyboard.press("a"); await until(() => document.querySelector("#rp").autonomy.a6?.verdict === "accept"); await gone(); await movesOn();
  ok(await E(() => document.querySelector("#rp").autonomy.a6?.verdict === "accept"), "and A accepts it");
  // the grouped call's time in the record opens its group
  await E(() => document.querySelector("#rp").player.pause());
  await E(() => document.querySelector("#rp").openPoint("call", "a7")); await until(() => { const el = document.querySelector("#rp"); return el._pendingDecision?.kind === "group" && el.shadowRoot.querySelector(".decision").classList.contains("on"); });
  s = await sheet();
  ok(s.on && s.pending === "group", "a grouped call's time in the record opens its group's sheet");
  await E(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); });

  // ---- answer in the frame (plan 2026-09-25): a frame that draws a card per choice (`data-call`) takes "the rest,
  // in one list" on it: each Flag under its own card, Accept all among the chips under the cards, no bar
  await p.reload(); await ready();
  await E(() => { const el = document.querySelector("#rp"); for (const k of Object.keys(el.autonomy)) delete el.autonomy[k]; el.annotations = []; try { localStorage.clear(); } catch {} });
  const cid = (await E(() => document.querySelector("#rp").planMap)).frames.find((f) => f.index === g.frameIndex).compositionId;
  await E(({ cid, calls }) => { const doc = document.querySelector("#rp").player.iframeElement.contentDocument, host = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === cid);
    // the cards are the frame's whole picture: the frame's own drawing under them is hidden, not just painted over.
    // Painted over, its words stayed on the page (frame 10's "Blob store" and "Sweeper", 5 px under A7's card), and
    // the layout rightly takes a frame's words just under a card as that card's (withSublines): A7's Flag hung 88 px
    // low, under words no one could see. Which layout the check read depended on the moment: the stop overshoots the
    // beat by a frame or two (110.30 for 110.229, past frame 10's end) and is put back, and the frame is looked at again
    // 350 ms on; read after a fixed 250 ms, it passed on an idle machine and failed on a loaded one
    const hide = doc.createElement("style"); hide.textContent = `[data-composition-id="${cid}"] :not([data-rp-cards], [data-rp-cards] *) { visibility: hidden !important; }`; doc.head.appendChild(hide);
    const box = doc.createElement("div"); box.dataset.rpCards = ""; box.style.cssText = "position:absolute;inset:0;z-index:50;background:#FAF9F5";
    box.innerHTML = calls.map((c, i) => `<div data-call="${c.id}" style="position:absolute;left:${160 + i * 540}px;top:260px;width:500px;height:360px;box-sizing:border-box;padding:32px;border-radius:12px;background:#EFE9DE;font:400 40px/1.2 Georgia,serif;color:#141413">${c.id.toUpperCase()} · ${c.chose}</div>`).join("");
    host.appendChild(box); }, { cid, calls: g.calls });
  await playInto(g.at);
  const f = await E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), doc = el.player.iframeElement.contentDocument, ifr = el.player.iframeElement.getBoundingClientRect(), sx = ifr.width / doc.defaultView.innerWidth;
    const card = (id) => { const c = doc.querySelector(`[data-call="${id}"]`).getBoundingClientRect(); return { l: ifr.left + c.left * sx, r: ifr.left + c.right * sx, b: ifr.top + c.bottom * sx }; };
    const all = r.querySelector('.decision [data-gaccept]').getBoundingClientRect(), low = Math.max(...["a5", "a6", "a7"].map((id) => card(id).b));
    return { onframe: d.classList.contains("onframe"), band: d.classList.contains("band"), flags: [...d.querySelectorAll(".gflag")].map((x) => { const bb = x.getBoundingClientRect(), c = card(x.dataset.gflag); return { id: x.dataset.gflag, right: Math.round(c.r - bb.right), below: Math.round(bb.top - c.b) }; }), accept: Math.round(all.top - low) }; });
  ok(f.onframe && !f.band && f.flags.length === 3 && f.flags.every((x) => Math.abs(x.right) <= 2 && x.below >= -1 && x.below <= 14) && f.accept > 0, `on the frame: each Flag hangs from its own card, Accept all is under the cards — ${JSON.stringify(f)}`);
  await rp.locator('.decision [data-gflag="a7"]').click(); await pressed("a7", "true");
  await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("a"); await gone();
  const vf = await E(() => { const el = document.querySelector("#rp"); return ["a5", "a6", "a7"].map((id) => el.autonomy[id]?.verdict).join(); });
  ok(vf === "accept,accept,flag", `a Flag on A7's card, then A: the rest accepted — ${vf}`);
} finally {
  await b.close(); srv.kill();
}
console.log(fails.length ? `✗ ${fails.length} failed` : "✓ group: all passed");
process.exit(fails.length ? 1 : 0);
