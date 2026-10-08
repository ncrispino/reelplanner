/* Highlight anything in the guide, and the video's note box pops up on it (packages/player/guide-review.js; `reelplanning
   guide` puts it in each full guide page, and the review page's guide under the video, D-264, is that page).

   One experience with marking the video (the player's .markbox): the same box, the same look, the same keys and words.
   Select anything and let go (a sentence, a heading, a table cell, a list item, code lines in a diff, a run's output, a
   caption, a diagram's label: SVG text is text), or click a labelled thing (a diagram's shape or group with an
   aria-label, a <title> or data-label; a picture with its alt; [data-note-label]), or a diff line's number: the box
   opens beside it, never over it: a header row with its quote and × beside it, the words, then the keys, Ask and Save
   (420 px wide, or the window less 32 px). Enter (or Save) saves the words, Esc closes and keeps them, × deletes them
   (with nothing typed, Esc and Enter simply close it: there is no note without words); typed words are only ever thrown
   away by ×. Its other ways, in the box: Suggest an edit (only on the plan's own words, [data-editable]: what they say
   and what you would have them say) and Ask (a question about it, answered in the box: the player's rule for who
   answers). A touch screen shows no key chips. A phone's long-press selection opens it docked at the foot of the
   window, 8 px above the small player's room, clear of the selection's own menu; with the keyboard, select
   (Shift and the arrows, let go of Shift) or press N: the selection, else what has focus, else what you are reading.

   A kept note stays highlighted (CSS custom highlights: nothing in the page moves or is rewritten; a labelled thing is
   outlined), and it is the review's own: the player's annotations in this browser (reelplanning:annotations:<src>),
   beside the video's marks, via "guide", with where it is (detail.where: its section and step; plan.step) and its
   quote (detail.text). The review page takes it from storage as it is written, lists it with the video's marks, and
   Finish sends it with them; `reel record` (and `reel-intake`, which runs it) files it in reviews/<id>.md under its
   step, pointing at the quote. Clicking a highlight opens its note again (the bin deletes it); clicking it in the
   review's list goes to it (the host's "note" message, below). Opened on its own, the page keeps notes the same way,
   and "Your notes" lists them and exports them as the review page does (annotations.json, for `reel record`).

   How a highlight is found again (hl): a text quote (q, the text with its white space folded; pre and suf, what is
   around it; n, which one) inside its place: the nearest [data-anchor] (anchor, and ai, which of that name) under the
   nearest id (id); a labelled thing by its label (label, tag, n) under its id. Nothing here knows any one diagram or
   widget: a guide that draws more (a diagram, an interactive picture) gets all of this as long as its words are text
   and its things are labelled. A click on a control (a button, a link, role=button, data-no-note, or anything drawn
   with a pointer cursor: an interactive widget's own) does what it does, never opens the box.

   The review page (<reelplanning-guide>) says   { type: "rp-guide-host", event: "note", id }   to go to a note: the
   page opens the folds it is in, scrolls it to the reading line and lights it a moment. A deep link #rpn-<id> does the
   same. One way in besides the page's own words: a part shown in a frame on this page (scripts/lib/guide-page.mjs,
   frames: true; the bridge's "select" and "anchor" messages), whose notes cannot be highlighted from here. */
