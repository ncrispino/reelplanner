#!/usr/bin/env node
// Answer in the frame keeps the frame readable: what the player lays on it never covers the frame's own words.
//   - the heading: "Full question" goes by the frame's heading, found as `data-question`, else the largest words
//     above the cards (A11), never words inside a box of the picture (a diagram's node, a chip, a rail's slot),
//     else the frame's label line ("Choice 1 · Step 1"); so the chip is never inside a diagram. On the
//     l2-upload-resume choices the largest words above the cards were a node's ("Client SDK", 32 px), and the
//     chip sat inside the diagram between Client SDK and Upload API.
//   - the row: what is laid under the cards (your own words, Explain this more, a note, the hint, a why, a
//     choice's Accept and Flag) goes under the frame's own words under each card, its sublines ("1 txn per part"
//     under Postgres), never over them (withSublines).
//   - the captions: while a question is up on the frame, none shows (its pill once showed behind "Add a note").
// Each question is played into as a reviewer meets it, and every line of the frame's words (outside the cards) is
// held against every control the player shows on the frame, and "Full question" against every box of the picture.
// usage: node packages/player/test/frame-room.spec.mjs [--full]
//   Alone, or in `npm test`, the three choices of l2-upload-resume; with --full (RP_FULL=1) also a call, a grouped
//   call and a quick check of the contributing walkthrough, a quick check of the system video and of w1-upload-resume.
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, FULL, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, seeked, still, settled, now } from "./wait.mjs";
import { readFileSync } from "node:fs"; import { join } from "node:path";

const L2 = "videos/l2-upload-resume", CONTRIB = ".reelplanner/plans/2026-09-26-contributing/walkthrough-video";
// the system video is rebuilt whenever the system changes: its first quick check's time comes from its plan map
const SYSTEM = ".reelplanner/system-video", firstCheck = (v) => JSON.parse(readFileSync(join(ROOT, v, "plan-map.json"), "utf8")).quizzes[0].at;
const RUNS = [
  [L2, 58.446, "choice 1", "Choice 1 · Step 1"], [L2, 139.492, "choice 2", "CHOICE 2 · STEP 4"], [L2, 191.801, "choice 3", "CHOICE 3 · STEP 5"],
  ...(FULL ? [[CONTRIB, 64.207, "call A2"], [CONTRIB, 71.802, "grouped calls"], [CONTRIB, 113.188, "quick check 1"], [SYSTEM, firstCheck(SYSTEM), "quick check 1"], ["videos/w1-upload-resume", 57.294, "quick check 1"]] : []),
];
const port = testPort(8893);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };

