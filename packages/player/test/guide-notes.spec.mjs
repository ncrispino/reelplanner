#!/usr/bin/env node
// Highlight anything in the guide and the video's note box pops up on it (packages/player/guide-review.js), on the
// review page bundle-player builds (the guide under the video, D-264) and on the guide's page opened on its own:
//  · a selection let go of (never while dragging) opens the box beside it, not over it: the mark box's look, keys and
//    words, the quote above; Suggest an edit (the plan's own words only) and Ask are in it, secondary;
//  · Enter keeps: the words stay highlighted where they are (nothing on the page moves), and the note is in the
//    review's list with the video's marks, labelled with its section and step; a click there goes to it in the guide;
//  · the same in code lines of a diff (a line's number too), a heading, a caption, and a diagram: SVG text selected,
//    a labelled shape clicked (a control, or anything a widget draws to be clicked, does its own thing);
//  · a highlight clicked opens its note again (edit it, or the bin deletes it), and the review page follows;
//  · Finish's annotations.json carries each with its quote and step, and `reel record` (and `reel-intake`) file them
//    in reviews/<id>.md under the step, pointing at the quote;
//  · on its own, the page keeps notes the same way and exports them as the review page does; a phone's selection opens
//    the box docked at the foot, clear of the selection and its menu, and above the small player's bar even with the
//    page short of the guide (Save's bottom at or above the bar's top); the keyboard: Shift let go of, and N.
// Runs on the plan guide's walkthrough, bundled into a scratch folder from a scratch repo with the history its guide reads
// (plan-guide-repo.mjs: the Built side's diffs); its assets/ are build output: it plays silent.
// RP_SHOTS=<dir> also saves screenshots there.
// usage: node packages/player/test/guide-notes.spec.mjs
import { chromium } from "playwright-core"; import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync } from "node:fs"; import { join } from "node:path"; import { tmpdir } from "node:os";
import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, loaded, frames } from "./wait.mjs";
import { planGuideRepo } from "./plan-guide-repo.mjs";

const VIDEO = ".reelplanning/plans/2026-09-28-plan-guide/walkthrough-video", SLUG = "2026-09-28-plan-guide--walkthrough", PLAN = ".reelplanning/plans/2026-09-28-plan-guide";
const T = mkdtempSync(join(tmpdir(), "rp-guide-notes-")), OUT = join(T, "review");
const REPO = planGuideRepo(join(T, "repo"));
execFileSync(process.execPath, [join(ROOT, "scripts/bundle-player.mjs"), OUT, join(REPO, VIDEO)], { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
const port = testPort(8897);
const srv = staticServer(port, { dir: OUT });
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
let ok = true; const check = (n, c, x = "") => { console.log(`${c ? "✓" : "✗"} ${n}${x && !c ? " — " + x : ""}`); if (!c) ok = false; };
const SHOTS = process.env.RP_SHOTS || null; if (SHOTS) mkdirSync(SHOTS, { recursive: true });
// (a box on the page is shot once its short fade-in is over)
const shot = async (p, name, opts = {}) => { if (!SHOTS) return; for (const f of p.frames()) await f.waitForFunction(() => !document.querySelector(".rpn-box")?.getAnimations().length, null, { timeout: 5000, polling: 50 }).catch(() => null); await p.screenshot({ path: join(SHOTS, name), ...opts }); };
const URL0 = `http://127.0.0.1:${port}/?project=${SLUG}`;
// a wait in the guide's frame, as `until` is on the page
const fUntil = (f, fn, a, timeout = 20000) => f.waitForFunction(fn, a, { timeout, polling: 50 }).catch(() => null);
const guideFrame = (p) => p.frames().find((f) => /\/guide\/index\.html\?/.test(f.url()) && new URL(f.url()).searchParams.get("embed") === "1");
const boxOpen = (f) => fUntil(f, () => { const x = document.querySelector(".rpn-box"); return x && !x.hidden; });
const boxShut = (f) => fUntil(f, () => document.querySelector(".rpn-box").hidden);
// where a run of characters of an element's text is, in the frame's window: [start of the first, end of the last]
const spot = (f, sel, from, to, pick = 0) => f.evaluate(([sel, from, to, pick]) => {
  const long = (el) => { const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (tw.nextNode()) if (tw.currentNode.nodeValue.length >= to && tw.currentNode.nodeValue.slice(from, to).trim()) return tw.currentNode; return null; };
  const el = [...document.querySelectorAll(sel)].filter((x) => x.getClientRects().length && long(x))[pick]; if (!el) return null;
  const t = long(el);
  const at = (i) => { const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 1); return r.getClientRects()[0] || r.getBoundingClientRect(); };
  const a = at(from), z = at(to - 1);
  return { x0: a.left + 1, y0: a.top + a.height / 2, x1: z.right - 1, y1: z.top + z.height / 2, text: t.nodeValue.slice(from, to).replace(/\s+/g, " ").trim() };
}, [sel, from, to, pick]);
const center = (f, sel) => f.evaluate((sel) => { const el = document.querySelector(sel); el.scrollIntoView({ block: "center" }); }, sel);
const settle = (f) => fUntil(f, () => { const w = (window.__rest ||= { y: null, n: 0 }); if (scrollY !== w.y) { w.y = scrollY; w.n = 0; return false; } return ++w.n >= 4; }).then(() => f.evaluate(() => { delete window.__rest; }));
// a mouse drag, in the page's window (the frame's offset added): stopped half way to look, then let go
async function drag(p, off, s, { mid = null } = {}) {
  await p.mouse.move(off.x + s.x0, off.y + s.y0); await p.mouse.down();
  await p.mouse.move(off.x + (s.x0 + s.x1) / 2, off.y + (s.y0 + s.y1) / 2, { steps: 6 });
  if (mid) await mid();
  await p.mouse.move(off.x + s.x1, off.y + s.y1, { steps: 6 }); await p.mouse.up();
}
const frameOff = (p) => p.evaluate(() => { const r = document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect(); return { x: r.left, y: r.top }; });
// the box as it is: its words, its keys, where it is against what it is on
const boxState = (f) => f.evaluate(() => {
  const x = document.querySelector(".rpn-box"), br = x.getBoundingClientRect(), ta = x.querySelector("textarea");
  const now = CSS.highlights.get("rpn-now"), rs = now ? [...now].flatMap((r) => [...r.getClientRects()]) : [];
  const over = rs.some((r) => r.width && !(r.right <= br.left || r.left >= br.right || r.bottom <= br.top || r.top >= br.bottom));
  return { open: !x.hidden, quote: x.querySelector(".q").textContent, k: x.querySelector(".k").textContent, ph: ta.placeholder, focused: document.activeElement === ta, over, pend: rs.length,
    edit: !x.querySelector('[data-a="edit"]').hidden, ask: !x.querySelector('[data-a="ask"]').hidden, trash: !x.querySelector('[data-a="trash"]').hidden, dock: x.classList.contains("dock"), pos: getComputedStyle(x).position,
    rect: { t: Math.round(br.top), b: Math.round(br.bottom), l: Math.round(br.left), r: Math.round(br.right) }, H: innerHeight, W: innerWidth,
    // where it sits against the words it is on (their lines), its caret, and its faces: sans throughout
    lines: (() => { const ls = rs.filter((r) => r.width).sort((a, b) => a.top - b.top); return ls.length ? { firstTop: Math.round(ls[0].top), lastBottom: Math.round(ls.at(-1).bottom), lastL: Math.round(Math.min(...ls.filter((r) => Math.abs(r.bottom - ls.at(-1).bottom) < 4).map((r) => r.left))), lastR: Math.round(Math.max(...ls.filter((r) => Math.abs(r.bottom - ls.at(-1).bottom) < 4).map((r) => r.right))) } : null; })(),
    caret: (() => { const c = getComputedStyle(x, "::before"); return { shown: c.display !== "none" && c.content !== "none", x: Math.round(br.left + parseFloat(getComputedStyle(x).getPropertyValue("--rpn-caret") || "0")), above: x.classList.contains("above") }; })(),
    mono: [x, ...x.querySelectorAll("*")].some((e) => e.getClientRects().length && /mono|Menlo|Courier/i.test(getComputedStyle(e).fontFamily) && !e.closest("code")) ,
    // its parts (round 2's finding 4): × in a header row beside the quote, apart from the field; Ask and Save real
    // buttons side by side; the key chips (none on a touch screen)
    parts: (() => { const R = (e) => { const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right), h: Math.round(r.height) }; };
      const hd = x.querySelector(".hd"), xb = x.querySelector('[data-a="discard"]'), ask = x.querySelector('[data-a="ask"]'), save = x.querySelector('[data-a="save"]'), k = x.querySelector(".k");
      return { w: Math.round(br.width), xInHead: !!hd && hd.contains(xb), x: R(xb), q: R(x.querySelector(".q")), ta: R(ta), ask: ask && R(ask), save: save && R(save), askBtn: ask?.tagName === "BUTTON" && getComputedStyle(ask).borderTopStyle !== "none",
        saveBtn: save?.tagName === "BUTTON" && getComputedStyle(save).borderTopStyle !== "none", keys: getComputedStyle(k).display !== "none" && k.getClientRects().length > 0 }; })() };
});
const noteOf = (p, words) => p.evaluate((w) => document.querySelector("#rp").annotations.find((a) => a.comment === w) || null, words);
const markBox = (p) => p.evaluate(() => { const m = document.querySelector("#rp").shadowRoot.querySelector(".markbox"); return { k: m.querySelector(".k").textContent, ph: m.querySelector("textarea").placeholder }; });

