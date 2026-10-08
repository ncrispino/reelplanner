#!/usr/bin/env node
// The answer band reads in full (the owner's feedback on answer-on-the-video, with fewer-better-stops).
// Nothing in the band is ever cut off, clamped or scrolled: the question, the feedback after an answer, a
// call's words and a stop beat's list of calls show in full, wrapping; the band grows up over the frame as
// they need (the video keeps its size), to a cap of about 40% of the frame (on a phone, where the band is
// in the page's flow under the frame, 60% of the screen), past which the long words move to the side panel
// and the band says so. Controls wrap to rows of their own; a note field in use takes a full row.
// Checked for the longest words in the repo's videos, at 1440, 1024 and 390 wide:
//   - the longest question: fewer-better-stops k1 (in the frame), and the owner's case, memory k4 (its
//     question cut to "Doe…", then its feedback clipped with a scroll bar, the note field cut)
//   - the longest feedback: the revise-loop walkthrough's k3, answered wrong (under the frame, an older
//     video), with its "Expected something else?" field in use
//   - the longest call: the answer-on-the-video walkthrough's A5
//   - stop beats (fewer-better-stops step 1): that walkthrough's step 2 as one beat of 8 calls, and step 1's
//     first two as one of 2, each call with its own Accept and Flag
//   - past the cap: memory k4 with its explanation made twenty times as long
//   - the common short case keeps the reserved eighth: the revise-loop plan's question 4
// For each: no text element clipped (its scroll box within its client box, no ellipsis, no line clamp), the
// band not scrolling, every control inside the band and the window, the words in full.
// Answer in the frame (plan 2026-09-25): at 1440 and 1024 a question whose frame has its cards is answered on the
// frame, not in the bar; the same longest words are checked there by the same rules — nothing clipped, clamped or
// scrolled, every control inside the window, the words in full (the question behind "Full question", each card's
// why on it) or, past the room, in the side panel ("Read why in full"). The bar keeps them on a phone, and for a
// choice the agent made whose frame has no card for it (every walkthrough here).
// usage: node packages/player/test/band.spec.mjs [--full]
//   Alone, or in `npm test`, it runs its quicker pass: every case at 1440, and on a phone the owner's case (memory
//   k4, in the bar), each question played into from just before it. With --full (or RP_FULL=1, as `npm run
//   test:full` sets) every case at 1440, 1024 and 390, each played into from a second before.
import { chromium } from "playwright-core"; import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs"; import { join, normalize, extname } from "node:path"; import { tmpdir } from "node:os";
import { launchOpts, testPort, FULL, ROOT, vendorFile } from "../../../scripts/lib/env.mjs";
import { until, frames, settled, still } from "./wait.mjs";

const FBS = ".reelplanning/plans/2026-09-25-fewer-better-stops/video";
const MEMW = ".reelplanning/plans/2026-09-24-memory/walkthrough-video";
const LOOPW = ".reelplanning/plans/2026-09-22-m3-revise-loop/walkthrough-video";
const LOOP = ".reelplanning/plans/2026-09-22-m3-revise-loop/video";
const AWALK = ".reelplanning/plans/2026-09-24-answer-on-the-video/walkthrough-video";
const port = testPort(8893);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const mapOf = (v) => JSON.parse(readFileSync(join(ROOT, v, "plan-map.json"), "utf8"));
// Made here rather than kept as files: the answer-on-the-video walkthrough with two stop beats (its step 2's
// eight calls, and step 1's first two), and the memory walkthrough with k4's explanation six times as long.
const STOP8 = ["a3", "a4", "a5", "a12", "a13", "a14", "a15", "a16"], STOP2 = ["a1", "a2"];
const virtual = {
  "/__fixtures/awalk-stops.json": () => {
    const m = mapOf(AWALK), take = (ids) => ids.map((id) => m.autonomy.find((a) => a.id === id)).filter(Boolean);
    const beat = (ids, n) => { const cs = take(ids), last = cs.reduce((a, c) => (c.at > a.at ? c : a)); return { id: `stop-${n}`, stop: true, frameIndex: last.frameIndex, planStep: last.planStep, ids, calls: cs.map(({ id, planStep, chose, insteadOf, why, check }) => ({ id, planStep, chose, insteadOf, why, check })), at: last.at }; };
    m.autonomyGroups = [beat(STOP2, 1), beat(STOP8, 2)];
    m.autonomy = m.autonomy.filter((a) => ![...STOP8, ...STOP2].includes(a.id));
    return JSON.stringify(m);
  },
  "/__fixtures/memw-long.json": () => { const m = mapOf(MEMW), q = m.quizzes.find((x) => x.id === "k4"); q.explain = Array.from({ length: 20 }, () => q.explain).join(" "); return JSON.stringify(m); },
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
    if (existsSync(idx)) { res.writeHead(200, { "content-type": "text/html" }).end(readFileSync(idx)); return; }
    res.writeHead(404).end(); return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
}).listen(port, "127.0.0.1");

