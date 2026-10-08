#!/usr/bin/env node
// Size (the owner, after the answer-in-the-frame review: "i want in the review html a way to zoom out a bit bc
// the video might be too big if my monitor big", then "for 'fit' here i want to be able to easily adjust that
// instead of just clicking it and it gets smaller, like more adjustable"). A Size button in the control bar, by
// 1× / Terms / Plan, a frame icon then "Fit" or the percent: it opens a drag, 40% to 100% of Fit in 1% steps,
// live, the percent beside it and a Fit button; - is 5% smaller and = 5% larger ([ and ] are the speed's;
// Ctrl+- / Ctrl+= stay the browser's zoom); the frame's bottom-right corner drags the size too, and a
// double-click on it is Fit. Remembered per browser (rp:size). Then "can we zoom into video as well? rn it just
// allows fit or smaller": the same drag goes on past Fit to 200%, where the stage keeps Fit's box and the picture
// is zoomed inside it, in a view that scrolls. Checked at 1920 x 1080, the big monitor it is for:
//   - the drag makes the stage that fraction of Fit's width (±2 px) while it is dragged, 16:9, centred; the
//     button and the percent say which; Fit puts it back
//   - the corner: dragged in, the stage follows the pointer; dragged out, it grows back; double-clicked, Fit
//   - the choice survives a reload; the keys step 5%, and stop at 40% and at Fit; typed into a comment, they are text
//   - at 45%, a quick check answered on the frame: the layer is the frame's box, each card's hit box sits on the
//     frame's own card, and a click on a card answers with that card
//   - at 55%, every "More" (a choice's and a quick check's) clears every button and its own card
//   - an older video's band under the frame is the stage's width and keeps its eighth; the detail side panel
//     sits beside the smaller stage, not over it
//   - on a phone (390 wide) the button and the corner are hidden and the video is Fit, whatever was chosen on a laptop
//   - zoomed in (150%, 200%): the stage keeps Fit's box and the controls stay in the window, the picture is that
//     much bigger inside it and scrolls (the wheel moves it, the arrow keys stay the player's); = steps on to 200%
//     and stops, - comes back through Fit; the corner dragged out from Fit zooms in; a question asked at 200%
//     scrolls into view, its cards' buttons sit on the frame's cards and a click on one answers it; Fit puts the
//     picture and the answer layer back on the stage's box
// usage: node packages/player/test/size.spec.mjs [--full]
//   Alone, or in `npm test`, it runs its quicker pass: the odd stored values after a reload ("huge", "12", "150",
//   "300") and every "More" at 55% are left to the full run, and a question is played into from just before it.
//   With --full (or RP_FULL=1, as `npm run test:full` sets) all of it, each question played into from a second before.
import { chromium } from "playwright-core"; import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs"; import { join, normalize, extname } from "node:path"; import { tmpdir } from "node:os";
import { launchOpts, testPort, FULL, ROOT, vendorFile } from "../../../scripts/lib/env.mjs";

const PLAN = ".reelplanning/plans/2026-09-24-answer-on-the-video/video";
const FOLLOW = ".reelplanning/plans/2026-09-25-videos-you-can-follow/video";
const LOOPW = ".reelplanning/plans/2026-09-22-m3-revise-loop/walkthrough-video";
const port = testPort(8897);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
// the videos-you-can-follow plan video with the storyboard's "More" words, as answer-on-frame.spec.mjs makes it
const virtual = {
  "/__fixtures/follow-more.json": () => { const m = JSON.parse(readFileSync(join(ROOT, FOLLOW, "plan-map.json"), "utf8")), q1 = m.decisions.find((d) => d.id === "q1"), k1 = m.quizzes.find((q) => q.id === "k1");
    q1.questionMore = "Every word a viewer sees or hears: the player's own text, the system video, and each plan video's captions.";
    q1.options[0].more = "The files, the commands and the decision log keep today's names; only what is on screen changes, and the glossary lists both.";
    k1.questionMore = "The build of the system video, right after step one lands.";
    k1.options[0].more = "The build refuses to finish, and says which word it could not find explained.";
    return JSON.stringify(m); },
};
const srv = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path === "/api/review") { res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ ok: true, sessionWaiting: true, agentCommand: null, inbox: 0 })); return; }
  if (virtual[path]) { res.writeHead(200, { "content-type": "application/json" }).end(virtual[path]()); return; }
  let file = join(ROOT, normalize(path));
  file = vendorFile(file) || file;
  if (!file.startsWith(ROOT)) { res.writeHead(404).end(); return; }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    const idx = join(file, "index.html");
    if (existsSync(idx)) { res.writeHead(200, { "content-type": "text/html" }).end(readFileSync(idx, "utf8").replace(/<head>/i, '<head><meta name="reelplanning-review-server" content="1">')); return; }
    res.writeHead(404).end(); return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
}).listen(port, "127.0.0.1");

