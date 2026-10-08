// The guide's pictures: a scene of the video, at the step it shows. Files beside the page, in <guide>/pics/, never
// inline (a data: URL would go into every page that shows it, at one size, stretched on a 2× screen).
//
// Each picture is made from the video's snapshot (taken at 2× device scale by `reelplanning snapshot`, so a
// 1920 × 1080 video gives a 3840 × 2160 PNG) at the widths the page draws it at, 1× and 2×, and whole, for the lightbox:
// WebP, lossless where that is the smaller file (a frame of flat colour and text usually is), else lossy at quality 92.
// A width is never made larger than the snapshot, and the page never draws a picture wider than half its pixels
// (templates/guide/pictures.js), so nothing is stretched. A file's name carries a hash of the snapshot, so a picture
// is made once and a new snapshot makes a new file; `prunePictures` removes the ones no page points at.
//
// A step's picture is not the snapshot (a scene's midpoint catches it half built, its caption burned in, a light slab in
// the dark theme). `stepPictures` takes its own: the scene at its settled end (its end less 0.3 s), the captions hidden,
// in the light theme and the dark, cropped to what is on it (the box round everything that is not the frame's paper,
// 48 px round that, then no taller than 3:2 and no wider than 12:5), at 2× device scale. The picture carries both; the
// page shows the one for its theme (pictures.js).
//
// A scene whose picture is itself a page (a capture of the guide or of the review page, drawn in the frame: an <img>
// inside a data-artifact) would be unreadable in the guide's column (its words 4 to 8 px) and a light slab in the dark
// theme. Such a step's picture is that page, cropped to it: the thing the scene marks (data-detail) where it is one, else
// the largest (two alike side by side, a before and after, stay together), at the capture's own size (one of its pixels
// to one CSS pixel: its words as big as on the page it was taken from). One wider than 950 px keeps the part of it with
// the most on it, 950 px at most, cut at empty columns where it can be (whole blocks left out, none sliced through),
// else all of it. In the dark take, the capture of a light page is drawn in the dark theme's inks (its lightness turned
// over, its hues kept). The whole scene is a click away in the video.
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { basename, extname, join, relative, sep } from "node:path";
import { depFile, launchOpts } from "../env.mjs";
import { servedFile, TYPES } from "../static-server.mjs";

/** The widest the guide draws a picture, in CSS px (templates/guide/guide.css, --measure), and the widths made for it. */
export const SHOWN = 760;
const WIDTHS = [SHOWN, SHOWN * 2];
/** What `sizes` says: the column's width (its padding is 4vw a side under 826 px, clamped at 16 px), else 760 px. */
export const SIZES = `(min-width: ${Math.ceil(SHOWN / 0.92)}px) ${SHOWN}px, 92vw`;

const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "ignore" });
function dims(file) {
  const out = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file], { encoding: "utf8" });
  const [w, h] = out.trim().split(",").map(Number); if (!(w > 0 && h > 0)) throw new Error(`no size for ${file}`); return [w, h];
}
// one WebP: lossless and lossy both made, the smaller kept (text stays exact wherever that costs nothing)
function encode(src, out, w) {
  const vf = w ? ["-vf", `scale=${w}:-2:flags=lanczos`] : [], ll = `${out}.ll.tmp.webp`, lq = `${out}.q.tmp.webp`;
  try {
    ff(["-i", src, ...vf, "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", ll]);
    ff(["-i", src, ...vf, "-c:v", "libwebp", "-quality", "92", "-compression_level", "6", lq]);
    renameSync(statSync(ll).size <= statSync(lq).size ? ll : lq, out);
  } finally { rmSync(ll, { force: true }); rmSync(lq, { force: true }); }
}

/**
 * A snapshot as the guide's picture: { src, srcset, sizes, width, height, full } (URLs relative to `pageDir`), its
 * files written into `picsDir` and their names added to `made`; null when the snapshot is not there or ffmpeg fails.
 */
