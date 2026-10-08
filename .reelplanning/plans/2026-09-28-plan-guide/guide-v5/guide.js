/* The guide, prototype v5 (plan 2026-09-28-plan-guide): one renderer for a part of the guide (a page the player
   opens over the paused frame) and for the full guide page (every part, one flow). Made from #guide-data, which
   build.mjs writes from git, the saved runs and the walkthrough's data: nothing typed in.
   A part lives in the player's sandboxed frame and speaks through the bridge (rp-detail messages): "open" another
   part, "seek" the video. The full page goes back to the review page's player for "Watch this moment". */
(function () {
"use strict";
const Z = document.getElementById("guide-data-z");
const G = Z ? JSON.parse(window.pako.inflate(Uint8Array.from(atob(Z.textContent.trim()), (c) => c.charCodeAt(0)), { to: "string" })) : JSON.parse(document.getElementById("guide-data").textContent);
const FULL = G.mode === "full";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tick = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const fmt = (t) => { t = Math.max(0, Math.floor(t)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };
const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const store = { get(k, d) { try { const v = localStorage.getItem("g5:" + k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem("g5:" + k, JSON.stringify(v)); } catch {} } };
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const post = (m) => { m.type = "rp-detail"; try { parent.postMessage(m, "*"); } catch {} };
const framed = document.documentElement.hasAttribute("data-framed");
const K = G.kinds, ORDER = G.order.filter((id) => K[id]);

/* where things go: back to the video, or to another part */
const params = new URLSearchParams(location.search);
function watchHref(t) {
  const back = params.get("review"), at = (Math.max(0, t) + 0.1).toFixed(2);
  if (back) { try { const u = new URL(back, location.href); u.searchParams.set("t", at); u.searchParams.delete("part"); return u.href; } catch {} }
  return `../../index.html?project=${encodeURIComponent(G.slug)}&t=${at}`;
}
function watch(t) {
  if (!FULL) { post({ event: "seek", t }); return; }
  location.href = watchHref(t);
}
function openPart(id) {
  const el = document.getElementById(id);
  if (!FULL && !el) { post({ event: "open", name: G.partOf[id] || id }); return; }
  if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  try { history.replaceState(null, "", "#" + id); } catch {}
}
document.addEventListener("click", (e) => {
  const w = e.target.closest("[data-watch]"); if (w) { e.preventDefault(); watch(+w.dataset.watch); return; }
  const o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); openPart(o.dataset.open); }
});
const watchBtn = (t, label = "Watch this moment") => FULL
  ? `<a class="go" href="${esc(watchHref(t))}" data-watch="${t}">${esc(label)} <span class="t">${fmt(t)}</span></a>`
  : `<button class="go" type="button" data-watch="${t}">${esc(label)} <span class="t">${fmt(t)}</span></button>`;

/* ── highlighting: a few regexes, not a parser ──────────────────────────────────────────────────────── */
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
const langOf = (p) => /\.md$/.test(p) ? "md" : /\.json$/.test(p) ? "json" : /\.sh$|gitignore$/.test(p) ? "sh" : /\.(m?js|html)$/.test(p) ? "js" : "txt";
const cutLine = (body) => { const i = body.indexOf("\u0000"); return i < 0 ? [body, 0] : [body.slice(0, i), +body.slice(i + 1)]; };

/* ── the diff: files open; changes with ten lines around them, or the whole file with its changed lines marked ─ */
function hunkRows(f, c) {
  const lang = langOf(f.path); let html = "";
  for (const hk of c.hunks) {
    const m = hk.h.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)/); let o = +m[1], n = +m[2];
    html += `<div class="hk">${esc(hk.h)}</div><div class="lines">`;
    for (const line of hk.l) {
      const k = line[0] || " ", [shown, more] = cutLine(line.slice(1)), cls = k === "+" ? "a" : k === "-" ? "d" : "";
      html += `<div class="L ${cls}" data-anchor="${esc(f.path)}:${k === "-" ? "-" + o : n}"><span class="o">${k === "+" ? "" : o}</span><span class="n" title="Note on this line">${k === "-" ? "" : n}</span><span class="c" data-no-anchor data-s="${k === " " ? " " : k}">${hl(shown, lang)}${more ? `<span class="cut"> … ${more.toLocaleString()} more characters on this line (a data URI)</span>` : ""}</span></div>`;
      if (k !== "+") o++; if (k !== "-") n++;
    }
    html += `</div>`;
  }
  return html;
}
function wholeRows(f) {
  const lang = langOf(f.path), mark = new Set(f.whole.mark); let html = `<div class="lines">`;
  f.whole.lines.forEach((line, i) => { const n = i + 1, [shown, more] = cutLine(line);
    html += `<div class="L${mark.has(n) ? " m" : ""}" data-anchor="${esc(f.path)}:${n}"><span class="n" title="Note on this line">${n}</span><span class="c" data-no-anchor data-s=" ">${hl(shown, lang)}${more ? `<span class="cut"> … ${more.toLocaleString()} more characters</span>` : ""}</span></div>`; });
  return html + `</div>`;
}
function copyText(text, btn) {
  const done = (w) => { const was = btn.textContent; btn.textContent = w; setTimeout(() => (btn.textContent = was), 1400); };
  const fallback = () => { const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0"; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand("copy"); } catch {} ta.remove(); done(ok ? "Copied" : "Select and copy"); };
  try { navigator.clipboard.writeText(text).then(() => done("Copied"), fallback); } catch { fallback(); }
}
function fileEl(f, kindId, i) {
  const has = !!f.whole, where = f.commits.map((c) => `${c.label} · ${c.sha}`).join(", ");
  const sec = h(`<section class="file" id="${kindId}-f${i}" data-anchor="${esc(f.path)}"><div class="fh"><span class="path">${esc(f.path)}</span><span class="meta">${esc(where)}${f.isNew ? " · new file" : ""}${f.generated ? " · written by the build" : ""}</span><span class="nA mono">+${f.add}</span><span class="nD mono">−${f.del}</span><span class="grow"></span>
    ${f.generated ? "" : `<span class="seg2" role="group" aria-label="${esc(f.path)}: what to show"><button type="button" data-view="diff" aria-pressed="true">Changes</button>${has ? `<button type="button" data-view="whole" aria-pressed="false">Whole file · ${f.whole.lines.length.toLocaleString()} lines</button>` : ""}</span><button type="button" data-copy>Copy</button>`}</div><div class="fbody"></div></section>`);
  const body = $(".fbody", sec);
  const show = (view) => {
    sec.dataset.view = view;
    $$("[data-view]", sec).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
    if (f.generated) { body.innerHTML = `<div class="genf">Written by the build, not by hand (+${f.add} −${f.del} lines): listed, not shown. Whole: <code>git show ${esc(f.commits[0].sha)} -- ${esc(f.path)}</code></div>`; return; }
    if (view === "whole" && has) { body.innerHTML = wholeRows(f); const first = $(".L.m", body); if (first && body.scrollHeight > body.clientHeight) first.scrollIntoView({ block: "center" }); return; }
    body.innerHTML = f.commits.map((c) => `${f.commits.length > 1 ? `<div class="csub">${esc(c.label)} · ${esc(c.sha)}</div>` : ""}${c.hunks.length ? hunkRows(f, c) : `<div class="genf">No lines to show (a file moved or its mode changed).</div>`}`).join("");
  };
  sec._show = show;
  $$("[data-view]", sec).forEach((b) => b.addEventListener("click", () => show(b.dataset.view)));
  const cb = $("[data-copy]", sec); if (cb) cb.addEventListener("click", () => copyText(sec.dataset.view === "whole" && has ? f.whole.lines.map((l) => cutLine(l)[0]).join("\n") : f.commits.flatMap((c) => c.hunks.flatMap((hk) => [hk.h, ...hk.l.map((l) => cutLine(l)[0])])).join("\n"), cb));
  show("diff");
  return sec;
}
function diffScene(k, { all = false } = {}) {
  const box = h(`<div><div class="dv-top"><span class="c">${k.files.length} file${k.files.length > 1 ? "s" : ""} · <span class="nA">+${k.add}</span> <span class="nD">−${k.del}</span>${k.gen ? ` · ${k.gen} written by the build` : ""}</span><span class="grow"></span><button type="button" data-allwhole>Every file whole</button><button type="button" data-alldiff>Changes only</button></div><nav class="dv-files" aria-label="Files"></nav><div class="files"></div></div>`);
  const nav = $(".dv-files", box), files = $(".files", box);
  k.files.forEach((f, i) => {
    const sec = fileEl(f, k.id, i); files.appendChild(sec);
    const b = h(`<button type="button">${esc(f.path.split("/").pop())}</button>`); b.title = f.path;
    b.addEventListener("click", () => sec.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })); nav.appendChild(b);
  });
  const every = (v) => $$(".file", files).forEach((s) => s._show && s.dataset.view !== undefined && (v === "whole" ? s.querySelector('[data-view="whole"]') && s._show("whole") : s._show("diff")));
  $("[data-allwhole]", box).addEventListener("click", () => every("whole"));
  $("[data-alldiff]", box).addEventListener("click", () => every("diff"));
  if (all) every("whole");
  box._every = every;
  return box;
}

