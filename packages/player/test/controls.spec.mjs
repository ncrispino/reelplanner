#!/usr/bin/env node
// Three controls a reviewer asked for by name: a light/dark button whose state you can READ, a
// speed drag that takes the narration with it, and a copy that still works where the clipboard is
// refused — which is the case that matters, because a download is useless inside an embedded page.
// usage: node packages/player/test/controls.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked, still, settled, loaded, pageHold, now, movedOn } from "./wait.mjs";
const project = process.argv[2] || "videos/r1-review-page";
const port = testPort(8871);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 140)));
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload();
await loaded(p);
const rp = p.locator("#rp");

// ---- theme: one icon button whose state you can read — pressed in dark, and the tooltip names the other theme
const theme = () => p.evaluate(() => { const b = document.querySelector("#rp").shadowRoot.querySelector('[data-act="theme"]'); return { pressed: b.getAttribute("aria-pressed"), title: b.title, label: b.getAttribute("aria-label"), w: Math.round(b.getBoundingClientRect().width) }; });
let th = await theme();
ok(th.pressed === "false" && /^Light theme/.test(th.title), `light at rest, and it says so — "${th.title}"`);
ok(th.w <= 48, `one small button, not a two-part switch — ${th.w}px`);
await rp.locator('[data-act="theme"]').click();
await p.waitForFunction(() => document.querySelector("#rp").getAttribute("theme") === "dark", null, { timeout: 30000 });
th = await theme();
ok(th.pressed === "true" && /^Dark theme/.test(th.title) && th.label === "Dark theme (T)", "clicking it turns dark on, and the button reads as on");
ok(await p.evaluate(() => document.documentElement.dataset.rpTheme === "dark"), "the page around the video follows");
await rp.locator('[data-act="theme"]').click();
await p.waitForFunction(() => document.querySelector("#rp").getAttribute("theme") === "light", null, { timeout: 30000 });
ok((await theme()).pressed === "false", "and clicking again comes back to light");

// ---- the timeline: one bar per part, clear gaps, each part filling on its own, the current part named in full
const bar = () => p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, s = r.querySelector(".scrub");
  const segs = [...s.querySelectorAll(".seg")].map((e) => e.getBoundingClientRect());
  return { n: segs.length, gaps: segs.slice(1).map((g, i) => Math.round(g.left - segs[i].right)), h: Math.round(segs[0]?.height || 0), hit: Math.round(s.getBoundingClientRect().height), fills: [...s.querySelectorAll(".seg>b")].map((b) => parseFloat(b.style.width) || 0), label: (() => { const c = r.querySelector('.labels .part[aria-current="true"]'), pt = c?.querySelector(".pt"); return c ? { i: Number(c.dataset.part), n: c.querySelector(".pn").textContent, text: pt.textContent, full: pt.scrollWidth <= pt.clientWidth + 1 } : null; })(), parts: r.querySelectorAll(".labels .part").length, chapters: (document.querySelector("#rp").planMap.chapters || []).length }; });
let sb = await bar();
if (sb.chapters > 1) {
  ok(sb.n === sb.chapters && sb.gaps.every((g) => g >= 4), `one bar per part, with gaps you can see — ${sb.gaps.join(", ")} px`);
  // the bars are a thin line at rest (4 px, 8 under the pointer); what you aim at is the whole timeline row
  ok(sb.hit >= 16 && sb.h >= 4, `the timeline is thick enough to aim at — a ${sb.hit} px row, the bars ${sb.h} px`);
  const sc = await rp.locator(".scrub").boundingBox();
  // the click moves the playhead (a seek there): wait for it to land, then pause, and the bars are drawn where it stopped
  const t0 = await now(p);
  await rp.locator(".scrub").click({ position: { x: sc.width * 0.38, y: sc.height / 2 } }); await until(p, (t0) => Math.abs(document.querySelector("#rp").player.currentTime - t0) > 1, t0);
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").pause()); await still(p); await frames(p);
  sb = await bar();
  const k = sb.fills.findIndex((f) => f < 100);
  ok(k >= 0 && sb.fills[k] > 0 && sb.fills.slice(0, k).every((f) => f === 100) && sb.fills.slice(k + 1).every((f) => f === 0), `finished parts are full, the current one partly, the rest empty — ${sb.fills.map((f) => Math.round(f)).join(" / ")}`);
  // every part is numbered under its bar now; the one you are in is marked and named in full
  ok(sb.parts === sb.chapters && sb.label?.i === k && sb.label.n === String(k + 1) && sb.label.text.length >= 8 && sb.label.full, `under the bars, every part numbered, and the one you are in named in full — "${sb.label?.n} ${sb.label?.text}"`);
  await p.mouse.move(sc.x + sc.width * 0.95, sc.y + sc.height / 2); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".scrub .hover").classList.contains("on"));
  const hv = await p.evaluate(() => { const h = document.querySelector("#rp").shadowRoot.querySelector(".scrub .hover"); return { on: h.classList.contains("on"), text: h.textContent, italic: getComputedStyle(h).fontStyle }; });
  ok(hv.on && new RegExp(`^Chapter ${sb.chapters} · `).test(hv.text) && hv.italic === "normal", `hovering a part names it and its moment — "${hv.text}"`);
  await p.mouse.move(0, 0); await rp.locator(".scrub").click({ position: { x: 2, y: sc.height / 2 } }); await until(p, () => document.querySelector("#rp").player.currentTime < 2);
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").pause()); await still(p);
}

