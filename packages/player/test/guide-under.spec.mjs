#!/usr/bin/env node
// The guide under the video (D-264), on the review page bundle-player builds: the video stays first,
// in the player with everything it does; the open video's guide sits under it (<reelplanning-guide>, its guide page in a
// frame as tall as the window, ?embed=1: no top bar); scrolled out of view the frame becomes a small player in the corner
// (a slim bar on a phone) that keeps playing, and scrolling back puts it back in its place, the page never jumping;
// "Watch this moment" in the guide seeks this player and plays, never leaving the page; a marked thing on the frame
// (data-detail) scrolls the page to its part of the guide, pausing the video, the part lit a moment; words selected in
// the guide and kept as a note go into the same review as the video's marks. Also: a phone's slim bar, and reduced motion.
// Runs on the plan guide's walkthrough (its frames mark their parts of the guide), bundled into a scratch folder; its
// guide is built there if it is not (bundle-player). Its assets/ (the voice, fonts, screenshots) are build output, not
// committed: the video plays silent.
// usage: node packages/player/test/guide-under.spec.mjs
import { chromium } from "playwright-core"; import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs"; import { join } from "node:path"; import { tmpdir } from "node:os";
import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, loaded, movedOn, now, frames, nodeUntil, pageHold, laidOut } from "./wait.mjs";

const VIDEO = ".reelplanning/plans/2026-09-28-plan-guide/walkthrough-video", SLUG = "2026-09-28-plan-guide--walkthrough";
const T = mkdtempSync(join(tmpdir(), "rp-guide-under-")), OUT = join(T, "review");
// (and the plan's own video, whose plan.md changed after its plan review: its guide marks what changed)
const PLAN_VIDEO = ".reelplanning/plans/2026-09-28-plan-guide/video", PLAN_SLUG = "2026-09-28-plan-guide";
execFileSync(process.execPath, [join(ROOT, "scripts/bundle-player.mjs"), OUT, join(ROOT, VIDEO), join(ROOT, PLAN_VIDEO)], { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
const port = testPort(8893);
const srv = staticServer(port, { dir: OUT });
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
let ok = true; const check = (n, c, x = "") => { console.log(`${c ? "✓" : "✗"} ${n}${x ? " — " + x : ""}`); if (!c) ok = false; };
const URL0 = `http://127.0.0.1:${port}/?project=${SLUG}`;

// a page with the review page open on the video, its guide found and ready under it
async function open(viewport, opts = {}) {
  const ctx = await b.newContext({ viewport, ...opts }), p = await ctx.newPage(), errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  // (the video's assets/, its voice, fonts and screenshots, are build output, not in a clone: they are missing, and
  // nothing else may be)
  p.on("response", (r) => { if (r.status() >= 400 && !r.url().includes(`/${SLUG}/assets/`)) errs.push(`${r.status()} ${r.url().split("/").slice(-2).join("/")}`); });
  await p.goto(URL0); await loaded(p);
  await until(p, () => document.querySelector("#rp").hasAttribute("guide-under") && document.querySelector("#rp-guide").ready, null, 30000);
  return { p, ctx, errs };
}
const guideFrame = (p) => p.frames().find((f) => /\/guide\/index\.html\?/.test(f.url()) && new URL(f.url()).searchParams.get("embed") === "1");
const miniState = (p) => p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, st = R.querySelector(".stage"), bar = R.querySelector(".minibar"), ph = R.querySelector(".stageph");
  const r = (x) => { const q = x.getBoundingClientRect(); return { x: Math.round(q.left), y: Math.round(q.top), w: Math.round(q.width), h: Math.round(q.height), b: Math.round(q.bottom), r: Math.round(q.right) }; };
  return { mini: !!el._mini, stage: r(st), ph: r(ph), bar: bar.hidden ? null : r(bar), fixed: getComputedStyle(st).position === "fixed", moving: st.getAnimations().length + bar.getAnimations().length, W: document.documentElement.clientWidth, H: document.documentElement.clientHeight,
    y: scrollY, docH: document.documentElement.scrollHeight, time: bar.querySelector(".mnow").textContent, side: getComputedStyle(R.querySelector(".side")).pointerEvents, rec: r(R.querySelector(".grab")) }; });
const settledMini = (p, on) => until(p, (on) => { const el = document.querySelector("#rp"), R = el.shadowRoot; return !!el._mini === on && !R.querySelector(".stage").getAnimations().length && !R.querySelector(".minibar").getAnimations().length; }, on);
const wheelUntil = async (p, dy, cond, arg, n = 60) => { for (let i = 0; i < n; i++) { if (await p.evaluate(cond, arg)) return true; await p.mouse.wheel(0, dy); await frames(p, 2); } return p.evaluate(cond, arg); };

