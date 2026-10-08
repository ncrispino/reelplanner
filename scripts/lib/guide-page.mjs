// A video's full guide page: every part of the guide on one page, each where its video opens it. A video whose
// guide was built as one page (<video-dir>/guide/index.html) is published as it is; any other video with parts
// (its details/, the pages its beats open) gets this page: its parts in the order the video opens them, each with its title, what it is for, "Watch
// this moment" back to the review page's player at its scene, and the part itself, whole (its height from the
// bridge's "size"). Words selected in a part, or a line clicked, open the same note box as in the player
// (packages/player/guide-review.js): a comment, a suggested edit on plan text, or a question, all in the one review.
//
// Used by bundle-player, which writes it as <slug>/guide/index.html beside the video.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./env.mjs";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (t) => { t = Math.max(0, Math.floor(t || 0)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };
const KIND = { explore: "Explore", try: "Try it", evidence: "Evidence", table: "Table", code: "Code", fresh: "", guide: "" };
const kindOf = (k) => ["Guide", k in KIND ? KIND[k] : k ? String(k).replace(/[-_]+/g, " ").replace(/^./, (c) => c.toUpperCase()) : ""].filter(Boolean).join(" · ");

/** The @font-face rules for the review page's faces (packages/player/fonts/faces.json), their files at `base`. */
export function facesCss(base) {
  const F = JSON.parse(readFileSync(join(ROOT, "packages/player/fonts/faces.json"), "utf8"));
  return F.faces.map((f) => `@font-face{font-family:"${f.family}";src:url("${base}${f.file}") format("woff2");font-weight:${f.weight};font-style:${f.style};font-display:swap;unicode-range:${F.ranges[f.unicodeRange] || f.unicodeRange}}`).join("\n");
}
/** A built guide page's faces, pointed at `base` (the bundle's fonts/). */
export const pointFaces = (html, base) => html.replace(/<style data-rp-faces[^>]*>[\s\S]*?<\/style>/, () => `<style data-rp-faces data-base="${base}">\n${facesCss(base)}\n</style>`);