for (const [project, at, what, heading] of RUNS) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push(`${project}: page error ${String(e).slice(0, 120)}`));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
  await p.evaluate(() => { const el = document.querySelector("#rp"); el.start?.(); if (el._only) el.shadowRoot.querySelector('.revised [data-act="only"]')?.click(); });
  await until(p, () => !document.querySelector("#rp")._only);
  await p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(t); }, at - 0.5);
  await seeked(p, at - 0.5); await still(p);
  await p.locator("#rp").locator('[data-act="play"]').click();
  const up = await p.waitForFunction(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }, null, { timeout: 20000 }).then(() => true, () => false);
  ok(up, `${project}, ${what}: the question comes up`);
  if (!up) { await p.close(); continue; }
  await settled(p);   // the frame settled (its words revealed) and laid out again
  const r = await p.evaluate(() => {
    const el = document.querySelector("#rp"), R = el.shadowRoot, d = R.querySelector(".decision"), F = el._frameOf, st = el.stage.getBoundingClientRect();
    const out = { onframe: d.classList.contains("onframe"), heading: el._qbox?.text || null, text: [], box: [], lines: 0 };
    if (!out.onframe || !F || !el._toStage) return out;
    const toPage = (q) => { const s = el._toStage(q); return { l: st.left + (s.l * st.width) / 100, t: st.top + (s.t * st.height) / 100, r: st.left + ((s.l + s.w) * st.width) / 100, b: st.top + ((s.t + s.h) * st.height) / 100 }; };
    const seen = (e) => { let o = 1; for (let x = e; x && x !== F.doc.documentElement; x = x.parentElement) { const cs = F.win.getComputedStyle(x); if (cs.visibility === "hidden" || cs.display === "none") return false; o *= parseFloat(cs.opacity); } return o >= 0.2; };
    const cards = [...R.querySelectorAll(".hits .hit")].map((x) => x.getBoundingClientRect()).filter((q) => q.width);
    const inCard = (q) => cards.some((c) => (q.l + q.r) / 2 > c.left && (q.l + q.r) / 2 < c.right && (q.t + q.b) / 2 > c.top && (q.t + q.b) / 2 < c.bottom);
    const texts = [], w = F.doc.createTreeWalker(F.root, 4); let n;
    while ((n = w.nextNode())) { if (!n.textContent.trim() || !seen(n.parentElement)) continue; const rg = F.doc.createRange(); rg.selectNodeContents(n); for (const q of rg.getClientRects()) if (q.width > 2 && q.height > 2) { const t = { text: n.textContent.trim().slice(0, 24), ...toPage(q) }; if (!inCard(t)) texts.push(t); } }
    out.lines = texts.length;
    // the picture's boxes: a plan component, or an element that fills or rings a box narrower than most of the frame; not a card
    const fw = F.root.getBoundingClientRect().width;
    const boxes = [...F.root.querySelectorAll("*")].filter((x) => seen(x) && (x.hasAttribute("data-plan-component") || (() => { const cs = F.win.getComputedStyle(x), q = x.getBoundingClientRect(); return q.width < fw * 0.6 && q.width > 20 && (!/^(rgba\(0, 0, 0, 0\)|transparent)$/.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0); })()))
      .map((x) => ({ id: x.id || x.className, ...toPage(x.getBoundingClientRect()) })).filter((q) => !inCard(q));
    const meet = (a, c) => a.left < c.r - 2 && c.l < a.right - 2 && a.top < c.b - 2 && c.t < a.bottom - 2;
    const ctl = [...d.querySelectorAll(".own,.unclearbtn,.note,.walkbtn,.backbtn,.confirm,.gobtn,.foot .hint,.feedback,.blong,.disagree,.fwhy,.crow,.opts>.opt,.gflag,.rowmore")].filter((x) => !x.hidden && x.getClientRects().length && getComputedStyle(x).display !== "none" && getComputedStyle(x).visibility !== "hidden");
    for (const c of ctl) { const q = c.getBoundingClientRect(); for (const t of texts) if (meet(q, t)) out.text.push(`${c.className.split(" ")[0]} over "${t.text}"`); }
    const qm = R.querySelector(".hits .qmore");
    if (qm && !qm.hidden && qm.getClientRects().length) { const q = qm.getBoundingClientRect(); for (const x of boxes) if (meet(q, x)) out.box.push(`in ${x.id}`); for (const t of texts) if (meet(q, t)) out.box.push(`over "${t.text}"`); }
    return out;
  });
  ok(r.onframe, `${project}, ${what}: answered on the frame`);
  if (heading) ok(r.heading?.replace(/^\W+/, "") === heading, `${what}: the heading is the frame's label line, not a diagram's node — ${JSON.stringify(r.heading)}`);
  ok(r.box.length === 0, `${what}: "Full question" is not inside a box of the picture, nor over the frame's words — ${JSON.stringify(r.box)}`);
  ok(r.lines > 0 && r.text.length === 0, `${what}: nothing the player lays on the frame covers the frame's own words (${r.lines} lines) — ${JSON.stringify(r.text)}`);
  await p.close();
}

