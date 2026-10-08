/* The guide's page: one renderer for the full guide (the page under the video, D-264) and for a part of it (a page the
   local review player opens over the paused frame). Made from #guide-data, which `reelplanning guide` writes from
   plan.md, walkthrough.md, runs/, the reviews and the ledger: nothing typed in.

   It answers what a reader asks, in the order they ask it (guide-clarity.md in the plan guide's folder):
     1. what is this, and why should I care        the name, its promise, where it stands, your own words that asked
     2. what can I do now (or: would I)            each step, with the real thing: its picture running, its saved run
     3. how do I try it                            the commands that ran, then those the build and the plan name
     4. what did the agent decide alone            its choices, the ones worth a look first (or, before the build,
                                                   what is already decided and why)
     5. what needs me                              your review, the questions still open
     6. what isn't done, what could go wrong       not done, the code check's misses, what the plan doesn't say
     7. where the code is                          each part of the change, its real diff behind "See the code"
   then, folded, the plan in its own words. Plain words: a heading says what you learn, each section opens with one
   sentence of what it means for you, then the real thing, then the detail folded away (a <details>: a visible
   control, reachable with Tab, open without a script). "Open everything" opens every fold.
   A part lives in the player's sandboxed frame and speaks through the bridge (rp-detail messages): "seek" the video,
   "open" another part. The full page goes back to the review page's player for "Watch this moment". */
(function () {
"use strict";
const G = JSON.parse(document.getElementById("guide-data").textContent);
const PART = G.mode === "part", FULL = !PART;
const R = G.reader || {};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// (in code, a short word with a hyphen in it, a flag such as --check, is never broken at the hyphen: guide.css .nw)
const nwrap = (c) => c.replace(/[^\s]+/g, (w) => (w.includes("-") && w.length <= 28 ? `<span class="nw">${w}</span>` : w));
const inlRaw = (s) => esc(s).replace(/`([^`]+)`/g, (m, c) => `<code>${nwrap(c.replace(/\n\s*/g, " "))}</code>`).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(“"])\*([^*\s][^*]*?)\*(?=[\s).,;:”"]|$)/g, "$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => /^(https?:|#|\.{0,2}\/|[\w-]+\.(?:md|html)$)/.test(u) ? `<a href="${u}"${/^https?:/.test(u) ? ' rel="noreferrer" target="_blank"' : ""}>${t}</a>` : t);
const inl = inlRaw;
const fmt = (t) => { t = Math.max(0, Math.floor(+t || 0)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };
const h = (html) => { const t = document.createElement("template"); t.innerHTML = String(html).trim(); return t.content.firstElementChild; };
const plural = (n, w, ws = `${w}s`) => `${n} ${n === 1 ? w : ws}`;
const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const count = (n, w, ws = `${w}s`) => `${n < NUM.length ? NUM[n] : n} ${n === 1 ? w : ws}`;
const cap = (s) => String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1);
const capWord = (s) => (/^[a-z][a-z]*[\s,;:]/.test(String(s || "")) ? cap(s) : String(s || ""));
const lowerFirst = (s) => (/^[A-Z][a-z]/.test(String(s || "")) ? s.charAt(0).toLowerCase() + s.slice(1) : String(s || ""));
// what this browser keeps for the guide, and the review record it shares with the player, per repo: the page names its
// repo (bundle-player's <meta name="reelplanning-repo">), as the review page's player does (reelplanning-player.js recordKey)
const REPO = (document.querySelector('meta[name="reelplanning-repo"]')?.getAttribute("content") || "").trim();
const GKEY = REPO ? `rpg@${REPO}:${G.slug}` : `rpg:${G.slug}`, recordKey = (src) => (REPO ? `reelplanning@${REPO}:annotations:${src}` : `reelplanning:annotations:${src}`);
const store = { get(k, d) { try { const v = localStorage.getItem(`${GKEY}:${k}`); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(`${GKEY}:${k}`, JSON.stringify(v)); } catch {} } };
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const post = (m) => { m.type = "rp-detail"; try { parent.postMessage(m, "*"); } catch {} };
const params = new URLSearchParams(location.search);
const V = G.videos || {};
const ownVideo = V[G.own] || null;
const BUILT = !!G.built && G.own === "built";
const dateOf = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ""); return m ? `${+m[3]} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m[2] - 1]} ${m[1]}` : d || ""; };
const stepTitle = (t) => String(t || "").replace(/\s*\((?:questions?|and question) [^)]*\)\s*$/i, "").replace(/\s*[✅⏳❌✗]\s*$/, "");
const plainEnd = (s) => { const t = String(s || "").trim().replace(/[:;,]\s*$/, "."); return !t || /[.!?…)"”]$/.test(t) || /`$/.test(t) ? t : t + "."; };
// a reference number in a list of them, "(its look, D-167; light and dark)", is for the log, not the reader: the sentence reads without it
const noRefs = (s) => String(s || "").replace(/\s*\((?:\s*(?:D-\d{3,4}|[AD]\d{1,3})\s*[,;]?)+\)/g, "").replace(/(^|[(,;]\s*)(?:D-\d{3,4}(?:\s*(?:,|and)\s*D-\d{3,4})*)\s*(?=[;,)])[;,]?\s*/g, "$1").replace(/\(\s*[;,]\s*/g, "(").replace(/\s*[;,]\s*\)/g, ")").replace(/\(\s*\)/g, "").replace(/\s{2,}/g, " ");
const firstSentence = (t) => { const x = String(t || "").split("\n")[0], codes = []; const y = x.replace(/`[^`]*`/g, (c) => `\u0001${codes.push(c) - 1}\u0002`); const m = /^(.+?[.;:])(?:\s|$)/.exec(y); return (m ? m[1] : y).replace(/[:;]$/, ".").replace(/\u0001(\d+)\u0002/g, (_, k) => codes[+k]); };
// the numbers of the record, in running words: a decision's (D-244) and a choice's (A1, D1, m3). Where the page's own
// words carry one bare, its meaning is said and the number waits in a hover: "(D-244)" → "(an earlier decision)", "(A1)"
// → "(one of the agent's choices)", a link to it; "per D-003" → "per an earlier decision"
const callIds = new Set((G.built?.calls || []).map((c) => c.id));
const decisionWords = (id) => { const d = (G.ledger || {})[id] || (G.ledgerAll || {})[id]; return d ? `${id} in the decision log: ${d.question || ""}${d.chosen ? ` → ${d.chosen}` : ""}` : `${id}: a numbered entry in the decision log`; };
const DEVIATION = "a change from the plan, numbered D in the walkthrough (not an entry of the decision log)";
const callGloss = (id) => (/^D\d/.test(id) ? `${id}: ${DEVIATION}` : /^m\d/.test(id) ? `${id}: one of the agent's smaller choices` : `${id}: one of the agent's choices, numbered in the walkthrough`);
function glossIds(html) {
  // only outside tags and <code>: split the html, change the text between
  return String(html).split(/(<code>[\s\S]*?<\/code>|<[^>]+>)/).map((part, i) => {
    if (i % 2) return part;
    return part
      .replace(/\s*\(((?:\s*(?:D-\d{3,4}|[AD]\d{1,3}|m\d{1,3})\s*(?:[,;]|and)?)+)\)/g, (m, inner) => {
        const ids = inner.match(/D-\d{3,4}|[AD]\d{1,3}|m\d{1,3}/g) || [];
        const dec = ids.filter((x) => /^D-/.test(x)), calls = ids.filter((x) => !/^D-/.test(x));
        const bits = [];
        // this plan's own decision is not an earlier one
        const mine = dec.length && dec.every((id) => ((G.ledger || {})[id] || (G.ledgerAll || {})[id])?.plan === G.planName);
        if (dec.length) bits.push(`<abbr class="idg" title="${esc(dec.map(decisionWords).join("\n"))}">${mine ? (dec.length === 1 ? "this plan's decision" : "this plan's decisions") : dec.length === 1 ? "an earlier decision" : "earlier decisions"}</abbr>`);
        const link = (id, words) => callIds.has(id) ? `<a class="idg" href="#choice-${esc(id)}" data-open="choice-${esc(id)}" title="${esc(callGloss(id))}">${words}</a>` : `<abbr class="idg" title="${esc(callGloss(id))}">${words}</abbr>`;
        if (calls.length === 1) bits.push(link(calls[0], /^D\d/.test(calls[0]) ? "a change from the plan" : "one of the agent's choices"));
        else if (calls.length) bits.push(`the agent's choices ${calls.map((id) => link(id, `<span class="ref">${esc(id)}</span>`)).join(", ").replace(/, ([^,]*)$/, " and $1")}`);
        return ` (${bits.join("; ")})`;
      })
      .replace(/\b(per|in|by|see|under|with) (D-\d{3,4})\b/g, (m, w, id) => `${w} <abbr class="idg" title="${esc(decisionWords(id))}">${((G.ledger || {})[id] || (G.ledgerAll || {})[id])?.plan === G.planName ? "this plan's decision" : "an earlier decision"}</abbr>`);
  }).join("");
}
// what glossIds leaves: a decision's number standing in a sentence ("D-249 keeps the transcript out of git", "(D-228
// approved, not built)") says what it is, the number in its hover; only on a line said to the reader (a card's reasons,
// Not done, the code check's answers), never in a worked example, where the numbers are the case
function bareDecisions(html) {
  let inAbbr = 0;
  return String(html).split(/(<code>[\s\S]*?<\/code>|<pre\b[\s\S]*?<\/pre>|<[^>]+>)/).map((part, i) => {
    if (i % 2) { if (/^<abbr\b/.test(part)) inAbbr++; else if (/^<\/abbr>/.test(part)) inAbbr = Math.max(0, inAbbr - 1); return part; }
    return inAbbr ? part : part.replace(/\bD-\d{3,4}\b/g, (id) => `<abbr class="idg" title="${esc(decisionWords(id))}">${((G.ledger || {})[id] || (G.ledgerAll || {})[id])?.plan === G.planName ? "this plan's decision" : "an earlier decision"}</abbr>`);
  }).join("");
}
// a scene's title, as the video says it, with its choices counted, not numbered: "things to do, and choices A1 to A4"
// → "things to do, and four of the agent's choices"
const plainTitle = (t) => String(t || "").replace(/\b(?:and )?choices? ([ADm])(\d+)(?: (?:to|and) \1?([ADm]?)(\d+))?(?:,? and ([ADm]\d+))?/g, (m, p, a, p2, b, c) => {
  const n = b != null && (!p2 || p2 === p) ? (/to/.test(m) ? +b - +a + 1 : 2) + (c ? 1 : 0) : 1 + (c ? 1 : 0);
  return `${/^and /.test(m) ? "and " : ""}${n === 1 ? "a choice" : `${n < 13 ? NUM[n] : n} choices`}`; });

/* ── where things go: back to the video (the review page's player at a time), or to another part ─────────── */
// a moment is a scene's start plus 0.6 s: a scene that starts where the one before stops for a choice would otherwise land
// inside that stop's window, and the player would pause on the choice instead of playing the scene
function watchHref(which, t) {
  const v = V[which], at = (Math.max(0, +t || 0) + 0.6).toFixed(2), back = params.get("review");
  if (back) { try { const u = new URL(back, location.href); u.searchParams.set("t", at); u.searchParams.delete("part");
    if (v && ownVideo && v.slug !== ownVideo.slug) { const p = u.searchParams.get("project") || ""; u.searchParams.set("project", p === ownVideo.slug || !p.includes("/") ? v.slug : p.replace(ownVideo.dir, v.dir)); }
    return u.href; } catch {} }
  return `../../index.html?project=${encodeURIComponent(v ? v.slug : G.slug)}&t=${at}`;
}
const videoName = (which) => (which === "built" ? "the walkthrough video" : which === "plan" ? "the plan video" : "the video");
// "Watch this moment": its time and the scene's title; back to the player there (in a part: the player seeks)
function watchEl(which, n, { label = "Watch this moment", bare = false } = {}) {
  const v = V[which], f = v?.scenes.find((x) => x.n === n); if (!f) return "";
  const other = ownVideo && v !== ownVideo;
  if (PART && other) return `<span class="wm off" title="In ${esc(videoName(which))}: open the full guide to go there">${esc(cap(videoName(which)))} · <span class="t">${fmt(f.start)}</span></span>`;
  // bare: the label and one time, "Watch its scene · 2:28" (a choice's card: the scene's title is the card's own)
  const inner = bare ? `<span class="wl">${esc(label)}${other ? ` in ${esc(videoName(which))}` : ""}</span><span class="ws"> · <span class="t">${fmt(f.start)}</span></span>`
    : `<span class="wl">${esc(label)}${other ? ` in ${esc(videoName(which))}` : ""}</span> <span class="ws"><span class="t">${fmt(f.start)}</span> ${esc(plainTitle(f.title))}</span>`;
  return PART ? `<button class="wm" type="button" data-seek="${f.start}">${inner}</button>` : `<a class="wm" href="${esc(watchHref(which, f.start))}">${inner}</a>`;
}
const scenesFor = (which, pred) => (V[which]?.scenes || []).filter((f) => !f.branch && pred(f));
document.addEventListener("click", (e) => {
  const s = e.target.closest("[data-seek]"); if (s) { e.preventDefault(); post({ event: "seek", t: +s.dataset.seek }); return; }
  const o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); openAt(o.dataset.open); }
  const c = e.target.closest("[data-copytext]"); if (c) copyText(c.dataset.copytext, c);
});