// ---- typing is not a command: letters typed into the comment box stay in the comment box
{
  const before = await p.evaluate(() => { const el = document.querySelector("#rp"); return { theme: el.getAttribute("theme"), muted: el.shadowRoot.querySelector("hyperframes-player").muted, marking: el.shadowRoot.querySelector(".toolbar").classList.contains("marking") }; });
  const box = rp.locator(".composer textarea"); await box.click(); await p.keyboard.type("the demo zebra timed out"); await pageHold(p, 300);   // a while for any shortcut to show
  const after = await p.evaluate(() => { const el = document.querySelector("#rp"); return { theme: el.getAttribute("theme"), muted: el.shadowRoot.querySelector("hyperframes-player").muted, marking: el.shadowRoot.querySelector(".toolbar").classList.contains("marking"), text: el.shadowRoot.querySelector(".composer textarea").value, handoff: !el.shadowRoot.querySelector(".handoff")?.hidden }; });
  ok(after.text === "the demo zebra timed out", `every letter lands in the comment box — "${after.text}"`);
  ok(after.theme === before.theme && after.muted === before.muted && after.marking === before.marking && !after.handoff, "and none of them fires a shortcut: t, m, d, e, z and the rest are just letters there");
  await box.fill(""); await p.keyboard.press("Escape"); await frames(p);
}

// ---- mute: silences every narration clip, says so, survives a reload, and M toggles it
const sound = () => p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, pl = r.querySelector("hyperframes-player"), btn = r.querySelector('[data-act="mute"]');
  const media = [...(pl.shadowRoot?.querySelectorAll("iframe") || [])].flatMap((f) => { try { return [...f.contentDocument.querySelectorAll("audio")]; } catch { return []; } });
  return { muted: pl.muted, pressed: btn.getAttribute("aria-pressed"), label: btn.getAttribute("aria-label"), clips: media.length, silent: media.filter((m) => m.muted || m.volume === 0).length, bg: getComputedStyle(btn).backgroundColor }; });
let s = await sound();
ok(!s.muted && s.pressed === "false" && s.label === "Mute (M)", `sound is on at rest — ${s.label}`);
await rp.locator('[data-act="mute"]').click(); await until(p, () => { const r = document.querySelector("#rp").shadowRoot, pl = r.querySelector("hyperframes-player"); const media = [...(pl.shadowRoot?.querySelectorAll("iframe") || [])].flatMap((f) => { try { return [...f.contentDocument.querySelectorAll("audio")]; } catch { return []; } });
  return pl.muted && r.querySelector('[data-act="mute"]').getAttribute("aria-pressed") === "true" && media.every((m) => m.muted || m.volume === 0); }); await frames(p);
