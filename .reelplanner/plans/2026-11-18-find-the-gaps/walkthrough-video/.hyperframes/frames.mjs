// Writes every frame of the find-the-gaps walkthrough video, in the plan video's styles.
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


// --- the walkthrough's own pieces -------------------------------------------------------------------
const CCSS = (P) => `
  .${P}-call { position:absolute; box-sizing:border-box; border-radius:12px; background:var(--rp-paper); border:1px solid rgba(var(--rp-ink-rgb),0.26); box-shadow:0 1px 3px rgba(var(--rp-shadow-rgb),0.08); }
  .${P}-call .i { position:absolute; left:22px; top:16px; font:500 26px/1 "JetBrains Mono"; letter-spacing:0.04em; color:var(--rp-coral-deep); white-space:nowrap; }
  .${P}-call .t { position:absolute; left:22px; top:54px; right:20px; font:400 28px/1.25 "Inter"; color:var(--rp-ink); }
  .${P}-shot { position:absolute; box-sizing:border-box; border-radius:12px; overflow:hidden; border:1px solid rgba(var(--rp-ink-rgb),0.24); background:var(--rp-paper); }
  .${P}-shot img { position:absolute; display:block; }
  .${P}-term { position:absolute; font:400 26px/1.5 "JetBrains Mono"; color:var(--rp-slab-ink); white-space:pre; font-variant-ligatures:none; }
  .${P}-term .p { color:rgba(var(--rp-slab-ink-rgb),0.6); }
  .${P}-term .x { color:var(--rp-syn-num); }
`;
/** the choice cards of a stop beat, down the right: [[id, words, cueWord]] */
function calls(list, { x = 1200, y = 110, w = 560, h = null, gap = 14 } = {}) {
  const ch = h || Math.min(190, Math.floor((780 - gap * (list.length - 1)) / list.length));
  return list.map(([k, t, word], i) => { anim(`#${id("c" + k)}`, "left", cue(F, word)); return `<div class="${P}-call" id="${id("c" + k)}" data-call="${k}" style="${pos(x, y + i * (ch + gap), w, ch)}"><span class="i">${k.startsWith("d") ? "off the plan" : "choice"} ${k.toUpperCase()} · it pauses here</span><span class="t">${esc(t)}</span></div>`; }).join("\n");
}
/** a terminal run in the theme's slab: lines of [text, cls?] */
function term(key, x, y, w, h, title, lines, artifact, detail = "") {
  return `<div class="${P}-slab" id="${id(key)}" style="${pos(x, y, w, h)}" data-artifact="${esc(artifact)}"${detail ? ` data-detail="${detail}"` : ""}><div class="${P}-bar"></div><div class="${P}-bt">${esc(title)}</div>
    ${lines.map(([t, c, word], i) => { const k = `${key}-l${i}`; anim(`#${id(k)}`, "fade", word ? cue(F, word) : 0.3 + i * 0.25); return `<div class="${P}-term${c ? ` ${c}` : ""}" id="${id(k)}" style="left:22px; top:${60 + i * 40}px">${esc(t)}</div>`; }).join("\n")}</div>`;
}
const ring = (key, x, y, w, h, word, nth = 1) => { anim(`#${id(key)}`, "fade", cue(F, word, nth)); return `<div class="${P}-ring" id="${id(key)}" style="${pos(x, y, w, h)}"></div>`; };
/** a screenshot, scaled to width w, cropped to height h from the image's top sy (in shot px at that scale) */
function shot(key, x, y, w, h, src, iw, ih, artifact, { sy = 0, sx = 0, scale = null, detail = "" } = {}) {
  const sc = scale || w / iw;
  return `<div class="${P}-shot" id="${id(key)}" style="${pos(x, y, w, h)}" data-artifact="${esc(artifact)}"${detail ? ` data-detail="${detail}"` : ""}><img src="${src}" alt="" style="left:${-sx}px; top:${-sy}px; width:${Math.round(iw * sc)}px; height:${Math.round(ih * sc)}px"></div>`;
}