let exported = null;
try {
  // ════ the review page: the guide under the video ════
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true }), p = await ctx.newPage(), errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("response", (r) => { if (r.status() >= 400 && !r.url().includes(`/${SLUG}/assets/`)) errs.push(`${r.status()} ${r.url().split("/").slice(-2).join("/")}`); });
  await p.goto(URL0); await loaded(p);
  await until(p, () => document.querySelector("#rp").hasAttribute("guide-under") && document.querySelector("#rp-guide").ready, null, 30000);
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="guide"]').click());
  await until(p, () => document.querySelector("#rp-guide")._scrollOn === true && !!document.querySelector("#rp")._mini);
  const gf = guideFrame(p);
  await fUntil(gf, () => !!window.RPGuideReview?.page && !!document.querySelector(".rpn-box"));
  const mb = await markBox(p);

  // ── prose: a selection let go of opens the box, beside it ──
  const SAY = "#now section.step p.say";
  await center(gf, SAY); await settle(gf);
  let off = await frameOff(p);
  const s1 = await spot(gf, SAY, 4, 44);
  const before = await gf.evaluate((sel) => ({ top: document.querySelector(sel).getBoundingClientRect().top, h: document.documentElement.scrollHeight }), SAY);
  let midState = null;
  await drag(p, off, s1, { mid: async () => { await frames(p, 3); midState = await boxState(gf); } });
  check("while the selection is being dragged, nothing pops up: no box, no highlight", midState && !midState.open && midState.pend === 0, JSON.stringify(midState));
  await boxOpen(gf);
  const b1 = await boxState(gf);
  check("let go of, the selection pops up the box, with its quote above the words", b1.open && b1.quote === `“${s1.text}”`, JSON.stringify({ quote: b1.quote, want: s1.text }));
  check("…the video's mark box: the same words and keys (\"Enter saves · Esc closes (kept) · × deletes\", \"Your note, a question, or a suggested edit…\"), straight into the words", b1.k === mb.k && b1.ph === mb.ph && b1.k === "Enter saves · Esc closes (kept) · × deletes" && b1.ph === "Your note, a question, or a suggested edit…" && b1.focused, JSON.stringify({ guide: [b1.k, b1.ph], video: mb, focused: b1.focused }));
  check("…beside the selection, never over it; what it is on shown highlighted while the box is open", !b1.over && b1.pend > 0 && b1.rect.t >= 0 && b1.rect.b <= b1.H, JSON.stringify(b1.rect));
  check("…under the selection's last line (8 px clear), its caret pointing at that line, and sans throughout (no mono hint)", !!b1.lines && (b1.caret.above ? b1.rect.b <= b1.lines.firstTop && b1.lines.firstTop - b1.rect.b <= 16 : b1.rect.t >= b1.lines.lastBottom && b1.rect.t - b1.lines.lastBottom <= 16) && b1.caret.shown && b1.caret.x >= b1.lines.lastL - 2 && b1.caret.x <= b1.lines.lastR + 2 && !b1.mono, JSON.stringify({ rect: b1.rect, lines: b1.lines, caret: b1.caret, mono: b1.mono }));
  check("…Ask in it, as a secondary action; Suggest an edit only on the plan's own words (not this sentence)", b1.ask && !b1.edit);
  const P1 = b1.parts;
  check("…420 px wide (the window less 32 px where that is less): the placeholder on one line", P1.w === Math.min(420, b1.W - 32) && P1.ta.h <= 40, JSON.stringify({ w: P1.w, W: b1.W, ta: P1.ta }));
  check("…× in a header row beside the quote, above the field (never beside the placeholder as if part of it)", P1.xInHead && P1.x.b <= P1.ta.t + 2 && P1.x.t < P1.q.b && P1.x.b > P1.q.t && P1.x.l >= P1.q.r, JSON.stringify({ x: P1.x, q: P1.q, ta: P1.ta }));
  check("…Ask a real button beside Save, under the field, and the key chips there too (a mouse)", P1.askBtn && P1.saveBtn && Math.abs(P1.ask.t - P1.save.t) <= 1 && P1.ask.r <= P1.save.l && P1.ask.t >= P1.ta.b && P1.ask.h >= 26 && P1.keys, JSON.stringify({ ask: P1.ask, save: P1.save, ta: P1.ta, keys: P1.keys }));
  await shot(p, "01-guide-box.png");
  const W1 = "Is this the first thing a reader needs?";
  await gf.locator(".rpn-box textarea").pressSequentially(W1, { delay: 5 }); await gf.locator(".rpn-box textarea").press("Enter");
  await boxShut(gf);
  await until(p, (w) => document.querySelector("#rp").annotations.some((a) => a.comment === w), W1);
  const n1 = await noteOf(p, W1);
  const after = await gf.evaluate((sel) => ({ top: document.querySelector(sel).getBoundingClientRect().top, h: document.documentElement.scrollHeight, hl: CSS.highlights.get("rpn-note")?.size || 0, text: [...(CSS.highlights.get("rpn-note") || [])].map((r) => r.toString()).join("") }), SAY);
  check("Enter keeps it: the words stay highlighted where they are, and nothing on the page moves", after.hl >= 1 && after.text.includes(s1.text) && Math.abs(after.top - before.top) < 1 && after.h === before.h, JSON.stringify({ before, after }));
  check("…a note in the video's review, via the guide, with its quote, its section and its step", n1?.via === "guide" && n1.detail.text === s1.text && n1.detail.where === "What you can do now · step 1" && n1.plan.step === 1 && n1.detail.name === "step-1" && typeof n1.t === "number", JSON.stringify(n1?.detail));
  await shot(p, "02-guide-saved.png");
  const listed = await p.evaluate((id) => { const R = document.querySelector("#rp").shadowRoot, go = R.querySelector(`[data-guide-note="${id}"]`), row = go?.closest(".ann");
    return { where: go?.textContent, quote: row?.querySelector(".gq")?.textContent, k: row?.querySelector(".k")?.textContent, words: row?.querySelector("textarea")?.value }; }, n1?.id);
  check("the review's list shows it next to the video's marks: where it is (section and step), the quote, the words", listed.where === "What you can do now · step 1" && listed.quote === `“${s1.text}”` && listed.words === W1 && listed.k === "guide", JSON.stringify(listed));

  // ── a diff's code lines, and a line's number ──
  await fUntil(gf, () => { const L = [...document.querySelectorAll("#what-changed .L")].find((l) => l.getClientRects().length && (l.querySelector(".c")?.textContent.trim().length || 0) > 16 && l.nextElementSibling?.matches(".L") && (l.nextElementSibling.querySelector(".c")?.textContent.trim().length || 0) > 16);
    if (L) { L.id ||= "rp-test-line"; return true; } const d = [...document.querySelectorAll("#what-changed details:not([open])")].find((x) => x.getClientRects().length); if (d) d.open = true; return false; }, null, 30000);
  await center(gf, "#rp-test-line"); await settle(gf); off = await frameOff(p);
  // (from the first line's start to a dozen characters into the next: all of it in view, nothing scrolled sideways)
  const lines = await gf.evaluate(() => { const L = document.getElementById("rp-test-line"), M = L.nextElementSibling; M.id ||= "rp-test-line2";
    const texts = (el) => { const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), ns = []; while (tw.nextNode()) ns.push(tw.currentNode); return ns; };
    const a = L.querySelector(".c"), z = M.querySelector(".c"), ta = texts(a).find((t) => t.nodeValue.trim()), tz = texts(z).find((t) => t.nodeValue.trim());
    const i0 = ta.nodeValue.search(/\S/), i1 = Math.min(tz.nodeValue.length, tz.nodeValue.search(/\S/) + 12) - 1;
    const rect = (t, i) => { const r = document.createRange(); r.setStart(t, i); r.setEnd(t, i + 1); return r.getClientRects()[0]; }, r0 = rect(ta, i0), r1 = rect(tz, i1);
    const before = texts(z); const upto = before.slice(0, before.indexOf(tz)).map((t) => t.nodeValue).join("") + tz.nodeValue.slice(0, i1 + 1);
    return { x0: r0.left + 1, y0: r0.top + r0.height / 2, x1: r1.right - 1, y1: r1.top + r1.height / 2, a: L.getAttribute("data-anchor"), z: M.getAttribute("data-anchor"), ta: a.textContent, tz: upto, tzAll: z.textContent }; });
  await drag(p, off, lines); await boxOpen(gf);
  const b2 = await boxState(gf);
  const cl = (t) => t.replace(/\s+/g, " ").trim();
  check("code lines in a diff: the selection pops up the box, beside them, its quote the code (not the line numbers)", b2.open && !b2.over && b2.quote === `“${cl(lines.ta)} ${cl(lines.tz)}”`, JSON.stringify({ quote: b2.quote, ta: lines.ta, tz: lines.tz }));
  await shot(p, "03-code-lines-box.png");
  const W2 = "Why two lines for this?";
  await gf.locator(".rpn-box textarea").pressSequentially(W2, { delay: 5 }); await gf.locator(".rpn-box textarea").press("Enter");
  await until(p, (w) => document.querySelector("#rp").annotations.some((a) => a.comment === w), W2);
  const n2 = await noteOf(p, W2), lineNo = (a) => /:(-?\d+)$/.exec(a)?.[1];
  const segs = await gf.evaluate(() => [...CSS.highlights.get("rpn-note")].map((r) => (r.startContainer.parentElement.closest(".n,.o") ? "number" : "code")));
  check("…kept: a note on the lines (path:first–last), its quote the code, highlighted on the code, not on the line numbers", n2?.via === "guide" && n2.detail.anchor === `${lines.a.replace(/:-?\d+$/, "")}:${lineNo(lines.a)}–${lineNo(lines.z)}` && n2.detail.text === `${cl(lines.ta)} ${cl(lines.tz)}` && !segs.includes("number") && /^Where the code is/.test(n2.detail.where), JSON.stringify({ d: n2?.detail, segs }));
  await shot(p, "04-code-lines-saved.png");
  // a line's number, clicked: the box on that line; Esc with nothing typed simply closes it, and keeps nothing
  const had = await p.evaluate(() => document.querySelector("#rp").annotations.length);
  await gf.locator("#rp-test-line2 .n").click(); await boxOpen(gf);
  const b3 = await boxState(gf);
  await gf.locator(".rpn-box textarea").press("Escape"); await boxShut(gf);
  await frames(p, 3);
  check("a diff line's number clicked opens the box on that line; Esc with nothing typed closes it, nothing kept", b3.open && b3.quote === `“${lines.tzAll.replace(/\s+/g, " ").trim()}”` && (await p.evaluate(() => document.querySelector("#rp").annotations.length)) === had, JSON.stringify({ quote: b3.quote, tz: lines.tz }));

  // ── a diagram (drawn here the way any guide draws one: SVG text, labelled shapes), a caption, a heading ──
  await gf.evaluate(() => { const fig = document.createElement("figure"); fig.id = "rp-test-diagram";
    fig.innerHTML = `<svg viewBox="0 0 560 120" width="560" height="120" aria-label="How a note travels" style="display:block;max-width:100%;color:var(--ink)">`
      + `<g aria-label="The guide page"><rect x="10" y="20" width="150" height="70" rx="6" fill="transparent" stroke="currentColor"/><text x="85" y="60" text-anchor="middle" font-size="15" fill="currentColor">guide page</text></g>`
      + `<path d="M165 55 H205" stroke="currentColor"/><g><rect x="210" y="20" width="160" height="70" rx="6" fill="transparent" stroke="currentColor"/><text x="290" y="60" text-anchor="middle" font-size="15" fill="currentColor">review record</text></g>`
      + `<g role="button" aria-label="Replay" tabindex="0" onclick="this.dataset.pressed='1'"><circle cx="420" cy="55" r="22" fill="currentColor"/></g>`
      + `<g aria-label="A widget's handle" style="cursor:pointer" onclick="this.dataset.pressed='1'"><rect x="480" y="35" width="40" height="40" fill="currentColor"/></g></svg>`
      + `<figcaption>A note, from the guide to the review.</figcaption>`;
    document.querySelector("#now section.step").appendChild(fig); });
  await center(gf, "#rp-test-diagram"); await settle(gf); off = await frameOff(p);
  const sv = await spot(gf, "#rp-test-diagram text", 0, 6, 1);
  await drag(p, off, sv); await boxOpen(gf);
  const b4 = await boxState(gf);
  check("a diagram's label (SVG text) selected: the box pops up on it", b4.open && b4.quote === "“review”" && !b4.over, JSON.stringify({ quote: b4.quote, over: b4.over }));
  const W3 = "The record, or the review file?";
  await gf.locator(".rpn-box textarea").pressSequentially(W3, { delay: 5 }); await gf.locator('.rpn-box [data-a="save"]').click();   // Save, the button, as Enter
  await until(p, (w) => document.querySelector("#rp").annotations.some((a) => a.comment === w), W3);
  check("Save keeps the words as Enter does, and closes the box", !!(await noteOf(p, W3)) && (await gf.evaluate(() => document.querySelector(".rpn-box").hidden)));
  const n3 = await noteOf(p, W3);
  const svgHl = await gf.evaluate(() => [...CSS.highlights.get("rpn-note")].some((r) => r.startContainer.parentElement?.closest("svg") && r.toString() === "review"));
  check("…kept: the SVG text highlighted, the note with its quote, its step, and the diagram it is in", svgHl && n3?.detail.text === "review" && n3.plan.step === 1 && n3.detail.anchor === "diagram · How a note travels", JSON.stringify(n3?.detail));
  // a labelled shape clicked: the box on it, its label the quote; kept, the shape outlined
  const g = await gf.evaluate(() => { const r = document.querySelector('#rp-test-diagram g[aria-label="The guide page"] rect').getBoundingClientRect(); return { x: r.left + 6, y: r.top + 6 }; });
  await p.mouse.click(off.x + g.x, off.y + g.y); await boxOpen(gf);
  const b5 = await boxState(gf);
  check("a labelled shape in a diagram, clicked: the box on it, its label the quote", b5.open && b5.quote === "“The guide page”", b5.quote);
  const W4 = "Say what the page is";
  await gf.locator(".rpn-box textarea").pressSequentially(W4, { delay: 5 }); await gf.locator(".rpn-box textarea").press("Enter");
  await until(p, (w) => document.querySelector("#rp").annotations.some((a) => a.comment === w), W4);
  const n4 = await noteOf(p, W4), outlined = await gf.evaluate(() => document.querySelector('#rp-test-diagram g[aria-label="The guide page"]').hasAttribute("data-rpn-noted"));
  check("…kept: the shape outlined, the note on it (a diagram, by its label)", outlined && n4?.detail.text === "The guide page" && n4.hl?.label === "The guide page", JSON.stringify(n4?.detail));
  // a control in it, and what a widget draws to be clicked: they do their own thing
  for (const sel of ['g[role="button"] circle', 'g[style*="cursor"] rect']) {
    const c = await gf.evaluate((sel) => { const r = document.querySelector(`#rp-test-diagram ${sel}`).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    await p.mouse.click(off.x + c.x, off.y + c.y); await frames(p, 3);
  }
  const ctl = await gf.evaluate(() => ({ open: !document.querySelector(".rpn-box").hidden, pressed: [...document.querySelectorAll("#rp-test-diagram [onclick]")].map((x) => x.dataset.pressed === "1") }));
  check("…a control, or a widget's own clickable thing, does what it does: no box", !ctl.open && ctl.pressed.every(Boolean), JSON.stringify(ctl));
  await shot(p, "05-diagram.png");
  // a caption, and a heading: the box pops up on them too (× discards)
  for (const [sel, name] of [["#rp-test-diagram figcaption", "caption"], ["#now > h2", "heading"]]) {
    await center(gf, sel); await settle(gf); off = await frameOff(p);
    const s = await spot(gf, sel, 2, 12); await drag(p, off, s); await boxOpen(gf);
    const bx = await boxState(gf);
    check(`a ${name} selected: the box pops up on it`, bx.open && bx.quote === `“${s.text}”`, JSON.stringify({ quote: bx.quote, want: s.text }));
    await gf.locator('.rpn-box [data-a="discard"]').click(); await boxShut(gf);
  }

  // ── the plan's own words: Suggest an edit, in the box ──
  await gf.evaluate(() => window.RPGuide.openAt("step-1-text"));
  // (openAt scrolls to the part on its next frame, smoothly: let that scroll start and end before the words are centred
  // and measured; on a loaded machine its frame came after settle, and the page moved under the drag)
  await gf.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); await settle(gf);
  await fUntil(gf, () => [...document.querySelectorAll("#step-1-text p[data-editable]")].some((x) => x.getClientRects().length && x.textContent.length > 40));
  await center(gf, "#step-1-text p[data-editable]"); await settle(gf); off = await frameOff(p);
  const se = await spot(gf, "#step-1-text p[data-editable]", 0, 18);
  await drag(p, off, se); await boxOpen(gf);
  const b6 = await boxState(gf);
  check("the plan's own words selected: Suggest an edit is there too, a secondary action in the same box", b6.open && b6.edit && b6.ask);
  await gf.locator('.rpn-box [data-a="edit"]').click();
  const pre = await gf.evaluate(() => document.querySelector(".rpn-box textarea").value);
  await gf.locator(".rpn-box textarea").fill(`${se.text} (reworded)`); await gf.locator(".rpn-box textarea").press("Enter");
  await until(p, (w) => document.querySelector("#rp").annotations.some((a) => a.edit?.after === w), `${se.text} (reworded)`);
  const n5 = await p.evaluate(() => document.querySelector("#rp").annotations.find((a) => a.edit));
  check("…it keeps what the words say and what you would have them say", pre === se.text && n5.edit.before === se.text && n5.plan.step === 1 && /^Suggested edit:/.test(n5.comment), JSON.stringify({ pre, edit: n5?.edit }));

  // ── Ask, in the box: a question in the review's questions, answered in the box ──
  await center(gf, SAY); await settle(gf); off = await frameOff(p);
  const sa = await spot(gf, SAY, 48, 70);
  await drag(p, off, sa); await boxOpen(gf);
  await gf.locator(".rpn-box textarea").pressSequentially("What does self-contained mean here?", { delay: 5 });
  await gf.locator('.rpn-box [data-a="ask"]').click();
  await fUntil(gf, () => !document.querySelector(".rpn-box .ans").hidden && !/Thinking/.test(document.querySelector(".rpn-box .ans").textContent));
  await until(p, () => (document.querySelector("#rp").questions || []).some((q) => q.question === "What does self-contained mean here?"));
  const qd = await p.evaluate(() => document.querySelector("#rp").questions.find((q) => q.question === "What does self-contained mean here?"));
  check("Ask, from the box: the question joins the review's, about the words, answered (or kept for the review) in the box", qd?.via === "guide" && !!qd.quote && qd.planStep === 1, JSON.stringify(qd));
  await gf.locator('.rpn-box [data-a="discard"]').click(); await boxShut(gf);

  // ── a highlight clicked: its note again; edited, the review follows; the bin deletes it ──
  await center(gf, SAY); await settle(gf); off = await frameOff(p);
  const hp = await gf.evaluate((id) => { const r = window.RPGuideReview.page.live.get(id).range.getClientRects()[0]; return { x: r.left + Math.min(20, r.width / 2), y: r.top + r.height / 2 }; }, n1.id);
  await p.mouse.click(off.x + hp.x, off.y + hp.y); await boxOpen(gf);
  const b7 = await boxState(gf);
  check("a highlight clicked opens its note: its words, the bin to delete it", b7.open && b7.trash && (await gf.evaluate(() => document.querySelector(".rpn-box textarea").value)) === W1 && b7.k === "Enter saves · Esc closes (kept) · × drops the edit", JSON.stringify(b7));
  const W1b = `${W1} Say it first.`;
  await gf.locator(".rpn-box textarea").fill(W1b); await gf.locator(".rpn-box textarea").press("Escape");
  await until(p, ([id, w]) => document.querySelector("#rp").annotations.find((a) => a.id === id)?.comment === w, [n1.id, W1b]);
  check("…edited, and Esc keeps the edit: the review page's note follows", (await p.evaluate((id) => document.querySelector("#rp").annotations.find((a) => a.id === id)?.comment, n1.id)) === W1b);
  // one to delete: the heading's (kept first)
  await center(gf, "#now > h2"); await settle(gf); off = await frameOff(p);
  const sh = await spot(gf, "#now > h2", 0, 8); await drag(p, off, sh); await boxOpen(gf);
  await gf.locator(".rpn-box textarea").pressSequentially("Gone soon", { delay: 5 }); await gf.locator(".rpn-box textarea").press("Enter");
  await until(p, () => document.querySelector("#rp").annotations.some((a) => a.comment === "Gone soon"));
  const gid = (await noteOf(p, "Gone soon")).id;
  const gp = await gf.evaluate((id) => { const r = window.RPGuideReview.page.live.get(id).range.getClientRects()[0]; return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, gid);
  await p.mouse.click(off.x + gp.x, off.y + gp.y); await boxOpen(gf);
  await gf.locator('.rpn-box [data-a="trash"]').click(); await boxShut(gf);
  await until(p, (id) => !document.querySelector("#rp").annotations.some((a) => a.id === id), gid);
  check("…the bin deletes it: gone from the page's highlights and from the review", !(await gf.evaluate((id) => window.RPGuideReview.page.live.has(id), gid)) && !(await p.evaluate((id) => document.querySelector("#rp").annotations.some((a) => a.id === id), gid)));
  // and deleted on the review page's list: the highlight goes too
  await p.evaluate((id) => document.querySelector("#rp").shadowRoot.querySelector(`[data-del="${id}"]`).click(), n2.id);
  await fUntil(gf, (id) => !window.RPGuideReview.page.live.has(id), n2.id);
  check("a note removed from the review's list leaves the guide's highlights too", !(await gf.evaluate((id) => window.RPGuideReview.page.live.has(id), n2.id)));

  // ── the keyboard: a selection with Shift let go of, and N ──
  await gf.evaluate((sel) => { const el = document.querySelector(sel), tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t = null; while (tw.nextNode()) if (tw.currentNode.nodeValue.length > 80) { t = tw.currentNode; break; } const r = document.createRange(); r.setStart(t, 70); r.setEnd(t, 80); getSelection().removeAllRanges(); getSelection().addRange(r); }, SAY);
  await p.keyboard.down("Shift"); await p.keyboard.up("Shift"); await boxOpen(gf);
  const k1 = await boxState(gf);
  check("the keyboard: a selection made with Shift, let go of, pops up the box, the words focused", k1.open && k1.focused);
  await gf.locator(".rpn-box textarea").press("Escape"); await boxShut(gf);
  await gf.evaluate(() => { getSelection().removeAllRanges(); document.activeElement?.blur?.(); document.querySelector("#try").scrollIntoView({ block: "start" }); }); await settle(gf);
  await gf.locator("body").press("n"); await boxOpen(gf);
  const k2 = await boxState(gf);
  await gf.locator(".rpn-box textarea").pressSequentially("Read this later", { delay: 5 }); await gf.locator(".rpn-box textarea").press("Enter");
  await until(p, () => document.querySelector("#rp").annotations.some((a) => a.comment === "Read this later"));
  const nk = await noteOf(p, "Read this later");
  check("…and N: the box on what you are reading, kept with its place", k2.open && k2.focused && !!nk?.detail.text && !!nk.detail.section && nk.detail.where.startsWith(nk.detail.section), JSON.stringify(nk?.detail));

  // ── the review's list: a click goes to the note in the guide ──
  await gf.evaluate(() => scrollTo(0, 0));
  await p.evaluate(() => document.querySelector("#rp").backToVideo()); await until(p, () => scrollY === 0 && !document.querySelector("#rp")._mini);
  await p.evaluate(() => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.openPull(); });
  await until(p, (id) => { const R = document.querySelector("#rp").shadowRoot, b = R.querySelector(`[data-guide-note="${id}"]`); if (!R.querySelector(".wrap").classList.contains("pulled") || !b) return false; b.scrollIntoView({ block: "center" }); return true; }, n1.id);
  await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".stage").getAnimations().length);
  if (SHOTS) await p.locator("#rp").locator(".side .list").screenshot({ path: join(SHOTS, "06-review-list.png") });
  await p.evaluate((id) => document.querySelector("#rp").shadowRoot.querySelector(`[data-guide-note="${id}"]`).click(), n3.id);
  await until(p, () => document.querySelector("#rp-guide").atGuide(), null, 20000);
  await fUntil(gf, (id) => { const v = window.RPGuideReview.page.live.get(id), lit = CSS.highlights.get("rpn-lit"); if (!v || !lit?.size) return false; const r = v.range.getBoundingClientRect(), w = (window.__rest ||= { t: null, n: 0 }); if (Math.round(r.top) !== w.t) { w.t = Math.round(r.top); w.n = 0; return false; } return ++w.n >= 4 && r.top > 0 && r.top < innerHeight * 0.8; }, n3.id);
  const went = await gf.evaluate((id) => { delete window.__rest; const r = window.RPGuideReview.page.live.get(id).range.getBoundingClientRect(); return { top: Math.round(r.top), H: innerHeight, lit: CSS.highlights.get("rpn-lit")?.size || 0 }; }, n3.id);
  check("clicking a note in the review's list goes to it in the guide, and lights it", went.lit > 0 && went.top > 0 && went.top < went.H * 0.8, JSON.stringify(went));
  await shot(p, "07-went-to-note.png");

  // ── Finish: the notes go with the review, each with its quote and step ──
  await p.evaluate(() => document.querySelector("#rp").backToVideo()); await until(p, () => scrollY === 0 && !document.querySelector("#rp")._mini);
  await p.locator("#rp").locator('[data-act="finish"]').click();
  await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden && !!document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="download"]'));
  const [dl] = await Promise.all([p.waitForEvent("download"), p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="download"]').click())]);
  exported = JSON.parse(readFileSync(await dl.path(), "utf8"));
  const eg = exported.annotations.filter((a) => a.via === "guide");
  check("Finish's annotations.json carries the guide's notes with the video's, each with its quote, where and step", eg.some((a) => a.id === n1.id && a.comment === W1b && a.detail.text === s1.text && a.plan.step === 1 && a.detail.where === "What you can do now · step 1") && eg.some((a) => a.id === n3.id && a.detail.text === "review") && eg.some((a) => a.id === n4.id) && !eg.some((a) => a.id === n2.id || a.id === gid), JSON.stringify(eg.map((a) => [a.comment, a.detail.where, a.plan.step])));
  const text = await p.evaluate(() => document.querySelector("#rp").reviewText());
  check("…and the review as text says each: in the guide, where, on the quote", text.includes(`**In the guide**, What you can do now · step 1, on “${s1.text}” — ${W1b}`), text.split("\n").filter((l) => /guide/i.test(l)).join(" | "));
  check("no page errors, and nothing missing but the video's build output", !errs.length, errs.slice(0, 3).join(" | "));
  await ctx.close();

  // ════ a phone: a long-press selection, the box docked at the foot, clear of it and of its menu ════
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }), p = await ctx.newPage(), errs = [];
    p.on("pageerror", (e) => errs.push(String(e)));
    await p.goto(URL0); await loaded(p);
    await until(p, () => document.querySelector("#rp").hasAttribute("guide-under") && document.querySelector("#rp-guide").ready, null, 30000);
    await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="guide"]').click());
    await until(p, () => document.querySelector("#rp-guide")._scrollOn === true && !!document.querySelector("#rp")._mini);
    const gf = guideFrame(p); await fUntil(gf, () => !!window.RPGuideReview?.page);
    await gf.evaluate((sel) => { const el = document.querySelector(sel); el.scrollIntoView({ block: "start" }); scrollBy(0, -80); }, SAY); await settle(gf);
    // (a long-press selects a word, and its handles widen it: the selection as the phone makes it)
    await gf.evaluate((sel) => { const el = document.querySelector(sel), tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t = null; while (tw.nextNode()) if (tw.currentNode.nodeValue.length > 40) { t = tw.currentNode; break; } const r = document.createRange(); r.setStart(t, 2); r.setEnd(t, 30); getSelection().removeAllRanges(); getSelection().addRange(r); }, SAY);
    await boxOpen(gf); await fUntil(gf, () => !document.querySelector(".rpn-box").getAnimations().length);
    const bp = await boxState(gf), inset = await gf.evaluate(() => { const cs = getComputedStyle(document.documentElement), d = cs.getPropertyValue("--rp-embed-dock"); return parseFloat(d.trim() ? d : cs.getPropertyValue("--rp-embed-bottom")) || 0; });
    const sel = await gf.evaluate(() => { const s = getSelection(); return s.rangeCount ? [...s.getRangeAt(0).getClientRects()].map((r) => ({ t: r.top, b: r.bottom })) : []; });
    const miniTop = await p.evaluate(() => Math.round(document.querySelector("#rp").shadowRoot.querySelector(".minibar").getBoundingClientRect().top)), fo = await frameOff(p);
    check("a phone: the selection pops up the box docked at the foot of the window, 8 px above the small player's room, which never covers it", bp.open && bp.dock && bp.pos === "fixed" && Math.abs(bp.rect.b - (bp.H - inset - 8)) <= 1 && bp.rect.b + fo.y <= miniTop - 8 && bp.rect.l >= 8 && bp.rect.r <= bp.W - 8, JSON.stringify({ ...bp.rect, H: bp.H, inset, frameY: fo.y, miniTop }));
    check("…on a touch screen, no key chips: × in the header, Ask and Save buttons big enough to tap (40 px)", !bp.parts.keys && bp.parts.xInHead && bp.parts.ask.h >= 40 && bp.parts.save.h >= 40 && Math.abs(bp.parts.ask.t - bp.parts.save.t) <= 1, JSON.stringify(bp.parts));
    check("…clear of the selection (and of the menu the phone draws by it), which it keeps until you tap into the box", !bp.over && !bp.focused && sel.length > 0 && sel.every((r) => r.b <= bp.rect.t - 8), JSON.stringify({ sel, box: bp.rect, focused: bp.focused }));
    await shot(p, "08-phone.png");
    await gf.locator(".rpn-box textarea").tap();
    await gf.locator(".rpn-box textarea").pressSequentially("On a phone", { delay: 5 }); await gf.locator(".rpn-box textarea").press("Enter");
    await until(p, () => document.querySelector("#rp").annotations.some((a) => a.comment === "On a phone"));
    check("…tapped into and kept: a note in the review, highlighted", (await gf.evaluate(() => CSS.highlights.get("rpn-note")?.size || 0)) >= 1);
    // the page not yet all the way down to the guide (its frame's top 40 px down the window, so its foot is under the
    // small player's bar): the box still docks above the bar, measured where the bar is (round 3's finding 2)
    await p.evaluate(() => scrollTo(0, scrollY - 40));
    await until(p, () => { const g = document.querySelector("#rp-guide"), r = g.shadowRoot.querySelector("iframe").getBoundingClientRect(); return !!document.querySelector("#rp")._mini && r.top >= 39 && g._scrollOn === false; });
    await fUntil(gf, () => (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--rp-embed-dock")) || 0) >= 39);
    await gf.evaluate(() => { const ps = [...document.querySelectorAll("main p")].filter((x) => { const r = x.getBoundingClientRect(); return r.top > 60 && r.bottom < innerHeight * 0.5 && x.textContent.length > 40; }); const el = ps[0] || document.querySelector("main p"), tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t = null; while (tw.nextNode()) if (tw.currentNode.nodeValue.length > 30) { t = tw.currentNode; break; } const r = document.createRange(); r.setStart(t, 0); r.setEnd(t, 24); getSelection().removeAllRanges(); getSelection().addRange(r); });
    await boxOpen(gf); await fUntil(gf, () => !document.querySelector(".rpn-box").getAnimations().length);
    const low = await gf.evaluate(() => { const b = document.querySelector(".rpn-box"); return { dock: b.classList.contains("dock"), save: Math.round(b.querySelector(".bt.save").getBoundingClientRect().bottom), ask: Math.round(b.querySelector('[data-a="ask"]').getBoundingClientRect().bottom) }; });
    const fo2 = await frameOff(p), barTop = await p.evaluate(() => Math.round(document.querySelector("#rp").shadowRoot.querySelector(".minibar").getBoundingClientRect().top));
    check("a phone, the page short of the guide (the frame's foot under the small player's bar): Save's and Ask's bottoms are at or above the bar's top", low.dock && low.save + fo2.y <= barTop && low.ask + fo2.y <= barTop, JSON.stringify({ ...low, frameY: fo2.y, barTop }));
    await shot(p, "08b-phone-short.png");
    check("a phone: no page errors", !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // ════ the guide opened on its own: notes kept the same way, and exported as the review page does (dark) ════
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, colorScheme: "dark", acceptDownloads: true }), p = await ctx.newPage(), errs = [];
    p.on("pageerror", (e) => errs.push(String(e)));
    await p.goto(`http://127.0.0.1:${port}/${SLUG}/guide/index.html`);
    await until(p, () => !!window.RPGuideReview?.page && !!document.querySelector("[data-yours]"));
    await center(p.mainFrame(), SAY); await settle(p.mainFrame());
    const s = await spot(p.mainFrame(), SAY, 4, 44);
    await drag(p, { x: 0, y: 0 }, s); await boxOpen(p.mainFrame());
    await shot(p, "09-standalone-dark-box.png");
    await p.locator(".rpn-box textarea").pressSequentially("Kept on its own page", { delay: 5 }); await p.locator(".rpn-box textarea").press("Enter");
    await until(p, () => document.querySelector("[data-yours] .n").textContent === "1");
    const key = await p.evaluate(() => window.RPGuideReview.page.key);
    check("on its own: the note is kept under the review's own record for the video, the one the review page reads", key === `reelplanning@${JSON.parse(readFileSync(join(OUT, "library.json"), "utf8")).repo}:annotations:${SLUG}/index.html` && (await p.evaluate((k) => JSON.parse(localStorage.getItem(k)).length, key)) === 1, key);
    await p.locator("[data-yours]").click();
    await until(p, () => !document.querySelector(".rpn-list").hidden);
    const li = await p.evaluate(() => { const l = document.querySelector(".rpn-list"); return { go: l.querySelector("[data-go]")?.textContent, qt: l.querySelector(".qt")?.textContent, cmd: l.querySelector(".foot code")?.textContent }; });
    check("…Your notes lists it (where, the quote), with the export and its command", li.go === "What you can do now · step 1" && li.qt === `“${s.text}”` && /reel record \.reelplanning\/plans\/2026-09-28-plan-guide ~\/Downloads\/annotations\.json/.test(li.cmd || ""), JSON.stringify(li));
    await shot(p, "10-standalone-notes.png");
    const [dl] = await Promise.all([p.waitForEvent("download"), p.locator(".rpn-list [data-export]").click()]);
    const own = JSON.parse(readFileSync(await dl.path(), "utf8"));
    check("…exported as the review page exports: annotations.json, the note with its quote and step", dl.suggestedFilename() === "annotations.json" && own.version === 1 && own.src === `${SLUG}/index.html` && own.annotations[0]?.detail.text === s.text && own.annotations[0].plan.step === 1, JSON.stringify(own).slice(0, 300));
    // from the list, back to it: its place scrolled to and lit
    await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await p.locator(".rpn-list [data-go]").click();
    await until(p, () => (CSS.highlights.get("rpn-lit")?.size || 0) > 0);
    await settle(p.mainFrame());
    const at = await p.evaluate(() => { const v = [...window.RPGuideReview.page.live.values()][0]; const r = v.range.getBoundingClientRect(); return { top: r.top, H: innerHeight }; });
    check("…and a note in the list goes to its place on the page", at.top > 0 && at.top < at.H * 0.8, JSON.stringify(at));
    check("on its own: no page errors", !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // ════ reel record and reel-intake: each note in reviews/<id>.md under its step, pointing at the quote ════
  if (exported) {
    const tmp = mkdtempSync(join(tmpdir(), "rp-guide-notes-record-"));
    try {
      const reel = (...a) => execFileSync(process.execPath, [join(ROOT, "scripts/reel.mjs"), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      reel("init", tmp, "--name", "notes", "--kind", "greenfield");
      reel("new-plan", tmp, "plan-guide", "--plan", join(ROOT, PLAN, "plan.md"), "--date", "2026-01-01");
      const pd = join(tmp, ".reelplanning/plans/2026-01-01-plan-guide");
      copyFileSync(join(ROOT, PLAN, "walkthrough.md"), join(pd, "walkthrough.md"));
      writeFileSync(join(tmp, "annotations.json"), JSON.stringify(exported));
      reel("record", pd, join(tmp, "annotations.json"), "--kind", "plan");
      const md = readdirSync(join(pd, "reviews")).filter((f) => f.endsWith(".md")).map((f) => readFileSync(join(pd, "reviews", f), "utf8")).join("\n");
      const step1 = (md.split(/^- \*\*Step 1\*\*$/m)[1] || "").split(/^- \*\*/m)[0];
      check("reel record: under Step 1, the guide's note: where it is, its words, pointing at the quote", step1.includes(`comment in the guide (What you can do now · step 1, at \`${n1.detail.anchor}\`): "${W1b}" (pointing at "${s1.text}")`) && step1.includes(`"${W3}" (pointing at "review")`) && step1.includes(`"${W4}" (pointing at "The guide page")`), step1 || md.slice(0, 1200));
      // reel-intake: the same review, sent from the hosted page as a row
      writeFileSync(join(tmp, "row.json"), JSON.stringify({ planDir: ".reelplanning/plans/2026-01-01-plan-guide", project: "video", title: "The plan guide", submittedAt: "2026-01-02T10:00:00Z", review: { ...exported, exportedAt: "2026-01-02T10:00:00Z" } }));
      execFileSync(process.execPath, [join(ROOT, "scripts/reel-intake.mjs"), join(tmp, "row.json"), "--repo", tmp], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      const mds = readdirSync(join(pd, "reviews")).filter((f) => f.endsWith(".md"));
      const newest = mds.map((f) => readFileSync(join(pd, "reviews", f), "utf8")).find((t) => t !== md && t.includes(W1b)) || "";
      check("reel-intake: files it the same way (a second review, the note under Step 1 with its quote)", mds.length === 2 && /- \*\*Step 1\*\*\n(?:  - .*\n)*  - comment in the guide \(What you can do now · step 1/.test(newest) && newest.includes(`(pointing at "${s1.text}")`), mds.join(", "));
    } catch (e) { check("reel record and reel-intake ran", false, String(e.stderr || e.message).slice(0, 600)); }
    finally { rmSync(tmp, { recursive: true, force: true }); }
  }
} catch (e) { ok = false; console.error("✗", e.stack || e.message); }
await b.close(); srv.kill();
try { rmSync(T, { recursive: true, force: true }); } catch {}
process.exit(ok ? 0 : 1);
