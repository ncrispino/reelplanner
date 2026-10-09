#!/usr/bin/env node
// Every page a scene opens works before anyone sees it (deep-dives step 6). A beat's `- detail: <name>` must have
// its page at <video-dir>/details/<name>.html, and the page must:
//   - load nothing from the network: no http(s) (or protocol-relative) URL in src, href, url(), @import,
//     import or fetch; no <script src> or stylesheet <link> at all (everything inline)
//   - carry the bridge (the inline script that posts "rp-detail" messages to the player)
//   - open in headless Chromium without a page error, ask for nothing outside its own folder, post
//     "ready", and post "anchor" when an anchored element is clicked (when playwright-core is installed)
// A part of the guide a scene opens (`- guide: <part>`, the plan guide) is checked the same way, at guide/<part>.html:
// the local review page (packages/player/index.html, `npm run review`) has no guide under its player and opens that
// page over the frame. A bundled review page never does (it reads the part in the guide under the video, and waits
// for the guide when it is asked for one before it is there), so bundle-player leaves the part pages out.
// A video with no details passes untouched, without starting a browser. `detail_kind` is optional and a
// free word (D-085): only the page itself is checked. Two details on one beat are a warning (the last opens).
// Details in the frame: a frame that marks (data-detail) a name its scene does not give fails; a scene whose
// detail its frame marks nowhere is a warning, a failure under `details_check: strict` in the front matter.
//
// usage: reelplanner check-details <video-dir> [--no-browser]
//        reelplanner check-details --page <file.html> [<file.html> …] [--no-browser]
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { launchOpts } from "./lib/env.mjs";
import { NAME, storyboardDetails } from "./lib/details.mjs";
import { parseHtml, elements } from "./lib/frame-html.mjs";

const argv = process.argv.slice(2);
const noBrowser = argv.includes("--no-browser");
const pageMode = argv.includes("--page");
const args = argv.filter((a) => !a.startsWith("--"));
if (!args.length) { console.error("usage: reelplanner check-details <video-dir> [--no-browser] | --page <file.html> …"); process.exit(1); }

const fails = [], warns = [];
const fail = (where, msg) => fails.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);
let pages = [];   // [{ label, file }]

