#!/usr/bin/env node
// Pictures of one frame at given seconds, without building the video: the quick look while writing a scene.
//
// usage: reelplanner shoot <video-dir> <frame-id> <second|end> [<second> …] [--out <dir>]
//
// Loads compositions/frames/<frame-id>.html alone on a blank 1920 × 1080 page, with its own <script src> libraries
// (the vendored gsap, the diagram kit's moves) and the faces the render uses: Inter and JetBrains Mono from Google
// Fonts, as the render fetches them, and any face the frame declares itself (with a fallback face the words are
// narrower, and an overflow the render shows is not seen). It seeks the frame's timeline to each second and saves <out>/<frame-id>@<second>.png (out: <video>/snapshots/shoot/). Captions and transitions are
// not in the picture. A page error fails it, since the same frame would throw in the render.
import { readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { launchOpts } from "./lib/env.mjs";

const argv = process.argv.slice(2), oi = argv.indexOf("--out");
const outArg = oi >= 0 ? argv[oi + 1] : null, rest = argv.filter((a, i) => i !== oi && i !== oi + 1 || oi < 0);
const [video, id, ...secs] = rest;
if (!video || !id || !secs.length) { console.error("usage: reelplanner shoot <video-dir> <frame-id> <second|end> … [--out <dir>]"); process.exit(1); }
const dir = resolve(video), file = join(dir, "compositions", "frames", `${id}.html`);
if (!existsSync(file)) { console.error(`✗ no ${file}`); process.exit(1); }
const frame = readFileSync(file, "utf8");
const srcs = [...frame.matchAll(/<script src="([^"]*)"><\/script>/g)].map((m) => m[1]);
const inner = frame.replace(/<\/?template>/g, "").replace(/<script src="[^"]*"><\/script>/g, "");
const out = resolve(outArg || join(dir, "snapshots", "shoot"));
mkdirSync(out, { recursive: true });
const html = `<!doctype html><html><head><meta charset="utf-8"><base href="${pathToFileURL(dir + "/")}">
<style>html,body{margin:0;width:1920px;height:1080px;overflow:hidden}</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=block">
${srcs.map((x) => `<script src="${x}"></script>`).join("")}</head><body>${inner}</body></html>`;
const tmp = join(out, `.${id}.html`); writeFileSync(tmp, html);
const browser = await chromium.launch(launchOpts({ args: ["--no-sandbox", "--allow-file-access-from-files", "--hide-scrollbars"] }));
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g/.test(m.text())) errors.push(m.text()); });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  if (!(await page.evaluate((id) => !!(window.__timelines || {})[id], id))) errors.push(`no timeline "${id}" registered`);
  else for (const s of secs) {
    await page.evaluate(([id, s]) => { const tl = window.__timelines[id]; tl.pause(); tl.seek(s === "end" ? tl.duration() : Number(s), false); }, [id, s]);
    await page.screenshot({ path: join(out, `${id}@${s}.png`) });
  }
} finally { await browser.close(); rmSync(tmp, { force: true }); }
if (errors.length) { console.error("✗ " + [...new Set(errors)].join("\n✗ ")); process.exit(1); }
console.log(`✓ ${secs.length} picture(s) of ${id} in ${out}`);
