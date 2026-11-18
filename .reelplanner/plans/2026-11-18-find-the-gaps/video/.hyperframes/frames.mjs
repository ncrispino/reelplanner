// Writes every frame of the find-the-gaps plan video from one set of styles.
// node frames.mjs <video-dir> [frame numbers…]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const VD = process.argv[2];
const only = process.argv.slice(3).map(Number);
const sb = readFileSync(join(VD, "STORYBOARD.md"), "utf8");
const frames = [...sb.matchAll(/^## Frame (\d+) — (.*)$/gm)].map((m) => {
  const start = m.index, end = sb.indexOf("\n## Frame ", start + 5);
  const block = sb.slice(start, end < 0 ? undefined : end);
  const get = (k) => (block.match(new RegExp(`^- ${k}: (.*)$`, "m")) || [])[1];
  return { n: +m[1], title: m[2], src: get("src"), dur: parseFloat(get("duration")), vo: (get("voiceover") || "").replace(/^"|"$/g, "") };
});
const meta = existsSync(join(VD, "audio_meta.json")) ? JSON.parse(readFileSync(join(VD, "audio_meta.json"), "utf8")) : { voices: [] };
const norm = (w) => String(w).toLowerCase().replace(/[^a-z0-9]/g, "");
/** the start, in seconds from the scene's start, of the nth time `word` is said (a few words: the first of them) */
function cue(f, word, nth = 1) {
  const v = (meta.voices || []).find((x) => +x.frame === f.n);
  const want = String(word).split(/\s+/).map(norm).filter(Boolean);
  if (v && v.words?.length) {
    let seen = 0;
    for (let i = 0; i < v.words.length; i++) {
      if (want.every((w, j) => norm(v.words[i + j]?.text || "").startsWith(w))) { if (++seen === nth) return +(+v.words[i].start).toFixed(3); }
    }
  }
  const ws = f.vo.split(/\s+/); let seen = 0;
  for (let i = 0; i < ws.length; i++) if (want.every((w, j) => norm(ws[i + j] || "").startsWith(w))) { if (++seen === nth) return +((i / ws.length) * Math.max(1, f.dur - 0.8) + 0.2).toFixed(3); }
  return 0.3;
}

const CSS = (P) => `
  #root { position:relative; width:100%; height:100%; overflow:hidden; -webkit-font-smoothing:antialiased; }
  .${P}-bg { position:absolute; left:0; top:0; width:1920px; height:1080px; background:var(--rp-paper); }
  .${P}-scene { position:absolute; left:0; top:0; width:1920px; height:1080px; }
  .${P}-lab { position:absolute; font:500 26px/1 "JetBrains Mono"; letter-spacing:0.06em; color:rgba(var(--rp-ink-rgb),0.66); white-space:nowrap; }
  .${P}-h { position:absolute; font:400 64px/1.08 "EB Garamond"; letter-spacing:-0.015em; color:var(--rp-ink); }
  .${P}-q { position:absolute; font:400 54px/1.12 "EB Garamond"; letter-spacing:-0.015em; color:var(--rp-ink); }
  .${P}-big { position:absolute; font:400 46px/1.15 "EB Garamond"; color:var(--rp-ink); }
  .${P}-t { position:absolute; font:400 32px/1.35 "Inter"; color:var(--rp-ink); }
  .${P}-s { position:absolute; font:400 28px/1.35 "Inter"; color:rgba(var(--rp-ink-rgb),0.76); }
  .${P}-m { position:absolute; font:400 28px/1.4 "JetBrains Mono"; color:var(--rp-ink); white-space:nowrap; }
  .${P}-t code, .${P}-s code, .${P}-big code, .${P}-q code { font-family:"JetBrains Mono"; font-size:0.82em; }
  .${P}-card { position:absolute; box-sizing:border-box; border-radius:14px; background:var(--rp-tile); border:1px solid rgba(var(--rp-ink-rgb),0.16); }
  .${P}-paper { position:absolute; box-sizing:border-box; border-radius:14px; background:var(--rp-paper); border:1px solid rgba(var(--rp-ink-rgb),0.24); box-shadow:0 1px 3px rgba(var(--rp-shadow-rgb),0.08),0 4px 16px rgba(var(--rp-shadow-rgb),0.04); }
  .${P}-chip { position:absolute; height:52px; padding:0 22px; box-sizing:border-box; font:400 28px/48px "Inter"; color:var(--rp-ink); background:var(--rp-paper); border:2px solid rgba(var(--rp-ink-rgb),0.5); border-radius:26px; white-space:nowrap; }
  .${P}-chip.hot { border-color:var(--rp-coral); color:var(--rp-coral-deep); }
  .${P}-pin { position:absolute; height:44px; padding:0 14px; box-sizing:border-box; font:500 26px/44px "Inter"; color:var(--rp-on-ink); background:var(--rp-ink); border-radius:6px; white-space:nowrap; }
  .${P}-pin.hot { background:var(--rp-coral); }
  .${P}-pin em { font-style:normal; }
  .${P}-planned { position:absolute; height:40px; padding:0 14px; box-sizing:border-box; font:500 26px/36px "JetBrains Mono"; letter-spacing:0.04em; color:rgba(var(--rp-ink-rgb),0.75); border:2px dashed rgba(var(--rp-ink-rgb),0.5); border-radius:6px; white-space:nowrap; background:var(--rp-paper); }
  .${P}-slab { position:absolute; box-sizing:border-box; border-radius:10px; background:var(--rp-slab); border:1px solid rgba(var(--rp-slab-ink-rgb),0.14); overflow:hidden; }
  .${P}-bar { position:absolute; left:0; top:0; right:0; height:44px; background:var(--rp-slab-bar); }
  .${P}-bt { position:absolute; left:22px; top:11px; font:500 26px/1 "JetBrains Mono"; color:rgba(var(--rp-slab-ink-rgb),0.72); white-space:nowrap; }
  .${P}-code { position:absolute; font:400 26px/1.5 "JetBrains Mono"; color:var(--rp-slab-ink); white-space:pre; font-variant-ligatures:none; }
  .${P}-code .n { color:rgba(var(--rp-slab-ink-rgb),0.5); }
  .${P}-code .k { color:var(--rp-syn-num); }
  .${P}-code .hl { background:rgba(var(--rp-slab-ink-rgb),0.10); }
  .${P}-line { position:absolute; height:3px; background:rgba(var(--rp-ink-rgb),0.45); transform-origin:0 50%; }
  .${P}-line.hot { background:var(--rp-coral); height:4px; }
  .${P}-u { position:absolute; height:5px; background:var(--rp-coral); border-radius:2px; transform-origin:0 50%; }
  .${P}-strike { position:absolute; height:4px; background:var(--rp-ink); border-radius:2px; transform-origin:0 50%; }
  .${P}-ring { position:absolute; box-sizing:border-box; border-radius:16px; border:4px solid var(--rp-coral); pointer-events:none; }
  .${P}-opt { position:absolute; box-sizing:border-box; border-radius:12px; background:var(--rp-paper); border:1px solid rgba(var(--rp-ink-rgb),0.26); box-shadow:0 1px 3px rgba(var(--rp-shadow-rgb),0.08),0 4px 16px rgba(var(--rp-shadow-rgb),0.04); overflow:hidden; }
  .${P}-opt .k { position:absolute; left:30px; top:28px; font:500 30px/1 "JetBrains Mono"; letter-spacing:0.16em; color:rgba(var(--rp-ink-rgb),0.66); }
  .${P}-opt .l { position:absolute; left:30px; top:76px; right:26px; font:400 46px/1.08 "EB Garamond"; letter-spacing:-0.012em; color:var(--rp-ink); }
  .${P}-opt .c { position:absolute; left:30px; right:26px; bottom:30px; font:400 27px/1.3 "Inter"; color:rgba(var(--rp-ink-rgb),0.78); }
  .${P}-opt .r { position:absolute; right:24px; top:26px; font:500 26px/1 "JetBrains Mono"; letter-spacing:0.04em; color:var(--rp-coral-deep); }
  .${P}-node { position:absolute; box-sizing:border-box; border-radius:14px; background:var(--rp-tile); border:1px solid rgba(var(--rp-ink-rgb),0.16); font:500 34px/1 "Inter"; color:var(--rp-ink); display:flex; align-items:center; justify-content:center; }
  .${P}-node.navy { background:var(--rp-slab); color:var(--rp-slab-ink); border-color:rgba(var(--rp-slab-ink-rgb),0.14); }
  .${P}-btn { position:absolute; height:64px; box-sizing:border-box; padding:0 22px; font:500 28px/60px "Inter"; color:var(--rp-ink); background:var(--rp-paper); border:2px solid rgba(var(--rp-ink-rgb),0.55); border-radius:10px; white-space:nowrap; text-align:center; }
  .${P}-btn.ink { background:var(--rp-ink); color:var(--rp-on-ink); border-color:var(--rp-ink); }
  .${P}-row { position:absolute; box-sizing:border-box; border-top:1px solid rgba(var(--rp-ink-rgb),0.2); }
  .${P}-dim { opacity:0.55; }
  .${P}-mark { text-decoration:underline; text-decoration-color:var(--rp-coral); text-decoration-thickness:5px; text-underline-offset:10px; }
  .${P}-ink { text-decoration:underline; text-decoration-color:rgba(var(--rp-ink-rgb),0.5); text-decoration-thickness:2px; text-underline-offset:8px; }
  .${P}-ok { color:var(--rp-ink); }
  .${P}-slot { position:absolute; left:0; width:960px; height:104px; box-sizing:border-box; border-radius:12px; border:1px solid rgba(var(--rp-ink-rgb),0.14); background:var(--rp-tile); }
  .${P}-slot .n { position:absolute; left:26px; top:34px; font:500 28px/1 "JetBrains Mono"; color:var(--rp-ink); }
  .${P}-slot .t { position:absolute; left:80px; top:18px; font:500 32px/1.2 "Inter"; color:var(--rp-ink); white-space:nowrap; }
  .${P}-slot .d { position:absolute; left:80px; top:68px; font:500 26px/1 "JetBrains Mono"; letter-spacing:0.04em; color:var(--rp-coral-deep); }
`;