export function pictureOf(file, { picsDir, pageDir = join(picsDir, ".."), made = null, widths: want = WIDTHS } = {}) {
  if (!file || !existsSync(file)) return null;
  try {
    const [W, H] = dims(file), key = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 10);
    const stem = basename(file).replace(/\.[a-z0-9]+$/i, "").replace(/[^A-Za-z0-9._-]+/g, "-");
    const widths = [...new Set([...want.filter((w) => w < W), W])];
    mkdirSync(picsDir, { recursive: true });
    const url = (name) => relative(pageDir, join(picsDir, name)).split(sep).join("/");
    const files = widths.map((w) => {
      const name = `${stem}-${key}-w${w}.webp`, p = join(picsDir, name);
      if (!existsSync(p)) encode(file, p, w === W ? null : w);
      made?.add(name);
      return { w, h: Math.round((H * w) / W), url: url(name) };
    });
    const at2x = files.find((f) => f.w >= SHOWN * 2) || files.at(-1);
    return { src: at2x.url, srcset: files.map((f) => `${f.url} ${f.w}w`).join(", "), sizes: SIZES, width: W, height: H, full: files.at(-1).url };
  } catch { return null; }
}

/** Remove the pictures in `picsDir` that are not in `keep` (a set of file names): a scene redrawn, a step's picture gone.
 *  A file written in the last `fresh` ms stays: two builds of one guide at once (`reelplanning review` while the tests
 *  bundle the same walkthrough) would otherwise each remove what the other was writing, its half-made `.tmp.webp`
 *  included, and leave a page pointing at a picture that is gone. The next build removes it. */
export function prunePictures(picsDir, keep, { fresh = 10 * 60 * 1000 } = {}) {
  if (!existsSync(picsDir)) return 0;
  let n = 0;
  const recent = (p) => { try { return Date.now() - statSync(p).mtimeMs < fresh; } catch { return true; } };
  for (const f of readdirSync(picsDir)) if (!keep.has(f) && !recent(join(picsDir, f))) { rmSync(join(picsDir, f), { force: true, recursive: true }); n++; }
  if (!readdirSync(picsDir).length) rmSync(picsDir, { recursive: true, force: true });
  return n;
}