/* ── a run, whole ───────────────────────────────────────────────────────────────────────────────────── */
function colorRun(t) {
  return esc(t).split("\n").map((l) => {
    if (/^\$ /.test(l)) return `<span class="cmd">${l}</span>`;
    if (/^\s*✗|failed|failing|— exit 1|^exit [1-9]/.test(l)) return `<span class="badc">${l}</span>`;
    if (/^\s*✓|all frames clean|^exit 0/.test(l)) return `<span class="okc">${l}</span>`;
    if (/^\s*[△⚠]/.test(l)) return `<span class="warnc">${l}</span>`;
    if (/^\s*(──|▶|◆|◇|\[INFO\]|\[hyperframes\])/.test(l)) return `<span class="dim">${l}</span>`;
    return l; }).join("\n");
}
function mdLite(md, anchorBase, editable) {
  const out = []; let inCode = false, list = false, k = 0, lastRaw = "", prevPara = true;
  const a = () => anchorBase ? ` data-anchor="${esc(anchorBase)} · ¶${++k}" class="sel-only"${editable ? " data-editable" : ""}` : "";
  const inl = (s) => tick(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:]|$)/g, "$1<em>$2</em>");
  const rows = md.split("\n");
  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i]; lastRaw = i ? rows[i - 1] : "";
    if (/^```/.test(raw)) { if (list) { out.push("</ul>"); list = false; } out.push(inCode ? "</pre>" : "<pre>"); inCode = !inCode; continue; }
    if (inCode) { out.push(esc(raw)); continue; }
    const hm = raw.match(/^(#{1,4}) (.*)$/);
    if (hm) { if (list) { out.push("</ul>"); list = false; } const n = Math.min(4, hm[1].length + 1); out.push(`<h${n}>${inl(hm[2])}</h${n}>`); continue; }
    const li = raw.match(/^\s*[-*] (.*)$/) || raw.match(/^\s*\d+\. (.*)$/);
    if (li) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li${a()}>${inl(li[1])}</li>`); continue; }
    if (list && /^\s{2,}\S/.test(raw)) { out[out.length - 1] = out[out.length - 1].replace(/<\/li>$/, ` ${inl(raw.trim())}</li>`); continue; }
    if (list) { out.push("</ul>"); list = false; }
    if (/^> /.test(raw)) { out.push(`<blockquote>${inl(raw.slice(2))}</blockquote>`); continue; }
    if (/^\|/.test(raw)) { out.push(`<p class="mono" style="font-size:12px;white-space:pre-wrap"${a()}>${esc(raw)}</p>`); continue; }
    if (!raw.trim()) continue;
    // a paragraph's hard-wrapped lines are one paragraph
    if (prevPara && out.length && /<\/p>$/.test(out[out.length - 1]) && lastRaw.trim() && !/^(#|>|\||\s*[-*] |\s*\d+\. )/.test(lastRaw)) out[out.length - 1] = out[out.length - 1].replace(/<\/p>$/, ` ${inl(raw)}</p>`);
    else out.push(`<p${a()}>${inl(raw)}</p>`);
  }
  if (list) out.push("</ul>"); return out.join("\n");
}
function runScene(id) {
  const r = G.runs[id]; if (!r) return h(`<div class="q3">This run is not in the page.</div>`);
  if (r.kind === "img") return h(`<figure class="pic" data-anchor="${esc(r.title.replace(/`/g, ""))}"><img src="${r.src}" alt="${esc(r.alt)}" loading="lazy"><figcaption>${tick(r.title)}</figcaption></figure>`);
  return h(`<div><div class="run-h"><b>${tick(r.title)}</b>${r.exit != null ? `<span class="exit ${r.exit ? "nz" : "z"}">exit ${r.exit}</span>` : ""}<span class="meta">${tick(r.meta)}</span></div>
    ${r.kind === "doc" ? `<div class="doc">${mdLite(r.text, `${r.title.replace(/`/g, "")}`)}</div>` : `<pre class="term sel-only" data-anchor="${esc(r.title.replace(/`/g, ""))} · output">${colorRun(r.text)}</pre>`}</div>`);
}