// --- building blocks -------------------------------------------------------------------------------
let P, F, A; // prefix, frame, animations
const anim = (sel, kind, t, extra = {}) => A.push({ sel, kind, t, ...extra });
const id = (s) => `${P}-${s}`;
const pos = (x, y, w, h) => `left:${x}px; top:${y}px;${w != null ? ` width:${w}px;` : ""}${h != null ? ` height:${h}px;` : ""}`;
const el = (cls, key, x, y, w, h, inner = "", attrs = "") => `<div class="${cls.split(" ").map((c) => (c.startsWith("+") ? c.slice(1) : `${P}-${c}`)).join(" ")}" id="${id(key)}" style="${pos(x, y, w, h)}"${attrs ? " " + attrs : ""}>${inner}</div>`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const label = (key, x, y, text) => el("lab", key, x, y, null, null, esc(text));
const planned = () => el("planned", "planned", 1380, 880, null, null, "planned: not built yet");
const kicker = (text) => label("kick", 160, 84, text);

function optionCards({ y = 330, h = 420, opts, rec = null, recCue = null, cap = {}, w = 500, gap = 30, x0 = 160 }) {
  return opts.map((o, i) => {
    const k = "abcd"[i], x = x0 + i * (w + gap);
    anim(`#${id("opt-" + k)}`, "up", cue(F, o.cueWord || ["A", "B", "C", "D"][i], o.nth || 1));
    const r = rec === k ? `<span class="r" id="${id("rec")}">recommended</span>` : "";
    if (rec === k && recCue) anim(`#${id("rec")}`, "fade", recCue);
    return el("opt", "opt-" + k, x, y, w, h, `<span class="k">${k.toUpperCase()}</span>${r}<span class="l">${esc(o.label)}</span> ${cap[k] ? `<span class="c">${cap[k]}</span>` : ""}`, `data-option="${k}" data-plan-option="${k}"`);
  }).join("\n");
}
function question(text, y = 150, h = null) { anim(`#${id("q")}`, "left", 0.15); return el("q", "q", 160, y, 1600, h, esc(text).replace(/`([^`]+)`/g, "<code>$1</code>"), "data-question"); }

// --- the frames ------------------------------------------------------------------------------------
const B = {};
B[1] = () => {
  anim(`#${id("quote")}`, "up", 0.2);
  A.push({ sel: `#${id("assume")}`, kind: "mark", t: cue(F, "assume") });
  return `${label("kick", 160, 120, "GitHub issue #57 · your words, as sent")}
  <div class="${P}-card" id="${id("quote")}" style="${pos(160, 180, 1600, 340)}" data-artifact="the owner's message, issue #57">
    <div class="${P}-big" style="left:56px; top:48px; width:1490px; font-size:50px; line-height:1.4">basiclaly what i need here is a way to align <span class="${P}-ink">me</span> and <span class="${P}-ink">the actual code</span> + <span class="${P}-ink">agent writing it</span>. oftentimes we are not aligned, <span class="${P}-mark" id="${id("assume")}">i assume it is one way when it is actually another.</span></div>
  </div>
  ${label("three", 160, 570, "three pictures: you · the code · the agent writing it")}`;
};
B[2] = () => {
  const rows = [["Send", "the button that ends your review: to the session that opened this page and waits, or a headless run where the config sets one", "review", "review loop"], ["a quick check", "predict a case the video didn't show", "quick", "quick checks"], ["an explainer", "its sources quoted word for word, as a card quotes the code", "explainer", "explain first"], ["your memory", "~/.reelplanner/you.jsonl: what you watched, and what you know", "memory", "memory"]];
  anim(`#${id("h")}`, "left", 0.15);
  return `${el("h", "h", 160, 110, 1600, null, "Four things this plan builds on")}
  ${rows.map(([k, v, w, src], i) => { anim(`#${id("r" + i)}`, "up", cue(F, w)); return el("row", "r" + i, 160, 250 + i * 150, 1600, 150, `<div class="${P}-big" style="left:0; top:38px">${esc(k)}</div><div class="${P}-t" style="left:520px; top:36px; width:1050px">${esc(v)}</div>`); }).join("\n")}`;
};
B[3] = () => {
  const side = (k, y, a, b, word) => { anim(`#${id(k)}`, "up", cue(F, word)); anim(`#${id(k + "-ln")}`, "hot", cue(F, word), { until: cue(F, word) + 4 }); return el("paper", k, 860, y, 900, 180, `<div class="${P}-lab" style="left:28px; top:24px">${esc(a)}</div><div class="${P}-t" style="left:28px; top:64px; width:844px">${esc(b)}</div>`); };
  anim(`#${id("n-you")}`, "up", cue(F, "you")); anim(`#${id("n-agent")}`, "up", cue(F, "agent")); anim(`#${id("n-code")}`, "up", cue(F, "code", 2));
  const ln = (k, x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:rgba(var(--rp-ink-rgb),0.45)" stroke-width="4" stroke-linecap="round"/><line id="${id(k + "-ln")}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--rp-coral); opacity:0" stroke-width="6" stroke-linecap="round"/>`;
  return `<svg style="position:absolute; left:0; top:0; width:1920px; height:1080px; overflow:visible">
    ${ln("s-yc", 340, 668, 520, 668)}${ln("s-ac", 430, 296, 610, 620)}${ln("s-ya", 430, 296, 250, 620)}
  </svg>
  ${el("node", "n-agent", 310, 200, 240, 96, "the agent")}
  ${el("node", "n-you", 100, 620, 240, 96, "you")}
  ${el("node navy", "n-code", 520, 620, 240, 96, "the code")}
  ${side("s-yc", 160, "gap 1 · you and the code", "you: it waits for you · the code: this repo's config starts a headless run", "waits")}
  ${side("s-ac", 380, "gap 2 · the agent and the code", "the agent: a waiting session that doesn't take it gets one try · the code: Send tries again 15 s later", "remembers")}
  ${side("s-ya", 600, "gap 3 · you and the agent", "you meant: your open session · the agent read: any agent", "asked")}`;
};
B[4] = () => {
  anim(`#${id("today")}`, "up", cue(F, "today"));
  const rows = [["a few cards, three ways in", "steps 1, 2", "one"], ["your own words, checked", "step 3", "three"], ["one click a gap", "step 4", "four"], ["before a plan · quick checks settle like cards", "step 5", "five", 2]];
  return `${label("tl", 160, 150, "today")}
  <div id="${id("today")}" style="${pos(160, 200, 600, 200)}; position:absolute"><div class="${P}-node" style="${pos(0, 40, 220, 96)}">the agent</div><div class="${P}-line" style="${pos(232, 88, 120)}"></div><div class="${P}-big" style="left:350px; top:58px">→</div><div class="${P}-node" style="${pos(400, 40, 180, 96)}">you</div><div class="${P}-s" style="left:0; top:160px; width:600px">one way</div></div>
  ${label("ch", 900, 150, "this plan")}
  ${rows.map(([a, b, w, nth], i) => { anim(`#${id("r" + i)}`, "up", cue(F, w, nth || (w === "one" ? 1 : 1))); return el("row", "r" + i, 900, 200 + i * 140, 860, 140, `<div class="${P}-big" style="left:0; top:40px">${esc(a)}</div><div class="${P}-lab" style="right:0; top:52px; left:auto">${esc(b)}</div>`); }).join("\n")}`;
};
B[5] = () => {
  const card = (k, x, kind, q, extra, word) => { anim(`#${id(k)}`, "up", cue(F, word)); return el("paper", k, x, 200, 500, 560, `<div class="${P}-pin" style="left:30px; top:30px">${kind}</div><div class="${P}-big" style="left:30px; top:110px; width:440px; font-size:40px">${esc(q)}</div>${extra}`); };
  anim(`#${id("count")}`, "fade", cue(F, "round"));
  const opts = ["it waits for the next session", "a headless run starts", "it is lost"].map((o, i) => `<div class="${P}-s" style="left:30px; top:${370 + i * 52}px; width:440px">${"ABC"[i]} · ${o}</div>`).join("");
  return `${planned()}
  ${card("c1", 160, "predict", "In this repo, you press Send and no session is waiting. What happens?", opts, "predict")}
  ${card("c2", 710, "assume", "I'm assuming you mean the session you have open.", `<div class="${P}-s" style="left:30px; top:400px; width:440px">Right · Not quite: say what, and it goes into the plan</div>`, "assume")}
  ${card("c3", 1260, "say", "Say how you think a review reaches the agent.", `<div class="${P}-s" style="left:30px; top:470px">hold Space, or type</div>`, "say")}
  ${label("count", 160, 800, "cards c1, c2, c3 … numbered in their round · at most 6")}`;
};
B[6] = () => {
  const src = [["what your words take for granted", "words"], ["quick checks you got wrong", "quick"], ["commits since you watched", "commits"], ["its own assumptions", "assumptions"]];
  anim(`#${id("cand")}`, "up", cue(F, "keeps")); anim(`#${id("six")}`, "up", cue(F, "six"));
  anim(`#${id("card")}`, "up", cue(F, "each must"));
  anim(`#${id("chk")}`, "up", cue(F, "fresh"));
  anim(`#${id("strike")}`, "draw", cue(F, "disagrees")); anim(`#${id("seen")}`, "up", cue(F, "never"));
  return `${src.map(([s, w], i) => { anim(`#${id("s" + i)}`, "up", cue(F, w)); return el("chip", "s" + i, 160, 180 + i * 84, null, null, esc(s)); }).join("\n")}
  ${el("node", "cand", 740, 300, 260, 96, "candidates")}
  ${el("node", "six", 740, 460, 260, 96, "at most 6")}
  <div class="${P}-card" id="${id("card")}" style="${pos(1100, 120, 660, 300)}">
    <div class="${P}-lab" style="left:30px; top:24px">c4, as the agent wrote it</div>
    <div class="${P}-t" style="left:30px; top:64px; width:600px">A session is waiting but doesn't take the review. Does Send try again?</div>
    <div class="${P}-m" style="left:30px; top:160px">answer: no</div><div class="${P}-strike" id="${id("strike")}" style="${pos(30, 180, 200)}"></div>
    <div class="${P}-s" style="left:30px; top:214px; width:600px; font-size:24px">why you might picture it otherwise: the page says Sent at once · what depends on it: step 2</div>
  </div>
  ${el("chip hot", "chk", 1100, 440, null, null, "fresh checker reads the code · fixed before the round opens")}
  <div class="${P}-paper" id="${id("seen")}" style="${pos(1100, 520, 660, 280)}">
    <div class="${P}-lab" style="left:30px; top:24px">c4, the card you see</div>
    <div class="${P}-t" style="left:30px; top:64px; width:600px">A session is waiting but doesn't take the review. Does Send try again?</div>
    <div class="${P}-m" style="left:30px; top:196px; color:var(--rp-coral-deep)">answer: yes · 15 s later</div>
  </div>`;
};
B[7] = () => {
  const t0 = cue(F, "turns");
  anim(`#${id("front")}`, "flipout", t0); anim(`#${id("back")}`, "flipin", t0 + 0.35);
  anim(`#${id("pick")}`, "fade", cue(F, "letter"));
  anim(`#${id("btns")}`, "up", cue(F, "gap")); anim(`#${id("ns")}`, "fade", cue(F, "two")); anim(`#${id("skip")}`, "fade", cue(F, "skip"));
  anim(`#${id("gl")}`, "fade", cue(F, "headless")); anim(`#${id("gl0")}`, "fade", cue(F, "config"));
  return `${planned(1600, 60)}
  <div class="${P}-paper" id="${id("front")}" style="${pos(260, 120, 1400, 740)}">
    <div class="${P}-lab" style="left:44px; top:40px">card c3 · predict · step 2</div>
    <div class="${P}-q" style="left:44px; top:100px; width:1300px">In this repo, you press Send and no session is waiting. What happens to the review?</div>
    ${["it waits for the next session", "a headless run starts on the review", "it is lost"].map((o, i) => `<div class="${P}-paper" style="${pos(44 + i * 440, 360, 410, 200)}"><div class="${P}-lab" style="left:26px; top:26px">${"ABC"[i]}</div><div class="${P}-big" style="left:26px; top:70px; width:360px; font-size:40px">${o}</div></div>`).join("")}
    <div class="${P}-ring" id="${id("pick")}" style="${pos(36, 352, 426, 216)}"></div>
    <div class="${P}-lab" style="left:44px; top:620px">A–C or N, not sure</div>
  </div>
  <div class="${P}-paper" id="${id("back")}" style="${pos(260, 120, 1400, 740)}">
    <div class="${P}-lab" style="left:44px; top:30px">card c3, turned over</div>
    <div class="${P}-t" style="left:44px; top:66px; width:1312px; font-size:28px">In this repo, you press Send and no session is waiting. What happens?</div>
    <div class="${P}-s" style="left:44px; top:110px; width:1312px; font-size:26px">your pick A: it waits for the next session · the answer B: a headless run starts on the review</div>
    <div class="${P}-slab" style="${pos(44, 160, 1312, 190)}" data-artifact="scripts/lib/inbox.mjs, lines 700–702"><div class="${P}-bar"></div><div class="${P}-bt">scripts/lib/inbox.mjs · 700–702</div>
      <div class="${P}-code" style="left:24px; top:56px"><span class="n">700</span>  if (!question &amp;&amp; !isMachineInbox(rp)) {
<span class="n">701</span>    const result = await <span class="k">start</span>();
<span class="n">702</span>    if (result.started) return { handledBy: "agent", …</div><div class="${P}-pin" id="${id("gl0")}" style="left:740px; top:48px"><em data-gloss="isMachineInbox">a review, not a question, in a set-up repo</em></div><div class="${P}-pin hot" id="${id("gl")}" style="left:640px; top:96px"><em data-gloss="start">a headless run</em></div></div>
    <div class="${P}-slab" style="${pos(44, 366, 1312, 96)}" data-artifact=".reelplanner/config.json, agent.command"><div class="${P}-bar"></div><div class="${P}-bt">.reelplanner/config.json</div>
      <div class="${P}-code" style="left:24px; top:50px">"command": "claude --permission-mode auto …"</div></div>
    <div class="${P}-t" style="left:44px; top:480px; width:1312px">A headless command is set here, so a review that no open session picks up starts a headless run.</div>
    <div id="${id("btns")}" style="position:absolute; left:44px; top:590px; width:1312px; height:70px">${["Got it", "Change the plan", "The code is wrong", "Show me more"].map((b, i) => `<div class="${P}-btn" style="left:${i * 320}px; top:0; width:300px">${b}</div>`).join("")}</div>
    <div class="${P}-lab" id="${id("ns")}" style="left:44px; top:690px">not sure: Got it · Show me more</div>
    <div class="${P}-s" id="${id("skip")}" style="left:1130px; top:684px">Skip the rest</div>
  </div></div>`;
};
const decision = (o) => () => {
  return `${kicker(o.kick)}${question(o.q, 140)}${o.pre ? o.pre() : ""}
  ${optionCards({ y: o.y || 320, h: o.h || 440, opts: o.opts, rec: o.rec, recCue: cue(F, "recommend"), cap: o.cap })}`;
};
B[8] = decision({ kick: "question 1 · step 2", q: "Where do a round's cards show up first?", rec: "a",
  opts: [{ label: "The review page" }, { label: "The chat" }, { label: "Both from the start" }],
  cap: { a: "a key, a box to click, your spoken words, the code on the card", b: "the agent asks; plain text, nothing to click or say", c: "both at once; twice the work" } });