// ── a step's own picture: the scene at its settled end, captions hidden, both themes, cropped to what is on it ──
/** How a picture is taken; a change here takes every picture again (it is in each one's cache key). */
const TAKE = "end-0.3|nocaps|crop48|3:2..12:5|2x|nested-1:1|v9";
// (a picture wider than 12:5 is a strip too thin to read as a picture: it is given more of the frame above and below)
const SCALE = 2, PAD = 48, SETTLE = 0.3, WIDEST = 12 / 5;
// a nested page's picture: at most this many of its own pixels wide (the column is 760 px: 950 keeps its words at 0.8
// of their size or more), with this much of the frame round it
const NEST_W = 950, NEST_PAD = 12;
const hashOf = (...xs) => { const h = createHash("sha256"); for (const x of xs) h.update(String(x)).update("\0"); return h.digest("hex").slice(0, 12); };
// what a scene's picture depends on: the video's page and the scene's own composition (and how it is taken)
function sceneKey(videoDir, scene, theme) {
  const read = (f) => { try { return readFileSync(f); } catch { return ""; } };
  const map = (() => { try { return JSON.parse(readFileSync(join(videoDir, "plan-map.json"), "utf8")); } catch { return null; } })();
  const f = (map?.frames || []).find((x) => x.index === scene.n), fd = join(videoDir, "compositions", "frames"), all = existsSync(fd) ? readdirSync(fd) : [];
  const comp = all.find((x) => x.replace(/\.html$/, "") === f?.compositionId) || all.find((x) => x.startsWith(`${String(scene.n).padStart(2, "0")}-`)) || null;
  return hashOf(TAKE, theme, scene.t.toFixed(2), read(join(videoDir, "index.html")), comp ? read(join(videoDir, "compositions", "frames", comp)) : "");
}
// the box round what is not the frame's paper (its most common edge colour), in the PNG's pixels
function contentBox(png) {
  const [W, H] = dims(png), k = 4, w = Math.max(1, Math.floor(W / k)), h = Math.max(1, Math.floor(H / k));
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", png, "-vf", `scale=${w}:${h}:flags=area`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: w * h * 3 + 1024 });
  const at = (x, y) => { const i = (y * w + x) * 3; return [raw[i], raw[i + 1], raw[i + 2]]; };
  const count = new Map(); for (let x = 0; x < w; x++) for (const y of [0, h - 1]) { const c = at(x, y).join(","); count.set(c, (count.get(c) || 0) + 1); }
  const bg = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  let l = w, t = h, r = -1, b = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = at(x, y); if (Math.max(Math.abs(c[0] - bg[0]), Math.abs(c[1] - bg[1]), Math.abs(c[2] - bg[2])) > 14) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; } }
  return r < 0 ? null : { W, H, l: l * k, t: t * k, r: Math.min(W, (r + 1) * k), b: Math.min(H, (b + 1) * k) };
}
// 48 px (CSS) round the content, then widened or heightened about its middle to between 3:2 and 12:5, kept in the frame
export function cropOf(box) {
  const { W, H } = box, pad = PAD * SCALE;
  let l = Math.max(0, box.l - pad), t = Math.max(0, box.t - pad), r = Math.min(W, box.r + pad), b = Math.min(H, box.b + pad);
  const fit = (lo, hi, want, max) => { const c = (lo + hi) / 2; let a = Math.round(c - want / 2); a = Math.max(0, Math.min(max - want, a)); return [a, a + want]; };
  let w = r - l, h = b - t;
  if (w / h < 1.5) { const want = Math.min(W, Math.round(h * 1.5)); [l, r] = fit(l, r, want, W); w = r - l; if (w / h < 1.5) { const hh = Math.round(w / 1.5); [t, b] = fit(t, b, hh, H); } }
  else if (w / h > WIDEST) { const want = Math.min(H, Math.round(w / WIDEST)); [t, b] = fit(t, b, want, H); }
  w = r - l; h = b - t;
  const even = (n) => n - (n % 2);
  return { x: even(l), y: even(t), w: even(w), h: even(h) };
}
// In the frame's page: the page drawn in it (see the top), its box in the player's pixels, the window of it kept, and
// its size as captured; in the dark take, a light one is turned to the dark theme's inks. Null when there is none.
function nestedIn({ dark, most }) {
  const P = document.getElementById("p"), ifr = P.iframeElement, d = ifr.contentDocument, w = d.defaultView;
  const shown = (el) => { for (let x = el; x && x !== d.documentElement; x = x.parentElement) { const cs = w.getComputedStyle(x); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.5) return false; } return el.getClientRects().length > 0; };
  const imgs = [...d.querySelectorAll("[data-artifact] img")].filter((i) => i.complete && i.naturalWidth >= 240 && i.naturalHeight >= 100 && shown(i));
  if (!imgs.length) return null;
  const R = (i) => i.getBoundingClientRect(), area = (i) => R(i).width * R(i).height;
  imgs.sort((a, b) => area(b) - area(a));
  const marked = imgs.find((i) => i.closest("[data-detail]"));
  if (!marked && area(imgs[0]) < 0.08 * w.innerWidth * w.innerHeight) return null;   // a small inset: the scene is the picture
  const pick = marked || imgs[0];
  // a before and after: two of about one size (within a fifth), side by side or one over the other, stay together
  const twin = !marked && imgs[1] && area(imgs[1]) >= 0.8 * area(imgs[0]) ? imgs[1] : null;
  const pixels = (img) => { const c = d.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight; const g = c.getContext("2d"); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height); };
  let data = null; try { data = pixels(pick); } catch {}
  const lumaOf = (px, i) => (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
  let luma = 1;
  if (data) { let s = 0, n = 0; for (let i = 0; i < data.data.length; i += 4 * 17) { s += lumaOf(data.data, i); n++; } luma = s / n; }
  if (dark) for (const i of [pick, twin].filter(Boolean)) if (luma > 0.6) i.style.filter = "invert(.93) hue-rotate(180deg)";
  const fr = ifr.getBoundingClientRect(), pr = P.getBoundingClientRect(), k = fr.width / w.innerWidth;
  const inP = (r) => ({ l: fr.left - pr.left + r.left * k, t: fr.top - pr.top + r.top * k, r: fr.left - pr.left + r.right * k, b: fr.top - pr.top + r.bottom * k });
  // what of it shows: its box within every box that clips it (a capture larger than its frame, panned inside it)
  const seen = (i) => { let r = R(i), v = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    for (let x = i.parentElement; x && x !== d.documentElement; x = x.parentElement) { const cs = w.getComputedStyle(x); if (/hidden|clip|auto|scroll/.test(cs.overflowX + cs.overflowY)) { const c = x.getBoundingClientRect(); v = { left: Math.max(v.left, c.left), top: Math.max(v.top, c.top), right: Math.min(v.right, c.right), bottom: Math.min(v.bottom, c.bottom) }; } }
    v.left = Math.max(v.left, 0); v.top = Math.max(v.top, 0); v.right = Math.min(v.right, w.innerWidth); v.bottom = Math.min(v.bottom, w.innerHeight); return v; };
  const whole = R(pick), vis = seen(pick), nw = pick.naturalWidth, per = nw / (whole.width * k);   // the capture's pixels to one of the player's
  let b = inP(vis); if (twin) { const o = inP(seen(twin)); b = { l: Math.min(b.l, o.l), t: Math.min(b.t, o.t), r: Math.max(b.r, o.r), b: Math.max(b.b, o.b) }; }
  // the part of the capture that shows, in its own pixels
  const n0 = Math.max(0, Math.round(((vis.left - whole.left) / whole.width) * nw)), n1 = Math.min(nw, Math.round(((vis.right - whole.left) / whole.width) * nw));
  // wider than `most` of its own pixels: the window of it with the most on it, its edges on empty columns
  let win = null;
  if (!twin && data && n1 - n0 > most) {
    const W = data.width, H = data.height, px = data.data, bg = [px[0], px[1], px[2]], ink = new Float64Array(W);
    for (let x = 0; x < W; x++) { let n = 0; for (let y = 0; y < H; y += 2) { const i = (y * W + x) * 4; if (Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) > 40) n++; } ink[x] = n / Math.ceil(H / 2); }
    const sum = new Float64Array(W + 1); for (let x = 0; x < W; x++) sum[x + 1] = sum[x] + ink[x];
    // a window between two empty columns (or the edges of what shows), 0.6 to 1 of `most` wide: whole blocks of it left
    // out, none cut through; the one with the most on it. With none, all of it (smaller, never a sentence cut in two).
    let best = -Infinity, span = null;
    const clean = [n0]; for (let x = n0 + 1; x < n1 - 1; x++) if (ink[x] === 0) clean.push(x); clean.push(n1);
    for (const x0 of clean) for (const x1 of clean) { const w0 = x1 - x0; if (w0 < 0.6 * most || w0 > most) continue; const sc = sum[x1] - sum[x0]; if (sc > best) { best = sc; span = [x0, x1]; } }
    if (span) { win = span[0]; const L = inP({ left: whole.left + (span[0] / nw) * whole.width, right: whole.left + (span[1] / nw) * whole.width, top: 0, bottom: 0 }); b = { ...b, l: L.l, r: L.r }; }
  }
  return { l: b.l, t: b.t, r: b.r, b: b.b, per, win: win != null };
}
async function takeShots(videoDir, jobs) {
  let chromium;
  try { ({ chromium } = await import("playwright-core")); } catch { return false; }
  if (!existsSync(join(videoDir, "index.html"))) return false;   // not assembled yet: the snapshot stands in
  const idx = readFileSync(join(videoDir, "index.html"), "utf8"), W = +(/data-width="(\d+)"/.exec(idx)?.[1] || 1920), H = +(/data-height="(\d+)"/.exec(idx)?.[1] || 1080);
  const files = { "/hf/player.js": depFile("@hyperframes/player", "dist/hyperframes-player.js"), "/hf/runtime.js": depFile("@hyperframes/core", "dist/hyperframe.runtime.iife.js") };
  const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}hyperframes-player{display:block;width:${W}px;height:${H}px}</style><script type="module" src="/hf/player.js"></script><body></body>`;
  const srv = createServer((req, res) => {
    const u = new URL(req.url, "http://x"), path = decodeURIComponent(u.pathname);
    if (path === "/") { res.writeHead(200, { "content-type": TYPES[".html"] }).end(page); return; }
    const f = files[path] || (path.startsWith("/v/") ? servedFile(videoDir, path.slice(2)) : null);
    if (!f || typeof f !== "string") { res.writeHead(404).end(); return; }
    res.writeHead(200, { "content-type": TYPES[extname(f).toLowerCase()] || "application/octet-stream" }).end(readFileSync(f));
  });
  await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser;
  try {
    browser = await chromium.launch(launchOpts());
    for (const theme of ["light", "dark"]) {
      const todo = jobs.filter((j) => j.theme === theme); if (!todo.length) continue;
      const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE, colorScheme: theme });
      const pg = await ctx.newPage(), cdp = await ctx.newCDPSession(pg);
      await pg.goto(base + "/");
      // the video's own page, as the review player hands it over (srcdoc, a <base> for its files), in this theme and with
      // the captions layer hidden
      let doc = idx.replace(/<head\b[^>]*>/i, (m) => `${m}<base href="${base}/v/"><style>#el-captions,[data-composition-id="captions"]{visibility:hidden!important}</style>`);
      if (theme === "dark") doc = doc.replace(/<html/i, '<html data-theme="dark"');
      await pg.evaluate(({ doc, rt }) => { const p = document.createElement("hyperframes-player"); p.id = "p"; p.setAttribute("muted", ""); p.setAttribute("runtime-src", rt); p.setAttribute("srcdoc", doc); document.body.appendChild(p); }, { doc, rt: `${base}/hf/runtime.js` });
      await pg.waitForFunction(() => { const p = document.getElementById("p"); return p?.ready && p.assetsReady; }, null, { timeout: 90000 });
      for (const j of todo) {
        await pg.evaluate((t) => document.getElementById("p").seek(t), j.t);
        // settled: the page's images and faces in, and two pictures of it a frame apart the same
        await pg.waitForFunction(() => { const d = document.getElementById("p").iframeElement.contentDocument; return d && d.fonts.status === "loaded" && [...d.images].every((i) => i.complete); }, null, { timeout: 30000 }).catch(() => null);
        const nest = await pg.evaluate(nestedIn, { dark: theme === "dark", most: NEST_W }).catch(() => null);
        // a page drawn smaller in the video than it was captured is taken at a higher scale, so its picture still has two
        // pixels for each one of the capture's and the page draws it at its own size, never stretched
        const S = nest && nest.per > 1 ? Math.min(4, Math.ceil(SCALE * nest.per * 100) / 100) : SCALE;
        let last = null, buf = null;
        for (let i = 0; i < 8; i++) {
          await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          // (the player sits at the page's top left, W × H: at a higher scale the browser draws it again at that scale)
          buf = S !== SCALE ? Buffer.from((await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: W, height: H, scale: S } })).data, "base64") : await pg.locator("#p").screenshot({ type: "png" });
          if (last && buf.equals(last)) break; last = buf;
        }
        mkdirSync(join(j.out, ".."), { recursive: true });
        const tmp = `${j.out}.shot.png`; writeFileSync(tmp, buf);
        const [TW, TH] = dims(tmp), even = (n) => n - (n % 2);
        const c = nest ? (() => { const pad = (side) => (nest.win && (side === "l" || side === "r") ? 0 : NEST_PAD);
          const x = Math.max(0, Math.floor((nest.l - pad("l")) * S)), y = Math.max(0, Math.floor((nest.t - pad("t")) * S));
          return { x: even(x), y: even(y), w: even(Math.min(TW, Math.ceil((nest.r + pad("r")) * S)) - even(x)), h: even(Math.min(TH, Math.ceil((nest.b + pad("b")) * S)) - even(y)) }; })()
          : (() => { const box = contentBox(tmp); return box ? cropOf(box) : null; })();
        if (c) ff(["-i", tmp, "-vf", `crop=${c.w}:${c.h}:${c.x}:${c.y}`, j.out]); else renameSync(tmp, j.out);
        rmSync(tmp, { force: true });
        // how wide the page shows it: its capture one pixel to one CSS pixel (a nested page), else as before
        writeFileSync(`${j.out}.json`, JSON.stringify(nest && c ? { show: Math.round((c.w / S) * nest.per) } : {}));
      }
      await ctx.close();
    }
    return true;
  } catch { return false; }
  finally { await browser?.close().catch(() => {}); srv.close(); }
}
/**
 * Each step's picture, taken for the guide: `scenes` [{ n, end }] (a scene's number and end, in seconds). Returns a Map
 * n → the PNG files { light, dark } (kept in `cacheDir`, made again only when the scene changes), or null when no
 * browser can take them (then the snapshot stands in: pictureOf on it, as before).
 */