(function () {
  "use strict";
  // How the reviewer runs reelplanning in the lines shown after an export: RP_COMMAND in scripts/lib/env.mjs, the one
  // place that says, copied here by scripts/release/sync-version.mjs (scripts/test/version.spec.mjs checks they agree).
  const RP_COMMAND = "reelplanning";
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clean = (t, n) => String(t || "").replace(/\s+/g, " ").trim().slice(0, n);
  const fmt = (t) => { t = Math.max(0, Math.floor(t)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };
  const CONTROL = "button,a[href],input,select,textarea,label,summary,[role=button],[role=link],[role=tab],[role=slider],[role=checkbox],[role=switch],[role=menuitem],[contenteditable],[data-no-note]";
  const HL = typeof Highlight === "function" && !!(window.CSS && CSS.highlights);
  const TRASH = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.5h6.6L12 4M6.8 6.5v4.5M9.2 6.5v4.5"/></svg>`;
  const CSS_TEXT = `
/* the box: the video's mark box (.markbox in packages/player/reelplanning-player.js), with the quote it is on above it */
.rpn-box{position:absolute;z-index:80;box-sizing:border-box;width:min(420px,calc(100vw - 32px));padding:8px 6px 8px;background:var(--paper,#FAF9F5);color:var(--ink,#141413);border:1px solid var(--ink-20,rgba(20,20,19,.2));border-radius:6px;box-shadow:0 1px 2px rgba(var(--ink-rgb,20,20,19),.1),0 10px 28px -18px rgba(var(--ink-rgb,20,20,19),.45);font:13px/1.4 var(--sans,system-ui,sans-serif);text-align:left}
.rpn-box[hidden]{display:none}
.rpn-box.in{animation:rpn-in .14s cubic-bezier(.2,.7,.2,1)}
@keyframes rpn-in{from{opacity:0;transform:translateY(3px)}}
/* its header: the quote it is on, and × (delete these words) beside it, apart from the field */
.rpn-box .hd{display:flex;align-items:flex-start;gap:8px;min-height:24px;padding:0 0 0 8px}
.rpn-box .hd .q{flex:1 1 auto;min-width:0}
.rpn-box .hd .xs{flex:none;display:flex;margin-left:auto}
.rpn-box .q{margin:3px 0 2px;padding-left:8px;border-left:2px solid var(--accent,#B8552E);font-size:13px;line-height:1.45;color:var(--ink-2,#3D3B37);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.rpn-box .q[hidden]{display:none}
.rpn-box textarea{width:100%;min-width:0;display:block;box-sizing:border-box;margin:2px 0 0;font:inherit;font-size:13px;line-height:1.4;padding:6px 8px;border:0;border-radius:0;background:none;color:var(--ink,#141413);resize:none;overflow:hidden;max-height:calc(6 * 1.4em + 12px)}
.rpn-box textarea:focus{outline:0}
.rpn-box textarea::placeholder{color:var(--ink-3,#5C5953)}
.rpn-box .x{flex:none;display:inline-grid;place-items:center;width:24px;height:24px;margin:0 2px 0 0;padding:0;border:0;border-radius:4px;background:none;color:var(--ink-3,#5C5953);font-size:16px;line-height:1;cursor:pointer}
.rpn-box .x:hover,.rpn-box .x:focus-visible{background:rgba(var(--ink-rgb,20,20,19),.08);color:var(--ink,#141413)}
.rpn-box .x[hidden]{display:none}
.rpn-box .x svg{width:14px;height:14px}
.rpn-box .foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px 12px;padding:4px 8px 0}
.rpn-box .k{font:12px/1.5 var(--sans,system-ui,sans-serif);color:var(--ink-3,#5C5953)}
.rpn-box .k kbd{display:inline-block;min-width:1.2em;padding:0 4px;border-radius:3px;box-shadow:inset 0 0 0 1px var(--ink-20,rgba(20,20,19,.2));font:500 11px/1.45 var(--sans,system-ui,sans-serif);text-align:center;color:var(--ink-2,#3D3B37)}
/* its caret: a small point from the box to the line it is on (under it, or over it when flipped above) */
.rpn-box::before{content:"";position:absolute;left:var(--rpn-caret,24px);top:-6px;width:10px;height:10px;margin-left:-5px;background:inherit;border:1px solid var(--ink-20,rgba(20,20,19,.2));border-right:0;border-bottom:0;transform:rotate(45deg);border-radius:2px 0 0 0}
.rpn-box.above::before{top:auto;bottom:-6px;border:1px solid var(--ink-20,rgba(20,20,19,.2));border-left:0;border-top:0;border-radius:0 0 2px 0}
.rpn-box.dock::before,.rpn-box.nocaret::before{display:none}
.rpn-box .also{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin-left:auto}
/* Ask and Save: real buttons, side by side (Save the ink one); Suggest an edit stays a link before them */
.rpn-box .also .bt{height:28px;padding:0 12px;border:1px solid var(--ink-20,rgba(20,20,19,.2));border-radius:6px;background:var(--paper,#FAF9F5);color:var(--ink,#141413);font:500 13px/1 var(--sans,system-ui,sans-serif);text-decoration:none;cursor:pointer}
.rpn-box .also .bt:hover,.rpn-box .also .bt:focus-visible{border-color:var(--ink,#141413);color:var(--ink,#141413)}
.rpn-box .also .bt.save{border-color:var(--ink,#141413);background:var(--ink,#141413);color:var(--paper,#FAF9F5)}
.rpn-box .also .bt.save:hover,.rpn-box .also .bt.save:focus-visible{background:var(--ink-2,#3D3B37);color:var(--paper,#FAF9F5)}
.rpn-box .also button.lk{padding:0;border:0;background:none;color:var(--ink-3,#5C5953);font:12px/1.7 var(--sans,system-ui,sans-serif);text-decoration:underline;text-decoration-color:var(--ink-20,rgba(20,20,19,.2));text-underline-offset:3px;cursor:pointer}
.rpn-box .also button.lk:hover,.rpn-box .also button.lk:focus-visible{color:var(--ink,#141413);text-decoration-color:currentColor}
.rpn-box .also button[aria-pressed="true"]{color:var(--ink,#141413);font-weight:500;text-decoration-color:currentColor}
.rpn-box .also button[hidden]{display:none}
.rpn-box .ans{margin:8px 8px 0;padding-top:8px;border-top:1px solid var(--ink-12,rgba(20,20,19,.12));font-size:13px;line-height:1.5;color:var(--ink-2,#3D3B37)}
.rpn-box .ans[hidden]{display:none}
.rpn-box .ans .me{display:block;margin-bottom:4px;font-weight:500;color:var(--ink,#141413)}
.rpn-box .ans .from{display:block;margin-top:6px;font-size:12px;color:var(--ink-3,#5C5953)}
/* a phone: docked at the foot of the window (above the small player, and the keyboard), clear of the selection's own menu.
   Under the review page's player, --rp-embed-dock is what of this frame's window is covered at its foot right now (the
   small player's bar, measured, and the review page's window ending above the frame's foot): Save is never under it */
.rpn-box.dock{position:fixed;left:16px;right:16px;width:auto;top:auto;bottom:calc(var(--rp-embed-dock,var(--rp-embed-bottom,0px)) + 8px + var(--rpn-kb,0px));padding:8px 6px 10px}
.rpn-box.dock textarea{font-size:16px}
.rpn-box.dock .x{width:40px;height:40px;margin:-8px -2px -6px 0}
.rpn-box.dock .also button.lk{font-size:14px;line-height:2.4}
.rpn-box.dock .also .bt{height:40px;padding:0 16px;font-size:15px}
/* a touch screen has no keys: the key chips go, the buttons say it */
@media (pointer:coarse){.rpn-box .k{display:none}.rpn-box .also{margin-left:0;width:100%;justify-content:flex-end}}
/* what you highlighted: yours, so the coral; the words stay where they were, nothing moves */
::highlight(rpn-note){background-color:color-mix(in srgb,var(--accent,#B8552E) 20%,transparent);text-decoration:underline 1.5px var(--accent,#B8552E)}
::highlight(rpn-now){background-color:color-mix(in srgb,var(--accent,#B8552E) 30%,transparent)}
::highlight(rpn-lit){background-color:color-mix(in srgb,var(--accent,#B8552E) 42%,transparent)}
[data-rpn-noted],[data-rpn-now],[data-rpn-lit]{outline:2px solid color-mix(in srgb,var(--accent,#B8552E) 55%,transparent);outline-offset:2px;border-radius:2px}
[data-rpn-now]{outline-color:var(--accent,#B8552E)}
[data-rpn-lit]{outline:3px solid var(--accent,#B8552E)}
/* on this page a note starts from a selection, not a click: a place with an anchor is not a button, as it is on a detail page */
.rpn-root [data-anchor]{cursor:auto}
.rpn-root [data-anchor]:hover,.rpn-root [data-anchor]:focus-visible{background:none;box-shadow:none}
.rpn-live{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rpn-toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:81;padding:6px 12px;border-radius:6px;background:var(--ink,#141413);color:var(--paper,#FAF9F5);font:13px/1.3 var(--sans,system-ui,sans-serif)}
/* your notes, on the page opened on its own (the review page lists them with the video's marks) */
.rpn-list{position:fixed;right:16px;top:60px;z-index:79;box-sizing:border-box;width:min(420px,calc(100vw - 32px));max-height:calc(100vh - 90px);overflow:auto;padding:14px 16px 16px;background:var(--paper,#FAF9F5);color:var(--ink,#141413);border:1px solid var(--ink-20,rgba(20,20,19,.2));border-radius:8px;box-shadow:0 12px 32px -14px rgba(var(--ink-rgb,20,20,19),.4);font:13.5px/1.45 var(--sans,system-ui,sans-serif)}
.rpn-list[hidden]{display:none}
.rpn-list h4{margin:0 0 4px;font:400 18px/1.2 var(--serif,Georgia,serif)}
.rpn-list .w{margin:0 0 10px;font-size:12.5px;color:var(--ink-3,#5C5953)}
.rpn-list ol{margin:0;padding:0;list-style:none;display:grid;gap:12px}
.rpn-list li{padding-top:10px;border-top:1px solid var(--ink-12,rgba(20,20,19,.12))}
.rpn-list .go{display:block;padding:0;border:0;background:none;color:var(--ink-3,#5C5953);font:12px/1.4 var(--mono,ui-monospace,monospace);text-align:left;text-decoration:underline;text-decoration-color:var(--ink-20,rgba(20,20,19,.2));text-underline-offset:3px;cursor:pointer}
.rpn-list .go:hover{color:var(--ink,#141413)}
.rpn-list .go[disabled]{text-decoration:none;cursor:default}
.rpn-list .qt{display:block;margin:4px 0 0;padding-left:8px;border-left:2px solid var(--accent,#B8552E);color:var(--ink-2,#3D3B37);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rpn-list .c{display:block;margin-top:4px}
.rpn-list .rm{margin-top:2px;padding:0;border:0;background:none;color:var(--ink-3,#5C5953);font-size:12px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.rpn-list .foot{margin:14px 0 0;padding-top:12px;border-top:1px solid var(--ink-12,rgba(20,20,19,.12))}
.rpn-list .foot button{height:32px;padding:0 12px;border-radius:6px;border:1px solid var(--ink,#141413);background:var(--ink,#141413);color:var(--paper,#FAF9F5);font:500 13px/1 var(--sans,system-ui,sans-serif);cursor:pointer}
.rpn-list .foot p{margin:8px 0 0;font-size:12.5px;color:var(--ink-3,#5C5953)}
.rpn-list .foot code{display:block;margin-top:4px;padding:6px 8px;border-radius:4px;background:var(--ink-06,rgba(20,20,19,.06));font:12px/1.5 var(--mono,ui-monospace,monospace);color:var(--ink,#141413);overflow-wrap:anywhere;user-select:all}
@media (prefers-reduced-motion:reduce){.rpn-box.in{animation:none}}`;

  function init({ slug, src, map = "../plan-map.json", root = document.body, partOf = {}, frames = false } = {}) {
    const params = new URLSearchParams(location.search);
    src = params.get("src") || src || `${slug}/index.html`;
    // kept under the review's own record for the video, in the repo the page names (bundle-player's
    // <meta name="reelplanning-repo">, the key the review page's player uses: reelplanning-player.js recordKey)
    const repo = (document.querySelector('meta[name="reelplanning-repo"]')?.getAttribute("content") || "").trim();
    const KEY = repo ? `reelplanning@${repo}:annotations:${src}` : `reelplanning:annotations:${src}`, QK = `${KEY}:questions`, DK = `${KEY}:decisions`;
    const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v ?? d; } catch { return d; } };
    const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
    let planMap = null; const mapReady = fetch(new URL(map, location.href)).then((r) => (r.ok ? r.json() : null)).then((m) => (planMap = m)).catch(() => null);
    const EMBED = params.get("embed") === "1" && window.parent !== window;
    const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = () => matchMedia("(pointer: coarse)").matches;
    const docked = () => innerWidth <= 600 || (coarse() && innerWidth < 820);
    const st = document.createElement("style"); st.textContent = CSS_TEXT; document.head.appendChild(st); root.classList.add("rpn-root");

    // ── the box ──
    const box = document.createElement("div"); box.className = "rpn-box"; box.hidden = true; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Your note on this");
    // the header: the quote, and beside it × (and a kept note's bin); the words; then the keys (not on a touch screen),
    // Suggest an edit where it can be one, Ask and Save
    box.innerHTML = `<div class="hd"><p class="q"></p><span class="xs"><button type="button" class="x trash" data-a="trash" hidden title="Delete this note" aria-label="Delete this note">${TRASH}</button><button type="button" class="x" data-a="discard" title="Delete these words" aria-label="Delete these words">×</button></span></div>`
      + `<textarea rows="1" maxlength="2000" placeholder="Your note, a question, or a suggested edit…" aria-label="Your words for this — Enter saves them, Esc closes and keeps them, × deletes them"></textarea>`
      + `<div class="foot"><span class="k"><kbd>Enter</kbd> saves · <kbd>Esc</kbd> closes (kept) · <kbd>×</kbd> deletes</span><span class="also"><button type="button" class="lk" data-a="edit" aria-pressed="false" hidden>Suggest an edit</button><button type="button" class="bt ask" data-a="ask">Ask</button><button type="button" class="bt save" data-a="save" title="Save these words with your review (Enter)">Save</button></span></div><div class="ans" hidden aria-live="polite"></div>`;
    document.body.appendChild(box);
    const liveEl = document.createElement("div"); liveEl.className = "rpn-live"; liveEl.setAttribute("role", "status"); liveEl.setAttribute("aria-live", "polite"); document.body.appendChild(liveEl);
    const say = (t) => { liveEl.textContent = ""; requestAnimationFrame(() => { liveEl.textContent = t; }); };
    const ta = box.querySelector("textarea"), qEl = box.querySelector(".q"), ans = box.querySelector(".ans"), kEl = box.querySelector(".k");
    const editBtn = box.querySelector('[data-a="edit"]'), trashBtn = box.querySelector('[data-a="trash"]'), xBtn = box.querySelector('[data-a="discard"]');
    // what the box is on: { kind: "new" | "note", range | el | rect, hl, w (where), quote, anchor, editable, mode, note, opener }
    let cur = null;

    // ── where a place in the page is: its part, its section, its step, its anchor ──
    const partAt = (el) => { const s = el?.closest?.("section[data-flow], [id].kind, #what-changed, #choices, section[data-part]"); const id = s?.dataset?.part || s?.id || null; return id ? partOf[id] || id : null; };
    const detailOf = (name) => (planMap?.details || []).find((d) => d.name === name) || null;
    const guidePartOf = (name) => (planMap?.guide?.parts || []).find((p) => p.name === name) || null;
    const frameOf = (t) => { const fr = (planMap?.frames || []).find((f) => t >= f.start - 0.01 && t < f.start + (f.durationSeconds || 0)) || null; return fr ? { index: fr.index, compositionId: fr.compositionId, title: fr.title } : null; };
    function whereOf(node) {
      const el = node?.nodeType === 1 ? node : node?.parentElement; if (!el) return { section: null, step: null, part: null };
      const flow = el.closest("section[data-flow], section.q, section.hero, footer, section.part");
      const section = !flow ? null : flow.matches(".hero") ? "At the top" : clean(flow.querySelector("h2")?.textContent, 80) || null;
      const anchor = el.closest("[data-anchor]")?.getAttribute("data-anchor") || null, part = partAt(el);
      const stepEl = el.closest('section.step, [data-part^="step-"]'), sm = /^step-(\d+)$/.exec(stepEl?.dataset.part || stepEl?.id || "");
      let step = sm ? +sm[1] : null;
      if (step == null && anchor) { const m = /\bstep (\d+)\b/i.exec(anchor); if (m) step = +m[1]; }
      if (step == null) step = detailOf(part)?.planStep ?? guidePartOf(part)?.planStep ?? null;
      return { section, step, part, anchor, stepTitle: sm ? clean(stepEl.querySelector("h3")?.textContent, 80) || null : null };
    }
    const whereLabel = (w) => [w.section, w.step != null && !/^step \d+\b/i.test(w.section || "") ? `step ${w.step}` : null].filter(Boolean).join(" · ") || "the guide";
    // a diff's lines selected: "path:12–14"; else the nearest anchor of the words, else of the place
    function anchorOf(range) {
      const a = (n) => (n.nodeType === 1 ? n : n.parentElement)?.closest?.("[data-anchor]")?.getAttribute("data-anchor") || null;
      const s = a(range.startContainer), e = a(range.endContainer), m1 = /^(.*):(-?\d+)$/.exec(s || ""), m2 = /^(.*):(-?\d+)$/.exec(e || "");
      if (m1 && m2 && m1[1] === m2[1] && m1[2] !== m2[2]) return `${m1[1]}:${m1[2]}–${m2[2]}`;
      return s || e || a(range.commonAncestorContainer);
    }

    // ── a highlight, and finding it again: its words as a text quote, in its place ──
    const SKIP = "script,style,noscript,template,.rpn-box,.rpn-list,.rpn-live,.rpn-toast";
    function flat(scope) {
      const nodes = [], starts = [], idx = new Map(); let raw = "";
      const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
      while (w.nextNode()) { const n = w.currentNode; idx.set(n, nodes.length); nodes.push(n); starts.push(raw.length); raw += n.nodeValue; }
      let norm = "", ws = true; const at = [];
      for (let i = 0; i < raw.length; i++) { const c = raw.charCodeAt(i), sp = c === 32 || c === 10 || c === 9 || c === 13 || c === 160 || c === 12;
        if (sp) { if (!ws) { norm += " "; at.push(i); } ws = true; } else { norm += raw[i]; at.push(i); ws = false; } }
      at.push(raw.length);
      return { nodes, starts, idx, raw, norm, at };
    }
    function rawOf(F, c, o) {
      if (c.nodeType === 3) { const i = F.idx.get(c); return i == null ? null : F.starts[i] + Math.min(o, c.nodeValue.length); }
      const r = document.createRange(); r.setStart(c, o);
      let lo = 0, hi = F.nodes.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (r.comparePoint(F.nodes[mid], 0) < 0) lo = mid + 1; else hi = mid; }
      return lo < F.nodes.length ? F.starts[lo] : F.raw.length;
    }
    const normOf = (F, raw) => { let lo = 0, hi = F.at.length - 1; while (lo < hi) { const mid = (lo + hi) >> 1; if (F.at[mid] < raw) lo = mid + 1; else hi = mid; } return lo; };
    function pointAt(F, raw, end) {
      const want = end ? raw - 1 : raw; let lo = 0, hi = F.nodes.length - 1;
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (F.starts[mid] <= want) lo = mid; else hi = mid - 1; }
      const n = F.nodes[lo]; return [n, Math.max(0, Math.min(n.nodeValue.length, raw - F.starts[lo]))];
    }
    const idOf = (el) => (el?.id ? el.id : el?.parentElement?.closest?.("[id]")?.id) || null;
    const scopeOf = (node) => { const el = node.nodeType === 1 ? node : node.parentElement, s = el?.closest?.("[data-anchor], [id]"); return s && root.contains(s) ? s : root; };
    const sameName = (base, name) => [base, ...base.querySelectorAll("[data-anchor]")].filter((e) => e.getAttribute?.("data-anchor") === name);
    function describe(range) {
      const scope = scopeOf(range.commonAncestorContainer), F = flat(scope);
      const a = rawOf(F, range.startContainer, range.startOffset), b = rawOf(F, range.endContainer, range.endOffset);
      if (a == null || b == null || b <= a) return null;
      let ns = normOf(F, a), ne = normOf(F, b);
      while (ns < ne && F.norm[ns] === " ") ns++; while (ne > ns && F.norm[ne - 1] === " ") ne--;
      if (ne <= ns) return null;
      ne = Math.min(ne, ns + 2000);   // (a page-long selection is found again by its first 2,000 characters)
      const q = F.norm.slice(ns, ne); let n = 0, i = -1; while ((i = F.norm.indexOf(q, i + 1)) >= 0 && i < ns) n++;
      const anchor = scope.getAttribute?.("data-anchor") || null, id = idOf(scope), base = (id && document.getElementById(id)) || root;
      return { id, anchor, ai: anchor ? Math.max(0, sameName(base, anchor).indexOf(scope)) : null, q, pre: F.norm.slice(Math.max(0, ns - 32), ns), suf: F.norm.slice(ne, ne + 32), n };
    }
    function findIn(scope, hl) {
      const F = flat(scope); let best = -1, score = -1, i = -1, k = 0;
      const tail = (x, y) => { let n = 0; while (n < x.length && n < y.length && x[x.length - 1 - n] === y[y.length - 1 - n]) n++; return n; };
      const head = (x, y) => { let n = 0; while (n < x.length && n < y.length && x[n] === y[n]) n++; return n; };
      while ((i = F.norm.indexOf(hl.q, i + 1)) >= 0) {
        const s = tail(F.norm.slice(Math.max(0, i - 32), i), hl.pre || "") + head(F.norm.slice(i + hl.q.length, i + hl.q.length + 32), hl.suf || "") + (k === hl.n ? 0.5 : 0);
        if (s > score) { score = s; best = i; } k++;
      }
      if (best < 0) return null;
      const [sn, so] = pointAt(F, F.at[best], false), [en, eo] = pointAt(F, F.at[best + hl.q.length - 1] + 1, true);
      const r = document.createRange(); r.setStart(sn, so); r.setEnd(en, eo); return r;
    }
    function labelOf(el) {
      if (!el || el.nodeType !== 1) return "";
      const a = el.getAttribute("aria-label") || el.getAttribute("data-label") || el.getAttribute("data-note-label"); if (a) return clean(a, 200);
      if (el.tagName === "IMG") return clean(el.getAttribute("alt"), 200);
      const t = [...el.children].find((c) => c.tagName.toLowerCase() === "title"); if (t) return clean(t.textContent, 200);
      return el.tagName.toLowerCase() === "text" ? clean(el.textContent, 200) : "";
    }
    function locate(hl) {
      const base = (hl.id && document.getElementById(hl.id)) || (hl.id ? null : root); if (!base) return null;
      if (hl.label) { const c = [...base.querySelectorAll(hl.tag || "*")].filter((e) => labelOf(e) === hl.label); return c[hl.n] || c[0] || null; }
      const named = hl.anchor ? sameName(base, hl.anchor) : [];
      const scopes = named.length ? [named[hl.ai] || named[0], ...named] : [base];
      for (const s of scopes) { const r = s && findIn(s, hl); if (r) return r; }
      return named.length ? findIn(base, hl) : null;
    }
    // a range as the painter sees it: one piece a text node, never the parts no one can select (a diff's line numbers) nor
    // a control's own label (a Copy button beside a command)
    function segments(range) {
      const anc = range.commonAncestorContainer; if (anc.nodeType === 3) return range.collapsed ? [] : [range.cloneRange()];
      const out = [], off = new Map(), none = (p) => { if (!off.has(p)) { const s = getComputedStyle(p); off.set(p, (s.userSelect || s.webkitUserSelect) === "none"); } return off.get(p); };
      const w = document.createTreeWalker(anc, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) { const t = w.currentNode; if (!range.intersectsNode(t) || !t.nodeValue.trim() || !t.parentElement || none(t.parentElement) || t.parentElement.closest('button,select,[aria-hidden="true"]')) continue;
        const r = document.createRange(); r.selectNodeContents(t); if (t === range.startContainer) r.setStart(t, range.startOffset); if (t === range.endContainer) r.setEnd(t, range.endOffset); if (!r.collapsed) out.push(r); }
      return out;
    }
    // its words as the painter sees them: a space between blocks (a diff's lines, a table's cells), none inside one
    const BLOCK = "p,li,dt,dd,td,th,h1,h2,h3,h4,h5,h6,pre,blockquote,figcaption,summary,caption,div,section,article,text";
    const rangeText = (range) => clean(segments(range).map((r, i, all) => (i && r.startContainer.parentElement?.closest(BLOCK) !== all[i - 1].startContainer.parentElement?.closest(BLOCK) ? " " : "") + r.toString()).join(""), 600);

    // ── the notes: the review's own, in this browser; each highlighted where it is found ──
    const notes = () => read(KEY, []).filter((a) => a && a.via === "guide" && a.detail);
    const live = new Map();   // id → { range } | { el }
    function paint() {
      if (HL) { const h = new Highlight(); for (const v of live.values()) if (v.range) for (const r of segments(v.range)) h.add(r); CSS.highlights.set("rpn-note", h); }
      const want = new Set(); for (const v of live.values()) { const e = v.el || (!HL && v.range ? (v.range.commonAncestorContainer.nodeType === 1 ? v.range.commonAncestorContainer : v.range.commonAncestorContainer.parentElement) : null); if (e) want.add(e); }
      for (const e of document.querySelectorAll("[data-rpn-noted]")) if (!want.has(e)) e.removeAttribute("data-rpn-noted");
      for (const e of want) e.setAttribute("data-rpn-noted", "");
    }
    const gone = (v) => (v.range ? v.range.collapsed || !v.range.startContainer.isConnected : !v.el.isConnected);
    function resolveAll() {
      const ns = notes(), ids = new Set(ns.map((a) => a.id));
      for (const [id, v] of [...live]) if (!ids.has(id) || gone(v)) live.delete(id);
      for (const a of ns) if (!live.has(a.id) && a.hl) { const got = locate(a.hl); if (got) live.set(a.id, got.nodeType === 1 ? { el: got } : { range: got }); }
      paint(); count(); if (list && !list.hidden) renderList();
    }
    const unresolved = () => notes().some((a) => a.hl && !live.has(a.id));
    let resT = 0; const soon = () => { clearTimeout(resT); resT = setTimeout(() => { if (unresolved()) resolveAll(); }, 120); };
    new MutationObserver(soon).observe(root, { childList: true, subtree: true });
    document.addEventListener("toggle", soon, true);
    addEventListener("storage", (e) => { if (e.key === KEY) { resolveAll(); if (cur?.kind === "note" && !notes().some((a) => a.id === cur.note.id)) close(); } else if (e.key === QK) count(); });

    // ── the box, open ──
    function pending(c) {
      if (HL) CSS.highlights.set("rpn-now", new Highlight(...(c?.range ? segments(c.range) : [])));
      for (const e of document.querySelectorAll("[data-rpn-now]")) if (e !== c?.el) e.removeAttribute("data-rpn-now");
      if (c?.el) c.el.setAttribute("data-rpn-now", "");
    }
    const grow = () => { ta.style.height = "auto"; ta.style.height = `${ta.scrollHeight}px`; ta.style.overflowY = ta.scrollHeight > ta.clientHeight + 1 ? "auto" : "hidden"; };
    // what you see of it: its rects clipped to the boxes that scroll it (a diff scrolled sideways), not what is scrolled away
    function seen(rs, node) {
      const clips = []; for (let e = node?.nodeType === 1 ? node : node?.parentElement; e && e !== document.body && e !== document.documentElement; e = e.parentElement) { const st = getComputedStyle(e); if (/auto|scroll|hidden|clip/.test(st.overflowX + st.overflowY)) clips.push(e.getBoundingClientRect()); }
      const out = rs.map((r) => clips.reduce((a, c) => ({ left: Math.max(a.left, c.left), top: Math.max(a.top, c.top), right: Math.min(a.right, c.right), bottom: Math.min(a.bottom, c.bottom) }), { left: r.left, top: r.top, right: r.right, bottom: r.bottom })).filter((r) => r.right > r.left && r.bottom > r.top);
      return out.length ? out : rs;
    }
    function rectsOf(c) {
      if (c.range) { const rs = [...c.range.getClientRects()].filter((r) => r.width > 0 && r.height > 0); if (rs.length) return seen(rs, c.range.commonAncestorContainer); }
      if (c.el) return seen([c.el.getBoundingClientRect()], c.el);
      return c.rect ? [{ left: c.rect.x, top: c.rect.y, right: c.rect.x + c.rect.w, bottom: c.rect.y + c.rect.h, width: c.rect.w, height: c.rect.h }] : [];
    }
    const inset = () => { const cs = getComputedStyle(document.documentElement), d = cs.getPropertyValue("--rp-embed-dock"); return parseFloat(d.trim() ? d : cs.getPropertyValue("--rp-embed-bottom")) || 0; };
    // beside what it is on, never over it: under it, else over it; on a phone, docked at the foot, the words scrolled clear of it
    function place() {
      if (!cur || box.hidden) return;
      const rs = rectsOf(cur); if (!rs.length) return;
      const u = rs.reduce((a, r) => ({ left: Math.min(a.left, r.left), top: Math.min(a.top, r.top), right: Math.max(a.right, r.right), bottom: Math.max(a.bottom, r.bottom) }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
      const H = innerHeight, W = document.documentElement.clientWidth;
      if (box.classList.contains("dock")) {
        box.style.left = box.style.top = "";
        const top = box.getBoundingClientRect().top;
        if (u.bottom > top - 12 && u.top > 60) scrollBy({ top: Math.min(u.bottom - top + 24, u.top - 60), behavior: "auto" });
        return;
      }
      // under the selection's last line, its caret at that line (its start, or its middle when short), 8 px clear; near
      // the window's foot (or the small player's), over its first line instead; with room for neither, beside the words
      const bw = box.offsetWidth, bh = box.offsetHeight, foot = H - inset();
      const byTop = [...rs].sort((a, b) => a.top - b.top || a.left - b.left), last = byTop.filter((r) => Math.abs(r.bottom - byTop.at(-1).bottom) < 4), first = byTop.filter((r) => Math.abs(r.top - byTop[0].top) < 4);
      const lineOf = (L) => ({ left: Math.min(...L.map((r) => r.left)), right: Math.max(...L.map((r) => r.right)), top: Math.min(...L.map((r) => r.top)), bottom: Math.max(...L.map((r) => r.bottom)) });
      const lo = lineOf(last), fi = lineOf(first);
      let above = false, line = lo, y = lo.bottom + 8;
      if (y + bh > foot - 8) { const up = fi.top - bh - 8; if (up >= 8) { y = up; above = true; line = fi; } else y = Math.max(8, Math.min(lo.bottom + 8, foot - bh - 8)); }
      const at = Math.min(line.left + 24, (line.left + line.right) / 2);   // where the caret points
      const x = Math.min(Math.max(8, at - 24), W - bw - 8);
      const clear = above ? y + bh <= fi.top : y >= lo.bottom;
      box.classList.toggle("above", above); box.classList.toggle("nocaret", !clear);
      box.style.setProperty("--rpn-caret", `${Math.round(Math.max(14, Math.min(bw - 14, at - x)))}px`);
      const op = box.offsetParent, o = !op || (op === document.body && getComputedStyle(op).position === "static") ? { x: -scrollX, y: -scrollY } : (() => { const r = op.getBoundingClientRect(); return { x: r.left + op.clientLeft - op.scrollLeft, y: r.top + op.clientTop - op.scrollTop }; })();
      box.style.left = `${Math.round(x - o.x)}px`; box.style.top = `${Math.round(y - o.y)}px`;
    }
    addEventListener("resize", () => place());
    addEventListener("rp-embed-inset", () => place());   // the review page's window or its small player moved at the frame's foot
    if (window.visualViewport) visualViewport.addEventListener("resize", () => { document.documentElement.style.setProperty("--rpn-kb", `${Math.max(0, Math.round(innerHeight - visualViewport.height - visualViewport.offsetTop))}px`); if (box.classList.contains("dock")) place(); });
    function show({ animate = true } = {}) {
      const c = cur, note = c.kind === "note";
      qEl.textContent = c.quote ? `“${c.quote}”` : ""; qEl.hidden = !c.quote; qEl.title = c.where || "";
      editBtn.hidden = !(c.kind === "new" && c.editable && c.quote); editBtn.setAttribute("aria-pressed", String(c.mode === "edit"));
      trashBtn.hidden = !note;
      xBtn.title = note ? "Drop this edit (the words stay as they were)" : "Delete these words"; xBtn.setAttribute("aria-label", note ? "Drop this edit" : "Delete these words");
      kEl.innerHTML = note ? `<kbd>Enter</kbd> saves · <kbd>Esc</kbd> closes (kept) · <kbd>×</kbd> drops the edit` : `<kbd>Enter</kbd> saves · <kbd>Esc</kbd> closes (kept) · <kbd>×</kbd> deletes`;
      ta.setAttribute("aria-label", note ? "Your words for this — Enter saves the edit, Esc closes and keeps it, × drops it" : "Your words for this — Enter saves them, Esc closes and keeps them, × deletes them");
      ta.placeholder = c.mode === "edit" ? "The words as you would have them" : "Your note, a question, or a suggested edit…";
      ta.value = note ? (c.note.edit ? c.note.edit.after : c.note.comment || "") : c.mode === "edit" ? c.quote : "";
      ans.hidden = true; ans.innerHTML = "";
      pending(c);
      box.classList.toggle("dock", docked()); box.hidden = false; grow(); place();
      if (animate && !reduced()) { box.classList.remove("in"); void box.offsetWidth; box.classList.add("in"); }
      // a phone keeps its selection (and its handles) until you tap into the box; elsewhere, straight into the words
      if (!coarse() || c.opener) { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); }
    }
    function openNew(c) {
      settle();
      if (!c.range && !c.el && !c.rect) return;
      const w = c.w || whereOf(c.range ? c.range.startContainer : c.el);
      let hl = null;
      if (c.range) hl = describe(c.range);
      else if (c.el) { const base = document.getElementById(idOf(c.el)) || root, tag = c.el.tagName.toLowerCase(); hl = { id: idOf(c.el), label: c.label, tag, n: Math.max(0, [...base.querySelectorAll(tag)].filter((e) => labelOf(e) === c.label).indexOf(c.el)) }; }
      if ((c.range || c.el) && !hl) return;
      const within = (n) => (n.nodeType === 1 ? n : n.parentElement)?.closest?.("[data-editable]");
      // a diagram's words: the diagram by its label (or its caption) is where they are
      const svg = c.range ? (c.range.startContainer.nodeType === 1 ? c.range.startContainer : c.range.startContainer.parentElement)?.closest?.("svg") : null;
      const drawing = svg ? `diagram · ${labelOf(svg) || clean(svg.closest("figure")?.querySelector("figcaption")?.textContent, 60) || "a picture"}` : null;
      cur = { kind: "new", range: c.range || null, el: c.el || null, rect: c.rect || null, hl, w, where: whereLabel(w), quote: c.quote || "", mode: "comment", opener: c.opener || null,
        anchor: c.anchor || (c.range ? anchorOf(c.range) : null) || w.anchor || drawing || (c.el ? `${c.el.closest("svg") ? "diagram" : "picture"} · ${clean(c.label, 60)}` : null) || w.section || "page",
        editable: c.editable ?? (!!c.range && !!within(c.range.startContainer) && within(c.range.startContainer) === within(c.range.endContainer)) };
      show();
    }
    function openNote(id, { opener = null } = {}) {
      const a = notes().find((x) => x.id === id), v = live.get(id); if (!a) return;
      settle();
      cur = { kind: "note", note: a, range: v?.range || null, el: v?.el || null, hl: a.hl, where: a.detail.where || "", quote: a.detail.text || "", mode: a.edit ? "edit" : "comment", opener };
      show();
    }
    // what is open gives way: words typed stay with what they were written about; nothing typed, it simply closes
    function settle() { if (cur && !box.hidden && cur.mode !== "asked") keep(); else if (cur) close(); }
    function close({ refocus = true } = {}) {
      const o = cur?.opener, had = box.contains(document.activeElement);
      box.hidden = true; box.classList.remove("in"); cur = null; ans.hidden = true; pending(null);
      if (had) { if (refocus && o?.isConnected && o !== document.body) o.focus({ preventScroll: true }); else document.activeElement.blur(); }
    }
    function toast(t) { const d = document.createElement("div"); d.className = "rpn-toast"; d.setAttribute("role", "status"); d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
    function keep() {
      const c = cur; if (!c) return;
      const words = ta.value.replace(/\s*\n\s*/g, " ").trim();
      if (c.kind === "note") {
        const all = read(KEY, []), a = all.find((x) => x.id === c.note.id);
        if (a) {
          if (a.edit) { if (words && words !== a.edit.before && words !== a.edit.after) { a.edit.after = words; a.comment = `Suggested edit: “${a.edit.before}” → “${words}”`; } }
          else if (words !== (a.comment || "").trim()) a.comment = words;   // an edit can empty a note's words on purpose, as a mark's
          write(KEY, all);
        }
        close(); say(`Note kept: ${c.where}`); renderList(); return;
      }
      if (!words || (c.mode === "edit" && words === c.quote) || c.mode === "asked") { close(); return; }
      const id = `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
      // highlighted at once, before anything else: the pending coral becomes the kept one without a blink
      if (c.range) live.set(id, { range: c.range }); else if (c.el) live.set(id, { el: c.el });
      paint(); close();
      try { const s = getSelection(); if (s && !s.isCollapsed && root.contains(s.anchorNode)) s.removeAllRanges(); } catch {}
      const save = () => {
        const w = c.w, d = detailOf(w.part), stepFrame = w.step != null ? (planMap?.frames || []).filter((f) => f.planStep === w.step).sort((x, y) => x.start - y.start)[0] : null;
        const t = d ? Math.ceil(d.start * 100) / 100 : stepFrame ? Math.ceil(stepFrame.start * 100) / 100 : 0;
        const edit = c.mode === "edit" ? { before: c.quote, after: words } : null;
        const a = { id, kind: "note", t, frame: d ? { index: d.frameIndex, compositionId: d.compositionId, title: (planMap?.frames || []).find((f) => f.index === d.frameIndex)?.title || null } : frameOf(t),
          plan: { step: w.step ?? d?.planStep ?? stepFrame?.planStep ?? null, questions: [], component: null }, comment: edit ? `Suggested edit: “${edit.before}” → “${edit.after}”` : words,
          detail: { name: w.part || "guide", anchor: c.anchor, text: c.quote, where: c.where, ...(w.section ? { section: w.section } : {}), ...(w.step != null ? { step: w.step } : {}) },
          via: "guide", ...(c.hl ? { hl: c.hl } : {}), ...(edit ? { edit } : {}) };
        const all = read(KEY, []); all.push(a); const ok = write(KEY, all);
        if (!ok) { live.delete(id); paint(); toast("This browser would not keep it: copy your words before you leave."); }
        else say(`Kept with your review: ${c.where}`);
        count(); renderList();
      };
      if (planMap) save(); else mapReady.then(save);
    }
    function remove(id) {
      const all = read(KEY, []), i = all.findIndex((x) => x.id === id); if (i < 0) return;
      all.splice(i, 1); write(KEY, all); live.delete(id); paint(); count(); renderList();
    }
    box.addEventListener("click", (e) => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a || !cur) return;
      if (a === "discard") { close(); return; }
      if (a === "trash") { const id = cur.note?.id; close(); if (id) { remove(id); say("Note deleted"); } return; }
      if (a === "edit") { const on = cur.mode !== "edit"; cur.mode = on ? "edit" : "comment"; editBtn.setAttribute("aria-pressed", String(on)); ta.value = on ? cur.quote : ""; ta.placeholder = on ? "The words as you would have them" : "Your note, a question, or a suggested edit…"; grow(); place(); ta.focus(); return; }
      if (a === "ask") ask();
      if (a === "save") keep();
    });
    for (const b of [xBtn, trashBtn]) b.addEventListener("mousedown", (e) => e.preventDefault());   // no blur runs first
    ta.addEventListener("keydown", (e) => {
      if (e.isComposing) return;
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); keep(); }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); keep(); }
    });
    ta.addEventListener("input", () => { grow(); place(); });
    // copying the words just highlighted still copies them, though the box took the page's selection
    ta.addEventListener("copy", (e) => { if (ta.selectionStart !== ta.selectionEnd || !cur?.quote) return; e.preventDefault(); e.clipboardData?.setData("text/plain", cur.quote); });
    box.addEventListener("focusout", (e) => { if (cur && e.relatedTarget && !box.contains(e.relatedTarget)) settle(); });

    // ── Ask: the player's rule for who answers ──
    let sample = null, sampleTried = false;
    // (the guide under the review page's player, D-264: the page that has `sample` is the one it sits in)
    const claudeOf = () => { if (window.claude) return window.claude; try { return window.parent !== window && window.parent.location.origin === location.origin ? window.parent.claude || null : null; } catch { return null; } };
    async function reachSample() { if (sampleTried) return sample; sampleTried = true; try { const c = claudeOf(), use = c?.use; sample = typeof use === "function" ? (await use.call(c, "sample")) || null : null; } catch { sample = null; } return sample; }
    const served = () => { try { return location.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(location.hostname) && !!document.querySelector('meta[name="reelplanning-review-server"]'); } catch { return false; } };
    const splitFrom = (text) => { const s = String(text || "").replace(/\s+$/, ""), m = /\n?\s*\**From:\**\s*(.+?)\s*$/i.exec(s); return m ? { answer: s.slice(0, m.index).trim(), from: m[1].replace(/\*+/g, "").trim() } : { answer: s.trim(), from: null }; };
    function prompt(q, d, around) {
      const m = planMap || {}, f = (m.frames || []).find((x) => x.index === d?.frameIndex) || {};
      const clip = (s, n) => { s = String(s || "").trim(); return s.length > n ? `${s.slice(0, n - 1)}…` : s; };
      const step = q.planStep != null ? (m.plan?.steps || []).find((s) => Number(s.n) === Number(q.planStep)) : f.planStep != null ? (m.plan?.steps || []).find((s) => Number(s.n) === Number(f.planStep)) : null;
      return `You answer a reviewer's question about one part of a plan's guide: the page behind a short narrated video that shows a software change. Answer only from the material below: the words they selected, the part of the guide they are in, the scene of the video it belongs to, and the plan's section for it. Use plain words, two to five short sentences, no headings or lists. If the material does not answer the question, say so plainly, and say what is closest.

End with one line saying where the answer came from, in exactly this form:
From: <the guide, "<part>" | the plan, step N | this scene's narration | not in the guide, the plan or the video>
(join several with "; ")

## The question
${q.question}

## The words they selected, in the guide's part "${clip(q.detail?.title || q.detail?.name || "", 120)}"
"${clip(q.quote, 600)}"

## That part of the guide
${clip(around, 3000) || "(not read)"}

## The scene it belongs to: scene ${f.index ?? "?"}, "${clip(f.title || "", 120)}"
Narration: ${clip(f.narration || "(not in this video's map)", 2000)}

## The plan${m.plan?.title ? `: ${clip(m.plan.title, 200)}` : ""}
${step ? `### Step ${step.n} — ${step.title}\n${clip(step.text, 5000)}` : "(no step: this part is about the change as a whole)"}`;
    }
    async function ask() {
      const c = cur; if (!c) return; await mapReady;
      const w = c.w || {}, part = w.part || c.note?.detail?.name || null, d = detailOf(part), t = d ? d.start : 0, fr = d ? (planMap?.frames || []).find((f) => f.index === d.frameIndex) : frameOf(t);
      const node = c.range?.commonAncestorContainer || c.el, around = (node?.nodeType === 1 ? node : node?.parentElement)?.closest?.(".kind, section")?.innerText || "";
      const q = { id: `ask-${Date.now().toString(36)}`, question: (ta.value.trim() || "What does this mean?").slice(0, 2000), t: +Number(t).toFixed(2), frame: fr ? { index: fr.index, title: fr.title } : null, planStep: w.step ?? d?.planStep ?? c.note?.plan?.step ?? null,
        askedAt: new Date().toISOString(), quote: c.quote || c.anchor, detail: { name: part || "guide", anchor: c.anchor || c.note?.detail?.anchor || null, title: d?.title || c.where || part }, via: "guide", status: "asking" };
      const save = () => { const all = read(QK, []); const i = all.findIndex((x) => x.id === q.id); if (i >= 0) all[i] = q; else all.push(q); write(QK, all); count(); };
      save(); c.mode = "asked"; ta.value = ""; grow();
      const show = (body, from) => { if (cur !== c) return; ans.hidden = false; ans.innerHTML = `<span class="me">${esc(q.question)}</span>${body}${from ? `<span class="from">From: ${esc(from)}</span>` : ""}`; place(); };
      show("Thinking…");
      const s = await reachSample();
      if (s) {
        try { const r = await s(prompt(q, d, around), { modelTier: "quick", onText: ({ text }) => show(esc(splitFrom(text).answer)) }); const sp = splitFrom(r.text);
          Object.assign(q, { answer: sp.answer, from: sp.from || "not said", via: "claude", status: "answered", answeredAt: new Date().toISOString() }); show(esc(q.answer), `${q.from} · answered by Claude`); }
        catch { Object.assign(q, { status: "review", via: "review", note: "No answer this time. Your question goes with your review." }); show(esc(q.note)); }
        save(); return;
      }
      if (served()) {
        let j = null; try { const r = await fetch(new URL("/api/ask", location.origin), { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ id: q.id, video: slug, planDir: planMap?.planDir || null, title: planMap?.title || null, question: q.question, t: q.t, frame: q.frame, planStep: q.planStep, narration: null, quote: q.quote }) }); j = await r.json(); } catch {}
        if (j?.ok && j.handledBy === "session") {
          Object.assign(q, { status: "waiting", via: "session", askId: j.id }); save(); show("Asked the agent session waiting on this page…");
          for (let i = 0; i < 60; i++) { await new Promise((ok) => setTimeout(ok, 2000)); let a = null; try { const r = await fetch(new URL(`/api/ask?id=${encodeURIComponent(j.id)}`, location.origin), { cache: "no-store" }); a = r.ok ? await r.json() : null; } catch {}
            if (a?.answered) { Object.assign(q, { answer: String(a.answer || ""), from: a.from || "not said", status: "answered", answeredAt: a.answeredAt || new Date().toISOString() }); save(); show(esc(q.answer), `${q.from} · answered by the agent session`); return; } }
          Object.assign(q, { status: "review", note: "No answer from the session in two minutes, so your question goes with your review." }); save(); show(esc(q.note)); return;
        }
        Object.assign(q, { status: "review", via: "review", note: "No agent session is waiting on this page, so your question goes with your review and is answered in the next version." }); save(); show(esc(q.note)); return;
      }
      Object.assign(q, { status: "review", via: "review", note: "Your question goes with your review, and is answered in the next version." }); save(); show(esc(q.note));
    }

    // ── the ways in: a selection let go of, a labelled thing or a line's number clicked, a highlight clicked, N ──
    const inPage = (n) => { const el = n && (n.nodeType === 1 ? n : n.parentElement); return !!el && root.contains(el) && !box.contains(el) && !el.closest("input,textarea,select,[contenteditable]"); };
    const sameRange = (a, b) => a && b && a.startContainer === b.startContainer && a.startOffset === b.startOffset && a.endContainer === b.endContainer && a.endOffset === b.endOffset;
    function fromSelection({ quiet = false } = {}) {
      const s = getSelection(); if (!s || s.isCollapsed || !s.rangeCount) return false;
      const r = s.getRangeAt(0); if (!inPage(r.commonAncestorContainer)) return false;
      const quote = rangeText(r) || clean(String(s), 600); if (!quote) return false;
      if (cur?.kind === "new" && sameRange(cur.range, r)) { if (!quiet) ta.focus({ preventScroll: true }); return true; }
      // a phone's handles moved while the box waits, nothing typed yet: the box follows, it does not close and open again
      if (quiet && cur?.kind === "new" && cur.range && !ta.value.trim() && !box.hidden) {
        const hl = describe(r); if (!hl) return false; const w = whereOf(r.startContainer);
        Object.assign(cur, { range: r.cloneRange(), hl, w, where: whereLabel(w), quote, anchor: anchorOf(r) || w.anchor || cur.anchor });
        qEl.textContent = `“${quote}”`; qEl.title = cur.where; pending(cur); place(); return true;
      }
      openNew({ range: r.cloneRange(), quote });
      return true;
    }
    let touchAt = 0, touching = 0, selT = 0;
    const later = () => { clearTimeout(selT); selT = setTimeout(() => { if (touching || box.contains(document.activeElement)) return; fromSelection({ quiet: true }); }, 450); };
    document.addEventListener("touchstart", () => { touching++; touchAt = Date.now(); }, { passive: true, capture: true });
    for (const ev of ["touchend", "touchcancel"]) document.addEventListener(ev, () => { touching = Math.max(0, touching - 1); touchAt = Date.now(); later(); }, { passive: true, capture: true });
    // a mouse or a pen: on letting go, never while dragging
    document.addEventListener("mouseup", (e) => { if (e.button || Date.now() - touchAt < 900 || box.contains(e.target)) return; setTimeout(() => fromSelection(), 0); });
    // a phone's long-press, and its handles moved: once the selection has settled
    document.addEventListener("selectionchange", () => { if (Date.now() - touchAt < 2500 || (coarse() && !matchMedia("(any-pointer: fine)").matches)) later(); });
    // the keyboard: Shift and the arrows, let go of Shift
    document.addEventListener("keyup", (e) => { if (e.key === "Shift" && !box.contains(e.target)) fromSelection(); });
    // anywhere else pressed: what is open gives way (words kept, an empty box simply closes)
    document.addEventListener("pointerdown", (e) => { if (cur && !box.hidden && !box.contains(e.target) && !(list && (list.contains(e.target) || yb?.contains(e.target)))) settle(); }, true);
    function noteAt(x, y, t) {
      for (const [id, v] of live) if (v.el && (v.el === t || v.el.contains(t))) return id;
      for (const [id, v] of live) if (v.range) for (const r of v.range.getClientRects()) if (x >= r.left - 1 && x <= r.right + 1 && y >= r.top - 1 && y <= r.bottom + 1) return id;
      return null;
    }
    // a labelled thing in a diagram or a picture; never a control, nor what a widget draws to be clicked
    function labelledAt(t) {
      if (!t || t.nodeType !== 1 || !inPage(t) || t.closest(CONTROL)) return null;
      const svg = t.closest("svg");
      let hit = null;
      if (svg) { for (let n = t; n && n !== svg.parentElement; n = n.parentElement) { const l = labelOf(n); if (l) { hit = { el: n, label: l }; break; } } }
      else { const e = t.closest("img[alt]:not([alt='']), [role=img][aria-label], canvas[aria-label], [data-note-label]"); if (e) hit = { el: e, label: labelOf(e) }; }
      if (!hit) return null;
      for (let n = t; n && n !== hit.el.parentElement; n = n.parentElement) if (getComputedStyle(n).cursor === "pointer") return null;
      return hit;
    }
    function openOn(el, opener = null) {
      const lab = labelledAt(el) || (el.matches?.("svg *, svg") && labelOf(el) ? { el, label: labelOf(el) } : null);
      if (lab && lab.el.tagName.toLowerCase() !== "text") { openNew({ el: lab.el, label: lab.label, quote: lab.label, opener }); return; }
      const target = lab?.el || el, r = document.createRange(); r.selectNodeContents(target);
      const quote = rangeText(r) || labelOf(target); if (!quote) return;
      if (!rangeText(r)) { openNew({ el: target, label: quote, quote, opener }); return; }
      openNew({ range: r, quote, opener });
    }
    document.addEventListener("click", (e) => {
      if (e.button || e.defaultPrevented || box.contains(e.target) || !inPage(e.target)) return;
      const s = getSelection(); if (s && !s.isCollapsed && inPage(s.anchorNode)) return;   // a selection: its own way in
      const ln = e.target.closest(".L .n");
      if (ln) { const L = ln.closest(".L"), c = L.querySelector(".c") || L, r = document.createRange(); r.selectNodeContents(c); openNew({ range: r, quote: clean(c.textContent, 600) || L.getAttribute("data-anchor"), anchor: L.getAttribute("data-anchor") }); return; }
      if (e.target.closest(CONTROL)) return;
      const id = noteAt(e.clientX, e.clientY, e.target); if (id) { openNote(id); return; }
      const lab = labelledAt(e.target); if (lab) openOn(lab.el);
    });
    // what you are reading: the block at the reading line
    function reading() {
      const m = root.querySelector("main") || root, r = m.getBoundingClientRect(), x = Math.min(Math.max(r.left + 48, 8), innerWidth - 8);
      for (const f of [0.3, 0.2, 0.45, 0.6]) { const e = document.elementFromPoint(x, innerHeight * f)?.closest?.("[data-anchor], p, li, h1, h2, h3, h4, td, th, figcaption, pre, blockquote, dd, dt, summary, figure, svg"); if (e && root.contains(e)) return e; }
      return null;
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cur && !box.hidden && !box.contains(document.activeElement)) { e.preventDefault(); keep(); return; }
      if ((e.key !== "n" && e.key !== "N") || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented || e.repeat) return;
      const t = e.target; if (t?.closest?.("input,textarea,select,[contenteditable]") || box.contains(t)) return;
      const opener = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
      if (fromSelection()) { e.preventDefault(); if (cur) cur.opener = opener; return; }
      const f = opener && root.contains(opener) ? opener : reading(); if (!f) return;
      e.preventDefault(); openOn(f, opener || document.body);
    });

    // ── going to a note: from the review page's list, from your notes here, or a deep link ──
    const frame = () => new Promise((ok) => requestAnimationFrame(() => ok()));
    function openFolds(node) { for (let p = node.nodeType === 1 ? node : node.parentElement; p; p = p.parentElement) if (p.tagName === "DETAILS" && !p.open) p.open = true; }
    async function goTo(id) {
      const a = notes().find((x) => x.id === id); if (!a) return false;
      resolveAll(); let v = live.get(id);
      if (!v && a.hl?.id && document.getElementById(a.hl.id) == null) { try { window.RPGuide?.openAt?.(a.hl.id); } catch {} resolveAll(); v = live.get(id); }
      for (let i = 0; !v && i < 6; i++) {   // inside a fold not drawn yet: open the folds of its place, one level a time
        const base = (a.hl?.id && document.getElementById(a.hl.id)) || null; if (!base) break;
        openFolds(base); if (base.tagName === "DETAILS") base.open = true;
        const shut = [...base.querySelectorAll("details:not([open])")]; if (!shut.length) { await frame(); resolveAll(); v = live.get(id); break; }
        shut.forEach((d) => { d.open = true; }); await frame(); await frame(); resolveAll(); v = live.get(id);
      }
      if (!v) { say("That note's place is not on this page"); return false; }
      openFolds(v.el || v.range.startContainer); await frame();
      const r = v.el ? v.el.getBoundingClientRect() : v.range.getBoundingClientRect();
      scrollTo({ top: Math.max(0, scrollY + r.top - innerHeight * 0.35), behavior: reduced() ? "auto" : "smooth" });
      // lit once it is there: the scroll come to rest (a few frames still), or two seconds at most
      const t0 = performance.now(); let y = NaN, same = 0;
      while (same < 4 && performance.now() - t0 < 2000) { await frame(); same = Math.abs(scrollY - y) < 0.5 ? same + 1 : 0; y = scrollY; }
      lit(v); return true;
    }
    let litT = 0;
    function lit(v) {
      clearTimeout(litT);
      for (const e of document.querySelectorAll("[data-rpn-lit]")) e.removeAttribute("data-rpn-lit");
      if (HL) CSS.highlights.set("rpn-lit", new Highlight(...(v.range ? segments(v.range) : [])));
      if (v.el || !HL) (v.el || (v.range.commonAncestorContainer.nodeType === 1 ? v.range.commonAncestorContainer : v.range.commonAncestorContainer.parentElement)).setAttribute("data-rpn-lit", "");
      litT = setTimeout(() => { if (HL) CSS.highlights.delete("rpn-lit"); for (const e of document.querySelectorAll("[data-rpn-lit]")) e.removeAttribute("data-rpn-lit"); }, 1800);
    }
    if (EMBED) addEventListener("message", (e) => { if (e.source !== window.parent || e.origin !== location.origin) return; const m = e.data; if (m && typeof m === "object" && m.type === "rp-guide-host" && m.event === "note") goTo(String(m.id || "")); });
    const byHash = () => { const m = /^#rpn-(.+)$/.exec(location.hash); if (m) setTimeout(() => goTo(decodeURIComponent(m[1])), 120); };
    addEventListener("hashchange", byHash);

    // ── a part in a frame on this page (the bridge's messages) ──
    if (frames) addEventListener("message", (e) => {
      const m = e.data; if (!m || typeof m !== "object" || m.type !== "rp-detail") return;
      const fr = [...document.querySelectorAll("iframe[data-part]")].find((f) => f.contentWindow === e.source); if (!fr) return;
      if (m.event === "size" && Number(m.height) > 0) { fr.style.height = `${Math.min(20000, Math.ceil(Number(m.height)))}px`; return; }
      if (m.event === "ready") { faces(e.source); return; }
      if (m.event !== "select" && m.event !== "anchor") return;
      const fb = fr.getBoundingClientRect(), r = m.rect || { x: 0, y: 0, w: 0, h: 0 }, w = whereOf(fr);
      openNew({ w: { ...w, part: fr.dataset.part, step: w.step ?? detailOf(fr.dataset.part)?.planStep ?? null }, anchor: clean(m.anchor, 120) || "page", quote: clean(m.text, 600), editable: !!m.editable,
        rect: { x: fb.left + (+r.x || 0), y: fb.top + (+r.y || 0), w: +r.w || 0, h: Math.min(+r.h || 0, 60) } });
    });
    // a sandboxed part cannot load the page's faces itself: they are posted to it, as the player does
    let facesP = null;
    function faces(win) {
      const base = document.querySelector("style[data-rp-faces]")?.dataset.base; if (!base || !window.FontFace) return;
      facesP ||= fetch(new URL("faces.json", new URL(base, location.href))).then((r) => r.json()).then(async (m) => ({ roles: Object.fromEntries(Object.entries(m.roles || {}).map(([k, r]) => [k, `"${r.family}"${r.fallback ? `, ${r.fallback}` : ""}`])),
        faces: await Promise.all(m.faces.map(async (f) => ({ family: f.family, data: await (await fetch(new URL(f.file, new URL(base, location.href)))).arrayBuffer(), descriptors: { weight: String(f.weight || "400"), style: f.style || "normal", ...(f.unicodeRange ? { unicodeRange: m.ranges?.[f.unicodeRange] || f.unicodeRange } : {}) } }))) })).catch(() => null);
      facesP.then((f) => { if (f) try { win.postMessage({ type: "rp-player", event: "faces", ...f }, "*"); } catch {} });
    }

    // ── yours: what this review holds, from the video and from here; exported as the review page exports it ──
    const yb = document.querySelector("[data-yours]");
    function count() { if (!yb) return; const n = read(KEY, []).filter((a) => a.comment || a.detail).length + read(QK, []).length; yb.hidden = false; yb.querySelector(".n").textContent = n; }
    let list = null;
    function renderList() {
      if (!list || list.hidden) return;
      const all = read(KEY, []).filter((a) => a.comment || a.detail), qs = read(QK, []), dir = planMap?.planDir || "<plan-dir>";
      const item = (a) => a.via === "guide" && a.detail
        ? `<li><button type="button" class="go" data-go="${esc(a.id)}"${live.has(a.id) ? "" : ' disabled title="Its place is in a part of the guide not on this page"'}>${esc(a.detail.where || a.detail.name)}</button>${a.detail.text ? `<span class="qt">“${esc(a.detail.text)}”</span>` : ""}<span class="c">${esc(a.comment || "")}</span><button type="button" class="rm" data-rm="${esc(a.id)}">remove</button></li>`
        : `<li><span class="go" aria-disabled="true">${a.detail ? `${esc(a.detail.name)} · ${esc(a.detail.anchor)}` : `the video at ${fmt(a.t || 0)}`}</span><span class="c">${esc(a.comment || "(a mark)")}</span></li>`;
      list.innerHTML = `<h4>Your notes</h4><p class="w">${EMBED ? "The same review as the video's: Finish review sends all of it." : "Kept in this browser with the video's review: Finish review on the video sends them, or export them here."} Highlight anything to add one, or press N.</p>`
        + `<ol>${[...all.map(item), ...qs.map((q) => `<li><span class="go" aria-disabled="true">asked${q.detail ? ` · ${esc(q.detail.title || q.detail.name)}` : q.frame ? ` · scene ${q.frame.index}` : ""}</span><span class="c">${esc(q.question)}</span>${q.answer ? `<span class="qt">${esc(q.answer.slice(0, 200))}</span>` : ""}</li>`)].join("") || "<li>Nothing yet.</li>"}</ol>`
        + (EMBED ? "" : `<div class="foot"><button type="button" data-export>Export your review</button><p>Downloads annotations.json, as the review page's Finish does. Then, at the repo's root:</p><code>${RP_COMMAND} reel record ${esc(dir)} ~/Downloads/annotations.json</code></div>`);
    }
    function exportReview() {
      const out = { version: 1, src, project: planMap?.project || null, exportedAt: new Date().toISOString(), from: "guide",
        watch: { firstPlayAt: null, maxTimeReached: 0, durationSeconds: planMap?.totalSeconds || null, completion: null, moments: [], details: [] },
        decisions: Object.entries(read(DK, {}) || {}).map(([id, v]) => ({ id, ...v })), quizzes: [], autonomy: [],
        questions: read(QK, []).map(({ status, askId, ...q }) => ({ ...q, ...(q.answer ? {} : { answered: false }) })), verdict: null, annotations: read(KEY, []) };
      const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "annotations.json"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      say(`Exported annotations.json with ${out.annotations.length} note${out.annotations.length === 1 ? "" : "s"}`);
      return out;
    }
    if (yb) {
      list = document.createElement("div"); list.className = "rpn-list"; list.hidden = true; list.setAttribute("role", "dialog"); list.setAttribute("aria-label", "Your notes");
      document.body.appendChild(list);
      yb.addEventListener("click", () => { if (!list.hidden) { list.hidden = true; return; } list.hidden = false; resolveAll(); renderList(); list.querySelector("button")?.focus({ preventScroll: true }); });
      list.addEventListener("click", (e) => {
        const g = e.target.closest("[data-go]"); if (g) { list.hidden = true; goTo(g.dataset.go); return; }
        const r = e.target.closest("[data-rm]"); if (r) { remove(r.dataset.rm); return; }
        if (e.target.closest("[data-export]")) exportReview();
      });
      list.addEventListener("keydown", (e) => { if (e.key === "Escape") { list.hidden = true; yb.focus(); } });
      document.addEventListener("pointerdown", (e) => { if (!list.hidden && !list.contains(e.target) && !yb.contains(e.target)) list.hidden = true; });
    }
    resolveAll(); byHash();
    const api = { open: openNew, openNote, close, goTo, notes, exportReview, key: KEY, resolve: resolveAll, live };
    window.RPGuideReview.page = api;   // the page's own (its tests read it)
    return api;
  }
  window.RPGuideReview = { init };
})();