/** The full guide page of a video with parts but no guide of its own. */
export function guidePage({ map, slug }) {
  const tpl = readFileSync(join(ROOT, "templates/details/fresh.html"), "utf8");
  const base = tpl.match(/<style>\n([\s\S]*?)<\/style>/)[1], theme = tpl.match(/<script>\n\/\* rp-theme:[\s\S]*?<\/script>\n/)[0];
  const review = readFileSync(join(ROOT, "packages/player/guide-review.js"), "utf8");
  // under the review page's player (D-264, ?embed=1): the same embed block as the built guide's, from its template
  const gjs = readFileSync(join(ROOT, "templates/guide/guide.js"), "utf8"), at = gjs.indexOf("/* ── EMBEDDED:"), embed = at >= 0 ? gjs.slice(at) : "";
  const parts = [...(map.details || [])].sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
  const frames = map.frames || [];
  const sec = (d) => { const f = frames.find((x) => x.index === d.frameIndex); const why = String(d.why || "").replace(/^open it (?:to|for)\s+/i, "").replace(/^./, (c) => c.toUpperCase());
    return `<section class="part" id="${esc(d.name)}" data-part="${esc(d.name)}"><header><p class="ey">${esc(kindOf(d.kind))}${d.planStep != null ? ` · step ${d.planStep}` : ""} · scene ${d.frameIndex}${f ? `, ${esc(f.title)}` : ""}</p><h2>${esc(d.title || d.name)}</h2>${why ? `<p class="why">${esc(why)}</p>` : ""}<p class="acts"><a class="go" data-watch="${d.start ?? 0}" href="#">Watch this moment <span class="t">${fmt(d.start)}</span></a></p></header><iframe data-part="${esc(d.name)}" title="${esc(d.title || d.name)}" sandbox="allow-scripts" referrerpolicy="no-referrer" loading="lazy" data-src="../details/${encodeURIComponent(d.name)}.html"></iframe></section>`; };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Guide · ${esc(map.title || slug)}</title>
${theme}<script>(function(){var r=document.documentElement;if(!/[?&#]theme=/.test(location.search+location.hash)&&matchMedia("(prefers-color-scheme: dark)").matches)r.setAttribute("data-theme","dark");})();</script>
<style data-rp-faces data-base="../../fonts/">
${facesCss("../../fonts/")}
</style>
<style>
${base}
body{padding:0;max-width:none}
[hidden]{display:none!important}
.gbar{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;min-height:52px;padding:0 clamp(16px,3vw,44px);background:color-mix(in srgb,var(--paper) 90%,transparent);backdrop-filter:blur(8px);box-shadow:0 1px 0 var(--ink-12)}
.gbar .ey{font:500 12px/1 var(--mono);color:var(--ink-3)}
.gbar h1{margin:0;flex:1 1 auto;min-width:0;font:400 20px/1.2 var(--serif);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gbar .back{flex:none;display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px;border-radius:6px;background:var(--ink);color:var(--paper);font:500 13px/1 var(--sans);text-decoration:none}
.gbar .lk{border:0;padding:0;background:none;color:var(--ink-2);font:500 13px var(--sans);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
main{max-width:1180px;margin:0 auto;padding:36px clamp(16px,3vw,44px) 80px}
.intro h2{margin:0;font:400 clamp(28px,4vw,40px)/1.08 var(--serif)}
.intro p{margin:10px 0 0;color:var(--ink-2)}
.intro ol{margin:18px 0 0;padding:0;list-style:none}
.intro li{display:flex;gap:14px;align-items:baseline;padding:9px 0;border-top:1px solid var(--ink-12)}
.intro li a{font:400 19px/1.25 var(--serif);color:var(--ink);text-decoration:none}
.intro li .t{margin-left:auto;font:500 12px/1 var(--mono);color:var(--ink-3)}
.part{padding-top:56px;scroll-margin-top:56px}
.part header{max-width:760px}
.part .ey{margin:0 0 6px;font:500 12px/1.3 var(--mono);color:var(--ink-3)}
.part h2{margin:0 0 8px;font:400 clamp(26px,3vw,34px)/1.1 var(--serif)}
.part .why{margin:0 0 10px;color:var(--ink-2)}
.go{display:inline-flex;align-items:center;gap:8px;min-height:30px;padding:0 12px;border-radius:6px;border:1px solid var(--ink-20);color:var(--ink);font:500 13px/1 var(--sans);text-decoration:none}
.t{font:500 12px/1 var(--mono);color:var(--ink-3)}
.part iframe{display:block;width:100%;height:420px;margin-top:16px;border:0;border-radius:10px;background:var(--paper);box-shadow:0 0 0 1px var(--ink-12)}
.gbar .back .s{display:none}
@media (max-width:640px){.gbar .ey{display:none}.gbar h1{font-size:17px}.gbar .back .w{display:none}.gbar .back .s{display:inline}}
</style>
</head>
<body>
<header class="gbar"><span class="ey">Guide</span><h1>${esc(map.title || slug)}</h1><button class="lk" type="button" data-yours hidden>Yours · <span class="n">0</span></button><a class="back" data-watch="" href="#"><span class="w">Back to the video</span><span class="s">Video</span></a></header>
<main id="app">
<section class="intro" id="top"><h2>The guide</h2><p>${parts.length} part${parts.length === 1 ? "" : "s"}, each opened from its scene of the video. Select any words in a part to note on them, suggest an edit to plan text, or ask.</p>
<ol>${parts.map((d) => `<li><a href="#${esc(d.name)}">${esc(d.title || d.name)}</a><span class="t">${fmt(d.start)}</span></li>`).join("")}</ol></section>
${parts.map(sec).join("\n")}
</main>
<script>
(function () {
  var q = new URLSearchParams(location.search), slug = ${JSON.stringify(slug)}, theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  var watchHref = function (t) { var at = (Math.max(0, +t || 0) + 0.1).toFixed(2), back = q.get("review"); if (back) { try { var u = new URL(back, location.href); u.searchParams.set("t", at); u.searchParams.delete("part"); return u.href; } catch (e) {} } return "../../index.html?project=" + encodeURIComponent(slug) + "&t=" + at; };
  document.querySelectorAll("[data-watch]").forEach(function (a) { var t = a.getAttribute("data-watch"); a.href = t === "" ? watchHref(+(q.get("from") || 0)) : watchHref(+t); });
  document.querySelectorAll("iframe[data-src]").forEach(function (f) { f.src = f.getAttribute("data-src") + "?theme=" + theme; });
  var go = function () { var el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el) setTimeout(function () { el.scrollIntoView({ block: "start" }); }, 60); };
  addEventListener("hashchange", go); go();
})();
</script>
<script>
${review}
</script>
<script>RPGuideReview.init({ slug: ${JSON.stringify(slug)}, map: "../plan-map.json", root: document.getElementById("app"), frames: true });</script>
${embed ? `<script>\n${embed}\n</script>\n` : ""}</body>
</html>
`;
}