/* ── the data, every row ─────────────────────────────────────────────────────────────────────────────── */
// a row of a table notes from its first cell (or from words selected anywhere in it); a click elsewhere opens it
const quiet = (root) => { new MutationObserver(() => $$("tr[data-anchor] td:not(:first-child)", root).forEach((td) => td.setAttribute("data-no-anchor", ""))).observe(root, { childList: true, subtree: true }); $$("tr[data-anchor] td:not(:first-child)", root).forEach((td) => td.setAttribute("data-no-anchor", "")); return root; };
function segGroup(name, opts, cur, on) {
  const g = h(`<div class="segg" role="group" aria-label="${esc(name)}"></div>`);
  opts.forEach(([v, l]) => { const b = h(`<button type="button" aria-pressed="${v === cur}">${esc(l)}</button>`); b.addEventListener("click", () => { $$("button", g).forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); on(v); }); g.appendChild(b); });
  return g;
}
const DATA = {
  findings: { label: "Every finding", count: () => G.findings.length, render() {
    const st = { video: "system", round: "all", role: "all", kind: "all", q: "" };
    const box = h(`<div><div class="filters"></div><div class="tally"></div><table class="dt"><thead><tr><th>Finding</th><th>Scene</th><th>The phrase</th><th>What the fresh agent said</th><th>Answer</th><th>The author's answer</th></tr></thead><tbody></tbody></table></div>`);
    const fl = $(".filters", box), tb = $("tbody", box), ta = $(".tally", box);
    const n = (v) => G.findings.filter((f) => f.video === v).length;
    fl.append(segGroup("Video", [["system", `System video · ${n("system")}`], ["walkthrough", `This walkthrough · ${n("walkthrough")}`]], st.video, (v) => { st.video = v; draw(); }),
      segGroup("Round", [["all", "All rounds"], [1, "1"], [2, "2"], [3, "3"]], st.round, (v) => { st.round = v; draw(); }),
      segGroup("Who", [["all", "Both"], ["newcomer", "Newcomer"], ["designer", "Designer"]], st.role, (v) => { st.role = v; draw(); }),
      segGroup("Answer", [["all", "Any"], ["fixed", "Fixed"], ["meaning", "Meaning"], ["kept", "Kept"]], st.kind, (v) => { st.kind = v; draw(); }));
    const q = h(`<input type="search" placeholder="Search words, phrases, answers" aria-label="Search findings">`); q.addEventListener("input", () => { st.q = q.value.toLowerCase(); draw(); }); fl.appendChild(q);
    function draw() {
      const rows = G.findings.filter((f) => f.video === st.video && (st.round === "all" || f.round === +st.round) && (st.role === "all" || f.role === st.role) && (st.kind === "all" || f.kind === st.kind) && (!st.q || `${f.phrase} ${f.text} ${f.answer}`.toLowerCase().includes(st.q)));
      const all = G.findings.filter((f) => f.video === st.video), c = (k) => all.filter((f) => f.kind === k).length;
      ta.innerHTML = `showing <b>${rows.length}</b> of ${all.length} · in all: <b>${c("fixed")}</b> fixed, <b>${c("meaning")}</b> a meaning, <b>${c("kept")}</b> kept · click a row for its whole text`;
      tb.innerHTML = rows.map((f) => `<tr data-anchor="finding ${f.video === "system" ? "system video" : "walkthrough"} r${f.round} ${f.id}"><td class="m">${f.id} · r${f.round}<br><span class="q3">${f.role}</span></td><td class="m">${f.scene}</td><td><span class="clamp"><strong>${esc(f.phrase)}</strong></span></td><td><span class="clamp">${tick(f.text)}</span></td><td><span class="kd ${f.kind}">${f.kind}</span></td><td><span class="clamp">${tick(f.answer)}</span></td></tr>`).join("") || `<tr><td colspan="6" class="q3">No finding matches.</td></tr>`;
    }
    tb.addEventListener("click", (e) => { const tr = e.target.closest("tr"); if (tr && !getSelection().toString()) tr.classList.toggle("open"); });
    draw(); return box; } },
  lint: { label: "frame-lint, every video", count: () => G.lint.reduce((s, v) => s + v.frames, 0), render() {
    const fails = G.lint.flatMap((v) => v.fails.map((f) => ({ ...f, video: v.video })));
    return h(`<div><div class="tally"><b>${G.lint.length}</b> videos, <b>${G.lint.reduce((s, v) => s + v.frames, 0)}</b> frames · rule 1 fails <b>${fails.filter((f) => f.rule === 1).length}</b>, rule 5 <b>${fails.filter((f) => f.rule === 5).length}</b> · none of those videos is rebuilt for it (an older video gets it when rebuilt)</div>
      <table class="dt"><thead><tr><th>Video</th><th>Frame</th><th>Rule</th><th>What frame-lint said</th></tr></thead><tbody>${fails.map((f) => `<tr data-anchor="frame-lint ${esc(f.frame)}"><td class="m">${esc(f.video.replace(".reelplanning/plans/", "").replace(".reelplanning/", ""))}</td><td class="m">${esc(f.frame)}</td><td class="m">${f.rule}</td><td>${esc(f.msg)}</td></tr>`).join("")}</tbody></table></div>`); } },
  glossary: { label: "Every meaning", count: () => G.glossary.length, render() {
    const box = h(`<div><div class="filters"><input type="search" placeholder="Filter the meanings" aria-label="Filter meanings"></div><table class="dt"><thead><tr><th>Word</th><th>Meaning</th><th>Where it lives</th></tr></thead><tbody></tbody></table></div>`);
    const inp = $("input", box), tb = $("tbody", box);
    const draw = () => { const q = inp.value.toLowerCase(); tb.innerHTML = G.glossary.filter((g) => !q || `${g.term} ${g.meaning} ${g.also} ${g.screen}`.toLowerCase().includes(q)).map((g) => `<tr data-anchor="meaning: ${esc(g.term)}"><td><strong>${esc(g.term)}</strong>${g.screen ? `<br><span class="q3">on screen: ${esc(g.screen)}</span>` : ""}</td><td>${tick(g.meaning)}</td><td class="m">${esc(g.where)}</td></tr>`).join(""); };
    inp.addEventListener("input", draw); draw(); return box; } },
  specs: { label: "Every spec", count: () => G.testTotals.n, render() {
    const rows = Object.entries(G.specs).sort((a, b) => (a[1].ok - b[1].ok) || a[0].localeCompare(b[0]));
    return h(`<div><div class="tally">npm test, the fast run, in this checkout on 2026-09-28: <b>${G.testTotals.ok}</b> of ${G.testTotals.n} specs passed</div><table class="dt"><thead><tr><th>Spec</th><th>Checks</th><th>Time</th><th>That day</th></tr></thead><tbody>${rows.map(([p, r]) => `<tr data-anchor="${esc(p)}"><td class="m">${esc(p)}</td><td class="m">${r.checks}</td><td class="m">${r.time}</td><td><span class="kd ${r.ok ? "fixed" : "failed"}">${r.ok ? "passed" : "failed"}</span></td></tr>`).join("")}</tbody></table></div>`); } },
};
function choicesTable(rows) {
  const t = h(`<table class="ch"><thead><tr><th>Id</th><th>Step</th><th>Chose</th><th>Instead of</th><th>Why</th><th>Where</th></tr></thead><tbody></tbody></table>`);
  $("tbody", t).innerHTML = rows.map((r) => `<tr data-anchor="choice ${r.id}"><td>${r.id}</td><td>${r.step}</td><td>${(r.chose.match(/\[([^\]]+)\]\s*$/)?.[1] || "").split(/,\s*/).filter(Boolean).map((l) => `<span class="lab">${esc(l)}</span>`).join("")}<span class="clamp c3">${tick(r.chose.replace(/\s*\[([^\]]+)\]\s*$/, "")).trim()}</span></td><td><span class="clamp c3">${tick(r.instead)}</span></td><td><span class="clamp c3">${tick(r.why)}</span></td><td><span class="clamp c3">${tick(r.check)}</span></td></tr>`).join("");
  $("tbody", t).addEventListener("click", (e) => { const tr = e.target.closest("tr"); if (tr && !getSelection().toString()) tr.classList.toggle("open"); });
  return t;
}

