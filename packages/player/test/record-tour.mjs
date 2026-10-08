#!/usr/bin/env node
// A screen recording of the review page, for the README's full loop (docs/media/review-page.gif): the real player and
// guide, driven by Playwright through a scripted tour with a visible cursor (a recording shows no pointer, so a dot
// is drawn where the mouse goes, and rings when it clicks). The tour, about 45 s: Start, the video plays, the
// timeline's chapters; it stops at question 1, a note and a click on a card answer it; a box marked on the frame
// with a comment; Terms; Ask; speed and size; scrolled down, the small player and the guide under it, a diagram
// stepped through, a worked example's tab, words highlighted and noted; back up, Finish review's summary (nothing
// is sent). Not a spec (the runner leaves it out): it sits with them because it drives the page as they do.
//
// It runs on the plan guide's plan video (.reelplanning/plans/2026-09-28-plan-guide/video), bundled into a scratch
// folder with `bundle-player`; the tour's clicks name things in that video and its guide. The video's assets/ (its
// voice and fonts) are build output, not in git: build them first (`reelplanning narrate`, or copy them from the
// checkout that built it), or the frames fall back to other faces.
//
// usage: node packages/player/test/record-tour.mjs <out.gif> [--webm <file>] [--width 1000] [--fps 10] [--speed 1.35] [--colors 64]
//   writes the GIF (ffmpeg, a palette made for it), the tour played --speed times faster; --webm keeps the raw
//   recording (1280×800) too. Nothing in the repo is changed but <out.gif>.
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readdirSync, copyFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, launchOpts, serverUp, staticServer } from "../../../scripts/lib/env.mjs";
import { until, loaded, settled } from "./wait.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const WEBM = opt("--webm"), WIDTH = +opt("--width", 1000), FPS = +opt("--fps", 10), SPEED = +opt("--speed", 1.35), COLORS = +opt("--colors", 64), OUT = args[0] && resolve(args[0]);
if (!OUT) { console.error("usage: node packages/player/test/record-tour.mjs <out.gif> [--webm <file>] [--width 1000] [--fps 10] [--speed 1.35] [--colors 64]"); process.exit(2); }