/** a screenshot's region [x0, y0, x1, y1] (in the image's own pixels) shown at width w; → { html, sc, h } */
function crop(key, x, y, w, src, iw, ih, [x0, y0, x1, y1], artifact, detail = "") {
  const sc = w / (x1 - x0), h = Math.round((y1 - y0) * sc);
  return { sc, h, at: (px, py) => [Math.round(x + (px - x0) * sc), Math.round(y + (py - y0) * sc)],
    html: `<div class="${P}-shot" id="${id(key)}" style="${pos(x, y, w, h)}" data-artifact="${esc(artifact)}"${detail ? ` data-detail="${detail}"` : ""}><img src="${src}" alt="" style="left:${-Math.round(x0 * sc)}px; top:${-Math.round(y0 * sc)}px; width:${Math.round(iw * sc)}px; height:${Math.round(ih * sc)}px"></div>` };
}
// --- the frames ------------------------------------------------------------------------------------
const B = {};
B[1] = () => {
  const rows = [["scripts/align.mjs", "the command: start a round, check it, record it", "command"], ["scripts/lib/align.mjs", "the cards, their checks, the one record", "record"],
    ["scripts/lib/align-server.mjs", "the round on the review server", "checker"], ["packages/player/align-page.html", "the round's own page", "lines"],
    ["scripts/review.mjs", "opens a round, beside any videos", "reach"], ["packages/player/reelplanner-player.js", "a wrong quick check settles", "must"],
    ["scripts/lib/review-scope.mjs", "what a settled check asks of the agent", "card"], ["skills/plan-to-video/SKILL.md", "when a round runs, and how it is asked", "Eight"]];
  anim(`#${id("h")}`, "left", 0.15);
  return `${el("h", "h", 160, 70, 1600, null, "What landed")}
  ${label("lab", 160, 176, "git diff 95a5bdb..HEAD · this plan's code, one row a file")}
  <div style="position:absolute; ${pos(160, 250, 1600, 630)}" data-artifact="the change's files, from git diff 95a5bdb..HEAD" data-detail="what-changed">
  ${rows.map(([p, t, w], i) => { anim(`#${id("r" + i)}`, "up", 0.6 + i * 0.35); return `<div class="${P}-row" id="${id("r" + i)}" style="${pos(0, i * 76, 1600, 76)}"><div class="${P}-m" style="left:0; top:20px">${esc(p)}</div><div class="${P}-t" style="left:820px; top:18px; width:780px">${esc(t)}</div></div>`; }).join("\n")}
  </div>`;
};
const check = (o) => () => `${label("ctx", 160, 80, o.ctx)}${label("case", 160, 130, o.cs)}${question(o.q, 190)}
  ${optionCards({ y: 420, h: 330, opts: o.opts.map((l) => ({ label: l })) })}`;
B[2] = check({ ctx: "quick check · step 1", cs: "card c2 says B · the fresh checker reads A", q: "The fresh checker reads card c2's lines as A; the card says B. What does `align --check` do?", opts: ["Passes, with a warning", "Stops: rewrite the card once, or drop it", "Shows you both answers"] });
B[3] = () => `${term("t", 160, 110, 1000, 700, "a scratch repo · reelplanner align", [
    ["$ reelplanner align <round> --check --no-checker", "p"], ["✗ c2: its quote is not in src/send.mjs:3-5", "x", "quotes"], ["  word for word", "x", "quotes"], ["", ""],
    ["$ reelplanner align <round> --check", "p", "checker"], ["✗ c2: the checker read the lines as A,", "x", "reads"], ["  the card says B: rewrite it once", "x", "rewrite"], ["", ""],
    ["$ reelplanner align <round> --check", "p", "B"], ["✓ 3 cards, 0 failure(s)", "", "passes"]],
    "a real run in a scratch repo: align --check stopping on a quote, then on the checker, then passing (runs/align-checker.txt)", "step-1")}
  ${calls([["a2", "A ? from the checker (its lines don't decide it) stops a card too", "question"], ["a3", "No checker answer: the round does not open", "No"], ["a4", "One range of lines a card", "range"], ["a20", "A round finds its repo from its own folder", "finds"]])}`;
B[4] = () => {
  anim(`#${id("front")}`, "fade", 0.3); anim(`#${id("front")}`, "flipout", cue(F, "turns")); anim(`#${id("back")}`, "flipin", cue(F, "turns") + 0.36);
  const fr = crop("front", 140, 110, 1040, "assets/shots/round-front.png", 2560, 1600, [300, 215, 2262, 1345], "the round page from a scratch repo: a card's front");
  const bk = crop("back", 140, 110, 1040, "assets/shots/round-back.png", 2560, 1600, [300, 215, 2262, 1345], "the same card turned over: your pick, the answer, the code's lines, why, and the four ways to settle it", "step-2");
  return `${fr.html}
  ${bk.html}
  ${calls([["a7", "Each card is routed once, however often sent", "routed"], ["a9", "The page has its own address on the review server", "address"], ["a10", "Send goes to the inbox, never a headless run", "Send"], ["a13", "A settled card moves on by itself", "settled"]])}`;
};
B[5] = () => {
  anim(`#${id("say")}`, "fade", 0.3);
  const cl = [["✓ “It goes to my session”", "a match", "match"], ["✗ “it waits in the inbox for me”", "a gap: a set command starts a run", "gap"], ["? “for me”", "a want: asked back as an assume card", "want"]];
  return `${shot("say", 160, 110, 1000, 470, "assets/shots/round-say.png", 2560, 1600, "the say card on the round page, your words typed in", { sy: 0, scale: 1000 / 2560 * 1.12, sx: 40, detail: "step-3" })}
  ${label("cl", 160, 610, "its claims, once the waiting session has checked them")}
  ${cl.map(([a, b, w], i) => { anim(`#${id("k" + i)}`, "up", cue(F, w)); return `<div id="${id("k" + i)}" style="position:absolute; ${pos(160, 656 + i * 76, 1000, 70)}"><div class="${P}-t" style="left:0; top:6px">${esc(a)}</div><div class="${P}-s" style="left:560px; top:8px; width:440px">${esc(b)}</div></div>`; }).join("\n")}
  ${calls([["a11", "Your words reach the session as a question", "question"], ["a12", "Speech is written down on this machine", "Speech"], ["a19", "The recording is thrown away once written down", "thrown"]])}`;
};
B[6] = check({ ctx: "quick check · step 4", cs: "c2 · Got it · c3 · skipped", q: "You settle card c2 with Got it, and skip c3. Where does c3 go?", opts: ["Into your memory, as known", "Into the plan, as Assumed, not checked", "Nowhere"] });
B[7] = () => `${term("t", 160, 110, 1000, 760, "a scratch repo · align record, then the plan", [
    ["$ reelplanner align record <round> answers.json", "p"], ["✓ answers.json: the round's one record", ""], ["  c1 → You told me first, in a line", "", "c1"], ["  c2 → your memory, asked once more", "", "c2"], ["       on a new case from 2026-11-21", ""], ["  c3 → Assumed, not checked", "", "c3"], ["", ""],
    ["$ sed -n … plan.md", "p"], ["## You told me first", "x", "c1"], ["- c1 … the session you have open. Right.", ""], ["## Assumed, not checked", "x", "c3"], ["- c3 Say how you think a review is handed on.", ""], ["### Step 1 — Hand it on", "p"]],
    "a real run in a scratch repo: align record routing three answers, and the plan's sections (runs/align-record.txt)", "step-4")}
  ${calls([["a1", "What you know: a marked line in ~/.reelplanner/you.jsonl", "marked"], ["a5", "A due thing comes back as a new card the agent writes", "due"], ["a6", "You told me first sits before the plan's steps", "sits"], ["a8", "Show me more's video is one explainer command", "explainer"]])}`;
B[8] = () => {
  anim(`#${id("q")}`, "fade", 0.3);
  const q = crop("q", 140, 110, 1040, "assets/shots/quick-check-change.png", 2800, 1800, [360, 660, 2440, 1300], "the player: a quick check answered wrong, Change the plan pressed, its words in the box", "step-5");
  const [rx, ry] = q.at(390, 1030), [rx2, ry2] = q.at(1780, 1190);
  return `${q.html}
  ${ring("rg", rx, ry, rx2 - rx, ry2 - ry, "Change")}
  ${term("st", 140, 110 + q.h + 30, 1040, 200, "a scratch repo · reel status", [["rounds: 1, gaps: 1 (Got it 1)", "", "counts"], ["too few plans to compare", "x", "compares"], ["(1 with a round, 0 with a likely gap and none; 5 of each)", ""]], "a real run in a scratch repo: reel status's Alignment rounds (runs/reel-status-rounds.txt)")}
  ${calls([["a14", "A plan's header says whether a round ran", "header"], ["a15", "A late fix counts once", "late"], ["a16", "The buttons sit in the check's own box", "buttons"], ["a17", "Got it sends no rewrite of the step", "rewrite"], ["a18", "Show me more with no example asks again", "example"]], { h: 140 })}`;
};
B[9] = () => {
  anim(`#${id("qq")}`, "up", cue(F, "question"));
  return `${calls([["d1", "Step 5 went on past its fifth choice before asking (decision D-110)", "fifth"]], { x: 160, y: 200, w: 760, h: 300 })}
  ${el("paper", "qq", 1000, 200, 760, 520, `<div class="${P}-lab" style="left:30px; top:28px">the plan's question 5 · step 5</div><div class="${P}-big" style="left:30px; top:80px; width:700px; font-size:40px">Where is it kept whether a round ran first, or was skipped?</div><div class="${P}-s" style="left:30px; top:260px; width:700px">A · a line in the plan's header<br>B · a command that records it<br>C · only the rounds themselves</div><div class="${P}-s" style="left:30px; top:430px; color:var(--rp-coral-deep)">built as A until you answer</div>`)}`;
};
B[10] = () => {
  const ran = ["npm test, the fast suite", "align.spec · 53 checks", "align-page.spec · 37 checks", "quiz.spec, extended · 54 checks", "the code check, every ✗ answered"];
  const nd = ["live recognition in the browser", "a diagram on Show me more", "a later video dropping what you know", "no round yet before a real plan"];
  anim(`#${id("a")}`, "up", cue(F, "ran")); anim(`#${id("b")}`, "up", cue(F, "Not"));
  return `${el("h", "h", 160, 90, 1600, null, "What ran, and what is not done")}
  <div id="${id("a")}" style="position:absolute; ${pos(160, 240, 760, 600)}">${label("la", 0, 0, "ran")}${ran.map((t, i) => `<div class="${P}-t" style="left:0; top:${56 + i * 72}px">${esc(t).replace(/^npm test/, "<code>npm test</code>")}</div>`).join("")}</div>
  <div id="${id("b")}" style="position:absolute; ${pos(1000, 240, 760, 600)}">${label("lb", 0, 0, "not done")}${nd.map((t, i) => `<div class="${P}-t" style="left:0; top:${56 + i * 72}px">${esc(t)}</div>`).join("")}</div>`;
};
B[11] = () => {
  anim(`#${id("e")}`, "fade", 0.4);
  return `${shot("card", 160, 220, 700, 437, "assets/shots/round-back.png", 2560, 1600, "the round's card, turned over")}
  ${el("big", "e", 960, 380, 800, null, "Seeing it run, anything you'd change?")}`;
};
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
<style>${CSS(P)}${CCSS(P)}</style>

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