const branch = (k, inner) => () => `${kicker(k)}${inner()}`;
B[9] = branch("If A", () => { anim(`#${id("pg")}`, "up", 0.3); return `<div class="${P}-paper" id="${id("pg")}" style="${pos(360, 200, 1200, 460)}"><div class="${P}-lab" style="left:36px; top:30px">review page · card c3, turned over</div><div class="${P}-slab" style="${pos(36, 90, 1128, 190)}" data-artifact="scripts/lib/inbox.mjs, lines 700–701"><div class="${P}-bar"></div><div class="${P}-bt">scripts/lib/inbox.mjs · 700–701</div><div class="${P}-code" style="left:24px; top:62px"><span class="n">700</span>  if (!question &amp;&amp; !isMachineInbox(rp)) {
<span class="n">701</span>    const result = await start();</div></div><div class="${P}-t" style="left:36px; top:310px; width:1100px">A headless command is set here, so a run starts.</div><div class="${P}-s" style="left:36px; top:380px">Got it · Change the plan · The code is wrong · Show me more</div></div>`; });
B[10] = branch("If B", () => { anim(`#${id("ag")}`, "up", 0.3); anim(`#${id("me")}`, "up", 1.2); anim(`#${id("ln")}`, "up", 2.2); return `${el("paper", "ag", 260, 180, 1100, 160, `<div class="${P}-lab" style="left:28px; top:22px">agent</div><div class="${P}-t" style="left:28px; top:64px; width:1040px">c3: you press Send, no session waiting. A waits · B a headless run · C lost?</div>`)}${el("chip", "me", 1240, 360, null, null, "you: A")}${el("card", "ln", 260, 450, 1100, 220, `<div class="${P}-lab" style="left:28px; top:-40px">agent</div><div class="${P}-m" style="left:28px; top:28px">B. line 700: if (!question …</div><div class="${P}-m" style="left:28px; top:80px">701: const result = await start();</div><div class="${P}-s" style="left:28px; top:150px">plain text in the chat</div>`)}`; });
B[11] = branch("If C", () => { anim(`#${id("l")}`, "up", 0.3); anim(`#${id("r")}`, "up", 0.6); anim(`#${id("j")}`, "fade", 1.2); return `${el("paper", "l", 160, 220, 700, 420, `<div class="${P}-lab" style="left:28px; top:24px">review page</div><div class="${P}-big" style="left:28px; top:80px; width:640px; font-size:38px">In this repo, you press Send and no session is waiting. What happens?</div><div class="${P}-s" style="left:28px; top:250px">A waits · B a headless run · C lost</div><div class="${P}-s" style="left:28px; top:310px">a key: A, B, C or N</div>`)}${el("paper", "r", 1060, 220, 700, 420, `<div class="${P}-lab" style="left:28px; top:24px">chat</div><div class="${P}-lab" style="left:28px; top:80px">agent</div><div class="${P}-t" style="left:28px; top:120px; width:640px">c3: you press Send, no session waiting. A waits · B a headless run · C lost?</div><div class="${P}-lab" style="left:28px; top:300px">you: A</div>`)}${el("chip hot", "j", 820, 700, null, null, "one round, two places")}`; });
const check = (o) => () => `${label("ctx", 160, 80, o.ctx)}${label("case", 160, 130, o.cs)}${question(o.q, 190)}
  ${optionCards({ y: 420, h: 300, opts: o.opts.map((l) => ({ label: l })) })}`;
B[12] = check({ ctx: "quick check · step 1", cs: "card c2 says B · the fresh checker picks C", q: "A card about `reel status` says B; the fresh checker reads the code and picks C. What do you see?", opts: ["Both answers, side by side", "The card fixed, or no card", "The card as written, with a note"] });
B[13] = () => {
  const s = [["When I press Send it goes to my session.", "✓", "a match · checked against scripts/lib/inbox.mjs:673", "session"], ["If I'm not there, it waits for me.", "✗", "a gap · checked against inbox.mjs:700–705 · config.json", "waits"], ["It should tell me when it's been taken.", "?", "neither: an assume card, next in this round", "should"]];
  anim(`#${id("mic")}`, "fade", cue(F, "whisper"));
  anim(`#${id("note")}`, "fade", cue(F, "chose"));
  anim(`#${id("settle")}`, "fade", cue(F, "gap"));
  return `<div class="${P}-paper" id="${id("pg")}" style="${pos(160, 110, 1600, 730)}" data-artifact="your words, checked against scripts/lib/inbox.mjs">
    <div class="${P}-lab" style="left:40px; top:30px">card c6 · say · your words, as you said them</div>
    <div class="${P}-planned" style="left:830px; top:22px">planned: not built yet</div>
    <div class="${P}-chip" id="${id("mic")}" style="left:900px; top:84px">hold Space on this page · or type, and fix it</div>
    ${s.map(([t, m, src, w], i) => { anim(`#${id("w" + i)}`, "fade", i ? cue(F, w) : 0.3); anim(`#${id("m" + i)}`, "up", cue(F, w)); const cls = m === "✗" ? P + "-mark" : m === "?" ? P + "-ink" : ""; return `<div class="${P}-big" id="${id("w" + i)}" style="left:40px; top:${150 + i * 170}px; width:1000px; font-size:42px"><span class="${cls}">“${esc(t)}”</span></div><div class="${P}-pin" id="${id("m" + i)}" style="left:40px; top:${212 + i * 170}px">${m} ${esc(src)}</div>`; }).join("\n")}
    <div class="${P}-s" id="${id("settle")}" style="left:40px; top:434px; width:1500px; font-size:24px">→ a gap card: Got it · Change the plan · The code is wrong · Show me more</div>
    <div class="${P}-lab" id="${id("note")}" style="left:40px; top:676px">checked by the waiting session (decision D-315), then the fresh checker</div>
  </div>`;
};
B[14] = decision({ kick: "question 2 · step 3", q: "Who reads your spoken explanation against the code?", rec: "a",
  opts: [{ label: "The waiting session" }, { label: "A small hosted model" }, { label: "The agent, after Send" }],
  cap: { a: "knows the code best · about 1 min", b: "a few seconds · your words leave the machine", c: "sent with the round, like a review · marked when it comes back" } });
const claims = (tag) => ["goes to my session ✓", "waits for me ✗", "tell me when taken ?"].map((c, i) => `<div class="${P}-t" style="left:0; top:${i * 70}px">${c}</div>`).join("") + `<div class="${P}-chip hot" style="left:620px; top:60px">${tag}</div>`;
B[15] = branch("If A", () => { anim(`#${id("c")}`, "up", 0.3); return `<div id="${id("c")}" style="position:absolute; ${pos(360, 300, 1200, 300)}">${claims("≈ 1 min")}</div>`; });
B[16] = branch("If B", () => { anim(`#${id("c")}`, "up", 0.3); return `<div id="${id("c")}" style="position:absolute; ${pos(360, 300, 1200, 300)}">${claims("≈ 3 s · sent to a hosted model")}</div>`; });
B[17] = branch("If C", () => { anim(`#${id("c")}`, "up", 0.3); anim(`#${id("b")}`, "fade", 1.6); return `<div id="${id("c")}" style="position:absolute; ${pos(360, 300, 1200, 300)}">${["goes to my session", "waits for me", "tell me when taken"].map((c, i) => `<div class="${P}-t" style="left:0; top:${i * 70}px">${c}</div>`).join("")}</div>${el("chip hot", "b", 980, 360, null, null, "marked when the round comes back")}`; });
B[18] = check({ ctx: "quick check · step 2", cs: "card c5 · you press N", q: "On card c5, you press N: not sure. What comes next?", opts: ["The next card; nothing kept", "A gap: Got it or Show me more", "The round ends"] });
B[19] = () => {
  const bs = [["Got it", "your memory · you.jsonl", "got"], ["Change the plan", "plan.md · You told me first", "change"], ["The code is wrong", "a plan step · or issue.md to file", "wrong"], ["Show me more", "one short video, at the end", "show"]];
  anim(`#${id("log")}`, "up", cue(F, "decision"));
  return `${planned(1600, 60)}
  ${bs.map(([b, d, w], i) => { const x = 160 + i * 410; anim(`#${id("b" + i)}`, "up", cue(F, w)); anim(`#${id("d" + i)}`, "up", cue(F, w) + 0.4); return `${el("btn ink", "b" + i, x, 170, 380)}`.replace("></div>", `>${b}</div>`) + `<div class="${P}-line" style="${pos(x + 188, 250, 3, 160)}; width:3px; height:160px"></div>` + el("card", "d" + i, x, 420, 380, 150, `<div class="${P}-t" style="left:24px; top:28px; width:330px">${esc(d)}</div>`); }).join("\n")}
  <div id="${id("log")}" style="position:absolute; ${pos(160, 660, 1600, 140)}"><div class="${P}-node ${P}-dim" style="${pos(0, 20, 300, 84)}">decision log</div><div class="${P}-t" style="left:340px; top:40px; width:1260px">nothing from a round goes in · a plan's own questions do</div></div>`;
};
B[20] = () => {
  anim(`#${id("mem")}`, "up", cue(F, "fingerprint")); anim(`#${id("fp")}`, "fade", cue(F, "short"));
  return `${kicker("question 3 · step 4")}
  <div class="${P}-card" id="${id("mem")}" style="${pos(160, 130, 1600, 76)}"><div class="${P}-m" style="left:24px; top:18px">knows · a headless run takes it · inbox.mjs:700–705 · 4b1e</div></div>
  ${el("pin hot", "fp", 1050, 220, null, null, "fingerprint ↑")}
  ${question("After Got it, when does the same card return?", 300)}
  ${optionCards({ y: 410, h: 400, opts: [{ label: "Only when its lines change" }, { label: "Once more, a few days later" }, { label: "Whenever a plan needs it" }], rec: "a", recCue: cue(F, "recommend"), cap: { a: "known until 4b1e changes", b: "a new case, days on", c: "each plan that leans on it" } })}`;
};
const timeline = (pts) => { const gap = 1400 / Math.max(1, pts.length - 1); pts.forEach((_, i) => anim(`#${id("t" + i)}`, "up", 0.3 + i * 0.8)); return `<div class="${P}-line" style="${pos(220, 420, 1480)}"></div>` + pts.map((p, i) => { const x = 260 + i * gap; return `<div id="${id("t" + i)}" style="position:absolute; ${pos(x - 170, 396, 340, 200)}"><div class="${P}-pin${p.hot ? " hot" : ""}" style="left:162px; top:6px; width:16px; height:40px; padding:0"></div><div class="${P}-t" style="left:0; top:70px; width:340px; text-align:center">${esc(p.t)}</div></div>`; }).join(""); };
B[21] = branch("If A", () => timeline([{ t: "Got it · 4b1e" }, { t: "weeks: not asked" }, { t: "inbox.mjs edited · 9c07" }, { t: "asked again", hot: 1 }]));
B[22] = branch("If B", () => timeline([{ t: "Got it" }, { t: "three days" }, { t: "a new case", hot: 1 }]));
B[23] = branch("If C", () => timeline([{ t: "Got it" }, { t: "a plan · asked", hot: 1 }, { t: "a plan · asked", hot: 1 }]));
B[24] = check({ ctx: "quick check · step 3", cs: "your words: “and it should only go to the session I have open”", q: "You say: ‘and it should only go to the session I have open.’ How is that claim marked?", opts: ["A match", "A gap", "Neither: an assume card"] });
B[25] = () => {
  anim(`#${id("a")}`, "up", cue(F, "before")); anim(`#${id("b")}`, "up", cue(F, "wrong")); anim(`#${id("c")}`, "up", cue(F, "status"));
  const r = (t, y, cls = "m") => `<div class="${P}-${cls}" style="left:30px; top:${y}px; width:440px">${t}</div>`;
  return `${planned(1600, 60)}
  ${el("paper", "a", 160, 160, 500, 640, `<div class="${P}-lab" style="left:30px; top:30px">before a plan</div><div class="${P}-big" style="left:30px; top:90px; width:440px; font-size:40px">likely gaps listed</div><div class="${P}-big" style="left:30px; top:240px; width:440px; font-size:40px">→ a round, if worth it</div><div class="${P}-s" style="left:30px; top:400px; width:440px">if not, one line in the plan says why</div>`)}
  ${el("paper", "b", 710, 160, 500, 640, `<div class="${P}-lab" style="left:30px; top:30px">a quick check, wrong</div>${["Got it", "Change the plan", "Show me more"].map((t, i) => `<div class="${P}-btn" style="left:30px; top:${80 + i * 76}px; width:440px">${t}</div>`).join("")}<div class="${P}-btn ${P}-dim" style="left:30px; top:308px; width:440px; border-style:dashed">The code is wrong</div><div class="${P}-lab" style="left:30px; top:380px">only once there is code</div><div class="${P}-card" style="${pos(30, 420, 440, 56)}"><div class="${P}-s" style="left:18px; top:10px">your words…</div></div>${r("Change the plan → the agent, as a comment", 488, "s")}${r("Approve is never blocked · left unsettled, it is kept as a wrong check is now", 566, "s")}`)}
  ${el("paper", "c", 1260, 160, 500, 640, `<div class="${P}-lab" style="left:30px; top:30px">reel status</div>${r("rounds 3 · gaps 11", 80)}${r("Got it 7", 124)}${r("Change the plan 3", 168)}${r("The code is wrong 1", 212)}${r("Show me more 0", 256)}${r("not sure 2 (in the 11) · skipped 1", 300)}${r("late fixes after: with a round 1", 364)}${r("likely gap, no round 4", 408)}${r("under 5 plans of each: too few to compare", 470, "s")}`)}`;
};

B[26] = decision({ kick: "question 4 · step 5", q: "How often does a round come ahead of a plan?", rec: "b",
  pre: () => label("reqs", 160, 232, "two requests: make Send reach my open session · rename the Save button"),
  y: 300, h: 460,
  opts: [{ label: "Every plan on existing code" }, { label: "When a gap is likely and costly" }, { label: "Only when you ask" }],
  cap: { a: "Send · 4 cards<br>rename · a round too", b: "Send · 4 cards<br>rename · none, and why", c: "none unless you say<br>“align me first”" } });
const plans = (rows) => { rows.forEach((_, i) => anim(`#${id("p" + i)}`, "up", 0.3 + i * 0.7)); return rows.map(([a, b, hot], i) => el("row", "p" + i, 260, 260 + i * 150, 1400, 150, `<div class="${P}-big" style="left:0; top:44px">${esc(a)}</div><div class="${P}-chip${hot ? " hot" : ""}" style="right:0; left:auto; top:44px">${esc(b)}</div>`)).join(""); };
B[27] = branch("If A", () => plans([["make Send reach my open session", "a round · 4 cards", 1], ["rename the Save button", "a round too", 1]]));
B[28] = branch("If B", () => plans([["make Send reach my open session", "a round · 4 cards", 1], ["rename the Save button", "no round · one line why"]]));
B[29] = branch("If C", () => plans([["“align me first”", "a round", 1], ["any other request", "no round"]]));
B[30] = check({ ctx: "quick check · step 4", cs: "a round · Show me more on c2 and c4", q: "In a round, you press Show me more on two gaps. How many videos are made?", opts: ["Two, one a gap", "One, at the end of the round", "None; text only"] });
B[31] = check({ ctx: "quick check · step 5", cs: "a video like this one · a quick check you got wrong · Change the plan", q: "In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?", opts: ["Your memory, as known", "The agent, as a comment", "Straight into the decision log"] });
B[32] = () => {
  const st = [["A round of cards", null], ["One round, three ways in", "decision D-314 · the chat first"], ["Your own words, checked", "decision D-315 · the waiting session"], ["Settle each gap", "decision D-316 · once more, days later"], ["Before a plan, and on checks", "decision D-317 · likely and costly"]];
  st.forEach((_, i) => anim(`#${id("s" + i)}`, "up", 0.3 + i * 0.35));
  anim(`#${id("tri")}`, "fade", 2.2);
  return `${label("kick", 160, 90, "the revised plan · find the gaps")}
  <div style="position:absolute; ${pos(160, 150, 900, 640)}">${st.map(([t, q], i) => `<div class="${P}-slot" id="${id("s" + i)}" data-plan-step="${i + 1}" style="top:${i * 124}px"><span class="n">${i + 1}</span> <span class="t">${esc(t)}</span> <span class="d">${q ? esc(q) : ""}</span></div>`).join("")}</div>
  ${label("ask", 160, 800, "approve the revised plan, or draw on a step to leave a note")}
  <div id="${id("tri")}" style="position:absolute; ${pos(1200, 220, 560, 480)}">
    <svg style="position:absolute; left:0; top:0; width:560px; height:480px; overflow:visible"><polygon points="280,60 60,400 500,400" fill="none" style="stroke:rgba(var(--rp-ink-rgb),0.55)" stroke-width="4" stroke-linejoin="round"/></svg>
    <div class="${P}-node" style="${pos(170, 10, 220, 80)}; font-size:28px">the agent</div>
    <div class="${P}-node" style="${pos(0, 370, 160, 80)}; font-size:28px">you</div>
    <div class="${P}-node navy" style="${pos(380, 370, 180, 80)}; font-size:28px">the code</div>
  </div>`;
};

B["4b"] = () => {
  const rows = [["Three ways to answer", "your decision D-314", "one"], ["Asked once more, days later", "your decision D-316", "two"], ["Three quick checks you got wrong", "steps 1, 2, 3", "three"]];
  anim(`#${id("h")}`, "left", 0.15); anim(`#${id("kept")}`, "fade", cue(F, "those"));
  return `${label("kick", 160, 84, "your review · changes requested")}${el("h", "h", 160, 130, 1600, null, "What your review changed")}
  ${rows.map(([a, b, w], i) => { anim(`#${id("r" + i)}`, "up", cue(F, w)); return el("row", "r" + i, 160, 290 + i * 150, 1600, 150, `<div class="${P}-big" style="left:0; top:44px">${esc(a)}</div><div class="${P}-chip" style="right:0; left:auto; top:46px">${esc(b)}</div>`); }).join("\n")}
  ${label("kept", 160, 780, "kept as recommended · the waiting session checks your words (decision D-315) · asked first only when a gap is likely and costly (decision D-317)")}`;
};
B["7a"] = () => {
  anim(`#${id("rec")}`, "up", cue(F, "one round")); anim(`#${id("tag")}`, "fade", cue(F, "decided"));
  const way = (k, x, t, word, inner, first) => { anim(`#${id(k)}`, "up", cue(F, word)); return el("paper", k, x, 330, 500, 470, `<div class="${P}-lab" style="left:28px; top:26px">${t}${first ? " · built first" : ""}</div>${inner}`); };
  const bt = "font-size:24px";
  return `${planned(1600, 60)}
  ${el("node navy", "rec", 760, 130, 400, 96, "align.md · one record")}${label("recl", 470, 240, "one file a round · .reelplanner/align/, or ~/.reelplanner/")}
  ${el("chip", "tag", 1200, 152, null, null, "your decision D-314")}
  <div class="${P}-line" style="${pos(958, 280, 3, 50)}; width:3px; height:50px"></div><div class="${P}-line" style="${pos(410, 300, 1100)}"></div>
  ${way("w0", 160, "the chat", "chat", `<div class="${P}-s" style="left:28px; top:70px; width:444px">AskUserQuestion · c3: no session waiting. What happens?</div><div class="${P}-btn" style="left:28px; top:180px; width:444px; ${bt}">A · it waits for the next session</div><div class="${P}-btn ink" style="left:28px; top:254px; width:444px; ${bt}">B · a headless run starts</div><div class="${P}-slab" style="${pos(28, 336, 444, 104)}"><div class="${P}-code" style="left:18px; top:16px; font-size:22px"><span class="n">700</span>  if (!question …
<span class="n">701</span>    await start();</div></div>`, true)}
  ${way("w1", 710, "the review page", "review page", `<div class="${P}-s" style="left:28px; top:70px; width:444px">card c3, turned over</div><div class="${P}-slab" style="${pos(28, 120, 444, 150)}"><div class="${P}-code" style="left:18px; top:20px; font-size:22px"><span class="n">700</span>  if (!question …
<span class="n">701</span>    await start();</div></div><div class="${P}-s" style="left:28px; top:300px; width:444px">+ click a box on a diagram · your voice</div><div class="${P}-s" style="left:28px; top:380px; width:444px">later: drawing how you think it works</div>`)}
  ${way("w2", 1260, "a video", "video", `<div class="${P}-s" style="left:28px; top:70px; width:444px">quick checks ask the cards</div><div class="${P}-opt" style="${pos(28, 130, 444, 120)}"><span class="k">A</span><span class="l" style="top:66px; font-size:30px">it waits</span></div><div class="${P}-opt" style="${pos(28, 270, 444, 120)}"><span class="k">B</span><span class="l" style="top:66px; font-size:30px">a headless run</span></div>`)}`;
};
B["20b"] = () => {
  anim(`#${id("tag")}`, "fade", cue(F, "decided"));
  return `${kicker("step 4 · Got it, and once more")}${el("chip", "tag", 1440, 70, null, null, "your decision D-316")}${timeline([{ t: "Got it · c3" }, { t: "3 days" }, { t: "the first round after, any topic" }, { t: "a new case · same rule", hot: 1 }, { t: "known until the lines change" }])}`;
};

// --- writing them -----------------------------------------------------------------------------------
const JS = (P, dur) => A.map((a) => {
  const t = Math.max(0.05, Math.min(+a.t || 0.2, dur - 0.6)).toFixed(3);
  switch (a.kind) {
    case "up": return `  gsap.set("${a.sel}", { opacity: 0, y: 26 });\n  tl.to("${a.sel}", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, ${t});`;
    case "left": return `  gsap.set("${a.sel}", { opacity: 0, x: -24 });\n  tl.to("${a.sel}", { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }, ${t});`;
    case "fade": return `  gsap.set("${a.sel}", { opacity: 0 });\n  tl.to("${a.sel}", { opacity: 1, duration: 0.4, ease: "power2.out" }, ${t});`;
    case "draw": return `  gsap.set("${a.sel}", { scaleX: 0 });\n  tl.to("${a.sel}", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, ${t});`;
    case "hot": { const u = Math.min(+a.until || +t + 3, dur - 0.5).toFixed(3); return `  tl.to("${a.sel}", { opacity: 1, duration: 0.3 }, ${t});\n  tl.to("${a.sel}", { opacity: 0, duration: 0.3 }, ${u});`; }
    case "mark": return `  gsap.set("${a.sel}", { textDecorationColor: "rgba(184,85,46,0)" });\n  tl.to("${a.sel}", { textDecorationColor: "rgba(184,85,46,1)", duration: 0.5 }, ${t});`;
    case "flipout": return `  tl.to("${a.sel}", { scaleX: 0, duration: 0.35, ease: "power2.in" }, ${t});\n  tl.set("${a.sel}", { opacity: 0 }, ${(+t + 0.36).toFixed(3)});`;
    case "flipin": return `  gsap.set("${a.sel}", { scaleX: 0, opacity: 0 });\n  tl.set("${a.sel}", { opacity: 1 }, ${t});\n  tl.to("${a.sel}", { scaleX: 1, duration: 0.35, ease: "power2.out" }, ${t});`;
  }
}).join("\n");

mkdirSync(join(VD, "compositions/frames"), { recursive: true });
for (const f of frames) {
  if (only.length && !only.includes(f.n)) continue;
  const key = f.src.replace(/^.*\//, "").split("-")[0].replace(/^0+(?=\d)/, "");
  if (!B[key]) { console.log(`frame ${f.n} (${key}): no builder`); continue; }
  F = f; A = []; const fid = f.src.replace(/^.*\//, "").replace(/\.html$/, ""); P = "f" + key.padStart(2, "0");
  let inner = B[key]();
  const html = `<template>
<style>${CSS(P)}</style>

<div id="root" data-composition-id="${fid}" data-band="bottom" data-duration="${f.dur}" data-width="1920" data-height="1080">
  <div class="clip ${P}-bg" id="${P}-bg" data-start="0" data-duration="${f.dur}" data-track-index="0"></div>
  <div class="clip ${P}-scene" id="${P}-scene" data-start="0" data-duration="${f.dur}" data-track-index="1">
  ${inner}
  </div>
</div>

<script>
(function () {
  var FID = "${fid}";
  var DUR = ${f.dur};
  var tl = gsap.timeline({ paused: true });
${JS(P, f.dur)}
  tl.to({}, { duration: 0.001 }, DUR - 0.001);
  window.__timelines = window.__timelines || {};
  window.__timelines[FID] = tl;
})();
</script>
</template>
`;
  writeFileSync(join(VD, f.src), html);
  console.log(`✓ ${f.src} (${A.length} cues)`);
}