// The captions stay clear of the answer (the designer pass on videos-that-make-sense: the pill showed behind "Add a
// note"). A video whose captions hide each group with a set of `visibility: hidden` (every build since the sentence
// captions): going back undoes that set, leaving a group inline visible, which the page's hidden on the captions'
// parent did not reach. Met again after going back, no caption is seen while the question is up.
{
  const V = ".reelplanner/plans/2026-09-27-details-in-the-frame/video";
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("pageerror", (e) => fails.push(`captions: page error ${String(e).slice(0, 120)}`));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${V}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
  const at = await p.evaluate(() => document.querySelector("#rp").planMap.decisions[0].at);
  const meet = async () => { await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start?.(); el.giveWay?.(); el.player.pause(); el.player.seek(t); }, at - 1.5); await seeked(p, at - 1.5); await still(p);
    await p.locator("#rp").locator('[data-act="play"]').click();
    await p.waitForFunction(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }, null, { timeout: 20000 }); await settled(p); };
  const shown = () => p.evaluate(() => { const el = document.querySelector("#rp"), doc = el.player.iframeElement.contentDocument, win = doc.defaultView;
    const seen = (e) => { let o = 1; for (let x = e; x && x !== doc.documentElement; x = x.parentElement) { const cs = win.getComputedStyle(x); if (cs.display === "none") return false; o *= parseFloat(cs.opacity); } return win.getComputedStyle(e).visibility === "visible" && o > 0.05; };
    return [...doc.querySelectorAll("#el-captions .caption-group, [data-track-kind='captions'] .caption-group")].filter((x) => x.getBoundingClientRect().width > 4 && seen(x)).map((x) => x.textContent.slice(0, 40)); });
  await meet(); await p.evaluate(() => document.querySelector("#rp").focus()); await p.keyboard.press("a");
  // answered, and the video plays on a couple of seconds past it (by the video's own clock) before going back
  await until(p, () => { const el = document.querySelector("#rp"); return !el.pendingId() && !el.player.paused; });
  const t1 = await now(p); await until(p, (t1) => { const el = document.querySelector("#rp"); return el.player.currentTime >= t1 + 2.5 || !!el.pendingId() || el.player.paused; }, t1, 60000);
  await meet();
  const cap = await shown();
  ok(cap.length === 0, `captions: a question met again after going back shows no caption behind its answer row — ${JSON.stringify(cap)}`);
  await p.close();
}