s = await sound();
ok(s.muted && s.pressed === "true" && s.label === "Unmute (M)", "Mute mutes the player and the button says so");
ok(s.clips > 0 && s.silent === s.clips, `every narration clip is silent — ${s.silent} of ${s.clips}`);
ok(s.bg !== "rgb(20, 20, 19)", `pressed, the button keeps its paper ground so the icon shows — ${s.bg}`);
await p.reload(); await p.waitForFunction(() => document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player")?.ready, null, { timeout: 90000 });
ok((await sound()).muted, "muted survives a reload");
await rp.press("m"); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").muted);
ok(!(await sound()).muted, "M turns the sound back on");

// ---- speed: the drag sets the rate, and the narration audio moves with it
await p.evaluate(() => { const s = document.querySelector("#rp").shadowRoot.querySelector("[data-speed]"); s.value = "2"; s.dispatchEvent(new Event("input", { bubbles: true, composed: true })); });
await until(p, () => { const pl = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"), a = pl.iframeElement?.contentDocument?.querySelector("audio"); return pl.playbackRate === 2 && (!a || a.playbackRate === 2); }); await frames(p);
ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").playbackRate === 2), "the drag sets the player rate");
ok((await rp.locator(".speed .x").textContent()).trim() === "2×", `the readout says what it is — ${(await rp.locator(".speed .x").textContent()).trim()}`);
const audioRate = await p.evaluate(() => { const f = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").iframeElement; const a = f?.contentDocument?.querySelector("audio"); return a ? a.playbackRate : null; });
ok(audioRate === 2, `the narration follows the same rate (audio at ${audioRate})`);
// the ends of the range are the ones a voice survives
await p.evaluate(() => document.querySelector("#rp").setSpeed(9));
ok(await p.evaluate(() => document.querySelector("#rp").speed === 3), "it clamps at 3×");
await p.evaluate(() => document.querySelector("#rp").setSpeed(0.1));
ok(await p.evaluate(() => document.querySelector("#rp").speed === 0.5), "and at 0.5×");
await p.evaluate(() => document.querySelector("#rp").setSpeed(1));

// ---- the page the plan asks for: one column, the video first and widest (step 1), the composer
// with it (step 4), one fact on the status line (step 5)
const M = () => p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; const R = (s) => { const b = r.querySelector(s).getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
  return { vw: innerWidth, stage: R(".stage"), side: R(".side"), composer: R(".composer"), status: r.querySelector(".status").textContent, decs: r.querySelector(".decisions").textContent }; });
// the line also carries a transient confirmation for a few seconds after an act (the theme switch
// above left one); clear it, because what step 5 is about is the standing line
await p.evaluate(() => { const el = document.querySelector("#rp"); el._notice = null; el.updateStatus(); });
let m = await M();
ok(m.stage.w > m.vw * 0.8, `the video is given the page's width — ${Math.round(m.stage.w)} of ${m.vw}`);
ok(m.side.y >= m.stage.y + m.stage.h - 1, `the lists sit below the video, not in a fixed column beside it — they start at ${Math.round(m.side.y)}, the frame ends at ${Math.round(m.stage.y + m.stage.h)}`);
ok(m.composer.y > m.stage.y && m.composer.y < m.side.y, "the composer is with the video, not three sections below it");
ok(/^(Not started|Paused at \d+:\d\d|Playing at \d+:\d\d)$/.test(m.status.trim()), `the status line says one thing — "${m.status}"`);

// ---- one home per question (step 3), and the question folds off the frame it asks about (step 2, D-001)
const q1 = await p.evaluate(() => document.querySelector("#rp").planMap.decisions[0]);
ok(!m.decs.includes(q1.question), "a question that is still being asked is not also listed in the record");
await p.evaluate((t) => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").seek(t), q1.at - 1.2);
await rp.locator('[data-act="play"]').click();
await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 30000 });
await settled(p);
// answer in the frame (plan 2026-09-25): the frame's cards take the answer, and what is left happens on the
// frame, by its cards: the question is not asked again, no bar sits under or over the video, and the video
// keeps its size. The layer the player lays over the frame is the frame's own box.
const sheet = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"); const b = d.getBoundingClientRect(), s = r.querySelector(".stage").getBoundingClientRect();
  const own = r.querySelector(".decision .ownbtn").getBoundingClientRect();
  return { onframe: d.classList.contains("onframe"), band: d.classList.contains("band"), layer: Math.abs(b.top - s.top) < 1 && Math.abs(b.height - s.height) < 1 && Math.abs(b.width - s.width) < 1, bg: getComputedStyle(d).backgroundColor, room: getComputedStyle(r.querySelector(".bandroom")).display, stageH: Math.round(s.height),
    q: r.querySelector(".decision .q").getBoundingClientRect().width > 1, opts: [...d.querySelectorAll(".opts .opt")].filter((o) => o.getBoundingClientRect().height > 0).length, cards: r.querySelectorAll(".hits .hit").length, own: own.top >= s.top && own.bottom <= s.bottom + 1 && own.height > 0 }; });
ok(sheet.onframe && !sheet.band && sheet.layer && sheet.bg === "rgba(0, 0, 0, 0)" && sheet.room === "none" && !sheet.q && sheet.opts === 0 && sheet.cards === q1.options.length && sheet.own && sheet.stageH === Math.round(m.stage.h), `the options are not asked again, and nothing sits in a bar: the cards answer, your own words are a slot on the frame by them, and the frame is as tall as before — ${JSON.stringify(sheet)}`);
await rp.locator('[data-act="fold"]').click(); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("folded")); await still(p); await frames(p);
const folded = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), pill = d.querySelector(".hd");
  const b = pill.getBoundingClientRect(), s = r.querySelector(".stage").getBoundingClientRect();
  return { top: +((b.top - s.top) / s.height).toFixed(2), right: Math.round(s.right - b.right), on: d.classList.contains("on"), pending: !!el._pendingDecision, hittable: [...r.querySelectorAll(".decision .opt, .hits .hit, .decision .ownbtn")].filter((o) => o.getBoundingClientRect().height > 0).length, share: +(b.height / s.height).toFixed(2), text: pill.textContent.replace(/\s+/g, " ").trim() }; });
