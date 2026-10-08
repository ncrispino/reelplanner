#!/usr/bin/env node
// Answer on the video (plan 2026-09-24-answer-on-the-video), on the videos already on the review page.
//   - step 1: while a question waits, the frame's own option cards answer it: a click on a card is the
//     key for its letter, a pick-all card ticks and waits for Confirm, hover and keyboard focus ring the
//     card; an older frame (no letters on its cards) is matched by the order of its cards, and a frame
//     with no card for every option keeps the sheet. The keys still answer.
//   - step 2 (redone after the plan's review; question 2 built with B): the options are not asked again
//     over the frame. One band an eighth of the video high, at reading size, with the question's own words
//     and clear buttons, holds own words, Explain this more, a note, Confirm, Show the frame, and a call's
//     Accept and Flag (A, B). A video whose frames carry data-band="bottom" has it in the frame's empty
//     lowest eighth; one built before that has it under the frame, in room kept for the whole video; a
//     phone has it under the frame for both. The video is measured before, during and after every
//     question, and never changes size.
//   - step 3: the record edits in place (an answer, a call's verdict, a mark's words, a quick check's
//     note; a comment's words and removals as before); after a send, an edit is offered as "Send the
//     change", and the review that change sends carries the edits.
//   - step 4: every question of four real videos, played into and answered with clicks only: this plan's
//     video (as built, and as a video that leaves its lowest eighth for the band), the revise-loop plan
//     video, its walkthrough (calls and grouped calls) and the system video (quick checks), in light and
//     dark and at phone width.
//   - step 5: a quick check just answered goes on after 10 s, not while the pointer is on the band, and
//     Continue goes at once; "Back to where this was explained" (the band and the record) takes the video to
//     the storyboard's explained_at (lifted into the plan map), else the first beat of its step, and the
//     question waits there when it is reached; an unanswered question stops the video again after a seek
//     past it and after it was folded.
//   - folded in the frame, the band's pill is in the frame's top-right corner, never on a caption: on the
//     answer-on-the-video walkthrough (every frame data-band="bottom"), call A11 folded under a caption
//     made as long as the caption band takes, the two boxes do not meet.
//   - answer in the frame (plan 2026-09-25-answer-in-the-frame): where a frame has a card for each option and
//     room to write on (not a phone), the question is answered on the frame and nothing sits in a bar: its
//     own words are a slot the player draws by the cards, Show the frame is in the frame's corner, Continue /
//     Back / Walk me through it are chips by the cards, a quick check's answer is on the cards (the right one and
//     yours marked, each card's why under it) with "Expected something else?" on the card you picked, and "More"
//     on each card and "Full question" by the heading open the fuller words (hover, or the chip). A video whose
//     every question has its cards keeps no room under the frame ("frame"); frames without cards keep the bar.
//   - a quick check answered on the frame: nothing laid out by its cards (a why, the note, a chip, a card's tag)
//     meets any card's words, where the cards sit in a row and where they are stacked in a column, at Fit and at 200%.
// usage: node packages/player/test/answer-on-frame.spec.mjs [--full]
//   Alone, or in `npm test`, it runs its quicker pass: one question of each kind, each played into from just
//   before it, at one viewport, in one browser: a quick check and a choice on this plan's video (then the record
//   edited after a send), a call and a grouped call on the revise-loop walkthrough, a pick-all, a choice's and a quick
//   check's "More", Walk me through it, and a quick check zoomed to 200%. With --full (or RP_FULL=1, as
//   `npm run test:full` sets) it runs all of the above: every question of every video, at every viewport, each
//   played into from a second before.
// usage: … [--shard <k>/<n>] (or RP_SHARD=k/n), [--units]
//   The full pass is about 14 minutes one question after another, so it is cut into units, each self-contained
//   (it opens its own pages, and nothing it checks depends on another unit), and `--shard k/n` runs the k-th of n
//   shards of them: the units dealt out by their measured time (UNITS below), the longest first, each to the
//   shard with the least so far. Every unit is in exactly one shard, so the n shards together run exactly the
//   checks of the unsharded pass; `npm run test:full` runs them side by side (scripts/test/run.mjs), and checks
//   that their counts sum to FULL_CHECKS. Each shard runs its own browser, on its own port (RP_TEST_PORT) and
//   temp folder (TMPDIR), and ends with a line naming its units and its count. Without --shard, everything runs,
//   as before. `--units` prints the units (with --shard, that shard's), their times and FULL_CHECKS, as JSON,
//   and stops, without a browser.
import { chromium } from "playwright-core"; import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdtempSync, writeFileSync, rmSync } from "node:fs"; import { join, normalize, extname } from "node:path"; import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { launchOpts, testPort, FULL, ROOT, vendorFile } from "../../../scripts/lib/env.mjs";
import * as W from "./wait.mjs";

const PLAN = ".reelplanning/plans/2026-09-24-answer-on-the-video/video";
const LOOP = ".reelplanning/plans/2026-09-22-m3-revise-loop/video";
const WALK = ".reelplanning/plans/2026-09-22-m3-revise-loop/walkthrough-video";
const SYS = ".reelplanning/system-video";
const AWALK = ".reelplanning/plans/2026-09-24-answer-on-the-video/walkthrough-video";
const FOLLOW = ".reelplanning/plans/2026-09-25-videos-you-can-follow/video";
const FWALK = ".reelplanning/plans/2026-09-25-videos-you-can-follow/walkthrough-video";
const port = testPort(8891);

// ---- units and shards (see the usage above) ------------------------------------------------------
// Each unit, in the order it runs, with about how long it takes in seconds: [the quicker pass, the full pass]
// (null: not in that pass). Measured 2026-09-27; only the dealing into shards uses the times. A unit added
// below needs its line here (the spec fails, naming it, if one runs that is not listed, or one listed never runs).
const UNITS = {
  "plan-map": [1, 1], plan: [30, 35], loop: [null, 20], walk: [10, 137], "walk-phone": [null, 11], system: [null, 28],
  "pick-all": [8, 9], sheet: [null, 5], "band-in": [null, 32], "wait-and-back": [null, 76],
  "folded-pill-1440": [null, 5], "folded-pill-1024": [null, 5], "folded-pill-1920": [null, 6], more: [12, 12],
  "more-clear": [null, 219], "stop-then-check": [null, 10], "walk-me-1440": [6, 17], "walk-me-1024": [null, 16],
  "controls-row": [null, 120], "controls-row-660": [null, 6], "words-clear": [null, 37], "words-200": [5, 6],
};
// the checks the unsharded full pass makes (`npm run test:full` checks the shards' counts sum to it); the runner's
// count of ✓ lines for the unsharded pass is one more, the closing "✓ all passed". The system video is rebuilt whenever
// the system changes, and its unit makes 8 checks for each of its quick checks and 2 more, so that part is counted from
// its plan map (1043 with its 7 quick checks of 2026-10-04)
const FULL_CHECKS = 985 + 2 + 8 * JSON.parse(readFileSync(join(ROOT, SYS, "plan-map.json"), "utf8")).quizzes.length;
const shardArg = (() => { const i = process.argv.indexOf("--shard"); return i >= 0 ? process.argv[i + 1] : process.env.RP_SHARD || ""; })();
const SHARD = (() => {
  if (!shardArg) return null;
  const m = /^(\d+)\/(\d+)$/.exec(shardArg), k = m && +m[1], n = m && +m[2];
  if (!m || n < 1 || k < 1 || k > n) { console.error(`✗ --shard wants k/n, 1 ≤ k ≤ n: "${shardArg}"`); process.exit(2); }
  return { k, n };
})();
const inPass = Object.keys(UNITS).filter((u) => UNITS[u][FULL ? 1 : 0] != null), secsOf = (u) => UNITS[u][FULL ? 1 : 0];
// the longest first, each to the shard with the least so far (ties: the lower shard); the same answer every time
const dealt = (() => {
  if (!SHARD) return inPass;
  const load = Array(SHARD.n).fill(0), to = {};
  for (const u of [...inPass].sort((a, b) => secsOf(b) - secsOf(a) || inPass.indexOf(a) - inPass.indexOf(b))) { const i = load.indexOf(Math.min(...load)); to[u] = i + 1; load[i] += secsOf(u); }
  return inPass.filter((u) => to[u] === SHARD.k);
})();
if (process.argv.includes("--units")) {
  console.log(JSON.stringify({ full: FULL, shard: SHARD && `${SHARD.k}/${SHARD.n}`, units: dealt.map((u) => ({ id: u, secs: secsOf(u) })), all: inPass, fullChecks: FULL_CHECKS }));
  process.exit(0);
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
// Served as `reelplanning review` serves it: the top page marked as the server's own, /api/review taking
// a send, and gsap from the package where a plan video's git-ignored assets/vendor has not been built. Two things are made here rather than kept as files:
//   - the revise-loop video's second choice as a frame built before step 1: its cards lose their
//     letters (data-plan-option, and the "-opt-a" ids, renamed in its script too), so only their order is left
//   - the Bob Dylan video's plan map with its first choice made pick-all: its frame has a card per option
//   - under /__band/, any video as one built after the band: every frame's root carries data-band="bottom"
//     (this plan's video already keeps its lowest sixth for the captions, so the band's eighth is empty)
//   - this plan's plan map with k2's explained_at set, as \`reelplanning plan-map\` lifts it from the storyboard
const OLD_FRAME = `/${LOOP}/compositions/frames/25-decision-q2.html`;
const rewrite = {
  [OLD_FRAME]: (html) => html.replace(/ data-plan-option="[a-z]"/g, "").replace(/ data-option="[a-z]"/g, "").replace(/opt-([a-d])\b/g, "card$1"),
};
const virtual = {
  "/__fixtures/g1-pick-all.json": () => { const m = JSON.parse(readFileSync(join(ROOT, "videos/g1-bob-dylan-site/plan-map.json"), "utf8")); m.decisions[0].kind = "multi"; return JSON.stringify(m); },
  // the videos-you-can-follow plan video with the new storyboard tags the player shows behind "More" (as
  // plan-map lifts them): its question 1's question_more and option_a_more, and quick check 1's option_a_more
  // (before an answer) and option_b_why / option_c_why (after it)
  "/__fixtures/follow-more.json": () => { const m = JSON.parse(readFileSync(join(ROOT, FOLLOW, "plan-map.json"), "utf8")), q1 = m.decisions.find((d) => d.id === "q1"), k1 = m.quizzes.find((q) => q.id === "k1");
    q1.questionMore = "Every word a viewer sees or hears: the player's own text, the system video, and each plan video's captions.";
    q1.options[0].more = "The files, the commands and the decision log keep today's names; only what is on screen changes, and the glossary lists both.";
    k1.questionMore = "The build of the system video, right after step one lands.";
    k1.options[0].more = "The build refuses to finish, and says which word it could not find explained.";
    k1.options[1].why = "A warning would let the video ship with streak unexplained; step one makes it a stop.";
    k1.options[2].why = "Plan videos lean on the system video for glossary words; they do not explain them again.";
    return JSON.stringify(m); },
  "/__fixtures/plan-explained-at.json": () => { const m = JSON.parse(readFileSync(join(ROOT, PLAN, "plan-map.json"), "utf8")); const f = m.frames.find((x) => x.index === 6); Object.assign(m.quizzes.find((q) => q.id === "k2"), { explainedAt: f.start, explainedFrame: f.index }); return JSON.stringify(m); },
};
const posts = [];
const srv = createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const tagged = path.startsWith("/__band/"); if (tagged) path = path.slice("/__band".length);
  if (path === "/api/review") {
    if (req.method === "GET") { res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ ok: true, sessionWaiting: true, agentCommand: null, inbox: 0 })); return; }
    let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => { posts.push(JSON.parse(body)); res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ ok: true, id: `r${posts.length}`, path: `.reelplanning/inbox/r${posts.length}.json`, message: "your open session has it" })); });
    return;
  }
  if (virtual[path]) { res.writeHead(200, { "content-type": "application/json" }).end(virtual[path]()); return; }
  let file = join(ROOT, normalize(path));
  // a plan video's assets/vendor is build output, git-ignored: a fresh clone serves the package's own gsap, as bundle-player does
  file = vendorFile(file) || file;
  if (!file.startsWith(ROOT)) { res.writeHead(404).end(); return; }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    const idx = join(file, "index.html");
    if (existsSync(idx)) { res.writeHead(200, { "content-type": "text/html" }).end(readFileSync(idx, "utf8").replace(/<head>/i, '<head><meta name="reelplanning-review-server" content="1">')); return; }
    res.writeHead(404).end(); return;
  }
  const type = TYPES[extname(file)] || "application/octet-stream";
  let body = rewrite[path] ? rewrite[path](readFileSync(file, "utf8")) : readFileSync(file);
  if (tagged && /\/compositions\/frames\/[^/]+\.html$/.test(path)) body = String(body).replace(/<div id="root" /, '<div id="root" data-band="bottom" ');
  res.writeHead(200, { "content-type": type }).end(body);
}).listen(port, "127.0.0.1");