/* ── something to do, checked against what happened (prototype v4's, unchanged but for where they sit) ─ */
function sorter({ items, bins, key, reveal }) {
  const root = h(`<div><div class="pool" aria-label="To place"></div><div class="bins" style="--nb:${bins.length}"></div><div class="row"><button class="primary" type="button" data-check>Check against what happened</button><button type="button" data-show>Show me</button><button type="button" data-reset>Start over</button><span class="score" aria-live="polite"></span></div><div data-reveal hidden style="margin-top:16px"></div></div>`);
  const pool = $(".pool", root), binsEl = $(".bins", root), score = $(".score", root);
  const binEls = bins.map((b, i) => { const e = h(`<div class="bin" data-bin="${i}" aria-label="${esc(b)}"><div class="bin-h"><span>${esc(b)}</span><span class="key">${i + 1}</span></div></div>`); binsEl.appendChild(e); return e; });
  let sel = null;
  const cards = items.map((it, i) => { const c = h(`<button class="card" type="button" data-i="${i}">${it.html}</button>`); c._it = it; pool.appendChild(c); return c; });
  const save = () => store.set(key, cards.map((c) => c.dataset.bin ?? ""));
  const place = (c, bi) => { c.classList.remove("right", "wrong", "sel"); $(".truth", c)?.remove(); (bi == null ? pool : binEls[bi]).appendChild(c); c.dataset.bin = bi ?? ""; sel = null; save(); };
  (store.get(key, []) || []).forEach((b, i) => { if (b !== "" && b != null && cards[i]) place(cards[i], +b); });
  cards.forEach((c) => {
    c.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return; const r = c.getBoundingClientRect(), sx = e.clientX, sy = e.clientY; let g = null, over = null;
      const move = (ev) => {
        if (!g && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
        if (!g) { g = c.cloneNode(true); g.classList.add("ghost-card"); g.style.width = r.width + "px"; document.body.appendChild(g); c.classList.add("lifted"); }
        g.style.left = ev.clientX - (sx - r.left) + "px"; g.style.top = ev.clientY - (sy - r.top) + "px";
        const t = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".bin, .pool"); if (over !== t) { over?.classList.remove("hot"); over = t; over?.classList.add("hot"); }
      };
      const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up);
        if (g) { g.remove(); c.classList.remove("lifted"); over?.classList.remove("hot"); if (over) place(c, over.classList.contains("pool") ? null : +over.dataset.bin); c._dragged = true; } };
      addEventListener("pointermove", move); addEventListener("pointerup", up); addEventListener("pointercancel", up);
    });
    c.addEventListener("click", () => { if (c._dragged) { c._dragged = false; return; } cards.forEach((x) => x.classList.toggle("sel", x === c && !c.classList.contains("sel"))); sel = c.classList.contains("sel") ? c : null; });
    c.addEventListener("keydown", (e) => { const n = +e.key; if (n >= 1 && n <= bins.length) { e.preventDefault(); place(c, n - 1); c.focus(); } if (e.key === "0" || e.key === "Backspace") { place(c, null); c.focus(); } });
  });
  binEls.forEach((b, i) => b.addEventListener("click", (e) => { if (sel && !e.target.closest(".card")) place(sel, i); }));
  pool.addEventListener("click", (e) => { if (sel && !e.target.closest(".card")) place(sel, null); });
  const check = (force) => {
    let right = 0;
    cards.forEach((c) => { if (force) place(c, c._it.bin); const ok = c.dataset.bin != null && c.dataset.bin !== "" && +c.dataset.bin === c._it.bin;
      c.classList.toggle("right", ok); c.classList.toggle("wrong", !ok); if (ok) right++;
      $(".truth", c)?.remove(); c.appendChild(h(`<span class="truth"><b>${esc(bins[c._it.bin])}</b> · ${tick(c._it.truth)}</span>`)); });
    const placed = cards.filter((c) => c.dataset.bin != null && c.dataset.bin !== "").length;
    score.className = "score " + (right === cards.length ? "good" : "meh");
    score.textContent = force ? "Every card where it went." : `${right} of ${cards.length} as it happened${placed < cards.length ? ` (${cards.length - placed} not placed)` : ""}.`;
    const rv = $("[data-reveal]", root); rv.hidden = false; rv.innerHTML = ""; if (reveal) rv.appendChild(reveal());
  };
  $("[data-check]", root).addEventListener("click", () => check(false));
  $("[data-show]", root).addEventListener("click", () => check(true));
  $("[data-reset]", root).addEventListener("click", () => { cards.forEach((c) => place(c, null)); score.textContent = ""; $("[data-reveal]", root).hidden = true; });
  return root;
}
const DO = {
  command: { title: "What does the newcomer get?", how: "Drag each thing to where it goes, then check against the brief `fresh-eyes` wrote that day. Or pick a card and press 1 or 2.", el() {
    const I = (t, bin, truth) => ({ html: `<span class="ph">${esc(t)}</span>`, bin, truth });
    return sorter({ key: "cmd", bins: ["In the newcomer's brief", "Never given"], items: [
      I("Each scene's narration, as it is said", 0, "\"the narration of each scene as it is said\""), I("A picture of each scene at rest, through the review page", 0, "\"a picture of the scene at its last moment as the review page shows it\""),
      I("plan.md", 1, "\"not the plan, not the code, not what the author meant\""), I("The glossary, Other words included", 0, "\"the glossary, the meanings this video gives its own words\""),
      I("What viewers were lost on before", 0, "\"## Viewers were lost on these before\": 40 things, from every review in the repo"), I("The code the plan changed", 1, "\"You have nothing else: not the plan, not the code\""),
      I("What the author meant", 1, "\"…not what the author meant\""), I("The designer's findings", 1, "each agent is started with only its own prompt and brief"),
    ], reveal: () => runScene("brief") }); } },
  gate: { title: "Fill in what the build prints", how: "In a scratch copy, round 3 of this walkthrough video's fresh eyes was changed two ways: N1's answer line removed, and G1 answered `kept` with nothing after it. Then `reelplanning build` ran. Fill in the blanks from what the gate checks, then check against the real run.", el() {
    const b = h(`<div></div>`);
    const B = (id, w, ok) => `<input class="blank" data-ok="${esc(ok.join("|"))}" size="${w}" spellcheck="false" autocomplete="off" aria-label="blank ${id}">`;
    b.appendChild(h(`<div class="termx">$ reelplanning build …/walkthrough-video
<span class="dim">△ check-terms           0.5 s  terms: 17 words before their definition, 2 quick checks whose answer was not shown (warnings)
✓ narrate               0.3 s  narrate: 0 line(s) narrated, 13 kept byte for byte, in 0 s → audio_meta.json
  …
✓ finish-project       40.3 s  ◇  Check passed</span>
<span class="badc">✗</span> ${B("stage", 7, ["verify"])}  32.9 s  stopped here (exit ${B("exit", 2, ["1"])}); what it said:
    <span class="dim">── 1/6 lint · ── 2/6 check · ── 3/6 details  (all pass)</span>
    ── ${B("step", 2, ["4"])}/6 fresh eyes
    <span class="badc">✗</span> fresh eyes, round 3: ${B("n", 2, ["2", "two"])} findings not answered: N1 (scene 1) ${B("n1", 12, ["no answer", "not answered", "no answer line", "unanswered", "missing"])}; G1 (scene 7) ${B("g1", 22, ["kept, with no reason", "kept with no reason", "no reason", "kept, no reason", "kept without a reason", "kept with no reason given"])}.
    Answer each under it: \`- Answer: fixed: …\`, \`meaning: …\` or \`kept: &lt;the reason&gt;\`</div>`));
    const row = h(`<div class="row"><button class="primary" type="button">Check against the real run</button><button type="button">Show the real run</button><span class="score" aria-live="polite"></span></div>`); b.appendChild(row);
    const fb = h(`<div hidden style="margin-top:16px"></div>`); b.appendChild(fb);
    const norm = (s) => s.toLowerCase().replace(/[.;:()]/g, "").replace(/\s+/g, " ").trim();
    const check = () => { let r = 0; const bl = $$(".blank", b); bl.forEach((x) => { const ok = x.dataset.ok.split("|").some((a) => norm(a) === norm(x.value) || (norm(x.value).length > 3 && norm(a).includes(norm(x.value)) && norm(x.value).includes("reason"))); x.classList.toggle("right", ok); x.classList.toggle("wrong", !ok); if (ok) r++; });
      const s = $(".score", row); s.className = "score " + (r === bl.length ? "good" : "meh"); s.textContent = `${r} of ${bl.length} as it printed.`; };
    const reveal = () => { fb.hidden = false; fb.innerHTML = ""; fb.appendChild(runScene("build-stops")); };
    const [cb, sb] = $$("button", row);
    cb.addEventListener("click", () => { check(); reveal(); });
    sb.addEventListener("click", () => { $$(".blank", b).forEach((x) => { x.value = x.dataset.ok.split("|")[0]; x.size = Math.max(x.size, x.value.length); }); check(); reveal(); });
    $$(".blank", b).forEach((x) => x.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); }));
    return b; } },
  ask: { title: "Is it on the page already?", how: "Type a phrase from the video. The page looks it up the way the player does before anything is asked: the glossary (Other words too) and the storyboards' `terms:`. It also shows what fresh eyes said about it.", el() {
    const box = h(`<div><div class="askbox"><input type="search" placeholder="e.g. inbox answer" aria-label="A phrase from the video" autocomplete="off"></div>
      <div class="chips">${["inbox answer", "the list", "saved review file", "Before you watch", "stand-in", "4/6", "the library", "Mark"].map((p) => `<button class="chipb" type="button">${esc(p)}</button>`).join("")}</div><div class="ans" aria-live="polite"></div></div>`);
    const inp = $("input", box), ans = $(".ans", box);
    const norm = (s) => s.toLowerCase().replace(/[`"“”]/g, "").replace(/^(the|a|an) /, "").trim();
    const run = () => {
      const q = norm(inp.value); if (!q) { ans.innerHTML = ""; return; }
      const hits = G.glossary.filter((g) => [g.term, ...g.also.split(/,\s*/), g.screen].map(norm).some((t) => t && (t === q || t.split(/\s*\/\s*/).includes(q) || (q.length > 3 && (t.includes(q) || q.includes(t) && t.length > 3)))));
      const fe = G.findings.filter((f) => q.length > 1 && norm(f.phrase).includes(q));
      let html = hits.slice(0, 4).map((g) => `<div class="hit"><div class="w">${esc(g.term)}</div><div class="src">${esc(g.where)}${g.screen ? ` · on screen: ${esc(g.screen)}` : ""}</div><p>${tick(g.meaning)}</p></div>`).join("");
      if (!hits.length) html += `<div class="hit none"><div class="w">No meaning to click for “${esc(inp.value)}”</div><p>So you'd ask (select it anywhere on this page, then Ask). Where the question goes:</p>
        <div class="route"><div><b>Hosted page</b>Claude answers: one <code>sample</code> call, on your click, from the scene, its step and the glossary rows it names (A9)</div><div><b>Your machine</b>The session on <code>review --wait</code> answers with <code>inbox answer</code>, in seconds (A10)</div><div><b>Nobody waiting</b>It goes with your review, kept in <code>questions</code>, answered in the next version (A11)</div></div></div>`;
      if (fe.length) html += `<div class="hit" style="box-shadow:inset 2px 0 0 var(--drop)"><div class="w">Fresh eyes flagged it ${fe.length}×</div><p>${fe.slice(0, 4).map((f) => `<span class="kd ${f.kind}">${f.kind}</span> ${f.video === "system" ? "system video" : "this walkthrough"} · r${f.round} ${f.id}, scene ${f.scene}: ${tick(f.answer.slice(0, 180))}${f.answer.length > 180 ? "…" : ""}`).join("<br>")}</p></div>`;
      ans.innerHTML = html;
    };
    inp.addEventListener("input", run);
    $$(".chipb", box).forEach((c) => c.addEventListener("click", () => { inp.value = c.textContent; run(); inp.focus(); }));
    return box; } },
  frames: { title: "Fix the step 6 frame the owner sent", how: "The frame as its source draws it (walkthroughs-that-help, scene 13). Drag each real line onto a grey bar, and drag the label on the right onto the thing it names; frame-lint's verdict follows. Keys: pick a line and press Enter on a bar; move the label with the arrow keys.", el: frameFix },
  system: { title: "What did the author do with each finding?", how: "Six real findings from the system video's three rounds. Drag each to what you think its author did, then check against their answers. Or pick a card and press 1, 2 or 3.", el() {
    const pick = [["system", 1, "G5"], ["system", 3, "N4"], ["system", 1, "N2"], ["system", 1, "N6"], ["system", 3, "N1"], ["system", 3, "N11"]];
    const bins = ["Fixed", "Given a meaning", "Kept, with a reason"], kb = { fixed: 0, meaning: 1, kept: 2 };
    const items = pick.map(([v, r, id]) => G.findings.find((f) => f.video === v && f.round === r && f.id === id)).filter(Boolean).map((f) => ({
      html: `<span class="meta">${f.id} · round ${f.round} · ${f.role} · scene ${f.scene}</span><span class="ph">“${esc(f.phrase.length > 70 ? f.phrase.slice(0, 68) + "…" : f.phrase)}”</span> ${tick(f.text.length > 150 ? f.text.slice(0, 148) + "…" : f.text)}`,
      bin: kb[f.kind], truth: f.answer }));
    return sorter({ key: "sys", bins, items, reveal: () => h(`<p class="fb">All 93: 17 fixed, 3 given a meaning, 73 kept. Every one is in the data.</p>`) }); } },
};
function frameFix() {
  const W = 1920, H = 760;
  const wrap = h(`<div><div class="fscroll"><div class="fstage"><div class="fscale">
    <div class="k-chip" id="k30-h1" style="left:120px;top:70px">a pause holds you ≥ 5 s</div><div class="k-bl" style="left:520px;top:82px">and</div><div class="k-chip" id="k30-h2" style="left:610px;top:70px">something flagged or said</div>
    <div class="k-open" style="left:130px;top:126px">Open · If the bar is missed</div>
    <div class="k-slab" id="k30-st" style="left:120px;top:160px;width:1100px;height:80px"></div><div class="k-code" style="left:146px;top:188px">reel status · walkthroughs: still accepted without a look</div>
    <div class="k-box" style="left:120px;top:290px;width:1100px;height:100px"></div><div class="k-name" style="left:150px;top:314px;font-size:36px">next plan: drop the walkthrough video?</div><div class="k-chip hot" style="left:900px;top:314px">you approve, or not</div>
    <div class="k-bl" id="k30-yes" style="left:120px;top:440px">if you approve · each plan's row</div>
    <div class="k-fr" style="left:120px;top:480px;width:1100px;height:230px"></div><div class="k-chip" style="left:150px;top:500px">Plan video</div><div class="k-name" style="left:150px;top:570px;font-size:34px">What changed</div>
    <div class="k-line" id="k30-rl0" data-bar style="left:150px;top:640px;width:720px"></div><div class="k-tab" style="left:900px;top:620px;font-size:20px;line-height:32px">Flag</div>
    <div class="k-line" id="k30-rl1" data-bar style="left:150px;top:680px;width:720px"></div><div class="k-tab" style="left:900px;top:660px;font-size:20px;line-height:32px">Flag</div>
    <div class="k-chip" id="k30-s0" style="left:1300px;top:500px">plan video · stays</div><div class="k-chip" id="k30-s1" style="left:1300px;top:570px">code check · stays</div>
    <div class="k-bl k-drag" id="k30-no" tabindex="0" role="button" aria-label="The label: if you don't · nothing changes. Arrow keys move it." style="left:1300px;top:680px">if you don't · nothing changes</div>
    <div class="k-band" hidden style="left:120px;top:120px;width:1100px;height:40px"></div>
  </div></div></div>
  <p class="fb phone-only">The frame scrolls sideways: the label is on its right.</p>
  <div class="tray" aria-label="The real lines (from the redrawn frame)"><button class="piece" type="button" data-t="Save moved to the top">Save moved to the top</button><button class="piece" type="button" data-t="Reviews stored one file a day">Reviews stored one file a day</button></div>
  <div class="row"><button class="primary" type="button" data-rv>Show what was done</button><button type="button" data-rs>Start over</button></div>
  <div class="verdict" aria-live="polite"><div><h5>frame-lint, recomputed here</h5><pre class="flout"></pre></div><div><h5>The designer: what a program can't see</h5><ul class="dsout"></ul></div></div>
  <div data-rvbox hidden style="margin-top:16px"></div></div>`);
  const st = $(".fstage", wrap), sc = $(".fscale", wrap), label = $("#k30-no", wrap), band = $(".k-band", wrap), rv = $("[data-rvbox]", wrap);
  const fit = () => { const s = (st.clientWidth || 800) / W; sc.style.transform = `scale(${s})`; sc._s = s; };
  new ResizeObserver(fit).observe(st); fit();
  const box = (e) => ({ l: e.offsetLeft, t: e.offsetTop, r: e.offsetLeft + e.offsetWidth, b: e.offsetTop + e.offsetHeight });
  const toFrame = (x, y) => { const r = st.getBoundingClientRect(), s = sc._s; return { x: (x - r.left) / s, y: (y - r.top) / s }; };
  function lint() {
    const out = [], bars = $$("[data-bar]", sc).filter((x) => !x.hidden), stand = new Set();
    for (let i = 0; i < bars.length; i++) for (let j = 0; j < bars.length; j++) { if (i === j) continue; const a = box(bars[i]), c = box(bars[j]); if (Math.abs(a.l - c.l) <= 24 && c.t - a.t >= 14 && c.t - a.t <= 60) { stand.add(bars[i]); stand.add(bars[j]); } }
    if (stand.size) out.push(`    ${stand.size} empty bars (${[...stand].map((x) => "#" + x.id).join(", ")}) stand where words go (rule 1: show the thing, never a stand-in) — write the words, or leave the box out`);
    const m = box($("#k30-st", sc)), near = $$(".k-chip,.k-bl,.k-name,.k-small", sc).filter((e) => { const q = box(e); return q.b > m.t - 40 && q.b <= m.t + 4 && q.t < m.t && q.l < m.r && m.l < q.r; });
    band.hidden = !near.length;
    if (near.length) out.push(`    the marked thing data-detail="if-the-bar-is-missed" has ${near.map((e) => e.id ? "#" + e.id : ".k30-small").join(", ")} within 40 px above it, where the player's Open tab goes (rule 5: nothing covers content) — give it 40 px of room above`);
    $(".flout", wrap).textContent = out.length ? `✗ 30-step-5-did-it-work.html\n${out.join("\n")}\n\n1 frame(s) with findings` : "✓ 30-step-5-did-it-work.html\n\nall frames clean";
    const L = box(label), s0 = box($("#k30-s0", sc)), s1 = box($("#k30-s1", sc)), thing = { l: s0.l, t: s0.t, b: s1.b };
    const gapAbove = thing.t - L.b, dx = Math.abs(L.l - thing.l), onThing = dx <= 24 && gapAbove >= 4 && gapAbove <= 44;
    const where = L.t > thing.b ? `${L.t - thing.b} px under the chips it names` : L.b < thing.t ? `${thing.t - L.b} px above the chips${dx > 24 ? `, ${dx} px off their left edge` : ""}` : "on top of the chips";
    $(".dsout", wrap).innerHTML = [
      [!bars.length, bars.length ? `Rule 1: ${bars.length === 1 ? "one grey line still stands for words (frame-lint lets a single bar pass: it could be a rule)" : "two grey lines stand for words"}` : "Rule 1: the lines are the real words"],
      [onThing, onThing ? "Rule 3: the label sits on its column, as “if you approve · each plan's row” does" : `Rule 3: “if you don't · nothing changes” sits ${where}, not on them`],
      [!near.length, near.length ? "Rule 5: the Open tab would cover it" : "Rule 5: the Open tab has its 40 px"],
    ].map(([ok, t]) => `<li><span class="mk ${ok ? "y" : "n"}">${ok ? "✓" : "✗"}</span><span>${esc(t)}</span></li>`).join("");
  }
  let chosen = null; const pieces = $$(".piece", wrap);
  const nearBar = (p) => $$("[data-bar]", sc).filter((x) => !x.hidden).find((x) => { const q = box(x); return p.x >= q.l - 20 && p.x <= q.r + 20 && p.y >= q.t - 34 && p.y <= q.b + 30; });
  const drop = (piece, bar) => { const q = box(bar); bar.hidden = true; sc.appendChild(h(`<div class="k-small" data-placed="${bar.id}" style="left:${q.l}px;top:${q.t - 30}px">${esc(piece.dataset.t)}</div>`)); piece.classList.add("used"); piece.disabled = true; piece.classList.remove("sel"); chosen = null; $$("[data-bar]", sc).forEach((x) => { x.classList.remove("near"); x.removeAttribute("tabindex"); x.removeAttribute("role"); }); lint(); };
  const arm = (piece) => { chosen = piece; pieces.forEach((p) => p.classList.toggle("sel", p === piece)); $$("[data-bar]", sc).filter((x) => !x.hidden).forEach((x) => { x.classList.add("near"); x.tabIndex = 0; x.setAttribute("role", "button"); x.setAttribute("aria-label", "Put the line here"); }); };
  sc.addEventListener("click", (e) => { const bar = e.target.closest("[data-bar]"); if (bar && chosen) drop(chosen, bar); });
  sc.addEventListener("keydown", (e) => { const bar = e.target.closest("[data-bar]"); if (bar && chosen && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); drop(chosen, bar); } });
  pieces.forEach((p) => {
    p.addEventListener("click", () => { if (p._dragged) { p._dragged = false; return; } if (!p.disabled) arm(chosen === p ? null : p); if (chosen !== p) { pieces.forEach((x) => x.classList.remove("sel")); $$("[data-bar]", sc).forEach((x) => x.classList.remove("near")); } });
    p.addEventListener("pointerdown", (e) => {
      if (p.disabled || e.button !== 0) return; const sx = e.clientX, sy = e.clientY; let g = null, target = null;
      const mv = (ev) => { if (!g && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return; if (!g) { g = p.cloneNode(true); g.classList.add("ghost-card"); document.body.appendChild(g); }
        g.style.left = ev.clientX - 20 + "px"; g.style.top = ev.clientY - 16 + "px"; const t = nearBar(toFrame(ev.clientX, ev.clientY)); if (t !== target) { target?.classList.remove("near"); target = t; target?.classList.add("near"); } };
      const upf = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", upf); removeEventListener("pointercancel", upf); if (g) { g.remove(); p._dragged = true; if (target) drop(p, target); } };
      addEventListener("pointermove", mv); addEventListener("pointerup", upf); addEventListener("pointercancel", upf);
    });
  });
  const setPos = (x, y) => { label.style.left = Math.round(Math.max(0, Math.min(W - label.offsetWidth, x))) + "px"; label.style.top = Math.round(Math.max(0, Math.min(H - label.offsetHeight, y))) + "px"; lint(); };
  label.addEventListener("pointerdown", (e) => { if (e.button !== 0) return; e.preventDefault(); label.setPointerCapture(e.pointerId);
    const p0 = toFrame(e.clientX, e.clientY), l0 = label.offsetLeft, t0 = label.offsetTop;
    const mv = (ev) => { const p = toFrame(ev.clientX, ev.clientY); setPos(l0 + p.x - p0.x, t0 + p.y - p0.y); };
    const upf = () => { label.removeEventListener("pointermove", mv); label.removeEventListener("pointerup", upf); label.removeEventListener("pointercancel", upf); };
    label.addEventListener("pointermove", mv); label.addEventListener("pointerup", upf); label.addEventListener("pointercancel", upf); });
  label.addEventListener("keydown", (e) => { const d = e.shiftKey ? 40 : 10, k = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] }[e.key]; if (k) { e.preventDefault(); setPos(label.offsetLeft + k[0], label.offsetTop + k[1]); } });
  $("[data-rs]", wrap).addEventListener("click", () => { $$("[data-placed]", sc).forEach((x) => x.remove()); $$("[data-bar]", sc).forEach((x) => { x.hidden = false; x.classList.remove("near"); }); pieces.forEach((p) => { p.disabled = false; p.classList.remove("used", "sel"); }); chosen = null; label.style.left = "1300px"; label.style.top = "680px"; rv.hidden = true; lint(); });
  $("[data-rv]", wrap).addEventListener("click", () => { rv.hidden = false; rv.innerHTML = ""; rv.appendChild(runScene("lint-step6")); rv.appendChild(h(`<div style="height:14px"></div>`)); rv.appendChild(runScene("lint-redrawn"));
    rv.appendChild(h(`<figure class="pic" style="margin-top:14px"><img src="${G.img.redrawn}" alt="The step 6 frame redrawn by the seven rules" loading="lazy"><figcaption>What was done: the same frame redrawn by the seven rules (the plan video's scene 20). The lines are the real words; the right side is a heading over its sentence, level with “If you approve it”.</figcaption></figure>`)); });
  requestAnimationFrame(lint);
  return wrap;
}

