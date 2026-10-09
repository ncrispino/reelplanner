// The guide's pages (the plan guide, step 1): one self-contained HTML file each, in the review page's look (its paper,
// three inks and coral, light and dark, from templates/details/fresh.html's token block), everything inline, nothing
// from the network. The full page carries the note box and Ask (packages/player/guide-review.js); a part carries the
// detail bridge (rp-bridge v2), since the player opens it in its sandboxed frame over the video, as it opens a detail.
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { ROOT } from "../env.mjs";
import { facesCss } from "../guide-page.mjs";

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let parts = null;
function assets() {
  if (parts) return parts;
  const tpl = read("templates/details/fresh.html");
  parts = { theme: tpl.match(/<script>\n\/\* rp-theme:[\s\S]*?<\/script>\n/)[0], bridge: tpl.match(/<script>\n\/\* rp-bridge v\d:[\s\S]*?<\/script>\n/)[0], base: tpl.match(/<style>\n([\s\S]*?)<\/style>/)[1],
    css: read("templates/guide/guide.css"), js: read("templates/guide/guide.js"), pics: { css: read("templates/guide/pictures.css"), js: read("templates/guide/pictures.js") }, review: read("packages/player/guide-review.js") };
  return parts;
}

/** A page of the guide: the full page (`part` null) or one part. `fontsBase` is where the review page's faces are, from the page. */
export function guideHtml(data, { part = null, title, fontsBase = null } = {}) {
  const A = assets(), full = !part;
  const D = { ...data, mode: full ? "full" : "part", part, partNames: data.partNames || [] };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ${full ? "The guide" : "A part of the guide"} (the plan guide, plan 2026-09-28-plan-guide). Built by \`reelplanner guide\` from plan.md, the
     ledger, the plan map, walkthrough.md, git and runs/: build it again, never edit it here. Not committed. -->
<title>${esc(title)}</title>
${A.theme}${full ? `<script>(function(){var r=document.documentElement;if(!/[?&#]theme=/.test(location.search+location.hash)&&matchMedia("(prefers-color-scheme: dark)").matches)r.setAttribute("data-theme","dark");})();</script>\n<style data-rp-faces data-base="${esc(fontsBase)}">\n${facesCss(fontsBase)}\n</style>\n` : ""}<style>
${A.base}
${A.css}
${A.pics.css}
</style>
</head>
<body>
<div id="app"></div>
<script type="application/json" id="guide-data">${json(D)}</script>
<script>
${A.pics.js}
</script>
<script>
${A.js}
</script>
${full ? `<script>\n${A.review}\n</script>\n<script>RPGuideReview.init({ slug: ${json(data.slug)}, map: "../plan-map.json", root: document.getElementById("app"), partOf: {} });</script>\n` : A.bridge}</body>
</html>
`;
}

/** Where the review page's faces are, from a guide folder in this checkout (bundle-player points them at the bundle's). */
export const fontsFrom = (outDir) => `${relative(outDir, join(ROOT, "packages/player/fonts")).split("\\").join("/")}/`;
