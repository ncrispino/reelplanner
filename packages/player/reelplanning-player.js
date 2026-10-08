// <reelplanning-player>: the review player. A HyperFrames video with what a review needs around it: marks and
// comments on the frame, the plan's questions answered on it, the record of the review beneath it, and Finish, which
// hands the review to the agent. <reelplanning-guide>, at the end of this file, shows the video's guide under it.
//
//   <reelplanning-player src="videos/l1-upload-resume/index.html"
//                        plan-map="videos/l1-upload-resume/plan-map.json"></reelplanning-player>
//
// Every annotation is time-anchored AND plan-anchored:
//   { id, kind: "stroke"|"arrow"|"box"|"wait"|"note", t, frame: {index, compositionId, title},
//     plan: { step, questions, component }, path: [[x,y]…] (0..1, composition space), comment }
// `plan` comes from (a) the clip under the playhead via plan-map.json and (b) hit-testing the
// composition DOM under the stroke for data-plan-step / data-plan-component attributes, so a stroke
// on the "Step 3" rail slot resolves to step 3 even if the playhead is on the callback frame.
// Export → annotations.json (download + `annotations` event). Nothing here touches the video.
//
// The chrome follows docs/design-rationale.md §3: the video's palette (cream, tile, ink, one coral),
// the video's three type voices (serif for sentences, sans for chrome, mono for times and ids),
// coral only for what is yours or waits on you (D-142), an 8 px grid,
// and every control with its keyboard letter on it.

import "../../node_modules/@hyperframes/player/dist/hyperframes-player.js";
// How the reviewer runs reelplanning in the lines shown after an export: RP_COMMAND in scripts/lib/env.mjs, the one
// place that says, copied here by scripts/release/sync-version.mjs (scripts/test/version.spec.mjs checks they agree).
const RP_COMMAND = "reelplanning";
// HyperFrames mutes and locks all audio when its user agent says it is inside the Claude desktop app
// (`Claude/<n>` + `Electron`), and refuses to unmute. A review is narrated, so in the app it played in
// silence while our mute button said the sound was on. The lock is only that user-agent check; turn it
// off here, before any <hyperframes-player> exists, and the reviewer's own mute button stays the one
// control over sound.
{
  const HFP = customElements.get("hyperframes-player");
  if (HFP?.prototype && "_isLockedHostEnvironment" in HFP.prototype) HFP.prototype._isLockedHostEnvironment = () => false;
  // A Play pressed before the narration has loaded is queued (`_pendingPlay`) and started when the
  // assets are ready. But <audio> holds back the frame document's load event, so that event can land
  // after the player already said it was ready, and HyperFrames treats every load of a same-origin
  // frame as a new document: it resets and drops the queued play. On a slow link the reviewer pressed
  // Play and got a still, silent frame. The document is the same one, so keep the reviewer's Play:
  // HyperFrames' own ready path plays a pending play once it has re-probed. (Patched on the prototype
  // before any player exists, because each player binds this handler when it is constructed.)
  const onLoad = HFP?.prototype?._onIframeLoad;
  if (typeof onLoad === "function") HFP.prototype._onIframeLoad = function () { const queued = this._pendingPlay; onLoad.call(this); if (queued && this._paused) this._pendingPlay = true; };
}

// The page's typefaces. packages/player/fonts/faces.json is the one list of them (which family is the
// sans, the serif and the mono, and each face's file); nothing else names a family. They are declared in
// the page's own <head>, because a face declared inside a shadow root does not apply, and the three roles
// become --rp-sans, --rp-serif and --rp-mono on the page, which the player's --sans, --serif and --mono read
// (so the page's own header can use them too). A bundle inlines the list (<script type="application/json"
// id="rp-faces">) and preloads the files, so there they are declared before the player first draws; any
// other page that hosts the player gets the list from beside this file. Once per document.
function fontFaceCss(m, base) {
  const q = (f) => `"${String(f).replace(/["\\]/g, "")}"`;
  const faces = (m.faces || []).map((f) => `@font-face{font-family:${q(f.family)};src:url("${new URL(f.file, base).href}") format("woff2");font-weight:${f.weight || "400"};font-style:${f.style || "normal"};${f.stretch ? `font-stretch:${f.stretch};` : ""}font-display:swap;${f.unicodeRange ? `unicode-range:${m.ranges?.[f.unicodeRange] || f.unicodeRange};` : ""}}`);
  const roles = Object.entries(m.roles || {}).map(([k, r]) => `--rp-${k}:${q(r.family)}${r.fallback ? `, ${r.fallback}` : ""}`);
  return `${faces.join("\n")}\n:root{${roles.join(";")}}`;
}
let facesList = null;   // the list declareFonts read (a promise of it), for the detail pages (detailFaces)
function declareFonts(doc = globalThis.document) {
  if (!doc?.head || doc.querySelector("style[data-rp-fonts]")) return;
  const style = doc.createElement("style"); style.setAttribute("data-rp-fonts", ""); doc.head.appendChild(style);
  const base = new URL("fonts/", import.meta.url), put = (m) => { if (m?.faces) style.textContent = fontFaceCss(m, base); return m?.faces ? m : null; };
  const inline = doc.getElementById("rp-faces");
  if (inline) { try { facesList = Promise.resolve(put(JSON.parse(inline.textContent))); return; } catch {} }
  facesList = fetch(new URL("faces.json", base)).then((r) => (r.ok ? r.json() : null)).then(put).catch(() => null);   // no list: the fallbacks in --sans, --serif, --mono
}
declareFonts();
// A detail page takes the same faces (templates/details/*.html). Its frame is sandboxed, with an opaque origin,
// so it cannot load the files itself: once it says "ready", the player posts it the list's roles and each
// face's bytes (fetched once, from beside this file, where the page's own @font-face rules already fetched
// them), and the page adds them as FontFaces. Opened on its own, a page keeps its fallbacks.
let facesForDetails = null;
function detailFaces() {
  const base = new URL("fonts/", import.meta.url), q = (f) => `"${String(f).replace(/["\\]/g, "")}"`;
  return (facesForDetails ||= (facesList || Promise.resolve(null)).then(async (m) => {
    if (!m?.faces?.length) return null;
    const faces = await Promise.all(m.faces.map(async (f) => {
      const r = await fetch(new URL(f.file, base)); if (!r.ok) throw new Error(f.file);
      return { family: String(f.family), data: await r.arrayBuffer(), descriptors: { weight: String(f.weight || "400"), style: f.style || "normal", ...(f.unicodeRange ? { unicodeRange: m.ranges?.[f.unicodeRange] || f.unicodeRange } : {}) } };
    }));
    const roles = Object.fromEntries(Object.entries(m.roles || {}).map(([k, r]) => [k, `${q(r.family)}${r.fallback ? `, ${r.fallback}` : ""}`]));
    return { roles, faces };
  }).catch(() => null));
}

const STYLE = `
:host{display:block;font:var(--fs-ui)/1.45 var(--sans);color:var(--ink);--ground:#F1EFE8;--paper:#FAF9F5;--tile:#EFE9DE;--ink:#141413;--ink-2:#3D3B37;--ink-3:#5C5953;--ink-rgb:20,20,19;--accent:#B8552E;--accent-rgb:184,85,46;--accent-text:#9C4524;--on-accent:#FFFFFF;--right:var(--ink);--navy:#181715;--lift:0 -12px 24px -16px rgba(20,20,19,.18)}
/* The page's type. The families come from the page (packages/player/fonts/faces.json: declareFonts sets
   --rp-sans, --rp-serif and --rp-mono on the document), so the look's faces are changed in one place; these
   are the only names the player's rules use. The fallbacks are for a page that could not load the faces. */
:host{--sans:var(--rp-sans,ui-sans-serif,system-ui,sans-serif);--serif:var(--rp-serif,Georgia,serif);--mono:var(--rp-mono,ui-monospace,SFMono-Regular,Menlo,monospace)}
/* One type scale for the chrome: times, ids and keys; quiet lines; controls and rows; reading text; a
   term or a card's title; the question; Finish's heading. Text on the frame keeps its clamp(…cqw…)
   sizes, so it scales with the video. */
:host{--fs-xs:12px;--fs-sm:13px;--fs-ui:15px;--fs-body:16px;--fs-lead:19px;--fs-h3:22px;--fs-h2:24px}
/* the page carries the same palette as the video inside it, for the same reasons (docs/design-rationale.md §2):
   the frame, the sheets and the panel are paper, and they sit on a slightly darker ground, like a sheet
   on a desk; a stroke drawn on the frame must look like a mark on the page.
   Text is in three solid inks, not shades of alpha: --ink for what you read first, --ink-2 for reading text
   and secondary lines, --ink-3 for times, counts and hints; each is 4.5:1 or more on the ground, the paper,
   the tile and a hovered row, light and dark (access.spec measures it).
   The accent is the darker coral, the videos' own (D-142; the theme's --rp-coral and --rp-coral-deep):
   #B8552E, 4.2:1 on the light ground where #CC785C was 2.9:1, and #D2693F in dark, 5.4:1; --accent-text is
   it at text size (#9C4524, #E3A184). It means one thing: yours, or waiting on you (a question to answer,
   your flag, your words, your marks, the card under your pointer). What is current (the part, the step,
   the video you are on) is ink; the right answer to a quick check is --right, with a tick beside it. */
:host([theme="dark"]){--ground:#0E0D0B;--paper:#141310;--tile:#232120;--ink:#F2EFE8;--ink-2:#CFCAC1;--ink-3:#A6A196;--ink-rgb:242,239,232;--accent:#D2693F;--accent-rgb:210,105,63;--accent-text:#E3A184;--on-accent:#141413;--navy:#EFE9DE;--lift:0 -12px 24px -16px rgba(0,0,0,.6)}
:host{--ink-20:rgba(var(--ink-rgb),.2);--ink-12:rgba(var(--ink-rgb),.12);--ink-06:rgba(var(--ink-rgb),.06)}
*,*::before,*::after{box-sizing:border-box}
:host(:focus){outline:none}   /* the host takes focus only so its shortcuts work; a ring round the whole page says nothing */
.sr{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;border:0!important}
/* One column, video first. The stage takes the width the viewport allows and no more height than is
   left under it, so the frame is the biggest thing on the page in every window. Every pixel of chrome
   under the frame costs 1.8 px of its width, so the chrome is two thin bands: the transport (56 px)
   and the composer (40 px), then the record's 40 px bar at the foot of the window. */
.wrap{--peek:40px;--chrome:172px;--stage:min(100%,max(320px,calc(min((100vh - var(--chrome) - var(--rp-above, 0px)) * var(--band-k, 1), 100vh - var(--chrome) - var(--rp-above, 0px) - var(--band-min, 0px)) * 16 / 9)));--stage:min(100%,max(320px,calc(min((100svh - var(--chrome) - var(--rp-above, 0px)) * var(--band-k, 1), 100svh - var(--chrome) - var(--rp-above, 0px) - var(--band-min, 0px)) * 16 / 9)))}
/* Size (the owner: "a way to zoom out a bit, the video might be too big if my monitor is big", then "more
   adjustable"): Fit is the stage as above; any size from 40% to 100% of it (--size-k, set on .wrap by
   syncSize), centred, and everything anchored to the stage (the answer layer, the cards' More, the chips, the
   captions, the band under an older video) goes with it, since all of it is sized from the stage's own box.
   It never takes the stage under 320 px, and a phone is always Fit (below).
   Past Fit, to 200% (the owner: "can we zoom into video as well? rn it just allows fit or smaller"): the stage
   keeps Fit's box, so the controls, the band and the page stay where they are, and the picture is zoomed inside
   it (--zoom-k on .zin, set by syncSize) in a view that scrolls (.zport: scroll bars, the wheel, a trackpad; the
   arrow keys stay the player's). What sits on the picture (the drawing, the cards' buttons, the answer on the
   frame, a mark's words, the captions in the frame) is inside .zin and moves with it; what sits on the view
   (the band, the sheets, the chips, the corner) stays put. */
.main{width:max(min(320px,var(--stage)),calc(var(--stage) * var(--size-k, 1)));margin:0 auto;min-width:0}
/* the stage: the video, widest, first, 16:9. No border and no radius: the paper frame sits on the ground */
.stage{position:relative;width:100%;aspect-ratio:16/9;background:var(--paper);overflow:hidden;box-shadow:0 0 0 1px rgba(var(--ink-rgb),.08)}   /* a hairline edge: in dark the paper frame is otherwise 1.05:1 against the ground */
.zport{position:absolute;inset:0;overflow:auto;scrollbar-width:none}   /* always a scroller (one made so only when zoomed in took no wheel), with nothing to scroll at Fit */
.wrap[data-zoom] .zport{overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--ink-20) transparent}
.zin{position:relative;width:100%;height:100%}
.wrap[data-zoom] .zin{width:calc(100% * var(--zoom-k, 1));height:auto;aspect-ratio:16/9}
hyperframes-player{position:absolute;inset:0;width:100%;height:100%;display:block;background:var(--paper)} /* the host paints black by default; a sub-pixel gap above the scaled frame must show paper, not a line */
canvas.overlay{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair;pointer-events:none}
.stage[data-tool="stroke"] canvas.overlay,.stage[data-tool="arrow"] canvas.overlay,.stage[data-tool="box"] canvas.overlay,.stage[data-tool="select"] canvas.overlay,.stage[data-tool="erase"] canvas.overlay{pointer-events:auto}
/* Select points at marks (a hand over one, the arrow elsewhere); the eraser draws its own ring on the frame, so no cursor sits on top of it */
.stage[data-tool="select"] canvas.overlay{cursor:default}
.stage[data-tool="select"] canvas.overlay[data-over]{cursor:pointer}
.stage[data-tool="erase"] canvas.overlay{cursor:none}
/* idle: the video's first frame is the poster, with one ink play circle in its middle and one line
   under it: how long, what it will ask, and the key that starts it */
.idle{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;pointer-events:none;text-align:center;background:rgba(250,249,245,.72)}   /* a scrim: the poster frame shows through, the circle and its line never sit on its words */
:host([theme="dark"]) .idle{background:rgba(20,19,16,.72)}
.stage[data-started] .idle{display:none}
.idle .go{pointer-events:auto;display:grid;place-items:center;width:56px;height:56px;padding:0;border:0;border-radius:50%;background:var(--ink);color:var(--paper);box-shadow:0 2px 12px rgba(20,20,19,.18);cursor:pointer}
.idle .go::before{content:"";margin-left:5px;border-left:17px solid currentColor;border-top:11px solid transparent;border-bottom:11px solid transparent}
.idle .go:hover{transform:scale(1.04)}
.idle .go[hidden]{display:none}
.idle .meta{font-size:var(--fs-sm);font-weight:500;line-height:1.4;color:var(--ink-2)}
/* The transport is two rows, 56 px in all. Row 1 is the timeline at the stage's full width; row 2 is
   Play and the clock on the left, the part you are in, and three quiet icons on the right. */
.transport{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;grid-template-rows:16px 36px;column-gap:8px;row-gap:4px;align-items:center;margin-top:8px}
.transport .play{grid-column:1;grid-row:2;display:inline-flex;align-items:center;gap:8px;min-width:76px;height:32px;padding:0 10px 0 8px;margin-left:-8px;border:0;border-radius:6px;background:none;color:var(--ink);font-size:var(--fs-ui);font-weight:500}
.transport .play::before{content:"";flex:none;width:0;height:0;border-left:11px solid currentColor;border-top:7px solid transparent;border-bottom:7px solid transparent;margin:0 2px 0 3px}
.transport .play[data-playing="true"]::before{width:11px;height:13px;border:0;border-left:4px solid currentColor;border-right:4px solid currentColor;margin:0 2px}
.transport .play:hover{background:var(--ink-06)}
.transport .time{grid-column:2;grid-row:2;font:var(--fs-xs)/1 var(--mono);color:var(--ink-3);white-space:nowrap}
.transport .rgroup{grid-column:4;grid-row:2;display:flex;align-items:center;gap:2px;margin-right:-6px}
/* mute, speed and theme: borderless 32 px icons, none of them asking for attention */
.transport .ib{display:inline-grid;place-items:center;min-width:32px;height:32px;padding:0 6px;border:0;border-radius:6px;background:none;color:var(--ink-3);line-height:0}
.transport .ib:hover,.transport .ib[aria-expanded="true"]{background:var(--ink-06);color:var(--ink)}
.transport .planbtn{font:500 var(--fs-xs)/1 var(--sans)}
/* Size: a frame icon, then "Fit" or the percent, in the speed's quiet mono; in ink, heavier, while the video is
   made smaller or zoomed in, as a speed off 1× is. The icon and a gap keep it from reading as one word with the speed's "1×". */
.vsize{position:relative;display:flex;align-items:center;margin-left:6px}
.transport .sizebtn{display:inline-flex;align-items:center;gap:5px;padding:0 7px 0 6px}
.transport .sizebtn svg{width:15px;height:15px;flex:none}
.transport .sizebtn .x{min-width:3.5ch;font:var(--fs-xs)/1 var(--mono);color:var(--ink-3);letter-spacing:.02em;text-align:left}
.transport .sizebtn:hover .x,.transport .sizebtn[aria-expanded="true"] .x{color:var(--ink)}
.transport .sizebtn .x[data-off="1"]{color:var(--ink);font-weight:600}
/* its drag opens above it, as the speed's does: 40% to 200% of Fit, live, the percent beside it, and Fit */
/* fixed where it opened (sizePop): the button moves as the video resizes under it, and a drag that moved
   with it would chase its own thumb */
.szpop{position:fixed;z-index:41;display:flex;align-items:center;gap:12px;padding:10px 10px 10px 14px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 8px 24px -8px rgba(20,20,19,.2);white-space:nowrap}
.szpop[hidden]{display:none}
.szpop .lbl{font-size:var(--fs-xs);color:var(--ink-3)}
.szpop input{width:168px;accent-color:var(--ink);cursor:ew-resize;display:block;margin:0}
.szpop output{min-width:4.5ch;font:var(--fs-xs)/1 var(--mono);color:var(--ink);text-align:right}
.szpop .fitbtn{height:28px;padding:0 10px;border:1px solid var(--ink-20);border-radius:6px;background:none;font:500 var(--fs-xs)/1 var(--sans);color:var(--ink);cursor:pointer}
.szpop .fitbtn:hover{border-color:var(--ink)}
.szpop .fitbtn:disabled{opacity:.45;cursor:default;border-color:var(--ink-12)}
/* the frame's own corner: drag it to resize the video, double-click it for Fit. Quiet until the pointer is on
   the stage; under the answer layer (z 6), so a control placed at the corner stays on top and clickable */
.szgrip{position:absolute;right:0;bottom:0;z-index:5;width:22px;height:22px;padding:0;border:0;background:none;cursor:nwse-resize;opacity:0;transition:opacity .15s;touch-action:none;color:var(--ink)}
.szgrip svg{position:absolute;right:3px;bottom:3px;width:12px;height:12px;display:block;opacity:.55}
.stage:hover .szgrip,.szgrip:focus-visible,.wrap.sizing .szgrip{opacity:1}
.szgrip:hover svg,.wrap.sizing .szgrip svg{opacity:.9}
.wrap.sizing,.wrap.sizing *{cursor:nwse-resize!important;user-select:none}
.transport .planbtn[hidden]{display:none}
.transport .planbtn[aria-pressed="true"]{background:var(--ink-06);color:var(--ink)}
.transport .ib svg{width:17px;height:17px}
.transport .mute[aria-pressed="true"]{background:none;color:var(--ink)} /* not the ink fill other toggles use: the icon itself says muted */
/* The timeline is one bar per part, YouTube-chapter style: a real gap between parts, each part filling
   with its own progress, the part under the pointer lifting and naming itself. At rest the bars are a
   4 px line; the one under the pointer thickens to 8. */
.scrub{position:relative;grid-column:1/-1;grid-row:1;height:16px;cursor:pointer;touch-action:none}
.transport .nowline{grid-column:3;grid-row:2;display:flex;align-items:center;gap:12px;min-width:0;height:32px}
.scrub i{position:absolute;display:block;font-style:normal}
.scrub .seg{top:6px;height:4px;border-radius:2px;background:var(--ink-20);overflow:hidden;transition:top .12s,height .12s,border-radius .12s}
.scrub .seg>b{display:block;height:100%;width:0;background:var(--ink-2)}
.scrub .seg.hov{top:4px;height:8px;border-radius:4px}
.scrub .chg{top:12px;height:2px;border-radius:1px;background:var(--accent);opacity:.75;pointer-events:none}
/* your comments and marks, where they are on the video: a short coral stroke over the bar (Marks: off hides them) */
.scrub .cmt{top:0;width:2px;height:5px;margin-left:-1px;border-radius:1px;background:var(--accent);pointer-events:none}
.wrap.nomarks .scrub .cmt{display:none}
.revised{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;margin:0 0 8px;font-size:var(--fs-sm);line-height:1.4;color:var(--ink-2)}
.revised[hidden]{display:none}
.wrap.revised-on{--chrome:212px}   /* the line above the frame is chrome too: 40 px more */
.revised .what{flex:1 1 260px;min-width:0}
.revised .what b{font-weight:500;color:var(--ink)}
.revised .mode{flex:none;font-weight:500;color:var(--ink);white-space:nowrap}
.revised .mode[data-only="1"]::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);margin:0 6px 1px 0;vertical-align:middle}
.revised .key{display:inline-block;width:14px;height:2px;border-radius:1px;background:var(--accent);opacity:.75;vertical-align:middle;margin:0 4px 0 2px}
.revised button,.changed .onlybtn{display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:var(--fs-sm);font-weight:500;height:32px;padding:0 10px;margin-right:-10px;border:0;border-radius:6px;background:none;color:var(--ink);cursor:pointer}
.revised button::before,.changed .onlybtn::before{content:"";border-left:8px solid currentColor;border-top:5px solid transparent;border-bottom:5px solid transparent}
.revised button:hover,.changed .onlybtn:hover{background:var(--ink-06)}
.revised button[aria-pressed="true"],.changed .onlybtn[aria-pressed="true"]{background:none;color:var(--ink)}
.revised button[aria-pressed="true"]::before,.changed .onlybtn[aria-pressed="true"]::before{border:0;width:8px;height:8px;background:currentColor}
/* After Send: a line above the frame says the review is being worked on, until its round ends (renderWork) */
.workbox{position:relative}
.working{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;min-height:32px;margin:0 0 8px;padding:0 2px 0 12px;border-radius:8px;background:var(--ink-06);font-size:var(--fs-sm);line-height:1.4;color:var(--ink-2)}
.working[hidden]{display:none}
.wrap.working-on{--chrome:212px}   /* the line above the frame is chrome too, as the revised line is: 40 px more */
.wrap.revised-on.working-on{--chrome:252px}
.working .wdot{flex:none;display:inline-flex;gap:3px}
.working .wdot i{width:5px;height:5px;border-radius:50%;background:var(--accent);opacity:.3;animation:rp-wpulse 1.2s ease-in-out infinite}
.working .wdot i:nth-child(2){animation-delay:.2s}
.working .wdot i:nth-child(3){animation-delay:.4s}
.working[data-live="0"] .wdot i{animation:none;opacity:1}
.working[data-live="0"] .wdot i+i{display:none}
.working[data-wstate="stopped"] .wdot i{background:var(--ink-3)}
@keyframes rp-wpulse{0%,80%,100%{opacity:.3}40%{opacity:1}}
@media (prefers-reduced-motion:reduce){.working .wdot i{animation:none;opacity:1}.working .wdot i+i{display:none}}
.working .wtext{flex:1 1 240px;min-width:0}
.working .wtext code{font:var(--fs-xs)/1.4 var(--mono)}
.working .wtime{flex:none;color:var(--ink-3);font-variant-numeric:tabular-nums}
.working .wbtns:empty{display:none}
.working .wbtns button{height:28px;padding:0 10px;font-size:var(--fs-sm);font-weight:500}
.working .wx{flex:none;width:32px;height:32px;padding:0;border:0;border-radius:6px;background:none;color:var(--ink-3);font-size:18px;line-height:1}
.working .wx:hover{background:var(--ink-06);color:var(--ink)}
.wready{position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);z-index:40;width:max-content;max-width:min(420px,calc(100vw - 32px));padding:14px 16px;border-radius:10px;background:var(--paper);color:var(--ink);box-shadow:0 0 0 1px var(--ink-12),0 8px 28px rgba(0,0,0,.22)}
.wready[hidden]{display:none}
.wready p{margin:0 0 4px;font-weight:500}
.wready .sub{margin:0 0 12px;font-size:var(--fs-sm);font-weight:400;color:var(--ink-2)}
.wready .acts{display:flex;gap:8px;justify-content:flex-end}
.wready .primary{background:var(--ink);border-color:var(--ink);color:var(--paper);font-weight:500}
/* The points on the timeline, one shape per kind so a quick check never reads as a plan question:
   the plan's choice is the coral diamond, a quick check an ink ring, the agent's call an ink square.
   Small (6 px) and quiet: only the next one still open is in full ink, and an answered one all but goes.
   The same shapes (.mk) key the legend in the record. */
.mk{display:block;width:6px;height:6px;box-shadow:0 0 0 1.5px var(--ground);font-style:normal}
.mk[data-kind="choice"]{transform:rotate(45deg);background:var(--accent)}
.mk[data-kind="check"]{width:8px;height:8px;border-radius:50%;border:2px solid var(--ink-3);background:var(--ground)}
.mk[data-kind="call"],.mk[data-kind="group"]{border-radius:1px;background:var(--ink-3)}
.mk[data-kind="check"][data-next]{border-color:var(--ink)}
.mk[data-kind="call"][data-next],.mk[data-kind="group"][data-next]{background:var(--ink)}
.legend .mk{box-shadow:0 0 0 2px var(--paper)}
/* answered: the colour dims, not the whole mark, so its halo still lifts it off the played bar */
.mk[data-kind="choice"][data-answered="true"]{background:rgba(var(--accent-rgb),.42)}
.mk[data-kind="check"][data-answered="true"]{border-color:var(--ink-20);background:var(--ink-20)}
.mk[data-kind="call"][data-answered="true"],.mk[data-kind="group"][data-answered="true"]{background:var(--ink-20)}
.scrub .tick{top:5px;margin-left:-3px;pointer-events:none}
.scrub .tick[data-kind="check"]{top:4px;margin-left:-4px}
.scrub .head{top:1px;width:3px;height:14px;margin-left:-1.5px;border-radius:2px;background:var(--ink);box-shadow:0 0 0 2px var(--ground);pointer-events:none}
.scrub .hover{bottom:calc(100% + 6px);transform:translateX(-50%);padding:5px 9px;border-radius:6px;background:var(--ink);color:var(--paper);font-size:var(--fs-xs);line-height:1.3;white-space:nowrap;pointer-events:none;display:none;z-index:4}
.scrub .hover.on{display:block}
.scrub .hover .tm{font-family:var(--mono);opacity:.7;margin-left:6px}
.scrub .hover .tm.at{margin-left:0}
/* the key to those shapes: one line at the foot of Steps in the record, only the kinds this plan has */
.legend{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;margin:0 0 12px;font-size:var(--fs-xs);color:var(--ink-3)}
.legend[hidden]{display:none}
.legend span{display:inline-flex;align-items:center;gap:6px}
.legend .mk{display:inline-block;flex:none}
/* A part begins: a small card in the frame's top-left corner names it, and the video plays on.
   It never takes a click (the frame under it stays drawable) and leaves by itself. */
.partcard{position:absolute;left:12px;top:12px;z-index:2;display:block;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 24px);padding:6px 12px 7px;border-radius:6px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 2px 8px rgba(var(--ink-rgb),.08);pointer-events:none;opacity:0;transform:translateY(-4px);transition:opacity .22s,transform .22s;white-space:nowrap}
.partcard.on{opacity:1;transform:none}
.partcard .k{font:500 var(--fs-sm)/1.3 var(--sans);color:var(--ink-3)}
.partcard .sep{margin:0 6px;color:var(--ink-3)}
.partcard .t{font:400 var(--fs-lead)/1.25 var(--serif);color:var(--ink)}
@media (prefers-reduced-motion:reduce){.partcard{transition:none}}
/* the way back to the old stop at the end of every part, off by default; with the level, at the foot of Steps */
.pauseparts{display:flex;align-items:center;gap:8px;margin:12px 0 0;font-size:var(--fs-sm);color:var(--ink-3);cursor:pointer;width:max-content;max-width:100%}
.pauseparts[hidden]{display:none}
.pauseparts input{margin:0;accent-color:var(--ink);cursor:pointer}
/* one answer, one line, to paste: a quiet link like "change", shown where the pointer or the focus
   is, and always on a touch screen, where there is no hover to find it by */
.cp{opacity:0;transition:opacity .12s}
.dec:hover .cp,.ann:hover .cp,.dec:focus-within .cp,.ann:focus-within .cp,.cp[data-copied]{opacity:1}
.cp[data-copied]{color:var(--ink)}
@media (hover:none){.cp{opacity:1}}
/* The parts. Only the part you are in is named at rest, in row 2 beside the clock; every other part
   is still there, numbered, where its bar is, and each one the button that jumps to its start (N / P
   from the keyboard). They show on hover or focus, and are faded out, not taken out: a click on one
   works whether or not it has been seen. When the current part's title does not fit its share it
   takes the room it needs and the others close up to their numbers (layoutParts). */
.labels{position:relative;flex:1 1 auto;min-width:0;height:24px}
.labels:empty{display:none}
.labels .part{position:absolute;top:0;display:flex;align-items:center;gap:6px;height:24px;min-height:0;padding:0;border:0;border-radius:4px;background:none;color:var(--ink-3);font-size:var(--fs-sm);line-height:24px;overflow:hidden;cursor:pointer;text-align:left;white-space:nowrap;transition:opacity .15s}
.labels .part:not([aria-current="true"]){opacity:0;pointer-events:none}
.labels:hover .part,.labels:focus-within .part{opacity:1;pointer-events:auto}
@media (hover:none){.labels .part{opacity:1;pointer-events:auto}}   /* no hover to find them by: always there */
.labels .part .pn{flex:0 0 auto;display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 4px;border:1px solid var(--ink-20);border-radius:4px;font:500 var(--fs-xs)/1 var(--mono);color:var(--ink-2)}
.labels .part .pt{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
.labels .part.tight .pt{display:none}
.labels[data-compact] .part:not([aria-current="true"]){visibility:hidden}   /* a row too narrow for every number (a phone): the part you are in, named; N / P and the timeline reach the rest */
.labels .part:hover{color:var(--ink)}
.labels .part:hover .pn{border-color:var(--ink);color:var(--ink)}
.labels .part[aria-current="true"]{color:var(--ink-2)}
.labels .part[aria-current="true"] .pn{background:var(--ink);border-color:var(--ink);color:var(--paper)}  /* current is ink: coral is only for what waits on you */
/* the standing line (Playing at 0:40) says what the Play button already says, so it is for screen
   readers only; it shows when something is waiting on the reviewer, or to confirm an act for a moment */
.status{margin:0;font-size:var(--fs-xs);line-height:1.3;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.status:not([data-show]){position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}
.status[data-show]{flex:0 1 auto;max-width:50%;margin-left:auto}
.status[data-show="wait"]{color:var(--accent-text)}
/* One row under the transport: Mark, the comment, Finish. Mark is a word, the comment an underline,
   Post appears only once there is something to post, and Finish is the one filled button on the page. */
.toolbar{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin-top:4px;min-height:40px}
.group{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.group.finish{margin-left:auto}
.markbtn{height:32px;padding:0 8px;margin-left:-8px;border:0;background:none;color:var(--ink-2);font-size:var(--fs-ui)}
.markbtn:hover{background:var(--ink-06);color:var(--ink)}
.markbtn[aria-pressed="true"]{background:none;color:var(--accent-text)}
.markbtn[aria-pressed="true"] kbd{color:var(--accent-text)}
/* the shape picker: hairline, attached under Mark, and only in the DOM while the tool is live */
.shapes{display:none;gap:2px;padding:2px;border-radius:8px;background:var(--ink-06)}
.toolbar.marking .shapes{display:flex}
.shapes button{border:0;background:none;padding:5px 9px;font-size:var(--fs-sm);color:var(--ink-2);border-radius:6px}
.shapes button[aria-pressed="true"]{background:var(--paper);color:var(--ink);box-shadow:0 1px 2px rgba(var(--ink-rgb),.1)}
.shapes button kbd{display:none}
/* the two tools that act on marks rather than make them sit after a hairline, so the row reads as three shapes, then two edits */
.shapes .sep{align-self:stretch;width:1px;margin:3px 2px;background:var(--ink-12)}
/* Clear is not a fourth verb: it is the counterweight to Mark, so it stays quiet and only exists
   while there is something to undo. */
.clearbtn{border:0;background:none;padding:6px 8px;font-size:var(--fs-sm);color:var(--ink-3);text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.clearbtn:hover{color:var(--ink)}
/* Marks: on | off, beside Clear: your marks drawn on the frame and your comments' strokes on the timeline, shown or
   hidden (V); remembered per viewer (rp:marks), like the quick checks switch. Only there once there is something to hide. */
.marksbtn{border:0;background:none;padding:6px 8px;font-size:var(--fs-sm);color:var(--ink-3);white-space:nowrap;cursor:pointer}
.marksbtn[hidden]{display:none}
.marksbtn b{font-weight:500}
.marksbtn:hover,.marksbtn[aria-checked="false"]{color:var(--ink)}
.marksbtn[aria-checked="false"] b{font-weight:650}
/* The theme is one icon button, like mute. A button that just said "Dark" could mean what you are in
   or what you would get, so it never says a word: the icon is the theme you are IN (moon in dark, sun
   in light), aria-pressed is on in dark, and the tooltip names the other one. */
.transport .themebtn[aria-pressed="true"]{background:none;color:var(--ink-3)} /* the icon says which theme, not an ink fill */
.transport .themebtn[aria-pressed="true"]:hover{background:var(--ink-06);color:var(--ink)}
/* Speed: "1×" in the row; the drag opens above it, because the useful values are not a menu — 1.6x is a real answer. */
.speed{position:relative;display:flex;align-items:center}
.speed .x{min-width:3ch;font:var(--fs-xs)/1 var(--mono);color:var(--ink-3);letter-spacing:.02em;text-align:center}
.speed .x[data-off="1"]{color:var(--ink);font-weight:600}
.speed .spbtn:hover .x{color:var(--ink)}
.sppop{position:absolute;right:-4px;bottom:calc(100% + 8px);z-index:6;display:flex;align-items:center;gap:12px;padding:12px 14px 10px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 8px 24px -8px rgba(20,20,19,.2);white-space:nowrap}
.sppop[hidden]{display:none}
.sppop .lbl{font-size:var(--fs-xs);color:var(--ink-3)}
.speed input{width:148px;accent-color:var(--ink);cursor:ew-resize;display:block;margin:0}
/* Anchors on the drag. The range is 0.5-3, so a value v sits at (v-0.5)/2.5 along the track; the
   marks are drawn there and the 0.25 step lands on them. */
.speed .track{position:relative;padding-bottom:12px}
.speed .tick{position:absolute;top:100%;margin-top:-10px;width:1px;height:4px;background:var(--ink-20);transform:translateX(-0.5px);font-style:normal}
.speed .tick[data-major]{height:6px;background:rgba(var(--ink-rgb),.4)}
.speed .tick span{position:absolute;left:50%;top:6px;transform:translateX(-50%);font:var(--fs-xs)/1 var(--mono);font-style:normal;color:var(--ink-3);white-space:nowrap}
/* the clipboard fallback: only ever in the DOM after the API refuses */
.copyout{margin-top:12px;padding:10px;border:1px solid var(--ink-12);border-radius:8px;background:var(--tile)}
.copyout p{margin:0 0 8px;font-size:var(--fs-xs);color:var(--ink-2)}
.copyout textarea{width:100%;box-sizing:border-box;font:var(--fs-xs)/1.5 var(--mono);color:var(--ink);background:var(--paper);border:1px solid var(--ink-12);border-radius:6px;padding:8px;resize:vertical}
.copyout button{margin-top:8px}
/* The handoff: the finishing step, at the head of the record sheet. One calm column asks three things
   in order — which verdict, anything to tell Claude, send (or download); the manual path is one
   disclosure down, as one block of two lines. What the reviewer said stays listed under it (the
   owner: "often need to see the feedback"): a verdict is about those comments and answers, and they
   are read again, and edited, before sending. Its title folds it to one line (the verdict, and
   whether it is sent), and the Record bar opens it folded, so the feedback comes first. */
.handoff{width:100%;max-width:720px;margin:0 auto;padding:8px 0 24px;border-bottom:1px solid var(--ink-12)}
.handoff[hidden]{display:none}
.handoff .hhd{display:flex;align-items:baseline;gap:16px;margin:0 0 16px}
.handoff h5{flex:1;min-width:0;margin:0;font:400 var(--fs-h2)/1.2 var(--serif);color:var(--ink)}
.handoff .hfold{display:inline-flex;align-items:baseline;gap:10px;max-width:100%;padding:0;border:0;border-radius:0;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer}
.handoff .hfold::after{content:"";flex:none;align-self:center;width:6px;height:6px;margin:0 2px;border-right:1.5px solid var(--ink-3);border-bottom:1.5px solid var(--ink-3);transform:translateY(-2px) rotate(45deg)}
.handoff .hsum{display:none;flex:1;min-width:0;font:var(--fs-sm)/1.4 var(--sans);color:var(--ink-2)}
.handoff.folded{padding:4px 0 12px}
.handoff.folded .hhd{margin:0}
.handoff.folded h5{flex:0 1 auto;font-size:var(--fs-lead)}
.handoff.folded .hfold::after{transform:rotate(-45deg)}
.handoff.folded .hsum{display:inline}
.handoff.folded .hbody{display:none}
.handoff .hhd .lnk{white-space:nowrap}
.handoff .hhd .lnk:hover{color:var(--ink)}
/* The verdict is the first thing Finish asks: a review with comments is not an approval. Two
   options, so two tiles — tiles are for what can be picked — with the pick marked the way an
   answered option is, in ink, and a radio dot so the state does not rest on a border alone. */
.handoff .verdict{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 12px}
.handoff .verdict button{position:relative;display:flex;flex-direction:column;justify-content:flex-start;text-align:left;padding:12px 16px 12px 40px;border:1px solid var(--ink-12);border-radius:8px;background:none;color:var(--ink)}
.handoff .verdict button:hover{border-color:var(--ink-3)}
.handoff .verdict button::before{content:"";position:absolute;left:15px;top:15px;width:14px;height:14px;border-radius:50%;border:1px solid var(--ink-3)}
.handoff .verdict button[aria-pressed="true"]{background:none;color:var(--ink);border-color:var(--ink)}
.handoff .verdict button[aria-pressed="true"]::before{border:4px solid var(--ink)}
.handoff .verdict b{display:block;font-weight:500;font-size:var(--fs-ui)}
.handoff .verdict.three{grid-template-columns:1fr 1fr 1fr}
.handoff .verdict span{display:block;margin-top:4px;font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2)}
.handoff .open{margin:0 0 4px;font-size:var(--fs-sm);color:var(--accent-text)}
/* a walkthrough ends on one open question, with room for the reviewer's words */
.handoff .openq{margin:0 0 16px}
.handoff .openq label{display:block;margin:0 0 6px;font:400 var(--fs-lead)/1.3 var(--serif);color:var(--ink)}
.handoff .openq textarea{box-sizing:border-box;width:100%;min-height:56px;padding:8px 12px;font:var(--fs-ui)/1.45 var(--sans);color:var(--ink);background:var(--paper);border:1px solid var(--ink-20);border-radius:6px;resize:vertical}
.handoff .openq textarea:focus{outline:0;border-color:var(--ink)}
.handoff .openq .fine{margin:4px 0 0;font-size:var(--fs-sm);color:var(--ink-3)}
/* an explainer's Finish: what Explain more or Plan this would mean for this video, drawn from it
   and from what you did while watching; one pick fills the box below, to edit or replace */
.handoff .nexts{margin:0 0 12px}
.handoff .nexts .hint{margin:0 0 6px;font-size:var(--fs-sm);color:var(--ink-2)}
.handoff .nexts ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.handoff .nexts li{display:block;counter-increment:none;font:inherit}
.handoff .nexts li::before{content:none}
.handoff .nexts li+li{margin-top:0}
.handoff .nexts button{display:block;width:100%;text-align:left;padding:8px 12px;border:1px solid var(--ink-12);border-radius:6px;background:none;color:var(--ink);font:var(--fs-ui)/1.4 var(--sans)}
.handoff .nexts button:hover{border-color:var(--ink-3)}
.handoff .nexts button[aria-pressed="true"]{border-color:var(--ink);box-shadow:inset 3px 0 0 var(--ink)}
.handoff .nexts button span{display:block;margin-top:2px;font-size:var(--fs-sm);color:var(--ink-3)}
.handoff .lede{margin:0 0 16px;max-width:62ch;font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2)}
.handoff code{font:var(--fs-xs)/1.45 var(--mono);color:var(--ink);white-space:nowrap}
/* the one primary act: Send where the page can reach Claude, Download where it cannot */
.handoff .send .row{display:flex;gap:8px}
.handoff .send input{flex:1;min-width:0;padding:8px 12px;font:inherit;font-size:var(--fs-sm);color:var(--ink);background:var(--paper);border:1px solid var(--ink-20);border-radius:6px}
.handoff .send input:focus{outline:0;border-color:var(--ink)}
.handoff .send .fine{margin:8px 0 0;font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2)}
.handoff .sendbtn{height:36px;padding:0 16px;background:var(--ink);border-color:var(--ink);color:var(--paper);font-weight:500;white-space:nowrap}
.handoff .sendbtn[disabled]{opacity:.55;cursor:default}
.handoff .send.done{padding:12px 16px;border:1px solid var(--ink-12);border-radius:8px}
.handoff .sent{margin:0;font-size:var(--fs-ui);line-height:1.5;color:var(--ink)}
.handoff .sent.state{margin-top:4px;color:var(--ink-2)}
.handoff .sent.id{display:block;margin-top:4px;font:var(--fs-xs)/1.4 var(--mono);color:var(--ink-3);word-break:break-all}
/* the manual path: one disclosure, one line of why, the two commands as one block */
.handoff .diy{margin-top:16px;border-top:1px solid var(--ink-12);padding-top:12px}
.handoff .diy summary{width:max-content;max-width:100%;cursor:pointer;font-size:var(--fs-sm);color:var(--ink-2)}
.handoff .diy summary:hover{color:var(--ink)}
.handoff .diy .why{margin:8px 0;max-width:62ch;font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2)}
.handoff .warn{margin:8px 0;padding:8px 12px;font-size:var(--fs-ui);line-height:1.5;color:var(--ink);border-left:2px solid var(--accent)}
/* break-all only on the commands: a plan path is long and has to wrap somewhere */
.handoff ol{list-style:none;margin:0;padding:12px 16px;counter-reset:cmd;background:var(--ground);border-radius:8px}
.handoff li{counter-increment:cmd;display:grid;grid-template-columns:16px minmax(0,1fr);gap:8px;font:var(--fs-xs)/1.6 var(--mono)}
.handoff li+li{margin-top:4px}
.handoff li::before{content:counter(cmd);color:var(--ink-3)}
.handoff li code{padding:0;border:0;background:none;font:inherit;color:var(--ink);white-space:pre-wrap;word-break:break-all;user-select:all}
.handoff .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
/* a quick video's one line under its Download: tell the agent where the file is */
.handoff .tell{margin:12px 0 0;max-width:62ch;font-size:var(--fs-ui);line-height:1.5;color:var(--ink)}
@media (max-width:600px){.handoff .verdict,.handoff .verdict.three{grid-template-columns:1fr}.handoff .send .row{flex-direction:column}.handoff h5{font-size:var(--fs-h3)}}

/* what changed since the last build: a count, and one button to watch only those beats */
.changed .chsum{margin:0 0 8px;font-size:var(--fs-sm);color:var(--ink-2)}
.changed .onlybtn{margin:0 0 0 -10px}
.gallery button[data-changed]{position:relative}
.gallery button[data-changed]::after{content:attr(data-changed);margin-left:8px;font:var(--fs-xs)/1 var(--mono);letter-spacing:.04em;color:var(--accent-text);text-transform:uppercase}
/* the reviewer's own answer: offered under the options, opening only when taken up, so it reads as
   a way out of the list rather than as another item in it */
.own{margin-top:12px}
.ownbtn{border:0;background:none;padding:0;font-size:var(--fs-sm);color:var(--ink-2);cursor:pointer}
.ownbtn kbd{display:inline-grid;place-items:center;min-width:18px;height:18px;margin-left:8px;padding:0 4px;border:1px solid var(--ink-20);border-radius:4px;font:500 var(--fs-xs)/1 var(--mono);color:var(--ink-3)}
.ownbtn:hover{color:var(--ink)}
.own.open .ownbtn{display:none}
/* "Explain this more": the way out for a question the reviewer cannot answer yet. It sits beside the
   own-words link, as quiet as it, and is never an answer: it is recorded as option "unclear". */
.unclearbtn[hidden]{display:none}
.ownbox{display:none;gap:8px;align-items:flex-start}
.own.open .ownbox{display:flex}
.ownbox textarea{flex:1;min-width:0;font:inherit;padding:8px;border-radius:6px;border:1px solid var(--ink-20);background:var(--paper);color:var(--ink);resize:none}
.ownbox textarea:focus{outline:0;border-color:var(--ink)}
/* Own words wrap (the owner: "it should probably wrap lines and keep same text box just be able to scroll it"):
   the note, "Expected something else?", your own answer, a call's own words, the comment line and the record's
   editor are text boxes that wrap, grow with the words to a few lines (fitField) and then scroll inside the same box,
   so long words never run off to the side or push the controls around. Enter saves; Shift+Enter is a new line. */
:is(.note,.disagree,.ownbox,.composer,.redit) textarea{box-sizing:border-box;resize:none;overflow-x:hidden;overflow-y:hidden;overflow-wrap:anywhere;white-space:pre-wrap;line-height:1.35;scrollbar-width:thin}
/* on the agent's call, what own words DO: they are not an acceptance but a change to make */
.ownhint{display:none;margin:6px 0 0;font-size:var(--fs-sm);color:var(--ink-2)}
.own.open .ownhint:not([hidden]){display:block}
/* comments: a timestamp and what you wanted to say at it — the shape every video site already taught
   people. The field is an underline; Post is there only once there is something in it. */
.composer{display:flex;gap:8px;align-items:center;flex:1 1 260px;min-width:0}
.composer textarea{flex:1;min-width:0;min-height:36px;font:inherit;padding:8px 0 7px;border:0;border-bottom:1px solid var(--ink-20);border-radius:0;background:none;color:var(--ink);resize:none;overflow:hidden}
.composer textarea::placeholder{color:var(--ink-3)}
.composer textarea:hover{border-color:var(--ink-3)}
.composer textarea:focus{outline:0;border-color:var(--ink)}
.composer textarea:placeholder-shown+button{display:none}
.composer button{height:32px;padding:0 10px;border:0;background:none;font-size:var(--fs-ui);font-weight:500;white-space:nowrap}
.composer button:hover{background:var(--ink-06)}
.composer .at{font:var(--fs-xs)/1 var(--mono);color:var(--ink-3);margin-right:4px}
/* While marking, the tool row is wider (Select and Erase joined it). Where Mark, its tools, a
   composer wide enough for "Comment at this moment…" on one line, and Finish do not all fit on one
   row (syncToolbar measures it), Mark and its tools take the first row and the composer and Finish
   share the second — rather than the placeholder squeezed onto a line it cannot show, or Finish
   left alone on a row of its own. */
.toolbar.toolsrow .group.mark{flex-basis:100%}
.ann .ts{font:var(--fs-xs)/1 var(--mono);color:var(--ink-2);border:0;background:none;padding:0;cursor:pointer}
.ann .ts:hover{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.marks h4{display:flex;align-items:center;gap:8px}
.marks h4 .exp{margin-left:auto;font:500 var(--fs-xs)/1 var(--sans);color:var(--ink-3);border:0;background:none;padding:4px 0;cursor:pointer}
.marks h4 .exp+.exp{margin-left:12px}
.marks h4 .exp:hover{color:var(--ink)}
button{font:inherit;line-height:1.2;border:1px solid var(--ink-20);background:var(--paper);color:var(--ink);border-radius:6px;padding:8px 12px;cursor:pointer}
button kbd,kbd.cap{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 4px;border:1px solid var(--ink-20);border-bottom-width:2px;border-radius:4px;font:500 var(--fs-xs)/1 var(--mono);color:var(--ink-2);margin-left:8px;vertical-align:1px}
button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
button[aria-pressed="true"] kbd{color:rgba(250,249,245,.7)}
button.finishbtn{height:36px;padding:0 16px;background:var(--ink);border-color:var(--ink);color:var(--paper);font-weight:500;white-space:nowrap}
button.finishbtn:hover{opacity:.88}
button.lnk{border:0;background:none;padding:0;border-radius:0;font-size:var(--fs-sm);color:var(--ink-3);text-decoration:underline;text-underline-offset:2px}
/* The record is a sheet at EVERY width, not just on a phone. Inline below the video it was what
   pushed a 1440x900 window 373px past its own height; as a sheet it rests as one 40 px bar at the
   foot of the window that says what it holds, so the page fits the window and the video takes the
   rest. Pulled, it covers the frame — which is the reviewer asking for it (D-003). */
.side{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:9;margin:0;display:flex;flex-direction:column;gap:16px;min-height:var(--peek);max-height:86vh;max-height:86dvh;overflow:hidden;padding:0 24px 32px;background:var(--paper);border-top:1px solid var(--ink-12);transform:translateY(calc(100% - var(--peek)));transition:transform .22s ease,box-shadow .22s}
.side>*{flex:0 0 auto}
/* The glow-up. Pulled up, the record is a rail and a page: on the left the video's own index (Steps,
   with the timeline's key, the level and the pause toggle as quiet footer lines, and the plan's text
   for the step the video is on, folded away until asked for); on the right what the reviewer said
   (decisions, the agent's calls, comments). The plan's steps are not listed a second time: the rail
   is the list, and the plan text follows whichever step is lit. From 1200 px the reviewer's side is
   two columns, so a long list of calls and a long list of comments sit side by side, not stacked. */
.side .cols{display:grid;grid-template-columns:minmax(0,1fr);gap:32px 48px;align-items:start;width:100%;max-width:1120px;margin:0 auto;min-width:0}
.side .col{display:flex;flex-direction:column;gap:32px;min-width:0}
@media (max-width:719px){.side .col-plan{order:3}}   /* one column: what the reviewer said first, the video's index after it */
@media (min-width:720px){
  .side .cols{grid-template-columns:minmax(220px,4fr) minmax(0,8fr);grid-template-rows:auto 1fr}
  .side .col-plan{grid-column:1;grid-row:1/3}
  .side .col-calls{grid-column:2;grid-row:1}
  .side .col-words{grid-column:2;grid-row:2}
}
@media (min-width:1200px){
  .side .cols{grid-template-columns:minmax(240px,300px) minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto}
  .side .col-plan{grid-row:1}
  .side .col-calls{grid-column:2;grid-row:1}
  .side .col-words{grid-column:3;grid-row:1}
  .side .col-calls:not(:has(section:not([hidden]))){display:none}
  .side .cols:has(.col-calls:not(:has(section:not([hidden])))) .col-words{grid-column:2/4}
}
.wrap.pulled .side{transform:none;overflow:auto;box-shadow:var(--lift)}
/* the handle: at rest one centred line of what the record holds; pulled, the same line on the left
   of the content's width and "Hide" on the right, so the sheet reads as a page with a header */
.grab{display:flex;align-items:center;justify-content:center;gap:10px;position:sticky;top:0;z-index:1;width:calc(100% + 48px);min-height:40px;margin:0 -24px;padding:0 24px;border:0;border-radius:0;background:var(--paper);color:var(--ink-3);font-size:var(--fs-sm);cursor:pointer}
.grab span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 40px)}
.grab span b{font-weight:500;color:var(--ink-2)}
.grab .gh{display:none;font-style:normal}
.grab:hover{color:var(--ink)}
.grab::after{content:"";flex:none;width:6px;height:6px;margin-top:3px;border-left:1.5px solid currentColor;border-top:1.5px solid currentColor;transform:rotate(45deg)}
.wrap.pulled .grab{justify-content:flex-start;min-height:52px;padding:0 calc(24px + max(0px,(100% - 1120px) / 2));border-bottom:1px solid var(--ink-12)}
.wrap.pulled .grab span{flex:1 1 auto;text-align:left;font-size:var(--fs-sm)}
.wrap.pulled .grab span b{font-size:var(--fs-ui);font-weight:600;color:var(--ink);margin-right:4px}
.wrap.pulled .grab .gh{display:inline;flex:none;font-size:var(--fs-sm);font-weight:500;color:var(--ink-2)}
.wrap.pulled .grab:hover .gh{color:var(--ink)}
.wrap.pulled .grab::after{margin:-3px 0 0 -4px;transform:rotate(225deg)}
.side section{min-width:0}
.side section[hidden]{display:none}
/* one heading voice for the record: 15 px, the count beside it quiet */
h4{margin:0 0 12px;font:600 var(--fs-ui)/1.3 var(--sans);color:var(--ink)}
h4 .count{font-weight:400;color:var(--ink-3)}
.empty{font-size:var(--fs-sm);line-height:1.5;color:var(--ink-3);margin:0}
.k{font:var(--fs-xs)/1.4 var(--mono);color:var(--ink-3)}
/* Steps: the video's index. A step is a 15 px row with its number in a quiet column; the beats of
   the step you are in sit under its title, aligned with it, in 13 px; the row you are on is ruled in ink. */
.gallery{display:flex;flex-direction:column;margin:0 0 0 -12px}
.gallery button{display:flex;gap:10px;align-items:baseline;text-align:left;border:0;border-radius:0 6px 6px 0;background:none;padding:4px 12px;box-shadow:inset 2px 0 0 transparent;color:var(--ink);line-height:1.35}
.gallery button[hidden]{display:none}
.gallery button.step{font-size:var(--fs-ui);font-weight:500;padding:7px 12px}
.gallery button .n{flex:none;width:14px;font:var(--fs-xs)/1 var(--mono);color:var(--ink-3)}
.gallery button.beat{font-size:var(--fs-sm);color:var(--ink-2);padding:4px 12px 4px 36px}
.gallery>button.beat:not([data-group]){padding-left:12px;color:var(--ink-3)}   /* the opening and closing beats: not a step's, so not indented under one */
.gallery button.active{color:var(--ink);box-shadow:inset 2px 0 0 var(--ink);background:var(--ink-06)}
.gallery button.active .n{color:var(--ink)}
.gallery button:hover{background:var(--ink-06)}
/* the rail's footer: the timeline's key, the level, the pause toggle — quiet lines, one per thing */
.steps .rfoot{display:flex;flex-direction:column;gap:10px;margin:16px 0 0;padding-top:12px;border-top:1px solid var(--ink-12)}
.steps .rfoot:not(:has(>:not([hidden]))){display:none}
.steps .rfoot .legend{margin:0}
.steps .rfoot .pauseparts{margin:0}
/* what the reviewer said: one entry per answer — a quiet kicker with its time, the question in the
   serif, the answer in 15 px, and copy / change as quiet words that show where the pointer is */
.dec,.ann{padding:12px 0;border-top:1px solid var(--ink-12);font-size:var(--fs-sm)}
.decisions>.dec:first-child,.autolog>.dec:first-child,.list>.ann:first-child{border-top:0;padding-top:0}
.dec>.k{display:block;font:var(--fs-xs)/1.4 var(--sans);color:var(--ink-2)}
.dec>.k .tm,.ann .ts{font-family:var(--mono)}
.dec>.k button.tm{border:0;border-radius:0;background:none;padding:0;font:inherit;font-family:var(--mono);line-height:inherit;color:inherit;cursor:pointer}
.dec>.k button.tm:hover{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.dec .q{margin:4px 0 6px;font:var(--fs-body)/1.4 var(--serif);color:var(--ink)}
.dec .a{display:flex;gap:4px 12px;align-items:baseline;flex-wrap:wrap;font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2)}
.dec b,.ann b{font-weight:500;color:var(--ink)}
.dec .a .lnk,.ann .hd .lnk{font-size:var(--fs-xs);color:var(--ink-3);text-decoration:none}
.dec .a .lnk:hover,.ann .hd .lnk:hover{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.dec .a .lnk:first-of-type{margin-left:auto}
.dec[data-verdict="flag"] .a b{color:var(--accent-text)}
.dec textarea.dnote{display:block;width:100%;margin-top:4px;padding:4px 0;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;font:inherit;font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2);resize:none;overflow:hidden}
.dec textarea.dnote::placeholder{color:var(--ink-3)}
.dec textarea.dnote:hover{border-color:var(--ink-12)}
.dec textarea.dnote:focus{outline:0;border-color:var(--ink);color:var(--ink)}
.decisions>.empty,.autolog>.empty{margin-top:4px}
.decisions>.dec+.empty,.autolog>.dec+.empty{padding-top:12px;border-top:1px solid var(--ink-12)}
.ann .hd{display:flex;align-items:baseline;gap:8px}
.ann .hd .lnk{margin-left:auto}
.ann .hd .cp+.lnk{margin-left:0}
.ann .hd .k{font:var(--fs-xs)/1.4 var(--sans);color:var(--ink-3)}
.ann .hd .t{flex:1;min-width:0;margin:0;font-size:var(--fs-xs);line-height:1.4;color:var(--ink-3)}
.ann .hd .t .lnk{margin:0;font-size:var(--fs-xs);color:var(--ink-2)}
.ann textarea,.level select{font:inherit;font-size:var(--fs-sm);color:var(--ink);background:none}
.ann textarea{display:block;width:100%;border:0;border-bottom:1px solid transparent;border-radius:0;padding:4px 0;margin-top:4px;resize:none;overflow:hidden;font-size:var(--fs-ui);line-height:1.5}
.ann textarea:hover{border-color:var(--ink-12)}
.ann textarea:focus{outline:0;border-color:var(--ink)}
/* a note highlighted in the guide: the words it is on, under where they are (yours, so the coral rule) */
.ann .gq{margin:4px 0 0;padding-left:8px;border-left:2px solid var(--accent);font-size:var(--fs-sm);line-height:1.45;color:var(--ink-2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
/* Your last review: what the round you sent asked for, read-only, after the video was rebuilt (newRoundIfRebuilt
   archived it), so you can check each request was handled. Each line goes to where it now lands, when that is still there. */
.lastrev .lrsum{margin:0 0 12px;font-size:var(--fs-sm);line-height:1.5;color:var(--ink-3)}
.lrlist>.ann:first-child{border-top:0;padding-top:0}
.lastrev .ann .ts:disabled{cursor:default;text-decoration:none;color:var(--ink-3)}
.lastrev .lw i{font-style:normal;color:var(--ink-3)}
.lastrev .lw{margin:4px 0 0;font-size:var(--fs-ui);line-height:1.5;color:var(--ink);white-space:pre-wrap;overflow-wrap:anywhere}
.lastrev .lw b{font-weight:500}
/* how well the reviewer knows the system decides which beats play; it sits at the foot of Steps, with the pause toggle */
.level{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin:0;font-size:var(--fs-sm);color:var(--ink-3)}
.level[hidden]{display:none}
.level select{padding:4px 8px;border:1px solid var(--ink-20);border-radius:6px}
.level .lvl-len{font:var(--fs-xs) var(--mono);color:var(--ink-3)}
/* the plan's own text, in the record: one quiet disclosure at the foot of the rail, folded by default,
   which opens onto the part of the plan the video is on — not the plan again, step by step */
.ptoggle{display:none}
.col-plan>.plantext{margin-top:-8px}
.col-plan>.plantext>.ptoggle{display:flex;align-items:center;gap:8px;width:100%;min-height:36px;margin:0;padding:0;border:0;border-top:1px solid var(--ink-12);border-radius:0;background:none;font-size:var(--fs-sm);font-weight:500;color:var(--ink-2);text-align:left}
.col-plan>.plantext>.ptoggle:hover{color:var(--ink)}
.col-plan>.plantext>.ptoggle::after{content:"";flex:none;width:5px;height:5px;margin:-3px 0 0 auto;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg)}
.col-plan>.plantext[data-open]>.ptoggle::after{margin-top:3px;transform:rotate(225deg)}
.col-plan>.plantext:not([data-open])>.pscroll{display:none}
.col-plan>.plantext .ptitle{display:none}
.col-plan>.plantext:not([data-lit=""]) .pstep:not([aria-current="true"]){display:none}
.col-plan>.plantext .pstep[aria-current="true"]{margin:4px 0 0 -12px;padding-bottom:4px}
/* overlays: decision, quick check, autonomy and chapter end share one sheet docked to the stage's bottom edge. No veil:
   the map stays lit above it; the sheet covers the video's own cards and caption, which sit in the lower third */
.sheet{position:absolute;left:0;right:0;bottom:0;display:none;min-height:35%;max-height:100%;overflow:auto;background:var(--paper);box-shadow:var(--lift);padding:16px 24px;text-align:left}
.sheet.on{display:block}
.sheet .k{display:block;margin-bottom:8px}
/* D-001: the sheet keeps the frame's full size, and folds out of the way when the frame it asks
   about is behind it. Folded it is a paper pill with a coral dot that still says which question is waiting — the
   options are out of the DOM flow, so nothing can be answered by touch while it is shut. */
.sheet .hd{display:flex;align-items:baseline;gap:12px}
.sheet .hd .k{flex:1;margin-bottom:6px;font:500 var(--fs-sm)/1.4 var(--sans);color:var(--ink-3)}
.fold,.ownbtn,.reopen,.ann .hd [data-del]{display:inline-flex;align-items:center;min-height:32px}
@media (hover:none){.fold,.ownbtn,.reopen,.ann .hd [data-del],.sheet.folded .reopen{min-height:44px}}
.fold{flex:none;border:0;background:none;padding:0;font:var(--fs-sm)/1.4 var(--sans);color:var(--ink-3);cursor:pointer}
.fold:hover{color:var(--ink)}
.reopen{display:none}
/* folded, the question waits in the top-right corner: captions own the bottom of the frame, and a long one reaches the right edge */
.sheet.folded{left:auto;right:12px;top:12px;bottom:auto;min-height:0;width:auto;max-width:calc(100% - 32px);border-radius:8px;padding:6px 12px;box-shadow:0 0 0 1px var(--ink-12),0 2px 10px rgba(var(--ink-rgb),.12)}
.sheet.folded .q,.sheet.folded .reason,.sheet.folded .gobtn,.sheet.folded .opts,.sheet.folded .more,.sheet.folded .own,.sheet.folded .feedback,.sheet.folded .disagree,.sheet.folded .foot,.sheet.folded .fold{display:none}
.sheet.folded .hd{align-items:center;gap:10px}
.sheet.folded .hd::before{content:"";flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}
.sheet.folded .hd .k{flex:0 1 auto;min-width:0;margin:0;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sheet.folded .reopen{display:inline-flex;align-items:center;flex:none;border:0;background:none;padding:0 0 0 10px;border-left:1px solid var(--ink-12);font:500 var(--fs-sm)/1.4 var(--sans);color:var(--accent-text);cursor:pointer;white-space:nowrap}
.sheet.folded .reopen:hover{color:var(--ink)}
/* The statement leads: the question, or what the agent chose, in the serif at 22, kept to a reading measure */
.sheet .q{font:400 var(--fs-h3)/1.3 var(--serif);margin:0 0 12px;max-width:68ch;text-wrap:pretty}
/* on an agent's call, the road not taken, why, and where to check it: a short list under the statement,
   a small label to the left of each, the alternative and the reason in 15 px, the file to check in quiet mono */
.reason .facts{display:grid;grid-template-columns:max-content minmax(0,1fr);align-items:baseline;gap:4px 16px;margin:0;max-width:92ch}
.reason .facts dt{font:500 var(--fs-xs)/1.4 var(--sans);color:var(--ink-3)}
.reason .facts dd{margin:0;font-size:var(--fs-ui);line-height:1.45;color:var(--ink-2)}
.reason .facts code{font:var(--fs-xs)/1.5 var(--mono);color:var(--ink-3);overflow-wrap:anywhere}
/* on an agent's call, why it chose what it did: under the question, not inside the buttons */
.sheet .reason{margin:0 0 14px;font-size:var(--fs-sm);line-height:1.5;color:var(--ink-2)}
.sheet .reason[hidden]{display:none}
.sheet .reason b{font-weight:500;color:var(--ink)}
/* The options are rows, not tiles: a hairline above each, the key that picks it in a small square,
   the label, and the reason in a quieter line under it. Two, three or four options are laid out by how many there are rather than by how many columns happen to fit: three
   sit side by side; four sit 2 x 2 until the frame is wide enough to give each of four a readable
   line (the stage's data-size, measured in measurePeek), and the text is never made smaller to fit. */
.opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));column-gap:24px}
.opts[data-n="3"]{grid-template-columns:repeat(3,minmax(0,1fr))}
.opts[data-n="4"]{grid-template-columns:repeat(2,minmax(0,1fr))}
.stage[data-size="wide"] .opts[data-n="4"]{grid-template-columns:repeat(4,minmax(0,1fr))}
.stage[data-size="narrow"] .opts[data-n="3"],.stage[data-size="narrow"] .opts[data-n="4"]{grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))}
.opt{position:relative;display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:12px;align-items:start;align-content:start;text-align:left;padding:10px 8px 10px 0;border:0;border-top:1px solid var(--ink-12);border-radius:0;background:none;cursor:pointer;color:var(--ink)}
.opt>b,.opt>span{grid-column:2}
.opt:hover:not(:disabled) .key{border-color:var(--ink);color:var(--ink)}
.opts:not([data-kind="call"]) .opt:hover:not(:disabled){background:linear-gradient(90deg,var(--ink-06),transparent 85%)}
.opt:hover:not(:disabled) b{text-decoration:underline;text-decoration-color:var(--ink-20);text-underline-offset:3px}
/* each option carries the key that picks it: A-D while a question is waiting */
.opts .opt .key{grid-column:1;grid-row:1/span 2;display:inline-grid;place-items:center;width:22px;height:22px;margin:0;border:1px solid var(--ink-20);border-radius:4px;font:500 var(--fs-xs)/1 var(--mono);color:var(--ink-3)}
/* pick all that apply: the key is the checkbox, filled in ink once picked, and the row says "picked" in words */
.opts[data-kind="multi"] .opt .key{border-color:var(--ink-3)}
.opts[data-kind="multi"] .opt[aria-pressed="true"]{background:none;color:var(--ink)}
.opts[data-kind="multi"] .opt[aria-pressed="true"] .key{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.foot .confirm{white-space:nowrap}
.foot .confirm[hidden]{display:none}
.foot .confirm:disabled{opacity:.55;cursor:default}
.opt:disabled{cursor:default}
.opt[data-chosen="true"] .key{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.opt[data-chosen="true"]:not([data-rec="true"]){opacity:.8}
.opt[data-rec="true"] .key{border-color:var(--ink);color:var(--ink)}
/* "recommended", "picked", "your answer", "the answer": one word after the label, in ink (words, not a colour, say it) */
.opt .tag{margin-left:8px;font-size:var(--fs-xs);font-weight:500;font-style:normal;color:var(--ink-2);white-space:nowrap}
.opt .tag:empty{display:none}
.opt b{display:block;font-size:var(--fs-ui);font-weight:500;line-height:1.35;margin:1px 0 2px}
.opt span{display:block;font-size:var(--fs-sm);line-height:1.45;color:var(--ink-3)}
.opts[data-kind="quiz"] .opt{grid-template-columns:22px minmax(0,1fr);align-items:center}
.opts[data-kind="quiz"] .opt b{grid-column:1;grid-row:1/span 2;display:inline-grid;place-items:center;width:22px;height:22px;margin:0;border:1px solid var(--ink-20);border-radius:4px;font:500 var(--fs-xs)/1 var(--mono);color:var(--ink-3)}
.opts[data-kind="quiz"] .opt span{grid-column:2;font-size:var(--fs-ui);color:var(--ink)}
.opts[data-kind="quiz"] .opt .tag{grid-column:2;margin:2px 0 0}
.opts[data-kind="quiz"] .opt[data-chosen="true"] b{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.opts[data-kind="quiz"] .opt[data-rec="true"] b{border-color:var(--right);border-width:2px;color:var(--right)}
.opts[data-kind="quiz"] .opt[data-rec="true"] .tag:not(:empty)::before{content:"\\2713\\00a0"}
.opts[data-kind="quiz"] .opt[data-chosen="true"]:not([data-rec="true"]) .tag:not(:empty)::before{content:"\\2715\\00a0"}
/* an agent's call: two plain buttons, Accept in ink and Flag in outline, each with its key */
.opts[data-kind="call"]{display:flex;flex-wrap:wrap;gap:8px}
.opts[data-kind="call"] .opt{display:inline-flex;align-items:center;gap:10px;height:40px;padding:0 16px 0 10px;border:1px solid var(--ink-20);border-radius:6px}
.decision.on:has(.opts[data-kind="call"]){display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:24px;align-items:center}
.decision:has(.opts[data-kind="call"])>*{grid-column:1/-1}
.decision:has(.opts[data-kind="call"])>.opts{grid-column:1}
.decision:has(.opts[data-kind="call"])>.more:not(:has(.own.open)){grid-column:2;margin-top:0}
.opts[data-kind="call"] .opt .key{width:20px;height:20px;border:0;background:var(--ink-06)}
.opts[data-kind="call"] .opt b{margin:0;font-size:var(--fs-ui)}
.opts[data-kind="call"] .opt:hover b{text-decoration:none}
.opts[data-kind="call"] .opt:hover{border-color:var(--ink)}
.opts[data-kind="call"] .opt:is([data-verdict="accept"],[data-gaccept]){background:var(--ink);border-color:var(--ink);color:var(--paper)}
.opts[data-kind="call"] .opt:is([data-verdict="accept"],[data-gaccept]) .key{background:rgba(250,249,245,.16);color:inherit}
:host([theme="dark"]) .opts[data-kind="call"] .opt:is([data-verdict="accept"],[data-gaccept]) .key{background:rgba(20,20,19,.12)}
/* grouped calls: Accept all, then one Flag per call, named by its id as the frame names it (the strip) */
.gflag{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border:1px solid var(--ink-20);border-radius:6px;background:none;font:500 var(--fs-sm)/1 var(--sans);color:var(--ink-2);cursor:pointer}
@media (hover:none){.gflag{min-height:44px}}
.gflag:hover{border-color:var(--ink);color:var(--ink)}
.gflag[aria-pressed="true"]{background:none;border-color:var(--accent);color:var(--accent-text)}
/* the list: its rows are a stop's, each with only its Flag, and Go on under them in ink */
.opts[data-kind="stop"]>.opt[data-gaccept]{justify-self:end;display:inline-flex;align-items:center;gap:8px;margin-top:8px;padding:0 14px;min-height:36px;border:1px solid var(--ink);border-radius:6px;background:var(--ink);color:var(--paper);font:500 var(--fs-sm)/1 var(--sans);cursor:pointer}
.opts[data-kind="stop"]>.opt[data-gaccept] .key{background:rgba(250,249,245,.16);color:inherit}
/* met again, the verdict given is ringed in coral (state); the other is still there to change it to */
.opts[data-kind="call"] .opt[data-chosen="true"]{box-shadow:0 0 0 2px var(--paper),0 0 0 4px var(--accent)}
.opts[data-kind="decision"] .opt[data-chosen="true"]{opacity:1}
/* under the options, one row: an answer of your own, and a note on whichever answer you give */
.more{display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px;margin-top:8px}
.more .own{margin-top:0;flex:0 1 auto}
.more .own.open{flex:1 1 100%}
.note{flex:1 1 260px;min-width:0}
.note[hidden]{display:none}
.note textarea{display:block;width:100%;font:inherit;font-size:var(--fs-sm);padding:6px 8px;border:0;border-bottom:1px solid var(--ink-20);border-radius:0;background:none;color:var(--ink)}
.note textarea::placeholder{color:var(--ink-3)}
.note textarea:focus{outline:0;border-color:var(--ink)}
/* the words on a mark: a small box beside the mark it names, on the paused frame */
.markbox{position:absolute;z-index:3;width:min(280px,calc(100% - 16px));padding:4px 4px 6px;background:var(--paper);border:1px solid var(--ink-20);border-radius:6px;box-shadow:0 1px 2px rgba(var(--ink-rgb),.1)}
.markbox[hidden]{display:none}
/* the words wrap and the field grows with them, so a selected mark's words are read whole, not scrolled to their end */
.markbox textarea{display:block;width:100%;font:inherit;font-size:var(--fs-sm);line-height:1.4;padding:6px 8px;border:0;background:none;color:var(--ink);resize:none;overflow:hidden;max-height:calc(6 * 1.4em + 12px)}
.markbox textarea:focus{outline:0}
.markbox .k{display:block;padding:0 8px;font:12px/1.5 var(--sans);color:var(--ink-3)}
.markbox .k kbd{display:inline-block;min-width:1.2em;padding:0 4px;border-radius:3px;box-shadow:inset 0 0 0 1px var(--ink-20);font:500 11px/1.45 var(--sans);text-align:center;color:var(--ink-2)}
.markbox .row{display:flex;align-items:center}
.markbox .row{align-items:flex-start}
.markbox .row textarea{flex:1;min-width:0}
.markbox .row .x{margin-top:3px}
.markbox .x{flex:none;width:24px;height:24px;margin-right:2px;border:0;border-radius:4px;background:none;color:var(--ink-3);font-size:var(--fs-body);line-height:1;cursor:pointer}
.markbox .x:hover,.markbox .x:focus-visible{background:rgba(var(--ink-rgb),.08);color:var(--ink)}
.markbox .x[hidden]{display:none}
.markbox .trash{display:inline-grid;place-items:center;padding:0}
.markbox .trash svg{width:14px;height:14px}
/* a mark chosen from the record: the row that is selected on the frame carries the same ink rule the lit step does */
.ann[data-selmark]{cursor:pointer}
.ann[data-selmark] .hd:hover .t{color:var(--ink)}
.ann[aria-current="true"]{margin-left:-12px;padding-left:10px;border-left:2px solid var(--ink)}
.ann[aria-current="true"] .hd .k{color:var(--ink)}
.feedback{display:none;margin-top:12px;max-width:72ch;font-size:var(--fs-ui);line-height:1.45;color:var(--ink-2)}
.feedback b{color:var(--ink);font-weight:500}
/* under a quick check's answer, one line to say the check itself is wrong: an underline, like the
   comment box, with its question beside it; in coral when the answer was marked wrong, which is when
   a reviewer most often knows better than the video */
.disagree{display:none;flex-wrap:wrap;align-items:baseline;gap:2px 12px;margin-top:12px;max-width:72ch}
.disagree.on{display:flex}
.disagree label{flex:none;font-size:var(--fs-sm);color:var(--ink-2)}
.disagree[data-wrong] label{font-weight:500;color:var(--accent-text)}
.disagree textarea{flex:1 1 240px;min-width:0;font:inherit;font-size:var(--fs-sm);padding:6px 0;border:0;border-bottom:1px solid var(--ink-20);border-radius:0;background:none;color:var(--ink)}
.disagree[data-wrong] textarea{border-bottom-color:var(--ink-3)}
.disagree textarea::placeholder{color:var(--ink-3)}
.disagree textarea:focus{outline:0;border-color:var(--ink)}
.disagree .kept{flex-basis:100%;margin:2px 0 0;font-size:var(--fs-xs);color:var(--ink-3)}
.disagree .kept:empty{display:none}
.foot{display:flex;gap:12px;align-items:center;margin-top:12px;font-size:var(--fs-sm);color:var(--ink-3)}
/* the sheet's one act once it has what it needs: Confirm your picks, Continue after a quick check */
.foot .confirm:not(:disabled),.foot .gobtn{height:36px;padding:0 14px;background:var(--ink);border-color:var(--ink);color:var(--paper);font-weight:500}
.foot .confirm:not(:disabled) kbd,.foot .gobtn kbd{color:inherit;opacity:.7}
.foot .gobtn[hidden]{display:none}
.foot .gobtn:hover,.foot .confirm:not(:disabled):hover{opacity:.88}
/* the keys are on the options, so the line that repeats them is for screen readers; it shows for a
   quick check counting down, or to say a note was kept */
.decision .foot .hint:not([data-live]){position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}
.decision .foot:not(:has(.confirm:not([hidden]),.gobtn:not([hidden]),.hint[data-live])){margin:0}
/* ---- Answer on the video (plan 2026-09-24) ------------------------------------------------------
   Step 1: while a question waits, the frame's own option cards are what the reviewer clicks. The frame
   is drawn, not built for clicks, so the player lays a transparent button over each card it can match
   (frameCards); hover and keyboard focus ring the card in coral, a pick is ringed in ink, and once a
   quick check is answered the right card is ringed in --right (ink) and its why says "✓ The answer", your wrong
   pick dashed with "✕" (more than colour: D-142 keeps coral for what is yours or waits on
   you). A mark tool that is on takes the frame. */
.hits{position:absolute;inset:0;z-index:1;pointer-events:none}
.hits[hidden],.stage:not([data-tool=""]) .hits{display:none}
.hit{position:absolute;display:block;margin:0;padding:0;border:0;border-radius:8px;background:transparent;pointer-events:auto;cursor:pointer;transition:box-shadow .12s,background-color .12s}
.hit:hover:not(:disabled){box-shadow:0 0 0 3px var(--accent);background:rgba(var(--accent-rgb),.07)}
.hit:focus{outline:none}
.hit:focus-visible{box-shadow:0 0 0 3px var(--accent),0 0 0 7px rgba(var(--accent-rgb),.28);background:rgba(var(--accent-rgb),.07)}
.hit[aria-pressed="true"],.hit[data-chosen="true"]{box-shadow:0 0 0 3px var(--ink);background:transparent}   /* a ring: the card under it stays readable */
.hit[data-right="true"]{box-shadow:0 0 0 4px var(--right)}
.hits[data-whys] .hit[data-chosen="true"]:not([data-right="true"]){box-shadow:none;outline:3px dashed var(--ink);outline-offset:0}
.hit:disabled{cursor:default}
.hit .tag{position:absolute;left:10px;top:0;transform:translateY(-50%);padding:2px 8px;border-radius:4px;background:var(--ink);color:var(--paper);font:500 var(--fs-xs)/1.4 var(--sans);font-style:normal;white-space:nowrap}
.hit .tag:empty,.stage[data-size="narrow"] .hit .tag{display:none}   /* on a small frame the tag would cover the card: the rings and the strip's words say it */
.hit[data-right="true"] .tag{background:var(--right);color:var(--paper)}
.hit[data-right="true"] .tag:not(:empty)::before{content:"\\2713\\00a0"}
@media (prefers-reduced-motion:reduce){.hit{transition:none}}
/* The answer bar. The question and its options are the frame's; what the frame cannot take sits in one band an eighth of the video high, at
   reading size: the kicker and the question in its own words, then own words, Explain this more, a note,
   Confirm, Show the frame, a quick check's "Back to where this was explained" and Continue, and a call's
   Accept and Flag (A, B). A video whose frames leave their lowest eighth empty for it (data-band="bottom"
   on a frame's root) has the band there, inside the frame, over that empty space, in the frame's paper and
   voices; a video built before that has it under the frame, in room kept for the whole video (.bandroom).
   Either way the video is one size before, during and after a question. The type scales with the video (cqw is the
   band's own width, which is the video's). */
.bandroom{display:none;position:relative}
.wrap.band-under{--band-k:.888889;--band-min:72px}   /* the stage's height leaves the band an eighth of it, never under 72 px */
.wrap.band-under .bandroom{display:block;width:100%;aspect-ratio:128/9;min-height:72px;background:var(--paper);box-shadow:0 0 0 1px rgba(var(--ink-rgb),.08);container-type:inline-size}
/* The band reads in full (the owner's feedback): nothing in it is cut off, clamped or scrolled. It keeps the
   reserved eighth while its words fit a line; longer, it grows up over the frame as they need (the video keeps
   its size), to a cap of 40% of the frame (22.5cqw of the room under it: the frame is 16:9 of that width), past
   which the long words go to the side panel (fitBand, .long). */
:is(.stage,.bandroom)>.decision.sheet.band{container-type:inline-size;position:absolute;left:0;right:0;top:auto;bottom:0;z-index:4;display:none;flex-flow:row wrap;align-content:center;align-items:center;gap:4px 12px;width:auto;max-width:none;min-height:0;max-height:none;margin:0;padding:4px 2.5%;border-radius:0;background:var(--paper);box-shadow:none;overflow:hidden;text-align:left}
.bandroom>.decision.sheet.band{top:auto;min-height:100%;max-height:max(22.5cqw,100%)}
.bandroom>.decision.sheet.band.tall{box-shadow:0 -1px 0 var(--ink-12)}   /* grown up over the frame: a hairline where it meets it */
.stage>.decision.sheet.band{height:auto;min-height:max(12.5%,72px);max-height:40%;box-shadow:inset 0 1px 0 var(--ink-12)}   /* in the frame: its paper, and one hairline rule over its empty lowest eighth */
:is(.stage,.bandroom)>.decision.sheet.band.long{max-height:none}   /* the long words have gone to the side panel: what is left is never cut */
:is(.stage,.bandroom)>.decision.sheet.band.on{display:flex}
/* two lines: what waits (the kicker, the question or its answer's feedback, Show the frame), then the acts */
:is(.stage,.bandroom)>.decision.band::after{content:"";order:5;flex:0 0 100%;height:0}
:is(.stage,.bandroom)>.decision.band:not(.folded) :is(.hd,.more,.foot){display:contents}
:is(.stage,.bandroom)>.decision.band .reason{display:none}
:is(.stage,.bandroom)>.decision.band .opts:not([data-kind="call"]):not([data-kind="stop"]){display:none}
.decision.band .hd .k{order:0;flex:0 1 auto;min-width:0;display:inline-flex;align-items:center;gap:8px;margin:0;font:500 clamp(12px,.95cqw,15px)/1.3 var(--sans);color:var(--ink-2)}
.decision.band:not(.folded) .hd .k::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;background:var(--accent)}
/* the words: on the kicker's line while they fit it (fitBand measures them there, unwrapped), else a line of their own (.tall), wrapping */
.decision.band :is(.q,.feedback,.blong){order:1;flex:1 1 0;min-width:0;margin:0;max-width:none;font:400 clamp(15px,1.3cqw,22px)/1.25 var(--serif);color:var(--ink);white-space:nowrap;overflow:hidden}
.decision.band .feedback{order:2;color:var(--ink-2)}
.decision.band .blong{order:2}
.decision.band .blong[hidden]{display:none}
.decision.band .blong .lnk{font:inherit;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.decision.band:has(.feedback[style*="block"]) .q{display:none}   /* answered: the feedback says it, in the question's place */
.decision.band .fold{order:4;margin-left:auto}
.decision.band.tall .fold{order:1}
.decision.band.tall :is(.q,.feedback,.blong){order:2;flex:1 1 100%;white-space:normal;overflow:visible}
:is(.stage,.bandroom)>.decision.band.tall::after{display:none}
.decision.band.long :is(.q,.feedback){display:none!important}   /* past the cap: the side panel has them; .blong says so */
.decision.band .foot .hint{order:6;flex:0 1 auto;position:static;width:auto;height:auto;min-width:0;margin:0 4px 0 0;overflow:visible;clip:auto;white-space:normal;font:400 clamp(13px,1cqw,16px)/1.3 var(--sans);color:var(--ink-3)}
.decision.band .foot .hint:empty,.decision.band:has(.opts:is([data-kind="call"],[data-kind="stop"])) .foot .hint:not([data-live]){display:none}   /* a call's keys are on its two buttons */
.decision.band .foot .hint[data-live]{color:var(--accent-text)}
.decision.band .opts[data-kind="call"]{order:7;display:flex;flex-wrap:wrap;gap:8px}
.decision.band .own{order:8;margin:0}
.decision.band .own.open{order:20;flex:1 1 100%;min-width:0;display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px}   /* own words in use: a row of their own */
.decision.band .own.open .ownbox{flex:1 1 0;min-width:0;align-items:center}
.decision.band .own.open .ownbtn{display:none}
.decision.band .ownbox textarea{min-height:clamp(30px,2.4cqw,40px);padding:4px 10px;overflow:hidden;font:400 clamp(14px,1.05cqw,17px)/1.3 var(--sans)}   /* as tall as its words (fitBand) */
.decision.band .own.open .ownhint:not([hidden]){flex:1 1 100%;min-width:0;margin:0;font:400 clamp(13px,1cqw,16px)/1.3 var(--sans)}   /* on a call: what own words do, beside the box */
.decision.band .unclearbtn{order:9}
.decision.band .note{order:10;flex:0 1 auto;min-width:0}   /* its input is as wide as its words (fitBand); a line of its own when that is what fits */
.decision.band .note textarea{padding:6px 0;font:400 clamp(14px,1.05cqw,17px)/1.3 var(--sans)}
.decision.band .disagree.on{order:11;flex:0 1 auto;min-width:0;flex-wrap:wrap;gap:0 8px;margin:0;max-width:none}
.decision.band :is(.note,.disagree.on):is(:focus-within,:has(textarea:not(:placeholder-shown))){order:20;flex:1 1 100%}   /* a note in use: a full row, after the controls */
.decision.band .disagree label{font:500 clamp(13px,1cqw,16px)/1.3 var(--sans);white-space:nowrap}
.decision.band .disagree textarea{flex:1 1 0;padding:6px 0;font:400 clamp(14px,1.05cqw,17px)/1.3 var(--sans)}
.decision.band .disagree .kept{display:none}
.decision.band .backbtn{order:12}
.decision.band .foot .confirm{order:13;margin-left:auto}
.decision.band .foot .gobtn{order:14;margin-left:auto}
.decision.band .foot .confirm:not([hidden])~.gobtn{margin-left:0}
.decision.band:has(.own.open) :is(.hint,.unclearbtn,.note,.backbtn,.opts,.confirm){display:none!important}   /* own words take the line */
/* clear buttons, not links: a hairline box, the sans at reading size, the one act that goes on in ink */
.decision.band :is(.fold,.reopen,.ownbtn,.backbtn,.gflag),.decision.band .ownbox button,.decision.band .opts[data-kind="call"] .opt,.decision.band .crow .cacts button,.decision.band .foot :is(.confirm,.gobtn){display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:none;height:clamp(30px,2.4cqw,40px);min-height:0;margin:0;padding:0 clamp(10px,1cqw,16px);border:1px solid var(--ink-20);border-radius:6px;background:none;font:500 clamp(13px,1cqw,16px)/1 var(--sans);color:var(--ink);white-space:nowrap;cursor:pointer}
.decision.band .fold,.decision.band .foot :is(.confirm,.gobtn):not([hidden]){margin-left:auto}
.decision.band :is(.fold,.reopen){height:clamp(26px,2cqw,34px)}   /* the first line is words; its one button is a size down */
.decision.band .foot .confirm:not([hidden])~.gobtn{margin-left:0}
.decision.band :is(.fold,.reopen,.ownbtn,.backbtn,.gflag):hover,.decision.band .ownbox button:hover,.decision.band .opts[data-kind="call"] .opt:hover{border-color:var(--ink);color:var(--ink)}
.decision.band .foot :is(.confirm:not(:disabled),.gobtn),.decision.band .opts[data-kind="call"] .opt:is([data-verdict="accept"],[data-gaccept]){background:var(--ink);border-color:var(--ink);color:var(--paper)}
.decision.band .foot .confirm:disabled{opacity:1;color:var(--ink-3)}
.decision.band .gflag[aria-pressed="true"]{border-color:var(--accent);color:var(--accent-text);background:none}
.decision.band .opts[data-kind="call"] .opt .key{width:20px;height:20px}
.decision.band .opts[data-kind="call"] .opt b{margin:0;font:inherit}
.decision.band kbd{margin-left:0}
.decision.band .unclearbtn[hidden],.decision.band .backbtn[hidden],.decision.band .foot :is(.confirm,.gobtn)[hidden],.decision.band .own[hidden],.decision.band .note[hidden]{display:none}
/* a stop: a step's calls that stop, one row each: its id, what it chose and instead of what,
   and its own Accept, Flag and own words. The first still waiting carries the keys. Past the cap the words go to
   the side panel and the rows close up to their ids and buttons, several to a line. */
.decision.band .opts[data-kind="stop"]{order:3;flex:1 1 100%;display:grid;grid-template-columns:minmax(0,1fr);gap:0;margin:0}
.decision.band .crow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:4px 12px;padding:5px 0;border-top:1px solid var(--ink-12)}
.decision.band .crow .cid{font:500 clamp(12px,.95cqw,15px)/1.3 var(--mono);color:var(--ink-2)}
.decision.band .crow .cw{font:400 clamp(15px,1.2cqw,20px)/1.3 var(--serif);color:var(--ink)}
.decision.band .crow .ci{color:var(--ink-3)}
.decision.band .crow .cacts{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}
.decision.band .crow .cacts button{height:clamp(28px,2.2cqw,36px)}
.decision.band .crow .cacts button:hover{border-color:var(--ink);color:var(--ink)}
.decision.band .crow .cacts button[aria-pressed="true"][data-sverdict$=":accept"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.decision.band .crow .cacts button[aria-pressed="true"]:is([data-sverdict$=":flag"],[data-sown],[data-gflag]){border-color:var(--accent);color:var(--accent-text)}
.decision.band .crow .cacts .key{display:inline-grid;place-items:center;width:20px;height:20px;border:1px solid var(--ink-20);border-radius:4px;font:500 var(--fs-xs)/1 var(--mono);color:inherit}
.decision.band .crow:not([data-current]) .cacts .key{display:none}
@container (max-width:760px){.decision.band .crow{grid-template-columns:auto minmax(0,1fr)}.decision.band .crow .cacts{grid-column:2;justify-content:flex-start}}
.decision.band.long .opts[data-kind="stop"]{grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));column-gap:24px}
.decision.band.long .crow{grid-template-columns:3.5em 1fr}
.decision.band.long .crow .cacts{justify-content:flex-start}
.decision.band.long .crow .cw{display:none}
/* "Show the frame": the question put aside. Under the video the band keeps one line, what still waits and
   the way back; in the frame it steps down to a pill in the frame's top-right corner, in the margin
   frames keep there, as the folded sheet does: the captions come back in the lowest eighth, and a long one reaches
   the right edge, so a pill left there would sit on it */
:is(.stage,.bandroom)>.decision.sheet.band.folded{flex-wrap:nowrap;justify-content:flex-start}
:is(.stage,.bandroom)>.decision.band.folded::after{display:none}
.decision.band.folded>:not(.hd),.decision.band.folded .fold,.decision.band:not(.folded) .reopen{display:none!important}
.decision.band.folded .hd{display:flex;flex:1;min-width:0;align-items:center;gap:12px}
.decision.band.folded .hd::before{width:7px;height:7px}
.decision.band.folded .hd .k{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
.decision.band.folded .reopen{padding:0 clamp(10px,1cqw,16px);border-left:1px solid var(--ink-20);color:var(--accent-text)}
.stage>.decision.sheet.band.folded{top:12px;bottom:auto;height:auto;min-height:0;max-height:none;padding:0 12px;background:none;box-shadow:none;pointer-events:none;justify-content:flex-end;overflow:visible}
.stage>.decision.band.folded .hd{flex:0 1 auto;pointer-events:auto;padding:6px 6px 6px 12px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 2px 10px rgba(var(--ink-rgb),.12)}
/* after a review is sent, an edit in the record is offered as a new send, as in the Finish panel */
.resend{width:100%;max-width:1120px;margin:12px auto 0;font-size:var(--fs-sm);color:var(--accent-text)}
.resend[hidden]{display:none}
.resend .lnk{margin-left:8px;font-size:var(--fs-sm);color:var(--accent-text)}
/* the record edits in place: "change" opens the answer's options under it; a pick saves it. */
.redit{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;margin-top:8px}
.redit .ropt{display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:4px 10px 4px 6px;font-size:var(--fs-sm);text-align:left;border-color:var(--ink-20);background:none;color:var(--ink)}
.redit .ropt:hover{border-color:var(--ink)}
.redit .ropt .key{display:inline-grid;place-items:center;flex:none;width:20px;height:20px;border:1px solid var(--ink-20);border-radius:4px;font:500 var(--fs-xs)/1 var(--mono);color:var(--ink-3)}
.redit .ropt[aria-pressed="true"]{background:none;border-color:var(--ink);color:var(--ink)}
.redit .ropt[aria-pressed="true"] .key{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.redit .rsave{min-height:32px;padding:4px 12px;font-size:var(--fs-sm);background:var(--ink);border-color:var(--ink);color:var(--paper)}
.redit textarea{flex:1 1 220px;min-width:0;font:inherit;font-size:var(--fs-sm);padding:6px 0;border:0;border-bottom:1px solid var(--ink-20);border-radius:0;background:none;color:var(--ink)}
.redit textarea:focus{outline:0;border-color:var(--ink)}
.dec .a .lnk[aria-expanded="true"]{color:var(--ink)}
/* On a phone (D-003) the video is the page: it runs edge to edge, with the same two thin
   bands under it as anywhere else, and the record is the same 40 px bar at the foot of the screen
   that pulls up over the video when asked. Nothing covers the frame until the reviewer asks for it.
   At 390x844 the chrome under the frame was four stacked rows costing 337 px — more of the screen
   than the 219 px of video. It is now the two-row transport and one row for Mark, the comment and
   Finish; the speed drag, which had a row of its own, opens from "1×" as it does on a laptop. */
@media (max-width:600px){
  .wrap{--stage:100%}
  .main{width:var(--stage)}.transport .vsize,.szgrip{display:none}   /* a phone's frame is already the screen's width: always Fit, and no Size */
  .wrap[data-zoom] .zin{width:100%;height:100%}.wrap[data-zoom] .zport{overflow:hidden}   /* nor zoomed in */
  .side{padding:0 16px 24px;gap:16px}
  .grab{width:calc(100% + 32px);margin:0 -16px;padding:0 16px}.wrap.pulled .grab{padding:0 16px;min-height:48px}
  .side .col{gap:28px}
  .main{padding:0 16px}                 /* nothing is reserved at the foot: the sheet is fixed */
  .stage{width:auto;margin:0 -16px;box-shadow:none}   /* the frame runs edge to edge; only its chrome keeps the gutter */
  .transport{grid-template-rows:24px 36px;column-gap:4px}
  .transport .play{min-width:0;width:36px;height:36px;padding:0;margin-left:-8px;justify-content:center;font-size:0;gap:0}   /* the glyph alone: the word is its aria-label */
  .transport .play::before{margin:0 0 0 3px}.transport .play[data-playing="true"]::before{margin:0}
  .transport .ib{min-width:36px;height:36px}
  .labels .part{font-size:var(--fs-xs)}
  .time .of{display:none}   /* the poster says how long it is; the row needs the room for the part */
  .nowline:has(.status[data-show]) .labels{display:none}   /* a wait or a notice has the row to itself; the part comes back after */
  .status[data-show]{max-width:none;margin-left:0}
  .scrub{height:24px}.scrub .cmt{top:2px;height:6px}.scrub .seg{top:10px}.scrub .seg.hov{top:8px}.scrub .tick{top:9.5px;width:5px;height:5px;margin-left:-2.5px}.scrub .tick[data-kind="check"]{top:8.5px;width:7px;height:7px;margin-left:-3.5px;border-width:1.5px}.scrub .head{top:5px}.scrub .chg{top:16px}
  .sppop{right:-6px}
  /* one row: Mark, the comment, Finish; while marking, the five tools take a row of their own under it */
  .toolbar{gap:4px 8px}.group{gap:6px}
  .toolbar .group.mark{display:contents}
  .toolbar .shapes{order:1;flex-basis:100%}
  .toolbar .shapes button{flex:1 1 auto;min-height:36px;padding:5px 6px}
  .toolbar .composer{flex:1 1 0}
  .composer textarea{font-size:var(--fs-ui)}
  button.finishbtn{padding:0 14px}
  button kbd{display:none}
  /* A question docked to the viewport's bottom edge takes exactly the band between the frame's
     bottom edge and the bottom of the screen: the frame above, the question below, nothing cut and
     nothing peeping out underneath. Its buttons sit at the foot of that band. */
  .sheet.on{position:fixed;z-index:10;top:var(--sheet-top,30dvh);bottom:0;min-height:0;max-height:none;overflow:auto;padding:16px;display:flex;flex-direction:column}
  .sheet.on .foot{margin-top:auto;padding-top:12px}
  .decision.on:has(.opts[data-kind="call"]){display:flex;align-items:stretch}.decision:has(.opts[data-kind="call"])>.more:not(:has(.own.open)){margin-top:12px}
  .reason .facts{grid-template-columns:minmax(0,1fr);gap:0}.reason .facts dd{margin:0 0 8px}.reason .facts dd:last-child{margin:0}
  /* folded, the pill goes back onto the frame's own corner rather than floating in the page */
  .sheet.on.folded{position:absolute;display:block;top:8px;left:auto;right:8px;bottom:auto;width:auto;max-width:calc(100% - 16px);padding:6px 10px;overflow:visible}
  .sheet .q{font-size:var(--fs-lead)}.opts,.opts[data-kind="quiz"],.opts[data-n],.stage[data-size] .opts[data-n]{grid-template-columns:1fr}   /* phones stack every option, however many */
  .opts[data-kind="call"] .opt{height:40px}
  .idle{gap:8px}.idle .go{width:48px;height:48px}
  .idle,:host([theme="dark"]) .idle{background:color-mix(in srgb,var(--paper) 90%,transparent)}   /* a phone's poster is small: its own words would sit under the play button and its line, so they stay behind the overlay */
  .partcard{left:8px;top:8px;max-width:calc(100% - 16px);padding:5px 10px 6px}.partcard .t{font-size:var(--fs-ui)}
  /* a phone: the band is under the frame for every video (the frame is too small to give it an eighth),
     in the page's flow and kept there for the whole video; it grows by a line when its acts need one */
  .wrap:is(.band-under,.band-in) .bandroom{display:block;width:auto;aspect-ratio:auto;min-height:104px;margin:0 -16px;box-shadow:none}
  .bandroom>.decision.sheet.band.on{position:static;height:auto;min-height:104px;max-height:60svh;padding:8px 16px;gap:8px;align-items:center}   /* in the page's flow: its cap is 60% of the screen (45% sent a two-line explanation to the side panel) */
  .bandroom>.decision.sheet.band.on.long{max-height:none}
  .bandroom>.decision.sheet.band.on.folded{position:static;display:flex;min-height:104px}
  .decision.band :is(.q,.feedback,.blong){order:2;flex:1 1 100%;font-size:var(--fs-body);white-space:normal;overflow:visible}   /* the kicker and Show the frame on a line, the words under them, in full */
  .decision.band .fold{order:1}
  .decision.band .crow .cw{font-size:var(--fs-body)}
  .decision.band .foot .hint{flex-basis:100%;white-space:normal}
  .decision.band .note,.decision.band .disagree.on{flex:1 1 100%}
  .decision.band :is(.fold,.reopen,.ownbtn,.backbtn,.gflag),.decision.band .ownbox button,.decision.band .opts[data-kind="call"] .opt,.decision.band .crow .cacts button,.decision.band .foot :is(.confirm,.gobtn){height:44px;font-size:var(--fs-ui)}
  .decision.band kbd{display:none}   /* no keyboard to name on a phone */
}
/* ---- details ------------------------------------------------------------------------------------
   While the frame has a detail, one chip on the stage's top-right corner opens it. It takes
   the partcard's shape (paper, a hairline and a soft lift), so it reads as the player's, not the video's. */
.dchip{position:absolute;right:12px;top:12px;z-index:3;display:flex;align-items:center;gap:8px;max-width:min(440px,calc(100% - 24px));padding:6px 8px 6px 12px;border:0;border-radius:6px;background:var(--paper);color:var(--ink);font-size:var(--fs-sm);line-height:1.3;box-shadow:0 0 0 1px var(--ink-12),0 2px 8px rgba(var(--ink-rgb),.1)}
.dchip[hidden]{display:none}
.dchip b{flex:none;font-weight:500}
.dchip .dt{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink-2)}
.dchip kbd{margin-left:0;display:inline-grid;place-items:center;min-width:18px;height:18px;border:1px solid var(--ink-20);border-radius:4px}
.dchip:hover{box-shadow:0 0 0 1px var(--ink),0 2px 8px rgba(var(--ink-rgb),.1)}
.stage:has(>.decision.sheet.folded) .dchip{top:60px}   /* a folded question (the sheet or the band's pill) owns the corner; the chip steps down under it */
/* Details in the frame: the thing a detail explains is marked in the frame
   (data-detail); the player lays a clear button over it, in the picture's own layer, so it moves with the
   picture zoomed past Fit (D-182), as the cards' buttons do. It hides while a mark tool is on. The video comes
   first, so the button is quiet (the owner: "the click area should be a bit more subtle"): while the video plays
   nothing is drawn over the frame; paused, one small low-contrast glyph sits just above the thing's top-left
   corner (inside its top-right one where there is no room above); under the pointer, the hand, a thin soft coral
   ring with a faint tint on the thing itself, and the glyph opens into a small grey label, "More in the guide ↓",
   on a paper wash so it reads over a busy frame. A touch has no hover: its first tap shows the ring and the label
   (data-armed), a second opens. Focus keeps a full ring, for the keyboard. The label goes in the room the style guide's rule 5 keeps
   clear above the thing. The thing keeps a thin ink ring while its page is open. It is live only once it has drawn
   (its reveal over, not merely its box there); the card that says what the part is for opens only from the pill itself,
   hovered or focused, beside the pill and off the frame's words, never from the thing (a thing can be most of the
   frame, and a card from resting the pointer on it would cover the scene's own headline). */
.dmark{position:absolute;inset:0;z-index:1;pointer-events:none}
.dmark[hidden],.stage:not([data-tool=""]) .dmark,.stage:not([data-started]) .dmark{display:none}   /* not before the video starts: over the poster it would take the click meant for Play */
.dhit{position:absolute;display:block;margin:0;padding:0;border:0;border-radius:6px;background:transparent;pointer-events:auto;cursor:pointer;transition:box-shadow .15s,background-color .15s}
.dhit:hover,.dhit[data-armed]{box-shadow:0 0 0 1px rgba(var(--accent-rgb),.6);background:rgba(var(--accent-rgb),.045)}
.dhit:focus{outline:none}
.dhit[data-big]{pointer-events:none}.dhit[data-big] .dtab{pointer-events:auto}   /* a thing that is most of the picture: only its label leads to the guide, so a click on the video still does what a click on a video does */
.dhit:focus-visible{box-shadow:0 0 0 2px var(--accent),0 0 0 5px rgba(var(--accent-rgb),.22);background:rgba(var(--accent-rgb),.045)}
.dhit[data-open]{box-shadow:0 0 0 1px rgba(var(--ink-rgb),.5);background:transparent}
.dhit[data-big]:is(:hover,[data-armed],:focus-visible),.dmark[data-playing] .dhit:is(:hover,[data-armed]){background:transparent}   /* a thing that is most of the picture (over 40% of it), or any thing while the video plays: its 1 px ring and the pill, never a wash of coral over the video */
.dhit .dtab{position:absolute;left:0;top:0;z-index:1;display:inline-flex;cursor:pointer;align-items:center;max-width:100%;height:18px;box-sizing:border-box;padding:0 5px;border-radius:9px;background:color-mix(in srgb,var(--paper) 82%,transparent);box-shadow:0 0 0 1px var(--ink-06);color:var(--ink-3);font:500 11px/1 var(--sans);font-style:normal;white-space:nowrap;text-align:left;opacity:.62;transition:opacity .15s}
.dhit .dtl{display:inline-block;max-width:0;overflow:hidden;text-overflow:clip;vertical-align:top}
.dhit .dgl{font-style:normal}
/* playing: nothing on the frame until the pointer or the keyboard comes to the thing */
.dmark[data-playing] .dhit:not(:hover):not(:focus-visible):not([data-armed]) .dtab{opacity:0}
.dhit:is(:hover,:focus-visible,[data-armed]) .dtab{opacity:1;padding:0 7px}
.dhit:is(:hover,:focus-visible,[data-armed]) .dtl{max-width:24ch;margin-right:4px}
.dhit[data-open] .dtab{opacity:0}
@media (prefers-reduced-motion:reduce){.dhit,.dhit .dtab{transition:none}}
/* D-195: a detail opens over the frame, grown from the thing you clicked, and shrinks back into it when it
   closes; the page gets the video's box. A phone keeps the page over the whole window (D-021's phone rule);
   the Terms and the band's long words keep the side panel. */
.wrap .stage>.dpanel.over{position:absolute;inset:0;left:0;right:0;top:0;bottom:0;width:auto;z-index:12;border-left:0;border-radius:0;box-shadow:none;transform-origin:0 0}
.dghost{position:absolute;inset:0;z-index:12;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12);transform-origin:0 0;pointer-events:none}
/* The side panel (D-021): beside the paused stage, the page in a sandboxed frame. The page's column
   gives it the room, so the stage shrinks beside it rather than being covered. */
.wrap{--dpw:min(560px,44vw);--planw:320px}
.wrap.dopen{padding-right:var(--dpw)}
.wrap.dopen .side{right:var(--dpw)}
/* where the stage would be left under 640 px beside it, the page covers the window instead (a phone, a narrow window) */
.wrap.dopen.dcover{padding-right:0}
.wrap.dopen.dcover .side{right:0}
.wrap.dcover .dpanel{left:0;width:auto;z-index:20;border-left:0;box-shadow:none}
.dpanel{position:fixed;top:0;right:0;bottom:0;z-index:12;width:var(--dpw);display:flex;flex-direction:column;background:var(--paper);border-left:1px solid var(--ink-12);box-shadow:-12px 0 24px -16px rgba(20,20,19,.18)}
.dpanel[hidden]{display:none}
/* The panel's own chrome is one compact header: what kind of detail and which step, its title on one
   line, the close; the why under it in one quiet line. The page inside has the room. */
.dhd{flex:none;display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;column-gap:12px;min-height:48px;padding:6px 8px 6px 20px;border-bottom:1px solid var(--ink-12)}
.dhd .k{grid-column:1;grid-row:1;white-space:nowrap;font:500 var(--fs-sm)/1.4 var(--sans);color:var(--ink-3)}
.dhd h5{grid-column:2;grid-row:1;min-width:0;margin:0;font:400 var(--fs-lead)/1.3 var(--serif);color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dhd .dx{grid-column:4;grid-row:1}
/* every part opens its full guide page at its own section */
.dhd .dfull{grid-column:3;grid-row:1;display:inline-flex;align-items:center;gap:6px;max-width:min(360px,40vw);height:32px;padding:0 12px;border-radius:6px;background:var(--ink);color:var(--paper);font:500 var(--fs-sm)/1 var(--sans);text-decoration:none;white-space:nowrap;cursor:pointer}
.dhd .dfull[hidden]{display:none}
.dhd .dfull .dft{min-width:0;overflow:hidden;text-overflow:ellipsis;opacity:.75}
.dhd .dfull .dft::before{content:"· "}
.dhd .dfull:hover{box-shadow:0 0 0 2px var(--ink-20)}
@media (max-width:760px){.dhd .dfull .dft{display:none}}
.dhd .why{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}   /* read out, and in the title's tooltip; on screen it ran under the × */
.dx{flex:none;width:32px;height:32px;padding:0;border:0;border-radius:6px;background:none;color:var(--ink-3);font-size:var(--fs-lead);line-height:1}
.dx:hover,.dx:focus-visible{background:rgba(var(--ink-rgb),.08);color:var(--ink)}
.dx:focus:not(:focus-visible){outline:none}
/* a walkthrough's detail belongs to one of the agent's calls: its verdict is the panel's footer, the
   call in one line (its tooltip has all of it), then Accept and Flag */
.dcall{flex:none;display:flex;align-items:center;gap:12px;min-height:52px;padding:8px 12px 8px 20px;border-top:1px solid var(--ink-12);background:var(--paper);font-size:var(--fs-ui);color:var(--ink-2)}
.dcall[hidden]{display:none}
.dcall .what{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dcall .what b{font-weight:500;color:var(--ink)}
.dcall .acts{flex:none;display:flex;gap:8px}
.dcall button{height:36px;padding:0 12px;font-size:var(--fs-sm)}
.dcall button kbd{margin-left:6px}
.dcall button[data-dverdict="accept"] kbd{color:inherit;opacity:.7}
.dcall button[data-dverdict="accept"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.dcall button:disabled{cursor:default;opacity:.55}
.dcall button[aria-pressed="true"]:disabled{opacity:1}
.dcall button[data-dverdict="accept"]:disabled:not([aria-pressed="true"]){background:none;color:var(--ink);border-color:var(--ink-20)}
.dpanel iframe{flex:1 1 auto;display:block;width:100%;min-height:0;border:0;background:var(--paper)}
/* a comment on one part of the page: docked under it, naming the part it is about */
.dcomment{flex:none;padding:12px 20px 16px;border-top:1px solid var(--ink-12);background:var(--paper)}
.dcomment[hidden]{display:none}
.dcomment .k{display:block;margin:0 0 6px}
.dcomment .k code,.ann .t code,.dsaved code{font:var(--fs-xs)/1.4 var(--mono);color:var(--ink)}
.dcomment .quote[hidden]{display:none}
.dcomment .quote{margin:0 0 8px;padding-left:10px;border-left:2px solid var(--ink-20);font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dcomment .row{display:flex;gap:8px;align-items:flex-start}
.dcomment textarea{flex:1;min-width:0;min-height:38px;font:inherit;font-size:var(--fs-ui);padding:8px 0 7px;border:0;border-bottom:1px solid var(--ink-20);border-radius:0;background:none;color:var(--ink);resize:none}
.dcomment textarea:focus{outline:0;border-color:var(--ink)}
.dcomment .hint{margin:6px 0 0;font-size:var(--fs-xs);color:var(--ink-3)}
.dcomment .row button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.dcomment .row button[hidden]{display:none}
/* on words selected or a line clicked in a part of the guide: the box opens on them, as a mark's does on the frame */
.dcomment.float{position:absolute;z-index:4;width:min(380px,calc(100% - 24px));padding:10px 12px 12px;border:1px solid var(--ink-20);border-radius:8px;box-shadow:0 12px 32px -14px rgba(var(--ink-rgb),.45)}
.dcomment.float .row{flex-wrap:wrap}
.dcomment.float textarea{flex:1 1 100%;margin-bottom:6px}
.dcomment .dans{margin:10px 0 0;padding-top:8px;border-top:1px solid var(--ink-12);font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2)}
.dcomment .dans[hidden]{display:none}
.dcomment .dans .aq{margin:0 0 4px;font-weight:500;color:var(--ink)}
.dcomment .dans .af{margin:6px 0 0;font-size:var(--fs-xs);color:var(--ink-3)}
.dsaved{flex:none;margin:0;padding:10px 20px;border-top:1px solid var(--ink-12);font-size:var(--fs-ui);line-height:1.5;color:var(--ink-2)}
.dsaved[hidden]{display:none}
/* The plan's own text, one section per step, the step the video is on ruled in ink and the
   only one open; the others are one line each, a click away. Beside the stage where the window has
   width to spare (the stage is height-bound there, so it costs the video almost nothing); otherwise
   in the record, under Steps. */
.plantext[hidden]{display:none}
.wrap.beside{display:flex;justify-content:center;gap:32px;--stage:min(calc(100% - var(--planw) - 32px),max(320px,calc(min((100vh - var(--chrome) - var(--rp-above, 0px)) * var(--band-k, 1), 100vh - var(--chrome) - var(--rp-above, 0px) - var(--band-min, 0px)) * 16 / 9)));--stage:min(calc(100% - var(--planw) - 32px),max(320px,calc(min((100svh - var(--chrome) - var(--rp-above, 0px)) * var(--band-k, 1), 100svh - var(--chrome) - var(--rp-above, 0px) - var(--band-min, 0px)) * 16 / 9)))}
.wrap.beside>.main{margin:0;flex:none}
.wrap.beside>.plantext{position:relative;flex:0 0 var(--planw);min-width:0}
.wrap.beside>.plantext>.pscroll{position:absolute;inset:44px 0 0;overflow:auto;padding:0 8px 24px 12px;overscroll-behavior:contain;scrollbar-width:thin;-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 24px),transparent)}
/* beside, the column is the toggle turned on: its head names the step and folds it back into the record */
.wrap.beside>.plantext>.ptoggle{display:flex;position:absolute;top:0;left:12px;right:8px;align-items:center;gap:8px;min-height:32px;margin:0;padding:0;border:0;border-bottom:1px solid var(--ink-12);border-radius:0;background:none;font-size:var(--fs-sm);font-weight:500;color:var(--ink-2);text-align:left;cursor:pointer}
.wrap.beside>.plantext>.ptoggle:hover{color:var(--ink)}
.wrap.beside>.plantext>.ptoggle::after{content:"×";margin-left:auto;font-size:var(--fs-body);line-height:1;font-weight:400}
.wrap.beside.dopen{--stage:min(100%,max(320px,calc(min((100vh - var(--chrome) - var(--rp-above, 0px)) * var(--band-k, 1), 100vh - var(--chrome) - var(--rp-above, 0px) - var(--band-min, 0px)) * 16 / 9)));--stage:min(100%,max(320px,calc(min((100svh - var(--chrome) - var(--rp-above, 0px)) * var(--band-k, 1), 100svh - var(--chrome) - var(--rp-above, 0px) - var(--band-min, 0px)) * 16 / 9)))}
.wrap.beside.dopen>.plantext{display:none}   /* a detail open takes the side of the page; the plan comes back when it closes */
.plantext .ptitle{margin:0 0 12px;font:400 var(--fs-lead)/1.3 var(--serif);color:var(--ink)}
.pstep{padding:5px 0 5px 12px;margin:0 0 0 -12px;box-shadow:inset 2px 0 0 transparent}
.pstep[aria-current="true"]{box-shadow:inset 2px 0 0 var(--ink);padding-bottom:10px;margin:4px 0 4px -12px}
.pstep h6{display:flex;align-items:baseline;gap:8px;margin:0;font:400 var(--fs-ui)/1.4 var(--serif);color:var(--ink-2);cursor:pointer}
.pstep h6 .n{flex:none;min-width:12px;font:var(--fs-xs)/1 var(--mono);color:var(--ink-3)}
.pstep h6 .tt{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pstep h6:hover{color:var(--ink)}
.pstep[aria-current="true"] h6{color:var(--ink)}
.pstep[aria-current="true"] h6 .tt{white-space:normal}
.pstep[aria-current="true"] h6 .n{color:var(--ink)}
.pstep .ts{flex:none;border:0;background:none;padding:0;font:var(--fs-xs)/1 var(--mono);color:var(--ink-3);cursor:pointer;opacity:0;transition:opacity .12s}
.pstep h6:hover .ts,.pstep .ts:focus-visible{opacity:1}
.pstep .ts:hover{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
@media (hover:none){.pstep .ts{opacity:1}}
.pstep:not([aria-current="true"]) .md,.pstep:not([aria-current="true"]) .pdets{display:none}
.pstep .md{margin-top:6px;font-size:var(--fs-ui);line-height:1.55;color:var(--ink-2)}
.pstep .md p{margin:0 0 8px}
.pstep .md ul,.pstep .md ol{margin:0 0 8px;padding-left:20px}
.pstep .md li{margin:0 0 2px}
.pstep .md b{font-weight:600;color:var(--ink)}
.pstep .md code{font:var(--fs-xs)/1.4 var(--mono);color:var(--ink);overflow-wrap:anywhere}
.pstep .md pre{margin:0 0 8px;padding:2px 0 2px 12px;border-left:2px solid var(--ink-12);overflow:auto}
.pstep .md pre code{white-space:pre}
.pguide{margin:0 0 10px;font-size:var(--fs-sm)}
.pguide a{color:var(--ink-2);text-decoration:underline;text-decoration-color:var(--ink-20);text-underline-offset:3px}
.pstep .pdets{display:flex;flex-wrap:wrap;gap:4px 12px;margin:0 0 4px;font-size:var(--fs-sm);color:var(--ink-3)}
.pstep .pdets button{border:0;background:none;padding:0;font-size:var(--fs-sm);color:var(--ink-2);text-decoration:underline;text-decoration-color:var(--ink-20);text-underline-offset:3px}
.pstep .pdets button:hover{color:var(--ink);text-decoration-color:currentColor}
@media (max-width:600px){
  .dchip{right:8px;top:8px;max-width:70%;min-height:0;padding:4px 8px 4px 10px;font-size:var(--fs-xs)}
  .wrap.dopen{padding-right:0}
  .dpanel{left:0;width:auto;z-index:20;border-left:0;box-shadow:none}   /* a phone: the page covers the video (D-021) */
  .dhd{padding:4px 4px 4px 16px;column-gap:8px}.dhd h5{font-size:var(--fs-body)}.dcomment{padding:10px 16px 12px}.dsaved{padding:8px 16px}
  .dcall{padding:8px 8px 8px 16px;gap:8px}
}
/* ---- Accessible videos: what to know before watching, what the words mean, ids never alone ----------
   "Before you watch": the videos this one assumes, on the poster, before the first play. Player chrome,
   not video: it adds nothing to the length. One row each (title, what it gives you, its length, watched
   or not, a link to it on the review page), then Start. Every one watched, it is one line. */
.before{pointer-events:auto;width:min(560px,92%);max-height:calc(100% - 48px);overflow:auto;overscroll-behavior:contain;padding:16px 20px;border-radius:10px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 8px 28px -12px rgba(20,20,19,.3);text-align:left;color:var(--ink)}
.before[hidden]{display:none}
.before h5{margin:0 0 2px;font:400 var(--fs-lead)/1.3 var(--serif);color:var(--ink)}
.before .bl{margin:0 0 10px;font-size:var(--fs-sm);line-height:1.45;color:var(--ink-2)}
.before .pre{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:2px;padding:8px 10px;margin:0 -10px;border-radius:6px;color:var(--ink);text-decoration:none}
.before .pre:hover{background:var(--ink-06)}
.before .pre[data-off]:hover{background:none}   /* a video not on this page: said, not linked */
.before .pt{font-size:var(--fs-ui);font-weight:500;line-height:1.35;min-width:0}
.before .pl{grid-column:2;grid-row:1;font:var(--fs-xs)/1.35 var(--mono);color:var(--ink-3);white-space:nowrap}
.before .pg{grid-column:1;font-size:var(--fs-sm);line-height:1.4;color:var(--ink-2)}
.before .pw{grid-column:2;grid-row:2;justify-self:end;font-size:var(--fs-xs);color:var(--ink-3);white-space:nowrap}
.before .pre[data-watched] .pw{color:var(--ink-2);font-weight:500}
.before .acts{display:flex;align-items:center;gap:12px;margin-top:12px}
.before:not(.one) .acts{position:sticky;bottom:-16px;margin:12px -20px -16px;padding:12px 20px 16px;background:var(--paper)}   /* Start, a footer that stays in reach; a long list fades out into it (the 24 px above) */
.before:not(.one) .acts::before{content:"";position:absolute;left:0;right:0;top:-24px;height:24px;background:linear-gradient(to bottom,transparent,var(--paper));pointer-events:none}
.idle:has(.before:not([hidden]):not(.one):not(.below)){background:color-mix(in srgb,var(--paper) 92%,transparent)}   /* open over the poster, the box has the picture to itself: the poster's own words never show round it */
.idle:has(.before:not([hidden]):not(.one)) .meta{display:none}   /* the poster's own line steps aside while the box is open */
.before.below{position:relative;box-sizing:border-box;width:auto;max-height:none;margin:4px 12px 12px;box-shadow:0 0 0 1px var(--ink-12)}   /* a phone: a sheet under the video */
.stage[data-started]~.before.below{display:none}
.before.below .acts{position:static;margin:12px 0 0;padding:0;background:none}.before.below .acts::before{display:none}
.before .start{height:36px;padding:0 16px;border:0;border-radius:6px;background:var(--ink);color:var(--paper);font:500 var(--fs-ui)/1 var(--sans);cursor:pointer}
.before .start kbd{margin-left:8px;color:inherit;opacity:.7}
.before .lnk{font-size:var(--fs-sm)}
.before .fleft{margin-top:12px;padding-top:10px;border-top:1px solid var(--ink-12)}
.before .fleft ul{margin:0;padding:0;list-style:none}
.before .fleft li{display:grid;row-gap:2px;padding:6px 0}
.before .fleft .fw{font-size:var(--fs-ui);line-height:1.4;color:var(--ink)}
.before .fleft .fy{font-size:var(--fs-sm);line-height:1.4;color:var(--ink-2)}
.before .fleft .fmore summary{padding:4px 0;font-size:var(--fs-sm);color:var(--ink-2);cursor:pointer}
.before .fleft .fmore summary:hover{color:var(--ink)}
.before.one{padding:10px 14px;display:flex;align-items:center;gap:12px}
.before.one .bl{flex:1;min-width:0;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.idle:has(.before:not([hidden]):not(.one)) .go{display:none}   /* its Start is the way in */
@media (max-width:600px){.before{width:94%;padding:10px 12px}.before h5{font-size:var(--fs-body)}.before:not(.one) .bl,.before .pg{display:none}.before .pre{padding:4px 8px;margin:0 -8px}.before .pt{font-size:var(--fs-sm)}.before .acts{margin-top:6px}.before .start{height:30px;font-size:var(--fs-sm)}}   /* a phone's poster is short: the names, lengths and Start */
/* a narrow phone: each video's name, then its length and whether you watched it on one line under it (not a ragged
   column of their own at the right) */
@media (max-width:419px){.before .pre{grid-template-columns:auto minmax(0,1fr)}.before .pt{grid-column:1/-1;grid-row:1}.before .pl{grid-column:1;grid-row:2}.before .pw{grid-column:2;grid-row:2;justify-self:start}.before .pl:not(:empty)~.pw::before{content:"· ";color:var(--ink-3)}}
.transport .termsbtn,.transport .askbtn{font:500 var(--fs-xs)/1 var(--sans)}
/* Quick checks on or off: a switch in words, quiet while on (the default), in ink while off, as a speed off 1x is */
.transport .checksbtn{font:500 var(--fs-xs)/1 var(--sans);white-space:nowrap}
.transport .checksbtn[hidden]{display:none}
.transport .checksbtn b{font-weight:500}
.transport .checksbtn[aria-checked="false"]{color:var(--ink)}
.transport .checksbtn[aria-checked="false"] b{font-weight:650}
.transport .checksbtn .sh{display:none}
@media (max-width:900px){.transport .checksbtn .lg{display:none}.transport .checksbtn .sh{display:inline}}
@media (max-width:700px){.transport .checksbtn{display:none}}
/* a quick check skipped (quick checks off): its scene faded on its part's bar, its mark faint, its row in Steps faint */
.scrub .seg>s.skp{position:absolute;top:0;bottom:0;background:var(--ground);opacity:.6;pointer-events:none}
.scrub .tick[data-skipped]{opacity:.35}
.gallery button.skp{opacity:.5}
.transport .askbtn[aria-pressed="true"]{background:var(--ink-06);color:var(--ink)}
/* Ask about this (videos-that-make-sense step 3): a question in your own words, in the side panel, answered from the plan,
   the glossary and the scene, each answer saying where it came from */
.dpanel .ask{flex:1 1 auto;min-height:0;overflow:auto;padding:12px 24px 32px}
.dpanel .ask[hidden],.dpanel[data-ask] .terms{display:none}
.ask .askabout{margin:0 0 10px;font-size:var(--fs-sm);line-height:1.45;color:var(--ink-2)}
.ask .askabout q{color:var(--ink)}
.ask .askrow{display:flex;flex-direction:column;gap:8px}
.ask textarea{width:100%;box-sizing:border-box;min-height:64px;padding:10px 12px;border:1px solid var(--ink-20);border-radius:8px;background:var(--paper);color:var(--ink);font:var(--fs-body)/1.5 var(--sans);resize:vertical}
.ask textarea:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:transparent}
.ask .askacts{display:flex;gap:8px}
.ask .askgo{height:36px;padding:0 16px;border:0;border-radius:6px;background:var(--ink);color:var(--paper);font:500 var(--fs-ui)/1 var(--sans);cursor:pointer}
.ask .askgo:disabled{opacity:.5;cursor:default}
.ask .askstop{height:36px;padding:0 14px;border:1px solid var(--ink-20);border-radius:6px;background:none;color:var(--ink);font:500 var(--fs-ui)/1 var(--sans);cursor:pointer}
.ask .askstop[hidden]{display:none}
.ask .askhow{margin:10px 0 0;font-size:var(--fs-sm);line-height:1.45;color:var(--ink-2)}
.ask .asklist{margin:18px 0 0;padding:0;list-style:none}
.ask .asklist li{padding:14px 0;border-top:1px solid var(--ink-12)}
.ask .aq{margin:0 0 6px;font:500 var(--fs-body)/1.45 var(--sans);color:var(--ink)}
.ask .aw{margin:0 0 6px;font-size:var(--fs-xs);color:var(--ink-3)}
.ask .aa{margin:0;font:var(--fs-body)/1.6 var(--sans);color:var(--ink-2);white-space:pre-wrap}
.ask .aa[data-state="thinking"],.ask .aa[data-state="waiting"]{color:var(--ink-3)}
.ask .af{margin:6px 0 0;font-size:var(--fs-sm);color:var(--ink-2)}
.ask .af b{font-weight:500;color:var(--ink)}
.transport .termsbtn[hidden]{display:none}
.transport .termsbtn[aria-pressed="true"]{background:var(--ink-06);color:var(--ink)}
/* the Terms panel: the side panel a detail opens in, holding the glossary and this video's own words, the beat's first.
   Read, not skimmed (the owner: "the way it has text is not great … less clear, harder to read"): each word's plain
   name in the serif, the files' name a small note beside it; one or two plain sentences under it in 16 px at body
   contrast (--ink-2: 9:1 and more on paper, light and dark), a line no longer than 62 characters; then "More",
   holding the rest and where the files say it. The sections are small capitals over a hairline. */
.dpanel .terms{flex:1 1 auto;min-height:0;overflow:auto;padding:12px 24px 32px}
.dpanel .terms[hidden],.dpanel[data-terms] iframe,.dpanel[data-terms] .dcall,.dpanel[data-terms] .dcomment,.dpanel[data-terms] .dsaved{display:none}
.terms h6{margin:28px 0 0;padding-bottom:6px;border-bottom:1px solid var(--ink-20);font:650 var(--fs-sm)/1.3 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--ink)}
.terms h6:first-child{margin-top:8px}
.terms dl{margin:0;max-width:62ch}
.terms dt{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:10px;margin:22px 0 6px;font:500 var(--fs-lead)/1.3 var(--serif);color:var(--ink)}
.terms dt:first-child{margin-top:14px}
.terms dt .fn,.tpop b .fn{font:var(--fs-sm)/1.3 var(--sans);color:var(--ink-2)}
.tpop b .fn{margin-left:8px}
.terms dd{margin:0;font:var(--fs-body)/1.6 var(--sans);color:var(--ink-2)}
.terms dd p{margin:0}
.terms dd .tm{margin-left:8px;padding:0;border:0;background:none;font:var(--fs-sm)/1 var(--mono);color:var(--ink-3);cursor:pointer;vertical-align:baseline}
.terms dd .tm:hover{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.terms .here dt{box-shadow:inset 2px 0 0 var(--ink);padding-left:12px;margin-left:-12px}   /* the bar out in the gutter, the title in line with its meaning */
.terms :is(dd,.tmore) i{font-style:italic;color:var(--ink)}
.terms :is(dd,.tmore) code,.tpop code{padding:1px 4px;border-radius:4px;background:var(--ink-06);font:.84em/1.4 var(--mono);color:var(--ink);overflow-wrap:anywhere}
/* "More": the rest of the meaning, and where the files say it, one click down */
.terms .tmore{margin-top:6px}
.terms .tmore summary{display:inline-flex;align-items:center;gap:6px;padding:2px 0;list-style:none;font:500 var(--fs-sm)/1.4 var(--sans);color:var(--ink-2);cursor:pointer}
.terms .tmore summary::-webkit-details-marker{display:none}
.terms .tmore summary::after{content:"";width:6px;height:6px;margin-top:-2px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);transition:transform .15s}
.terms .tmore[open] summary::after{margin-top:3px;transform:rotate(-135deg)}
.terms .tmore summary:hover{color:var(--ink)}
.terms .tmore p{margin:6px 0 0;font-size:var(--fs-ui);line-height:1.55;color:var(--ink-2)}
.terms .tmore .tfiles{font-size:var(--fs-ui);color:var(--ink-2)}
.terms .tmore .tfk{font-weight:500;color:var(--ink-2)}
/* a glossary word in the player's own text: a dotted underline; a click shows what it means */
.term{text-decoration:underline dotted;text-decoration-color:var(--ink-3);text-underline-offset:3px;cursor:help}
/* a word the viewer knows (D-218: looked up, or its defining scene watched) reads plainly; a click still says what it means */
.term.known{text-decoration:none}
.term:hover,.term:focus-visible{text-decoration-color:var(--ink);outline:none}
.tpop{position:fixed;z-index:40;max-width:min(400px,calc(100vw - 32px));padding:12px 16px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 8px 24px -10px rgba(20,20,19,.3);font:var(--fs-ui)/1.5 var(--sans);color:var(--ink-2);text-align:left;white-space:normal}
.tpop .tl{display:block}
.tpop i{color:var(--ink)}
.tpop[hidden]{display:none}
.tpop b{display:block;margin-bottom:4px;font:400 var(--fs-lead)/1.3 var(--serif);color:var(--ink)}
.tpop .tw{display:block;margin-top:8px;font-size:var(--fs-ui);line-height:1.45;color:var(--ink-2)}
.tpop .tw .lnk{font-size:var(--fs-ui);color:var(--ink);text-decoration:underline;text-underline-offset:2px}
.idg{padding:0 4px;border-radius:4px;background:var(--ink-06);white-space:normal;-webkit-box-decoration-break:clone;box-decoration-break:clone}   /* "D-056 · decision: …" reads as one label inside the sentence */
.handoff .verdict span :is(.term,.idg){display:inline;margin:0;font-size:inherit;color:inherit}
/* "Walk me through it": a quick check's worked example. Open after a wrong answer (the video waits),
   a folded button after a right one. In the band it sits over the frame just above it. */
.decision .walk{margin-top:12px;padding:12px 16px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12);font-size:var(--fs-body);line-height:1.55;color:var(--ink)}
.decision .walk .wt{max-width:62ch}
.decision .walk[hidden],.decision .walkbtn[hidden]{display:none}
/* the row of chips on the frame, where there is no room for it above the controls under the video: first the hint
   goes and "Read why in full" is a chip; then the chips that do not go on fold behind "…" (layoutFrame) */
.decision .rowmore[hidden],.decision:not(.onframe) .rowmore{display:none}
.decision.onframe[data-rowfold] .foot .hint{display:none!important}
.decision.onframe[data-rowfold="2"]:not(.rowopen) [data-folded]{display:none!important}
.decision.onframe [data-folded]{z-index:3;box-shadow:0 0 0 1px var(--ink-20),0 8px 24px -12px rgba(var(--ink-rgb),.35)}
.decision.onframe .rowmore{min-width:clamp(34px,2.8cqw,44px);font-size:clamp(15px,1.2cqw,19px);letter-spacing:.05em}
.decision.onframe.rowopen .rowmore{border-color:var(--ink)}
.decision .walk .wread{display:none}
.decision.onframe .walk[data-short]{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;padding:6px 12px}   /* no room on the frame for its words: one line, and they open in the side panel */
.decision.onframe .walk[data-short] .wk{margin:0}
.decision.onframe .walk[data-short] .wt,.decision.onframe .walk[data-aside]{display:none!important}   /* no room even for that line: the side panel has it */
.decision.onframe .walk[data-short] .wread{display:inline;font:500 clamp(13px,1cqw,16px)/1.3 var(--sans);color:var(--ink-2)}
.decision .walk .wk{display:block;margin:0 0 4px;font:500 var(--fs-xs)/1.3 var(--sans);color:var(--ink-3)}
.decision .walk .wt{margin:0}
.decision.band .walk{position:absolute;left:2.5%;right:2.5%;bottom:calc(100% + 8px);margin:0;max-height:min(60cqw,420px);overflow:auto;font:400 clamp(15px,1.25cqw,20px)/1.45 var(--serif);box-shadow:0 0 0 1px var(--ink-12),0 8px 24px -12px rgba(20,20,19,.3)}
.decision.band .walkbtn{order:12;display:inline-flex;align-items:center;justify-content:center;flex:none;height:clamp(30px,2.4cqw,40px);margin:0;padding:0 clamp(10px,1cqw,16px);border:1px solid var(--ink-20);border-radius:6px;background:none;font:500 clamp(13px,1cqw,16px)/1 var(--sans);color:var(--ink);white-space:nowrap;cursor:pointer}
.decision.band .walkbtn:hover{border-color:var(--ink)}
.decision.band .walkbtn[hidden]{display:none}
.decision.band.folded .walk{display:none}
:is(.stage,.bandroom)>.decision.sheet.band:has(>.walk:not([hidden])){overflow:visible}   /* the band clips its own lines; the walk-through sits above it */
/* the confusion guard: one quiet line over the verdict when most quick checks were missed; it never blocks */
.handoff .guard{margin:0 0 12px;padding:10px 14px;border-left:2px solid var(--accent);font-size:var(--fs-ui);line-height:1.5;color:var(--ink)}
.handoff .guard p{margin:0}
.handoff .guard .gacts{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;margin-top:4px;color:var(--ink-2)}
.handoff .guard .lnk{padding:0;font-size:var(--fs-ui);color:var(--ink);text-decoration:underline;text-underline-offset:3px}
/* ---- Answer in the frame (plan 2026-09-25-answer-in-the-frame) --------------------------------------
   The owner: "why we have a bar below the main video screen … cant we do more gracefully like embed in the
   video itself just like how we click directly in it?" Where the frame draws a card for each option (or each
   choice the agent made), the answer happens on it: the feedback on the cards, your own words in a slot drawn
   beside them, a note on the card you picked, and Continue, Back and Walk me through it as small chips by the
   cards. Nothing sits in a bar under or over the video. The layer is the frame's size and place, laid over it
   (layoutFrame), so what it holds may reach past the frame's edge rather than be cut; the frame keeps its size.
   A frame with no cards keeps the answer bar (the band, above); a phone keeps the bar under the frame. */
.main{position:relative}
:is(.main,.zin)>.decision.sheet.onframe{position:absolute;z-index:6;left:var(--fx,0px);top:var(--fy,0px);right:auto;bottom:auto;width:var(--fw,100%);max-width:none;height:var(--fh,0px);display:none;min-height:0;max-height:none;margin:0;padding:0;border-radius:0;background:none;box-shadow:none;overflow:visible;pointer-events:none;container-type:size;text-align:left}
:is(.main,.zin)>.decision.sheet.onframe.on{display:block}
.decision.onframe :is(.more,.foot,.opts){display:contents}
.decision.onframe .opts:is([data-kind="decision"],[data-kind="multi"],[data-kind="quiz"]){display:none}   /* the options are the frame's cards */
.decision.onframe .own.open .ownbtn{display:none}
.decision.onframe>:is(.q,.reason),.decision.onframe .hd .k,.decision.onframe .crow :is(.cid,.cw){position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important}
.decision.onframe :is(.own,.unclearbtn,.note,.walkbtn,.backbtn,.rowmore,.confirm,.gobtn,.hint,.feedback,.blong,.walk,.disagree,.fwhy,.crow,.opts>.opt,.gflag){position:absolute;margin:0;pointer-events:auto;box-sizing:border-box}
.decision.onframe :is(.own,.unclearbtn,.note,.walkbtn,.backbtn,.rowmore,.confirm,.gobtn,.blong,.walk,.fwhy,.crow,.opts>.opt,.gflag)[hidden],.decision.onframe .note[hidden],.decision.onframe .own[hidden]{display:none}
.decision.onframe .feedback:not([style*="block"]),.decision.onframe.fb-cards .feedback,.decision.onframe .hint:empty,.decision.onframe .disagree:not(.on){display:none!important}
/* the chips: small, clear buttons, in the frame's sans and paper, with one soft lift so they read over it */
.decision.onframe :is(.ownbtn,.unclearbtn,.walkbtn,.backbtn,.rowmore,.gflag,.fold,.reopen,.confirm,.gobtn),.decision.onframe .ownbox button,.decision.onframe .opts[data-kind="call"] .opt,.decision.onframe .crow .cacts button{display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:none;height:clamp(28px,2.3cqw,38px);min-height:0;margin:0;padding:0 clamp(10px,.95cqw,14px);border:1px solid var(--ink-20);border-radius:6px;background:var(--paper);box-shadow:0 1px 2px rgba(var(--ink-rgb),.1),0 4px 12px -8px rgba(var(--ink-rgb),.3);font:500 clamp(13px,1cqw,16px)/1 var(--sans);color:var(--ink);white-space:nowrap;cursor:pointer;pointer-events:auto}
.decision.onframe :is(.ownbtn,.unclearbtn,.walkbtn,.backbtn,.rowmore,.gflag,.fold):hover,.decision.onframe .ownbox button:hover,.decision.onframe .opts[data-kind="call"] .opt:hover,.decision.onframe .crow .cacts button:hover{border-color:var(--ink)}
.decision.onframe :is(.confirm:not(:disabled),.gobtn),.decision.onframe .opts[data-kind="call"] .opt:is([data-verdict="accept"],[data-gaccept]),.decision.onframe .crow .cacts button[aria-pressed="true"][data-sverdict$=":accept"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.decision.onframe .confirm:disabled{opacity:1;color:var(--ink-3)}
.decision.onframe kbd{margin-left:0}
.decision.onframe .opts[data-kind="call"] .opt .key,.decision.onframe .crow .cacts .key{display:inline-grid;place-items:center;width:18px;height:18px;border:1px solid var(--ink-20);border-radius:4px;background:none;font:500 var(--fs-xs)/1 var(--mono);color:inherit}
.decision.onframe .opts[data-kind="call"] .opt b{margin:0;font:inherit}
.decision.onframe .crow{display:flex;align-items:center;gap:6px;padding:0;border:0}
.decision.onframe .crow .cacts{display:flex;gap:6px}
.decision.onframe .crow:not([data-current]) .cacts .key{display:none}
.decision.onframe .crow .cacts button[aria-pressed="true"]:is([data-sverdict$=":flag"],[data-sown],[data-gflag]),.decision.onframe .gflag[aria-pressed="true"]{border-color:var(--accent);color:var(--accent-text);background:var(--paper)}
/* your own words: a card-like slot the player draws beside the cards (or under them, where the frame has no room
   beside), dashed, as a card still to be filled in; opened, it holds the box, as tall as its words up to 2 lines,
   then scrolling inside the same box (ownLines) */
.decision.onframe .own{display:flex;flex-direction:column;gap:6px}
.decision.onframe .own .ownbtn{width:100%;height:auto;min-height:clamp(40px,3.6cqw,56px);justify-content:flex-start;padding:0 clamp(12px,1.2cqw,18px);border:1.5px dashed var(--ink-20);border-radius:8px;box-shadow:none;background:rgba(var(--ink-rgb),.02);font:400 clamp(15px,1.3cqw,21px)/1.2 var(--serif);color:var(--ink-2)}
.decision.onframe .own .ownbtn:hover{border-color:var(--ink-3);color:var(--ink)}
.decision.onframe .own .ownbtn kbd{margin-left:auto}
.decision.onframe .own[data-beside] .ownbtn{height:100%;flex-direction:column;justify-content:center;align-items:flex-start;gap:8px;padding:clamp(12px,1.2cqw,20px)}
.decision.onframe .own[data-beside] .ownbtn kbd{margin-left:0}
.decision.onframe .own.open{padding:clamp(8px,.8cqw,12px);border-radius:8px;background:var(--paper);box-shadow:0 0 0 1.5px var(--ink-20),0 8px 24px -12px rgba(var(--ink-rgb),.35)}
.decision.onframe .own.open .ownbox{display:flex;align-items:flex-start;gap:8px}
.decision.onframe .ownbox textarea{min-height:clamp(34px,2.6cqw,44px);padding:6px 10px;overflow:hidden;font:400 clamp(14px,1.1cqw,18px)/1.35 var(--sans)}
.decision.onframe .own.open .ownhint:not([hidden]){margin:0;font:400 clamp(13px,.95cqw,15px)/1.35 var(--sans);color:var(--ink-2)}
.decision.onframe:has(.own.open) :is(.hint,.unclearbtn,.note,.backbtn,.confirm,.walkbtn){display:none!important}
/* a note on the answer: an underlined field, as wide as its words (fitBand), on the paper */
.decision.onframe .note{padding:0 8px;border-radius:6px;background:var(--paper);box-shadow:0 1px 2px rgba(var(--ink-rgb),.1)}
.decision.onframe .note textarea{padding:7px 0;font:400 clamp(14px,1.05cqw,17px)/1.3 var(--sans)}
.main>.decision.sheet.onframe .foot .hint{position:absolute;width:auto;height:auto;clip:auto;overflow:visible;padding:3px 8px;border-radius:6px;background:var(--paper);font:400 clamp(13px,.95cqw,15px)/1.3 var(--sans);color:var(--ink-3);white-space:normal}
.main>.decision.sheet.onframe .foot .hint[data-live]{color:var(--accent-text)}
/* on each card, once answered: whether it is the answer, and its one line of why, joined to the card's foot */
.decision.onframe .fwhy{padding:clamp(8px,.75cqw,12px) clamp(10px,.95cqw,14px);border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 6px 18px -10px rgba(var(--ink-rgb),.35);font:400 clamp(14px,1.12cqw,19px)/1.35 var(--serif);color:var(--ink);text-wrap:pretty}
.decision.onframe .fwhy::before{content:"";position:absolute;left:18px;top:-5px;width:9px;height:9px;background:var(--paper);transform:rotate(45deg);box-shadow:-1px -1px 0 var(--ink-12)}
.decision.onframe .fwhy b{display:block;margin:0 0 3px;font:500 clamp(12px,.92cqw,15px)/1.3 var(--sans);color:var(--ink-2)}
.decision.onframe .fwhy[data-right="true"]{box-shadow:0 0 0 2px var(--right),0 6px 18px -10px rgba(var(--ink-rgb),.35)}
.decision.onframe .fwhy[data-right="true"]::before{box-shadow:-2px -2px 0 var(--right)}
.decision.onframe .fwhy[data-inside]::before{display:none}   /* laid inside its card's lower part: no pointer */
.decision.onframe .fwhy[data-right="true"] b{color:var(--right);font-weight:600}
.decision.onframe .fwhy[data-right="true"] b::before{content:"\\2713\\00a0"}
.decision.onframe .fwhy[data-chosen="true"]:not([data-right="true"]) b::before{content:"\\2715\\00a0"}
.decision.onframe .fwhy[data-chosen="true"]:not([data-right="true"]){box-shadow:0 0 0 2px var(--ink),0 6px 18px -10px rgba(var(--ink-rgb),.35)}
.decision.onframe .fwhy[data-chosen="true"]:not([data-right="true"])::before{box-shadow:-2px -2px 0 var(--ink)}
.decision.onframe.long .fwhy .wt{display:none}   /* past the window: each card keeps its verdict; the words open in the side panel */
.decision:not(.onframe) .fwhys{display:none}
/* "Expected something else?": on the card you picked, under its why */
.decision.onframe .disagree.on{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;max-width:none;padding:6px 10px 4px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12)}
.decision.onframe .disagree label{font:500 clamp(13px,.95cqw,15px)/1.3 var(--sans)}
.decision.onframe .disagree[data-inrow] textarea{flex:1 1 200px}   /* in the row: the question and the field on one line where they fit */
.decision.onframe .disagree textarea{flex:1 1 100%;padding:5px 0;font:400 clamp(14px,1.05cqw,17px)/1.3 var(--sans)}
.decision.onframe .disagree .kept:not(:empty){margin:0 0 2px;font-size:var(--fs-xs)}
.decision.onframe .feedback,.decision.onframe .blong{max-width:none;margin:0;padding:6px 10px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12);font:400 clamp(15px,1.2cqw,20px)/1.35 var(--serif);color:var(--ink)}
.decision.onframe .blong .lnk{font:inherit;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.decision.onframe .walk{margin:0;padding:clamp(10px,1cqw,16px) clamp(12px,1.2cqw,18px);font:400 clamp(15px,1.2cqw,20px)/1.45 var(--serif);box-shadow:0 0 0 1px var(--ink-12),0 10px 28px -12px rgba(20,20,19,.35)}
/* "Show the frame" sits in the frame's top-right margin; put aside, the question waits there as a pill */
.decision.onframe .hd{position:absolute;right:1.2%;top:2%;display:flex;align-items:center;gap:10px;margin:0;pointer-events:auto}
.decision.onframe.folded>:not(.hd){display:none!important}
.decision.onframe.folded .hd{padding:6px 6px 6px 12px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 2px 10px rgba(var(--ink-rgb),.12)}
.decision.onframe.folded .hd::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;background:var(--accent)}
.decision.onframe.folded .hd .k{position:static!important;width:auto!important;height:auto!important;margin:0!important;clip:auto!important;overflow:hidden!important;text-overflow:ellipsis;max-width:40cqw;font:500 var(--fs-sm)/1.3 var(--sans);color:var(--ink-2)}
.decision.onframe.folded .fold,.decision.onframe:not(.folded) .reopen{display:none!important}
.decision.onframe.folded .reopen{display:inline-flex;height:30px;border:0;border-left:1px solid var(--ink-20);border-radius:0;box-shadow:none;background:none;color:var(--accent-text)}
.stage[data-qcorner] .dchip{top:60px}   /* the question's corner chip owns the top-right; a detail's chip steps down under it */
.stage.overterm{cursor:pointer}   /* over a glossary word in the captions: a click says what it means */
/* on the frame's cards: "More" on each, "Full question" by its heading, and a choice's verdict */
.hits .cmore{position:absolute;z-index:2;display:inline-flex;align-items:center;height:auto;margin:0;padding:3px 9px;border:1px solid var(--ink-20);border-radius:9999px;background:var(--paper);box-shadow:0 1px 2px rgba(var(--ink-rgb),.1);font:500 var(--fs-xs)/1.3 var(--sans);color:var(--ink-2);white-space:nowrap;pointer-events:auto;cursor:pointer;transform:translate(-100%,0)}
.hits .cmore.qmore{transform:translate(0,-50%)}
.hits .cmore:hover,.hits .cmore:focus-visible,.hits .cmore[aria-expanded="true"]{border-color:var(--ink);color:var(--ink);outline:none}
.hits .cmore[hidden]{display:none}
.hits .qhit{position:absolute;display:block;pointer-events:auto;cursor:help;border-radius:6px;background:transparent}
.hits .cring{position:absolute;display:block;border-radius:8px;pointer-events:none}
.hits .cring[data-verdict="accept"]{box-shadow:0 0 0 3px var(--ink)}
.hits .cring:is([data-verdict="flag"],[data-verdict="own"]){box-shadow:0 0 0 3px var(--accent)}
.hits .cring .tag{position:absolute;left:10px;top:0;transform:translateY(-50%);padding:2px 8px;border-radius:4px;background:var(--ink);color:var(--paper);font:500 var(--fs-xs)/1.4 var(--sans);white-space:nowrap}
.hits .cring:is([data-verdict="flag"],[data-verdict="own"]) .tag{background:var(--accent);color:var(--on-accent)}
.hits .cring .tag:empty{display:none}
.hits .qhit[hidden]{display:none}
.hits[data-whys]:not([data-whytags]) .hit .tag{display:none}   /* answered: the why under each card says it */
.hits[data-whytags] .hit[data-chosen="true"]:not([data-right="true"]) .tag:not(:empty)::before{content:"\\2715\\00a0"}   /* no room for the whys by the cards: each verdict is its card's tag */
.hits .cring{pointer-events:auto;cursor:default}
/* the fuller text behind a card or the question: a card by it, on hover (after a moment) or from its "More" */
.fpop{position:fixed;z-index:41;width:max-content;max-width:min(440px,calc(100vw - 32px));padding:12px 14px;border-radius:8px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12),0 10px 28px -10px rgba(20,20,19,.35);color:var(--ink);text-align:left;white-space:normal}
.fpop[hidden]{display:none}
.fpop{overflow:auto;overscroll-behavior:contain}
.fpop[data-under]{z-index:3}   /* nowhere clear of the controls (placeMore): under them, so they stay on top and clickable */
.fpop .fk{display:block;margin:0 0 4px;font:500 var(--fs-xs)/1.3 var(--sans);color:var(--ink-2)}
.fpop b{display:block;margin:0 0 6px;font:400 var(--fs-lead)/1.3 var(--serif);color:var(--ink)}
.fpop p{margin:0 0 6px;max-width:62ch;font:var(--fs-ui)/1.5 var(--sans);color:var(--ink-2)}   /* body text as the Terms panel's: 15 px, --ink-2 */
.fpop p:last-child{margin-bottom:0}
.fpop p.v{font-weight:500;color:var(--ink)}
.fpop dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 12px;margin:0}
.fpop dt{font:500 var(--fs-sm)/1.55 var(--sans);color:var(--ink-2)}
.fpop dd{margin:0;font:var(--fs-ui)/1.5 var(--sans);color:var(--ink-2)}
.fpop code{font:var(--fs-xs)/1.5 var(--mono);overflow-wrap:anywhere}
@media (hover:none){.hits .cmore{padding:6px 12px}}
/* where the pointer hovers, a card's "More" shows while it is on the card (it would sit on the card's own labels
   otherwise); the keyboard reaches it, and on a touch screen it is always there. "Full question" always shows. */
@media (hover:hover){.hits .cmore:not(.qmore):not([data-hover]):not(:focus-visible):not([aria-expanded="true"]){opacity:0}}
.hits .cmore{transition:opacity .12s}
.stage[data-size="narrow"] .hits .cmore{padding:1px 7px;font-size:var(--fs-xs)}   /* a phone's card is small: its "More" takes its corner and no more */
.decision.band .walk{z-index:5}   /* over the frame's cards and their "More" */
/* The guide under the video (D-264). The page carries the open video's guide under the player
   (<reelplanning-guide>); scrolled out of view, the frame becomes a small player that keeps playing: a card in the
   window's bottom-right corner (a slim bar along a phone's foot) with play/pause, the time and the way back up.
   The frame itself is what shrinks: it leaves the page's flow (a placeholder of its size keeps the page where it
   was, so nothing under it moves) and is scaled into the card with a transform, so the video inside keeps its size
   and never lays out again. Its words, cards, marks and chips are the big player's: the small one shows the picture. */
.stageph{display:none;width:100%;aspect-ratio:16/9}
.wrap.mini .stageph{display:block}
.wrap.mini .stage{position:fixed;left:0;top:0;z-index:21;margin:0;transform-origin:0 0;cursor:pointer;box-shadow:none;background:var(--paper)}
/* on its way (to the corner, or back): the paper under it, a 1 px edge and a shadow all the way (setMini draws them at
   the scale it is at), so it never floats bare over the words it passes */
.stage.flying{background:var(--paper)}
.wrap.mini .stage *{pointer-events:none}
.mstill{display:none}
.wrap.mini .mstill:not([hidden]){display:block;position:absolute;inset:0;z-index:4;width:100%;height:100%;box-sizing:border-box;padding:3%;object-fit:contain;background:var(--paper)}   /* paused: the chapter's settled still (syncMiniStill) */
.wrap.mini .stage>:not(.zport):not(.mstill),.wrap.mini .hits,.wrap.mini .dmark,.wrap.mini .markbox{display:none!important}
.stage.flying{z-index:21}   /* on its way back into place: over the page it passes */
/* the record keeps its bar at the window's foot while the guide is read (the small player sits above it, miniGeo):
   pulled up, it covers the guide and the small player, as it covers the frame; Hide (Esc) puts it back */
.wrap.mini.pulled .side{z-index:23}
:host([overlay]) .side{visibility:hidden}   /* the guide's picture full size is over the whole window */
.minibar{position:fixed;left:0;top:0;z-index:20;display:flex;align-items:center;gap:4px;box-sizing:border-box;padding:0 8px 0 6px;background:var(--paper);color:var(--ink);border-radius:12px;box-shadow:0 0 0 1px var(--ink-12),0 18px 40px -18px rgba(20,20,19,.45),0 4px 12px -6px rgba(20,20,19,.18);font:500 var(--fs-sm)/1 var(--sans)}
:host([theme="dark"]) .minibar{box-shadow:0 0 0 1px var(--ink-20),0 18px 40px -18px rgba(0,0,0,.8)}
.minibar[hidden]{display:none}
.minibar .mprog{position:absolute;left:0;right:0;height:2px;background:var(--ink-12);overflow:hidden}
.minibar .mprog>i{display:block;height:100%;width:0;background:var(--ink)}
.minibar button{flex:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:32px;min-width:32px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--ink-2);font:inherit;cursor:pointer}
.minibar button:hover{background:var(--ink-06);color:var(--ink)}
.minibar button:focus-visible{outline:2px solid var(--ink);outline-offset:1px}
.minibar button svg{width:16px;height:16px}
.minibar .mplay{color:var(--ink)}
.minibar .mplay .pz,.minibar .mplay[data-playing="true"] .pl{display:none}
.minibar .mplay[data-playing="true"] .pz{display:block}
.minibar .mtime{flex:none;font-variant-numeric:tabular-nums;color:var(--ink-2);white-space:nowrap}
.minibar .mtime .of{color:var(--ink-3)}
/* a question waiting: said on the chapter's row, in the accent and whole ("A question is waiting · Answer"), not
   squeezed between the time and "Back to the video" (cut to "A" at 280 px); the note itself is read out only */
.minibar .mnote{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.minibar .mup{flex:none}
.minibar .mtime{margin-right:auto}
.mstrip[data-q],.minibar.phone[data-q] .mchap{color:var(--accent-text);text-overflow:clip}
.mstrip .qa,.mchap .qa{white-space:nowrap}
.minibar .mup{margin-left:auto}
.minibar[data-q] .mup{color:var(--accent-text)}
.minibar .mup .s{display:none}
.minibar .mchap{display:none}
.minibar.phone{border-radius:10px;gap:10px;padding:0 6px 0 10px}
.minibar.phone .mthumb{flex:none;width:64px;height:36px;border-radius:4px;box-shadow:0 0 0 1px var(--ink-20)}   /* the picture sits here (the stage, scaled over it): an edge round it */
.minibar.phone .mup .l,.minibar.phone .mtime .of{display:none}
.minibar.phone .mup .s{display:inline}
.minibar.phone .mplay{margin:0 -6px}
.minibar.phone .mtxt{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:3px;line-height:1.2}
.minibar.phone .mchap{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink-3);font-weight:400}
.minibar.phone[data-q] .mtxt{flex:1 0 auto}
.minibar.phone[data-q] .mchap{min-width:max-content;font-weight:500}
.minibar.phone[data-q] .mup .s{display:none}   /* the way back keeps its arrow: the row is the note's */
@media (max-width:379px){.mchap .qa{display:none}}
.minibar:not(.phone) .mthumb{display:none}
.minibar:not(.phone) .mtxt{display:contents}
/* at rest or playing, the small picture names its chapter on a paper strip along its foot (where the captions would
   be: they are 4 px there, so the small player hides them) */
.mstrip{position:fixed;left:0;top:0;z-index:22;box-sizing:border-box;height:24px;padding:4px 10px;background:color-mix(in srgb,var(--paper) 92%,transparent);box-shadow:0 -1px 0 var(--ink-12);color:var(--ink);font:500 13px/16px var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
.mstrip[hidden]{display:none}
:host([overlay]) .minibar,:host([overlay]) .mstrip,:host([overlay]) .wrap.mini .stage{visibility:hidden!important}   /* the guide's picture full size is over it */
@media (hover:none){.minibar button{height:40px;min-width:40px}}
/* the way down to it, beside Plan: the guide under the video */
.transport .guidebtn{font:500 var(--fs-xs)/1 var(--sans);gap:4px;grid-auto-flow:column}
.transport .guidebtn[hidden]{display:none}
.transport .guidebtn::after{content:"";width:5px;height:5px;margin:-3px 0 0 1px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg)}
@media (max-width:600px){.stageph{width:auto;margin:0 -16px}.transport .guidebtn{display:none}}   /* a phone's row has no room for it: the guide's head shows under the player, a short scroll away */
/* a narrow phone (under 420 px): the chapter on a line of its own under the scrubber, in full; play, the time and the
   buttons on the row under it (beside the time it was cut to "Wh…") */
@media (max-width:419px){
  .transport{grid-template-rows:24px 22px 36px;row-gap:2px}
  .transport .nowline{grid-column:1/-1;grid-row:2;height:22px}
  .transport .play,.transport .time,.transport .rgroup{grid-row:3}
  .transport .rgroup{grid-column:3/5;justify-self:end}
  .labels{height:22px}.labels .part{height:22px;line-height:22px}
}
/* a touch screen has no keys to press: no key hints (the words and the buttons stay) */
@media (pointer:coarse){button kbd,.idle .meta .kh,.markbox .k{display:none!important}}
`;

// What this browser keeps of a review, per video, and what it marks watched, are kept per repo: `reelplanning review`
// serves every repo on the same port (8787) by default, and one origin is one localStorage, so two repos' `system`
// videos (or any two videos of the same name) shared their comments, answers and "Watched". bundle-player names the
// repo on the page (the player's `repo` attribute; the guide's <meta name="reelplanning-repo">), and the keys carry it:
// reelplanning@<repo>:annotations:<src>[:…] and rp@<repo>:watched:<video>. A page that names no repo (this repo's own
// dev page) keeps the unscoped keys it always had. Keys written before a page named its repo are left where they are,
// unread: nothing in them says which repo they were (a bundle's src is "system/index.html" in every repo), and another
// repo's are not this page's to move or delete.
// A viewer's own preferences stay the same on every page (KNOWN_KEY, MUTE_KEY, rp:theme, rp:speed, rp:size,
// rp:plan-open, rp:pauseParts, rp:checks, rp:marks): they are about the viewer, not a repo.
const recordKey = (src, repo) => (repo ? `reelplanning@${repo}:annotations:${src}` : `reelplanning:annotations:${src}`);
const watchedPrefix = (repo) => (repo ? `rp@${repo}:watched:` : "rp:watched:");
// a scene's or a chapter's title with its choices counted, not numbered, as the guide says it (templates/guide/guide.js
// plainTitle): "a part over the frame, and choices A8 and A9" → "a part over the frame, and two choices"
const NUM_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const plainTitle = (t) => String(t || "").replace(/\b(?:and )?choices? ([ADm])(\d+)(?: (?:to|and) \1?([ADm]?)(\d+))?(?:,? and ([ADm]\d+))?/g, (m, p, a, p2, b, c) => {
  const n = b != null && (!p2 || p2 === p) ? (/to/.test(m) ? +b - +a + 1 : 2) + (c ? 1 : 0) : 1 + (c ? 1 : 0);
  return `${/^and /.test(m) ? "and " : ""}${n === 1 ? "a choice" : `${n < 13 ? NUM_WORDS[n] : n} choices`}`; });
// what a video watched first gives you, as "Before you watch" says it: plain words, the decisions' numbers in a hover
// (`reel prereqs` writes "decisions D-222, D-224: does the walkthrough test you?; explains “the list”") → { text, ids }
const givesWords = (g) => { const t = String(g || "").trim(), m = /^decisions?\s+((?:D-\d{1,4}(?:,\s*|\s+and\s+)?)+):\s*(.+)$/i.exec(t);
  const x = m ? m[2].replace(/[\s;,]+$/, "") : t; return { text: x ? x.charAt(0).toUpperCase() + x.slice(1) : "", ids: m ? m[1].trim().replace(/,$/, "") : "" }; };
// own words keep their line breaks (Shift+Enter): runs of spaces fold to one, three or more breaks to two
const keepLines = (v) => String(v || "").replace(/\r/g, "").replace(/[^\S\n]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
const MUTE_KEY = "rp:muted:v2";
const SIZE_MIN = 40, SIZE_MAX = 200;   // the video's size: Fit (100), down to 40% of it, or zoomed in to 200% (rp:size)
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// An id the video says (D-056, A12, D1, k3, q2), spelled one way (scripts/lib/terms.mjs has the same two)
const ID_RE = /(?<![\w-])(D-\d{1,4}|[AD]\d{1,3}|[kKqQ]\d{1,2})(?![\w-])/g;
const normId = (id) => { const s = String(id).trim(), d = /^D-(\d+)$/i.exec(s); return d ? `D-${d[1].padStart(3, "0")}` : /^[kq]/i.test(s) ? s.toLowerCase() : s.toUpperCase(); };
const GLOSS_SKIP = new Set(["review"]);
// the words this browser knows (D-218), by key, across videos: looked up (a word's card, its More in Terms) or
// explained by a scene watched to its end; a known word is shown plainly, so new jargon stands out
const KNOWN_KEY = "rp:terms:known";
// a form a word is matched by: three letters or more, or an acronym of two capitals (PR, CI), matched in capitals
const formOk = (w) => (w.length >= 3 || /^[a-z]{2}$/.test(w)) && !GLOSS_SKIP.has(w);   // a glossary word too common in the player's own text to underline every time
// D-127: the words a viewer sees, where the files say another (the glossary's "On screen" column, when it has
// one, wins: plain()). Only what is on screen changes; ids, records and files keep the internal names.
const PLAIN = { call: "choice", calls: "choices", tag: "label", tags: "labels", visible: "you'll notice it", "hard-to-undo": "hard-to-undo", close: "toss-up", deviation: "off-plan change", deviations: "off-plan changes", streak: "accepted in a row", miss: "late fix", misses: "late fixes", part: "chapter", parts: "chapters", beat: "scene", beats: "scenes", "answer band": "answer bar", "grouped beat": "the rest, in one list" };
// "wait" is no longer offered; the label stays so an annotation saved before it was removed still reads.
const KIND = { stroke: "stroke", arrow: "arrow", box: "box", wait: "wait, what?", note: "note", flag: "flag", approve: "approve" };
// An explainer's Finish: three ends instead of Approve and Request changes. The end is the review's
// `verdict` ("done" | "more" | "plan"); `reel record` files it under the explainer and adds nothing to the decision log.
// Explain more and Plan this each say what they would mean for this video: its first suggestion (nextSuggestions), not
// a template; the generic words are only for a video with none.
const lead1 = (s) => s.replace(/^A /, "a ").replace(/^(Go|Explain|Say|Answer|Cover) /, (w) => w.toLowerCase());
const EXPLAINER_ENDS = {
  done: { label: "Done", send: "Send: done", says: () => "You know what you wanted to know. Nothing is rebuilt." },
  more: { label: "Explain more", send: "Send: explain more", says: (n, lead) => lead ? `For instance, ${lead1(lead.text)}.${n ? n === 1 ? " The scene your comment is on is rebuilt too." : ` The scenes your ${n} comments are on are rebuilt too.` : ""}` : n ? `The next version rebuilds the scenes your ${n === 1 ? "comment is" : `${n} comments are`} on, and answers each question you asked.` : "The next version answers each question you asked, a scene each. Leave a comment where it lost you." },
  plan: { label: "Plan this", send: "Send: plan this", says: (n, lead) => lead ? `For instance, ${lead1(lead.text)}. It starts from what you said here; its video leans on this one.` : "A plan starts from what you said here, quoted in its problem; its video leans on this one." },
};
// a comment that asks for something ("should run on a timer", "make it retry") read as what a plan would do
const DOING = /^(?:make|add|let|move|split|drop|keep|stop|run|show|turn|give|allow|support|fix|change|remove|rename|replace|write|build|cache|check|retry|limit|merge|cut|send|save|store|track|log|warn|ask|test|measure|compare|speed|put|use|read|file|open|close|start|end|clear|clean|say|name|list|tell|mark|sort|group|hide|link|count|wake|notify|poll|queue|lock|expire|pin|mask|explain|document|record|keep)\b/i;
const WANTING = /^(?:(?:i think )?we (?:should|could|need to|want to|must)|(?:it |this )?(?:should|could|needs? to|must)(?: be able to)?|i(?:'d| would)? (?:want|like) (?:to|it to)|can we|could we|let'?s|maybe|please|why not)\s+/i;
// The panel's label for a detail's kind; the kind is a free word (D-085), shown as written when it has no label here.
// What opens is a part of the guide, whatever template it was started from; the kind follows "Guide" in the panel's header ("Guide · Table · step 2"), and a part made as the guide's own says "Guide".
const DETAIL_KIND = { explore: "Explore", try: "Try it", evidence: "Evidence", table: "Table", code: "Code", fresh: "", guide: "" };
const detailKindLabel = (k) => ["Guide", k in DETAIL_KIND ? DETAIL_KIND[k] : k ? String(k).replace(/[-_]+/g, " ").replace(/^./, (c) => c.toUpperCase()) : ""].filter(Boolean).join(" · ");
// The plan's own Markdown, as far as a plan uses it — paragraphs, lists (one level
// of nesting), bold, inline code, fenced code; a heading inside a step reads as a bold line, and a
// link as its words. Everything is escaped first, so the only tags on the page are the ones written here.
const mdInline = (s) => {
  const codes = [];
  let h = esc(s).replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  h = h.replace(/\[([^\]]+)\]\([^)\s]*\)/g, "$1").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*\w])\*(?=\S)([^*]+?)\*(?![*\w])/g, "$1<i>$2</i>");   // *italic*: a step's "*Needs step 2.*" line
  return h.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
};
const mdToHtml = (src) => {
  const out = []; let para = [], list = null, fence = null;
  const flushP = () => { if (para.length) out.push(`<p>${mdInline(para.join(" "))}</p>`); para = []; };
  const flushL = () => { if (list) out.push(`<${list.tag}>${list.items.map((it) => `<li>${mdInline(it.text)}${it.sub.length ? `<ul>${it.sub.map((x) => `<li>${mdInline(x)}</li>`).join("")}</ul>` : ""}</li>`).join("")}</${list.tag}>`); list = null; };
  for (const raw of String(src || "").replace(/\r/g, "").split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (fence) { if (/^\s*```/.test(line)) { out.push(`<pre><code>${esc(fence.join("\n"))}</code></pre>`); fence = null; } else fence.push(raw); continue; }
    if (/^\s*```/.test(line)) { flushP(); flushL(); fence = []; continue; }
    if (!line.trim()) { flushP(); flushL(); continue; }
    const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (m) {
      flushP();
      const tag = /\d/.test(m[2]) ? "ol" : "ul";
      if (m[1].length >= 2 && list?.items.length) { list.items.at(-1).sub.push(m[3]); continue; }
      if (list && list.tag !== tag) flushL();
      list ||= { tag, items: [] }; list.items.push({ text: m[3], sub: [] }); continue;
    }
    const hd = /^#{1,6}\s+(.*)$/.exec(line);
    if (hd) { flushP(); flushL(); out.push(`<p><b>${mdInline(hd[1])}</b></p>`); continue; }
    if (list && /^\s/.test(raw)) { const it = list.items.at(-1); if (it.sub.length) it.sub[it.sub.length - 1] += ` ${line.trim()}`; else it.text += ` ${line.trim()}`; continue; }
    flushL(); para.push(line.trim());
  }
  if (fence) out.push(`<pre><code>${esc(fence.join("\n"))}</code></pre>`);
  flushP(); flushL(); return out.join("");
};

// ---- a glossary meaning, for the viewer (the Terms panel, a word's card) ---------------------------------------
// Code in a meaning: a `span`, or, in an older plan map (its backticks taken out), a file, folder, element,
// attribute, heading or command written bare. scripts/lib/terms.mjs has the same test and the same split.
const CODEISH = /`[^`]+`|(?:^|[\s("'])(?:~?[\w.<>*-]*[\w>*]\/[\w.<>\/*-]*|[\w<>*-]+\.(?:md|json|jsonl|mjs|js|sh|html|css|png|txt)\b|<[a-z][\w-]*>|data-[\w-]+=|#{2,}\s|--[a-z][\w-]*|reel(?:planning)? (?:review|build|record|status|memory|retro|setup)\b)/i;
// the same words written bare, to be shown as code where an older map lost the backticks
const BARE_CODE = /(^|[\s("'])((?:~?[\w.<>*-]*[\w>*]\/[\w.<>\/*-]*|[\w<>*-]+\.(?:md|json|jsonl|mjs|js|sh|html|css|png|txt)\b|<[a-z][\w-]*>|data-[\w-]+="[^"]*"|#{2,} [\w ]+?(?= in )|--[a-z][\w-]*|reel(?:planning)? (?:review|build|record|status|memory|retro|setup)\b(?: <[\w-]+>)?))/gi;
const codeBare = (s) => String(s || "").replace(BARE_CODE, (all, pre, tok) => { const tail = /[.,;:]+$/.exec(tok)?.[0] || ""; return `${pre}\`${tok.slice(0, tok.length - tail.length)}\`${tail}`; });
// A meaning split for the viewer (splitMeaning in scripts/lib/terms.mjs, kept alike): `said`, in plain words,
// and `files`, where the files say it: a parenthesis holding code, and a name in code the meaning starts with.
// A first sentence that only says the row's word again ("The answer bar.") goes.
const splitMeaning = (md, names = []) => {
  const files = [], bare = (x) => String(x || "").toLowerCase().replace(/[`*_.:;!?]/g, "").replace(/^(the|an?)\s+/, "").trim();
  let t = String(md || "").replace(/\s+/g, " ").trim();
  t = t.replace(/\s*\(([^()]*)\)/g, (all, inner) => (CODEISH.test(inner) ? (files.push(inner.trim()), "") : all));
  const pre = /^(`[^`]+`|<[a-z][\w-]*>|reel(?:planning)? [a-z-]+|[^\s:;,]+)\s*[:;,]\s+/i.exec(t);
  if (pre && CODEISH.test(pre[1])) { files.unshift(pre[1]); t = t.slice(pre[0].length); }
  t = t.replace(/\s+([,;:.])(?=\s|$)/g, "$1").trim();
  if (t && !/[.!?]$/.test(t)) t += ".";
  if (!/^\S*[-/.<`]/.test(t)) t = t.charAt(0).toUpperCase() + t.slice(1);   // "check-details, run by…" and code keep their case
  const first = /^(.+?[.!?])\s+(?=[A-Z*"“`(<~])/.exec(t);
  if (first && names.some((n) => n && bare(first[1]) === bare(n))) t = t.slice(first[0].length);
  return { said: t, files };
};
// A meaning's clauses in order, each with its sentence: split after "; " or ": " and between sentences, never
// inside a parenthesis or a code span
const clausesOf = (s) => {
  const out = []; let depth = 0, tick = false, start = 0, sent = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "`") { tick = !tick; continue; }
    if (tick) continue;
    if (c === "(") depth++; else if (c === ")") depth = Math.max(0, depth - 1);
    else if (!depth && s[i + 1] === " ") {
      const end = /[.!?]/.test(c) && /[A-Z*"“`(<~]/.test(s[i + 2] || "") && !/(?:\bvs|\be\.g|\bi\.e)\.$/.test(s.slice(Math.max(0, i - 4), i + 1));
      if (c === ";" || c === ":" || end) { out.push({ t: s.slice(start, i + 1).trim(), sent }); if (end) sent++; start = i + 2; }
    }
  }
  if (start < s.length) out.push({ t: s.slice(start).trim(), sent });
  return out.filter((c) => c.t);
};
// What the panel shows of a meaning: its first plain sentence, or two short ones (a long one up to a "; "),
// never a clause with code while there is a plain one before it; the rest goes behind "More".
const leadOf = (said) => {
  const cs = clausesOf(said); if (!cs.length) return { lead: "", more: "" };
  const lead = [cs[0]]; let len = cs[0].t.length, i = 1;
  if (!CODEISH.test(cs[0].t)) for (; i < cs.length; i++) {
    const c = cs[i]; if (CODEISH.test(c.t)) break;
    const next = c.sent !== lead.at(-1).sent;
    if (next ? lead.at(-1).sent > cs[0].sent || len >= 90 || len + c.t.length > 200 : len >= 50 && len + c.t.length > 200) break;
    lead.push(c); len += c.t.length + 1;
  }
  const rest = cs.slice(i).map((c) => c.t).join(" ");
  return { lead: lead.map((c) => c.t).join(" ").replace(/[;:,]$/, "."), more: rest && !/^\S*[-/.<`]/.test(rest) && !CODEISH.test(rest.split(" ").slice(0, 2).join(" ")) ? rest.charAt(0).toUpperCase() + rest.slice(1) : rest };
};

export class ReelplanningPlayer extends HTMLElement {
  static get observedAttributes() { return ["src", "plan-map", "runtime-src"]; }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.annotations = [];
    this.tool = null;
    this.planMap = null;
    this._drawing = null;
    this._lastT = 0;
    this._maxT = 0;
    this._firstPlayAt = null;
    this.decisions = {};      // decisionId -> { option, t, decidedAt }
    this._pendingDecision = null;
    this._skipUntil = null;   // { from, to }: when playhead enters [from,…) jump to `to`
    this.quizzes = {};        // quizId -> { answer, correct, t }
    this.autonomy = {};       // autonomyId -> { verdict: 'accept'|'flag', t }
    this.level = null;        // knowledge level, when the plan map has levels
    this._notice = null;      // a transient message appended to the status line
    this.detailsOpened = [];  // details: { name, openedAt, seconds } per opening (watch.details)
    this.moments = [];        // D-005: where the reviewer went back or slowed down — { kind, t, from?, rate?, planStep, frameIndex }
  }
  connectedCallback() {
    if (!this.shadowRoot.childElementCount) this.render(); this.scheduleLoad(); this.reachClaude(); this.reachLocal(); this.reachSample();
    // the line after Send asks its server only while the tab is shown
    if (!this._onVis) { this._onVis = () => { if (document.hidden) this.stopWorkPoll(); else this.pollWork(true); }; document.addEventListener("visibilitychange", this._onVis); }
    // "Before you watch" says what is true now: a video watched in another tab (its mark, written there), or this page
    // shown again from the back-forward cache after a row's link was followed and that video watched
    if (!this._onWatched) {
      this._onWatched = (e) => { if (e.type === "pageshow" ? e.persisted : String(e.key || "").startsWith(this.watchedKey(""))) this.renderBefore(); };
      addEventListener("storage", this._onWatched); addEventListener("pageshow", this._onWatched);
    }
  }
  disconnectedCallback() { if (this._onVis) { document.removeEventListener("visibilitychange", this._onVis); this._onVis = null; } if (this._onWatched) { removeEventListener("storage", this._onWatched); removeEventListener("pageshow", this._onWatched); this._onWatched = null; } this.stopWorkPoll(); clearInterval(this._workTick); }
  // Where this page is hosted as an Artifact, it can hand the review straight to Claude instead of
  // asking the reviewer to carry it. Nowhere else can — a file:// page, a python http.server, an
  // iframe in a docs site all resolve null — so this is asked for once, early, and the panel is
  // built from whatever came back by the time the reviewer exports. It never blocks anything:
  // the two commands are always there, and the Send block appears on top of them if it can.
  reachClaude() {
    if (this._claudeDb !== undefined) return this._claudeDb;
    this._claudeDb = null;
    this.reachViewer();
    this._claudeReady = (async () => {
      try { this._claudeDb = (await window.claude?.use?.("db")) || null; } catch { this._claudeDb = null; }
      // the panel may already be open and showing only the manual path
      if (this._claudeDb && !this.$(".handoff")?.hidden) this.showHandoff({ finishing: this._finishing });
      if (this._claudeDb && this._work?.via === "hosted") this.pollWork(true);
      return this._claudeDb;
    })();
    return this._claudeReady;
  }
  // Who sends a hosted review, for the record (memory: the filed review's `recorded.reviewer`): the
  // viewer's opaque id in this organization and whether they own the page, from the `user` capability,
  // declared beside `db` at publish. Only the id is kept, never a name. Where it is absent (not
  // declared, not served, no identity here) the row carries no `viewer` and intake falls back to git's
  // user.email. Asked once, early, with the db; a send waits for it a moment at most (sendToClaude).
  reachViewer() {
    if (this._viewerReady) return this._viewerReady;
    this._viewer = null;
    this._viewerReady = (async () => {
      try {
        const user = await window.claude?.use?.("user"); if (!user) return null;
        const [id, owner] = await Promise.all([user.id?.(), user.isOwner?.()]);
        const known = typeof id === "string" && id ? id : null;
        this._viewer = known || owner === true ? { id: known, owner: owner === true } : null;
      } catch { this._viewer = null; }
      return this._viewer;
    })();
    return this._viewerReady;
  }
  // Served by `reelplanning review` (localhost), the page's own server takes the review: the Finish
  // panel says what will happen to it (from GET /api/review, asked again each time the panel opens,
  // since a session may have started meanwhile), and its Send POSTs the same row the hosted page
  // writes to its store to /api/review; the server files it in the repo for the waiting session or a
  // fresh agent run. Only on a page the review server marked as its own (a meta tag it adds to the top page), and only when the endpoint answers: a plain
  // static server (python's, a file:// page) is never asked, so it logs no 404.
  isLocalPage() { try { return location.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(location.hostname); } catch { return false; } }
  reachLocal() {
    if (this._localReady) return this._localReady;
    this._localApi = null;
    const served = (() => { try { return !!document.querySelector('meta[name="reelplanning-review-server"]'); } catch { return false; } })();
    this._localReady = !this.isLocalPage() || !served ? Promise.resolve(null) : this.getLocal().then((j) => (this._localApi = j));
    return this._localReady;
  }
  // GET /api/review: what the review server will do with a review, or null where it does not answer
  async getLocal() {
    try {
      const r = await fetch(new URL("/api/review", location.origin), { headers: { accept: "application/json" }, cache: "no-store" });
      const j = r.ok ? await r.json() : null; return j?.ok ? j : null;
    } catch { return null; }
  }
  // ask again what the server will do with a review, then show it if the panel is open
  async refreshLocal() {
    if (!(await this.reachLocal())) return;
    const j = await this.getLocal(); if (j) this._localApi = j;
    if (!this.$(".handoff").hidden && !this._posted) this.showHandoff({ finishing: this._finishing });
  }
  // What sending will do, in one quiet line, before it is sent: GET /api/review's { sessionWaiting, agentCommand },
  // and, where Claude Code's sandbox cannot run on this machine, why (`unsandboxed`): the run goes ahead without the sandbox.
  localNext() {
    const a = this._localApi || {};
    return a.sessionWaiting ? "Your open session picks this up."
      : a.agentCommand ? `No session is open: <code>${esc(a.agentCommand)}</code> starts on it${a.unsandboxed ? `, without Claude Code's sandbox (${esc(a.unsandboxed)}): its shell commands aren't fenced to the repo` : ""}.`
      : "Saved for your next session.";
  }
  localBlock() {
    const v = this.verdict;
    return `<div class="send">
      <div class="row"><input data-send-note placeholder="Anything your agent should know first (optional)" aria-label="A note for your agent (optional)"><button class="sendbtn" data-act="send-local">${this.isExplainer && EXPLAINER_ENDS[v] ? EXPLAINER_ENDS[v].send : v === "approve" ? "Send your approval" : v === "changes" ? "Send your changes" : "Send this review"}</button></div>
      <p class="fine next" data-next>${this.localNext()}</p>
    </div>`;
  }
  async postLocal() {
    if (this._claudeDb || !(await this.reachLocal())) return;   // hosted: Send is the act; no server: the download is
    const review = this.exportPayload(), body = this.reviewRow(review, this.$("[data-send-note]")?.value.trim() || ""); delete body.id;
    // pressing Send again with nothing new sends nothing new (one review must not start two runs)
    const what = this.reviewSig(review);
    if (this._posted?.what === what && this._posted.state !== "failed") return;
    this._posted = { state: "sending", verdict: review.verdict, what };
    if (!this.$(".handoff").hidden) this.showHandoff({ finishing: this._finishing });
    try {
      const r = await fetch(new URL("/api/review", location.origin), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.ok) throw new Error(j?.error || String(r.status));
      this._posted = { state: "sent", verdict: review.verdict, what, id: j.id || null, path: j.path || "", message: j.message || "" };
      // this round is over, as after a hosted Send: a rebuilt video starts the next one clean
      try { localStorage.setItem(this.rkey + ":round", JSON.stringify({ sentAt: review.exportedAt, id: j.id || null, sig: this.buildSig() })); } catch {}
      if (j.id) this.startWork({ id: j.id, via: "local", verdict: review.verdict, handledBy: j.handledBy || null });
      this.status("sent to the repo — no download needed"); this.markWatched("sent");
    } catch { this._posted = null; }   // quietly: the download and the commands are still there
    this.syncResend();
    if (!this.$(".handoff").hidden) this.showHandoff({ finishing: this._finishing });
  }
  // what a send carries, to tell whether anything in the review changed since the last one
  reviewSig(review = this.exportPayload()) { return JSON.stringify([review.annotations, review.decisions, review.quizzes, review.autonomy, review.verdict]); }
  postedBlock() {
    const p = this._posted;
    if (p.state === "sending") return '<div class="send done"><p class="sent">Sending your review to the repo…</p></div>';
    // anything added or changed since the send (a comment, a mark, an answer, the verdict) can be sent
    // too, as a new row: the inbox keys a row by its submittedAt, so it is a new review, not a repeat
    const now = this.exportPayload(), what = now.verdict !== p.verdict ? "Your verdict changed" : "Your review changed";
    const later = this.reviewSig(now) !== p.what ? `<p class="sent state">${what} after it was sent. <button class="lnk" data-act="send-local">Send the change</button></p>` : "";
    return `<div class="send done"><p class="sent"><strong>Sent to the repo.</strong> ${esc(p.message ? p.message.charAt(0).toUpperCase() + p.message.slice(1) : "Your agent picks it up from there")}.</p>${later}${p.path ? `<span class="sent id">${esc(p.path)}</span>` : ""}</div>`;
  }
  // ---- after Send: the review being worked on ---------------------------------
  // From Send until the round ends, a line above the frame says where the review is (waiting, being worked on, done,
  // stopped), with the time since Send and a quiet pulse while it runs. Local: GET /api/review/status?id=, every few
  // seconds while the tab is shown. Hosted: the row's own status (watchReview). Done with the video rebuilt (the served
  // plan map's build signature is not the one sent from) opens "The new version is ready": reloading starts the next
  // round, in just the changes. Kept per video beside :round (":working"), so it survives a reload and a closed panel.
  workKey() { return this.rkey + ":working"; }
  expectsVideo(v) { return v === "changes" || v === "more"; }   // Request changes, Explain more: the video is rebuilt
  startWork({ id, via, verdict = null, handledBy = null }) {
    this.stopWorkPoll(); this.closeReady();
    this._work = { id, via, verdict, handledBy, sig: this.buildSig(), sentAt: Date.now(), state: "waiting", by: null, step: null };
    this.saveWork(); this.renderWork(); this.pollWork(true);
  }
  saveWork() { try { if (this._work) localStorage.setItem(this.workKey(), JSON.stringify(this._work)); else localStorage.removeItem(this.workKey()); } catch {} }
  // on load: carry on following a review sent from this build; one sent from an earlier build has had its round
  // (the video was rebuilt since, and the revised line and just the changes take it from there)
  resumeWork() {
    this.stopWorkPoll(); this.closeReady();
    let w = null; try { w = JSON.parse(localStorage.getItem(this.workKey()) || "null"); } catch {}
    if (w && (!w.id || w.sig !== this.buildSig())) { try { localStorage.removeItem(this.workKey()); } catch {} w = null; }
    this._work = w; this.renderWork(); this.pollWork(true);
  }
  // nothing more will change: stopped, or done (unless a waiting session marked it done before its new video is up)
  workSettled() { const w = this._work; return !w || ["stopped", "ready", "reload"].includes(w.state) || (w.state === "done" && !w.making); }
  stopWorkPoll() { clearTimeout(this._workT); this._workT = null; }
  pollWork(now = false) {
    this.stopWorkPoll();
    const w = this._work; if (!w || this.workSettled()) return;
    if (w.via === "hosted") { if (this._claudeDb && this._watching !== w.id) this.watchReview(w.id); return; }
    if (document.hidden) return;   // asked again when the tab is shown
    this._workT = setTimeout(() => this.askWork(), now ? 0 : (this._workMs || 3000));
  }
  async askWork() {
    this._workT = null;
    const w = this._work; if (!w || w.via !== "local") return;
    let j = null, gone = false;
    try {
      const r = await fetch(new URL(`/api/review/status?id=${encodeURIComponent(w.id)}`, location.origin), { headers: { accept: "application/json" }, cache: "no-store" });
      gone = r.status === 404; j = r.ok ? await r.json() : null;
    } catch {}
    if (this._work !== w) return;   // dismissed, or another video, meanwhile
    if (gone) { this.dismissWork(false); return; }   // this server has no such review: nothing to follow
    if (j?.ok) this.applyWork(j);
    if (!this._workT) this.pollWork();
  }
  applyWork(s) {
    const w = this._work; if (!w) return;
    const rebuilt = s.build != null && w.sig != null && s.build !== w.sig;
    Object.assign(w, { state: s.state, by: s.by ?? w.by ?? null, step: s.step || null, built: rebuilt, making: false, ...(s.log ? { log: s.log } : {}), ...(s.error ? { error: String(s.error) } : {}) });
    if (s.state === "done") {
      if (w.via === "hosted") w.state = this.expectsVideo(w.verdict) ? "reload" : "done";   // the page cannot see a republish coming
      else if (rebuilt) w.state = "ready";
      // a waiting session marks a review done as it hands the revise to a worker: its new video can come after
      else w.making = w.by === "session" && this.expectsVideo(w.verdict);
    }
    this.saveWork(); this.renderWork();
    if (w.state === "ready" && !w.told) { w.told = true; this.saveWork(); this.showReady(); }
  }
  workText(w) {
    const hosted = w.via === "hosted", who = hosted ? "Claude" : "your agent", Who = hosted ? "Claude" : "Your agent";
    const step = w.step || (w.built ? "the new video is built" : "");
    switch (w.state) {
      case "waiting": return !hosted && w.handledBy === "inbox" ? "Saved in the repo: your next agent session picks it up" : `Waiting for ${who} to pick it up`;
      case "working": return `${Who} is working on your review${step ? ` — ${step}` : ""}`;
      case "ready": return "Done: the new version is ready";
      case "reload": return "Done — reload to watch the new version";
      case "done": return w.making ? `Recorded. ${Who} is making the new video` : "Done: recorded, no new video";
      case "stopped": return hosted ? `${Who} could not finish it${w.error ? ` — ${w.error}` : ""}. The commands under Finish still work.`
        : `The run stopped before it finished: its log is ${w.log || `.reelplanning/inbox/runs/${w.id}.log`}`;
      default: return String(w.state || "");
    }
  }
  renderWork() {
    const box = this.$?.(".working"); if (!box) return;
    const w = this._work, on = !!w, wrap = this.$(".wrap");
    if (box.hidden === on || wrap.classList.contains("working-on") !== on) { box.hidden = !on; wrap.classList.toggle("working-on", on); this.placePlan?.(); }
    clearInterval(this._workTick); this._workTick = null;
    if (!w) { this.closeReady(); return; }
    const live = !this.workSettled();
    box.dataset.wstate = w.state; box.dataset.live = live ? "1" : "0";
    const text = this.workText(w), t = box.querySelector(".wtext");
    if (t.textContent !== text) t.textContent = text;   // only a change is read out (the line is polite-live)
    const btns = w.state === "ready" ? '<button data-act="ready-watch">Watch what changed</button>' : w.state === "reload" ? '<button data-act="work-reload">Reload</button>' : "", b = box.querySelector(".wbtns");
    if (b.innerHTML !== btns) b.innerHTML = btns;
    const time = box.querySelector(".wtime"), mins = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.floor(s % 3600 / 60)} min` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
    const tick = () => { time.textContent = live ? mins(Date.now() - (w.sentAt || Date.now())) : ""; time.title = live ? "Time since you sent it" : ""; };
    tick(); if (live) this._workTick = setInterval(() => (this._work === w ? tick() : clearInterval(this._workTick)), 1000);
  }
  showReady() {
    const pop = this.$(".wready"); if (!pop) return;
    pop.hidden = false;
    // the way to it takes the keyboard, unless the reviewer is typing
    const a = this.shadowRoot.activeElement, typing = a && (/^(TEXTAREA|INPUT|SELECT)$/.test(a.tagName) || a.isContentEditable);
    if (!typing) pop.querySelector('[data-act="ready-watch"]').focus({ preventScroll: true });
  }
  closeReady() {
    const pop = this.$?.(".wready"); if (!pop || pop.hidden) return false;
    const had = pop.contains(this.shadowRoot.activeElement);
    pop.hidden = true; if (had) this.focus();
    return true;
  }
  dismissWork(focus = true) {
    this.stopWorkPoll(); this._work = null; this.saveWork(); this.renderWork();
    if (focus) this.focus();
  }
  // the reload that starts the next round: newRoundIfRebuilt and just the changes take it from there
  reloadForNew() { try { location.reload(); } catch {} }
  attributeChangedCallback() { if (this.isConnected && this.shadowRoot.childElementCount) this.scheduleLoad(); }
  scheduleLoad() { if (this._loadQueued) return; this._loadQueued = true; queueMicrotask(() => { this._loadQueued = false; this.load(); }); }

  get src() { return this.getAttribute("src") || ""; }
  // the repo this page's videos belong to (bundle-player's `repo`), and the keys this review is kept under in it
  get repo() { return (this.getAttribute("repo") || "").trim(); }
  get rkey() { return recordKey(this.src, this.repo); }
  watchedKey(slug) { return watchedPrefix(this.repo) + slug; }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div class="wrap">
        <div class="main">
          <div class="revised" hidden><span class="what"></span><span class="mode"></span><button data-act="only" class="onlybtn"></button></div>
          <div class="workbox"><div class="working" hidden role="status" aria-live="polite"><span class="wdot" aria-hidden="true"><i></i><i></i><i></i></span><span class="wtext"></span><span class="wtime" aria-hidden="true"></span><span class="wbtns"></span><button class="wx" data-act="work-dismiss" title="Dismiss: stop following this review here" aria-label="Dismiss">&times;</button></div><div class="wready" hidden role="dialog" aria-label="The new version is ready" aria-describedby="rp-wready-sub"><p>The new version is ready</p><p class="sub" id="rp-wready-sub">Your agent rebuilt the video after your review.</p><div class="acts"><button class="primary" data-act="ready-watch">Watch what changed</button><button data-act="ready-later" title="Close this (Esc); the line above the video keeps the way back">Later</button></div></div></div>
          <div class="stage" data-tool="">
            <div class="zport"><div class="zin">
            <hyperframes-player></hyperframes-player>
            <canvas class="overlay" width="1920" height="1080"></canvas>
            <div class="hits" hidden role="group" aria-label="The options on the frame"></div>
            <div class="dmark" hidden><button class="dhit" data-act="dmark-open" tabindex="-1"><em class="dtab" aria-hidden="true"><span class="dtl">More in the guide</span><i class="dgl">↓</i></em></button></div>
            <div class="markbox" hidden><div class="row"><textarea data-markword rows="1" maxlength="280" placeholder="Your note, a question, or a suggested edit…" aria-label="Your words for this mark — Enter saves them, Esc closes and keeps them, × deletes them"></textarea><button class="x trash" type="button" data-marktrash hidden title="Delete this mark — U puts it back" aria-label="Delete this mark"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.5h6.6L12 4M6.8 6.5v4.5M9.2 6.5v4.5"/></svg></button><button class="x" type="button" data-markdiscard title="Delete these words (the mark stays)" aria-label="Delete these words">×</button></div><span class="k"><kbd>Enter</kbd> saves · <kbd>Esc</kbd> closes (kept) · <kbd>×</kbd> deletes</span></div></div></div>
            <div class="idle"><div class="before" hidden role="region" aria-label="Before you watch"></div><button class="go" data-act="poster-play" hidden aria-label="Play (space)" title="Play (space)"></button><span class="meta">Loading the video…</span></div>
            <div class="decision sheet" role="dialog" aria-label="Decision"><div class="hd"><span class="k"></span><button class="fold" data-act="fold" title="Fold the question away so you can see the frame it is about — it stays unanswered">Show the frame</button><button class="reopen" data-act="unfold">Still to answer</button></div><p class="q"></p><div class="reason" hidden></div><div class="opts"></div><div class="more"><div class="own" hidden><button class="ownbtn" data-act="own" title="Type your own answer instead of picking one (O) — Esc cancels">Answer in my own words <kbd>O</kbd></button><div class="ownbox"><textarea rows="2" placeholder="Your answer — Enter saves it"></textarea><button data-act="own-save">Save</button></div><p class="ownhint" hidden>Your words become an instruction: the agent changes the code to match.</p></div><button class="ownbtn unclearbtn" data-act="unclear" hidden title="Not ready to answer: ask for this to be explained better, with examples (?) — the note, if any, says what is unclear. It is never counted as a decision.">Explain this more <kbd>?</kbd></button><div class="note" hidden><textarea rows="1" data-note maxlength="400" placeholder="Add a note to this answer (optional)" aria-label="A note to go with your answer (optional) — Enter keeps it, Shift+Enter starts a new line" title="A few words that clarify your answer — they go with it, they are not a second answer"></textarea></div></div><div class="feedback"></div><p class="blong" hidden></p><div class="walk" hidden role="note"><span class="wk">Walk me through it</span><p class="wt"></p><button class="lnk wread" data-act="walk-read" title="The walk-through in the side panel; closing it brings this back">Read it in the side panel</button></div><div class="fwhys" aria-live="polite"></div><div class="disagree"><label for="rp-disagree">Expected something else?</label><textarea id="rp-disagree" rows="1" data-disagree maxlength="400" placeholder="Say how it should work — Enter saves" title="The quick check itself is wrong or not how you expected it to work: your words go to the agent with your answer (Shift+Enter starts a new line)" autocomplete="off"></textarea><p class="kept" role="status"></p></div><div class="foot"><button data-act="walk" class="walkbtn" hidden title="A worked example of what this quick check tests">Walk me through it</button><button data-act="quiz-back" class="backbtn" hidden title="Take the video back to where this was explained; the question waits here again when the video reaches it">Back to where this was explained</button><button data-act="rowmore" class="rowmore" hidden aria-expanded="false" title="The other buttons for this question: there is no room on the frame for all of them">…</button><button data-act="confirm" class="confirm" hidden disabled>Confirm <kbd>&#8629;</kbd></button><button data-act="quiz-go" class="gobtn" hidden title="Go on now (space or Enter)">Continue <kbd>Space</kbd></button><span class="hint"></span></div></div>
            <div class="chend sheet" role="dialog" aria-label="End of chapter"><div class="hd"><span class="k"></span></div><p class="q"></p><div class="foot"><button data-act="ch-next" title="Next chapter (N)">Next chapter <kbd>N</kbd></button><button data-act="ch-stay" class="lnk">Stay here</button><span class="hint">Stopping because "Pause between chapters" is on, under Steps.</span></div></div>
            <img class="mstill" alt="" hidden>
            <div class="partcard" role="status" aria-live="polite" aria-hidden="true"><span class="k"></span><span class="sep">·</span><span class="t"></span></div>
            <button class="dchip" data-act="detail-open" hidden><b>Open</b><span class="dt"></span><kbd>O</kbd></button>
            <div class="szgrip" aria-hidden="true" title="Drag to resize the video, outward to zoom in — double-click for Fit"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M11 4L4 11M11 7.5L7.5 11"/></svg></div>
          </div>
          <div class="stageph" aria-hidden="true"></div>
          <div class="bandroom"></div>
          <div class="transport">
            <div class="scrub" title="Seek — click or drag, or &larr; / &rarr; 5 s · N / P or Shift+&rarr; / Shift+&larr; jump a chapter · click a question's mark to open it, or your comment's to go to it (V shows or hides them)"></div>
            <button data-act="play" class="play" data-playing="false" title="Play or pause (space)">Play</button>
            <span class="time"><span class="now">0:00</span><span class="of"> / <span class="dur">0:00</span></span></span>
            <div class="nowline"><div class="labels"></div><p class="status"></p></div>
            <div class="rgroup">
              <button data-act="mute" class="mute ib" aria-pressed="false" title="Mute (M)" aria-label="Mute (M)"></button>
              <div class="speed"><button data-act="speed" class="spbtn ib" aria-expanded="false" aria-haspopup="true" title="Playback speed — click to drag, or [ and ]" aria-label="Playback speed"><span class="x">1&times;</span></button>
                <div class="sppop" hidden><span class="lbl">Speed</span><span class="track"><input type="range" min="0.5" max="3" step="0.25" value="1" data-speed list="rp-speeds" aria-label="Playback speed, half speed to three times" title="Playback speed — drag, or [ and ]">
                  <i class="tick" style="left:0%"></i><i class="tick" data-major style="left:20%"><span>1&times;</span></i><i class="tick" style="left:30%"></i><i class="tick" data-major style="left:40%"><span>1.5&times;</span></i><i class="tick" style="left:50%"></i><i class="tick" data-major style="left:60%"><span>2&times;</span></i><i class="tick" style="left:80%"></i><i class="tick" data-major style="left:100%"><span>3&times;</span></i>
                  <datalist id="rp-speeds"><option value="0.5"></option><option value="1"></option><option value="1.5"></option><option value="2"></option><option value="2.5"></option><option value="3"></option></datalist></span></div></div>
              <div class="vsize"><button data-act="size" class="sizebtn ib" aria-expanded="false" aria-haspopup="true" title="Video size: Fit — click to adjust, or - and =" aria-label="Video size: Fit (- smaller, = larger)"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.75 5V2.75h2.5M11.75 2.75h2.5V5M14.25 11v2.25h-2.5M4.25 13.25h-2.5V11"/><rect x="5" y="5.75" width="6" height="4.5" rx=".75"/></svg><span class="x">Fit</span></button>
                <div class="szpop" hidden role="group" aria-label="Video size"><span class="lbl">Size</span><input type="range" min="40" max="200" step="1" value="100" data-sizer list="rp-sizes" aria-label="Video size, 40% to 200% of Fit" title="Video size — drag, or - and =; past Fit it zooms in"><datalist id="rp-sizes"><option value="100"></option></datalist><output class="val" aria-hidden="true">Fit</output><button type="button" data-act="size-fit" class="fitbtn" title="As big as the window allows">Fit</button></div></div>
              <button data-act="checks" class="checksbtn ib" role="switch" aria-checked="true" hidden title="Quick checks: on, the video stops at each one — K turns them off" aria-label="Quick checks: on (K)"><span class="x"><span class="lg">Quick checks</span><span class="sh">Checks</span>: <b>on</b></span></button>
              <button data-act="terms" class="termsbtn ib" aria-pressed="false" hidden title="Terms: what the words in this video mean (G)" aria-label="Terms (G)"><span class="x">Terms</span></button>
              <button data-act="ask" class="askbtn ib" aria-pressed="false" title="Ask about this scene, in your own words (Q)" aria-label="Ask about this (Q)"><span class="x">Ask</span></button>
              <button data-act="plantext" class="planbtn ib" aria-pressed="false" hidden title="Plan text beside the video (L)" aria-label="Plan text (L)"><span class="x">Plan</span></button>
              <button data-act="guide" class="guidebtn ib" hidden title="The guide, under the video: scroll down, or click; the video goes on in the corner" aria-label="The guide, under the video"><span class="x">Guide</span></button>
              <button data-act="theme" class="themebtn ib" aria-pressed="false" title="Light theme — T switches to dark" aria-label="Dark theme (T)"></button>
            </div>
          </div>
          <div class="toolbar">
            <div class="group mark">
              <button data-act="mark" class="markbtn" title="Draw on the video (D) — S selects a mark, X erases, Z undoes the last mark, Esc turns it off">Mark <kbd>D</kbd></button>
              <button data-act="clear" class="clearbtn" hidden title="Remove every mark drawn on the video — notes and comments are left alone"></button>
              <button data-act="marks" class="marksbtn" role="switch" aria-checked="true" hidden title="Your marks on the video: shown — V hides them (they stay in the record)" aria-label="Marks on the video: on (V)">Marks: <b>on</b></button>
              <div class="shapes" role="group" aria-label="Shape">
                <button data-tool="stroke" title="Freehand">Free</button>
                <button data-tool="arrow" title="Arrow (A)">Arrow</button>
                <button data-tool="box" title="Box (B)">Box</button>
                <i class="sep" aria-hidden="true"></i>
                <button data-tool="select" title="Select a mark (S) — click one to edit its words; Delete removes it, U puts it back">Select</button>
                <button data-tool="erase" title="Eraser (X) — click or drag across marks to remove them; U puts them back">Erase</button>
              </div>
            </div>
            <!-- D-002: the composer sits with the video, carrying the timestamp it will be anchored to. It shares
                 the Mark/Approve row: on a row of their own those two buttons left the whole middle empty. -->
            <div class="composer"><textarea rows="1" placeholder="Comment at this moment…" title="Jump in anytime with / — Esc returns to the player"></textarea><button data-act="post"><span class="at"></span> Post</button></div>
            <div class="group finish">
              <button data-act="finish" class="finishbtn" title="Finish the review: approve the plan, or send it back with your comments">Finish review</button>
            </div>
          </div>
        </div>
        <div class="side" id="record">
          <button class="grab" data-act="pull" aria-expanded="false" aria-controls="record"><span></span><i class="gh">Hide</i></button>
          <p class="resend" hidden role="status"></p>
          <div class="handoff" hidden role="region" aria-label="Finish your review"></div>
          <div class="cols">
            <div class="col col-plan">
              <section class="changed" hidden><h4>Since the last build</h4><p class="chsum"></p><button data-act="only" class="onlybtn"></button></section>
              <section class="steps"><h4>Steps</h4><div class="gallery"></div><div class="rfoot"><p class="legend" hidden></p><div class="level" hidden><label for="rp-level">I know this system</label><select id="rp-level" data-level><option value="new">not at all (new)</option><option value="familiar">by name (familiar)</option><option value="owner">I own it (owner)</option></select><span class="lvl-len"></span></div><label class="pauseparts" hidden title="Off: the video plays straight on into the next chapter, naming it in the corner. On: it stops at the end of each chapter."><input type="checkbox" data-pauseparts> Pause between chapters</label><label class="pauseparts checksbox" hidden title="On (the default): the video stops at each quick check for your answer. Off: it plays on past them and skips the scenes that ask them. K switches it too."><input type="checkbox" data-checks checked> Stop at quick checks</label></div></section>
            </div>
            <div class="col col-calls">
              <section class="decs"><h4>Decisions<span class="count"></span></h4><div class="decisions"></div></section>
              <section class="autosec" hidden><h4>Decided during implementation<span class="count"></span></h4><div class="autolog"></div></section>
            </div>
            <div class="col col-words">
              <section class="marks"><h4>Comments<span class="count"></span><button class="exp" data-act="copy" title="Copy every comment and decision as text (C)">Copy</button><button class="exp" data-act="export" title="Download annotations.json and show how to get it into the repo (E) — comments also persist in this browser">Export</button></h4>
                <div class="list"></div></section>
              <section class="lastrev" hidden aria-labelledby="rp-lastrev"><h4 id="rp-lastrev">Your last review<span class="count"></span></h4><p class="lrsum"></p><div class="lrlist"></div></section>
            </div>
          </div>
        </div>
        <aside class="plantext" hidden aria-label="The plan, as written"><button class="ptoggle" data-act="plantext" aria-expanded="false"><span>Plan text</span></button><div class="pscroll"></div></aside>
        <div class="tpop" hidden role="tooltip"></div>
        <div class="fpop" hidden role="tooltip"></div>
        <aside class="dpanel" hidden role="dialog" aria-label="Guide">
          <div class="dhd"><span class="k"></span><h5></h5><a class="dfull" hidden title="The whole guide on its own page, at this part; Watch this moment brings you back"><span>Open the full guide</span><span class="dft"></span></a><button class="dx" data-act="detail-close" title="Close and go on where you were (Esc)" aria-label="Close the guide">×</button><p class="why"></p></div>
          <iframe sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe>
          <div class="terms" hidden></div>
          <div class="ask" hidden><p class="askabout"></p><div class="askrow"><textarea rows="2" data-ask placeholder="What's the saved review file?" aria-label="Your question about this scene"></textarea><div class="askacts"><button class="askgo" data-act="ask-send">Ask</button><button class="askstop" data-act="ask-stop" hidden>Stop</button></div></div><p class="askhow"></p><ol class="asklist" aria-live="polite"></ol></div>
          <p class="dsaved" hidden role="status"></p>
          <div class="dcomment" hidden role="dialog" aria-label="Your note on these words"><span class="k"></span><p class="quote"></p><div class="row"><textarea rows="1" data-dcomment placeholder="Your comment on this part" aria-label="Your comment on this part of the guide"></textarea><button data-act="dc-save">Comment</button><button data-act="dc-edit" hidden aria-pressed="false" title="Keep what these words say and what you would have them say: the revise step applies it exactly">Suggest an edit</button><button data-act="dc-ask" title="Ask about these words: answered here, and kept with your review's questions">Ask</button><button class="dx" data-act="dc-discard" title="Discard this comment" aria-label="Discard this comment">×</button></div><p class="hint">Enter saves · Esc closes (kept) · × deletes</p><div class="dans" hidden aria-live="polite"></div></div>
          <div class="dcall" hidden><span class="what"></span><span class="acts"><button data-dverdict="accept" title="Accept the agent's choice (A)">Accept <kbd>A</kbd></button><button data-dverdict="flag" title="Flag the agent's choice for discussion (B)">Flag <kbd>B</kbd></button></span></div>
        </aside>
        <div class="mstrip" hidden aria-hidden="true"></div><div class="minibar" hidden role="region" aria-label="The video, small: it goes on while you read the guide"><span class="mprog" aria-hidden="true"><i></i></span><span class="mthumb" aria-hidden="true"></span><button class="mplay" data-act="mini-play" data-playing="false" title="Play (space)" aria-label="Play"><svg class="pl" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg><svg class="pz" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" fill="currentColor"/></svg></button><span class="mtxt"><span class="mtime"><span class="mnow">0:00</span><span class="of"> / <span class="mdur">0:00</span></span></span><span class="mchap"></span></span><span class="mnote" aria-live="polite"></span><button class="mup" data-act="mini-up" title="Back to the video, in its place above the guide" aria-label="Back to the video"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2.75h10M8 13.5V6M4.75 9.25 8 6l3.25 3.25"/></svg><span class="l">Back to the video</span><span class="s">Video</span></button></div>
      </div>`;
    this.$ = (s) => this.shadowRoot.querySelector(s);
    this.$$ = (s) => [...this.shadowRoot.querySelectorAll(s)];
    this.player = this.$("hyperframes-player");
    if (this.muted) this.player.setAttribute("muted", ""); this.syncMute();
    this.canvas = this.$("canvas.overlay");
    this.ctx = this.canvas.getContext("2d");
    this.stage = this.$(".stage");
    // the small player (D-264): its picture is the way back to the video in its place
    if (!this.stage._rpMini) { this.stage._rpMini = true; this.stage.addEventListener("click", (e) => { if (!this._mini) return; e.preventDefault(); e.stopPropagation(); this.backToVideo(); }, true); }
    this.syncSize(); this.wireSizeGrip();
    // zoomed in, the view scrolls: what is placed in the window by the picture's box (a card's More, a word's meaning) goes
    this.$(".zport").addEventListener("scroll", () => { if (this._more) this.closeMore(); this.hideTerm(); }, { passive: true });
    // the wheel over what sits on the view (the poster's play button, the chips, the corner) moves the picture too;
    // the question's own box and the chapter's end keep theirs
    this.stage.addEventListener("wheel", (e) => {
      const zp = this.$(".zport"); if (!this.zoomed() || e.ctrlKey || e.composedPath().includes(zp) || e.target.closest?.(".decision, .chend, .dpanel")) return;
      const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? zp.clientHeight : 1, dx = (e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX) * k, dy = (e.shiftKey && !e.deltaX ? 0 : e.deltaY) * k;
      e.preventDefault(); zp.scrollBy({ left: dx, top: dy, behavior: "instant" });
    }, { passive: false });
    // the band is fitted to what it holds whenever that changes, or its width does (fitBand)
    { const box = this.$(".decision"), fit = () => { cancelAnimationFrame(this._bandRaf); this._bandRaf = requestAnimationFrame(() => this.fitBand()); };
      this._bandMO?.disconnect(); this._bandRO?.disconnect();
      this._bandMO = new MutationObserver(fit); this._bandMO.observe(box, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "hidden"] });
      this._bandRO = new ResizeObserver(fit); this._bandRO.observe(this.stage); this._bandRO.observe(this.$(".bandroom"));
      for (const ev of ["input", "focusin", "focusout"]) box.addEventListener(ev, fit); }
    if (!this._wired) { this._wired = true; this.shadowRoot.addEventListener("click", (e) => this.onClick(e));
      this.shadowRoot.addEventListener("input", (e) => { if (e.target.matches("[data-speed]")) this.reviewerSpeed(parseFloat(e.target.value)); else if (e.target.matches("[data-sizer]")) this.setSize(Number(e.target.value)); });
      this.shadowRoot.addEventListener("change", (e) => { if (e.target.matches("[data-sizer]")) this.status(`Video size: ${this.sizeName()}`); });
      this.shadowRoot.addEventListener("change", (e) => { if (e.target.matches("[data-pauseparts]")) this.setPauseParts(e.target.checked); if (e.target.matches("[data-checks]")) this.setChecks(e.target.checked); }); this.tabIndex = 0; this.addEventListener("keydown", (e) => this.onKey(e)); }
    // a glossary word in the frame's captions: a click shows its meaning (wireCaptions), the pointer says it can
    this.stage.addEventListener("click", (e) => { if (this.tool || e.target.closest?.(".hits .hit, .hits .cmore, .dmark .dhit, .dchip, .dpanel, .idle, .decision, .szgrip")) return; const t = this.termAtPoint(e.clientX, e.clientY); if (!t) { const c = this.captionAtPoint(e.clientX, e.clientY); if (c) { e.stopPropagation(); e.preventDefault(); this.openAsk({ quote: c }); } return; } e.stopPropagation(); e.preventDefault(); this.showTerm({ term: t.key }, t.rect); }, true);
    this.stage.addEventListener("pointermove", (e) => { if (this._termRaf) return; this._termRaf = requestAnimationFrame(() => { this._termRaf = 0; const on = !this.tool && !!this.termAtPoint(e.clientX, e.clientY); if (this.stage.classList.contains("overterm") !== on) this.stage.classList.toggle("overterm", on); }); });
    this.canvas.addEventListener("pointerdown", (e) => this.pointerDown(e));
    this.canvas.addEventListener("pointermove", (e) => this.pointerMove(e));
    this.canvas.addEventListener("pointerup", (e) => this.pointerUp(e));
    this.canvas.addEventListener("pointercancel", (e) => this.pointerUp(e));
    this.canvas.addEventListener("pointerleave", () => { if (this._eraserAt && !this._erasing) { this._eraserAt = null; this._erasePreview = null; this.redraw(); } });
    const comp = this.$(".composer textarea");
    comp.addEventListener("input", () => this.fitField(comp, 4));
    comp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.postComment(); } });
    comp.addEventListener("focus", () => this.player.pause());   // you cannot type about a moment that is running away
    this.$(".own textarea").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.answerOwn(); } });
    this.$(".own textarea").addEventListener("input", (e) => this.fitField(e.target, this.ownLines(e.target)));
    this.$("[data-note]").addEventListener("input", (e) => this.fitField(e.target, 3));
    // Enter in the note is "done with the note": a pick-all question it confirms (if anything is
    // picked); otherwise it hands the keyboard back so a letter picks the option the note is about.
    this.$("[data-note]").addEventListener("keydown", (e) => { if (e.key !== "Enter" || e.shiftKey) return; e.preventDefault(); const p = this._pendingDecision; if (this.isDec(p) && p.kind === "multi" && this.picked().length) this.confirmMulti(); else { e.target.blur(); this.focus(); const h = this.$(".decision .hint"); h.textContent = "Note kept — now pick your answer; it goes with it."; h.dataset.live = ""; } });
    // An answered question counting down waits while the reviewer writes in its sheet (a note, their
    // own words, the line under a quick check): the video must not run off with a half-typed thought.
    this.$(".decision").addEventListener("focusin", (e) => { if (e.target.matches("input, textarea")) this.holdWait(); });
    // The cards on the frame mirror the sheet's own option buttons (picked, your answer, the answer,
    // answered): every ask and answer already writes those, so the cards follow whatever wrote them.
    try { this._hitsMo?.disconnect(); this._hitsMo = new MutationObserver(() => this.syncHits()); this._hitsMo.observe(this.$(".decision .opts"), { attributes: true, childList: true, subtree: true, characterData: true }); } catch {}
    // Answer in the frame: a card, the question's heading or a choice's card, hovered a moment, shows its "More";
    // it goes when the pointer leaves both it and the card. A touch has no hover: its "More" chip is the way.
    { const hits = this.$(".hits"), pop = this.$(".fpop"), keyOf = (el) => el?.closest?.(".hit, .qhit, .cring, .cmore")?.dataset?.more ?? el?.closest?.(".hit")?.dataset?.hit;
      hits.addEventListener("pointerover", (e) => { if (e.pointerType && e.pointerType !== "mouse") return; const k = keyOf(e.target); if (k) this.hoverMore(k); });
      hits.addEventListener("pointerout", (e) => { if (e.pointerType && e.pointerType !== "mouse") return; if (keyOf(e.relatedTarget) === keyOf(e.target) && keyOf(e.target)) return; if (!pop.contains(e.relatedTarget)) this.unhoverMore(); });
      pop.addEventListener("pointerleave", () => this.unhoverMore());
      // the thing a detail explains: hovered a moment, it shows the detail's why beside it
      const dh = this.$(".dmark .dhit");
      // a touch: the first tap arms it (its ring and label), the second opens; a key's or the pointer's click opens at once
      dh.addEventListener("pointerdown", (e) => { this._dTouch = !!e.pointerType && e.pointerType !== "mouse"; });
      dh.addEventListener("click", (e) => { const touch = this._dTouch; this._dTouch = false; if (!touch || dh.hasAttribute("data-armed")) return; e.stopPropagation(); e.preventDefault(); this.armDetail(true); });
      if (!this._dArmWired) { this._dArmWired = true; this.shadowRoot.addEventListener("pointerdown", (e) => { const h = this.$(".dmark .dhit"); if (h?.hasAttribute("data-armed") && !e.composedPath().includes(h)) this.armDetail(false); }); }
      // what the part is for (its card) comes from the pill only, hovered or focused: never from resting on the thing
      const pill = dh.querySelector(".dtab");
      pill.addEventListener("pointerenter", (e) => { if (e.pointerType && e.pointerType !== "mouse") return; this.hoverDetail(true); });
      pill.addEventListener("pointerleave", (e) => { if (e.pointerType && e.pointerType !== "mouse") return; if (!pop.contains(e.relatedTarget)) this.hoverDetail(false); });
      dh.addEventListener("focus", () => { if (dh.matches(":focus-visible")) this.hoverDetail(true); });
      dh.addEventListener("blur", (e) => { if (!pop.contains(e.relatedTarget)) this.hoverDetail(false); });
      pop.addEventListener("pointerenter", () => clearTimeout(this._moreOutT));
      // the pointer reaching a control (a card's Accept or Flag, a chip): a "More" the hover opened goes at once, and one
      // about to open does not, so it is never over what the pointer went to click
      this.$(".decision").addEventListener("pointerover", (e) => { if (e.pointerType && e.pointerType !== "mouse") return; if (!e.target.closest?.("button, input, textarea, select, .own")) return; clearTimeout(this._moreT); if (this._more?.hover) this.closeMore(); });
      if (!this._scrollWired) { this._scrollWired = true; addEventListener("scroll", () => this.closeMore(), { passive: true }); } }
    const dis = this.$("[data-disagree]");
    dis.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.saveDisagree(); this.$(".decision .gobtn").focus({ preventScroll: true }); } });
    dis.addEventListener("input", () => { this.holdWait(); this.fitField(dis, 3); });
    dis.addEventListener("change", () => this.saveDisagree());
    // done writing (Enter, a click elsewhere): the countdown starts again from 4
    dis.addEventListener("focusout", () => { const p = this._pendingDecision; if (p?.kind === "quiz" && this.isAnswered(p) && !this._waiting) this.startWait(p, false); });
    const mw = this.$("[data-markword]");
    mw.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); this.closeMarkBox(true, true); } });   // Enter keeps; the words are one line of thought, wrapped
    mw.addEventListener("input", () => this.growMarkWord());
    mw.addEventListener("blur", () => this.closeMarkBox(true));   // clicking away keeps what was typed
    // Words are only ever thrown away on purpose: the × is the one way to discard them.
    // mousedown is cancelled so the input's blur does not save them first.
    const mx = this.$("[data-markdiscard]");
    mx.addEventListener("mousedown", (e) => e.preventDefault());
    mx.addEventListener("click", () => this.closeMarkBox(false, true));
    // the bin on a selected mark's box: deletes the mark itself, and U puts it back
    const mt = this.$("[data-marktrash]");
    mt.addEventListener("mousedown", (e) => e.preventDefault());
    mt.addEventListener("click", () => { const a = this.annotations.find((x) => x.id === this._markFor); this.closeMarkBox(false, true); if (a) this.deleteMarks([a], "deleted"); });
    // A detail's comment box, in the side panel. Enter keeps (Shift+Enter is a new line); the ×
    // is the one way to throw the words away, as on a mark; mousedown is cancelled so no blur runs first.
    const dc = this.$("[data-dcomment]");
    dc.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.saveDetailComment(); } });
    dc.addEventListener("input", () => { dc.style.height = "auto"; dc.style.height = `${dc.scrollHeight}px`; });
    this.$('[data-act="dc-discard"]').addEventListener("mousedown", (e) => e.preventDefault());
    // "Open the full guide": the part's time goes on the record before the page leaves for the guide
    this.$(".dfull").addEventListener("click", (e) => { if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || !this._dopen) return;
      // with the guide under the video (D-264), it is there: the panel closes and the page goes down to its section
      if (this._under) { e.preventDefault(); const d = this._dopen.d; this._dopen.wasPlaying = false; this.closeDetail(); this.openUnder(d.band ? null : d, { from: "list", log: false }); return; }
      this.closeDetailComment(true); this.endDetail(); this._dopen.since = performance.now(); this._dopen.openedAt = new Date().toISOString(); });
    // A detail page speaks through postMessage only (its frame is sandboxed, with an opaque origin), so
    // the one proof of who sent a message is its source: the panel's own frame, and nothing else.
    if (!this._msgWired) { this._msgWired = true; addEventListener("message", (e) => this.onDetailMessage(e)); }
    // one review: a note or a question kept on the guide's own page in another tab joins
    // this page's record as it is written; what this page holds is never dropped (by id, the newer answer wins)
    if (!this._storageWired) { this._storageWired = true; addEventListener("storage", (e) => this.onStorage(e)); }
    this.setTheme(this.theme);   // paints the host and labels the switch before anything loads
    // Click or drag. One gesture is one move of the playhead, so a drag back is one rewind (D-005),
    // measured from where the reviewer was when they took hold to where they let go.
    const scrub = this.$(".scrub");
    const at = (e) => { const r = scrub.getBoundingClientRect(); const dur = this.dur(); if (!dur || !r.width) return null; return Math.max(0, Math.min(dur, ((e.clientX - r.left) / r.width) * dur)); };
    // a click on a question's mark is not a seek: it opens that question, answered or not (pointAt)
    scrub.addEventListener("pointerdown", (e) => { const pt = this.pointAt(e); if (pt) { e.preventDefault(); this.openPoint(pt.kind, pt.id); return; }
      // a comment's stroke: to that comment (its moment, said on the status line; a mark selected on its frame)
      { const r = scrub.getBoundingClientRect(), cm = this.annAtX(e.clientX - r.left, r.width, this.dur()); if (cm) { e.preventDefault(); this.goAnn(cm.id); return; } }
      const t = at(e); if (t == null) return; this._scrub = { from: this.watchedT(), to: t }; this.start(); try { scrub.setPointerCapture(e.pointerId); } catch {} this._byHand = true; this.jump(t); });
    scrub.addEventListener("pointermove", (e) => { if (!this._scrub) return; const t = at(e); if (t == null || Math.abs(t - this._scrub.to) < 0.1) return; this._scrub.to = t; this._byHand = true; this.jump(t); });
    const let_go = () => { const g = this._scrub; if (!g) return; this._scrub = null; this.noteRewind(g.from, g.to); };
    scrub.addEventListener("pointerup", let_go); scrub.addEventListener("pointercancel", let_go);
    if (!this._peekWired) {
      this._peekWired = true;
      addEventListener("resize", () => this.measurePeek());
      addEventListener("orientationchange", () => this.measurePeek());
      // the chrome's height is not fixed — the shape picker wraps under Mark, the composer grows as
      // you type, a chapter label appears — so the peek is re-measured whenever the column resizes
      try { this._ro = new ResizeObserver(() => this.measurePeek()); this._ro.observe(this.$(".main")); } catch {}
      try { document.fonts?.ready.then(() => this.layoutParts()); } catch {}   // part names are measured, so measure them in the real font
      // …and whenever a face arrives later (the page's faces load after the first draw on a page that fetches their list): the part names, the band and the answer on the frame are fitted by measuring
      try { document.fonts?.addEventListener("loadingdone", () => { cancelAnimationFrame(this._fontRaf); this._fontRaf = requestAnimationFrame(() => { this.layoutParts(); this.fitBand(); this.layoutFrame(); this.measurePeek(); }); }); } catch {}
    }
    this.syncPull();
    this.updateStatus();
    this.measurePeek();
  }
  // D-003. The record is one sheet you pull up; at rest it is a 40 px bar at the foot of the window
  // that says what it holds (its cut-off headings were noise). What is measured here is the rest:
  // where the panel goes, the frame's bottom edge a phone's question docks to, the option grid.
  measurePeek() {
    const wrap = this.$?.(".wrap"), comp = this.$?.(".composer");
    if (!wrap || !comp || !this.stage) return;
    this.placeBand();
    this.placePlan();
    // the side panel sits beside the stage only where that leaves the stage 640 px; otherwise it covers the page
    wrap.classList.toggle("dcover", wrap.getBoundingClientRect().width - Math.min(560, innerWidth * 0.44) < 640);
    // the page around the player (its title, a review page's to-do line) makes room for a panel beside it
    try { const ds = document.documentElement.dataset; if ((this._dopen && !this._dopen.over) || this._topen) ds.rpPanel = wrap.classList.contains("dcover") ? "cover" : "beside"; else delete ds.rpPanel; } catch {}
    this.syncToolbar();
    // On a phone the band under the composer is half the screen: there the record rests filling it,
    // so what is below is the record itself rather than empty ground. Elsewhere it is the 40 px bar.
    // (with the guide under the video, D-264, what is below is the guide: the record keeps its 40 px bar there too)
    if (matchMedia("(max-width:600px)").matches && !this._under) {
      // (where it is on the page, not in the window: a page that scrolls, to the guide under the video, keeps the same rest)
      const bottom = Math.max(comp.getBoundingClientRect().bottom, this.$(".toolbar")?.getBoundingClientRect().bottom || 0) + scrollY;
      wrap.style.setProperty("--peek", `${Math.round(Math.max(40, innerHeight - bottom - 16))}px`);
    } else wrap.style.removeProperty("--peek");
    const ta = comp.querySelector("textarea"), ph = ta.getBoundingClientRect().width < 200 ? "Comment…" : "Comment at this moment…";
    if (ta.placeholder !== ph) ta.placeholder = ph;
    // and the frame's own bottom edge, which is as high as a question docked to the viewport may reach
    wrap.style.setProperty("--sheet-top", `${Math.round(Math.max(0, this.stage.getBoundingClientRect().bottom))}px`);
    // how many option cards fit side by side depends on the frame's width, not the window's
    const w = this.stage.getBoundingClientRect().width;
    if (w) this.stage.dataset.size = w >= 1200 ? "wide" : w >= 620 ? "mid" : "narrow";
    this.layoutParts();
    this.syncDetailChip();   // the thing's button and tab follow the stage's size (and a phone may make it too small to tap)
  }
  // Does the marking toolbar fit on one row? Only the composer's width depends on the answer, so
  // the others are measured as they are and the composer is given the room its placeholder needs.
  syncToolbar() {
    const tb = this.$?.(".toolbar"); if (!tb) return;
    if (!tb.classList.contains("marking") || matchMedia("(max-width:600px)").matches) { tb.classList.remove("toolsrow"); return; }
    const w = (el) => (el && !el.hidden ? el.getBoundingClientRect().width + 8 : 0);
    const need = w(this.$(".markbtn")) + w(this.$(".clearbtn")) + w(this.$(".marksbtn")) + w(this.$(".shapes")) + 320 + w(this.$(".group.finish"));
    tb.classList.toggle("toolsrow", need > tb.clientWidth);
  }
  // the runtime's asset loader (mint logo, "Loading assets") is off-palette and says nothing to a reviewer; its shadow is open
  hideRuntimeLoader() { try { const r = this.player.shadowRoot; if (r && !r.querySelector("style[data-rp]")) { const st = document.createElement("style"); st.dataset.rp = "1"; st.textContent = ".hfp-shader-loader{display:none!important}"; r.appendChild(st); } } catch {} }

  // ---- theme ---------------------------------------------------------------
  // The composition runs in a srcdoc iframe, so the theme is set by injecting the attribute into the
  // HTML we hand it. Frame timelines read their colours once, when they are built, so a switch has
  // to rebuild the composition — the playhead and the playing state are carried across.
  // Which theme: the page's ?theme= (light or dark, as the guide takes it), else the one this viewer last picked (T),
  // else the system's (prefers-color-scheme). Only a pick is remembered.
  get theme() {
    if (!this._theme) {
      let t = null;
      try { const q = new URLSearchParams(location.search).get("theme"); if (q === "light" || q === "dark") t = q; } catch {}
      if (!t) try { const v = localStorage.getItem("rp:theme"); if (v === "light" || v === "dark") t = v; } catch {}
      if (!t) try { t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch { t = "light"; }
      this._theme = t;
    }
    return this._theme;
  }
  setTheme(t, { remember = false } = {}) {
    this._theme = t;
    if (remember) try { localStorage.setItem("rp:theme", t); } catch {}
    this.setAttribute("theme", t);
    if (this._dopen) this.$(".dpanel iframe").src = this.detailUrl(this._dopen.d);   // an open detail follows the theme too
    // the page outside this component (title, background) has to match, or a dark video sits in a cream hole
    try { document.documentElement.dataset.rpTheme = t; } catch {}
    if (this._mini) this.syncMiniStill();   // the small player's still, in the new theme
    const b = this.$('[data-act="theme"]');
    if (b) {
      const dark = t === "dark";
      b.setAttribute("aria-pressed", String(dark)); b.title = dark ? "Dark theme — T switches to light" : "Light theme — T switches to dark";
      b.innerHTML = dark
        ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/></svg>';
    }
  }
  // Playback speed. The underlying player scales the timeline AND the narration audio from one
  // attribute, so there is nothing to keep in step by hand; it clamps to 0.1-5, and this control
  // offers 0.5-3 because outside that the voice stops being speech.
  // Mute: per viewer, like the theme and the speed. The underlying player owns the audio; its
  // \`muted\` attribute silences the narration without touching the timeline.
  // The key is versioned: an earlier key guard let every "m" typed into a comment toggle mute, and
  // that state was remembered, so reviewers could be left muted without knowing why. rp:muted is
  // never read again; everyone starts with sound once, and chooses again from there.
  get muted() { if (this._muted === undefined) { try { this._muted = localStorage.getItem(MUTE_KEY) === "1"; } catch { this._muted = false; } } return this._muted; }
  setMuted(m) {
    this._muted = !!m;
    try { localStorage.setItem(MUTE_KEY, m ? "1" : "0"); } catch {}
    try { this.player.muted = this._muted; } catch {}
    this.syncMute();
  }
  syncMute() {
    const b = this.$('[data-act="mute"]'); if (!b) return;
    const on = this.muted, label = on ? "Unmute (M)" : "Mute (M)";
    b.setAttribute("aria-pressed", String(on)); b.title = label; b.setAttribute("aria-label", label);
    b.innerHTML = on
      ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
  }
  get speed() { if (!this._speed) { const v = parseFloat((() => { try { return localStorage.getItem("rp:speed"); } catch { return null; } })()); this._speed = v > 0 ? v : 1; } return this._speed; }
  setSpeed(r) {
    const v = Math.min(3, Math.max(0.5, Math.round(r * 4) / 4));
    this._speed = v;
    try { localStorage.setItem("rp:speed", String(v)); } catch {}
    try { this.player.playbackRate = v; } catch {}
    const sl = this.$("[data-speed]"); if (sl && parseFloat(sl.value) !== v) sl.value = String(v);
    const x = this.$(".speed .x"); if (x) { x.textContent = `${v}\u00d7`; x.dataset.off = v === 1 ? "0" : "1"; }
    return v;
  }
  // "1×" opens the drag above it; a click anywhere else, or Esc, puts it away
  speedPop(open) {
    const pop = this.$?.(".sppop"), b = this.$?.('[data-act="speed"]'); if (!pop || !b) return false;
    const on = open ?? pop.hidden; if (on === !pop.hidden) return false;
    pop.hidden = !on; b.setAttribute("aria-expanded", String(on));
    if (on) { this.sizePop(false); pop.querySelector("input")?.focus({ preventScroll: true }); if (!this._popWired) { this._popWired = true; addEventListener("pointerdown", (e) => { const sp = this.$(".speed"); if (sp && !e.composedPath().includes(sp)) this.speedPop(false); }, true); } }
    return true;
  }
  nudgeSpeed(d) { const v = this.reviewerSpeed(this.speed + d); this.status(`${v}\u00d7 — the narration follows the same rate`); }
  // Size: Fit (the stage as big as the window allows, the default), or any size down to 40% of it, for a big
  // monitor where Fit is more video than anyone wants, or up to 200%, zoomed in (the stage keeps Fit's box and the
  // picture grows inside it, in a view that scrolls). The button opens a drag (live, 1% steps) with Fit beside
  // it; - and = step 5% up to Fit and 25% past it; the frame's bottom-right corner drags too, and double-clicked is Fit again. Remembered
  // per browser (rp:size: "fit" or the percent). A phone is always Fit and has no button or corner (CSS).
  get vsize() { if (this._vsize === undefined) this._vsize = this.sizeOf((() => { try { return localStorage.getItem("rp:size"); } catch { return null; } })()); return this._vsize; }
  // a stored or given size as the percent of Fit: "fit", or a number 40-200 (held there); anything else is Fit
  sizeOf(v) { if (v === "fit" || v == null || v === "") return 100; const n = Number(v); return Number.isFinite(n) ? Math.max(SIZE_MIN, Math.min(SIZE_MAX, Math.round(n))) : 100; }
  sizeName(v = this.vsize) { return v === 100 ? "Fit" : `${v}%`; }
  // zoomed in: the picture is bigger than the stage, and scrolls inside it (never on a phone)
  zoomed() { return this.vsize > 100 && !matchMedia("(max-width:600px)").matches; }
  // the picture's box on the screen: the stage's, or the zoomed picture's inside it (part of it out of view)
  picRect() { return (this.$?.(".zin") || this.stage).getBoundingClientRect(); }
  setSize(v) {
    v = this.sizeOf(v);
    if (v === this._vsize) return v;
    this._vsize = v;
    try { localStorage.setItem("rp:size", v === 100 ? "fit" : String(v)); } catch {}
    this.syncSize();
    return v;
  }
  syncSize() {
    this.placeBefore?.();
    const v = this.vsize, wrap = this.$?.(".wrap"), b = this.$?.(".sizebtn"); if (!wrap) return;
    // zooming keeps the middle of what is in view in the middle
    const zp = this.$?.(".zport"), mid = zp && zp.scrollWidth ? [(zp.scrollLeft + zp.clientWidth / 2) / zp.scrollWidth, (zp.scrollTop + zp.clientHeight / 2) / zp.scrollHeight] : null;
    if (v >= 100) { delete wrap.dataset.vsize; wrap.style.removeProperty("--size-k"); } else { wrap.dataset.vsize = String(v); wrap.style.setProperty("--size-k", String(v / 100)); }
    if (v > 100) { wrap.dataset.zoom = String(v); wrap.style.setProperty("--zoom-k", String(v / 100)); } else { delete wrap.dataset.zoom; wrap.style.removeProperty("--zoom-k"); }
    if (zp) { if (v > 100 && mid) { zp.scrollLeft = mid[0] * zp.scrollWidth - zp.clientWidth / 2; zp.scrollTop = mid[1] * zp.scrollHeight - zp.clientHeight / 2; } else if (v <= 100) { zp.scrollLeft = 0; zp.scrollTop = 0; } }
    const name = this.sizeName(v), of = v !== 100 ? " of Fit" : "";
    if (b) {
      const x = b.querySelector(".x"); x.textContent = name; x.dataset.off = v === 100 ? "0" : "1";
      b.title = `Video size: ${name}${of} — click to adjust, or - and =`;
      b.setAttribute("aria-label", `Video size: ${name}${of} (- smaller, = larger)`);
    }
    const sl = this.$?.("[data-sizer]"); if (sl && Number(sl.value) !== v) sl.value = String(v);
    const out = this.$?.(".szpop .val"); if (out) out.textContent = name;
    const fb = this.$?.(".szpop .fitbtn"); if (fb) fb.disabled = v === 100;
    this.homeLayer();
    // the stage's box has changed: a "More" open was placed for the old one; the layout follows on the next frame
    // (once however fast a drag moves), and a question up is placed again on its cards at the new size
    if (this.stage && this._peekWired) {
      this.closeMore();
      cancelAnimationFrame(this._sizeRaf);
      this._sizeRaf = requestAnimationFrame(() => { this.measurePeek(); if (this._pendingDecision) this.recheckCards(); });
    }
  }
  // the answer on the frame is laid over the picture: beside the stage at Fit and smaller (it may reach over the
  // timeline under it), inside the zoomed picture when zoomed in, so it moves with the cards as the view scrolls
  homeLayer() {
    const box = this.$?.(".decision"), zin = this.$?.(".zin"); if (!box || !zin || !this.stage || !box.classList.contains("onframe")) return;
    if (this.zoomed()) { if (box.parentElement !== zin) zin.append(box); }
    else if (box.parentElement !== this.$(".main") || box.previousElementSibling !== this.stage) this.stage.after(box);
    this.placeLayer();
  }
  // Zoomed in, a question's cards come into view when it is asked: the view scrolls to its heading and cards where
  // both fit in it, else to the cards (the heading's words are a click away in "Full question"): the middle of them
  // where they fit, else their top-left corner. Once per question; the size is left as chosen.
  revealQuestion() {
    const p = this._pendingDecision, id = this.pendingId(p), set = this._cards || this._callCards, zp = this.$?.(".zport"), zin = this.$?.(".zin");
    if (!this.zoomed() || !id || !set || !zp || !zin || this._revealed === id) return;
    const W = zin.offsetWidth, H = zin.offsetHeight; if (!W || !H) return;
    const px = (b) => ({ l: (b.l * W) / 100, t: (b.t * H) / 100, r: ((b.l + b.w) * W) / 100, b: ((b.t + b.h) * H) / 100 });
    const union = (bs) => ({ l: Math.min(...bs.map((b) => b.l)), t: Math.min(...bs.map((b) => b.t)), r: Math.max(...bs.map((b) => b.r)), b: Math.max(...bs.map((b) => b.b)) });
    const band = this.$(".decision").classList.contains("band") && this._bandPlace === "in", m = 16, vw = zp.clientWidth, vh = zp.clientHeight * (band ? 0.875 : 1);   // the band in the frame covers the view's lowest eighth
    const cards = union(Object.values(set).map(px)), all = this._qbox ? union([cards, px(this._qbox)]) : cards;
    const fits = (U) => U.r - U.l + 2 * m <= vw && U.b - U.t + 2 * m <= vh, U = fits(all) ? all : cards;
    const x = U.r - U.l + 2 * m <= vw ? (U.l + U.r - vw) / 2 : U.l - m, y = U.b - U.t + 2 * m <= vh ? (U.t + U.b - vh) / 2 : U.t - m;
    zp.scrollTo({ left: Math.max(0, x), top: Math.max(0, y), behavior: "instant" });
    this._revealed = id;
  }
  // "Fit" or the percent opens the drag above it; a click anywhere else, or Esc, puts it away
  sizePop(open) {
    const pop = this.$?.(".szpop"), b = this.$?.('[data-act="size"]'); if (!pop || !b) return false;
    const on = open ?? pop.hidden; if (on === !pop.hidden) return false;
    pop.hidden = !on; b.setAttribute("aria-expanded", String(on));
    if (on) { const r = b.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight; pop.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, r.right + 4 - w))}px`; pop.style.top = `${r.top - h - 8 >= 8 ? r.top - h - 8 : r.bottom + 8}px`; }
    if (on) { this.speedPop(false); pop.querySelector("input")?.focus({ preventScroll: true }); if (!this._szWired) { this._szWired = true; addEventListener("pointerdown", (e) => { const z = this.$(".vsize"); if (z && !e.composedPath().includes(z)) this.sizePop(false); }, true); } }
    return true;
  }
  // d = -1 is smaller (-), 1 is larger (=): 5% at a time up to Fit, onto the next multiple of 5, and 25% at a
  // time past it (zoomed in, onto 125, 150, 175, 200: the owner found twenty presses to 200% too many); held at
  // 40% and at 200%
  nudgeSize(d) {
    const v = this.vsize, s = (d > 0 ? v >= 100 : v > 100) ? 25 : 5;
    const to = d < 0 ? Math.ceil(v / s) * s - s : Math.floor(v / s) * s + s, got = this.setSize(d > 0 && v < 100 ? Math.min(100, to) : to);
    this.status(`Video size: ${this.sizeName(got)}${d < 0 && got === SIZE_MIN ? " (the smallest)" : d > 0 && got === SIZE_MAX ? " (zoomed in as far as it goes)" : got === 100 ? " (as big as the window allows)" : got > 100 ? " — zoomed in: scroll to move around the frame" : ""}`);
  }
  // Fit's width in this window: the stage's width with the size taken off for a moment (no frame is drawn between)
  fitWidth() {
    const wrap = this.$(".wrap"), main = this.$(".main"), k = wrap.style.getPropertyValue("--size-k");
    wrap.style.setProperty("--size-k", "1"); const w = main.getBoundingClientRect().width;
    if (k) wrap.style.setProperty("--size-k", k); else wrap.style.removeProperty("--size-k");
    return w;
  }
  // the frame's corner, dragged: the stage stays centred and its top stays put, so the corner follows the
  // pointer when the width is twice its move across, or 16/9 of its move down, whichever the pointer moved more
  wireSizeGrip() {
    const g = this.$(".szgrip"); if (!g) return;
    g.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return; e.preventDefault(); e.stopPropagation();
      // the size follows the corner's move as a share of the stage's box: at Fit and under, the stage is that box
      // and its corner stays under the pointer; zoomed in, the box is Fit's, and dragging out past it zooms further
      const fit = this.fitWidth(), r = this.stage.getBoundingClientRect(), cx = (r.left + r.right) / 2, ox = r.right - e.clientX, oy = r.bottom - e.clientY, w0 = r.width, v0 = this.vsize;
      if (!fit || !w0) return;
      try { g.setPointerCapture(e.pointerId); } catch {}
      const wrap = this.$(".wrap"); wrap.classList.add("sizing");
      const move = (ev) => {
        const wx = 2 * (ev.clientX + ox - cx), wy = (ev.clientY + oy - r.top) * 16 / 9, w = Math.abs(wx - w0) >= Math.abs(wy - w0) ? wx : wy;
        this.setSize(Math.round((w / w0) * v0));
      };
      const up = (ev) => {
        try { g.releasePointerCapture(ev.pointerId); } catch {}
        g.removeEventListener("pointermove", move); g.removeEventListener("pointerup", up); g.removeEventListener("pointercancel", up);
        wrap.classList.remove("sizing");
        this.status(`Video size: ${this.sizeName()}${this.vsize !== 100 ? " — double-click the corner for Fit" : ""}`);
      };
      g.addEventListener("pointermove", move); g.addEventListener("pointerup", up); g.addEventListener("pointercancel", up);
    });
    g.addEventListener("click", (e) => { e.stopPropagation(); e.preventDefault(); });
    g.addEventListener("dblclick", (e) => { e.stopPropagation(); e.preventDefault(); this.setSize(100); this.status("Video size: Fit"); });
  }
  // the reviewer's own change of speed (the drag, or [ and ]); restoring a saved speed is not one
  reviewerSpeed(r) { const old = this.speed; const v = this.setSpeed(r); this.noteSlow(old, v); return v; }

  // ---- D-005: the moments only a video can report ------------------------------
  // Two signals, recorded without asking anything of the reviewer: going back more than 2 s, and
  // slowing down below 1x. They are prompts to explain a step more plainly, not verdicts. Only what
  // the reviewer does counts; every seek the player makes itself (routing, a question, a replay of
  // a decision) goes through jump()/seek() and never through here.
  watchedT() { return this.stage?.dataset.started ? (this.player?.currentTime ?? this._lastT) : 0; }   // before the first play, the poster's seek is not a position
  momentAt(t) { const f = this.frameAt(t); return { planStep: f?.planStep ?? null, frameIndex: f?.index ?? null }; }
  noteRewind(from, to) {
    if (!(from - to > 2)) return;
    const now = Date.now(), last = this.moments.at(-1);
    // P P, or a key held down: one trip back, from where it started to where it ended
    if (last?.kind === "rewind" && now - (this._rewoundAt || 0) < 1500 && Math.abs(from - last.t) < 0.75) Object.assign(last, { t: +to.toFixed(2), ...this.momentAt(to) });
    else this.moments.push({ kind: "rewind", t: +to.toFixed(2), from: +from.toFixed(2), ...this.momentAt(to) });
    this._rewoundAt = now; this.persistMoments();
  }
  noteSlow(old, v) {
    if (!(v < 1 && v < old)) return;   // slowing down into below 1x; speeding back up is not a signal
    const now = Date.now(), last = this.moments.at(-1), t = this.watchedT();
    // one drag from 1x to 0.5x passes 0.75x on the way: that is one moment at the rate it came to rest
    if (last?.kind === "slow" && now - (this._slowedAt || 0) < 3000) last.rate = v;
    else this.moments.push({ kind: "slow", t: +t.toFixed(2), rate: v, ...this.momentAt(t) });
    this._slowedAt = now; this.persistMoments();
  }
  persistMoments() { try { localStorage.setItem(this.rkey + ":moments", JSON.stringify(this.moments)); } catch {} }

  async toggleTheme(to) {
    const t = this.player.currentTime || 0, playing = !this.player.paused;
    if (to && to === this.theme) return;
    this.setTheme(to || (this.theme === "dark" ? "light" : "dark"), { remember: true });
    await this.load();
    const back = () => { this.setSpeed(this.speed); this.player.seek(t); if (playing) this.player.play(); };
    if (this.stage.dataset.ready) back(); else this.player.addEventListener("ready", back, { once: true });
    this.status(`${this.theme === "dark" ? "Dark" : "Light"} — the video and this page follow the same palette`);
  }

  async load() {
    if (!this.src) return;
    const fresh = document.createElement("hyperframes-player");
    if (this.muted) fresh.setAttribute("muted", "");
    this.player.replaceWith(fresh); this.player = fresh; delete this.stage.dataset.ready; delete this.stage.dataset.started; this.idle(false); this.hideRuntimeLoader();
    const rt = this.getAttribute("runtime-src");
    if (rt) {
      // Offline / proxied review: <hyperframes-player> honours runtime-src only on the srcdoc path
      // (its src path hard-codes the CDN runtime), so fetch the composition and hand it over as
      // srcdoc with a <base> so its relative assets, frames and audio still resolve.
      this.player.setAttribute("runtime-src", rt);
      try {
        const abs = new URL(this.src, document.baseURI);
        const html = await (await fetch(abs)).text();
        const base = `<base href="${abs.href.replace(/[^/]*$/, "")}">`;
        let doc = /<head\b[^>]*>/i.test(html) ? html.replace(/<head\b[^>]*>/i, (m) => m + base) : base + html;
        if (this.theme === "dark") doc = doc.replace(/<html/i, '<html data-theme="dark"');
        this.player.setAttribute("srcdoc", doc);
      } catch (e) { this.status(`could not fetch ${this.src}: ${e.message}`); this.player.setAttribute("src", this.src); }
    } else {
      this.player.setAttribute("src", this.src);
    }
    this.player.addEventListener("timeupdate", (e) => { this._lastT = e.detail?.currentTime ?? this.player.currentTime; if (this._lastT > 0.3 && !this.player.paused && !this.stage.dataset.started) { this.stage.dataset.started = "1"; this.hideCaptions("before", false); } if (this._lastT > this._maxT) this._maxT = this._lastT; if (!this._seenMarked && this.dur() && this._maxT / this.dur() >= 0.8) { this._seenMarked = true; this.markWatched("seen"); } this.trackDefined(this._lastT); this.trackParts(this._lastT); if (performance.now() - (this._capsAt || 0) > 1000) { this._capsAt = performance.now(); this.wireCaptions(); } this.tickDecisions(this._lastT); this.skipUnchanged(this._lastT); this.applyPicks(); this.syncGallery(); this.redraw(); this.syncScrub(); this.syncPlanStep(); this.updateStatus(); });
    // where this run of play began, and when, and the playhead at its last tick (tickDecisions: a question the video
    // played across is reached however long the page went between ticks); a seek pauses the video, so every run starts
    // with a play. A new speed starts the clock's count again from there.
    const runFrom = () => { const t = this.player.currentTime; this._run = { t, at: performance.now(), last: this._run?.last ?? t }; };
    this.player.addEventListener("play", () => { this._run = null; runFrom(); if (!this._firstPlayAt) this._firstPlayAt = new Date().toISOString(); this.stage.dataset.started = "1"; this.hideCaptions("before", false); this.deselect(); this.syncPlay(); });   // a selection belongs to a paused frame
    this.player.addEventListener("pause", () => { this._run = null; this.syncPlay(); });
    this.player.addEventListener("ratechange", () => { if (this._run) runFrom(); });
    this.player.addEventListener("ended", () => { this.syncPlay(); this.markWatched("seen"); });   // watched: 80 % seen, or the end, whichever comes first (D-128)
    this.player.addEventListener("ready", () => { this.stage.dataset.ready = "1"; this.placeBefore(); if (this._mini) this.miniCaptions(true); this.hideRuntimeLoader(); this.idle(true); this.renderScrub(); this.syncPlay(); this.redraw(); this.poster(); this.applyPicks(); this.detectBand(); this.syncBand(); if (this._pendingDecision) this.recheckCards(); for (const ms of [0, 800, 2500, 6000]) setTimeout(() => this.wireCaptions(), ms); }); // fires again after a seek loads a new sub-composition
    const mapUrl = this.getAttribute("plan-map") || this.src.replace(/index\.html$/, "plan-map.json");
    try { this._mapUrl = new URL(mapUrl, document.baseURI).href; } catch { this._mapUrl = null; }
    this._mapTried = false;
    try { this.planMap = await (await fetch(mapUrl)).json(); } catch { this.planMap = null; this.status("no plan-map.json: marks will be time-anchored only"); }
    this._mapTried = true;
    if (this.stage.dataset.ready) this.poster();   // the video was ready before its map: the poster waited for it (a part)
    this.newRoundIfRebuilt();
    this.loadLastReview();
    this.resumeWork();
    try { const saved = localStorage.getItem(this.rkey); if (saved) this.annotations = JSON.parse(saved); const sd = localStorage.getItem(this.rkey + ":decisions"); if (sd) this.decisions = JSON.parse(sd); } catch {}
    try { const sq = localStorage.getItem(this.rkey + ":quiz"); if (sq) this.quizzes = JSON.parse(sq); const sa = localStorage.getItem(this.rkey + ":autonomy"); if (sa) this.autonomy = JSON.parse(sa); const sl = localStorage.getItem(this.rkey + ":level"); if (sl) this.level = sl; } catch {}
    try { const sm = JSON.parse(localStorage.getItem(this.rkey + ":moments") || "[]"); this.moments = Array.isArray(sm) ? sm : []; } catch { this.moments = []; }
    try { const sd = JSON.parse(localStorage.getItem(this.rkey + ":details") || "[]"); this.detailsOpened = Array.isArray(sd) ? sd : []; } catch { this.detailsOpened = []; }
    try { this.termsOpened = Number(localStorage.getItem(this.rkey + ":terms")) || 0; } catch { this.termsOpened = 0; }
    try { const tk = JSON.parse(localStorage.getItem(this.rkey + ":termkeys") || "[]"); this.termsLookedUp = Array.isArray(tk) ? tk : []; } catch { this.termsLookedUp = []; }
    try { const qs = JSON.parse(localStorage.getItem(this.rkey + ":questions") || "[]"); this.questions = Array.isArray(qs) ? qs.map((q) => (["asking", "streaming", "waiting"].includes(q.status) ? { ...q, status: "review" } : q)) : []; } catch { this.questions = []; }
    // the words this viewer knows (D-218): this browser's, and on the local review page, what your file says
    this._known = null; this._defDone = {}; this._defPlayed = {}; this._defT = null; this._partT = null; this._partPlayed = {};
    // …and what your file says you watched (D-128): "Before you watch" and the level the video starts at read it too
    this.reachLocal().then((j) => { if (j?.known && (j.known.looked?.length || j.known.watched?.length)) { this._serverKnown = j.known; this.syncKnown(); this.renderBefore(); this.levelFromBefore(); this.dispatchEvent(new CustomEvent("known", { detail: j.known })); } }).catch(() => {});
    // accessible videos: what to watch first (on the poster), and the Terms button when there are words to look up
    this._seenMarked = false; this._guardDoneMem = false; this._walkQueue = null; this._walking = null; this.renderBefore();
    { const tb = this.$(".termsbtn"); if (tb) tb.hidden = !this.termList().length; }
    this.syncChecks();   // the Quick checks switch, on a video that has them
    // every video on the card watched: the video starts without its scenes for newcomers, unless the viewer picked a level
    if (this.planMap?.levels) { this._levelSaved = !!this.level; this.level = this.level || (this.prereqs.length && this.prereqs.every((p) => this.prereqWatched(p)) ? "familiar" : "new"); const box = this.$(".level"); box.hidden = false; const sel = box.querySelector("select"); sel.value = this.level; sel.onchange = () => { this.level = sel.value; try { localStorage.setItem(this.rkey + ":level", this.level); } catch {} this.renderLevel(); }; this.renderLevel(); }
    this.$(".autosec").hidden = !this.calls().length;
    { const pp = this.$(".pauseparts"); pp.hidden = (this.planMap?.chapters || []).length < 2; pp.querySelector("input").checked = this.pauseParts; }
    this.dispatchEvent(new CustomEvent("plan", { detail: this.planMap }));
    this.renderGallery(); this.renderList(); this.renderLastReview(); this.renderDecisions(); this.renderScrub(); this.renderAutonomy(); this.renderChanges(); this.renderPlanText(); this.syncClear(); this.updateStatus();
    // the guide's parts, once its page is found beside the plan map (the plan guide)
    this._guideOk = false;
    if (this.planMap?.guide?.parts?.length || (this.planMap?.details || []).some((d) => d.guide)) this.hasGuide().then((ok) => { if (!ok || this._guideOk) return; this._guideOk = true; this.renderPlanText(); this.syncDetailChip?.(); });
    this.placeBand(); this.detectBand();
  }

  // ---- review rounds --------------------------------------------------------
  // A review is a round: once it is sent, what it said belongs to the plan's record, not to the next
  // watch. When the video has been rebuilt since (a revise), the saved marks, answers and verdict are
  // archived under ":archive:<when>" and the reviewer starts clean; otherwise a re-asked question
  // would show the old answer, and the next review would send the old comments again.
  buildSig() {
    const m = this.planMap; if (!m) return null;
    return m.changes?.at || JSON.stringify((m.frames || []).map((f) => [f.compositionId, f.start, f.end]));
  }
  // Saved state that no longer fits the video: an answer to a question that is gone or reworded (its
  // option now has another label), or a mark on a frame that no longer exists.
  staleSaved() {
    const m = this.planMap; if (!m) return false;
    let dec = {}, ann = [];
    try { dec = JSON.parse(localStorage.getItem(this.rkey + ":decisions") || "{}"); ann = JSON.parse(localStorage.getItem(this.rkey) || "[]"); } catch { return false; }
    const qs = Object.fromEntries((m.decisions || []).map((d) => [d.id, d]));
    for (const [id, d] of Object.entries(dec)) {
      const q = qs[id]; if (!q) return true;
      if (d?.question && q.question && d.question !== q.question) return true;
      const o = (q.options || []).find((x) => x.id === d?.option);
      if (/^[a-d]$/.test(d?.option || "") && (!o || (d.label && o.label !== d.label))) return true;
    }
    const ids = new Set((m.frames || []).map((f) => f.compositionId));
    return ann.some((a) => a.frame?.compositionId && !ids.has(a.frame.compositionId));
  }
  newRoundIfRebuilt() {
    this._newRound = false;
    const sig = this.buildSig(); if (!sig) return;
    let round = null; try { round = JSON.parse(localStorage.getItem(this.rkey + ":round") || "null"); } catch {}
    const rebuiltSinceSent = round?.sentAt && round.sig !== sig;
    if (!rebuiltSinceSent && !this.staleSaved()) return;
    const keys = ["", ":decisions", ":quiz", ":autonomy", ":moments", ":details", ":verdict", ":round", ":terms", ":guard", ":next"];
    try {
      const archive = Object.fromEntries(keys.map((k) => [k || "annotations", localStorage.getItem(this.rkey + k)]).filter(([, v]) => v != null));
      if (Object.keys(archive).length) localStorage.setItem(this.rkey + `:archive:${round?.sentAt || new Date().toISOString()}`, JSON.stringify(archive));
      for (const k of keys) localStorage.removeItem(this.rkey + k);
    } catch {}
    this._verdictFor = null; this._sent = null; this._nextFor = null;
    this._newRound = true;
  }

  // ---- your last review -------------------------------------------------------
  // The round you sent, archived once the video was rebuilt (newRoundIfRebuilt): read back in the record, read-only,
  // so you can check every request was handled. Your comments and marks, your answers, a quick check you said works
  // otherwise, an agent's choice you flagged or changed; each line goes to where it is in this version when that is
  // still there (the same scene, the same question, its part of the guide), and says so when it is not.
  loadLastReview() {
    this._last = null;
    const pre = this.rkey + ":archive:"; let key = null, A = null;
    try { key = Object.keys(localStorage).filter((k) => k.startsWith(pre)).sort().pop() || null; if (key) A = JSON.parse(localStorage.getItem(key) || "null"); } catch { return; }
    if (!A || typeof A !== "object") return;
    const js = (k, d) => { try { const v = JSON.parse(A[k] ?? "null"); return v ?? d; } catch { return d; } };
    const rows = (o) => Object.entries(o && typeof o === "object" && !Array.isArray(o) ? o : {}).map(([id, v]) => ({ id, ...(v && typeof v === "object" ? v : {}) }));
    const ann = js("annotations", []), round = js(":round", null);
    const last = { when: key.slice(pre.length), sentAt: round?.sentAt || null, verdict: typeof A[":verdict"] === "string" ? A[":verdict"] : null,
      annotations: (Array.isArray(ann) ? ann : []).filter((a) => a && a.kind !== "approve" && (String(a.comment || "").trim() || a.path)),
      decisions: rows(js(":decisions", {})),
      quizzes: rows(js(":quiz", {})).filter((r) => String(r.note || "").trim() || r.answer === "own" || r.unclear),
      calls: rows(js(":autonomy", {})).filter((r) => r.verdict && r.verdict !== "accept" && r.verdict !== "listed") };
    if (last.annotations.length + last.decisions.length + last.quizzes.length + last.calls.length) this._last = last;
  }
  // where a line of the last review is in this version: { t } (the same scene, at the same moment when it is still in
  // it, else the scene's start), { point } (the same question, still asked), { part } (its part of the guide), or null
  lastLanding(it) {
    const m = this.planMap || {}, frames = m.frames || [];
    if (it.kind === "ann") {
      const a = it.a, cid = a.frame?.compositionId, f = cid ? frames.find((x) => x.compositionId === cid) : null;
      const out = {};
      if (f) { const end = f.end ?? f.start + (f.durationSeconds || 0); out.t = a.t >= f.start && a.t < end ? a.t : f.start; }
      if (a.via === "guide" && a.detail && this._under) out.part = a.detail.name && a.detail.name !== "guide" ? a.detail.name : null;
      return "t" in out || "part" in out ? out : null;
    }
    const list = it.kind === "choice" ? m.decisions : it.kind === "check" ? m.quizzes : this.calls();
    const q = (list || []).find((x) => x.id === it.r.id);
    return q ? { point: `${it.kind}:${q.id}`, t: q.at } : null;
  }
  lastItems() {
    const L = this._last; if (!L) return [];
    const m = this.planMap || {}, at = (list, id, t) => (list || []).find((x) => x.id === id)?.at ?? t ?? 0;
    return [
      ...L.annotations.map((a) => ({ kind: "ann", a, t: Number(a.t) || 0 })),
      ...L.decisions.map((r) => ({ kind: "choice", r, t: Number(r.t ?? at(m.decisions, r.id)) || 0 })),
      ...L.quizzes.map((r) => ({ kind: "check", r, t: Number(at(m.quizzes, r.id, r.t)) || 0 })),
      ...L.calls.map((r) => ({ kind: "call", r, t: Number(at(this.calls(), r.id, r.t)) || 0 })),
    ].sort((x, y) => x.t - y.t);
  }
  renderLastReview() {
    const sec = this.$?.(".lastrev"); if (!sec) return;
    const items = this._lastItems = this.lastItems(); sec.hidden = !items.length;
    if (!items.length) { sec.querySelector(".lrlist").innerHTML = ""; return; }
    const L = this._last, n = L.annotations.length, d = L.decisions.length;
    const when = (() => { const x = new Date(L.sentAt || L.when); return Number.isNaN(+x) ? "" : x.toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); })();
    const verdict = L.verdict === "approve" ? "approved" : L.verdict === "changes" ? "changes requested" : "";
    sec.querySelector(".count").textContent = ` · ${items.length}`;
    sec.querySelector(".lrsum").textContent = `${L.sentAt ? `Sent ${when}` : `Kept from before this version${when ? ` (${when})` : ""}`}${verdict ? `, ${verdict}` : ""}: ${n} comment${n === 1 ? "" : "s"}${d ? `, ${d} answer${d === 1 ? "" : "s"}` : ""}. The video has been rebuilt since; each line goes to where it is now.`;
    const words = (t) => esc(String(t || "").trim());
    sec.querySelector(".lrlist").innerHTML = items.map((it, i) => {
      const go = this.lastLanding(it), t = go?.t ?? it.t;
      const ts = go && (go.t != null || go.point) ? `<button class="ts" data-lr="${i}" title="Go to it in this version">${this.fmt(t)}</button>` : `<button class="ts" disabled title="Not in this version">${this.fmt(it.t)}</button>`;
      if (it.kind === "ann") {
        const a = it.a, guide = a.via === "guide" && a.detail;
        const where = guide ? (go && "part" in go ? `<button class="lnk" data-lr-guide="${i}" title="Go to it in the guide">${esc(a.detail.where || a.detail.name)}</button>` : esc(a.detail.where || a.detail.name)) : esc(a.about || this.frameTitle(a));
        const k = guide ? "guide" : a.path ? (KIND[a.kind] || a.kind) : a.detail ? "detail" : "";
        return `<div class="ann"><div class="hd">${ts}${k ? `<span class="k">${esc(k)}</span>` : ""}<span class="t">${where}${go ? "" : " · not in this version"}</span></div>${guide && a.detail.text ? `<p class="gq">“${esc(a.detail.text)}”</p>` : ""}<p class="lw">${words(a.comment) || `<i>(${esc(KIND[a.kind] || a.kind)}, no words)</i>`}</p></div>`;
      }
      const r = it.r;
      if (it.kind === "choice") {
        const ans = r.option === "unclear" ? "Asked to explain more" : r.option === "own" ? `In your own words: ${r.label || ""}` : r.label || r.option || "";
        return `<div class="ann"><div class="hd">${ts}<span class="k">Question</span><span class="t">${esc(r.question || r.id)}${go ? "" : " · no longer asked"}</span></div><p class="lw"><b>${esc(ans)}</b>${r.note ? `\n${words(r.note)}` : ""}</p></div>`;
      }
      if (it.kind === "check") {
        const q = (this.planMap?.quizzes || []).find((x) => x.id === r.id);
        return `<div class="ann"><div class="hd">${ts}<span class="k">Quick check</span><span class="t">${esc(q?.question || r.id)}${go ? "" : " · no longer asked"}</span></div><p class="lw">${r.answer === "own" ? `<b>Your own answer:</b> ${words(r.own)}` : r.note ? `<b>Expected something else:</b> ${words(r.note)}` : "Asked to have it explained again"}</p></div>`;
      }
      const c = this.calls().find((x) => x.id === r.id);
      return `<div class="ann"><div class="hd">${ts}<span class="k">The agent's choice</span><span class="t">${esc(c?.chose || r.chose || r.id)}</span></div><p class="lw">${r.verdict === "flag" ? "<b>Flagged</b> for discussion" : `<b>Change:</b> ${words(r.own)}`}${r.note ? `\n${words(r.note)}` : ""}</p></div>`;
    }).join("");
  }
  // a line of the last review, to where it is now: its question (asked again, as the video asks it), or its moment
  goLast(i) {
    const it = this._lastItems?.[i], go = it && this.lastLanding(it); if (!go) return;
    if (go.point) { const k = go.point.indexOf(":"); this.openPoint(go.point.slice(0, k), go.point.slice(k + 1)); return; }
    if (go.t == null) return;
    this._byHand = true; this.start(); this.toFrame(); this.player.seek(go.t); this.player.pause();
    const w = String(it.a?.comment || "").replace(/\s+/g, " ").trim();
    this.status(`Your last review, at ${this.fmt(go.t)}${w ? `: ${w.length > 80 ? `${w.slice(0, 79)}…` : w}` : ""}`);
    this.showNoteCard("Your last review", w);
  }
  goLastGuide(i) {
    const it = this._lastItems?.[i], go = it && this.lastLanding(it); if (!go || !("part" in go) || !this._under) return;
    if (this.player && !this.player.paused) this.player.pause();
    this.closePull(); this._under.show(go.part || null);
    this.status("your last review's note, in the guide under the video");
  }

  // ---- changes only ---------------------------------------------------------
  // After a plan is revised, the reviewer should not rewatch three minutes to find the thirty
  // seconds that moved. plan-diff records which beats now say or show something different. "Just the
  // changes" is a mode, not a one-off: it is the default whenever the video was rebuilt since the
  // reviewer's last round, and one toggle on the "Revised since the last build" line switches to the
  // whole video and back (remembered per video, until the next rebuild). The mode only decides what
  // plays through: the timeline still shows every beat, and a seek to an unchanged one plays it.
  get changed() { return new Set(this.planMap?.changes?.changedFrames || []); }
  // what just the changes plays: the changed beats, and any beat holding a question of the plan not yet
  // answered here. A question still in the plan map is still open (an answered one becomes a decision and
  // leaves it), so it is never skipped because its scene did not change. Quick checks and calls in
  // unchanged beats were met in the last round, and stay skipped.
  plays(i) {
    return this.changed.has(i) || (this.planMap?.decisions || []).some((d) => d.frameIndex === i && !this.decisions[d.id]);
  }
  // a revision, not a first build (where every beat is "changed" and there is nothing to skip)
  isRevision() { const n = this.changed.size; return n > 0 && n < (this.planMap?.frames || []).length; }
  initOnly() {
    const sig = this.buildSig(), at = `${this.src}|${sig}`;
    if (this._onlyFor === at) return; this._onlyFor = at; this._ranOut = false;
    if (!this.isRevision()) { this._only = false; return; }
    let saved = null, round = null;
    try { saved = JSON.parse(localStorage.getItem(this.rkey + ":only") || "null"); round = JSON.parse(localStorage.getItem(this.rkey + ":round") || "null"); } catch {}
    // the reviewer's own choice for this build; else just the changes when they sent a review of an earlier
    // build of this video (newRoundIfRebuilt has archived that round), and the whole video when they never
    // did (there is nothing they saw to skip) or when the round they sent is of this very build
    this._only = saved?.sig === sig ? !!saved.only : round?.sentAt ? round.sig !== sig : !!this._newRound;
  }

  renderChanges() {
    const sec = this.$(".changed"), ch = this.planMap?.changes;
    const list = ch?.changedFrames || [];
    this.initOnly();
    sec.hidden = !list.length;
    if (this._segs) this.renderScrub();   // the timeline marks the changed beats too
    if (!list.length) { this.$(".revised").hidden = true; this.$(".wrap").classList.remove("revised-on"); this.idle(this.stage?.dataset.ready === "1"); return; }
    const mins = (n) => n >= 60 ? `${Math.floor(n / 60)}m ${Math.round(n % 60)}s` : `${Math.round(n)}s`;
    const other = (ch.restyled || 0), many = list.length > 1;
    this.$(".chsum").textContent =
      `${list.length} scene${many ? "s" : ""} changed — ${mins(ch.changedSeconds)} of ${mins(ch.totalSeconds || this.dur() || 0)}` +
      (other ? `. ${other} more only changed how ${other > 1 ? "they look" : "it looks"}.` : ".");
    // the same, above the video: after a revise this is the first thing a reviewer needs, with the
    // mode in force said in words beside its one toggle. A first build (every beat "changed") says nothing.
    const all = !this.isRevision(), rev = this.$(".revised");
    rev.hidden = all; this.$(".wrap").classList.toggle("revised-on", !all);
    if (!all) {
      rev.querySelector(".what").innerHTML = `<b>Revised since the last build:</b> ${list.length} of ${(this.planMap?.frames || []).length} scenes changed (${mins(ch.changedSeconds)} of ${mins(ch.totalSeconds || this.dur() || 0)}), marked <span class="key"></span>on the timeline.`;
      const mode = rev.querySelector(".mode");
      mode.textContent = this._only ? `Plays just the change${many ? "s" : ""}` : "Plays the whole video";
      mode.dataset.only = this._only ? "1" : "0";
    }
    this.$$(".onlybtn").forEach((b) => { b.textContent = this._only ? "Play the whole video" : `Play just the change${many ? "s" : ""}`; b.removeAttribute("aria-pressed"); b.title = this._only ? "Switch to the whole video (the timeline still shows every scene)" : "Switch to playing only the scenes that changed"; });
    this.idle(this.stage?.dataset.ready === "1");
  }

  // the one toggle: switch the mode, remember it for this video's build, and play in the new mode
  toggleOnly() {
    if (!this.isRevision()) { this.status("Nothing changed in this build."); return; }
    this._only = !this._only; this._ranOut = false;
    try { localStorage.setItem(this.rkey + ":only", JSON.stringify({ sig: this.buildSig(), only: this._only })); } catch {}
    this.renderChanges();
    if (!this._only) { this.status("Playing the whole video."); if (this.player.paused) this.$('[data-act="play"]').click(); return; }
    // from where the reviewer is: stay on a changed beat, else the next one, else the first
    const t = this.player.currentTime || 0, here = this.frameAt(t), started = !!this.stage.dataset.started;
    const to = started && here && !this.skips(here.index) ? null : (started && this.nextChangedFrom(t)) || this.nextChangedFrom(-1);
    this.start(); if (to) this.jumpToChanged(to); this.player.play();
    this.status("Just the changes: the scenes that did not change are skipped as it plays.");
  }

  nextChangedFrom(t) {
    const fr = this.planMap?.frames || [];
    return fr.find((f) => f.start > t && !this.skips(f.index)) || null;
  }
  // Go to a changed beat. A question, quick check or call at the very end of the unchanged beat just
  // before it would fire on landing (its window runs 0.6 s past the boundary); that beat was skipped,
  // so its question is passed over too. Passed over, not asked: it is held back only while just the
  // changes play and the playhead is outside its own beat (`passedOver`), so the whole video, or a
  // seek into that beat, asks it when it is reached.
  jumpToChanged(f) {
    const asks = [...(this.planMap?.decisions || []), ...(this.planMap?.quizzes || []), ...(this.planMap?.autonomy || []), ...(this.planMap?.autonomyGroups || [])];
    for (const q of asks) if (q.at >= f.start - 0.6 && q.at < f.start + 0.7 && this.skips(q.frameIndex)) this._passed = { ...(this._passed || {}), [q.id]: true };
    this.jump(f.start);
  }
  passedOver(q, t) { return !!((this._only || !this.checksOn) && this._passed?.[q.id] && this.frameAt(t)?.index !== q.frameIndex); }

  // Called on every timeupdate. Only what PLAYS THROUGH is skipped: crossing from one beat into an
  // unchanged one as the video runs (or, with quick checks off, into a quick check's own scene: skips). A seek (the timeline, a beat in the rail, a mark) lands where it
  // was sent and plays that beat; it is told apart by the playhead moving further than the clock allows.
  skipUnchanged(t) {
    const prev = this._skipPrev, now = performance.now(), seeked = this._seeked;
    this._skipPrev = { t, at: now }; this._seeked = false;
    if ((!this._only && this.checksOn) || this.player.paused) return;
    const f = this.frameAt(t); if (!f) return;
    if (!this.skips(f.index)) { this._ranOut = false; return; }
    if (!prev || seeked || t <= prev.t) return;
    const pf = this.frameAt(prev.t);
    const ran = (t - prev.t) <= ((now - prev.at) / 1000) * (this.speed || 1) * 1.5 + 0.35;
    if (!ran || !pf || pf.index === f.index || this._ranOut) return;
    const next = this.nextChangedFrom(t);
    if (next) { this.jumpToChanged(next); return; }
    // a quick check's scene last of all, with checks off and the whole video playing: on to its end
    if (!this._only) { this.jump(this.dur()); return; }
    // past the last change: stop there, and leave the mode as the reviewer set it
    this.player.pause(); this._ranOut = true;
    this.status("That is every scene that changed. Press play to go on from here, or Play the whole video.");
  }

  // idle shows the video's own first scene as the poster, settled, so everything on it has appeared (frame 0 is blank
  // in most compositions: everything reveals on its word; a few seconds in, a count was still counting: "0 files"). A seek while paused does not count as started.
  // Run when the video is ready and again when the plan map has arrived: whichever comes last places it. A part is
  // found in the plan map, so opened at a part the poster waits for the map (on a slow network the video was ready
  // first, and ?part=2 opened at the default poster, 3 s, for good).
  poster() { if (this._posterDone || this.stage.dataset.started) return;
    if (Number(this.getAttribute("start-part")) > 0 && !this._mapTried) return;
    this._posterDone = true;
    // opened at a part (the review page's ?part=N, as a "Before you watch" link sends it): the poster is that part's start, and Play goes on from there
    const sp = Number(this.getAttribute("start-part")), ch = sp > 0 ? (this.planMap?.chapters || [])[sp - 1] : null;
    if (ch) { this._posterT = null; this.player.seek(ch.start + 0.05); this.status(`chapter ${sp}: ${ch.title || ""}`); return; }
    // opened at a moment (?t=<seconds>, as "Play that scene" on a word's meaning sends it): the poster is that scene
    const st = parseFloat(this.getAttribute("start-t")); if (st > 0) { this._posterT = null; this.player.seek(st + 0.05); const c = this.chapterAt(st); this.status(`from ${this.fmt(st)}${c ? `, chapter ${(this.planMap?.chapters || []).indexOf(c) + 1}: ${c.title || ""}` : ""}`); return; }
    // the first scene settled (its end less 0.3 s, as the guide takes a scene's picture): what it builds up has all
    // arrived (a count counted up, a list filled in), never caught half way; short of a stop inside it, if one comes first
    const f0 = (this.planMap?.frames || [])[0], dur = f0?.durationSeconds || 0;
    let t = dur > 1 ? (f0.start || 0) + dur - 0.3 : Math.min(3, (this.dur() || 6) / 2);
    const stop = this.points().map((pt) => +pt.q.at).filter((a) => Number.isFinite(a) && a >= 0 && a < t + 0.3).sort((a, b) => a - b)[0];
    if (stop != null) t = Math.max(0.2, Math.min(t, stop - 0.3));
    if (t > 0) { this._posterT = t; this.player.seek(t); } }
  start() { this.stage.dataset.started = "1"; this.hideCaptions("before", false); }   // (the poster's box is gone: the captions are back)
  // The poster's one line: how long, what the video will ask, and the key that starts it.
  idle(ready) {
    const el = this.$?.(".idle"); if (!el) return;
    el.querySelector(".go").hidden = !ready;
    if (!ready) { el.querySelector(".meta").textContent = "Loading the video…"; return; }
    const m = this.planMap || {}, a = this.calls().length, q = (m.decisions || []).length, k = (m.quizzes || []).length;
    const n = (x, w) => `${x} ${w}${x === 1 ? "" : "s"}`;
    const asks = a ? this.choiceWords() : q ? n(q, "question") : k ? (this.checksOn ? n(k, "quick check") : "quick checks off") : "";
    // in changes mode the poster says so: what will play is the changed beats, not the whole length
    const only = this._only && this.isRevision() ? `${this.fmt(this.planMap?.changes?.changedSeconds || 0)} of changes` : null;
    el.querySelector(".meta").innerHTML = esc([only || this.fmt(this.dur()), asks].filter(Boolean).join(" · ")) + '<span class="kh"> · space</span>';
  }

  // ---- accessible videos: before you watch, terms, ids never alone, walk me through it, the guard ----------
  // What a newcomer needs to follow this video, from the plan map (scripts/lib/terms.mjs): the videos it
  // assumes (prerequisites), the words it defines itself (terms), the glossary, and a gloss for each id it says.
  // (the review page's name: an older plan map has no slug, and its project is its folder, video/ or walkthrough-video/,
  // which names no video: its marks went under "video", and no "Before you watch" row could ever read them)
  get slug() { return this.planMap?.slug || reviewName(this.src) || this.planMap?.project || ""; }
  get prereqs() { return (Array.isArray(this.planMap?.prerequisites) ? this.planMap.prerequisites : []).filter((p) => p.found !== false); }
  // Watched: 80 % of it seen, or a review of it sent. Per viewer and per repo (watchedKey), under the review page's
  // name for the video, so the page's library and any video that needs this one first read the same mark, and another
  // repo's video of the same name (its system video) never does.
  // A chapter played through (80 % of its own length played, not skipped over) is kept as `parts`: a row that names
  // that chapter (system#part 5) is watched by it, without 80 % of the whole video.
  watchedOf(slug) { try { const w = JSON.parse(localStorage.getItem(this.watchedKey(slug)) || "null"); return w && (w.seen || w.sent) ? w : null; } catch { return null; } }
  markWatched(how, part = null) {
    const s = this.slug; if (!s) return;
    let w = {}; try { w = JSON.parse(localStorage.getItem(this.watchedKey(s)) || "null") || {}; } catch {}
    const now = new Date().toISOString();
    if (part != null) { if (w.parts?.[part]) return; w.parts = { ...(w.parts || {}), [part]: now }; }
    else { if (w[how]) return; w[how] = now; }
    try { localStorage.setItem(this.watchedKey(s), JSON.stringify(w)); } catch {}
  }
  watchedAll() { const out = [], pre = this.watchedKey(""); try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (!k?.startsWith(pre)) continue; const w = JSON.parse(localStorage.getItem(k) || "null"), parts = w?.parts && typeof w.parts === "object" ? Object.keys(w.parts).map(Number).filter((n) => n > 0).sort((a, b) => a - b) : []; if (w && (w.seen || w.sent || parts.length)) out.push({ video: k.slice(pre.length), ...(w.seen ? { seen: w.seen } : {}), ...(w.sent ? { sent: w.sent } : {}), ...(!w.seen && !w.sent && parts.length ? { parts } : {}) }); } } catch {} return out.sort((a, b) => a.video.localeCompare(b.video)); }
  // a chapter played through: the time it played, added up while playing (a seek or a jump over it is not watching it)
  trackParts(t) {
    const prev = this._partT; this._partT = t;
    if (prev == null || this.player?.paused) return;
    const dt = t - prev; if (!(dt > 0 && dt < 1.5)) return;
    const chs = this.planMap?.chapters || [], i = chs.findIndex((c) => t >= c.start && t < c.end); if (i < 0) return;
    const n = i + 1, c = chs[i], p = (this._partPlayed ||= {}); if (p[n] === true) return;
    p[n] = (p[n] || 0) + dt;
    if (p[n] < 0.8 * (Number(c.watchedSeconds ?? c.linearSeconds) || c.end - c.start)) return;
    p[n] = true; this.markWatched("parts", n);
  }
  // A row of "Before you watch", watched: this browser's mark (80 % seen, a review of it sent; for a row naming a
  // chapter, that chapter played through), or, on the local review page, your file's (GET /api/review's known.watched,
  // D-128), which knows what you watched in another browser, on another port, or before this page was rebuilt.
  // → { at, by: "browser" | "file" } or null
  prereqWatched(p) {
    const w = this.watchedOf(p.video), file = this._serverKnown?.watched || [];
    if (w) return { at: w.seen || w.sent, by: "browser" };
    if (p.part) { let at = null; try { at = JSON.parse(localStorage.getItem(this.watchedKey(p.video)) || "null")?.parts?.[p.part] || null; } catch {} if (at) return { at, by: "browser" }; }
    return file.includes(p.video) || (p.part && file.includes(`${p.video}#part ${p.part}`)) ? { at: null, by: "file" } : null;
  }
  // a video on this page: the review page names the videos it carries (bundle-player's `videos`); a page that names
  // none (the repo's own dev page) can open any
  onPage(video) { const v = this.getAttribute("videos"); return v == null || v.split(/\s+/).includes(video); }
  // why a video this one builds on is not on this page, in plain words (bundle-player writes the reason on the row it
  // could not carry: p.away) → { short, long } or null (no reason given: an older page, or the dev page)
  awayWords(p) {
    const v = p.video;
    if (p.away === "not-built") return { short: "Not built yet", long: `Not built yet: the video ${v} is planned in this repo but has not been made, so this page cannot carry it` };
    if (p.away === "not-found") return { short: "Not found here", long: `Not found here: this repo has no video called ${v} (it may be in another repo, or renamed)` };
    if (p.away === "too-big") return { short: "Not on this page", long: "Left off this page to keep it small enough to host: `reelplanning review` with no folder opens every video in this repo" };
    return null;
  }
  // every video on the card watched, and the viewer picked no level: the video starts without its scenes for newcomers
  levelFromBefore() {
    if (!this.planMap?.levels || this._levelSaved || this.stage?.dataset.started) return;
    const lv = this.prereqs.length && this.prereqs.every((p) => this.prereqWatched(p)) ? "familiar" : "new"; if (lv === this.level) return;
    this.level = lv; const sel = this.$(".level select"); if (sel) sel.value = lv; this.renderLevel();
  }
  prereqHref(p) { const u = new URLSearchParams({ project: p.video }); if (p.part) u.set("part", String(p.part)); return `?${u}`; }
  // "Before you watch", on the poster until the first play: a row per video this one assumes, then Start.
  // Every one watched, it is one line, and the round Play is the way in again.
  // Open over the poster, the box has the poster to itself: the frame's captions and the poster's own line (its length,
  // its choices) step aside until the first play. On a phone the poster is too short for it: a sheet under the video.
  placeBefore() {
    const el = this.$?.(".before"), idle = this.$?.(".idle"); if (!el || !idle || !this.stage) return;
    const open = !el.hidden && !el.classList.contains("one") && !this.stage.dataset.started;
    this.hideCaptions("before", open);
    const below = matchMedia("(max-width:600px)").matches;
    const under = this.$(".toolbar") || this.stage;   // under the video and its controls, as a sheet
    if (below && el.previousElementSibling !== under) under.after(el);
    else if (!below && el.parentElement !== idle) idle.prepend(el);
    el.classList.toggle("below", below);
  }
  renderBefore() {
    const el = this.$?.(".before"); if (!el) return;
    const ps = this.prereqs, left = this.freshLeft(), again = this.freshAgain(), kept = left.length || again.length;
    queueMicrotask(() => this.placeBefore());
    el.hidden = !ps.length && !kept; el.classList.remove("one"); if (el.hidden) { el.innerHTML = ""; return; }
    const seen = (p) => !!this.prereqWatched(p), all = ps.every(seen);
    const name = (p) => `${p.title}${p.part ? ` · chapter ${p.part}${p.partTitle ? `, ${p.partTitle}` : ""}` : ""}`;
    if (all && ps.length && !kept && !this._beforeOpen) {
      el.classList.add("one");
      el.innerHTML = `<p class="bl"><b>Before you watch:</b> ${ps.map((p) => esc(name(p))).join(", ")} — watched.</p><button class="lnk" data-act="before-toggle" aria-expanded="false">Show</button>`;
      return;
    }
    el.innerHTML = `<h5>Before you watch</h5>${ps.length ? `<p class="bl">This video builds on ${ps.length === 1 ? "another one" : `${ps.length} others`}. Watch ${ps.length === 1 ? "it" : "them"} first if you haven't, or start now: Terms (G) says what any word means.</p>` : ""}`
      + ps.map((p) => {
        // what the row can truly say: watched (and where that is known from); not on this page (its link would open
        // another video); or not watched here: this browser's word and your file's, not the last word
        const w = this.prereqWatched(p), here = this.onPage(p.video);
        const when = w?.at ? ` on ${new Date(w.at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}` : "";
        const said = w ? (w.by === "file" ? "Watched: your file says so (a review you sent)" : `Watched in this browser${when}`)
          : `Not watched in this browser${this._localApi?.known ? ", and your file has no review that watched it" : ""}`;
        // not on this page: why, where bundle-player knows (its `away` on the row: the video is not built yet, this repo
        // has no video of that name, or it was left off to keep the page small enough to host)
        const away = here ? null : this.awayWords(p), off = away ? `${away.long}` : "Not on this page: `reelplanning review` with no folder opens every video in this repo";
        const tip = here ? `Open ${name(p)} on the review page. ${said}.` : w ? `${said}. ${off}.` : `${off}.`;
        const tag = here ? `a class="pre" href="${esc(this.prereqHref(p))}"` : 'div class="pre" data-off';
        return `<${tag}${w ? " data-watched" : ""} title="${esc(tip)}"><span class="pt">${esc(name(p))}</span><span class="pl">${p.seconds ? esc(this.fmt(p.seconds)) : ""}</span><span class="pg"${givesWords(p.gives).ids ? ` title="${esc(`Decisions ${givesWords(p.gives).ids}`)}"` : ""}>${esc(givesWords(p.gives).text)}</span><span class="pw">${w ? "Watched" : here ? "Not watched here" : away ? away.short : "Not on this page"}</span></${here ? "a" : "div"}>`;
      }).join("")
      + this.freshLeftHtml(left, again)
      + `<div class="acts"><button class="start" data-act="poster-play">Start<kbd>Space</kbd></button>${all && ps.length && !kept ? '<button class="lnk" data-act="before-toggle" aria-expanded="true">Hide</button>' : ""}</div>`;
  }
  // What fresh eyes left as it is (videos-that-make-sense step 2): after three rounds, the findings a newcomer or a
  // designer made that the author kept, each with the reason. Said before the first play, so a confusion the
  // author chose to keep is never silent (D-225).
  freshLeft() { const l = this.planMap?.freshEyes?.left; return Array.isArray(l) ? l.filter((x) => x && (x.what || x.why)) : []; }
  // D-245: the list is only what is new to this build; a finding the author had already kept, for the same reason, in
  // an earlier round of the build (`again`, each with the round it was kept in, `as`) is one line under it, a click away
  freshAgain() { const l = this.planMap?.freshEyes?.again; return Array.isArray(l) ? l.filter((x) => x && (x.what || x.why)) : []; }
  freshLeftHtml(left, again = []) {
    if (!left.length && !again.length) return "";
    const who = (x) => (x.role === "designer" ? "the designer" : "a newcomer");
    // a line each, its first sentence cut short (the whole finding on hover): the card is read before the first play
    const short = (t, n, lead = false) => { t = String(t || "").replace(lead ? /^scenes?\s+\d+\s*[·:,.—–-]*\s*/i : /^$/, "").replace(/\s+/g, " ").trim(); const one = (/^(.+?[.;])(\s|$)/.exec(t) || [, t])[1].replace(/;$/, ""); return one.length > n ? `${one.slice(0, n - 1).replace(/[\s,;:]+\S*$/, "")}…` : one; };
    const li = (x) => `<li title="${esc(`${x.what || ""}\nKept: ${x.why || ""}`)}"><span class="fw">${x.scene ? `Scene ${esc(x.scene)} · ` : ""}${esc(who(x))}: ${esc(short(x.what, 110, true))}</span><span class="fy">Kept: ${esc(short(x.why, 120))}</span></li>`;
    // a few on the card; the rest one click down, so a long list never pushes Start off the poster
    const SHOWN = 3, rest = left.slice(SHOWN);
    const lead = left.length ? `<b>Left as ${left.length === 1 ? "it is" : "they are"}:</b> two fresh agents, a newcomer and a designer, looked at this video before you. After three rounds, the author kept ${left.length === 1 ? "this" : `these ${left.length}`}${again.length ? ", new in this build," : ""} and says why.`
      : `<b>Left as they are:</b> two fresh agents, a newcomer and a designer, looked at this video before you. Nothing new was kept in this build's rounds.`;
    const was = (x) => `<li title="${esc(`${x.what || ""}\nKept: ${x.why || ""}${x.as ? `\nKept before: ${x.as}` : ""}`)}"><span class="fw">${x.scene ? `Scene ${esc(x.scene)} · ` : ""}${esc(who(x))}: ${esc(short(x.what, 110, true))}</span><span class="fy">Kept${x.as ? ` in ${esc(x.as)}` : ""}: ${esc(short(x.why, 120))}</span></li>`;
    return `<div class="fleft" role="group" aria-label="What fresh eyes left as it is"><p class="bl">${lead}</p>${left.length ? "<ul>" + left.slice(0, SHOWN).map(li).join("") + "</ul>" : ""}`
      + (rest.length ? `<details class="fmore"><summary>${rest.length} more</summary><ul>${rest.map(li).join("")}</ul></details>` : "")
      + (again.length ? `<details class="fmore fagain"><summary>${left.length ? "and " : ""}${again.length} ${left.length ? "more " : ""}the author had already kept, for the same reason, in an earlier round</summary><ul>${again.map(was).join("")}</ul></details>` : "") + "</div>";
  }
  // The words: this video's own first (with where it defines them), then the glossary.
  termList() {
    const m = this.planMap || {}, g = Array.isArray(m.glossary) ? m.glossary : [];
    const own = (m.terms || []).map((t) => { const k = String(t).toLowerCase(), row = g.find((x) => (x.forms || []).includes(k)), f = (m.frames || []).find((x) => (x.defines || []).includes(k));
      // its plain word against the files' name (the row's forms[0]), not against the word the video says: a video's
      // own terms are its on-screen words ("choice"), and compared with themselves they looked like no plain word
      // its meaning: the glossary's, else the storyboard's own (`terms: x = …`, D-216: plan-map's termMeanings)
      return { key: k, term: row?.term || String(t), display: this.shown(row, row?.forms?.[0] || k), meaning: row?.meaning || m.termMeanings?.[k] || null, said: row?.said ?? null, files: row?.files || null, forms: row?.forms || [k], definedIn: row?.definedIn || null, at: f ? f.start : null, own: true }; });
    return [...own, ...g.filter((x) => !own.some((o) => (x.forms || []).includes(o.key))).map((x) => ({ key: (x.forms || [])[0], term: x.term, display: this.shown(x, (x.forms || [])[0]), meaning: x.meaning, said: x.said ?? null, files: x.files || null, forms: x.forms || [], definedIn: x.definedIn || null }))].filter((x) => x.key);
  }
  // D-127: the word a viewer sees for a glossary row, where it differs from the files' (its `display`, else PLAIN)
  shown(row, key) { const d = row?.display || PLAIN[String(key || "").toLowerCase()] || ""; return d && d.toLowerCase() !== String(key || "").toLowerCase() ? d : ""; }
  // a term as the viewer reads it: the plain word ("Choice"), and the files' name as a small note after it
  // ("in the files: call"); a term with no plain word of its own is its name without "A" or "The"
  termTitle(x) { const bare = String(x.term).replace(/^(the|an?)\s+/i, ""); return x.display ? this.cap(x.display) : bare !== x.term ? this.cap(bare) : x.term; }
  termName(x) { return x.display ? `${esc(this.termTitle(x))}<span class="fn"><span class="sr"> · </span>in the files: ${esc(String(x.term).replace(/^(the|an?)\s+/i, ""))}</span>` : esc(this.termTitle(x)); }
  // A meaning as the panel shows it (D-127, and the owner: "the way it has text is not great … harder to read"):
  // its first plain sentence or two (lead), the rest (more), and where the files say it (files), each as HTML with
  // its *emphasis* and `code`. A plan map from before the split (no `said`) is split here, the same way.
  meaningOf(x) {
    if (!x.meaning && !x.said) return { lead: "", more: "", files: [] };
    const old = x.said == null, v = old ? splitMeaning(x.meaning, [x.term, x.display]) : { said: x.said, files: x.files || [] }, { lead, more } = leadOf(v.said);
    const html = (t) => this.glossHtml(old ? codeBare(t) : t, { terms: false, md: true });
    return { lead: html(lead), more: more ? html(more) : "", files: v.files.map(html) };
  }
  termFor(key) { return this.termList().find((x) => x.key === key || x.forms.includes(key)) || null; }
  // The player's own words, escaped: each glossary word underlined once (a click says what it means), and
  // each id said with what it is — "D-056" becomes "D-056 · decision: <what was decided>" (plan map ids{}).
  glossHtml(text, { terms = true, ids = true, md = false } = {}) {
    const m = this.planMap || {};
    const parts = [{ t: String(text ?? ""), raw: false }];
    if (terms) {
      const list = this.termList(), forms = list.flatMap((x) => x.forms.filter(formOk).map((w) => ({ w, key: x.key, known: this.isKnown(x) }))).sort((a, b) => b.w.length - a.w.length);
      const used = new Set();
      for (const { w, key, known } of forms) {
        if (used.has(key)) continue;
        const re = w.length === 2 ? new RegExp(`(^|[^\\w-])(${w.toUpperCase()}s?)(?![\\w-])`) : new RegExp(`(^|[^\\w-])(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "[\\s-]+")}(?:s|es)?)(?![\\w-])`, "i");
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i]; if (p.raw) continue; const x = re.exec(p.t); if (!x) continue;
          const at = x.index + x[1].length, word = x[2];
          parts.splice(i, 1, { t: p.t.slice(0, at), raw: false }, { t: `<span class="term${known ? " known" : ""}" data-term="${esc(key)}" tabindex="0" role="button">${esc(word)}</span>`, raw: true }, { t: p.t.slice(at + word.length), raw: false });
          used.add(key); break;
        }
      }
    }
    let html = parts.map((p) => (p.raw ? p.t : md ? mdInline(p.t) : esc(p.t))).join("");   // md: *emphasis* and `code` (a glossary meaning), with terms off
    if (ids && m.ids) { const done = new Set(); html = html.replace(ID_RE, (all, id) => { const k = normId(id), e = m.ids[k]; if (!e || done.has(k)) return all; done.add(k); return `<span class="idg">${all} · ${esc(e.kind)}${e.gloss ? `: ${esc(e.gloss)}` : ""}</span>`; }); }
    return html;
  }
  // an underlined word, clicked: what it means, in a small card by it
  // `el` is the word clicked (in the player's text), or { term, rect } for a word in the frame's captions.
  showTerm(el, rect = null) {
    const x = this.termFor(el.dataset?.term ?? el.term), pop = this.$(".tpop"); if (!x || !pop) return;
    if (this._tpopFor === (el.dataset ? el : x.key) && !pop.hidden) { this.hideTerm(); return; }
    // a word clicked in the captions pauses the video: its meaning is read on the frame it was said over
    // (videos-you-can-follow step 1); a word in the player's own text leaves the video as it is (A18)
    if (rect && this.player && !this.player.paused) this.player.pause();
    const mo = this.meaningOf(x);
    pop.innerHTML = `<b>${this.termName(x)}</b><span class="tl">${mo.lead || "Defined in this video."}</span>${this.whereExplained(x)}<span class="tw"><button class="lnk" data-act="ask-term" data-term="${esc(x.key)}">Still unclear? Ask about this</button></span>`;
    pop.hidden = false; this._tpopFor = el.dataset ? el : x.key;
    const r = rect || el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = `${Math.max(16, Math.min(innerWidth - w - 16, r.left))}px`;
    pop.style.top = `${r.top - h - 8 >= 8 ? r.top - h - 8 : r.bottom + 8}px`;
    this.termsOpened = (this.termsOpened || 0) + 1; this.persistTerms();
    this.lookedUp(x.key);
    this.holdWait();   // reading what a word means is not letting the video go on
  }
  // Where a word is explained (glossary[].definedIn, the system video's scene first) and the way to play it:
  // a jump within this video, or the review page opened at that scene (?project=<video>&t=<start>).
  whereExplained(x) {
    const d = x.definedIn;
    if (!d) return x.at != null ? ` <button class="lnk" data-jump="${x.at}">Play where it is defined, ${this.fmt(x.at)}</button>` : "";
    const here = d.video === this.slug, pre = this.prereqs.find((q) => q.video === d.video);
    const name = here ? "this video" : d.video === "system" ? "the system video" : pre?.title ? `“${pre.title}”` : `the video ${d.video.replace(/--walkthrough$/, " (walkthrough)")}`;
    const where = `Explained in ${name}${d.chapter ? `, chapter ${d.chapter}${d.chapterTitle ? ` · ${d.chapterTitle}` : ""}` : ""}${d.title && !d.chapter ? `, “${d.title}”` : ""}.`;
    const go = !Number.isFinite(d.start) ? "" : here ? ` <button class="lnk" data-jump="${d.start}">Play that scene, ${this.fmt(d.start)}</button>` : ` <a class="lnk" href="${esc(`?${new URLSearchParams({ project: d.video, t: String(d.start) })}`)}">Play that scene</a>`;
    return `<span class="tw">${esc(where)}${go}</span>`;
  }
  // Words in the captions can be clicked (videos-you-can-follow step 1): a glossary word the narration says (any of
  // its forms: the files' name or the word on screen) is underlined in the frame's captions; a click on it pauses
  // the video and shows what it means, by the word. The frame's page is not clicked itself (the runtime's iframe
  // takes no pointer), so the stage finds the word under a click (termAtPoint).
  wireCaptions() {
    let doc; try { doc = this.player?.iframeElement?.contentDocument; } catch { return; } if (!doc?.documentElement) return;
    if (doc.documentElement.dataset.rpTerms) { this.syncKnownIn(doc); return; }
    const list = this.termList(); if (!list.length) return;
    const sig = String(list.length);
    const lines = [...doc.querySelectorAll(".caption-line")]; if (!lines.length) return;
    if (!doc.getElementById("rp-term-style")) { const st = doc.createElement("style"); st.id = "rp-term-style"; st.textContent = "[data-rp-term]{text-decoration:underline dotted;text-decoration-thickness:.08em;text-underline-offset:.2em;pointer-events:auto}[data-rp-term][data-rp-known]{text-decoration:none}"; (doc.head || doc.documentElement).appendChild(st); }
    const forms = list.flatMap((x) => x.forms.filter(formOk).map((w) => ({ parts: w.split(/[\s-]+/).filter(Boolean), key: x.key, caps: w.length === 2 }))).sort((a, b) => b.parts.length - a.parts.length);
    const norm = (t) => String(t).toLowerCase().replace(/[’]/g, "'").replace(/^[^\w]+|[^\w]+$/g, "");
    for (const line of lines) {
      const spans = [...line.querySelectorAll(".caption-word")], tok = spans.map((x) => norm(x.textContent)), raw = spans.map((x) => String(x.textContent).replace(/^[^\w]+|[^\w]+$/g, ""));
      for (let i = 0; i < tok.length; i++) {
        // a two-letter acronym (PR, CI) is matched in capitals only: "pr" or "ci" in a word is not it
        const f = forms.find((f) => (!f.caps || /^[A-Z]{2}s?$/.test(raw[i] || "")) && f.parts.every((w, j) => tok[i + j] === w || (j === f.parts.length - 1 && (tok[i + j] === `${w}s` || tok[i + j] === `${w}es`))));
        if (!f) continue;
        for (let j = 0; j < f.parts.length; j++) spans[i + j].dataset.rpTerm = f.key;
        i += f.parts.length - 1;
      }
    }
    doc.documentElement.dataset.rpTerms = sig;
    this.syncKnownIn(doc, true);
  }
  // ---- words the viewer knows (D-218) -------------------------------------------------------------------
  // A word stays underlined until the viewer knows it: looked up (its card, or its More in Terms), the scene that
  // explains it watched (in this video, played to the scene's end; elsewhere, the video its definedIn names
  // marked watched, D-128), or, on the local review page, what ~/.reelplanning/you.jsonl says (GET /api/review's
  // `known`). Then it reads plainly: still in Terms, still a click away from its meaning, not underlined.
  knownKeys() { if (!this._known) { let a = []; try { a = JSON.parse(localStorage.getItem(KNOWN_KEY) || "[]"); } catch {} this._known = new Set(Array.isArray(a) ? a : []); } return this._known; }
  isKnown(x) {
    if (!x) return false;
    const has = (list) => !!list && (list.has ? list.has(x.key) || x.forms.some((f) => list.has(f)) : list.some((k) => k === x.key || x.forms.includes(k)));
    if (has(this.knownKeys()) || has(this._serverKnown?.looked)) return true;
    const v = x.definedIn?.video;
    return !!v && (!!this.watchedOf(v) || !!this._serverKnown?.watched?.includes(v));
  }
  knowTerm(key) {
    const s = this.knownKeys(); if (!key || s.has(key)) return;
    s.add(key); try { localStorage.setItem(KNOWN_KEY, JSON.stringify([...s])); } catch {}
    this.syncKnown();
  }
  // show what is known now: the player's own dotted words and the captions'
  syncKnown() {
    this._knownRev = (this._knownRev || 0) + 1;
    for (const el of this.shadowRoot?.querySelectorAll(".term[data-term]") || []) el.classList.toggle("known", this.isKnown(this.termFor(el.dataset.term)));
    let doc; try { doc = this.player?.iframeElement?.contentDocument; } catch {} if (doc?.documentElement?.dataset.rpTerms) this.syncKnownIn(doc, true);
  }
  syncKnownIn(doc, force = false) {
    const rev = String(this._knownRev || 0); if (!force && doc.documentElement.dataset.rpKnownRev === rev) return;
    const memo = {};
    for (const el of doc.querySelectorAll("[data-rp-term]")) { const k = el.dataset.rpTerm; memo[k] ??= this.isKnown(this.termFor(k)); if (memo[k]) el.dataset.rpKnown = ""; else delete el.dataset.rpKnown; }
    doc.documentElement.dataset.rpKnownRev = rev;
  }
  // a scene that defines words (its `defines`), played to its end (80 % of it, by playing, not seeking): its words are known
  trackDefined(t) {
    const prev = this._defT; this._defT = t;
    if (prev == null || this.player?.paused) return;
    const dt = t - prev; if (!(dt > 0 && dt < 1.5)) return;
    const f = this.frameAt(t); if (!f?.defines?.length || this._defDone?.[f.index]) return;
    const p = (this._defPlayed ||= {}); p[f.index] = (p[f.index] || 0) + dt;
    if (p[f.index] < Math.max(1, 0.8 * (f.durationSeconds || 0))) return;
    (this._defDone ||= {})[f.index] = true;
    for (const w of f.defines) { const x = this.termFor(String(w).toLowerCase()); if (x) this.knowTerm(x.key); }
  }
  // the underlined caption word under a point on the page, if the caption it is in is showing
  termAtPoint(x, y) {
    let doc, ifr; try { ifr = this.player.iframeElement; doc = ifr?.contentDocument; } catch { return null; } if (!doc?.documentElement?.dataset.rpTerms) return null;
    const fr = ifr.getBoundingClientRect(), win = doc.defaultView; if (!fr.width || !win.innerWidth) return null;
    const sx = fr.width / win.innerWidth, sy = fr.height / win.innerHeight, ix = (x - fr.left) / sx, iy = (y - fr.top) / sy;
    if (ix < 0 || iy < 0 || ix > win.innerWidth || iy > win.innerHeight) return null;
    const seen = (e) => { for (let n = e; n && n !== doc.documentElement; n = n.parentElement) { const cs = win.getComputedStyle(n); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.5) return false; } return true; };
    const el = doc.elementsFromPoint(ix, iy).find((e) => e.dataset?.rpTerm && seen(e)); if (!el) return null;
    const r = el.getBoundingClientRect();
    return { key: el.dataset.rpTerm, rect: { left: fr.left + r.left * sx, top: fr.top + r.top * sy, right: fr.left + r.right * sx, bottom: fr.top + r.bottom * sy } };
  }
  // the words whose meaning was opened in this review, by key (forms[0]), once each (videos-you-can-follow step 3)
  lookedUp(key) { if (!key) return; this.knowTerm(key); const s = new Set(this.termsLookedUp || []); if (s.has(key)) return; s.add(key); this.termsLookedUp = [...s]; try { localStorage.setItem(this.rkey + ":termkeys", JSON.stringify(this.termsLookedUp)); } catch {} }
  hideTerm() { const pop = this.$?.(".tpop"); if (!pop || pop.hidden) return false; pop.hidden = true; this._tpopFor = null; return true; }
  persistTerms() { try { localStorage.setItem(this.rkey + ":terms", String(this.termsOpened || 0)); } catch {} }
  // Terms (G): the side panel a detail opens in, with every word this video uses, the ones the beat on
  // screen says first. The video waits behind it, as behind a detail, and goes on when it closes.
  toggleTerms() { if (this._topen && this._topen.mode !== "ask") this.closeTerms(); else { if (this._topen) this.closeTerms(); this.openTerms(); } }
  openTerms() {
    if (this._topen || !this.termList().length) return;
    if (this._dopen) this.closeDetail();
    const t = this.player.currentTime ?? this._lastT, wasPlaying = !this.player.paused;
    this.player.pause(); this.closeMarkBox(true); this.hideTerm();
    if (this._pendingDecision && !this._folded) { this.fold(true); this._autoFolded = true; }
    this._topen = { t, wasPlaying };
    this.termsOpened = (this.termsOpened || 0) + 1; this.persistTerms();
    const P = this.$(".dpanel"); P.dataset.terms = ""; P.setAttribute("aria-label", "Terms");
    P.querySelector(".k").textContent = "Terms"; P.querySelector(".k").title = "";
    const h = P.querySelector("h5"); h.textContent = "What the words mean"; h.title = "";
    const why = P.querySelector(".why"); why.textContent = "The words this scene says come first."; why.hidden = false;
    const box = P.querySelector(".terms"); box.innerHTML = this.termsHtml(); box.hidden = false;
    // a word's More opened is a word looked up (D-218): it reads plainly from now on
    if (!box._rpLook) { box._rpLook = true; box.addEventListener("toggle", (e) => { const d = e.target; if (d?.open && d.dataset?.term) this.lookedUp(d.dataset.term); }, true); }
    P.hidden = false; this.$(".wrap").classList.add("dopen"); this.$(".termsbtn")?.setAttribute("aria-pressed", "true");
    this.measurePeek();
    P.querySelector('[data-act="detail-close"]').focus({ preventScroll: true });
    this.status("the terms are open; G or Esc closes them");
  }
  closeTerms() {
    const o = this._topen; if (!o) return false; this._topen = null; this._notice = null;
    const P = this.$(".dpanel"); P.hidden = true; delete P.dataset.terms; delete P.dataset.ask; P.setAttribute("aria-label", "Guide"); P.querySelector(".terms").hidden = true; P.querySelector(".ask").hidden = true;
    this.$(".wrap").classList.remove("dopen"); this.$(".termsbtn")?.setAttribute("aria-pressed", "false"); this.$(".askbtn")?.setAttribute("aria-pressed", "false");
    this.measurePeek(); this.focus({ preventScroll: true });
    if (this._autoFolded && this._pendingDecision && this._folded) this.fold(false);
    this._autoFolded = false;
    const here = Math.abs((this.player.currentTime ?? o.t) - o.t) < 0.5;
    if (o.wasPlaying && this.player.paused && here && !this.asking()) this.player.play();
    this.updateStatus();
    return true;
  }
  termsHtml() {
    const all = this.termList(), f = this.frameAt(this.watchedT()), here = new Set(f?.terms || []);
    const is = (x) => here.has(x.key) || x.forms.some((w) => here.has(w));
    // each word: its plain name, one or two plain sentences, then the rest and where the files say it behind "More"
    const row = (x) => { const m = this.meaningOf(x);
      return `<dt>${this.termName(x)}</dt><dd><p class="tlead">${m.lead || "Defined in this video."}${x.at != null ? `<button class="tm" data-jump="${x.at}" title="Play where this video defines it">${this.fmt(x.at)}</button>` : ""}</p>`
        + (m.more || m.files.length ? `<details class="tmore" data-term="${esc(x.key)}"><summary>More</summary>${m.more ? `<p>${m.more}</p>` : ""}${m.files.length ? `<p class="tfiles"><span class="tfk">In the files:</span> ${m.files.join("; ")}</p>` : ""}</details>` : "") + `</dd>`; };
    const now = all.filter(is), own = all.filter((x) => x.own && !is(x)), rest = all.filter((x) => !x.own && !is(x));
    return [now.length ? `<h6>In this scene</h6><dl class="here">${now.map(row).join("")}</dl>` : "", own.length ? `<h6>This video's own words</h6><dl>${own.map(row).join("")}</dl>` : "", rest.length ? `<h6>The glossary</h6><dl>${rest.map(row).join("")}</dl>` : ""].join("");
  }
  // ---- Ask about this (videos-that-make-sense step 3, D-226) ----------------------------------------------------
  // Paused on any scene, a question in your own words ("what's the saved review file?"), answered from the plan, the
  // glossary and this scene's narration and frame, each answer saying where it came from. Who answers:
  //   a hosted page (a Claude Artifact declaring `sample`): Claude, on the viewer's own account; the first call asks
  //     their consent; called only on a click, never retried by the page (rate_limited backs off to the viewer);
  //   the local page (`reelplanning review`): the agent session waiting on it (`review --wait`) answers in a few seconds
  //     (POST /api/ask, then GET /api/ask?id= until it has); with none waiting, the page says so;
  //   anywhere else, or nobody to answer: the question goes with your review, answered in the next version.
  // Every question is kept in the review (`questions`), counts in `reel memory lost` like a word looked up, and goes to
  // the next video's newcomer (fresh eyes). `window.claude` is reached only through `use()`, and only when it is there.
  reachSample() {
    if (this._sampleReady) return this._sampleReady;
    this._sample = null;
    this._sampleReady = (async () => {
      try { const use = window.claude?.use; this._sample = typeof use === "function" ? (await use.call(window.claude, "sample")) || null : null; } catch { this._sample = null; }
      if (this._topen?.mode === "ask") this.renderAsk();
      return this._sample;
    })();
    return this._sampleReady;
  }
  // the words of a caption under a point, when the caption is showing: the sentence it is in
  captionAtPoint(x, y) {
    let doc, ifr; try { ifr = this.player?.iframeElement; doc = ifr?.contentDocument; } catch { return null; } if (!doc?.documentElement) return null;
    const fr = ifr.getBoundingClientRect(), win = doc.defaultView; if (!fr.width || !win?.innerWidth) return null;
    const ix = (x - fr.left) / (fr.width / win.innerWidth), iy = (y - fr.top) / (fr.height / win.innerHeight);
    if (ix < 0 || iy < 0 || ix > win.innerWidth || iy > win.innerHeight) return null;
    const seen = (e) => { for (let n = e; n && n !== doc.documentElement; n = n.parentElement) { const cs = win.getComputedStyle(n); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.5) return false; } return true; };
    const w = doc.elementsFromPoint(ix, iy).find((e) => e.classList?.contains("caption-word") && seen(e)); if (!w) return null;
    const line = w.closest(".caption-line") || w.parentElement;
    return String(line?.textContent || w.textContent || "").replace(/\s+/g, " ").trim() || null;
  }
  openAsk({ quote = null, prefill = "" } = {}) {
    const P = this.$(".dpanel"), ta = P.querySelector(".ask [data-ask]");
    if (this._topen?.mode === "ask") { if (quote) this._askQuote = quote; if (prefill && !ta.value.trim()) ta.value = prefill; this.renderAsk(); ta.focus({ preventScroll: true }); return; }
    if (this._topen) this.closeTerms();
    if (this._dopen) this.closeDetail();
    const t = this.player.currentTime ?? this._lastT, wasPlaying = !this.player.paused;
    this.player.pause(); this.closeMarkBox(true); this.hideTerm();
    if (this._pendingDecision && !this._folded) { this.fold(true); this._autoFolded = true; }
    this._topen = { t, wasPlaying, mode: "ask" }; this._askAt = t; this._askQuote = quote;
    P.dataset.terms = ""; P.dataset.ask = ""; P.setAttribute("aria-label", "Ask about this");
    const fr = this.frameAt(t); P.querySelector(".k").textContent = fr ? `Scene ${fr.index}` : "Ask"; P.querySelector(".k").title = "";
    const h = P.querySelector("h5"); h.textContent = "Ask about this"; h.title = "";
    const why = P.querySelector(".why"); why.textContent = "A word, a phrase, what a picture shows: ask in your own words."; why.hidden = false;
    P.querySelector(".terms").hidden = true; P.querySelector(".ask").hidden = false;
    if (prefill) ta.value = prefill;
    if (!ta._rpAsk) { ta._rpAsk = true; ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.askSend(); } }); }
    this.renderAsk();
    P.hidden = false; this.$(".wrap").classList.add("dopen"); this.$(".askbtn")?.setAttribute("aria-pressed", "true");
    this.measurePeek();
    ta.focus({ preventScroll: true });
    this.status("Ask about this scene: Enter asks; Q or Esc closes");
    // on the local page, whether a session waits now (it may have started since the page opened)
    if (this.isLocalPage()) this.refreshLocal().then(() => { if (this._topen?.mode === "ask") this.renderAsk(); });
  }
  // who answers here, for the line under the box: claude | session | nobody (the local page, no session) | review
  askRoute() { return this._sample ? "claude" : this._localApi ? (this._localApi.sessionWaiting ? "session" : "nobody") : "review"; }
  renderAsk() {
    const box = this.$(".dpanel .ask"); if (!box) return;
    if (this._dq) this.renderDetailAnswer();
    const t = this._askAt ?? this.watchedT(), f = this.frameAt(t);
    box.querySelector(".askabout").innerHTML = `About ${f ? `scene ${f.index}, <b>${esc(plainTitle(f.title))}</b>, ` : ""}at ${esc(this.fmt(t))}${this._askQuote ? `: <q>${esc(this._askQuote)}</q>` : ""}.`;
    const from = this.isExplainer ? "the explainer's sources" : "the plan";
    box.querySelector(".askhow").textContent = { claude: `Claude answers from ${from}, the glossary and this scene, and says where the answer came from. It runs on your Claude account: the first question asks you to allow it.`,
      session: `The agent session waiting on this page answers, in a few seconds, from ${from}, the glossary and this scene.`,
      nobody: "No agent session is waiting on this page, so your question goes with your review and is answered in the next version.",
      review: "Your question goes with your review, and is answered in the next version." }[this.askRoute()];
    const asking = !!this._asking; box.querySelector(".askgo").disabled = asking; box.querySelector(".askstop").hidden = !(asking && this._askCtl);
    const mine = (this.questions || []).slice().reverse();
    box.querySelector(".asklist").innerHTML = mine.map((q) => `<li data-q="${esc(q.id)}">${this.askItemHtml(q)}</li>`).join("");
  }
  askItemHtml(q) {
    const where = `${q.detail ? `In the guide, ${q.detail.title || q.detail.name}: ` : ""}${q.frame ? `Scene ${q.frame.index}, ${plainTitle(q.frame.title)}, at ${this.fmt(q.t)}` : `At ${this.fmt(q.t)}`}`;
    const state = q.status === "asking" ? "thinking" : q.status === "waiting" ? "waiting" : q.answer ? "answered" : "none";
    const body = q.answer ? esc(q.answer) : q.status === "asking" ? "Thinking…" : q.status === "waiting" ? "Asked the agent session waiting on this page…" : esc(q.note || "Goes with your review, to be answered in the next version.");
    return `<p class="aq">${esc(q.question)}</p><p class="aw">${esc(where)}</p><p class="aa" data-state="${state}">${body}</p>`
      + (q.answer && q.note ? `<p class="af">${esc(q.note)}</p>` : "")
      + (q.answer && q.from ? `<p class="af"><b>From:</b> ${esc(q.from)}${q.via === "session" ? " · answered by the agent session" : q.via === "claude" ? " · answered by Claude" : ""}</p>` : "");
  }
  renderAskItem(q) { if (this._dq?.id === q.id) this.renderDetailAnswer(); const li = this.$(`.dpanel .asklist li[data-q="${CSS.escape(q.id)}"]`); if (li) li.innerHTML = this.askItemHtml(q); else if (this._topen?.mode === "ask") this.renderAsk(); }
  // One answer per question, whichever place gave it: a part over the frame, or the guide's own
  // page (in another tab, through storage); the later one is kept.
  answerFromGuide(qid, optionId, { at = new Date().toISOString() } = {}) {
    const d = (this.planMap?.decisions || []).find((x) => x.id === qid), o = d?.options?.find((x) => x.id === optionId); if (!d || !o) return false;
    const was = this.decisions[d.id]; if (was?.decidedAt && was.decidedAt > at) return false;
    this.decisions[d.id] = { option: o.id, label: o.label, recommended: !!o.recommended, planStep: d.planStep ?? null, question: d.question, t: d.at ?? d.start ?? 0, decidedAt: at, via: "guide" };
    this.saveDecisions(); this.renderDecisions(); this.syncGallery?.(); this.updateStatus?.();
    this.status(`answered ${String(d.id).toUpperCase()} on the guide: ${o.label}`);
    return true;
  }
  onStorage(e) {
    if (!this.src || !e.key || !e.newValue) return;
    let v; try { v = JSON.parse(e.newValue); } catch { return; }
    if (e.key === this.rkey + ":decisions" && v && typeof v === "object" && !Array.isArray(v)) { for (const [id, x] of Object.entries(v)) if (x?.via === "guide" && x.decidedAt !== this.decisions[id]?.decidedAt) this.answerFromGuide(id, x.option, { at: x.decidedAt }); return; }
    if (!Array.isArray(v)) return;
    if (e.key === this.rkey) {
      const have = new Set((this.annotations || []).map((a) => a.id)), add = v.filter((a) => a && a.id && !have.has(a.id));
      // a note highlighted in the guide (packages/player/guide-review.js, via "guide") is the guide's to change: its words
      // edited there, or the note deleted there, are taken as they are (else this page's next write would put them back)
      const theirs = new Map(v.filter((a) => a?.via === "guide" && a.id).map((a) => [a.id, a]));
      let moved = false;
      const kept = (this.annotations || []).filter((a) => a.via !== "guide" || theirs.has(a.id) || (moved = true, false)).map((a) => {
        const t = a.via === "guide" ? theirs.get(a.id) : null;
        if (t && (t.comment !== a.comment || JSON.stringify(t.edit || null) !== JSON.stringify(a.edit || null))) { moved = true; return { ...a, comment: t.comment, ...(t.edit ? { edit: t.edit } : {}) }; }
        return a;
      });
      if (add.length || moved) { this.annotations = [...kept, ...add]; this.renderList(); this.redraw(); this.syncClear(); this.updateStatus(); }
    } else if (e.key === this.rkey + ":questions") {
      const byId = new Map((this.questions || []).map((q) => [q.id, q])); let moved = false;
      for (const q of v) { if (!q?.id) continue; const was = byId.get(q.id); if (!was || (q.answer && !was.answer)) { byId.set(q.id, was ? Object.assign(was, q) : q); moved = true; } }
      if (moved) { this.questions = [...byId.values()]; if (this._topen?.mode === "ask") this.renderAsk(); }
    }
  }
  persistQuestions() { try { localStorage.setItem(this.rkey + ":questions", JSON.stringify(this.questions || [])); } catch {} }
  async askSend() {
    const ta = this.$(".dpanel .ask [data-ask]"), text = String(ta?.value || "").replace(/\s+/g, " ").trim();
    if (!text || this._asking) return;
    const t = this._askAt ?? this.watchedT(), f = this.frameAt(t);
    const q = { id: `ask-${Date.now().toString(36)}`, question: text.slice(0, 2000), t: +Number(t).toFixed(2), frame: f ? { index: f.index, title: f.title } : null, planStep: f?.planStep ?? null,
      askedAt: new Date().toISOString(), ...(this._askQuote ? { quote: this._askQuote } : {}), status: "asking" };
    this.questions = [...(this.questions || []), q]; ta.value = ""; this._asking = q.id;
    this.persistQuestions(); this.renderAsk();
    try { await this.routeAsk(q); } finally { this._asking = null; this._askCtl = null; this.persistQuestions(); this.renderAsk(); }
  }
  // who answers (the rule above): Claude where the page has `sample`, the waiting session on the local page, else the review
  async routeAsk(q) {
    await this.reachSample();   // resolved at load; null where there is no `sample`, and null again once refused (not_granted)
    if (this._sample) await this.askClaude(q);
    else if (await this.reachLocal()) await this.askLocal(q);
    else Object.assign(q, { status: "review", via: "review" });
  }
  // the answer's last line, "From: …", is where it came from
  splitFrom(text) { const s = String(text || "").replace(/\s+$/, ""), m = /\n?\s*\**From:\**\s*(.+?)\s*$/i.exec(s); return m ? { answer: s.slice(0, m.index).trim(), from: m[1].replace(/\*+/g, "").trim() } : { answer: s.trim(), from: null }; }
  askClaude(q) {
    const ctl = new AbortController(); this._askCtl = ctl; this.renderAsk();
    return this._sample(this.askPrompt(q), { signal: ctl.signal, modelTier: "quick", onText: ({ text }) => { q.answer = this.splitFrom(text).answer; this.renderAskItem(q); } })
      .then(({ text, truncated }) => { const s = this.splitFrom(text); Object.assign(q, { answer: s.answer, from: s.from || "not said", via: "claude", status: "answered", answeredAt: new Date().toISOString(), ...(truncated ? { note: "Cut short: ask for less at a time." } : {}) }); })
      .catch((e) => {
        const code = String(e?.code || "upstream_error");
        if (["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"].includes(code)) {
          // Claude is not to be used here, for the rest of this view: every later question goes the other way
          this._sample = null; Object.assign(q, { answer: "", status: "review", via: "review", note: code === "not_granted" ? "Claude isn't allowed to answer on this page, so your question goes with your review." : "Claude can't answer on this page, so your question goes with your review." });
        } else if (code === "cancelled") Object.assign(q, { answer: e?.text || "", status: e?.text ? "answered" : "review", note: "Stopped. " + (e?.text ? "" : "Your question goes with your review.") });
        else if (code === "rate_limited") Object.assign(q, { answer: e?.text || "", status: "review", note: "Too many questions just now: ask again in a minute. This one goes with your review." });
        else if (code === "session_expired") Object.assign(q, { answer: "", status: "review", note: "Sign in to Claude again to ask. This question goes with your review." });
        else if (code === "refused") Object.assign(q, { answer: "", status: "review", note: "Claude would not answer that; try asking it another way. It goes with your review." });
        else Object.assign(q, { answer: e?.text || "", status: "review", note: "No answer this time. Your question goes with your review." });
      });
  }
  // What Claude reads (it remembers nothing between calls): the instructions, the scene, its plan section and the glossary rows.
  askPrompt(q) {
    const m = this.planMap || {}, f = (m.frames || []).find((x) => x.index === q.frame?.index) || this.frameAt(q.t) || {};
    const clip = (s, n) => { s = String(s || "").replace(/\s+\n/g, "\n").trim(); return s.length > n ? `${s.slice(0, n - 1)}…` : s; };
    let onFrame = ""; try { const F = this.frameRoot({ frameIndex: f.index }); onFrame = clip(F?.root?.innerText || F?.root?.textContent || "", 2500); } catch {}
    const step = f.planStep != null ? (m.plan?.steps || []).find((s) => Number(s.n) === Number(f.planStep)) : null;
    const plan = step ? `### Step ${step.n} — ${step.title}\n${clip(step.text, 6000)}` : m.plan?.problem ? `### The problem\n${clip(m.plan.problem, 4000)}` : "(no plan text: this video explains the system itself)";
    // an explainer has no plan: it answers from its pinned sources, the scene's first (the lines
    // its frame quotes are theirs, word for word)
    const ex = this.isExplainer ? m.explainer || {} : null;
    const sources = ex ? `What was asked: "${clip(ex.question || m.title || "", 400)}" (explained at ${ex.commit || "?"})\nThis scene's sources: ${f.source || "(none named)"}\nEvery source pinned:\n${(ex.sources || []).map((x) => `- ${x.id} (${x.shape}${x.lines != null ? `, ${x.lines} lines` : ""})`).join("\n") || "- (none listed)"}` : "";
    const hay = `${q.question} ${q.quote || ""} ${f.narration || ""} ${onFrame}`.toLowerCase();
    const rows = this.termList(), said = rows.filter((x) => x.own || x.forms.some((w) => w && hay.includes(w)));
    const gloss = (said.length ? said : rows.slice(0, 40)).map((x) => `- ${this.termTitle(x)}${x.display ? ` (in the files: ${x.term})` : ""}: ${this.meaningOf(x).lead.replace(/<[^>]+>/g, "") || x.meaning || "defined in this video"}`).join("\n");
    return `You answer a viewer's question about one scene of a short narrated video that explains ${ex ? "something in a software project (an explainer: no plan, only its pinned sources)" : "a software plan"}. Answer only from the material below: the scene they paused on (its narration and the words on its frame${ex ? ", which quote its sources word for word" : ""}), ${ex ? "the sources it names" : "the plan's section for that scene"}, and the glossary. Use plain words, two to five short sentences, no headings or lists. If the material does not answer the question, say so plainly, and say what the video or the plan does say that is closest.

End with one line saying where the answer came from, in exactly this form:
From: <${ex ? `the source, "<its id>"` : "the plan, step N | the plan's problem"} | the glossary, "<word>" | this scene's narration | this scene's frame | the guide, "<part>" | not in ${ex ? "the sources" : "the plan"} or the video>
(join several with "; ")

## The question
${q.question}

## The video
"${clip(m.title || "", 200)}"

## The scene they paused on: scene ${f.index ?? "?"}, "${clip(f.title || "", 120)}", at ${this.fmt(q.t)}
Narration: ${clip(f.narration || "(not in this video's map)", 2000)}
On the frame: ${onFrame || "(not read)"}${q.quote ? (q.detail ? `\nThey asked about these words in the scene's guide part, "${clip(q.detail.title || q.detail.name, 120)}" (at ${clip(q.detail.anchor, 120)}): "${clip(q.quote, 600)}"` : `\nThe caption they clicked: "${clip(q.quote, 400)}"`) : ""}

${ex ? `## The explainer's sources\n${clip(sources, 6000)}` : `## The plan${m.plan?.title ? `: ${clip(m.plan.title, 200)}` : ""}\n${plan}`}

## The glossary
${clip(gloss || "(none)", 9000)}`;
  }
  // the local page: the agent session waiting on it answers; the page asks the server until it has, two minutes at most
  async askLocal(q) {
    const f = (this.planMap?.frames || []).find((x) => x.index === q.frame?.index) || {};
    let j = null;
    try {
      const r = await fetch(new URL("/api/ask", location.origin), { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store",
        body: JSON.stringify({ id: q.id, video: this.slug, planDir: this.planMap?.planDir || this.planMap?.reviewDir || null, title: this.planMap?.title || null, question: q.question, t: q.t, frame: q.frame, planStep: q.planStep, narration: f.narration || null, quote: q.quote || null }) });
      j = await r.json();
    } catch { j = null; }
    if (!j?.ok) { Object.assign(q, { status: "review", via: "review", note: "The review server did not take it, so your question goes with your review." }); return; }
    if (this._localApi) this._localApi.sessionWaiting = j.handledBy === "session";
    if (j.handledBy !== "session") { Object.assign(q, { status: "review", via: "review", note: "No agent session is waiting on this page, so your question goes with your review and is answered in the next version." }); return; }
    q.status = "waiting"; q.via = "session"; q.askId = j.id; this._asking = null; this.renderAsk();   // another question may be asked meanwhile
    for (let i = 0; i < 60; i++) {
      await new Promise((ok) => setTimeout(ok, 2000));
      let a = null; try { const r = await fetch(new URL(`/api/ask?id=${encodeURIComponent(j.id)}`, location.origin), { cache: "no-store" }); a = r.ok ? await r.json() : null; } catch {}
      if (a?.answered) { Object.assign(q, { answer: String(a.answer || ""), from: a.from || "not said", status: "answered", answeredAt: a.answeredAt || new Date().toISOString() }); this.persistQuestions(); this.renderAskItem(q); return; }
    }
    Object.assign(q, { status: "review", note: "No answer from the session in two minutes, so your question goes with your review." }); this.persistQuestions(); this.renderAskItem(q);
  }
  // "Walk me through it" (a quick check's `- walk_me_through:`): open after a wrong answer, the video waiting
  // while it is read; a button away after a right one. Opening it goes on the record (walked: true).
  syncWalk(q) {
    const box = this.$(".decision"), walk = box.querySelector(".walk"), btn = box.querySelector(".walkbtn"), r = this.quizzes[q.id], text = q.walkMeThrough || "";
    walk.querySelector(".wt").innerHTML = text ? this.glossHtml(text) : "";
    if (!text || !r) { walk.hidden = true; btn.hidden = true; return; }
    if (r.correct === false || this._walking === q.id) this.openWalk(q); else { walk.hidden = true; btn.hidden = false; }
  }
  openWalk(q = this._pendingDecision?.q) {
    const p = this._pendingDecision; if (!q || p?.kind !== "quiz" || p.q.id !== q.id) return;
    const box = this.$(".decision"), r = this.quizzes[q.id]; if (!r || !q.walkMeThrough) return;
    box.querySelector(".walk").hidden = false; box.querySelector(".walkbtn").hidden = true;
    if (!r.walked) { r.walked = true; try { localStorage.setItem(this.rkey + ":quiz", JSON.stringify(this.quizzes)); } catch {} this.dispatchEvent(new CustomEvent("quiz", { detail: { id: q.id, ...r } })); }
    this.stopWait(); box.querySelector(".gobtn").hidden = false;
    const h = box.querySelector(".hint"); delete h.dataset.live;
    h.textContent = this._walking === q.id ? (this._walkQueue?.length ? "Continue: the next check you missed." : "Continue: back to Finish.") : "Waits while you read — Continue goes on.";
    this.updateStatus();
  }
  // ---- the confusion guard, on Finish: most quick checks missed is a sign the video lost the reviewer,
  // and the worst outcome is approving what they could not follow. One quiet line over the verdict, once a
  // round: walk through each missed check, or ask the agent to explain again, or approve as is. It never blocks.
  missedChecks() {
    const qs = (this.planMap?.quizzes || []).filter((q) => this.quizzes[q.id] && this.quizzes[q.id].answer !== "own");
    return { answered: qs, wrong: qs.filter((q) => this.quizzes[q.id].correct === false) };
  }
  guardDone() { if (this._guardDoneMem) return true; try { return localStorage.getItem(this.rkey + ":guard") === "done"; } catch { return false; } }
  setGuardDone() { this._guardDoneMem = true; this._guardSeen = false; try { localStorage.setItem(this.rkey + ":guard", "done"); } catch {} }
  guardLine() {
    const { answered, wrong } = this.missedChecks();
    // quick checks off: the checks were not asked, so none of them was missed
    if (!this.checksOn || this.guardDone() || wrong.length < 2 || wrong.length * 2 < answered.length) { this._guardSeen = false; return ""; }
    this._guardSeen = true;
    return `<div class="guard" role="note"><p>You missed ${wrong.length} of ${answered.length} quick checks.</p><div class="gacts"><button class="lnk" data-act="guard-walk" title="Each check you missed again, with its worked example, one after another">Walk me through them</button><button class="lnk" data-act="guard-ask" title="Request changes, with those steps marked unclear: the agent explains them again, with examples">Ask the agent to explain it again</button><span>or ${this.isExplainer ? "finish" : "approve"} as is.</span></div></div>`;
  }
  walkMissed() {
    const { wrong } = this.missedChecks(); if (!wrong.length) return;
    this.setGuardDone();
    this._walkQueue = [...wrong].sort((a, b) => a.at - b.at).map((q) => q.id);
    this.$(".handoff").hidden = true;
    this.nextWalk();
  }
  nextWalk() {
    const id = this._walkQueue?.shift();
    if (!id) { this._walkQueue = null; this._walking = null; this.showHandoff({ finishing: true, fold: false }); return; }
    this._walking = id; this.openPoint("check", id);
    const q = (this.planMap?.quizzes || []).find((x) => x.id === id);
    if (!q?.walkMeThrough) { const h = this.$(".decision .hint"); h.textContent = this._walkQueue.length ? "Continue: the next check you missed." : "Continue: back to Finish."; }
  }
  askAgainMissed() {
    const { wrong } = this.missedChecks(); if (!wrong.length) return;
    for (const q of wrong) this.quizzes[q.id].unclear = true;
    try { localStorage.setItem(this.rkey + ":quiz", JSON.stringify(this.quizzes)); } catch {}
    this.setGuardDone(); this.setVerdict(this.isExplainer ? "more" : "changes"); this.renderDecisions();
    if (this.isExplainer) { const k = this.nextSuggestions().more.find((x) => /^vk/.test(x.id)); if (k && !this.nextPick()) this.pickNext(k.id, { render: false }); }
    this.showHandoff({ finishing: true, fold: false });
    this.status(`asked the agent to explain the ${wrong.length} quick checks you missed again`);
  }
  // on every review: how hard this was to follow (wrong checks, walk-throughs opened, words looked up, trips back, how much was watched)
  confusion() {
    const qs = Object.values(this.quizzes), dur = this.player?.duration || this.planMap?.totalSeconds || 0;
    return { wrongChecks: qs.filter((q) => q.correct === false).length, walked: qs.filter((q) => q.walked).length, termsOpened: this.termsOpened || 0, termsLookedUp: [...(this.termsLookedUp || [])],
      rewinds: this.moments.filter((m) => m.kind === "rewind").length, watchedPct: dur ? Math.round(Math.min(1, this._maxT / dur) * 100) : 0 };
  }
  // record labels: "Quick check 3", never k3
  // D-127: plain words on screen, the files keep theirs. The glossary's own on-screen word for a term (its
  // `display`, in plan-map's glossary[]) wins; PLAIN is the fallback for a glossary without that column.
  plain(word) { const w = String(word).toLowerCase(), g = (Array.isArray(this.planMap?.glossary) ? this.planMap.glossary : []).find((x) => String(x.term || "").toLowerCase().replace(/^(the|an?)\s+/, "") === w || (x.forms || [])[0] === w); return g?.display || PLAIN[w] || String(word); }
  callNoun(id) { return this.plain(/^d\d+$/i.test(String(id)) ? "deviation" : "call"); }
  // " · step 3", or nothing: a scene whose choices belong to no plan step (the answer bar's own) names none
  stepPart(n) { return n == null || n === "" ? "" : ` · step ${n}`; }
  cap(s) { s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
  checkNo(q) { const n = /^k(\d+)$/i.exec(q?.id || ""); return n ? Number(n[1]) : (this.planMap?.quizzes || []).indexOf(q) + 1; }

  // ---- the guide under the video (D-264) -----------------------------------
  // The review page carries the open video's guide under the player (<reelplanning-guide for="rp">, at the end of this
  // file). The video stays first; the guide is what you scroll down to. The guide attaches itself here once it has
  // found the video's guide page (attachGuide), and from then on:
  //  · scrolled out of view, the frame becomes a small player in the corner (a slim bar along a phone's foot) that
  //    keeps playing, with play/pause, the time and the way back up; scrolling back puts it back in its place;
  //  · a part of the guide (a marked thing on the frame, the chip, O, the plan text's "Open:") is read under the video:
  //    the page scrolls to it and the video pauses (openUnder), where the part used to open over the frame (D-195,
  //    D-246). Its time runs until the video is back in its place, and goes on the record as an opening, with the way
  //    it was opened (from: frame | chip | list);
  //  · "Watch this moment" in the guide seeks this player and plays it (watchMoment): never another page.
  attachGuide(g) {
    this._under = g || null;
    const want = this._underWant; this._underWant = null;
    if (g && want) queueMicrotask(() => this.openUnder(want.d, { from: want.from }));
    this.toggleAttribute("guide-under", !!g);
    const b = this.$?.(".guidebtn"); if (b) b.hidden = !g;
    if (this._guideOk && this.planMap) this.renderPlanText();
    if (this._last) this.renderLastReview();   // a guide note of the last review goes to its part of the guide
    this.measurePeek();
    if (g && !this._miniWired) {
      this._miniWired = true;
      const look = () => { if (!this._miniRaf) this._miniRaf = requestAnimationFrame(() => { this._miniRaf = 0; this.syncMini(); }); };
      addEventListener("scroll", look, { passive: true });
      addEventListener("resize", () => { this._miniResized = true; look(); });
    }
    this.syncMini();
  }
  // the guide page for the frame under the player: the full guide, embedded (templates/guide/guide.js, its last block)
  guideEmbedUrl() { const h = this.guideUrl(null, null); if (!h) return null; const u = new URL(h); u.searchParams.set("embed", "1"); u.hash = ""; return u.href; }
  // where the frame sits on the page when it is not small: the stage in its place, or while small the room it keeps
  dockRect() { return (this._mini ? this.$(".stageph") : this.stage).getBoundingClientRect(); }
  syncMini() {
    if (!this.stage) return;
    if (!this._under) { if (this._mini) this.setMini(false); return; }
    const r = this.dockRect(), H = document.documentElement.clientHeight; if (!r.height) return;
    const seen = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) / r.height;
    // under two fifths of it left in the window, scrolled past it: small; over half of it back: in its place (the
    // room between the two keeps it from flickering at the edge)
    const want = this._mini ? seen < 0.55 : seen < 0.4 && r.top < 0;
    if (want !== !!this._mini) this.setMini(want);
    else if (this._miniResized) { this._miniResized = false; if (this._mini) this.placeMini(); }
  }
  // the small player's box: its picture, and the card round it (the bar under the picture; on a phone, a 64 × 36 thumbnail
  // at the left of a slim bar). Under 1500 px wide it is smaller (280 px), so the guide's column keeps clear of it.
  miniGeo(D) {
    const W = document.documentElement.clientWidth, H = document.documentElement.clientHeight, phone = matchMedia("(max-width:600px)").matches;
    // (the record's bar stays at the window's foot while the guide is read: the small player sits above it)
    const foot = this.recordFoot();
    // (a phone's bar stands clear of the home indicator: the window's safe area at its foot)
    if (phone) { const bh = 56, th = 36, s = th / D.height, y = H - bh - 8 - Math.max(this.safeBottom(), foot); return { phone, s, pic: { x: 8 + 10, y: y + (bh - th) / 2, w: D.width * s, h: th }, card: { x: 8, y, w: W - 16, h: bh } }; }
    // (a panel open beside the page, Ask or the Terms, keeps the right: the small player sits left of it)
    const P = this.$(".dpanel"), pw = P && !P.hidden && !P.classList.contains("over") ? P.getBoundingClientRect().width : 0;
    const narrow = W < 1500, bh = narrow ? 40 : 44;
    const w = narrow ? 280 : Math.round(Math.min(400, Math.max(320, W * 0.25))), s = w / D.width, h = D.height * s, m = 20, x = W - pw - w - m, y = H - h - bh - (foot ? foot + 12 : m);
    return { phone, s, pic: { x, y, w, h }, card: { x, y, w, h: h + bh } };
  }
  placeMini(D = this.$(".stageph").getBoundingClientRect()) {
    const st = this.stage, bar = this.$(".minibar"), strip = this.$(".mstrip"); if (!D.width || !D.height) return null;
    const g = this.miniGeo(D), px = (n) => `${Math.round(n * 100) / 100}px`, r = g.phone ? 4 : 12;
    const t = `translate(${px(g.pic.x)},${px(g.pic.y)}) scale(${g.s})`;
    Object.assign(st.style, { width: px(D.width), height: px(D.height), transform: t, borderRadius: g.phone ? px(r / g.s) : `${px(r / g.s)} ${px(r / g.s)} 0 0` });
    Object.assign(bar.style, { left: px(g.card.x), top: px(g.card.y), width: px(g.card.w), height: px(g.card.h), paddingTop: g.phone ? "" : px(g.pic.h), paddingLeft: "" });
    bar.classList.toggle("phone", g.phone);
    bar.querySelector(".mprog").style.cssText = g.phone ? "bottom:0;left:10px;right:10px" : `top:${px(g.pic.h)}`;
    if (strip) { strip.hidden = g.phone || !this._mini; if (!g.phone) Object.assign(strip.style, { left: px(g.pic.x), top: px(g.pic.y + g.pic.h - 24), width: px(g.pic.w) }); }
    this._miniG = g;
    return { ...g, t };
  }
  // the flying picture's edge and shadow at a scale k: 1 px and a soft lift on screen, whatever the scale
  flyEdge(k) { const u = (n) => `${+(n / (k || 1)).toFixed(2)}px`, dark = this.theme === "dark"; return `0 0 0 ${u(1)} ${dark ? "rgba(242,239,232,.2)" : "rgba(20,20,19,.14)"}, 0 ${u(16)} ${u(36)} ${u(-16)} ${dark ? "rgba(0,0,0,.7)" : "rgba(20,20,19,.4)"}`; }
  // the window's safe area at its foot (env(safe-area-inset-bottom): a phone's home indicator), measured
  safeBottom() {
    let el = this._safeProbe;
    if (!el) { el = this._safeProbe = document.createElement("i"); el.setAttribute("aria-hidden", "true"); el.style.cssText = "position:fixed;left:0;bottom:0;width:0;height:env(safe-area-inset-bottom,0px);visibility:hidden;pointer-events:none"; this.shadowRoot.appendChild(el); }
    return el.getBoundingClientRect().height || 0;
  }
  // the record's bar at the window's foot, resting (its 40 px peek): what the small player keeps above
  recordFoot() { const w = this.$?.(".wrap"); if (!w || !this._under) return 0; return parseFloat(getComputedStyle(w).getPropertyValue("--peek")) || 40; }
  // what the small player covers at the window's foot, for the guide to leave room under its last words
  miniInset() { const D = this.$(".stageph")?.getBoundingClientRect(), g = D?.height ? this.miniGeo(D) : null; return g ? Math.ceil(document.documentElement.clientHeight - g.card.y) : 0; }
  // and what it covers at the window's right, from its left edge (and 24 px clear of it): the guide's column keeps out
  // of it (none on a phone, where it is a bar along the foot)
  miniRight() { const D = this.$(".stageph")?.getBoundingClientRect(), g = D?.height ? this.miniGeo(D) : null; return g && !g.phone ? Math.ceil(document.documentElement.clientWidth - g.card.x + 24) : 0; }
  // The frame's own captions, hidden while something says so: the small player (they are 4 px there; its chapter's name
  // is on the strip) and the poster while "Before you watch" is open over it (the band would sit under the box).
  hideCaptions(why, on) {
    const H = (this._capHide ||= new Set()); if (on) H.add(why); else H.delete(why);
    let doc; try { doc = this.player?.iframeElement?.contentDocument; } catch { return; } if (!doc?.documentElement) return;
    if (!doc.getElementById("rp-cap-style")) { const x = doc.createElement("style"); x.id = "rp-cap-style"; x.textContent = "html[data-rp-nocaps] #el-captions,html[data-rp-nocaps] [data-composition-id=\"captions\"]{visibility:hidden!important}"; (doc.head || doc.documentElement).appendChild(x); }
    if (doc.documentElement.hasAttribute("data-rp-nocaps") !== H.size > 0) doc.documentElement.toggleAttribute("data-rp-nocaps", H.size > 0);
  }
  miniCaptions(on) { this.hideCaptions("mini", on); }
  setMini(on) {
    const wrap = this.$(".wrap"), st = this.stage, bar = this.$(".minibar"); if (!wrap || !st || !bar || !!this._mini === !!on) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches, ease = "cubic-bezier(.2,.7,.2,1)";
    st.getAnimations?.().forEach((a) => a.cancel()); bar.getAnimations?.().forEach((a) => a.cancel()); st.classList.remove("flying");
    if (on) {
      const D = st.getBoundingClientRect();   // where it is now, in its place
      this.closeMarkBox(true); this.closeMore(); this.hideTerm();
      this._mini = true; wrap.classList.add("mini"); bar.hidden = false;
      const g = this.placeMini(D); if (!g) return;
      this.miniCaptions(true);
      this.syncMiniBar();
      if (!calm && st.animate) {
        // it shrinks from where it was, while any of it was still in the window; else it comes up in the corner
        const from = D.bottom > 8;
        if (from) { st.classList.add("flying"); const a = st.animate([{ transform: `translate(${D.left}px,${D.top}px) scale(1)`, borderRadius: "0px", boxShadow: this.flyEdge(1) }, { transform: g.t, borderRadius: st.style.borderRadius, boxShadow: this.flyEdge(g.s) }], { duration: 380, easing: ease }); a.onfinish = a.oncancel = () => st.classList.remove("flying"); }
        else st.animate([{ transform: `${g.t} translateY(${12 / g.s}px)`, opacity: 0 }, { transform: g.t, opacity: 1 }], { duration: 260, easing: ease });
        bar.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: from ? 160 : 0, easing: "ease-out", fill: "backwards" });
        // (the chapter's strip lies on the picture where it lands: it comes in once the picture is there)
        this.$(".mstrip")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, delay: from ? 340 : 120, easing: "ease-out", fill: "backwards" });
      }
    } else {
      const M = st.getBoundingClientRect();   // the small player's picture
      this._mini = false; wrap.classList.remove("mini"); bar.hidden = true; this.$(".mstrip").hidden = true; this.miniCaptions(false); this.overlayMini(false);
      for (const k of ["width", "height", "transform", "borderRadius"]) st.style[k] = "";
      const D = st.getBoundingClientRect();   // back in its place
      if (!calm && st.animate && D.width && M.width) {
        st.classList.add("flying");
        const k = M.width / D.width, a = st.animate([{ transformOrigin: "0 0", transform: `translate(${M.left - D.left}px,${M.top - D.top}px) scale(${k})`, boxShadow: this.flyEdge(k) }, { transformOrigin: "0 0", transform: "none", boxShadow: this.flyEdge(1) }], { duration: 340, easing: ease });
        a.onfinish = a.oncancel = () => st.classList.remove("flying");
      }
      this.endUnder(); this.measurePeek(); this.syncDetailChip();
    }
    this.dispatchEvent(new CustomEvent("mini", { detail: { on: !!on }, bubbles: true, composed: true }));
  }
  syncMiniBar(t = this.watchedT()) {
    const bar = this.$?.(".minibar"); if (!bar || bar.hidden) return;
    const playing = !!this.player && !this.player.paused, dur = this.dur() || 0, q = !!this._pendingDecision && !this.isAnswered();
    const pb = bar.querySelector(".mplay");
    if (pb.dataset.playing !== String(playing)) { pb.dataset.playing = String(playing); pb.setAttribute("aria-label", playing ? "Pause" : "Play"); pb.title = playing ? "Pause (space)" : "Play (space)"; }
    bar.querySelector(".mnow").textContent = this.fmt(t); bar.querySelector(".mdur").textContent = this.fmt(dur);
    bar.querySelector(".mprog>i").style.width = `${dur ? Math.max(0, Math.min(100, (t / dur) * 100)).toFixed(2) : 0}%`;
    const note = bar.querySelector(".mnote"), say = q ? "A question is waiting" : "";
    if (note.textContent !== say) note.textContent = say;
    bar.toggleAttribute("data-q", q);
    if (q) pb.title = "A question is waiting: back to the video to answer it";
    // the chapter it is in: on the strip over the picture (a phone: under the time); a question waiting takes that row,
    // in the accent, whole (a click on the picture goes back up to answer it)
    const ch = this.chapterAt(t), chs = this.planMap?.chapters || [], name = q ? "A question is waiting · Answer" : ch ? `${chs.length > 1 ? `${chs.indexOf(ch) + 1} · ` : ""}${plainTitle(ch.title)}`.trim() : "";
    const strip = this.$(".mstrip"), mc = bar.querySelector(".mchap");
    const html = q ? 'A question is waiting<span class="qa"> · Answer</span>' : esc(name);
    if (strip.dataset.says !== html) { strip.dataset.says = html; strip.innerHTML = html; strip.toggleAttribute("data-q", q); }
    if (mc.dataset.says !== html) { mc.dataset.says = html; mc.innerHTML = html; }
    bar.querySelector(".mup").setAttribute("aria-label", q ? "A question is waiting: back to the video to answer it" : "Back to the video");
    const noStrip = !name || !!this._miniG?.phone; if (strip.hidden !== noStrip) strip.hidden = noStrip;
    this.miniCaptions(true);
    this.syncMiniStill(t);
  }
  // Paused, the small player shows its chapter settled: the guide's own picture of it (a scene of the chapter at rest,
  // as \`reelplanning guide\` took it for the page), never a frame caught half way (a title alone, an empty box, a
  // terminal half drawn); playing, or with a question waiting, the live frame. A chapter with no picture keeps the frame.
  syncMiniStill(t = this.watchedT()) {
    const img = this.$?.(".mstill"); if (!img) return;
    const ch = this._mini && this.player?.paused && !this._pendingDecision ? this.chapterAt(t) : null;
    const url = ch && typeof this._under?.stillFor === "function" ? this._under.stillFor(ch.start, ch.end, t, this.theme === "dark") : null;
    img.dataset.want = url || "";
    if (!url) { if (!img.hidden) img.hidden = true; return; }
    if (img.getAttribute("src") !== url) { img.hidden = true; img.onload = () => { if (img.dataset.want === url) img.hidden = false; }; img.src = url; return; }
    if (img.complete && img.naturalWidth) img.hidden = false;
  }
  // the guide's picture opened full size (its lightbox, an overlay over the whole window): the small player steps
  // out of its way, paused, and comes back as it was when the picture closes
  overlayMini(on) {
    const bar = this.$?.(".minibar"), strip = this.$?.(".mstrip"); if (!bar) return;
    if (on && !this._overlay) {
      this._overlay = { playing: !!this.player && !this.player.paused };
      if (this._overlay.playing) this.player.pause();
      this.toggleAttribute("overlay", true);
    } else if (!on && this._overlay) {
      const o = this._overlay; this._overlay = null;
      this.toggleAttribute("overlay", false);
      if (this._mini) { this.syncMiniBar(); if (o.playing && this.player?.paused && !this._pendingDecision) this.player.play(); }
    }
  }
  // back up to the video in its place (the small player's picture, its button, a phone's Watch this moment)
  backToVideo({ focus = true } = {}) {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches, above = parseFloat(getComputedStyle(this).getPropertyValue("--rp-above")) || 0;
    scrollTo({ top: Math.max(0, this.getBoundingClientRect().top + scrollY - above), behavior: calm ? "auto" : "smooth" });
    if (focus) this.focus({ preventScroll: true });
  }
  // a part of the guide, read under the video: the page goes down to it; a thing opened from the frame pauses the video
  openUnder(d, { from = "list", pause = true, log = true } = {}) {
    const g = this._under; if (!g) return false;
    if (pause && this.player && !this.player.paused) this.player.pause();
    this.closeMarkBox(true); this.closeMore(); this.closePull();
    if (d && log) { this.endUnder(); this._dunder = { d, openedAt: new Date().toISOString(), since: performance.now(), from }; }
    g.show(d ? d.name : null);
    this.status(d ? `${d.title || d.name}: in the guide, under the video` : "the guide, under the video");
    return true;
  }
  // a note highlighted in the guide, from the record: down to the guide under the video, and to the words it is on (the
  // guide opens their folds, scrolls them to its reading line and lights them); with no guide under it, its own page
  goGuideNote(id) {
    if (this._under) { if (this.player && !this.player.paused) this.player.pause(); this.closeMarkBox(true); this.closePull(); this._under.show(null, { note: id }); this.status("the note, in the guide under the video"); return true; }
    const u = this._guideOk ? this.guideUrl(null, this.watchedT?.()) : null; if (!u) return false;
    const h = new URL(u); h.hash = `rpn-${id}`; window.open(h.href, "_blank", "noopener"); return true;
  }
  endUnder() {
    const o = this._dunder; if (!o) return; this._dunder = null;
    this.detailsOpened.push({ name: o.d.name, openedAt: o.openedAt, seconds: +((performance.now() - o.since) / 1000).toFixed(1), ...(o.from ? { from: o.from } : {}) });
    try { localStorage.setItem(this.rkey + ":details", JSON.stringify(this.detailsOpened)); } catch {}
  }
  // "Watch this moment" in the guide: this player, at that moment, playing. Small, it plays where it is (you keep your
  // place in the guide); a phone's bar is too small to watch in, so there the page goes back up to it first.
  watchMoment(t) {
    t = Number(t); if (!Number.isFinite(t) || t < 0 || !this.player) return false;
    if (this._dopen) { this._dopen.wasPlaying = false; this.closeDetail(); }
    this.start(); this.jump(Math.min(t, Math.max(0, (this.dur() || t) - 0.1)));
    if (!this._mini || matchMedia("(max-width:600px)").matches) this.backToVideo({ focus: false });
    this.player.play();
    this.status(`from the guide: the video at ${this.fmt(t)}`);
    return true;
  }

  // ---- details ------------------------------------------------------------------
  // A beat can open into a page the video cannot be: a table to sort, a prototype to try, the runs
  // behind a number. The plan map lists them (details[]); the chip offers the one under the
  // playhead, the panel shows it beside the paused stage, and the video waits where it was.
  // A part of the guide a scene opens (`- guide:`, plan-map details[].guide) is offered once the video's guide is there
  // (guide/index.html beside the plan map): the guide is built, never committed, so a clone may not have it yet.
  get detailsList() { const ds = Array.isArray(this.planMap?.details) ? this.planMap.details : []; return this._guideOk ? ds : ds.filter((d) => !d.guide); }
  detailNamed(name) { return this.detailsList.find((d) => d.name === name) || this.guidePart(name); }
  // any part of the guide by its name (plan-map guide.parts), for the plan text's "Open:" and a part that opens another
  guidePart(name) {
    const p = this._guideOk ? (this.planMap?.guide?.parts || []).find((x) => x.name === name) : null; if (!p) return null;
    const f = p.planStep != null ? (this.planMap?.frames || []).filter((x) => x.planStep === p.planStep).sort((a, b) => a.start - b.start)[0] : null;
    return { name: p.name, src: p.src || `guide/${p.name}.html`, title: p.title, kind: "guide", guide: true, planStep: p.planStep ?? null, start: f ? f.start : null, end: f ? +(f.start + (f.durationSeconds || 0)).toFixed(3) : null, frameIndex: f?.index ?? null, compositionId: f?.compositionId };
  }
  // the frame's own `detail` names it; a detail's span (or its frameIndex) is the fallback
  detailAt(t) {
    const ds = this.detailsList; if (!ds.length) return null;
    const f = this.frameAt(t);
    if (f?.detail) return this.detailNamed(f.detail);
    return ds.find((d) => d.start != null && d.end != null && t >= d.start && t < d.end) || (f ? ds.find((d) => d.frameIndex === f.index) : null) || null;
  }
  // A video's parts of the guide are its details, and its full guide is a page beside
  // it, <the video's folder>/guide/index.html (bundle-player publishes it there). It opens at the part's section; it
  // knows this review's record (src) and how to come back (review, with its "Watch this moment" times).
  guideUrl(d, t) {
    if (!this._mapUrl) return null;
    const u = new URL("guide/index.html", this._mapUrl);
    u.searchParams.set("src", this.getAttribute("src") || this.src); u.searchParams.set("theme", this.theme);
    try { const back = new URL(location.href); back.searchParams.delete("t"); back.searchParams.delete("part"); back.hash = ""; u.searchParams.set("review", back.href); } catch {}
    if (t != null && Number.isFinite(+t)) u.searchParams.set("from", (+t).toFixed(2));
    if (d?.name) u.hash = d.name;
    return u.href;
  }
  hasGuide() {
    if (this._guideP && this._guideFor === this._mapUrl) return this._guideP;
    this._guideFor = this._mapUrl;
    const u = this._mapUrl ? new URL("guide/index.html", this._mapUrl) : null;
    return (this._guideP = !u || !/^https?:$/.test(u.protocol) ? Promise.resolve(false) : fetch(u, { method: "HEAD", cache: "no-store" }).then((r) => r.ok).catch(() => false));
  }
  detailUrl(d) {
    if (d.band) {   // the band's words in full (readBand): a page of their own, in the player's paper and ink
      const [paper, ink] = this.theme === "dark" ? ["#141310", "#F2EFE8"] : ["#FAF9F5", "#141413"];
      const cs = getComputedStyle(this), serif = cs.getPropertyValue("--serif").trim() || "Georgia,serif", sans = cs.getPropertyValue("--sans").trim() || "system-ui,sans-serif";   // the page's faces, by name (a data: page cannot load them)
      return "data:text/html;charset=utf-8," + encodeURIComponent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:20px 24px;background:${paper};color:${ink};font:400 19px/1.5 ${serif}}h1{margin:0 0 12px;font-size:23px;font-weight:400}h2{margin:18px 0 6px;font-size:20px;font-weight:400}p{margin:0}dl{margin:0;font:14px/1.5 ${sans}}dt{margin-top:6px;font-weight:500}dd{margin:0}code{font:14px/1.4 ui-monospace,Menlo,monospace}b{font-weight:600}</style>${d.html}`);
    }
    const u = new URL(d.src || `details/${d.name}.html`, this._mapUrl || new URL(this.src, document.baseURI));
    u.searchParams.set("theme", this.theme);
    return u.href;
  }
  // Details in the frame (plan 2026-09-27). The scene's detail, where its frame marks the thing the page
  // explains (data-detail="<name>" inside the scene's own composition, found as its cards are): the element,
  // its box in percent of the picture (boxesOf), whether it has landed (it and what holds it fully shown: its
  // reveal has ended), and whether a phone makes it too small to tap (under 44 px tall on screen, D-196).
  detailMark(d) {
    if (!d || d.band) return null;
    const f = (this.planMap?.frames || []).find((x) => x.index === d.frameIndex);
    const F = this.frameRoot({ compositionId: d.compositionId || f?.compositionId, frameIndex: d.frameIndex, at: d.start }); if (!F) return null;
    const el = [...F.root.querySelectorAll("[data-detail]")].find((x) => x.dataset.detail === d.name); if (!el) return { F, el: null };
    let op = 1, shown = el.getClientRects().length > 0;
    for (let x = el; x && shown && x !== F.doc.documentElement; x = x.parentElement) { const cs = F.win.getComputedStyle(x); if (cs.visibility === "hidden" || cs.display === "none") shown = false; op *= parseFloat(cs.opacity) || 0; }
    const box = shown ? this.boxesOf(F, { m: el }, ["m"])?.m || null : null;
    const narrow = this.stage?.dataset.size === "narrow", hpx = box ? (box.h / 100) * this.picRect().height : 0;
    // drawn: its own reveal over by the scene's own clock, and something of it shown (a box can be there, clipped to
    // nothing or with none of its rows in yet: plan-guide's opening map is in place from 0:00 and draws at 7.8 s). Its
    // first lines or rows are enough: a terminal's output or a list keeps coming in, and waiting for the last of them
    // held the mark back to its scene's last seconds (contributing's walkthrough: the run of `reel renumber`)
    const end = this.revealEnd(F, el), tl = F.win.__timelines?.[F.cid], now = typeof tl?.time === "function" ? tl.time() : null;
    const drawn = (end == null || now == null || now >= end - 0.05) && this.someShown(F, el);
    return { F, el, box, landed: shown && op >= 0.95 && !!box && drawn, tooSmall: narrow && (!box || hpx < 44) };
  }
  // When the thing a detail marks has come in, in its scene's seconds: the end of the last tween of the scene's
  // timeline that brings it in (on it, or on what holds it); never a tween that takes it out (to opacity 0) or one
  // that loops. Null with no timeline to read.
  revealEnd(F, el) {
    try {
      const tl = F.win.__timelines?.[F.cid]; if (!tl || typeof tl.getChildren !== "function") return null;
      let end = null;
      const upTo = (tw) => { let t = tw.endTime(), p = tw.parent; while (p && p !== tl) { t = p.startTime() + t / (p.timeScale() || 1); p = p.parent; } return t; };
      for (const tw of tl.getChildren(true, true, false)) {
        if (typeof tw.targets !== "function" || (tw.repeat?.() ?? 0) < 0) continue;
        const v = tw.vars || {}, from = !!v.runBackwards;
        if (!from && (v.opacity === 0 || v.autoAlpha === 0)) continue;
        const holds = tw.targets().some((x) => x?.nodeType === 1 && (x === el || (x.contains(el) && x !== F.root && F.root.contains(x))));
        if (holds) { const t = upTo(tw); if (Number.isFinite(t) && (end == null || t > end)) end = t; }
      }
      return end;
    } catch { return null; }
  }
  // Whether any of a marked thing's words or pictures is on screen now: a text, an image or a drawing inside it,
  // shown, at half opacity or more within it, and not clipped to nothing. A thing with nothing inside: its box is it.
  someShown(F, el) {
    try {
      const shown = (x) => { let o = 1; for (let y = x; y && y !== el; y = y.parentElement) { const cs = F.win.getComputedStyle(y);
        if (cs.visibility === "hidden" || cs.display === "none" || /inset\([^)]*100%/.test(cs.clipPath || "")) return false; o *= parseFloat(cs.opacity) || 0; } return o >= 0.5; };
      const big = (r) => r.width > 1 && r.height > 1, media = el.querySelectorAll("img,svg,canvas,video");
      for (const m of media) if (big(m.getBoundingClientRect()) && shown(m)) return true;
      const w = F.doc.createTreeWalker(el, 4); let n, any = false;
      while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement) continue; any = true; if (!shown(n.parentElement)) continue;
        const rg = F.doc.createRange(); rg.selectNodeContents(n); if ([...rg.getClientRects()].some(big)) return true; }
      return !any && !media.length;
    } catch { return true; }
  }
  // The chip in the corner is the way in only where the frame marks nothing (an older video) or its thing is too
  // small to tap on a phone (D-196); elsewhere the thing is the button. Run with the playhead (syncScrub), and again
  // when a question comes or goes, a mark tool changes, or the stage's size does.
  syncDetailChip(t = this.watchedT()) {
    const chip = this.$?.(".dchip"), layer = this.$?.(".dmark"); if (!chip) return;
    const d = this.detailAt(t), m = d ? this.detailMark(d) : null;
    this._dmark = m?.el ? { d, ...m } : null;
    const useChip = !!d && (!m?.el || m.tooSmall);
    // the frame's page may still be settling after a seek (the composition not yet mounted, a reveal paused
    // half way): look again shortly, a few times
    clearTimeout(this._dmarkT);
    if (d && (!m || (m.el && !m.landed)) && this.player?.paused && (this._dmarkTries = (this._dmarkTries || 0) + 1) <= 12) this._dmarkT = setTimeout(() => this.syncDetailChip(), 250);
    else if (!d || m?.landed) this._dmarkTries = 0;
    chip.hidden = !useChip || !!this._dopen;
    if (useChip && chip.dataset.name !== d.name) {
      chip.dataset.name = d.name;
      chip.querySelector(".dt").textContent = d.title || d.name;
      chip.title = `${d.title || d.name}${d.why ? ` — ${d.why}` : ""} (O)`;
      chip.setAttribute("aria-label", `Open the guide: ${d.title || d.name} (O)`);
    }
    if (!layer) return;
    // the button: over the thing once it has landed, to the end of its scene; with an ink ring while its page is open.
    // While a question is up it stays (D-246, superseding D-206): a click opens the part over the frame, the question
    // folds, and closing the part brings it back as it was left. Only where the thing lies under one of the question's
    // cards does the card win (a click there answers), and the button steps aside.
    const up = !!this._pendingDecision && !this._folded;
    const clash = up && !!m?.box && (() => { const lr = layer.getBoundingClientRect(), b = m.box, t = { l: lr.left + (b.l / 100) * lr.width, t: lr.top + (b.t / 100) * lr.height }; t.r = t.l + (b.w / 100) * lr.width; t.b = t.t + (b.h / 100) * lr.height;
      return this.$$(".hits .cring, .hits .qhit").some((c) => { if (c.hidden || !c.getClientRects().length) return false; const r = c.getBoundingClientRect(); return r.width && r.left < t.r && t.l < r.right && r.top < t.b && t.t < r.bottom; }); })();
    const on = !!this._dmark && !useChip && m.landed && !clash && (!this._dopen || this._dopen.d.name === d.name);
    const btn = layer.querySelector(".dhit");
    if (!on) { if (!layer.hidden) { const had = this.shadowRoot.activeElement === btn; layer.hidden = true; delete btn.dataset.name; this.armDetail(false); if (this._more?.key === "detail") this.closeMore(); if (had) this.focus({ preventScroll: true }); } return; }
    const pct = (n) => `${n.toFixed(3)}%`, b = m.box;
    Object.assign(btn.style, { left: pct(b.l), top: pct(b.t), width: pct(b.w), height: pct(b.h) });
    btn.toggleAttribute("data-big", (b.w * b.h) / 10000 > 0.4);   // over 40% of the frame: outlined, never filled
    if (btn.dataset.name !== d.name) {
      btn.dataset.name = d.name; this.armDetail(false);
      btn.setAttribute("aria-label", `Open the guide: ${d.title || d.name} (O)`);
      btn.title = "";
    }
    btn.toggleAttribute("data-open", !!this._dopen);
    layer.toggleAttribute("data-playing", !!this.player && !this.player.paused);
    layer.hidden = false;
    this.placeDetailTab(btn, b);
  }
  // The label sits just above the thing, at its top-left corner, in the 40 px room the frame keeps clear there (the
  // style guide's rule 5: nothing covers content, frame-lint), so it covers none of the thing's own words (a fresh
  // eyes finding on the videos-that-make-sense walkthrough); where that would reach past the frame's top, cover the
  // part's name card, or not fit the room on a small stage, it goes inside the thing's top-right corner. Always inside the frame, above its lowest eighth.
  // Placed for the label opened (the glyph at rest is its arrow's place), so it does not jump on hover.
  placeDetailTab(btn, b) {
    const tab = btn.querySelector(".dtab"), dtl = tab.querySelector(".dtl"), layer = btn.parentElement, W = layer.clientWidth, H = layer.clientHeight; if (!W || !H) return;
    const top = (b.t * H) / 100, left = (b.l * W) / 100, th = tab.offsetHeight || 18, tw = Math.max(tab.offsetWidth, (tab.offsetWidth || 20) - (dtl?.offsetWidth || 0) + (dtl?.scrollWidth || 0) + 8) || 140;
    const room = (40 * W) / 1920;   // the 40 px rule 5 keeps clear, on screen: a small stage (a phone) leaves less than the label
    let y = -th - Math.max(1, Math.min(4, room - th));
    const pc = this.$(".partcard.on"), lr = layer.getBoundingClientRect();
    const covers = (yy) => { if (!pc) return false; const r = pc.getBoundingClientRect(), x0 = lr.left + left, y0 = lr.top + top + yy; return x0 < r.right && r.left < x0 + tw && y0 < r.bottom && r.top < y0 + th; };
    if (top + y < 2 || covers(y) || th > room) y = 6;
    y = Math.min(y, H * 0.875 - th - 2 - top);   // never in the lowest eighth
    y = Math.max(y, 2 - top);                    // nor past the frame's top
    tab.style.top = `${Math.round(y)}px`;
    // inside, it takes the top-right corner (off its rounded edge), where a block's words most often leave room
    Object.assign(tab.style, y >= 0 ? { left: "auto", right: "6px" } : { left: "0px", right: "auto" });
  }
  // A touch has no hover: the first tap on the thing arms it (the ring and "More in the guide ↓", as the pointer shows
  // them), a second opens its part; it disarms after a while, on a tap elsewhere, or when the scene's thing changes.
  armDetail(on) {
    const btn = this.$?.(".dmark .dhit"); clearTimeout(this._dArmT); if (!btn) return;
    btn.toggleAttribute("data-armed", !!on);
    if (on) this._dArmT = setTimeout(() => this.armDetail(false), 4000);
  }
  // The pill hovered a moment (or the thing focused from the keyboard): the part's why, in a card beside the pill
  hoverDetail(on) {
    clearTimeout(this._moreT); clearTimeout(this._moreOutT);
    if (!on) { if (this._more?.key === "detail") this._moreOutT = setTimeout(() => { if (!this.$(".fpop").matches(":hover")) this.closeMore(); }, 250); return; }
    this._moreT = setTimeout(() => {
      const m = this._dmark, pop = this.$(".fpop"), btn = this.$(".dmark .dhit"), pill = btn?.querySelector(".dtab"); if (!m || !pop || !pill || this.$(".dmark").hidden || this._dopen) return;
      const d = m.d, w = String(d.why || "").trim(); if (!w) return;
      this.hideTerm();
      pop.innerHTML = `<span class="fk">${esc([detailKindLabel(d.kind), d.planStep != null ? `step ${d.planStep}` : null].filter(Boolean).join(" · "))}</span><b>${esc(d.title || d.name)}</b><p>${esc(w)}</p>`;
      pop.hidden = false; this._more = { key: "detail", hover: true };
      this.placeByPill(pop, pill.getBoundingClientRect(), m.F);
    }, 450);
  }
  // The part's card beside its pill (never over it), no wider than 360 px, where it covers the least of the frame's own
  // words (the scene's headline, a neighbouring panel, the captions): of the places round the pill that fit inside the
  // picture, the one over the fewest words, then the nearest.
  placeByPill(pop, r, F) {
    const Z = this.picRect(), S = (this.$(".zport") || this.stage).getBoundingClientRect();
    const B = { l: Math.max(Z.left, S.left) + 8, t: Math.max(Z.top, S.top) + 8, r: Math.min(Z.right, S.right) - 8, b: Math.min(Z.bottom, S.bottom) - 12 }, g = 6;
    Object.assign(pop.style, { maxWidth: `${Math.max(160, Math.floor(Math.min(360, B.r - B.l)))}px`, maxHeight: `${Math.max(80, Math.floor(B.b - B.t))}px`, left: "0px", top: "0px" }); pop.removeAttribute("data-under");
    const w = pop.offsetWidth, h = pop.offsetHeight, clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const words = this.frameWords(F), pc = this.$(".partcard.on")?.getBoundingClientRect();
    if (pc) words.push(pc);
    const over = (x, y) => words.reduce((a, q) => a + Math.max(0, Math.min(x + w, q.right) - Math.max(x, q.left)) * Math.max(0, Math.min(y + h, q.bottom) - Math.max(y, q.top)), 0);
    const xs = [r.left, r.right - w, r.left - g - w, r.right + g], ys = [r.bottom + g, r.top - g - h, r.top, r.bottom - h];
    let best = null;
    for (const x0 of xs) for (const y0 of ys) {
      const x = clamp(x0, B.l, B.r - w), y = clamp(y0, B.t, B.b - h);
      if (x < r.right + g - 0.5 && x + w > r.left - g + 0.5 && y < r.bottom + g - 0.5 && y + h > r.top - g + 0.5) continue;   // over the pill
      const score = over(x, y) + 0.5 * Math.hypot(x + w / 2 - (r.left + r.right) / 2, y + h / 2 - (r.top + r.bottom) / 2);
      if (!best || score < best.score) best = { x, y, score };
    }
    if (!best) best = { x: clamp(r.left, B.l, B.r - w), y: clamp(r.bottom + g, B.t, B.b - h) };
    pop.style.left = `${Math.round(best.x)}px`; pop.style.top = `${Math.round(best.y)}px`;
  }
  // The frame's own words where they are on screen (the scene's and its captions'), what is shown of them: a card is
  // placed off them
  frameWords(F) {
    const out = []; if (!F?.doc?.body) return out;
    try {
      const fr = F.ifr.getBoundingClientRect(), vw = F.win.innerWidth, vh = F.win.innerHeight; if (!fr.width || !vw) return out;
      const sx = fr.width / vw, sy = fr.height / vh, seen = new Map();
      const visible = (el) => { if (seen.has(el)) return seen.get(el); let v = true; for (let x = el; x && x !== F.doc.documentElement; x = x.parentElement) { const cs = F.win.getComputedStyle(x); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.1) { v = false; break; } } seen.set(el, v); return v; };
      const tw = F.doc.createTreeWalker(F.doc.body, NodeFilter.SHOW_TEXT); let n = 0;
      while (tw.nextNode() && n < 600) {
        const t = tw.currentNode; if (!t.nodeValue.trim() || !t.parentElement || /^(SCRIPT|STYLE)$/.test(t.parentElement.tagName) || !visible(t.parentElement)) continue;
        const rg = F.doc.createRange(); rg.selectNodeContents(t);
        for (const q of rg.getClientRects()) { if (q.width < 1 || q.height < 1) continue; n++; out.push({ left: fr.left + q.left * sx, top: fr.top + q.top * sy, right: fr.left + q.right * sx, bottom: fr.top + q.bottom * sy }); }
      }
    } catch {}
    return out;
  }
  // Which way a detail was opened, for the record: its thing on the frame, the corner chip, or a list
  // (the plan text's "Open:", a comment's link to its page). O opens the scene's detail the way the scene offers it.
  openDetailFrom(from) {
    const d = this.detailAt(this.watchedT()); if (!d) return;
    this.armDetail(false);
    const btn = this.$(".dmark:not([hidden]) .dhit"), chip = this.$(".dchip:not([hidden])");
    if (!from) from = this._dmark && this._dmark.d.name === d.name && !(chip && chip.dataset.name === d.name) ? "frame" : "chip";
    const back = from === "frame" ? btn : chip;
    this.openDetail(d, { from, origin: back?.getBoundingClientRect() || null, back: back || null });
  }
  openDetail(d, { from = "list", origin = null, back = null } = {}) {
    if (!d) return;
    // D-264: with the guide under the video, a part of it is read there: the page scrolls to it, the video pauses
    if (d.guide && !d.band && this._under) { if (this._dopen) this.closeDetail(); this.openUnder(d, { from }); return; }
    // …and on a review page that carries the guide under the video but has not attached it yet (it is still finding
    // it): the part waits for it, never a page of its own (the bundle carries no part pages)
    if (d.guide && !d.band && this.id && document.querySelector(`reelplanning-guide[for="${CSS.escape(this.id)}"]`)) {
      if (this.player && !this.player.paused) this.player.pause();
      this._underWant = { d, from }; this.status(`${d.title || d.name}: opening the guide, under the video`); return;
    }
    if (this._topen) this.closeTerms();   // the terms and a detail share the side panel: one at a time
    const prev = this._dopen; if (prev?.d.name === d.name) return;
    // from one detail straight to another: the first one's time is logged, the video's place is kept
    if (prev) { this.closeDetailComment(true); this.endDetail(); }
    const t = prev ? prev.t : (this.player.currentTime ?? this._lastT), wasPlaying = prev ? prev.wasPlaying : !this.player.paused;
    this.player.pause(); this.closeMarkBox(true); this.closeMore();
    // a waiting question folds while the page is open (one place to answer at a time); it comes back on close.
    // The band's own words in full (readBand) leave it up: they are what it asks.
    if (this._pendingDecision && !this._folded && !d.band) { this.fold(true); this._autoFolded = true; }
    // D-195: over the frame, grown from where it was opened; a phone's page covers the window, and the band's
    // words keep the side panel
    const over = !d.band && !matchMedia("(max-width:600px)").matches;
    this._dopen = { d, t, wasPlaying, openedAt: new Date().toISOString(), since: performance.now(), from: d.band ? null : from, over, back };
    const P = this.$(".dpanel");
    const k = P.querySelector(".k"); k.textContent = [detailKindLabel(d.kind), d.planStep != null ? `step ${d.planStep}` : null].filter(Boolean).join(" · "); k.title = `Opened at ${this.fmt(t)}; closing goes on from there`;
    // the why is written for the chip ("Open it to …"); in the open panel it says what the page is for
    const w = String(d.why || "").replace(/^open it (?:to|for)\s+/i, "").replace(/^./, (c) => c.toUpperCase());
    const h = P.querySelector("h5"); h.textContent = d.title || d.name; h.title = [d.title || d.name, w].filter(Boolean).join(" — ");
    const why = P.querySelector(".why"); why.textContent = w; why.hidden = !w;
    const fr = P.querySelector("iframe"); fr.title = d.title || d.name; fr.src = this.detailUrl(d);
    const full = P.querySelector(".dfull"); full.hidden = true;
    if (!d.band) this.hasGuide().then((ok) => { if (!ok || this._dopen?.d !== d) return; full.href = this.guideUrl(d, t); full.querySelector(".dft").textContent = d.title || d.name; full.setAttribute("aria-label", `Open the full guide at ${d.title || d.name}`); full.hidden = false; });
    this.closeDetailComment(false); P.querySelector(".dsaved").hidden = true;
    this.renderDetailCall();
    this.homeDetailPanel(over);
    P.hidden = false; this.$(".wrap").classList.add(over ? "dover" : "dopen");
    this.syncDetailChip(t); this.measurePeek();
    if (over) this.growDetail(P, origin, true);
    P.querySelector('[data-act="detail-close"]').focus({ preventScroll: true });   // Esc closes it from here
    this.status("the guide is open over the frame; closing it goes on from here");
  }
  // Where the panel lives: over the frame, in the stage (D-195), or in its own place beside the page (the side
  // panel, which the Terms and the band's long words keep).
  homeDetailPanel(over) {
    const P = this.$?.(".dpanel"); if (!P) return;
    if (!this._dpHome) this._dpHome = { parent: P.parentElement, next: P.nextSibling };
    if (over) { if (P.parentElement !== this.stage) this.stage.append(P); }
    else if (P.parentElement !== this._dpHome.parent) this._dpHome.parent.insertBefore(P, this._dpHome.next);
    P.classList.toggle("over", !!over);
  }
  // The page grows out of the thing into the video's box, and a ghost of it shrinks back into the thing on close.
  growDetail(el, from, grow) {
    try {
      if (!from || matchMedia("(prefers-reduced-motion:reduce)").matches || !el.animate) return null;
      const sr = this.stage.getBoundingClientRect(); if (!sr.width || !sr.height || !from.width || !from.height) return null;
      const small = { transform: `translate(${from.left - sr.left}px,${from.top - sr.top}px) scale(${from.width / sr.width},${from.height / sr.height})`, opacity: grow ? 0.4 : 0 }, big = { transform: "none", opacity: 1 };
      return el.animate(grow ? [small, big] : [big, small], { duration: grow ? 240 : 200, easing: "cubic-bezier(.2,.7,.2,1)" });
    } catch { return null; }
  }
  // Close goes on where you were: the same moment, playing again if it was playing. A reviewer who
  // moved the video while the page was open has chosen another place, and stays there. Focus goes back to
  // what opened it: the thing's button (or the chip), where it is still there.
  closeDetail() {
    if (this._topen) return this.closeTerms();   // the panel's × closes whichever it holds
    const o = this._dopen; if (!o) return false;
    this.closeDetailComment(true);
    this.endDetail(); this._dopen = null;
    const P = this.$(".dpanel"); P.hidden = true; P.querySelector("iframe").src = "about:blank";
    P.getAnimations?.().forEach((a) => a.cancel());
    this.$(".wrap").classList.remove("dopen", "dover");
    this.homeDetailPanel(false);
    this.measurePeek(); this.syncDetailChip(this.watchedT());
    if (o.over) {   // a ghost of the page shrinks back into the thing (or the chip) it grew from
      const to = (o.from === "frame" ? this.$(".dmark:not([hidden]) .dhit") : o.from === "chip" ? this.$(".dchip:not([hidden])") : null)?.getBoundingClientRect();
      const g = document.createElement("div"); g.className = "dghost"; this.stage.append(g);
      const a = this.growDetail(g, to, false); if (a) a.onfinish = a.oncancel = () => g.remove(); else g.remove();
    }
    const back = o.back && o.back.isConnected && o.back.getClientRects().length && !o.back.closest("[hidden]") ? o.back : null;
    if (back) back.focus({ preventScroll: true }); else this.focus({ preventScroll: true });
    if (this._autoFolded && this._pendingDecision && this._folded) this.fold(false);
    this._autoFolded = false;
    const here = Math.abs((this.player.currentTime ?? o.t) - o.t) < 0.5;
    if (o.wasPlaying && this.player.paused && here && !this.asking()) this.player.play();
    this.updateStatus();
    return true;
  }
  // D-005: opening a detail is not a rewind and its time is not watching; it is its own record, with the way it
  // was opened (from: frame, chip or list), so a later plan can see which way reviewers use
  endDetail() {
    const o = this._dopen; if (!o || o.d.band) return;   // the band's words in full are not a detail opened
    this.detailsOpened.push({ name: o.d.name, openedAt: o.openedAt, seconds: +((performance.now() - o.since) / 1000).toFixed(1), ...(o.from ? { from: o.from } : {}) });
    try { localStorage.setItem(this.rkey + ":details", JSON.stringify(this.detailsOpened)); } catch {}
  }
  detailsLog() {
    const o = this._dopen, open = o && !o.d.band ? [{ name: o.d.name, openedAt: o.openedAt, seconds: +((performance.now() - o.since) / 1000).toFixed(1), ...(o.from ? { from: o.from } : {}) }] : [];
    const u = this._dunder; if (u) open.push({ name: u.d.name, openedAt: u.openedAt, seconds: +((performance.now() - u.since) / 1000).toFixed(1), ...(u.from ? { from: u.from } : {}) });
    return [...this.detailsOpened.map((x) => ({ ...x })), ...open];
  }
  onDetailMessage(e) {
    const fr = this.$?.(".dpanel iframe");
    if (!this._dopen || !fr || !e.source || e.source !== fr.contentWindow) return;
    const m = e.data; if (!m || typeof m !== "object" || m.type !== "rp-detail") return;
    if (m.event === "ready") { this._dopen.ready = true; detailFaces().then((f) => { if (f && e.source === fr.contentWindow) try { e.source.postMessage({ type: "rp-player", event: "faces", ...f }, "*"); } catch {} }); return; }
    // a part asks for another part of the guide, or to play its moment
    if (m.event === "open") { const d = this.detailNamed(String(m.name ?? "")); if (d && d.name !== this._dopen.d.name) this.openDetail(d, { from: "list" }); return; }
    // an answer given on the guide: the same answer as on the video, the later one kept
    if (m.event === "answer") { this.answerFromGuide(String(m.question ?? ""), String(m.option ?? "")); return; }
    if (m.event === "seek") { const t = Number(m.t); if (Number.isFinite(t) && t >= 0) { this._dopen.wasPlaying = false; this.closeDetail(); this.player.seek(Math.min(t, this.dur() || t)); this.player.pause(); this.syncScrub?.(); } return; }
    if (m.event !== "anchor" && m.event !== "select") return;
    const anchor = String(m.anchor ?? "").replace(/\s+/g, " ").trim().slice(0, 120); if (!anchor) return;
    const r = m.rect && typeof m.rect === "object" ? { x: +m.rect.x || 0, y: +m.rect.y || 0, w: +m.rect.w || 0, h: +m.rect.h || 0 } : null;
    this.openDetailComment(anchor, String(m.text ?? "").replace(/\s+/g, " ").trim().slice(0, m.event === "select" ? 600 : 200), { rect: r, editable: m.event === "select" && !!m.editable, selected: m.event === "select" });
  }
  // The note box on a part of the guide: a click on an anchored part, or words selected in it (bridge v2), opens it
  // on them, as a mark's box opens on the frame. Comment keeps a note; Suggest an edit (plan text only: the page marks
  // it data-editable) keeps what the words say and what you would have them say; Ask asks about them, answered here.
  openDetailComment(anchor, text, { rect = null, editable = false, selected = false } = {}) {
    const box = this.$(".dcomment"), ta = box.querySelector("textarea");
    if (this._dcomment?.anchor === anchor && this._dcomment.text === text) { ta.focus(); return; }
    this.closeDetailComment(true);   // words already typed stay with the part they were written about
    this._dcomment = { anchor, text, mode: "comment", selected };
    box.querySelector(".k").innerHTML = `${selected ? "On" : "Comment on"} <code>${esc(anchor)}</code>`;
    const q = box.querySelector(".quote"); q.textContent = selected ? `“${text}”` : text; q.hidden = !text || text === anchor;
    const eb = box.querySelector('[data-act="dc-edit"]'); eb.hidden = !editable; eb.setAttribute("aria-pressed", "false");
    ta.placeholder = "Your comment on this part";
    const ans = box.querySelector(".dans"); ans.hidden = true; ans.innerHTML = ""; this._dq = null;
    this.$(".dsaved").hidden = true; box.hidden = false; ta.value = ""; ta.style.height = "auto";
    this.placeDetailComment(rect);
    ta.focus({ preventScroll: true });
  }
  // over the page, on the words it is about (under them, or over them where there is no room below); without a
  // place (an older page), docked under the page as before
  placeDetailComment(rect) {
    const box = this.$(".dcomment"), P = this.$(".dpanel"), fr = P?.querySelector("iframe");
    this._dcRect = rect || null;
    if (!rect || !fr || this._topen) { box.classList.remove("float"); box.style.left = box.style.top = ""; return; }
    box.classList.add("float");
    const pr = P.getBoundingClientRect(), f = fr.getBoundingClientRect(), bw = box.offsetWidth, bh = box.offsetHeight;
    const x0 = f.left - pr.left + rect.x, y0 = f.top - pr.top + rect.y;
    const x = Math.max(12, Math.min(x0 + Math.min(rect.w, 240) / 2 - bw / 2, pr.width - bw - 12));
    let y = y0 + rect.h + 10; if (y + bh > pr.height - 12) y = Math.max(f.top - pr.top + 8, y0 - bh - 10);
    box.style.left = `${Math.round(x)}px`; box.style.top = `${Math.round(y)}px`;
  }
  // false when there was no box; `save` keeps typed words (Esc, closing), the × throws them away
  closeDetailComment(save) {
    const box = this.$?.(".dcomment"); if (!box || box.hidden) return false;
    const ta = box.querySelector("textarea");
    if (save && ta.value.trim()) { this.saveDetailComment(); return true; }
    box.hidden = true; this._dcomment = null; this._dq = null; ta.value = ""; box.classList.remove("float");
    return true;
  }
  detailEditMode(on = this._dcomment?.mode !== "edit") {
    const c = this._dcomment, box = this.$(".dcomment"), ta = box.querySelector("textarea"); if (!c) return;
    c.mode = on ? "edit" : "comment"; box.querySelector('[data-act="dc-edit"]').setAttribute("aria-pressed", String(on));
    ta.value = on ? c.text : ""; ta.placeholder = on ? "The words as you would have them" : "Your comment on this part"; ta.focus({ preventScroll: true });
  }
  // Ask about words in a part of the guide: the same question as Ask about this (the same thread, `questions`, and the
  // same one who answers), about the part's moment, with the words as its quote; the answer shows in the box
  async askFromDetail() {
    const o = this._dopen, c = this._dcomment, box = this.$(".dcomment"), ta = box.querySelector("textarea"); if (!o || !c || this._asking) return;
    const text = (ta.value.trim() || "What does this mean?").replace(/\s+/g, " ");
    const onBeat = o.d.start == null || (o.t >= o.d.start && (o.d.end == null || o.t < o.d.end)), t = onBeat ? o.t : o.d.start ?? o.t, f = this.frameAt(t);
    const q = { id: `ask-${Date.now().toString(36)}`, question: text.slice(0, 2000), t: +Number(t).toFixed(2), frame: f ? { index: f.index, title: f.title } : null, planStep: o.d.planStep ?? f?.planStep ?? null,
      askedAt: new Date().toISOString(), quote: c.text || c.anchor, detail: { name: o.d.name, anchor: c.anchor, title: o.d.title || o.d.name }, status: "asking" };
    this.questions = [...(this.questions || []), q]; ta.value = ""; this._dq = q; this._asking = q.id; c.mode = "asked";
    this.persistQuestions(); this.renderDetailAnswer();
    try { await this.routeAsk(q); } finally { this._asking = null; this._askCtl = null; this.persistQuestions(); this.renderDetailAnswer(); if (this._topen?.mode === "ask") this.renderAsk(); }
  }
  renderDetailAnswer() {
    const q = this._dq, box = this.$?.(".dcomment"); if (!q || !box || box.hidden) return;
    const a = box.querySelector(".dans"); a.hidden = false;
    a.innerHTML = this.askItemHtml(q).replace(/<p class="aw">[\s\S]*?<\/p>/, "");
    this.placeDetailComment(this._dcRect);
  }
  // An ordinary annotation, plus where in the page it points; its moment is the one the detail was
  // opened at, and its step the detail's. Opened away from its own beat (from the plan
  // text's "Open:" or the record), the moment is the beat's start, so the comment's frame and step agree.
  saveDetailComment() {
    const o = this._dopen, c = this._dcomment, box = this.$(".dcomment"), ta = box.querySelector("textarea");
    const text = ta.value.trim(); if (!o || !c || !text) return;
    const edit = c.mode === "edit" && text !== c.text ? { before: c.text, after: text } : null;
    if (c.mode === "edit" && !edit) { this.closeDetailComment(false); return; }   // the words as they were: nothing to keep
    const onBeat = o.d.start == null || (o.t >= o.d.start && (o.d.end == null || o.t < o.d.end));
    const a = this.add({ kind: "note", comment: edit ? `Suggested edit: “${edit.before}” → “${edit.after}”` : text, t: onBeat ? o.t : Math.ceil(o.d.start * 100) / 100, detail: { name: o.d.name, anchor: c.anchor, text: c.text }, ...(edit ? { edit } : {}), ...(o.d.planStep != null ? { plan: { step: o.d.planStep } } : {}) });
    box.hidden = true; this._dcomment = null; this._dq = null; ta.value = ""; box.classList.remove("float");
    const s = this.$(".dsaved"); s.innerHTML = `Saved to the record, ${esc(this.label(a))}: <code>${esc(c.anchor)}</code> — ${esc(text.length > 90 ? `${text.slice(0, 89)}…` : text)}`; s.hidden = false;
    this.$('.dpanel [data-act="detail-close"]').focus({ preventScroll: true });
    this.status(`comment on ${c.anchor} saved`);
  }
  // the record's line for a comment made in a detail: "`parts.ts:14` in The staging runs…", the title opening it again
  whereInDetail(a) {
    // highlighted in the guide under the video (guide-review.js): where it is, its section and step; a click goes to it
    if (a.via === "guide" && a.detail.where) return `<button class="lnk" data-guide-note="${esc(a.id)}" title="Go to it in the guide">${esc(a.detail.where)}</button>`;
    const d = this.detailNamed(a.detail.name), title = d?.title || a.detail.name;
    return `<code>${esc(a.detail.anchor)}</code> in ${d ? `<button class="lnk" data-open-detail="${esc(d.name)}" title="Open this part of the guide again">${esc(title)}</button>` : esc(title)}`;
  }
  // A walkthrough's detail that belongs to one of the agent's calls carries its verdict
  renderDetailCall() {
    const o = this._dopen, box = this.$(".dcall"); if (!box) return;
    const a = o?.d.autonomy ? this.calls().find((x) => x.id === o.d.autonomy) : null;
    box.hidden = !a; if (!a) return;
    const r = this.autonomy[a.id];
    const what = box.querySelector(".what"); what.innerHTML = `<b>The agent's ${this.plain("call")}:</b> ${esc(a.chose || a.id)}${r ? ` — ${r.verdict === "accept" ? "accepted" : r.verdict === "flag" ? "flagged for discussion" : "sent as a change"}` : ""}`; what.title = what.textContent;
    box.querySelectorAll("[data-dverdict]").forEach((b) => { b.disabled = !!r; b.setAttribute("aria-pressed", String(r?.verdict === b.dataset.dverdict)); });
  }
  detailVerdict(v) {
    const o = this._dopen; if (!o || !["accept", "flag"].includes(v)) return;
    const a = this.calls().find((x) => x.id === o.d.autonomy); if (!a || this.autonomy[a.id]) return;
    // its sheet was waiting on this very call: now answered, so the video goes on when the panel closes
    const p = this._pendingDecision; if (p?.kind === "autonomy" && p.a.id === a.id) { this.closeCard(); o.wasPlaying = true; }
    this._askedOnce = { ...(this._askedOnce || {}), [a.id]: true };
    this.recordVerdict(a, v); this.renderDetailCall();
    this.$('.dpanel [data-act="detail-close"]').focus({ preventScroll: true });   // the button just pressed is now disabled, and a disabled button drops focus out of the player
    this.status(v === "accept" ? "accepted the agent's choice" : "flagged the agent's choice for discussion");
  }

  // ---- the plan beside the video ----------------------------------------------------------------
  stepStart(n) {
    const fr = this.planMap?.frames || [];
    if (n === 0) return fr.length ? Math.min(...fr.map((f) => f.start)) : 0;
    const f = fr.filter((x) => x.planStep === n).sort((a, b) => a.start - b.start)[0];
    return f ? f.start : null;
  }
  renderPlanText() {
    const el = this.$(".plantext"), box = el?.querySelector(".pscroll"); if (!box) return;
    const plan = this.planMap?.plan, steps = Array.isArray(plan?.steps) ? plan.steps : [];
    el.hidden = !steps.length; this._planKey = undefined; el.dataset.lit = "";
    // The plan's text is off until the reviewer turns it on (the owner asked: the column beside the
    // video was always there). Off, it is one folded line in the record; on, it opens beside the video
    // where the window has room, in the record where it does not. Remembered per viewer; a new key, so
    // an old "open in the record" does not put it beside the video unasked.
    if (this._planOpen === undefined) { try { this._planOpen = localStorage.getItem("rp:plan-open") === "1"; } catch { this._planOpen = false; } }
    this.syncPlanToggle();
    if (!steps.length) { box.innerHTML = ""; this.placePlan(); return; }
    const sec = (n, num, head, body) => {
      const at = this.stepStart(n), dets = n ? this.detailsList.filter((d) => d.planStep === n) : [];
      // the step's part of the guide (the plan guide), where no scene opens it already
      if (n && this._guideOk) for (const p of (this.planMap?.guide?.parts || []).filter((x) => x.planStep === n && !dets.some((d) => d.name === x.name))) dets.push(this.guidePart(p.name));
      return `<section class="pstep" data-step="${n}" aria-current="false"><h6${at != null ? ` data-plan-head="${n}" title="Click to jump the video here"` : ""}><span class="n">${num}</span><span class="tt">${esc(head)}</span>${at != null ? `<button class="ts" data-plan-jump="${n}" title="Jump the video to ${n ? `step ${n}` : "the start"}">${this.fmt(at)}</button>` : ""}</h6>`
        + `<div class="md">${mdToHtml(body)}</div>`
        + (dets.length ? `<p class="pdets">Open:${dets.map((d) => `<button data-open-detail="${esc(d.name)}" title="${esc(d.why || "")}">${esc(d.title || d.name)}</button>`).join("")}</p>` : "")
        + `</section>`;
    };
    // the plan text's header links to the full guide (the plan guide, D-063 kept: the guide is more, a click away)
    const gu = this._guideOk ? this.guideUrl(null, this.watchedT?.()) : null;
    box.innerHTML = `${plan.title ? `<p class="ptitle">${esc(plan.title)}</p>` : ""}${gu ? `<p class="pdets pguide"><a href="${esc(gu)}" target="_blank" rel="noopener" data-guide-full>${this._under ? "The guide, under the video" : "Open the full guide"}</a></p>` : ""}`
      + (plan.problem ? sec(0, "", "The problem", plan.problem) : "")
      + steps.map((s) => sec(Number(s.n), s.n, `${s.title || `Step ${s.n}`}`, s.text)).join("");
    this.placePlan(); this.syncPlanStep();
  }
  // Turned on, beside the stage where the window is wide enough that the stage gives up less than 15% of its
  // width for it (the stage is height-bound there); otherwise in the record, under Steps. (The chrome
  // under the stage is thin now, so a window's height buys more stage width than it did, and a tenth
  // put the plan in the record at 1440 x 900, where it reads best beside a 1040 px frame.)
  placePlan() {
    const el = this.$?.(".plantext"), wrap = this.$?.(".wrap"); if (!el || !wrap) return;
    let beside = false;
    if (!el.hidden && this._planOpen && !matchMedia("(max-width:600px)").matches) {
      const cs = getComputedStyle(wrap), chrome = (parseFloat(cs.getPropertyValue("--chrome")) || 316) + (parseFloat(cs.getPropertyValue("--rp-above")) || 0);
      const W = wrap.getBoundingClientRect().width, hb = (innerHeight - chrome) * 16 / 9, side = (parseFloat(cs.getPropertyValue("--planw")) || 320) + 32;
      beside = W - side >= 640 && Math.min(W - side, hb) >= 0.85 * Math.min(W, hb);
    }
    wrap.classList.toggle("beside", beside);
    if (beside) { if (el.previousElementSibling !== this.$(".main")) this.$(".main").after(el); }
    else { const home = this.$(".col-plan"); if (el.parentElement !== home) home.append(el); }
  }
  syncPlanStep() {
    const el = this.$?.(".plantext"); if (!el || el.hidden) return;
    const t = this.watchedT(), f = this.frameAt(t);
    let n = f?.planStep || null;
    if (n == null) { const s1 = (this.planMap?.frames || []).find((x) => x.planStep); n = s1 && t < s1.start ? 0 : null; }
    if (n === this._planKey) return; this._planKey = n;
    el.dataset.lit = n == null ? "" : String(n);
    const tg = el.querySelector(".ptoggle span"); if (tg) tg.textContent = n ? `Plan text · step ${n}` : n === 0 ? "Plan text · the problem" : "Plan text";
    let cur = null;
    el.querySelectorAll(".pstep").forEach((s) => { const on = n != null && Number(s.dataset.step) === n; s.setAttribute("aria-current", String(on)); if (on) cur = s; });
    // beside the video, the lit step is kept in view — unless the pointer is in the column, reading ahead
    const sc = el.querySelector(".pscroll");
    if (cur && this.$(".wrap").classList.contains("beside") && !el.matches(":hover")) {
      const top = cur.offsetTop - 8;
      if (top < sc.scrollTop || top + Math.min(cur.offsetHeight, sc.clientHeight * 0.6) > sc.scrollTop + sc.clientHeight) sc.scrollTo({ top, behavior: "smooth" });
    }
  }
  syncPlanToggle() {
    const el = this.$?.(".plantext"), b = el?.querySelector(".ptoggle"); if (!b) return;
    el.toggleAttribute("data-open", !!this._planOpen); b.setAttribute("aria-expanded", String(!!this._planOpen));
    // the same switch in the controls, where it is seen without opening the record
    const cb = this.$('.transport [data-act="plantext"]'); if (cb) { cb.hidden = el.hidden; cb.setAttribute("aria-pressed", String(!!this._planOpen)); cb.title = this._planOpen ? "Hide the plan text (L)" : "Plan text beside the video (L)"; }
    b.title = this._planOpen ? "Hide the plan's text" : "Show what the plan says about the step the video is on, beside the video where there is room";
  }
  togglePlanText() { this._planOpen = !this._planOpen; try { localStorage.setItem("rp:plan-open", this._planOpen ? "1" : "0"); } catch {} this.syncPlanToggle(); this.placePlan(); this.syncPlanStep(); }
  // A click on a step's heading (not a drag that selects its words) or its time: the video goes to its
  // first frame, playing on if it was playing. Going back this way is a rewind like any other (D-005).
  jumpToStep(n) {
    const t = this.stepStart(n); if (t == null) return;
    const from = this.watchedT();
    if (this._pendingDecision && !this._folded) this.fold(true);
    this.start(); this.closePull(); this._byHand = true; this.jump(t);
    this.noteRewind(from, t);
    this.status(n ? `step ${n}` : "the start");
  }

  // ---- plan anchoring -------------------------------------------------------
  frameAt(t) {
    const fr = this.planMap?.frames || [];
    return fr.find((f) => t >= f.start && t < f.start + (f.durationSeconds || 0)) || fr[fr.length - 1] || null;
  }
  planFor(t, path) {
    const f = this.frameAt(t);
    const plan = { step: f?.planStep ?? null, questions: f?.planQuestions ?? [], component: null };
    // Hit-test the composition DOM along the stroke for explicit plan anchors
    // (data-plan-step / data-plan-question / data-plan-component). Sample the whole path, not just
    // its centre, so a stroke across a rail slot resolves even when its centre lands in a gutter.
    try {
      const doc = this.player.iframeElement?.contentDocument;
      if (doc && path?.length) {
        const W = doc.documentElement.clientWidth || 1920, H = doc.documentElement.clientHeight || 1080;
        const pts = path.length > 2 ? path.filter((_, i) => i % Math.max(1, Math.floor(path.length / 12)) === 0) : [path[0], path[1], [(path[0][0] + path[1][0]) / 2, (path[0][1] + path[1][1]) / 2]];
        if (path.length === 2 && (path[0][0] !== path[1][0] || path[0][1] !== path[1][1])) { // box: also sample its centre + edges
          const [[x0, y0], [x1, y1]] = path; pts.push([(x0 + x1) / 2, (y0 + y1) / 2], [x0, y1], [x1, y0]);
        }
        const found = { step: null, question: null, component: null };
        const win = doc.defaultView;
        for (const [x, y] of pts) {
          // elementsFromPoint (plural): the full-frame captions clip sits on top of every frame and
          // would otherwise be the only hit. Skip it and anything hidden; walk each hit's ancestors.
          const stack = (doc.elementsFromPoint ? doc.elementsFromPoint(x * W, y * H) : [doc.elementFromPoint(x * W, y * H)]).filter(Boolean);
          for (let el of stack) {
            if (el.closest && el.closest("#el-captions, [data-track-kind='captions']")) continue;
            if (win && win.getComputedStyle(el).visibility === "hidden") continue;
            while (el && el !== doc.body) {
              const d = el.dataset || {};
              if (d.planStep && found.step == null) found.step = Number(d.planStep);
              if (d.planQuestion && found.question == null) found.question = Number(d.planQuestion);
              if (d.planComponent && found.component == null) found.component = d.planComponent;
              el = el.parentElement;
            }
            if (found.step != null || found.component != null || found.question != null) break;
          }
          if (found.step != null && found.component != null) break;
        }
        if (found.step != null) plan.step = found.step;
        if (found.question != null) plan.questions = [found.question];
        plan.component = found.component;
      }
    } catch {}
    return plan;
  }
  frameRef(t) { const f = this.frameAt(t); return f ? { index: f.index, compositionId: f.compositionId, title: f.title } : null; }

  // ---- drawing --------------------------------------------------------------
  pos(e) { const r = this.canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }
  pointerDown(e) {
    if (!this.tool) return;
    this.closeMarkBox(true);   // starting the next mark keeps the words typed on the last one
    this.player.pause();
    this.canvas.setPointerCapture(e.pointerId);
    // Select: the mark under the pointer, or nothing — a click on empty stage lets go of the selection.
    // The box opens on pointerup, after the focus the click itself moves.
    if (this.tool === "select") { const a = this.markAt(e); this._picking = a || null; if (a) { this._sel = a.id; this.syncSel(); } else this.deselect(); this.redraw(); return; }
    // Eraser: one gesture takes every mark it touches, and is one U to put back
    if (this.tool === "erase") { this._erasing = []; this._eraserAt = this.pos(e); this._swath = [this._eraserAt]; this.eraseAlong(e, null); return; }
    this.deselect();
    this._drawing = { kind: this.tool, path: [this.pos(e)] };
  }
  pointerMove(e) {
    if (this.tool === "select" && !this._drawing) { const over = !!this.markAt(e); if (over !== !!this.canvas.dataset.over) { if (over) this.canvas.dataset.over = "1"; else delete this.canvas.dataset.over; } return; }
    if (this.tool === "erase") {
      const last = this._eraserAt; this._eraserAt = this.pos(e);
      if (this._erasing) { this._swath.push(this._eraserAt); this.eraseAlong(e, last); }
      else this._erasePreview = new Set(this.marksAt(e).map((a) => a.id));   // what a click here would take, shown faded
      this.redraw(); return;
    }
    if (!this._drawing) return;
    const p = this.pos(e);
    if (this._drawing.kind === "stroke") this._drawing.path.push(p); else this._drawing.path[1] = p;
    this.redraw();
  }
  pointerUp() {
    if (this._picking !== undefined) { const a = this._picking; this._picking = undefined; if (a) setTimeout(() => this.openMarkBox(a, "edit"), 0); return; }
    if (this._erasing) {
      const gone = this._erasing; this._erasing = null; this._swath = null; this._erasePreview = null;
      if (gone.length) { this.pushUndo(gone); this.afterMarksChanged(); this.status(`erased ${gone.length} mark${gone.length === 1 ? "" : "s"} — press U to put ${gone.length === 1 ? "it" : "them"} back`); }
      this.redraw(); return;
    }
    if (!this._drawing) return;
    const d = this._drawing; this._drawing = null;
    if (d.path.length < 2) return;
    const a = this.add({ kind: d.kind, path: d.path });
    // after the pointer events that follow this one, so nothing moves focus out of the box
    setTimeout(() => this.openMarkBox(a), 0);
  }
  // ---- hit-testing the marks on this frame --------------------------------------
  // Forgiving on purpose: within 8 px of a line (plus half its width), or anywhere inside a box.
  // Marks are tested newest first, so where two overlap the one drawn on top is the one you get.
  visibleMarks() {
    const t = this.player?.currentTime ?? this._lastT, f = this.frameAt(t);
    return this.annotations.filter((a) => a.path && (f ? a.frame?.index === f.index : Math.abs(a.t - t) < 2));
  }
  markAt(e) { return this.marksAt(e)[0] || null; }
  marksAt(e, at = null) {
    const S = this.canvas.getBoundingClientRect(); if (!S.width) return [];
    const x = at ? at[0] * S.width : e.clientX - S.left, y = at ? at[1] * S.height : e.clientY - S.top;
    return this.visibleMarks().reverse().filter((a) => this.hits(a, x, y, S));
  }
  hits(a, x, y, S, tol = 8) {
    const k = S.width / this.canvas.width, r = tol + (5 * k) / 2;   // 5 is the stroke's width in canvas units
    const P = a.path.map(([u, v]) => [u * S.width, v * S.height]);
    const near = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = dx * dx + dy * dy; const s = L ? Math.max(0, Math.min(1, ((x - p[0]) * dx + (y - p[1]) * dy) / L)) : 0; return Math.hypot(x - p[0] - s * dx, y - p[1] - s * dy) <= r; };
    if (a.kind === "box" && P[1]) { const x0 = Math.min(P[0][0], P[1][0]), x1 = Math.max(P[0][0], P[1][0]), y0 = Math.min(P[0][1], P[1][1]), y1 = Math.max(P[0][1], P[1][1]); return x >= x0 - r && x <= x1 + r && y >= y0 - r && y <= y1 + r; }
    if (a.kind === "arrow" && P[1]) {
      const [p0, p1] = P, ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), L = 22 * k;
      return near(p0, p1) || near(p1, [p1[0] - L * Math.cos(ang - 0.45), p1[1] - L * Math.sin(ang - 0.45)]) || near(p1, [p1[0] - L * Math.cos(ang + 0.45), p1[1] - L * Math.sin(ang + 0.45)]);
    }
    if (P.length === 1) return near(P[0], P[0]);
    for (let i = 1; i < P.length; i++) if (near(P[i - 1], P[i])) return true;
    return false;
  }
  // The eraser samples the line from where the pointer was to where it is, every 4 px, so a fast
  // drag cannot jump over a thin stroke between two pointermove events.
  eraseAlong(e, from) {
    const S = this.canvas.getBoundingClientRect(); if (!S.width) return;
    const to = this.pos(e), a0 = from || to, n = Math.max(1, Math.ceil(Math.hypot((to[0] - a0[0]) * S.width, (to[1] - a0[1]) * S.height) / 4));
    let took = false;
    for (let i = 0; i <= n; i++) {
      const at = [a0[0] + ((to[0] - a0[0]) * i) / n, a0[1] + ((to[1] - a0[1]) * i) / n];
      for (const a of this.marksAt(null, at)) { this._erasing.push(...this.removeMarks([a])); took = true; if (this._sel === a.id) this._sel = null; }
    }
    if (took) { this.renderList(); this.syncClear(); }
    this.redraw();
  }
  // ---- selecting a mark ---------------------------------------------------------
  // Selected, a mark carries a coral halo and a dashed outline, the others on the frame step back,
  // and its words open beside it to edit. Delete (or the bin on the box) removes it; U puts it back.
  selectMark(a) {
    if (!a?.path) return;
    this._sel = a.id; this.syncSel(); this.redraw();
    setTimeout(() => this.openMarkBox(a, "edit"), 0);
  }
  deselect() {
    if (!this._sel) return false;
    this._sel = null;
    if (this.$(".markbox")?.dataset.mode === "edit") this.closeMarkBox(true);
    this.syncSel(); this.redraw();
    return true;
  }
  syncSel() { this.$$?.(".ann[data-selmark]").forEach((r) => r.setAttribute("aria-current", String(r.dataset.selmark === this._sel))); }
  // A mark's row in the record is the way to it: the frame it was drawn on, with it selected.
  selectFromRecord(id) {
    const a = this.annotations.find((x) => x.id === id); if (!a?.path) return;
    this.start(); this.toFrame(); this.player.pause();
    if (!this.visibleMarks().includes(a)) this.player.seek(a.t);
    this.setTool("select"); this.selectMark(a);
  }
  deleteSelected() {
    const a = this.annotations.find((x) => x.id === this._sel);
    if (!a || !this.visibleMarks().includes(a)) { this.deselect(); return; }
    this.deleteMarks([a], "deleted");
  }
  deleteMarks(list, verb) {
    this.closeMarkBox(true);
    const gone = this.removeMarks(list); if (!gone.length) return;
    if (gone.some((g) => g.a.id === this._sel)) this._sel = null;
    this.pushUndo(gone); this.afterMarksChanged(); this.syncSel(); this.focus({ preventScroll: true });
    this.status(`${verb} ${gone.length === 1 ? "a mark" : `${gone.length} marks`} — press U to put ${gone.length === 1 ? "it" : "them"} back`);
  }
  // Type on the mark. A finished mark opens a small box beside it on the (still paused)
  // frame: Enter or Escape makes the words that mark's comment, and × throws them away. The
  // drawing and what it means end up in one place instead of two. A selected mark opens the same
  // box with its words in it ("edit"): there × drops the edit, and the bin deletes the mark.
  openMarkBox(a, mode = "new") {
    if (!a || !this.annotations.includes(a)) return;
    const box = this.$(".markbox"), inp = box.querySelector("[data-markword]"), S = this.picRect();
    if (!S.width) return;
    if (mode === "edit" && this._sel !== a.id) return;   // let go of before the box could open
    this._markFor = a.id; inp.value = a.comment || ""; box.hidden = false; box.dataset.mode = mode; this.growMarkWord();
    const edit = mode === "edit", x = box.querySelector("[data-markdiscard]");
    box.querySelector("[data-marktrash]").hidden = !edit;
    x.title = edit ? "Drop this edit (the words stay as they were)" : "Discard these words (the mark stays)";
    x.setAttribute("aria-label", edit ? "Drop this edit" : "Discard these words");
    box.querySelector(".k").innerHTML = edit ? "<kbd>Enter</kbd> saves · <kbd>Esc</kbd> closes (kept) · <kbd>×</kbd> drops the edit" : "<kbd>Enter</kbd> saves · <kbd>Esc</kbd> closes (kept) · <kbd>×</kbd> deletes";
    inp.setAttribute("aria-label", edit ? "Your words for this mark — Enter saves the edit, Esc closes and keeps it, × drops it" : "Your words for this mark — Enter saves them, Esc closes and keeps them, × deletes them");
    const xs = a.path.map((p) => p[0]), ys = a.path.map((p) => p[1]);
    const x0 = Math.min(...xs) * S.width, x1 = Math.max(...xs) * S.width, y0 = Math.min(...ys) * S.height, y1 = Math.max(...ys) * S.height;
    const bw = box.offsetWidth, bh = box.offsetHeight, clampX = (x) => Math.max(8, Math.min(S.width - bw - 8, x)), clampY = (y) => Math.max(8, Math.min(S.height - bh - 8, y));
    // beside the mark: to its right if that fits, else its left; on a frame too narrow for either
    // (a phone), under it, else over it — the words should not cover what they are about
    let left, top;
    if (x1 + 12 + bw <= S.width - 8) { left = x1 + 12; top = clampY(y0); }
    else if (x0 - 12 - bw >= 8) { left = x0 - 12 - bw; top = clampY(y0); }
    else { left = clampX(x0); top = y1 + 12 + bh <= S.height - 8 ? y1 + 12 : clampY(y0 - 12 - bh); }
    box.style.left = `${Math.round(left)}px`; box.style.top = `${Math.round(top)}px`;
    this.player.pause(); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length);
  }
  growMarkWord() { const ta = this.$?.("[data-markword]"); if (!ta) return; ta.style.height = "auto"; ta.style.height = `${ta.scrollHeight}px`; ta.style.overflowY = ta.scrollHeight > ta.clientHeight + 1 ? "auto" : "hidden"; }
  closeMarkBox(save, refocus = false) {
    const box = this.$?.(".markbox"); if (!box || box.hidden) return false;
    const inp = box.querySelector("[data-markword]"), text = inp.value.replace(/\s*\n\s*/g, " ").trim(), a = this.annotations.find((x) => x.id === this._markFor);
    box.hidden = true; this._markFor = null; inp.value = ""; delete box.dataset.mode;
    // an edit can empty a mark's words on purpose; a new mark with nothing typed simply stays wordless
    if (save && a && text !== (a.comment || "").trim()) { a.comment = text; this.persist(); this.renderList(); this.dispatchEvent(new CustomEvent("annotation", { detail: a })); }
    if (refocus) this.focus();   // back to the player, so the keys work again; a blur leaves focus where the reviewer put it
    return true;
  }
  add(partial) {
    // an explicit t wins, and the frame and plan anchors follow it: a question's answer belongs to
    // the beat that asked, not to wherever the playhead happened to be when it was typed
    const t = +(partial.t ?? this.player.currentTime ?? this._lastT).toFixed(2);
    const a = { id: `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, ...partial, t, frame: this.frameRef(t), plan: { ...this.planFor(t, partial.path), ...(partial.plan || {}) }, comment: partial.comment ?? "" };
    this.annotations.push(a);
    this.persist(); this.renderList(); this.redraw(); this.syncClear(); this.updateStatus();
    // Right after a seek the runtime may not have instantiated the frame's sub-composition yet, so the
    // DOM hit test finds only the host. Re-run it shortly after; a late anchor updates the annotation.
    if (partial.path && a.plan.step == null && a.plan.component == null && !a.plan.questions?.length) {
      const retry = (n) => setTimeout(() => { const p2 = this.planFor(a.t, a.path); if (p2.step != null || p2.component != null || p2.questions?.length) { a.plan = p2; this.persist(); this.renderList(); this.dispatchEvent(new CustomEvent("annotation", { detail: a })); } else if (n > 0) retry(n - 1); }, 350);
      retry(3);
    }
    this.dispatchEvent(new CustomEvent("annotation", { detail: a }));
    return a;
  }
  redraw() {
    const c = this.ctx, W = this.canvas.width, H = this.canvas.height;
    c.clearRect(0, 0, W, H);
    const here = this.visibleMarks(), sel = here.find((a) => a.id === this._sel), boxed = this.$(".markbox")?.hidden === false ? this._markFor : null;
    const visible = this.marksOn || this.tool ? here : here.filter((a) => a === sel || a.id === boxed);   // Marks off: only the one being worked on
    const cw = this.canvas.getBoundingClientRect().width, k = cw ? W / cw : 1;   // canvas units per CSS px
    const acc = this.accentRgb();   // your marks are yours: the page's accent, whichever theme
    for (const a of visible) {
      // selected: a coral halo under the mark itself; the rest step back; what the eraser is over fades
      c.globalAlpha = this._erasePreview?.has(a.id) ? 0.3 : sel && a !== sel ? 0.4 : 1;
      if (a === sel) { c.globalAlpha = 1; this.drawOne(c, a, W, H, { color: `rgba(${acc},.3)`, width: 16 }); }
      this.drawOne(c, a, W, H, { color: `rgb(${acc})` });
    }
    c.globalAlpha = 1;
    if (this._drawing) this.drawOne(c, this._drawing, W, H, { color: `rgb(${acc})` });
    if (sel) {
      const xs = sel.path.map((p) => p[0] * W), ys = sel.path.map((p) => p[1] * H), pad = 10 * k;
      c.save(); c.strokeStyle = `rgb(${acc})`; c.lineWidth = 1.5 * k; c.setLineDash([6 * k, 4 * k]);
      c.strokeRect(Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + 2 * pad);
      c.restore();
    }
    // the eraser: its ring where the pointer is, and while it is down, the swath it has cut
    if (this.tool === "erase" && this._eraserAt) {
      const ink = this.theme === "dark" ? "242,239,232" : "20,20,19", paper = this.theme === "dark" ? "20,19,16" : "250,249,245", r = (8 + 2.5 / k) * k;
      c.save(); c.lineCap = "round"; c.lineJoin = "round";
      if (this._swath?.length > 1) { c.strokeStyle = `rgba(${ink},.1)`; c.lineWidth = 2 * r; c.beginPath(); this._swath.forEach(([x, y], i) => (i ? c.lineTo(x * W, y * H) : c.moveTo(x * W, y * H))); c.stroke(); }
      const [ex, ey] = this._eraserAt;
      c.beginPath(); c.arc(ex * W, ey * H, r, 0, Math.PI * 2); c.fillStyle = `rgba(${paper},.55)`; c.fill();
      c.strokeStyle = `rgba(${ink},.72)`; c.lineWidth = 1.5 * k; c.stroke();
      c.restore();
    }
  }
  accentRgb() { try { return getComputedStyle(this).getPropertyValue("--accent-rgb").trim() || "184,85,46"; } catch { return "184,85,46"; } }
  drawOne(c, a, W, H, { color = `rgb(${this.accentRgb()})`, width = 5 } = {}) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = "round"; c.lineJoin = "round";
    const P = a.path.map(([x, y]) => [x * W, y * H]);
    if (a.kind === "stroke") { c.beginPath(); P.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); }
    else if (a.kind === "box" && P[1]) { c.strokeRect(P[0][0], P[0][1], P[1][0] - P[0][0], P[1][1] - P[0][1]); }
    else if (a.kind === "arrow" && P[1]) {
      const [x0, y0] = P[0], [x1, y1] = P[1]; const ang = Math.atan2(y1 - y0, x1 - x0), L = 22;
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - L * Math.cos(ang - 0.45), y1 - L * Math.sin(ang - 0.45)); c.moveTo(x1, y1); c.lineTo(x1 - L * Math.cos(ang + 0.45), y1 - L * Math.sin(ang + 0.45)); c.stroke();
    }
  }

  // ---- decisions: pause, ask, branch ------------------------------------------
  // the runtime's seek() pauses playback; a routing jump (skipped branch, skipped level frame) must keep playing
  // lands a hair past t: the runtime quantizes seeks to frames, and landing just before a boundary would re-trigger the same route
  // An answered question on screen (a quick check just answered, or any question met again) has
  // nothing left to wait for. If the reviewer moves the playhead during its 4 s countdown, it closes
  // there and then: kept open (or folded) it would stay the pending question, and the next question
  // would show this one's sheet.
  dropAnswered() { const p = this._pendingDecision; if (!p || !this.isAnswered(p)) return false; this.stopWait(); this.closeCard(); return true; }
  jump(t) { this._seeked = true; this.dropAnswered(); const dur = this.player.duration || Infinity; const wasPlaying = !this.player.paused; if (t >= dur - 0.1) { this.player.seek(dur); return; } this.player.seek(t + 0.05); if (wasPlaying) this.player.play(); }
  // Every point where the video asks something, one shape per kind (as on the timeline): quick
  // checks first, then the agent's calls, then the plan's choices, the order a tick looks at them.
  points() { const m = this.planMap || {}; return [...(m.quizzes || []).map((q) => ({ kind: "check", q })), ...(m.autonomy || []).map((q) => ({ kind: "call", q })), ...(m.autonomyGroups || []).map((q) => ({ kind: "group", q })), ...(m.decisions || []).map((q) => ({ kind: "choice", q }))]; }
  // Every call the agent made, on its own beat or in a grouped one: one record per call either
  // way, so the export, the record, the Finish panel and \`reel record\` read them all alike.
  // The agent's choices, counted once, as the guide counts them (lib/guide/reader.mjs choiceCounts): the ones the video
  // stops on (a choice alone, or a group that stops on each), the ones on its list at the end, the ones shown together
  // with no stop (an older grouped beat), and, packed by bundle-player from walkthrough.md, how many there are in all
  // and how many are only in the guide (plan-map choiceCounts).
  choiceCounts() {
    const m = this.planMap || {}, G = m.autonomyGroups || [], n = (f) => G.filter(f).reduce((k, g) => k + (g.ids || g.calls || []).length, 0);
    const pause = (m.autonomy || []).length + n((g) => g.stop && !g.list), list = n((g) => g.list), shown = n((g) => !g.stop && !g.list), c = m.choiceCounts || {};
    return { pause, list, shown, total: Math.max(c.total || 0, pause + list + shown), only: c.only || 0 };
  }
  // …in a few words: "12 stops, 4 more at the end" (the poster), or a sentence (the page's line under its title)
  choiceWords({ long = false } = {}) {
    const c = this.choiceCounts(), s = (k) => (k === 1 ? "" : "s");
    if (!long) return [c.pause ? `${c.pause} stop${s(c.pause)}` : "", c.list ? (c.pause ? `${c.list} more at the end` : `${c.list} on the list at the end`) : "", c.shown ? `${c.shown} more shown together` : ""].filter(Boolean).join(", ");
    const lead = c.pause ? `It stops on ${c.pause} of the agent's choice${s(c.pause)}` : c.list || c.shown ? "It stops on none of the agent's choices" : "";
    const parts = [lead, c.list ? `lists ${c.list} more at the end` : "", c.shown ? `shows ${c.shown} more together` : ""].filter(Boolean); if (!parts.length) return "";
    return parts.slice(0, -1).join(", ") + (parts.length > 1 ? " and " : "") + parts.at(-1) + (c.only ? ` (${c.only} smaller one${s(c.only)} only in the guide)` : "");
  }
  calls() { const m = this.planMap || {}; return [...(m.autonomy || []), ...(m.autonomyGroups || []).flatMap((g) => (g.calls || []).map((c) => ({ ...c, at: g.at, group: g.id })))].sort((a, b) => a.at - b.at); }
  groupDone(g) { return (g.calls || []).every((c) => this.autonomy[c.id]); }
  // on the record at all ("explain this more" included): met again, it shows what was said
  recorded(pt) { const id = pt.q.id; return pt.kind === "check" ? !!this.quizzes[id] : pt.kind === "call" ? !!this.autonomy[id] : pt.kind === "group" ? this.groupDone(pt.q) : !!this.decisions[id]; }
  // the question on the sheet already has an answer on the record
  isAnswered(p = this._pendingDecision) { return !!p && (p.kind === "quiz" ? !!this.quizzes[p.q.id] : p.kind === "autonomy" ? !!this.autonomy[p.a.id] : p.kind === "group" ? this.groupDone(p.g) : !!this.decisions[p.id]); }
  pendingId(p = this._pendingDecision) { return !p ? null : p.kind === "quiz" ? p.q.id : p.kind === "autonomy" ? p.a.id : p.kind === "group" ? p.g.id : p.id; }
  // The video carrying the reviewer past something (an unchosen branch, a beat for another level): the
  // questions in what it skipped were not met, so none of them stops the video where it lands.
  route(from, to) { for (const pt of this.points()) if (pt.q.at > from && pt.q.at < to) this._past = { ...(this._past || {}), [pt.q.id]: true }; this.jump(to); }
  // Meet a question: ask it, or, answered already, show it again with its answer (each ask* draws
  // both). Met once in this pass: it does not stop the video again until the playhead goes back before it.
  meet(pt) {
    this._past = { ...(this._past || {}), [pt.q.id]: true };
    // reached again after "Back to where this was explained": it waits, answered or not, until Continue
    const back = this._waitFor === pt.q.id; if (back) { this._waitFor = null; this._opening = true; }
    try { if (pt.kind === "check") this.askQuiz(pt.q); else if (pt.kind === "call") this.askAutonomy(pt.q); else if (pt.kind === "group") this.askGroup(pt.q); else this.askDecision(pt.q); }
    finally { if (back) { this._opening = false; this._openedFor = this._pendingDecision; } }
  }
  // "Back to where this was explained": the start of what a quick check tests. The beat the
  // storyboard names (`- explained_at:`, lifted into the plan map as explainedAt), else the first beat of its
  // step, else the start of its part. The video plays from there, and the question waits when it is reached.
  explainedAt(q) {
    if (Number.isFinite(q?.explainedAt)) return q.explainedAt;
    const f = q?.planStep != null ? (this.planMap?.frames || []).find((x) => x.planStep === q.planStep && x.start < q.at && !x.branch && !x.quiz) : null;
    return f ? f.start : (this.chapterAt(q.at)?.start ?? 0);
  }
  backToExplained(id) {
    const q = (this.planMap?.quizzes || []).find((x) => x.id === id); if (!q) return;
    const from = this.watchedT(), to = this.explainedAt(q);
    if (this._dopen) { this._dopen.wasPlaying = false; this.closeDetail(); }
    this.giveWay();
    if (this._past) delete this._past[q.id];
    this._waitFor = q.id;
    this.start(); this.toFrame(); this.$(".chend").classList.remove("on"); this._byHand = true; this._seeked = true;
    this.player.seek(to + 0.05); this.player.play();
    this.noteRewind(from, to);   // a trip back is a rewind (D-005), whichever button made it
    this.status(`Back to where this was explained, ${this.fmt(to)}; the quick check waits when it comes up`);
  }
  // A question's mark on the timeline, or its time in the record: that question, now, paused, answered
  // or not, whatever is playing. The reviewer's own move, so it goes past any sheet that is up.
  openPoint(kind, id) {
    // a grouped call's time in the record opens its group's sheet
    const pt = this.points().find((x) => x.kind === kind && x.q.id === id) || (kind === "call" ? this.points().find((x) => x.kind === "group" && (x.q.ids || []).includes(id)) : null); if (!pt) return;
    if (this._dopen) { this._dopen.wasPlaying = false; this.closeDetail(); }
    this.giveWay();
    this.start(); this.toFrame(); this.$(".chend").classList.remove("on"); this._byHand = true;
    // opened on purpose, it stays until the reviewer goes on: no countdown (startWait)
    this._opening = true; try { this.meet(pt); } finally { this._opening = false; }
    this._openedFor = this._pendingDecision;
  }
  // The sheet up gives way to another question. One still open is asked again when the video reaches it.
  giveWay() {
    const p = this._pendingDecision; if (!p) return;
    if (!this.isAnswered(p)) { const id = this.pendingId(p); delete this._askedOnce?.[id]; delete this._past?.[id]; }
    this.closeCard();
  }
  // the question whose mark is under the pointer on the timeline, within 6 px of it
  pointAt(e) {
    const r = this.$(".scrub").getBoundingClientRect(), dur = this.dur(); if (!r.width || !dur) return null;
    const x = e.clientX - r.left;
    return (this._points || []).map((p) => ({ p, dx: Math.abs((p.at / dur) * r.width - x) })).filter((o) => o.dx <= 6).sort((a, b) => a.dx - b.dx)[0]?.p || null;
  }
  // ← / →: five seconds back or on, the way a scrub click moves (D-005: back more than 2 s is a rewind)
  seekBy(d) {
    const from = this.watchedT(), to = Math.max(0, Math.min(this.dur() || 0, from + d));
    this.start(); this._byHand = true; this.jump(to);
    this.noteRewind(from, to);
  }
  tickDecisions(t) {
    const decs = this.planMap?.decisions || [];
    // Where the playhead was at the tick before this one in this run of play (from Play to a pause or a seek): a
    // question the video played across since then is reached too, however far it went. On a busy machine the page
    // can go seconds between ticks, and the playhead with it (the runtime's clock is the wall's; the tick after a
    // stall can still carry the time from before it, the next the jump). Played across is moving forward, and no
    // further since Play than the clock allows (as skipUnchanged tells a seek apart); a seek is not playing across,
    // it lands where it was sent. A tick outside that (one from before the seek that began the run, still on its way
    // from the old place) or while paused leaves the run as it was.
    const run = this._run, from = run?.last;
    const ran = !!run && !this.player.paused && t > from && t >= run.t - 0.05 && t - run.t <= ((performance.now() - run.at) / 1000) * (this.speed || 1) * 1.5 + 0.35;
    if (ran) run.last = t;
    // A part boundary. By default the video plays straight on into the next part and names it in the
    // frame's corner (the reviewer asked for it: clicking "Next part" at the end of every part was
    // monotonous on a long video). With "Pause between parts" on, it stops once at the end of each
    // part as it used to, with the end-of-part sheet. The card is for the video carrying the reviewer
    // into a later part — playing on, or a route past an answered question or an unchanged beat —
    // not for the reviewer's own move there (scrub, N / P, a timestamp), and not while paused. The
    // play state is read a moment after this tick: a route seeks (which pauses) and then plays, and
    // the runtime can take a few frames to start again.
    const chs = this.planMap?.chapters || [];
    const j = chs.indexOf(this.chapterAt(t)), was = this._chIdx, byHand = this._byHand; this._chIdx = j; this._byHand = false;
    if (!this.pauseParts) {
      if (was != null && j > was && !byHand) setTimeout(() => { if (!this.player.paused && !this._pendingDecision && this.chapterAt(this.player.currentTime) === chs[j]) this.showPartCard(j); }, 250);
    } else for (let i = 0; i + 1 < chs.length; i++) { const c = chs[i]; if (t >= c.end - 0.25 && t < c.end + 0.6 && !this._chapterShown?.[c.id] && !this._pendingDecision) { this._chapterShown = { ...(this._chapterShown || {}), [c.id]: true }; this.player.pause(); this.player.seek(c.end - 0.2); const box = this.$('.chend'); box.querySelector('.k').textContent = `End of chapter ${i + 1} of ${chs.length} · ${this.fmt(c.end)}`; box.querySelector('.q').textContent = `Next, chapter ${i + 2}: ${plainTitle(chs[i + 1].title)}, ${this.approx(chs[i + 1].watchedSeconds)}.`; box.classList.add('on'); this.syncScrub(); return; } }
    // 1. skip the branches that were not chosen
    if (this._skipUntil && t >= this._skipUntil.from - 0.05 && t < this._skipUntil.to) { const to = this._skipUntil.to; this._skipUntil = null; this.route(t, to); return; }
    // a folded question is still a stop: scrub back and rewatch as much as you like, but arriving at
    // the moment that asked brings the sheet back rather than playing on past it
    if (this._pendingDecision && this._folded) { const at = this.pendingAt(); if (at != null && t >= at - 0.05 && !this.player.paused) this.unfoldAt(); return; }
    // An open question, not answered and not put aside, that the video has left while playing (Play
    // pressed with it up, or a seek away and Play) gives way, and stops the video again when it is reached.
    // Not in its first 600 ms: a timeupdate from before its seek can still arrive from the old place.
    if (this._pendingDecision && !this.player.paused && !this.isAnswered() && performance.now() - (this._askedAt || 0) > 600) { const at = this.pendingAt(); if (at != null && (t < at - 0.15 || t >= at + 0.6)) this.giveWay(); }
    if (this._pendingDecision) return;
    // A question stops the video once per pass, not once ever: gone back before it, it is due again
    // (the owner: going back to before a question should bring it back, even an answered one). Not
    // while a sheet is up: a timeupdate from before its seek can arrive after it, from the old place.
    if (this._past) for (const pt of this.points()) if (this._past[pt.q.id] && t < pt.q.at - 0.15) delete this._past[pt.q.id];
    // knowledge level: skip frames that do not serve the chosen level
    if (this.level && this.planMap?.levels) { const f = this.frameAt(t); if (f && f.knowledge && !f.knowledge.includes(this.level)) { const nxt = (this.planMap.frames || []).find((x) => x.start > f.start && (!x.knowledge || x.knowledge.includes(this.level))); this.route(t, nxt ? nxt.start : this.player.duration); return; } }
    // reaching a question: asked if it is open, shown again with its answer if it is not (meet). Reached is the
    // playhead within 0.6 s past it, or played across it since the last tick (`ran`, above): on a busy machine the page
    // can go seconds between ticks, and the video ran on past a question without stopping. A seek (jump, a route past
    // a branch) is not playing across; it lands where it was sent. Crossed more than one, the first is met (its ask
    // takes the video back to it).
    const across = (q) => ran && from < q.at && t >= q.at;
    for (const pt of [...this.points()].sort((a, b) => a.q.at - b.q.at)) {
      const q = pt.q;
      if ((t < q.at || t >= q.at + 0.6) && !across(q)) continue;
      if (this._past?.[q.id] || this.passedOver(q, t)) continue;
      if (pt.kind === "check" && !this.checksOn) continue;   // quick checks off: the video does not stop for one
      this.meet(pt); return;
    }
    // 2. a decision already made (e.g. from a previous session): route past it without asking
    for (const d of decs) {
      const made = this.decisions[d.id]; if (!made) continue;
      const chosen = d.options.find((o) => o.id === made.option);
      if (!chosen?.branch) {
        // no branch of its own (a pick-all answer, an own-words answer, an option the storyboard gave
        // no beat): everything between the question and where the video goes on is someone else's
        // path. A pick-all answer goes on at its summary frame (D-004), the rest at resumeAt.
        const to = made.option === "multi" && d.summary ? d.summary.start : d.resumeAt;
        if (to - d.at > 0.3 && t >= d.at + 0.1 && t < to - 0.1) { this.route(t, to); return; }
        continue;
      }
      const others = d.options.filter((o) => o.branch && o.id !== chosen.id);
      for (const o of others) if (t >= o.branch.start - 0.05 && t < o.branch.end - 0.1) { // inside an unchosen branch
        const next = t < chosen.branch.start ? chosen.branch.start : d.resumeAt; this.route(t, next); return;
      }
    }
  }
  // the card that names a part as it begins; it takes no clicks and goes by itself after 2.5 s
  showPartCard(j) {
    const chs = this.planMap?.chapters || [], c = chs[j], el = this.$?.(".partcard"); if (!c || !el) return;
    el.querySelector(".k").textContent = `Chapter ${j + 1} of ${chs.length}`;
    el.querySelector(".t").textContent = plainTitle(c.title); el.querySelector(".sep").hidden = !c.title;
    el.dataset.part = String(j); el.dataset.ann = ""; el.classList.add("on"); el.setAttribute("aria-hidden", "false");
    clearTimeout(this._partCardTimer);
    this._partCardTimer = setTimeout(() => { el.classList.remove("on"); el.setAttribute("aria-hidden", "true"); }, 2500);
  }
  // a comment gone to from the record or the timeline: the part's card names it on the frame a moment (the status line
  // is short on a laptop), "Your comment · its words"
  showNoteCard(k, words, ann = "") {
    const el = this.$?.(".partcard"); if (!el) return;
    el.dataset.ann = ann || "";
    const w = String(words || "").replace(/\s+/g, " ").trim();
    el.querySelector(".k").textContent = k; el.querySelector(".t").textContent = w.length > 90 ? `${w.slice(0, 89)}…` : w; el.querySelector(".sep").hidden = !w;
    el.dataset.part = ""; el.classList.add("on"); el.setAttribute("aria-hidden", "false");
    clearTimeout(this._partCardTimer);
    this._partCardTimer = setTimeout(() => { el.classList.remove("on"); el.setAttribute("aria-hidden", "true"); }, 4000);
  }
  // Per viewer, like the speed: off unless the reviewer turned it on.
  get pauseParts() { if (this._pauseParts === undefined) { try { this._pauseParts = localStorage.getItem("rp:pauseParts") === "1"; } catch { this._pauseParts = false; } } return this._pauseParts; }
  setPauseParts(on) {
    this._pauseParts = !!on;
    try { localStorage.setItem("rp:pauseParts", on ? "1" : "0"); } catch {}
    const cb = this.$?.("[data-pauseparts]"); if (cb) cb.checked = this._pauseParts;
    // turned off while the end-of-part sheet is up: nothing is waiting on it any more
    if (!on) this.$?.(".chend")?.classList.remove("on");
    this.status(on ? "Stopping at the end of each chapter" : "Playing straight on into the next chapter");
  }
  // Quick checks on or off; on unless someone says otherwise. The viewer's own choice wins: the page's ?checks=on|off,
  // else what this viewer last set (the Quick checks switch, or K; rp:checks, per viewer like the speed), else the
  // video's own default (plan-map `checks`, from its BRIEF.md: a video can ship with them off), else on. Off, the video
  // does not stop for a quick check; one that is a scene of its own is skipped as the video plays, the way just the
  // changes skips a scene that did not change (skipUnchanged), and one asked over a scene about something else does not open.
  get checksOn() {
    if (this._checksPick === undefined) {
      let v = null;
      try { const q = new URLSearchParams(location.search).get("checks"); if (q === "on" || q === "off") v = q; } catch {}
      if (!v) try { const s = localStorage.getItem("rp:checks"); if (s === "on" || s === "off") v = s; } catch {}
      this._checksPick = v;
    }
    return (this._checksPick || (this.planMap?.checks === "off" ? "off" : "on")) !== "off";
  }
  setChecks(on) {
    this._checksPick = on ? "on" : "off";
    try { localStorage.setItem("rp:checks", this._checksPick); } catch {}
    // turned off with a quick check waiting for its answer: it goes, and the video plays on past it
    const p = this._pendingDecision;
    if (!on && p?.kind === "quiz" && !this.isAnswered(p)) { const id = p.q.id; this.giveWay(); this._past = { ...(this._past || {}), [id]: true }; this.player.play(); }
    this.syncChecks(); this.renderScrub(); this.syncGallery(); this.idle(this.stage?.dataset.ready === "1");
    this.status(on ? "Quick checks on: the video stops at each one" : "Quick checks off: the video plays on past them, and skips the scenes that ask them");
  }
  toggleChecks() { this.setChecks(!this.checksOn); }
  syncChecks() {
    const b = this.$?.(".checksbtn"); if (!b) return;
    const on = this.checksOn, none = !(this.planMap?.quizzes || []).length; b.hidden = none;
    // the same switch in Steps, with how the video plays (and the one a phone has: its controls row has no room)
    const cb = this.$(".checksbox"); if (cb) { cb.hidden = none; cb.querySelector("input").checked = on; }
    b.setAttribute("aria-checked", String(on)); b.querySelector("b").textContent = on ? "on" : "off";
    b.setAttribute("aria-label", `Quick checks: ${on ? "on" : "off"} (K)`);
    b.title = on ? "Quick checks: on, the video stops at each one — K turns them off" : "Quick checks: off, the video plays on past them — K turns them on";
  }
  // The scenes that are a quick check of their own: the check's frame, tagged with it (`- quiz:`, as plan-map.mjs
  // writes every check's frame; the scenes `reelplanning chapters --no-checks` cuts out), and asking nothing else.
  checkScenes() {
    const m = this.planMap; if (this._checkScenesFor === m) return this._checkScenes; this._checkScenesFor = m;
    const fr = m?.frames || [];
    return (this._checkScenes = new Set((m?.quizzes || []).map((q) => fr.find((f) => f.index === q.frameIndex)).filter((f) => f && f.quiz && !f.decision && !f.autonomy && !f.autonomyGroup).map((f) => f.index)));
  }
  // a scene the video passes over as it plays: unchanged while just the changes play, or a quick check's own with checks off
  skips(i) { return (this._only && !this.plays(i)) || (!this.checksOn && this.checkScenes().has(i)); }
  openCard(kind, key, question, optsHtml, hint, { note = null, confirm = false, reason = "", bandHint = "", about = "" } = {}) {
    const box = this.$(".decision"); box.querySelector(".k").textContent = key; box.querySelector(".k").title = about; box.querySelector(".q").innerHTML = this.glossHtml(question);   // its glossary words underlined, its ids said with what they are
    box.querySelector(".walk").hidden = true; box.querySelector(".walkbtn").hidden = true;   // a quick check's walk-through shows once it is answered (syncWalk)
    const why = box.querySelector(".reason"); why.innerHTML = reason; why.hidden = !reason;
    const opts = box.querySelector(".opts"); opts.dataset.kind = kind; opts.innerHTML = optsHtml; opts.dataset.n = String(opts.children.length);
    // A note rides on a decision's answer, whichever kind of answer it is (null: this card takes none).
    const nb = box.querySelector(".note"); nb.hidden = note == null; nb.querySelector("textarea").value = note || "";
    const cb = box.querySelector(".confirm"); cb.hidden = !confirm; box.querySelector(".gobtn").hidden = true;
    const hn = box.querySelector(".hint"); hn.textContent = hint; delete hn.dataset.live; box.querySelector(".feedback").style.display = "none";
    const dis = box.querySelector(".disagree"); dis.classList.remove("on"); delete dis.dataset.wrong; dis.querySelector("textarea").value = ""; dis.querySelector(".kept").textContent = "";
    this.stopWait();
    // Every question the player asks goes through here, so the reviewer's own answer belongs here
    // too: a plan review whose options were all written by the plan's author is not a review. The
    // options offered are the author's guesses at the answer; this is the reviewer saying otherwise.
    const own = box.querySelector(".own");
    own.hidden = false; own.classList.remove("open"); this._ownFor = null;
    own.querySelector("textarea").value = "";
    this.ownIsChange(false);   // plan questions and quick checks keep their wording; askAutonomy says otherwise
    box.querySelector(".unclearbtn").hidden = true;   // plan decisions only; askDecision shows it
    this._folded = false; box.classList.remove("folded", "rowopen");
    // A question asked takes the frame back from a drawing tool: with one on, the stage hides the cards'
    // hit boxes and its canvas takes every click, so a card could not be picked (an A pressed once more
    // after a stop's last verdict closed it turns on the arrow; the next quick check came up unclickable).
    // Marking the frame a question is about is done with the question folded, as the keys say.
    if (this.tool) this.setTool(null);
    this.closePull();   // a question is not asked underneath the record sheet
    // its letters answer it, so the keyboard has to be here: when the button that led here has
    // gone (the record's "change" re-renders its row away), focus has fallen to <body>
    if (!document.activeElement || document.activeElement === document.body) this.focus({ preventScroll: true });
    // Where the frame's cards can take the answer (or on a call, which has none to take), the
    // question is not asked again over the frame: the band holds the rest. Otherwise the sheet.
    box.querySelector(".q").removeAttribute("title");   // the band shows the whole question now (fitBand), not on hover
    box.querySelector(".backbtn").hidden = kind !== "quiz";   // every quick check can go back to where it was explained
    const call = kind === "call" || kind === "stop", cards = call ? null : this.frameCards(), callCards = call ? this.frameCallCards() : null;
    // on a touch screen there are no keys to name: the card is tapped
    const touch = (() => { try { return matchMedia("(hover:none)").matches; } catch { return false; } })();
    this._bandHint = touch && bandHint ? bandHint.replace(/^Click (a card|an answer), or press [^.]*\./, "Tap $1.").replace(/^Tick the cards that apply \([^)]*\)/, "Tap the cards that apply") : bandHint || hint;
    // Answer in the frame: where the frame has a card for each option (or each choice the agent made) and the
    // frame is large enough to write on, everything happens on it; else the answer bar, or the sheet as before.
    const mode = (cards || callCards) && this.onframeRoom() ? "onframe" : call || cards ? "band" : "sheet";
    this.placeCard(mode);
    if (cards || mode === "onframe") hn.textContent = this._bandHint;
    box.classList.add("on"); this._askedAt = performance.now(); this.closeMore(); this.renderHits(cards, mode === "onframe" ? callCards : null); this.syncBand(); this.fitBand(); this.updateStatus();
    this.recheckCards(); this.syncDetailChip();   // the frame is the cards' now: the thing's button stays unless a card lies over it (D-246)
  }
  // ---- Answer on the video (plan 2026-09-24) ---------------------------------------------------
  // The question's own frame, and each of its options' cards in it, as boxes in percent of the
  // stage, or null when the frame has no card for every option. The runtime draws every frame into the
  // same page (hidden until its turn), so the search stays inside the question's own composition. A card
  // is found by its letter first: `data-option` (what new frames carry), `data-plan-option` (older
  // frames), an id ending in "-opt-a" and the like; only then by order, among the elements whose class
  // ends in "-opt". Each rule has to find exactly one card per option, or the next one is tried.
  frameCards(p = this._pendingDecision) {
    if (!p || p.kind === "autonomy" || p.kind === "group") return null;
    const q = p.kind === "quiz" ? p.q : p, ids = (q.options || []).map((o) => String(o.id).toLowerCase());
    if (!ids.length) return null;
    const F = this.frameRoot(q); if (!F) return null;
    const hit = this.cardsIn(F.root, ids); if (!hit) return null;
    const boxes = this.boxesOf(F, hit.by, ids); if (!boxes) return null;
    this._cardsBy = hit.rule;   // which rule matched, for the specs (older frames by order)
    this._frameOf = F;
    return boxes;
  }
  // The question's own composition in the frame's page (the runtime mounts every frame into one page).
  frameRoot(q) {
    const cid = q?.compositionId || (this.planMap?.frames || []).find((f) => f.index === q?.frameIndex)?.compositionId || (q?.at != null ? this.frameAt(q.at)?.compositionId : null);
    let doc, win, ifr; try { ifr = this.player.iframeElement; doc = ifr?.contentDocument; win = doc?.defaultView; } catch { return null; }
    if (!cid || !doc || !win) return null;
    const root = [...doc.querySelectorAll("[data-composition-id]")].find((el) => el.dataset.compositionId === cid); if (!root) return null;
    return { cid, doc, win, ifr, root, tagged: root.matches('[data-band="bottom"]') || !!root.querySelector('[data-band="bottom"]') };
  }
  // The option cards in a composition, by the first rule that finds exactly one per option: { by, rule } or null.
  cardsIn(root, ids) {
    const outer = (els) => els.filter((el) => !els.some((o) => o !== el && o.contains(el)));
    const byLetter = (els, letter) => { const by = {}; for (const el of outer(els)) { const k = String(letter(el) || "").toLowerCase(); if (!ids.includes(k)) continue; if (by[k]) return null; by[k] = el; } return ids.every((k) => by[k]) ? by : null; };
    const all = [...root.querySelectorAll("*")];
    const byOrder = () => { const els = outer(all.filter((el) => [...el.classList].some((c) => /-opt$/.test(c)))); return els.length === ids.length ? Object.fromEntries(ids.map((k, i) => [k, els[i]])) : null; };
    const rules = [["data-option", () => byLetter([...root.querySelectorAll("[data-option]")], (el) => el.dataset.option)],
      ["data-plan-option", () => byLetter([...root.querySelectorAll("[data-plan-option]")], (el) => el.dataset.planOption)],
      ["id", () => byLetter(all.filter((el) => /-(opt|option|choice|chip)-[a-z]$/i.test(el.id)), (el) => el.id.slice(-1))],
      ["order", byOrder]];
    for (const [rule, f] of rules) { const by = f(); if (by) return { by, rule }; }
    return null;
  }
  // Answer in the frame: the card the frame draws for each choice the agent made (a call's own beat, a stop
  // beat's calls, the rest in one list), marked `data-call="a5"`; a frame built before that, by an id ending in
  // "-a5" on an element inside the frame (never the frame's own root). Each call needs exactly one.
  callCardsIn(root, ids, cid = "") {
    const by = {};
    for (const id of ids) {
      const k = String(id).toLowerCase();
      let els = [...root.querySelectorAll("[data-call]")].filter((el) => String(el.dataset.call).toLowerCase() === k);
      if (!els.length) els = [...root.querySelectorAll("[id]")].filter((el) => el.id.toLowerCase().endsWith(`-${k}`) && el.id !== cid && !el.hasAttribute("data-composition-id"));
      els = els.filter((el) => !els.some((o) => o !== el && o.contains(el)));
      if (els.length !== 1) return null;
      by[k] = els[0];
    }
    return by;
  }
  frameCallCards(p = this._pendingDecision) {
    if (!p || (p.kind !== "autonomy" && p.kind !== "group")) return null;
    const q = p.kind === "autonomy" ? p.a : p.g, ids = p.kind === "autonomy" ? [p.a.id] : (p.g.calls || []).map((c) => c.id);
    if (!ids.length) return null;
    const F = this.frameRoot(q); if (!F) return null;
    const by = this.callCardsIn(F.root, ids.map((x) => String(x).toLowerCase()), F.cid); if (!by) return null;
    const boxes = this.boxesOf(F, by, ids.map((x) => String(x).toLowerCase()));
    // a card, not the frame: a call's card that fills the frame has nothing beside it to answer on
    if (!boxes || Object.values(boxes).some((b) => b.w > 96 || b.h > 80)) return null;
    this._frameOf = F;
    return boxes;
  }
  // The frame is scaled into the stage: a card's box in the frame's own page, through the frame's box on the screen.
  boxesOf(F, by, ids) {
    const fr = F.ifr.getBoundingClientRect(), sr = this.picRect(), vw = F.win.innerWidth, vh = F.win.innerHeight;
    if (!fr.width || !sr.width || !vw || !vh) return null;
    const sx = fr.width / vw, sy = fr.height / vh, boxes = {};
    const toStage = (r) => ({ l: ((fr.left + r.left * sx - sr.left) / sr.width) * 100, t: ((fr.top + r.top * sy - sr.top) / sr.height) * 100, w: ((r.width * sx) / sr.width) * 100, h: ((r.height * sy) / sr.height) * 100 });
    for (const k of ids) {
      const r = by[k].getBoundingClientRect(); if (r.width < 8 || r.height < 8) return null;
      const b = toStage(r);
      if (b.l + b.w / 2 < 0 || b.l + b.w / 2 > 100 || b.t + b.h / 2 < 0 || b.t + b.h / 2 > 100) return null;   // off the frame: not a card to click
      try { const rg = F.doc.createRange(); rg.selectNodeContents(by[k]); const tr = rg.getBoundingClientRect(); if (tr.height > 0) { const t = toStage(tr); b.tb = t.t + t.h; } b.words = [...rg.getClientRects()].filter((x) => x.width > 2 && x.height > 2).map(toStage); } catch {}   // where its own words are, and where they end
      boxes[k] = b;
    }
    this._toStage = toStage;
    return boxes;
  }
  // The frame's question heading: `data-question` (what new frames carry), else the largest words above the
  // cards (the frame's headline, 30 px or more: A11), else the frame's own label line ("Choice 1 · Step 1",
  // "Question 2", "Quick check 1"). Never words inside a box of the picture (a diagram's node, a chip, a rail's
  // slot: an element that fills or rings a box narrower than most of the frame, or a plan component): on a
  // diagram above the cards the largest words were a node's ("Client SDK"), and "Full question" sat inside the
  // diagram. With none of these, "Full question" is a chip in the row (A11). Its words' own box (not the
  // block's), in percent of the stage, and its text.
  frameHeading(cards) {
    const F = this._frameOf; if (!F || !cards || !this._toStage) return null;
    const top = Math.min(...Object.values(cards).map((b) => b.t));
    let el = F.root.querySelector("[data-question]");
    if (!el) {
      const fw = F.root.getBoundingClientRect().width || F.doc.documentElement.clientWidth || 1920;
      const clear = (c) => /^(rgba\(0, 0, 0, 0\)|transparent)$/.test(c);
      const boxed = (x) => { for (let e = x; e && e !== F.root && e !== F.doc.body; e = e.parentElement) {
        if (e.hasAttribute("data-plan-component")) return true;
        const cs = F.win.getComputedStyle(e), r = e.getBoundingClientRect(); if (r.width >= fw * 0.6) continue;
        if (!clear(cs.backgroundColor) || cs.backgroundImage !== "none" || ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(cs[`border${k}Width`]) > 0 && cs[`border${k}Style`] !== "none")) return true;
      } return false; };
      const LABEL = /^\W*(choice|question|quick check|decision|the agent's choices?)\s+\d/i;
      let best = null, size = 0, label = null;
      for (const x of F.root.querySelectorAll("*")) {
        if (![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        const cs = F.win.getComputedStyle(x), fs = parseFloat(cs.fontSize) || 0; if (cs.visibility === "hidden" || cs.display === "none") continue;
        const b = this._toStage(x.getBoundingClientRect()); if (b.w < 1 || b.h < 1 || b.t + b.h > top + 0.5 || b.t < 0) continue;
        if (fs <= size && label) continue;
        if (boxed(x)) continue;
        if (fs > size) { best = x; size = fs; }
        if (!label && LABEL.test(x.textContent.replace(/\s+/g, " ").trim())) label = x;
      }
      el = best && size >= 30 ? best : label;
      if (!el) return null;   // no headline and no label line: the question is read from its chip in the row
    }
    const rg = F.doc.createRange(); rg.selectNodeContents(el);
    const r = rg.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return null;
    return { ...this._toStage(r), text: el.textContent.replace(/\s+/g, " ").trim(), marked: el.hasAttribute("data-question") };
  }
  // Is the frame large enough to write on? Not on a phone, nor a frame under 620 px wide: there the cards take
  // the tap and carry the marks, and the words stay in the answer bar under the frame.
  onframeRoom() { if (matchMedia("(max-width:600px)").matches) return false; return (this.stage?.getBoundingClientRect().width || 0) >= 620; }
  // Where the question's box goes: "onframe" (laid over the frame, beside its cards), "band" (the answer bar, in
  // the frame's empty lowest eighth or in the room kept under it: placeBand), or "sheet" (a frame with no cards).
  placeCard(mode) {
    if (mode === true) mode = "band"; else if (mode === false || !mode) mode = "sheet";
    const box = this.$(".decision"); box.classList.toggle("band", mode === "band"); box.classList.toggle("onframe", mode === "onframe");
    box.classList.remove("long", "tall", "fb-cards");
    if (mode !== "onframe") { const wk = box.querySelector(".walk"); wk.style.maxHeight = ""; wk.style.overflowY = ""; delete wk.dataset.short; delete wk.dataset.aside; }   // the frame's own placing of the walk-through
    // the bar's words are shorter, and "Show the frame" there puts the question aside rather than out of the way
    const short = mode !== "sheet";
    box.querySelector("[data-note]").placeholder = short ? "Add a note" : "Add a note to this answer (optional)";   // in the bar the field is as wide as its words
    box.querySelector(".fold").title = short ? "Put the question aside for now: the frame's cards and the keys stop answering, so you can mark the frame; it stays unanswered" : "Fold the question away so you can see the frame it is about — it stays unanswered";
    for (const el of box.querySelectorAll("[style]")) if (el !== box && !el.matches(".feedback, textarea, input")) { el.style.left = ""; el.style.top = ""; el.style.width = ""; el.style.height = ""; el.style.maxWidth = ""; }
    delete box.querySelector(".own").dataset.beside; box.querySelector(".blong").hidden = true;
    if (mode === "onframe") this.homeLayer();
    else if (mode === "band") this.homeBand(box);
    else if (box.parentElement !== this.stage) this.$(".chend").before(box);
  }
  homeBand(box = this.$(".decision")) {
    const room = this._bandPlace === "under" ? this.$(".bandroom") : this.stage;   // "in", or "frame" (a video answered on its frames keeps no room): in the frame
    if (box.parentElement === room) return;
    if (room === this.stage) this.$(".chend").before(box); else room.append(box);
  }
  // The on-frame layer is the frame's size and place: its box in the page, over the stage; zoomed in, the picture's box.
  placeLayer() {
    const box = this.$?.(".decision"), st = this.stage; if (!box || !st || !box.classList.contains("onframe")) return;
    const zin = box.parentElement?.classList.contains("zin") ? box.parentElement : null;
    const v = zin ? { "--fx": "0px", "--fy": "0px", "--fw": `${zin.offsetWidth}px`, "--fh": `${zin.offsetHeight}px` } : { "--fx": `${st.offsetLeft}px`, "--fy": `${st.offsetTop}px`, "--fw": `${st.offsetWidth}px`, "--fh": `${st.offsetHeight}px` };
    for (const [k, x] of Object.entries(v)) if (box.style.getPropertyValue(k) !== x) box.style.setProperty(k, x);
  }
  // Question 2 (built with B). Does this video leave its frames' lowest eighth for the band? Yes when the
  // frame of every question, quick check and call it asks carries data-band="bottom" on its root (the frame
  // template writes it), or the video's own root does. The runtime mounts the frames a moment after it is
  // ready, so this looks again until they are there (about 8 s at most). Until it knows, and for a video
  // built before this, the band is under the frame. Decided once: the video's size never moves after.
  // Answer in the frame: a video whose every question has its cards on its frame (each option's, each call's)
  // is answered on its frames, and keeps no room under them (`_cardsAll`).
  detectBand(n = 0) {
    if (this._bandIn !== undefined || (n === 0 && this._bandT)) return;
    this._bandT = null;
    const pts = this.points(); if (!this.planMap) return;
    let doc; try { doc = this.player.iframeElement?.contentDocument; } catch {}
    const tagged = (el) => !!el && (el.matches('[data-band="bottom"]') || !!el.querySelector(':scope > [data-band="bottom"]'));
    const all = doc ? [...doc.querySelectorAll("[data-composition-id]")] : [];
    const cidOf = (q) => q.compositionId || (this.planMap.frames || []).find((f) => f.index === q.frameIndex)?.compositionId;
    const cids = [...new Set(pts.map((pt) => cidOf(pt.q)).filter(Boolean))];
    const hosts = cids.map((c) => all.find((el) => el.dataset.compositionId === c));
    const mounted = hosts.length > 0 && hosts.every((h) => h?.firstElementChild);
    if (pts.length && !mounted && n < 40 && !tagged(all[0])) { this._bandT = setTimeout(() => this.detectBand(n + 1), 200); return; }
    const host = (q) => all.find((el) => el.dataset.compositionId === cidOf(q));
    this._cardsAll = mounted && pts.length > 0 && pts.every((pt) => { const h = host(pt.q); if (!h) return false;
      if (pt.kind === "check" || pt.kind === "choice") return !!this.cardsIn(h, (pt.q.options || []).map((o) => String(o.id).toLowerCase()));
      const ids = pt.kind === "call" ? [pt.q.id] : (pt.q.calls || []).map((c) => c.id); return !!this.callCardsIn(h, ids.map((x) => String(x).toLowerCase()), cidOf(pt.q)); });
    this._bandIn = (pts.length > 0 && tagged(all[0])) || (mounted && hosts.every(tagged));
    this.placeBand();
  }
  // Where the band sits: in the frame when the video leaves room for it, else under the frame, in room kept for
  // the whole video (the stage's size leaves it an eighth of the video's height); on a phone always under it. A
  // video that asks nothing keeps no room, nor does one answered on its frames ("frame").
  placeBand() {
    const wrap = this.$?.(".wrap"); if (!wrap) return;
    const phone = matchMedia("(max-width:600px)").matches, asks = this.points().length > 0;
    const place = !asks ? "none" : phone ? "under" : this._cardsAll ? "frame" : this._bandIn ? "in" : "under";
    if (this._bandPlace !== place) { this._bandPlace = place; wrap.classList.toggle("band-under", place === "under"); wrap.classList.toggle("band-in", place === "in"); }
    const box = this.$(".decision"); if (box?.classList.contains("band")) this.homeBand(box);
    this.homeLayer();
    this.syncBand();
  }
  // In the frame, the bar and the answer on the frame cover the caption band: while either is up (not put
  // aside), the captions step out of the way; they come back when it goes. Their descendants too, and by opacity: the
  // pill's own animation sets visibility:visible on its group, which a parent's hidden does not reach.
  syncBand() {
    const box = this.$?.(".decision"); if (!box) return;
    const up = box.classList.contains("on") && !box.classList.contains("folded");
    const cover = up && ((this._bandPlace !== "under" && box.classList.contains("band")) || box.classList.contains("onframe"));
    this.stage?.toggleAttribute("data-qcorner", up && box.classList.contains("onframe"));
    let doc; try { doc = this.player?.iframeElement?.contentDocument; } catch {} if (!doc?.documentElement) return;
    if (cover && !doc.getElementById("rp-band-style")) { const st = doc.createElement("style"); st.id = "rp-band-style"; st.textContent = 'html[data-rp-band] #el-captions,html[data-rp-band] #el-captions *,html[data-rp-band] [data-track-kind="captions"],html[data-rp-band] [data-track-kind="captions"] *{visibility:hidden!important}html[data-rp-band] #el-captions,html[data-rp-band] [data-track-kind="captions"]{opacity:0!important}'; (doc.head || doc.documentElement).appendChild(st); }
    doc.documentElement.toggleAttribute("data-rp-band", cover);
  }
  // The band reads in full (the owner's feedback on answer-on-the-video: a question cut to "Doe…", an answer's
  // explanation clipped under a scroll bar, the note field cut). Its words are measured on the kicker's line,
  // unwrapped: while they fit there the band keeps its eighth; when they do not they take a line of their own
  // and wrap (.tall), and the band grows up over the frame as they need. A note field is as wide as its words,
  // so it moves to a line of its own rather than cutting them; own words are as tall as theirs. Past the cap
  // (CSS: 40% of the frame, 60% of a phone's screen) the long words go to the side panel (.long, readBand).
  // Run when what the band holds changes, or its width does (the observers render() sets up). On the frame,
  // the same fields are fitted, and then laid out by the cards (layoutFrame).
  // An own-words box wraps and grows with its words up to `lines` lines, then scrolls inside the same box (it never
  // grows past that, so it cannot push the controls, the band or the cards around further).
  // On the frame the own-words box holds 2 lines, not 4: it sits by the cards, and a third line pushed a quick
  // check's whys on the cards behind "Read why in full" (the owner's feedback). Under the frame, in the band or the
  // sheet, it keeps 4.
  ownLines(ta) { return ta?.closest?.(".decision.onframe") ? 2 : 4; }
  fitField(ta, lines = 4) {
    if (!ta || !ta.isConnected || !ta.getClientRects().length) return;
    const cs = getComputedStyle(ta), fs = parseFloat(cs.fontSize) || 15, lh = parseFloat(cs.lineHeight) || fs * 1.35;
    const edge = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const max = Math.ceil(lh * lines + edge), prev = ta.style.height;
    ta.style.height = "auto";
    const need = ta.scrollHeight + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const h = `${Math.min(need, max)}px`; ta.style.height = h;
    const over = need > max + 1; if (ta.style.overflowY !== (over ? "auto" : "hidden")) ta.style.overflowY = over ? "auto" : "hidden";
    if (over && prev !== h && this.shadowRoot?.activeElement === ta && ta.selectionEnd === ta.value.length) ta.scrollTop = ta.scrollHeight;   // typing at the end: the end stays in view
  }
  fitBand() {
    const box = this.$?.(".decision"); if (!box) return;
    const bl = box.querySelector(".blong"), done = () => { this._bandMO?.takeRecords(); this._hitsMo?.takeRecords(); };
    const onframe = box.classList.contains("onframe");
    if (!onframe) box.classList.remove("tall", "long");
    if (!onframe) bl.hidden = true;
    if (!(box.classList.contains("band") || onframe) || !box.classList.contains("on") || box.classList.contains("folded")) { done(); return; }
    const cs = (x) => getComputedStyle(x), shown = (x) => !!x && cs(x).display !== "none" && x.getClientRects().length > 0;
    const ctx = (this._measure ||= document.createElement("canvas").getContext("2d"));
    // a note field is as wide as its placeholder (never its words: they wrap, and scroll past three lines)
    for (const f of box.querySelectorAll("textarea[data-note], textarea[data-disagree]")) {
      const c = cs(f); ctx.font = `${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`;
      const w = `${Math.ceil(Math.min(ctx.measureText(f.placeholder || "").width, 420) + parseFloat(c.paddingLeft) + parseFloat(c.paddingRight) + 4)}px`;
      if (f.style.minWidth !== w) f.style.minWidth = w;
      this.fitField(f, 3);
    }
    const ta = box.querySelector(".ownbox textarea"); if (shown(ta)) this.fitField(ta, this.ownLines(ta));
    if (onframe) { this.layoutFrame(); done(); return; }
    const fb = box.querySelector(".feedback"), text = [fb, box.querySelector(".q")].find(shown), answered = shown(fb);
    const stop = !!box.querySelector('.opts[data-kind="stop"]'), phone = matchMedia("(max-width:600px)").matches;
    if (phone || stop || (text && text.scrollWidth > text.clientWidth + 1)) box.classList.add("tall");
    if (box.scrollHeight > box.clientHeight + 1) {
      const p = this._pendingDecision, head = answered ? fb.querySelector("b")?.textContent || "" : "";
      const what = p?.kind === "group" ? "Each choice's words are too long to show here." : p?.kind === "autonomy" ? "What the agent chose is too long to show here." : answered ? "The explanation is too long to show here." : "The question is too long to show here.";
      const html = `${head ? `<b>${esc(head)}</b> ` : ""}${what} <button class="lnk" data-act="band-read" title="The whole text in the side panel; closing it brings this back">Read it in full</button>`;
      if (bl.innerHTML !== html) bl.innerHTML = html;
      box.classList.add("long"); bl.hidden = false;
    }
    done();
  }
  // ---- Answer in the frame (plan 2026-09-25-answer-in-the-frame) --------------------------------
  // What each card says once a quick check is answered: whether it is yours and whether it is the answer, and
  // its one line of why (`- option_a_why:`; the right one falls back on the check's `explain`). Never before.
  cardWhys() {
    const p = this._pendingDecision; if (p?.kind !== "quiz") return [];
    const q = p.q, r = this.quizzes[q.id]; if (!r) return [];
    const own = r.answer === "own", ex = q.explain ? q.explain.charAt(0).toUpperCase() + q.explain.slice(1) : "";
    return (q.options || []).map((o) => {
      const chosen = !own && r.answer === o.id, right = o.id === q.answer;
      const head = chosen && right ? "Your answer · right" : chosen ? `Your answer · not quite, it is ${String(q.answer).toUpperCase()}` : right ? "The answer" : "";
      const text = o.why || (right ? ex : "");
      return head || text ? { id: o.id, chosen, right, head, text } : null;
    }).filter(Boolean);
  }
  // A card's sublines: the frame's own words just under an option's box ("1 txn per part" under Postgres,
  // "write · check · retry" under S3 object) are part of that option, and what the player lays under the card
  // (its why, a choice's Accept and Flag, your own words, the row of chips) goes under them, never over them. Each
  // card's bottom (b.b) is taken down past the lines of the frame's words that start within a short step under
  // it and sit mostly across it; its own box's bottom is kept as b.ib (what goes inside the card goes above
  // that). Only the layout reads this; the card's button is still the option's own box.
  withSublines(bx, P, H) {
    const F = this._frameOf, cards = Object.values(bx); if (!F || !this._toStage || !cards.length) return;
    const seen = (e) => { let o = 1; for (let x = e; x && x !== F.doc.documentElement; x = x.parentElement) { const cs = F.win.getComputedStyle(x); if (cs.visibility === "hidden" || cs.display === "none") return false; o *= parseFloat(cs.opacity); if (o < 0.2) return false; } return true; };
    const lines = [];
    try {
      const w = F.doc.createTreeWalker(F.root, 4); let n;
      while ((n = w.nextNode())) {
        if (!n.textContent.trim() || !seen(n.parentElement)) continue;
        const rg = F.doc.createRange(); rg.selectNodeContents(n);
        for (const q of rg.getClientRects()) {
          if (q.width < 2 || q.height < 2) continue;
          const s = this._toStage(q), l = P({ l: s.l, t: s.t, w: s.w, h: s.h }), cx = (l.l + l.r) / 2, cy = (l.t + l.b) / 2;
          if (!cards.some((c) => cx > c.l && cx < c.r && cy > c.t && cy < c.b)) lines.push(l);   // a card's own words are its own
        }
      }
    } catch { return; }
    for (const c of cards) {
      c.ib = c.b;
      for (let more = true; more;) {
        more = false;
        const step = Math.max(H * 0.03, (c.ib - c.t) * 0.35);   // how far under the card a line still belongs to it
        for (const l of lines) {
          const across = Math.min(l.r, c.r) - Math.max(l.l, c.l);
          if (l.b > c.b + 0.5 && l.t >= c.ib - 2 && l.t <= c.b + step && across >= (l.r - l.l) * 0.5) { c.b = l.b; more = true; }
        }
      }
      c.h = c.b - c.t;
    }
  }
  // Lays the question's box out on the frame, by its cards: each card's why under it, the note on the card you
  // picked, a choice's Accept, Flag and own words under its card, your own words beside the cards (or under
  // them), then one row of chips under all of it (in a frame's reserved lowest eighth, where it keeps one), and
  // a walk-through above the cards. Everything is placed in the layer's pixels; nothing is cut: a why too long
  // for the room shows its first words' verdict and the rest opens in the side panel ("Read why in full").
  layoutFrame(again = false) {
    const box = this.$(".decision"); if (!box?.classList.contains("onframe")) return;
    this.placeLayer();
    if (!box.classList.contains("on") || box.classList.contains("folded")) return;
    const p = this._pendingDecision, set = this._cards || this._callCards; if (!p || !set) return;
    const W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
    const P = (b) => { const l = (b.l * W) / 100, t = (b.t * H) / 100, w = (b.w * W) / 100, h = (b.h * H) / 100; return { l, t, w, h, r: l + w, b: t + h, ...(b.tb != null ? { tb: (b.tb * H) / 100 } : {}), words: (b.words || []).map((x) => ({ l: (x.l * W) / 100, t: (x.t * H) / 100, r: ((x.l + x.w) * W) / 100, b: ((x.t + x.h) * H) / 100 })) }; };
    const bx = Object.fromEntries(Object.entries(set).map(([k, b]) => [k, P(b)])), cards = Object.values(bx);
    this.withSublines(bx, P, H);
    const U = { l: Math.min(...cards.map((c) => c.l)), t: Math.min(...cards.map((c) => c.t)), r: Math.max(...cards.map((c) => c.r)), b: Math.max(...cards.map((c) => c.b)) };
    const gap = Math.round(Math.max(6, Math.min(12, W * 0.008))), edge = Math.round(W * 0.012), foot = H - gap;   // foot: the frame's bottom edge, the room's end
    const shown = (el) => !!el && !el.hidden && getComputedStyle(el).display !== "none";
    const put = (el, x, y, w = null) => { el.style.left = `${Math.round(x)}px`; el.style.top = `${Math.round(y)}px`; el.style.width = w == null ? "" : `${Math.round(w)}px`; };
    const $ = (s) => box.querySelector(s);
    const vr = box.getBoundingClientRect();
    // the lowest the layer may reach: in the window, and over the timeline at most, never over the controls row under it (A2)
    const ctl = [...this.shadowRoot.querySelectorAll(".transport > :not(.scrub)")].map((x) => x.getBoundingClientRect()).filter((r) => r.height > 0 && r.top > vr.top + H / 2);
    // zoomed in, the layer is inside the picture's view, which scrolls to whatever it holds: its own room is the limit
    const maxY = box.parentElement?.classList.contains("zin") ? Infinity : Math.min(innerHeight - vr.top - 8, ctl.length ? Math.min(...ctl.map((r) => r.top)) - vr.top - 4 : Infinity);
    let floor = U.b;
    // 1. a choice the agent made: its Accept, Flag and own words under its card (or in its foot, where the next card is close)
    const acts = [], under = {};
    if (p.kind === "group" && (p.g.stop || p.g.list)) for (const row of box.querySelectorAll(".crow")) { const b = bx[String(row.dataset.call).toLowerCase()]; if (b) acts.push([b, [row]]); }
    else if (p.kind === "group") for (const f of box.querySelectorAll(".gflag")) { const b = bx[String(f.dataset.gflag).toLowerCase()]; if (b) acts.push([b, [f]]); }
    else if (p.kind === "autonomy") { const b = bx[String(p.a.id).toLowerCase()]; if (b) acts.push([b, [...box.querySelectorAll('.opts .opt[data-verdict]')]]); }
    for (const [b, els] of acts) {
      const ws = els.map((el) => el.offsetWidth), h = Math.max(...els.map((el) => el.offsetHeight)), tw = ws.reduce((a, x) => a + x, 0) + gap * (els.length - 1);
      const below = cards.filter((c) => c !== b && c.t >= b.b - 1 && c.l < b.r && b.l < c.r).map((c) => c.t);
      // under the card's corner; where the next card is too close, inside it, in its bottom-right corner (a frame
      // keeps a card's words at its left, and its labels at its top right: style guide §8), unless that covers the
      // card's own words: then straddling the gap to the next card, unless that covers the next card's words
      const hits = (x, y, c) => (c?.words || []).some((w) => x < w.r && x + tw > w.l && y < w.b && y + h > w.t);
      const next = below.length ? cards.find((c) => c !== b && c.t === Math.min(...below) && c.l < b.r && b.l < c.r) : null;
      let y = b.b + gap / 2, inside = false, x = Math.max(edge, b.r - tw);
      if (next && y + h > next.t - 2) {
        const xi = Math.max(edge, b.r - 8 - tw), yi = (b.ib ?? b.b) - h - 8;
        if (!hits(xi, yi, b)) { inside = true; x = xi; y = yi; }
        else if (hits(x, y, next)) { inside = true; x = xi; y = yi; }   // no way clear of every word: in the card's corner
      }
      els.forEach((el, i) => { put(el, x, y + (h - el.offsetHeight) / 2); x += ws[i] + gap; });
      under[b.l + ":" + b.t] = inside ? b.b : y + h; if (!inside) floor = Math.max(floor, y + h);
    }
    // 2. your own words: a slot beside the cards where the frame has room there, else first under them; a
    //    choice's own words (on a stop beat) under that choice's card
    const own = $(".own"), ownOpen = own.classList.contains("open");
    let ownInRow = shown(own);
    delete own.dataset.beside; own.style.height = "";
    if (shown(own) && p.kind === "group" && p.g.stop && this._ownFor) {
      const b = bx[String(this._ownFor).toLowerCase()];
      if (b) { const w = Math.min(W - 2 * edge, Math.max(b.w * 0.6, Math.min(560, W * 0.5))), x = Math.max(edge, Math.min(b.r - w, W - edge - w)); const y = Math.max(under[b.l + ":" + b.t] || b.b, b.b) + gap; put(own, x, y, w); floor = Math.max(floor, y + own.offsetHeight); ownInRow = false; }
    } else if (shown(own) && (p.kind === "quiz" || this.isDec(p))) {
      const room = W - edge - (U.r + gap * 1.5), last = cards.reduce((a, c) => (c.r > a.r ? c : a));
      if (room >= Math.max(W * 0.14, 180)) {
        own.dataset.beside = ""; const w = Math.min(last.w, room);
        put(own, U.r + gap * 1.5, U.t, w); if (!ownOpen) own.style.height = `${Math.round(U.b - U.t)}px`;
        ownInRow = false;
      }
    }
    // 3. the row of chips, measured first (laid out from 0; placed last): left with the cards, what goes on
    //    (Confirm, Continue, Accept all) at its right
    const F = this._frameOf, rowL = Math.max(edge, U.l), rowR = Math.min(W - edge, Math.max(U.r, rowL + W * 0.5));
    const full = [], inline = [], end = [];
    const fb = $(".feedback"), bl = $(".blong"), dis = $(".disagree"), note = $(".note"), more = $(".rowmore");
    let fold = 0;   // 1: the hint goes, "Read why in full" a chip; 2: the chips that do not go on behind "…"
    const setFold = (n) => {
      fold = n; for (const el of box.querySelectorAll("[data-folded]")) delete el.dataset.folded;
      if (n) box.dataset.rowfold = String(n); else delete box.dataset.rowfold;
      let any = false; if (n >= 2) for (const el of box.querySelectorAll(".unclearbtn,.walkbtn,.backbtn,.blong")) if (shown(el)) { el.dataset.folded = ""; any = true; }
      more.hidden = !any;
    };
    setFold(0);
    const chosenId = p.kind === "quiz" ? this.quizzes[p.q.id]?.answer : this.isDec(p) && this.isAnswered(p) ? this.decisions[p.id]?.option : null, cb = chosenId && bx[chosenId];
    delete note.dataset.attached; delete dis.dataset.attached; delete dis.dataset.inrow;
    let attachDis = shown(dis) && !!cb, attachNote = shown(note) && !!cb && this.isDec(p) && this.isAnswered(p);
    const setAttach = (on) => { for (const [a, el] of [[attachDis, dis], [attachNote, note]]) { if (!a && el !== dis) continue; el.toggleAttribute("data-attached", !!on && a); } dis.toggleAttribute("data-inrow", shown(dis) && !(on && attachDis)); };
    setAttach(true);
    const measureRow = () => {
      full.length = 0; inline.length = 0; end.length = 0;
      if (shown(fb)) full.push(fb); if (shown(bl) && !("folded" in bl.dataset)) (fold ? inline : full).push(bl);
      if (ownInRow) (ownOpen ? full : inline).push(own);
      for (const s of [".disagree", ".unclearbtn", ".note", ".walkbtn", ".backbtn", ".foot .hint"]) { const el = $(s); if (shown(el) && !("attached" in el.dataset) && !("folded" in el.dataset)) inline.push(el); }
      if (shown(more)) inline.push(more);
      // no heading found on the frame: "Full question" is a chip in the row (the layer and the stage share one box)
      const qm = !this._qbox && this._cards ? this.$(".hits .qmore") : null; if (qm && !qm.hidden) { qm.style.transform = "none"; inline.splice(ownInRow && !ownOpen ? 1 : 0, 0, qm); }
      for (const s of [".confirm", ".gobtn", ".opts [data-gaccept]"]) { const el = $(s); if (shown(el)) end.push(el); }
      for (const el of [...inline, ...end]) { el.style.left = "0px"; el.style.top = "0px"; }   // measured where nothing narrows them
      const placed = [], size = new Map(); let y = 0;
      for (const el of full) { put(el, rowL, 0, rowR - rowL); placed.push([el, rowL, y, rowR - rowL]); y += el.offsetHeight + gap; }
      let x = rowL, line = [], lineH = 0;
      const flush = () => { for (const [el, lx] of line) placed.push([el, lx, y + (lineH - el.offsetHeight) / 2, el.style.width ? parseFloat(el.style.width) : null]); if (line.length) y += lineH + gap; line = []; lineH = 0; x = rowL; };
      for (const el of inline) {
        el.style.width = ""; if (el.matches(".hint")) el.style.maxWidth = `${Math.round(rowR - rowL)}px`;
        if (el === own) el.style.width = `${Math.round(Math.min(rowR - rowL, Math.max(W * 0.22, 260)))}px`;
        if (el === dis) el.style.width = `${Math.round(Math.min(rowR - rowL, (parseFloat(el.querySelector("textarea").style.minWidth) || 240) + 220))}px`;
        const w = el.offsetWidth, h = el.offsetHeight; size.set(el, [w, h, el.style.width ? parseFloat(el.style.width) : null]);
        if (x > rowL && x + w > rowR) flush();
        line.push([el, x]); x += w + gap; lineH = Math.max(lineH, h);
      }
      for (const el of end) size.set(el, [el.offsetWidth, el.offsetHeight, null]);
      const ew = end.reduce((a, el) => a + el.offsetWidth, 0) + gap * Math.max(0, end.length - 1), eh = Math.max(0, ...end.map((el) => el.offsetHeight));
      if (end.length && line.length && x + ew > rowR + 1) flush();
      if (end.length) { lineH = Math.max(lineH, eh); let ex = rowR - ew; for (const el of end) line.push([el, ex]), (ex += el.offsetWidth + gap); }
      flush();
      return { placed, h: Math.max(0, y - gap), size, full: [...full], inline: [...inline], end: [...end] };
    };
    // 4. a quick check answered: each card's why, joined to its foot, where the frame has room under the cards for
    //    them, the note on your answer and the row; else inside each card's lower part (a quick check's card keeps its
    //    words at its top); else each card keeps its verdict and the words open in the side panel ("Read why in full")
    const whys = this.cardWhys(), wbox = $(".fwhys"), sig = JSON.stringify(whys);
    if (wbox.dataset.sig !== sig) { wbox.dataset.sig = sig; wbox.innerHTML = whys.map((x) => `<div class="fwhy" data-for="${esc(x.id)}" data-right="${x.right}" data-chosen="${x.chosen}">${x.head ? `<b>${esc(x.head)}</b>` : ""}${x.text ? `<span class="wt">${this.glossHtml(x.text)}</span>` : ""}</div>`).join(""); }
    box.classList.toggle("fb-cards", whys.length > 0 && this.quizzes[p.q?.id]?.answer !== "own");
    this.$(".hits")?.toggleAttribute("data-whys", whys.length > 0);
    const wel = [...wbox.children].filter((el) => bx[el.dataset.for]);
    const attachW = (el) => { const inp = el.querySelector("textarea"), need = (parseFloat(inp?.style.minWidth) || 0) + 24; return Math.min(W - 2 * edge, Math.max(cb.w, need, 240)); };
    const fitIn = (el) => this.fitField(el.querySelector("textarea"), 3);
    const noteHOf = () => (attachDis && "attached" in dis.dataset ? (put(dis, 0, 0, attachW(dis)), fitIn(dis), dis.offsetHeight + gap) : 0) + (attachNote && "attached" in note.dataset ? (put(note, 0, 0, attachW(note)), fitIn(note), note.offsetHeight + gap) : 0);
    let noteH = noteHOf(), row = measureRow();
    let obs = [], laid = null;   // what sits under the cards: the whys and the note, which the row flows around; how the whys were laid
    const lay = (mode) => {   // → how far down the cards' own things reach ("none": the whys are not on the frame)
      let low = floor; obs = []; laid = mode;
      for (const el of wel) {
        const b = bx[el.dataset.for]; el.toggleAttribute("data-inside", mode === "inside"); el.hidden = mode === "none";
        if (mode === "none") { under[el.dataset.for] = b.b; continue; }   // its verdict rides on the card's tag instead (syncHits)
        if (mode === "inside") { put(el, b.l + 8, 0, b.w - 16); put(el, b.l + 8, (b.ib ?? b.b) - 8 - el.offsetHeight, b.w - 16); under[el.dataset.for] = b.b; }
        else { put(el, b.l, b.b + gap, b.w); under[el.dataset.for] = b.b + gap + el.offsetHeight; low = Math.max(low, under[el.dataset.for]); obs.push({ l: b.l, r: b.r, t: b.b, b: under[el.dataset.for] }); }
      }
      // the note on your answer, on the card you picked: "Expected something else?" on a quick check, a choice's note met again
      for (const [on, el] of [[attachDis, dis], [attachNote, note]]) { if (!on || !("attached" in el.dataset)) continue; const w = attachW(el), x = Math.max(edge, Math.min(cb.l, W - edge - w)), y = (under[chosenId] || cb.b) + gap; put(el, x, y, w); fitIn(el); under[chosenId] = y + el.offsetHeight; low = Math.max(low, under[chosenId]); obs.push({ l: x, r: x + w, t: y - gap, b: under[chosenId] }); }
      return low;
    };
    // the row flowed around what sits under the cards, from just under them: into the columns the whys leave free
    const around = (y0) => {
      if (row.full.length) return null;
      const items = [...row.inline], ends = [...row.end], placed = [], sz = (el) => row.size.get(el) || [el.offsetWidth, el.offsetHeight, null];
      const lh = Math.max(0, ...[...items, ...ends].map((el) => sz(el)[1])); let y = y0;
      for (let guard = 0; (items.length || ends.length) && guard < 24; guard++) {
        const blocks = obs.filter((o) => o.t < y + lh && o.b > y).map((o) => [o.l - gap, o.r + gap]).sort((a, b) => a[0] - b[0]);
        const free = []; let x0 = rowL; for (const [l, r] of blocks) { if (l > x0) free.push({ a: x0, z: Math.min(l, rowR), x: x0 }); x0 = Math.max(x0, r); } if (x0 < rowR) free.push({ a: x0, z: rowR, x: x0 });
        const line = [];
        for (const iv of free) while (items.length && iv.x + sz(items[0])[0] <= iv.z + 0.5) { line.push([items[0], iv.x]); iv.x += sz(items.shift())[0] + gap; }
        if (!items.length && ends.length) { const ew = ends.reduce((a, el) => a + sz(el)[0], 0) + gap * (ends.length - 1), iv = free[free.length - 1]; if (iv && iv.z - iv.x >= ew - 0.5) { let ex = iv.z - ew; for (const el of ends) { line.push([el, ex]); ex += sz(el)[0] + gap; } ends.length = 0; } }
        if (!line.length) { const next = blocks.length ? Math.min(...obs.filter((o) => o.t < y + lh && o.b > y).map((o) => o.b)) : y + lh; y = Math.max(y + 1, next + gap); continue; }
        for (const [el, x] of line) placed.push([el, x, y + (lh - sz(el)[1]) / 2, sz(el)[2]]);
        y += lh + gap;
      }
      return items.length || ends.length ? null : { placed, bottom: y - gap };
    };
    // The first way that fits: the whys under the cards, the note on the card you picked (else in the row); the
    // whys inside the cards, under each card's own words; then the same reaching over the timeline under the
    // frame (never the controls under it); last, each card keeps its verdict and the words open in the side panel.
    const LONG = `The why of each answer is too long to show here. <button class="lnk" data-act="band-read" title="The whole explanation in the side panel; closing it brings this back">Read why in full</button>`;
    const LONG_CHIP = `<button class="lnk" data-act="band-read" title="The why of each answer is too long to show here: the whole explanation in the side panel; closing it brings this back">Read why in full</button>`;
    const loose = Math.min(maxY, H + 56), words = (el) => { const b = bx[el.dataset.for]; return (b.ib ?? b.b) - 8 - (b.tb ?? b.b); };   // room under a card's own words, inside it
    // What is laid under a card never covers another card, nor another why: a card stacked under the one it is about
    // showed its words between two of them (the answer-on-the-video walkthrough's quick check, answered wrong). So a
    // try that meets a card is passed over too (the verdicts alone under the cards, taken whatever the room where they
    // meet nothing, included), then the verdicts alone in each card's corner ("longin") and, last, none by the cards:
    // each verdict on its card's tag (syncHits) and "Read why in full".
    const meets = (a, c) => a.l < c.r - 1 && c.l < a.r - 1 && a.t < c.b - 1 && c.t < a.b - 1;
    const clash = () => obs.some((o, i) => cards.some((c) => meets(o, c)) || obs.some((q, j) => j > i && meets(o, q)));
    const tries = !wel.length ? [["below", true, "block", Infinity], ["below", false, "block", Infinity]]
      : box.classList.contains("long") ? [["long", true, "block", loose], ["long", true, "around", loose], ["long", false, "around", loose], ["long", false, "block", Infinity], ["longin", true, "block", loose], ["longin", false, "block", loose], ["none", false, "block", Infinity]]
      : [["below", true, "block", foot], ["below", true, "around", foot], ["below", false, "block", foot], ["below", false, "around", foot], ["inside", true, "block", foot], ["inside", false, "block", foot],
        ["below", true, "around", loose], ["below", false, "around", loose], ["long", true, "block", loose], ["long", true, "around", loose], ["long", false, "block", Infinity],
        ["longin", true, "block", loose], ["longin", false, "block", loose], ["none", false, "block", Infinity]];   // where nothing meets a card, the same tries as before, the last taken whatever the room
    const floor0 = floor, long0 = box.classList.contains("long");
    let low = floor, flowed = null, rowTop = 0;
    // 5. all of it again with the row folded (the hint gone, then the rest behind "…") where the row would reach the
    //    controls under the video; folded as far as it goes and still too low, the row is lifted clear of them
    for (const n of [0, 1, 2]) {
      floor = floor0; low = floor; flowed = null; box.classList.toggle("long", long0); setFold(n);
      for (const [ti, [how, att, flow, limit]] of tries.entries()) {
        if (att && !attachDis && !attachNote && tries.some(([h2, a2, f2]) => h2 === how && !a2 && f2 === flow)) continue;   // nothing to attach: the next try is the same
        const long = how === "long" || how === "longin" || how === "none", L = fold ? LONG_CHIP : LONG; box.classList.toggle("long", long); bl.hidden = !long; if (long && bl.innerHTML !== L) bl.innerHTML = L;
        if (fold >= 2) setFold(2);   // "Read why in full" shown or not: it folds with the rest
        setAttach(att); noteH = noteHOf(); row = measureRow();
        low = lay(how === "inside" || how === "longin" ? "inside" : how === "none" ? "none" : "below");
        if ((how === "inside" || how === "longin") && wel.some((el) => el.offsetHeight > words(el))) continue;   // it would cover the card's own words
        if (ti < tries.length - 1 && clash()) continue;   // it would cover another card, or another why
        flowed = flow === "around" ? around(Math.max(floor, U.b) + gap * 1.5) : null;
        if (flow === "around" ? flowed && Math.max(flowed.bottom, low) <= limit : low + gap * 1.5 + row.h <= limit) break;   // the whys too: none may run past it
        flowed = null;
      }
      floor = low;
      // 6. the row: under everything above it, in the reserved eighth where the frame keeps one, and up out of the way
      //    of the frame's foot when a tall item (your own words open) needs it; or flowed around the whys (above)
      rowTop = floor + gap * 1.5; if (F?.tagged) rowTop = Math.max(rowTop, H * 0.875 + gap / 2);
      rowTop = Math.max(floor + gap * 1.5, Math.min(rowTop, foot - row.h));
      if ((flowed ? flowed.bottom : rowTop + row.h) <= loose) break;
    }
    // the whys not on the frame: each verdict rides on its card's tag (syncHits); set once the layout is settled, so a
    // try on the way there does not change the cards' buttons (and lay them out again)
    const tags = laid === "none" ? Object.fromEntries(whys.filter((x) => x.head).map((x) => [x.id, x.head])) : null;
    if (JSON.stringify(tags) !== JSON.stringify(this._whyTags || null)) { this._whyTags = tags; this.$(".hits")?.toggleAttribute("data-whytags", !!tags); this.syncHits(); }
    if (more.hidden) box.classList.remove("rowopen");   // nothing folded: no menu to keep open
    more.setAttribute("aria-expanded", String(box.classList.contains("rowopen")));
    if (flowed && flowed.bottom > loose) flowed = null;
    if (!flowed && rowTop + row.h > loose) rowTop = Math.max(gap, loose - row.h);   // never over the controls: over the frame's foot instead
    if (flowed) for (const [el, lx, ly, lw] of flowed.placed) put(el, lx, ly, lw);
    else for (const [el, lx, ly, lw] of row.placed) put(el, lx, rowTop + ly, lw);
    const rowBottom = flowed ? flowed.bottom : rowTop + row.h;
    // "…" open: the chips folded behind it, stacked above it, at its right edge
    if (!more.hidden && box.classList.contains("rowopen")) {
      const r = parseFloat(more.style.left) + more.offsetWidth; let y = parseFloat(more.style.top) - gap / 2;
      for (const el of [...box.querySelectorAll("[data-folded]")].reverse()) { el.style.width = ""; y -= el.offsetHeight; put(el, Math.max(edge, r - el.offsetWidth), y); y -= gap / 2; }
    }
    // 7. a walk-through: never over the question's heading, its cards or anything laid out by them (it covered the
    //    heading, found on the answer-in-the-frame walkthrough). The first place it fits whole: between the heading
    //    and the cards; under the row, in the frame; beside the heading, above the cards; beside the cards; under the
    //    row, reaching over the timeline. Else the larger of the rooms between the heading and the cards and under
    //    the row, scrolling; where neither has 72 px, its first line and the rest in the side panel ("Read it").
    const walk = $(".walk");
    if (shown(walk)) {
      walk.style.maxHeight = ""; walk.style.overflowY = ""; delete walk.dataset.short; delete walk.dataset.aside;
      const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - vr.left, t: r.top - vr.top, r: r.right - vr.left, b: r.bottom - vr.top }; };
      const hd = this._qbox ? P(this._qbox) : null, qm = this.$(".hits .qmore"), qmb = qm && !qm.hidden && qm.getClientRects().length ? rel(qm) : null;
      // "Full question" by the heading: at its end, or under its first words where that runs past the frame's edge,
      // as renderHits places it (it may do so after this layout)
      const qms = hd && qm && !qm.hidden ? (({ w: qw, h: qh }) => [hd.r + 12 + qw > W - 8 ? { l: hd.l, t: hd.b + 6, r: hd.l + qw, b: hd.b + 6 + qh } : { l: hd.r + 12, t: (hd.t + hd.b - qh) / 2, r: hd.r + 12 + qw, b: (hd.t + hd.b + qh) / 2 }])({ w: qm.offsetWidth || 110, h: qm.offsetHeight || 26 }) : [];
      const obst = [...cards, ...(hd ? [hd] : []), ...(qmb ? [qmb] : []), ...qms, ...[...box.querySelectorAll(".hd,.own,.unclearbtn,.note,.walkbtn,.backbtn,.confirm,.gobtn,.hint,.feedback,.blong,.disagree,.fwhy,.crow,.opts>.opt,.gflag")].filter((el) => shown(el) && el.getClientRects().length).map(rel)];
      const clear = (x, y, w, h) => !obst.some((o) => x < o.r + gap / 2 && o.l < x + w + gap / 2 && y < o.b + gap / 2 && o.t < y + h + gap / 2);
      const w = Math.min(W - 2 * edge, Math.max(U.r - U.l, 420)), wx = Math.max(edge, Math.min(U.l, W - edge - w));
      const top0 = hd ? Math.max(hd.b, ...qms.filter((q) => q.t >= hd.b).map((q) => q.b)) + gap : Math.max(gap, H * 0.02), low0 = rowBottom + gap, loose = Math.min(maxY, H + 56);
      const spots = [[wx, top0, w, U.t - gap], [wx, low0, w, foot]];
      if (hd) { const xh = Math.max(hd.r, qmb?.r ?? 0) + gap * 1.5, wh = W - edge - xh; if (wh >= 260) for (const y of [hd.t, ...obst.filter((o) => o.r > xh && o.b < U.t).map((o) => o.b + gap)]) spots.push([xh, y, wh, U.t - gap]); }
      { const xr = U.r + gap * 1.5, wr = W - edge - xr, wl = U.l - gap * 1.5 - edge; if (wr >= 260) spots.push([xr, U.t, wr, foot]); if (wl >= 260) spots.push([edge, U.t, wl, foot]); }
      spots.push([wx, low0, w, loose]);
      const fits = () => spots.find(([x, y, sw, lim]) => { put(walk, x, y, sw); const h = walk.offsetHeight; return y >= 0 && y + h <= lim && clear(x, y, sw, h); });
      let at = fits();
      if (!at) {   // the room it fits best, scrolling
        const rooms = [[wx, top0, w, U.t - gap - top0], [wx, low0, w, loose - low0]].sort((a, b) => b[3] - a[3]);
        if (rooms[0][3] >= 72) { const [x, y, sw, room] = rooms[0]; walk.style.maxHeight = `${Math.floor(room)}px`; walk.style.overflowY = "auto"; at = [x, y, sw]; }
        else {
          walk.dataset.short = ""; at = fits();
          // no room even for its line: it goes with the whys' "Read why in full", or opens in the side panel by itself (once)
          if (!at) { walk.dataset.aside = ""; at = [wx, 0, w]; if (bl.hidden && this._walkAside !== p.q?.id) { this._walkAside = p.q?.id; setTimeout(() => { if (this._pendingDecision === p) this.readWalk(); }, 0); } }
        }
      }
      put(walk, at[0], at[1], at[2]);
    }
  }
  // A walk-through with no room on the frame: its words in the side panel, the quick check waiting behind it
  readWalk() {
    const box = this.$(".decision"), walk = box.querySelector(".walk");
    if (this._waiting) { this.stopWait(); const h = box.querySelector(".hint"); h.textContent = "Waits while you read — Continue goes on."; delete h.dataset.live; }
    this.openDetail({ name: "rp-walk-text", title: `${box.querySelector(".k").textContent} · walk me through it`, kind: "in full", band: true, html: `<h1>${esc(box.querySelector(".q").textContent)}</h1><p>${esc(walk.querySelector(".wt").textContent)}</p>` });
  }
  // Past the cap, the band's words in full in the side panel: the question and the answer's explanation, or
  // each call with what it chose, instead of what, why and where to check. Not a detail: nothing is logged.
  readBand() {
    const p = this._pendingDecision; if (!p) return;
    const box = this.$(".decision"), fb = box.querySelector(".feedback");
    const call = (c) => `<section><h2><code>${esc(String(c.id).toUpperCase())}</code> ${esc(c.chose || "")}</h2><dl>${c.insteadOf ? `<dt>Instead of</dt><dd>${esc(c.insteadOf)}</dd>` : ""}${c.why ? `<dt>Why</dt><dd>${esc(c.why)}</dd>` : ""}${c.check ? `<dt>Check</dt><dd><code>${esc(c.check)}</code></dd>` : ""}</dl></section>`;
    const whys = box.classList.contains("onframe") ? this.cardWhys().filter((x) => x.text) : [];
    const html = p.kind === "group" ? (p.g.calls || []).map(call).join("") : p.kind === "autonomy" ? call(p.a)
      : `<h1>${esc(box.querySelector(".q").textContent)}</h1>${fb.style.display === "block" ? `<p>${fb.innerHTML}</p>` : ""}${whys.map((x) => `<section><h2><code>${esc(x.id.toUpperCase())}</code> ${esc(x.head || "")}</h2><p>${esc(x.text)}</p></section>`).join("")}`
      + (box.querySelector(".walk")?.hasAttribute("data-aside") ? `<section><h2>Walk me through it</h2><p>${esc(box.querySelector(".walk .wt").textContent)}</p></section>` : "");   // no room for it on the frame
    if (this._waiting) { this.stopWait(); const h = box.querySelector(".hint"); h.textContent = "Waits while you read — Continue goes on."; delete h.dataset.live; }   // an answered one does not go on under the panel
    this.openDetail({ name: "rp-band-text", title: box.querySelector(".k").textContent, kind: "in full", band: true, html });
  }
  // One transparent button per card, over it. Drawn again only when the options change; otherwise moved.
  // Answer in the frame: each card's "More", the question's "Full question" by its heading, and, for the
  // choices the agent made, a ring per card that carries its verdict.
  renderHits(cards, calls = null) {
    const el = this.$?.(".hits"); if (!el) return;
    if (!cards) { this._whyTags = null; el.removeAttribute("data-whytags"); }
    const had = el.contains(this.shadowRoot.activeElement);
    this._cards = cards || null; this._callCards = calls || null;
    if (!cards && !calls) { el.hidden = true; el.innerHTML = ""; delete el.dataset.for; this._qbox = null; this.closeMore(); if (had) this.focus({ preventScroll: true }); return; }
    const p = this._pendingDecision, pct = (n) => `${n.toFixed(3)}%`, onframe = this.$(".decision").classList.contains("onframe");
    if (cards) {
      const q = p.kind === "quiz" ? p.q : p;
      const same = [...el.querySelectorAll(".hit")].map((h) => h.dataset.hit).join() === q.options.map((o) => o.id).join() && el.dataset.for === this.pendingId(p);
      if (!same) {
        el.dataset.for = this.pendingId(p);
        el.innerHTML = q.options.map((o) => `<button class="hit" data-hit="${esc(o.id)}" aria-label="${esc(`${o.id.toUpperCase()}: ${o.label}`)}" title="${esc(`${p.kind === "multi" ? "Tick or untick" : "Pick"} this — key ${o.id.toUpperCase()}`)}"><em class="tag"></em></button>`).join("")
          + q.options.map((o) => `<button class="cmore" data-more="${esc(o.id)}" aria-expanded="false" aria-label="${esc(`More on ${o.id.toUpperCase()}: ${o.label}`)}" title="More on this answer, without picking it" hidden>More</button>`).join("")
          + `<i class="qhit" data-more="q" hidden></i><button class="cmore qmore" data-more="q" aria-expanded="false" title="The question in full" hidden>Full question</button>`;
      }
      el.querySelectorAll(".hit").forEach((h) => { const b = cards[String(h.dataset.hit).toLowerCase()]; if (b) Object.assign(h.style, { left: pct(b.l), top: pct(b.t), width: pct(b.w), height: pct(b.h) }); });
      el.querySelectorAll('.cmore:not(.qmore)').forEach((m) => { const b = cards[String(m.dataset.more).toLowerCase()]; if (b) Object.assign(m.style, { left: `calc(${pct(b.l + b.w)} - 8px)`, top: `calc(${pct(b.t)} + 8px)` }); });
      // the heading: its words' box takes the hover; "Full question" sits at its end, or under it where the line runs to the edge
      const hd = onframe ? this.frameHeading(cards) : null, qm = el.querySelector(".qmore"), qh = el.querySelector(".qhit");
      this._qbox = hd;
      if (hd) Object.assign(qh.style, { left: pct(hd.l), top: pct(hd.t), width: pct(hd.w), height: pct(hd.h) });
      qh.hidden = !hd;
      if (hd) Object.assign(qm.style, { left: `calc(${pct(hd.l + hd.w)} + 12px)`, top: pct(hd.t + hd.h / 2), transform: "" });
      else Object.assign(qm.style, { transform: "none" });   // placed in the chips' row (layoutFrame)
      this.syncHits();
      // a heading that runs to the frame's edge: "Full question" goes under its first words instead
      if (hd && !qm.hidden) { const sr = this.picRect(); if (qm.getBoundingClientRect().right > sr.right - 8) Object.assign(qm.style, { left: pct(hd.l), top: `calc(${pct(hd.t + hd.h)} + 6px)`, transform: "none" }); }
      this.revealQuestion();
      return;
    } else {
      const ids = Object.keys(calls), key = `calls:${ids.join()}`;
      if (el.dataset.for !== key || !el.querySelector(".cring")) {
        el.dataset.for = key;
        el.innerHTML = ids.map((id) => `<i class="cring" data-call="${esc(id)}" data-more="call:${esc(id)}"><em class="tag"></em></i><button class="cmore" data-more="call:${esc(id)}" aria-expanded="false" title="${esc(`${id.toUpperCase()} in full: instead of what, why, where to check`)}">More</button>`).join("");
      }
      el.querySelectorAll(".cring").forEach((r) => { const b = calls[r.dataset.call]; if (b) Object.assign(r.style, { left: pct(b.l), top: pct(b.t), width: pct(b.w), height: pct(b.h) }); });
      el.querySelectorAll(".cmore").forEach((m) => { const b = calls[m.dataset.more.slice(5)]; if (b) Object.assign(m.style, { left: `calc(${pct(b.l + b.w)} - 8px)`, top: `calc(${pct(b.t)} + 8px)` }); });
    }
    this.syncHits();
    this.revealQuestion();
  }
  // Each card says what its option button in the (hidden) sheet says: ticked, your answer, the answer; a
  // choice's ring, its verdict. A card's "More" shows where there is more to read than the card says.
  syncHits() {
    const el = this.$?.(".hits"); if (!el || (!this._cards && !this._callCards)) return;
    const box = this.$(".decision");
    el.hidden = this._folded || !box.classList.contains("on");
    el.querySelectorAll(".hit").forEach((h) => {
      const id = CSS.escape(h.dataset.hit), o = box.querySelector(`.opt:is([data-choose="${id}"],[data-pick="${id}"],[data-quiz="${id}"])`); if (!o) return;
      const pressed = o.getAttribute("aria-pressed"); if (pressed != null) h.setAttribute("aria-pressed", pressed); else h.removeAttribute("aria-pressed");
      h.dataset.chosen = String(o.dataset.chosen === "true");
      h.dataset.right = String(o.dataset.quiz != null && o.disabled && o.dataset.rec === "true");   // an answered quick check: the right card
      h.disabled = o.disabled;
      const tag = o.querySelector(".tag")?.textContent || "", t = this._whyTags?.[String(h.dataset.hit).toLowerCase()] || (tag === "recommended" ? "" : tag);   // the frame says what it recommends; an answered check's verdict with no room under its card rides here
      if (h.firstElementChild.textContent !== t) h.firstElementChild.textContent = t;
    });
    el.querySelectorAll(".cring").forEach((r) => {
      const v = this.autonomy[r.dataset.call]?.verdict || "", t = v === "accept" ? "Accepted" : v === "flag" ? "Flagged" : v === "own" ? "Your words" : "";
      if (r.dataset.verdict !== v) r.dataset.verdict = v; if (r.firstElementChild.textContent !== t) r.firstElementChild.textContent = t;
    });
    el.querySelectorAll(".cmore").forEach((m) => { const on = m.dataset.more === "q" ? !!this._qbox || this.$(".decision").classList.contains("onframe") : !!this.moreHtml(m.dataset.more); if (m.hidden === on) m.hidden = !on; });
  }
  // What "More" shows: the fuller text behind a card, the question in full, or a choice's whole row. A quick
  // check's cards say nothing that gives its answer away until it is answered: `- option_a_more:` before, and
  // its why after. Older videos have what they have: a choice's `why`, a quick check's `explain`.
  moreHtml(key) {
    const p = this._pendingDecision; if (!p || !key) return "";
    const para = (t, cls = "") => t ? `<p${cls ? ` class="${cls}"` : ""}>${this.glossHtml(t, { terms: false })}</p>` : "";
    const kicker = this.$(".decision .k").textContent.replace(/ · answered$/, "");
    if (key === "q") {
      const q = p.kind === "quiz" ? p.q : p; if (!q?.question) return "";
      return `<span class="fk">${esc(kicker)}</span><b>${this.glossHtml(q.question, { terms: false })}</b>${para(q.questionMore)}`;
    }
    if (key.startsWith("call:")) {
      const id = key.slice(5), c = p.kind === "autonomy" ? p.a : (p.g?.calls || []).find((x) => String(x.id).toLowerCase() === id); if (!c) return "";
      const facts = [c.insteadOf && ["Instead of", this.glossHtml(c.insteadOf, { terms: false })], c.why && ["Why", this.glossHtml(c.why, { terms: false })], c.check && ["Check", `<code>${esc(c.check)}</code>`]].filter(Boolean);
      if (!facts.length) return "";
      return `<span class="fk">${esc(`${String(c.id).toUpperCase()} · ${this.callNoun(c.id)}${this.stepPart(c.planStep ?? p.g?.planStep)}`)}</span><b>${this.glossHtml(c.chose || c.id, { terms: false })}</b><dl>${facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`;
    }
    const q = p.kind === "quiz" ? p.q : p, o = (q?.options || []).find((x) => x.id === key); if (!o) return "";
    let body = para(o.more);
    if (p.kind === "quiz") {
      const r = this.quizzes[q.id];
      if (r) { const w = this.cardWhys().find((x) => x.id === o.id); if (w) body = `${w.head ? `<p class="v">${esc(w.head)}</p>` : ""}${body}${w.text ? para(w.text) : ""}`; }
    } else if (!o.more && o.why) body = para(o.why);
    if (!body) return "";
    return `<span class="fk">${esc(`${o.id.toUpperCase()}${o.recommended && p.kind !== "quiz" ? " · recommended" : ""}`)}</span><b>${this.glossHtml(o.label, { terms: false })}</b>${body}`;
  }
  // "More": a popover by the card or the heading, never cut (it stays inside the window) and never over what
  // you answer with (placeMore). From the chip it toggles; a hover opens it after a moment and it goes when the
  // pointer leaves both, or reaches a control. Reading it holds an answered question's countdown, as reading a
  // word's meaning does.
  openMore(key, hover = false) {
    const pop = this.$?.(".fpop"); if (!pop) return;
    // opened from its chip, a hover's "More" about to open (the pointer came to the chip on its way to the click) is
    // this one already: left running, it re-opened it as a hover's, and the chip's next click opened it again rather
    // than putting it away
    if (!hover) clearTimeout(this._moreT);
    if (!hover && this._more?.key === key && !this._more.hover && !pop.hidden) { this.closeMore(); return; }
    const html = this.moreHtml(key); if (!html) return;
    const box = (x) => { const sr = this.picRect(); return { left: sr.left + (x.l / 100) * sr.width, top: sr.top + (x.t / 100) * sr.height, right: sr.left + ((x.l + x.w) / 100) * sr.width, bottom: sr.top + ((x.t + x.h) / 100) * sr.height }; };
    const set = key.startsWith("call:") ? this._callCards : this._cards;
    const b = key === "q" ? this._qbox || this.qmoreBox() : set?.[key.startsWith("call:") ? key.slice(5) : key]; if (!b) return;
    this.hideTerm();
    pop.innerHTML = html; pop.hidden = false; this._more = { key, hover };
    this.$$(".hits .cmore").forEach((m) => m.setAttribute("aria-expanded", String(m.dataset.more === key)));
    this.placeMore(pop, box(b), Object.values(set || {}).map(box));
    this.holdWait();
  }
  // Where "More" goes: never over what you answer with (a card's Accept, Flag and own words, the row of chips,
  // your own words, Continue, Back, Walk me through it, the other cards' "More") nor over the card it is about.
  // Beside the card, on the side with room; else above it; else under it and its controls; clear of the other
  // cards where it can be, over them where it cannot. Where nothing is clear it is made shorter (it scrolls),
  // and last it goes under the controls: they stay on top, and clickable.
  placeMore(pop, r, cards = []) {
    const M = 8, g = 10, vw = innerWidth, vh = innerHeight, d = this.$(".decision");
    Object.assign(pop.style, { maxWidth: "", maxHeight: "", left: "0px", top: "0px" }); pop.removeAttribute("data-under");
    const seen = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
    const ctrls = [...d.querySelectorAll("button, input, textarea, select, .own.open"), ...this.$$(".hits .cmore")].filter(seen).map((el) => el.getBoundingClientRect()).filter((x) => x.width > 0 && x.height > 0);
    const same = (a) => Math.abs(a.left - r.left) < 1 && Math.abs(a.top - r.top) < 1;
    const others = cards.filter((c) => !same(c));
    const size = (mw = null, mh = null) => { pop.style.maxWidth = mw ? `${Math.floor(mw)}px` : ""; pop.style.maxHeight = mh ? `${Math.floor(mh)}px` : ""; return { w: pop.offsetWidth, h: pop.offsetHeight, mw, mh }; };
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const find = (avoid, mh) => {
      const free = (x, y, s) => x >= M - 0.5 && y >= M - 0.5 && x + s.w <= vw - M + 0.5 && y + s.h <= vh - M + 0.5 && !avoid.some((o) => x < o.right + 4 && o.left - 4 < x + s.w && y < o.bottom + 4 && o.top - 4 < y + s.h);
      const best = (list, s, score) => list.filter(([x, y]) => free(x, y, s)).sort((a, b) => score(a) - score(b))[0];
      const s0 = size(null, mh), xsOf = (s) => [r.left, r.right - s.w, ...avoid.flatMap((o) => [o.right + g, o.left - g - s.w])].map((x) => clamp(x, M, vw - M - s.w));
      // beside: the side with more room first, as wide as that room lets it be (not narrower than 220 px)
      for (const [side, room] of [["right", vw - M - (r.right + g)], ["left", r.left - g - M]].sort((a, b) => b[1] - a[1])) {
        if (room < 220) continue;
        const s = room < s0.w ? size(room, mh) : s0, x = side === "right" ? r.right + g : r.left - g - s.w;
        const ys = [r.top, r.bottom - s.h, (r.top + r.bottom - s.h) / 2, ...avoid.flatMap((o) => [o.bottom + g, o.top - g - s.h])].map((y) => clamp(y, M, vh - M - s.h));
        const hit = best(ys.map((y) => [x, y]), s, ([, y]) => Math.abs(y - r.top)); if (hit) return [...hit, s];
      }
      // above the card, the nearest place up; then under it, past its own controls
      const up = best(xsOf(s0).flatMap((x) => [r.top - g - s0.h, ...avoid.filter((o) => o.top < r.top).map((o) => o.top - g - s0.h)].map((y) => [x, y])).filter(([, y]) => y + s0.h <= r.top - g + 0.5), s0, ([x, y]) => (r.top - y) * 4 + Math.abs(x - r.left)); if (up) return [...up, s0];
      const down = best(xsOf(s0).flatMap((x) => [r.bottom + g, ...avoid.filter((o) => o.bottom > r.top).map((o) => o.bottom + g)].map((y) => [x, y])).filter(([, y]) => y >= r.bottom + g - 0.5), s0, ([x, y]) => (y - r.bottom) * 4 + Math.abs(x - r.left)); if (down) return [...down, s0];
      return null;
    };
    const h0 = size().h;
    let at = null;
    for (const mh of [null, h0 * 0.7, h0 * 0.5, 200, 140]) { if (mh && mh >= h0) continue; at = find([...ctrls, r, ...others], mh) || find([...ctrls, r], mh); if (at) break; }
    if (!at) {   // nothing is clear: under the card (or above, where there is more room), shorter, under the controls
      const below = vh - M - (r.bottom + g), above = r.top - g - M, s = size(null, Math.max(120, Math.max(below, above)));
      at = [clamp(r.left, M, vw - M - s.w), clamp(below >= above ? r.bottom + g : r.top - g - s.h, M, vh - M - s.h), s];
      pop.toggleAttribute("data-under", true);
    }
    const [x, y, s] = at; size(s.mw, s.mh);
    pop.style.left = `${Math.round(x)}px`; pop.style.top = `${Math.round(y)}px`;
  }
  qmoreBox() { const m = this.$(".hits .qmore"); if (!m || m.hidden) return null; const sr = this.picRect(), r = m.getBoundingClientRect(); return { l: ((r.left - sr.left) / sr.width) * 100, t: ((r.top - sr.top) / sr.height) * 100, w: (r.width / sr.width) * 100, h: (r.height / sr.height) * 100 }; }
  closeMore() {
    clearTimeout(this._moreT); clearTimeout(this._moreOutT);
    const pop = this.$?.(".fpop"), was = !!pop && !pop.hidden; if (pop) pop.hidden = true; this._more = null;
    this.$$?.(".hits .cmore").forEach((m) => m.setAttribute("aria-expanded", "false"));
    return was;
  }
  hoverMore(key) { clearTimeout(this._moreOutT); this.$$(".hits .cmore").forEach((m) => m.toggleAttribute("data-hover", m.dataset.more === key)); if (this._more?.key === key) return; clearTimeout(this._moreT); this._moreT = setTimeout(() => { if (this.asking() || this.isAnswered()) this.openMore(key, true); }, 450); }
  unhoverMore() { clearTimeout(this._moreT); this.$$(".hits .cmore[data-hover]").forEach((m) => m.removeAttribute("data-hover")); if (!this._more?.hover) return; clearTimeout(this._moreOutT); this._moreOutT = setTimeout(() => { if (!this.$(".fpop").matches(":hover")) this.closeMore(); }, 250); }
  // A click on a card is the key for its letter: it answers, ticks a pick-all card, or answers a quick check.
  answerOnFrame(id) {
    const p = this._pendingDecision; if (!p || this._folded || !this.asking()) return;
    this.closeMore();
    if (p.kind === "quiz") { if (p.q.options.some((o) => o.id === id)) this.answerQuiz(id); }
    else if (this.isDec(p) && p.options.some((o) => o.id === id)) { if (p.kind === "multi") this.togglePick(id); else this.choose(id); }
  }
  // The frame's page may still be settling when a question is asked (a seek has just landed, a card is
  // still sliding in): look again shortly. Found late, the sheet gives way to the bar, or to the frame.
  recheckCards() {
    const p = this._pendingDecision; clearTimeout(this._cardsT); this._cardsT = 0; if (!p) return;
    const call = p.kind === "autonomy" || p.kind === "group";
    // _cardsT is 0 once the look again has been taken (or there is none to take): the specs wait on it, not on a time
    this._cardsT = setTimeout(() => {
      this._cardsT = 0;
      if (this._pendingDecision !== p) return;
      const box = this.$(".decision"), cards = call ? null : this.frameCards(p), calls = call ? this.frameCallCards(p) : null; if (!cards && !calls) return;
      const mode = this.onframeRoom() ? "onframe" : "band";
      if (mode === "band" && calls) return;   // a call's bar is already up
      if (!box.classList.contains(mode)) { const had = box.contains(this.shadowRoot.activeElement); this.placeCard(mode); box.querySelector(".hint").textContent = this._bandHint || ""; if (had) this.focus({ preventScroll: true }); }
      this.renderHits(cards, mode === "onframe" ? calls : null); this.syncBand(); this.fitBand();
    }, 350);
  }
  // D-001 — the sheet overlays the lower third at full size, and folds to a pill so the frame it is
  // asking about is never permanently covered. Folded, the question is still pending: the options are
  // not in the DOM flow, so nothing can be answered by accident, and the video cannot run past the
  // moment that asked — reaching it again reopens the sheet.
  fold(on) {
    if (on && this.dropAnswered()) return;
    const p = this._pendingDecision; if (!p) return;
    this._folded = !!on;
    const box = this.$(".decision"), had = box.contains(this.shadowRoot.activeElement);
    box.classList.toggle("folded", this._folded); this.closeMore();
    if (had) this.focus({ preventScroll: true });   // the button pressed has just been hidden: keep the keys working
    if (this._folded) this.player.pause();   // the status line already says it is folded and still waiting
    this.syncHits(); this.syncBand(); this.updateStatus(); this.syncDetailChip();
  }
  pendingAt() { const p = this._pendingDecision; if (!p) return null; return p.kind === "quiz" ? p.q.at : p.kind === "autonomy" ? p.a.at : p.kind === "group" ? p.g.at : p.at; }
  // the one place a folded question comes back: the playhead has arrived at the moment that asked it
  unfoldAt() { const at = this.pendingAt(); this.player.pause(); if (at != null) this.player.seek(at); this.fold(false); }
  // The record is one sheet pulled up over the video on a phone; on a laptop it is simply below it
  // The Record bar opens it at what the reviewer said: a Finish panel left open folds to its one line above it (Finish
  // review, and its title, open it out again)
  togglePull() { const w = this.$(".wrap"); if (!w.classList.contains("pulled")) this.foldHandoff(true); w.classList.toggle("pulled"); this.syncPull(); if (w.classList.contains("pulled")) this.$(".side").scrollTop = 0; }
  closePull() { this.$(".wrap").classList.remove("pulled"); this.syncPull(); }   // anything that moves the playhead wants the frame in view
  // …and, read from the guide (the video small in the corner), the video back in its place above it
  toFrame() { this.closePull(); if (this._mini) this.backToVideo({ focus: false }); }
  openPull() { const w = this.$(".wrap"); if (!w.classList.contains("pulled")) { w.classList.add("pulled"); this.syncPull(); } }
  // At rest the peek is one line — the handle, plus what it is worth stopping to read: how many
  // steps the plan has, how many of its calls are decided, how many comments are waiting. Pulled,
  // it just says how to put it away.
  peekSummary() {
    const steps = new Set((this.planMap?.frames || []).map((f) => f.planStep).filter((n) => n != null && n !== 0)).size;
    const decs = this.planMap?.decisions || []; const made = decs.filter((d) => this.decisions[d.id] && !this.isUnclear(this.decisions[d.id])).length;   // "explain more" is not decided
    const calls = this.calls(), judged = calls.filter((a) => this.autonomy[a.id]).length;
    const bits = ["Record"];
    if (steps) bits.push(`${steps} step${steps === 1 ? "" : "s"}`);
    if (decs.length) bits.push(`${made}/${decs.length} decided`);
    if (calls.length) bits.push(`${judged}/${calls.length} judged`);
    bits.push(`${this.annotations.length} comment${this.annotations.length === 1 ? "" : "s"}`);
    if (this._lastItems?.length) bits.push(`your last review: ${this._lastItems.length}`);
    return bits.join(" · ");
  }
  // Pulled, the same line heads the sheet, with "Hide" at its right: the handle is the record's header.
  syncPull() { const on = this.$(".wrap").classList.contains("pulled"); const b = this.$(".grab"); if (b) { b.setAttribute("aria-expanded", String(on)); b.title = on ? "Hide the record (Esc)" : "Pull up the record"; const s = b.querySelector("span"); if (s) s.innerHTML = this.peekSummary().replace(/^Record/, "<b>Record</b>"); } this.measurePeek(); }
  openOwn() {
    const own = this.$(".own"); own.classList.add("open");
    const ta = own.querySelector("textarea"); ta.focus();
  }
  // One handler for all three kinds: what "my own answer" means differs, but the reviewer's act is
  // the same, and it is always recorded as the answer rather than as a note alongside one.
  answerOwn() {
    const p = this._pendingDecision; if (!p || (p.kind === "group" && !(p.g.stop && this._ownFor))) return;
    const text = this.$(".own textarea").value.trim(); if (!text) return;
    const stamp = new Date().toISOString();
    if (p.kind === "quiz") {
      const q = p.q;
      this.quizzes[q.id] = { answer: "own", own: text, correct: null, t: q.at, answeredAt: stamp };
      try { localStorage.setItem(this.rkey + ":quiz", JSON.stringify(this.quizzes)); } catch {} 
      this.comment(text, q.at, `Answered in their own words: ${q.question || q.id}`);
      this.closeCard(); this.renderDecisions(); this.player.play();
    } else if (p.kind === "group") {   // one call of a stop beat, in the reviewer's own words: a change to make
      const c = p.g.calls.find((x) => x.id === this._ownFor), a = { ...c, at: p.g.at }, was = this.groupDone(p.g);
      if (this.autonomy[a.id]?.verdict === "flag") { this.annotations = this.annotations.filter((x) => !(x.kind === "flag" && x.comment === `Flagged: ${a.chose}`)); this.persist(); this.renderList(); }
      this.autonomy[a.id] = { verdict: "own", own: text, t: a.at, planStep: a.planStep, chose: a.chose, ...(this.shownAtOf(a.id) ? { shownAt: this.shownAtOf(a.id) } : {}), judgedAt: stamp };
      try { localStorage.setItem(this.rkey + ":autonomy", JSON.stringify(this.autonomy)); } catch {}
      this.comment(text, a.at, `On what the agent decided: ${a.chose || a.id}`);
      this.renderAutonomy(); this.dispatchEvent(new CustomEvent("autonomy", { detail: { id: a.id, ...this.autonomy[a.id] } }));
      const own = this.$(".own"); own.classList.remove("open"); own.hidden = true; own.querySelector("textarea").value = ""; this._ownFor = null;
      if (!was && this.groupDone(p.g)) { this.closeCard(); this.player.play(); }
      else { this.$(".decision .opts").innerHTML = this.stopRows(p.g); if (was) this.stopDone(p.g); this.focus({ preventScroll: true }); }
    } else if (p.kind === "autonomy") {
      const a = p.a;
      if (this.autonomy[a.id]?.verdict === "flag") { this.annotations = this.annotations.filter((x) => !(x.kind === "flag" && x.comment === `Flagged: ${a.chose}`)); this.persist(); this.renderList(); }   // own words replace a flag given before
      this.autonomy[a.id] = { verdict: "own", own: text, t: a.at, planStep: a.planStep, chose: a.chose, ...(this.shownAtOf(a.id) ? { shownAt: this.shownAtOf(a.id) } : {}), judgedAt: stamp };
      try { localStorage.setItem(this.rkey + ":autonomy", JSON.stringify(this.autonomy)); } catch {}
      this.comment(text, a.at, `On what the agent decided: ${a.chose || a.id}`);
      this.closeCard(); this.renderAutonomy(); this.player.play();
    } else {
      const d = p;
      this.decisions[d.id] = { option: "own", label: text, own: true, recommended: false, planStep: d.planStep, question: d.question, t: d.at, decidedAt: stamp, ...this.noteField() };
      try { localStorage.setItem(this.rkey + ":decisions", JSON.stringify(this.decisions)); } catch {}
      this.comment(text, d.at, `Answered in their own words: ${d.question || d.id}`);
      this.closeCard(); this.renderDecisions(); this.syncGallery();
      this.dispatchEvent(new CustomEvent("decision", { detail: { id: d.id, ...this.decisions[d.id] } }));
      // there is no branch for an answer the plan did not anticipate, so carry on past the options
      this.player.seek(d.resumeAt); this.player.play();
    }
    this.updateStatus();
  }
  // "Explain this more" (?): the reviewer cannot answer this yet. It is recorded in the same shape as
  // an answer so the review carries it, but as option "unclear", which nothing counts as decided —
  // the scripts ask for the step to be explained again rather than resolving the question. The
  // note on the sheet, if any, says what is unclear. The video goes on as after an own-words answer.
  askUnclear() {
    const d = this._pendingDecision; if (!this.isDec(d)) return;
    this.decisions[d.id] = { option: "unclear", label: "Explain this more", recommended: false, planStep: d.planStep, question: d.question, t: d.at, decidedAt: new Date().toISOString(), ...this.noteField() };
    this.saveDecisions();
    this.closeCard(); this.renderDecisions(); this.syncGallery();
    this.dispatchEvent(new CustomEvent("decision", { detail: { id: d.id, ...this.decisions[d.id] } }));
    this.status("asked for this to be explained more — it stays an open question");
    this.player.seek(d.resumeAt); this.player.play();
  }
  isUnclear(m) { return m?.option === "unclear"; }
  // Whatever button answered it goes with the sheet, and a focused element that disappears drops focus
  // to <body>, out of the player, where its keys no longer reach it: the keyboard comes back to the host.
  closeCard() { const box = this.$(".decision"); const had = box.contains(this.shadowRoot.activeElement) || !!this.$(".hits")?.contains(this.shadowRoot.activeElement); clearTimeout(this._cardsT); this._cardsT = 0; this.renderHits(null); this.closeMore(); const wy = box.querySelector(".fwhys"); wy.innerHTML = ""; delete wy.dataset.sig; box.classList.remove("on", "folded"); box.querySelector(".confirm").hidden = true; box.querySelector(".gobtn").hidden = true; if (had) this.focus({ preventScroll: true }); box.querySelector("[data-note]").value = ""; this._folded = false; this._pendingDecision = null; this._revealed = null; this._openedFor = null; this._freshAnswer = null; this.stopWait(); this.syncBand(); this.updateStatus(); this.syncDetailChip(); }
  // a plan decision, as opposed to the quick check and autonomy wrappers that share its sheet
  // (plan maps now say kind "one" or "multi" on a decision, so `kind` alone no longer tells them apart)
  isDec(p) { return !!p && p.kind !== "quiz" && p.kind !== "autonomy" && p.kind !== "group"; }
  // a question is waiting for an answer: its sheet is up, not folded, and not already answered
  asking() {
    const p = this._pendingDecision; if (!p || this._folded || !this.$(".decision")?.classList.contains("on")) return false;
    return p.kind === "quiz" ? !this.quizzes[p.q.id] : true;
  }
  askDecision(d) {
    this._pendingDecision = d; this._askedOnce = { ...(this._askedOnce || {}), [d.id]: true };
    this.player.pause(); this.player.seek(d.at);
    // met again, it shows what was said, and a pick replaces it and routes as a fresh answer would
    // (choose / confirmMulti / answerOwn); the record changes it in place (changeAnswer)
    const m = this.decisions[d.id], was = m;
    const multi = d.kind === "multi", keys = d.options.map((o) => o.id.toUpperCase());
    const keyList = keys.length > 1 ? `${keys.slice(0, -1).join(", ")} or ${keys.at(-1)}` : keys[0];
    // the key names the beat: "Question n · step m" (a plan's question; "choice" is a call the agent made alone)
    this.openCard(multi ? "multi" : "decision", `Question ${this.choiceNo(d)}${this.stepPart(d.planStep)}${multi ? " · pick all that apply" : ""}`, d.question || d.id,
      d.options.map((o) => {
        const on = multi && !!was?.options?.includes(o.id), mine = !multi && m?.option === o.id;
        return `<button class="opt" ${multi ? `data-pick="${o.id}" aria-pressed="${on}"` : `data-choose="${o.id}"`} data-rec="${!!o.recommended}"${mine ? ' data-chosen="true"' : ""} title="${multi ? "Tick or untick" : "Pick"} this — key ${o.id.toUpperCase()}"><kbd class="key">${o.id.toUpperCase()}</kbd><b>${this.glossHtml(o.label)}<em class="tag">${on ? "picked" : mine ? "your answer" : o.recommended ? "recommended" : ""}</em></b>${o.why ? `<span>${this.glossHtml(o.why)}</span>` : ""}</button>`;
      }).join(""),
      multi ? `Tick all that apply — ${keyList} toggle, Enter confirms. ${d.summary ? "The video then shows your picks together." : "The video then goes on."}`
        : `Pick one — ${keyList} on the keyboard. The video plays only that path.`,
      { note: was?.note || "", confirm: multi, bandHint: multi ? `Tick the cards that apply (${keyList}), then Confirm.` : `Click a card, or press ${keyList}.` });
    this.$(".decision .unclearbtn").hidden = this.isUnclear(m);
    if (multi) this.syncConfirm();
    if (!m) return;
    // met again: what was said shows; Confirm waits until a tick changes
    const box = this.$(".decision"); box.querySelector(".k").textContent += " · answered";
    if (multi) box.querySelector(".confirm").hidden = true;
    const fb = box.querySelector(".feedback");
    if (m.option === "own" || this.isUnclear(m)) { fb.style.display = "block"; fb.innerHTML = this.isUnclear(m) ? "<b>You asked for this to be explained more.</b> Pick an answer now, or go on." : `<b>Your answer, in your own words:</b> ${esc(m.label)}`; }
    this.startWait(d);
  }
  // ---- pick all that apply (richer review step 2, D-004) ----
  picked() { return this.$$('.decision .opt[data-pick][aria-pressed="true"]').map((b) => b.dataset.pick); }
  togglePick(id) {
    const d = this._pendingDecision; if (!this.isDec(d) || d.kind !== "multi") return;
    const b = this.$(`.decision .opt[data-pick="${id}"]`); if (!b) return;
    const on = b.getAttribute("aria-pressed") !== "true", o = d.options.find((x) => x.id === id);
    b.setAttribute("aria-pressed", String(on)); b.querySelector(".tag").textContent = on ? "picked" : o?.recommended ? "recommended" : "";
    this.holdWait(); this.$(".decision .confirm").hidden = false;   // met again and changed: the countdown stops, Confirm is the way on
    this.syncConfirm();
  }
  syncConfirm() {
    const b = this.$(".decision .confirm"); if (!b) return; const n = this.picked().length;
    b.disabled = !n; b.innerHTML = `${n ? `Confirm ${n} pick${n === 1 ? "" : "s"}` : "Tick at least one"} <kbd>&#8629;</kbd>`;
    b.title = n ? "Confirm your picks (Enter)" : "Tick at least one option first";
  }
  confirmMulti() {
    const d = this._pendingDecision; if (!this.isDec(d) || d.kind !== "multi") return;
    const set = new Set(this.picked()); const picks = d.options.filter((o) => set.has(o.id)); if (!picks.length) return;
    const labels = picks.map((o) => o.label);
    this.decisions[d.id] = { option: "multi", options: picks.map((o) => o.id), labels, label: labels.join(", "), recommended: false, planStep: d.planStep, question: d.question, t: d.at, decidedAt: new Date().toISOString(), ...this.noteField() };
    this.saveDecisions();
    this.closeCard();
    this.renderDecisions(); this.syncGallery(); this.applyDecisionToStage(d, { label: labels.join(", ") }); this.applyPicks();
    this.dispatchEvent(new CustomEvent("decision", { detail: { id: d.id, ...this.decisions[d.id] } }));
    // D-004: one summary frame of the picks, then on — never a branch per pick
    this.player.seek(d.summary ? d.summary.start : d.resumeAt);
    this.player.play();
  }
  // The summary frame names the picks: elements carrying data-plan-picks="<decision id>" in its
  // composition are written with the picked labels (a list gets one item per pick; anything else
  // the labels joined with ", "), the way the resolved-plan frame's step tags are rewritten. It runs
  // on every tick because the runtime builds a frame's DOM when the frame is reached, and rebuilds
  // it on a theme switch; a written element is marked and left alone after.
  applyPicks() {
    const decs = this.planMap?.decisions || [];
    if (!decs.some((d) => this.decisions[d.id]?.option === "multi")) return;
    let doc; try { doc = this.player.iframeElement?.contentDocument; } catch { return; } if (!doc) return;
    for (const d of decs) {
      const m = this.decisions[d.id]; if (m?.option !== "multi") continue;
      const labels = m.labels || [], stamp = labels.join("\u241f");
      doc.querySelectorAll(`[data-plan-picks="${String(d.id).replace(/["\\]/g, "")}"]`).forEach((el) => {
        if (el.dataset.rpPicks === stamp) return; el.dataset.rpPicks = stamp;
        if (/^(UL|OL)$/.test(el.tagName)) el.replaceChildren(...labels.map((l) => { const li = doc.createElement("li"); li.textContent = l; return li; }));
        else el.textContent = labels.join(", ");
      });
    }
  }
  noteField() { const v = this.$(".decision [data-note]")?.value.trim(); return v ? { note: v } : {}; }
  saveDecisions() { try { localStorage.setItem(this.rkey + ":decisions", JSON.stringify(this.decisions)); } catch {} }
  choose(optionId) {
    const d = this._pendingDecision; if (!this.isDec(d) || d.kind === "multi") return;
    const o = d.options.find((x) => x.id === optionId) || d.options[0];
    this.decisions[d.id] = { option: o.id, label: o.label, recommended: !!o.recommended, planStep: d.planStep, question: d.question, t: d.at, decidedAt: new Date().toISOString(), ...this.noteField() };
    try { localStorage.setItem(this.rkey + ":decisions", JSON.stringify(this.decisions)); } catch {}
    this.closeCard();
    this.renderDecisions(); this.syncGallery(); this.applyDecisionToStage(d, o);
    this.dispatchEvent(new CustomEvent("decision", { detail: { id: d.id, ...this.decisions[d.id] } }));
    // play only the chosen branch: jump to it, and arrange the jump past the others when it ends
    if (o.branch) { const after = d.options.filter((x) => x.branch && x.id !== o.id); this._skipUntil = after.length ? { from: o.branch.end, to: d.resumeAt } : null; this.player.seek(o.branch.start); }
    else this.player.seek(d.resumeAt);
    this.player.play();
  }
  askQuiz(q) {
    this._pendingDecision = { kind: "quiz", q }; this._askedOnce = { ...(this._askedOnce || {}), [q.id]: true };
    this.player.pause(); this.player.seek(q.at);
    this.openCard("quiz", `Quick check ${this.checkNo(q)}${q.planStep != null ? ` · step ${q.planStep}` : ""}`, q.question || `Quick check ${this.checkNo(q)}`,
      q.options.map((o) => `<button class="opt" data-quiz="${o.id}"><b>${o.id.toUpperCase()}</b><span>${this.glossHtml(o.label)}</span><em class="tag"></em></button>`).join(""),
      `Answer to continue — ${q.options.map((o) => o.id.toUpperCase()).join(", ").replace(/, ([^,]*)$/, " or $1")} on the keyboard.`,
      { bandHint: `Click an answer, or press ${q.options.map((o) => o.id.toUpperCase()).join(", ").replace(/, ([^,]*)$/, " or $1")}.` });
    // met again: its first answer stands, shown as it was given, with the right one and why
    if (this.quizzes[q.id]) { this.$(".decision .k").textContent += " · answered"; this.showQuizAnswer(q); }
  }
  answerQuiz(optionId) {
    const p = this._pendingDecision; if (!p || p.kind !== "quiz" || this.quizzes[p.q.id]) return; const q = p.q; const correct = optionId === q.answer;
    this.quizzes[q.id] = { answer: optionId, correct, t: q.at, answeredAt: new Date().toISOString() };
    this._freshAnswer = p;   // answered just now: its explanation gets the longer wait (startWait)
    try { localStorage.setItem(this.rkey + ":quiz", JSON.stringify(this.quizzes)); } catch {}
    this.showQuizAnswer(q);
    this.renderDecisions(); this.dispatchEvent(new CustomEvent("quiz", { detail: { id: q.id, ...this.quizzes[q.id] } }));
  }
  // A quick check's answer on its sheet: the pick, the right one, why, and a line to say the check
  // itself is wrong. Then the 4 s countdown to going on.
  showQuizAnswer(q) {
    const r = this.quizzes[q.id]; if (!r) return;
    const own = r.answer === "own", correct = r.correct === true;
    const box = this.$(".decision"); const fb = box.querySelector(".feedback"); fb.style.display = "block"; const ex = q.explain ? q.explain.charAt(0).toUpperCase() + q.explain.slice(1) : "";
    const head = own ? `You answered in your own words: “${esc(r.own || "")}” It is ${q.answer.toUpperCase()}.` : correct ? "Right." : `Not quite — it is ${q.answer.toUpperCase()}.`;
    fb.innerHTML = `<b>${head}</b> ${this.glossHtml(ex)}${ex && !/[.!?]$/.test(ex) ? "." : ""}`;
    box.querySelectorAll(".opt").forEach((b) => { b.disabled = true; const tag = b.querySelector(".tag"); if (b.dataset.quiz === r.answer) { b.setAttribute("data-chosen", "true"); tag.textContent = "your answer"; } if (b.dataset.quiz === q.answer) { b.setAttribute("data-rec", "true"); if (!correct) tag.textContent = "the answer"; } });
    box.querySelector(".own").hidden = true;   // answered: there is nothing left to put in your own words
    // "Expected something else?": the reviewer may know better than the check. Own words already are
    // the reviewer's words, so they get no second line.
    const dis = box.querySelector(".disagree"); dis.classList.toggle("on", !own); if (r.correct === false) dis.dataset.wrong = ""; else delete dis.dataset.wrong;
    dis.querySelector("textarea").value = r.note || ""; dis.querySelector(".kept").textContent = r.note ? "Kept with your answer — it goes to the agent." : "";
    // Continue is the way on now, and it takes the focus: the option just clicked is disabled, which
    // would otherwise drop focus to <body> and leave space with nothing to reach (the owner's bug)
    this.startWait(this._pendingDecision);
    this.syncWalk(q);   // its worked example: open after a wrong answer, and the video waits
  }
  saveDisagree() {
    const p = this._pendingDecision; if (p?.kind !== "quiz") return; const r = this.quizzes[p.q.id]; if (!r) return;
    const dis = this.$(".decision .disagree"), v = keepLines(dis.querySelector("textarea").value);
    if (v === (r.note || "")) return;
    if (v) r.note = v; else delete r.note;
    try { localStorage.setItem(this.rkey + ":quiz", JSON.stringify(this.quizzes)); } catch {}
    dis.querySelector(".kept").textContent = v ? "Kept with your answer — it goes to the agent." : "";
    this.renderDecisions(); this.dispatchEvent(new CustomEvent("quiz", { detail: { id: p.q.id, ...r } }));
  }
  // An answered question goes on by itself: 10 s after a quick check is answered, for its explanation (the
  // owner found 4 s too fast; step 5), and 4 s for a question met again already answered. On the band the
  // count waits, and starts again from the top, while the pointer or the keyboard is on it (Continue, where
  // the player itself puts the keyboard, does not count). Continue (space, Enter) goes now.
  // `focus`: Continue takes the keyboard, unless the reviewer has just put it somewhere else.
  startWait(p, focus = true) {
    if (!p || this._pendingDecision !== p) return;
    const box = this.$(".decision"), hint = box.querySelector(".hint"), go = box.querySelector(".gobtn");
    this.stopWait();
    go.hidden = false; if (focus) go.focus({ preventScroll: true });
    // opened on purpose (its mark, its time in the record), it stays until the reviewer goes on
    if (this._opening || this._openedFor === p) { hint.textContent = "Continue goes on from here."; delete hint.dataset.live; this.updateStatus(); return; }
    const secs = p.kind === "quiz" && this._freshAnswer === p ? 10 : 4;
    this._waiting = true; let left = secs;
    const say = () => { if (this.bandHeld()) { left = secs; hint.textContent = "Waits while you are here — Continue goes on."; delete hint.dataset.live; } else { hint.dataset.live = ""; hint.textContent = `Continues in ${left} s`; } };
    say();
    this._countdown = setInterval(() => { if (this._pendingDecision !== p) { this.stopWait(); return; } if (!this.bandHeld()) left -= 1; if (left <= 0) { this.skipWait(p); return; } say(); }, 1000);
    this.updateStatus();
  }
  // the pointer is over the band, or the reviewer has put the keyboard in it (not Continue, which the player focuses)
  bandHeld() {
    const box = this.$?.(".decision"); if (!box || !(box.classList.contains("band") || box.classList.contains("onframe")) || !box.classList.contains("on")) return false;
    const a = this.shadowRoot.activeElement, frame = box.classList.contains("onframe");
    // on the frame: the pointer on its cards (reading their whys) or on a "More" it opened holds it too
    return box.matches(":hover") || (frame && (!!this.$(".hits")?.matches(":hover") || !this.$(".fpop").hidden)) || (!!a && (box.contains(a) || (frame && !!this.$(".hits")?.contains(a))) && !a.matches(".gobtn, .hit"));
  }
  stopWait() { clearTimeout(this._quizTimer); clearInterval(this._countdown); this._countdown = null; this._waiting = false; }
  // the reviewer is writing in the sheet, or changing the answer: no countdown; Continue still goes on
  holdWait() { if (!this._waiting) return; this.stopWait(); const h = this.$(".decision .hint"); h.textContent = "Waits while you write — Continue goes on."; delete h.dataset.live; }
  skipWait(p = this._pendingDecision) {
    if (!p || this._pendingDecision !== p || !this.isAnswered(p)) return;
    // walking through the missed checks from Finish (the confusion guard): Continue is the next one, then Finish again
    if (p.kind === "quiz" && this._walkQueue && this._walking === p.q.id) { this.saveDisagree(); this.stopWait(); this.closeCard(); this.nextWalk(); return; }
    // a note changed on a decision met again goes with its answer, as the record's note field would take it
    if (this.isDec(p)) { const m = this.decisions[p.id], v = this.$(".decision [data-note]").value.trim(); if (!this.$(".decision .note").hidden && v !== (m.note || "")) { if (v) m.note = v; else delete m.note; this.saveDecisions(); this.renderDecisions(); } }
    if (p.kind === "quiz") this.saveDisagree();
    this.stopWait(); this.closeCard(); this.player.play();
  }
  // When each pause began, per choice on it, so the review says how long a
  // pause held the reviewer (`shownAt` beside `judgedAt`). Met again, the pause begins again.
  pauseBegins(ids) { const now = new Date().toISOString(); this._shownAt = { ...(this._shownAt || {}) }; for (const id of ids) this._shownAt[id] = now; }
  shownAtOf(id) { return this._shownAt?.[id] || null; }
  askAutonomy(a) {
    this.pauseBegins([a.id]);
    this._pendingDecision = { kind: "autonomy", a }; this._askedOnce = { ...(this._askedOnce || {}), [a.id]: true };
    this.player.pause(); this.player.seek(a.at);
    // what it chose is the statement; the road not taken, why, and where to check it are a short list
    // under it, each with its own label, so the alternative and the reason are told apart at a glance
    const facts = [a.insteadOf ? ["Instead of", this.glossHtml(a.insteadOf)] : null, a.why ? ["Why", this.glossHtml(a.why)] : null, a.check ? ["Check", `<code>${esc(a.check)}</code>`] : null].filter(Boolean);
    const reason = facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>` : "";
    const noun = /^d\d+$/i.test(String(a.id)) ? this.cap(this.callNoun(a.id)) : `The agent's ${this.plain("call")}`;   // "The agent's choice A5", "Off-plan change D1"
    this.openCard("call", `${noun} ${String(a.id).toUpperCase()}${this.stepPart(a.planStep)}`, a.chose || `${noun} ${String(a.id).toUpperCase()}`,
      `<button class="opt" data-verdict="accept" title="Accept — key A"><kbd class="key">A</kbd><b>Accept</b></button><button class="opt" data-verdict="flag" title="Flag for discussion — a flag becomes a note on this step (key B)"><kbd class="key">B</kbd><b>Flag for discussion</b></button>`,
      "Accept (A), or flag it (B); a flag becomes a note on this step.", { reason, about: [a.chose, a.insteadOf && `Instead of: ${a.insteadOf}`, a.why && `Why: ${a.why}`, a.check && `Check: ${a.check}`].filter(Boolean).join("\n") });
    this.ownIsChange(true);
    // met again: the verdict given is ringed, and the other one (or own words) replaces it
    const r = this.autonomy[a.id]; if (!r) return;
    const box = this.$(".decision"); box.querySelector(".k").textContent += " · answered";
    box.querySelectorAll(".opt[data-verdict]").forEach((b) => { if (b.dataset.verdict === r.verdict) b.dataset.chosen = "true"; });
    const fb = box.querySelector(".feedback"); fb.style.display = "block";
    fb.innerHTML = r.verdict === "accept" ? "<b>You accepted it.</b> B flags it instead." : r.verdict === "flag" ? "<b>You flagged it for discussion.</b> A accepts it instead." : `<b>You sent a change:</b> ${esc(r.own || "")}`;
    this.startWait(this._pendingDecision);
  }
  // Grouped calls: the calls \`reel stops\` lets through share one sheet at the end of their part.
  // Each is listed with what it chose and what it replaced, and can be flagged on its own; Accept all
  // (A) accepts every call not flagged. The verdicts are the same per-call records a call's own sheet makes.
  askGroup(g) {
    this.pauseBegins((g.calls || []).map((c) => c.id));
    this._pendingDecision = { kind: "group", g }; this._askedOnce = { ...(this._askedOnce || {}), [g.id]: true };
    this.player.pause(); this.player.seek(g.at);
    const n = (g.calls || []).length;
    if (g.stop) { this.askStop(g); return; }
    if (g.list) { this.askList(g); return; }
    // in the band: Accept all, and one Flag per call, named by its id as the frame names it
    this.openCard("call", `The agent's choices · ${this.plain("grouped beat")} · ${n} ${n === 1 ? this.plain("call") : this.plain("calls")}`, n === 1 ? `One more ${this.plain("call")} from this chapter.` : `${n} more ${this.plain("calls")} from this chapter.`,
      this.groupOpts(g), `Accept all (A) accepts every ${this.plain("call")} you have not flagged.`);
    this.$(".decision .own").hidden = true;   // a grouped call is accepted or flagged; words go in a comment
    if (!this.groupDone(g)) return;
    // met again: each row says what was given, and a flag can still be given or taken back
    const box = this.$(".decision"); box.querySelector(".k").textContent += " · answered";
    const fl = g.calls.filter((c) => this.autonomy[c.id].verdict !== "accept").length;
    const fb = box.querySelector(".feedback"); fb.style.display = "block";
    fb.innerHTML = `<b>You accepted ${n - fl}${fl ? ` and flagged ${fl}` : ""}.</b> A flag can still be given or taken back.`;
    this.startWait(this._pendingDecision);
  }
  groupOpts(g) {
    return `<button class="opt" data-gaccept="1" title="Accept every choice not flagged — key A"><kbd class="key">A</kbd><b>Accept all</b></button>` + (g.calls || []).map((c) => { const f = this.autonomy[c.id]?.verdict === "flag", id = String(c.id).toUpperCase();
      return `<button class="gflag" data-gflag="${esc(c.id)}" aria-pressed="${f}" aria-label="${esc(`${f ? "Flagged" : "Flag"} ${id}: ${c.chose || ""}`)}" title="${esc(`${id} · ${c.chose || c.id}${c.insteadOf ? `\nInstead of: ${c.insteadOf}` : ""}\n${f ? "Flagged for discussion — press to take the flag back" : "Flag this choice for discussion; a flag becomes a note on its step"}`)}">${f ? "Flagged" : "Flag"} ${esc(id)}</button>`; }).join("");
  }
  // The list (walkthroughs-that-help step 2): the choices that do not pause, one sheet at the end of the
  // video. Each is a line, what it chose and instead of what, with its own Flag; Go on (A) takes the rest as
  // listed, not judged (D-221), which the review sends as their verdict. A flag is a note on its step, as on
  // a pause. Met again, a flag can still be given or taken back.
  askList(g) {
    const n = (g.calls || []).length;
    this.openCard("stop", `The agent's other ${this.plain("calls")} · the list · ${n}`, `${n === 1 ? `One more ${this.plain("call")}` : `${n} more ${this.plain("calls")}`}, listed, not judged: flag any you would change.`, this.listRows(g),
      `Go on (A) lists every ${this.plain("call")} you have not flagged.`, { bandHint: `Flag any ${this.plain("call")} you would change; Go on (A) lists the rest.` });
    this.$(".decision .own").hidden = true;   // a listed call is flagged or left; words go in a comment
    if (!this.groupDone(g)) return;
    const box = this.$(".decision"); box.querySelector(".k").textContent += " · seen";
    const fl = g.calls.filter((c) => this.autonomy[c.id].verdict === "flag").length;
    const fb = box.querySelector(".feedback"); fb.style.display = "block";
    fb.innerHTML = `<b>${fl ? `You flagged ${fl}; the rest are listed` : "All listed, none flagged"}.</b> A flag can still be given or taken back.`;
    this.startWait(this._pendingDecision);
  }
  listRows(g) {
    return (g.calls || []).map((c) => {
      const f = this.autonomy[c.id]?.verdict === "flag", id = String(c.id).toUpperCase();
      return `<div class="crow" data-call="${esc(c.id)}" data-verdict="${f ? "flag" : ""}"><span class="cid">${esc(id)}</span>`
        + `<span class="cw">${esc(c.chose || c.id)}${c.insteadOf ? ` <span class="ci">— instead of ${esc(c.insteadOf)}</span>` : ""}</span>`
        + `<span class="cacts"><button class="lflag" data-gflag="${esc(c.id)}" aria-pressed="${f}" title="${esc(f ? `Flagged: press to take the flag back` : `Flag ${id}: a flag becomes a note on its step, and the agent fixes it`)}">${f ? "Flagged" : "Flag"} ${esc(id)}</button></span></div>`;
    }).join("") + `<button class="opt" data-gaccept="1" title="List every choice not flagged — key A"><kbd class="key">A</kbd><b>Go on</b></button>`;
  }
  flagInGroup(id) {
    const p = this._pendingDecision, c = p?.kind === "group" ? p.g.calls.find((x) => x.id === id) : null; if (!c) return;
    const a = { ...c, at: p.g.at };
    if (this.autonomy[id]?.verdict !== "flag") this.recordVerdict(a, "flag");
    else {   // the flag taken back: the call waits for Accept all (or Go on) again, and the flag's own note goes with it
      this.annotations = this.annotations.filter((x) => !(x.kind === "flag" && x.comment === `Flagged: ${a.chose}`)); this.persist(); this.renderList(); this.redraw();
      delete this.autonomy[id]; try { localStorage.setItem(this.rkey + ":autonomy", JSON.stringify(this.autonomy)); } catch {}
      this.renderAutonomy();
    }
    this.holdWait();
    this.$(".decision .opts").innerHTML = p.g.list ? this.listRows(p.g) : this.groupOpts(p.g);
    this.$(`.decision [data-gflag="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });   // the button pressed was redrawn: keep the keys in the player
    this.updateStatus();
  }
  // A stop beat (fewer-better-stops step 1): the calls of a step that stop share one pause. The band lists
  // each, what it chose and instead of what, with its own Accept, Flag and own words; there is no Accept all.
  // A and B judge the first call still waiting, O puts it in your own words. The video goes on once each has
  // a verdict. Met again with every verdict given, each can still be changed, and Continue goes on.
  askStop(g) {
    const n = (g.calls || []).length;
    this.openCard("stop", `The agent's choices${this.stepPart(g.planStep)} · ${n} ${this.plain("calls")}`, `Accept or flag each of these ${n} ${this.plain("calls")}; the video goes on once each has a verdict.`, this.stopRows(g), "",
      { bandHint: `Accept or flag each ${this.plain("call")} on its card; the video goes on once each has a verdict.` });
    this.ownIsChange(true); this.$(".decision .own").hidden = true;   // own words open from a call's row, for that call
    this._ownFor = null;
    if (this.groupDone(g)) { this.$(".decision .k").textContent += " · answered"; this.stopDone(g); this.startWait(this._pendingDecision); }
  }
  stopWaiting(g) { return (g.calls || []).find((c) => !this.autonomy[c.id]) || null; }
  stopRows(g) {
    const cur = this.stopWaiting(g)?.id;
    return (g.calls || []).map((c) => {
      const r = this.autonomy[c.id], v = r?.verdict || "", id = String(c.id).toUpperCase(), now = c.id === cur, key = (k) => `<kbd class="key">${k}</kbd>`;
      return `<div class="crow" data-call="${esc(c.id)}" data-verdict="${esc(v)}"${now ? " data-current" : ""}><span class="cid">${esc(id)}</span>`
        + `<span class="cw">${esc(c.chose || c.id)}${c.insteadOf ? ` <span class="ci">— instead of ${esc(c.insteadOf)}</span>` : ""}${v === "own" ? ` <span class="ci">— your words: ${esc(r.own || "")}</span>` : ""}</span>`
        + `<span class="cacts"><button data-sverdict="${esc(c.id)}:accept" aria-pressed="${v === "accept"}" title="${esc(`Accept ${id}${now ? " — key A" : ""}`)}">${v === "accept" ? "Accepted" : "Accept"}${key("A")}</button>`
        + `<button data-sverdict="${esc(c.id)}:flag" aria-pressed="${v === "flag"}" title="${esc(`Flag ${id} for discussion; a flag becomes a note on its step${now ? " — key B" : ""}`)}">${v === "flag" ? "Flagged" : "Flag"}${key("B")}</button>`
        + `<button data-sown="${esc(c.id)}" aria-pressed="${v === "own"}" title="${esc(`Say what the agent should do instead of ${id}: your words become a change${now ? " — key O" : ""}`)}">Own words${key("O")}</button></span></div>`;
    }).join("");
  }
  // every call judged: what was given, in the words' place
  stopDone(g) {
    const vs = (g.calls || []).map((c) => this.autonomy[c.id]?.verdict), fb = this.$(".decision .feedback"), k = (v) => vs.filter((x) => x === v).length;
    fb.style.display = "block";
    fb.innerHTML = `<b>You accepted ${k("accept")}${k("flag") ? `, flagged ${k("flag")}` : ""}${k("own") ? `, sent ${k("own")} as a change` : ""}.</b> Each can still be changed; Continue goes on.`;
  }
  judgeInStop(id, verdict) {
    const p = this._pendingDecision; if (p?.kind !== "group" || !p.g.stop) return;
    const c = p.g.calls.find((x) => x.id === id); if (!c) return;
    const was = this.groupDone(p.g), had = this.$(".decision").contains(this.shadowRoot.activeElement);
    if (this.autonomy[id]?.verdict !== verdict) this.recordVerdict({ ...c, at: p.g.at }, verdict);
    if (!was && this.groupDone(p.g)) { this.closeCard(); this.player.play(); return; }   // the last verdict: on
    this.$(".decision .opts").innerHTML = this.stopRows(p.g);
    if (was) { this.stopDone(p.g); this.holdWait(); }
    if (had) this.$(`.decision [data-sverdict="${CSS.escape(`${id}:${verdict}`)}"]`)?.focus({ preventScroll: true });   // redrawn: keep the keys in the player
    this.updateStatus();
  }
  // own words on one call of a stop beat: the band's own box, for that call
  openOwnFor(id) {
    const p = this._pendingDecision; if (p?.kind !== "group" || !p.g.stop) return;
    const c = p.g.calls.find((x) => x.id === id); if (!c) return;
    this._ownFor = c.id; const own = this.$(".own"), up = String(c.id).toUpperCase();
    own.hidden = false; own.querySelector(".ownhint").textContent = `Your words on ${up} become an instruction: the agent changes the code to match.`;
    own.querySelector("textarea").placeholder = `What the agent should do instead of ${up} — Enter sends it`;
    this.holdWait(); this.openOwn();
  }
  acceptGroup() {
    const p = this._pendingDecision; if (p?.kind !== "group" || p.g.stop) return;
    this.closeCard();
    // the list: what is not flagged is listed, not judged (D-221); a grouped beat's Accept all accepts it
    for (const c of p.g.calls) if (!this.autonomy[c.id]) this.recordVerdict({ ...c, at: p.g.at }, p.g.list ? "listed" : "accept");
    this.player.play();
  }
  // On the agent's call, an answer in the reviewer's own words is not a softer Accept: it is a change
  // the agent will make, with those words as its instruction (quick check K2 showed it read as the
  // former). The box says so, and its button names the act.
  ownIsChange(on) {
    const own = this.$(".own"); if (!own) return;
    own.querySelector(".ownhint").hidden = !on; own.querySelector(".ownhint").textContent = "Your words become an instruction: the agent changes the code to match.";
    own.querySelector('[data-act="own-save"]').textContent = on ? "Send as a change" : "Save";
    own.querySelector("textarea").placeholder = on ? "What the agent should do instead — Enter sends it" : "Your answer — Enter saves it";
  }
  judgeAutonomy(verdict) {
    const p = this._pendingDecision; if (!p || p.kind !== "autonomy") return;
    this.closeCard();
    this.recordVerdict(p.a, verdict);
    this.player.play();
  }
  // One verdict on one of the agent's calls, from its sheet or from its detail's panel: the same record either way.
  recordVerdict(a, verdict) {
    // a verdict changed on meeting the call again: the flag it replaces (the player's own line, never the reviewer's words) goes with it
    const was = this.autonomy[a.id]?.verdict;
    if (was === "flag" && verdict !== "flag") { this.annotations = this.annotations.filter((x) => !(x.kind === "flag" && x.comment === `Flagged: ${a.chose}`)); this.persist(); this.renderList(); this.redraw(); }
    this.autonomy[a.id] = { verdict, t: a.at, planStep: a.planStep, chose: a.chose, ...(this.shownAtOf(a.id) ? { shownAt: this.shownAtOf(a.id) } : {}), judgedAt: new Date().toISOString() };
    try { localStorage.setItem(this.rkey + ":autonomy", JSON.stringify(this.autonomy)); } catch {}
    if (verdict === "flag" && was !== "flag") { const n = this.add({ kind: "flag", comment: `Flagged: ${a.chose}`, ...(a.at != null ? { t: a.at } : {}) }); n.plan.step = a.planStep ?? n.plan.step; this.persist(); this.renderList(); }
    this.renderAutonomy(); this.dispatchEvent(new CustomEvent("autonomy", { detail: { id: a.id, ...this.autonomy[a.id] } }));
  }
  renderLevel() { const l = this.planMap?.levels; if (!l) return; this.$(".lvl-len").textContent = `${Math.round(l[this.level] || 0)} s at this level`; }
  // A decision's id is "q<N>", the plan's own question number, and it outlives a round: after round 1's
  // question 1 is decided, round 2 asks 2–5, and the sheet has to say "Choice 2" as the frame and the
  // plan do. Only a video with other ids falls back to counting.
  choiceNo(d) { const all = this.planMap?.decisions || []; return all.every((x) => /^q\d+$/.test(x.id)) ? Number(d.id.slice(1)) : all.indexOf(d) + 1; }
  renderAutonomy() {
    const as = this.calls();
    // same rule as the decisions list: what was judged, never what is still being asked
    const done = as.filter((a) => this.autonomy[a.id]), left = as.length - done.length;
    const verdict = (r) => r.verdict === "flag" ? "<span><b>Flagged</b> for discussion</span>" : r.verdict === "own" ? `<span><b>Sent as a change:</b> ${esc(r.own || "")}</span>` : r.verdict === "listed" ? "<span><b>Listed</b>, not judged</span>" : "<span><b>Accepted</b></span>";
    this.syncPull?.();   // the record's bar counts the calls judged
    const c = this.$(".autosec .count"); if (c) c.textContent = as.length ? ` · ${done.length} of ${as.length}` : "";
    this.$(".autolog").innerHTML = done.map((a) => { const r = this.autonomy[a.id]; return `<div class="dec" data-verdict="${esc(r.verdict)}"><span class="k">${esc(this.cap(this.callNoun(a.id)))} ${esc(String(a.id).toUpperCase())}${this.stepPart(a.planStep)} · <button class="tm" data-point="call:${esc(a.id)}" title="Open this choice on the video">${this.fmt(a.at)}</button></span><div class="q">${this.glossHtml(a.chose || "")}</div><div class="a">${verdict(r)}${["accept", "flag"].filter((v) => v !== r.verdict).map((v) => `<button class="lnk" data-reverdict="${esc(a.id)}:${v}" title="${v === "accept" ? "Accept this choice instead" : "Flag this choice for discussion instead; a flag becomes a note on its step"}">${v === "accept" ? "accept instead" : "flag instead"}</button>`).join("")}<button class="lnk cp" data-copy="call:${esc(a.id)}" title="Copy this choice as one line of text" aria-label="Copy this choice">copy</button></div></div>`; }).join("")
      + (left ? `<p class="empty">${done.length ? `${left} more ${left === 1 ? "comes" : "come"} up on the video.` : `None yet. ${left} ${left === 1 ? "comes" : "come"} up on the video.`}</p>` : "");
    this.syncTicks(); this.syncResend();
  }
  applyDecisionToStage(d, o) {
    // the resolved-plan frame carries a .d tag per decided rail slot; rewrite it with the actual choice.
    // Only the tag (.d, right-aligned mono) is written, never the slot title (.t); the branch frames already
    // carry their own tag for the path they show, so they are left alone; a long label is fitted, not overprinted.
    try { const doc = this.player.iframeElement?.contentDocument; if (!doc || !d.planStep) return;
      const branchIds = new Set(d.options.map((x) => x.branch?.compositionId).filter(Boolean));
      doc.querySelectorAll(`[data-plan-step="${d.planStep}"] .d`).forEach((el) => {
        const comp = el.closest("[data-composition-id]"); if (comp && branchIds.has(comp.dataset.compositionId)) return;
        const was = el.textContent.trim(); const upper = was && was === was.toUpperCase();
        this.fitTag(el, el.parentElement?.querySelector(".t"), upper ? o.label.toUpperCase() : o.label);
      }); } catch {}
  }
  fitTag(el, title, text) {
    el.style.fontSize = ""; el.textContent = text;
    const words = text.split(/\s+/);
    const overlaps = () => { if (!title) return false; const a = el.getBoundingClientRect(), b = title.getBoundingClientRect(); if (!a.width || !b.width) return el.textContent.length > 14; return a.left < b.right + 12; };
    const view = el.ownerDocument.defaultView; let size = parseFloat(view?.getComputedStyle(el).fontSize) || 26;
    while (overlaps() && size > 16) { size -= 2; el.style.fontSize = `${size}px`; }
    let n = words.length; while (overlaps() && n > 1) { n -= 1; el.textContent = words.slice(0, n).join(" "); }
  }
  chapterAt(t) { const chs = this.planMap?.chapters || []; return chs.find((c) => t >= c.start && t < c.end) || chs[chs.length - 1] || null; }
  dur() { return this.player?.duration || this.planMap?.totalSeconds || 0; }
  approx(s) { if (!(s > 0)) return "a moment"; if (s < 50) return `${Math.round(s)} s`; if (s < 90) return "about a minute"; return `about ${Math.round(s / 60)} minutes`; }
  // the chapters as one segmented line under the video: widths in proportion to seconds, the current one coral,
  // and the points where the video asks something, one shape per kind (see .mk)
  renderScrub() {
    const s = this.$(".scrub"), L = this.$(".labels"); const dur = this.dur() || 1; const chs = this.planMap?.chapters || [];
    const segs = chs.length ? chs : [{ id: "all", title: "", start: 0, end: dur }];
    this._segs = segs.map((c) => ({ ...c, end: c.end ?? dur }));
    const pct = (t) => `${Math.max(0, Math.min(100, (t / dur) * 100)).toFixed(3)}%`;
    const GAP = 6; // px between parts: wide enough to read as a break, not as a notch
    const points = this._points = [...(this.planMap?.decisions || []).map((d) => ({ id: d.id, at: d.at, kind: "choice", name: `Question ${this.choiceNo(d)}` })), ...(this.planMap?.quizzes || []).map((q) => ({ id: q.id, at: q.at, kind: "check", name: `Quick check ${this.checkNo(q)}` })), ...(this.planMap?.autonomy || []).map((a) => ({ id: a.id, at: a.at, kind: "call", name: this.cap(this.callNoun(a.id) === this.plain("call") ? "the agent's choice" : this.callNoun(a.id)) })), ...(this.planMap?.autonomyGroups || []).map((g) => ({ id: g.id, at: g.at, kind: "group", g, name: `The agent's choices (${(g.calls || []).length})` }))];
    // quick checks off: each check's own scene is faded on its part's bar (it is skipped as the video plays)
    const off = !this.checksOn, skp = off ? (this.planMap?.frames || []).filter((f) => this.checkScenes().has(f.index)) : [];
    const inSeg = (c) => skp.filter((f) => f.start < c.end && f.start + (f.durationSeconds || 0) > c.start).map((f) => { const L = c.end - c.start || 1, a = Math.max(0, (f.start - c.start) / L), b = Math.min(1, (f.start + (f.durationSeconds || 0) - c.start) / L);
      return `<s class="skp" style="left:${(a * 100).toFixed(3)}%;width:${((b - a) * 100).toFixed(3)}%" title="Skipped: quick checks are off"></s>`; }).join("");
    s.innerHTML = this._segs.map((c, i) => `<i class="seg" data-ch="${c.id}" style="left:calc(${pct(c.start)} + ${i ? GAP / 2 : 0}px);width:calc(${pct(c.end - c.start)} - ${(i ? GAP / 2 : 0) + (i + 1 < this._segs.length ? GAP / 2 : 0)}px)"><b></b>${inSeg(c)}</i>`).join("")
      + (this.planMap?.frames || []).filter((f) => this.changed.has(f.index) && this.changed.size < (this.planMap.frames || []).length).map((f) => `<i class="chg" style="left:${pct(f.start)};width:${pct((f.end ?? f.start + (f.durationSeconds || 0)) - f.start)}" title="changed since the last build"></i>`).join("")
      + points.map((p) => `<i class="tick mk" data-kind="${p.kind}" data-id="${esc(p.id)}"${off && p.kind === "check" ? " data-skipped" : ""} style="left:${pct(p.at)}" title="${esc(p.name)} · ${this.fmt(p.at)}"></i>`).join("") + `<i class="head"></i><i class="hover"></i>`;
    // the key to the shapes, in the record: only the kinds this plan has, and only when it has two or more
    const LEG = { choice: "Question", check: "Quick check", call: "The agent's choice" }, kinds = Object.keys(LEG).filter((k) => points.some((p) => (p.kind === "group" ? "call" : p.kind) === k)), leg = this.$(".legend");
    if (leg) { leg.hidden = kinds.length < 2; leg.title = "The points on the timeline, one shape per kind; an answered one dims"; leg.innerHTML = kinds.length < 2 ? "" : `Timeline:${kinds.map((k) => `<span><i class="mk" data-kind="${k}" aria-hidden="true"></i>${LEG[k]}</span>`).join("")}`; }
    this.syncTicks();
    // every part, numbered and named under its own bar, and each one the way to its start
    const n = this._segs.length;
    L.innerHTML = chs.length > 1 ? this._segs.map((c, i) => `<button class="part" data-part="${i}" aria-label="Chapter ${i + 1} of ${n}: ${esc(plainTitle(c.title))}" title="${esc(`Chapter ${i + 1} of ${n} · ${plainTitle(c.title)} — click to jump to its start (N next chapter, P previous; Shift+→ / Shift+← too)`)}"><span class="pn">${i + 1}</span><span class="pt">${esc(plainTitle(c.title))}</span></button>`).join("") : "";
    L.querySelectorAll(".part").forEach((b) => { const seg = () => s.querySelectorAll(".seg")[Number(b.dataset.part)]; b.onpointerenter = () => seg()?.classList.add("hov"); b.onpointerleave = () => seg()?.classList.remove("hov"); });
    this._partFor = undefined;
    // hovering names the part under the pointer, and the moment you would jump to
    const hover = s.querySelector(".hover");
    s.onpointermove = (e) => {
      const r = s.getBoundingClientRect(); if (!r.width) return;
      const x = Math.max(0, Math.min(r.width, e.clientX - r.left)), at = (x / r.width) * dur;
      const i = Math.max(0, this._segs.findIndex((c) => at >= c.start && at < c.end));
      s.querySelectorAll(".seg").forEach((el, j) => el.classList.toggle("hov", j === i));
      // over one of the points, the label names its kind and its moment instead: "Quick check · 1:21"
      const tick = points.map((p) => ({ p, dx: Math.abs((p.at / dur) * r.width - x) })).filter((o) => o.dx <= 7).sort((a, b) => a.dx - b.dx)[0]?.p;
      const c = this._segs[i], cm = tick ? null : this.annAtX(x, r.width, dur);
      if (cm) { hover.dataset.kind = "comment"; const w = String(cm.comment || "").replace(/\s+/g, " ").trim(); hover.innerHTML = `Your ${cm.path ? "mark" : "comment"}${w ? `: ${esc(w.length > 40 ? `${w.slice(0, 39)}…` : w)}` : ""} · <span class="tm at">${this.fmt(cm.t)}</span>`; }
      else if (tick) { hover.dataset.kind = tick.kind; hover.innerHTML = `${esc(tick.name)}${this.answered(tick) ? " (answered)" : tick.kind === "check" && !this.checksOn ? " (quick checks off)" : ""} · <span class="tm at">${this.fmt(tick.at)}</span>`; }
      else { delete hover.dataset.kind; hover.innerHTML = `${this._segs.length > 1 ? `Chapter ${i + 1} · ${esc(plainTitle(c.title))}` : ""}<span class="tm">${this.fmt(at)}</span>`; }
      hover.classList.add("on"); const w = hover.offsetWidth; hover.style.left = `${Math.max(w / 2, Math.min(r.width - w / 2, x))}px`;
    };
    s.onpointerleave = () => { hover.classList.remove("on"); s.querySelectorAll(".seg.hov").forEach((el) => el.classList.remove("hov")); };
    this.syncCommentTicks();
    this.syncScrub();
  }
  // a point is answered once it is on the record; "explain this more" is not an answer, so it stays open
  answered(p) { return p.kind === "choice" ? !!this.decisions[p.id] && !this.isUnclear(this.decisions[p.id]) : p.kind === "check" ? !!this.quizzes[p.id] : p.kind === "group" ? this.groupDone(p.g) : !!this.autonomy[p.id]; }
  syncTicks() { const by = Object.fromEntries((this._points || []).map((p) => [`${p.kind}:${p.id}`, p])); this.$$?.(".scrub .tick").forEach((el) => { const p = by[`${el.dataset.kind}:${el.dataset.id}`]; if (p) el.dataset.answered = String(this.answered(p)); }); this._nextKey = undefined; this.syncNext(); }
  // the one point in full ink: the next still open at or after the playhead
  syncNext() {
    const t = this.watchedT(), off = !this.checksOn, n = (this._points || []).filter((p) => p.at >= t - 0.5 && !this.answered(p) && !(off && p.kind === "check")).sort((a, b) => a.at - b.at)[0], key = n ? `${n.kind}:${n.id}` : null;
    if (key === this._nextKey) return; this._nextKey = key;
    this.$$?.(".scrub .tick").forEach((el) => { if (`${el.dataset.kind}:${el.dataset.id}` === key) el.dataset.next = ""; else delete el.dataset.next; });
  }
  syncScrub() {
    const dur = this.dur() || 1; const t = this.stage?.dataset.started ? (this.player?.currentTime ?? this._lastT) : 0; const p = `${Math.max(0, Math.min(100, (t / dur) * 100))}%`; // the poster seek is not progress
    const head = this.$(".scrub .head"); if (head) head.style.left = p;
    const cur = this.chapterAt(t);
    // each part fills with its own progress, so a finished part reads as finished
    this.shadowRoot.querySelectorAll(".scrub .seg").forEach((el, i) => { const c = this._segs?.[i]; if (!c) return; const f = Math.max(0, Math.min(1, (t - c.start) / ((c.end - c.start) || 1))); el.firstElementChild.style.width = `${(f * 100).toFixed(2)}%`; el.classList.toggle("cur", !!cur && el.dataset.ch === cur.id); });
    // under the bars, the part you are in is the coral one, and is named in full
    const parts = this.$$(".labels .part");
    if (parts.length && this._partFor !== (cur?.id ?? null)) {
      this._partFor = cur?.id ?? null;
      parts.forEach((b, i) => { const on = this._segs?.[i]?.id === cur?.id; b.setAttribute("aria-current", String(on)); });
      this.layoutParts();
    }
    this.$(".now").textContent = this.fmt(t); this.$(".dur").textContent = this.fmt(this.dur()); this.syncNext();
    this.syncDetailChip(t);
    if (this._mini) this.syncMiniBar(t);
  }

  // Each part's name sits under its own bar, as wide as the bar. When the part you are in has a
  // longer name than its bar, it takes the width it needs (up to what leaves the others their
  // numbers) and the others share the rest in proportion, so the current part is always readable
  // and every part is still there to click, in order.
  layoutParts() {
    const row = this.$?.(".labels"), items = row ? [...row.querySelectorAll(".part")] : [], segs = this._segs || [];
    if (!items.length || items.length !== segs.length) return;
    const W = row.clientWidth; if (!W) return;
    const dur = this.dur() || 1, G = 6, MIN = 22, n = items.length, len = (c) => Math.max(0, c.end - c.start);
    const cur = items.findIndex((el) => el.getAttribute("aria-current") === "true");
    if (W < n * (MIN + G) + 96 && cur >= 0) {
      row.dataset.compact = "";
      items.forEach((el, i) => { el.classList.toggle("tight", i !== cur); el.style.left = i === cur ? "0px" : `${((segs[i].start / dur) * (W - MIN)).toFixed(1)}px`; el.style.width = i === cur ? "auto" : `${MIN}px`; el.style.maxWidth = i === cur ? `${W}px` : ""; });
      return;
    }
    delete row.dataset.compact; items.forEach((el) => { el.style.maxWidth = ""; });
    let lefts = segs.map((c, i) => (c.start / dur) * W + (i ? G / 2 : 0));
    let widths = segs.map((c, i) => (len(c) / dur) * W - (i ? G / 2 : 0) - (i + 1 < n ? G / 2 : 0));
    const k = items.findIndex((el) => el.getAttribute("aria-current") === "true");
    if (k >= 0) {
      const el = items[k]; el.classList.remove("tight"); el.style.width = "max-content";
      const natural = Math.ceil(el.getBoundingClientRect().width) + 2;
      if (natural > widths[k]) {
        const wk = Math.min(natural, W - (n - 1) * (MIN + G)), rest = W - wk - (n - 1) * G;
        const others = segs.reduce((sum, c, i) => sum + (i === k ? 0 : len(c)), 0) || 1;
        widths = segs.map((c, i) => (i === k ? wk : Math.max(MIN, (rest * len(c)) / others)));
        let x = 0; lefts = widths.map((w) => { const l = x; x += w + G; return l; });
      }
    }
    // the other parts are numbers (their names are in their tooltips and on the timeline's hover), never a cut "Step 3: …"
    items.forEach((el, i) => { el.style.left = `${lefts[i].toFixed(1)}px`; el.style.width = `${(i === k ? Math.max(MIN, widths[i]) : MIN).toFixed(1)}px`; el.classList.toggle("tight", i !== k || widths[i] < MIN + 30); });
  }
  // N / P, Shift+→ / Shift+←, and the part markers: to the start of a part. Going back more than
  // 2 s this way is a rewind like any other (D-005); going forward never is.
  jumpPart(dir) {
    const chs = this.planMap?.chapters || [];
    if (chs.length < 2) { this.status("this video is one chapter"); return; }
    const cur = this.chapterAt(this.watchedT()), i = Math.max(0, chs.indexOf(cur));
    const j = Math.max(0, Math.min(chs.length - 1, i + dir));
    if (dir > 0 && j === i) { this.status("this is the last chapter"); return; }
    this.goPart(j);
  }
  goPart(j) {
    const chs = this.planMap?.chapters || [], c = chs[j]; if (!c) return;
    const from = this.watchedT();
    // arriving at a part's start is not arriving at the end of the part before it: no end-of-part stop
    if (j > 0) this._chapterShown = { ...(this._chapterShown || {}), [chs[j - 1].id]: true };
    this.$(".chend").classList.remove("on");
    // a waiting question folds away rather than hanging over another part; it comes back when the
    // video reaches it again, as a folded question always does (D-001)
    if (this._pendingDecision && !this._folded) this.fold(true);
    this.start(); this.closePull(); this._byHand = true; this.jump(c.start);
    this.noteRewind(from, c.start);
    this.status(`chapter ${j + 1} of ${chs.length} · ${plainTitle(c.title)}`);
  }

  syncPlay() { const b = this.$('[data-act="play"]'); const playing = !!this.player && !this.player.paused; b.textContent = playing ? "Pause" : "Play"; b.dataset.playing = String(playing); b.setAttribute("aria-label", playing ? "Pause (space)" : "Play (space)"); this.$(".dmark")?.toggleAttribute("data-playing", playing); this.updateStatus(); if (this._mini) this.syncMiniBar(); }
  // One home per question. A question is asked in exactly one place, the sheet on the video;
  // this is the record of what has been ANSWERED. The ones still to come are a count, not a second
  // copy of the question, so there is never a version of it here to answer instead.
  renderDecisions() {
    const el = this.$(".decisions"); const decs = this.planMap?.decisions || [], qs = this.planMap?.quizzes || [];
    // a question's time opens it again, answered, on the video (openPoint)
    const tm = (kind, x) => `<button class="tm" data-point="${kind}:${esc(x.id)}" title="Open this question on the video">${this.fmt(x.at)}</button>`;
    const said = (r, q) => r.answer === "own" ? `<span><b>Answered in their own words</b></span>` : r.correct ? `<span><b>Right</b> (${r.answer.toUpperCase()})</span>` : `<span><b>Not quite</b> — you said ${r.answer.toUpperCase()}, it is ${q.answer.toUpperCase()}</span>`;
    const rows = [
      ...decs.filter((d) => this.decisions[d.id]).map((d) => { const m = this.decisions[d.id]; return { at: d.at, html: `<div class="dec"${this.isUnclear(m) ? ' data-unclear="true"' : ""}><span class="k">Question ${this.choiceNo(d)}${this.stepPart(d.planStep)} · ${tm("choice", d)}</span><div class="q">${this.glossHtml(d.question || "")}</div><div class="a"><b>${this.isUnclear(m) ? "Asked to explain more" : esc(m.label)}</b><button class="lnk" data-redit="${esc(d.id)}" aria-expanded="${this._editing === d.id}" title="Change this answer here; the video plays the path it takes from here">change</button><button class="lnk cp" data-copy="dec:${esc(d.id)}" title="Copy this answer as one line of text" aria-label="Copy this answer">copy</button></div>${this._editing === d.id ? this.answerEditor(d, m) : ""}<textarea class="dnote" rows="1" data-dnote="${d.id}" placeholder="${this.isUnclear(m) ? "What is unclear" : "Add a note to this answer"}" aria-label="${this.isUnclear(m) ? "What is unclear about this question" : "Your note on this answer"}">${esc(m.note || "")}</textarea></div>` }; }),
      ...qs.filter((q) => this.quizzes[q.id]).map((q) => { const r = this.quizzes[q.id]; return { at: q.at, html: `<div class="dec"><span class="k">Quick check ${this.checkNo(q)}${q.planStep != null ? ` · step ${q.planStep}` : ""} · ${tm("check", q)}</span><div class="q">${this.glossHtml(q.question || "")}</div><div class="a">${said(r, q)}<button class="lnk" data-back="${esc(q.id)}" title="Play from where this was explained; the quick check waits when it comes up">back to where this was explained</button><button class="lnk cp" data-copy="quiz:${esc(q.id)}" title="Copy this answer as one line of text" aria-label="Copy this answer">copy</button></div>${r.answer === "own" ? "" : `<textarea class="dnote" rows="1" data-qnote="${esc(q.id)}" placeholder="Expected something else? Say how it should work" aria-label="How you expected this to work, if not as the quick check says">${esc(r.note || "")}</textarea>`}</div>` }; }),
    ].sort((a, b) => a.at - b.at);
    const left = decs.filter((d) => !this.decisions[d.id]).length + qs.filter((q) => !this.quizzes[q.id]).length;
    const made = decs.filter((d) => this.decisions[d.id] && !this.isUnclear(this.decisions[d.id])).length;   // an "explain more" is on the record, not decided
    // what is still to come is one line, not a sentence about the interface; a kind this video lacks has no section
    const waiting = left ? `<p class="empty">${rows.length ? `${left} more ${left === 1 ? "comes" : "come"} up on the video.` : `None yet. ${left} ${left === 1 ? "comes" : "come"} up on the video.`}</p>` : "";
    el.innerHTML = decs.length || qs.length ? (rows.map((r) => r.html).join("") + waiting) : "";
    const sec = this.$(".decs"); if (sec) sec.hidden = !(decs.length || qs.length);
    // the "0 of 3 decided" that used to ride on the status line belongs to the list that owns it
    const c = this.$(".decs .count"); if (c) c.textContent = decs.length ? ` · ${made} of ${decs.length}` : "";
    // the note on an answer stays editable here, after the question has gone
    const grow = (ta) => { ta.style.height = "auto"; ta.style.height = `${ta.scrollHeight}px`; };
    // the line under a quick check's answer, the same words the sheet's "Expected something else?" keeps
    el.querySelectorAll("textarea[data-qnote]").forEach((ta) => { grow(ta); ta.addEventListener("input", () => grow(ta)); ta.addEventListener("change", () => { const r = this.quizzes[ta.dataset.qnote]; if (!r) return; const v = keepLines(ta.value); if (v === (r.note || "")) return; if (v) r.note = v; else delete r.note; try { localStorage.setItem(this.rkey + ":quiz", JSON.stringify(this.quizzes)); } catch {} this.dispatchEvent(new CustomEvent("quiz", { detail: { id: ta.dataset.qnote, ...r } })); this.syncResend(); }); });
    el.querySelectorAll("textarea[data-dnote]").forEach((ta) => { grow(ta); ta.addEventListener("input", () => grow(ta)); ta.addEventListener("change", () => { const m = this.decisions[ta.dataset.dnote]; if (!m) return; const v = ta.value.trim(); if (v) m.note = v; else delete m.note; this.saveDecisions(); this.syncResend(); }); });
    // the answer's own words, in its editor: Enter saves them as the answer (Escape closes the editor, onEscape)
    el.querySelectorAll("textarea[data-setown]").forEach((inp) => { inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.changeAnswer(inp.dataset.setown, { own: inp.value }); } }); inp.addEventListener("input", () => this.fitField(inp, 4)); requestAnimationFrame(() => this.fitField(inp, 4)); });
    this.syncTicks();  // an answered point dims on the timeline
    this.syncPull();   // the peek's live count of decisions moves with what has been answered
    this.syncResend();
  }
  // "change" on an answer opens its options under it, the one given pressed: a pick saves it
  // (a pick-all answer's ticks are saved together), and own words save on Enter. Nothing goes back
  // into the video; it plays the new answer's path when it gets there.
  answerEditor(d, m) {
    const multi = d.kind === "multi", on = (o) => multi ? !!m?.options?.includes(o.id) : m?.option === o.id;
    return `<div class="redit" role="group" aria-label="Change your answer">${d.options.map((o) => `<button class="ropt" data-set="${esc(d.id)}:${esc(o.id)}" aria-pressed="${on(o)}" title="${multi ? "Tick or untick" : "Make this the answer"}"><kbd class="key">${esc(o.id.toUpperCase())}</kbd>${esc(o.label)}</button>`).join("")}${multi ? `<button class="rsave" data-setmulti="${esc(d.id)}">Save the picks</button>` : ""}<textarea rows="1" data-setown="${esc(d.id)}" maxlength="400" placeholder="Or in your own words — Enter saves" aria-label="Your answer in your own words — Enter saves it, Shift+Enter starts a new line">${m?.option === "own" ? esc(m.label) : ""}</textarea></div>`;
  }
  editAnswer(id) {
    this._editing = id; this.renderDecisions();
    if (id) (this.$('.redit .ropt[aria-pressed="true"]') || this.$(".redit .ropt"))?.focus({ preventScroll: true });
    else this.$(`[data-redit]`)?.focus({ preventScroll: true });
  }
  // The answer changed where it is listed, recorded as a fresh answer would be: the video, when it gets
  // there, plays the path this one takes (tickDecisions routes past what was not chosen). The note stays with it.
  changeAnswer(id, how) {
    const d = (this.planMap?.decisions || []).find((x) => x.id === id); if (!d) return;
    const was = this.decisions[d.id], keep = was?.note ? { note: was.note } : {};
    const base = { recommended: false, planStep: d.planStep, question: d.question, t: d.at, decidedAt: new Date().toISOString() };
    let rec, o = null;
    if (how.own != null) { const text = String(how.own).trim(); if (!text) return; rec = { option: "own", label: text, own: true, ...base, ...keep }; }
    else if (how.options) { const picks = d.options.filter((x) => how.options.includes(x.id)); if (!picks.length) { this.status("tick at least one"); return; } const labels = picks.map((x) => x.label); rec = { option: "multi", options: picks.map((x) => x.id), labels, label: labels.join(", "), ...base, ...keep }; }
    else { o = d.options.find((x) => x.id === how.option); if (!o) return; rec = { option: o.id, label: o.label, ...base, recommended: !!o.recommended, ...keep }; }
    if (this.pendingId() === d.id) this.giveWay();   // its question up on the video: the record's answer replaces it
    // own words are also a comment at the question (answerOwn); other words, or no longer own words, take the old one's place
    const about = `Answered in their own words: ${d.question || d.id}`;
    if (was?.option === "own") this.annotations = this.annotations.filter((a) => !(a.kind === "note" && a.about === about && a.comment === was.label));
    this.decisions[d.id] = rec; this._skipUntil = null; this._editing = null;
    this.saveDecisions();
    if (rec.option === "own") this.comment(rec.label, d.at, about); else { this.persist(); this.renderList(); }
    this.renderDecisions(); this.syncGallery();
    this.applyDecisionToStage(d, o || { label: rec.label }); this.applyPicks();
    this.dispatchEvent(new CustomEvent("decision", { detail: { id: d.id, ...rec } }));
    this.$(`[data-redit="${CSS.escape(d.id)}"]`)?.focus({ preventScroll: true });
    this.status(`question ${this.choiceNo(d)} is now ${rec.option === "own" ? "your own words" : rec.label} — the video plays that path when it gets there`);
  }
  // A call's verdict switched where it is listed: the same record the sheet makes (recordVerdict), and
  // own words given before, which were also a comment, go with the verdict they were.
  changeVerdict(id, v) {
    const a = this.calls().find((x) => x.id === id); if (!a || !["accept", "flag"].includes(v)) return;
    const was = this.autonomy[id], p = this._pendingDecision;
    if (p && (this.pendingId(p) === id || (p.kind === "group" && (p.g.calls || []).some((c) => c.id === id)))) this.giveWay();
    if (was?.verdict === "own") { const about = `On what the agent decided: ${a.chose || a.id}`; this.annotations = this.annotations.filter((x) => !(x.kind === "note" && x.about === about && x.comment === was.own)); this.persist(); this.renderList(); }
    this.recordVerdict(a, v);
    this.$(`[data-reverdict^="${CSS.escape(id)}:"]`)?.focus({ preventScroll: true });
    this.status(`${String(id).toUpperCase()} ${v === "accept" ? "accepted" : "flagged for discussion"}`);
  }
  // After a review is sent from this page (to the review server, or to Claude from the hosted page), what changed
  // since — a comment's words edited in the record, a comment added or removed, an answer changed — is offered as a new
  // send: in the Finish panel's sent block (postedBlock, sendBlock: refreshed here, as the edit is kept), and at the top
  // of the record while that panel is closed or folded. The same act either way, "Send the change".
  syncResend() {
    const el = this.$?.(".resend"); if (!el) return;
    const p = this._posted, s = this._sent, hosted = !!this._claudeDb && !!this.reviewTarget();
    const sent = hosted ? s : p?.state === "sent" ? p : null, on = !!sent?.what && this.reviewSig() !== sent.what;
    const box = this.$(".handoff"), open = !!box && !box.hidden;
    if (open && sent) {
      const d = box.querySelector(".send.done"), html = (hosted ? this.sendBlock() : this.postedBlock()).trim();
      if (d && d._html !== html) { const t = document.createElement("template"); t.innerHTML = html; const n = t.content.firstElementChild; if (n) { n._html = html; d.replaceWith(n); } }
      const sum = box.querySelector(".hsum"); if (sum) sum.textContent = this.handoffSum();
    }
    el.hidden = !on || (open && !box.classList.contains("folded"));
    const act = hosted ? "send" : "send-local";
    if (!el.hidden && el.querySelector("button")?.dataset.act !== act) el.innerHTML = `Your review changed after it was sent.<button class="lnk" data-act="${act}">Send the change</button>`;
  }
  // One fact per line. This line says what is happening NOW and nothing else. Every other fact has a
  // place that already owns it: the step is the lit row in Steps, the part is the lit label under the
  // scrub, the count of marks is on Comments, the count of calls is on Decisions, and the verdict is
  // in the Finish button's tooltip.
  updateStatus() {
    const at = this.$(".composer .at"); if (at) at.textContent = this.fmt(this.player?.currentTime || 0);
    const el = this.$?.(".status"); if (!el) return;
    const t = this.player?.currentTime ?? this._lastT;
    const p = this._pendingDecision;
    let now;
    if (!this.stage?.dataset.ready) now = "Loading the video";
    else if (!this.stage.dataset.started) now = "Not started";
    else if (p) {
      const what = p.kind === "quiz" ? "the quick check" : p.kind === "autonomy" || p.kind === "group" ? "your answer on what the agent chose" : `question ${this.choiceNo(p)}`;
      now = this.isAnswered(p) ? `Back at ${what} at ${this.fmt(t)}, answered` : this._folded ? `Folded: ${what} at ${this.fmt(t)} still waits` : `Waiting at ${this.fmt(t)} for ${what}`;
    }
    else now = `${this.player.paused ? "Paused" : "Playing"} at ${this.fmt(t)}`;
    const notice = this._notice && Date.now() < this._notice.until ? this._notice.text : (this._notice = null);
    el.textContent = notice ? `${now} · ${notice}` : now;
    // Playing / Paused at 0:40 repeats the Play button, so it is read out but not shown; a wait, or a
    // few seconds' confirmation of an act, is shown (the notice alone: the clock already has the time)
    const show = p && !this.isAnswered(p) && this.stage?.dataset.started ? "wait" : notice ? "notice" : "";
    if (show === "notice") el.textContent = notice.charAt(0).toUpperCase() + notice.slice(1);
    el.title = el.textContent;
    if ((el.dataset.show || "") !== show) { if (show) el.dataset.show = show; else delete el.dataset.show; this.layoutParts(); }
    if (show === "notice") { clearTimeout(this._noticeT); this._noticeT = setTimeout(() => this.updateStatus(), Math.max(50, this._notice.until - Date.now() + 20)); }
    this.syncFinish();
  }
  // the Finish button's tooltip says the verdict picked so far
  syncFinish() {
    const b = this.$('[data-act="finish"]'); if (!b) return;
    b.textContent = "Finish review";
    b.title = this.isExplainer ? (EXPLAINER_ENDS[this.verdict] ? `Your end: ${EXPLAINER_ENDS[this.verdict].label} — click to send it, or change it` : "Finish: Done, Explain more, or Plan this")
      : this.verdict === "approve" ? "Your verdict: approve — click to send it, or change it"
      : this.verdict === "changes" ? "Your verdict: request changes — click to send it, or change it"
      : "Finish the review: approve the plan, or send it back with your comments";
  }
  // The verdict: approve the plan as it stands, or send it back. A review with words in it is
  // almost always the second, which is why that is what Finish offers first when there are any.
  // read per video: the first read can come before src is set, and a verdict belongs to one video
  get verdict() { if (this._verdictFor !== this.src) { this._verdictFor = this.src; try { this._verdict = localStorage.getItem(this.rkey + ":verdict") || null; } catch { this._verdict = null; } } return this._verdict; }
  hasWords() { return this.annotations.some((a) => a.kind !== "approve" && (a.comment || "").trim()) || Object.values(this.decisions).some((d) => d.option === "own" || d.option === "unclear") || Object.values(this.quizzes).some((q) => (q.note || "").trim() || q.unclear); }
  setVerdict(v) {
    // an explainer's pick belongs to its end: another end drops it, and its words while they are still the pick's
    const np = this.isExplainer ? this.nextPick() : null;
    if (np && np.end !== v) { if ((this.annotations.find((a) => a.open)?.comment || "") === np.text) this.setOpenWords(""); this.setNextPick(null); }
    this._verdict = v; this._verdictFor = this.src;
    try { localStorage.setItem(this.rkey + ":verdict", v); } catch {}
    // a review without a verdict is read as approved by its "approve" mark (lib/reviews.mjs verdictOf); keep exactly one, and only when approving
    this.annotations = this.annotations.filter((a) => a.kind !== "approve");
    if (v === "approve") this.add({ kind: "approve" }); else { this.persist(); this.renderList(); }
    this.syncFinish(); this.updateStatus(); this.syncResend();
  }

  // ---- UI -------------------------------------------------------------------
  // One mark tool with a shape, rather than three tools. The shape row is only shown while marking,
  // and the last shape is remembered so turning Mark back on resumes where the reviewer left off.
  // Select and Erase sit in the same row but are not shapes: Mark (D) resumes the last shape drawn.
  setTool(t) {
    this.tool = t || null;
    if (this.DRAWN.includes(t)) this._shape = t;
    if (this.tool !== "select") this.deselect();
    if (this.tool !== "erase") { this._eraserAt = null; this._erasePreview = null; }
    delete this.canvas.dataset.over;
    this.stage.dataset.tool = this.tool || "";
    this.shadowRoot.querySelectorAll(".shapes [data-tool]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.tool === this.tool)));
    const mb = this.$(".markbtn"); if (mb) mb.setAttribute("aria-pressed", String(!!this.tool));
    this.$(".toolbar").classList.toggle("marking", !!this.tool); this.syncToolbar();
    if (this.tool) this.player.pause();
    this.redraw();
  }

  onClick(e) {
    // an underlined word: what it means, and nothing else (it may sit inside an option's button)
    const term = e.target.closest?.(".term[data-term]");
    if (term) { e.preventDefault(); this.showTerm(term); return; }
    if (!e.target.closest?.(".tpop")) this.hideTerm();
    // the plan text's link to the full guide: with the guide under the video (D-264), down to it, never another page
    const gf = e.target.closest?.("[data-guide-full]"); if (gf && this._under && !(e.button || e.metaKey || e.ctrlKey || e.shiftKey)) { e.preventDefault(); this.openUnder(null, { pause: false }); return; }
    // the question's heading and a choice's card show their "More" on a click too; a click anywhere else puts it away
    const mh = e.target.closest?.(".hits .qhit, .hits .cring"); if (mh) { this.openMore(mh.dataset.more); return; }
    if (!e.target.closest?.(".fpop, .cmore")) this.closeMore();
    // a drawn mark's row in the record: anywhere on it but its words and its remove link selects it on its frame
    const row = e.target.closest?.(".ann[data-selmark]");
    if (row && !e.target.closest("textarea, [data-del], [data-copy]")) { this.selectFromRecord(row.dataset.selmark); return; }
    const head = e.target.closest?.("[data-plan-head]");
    if (head && !e.target.closest("button")) { const sel = this.shadowRoot.getSelection?.() || document.getSelection(); if (!String(sel || "").trim()) this.jumpToStep(Number(head.dataset.planHead)); return; }
    const b = e.target.closest("button"); if (!b) return;
    // the confusion guard is shown once a round: a verdict picked, a send, or the panel closed puts it away
    if (this._guardSeen && (b.dataset.review || ["handoff-close", "send", "send-local", "download"].includes(b.dataset.act))) this.setGuardDone();
    if (b.dataset.copy) { this.copyOne(b); return; }
    if (b.dataset.openDetail) { this.openDetail(this.detailNamed(b.dataset.openDetail)); return; }
    if (b.dataset.guideNote) { this.goGuideNote(b.dataset.guideNote); return; }
    if (b.dataset.dverdict) { this.detailVerdict(b.dataset.dverdict); return; }
    if (b.dataset.planJump) { this.jumpToStep(Number(b.dataset.planJump)); return; }
    if (b.dataset.review) { this.setVerdict(b.dataset.review); this.showHandoff({ finishing: this._finishing }); return; } // data-verdict is the walkthrough's Accept/Flag
    if (b.dataset.next) { this.pickNext(b.dataset.next); return; }   // an explainer's Finish: one of this video's suggestions
    if (b.dataset.tool) { this.setTool(this.tool === b.dataset.tool ? null : b.dataset.tool); return; }
    if (b.dataset.part != null) { this.goPart(Number(b.dataset.part)); return; }
    if (b.dataset.hit) { this.answerOnFrame(b.dataset.hit); return; }
    if (b.dataset.more) { this.openMore(b.dataset.more); return; }
    if (b.dataset.pick) { this.togglePick(b.dataset.pick); return; }
    if (b.dataset.quiz) { this.answerQuiz(b.dataset.quiz); return; }
    if (b.dataset.verdict) { this.judgeAutonomy(b.dataset.verdict); return; }
    if (b.dataset.gflag) { this.flagInGroup(b.dataset.gflag); return; }
    if (b.dataset.sverdict) { const i = b.dataset.sverdict.lastIndexOf(":"); this.judgeInStop(b.dataset.sverdict.slice(0, i), b.dataset.sverdict.slice(i + 1)); return; }
    if (b.dataset.sown) { this.openOwnFor(b.dataset.sown); return; }
    if (b.dataset.gaccept) { this.acceptGroup(); return; }
    if (b.dataset.choose) { this.choose(b.dataset.choose); return; }
    // the record edits in place: an answer, a pick-all answer's picks, a call's verdict
    if (b.dataset.redit) { this.editAnswer(this._editing === b.dataset.redit ? null : b.dataset.redit); return; }
    if (b.dataset.set) { const [id, o] = b.dataset.set.split(":"), d = (this.planMap?.decisions || []).find((x) => x.id === id); if (d?.kind === "multi") b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); else this.changeAnswer(id, { option: o }); return; }
    if (b.dataset.setmulti) { const id = b.dataset.setmulti; this.changeAnswer(id, { options: [...b.closest(".redit").querySelectorAll('.ropt[aria-pressed="true"]')].map((x) => x.dataset.set.split(":")[1]) }); return; }
    if (b.dataset.reverdict) { const [id, v] = b.dataset.reverdict.split(":"); this.changeVerdict(id, v); return; }
    if (b.dataset.back) { this.backToExplained(b.dataset.back); return; }
    if (b.dataset.point) { const i = b.dataset.point.indexOf(":"); this.openPoint(b.dataset.point.slice(0, i), b.dataset.point.slice(i + 1)); return; }
    if (b.dataset.annGo) { this.goAnn(b.dataset.annGo); return; }   // (before data-jump, which the same button carries)
    if (b.dataset.jump) { this._byHand = true; this.start(); this.toFrame(); this.player.seek(Number(b.dataset.jump)); this.player.pause(); return; }
    if (b.dataset.lr != null) { this.goLast(Number(b.dataset.lr)); return; }
    if (b.dataset.lrGuide != null) { this.goLastGuide(Number(b.dataset.lrGuide)); return; }
    if (b.dataset.del) { if (b.dataset.del === this._sel) this.deselect(); this.annotations = this.annotations.filter((a) => a.id !== b.dataset.del); this.persist(); this.renderList(); this.redraw(); this.syncClear(); this.updateStatus(); return; }
    switch (b.dataset.act) {
      case "mark": this.setTool(this.tool ? null : this._shape || "stroke"); break;
      case "theme": this.toggleTheme(); break;
      case "checks": this.toggleChecks(); break;
      case "marks": this.toggleMarks(); break;
      case "post": this.postComment(); break;
      case "own": this.openOwn(); break;
      case "unclear": this.askUnclear(); break;
      case "own-save": this.answerOwn(); break;
      case "band-read": this.readBand(); break;
      case "confirm": this.confirmMulti(); break;
      case "only": this.toggleOnly(); break;
      case "fold": this.fold(true); break;
      case "unfold": this.fold(false); break;
      case "pull": this.togglePull(); break;
      case "plantext": this.togglePlanText(); break;
      case "quiz-go": this.skipWait(); break;
      case "walk": this.openWalk(); break;
      case "rowmore": { const box = this.$(".decision"); box.classList.toggle("rowopen"); this.layoutFrame(); break; }
      case "walk-read": this.readWalk(); break;
      case "terms": this.toggleTerms(); break;
      case "ask": if (this._topen?.mode === "ask") this.closeTerms(); else this.openAsk(); break;
      case "ask-send": this.askSend(); break;
      case "ask-stop": this._askCtl?.abort(); break;
      case "ask-term": { const x = this.termFor(b.dataset.term); this.hideTerm(); this.openAsk({ prefill: x ? `What does "${this.termTitle(x)}" mean here?` : "" }); break; }
      case "before-toggle": this._beforeOpen = !this._beforeOpen; this.renderBefore(); break;
      case "guard-walk": this.walkMissed(); break;
      case "guard-ask": this.askAgainMissed(); break;
      case "quiz-back": { const p = this._pendingDecision; if (p?.kind === "quiz") this.backToExplained(p.q.id); break; }
      case "mute": this.setMuted(!this.muted); break; // the button's own icon says which; no status line needed
      case "speed": this.speedPop(); break;
      case "size": this.sizePop(); break;
      case "size-fit": this.setSize(100); this.status("Video size: Fit"); this.$("[data-sizer]")?.focus({ preventScroll: true }); break;   // the keyboard stays in the drag (Fit is disabled at Fit)
      case "poster-play": this.$('[data-act="play"]').click(); break;
      // the guide under the video (D-264): down to it (the video goes on, small), and the small player's own buttons
      case "guide": this.openUnder(null, { pause: false }); break;
      case "mini-play": if (this._pendingDecision && !this.isAnswered()) this.backToVideo(); else this.$('[data-act="play"]').click(); break;
      case "mini-up": this.backToVideo(); break;
      case "play": // the runtime queues a play until its assets are ready; the first play from the poster starts at 0
        if (!this.player.paused) { this.player.pause(); break; }
        if (this.isAnswered()) { this.skipWait(); break; }   // an answered sheet: Play is Continue, not a video running under it
        if (this._pendingDecision && this._folded) { const at = this.pendingAt(); if (at != null && (this.player.currentTime || 0) >= at - 0.05) { this.unfoldAt(); break; } }
        if (!this.stage.dataset.started && this._posterT != null && Math.abs((this.player.currentTime || 0) - this._posterT) < 0.25) this.player.seek(0);
        // just the changes, first play: from where the playhead is when that beat changed (the reviewer may
        // have moved it before pressing Play), else from the next changed beat after it
        if (this._only && !this.stage.dataset.started) { const t = this.player.currentTime || 0, cur = this.frameAt(t); if (!(t > 0.05 && cur && !this.skips(cur.index))) { const f = this.nextChangedFrom(t > 0.05 ? t : -1); if (f) { this.start(); this.jumpToChanged(f); } } }
        this.player.play(); break;
      case "ch-next": { this.$('.chend').classList.remove('on'); const chs = this.planMap?.chapters || []; const cur = this.chapterAt(this.player.currentTime); const nxt = chs[chs.indexOf(cur) + 1]; if (nxt) this.player.seek(nxt.start + 0.05); this.player.play(); break; }
      case "ch-stay": this.$('.chend').classList.remove('on'); this.updateStatus(); break;
      case "undo": this.annotations.pop(); this.persist(); this.renderList(); this.redraw(); this.syncClear(); this.updateStatus(); break;
      case "clear": this.clearMarks(); break;
      case "unclear": this.restoreMarks(); break;
      case "copy": this.copyText(); break;
      case "copy-close": { const c = this.$(".copyout"); if (c) c.hidden = true; break; }
      case "export": this.export(); break;
      case "send": this.sendToClaude(); break;
      case "handoff-copy": this.copyHandoff(); break;
      case "handoff-close": this.$(".handoff").hidden = true; this.syncResend(); this.focus(); break;
      case "handoff-fold": this.foldHandoff(!this._hfold); break;
      case "download": this.export(); break;
      case "detail-open": this.openDetailFrom("chip"); break;
      case "dmark-open": this.openDetailFrom("frame"); break;
      case "detail-close": this.closeDetail(); break;
      case "dc-save": this.saveDetailComment(); break;
      case "dc-edit": this.detailEditMode(); break;
      case "dc-ask": this.askFromDetail(); break;
      case "dc-discard": this.closeDetailComment(false); break;
      case "finish": if (!this.verdict || (this.isExplainer && !EXPLAINER_ENDS[this.verdict])) this.setVerdict(this.isExplainer ? "done" : this.hasWords() ? "changes" : "approve"); this.showHandoff({ finishing: true, fold: false }); this.refreshLocal(); break;
      case "send-local": this.postLocal(); break;
      case "work-dismiss": this.dismissWork(); break;
      case "ready-watch": case "work-reload": this.reloadForNew(); break;
      case "ready-later": this.closeReady(); break;
    }
  }
  onKey(e) {
    // Escape backs out of whatever is toggled on, one step at a time — it has to run even from
    // inside a textarea, which is why it comes before the guard below.
    if (e.key === "Escape") { this.onEscape(); return; }
    if (e.key === "Tab" && this.tabHop(e)) return;
    // Typing is not a command. The listener sits on the host, so e.target is the host itself for any
    // key pressed inside the shadow root (a comment box, the own-words answer, a note to Claude):
    // the element actually under the keystroke is the first entry of the composed path.
    const el = e.composedPath()[0] || e.target;
    if (/^(TEXTAREA|INPUT|SELECT)$/.test(el.tagName) || el.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;   // the browser's own shortcuts (copy, reload…) are not ours
    // an underlined word has the keyboard: Enter or space says what it means
    if ((e.key === "Enter" || e.key === " ") && el.matches?.(".term[data-term]")) { e.preventDefault(); this.showTerm(el); return; }
    // the Terms are open: the video's keys wait behind them, as behind a detail. G (or Esc) closes them.
    if (this._topen) { if (this._topen.mode === "ask" ? e.key === "q" || e.key === "Q" : e.key === "g" || e.key === "G") { e.preventDefault(); this.closeTerms(); } return; }
    // A detail is open: the video's keys wait behind it. O (or Esc) closes it; nothing else plays,
    // draws or answers underneath a page the reviewer is reading.
    // A and B are the panel's own: the verdict on the call the page belongs to, when it has one.
    if (this._dopen) {
      if (e.key === "o" || e.key === "O") { e.preventDefault(); this.closeDetail(); }
      else if (/^[ab]$/i.test(e.key) && !this.$(".dcall").hidden) { e.preventDefault(); this.detailVerdict(e.key.toLowerCase() === "a" ? "accept" : "flag"); }
      return;
    }
    // parts: Shift+arrows as well as N / P, because arrows are where people look for "next"
    if (e.shiftKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); this.jumpPart(e.key === "ArrowRight" ? 1 : -1); return; }
    // and the arrows alone scrub, 5 s at a time, as on every video site; a question waiting stays up
    // over the frame, as it does under a scrub, and an answered one goes (jump)
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); this.seekBy(e.key === "ArrowRight" ? 5 : -5); return; }
    // A question is waiting: its letters answer it. A–D pick an option (tick one, on a pick-all
    // question, and Enter confirms); on a call the agent made, A accepts and B flags; O opens an
    // answer in your own words. While it waits, A–D are never the drawing tools and C never copies
    // — fold the question away first to mark the frame it is about.
    const p = this._pendingDecision;
    if (p && !this._folded && this.$(".decision").classList.contains("on")) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, open = this.asking();
      if (/^[a-d]$/.test(k)) {
        e.preventDefault();
        if (!open) return;   // a quick check already answered, counting down: the letters are still not tools
        if (p.kind === "quiz") { if (p.q.options.some((o) => o.id === k)) this.answerQuiz(k); }
        else if (p.kind === "autonomy") { if (k === "a") this.judgeAutonomy("accept"); else if (k === "b") this.judgeAutonomy("flag"); }
        else if (p.kind === "group" && p.g.stop) { const c = this.stopWaiting(p.g); if (c && (k === "a" || k === "b")) this.judgeInStop(c.id, k === "a" ? "accept" : "flag"); }
        else if (p.kind === "group") { if (k === "a") this.acceptGroup(); }
        else if (p.options.some((o) => o.id === k)) { if (p.kind === "multi") this.togglePick(k); else this.choose(k); }
        return;
      }
      if (k === "o" && open && p.kind === "group" && p.g.stop) { const c = this.stopWaiting(p.g); if (c) { e.preventDefault(); this.openOwnFor(c.id); } return; }
      if (k === "o" && open && p.kind !== "group") { e.preventDefault(); this.openOwn(); return; }
      if (e.key === "?" && open && this.isDec(p)) { e.preventDefault(); this.askUnclear(); return; }
      if ((k === "s" || k === "x") && open) { e.preventDefault(); return; }   // nor are Select and the eraser while it waits
      if (e.key === "Enter" && el.dataset?.act === "quiz-go") return;   // Continue has the keyboard: Enter presses it
      if (e.key === "Enter" && this.isDec(p) && p.kind === "multi") { e.preventDefault(); this.confirmMulti(); return; }
    }
    // The shapes have no buttons of their own until Mark is on, so the keys drive the tool directly
    // rather than clicking chrome that may not be in the DOM.
    // S and X are the two tools that act on marks already drawn (E is export, so the eraser is X).
    const map = { d: "stroke", a: "arrow", b: "box", s: "select", x: "erase" };
    if ((e.key === "Delete" || e.key === "Backspace") && this._sel) { e.preventDefault(); this.deleteSelected(); return; }
    if (map[e.key]) { const t = map[e.key]; this.setTool(this.tool === t ? null : t); }
    else if (e.key === "n" || e.key === "N") this.jumpPart(1);
    else if (e.key === "p" || e.key === "P") this.jumpPart(-1);
    else if (e.key === "o" || e.key === "O") { if (this.detailAt(this.watchedT())) { e.preventDefault(); this.openDetailFrom(); } }
    else if (e.key === "t") this.toggleTheme();
    else if (e.key === "k" || e.key === "K") { if (!this.$(".checksbtn").hidden) { e.preventDefault(); this.toggleChecks(); } }
    else if (e.key === "v" || e.key === "V") { e.preventDefault(); this.toggleMarks(); }
    else if (e.key === "g" || e.key === "G") { if (!this.$(".termsbtn").hidden) { e.preventDefault(); this.openTerms(); } }
    else if (e.key === "q" || e.key === "Q") { e.preventDefault(); this.openAsk(); }
    else if (e.key === "l" || e.key === "L") { if (!this.$(".plantext").hidden) this.togglePlanText(); }
    else if (e.key === "m") this.$('[data-act="mute"]').click();
    else if (e.key === "/") { e.preventDefault(); this.focusComment(); }
    else if (e.key === "z") { this.annotations.pop(); this.persist(); this.renderList(); this.redraw(); this.syncClear(); this.updateStatus(); }
    else if (e.key === "e") this.$('[data-act="export"]').click();
    else if (e.key === "c") this.copyText();
    else if (e.key === "u") this.restoreMarks();
    else if (e.key === "[") this.nudgeSpeed(-0.25);
    else if (e.key === "]") this.nudgeSpeed(0.25);
    else if (e.key === "-" || e.key === "_") { e.preventDefault(); this.nudgeSize(-1); }   // [ ] are the speed's, so the size is - and = (the browser's own zoom, Ctrl+- / Ctrl+=, is left alone above)
    else if (e.key === "=" || e.key === "+") { e.preventDefault(); this.nudgeSize(1); }
    else if (e.key === " ") { e.preventDefault(); if (this.isAnswered()) this.skipWait(); else this.$('[data-act="play"]').click(); }
  }
  // The thing's button sits in the picture's layer (so it moves with the picture zoomed past Fit), which comes
  // before the controls in the page; in the tab order it comes after Play: Tab from Play reaches it,
  // Tab from it goes on to what follows Play, and Shift+Tab walks the same way back.
  tabHop(e) {
    const layer = this.$(".dmark"), btn = layer?.querySelector(".dhit"), play = this.$('[data-act="play"]'); if (!btn || !play || layer.hidden) return false;
    const el = e.composedPath()[0];
    const list = [...this.shadowRoot.querySelectorAll('button, [href], input, select, textarea, [tabindex]')].filter((x) => x !== btn && !x.disabled && x.tabIndex >= 0 && x.getClientRects().length > 0 && !x.closest("[hidden]"));
    const after = list[list.indexOf(play) + 1] || null;
    const to = !e.shiftKey && el === play ? btn : e.shiftKey && el === btn ? play : !e.shiftKey && el === btn ? after : e.shiftKey && el === after ? btn : null;
    if (!to) return false;
    e.preventDefault(); to.focus({ preventScroll: true });
    return true;
  }
  // One Escape, one step back — the same order a reviewer opened things in, undone in reverse.
  // A question itself does not close this way: fold/unfold are its own explicit act.
  onEscape() {
    if (this.closeReady()) return;   // "The new version is ready": Later
    if (this.speedPop(false)) { this.focus(); return; }
    if (this.sizePop(false)) { this.focus(); return; }
    if (this.hideTerm()) return;   // what a word means, shown by it
    if (this.closeMore()) return;   // a card's "More"
    if (this._topen) { this.closeTerms(); return; }
    if (this.closeMarkBox(true, true)) return;   // Escape keeps what was typed; only the × discards it
    if (this.closeDetailComment(true)) return;    // the same in a detail: Escape keeps the comment
    if (this._dopen) { this.closeDetail(); return; }
    const note = this.$(".decision [data-note]");
    if (this.shadowRoot.activeElement === note) { note.blur(); this.focus(); return; }   // the note is kept
    const own = this.$(".own");
    if (own.classList.contains("open")) { own.classList.remove("open"); own.querySelector("textarea").value = ""; if (this._ownFor) { own.hidden = true; this._ownFor = null; } this.focus(); return; }
    if (this._editing) { this.editAnswer(null); return; }   // an answer's editor in the record closes, unchanged
    const handoff = this.$(".handoff");
    // folded to its line under the Record bar, it stays: Escape puts the record away
    if (handoff && !handoff.hidden && !handoff.classList.contains("folded")) { if (this._guardSeen) this.setGuardDone(); handoff.hidden = true; this.syncResend(); this.focus(); return; }
    const copyout = this.$(".copyout");
    if (copyout && !copyout.hidden) { copyout.hidden = true; this.focus(); return; }
    if (this.shadowRoot.activeElement === this.$(".composer textarea")) { this.shadowRoot.activeElement.blur(); this.focus(); return; }
    if (this.deselect()) return;   // a selected mark lets go before the tool is put down
    if (this.tool) { this.setTool(null); return; }
    if (this.$(".wrap").classList.contains("pulled")) { this.closePull(); return; }
  }
  // the frame's title without its "Step n:" prefix (the key beside it already says the step)
  frameTitle(a) { const t = plainTitle(a.frame?.title || ""); const s = t.replace(/^step\s*\d+\s*[:—–-]\s*/i, ""); return s.charAt(0).toUpperCase() + s.slice(1); }
  label(a) { const s = a.plan?.step ? `step ${a.plan.step}` : a.plan?.component ? a.plan.component : a.frame ? `frame ${a.frame.index}` : "video"; return s; }
  fmt(t) { t = Number(t) || 0; return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`; }
  status(s) { this._notice = { text: s, until: Date.now() + 6000 }; this.updateStatus(); }
  persist() { try { localStorage.setItem(this.rkey, JSON.stringify(this.annotations)); } catch {} }

  // the steps, as the plan reads: a row per step, its beats beneath only while it is the current step (the other steps
  // are one row each; clicking a row seeks to its first frame), the opening and closing beats plain, the resolved plan
  // last. Every row is one frame (the tests count them). After a decision the declined branch's beat is dropped.
  renderGallery() {
    const g = this.$(".gallery"); const frames = this.planMap?.frames || [];
    this._groups = {}; // frame index -> step group id
    if (!frames.length) { g.innerHTML = `<p class="empty">No plan map for this video.</p>`; return; }
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const tag = (f) => f.change && ["added", "edited"].includes(f.change.status) ? ` data-changed="${f.change.status === "added" ? "new" : "changed"}"` : "";
    const row = (f, cls, title, gid) => `<button class="${cls}" data-jump="${f.start}" data-frame="${f.index}"${gid ? ` data-group="${gid}"` : ""}${tag(f)}>${/step/.test(cls) ? `<span class="n">${isStep(f) ? f.planStep : ""}</span>` : ""}<span class="t">${esc(plainTitle(title ?? f.title))}</span></button>`;
    const isStep = (f) => f.planStep != null && f.planStep !== 0;
    const first = frames.findIndex(isStep); let last = -1; frames.forEach((f, i) => { if (isStep(f)) last = i; });
    if (first < 0) { g.innerHTML = frames.map((f) => row(f, "beat")).join(""); this.syncGallery(); return; }
    const before = frames.slice(0, first), mid = frames.slice(first, last + 1), after = frames.slice(last + 1);
    let html = before.map((f) => row(f, "beat")).join("");
    const groups = []; let cur = null;
    for (const f of mid) { if (isStep(f) && f.planStep !== cur?.step) { cur = { step: f.planStep, frames: [] }; groups.push(cur); } cur.frames.push(f); }
    for (const grp of groups) {
      const gid = `s${grp.step}`; grp.frames.forEach((f) => { this._groups[f.index] = gid; });
      const head = grp.frames.find((f) => /^step\s*\d+\s*[:—–-]/i.test(f.title)) || grp.frames[0];
      html += row(head, "step", cap(head.title.replace(/^step\s*\d+\s*[:—–-]\s*/i, "")));
      html += grp.frames.filter((f) => f !== head).map((f) => row(f, "beat", null, gid)).join("");
    }
    // the closing beats are one group too, headed by the first of them: its other beats show while you
    // are in it, like a step's, so the rail stays a list of steps rather than every frame of the ending
    if (after.length) { after.forEach((f) => { this._groups[f.index] = "tail"; }); html += row(after[0], "step tail") + after.slice(1).map((f) => row(f, "beat", null, "tail")).join(""); }
    g.innerHTML = html; this.syncGallery();
  }
  syncGallery() {
    const f = this.frameAt(this.player.currentTime ?? this._lastT); const gid = f ? this._groups?.[f.index] : null;
    const declined = new Set(); // the branch frames a decision has excluded
    for (const d of this.planMap?.decisions || []) { const m = this.decisions[d.id]; if (m) for (const o of d.options) if (o.id !== m.option && o.branch) declined.add(o.branch.frameIndex); }
    const skp = this.checksOn ? null : this.checkScenes();
    this.shadowRoot.querySelectorAll(".gallery button").forEach((b) => { const i = Number(b.dataset.frame); b.classList.toggle("active", !!f && i === f.index); if (b.dataset.group) b.hidden = b.dataset.group !== gid || declined.has(i); b.classList.toggle("skp", !!skp?.has(i)); });
  }
  // A comment is the lightest mark there is: a timestamp and what you wanted to say at it. This is
  // the shape people already know from every video site — post at the playhead, and the timestamp is
  // a link back to the moment. `at` lets a question record the reviewer's words against the beat
  // that asked, rather than wherever the playhead drifted to.
  comment(text, at = null, about = "") {
    const t = at == null ? (this.player.currentTime || 0) : at;
    const a = this.add({ kind: "note", comment: text, about, t });
    this.persist(); this.renderList(); this.updateStatus();
    return a;
  }
  postComment() {
    const box = this.$(".composer textarea"); const text = box.value.trim(); if (!text) return;
    const a = this.comment(text);
    box.value = ""; box.style.height = "auto";
    this.status(`Comment at ${this.fmt(a.t)}`);
  }
  // The box is always on screen, so / is the only thing this needs — clicking it directly works too.
  focusComment() { const ta = this.$(".composer textarea"); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }

  renderList() {
    const l = this.$(".list"); this.$(".marks .count").textContent = this.annotations.length ? ` · ${this.annotations.length}` : "";
    l.innerHTML = this.annotations.length ? this.annotations.slice().reverse().map((a) => `<div class="ann"${a.path ? ` data-selmark="${a.id}" aria-current="${a.id === this._sel}"` : ""}><div class="hd"${a.path ? ' title="Show this mark on its frame, selected"' : ""}>${((pt) => pt ? `<button class="ts" data-point="${pt.kind}:${esc(pt.q.id)}" title="Open the question asked at this moment">` : `<button class="ts" data-ann-go="${esc(a.id)}" data-jump="${a.t}" title="Go to this moment on the video">`)(a.path ? null : this.points().find((p) => Math.abs(p.q.at - a.t) < 0.1))}${this.fmt(a.t)}</button>${a.detail ? `<span class="k">${a.via === "guide" && a.detail.where ? "guide" : esc(this.label(a))}</span>` : a.kind === "note" ? "" : `<span class="k">${KIND[a.kind] || a.kind} · ${esc(this.label(a))}</span>`}<span class="t">${a.detail ? this.whereInDetail(a) : esc(a.about || this.frameTitle(a))}</span>${a.kind !== "approve" ? `<button class="lnk cp" data-copy="ann:${esc(a.id)}" title="Copy this comment as one line of text" aria-label="Copy this comment">copy</button>` : ""}<button class="lnk" data-del="${a.id}" title="Remove this comment">remove</button></div>${a.via === "guide" && a.detail?.text ? `<p class="gq" title="The words you highlighted in the guide">“${esc(a.detail.text)}”</p>` : ""}${a.kind !== "approve" ? `<textarea rows="1" data-comment="${a.id}" ${a.path ? 'placeholder="Words for this mark" aria-label="The words on this mark — edit them here: Enter keeps the edit, Esc puts them back"' : 'placeholder="Add a comment" aria-label="Your comment — edit it here: Enter keeps the edit, Esc puts it back"'} title="Edit in place: Enter keeps it, Shift+Enter is a new line, Esc puts it back">${esc(a.comment || "")}</textarea>` : ""}</div>`).join("")
      : `<p class="empty">None yet. Type under the video, or press D to mark the frame.</p>`;
    const grow = (ta) => { ta.style.height = "auto"; ta.style.height = `${ta.scrollHeight}px`; };
    // A comment's words are edited where they are listed: Enter (or leaving the field) keeps the edit, Shift+Enter is a
    // new line, Esc puts back what was there. Kept, it is the same comment everywhere it shows: the words on its mark,
    // the line on the frame naming it, the guide's note, and what is sent (or offered to send again, after a send).
    const ann = (ta) => this.annotations.find((x) => x.id === ta.dataset.comment);
    l.querySelectorAll("textarea[data-comment]").forEach((ta) => { grow(ta); ta.addEventListener("input", () => grow(ta));
      ta.addEventListener("change", () => { const a = ann(ta); if (a && a.comment !== ta.value) { a.comment = ta.value; this.persist(); this.dispatchEvent(new CustomEvent("annotation", { detail: a })); this.commentEdited(a); this.syncResend(); } });
      ta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); const changed = ann(ta)?.comment !== ta.value; ta.blur(); this.focus({ preventScroll: true }); if (changed) this.status("comment edited — kept"); }
        else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); ta.value = ann(ta)?.comment || ""; grow(ta); ta.blur(); this.focus({ preventScroll: true }); }
      }); });
    this.syncPull();   // the peek's live count of comments moves with the list
    this.syncResend();
    this.syncCommentTicks(); this.syncMarks();
  }
  // A comment's words edited in the record: the frame shows the new words where it shows them (the mark's own box open
  // on it, the line naming it after a jump to it); the guide hears it from storage (its storage listener in guide-review.js)
  commentEdited(a) {
    const inp = this.$("[data-markword]");
    if (inp && this._markFor === a.id && this.shadowRoot.activeElement !== inp) { inp.value = a.comment || ""; this.growMarkWord(); }
    const pc = this.$(".partcard");
    if (pc?.classList.contains("on") && pc.dataset.ann === a.id) this.showNoteCard(pc.querySelector(".k").textContent, a.comment, a.id);
    this.redraw();
  }
  // A comment's line in the record, to its moment: the video (back in its place if it was small), paused there, the
  // comment said on the status line; a drawn mark is selected on its frame (selectFromRecord).
  goAnn(id) {
    const a = this.annotations.find((x) => x.id === id); if (!a) return;
    if (a.path) { this.selectFromRecord(id); return; }
    this._byHand = true; this.start(); this.toFrame(); this.player.seek(Number(a.t) || 0); this.player.pause();
    const w = String(a.comment || "").replace(/\s+/g, " ").trim();
    this.status(`Your comment at ${this.fmt(a.t)}${w ? `: ${w.length > 80 ? `${w.slice(0, 79)}…` : w}` : ""}`);
    this.showNoteCard(a.via === "guide" ? "Your comment, in the guide" : "Your comment", w, a.id);
  }
  // your comments and marks on the timeline: a short coral stroke at each one's moment (Marks: off hides them)
  syncCommentTicks() {
    const s = this.$?.(".scrub"); if (!s) return;
    s.querySelectorAll(".cmt").forEach((x) => x.remove());
    const dur = this.dur(); if (!dur) return;
    const head = s.querySelector(".head");
    for (const a of this.annotations) {
      if (a.kind === "approve" || !Number.isFinite(Number(a.t))) continue;
      const i = document.createElement("i"); i.className = "cmt"; i.dataset.ann = a.id; i.style.left = `${Math.max(0, Math.min(100, (a.t / dur) * 100)).toFixed(3)}%`;
      s.insertBefore(i, head);
    }
  }
  // the comment at a point of the timeline (within 5 px of its stroke), while they are shown
  annAtX(x, w, dur) {
    if (!this.marksOn || !w || !dur) return null;
    return this.annotations.filter((a) => a.kind !== "approve" && Number.isFinite(Number(a.t))).map((a) => ({ a, dx: Math.abs((a.t / dur) * w - x) })).filter((o) => o.dx <= 5).sort((p, q) => p.dx - q.dx)[0]?.a || null;
  }
  // Everything the reviewer said, as text. A downloaded annotations.json is useless where this page
  // is opened inside something that will not hand you the file — the point is to paste it into a
  // thread. navigator.clipboard is blocked in some sandboxed frames, so a failure is not an error:
  // it falls back to a selected textarea, which is what "copy" means when the API is unavailable.
  // One item of the record as one plain line, for pasting on its own:
  //   Q: <question> → <answer, or the reviewer's own words> (Note: <note>)
  //   <what the agent chose> → accepted | flagged | change: <the reviewer's words>
  //   <m:ss> · step n — <comment>
  lineFor(key) {
    const i = key.indexOf(":"), kind = key.slice(0, i), id = key.slice(i + 1), pm = this.planMap || {};
    if (kind === "dec") {
      const m = this.decisions[id]; if (!m) return null; const d = (pm.decisions || []).find((x) => x.id === id);
      const ans = this.isUnclear(m) ? "not answered: explain this more" : m.option === "multi" ? (m.labels || []).join(", ") || m.label : m.label || m.option;
      return `Q: ${d?.question || m.question || id} → ${ans}${m.note ? ` (${this.isUnclear(m) ? "What is unclear" : "Note"}: ${m.note})` : ""}`;
    }
    if (kind === "quiz") {
      const r = this.quizzes[id]; if (!r) return null; const q = (pm.quizzes || []).find((x) => x.id === id);
      const lab = (o) => (q?.options || []).find((x) => x.id === o)?.label || o;
      const ans = r.answer === "own" ? r.own : lab(r.answer);
      return `Q: ${q?.question || id} → ${ans}${r.answer === "own" ? "" : r.correct ? " (right)" : ` (not quite: it is ${lab(q?.answer)})`}${r.note ? ` (Expected something else: ${r.note})` : ""}${r.unclear ? " (asked to have it explained again)" : ""}`;
    }
    if (kind === "call") {
      const r = this.autonomy[id]; if (!r) return null; const a = this.calls().find((x) => x.id === id);
      return `${a?.chose || r.chose || id} → ${r.verdict === "accept" ? "accepted" : r.verdict === "flag" ? "flagged" : r.verdict === "listed" ? "listed, not judged" : `change: ${r.own || ""}`}`;
    }
    if (kind === "ann") {
      const a = this.annotations.find((x) => x.id === id); if (!a) return null;
      if (a.via === "guide" && a.detail?.where) return `In the guide, ${a.detail.where}${a.detail.text ? `, on “${a.detail.text}”` : ""} — ${(a.comment || "").trim() || "(highlighted)"}`;
      return `${this.fmt(a.t)}${a.plan?.step ? ` · step ${a.plan.step}` : ""}${a.detail ? ` · in detail ${a.detail.name} at ${a.detail.anchor}` : ""} — ${(a.comment || "").trim() || KIND[a.kind] || a.kind}`;
    }
    return null;
  }
  async copyOne(b) {
    const text = this.lineFor(b.dataset.copy); if (text == null) return;
    try {
      await navigator.clipboard.writeText(text);
      clearTimeout(b._copied); b.textContent = "Copied"; b.dataset.copied = "";
      b._copied = setTimeout(() => { b.textContent = "copy"; delete b.dataset.copied; }, 1500);
      this.status("copied one line as text");
    } catch { this.showCopyFallback(text); }
  }
  reviewText() {
    const L = [];
    const title = this.planMap?.title || this.planMap?.project || "Plan review";
    L.push(`# ${title} — review`, "");
    const dec = Object.entries(this.decisions);
    if (dec.length) {
      L.push("## Decisions", "");
      for (const [id, v] of dec) {
        const d = (this.planMap?.decisions || []).find((x) => x.id === id);
        const q = d?.question || id;
        const step = d?.planStep ? ` · step ${d.planStep}` : "";
        L.push(`**${q}**${step}`);
        L.push(v.option === "own" ? `→ in my own words: ${v.label}` : v.option === "unclear" ? "→ not answered: explain this more" : v.option === "multi" ? `→ ${v.label} (all that apply)` : `→ ${v.label || v.option}`);
        if (v.note) L.push(`  ${v.option === "unclear" ? "What is unclear" : "Note"}: ${v.note}`);
        L.push("");
      }
    }
    const checks = Object.keys(this.quizzes).map((id) => this.lineFor(`quiz:${id}`)).filter(Boolean);
    if (checks.length) L.push("## Quick checks", "", ...checks.map((c) => `- ${c}`), "");
    const notes = this.annotations.filter((a) => a.comment);
    if (notes.length) {
      L.push("## Comments", "");
      for (const a of notes) L.push(a.via === "guide" && a.detail?.where ? `- **In the guide**, ${a.detail.where}${a.detail.text ? `, on “${a.detail.text}”` : ""} — ${a.comment}`
        : `- **${this.fmt(a.t)}**${a.plan?.step ? ` · step ${a.plan.step}` : ""}${a.detail ? ` · in detail \`${a.detail.name}\` at \`${a.detail.anchor}\`` : ""} — ${a.comment}`);
      L.push("");
    }
    const marks = this.annotations.filter((a) => !a.comment);
    if (marks.length) {
      L.push("## Marks", "");
      for (const a of marks) L.push(`- **${this.fmt(a.t)}**${a.plan?.step ? ` · step ${a.plan.step}` : ""} — ${a.kind}`);
      L.push("");
    }
    if (!dec.length && !this.annotations.length) L.push("_Nothing recorded yet._", "");
    return L.join("\n").trim() + "\n";
  }
  async copyText() {
    const text = this.reviewText();
    try {
      await navigator.clipboard.writeText(text);
      const n = Object.keys(this.decisions).length, m = this.annotations.length;
      this.status(`copied ${n} decision${n === 1 ? "" : "s"} and ${m} mark${m === 1 ? "" : "s"} as text`);
      const b = this.$('[data-act="copy"]'); if (b) { b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy"; }, 1600); }
    } catch {
      this.showCopyFallback(text);
    }
  }
  // The clipboard was refused. Put the text on screen, selected, so ⌘C still works.
  showCopyFallback(text) {
    let box = this.$(".copyout");
    if (!box) {
      box = document.createElement("div"); box.className = "copyout";
      box.innerHTML = '<p></p><textarea readonly rows="10"></textarea><button data-act="copy-close">Done</button>';
    }
    // where the reviewer is looking: the finishing sheet hides the lists, so a fallback for its
    // commands goes inside it
    const handoff = this.$(".handoff");
    (handoff && !handoff.hidden ? handoff : this.$(".marks")).appendChild(box);
    box.querySelector("p").textContent = "This page cannot reach the clipboard, so here it is — select all and copy.";
    const ta = box.querySelector("textarea"); ta.value = text; box.hidden = false;
    ta.focus(); ta.select();
    this.status("the clipboard is blocked here — the text is selected below");
  }

  // Clearing the drawings is not clearing the review: notes, comments, decisions and approvals stay.
  // It is also recoverable — the cleared set is held so U can put it back exactly, ids, times and
  // frame anchors included, rather than making the reviewer redraw from memory. Deleting a selected
  // mark and each eraser gesture go on the same stack: one U puts back one clear, one delete, or
  // everything one drag of the eraser took, each mark at the place in the list it came from.
  DRAWN = ["stroke", "arrow", "box"];
  clearMarks() {
    const gone = this.removeMarks(this.annotations.filter((a) => this.DRAWN.includes(a.kind)));
    if (!gone.length) return;
    if (gone.some((g) => g.a.id === this._sel)) this.deselect();
    this.pushUndo(gone); this.afterMarksChanged();
    this.status(`cleared ${gone.length} mark${gone.length === 1 ? "" : "s"} — press U to put them back`);
  }
  // takes the given marks out of the list, newest position first, and says where each one was
  removeMarks(list) {
    const ids = new Set(list.map((a) => a.id)), gone = [];
    for (let i = this.annotations.length - 1; i >= 0; i--) if (ids.has(this.annotations[i].id)) { gone.push({ a: this.annotations[i], i }); this.annotations.splice(i, 1); }
    return gone;
  }
  pushUndo(gone) { if (gone.length) (this._undo ||= []).push(gone); }
  afterMarksChanged() { this.persist(); this.renderList(); this.redraw(); this.syncClear(); this.updateStatus(); }
  restoreMarks() {
    const back = this._undo?.pop(); if (!back?.length) return;
    for (const { a, i } of back.slice().reverse()) this.annotations.splice(Math.min(i, this.annotations.length), 0, a);
    this.afterMarksChanged();
    this.status(`put ${back.length} mark${back.length === 1 ? "" : "s"} back`);
  }
  syncClear() {
    const b = this.$('[data-act="clear"]'); if (!b) return;
    const n = this.annotations.filter((a) => this.DRAWN.includes(a.kind)).length;
    // Hiding a focused element drops focus to <body>, which is outside this component and breaks
    // every keyboard shortcut after it (U included) — the button vanishing from under the reviewer's
    // hand should not also cost them the keyboard. Keep focus inside the component when that happens.
    const hadFocus = !n && this.shadowRoot.activeElement === b;
    b.hidden = !n;
    b.textContent = `Clear ${n}`;
    this.syncMarks();
    this.syncToolbar();
    if (hadFocus) this.focus();
  }
  // Marks on the video, on or off (the Marks switch beside Clear, or V): your marks drawn on the frame and your
  // comments' strokes on the timeline. On unless this viewer turned them off (rp:marks, per viewer like the quick
  // checks). Off hides them on the video only: the record still lists every one, a mark you select (or draw, or
  // erase: any tool on) is drawn, and a line in the record still goes to its moment.
  get marksOn() {
    if (this._marksPick === undefined) { let v = null; try { const s = localStorage.getItem("rp:marks"); if (s === "on" || s === "off") v = s; } catch {} this._marksPick = v; }
    return this._marksPick !== "off";
  }
  setMarks(on) {
    this._marksPick = on ? "on" : "off";
    try { localStorage.setItem("rp:marks", this._marksPick); } catch {}
    this.syncMarks(); this.redraw();
    this.status(on ? "Marks shown on the video" : "Marks hidden — V shows them");
  }
  toggleMarks() { this.setMarks(!this.marksOn); }
  syncMarks() {
    const b = this.$?.(".marksbtn"); if (!b) return;
    const on = this.marksOn, none = !this.annotations.some((a) => a.kind !== "approve");
    // (as Clear: a switch going away under the keyboard keeps the keyboard in the player)
    const hadFocus = none && !b.hidden && this.shadowRoot.activeElement === b;
    b.hidden = none; b.setAttribute("aria-checked", String(on)); b.querySelector("b").textContent = on ? "on" : "off";
    b.setAttribute("aria-label", `Marks on the video: ${on ? "on" : "off"} (V)`);
    b.title = on ? "Your marks on the video: shown — V hides them (they stay in the record)" : "Your marks on the video: hidden — V shows them";
    this.$(".wrap")?.classList.toggle("nomarks", !on);
    if (hadFocus) this.focus();
  }

  // The two commands that carry this review from a downloads folder into the repo, with the plan
  // directory already filled in. The reviewer's job was to watch and judge; working out where the
  // file goes and which script eats it is not part of that job, and getting it wrong means the
  // review sits in ~/Downloads forever.
  //
  // 1 files the download in the plan's reviews/ (every review kept, never over another), records the
  // calls in the ledger and writes what to act on beside it; 2 commits and pushes it, so the record
  // travels with the repo.
  // What revises the plan is the agent: the main session, or the run the review server starts.
  // The system video has no plan: its review is filed in its own folder and sorted by system-review
  // (step 4 of the revise-loop plan). A plan map from before `kind`/`reviewDir` names it by project.
  get isSystem() { return this.planMap?.kind === "system" || this.planMap?.project === "system-video"; }
  // a walkthrough video: the agent's calls to judge, no plan decisions (its project is `walkthrough-video` in a repo)
  get isWalkthrough() { return !this.isSystem && !this.isExplainer && (this.planMap?.project === "walkthrough-video" || (!!this.planMap?.autonomy?.length && !this.planMap?.decisions?.length)); }
  // an explainer: a video of something already there; it asks nothing to decide, and Finish ends
  // it with Done, Explain more or Plan this instead of Approve and Request changes
  get isExplainer() { return this.planMap?.kind === "explainer"; }
  // a quick video: its repo keeps no decision log (no .reelplanning/decisions.json: none at all, or only setup files),
  // which bundle-player says with `record="none"`, as the review server decides it (no record: a review downloads).
  // There is nothing to run `reel record` on: the review is the download, and the agent is told where it is.
  get isQuick() { return this.getAttribute("record") === "none" && !this.isSystem; }
  // where this review goes in the repo: the plan directory, or the system video's own folder
  reviewTarget() {
    const m = this.planMap; if (!m) return null;
    if (this.isSystem) return m.reviewDir || (m.planDir ? `${m.planDir.replace(/\/+$/, "")}/system-video` : null);
    return m.planDir || null;
  }
  handoffSteps() {
    const dir = this.reviewTarget();
    const d = dir || "<plan-dir>";
    const title = String(this.planMap?.title || this.planMap?.project || "plan").replace(/"/g, "'");
    if (this.isSystem) return [
      { cmd: `${RP_COMMAND} system-review ~/Downloads/annotations.json --video ${d}` },
      { cmd: `git add ${d} && git commit -m "Review: ${title}" && git push` },
    ];
    return [
      // run from the reviewer's repo, where reelplanning is installed (RP_COMMAND), not a checkout
      { cmd: `${RP_COMMAND} reel record ${d} ~/Downloads/annotations.json` },
      { cmd: `git add ${d} && git commit -m "Review: ${title}" && git push` },
    ];
  }
  handoffText() { return this.handoffSteps().map((s) => s.cmd).join("\n") + "\n"; }
  // The human approval the whole handoff turns on: nothing leaves this page until this button is
  // clicked. The review is already sitting in memory — what the click buys is consent.
  sendBlock() {
    const sent = this._sent;
    // anything changed since (a comment's words, a comment, an answer, the verdict) goes as a new row, as postedBlock offers it
    const later = sent?.what && this.reviewSig() !== sent.what ? `<p class="sent state">Your review changed after it was sent. <button class="lnk" data-act="send">Send the change</button></p>` : "";
    if (sent) return `<div class="send done"><p class="sent"><strong>Sent.</strong> ${this.isSystem ? "Claude has this review and will sort each comment: fix the video where it is wrong or unclear, or change the system." : "Claude has this review and will record it against the plan, resolve it, and push the change."}</p><p class="sent state" data-state>${esc(sent.state)}</p>${later}<span class="sent id">${esc(sent.id)}</span></div>`;
    return `<div class="send">
      <div class="row"><input data-send-note placeholder="Anything Claude should know first (optional)" aria-label="A note for Claude (optional)"><button class="sendbtn" data-act="send">${this.isExplainer && EXPLAINER_ENDS[this.verdict] ? `${EXPLAINER_ENDS[this.verdict].send} to Claude` : this.verdict === "approve" ? "Send your approval to Claude" : this.verdict === "changes" ? "Send your changes to Claude" : "Send this review to Claude"}</button></div>
      <p class="fine">${this.isSystem ? "Claude sorts each comment: a fix to the video, a small change shown in a walkthrough, or a new plan." : "Claude records your answers, resolves the plan and pushes the revision."} Nothing leaves this page until you send.</p>
    </div>`;
  }
  // One document per review, in this artifact's own store. Claude reads the submitted ones, hands
  // each to `reel-intake` (it files it in the plan's reviews/ and runs `reel record`), and marks the row —
  // which is what the reviewer then watches happen on the line under the button.
  async sendToClaude() {
    const db = this._claudeDb, dir = this.reviewTarget();
    if (!db || !dir || this._sendingNow) return;
    const review = this.exportPayload(), what = this.reviewSig(review);
    if (this._sent?.what === what) return;   // sent, and nothing changed since: one review must not start two runs
    this._sendingNow = true;
    const btn = this.$('[data-act="send"]'), label = btn?.textContent || "Send it to Claude"; if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    const note = this.$("[data-send-note]")?.value.trim() || "";
    // who is sending, when the page can tell (reachViewer); never held up for it: 1.5 s at most, then without
    const viewer = await Promise.race([this.reachViewer(), new Promise((r) => setTimeout(() => r(null), 1500))]).catch(() => null);
    const body = this.reviewRow(review, note, viewer), base = body.id; delete body.id;
    // an id is the send's second (reviewRow); a change sent within the same second as the review it changes is a
    // review of its own, as the local inbox makes it (writeReview: -2, -3 …), never a write over the one before
    let id = base; this._sentIds ||= new Set();
    for (let i = 2; this._sentIds.has(id); i++) id = `${base}-${i}`;
    this._sentIds.add(id);
    // A document is capped at 256 KiB, and freehand drawing is the only part of a review that can
    // approach it. Say so plainly rather than let the write fail with a code nobody can act on.
    const bytes = new Blob([JSON.stringify(body)]).size;
    if (bytes > 240000) {
      if (btn) { btn.disabled = false; btn.textContent = label; }
      this.openDiy(); this.status(`this review is ${Math.round(bytes / 1000)} KB, too big to send — download it and use the commands below`);
      this._sendingNow = false; return;
    }
    try {
      await db.doc(`reviews/${id}`).set(body);
      this._sent = { id, state: "waiting for Claude to pick it up…", what };
      // this round is over; a rebuilt video starts the next one clean (newRoundIfRebuilt)
      try { localStorage.setItem(this.rkey + ":round", JSON.stringify({ sentAt: review.exportedAt, id, sig: this.buildSig() })); } catch {}
      if (!this.$(".handoff").hidden) this.showHandoff({ finishing: this._finishing }); else this.syncResend();
      this.watchReview(id);
      this.startWork({ id, via: "hosted", verdict: review.verdict });
      this.status("sent to Claude — it lands as a commit on the plan"); this.markWatched("sent");
    } catch (e) {
      if (btn) { btn.disabled = false; btn.textContent = label; }
      const code = e?.code || ""; this.openDiy();
      this.status(code === "not_granted" || code === "capability_disabled"
        ? "this page is not allowed to reach Claude — use the commands below"
        : `could not send (${code || "failed"}) — the commands below still work`);
    } finally { this._sendingNow = false; }
  }
  // One row, whichever way it leaves: the hosted page's `reviews` store and the local review server
  // get the same shape. A system-video review says so (`kind`), and names the video's own folder. A
  // hosted row names who sent it when the page knows (`viewer: { id, owner }`, reachViewer); a local
  // one never does: git's user.email on that machine is the reviewer's own.
  reviewRow(review, note = "", viewer = null) {
    const id = `${this.planMap?.project || "review"}-${review.exportedAt.replace(/[-:]/g, "").replace(/\.\d+/, "")}`;
    return { id, status: "submitted", submittedAt: review.exportedAt, project: this.planMap?.project || null,
      planDir: this.reviewTarget(), ...(this.isSystem ? { kind: "system" } : this.isExplainer ? { kind: "explainer" } : {}), title: this.planMap?.title || null, verdict: review.verdict, note,
      ...(viewer && (viewer.id || viewer.owner) ? { viewer: { id: viewer.id || null, owner: !!viewer.owner } } : {}), review };
  }
  // Claude marks the row as it goes, so the reviewer watches it land instead of wondering.
  watchReview(id) {
    this._unwatch?.(); this._watching = id;
    this._unwatch = this._claudeDb.doc(`reviews/${id}`).onSnapshot((snap) => {
      const d = snap.data(); if (!d) return;
      const where = d.commit ? ` — ${String(d.commit).slice(0, 8)}${d.branch ? ` on ${d.branch}` : ""}` : "";
      const text = { submitted: "waiting for Claude to pick it up…",
        working: `Claude is working on it${d.step ? ` — ${d.step}` : ""}`,
        recorded: `Recorded and pushed${where}.`,
        failed: `Claude could not finish it${d.error ? ` — ${d.error}` : ""}. The commands below still work.` }[d.status] || String(d.status);
      // the answer to the review, where the reviewer made it (a system-video review: what was done with each comment)
      const text2 = d.answer ? `${text} ${String(d.answer)}` : text;
      if (this._sent) this._sent.state = text2;
      const el = this.$(".handoff [data-state]"); if (el) el.textContent = text2;
      if (d.status === "failed") this.openDiy();
      // the line above the frame: submitted → waiting, working (its step), recorded → done, failed → stopped
      const st = { submitted: "waiting", working: "working", recorded: "done", failed: "stopped" }[d.status];
      if (st && this._work?.id === id && this._work.via === "hosted") this.applyWork({ state: st, step: d.step, error: d.error });
    }, () => {});
  }
  // fold: true folds it to its one line, false opens it out; left out, it stays as it was (opened out when it opens)
  showHandoff({ finishing = false, fold } = {}) {
    const box = this.$(".handoff"); if (!box) return;
    const opening = box.hidden;
    this._finishing = finishing;
    if (fold != null) this._hfold = !!fold; else if (opening) this._hfold = false;
    const known = !!this.reviewTarget();
    // Name what the file actually carries. A plan review has decisions and comments; a walkthrough
    // has verdicts and quick checks and often no decisions at all, and "0 decisions" reads as a
    // failure rather than as the shape of that video.
    const plural = (k, w) => `${k} ${w}${k === 1 ? "" : "s"}`;
    const bits = [
      [Object.values(this.decisions).filter((m) => !this.isUnclear(m)).length, "decision"], [Object.values(this.decisions).filter((m) => this.isUnclear(m)).length, "unclear question"], [Object.keys(this.autonomy).length, "verdict"],
      [Object.keys(this.quizzes).length, "quick check"], [this.annotations.length, "comment"],
    ].filter(([k]) => k).map(([k, w]) => plural(k, w));
    const carried = bits.length
      ? `${bits.length > 1 ? `${bits.slice(0, -1).join(", ")} and ${bits.at(-1)}` : bits[0]} ${bits.length > 1 || !/^1 /.test(bits[0]) ? "are" : "is"}`
      : "How much you watched is";
    const canSend = !!this._claudeDb && !!this.reviewTarget();
    // a quick video (no decision log in its repo): no commands to run, no plan directory to name
    const quick = this.isQuick;
    const v = this.verdict, words = this.annotations.filter((a) => a.kind !== "approve" && (a.comment || "").trim()).length;
    const unclear = Object.values(this.decisions).filter((m) => this.isUnclear(m)).length;
    const uc = Object.values(this.quizzes).filter((q) => q.unclear).length;   // quick checks the reviewer asked to have explained again (the guard)
    const open = (this.planMap?.decisions || []).filter((d) => !this.decisions[d.id] || this.isUnclear(this.decisions[d.id])).length;   // asking for more is still open
    // Approve with comments: they are acted on, and no new video is made. Request changes: they are
    // acted on and the video is rebuilt where they landed, to watch again (SKILL.md).
    const wtv = this.isWalkthrough;
    const approveText = this.isSystem ? "The video, and the system it shows, are right as they stand."
      : wtv ? (words ? `The agent fixes what your ${plural(words, "comment")} ${words === 1 ? "asks" : "ask"}. No new video.` : "The build stands as it is.")
      : words ? `The plan goes ahead; your ${plural(words, "comment")} ${words === 1 ? "goes" : "go"} into its steps. No new video.` : "The plan goes ahead as it stands, with your choices.";
    // an explainer: its suggestions, the pick, and the comments on scenes (your words under Finish are not one of them)
    const sugg = this.isExplainer ? this.nextSuggestions() : null, np = sugg && this.nextPick(), said = this.annotations.filter((a) => a.kind !== "approve" && !a.open && (a.comment || "").trim()).length;
    const verdict = v && this.isExplainer ? `<div class="verdict three" role="group" aria-label="What comes next">${Object.entries(EXPLAINER_ENDS).map(([k, e]) => `<button data-review="${k}" aria-pressed="${v === k}"><b>${e.label}</b><span>${sugg[k]?.[0] ? mdInline(e.says(said, sugg[k][0])) : this.glossHtml(e.says(said))}</span></button>`).join("")}</div>
      ${quick ? "" : '<p class="open">Nothing goes into the decision log: an explainer asks no questions, and only an answer is a decision.</p>'}`
      : v ? `<div class="verdict" role="group" aria-label="Your verdict">
        <button data-review="approve" aria-pressed="${v === "approve"}"><b>Approve</b><span>${this.glossHtml(approveText)}</span></button>
        <button data-review="changes" aria-pressed="${v === "changes"}"><b>Request changes</b><span>${this.glossHtml(uc && !words ? `The agent explains ${[unclear ? (unclear === 1 ? "the question you asked about" : "the questions you asked about") : "", uc === 1 ? "the quick check you missed" : `the ${uc} quick checks you missed`].filter(Boolean).join(" and ")} again, with a worked example, and you rewatch just ${unclear + uc === 1 ? "that" : "those"}.` : this.isSystem ? (words ? `The agent sorts your ${plural(words, "comment")}: it fixes the video where it is wrong or unclear, or changes the system, and you rewatch just those.` : "Leave a comment on what is wrong first — the agent fixes the video there, or changes the system.") : wtv ? (words ? `The agent fixes what your ${plural(words, "comment")} ${words === 1 ? "asks" : "ask"}, and you rewatch just those scenes.` : "Leave a comment on what to change first — the agent fixes it, and you rewatch it.") : words ? `The agent rewrites the steps your ${plural(words, "comment")} landed on, and you rewatch just those.` : unclear ? `The agent explains ${unclear === 1 ? "the question" : "the questions"} you asked about again, with examples, and you rewatch just ${unclear === 1 ? "that" : "those"}.` : "Leave a comment on what to change first — the agent rewrites the steps your comments land on.")}</span></button>
      </div>${open ? `<p class="open">${plural(open, "choice")} still open — ${open === 1 ? "it stays a question" : "they stay questions"} in the plan.</p>` : ""}` : "";
    const list = (xs) => xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}` : xs[0];
    // One primary act. Hosted, it is Send; otherwise, while finishing, it is the download the
    // commands need; after an export the file is already saved and the commands are the act.
    const posted = !canSend && !!this._posted, local = !canSend && !posted && !!this._localApi;
    const primary = canSend ? this.sendBlock() : posted ? this.postedBlock() : local ? this.localBlock() : quick ? this.quickBlock(finishing)
      : finishing ? '<div class="acts"><button class="sendbtn" data-act="download">Download annotations.json</button></div>' : "";
    // the commands keep their open state across a re-render, unless the review just found its own way to the repo
    const routed = canSend || posted || local, wasOpen = box.dataset.routed === String(routed) && box.querySelector(".diy")?.open; box.dataset.routed = String(routed);
    // a walkthrough ends on one open question, with room for your words; they
    // go with the review as a comment on the build (a note with `open: true`), and the agent acts on them
    const oq = (wtv || this.isExplainer) && finishing ? this.openQuestion() : null, ow = this.annotations.find((a) => a.open)?.comment || "";
    const openq = oq ? `<div class="openq"><label for="rp-openq">${esc(oq)}</label><textarea id="rp-openq" data-openq rows="2" maxlength="2000" placeholder="${this.isExplainer && (v === "more" || v === "plan") ? "Pick a suggestion above to start from, or write your own" : "Your words, if anything: they go to the agent with your review"}">${esc(ow)}</textarea><p class="fine">${this.isExplainer ? (np?.end === v ? (ow.trim() === np.text ? "Your pick, as suggested: edit it to say it your way." : "Your pick, in your words.") : "Your words go with the review; empty is fine for Done.") : "Nothing to change? Leave it empty."}</p></div>` : "";
    // an explainer: what Explain more or Plan this would mean for this video, to pick, edit or replace
    const offer = sugg && finishing && (v === "more" || v === "plan") ? sugg[v] : null;
    const nexts = offer ? `<div class="nexts" role="group" aria-label="What ${EXPLAINER_ENDS[v].label} could mean here"><p class="hint">${offer.length ? `What ${EXPLAINER_ENDS[v].label} could mean for this video${offer.some((x) => x.viewer) ? ", from it and from what you did while watching" : ""}. Pick one to start from, edit it below, or write your own.` : `Nothing to suggest from this video: say below what ${v === "more" ? "you want explained" : "the plan should do"}.`}</p>${offer.length ? `<ul>${offer.map((x) => `<li><button data-next="${esc(x.id)}" aria-pressed="${np?.end === v && np.id === x.id}">${mdInline(x.text)}<span>${esc(x.why || "")}</span></button></li>`).join("")}</ul>` : ""}</div>` : "";
    const folded = !!this._hfold;
    box.innerHTML = `<div class="hhd"><h5><button class="hfold" data-act="handoff-fold" aria-expanded="${!folded}" aria-controls="rp-hbody" title="${folded ? "Open the Finish panel: the verdict and Send" : "Fold this to one line: your feedback is listed below"}">${finishing ? "Finish your review" : quick ? "Now hand this review to your agent" : "Now get this review into the repo"}</button></h5><span class="hsum">${esc(this.handoffSum())}</span><button class="lnk" data-act="handoff-close" title="Close the Finish panel (Esc): Finish review opens it again">${folded ? "Close" : "Back to the record"}</button></div>
      <div class="hbody" id="rp-hbody">${this.isExplainer ? `${finishing && v ? this.guardLine() : ""}${verdict}${nexts}${openq}` : `${openq}${finishing && v ? this.guardLine() : ""}${verdict}`}
      <p class="lede">${finishing ? (bits.length ? `Your ${list(bits)} ${bits.length > 1 || !/^1 /.test(bits[0]) ? "go" : "goes"} with it.` : "Nothing marked yet; how much you watched goes with it.") : `${carried} in the <code>annotations.json</code> your browser just saved.`}</p>
      ${primary}
      ${quick ? "" : `<details class="diy"${!routed || wasOpen ? " open" : ""}>
        <summary>${routed ? "Do it yourself instead" : finishing ? "Then, from the repo root" : "From the repo root"}</summary>
        <p class="why">${finishing && canSend ? "Download the review, then run these from the repo root. " : ""}The first line assumes your browser saves to ~/Downloads. Then tell your agent the review is in: it revises from what you recorded.</p>
        ${known ? "" : '<p class="warn">This video\'s storyboard does not say where its plan lives, so <code>&lt;plan-dir&gt;</code> is a placeholder: fill it in, or add <code>plan_dir: &lt;path&gt;</code> to its STORYBOARD.md front matter and rebuild the plan map.</p>'}
        <ol>${this.handoffSteps().map((s) => `<li><code>${esc(s.cmd)}</code></li>`).join("")}</ol>
        <div class="acts"><button data-act="handoff-copy">Copy both</button>${finishing && canSend ? '<button data-act="download">Download annotations.json</button>' : ""}</div>
      </details>`}</div>`;
    box.hidden = false; box.classList.toggle("folded", folded);
    const oqa = box.querySelector("[data-openq]");
    if (oqa) { this.fitField(oqa, 6); oqa.addEventListener("input", () => this.fitField(oqa, 6)); oqa.addEventListener("change", () => { this.setOpenWords(oqa.value); this.showHandoff({ finishing: this._finishing }); }); }
    // The record is a sheet that rests at a peek, and the panel heads it. Opening it without pulling
    // the sheet up puts the one thing the reviewer now has to read below a clipped edge, where nothing
    // on screen suggests it exists. Only when it opens (or is opened out): a re-render (a send's
    // answer, a verdict picked) leaves the sheet, and where the reviewer has scrolled it, alone.
    if (opening || fold === false) { this.openPull(); requestAnimationFrame(() => { this.$(".side").scrollTop = 0; }); }
    this.syncResend();
  }
  // The panel folded to its title: the verdict picked, and whether the review is sent
  handoffSum() {
    const v = this.verdict, lab = this.isExplainer && EXPLAINER_ENDS[v] ? EXPLAINER_ENDS[v].label : v === "approve" ? "Approve" : v === "changes" ? "Request changes" : "";
    const hosted = !!this._claudeDb && !!this.reviewTarget(), p = this._posted;
    const st = hosted ? (this._sent ? "sent" : "not sent yet") : p?.state === "sent" ? "sent" : p?.state === "sending" ? "sending…" : this._localApi ? "not sent yet" : "";
    return [lab, st].filter(Boolean).join(" · ");
  }
  // Fold the panel to its one line (the feedback under it in view), or open it out again
  foldHandoff(on) {
    const box = this.$(".handoff"); if (!box || box.hidden || !!this._hfold === !!on) return;
    const had = box.contains(this.shadowRoot.activeElement);
    this.showHandoff({ finishing: this._finishing, fold: !!on });
    if (had) box.querySelector(".hfold")?.focus({ preventScroll: true });
  }
  // A quick video's act: the download, while finishing (after an export the file is already saved), and one plain
  // line on what to do with it. Its repo has no decision log, so there is no `reel record` to run and no plan_dir to
  // name: the agent that made the video reads the file where the browser saved it.
  quickBlock(finishing) {
    const where = "where the file is (e.g. ~/Downloads/annotations.json): it reads your answers and comments and revises.";
    return `${finishing ? '<div class="acts"><button class="sendbtn" data-act="download">Download annotations.json</button></div>' : ""}<p class="tell">${finishing ? "Then tell" : "Tell"} your agent ${esc(where)}</p>`;
  }
  // The walkthrough's open question (walkthroughs-that-help step 3): the plan map's (its ending beat's
  // `- open_question:`), else the plan's own words.
  openQuestion() { return this.planMap?.openQuestion?.question || (this.isExplainer ? "What do you want next?" : "Seeing it run, anything you'd change?"); }
  // Your words on it are one note on no step, `open: true`, at the video's end: sent with the review, said in
  // what to act on as your answer to the question; emptied, the note goes.
  setOpenWords(v) {
    const text = keepLines(v), was = this.annotations.find((a) => a.open);
    if (!text) { if (was) { this.annotations = this.annotations.filter((a) => a !== was); this.persist(); this.renderList(); this.updateStatus(); } return; }
    if (was) { if (was.comment === text) return; was.comment = text; this.persist(); this.renderList(); this.dispatchEvent(new CustomEvent("annotation", { detail: was })); return; }
    this.add({ kind: "note", open: true, about: this.openQuestion(), comment: text, t: this.planMap?.openQuestion?.at ?? Math.max(0, (this.dur() || 0) - 0.05), plan: { step: null, component: null } });
  }
  // ---- an explainer's Finish: what Explain more and Plan this would mean ----------------------------------------
  // Not templates: the plan map's own suggestions for this video (explainer.next, made at build time from its scenes,
  // its long sources and explain.md's open threads) refined by what this viewer did. A suggestion on a scene they
  // commented on, went back to, slowed down for or marked says so and comes first; their questions, the quick checks
  // they missed, the words they looked up, the commits since and their comments add their own. 5 an end at most.
  nextSuggestions() {
    const m = this.planMap || {}, base = m.explainer?.next || {}, frames = m.frames || [];
    const title = (n) => frames.find((f) => f.index === n)?.title || "";
    const sceneOf = (n) => `scene ${n}${title(n) ? `, "${title(n)}"` : ""}`;
    const clip = (x, n = 80) => { const t = String(x).replace(/\s+/g, " ").trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };
    const did = new Map(), note = (n, k, v = true) => { if (n == null) return; const d = did.get(n) || {}; (d[k] ||= []).push(v); did.set(n, d); };
    for (const x of this.moments || []) note(x.frameIndex, x.kind === "rewind" ? "rewound" : "slowed");
    const said = this.annotations.filter((a) => a.kind !== "approve" && !a.open && String(a.comment || "").trim());
    for (const a of said) note(a.frame?.index, "commented", String(a.comment).trim());
    for (const a of this.annotations.filter((a) => a.kind !== "approve" && !a.open && !String(a.comment || "").trim())) note(a.frame?.index, "marked");
    const clause = (n) => { const d = did.get(n); return !d ? "" : d.commented ? `, where you commented "${clip(d.commented[0], 50)}"` : d.rewound ? ", the part you rewound" : d.slowed ? ", the part you slowed down for" : ", the part you marked"; };
    const weight = (n) => { const d = n != null && did.get(n); return d ? (d.commented?.length || 0) * 3 + (d.rewound?.length || 0) * 2 + (d.slowed?.length || 0) + (d.marked?.length || 0) : 0; };
    // going deeper says where, in the text ("…, the part you rewound"); a plan says it beside, as where it came from
    const lifted = new Set(), lift = (x, inText) => { const c = x.scene != null ? clause(x.scene) : ""; if (c && inText) lifted.add(x.scene); return { ...x, ...(c ? inText ? { text: `${x.text}${c}` } : { why: `${x.why || ""}${x.why ? " · " : ""}${c.replace(/^, (?:where )?/, "")}` } : {}), viewer: !!c, w: weight(x.scene) }; };
    const more = (base.more || []).map((x) => lift(x, true)), plan = (base.plan || []).map((x) => lift(x, false));
    // the questions asked on the page: one with no answer gets a scene; one answered, a closer look
    (this.questions || []).filter((q) => String(q.question || "").trim()).forEach((q, i) => more.push({ id: `vq${i + 1}`, text: q.answer ? `Go further on "${clip(q.question, 70)}"` : `Answer "${clip(q.question, 70)}" in a scene of its own`, why: `you asked it${q.frame?.index ? ` on ${sceneOf(q.frame.index)}` : ""}${q.answer ? ", and the page answered it" : ", and the page had no answer"}`, viewer: true, w: q.answer ? 3 : 6 }));
    // a quick check answered the other way: the scene that explains it, again
    for (const q of (m.quizzes || []).filter((q) => this.quizzes?.[q.id]?.correct === false)) { const n = q.explainedFrame ?? null;
      more.push({ id: `vk${q.id}`, text: `Explain ${n != null ? sceneOf(n) : "it"} again, with the case quick check ${String(q.id).toUpperCase()} asked about`, why: `you answered "${clip(q.question, 60)}" the other way`, ...(n != null ? { scene: n } : {}), viewer: true, w: 5 }); }
    // the words looked up
    const terms = this.termList?.() || [], words = (this.termsLookedUp || []).map((k) => { const r = terms.find((t) => t.key === k || (t.forms || []).includes(k)); return r ? (r.display || r.term || k) : k; }).filter(Boolean).slice(0, 3);
    if (words.length) more.push({ id: "vt", text: `Say what ${words.map((w) => `"${w}"`).join(words.length === 2 ? " and " : ", ")} ${words.length === 1 ? "means" : "mean"} where ${words.length === 1 ? "it first comes" : "they first come"} up`, why: `you looked ${words.length === 1 ? "it" : "them"} up`, viewer: true, w: 2 });
    // the repo moved on since it was explained (the packed map says how far: bundle-player)
    const since = m.explainer?.since;
    if (since > 0) more.push({ id: "vs", text: `Explain the ${since === 1 ? "commit" : `${since} commits`} since \`${String(m.explainer.commit || "").slice(0, 7)}\``, why: m.explainer.sinceSubjects?.length ? `since it was explained: ${m.explainer.sinceSubjects.map((x) => clip(x, 50)).join("; ")}` : "the repo moved on since it was explained", w: 1 });
    // a scene the viewer went back to that no suggestion is about yet
    for (const [n] of [...did].filter(([n]) => !lifted.has(n) && frames.some((f) => f.index === n)).sort((a, b) => weight(b[0]) - weight(a[0])).slice(0, 2))
      more.push({ id: `vr${n}`, text: `Go deeper on ${sceneOf(n)}${clause(n)}`, why: "from what you did while watching", scene: n, viewer: true, w: weight(n) });
    // a comment that asks for something is a plan's start; any other comment can be one too
    said.forEach((a, i) => { const t = String(a.comment).trim().replace(/\s+/g, " "), bare = t.replace(WANTING, "").replace(/[.!]+$/, ""), n = a.frame?.index ?? null;
      plan.push({ id: `vc${i + 1}`, text: DOING.test(bare) && bare.length <= 140 ? `A plan to ${bare.charAt(0).toLowerCase()}${bare.slice(1)}` : `A plan from your comment${n != null ? ` on scene ${n}` : ""}: "${clip(t, 90)}"`, why: `your comment${n != null ? ` on ${sceneOf(n)}` : ""}`, ...(n != null ? { scene: n } : {}), viewer: true, w: DOING.test(bare) ? 7 : 2 }); });
    const rank = (xs) => { const seen = new Set(); return xs.map((x, i) => ({ x, i })).sort((a, b) => (b.x.w || 0) - (a.x.w || 0) || a.i - b.i).map(({ x }) => x)
      .filter((x) => { const k = x.text.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 5).map(({ w, ...x }) => x); };
    return { more: rank(more), plan: rank(plan) };
  }
  // the pick, kept in this browser beside the verdict: { end, id, text, why, scene? }
  nextPick() { if (this._nextFor !== this.src) { this._nextFor = this.src; try { this._next = JSON.parse(localStorage.getItem(this.rkey + ":next") || "null"); } catch { this._next = null; } } return this._next || null; }
  setNextPick(p) { this._next = p; this._nextFor = this.src; try { p ? localStorage.setItem(this.rkey + ":next", JSON.stringify(p)) : localStorage.removeItem(this.rkey + ":next"); } catch {} }
  // Pick one: it fills "What do you want next?" to edit, ahead of any words already there; a second click takes it back.
  pickNext(id, { render = true } = {}) {
    const v = this.verdict, s = (this.nextSuggestions()[v] || []).find((x) => x.id === id); if (!s) return;
    const was = this.nextPick(), words = this.annotations.find((a) => a.open)?.comment || "";
    if (was?.end === v && was.id === id) { this.setNextPick(null); if (words === was.text) this.setOpenWords(""); }
    else {
      const rest = was && words.startsWith(was.text) ? words.slice(was.text.length).trim() : words.trim();
      this.setNextPick({ end: v, id: s.id, text: s.text, why: s.why || "", ...(s.scene != null ? { scene: s.scene } : {}) });
      this.setOpenWords(rest ? `${s.text}\n${rest}` : s.text);
    }
    if (render) this.showHandoff({ finishing: this._finishing });
  }
  // what the review carries of it: the end, the pick (when it is this end's), your words, and whether you changed them
  nextRecord() {
    const v = this.verdict; if (!EXPLAINER_ENDS[v]) return null;
    const p = this.nextPick(), pick = p?.end === v ? { id: p.id, text: p.text, why: p.why, ...(p.scene != null ? { scene: p.scene } : {}) } : null, words = this.annotations.find((a) => a.open)?.comment || "";
    const offered = v === "done" ? 0 : (this.nextSuggestions()[v] || []).length;
    return { end: v, pick, words, edited: !!pick && words.trim() !== pick.text, offered };
  }
  // the manual path, opened when the send path cannot finish the job
  openDiy() { const d = this.$(".handoff .diy"); if (d) d.open = true; }
  async copyHandoff() {
    const text = this.handoffText();
    try {
      await navigator.clipboard.writeText(text);
      const b = this.$('[data-act="handoff-copy"]'); if (b) { b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy both"; }, 1600); }
      this.status("commands copied — paste them at the repo root");
    } catch { this.showCopyFallback(text); }
  }

  // The review itself, as a value. Export downloads it; Send hands the same object to Claude —
  // one shape, so a review that arrives either way is the same review.
  exportPayload() {
    const dur = this.player.duration || this.planMap?.totalSeconds || 0;
    return { version: 1, src: this.src, project: this.planMap?.project || null, exportedAt: new Date().toISOString(),
      watch: { firstPlayAt: this._firstPlayAt, maxTimeReached: +this._maxT.toFixed(2), durationSeconds: +dur.toFixed(2), completion: dur ? +Math.min(1, this._maxT / dur).toFixed(3) : null, chapters: (this.planMap?.chapters || []).map((c) => ({ id: c.id, completion: +Math.max(0, Math.min(1, (this._maxT - c.start) / (c.end - c.start))).toFixed(3) })),
        moments: this.moments.map((m) => ({ ...m })),
        // details: each opening, and how long the page was open; none of it is watching time (D-005)
        details: this.detailsLog() },
      decisions: Object.entries(this.decisions).map(([id, v]) => ({ id, ...v })),
      quizzes: Object.entries(this.quizzes).map(([id, v]) => ({ id, ...v })),
      // quick checks on or off when it was sent: off, the ones not answered were not asked (never wrong, never missed)
      ...((this.planMap?.quizzes || []).length ? { checks: this.checksOn ? "on" : "off" } : {}),
      autonomy: Object.entries(this.autonomy).map(([id, v]) => ({ id, ...v })),
      knowledgeLevel: this.level,
      // what this browser has watched (D-128): every video's mark, under the review page's name for it
      watched: this.watchedAll(),
      // how hard it was to follow, on every review (accessible videos): wrong checks, walk-throughs opened, words looked up, trips back, how much was watched
      confusion: this.confusion(),
      // Ask about this (videos-that-make-sense step 3): every question asked, with its answer and where it came from;
      // one with no answer goes with this review, to be answered in the next version
      questions: (this.questions || []).map(({ status, askId, ...q }) => ({ ...q, ...(q.answer ? {} : { answered: false }) })),
      verdict: this.verdict || (this.annotations.some((a) => a.kind === "approve") ? "approve" : null), // "approve" | "changes" | null (not finished)
      // an explainer's review: its kind, and its end, the verdict under the name the plan gives it
      // and what they want next: a suggestion Finish drew from this video, picked and maybe edited, or their own words
      ...(this.isExplainer ? { kind: "explainer", end: EXPLAINER_ENDS[this.verdict] ? this.verdict : null, next: this.nextRecord() } : {}),
      annotations: this.annotations };
  }
  export() {
    const out = this.exportPayload();
    this.dispatchEvent(new CustomEvent("annotations", { detail: out }));
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "annotations.json"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    this.status(`exported annotations.json with ${this.annotations.length} mark${this.annotations.length === 1 ? "" : "s"}`);
    this.showHandoff({ fold: false });
  }
}
customElements.define("reelplanning-player", ReelplanningPlayer);

// ---- the guide under the video (D-264) ------------------------------------------------------------
// <reelplanning-guide for="rp"></reelplanning-guide>, under the player on the review page (scripts/bundle-player.mjs puts
// it there): the open video's guide (guide/index.html beside its plan map, as `reelplanning guide` builds it) in a
// same-origin frame as tall as the window. The page scrolls down to the frame; once the frame fills the window the guide
// scrolls itself, and back at its top the page scrolls again. So the guide runs as on its own page (its sticky stage, its
// reading line, its note box and Ask), its styles stay in its frame, and it never has to be measured. It takes no room
// for a video with no guide. Its notes and questions are the player's own record (the same browser storage, joined as it
// is written: onStorage), so they go with the same review as the video's marks.
// The frame speaks with this element through postMessage; the embed block at the end of templates/guide/guide.js has
// the whole interface. The frame says "ready", and "watch" (a Watch this moment: this player seeks and plays it); this
// element says "scroll" (whether the frame fills the window), "open" (a part, lit a moment), "theme" and "inset" (the
// small player's room at the window's foot), and "note" (a note highlighted in it, from the record: go to it).
const GUIDE_STYLE = `
:host{display:block}
.gu[hidden]{display:none}
.gh{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 12px;padding:20px 24px 16px;border-top:1px solid var(--ink-12,rgba(20,20,19,.12))}
.gh .k{flex:none;font:500 13px/1.3 var(--sans,ui-sans-serif,system-ui,sans-serif);color:var(--ink-3,#5C5953)}
.gh h2{flex:1 1 auto;min-width:0;margin:0;font:400 20px/1.3 var(--serif,Georgia,serif);color:var(--ink,#141413);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh .hint{flex-basis:100%;margin:4px 0 0;font:13px/1.45 var(--sans,ui-sans-serif,system-ui,sans-serif);color:var(--ink-3,#5C5953)}
iframe{display:block;width:100%;height:100vh;height:calc(100svh - var(--rp-foot,0px));border:0;background:var(--paper,#FAF9F5)}
.gu{padding-bottom:var(--rp-foot,0px)}   /* a phone: the frame stops above the small player's bar, which never covers its words */
@media (max-width:600px){.gh{padding:16px 16px 12px}.gh h2{font-size:17px;white-space:normal}}`;
// a video's review-page name from its folder, as bundle-player's slugFor names it: system, <plan>, <plan>--walkthrough,
// <explainer>--explainer; anything else, its folder (in a bundle, the folder is that name)
function reviewName(src) {
  const p = String(src || "").replace(/[?#].*$/, "").replace(/\/index\.html$/, "").replace(/\/+$/, "");
  const e = p.match(/\.reelplanning\/explainers\/([^/]+)\/video$/); if (e) return `${e[1]}--explainer`;
  const m = p.match(/\.reelplanning\/(?:plans\/([^/]+)\/(video|walkthrough-video)|(system-video))$/);
  return m?.[3] ? "system" : m ? (m[2] === "video" ? m[1] : `${m[1]}--walkthrough`) : p.split("/").pop() || "";
}
const slugOf = (s) => String(s || "").replace(/[?#].*$/, "").replace(/\/index\.html$/, "").replace(/\/+$/, "").split("/").pop();
export class ReelplanningGuide extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: "open" }).innerHTML = `<style>${GUIDE_STYLE}</style><section class="gu" hidden aria-labelledby="gu-t"><header class="gh"><span class="k">Guide</span><h2 id="gu-t"></h2><p class="hint">Everything the video shows, and more. Highlight anything in it to leave a note, as you mark the video; Watch this moment plays it in the small player.</p></header><iframe title="The guide to this video"></iframe></section>`;
    this.sec = this.shadowRoot.querySelector(".gu"); this.ifr = this.shadowRoot.querySelector("iframe");
    this.ready = false; this._want = undefined; this._scrollOn = null;
    addEventListener("message", (e) => this.onMessage(e));
    const look = () => { if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = 0; this.syncScroll(); }); };
    addEventListener("scroll", look, { passive: true });
    addEventListener("resize", () => { look(); this.room(); });
    // the Guide link on a plan's row, on this video's page already: the same page, down to its guide
    addEventListener("hashchange", () => { if (location.hash === "#guide" && !this.sec.hidden) this.show(null); });
    const p = this.player; if (!p) return;
    p.addEventListener("plan", () => this.check());
    // the small player comes and goes: the room it takes at the window's foot with it (the guide's last words, and its
    // note box docked on a phone, stay above it)
    p.addEventListener("mini", () => this.room());
    new MutationObserver(() => this.post({ event: "theme", theme: p.theme })).observe(p, { attributes: true, attributeFilter: ["theme"] });
    if (p.planMap) this.check();
  }
  get player() { const p = document.getElementById(this.getAttribute("for") || "rp"); return p && typeof p.attachGuide === "function" ? p : null; }
  post(m) { try { this.ifr?.contentWindow?.postMessage({ type: "rp-guide-host", ...m }, location.origin); } catch {} }
  // the room the small player takes: on a phone, a bar along the window's foot, which the frame stops above (so it never
  // covers the guide's words); elsewhere a card in the bottom-right corner, which the guide's column keeps clear of
  // (inset: its height at the foot, right: its width from the right edge, told to the guide as they change)
  room() {
    const p = this.player; if (!p) return;
    const phone = matchMedia("(max-width:600px)").matches, foot = phone ? p.miniInset() : 0;
    this.style.setProperty("--rp-foot", `${foot}px`);
    this._inset = null; this.dock();
  }
  // …and what of the frame's own window is covered at its foot, now: the window's foot below the frame's (the page not
  // yet all the way down to it) and the small player's bar or card, measured where it is (its real top, with the
  // phone's safe area under it). The guide docks its note box and its toasts above that (so a phone's
  // Save is never under the bar while the frame's top is still down the window). Told as it changes, with the scroll.
  dock() {
    const p = this.player; if (!p || !this.ready || this.sec.hidden) return;
    const phone = matchMedia("(max-width:600px)").matches, fr = this.ifr.getBoundingClientRect(), H = document.documentElement.clientHeight;
    const bar = p._mini && p._miniG?.phone ? p._miniG.card : null;   // (where it is placed: its rect is still moving as it comes in)
    const seen = Math.min(H, bar ? bar.y : H);
    const dock = Math.max(0, Math.ceil(fr.bottom - seen)) + (phone || !p._mini ? 0 : p.miniInset());
    const m = { bottom: phone ? 0 : p.miniInset(), right: p.miniRight(), dock };
    const k = JSON.stringify(m); if (k === this._inset) return; this._inset = k;
    this.post({ event: "inset", ...m });
  }
  // the video's guide, found beside its plan map (the player's hasGuide), or none: then nothing shows
  async check() {
    const p = this.player; if (!p) return;
    const ok = await p.hasGuide().catch(() => false), url = ok ? p.guideEmbedUrl() : null;
    if (!url) { this.sec.hidden = true; this.ready = false; this._url = null; this.ifr.removeAttribute("src"); p.attachGuide(null); return; }
    // attached at once, so a part asked for now (a marked thing clicked as the page loads) goes down to the guide under
    // the video, never to a page of its own; the guide's page itself loads once the video is ready (or a moment after,
    // whichever is sooner), or at once when a part is asked for (show)
    this.shadowRoot.getElementById("gu-t").textContent = p.planMap?.title || "";
    this.sec.hidden = false; p.attachGuide(this); this.room();
    if (url !== this._url) { this._url = url; this.ready = false; this._scrollOn = null; this.ifr.removeAttribute("src"); await this.videoFirst(p); this.load(); }
    // opened from a plan's Guide link (?project=…#guide): straight to it
    if (location.hash === "#guide" && !this._hashDone) { this._hashDone = true; this.show(null, { instant: true }); }
    this.syncScroll();
  }
  load() { if (this._url && this.ifr.getAttribute("src") !== this._url) this.ifr.src = this._url; }
  videoFirst(p) {
    if (p.stage?.dataset.ready || !p.player) return Promise.resolve();
    return new Promise((ok) => { const t = setTimeout(ok, 2500); p.player.addEventListener("ready", () => { clearTimeout(t); ok(); }, { once: true }); });
  }
  // Down to the guide, and to a part of it (null: its top as it is), or to a note highlighted in it (`note`, its id).
  // The part opens once the page is there: the guide scrolls itself only then, and its own scrollIntoView before that
  // would take the page along with it.
  // A part asked for once the page is there goes to it as the glide begins (open, instant: the frame is at the part
  // before it comes into view, never its top for a frame and then a jump), and is lit once the glide is over.
  show(part = null, { instant = false, note = null } = {}) {
    if (this.sec.hidden) return;
    this.load();
    this._want = note ? { note } : part;
    const early = !!(this.ready && part && !note);
    if (early) { this._want = undefined; this.post({ event: "open", part, instant: true }); }
    const calm = instant || matchMedia("(prefers-reduced-motion: reduce)").matches, se = document.scrollingElement || document.documentElement;
    const to = Math.max(0, Math.min(this.ifr.getBoundingClientRect().top + scrollY, se.scrollHeight - innerHeight));
    scrollTo({ top: to, behavior: calm ? "auto" : "smooth" });
    const token = (this._showT = {}), t0 = performance.now(); let last = NaN, same = 0;
    const wait = () => {
      if (this._showT !== token) return;
      const y = scrollY; same = Math.abs(y - last) < 0.5 ? same + 1 : 0; last = y;
      if ((Math.abs(y - to) < 2 && same >= 1) || same >= 8 || performance.now() - t0 > 3000) { this.syncScroll(); if (early) { if (this.atGuide()) this.post({ event: "light", part }); } else if (this.atGuide()) this.deliver(); else this._want = undefined; return; }
      requestAnimationFrame(wait);
    };
    requestAnimationFrame(wait);
  }
  // the guide's settled picture of a chapter (from..to, in the video's seconds): a scene of it that the guide took a
  // picture of, the one playing at t where it has one; its URL, in the theme asked for, or null (no guide yet, or none)
  stillFor(from, to, t, dark = false) {
    let w, G; try { w = this.ifr?.contentWindow; G = this.ready ? w?.RPGuide?.G : null; } catch { return null; }
    const v = G?.videos?.[G.own], sc = (v?.scenes || []).filter((f) => f.pic && !f.branch && f.start >= from - 0.01 && f.start < to);
    if (!sc.length) return null;
    const f = sc.find((x) => t >= x.start && t < x.end) || [...sc].reverse().find((x) => x.start <= t) || sc[0], p = dark && f.pic.dark ? f.pic.dark : f.pic;
    try { return new URL(p.src, w.location.href).href; } catch { return null; }
  }
  deliver() { if (!this.ready || this._want === undefined) return; const w = this._want; this._want = undefined; if (w?.note) this.post({ event: "note", id: w.note }); else if (w) this.post({ event: "open", part: w }); }
  // the frame fills the window (its top at the window's, or the page as far down as it goes): the guide scrolls itself
  atGuide() { const se = document.scrollingElement || document.documentElement; return !this.sec.hidden && (this.ifr.getBoundingClientRect().top <= 1 || scrollY >= se.scrollHeight - innerHeight - 2); }
  syncScroll() {
    this.dock();
    // the page's own scroll bar's room takes the guide's paper while the guide fills the window (the review page's CSS)
    const at = !this.sec.hidden && this.atGuide(); if (document.documentElement.hasAttribute("data-rp-at-guide") !== at) document.documentElement.toggleAttribute("data-rp-at-guide", at);
    if (this.sec.hidden || !this.ready) return;
    const on = this.atGuide();
    if (on !== this._scrollOn) { this._scrollOn = on; this.post({ event: "scroll", on }); }
  }
  onMessage(e) {
    if (!this.ifr || e.source !== this.ifr.contentWindow || e.origin !== location.origin) return;
    const m = e.data, p = this.player; if (!m || typeof m !== "object" || m.type !== "rp-guide-embed" || !p) return;
    if (m.event === "ready") {
      this.ready = true; this._scrollOn = null;
      this.post({ event: "theme", theme: p.theme }); this.room();
      this.syncScroll(); if (this.atGuide()) this.deliver();
      this.dispatchEvent(new CustomEvent("guide-ready", { bubbles: true, composed: true }));
      return;
    }
    // a picture of the guide opened full size: the small player steps out of its way, and comes back when it closes
    if (m.event === "overlay") { p.overlayMini(!!m.open); return; }
    // a link to this video with no moment ("the walkthrough video"): back up to it, in its place
    if (m.event === "back") {
      const mine = slugOf(p.getAttribute("src")), want = m.project ? slugOf(m.project) : mine;
      if (want && mine && want !== mine) { try { const u = new URL(String(m.href || ""), location.href); if (u.origin === location.origin) location.href = u.href; } catch {} return; }
      p.backToVideo(); return;
    }
    if (m.event === "watch") {
      const t = Number(m.t); if (!Number.isFinite(t) || t < 0) return;
      const mine = slugOf(p.getAttribute("src")), want = m.project ? slugOf(m.project) : mine;
      // the plan's other video (the guide covers both): the review page opens that one, at that moment
      if (want && mine && want !== mine) { try { const u = new URL(String(m.href || ""), location.href); if (u.origin === location.origin) location.href = u.href; } catch {} return; }
      p.watchMoment(t);
    }
  }
}
customElements.define("reelplanning-guide", ReelplanningGuide);