/* ── a kind of change, as a flow: beats to read, and the stage that becomes each one's real thing ───────── */
function stepAnchor(k) { return `step ${k.step} · the plan's words`; }
function beatsOf(k) {
  const out = [];
  const c = k.counts;
  out.push({ key: "map", label: "the change's map", html: `<header data-anchor="${esc(k.name)}">
      <p class="ey">${k.step ? `Step ${k.step} · ` : ""}scene ${k.scene.n} · ${esc(k.short)}</p>
      <h2 class="part-only-hide">${esc(k.name)}</h2>
      <p class="counts"><span><b>${c.files}</b> file${c.files > 1 ? "s" : ""}</span><span class="nA">+${c.add}</span><span class="nD">−${c.del}</span>${c.gen ? `<span>${c.gen} written by the build</span>` : ""}${k.choices.length ? `<span><b>${k.choices.length}</b> choice${k.choices.length > 1 ? "s" : ""}</span>` : ""}${k.specs.map((s) => `<span>${esc(s.name)} ${s.ok == null ? "" : s.ok ? "✓" : "✗"}${s.checks ? ` ${s.checks}` : ""}</span>`).join("")}</p>
    </header>
    <div data-anchor="${esc(k.name)} · in short" class="sel-only">${k.sum.map((l) => `<p>${tick(l)}</p>`).join("")}</div>
    <div class="shas">${k.commits.map((x) => `<span>${esc(x.label)} · ${esc(x.sha)}</span>`).join("")}</div>
    <div class="acts">${watchBtn(k.scene.start)}</div>` });
  out.push({ key: "diff", label: "every line", html: `<h3>Every line of it</h3><p>${c.files} file${c.files > 1 ? "s" : ""}, <span class="nA">+${c.add}</span> <span class="nD">−${c.del}</span>, from <code>git show</code> of the plan's commits: each file open, its changes with ten lines around them, or the whole file with the changed lines marked. Select any lines to note on them or ask.</p><div class="acts"><button class="go dark" type="button" data-allcode>Show all code</button></div>` });
  for (const id of k.runs) { const r = G.runs[id]; if (!r) continue;
    out.push({ key: "run:" + id, label: r.kind === "img" ? "a picture from the run" : r.kind === "doc" ? "a file the run wrote" : "a real run", html: `<h3>${tick(r.title)}</h3>${r.exit != null ? `<p><span class="exit ${r.exit ? "nz" : "z"}">exit ${r.exit}</span></p>` : ""}<p class="q3">${tick(r.meta || "")}</p>` }); }
  if (k.data) { const d = DATA[k.data]; out.push({ key: "data", label: d.label.toLowerCase(), html: `<h3>${esc(d.label)}</h3><p><b>${d.count()}</b> rows, every one, as the files hold them. Filter them in place.</p>` }); }
  if (k.do) { const d = DO[k.do]; out.push({ key: "do", label: "to do", html: `<p class="ey">To do</p><h3>${tick(d.title)}</h3><p>${tick(d.how)}</p>` }); }
  if (k.choices.length) out.push({ key: "choices", label: "the agent's choices", html: `<h3>The agent's choices here</h3><p>${k.choices.length} call${k.choices.length > 1 ? "s" : ""} the plan did not make: what it chose, instead of what, why, and where to check (<code>walkthrough.md</code>).</p>` });
  if (k.stepText) out.push({ key: "plan", label: "the plan's words", html: `<h3>Step ${k.step} in the plan's words</h3><p>${esc(k.stepTitle)}. Select a sentence to comment, suggest an edit, or ask.</p>` });
  return out;
}
function sceneFor(k, key) {
  const box = h(`<div class="in"></div>`);
  if (key === "map") {
    const max = Math.max(1, ...k.files.map((f) => f.add + f.del));
    box.appendChild(h(`<div><ul class="fmap">${k.files.map((f, i) => `<li data-file="${i}" data-anchor="${esc(f.path)}"><span class="p" title="${esc(f.path)}"><bdi>${esc(f.path.includes("/") ? f.path.slice(0, f.path.lastIndexOf("/") + 1) : "")}<b>${esc(f.path.split("/").pop())}</b></bdi></span><span class="bar"><i class="a" style="width:${(f.add / max) * 100}%"></i><i class="d" style="width:${(f.del / max) * 100}%"></i></span><span class="n"><span class="nA">+${f.add}</span> <span class="nD">−${f.del}</span></span>${f.generated ? `<span class="g">written by the build</span>` : ""}</li>`).join("")}</ul><p class="fb">A row opens its lines on the stage.</p></div>`));
    box.addEventListener("click", (e) => { const li = e.target.closest("[data-file]"); if (!li || getSelection().toString()) return; e.stopPropagation(); activate(k.id, "diff"); requestAnimationFrame(() => { const f = document.getElementById(`${k.id}-f${li.dataset.file}`); if (f) f.scrollIntoView({ block: "start" }); }); });
  } else if (key === "diff") { const d = diffScene(k); box.appendChild(d); box._diff = d; }
  else if (key.startsWith("run:")) box.appendChild(runScene(key.slice(4)));
  else if (key === "data") box.appendChild(quiet(DATA[k.data].render()));
  else if (key === "do") box.appendChild(DO[k.do].el());
  else if (key === "choices") box.appendChild(quiet(choicesTable(k.choices)));
  else if (key === "plan") box.appendChild(h(`<div class="plan"><h4>Step ${k.step} — ${esc(k.stepTitle)}</h4>${mdLite(k.stepText, `step ${k.step}`, true)}</div>`));
  return box;
}
const KINDS = new Map();   // id → { el, beats, stage, scenes, active }
function renderKind(k) {
  const beats = beatsOf(k);
  const el = h(`<section class="kind" id="${k.id}" aria-labelledby="${k.id}-h"><div class="widebar"><button type="button" data-flow>Back to the flow</button></div><div class="flow"><div class="beats"></div><div class="stage" aria-live="polite"><div class="slab"><b>${esc(k.name)}</b><span class="what"></span><span class="grow"></span></div></div></div></section>`);
  const bx = $(".beats", el), stage = $(".stage", el), scenes = new Map();
  beats.forEach((b, i) => {
    const art = h(`<article class="beat" data-beat="${esc(b.key)}"${i === 0 ? ` id="${k.id}-h"` : ""}>${b.html}</article>`);
    bx.appendChild(art);
    const sc = h(`<div class="scene${b.key.startsWith("run:") && G.runs[b.key.slice(4)]?.kind === "term" ? "" : ""}" data-scene="${esc(b.key)}" role="region" aria-label="${esc(k.name)}: ${esc(b.label)}"></div>`);
    scenes.set(b.key, { el: sc, beat: art, label: b.label, built: false });
    stage.appendChild(sc);
    art.addEventListener("click", (e) => { if (e.target.closest("button,a,input") || getSelection().toString()) return; activate(k.id, b.key); });
  });
  const st = { k, el, stage, scenes, active: null, flow: $(".flow", el) };
  KINDS.set(k.id, st);
  $("[data-allcode]", el)?.addEventListener("click", () => { el.classList.add("wide"); activate(k.id, "diff"); const s = scenes.get("diff"); s.el.firstChild?._diff?._every("whole"); el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); });
  $("[data-flow]", el).addEventListener("click", () => { el.classList.remove("wide"); const s = scenes.get("diff"); s.el.firstChild?._diff?._every("diff"); scenes.get("diff").beat.scrollIntoView({ block: "center" }); });
  return el;
}
function build(st, key) { const s = st.scenes.get(key); if (!s || s.built) return s; s.built = true; s.el.appendChild(sceneFor(st.k, key)); return s; }
function activate(id, key) {
  const st = KINDS.get(id); if (!st) return; const s = build(st, key); if (!s) return;
  if (st.active === key) return; st.active = key;
  st.scenes.forEach((x, kk) => { x.el.toggleAttribute("data-on", kk === key); x.beat.toggleAttribute("data-on", kk === key); });
  $(".slab .what", st.stage).textContent = `· ${s.label}`;
}

