#!/usr/bin/env node
// The record within reach, whatever the reviewer is doing (the owner, reviewing with the guide open: "i cant see the
// comments i left, go to them in the video easily, or toggle them", and the full scope of what they asked for after
// a rebuild). On the review page bundle-player builds, with the plan guide's own plan video and its guide under it:
//   · reading the guide (the small player in the corner), the record's bar stays at the window's foot, the small player
//     above it; pulled up, the record covers the guide and the small player, and lists every comment, the guide's too;
//   · a comment's time goes to it on the video (back in its place, paused there, the comment named on the frame); a
//     guide comment's place goes to it in the guide; on a laptop's 1440 × 900 and 1280 × 720;
//   · the feedback always listed: with the Finish panel open (its verdict and Send at the record's head), after it is
//     closed, with the guide open, after Send; the Record bar opens the record at it (a Finish panel left open folds to
//     one line above it); a comment's words edited in place (Enter keeps, Esc puts back) are the review's, the frame's
//     and, after a send, offered as "Send the change";
//   · Marks: on | off (the switch beside Clear, or V), remembered per viewer (rp:marks): the marks drawn on the frame
//     and the comments' strokes on the timeline, hidden and shown; a mark you work on is still drawn;
//   · after the video was rebuilt since the review was sent, "Your last review" in the record: every comment and
//     answer of the round sent, read-only, each going to where it now is (or saying it is not in this version).
// Its assets/ (the voice, fonts, screenshots) are build output, not committed: the video plays silent.
// usage: node packages/player/test/record-reach.spec.mjs
import { chromium } from "playwright-core"; import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs"; import { join } from "node:path"; import { tmpdir } from "node:os";
import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, loaded, frames, laidOut } from "./wait.mjs";

const VIDEO = ".reelplanner/plans/2026-09-28-plan-guide/video", SLUG = "2026-09-28-plan-guide";
const T = mkdtempSync(join(tmpdir(), "rp-record-reach-")), OUT = join(T, "review");
execFileSync(process.execPath, [join(ROOT, "scripts/bundle-player.mjs"), OUT, join(ROOT, VIDEO)], { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
const port = testPort(8899);
const srv = staticServer(port, { dir: OUT });
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
let ok = true; const check = (n, c, x = "") => { console.log(`${c ? "✓" : "✗"} ${n}${x ? " — " + x : ""}`); if (!c) ok = false; };
const URL0 = `http://127.0.0.1:${port}/?project=${SLUG}`;
const W1 = "First: the intro is long", W2 = "Second: why this order?", W3 = "Third: the risk list misses rollback", WB = "This box: wrong label", WG = "Guide: say what the reader gets first";

// a page on the review page, its saved review set by `seed` (in the page, before the player reads it), the guide ready
async function open(viewport, seed = null, arg = null, init = null) {
  const ctx = await b.newContext({ viewport }), p = await ctx.newPage(), errs = [];
  if (init) await p.addInitScript(init);
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(URL0); await loaded(p);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} });
  if (seed) await p.evaluate(seed, arg);
  await p.reload(); await loaded(p);
  await until(p, () => document.querySelector("#rp").hasAttribute("guide-under") && document.querySelector("#rp-guide").ready, null, 30000);
  return { p, ctx, errs };
}
// the review, as the reviewer left it: three comments, a box drawn on a frame, a note on the guide's words, an answer
const seedReview = ({ W1, W2, W3, WB, WG, round }) => {
  const el = document.querySelector("#rp"), K = el.rkey, F = el.planMap.frames;   // (the review's record, under the repo the page names)
  const at = (t) => { const f = F.find((x) => x.start <= t && t < x.start + x.durationSeconds); return { index: f.index, compositionId: f.compositionId, title: f.title }; };
  const n = (id, t, comment, more = {}) => ({ id, kind: "note", t, frame: at(t), plan: { step: null, questions: [], component: null }, comment, ...more });
  localStorage.setItem(K, JSON.stringify([n("c1", 12, W1), n("c2", 75, W2), n("c3", 160, W3),
    { id: "m1", kind: "box", t: 75.5, frame: at(75.5), plan: { step: 1, questions: [], component: null }, path: [[0.2, 0.2], [0.55, 0.5]], comment: WB },
    n("g1", 40, WG, { plan: { step: 1, questions: [], component: null }, detail: { name: "step-1", anchor: "#now", text: "What you can do now", where: "What you can do now · step 1", step: 1 }, via: "guide" }),
    ...(round ? [n("gone", 90, "On a scene that is gone", { frame: { index: 99, compositionId: "a-scene-no-longer-here", title: "Gone" } })] : [])]));
  const d = el.planMap.decisions[0], o = d.options[0];
  localStorage.setItem(K + ":decisions", JSON.stringify({ [d.id]: { option: o.id, label: o.label, planStep: d.planStep ?? null, question: d.question, t: d.at, note: "but keep plan.md short" } }));
  if (round) { localStorage.setItem(K + ":verdict", "changes"); localStorage.setItem(K + ":round", JSON.stringify({ sentAt: "2026-10-06T09:30:00.000Z", id: "r1", sig: "a build before this one" })); }
};
const R = (p, f, a) => p.evaluate(f, a);
const recordAt = (p) => R(p, () => { const el = document.querySelector("#rp"), S = el.shadowRoot, g = S.querySelector(".grab"), r = g.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const top = document.elementFromPoint(x, y), hit = top === el ? S.elementFromPoint(x, y) : top, bar = S.querySelector(".minibar"), mb = bar.hidden ? null : bar.getBoundingClientRect();
  return { mini: !!el._mini, pulled: S.querySelector(".wrap").classList.contains("pulled"), top: Math.round(r.top), bottom: Math.round(r.bottom), H: innerHeight, onTop: !!hit && g.contains(hit), expanded: g.getAttribute("aria-expanded"),
    mini_b: mb ? Math.round(mb.bottom) : null, rows: [...S.querySelectorAll(".marks .list .ann")].map((a) => a.querySelector("textarea")?.value || ""), guideRow: S.querySelector('.marks .list [data-guide-note="g1"]')?.textContent || null }; });