if (pageMode) pages = args.map((f) => ({ label: f, file: resolve(f) }));
else {
  const dir = resolve(args[0]);
  if (!existsSync(join(dir, "STORYBOARD.md"))) { console.error(`✗ ${args[0]}: no STORYBOARD.md`); process.exit(1); }
  const beats = storyboardDetails(readFileSync(join(dir, "STORYBOARD.md"), "utf8"));
  const names = new Map();   // name → where it is linked from
  const kindOf = new Map();
  for (const b of beats) {
    const at = `frame ${b.frame}${b.title ? ` (${b.title})` : ""}`;
    if (b.names.length > 1) warn(at, `${b.names.length} detail tags: only the last (${b.name}) opens; a beat rarely needs more than one`);
    if (!b.name) { fail(at, "detail_* tags without a `- detail: <name>`"); continue; }
    if (!NAME.test(b.name)) { fail(at, `detail "${b.name}": lower-case letters, digits and dashes only (it is the file name)`); continue; }
    if (!b.why) warn(at, `detail ${b.name} has no detail_why (the one sentence the narration says about what opening it gives you)`);
    if (names.has(b.name)) warn(at, `detail ${b.name} is also linked from ${names.get(b.name)}`);
    names.set(b.name, at); kindOf.set(b.name, b.kind || "fresh");
  }
  // Details in the frame (plan 2026-09-27, step 1): the storyboard says which details a scene has, its frame
  // where (data-detail="<name>" on the thing the page explains). A frame that marks a name its scene does not
  // have fails; a scene whose `- detail:` its frame marks nowhere is a warning, and a failure on a storyboard
  // that carries `details_check: strict`. Older storyboards pass as they are.
  const sbText = readFileSync(join(dir, "STORYBOARD.md"), "utf8");
  const strict = /^details_check:\s*["']?strict["']?\s*$/mi.test((sbText.match(/^---\n([\s\S]*?)\n---/) || [])[1] || "");
  const unmarked = [];
  for (const blk of sbText.split(/\n(?=## Frame )/).slice(1)) {
    const head = blk.match(/^## Frame (\d+)(?: — (.+))?$/m); if (!head) continue;
    const at = `frame ${head[1]}${head[2] ? ` (${head[2].trim()})` : ""}`;
    const src = blk.match(/^- src:\s*(\S+)/m)?.[1];
    let file = src ? join(dir, src) : null;
    if (!file || !existsSync(file)) { const fd = join(dir, "compositions", "frames"); const f = existsSync(fd) ? readdirSync(fd).find((x) => x.startsWith(`${head[1].padStart(2, "0")}-`) && x.endsWith(".html")) : null; file = f ? join(fd, f) : null; }
    // a part of the guide (`- guide: <part>[#<place>]`, the plan guide) is marked and opened as a detail is
    const given = [...blk.matchAll(/^- detail:\s*(.+)$/gm), ...blk.matchAll(/^- guide:\s*([^#\s]+)/gm)].map((m) => m[1].trim()), opens = given.at(-1);
    // an element's attribute, not text: a real thing on screen may show the words data-detail="…" (a run of
    // frame-lint, say) without marking anything, and a mark inside an HTML comment does not count
    const marks = file ? [...elements(parseHtml(readFileSync(file, "utf8")))].filter((e) => "data-detail" in e.attrs).map((e) => String(e.attrs["data-detail"]).trim()) : [];
    for (const n of new Set(marks)) if (!given.includes(n)) fail(at, `its frame marks data-detail="${n}", a detail the storyboard does not give this scene${given.length ? ` (it gives ${given.join(", ")})` : ""}`);
    const guided = [...blk.matchAll(/^- guide:\s*([^#\s]+)/gm)].map((m) => m[1].trim());
    if (opens && file && !marks.includes(opens)) unmarked.push([at, opens, guided.includes(opens) && !blk.match(/^- detail:/m)]);
  }
  // a part of the guide may open from the corner chip where the frame marks nothing (the plan guide, step 3): said, never failed
  for (const [at, n, part] of unmarked) (strict && !part ? fail : warn)(at, `${part ? "guide part" : "detail"} ${n}: nothing in its frame is marked data-detail="${n}" (the thing ${part ? "the part" : "the page"} explains), so the player shows the corner chip${strict && !part ? " (details_check: strict)" : ""}`);
  // the plan map's pages: a map written before a tag was removed would still send the player to one, and the guide's
  // parts it lists (built by `reelplanner guide` into guide/, never committed) must each be there
  const guided = new Map();
  try { for (const d of JSON.parse(readFileSync(join(dir, "plan-map.json"), "utf8")).details || []) { if (d.guide) { guided.set(d.name, `frame ${d.frameIndex}`); continue; } if (!names.has(d.name)) names.set(d.name, `plan-map.json (frame ${d.frameIndex}; rerun plan-map)`); } } catch {}
  if (!names.size && !guided.size) { console.log(`✓ check-details ${args[0]}: no details`); process.exit(0); }
  for (const [name, at] of names) {
    const file = join(dir, "details", `${name}.html`);
    if (!existsSync(file)) fail(`detail ${name}`, `details/${name}.html is missing (linked from ${at}); start it with: reelplanner detail new ${args[0]} ${name} --kind ${kindOf.get(name) || "<kind>"}`);
    else pages.push({ label: `details/${name}.html`, file });
  }
  for (const [name, at] of guided) {
    const file = join(dir, "guide", `${name}.html`);
    if (!existsSync(file)) fail(`guide part ${name}`, `guide/${name}.html is missing (opened from ${at}); build the guide: reelplanner guide ${args[0]}`);
    else pages.push({ label: `guide/${name}.html`, file });
  }
  if (existsSync(join(dir, "details"))) for (const f of readdirSync(join(dir, "details")).filter((f) => f.endsWith(".html")))
    if (!names.has(f.replace(/\.html$/, ""))) warn(`details/${f}`, "no beat links to it");
}

// ---- static: what the file says ----
// Text that is only shown (a code line, a JSON data block, a comment) is not a load, so it is taken out
// before looking: a code page may well show `fetch("https://…")`. Anything that really loads is caught
// again by the browser below.
const shownOnly = (html) => html
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<script\b[^>]*type=["']?application\/(?:ld\+)?json["']?[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<(pre|code|textarea|xmp)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
const REMOTE = String.raw`(?:https?:)?\/\/(?!\/)`;
const NETWORK = [
  [new RegExp(String.raw`\b(?:src|href|srcset|poster|action|formaction|data|background|xlink:href)\s*=\s*["']?\s*${REMOTE}`, "i"), "an attribute points at a network URL"],
  [new RegExp(String.raw`url\(\s*["']?\s*${REMOTE}`, "i"), "a CSS url() points at a network URL"],
  [new RegExp(String.raw`@import\s+(?:url\()?\s*["']?\s*${REMOTE}`, "i"), "a CSS @import from the network"],
  [new RegExp(String.raw`\bimport\s*(?:\(\s*|[\w{}\s,*]+from\s*)["'\`]\s*${REMOTE}`, "i"), "a script import from the network"],
  [new RegExp(String.raw`\b(?:fetch|XMLHttpRequest|EventSource|WebSocket|sendBeacon|importScripts)\b[^;\n]{0,80}["'\`]\s*(?:https?|wss?):\/\/`, "i"), "a request to a network URL"],
];
const staticCheck = ({ label, file }) => {
  const html = readFileSync(file, "utf8"), code = shownOnly(html);
  for (const [re, what] of NETWORK) { const m = code.match(re); if (m) fail(label, `${what}: ${m[0].trim().slice(0, 90)}`); }
  if (/<script\b[^>]*\bsrc\s*=/i.test(code)) fail(label, "a <script src>: put the script inline (a detail is one self-contained file)");
  if (/<link\b[^>]*rel\s*=\s*["']?stylesheet/i.test(code)) fail(label, "a stylesheet <link>: put the styles inline");
  const scripts = [...html.matchAll(/<script\b(?![^>]*type=["']?application\/json)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join("\n");
  if (!(/postMessage/.test(scripts) && /["']rp-detail["']/.test(scripts) && /["']ready["']/.test(scripts) && /data-anchor/.test(scripts)))
    fail(label, "no bridge: the rp-bridge script (templates/details/*.html, the last <script>) must be in the page, unchanged");
  if (!/<title>[^<]+<\/title>/i.test(html)) warn(label, "no <title> (the player's panel shows it)");
};
for (const p of pages) staticCheck(p);

// ---- in a browser: it opens, asks for nothing it should not, and the bridge answers ----
let browserNote = "";
if (pages.length && !noBrowser) {
  let chromium = null;
  try { ({ chromium } = await import("playwright-core")); } catch { browserNote = " (not opened in a browser: playwright-core is not installed)"; }
  let browser = null;
  if (chromium) { try { browser = await chromium.launch(launchOpts()); } catch (e) { browserNote = ` (not opened in a browser: Chromium did not start: ${String(e.message).split("\n")[0]})`; } }
  if (browser) {
    for (const { label, file } of pages) {
      if (!existsSync(file)) continue;
      const own = pathToFileURL(resolve(file, "..")).href + "/";
      for (const theme of ["light", "dark"]) {
        const page = await browser.newPage({ viewport: { width: 560, height: 800 } });
        const errs = [], asked = new Set(), missing = new Set();
        page.on("pageerror", (e) => errs.push(String(e.message || e).split("\n")[0]));
        const mine = (u) => /^(data|blob|about):/.test(u) || u.startsWith(own);
        page.on("request", (r) => { if (!mine(r.url())) asked.add(r.url()); });
        page.on("requestfailed", (r) => { if (r.url().startsWith(own)) missing.add(r.url()); });
        await page.route(/^(https?|wss?):/, (route) => route.abort());   // nothing reaches the network, even while it is being reported
        await page.addInitScript(() => { window.__rp = []; window.addEventListener("message", (e) => { if (e.data && e.data.type === "rp-detail") window.__rp.push(e.data); }); });
        const where = `${label}${theme === "dark" ? " (?theme=dark)" : ""}`;
        try {
          await page.goto(pathToFileURL(file).href + (theme === "dark" ? "?theme=dark" : ""), { waitUntil: "load", timeout: 15000 });
          await page.waitForFunction(() => window.__rp.some((m) => m.event === "ready"), null, { timeout: 3000 }).catch(() => fail(where, "the bridge never posted \"ready\""));
          if (theme === "light") {
            // the first visible anchored element: a click on it must post an "anchor" message naming it.
            // The click lands on a spot of the element that is not a control inside it (A9: a control there
            // acts rather than comments), so a row that starts with a button is still tested fairly.
            const a = await page.evaluate(() => {
              const CONTROL = "button,a,input,select,textarea,label,summary,[role=button],[data-no-anchor]";
              for (const el of document.querySelectorAll("[data-anchor]")) {
                let r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
                el.scrollIntoView({ block: "center" }); r = el.getBoundingClientRect();
                for (const fy of [0.5, 0.25, 0.75]) for (const fx of [0.02, 0.5, 0.25, 0.75, 0.98]) {
                  const x = r.left + Math.max(2, Math.min(r.width - 2, r.width * fx)), y = r.top + r.height * fy;
                  const hit = document.elementFromPoint(x, y); if (!hit || !el.contains(hit)) continue;
                  const c = hit.closest(CONTROL); if (c && c !== el && el.contains(c)) continue;
                  return { label: el.getAttribute("data-anchor"), x, y };
                }
              }
              return null;
            });
            if (a) {
              await page.mouse.click(a.x, a.y);
              const got = await page.waitForFunction(() => window.__rp.find((m) => m.event === "anchor"), null, { timeout: 1500 }).then((h) => h.jsonValue()).catch(() => null);
              if (!got) fail(where, `a click on [data-anchor="${a.label}"] posted no "anchor" message`);
            }
          }
        } catch (e) { fail(where, `did not load: ${String(e.message).split("\n")[0]}`); }
        for (const e of new Set(errs)) fail(where, `page error: ${e}`);
        for (const u of asked) fail(where, `asked for ${u.slice(0, 120)} (a detail loads nothing from the network or outside details/)`);
        for (const u of missing) fail(where, `asked for a file that is not there: ${u.slice(own.length) || u}`);
        await page.close();
      }
    }
    await browser.close();
  }
} else if (noBrowser) browserNote = " (--no-browser: not opened in a browser)";

for (const w of warns) console.log(`  ! ${w}`);
if (fails.length) {
  for (const f of fails) console.error(`✗ ${f}`);
  console.error(`✗ check-details: ${fails.length} problem(s) in ${pages.length} page(s)${browserNote}`);
  process.exit(1);
}
console.log(`✓ check-details: ${pages.length} page(s) ok: ${pages.map((p) => basename(p.file)).join(", ")}${browserNote}`);