/* one column (a phone, or a narrow panel): each beat's thing sits under it, built as it comes near */
const narrowQ = matchMedia("(max-width: 880px)");
function layout() {
  const inline = narrowQ.matches;
  KINDS.forEach((st) => {
    st.flow.classList.toggle("inline", inline);
    st.scenes.forEach((s) => { if (inline) { if (s.el.parentElement !== s.beat) s.beat.appendChild(s.el); } else if (s.el.parentElement !== st.stage) st.stage.appendChild(s.el); });
  });
}
// the beat being read is the one across the line 45% down the window: the stage shows its thing (one column: the
// things coming near are built)
let ticking = false;
function pick() {
  ticking = false;
  const line = innerHeight * 0.45;
  KINDS.forEach((st) => {
    if (narrowQ.matches) { st.scenes.forEach((s, key) => { const r = s.beat.getBoundingClientRect(); if (r.top < innerHeight * 1.6 && r.bottom > -innerHeight) build(st, key); }); return; }
    let cur = null; for (const [key, s] of st.scenes) if (s.beat.getBoundingClientRect().top <= line) cur = key;
    if (cur && !st.el.classList.contains("wide")) activate(st.k.id, cur);
  });
}
function watchBeats() { pick(); }
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(pick); } }, { passive: true });
addEventListener("resize", () => { if (!ticking) { ticking = true; requestAnimationFrame(pick); } });