const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const SIZES = FULL ? [[1440, 1000], [1024, 768], [390, 844]] : [[1440, 1000], [390, 844]];
// the quicker pass, on a phone: only the owner's case (memory k4, its question, feedback and note field in the bar)
const every = (W) => FULL || W > 600;

async function open(project, [w, h], map = null) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("pageerror", (e) => fails.push(`page error (${project}): ` + String(e).slice(0, 160)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}${map ? `&map=${map}` : ""}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
  await p.waitForFunction(() => document.querySelector("#rp")._bandIn !== undefined, null, { timeout: 15000 }).catch(() => {});
  if (await p.evaluate(() => !!document.querySelector("#rp")._only)) { await p.locator("#rp").locator('.revised [data-act="only"]').click(); await until(p, () => !document.querySelector("#rp")._only); }
  await p.waitForFunction(() => document.querySelector("#rp").stage?.dataset.ready, null, { timeout: 90000 }); await frames(p);
  return p;
}
async function into(p, id) {
  const at = await p.evaluate((id) => document.querySelector("#rp").points().find((x) => x.q.id === id)?.q.at, id);
  if (at == null) { fails.push(`no question ${id}`); return false; }
  const from = Math.max(0, at - (FULL ? 1.2 : 0.4));
  await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, from);
  await until(p, (t) => Math.abs(document.querySelector("#rp").player.currentTime - t) < 0.1, from); await still(p);
  await p.locator("#rp").locator('[data-act="play"]').click();
  await p.waitForFunction(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }, null, { timeout: 20000 });
  await settled(p);
  return true;
}
// What the band shows, and everything in it that is cut off, scrolled or outside it.
const measure = (p) => p.evaluate(() => {
  const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), st = r.querySelector(".stage");
  d.scrollIntoView({ block: "nearest" });
  const cs = (x) => getComputedStyle(x);
  const shown = (x) => { for (let n = x; n && n !== r; n = n.parentElement || n.parentNode) { if (n.nodeType !== 1) break; const c = cs(n); if (c.display === "none" || c.visibility === "hidden") return false; } const bb = x.getBoundingClientRect(); return bb.width > 0 && bb.height > 0; };
  const nm = (x) => `${x.tagName.toLowerCase()}${typeof x.className === "string" && x.className.trim() ? "." + x.className.trim().split(/\s+/).join(".") : ""}`;
  const ctx = document.createElement("canvas").getContext("2d");
  const db = d.getBoundingClientRect(), sb = st.getBoundingClientRect(), problems = [];
  const onframe = d.classList.contains("onframe");
  for (const x of d.querySelectorAll("*")) {
    if (!shown(x)) continue;
    if (onframe && x.getBoundingClientRect().width <= 2) continue;   // read out only (the frame shows the question)
    const c = cs(x), text = [...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (c.display !== "inline" && c.display !== "contents" && (x.scrollWidth > x.clientWidth + 1 || x.scrollHeight > x.clientHeight + 1) && !(c.overflowX === "visible" && c.overflowY === "visible" && c.webkitLineClamp === "none")) problems.push(`${nm(x)} clipped: ${x.scrollWidth}×${x.scrollHeight} in ${x.clientWidth}×${x.clientHeight}`);
    if (text && c.textOverflow === "ellipsis" && c.whiteSpace === "nowrap" && x.scrollWidth > x.clientWidth + 1) problems.push(`${nm(x)} ends in an ellipsis`);
    if (c.webkitLineClamp && c.webkitLineClamp !== "none" && x.scrollHeight > x.clientHeight + 1) problems.push(`${nm(x)} clamped to ${c.webkitLineClamp} lines`);
    if (/^(BUTTON|INPUT|TEXTAREA)$/.test(x.tagName)) {
      const bb = x.getBoundingClientRect();
      if (!onframe && (bb.left < db.left - 1 || bb.right > db.right + 1 || bb.top < db.top - 1 || bb.bottom > db.bottom + 1)) problems.push(`${nm(x)} "${(x.textContent || x.placeholder || "").trim().slice(0, 24)}" outside the band`);
      if (bb.left < -1 || bb.right > innerWidth + 1 || bb.top < -1 || bb.bottom > innerHeight + 1) problems.push(`${nm(x)} "${(x.textContent || x.placeholder || "").trim().slice(0, 24)}" outside the window`);
    }
    if (x.tagName === "INPUT") {
      ctx.font = `${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`;
      const words = x.value || x.placeholder || "", room = x.clientWidth - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight), need = ctx.measureText(words).width;
      if (need > room + 1) problems.push(`${nm(x)} words cut: "${words.slice(0, 40)}" needs ${Math.round(need)} px, has ${Math.round(room)}`);
    }
  }
  if (!onframe && (d.scrollHeight > d.clientHeight + 1 || d.scrollWidth > d.clientWidth + 1)) problems.push(`the band scrolls: ${d.scrollWidth}×${d.scrollHeight} in ${d.clientWidth}×${d.clientHeight}`);
  const q = d.querySelector(".q"), fb = d.querySelector(".feedback");
  const whys = [...d.querySelectorAll(".fwhy")].filter(shown).map((x) => ({ id: x.dataset.for, right: x.dataset.right === "true", text: x.innerText }));
  return { onframe, whys, full: onframe ? el.moreHtml("q").replace(/<[^>]+>/g, "").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&") : "", problems, h: db.height, top: db.top, stage: { w: sb.width, h: sb.height, top: sb.top, bottom: sb.bottom }, home: d.parentElement.classList[0], phone: innerWidth <= 600, vh: innerHeight,
    q: shown(q) ? q.textContent : null, fb: shown(fb) ? fb.textContent : null, long: d.classList.contains("long"), blong: shown(d.querySelector(".blong")) ? d.querySelector(".blong").textContent : null, rows: [...d.querySelectorAll(".crow")].filter(shown).map((x) => ({ id: x.dataset.call, text: x.querySelector(".cw")?.textContent || "", shown: shown(x.querySelector(".cw")), acts: [...x.querySelectorAll("button")].filter(shown).map((y) => y.textContent.replace(/\s+/g, " ").trim()) })),
    field: (() => { const f = [...d.querySelectorAll(".disagree.on, .note")].find(shown); return f ? f.getBoundingClientRect().width / db.width : null; })() };
});
const stageOf = (p) => p.evaluate(() => { const bb = document.querySelector("#rp").shadowRoot.querySelector(".stage").getBoundingClientRect(); return { w: Math.round(bb.width), h: Math.round(bb.height) }; });
// the band's cap: 40% of the frame, or on a phone (in the page's flow) 60% of the screen
const capOf = (m) => (m.phone ? m.vh * 0.6 : m.stage.h * 0.4) + 1;
function clean(tag, m) {
  if (m.onframe) { ok(!m.problems.length, `${tag}: on the frame, nothing clipped, scrolled or outside the window — ${m.problems.length ? m.problems.join("; ") : "whole"}`); return; }
  ok(!m.problems.length, `${tag}: nothing clipped, scrolled or outside the band — ${m.problems.length ? m.problems.join("; ") : `${Math.round(m.h)} px high`}`);
  ok(m.h <= capOf(m) || m.long, `${tag}: the band stays under its cap (${Math.round(m.h)} px of ${Math.round(capOf(m))})`);
}
// where a question is: on the frame at a laptop's width, in the bar on a phone
const where = (W, m, tag) => ok(W > 600 ? m.onframe : !m.onframe && m.home === "bandroom", `${tag}: ${W > 600 ? "answered on the frame, not in a bar" : "a phone: in the bar under the frame"}`);
// the words in full: the bar's line, or on the frame the right card's why (or, past the room, the side panel)
const fullFb = (m, explain) => m.onframe ? (m.long ? /Read why in full/.test(m.blong || "") : m.whys.some((x) => x.right && x.text.includes(explain.slice(-40)))) : m.long ? /Read it in full/.test(m.blong || "") : !!m.fb && m.fb.includes(explain.slice(-40));
const log = [];
try {
  for (const size of SIZES) {
    const W = size[0];
    // ---- the longest question (in the frame), and the owner's case
    let p;
    if (every(W)) {
    p = await open(FBS, size);
    const k1 = (await p.evaluate(() => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === "k1")));
    const before = await stageOf(p);
    if (await into(p, "k1")) {
      const m = await measure(p); log.push([W, "question k1", Math.round(m.h), m.problems.length]);
      clean(`${W}px, the longest question (fewer-better-stops k1)`, m);
      where(W, m, `${W}px, fewer-better-stops k1`);
      const plainQ = (t) => String(t || "").replace(/ · (choice|off-plan change|decision)\b/g, "").replace(/\bcalls\b/g, "choices").replace(/\bcall\b/g, "choice").replace(/\s+/g, " ").trim();   // D-127: the player shows plain words
      ok(m.onframe ? plainQ(m.full).includes(plainQ(k1.question)) : plainQ(m.q) === plainQ(k1.question), `${W}px: the question in full${m.onframe ? ", behind \"Full question\"" : ""} — want "${plainQ(k1.question)}" got "${plainQ(m.onframe ? m.full : m.q)}"`);
      ok(JSON.stringify(await stageOf(p)) === JSON.stringify(before), `${W}px: the video keeps its size while the band grows — ${JSON.stringify(before)}`);
      await p.screenshot({ path: join(tmpdir(), `band-question-${W}.png`) }).catch(() => {});
    }
    await p.close();
    }

    p = await open(MEMW, size);
    const k4 = await p.evaluate(() => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === "k4"));
    if (await into(p, "k4")) {
      let m = await measure(p); log.push([W, "memory k4 question", Math.round(m.h), m.problems.length]);
      clean(`${W}px, the owner's question (memory k4)`, m);
      where(W, m, `${W}px, memory k4`);
      ok(m.onframe ? m.full.includes(k4.question) : m.q === k4.question, `${W}px: not "Doe…": the whole question — "${k4.question.slice(-30)}"`);
      await p.evaluate((a) => document.querySelector("#rp").answerQuiz(a), k4.answer); await until(p, () => !!document.querySelector("#rp").quizzes.k4); await settled(p);
      m = await measure(p); log.push([W, "memory k4 feedback", Math.round(m.h), m.problems.length]);
      clean(`${W}px, the owner's feedback (memory k4, answered)`, m);
      ok(fullFb(m, k4.explain), `${W}px: the feedback in full${m.long ? " (in the side panel)" : m.onframe ? ", on the right card" : ""} — "…${(m.fb || m.whys.find((x) => x.right)?.text || "").slice(-40)}"`);
      await p.locator("#rp").locator(".decision [data-disagree]").click(); await p.keyboard.type("It should match by tag only"); await settled(p);
      m = await measure(p);
      clean(`${W}px, memory k4 with its note field in use`, m);
      if (!m.onframe) ok(m.field != null && m.field > 0.9, `${W}px: the note field in use has a row of its own (${Math.round((m.field || 0) * 100)}% of the band)`);
      await p.screenshot({ path: join(tmpdir(), `band-feedback-${W}.png`) }).catch(() => {});
    }
    await p.close();

    if (!every(W)) continue;
    // ---- the longest feedback (under the frame: an older video)
    p = await open(LOOPW, size);
    const k3 = await p.evaluate(() => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === "k3"));
    if (await into(p, "k3")) {
      const wrong = k3.options.find((o) => o.id !== k3.answer).id;
      await p.evaluate((a) => document.querySelector("#rp").answerQuiz(a), wrong); await until(p, () => !!document.querySelector("#rp").quizzes.k3); await settled(p);
      let m = await measure(p); log.push([W, "loop k3 feedback", Math.round(m.h), m.problems.length]);
      clean(`${W}px, the longest feedback (revise-loop walkthrough k3, answered wrong, ${m.home})`, m);
      where(W, m, `${W}px, revise-loop walkthrough k3`);
      ok(fullFb(m, k3.explain), `${W}px: the feedback in full${m.long ? " (in the side panel)" : m.onframe ? ", on the right card" : ""}`);
      await p.locator("#rp").locator(".decision [data-disagree]").click(); await p.keyboard.type("Say how"); await settled(p);
      m = await measure(p);
      clean(`${W}px, revise-loop k3 with its note field in use`, m);
      await p.screenshot({ path: join(tmpdir(), `band-longfb-${W}.png`) }).catch(() => {});
    }
    await p.close();

    // ---- the longest call, and stop beats of 2 and 8 calls
    p = await open(AWALK, size, "__fixtures/awalk-stops.json");
    const map = await p.evaluate(() => document.querySelector("#rp").planMap);
    // a5 is in the 8-call beat here; the longest single call left is a19, as long (451 characters)
    const a19 = map.autonomy.find((a) => a.id === "a19");
    if (await into(p, "a19")) {
      const m = await measure(p); log.push([W, "call a19", Math.round(m.h), m.problems.length]);
      clean(`${W}px, the longest call (answer-on-the-video A19)`, m);
      ok(m.long ? true : m.q === a19.chose, `${W}px: what the agent chose, in full${m.long ? " (in the side panel)" : ""}`);
    }
    for (const g of map.autonomyGroups) {
      await p.evaluate(() => { const el = document.querySelector("#rp"); if (el._pendingDecision) el.closeCard(); el.player.pause(); });
      if (!(await into(p, g.id))) continue;
      const m = await measure(p); log.push([W, `stop beat of ${g.ids.length}`, Math.round(m.h), m.problems.length]);
      clean(`${W}px, a stop beat of ${g.ids.length} calls`, m);
      ok(m.rows.map((r) => r.id).join() === g.ids.join() && m.rows.every((r) => r.acts.some((a) => /^Accept/.test(a)) && r.acts.some((a) => /^Flag/.test(a))), `${W}px: each of the ${g.ids.length} calls is listed with its own Accept and Flag — ${JSON.stringify(m.rows.map((r) => [r.id, r.acts]))}`);
      ok(m.long || m.rows.every((r, i) => r.shown && r.text.includes(g.calls[i].chose)), `${W}px: each call's words in full${m.long ? " (in the side panel)" : ""}`);
      await p.screenshot({ path: join(tmpdir(), `band-stop${g.ids.length}-${W}.png`) }).catch(() => {});
    }
    await p.close();

    // ---- past the cap: the long words move to the side panel, and the band says so
    p = await open(MEMW, size, "__fixtures/memw-long.json");
    const kl = await p.evaluate(() => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === "k4"));
    if (await into(p, "k4")) {
      await p.evaluate((a) => document.querySelector("#rp").answerQuiz(a), kl.answer); await until(p, () => !!document.querySelector("#rp").quizzes.k4); await settled(p);
      const m = await measure(p); log.push([W, "past the cap", Math.round(m.h), m.problems.length]);
      clean(`${W}px, an explanation past the cap`, m);
      if (m.onframe) ok(m.long && /Read why in full$/.test(m.blong || "") && m.whys.some((x) => x.right && /Your answer · right/.test(x.text) && !x.text.includes(kl.explain.slice(0, 40))), `${W}px: past the room, each card keeps its verdict and the why goes to the side panel — "${m.blong}"`);
      else ok(m.long && !m.fb && /^Right\. .*Read it in full$/.test(m.blong || ""), `${W}px: past the cap the band keeps the verdict and hands the explanation to the side panel — "${m.blong}"`);
      if (!(await p.locator("#rp").locator('.decision [data-act="band-read"]').count())) { ok(false, `${W}px: a "Read it in full" button in the band`); await p.close(); continue; }
      await p.locator("#rp").locator('.decision [data-act="band-read"]').click(); await until(p, () => { const P = document.querySelector("#rp").shadowRoot.querySelector(".dpanel"); return !P.hidden && /^data:/.test(P.querySelector("iframe").getAttribute("src") || ""); });
      const panel = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, P = r.querySelector(".dpanel"); let t = ""; try { t = P.querySelector("iframe").contentDocument?.body?.textContent || ""; } catch {} return { open: !P.hidden, title: P.querySelector("h5").textContent, src: P.querySelector("iframe").getAttribute("src") || "" }; });
      const text = panel.src.startsWith("data:") ? decodeURIComponent(panel.src.slice(panel.src.indexOf(",") + 1)) : "";
      ok(panel.open && text.includes(kl.explain.slice(-60)) && text.includes(kl.question), `${W}px: "Read it in full" opens the side panel with the question and the whole explanation — "${panel.title}"`);
      await p.keyboard.press("Escape"); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".dpanel").hidden); await frames(p);
      ok(await p.evaluate(() => { const el = document.querySelector("#rp"); return el.shadowRoot.querySelector(".dpanel").hidden && el.pendingId() === "k4" && !el._folded; }), `${W}px: closing the panel brings the band back`);
      ok(await p.evaluate(() => !document.querySelector("#rp").detailsLog().length), `${W}px: reading the words in full is not logged as opening a detail`);
    }
    await p.close();

    // ---- the common short case: answered on the frame, its chips under the cards (the bar's reserved eighth is
    //      the band's rule; a video answered on its frames keeps none)
    if (W > 600) {
      p = await open(LOOP, size);
      if (await into(p, "q4")) {
        const m = await measure(p);
        log.push([W, "short q4", Math.round(m.h), m.problems.length]);
        clean(`${W}px, a short question (revise-loop q4)`, m);
        where(W, m, `${W}px, revise-loop q4`);
      }
      await p.close();
    }
  }
} catch (e) { fails.push("threw: " + String(e?.stack || e).slice(0, 400)); console.log(e); }
console.log("\nwidth · case · band height · problems\n" + log.map((l) => l.join(" · ")).join("\n"));
await b.close(); srv.close();
console.log(fails.length ? `\n✗ ${fails.length} failed:\n${fails.join("\n")}` : "\n✓ band: all passed");
process.exit(fails.length ? 1 : 0);
