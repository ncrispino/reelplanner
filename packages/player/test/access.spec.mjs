#!/usr/bin/env node
// Accessible videos: a reviewer who does not know a word should never be lost. On L2 with a synthetic map
// (fixtures/l2-access.json: two videos to watch first, a glossary, glossed ids, walk-throughs on its checks).
//   - "Before you watch" on the poster: a row per video it assumes (title, what it gives, length, watched,
//     a link to it on the review page), Start; one line once every one is watched; ?part=N opens at a part, also
//     when the plan map arrives after the video is ready (a slow network)
//   - watched: 80 % seen marks it (rp:watched:<slug>, the review page's name, also from an older map that has no slug);
//     a row is watched by this browser's mark or by your file (the review server's known.watched), a chapter's row by
//     that chapter played through; it says so at once when another tab marks it; a video not on the page is said, not
//     linked; and a row the page knows nothing of says "Not watched here", not "Not watched yet"
//   - two repos' review pages on one origin (bundle-player's, served as on port 8787): each keeps its own watched marks
//     and comments (under the repo the page names), the viewer's settings carry over, an older page's unscoped keys are
//     neither read nor removed; a page opened for one video carries the built video it builds on (its row's link opens
//     it there, at its chapter), and a row it cannot carry says why ("Not built yet", "Not found here")
//   - Terms (G): the side panel with the beat's words first; a dotted word in the band says what it means
//   - ids never alone: "D-056 · decision: …" in the band; the record says Quick check 1, Choice A12
//   - Walk me through it: open after a wrong answer (the video waits), a button after a right one; walked: true
//   - the guard on Finish: 2 of 3 checks missed → one line; walk through them one by one, or ask the agent
//     to explain again (Request changes, the steps marked unclear); once a round; confusion{} on every review
//   - a word stays dotted until known (D-218): looked up (its card), its defining scene played through, its
//     explaining video watched, or your file says so (the review server's `known`); then it reads plainly, still a
//     click from its meaning, in the player's text and the captions; a storyboard's `terms: x = …` shows on its card
// usage: node packages/player/test/access.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"; import { join } from "node:path"; import { tmpdir } from "node:os"; import { execFileSync } from "node:child_process";
import { launchOpts, testPort, serverUp, ROOT, staticServer, scratchCopy } from "../../../scripts/lib/env.mjs";
import { reviseScope } from "../../../scripts/lib/review-scope.mjs";
import { parseGlossary } from "../../../scripts/lib/terms.mjs";
import { until, when, frames, seeked, asked, pendingIs, movedOn, still as stopped, pageHold } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume", MAP = "packages/player/test/fixtures/l2-access.json";
const map = JSON.parse(readFileSync(join(ROOT, MAP), "utf8"));
const port = testPort(8807);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m, x = "") => { console.log(`${c ? "✓" : "✗"} ${m}${!c && x ? ` — ${String(x).slice(0, 400)}` : ""}`); if (!c) fails.push(m); };
const SHOTS = process.env.RP_SHOTS || null;   // a folder: screenshots of each feature land there
const shot = async (p, name) => { if (SHOTS) await p.screenshot({ path: join(SHOTS, `${name}.png`) }); };
// Space goes on: the sheet goes and the video plays. Wait until it is playing (its time moving), not just asked to: a
// pause sent while the play is still on its way into the frame's page is overtaken by it, and the video ran on
// under whatever came next (the Finish panel, which the next choice's sheet then took down with the record)
const goOn = async (p) => { const t0 = await p.evaluate(() => document.querySelector("#rp").player.currentTime); await p.keyboard.press(" "); await pendingIs(p, null); await movedOn(p, t0); };
const popShown = (p) => until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".tpop").hidden);
// slowMap: the plan map answers that many ms late, as on a slow network (the video is ready before its map)
// known: the page is the review server's own (its meta tag), and GET /api/review answers with what your file knows
// (ctx: a browser context of the spec's own, so a second tab can share the page's storage)
const open = async (extra = "", { clear = true, before = null, slowMap = 0, known = null, ctx = null } = {}) => {
  const p = ctx ? await ctx.newPage() : await b.newPage({ viewport: { width: 1440, height: 1000 } });
  if (known) {
    await p.route((u) => u.pathname === "/api/review", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, sessionWaiting: false, agentCommand: null, inbox: 0, known }) }));
    await p.route((u) => u.pathname === "/packages/player/", async (route) => { const r = await route.fetch(); route.fulfill({ response: r, body: (await r.text()).replace(/<head>/i, '<head><meta name="reelplanning-review-server" content="1">') }); });
  }
  if (slowMap) await p.route((u) => u.pathname.endsWith(MAP.split("/").pop()), async (route) => { await new Promise((r) => setTimeout(r, slowMap)); await route.continue(); });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${MAP}${extra}`);
  if (clear) await p.evaluate(() => { try { localStorage.clear(); } catch {} });
  if (before) await p.evaluate(before);
  await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el.stage?.dataset.ready; }, null, { timeout: 90000 });
  await frames(p);
  return p;
};
const R = (p, fn, arg) => p.evaluate(fn, arg);

try {
  // 0. the page's type and colour (better-visuals step 3): its faces are its own, loaded from beside the player
  //    (packages/player/fonts/faces.json), not whatever the machine has; one --sans; text in three solid inks
  //    that read on every surface; the darker coral (D-142) that passes on the page
  {
    const faces = JSON.parse(readFileSync(join(ROOT, "packages/player/fonts/faces.json"), "utf8")), fams = [...new Set(faces.faces.map((x) => x.family))];
    const lp = await open();
    const f = await R(lp, async (fam) => {
      await Promise.all(fam.map((x) => document.fonts.load(`16px "${x}"`))); await document.fonts.ready;
      const el = document.querySelector("#rp"), cs = getComputedStyle(el);
      return { loaded: [...document.fonts].filter((x) => x.status === "loaded").map((x) => x.family.replace(/"/g, "")),
        files: performance.getEntriesByType("resource").map((e) => new URL(e.name).pathname).filter((p) => /\/packages\/player\/fonts\/[^/]+\.woff2$/.test(p)),
        inHead: !!document.head.querySelector("style[data-rp-fonts]"), sans: cs.getPropertyValue("--sans").trim(), serif: cs.getPropertyValue("--serif").trim(), mono: cs.getPropertyValue("--mono").trim(),
        chrome: getComputedStyle(el.shadowRoot.querySelector('[data-act="finish"]')).fontFamily };
    }, fams);
    ok(fams.every((x) => f.loaded.includes(x)) && f.files.length >= faces.faces.length && f.inHead, `the page's faces (${fams.join(", ")}) are declared in its head and load from packages/player/fonts, not the system`, JSON.stringify(f));
    const first = (v) => String(v).split(",")[0].trim().replace(/["']/g, "");
    ok(first(f.sans) === faces.roles.sans.family && first(f.serif) === faces.roles.serif.family && first(f.mono) === faces.roles.mono.family && first(f.chrome) === faces.roles.sans.family, `--sans, --serif and --mono are the list's, and the chrome's text reads --sans — ${f.sans}`, JSON.stringify(f));
    const src = readFileSync(join(ROOT, "packages/player/reelplanner-player.js"), "utf8"), style = src.slice(src.indexOf("const STYLE = `"), src.indexOf("\n`;\n", src.indexOf("const STYLE = `")));
    const named = (style.match(/Inter|Garamond|JetBrains/g) || []).length, viaSans = (style.match(/var\(--sans\)/g) || []).length;
    ok(named === 0 && viaSans >= 40, `the player's styles name no family: ${viaSans} rules read var(--sans), none spells one out`, `${named} named`);
    // colours, both themes, from the tokens as computed: the accent, and the three inks on every surface text sits on
    const lum = (h) => { const c = h.replace("#", "").match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const mix = (a, b, t) => "#" + [0, 1, 2].map((i) => Math.round(parseInt(a.slice(1 + 2 * i, 3 + 2 * i), 16) * t + parseInt(b.slice(1 + 2 * i, 3 + 2 * i), 16) * (1 - t)).toString(16).padStart(2, "0")).join("");
    const WANT = { light: { accent: "#B8552E" }, dark: { accent: "#D2693F" } };
    for (const theme of ["light", "dark"]) {
      const t = await R(lp, (th) => { const el = document.querySelector("#rp"); el.setTheme(th); const cs = getComputedStyle(el), v = (k) => cs.getPropertyValue(k).trim().toUpperCase(); return Object.fromEntries(["--ground", "--paper", "--tile", "--ink", "--ink-2", "--ink-3", "--accent", "--accent-text", "--right"].map((k) => [k.slice(2), v(k)])); }, theme);
      const surfaces = { ground: t.ground, paper: t.paper, tile: t.tile, "a hovered row": mix(t.ink, t.tile, 0.06) };
      ok(t.accent === WANT[theme].accent && cr(t.accent, t.ground) >= 3 && cr(t["accent-text"], t.ground) >= 4.5 && cr(t["accent-text"], t.tile) >= 4.5, `${theme}: the accent is ${t.accent} (D-142), ${cr(t.accent, t.ground).toFixed(2)}:1 on the ground; at text size ${t["accent-text"]}, ${cr(t["accent-text"], t.tile).toFixed(2)}:1 or more`, JSON.stringify(t));
      const tiers = ["ink", "ink-2", "ink-3"].map((k) => [k, t[k], Math.min(...Object.values(surfaces).map((s) => cr(t[k], s)))]);
      ok(tiers.every(([, c, r]) => /^#[0-9A-F]{6}$/.test(c) && r >= 4.5) && tiers[0][2] > tiers[1][2] && tiers[1][2] > tiers[2][2], `${theme}: text is three solid inks, each 4.5:1 or more on the ground, the paper, the tile and a hovered row — ${tiers.map(([k, c, r]) => `${k} ${c} ${r.toFixed(1)}:1`).join(", ")}`, JSON.stringify(t));
      ok(t.right === t.ink, `${theme}: the right answer to a quick check is ink (--right), not the accent`, JSON.stringify(t));
    }
    await lp.close();
  }
  // 1. before you watch
  let p = await open();
  const card = await R(p, () => { const r = document.querySelector("#rp").shadowRoot, c = r.querySelector(".before");
    return { shown: !c.hidden && getComputedStyle(c).display !== "none", one: c.classList.contains("one"), title: c.querySelector("h5")?.textContent, rows: [...c.querySelectorAll("a.pre")].map((a) => ({ href: a.getAttribute("href"), t: a.querySelector(".pt").textContent, g: a.querySelector(".pg").textContent, l: a.querySelector(".pl").textContent, w: a.querySelector(".pw").textContent })),
      start: c.querySelector(".start")?.textContent, go: getComputedStyle(r.querySelector(".idle .go")).display, meta: r.querySelector(".idle .meta").textContent, len: document.querySelector("#rp").fmt(document.querySelector("#rp").dur()) }; });
  ok(card.shown && !card.one && card.title === "Before you watch" && card.rows.length === 2, "before the first play, the poster shows “Before you watch” with a row per video it assumes", JSON.stringify(card));
  ok(card.rows[0].href === "?project=system" && /whole system/.test(card.rows[0].t) && /^What the parts are/.test(card.rows[0].g) && card.rows[0].l === "7:55" && card.rows[0].w === "Not watched here", "…each row: its title, what it gives you, its length, not watched here (the page knows only this browser and your file), a link to it on the review page", JSON.stringify(card.rows[0]));
  ok(card.rows[1].href === "?project=2026-09-24-memory--walkthrough&part=2" && /chapter 2, Misses and streaks/.test(card.rows[1].t), "…a chapter of a video links to that chapter (D-127: chapter, not part, on screen)", JSON.stringify(card.rows[1]));
  ok(/^Start/.test(card.start) && card.go === "none" && card.meta.startsWith(card.len), "…then Start (Space); the round Play gives way to it, and the length under it is the video's own: the card adds none", JSON.stringify(card));
  await shot(p, "1-before-you-watch");
  await R(p, () => document.querySelector("#rp").focus());   // the player has the keyboard, as after any click in it
  // playing is the video's time moving on from the start Play sends it to, read in the same look as the card: right
  // after a seek and a play, `paused` reads true again for a moment (the frame's word that the seek paused it reaches
  // the player after the play), so a second look after the wait could land in that moment and see a video that plays
  const look = (want) => { const el = document.querySelector("#rp"), s = { playing: !el.player.paused, hidden: getComputedStyle(el.shadowRoot.querySelector(".idle")).display === "none", t: el.player.currentTime }; return !want || (s.playing && s.hidden && s.t >= 0.2) ? s : null; };
  await p.keyboard.press(" ");
  const started = await when(p, look, true) || await R(p, look, false);
  ok(started.playing && started.hidden && started.t >= 0.2, "Space starts the video, and the card goes with the poster", JSON.stringify(started));
  // 80 % reached marks it watched, under its review-page name
  await R(p, () => { const el = document.querySelector("#rp"); el.player.seek(el.dur() * 0.86); });
  await until(p, () => !!localStorage.getItem("rp:watched:l2-access"));
  const seen = await R(p, () => JSON.parse(localStorage.getItem("rp:watched:l2-access") || "null"));
  ok(!!seen?.seen, "80 % seen marks it watched (rp:watched:<slug>)", JSON.stringify(seen));
  await p.close();

  {
    const rowsOf = (q) => R(q, () => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".before .pre")].map((a) => ({ tag: a.tagName, href: a.getAttribute("href"), w: a.querySelector(".pw").textContent, title: a.title, watched: a.hasAttribute("data-watched") })));
    // an older plan map has no slug: its marks go under the review page's name for its folder, never "video"
    const qc = await b.newContext({ viewport: { width: 1440, height: 1000 } }), q = await open("", { ctx: qc });
    const names = await R(q, () => { const el = document.querySelector("#rp"), was = el.planMap.slug, out = [];
      delete el.planMap.slug;
      for (const src of ["../../.reelplanner/plans/2026-09-22-m3-revise-loop/video/index.html", ".reelplanner/plans/2026-09-22-m3-revise-loop/walkthrough-video/index.html", "../../.reelplanner/system-video/index.html", ".reelplanner/explainers/2026-09-29-x/video/index.html", "2026-09-22-m3-revise-loop/index.html"]) {
        Object.defineProperty(el, "src", { configurable: true, get: () => src }); out.push(el.slug); }
      el.markWatched("seen"); const keys = Object.keys(localStorage).filter((k) => k.startsWith("rp:watched:"));
      delete el.src; el.planMap.slug = was; localStorage.removeItem("rp:watched:2026-09-22-m3-revise-loop"); return { out, keys }; });
    ok(names.out.join() === "2026-09-22-m3-revise-loop,2026-09-22-m3-revise-loop--walkthrough,system,2026-09-29-x--explainer,2026-09-22-m3-revise-loop" && names.keys.join() === "rp:watched:2026-09-22-m3-revise-loop",
      "a map with no slug: the video is marked under its review-page name (its plan, --walkthrough, system, --explainer, a bundle's folder), not \"video\"", JSON.stringify(names));
    // watched in another tab of this browser while this page waits on its poster: the row says so at once
    const q2 = await qc.newPage(); await q2.goto(q.url());
    await R(q2, () => localStorage.setItem("rp:watched:system", JSON.stringify({ seen: new Date().toISOString() })));
    await until(q, () => !!document.querySelector("#rp").shadowRoot.querySelector('.before .pre[href="?project=system"]')?.hasAttribute("data-watched"));
    const tab = (await rowsOf(q))[0];
    ok(tab.watched && tab.w === "Watched" && /Watched in this browser on /.test(tab.title), "watched in another tab: the row says Watched without a reload, and when, in its title", JSON.stringify(tab));
    await q2.close();
    // a video not on this page (bundle-player's videos): said, not a link that would open another video
    await R(q, () => { const el = document.querySelector("#rp"); el.setAttribute("videos", "l2-access system"); el.renderBefore(); });
    const offRows = await rowsOf(q);
    ok(offRows[0].tag === "A" && offRows[0].w === "Watched" && offRows[1].tag === "DIV" && !offRows[1].href && offRows[1].w === "Not on this page" && /reelplanner review/.test(offRows[1].title),
      "a video the page does not carry: “Not on this page”, no link, and how to open every video in its title", JSON.stringify(offRows));
    await qc.close();
    // a chapter's row (2026-09-24-memory--walkthrough, chapter 2): that chapter played through is watching it
    const pq = await open("", { before: () => localStorage.setItem("rp:watched:2026-09-24-memory--walkthrough", JSON.stringify({ parts: { 2: "2026-10-01T00:00:00Z" } })) });
    const pr = await rowsOf(pq);
    ok(!pr[0].watched && pr[1].watched && pr[1].w === "Watched", "a chapter's row: that chapter played through marks it watched, not 80 % of the whole video", JSON.stringify(pr));
    // …and playing one through here marks it: its time played adds up while playing; a jump over it does not
    const tp = await R(pq, (c) => { const el = document.querySelector("#rp"), mark = () => JSON.parse(localStorage.getItem("rp:watched:l2-access") || "null")?.parts?.[2] || null; el.player.pause();
      Object.defineProperty(el.player, "paused", { configurable: true, get: () => false });
      el._partT = null; el.trackParts(c.start + 0.2); el.trackParts(c.end - 0.2); const jumped = mark();
      for (let t = c.start + 0.2; t < c.end; t += 0.5) el.trackParts(t);
      delete el.player.paused; return { jumped, played: mark(), sent: el.watchedAll().find((w) => w.video === "l2-access") }; }, map.chapters[1]);
    ok(!tp.jumped && tp.played && JSON.stringify(tp.sent?.parts) === "[2]" && !tp.sent.seen, "a chapter played through here is kept (parts), a jump over it is not, and a review sends it as { video, parts }", JSON.stringify(tp));
    await pq.close();
    // your file knows (the review server's known.watched): watched in another browser, on another port, before a rebuild
    const fq = await open("", { known: { looked: [], watched: ["system", "2026-09-24-memory--walkthrough#part 2"] } });
    await until(fq, () => !!document.querySelector("#rp")._serverKnown);
    const fr = await R(fq, () => { const el = document.querySelector("#rp"), c = el.shadowRoot.querySelector(".before"); return { one: c.classList.contains("one"), text: c.textContent, level: el.level }; });
    ok(fr.one && /— watched\./.test(fr.text) && fr.level === "familiar", "this browser has no mark, your file has both (a chapter as <video>#part N): every one watched, one line, and it starts at “familiar”", JSON.stringify(fr));
    await R(fq, () => { const el = document.querySelector("#rp"); el._beforeOpen = true; el.renderBefore(); });
    const fr2 = await rowsOf(fq);
    ok(fr2.length === 2 && fr2.every((r) => r.watched && r.w === "Watched" && /your file says so/.test(r.title)), "…and each row says where that is known from: your file", JSON.stringify(fr2));
    await fq.close();
  }
  // every video before it watched: one line; ?part=2 opens at part 2
  p = await open("&part=2", { before: () => { for (const s of ["system", "2026-09-24-memory--walkthrough"]) localStorage.setItem(`rp:watched:${s}`, JSON.stringify({ seen: "2026-09-25T00:00:00Z" })); } });
  const one = await R(p, () => { const el = document.querySelector("#rp"), c = el.shadowRoot.querySelector(".before"); return { one: c.classList.contains("one"), text: c.textContent, go: getComputedStyle(el.shadowRoot.querySelector(".idle .go")).display, t: el.player.currentTime }; });
  ok(one.one && /Before you watch:.*— watched\./.test(one.text) && one.go !== "none", "every one watched: the card is one line, and the round Play is back", JSON.stringify(one));
  ok(Math.abs(one.t - map.chapters[1].start) < 1, `?part=2 opens the video at part 2 (${map.chapters[1].start}s)`, one.t);
  // …on a slow network too: the video ready first, its plan map 3 s later (the part is found in the map, so the poster
  // waits for it; it opened at the default poster, 3 s, when the map came after the video, as on a loaded machine)
  {
    const sp = await open("&part=2", { slowMap: 3000 });
    const st = await R(sp, () => document.querySelector("#rp").player.currentTime);
    ok(Math.abs(st - map.chapters[1].start) < 1, `…and with the plan map arriving 3 s after the video is ready (${map.chapters[1].start}s)`, st);
    await sp.close();
  }
  ok(await R(p, () => document.querySelector("#rp").level) === "familiar", "every video on the card watched: it starts at “familiar”, without the scenes for newcomers (videos-you-can-follow step 2)");
  ok(await R(p, () => { const w = document.querySelector("#rp").exportPayload().watched; return w.length === 2 && w.every((x) => x.seen && x.video) && w.map((x) => x.video).join() === "2026-09-24-memory--walkthrough,system"; }), "the review carries what this browser has watched: watched: [{ video, seen }] (D-128)");
  await shot(p, "2-before-you-watch-watched");
  // what fresh eyes left as it is after three rounds (videos-that-make-sense step 2): said on the card, each with the
  // author's reason, even with every video before it watched
  const fl = await R(p, () => { const el = document.querySelector("#rp"); el.planMap.freshEyes = { rounds: 3, left: [{ id: "N1", role: "newcomer", scene: 4, what: 'scene 4 · "the list": which list?', why: "scene 5 says what the list is" }] }; el.renderBefore();
    const c = el.shadowRoot.querySelector(".before"); return { one: c.classList.contains("one"), text: c.querySelector(".fleft")?.textContent || "", rows: c.querySelectorAll(".fleft li").length }; });
  const many = await R(p, () => { const el = document.querySelector("#rp"); el.planMap.freshEyes = { rounds: 3, left: Array.from({ length: 7 }, (_, i) => ({ id: `G${i + 1}`, role: "designer", scene: i + 1, what: `a thing ${i + 1}`, why: `a reason ${i + 1}` })) }; el.renderBefore();
    const c = el.shadowRoot.querySelector(".before .fleft"); const r = { top: c.querySelectorAll(":scope > ul > li").length, more: c.querySelector(".fmore summary")?.textContent, inMore: c.querySelectorAll(".fmore li").length }; el.planMap.freshEyes = null; el.renderBefore(); return r; });
  ok(many.top === 3 && many.more === "4 more" && many.inMore === 4, "…a long list shows three, the rest one click down (“4 more”)", JSON.stringify(many));
  ok(!fl.one && fl.rows === 1 && /Left as it is/.test(fl.text) && /Scene 4 · a newcomer: "the list": which list\?/.test(fl.text) && /Kept: scene 5 says what the list is/.test(fl.text), "what fresh eyes left as it is is on “Before you watch”, with the author's reason", JSON.stringify(fl));
  // D-245: only what is new to the build is listed; the ones already kept, for the same reason, in an earlier round are
  // one line under it, a click away; with nothing new, the card still says so and still holds them
  const ag = await R(p, () => { const el = document.querySelector("#rp"), a = [{ id: "N2", role: "newcomer", scene: 2, what: "scene 2 · why this?", why: "said in scene 3", as: "round 1 · N4" }, { id: "G1", role: "designer", scene: 5, what: "scene 5 · crowded", why: "the real page", as: "round 2 · G3" }];
    el.planMap.freshEyes = { rounds: 3, left: [{ id: "N1", role: "newcomer", scene: 4, what: 'scene 4 · "the list": which list?', why: "scene 5 says what the list is" }], again: a }; el.renderBefore();
    const c = el.shadowRoot.querySelector(".before"), g = c.querySelector(".fagain"), one = { lead: c.querySelector(".fleft .bl").textContent, top: c.querySelectorAll(".fleft > ul > li").length, sum: g?.querySelector("summary")?.textContent, rows: g ? [...g.querySelectorAll("li")].map((x) => x.textContent) : [] };
    el.planMap.freshEyes = { rounds: 3, left: [], again: a }; el.renderBefore();
    const c2 = el.shadowRoot.querySelector(".before"), none = { hidden: c2.hidden, lead: c2.querySelector(".fleft .bl")?.textContent, sum: c2.querySelector(".fagain summary")?.textContent };
    el.planMap.freshEyes = null; el.renderBefore(); return { one, none }; });
  ok(ag.one.top === 1 && /new in this build/.test(ag.one.lead) && ag.one.sum === "and 2 more the author had already kept, for the same reason, in an earlier round" && ag.one.rows.length === 2 && /Kept in round 1 · N4: said in scene 3/.test(ag.one.rows[0]),
    "…only the new ones are listed; the ones kept before are one line, “and 2 more the author had already kept…”, each saying the round", JSON.stringify(ag.one));
  ok(!ag.none.hidden && /Nothing new was kept/.test(ag.none.lead || "") && ag.none.sum === "2 the author had already kept, for the same reason, in an earlier round", "…and with nothing new, the card is still there and holds them", JSON.stringify(ag.none));
  await p.close();

  // 2. terms
  p = await open();
  const f4 = map.frames.find((f) => f.index === 4);
  await R(p, (t) => { const el = document.querySelector("#rp"); el.start(); el.player.seek(t); }, f4.start + 2);
  await until(p, (t) => document.querySelector("#rp").player.currentTime >= t - 0.1, f4.start + 2); await frames(p);
  await R(p, () => document.querySelector("#rp").focus());
  await p.keyboard.press("g"); await until(p, () => { const P = document.querySelector("#rp").shadowRoot.querySelector(".dpanel"); return !P.hidden && P.hasAttribute("data-terms"); }); await frames(p);
  const tp = await R(p, () => { const el = document.querySelector("#rp"), P = el.shadowRoot.querySelector(".dpanel"); return { open: !P.hidden && P.hasAttribute("data-terms"), k: P.querySelector(".k").textContent, heads: [...P.querySelectorAll(".terms h6")].map((h) => h.textContent), first: P.querySelector(".terms dt")?.textContent, paused: el.player.paused, pressed: el.shadowRoot.querySelector(".termsbtn").getAttribute("aria-pressed"), opened: el.termsOpened }; });
  ok(tp.open && tp.k === "Terms" && tp.heads[0] === "In this scene" && /^Label · in the files: tag$/.test(tp.first) && tp.heads.includes("The glossary"), "G opens Terms in the side panel: this scene's words first, each in the word said on screen (D-127: label, not tag) with the files' name after it, then the glossary", JSON.stringify(tp));
  ok(tp.paused && tp.pressed === "true" && tp.opened === 1, "…the video waits behind it, and the opening is counted", JSON.stringify(tp));
  await shot(p, "3-terms-panel");
  await p.keyboard.press("g"); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".dpanel").hidden);
  ok(await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".dpanel").hidden), "G again closes it");

  // 2b. the Terms panel reads plainly (the owner, on it: "the way it has text is not great … less clear, harder to
  // read"). On a real video (the answer-in-the-frame walkthrough, its plan map as built), then with the glossary as
  // it is now (its meanings split for the viewer: said, files):
  //   - no literal asterisks: *visible* is emphasis; `code` is code
  //   - each word's title is its plain word (D-127: Choice, Label, Accepted in a row, Off-plan change, Scene, Answer
  //     bar), never "A call" or "The answer band"; the files' name is a small note, "in the files: call"
  //   - what shows of a meaning (before "More") names no file, folder, attribute or heading; those are under "More"
  //   - the meaning is 15 px or more, line height about 1.5, at most about 62 characters a line, and 7:1 or more
  //     against the panel, in the dark theme and the light one
  {
    const REAL = ".reelplanner/plans/2026-09-25-answer-in-the-frame/walkthrough-video";
    const now = parseGlossary(readFileSync(join(ROOT, ".reelplanner/glossary.md"), "utf8"));
    const FILE = /[\w.~-]*[\w>]\/|\b[\w<>-]+\.(?:md|json|jsonl|mjs|js|sh|html)\b|<[a-z][\w-]*>|data-[\w-]+=|#{2,}\s|--[a-z]/;
    const q = await b.newPage({ viewport: { width: 1440, height: 900 } });
    q.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
    await q.goto(`http://127.0.0.1:${port}/packages/player/?project=${REAL}`);
    await q.evaluate(() => { try { localStorage.clear(); } catch {} }); await q.reload();
    await q.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el.stage?.dataset.ready; }, null, { timeout: 90000 });
    await R(q, () => { const el = document.querySelector("#rp"); el.start?.(); el.player.pause(); el.player.seek(30); }); await seeked(q, 30); await frames(q);
    // every entry as it shows: its title, its note, what shows of its meaning (More closed) and what More holds
    const read = () => R(q, () => {
      const el = document.querySelector("#rp"); if (!el._topen) el.openTerms(); const r = el.shadowRoot;
      return [...r.querySelectorAll(".terms dt")].map((dt) => { const dd = dt.nextElementSibling, more = dd.querySelector(".tmore");
        return { title: dt.firstChild.textContent.trim(), note: dt.querySelector(".fn")?.textContent.replace(/^\s*·\s*/, "").trim() || "", shown: dd.innerText.trim(), more: more ? more.textContent : "", open: !!more?.open, em: dd.querySelectorAll("i").length, code: dd.querySelectorAll("code").length }; });
    });
    const rows = await read();
    const want = { "in the files: call": "Choice", "in the files: tag": "Label", "in the files: streak": "Accepted in a row", "in the files: deviation": "Off-plan change", "in the files: beat": "Scene", "in the files: answer band": "Answer bar" };
    const titled = Object.entries(want).map(([note, t]) => [note, t, rows.find((x) => x.note === note)?.title]);
    ok(titled.every(([, t, got]) => got === t), `titles are the words on screen, the files' name a note by them — ${titled.map(([n, t, g]) => `${g} (${n})`).join(", ")}`, JSON.stringify(titled));
    ok(rows.length >= 30 && !rows.some((x) => /^(A|An|The) /.test(x.title)), `no entry is titled "A call" or "The answer band": ${rows.length} entries, e.g. ${rows.slice(0, 6).map((x) => x.title).join(", ")}`, JSON.stringify(rows.map((x) => x.title)));
    const stars = rows.filter((x) => /\*/.test(x.shown) || /\*/.test(x.more));
    ok(!stars.length && rows.some((x) => x.em >= 3), "no literal asterisks: *visible*, *hard-to-undo* and *close* are emphasis", JSON.stringify(stars.map((x) => x.title)));
    const named = rows.filter((x) => Object.values(want).includes(x.title) || x.title === "Step");
    const leaky = named.filter((x) => FILE.test(x.shown));
    ok(!leaky.length && named.length === 7 && rows.find((x) => x.title === "Choice")?.more.includes("walkthrough.md") && rows.find((x) => x.title === "Answer bar")?.more.includes('data-band="bottom"') && /### Step N/.test(rows.find((x) => x.title === "Step")?.more || ""),
      `what shows of choice, label, accepted in a row, off-plan change, scene, answer bar and step names no file; "one row in walkthrough.md", data-band="bottom" and "### Step N in plan.md" are under More`, JSON.stringify(leaky.map((x) => [x.title, x.shown])));
    ok(!/^The answer bar\./.test(rows.find((x) => x.title === "Answer bar")?.shown || ""), "a meaning does not open by saying the title again (\"The answer bar.\")");
    // the glossary as it is now: every entry, what shows of it names no file
    await R(q, (g) => { const el = document.querySelector("#rp"); el.closeTerms(); el.planMap.glossary = g.map((x) => ({ ...x, definedIn: el.planMap.glossary.find((y) => y.term === x.term)?.definedIn })); }, now);
    const rows2 = await read();
    const leak2 = rows2.filter((x) => FILE.test(x.shown));
    ok(now.every((g) => typeof g.said === "string") && !leak2.length && rows2.length >= 38 && rows2.filter((x) => x.code).length >= 8, `with the glossary as it is now (${rows2.length} entries), what shows of every meaning names no file, and where the files say it is under More, as code (${rows2.filter((x) => x.code).length} entries)`, JSON.stringify(leak2.map((x) => [x.title, x.shown])));
    ok(rows2.every((x) => !/\*|`/.test(x.shown + x.more)), "…and no asterisk or backtick shows anywhere", JSON.stringify(rows2.filter((x) => /\*|`/.test(x.shown + x.more)).map((x) => x.title)));
    // size, line height, measure and contrast, from the rendered styles, in both themes
    const measure = () => R(q, () => {
      const el = document.querySelector("#rp"), r = el.shadowRoot; r.querySelectorAll(".terms .tmore").forEach((d) => { d.open = true; });
      const rgb = (c) => { const m = String(c).match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }; };
      const over = (f, bg) => ({ r: f.r * f.a + bg.r * (1 - f.a), g: f.g * f.a + bg.g * (1 - f.a), b: f.b * f.a + bg.b * (1 - f.a) });
      const lum = (c) => { const ch = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b); };
      const ground = rgb(getComputedStyle(r.querySelector(".dpanel")).backgroundColor);
      const ratio = (x) => { const fg = over(rgb(getComputedStyle(x).color), ground), a = lum(fg), b = lum(ground); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
      const body = [...r.querySelectorAll(".terms .tlead, .terms .tmore p:not(.tfiles)")];
      const zero = (() => { const s = document.createElement("span"); s.textContent = "0".repeat(62); s.style.font = getComputedStyle(body[0]).font; s.style.position = "absolute"; s.style.whiteSpace = "nowrap"; r.querySelector(".terms").appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; })();
      const title = getComputedStyle(r.querySelector(".terms dt"));
      const out = { n: body.length, minSize: Math.min(...body.map((x) => parseFloat(getComputedStyle(x).fontSize))), lh: body.map((x) => parseFloat(getComputedStyle(x).lineHeight) / parseFloat(getComputedStyle(x).fontSize)), widest: Math.max(...body.map((x) => x.getBoundingClientRect().width)), ch62: zero, minRatio: Math.min(...body.map(ratio)), titleSize: parseFloat(title.fontSize), titleSerif: /Garamond|Georgia|serif/.test(title.fontFamily), bodySans: /Inter|sans/.test(getComputedStyle(body[0]).fontFamily) };
      r.querySelectorAll(".terms .tmore").forEach((d) => { d.open = false; });
      return { ...out, lhMin: Math.min(...out.lh), lhMax: Math.max(...out.lh), lh: undefined };
    });
    for (const theme of ["dark", "light"]) {
      await R(q, (t) => { const el = document.querySelector("#rp"); el.setTheme(t); if (!el._topen) el.openTerms(); }, theme); await until(q, (t) => document.querySelector("#rp").getAttribute("theme") === t && !!document.querySelector("#rp")._topen, theme); await frames(q);
      const m = await measure();
      ok(m.n >= 38 && m.minSize >= 15 && m.lhMin >= 1.4 && m.lhMax <= 1.7 && m.widest <= m.ch62 + 2, `${theme}: the meanings (${m.n} blocks) are ${m.minSize} px or more, line height ${m.lhMin.toFixed(2)}–${m.lhMax.toFixed(2)}, lines at most ${Math.round(m.widest)} px (62 characters: ${Math.round(m.ch62)} px)`, JSON.stringify(m));
      ok(m.minRatio >= 7, `${theme}: the meanings are ${m.minRatio.toFixed(1)}:1 against the panel (7:1 or more)`, JSON.stringify(m));
      ok(m.titleSerif && m.bodySans && m.titleSize > m.minSize, `${theme}: the title in the serif (${m.titleSize} px) over the meaning in the sans`, JSON.stringify(m));
      await shot(q, `3b-terms-${theme}`);
    }
    // a word's card (a dotted word in the player's text, or a caption word) reads the same way
    await R(q, () => { const el = document.querySelector("#rp"); el.closeTerms(); const s = document.createElement("span"); s.className = "term"; s.dataset.term = "tag"; el.shadowRoot.querySelector(".nowline").appendChild(s); el.showTerm(s); });
    const card = await R(q, () => { const t = document.querySelector("#rp").shadowRoot.querySelector(".tpop"); return { shown: !t.hidden, text: t.innerText, size: parseFloat(getComputedStyle(t).fontSize), title: t.querySelector("b")?.firstChild.textContent }; });
    ok(card.shown && card.title === "Label" && /in the files: tag/.test(card.text) && !/\*/.test(card.text) && card.size >= 15, `a word's card: "Label", in the files: tag, its first sentence, ${card.size} px`, JSON.stringify(card));
    await q.close();
  }

  // 3. ids never alone, dotted words, and the walk-through after a wrong answer
  const k1 = map.quizzes[0], k2 = map.quizzes[1], k3 = map.quizzes[2];
  await R(p, (q) => { const el = document.querySelector("#rp"); el.player.pause(); el.askQuiz(q); }, k1);
  await asked(p, k1.id); await frames(p);
  const band = await R(p, () => { const r = document.querySelector("#rp").shadowRoot, q = r.querySelector(".decision .q"); return { text: q.textContent, terms: [...q.querySelectorAll(".term")].map((x) => x.textContent), k: r.querySelector(".decision .k").textContent }; });
  ok(/D-056 · decision: The manifest is written before any part/.test(band.text), "an id in the band is never alone: “D-056 · decision: …”", band.text);
  ok(band.terms.includes("manifest") && /^Quick check 1 · step 2/.test(band.k), "…a glossary word in it is dotted, and the check is named “Quick check 1”", JSON.stringify(band));
  await p.locator("#rp").locator(".decision .q .term").first().click(); await popShown(p);
  const pop = await R(p, () => { const t = document.querySelector("#rp").shadowRoot.querySelector(".tpop"); return { shown: !t.hidden, text: t.textContent }; });
  ok(pop.shown && /^Manifest/.test(pop.text) && /which parts of an upload have arrived/.test(pop.text), "a click on a dotted word says what it means", JSON.stringify(pop));
  // glossary[].definedIn: where the word is explained, and a link that plays that scene (videos-you-can-follow step 1)
  await p.keyboard.press("Escape");
  await R(p, () => { const el = document.querySelector("#rp"), g = el.planMap.glossary.find((x) => x.term === "The manifest"); g.definedIn = { video: "system", frame: 25, title: "The manifest", start: 312.4, chapter: 4, chapterTitle: "The build loop" }; });
  await p.locator("#rp").locator(".decision .q .term").first().click(); await until(p, () => { const t = document.querySelector("#rp").shadowRoot.querySelector(".tpop"); return !t.hidden && !!t.querySelector("a.lnk"); });
  const pop2 = await R(p, () => { const t = document.querySelector("#rp").shadowRoot.querySelector(".tpop"); return { text: t.textContent, href: t.querySelector("a.lnk")?.getAttribute("href") }; });
  ok(/Explained in the system video, chapter 4 · The build loop\./.test(pop2.text) && pop2.href === "?project=system&t=312.4", "…where it is explained (“the system video, chapter 4”), with a link that plays that scene", JSON.stringify(pop2));
  await shot(p, "4-dotted-term");
  await p.keyboard.press("Escape");
  await R(p, () => document.querySelector("#rp").answerQuiz("a"));   // wrong
  await until(p, () => !!document.querySelector("#rp").quizzes.k1); await frames(p);
  const w1 = await R(p, () => { const el = document.querySelector("#rp"), r = el.shadowRoot, w = r.querySelector(".decision .walk"); return { shown: !w.hidden && getComputedStyle(w).display !== "none", text: w.textContent, hint: r.querySelector(".decision .hint").textContent, walked: el.quizzes.k1.walked, fbTerms: [...r.querySelectorAll(".decision .feedback .term")].map((x) => x.textContent) }; });
  ok(w1.shown && /network drops/.test(w1.text) && w1.walked === true, "a wrong answer: “Walk me through it” opens with its worked example, and walked: true is recorded", JSON.stringify(w1));
  ok(w1.fbTerms.includes("tag"), "…the explanation's glossary words are dotted too", JSON.stringify(w1.fbTerms));
  await shot(p, "5-walk-me-through");
  await pageHold(p, 5000);
  const still = await R(p, () => { const el = document.querySelector("#rp"); return { on: el.shadowRoot.querySelector(".decision").classList.contains("on"), paused: el.player.paused, hint: el.shadowRoot.querySelector(".decision .hint").textContent }; });
  ok(still.on && still.paused && /Waits while you read/.test(still.hint), "…and the video waits while it is read: no countdown", JSON.stringify(still));
  await goOn(p);
  // a right answer: the walk-through is one button away
  await R(p, (q) => { const el = document.querySelector("#rp"); el.player.pause(); el.askQuiz(q); }, k2);
  await asked(p, k2.id); await frames(p);
  const band2 = await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".decision .q").textContent);
  ok(/A12 · choice: complete returns 409/.test(band2), "a call's id is said with what it chose: “A12 · choice: …”", band2);
  await R(p, () => document.querySelector("#rp").answerQuiz("a"));   // right
  await until(p, () => !!document.querySelector("#rp").quizzes.k2); await frames(p);
  const w2 = await R(p, () => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { walk: r.querySelector(".decision .walk").hidden, btn: !r.querySelector(".decision .walkbtn").hidden, walked: !!el.quizzes.k2.walked }; });
  ok(w2.walk && w2.btn && !w2.walked, "a right answer: the walk-through is folded, one button away, and not recorded as opened", JSON.stringify(w2));
  await p.locator("#rp").locator('.decision [data-act="walk"]').click(); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".decision .walk").hidden);
  ok(await R(p, () => { const el = document.querySelector("#rp"); return !el.shadowRoot.querySelector(".decision .walk").hidden && el.quizzes.k2.walked === true; }), "…opened, it shows, and walked: true is recorded");
  await goOn(p);
  await R(p, (q) => { const el = document.querySelector("#rp"); el.player.pause(); el.askQuiz(q); }, k3);
  await R(p, () => document.querySelector("#rp").answerQuiz("a"));   // wrong, and it has no walk-through
  await until(p, () => !!document.querySelector("#rp").quizzes.k3); await frames(p);
  ok(await R(p, () => { const r = document.querySelector("#rp").shadowRoot; return r.querySelector(".decision .walk").hidden && r.querySelector(".decision .walkbtn").hidden; }), "a check with no walk-through shows neither");
  await goOn(p);
  // the record: named, never a bare id
  await R(p, (a) => { const el = document.querySelector("#rp"); el.player.pause(); el.askAutonomy(a); }, map.autonomy[0]);
  await asked(p, map.autonomy[0].id); await frames(p);
  const callK = await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".decision .k").textContent);
  await R(p, () => document.querySelector("#rp").judgeAutonomy("accept"));
  await until(p, (id) => !!document.querySelector("#rp").autonomy[id], map.autonomy[0].id); await frames(p);
  const rec = await R(p, () => { const r = document.querySelector("#rp").shadowRoot; return { checks: [...r.querySelectorAll(".decisions .dec .k")].map((x) => x.textContent), calls: [...r.querySelectorAll(".autolog .dec .k")].map((x) => x.textContent) }; });
  ok(rec.checks.some((k) => /^Quick check 1 · step 2/.test(k)) && rec.checks.some((k) => /^Quick check 3 · step 5/.test(k)) && rec.calls.some((k) => /^Choice A12 · step 3/.test(k)) && /^The agent's choice A12 · step 3/.test(callK), "the record says “Quick check 1”, “Choice A12”, never a bare k1 or a12", JSON.stringify({ rec, callK }));

  // 4. the guard on Finish. The choice just accepted goes on at once, and the moment it plays meets that choice again
  // (it was asked by hand, never met): met after Finish, its sheet took the record, and the panel in it, back down.
  // So: stopped, and still (the video's last moment, and any question it meets, landed), then nothing left up.
  await R(p, () => document.querySelector("#rp").player.pause());
  await stopped(p);
  await R(p, () => document.querySelector("#rp").giveWay());
  await pendingIs(p, null);
  await p.locator("#rp").locator('[data-act="finish"]').click(); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden); await frames(p);
  const g = await R(p, () => { const h = document.querySelector("#rp").shadowRoot.querySelector(".handoff"), gd = h.querySelector(".guard"); return { shown: !!gd, text: gd?.textContent || "", before: gd ? gd.nextElementSibling?.classList.contains("verdict") : false }; });
  ok(g.shown && /^You missed 2 of 3 quick checks\./.test(g.text) && /Walk me through them/.test(g.text) && /Ask the agent to explain it again/.test(g.text) && /or approve as is/.test(g.text) && g.before, "2 of 3 checks missed: one quiet line above the verdict, with its three ways on", JSON.stringify(g));
  await shot(p, "6-guard-on-finish");
  await p.locator("#rp").locator('.handoff [data-act="guard-walk"]').click(); await asked(p, "k1"); await frames(p);
  const gw1 = await R(p, () => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { handoff: r.querySelector(".handoff").hidden, id: el._pendingDecision?.q?.id, walk: !r.querySelector(".decision .walk").hidden, hint: r.querySelector(".decision .hint").textContent }; });
  ok(gw1.handoff && gw1.id === "k1" && gw1.walk && /next check you missed/.test(gw1.hint), "“Walk me through them”: the first missed check, its walk-through open, Continue to the next", JSON.stringify(gw1));
  await p.locator("#rp").locator('.decision [data-act="quiz-go"]').click(); await asked(p, "k3"); await frames(p);
  const gw2 = await R(p, () => { const el = document.querySelector("#rp"); return { id: el._pendingDecision?.q?.id, hint: el.shadowRoot.querySelector(".decision .hint").textContent }; });
  ok(gw2.id === "k3" && /back to Finish/.test(gw2.hint), "…then the next one, the last", JSON.stringify(gw2));
  await p.locator("#rp").locator('.decision [data-act="quiz-go"]').click(); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden); await frames(p);
  const gw3 = await R(p, () => { const r = document.querySelector("#rp").shadowRoot, h = r.querySelector(".handoff"); return { open: !h.hidden, guard: !!h.querySelector(".guard") }; });
  ok(gw3.open && !gw3.guard, "…then Finish again, the line gone: it is shown once a round", JSON.stringify(gw3));
  // the other way on, in a round of its own
  await R(p, () => { const el = document.querySelector("#rp"); el._guardDoneMem = false; localStorage.removeItem(`reelplanning:annotations:${el.src}:guard`); el.showHandoff({ finishing: true }); });
  await until(p, () => !!document.querySelector("#rp").shadowRoot.querySelector('.handoff [data-act="guard-ask"]'));
  await p.locator("#rp").locator('.handoff [data-act="guard-ask"]').click(); await until(p, () => document.querySelector("#rp").verdict === "changes"); await frames(p);
  const ga = await R(p, () => { const el = document.querySelector("#rp"), h = el.shadowRoot.querySelector(".handoff"); return { verdict: el.verdict, pressed: h.querySelector('[data-review="changes"]')?.getAttribute("aria-pressed"), text: h.querySelector('[data-review="changes"] span')?.textContent, guard: !!h.querySelector(".guard"), unclear: Object.entries(el.quizzes).filter(([, q]) => q.unclear).map(([id]) => id).sort() }; });
  ok(ga.verdict === "changes" && ga.pressed === "true" && ga.unclear.join() === "k1,k3" && /the 2 quick checks you missed again/.test(ga.text) && !ga.guard, "“Ask the agent to explain it again”: Request changes, the missed checks marked unclear, and the verdict says so", JSON.stringify(ga));
  await shot(p, "7-guard-asked");
  const ex = await R(p, () => new Promise((res) => { const el = document.querySelector("#rp"); el.addEventListener("annotations", (e) => res(e.detail), { once: true }); el.export(); }));
  const c = ex.confusion || {};
  ok(c.wrongChecks === 2 && c.walked === 2 && c.termsOpened >= 2 && Number.isInteger(c.rewinds) && Number.isInteger(c.watchedPct), "the review carries confusion: { wrongChecks, walked, termsOpened, rewinds, watchedPct }", JSON.stringify(c));
  ok(Array.isArray(c.termsLookedUp) && c.termsLookedUp.includes("manifest") && new Set(c.termsLookedUp).size === c.termsLookedUp.length, "…and termsLookedUp: each word whose meaning was opened, by its key, once (videos-you-can-follow step 3)", JSON.stringify(c.termsLookedUp));
  const scope = reviseScope(ex, { map });
  const why = scope.steps.flatMap((s) => s.reasons.map((r) => ({ step: s.step, kind: r.kind })));
  ok(why.some((r) => r.step === 2 && r.kind === "unclear") && why.some((r) => r.step === 5 && r.kind === "unclear") && !why.some((r) => r.kind === "quiz-missed"), "…and the revise reads each marked step as “explain this more”", JSON.stringify(why));
  await p.close();

  // 5. a glossary word in the frame's captions is underlined; a click pauses the video and shows what it means, by the word
  p = await open();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); el.wireCaptions(); return !!el.player.iframeElement.contentDocument.querySelector("[data-rp-term]"); }, null, { timeout: 20000, polling: 500 }).catch(() => {});
  const marked = await R(p, () => { const d = document.querySelector("#rp").player.iframeElement.contentDocument; return [...d.querySelectorAll("[data-rp-term]")].map((x) => [x.textContent, x.dataset.rpTerm]); });
  ok(marked.length > 0 && marked.every(([w, k]) => w && k), `the captions' glossary words are marked — ${marked.length}, e.g. ${JSON.stringify(marked.slice(0, 3))}`);
  let at = null;
  for (let t = 1; t < 200 && !at; t += 1.5) {
    await R(p, (x) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(x); }, t); await seeked(p, t); await frames(p);
    at = await R(p, () => { const el = document.querySelector("#rp"), d = el.player.iframeElement.contentDocument, win = d.defaultView, fr = el.player.iframeElement.getBoundingClientRect(), sx = fr.width / win.innerWidth;
      const seen = (e) => { for (let n = e; n && n !== d.documentElement; n = n.parentElement) { const cs = win.getComputedStyle(n); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.5) return false; } return true; };
      const w = [...d.querySelectorAll("[data-rp-term]")].find(seen); if (!w) return null; const r = w.getBoundingClientRect(); return { x: fr.left + (r.left + r.width / 2) * sx, y: fr.top + (r.top + r.height / 2) * sx, key: w.dataset.rpTerm, word: w.textContent, deco: win.getComputedStyle(w).textDecorationStyle }; });
  }
  ok(!!at && at.deco === "dotted", `a caption with a glossary word, dotted — ${JSON.stringify(at)}`);
  if (at) {
    const t0 = await R(p, () => { const el = document.querySelector("#rp"); el.player.play(); return el.player.currentTime; }); await until(p, (t0) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime > t0 + 0.05; }, t0);
    // stopped: held, its time still (the player's paused mirrors the frame's last word on it, and a word sent while
    // it played can land after the pause): the click is on a held video, and the video waits after it, its time still
    await R(p, () => document.querySelector("#rp").player.pause()); await stopped(p);
    await p.mouse.click(at.x, at.y); await popShown(p); await frames(p); await stopped(p);
    const cp = await R(p, () => { const el = document.querySelector("#rp"), t = el.shadowRoot.querySelector(".tpop"), bb = t.getBoundingClientRect(); return { shown: !t.hidden, text: t.textContent, paused: el.player.paused, top: bb.bottom, keys: el.confusion().termsLookedUp }; });
    ok(cp.shown && cp.paused && cp.top <= at.y && cp.keys.includes(at.key), `a click on “${at.word}” in the captions shows what it means, just above the word, and the video waits — "${cp.text.slice(0, 60)}"`, JSON.stringify(cp));
    // D-218: looked up, the word is known: its caption words read plainly now, and a click still says what it means
    const kc = await R(p, (k) => { const el = document.querySelector("#rp"), d = el.player.iframeElement.contentDocument, ws = [...d.querySelectorAll(`[data-rp-term="${k}"]`)];
      return { n: ws.length, known: ws.every((w) => "rpKnown" in w.dataset), deco: ws.map((w) => d.defaultView.getComputedStyle(w).textDecorationLine), other: [...d.querySelectorAll("[data-rp-term]")].filter((w) => w.dataset.rpTerm !== k).map((w) => [w.dataset.rpTerm, "rpKnown" in w.dataset]) }; }, at.key);
    ok(kc.n > 0 && kc.known && kc.deco.every((x) => x === "none") && kc.other.every(([, known]) => !known), `…and once looked up, “${at.word}” is known: not underlined in the captions (every place it is said), the other words still are`, JSON.stringify(kc));
    await p.keyboard.press("Escape");
    await p.mouse.click(at.x, at.y); await popShown(p);
    ok(await R(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".tpop").hidden), "…still a click away from its meaning");
  }
  await p.close();

  // 6. a word stays underlined until known (D-218): looked up, its defining scene watched, or its video watched
  p = await open();
  await R(p, (q) => { const el = document.querySelector("#rp"); el.player.pause(); el.askQuiz(q); }, map.quizzes[0]);
  await asked(p, map.quizzes[0].id); await frames(p);
  const kn0 = await R(p, () => { const r = document.querySelector("#rp").shadowRoot, t = r.querySelector('.decision .q .term[data-term="manifest"]'); return { known: t?.classList.contains("known"), deco: t && getComputedStyle(t).textDecorationLine }; });
  ok(kn0.known === false && /underline/.test(kn0.deco), "a word not yet known is dotted", JSON.stringify(kn0));
  await p.locator("#rp").locator('.decision .q .term[data-term="manifest"]').click(); await popShown(p); await frames(p);
  const kn1 = await R(p, () => { const r = document.querySelector("#rp").shadowRoot, t = r.querySelector('.decision .q .term[data-term="manifest"]'); return { known: t.classList.contains("known"), deco: getComputedStyle(t).textDecorationLine, pop: !r.querySelector(".tpop").hidden, stored: JSON.parse(localStorage.getItem("rp:terms:known") || "[]") }; });
  ok(kn1.known && kn1.deco === "none" && kn1.pop && kn1.stored.includes("manifest"), "looked up, it is known: shown plainly at once, its card still open, and this browser keeps it (rp:terms:known)", JSON.stringify(kn1));
  await p.close();
  // the next page (a new browser context here, so the mark is carried over as this browser would keep it)
  p = await open("", { before: (k) => localStorage.setItem("rp:terms:known", JSON.stringify(["manifest"])) });
  await R(p, (q) => { const el = document.querySelector("#rp"); el.player.pause(); el.askQuiz(q); }, map.quizzes[0]);
  await asked(p, map.quizzes[0].id); await frames(p);
  const kn2 = await R(p, () => { const el = document.querySelector("#rp"), r = el.shadowRoot, t = r.querySelector('.decision .q .term[data-term="manifest"]'); return { known: t?.classList.contains("known"), inTerms: el.termList().some((x) => x.key === "manifest") }; });
  ok(kn2.known && kn2.inTerms, "…in the next video too: plain, still in Terms", JSON.stringify(kn2));
  await p.locator("#rp").locator('.decision .q .term[data-term="manifest"]').click(); await popShown(p); await frames(p);
  ok(await R(p, () => /which parts of an upload have arrived/.test(document.querySelector("#rp").shadowRoot.querySelector(".tpop").textContent)), "…and a click on it still says what it means");
  await p.keyboard.press("Escape");
  // its defining scene played to its end (frame 4 defines "tag"); a jump over it is not watching it
  const f4d = map.frames.find((f) => f.index === 4);
  const sc = await R(p, (f) => { const el = document.querySelector("#rp"), tag = () => el.isKnown(el.termFor("tag")); el.player.pause(); const before = tag();
    Object.defineProperty(el.player, "paused", { configurable: true, get: () => false });
    el._defT = null; el.trackDefined(f.start + 0.2); el.trackDefined(f.start + f.durationSeconds - 0.2); const jumped = tag();
    for (let t = f.start + 0.2; t < f.start + f.durationSeconds; t += 0.5) el.trackDefined(t);
    delete el.player.paused; return { before, jumped, played: tag() }; }, f4d);
  ok(!sc.before && !sc.jumped && sc.played, "a word whose scene was played through is known; a seek over the scene is not watching it", JSON.stringify(sc));
  // its definedIn video marked watched (D-128)
  const dw = await R(p, () => { const el = document.querySelector("#rp"), g = el.planMap.glossary.find((x) => x.forms[0] === "streak"); g.definedIn = { video: "system", frame: 12, start: 100 }; const before = el.isKnown(el.termFor("streak")); localStorage.setItem("rp:watched:system", JSON.stringify({ seen: "2026-09-27T00:00:00Z" })); return { before, after: el.isKnown(el.termFor("streak")) }; });
  ok(!dw.before && dw.after, "a word whose explaining video is marked watched is known", JSON.stringify(dw));
  // what your file across repos says (GET /api/review's known, on the local review page)
  const sv = await R(p, () => { const el = document.querySelector("#rp"); const before = el.isKnown(el.termFor("call")); el._serverKnown = { looked: ["call"], watched: [] }; el.syncKnown(); return { before, after: el.isKnown(el.termFor("call")) }; });
  ok(!sv.before && sv.after, "a word your file says you looked up (you.jsonl, via the review server) is known", JSON.stringify(sv));
  // a storyboard's own meaning (terms: x = …, plan-map termMeanings) shows on its card like a glossary one
  const own = await R(p, () => { const el = document.querySelector("#rp"); el.planMap.terms = [...el.planMap.terms, "branch"]; el.planMap.termMeanings = { branch: "A line of work kept apart until it is merged." }; const s = document.createElement("span"); s.className = "term"; s.dataset.term = "branch"; el.shadowRoot.querySelector(".nowline").appendChild(s); el.showTerm(s); return el.shadowRoot.querySelector(".tpop").textContent; });
  ok(/^branch/i.test(own) && /A line of work kept apart until it is merged/.test(own), "a storyboard's `terms: branch = …` shows on its card like a glossary meaning", own);
  await p.close();

  // a map with none of this (every older video): no card, no Terms button, the old words
  p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=packages/player/test/fixtures/l2-quiz-autonomy.json`);
  await p.waitForFunction(() => document.querySelector("#rp")?.planMap && document.querySelector("#rp").stage?.dataset.ready, null, { timeout: 90000 });
  const old = await R(p, () => { const r = document.querySelector("#rp").shadowRoot; return { card: r.querySelector(".before").hidden, terms: r.querySelector(".termsbtn").hidden }; });
  ok(old.card && old.terms, "a video built before this: no card and no Terms button", JSON.stringify(old));
  await p.close();

  // ════ two repos on one port, as `reelplanner review` serves every repo on 8787: each page bundle-player packs names
  // its repo, and the player keeps a review's record and its watched marks under it; the viewer's own settings carry
  // over. Repo A's page is opened for one plan video (p1), which builds on A's system video at chapter 2 (built: carried
  // on the page), a plan not built yet (p0) and a video A does not have (gone). Both repos have a video called "system".
  {
    const T = mkdtempSync(join(tmpdir(), "rp-two-repos-")), SERVE = join(T, "serve"), rpA = join(T, "ra", ".reelplanner"), rpB = join(T, "rb", ".reelplanner");
    const copy = (to) => { scratchCopy(join(ROOT, project), to); return to; };
    const sysA = copy(join(rpA, "system-video")), p1 = copy(join(rpA, "plans", "p1", "video")), sysB = copy(join(rpB, "system-video"));
    for (const r of [rpA, rpB]) writeFileSync(join(r, "decisions.json"), "[]");
    mkdirSync(join(rpA, "plans", "p0"), { recursive: true }); writeFileSync(join(rpA, "plans", "p0", "plan.md"), "# Planned, not built yet\n");
    const remap = (d, f) => { const m = JSON.parse(readFileSync(join(d, "plan-map.json"), "utf8")); f(m); writeFileSync(join(d, "plan-map.json"), JSON.stringify(m)); return m; };
    remap(sysA, (m) => { m.title = "System A"; m.slug = "system"; }); remap(sysB, (m) => { m.title = "System B"; m.slug = "system"; });
    const pm = remap(p1, (m) => { m.title = "P1"; m.slug = "p1"; m.prerequisites = [
      { video: "system", part: 2, partTitle: m.chapters[1].title, title: "System A", gives: "what the parts are", seconds: 60, terms: [], found: true },
      { video: "p0", title: "Plan zero", gives: "the plan before this one", terms: [], found: true },
      { video: "gone", title: "Gone", gives: "a video this repo does not have", terms: [], found: true }]; });
    const pack = (out, dir) => execFileSync(process.execPath, [join(ROOT, "scripts/bundle-player.mjs"), out, dir], { encoding: "utf8" });
    pack(join(SERVE, "a"), p1); pack(join(SERVE, "b"), sysB);
    const port2 = port + 1, srv2 = staticServer(port2, { dir: SERVE });
    await serverUp(port2, { child: srv2 });
    const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
    const ready = (q) => q.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el.stage?.dataset.ready; }, null, { timeout: 90000 });
    const at = async (path) => { const q = await ctx.newPage(); q.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160))); await q.goto(`http://127.0.0.1:${port2}/${path}`); await ready(q); return q; };
    try {
      // what a page made before pages named their repo left on this origin (it names no repo): read by neither, kept
      let q = await ctx.newPage(); await q.goto(`http://127.0.0.1:${port2}/a/`);
      await R(q, () => { localStorage.clear(); localStorage.setItem("rp:watched:system", JSON.stringify({ seen: "2026-01-01T00:00:00Z" })); localStorage.setItem("reelplanning:annotations:system/index.html", JSON.stringify([{ id: "old", kind: "note", t: 1, comment: "an older page's comment" }])); });
      await q.close();
      q = await at("a/?project=p1");
      const rows = await R(q, () => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".before .pre")].map((a) => ({ tag: a.tagName, href: a.getAttribute("href"), w: a.querySelector(".pw").textContent, title: a.title })));
      ok(rows.length === 3 && rows[0].tag === "A" && rows[0].href === "?project=system&part=2" && rows[0].w === "Not watched here",
        "a page opened for one video carries the built video it builds on: its row links to it, at its chapter (an older page's unscoped mark is not read)", JSON.stringify(rows[0]));
      ok(rows[1].tag === "DIV" && rows[1].w === "Not built yet" && /has not been made/.test(rows[1].title) && rows[2].tag === "DIV" && rows[2].w === "Not found here" && /no video called gone/.test(rows[2].title),
        "…one not built yet, and one this repo has no video of, say so instead of “Not on this page”", JSON.stringify(rows.slice(1)));
      await Promise.all([q.waitForURL(/project=system/), R(q, () => document.querySelector("#rp").shadowRoot.querySelector(".before a.pre").click())]);
      await ready(q);
      const opened = await R(q, () => { const el = document.querySelector("#rp"); return { src: el.getAttribute("src"), title: el.planMap.title, t: el.player.currentTime, repo: el.repo }; });
      ok(opened.src === "system/index.html" && opened.title === "System A" && Math.abs(opened.t - pm.chapters[1].start) < 1, `…and the link opens it on the same page, at chapter 2 (${pm.chapters[1].start}s)`, JSON.stringify(opened));
      // repo A: its system video watched, a comment on it; the viewer mutes the sound and turns the quick checks off
      await R(q, () => { const el = document.querySelector("#rp"); el.markWatched("seen"); el.annotations = [{ id: "a1", kind: "note", t: 2, comment: "repo A's comment" }]; el.persist(); el.setMuted(true); el.setChecks(false); });
      await q.close();
      q = await at("b/?project=system");
      const bs = await R(q, () => { const el = document.querySelector("#rp"); return { title: el.planMap.title, repo: el.repo, watched: !!el.watchedOf("system"), sent: el.watchedAll().map((w) => w.video), ann: el.annotations.map((a) => a.comment), muted: el.muted, checks: el.checksOn, keys: Object.keys(localStorage).sort() }; });
      ok(bs.title === "System B" && bs.repo && bs.repo !== opened.repo && !bs.watched && !bs.sent.length && !bs.ann.length,
        "repo B's page on the same port: its own “system” is not watched, carries none of repo A's comments, and a review sends no watched video of A's", JSON.stringify(bs));
      ok(bs.muted && !bs.checks, "…while the viewer's own settings (sound off, quick checks off) are the same on every page", JSON.stringify({ muted: bs.muted, checks: bs.checks }));
      ok(bs.keys.includes(`rp@${opened.repo}:watched:system`) && bs.keys.includes(`reelplanning@${opened.repo}:annotations:system/index.html`) && bs.keys.includes("rp:watched:system") && bs.keys.includes("reelplanning:annotations:system/index.html"),
        "…repo A's marks are kept under its name, and an older page's unscoped ones are left where they were", JSON.stringify(bs.keys));
      await q.close();
      q = await at("a/?project=p1");
      const back = await R(q, () => { const el = document.querySelector("#rp"), r = el.shadowRoot.querySelector(".before .pre"); return { w: r?.querySelector(".pw")?.textContent, seen: !!el.watchedOf("system") }; });
      await q.close();
      q = await at("a/?project=system");
      const aAnn = await R(q, () => document.querySelector("#rp").annotations.map((a) => a.comment));
      ok(back.seen && back.w === "Watched" && aAnn.join() === "repo A's comment", "back on repo A's page: its system video is watched, and its comment is there", JSON.stringify({ back, aAnn }));
      await q.close();
    } finally { await ctx.close(); srv2.kill(); rmSync(T, { recursive: true, force: true }); }
  }
} catch (e) { fails.push(e.message); console.error("✗", e.message); }
await b.close(); srv.kill();
console.log(fails.length ? `\n✗ ${fails.length} failed` : "\n✓ accessible videos: before you watch, terms, ids with what they are, walk-throughs, the guard");
process.exit(fails.length ? 1 : 0);