/* ── the page ────────────────────────────────────────────────────────────────────────────────────────── */
const app = document.getElementById("app");
const code = (k) => k.counts;
function ledger(ids) {
  const max = Math.max(1, ...ids.map((id) => code(K[id]).add + code(K[id]).del));
  return `<ol class="ledger">${ids.map((id) => { const k = K[id], c = code(k); return `<li data-anchor="${esc(k.name)} · in the ledger"><button class="nm" type="button" data-open="${id}">${esc(k.name)}</button><span class="sh" data-no-anchor>${esc(k.short)}</span><span class="ct" data-no-anchor>${c.files} files · <span class="nA">+${c.add}</span> <span class="nD">−${c.del}</span></span><span class="spark"><i class="a" style="width:${(c.add / max) * 100}%"></i><i class="d" style="width:${(c.del / max) * 100}%"></i></span><button class="lk" type="button" data-watch="${k.scene.start}"><span class="t">${fmt(k.scene.start)}</span></button></li>`; }).join("")}</ol>`;
}
if (FULL) {
  const from = Number(params.get("from"));
  app.appendChild(h(`<header class="gbar"><span class="ey">Guide</span><h1>${esc(G.title)}</h1><button class="lk yours" type="button" data-yours hidden>Yours · <span class="n">0</span></button><a class="back" href="${esc(watchHref(from >= 0 && isFinite(from) && params.has("from") ? from : 0))}"><span class="w">Back to the video</span><span class="s">Video</span>${params.has("from") ? ` <span class="t">${fmt(from)}</span>` : ""}</a><span class="prog"></span></header>`));
  const t = G.totals;
  app.appendChild(h(`<section class="intro" id="what-changed" aria-labelledby="wc-h"><h2 id="wc-h">What changed</h2><p class="sub">${ORDER.length} kinds · ${t.files} files · +${t.add.toLocaleString()} −${t.del.toLocaleString()} written, +${t.gadd.toLocaleString()} −${t.gdel.toLocaleString()} written by the build</p>${ledger(ORDER)}
    <h3 class="moh">The video's moments</h3><div class="moments">${G.scenes.map((s, i) => `<div class="mo"><img src="${G.thumbs[i]}" alt="" data-watch="${s.start}" width="176" height="99"><span class="t">${fmt(s.start)}</span><span class="ti">${esc(s.title)}</span><span class="acts"><button class="lk" type="button" data-watch="${s.start}">Watch this moment</button>${G.moments[i] ? `<button class="lk" type="button" data-open="${G.moments[i]}">See the entire thing</button>` : ""}</span></div>`).join("")}</div></section>`));
  ORDER.forEach((id) => app.appendChild(renderKind(K[id])));
  app.appendChild(h(`<section class="choices" id="choices"><h2>Every choice the agent made</h2><p class="q3">walkthrough.md · ${G.choices.length} rows · the calls the plan did not make</p><div class="filters" id="chf"></div><div id="cht"></div></section>`));
  const stepCat = G.stepKind; let cur = "all";
  const drawCh = () => { const t2 = $("#cht"); t2.innerHTML = ""; t2.appendChild(quiet(choicesTable(G.choices.filter((c) => cur === "all" || stepCat[c.step] === cur)))); };
  $("#chf").appendChild(segGroup("Kind of change", [["all", `All ${G.choices.length}`], ...Object.entries(stepCat).map(([s, c]) => [c, `${K[c].name} · ${G.choices.filter((x) => x.step === +s).length}`])], cur, (v) => { cur = v; drawCh(); }));
  drawCh();
  app.appendChild(h(`<footer class="src"><strong>Made from the repo, nothing typed in.</strong><ul>${G.sources.map((s) => `<li>${tick(s)}</li>`).join("")}</ul></footer>`));
  // the bar's line: how far down the page
  const prog = $(".gbar .prog"); addEventListener("scroll", () => { const m = document.documentElement.scrollHeight - innerHeight; prog.style.width = `${m > 0 ? (scrollY / m) * 100 : 0}%`; }, { passive: true });
  document.documentElement.style.setProperty("--top", "52px");
} else {
  const part = G.part;
  if (part === "what-changed") {
    const ids = ORDER;
    app.appendChild(h(`<section class="intro" aria-label="What changed"><p class="sub">${ids.length} kinds · ${G.totals.files} files · +${G.totals.add.toLocaleString()} −${G.totals.del.toLocaleString()} written, +${G.totals.gadd.toLocaleString()} −${G.totals.gdel.toLocaleString()} written by the build. A kind opens its part; its time plays its scene.</p>${ledger(ids)}</section>`));
    const skill = K.skill; if (skill) app.appendChild(renderKind(skill));
  } else app.appendChild(renderKind(K[part]));
}
layout(); narrowQ.addEventListener?.("change", () => { layout(); watchBeats(); });
KINDS.forEach((st) => { const first = st.scenes.keys().next().value; activate(st.k.id, first); if (narrowQ.matches) st.scenes.forEach((s, key) => key === first && build(st, key)); });
watchBeats();
// a deep link to a part's section, or a section and its beat: #build-gate, #build-gate/diff
const go = () => { const m = location.hash.slice(1).split("/"); const el = m[0] && document.getElementById(m[0]); if (!el) return; setTimeout(() => { const st = KINDS.get(m[0]), b = m[1] && st?.scenes.get(decodeURIComponent(m[1])); if (b && !narrowQ.matches) { b.beat.scrollIntoView({ block: "center" }); activate(m[0], decodeURIComponent(m[1])); } else el.scrollIntoView({ block: "start" }); }, 60); };
addEventListener("hashchange", go); go();
window.RPGuide = { activate, kinds: KINDS, watchHref };
})();