const clickGrab = async (p) => { const r = await R(p, () => { const q = document.querySelector("#rp").shadowRoot.querySelector(".grab").getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; }); await p.mouse.click(r.x, r.y); };
const pulledIs = (p, on) => until(p, (on) => { const S = document.querySelector("#rp").shadowRoot, s = S.querySelector(".side"); return S.querySelector(".wrap").classList.contains("pulled") === on && !s.getAnimations().length; }, on);
const toGuide = async (p) => { await R(p, () => document.querySelector("#rp").shadowRoot.querySelector('[data-act="guide"]').click()); await until(p, () => !!document.querySelector("#rp")._mini, null, 15000); await laidOut(p); };
// how much of the frame's overlay is drawn on (the drawn marks): the canvas's alpha, summed
const ink = (p) => R(p, () => { const el = document.querySelector("#rp"), c = el.canvas, d = el.ctx.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) n += d[i] > 0 ? 1 : 0; return n; });
// …once the frame's overlay has drawn them: the canvas is drawn as the video reports its time after the seek (and
// again when it is sized), which on a loaded machine comes a while after the seek itself
const inked = (p) => until(p, () => { const el = document.querySelector("#rp"), c = el.canvas, d = el.ctx.getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true; return false; }, null, 15000);

try {
  for (const vp of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }]) {
    const tag = `${vp.width} × ${vp.height}`;
    const { p, ctx, errs } = await open(vp, seedReview, { W1, W2, W3, WB, WG, round: false });
    // ---- the guide closed: the record's bar at the foot, every comment in it
    let s = await recordAt(p);
    check(`${tag}: the record's bar at the window's foot, every comment listed (the guide's too, where it is)`, s.onTop && s.bottom >= s.H - 1 && s.rows.length === 5 && [W1, W2, W3, WB, WG].every((w) => s.rows.includes(w)) && s.guideRow === "What you can do now · step 1", JSON.stringify(s));
    // ---- the guide open: the bar stays, the small player above it
    await toGuide(p);
    s = await recordAt(p);
    check(`${tag}: reading the guide, the record's bar stays at the foot, on top and clickable, the small player above it`, s.mini && !s.pulled && s.onTop && s.bottom >= s.H - 1 && s.top >= s.H - 41 && s.mini_b != null && s.mini_b <= s.top - 8, JSON.stringify(s));
    await clickGrab(p); await pulledIs(p, true);
    s = await recordAt(p);
    const cover = await R(p, () => { const el = document.querySelector("#rp"), S = el.shadowRoot, m = S.querySelector(".minibar").getBoundingClientRect(), x = m.left + m.width / 2, y = m.top + m.height / 2, top = document.elementFromPoint(x, y), hit = top === el ? S.elementFromPoint(x, y) : top; return !!hit && S.querySelector(".side").contains(hit); });
    check(`${tag}: …pulled up over the guide, it covers the small player and lists every comment; aria-expanded says so`, s.mini && s.pulled && cover && s.expanded === "true" && s.rows.length === 5, JSON.stringify({ cover, ...s }));
    // ---- a comment's time: to it on the video, the video back in its place
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector('.marks .list [data-ann-go="c3"]').click());
    // (and the page come to rest there: the small player ends as the frame's room comes into view, mid-way through the
    // smooth scroll back, the picture still growing to its place; a slow machine read it there, half out of the window)
    await until(p, () => { const el = document.querySelector("#rp"), st = el.shadowRoot.querySelector(".stage").getBoundingClientRect(), w = (window.__rpBack ||= { k: null, n: 0 }), k = `${scrollY} ${Math.round(st.top)} ${Math.round(st.bottom)}`;
      if (k !== w.k) { w.k = k; w.n = 0; return false; }
      return ++w.n >= 4 && !el._mini && !el.shadowRoot.querySelector(".wrap").classList.contains("pulled") && Math.abs(el.player.currentTime - 160) < 0.2 && el.player.paused; }, null, 15000);
    const went = await R(p, () => { const el = document.querySelector("#rp"), S = el.shadowRoot, c = S.querySelector(".partcard"), st = S.querySelector(".stage").getBoundingClientRect(); return { mini: !!el._mini, t: el.player.currentTime, paused: el.player.paused, inView: st.top >= -1 && st.bottom <= innerHeight + 1, card: c.classList.contains("on") ? c.textContent : null, status: S.querySelector(".status").textContent }; });
    check(`${tag}: a comment's time goes to it: the record down, the video back in its place, paused at it, the comment named on the frame`, !went.mini && Math.abs(went.t - 160) < 0.2 && went.paused && went.inView && (went.card || "").includes(W3), JSON.stringify(went));
    // ---- a guide comment's place: to it in the guide
    await clickGrab(p); await pulledIs(p, true);
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector('.marks .list [data-guide-note="g1"]').click());
    await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled") && document.querySelector("#rp-guide").atGuide(), null, 15000);
    await pulledIs(p, false);
    const gn = await R(p, () => ({ pulled: document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled"), at: document.querySelector("#rp-guide").atGuide() }));
    check(`${tag}: a guide comment's place goes to it in the guide, the record down out of its way`, !gn.pulled && gn.at, JSON.stringify(gn));
    check(`${tag}: no page errors`, !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // ---- the feedback, whatever else the record holds: Finish open, closed, the guide open, after Send
  // (the owner: "we could click the record part and see all the feedback we left and edit it directly, but that went
  // away … it would just open to approve or ask for comments, no way to see the feedback": the Finish panel took the
  // record over, its lists hidden, from 10f643f, and it stayed open after Send)
  const hosted = () => {   // the hosted page's store, as claude.use("db") gives it: Send writes a row there (a copy, as a store keeps it)
    const store = (window.__db = { docs: {} });
    const doc = (path) => ({ async set(data) { store.docs[path] = JSON.parse(JSON.stringify(data)); }, onSnapshot(next) { next({ data: () => store.docs[path] }); return () => {}; } });
    window.claude = { use: async (n) => (n === "db" ? { doc } : null) };
  };
  const feedback = (p) => R(p, () => { const el = document.querySelector("#rp"), S = el.shadowRoot, box = S.querySelector(".handoff"), g = S.querySelector(".grab").getBoundingClientRect();
    const shown = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).display !== "none" && getComputedStyle(e).visibility !== "hidden";
    const m = S.querySelector(".marks"), mr = m.getBoundingClientRect(), rows = [...S.querySelectorAll(".marks .list .ann")];
    return { pulled: S.querySelector(".wrap").classList.contains("pulled"), mini: !!el._mini, finish: !box.hidden, folded: box.classList.contains("folded"), expanded: box.querySelector(".hfold")?.getAttribute("aria-expanded") ?? null,
      sum: box.querySelector(".hsum")?.textContent || "", verdict: !!box.querySelector(".verdict") && shown(box.querySelector(".verdict")),
      listed: shown(m) && rows.length, inView: shown(m) && mr.top >= g.bottom - 1 && mr.top < innerHeight - 40,
      fields: rows.filter((a) => shown(a.querySelector("textarea[data-comment]"))).length, dels: rows.filter((a) => shown(a.querySelector("[data-del]"))).length,
      decs: shown(S.querySelector(".decs")), resend: !S.querySelector(".resend").hidden ? S.querySelector(".resend").textContent : null }; });
  const all = (f) => f.listed === 5 && f.fields === 5 && f.dels === 5 && f.decs;
  const act = (p, a) => R(p, (a) => document.querySelector("#rp").shadowRoot.querySelector(`[data-act="${a}"]`).click(), a);
  for (const vp of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }]) {
    const tag = `${vp.width} × ${vp.height}`;
    const { p, ctx, errs } = await open(vp, seedReview, { W1, W2, W3, WB, WG, round: false }, hosted);
    await R(p, () => document.querySelector("#rp")._claudeReady);
    // Finish review: the verdict and Send, opened out, and every comment and answer listed under them
    await act(p, "finish"); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden); await pulledIs(p, true);
    let f = await feedback(p);
    check(`${tag}: Finish review opens the Finish panel out (the verdict, Send) at the record's head, and every comment and answer stays listed under it`, f.pulled && f.finish && !f.folded && f.expanded === "true" && f.verdict && all(f), JSON.stringify(f));
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector('.marks [data-comment="c1"]').scrollIntoView({ block: "center" })); await frames(p);
    check(`${tag}: …the record scrolls to them`, (await R(p, () => { const r = document.querySelector("#rp").shadowRoot.querySelector('.marks [data-comment="c1"]').getBoundingClientRect(); return r.top > 0 && r.bottom < innerHeight; })));
    // closed: the lists, as before
    await act(p, "handoff-close"); await frames(p);
    f = await feedback(p);
    check(`${tag}: Back to the record closes it; the feedback is there`, f.pulled && !f.finish && all(f), JSON.stringify(f));
    // Finish again, the record put away, then the Record bar: the record opens at the feedback, the panel folded above it
    await act(p, "finish"); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden);
    await clickGrab(p); await pulledIs(p, false);
    await clickGrab(p); await pulledIs(p, true);
    f = await feedback(p);
    check(`${tag}: the Record bar, with the Finish panel left open, opens the record at the feedback: the panel folded to one line above it (its verdict, not sent yet)`, f.pulled && f.finish && f.folded && f.expanded === "false" && !f.verdict && /Request changes · not sent yet/.test(f.sum) && all(f) && f.inView, JSON.stringify(f));
    // reading the guide: the same
    await clickGrab(p); await pulledIs(p, false);
    await toGuide(p); await clickGrab(p); await pulledIs(p, true);
    f = await feedback(p);
    check(`${tag}: reading the guide, the Record bar opens the record at the feedback too`, f.mini && f.pulled && f.folded && all(f) && f.inView, JSON.stringify(f));
    // its title opens it out again: Send
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".handoff .hfold").click()); await frames(p);
    f = await feedback(p);
    check(`${tag}: the folded panel's title opens it out (the verdict and Send back), the feedback still listed`, f.finish && !f.folded && f.expanded === "true" && f.verdict && all(f), JSON.stringify(f));
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="send"]').click());
    await until(p, () => Object.keys(window.__db.docs).length === 1 && !!document.querySelector("#rp").shadowRoot.querySelector(".handoff .send.done"));
    f = await feedback(p);
    check(`${tag}: after Send, the panel says so, and the feedback stays listed under it`, f.finish && all(f) && !f.resend, JSON.stringify(f));
    await clickGrab(p); await pulledIs(p, false); await clickGrab(p); await pulledIs(p, true);
    f = await feedback(p);
    check(`${tag}: …and the Record bar opens at it, the panel folded ("sent")`, f.folded && /Request changes · sent$/.test(f.sum) && all(f) && f.inView, JSON.stringify(f));
    // a comment's words, edited where they are listed: Enter keeps it, and the change is offered as a send
    const E2 = "Second, reworded: why this order, and not the guide first?";
    const ta = p.locator("#rp").locator('.marks [data-comment="c2"]');
    await ta.click(); await ta.fill(E2); await ta.press("Enter"); await frames(p);
    const kept = await R(p, () => { const el = document.querySelector("#rp"), S = el.shadowRoot; return { now: el.annotations.find((a) => a.id === "c2").comment, stored: JSON.parse(localStorage.getItem(el.rkey)).find((a) => a.id === "c2").comment, focus: S.activeElement?.dataset?.comment || null, pulled: S.querySelector(".wrap").classList.contains("pulled") }; });
    f = await feedback(p);
    check(`${tag}: a comment's words edited in the record: Enter keeps them (in the review and in this browser), and the record says the review changed since it was sent`, kept.now === E2 && kept.stored === E2 && !kept.focus && kept.pulled && /Your review changed after it was sent/.test(f.resend || ""), JSON.stringify({ kept, resend: f.resend }));
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector('.resend [data-act="send"]').click());
    await until(p, () => Object.keys(window.__db.docs).length === 2);
    const rows = await R(p, () => Object.values(window.__db.docs).map((d) => d.review.annotations.find((a) => a.id === "c2").comment));
    check(`${tag}: …Send the change sends it as a new review, with the words as edited; then nothing is offered again`, rows.length === 2 && rows.includes(W2) && rows.includes(E2) && !(await feedback(p)).resend, JSON.stringify(rows));
    // Esc puts the words back, and the record stays up
    await ta.click(); await ta.fill("never mind this"); await ta.press("Escape"); await frames(p);
    const back = await R(p, () => { const el = document.querySelector("#rp"), S = el.shadowRoot; return { field: S.querySelector('.marks [data-comment="c2"]').value, now: el.annotations.find((a) => a.id === "c2").comment, pulled: S.querySelector(".wrap").classList.contains("pulled"), finish: !S.querySelector(".handoff").hidden }; });
    check(`${tag}: Esc in a comment puts its words back, and backs out of nothing else (the record and the panel stay)`, back.field === E2 && back.now === E2 && back.pulled && back.finish && !(await feedback(p)).resend, JSON.stringify(back));
    // the frame: the line naming a comment after a jump to it, and a mark's own words, are the edited ones
    // (in one go: the line on the frame goes by itself after a few seconds, which a loaded machine can outlast)
    const E3 = "Third, edited: the risk list misses rollback and retries";
    const card = await R(p, (w) => { const S = document.querySelector("#rp").shadowRoot, c = S.querySelector(".partcard");
      S.querySelector('.marks .list [data-ann-go="c3"]').click(); const was = c.classList.contains("on") ? c.textContent : null;
      const t = S.querySelector('.marks [data-comment="c3"]'); t.value = w; t.dispatchEvent(new Event("change"));
      return was && c.classList.contains("on") ? c.textContent : null; }, E3);
    await pulledIs(p, false);
    check(`${tag}: …the comment named on the frame shows its words as edited`, (card || "").includes(E3), JSON.stringify(card));
    const EB = "This box: the label should say retries";
    await clickGrab(p); await pulledIs(p, true);
    const tb = p.locator("#rp").locator('.marks [data-comment="m1"]'); await tb.click(); await tb.fill(EB); await tb.press("Enter");
    await R(p, () => document.querySelector("#rp").selectFromRecord("m1"));
    await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".markbox").hidden, null, 15000);
    const mw = await R(p, () => document.querySelector("#rp").shadowRoot.querySelector("[data-markword]").value);
    check(`${tag}: …and a mark's words edited in the record are its words on the frame`, mw === EB, JSON.stringify(mw));
    check(`${tag}: finish and the record: no page errors`, !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // ---- Marks: on | off
  {
    const { p, ctx, errs } = await open({ width: 1440, height: 900 }, seedReview, { W1, W2, W3, WB, WG, round: false });
    await R(p, () => { const el = document.querySelector("#rp"); el.start(); el.player.seek(75.5); el.player.pause(); });
    await until(p, () => document.querySelector("#rp").visibleMarks().length === 1); await frames(p, 3);
    const sw = () => R(p, () => { const S = document.querySelector("#rp").shadowRoot, b = S.querySelector(".marksbtn"), t = [...S.querySelectorAll(".scrub .cmt")];
      return { shown: !b.hidden && b.getClientRects().length > 0, text: b.textContent, checked: b.getAttribute("aria-checked"), role: b.getAttribute("role"), label: b.getAttribute("aria-label"), ticks: t.length, ticksShown: t.filter((x) => x.getClientRects().length).length, kept: localStorage.getItem("rp:marks") }; });
    await inked(p);
    let m = await sw(); const on = await ink(p);
    check("Marks: on, beside Clear (a switch, its key V in its name): the box drawn on its frame, a stroke on the timeline for each comment", m.shown && m.text === "Marks: on" && m.checked === "true" && m.role === "switch" && /\(V\)/.test(m.label) && on > 0 && m.ticks === 5 && m.ticksShown === 5, JSON.stringify({ ...m, on }));
    await p.focus("#rp"); await p.keyboard.press("v"); await frames(p, 2);
    m = await sw(); const off = await ink(p);
    check("V: Marks off, remembered (rp:marks): nothing drawn on the frame, no strokes on the timeline; the record still lists them all", m.text === "Marks: off" && m.checked === "false" && m.kept === "off" && off === 0 && m.ticksShown === 0 && (await recordAt(p)).rows.length === 5, JSON.stringify({ ...m, off }));
    await R(p, () => document.querySelector("#rp").setTool("select")); await inked(p);
    check("…a tool on (to draw, select or erase), the marks are drawn again", (await ink(p)) > 0);
    await R(p, () => document.querySelector("#rp").setTool(null));
    await p.reload(); await loaded(p);
    await R(p, () => { const el = document.querySelector("#rp"); el.start(); el.player.seek(75.5); el.player.pause(); });
    await until(p, () => document.querySelector("#rp").visibleMarks().length === 1); await frames(p, 3);
    m = await sw();
    check("…still off after a reload", m.checked === "false" && (await ink(p)) === 0, JSON.stringify(m));
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".marksbtn").click()); await inked(p);
    m = await sw();
    check("the switch turns them back on", m.checked === "true" && m.kept === "on" && (await ink(p)) > 0 && m.ticksShown === 5, JSON.stringify(m));
    check("marks: no page errors", !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // ---- Your last review, after a rebuild
  {
    const { p, ctx, errs } = await open({ width: 1440, height: 900 }, seedReview, { W1, W2, W3, WB, WG, round: true });
    const lr = () => R(p, () => { const el = document.querySelector("#rp"), S = el.shadowRoot, sec = S.querySelector(".lastrev");
      return { now: el.annotations.length, hidden: sec.hidden, rows: [...sec.querySelectorAll(".ann")].map((a) => ({ t: a.querySelector(".ts").textContent, go: !a.querySelector(".ts").disabled, k: a.querySelector(".k")?.textContent || "", words: a.querySelector(".lw").textContent })),
        sum: sec.querySelector(".lrsum").textContent, fields: sec.querySelectorAll("textarea, input").length, peek: S.querySelector(".grab span").textContent, head: sec.querySelector("h4").textContent }; });
    const L = await lr();
    const words = L.rows.map((r) => r.words);
    check("rebuilt since it was sent: a new round (nothing of it in this one's record), and \"Your last review\" in the record with all of it", L.now === 0 && !L.hidden && L.rows.length === 7 && [W1, W2, W3, WB, WG].every((w) => words.includes(w)) && words.some((w) => w.includes("but keep plan.md short")) && /^Your last review · 7$/.test(L.head), JSON.stringify(L));
    check("…read-only, saying when it was sent and what it asked, and the record's bar says it is there", L.fields === 0 && /^Sent /.test(L.sum) && /changes requested/.test(L.sum) && /6 comments, 1 answer/.test(L.sum) && /your last review: 7/.test(L.peek), JSON.stringify({ sum: L.sum, peek: L.peek }));
    const gone = L.rows.find((r) => r.words === "On a scene that is gone");
    check("…a comment on a scene this version no longer has says so, with no way to go", !!gone && !gone.go, JSON.stringify(gone));
    // a comment: to where it is now
    await clickGrab(p); await pulledIs(p, true);
    await R(p, (w) => { const S = document.querySelector("#rp").shadowRoot; [...S.querySelectorAll(".lastrev .ann")].find((a) => a.querySelector(".lw").textContent === w).querySelector(".ts").click(); }, W3);
    await until(p, () => { const el = document.querySelector("#rp"); return !el.shadowRoot.querySelector(".wrap").classList.contains("pulled") && Math.abs(el.player.currentTime - 160) < 0.2; }, null, 15000); await pulledIs(p, false);
    const c = await R(p, () => { const el = document.querySelector("#rp"), pc = el.shadowRoot.querySelector(".partcard"); return { t: el.player.currentTime, card: pc.classList.contains("on") ? pc.textContent : null }; });
    check("…a comment goes to where it is now: its moment, named on the frame", Math.abs(c.t - 160) < 0.2 && /Your last review/.test(c.card || "") && (c.card || "").includes(W3), JSON.stringify(c));
    // an answer: its question, asked again in this version
    await clickGrab(p); await pulledIs(p, true);
    const q = await R(p, () => document.querySelector("#rp").planMap.decisions[0].id);
    await R(p, () => { const S = document.querySelector("#rp").shadowRoot; [...S.querySelectorAll(".lastrev .ann")].find((a) => a.querySelector(".k")?.textContent === "Question").querySelector(".ts").click(); });
    await until(p, (q) => document.querySelector("#rp").pendingId() === q, q, 15000); await pulledIs(p, false);
    check("…an answer goes to its question, asked again in this version", await R(p, (q) => document.querySelector("#rp").pendingId() === q, q));
    // a note on the guide's words: to its part of the guide
    await clickGrab(p); await pulledIs(p, true);
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".lastrev [data-lr-guide]").click());
    await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled") && document.querySelector("#rp-guide").atGuide(), null, 15000); await pulledIs(p, false);
    check("…a note on the guide's words goes to its part of the guide", await R(p, () => document.querySelector("#rp-guide").atGuide()));
    // reading the guide, the record (and the last review in it) is a click away
    await clickGrab(p); await pulledIs(p, true);
    const vis = await R(p, () => { const el = document.querySelector("#rp"), sec = el.shadowRoot.querySelector(".lastrev"); const r = sec.getBoundingClientRect(); return { mini: !!el._mini, top: Math.round(r.top), H: innerHeight, pulled: el.shadowRoot.querySelector(".wrap").classList.contains("pulled") }; });
    check("…and reading the guide, the record pulled up shows it", vis.mini && vis.pulled && vis.top < vis.H, JSON.stringify(vis));
    check("last review: no page errors", !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }
} catch (e) { ok = false; console.error("✗", e.stack || e.message); }
await b.close(); srv.kill();
try { rmSync(T, { recursive: true, force: true }); } catch {}
process.exit(ok ? 0 : 1);
