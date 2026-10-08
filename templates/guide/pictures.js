/* The guide's pictures (templates/guide/pictures.js): how a picture is put on the page, and the lightbox that opens it
   full size. Loaded before guide.js, which draws a picture with RPPictures.img(pic, alt).

   A picture is files beside the page (scripts/lib/guide/pictures.mjs): { src, srcset, sizes, width, height, full }, made
   from the video's snapshot at 2× device scale, at the widths the column draws it at (1× and 2×) and whole. The
   browser picks the file for the screen (srcset, sizes), and the page never draws a picture wider than half its pixels,
   so on a 2× screen nothing is stretched. A picture is a link to its whole file: with no script it opens that file.

   Clicked, it opens in the lightbox, fitted to the window (never past its own pixels): scroll, pinch, + and − (or the
   buttons) zoom, 0 fits it, 1 shows it pixel for pixel; drag or the arrow keys move it. Esc, a click that is not a
   drag, or × closes it, and the focus goes back to the picture. */
(function () {
"use strict";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** A picture as the page shows it: a link to its whole file, the image in the sizes made for it. */
function img(pic, alt) {
  if (!pic) return "";
  if (typeof pic === "string") return `<a class="zoom" href="${esc(pic)}" aria-label="${esc(`${alt}. Open it full size`)}"><img src="${esc(pic)}" alt="${esc(alt)}" loading="lazy" decoding="async"></a>`;
  // drawn at most half as wide as its pixels: one pixel of it to one pixel of a 2× screen, never stretched; a page
  // captured and drawn in the video (pic.show) no wider than it was captured, its words as on that page. A step's
  // picture taken in both themes (pic.dark) has both images, and the page's theme shows one (pictures.css): the one
  // not shown is never loaded (lazy, and not drawn)
  const one = (p, cls) => `<img${cls ? ` class="${cls}"` : ""} src="${esc(p.src)}" srcset="${esc(p.srcset)}" sizes="${esc(pic.sizes)}" width="${+p.width}" height="${+p.height}" alt="${esc(alt)}" loading="lazy" decoding="async" style="max-width:min(100%,${Math.floor(Math.min(p.width / 2, pic.show || Infinity))}px);aspect-ratio:${+p.width} / ${+p.height}" data-full="${esc(p.full)}">`;
  return `<a class="zoom${pic.dark ? " themed" : ""}" href="${esc(pic.full)}" data-w="${+pic.width}" data-h="${+pic.height}" aria-label="${esc(`${alt}. Open it full size`)}">`
    + one(pic, pic.dark ? "pic-light" : "") + (pic.dark ? one(pic.dark, "pic-dark") : "") + `</a>`;
}

// ── the lightbox ──
let box = null, pic = null, bar = null, pct = null, st = null, from = null, overflow = "";
const dpr = () => window.devicePixelRatio || 1;
const view = () => ({ w: box.clientWidth, h: box.clientHeight });
// fitted with room round it: 48 px a side, 72 px above and below (clear of the toolbar and the hint); never past its own pixels
const fitScale = () => { const v = view(), mx = v.w <= 600 ? 16 : 48, my = v.w <= 600 ? 64 : 72; return Math.min((v.w - 2 * mx) / st.w, (v.h - 2 * my) / st.h, 1 / dpr()); };
const most = () => 4 / dpr();   // four screen pixels to one of the picture
function draw() {
  const v = view(), sw = st.w * st.s, sh = st.h * st.s;
  st.x = sw <= v.w ? (v.w - sw) / 2 : Math.min(0, Math.max(v.w - sw, st.x));
  st.y = sh <= v.h ? (v.h - sh) / 2 : Math.min(0, Math.max(v.h - sh, st.y));
  pic.style.transform = `translate(${st.x}px,${st.y}px) scale(${st.s})`; pic.style.setProperty("--lb-s", String(st.s));
  const p = Math.round(st.s * dpr() * 100);
  pct.textContent = st.fit ? "Fit" : `${p}%`;
  pct.setAttribute("aria-label", st.fit ? "Fitted to the window: show it pixel for pixel" : `At ${p}%: fit it to the window`);
}
function zoomTo(s, cx = view().w / 2, cy = view().h / 2) {
  const f = fitScale(), ns = Math.max(Math.min(f, 1 / dpr()), Math.min(most(), s));
  st.x = cx - ((cx - st.x) * ns) / st.s; st.y = cy - ((cy - st.y) * ns) / st.s; st.s = ns; st.fit = Math.abs(ns - f) < 1e-6; draw();
}
const fit = () => { st.s = fitScale(); st.fit = true; draw(); };
function build() {
  box = document.createElement("div");
  box.className = "lb"; box.hidden = true;
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "The picture, full size");
  box.innerHTML = `<img class="lb-img" alt="" draggable="false"><div class="lb-bar" role="toolbar" aria-label="Zoom">`
    + `<button type="button" data-z="out" aria-label="Zoom out" title="Zoom out (−)">−</button><button type="button" data-z="pct" class="lb-pct" title="Fit, or pixel for pixel (0, 1)">Fit</button>`
    + `<button type="button" data-z="in" aria-label="Zoom in" title="Zoom in (+)">+</button><button type="button" data-z="close" aria-label="Close" title="Close (Esc)">×</button></div>`
    + `<p class="lb-hint">Scroll or pinch to zoom, drag to move. Esc or a click closes it.</p>`;
  document.body.appendChild(box);
  pic = box.querySelector(".lb-img"); bar = box.querySelector(".lb-bar"); pct = box.querySelector(".lb-pct");
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return; e.stopPropagation();
    const z = b.dataset.z;
    if (z === "close") close(); else if (z === "in") zoomTo(st.s * 1.5); else if (z === "out") zoomTo(st.s / 1.5); else if (st.fit) zoomTo(1 / dpr()); else fit();
  });
  box.addEventListener("wheel", (e) => { e.preventDefault(); const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * view().h : e.deltaY; zoomTo(st.s * Math.exp(-d * 0.0015), e.clientX, e.clientY); }, { passive: false });
  // drag to move, two fingers to zoom; a press that does not move is a click, and a click closes it
  const pts = new Map(); let drag = null, pinch = null, moved = false;
  box.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".lb-bar")) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { box.setPointerCapture(e.pointerId); } catch {}
    if (pts.size === 1) { moved = false; drag = { x: e.clientX, y: e.clientY, sx: st.x, sy: st.y }; }
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, s: st.s }; drag = null; moved = true; }
  });
  box.addEventListener("pointermove", (e) => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pts.size >= 2) { const [a, b] = [...pts.values()]; zoomTo(pinch.s * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d), (a.x + b.x) / 2, (a.y + b.y) / 2); return; }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) > 4) { moved = true; box.classList.add("drag"); }
    if (moved) { st.x = drag.sx + dx; st.y = drag.sy + dy; draw(); }
  });
  const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (!pts.size) { drag = null; box.classList.remove("drag"); } };
  box.addEventListener("pointerup", up); box.addEventListener("pointercancel", up);
  box.addEventListener("click", (e) => { if (e.target.closest(".lb-bar")) return; if (!moved) close(); moved = false; });
  document.addEventListener("keydown", (e) => {
    if (!box || box.hidden) return;
    const k = e.key, step = 80;
    if (k === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (k === "Tab") { const bs = [...bar.querySelectorAll("button")], i = bs.indexOf(document.activeElement); e.preventDefault(); bs[(i + (e.shiftKey ? -1 : 1) + bs.length) % bs.length].focus(); return; }
    if (k === "+" || k === "=") zoomTo(st.s * 1.5); else if (k === "-" || k === "_") zoomTo(st.s / 1.5); else if (k === "0") fit(); else if (k === "1") zoomTo(1 / dpr());
    else if (k === "ArrowLeft") { st.x += step; draw(); } else if (k === "ArrowRight") { st.x -= step; draw(); } else if (k === "ArrowUp") { st.y += step; draw(); } else if (k === "ArrowDown") { st.y -= step; draw(); }
    else return;
    e.preventDefault(); e.stopPropagation();
  }, true);
  addEventListener("resize", () => { if (box.hidden) return; if (st.fit) fit(); else draw(); });
}
/** Open a picture (its link, a.zoom) in the lightbox. */
function open(a) {
  if (!box) build();
  // the image the page's theme shows (a picture taken in both), its whole file
  const small = [...a.querySelectorAll("img")].find((i) => i.getClientRects().length) || a.querySelector("img"), full = small?.dataset.full || a.getAttribute("href");
  st = { w: +small?.getAttribute("width") || +a.dataset.w || small?.naturalWidth || 1600, h: +small?.getAttribute("height") || +a.dataset.h || small?.naturalHeight || 900, x: 0, y: 0, s: 1, fit: true };
  from = a; pic.alt = small?.alt || "";
  pic.style.width = `${st.w}px`; pic.style.height = `${st.h}px`;
  pic.src = small?.currentSrc || small?.src || full;   // the file already loaded, until the whole one is in
  if (full && full !== pic.src) { const pre = new Image(); pre.onload = () => { if (from === a && !box.hidden) pic.src = full; }; pre.src = full; }
  overflow = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden";
  box.hidden = false; fit();
  bar.querySelector('[data-z="close"]').focus({ preventScroll: true });
  overlay(true);
}
// the page under the review page's player (guide.js, its embed block) tells the review page, whose small player steps aside
const overlay = (open) => { try { document.dispatchEvent(new CustomEvent("rp-overlay", { detail: { open } })); } catch {} };
function close() {
  if (!box || box.hidden) return;
  box.hidden = true; pic.removeAttribute("src"); document.documentElement.style.overflow = overflow;
  const a = from; from = null; a?.focus({ preventScroll: true });
  overlay(false);
}
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a.zoom"); if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); open(a);
});
window.RPPictures = { img, open, close };
})();