const b = await chromium.launch(launchOpts());
const SHOTS = process.env.RP_SHOTS || null;   // a folder: screenshots land there too
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
// where the band goes is decided once the frames are mounted; until then the video keeps room under it
const bandKnown = async (p) => { await p.waitForFunction(() => document.querySelector("#rp")._bandIn !== undefined, null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(500); };
const ready = (p) => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
async function open(project, { w = 1920, h = 1080, map = null, size = null } = {}) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("pageerror", (e) => fails.push(`page error (${project}): ` + String(e).slice(0, 160)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}${map ? `&map=${map}` : ""}`);
  await p.evaluate((size) => { try { localStorage.clear(); if (size) localStorage.setItem("rp:size", size); } catch {} }, size);
  await p.reload(); await ready(p);
  await p.evaluate(() => document.querySelector("#rp").reachLocal?.());
  await bandKnown(p);
  const rp = p.locator("#rp");
  if (await p.evaluate(() => !!document.querySelector("#rp")._only)) { await rp.locator('.revised [data-act="only"]').click(); await p.waitForTimeout(300); }
  return { p, rp, w };
}
// the stage, the page's column it is centred in, and the Size button
const geo = (P) => P.p.evaluate(() => {
  const el = document.querySelector("#rp"), r = el.shadowRoot, s = r.querySelector(".stage").getBoundingClientRect(), wrap = r.querySelector(".wrap").getBoundingClientRect(), btn = r.querySelector('[data-act="size"]');
  const cs = getComputedStyle(r.querySelector(".wrap")), pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0, pop = r.querySelector(".szpop"), sl = r.querySelector("[data-sizer]"), grip = r.querySelector(".szgrip");
  return { w: s.width, h: s.height, l: s.left, r: s.right, top: s.top, bottom: s.bottom, mid: (s.left + s.right) / 2, col: (wrap.left + pl + wrap.right - pr) / 2,
    btn: { shown: btn.getClientRects().length > 0 && getComputedStyle(btn).display !== "none", text: btn.textContent.trim(), label: btn.getAttribute("aria-label"), title: btn.title, icon: !!btn.querySelector("svg"), expanded: btn.getAttribute("aria-expanded") },
    pop: { open: !pop.hidden, value: Number(sl.value), min: Number(sl.min), max: Number(sl.max), step: Number(sl.step), out: pop.querySelector(".val").textContent, fit: pop.querySelector(".fitbtn")?.textContent.trim() },
    grip: grip ? { shown: getComputedStyle(grip).display !== "none", b: grip.getBoundingClientRect().toJSON(), op: parseFloat(getComputedStyle(grip).opacity) } : null,
    size: el.vsize, stored: (() => { try { return localStorage.getItem("rp:size"); } catch { return null; } })(), scrollX: document.documentElement.scrollWidth > innerWidth + 1 };
});
const settle = (P) => P.p.waitForTimeout(250);
const LEAD = FULL ? 1.2 : 0.4;   // how long before a question it is played into
const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;

try {
  // ==== 1. the button opens the drag: 40% to 100% of Fit, live, the percent beside it, and Fit ====================
  let P = await open(PLAN);
  const fit = await geo(P);
  ok(fit.btn.shown && fit.btn.text === "Fit" && fit.btn.icon && /Video size: Fit/.test(fit.btn.label) && fit.stored === null && fit.size === 100, `at rest the button is the frame icon and "Fit", and nothing is stored — "${fit.btn.text}", ${Math.round(fit.w)} px wide`);
  ok(fit.w > 1100, `Fit fills a big monitor, as before — the frame is ${Math.round(fit.w)} × ${Math.round(fit.h)} at 1920 × 1080`);
  // it sits in the control bar with the speed, Terms and Plan, and never reads as one word with "1×"
  const inBar = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, b = r.querySelector('[data-act="size"]'), sp = r.querySelector('[data-act="speed"]'), bb = b.getBoundingClientRect(), sb = sp.getBoundingClientRect(), sx = sp.querySelector(".x").getBoundingClientRect(), bx = b.querySelector(".x").getBoundingClientRect(), ic = b.querySelector("svg").getBoundingClientRect();
    return { same: b.closest(".rgroup") === sp.closest(".rgroup") && Math.abs(bb.top - sb.top) < 2, w: bb.width, gap: bx.left - sx.right, iconBetween: ic.left > sx.right && ic.right < bx.left }; });
  ok(inBar.same && inBar.w <= 90 && inBar.iconBetween && inBar.gap >= 24, `the button is in the control bar beside 1×, small (${Math.round(inBar.w)} px), and its icon sits between "1×" and its value (${Math.round(inBar.gap)} px apart), so the two never read as one`);
  await P.rp.locator('[data-act="size"]').click(); await settle(P);
  let g = await geo(P);
  ok(g.pop.open && g.btn.expanded === "true" && g.pop.min === 40 && g.pop.max === 200 && g.pop.step === 1 && g.pop.value === 100 && g.pop.out === "Fit" && g.pop.fit === "Fit" && near(g.w, fit.w, 1), `a click opens the drag: 40–200 in 1% steps, at 100 ("${g.pop.out}"), with a Fit button — the video is unchanged until it is dragged`);
  // drag the slider's thumb: the stage follows while the button is still held
  const track = await P.p.evaluate(() => { const b = document.querySelector("#rp").shadowRoot.querySelector("[data-sizer]").getBoundingClientRect(); return { l: b.left, r: b.right, y: (b.top + b.bottom) / 2 }; });
  const thumbAt = (v) => track.l + 8 + ((v - 40) / 160) * (track.r - track.l - 16);   // a 16 px thumb travels the track less its own width
  await P.p.mouse.move(thumbAt(100), track.y); await P.p.mouse.down();
  await P.p.mouse.move(thumbAt(80), track.y, { steps: 6 }); await P.p.waitForTimeout(120);
  const mid = await geo(P);
  await P.p.mouse.move(thumbAt(63), track.y, { steps: 8 }); await P.p.waitForTimeout(120);
  const held = await geo(P);
  await P.p.mouse.up(); await settle(P);
  g = await geo(P);
  ok(mid.size < 100 && mid.size > 63 && near(mid.w, fit.w * mid.size / 100), `mid-drag, before the button is let go, the video is already ${mid.size}% (${Math.round(mid.w)} px, want ${Math.round(fit.w * mid.size / 100)} ±2)`);
  ok(near(g.size, 63, 2) && g.pop.value === g.size && g.pop.out === `${g.size}%` && g.btn.text === `${g.size}%` && g.stored === String(g.size) && near(held.w, g.w, 1), `let go at ${g.size}%: the stage is ${Math.round(g.w)} px, ${g.size}% of Fit's ${Math.round(fit.w)} (want ${Math.round(fit.w * g.size / 100)}); the drag says "${g.pop.out}", the button "${g.btn.text}", rp:size "${g.stored}"`);
  ok(near(g.w, fit.w * g.size / 100) && near(g.h, g.w * 9 / 16, 1.5) && near(g.mid, g.col, 2) && !g.scrollX, `${g.size}%: that fraction of Fit's width (±2 px), still 16:9 (${Math.round(g.w)} × ${Math.round(g.h)}) and centred (${Math.round(g.mid)} / ${Math.round(g.col)}), no sideways scroll`);
  // every value along the drag is that fraction of Fit: 40, 47, 72, 91, from the keyboard on the drag itself
  const along = [];
  for (const v of [40, 47, 72, 91]) { await P.p.evaluate((v) => { const s = document.querySelector("#rp").shadowRoot.querySelector("[data-sizer]"); s.value = String(v); s.dispatchEvent(new Event("input", { bubbles: true })); }, v); await settle(P); const x = await geo(P); along.push([v, x.size, Math.round(x.w), Math.round(fit.w * v / 100), near(x.w, fit.w * v / 100) && near(x.mid, x.col, 2)]); }
  ok(along.every((a) => a[0] === a[1] && a[4]), `each value along the drag is that fraction of Fit, centred: ${along.map((a) => `${a[0]}% ${a[2]}/${a[3]} px`).join(", ")}`);
  await P.p.evaluate(() => { const s = document.querySelector("#rp").shadowRoot.querySelector("[data-sizer]"); s.focus(); });
  await P.p.keyboard.press("ArrowLeft"); await settle(P);
  ok((await geo(P)).size === 90, `an arrow key on the drag moves it 1% — ${(await geo(P)).size}%`);
  if (SHOTS) await P.p.screenshot({ path: join(SHOTS, "size-drag-open.png") }).catch(() => {});
  await P.rp.locator(".szpop .fitbtn").click(); await settle(P);
  g = await geo(P);
  ok(g.size === 100 && g.btn.text === "Fit" && g.stored === "fit" && near(g.w, fit.w, 1) && g.pop.out === "Fit", `Fit, in the drag, puts it back as big as the window allows — ${Math.round(g.w)} px`);
  await P.p.keyboard.press("Escape"); await settle(P);
  ok(!(await geo(P)).pop.open, "Escape puts the drag away");
  await P.rp.locator('[data-act="size"]').click(); await settle(P);
  await P.p.mouse.click(5, 5); await settle(P);
  ok(!(await geo(P)).pop.open, "…and so does a click anywhere else");

  // ==== 2. the frame's corner: drag it, the video follows the pointer; double-click it, Fit ======================
  await P.p.mouse.move(fit.mid, fit.top + fit.h / 2); await P.p.waitForTimeout(300);
  g = await geo(P);
  ok(g.grip?.shown && g.grip.op > 0.9 && near(g.grip.b.right, g.r, 1) && near(g.grip.b.bottom, g.bottom, 1) && g.grip.b.width <= 28, `with the pointer on the video, a small handle shows at its bottom-right corner (${Math.round(g.grip.b.width)} px, opacity ${g.grip.op})`);
  await P.p.mouse.move(5, 5); await P.p.waitForTimeout(300);
  ok((await geo(P)).grip.op < 0.1, "…and it is gone when the pointer leaves");
  const gx = g.grip.b.x + g.grip.b.width / 2, gy = g.grip.b.y + g.grip.b.height / 2;
  await P.p.mouse.move(gx, gy); await P.p.waitForTimeout(200); await P.p.mouse.down();
  await P.p.mouse.move(gx - fit.w * 0.15, gy, { steps: 10 }); await P.p.waitForTimeout(150);
  const drag1 = await geo(P);
  await P.p.mouse.up(); await settle(P);
  const c1 = await geo(P);
  // centred, so the right edge moves half as far as the width: dragged in by 15% of Fit, the width is 70%
  ok(near(c1.size, 70, 2) && near(c1.w, fit.w * c1.size / 100) && near(c1.r, gx - fit.w * 0.15 + (g.r - gx), 4) && near(c1.mid, c1.col, 2) && near(drag1.w, c1.w, 2), `the corner dragged in by ${Math.round(fit.w * 0.15)} px: the video is ${c1.size}% (${Math.round(c1.w)} px), still centred, and its corner is under the pointer (${Math.round(c1.r)} / ${Math.round(gx - fit.w * 0.15 + (g.r - gx))})`);
  ok(c1.stored === String(c1.size) && c1.btn.text === `${c1.size}%` && near(c1.h, c1.w * 9 / 16, 1.5), `…the button says ${c1.btn.text}, it is remembered, and it is still 16:9`);
  const g2 = (await geo(P)).grip.b;
  await P.p.mouse.move(g2.x + g2.width / 2, g2.y + g2.height / 2); await P.p.waitForTimeout(150); await P.p.mouse.down();
  await P.p.mouse.move(g2.x + g2.width / 2, g2.y + g2.height / 2 + fit.h * 0.1, { steps: 8 }); await P.p.waitForTimeout(100);
  await P.p.mouse.up(); await settle(P);
  const c2 = await geo(P);
  ok(near(c2.size, c1.size + 10, 2) && near(c2.bottom, g2.y + g2.height / 2 + fit.h * 0.1 + (c1.bottom - (g2.y + g2.height / 2)), 4), `dragged down, it grows back: ${c1.size}% → ${c2.size}%, its bottom under the pointer`);
  await P.p.mouse.move(c2.mid, c2.top + 40); await P.p.mouse.move(5, 5);
  const g3 = (await geo(P)).grip.b;
  await P.p.mouse.move(g3.x + g3.width / 2, g3.y + g3.height / 2); await P.p.waitForTimeout(150); await P.p.mouse.down();
  await P.p.mouse.move(g3.x - 2000, g3.y, { steps: 6 }); await P.p.mouse.up(); await settle(P);
  ok((await geo(P)).size === 40, `dragged far in, it stops at 40% — ${(await geo(P)).size}%`);
  const g4 = (await geo(P)).grip.b;
  await P.p.mouse.move(g4.x + g4.width / 2, g4.y + g4.height / 2); await P.p.waitForTimeout(150);
  await P.p.mouse.dblclick(g4.x + g4.width / 2, g4.y + g4.height / 2); await settle(P);
  g = await geo(P);
  ok(g.size === 100 && g.btn.text === "Fit" && near(g.w, fit.w, 1) && g.stored === "fit", `double-clicked, the corner puts it back to Fit — ${Math.round(g.w)} px`);
  const paused = await P.p.evaluate(() => { const el = document.querySelector("#rp"); return { marks: el.annotations.length, tpop: el.shadowRoot.querySelector(".tpop").hidden }; });
  ok(paused.marks === 0 && paused.tpop, "a drag of the corner draws nothing on the frame and opens nothing");

  // ==== 3. the keys: - 5% smaller, = 5% larger, held at 40% and at Fit; typed in a comment, only text =============
  await P.p.evaluate(() => document.querySelector("#rp").focus());
  const seq = [];
  for (const key of ["-", "-", "=", "-"]) { await P.p.keyboard.press(key); await settle(P); seq.push((await geo(P)).btn.text); }
  ok(seq.join(" ") === "95% 90% 95% 90%", `- - = - steps it 5% each: ${seq.join(" → ")}`);
  for (let i = 0; i < 12; i++) await P.p.keyboard.press("-");
  await settle(P); g = await geo(P);
  ok(g.size === 40 && near(g.w, fit.w * 0.4), `held at 40% however many times - is pressed — ${g.btn.text}, ${Math.round(g.w)} px`);
  await P.p.evaluate(() => document.querySelector("#rp").setSize(63));
  await P.p.keyboard.press("="); await settle(P);
  const up5 = (await geo(P)).size;
  await P.p.keyboard.press("-"); await settle(P);
  ok(up5 === 65 && (await geo(P)).size === 60, `from a dragged 63%, = goes to 65% and - to 60%: onto the 5% marks — ${up5}%, ${(await geo(P)).size}%`);
  const sp0 = await P.p.evaluate(() => document.querySelector("#rp").speed);
  for (let i = 0; i < 10; i++) await P.p.keyboard.press("Shift+Equal");   // + is = with Shift, on most keyboards: 8 presses to Fit, then 125%, 150%
  await settle(P); g = await geo(P);
  ok(g.btn.text === "150%" && (await P.p.evaluate(() => document.querySelector("#rp").speed)) === sp0, `+ steps up as = does, on past Fit (60% → ${g.btn.text}), and neither touches the speed ([ and ]) — ${sp0}×`);
  await P.p.evaluate(() => document.querySelector("#rp").setSize(100)); await settle(P);
  await P.rp.locator(".composer textarea").click(); await P.p.keyboard.type("a-b=c"); await settle(P);
  g = await geo(P);
  ok(g.btn.text === "Fit" && (await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".composer textarea").value)) === "a-b=c", `typed into the comment box, - and = are text — "${g.btn.text}"`);
  await P.rp.locator(".composer textarea").fill(""); await P.p.keyboard.press("Escape");

  // ==== 4. it survives a reload =================================================================================
  await P.p.evaluate(() => document.querySelector("#rp").setSize(67));
  await P.p.reload(); await ready(P.p); await bandKnown(P.p);
  g = await geo(P);
  ok(g.btn.text === "67%" && near(g.w, fit.w * 0.67) && g.pop.value === 67, `reloaded, it is still 67% — ${Math.round(g.w)} px (want ${Math.round(fit.w * 0.67)}), the button "${g.btn.text}", the drag at ${g.pop.value}`);
  await P.p.evaluate(() => { try { localStorage.setItem("rp:size", "70"); } catch {} });
  await P.p.reload(); await ready(P.p); await bandKnown(P.p);
  ok((await geo(P)).btn.text === "70%", "a size stored by the stepping button (\"70\") reads as 70%");
  for (const [v, want] of FULL ? [["huge", "Fit"], ["12", "40%"], ["150", "150%"], ["300", "200%"]] : []) {
    await P.p.evaluate((v) => { try { localStorage.setItem("rp:size", v); } catch {} }, v);
    await P.p.reload(); await ready(P.p); await bandKnown(P.p);
    g = await geo(P);
    ok(g.btn.text === want, `a stored "${v}" is ${want} — "${g.btn.text}"`);
  }
  await P.p.close();

  // ==== 5. at 45%, a quick check answered on the frame hits the right card =======================================
  P = await open(PLAN, { size: "45" });
  const k1 = await P.p.evaluate(() => document.querySelector("#rp").points().find((x) => x.q.id === "k1")?.q);
  await P.p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(Math.max(0, t)); }, k1.at - LEAD); await P.p.waitForTimeout(350);
  await P.rp.locator('[data-act="play"]').click();
  await P.p.waitForFunction(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }, null, { timeout: 20000 });
  await P.p.waitForTimeout(700);
  // each option's hit box against the frame's own card, read from the frame's page, not the player's buttons
  const aim = await P.p.evaluate(() => {
    const el = document.querySelector("#rp"), r = el.shadowRoot, q = el._pendingDecision.q, d = r.querySelector(".decision"), sb = r.querySelector(".stage").getBoundingClientRect(), db = d.getBoundingClientRect();
    const cid = q.compositionId || el.planMap.frames.find((f) => f.index === q.frameIndex)?.compositionId;
    const ifr = el.player.iframeElement, doc = ifr.contentDocument, win = doc.defaultView, fr = ifr.getBoundingClientRect(), sx = fr.width / win.innerWidth, sy = fr.height / win.innerHeight;
    const root = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === cid);
    const outer = (els) => els.filter((x) => !els.some((o) => o !== x && o.contains(x)));
    const cards = q.options.map((o, i) => {
      const sel = [`[data-option="${o.id}"]`, `[data-plan-option="${o.id}"]`, ...["opt", "option", "choice", "chip"].map((s) => `[id$="-${s}-${o.id}"]`)].join(",");
      let c = outer([...root.querySelectorAll(sel)])[0]; if (!c) c = outer([...root.querySelectorAll("*")].filter((x) => [...x.classList].some((k) => /-opt$/.test(k))))[i];
      const cr = c.getBoundingClientRect(), card = { l: fr.left + cr.left * sx, t: fr.top + cr.top * sy, r: fr.left + cr.right * sx, b: fr.top + cr.bottom * sy };
      const hb = r.querySelector(`.hits .hit[data-hit="${o.id}"]`)?.getBoundingClientRect();
      return { id: o.id, card, hit: hb ? { l: hb.left, t: hb.top, r: hb.right, b: hb.bottom } : null, x: (card.l + card.r) / 2, y: (card.t + card.b) / 2 };
    });
    return { onframe: d.classList.contains("onframe"), layer: Math.abs(db.left - sb.left) < 1 && Math.abs(db.top - sb.top) < 1 && Math.abs(db.width - sb.width) < 1 && Math.abs(db.height - sb.height) < 1, stage: sb.width, size: r.querySelector(".stage").dataset.size, cards };
  });
  ok(aim.onframe && aim.layer && near(aim.stage, fit.w * 0.45), `at 45% (${Math.round(aim.stage)} px) quick check k1 is answered on the frame, and the layer is the frame's own box`);
  const off = aim.cards.map((c) => c.hit ? Math.max(Math.abs(c.hit.l - c.card.l), Math.abs(c.hit.t - c.card.t), Math.abs(c.hit.r - c.card.r), Math.abs(c.hit.b - c.card.b)) : 999);
  ok(off.every((x) => x <= 3), `each card's hit box sits on the frame's own card (within 3 px) — ${aim.cards.map((c, i) => `${c.id.toUpperCase()} ${off[i].toFixed(1)} px`).join(", ")}`);
  const pick = aim.cards.find((c) => c.id !== k1.answer) || aim.cards[0];
  await P.p.mouse.click(pick.x, pick.y); await P.p.waitForTimeout(400);
  const got = await P.p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { answer: el.quizzes.k1?.answer, chosen: r.querySelector('.hits .hit[data-chosen="true"]')?.dataset.hit, right: r.querySelector('.hits .hit[data-right="true"]')?.dataset.hit }; });
  ok(got.answer === pick.id && got.chosen === pick.id && got.right === k1.answer, `a click on card ${pick.id.toUpperCase()}'s middle answers ${pick.id.toUpperCase()}, and the answer is marked on the cards (yours ${got.chosen?.toUpperCase()}, the right one ${got.right?.toUpperCase()})`);
  // and the size changed while a question is up: the hit boxes follow the frame to the new size
  await P.p.evaluate(() => document.querySelector("#rp").setSize(85)); await P.p.waitForTimeout(700);
  const re = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, s = r.querySelector(".stage").getBoundingClientRect(), d = r.querySelector(".decision").getBoundingClientRect(), h = r.querySelector(`.hits .hit`).getBoundingClientRect(); return { w: s.width, layer: Math.abs(d.width - s.width) < 1 && Math.abs(d.left - s.left) < 1, inside: h.left >= s.left - 1 && h.right <= s.right + 1 && h.top >= s.top - 1 && h.bottom <= s.bottom + 1 }; });
  ok(near(re.w, fit.w * 0.85) && re.layer && re.inside, `made 85% with the answer up, the layer and the cards follow the frame — ${Math.round(re.w)} px`);
  await P.p.close();

  // ==== 6. at 55%, every "More" clears the buttons and its own card =============================================
  const moreClear = (P) => P.p.evaluate(() => {
    const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), pop = r.querySelector(".fpop"), sb = r.querySelector(".stage").getBoundingClientRect();
    const seen = (x) => x.getClientRects().length > 0 && getComputedStyle(x).visibility !== "hidden" && x.getBoundingClientRect().width > 0;
    const name = (x) => (x.dataset.more ? `More ${x.dataset.more}` : (x.textContent || x.placeholder || x.className).replace(/\s+/g, " ").trim().slice(0, 24));
    const meet = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const pb = pop.getBoundingClientRect(), key = el._more?.key || null;
    const ctrls = [...d.querySelectorAll("button, input, textarea, select, .own.open"), ...r.querySelectorAll(".hits .cmore")].filter(seen);
    const blocked = ctrls.filter((x) => { const b = x.getBoundingClientRect(), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2; if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return false; const at = r.elementFromPoint(cx, cy); return !(at && (at === x || x.contains(at))); }).map(name);
    const cb = key && key !== "q" ? el._cards?.[key] : null;
    const card = cb ? { left: sb.left + (cb.l / 100) * sb.width, top: sb.top + (cb.t / 100) * sb.height, right: sb.left + ((cb.l + cb.w) / 100) * sb.width, bottom: sb.top + ((cb.t + cb.h) / 100) * sb.height } : null;
    return { shown: !pop.hidden, key, over: pop.hidden ? [] : ctrls.filter((x) => meet(pb, x.getBoundingClientRect())).map(name), blocked, onCard: !!card && !pop.hidden && meet(pb, card), inWindow: pb.left >= 0 && pb.top >= 0 && pb.right <= innerWidth && pb.bottom <= innerHeight, n: ctrls.length, stage: sb.width };
  });
  if (FULL) {
  P = await open(FOLLOW, { map: "__fixtures/follow-more.json", size: "55" });
  let mores = 0;
  for (const id of ["q1", "k1"]) {
    const at = await P.p.evaluate((id) => document.querySelector("#rp").points().find((x) => x.q.id === id).q.at, id);
    await P.p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(Math.max(0, t)); }, at - LEAD); await P.p.waitForTimeout(350);
    await P.rp.locator('[data-act="play"]').click();
    await P.p.waitForFunction(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }, null, { timeout: 20000 });
    await P.p.waitForTimeout(700);
    const onframe = await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("onframe"));
    ok(onframe, `55%: ${id} is answered on the frame`);
    const keys = await P.p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".hits .cmore")].filter((x) => !x.hidden && x.getBoundingClientRect().width > 0).map((x) => x.dataset.more));
    for (const key of keys) {
      await P.rp.locator(`.hits .cmore[data-more="${key}"]`).click(); await P.p.waitForTimeout(250);
      const m = await moreClear(P); if (m.shown) mores++;
      ok(m.shown && m.key === key && !m.over.length && !m.blocked.length && !m.onCard && m.inWindow, `55% (${Math.round(m.stage)} px) ${id}: "More" on ${key} is clear of every control (${m.n}) and of its card — over ${JSON.stringify(m.over)}, blocked ${JSON.stringify(m.blocked)}`);
      if (id === "k1" && key === "a") await P.p.screenshot({ path: join(tmpdir(), "size-55-more.png") }).catch(() => {});
      await P.p.keyboard.press("Escape"); await P.p.waitForTimeout(150);
    }
    await P.p.mouse.move(5, 5); await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.closeMore(); el.giveWay(); el.player.pause(); }); await P.p.waitForTimeout(200);
  }
  ok(mores >= 4, `"More" checked on ${mores} cards and headings at 55%`);
  await P.p.close();
  }

  // ==== 7. an older video's band under the frame, at 55%: the stage's width, and its eighth ========================
  P = await open(LOOPW);
  const loopFit = (await geo(P)).w;
  await P.p.evaluate(() => document.querySelector("#rp").setSize(55)); await settle(P);
  const band = await P.p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, s = r.querySelector(".stage").getBoundingClientRect(), br = r.querySelector(".bandroom"), bb = br.getBoundingClientRect(); return { place: el._bandPlace, shown: getComputedStyle(br).display !== "none", w: s.width, h: s.height, bw: bb.width, bh: bb.height, gap: bb.top - s.bottom, l: bb.left - s.left }; });
  ok(band.place === "under" && band.shown, `the revise-loop walkthrough keeps its band under the frame — ${band.place}`);
  ok(near(band.w, loopFit * 0.55) && near(band.bw, band.w, 1) && near(band.l, 0, 1) && near(band.bh, Math.max(72, band.w * 9 / 128), 1.5) && band.gap >= -0.5 && band.gap <= 1, `at 55% the room under it is the stage's width (${Math.round(band.bw)} of ${Math.round(band.w)}) and an eighth of its height or 72 px (${Math.round(band.bh)}), right under it`);
  await P.p.close();

  // ==== 8. a detail opens over the smaller stage (D-195: over the frame, since details-in-the-frame) ===================
  P = await open("videos/l2-upload-resume", { map: "packages/player/test/fixtures/l2-details.json" });
  await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.start?.(); el.player.pause(); el.openDetail(el.detailsList[0]); }); await P.p.waitForTimeout(600);
  const dFit = await geo(P);
  await P.p.evaluate(() => document.querySelector("#rp").setSize(70)); await P.p.waitForTimeout(400);
  const dp = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, s = r.querySelector(".stage").getBoundingClientRect(), d = r.querySelector(".dpanel"), q = d.getBoundingClientRect(); return { open: !d.hidden, w: s.width, h: s.height, box: [s.left, s.top, s.width, s.height].map(Math.round).join(), page: [q.left, q.top, q.width, q.height].map(Math.round).join() }; });
  ok(dp.open && near(dp.w, dFit.w * 0.7) && dp.box === dp.page && near(dp.h, dp.w * 9 / 16, 1.5), `a detail open at 70%: the page covers the stage (${dp.page} over ${dp.box}), the stage 70% of Fit (${Math.round(dp.w)} of ${Math.round(dFit.w)})`);
  await P.p.close();

  // ==== 9. a phone: no button, and Fit whatever was chosen =========================================================
  P = await open(PLAN, { w: 390, h: 844, size: "55" });
  g = await geo(P);
  ok(!g.btn.shown && !g.grip.shown && near(g.w, 390, 1) && !g.scrollX, `on a phone the button and the corner are hidden and the video is Fit, edge to edge, though 55% was chosen — ${Math.round(g.w)} px`);
  await P.p.close();

  // ==== 10. zoomed in past Fit: the stage keeps its box, the picture grows inside it and scrolls ====================
  const ZSHOTS = process.env.RP_ZOOM_SHOTS || null;   // a folder: the 200% screenshot with a question up lands there
  // the stage, the picture inside it, the view that scrolls, and the controls under it
  const zgeo = (P) => P.p.evaluate(() => {
    const el = document.querySelector("#rp"), r = el.shadowRoot, box = (x) => { const b = x.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
    const zp = r.querySelector(".zport"), fr = el.player.iframeElement?.getBoundingClientRect();
    const ctl = [...r.querySelectorAll('.transport [data-act="play"], .transport [data-act="size"], .transport .scrub, .composer textarea')].map(box);
    return { size: el.vsize, text: r.querySelector('[data-act="size"]').textContent.trim(), stored: (() => { try { return localStorage.getItem("rp:size"); } catch { return null; } })(),
      stage: box(r.querySelector(".stage")), pic: box(r.querySelector(".zin")), frame: fr ? { w: fr.width, h: fr.height } : null, port: { cw: zp.clientWidth, ch: zp.clientHeight, sw: zp.scrollWidth, sh: zp.scrollHeight, x: zp.scrollLeft, y: zp.scrollTop, over: getComputedStyle(zp).overflowX },
      ctlIn: ctl.every((c) => c.t >= 0 && c.b <= innerHeight && c.r <= innerWidth), ctlLow: Math.max(...ctl.map((c) => c.b)), vh: innerHeight, pageX: document.documentElement.scrollWidth > innerWidth + 1, pageY: document.documentElement.scrollHeight };
  });
  P = await open(PLAN);
  const z0 = await zgeo(P);
  const slide = (v) => P.p.evaluate((v) => { const s = document.querySelector("#rp").shadowRoot.querySelector("[data-sizer]"); s.value = String(v); s.dispatchEvent(new Event("input", { bubbles: true })); }, v);
  for (const k of [150, 200]) {
    await slide(k); await P.p.waitForTimeout(400);
    const z = await zgeo(P), want = z.port.cw * k / 100;
    ok(z.size === k && z.text === `${k}%` && z.stored === String(k), `the drag goes past Fit: ${k}% — the button says "${z.text}", rp:size "${z.stored}"`);
    ok(near(z.stage.w, z0.stage.w, 1) && near(z.stage.h, z0.stage.h, 1) && near(z.stage.t, z0.stage.t, 1) && z.ctlIn && near(z.ctlLow, z0.ctlLow, 1) && !z.pageX && z.pageY <= z0.pageY + 1, `${k}%: the video's box stays Fit's (${Math.round(z.stage.w)} × ${Math.round(z.stage.h)}), the controls stay where they were, in the window (lowest at ${Math.round(z.ctlLow)} of ${z.vh}), and the page does not grow`);
    ok(near(z.pic.w, want, 2) && near(z.pic.h, want * 9 / 16, 2) && z.frame && near(z.frame.w, z.pic.w, 2) && z.port.over === "auto" && z.port.sw > z.port.cw + 10 && z.port.sh > z.port.ch + 10, `${k}%: the picture is ${k}% of its view (${Math.round(z.pic.w)} px, want ${Math.round(want)}; the frame drawn ${Math.round(z.frame?.w)} px), and the view scrolls (${z.port.sw} × ${z.port.sh} in ${z.port.cw} × ${z.port.ch})`);
  }
  // the wheel moves around the picture; the arrow keys stay the player's (5 s back and on), never the view's
  await P.p.evaluate(() => { const zp = document.querySelector("#rp").shadowRoot.querySelector(".zport"); zp.scrollTo(0, 0); });
  await P.p.mouse.move(z0.stage.l + z0.stage.w / 2, z0.stage.t + z0.stage.h / 2); await P.p.mouse.wheel(0, 300); await P.p.waitForTimeout(300);
  let zw = await zgeo(P);
  ok(zw.port.y > 100, `the wheel over the poster's play button moves the zoomed picture too (${zw.port.y} px down)`);
  await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(20); el.focus(); }); await P.p.waitForTimeout(300);
  await P.p.mouse.move(z0.stage.l + z0.stage.w * 0.3, z0.stage.t + z0.stage.h * 0.4); await P.p.mouse.wheel(250, 200); await P.p.waitForTimeout(400);
  const zw2 = await zgeo(P);
  ok(zw2.port.y > zw.port.y + 100 && zw2.port.x > 100, `playing, the wheel over the picture itself scrolls it both ways (${zw.port.y} → ${zw2.port.y} px down, ${zw2.port.x} px across)`);
  zw = zw2;
  const t0 = await P.p.evaluate(() => document.querySelector("#rp").player.currentTime);
  await P.p.keyboard.press("ArrowRight"); await P.p.waitForTimeout(300);
  const za = await zgeo(P), t1 = await P.p.evaluate(() => document.querySelector("#rp").player.currentTime);
  ok(za.port.x === zw.port.x && za.port.y === zw.port.y && t1 > t0 + 3, `→ still seeks (${t0.toFixed(1)} → ${t1.toFixed(1)} s) and leaves the view where it was`);
  // the keys: = on to 200% and held there, - back through Fit
  await P.p.evaluate(() => document.querySelector("#rp").setSize(160)); await P.p.evaluate(() => document.querySelector("#rp").focus());
  const zseq = [];
  for (const key of ["=", "=", "=", "-"]) { await P.p.keyboard.press(key); await settle(P); zseq.push((await zgeo(P)).text); }
  await P.p.evaluate(() => document.querySelector("#rp").setSize(105)); await P.p.keyboard.press("-"); await settle(P);
  const zf = await zgeo(P);
  ok(zseq.join(" ") === "175% 200% 200% 175%" && zf.text === "Fit" && near(zf.pic.w, z0.stage.w, 1) && zf.port.sw <= zf.port.cw + 1 && zf.port.sh <= zf.port.ch + 1, `past Fit = steps 25% (160% → 175%) on to 200% and stops there, - comes back down 25% (${zseq.join(" → ")}); from 105% - is Fit, the picture the stage's box again, nothing to scroll`);
  // the corner, dragged out from Fit, zooms in
  await P.p.mouse.move(z0.stage.l + z0.stage.w / 2, z0.stage.t + z0.stage.h / 2); await P.p.waitForTimeout(250);
  const zg = await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".szgrip").getBoundingClientRect().toJSON());
  await P.p.mouse.move(zg.x + zg.width / 2, zg.y + zg.height / 2); await P.p.waitForTimeout(150); await P.p.mouse.down();
  await P.p.mouse.move(zg.x + zg.width / 2 + z0.stage.w * 0.1, zg.y + zg.height / 2, { steps: 8 }); await P.p.mouse.up(); await settle(P);
  const zc = await zgeo(P);
  ok(near(zc.size, 120, 3) && near(zc.stage.w, z0.stage.w, 1), `the corner dragged out by ${Math.round(z0.stage.w * 0.1)} px from Fit zooms in to ${zc.size}% (want about 120%), the box still Fit's`);
  // a question at 200%: it scrolls into view, its buttons sit on the frame's cards, and a click answers
  await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.setSize(200); el.shadowRoot.querySelector(".zport").scrollTo(0, 0); }); await settle(P);
  const zk = await P.p.evaluate(() => document.querySelector("#rp").points().find((x) => x.q.id === "k1")?.q);
  await P.p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(Math.max(0, t)); }, zk.at - LEAD); await P.p.waitForTimeout(350);
  await P.rp.locator('[data-act="play"]').click();
  await P.p.waitForFunction(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }, null, { timeout: 20000 });
  await P.p.waitForTimeout(900);
  const aimZ = () => P.p.evaluate(() => {
    const el = document.querySelector("#rp"), r = el.shadowRoot, q = el._pendingDecision.q, d = r.querySelector(".decision"), zin = r.querySelector(".zin"), pb = zin.getBoundingClientRect(), db = d.getBoundingClientRect(), vb = r.querySelector(".zport").getBoundingClientRect();
    const cid = q.compositionId || el.planMap.frames.find((f) => f.index === q.frameIndex)?.compositionId;
    const ifr = el.player.iframeElement, doc = ifr.contentDocument, win = doc.defaultView, fr = ifr.getBoundingClientRect(), sx = fr.width / win.innerWidth, sy = fr.height / win.innerHeight;
    const root = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === cid);
    const cards = q.options.map((o) => {
      const c = root.querySelector(`[data-option="${o.id}"]`), cr = c.getBoundingClientRect(), card = { l: fr.left + cr.left * sx, t: fr.top + cr.top * sy, r: fr.left + cr.right * sx, b: fr.top + cr.bottom * sy };
      const hb = r.querySelector(`.hits .hit[data-hit="${o.id}"]`)?.getBoundingClientRect();
      const x = (Math.max(card.l, vb.left) + Math.min(card.r, vb.right)) / 2, y = (Math.max(card.t, vb.top) + Math.min(card.b, vb.bottom)) / 2;   // the middle of what of it is in view
      const at = r.elementFromPoint(x, y);
      return { id: o.id, card, hit: hb ? { l: hb.left, t: hb.top, r: hb.right, b: hb.bottom } : null, x, y, seen: card.r > vb.left + 20 && card.l < vb.right - 20 && card.b > vb.top + 20 && card.t < vb.bottom - 20, whole: card.l >= vb.left - 1 && card.r <= vb.right + 1 && card.t >= vb.top - 1 && card.b <= vb.bottom + 1, top: !!at?.closest?.(`.hit[data-hit="${o.id}"]`) };
    });
    const head = root.querySelector("[data-question]")?.getBoundingClientRect(), hv = head ? fr.top + head.top * sy : null, hb = head ? fr.top + head.bottom * sy : null;
    return { onframe: d.classList.contains("onframe"), inPic: d.parentElement === zin, layer: Math.abs(db.left - pb.left) < 1 && Math.abs(db.top - pb.top) < 1 && Math.abs(db.width - pb.width) < 1 && Math.abs(db.height - pb.height) < 1, pic: pb.width, view: vb.width, scrolled: r.querySelector(".zport").scrollTop, headIn: hv != null && hv >= vb.top - 1 && hb <= vb.bottom + 1, headAt: hv == null ? null : [Math.round(hv - vb.top), Math.round(hb - vb.top)], cards };
  });
  const zq = await aimZ(), zoff = zq.cards.map((c) => c.hit ? Math.max(Math.abs(c.hit.l - c.card.l), Math.abs(c.hit.t - c.card.t), Math.abs(c.hit.r - c.card.r), Math.abs(c.hit.b - c.card.b)) : 999);
  ok(zq.onframe && zq.inPic && zq.layer && near(zq.pic, zq.view * 2, 3), `at 200% (the picture ${Math.round(zq.pic)} px in a ${Math.round(zq.view)} px view) quick check k1 is answered on the frame, and its layer is the zoomed picture's own box`);
  ok(zoff.every((x) => x <= 3), `at 200% each card's button sits on the frame's own card (within 3 px) — ${zq.cards.map((c, i) => `${c.id.toUpperCase()} ${zoff[i].toFixed(1)} px`).join(", ")}`);
  ok(zq.scrolled > 0 && zq.cards.every((c) => c.whole && c.top), `asked while zoomed in, the view scrolled to the question (${zq.scrolled} px down): every card is whole in view (the heading too where both fit${zq.headIn ? ", as here" : "; here only the cards do"}), and each card's button is what a click there reaches (${zq.cards.map((c) => `${c.id.toUpperCase()}${c.whole ? " whole" : " in part"}`).join(", ")})`);
  const zg2 = await zgeo(P);
  ok(zg2.ctlIn && near(zg2.stage.w, z0.stage.w, 1), `with the question up at 200% the controls are still in the window and the box still Fit's`);
  if (ZSHOTS) { const { mkdirSync } = await import("node:fs"); mkdirSync(ZSHOTS, { recursive: true }); await P.p.screenshot({ path: join(ZSHOTS, "zoom-200-question.png") }).catch(() => {}); }
  const zpick = zq.cards.find((c) => c.id !== zk.answer) || zq.cards[0];
  await P.p.mouse.click(zpick.x, zpick.y); await P.p.waitForTimeout(500);
  const zgot = await P.p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { answer: el.quizzes.k1?.answer, chosen: r.querySelector('.hits .hit[data-chosen="true"]')?.dataset.hit }; });
  ok(zgot.answer === zpick.id && zgot.chosen === zpick.id, `at 200% a click on card ${zpick.id.toUpperCase()} answers ${zpick.id.toUpperCase()} — ${zgot.answer?.toUpperCase()}`);
  if (ZSHOTS) await P.p.screenshot({ path: join(ZSHOTS, "zoom-200-answered.png") }).catch(() => {});
  // a card's "More" at 200%: by the card on the screen, never over it, inside the window; a scroll of the view puts it away
  const zmk = await P.p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".hits .cmore:not(.qmore)")].filter((x) => !x.hidden && x.getBoundingClientRect().width > 0).map((x) => x.dataset.more)[0] || null);
  if (zmk) {
    await P.rp.locator(`.hits .cmore[data-more="${zmk}"]`).click(); await P.p.waitForTimeout(300);
    const zm = await P.p.evaluate((k) => { const el = document.querySelector("#rp"), r = el.shadowRoot, pop = r.querySelector(".fpop"), pb = pop.getBoundingClientRect(), hb = r.querySelector(`.hits .hit[data-hit="${k}"]`).getBoundingClientRect();
      return { shown: !pop.hidden, over: pb.left < hb.right - 1 && hb.left < pb.right - 1 && pb.top < hb.bottom - 1 && hb.top < pb.bottom - 1, inWin: pb.left >= 0 && pb.top >= 0 && pb.right <= innerWidth && pb.bottom <= innerHeight }; }, zmk);
    await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".zport").scrollBy(0, 60)); await P.p.waitForTimeout(250);
    const zmGone = await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".fpop").hidden);
    ok(zm.shown && !zm.over && zm.inWin && zmGone, `at 200% "More" on card ${zmk.toUpperCase()} opens by the card, not over it, inside the window, and goes when the view scrolls`);
  } else ok(false, "at 200% no card had a \"More\" to open");
  // Fit, from the drag, with the question still up: the picture and the layer are the stage's box again, on the cards
  await P.rp.locator('[data-act="size"]').click(); await settle(P);
  await P.rp.locator(".szpop .fitbtn").click(); await P.p.waitForTimeout(700);
  const zb = await P.p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, s = r.querySelector(".stage").getBoundingClientRect(), p = r.querySelector(".zin").getBoundingClientRect(), d = r.querySelector(".decision"), db = d.getBoundingClientRect(), zp = r.querySelector(".zport");
    return { size: el.vsize, text: r.querySelector('[data-act="size"]').textContent.trim(), same: Math.abs(p.width - s.width) < 1 && Math.abs(p.left - s.left) < 1 && Math.abs(p.top - s.top) < 1, layer: d.parentElement === r.querySelector(".main") && Math.abs(db.width - s.width) < 1 && Math.abs(db.left - s.left) < 1 && Math.abs(db.top - s.top) < 1, x: zp.scrollLeft, y: zp.scrollTop }; });
  const zfit = await aimZ(), zfoff = zfit.cards.map((c) => c.hit ? Math.max(Math.abs(c.hit.l - c.card.l), Math.abs(c.hit.t - c.card.t), Math.abs(c.hit.r - c.card.r), Math.abs(c.hit.b - c.card.b)) : 999);
  ok(zb.size === 100 && zb.text === "Fit" && zb.same && zb.layer && zb.x === 0 && zb.y === 0 && zfoff.every((x) => x <= 3), `Fit puts it back: 100% ("${zb.text}"), the picture and the answer layer the stage's box again, the cards' buttons on the cards (${zfoff.map((x) => x.toFixed(1)).join(", ")} px)`);
  await P.p.close();
  P = await open(PLAN, { w: 390, h: 844, size: "150" });
  const zph = await zgeo(P);
  ok(near(zph.pic.w, 390, 1) && near(zph.stage.w, 390, 1) && !zph.pageX, `a phone ignores a zoom chosen on a laptop: the picture is the screen's width — ${Math.round(zph.pic.w)} px`);
  await P.p.close();
} catch (e) { fails.push("threw: " + String(e?.stack || e).slice(0, 400)); console.log(e); }

await b.close(); srv.close();
console.log(`\nscreenshot: ${join(tmpdir(), "size-55-more.png")}`);
console.log(fails.length ? `\n✗ ${fails.length} failed:\n${fails.join("\n")}` : "\n✓ all passed");
process.exit(fails.length ? 1 : 0);