const b = await chromium.launch(launchOpts());
let checks = 0;
const fails = []; const ok = (c, m) => { checks++; console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
// A unit runs where it was dealt (every unit, unsharded), and says how long it took and how many checks it made.
const ran = [];
async function unit(id, fn) {
  if (!inPass.includes(id)) { fails.push(`unit ${id} ran, but UNITS does not list it for the ${FULL ? "full" : "quicker"} pass`); return; }
  if (!dealt.includes(id)) return;
  const t0 = Date.now(), c0 = checks;
  await fn();
  ran.push(id);
  console.log(`  · ${id}: ${checks - c0} checks, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
const PAPER = { light: "rgb(250, 249, 245)", dark: "rgb(20, 19, 16)" }, CORAL = { light: "rgb(184, 85, 46)", dark: "rgb(210, 105, 63)" };   // the darker coral (D-142), for what waits on you

// ---- helpers -------------------------------------------------------------------------------------
// The waits in ./wait.mjs (each on what it waits for, never a fixed time), on a test page's own Playwright page (P.p)
const until = (P, ...a) => W.until(P.p, ...a), when = (P, ...a) => W.when(P.p, ...a), frames = (P, n) => W.frames(P.p, n);
const settled = (P) => W.settled(P.p), seeked = (P, t) => W.seeked(P.p, t), pendingIs = (P, id) => W.pendingIs(P.p, id);
const pageHold = (P, ms) => W.pageHold(P.p, ms), still = (P) => W.still(P.p), nodeUntil = W.nodeUntil;
// "More"'s popover open (on the key given) or put away
const popIs = (P, on, key = null) => until(P, ([on, key]) => { const el = document.querySelector("#rp"), shown = !el.shadowRoot.querySelector(".fpop").hidden; return on ? shown && (!key || el._more?.key === key) : !shown; }, [on, key]);
// the video going on is playing, its time moving, before it is paused again: a pause sent while the play is still on
// its way into the frame's page is overtaken by it, and the video runs on under what comes next
const movesOn = async (P) => { const t0 = await P.p.evaluate(() => document.querySelector("#rp").player.currentTime); await until(P, (t0) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime > t0 + 0.02; }, t0); };
// what a click can change: the answers, the picks, what waits
const answerSig = (P) => P.p.evaluate(() => { const el = document.querySelector("#rp"); return JSON.stringify([el.decisions, el.quizzes, el.autonomy, el.pendingId(), [...el.shadowRoot.querySelectorAll('.hits .hit[aria-pressed="true"]')].map((h) => h.dataset.hit)]); });
async function open(project, { w = 1440, h = 1000, dark = false, map = null, band = false } = {}) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("pageerror", (e) => fails.push(`page error (${project}): ` + String(e).slice(0, 160)));
  await p.goto(`http://127.0.0.1:${port}${band ? "/__band" : ""}/packages/player/?project=${project}${map ? `&map=${map}` : ""}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} });
  await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
  await p.evaluate(() => document.querySelector("#rp").reachLocal());
  // where the band goes is decided once the frames are mounted (detectBand), before anything is asked
  await p.waitForFunction(() => document.querySelector("#rp")._bandIn !== undefined, null, { timeout: 15000 }).catch(() => fails.push(`${project}: where the band goes was never decided`));
  await p.waitForFunction(() => document.querySelector("#rp").stage?.dataset.ready, null, { timeout: 90000 });
  const rp = p.locator("#rp"), P = { p, rp, theme: dark ? "dark" : "light", w, place: await p.evaluate(() => document.querySelector("#rp")._bandPlace) };
  await frames(P);
  if (dark) { await rp.locator('[data-act="theme"]').click(); await until(P, () => document.querySelector("#rp").getAttribute("theme") === "dark"); await frames(P); }
  // a rebuilt video plays just its changes (D-081); here every question is wanted, so the whole video
  if (await p.evaluate(() => !!document.querySelector("#rp")._only)) { await rp.locator('.revised [data-act="only"]').click(); await until(P, () => !document.querySelector("#rp")._only); }
  return P;
}
// Into the question the way a reviewer meets it: from a second before, press Play, and it stops there.
// The quicker pass starts it closer: 0.4 s before is still a Play into it (it is met within 0.6 s of its time).
const LEAD = FULL ? 1.2 : 0.4;
async function playInto(P, at) {
  const busy = await P.p.evaluate(() => document.querySelector("#rp").pendingId());
  if (busy) fails.push(`a question was still up before playing into the next: ${busy}`);
  await P.p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(Math.max(0, t)); }, at - LEAD);
  await seeked(P, Math.max(0, at - LEAD)); await still(P);
  await P.rp.locator('[data-act="play"]').click();
  await P.p.waitForFunction(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"); return d.classList.contains("on") && !d.classList.contains("folded"); }, null, { timeout: 20000 })
    .catch(async (e) => { throw new Error(`playing into ${at}: no question came up — ${JSON.stringify(await P.p.evaluate(() => { const el = document.querySelector("#rp"); return { t: el.player.currentTime, paused: el.player.paused, pending: el.pendingId(), past: Object.keys(el._past || {}), started: el.stage.dataset.started }; }))} (${e.message.split("\n")[0]})`); });
  await settled(P);   // a frame still settling is looked at again (recheckCards)
}
// What is on the page while a question waits.
const S = (P) => P.p.evaluate(() => {
  const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), st = r.querySelector(".stage");
  const db = d.getBoundingClientRect(), sb = st.getBoundingClientRect(), cs = (x) => getComputedStyle(x);
  const shown = (x) => !!x && cs(x).display !== "none" && cs(x).visibility !== "hidden" && x.getBoundingClientRect().height > 0;
  const k = d.querySelector(".hd .k"), dot = getComputedStyle(k, "::before"), q = d.querySelector(".q"), fold = d.querySelector(".fold");
  const captions = (() => { try { const c = el.player.iframeElement.contentDocument.querySelector("#el-captions, [data-track-kind='captions']"); return c ? getComputedStyle(c).visibility : null; } catch { return null; } })();
  return { id: el.pendingId(), kind: el._pendingDecision?.kind || null, on: d.classList.contains("on"), band: d.classList.contains("band"), home: d.parentElement.classList[0],
    top: db.top - sb.top, bottom: db.bottom - sb.bottom, h: db.height, w: Math.round(db.width), stage: { w: sb.width, h: sb.height },
    q: shown(q) ? q.textContent : null, qSize: parseFloat(cs(q).fontSize), qFont: cs(q).fontFamily, reason: shown(d.querySelector(".reason")),
    opts: [...d.querySelectorAll(".opts .opt")].filter(shown).map((o) => o.textContent.trim()),
    gflags: [...d.querySelectorAll(".gflag")].filter(shown).map((o) => o.textContent.trim()),
    hits: [...r.querySelectorAll(".hits .hit")].filter(shown).map((x) => x.dataset.hit), by: el._cardsBy || null,
    acts: [...d.querySelectorAll("button")].filter(shown).map((x) => x.textContent.replace(/\s+/g, " ").trim()),
    button: shown(fold) ? { border: cs(fold).borderTopWidth, h: Math.round(fold.getBoundingClientRect().height), size: parseFloat(cs(fold).fontSize) } : null,
    long: d.classList.contains("long"), note: shown(d.querySelector(".note")), hint: d.querySelector(".hint").textContent, hintShown: shown(d.querySelector(".hint")), fits: d.scrollHeight <= d.clientHeight + 2,
    bg: cs(d).backgroundColor, dot: dot.backgroundColor, captions, confirm: shown(d.querySelector(".confirm")) ? { text: d.querySelector(".confirm").textContent.trim(), disabled: d.querySelector(".confirm").disabled } : null,
    scrollX: document.documentElement.scrollWidth > innerWidth + 1,
    // answer in the frame: the layer is the frame's own box; what it shows, where, and whether anything is cut
    onframe: d.classList.contains("onframe"), layer: Math.abs(db.top - sb.top) < 1 && Math.abs(db.left - sb.left) < 1 && Math.abs(db.width - sb.width) < 1 && Math.abs(db.height - sb.height) < 1,
    room: getComputedStyle(r.querySelector(".bandroom")).display,
    cards: (() => { const hs = [...r.querySelectorAll(".hits .hit")].map((x) => x.getBoundingClientRect()).filter((x) => x.height > 0); return hs.length ? { l: Math.min(...hs.map((x) => x.left)) - sb.left, t: Math.min(...hs.map((x) => x.top)) - sb.top, r: Math.max(...hs.map((x) => x.right)) - sb.left, b: Math.max(...hs.map((x) => x.bottom)) - sb.top } : null; })(),
    chips: [...d.querySelectorAll("button, input, textarea")].filter(shown).map((x) => { const bb = x.getBoundingClientRect(); return { text: (x.textContent || x.placeholder || "").replace(/\s+/g, " ").trim().slice(0, 40), l: bb.left - sb.left, t: bb.top - sb.top, r: bb.right - sb.left, b: bb.bottom - sb.top, inWindow: bb.left >= -1 && bb.right <= innerWidth + 1 && bb.top >= -1 && bb.bottom <= innerHeight + 1 }; }),
    cut: [...d.querySelectorAll("*")].filter((x) => shown(x) && x.getBoundingClientRect().width > 2 && !/^(INPUT|TEXTAREA)$/.test(x.tagName) && !/^(contents|inline)$/.test(cs(x).display) && (x.scrollWidth > x.clientWidth + 1 || x.scrollHeight > x.clientHeight + 1) && !(cs(x).overflowX === "visible" && cs(x).overflowY === "visible")).map((x) => x.className),
    qw: q.getBoundingClientRect().width,
    whys: [...d.querySelectorAll(".fwhy")].filter(shown).map((x) => ({ id: x.dataset.for, right: x.dataset.right === "true", chosen: x.dataset.chosen === "true", text: x.textContent })),
    // no room by the cards for the whys (cards stacked close): each verdict is on its card's tag instead
    vtags: [...r.querySelectorAll(".hits .hit")].filter((x) => shown(x.querySelector(".tag"))).map((x) => ({ id: x.dataset.hit, right: x.dataset.right === "true", chosen: x.dataset.chosen === "true", text: x.querySelector(".tag").textContent, tag: true })),
    more: [...r.querySelectorAll(".hits .cmore")].filter(shown).map((x) => x.dataset.more),
    fbShown: shown(d.querySelector(".feedback")),
    dis: shown(d.querySelector(".disagree")) ? (() => { const bb = d.querySelector(".disagree").getBoundingClientRect(); return { l: bb.left - sb.left, t: bb.top - sb.top, r: bb.right - sb.left }; })() : null };
});
const stageSize = (P) => P.p.evaluate(() => { const b = document.querySelector("#rp").shadowRoot.querySelector(".stage").getBoundingClientRect(); return { w: b.width, h: b.height }; });
const same = (a, b) => !!a && !!b && Math.abs(a.w - b.w) < 0.5 && Math.abs(a.h - b.h) < 0.5;
const px = (x) => `${Math.round(x.w)}×${Math.round(x.h)}`;
// A card's centre, read from the frame's own page, not from the player's buttons: the click has to land
// on what the reviewer sees. By its letter where the frame writes one, else by its place among the cards.
const cardAt = (P, letter) => P.p.evaluate((letter) => {
  const el = document.querySelector("#rp"), p = el._pendingDecision, q = p.kind === "quiz" ? p.q : p;
  const cid = q.compositionId || el.planMap.frames.find((f) => f.index === q.frameIndex)?.compositionId;
  const ifr = el.player.iframeElement, doc = ifr.contentDocument, win = doc.defaultView;
  const root = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === cid);
  const outer = (els) => els.filter((x) => !els.some((o) => o !== x && o.contains(x)));
  const sel = [`[data-option="${letter}"]`, `[data-plan-option="${letter}"]`, ...["opt", "option", "choice", "chip"].map((s) => `[id$="-${s}-${letter}"]`)].join(",");
  let card = outer([...root.querySelectorAll(sel)])[0];
  if (!card) card = outer([...root.querySelectorAll("*")].filter((x) => [...x.classList].some((c) => /-opt$/.test(c))))[q.options.findIndex((o) => o.id === letter)];
  if (!card) return null;
  const r = card.getBoundingClientRect(), fr = ifr.getBoundingClientRect(), sx = fr.width / win.innerWidth, sy = fr.height / win.innerHeight;
  return { x: fr.left + (r.left + r.width / 2) * sx, y: fr.top + (r.top + r.height / 2) * sy };
}, letter);
async function clickCard(P, letter) {
  const c = await cardAt(P, letter); if (!c) { fails.push(`no card ${letter} on the frame`); return; }
  const was = await answerSig(P);
  await P.p.mouse.click(c.x, c.y);
  // the click answers, ticks or unticks: wait for that, then for what it lays out on the frame
  await until(P, (was) => { const el = document.querySelector("#rp"); return JSON.stringify([el.decisions, el.quizzes, el.autonomy, el.pendingId(), [...el.shadowRoot.querySelectorAll('.hits .hit[aria-pressed="true"]')].map((h) => h.dataset.hit)]) !== was; }, was);
  await settled(P);
}
const state = (P) => P.p.evaluate(() => { const el = document.querySelector("#rp"); return { decisions: el.decisions, quizzes: el.quizzes, autonomy: el.autonomy, annotations: el.annotations, paused: el.player.paused, t: el.player.currentTime, pending: el.pendingId() }; });
const points = (P) => P.p.evaluate(() => document.querySelector("#rp").points().map((x) => ({ kind: x.kind, id: x.q.id, at: x.q.at, question: x.kind === "group" ? null : x.q.question || x.q.chose || null, options: (x.q.options || []).map((o) => o.id), calls: (x.q.calls || []).map((c) => c.id), multi: x.q.kind === "multi" })).sort((a, b) => a.at - b.at));
// The band's contract, checked on every question met. Where it is: in the frame's empty lowest eighth
// (a video that leaves it), or under the frame in the room kept for it (a video built before; a phone).
// How it reads: the question's own words at reading size in the serif, clear buttons, paper and the coral
// dot; the options not asked again (a call has no cards: its Accept and Flag are in the band).
function checkBand(P, s, pt) {
  const tag = `${pt.kind} ${pt.id}`, phone = P.w <= 600, eighth = Math.max(72, s.stage.h / 8);
  const cards = pt.kind === "check" || pt.kind === "choice";
  // the band keeps the reserved eighth while its words fit a line, and grows up over the frame when they do
  // not, to 40% of it (band.spec.mjs checks it reads in full); the frame never changes size
  const grown = s.h > eighth + 1.5, capped = s.h <= s.stage.h * 0.4 + 1 || s.long;
  if (P.place === "in") ok(s.on && s.band && s.home === "stage" && Math.abs(s.bottom) <= 1 && s.h >= eighth - 1.5 && capped && s.captions !== "visible", `${tag}: the band is in the frame, over its lowest eighth${grown ? " and up over the frame as its words need" : ""} (${Math.round(s.h)} px of ${Math.round(s.stage.h)}), the captions out of its way — ${JSON.stringify({ home: s.home, bottom: Math.round(s.bottom), captions: s.captions })}`);
  else ok(s.on && s.band && s.home === "bandroom" && (phone ? s.h >= 100 && s.top >= s.stage.h - 0.5 : s.h >= eighth - 1.5 && capped && (grown || s.top >= s.stage.h - 0.5)), `${tag}: the band is under the frame, in the room kept for it${grown && !phone ? ", grown up over the frame as its words need" : ""} — ${Math.round(s.h)} px, the frame ${Math.round(s.stage.h)} (${phone ? "a phone: in the page's flow" : "an eighth of it"})`);
  ok(!!s.q && (!pt.question || s.q === pt.question) && s.qSize >= 15 && /Garamond/.test(s.qFont) && !s.reason && !s.scrollX, `${tag}: the question in its own words, at reading size (${s.qSize} px, the serif), nothing else of it repeated, no sideways scroll — "${(s.q || "").slice(0, 60)}"`);
  ok(s.button && s.button.border === "1px" && s.button.h >= 26 && s.button.size >= 13, `${tag}: clear buttons, not links — ${JSON.stringify(s.button)}`);
  if (!phone) ok(s.fits, `${tag}: what it holds fits in it, nothing scrolled out of sight`);
  if (cards) ok(s.hits.join() === pt.options.join() && s.opts.length === 0, `${tag}: the frame's cards answer it (matched by ${s.by}), no options in the band — ${JSON.stringify({ hits: s.hits, opts: s.opts })}`);
  else if (pt.kind === "call") ok(s.hits.length === 0 && s.opts.length === 2 && /Accept/.test(s.opts[0]) && /Flag/.test(s.opts[1]) && s.acts.some((a) => /own words/.test(a)), `${tag}: Accept and Flag are in the band, with the keys — ${JSON.stringify(s.opts)}`);
  else ok(s.hits.length === 0 && /Accept all/.test(s.opts[0] || "") && s.gflags.length === pt.calls.length, `${tag}: Accept all and a Flag per call are in the band — ${JSON.stringify({ opts: s.opts, flags: s.gflags })}`);
  ok(s.acts.some((a) => /Show the frame/.test(a)) && (pt.kind !== "check" || s.acts.some((a) => /Back to where this was explained/.test(a))), `${tag}: Show the frame is there${pt.kind === "check" ? ", and Back to where this was explained" : ""}`);
  ok(s.bg === PAPER[P.theme] && s.dot === CORAL[P.theme], `${tag}: on the paper, with the coral dot (${P.theme}) — ${JSON.stringify({ bg: s.bg, dot: s.dot })}`);
}
// Answered in the frame: the layer is the frame's own box, over it, transparent; the question is the frame's (not
// asked again), its cards answer it, and what is left sits by them: your own words a slot, Show the frame in the
// corner, the rest chips under the cards. Nothing in it is cut, every control inside the window, and no room is
// kept for a bar under a video that is answered on its frames.
function checkFrame(P, s, pt) {
  const tag = `${pt.kind} ${pt.id}`, below = (c) => c.t >= s.cards.b - 1 || c.l >= s.cards.r - 1;
  ok(s.on && s.onframe && !s.band && s.home === "main" && s.layer && s.bg === "rgba(0, 0, 0, 0)" && s.captions !== "visible", `${tag}: answered in the frame — no bar, a clear layer the frame's size over it, the captions out of its way — ${JSON.stringify({ home: s.home, layer: s.layer, bg: s.bg })}`);
  ok(s.qw <= 2 && !s.reason && s.opts.length === 0 && s.hits.join() === pt.options.join() && !s.scrollX, `${tag}: the frame asks it; its cards answer it (matched by ${s.by}), and nothing of it is asked again — ${JSON.stringify({ hits: s.hits, opts: s.opts.length })}`);
  const own = s.chips.find((c) => /Answer in my own words/.test(c.text)), fold = s.chips.find((c) => /Show the frame/.test(c.text));
  ok(!!own && below(own) && !!fold && fold.t < s.stage.h * 0.1 && fold.r > s.stage.w * 0.85, `${tag}: your own words are a slot by the cards, and Show the frame is in the frame's top-right corner — ${JSON.stringify({ own, fold })}`);
  ok(s.chips.filter((c) => !/Show the frame/.test(c.text)).every(below) && (pt.kind !== "check" || s.chips.some((c) => /Back to where this was explained/.test(c.text))), `${tag}: the other chips sit under the cards${pt.kind === "check" ? ", Back to where this was explained among them" : ""} — ${JSON.stringify(s.chips.map((c) => [c.text, Math.round(c.t)]))}`);
  ok(s.chips.every((c) => c.inWindow) && !s.cut.length, `${tag}: nothing cut, every control inside the window — ${JSON.stringify(s.cut)}`);
  ok(s.button && s.button.border === "1px" && s.button.h >= 26 && s.button.size >= 13, `${tag}: clear buttons, not links — ${JSON.stringify(s.button)}`);
  ok(s.more.includes("q"), `${tag}: "Full question" is by the question — ${JSON.stringify(s.more)}`);
  if (P.place === "frame") ok(s.room === "none", `${tag}: a video answered on its frames keeps no room for a bar under them`);
}
// Every question of a video, in order, answered by clicking: the i-th card, Accept or Flag in turn, one
// flag and Accept all on a group. A quick check goes on with its Continue. The frame is measured before
// the question, while it waits, and after it is answered: it never changes size.
async function playThrough(P, { only = null, expectBy = {}, pick = {} } = {}) {
  let i = 0; const pts = (await points(P)).filter((x) => !only || only.includes(x.id));
  const sizes = [];
  for (const pt of pts) {
    await P.p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(Math.max(0, t)); }, pt.at - LEAD);
    await seeked(P, Math.max(0, pt.at - LEAD)); await frames(P);
    const before = await stageSize(P);
    await playInto(P, pt.at);
    const s = await S(P);
    if (s.id !== pt.id) { ok(false, `playing into ${pt.kind} ${pt.id} stops on it — stopped on ${s.id}`); continue; }
    if (s.onframe) checkFrame(P, s, pt); else checkBand(P, s, pt);
    if (!s.onframe && (pt.kind === "check" || pt.kind === "choice") && P.w > 600) ok(false, `${pt.kind} ${pt.id}: a frame with its cards, at ${P.w} px, is answered in the frame — it was not`);
    if (expectBy[pt.id]) ok(s.by === expectBy[pt.id], `${pt.kind} ${pt.id}: matched by ${expectBy[pt.id]} — ${s.by}`);
    let answered = null;
    if (pt.kind === "check") {
      const letter = pick[pt.id] || pt.options[i % pt.options.length]; await clickCard(P, letter);
      const st = await state(P); answered = await S(P);
      ok(st.quizzes[pt.id]?.answer === letter && answered.on && (answered.band || answered.onframe), `check ${pt.id}: a click on card ${letter.toUpperCase()} answers it, and the answer shows ${answered.onframe ? "on the frame" : "in the band"}`);
      if (answered.onframe) {
        const right = await P.p.evaluate((id) => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === id).answer, pt.id);
        const said = answered.whys.length ? answered.whys : answered.vtags, rw = said.find((x) => x.right), cw = said.find((x) => x.chosen);
        ok(rw?.id === right && cw?.id === letter && /Your answer/.test(cw.text) && (letter === right ? /right/.test(cw.text) : /not quite/.test(cw.text)) && !answered.fbShown, `check ${pt.id}: the answer is on the cards — the right one (${right.toUpperCase()}) and yours (${letter.toUpperCase()}) marked, each with its why${said === answered.vtags ? " (no room by these cards: the verdicts on their tags, the words behind \"Read why in full\")" : ""}, and no line of feedback elsewhere — ${JSON.stringify(answered.whys.map((x) => [x.id, x.text.slice(0, 40)]))}`);
        // the right one is marked by more than colour (D-142 keeps the coral for what waits on you): a tick before
        // its words, a cross before a wrong pick's, and its ring in --right (ink), not the coral
        const marks = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, el = document.querySelector("#rp"), w = r.querySelector('.fwhy[data-right="true"] b'), c = r.querySelector('.fwhy[data-chosen="true"]:not([data-right="true"]) b'), h = r.querySelector('.hits .hit[data-right="true"]');
          return { tick: w ? getComputedStyle(w, "::before").content : null, cross: c ? getComputedStyle(c, "::before").content : null, ring: h ? getComputedStyle(h).boxShadow : null, accent: getComputedStyle(el).getPropertyValue("--accent-rgb").trim().replace(/,\s*/g, ", ") }; });
        ok(/\u2713/.test(marks.tick || "") && (letter === right ? !marks.cross : /\u2715/.test(marks.cross || "")) && !!marks.ring && !marks.ring.includes(marks.accent), `check ${pt.id}: the right card is marked by more than colour — a tick by "The answer"${letter === right ? "" : ", a cross by yours"}, its ring ink, not the coral — ${JSON.stringify(marks)}`);
        const chosen = await P.p.evaluate((l) => { const r = document.querySelector("#rp").shadowRoot, h = r.querySelector(`.hits .hit[data-hit="${l}"]`).getBoundingClientRect(), s = r.querySelector(".stage").getBoundingClientRect(); return { l: h.left - s.left, r: h.right - s.left, b: h.bottom - s.top }; }, letter);
        ok(!!answered.dis && answered.dis.t >= chosen.b && answered.dis.l < chosen.r && answered.dis.r > chosen.l, `check ${pt.id}: "Expected something else?" is on the card you picked, under its why — ${JSON.stringify({ dis: answered.dis, card: chosen })}`);
        ok(answered.chips.every((c) => c.inWindow) && !answered.cut.length, `check ${pt.id}: answered, nothing cut and every control in the window — ${JSON.stringify(answered.cut)}`);
      }
      await P.rp.locator(".decision .gobtn").click(); await pendingIs(P, null);
    } else if (pt.kind === "choice") {
      const letter = pick[pt.id] || pt.options[i % pt.options.length]; await clickCard(P, letter);
      const st = await state(P);
      ok(st.decisions[pt.id]?.option === letter && !st.pending, `choice ${pt.id}: a click on card ${letter.toUpperCase()} answers it — ${st.decisions[pt.id]?.option}`);
    } else if (pt.kind === "call") {
      const v = i % 3 === 2 ? "flag" : "accept";
      await P.rp.locator(`.decision [data-verdict="${v}"]`).click(); await until(P, (id) => !!document.querySelector("#rp").autonomy[id] && !document.querySelector("#rp").pendingId(), pt.id);
      const st = await state(P);
      ok(st.autonomy[pt.id]?.verdict === v && !st.pending, `call ${pt.id}: ${v} in the band records it — ${st.autonomy[pt.id]?.verdict}`);
    } else {
      await P.rp.locator(`.decision [data-gflag="${pt.calls[0]}"]`).click(); await until(P, (id) => document.querySelector("#rp").autonomy[id]?.verdict === "flag", pt.calls[0]);
      await P.rp.locator(".decision [data-gaccept]").click(); await pendingIs(P, null);
      const st = await state(P);
      ok(st.autonomy[pt.calls[0]]?.verdict === "flag" && pt.calls.slice(1).every((c) => st.autonomy[c]?.verdict === "accept") && !st.pending, `group ${pt.id}: one call flagged in the band, Accept all takes the rest`);
    }
    await movesOn(P); await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.player.pause(); });
    const after = await stageSize(P);
    const ok3 = same(before, s.stage) && same(before, after) && (!answered || same(before, answered.stage));
    ok(ok3, `${pt.kind} ${pt.id}: the video keeps its size before, during and after — ${px(before)}, ${px(s.stage)}${answered ? `, answered ${px(answered.stage)}` : ""}, ${px(after)}`);
    sizes.push(before, after);
    i++;
  }
  ok(sizes.every((x) => same(x, sizes[0])), `and one size for the whole video (${P.place}) — ${sizes.length ? px(sizes[0]) : "no question"}`);
  return pts;
}