/* ── Markdown, as plan.md writes it: every heading and paragraph in the page; each block noted on by its place ─ */
function md(text, { anchor = null, editable = false, gloss = false } = {}) {
  // `gloss`: words written for the reader (walkthrough.md's, never plan.md's own, which the page shows as written):
  // a bare number of the record in them says what it is (glossIds)
  const inl = gloss ? (x) => glossIds(inlRaw(x)) : inlRaw;
  const out = [], rows = String(text || "").replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, "").split("\n"); let k = 0;
  const a = () => (anchor ? ` data-anchor="${esc(anchor)} · ¶${++k}"${editable ? " data-editable" : ""}` : "");
  let i = 0;
  const para = []; const flush = () => { if (para.length) { out.push(`<p${a()}>${inl(para.join(" "))}</p>`); para.length = 0; } };
  while (i < rows.length) {
    const raw = rows[i];
    if (/^```diagram/.test(raw)) { flush(); const buf = []; i++; while (i < rows.length && !/^```/.test(rows[i])) buf.push(rows[i++]); i++; const t = (/^\s*(?:flow|sequence|state|compare)\s*:\s*(.+)$/im.exec(buf.join("\n")) || [])[1]; out.push(`<p class="q3 dg-ref">A diagram${t ? `, “${inl(t.trim())}”,` : ""} drawn under “How it works”.</p>`); continue; }
    // a fence, at the start of a line or indented under a list item: a code block, its indent taken off
    const fm = /^(\s*)```/.exec(raw);
    if (fm) { flush(); const ind = fm[1].length, buf = []; i++; while (i < rows.length && !/^\s*```\s*$/.test(rows[i])) { const r = rows[i++]; buf.push(r.slice(0, ind).trim() ? r : r.slice(ind)); } i++; out.push(`<pre class="code"${a()}>${esc(buf.join("\n"))}</pre>`); continue; }
    const hm = /^(#{1,6}) (.*)$/.exec(raw);
    if (hm) { flush(); const n = Math.min(6, hm[1].length + 2); out.push(`<h${n} class="mdh"${a()}>${inl(hm[2])}</h${n}>`); i++; continue; }
    if (/^\s*\|/.test(raw)) { flush(); const buf = []; while (i < rows.length && /^\s*\|/.test(rows[i])) buf.push(rows[i++]);
      const cells = buf.map((l) => l.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim())).filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c)));
      out.push(`<div class="tw"><table class="mdt"><thead><tr>${(cells[0] || []).map((c) => `<th>${inl(c)}</th>`).join("")}</tr></thead><tbody>${cells.slice(1).map((r) => `<tr${a()}>${r.map((c) => `<td>${inl(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); continue; }
    if (/^> ?/.test(raw)) { flush(); const buf = []; while (i < rows.length && /^> ?/.test(rows[i])) buf.push(rows[i++].replace(/^> ?/, "")); out.push(`<blockquote${a()}>${inl(buf.join(" "))}</blockquote>`); continue; }
    const li = /^(\s*)(?:[-*]|(\d+)\.) (.*)$/.exec(raw);
    if (li) { flush(); const ordered = !!li[2]; const items = [];
      while (i < rows.length) { const m = /^(\s*)(?:[-*]|\d+\.) (.*)$/.exec(rows[i]);
        if (m) { items.push({ d: m[1].length, t: m[2], more: [] }); i++; continue; }
        // an item's own lines, in order: its text, a fenced block under it (drawn as code, inside it), text after that
        const it = items[items.length - 1];
        if (it && /^\s+\S/.test(rows[i]) && !/^\s*```/.test(rows[i])) { const last = it.more.at(-1); if (!it.more.length) it.t += " " + rows[i].trim(); else if (last.code != null || last.gap) it.more.push({ t: rows[i].trim() }); else last.t += " " + rows[i].trim(); i++; continue; }
        if (it && /^\s+```/.test(rows[i])) { const ind = /^(\s*)/.exec(rows[i])[1].length, buf = []; i++; while (i < rows.length && !/^\s*```\s*$/.test(rows[i])) { const r = rows[i++]; buf.push(r.slice(0, ind).trim() ? r : r.slice(ind)); } i++; it.more.push({ code: buf.join("\n") }); continue; }
        if (it && !rows[i].trim() && /^\s+\S/.test(rows[i + 1] || "") && !/^(\s*)(?:[-*]|\d+\.) /.test(rows[i + 1])) { it.more.push({ gap: true }); i++; continue; }
        break; }
      const base = Math.min(...items.map((x) => x.d)); let html = `<${ordered ? "ol" : "ul"}>`, depth = 0;
      for (const it of items) { const d = it.d > base ? 1 : 0; if (d > depth) html += "<ul>"; if (d < depth) html += "</ul>"; depth = d; html += `<li${a()}>${inl(it.t)}${it.more.filter((x) => !x.gap).map((x) => (x.code != null ? `<pre class="code">${esc(x.code)}</pre>` : `<p>${inl(x.t)}</p>`)).join("")}</li>`; }
      if (depth) html += "</ul>"; out.push(html + `</${ordered ? "ol" : "ul"}>`); continue; }
    if (!raw.trim()) { flush(); i++; continue; }
    para.push(raw.trim()); i++;
  }
  flush(); return out.join("\n");
}
// the builder's notes name a fenced block ("a ```diagram block"): the fence is code, drawn as code
const fenced = (html) => String(html).replace(/(?<!<code>)```(\w+)/g, "<code>```$1</code>");
const missing = (what) => `<p class="thin" role="note"><span class="thin-k">Not written yet</span> ${inl(what)}</p>`;
const planned = `<span class="pl" title="What the plan says it will print: not a real run">as planned, not run</span>`;
// a fold: its summary says what you get by opening it; `make` fills it on first open (or on Open everything)
const LAZY = new Map();
function fold(summary, body, { id = "", cls = "", open = false, make = null, attrs = "" } = {}) {
  const key = make ? `lz${LAZY.size}` : "";
  if (make) LAZY.set(key, make);
  return `<details class="more ${cls}"${id ? ` id="${esc(id)}"` : ""}${open ? " open" : ""}${key ? ` data-lazy="${key}"` : ""}${attrs}><summary>${summary}</summary><div class="fbody">${body || ""}</div></details>`;
}
function fillLazy(d) { const k = d?.dataset?.lazy; if (!k || d.dataset.filled) return; d.dataset.filled = "1"; const got = LAZY.get(k)?.(); if (got) { $(".fbody", d).appendChild(got); linkFiles(got); } }
let linkFiles = () => {};
document.addEventListener("toggle", (e) => { const d = e.target; if (d.tagName === "DETAILS" && d.open) fillLazy(d); }, true);

/* ── what changed since your review (lib/guide/revised.mjs), as the video marks its changed scenes: a quiet mark on each
   part of the plan whose words changed, "What changed" under it (the words taken out and put in, and what your review
   said there, in its own words), and at the top "Show only the changes", off until you turn it on ─────────────────── */
const RV = G.kind === "plan" && G.revised && Object.keys(G.revised.units || {}).length ? G.revised : null, CHG = RV?.units || {};
const chgMark = (key) => (CHG[key] ? `<span class="chg" data-chg="${esc(key)}"><span class="chg-k" aria-hidden="true"></span>${esc(RV.mark)}</span>` : "");
const wdText = (t) => esc(t).replace(/\n{2,}/g, "\n");   // a paragraph a line: plan.md's blank lines would leave holes
const wordsHtml = (ops) => `<p class="wd">${ops.map(([op, t]) => (op === "=" ? wdText(t) : op === "-" ? `<del>${wdText(t)}</del>` : op === "+" ? `<ins>${wdText(t)}</ins>` : `<span class="wd-gap" title="Words that did not change, left out">…</span>\n`)).join("")}</p>`;
const saidHtml = (a) => {
  const when = a.t != null ? ` <span class="t">${fmt(a.t)}</span>` : "";
  if (a.kind === "edit") return `<li><p class="lab2">${esc(a.label)}</p><p class="wd"><del>${esc(a.before)}</del> <ins>${esc(a.after)}</ins></p>${a.words ? `<blockquote class="said">“${esc(a.words)}”</blockquote>` : ""}</li>`;
  return `<li><p><span class="lab2">${esc(a.label)}${a.chose ? `: “${esc(a.chose)}”` : ""}</span>${when}</p>${[a.words, a.note].filter(Boolean).map((w) => `<blockquote class="said">“${esc(w)}”</blockquote>`).join("")}</li>`;
};
const chgDrawn = new Set();
function chgWhat(key) {
  const u = CHG[key]; if (!u) return "";
  const first = !chgDrawn.has(key); chgDrawn.add(key);
  const body = [u.status === "added" ? `<p class="q3">New ${esc(RV.words)}: the version ${RV.against.kind === "review" ? "you reviewed" : "before"} did not have it.</p>` : "",
    u.diff ? `${wordsHtml(u.diff)}<p class="q3 wd-key"><del>Struck through</del> was taken out; <ins>underlined</ins> is new.</p>` : "",
    u.gone?.length ? `<p class="lab">Taken out</p><ul class="plain wd-gone">${u.gone.map((g) => `<li><del>${esc(g.title || g.text.slice(0, 240))}</del></li>`).join("")}</ul>` : "",
    u.asked?.length ? `<p class="lab">What your review said</p><ul class="asked">${u.asked.map(saidHtml).join("")}</ul>` : "",
    u.scenes?.length ? `<p class="q3 wd-v">The video changed with it: ${u.scenes.map((f) => watchEl("plan", f.n, { label: `Scene ${f.n}`, bare: true })).filter(Boolean).join(" ")}</p>` : ""].join("");
  return fold("What changed", body, { cls: "chgd", attrs: ` data-chgd="${esc(key)}"${first ? ` id="${esc(key)}-chg"` : ""}` });
}
// every changed part drawn where it is: a mark and its "What changed" left undrawn (a block the page shows no fold for)
// go with its step, or under the top's list
function chgLeft() {
  if (!RV) return;
  for (const key of RV.order) {
    if ($(`[data-chg="${CSS.escape(key)}"]`)) continue;
    const u = CHG[key], host = (u.step != null && document.getElementById(`step-${u.step}`)) || document.getElementById("revised"); if (!host) continue;
    host.insertAdjacentHTML("beforeend", `<div class="chg-left"><p class="lab">${esc(cap(u.label))} ${chgMark(key)}</p>${chgWhat(key)}</div>`);
  }
}
// a fold holding a change says so on its summary, quietly, so a closed one is found
function chgInside() {
  for (const m of $$("main [data-chg]")) for (let d = m.parentElement?.closest("details"); d; d = d.parentElement?.closest("details")) {
    const s = $(":scope > summary", d); if (!s || s.contains(m) || $(":scope > .chg-in", s)) continue;
    s.insertAdjacentHTML("beforeend", `<span class="chg-in" title="${esc(RV.mark)}: inside"><span class="chg-k" aria-hidden="true"></span><span class="vh">${esc(RV.mark)}, inside</span></span>`);
  }
}
function revisedTop() {
  if (!RV) return "";
  const n = RV.order.length, A = RV.against;
  const from = A.kind === "review" ? `plan.md as it was when you watched the video for that review (commit <code>${esc(A.commit)}</code>)${A.reviewMd ? `; what the review asked for is in <code>${esc(A.reviewMd)}</code>` : ""}` : `plan.md's previous version in git (commit <code>${esc(A.commit)}</code>, ${esc(A.day)}): ${esc(A.why || "")}`;
  return `<div class="revised" id="revised"><p class="rv-what"><span class="chg-k" aria-hidden="true"></span><b>Revised ${esc(RV.words)}:</b> ${count(n, "part")} of the plan changed, each marked “${esc(RV.mark)}” and listed under In short.${RV.gone?.length ? ` ${cap(count(RV.gone.length, "part"))} ${RV.gone.length === 1 ? "was" : "were"} taken out.` : ""}</p>
    <p class="rv-do"><button type="button" class="rv-only" data-only aria-pressed="false">Show only the changes</button></p>
    ${RV.gone?.length ? `<p class="lab">Taken out</p><ul class="plain wd-gone">${RV.gone.map((g) => `<li>${esc(cap(g.label))}${g.title ? `: <del>${esc(g.title)}</del>` : ""}</li>`).join("")}</ul>` : ""}
    <p class="q3 rv-from">Compared with ${from}.</p></div>`;
}
// "Show only the changes": the sections with no change fold to their headings; the folds holding one open
function onlyChanges(on) {
  document.body.classList.toggle("only-chg", on);
  for (const el of $$("main section.q, main section.step, main section.question, main section.cat")) el.classList.toggle("unchg", on && !el.querySelector("[data-chg]"));
  if (on) for (const m of $$("main [data-chg]")) for (let d = m.closest("details"); d; d = d.parentElement?.closest("details")) { d.open = true; fillLazy(d); }
  $$("[data-only]").forEach((b) => { b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "Show everything" : "Show only the changes"; });
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-only]"); if (!b || !RV) return; const on = !document.body.classList.contains("only-chg"); onlyChanges(on); store.set(`only:${RV.against.commit}`, on); if (on) $("#revised")?.scrollIntoView({ block: "start" }); });

/* ── code: a few regexes, not a parser ─────────────────────────────────────────────────────────────────── */
const KW = /\b(const|let|var|function|return|if|else|for|of|in|while|await|async|import|from|export|new|try|catch|throw|class|this|null|true|false|undefined|typeof|break|continue|case|switch|default|then|fi|do|done|echo|local)\b/;
function hl(text, lang) {
  const s = esc(text);
  if (lang === "md") { if (/^#{1,6} /.test(text)) return `<span class="th">${s}</span>`; return s.replace(/`([^`]+)`/g, '<span class="ts">`$1`</span>').replace(/\*\*([^*]+)\*\*/g, '<span class="th">**$1**</span>'); }
  if (lang === "json" || lang === "txt") return s.replace(/(&quot;[^&]*?&quot;)/g, '<span class="ts">$1</span>');
  let rest = s, tail = "";
  const cm = lang === "sh" ? rest.match(/(^|\s)(#.*)$/) : rest.match(/(^|[^:"'\\])(\/\/.*)$/);
  if (cm) { tail = `<span class="tc">${cm[2]}</span>`; rest = rest.slice(0, cm.index + cm[1].length); }
  rest = rest.replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;|'[^']*'|`[^`]*`)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]+)\b/g, (m, str, num, word) => str ? `<span class="ts">${str}</span>` : num ? `<span class="tn">${num}</span>` : word && KW.test(word) ? `<span class="tk">${word}</span>` : m);
  return rest + tail;
}
const langOf = (p) => /\.md$/.test(p) ? "md" : /\.json$/.test(p) ? "json" : /\.sh$|gitignore$/.test(p) ? "sh" : /\.(m?js|html|css)$/.test(p) ? "js" : "txt";
const cutOf = (body) => { const i = body.indexOf("\u0000"); return i < 0 ? [body, 0] : [body.slice(0, i), +body.slice(i + 1)]; };
function copyText(text, btn) {
  const done = (w) => { const was = btn.textContent; btn.textContent = w; setTimeout(() => (btn.textContent = was), 1400); };
  const fallback = () => { const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0"; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand("copy"); } catch {} ta.remove(); done(ok ? "Copied" : "Select and copy"); };
  try { navigator.clipboard.writeText(text).then(() => done("Copied"), fallback); } catch { fallback(); }
}

/* ── the diff: every file open, its changes with ten lines around them, or the whole file, changed lines marked ─ */
function hunkRows(f, c) {
  const lang = langOf(f.path); let html = "";
  for (const hk of c.hunks) {
    const m = hk.h.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/); let o = +(m?.[1] || 1), n = +(m?.[2] || 1);
    html += `<div class="hk">${esc(hk.h)}</div><div class="lines">`;
    for (const line of hk.l) {
      const k = line[0] || " ", [shown, more] = cutOf(line.slice(1)), cls = k === "+" ? "a" : k === "-" ? "d" : "";
      html += `<div class="L ${cls}" data-anchor="${esc(f.path)}:${k === "-" ? "-" + o : n}"><span class="o">${k === "+" ? "" : o}</span><span class="n" title="Note on this line">${k === "-" ? "" : n}</span><span class="c" data-no-anchor data-s="${k === " " ? " " : k}">${hl(shown, lang)}${more ? `<span class="cut"> … ${more.toLocaleString()} more characters on this line</span>` : ""}</span></div>`;
      if (k !== "+") o++; if (k !== "-") n++;
    }
    html += `</div>`;
  }
  return html;
}
// a file's whole text: kept once in the page (built.wholes) for every part of the change that shows it
const linesOf = (f) => f.lines || (f.whole ? f.whole.lines || G.built?.wholes?.[f.whole.key] || null : null);
function wholeRows(f, { quoted = [] } = {}) {
  const lang = langOf(f.path), mark = new Set(f.whole?.mark || []), q = (n) => quoted.some((r) => r.from != null && n >= r.from && n <= (r.to ?? r.from));
  let html = `<div class="lines">`;
  (linesOf(f) || []).forEach((line, i) => { const n = i + 1, [shown, more] = cutOf(line);
    html += `<div class="L${mark.has(n) ? " m" : ""}${q(n) ? " q" : ""}" id="${esc(f.id || "")}-L${n}" data-anchor="${esc(f.path)}:${n}"><span class="n" title="Note on this line">${n}</span><span class="c" data-no-anchor data-s=" ">${hl(shown, lang)}${more ? `<span class="cut"> … ${more.toLocaleString()} more characters</span>` : ""}</span></div>`; });
  return html + `</div>`;
}
function fileEl(f, base, i) {
  const has = !!linesOf(f);
  const sec = h(`<section class="file" id="${esc(base)}-f${i}"><div class="fh" data-anchor="${esc(f.path)}"><span class="path">${esc(f.path)}</span><span class="meta">${f.isNew ? "new file · " : ""}<span class="nA">+${f.add}</span> <span class="nD">−${f.del}</span></span><span class="grow"></span>
    ${f.generated ? "" : `<span class="seg2" role="group" aria-label="${esc(f.path)}: what to show"><button type="button" data-view="diff" aria-pressed="true">What changed</button>${has ? `<button type="button" data-view="whole" aria-pressed="false">Whole file</button>` : ""}</span><button type="button" data-copy>Copy</button>`}</div><div class="fbody2"></div></section>`);
  const body = $(".fbody2", sec);
  const show = (view) => {
    sec.dataset.view = view; $$("[data-view]", sec).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
    if (f.generated) { body.innerHTML = `<div class="genf">Written by the build, not by hand, so not shown line by line. To see it: <code>git show ${esc(f.commits[0]?.sha || "")} -- ${esc(f.path)}</code></div>`; return; }
    if (view === "whole" && has) { body.innerHTML = `<p class="wnote">The file as it is now; the lines this change wrote are marked.</p>` + wholeRows(f); return; }
    body.innerHTML = f.commits.map((c) => `${f.commits.length > 1 ? `<div class="csub">${esc(c.label)} · ${esc(c.sha)}</div>` : ""}${c.hunks?.length ? hunkRows(f, c) : `<div class="genf">${f.lite ? "Open the full guide for its lines." : "No lines to show (the file moved, or only its mode changed)."}</div>`}`).join("");
  };
  sec._show = show;
  $$("[data-view]", sec).forEach((b) => b.addEventListener("click", () => show(b.dataset.view)));
  const cb = $("[data-copy]", sec); if (cb) cb.addEventListener("click", () => copyText(sec.dataset.view === "whole" && has ? linesOf(f).map((l) => cutOf(l)[0]).join("\n") : f.commits.flatMap((c) => (c.hunks || []).flatMap((hk) => [hk.h, ...hk.l.map((l) => cutOf(l)[0])])).join("\n"), cb));
  show("diff"); return sec;
}
function diffScene(c) {
  const hand = c.files.filter((f) => !f.generated), gen = c.files.filter((f) => f.generated);
  const box = h(`<div class="dv"><div class="dv-top"><span class="c">${plural(hand.length, "file")}${gen.length ? `, and ${plural(gen.length, "file")} the build generates` : ""}</span><span class="grow"></span><button type="button" data-allwhole>Every file whole</button><button type="button" data-alldiff>Only what changed</button></div><nav class="dv-files" aria-label="Files"></nav><div class="files"></div></div>`);
  const nav = $(".dv-files", box), files = $(".files", box);
  c.files.forEach((f, i) => { const sec = fileEl(f, c.id, i); files.appendChild(sec); const b = h(`<button type="button">${esc(f.path.split("/").pop())}</button>`); b.title = f.path; b.addEventListener("click", () => sec.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })); nav.appendChild(b); });
  const every = (v) => $$(".file", files).forEach((s) => s._show && (v === "whole" ? $('[data-view="whole"]', s) && s._show("whole") : s._show("diff")));
  $("[data-allwhole]", box).addEventListener("click", () => every("whole")); $("[data-alldiff]", box).addEventListener("click", () => every("diff"));
  return box;
}

/* ── a run, whole, as it ran ──────────────────────────────────────────────────────────────────────────── */
function colorRun(t) {
  return esc(t).split("\n").map((l) => {
    if (/^\$ /.test(l)) return `<span class="cmd">${l}</span>`;
    if (/^\s*✗|\bfailed\b|\bfailing\b|^exit [1-9]/.test(l)) return `<span class="badc">${l}</span>`;
    if (/^\s*✓|^exit 0/.test(l)) return `<span class="okc">${l}</span>`;
    if (/^\s*[△⚠!]/.test(l)) return `<span class="warnc">${l}</span>`;
    if (/^\s*(──|▶|◆|◇|·)/.test(l)) return `<span class="dim">${l}</span>`;
    return l; }).join("\n");
}
const exitWords = (x) => (x == null ? "" : x === 0 ? "finished without an error" : `stopped with exit ${x}, reporting a problem it found`);
// a saved run's own line under it: how it ended, where it is, where and when it was made, and where its numbers are
// not the page's any more (a run of this guide's own build, saved before later commits and runs)
function runMeta(r) {
  const a = r.added, tag = r.scratch ? `<span class="src scratch" title="${esc(r.setup ? `The scratch repo: ${r.setup}` : "Made in a scratch repo set up for it, not in this one: the paths it names are that repo's")}">in a scratch repo</span> · ` : "";
  const when = !a ? "" : !a.sha ? " · not committed yet" : ` · ${a.during ? "saved while it was built" : `saved on ${esc(dateOf(a.date))}, after it was built`} (<code>${esc(a.sha)}</code>)`;
  return `<p class="runm">${tag}${esc(cap(exitWords(r.exit)))}${r.exit != null ? " · " : ""}saved as it ran, in <code>${esc(r.name)}</code>${when}</p>${sinceSaved(r)}`;
}
function sinceSaved(r) {
  const B = G.built; if (!B || !r.added?.sha || r.scratch || !G.planName || !new RegExp(`\\bguide\\b[^\\n]*${G.planName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(r.cmd || "")) return "";
  const f = +((/(\d+) files/.exec(r.text) || [])[1] || NaN), n = +((/(\d+) runs/.exec(r.text) || [])[1] || NaN), nowF = B.totals?.files, nowR = Object.keys(B.runs || {}).length;
  const diff = [Number.isFinite(f) && f !== nowF && `${plural(nowF, "file")} (${B.totals.hand} by hand, ${B.totals.gen} generated) where it said ${f}`, Number.isFinite(n) && n !== nowR && `${plural(nowR, "run")} where it said ${n}`].filter(Boolean);
  return diff.length ? `<p class="runm since">Saved at <code>${esc(r.added.sha)}</code>. Built now, it says ${diff.join(", and ")}: commits and runs were added to the plan after it was saved.</p>` : "";
}
function runHtml(r, { lines = 0 } = {}) {
  if (!r) return `<p class="q3">This run is not in the page.</p>`;
  const all = r.text.split("\n"), short = lines && all.length > lines + 2;
  return `<div class="run" data-real="${esc(r.name)}"><pre class="term" data-anchor="${esc(r.name)} · output">${colorRun((short ? all.slice(0, lines) : all).join("\n"))}${short ? `\n<span class="dim">… ${all.length - lines} more lines</span>` : ""}</pre>${runMeta(r)}</div>`;
}

/* ── the ledger: a decision's question, its answer and why ───────────────────────────────────────────── */
function ledgerEntry(id) {
  const d = (G.ledger || {})[id];
  if (!d) return `<p class="q3">${esc(id)} is not in this page's copy of the decision log.</p>`;
  const others = (d.options || []).filter((o) => !(o.id === d.chosenId || o.label === d.chosen));
  return `<div class="led" data-anchor="${esc(d.id)}">${d.why ? `<p><b>Because</b> ${inl(d.why)}</p>` : ""}${others.length ? `<p class="q3">Not chosen: ${others.map((o) => `${inl(o.label)}${o.why ? ` (${inl(o.why)})` : ""}`).join("; ")}.</p>` : ""}${d.note ? `<p class="q3">${inl(d.note)}</p>` : ""}
    <p class="lm">Decided ${esc(dateOf(d.date))}${d.plan && d.plan !== G.planName ? ` in the plan ${esc(d.plan.replace(/^\d{4}-\d{2}-\d{2}-/, ""))}` : ""}${d.status && d.status !== "active" && d.status !== "folded" ? ` · ${esc(d.status)}` : ""}${d.supersededBy ? `, replaced by ${esc(d.supersededBy)}` : d.supersededByPlan ? `, replaced by the plan ${esc(d.supersededByPlan.replace(/^\d{4}-\d{2}-\d{2}-/, ""))}` : d.status === "folded" && d.foldedInto ? ` · in force, its words now in ${esc(d.foldedInto)}` : ""} · <span class="ref">${esc(d.id)} in the decision log</span></p></div>`;
}
const decisionRow = (id) => { const d = (G.ledger || {})[id], gone = d && (d.supersededBy || d.supersededByPlan || (d.status && d.status !== "active" && d.status !== "folded"));   // folded into spec.md: still in force
  return `<details class="more dec${gone ? " gone" : ""}" id="${esc(id)}"><summary><span class="dq">${d ? inl(plainEnd(d.question || "")) : esc(id)}</span>${d ? ` <span class="da">${gone ? `<span class="was">${d.supersededBy || d.supersededByPlan ? "Replaced by a later answer" : cap(esc(d.status))}:</span> ` : ""}${inl(d.chosen)}</span>` : ""}</summary><div class="fbody">${ledgerEntry(id)}</div></details>`; };

/* ── diagrams (drawn when the page was built, as SVG: diagram.mjs); the page shows the one that fits, steps through its
   stages, and a click on a node goes where it points: a place on the page, a file of the change, a step ─────── */
const DG = new Map();
const runOf = (name) => G.built?.runs?.[name] || G.exRuns?.[name] || null;
function diagramHtml(d, { open = false } = {}) {
  if (!d) return "";
  DG.set(d.id, d);
  const words = (list) => `<ol class="dg-words">${list.map((x) => `<li>${inl(x.caption || x.words)}</li>`).join("")}</ol>`;
  // both drawings are in the page; fitDiagrams shows the one that reads at the column's width
  const view = (x) => x.wide ? `<div class="dg-box"><div class="dg-v dg-vw">${x.wide}</div><div class="dg-v dg-vn">${x.narrow}</div></div>` : `<p class="thin">${inl(`This diagram could not be drawn: ${(d.errors || []).join("; ")}`)}</p>`;
  const body = d.panels ? `<div class="seg2 dg-seg" role="group" aria-label="Before or after">${d.panels.map((p, i) => `<button type="button" data-side="${esc(p.side)}" aria-pressed="${i ? "true" : "false"}">${esc(cap(p.side))}${p.caption ? `<span class="q3">: ${inl(p.caption)}</span>` : ""}</button>`).join("")}</div>${d.panels.map((p, i) => `<div class="dg-panel" data-side="${esc(p.side)}"${i ? "" : " hidden"}>${view(p)}</div>`).join("")}`
    : view(d);
  // one control to step through it: ‹ | Step through · n stages | ›, then ‹ | 2 / n | › and "Show it all"; its
  // width never changes (both words held in one place, "Show it all" there from the start, off at rest)
  const steps = d.steppable && d.stages?.length > 1;
  const stepper = steps ? `<div class="dg-step"><span class="dg-sc" role="group" aria-label="Step through the diagram"><button type="button" data-dgstep="prev" aria-label="The stage before" disabled>‹</button><button type="button" class="dg-mid" data-dgstep="start"><span class="dg-count"><span class="dg-ca">Step through<span class="q3">${count(d.stages.length, "stage")}</span></span><span class="dg-cb" aria-hidden="true">${d.stages.length} / ${d.stages.length}</span></span></button><button type="button" data-dgstep="next" aria-label="The next stage">›</button></span><button type="button" class="lk dg-all" data-dgstep="all" disabled>Show it all</button><p class="dg-now" aria-live="polite"></p></div>` : "";
  // the stage in words, in a row of its own under the drawing: never over what it explains, each stage's
  // sentence in the same place, the row as tall as the longest (no jump), its number on the lit line in the drawing
  const capRow = steps ? `<div class="dg-cap" aria-hidden="true"><p class="dg-c0 on">${cap(count(d.stages.length, "stage"))}: step through ${d.stages.length === 2 ? "both" : "them"} with ‹ and ›, each said here in a sentence.</p>${d.stages.map((x, k) => `<p data-k="${k}"><span class="dg-no">${k + 1}</span><span>${inl(x.caption || x.words)}</span></p>`).join("")}</div>` : "";
  const inWords = d.panels ? d.panels.map((p) => `<p class="lab">${esc(cap(p.side))}${p.caption ? `: ${inl(p.caption)}` : ""}</p>${words(p.stages)}`).join("") : words(d.stages || []);
  return `<figure class="dg${d.auto ? " auto" : ""}" id="${esc(d.id)}" data-dg="${esc(d.id)}" data-anchor="diagram · ${esc(d.title || d.id)}">${d.title ? `<figcaption class="dg-title">${inl(d.title)}</figcaption>` : ""}${body}${d.caption ? `<p class="dg-note">${inl(d.caption)}</p>` : ""}${capRow}<div class="dg-foot">${stepper}${d.wide || d.panels ? `<button type="button" class="dg-big" data-dgbig>Open larger</button>` : ""}${(d.stages || []).length || d.panels ? fold("In words", inWords, { cls: "dg-alt", open }) : ""}</div></figure>`;
}
function dgStage(fig, i) {
  const d = DG.get(fig.dataset.dg); if (!d) return;
  const st = d.stages || [], mid = $(".dg-mid", fig), all = $(".dg-all", fig), now = $(".dg-now", fig), prev = $('[data-dgstep="prev"]', fig), next = $('[data-dgstep="next"]', fig);
  $$(".dg-e, .dg-la, .dg-n", fig).forEach((x) => x.classList.remove("on")); $$(".dg-mk", fig).forEach((x) => x.remove());
  const capOn = (k) => $$(".dg-cap>p", fig).forEach((p) => p.classList.toggle("on", k == null ? p.classList.contains("dg-c0") : p.dataset.k === String(k)));
  if (i == null || i < 0) { fig.classList.remove("stepping"); fig.dataset.at = ""; if (all) all.disabled = true; if (mid) mid.dataset.dgstep = "start"; if (prev) prev.disabled = true; if (next) next.disabled = false; if (now) now.textContent = ""; capOn(null); return; }
  i = Math.max(0, Math.min(st.length - 1, i)); const x = st[i]; fig.dataset.at = String(i); fig.classList.add("stepping");
  if (all) all.disabled = false; if (mid) mid.dataset.dgstep = "";
  if (prev) prev.disabled = i === 0; if (next) next.disabled = i === st.length - 1;
  $$(`:is(.dg-e,.dg-la)[data-i~="${x.i}"]`, fig).forEach((e) => e.classList.add("on"));
  for (const id of [x.from, x.to].filter(Boolean)) $$(".dg-n", fig).filter((n) => n.dataset.n === id).forEach((n) => n.classList.add("on"));
  $(".dg-cb", fig).textContent = `${i + 1} / ${st.length}`;
  now.innerHTML = inl(x.caption || x.words); capOn(i);
  dgMark(fig, x, i);
  // the diagram in view while it is stepped through: brought to the middle when less than 70 % of it shows
  const r = fig.getBoundingClientRect(), seen = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / (Math.min(r.height, innerHeight) || 1);
  if (seen < 0.7) { const bar = document.documentElement.hasAttribute("data-embedded") ? 16 : 72; scrollTo({ top: scrollY + r.top - Math.max(bar, (innerHeight - r.height) / 2), behavior: reduced ? "auto" : "smooth" }); }
}
// the stage's number on its lit line, pointing to the same number in the caption row under the drawing: on
// the line where it is clear of every box and label (from its middle out), else at its middle; a note's at its corner. A
// drawing wider than its column (a phone) scrolls the lit line into view.
function dgMark(fig, x, i) {
  for (const svg of $$(".dg-v svg", fig)) {
    const g = svg.querySelector(":scope>g"); if (!g) continue;
    const boxes = [...$$(".dg-n rect, .dg-la text", svg)].map((el) => { try { const b = el.getBBox(); return b; } catch { return null; } }).filter((b) => b && b.width);
    const clear = (p, r) => boxes.every((b) => p.x + r < b.x || p.x - r > b.x + b.width || p.y + r < b.y || p.y - r > b.y + b.height);
    let at = null;
    const line = $$(`.dg-e[data-i~="${x.i}"] .dg-l`, svg)[0], note = $$(`.dg-e.dg-note[data-i~="${x.i}"] rect`, svg)[0];
    try {
      if (line) { const L = line.getTotalLength(); if (!L) continue; for (const f of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) { const p = line.getPointAtLength(L * f); if (clear(p, 12)) { at = p; break; } } at = at || line.getPointAtLength(L * 0.5); }
      else if (note) { const b = note.getBBox(); if (!b.width) continue; at = { x: b.x, y: b.y }; }
    } catch { continue; }
    if (!at) continue;
    const NS = "http://www.w3.org/2000/svg", mk = document.createElementNS(NS, "g"); mk.setAttribute("class", "dg-mk"); mk.setAttribute("aria-hidden", "true");
    mk.innerHTML = `<circle cx="${at.x.toFixed(1)}" cy="${at.y.toFixed(1)}" r="10"/><text x="${at.x.toFixed(1)}" y="${(at.y + 4.5).toFixed(1)}" text-anchor="middle">${i + 1}</text>`;
    g.appendChild(mk);
    const v = svg.closest(".dg-v"); if (v && v.scrollWidth > v.clientWidth + 2 && svg.getBoundingClientRect().width) { const r = mk.getBoundingClientRect(), vb = v.getBoundingClientRect(); if (r.left < vb.left + 24 || r.right > vb.right - 48) v.scrollTo({ left: v.scrollLeft + (r.left + r.width / 2) - (vb.left + vb.width / 2), behavior: reduced ? "auto" : "smooth" }); }
  }
}
// which drawing a diagram shows: the wide one where it reads at 85 % of its size or more (a 13 px label stays 11 px
// or more); else the phone one, scaled to the column under the same rule; failing both, the phone one at
// 85 %, scrolling sideways, "Open larger"
function fitDiagrams(root = document) {
  for (const b of $$(".dg-box", root)) {
    const cw = b.clientWidth; if (!cw) continue;
    const wide = $(".dg-vw svg", b), narrow = $(".dg-vn svg", b); if (!wide || !narrow) continue;
    const ww = +wide.getAttribute("width"), nw = +narrow.getAttribute("width");
    const useWide = cw >= DG_MIN * ww || nw >= ww, svg = useWide ? wide : narrow, w = useWide ? ww : nw, scroll = cw < DG_MIN * w;
    $(".dg-vw", b).style.display = useWide ? "block" : "none"; $(".dg-vn", b).style.display = useWide ? "none" : "block";
    svg.style.minWidth = scroll ? `${Math.ceil(w * DG_MIN)}px` : "";
    b.classList.toggle("dg-scroll", scroll);
  }
  for (const f of $$("figure.dg", root)) f.classList.toggle("dg-scrolls", $$(".dg-box.dg-scroll", f).length > 0);
  // a command that still runs past its edge (a word longer than the line) fades there and scrolls
  for (const c of $$(".ex-in pre, .cmdline code", root)) if (c.clientWidth) c.classList.toggle("ovf", c.scrollWidth > c.clientWidth + 1);
}
const DG_MIN = 0.85;
// a section's 20 px lead is two sentences at most: what follows it reads at the body's size, a paragraph
// of its own (the cut only between two sentences in the lead's own words, never inside a link or code)
function splitLeads(root = document) {
  for (const p of $$("section.q > p.say", root)) {
    if (p.dataset.split) continue; p.dataset.split = "1";
    let n = 0, cut = null;
    for (const t of [...p.childNodes].filter((x) => x.nodeType === 3)) { const re = /[.!?][”’")]?\s+(?=[A-Z0-9“"(])/g; let m; while ((m = re.exec(t.data))) if (++n === 2) { cut = { t, at: m.index + m[0].length }; break; } if (cut) break; }
    if (!cut) continue;
    const q = document.createElement("p"); q.className = "say-more"; let x = cut.t.splitText(cut.at);
    while (x) { const nx = x.nextSibling; q.appendChild(x); x = nx; }
    if (q.textContent.trim()) p.after(q);
  }
}
const fitSoon = (() => { let raf = 0; return () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => fitDiagrams()); }; })();
addEventListener("resize", fitSoon);
document.addEventListener("toggle", (e) => { if (e.target.open && e.target.querySelector?.(".dg-box, .ex-in, .cmdline")) fitSoon(); }, true);
document.addEventListener("scroll", (e) => { const v = e.target.closest?.(".dg-box.dg-scroll .dg-v"); if (v) v.parentElement.classList.toggle("at-end", v.scrollLeft + v.clientWidth >= v.scrollWidth - 4); }, true);
// "Open larger": the drawing at its own size, over the page; Esc, a click or the button closes it
function openBig(fig) {
  const v = $$(".dg-v", fig).find((b) => b.style.display !== "none" && !b.closest("[hidden]")); if (!v) return;
  const lb = h(`<div class="dg-lbx" role="dialog" aria-modal="true" aria-label="${esc(fig.querySelector(".dg-title")?.textContent || "The diagram")}, larger"><button type="button" class="x">Close</button></div>`);
  const svg = $("svg", v).cloneNode(true); svg.style.minWidth = ""; svg.removeAttribute("aria-labelledby"); lb.appendChild(svg);
  const back = document.activeElement, close = () => { lb.remove(); removeEventListener("keydown", key, true); back?.focus?.(); };
  const key = (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } };
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".x")) close(); });
  addEventListener("keydown", key, true); document.body.appendChild(lb); $(".x", lb).focus();
}
document.addEventListener("click", (e) => {
  const big = e.target.closest("[data-dgbig]"); if (big) { openBig(big.closest("figure.dg")); return; }
  const b = e.target.closest("[data-dgstep]"); if (b) { const k = b.dataset.dgstep; if (!k) return; const fig = b.closest("figure.dg"), at = fig.dataset.at === "" || fig.dataset.at == null ? -1 : +fig.dataset.at;
    dgStage(fig, k === "start" ? 0 : k === "next" ? at + 1 : k === "prev" ? at - 1 : null); if (k === "start" || k === "all") $(`[data-dgstep="${k === "all" ? "start" : "next"}"]`, fig)?.focus(); return; }
  const side = e.target.closest(".dg-seg [data-side]"); if (side) { const fig = side.closest("figure.dg"); $$(".dg-seg [data-side]", fig).forEach((x) => x.setAttribute("aria-pressed", String(x === side))); $$(".dg-panel", fig).forEach((p) => (p.hidden = p.dataset.side !== side.dataset.side)); fitSoon(); return; }
  const n = e.target.closest(".dg-n[data-link]"); if (n && !window.getSelection()?.toString()) { e.preventDefault(); goLink(n.dataset.link); }
});
document.addEventListener("keydown", (e) => {
  const n = e.target.closest?.(".dg-n[data-link]"); if (n && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); goLink(n.dataset.link); return; }
  const fig = e.target.closest?.("figure.dg.stepping"); if (fig && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); dgStage(fig, +fig.dataset.at + (e.key === "ArrowRight" ? 1 : -1)); }
});
// hover a node: its own edges stay, the rest fade (not while stepping)
document.addEventListener("pointerover", (e) => { const n = e.target.closest?.(".dg-n"); const fig = n?.closest("figure.dg"); if (!fig || fig.classList.contains("stepping")) return; const id = n.dataset.n;
  fig.classList.add("hovering"); $$(".dg-e, .dg-la", fig).forEach((x) => x.classList.toggle("on", x.dataset.from === id || x.dataset.to === id)); $$(".dg-n", fig).forEach((x) => x.classList.toggle("on", x.dataset.n === id || $$(".dg-e.on", fig).some((ed) => ed.dataset.from === x.dataset.n || ed.dataset.to === x.dataset.n))); });
