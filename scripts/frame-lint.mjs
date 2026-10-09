#!/usr/bin/env node
// Static checks a frame must pass, cheap enough to run on each frame as it lands instead of finding
// out at render time.
//
// The ones that keep the answer safe while a scene moves (the motion language, better-visuals step 2):
// a camera, or a zoom that could reach y 900, must sit inside a view clipped at 900 px; a question's
// heading (data-question) or card (data-option) inside anything that moves fails unless it is at rest,
// at scale 1, when the scene ends; the mono floor under a camera is counted in screen pixels.
//
// The thing a detail explains (details in the frame, step 1): a data-detail mark fails when it reaches the
// lowest eighth (y ≥ 945), is under 120 × 44 px, or is still moving (it, or a camera it sits in) in its
// scene's last 3 s; two marks of one name fail; one overlapping a data-option card is a note.
//
// A frame a newcomer can read (videos-that-make-sense step 4, the style guide's §5): empty bars standing where words
// go fail (rule 1), and so does anything within 40 px above a data-detail mark, where the player's label goes
// (rule 5).
//
// A screenshot sharp enough (the guide's pictures, 2026-09-30): an image under assets/ drawn wider than half its pixels
// is a note: the snapshots are taken at 2× (the guide shows them on 2× screens), so it is stretched there. Take it at
// deviceScaleFactor 2.
//
// usage: reelplanner frame-lint <project-dir>/compositions/frames/*.html
//        reelplanner frame-lint <frames-dir> | <project-dir>   (every *.html frame in it)
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { parseHtml, elements, ancestors, classes, cssRules, matches, boxOf, hboxOf, ownSize, clips, styleOf, decode } from "./lib/frame-html.mjs";
import { readTimeline, scriptsOf, movesTransform, scalesOf, tweensOn, num } from "./lib/timeline.mjs";
import { rpDirOf, isRpDirName } from "./lib/env.mjs";