ok(folded.on && folded.pending && folded.hittable === 0, "folded, the decision is still pending and none of its options, nor the frame's cards, can be answered by accident");
ok(folded.share < 0.15 && /Still to answer/.test(folded.text), `and it is one small pill that says it is still to answer — ${Math.round(folded.share * 100)}% of the frame's height`);
ok(folded.top >= 0 && folded.top < 0.1 && folded.right >= 0 && folded.right <= 24, `in the frame's top-right corner, as the folded sheet's is — ${folded.top} down, ${folded.right} px from the right`);
// Play on a folded question brings it back; and a while after (by the page's clock), the video has not run on past it
await rp.locator('[data-act="play"]').click(); await until(p, () => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }); await pageHold(p, 800);
const ran = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { t: r.querySelector("hyperframes-player").currentTime, folded: r.querySelector(".decision").classList.contains("folded"), on: r.querySelector(".decision").classList.contains("on") }; });
ok(ran.t <= q1.at + 0.5 && ran.on && !ran.folded, `the video does not run past a folded question — it comes back at ${ran.t.toFixed(2)}, the question was at ${q1.at}`);
// answered by its card, the video goes on: playing (not just asked to) before it is paused, and still
const tq = await now(p);
await rp.locator(".hits .hit").first().click();
await until(p, (id) => !!document.querySelector("#rp").decisions[id] && !document.querySelector("#rp").pendingId(), q1.id); await movedOn(p, tq);
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").pause()); await still(p);
m = await M();
ok(m.decs.includes(q1.question), "once answered, it is the record that keeps it");

// ---- copy: the text carries the decisions AND the comments, and survives a blocked clipboard
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").seek(80));
await seeked(p, 80); await frames(p);
await rp.locator(".composer textarea").fill("the empty band here reads as a hole");
await rp.locator('[data-act="post"]').click();
await until(p, () => document.querySelector("#rp").annotations.some((a) => /reads as a hole/.test(a.comment || "")));
await p.evaluate(() => { const el = document.querySelector("#rp"); el.decisions = { q1: { option: "b", label: "The sheet overlays the lower third" } }; });
const text = await p.evaluate(() => document.querySelector("#rp").reviewText());
ok(/## Decisions/.test(text) && /The sheet overlays/.test(text), "the text carries the decisions");
ok(/## Comments/.test(text) && /reads as a hole/.test(text), "and the comments, with their timestamps");
ok(/\*\*1:20\*\*|\*\*1:1\d\*\*/.test(text), `a comment is stamped in minutes and seconds — ${(text.match(/\*\*\d+:\d\d\*\*/) || [])[0]}`);

// the case that matters: the clipboard refuses, and the text still reaches the reviewer
await p.evaluate(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("blocked")) }, configurable: true }); });
// Copy lives in the record, which is a sheet resting at a peek: reach it the way a reviewer would.
await rp.locator(".grab").click();
await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(p);
await rp.locator('[data-act="copy"]').click();
await until(p, () => { const c = document.querySelector("#rp").shadowRoot.querySelector(".copyout"); return c && !c.hidden; });
const fb = await p.evaluate(() => { const c = document.querySelector("#rp").shadowRoot.querySelector(".copyout"); return c && !c.hidden ? c.querySelector("textarea").value : null; });
ok(!!fb && /reads as a hole/.test(fb), "a blocked clipboard falls back to selectable text, not an error");
await rp.locator('[data-act="copy-close"]').click(); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".copyout").hidden);
ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".copyout").hidden), "and it closes again");

console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