try {
  // ---- desktop, light: the guide under the video
  const { p, ctx, errs } = await open({ width: 1440, height: 900 });
  const lay = await p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, g = document.querySelector("#rp-guide"), G = g.shadowRoot, fr = G.querySelector("iframe");
    return { stage: R.querySelector(".stage").getBoundingClientRect().top, finish: R.querySelector('[data-act="finish"]').getBoundingClientRect().bottom, guide: G.querySelector(".gu").getBoundingClientRect().top, shown: !G.querySelector(".gu").hidden,
      src: fr.getAttribute("src"), frameH: fr.getBoundingClientRect().height, H: innerHeight, btn: !R.querySelector(".guidebtn").hidden, title: G.querySelector("h2").textContent }; });
  const src = new URL(lay.src, URL0);
  check("the guide sits under the video: the player first, the video's own guide under it, in a frame as tall as the window", lay.shown && lay.stage < lay.guide && lay.finish <= lay.guide && src.pathname === `/${SLUG}/guide/index.html` && src.searchParams.get("embed") === "1" && src.searchParams.get("src") === `${SLUG}/index.html` && Math.abs(lay.frameH - lay.H) <= 1 && lay.btn && !!lay.title, JSON.stringify(lay));
  const gf = guideFrame(p);
  const inside = await gf.evaluate(() => ({ bar: [...document.querySelectorAll(".gbar")].map((x) => getComputedStyle(x).display), embed: document.documentElement.classList.contains("rp-embed"), still: getComputedStyle(document.documentElement).overflow, sections: document.querySelectorAll("section[data-flow]").length }));
  check("embedded, the guide has no top bar, and waits for the page to reach it before it scrolls itself", inside.embed && inside.bar.every((d) => d === "none") && inside.still === "hidden" && inside.sections > 0, JSON.stringify(inside));

  // ---- the poster (round 2's finding 5): the first scene settled (its end less 0.3 s, short of a stop in it), never a
  // count caught half way; "Before you watch" open over it covers the picture with paper (about 92 %), Start its footer
  const post = await p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, f0 = el.planMap.frames[0], idle = R.querySelector(".idle"), bx = R.querySelector(".before"), acts = bx.querySelector(".acts");
    const open = !bx.hidden && !bx.classList.contains("one") && !bx.classList.contains("below"), bg = getComputedStyle(idle).backgroundColor, a = [(/\/\s*([\d.]+)\s*\)$/.exec(bg) || /^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/.exec(bg) || [0, 1])[1]];
    const stops = el.points().map((pt) => +pt.q.at).filter((x) => x >= 0 && x < f0.start + f0.durationSeconds), want = Math.max(0.2, Math.min(f0.start + f0.durationSeconds - 0.3, ...stops.map((x) => x - 0.3)));
    return { t: el._posterT, want, now: el.player.currentTime, open, alpha: +a[0], bg, sticky: acts ? getComputedStyle(acts).position : null, fade: acts ? getComputedStyle(acts, "::before").backgroundImage : null }; });
  check("the poster is the first scene settled (its end less 0.3 s, short of a stop in it), not a moment 3 s in", Math.abs(post.t - post.want) < 0.05 && Math.abs(post.now - post.want) < 0.2, JSON.stringify(post));
  if (post.open) check("…\"Before you watch\" open over it: the picture covered with paper (about 92 %), Start a sticky footer with a fade above it", post.alpha >= 0.9 && post.sticky === "sticky" && /gradient/.test(post.fade || ""), JSON.stringify(post));
  // before it starts, a thing's mark that leads to the guide is not over the poster: a click on Play plays (the owner
  // pressed Play on explain-first's walkthrough and was taken to the guide)
  const pre = await p.evaluate(() => { const R = document.querySelector("#rp").shadowRoot, go = R.querySelector(".idle .go"), dm = R.querySelector(".dmark");
    const r = go && go.getClientRects().length ? go.getBoundingClientRect() : null, at = r ? R.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
    return { go: !!r, hit: at ? at.className || at.tagName : null, mark: dm ? getComputedStyle(dm).display : null }; });
  check("before it starts, no guide mark over the poster: Play takes the click", pre.mark === "none" && (!pre.go || pre.hit === "go"), JSON.stringify(pre));

  // ---- scrolling shrinks it to the small player, which keeps playing; scrolling back puts it back
  await p.evaluate(() => { const el = document.querySelector("#rp"); el.start(); el.player.seek(20); el.player.play(); });
  await movedOn(p, 20);
  const before = await miniState(p);
  await p.mouse.move(700, 300);
  await wheelUntil(p, 100, () => !!document.querySelector("#rp")._mini);
  await settledMini(p, true);
  const small = await miniState(p);
  const t1 = await now(p); await movedOn(p, t1, 0.3);
  check("scrolled out of view, the video becomes a small player in the bottom-right corner (280 px wide under 1500 px, else 320–400), with its time", small.mini && small.fixed && (small.W < 1500 ? small.stage.w === 280 : small.stage.w >= 320 && small.stage.w <= 400) && small.stage.r <= small.W - 8 && small.bar && small.bar.b <= small.H - 8 && small.bar.r === small.stage.r && Math.abs(small.bar.y - small.stage.y) <= 1 && /^\d+:\d\d$/.test(small.time), JSON.stringify(small));
  check("…above the record's bar, which stays at the window's foot while the guide is read (the owner: the record was hidden with the guide)", small.side === "auto" && small.rec.b >= small.H - 1 && small.rec.y >= small.H - 41 && small.bar.b <= small.rec.y - 8, JSON.stringify({ rec: small.rec, bar: small.bar, H: small.H }));
  // at rest or playing: its chapter's name on a paper strip along the picture's foot, the frame's captions hidden
  const strip = await p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, s = R.querySelector(".mstrip"), r = s.getBoundingClientRect(), st = R.querySelector(".stage").getBoundingClientRect(), d = el.player.iframeElement.contentDocument, cap = d.querySelector("#el-captions");
    return { shown: !s.hidden && r.width > 0, text: s.textContent, font: getComputedStyle(s).fontSize, inPic: r.left >= st.left - 1 && r.right <= st.right + 1 && Math.abs(r.bottom - st.bottom) <= 1, caps: cap ? getComputedStyle(cap).visibility : null, ch: el.chapterAt(el.player.currentTime)?.title }; });
  check("…the small player names its chapter on a paper strip (13 px) along the picture's foot, and hides the frame's captions", strip.shown && !!strip.ch && strip.text.includes(strip.ch) && strip.font === "13px" && strip.inPic && strip.caps === "hidden", JSON.stringify(strip));
  check("…and it keeps playing", await p.evaluate(() => !document.querySelector("#rp").player.paused));
  // paused, the small player shows its chapter settled (the guide's own picture of a scene of it, round 2's finding 11);
  // playing, the live frame
  {
    await until(p, () => document.querySelector("#rp-guide").ready);
    const want = await p.evaluate(() => { const el = document.querySelector("#rp"), c = el.chapterAt(el.player.currentTime); return el._under.stillFor(c.start, c.end, el.player.currentTime, el.theme === "dark"); });
    await p.evaluate(() => document.querySelector("#rp").player.pause());
    if (want) await until(p, () => { const i = document.querySelector("#rp").shadowRoot.querySelector(".mstill"); return !i.hidden && i.complete && i.naturalWidth > 0; });
    const still = await p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, i = R.querySelector(".mstill"), r = i.getBoundingClientRect(), st = R.querySelector(".stage").getBoundingClientRect();
      return { shown: !i.hidden && getComputedStyle(i).display !== "none", src: i.src, over: Math.abs(r.left - st.left) <= 1 && Math.abs(r.width - st.width) <= 1 && Math.abs(r.height - st.height) <= 1 }; });
    check("paused, the small player shows its chapter's settled still (the guide's picture), over the live frame", !!want && still.shown && still.src === want && /\/guide\/pics\//.test(still.src) && still.over, JSON.stringify({ want, ...still }));
    const t0 = await now(p); await p.evaluate(() => document.querySelector("#rp").player.play()); await movedOn(p, t0);
    await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".mstill").hidden);
    check("…and playing, the live frame again", await p.evaluate(() => { const i = document.querySelector("#rp").shadowRoot.querySelector(".mstill"); return i.hidden && getComputedStyle(i).display === "none"; }));
  }
  check("nothing on the page moves: the frame's room is kept where it was", small.ph.h === before.stage.h && small.ph.w === before.stage.w && small.docH === before.docH && small.ph.y === before.stage.y - small.y + before.y, JSON.stringify({ before: before.stage, ph: small.ph, docH: [before.docH, small.docH] }));
  // the guide's column keeps clear of the small player: the words end 16 px or more left of it
  await until(p, () => document.querySelector("#rp-guide").ready);
  await gf.waitForFunction(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--rp-embed-right")) > 0, null, { timeout: 10000 }).catch(() => null);
  const clearOf = async (p, gf) => { const mini = await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".minibar").getBoundingClientRect().left);
    const col = await gf.evaluate(() => { const d = document.querySelector("main.doc"), cs = getComputedStyle(d), r = d.getBoundingClientRect(); return Math.round(r.right - parseFloat(cs.paddingRight)); });
    const fx = await p.evaluate(() => document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect().left); return { mini: Math.round(mini), col: Math.round(col + fx) }; };
  const cl = await clearOf(p, gf);
  check("the guide's column moves left of the small player: it never covers the guide's words", cl.col <= cl.mini - 16, JSON.stringify(cl));
  // the page reaches the guide; from there the wheel scrolls the guide itself
  await wheelUntil(p, 120, () => document.querySelector("#rp-guide").atGuide());
  await until(p, () => document.querySelector("#rp-guide")._scrollOn === true);
  const g0 = await gf.evaluate(() => scrollY);
  await p.mouse.move(400, 500); for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 150); await frames(p, 2); }
  await gf.waitForFunction((g0) => scrollY > g0 + 100, g0, { timeout: 10000 }).catch(() => null);
  const g1 = await gf.evaluate(() => ({ y: scrollY, still: document.documentElement.classList.contains("rp-embed-still") }));
  check("once the guide fills the window, it scrolls itself (the page stays put)", g1.y > g0 + 100 && !g1.still, JSON.stringify({ g0, ...g1 }));
  // the page's scroll bar's room beside the guide is the guide's paper, not a stripe of the page's ground (round 2's finding 16)
  const gut = await p.evaluate(() => ({ at: document.documentElement.hasAttribute("data-rp-at-guide"), root: getComputedStyle(document.documentElement).backgroundColor, gutter: innerWidth - document.documentElement.clientWidth }));
  const gpaper = await gf.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check("…beside it, the page's scroll bar's room takes the guide's paper", gut.at && gut.root === gpaper, JSON.stringify({ ...gut, guide: gpaper }));
  // back: the small player's button takes the page back up, and the video back into its place
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="mini-up"]').click());
  await settledMini(p, false); await until(p, () => scrollY === 0);
  const back = await miniState(p);
  check("scrolling back up puts it back in its place", !back.mini && !back.fixed && !back.bar && back.stage.y === before.stage.y && back.stage.h === before.stage.h && back.stage.w === before.stage.w, JSON.stringify({ before: before.stage, back: back.stage }));

  // ---- "Watch this moment" in the guide: this player seeks and plays; the page stays
  await p.evaluate(() => document.querySelector("#rp").player.pause());
  await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="guide"]').click());
  await settledMini(p, true); await until(p, () => document.querySelector("#rp-guide")._scrollOn === true);
  const link = await gf.evaluate((slug) => { const a = [...document.querySelectorAll("a.wm[href]")].find((x) => { const u = new URL(x.href); return u.searchParams.get("project") === slug && Number(u.searchParams.get("t")) > 30 && x.offsetParent; });
    if (!a) return null; a.id ||= "rp-test-watch"; a.scrollIntoView({ block: "center" }); return { id: a.id, t: Number(new URL(a.href).searchParams.get("t")) }; }, SLUG);
  if (!link) check("a Watch this moment link for this video is in its guide", false);
  else {
    await frames(p, 3);
    const pageUrl = p.url(), frameUrl = gf.url();
    await gf.locator(`#${link.id}`).click();
    await until(p, (t) => { const el = document.querySelector("#rp"); return Math.abs(el.player.currentTime - t) < 1.5 && !el.player.paused; }, link.t);
    const w = await p.evaluate(() => ({ t: document.querySelector("#rp").player.currentTime, playing: !document.querySelector("#rp").player.paused, mini: !!document.querySelector("#rp")._mini }));
    check("\"Watch this moment\" seeks this player there and plays it, small, where you are reading", Math.abs(w.t - link.t) < 1.5 && w.playing && w.mini, JSON.stringify({ want: link.t, ...w }));
    check("…and never leaves the page: the review page and the guide stay where they were", p.url() === pageUrl && gf.url() === frameUrl && p.frames().filter((f) => /index\.html\?project=/.test(f.url())).length === 0, JSON.stringify({ page: p.url(), frame: gf.url() }));
  }

  // ---- a marked thing on the frame: the page goes down to its part of the guide, the video pauses, the part lit
  await p.evaluate(() => document.querySelector("#rp").backToVideo());
  await settledMini(p, false); await until(p, () => scrollY === 0);
  // (a thing is live once it has drawn: the opening scene's map is in place from 0:00 and draws its rows at 7.8 s, so at
  // 3 s nothing on it answers the pointer, and at 9 s it does: round 3's finding 1)
  { const first = await p.evaluate(() => { const el = document.querySelector("#rp"), f = el.planMap.frames[0]; return el.detailAt(f.start + 0.5)?.name || null; });
    if (first) {
      await p.evaluate(() => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(3); });
      await until(p, () => Math.abs(document.querySelector("#rp").player.currentTime - 3) < 0.1); await pageHold(p, 1500);
      const early = await p.evaluate(() => !document.querySelector("#rp").shadowRoot.querySelector(".dmark").hidden);
      await p.evaluate(() => document.querySelector("#rp").player.seek(9));
      const late = !!(await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".dmark").hidden, null, 10000));
      check("the opening scene's thing is live only once it has drawn: nothing at 0:03, its button at 0:09", !early && late, JSON.stringify({ first, early, late }));
    } }
  const d = await p.evaluate(() => document.querySelector("#rp").planMap.details.find((x) => x.guide && x.name === "page") || document.querySelector("#rp").planMap.details.find((x) => x.guide));
  await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.seek(t); el.player.play(); }, d.start + 1);
  // (the thing's button is there once it has landed: its reveal has ended)
  await until(p, (n) => { const L = document.querySelector("#rp").shadowRoot.querySelector(".dmark"); return !L.hidden && L.querySelector(".dhit").dataset.name === n; }, d.name, 30000);
  const had = await p.evaluate(() => document.querySelector("#rp").detailsLog().length);
  // (the guide read far down, at its foot: the part is many windows up from there; every scroll position on the way noted)
  await gf.evaluate(() => { scrollTo(0, document.documentElement.scrollHeight); window.__rpYs = [scrollY]; addEventListener("scroll", () => window.__rpYs.push(scrollY), { passive: true }); });
  // a thing that is most of the picture: a click on the video there pauses it, as on any video, and stays (the owner: "i cant even press play on video it just brings me to the guide")
  const big = await p.evaluate(() => { const b = document.querySelector("#rp").shadowRoot.querySelector(".dmark .dhit"), r = b.getBoundingClientRect(); return b.hasAttribute("data-big") ? { x: r.left + r.width / 2, y: r.top + r.height * 0.6 } : null; });
  if (big) { await p.mouse.click(big.x, big.y); await pageHold(p, 600);
    const after = await p.evaluate(() => ({ paused: document.querySelector("#rp").player.paused, at: document.querySelector("#rp-guide").atGuide(), log: document.querySelector("#rp").detailsLog().length }));
    check("…a click on the video over a thing that is most of the picture pauses it and stays: only the label leads to the guide", after.paused && !after.at && after.log === had, JSON.stringify(after));
    await p.evaluate(() => document.querySelector("#rp").player.play()); }
  // (its label: a thing that is most of the picture leads to the guide only from there, a click elsewhere on it pausing)
  await p.locator("#rp").locator(".dmark .dhit .dtab").click();
  await until(p, () => document.querySelector("#rp-guide").atGuide() && document.querySelector("#rp").player.paused);
  // (lit at once; the guide's own scroll to it may glide a while: until it has come to rest there)
  await gf.waitForFunction((id) => { const e = document.getElementById(id), lit = document.querySelector(".rp-embed-lit"); if (!e || !lit) return false;
    const top = Math.round(lit.getBoundingClientRect().top), w = (window.__rpRest ||= { top: null, n: 0 }); if (top !== w.top) { w.top = top; w.n = 0; return false; } return ++w.n >= 5 && top >= -2 && top < innerHeight * 0.6; }, d.name, { timeout: 20000, polling: 50 }).catch(() => null);
  const at = await gf.evaluate((id) => { const e = document.getElementById(id), lit = document.querySelector(".rp-embed-lit"), r = (lit || e).getBoundingClientRect(); return { found: !!e, lit: !!lit, top: Math.round(r.top), H: innerHeight }; }, d.name);
  const opened = await p.evaluate(() => ({ paused: document.querySelector("#rp").player.paused, over: !document.querySelector("#rp").shadowRoot.querySelector(".dpanel").hidden, log: document.querySelector("#rp").detailsLog() }));
  check("a marked thing on the frame scrolls the page down to its part of the guide, and pauses the video", opened.paused && !opened.over && at.found && at.top >= -2 && at.top < at.H * 0.6, JSON.stringify({ part: d.name, ...at, over: opened.over }));
  const way = await gf.evaluate((id) => { const ys = window.__rpYs, e = document.getElementById(id), lit = document.querySelector(".rp-embed-lit"), end = scrollY;
    return { from: ys[0], end, H: innerHeight, between: ys.slice(1).filter((y) => Math.abs(y - end) > 4).length, top: Math.round(e.getBoundingClientRect().top), margin: getComputedStyle(e).scrollMarginTop, anim: lit ? getComputedStyle(lit).animationName : null }; }, d.name);
  check("…many windows away, it jumps there (no glide past sections not drawn yet), its top 32 px from the window's, the light fading in (round 2's finding 10)", way.from - way.end > 2 * way.H && way.between <= 1 && way.margin === "32px" && Math.abs(way.top - 32) <= 4 && way.anim === "rp-embed-in", JSON.stringify(way));
  check("…the part it lands on lit a moment, and the opening on the record (from: frame)", at.lit && opened.log.length === had + 1 && opened.log.at(-1).name === d.name && opened.log.at(-1).from === "frame", JSON.stringify(opened.log.at(-1)));

  // ---- words selected in the guide and kept: a note in the same review as the video's marks
  const words = "The guide's note, kept with the video's review";
  const sel = await gf.evaluate(() => { const el = [...document.querySelectorAll("[data-anchor]")].find((x) => x.offsetParent && [...x.querySelectorAll("*")].every((c) => !c.closest("[data-no-anchor]")) && (x.innerText || "").trim().length > 24 && x.getBoundingClientRect().top > 40 && x.getBoundingClientRect().bottom < innerHeight * 0.6 && !x.closest("button,a,summary"));
    if (!el) return null; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let tn = null; while (tw.nextNode()) if (tw.currentNode.textContent.trim().length > 8) { tn = tw.currentNode; break; } if (!tn) return null;
    const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, Math.min(tn.textContent.length, 24)); getSelection().removeAllRanges(); getSelection().addRange(r);
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true })); return { anchor: el.getAttribute("data-anchor"), text: String(getSelection()).trim() }; });
  if (!sel) check("a passage of the guide to select", false);
  else {
    await gf.waitForFunction(() => !document.querySelector(".rpn-box").hidden, null, { timeout: 10000 }).catch(() => null);
    await gf.locator(".rpn-box textarea").fill(words); await gf.locator(".rpn-box textarea").press("Enter");
    await until(p, (w) => document.querySelector("#rp").annotations.some((a) => a.comment === w), words);
    const note = await p.evaluate((w) => { const el = document.querySelector("#rp"), a = el.annotations.find((x) => x.comment === w); return { a, inExport: el.exportPayload().annotations.some((x) => x.comment === w), listed: el.shadowRoot.querySelector(".side .list").textContent.includes(w) }; }, words);
    check("words selected in the guide and kept become a note in the same review as the video's marks", !!note.a && note.a.via === "guide" && note.a.detail?.anchor === sel.anchor && note.inExport && note.listed, JSON.stringify({ sel, via: note.a?.via, detail: note.a?.detail, inExport: note.inExport, listed: note.listed }));
  }
  // ---- a picture opened full size in the guide: the small player steps out of its way, paused, and comes back after
  await settledMini(p, true).catch(() => null);
  if (!(await p.evaluate(() => !!document.querySelector("#rp")._mini))) { await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="guide"]').click()); await settledMini(p, true); }
  await until(p, () => document.querySelector("#rp-guide")._scrollOn === true);
  await p.evaluate(() => document.querySelector("#rp").player.play()); await movedOn(p, await now(p));
  const zoomId = await gf.evaluate(() => { const a = [...document.querySelectorAll("a.zoom")].find((x) => x.querySelector("img")); if (!a) return null; a.id ||= "rp-test-zoom"; a.scrollIntoView({ block: "center" }); return a.id; });
  if (!zoomId) check("a picture in the guide to open full size", false);
  else {
    await gf.evaluate((id) => document.getElementById(id).click(), zoomId);
    await until(p, () => document.querySelector("#rp").hasAttribute("overlay"));
    await gf.waitForFunction(() => { const i = document.querySelector(".lb-img"); return i && i.complete && i.getBoundingClientRect().width > 0; }, null, { timeout: 10000 }).catch(() => null);
    const lb = await p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot; return { overlay: el.hasAttribute("overlay"), bar: getComputedStyle(R.querySelector(".minibar")).visibility, pic: getComputedStyle(R.querySelector(".stage")).visibility, paused: el.player.paused }; });
    const room = await gf.evaluate(() => { const r = document.querySelector(".lb-img").getBoundingClientRect(); return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(innerWidth - r.right), b: Math.round(innerHeight - r.bottom) }; });
    check("a picture opened full size in the guide: the small player steps out of its way (hidden) and pauses", lb.overlay && lb.bar === "hidden" && lb.pic === "hidden" && lb.paused, JSON.stringify(lb));
    check("…the picture fitted with room round it (48 px a side or more, 72 px above and below or more)", Math.min(room.l, room.r) >= 47 && Math.min(room.t, room.b) >= 71, JSON.stringify(room));
    await gf.press("body", "Escape");
    await until(p, () => !document.querySelector("#rp").hasAttribute("overlay") && !document.querySelector("#rp").player.paused);
    const back = await p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot; return { overlay: el.hasAttribute("overlay"), bar: getComputedStyle(R.querySelector(".minibar")).visibility, playing: !el.player.paused, mini: !!el._mini }; });
    check("…and closed, the small player is back as it was, playing again", !back.overlay && back.bar === "visible" && back.playing && back.mini, JSON.stringify(back));
    await p.evaluate(() => document.querySelector("#rp").player.pause());
  }

  // ---- every link in the guide keeps the frame where it is (round 1, A1): none ever loads a page into the frame
  {
    const frameUrl = gf.url(), pageUrl = p.url(), nav = { frame: [], top: [] }, pops = [];
    await p.route("**/*", (route) => { const r = route.request(); if (!r.isNavigationRequest()) return route.fallback();
      if (r.frame() === p.mainFrame()) { nav.top.push(r.url()); return route.fulfill({ status: 204, body: "" }); }
      nav.frame.push(r.url()); return route.fulfill({ status: 204, body: "" }); });
    ctx.on("page", (pg) => { pops.push(pg.url()); pg.close().catch(() => {}); });
    await gf.evaluate(() => window.RPGuide?.expandAll(true));
    const res = await gf.evaluate(() => {
      const links = [...document.querySelectorAll("a[href]")].filter((a) => !(a.getAttribute("href") || "").startsWith("#") && !a.closest(".lb"));
      // a click as a mouse makes one (it follows the link unless something stops it); what became of it, each
      const seen = links.map((a) => { const href = a.href, ev = new MouseEvent("click", { bubbles: true, cancelable: true, view: window, button: 0 }); a.dispatchEvent(ev); document.querySelector(".lb:not([hidden])") && window.RPPictures?.close(); return { href, prevented: ev.defaultPrevented, target: a.target || "", zoom: a.matches(".zoom") }; });
      return { n: links.length, seen };
    });
    const blank = res.seen.filter((x) => !x.prevented && x.target === "_blank").length, top = res.seen.filter((x) => !x.prevented && x.target === "_top").length;
    await nodeUntil(() => pops.length >= blank && nav.top.length >= top, 20000);
    await until(p, () => document.readyState === "complete");
    const own = res.seen.filter((x) => !x.prevented && !["_blank", "_top"].includes(x.target));
    check("every link in the guide (not a place on the page) clicked: the frame never goes anywhere", res.n > 20 && gf.url() === frameUrl && !nav.frame.length && !own.length && p.url() === pageUrl,
      JSON.stringify({ links: res.n, kept: res.seen.filter((x) => x.prevented).length, zoom: res.seen.filter((x) => x.zoom).length, blank, top, frame: nav.frame.slice(0, 2), own: own.slice(0, 2) }));
    check("…a link to this video (its moment, or none) is the review page's own; another video's opens the review page on it; the rest a new tab", res.seen.filter((x) => x.prevented).length > 0 && res.seen.every((x) => x.prevented || x.target === "_blank" || (x.target === "_top" && new URL(x.href).searchParams.get("project") !== SLUG)),
      JSON.stringify(res.seen.filter((x) => !(x.prevented || x.target === "_blank" || x.target === "_top")).slice(0, 3)));
    await p.unroute("**/*");
  }
  check("no page errors, and nothing missing but the video's build output", !errs.length, errs.slice(0, 3).join(" | "));
  await ctx.close();

  // ---- a part asked for before the guide under the video is attached: it waits for the guide, never a page of its own
  {
    const { p, ctx, errs } = await open({ width: 1280, height: 800 });
    const parts = []; p.on("request", (r) => { if (/\/guide\/(?!index\.html)[^/]+\.html/.test(new URL(r.url()).pathname)) parts.push(r.url()); });
    const d = await p.evaluate(() => { const el = document.querySelector("#rp"), g = el._under, d = el.planMap.details.find((x) => x.guide && x.name === "page") || el.planMap.details.find((x) => x.guide);
      el._under = null; el.openDetail(d, { from: "chip" }); const held = !!el._underWant && document.querySelector("#rp").shadowRoot.querySelector(".dpanel").hidden; el.attachGuide(g); return { name: d.name, held }; });
    await until(p, () => document.querySelector("#rp-guide").atGuide(), null, 20000);
    const gfr = guideFrame(p);
    await gfr.waitForFunction((id) => { const e = document.getElementById(id); return e && Math.abs(e.getBoundingClientRect().top) < innerHeight * 0.6; }, d.name, { timeout: 20000 }).catch(() => null);
    const got = await p.evaluate(() => ({ panel: !document.querySelector("#rp").shadowRoot.querySelector(".dpanel").hidden, log: document.querySelector("#rp").detailsLog().at(-1) }));
    check("a part asked for before the guide is attached waits for it, then is read in the guide under the video (no part page loaded)", d.held && !got.panel && !parts.length && got.log?.name === d.name && got.log?.from === "chip", JSON.stringify({ ...d, ...got, parts }));
    const cl = await clearOf(p, gfr);
    check("at 1280 px too, the guide's column keeps clear of the small player", cl.col <= cl.mini - 16, JSON.stringify(cl));
    check("no page errors", !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // ---- a phone: the small player is a slim bar along the foot of the window
  {
    const { p, ctx, errs } = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    // each look at the phone's layout waits for it to come to rest: measured while it still moved (the guide taking its
    // room, the bar sliding in), a box was read part way
    await laidOut(p);
    // the poster and the bar on a narrow phone (round 2's finding 7): the poster's own words behind the play overlay; no
    // key hints on a touch screen; the chapter on a line of its own under the scrubber, in full, then play, time, buttons
    const ph = await p.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, x = (q) => R.querySelector(q).getBoundingClientRect(), bg = getComputedStyle(R.querySelector(".idle")).backgroundColor, a = [(/\/\s*([\d.]+)\s*\)$/.exec(bg) || /^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/.exec(bg) || [0, 1])[1]];
      const cur = R.querySelector('.labels .part[aria-current="true"]'), pt = cur?.querySelector(".pt"), kh = R.querySelector(".idle .meta .kh");
      return { alpha: +a[0], meta: R.querySelector(".idle .meta").innerText, kh: kh ? getComputedStyle(kh).display : null, kbd: [...R.querySelectorAll("button kbd")].filter((k) => k.getClientRects().length).length,
        scrubB: Math.round(x(".scrub").bottom), chapT: Math.round(x(".nowline").top), chapB: Math.round(x(".nowline").bottom), playT: Math.round(x(".transport .play").top), chapW: Math.round(x(".nowline").width), W: innerWidth,
        name: pt?.textContent || "", cut: pt ? pt.scrollWidth > pt.clientWidth + 1 : true }; });
    check("a phone: the poster's own words stay behind the play overlay (paper, 90 %), and no key hint (\"space\") on a touch screen", ph.alpha >= 0.88 && ph.kh === "none" && !/space/i.test(ph.meta) && ph.kbd === 0, JSON.stringify(ph));
    check("…the chapter on a line of its own under the scrubber, the width of the row, its name in full; play and the time under it", ph.chapT >= ph.scrubB - 1 && ph.playT >= ph.chapB - 1 && ph.chapW >= ph.W - 40 && !!ph.name && !ph.cut, JSON.stringify(ph));
    await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="guide"]').click());
    await settledMini(p, true); await laidOut(p);
    const s = await miniState(p);
    check("a phone: the small player is a slim bar along the foot of the window, a 64 × 36 picture at its left, inside it", s.mini && s.bar && s.bar.h <= 64 && s.bar.w >= s.W - 20 && s.bar.b <= s.H - 4 && s.stage.w === 64 && s.stage.h === 36 && s.stage.x >= s.bar.x + 8 && s.stage.y > s.bar.y && s.stage.b < s.bar.b && s.W <= 390, JSON.stringify(s));
    // …then play, then the time over the chapter's name, then the way back up; and the guide's frame stops above the bar
    const row = await p.evaluate(() => { const R = document.querySelector("#rp").shadowRoot, x = (q) => R.querySelector(q).getBoundingClientRect(), ifr = document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect();
      return { play: x(".mplay").left, time: x(".mtime").left, chap: x(".mchap").left, chapTop: x(".mchap").top, timeTop: x(".mtime").top, up: x(".mup").left, thumbR: x(".stage").right, chapText: R.querySelector(".mchap").textContent, frameBottom: Math.round(ifr.bottom), barTop: Math.round(x(".minibar").top), H: innerHeight }; });
    const wide = await p.evaluate(() => ({ frame: Math.round(document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect().width), W: innerWidth }));
    check("a phone: the guide's frame is the window's full width (round 2's N13)", wide.frame === wide.W, JSON.stringify(wide));
    const gph = guideFrame(p), wm = await gph.evaluate(() => { const a = [...document.querySelectorAll("a.wm")].find((x) => x.getClientRects().length && x.querySelector(".ws")); if (!a) return null; const l = a.querySelector(".wl").getBoundingClientRect(), t = a.querySelector(".ws").getBoundingClientRect(), r = a.getBoundingClientRect(), m = document.querySelector("main.doc") || document.body, mr = m.getBoundingClientRect(), pad = parseFloat(getComputedStyle(m).paddingRight) || 0;
      return { linkLines: Math.round(l.height / parseFloat(getComputedStyle(a.querySelector(".wl")).lineHeight)), under: t.top >= l.bottom - 1, width: Math.round(r.width), col: Math.round(mr.width - pad - (parseFloat(getComputedStyle(m).paddingLeft) || 0)) }; });
    check("…in the guide, \"Watch this moment\" on its own line, the time and the scene under it, full width (never a two-column grid)", !!wm && wm.linkLines === 1 && wm.under, JSON.stringify(wm));
    check("a phone: thumbnail, play, the time and its chapter, then Video; the guide's words never under the bar", row.play >= row.thumbR && row.time > row.play && Math.abs(row.chap - row.time) <= 1 && row.chapTop > row.timeTop && !!row.chapText && row.up > row.time && row.frameBottom <= row.barTop + 1, JSON.stringify(row));
    // a marked thing's part, on a phone (the guide in one column, each beat's thing drawn as it comes near): it lands there
    await p.evaluate(() => document.querySelector("#rp").backToVideo()); await settledMini(p, false); await until(p, () => scrollY === 0);
    const d = await p.evaluate(() => document.querySelector("#rp").planMap.details.find((x) => x.guide && x.name === "page"));
    await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.seek(t); el.player.pause(); }, d.start + 1.5);
    await until(p, (n) => document.querySelector("#rp").detailAt(document.querySelector("#rp").player.currentTime)?.name === n, d.name);
    await p.evaluate(() => document.querySelector("#rp").openDetailFrom());
    await until(p, () => document.querySelector("#rp-guide").atGuide(), null, 20000);
    const gfp = guideFrame(p);
    await gfp.waitForFunction((id) => { const e = document.getElementById(id); if (!e) return false; const top = Math.round(e.getBoundingClientRect().top), w = (window.__rpRest ||= { top: null, n: 0 }); if (top !== w.top) { w.top = top; w.n = 0; return false; } return ++w.n >= 8 && top >= -4 && top <= 48; }, d.name, { timeout: 30000, polling: 50 }).catch(() => null);
    const land = await gfp.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), d.name);
    check("a phone: a marked thing's part lands at the top of the guide, drawn as it came near", land >= -4 && land <= 48, `top ${land}`);
    check("a phone: no page errors", !errs.length, errs.slice(0, 3).join(" | "));
    await ctx.close();
  }
  // ---- a revised plan's guide under its video (lib/guide/revised.mjs): its marks and "Show only the changes" work in
  // the frame as on the page, nothing sideways, on a desktop and a phone
  for (const viewport of [{ width: 1280, height: 800 }, { width: 375, height: 812 }]) {
    const ctx = await b.newContext({ viewport }), p = await ctx.newPage(), errs = []; p.on("pageerror", (e) => errs.push(String(e)));
    await p.goto(`http://127.0.0.1:${port}/?project=${PLAN_SLUG}`); await loaded(p);
    await until(p, () => document.querySelector("#rp").hasAttribute("guide-under") && document.querySelector("#rp-guide").ready, null, 30000);
    const gfr = guideFrame(p);
    const before = await gfr.evaluate(() => ({ marks: document.querySelectorAll("main [data-chg]").length, top: document.querySelector("#revised .rv-what")?.textContent || "", pressed: document.querySelector("[data-only]")?.getAttribute("aria-pressed"), folded: document.querySelectorAll(".unchg").length }));
    await gfr.evaluate(() => document.querySelector("[data-only]").click()); await frames(p, 4);
    const after = await gfr.evaluate(() => ({ pressed: document.querySelector("[data-only]").getAttribute("aria-pressed"), folded: document.querySelectorAll(".unchg").length, sw: document.documentElement.scrollWidth, w: innerWidth }));
    check(`a revised plan's guide under its video (${viewport.width} px): its changes marked since the review, Show only the changes off, then folding the rest, nothing sideways`, before.marks > 0 && /^Revised since your review of 28 Sep/.test(before.top) && before.pressed === "false" && !before.folded && after.pressed === "true" && after.folded > 0 && after.sw <= after.w + 1 && !errs.length, JSON.stringify({ before, after, errs }));
    await ctx.close();
  }
  // ---- a phone-wide window with a desktop's scroll bar (round 2's N13: the frame was 375 px of 390): the full width
  {
    const { p, ctx } = await open({ width: 390, height: 844 }); await laidOut(p);
    const w = await p.evaluate(() => ({ frame: Math.round(document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect().width), W: innerWidth, cw: document.documentElement.clientWidth }));
    check("a 390 px window with a desktop's scroll bar: the guide's frame is still the window's full width", w.frame === w.W && w.cw === w.W, JSON.stringify(w));
    await ctx.close();
  }
  // ---- the review page's theme, as the guide's: ?theme= first, then a pick remembered (T), then the system's
  {
    const themeOf = async (opts, q = "") => { const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, ...opts }), p = await ctx.newPage();
      await p.goto(URL0 + q); await loaded(p); await until(p, () => document.querySelector("#rp-guide").ready, null, 30000);
      const gfr = guideFrame(p); await gfr.waitForFunction((t) => (document.documentElement.getAttribute("data-theme") || "light") === t, await p.evaluate(() => document.querySelector("#rp").theme), { timeout: 10000 }).catch(() => null);
      const r = await p.evaluate(() => ({ player: document.querySelector("#rp").theme, page: document.documentElement.dataset.rpTheme, kept: localStorage.getItem("rp:theme") }));
      r.guide = await gfr.evaluate(() => document.documentElement.getAttribute("data-theme") || "light"); await ctx.close(); return r; };
    const sys = await themeOf({ colorScheme: "dark" }), url = await themeOf({ colorScheme: "light" }, "&theme=dark"), over = await themeOf({ colorScheme: "dark" }, "&theme=light");
    check("the review page takes the system's dark (prefers-color-scheme), and ?theme= over it, as the guide does; neither is remembered as a pick", sys.player === "dark" && sys.page === "dark" && sys.guide === "dark" && url.player === "dark" && url.guide === "dark" && over.player === "light" && over.guide === "light" && !sys.kept && !url.kept, JSON.stringify({ sys, url, over }));
  }
  // ---- reduced motion: the small player comes and goes without flying
  {
    const { p, ctx } = await open({ width: 1280, height: 800 }, { reducedMotion: "reduce" });
    await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="guide"]').click());
    await until(p, () => !!document.querySelector("#rp")._mini);
    const m = await miniState(p);
    check("with reduced motion, the small player comes with no animation and the page jumps rather than glides", m.mini && m.moving === 0 && m.fixed, JSON.stringify({ mini: m.mini, moving: m.moving }));
    await ctx.close();
  }
} catch (e) { ok = false; console.error("✗", e.stack || e.message); }
await b.close(); srv.kill();
try { rmSync(T, { recursive: true, force: true }); } catch {}
process.exit(ok ? 0 : 1);
