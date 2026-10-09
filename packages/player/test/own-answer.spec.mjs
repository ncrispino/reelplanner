#!/usr/bin/env node
// Two things a reviewer must always be able to do: answer a question in their own words, and leave a
// comment against the moment they are looking at. Own words wrap: 300 characters in the comment line, your own
// answer and "Expected something else?" wrap, stay within a few lines, scroll inside, and are saved whole; your own
// answer on the frame (by the cards) holds 2 lines, in the same box, and scrolls inside.
// usage: node packages/player/test/own-answer.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked, settled, loaded } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const port = testPort(8869);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 120)));
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload();
await loaded(p);
const rp = p.locator("#rp");
// your own words' box open (O), shown and ready to type in
const ownOpen = async () => { await until(p, () => { const t = document.querySelector("#rp").shadowRoot.querySelector(".own textarea"); return !!t && t.getClientRects().length > 0 && getComputedStyle(t).visibility !== "hidden"; }); await frames(p); };

// ---- a comment posts at the playhead and links back to it
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").seek(42));
await seeked(p, 42); await frames(p);
await rp.locator(".composer textarea").fill("Why not validate at commit time?");
await rp.locator('[data-act="post"]').click();
await until(p, () => document.querySelector("#rp").annotations.length > 0); await frames(p);
const first = await p.evaluate(() => { const a = document.querySelector("#rp").annotations; return a.length ? { t: a[0].t, c: a[0].comment, frame: a[0].frame } : null; });
ok(!!first && first.c === "Why not validate at commit time?", "a comment posts with its text");
ok(!!first && Math.abs(first.t - 42) < 2, `it is stamped at the moment it was written (${first && first.t})`);
ok((await rp.locator(".ann .ts").count()) > 0, "the feed shows a timestamp");
const tsLabel = await rp.locator(".ann .ts").first().textContent();
// The record is a sheet now, resting at a peek: reaching an entry means pulling it up first, which
// is exactly what a reviewer does. Clicking a timestamp closes the sheet itself (data-jump already
// calls closePull), so nothing needs to be undone after.
await rp.locator(".grab").click();
await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(p);
await rp.locator(".ann .ts").first().click();
// the jump closes the sheet, and the video is where the stamp says
await until(p, (t) => !document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled") && Math.abs(document.querySelector("#rp").player.currentTime - t) < 0.1, first?.t ?? 0);
const back = await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").currentTime);
ok(Math.abs(back - (first?.t ?? 0)) < 2.5, `clicking the timestamp (${tsLabel}) jumps back to it`);

// ---- every question offers an answer the plan did not anticipate
const d = await p.evaluate(() => document.querySelector("#rp").planMap.decisions[0]);
await p.evaluate((t) => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").seek(t), d.at - 1.2);
await rp.locator('[data-act="play"]').click();
await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
ok(await rp.locator(".own .ownbtn").isVisible(), "a decision offers to be answered in my own words");
await rp.locator(".own .ownbtn").click();
await rp.locator(".own textarea").fill("Neither — put it in Redis with a TTL");
await rp.locator('[data-act="own-save"]').click();
await until(p, (id) => !!document.querySelector("#rp").decisions[id], d.id); await frames(p);
const rec = await p.evaluate((id) => document.querySelector("#rp").decisions[id], d.id);
ok(rec && rec.option === "own" && /Redis/.test(rec.label), "the answer is recorded as the decision, not discarded");
const notes = await p.evaluate(() => document.querySelector("#rp").annotations.filter((a) => /Redis/.test(a.comment || "")));
ok(notes.length === 1, "and kept as a timestamped comment against the beat that asked");
ok(Math.abs((notes[0]?.t ?? 0) - d.at) < 2.5, "anchored to the question's own moment, not the playhead");

// ---- own words wrap (the owner: "it should probably wrap lines and keep same text box just be able to scroll it"):
// 300 characters, with a line break, in the comment line, a quick check's "Expected something else?" and a
// question's own answer: the box wraps (nothing runs off to the side), stays within its cap (4 lines, 3 for the
// note under an answer), scrolls inside, and what is saved is every character, the line break kept
const LONG = "It should match by tag only, not by the file's name, because two files can share a name across folders and the tag is what the reviewer wrote. ".repeat(3).slice(0, 290).trim();
const typeLong = async (sel) => { await rp.locator(sel).click(); await p.keyboard.type(LONG.slice(0, 140)); await p.keyboard.press("Shift+Enter"); await p.keyboard.type(LONG.slice(140)); await frames(p); };
const want = `${LONG.slice(0, 140).trim()}\n${LONG.slice(140).trim()}`;
const box = (sel, lines) => p.evaluate(([sel, lines]) => { const f = document.querySelector("#rp").shadowRoot.querySelector(sel), cs = getComputedStyle(f), lh = parseFloat(cs.lineHeight), edge = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
  return { tag: f.tagName, sh: f.scrollHeight, ch: f.clientHeight, oy: cs.overflowY, h: f.getBoundingClientRect().height, cap: lh * lines + edge + 1, lh, wraps: f.scrollWidth <= f.clientWidth + 1, scrolls: f.scrollHeight > f.clientHeight + 2 && cs.overflowY === "auto", pageW: document.documentElement.scrollWidth, len: f.value.length }; }, [sel, lines]);
await typeLong(".composer textarea");
let fx = await box(".composer textarea", 4);
ok(fx.tag === "TEXTAREA" && fx.wraps && fx.h <= fx.cap && fx.h > fx.lh * 2 && fx.pageW <= 1440, `the comment line wraps and grows, within 4 lines — ${JSON.stringify(fx)}`);
await p.keyboard.type(` ${LONG} ${LONG}`); await frames(p);
fx = await box(".composer textarea", 4);
ok(fx.h <= fx.cap && fx.scrolls, `three times as long, it stays 4 lines and scrolls inside — ${JSON.stringify(fx)}`);
const nAnn = await p.evaluate(() => document.querySelector("#rp").annotations.length);
await p.keyboard.press("Enter"); await until(p, (n) => document.querySelector("#rp").annotations.length > n, nAnn);
ok(await p.evaluate((w) => document.querySelector("#rp").annotations.at(-1)?.comment === w, `${want} ${LONG} ${LONG}`), "Enter posts it: every character, the line break kept");
// the same video with the fixture map that carries a quick check
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=packages/player/test/fixtures/l2-details.json`);
await loaded(p);
const qz = await p.evaluate(() => document.querySelector("#rp").planMap.quizzes?.[0] || null);
ok(!!qz, "the fixture map has a quick check to answer");
if (qz) {
  await p.evaluate((q) => { const el = document.querySelector("#rp"); el.start?.(); el.player.pause(); el.player.seek(q.at - 0.6); el.player.play(); }, qz);
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 }); await settled(p);
  await p.evaluate(() => document.querySelector("#rp").focus()); await p.keyboard.press("o"); await ownOpen();
  await typeLong(".own textarea"); await p.keyboard.type(` ${LONG} ${LONG}`); await frames(p);
  fx = await box(".own textarea", 4);
  ok(fx.wraps && fx.h <= fx.cap && fx.scrolls, `your own answer (three times 300 characters) wraps and stays within 4 lines, scrolling inside — ${JSON.stringify(fx)}`);
  await p.keyboard.press("Escape"); await frames(p);
  await p.evaluate((a) => document.querySelector("#rp").answerQuiz(a), qz.answer);
  await until(p, (id) => { const el = document.querySelector("#rp"), t = el.shadowRoot.querySelector(".decision [data-disagree]"); return !!el.quizzes[id] && !!t && t.getClientRects().length > 0; }, qz.id); await settled(p);
  await typeLong(".decision [data-disagree]");
  fx = await box(".decision [data-disagree]", 3);
  const ctl = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, f = r.querySelector(".decision [data-disagree]").getBoundingClientRect(); return [...r.querySelectorAll(".decision button")].filter((b) => b.getClientRects().length && getComputedStyle(b).visibility !== "hidden").map((b) => b.getBoundingClientRect()).filter((b) => b.width && b.left < f.right && f.left < b.right && b.top < f.bottom && f.top < b.bottom).length; });
  ok(fx.tag === "TEXTAREA" && fx.wraps && fx.h <= fx.cap && fx.scrolls && fx.pageW <= 1440 && ctl === 0, `"Expected something else?" wraps, stays within 3 lines, scrolls inside, and covers no button — ${JSON.stringify({ ...fx, overButtons: ctl })}`);
  await p.keyboard.press("Enter"); await until(p, (id) => document.querySelector("#rp").quizzes[id]?.note != null, qz.id);
  ok(await p.evaluate(([id, w]) => document.querySelector("#rp").quizzes[id]?.note === w, [qz.id, want]), "Enter keeps it with the answer: every character, the line break kept");
}

// ---- own words on the frame (plan 2026-09-25-answer-in-the-frame): the box by the cards wraps and keeps the same
// box, scrolling inside it, capped at 2 lines (the owner: at 3 it pushed a card's why behind "Read why in full");
// under the frame it keeps 4 (above). The contributing walkthrough answers its calls on the frame.
{
  const WALK = ".reelplanner/plans/2026-09-26-contributing/walkthrough-video";
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${WALK}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await loaded(p);
  await p.evaluate(() => document.querySelector("#rp").start?.()); await frames(p);
  const a = await p.evaluate(() => document.querySelector("#rp").planMap.autonomy?.[0] || null);
  ok(!!a, "the contributing walkthrough has a call to answer");
  if (a) {
    await p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(t); el.player.play(); }, a.at - 0.5);
    await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 }); await settled(p);
    ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("onframe")), "the call is answered on the frame");
    await p.evaluate(() => document.querySelector("#rp").focus()); await p.keyboard.press("o"); await ownOpen();
    await rp.locator(".own textarea").click();
    await p.keyboard.type(LONG.slice(0, 60)); await frames(p);
    const width = () => p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".own textarea").getBoundingClientRect().width);
    const one = await box(".own textarea", 2), w1 = await width();
    await p.keyboard.type(LONG.slice(60)); await frames(p);
    const two = await box(".own textarea", 2);
    await p.keyboard.type(` ${LONG} ${LONG}`); await frames(p);
    fx = await box(".own textarea", 2);
    ok(fx.tag === "TEXTAREA" && fx.wraps && one.h <= one.cap && !one.scrolls && fx.h <= fx.cap && fx.h > fx.lh * 1.5 && fx.scrolls && fx.pageW <= 1440, `your own words on the frame wrap in a box 2 lines high (as it opens, rows="2"), no higher, and scroll inside — ${JSON.stringify({ one: one.h, two: two.h, fx })}`);
    ok(Math.abs((await width()) - w1) < 1 && Math.abs(two.h - fx.h) < 1, `…in the same box: past 2 lines, typing on changes neither its width nor its height (${w1} → ${await width()}, ${two.h} → ${fx.h})`);
    const typed = await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".own textarea").value.trim());
    await p.keyboard.press("Enter"); await until(p, (id) => document.querySelector("#rp").autonomy[id]?.own != null, a.id);
    ok(await p.evaluate(([id, t]) => document.querySelector("#rp").autonomy[id]?.own === t, [a.id, typed]), `Enter saves them whole (${typed.length} characters)`);
  }
}

await b.close(); srv.kill();
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