let bad = 0, noted = 0;
// id → glossary name, from the nearest .reelplanner/glossary.md above a frame (cached per file)
const glossCache = new Map();
function glossaryFor(file) {
  for (let d = dirname(resolve(file)), i = 0; i < 10 && d !== dirname(d); i++, d = dirname(d)) {
    const g = isRpDirName(basename(d)) ? join(d, "glossary.md") : join(rpDirOf(d), "glossary.md");
    if (!existsSync(g)) continue;
    if (!glossCache.has(g)) glossCache.set(g, new Map([...readFileSync(g, "utf8").matchAll(/^\| ([^|]+?) \| `([^`]+)` \|/gm)].map((m) => [m[2], m[1].trim()])));
    return glossCache.get(g);
  }
  return null;
}
// a frame's length: its root's data-duration, else its storyboard's `- duration:` for it
function durationOf(file, src) {
  const d = src.match(/data-composition-id="[^"]*"[^>]*\bdata-duration="([\d.]+)"|data-duration="([\d.]+)"[^>]*\bdata-composition-id=/);
  if (d) return Number(d[1] ?? d[2]);
  const sb = join(dirname(resolve(file)), "..", "..", "STORYBOARD.md");
  if (!existsSync(sb)) return null;
  for (const b of readFileSync(sb, "utf8").split(/\n(?=## Frame )/)) if (b.includes(`frames/${basename(file)}`)) { const m = b.match(/^- duration:\s*([\d.]+)s/m); if (m) return Number(m[1]); }
  return null;
}
// an image file's pixel size from its header (PNG, JPEG, WebP), or null
function pixelsOf(file) {
  let d; try { d = readFileSync(file); } catch { return null; }
  if (d.length > 24 && d.readUInt32BE(0) === 0x89504e47) return { w: d.readUInt32BE(16), h: d.readUInt32BE(20) };
  if (d.length > 4 && d[0] === 0xff && d[1] === 0xd8) {
    for (let i = 2; i + 9 < d.length;) {
      if (d[i] !== 0xff) { i++; continue; }
      const m = d[i + 1]; if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: d.readUInt16BE(i + 7), h: d.readUInt16BE(i + 5) };
      i += 2 + d.readUInt16BE(i + 2);
    }
    return null;
  }
  if (d.length > 30 && d.toString("ascii", 0, 4) === "RIFF" && d.toString("ascii", 8, 12) === "WEBP") {
    const k = d.toString("ascii", 12, 16);
    if (k === "VP8X") return { w: 1 + d.readUIntLE(24, 3), h: 1 + d.readUIntLE(27, 3) };
    if (k === "VP8L") { const b = d.readUInt32LE(21); return { w: 1 + (b & 0x3fff), h: 1 + ((b >> 14) & 0x3fff) }; }
    if (k === "VP8 ") return { w: d.readUInt16LE(26) & 0x3fff, h: d.readUInt16LE(28) & 0x3fff };
  }
  return null;
}
const selectorsOf = (el) => [...(el.attrs.id ? [`#${el.attrs.id}`] : []), ...classes(el).map((c) => `.${c}`)];

const argv = process.argv.slice(2);
const usage = "usage: reelplanner frame-lint <project-dir>/compositions/frames/*.html | <frames-dir> | <project-dir> [--notes]";
const stop = (msg) => { console.error(`✗ ${msg}\n${usage}`); process.exit(2); };
// a folder stands for the frames in it: a project's compositions/frames/ when it has one (its own
// index.html is not a frame), else the folder's own *.html
const framesIn = (dir) => {
  const fr = join(dir, "compositions", "frames"), from = existsSync(fr) && statSync(fr).isDirectory() ? fr : dir;
  const html = readdirSync(from).filter((n) => n.endsWith(".html")).sort().map((n) => join(from, n)).filter((f) => statSync(f).isFile());
  return html.length ? html : stop(`no frame files (*.html) in ${from}`);
};
const args = argv.filter((a) => !a.startsWith("--"));
if (!args.length) stop("no frame files given");
const files = args.flatMap((a) => {
  if (!existsSync(a)) stop(`no such file or folder: ${a}`);
  return statSync(a).isDirectory() ? framesIn(a) : [a];
});
for (const f of files) {
  const s = readFileSync(f, "utf8");
  const body = s.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  const findings = [], notes = [];
  const tree = parseHtml(s), rules = cssRules(s), timeline = readTimeline(scriptsOf(s)), boxes = new Map();

  // 0. cameras (the motion language): an element the timeline moves or scales that is named as a camera
  //    (data-camera, or a class *-cam / *-camera / *-world), or that zooms (a scale over 1) and could
  //    reach the lowest eighth doing it. Each one's scales, from its initial set and its tweens, give
  //    its smallest (the mono floor below) and where it ends.
  const cameras = new Map();
  for (const el of elements(tree)) {
    const sels = selectorsOf(el); if (!sels.length) continue;
    const tws = tweensOn(timeline, sels), init = timeline.initial.filter((i) => (i.targets || []).some((t) => sels.includes(t)));
    const moved = tws.some(movesTransform) || init.some((i) => ["x", "y", "scale", "scaleX", "scaleY"].some((k) => k in i.props && num(i.props[k]) !== (k.startsWith("scale") ? 1 : 0)));
    if (!moved) continue;
    const scales = scalesOf(timeline, sels);
    const startsAt = init.map((i) => num(i.props.scale)).filter((x) => x != null).at(-1) ?? 1;
    const marked = "data-camera" in el.attrs || classes(el).some((c) => /(?:^|-)(?:cam|camera|world)$/.test(c));
    const zoom = Math.max(1, ...scales);
    let reaches = marked;
    if (!marked && zoom > 1) {
      // an unnamed zoom counts when, grown from any origin, its box could reach y 900 (a pulse on a card up top cannot)
      const b = boxOf(el, rules, boxes);
      reaches = !b || b.bottom + (b.bottom - b.top) * (zoom - 1) > 900;
    }
    if (reaches) cameras.set(el, { sels, min: Math.min(startsAt, ...scales), tws });
  }
  // a camera moves inside a view clipped at 900 px: nothing it carries can be pushed into the lowest eighth
  for (const [el, c] of cameras) {
    const view = [...ancestors(el)].find((a) => clips(a, rules) && boxOf(a, rules, boxes)?.bottom <= 900);
    if (!view) findings.push(`camera ${c.sels[0]} moves outside a view clipped at 900 px — wrap it in one (overflow:hidden, bottom ≤ 900) so nothing reaches the lowest eighth`);
  }
  // a question's heading and its cards: the player measures them where they are when the scene ends,
  // so anything above them that moves must be at rest, at scale 1, by then
  const dur = durationOf(f, s);
  for (const card of [...elements(tree)].filter((e) => "data-question" in e.attrs || "data-option" in e.attrs)) {
    const what = "data-question" in card.attrs ? "a question's heading (data-question)" : `option card ${card.attrs["data-option"]} (data-option)`;
    for (const a of ancestors(card)) {
      const sels = selectorsOf(a); if (!sels.length) continue;
      const tws = tweensOn(timeline, sels).filter(movesTransform);
      if (!tws.length) continue;
      const last = tws.reduce((x, t) => (t.end > x.end ? t : x));
      const scaled = tws.filter((t) => t.to && ["scale", "scaleX", "scaleY"].some((k) => k in t.to) || t.kind === "from" && t.from && "scale" in t.from);
      const endScale = scaled.length ? (() => { const t = scaled.reduce((x, y) => (y.end >= x.end ? y : x)); return t.kind === "from" ? 1 : num(t.to.scale ?? t.to.scaleX ?? t.to.scaleY); })()
        : timeline.initial.filter((i) => (i.targets || []).some((t) => sels.includes(t))).map((i) => num(i.props.scale)).filter((x) => x != null).at(-1) ?? 1;
      if (dur == null) findings.push(`${what} sits inside ${sels[0]}, which moves, and the scene's length is unknown — give the root data-duration`);
      else if (last.end > dur + 0.001) findings.push(`${what} sits inside ${sels[0]}, still moving at the scene's end (${+last.end.toFixed(2)}s of ${dur}s) — bring it to rest before the end, or put the card outside it`);
      else if (endScale == null || Math.abs(endScale - 1) > 0.001) findings.push(`${what} sits inside ${sels[0]}, which ends at scale ${endScale ?? "?"} — end it at scale 1, or put the card outside it`);
    }
  }
  // a pinned word names something on the real thing: outside any data-artifact it is a card again
  for (const g of [...elements(tree)].filter((e) => "data-gloss" in e.attrs)) {
    if (![...ancestors(g)].some((a) => "data-artifact" in a.attrs)) notes.push(`a pinned word (data-gloss="${g.attrs["data-gloss"]}") sits outside any data-artifact: pin it on the real thing it names`);
  }

  // details in the frame (plan 2026-09-27, step 1): the thing a detail explains is marked data-detail="<name>",
  // and the player lays a button over it, so the marked thing has to be one a click can rely on. Measured from
  // the frame's CSS, as the rules above are: a mark whose box the CSS does not say is a note, not a finding.
  const marked = [...elements(tree)].filter((e) => "data-detail" in e.attrs);
  const byName = new Map();
  for (const m of marked) { const n = m.attrs["data-detail"]; byName.set(n, [...(byName.get(n) || []), m]); }
  for (const [n, els] of byName) if (els.length > 1) findings.push(`data-detail="${n}" marks ${els.length} things: mark the one thing its page is about (the player opens the page from one)`);
  const optionBoxes = [...elements(tree)].filter((e) => "data-option" in e.attrs).map((e) => ({ e, v: boxOf(e, rules, boxes), h: hboxOf(e, rules) })).filter((x) => x.v && x.h);
  for (const m of marked) {
    const what = `the marked thing data-detail="${m.attrs["data-detail"]}"`;
    if (!m.attrs["data-detail"]) { findings.push(`a data-detail with no name: it names the storyboard's \`- detail:\` it opens`); continue; }
    const v = boxOf(m, rules, boxes), h = hboxOf(m, rules), size = ownSize(m, rules);
    if (v && v.bottom > 945) findings.push(`${what} reaches the lowest eighth (its bottom at y ${Math.round(v.bottom)}; the answer bar is at y ≥ 945) — keep it above`);
    if (size.w != null && size.h != null) { if (size.w < 120 || size.h < 44) findings.push(`${what} is ${Math.round(size.w)} × ${Math.round(size.h)} px, under 120 × 44 (a tap target) — mark the larger thing it sits on, or give it room`); }
    else notes.push(`${what}: its size is not in its CSS (width and height in px), so it is not measured here; the player skips a thing too small to tap`);
    if (!v) notes.push(`${what}: its place is not in its CSS, so the lowest eighth is not checked for it`);
    // it, or a camera it sits in, at rest at scale 1 for the scene's last 3 s (as a question's cards are when it ends)
    for (const a of [m, ...ancestors(m)]) {
      const sels = selectorsOf(a); if (!sels.length) continue;
      const tws = tweensOn(timeline, sels).filter(movesTransform);
      const init = timeline.initial.filter((i) => (i.targets || []).some((t) => sels.includes(t))).map((i) => num(i.props.scale)).filter((x) => x != null).at(-1);
      if (!tws.length) { if (init != null && Math.abs(init - 1) > 0.001) findings.push(`${what} sits in ${sels[0]}, set at scale ${init} — the player's button needs it at scale 1`); continue; }
      const last = tws.reduce((x, t) => (t.end > x.end ? t : x));
      const scaled = tws.filter((t) => t.to && ["scale", "scaleX", "scaleY"].some((k) => k in t.to) || t.kind === "from" && t.from && "scale" in t.from);
      const endScale = scaled.length ? (() => { const t = scaled.reduce((x, y) => (y.end >= x.end ? y : x)); return t.kind === "from" ? 1 : num(t.to.scale ?? t.to.scaleX ?? t.to.scaleY); })() : init ?? 1;
      const self = a === m ? "" : ` sits in ${sels[0]}, which`;
      if (dur == null) findings.push(`${what}${self || ""} moves, and the scene's length is unknown — give the root data-duration`);
      else if (last.end > dur - 3 + 0.001) findings.push(`${what}${self || ""} is still moving in the scene's last 3 s (until ${+last.end.toFixed(2)}s of ${dur}s) — bring it to rest by ${+(dur - 3).toFixed(2)}s`);
      else if (endScale == null || Math.abs(endScale - 1) > 0.001) findings.push(`${what}${self || ""} ends at scale ${endScale ?? "?"} — end it at scale 1`);
    }
    if (v && h) for (const o of optionBoxes) if ([...ancestors(o.e)].includes(m) || [...ancestors(m)].includes(o.e) || (v.top < o.v.bottom && o.v.top < v.bottom && h.left < o.h.right && o.h.left < h.right))
      notes.push(`${what} overlaps option card ${o.e.attrs["data-option"]}: while the question is up the card answers and the detail's button hides`);
  }

  // A frame a newcomer can read (videos-that-make-sense step 4; the style guide's §5, rules 1 and 5), the parts a
  // program can check from the markup (the designer checks all seven on the picture):
  //   rule 1, show the thing, never a stand-in: empty bars (no text, under 12 px high, over 120 px wide, filled)
  //     standing where words go: two or more in one box with no text, one after another in a box's flow, or stacked
//     one under another (left edges
  //     within 24 px, tops 14 to 60 px apart, as lines of text are). One bar alone is a rule, an underline or a
//     progress bar, and passes.
  //   rule 5, nothing covers content: the player's label ("More in the guide ↓", a faint glyph while paused) sits
  //     just above the thing a detail explains, so the 40 px above a data-detail mark are left clear (no chip, label
  //     or line of another element there).
  const textOf = (el) => (el.text != null ? el.text : (el.children || []).map(textOf).join(""));
  const hasText = (el) => /\S/.test(decode(textOf(el)).replace(/\u00a0/g, " "));
  const pxv = (v) => { const m = String(v ?? "").match(/^(-?[\d.]+)px$/); return m ? +m[1] : null; };
  const widthOf = (el) => { const st = styleOf(el, rules), w = pxv(st.width); if (w != null) return w; const pc = /^([\d.]+)%$/.exec(st.width || ""); const ph = hboxOf(el.parent, rules); if (pc && ph) return (ph.right - ph.left) * Number(pc[1]) / 100; const hb = hboxOf(el, rules); return hb && hb !== hboxOf(el.parent, rules) ? hb.right - hb.left : null; };
  const filled = (st) => { const bg = String(st.background || st["background-color"] || "").trim(); return !!bg && !/^(none|transparent|rgba\([^)]*,\s*0\s*\))$/i.test(bg); };
  const bars = [...elements(tree)].filter((e) => !["script", "style", "svg", "path", "line", "img"].includes(e.tag) && !hasText(e) && ![...elements(e)].length).filter((e) => {
    const st = styleOf(e, rules), h = pxv(st.height), w = widthOf(e);
    return h != null && h > 0 && h < 12 && w != null && w > 120 && filled(st);
  });
  const standIns = new Set();
  const byParent = new Map(); for (const b of bars) byParent.set(b.parent, [...(byParent.get(b.parent) || []), b]);
  for (const [p, bs] of byParent) if (bs.length >= 2 && !hasText(p)) bs.forEach((b) => standIns.add(b));
  // bars one after another in a box, with no place of their own: they flow as lines of text do (a page mock's "lines")
  const isBar = new Set(bars), unplaced = (b) => pxv(styleOf(b, rules).top) == null && pxv(styleOf(b, rules).bottom) == null;
  for (const p of byParent.keys()) { const kids = (p.children || []).filter((c) => c.tag); for (let i = 0; i + 1 < kids.length; i++) if (isBar.has(kids[i]) && isBar.has(kids[i + 1]) && unplaced(kids[i]) && unplaced(kids[i + 1])) { standIns.add(kids[i]); standIns.add(kids[i + 1]); } }
  const placed = bars.map((b) => ({ b, v: boxOf(b, rules, boxes), h: hboxOf(b, rules) })).filter((x) => x.v && x.h).sort((a, b) => a.v.top - b.v.top);
  for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) {
    const a = placed[i], c = placed[j];
    if (Math.abs(a.h.left - c.h.left) <= 24 && c.v.top - a.v.top >= 14 && c.v.top - a.v.top <= 60) { standIns.add(a.b); standIns.add(c.b); }   // spaced like lines of text (an underline under a word's underline is not)
  }
  if (standIns.size) { const ids = [...standIns].map((b) => (b.attrs.id ? `#${b.attrs.id}` : classes(b)[0] ? `.${classes(b)[0]}` : b.tag)); findings.push(`${standIns.size} empty bars (${[...new Set(ids)].slice(0, 4).join(", ")}) stand where words go (rule 1: show the thing, never a stand-in) — write the words, or leave the box out`); }
  // where an element sits: its box from its CSS; for a line of words with a place but no size, one line of its type
  // (its line height, or 1.25 × its size) and about half an em a character across
  const placeOf = (e) => {
    let ev = boxOf(e, rules, boxes), eh = hboxOf(e, rules);
    if (ev === boxOf(e.parent, rules, boxes)) ev = null; if (eh === hboxOf(e.parent, rules)) eh = null;
    if (ev && eh) return { ev, eh };
    const st = styleOf(e, rules), pv = boxOf(e.parent, rules, boxes), ph = hboxOf(e.parent, rules), t = pxv(st.top), l = pxv(st.left), words = decode(textOf(e)).trim();
    const f = /(\d+(?:\.\d+)?)px(?:\s*\/\s*([\d.]+)(px)?)?/.exec(st.font || ""), fs = pxv(st["font-size"]) ?? (f ? +f[1] : null);
    const lh = pxv(st["line-height"]) ?? (f?.[2] ? (f[3] ? +f[2] : +f[2] * fs) : fs ? fs * 1.25 : null);
    if (!ev && t != null && pv && lh) ev = { top: pv.top + t, bottom: pv.top + t + lh };
    if (!eh && l != null && ph && fs && words) eh = { left: ph.left + l, right: ph.left + l + Math.min(words.length * fs * 0.5, 1920) };
    return { ev, eh };
  };
  for (const m of marked) {
    const v = boxOf(m, rules, boxes), h = hboxOf(m, rules); if (!v || !h || !m.attrs["data-detail"]) continue;
    const inside = new Set([m, ...ancestors(m), ...elements(m)]);
    const near = [...elements(tree)].filter((e) => !inside.has(e) && !["script", "style"].includes(e.tag)).filter((e) => {
      // a label, a chip or a line: an element with words of its own, or a filled leaf; never a panel that holds other things
      const own = (e.children || []).some((c) => c.text != null && /\S/.test(c.text)), leaf = ![...elements(e)].length;
      if (!own && !(leaf && filled(styleOf(e, rules)))) return false;
      const { ev, eh } = placeOf(e); if (!ev || !eh) return false;
      return ev.bottom > v.top - 40 && ev.bottom <= v.top + 4 && ev.top < v.top && eh.left < h.right && h.left < eh.right;   // ends in the room above (a background behind the thing is not in it)
    });
    if (near.length) findings.push(`the marked thing data-detail="${m.attrs["data-detail"]}" has ${near.map((e) => (e.attrs.id ? `#${e.attrs.id}` : `.${classes(e)[0] || e.tag}`)).slice(0, 3).join(", ")} within 40 px above it, where the player's label goes (rule 5: nothing covers content) — give it 40 px of room above`);
  }

  // 1. a hex literal breaks dark mode: the theme can no longer recolour it
  const hex = [...body.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0]);
  if (hex.length) findings.push(`${hex.length} hex literal(s): ${[...new Set(hex)].slice(0, 4).join(" ")}`);

  // 2. a tween pointing at an element that is no longer in the markup
  const ids = new Set([...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  const cls = new Set([...s.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));
  // A literal followed by + is a prefix being concatenated ("#f08-step-2-" + id), and a literal with
  // a space is a descendant selector — neither is a whole id, so neither can be checked here.
  for (const m of body.matchAll(/["'`]#([a-zA-Z][\w-]*)["'`](\s*\+)?/g)) {
    if (m[2] || m[1].endsWith("-")) continue;
    if (!ids.has(m[1])) findings.push(`tween targets missing id #${m[1]}`);
  }
  for (const m of body.matchAll(/querySelector(?:All)?\(\s*["'`]\.([\w-]+)/g)) if (!cls.has(m[1])) findings.push(`selector targets missing class .${m[1]}`);

  // 3. one stage a frame: a node graph (a service, its edges carrying real data, style guide §5) or the
  //    pipeline (pages, files, a build), told apart by their own classes, never both
  const oldStage = /class="[^"]*-(?:node|edges)\b/.test(body);
  const newStage = /class="[^"]*-(?:page|file|build)\b/.test(body);
  if (oldStage && newStage) findings.push("both the old node stage and the new pipeline are present");

  // 4. mono never below 26px (docs/design-notes.md) — but a PROTOTYPE is a miniature render of a real page, and the guide
  //    exempts its own content: the 26px floor is for the video's chrome, not for the page being
  //    shown. A label inside a depicted screen is small because the thing it depicts is small; the
  //    viewer reads it as texture with words, not as a tag they must make out.
  //    So the exemption is STRUCTURAL and the markup DECLARES it, rather than the linter guessing
  //    from a class name: a depicted screen is an element carrying `data-plan-component="page"`
  //    (the layout stage's artefact, at whatever size — a card, a phone) or `data-plan-option`
  //    (a decision beat's option mock, which the guide already calls a prototype). A chrome tag outside
  //    one of those is still held to the floor.
  const proto = /page|proto|mock|site-?map|spread|tile|photo|cover|art\b/i;
  const inArtifact = new Set();
  for (const open of body.matchAll(/<div[^>]*(?:data-plan-component="page"|data-plan-option=)[^>]*>/g)) {
    // walk to the matching </div> so we collect only what the card actually contains
    let i = open.index + open[0].length, depth = 1;
    const tag = /<\/?div\b/g; tag.lastIndex = i;
    for (let m; depth > 0 && (m = tag.exec(body)); ) depth += m[0] === "</div" ? -1 : 1, i = m.index + m[0].length;
    for (const c of body.slice(open.index, i).matchAll(/class="([^"]+)"/g)) for (const n of c[1].split(/\s+/)) inArtifact.add(n);
  }
  const depicted = (sel) => sel.split(",").every((one) => (one.match(/\.([\w-]+)/g) || []).some((c) => inArtifact.has(c.slice(1))));
  //    Under a camera the floor is read in SCREEN pixels: a 20 px label inside a camera that never goes
  //    below scale 1.4 shows at 28 px, and a 30 px label in a camera pulled back to 0.6 shows at 18. The
  //    camera's smallest scale is used, since the label may be on screen at any pose.
  for (const r of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (proto.test(r[1]) || depicted(r[1])) continue;
    for (const m of r[2].matchAll(/font:[^;]*?(\d+)px[^;]*?(?:JetBrains|Mono)/g)) {
      const els = [...elements(tree)].filter((e) => matches(e, r[1].trim()));
      const cams = els.map((e) => [...ancestors(e)].find((a) => cameras.has(a)));
      const k = els.length && cams.every(Boolean) ? Math.min(...cams.map((c) => cameras.get(c).min)) : 1;
      const onScreen = Math.round(+m[1] * k * 10) / 10;
      if (onScreen < 26) findings.push(k === 1 ? `mono at ${m[1]}px in ${r[1].trim().slice(0, 40)}` : `mono at ${m[1]}px in ${r[1].trim().slice(0, 40)} shows at ${onScreen}px under a camera at scale ${k}`);
    }
  }

  // 4b. density (richer-review step 5): a newcomer cannot follow a diagram of every part at once.
  //     At most six distinct parts on one frame. A beat whose job IS the whole system (the system
  //     video's cast, a resolved map) says so with data-density="full" on its root and is exempt.
  const parts = new Set([...body.matchAll(/data-plan-component="([^"]+)"/g)].map((m) => m[1]).filter((c) => c !== "page"));
  if (parts.size > 6 && !/data-density="full"/.test(body)) findings.push(`${parts.size} parts on one frame (at most 6; mark a whole-system beat data-density="full")`);

  // 4c. names a newcomer knows (richer-review step 5): a part's label on screen is its glossary name,
  //     not a script or file name. Checked against the nearest .reelplanner/glossary.md; a label that
  //     is neither the name nor a short form of it is a note, since a mock may label things its own way.
  const gloss = glossaryFor(f);
  //     A mock of a file or page the part produces (class *page*, *mock*, *file*, *doc*) is labelled
  //     with that file's name on purpose, and is not a node: it is left alone.
  if (gloss) for (const m of body.matchAll(/data-plan-component="([^"]+)"[^>]*>(?:\s*<(?!\/)[^>]*>)*\s*([^<]{2,60}?)\s*</g)) {
    const name = gloss.get(m[1]); if (!name) continue;
    const tag = body.slice(body.lastIndexOf("<", m.index), m.index + m[0].indexOf(">"));
    if (/class="[^"]*(page|mock|file|doc)[^"]*"/.test(tag)) continue;
    const n = (x) => x.toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
    if (!n(name).includes(n(m[2])) && !n(m[2]).includes(n(name))) notes.push(`"${m[2].trim()}" labels ${m[1]}, whose glossary name is "${name}"`);
    if (/\.(mjs|js|sh|json|md)\b/.test(m[2])) findings.push(`a part labelled with a file name ("${m[2].trim()}"); use its glossary name, "${name}"`);
  }

  // 5. nothing in the caption band
  for (const m of body.matchAll(/top:\s*(\d{3,4})px/g)) if (+m[1] >= 900) findings.push(`element at y ${m[1]} (caption band starts at 900)`);

  // 6. a tween through a layout property re-runs layout, which snaps to integer device pixels; under
  //    the seek-by-frame capture engine that stutters on any ease-out tail. Only transforms and
  //    opacity are safe. A .set() is instantaneous and never tweens through layout, so it is fine.
  const LAYOUT = /\b(height|width|marginTop|marginBottom|marginLeft|marginRight|margin|padding\w*|top|left|right|bottom|letterSpacing|lineHeight|fontSize|gap)\s*:/g;
  const js = (s.match(/<script>([\s\S]*?)<\/script>/g) || []).join("\n").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1");
  const call = /\.(to|from|fromTo)\s*\(/g;
  while (call.exec(js)) {
    let i = call.lastIndex, depth = 1;
    while (i < js.length && depth > 0) { const c = js[i]; if (c === "(") depth++; else if (c === ")") depth--; i++; }
    const text = js.slice(call.lastIndex, i - 1);
    const props = [...new Set([...text.matchAll(LAYOUT)].map((x) => x[1]))];
    // margin / letter-spacing / font-size are what `hyperframes check` rejects outright; width and
    // padding are the same class of hazard but predate this work and the toolchain tolerates them,
    // so they are reported as notes rather than failing the frame.
    const hard = props.filter((x) => /^(margin|letterSpacing|lineHeight|fontSize)/.test(x));
    const soft = props.filter((x) => !hard.includes(x));
    if (hard.length) findings.push(`tween animates layout: ${hard.join(", ")} — use transforms (x/y/scale/opacity)`);
    if (soft.length) notes.push(`tween animates ${soft.join(", ")} (same hazard, tolerated by the toolchain)`);
  }

  // 7. a screenshot drawn wider than half its pixels: soft in the 2× snapshots, the guide's pictures and on a 2× screen
  for (const el of elements(tree)) {
    if (el.tag !== "img") continue;
    const src = decode(el.attrs.src || ""); if (!/^(?:\.\/)?assets\//.test(src)) continue;
    const file = [join(dirname(resolve(f)), "..", "..", src), join(dirname(resolve(f)), src)].find((x) => existsSync(x)); if (!file) continue;
    const px = pixelsOf(file); if (!px) continue;
    let shown = null; for (const e of [el, ...ancestors(el)]) { const w = ownSize(e, rules).w; if (w != null) { shown = w; break; } }
    if (shown != null && px.w < 2 * shown) notes.push(`${src} is ${px.w} px wide and drawn ${Math.round(shown)} px wide: under twice (${Math.round(2 * shown)} px), so it is stretched in the 2× snapshots, the guide and on a 2× screen — take it at deviceScaleFactor 2, or draw it smaller`);
  }

  if (findings.length) { bad++; console.log(`✗ ${basename(f)}`); for (const x of [...new Set(findings)]) console.log(`    ${x}`); }
  else console.log(`✓ ${basename(f)}`);
  for (const x of [...new Set(notes)]) { noted++; if (process.argv.includes("--notes")) console.log(`    note: ${x}`); }
}
console.log(bad ? `\n${bad} frame(s) with findings${noted ? `, ${noted} advisory note(s) — pass --notes to see them` : ""}` : `\nall frames clean${noted ? `, ${noted} advisory note(s) — pass --notes to see them` : ""}`);
process.exit(bad ? 1 : 0);