export async function stepPictures(videoDir, scenes, { cacheDir }) {
  const out = new Map(), jobs = [];
  for (const s of scenes) {
    const sc = { n: s.n, t: Math.max(0, +(s.end - SETTLE).toFixed(2)) }, got = {};
    for (const theme of ["light", "dark"]) {
      const f = join(cacheDir, `scene-${String(s.n).padStart(2, "0")}-${theme}-${sceneKey(videoDir, sc, theme)}.png`);
      got[theme] = f; if (!existsSync(f) || !existsSync(`${f}.json`)) jobs.push({ ...sc, theme, out: f });
    }
    out.set(s.n, got);
  }
  if (jobs.length && !(await takeShots(videoDir, jobs).catch(() => false))) return null;
  // older takes of these scenes go
  if (existsSync(cacheDir)) { const keep = new Set([...out.values()].flatMap((g) => [g.light, g.dark].flatMap((f) => [basename(f), `${basename(f)}.json`]))); for (const f of readdirSync(cacheDir)) if (/^scene-\d+-(light|dark)-/.test(f) && !keep.has(f)) rmSync(join(cacheDir, f), { force: true }); }
  for (const [n, g] of out) { if (!existsSync(g.light) || !existsSync(g.dark)) { out.delete(n); continue; } try { const m = JSON.parse(readFileSync(`${g.light}.json`, "utf8")); if (m.show > 0) g.show = m.show; } catch {} }
  return out;
}
/**
 * A step's picture, both themes: the light one's files, with the dark one's beside them (`dark`). Each at the 2× width
 * and whole, not the 1× one too: a 1× screen draws the 2× file down, as sharp, and two themes of three files each were
 * a bundle's worth of files (an Artifact holds 511).
 */
export function themedPicture(files, opts) {
  const o = { ...opts, widths: [SHOWN * 2] }, light = pictureOf(files.light, o), dark = pictureOf(files.dark, o);
  return light ? { ...light, ...(files.show ? { show: files.show } : {}), ...(dark ? { dark: { src: dark.src, srcset: dark.srcset, full: dark.full, width: dark.width, height: dark.height } } : {}) } : null;
}