document.addEventListener("pointerout", (e) => { const n = e.target.closest?.(".dg-n"); const fig = n?.closest("figure.dg"); if (!fig || fig.classList.contains("stepping") || e.relatedTarget?.closest?.(".dg-n")) return; fig.classList.remove("hovering"); $$(".dg-e.on, .dg-la.on, .dg-n.on", fig).forEach((x) => x.classList.remove("on")); });

// the files of the change, by path: a link to one opens its diff there, the whole file shown
const FILES = new Map(); (G.built?.cats || []).forEach((c) => c.files.forEach((f, i) => { if (!FILES.has(f.path)) FILES.set(f.path, { cat: c, i, f }); }));
function openFile(path, { whole = true } = {}) {
  const x = FILES.get(String(path).replace(/^\.\//, "").replace(/:\d+(?:-\d+)?$/, "")); if (!x) return false;
  const id = `${x.cat.id}-f${x.i}`; openAt(id);
  const sec = document.getElementById(id); if (sec && whole && !x.f.generated && sec._show && $('[data-view="whole"]', sec)) sec._show("whole");
  return true;
}
function goLink(l) {
  if (!l) return;
  if (/^#/.test(l)) return openAt(l.slice(1));
  if (/^step-\d+$/.test(l)) return openAt(l);
  if (/^t=\d/.test(l)) { location.href = watchHref(G.own, +l.slice(2)); return; }
  if (!openFile(l)) openAt(l);
}
// a file's path in words (`scripts/lib/guide/model.mjs`, `model.mjs`) becomes a link to it, where the change has it
const BASE = new Map(); for (const p of FILES.keys()) { const b = p.split("/").pop(); BASE.set(b, BASE.has(b) ? null : p); }
linkFiles = function (root) {
  if (!FILES.size || !root) return;
  $$("code", root).forEach((c) => { if (c.closest("a, pre, .cmdline, .dg-svg, .L, summary") || c.dataset.fl) return; c.dataset.fl = "1";
    const t = c.textContent.trim().replace(/^\.\//, "").replace(/:\d+(?:-\d+)?$/, ""), p = FILES.has(t) ? t : BASE.get(t) || null; if (!p) return;
    const a = document.createElement("a"); a.href = "#"; a.className = "fl"; a.dataset.file = p; a.title = `See ${p} in the code: what changed, and the file whole`; c.replaceWith(a); a.appendChild(c); });
};
document.addEventListener("click", (e) => { const a = e.target.closest("a.fl[data-file]"); if (a) { e.preventDefault(); if (!openFile(a.dataset.file)) a.classList.add("gone"); } });

/* ── worked examples: each case its tab; the input, what happens, the edge cases; the real output a click away ─── */
// a field's words start with a capital, unless they start with code or a name written in lower case on purpose
const capMd = (t) => String(t || "").replace(/^(\s*)(?!(?:reel|reelplanning|npm|npx|git|gh|node|ffmpeg)\b)([a-z])(?=[a-z' ,])/, (_, sp, c) => sp + c.toUpperCase());
const FIELD_NAMES = { input: "Input", happens: "What happens", predict: "Before you look", edges: "Edge cases", why: "Why" };
const isCmd = (t) => /^`[^`\n]+`$/.test(String(t || "").trim()) && /^(?:\$\s*)?(?:npx\s+reelplanning|reelplanning|reel|npm|npx|node|git|gh|cat)\s/.test(String(t).trim().slice(1, -1));
function exampleBody(s, e, k) {
  const pid = `${s.id}-ex-${k + 1}`;
  // the input, the same block every time: a command with its Copy, a line of code, or words
  const input = e.input ? (() => { const t = e.input.trim(), code = /^`[^`\n]+`$/.test(t) ? t.slice(1, -1) : null;
    if (code && isCmd(t)) { const c = code.replace(/^\$\s*/, ""); return `<div class="ex-in"><pre class="ex-cmd"><span class="ps">$ </span>${esc(c)}</pre><button type="button" class="copy" data-copytext="${esc(c)}" aria-label="Copy the command">Copy</button></div>`; }
    if (code) return `<div class="ex-in"><pre>${esc(code)}</pre></div>`;
    return `<div class="ex-in"><div class="ex-txt">${md(capMd(e.input))}</div></div>`; })() : "";
  const runs = (e.runs || []).map((r) => ({ ...r, run: runOf(r.name) })).filter((r) => r.run);
  const out = runs.map((r) => { const all = r.run.text.split("\n"); const lo = r.from ? Math.max(1, r.from) : null, hi = r.to || lo;
    const view = lo ? `<pre class="term" data-anchor="${esc(r.name)} · lines ${lo}-${hi}">${colorRun(all.slice(lo - 1, hi).join("\n"))}</pre>${all.length > hi - lo + 1 ? `${r.run.scratch ? runMeta(r.run) : ""}${fold(`All ${all.length} lines of it`, runHtml(r.run))}` : runMeta(r.run)}` : runHtml(r.run);
    return `<div class="run" data-real="${esc(r.name)}">${view}</div>`; }).join("");
  const reveal = out ? (e.predict ? `<div class="ex-predict"><p class="ex-k">${FIELD_NAMES.predict}</p>${md(capMd(e.predict))}<button type="button" class="ex-show" data-reveal="${pid}-out">Show what it really printed</button></div><div class="ex-out" id="${pid}-out" hidden><p class="ex-k">What it really printed</p>${out}</div>`
    : `<div class="ex-out" id="${pid}-out"><p class="ex-k">What it printed</p>${out}</div>`)
    : e.output ? `<p class="ex-k">Output</p>${md(e.output)}` : `<p class="q3">No saved run for this case: what it does is as described.</p>`;
  const ba = e.before && e.after ? `<div class="ex-ba"><div class="seg2" role="group" aria-label="Before or after"><button type="button" data-ba="before" aria-pressed="false">Before</button><button type="button" data-ba="after" aria-pressed="true">After</button></div><div class="ex-bav" data-ba="before" hidden>${md(e.before)}</div><div class="ex-bav" data-ba="after">${md(e.after)}</div></div>` : "";
  // an example run in a scratch repo says so where its input is: its paths are that repo's
  const scratchIn = (e.runs || []).some((r) => runOf(r.name)?.scratch);
  return `${input ? `<p class="ex-k">${FIELD_NAMES.input}</p>${input}${scratchIn ? `<p class="runm ex-foot"><span class="src scratch">in a scratch repo</span> · set up for it: the paths it names are that repo's</p>` : ""}` : ""}${e.happens ? `<p class="ex-k">${FIELD_NAMES.happens}</p>${md(capMd(e.happens), { gloss: true })}` : ""}${ba}${reveal}
    ${e.edges?.length ? `<p class="ex-k">${FIELD_NAMES.edges}</p><ul class="ex-edges">${e.edges.map((x) => `<li>${glossIds(inl(capMd(x)))}</li>`).join("")}</ul>` : ""}${e.why ? `<p class="ex-k">${FIELD_NAMES.why}</p>${md(capMd(e.why), { gloss: true })}` : ""}${e.rest ? md(e.rest, { gloss: true }) : ""}`;
}
function examplesHtml(s) {
  const X = s.depth?.examples || []; if (!X.length) return "";
  const one = X.length === 1;
  const tabs = one ? "" : `<div class="ex-tabs" role="tablist" aria-label="Step ${s.n}: the cases">${X.map((e, k) => `<button type="button" role="tab" id="${s.id}-ex-${k + 1}-tab" aria-controls="${s.id}-ex-${k + 1}" aria-selected="${k ? "false" : "true"}" tabindex="${k ? -1 : 0}">${inl(e.name)}</button>`).join("")}</div>`;
  return `<div class="exs" id="${s.id}-examples"><p class="lab">${one ? "A worked example" : `Worked examples: ${count(X.length, "case")}, each with what it really printed`}</p>${tabs}${X.map((e, k) => `<div class="ex-p" id="${s.id}-ex-${k + 1}"${one ? "" : ` role="tabpanel" aria-labelledby="${s.id}-ex-${k + 1}-tab"`}${k && !one ? " hidden" : ""} data-anchor="step ${s.n} · example · ${esc(e.name)}">${one ? `<p class="ex-name">${inl(e.name)}</p>` : ""}${exampleBody(s, e, k)}</div>`).join("")}</div>`;
}
document.addEventListener("click", (e) => {
  const t = e.target.closest(".ex-tabs [role=tab]"); if (t) { selectTab(t); return; }
  const r = e.target.closest("[data-reveal]"); if (r) { const box = document.getElementById(r.dataset.reveal); if (box) { box.hidden = !box.hidden; r.setAttribute("aria-expanded", String(!box.hidden)); r.textContent = box.hidden ? (r.closest(".ex-predict") ? "Show what it really printed" : "Show the real output") : "Hide it"; } return; }
  const ba = e.target.closest(".ex-ba [data-ba]"); if (ba && ba.tagName === "BUTTON") { const box = ba.closest(".ex-ba"); $$("button[data-ba]", box).forEach((x) => x.setAttribute("aria-pressed", String(x === ba))); $$(".ex-bav", box).forEach((v) => (v.hidden = v.dataset.ba !== ba.dataset.ba)); }
});
function selectTab(t) { const list = t.closest("[role=tablist]"); $$("[role=tab]", list).forEach((x) => { const on = x === t; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = !on; });
  // (on a phone the tabs scroll in one row: the chosen one comes into it)
  if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: Math.max(0, t.offsetLeft - list.offsetLeft - 24), behavior: reduced ? "auto" : "smooth" }); fitSoon(); }
document.addEventListener("keydown", (e) => { const t = e.target.closest?.(".ex-tabs [role=tab]"); if (!t || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return; e.preventDefault(); const all = $$("[role=tab]", t.parentElement), i = all.indexOf(t); const n = e.key === "Home" ? all[0] : e.key === "End" ? all.at(-1) : all[(i + (e.key === "ArrowRight" ? 1 : all.length - 1)) % all.length]; selectTab(n); n.focus(); });

/* ── the depth the video skips: why it works so, what else was weighed, what breaks it, its limits, where it is ── */
// the step's "why" is read in the flow; what else was weighed, what breaks it, its limits and its files wait in "More on
// this step" (depthMore), with what was built and what the plan asked for
function depthIntro(s) { const x = (s.depth?.intro || []).map((x) => bareDecisions(md(x.md, { anchor: `step ${s.n} · for the guide`, gloss: true }))).join(""); return x ? `<div class="depth-intro">${x}</div>` : ""; }
function depthHtml(s, { intro: withIntro = true } = {}) {
  const D = s.depth || {}, items = D.depth || [], why = items.find((d) => /^why\b/i.test(d.head));
  const intro = withIntro ? (D.intro || []).map((x) => md(x.md, { anchor: `step ${s.n} · for the guide`, gloss: true })).join("") : "";
  if (!why && !intro) return "";
  return `<div class="depth" id="${s.id}-depth">${intro ? `<div class="depth-intro">${intro}</div>` : ""}${why ? `<div class="why" id="${s.id}-why"><p class="lab">${inl(why.head)}</p>${bareDecisions(md(why.md, { anchor: `step ${s.n} · ${why.head}`, gloss: true }))}</div>` : ""}</div>`;
}
// the words the author wrote after a step's diagram, which read against it: right after the drawing
const depthAfter = (s) => { const x = (s.depth?.after || []).map((x) => bareDecisions(md(x.md, { anchor: `step ${s.n} · after the diagram`, gloss: true }))).join(""); return x ? `<div class="depth-intro dg-after">${x}</div>` : ""; };
const depthMore = (s) => (s.depth?.depth || []).filter((d) => !/^why\b/i.test(d.head)).map((d, k) => `<div class="dp" id="${s.id}-d${k + 1}"><p class="dp-h">${inl(d.head)}</p>${bareDecisions(md(d.md, { anchor: `step ${s.n} · ${d.head}`, gloss: true }))}</div>`).join("");
function howHtml(s) {
  const ds = s.depth?.diagrams || []; if (!ds.length) return "";
  // (each diagram's own title is the heading: no "How it works" stacked over it)
  return `<div class="how" id="${s.id}-how" aria-label="How it works">${ds.map((d) => diagramHtml(d)).join("")}</div>`;
}
// where the video stops for you, on its timeline: each pause, quick check, question, the list, and what it asks at the
// end; an older video's grouped beat is on it too, said for what it is: its choices shown on one sheet, not a pause on each
const STOP_KIND = { choices: "Pauses on", list: "The list at the end", shown: "Shown, not a pause", check: "A quick check", question: "A question for you", open: "It asks" };
function stopsHtml(which) {
  const v = V[which], S = v?.stops || []; if (!S.length || !v.total) return "";
  const item = (x) => { const f = v.scenes.find((y) => y.n === x.n);
    const ids = (x.ids || []).map((id) => { const c = (G.built?.calls || []).find((y) => y.id === id); const t = c ? cardTitle(c) : "";
      // each choice on its own line, its number a small muted chip after its words (the words are the link)
      return `<span class="tl-c">${c ? `<a href="#choice-${esc(id)}" data-open="choice-${esc(id)}" title="${esc(callGloss(id))}">${inl(t)}</a>` : `<abbr class="idg" title="${esc(callGloss(id))}">a choice</abbr>`}<span class="ref">${esc(id)}</span></span>`; }).join("");
    // a quick check's question is the video's to ask: here only that there is one, before the scene that answers it
    const n = (x.ids || []).length;
    const what = x.kind === "choices" ? `${STOP_KIND.choices} ${n === 1 ? "one choice" : `${count(n, "choice")}, each judged on its own`}: ${ids}`
      : x.kind === "list" ? `${STOP_KIND.list}, ${count(n, "choice")} to flag if you'd change them (not judged otherwise): ${ids}`
      : x.kind === "shown" ? `${STOP_KIND.shown}: ${n === 1 ? "one smaller choice" : `${count(n, "smaller choice")}`} on one sheet, which Accept all takes; flag any you'd change: ${ids}`
      : x.kind === "check" ? `${STOP_KIND.check}: you predict, then it shows you` : `${STOP_KIND[x.kind]}: ${inl(x.text || "")}`;
    // the time is when the player stops (the plan map's `at`); "Watch its scene" goes to where that scene starts
    return `<li class="tl-i k-${x.kind}" data-kind="${x.kind}" data-ids="${esc((x.ids || []).join(" "))}" data-anchor="the video's stops · scene ${x.n}"><span class="tl-t">${fmt(x.at ?? x.t)}</span><span class="tl-w">${what}</span>${f ? watchEl(which, f.n, { label: "Watch its scene" }) : ""}</li>`; };
  const marks = S.map((x, i) => `<span class="tl-m k-${x.kind}" style="left:${(100 * (x.at ?? x.t ?? 0) / v.total).toFixed(2)}%" title="${esc(fmt(x.at ?? x.t))}" aria-hidden="true"></span>`).join("");
  const kinds = [...new Set(S.map((x) => x.kind))], LEG = { choices: "a pause on choices", question: "a question", check: "a quick check", list: "the list", shown: "choices shown, not a pause", open: "a last question" };
  return `<div class="tl" data-anchor="the video's stops"><p class="lab">Where ${esc(videoName(which))} stops for you <span class="n">${fmt(v.total)} in all</span></p><div class="tl-bar" aria-hidden="true">${marks}</div><p class="tl-leg" aria-hidden="true">${kinds.map((k) => `<span><i class="tl-m k-${k}"></i>${esc(LEG[k])}</span>`).join("")}</p><ol class="tl-list">${S.map(item).join("")}</ol></div>`;
}

/* ── a step: what it lets you do, shown working; then what the plan asked for, folded ────────────────────── */
function casesHtml(s) {
  const rows = s.cases.rows.map((r) => {
    const sc = scenesFor("plan", (f) => f.guide === `${s.id}#cases` || f.guide === `${s.id}#case-${r.i}`)[0];
    return `<details class="more case" id="${s.id}-case-${r.i}"><summary data-anchor="step ${s.n} · case ${r.i}" data-editable><span class="cn">${inl(r.case)}</span>${chgMark(`${s.id}-case-${r.i}`)}</summary><div class="fbody">${chgWhat(`${s.id}-case-${r.i}`)}<div class="trace">
      <p><span class="lab">For example</span> ${inl(r.example)}</p><p><span class="lab">What happens</span> ${inl(r.happens)}</p>
      ${r.trace?.length ? `<p class="lab">Step by step</p><ol class="beats-t">${r.trace.map((b, i) => `<li data-anchor="step ${s.n} · case ${r.i} · trace ${i + 1}" data-editable>${b.label ? `<b>${esc(b.label)}</b> ` : ""}${inl(b.text)}</li>`).join("")}</ol>` : ""}
      ${sc ? watchEl("plan", sc.n) : ""}</div></div></details>`; }).join("");
  // what the plan leaves out of its cases, said once for the step, not under each
  const untraced = s.cases.rows.filter((r) => !r.trace?.length).length, N = s.cases.rows.length;
  const gap = untraced ? `<p class="q3 gapnote">${untraced === N ? `The plan spells none of ${N === 1 ? "this case" : `these ${N} cases`} out step by step (it has no Trace column): each has its example and what happens.` : `The plan spells ${N - untraced} of these ${N} cases out step by step; the other ${untraced} ${untraced === 1 ? "has" : "have"} only an example and what happens.`}</p>` : "";
  return `<div class="cases" id="${s.id}-cases">${chgWhat(`${s.id}-cases`)}${s.cases.intro && !/^\|/.test(s.cases.intro) ? md(s.cases.intro, { anchor: `step ${s.n} · cases`, editable: true }) : ""}${gap}${rows}</div>`;
}
function ifaceHtml(s) {
  const parts = s.iface.parts.map((p) => {
    const flags = p.subs.filter((x) => /^-/.test(x.line));
    return `<details class="more ip" id="${s.id}-if-${p.i}"><summary data-anchor="step ${s.n} · interface · ${esc(p.token)}" data-editable><code class="il">${esc(p.line)}</code>${p.meaning ? ` <span class="im">${inl(p.meaning)}</span>` : ""}</summary><div class="fbody spec">
      ${p.subs.length ? `<table class="subs"><tbody>${p.subs.map((x) => `<tr data-anchor="step ${s.n} · interface · ${esc(x.line)}" data-editable><td><code>${esc(x.line)}</code></td><td>${x.meaning ? inl(x.meaning) : `<span class="q3">—</span>`}</td></tr>`).join("")}</tbody></table>` : ""}
      ${flags.length ? `<div class="try" data-try="${s.id}-if-${p.i}"><p class="lab">Try it: pick the options ${planned}</p><div class="flags">${flags.map((x, i) => `<label><input type="checkbox" data-f="${i}"> <code>${esc(x.line.split(/\s+/)[0])}</code></label>`).join("")}</div><pre class="term tryout"></pre></div>` : ""}
      ${p.out.length ? `<p class="lab">What it prints ${planned}</p><pre class="term planned">${colorRun(p.out.join("\n"))}</pre>` : ""}
      ${p.mentions.length ? `<p class="lab">What the step says about <code>${esc(p.token)}</code></p><ul class="ment">${p.mentions.map((m) => `<li>${inl(m)}</li>`).join("")}</ul>` : ""}</div></details>`; }).join("");
  const lines = s.iface.parts.flatMap((p) => [p, ...p.subs]), bare = lines.filter((x) => !x.meaning).length;
  const gap = bare ? `<p class="q3 gapnote">${bare === lines.length ? `The plan says what none of these ${lines.length === 1 ? "line" : `${lines.length} lines`} means (no <code># what it means</code> after ${lines.length === 1 ? "it" : "them"}).` : `The plan says what ${lines.length - bare} of these ${lines.length} lines mean; ${bare === 1 ? "one has" : `${bare} have`} no <code># what it means</code> after ${bare === 1 ? "it" : "them"}.`}</p>` : "";
  return `<div class="iface" id="${s.id}-interface">${chgWhat(`${s.id}-interface`)}${s.iface.none ? `<p>${inl(s.iface.none)}</p>` : ""}${gap}${parts}${s.iface.after ? md(s.iface.after, { anchor: `step ${s.n} · interface`, editable: true }) : ""}</div>`;
}
function wireTry(root) {
  $$(".try[data-try]", root).forEach((box) => { if (box.dataset.wired) return; box.dataset.wired = "1";
    const [sid, , pi] = box.dataset.try.split(/-(if)-/); const s = G.steps.find((x) => x.id === sid), p = s?.iface?.parts.find((x) => String(x.i) === pi); if (!p) return;
    const flags = p.subs.filter((x) => /^-/.test(x.line)), out = $(".tryout", box);
    const draw = () => { const on = $$("[data-f]", box).filter((x) => x.checked).map((x) => flags[+x.dataset.f]); out.innerHTML = colorRun([`$ ${p.line.split(/\s\[/)[0]} ${on.map((f) => f.line.split(/\s+/)[0]).join(" ")}`.trim(), ...p.out, ...on.flatMap((f) => f.out)].join("\n")); };
    $$("[data-f]", box).forEach((x) => x.addEventListener("change", draw)); draw(); });
}
function ifaceBuiltHtml(s) {
  const planned2 = (s.iface?.parts || []).map((p) => p.line), built = s.built.ifaceBuilt.parts.map((p) => p.line);
  const row = (l, other, cls) => `<div class="ibl ${other.includes(l) ? "" : cls}" data-anchor="step ${s.n} · interface as built · ${esc(l.split(/\s+/)[0])}"><code>${esc(l)}</code>${other.includes(l) ? "" : `<span class="q3">${cls === "gone" ? "not built this way" : "differs from the plan"}</span>`}</div>`;
  return `<div class="ib"><div><p class="lab">What the plan said</p>${planned2.map((l) => row(l, built, "gone")).join("") || `<p class="q3">No interface in the plan.</p>`}</div><div><p class="lab">What was built</p>${built.map((l) => row(l, planned2, "new")).join("")}</div></div>`;
}
// predict, then see: a case's example, and what happens in three of the step's cases to choose from (the plan's answer)
function predictHtml(s) {
  const rows = (s.cases?.rows || []).filter((r) => r.example && r.happens); if (rows.length < 2) return "";
  const r = rows.find((x) => /`/.test(x.example)) || rows[0];
  const pool = [...new Set(rows.map((x) => x.happens))]; if (pool.length < 2) return "";
  const picks = [r.happens, ...pool.filter((x) => x !== r.happens).slice(0, 2)];
  const order = picks.map((p, i) => [p, (i * 7 + s.n) % 5]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
  return `<div class="predict" data-predict="${esc(r.happens)}"><p class="lab">Check yourself</p><p>${inl(r.case)}: ${inl(r.example)}. What happens?</p><div class="opts">${order.map((o) => `<button type="button" class="opt" data-p="${esc(o)}">${inl(o)}</button>`).join("")}</div><p class="verdict" aria-live="polite"></p></div>`;
}
document.addEventListener("click", (e) => { const b = e.target.closest(".predict .opt"); if (!b) return; const box = b.closest(".predict"), ok = b.dataset.p === box.dataset.predict;
  $$(".opt", box).forEach((x) => { x.classList.toggle("right", x.dataset.p === box.dataset.predict); x.classList.toggle("wrong", x === b && !ok); });
  $(".verdict", box).textContent = ok ? "Yes: that is what the plan says happens." : "Not quite: the plan's answer is marked."; });

// the step's opening line under what it lets you do: the plan's first sentence, its long asides left out (they are in
// the plan's words, a click away); one that only quotes what was asked ("…": yes.) gives way to the walkthrough's own
const leadOf = (s, bs) => { if (BUILT && s.depth?.lead?.md) return cap(s.depth.lead.md); let t = s.lead; if (/^["“]/.test(t)) { if (!bs?.lead || /^["“]|^(?:\*\*)?You can now\b/i.test(bs.lead)) return ""; t = bs.lead; } else if (bs?.status === "done") t = beforeThis(t); return short(t, 8)[0]; };
// a built step's plan words that say how things were ("Today the review page lists …") are about before it: said so
const beforeThis = (t) => String(t || "").replace(/^Today,?\s+/, "Before this step, as the plan wrote it: ");
function stepArticle(s) {
  const which = BUILT ? "built" : "plan", shown = s.shown && V[s.shown.video]?.scenes.find((f) => f.n === s.shown.n);
  const bs = s.built, sh = BUILT ? shortSteps().find((x) => x.step === s.n) : null;
  const status = bs?.status === "done" ? (sh ? `built, ${leftOutWords(sh)}` : "built") : bs?.status === "waiting" ? "still waiting" : bs?.status === "not done" ? "not built" : BUILT ? "" : "planned";
  const runs = (R.tryIt || []).filter((x) => x.from === "ran" && x.step === s.n && !(s.depth?.examples || []).some((e) => (e.runs || []).some((r) => r.name === x.run)));
  const best = runs.find((x) => x.exit === 0) || runs[0], run = best && runOf(best.run);
  const pic = shown?.pic ? `<figure class="shot${shown.pic.dark ? " has-dark" : ""}">${window.RPPictures.img(shown.pic, `${cap(videoName(which))}, scene ${shown.n}: ${shown.title}`)}<figcaption>${watchEl(which, shown.n)}</figcaption></figure>`
    : shown ? `<p class="wmrow">${watchEl(which, shown.n)}</p>` : "";
  // what the plan asked for: its words, its cases, its interface, its example (every paragraph of plan.md is in the page)
  const plan = [
    s.text ? fold("The step as the plan wrote it", `<p class="mdh">Step ${s.n} — ${inl(s.title)}</p>${md(s.text, { anchor: `step ${s.n}`, editable: true })}`, { id: `${s.id}-text`, cls: "words" }) : "",
    s.cases ? fold(`What happens in each case <span class="n">${s.cases.rows.length}</span>${chgMark(`${s.id}-cases`)}`, casesHtml(s), { cls: "grp" }) : "",
    s.iface && (s.iface.parts.length || s.iface.none) ? fold(`What it adds: commands, files, screens${s.iface.parts.length ? ` <span class="n">${s.iface.parts.length}</span>` : ""}${chgMark(`${s.id}-interface`)}`, ifaceHtml(s), { cls: "grp" }) : "",
    s.example && BUILT ? fold(`The plan's example${chgMark(`${s.id}-example`)}`, `${chgWhat(`${s.id}-example`)}<div class="ex">${md(s.example, { anchor: `step ${s.n} · example`, editable: true })}</div>`, { id: `${s.id}-example` }) : "",
    ...s.other.map((o, k) => fold(`${inl(o.head)}${chgMark(`${s.id}-other-${k + 1}`)}`, `${chgWhat(`${s.id}-other-${k + 1}`)}${md(o.body, { anchor: `step ${s.n} · ${o.head}`, editable: true })}`, { id: `${s.id}-other-${k + 1}` })),
  ].filter(Boolean).join("");
  return `<section class="step" id="${s.id}" data-part="${s.id}">
    <p class="kicker">Step ${s.n}${status ? ` · ${status}` : ""}${CHG[s.id] ? ` ${chgMark(s.id)}` : ""}</p><h3>${inl(stepTitle(s.title))}</h3>
    ${s.can ? `<p class="say can" data-anchor="step ${s.n} · what it lets you do">${BUILT ? "You can now" : G.built ? "It lets you" : "It would let you"} ${inl(plainEnd(lowerFirst(s.can.text)))}</p>` : ""}
    ${BUILT ? pic : ""}
    ${s.lead || (BUILT && s.depth?.lead) ? (leadOf(s, bs) ? `<p class="${s.can ? "lead2" : "say"}" data-anchor="step ${s.n} · in short">${inl(plainEnd(leadOf(s, bs)))}</p>` : "") : missing("the plan's step has no opening sentence saying what it is for.")}
    ${chgWhat(s.id)}
    ${(s.since || []).map((y) => `<p class="since" data-anchor="step ${s.n} · since">${sinceStep(y)}</p>`).join("")}
    ${(s.today || []).map((y) => `<p class="since today" data-anchor="step ${s.n} · today"><b>Today:</b> ${sinceLine(y, { capital: false })}</p>`).join("")}
    ${sh?.plain ? `<p class="since short" data-anchor="step ${s.n} · short of the plan">${glossIds(inl(plainEnd(sh.plain)))} <a href="#checked">What the code check found</a></p>` : ""}
    ${BUILT ? depthIntro(s) : ""}
    ${!BUILT && s.example ? `<div class="ex" id="${s.id}-example"><p class="lab">The plan's example ${chgMark(`${s.id}-example`)}</p>${chgWhat(`${s.id}-example`)}${md(s.example, { anchor: `step ${s.n} · example`, editable: true })}</div>` : ""}
    ${BUILT ? "" : pic}${run ? `<div class="proof"><p class="lab">It running${best.scratch ? ", in a scratch repo set up for it" : best.added?.sha && !best.added.during ? `, saved on ${esc(dateOf(best.added.date))}, after it was built` : best.added?.during ? ", saved while it was built" : ", a saved run"}${best.part ? `: ${inl(best.part)}` : ""}</p>${best.partSum ? `<p class="q3">${glossIds(inl(plainEnd(noRefs(firstSentence(best.partSum)))))}</p>` : ""}${best.exit ? `<p class="q3">In this saved run it finds a problem and stops (exit ${best.exit}): the lines marked ✗ are what it reports.</p>` : ""}${runHtml(run, { lines: 12 })}</div>` : ""}
    ${BUILT ? `${howHtml(s)}${depthAfter(s)}${examplesHtml(s)}${depthHtml(s, { intro: false })}` : `${howHtml(s)}${depthAfter(s)}${examplesHtml(s)}${depthHtml(s)}`}
    ${!BUILT && !(s.depth?.examples || []).length ? predictHtml(s) : ""}
    ${(() => { const more = depthMore(s), heads = (s.depth?.depth || []).filter((d) => !/^why\b/i.test(d.head)).map((d) => lowerFirst(d.head));
      const built = bs?.md ? fold("What was built for it", `${md(bs.md, { anchor: `step ${s.n} · built`, gloss: true })}${bs.ifaceBuilt ? `<p class="lab">The commands and files, planned and built</p>${ifaceBuiltHtml(s)}` : ""}`, { id: `${s.id}-built` }) : BUILT ? missing("walkthrough.md says nothing about what was built for this step.") : "";
      const asked = plan ? (BUILT ? fold("What the plan asked for", plan, { cls: "grp" }) : plan) : "";
      if (!more) return built + asked;
      const what = [...heads, ...(bs?.md ? ["what was built"] : []), ...(plan && BUILT ? ["the plan's words"] : [])];
      return fold(`<span class="ms">More on this step</span> <span class="q3">${inl(what.join(", ").replace(/, ([^,]*)$/, " and $1"))}</span>`, `<div class="depth-more">${more}</div>${built}${BUILT ? asked : ""}`, { cls: "more-step", id: `${s.id}-more` }) + (BUILT ? "" : asked);
    })()}</section>`;
}

// a step's answer that a later decision changed: the later plan's own words for it where its "## Supersedes" says them
// (and which of its steps), else the decision log's link; the log's link said too where it names another step's answer
function sinceStep(y) {
  const ids = idsHover(y.ids, "(in the decision log)");
  if (y.via) {
    const who = y.via.step == null && y.nowPlan ? `the later plan ${esc(y.nowPlan)}` : `${y.nowPlan ? `${esc(y.nowPlan)}'s ` : "this plan's "}${y.via.step != null ? `step ${y.via.step}` : "later plan"}`;
    const log = y.ledgerSays ? ` <span class="q3">The decision log links the change to ${idsHover([y.ledgerSays.id], `another answer of that plan (its step ${y.ledgerSays.step}: “${inl(y.ledgerSays.chosen)}”)`)}; the plan's own list of what it supersedes names step ${y.via.step}, as here.</span>` : "";
    return `<b>Since then:</b> on ${esc(dateOf(y.date))}, ${who} changed this step's answer to “${inl(y.question)}” (“${inl(y.was)}”)${y.via.words ? `: “${inl(y.via.words)}”` : ""}${y.nowQuestion && !y.same ? ` (“${inl(y.nowQuestion)}” → “${inl(y.now)}”)` : y.now ? ` (now “${inl(y.now)}”)` : ""}.${y.via.today ? ` <b>Today:</b> ${glossIds(inl(/[.!?]$/.test(y.via.today.trim()) ? y.via.today.trim() : `${y.via.today.trim()}.`))}` : ""} This step was planned and built before that. ${ids}${log}`;
  }
  return `<b>Since then:</b> ${y.same ? `on ${esc(dateOf(y.date))} the answer to “${inl(y.question)}” changed to “${inl(y.now)}”, no longer “${inl(y.was)}”` : `on ${esc(dateOf(y.date))} a later decision${y.nowPlan ? ` (in ${esc(y.nowPlan)})` : ""} replaced this step's answer to “${inl(y.question)}” (“${inl(y.was)}”): “${inl(y.nowQuestion)}” → “${inl(y.now)}”`}; this step was ${G.built ? "planned and built" : "planned"} before that. ${ids}`;
}

/* ── the sections, in the order a reader asks ──────────────────────────────────────────────────────────── */
// the steps the code check found short of the plan (not fixed since, not a step still waiting), with what it found
// missing: `Step 5 (no "…", no "…")` → { step: 5, missing: 2, what: 'no "…", no "…"' }
function shortSteps() {
  const waiting = (G.steps || []).filter((s) => ["waiting", "not done"].includes(s.built?.status)).map((s) => s.n);
  return codeItems().filter((x) => x.step && !x.fixed && !waiting.includes(x.step)).map((x) => { const what = (/\((.*)\)\s*$/.exec(x.subject) || [])[1] || x.subject.replace(/^Step \d+\s*/, "");
    return { ...x, what, missing: (what.match(/(?:^|,\s*)no\s+["“]/g) || []).length, plain: R.shortPlain?.[x.step]?.md || null }; });
}
const shortWords1 = (x) => (x.missing ? `without ${count(x.missing, "thing")} the code check found missing` : "short of the plan, the code check found");
const leftOutWords = (x) => (x.missing ? `${count(x.missing, "thing")} left out` : "short of the plan");
const stepsWords = (ns) => { if (ns.length === 1) return `step ${ns[0]}`; const run = ns.every((n, i) => !i || n === ns[i - 1] + 1); return run ? `steps ${ns[0]} to ${ns.at(-1)}` : `steps ${ns.slice(0, -1).join(", ")} and ${ns.at(-1)}`; };
function hero() {
  const steps = G.steps || [], done = steps.filter((s) => s.built?.status === "done").length, waiting = steps.filter((s) => s.built?.status === "waiting");
  const open = (G.questions || []).filter((q) => !q.answered);
  let kicker, status;
  if (G.kind === "explainer") { kicker = "An explainer: a video of something already in the repo, made so you understand it before deciding anything"; status = G.commit ? `As the repo was at <code>${esc(G.commit.slice(0, 7))}</code>${G.created ? `, ${esc(dateOf(G.created))}` : ""}.` : ""; }
  else if (BUILT) {
    kicker = "What was built, and what it means for you";
    const rv = R.review;
    // the walkthrough's own count, and where the code check disagrees with it, said here in the same words as the
    // step's kicker and Not done (never "all five" when the check found one short)
    const short1 = shortSteps(), full = steps.filter((s) => s.built?.status === "done" && !short1.some((x) => x.step === s.n)).map((s) => s.n);
    status = `${short1.length && short1.every((x) => x.plain) ? `Built: ${full.length ? stepsWords(full) : "none whole"}${waiting.length ? `; step ${waiting.map((s) => s.n).join(", ")} still waiting` : ""}. ${short1.map((x) => inl(plainEnd(x.plain)).replace(/\.$/, "")).join(". ")}`
      : short1.length ? `Built: ${full.length ? `${stepsWords(full)}, and ` : ""}${short1.map((x) => `step ${x.step} ${shortWords1(x)}: ${inl(x.what)} (${inl(plainEnd(lowerFirst(firstSentence(x.answer))).replace(/\.$/, ""))})`).join("; ")}${waiting.length ? `; step ${waiting.map((s) => s.n).join(", ")} still waiting` : ""}`
      : done === steps.length ? `Built: all ${count(steps.length, "step")}, the walkthrough says` : `Built: ${done} of ${steps.length} steps${waiting.length ? `; step ${waiting.map((s) => s.n).join(", ")} still waiting` : ""}`}. `
      + (rv ? (/approved/.test(rv.verdict) ? `You approved it on ${esc(dateOf(rv.date))}.` : `You asked for changes on ${esc(dateOf(rv.date))}.`) : `<b>Not reviewed yet.</b> Watch ${ownVideo && FULL ? `<a href="${esc(watchHref(G.own, 0))}">the walkthrough video</a>` : "the walkthrough video"} and press Finish there to approve it or ask for changes. This page has the detail the video leaves out.`);
  } else {
    kicker = "A plan, before it is built";
    const pr = R.planReview;
    status = `${G.built ? "It has since been built: the walkthrough video shows it." : "Not built yet."} ${pr ? (/approved/.test(pr.verdict) ? `You approved the plan on ${esc(dateOf(pr.date))}.` : `You asked for changes on ${esc(dateOf(pr.date))}.`) : ""} ${open.length ? `<b>${cap(count(open.length, "question"))} ${open.length === 1 ? "waits" : "wait"} on your answer.</b>` : ""}`;
  }
  const a = R.asked;
  const who = a?.who ? a.who.replace(/^The owner\b/, "You").replace(/^You asked$/, "You asked") : "You";
  const words = a ? a.quote.split(/\s+/) : [];
  let short = a?.quote || "";
  if (words.length > 60) { const cut = words.slice(0, 60).join(" "); const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? ")); short = (end > 80 ? cut.slice(0, end + 1) : cut) + " …"; }
  const asked = a ? `<figure class="asked"><figcaption>${esc(who)}${G.kind === "explainer" ? "" : ", asking for it"}:</figcaption><blockquote data-anchor="what you asked">“${inl(short)}”</blockquote>${short !== a.quote ? fold("All of what you said", `<blockquote>“${inl(a.quote)}”</blockquote>`) : ""}</figure>` : missing("\"The problem\" in plan.md quotes nobody asking for this, so the page can't say why it matters to you.");
  const toc = sectionsList().filter((x) => x.toc).map((x) => `<li><a href="#${x.id}">${esc(x.toc)}</a></li>`).join("");
  return `<section class="hero" id="top"><p class="kicker">${kicker}</p><h1>${inl(R.name || G.title)}</h1>${R.promise ? `<p class="promise">${inl(R.promise)}.</p>` : ""}${R.summary ? `<p class="summary" data-anchor="in one sentence">${inl(plainEnd(cap(R.summary)))}</p>` : ""}
    ${status ? `<p class="status">${status}</p>` : ""}${revisedTop()}${asked}${a?.lead ? problemLead(a.lead) : ""}${G.kind === "explainer" ? "" : inShort()}
    ${FULL ? `${G.kind === "explainer" ? `<nav class="toc" aria-label="On this page"><p class="lab">On this page</p><ol>${toc}</ol></nav>` : ""}${fold("Words with a special meaning here", "", { id: "words", cls: "words-list" })}` : ""}</section>`;
}
// the problem, as the plan says it after the quote: its first sentence or two, the long asides in brackets left out
// (the whole of it is under "The plan, in its own words")
function problemLead(lead) {
  const [t, cut] = short(lead, 5), ss = t.split(/(?<=[.!?])\s+(?=[A-Z“"])/);
  let out = ss[0]; if (ss[1] && (out + " " + ss[1]).split(/\s+/).length <= 55) out += " " + ss[1];
  if (out.split(/\s+/).length > 55) out = clauseCut(out, 55);
  const more = cut || out !== t.trim(), at = (G.rest || []).find((r) => /^the problem$/i.test(r.title));
  return `<p class="lead"><span class="lab2">The problem:</span> ${inl(out)}${more && at ? ` <a href="#${esc(at.id)}" data-open="${esc(at.id)}" class="more-l">All of it, in the plan</a>` : ""}</p>`;
}
// the first clause of a line: past a short label ("Open point: …"), up to its first colon, semicolon or full stop
const firstClause = (t) => { let x = short(String(t || "").trim(), 3)[0]; const lab = /^([^:()`]{1,30}):\s+(.+)$/.exec(x); if (lab && lab[1].split(/\s+/).length <= 3) x = cap(lab[2]);
  return x.split(/:\s|;\s|\.\s|\s—\s|,\s+(?:so|which|while|since|because)\s/)[0].replace(/[.:;,\s]+$/, ""); };
// the whole page in five lines, each a link to where it is said in full
const ownerTodos = () => [...String(G.built?.texts?.notDone || "").matchAll(/^[-*] \*\*([^*]+)\*\*([^\n]*(?:\n(?![-*] )[^\n]*)*)/gm)].filter((m) => !(R.notDone || []).some((x) => x.head === m[1].trim() && x.settled?.length)).filter((m) => /\b(the owner|owner's|you|your)\b/i.test(m[1].replace(/`[^`]*`/g, ""))).map((m) => ({ head: m[1], rest: m[2], what: m[2].replace(/\s+/g, " ").replace(/^\s*\([^)]*\)\s*/, "").replace(/^[\s:.,;—–-]+/, "").trim() }));
function needsShort() {
  if (BUILT) { const rv = R.review, todo = ownerTodos();
    const main = !rv ? "Not reviewed yet: watch the walkthrough video, then approve what was built or ask for changes." : /approved/.test(rv.verdict) ? `Nothing: you approved it on ${esc(dateOf(rv.date))}.` : `Your review again: you asked for changes on ${esc(dateOf(rv.date))}.`;
    return `${main}${todo.length ? ` Also left to you: ${todo.map((t) => { const c = firstClause(t.what || t.head); return inl(c.split(/\s+/).length > 30 ? clauseCut(c, 30) : c); }).join("; ")}.` : ""}`; }
  const open = (G.steps || []).flatMap((s) => s.questions.filter((q) => !q.answered));
  return open.length ? `${cap(count(open.length, "question"))} to answer: ${open.map((q) => inl(q.title)).join("; ")}` : "Nothing: every question of the plan is answered.";
}
// what each step lets you do, a short phrase a step (a step with none shows its title: the page lists what is missing)
function canList() {
  const out = [];
  for (const s of G.steps || []) {
    const waiting = ["waiting", "not done"].includes(s.built?.status), text = s.can?.text || null;
    const last = out.at(-1);
    if (text && last?.text === text) { last.steps.push(s.n); continue; }
    out.push({ text, title: stepTitle(s.title), steps: [s.n], waiting });
  }
  return `<ul class="can">${out.map((c) => `<li${c.text ? "" : ' class="untold"'}>${c.text ? inl(plainEnd(c.text).replace(/\.$/, "")) : inl(c.title)}${c.waiting ? ` <span class="q3">(still waiting)</span>` : ""}&nbsp;<a class="stepref" href="#step-${c.steps[0]}">step${c.steps.length > 1 ? "s" : ""} ${c.steps.join(", ")}</a></li>`).join("")}</ul>`;
}
// a long line cut where a clause ends (its last comma or semicolon before `n` words), never inside one: with no such
// place it stays whole
const clauseCut = (t, n) => { const w = String(t).split(/\s+/); if (w.length <= n) return t; let at = -1;
  for (let i = n - 1; i >= 4; i--) if (/[,;]$/.test(w[i]) && ((w.slice(0, i + 1).join(" ").match(/`/g) || []).length % 2 === 0) && ((w.slice(0, i + 1).join(" ").match(/\(/g) || []).length === (w.slice(0, i + 1).join(" ").match(/\)/g) || []).length)) { at = i; break; }
  return at < 0 ? t : w.slice(0, at + 1).join(" ").replace(/[,;]$/, ""); };
// the record's own words for things the first layer says in plain words (the words themselves stay in the record, a
// click away): a call is a choice the agent made, a Trace column a step-by-step trace, a beat a scene
const plainWords = (t) => String(t || "").replace(/\b(\d+|[Oo]ne|[Tt]wo|[Tt]hree|[Ff]our|[Ff]ive|[Ss]ix|[Ss]even|[Ee]ight|[Nn]ine|[Tt]en|[Ee]leven|[Tt]welve) calls\b/g, "$1 choices by the agent").replace(/\bno Trace column\b/g, "no step-by-step trace for each case").replace(/\bfew `#` meanings\b/g, "few interface lines explained").replace(/\bgrouped beats\b/g, "grouped scenes").replace(/\bgrouped beat\b/g, "grouped scene");
// walkthrough.md's "Not done", one short line each: the bold lead, or its first clause where the lead is only a label
function notDoneItems() {
  const items = R.notDone || [...String(G.built?.texts?.notDone || "").matchAll(/^[-*] \*\*([^*]+)\*\*([^\n]*(?:\n(?![-*] )[^\n]*)*)/gm)].map((m) => ({ head: m[1], md: m[0], settled: [] }));
  return items.map((it) => {
    const head = it.head.trim(), rest = short(it.md.replace(/^[-*]\s+/, "").replace(/^\*\*[^*]+\*\*/, "").replace(/\s+/g, " ").trim(), 3)[0];
    const label = !/\b(?:is|are|was|were|has|have|had|does|do|did|can|could|will|would|exists?|runs?|needs?|waits?|shows?|reads?|keeps?|goes|stays?|gets?|makes?|says?|works?|lands?)\b/i.test(head);
    let t = /^:\s/.test(rest) && label ? cap(firstClause(rest.slice(1))) : /[.!?]$/.test(head) ? firstClause(head) : firstClause(`${head}${/^[,.;]/.test(rest) ? "" : " "}${rest}`);
    if (t.split(/\s+/).length > 24) t = clauseCut(t, 24);
    const lab = /^([^:()`]{1,30}):\s+(.+)$/.exec(head), bare = lab && lab[1].split(/\s+/).length <= 3 ? lab[2] : head;
    // settled only when something since settles it whole; a line settled in part stays open, and says so
    const whole = (it.settled || []).filter((y) => !y.partial), part = (it.settled || []).filter((y) => y.partial);
    // the walkthrough's own plain words for the line, where it gives them ("In plain words"), in place of both
    const pl = it.plain ? cap(plainEnd(it.plain).replace(/\.$/, "")) : null;
    return { t: pl || plainWords(t), head: pl || plainWords(bare.replace(/[.:]$/, "")), settled: whole.length ? it.settled : null, partly: !whole.length && part.length > 0, withStep: it.withStep || null };
  }).filter((x) => x.t);
}
// the files of the change, each once: by hand and generated; and the walkthrough video's own number, where it differs,
// with why (the code check's count, or its own), in full under "Where the code is"
function filesWords({ long = false } = {}) {
  const T = G.built?.totals || {}, hand = T.hand ?? 0, gen = T.gen ?? 0;
  let t = `${plural(hand, "file")} written by hand${gen ? ` and ${plural(gen, "file")} the build generates` : ""}`;
  // the files in two or more groups, by hand and generated both counted, and said which
  const sh = (T.shared || 0) + (T.sharedGen || 0);
  if (long && sh) t += ` (${sh === 1 ? "one of these files" : `${sh} of these files`}${T.sharedGen ? `, ${T.shared ? `${T.shared} written by hand and ${T.sharedGen} generated` : T.sharedGen === 1 ? "generated" : "all generated"}` : sh === 1 ? ", written by hand" : ", all written by hand"}, ${sh === 1 ? "is" : "are"} in two or more groups below, a group for each kind of change made to ${sh === 1 ? "it" : "them"}, and counted once here)`;
  return t;
}
function videoFilesWords({ long = false } = {}) {
  const T = G.built?.totals || {}, vf = R.videoFiles; if (!vf || vf.n === T.hand || vf.n === T.files) return "";
  return long ? `The walkthrough video says “${esc(vf.said)}” (scene ${vf.scene}): ${vf.codeCheck ? `that is the code check's count (“${inl(vf.codeCheck)}”)` : "that is its own count"}; this page counts every file the commits touched (${T.files}).`
    : "";
}
function inShort() {
  const steps = G.steps || []; if (!steps.length) return "";
  const rows = [];
  rows.push([`<a href="#now">${BUILT ? "What you can do now" : G.built ? "What it lets you do" : "What it would let you do"}</a>`, canList()]);
  if (BUILT) {
    // a run of it working, from this repo first (one from a scratch repo only when there is none), said as it was made
    const own = (c) => Number(!/^(?:npx\s+)?(?:reelplanning|reel)\b/.test(c)) + Number(!/^(?:reelplanning|reel|npx|npm|node)\b/.test(c));
    // the project's own command before another tool's (a grep), then one that finished cleanly before one that stopped
    const ranOk = (R.tryIt || []).filter((x) => x.from === "ran" && x.exit != null).sort((a, b) => Number(!!a.scratch) - Number(!!b.scratch) || own(a.cmd) - own(b.cmd) || Number(a.exit !== 0) - Number(b.exit !== 0) || (a.step ?? 99) - (b.step ?? 99)), ok = ranOk[0];
    // a run that stops: why, in the words of the worked example that shows it (its "What happens"), and a link to it
    const why = ok?.exit ? stopWhy(ok.run) : null;
    rows.push([`<a href="#try">See it work</a>`, ok ? `<code>${esc(ok.cmd.length > 80 ? ok.cmd.slice(0, 78) + "…" : ok.cmd)}</code>: ${provenance(ok, { short: true })}${why ? `. ${glossIds(inl(plainEnd(cap(why.text))))} <a href="#${esc(why.id)}" data-open="${esc(why.id)}">Step ${why.step}'s example</a> shows what it printed.` : `${ok.exit ? `; it stopped with exit ${ok.exit}, reporting what it found` : ""}; <a href="#try">what it printed</a> is on this page.`}` : `No run was saved while it was built. The walkthrough video shows it running (each step below links to its moment)${(R.tryIt || []).length ? `, and <a href="#try">Try it yourself</a> lists the commands to run` : ""}.`]);
    const calls = G.built.calls || [], look = (R.choices || []).filter((c) => c.look), dev = look.filter((c) => /Changed/.test(c.why || ""));
    if (calls.length) { const { line, n } = choiceWords();
      rows.push([`<a href="#choices">Worth your look</a>`, `<a href="#choices">${cap(n(look.length))} of the agent's choices</a> ${look.length === 1 ? "is" : "are"} worth your look${dev.length ? `, ${n(dev.length)} of them changing what the plan said` : ""}. In all: ${lowerFirst(line)}.`]); }
  } else {
    const L = G.ledger || {}, own = steps.flatMap((s) => [...s.decisions, ...s.questions.flatMap((q) => q.answered?.ids || [])]).filter((id, i, a) => a.indexOf(id) === i && L[id]);
    if (own.length) rows.push([`<a href="#decisions">Already decided</a>`, `<a href="#decisions">${cap(count(own.length, "question"))}</a> of this plan, each with why.`]);
  }
  if (RV) rows.push([`<a href="#revised">Changed</a>`, `${cap(RV.words)}: ${RV.order.map((k) => `<a href="#${esc(k)}-chg" data-open="${esc(k)}-chg">${esc(CHG[k].label)}</a>`).join(", ")}.`]);
  rows.push([`<a href="#needs-you">Needs you</a>`, needsShort()]);
  if (BUILT) {
    // a Not done line said with a short step (its plain words name it) is said once, with that step
    const sh = shortSteps(), nd = notDoneItems().filter((x) => !(x.withStep && sh.some((y) => y.step === x.withStep && y.plain))), open = nd.filter((x) => !x.settled), done = nd.filter((x) => x.settled);
    const shLines = sh.map((x) => x.plain ? `<li>${glossIds(inl(plainEnd(x.plain)))} <a href="#checked">What the check found</a></li>` : `<li>Step ${x.step}: ${x.missing ? `${count(x.missing, "thing")} the code check found missing` : "short of the plan, the code check found"} (${inl(plainEnd(lowerFirst(firstSentence(x.answer))).replace(/\.$/, ""))}; <a href="#checked">what</a>)</li>`).join("");
    rows.push([`<a href="#not-done">Not done</a>`, nd.length || sh.length ? `${open.length || sh.length ? `<ul>${shLines}${open.map((x) => `<li>${glossIds(inl(x.t))}${x.partly ? ` <span class="q3">(in part since: <a href="#not-done">how</a>)</span>` : ""}</li>`).join("")}</ul>` : "<p>Nothing the walkthrough listed is still open.</p>"}${done.length ? `<p class="q3">Settled since: ${done.map((x) => glossIds(inl(lowerFirst(x.head || x.t)))).join("; ")} (<a href="#not-done">how</a>).</p>` : ""}` : "The walkthrough lists nothing left undone."]);
    if (R.codeCheck?.summary) rows.push([`<a href="#checked">Checked</a>`, checkWords(R.codeCheck.summary, true)]);
  }
  else rows.push([`<a href="#not-done">Left out</a>`, R.notIn ? "What the plan leaves out on purpose, and what it doesn't say yet." : "The plan doesn't say what it leaves out."]);
  if (G.built) rows.push([`<a href="#what-changed">The code</a>`, `${cap(filesWords())}, grouped by what they do, each group with its diff.`]);
  return `<nav class="inshort" aria-label="In short, and on this page"><p class="lab">In short</p><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl></nav>`;
}
function nowSection() {
  const steps = G.steps || [], pics = steps.filter((s) => s.shown?.video && V[s.shown.video]?.scenes.find((f) => f.n === s.shown.n)?.pic).length;
  const done = steps.filter((s) => s.built?.status === "done").length;
  const say = BUILT ? `${done === steps.length ? `It was built in ${count(steps.length, "step")}` : `It has ${count(steps.length, "step")}, ${NUM[done] || done} of them built`}. Each one below says what it lets you do${pics ? `, with a picture of it working from the walkthrough video (the short video of the change running)` : ""}${Object.keys(G.built.runs || {}).length ? ", and its real output where a run was saved" : ""}.`
    : `The plan has ${count(steps.length, "step")}. Each says what it would let you do, with the plan's own example of it.`;
  const O = G.overview || {}, ov = O.diagrams || [];
  // the steps and which needs which, drawn from plan.md: kept a click away (readers found it said little on its own)
  const deps = G.auto?.steps ? fold("Which step needs which", diagramHtml(G.auto.steps), { cls: "dg-more", id: "step-needs" }) : "";
  const overview = ov.length || (O.intro || []).length ? `<div class="overview" id="how-it-fits" aria-label="How it fits together">${(O.intro || []).length ? `<p class="lab">How it fits together</p>` : ""}${(O.intro || []).map((t) => md(t, { anchor: "how it fits together", gloss: true })).join("")}${ov.map((d) => diagramHtml(d)).join("")}${(O.after || []).map((t) => md(t, { anchor: "how it fits together · after the diagram", gloss: true })).join("")}${(O.depth || []).map((d) => fold(inl(d.head), md(d.md, { anchor: d.head, gloss: true }), { cls: "dp" })).join("")}${deps}</div>` : deps;
  return `<section data-flow class="q" id="now"><h2>${BUILT ? "What you can do now" : "What it would let you do"}</h2><p class="say">${say}</p>${overview}${steps.map(stepArticle).join("")}</section>`;
}
// why a saved run stopped, from the worked example that names it: the sentence of its "What happens" that says so
function stopWhy(run) {
  for (const s of G.steps || []) for (const [k, e] of (s.depth?.examples || []).entries()) {
    if (!(e.runs || []).some((r) => r.name === run) || !e.happens) continue;
    const said = String(e.happens).replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z`(“"])/).find((x) => /\b(?:exit \d+|stops|stopped|fails|failed)\b/i.test(x));
    if (said) return { text: said.trim(), step: s.n, id: (s.depth.examples.length === 1 ? `${s.id}-examples` : `${s.id}-ex-${k + 1}`) };
  }
  return null;
}
const FROM = { ran: "saved run", built: "as built", named: "named in the walkthrough, not run", planned: "as planned, not run" };
// where and when a saved run was made, in words, from git and the walkthrough (never assumed): while it was built (one
// of the plan's commits added it), after (a later commit, for the guide), in a scratch repo, or not committed yet
function provenance(x, { short: brief = false } = {}) {
  const r = x.run ? runOf(x.run) : x, a = x.added || r?.added || null, scratch = x.scratch ?? r?.scratch;
  const when = !a ? "" : !a.sha ? "saved, not committed yet" : a.during ? `saved while it was built (${a.sha})` : `saved on ${dateOf(a.date)} (${a.sha}), after it was built`;
  if (brief) return `${scratch ? "it ran in a scratch repo set up for it" : !a?.sha ? "a saved run of it" : !a.during ? `it ran on ${dateOf(a.date)}, after it was built, with the code as it was then` : "it ran while this was built"}`;
  return `${scratch ? "ran in a scratch repo, not this one; " : ""}${when}`;
}
function trySection() {
  const all = R.tryIt || [];
  const steps = G.steps || [];
  const use = BUILT ? all.filter((x) => x.from !== "planned" || !all.some((y) => y.step === x.step && y.from !== "planned")) : all;
  const WARN = `<p class="warn" role="note"><b>Writes to the project's record.</b> It files into <code>.reelplanning/</code> (the plans, reviews and decision log): run it here only when you mean to.</p>`;
  const item = (x) => { const r = x.run && runOf(x.run);
    const note = x.from === "ran" && x.what ? x.what : null;   // a saved run's own note on its command: its scenario
    const place = x.missing?.length && !x.scratch ? `<p class="q3">It names <code>${x.missing.map(esc).join("</code>, <code>")}</code>, which this repo does not have: put your own in ${x.missing.length === 1 ? "its" : "their"} place.</p>` : "";
    const out = x.outside && !x.scratch ? `<p class="warn" role="note"><b>Writes outside this checkout.</b> It makes <code>${esc(x.outside.path)}</code>${x.outside.size ? `, ${esc(x.outside.size)} when it ran` : ""}: pick a folder you mean to fill, and delete it after.</p>` : "";
    return `<div class="cmd" data-anchor="command · ${esc(x.cmd.slice(0, 60))}">${x.scratch && note ? `<p class="lab">${inl(cap(note.replace(/^(?:a scratch (?:repo|clone):\s*)/i, "")))}</p>` : ""}${x.writes ? WARN : ""}${out}<div class="cmdline"><code><span class="ps">$ </span>${esc(x.cmd)}${note && !x.scratch ? `<span class="cmt">   # ${esc(note)}</span>` : ""}</code><button type="button" class="copy" data-copytext="${esc(x.cmd)}" aria-label="Copy the command">Copy</button></div>
      <p class="cmdw"><span class="src ${x.from}">${esc(FROM[x.from])}</span> ${x.what && !note ? `${glossIds(inl(plainEnd(cap(noRefs(x.what)))))} ` : ""}${x.from === "ran" && x.exit != null ? `It ${esc(exitWords(x.exit))}.` : ""}${x.wrote ? ` It writes <code>${esc(x.wrote)}</code>${/\.html$/.test(x.wrote) ? ": open that file in a browser to see it" : ""}.` : ""}</p>${place}
      ${r ? fold("What it printed", runHtml(r)) : x.out?.length ? fold(`What the plan says it prints`, `<pre class="term planned">${colorRun(x.out.join("\n"))}</pre>`) : ""}</div>`; };
  const byStep = (xs) => [...steps.map((s) => ({ t: `Step ${s.n}: ${stepTitle(s.title)}`, xs: xs.filter((x) => x.step === s.n) })), { t: "Other", xs: xs.filter((x) => x.step == null || !steps.some((s) => s.n === x.step)) }].filter((g) => g.xs.length);
  const groupsHtml = (xs) => byStep(xs).map((g) => `<div class="cgroup"><p class="lab">${inl(g.t)}</p>${g.xs.map(item).join("")}</div>`).join("");
  if (!BUILT) {
    const say = !use.length ? "The plan names no command to run." : "These are the commands the plan says it will add. They don't exist until it is built, so what they print here is the plan's promise.";
    return `<section data-flow class="q" id="try"><h2>How you would try it</h2><p class="say">${say}</p>${groupsHtml(use)}</section>`;
  }
  // here: what runs in this checkout as it is (a command naming a plan or file this repo does not have is not offered
  // here); from a scratch repo: each run made in one set up for it, named by its scenario, with the setup once
  const scratch = use.filter((x) => x.scratch), here = use.filter((x) => !x.scratch && !(x.missing?.length && x.from !== "ran" && !/<[^>]+>/.test(x.cmd) && x.missing.some((p) => /^\.reelplanning\/(?:plans|explainers)\//.test(p))));
  const dropped = use.filter((x) => !x.scratch && !here.includes(x));
  // run this here: what really ran in this repo and names nothing to fill in; the commands the walkthrough only names
  // (not run, or with a <placeholder>) go apart, as named; runs from a scratch repo, apart again, each command once
  const ran = here.filter((x) => x.from === "ran" && !/<[^>]+>/.test(x.cmd)), named = here.filter((x) => !ran.includes(x));
  const setup = (R.scratch?.setup) || scratch.find((x) => x.setup)?.setup || null;
  const scratchRuns = Object.values({ ...(G.exRuns || {}), ...(G.built?.runs || {}) }).filter((r) => r.scratch), again = scratchRuns.length - scratch.filter((x) => x.from === "ran").length;
  const say = !use.length ? "The walkthrough names no command to run, so there is nothing here to copy yet."
    : `${ran.length ? `${ran.length === 1 ? "The command under Run this here" : `The ${count(ran.length, "command")} under Run this here`} really ran in this repo, and what ${ran.length === 1 ? "it" : "each"} printed is saved, so you know what to expect: run ${ran.length === 1 ? "it" : "them"} from the repository's top folder. `
      : scratchRuns.length && !named.length ? "Nothing here is to run in this repo as it is: every run saved for it was made in a scratch repo set up for it. " : "Nothing here was run in this repo as it is and saved, so there is nothing proven to run here. "}${named.length ? `${cap(count(named.length, "more command"))} ${named.length === 1 ? "is" : "are"} named by the walkthrough and never run for it (under Named, not run). ` : ""}${scratchRuns.length ? `${cap(count(scratchRuns.length, "run"))} ${scratchRuns.length === 1 ? "was" : "were"} made in a scratch repo set up for ${scratchRuns.length === 1 ? "it" : "them"}${again > 0 ? `, ${count(scratch.length, "command")} in all (${again === 1 ? "one ran" : `${NUM[again] || again} ran`} again on other input, shown once here)` : ""}: the paths they name are that repo's, so they are shown, folded, to read rather than to run here. ` : ""}<code>reelplanning</code> is the tool; <code>reel</code> is its second command, for the project's record (plans, reviews, decisions).`;
  const hereHtml = ran.length ? fold(`Run this here <span class="n">${ran.length}</span>`, groupsHtml(ran), { id: "try-here", cls: "grp" }) : "";
  const namedHtml = named.length ? fold(`Named, not run <span class="n">${named.length}</span>`, `<p class="q3">The walkthrough names these; none was run and saved for it, so what they print is not shown. A word in &lt;angle brackets&gt; is yours to fill in.</p>${groupsHtml(named)}`, { id: "try-named", cls: "grp" }) : "";
  const scratchHtml = scratch.length ? fold(`Shown from a scratch repo <span class="n">${scratch.length}</span>`, `${setup ? `<p class="q3"><b>The scratch repo:</b> ${inl(setup)}</p>` : ""}${groupsHtml(scratch)}`, { id: "try-scratch", cls: "grp" }) : "";
  const droppedHtml = dropped.length ? `<p class="q3">Left out: ${count(dropped.length, "command")} the walkthrough names that ${dropped.length === 1 ? "points" : "point"} at a plan this repo does not have (${dropped.map((x) => `<code>${esc(x.cmd)}</code>`).join(", ")}).</p>` : "";
  return `<section data-flow class="q" id="try"><h2>Try it yourself</h2><p class="say">${say}</p>${hereHtml}${namedHtml}${scratchHtml}${droppedHtml}</section>`;
}
// a long aside in parentheses, "(changed after review: …)", is folded: the sentence reads without it
const short = (t, n = 10) => { let cut = false, s2 = noRefs(t); for (let i = 0; i < 3; i++) s2 = s2.replace(/\s*\(([^()]*)\)/g, (m, x) => (x.split(/\s+/).length > n ? ((cut = true), "") : m)); return [s2.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim(), cut]; };
// a choice's title: the first clause of what it chose, its long asides in brackets left out (as everywhere on the page;
// its full wording is a click away); still long, it ends at the first comma past its seventh word, never inside
// brackets, quotes or code (past 24 words only)
function cardTitle(c) {
  // the walkthrough's own plain words for it, where it gives them ("In plain words"): the record's wording a click away
  if (R.callPlain?.[c.id]) return cap(String(R.callPlain[c.id]).replace(/[.,;:\s]+$/, ""));
  const t = short(String(c.chose || "").replace(/\s*\[[^\]]*\]\s*$/, ""), 10)[0];
  let d = 0, code = false, q = false, end = t.length;
  for (let i = 0; i < t.length; i++) { const ch = t[i];
    if (ch === "`") { code = !code; continue; } if (code) continue;
    if (ch === '"') { q = !q; continue; } if (ch === "“") q = true; if (ch === "”") q = false; if (q) continue;
    if (ch === "(") d++; else if (ch === ")") d = Math.max(0, d - 1);
    // a colon after a short label ("One control: the header's switch is …") is not the end: the lead says what follows
    else if (!d && (ch === ";" || (ch === ":" && /\s/.test(t[i + 1] || " ") && t.slice(0, i).trim().split(/\s+/).length >= 6))) { end = i; break; } }
  let x = t.slice(0, end).trim();
  if (x.split(/\s+/).length > 24) { let words = 0, dd = 0, cd = false, qq = false;
    for (let i = 0; i < x.length; i++) { const ch = x[i]; if (ch === "`") cd = !cd; else if (!cd && ch === '"') qq = !qq; else if (!cd && ch === "(") dd++; else if (!cd && ch === ")") dd = Math.max(0, dd - 1); else if (ch === " ") words++; else if (ch === "," && !cd && !qq && !dd && words >= 7) { x = x.slice(0, i); break; } } }
  return cap(x.replace(/[.,;:\s]+$/, ""));
}
// what the walkthrough video does with a choice: its moment, as the video plays it (a pause, the list, a sheet)
const stopOf = (id) => (V.built?.stops || []).find((x) => ["choices", "list", "shown"].includes(x.kind) && (x.ids || []).includes(id));
// a choice, its moment in the video and its code: where the video pauses on it, and each file it names, in the diff
function choiceLinks(c) {
  const stop = stopOf(c.id);
  const files = [...new Set([...String(c.check || "").matchAll(/[\w.-]+(?:\/[\w.-]+)*\.(?:m?js|cjs|css|html|md|json|sh|ya?ml)\b/g)].map((m) => m[0]))].map((p) => (FILES.has(p) ? p : BASE.get(p) || null)).filter(Boolean);
  if (!stop && !files.length) return "";
  const kind = stop ? { choices: "The video pauses on it.", list: "It is on the video's list at the end.", shown: "The video shows it, not a pause." }[stop.kind] : "";
  return `<p class="xl">${stop ? `<span class="xl-k">${esc(kind)}</span> ${watchEl("built", stop.n, { label: "Watch its scene", bare: true })}` : ""}${files.length ? `<span class="xl-f">In the code: ${files.map((p) => { const b = p.split("/").pop(), twin = files.some((q) => q !== p && q.split("/").pop() === b); return `<a href="#" class="fl" data-file="${esc(p)}"><code>${esc(twin ? p.split("/").slice(-2).join("/") : b)}</code></a>`; }).join(", ")}</span>` : ""}</p>`;
}
// the choices, counted once for the whole page: how many, how many worth your look, and what the video does with each
function choiceWords() {
  const K = R.counts || { total: (G.built?.calls || []).length, look: [], pause: [], list: [], shown: [], only: [], video: false };
  const n = (x) => (x < NUM.length ? NUM[x] : String(x));
  const parts = !K.video ? [] : [K.pause.length && `${n(K.pause.length)} the walkthrough video stops on`, K.shown.length && `${n(K.shown.length)} it shows on a sheet without pausing`, K.list.length && `${n(K.list.length)} on its list at the end`, K.only.length && `${n(K.only.length)} smaller ${K.only.length === 1 ? "one" : "ones"} only on this page`].filter(Boolean);
  return { K, n, line: `${cap(count(K.total, "choice"))}${parts.length ? `: ${parts.join(", ").replace(/, ([^,]*)$/, " and $1")}` : ""}` };
}
function choicesSection() {
  const calls = G.built?.calls || [], info = Object.fromEntries((R.choices || []).map((c) => [c.id, c]));
  const rank = (c) => ["Changed from the plan", "Hard to undo later", "You'll notice it"].indexOf(info[c.id]?.why);
  const look = calls.filter((c) => info[c.id]?.look).sort((a, b) => (rank(a) < 0 ? 9 : rank(a)) - (rank(b) < 0 ? 9 : rank(b))), rest = calls.filter((c) => !info[c.id]?.look);
  const card = (c) => { const i = info[c.id] || {}, [instead] = short(c.insteadOf), [why] = short(c.why), dev = /Changed/.test(i.why || "");
    return `<li class="call" id="choice-${esc(c.id)}" data-video="${esc(i.video || "")}" data-anchor="choice ${esc(c.id)}">${i.why ? `<p class="why">${esc(i.why)}</p>` : ""}<p class="chose">${inl(plainEnd(cardTitle(c)))}</p>
      ${dev ? `<p><span class="lab2">The plan said</span> ${bareDecisions(glossIds(inl(plainEnd(instead))))}</p>` : ""}<p><span class="lab2">Because</span> ${bareDecisions(glossIds(inl(plainEnd(why))))}</p>
      ${(R.callSince?.[c.id] || []).map((y) => `<p class="since" data-anchor="choice ${esc(c.id)} · since"><b>Since then:</b> ${sinceLine(y)}</p>`).join("")}
      ${choiceLinks(c)}
      ${fold("Its full wording", `<p><b>Chose</b> ${inl(noRefs(c.chose))}</p><p><b>Instead of</b> ${inl(noRefs(c.insteadOf))}</p><p><b>Because</b> ${inl(noRefs(c.why))}</p><p><b>Where to check</b> <code>${esc(c.check)}</code></p>`)}
      <p class="meta">${c.step != null ? `Step ${c.step}` : "Outside the plan's steps"}${i.judged ? ` · you ${esc(i.judged)} it` : ""} · <span class="ref" title="${esc(callGloss(c.id))}">${esc(c.id)}</span></p></li>`; };
  const { K, n, line } = choiceWords();
  const pausesAll = K.video && look.length && look.every((c) => K.pause.includes(c.id));
  const say = !calls.length ? "The walkthrough lists no choice the agent made on its own."
    : `As it built, the agent made choices the plan didn't settle. ${line}. ${look.length ? `${cap(n(look.length))} ${look.length === 1 ? "is" : "are"} worth your look: ${look.length === 1 ? "it changes" : "each changes"} what the plan said, is something you'll notice, or is hard to undo later.${pausesAll ? ` The walkthrough video pauses on ${look.length === 1 ? "it" : "each"}.` : ""} Below, the changes to the plan come first.` : "None changes the plan, shows, or is hard to undo."} Each carries its number in the walkthrough, last on its card: A for a choice the plan left open, D for one that changed the plan (not the decision log's D-numbers), m for a small one.`;
  // the rest, as the video treats them: on its list at the end, shown on a sheet, or only here
  const groups = K.video ? [["list", "On the video's list at the end"], ["shown", "Shown in the video on one sheet, not a pause"], [null, "Only on this page: smaller ones the video leaves out"]].map(([k, t]) => [t, rest.filter((c) => (info[c.id]?.video || null) === k)]).filter(([, xs]) => xs.length) : [["", rest]];
  const restBody = groups.map(([t, xs]) => `${t ? `<p class="lab">${esc(t)} <span class="n">${xs.length}</span></p>` : ""}<ol class="calls small">${xs.map(card).join("")}</ol>`).join("");
  const restSum = K.video ? groups.map(([t, xs]) => `${n(xs.length)} ${/list/.test(t) ? "on the video's list at the end" : /sheet/.test(t) ? "shown on a sheet in the video" : "only on this page"}`).join(", ").replace(/, ([^,]*)$/, " and $1") : "";
  return `<section data-flow class="q" id="choices" data-part="choices"><h2>What the agent decided on its own</h2><p class="say">${say}</p>
    ${look.length ? `<ol class="calls">${look.map(card).join("")}</ol>` : ""}${rest.length ? fold(`The other ${count(rest.length, "choice")}${restSum ? `: ${restSum}` : ""}`, restBody) : ""}</section>`;
}
function decidedSection({ asQuestion }) {
  const L = G.ledger || {}, own = (G.steps || []).flatMap((s) => [...s.decisions, ...s.questions.flatMap((q) => q.answered?.ids || [])]).filter((id, i, a) => a.indexOf(id) === i && L[id]);
  const inForce = (G.inForce || []), kept = [...new Set(inForce.flatMap((x) => x.ids))].filter((id) => L[id] && !own.includes(id));
  const say = asQuestion ? `${own.length ? `${cap(count(own.length, "question"))} of this plan ${own.length === 1 ? "is" : "are"} already answered, below with why.` : "None of this plan's own questions is answered yet."} ${kept.length ? `It also keeps ${count(kept.length, "earlier decision")}, folded after them.` : ""}`
    : `The decisions this change was built on: those made for this plan, then the earlier ones it keeps.`;
  const inForceBody = inForce.map((x, i) => { const ids = x.ids.filter((id) => kept.includes(id)); if (!ids.length && x.ids.length) return `<p class="ifl" data-anchor="decisions in force · ${esc(x.ids.join(", ") || String(i + 1))}" data-editable>${inl(x.text)}</p>`;
    return `<div class="ifl" data-anchor="decisions in force · ${esc(x.ids.join(", ") || String(i + 1))}" data-editable><p>${inl(x.text)}</p>${ids.map((id) => decisionRow(id)).join("")}${x.steps ? "" : `<p class="q3">The plan doesn't say which step this applies to.</p>`}</div>`; }).join("");
  const body = `${own.length ? `<div class="decs">${own.map((id) => decisionRow(id)).join("")}</div>` : ""}
    ${inForce.length ? fold(`Earlier decisions it keeps <span class="n">${kept.length || inForce.length}</span>${chgMark("decisions-in-force")}`, chgWhat("decisions-in-force") + inForceBody, { cls: "grp" }) : ""}`;
  // once built, the reference it rests on: one line, folded, and left out of "Open everything" (a part shows it open)
  if (!asQuestion && FULL) return `<section data-flow class="q ref" id="decisions" data-part="decisions"><h2>The decisions it was built on</h2>${fold(`<span>${cap(count(own.length + kept.length, "decision"))}: ${own.length ? `${NUM[own.length] || own.length} made for this plan` : "none made for this plan"}${kept.length ? `, ${NUM[kept.length] || kept.length} earlier ${kept.length === 1 ? "one" : "ones"} it keeps` : ""}, each with why.</span>`, `<p class="say">${say}</p>${body}`, { id: "decisions-all", cls: "ref-fold", attrs: " data-noexpand" })}</section>`;
  return `<section data-flow class="q" id="decisions" data-part="decisions"><h2>${asQuestion ? "What's already decided, and why" : "The decisions it was built on"}</h2><p class="say">${say}</p>
    ${body}</section>`;
}
function needsSection() {
  const steps = G.steps || [], waiting = steps.filter((s) => s.built?.status === "waiting" || s.built?.status === "not done");
  const openQs = (G.steps || []).flatMap((s) => s.questions.filter((q) => !q.answered).map((q) => ({ s, q }))), answered = (G.steps || []).flatMap((s) => s.questions.filter((q) => q.answered).map((q) => ({ s, q })));
  const stray = (G.questions || []).filter((q) => q.step == null);
  const parts = [];
  if (BUILT) {
    const rv = R.review, look = (R.choices || []).filter((c) => c.look).length;
    const K = R.counts || {}, P = (K.pause || []).length, L2 = (K.list || []).length, S2 = (K.shown || []).length;
    const stopsSay = K.video ? `${P ? ` It pauses on ${P === look ? `the ${count(P, "choice")} worth your look (above)` : count(P, "choice")}, for you to accept or flag each.` : ""}${S2 ? ` It shows ${count(S2, "smaller choice")} on a sheet without pausing on each: Accept all takes them, and you can flag any.` : ""}${L2 ? ` ${cap(count(L2, "more choice"))} ${L2 === 1 ? "waits" : "wait"} on its list at the end, to flag if you'd change ${L2 === 1 ? "it" : "them"}.` : ""}` : look ? ` ${cap(count(look, "choice"))} (above) ${look === 1 ? "is" : "are"} worth your look.` : "";
    if (!rv) parts.push(`<p class="say">Your review of what was built: watch the walkthrough video, then approve it or ask for changes.${stopsSay}</p>`);
    else if (/approved/.test(rv.verdict)) parts.push(`<p class="say">Nothing waits on you here: you approved what was built on ${esc(dateOf(rv.date))}${rv.accepted.length ? `, accepting ${rv.accepted.length === (R.choices || []).length ? "every choice" : `<abbr class="idg" title="${esc(rv.accepted.map(callGloss).join("\n"))}">${count(rv.accepted.length, "choice")}</abbr>`} (each card above says so)` : ""}.</p>`);
    else parts.push(`<p class="say">You asked for changes on ${esc(dateOf(rv.date))}; the walkthrough's opening lines say what was done since. It waits on your review again.</p>`);
    parts.push(stopsHtml("built"));
    const todo = ownerTodos(); if (todo.length) parts.push(`<p>The walkthrough also leaves ${todo.length === 1 ? "this" : "these"} to you:</p><ul class="plain">${todo.map((t) => `<li><b>${inl(t.head)}</b>${inl(t.rest)}</li>`).join("")}</ul>`);
    if (waiting.length) parts.push(`<ul class="plain">${waiting.map((s) => `<li>Step ${s.n}, ${inl(stepTitle(s.title))}, is ${s.built.status === "waiting" ? "still waiting" : "not built"}${s.built.md ? `: ${inl(firstSentence(s.built.md))}` : "."}</li>`).join("")}</ul>`);
    if (openQs.length) parts.push(`<p>The plan still has ${count(openQs.length, "open question")}:</p><ul class="plain">${openQs.map(({ q }) => `<li>${inl(q.title)}</li>`).join("")}</ul>`);
  } else {
    parts.push(`<p class="say">${openQs.length ? `${cap(count(openQs.length, "question"))} ${openQs.length === 1 ? "waits" : "wait"} on your answer. Each shows its options: pick one to see what it would mean, then answer it in your review.` : "No question waits on you: every question of the plan is answered."}</p>`);
    parts.push(stopsHtml("plan"));
    for (const { s, q } of openQs) parts.push(`<section class="question" id="${s.id}-question-${q.n}"><p class="kicker">Question ${q.n} · about step ${s.n}${CHG[`question-${q.n}`] ? ` ${chgMark(`question-${q.n}`)}` : ""}</p><h3>${inl(q.title)}</h3>${chgWhat(`question-${q.n}`)}${q.setup ? `<p>${inl(q.setup)}</p>` : ""}${questionHtml(s, q)}</section>`);
    if (answered.length) parts.push(fold(`Questions already answered <span class="n">${answered.length}</span>`, answered.map(({ s, q }) => `<section class="question done" id="${s.id}-question-${q.n}"><p class="kicker">Question ${q.n} · step ${s.n} · answered${CHG[`question-${q.n}`] ? ` ${chgMark(`question-${q.n}`)}` : ""}</p><h4>${inl(q.title)}</h4>${chgWhat(`question-${q.n}`)}<p><b>Answer:</b> ${inl(q.answered.text)}</p>${questionHtml(s, q)}</section>`).join(""), { cls: "grp" }));
  }
  if (stray.length) parts.push(fold("Questions that name no step of this plan", stray.map((q) => `<div class="question" id="question-${q.n}">${CHG[`question-${q.n}`] ? `<p class="kicker">Question ${q.n} ${chgMark(`question-${q.n}`)}</p>${chgWhat(`question-${q.n}`)}` : ""}${md(q.text || q.title, { anchor: `question ${q.n}`, editable: true })}</div>`).join("")));
  // a walkthrough page still carries the plan's questions whole (their words are the plan's), folded
  if (BUILT && (openQs.length || answered.length)) parts.push(fold(`The plan's questions, and how each was answered <span class="n">${openQs.length + answered.length}</span>`, [...openQs, ...answered].map(({ s, q }) => `<section class="question" id="${s.id}-question-${q.n}"><h4>${inl(q.title)}</h4>${q.answered ? `<p><b>Answer:</b> ${inl(q.answered.text)}</p>` : ""}${questionHtml(s, q)}</section>`).join(""), { cls: "grp" }));
  return `<section data-flow class="q" id="needs-you"><h2>What needs you</h2>${parts.join("")}</section>`;
}
function questionHtml(s, q) {
  return `<div class="qq" data-q="${q.n}" data-step="${s.n}"><div class="opts">${q.options.map((o) => `<button type="button" class="opt" data-l="${o.letter}" aria-pressed="false"><b>${o.letter}</b> ${inl(o.label)}${q.recommend && new RegExp(`^I recommend\\s+${o.letter}\\b`).test(q.recommend) ? ` <span class="rec">recommended</span>` : ""}</button>`).join("")}</div><div class="world" aria-live="polite"></div>
    ${q.recommend ? `<p class="recw" data-anchor="question ${q.n} · recommendation" data-editable><span class="lab2">The plan recommends</span> ${inl(q.recommend.replace(/^I recommend\s+/, ""))}</p>` : ""}
    ${fold("The question as the plan wrote it", md(q.text, { anchor: `question ${q.n}`, editable: true }))}</div>`;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".qq .opt"); if (b) { const box = b.closest(".qq"), s = G.steps.find((x) => String(x.n) === box.dataset.step), q = s?.questions.find((x) => String(x.n) === box.dataset.q); if (q) showOption(box, q, b.dataset.l); }
  const a = e.target.closest("[data-answer]"); if (a) { const box = a.closest(".qq"), s = G.steps.find((x) => String(x.n) === box.dataset.step), q = s?.questions.find((x) => String(x.n) === box.dataset.q); if (q) answerOnGuide(q, a.dataset.answer, a); }
});
function showOption(box, q, L) {
  const o = q.options.find((x) => x.letter === L); if (!o) return;
  $$(".opt", box).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === L)));
  const was = q.answered?.letter;
  $(".world", box).innerHTML = `<div class="ow" data-anchor="question ${q.n} · option ${o.letter}" data-editable><p><b>If ${o.letter}:</b> ${inl(o.text)}</p></div>${q.answered ? `<p class="verdict ${was === L ? "good" : "meh"}">${was === L ? "This is what was chosen." : was ? `Not what was chosen: ${esc(was)} was.` : "It was answered in the reviewer's own words."}</p>` : G.own === "plan" ? `<div class="row"><button type="button" class="primary" data-answer="${o.letter}">Answer ${o.letter} in your review</button><span class="q3">The same answer as on the video: the later one is kept.</span></div>` : `<p class="q3">Still open: answer it on the plan video's review.</p>`}`;
  store.set(`q${q.n}`, L);
}
// an answer on the guide goes into the same review as the video's (the player's record for the plan video, in this browser)
function answerOnGuide(q, L, btn) {
  const o = q.options.find((x) => x.letter === L), qid = q.mapId || `q${q.n}`;
  if (PART) { post({ event: "answer", question: qid, option: L.toLowerCase(), label: o.label }); btn.textContent = "Sent to the player"; return; }
  const src = params.get("src") || `${V.plan?.slug || G.slug}/index.html`, key = `${recordKey(src)}:decisions`;
  try { const all = JSON.parse(localStorage.getItem(key) || "{}"); all[qid] = { option: L.toLowerCase(), label: o.label, recommended: /^I recommend\s+([A-Z])\b/.exec(q.recommend || "")?.[1] === L, planStep: q.steps?.[0] ?? null, question: q.title, t: 0, decidedAt: new Date().toISOString(), via: "guide" }; localStorage.setItem(key, JSON.stringify(all)); btn.textContent = `Answered ${L}: it goes with your review`; }
  catch { btn.textContent = "This browser would not keep it"; }
}
// "steps 4 of 5 ✓, decisions 55 of 55 ✓, unexplained 10 ✗" in words. The decisions are counted from the check's own
// list (code-check/findings.md, when the model read it: R.codeCheck.decisions), not the summary's number; those it read
// as outside the diff are said apart, their numbers in a hover; a step it questioned that was fixed since is said as
// fixed; and where the page's own list of decisions (below) counts otherwise, one line says by how many and which
const idsHover = (ids, words) => `<abbr class="idg" title="${esc(ids.map(decisionWords).join("\n"))}">${words}</abbr>`;
function pageDecisions() {
  const L = G.ledger || {}, own = (G.steps || []).flatMap((s) => [...s.decisions, ...s.questions.flatMap((q) => q.answered?.ids || [])]).filter((id, i, a) => a.indexOf(id) === i && L[id]);
  const kept = [...new Set((G.inForce || []).flatMap((x) => x.ids))].filter((id) => L[id] && !own.includes(id));
  return [...own, ...kept];
}
function checkWords(sum, brief = false) {
  if (!sum) return ""; const n = (re) => (re.exec(sum) || []).slice(1).map(Number);
  const [sa, sb] = n(/steps?\s+(\d+)\s+of\s+(\d+)/i), [da, db] = n(/decisions?\s+(\d+)\s+of\s+(\d+)/i), [u] = n(/unexplained\s+(\d+)/i);
  const CD = R.codeCheck?.decisions || null;
  const outside = /decisions?\s+\d+\s+of\s+\d+\s*✓?\s*\(([^()]*(?:not in|outside)[^()]*)\)/i.exec(sum), outWhy = outside ? (/:\s*(.+)$/.exec(outside[1]) || [])[1] || "" : "";
  const outIds = CD ? CD.na : outside ? outside[1].match(/\bD-\d{3,4}\b/g) || [] : [];
  const items = codeItems(), fixedSteps = items.filter((x) => x.step && x.fixed).map((x) => x.step), openSteps = items.filter((x) => x.step && !x.fixed).map((x) => x.step);
  const all = CD ? CD.ids.length : db, held = CD ? CD.ok.length : da != null ? da - outIds.length : null;
  const checked = all != null ? all - (CD ? CD.na.length : outIds.length) : null;
  const others = outIds.length ? ` (${idsHover(outIds, count(outIds.length, "other"))} ${outIds.length === 1 ? "was" : "were"} read as not in the diff's files${outWhy ? `: ${inl(outWhy.replace(/\.$/, ""))}` : ""})` : "";
  const decs = all == null ? null : `${held === checked ? (checked === 1 ? "the one decision" : `all ${checked} decisions`) : `${held} of the ${checked} decisions`} in force it checked against this diff${others}`;
  const agreed = [sb != null && (sa === sb ? `all ${sb} steps` : `${sa} of the ${sb} steps`), decs].filter(Boolean);
  const other = sb != null && sa < sb ? sb - sa : 0;
  const raised = [other && (fixedSteps.length === other ? `the other ${other === 1 ? "step" : `${NUM[other] || other} steps`} (${other === 1 ? "fixed since" : "each fixed since"})` : `the other ${other === 1 ? "step" : `${NUM[other] || other} steps`}${openSteps.length ? ` (step ${openSteps.join(", ")}${fixedSteps.length ? `; step ${fixedSteps.join(", ")} fixed since` : ""})` : ""}`), u && `${count(u, "change")} the plan didn't mention`].filter(Boolean);
  let t = `${agreed.length ? `It found the code matches the plan on ${agreed.join(" and on ")}.` : ""}${raised.length ? ` It questioned ${raised.join(" and ")}; the walkthrough answers each.` : agreed.length ? " It raised nothing else." : ""}`.trim();
  return t && brief ? `A second agent read the code against the plan. ${t}` : t;
}
// how the check counted, beside the page's own list of decisions: said once, folded with what it found (the page says
// one number everywhere else, the check's own list's)
function checkCountNote(sum) {
  const CD = R.codeCheck?.decisions; if (!CD || !sum) return "";
  const db = +((/decisions?\s+\d+\s+of\s+(\d+)/i.exec(sum) || [])[1] || NaN);
  const page = pageDecisions(), notChecked = page.filter((id) => !CD.ids.includes(id)), notHere = CD.ids.filter((id) => !page.includes(id));
  const bits = [], n = (x) => (x < NUM.length ? NUM[x] : String(x));
  if (Number.isFinite(db) && db !== CD.ids.length) bits.push(`its list (<code>${esc(CD.file.split("/").slice(-2).join("/"))}</code>) names ${CD.ids.length} decisions, where its summary line says ${db}; this page counts the ${CD.ids.length}.`);
  if (notChecked.length || notHere.length) bits.push(`${bits.length ? "The" : "the"} decisions this page lists below number ${page.length}${[notChecked.length && `${idsHover(notChecked, `${n(notChecked.length)} of them`)} ${notChecked.length === 1 ? "is" : "are"} not in the check's list`, notHere.length && `${idsHover(notHere, `${n(notHere.length)} of the check's`)} ${notHere.length === 1 ? "is" : "are"} not among them`].filter(Boolean).map((x) => `, and ${x}`).join("")}.`);
  return bits.length ? `<p class="q3 cc-count">How it counted: ${bits.join(" ")}</p>` : "";
}
// the code check's findings, each whole: what it questioned (with its own words in brackets) and the answer
function codeItems() {
  return [...String(G.built?.texts?.codeCheck || "").matchAll(/^[-*] (?:the first )?\*\*✗\s*([^*]+)\*\*([^\n]*(?:\n(?![-*] |\n)[^\n]*)*)/gm)].map((m) => {
    const rest = m[2].replace(/\s+/g, " "), [before, after] = atColon(rest), subject = `${m[1].trim()}${/✗/.test(before) ? ", and others" : ""}`;
    const paren = /^\s*(\([^]*\))\s*$/.exec(before.replace(/\*\*✗[^*]*\*\*,?/g, "").trim());
    const step = +((/^Step (\d+)\b/.exec(m[1].trim()) || [])[1] || 0) || null;
    return { subject: step && paren ? `${subject} ${paren[1]}` : subject, answer: after.trim(), step, fixed: /^fixed\b/i.test(after.trim()) };
  });
}
// "(… (all steps)): a new row, m10" → ["(… (all steps))", "a new row, m10"]: the first colon outside brackets and code
function atColon(t) { let d = 0, code = false; for (let i = 0; i < t.length; i++) { const c = t[i]; if (c === "`") code = !code; else if (!code && c === "(") d++; else if (!code && c === ")") d = Math.max(0, d - 1); else if (!code && !d && c === ":" && /\s/.test(t[i + 1] || " ")) return [t.slice(0, i), t.slice(i + 1).trim()]; } return [t, ""]; }
// how the walkthrough answered a finding, in the reader's words: "a new row, m10" is a choice now listed
const plainAnswer = (t) => String(t || "").replace(/^a new row,?\s*([ADm]\d+)\.?(?=\s|$)/i, "now listed among the agent's choices, as $1.").replace(/\b[Aa] new row,?\s*([ADm]\d+)\b/g, "Now listed among the agent's choices, as $1").replace(/^a call,?\s*now ([ADm]\d+)\.?(?=\s|$)/i, "now listed among the agent's choices, as $1.").replace(/\bnot a new call\b/gi, "not a new choice").replace(/\ba call\b/gi, "a choice the agent made").replace(/^changed\.(?=\s|$)/i, "changed to match.").replace(/\.\./g, ".");
// a "Since then" line: its words, and its commits as git has them, unless its words already name each one (then the
// date goes beside the first time it is named, never the pair twice)
function sinceLine(y, { capital = true } = {}) {
  const cs = y.commits || [], named = cs.filter((c) => new RegExp(`\\b${c.sha.slice(0, 7)}`).test(y.md));
  let html = bareDecisions(glossIds(inl(plainEnd(capital ? cap(y.md) : y.md))));
  const rest = cs.filter((c) => !named.includes(c));
  return `${html}${rest.length ? ` <span class="q3">(${rest.map((c) => `<code>${esc(c.sha)}</code>, ${esc(dateOf(c.date))}`).join("; ")})</span>` : ""}`;
}
function notDoneSection() {
  const T = G.built?.texts || {}, cc = R.codeCheck, thin = R.thin || [];
  const bits = [];
  if (BUILT) {
    const ND = R.notDone || [], settled = ND.filter((x) => x.settled?.length);
    bits.push(`<p class="say">${T.notDone ? `What the walkthrough says is not done${settled.length ? `, each line as it was written, with what ${settled.length === 1 ? "one" : `${NUM[settled.length] || settled.length} of them`} became since` : ""}; then what an independent check of the code found.` : "The walkthrough has no \"Not done\" section, so it says nothing is left undone."}</p>`);
    if (T.notDone && ND.length) {
      const intro = T.notDone.split(/^[-*] \*\*/m)[0].trim();
      const since = (x) => x.settled.map((y) => `<p class="since" data-anchor="Not done · since · ${esc(x.head.slice(0, 40))}"><b>Since then:</b> ${sinceLine(y)}${y.ids?.length ? ` ${idsHover(y.ids, `(from ${esc(y.from || "the decision log")})`)}` : y.from && y.from !== "git" ? ` <span class="q3">(from ${esc(y.from)})</span>` : ""}</p>`).join("");
      bits.push(`<div class="nd">${intro ? md(intro, { anchor: "Not done", gloss: true }) : ""}<ul>${ND.map((x, i) => `<li class="${x.settled?.some((y) => !y.partial) ? "settled" : ""}" data-anchor="Not done · ¶${i + 1}">${bareDecisions(glossIds(inl(x.md)))}${x.settled?.length ? since(x) : ""}</li>`).join("")}</ul></div>`);
    } else if (T.notDone) bits.push(`<div class="nd">${md(T.notDone, { anchor: "Not done", gloss: true })}</div>`);
    // what it raised, each in a line: its subject and how the walkthrough answers it (the whole of each folded)
    // each whole: what it questioned, and the walkthrough's answer, never cut
    const shortNow = shortSteps(), raised = codeItems().map((x) => ({ what: x.subject, said: x.answer, plain: shortNow.find((y) => y.step === x.step)?.plain || null }));
    // a choice's bare number in an answer ("as m10", "m7's case") becomes a link to its card, the number in its hover
    const idLinks = (html) => String(html).split(/(<[^>]+>)/).map((part, i) => (i % 2 ? part : part
      .replace(/, as ([ADm]\d{1,3})(?=[.;,]|$)/g, (m, id) => (callIds.has(id) ? `, <a class="idg" href="#choice-${esc(id)}" data-open="choice-${esc(id)}" title="${esc(callGloss(id))}">see its card</a>` : m))
      .replace(/\b([ADm]\d{1,3})'s\b/g, (m, id) => (callIds.has(id) ? `<a class="idg" href="#choice-${esc(id)}" data-open="choice-${esc(id)}" title="${esc(callGloss(id))}">that choice</a>'s` : m)))).join("");
    if (T.codeCheck) bits.push(`<div class="cc" id="checked"><p class="lab">The code check</p><p>A second agent, which had not seen the work, read the code against the plan. ${checkWords(cc?.summary) || (cc?.summary ? `It reported: ${inl(cc.summary)}.` : "")}</p>${raised.length ? `<ul class="plain raised">${raised.map((x) => x.plain ? `<li>${glossIds(inl(plainEnd(x.plain)))}</li>` : `<li><b>${inl(x.what)}</b>${x.said ? `: ${bareDecisions(idLinks(glossIds(inl(plainEnd(plainAnswer(x.said))))))}` : ""}</li>`).join("")}</ul>` : ""}${fold(cc?.misses ? `What it found, and how each was answered <span class="n">${cc.misses}</span>` : "What it found", `${checkCountNote(cc?.summary)}${md(T.codeCheck, { anchor: "The code check" })}`, { id: "code-check" })}</div>`);
    else bits.push(missing("the walkthrough has no code check."));
    if (T.tests) bits.push(fold("What was tested", md(T.tests, { anchor: "Tests run" }), { id: "tests-run" }));
  } else {
    bits.push(`<p class="say">${R.notIn ? "What the plan leaves out on purpose, and what its text doesn't say yet." : "The plan has no \"Not in this plan\" section."}</p>`);
    if (R.notIn) bits.push(`<div class="nd">${md(R.notIn, { anchor: "Not in this plan" })}</div>`);
  }
  if (thin.length) bits.push(`<div class="thinlist" id="plan-should-add"><p class="lab">What the ${BUILT ? "plan and walkthrough don't" : "plan doesn't"} say yet</p><p class="q3">Where the page has nothing to show, it says so rather than guess. To fill these in, the ${BUILT ? "files" : "plan"} should add:</p><ul class="plain">${thin.map((x) => `<li>${fenced(inl(x.what))} <span class="q3">(${esc(x.where)})</span></li>`).join("")}</ul></div>`);
  return `<section data-flow class="q" id="not-done"><h2>${BUILT ? "What isn't done, and what could go wrong" : "What it leaves out"}</h2>${bits.join("")}</section>`;
}
function codeSection() {
  const B = G.built, t = B.totals, cats = B.cats;
  const cat = (c) => { const hf = c.files.filter((f) => !f.generated).length, gf = c.files.length - hf;
    const sc = scenesFor("built", (f) => f.guide === c.id || f.detail === c.id)[0];
    const name = c.id === "everything-else" ? "Other files the change touched" : c.name;
    // the rest: changes no group claims; a file here can also be in a group above, for another commit's change to it
    const alsoAbove = c.id === "everything-else" ? c.files.filter((f) => cats.some((k) => k !== c && k.files.some((g) => g.path === f.path))).length : 0;
    const sum = c.id === "everything-else" ? `Changes no group above claims, here so that nothing is left out${alsoAbove ? ` (${plural(alsoAbove, "file")} of them ${alsoAbove === 1 ? "is" : "are"} also in a group above, for another commit's change)` : ""}.` : c.sum;
    return `<section class="cat" id="${esc(c.id)}" data-part="${esc(c.id)}"><h3>${inl(name)}</h3>${sum ? `<p class="say" data-anchor="${esc(c.name.replace(/`/g, ""))} · in short">${inl(plainEnd(capWord(noRefs(sum.split("\n")[0].split(/(?<=\.)\s+(?=[A-Z])/)[0]))))}</p>` : ""}
      <p class="meta">${hf ? plural(hf, "file") : ""}${gf ? `${hf ? ", and " : ""}${plural(gf, "file")} the build generates` : ""}${c.steps?.length ? ` · step ${c.steps.join(", ")}` : ""}${sc ? ` · ${watchEl("built", sc.n, { label: "In the video" })}` : ""}</p>
      ${c.files.length ? fold(`See the code <span class="nA">+${c.counts.add}</span> <span class="nD">−${c.counts.del}</span>`, c.diagram ? diagramHtml(c.diagram) : "", { id: `${c.id}-code`, cls: "code", make: () => diffScene(c), open: PART && G.part === c.id }) : ""}
      ${c.sum && c.sum.split("\n").length > 1 ? fold("More on it", md(c.sum)) : ""}</section>`; };
  return `<section data-flow class="q" id="what-changed" data-part="what-changed"><h2>Where the code is</h2>
    <p class="say">The change touches ${filesWords({ long: true })}, grouped below by what they do.${videoFilesWords({ long: true }) ? ` ${videoFilesWords({ long: true })}` : ""} Each group opens to its diff: every changed line with the lines around it, or each file whole.${t.gadd || t.gen ? " Files the build generates (pictures, maps, captions) are listed there too, but not shown line by line." : ""}</p>
    ${G.auto?.change ? fold("Which part of the change uses which", diagramHtml(G.auto.change), { cls: "dg-more", id: "change-map" }) : ""}
    ${cats.map(cat).join("")}
    ${B.commits.length ? `<div class="cmd"><p class="cmdw">Or see every commit of it in git:</p><div class="cmdline"><code><span class="ps">$ </span>git show ${esc(B.commits.map((c) => c.sha).join(" "))}</code><button type="button" class="copy" data-copytext="git show ${esc(B.commits.map((c) => c.sha).join(" "))}" aria-label="Copy the command">Copy</button></div></div>` : ""}
    ${fold(`The ${count(B.commits.length, "commit")}, in the order they landed`, commitsTimeline(B) + `<p class="q3">${B.from === "listed" ? "As the walkthrough lists them." : B.from === "named" ? "The walkthrough lists none: these are the commits after its starting point whose message names the plan." : ""}</p>`, { id: "commits" })}</section>`;
}
// the commits, day by day: each with the parts of the change it touched, a click away
function commitsTimeline(B) {
  const partsOf = (sha) => B.cats.filter((c) => c.files.some((f) => f.commits.some((x) => x.sha === sha)));
  const days = []; for (const c of B.commits) { const d = days.at(-1); if (d && d.date === c.date) d.list.push(c); else days.push({ date: c.date, list: [c] }); }
  return `<ol class="ctl">${days.map((d) => `<li class="ctl-d"><p class="ctl-date">${esc(dateOf(d.date))}</p><ol>${d.list.map((c) => `<li data-anchor="commit ${esc(c.sha)}"><code>${esc(c.sha)}</code> ${inl(c.subject)}${partsOf(c.sha).length ? `<span class="ctl-parts">${partsOf(c.sha).map((k) => `<a href="#${esc(k.id)}" data-open="${esc(k.id)}">${inl(k.id === "everything-else" ? "other files" : k.name)}</a>`).join("")}</span>` : ""}</li>`).join("")}</ol></li>`).join("")}</ol>`;
}
function whereSection() {   // before the build: where it would touch
  const touched = G.touchedAll || [];
  return `<section data-flow class="q" id="where"><h2>Where it would change the code</h2><p class="say">${touched.length ? `The plan names the ${count(touched.length, "part")} of the system it touches.` : "The plan doesn't name the parts of the system it touches."}</p>
    ${touched.length ? `<ul class="plain">${touched.map((c) => `<li>${inl(c.name)}${c.steps?.length ? ` <span class="q3">(step ${c.steps.join(", ")})</span>` : ""}</li>`).join("")}</ul>` : ""}</section>`;
}
function referenceSection() {
  const rest = (G.rest || []).filter((r) => r.md?.trim());
  const B = G.built;
  const wt = B ? [["video", "About the walkthrough video"]].filter(([k]) => B.texts?.[k]).map(([k, t]) => fold(t, md(B.texts[k], { anchor: t }))).join("") : "";
  const n = rest.length + (wt ? 1 : 0);
  return `<section class="q ref" id="the-plan"><h2>The plan, in its own words</h2>${fold(`<span>${cap(count(n, "section"))} of plan.md${wt ? " and the walkthrough's note on its video" : ""}, as written, for when you want the source.</span>`, `<p class="say">Everything plan.md says, section by section. Each step's own words are under the step, above.</p>
    ${rest.map((r) => fold(`${inl(r.title)}${chgMark(r.id)}`, chgWhat(r.id) + md(r.md, { anchor: r.title, editable: true }), { id: r.id })).join("")}${wt}`, { id: "the-plan-all", cls: "ref-fold", attrs: " data-noexpand" })}</section>`;
}
function madeFooter() {
  const miss = R.missingPics || 0;
  // every run made in a scratch repo, named: the page shows them as they ran, and they are not this repo's
  const runs = Object.values({ ...(G.exRuns || {}), ...(G.built?.runs || {}) }), scratch = runs.filter((r) => r.scratch);
  const scratchP = scratch.length ? `<p>Made in a scratch repo, not this one (${count(scratch.length, "run")}${scratch.length === runs.length ? ", every one saved" : ` of the ${runs.length} saved`}): ${scratch.map((r) => `<code>${esc(r.name)}</code>`).join(", ")}.${R.scratch?.setup ? ` ${inl(plainEnd(cap(R.scratch.setup)))}` : ""} The paths they name are that repo's.</p>` : "";
  // a short list, a line a source; the For the guide section's own note on when it was written, folded, as it says it
  const made = (G.made || []).filter((x) => !/^Scratch repo:/.test(x)), note = G.overview?.note;
  return `<footer class="src" id="made"><h2>How this page was made</h2><p>Built from the repository, nothing typed in:</p><ul class="plain made">${made.map((x) => `<li>${glossIds(inl(x))}</li>`).join("")}</ul>${note ? fold(`When the "For the guide" section was written, in its own words`, `<p>${glossIds(inl(plainEnd(note)))}</p>`, { id: "made-note" }) : ""}${scratchP}${miss ? `<p class="q3">${cap(count(miss, "scene picture"))} ${miss === 1 ? "is" : "are"} missing from this copy (the video's snapshots were not built here), so ${miss === 1 ? "that scene shows" : "those scenes show"} as a link only.</p>` : ""}
    ${G.gaps?.length ? fold(`Every note the builder made <span class="n">${G.gaps.length}</span>`, `<ul class="gaps">${G.gaps.map((g) => `<li>${esc(g.where)}: ${fenced(esc(g.what))}</li>`).join("")}</ul>`, { id: "gaps" }) : ""}</footer>`;
}

/* ── an explainer ─────────────────────────────────────────────────────────────────────────────────────── */
function explainerSections() {
  const src = (x) => {
    const sc = scenesFor("explainer", (f) => f.guide === x.part || f.detail === x.part || (x.quoted || []).some((q) => q.scene === f.n))[0];
    const size = [x.size?.lines != null ? plural(x.size.lines, "line") : "", x.size?.files ? plural(x.size.files, "file") : ""].filter(Boolean).join(", ");
    const body = x.files ? x.files.map((f, i) => fold(`<code>${esc(f.path)}</code>${f.lines ? ` <span class="n">${f.lines.length.toLocaleString()} lines</span>` : ""}`, "", { id: `${x.part}-file-${i}`, make: () => (f.lines ? (() => { const b = h(`<div class="whole"><div class="find"><input type="search" placeholder="Find in ${esc(f.path.split("/").pop())}" aria-label="Find in this file"><span class="q3"></span></div>${wholeRows({ path: f.path, lines: f.lines, id: `${x.part}-f${i}` }, { quoted: f.quoted })}</div>`); findIn(b); return b; })() : h(`<p class="q3">${esc(f.note || "Not readable here.")}</p>`)) })).join("")
      : x.entries ? fold(`Every entry <span class="n">${x.entries.length}</span>`, "", { id: `${x.part}-entries`, make: () => { const b = h(`<div class="whole seq"><div class="find"><input type="search" placeholder="Find an entry" aria-label="Find an entry"><span class="q3"></span></div><ol class="entries">${x.entries.map((l, i) => `<li data-anchor="${esc(x.id)}:${i + 1}"${/\b(error|failed|✗)\b/i.test(l) ? ' class="err"' : ""}${(x.quoted || []).some((q) => q.from != null && i + 1 >= q.from && i + 1 <= (q.to ?? q.from)) ? ' data-q=""' : ""}><span class="n">${i + 1}</span><span class="c">${esc(l.length > 400 ? l.slice(0, 400) + " …" : l)}</span></li>`).join("")}</ol></div>`); findIn(b, "li"); return b; } })
      : x.table ? fold(`The table <span class="n">${x.table.rows.length} rows</span>`, "", { id: `${x.part}-table`, make: () => dataTable(x) })
      : x.text != null ? fold("The text, whole", "", { id: `${x.part}-text`, make: () => h(`<div class="whole">${wholeRows({ path: x.id, lines: x.text.replace(/\n$/, "").split("\n"), id: `${x.part}-t` }, { quoted: x.quoted })}</div>`) })
      : `<p class="q3">${x.form === "outside" ? "Its text stays where it is, outside the repository" : "Not readable here"}${x.hash ? `; its fingerprint is <code>${esc(x.hash)}</code>` : ""}.</p>`;
    return `<section class="cat src1" id="${esc(x.part || `src-${x.id}`)}"${x.part ? ` data-part="${esc(x.part)}"` : ""}><h3><code>${esc(x.id)}</code></h3><p class="meta">${esc({ files: "code or files", sequence: "a log, one entry a line", table: "a table", text: "text" }[x.shape] || x.shape)}${size ? ` · ${size}` : ""}${x.commit ? ` · at <code>${esc(String(x.commit).slice(0, 7))}</code>` : ""}${x.quoted?.length ? ` · the video quotes it ${x.quoted.length === 1 ? "once" : `${x.quoted.length} times`} (marked)` : ""}${sc ? ` · ${watchEl("explainer", sc.n, { label: "In the video" })}` : ""}</p>${x.said ? `<p class="say">${inl(x.said)}</p>` : ""}${x.note ? `<p class="q3">${inl(x.note)}</p>` : ""}${x.part ? body : `<p class="q3">Short enough that the video shows it whole.</p>`}</section>`;
  };
  const S = [];
  S.push({ id: "covers", toc: "What it shows", html: `<section data-flow class="q" id="covers"><h2>What it shows you</h2>${R.cover ? md(R.cover, { anchor: "What it will cover" }) : missing("explain.md's \"What it will cover\" is empty, so the page can't say what the video answers.")}</section>` });
  S.push({ id: "sources", toc: "The sources, whole", html: `<section data-flow class="q" id="sources" data-part="sources"><h2>The sources, as they are</h2><p class="say">Everything the video says comes from ${count(G.sources.length, "source")}, read as ${G.sources.length === 1 ? "it was" : "they were"} when it was made. Open one to read it whole; the lines the video quotes are marked.</p>${G.sources.map(src).join("")}</section>` });
  S.push({ id: "needs-you", toc: "What needs you", html: `<section data-flow class="q" id="needs-you"><h2>What needs you</h2><p class="say">Nothing to decide: an explainer asks no questions and changes nothing. When you finish watching, you choose what comes next: Done, Explain more, or Plan this.</p></section>` });
  S.push({ id: "left-out", toc: "What it leaves out", html: `<section data-flow class="q" id="left-out"><h2>What it leaves out, and what is still open</h2>${R.leaves ? md(R.leaves, { anchor: "What it leaves out" }) : missing("explain.md's \"What it leaves out\" is empty.")}${R.open ? `<p class="lab">Still open</p>${md(R.open, { anchor: "Open threads" })}` : ""}${(R.thin || []).length ? `<ul class="plain">${R.thin.map((x) => `<li>${fenced(inl(x.what))}</li>`).join("")}</ul>` : ""}</section>` });
  if (G.explain) S.push({ id: "explain-md", html: `<section class="q ref" id="explain-md"><h2>explain.md, in its own words</h2>${fold("Open it", md(G.explain.replace(/^# .*\n/, ""), { anchor: "explain.md" }))}</section>` });
  return S;
}
function findIn(box, sel = ".L") {
  const inp = $("input", box), out = $(".find .q3", box);
  inp.addEventListener("input", () => { const q = inp.value.trim().toLowerCase(); let n = 0, first = null; $$(sel, box).forEach((r) => { const hit = q && r.textContent.toLowerCase().includes(q); r.classList.toggle("hit", !!hit); if (hit) { n++; first ||= r; } }); out.textContent = q ? `${n} found` : ""; first?.scrollIntoView({ block: "center" }); });
}
function dataTable(x) {
  const t = x.table; let key = -1, dir = 1, q = "";
  const box = h(`<div><div class="filters"><input type="search" placeholder="Filter the rows" aria-label="Filter the rows"><span class="q3"></span></div><div class="tw"><table class="dt"><thead><tr>${t.head.map((c, i) => `<th><button type="button" data-k="${i}">${esc(c)}</button></th>`).join("")}</tr></thead><tbody></tbody></table></div></div>`);
  const draw = () => { let rows = t.rows.map((r, i) => ({ r, i })).filter(({ r }) => !q || r.join(" ").toLowerCase().includes(q)); if (key >= 0) rows.sort((a, b) => { const x1 = a.r[key], y1 = b.r[key], nx = parseFloat(x1), ny = parseFloat(y1); return (isFinite(nx) && isFinite(ny) ? nx - ny : String(x1).localeCompare(String(y1))) * dir; });
    $("tbody", box).innerHTML = rows.map(({ r, i }) => `<tr data-anchor="${esc(x.id)} · row ${i + 1}">${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join(""); $(".filters .q3", box).textContent = `${rows.length} of ${t.rows.length} rows`; };
  $("input", box).addEventListener("input", (e) => { q = e.target.value.toLowerCase(); draw(); });
  box.addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (!b) return; const k = +b.dataset.k; dir = key === k ? -dir : 1; key = k; draw(); });
  draw(); return box;
}

/* ── the page: the sections in the order a reader asks; a part is one of them ──────────────────────────── */
function sectionsList() {
  if (G.kind === "explainer") return explainerSections();
  const S = [];
  S.push({ id: "now", toc: BUILT ? "What you can do now" : "What it would let you do", html: () => nowSection() });
  S.push({ id: "try", toc: BUILT ? "Try it yourself" : "How you would try it", html: () => trySection() });
  if (BUILT) S.push({ id: "choices", toc: "What the agent decided on its own", html: () => choicesSection() });
  else S.push({ id: "decisions", toc: "What's already decided", html: () => decidedSection({ asQuestion: true }) });
  S.push({ id: "needs-you", toc: "What needs you", html: () => needsSection() });
  S.push({ id: "not-done", toc: BUILT ? "What isn't done" : "What it leaves out", html: () => notDoneSection() });
  if (BUILT) S.push({ id: "what-changed", toc: "Where the code is", html: () => codeSection() });
  else S.push({ id: "where", toc: "Where it would change the code", html: () => whereSection() });
  if (!BUILT && G.built) { S.push({ id: "choices", toc: "Since then: what the agent decided as it built it", html: () => choicesSection() }); S.push({ id: "what-changed", toc: "Since then: where the code is", html: () => codeSection() }); }
  if (BUILT) S.push({ id: "decisions", toc: null, html: () => decidedSection({ asQuestion: false }) });
  S.push({ id: "the-plan", toc: "The plan, in its own words", html: () => referenceSection() });
  return S;
}
const app = document.getElementById("app");
const EMBED = params.get("embed") === "1" && window.parent !== window;   // under the review page's player (the block at the end)
if (EMBED) document.documentElement.setAttribute("data-embedded", "");
// a section's lead (the large type) is at most two sentences: the rest goes on in the body's own size under it
function sayTwo(html) {
  return String(html).replace(/<p class="say"((?: [^>]*)?)>([\s\S]*?)<\/p>/g, (m, attrs, body) => {
    const parts = body.split(/(<[^>]+>)/); let seen = 0, at = -1, pos = 0, depth = 0;
    for (let i = 0; i < parts.length && at < 0; i++) { const x = parts[i];
      if (i % 2) { if (/^<(?:code|a|abbr|b|span|strong|em)\b/.test(x)) depth++; else if (/^<\/(?:code|a|abbr|b|span|strong|em)>/.test(x)) depth--; pos += x.length; continue; }
      if (!depth) { const re = /[.!?](?=\s+(?:[A-Z0-9“"(]|<(?:code|b|a|abbr)\b))/g; let r; while ((r = re.exec(x))) { if (++seen === 2) { at = pos + r.index + 1; break; } } }
      pos += x.length; }
    if (at < 0) return m;
    const rest = body.slice(at).trim();
    return rest ? `<p class="say"${attrs}>${body.slice(0, at)}</p><p class="say-more">${rest}</p>` : m;
  });
}
function render() {
  const S = sectionsList(), html = (x) => sayTwo(typeof x.html === "function" ? x.html() : x.html);
  if (FULL) {
    const back = V[G.own], from = Number(params.get("from")), embedded = EMBED;
    app.appendChild(h(`<header class="gbar"><span class="gk">Guide</span><span class="gt">${inl(R.name || G.title)}</span><span class="grow"></span><button class="lk yours" type="button" data-yours hidden>Your notes · <span class="n">0</span></button><button type="button" class="lk" data-expand>Open everything</button>${back && !embedded ? `<a class="back" href="${esc(watchHref(G.own, params.has("from") && isFinite(from) ? from : 0))}">Back to the video${params.has("from") ? ` <span class="t">${fmt(from)}</span>` : ""}</a>` : ""}</header>`));
    const main = h(`<main id="main" class="doc"></main>`); app.appendChild(main);
    main.insertAdjacentHTML("beforeend", hero());
    main.insertAdjacentHTML("beforeend", `<p class="howto">Highlight anything to leave a note${G.kind === "plan" ? ", suggest an edit" : ""}, or ask. <button type="button" class="lk" data-expand>Open everything</button></p>`);
    for (const x of S) main.insertAdjacentHTML("beforeend", html(x));
    main.insertAdjacentHTML("beforeend", madeFooter());
  } else {
    const P = G.part, main = h(`<main id="main" class="doc part"></main>`); app.appendChild(main);
    app.insertBefore(h(`<div class="partbar"><button type="button" class="lk" data-expand>Open everything</button></div>`), main);
    let got = "";
    if (G.kind === "explainer") { const ex = explainerSections(); got = (ex.find((x) => x.id === "sources") || ex[0]).html; if (P !== "sources") { const d = h(`<div>${got}</div>`); const art = d.querySelector(`[data-part="${CSS.escape(P)}"]`); got = art ? `<section data-flow class="q" id="sources">${art.outerHTML}</section>` : got; } }
    else {
      const st = (G.steps || []).find((x) => x.id === P);
      if (st) got = `<section data-flow class="q" id="now">${stepArticle(st)}</section>`;
      else if (P === "what-changed" && G.built) got = codeSection();
      else if (P === "choices" && G.built) got = choicesSection();
      else if (G.built?.cats.some((c) => c.id === P)) { const d = h(`<div>${codeSection()}</div>`); got = `<section data-flow class="q" id="what-changed">${d.querySelector(`#${CSS.escape(P)}`).outerHTML}</section>`; }
      else got = decidedSection({ asQuestion: G.own !== "built" });
    }
    main.insertAdjacentHTML("beforeend", got);
  }
  wireTry(document);
  linkFiles($("main"));
  if (RV) { chgLeft(); chgInside(); if (FULL && store.get(`only:${RV.against.commit}`, false)) onlyChanges(true); }
  if (FULL) markWords();
}
// the words of the system the page uses: each marked where it first appears, its plain meaning on hover, focus or a
// tap (a small card under it); and all of them listed, folded, under the In short as one line
const COMMONWORDS = new Set(["step", "review", "approve", "request changes", "agent", "finish", "recommended", "choice", "commit", "diff", "git", "merge", "branch", "repo", "repository", "flag", "label", "tag", "scene", "guide", "real thing", "prompt", "template", "terminal", "html", "css", "json", "clone", "memory", "area", "part of the system", "brief", "spec", "lint", "linter", "miss", "audit", "chapter", "dependency", "ci", "pr", "pull request", "test suite", "npm", "npx", "github", "cli", "tts", "streak", "squash", "deviation", "off-plan change", "notification", "inbox", "sandbox", "storyboard", "accepted in a row"]);
const WORDS = [];
function markWords() {
  const list = $("#words"); if (!list) return;
  const words = [...(R.words || []).flatMap((w) => w.forms.filter((f) => !COMMONWORDS.has(f)).map((f) => ({ f, w }))), { f: "__dnum", w: { term: "D-228, D-264 …", said: "A numbered entry in the decision log: the record of every answer you gave and every choice you accepted." } },
    ...(G.built?.calls?.length ? [{ f: "__cnum", w: { term: "A1, D1, m1 …", said: "A choice the agent made on its own, numbered in the walkthrough: A for one the plan left open, D for one that changed the plan (not the decision log's D-numbers, which have a dash), m for a small one." } }] : [])]
    .sort((a, b) => b.f.length - a.f.length);
  const found = new Map(), SKIP = "pre,code,.cmdline,.L,.term,h1,h2,h3,h4,a,button,summary,.inshort dt,.kicker,.lab,#words,footer,details:not([open]),.gtip,svg,.dg-title,.chg,.chgd,.revised";
  const walker = document.createTreeWalker($("main"), NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest(SKIP) || !n.nodeValue.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    let text = node.nodeValue, hit = null;
    for (const { f, w } of words) { if (found.has(w.term)) continue;
      const re = f === "__dnum" ? /\bD-\d{3,4}\b/ : f === "__cnum" ? new RegExp(`\\b(?:${[...callIds].join("|") || "A1"})\\b`) : new RegExp(`\\b${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`, "i"), m = re.exec(text);
      if (m && (!hit || m.index < hit.m.index)) hit = { m, w }; }
    if (!hit) continue;
    found.set(hit.w.term, hit.w);
    const i = WORDS.push(hit.w) - 1;
    const el = document.createElement("span"); el.className = "gw"; el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-expanded", "false"); el.dataset.w = String(i); el.textContent = hit.m[0];
    const after = node.splitText(hit.m.index); after.nodeValue = after.nodeValue.slice(hit.m[0].length); node.parentNode.insertBefore(el, after);
  }
  if (!found.size) { list.remove(); return; }
  $(".fbody", list).innerHTML = `<dl class="words">${[...found.values()].map((w) => `<dt>${esc(cap(w.term))}</dt><dd>${inl(w.said)}</dd>`).join("")}</dl>`;
  const n = found.size;
  $("summary", list).innerHTML = `<span>${cap(n < NUM.length ? NUM[n] : String(n))} ${n === 1 ? "word here has a special meaning, marked with a dotted line" : "words here have a special meaning, marked with a dotted line"}.</span> <span class="show">Show ${n === 1 ? "it" : "them"}</span><span class="hide">Hide ${n === 1 ? "it" : "them"}</span>`;
}
// the card: one for the page, under the word (above it where there is no room); hover shows it, leaving hides it; a
// tap or Enter keeps it until a tap elsewhere or Escape
const tip = FULL ? h(`<div class="gtip" id="gtip" role="tooltip" hidden></div>`) : null;
let tipFor = null, tipKept = false, tipT = 0;
function showTip(el, keep = false) {
  const w = WORDS[+el.dataset.w]; if (!w || !tip) return;
  if (!tip.isConnected) document.body.appendChild(tip);
  clearTimeout(tipT);
  if (tipFor && tipFor !== el) { tipFor.setAttribute("aria-expanded", "false"); tipFor.removeAttribute("aria-describedby"); }
  tipFor = el; tipKept = keep || (tipKept && tipFor === el);
  tip.innerHTML = `<p><b>${esc(cap(w.term))}</b> ${inl(w.said)}</p><a href="#words" data-open="words">Every word with a special meaning here</a>`;
  tip.hidden = false; el.setAttribute("aria-expanded", "true"); el.setAttribute("aria-describedby", "gtip");
  const r = el.getBoundingClientRect(), tw = Math.min(360, innerWidth - 24); tip.style.width = `${tw}px`;
  const left = Math.max(12, Math.min(r.left, innerWidth - tw - 12)), below = r.bottom + 8, th = tip.offsetHeight;
  tip.style.left = `${left + scrollX}px`; tip.style.top = `${(below + th > innerHeight - 8 && r.top - th - 8 > 8 ? r.top - th - 8 : below) + scrollY}px`;
}
function hideTip(now = false) {
  clearTimeout(tipT);
  const go = () => { if (!tip || tip.hidden) return; tip.hidden = true; tipKept = false; if (tipFor) { tipFor.setAttribute("aria-expanded", "false"); tipFor.removeAttribute("aria-describedby"); } tipFor = null; };
  if (now) go(); else tipT = setTimeout(go, 180);
}
if (tip) {
  document.addEventListener("pointerover", (e) => { if (e.pointerType !== "mouse") return; const g = e.target.closest?.(".gw"); if (g) showTip(g); else if (e.target.closest?.(".gtip")) clearTimeout(tipT); });
  document.addEventListener("pointerout", (e) => { if (e.pointerType !== "mouse" || tipKept) return; if (e.target.closest?.(".gw, .gtip") && !e.relatedTarget?.closest?.(".gw, .gtip")) hideTip(); });
  document.addEventListener("click", (e) => { const g = e.target.closest(".gw"); if (g) { e.preventDefault(); if (tipFor === g && tipKept) hideTip(true); else showTip(g, true); return; }
    if (e.target.closest(".gtip a")) { hideTip(true); return; } if (!e.target.closest(".gtip")) hideTip(true); });
  document.addEventListener("keydown", (e) => { const g = e.target.closest?.(".gw"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); if (tipFor === g && tipKept) hideTip(true); else showTip(g, true); } else if (e.key === "Escape" && tipFor) { const f = tipFor; hideTip(true); f.focus(); } });
  document.addEventListener("focusin", (e) => { const g = e.target.closest?.(".gw"); if (g) showTip(g); });
  document.addEventListener("focusout", (e) => { if (e.target.closest?.(".gw") && !tipKept) hideTip(); });
  addEventListener("resize", () => hideTip(true));
}
render();

/* ── opening: a fold, everything, or the place a link names ─────────────────────────────────────────────── */
// "Open everything" opens every fold but the reference ones (the decisions it was built on, the plan in its own words:
// [data-noexpand], each a click of its own); `everything` opens those too (guide --check reads the whole page)
function expandAll(on, { everything = false } = {}) {
  document.body.classList.toggle("all", on);
  const skip = (d) => on && !everything && !!d.closest("[data-noexpand]");
  for (let i = 0; i < 6; i++) { const closed = $$("details").filter((d) => d.open !== on && !skip(d)); if (!closed.length) break; closed.forEach((d) => { d.open = on; if (on) fillLazy(d); }); }
  if (on) wireTry(document);
  $$("[data-expand]").forEach((b) => (b.textContent = on ? "Close everything" : "Open everything"));
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-expand]"); if (b) expandAll(!document.body.classList.contains("all")); });
function openAt(id) {
  let el = document.getElementById(id);
  if (!el) { for (const d of $$("details[data-lazy]:not([data-filled])")) { fillLazy(d); if ((el = document.getElementById(id))) break; } }
  if (!el) { if (PART) post({ event: "open", name: (G.partOf || {})[id] || id }); return; }
  for (let p = el; p; p = p.parentElement) if (p.tagName === "DETAILS") { p.open = true; fillLazy(p); }
  if (el.tagName === "DETAILS") { el.open = true; fillLazy(el); }
  if (el.getAttribute("role") === "tabpanel") { const t = document.getElementById(el.getAttribute("aria-labelledby") || ""); if (t) selectTab(t); }
  wireTry(el);
  requestAnimationFrame(() => el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }));
  // where it landed, lit lightly a moment (under the player, its own block lights it)
  if (!document.documentElement.classList.contains("rp-embed")) { el.classList.remove("rp-lit"); void el.offsetWidth; el.classList.add("rp-lit"); setTimeout(() => el.classList.remove("rp-lit"), 2600); }
  try { history.replaceState(null, "", "#" + id); } catch {}
}
// a deep link: a section (#now), a step (#step-3), a place in it (#step-3-cases, #step-3-case-2), a decision (#D-228)
const go = () => { const raw = decodeURIComponent(location.hash.slice(1)); if (!raw) return; const id = raw.replace("#", "-"); setTimeout(() => openAt(document.getElementById(id) ? id : raw.split("#")[0]), 60); };
addEventListener("hashchange", go); go();
if (PART && G.part) { const t = document.getElementById(G.part); if (t && t.tagName === "DETAILS") { t.open = true; fillLazy(t); } }

// a review page that carries only some of a plan's videos (its library.json lists them): a link to one it does not
// carry becomes plain text that says so, never a dead link; links built later are marked as they appear
const onPage = { slugs: null };
const markGone = (root) => { if (!onPage.slugs) return; [...(root.matches?.("a.wm[href]") ? [root] : []), ...$$("a.wm[href]", root)].forEach((a) => { let p = null; try { p = new URL(a.href).searchParams.get("project"); } catch {} if (!p || onPage.slugs.has(p)) return;
  a.removeAttribute("href"); a.classList.add("gone"); a.title = "That video is not on this page"; const l = a.querySelector(".wl"); if (l) l.textContent += " · not on this page"; }); };
// (a full page served over http: a part page, or one opened from disk, has no review page two folders up to ask)
(FULL && /^https?:$/.test(location.protocol) ? fetch("../../library.json") : Promise.reject(new Error("no review page"))).then((r) => (r.ok ? r.json() : null)).then((lib) => { if (!Array.isArray(lib?.slugs)) return; onPage.slugs = new Set(lib.slugs); markGone(document);
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) markGone(n); }))).observe(document.body, { childList: true, subtree: true }); })
  .catch(() => {}).finally(() => { document.documentElement.dataset.onpage = onPage.slugs ? "checked" : "unknown"; });
splitLeads(); fitDiagrams(); if (document.fonts?.ready) document.fonts.ready.then(fitSoon);
window.RPGuide = { G, watchHref, expandAll, openAt };
})();

/* ── EMBEDDED: the guide under the review page's player (D-264) ─────────────────────────────────────────────────────
   This block is the review page's, and it is the whole interface between the two; the rest of this file does not know
   it is embedded, and this block only reads the page the rest drew (by ids, a.wm and [data-seek]). A video's page made
   from its parts (scripts/lib/guide-page.mjs, its Watch links a[data-watch]) carries this block too, from here.
   The review page (packages/player/reelplanning-player.js, <reelplanning-guide>) shows this page in a same-origin frame
   under its player, as tall as the window: the page scrolls down to the frame, then the guide scrolls itself.

   The param:  ?embed=1   (beside the usual src=, review= and theme=). Without it, or in no frame, nothing here runs.
   In embed mode: no top bar, and "Watch this moment" asks the review page's player to seek, never leaves the page.

   Messages (window.postMessage, same origin; each carries its `type`, then `event`):
     this page → the review page  { type: "rp-guide-embed", event: "ready" }
                                      drawn; the review page may now send "open"
                                  { type: "rp-guide-embed", event: "watch", t, project, href }
                                      a "Watch this moment" (a.wm, a[data-watch], a part's [data-seek], or any link to a
                                      video on the review page with a t=) was clicked: t, the moment in seconds; project,
                                      the video it is in (a review page slug; null: this guide's own); href, where the link
                                      went on its own page (for a video the review page is not on)
                                  { type: "rp-guide-embed", event: "back", project, href }
                                      a link to this video with no moment ("Watch the walkthrough video"): back up to it
                                  { type: "rp-guide-embed", event: "overlay", open }
                                      a picture opened full size over the page (true) or closed (false): the review page's
                                      small player steps out of its way, paused, and comes back after
   Every other link keeps the frame where it is: one to another video on the review page goes there (target=_top), one
   elsewhere opens in a new tab; a link within the page (#…) is the page's own.
     the review page → this page  { type: "rp-guide-host", event: "scroll", on }
                                      on: true, the frame fills the window and wheel and touch scroll the guide; false,
                                      they scroll the review page (the frame is still coming into view)
                                  { type: "rp-guide-host", event: "open", part }
                                      go to a part (an id on this page: step-3, a kind of change, a decision) and light it
                                      a moment; as a deep link (#part) does, without a history entry
                                  { type: "rp-guide-host", event: "note", id }
                                      go to a note highlighted in the guide, and light it a moment (the note box answers
                                      it: packages/player/guide-review.js, which keeps notes in the player's own record)
                                  { type: "rp-guide-host", event: "theme", theme }      "light" or "dark"
                                  { type: "rp-guide-host", event: "inset", bottom, right, dock }   px the small player covers at
                                      the window's foot (the page leaves that room under its last words) and from its right
                                      edge (the column moves left of it, narrowing where it must: it never covers words);
                                      dock, px of this frame's own window covered at its foot right now (the review page's
                                      window ending above the frame's foot, and the small player's bar): what is fixed to the
                                      foot (the note box docked on a phone, a toast) stands above it
                                  { type: "rp-guide-host", event: "open", part, instant }   with instant, the page jumps to
                                      the part at once, lit when "light" comes: the review page sends it as its own glide
                                      down to the frame begins, so the frame comes into view already at the part (a
                                      glide would show the guide's top for a frame, then jump)
                                  { type: "rp-guide-host", event: "light", part }   the review page's glide is over: light
                                      the part a moment where it is */
(function () {
  "use strict";
  if (new URLSearchParams(location.search).get("embed") !== "1" || window.parent === window) return;
  const root = document.documentElement, host = window.parent;
  const say = (m) => { try { host.postMessage({ type: "rp-guide-embed", ...m }, location.origin); } catch {} };
  // the frame is the review page's, not the player's panel: the page keeps its own headings (rp-theme marks any frame)
  root.removeAttribute("data-framed");
  root.classList.add("rp-embed", "rp-embed-still");
  root.style.setProperty("--top", "0px"); root.style.setProperty("--bar", "0px");
  const css = document.createElement("style");
  css.textContent = `
html.rp-embed .gbar{display:none}
html.rp-embed-still{overflow:hidden}
html.rp-embed body{padding-bottom:var(--rp-embed-bottom,0px)}
html.rp-embed{--rp-docw:min(calc(var(--measure,760px) + 2 * var(--pad,40px)),calc(100vw - var(--rp-embed-right,0px)))}
html.rp-embed .doc{max-width:var(--rp-docw);margin-left:max(0px,min(calc((100vw - var(--rp-docw)) / 2),calc(100vw - var(--rp-docw) - var(--rp-embed-right,0px))));margin-right:auto}
html.rp-embed .rpn-toast{bottom:calc(18px + var(--rp-embed-dock,var(--rp-embed-bottom,0px)))}
.rp-embed-lit{border-radius:4px;outline:1.5px solid transparent;outline-offset:10px;animation:rp-embed-lit 2.8s cubic-bezier(.2,.7,.2,1) both}
@keyframes rp-embed-lit{0%,50%{outline-color:var(--accent,#B8552E);background-color:color-mix(in srgb,var(--accent,#B8552E) 7%,transparent);box-shadow:0 0 0 10px color-mix(in srgb,var(--accent,#B8552E) 7%,transparent)}100%{outline-color:transparent;background-color:transparent;box-shadow:0 0 0 10px transparent}}
@media (prefers-reduced-motion:reduce){.rp-embed-lit{animation:none;outline-color:var(--accent,#B8552E)}}
:root.rp-embed:not(#rp-x) :is([data-anchor],[id],section.step,section.cat,section.q,section.question,li.call,.exs,.how,figure.dg){scroll-margin-top:32px}
:root.rp-embed .rp-embed-lit{animation:rp-embed-in 2.8s ease-out both}
@keyframes rp-embed-in{0%{background-color:transparent;box-shadow:inset 3px 0 0 transparent}12%,45%{background-color:color-mix(in srgb,var(--accent,#B8552E) 6%,transparent);box-shadow:inset 3px 0 0 var(--accent,#B8552E)}100%{background-color:transparent;box-shadow:inset 3px 0 0 transparent}}
@media (prefers-reduced-motion:reduce){:root.rp-embed .rp-embed-lit{animation:none;box-shadow:inset 3px 0 0 var(--accent,#B8552E)}}`;
  document.head.appendChild(css);
  // "Watch this moment": the review page's player, at that moment (a click that asks for a new tab keeps the link's own way)
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("a.wm[href], a[data-watch][href], [data-seek]"); if (!a) return;
    if (a.tagName === "A" && (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
    let t = NaN, project = null, href = null;
    if (a.hasAttribute("data-seek")) t = Number(a.dataset.seek);
    else try { const u = new URL(a.href); t = Number(u.searchParams.get("t")); project = u.searchParams.get("project"); href = u.href; } catch {}
    if (!Number.isFinite(t) || t < 0) return;
    e.preventDefault(); e.stopImmediatePropagation();
    say({ event: "watch", t, project, href });
  }, true);
  // Any other link: the frame never goes anywhere (a second review page nested in the first, D-264's A1). A link to a
  // video on the review page (?project=) is the review page's: this video with a moment plays it there, with none goes
  // back up to it; another video's opens the review page on it (target=_top). A link out of the site opens a new tab,
  // and so does another page of this site (a file, a saved run); a link within the page (#…) is the page's own.
  const mine = (() => { try { return new URL(new URLSearchParams(location.search).get("review") || "", location.href).searchParams.get("project"); } catch { return null; } })();
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const a = e.target.closest?.("a[href]"); if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const raw = a.getAttribute("href") || ""; if (!raw || raw.startsWith("#") || /^(javascript|mailto|tel|data|blob):/i.test(raw)) return;
    if (a.hasAttribute("download") || (a.target && a.target !== "_self")) return;
    let u; try { u = new URL(a.href, location.href); } catch { return; }
    if (u.origin === location.origin && u.pathname === location.pathname && u.search === location.search) return;   // a place on this page
    if (u.origin !== location.origin) { a.target = "_blank"; a.rel = "noopener noreferrer"; return; }
    const project = u.searchParams.get("project");
    if (!project) { a.target = "_blank"; a.rel = "noopener"; return; }
    const t = Number(u.searchParams.get("t")), same = !mine || project === mine;
    if (!same) { a.target = "_top"; return; }
    e.preventDefault();
    say(Number.isFinite(t) && t >= 0 && u.searchParams.has("t") ? { event: "watch", t, project, href: u.href } : { event: "back", project, href: u.href });
  });
  // a picture opened full size (templates/guide/pictures.js): the review page's small player steps aside
  document.addEventListener("rp-overlay", (e) => say({ event: "overlay", open: !!e.detail?.open }));
  // a part, opened from the review page: the page's own deep link, then a light on where it lands
  let lit = null, litT = 0;
  const light = (id) => {
    const el = document.getElementById(id); if (!el) return false;
    const at = (el.matches("[data-flow]") ? el.querySelector(".beat") : el.closest(".beat")) || el;
    if (lit) lit.classList.remove("rp-embed-lit"); void at.offsetWidth; at.classList.add("rp-embed-lit"); lit = at;
    clearTimeout(litT); litT = setTimeout(() => at.classList.remove("rp-embed-lit"), 2800);
    return true;
  };
  // …and once the page's own scroll has come to rest, it is there: where what is drawn as it comes near (one column, a
  // phone) grew on the way and left it short, it goes the rest of the way
  let token = 0;
  const arrive = (id, tries, t, quiet = false) => {
    let last = null, same = 0;
    const tick = () => {
      if (t !== token) return; const el = document.getElementById(id); if (!el) return;
      const top = Math.round(el.getBoundingClientRect().top); if (top === last) same++; else { same = 0; last = top; }
      if (same < 6) { requestAnimationFrame(tick); return; }
      if ((top < -4 || top > 48) && tries < 8) { el.scrollIntoView({ block: "start", ...(quiet ? { behavior: "instant" } : {}) }); requestAnimationFrame(() => arrive(id, tries + 1, t, quiet)); }
      else if (tries && !quiet) light(id);   // lit again where it came to rest
    };
    requestAnimationFrame(tick);
  };
  // A part far down the page (more than two windows away) is jumped to, not glided to: a long glide drew sections the
  // browser had not painted yet, blank on the way; its light fades in where it lands. Nearer, the
  // page's own glide. The page opens the folds it is in (RPGuide.openAt), then the jump comes before its glide starts.
  // With instant (the review page gliding down to the frame as it asks), the page is at the part at once and in the same
  // frame, never gliding inside a frame still coming into view, and the light waits for "light".
  const open = (id, instant = false) => {
    if (!id) return;
    const t = ++token;
    try { history.replaceState(null, "", "#" + encodeURIComponent(id)); } catch {}
    const G = window.RPGuide;
    if (typeof G?.openAt === "function") {
      const want = id.replace("#", "-"), to = document.getElementById(want) ? want : id.split("#")[0];
      G.openAt(to);
      const el = document.getElementById(to);
      if (el && (instant || Math.abs(el.getBoundingClientRect().top) > 2 * innerHeight)) el.scrollIntoView({ block: "start", behavior: "instant" });
      // (openAt glides there on the next frame: the jump, set after it, is what that frame does)
      if (el && instant) requestAnimationFrame(() => { if (t === token) el.scrollIntoView({ block: "start", behavior: "instant" }); });
    } else dispatchEvent(new HashChangeEvent("hashchange"));
    if (instant) { let n = 0; const look = () => { if (t !== token) return; if (document.getElementById(id)) arrive(id, 0, t, true); else if (++n < 40) setTimeout(look, 50); }; look(); return; }
    let n = 0; const look = () => { if (t !== token) return; if (light(id)) arrive(id, 0, t); else if (++n < 40) setTimeout(look, 50); }; setTimeout(look, 90);
  };
  addEventListener("message", (e) => {
    if (e.source !== host || e.origin !== location.origin) return;
    const m = e.data; if (!m || typeof m !== "object" || m.type !== "rp-guide-host") return;
    if (m.event === "scroll") root.classList.toggle("rp-embed-still", !m.on);
    else if (m.event === "open") open(String(m.part || ""), !!m.instant);
    else if (m.event === "light") light(String(m.part || ""));
    else if (m.event === "theme") { if (m.theme === "dark") root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme"); }
    else if (m.event === "inset") { const px = (n) => `${Math.max(0, Math.round(Number(n) || 0))}px`; root.style.setProperty("--rp-embed-bottom", px(m.bottom)); root.style.setProperty("--rp-embed-right", px(m.right)); root.style.setProperty("--rp-embed-dock", px(m.dock ?? m.bottom)); dispatchEvent(new Event("rp-embed-inset")); }
  });
  say({ event: "ready" });
})();