const VIDEO = ".reelplanning/plans/2026-09-28-plan-guide/video", SLUG = "2026-09-28-plan-guide";
const VIEW = { width: 1280, height: 800 };
const T = mkdtempSync(join(tmpdir(), "rp-tour-")), PAGE = join(T, "page"), REC = join(T, "rec");
execFileSync(process.execPath, [join(ROOT, "scripts/bundle-player.mjs"), PAGE, join(ROOT, VIDEO), "--reelplanning", join(ROOT, ".reelplanning")], { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
const port = 8000 + Math.floor(Math.random() * 900), srv = staticServer(port, { dir: PAGE });
await serverUp(port, { child: srv });

// the cursor: a dot on the top page, over everything, moved by the tour itself (the frames inside the page would
// keep a mousemove from the top page's listeners)
const CURSOR = () => {
  if (window.top !== window) return;
  const put = () => {
    const s = document.createElement("style");
    s.textContent = `#tour-dot{position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:rgba(20,20,20,.55);border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35),0 2px 6px rgba(0,0,0,.3);z-index:2147483647;pointer-events:none;transition:transform .12s}
      #tour-dot.down{transform:scale(.7)} .tour-ring{position:fixed;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:2px solid rgba(200,80,40,.9);z-index:2147483646;pointer-events:none;animation:tour-ring .45s ease-out forwards}
      @keyframes tour-ring{from{transform:scale(.3);opacity:1}to{transform:scale(1.2);opacity:0}}`;
    const d = document.createElement("div"); d.id = "tour-dot"; d.style.left = "640px"; d.style.top = "400px";
    document.documentElement.append(s, d);
  };
  if (document.documentElement) put(); else addEventListener("DOMContentLoaded", put);
};

const b = await chromium.launch(launchOpts());
const ctx = await b.newContext({ viewport: VIEW, deviceScaleFactor: 1, recordVideo: { dir: REC, size: VIEW } });
await ctx.addInitScript(CURSOR);
const p = await ctx.newPage(), t0 = Date.now(), errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
const rp = p.locator("#rp"), wait = (ms) => p.waitForTimeout(ms);

// the dot glides by a CSS transition, so a move is one call to the page, not one a step
const dot = (x, y, ms = 0, cls = "") => p.evaluate(([x, y, ms, cls]) => { const d = document.getElementById("tour-dot"); if (!d) return;
  d.style.transition = `left ${ms}ms cubic-bezier(.45,0,.25,1), top ${ms}ms cubic-bezier(.45,0,.25,1), transform .12s`; d.style.left = x + "px"; d.style.top = y + "px"; d.style.transform = "";
  d.classList.toggle("down", cls === "down" || cls === "hold");
  if (cls === "down") { const r = document.createElement("div"); r.className = "tour-ring"; r.style.left = x + "px"; r.style.top = y + "px"; document.documentElement.append(r); setTimeout(() => r.remove(), 600); } }, [x, y, ms, cls]);
async function move(x, y, ms = 400) { await dot(x, y, ms); await p.mouse.move(x, y, { steps: 5 }); await wait(ms); }
async function click(x, y, ms = 400) { await move(x, y, ms); await wait(100); await dot(x, y, 0, "down"); await p.mouse.click(x, y); await wait(120); await dot(x, y, 0, "up"); }
async function drag(x1, y1, x2, y2, ms = 500) { await move(x1, y1); await dot(x1, y1, 0, "down"); await p.mouse.down(); await dot(x2, y2, ms, "hold"); await p.mouse.move(x2, y2, { steps: 12 }); await wait(ms);
  await p.mouse.up(); await dot(x2, y2, 0, "up"); }
const centre = async (loc) => { const r = await loc.boundingBox(); if (!r) throw new Error(`not on the page: ${loc}`); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
const press = async (loc, ms) => { const c = await centre(loc); await click(c.x, c.y, ms); };
const type = (text) => p.keyboard.type(text, { delay: 28 });
const R = (f, a) => p.evaluate(f, a);
const guide = () => p.frames().find((f) => /\/guide\/index\.html\?/.test(f.url()));
// a thing in the guide's frame, in the page's coordinates
async function inGuide(sel, i = 0) {
  const off = await R(() => { const r = document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect(); return { x: r.left, y: r.top }; });
  const r = await guide().evaluate(([sel, i]) => { const r = document.querySelectorAll(sel)[i].getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, [sel, i]);
  return { x: off.x + r.x + r.w / 2, y: off.y + r.y + r.h / 2, top: off.y + r.y, bottom: off.y + r.y + r.h };
}
// the guide, scrolled by its own page until a thing in it is at y on the page: eased over `ms`, however far (a long
// scroll at the browser's own pace is many frames of a GIF that change everywhere)
async function scrollGuideTo(sel, i, y, ms = 700) {
  const want = y - (await R(() => document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect().top));
  await guide().evaluate(([sel, i, want, ms]) => new Promise((done) => {
    const y0 = scrollY, y1 = Math.min(y0 + document.querySelectorAll(sel)[i].getBoundingClientRect().top - want, document.documentElement.scrollHeight - innerHeight), t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms), e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2; scrollTo(0, y0 + (y1 - y0) * e); k < 1 ? requestAnimationFrame(step) : done(); };
    requestAnimationFrame(step); }), [sel, i, want, ms]);
}
const marks = [];
const mark = (name) => marks.push([name, (Date.now() - t0) / 1000]);

try {
  await p.goto(`http://127.0.0.1:${port}/?project=${SLUG}`); await loaded(p);
  await until(p, () => document.querySelector("#rp-guide")?.ready, null, 30000);
  await R(() => document.fonts.ready); await wait(400);
  mark("ready");
  // ---- Start: the video plays; the timeline, its chapters and stops
  await wait(700);
  await press(rp.locator(".before button", { hasText: "Start" }), 500);
  await wait(1800);
  const sc = await rp.locator(".scrub").boundingBox(), dur = await R(() => document.querySelector("#rp").player.duration), xAt = (t) => sc.x + sc.width * t / dur, ySc = sc.y + sc.height / 2;
  await move(xAt(30), ySc, 450); await wait(400); await move(xAt(100), ySc, 500); await wait(500);
  // ---- a click on the timeline a few seconds before question 1: it plays into it and stops there
  await click(xAt(121.5), ySc, 300);
  await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, 20000); await settled(p);
  mark("question");
  await move(720, 200, 400); await wait(600);
  await press(rp.locator(".decision [data-note]"), 450); await type("Keep the guide read-only for now"); await wait(250); await p.keyboard.press("Enter"); await wait(500);
  const card = await centre(rp.locator('.hits .hit[data-hit="a"]'));
  await move(card.x, card.y, 450); await wait(350); await click(card.x, card.y, 0);
  await wait(1800);
  // ---- pause, Mark: a box on the frame and a comment
  await press(rp.locator('.transport [data-act="play"]').first(), 400); await wait(150);
  await press(rp.locator('[data-act="mark"]'), 400); await wait(150); await press(rp.locator('[data-tool="box"]'), 300);
  const g = await R(() => { const el = document.querySelector("#rp"), d = el.player.iframeElement.contentDocument, fr = el.player.iframeElement.getBoundingClientRect(), w = d.defaultView;
    // the scene's "the guide" box, the one on screen (every scene's boxes are in the page, hidden but one)
    const box = [...d.querySelectorAll('[class$="-box"]')].filter((x) => /^the guide/i.test(x.textContent.trim()) && getComputedStyle(x).visibility === "visible" && +getComputedStyle(x).opacity > 0.5)
      .map((x) => x.getBoundingClientRect()).find((r) => r.width > 0);
    const sx = fr.width / w.innerWidth, sy = fr.height / w.innerHeight; return box ? { x1: fr.left + box.left * sx - 10, y1: fr.top + box.top * sy - 10, x2: fr.left + box.right * sx + 10, y2: fr.top + box.bottom * sy + 10 } : null; });
  if (!g) throw new Error("no 'the guide' box on the frame");
  await drag(g.x1, g.y1, g.x2, g.y2, 500); await wait(200);
  await type("Show the guide's own address here"); await wait(300); await p.keyboard.press("Enter"); await wait(400);
  await press(rp.locator('[data-act="mark"]'), 350); await wait(200);
  mark("marked");
  // ---- Terms: what the words mean; Ask: a question about this scene (it goes with the review)
  await press(rp.locator('[data-act="terms"]'), 450); await wait(1000);
  await move(940, 450, 350); await p.mouse.wheel(0, 260); await wait(900);
  await press(rp.locator('[data-act="ask"]'), 500); await wait(250);
  await type("Why not edit the guide directly?"); await wait(200);
  await press(rp.locator('.ask [data-act="ask-send"]'), 350); await wait(1100);
  await press(rp.locator('.dpanel [data-act="detail-close"]').first(), 350); await wait(200);
  // ---- speed and size
  await press(rp.locator('[data-act="speed"]'), 450); await wait(150);
  { const k = await rp.locator(".sppop [data-speed]").boundingBox(), y = k.y + k.height / 2; await drag(k.x + k.width * 0.2, y, k.x + k.width * 0.4, y, 350); }   // 1× to 1.5×
  await wait(400); await p.keyboard.press("Escape");
  await press(rp.locator('[data-act="size"]'), 400); await wait(150);
  { const k = await rp.locator(".szpop [data-sizer]").boundingBox(), y = k.y + k.height / 2; await drag(k.x + k.width * 0.375, y, k.x + k.width * 0.19, y, 400); }   // Fit (100 %) to 70 %
  await wait(500); await press(rp.locator('.szpop [data-act="size-fit"]'), 350); await wait(400); await p.keyboard.press("Escape");
  mark("controls");
  // ---- scroll down: the small player, and the guide under it (the video stays paused: a GIF of it playing in the
  // corner while the guide moves is mostly that)
  await move(560, 420, 300);
  for (let k = 0; k < 40 && !(await R(() => document.querySelector("#rp-guide").atGuide())); k++) { await p.mouse.wheel(0, 90); await wait(30); }
  await until(p, () => document.querySelector("#rp-guide")._scrollOn === true); await wait(500);
  mark("guide");
  // a diagram, stepped through
  await scrollGuideTo("[data-dgstep=start]", 0, 690); await wait(400);
  { const r = await inGuide("[data-dgstep=start]"); await click(r.x, r.y, 400); } await wait(800);
  for (let k = 0; k < 2; k++) { const r = await inGuide("[data-dgstep=next]"); await click(r.x, r.y, 200); await wait(800); }
  // a worked example: another of its cases
  await scrollGuideTo('[role="tab"]', 0, 230); await wait(300);
  { const r = await inGuide('[role="tab"]', 1); await click(r.x, r.y, 400); } await wait(900);
  // words highlighted in the guide: the note box
  const sel = await guide().evaluate(() => { const el = [...document.querySelectorAll("p")].filter((x) => x.offsetParent && /then opens each in Chromium/.test(x.textContent)).pop();
    const tn = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.includes("then opens")), i = tn.textContent.indexOf("then opens"), r = document.createRange();
    r.setStart(tn, i); r.setEnd(tn, i + "then opens each in Chromium".length); const rs = r.getClientRects(), a = rs[0], z = rs[rs.length - 1];
    return { x1: a.left + 1, y: a.top + a.height / 2, x2: z.right - 1 }; });
  const off = await R(() => { const r = document.querySelector("#rp-guide").shadowRoot.querySelector("iframe").getBoundingClientRect(); return { x: r.left, y: r.top }; });
  await drag(sel.x1 + off.x, sel.y + off.y, sel.x2 + off.x, sel.y + off.y, 500); await wait(500);
  await type("Which Chromium: the one setup installs?"); await wait(300); await p.keyboard.press("Enter"); await wait(600);
  // ---- back to the video, and Finish review: what would be sent (nothing is)
  await press(rp.locator('[data-act="mini-up"]'), 500); await until(p, () => !document.querySelector("#rp")._mini); await wait(600);
  await press(rp.locator('[data-act="finish"]'), 500); await wait(2800);
  mark("end");
} finally {
  await ctx.close(); await b.close(); srv.kill();
}
if (errs.length) console.error(`page errors:\n  ${errs.join("\n  ")}`);
const webm = join(REC, readdirSync(REC).find((f) => f.endsWith(".webm")));
const from = marks.find(([n]) => n === "ready")[1], to = marks.find(([n]) => n === "end")[1];
console.log(marks.map(([n, s]) => `${n} ${(s - from).toFixed(1)} s`).join(" · "));
if (WEBM) copyFileSync(webm, resolve(WEBM));
// the GIF: from the page ready to the end, sped up, frames that differ by nothing but the recording's noise dropped
// (their time goes to the frame before), one palette for the whole tour, no dithering (flat colours stay flat)
execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", String(from), "-t", String(to - from), "-i", webm, "-vf",
  `setpts=PTS/${SPEED},fps=${FPS},scale=${WIDTH}:-1:flags=lanczos,mpdecimate=hi=768:lo=320:frac=0.33,split[a][b];[a]palettegen=max_colors=${COLORS}:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`,
  "-fps_mode", "vfr", OUT], { stdio: "inherit" });
console.log(`✓ ${OUT}: ${(statSync(OUT).size / 1e6).toFixed(1)} MB, ${((to - from) / SPEED).toFixed(1)} s`);
rmSync(T, { recursive: true, force: true });