// The marks that lead to the guide (D-266, round 1's A2: now on every walkthrough): a marked thing's label, "More in the
// guide ↓", opened as a pointer shows it, covers none of the frame's own words (frame-lint keeps 40 px clear above the
// thing; this is what the reviewer sees). Alone, or in `npm test`, one scene of each rebuilt walkthrough; with --full,
// every marked scene of them.
{
  const VIDS = [".reelplanner/plans/2026-09-29-explain-first/walkthrough-video", ".reelplanner/plans/2026-09-27-walkthroughs-that-help/walkthrough-video", ".reelplanner/plans/2026-09-26-contributing/walkthrough-video"];
  for (const V of VIDS) {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    p.on("pageerror", (e) => fails.push(`${V}: page error ${String(e).slice(0, 120)}`));
    await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${V}`);
    await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el._guideOk !== undefined; }, null, { timeout: 90000 });
    // (the guide is build output: without one here, its parts are not offered, and there is nothing to check)
    const guided = await until(p, () => document.querySelector("#rp")._guideOk, null, 10000);
    if (!guided) { console.log(`· ${V}: no guide built here; its marks are not offered`); await p.close(); continue; }
    const scenes = await p.evaluate(() => { const el = document.querySelector("#rp"); return el.detailsList.filter((d) => d.guide && d.frameIndex != null).map((d) => ({ name: d.name, at: +(d.end - 1.2).toFixed(2) })); });
    let marked = 0;
    for (const sc of FULL ? scenes : scenes.slice(2, 3)) {
      await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start?.(); el.player.pause(); el.player.seek(t); }, sc.at);
      await seeked(p, sc.at); await still(p);
      const has = await until(p, (n) => { const L = document.querySelector("#rp").shadowRoot.querySelector(".dmark"); return !L.hidden && L.querySelector(".dhit").dataset.name === n; }, sc.name, 8000);
      if (!has) continue;   // a scene whose frame marks nothing: the corner chip (check-details says which)
      marked++;
      await p.evaluate(() => document.querySelector("#rp").armDetail(true));
      await until(p, () => { const t = document.querySelector("#rp").shadowRoot.querySelector(".dmark .dtab"), w = (window.__tabW ||= { w: -1, n: 0 }), now = Math.round(t.getBoundingClientRect().width); if (now !== w.w) { w.w = now; w.n = 0; return false; } return ++w.n >= 4 && getComputedStyle(t).opacity === "1"; });
      const r = await p.evaluate((n) => { delete window.__tabW; const el = document.querySelector("#rp"), R = el.shadowRoot, tab = R.querySelector(".dmark .dtab").getBoundingClientRect(), d = el.detailNamed(n), m = el.detailMark(d), F = m.F, fr = el.player.iframeElement.getBoundingClientRect(), k = fr.width / (F.doc.documentElement.clientWidth || 1920);
        const seen = (e) => { let o = 1; for (let x = e; x && x !== F.doc.documentElement; x = x.parentElement) { const cs = F.win.getComputedStyle(x); if (cs.visibility === "hidden" || cs.display === "none") return false; o *= parseFloat(cs.opacity); } return o >= 0.2; };
        const hits = [], w = F.doc.createTreeWalker(F.root, 4); let t;
        while ((t = w.nextNode())) { if (!t.textContent.trim() || !seen(t.parentElement) || t.parentElement.closest("#el-captions,[data-composition-id='captions']")) continue; const rg = F.doc.createRange(); rg.selectNodeContents(t);
          for (const q of rg.getClientRects()) { if (q.width < 2 || q.height < 2) continue; const a = { l: fr.left + q.left * k, t: fr.top + q.top * k, r: fr.left + q.right * k, b: fr.top + q.bottom * k }; if (tab.left < a.r - 1 && a.l < tab.right - 1 && tab.top < a.b - 1 && a.t < tab.bottom - 1) hits.push(t.textContent.trim().slice(0, 24)); } }
        el.armDetail(false); return { hits, tab: { l: Math.round(tab.left), t: Math.round(tab.top), w: Math.round(tab.width) } }; }, sc.name);
      ok(r.hits.length === 0, `${V.split("/")[2]}, ${sc.name}: "More in the guide ↓" covers none of the frame's words — ${JSON.stringify(r)}`);
    }
    ok(marked > 0, `${V.split("/")[2]}: its frames mark the things that lead to the guide (${marked} of ${FULL ? scenes.length : 1} looked at)`);
    // …and a marked thing is there for most of its scene: landed by 60 % of it (round 2's N10: walkthroughs-that-help's
    // checks and contributing's who-decides came in the scene's last 4–5 s). Alone, those two; with --full, every one.
    const spans = await p.evaluate(() => document.querySelector("#rp").detailsList.filter((d) => d.guide && d.frameIndex != null).map((d) => ({ name: d.name, s: d.start, e: d.end })));
    for (const sc of spans.filter((x) => FULL || ["checks", "who-decides"].includes(x.name))) {
      const at = +(sc.s + 0.6 * (sc.e - sc.s)).toFixed(2);
      await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start?.(); el.player.pause(); el.player.seek(t); }, at);
      await seeked(p, at); await still(p);
      const m = await until(p, (n) => { const el = document.querySelector("#rp"), m = el.detailMark(el.detailNamed(n)); return m && (!m.el || m.landed) ? { el: !!m.el, landed: m.landed } : null; }, sc.name, 8000).then((h) => h?.jsonValue());
      if (m && !m.el) continue;   // its frame marks nothing: the corner chip (check-details says which)
      ok(!!m?.landed, `${V.split("/")[2]}, ${sc.name}: its marked thing has landed by 60 % of its scene (${at} s of ${sc.s.toFixed(1)}–${sc.e.toFixed(1)}) — ${JSON.stringify(m)}`);
    }
    await p.close();
  }
}

await b.close(); srv.kill();
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