let P, st, s;   // the page open, and what was last read from it (each unit sets them before it reads them)
try {
  await unit("plan-map", async () => {
    // ==== 0. `- explained_at:` in a storyboard is lifted into the plan map (step 5) ======================
    {
      const dir = mkdtempSync(join(tmpdir(), "aof-pm-"));
      const sb = readFileSync(join(ROOT, PLAN, "STORYBOARD.md"), "utf8").replace(/^- quiz: k1$/m, "- quiz: k1\n- explained_at: 7").replace(/^- quiz: k2$/m, "- quiz: k2\n- explained_at: 12-step-2").replace(/^- quiz: k3$/m, "- quiz: k3\n- explained_at: 99");
      writeFileSync(join(dir, "STORYBOARD.md"), sb);
      const r = spawnSync(process.execPath, [join(ROOT, "scripts/plan-map.mjs"), dir], { encoding: "utf8" });
      const m = JSON.parse(readFileSync(join(dir, "plan-map.json"), "utf8")), q = Object.fromEntries(m.quizzes.map((x) => [x.id, x])), f = (i) => m.frames.find((x) => x.index === i);
      ok(r.status === 0 && q.k1.explainedAt === f(7).start && q.k1.explainedFrame === 7 && q.k2.explainedAt === f(12).start && q.k2.explainedFrame === 12, `plan-map lifts explained_at, by frame number or composition id, as the frame's start — k1 ${q.k1.explainedAt}, k2 ${q.k2.explainedAt}`);
      ok(!("explainedAt" in q.k3) && /k3.*names no frame/.test(r.stderr) && !("explainedAt" in q.k4) && m.frames.every((x) => !("explainedAt" in x)), "one that names no frame is left out, with a warning, as is one with none; the frames do not carry it");
      rmSync(dir, { recursive: true, force: true });
    }

    // ==== 0b. the new storyboard tags reach the plan map: question_more, option_x_more, a quick check's option_x_why
    {
      const dir = mkdtempSync(join(tmpdir(), "aof-more-"));
      const sb = readFileSync(join(ROOT, PLAN, "STORYBOARD.md"), "utf8").replace(/^- quiz: k1$/m, "- quiz: k1\n- question_more: The whole question, with its case.\n- option_a_more: More on A.\n- option_b_why: Why B is not it.").replace(/^- decision: q1$/m, "- decision: q1\n- question_more: Why this is asked.\n- option_b_more: More on B.");
      writeFileSync(join(dir, "STORYBOARD.md"), sb);
      const r = spawnSync(process.execPath, [join(ROOT, "scripts/plan-map.mjs"), dir], { encoding: "utf8" });
      const m = JSON.parse(readFileSync(join(dir, "plan-map.json"), "utf8")), k1 = m.quizzes.find((x) => x.id === "k1"), q1 = m.decisions.find((x) => x.id === "q1");
      ok(r.status === 0 && k1.questionMore === "The whole question, with its case." && k1.options[0].more === "More on A." && k1.options[1].why === "Why B is not it." && !("why" in k1.options[0]), `plan-map carries a quick check's question_more, option_a_more and option_b_why — ${JSON.stringify(k1.options)}`);
      ok(q1.questionMore === "Why this is asked." && q1.options[1].more === "More on B." && m.frames.every((f) => !("questionMore" in f) && f.options.every((o) => !("more" in o))), "and a choice's question_more and option_b_more; the frames do not carry them");
      rmSync(dir, { recursive: true, force: true });
    }
  });

  // ==== 1. this plan's video: light, at a laptop's width; then the record edited after a send ========
  await unit("plan", async () => {
    P = await open(PLAN);
    // hover and keyboard focus light a card (on the first quick check, before it is answered)
    const k1 = (await points(P)).find((x) => x.id === "k1");
    await playInto(P, k1.at);
    // the ring eases in: read it once the card is hovered and its transition has run
    const eased = (sel) => until(P, (sel) => { const h = document.querySelector("#rp").shadowRoot.querySelector(sel); return !!h && h.matches(":hover, :focus-visible") && h.getAnimations().every((a) => a.playState === "finished"); }, sel);
    const c = await cardAt(P, "b"); await P.p.mouse.move(c.x, c.y); await eased('.hit[data-hit="b"]');
    const hov = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, h = r.querySelector('.hit[data-hit="b"]'); return { hover: h.matches(":hover"), ring: getComputedStyle(h).boxShadow, cursor: getComputedStyle(h).cursor }; });
    ok(hov.hover && hov.ring.includes(CORAL.light.replace(")", "")) && hov.cursor === "pointer", `the pointer over a card rings it in coral — ${JSON.stringify(hov)}`);
    await P.p.mouse.move(5, 5);
    let focused = null;
    const onCard = () => P.p.evaluate(() => { const a = document.querySelector("#rp").shadowRoot.activeElement; return a?.classList.contains("hit") ? { id: a.dataset.hit, ring: getComputedStyle(a).boxShadow, visible: a.matches(":focus-visible") } : null; });
    for (let n = 0; n < 40 && !focused; n++) { await P.p.keyboard.press("Tab"); focused = await onCard(); }
    if (focused) { await eased(`.hit[data-hit="${focused.id}"]`); focused = await onCard(); }   // the ring eases in
    ok(focused?.visible && focused.ring.includes(CORAL.light.replace(")", "")), `Tab reaches the cards, and the focused card is ringed — ${JSON.stringify(focused)}`);
    ok(!(await state(P)).quizzes.k1, "hovering and focusing answer nothing");
    await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.giveWay(); el.focus(); });   // put back: the pass meets it again
    await P.p.screenshot({ path: join(tmpdir(), "aof-plan-light.png") }).catch(() => {});
    await playThrough(P, { expectBy: { q1: "data-option" }, only: FULL ? null : ["k1", "k2", "q1"] });
    st = await state(P);
    ok(Object.keys(st.quizzes).length === (FULL ? 5 : 2) && Object.keys(st.decisions).length === 1, `${FULL ? "every question" : "two quick checks and the choice"} on this plan's video answered by clicks — ${Object.keys(st.quizzes).length} checks, ${Object.keys(st.decisions).length} choice`);

    // what the record then gets edited against: a comment to reword, one to remove, and a mark with words
    const post = async (text) => { await P.rp.locator(".composer textarea").fill(text); await P.rp.locator('[data-act="post"]').click(); await until(P, (text) => document.querySelector("#rp").annotations.some((a) => a.comment === text), text); };
    await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.player.pause(); el.player.seek(40); }); await seeked(P, 40); await frames(P);
    await post("the strip should say which key is which"); await post("drop this one");
    await P.rp.locator('[data-act="mark"]').click(); await P.rp.locator('[data-tool="box"]').click();
    const sb = await P.rp.locator(".stage").boundingBox();
    await P.p.mouse.move(sb.x + sb.width * 0.3, sb.y + sb.height * 0.3); await P.p.mouse.down(); await P.p.mouse.move(sb.x + sb.width * 0.5, sb.y + sb.height * 0.5, { steps: 10 }); await P.p.mouse.up();
    await until(P, () => document.querySelector("#rp").shadowRoot.activeElement?.matches("textarea[data-markword]"));   // the mark asks for its words
    await P.p.keyboard.type("this box"); await P.p.keyboard.press("Enter"); await until(P, () => document.querySelector("#rp").annotations.some((a) => a.path && a.comment === "this box"));
    await P.rp.locator('[data-act="mark"]').click(); await until(P, () => !document.querySelector("#rp").tool);
    st = await state(P);
    const reword = st.annotations.find((a) => a.comment === "the strip should say which key is which"), drop = st.annotations.find((a) => a.comment === "drop this one"), mark = st.annotations.find((a) => a.path && a.comment === "this box");
    ok(reword && drop && mark, `two comments and a mark with words before the send — ${st.annotations.map((a) => a.comment).join(" | ")}`);
    // Finish, Send
    await P.rp.locator('[data-act="finish"]').click(); await until(P, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden);
    await P.rp.locator('.handoff [data-act="send-local"]').click(); await nodeUntil(() => posts.length >= 1);
    const sent = () => until(P, () => { const el = document.querySelector("#rp"); return el._posted?.state === "sent" && el._posted.what === el.reviewSig(); });
    await sent();
    ok(posts.length === 1, `the review is sent from the Finish panel — ${posts.length} post`);
    await P.rp.locator('[data-act="handoff-close"]').click(); await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden);
    const resend = () => P.p.evaluate(() => { const e = document.querySelector("#rp").shadowRoot.querySelector(".resend"); return { shown: !e.hidden && e.getBoundingClientRect().height > 0, text: e.textContent.trim() }; });
    if (!(await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")))) await P.rp.locator(".grab").click();
    await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(P);
    ok(!(await resend()).shown, "right after the send, nothing is offered to send again");
    // a choice's answer, changed where it is listed: no jump into the video
    const before = await state(P), q1 = (await points(P)).find((x) => x.id === "q1"), to = q1.options.find((o) => o !== before.decisions.q1.option);
    await P.rp.locator('[data-redit="q1"]').click(); await until(P, () => document.querySelector("#rp").shadowRoot.querySelectorAll(".redit .ropt").length > 0);
    const ed = await P.p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".redit .ropt")].map((x) => ({ id: x.dataset.set, on: x.getAttribute("aria-pressed") })));
    ok(ed.length === q1.options.length && ed.find((x) => x.on === "true")?.id === `q1:${before.decisions.q1.option}`, `"change" opens the choice's options under it, the given one pressed — ${JSON.stringify(ed)}`);
    await P.rp.locator(`[data-set="q1:${to}"]`).click(); await until(P, (to) => document.querySelector("#rp").decisions.q1?.option === to, to); await frames(P);
    st = await state(P);
    ok(st.decisions.q1.option === to && st.paused && Math.abs(st.t - before.t) < 0.3 && !st.pending, `a pick there changes the answer in place, and the video stays where it was — ${JSON.stringify({ option: st.decisions.q1.option, t: +st.t.toFixed(2), was: +before.t.toFixed(2) })}`);
    let rs = await resend();
    ok(rs.shown && /Send the change/.test(rs.text), `and the record offers it as "Send the change" — "${rs.text}"`);
    // a quick check's note, a comment's words, a mark's words; a comment removed
    const edit = async (sel, text) => { const ta = P.rp.locator(sel); await ta.fill(text); await ta.press("Tab"); await frames(P); };   // Tab: its change is kept at once
    await edit('textarea[data-qnote="k2"]', "older frames should say so on the card");
    await edit(`textarea[data-comment="${reword.id}"]`, "the strip should name each key");
    await edit(`textarea[data-comment="${mark.id}"]`, "this box, reworded");
    const markRow = await P.p.evaluate((id) => { const t = document.querySelector("#rp").shadowRoot.querySelector(`textarea[data-comment="${id}"]`); return { ph: t.placeholder, label: t.getAttribute("aria-label") }; }, mark.id);
    ok(/mark/i.test(markRow.ph + markRow.label), `a mark's row names its words as the mark's — ${JSON.stringify(markRow)}`);
    await P.rp.locator(`[data-del="${drop.id}"]`).click(); await until(P, (id) => !document.querySelector("#rp").annotations.some((a) => a.id === id), drop.id);
    await P.p.screenshot({ path: join(tmpdir(), "aof-record-light.png"), fullPage: true }).catch(() => {});
    await P.rp.locator('.resend [data-act="send-local"]').click(); await nodeUntil(() => posts.length >= 2); await sent(); await frames(P);
    ok(posts.length === 2, `"Send the change" sends a second review — ${posts.length} posts`);
    const rv = posts[1]?.review || {}, by = (list, id) => (list || []).find((x) => x.id === id);
    ok(by(rv.decisions, "q1")?.option === to, `the export carries the changed answer — ${by(rv.decisions, "q1")?.option}`);
    ok(by(rv.quizzes, "k2")?.note === "older frames should say so on the card", "the quick check's note");
    ok(by(rv.annotations, reword.id)?.comment === "the strip should name each key" && by(rv.annotations, mark.id)?.comment === "this box, reworded" && !by(rv.annotations, drop.id), "the comment's and the mark's new words, and not the removed comment");
    ok(!(await resend()).shown, "sent, the offer goes");
    // met again, the choice shows the answer the record gave it, on its card
    await P.p.evaluate(() => document.querySelector("#rp").closePull());
    await playInto(P, q1.at);
    const again = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return [...r.querySelectorAll(".hit")].filter((h) => h.dataset.chosen === "true").map((h) => h.dataset.hit); });
    ok(again.join() === to, `played into again, the card of the answer given in the record is the one marked — ${again}`);
    await P.p.evaluate(() => document.querySelector("#rp").giveWay());
    await P.p.close();
  });

  if (FULL) await unit("loop", async () => {
    // ==== 2. the revise-loop plan video: dark, with its second choice's frame as built before step 1 ====
    P = await open(LOOP, { dark: true });
    await playThrough(P, { expectBy: { q2: "order", q3: "data-plan-option" }, pick: { q2: "b" } });
    st = await state(P);
    ok(Object.keys(st.decisions).length === 4 && Object.keys(st.quizzes).length === 1, `every question on the revise-loop plan video answered by clicks, in dark — ${JSON.stringify(Object.fromEntries(Object.entries(st.decisions).map(([k, v]) => [k, v.option])))}`);
    ok(st.decisions.q2?.option === "b", `an older frame's second card answers B — ${st.decisions.q2?.option}`);
    await P.p.close();
  });

  // ==== 3. the revise-loop walkthrough: every call and grouped call, then verdicts switched in the record
  await unit("walk", async () => {
    P = await open(WALK);
    // the quicker pass: its first call and its first group (one call flagged in it, the rest accepted)
    const w0 = await points(P);
    const wpts = await playThrough(P, { only: FULL ? null : [w0.find((x) => x.kind === "call").id, w0.find((x) => x.kind === "group").id] });
    st = await state(P);
    const nCalls = await P.p.evaluate(() => document.querySelector("#rp").calls().length);
    if (FULL) ok(Object.keys(st.autonomy).length === nCalls && Object.keys(st.quizzes).length === wpts.filter((x) => x.kind === "check").length, `every call, grouped call and quick check on the walkthrough answered by clicks — ${Object.keys(st.autonomy).length} of ${nCalls} calls`);
    if (!(await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")))) await P.rp.locator(".grab").click();
    await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(P);
    const flagged = Object.keys(st.autonomy).find((id) => st.autonomy[id].verdict === "flag"), accepted = Object.keys(st.autonomy).find((id) => st.autonomy[id].verdict === "accept");
    const before3 = await state(P);
    await P.rp.locator(`[data-reverdict="${flagged}:accept"]`).click(); await until(P, (id) => document.querySelector("#rp").autonomy[id]?.verdict === "accept", flagged);
    await P.rp.locator(`[data-reverdict="${accepted}:flag"]`).click(); await until(P, (id) => document.querySelector("#rp").autonomy[id]?.verdict === "flag", accepted);
    st = await state(P);
    const ex = await P.p.evaluate(() => document.querySelector("#rp").exportPayload());
    const chose = (id) => ex.autonomy.find((x) => x.id === id);
    ok(chose(flagged)?.verdict === "accept" && chose(accepted)?.verdict === "flag" && st.paused && Math.abs(st.t - before3.t) < 0.3, `a call's verdict switched in the record, both ways, without going back to the video — ${flagged} → ${chose(flagged)?.verdict}, ${accepted} → ${chose(accepted)?.verdict}`);
    const flags = ex.annotations.filter((a) => a.kind === "flag").map((a) => a.comment);
    const cf = await P.p.evaluate(([f, a]) => { const c = document.querySelector("#rp").calls(); return [c.find((x) => x.id === f).chose, c.find((x) => x.id === a).chose]; }, [flagged, accepted]);
    ok(!flags.includes(`Flagged: ${cf[0]}`) && flags.includes(`Flagged: ${cf[1]}`), "the flag's note on its step follows the verdict: gone from the one accepted, added to the one flagged");
    await P.p.close();
  });

  if (FULL) await unit("walk-phone", async () => {
    // at phone width: a call and a group, in the band under the frame
    P = await open(WALK, { w: 390, h: 844 });
    const wp = await points(P);
    await playThrough(P, { only: [wp.find((x) => x.kind === "call").id, wp.find((x) => x.kind === "group").id] });
    const phoneRow = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return r.querySelector(".stage").getBoundingClientRect().width; });
    ok(phoneRow <= 390, `at phone width the frame runs edge to edge and nothing scrolls sideways — ${phoneRow} px`);
    await P.p.close();
  });

  if (FULL) await unit("system", async () => {
    // ==== 4. the system video: its quick checks, at phone width, in dark =================================
    P = await open(SYS, { w: 390, h: 844, dark: true });
    await playThrough(P);
    st = await state(P);
    const sysChecks = (await points(P)).filter((x) => x.kind === "check").length;   // 5 before the better-visuals rebuild, 7 after
    ok(sysChecks >= 5 && Object.keys(st.quizzes).length === sysChecks, `every quick check on the system video answered by tapping its card, at phone width in dark — ${Object.keys(st.quizzes).length} of ${sysChecks}`);
    await P.p.screenshot({ path: join(tmpdir(), "aof-system-phone-dark.png") }).catch(() => {});
    await P.p.close();
  });

  // ==== 5. a pick-all question: a click ticks the card and waits for Confirm, in the band; the keys still work
  await unit("pick-all", async () => {
    P = await open("videos/g1-bob-dylan-site", { map: "__fixtures/g1-pick-all.json", w: 390, h: 844 });
    const g = await points(P), pick = g.find((x) => x.multi), single = g.find((x) => x.kind === "choice" && !x.multi);
    await playInto(P, pick.at);
    s = await S(P);
    ok(s.band && !s.onframe && s.hits.join() === pick.options.join() && s.confirm?.disabled, `a pick-all question: its cards in the frame, Confirm in the band waiting for a tick — ${JSON.stringify(s.confirm)}`);
    await clickCard(P, pick.options[0]); await clickCard(P, pick.options[1]);
    s = await S(P); st = await state(P);
    const ticked = await P.p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll('.hit[aria-pressed="true"]')].map((h) => h.dataset.hit));
    ok(!st.decisions[pick.id] && st.pending === pick.id && ticked.join() === pick.options.slice(0, 2).join() && s.confirm && !s.confirm.disabled && /2 picks/.test(s.confirm.text), `each click ticks its card and the question waits — ${JSON.stringify({ ticked, confirm: s.confirm })}`);
    await clickCard(P, pick.options[1]);
    await P.rp.locator(".decision .confirm").click(); await until(P, (id) => !!document.querySelector("#rp").decisions[id], pick.id);
    st = await state(P);
    ok(st.decisions[pick.id]?.option === "multi" && st.decisions[pick.id].options.join() === pick.options[0], `a second click unticks, and Confirm sends the picks — ${JSON.stringify(st.decisions[pick.id]?.options)}`);
    await movesOn(P); await P.p.evaluate(() => document.querySelector("#rp").player.pause());
    await playInto(P, single.at);
    await P.p.evaluate(() => document.querySelector("#rp").focus());
    await P.p.keyboard.press(single.options[1]); await until(P, (id) => !!document.querySelector("#rp").decisions[id], single.id);
    st = await state(P);
    ok(st.decisions[single.id]?.option === single.options[1], `with cards on the frame, the keys still answer — ${single.id}: ${st.decisions[single.id]?.option}`);
    await P.p.close();
  });

  if (FULL) await unit("sheet", async () => {
    // ==== 6. a frame without a card for every option keeps the sheet ====================================
    P = await open("videos/l2-upload-resume", { map: "packages/player/test/fixtures/l2-richer.json" });
    const l2 = (await points(P)).find((x) => x.id === "q1");
    const s6 = await stageSize(P);
    await playInto(P, l2.at);
    s = await S(P);
    ok(!s.band && s.home === "stage" && s.top < s.stage.h && s.q && s.opts.length === l2.options.length && s.hits.length === 0, `four options, two cards on the frame: the sheet, as before — ${JSON.stringify({ band: s.band, opts: s.opts.length, hits: s.hits })}`);
    await P.rp.locator('.decision .opt[data-choose="c"]').click(); await until(P, () => !!document.querySelector("#rp").decisions.q1);
    ok((await state(P)).decisions.q1?.option === "c", "and its options answer it");
    ok(same(s6, s.stage) && same(s6, await stageSize(P)), `the sheet lies over the frame: the video keeps its size — ${px(s6)}, ${px(s.stage)}`);
    await P.p.close();
  });

  if (FULL) await unit("band-in", async () => {
    // ==== 7. a video built after the band (step 2, question 2 B): its frames leave their lowest eighth free,
    // and the band sits there, in the frame; every question, in dark. At phone width the band is under it.
    P = await open(PLAN, { band: true, dark: true, w: 1440, h: 900 });
    ok(P.place === "frame", `every frame that asks carries data-band="bottom" and has its cards: it is answered on its frames, and no bar is kept — ${P.place}`);
    await playThrough(P, { expectBy: { q1: "data-option" } });
    await P.p.screenshot({ path: join(tmpdir(), "aof-band-in-dark.png") }).catch(() => {});
    await P.p.close();
    P = await open(PLAN, { band: true, w: 390, h: 844 });
    ok(P.place === "under", `the same video at phone width: the band under the frame — ${P.place}`);
    await playThrough(P, { only: ["k1", "q1"] });
    await P.p.close();
  });

  // 8 and 9 are one unit: 9 goes on on 8's page, at the 3× 8 leaves it at
  if (FULL) await unit("wait-and-back", async () => {
    // ==== 8. step 5 on that video, light: the 10 s wait, and "Back to where this was explained" ===========
    P = await open(PLAN, { band: true, map: "__fixtures/plan-explained-at.json" });
    const p8 = await points(P), K = (id) => p8.find((x) => x.id === id);
    // 8a. answered, a quick check goes on by itself after 10 s, not 4
    // timed by the page's own clock, from the pointer leaving the card (the count waits while it is on it) to the
    // question going: the page's timers are what is measured, not how long the test took to look
    await playInto(P, K("k1").at); await clickCard(P, "b");
    await P.p.evaluate(() => { const d = document.querySelector("#rp").shadowRoot.querySelector(".decision"), w = (window.__rpWait = { left: null, gone: null });
      addEventListener("pointermove", (e) => { if (w.left == null && e.clientX <= 6 && e.clientY <= 6) w.left = performance.now(); }, { capture: true });
      const mo = new MutationObserver(() => { if (w.gone == null && !d.classList.contains("on")) { w.gone = performance.now(); mo.disconnect(); } }); mo.observe(d, { attributes: true, attributeFilter: ["class"] }); });
    await P.p.mouse.move(5, 5);
    await until(P, () => window.__rpWait.left != null);
    await until(P, () => performance.now() - window.__rpWait.left >= 5500, null, 60000);
    let w = await S(P);
    ok(w.on && w.id === "k1" && /Continues in \d+ s/.test(w.hint) && (await state(P)).paused, `a quick check answered is still there 5.5 s later, counting down (it went at 4 s) — "${w.hint}"`);
    await P.p.screenshot({ path: join(tmpdir(), "aof-band-in-light.png") }).catch(() => {});
    await until(P, () => window.__rpWait.gone != null, null, 60000);
    const took = await P.p.evaluate(() => { const w = window.__rpWait; return w.gone == null ? Infinity : (w.gone - w.left) / 1000; });
    ok(took >= 8.5 && took <= 12 && !(await state(P)).paused, `and goes on by itself about 10 s after the answer — ${took.toFixed(1)} s`);
    await movesOn(P); await P.p.evaluate(() => document.querySelector("#rp").player.pause());
    // 8b. never while the pointer or the keyboard is on the band; Continue still goes at once
    await playInto(P, K("k2").at); await clickCard(P, "a");
    // on the frame, the pointer reading a card's why (what the bar was to a question in the bar), or the card whose tag
    // carries its verdict where the whys have no room by the cards
    const on8 = await S(P);
    const bb = await P.rp.locator(!on8.onframe ? ".decision" : on8.whys.length ? ".decision .fwhy:not([hidden]) >> nth=0" : '.hits .hit[data-chosen="true"]').boundingBox();
    await P.p.mouse.move(bb.x + bb.width * 0.3, bb.y + bb.height * 0.5); await pageHold(P, 6000);
    w = await S(P);
    ok(w.on && w.id === "k2" && /Waits while you are here/.test(w.hint), `the pointer on the band: the count waits — "${w.hint}"`);
    await P.p.mouse.move(5, 5); await P.rp.locator('.decision [data-act="quiz-back"]').focus(); await pageHold(P, 6000);
    w = await S(P);
    ok(w.on && w.id === "k2" && /Waits while you are here/.test(w.hint) && (await state(P)).paused, `then the keyboard on it: still waiting, 12 s after the answer — "${w.hint}"`);
    await P.rp.locator(".decision .gobtn").click(); await pendingIs(P, null);
    let s8 = await state(P);
    ok(!s8.pending && !s8.paused, "Continue goes on at once");
    await movesOn(P); await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.player.pause(); el.setSpeed(3); });   // the trips back below play at 3×
    // 8c. from the band, an open quick check: back to the first beat of its step, and it waits when reached
    const k3 = K("k3"), step2 = (await P.p.evaluate(() => document.querySelector("#rp").planMap.frames)).find((f) => f.planStep === 2).start;
    await playInto(P, k3.at);
    const was = (await state(P)).t;
    // where it plays from: the time the moment it is playing again, back from where it was (at 3×, a look a second
    // later is 3 s further on)
    const back = (was) => when(P, (was) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime < was - 1 ? { t: el.player.currentTime } : null; }, was);
    await P.rp.locator('.decision [data-act="quiz-back"]').click();
    let from = await back(was);
    s8 = await state(P); if (from) s8.t = from.t;
    const mom = await P.p.evaluate(() => document.querySelector("#rp").moments.at(-1));
    ok(!s8.pending && !s8.paused && s8.t >= step2 && s8.t < step2 + 4, `"Back to where this was explained" plays from the first beat of its step (no explained_at) — ${s8.t.toFixed(2)}, step 2 starts ${step2}`);
    ok(mom?.kind === "rewind" && Math.abs(mom.from - was) < 1 && Math.abs(mom.t - step2) < 1, `it is a trip back, sent as a rewind (D-005) — ${JSON.stringify(mom)}`);
    await P.p.waitForFunction((id) => document.querySelector("#rp").pendingId() === id, k3.id, { timeout: 30000 }).catch(() => {});
    s8 = await state(P); w = await S(P);
    ok(s8.pending === k3.id && s8.paused && Math.abs(s8.t - k3.at) < 0.8 && w.on && w.onframe, `reached again, the quick check stops the video there and waits — t=${s8.t.toFixed(2)}`);
    await clickCard(P, "b"); await P.rp.locator(".decision .gobtn").click(); await pendingIs(P, null);
    await movesOn(P); await P.p.evaluate(() => document.querySelector("#rp").player.pause());
    // 8d. from the record, an answered one with explained_at in the plan map: there, and it waits, answered
    const k2 = await P.p.evaluate(() => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === "k2"));
    await P.p.evaluate(() => document.querySelector("#rp").openPull()); await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(P);
    const was2 = (await state(P)).t;
    await P.rp.locator('.decisions [data-back="k2"]').click();
    from = await back(was2);
    s8 = await state(P); if (from) s8.t = from.t;
    ok(!s8.paused && s8.t >= k2.explainedAt && s8.t < k2.explainedAt + 3 && !(await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled"))), `in the record, "back to where this was explained" plays from the beat explained_at names — ${s8.t.toFixed(2)}, frame ${k2.explainedFrame} at ${k2.explainedAt}`);
    await P.p.waitForFunction(() => document.querySelector("#rp").pendingId() === "k2", null, { timeout: 20000 }).catch(() => {});
    await pageHold(P, 5000);
    w = await S(P); s8 = await state(P);
    ok(s8.pending === "k2" && s8.paused && /answered/.test(await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision .k").textContent)) && !/Continues in/.test(w.hint), `answered, it comes back answered and waits there (no count) — "${w.hint}"`);
    await P.rp.locator(".decision .gobtn").click(); await pendingIs(P, null);
    await movesOn(P); await P.p.evaluate(() => document.querySelector("#rp").player.pause());

    // ==== 9. an open question stops the video again: after a seek past it, after Play past it, after folding
    const k4 = K("k4");
    const T9 = () => state(P);
    const reached = async (tag) => { await P.p.waitForFunction((id) => { const el = document.querySelector("#rp"); return el.pendingId() === id && el.player.paused && !el._folded; }, k4.id, { timeout: 20000 }).catch(() => {}); const s = await T9(); ok(s.pending === k4.id && s.paused && Math.abs(s.t - k4.at) < 0.8, `${tag}: it stops the video at the question again — t=${s.t.toFixed(2)}`); };
    await playInto(P, k4.at);
    // 9a. a seek past it (→ twice) and Play: it gives way, and the video plays on from there
    await P.p.evaluate(() => document.querySelector("#rp").focus());
    await P.p.keyboard.press("ArrowRight"); await P.p.keyboard.press("ArrowRight"); await frames(P);
    ok((await T9()).pending === k4.id, "a seek while it waits keeps it up, as before (the frame moves under it)");
    const goneOn = () => until(P, () => { const el = document.querySelector("#rp"); return !el.pendingId() && !el.player.paused; });
    await P.rp.locator('[data-act="play"]').click(); await goneOn();
    let s9 = await T9();
    ok(!s9.pending && !s9.paused && s9.t > k4.at + 5 && !(await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"))), `Play after a seek past it: it gives way, unanswered, and the video plays on — t=${s9.t.toFixed(2)}`);
    await P.p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.jump(t); }, k4.at - 4); await seeked(P, k4.at - 4 + 0.05); await frames(P);
    await P.rp.locator('[data-act="play"]').click();
    await reached("played back into after a seek past it");
    // 9b. Play pressed with it up, unanswered: it goes on, and stops again when reached
    await P.rp.locator('[data-act="play"]').click(); await goneOn();
    s9 = await T9();
    ok(!s9.pending && !s9.paused, `Play with it up and unanswered: it gives way — t=${s9.t.toFixed(2)}`);
    await P.p.evaluate((t) => { const el = document.querySelector("#rp"); el.player.pause(); el.jump(t); }, k4.at - 4); await seeked(P, k4.at - 4 + 0.05); await frames(P);
    await P.rp.locator('[data-act="play"]').click();
    await reached("never answered, played into again");
    // 9c. folded with "Show the frame": back a little and play, or on past it and play: it stops there again
    const folded = async () => { await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("folded")); await frames(P); };
    await P.rp.locator('.decision [data-act="fold"]').click(); await folded();
    w = await S(P);
    const pill = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, h = r.querySelector(".decision .hd").getBoundingClientRect(), s = r.querySelector(".stage").getBoundingClientRect(); return { t: h.top - s.top, r: s.right - h.right, h: h.height, text: r.querySelector(".decision .hd").textContent, cards: [...r.querySelectorAll(".hits .hit")].filter((x) => x.getBoundingClientRect().height > 0).length }; });
    ok(w.on && w.onframe && w.captions === "visible" && pill.t >= 0 && pill.t < 30 && pill.r >= 0 && pill.r < 30 && /Still to answer/.test(pill.text) && pill.cards === 0, `folded, the question steps down to a pill in the frame's top-right corner, its cards stop answering, and the captions come back — ${JSON.stringify({ captions: w.captions, pill })}`);
    await P.p.evaluate(() => document.querySelector("#rp").focus());
    await P.p.keyboard.press("ArrowLeft"); await frames(P);
    await P.rp.locator('[data-act="play"]').click();
    await reached("folded, rewound and played");
    await P.rp.locator('.decision [data-act="fold"]').click(); await folded();
    await P.p.evaluate(() => document.querySelector("#rp").focus());
    await P.p.keyboard.press("ArrowRight"); await P.p.keyboard.press("ArrowRight"); await frames(P);
    await P.rp.locator('[data-act="play"]').click();
    await reached("folded, sought past and played");
    await clickCard(P, "a");
    ok((await T9()).pending === k4.id && !!(await state(P)).quizzes.k4, "then answered on its card");
    await P.p.close();
  });

    // ==== 10. folded in the frame, the pill is never on a caption, however long the caption ============
    // The walkthrough of this plan: every frame carries data-band="bottom", and its call A11 is the one about
    // folding. Folded, the captions come back in the lowest eighth; the caption on screen is then made as
    // long as the caption band takes (two lines at its widest), and its box and the pill's must not meet.
    if (FULL) for (const [w, h] of [[1440, 1000], [1024, 800], [1920, 1200]]) await unit(`folded-pill-${w}`, async () => {
      P = await open(AWALK, { w, h });
      const a11 = (await points(P)).find((x) => x.id === "a11");
      ok(P.place === "in" && !!a11, `${w}px: the walkthrough has the band in the frame, and call A11 — ${P.place}`);
      if (!a11) { await P.p.close(); return; }
      await playInto(P, a11.at);
      await P.rp.locator('.decision [data-act="fold"]').click(); await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("folded")); await frames(P);
      const m = await P.p.evaluate(() => {
        const el = document.querySelector("#rp"), r = el.shadowRoot, pill = r.querySelector(".decision.band.folded .hd");
        const ifr = el.player.iframeElement, doc = ifr.contentDocument, win = doc.defaultView, fr = ifr.getBoundingClientRect(), sx = fr.width / win.innerWidth, sy = fr.height / win.innerHeight;
        const host = doc.querySelector("#el-captions, [data-track-kind='captions']");
        const seen = (x) => { for (let e = x; e && e !== doc.documentElement; e = e.parentElement) { const cs = win.getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.01) return false; } return true; };
        const box = (b, f = true) => f ? { l: fr.left + b.left * sx, t: fr.top + b.top * sy, r: fr.left + b.right * sx, b: fr.top + b.bottom * sy } : { l: b.left, t: b.top, r: b.right, b: b.bottom };
        const cap = host && [...host.querySelectorAll(".caption-pill")].find(seen);
        if (cap) { const line = cap.querySelector(".caption-line") || cap; line.innerHTML = Array.from({ length: 34 }, (_, i) => `<span class="caption-word is-spoken">${["the", "band", "folds", "to", "a", "pill", "and", "the", "caption", "comes", "back"][i % 11]}</span>`).join(" "); }
        const pb = pill?.getBoundingClientRect();
        return { pill: pb && pb.height > 0 ? box(pb, false) : null, cap: cap ? box(cap.getBoundingClientRect()) : null, stage: box(r.querySelector(".stage").getBoundingClientRect(), false), captions: host ? win.getComputedStyle(host).visibility : null };
      });
      const meet = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b, R = (b) => b && `${Math.round(b.l)},${Math.round(b.t)}–${Math.round(b.r)},${Math.round(b.b)}`;
      ok(!!m.pill && !!m.cap && m.captions === "visible" && m.cap.r - m.cap.l > (m.stage.r - m.stage.l) * 0.7, `${w}px: folded, the pill is up and the captions are back, with a long caption (${m.cap ? Math.round(m.cap.r - m.cap.l) : 0} px of ${Math.round(m.stage.r - m.stage.l)})`);
      ok(!!m.pill && !!m.cap && !meet(m.pill, m.cap), `${w}px: the folded pill and the caption do not meet — pill ${R(m.pill)}, caption ${R(m.cap)}`);
      ok(!!m.pill && m.pill.l > (m.stage.l + m.stage.r) / 2 && m.pill.t >= m.stage.t && m.pill.t - m.stage.t <= 16 && m.stage.r - m.pill.r >= 0 && m.stage.r - m.pill.r <= 16, `${w}px: the pill is in the frame's top-right corner, as the folded sheet's is — ${R(m.pill)} in ${R(m.stage)}`);
      await P.p.screenshot({ path: join(tmpdir(), `aof-folded-pill-${w}.png`) }).catch(() => {});
      await P.p.close();
    });
  // ==== 11. "More": on each card and by the question, on hover (after a moment) or from its chip; a quick check's
  // "More" never gives its answer away before it is answered; your own words in the frame
  await unit("more", async () => {
    P = await open(FOLLOW, { map: "__fixtures/follow-more.json" });
    const fm = await P.p.evaluate(() => document.querySelector("#rp").planMap), fq1 = fm.decisions.find((d) => d.id === "q1"), fk1 = fm.quizzes.find((q) => q.id === "k1");
    const pop = () => P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, x = r.querySelector(".fpop"), bb = x.getBoundingClientRect(); return { shown: !x.hidden, text: x.textContent, inWindow: bb.left >= 0 && bb.top >= 0 && bb.right <= innerWidth && bb.bottom <= innerHeight }; });
    const size11 = await stageSize(P);
    await playInto(P, fk1.at);
    let m11 = await S(P);
    ok(m11.onframe && m11.more.includes("a") && !m11.more.includes("b") && !m11.more.includes("c") && m11.more.includes("q"), `a quick check: "More" on the card that has more to say (A), none on the others before an answer, "Full question" by its heading — ${JSON.stringify(m11.more)}`);
    await P.rp.locator('.hits .cmore[data-more="a"]').click(); await popIs(P, true, "a");
    let pp = await pop();
    ok(pp.shown && pp.text.includes(fk1.options[0].more) && !pp.text.includes(fk1.explain) && !/answer/i.test(pp.text.replace(fk1.options[0].more, "")) && pp.inWindow, `"More" on A, before the answer: its fuller words and nothing that gives the answer away — "${pp.text.slice(0, 80)}…"`);
    ok(!(await state(P)).quizzes.k1, "and it answers nothing");
    await P.rp.locator('.hits .cmore[data-more="a"]').click(); await popIs(P, false); await frames(P);
    ok(!(await pop()).shown, "its chip again puts it away");
    // hover a card: after a moment its "More"; away, it goes. "At once" is timed by the page's clock, from the pointer
    // reaching the card to the popover showing: how long the test takes to look is not the player's delay
    await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, pop = r.querySelector(".fpop"), h = (window.__rpHover = { over: null, open: null });
      r.querySelector(".hits").addEventListener("pointerover", () => { if (h.over == null) h.over = performance.now(); }, { capture: true });
      const mo = new MutationObserver(() => { if (h.over != null && h.open == null && !pop.hidden) { h.open = performance.now(); mo.disconnect(); } }); mo.observe(pop, { attributes: true, attributeFilter: ["hidden"] }); });
    const cb = await cardAt(P, "a"); await P.p.mouse.move(cb.x, cb.y);
    await popIs(P, true, "a");
    const held = await P.p.evaluate(() => { const h = window.__rpHover; return h.open == null ? null : h.open - h.over; });
    ok(held != null && held >= 250, `a hover does not open it at once — it opened ${held == null ? "never" : `${Math.round(held)} ms`} after the pointer reached the card`);
    pp = await pop();
    ok(pp.shown && pp.text.includes(fk1.options[0].more), `held on the card a moment, it opens by the card — "${pp.text.slice(0, 50)}…"`);
    await P.p.mouse.move(5, 5); await popIs(P, false);
    ok(!(await pop()).shown, "the pointer gone, it goes");
    // the question: the heading hovered, or its chip
    await P.rp.locator('.hits .cmore[data-more="q"]').click(); await popIs(P, true, "q");
    pp = await pop();
    ok(pp.shown && pp.text.includes(fk1.question) && pp.text.includes(fk1.questionMore) && pp.inWindow, `"Full question": the question in full, with its question_more — "${pp.text.slice(0, 80)}…"`);
    await P.p.keyboard.press("Escape"); await popIs(P, false);
    ok(!(await pop()).shown, "Esc puts it away");
    // answered: each card's why on the card; its "More" now carries it
    await clickCard(P, "b");
    m11 = await S(P);
    const wb = m11.whys.find((x) => x.id === "b"), wc = m11.whys.find((x) => x.id === "c"), wa = m11.whys.find((x) => x.id === "a");
    ok(wb?.chosen && wb.text.includes(fk1.options[1].why) && wc?.text.includes(fk1.options[2].why) && wa?.right && wa.text.includes(fk1.explain.slice(0, 30)), `answered: each card's own why on it (option_b_why, option_c_why), the right one's from its explain — ${JSON.stringify(m11.whys.map((x) => [x.id, x.text.slice(0, 30)]))}`);
    await P.rp.locator('.hits .cmore[data-more="c"]').click(); await popIs(P, true, "c");
    pp = await pop();
    ok(pp.shown && pp.text.includes(fk1.options[2].why), `and "More" on a card now says why — "${pp.text.slice(0, 60)}…"`);
    await P.p.keyboard.press("Escape");
    await P.rp.locator(".decision .gobtn").click(); await pendingIs(P, null);
    await movesOn(P); await P.p.evaluate(() => document.querySelector("#rp").player.pause());
    // a choice: "More" from its why (an older video's) or option_x_more; the heading hovered shows the question in full
    await playInto(P, fq1.at);
    m11 = await S(P);
    ok(m11.more.includes("a") && m11.more.includes("b"), `a choice: "More" on each card — ${JSON.stringify(m11.more)}`);
    await P.rp.locator('.hits .cmore[data-more="b"]').click(); await popIs(P, true, "b");
    pp = await pop();
    ok(pp.shown && pp.text.includes(fq1.options[1].why), `B has no option_b_more: its "More" is its why — "${pp.text.slice(0, 60)}…"`);
    await P.p.keyboard.press("Escape");
    const qh = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, q = r.querySelector(".hits .qhit"); if (!q || q.hidden) return null; const bb = q.getBoundingClientRect(); return { x: bb.left + bb.width / 2, y: bb.top + bb.height / 2 }; });
    if (qh) { await popIs(P, false); await P.p.mouse.move(qh.x, qh.y); await popIs(P, true, "q"); }
    pp = await pop();
    ok(!!qh && pp.shown && pp.text.includes(fq1.question) && pp.text.includes(fq1.questionMore), `the heading, hovered a moment: the whole question — "${pp.text.slice(0, 60)}…"`);
    await P.p.mouse.move(5, 5); await popIs(P, false);
    // your own words: O opens the slot on the frame, under the cards; Enter answers with them
    await P.p.evaluate(() => document.querySelector("#rp").focus()); await P.p.keyboard.press("o"); await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".decision .own").classList.contains("open")); await settled(P);
    m11 = await S(P);
    const ownBox = await P.p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, o = r.querySelector(".decision .own"), bb = o.getBoundingClientRect(), s = r.querySelector(".stage").getBoundingClientRect(); return { open: o.classList.contains("open"), focus: r.activeElement === o.querySelector("textarea"), t: bb.top - s.top, b: bb.bottom - s.top, l: bb.left - s.left, r: bb.right - s.left, sh: s.height }; });
    ok(ownBox.open && ownBox.focus && ownBox.t >= m11.cards.b - 1 && ownBox.b <= ownBox.sh + 1 && m11.onframe, `O opens your own words in the frame, under the cards, inside the frame — ${JSON.stringify(ownBox)}`);
    await P.p.keyboard.type("Plain words, and a card that says the old name once"); await P.p.keyboard.press("Enter"); await until(P, () => !!document.querySelector("#rp").decisions.q1);
    st = await state(P);
    ok(st.decisions.q1?.option === "own" && /Plain words, and a card/.test(st.decisions.q1.label) && !st.pending, `Enter answers with them — ${st.decisions.q1?.option}`);
    ok(same(size11, await stageSize(P)), `and the video kept its size throughout — ${px(size11)}`);
    await P.p.close();
  });

  if (FULL) await unit("more-clear", async () => {
    // ==== 12. "More" never covers what you answer with (the owner's review: a More opened under choice A10's card
    // covered its Accept, Flag and Own words). For every card's "More", hovered and from its chip, at 1440 and 1024:
    // the popover's box meets no control (a card's Accept / Flag / Own words, the row of chips, your own words,
    // Continue / Back / Walk me through it, the other "More" chips) nor the card it is about, and every control is
    // still what a click at its centre lands on. A hover-opened "More" goes when the pointer reaches a control.
    // On the videos-you-can-follow walkthrough (four stop scenes of choice cards, five quick checks) and its plan
    // video with the "More" fixture (a choice and a quick check).
    const moreClear = (P) => P.p.evaluate(() => {
      const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), pop = r.querySelector(".fpop"), sb = r.querySelector(".stage").getBoundingClientRect();
      const seen = (x) => x.getClientRects().length > 0 && getComputedStyle(x).visibility !== "hidden" && x.getBoundingClientRect().width > 0;
      const name = (x) => (x.dataset.more ? `More ${x.dataset.more}` : x.dataset.sverdict || (x.textContent || x.placeholder || x.className).replace(/\s+/g, " ").trim().slice(0, 24));
      const meet = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      const pb = pop.getBoundingClientRect(), key = el._more?.key || null;
      const ctrls = [...d.querySelectorAll("button, input, textarea, select, .own.open"), ...r.querySelectorAll(".hits .cmore")].filter(seen);
      const blocked = ctrls.filter((x) => { const b = x.getBoundingClientRect(), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2; if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return false; const at = r.elementFromPoint(cx, cy); return !(at && (at === x || x.contains(at))); }).map(name);
      const set = key?.startsWith("call:") ? el._callCards : el._cards, cb = key && key !== "q" ? set?.[key.startsWith("call:") ? key.slice(5) : key] : null;
      const card = cb ? { left: sb.left + (cb.l / 100) * sb.width, top: sb.top + (cb.t / 100) * sb.height, right: sb.left + ((cb.l + cb.w) / 100) * sb.width, bottom: sb.top + ((cb.t + cb.h) / 100) * sb.height } : null;
      const side = card ? (pb.left >= card.right - 1 || pb.right <= card.left + 1 ? "beside" : pb.bottom <= card.top + 1 ? "above" : "below") : "";
      return { shown: !pop.hidden, key, under: pop.hasAttribute("data-under"), over: pop.hidden ? [] : ctrls.filter((x) => meet(pb, x.getBoundingClientRect())).map(name), blocked, onCard: !!card && !pop.hidden && meet(pb, card), side,
        inWindow: pb.left >= 0 && pb.top >= 0 && pb.right <= innerWidth && pb.bottom <= innerHeight, n: ctrls.length };
    });
    const moreKeys = (P) => P.p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".hits .cmore")].filter((x) => !x.hidden && x.getBoundingClientRect().width > 0).map((x) => x.dataset.more));
    const keyCentre = (P, key) => P.p.evaluate((key) => { const el = document.querySelector("#rp"), sb = el.shadowRoot.querySelector(".stage").getBoundingClientRect();
      const b = key === "q" ? el._qbox : key.startsWith("call:") ? el._callCards?.[key.slice(5)] : el._cards?.[key]; if (!b) return null;
      return { x: sb.left + ((b.l + b.w / 2) / 100) * sb.width, y: sb.top + ((b.t + b.h / 2) / 100) * sb.height }; }, key);
    const seenMore = { hover: 0, chip: 0, beside: 0 };
    async function checkMores(P, tag) {
      for (const key of await moreKeys(P)) {
        // hovered a moment (the card, or the question's heading), then from its chip
        const c = await keyCentre(P, key);
        if (c) {
          await P.p.mouse.move(5, 5); await popIs(P, false); await P.p.mouse.move(c.x, c.y); await popIs(P, true, key);
          const m = await moreClear(P);
          if (m.shown) seenMore.hover++;
          ok(m.shown && m.key === key && !m.over.length && !m.blocked.length && !m.onCard && m.inWindow, `${tag}: "More" on ${key}, hovered: clear of every control (${m.n}) and of its card${m.side ? `, ${m.side} it` : ""}${m.under ? " (under the controls)" : ""} — over ${JSON.stringify(m.over)}, blocked ${JSON.stringify(m.blocked)}`);
          if (m.side === "beside") seenMore.beside++;
          await P.p.mouse.move(5, 5); await popIs(P, false);
        }
        await P.rp.locator(`.hits .cmore[data-more="${key}"]`).click(); await popIs(P, true, key);
        const m = await moreClear(P);
        if (m.shown) seenMore.chip++;
        ok(m.shown && m.key === key && !m.over.length && !m.blocked.length && !m.onCard && m.inWindow, `${tag}: "More" on ${key}, from its chip: clear of every control (${m.n}) and of its card${m.side ? `, ${m.side} it` : ""}${m.under ? " (under the controls)" : ""} — over ${JSON.stringify(m.over)}, blocked ${JSON.stringify(m.blocked)}`);
        await P.p.keyboard.press("Escape"); await popIs(P, false);
      }
    }
    for (const [w, h] of [[1440, 1000], [1024, 800]]) {
      P = await open(FWALK, { w, h });
      const fpts = (await points(P)).filter((x) => x.kind === "group" || x.kind === "check");
      for (const pt of fpts) {
        await playInto(P, pt.at);
        const s12 = await S(P);
        if (!s12.onframe) { ok(false, `${w}px ${pt.kind} ${pt.id}: answered on the frame`); await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); }); continue; }
        await checkMores(P, `${w}px ${pt.id}`);
        if (pt.kind === "group") {
          // hover a choice's card until its "More" opens, then go to that choice's Accept: the "More" goes at once
          const id = pt.calls[pt.calls.length - 1], c = await keyCentre(P, `call:${id}`);
          await P.p.mouse.move(c.x, c.y); await popIs(P, true, `call:${id}`);
          const was = (await moreClear(P)).shown;
          const acc = await P.p.evaluate((id) => { const b = document.querySelector("#rp").shadowRoot.querySelector(`.decision [data-sverdict="${id}:accept"]`).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, id);
          await P.p.mouse.move(acc.x, acc.y, { steps: 6 }); await frames(P);   // "at once": the pointer reaching a control closes it as it arrives
          const m = await moreClear(P);
          ok(was && !m.shown, `${w}px ${pt.id}: "More" on ${id.toUpperCase()} hovered open, the pointer on to its Accept: the "More" goes at once`);
          if (w === 1440 && id === "a10") { await P.p.mouse.move(c.x, c.y); await popIs(P, true); await P.p.screenshot({ path: join(tmpdir(), "aof-more-beside-a10.png") }).catch(() => {}); }
        }
        await P.p.mouse.move(5, 5);
        await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.closeMore(); el.giveWay(); el.player.pause(); }); await pendingIs(P, null); await frames(P);
      }
      await P.p.close();
      P = await open(FOLLOW, { w, h, map: "__fixtures/follow-more.json" });
      for (const id of ["q1", "k1"]) {
        const pt = (await points(P)).find((x) => x.id === id); await playInto(P, pt.at);
        await checkMores(P, `${w}px plan video ${id}`);
        await P.p.mouse.move(5, 5); await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.closeMore(); el.giveWay(); el.player.pause(); }); await pendingIs(P, null); await frames(P);
      }
      await P.p.close();
    }
    ok(seenMore.hover >= 20 && seenMore.chip >= 20 && seenMore.beside >= 4, `"More" checked on every card: ${seenMore.hover} hovered, ${seenMore.chip} from the chip, ${seenMore.beside} of them beside the card`);
  });

  if (FULL) await unit("stop-then-check", async () => {
    // ==== 13. A stop scene answered with its keys, one A too many, then a jump straight to the next quick check:
    // its cards still take the click (a tester's report: they could not be clicked). The stop's last verdict closes
    // it and the video goes on, so that extra A is the Arrow tool's key; the Arrow tool left on hid the quick
    // check's cards and its canvas took the click. A question asked puts a drawing tool away.
    {
      P = await open(FWALK);
      const fp = await points(P), stop = fp.find((x) => x.kind === "group"), k = fp.find((x) => x.kind === "check" && x.at > stop.at);
      await playInto(P, stop.at);
      await P.p.evaluate(() => document.querySelector("#rp").focus());
      for (let i = 0; i <= stop.calls.length; i++) {   // one A for each choice, and one more
        await P.p.keyboard.press("a");
        if (i < stop.calls.length) await until(P, ([ids, n]) => ids.filter((id) => document.querySelector("#rp").autonomy[id]).length >= n, [stop.calls, i + 1]);
        else await frames(P);
      }
      const s0 = await P.p.evaluate((ids) => { const el = document.querySelector("#rp"); return { v: ids.map((id) => el.autonomy[id]?.verdict), pending: el.pendingId(), tool: el.shadowRoot.querySelector(".stage").dataset.tool }; }, stop.calls);
      ok(s0.v.every((x) => x === "accept") && !s0.pending, `${stop.id}: each choice accepted with A, the stop gone — ${JSON.stringify(s0)}`);
      // the timeline, clicked a few seconds before the quick check (clear of its mark, which would open it), then Play
      const bx = await P.rp.locator(".scrub").boundingBox(), dur = await P.p.evaluate(() => document.querySelector("#rp").player.duration);
      await P.p.mouse.click(bx.x + bx.width * ((k.at - 3) / dur), bx.y + bx.height / 2); await until(P, (t) => Math.abs(document.querySelector("#rp").player.currentTime - t) < 1.5, k.at - 3); await frames(P);
      await P.rp.locator('[data-act="play"]').click();
      await P.p.waitForFunction((id) => { const el = document.querySelector("#rp"); return el.pendingId() === id && el.player.paused && el.shadowRoot.querySelector(".decision").classList.contains("on"); }, k.id, { timeout: 20000 });
      await settled(P);
      const s1 = await S(P), tool = await P.p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".stage").dataset.tool);
      const c = await cardAt(P, k.options[0]), under = c && await P.p.evaluate(([x, y]) => document.querySelector("#rp").shadowRoot.elementFromPoint(x, y)?.className || null, [c.x, c.y]);
      ok(s1.onframe && s1.hits.length === k.options.length && tool === "" && under === "hit", `${k.id}, reached by a jump right after ${stop.id}: no drawing tool left on, its ${s1.hits.length} cards shown, and the card is what a click lands on — tool "${tool}" (was "${s0.tool}"), under the pointer "${under}"`);
      await clickCard(P, k.options[0]);
      const s2 = await state(P);
      ok(s2.quizzes[k.id]?.choice === k.options[0] || s2.quizzes[k.id]?.answer === k.options[0], `${k.id}: a click on its card answers it — ${JSON.stringify(s2.quizzes[k.id] || null)}`);
      await P.p.close();
    }
  });

  // ==== 14. "Walk me through it", opened by a wrong answer on the frame, never covers the question's heading, its
  // cards or anything laid out by them (it covered the heading at 1440 × 900 on the answer-in-the-frame walkthrough's
  // k1). Every quick check of that walkthrough, answered wrong with a click, at 1440 × 900 and 1024 × 800.
  {
    const IWALK = ".reelplanning/plans/2026-09-25-answer-in-the-frame/walkthrough-video";
    const walkClear = (P) => P.p.evaluate(() => {
      const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), sb = r.querySelector(".stage").getBoundingClientRect(), walk = d.querySelector(".walk");
      const pc = (b) => b && { left: sb.left + (b.l / 100) * sb.width, top: sb.top + (b.t / 100) * sb.height, right: sb.left + ((b.l + b.w) / 100) * sb.width, bottom: sb.top + ((b.t + b.h) / 100) * sb.height };
      const meet = (a, b) => !!a && !!b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      const seen = (x) => x.getClientRects().length > 0 && x.getBoundingClientRect().width > 0 && getComputedStyle(x).visibility !== "hidden";
      const wb = seen(walk) ? walk.getBoundingClientRect() : null, hd = pc(el._qbox);
      const ctrls = [...d.querySelectorAll("button, input, textarea, .fwhy"), ...r.querySelectorAll(".hits .cmore")].filter((x) => seen(x) && !walk.contains(x));
      const name = (x) => (x.dataset.more ? `More ${x.dataset.more}` : (x.textContent || x.placeholder || x.className).replace(/\s+/g, " ").trim().slice(0, 24));
      return { shown: !!wb, heading: el._qbox?.text || null, onHeading: meet(wb, hd), onCards: Object.entries(el._cards || {}).filter(([, b]) => meet(wb, pc(b))).map(([k]) => k), onCtrls: ctrls.filter((x) => meet(wb, x.getBoundingClientRect())).map(name),
        inWindow: !!wb && wb.left >= 0 && wb.top >= 0 && wb.right <= innerWidth && wb.bottom <= innerHeight, words: walk.querySelector(".wt").textContent.length > 0 };
    });
    for (const [w, h] of FULL ? [[1440, 900], [1024, 800]] : [[1440, 900]]) await unit(`walk-me-${w}`, async () => {
      P = await open(IWALK, { w, h });
      const ks = (await P.p.evaluate(() => document.querySelector("#rp").planMap.quizzes.filter((q) => q.walkMeThrough).map((q) => ({ id: q.id, at: q.at, answer: q.answer, options: q.options.map((o) => o.id) })))).slice(0, FULL ? Infinity : 1);
      ok(ks.length >= 1, `${w}px: the answer-in-the-frame walkthrough has quick checks with a walk-through — ${ks.map((k) => k.id).join(", ")}`);
      for (const k of ks) {
        await playInto(P, k.at);
        await clickCard(P, k.options.find((o) => o !== k.answer)); await until(P, () => !document.querySelector("#rp").shadowRoot.querySelector(".decision .walk").hidden); await settled(P);
        const s = await walkClear(P);
        ok(s.shown && s.words && !!s.heading && !s.onHeading && !s.onCards.length && !s.onCtrls.length && s.inWindow, `${w}px ${k.id}, answered wrong: "Walk me through it" is open, clear of the heading ("${s.heading}"), of the cards and of every control — ${JSON.stringify(s)}`);
        await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); }); await pendingIs(P, null); await frames(P);
      }
      await P.p.close();
    });
  }

  if (FULL) {
    // ==== 15. Nothing answered on the frame sits over the controls row under the video (A2: the layer may reach over
    // the timeline, never the controls). At 1024 × 800 on the answer-in-the-frame walkthrough's k3, answered wrong, the
    // row (Back / "Waits while you read" / Continue) sat over Play, the time and the chapter's name. Every question of
    // that walkthrough and of the videos-you-can-follow walkthrough, asked, and a quick check answered wrong (with "…"
    // opened where the row folded behind it), at 1440 × 900 and 1024 × 800: no chip meets Play, the time, the chapter
    // line or the buttons at the right; each is in the window; and a click at each chip's centre lands on it.
    {
      const IWALK = ".reelplanning/plans/2026-09-25-answer-in-the-frame/walkthrough-video", VWALK = ".reelplanning/plans/2026-09-25-videos-you-can-follow/walkthrough-video";
      const barClear = (P) => P.p.evaluate(() => {
        const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision");
        const seen = (x) => x.getClientRects().length > 0 && x.getBoundingClientRect().width > 0 && getComputedStyle(x).visibility !== "hidden";
        const meet = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
        const name = (x) => (x.dataset.more ? `More ${x.dataset.more}` : x.dataset.sverdict || (x.textContent || x.placeholder || x.className).replace(/\s+/g, " ").trim().slice(0, 28));
        const bar = [...r.querySelectorAll(".transport > :not(.scrub)")].filter(seen).map((x) => ({ n: x.className || x.dataset.act, b: x.getBoundingClientRect() }));
        const chips = [...d.querySelectorAll("button, input, textarea, .hint, .feedback, .blong, .fwhy, .walk, .own.open, .disagree"), ...r.querySelectorAll(".hits .cmore")].filter(seen);
        const over = chips.flatMap((c) => bar.filter((x) => meet(c.getBoundingClientRect(), x.b)).map((x) => `${name(c)} over ${x.n}`));
        const out = chips.filter((c) => { const b = c.getBoundingClientRect(); return b.left < 0 || b.top < 0 || b.right > innerWidth || b.bottom > innerHeight; }).map(name);
        const blocked = [...d.querySelectorAll("button")].filter(seen).filter((x) => { const b = x.getBoundingClientRect(), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2; const at = r.elementFromPoint(cx, cy); return !(at && (at === x || x.contains(at))); }).map(name);
        return { id: el.pendingId(), onframe: d.classList.contains("onframe"), n: chips.length, over, out, blocked, fold: d.dataset.rowfold || "0", more: !(d.querySelector(".rowmore")?.hidden ?? true) };
      });
      await unit("controls-row", async () => {
      const seenFold = { 1: 0, 2: 0 };
      for (const [w, h] of [[1440, 900], [1024, 800]]) for (const V of [IWALK, VWALK]) {
        P = await open(V, { w, h });
        const tag = `${w}px ${V === IWALK ? "answer-in-the-frame" : "videos-you-can-follow"} walkthrough`;
        for (const pt of await points(P)) {
          await playInto(P, pt.at);
          let s = await barClear(P);
          ok(s.id === pt.id && !s.over.length && !s.out.length && !s.blocked.length, `${tag} ${pt.id}, asked${s.onframe ? " on the frame" : ""}: its ${s.n} chips clear of the controls row, in the window, each what a click lands on — over ${JSON.stringify(s.over)}, out ${JSON.stringify(s.out)}, blocked ${JSON.stringify(s.blocked)}`);
          if (pt.kind === "check") {
            const k = await P.p.evaluate((id) => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === id)?.answer, pt.id);
            await clickCard(P, pt.options.find((o) => o !== k));
            s = await barClear(P); if (s.fold !== "0") seenFold[s.fold]++;
            ok(!s.over.length && !s.out.length && !s.blocked.length, `${tag} ${pt.id}, answered wrong${s.fold !== "0" ? ` (the row folded: ${s.fold === "2" ? "behind …" : "the hint gone"})` : ""}: its ${s.n} chips clear of the controls row, in the window, each what a click lands on — over ${JSON.stringify(s.over)}, out ${JSON.stringify(s.out)}, blocked ${JSON.stringify(s.blocked)}`);
            if (s.more) {
              await P.rp.locator(".decision .rowmore").click(); await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("rowopen")); await frames(P);
              const m = await barClear(P), inMenu = await P.p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".decision [data-folded]")].filter((x) => x.getBoundingClientRect().height > 0).map((x) => x.textContent.trim().slice(0, 30)));
              ok(inMenu.length > 0 && !m.over.length && !m.out.length && !m.blocked.length, `${tag} ${pt.id}: "…" opens the folded chips (${JSON.stringify(inMenu)}), clear of the controls row, each what a click lands on — over ${JSON.stringify(m.over)}, blocked ${JSON.stringify(m.blocked)}`);
            }
          }
          await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); }); await pendingIs(P, null); await frames(P);
        }
        await P.p.close();
      }
      ok(seenFold[1] + seenFold[2] >= 1, `the row folded where it had no room above the controls — ${JSON.stringify(seenFold)}`);
      });
      // a window too short for even that (1024 × 660): Continue and "…", and "…" holds the rest, each still working
      await unit("controls-row-660", async () => {
        P = await open(IWALK, { w: 1024, h: 660 });
        const k = (await points(P)).find((x) => x.id === "k3"), ans = await P.p.evaluate(() => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === "k3").answer);
        await playInto(P, k.at); await clickCard(P, k.options.find((o) => o !== ans));
        let s = await barClear(P);
        ok(s.fold === "2" && s.more && !s.over.length && !s.blocked.length, `1024 × 660, k3 answered wrong: the row is Continue and "…", clear of the controls row — ${JSON.stringify(s)}`);
        await P.rp.locator(".decision .rowmore").click(); await until(P, () => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("rowopen")); await frames(P);
        s = await barClear(P);
        const menu = await P.p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".decision [data-folded]")].filter((x) => x.getBoundingClientRect().height > 0).map((x) => x.textContent.trim()));
        ok(menu.some((x) => /Back to where/.test(x)) && menu.some((x) => /Read why in full/.test(x)) && !s.over.length && !s.blocked.length, `"…" opens the folded chips over the frame, each what a click lands on — ${JSON.stringify(menu)}`);
        const t0 = await P.p.evaluate(() => document.querySelector("#rp").player.currentTime);
        await P.rp.locator(".decision .backbtn").click(); await until(P, (t0) => document.querySelector("#rp").player.currentTime < t0 - 1, t0);
        const t1 = await P.p.evaluate(() => document.querySelector("#rp").player.currentTime);
        ok(t1 < t0 - 1, `"Back to where this was explained" from the "…" menu takes the video back — ${t0.toFixed(1)} → ${t1.toFixed(1)}`);
        await P.p.close();
      });
    }
  }

  // ==== 16. A quick check answered on the frame: nothing laid out by the cards covers a card's own words. On the
  // answer-on-the-video walkthrough's k1 ("A pick-all question: you click B", cards stacked in a column), answered
  // wrong with A, the why under A and "Expected something else?" sat over card B, its words showing between them.
  // Every quick check of this plan's video and of the answer-in-the-frame walkthrough, answered wrong with a click, at
  // 1440 × 900; and k1 again zoomed in to 200%: no why, note, chip or card tag meets any card's words.
  {
    const IWALK = ".reelplanning/plans/2026-09-25-answer-in-the-frame/walkthrough-video";
    const SHOTS16 = process.env.RP_SHOTS || null;
    const wordsClear = (P) => P.p.evaluate(() => {
      const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), p = el._pendingDecision, q = p.kind === "quiz" ? p.q : p;
      const cid = q.compositionId || el.planMap.frames.find((f) => f.index === q.frameIndex)?.compositionId;
      const ifr = el.player.iframeElement, doc = ifr.contentDocument, win = doc.defaultView, fr = ifr.getBoundingClientRect(), sx = fr.width / win.innerWidth, sy = fr.height / win.innerHeight;
      const root = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === cid);
      const outer = (els) => els.filter((x) => !els.some((o) => o !== x && o.contains(x)));
      const cardOf = (letter, i) => { const sel = [`[data-option="${letter}"]`, `[data-plan-option="${letter}"]`, ...["opt", "option", "choice", "chip"].map((s) => `[id$="-${s}-${letter}"]`)].join(","); return outer([...root.querySelectorAll(sel)])[0] || outer([...root.querySelectorAll("*")].filter((x) => [...x.classList].some((c) => /-opt$/.test(c))))[i]; };
      const words = q.options.flatMap((o, i) => { const c = cardOf(o.id, i); if (!c) return []; const rg = doc.createRange(); rg.selectNodeContents(c);
        return [...rg.getClientRects()].filter((x) => x.width > 2 && x.height > 2).map((x) => ({ id: o.id, l: fr.left + x.left * sx, t: fr.top + x.top * sy, r: fr.left + x.right * sx, b: fr.top + x.bottom * sy })); });
      const seen = (x) => x.getClientRects().length > 0 && x.getBoundingClientRect().width > 0 && getComputedStyle(x).display !== "none" && getComputedStyle(x).visibility !== "hidden";
      const name = (x) => x.classList.contains("fwhy") ? `why ${x.dataset.for}` : x.classList.contains("tag") ? `tag ${x.parentElement.dataset.hit}` : (x.textContent || x.placeholder || x.className).replace(/\s+/g, " ").trim().slice(0, 28);
      const boxes = [...d.querySelectorAll(".fwhy, .disagree, .note, .feedback, .blong, .hint, .own, .walk, button, input"), ...r.querySelectorAll(".hits .hit .tag")].filter(seen).filter((x) => !d.contains(x) || !x.closest(".hd"));
      const meets = (b, w) => b.left < w.r - 1 && w.l < b.right - 1 && b.top < w.b - 1 && w.t < b.bottom - 1;
      const over = [...new Set(boxes.flatMap((x) => { const b = x.getBoundingClientRect(); return words.filter((w) => meets(b, w)).map((w) => `${name(x)} over card ${w.id.toUpperCase()}'s words`); }))];
      return { id: el.pendingId(), onframe: d.classList.contains("onframe"), words: words.length, n: boxes.length, over, whys: [...d.querySelectorAll(".fwhy")].map((x) => x.hidden ? "tag" : x.hasAttribute("data-inside") ? "inside" : "under"), tags: [...r.querySelectorAll(".hits .hit .tag")].filter(seen).map((x) => x.textContent) };
    });
    if (FULL) await unit("words-clear", async () => {
      let seenOn = 0;
      for (const [V, tag] of [[PLAN, "answer-on-the-video video"], [IWALK, "answer-in-the-frame walkthrough"]]) {
        P = await open(V, { w: 1440, h: 900 });
        for (const pt of (await points(P)).filter((x) => x.kind === "check")) {
          const ans = await P.p.evaluate((id) => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === id)?.answer, pt.id);
          await playInto(P, pt.at);
          const wrong = pt.options.find((o) => o !== ans);
          await clickCard(P, wrong);
          const s = await wordsClear(P);
          if (s.onframe) seenOn++;
          ok(!s.over.length && (!s.onframe || s.words > 0), `1440px ${tag} ${pt.id}, answered wrong with ${wrong.toUpperCase()}${s.onframe ? " on the frame" : ""}: no why, note, chip or tag meets a card's words (${s.words} lines of card words, ${s.n} boxes; the whys ${JSON.stringify(s.whys)}${s.tags.length ? `, on the tags ${JSON.stringify(s.tags)}` : ""}) — ${JSON.stringify(s.over)}`);
          if (SHOTS16 && V === PLAN && pt.id === "k1") await P.p.screenshot({ path: join(SHOTS16, "k1-answered-wrong-1440.png") }).catch(() => {});
          await P.p.evaluate(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); }); await pendingIs(P, null); await frames(P);
        }
        await P.p.close();
      }
      ok(seenOn >= 3, `quick checks answered on the frame were checked — ${seenOn}`);
    });
    // zoomed in to 200%: the same quick check, the whys by the cards in the bigger picture, still clear of every card's words
    await unit("words-200", async () => {
    P = await open(PLAN, { w: 1440, h: 900 });
    await P.p.evaluate(() => document.querySelector("#rp").setSize(200)); await until(P, () => document.querySelector("#rp").zoomed()); await frames(P);
    const k1 = (await points(P)).find((x) => x.id === "k1"), a1 = await P.p.evaluate(() => document.querySelector("#rp").planMap.quizzes.find((q) => q.id === "k1").answer);
    await playInto(P, k1.at); await clickCard(P, k1.options.find((o) => o !== a1));
    const z = await wordsClear(P);
    ok(z.onframe && z.words > 0 && !z.over.length, `200%: k1 answered wrong on the frame, nothing over a card's words (the whys ${JSON.stringify(z.whys)}) — ${JSON.stringify(z.over)}`);
    if (SHOTS16) await P.p.screenshot({ path: join(SHOTS16, "k1-answered-wrong-200.png") }).catch(() => {});
    await P.p.evaluate(() => document.querySelector("#rp").setSize(100)); await P.p.close();
    });
  }
} catch (e) { fails.push("threw: " + String(e?.stack || e).slice(0, 400)); console.log(e); }

await b.close(); srv.close();
const missed = dealt.filter((u) => !ran.includes(u));
if (missed.length && !fails.some((f) => f.startsWith("threw: "))) fails.push(`units listed in UNITS for this pass that never ran: ${missed.join(", ")}`);
console.log(`\n${SHARD ? `shard ${SHARD.k}/${SHARD.n}` : "unsharded"}: ${checks} checks in ${ran.length} units (${ran.join(", ")})${SHARD ? "" : FULL ? `; the full pass is recorded as ${FULL_CHECKS}` : ""}`);
console.log(fails.length ? `\n✗ ${fails.length} failed:\n${fails.join("\n")}` : "\n✓ all passed");
process.exit(fails.length ? 1 : 0);
