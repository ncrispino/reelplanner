// A frame file read as a tree, cheaply and without a browser: enough to ask what an element sits
// inside (a real artifact, a camera, a clipped view) and which of the frame's CSS rules reach it.
// Used by frame-lint and check-terms. It is not a full HTML parser: frames are generated, regular
// markup, and anything it cannot place it leaves out rather than guessing.

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
// the elements that start a new line of text on screen; everything else (span, b, i, em, code, a…)
// runs inline, so a wrapped line split over several spans stays one line (check-terms)
export const BLOCK = new Set(["div", "p", "li", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6", "section", "article", "header", "footer",
  "main", "nav", "aside", "figure", "figcaption", "blockquote", "pre", "dl", "dt", "dd", "hr", "td", "th", "tr", "table", "br", "svg", "g", "text"]);

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·", mdash: "—", ndash: "–", rarr: "→", larr: "←", hellip: "…", times: "×", minus: "−" };
export const decode = (s) => String(s).replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENT[e.toLowerCase()] ?? m);

function attrsOf(s) {
  const out = {};
  for (const m of String(s).matchAll(/([^\s=/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  return out;
}

/** The frame as a tree: { tag, attrs, children, parent } elements and { text, parent } text nodes. Script and style bodies are kept as `raw`. */
export function parseHtml(src) {
  const html = String(src).replace(/<!--[\s\S]*?-->/g, "");
  const root = { tag: "#root", attrs: {}, children: [], parent: null };
  let cur = root;
  const re = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
  let last = 0, m;
  while ((m = re.exec(html))) {
    if (m.index > last) { const t = html.slice(last, m.index); if (t) cur.children.push({ text: t, parent: cur }); }
    last = re.lastIndex;
    const [, close, name] = m, tag = name.toLowerCase();
    if (close) {
      // close the nearest open element of that name; a stray closing tag is ignored
      for (let e = cur; e && e !== root; e = e.parent) if (e.tag === tag) { cur = e.parent; break; }
      continue;
    }
    const el = { tag, attrs: attrsOf(m[3]), children: [], parent: cur };
    cur.children.push(el);
    if (tag === "script" || tag === "style") {
      const end = html.indexOf(`</${tag}`, last);
      el.raw = html.slice(last, end < 0 ? html.length : end);
      last = end < 0 ? html.length : html.indexOf(">", end) + 1;
      re.lastIndex = last;
      continue;
    }
    if (!VOID.has(tag) && !/\/\s*$/.test(m[3])) cur = el;
  }
  if (last < html.length) cur.children.push({ text: html.slice(last), parent: cur });
  return root;
}

export function* elements(node) {
  for (const c of node.children || []) if (c.tag) { yield c; yield* elements(c); }
}
export const ancestors = function* (el) { for (let p = el.parent; p && p.tag !== "#root"; p = p.parent) yield p; };
export const classes = (el) => String(el.attrs?.class || "").split(/\s+/).filter(Boolean);

/** The frame's CSS as rules: [{ selector, decls: { prop: value } }], @media and @font-face left out. */
export function cssRules(src) {
  const css = [...String(src).matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
  const out = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim();
    if (selector.startsWith("@")) continue;
    out.push({ selector, decls: declsOf(m[2]) });
  }
  return out;
}
export function declsOf(s) {
  const d = {};
  for (const part of String(s).split(";")) { const i = part.indexOf(":"); if (i > 0) d[part.slice(0, i).trim().toLowerCase()] = part.slice(i + 1).trim(); }
  return d;
}

// does the last compound of a selector (".a .b#c.d" → "b#c.d"-ish) match this element? Enough for
// the class and id rules frames are written with; a pseudo-class or attribute part never matches.
function matchesCompound(el, compound) {
  if (/[:[]/.test(compound)) return false;
  const tag = compound.match(/^[a-zA-Z][\w-]*/)?.[0];
  if (tag && tag.toLowerCase() !== el.tag) return false;
  const cls = classes(el);
  for (const c of compound.matchAll(/\.([\w-]+)/g)) if (!cls.includes(c[1])) return false;
  for (const i of compound.matchAll(/#([\w-]+)/g)) if (el.attrs.id !== i[1]) return false;
  return !!(tag || /[.#]/.test(compound));
}
export const matches = (el, selector) => selector.split(",").some((one) => { const parts = one.trim().split(/\s*[\s>+~]\s*/).filter(Boolean); return parts.length && matchesCompound(el, parts[parts.length - 1]); });

/** An element's own declarations: the rules that reach it, then its style attribute. */
export function styleOf(el, rules) {
  const d = {};
  for (const r of rules) if (matches(el, r.selector)) Object.assign(d, r.decls);
  return Object.assign(d, declsOf(el.attrs?.style || ""));
}

const px = (v) => { const m = String(v ?? "").match(/^(-?[\d.]+)px$/); return m ? +m[1] : null; };
const DOWN = { start: "top", end: "bottom", len: "height", frame: 1080 }, ACROSS = { start: "left", end: "right", len: "width", frame: 1920 };
// where an element's box starts and ends along one axis of the frame, from its own CSS in px and its parents'
function span(el, rules, cache, a) {
  if (!el || el.tag === "#root") return { [a.start]: 0, [a.end]: a.frame };
  if (cache.has(el)) return cache.get(el);
  const parent = span(el.parent, rules, cache, a);
  const s = styleOf(el, rules), room = parent ? parent[a.end] - parent[a.start] : null;
  const inset = /^0(px)?\b/.test(s.inset || "");
  let from = px(s[a.start]) ?? (inset ? 0 : null), len = px(s[a.len]), to = px(s[a.end]) ?? (inset ? 0 : null);
  if (len == null && /^100%$/.test(s[a.len] || "") && room != null) len = room - (from || 0);
  if (len == null && from != null && to != null && room != null) len = room - from - to;
  if (len == null && inset && room != null) len = room;
  let box = null;
  // a wrapper that says nothing of its own place (a <template>, a static div) takes its parent's box
  if (from == null && len == null && to == null && !s[a.len]) box = parent;
  else if (parent && len != null) { const t = parent[a.start] + (from ?? (to != null && room != null ? room - to - len : 0)); box = { [a.start]: t, [a.end]: t + len }; }
  cache.set(el, box);
  return box;
}
/**
 * Where an element's box sits on the 1920×1080 frame, from its top/height/inset/bottom in px and its
 * parents' (transforms left out: those are the timeline's). → { top, bottom } or null when unknown.
 */
export const boxOf = (el, rules, cache = new Map()) => span(el, rules, cache, DOWN);
/** The same across: { left, right } on the 1920-wide frame, from left/width/inset/right in px and its parents'. */
export const hboxOf = (el, rules, cache = new Map()) => span(el, rules, cache, ACROSS);
/**
 * An element's own size in frame pixels, { w, h } (either null when its CSS does not say it): its width and
 * height in px (or what its insets leave of its parent's), plus its padding unless it is border-box. Unlike
 * boxOf, a wrapper that says nothing of its own size is not given its parent's: its size is unknown.
 */
export function ownSize(el, rules) {
  const s = styleOf(el, rules), pad = (k) => px(s[k]) ?? 0, border = /border-box/.test(s["box-sizing"] || "");
  const sides = (() => { const p = String(s.padding || "").trim().split(/\s+/).map((x) => px(x) ?? 0); return p[0] == null || !s.padding ? [0, 0, 0, 0] : [p[0], p[1] ?? p[0], p[2] ?? p[0], p[3] ?? p[1] ?? p[0]]; })();
  const [pt, pr, pb, pl] = [pad("padding-top") || sides[0], pad("padding-right") || sides[1], pad("padding-bottom") || sides[2], pad("padding-left") || sides[3]];
  const inset = /^0(px)?\b/.test(s.inset || "");
  const b = (px(s.height) != null || (px(s.top) != null && px(s.bottom) != null) || inset) ? boxOf(el, rules) : null;
  const hb = (px(s.width) != null || (px(s.left) != null && px(s.right) != null) || inset) ? hboxOf(el, rules) : null;
  const h = px(s.height) != null ? px(s.height) + (border ? 0 : pt + pb) : b ? b.bottom - b.top : null;
  const w = px(s.width) != null ? px(s.width) + (border ? 0 : pl + pr) : hb ? hb.right - hb.left : null;
  return { w, h };
}
/** Clips what it holds: overflow hidden or clip. */
export const clips = (el, rules) => { const s = styleOf(el, rules); return /\b(hidden|clip)\b/.test(`${s.overflow || ""} ${s["overflow-y"] || ""}`); };
