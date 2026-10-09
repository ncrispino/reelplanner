// A sketch's picture and its changes, in words, for sketch.md and for the partner. The drawing is the person's
// thinking, and much of it is not in boxes and arrows: what a frame holds, what is dashed or red, what a freehand
// stroke circles, what sits beside what, and above all what they changed their mind about (renamed, rerouted,
// erased, moved, restyled). An agent that reads only the final boxes loses all of that.
//
//   describeScene(elements) → markdown lines: frames, shapes, arrows, text, groups, marks, layout
//   sceneChanges(session)   → [{ t, text }]: renames, reroutes, erasures, restorations, restyles, moves
//
// Beyond boxes: an icon from the page's library (packages/sketch/icons.js) is one thing named by its label
// (`database "Orders DB"`), a picture by its file (and an SVG by the words in it), a web embed by its address.

// ---------- colours and styles, as a person would say them ----------
const NAMED = { "#1e1e1e": "black", "#000000": "black", "#ffffff": "white", transparent: null };
function hueName(hex) {
  if (hex in NAMED) return NAMED[hex];
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ""); if (!m) return hex || null;
  const [r, g, b] = m.slice(1).map((h) => parseInt(h, 16) / 255), max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max - min < 0.08) return l > 0.85 ? "white" : l < 0.2 ? "black" : "grey";
  const d = max - min; let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360;
  const name = h < 15 || h >= 345 ? "red" : h < 40 ? "orange" : h < 65 ? "yellow" : h < 170 ? "green" : h < 200 ? "teal" : h < 255 ? "blue" : h < 290 ? "violet" : "pink";
  return l > 0.8 ? `light ${name}` : name;
}
/** "dashed, red, filled light yellow", or "" for a plain black outline */
export function styleOf(e) {
  const out = [];
  if (e.strokeStyle && e.strokeStyle !== "solid") out.push(e.strokeStyle);
  const stroke = e.strokeColor && hueName(e.strokeColor); if (stroke && stroke !== "black") out.push(stroke);
  const fill = e.backgroundColor && e.backgroundColor !== "transparent" && hueName(e.backgroundColor); if (fill) out.push(`filled ${fill}`);
  return out.join(", ");
}
const one = (s) => String(s ?? "").replace(/\s*\n\s*/g, " / ").replace(/\s+/g, " ").trim();
const nameOf = (e) => e ? one(e.label || e.text || e.name || e.image?.name || e.embed) : "";
// what kind of thing it is, in words: an icon by what it shows, a picture, a web embed
const kindOf = (e) => e?.kind === "icon" ? e.icon : e?.kind === "image" ? (e.image?.type === "image/svg+xml" ? "SVG picture" : "picture") : e?.kind === "embeddable" || e?.kind === "iframe" ? "web embed" : e?.kind || "shape";
const quoted = (e) => nameOf(e) ? `"${nameOf(e)}"` : `a ${kindOf(e)}${e?.kind === "freedraw" ? " stroke" : ""} with no label`;
const SHAPES = new Set(["rectangle", "ellipse", "diamond", "image", "icon", "embeddable", "iframe"]);

// an icon's parts (each carries icon and iconGroup) → one element of kind "icon", named by the text in it, where its
// first part was; arrows bound to any part of it now end on it
function collapseIcons(els) {
  const parts = new Map(); for (const e of els) if (e.icon) { const g = e.iconGroup || e.id; parts.set(g, [...(parts.get(g) || []), e]); }
  if (!parts.size) return els;
  const one_ = new Map(), to = new Map();
  for (const [g, ps] of parts) {
    const glyph = ps.filter((p) => p.kind !== "text"), first = glyph[0] || ps[0], bs = ps.map(box);
    const x = Math.min(...bs.map((b) => b.x0)), y = Math.min(...bs.map((b) => b.y0));
    const any = (k) => ps.find((p) => p[k])?.[k];
    const e = { id: first.id, kind: "icon", icon: first.icon, label: ps.filter((p) => p.kind === "text").map((p) => p.text).join(" ") || null,
      x, y, w: Math.max(...bs.map((b) => b.x1)) - x, h: Math.max(...bs.map((b) => b.y1)) - y };
    for (const k of ["strokeStyle", "strokeColor", "backgroundColor"]) if (first[k]) e[k] = first[k];
    for (const k of ["status", "link", "frame"]) if (any(k)) e[k] = any(k);
    const groups = (first.groups || []).filter((x) => x !== g); if (groups.length) e.groups = groups;
    one_.set(g, e); for (const p of ps) to.set(p.id, e.id);
  }
  const out = [], done = new Set();
  for (const e of els) {
    if (e.icon) { const g = e.iconGroup || e.id; if (!done.has(g)) { done.add(g); out.push(one_.get(g)); } continue; }
    out.push(e.from || e.to || e.inside ? { ...e, ...(e.from && { from: to.get(e.from) ?? e.from }), ...(e.to && { to: to.get(e.to) ?? e.to }), ...(e.inside && { inside: to.get(e.inside) ?? e.inside }) } : e);
  }
  return out;
}
const box = (e) => ({ x0: e.x, y0: e.y, x1: e.x + (e.w || 0), y1: e.y + (e.h || 0), cx: e.x + (e.w || 0) / 2, cy: e.y + (e.h || 0) / 2 });

// ---------- the picture ----------
const STATUS = { new: "proposed: new", going: "going away", today: "exists today" };
/** `opts.exists(path)`: whether a linked file is in the repo (sketch.md knows the repo; the partner does not) */
export function describeScene(els = [], opts = {}) {
  els = collapseIcons(els.filter((e) => !e.tagFor));   // a today/new/going tag is told as its thing's status, not as text
  const byId = new Map(els.map((e) => [e.id, e])), lines = [];
  const shapes = els.filter((e) => SHAPES.has(e.kind)), frames = els.filter((e) => e.kind === "frame");
  // a drawn line is a connection like an arrow (a tree's branch, a lane's edge), bound or not; marks are freehand;
  // the arrow from a box to the frame it was opened up into is left out: the frame says that already
  const arrows = els.filter((e) => (e.kind === "arrow" || e.kind === "line") && !e.inside);
  const texts = els.filter((e) => e.kind === "text"), strokes = els.filter((e) => e.kind === "freedraw");
  const linked = (e) => { if (!e.link) return ""; const file = e.link.replace(/[:#].*$/, ""); const ok = !opts.exists || /^https?:/.test(e.link) || opts.exists(file); return `, linked to \`${e.link}\`${ok ? "" : ": no such file in the repo at this commit"}`; };
  const st = (e) => { const s = [styleOf(e), e.status && STATUS[e.status]].filter(Boolean).join(", "); return s || e.link ? ` (${[s, linked(e).slice(2)].filter(Boolean).join(", ")})` : ""; };
  if (frames.length) {
    lines.push("**Frames** (an area they drew around things, with its name)", "");
    for (const f of frames) {
      const kids = els.filter((e) => e.frame === f.id && e.kind !== "freedraw"), from = f.inside && byId.get(f.inside);
      lines.push(`- frame ${quoted(f)}${from ? ` (what is inside ${quoted(from)}, opened up from it)` : ""}: ${kids.length ? kids.map(quoted).join(", ") : "empty"}`);
    }
    lines.push("");
  }
  if (shapes.length) {
    lines.push("**Boxes and shapes**", "");
    // a picture: its file, and an SVG's own words; a web embed: its address
    const inner = (e) => e.image?.words ? ` (the words in it: "${one(e.image.words)}")` : e.embed && nameOf(e) !== one(e.embed) ? ` (showing ${e.embed})` : "";
    for (const e of shapes) lines.push(`- ${kindOf(e)} ${quoted(e)}${st(e)}${inner(e)}`);
    lines.push("");
  }
  if (arrows.length) {
    lines.push("**Arrows**", "");
    // a loose end: what it is near (within 50 px), else nothing
    const nearPoint = (x, y) => { let best = null, d = 50;
      for (const o of [...shapes, ...texts]) { if (!nameOf(o)) continue; const b = box(o), dd = Math.hypot(Math.max(b.x0 - x, x - b.x1, 0), Math.max(b.y0 - y, y - b.y1, 0)); if (dd < d) { d = dd; best = o; } }
      return best; };
    for (const a of arrows) {
      const loose = (x, y) => { if (x == null) return "(nothing: a loose end)"; const n = nearPoint(x, y); return n ? `(a loose end near ${quoted(n)})` : "(nothing: a loose end)"; };
      const end = (id, x, y) => id && byId.get(id) ? quoted(byId.get(id)) : loose(x, y);
      lines.push(`- ${a.kind === "line" ? "line " : ""}${end(a.from, a.start?.[0], a.start?.[1])} → ${end(a.to, a.end?.[0], a.end?.[1])}${a.label ? ` (labeled "${one(a.label)}")` : ""}${st(a)}`);
    }
    lines.push("");
  }
  // loose text: say what it sits next to (a rate by its arrow, a path by its box, a "?" by the thing in doubt)
  const near = (t) => {
    const b = box(t); let best = null, d = Infinity;
    for (const o of [...shapes, ...arrows, ...frames]) { if (!nameOf(o) && o.kind !== "arrow") continue; const x = box(o);
      const dx = Math.max(x.x0 - b.x1, b.x0 - x.x1, 0), dy = Math.max(x.y0 - b.y1, b.y0 - x.y1, 0), dd = Math.hypot(dx, dy);
      if (o.kind === "frame" && dd === 0) continue; if (dd < d) { d = dd; best = o; } }
    return best && d < 90 ? ` (next to ${best.kind === "arrow" ? `the arrow ${end2(best)}` : quoted(best)})` : "";
  };
  const end2 = (a) => { const n = (id) => id && byId.get(id) ? quoted(byId.get(id)) : "nothing"; return `${n(a.from)} → ${n(a.to)}`; };
  if (texts.length) { lines.push("**Text on the canvas**", ""); for (const t of texts) lines.push(`- "${one(t.text)}"${st(t)}${near(t)}`); lines.push(""); }
  // today vs proposed: what they marked as existing, new, or going away
  const marked = els.filter((e) => e.status);
  if (marked.length) {
    lines.push("**Today vs proposed** (as they marked them)", "");
    for (const [k, words] of [["today", "exists today"], ["new", "new: what they propose"], ["going", "going away"]]) { const xs = marked.filter((e) => e.status === k); if (xs.length) lines.push(`- ${words}: ${xs.map((e) => e.kind === "arrow" ? end2(e) : quoted(e)).join(", ")}`); }
    lines.push("");
  }
  const links = els.filter((e) => e.link);
  if (links.length) { lines.push("**Linked to code** (the file each thing is, in their picture)", ""); for (const e of links) lines.push(`- ${e.kind === "arrow" ? `the arrow ${end2(e)}` : quoted(e)} → \`${e.link}\`${linked(e).includes("no such file") ? " (no such file in the repo at this commit)" : ""}`); lines.push(""); }
  // groups: things they tied together
  const groups = new Map(); for (const e of els) for (const g of e.groups || []) groups.set(g, [...(groups.get(g) || []), e]);
  const gl = [...groups.values()].filter((g) => g.length > 1);   // (a tag's own group holds only its thing, once tags are left out)
  if (gl.length) { lines.push("**Grouped together**", ""); for (const g of gl) lines.push(`- ${g.map(quoted).join(", ")}`); lines.push(""); }
  // freehand marks: what they go around, across or under
  const named = [...shapes, ...texts, ...arrows.filter((a) => a.label)];
  if (strokes.length) {
    lines.push("**Freehand marks** (circles, underlines, cross-outs: what each is drawn on)", "");
    for (const s of strokes) {
      const b = box(s), flat = (s.h || 0) < 30 && (s.w || 0) > 40;
      const under = flat ? named.filter((e) => { const x = box(e); return x.y1 <= b.cy + 6 && b.cy - x.y1 < 40 && x.x1 > b.x0 && x.x0 < b.x1; }) : [];
      // around: the thing sits inside the stroke (a circle); across: the stroke only reaches its middle (a cross-out, or a circle's edge)
      const inside = (x) => { const ow = Math.max(0, Math.min(x.x1, b.x1 + 15) - Math.max(x.x0, b.x0 - 15)), oh = Math.max(0, Math.min(x.y1, b.y1 + 15) - Math.max(x.y0, b.y0 - 15));
        return ow * oh >= 0.6 * Math.max(1, (x.x1 - x.x0) * (x.y1 - x.y0)) && (b.x1 - b.x0) * (b.y1 - b.y0) < 6 * Math.max(1, (x.x1 - x.x0) * (x.y1 - x.y0)); };   // not a stroke round half the board
      const around = named.filter((e) => inside(box(e))), across = named.filter((e) => { const x = box(e); return !inside(x) && x.cx >= b.x0 && x.cx <= b.x1 && x.cy >= b.y0 && x.cy <= b.y1; });
      const on = [around.length ? `around ${around.map(quoted).join(", ")}` : "", across.length ? `across ${across.map(quoted).join(", ")}` : ""].filter(Boolean).join("; ");
      lines.push(`- a ${s.kind === "line" ? "line" : "freehand stroke"}${s.label ? ` "${one(s.label)}"` : ""}${st(s)}${under.length ? `: under ${under.map(quoted).join(", ")}` : on ? `: ${on}` : ": on empty space (see the pictures)"}`);
    }
    lines.push("");
  }
  // numbered steps: "1 POST /checkout" on an arrow, a "3" by a box. The numbers are the story's order, which the
  // drawing scatters; gathered in order here, and said when they were drawn in another order
  const STEP = /^\s*(?:step\s*)?[#(]?(\d{1,2})[).:]?(?:\s+|$)/i;
  const numbered = [...arrows, ...texts, ...shapes].map((e, i) => ({ e, i, m: STEP.exec(e.kind === "text" ? e.text || "" : e.label || "") })).filter((x) => x.m);
  if (numbered.length >= 2) {
    const steps = [...numbered].sort((a, b) => Number(a.m[1]) - Number(b.m[1]) || a.i - b.i);
    lines.push("**Numbered steps**, in their numbers' order", "");
    for (const { e, m } of steps) {
      const what = e.kind === "arrow" ? `${end2(e)}${one(e.label).slice(m[0].length) ? ` "${one(e.label).slice(m[0].length).trim()}"` : ""}`
        : e.kind === "text" ? (near(e) ? near(e).replace(/^ \(next to (.*)\)$/, "$1") : `"${one(e.text)}"`) : quoted(e);
      lines.push(`- ${m[1]}: ${what}`);
    }
    const drawn = [...numbered].sort((a, b) => a.i - b.i).map((x) => Number(x.m[1]));
    if (drawn.some((n, i) => i && n < drawn[i - 1])) lines.push("", `_Drawn in another order: ${drawn.join(", ")}._`);
    lines.push("");
  }
  // layout: rows top to bottom, each left to right (position often carries meaning: order, time, lanes, columns)
  const placed = [...shapes, ...texts].filter((e) => nameOf(e)).map((e) => ({ e, ...box(e) })).sort((a, b) => a.cy - b.cy);
  if (placed.length >= 3) {
    const rows = []; for (const p of placed) { const r = rows[rows.length - 1]; if (r && Math.abs(p.cy - r.cy) < 45) { r.items.push(p); r.cy = r.items.reduce((n, x) => n + x.cy, 0) / r.items.length; } else rows.push({ cy: p.cy, items: [p] }); }
    lines.push("**Where things are** (rows top to bottom, each left to right)", "");
    rows.forEach((r, i) => lines.push(`- row ${i + 1}: ${r.items.sort((a, b) => a.cx - b.cx).map((x) => quoted(x.e)).join(", ")}`));
    lines.push("");
  }
  return lines;
}

// ---------- the changes ----------
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
/** What they changed, in order: renamed, rerouted, erased, brought back, restyled, moved. Bursts on one thing merged. */
export function sceneChanges(s) {
  const state = new Map(), labelOf = new Map(), out = [], adds = [];
  // an icon's parts: which icon each belongs to, the part that stands for it, and its label's words
  const iconOf = new Map(), iconRep = new Map(), iconText = new Map();
  const label = (id) => {
    const g = iconOf.get(id); if (g) { const l = iconText.get(g); return l ? `"${one(l)}"` : `a ${state.get(iconRep.get(g))?.icon || "icon"}`; }
    const e = state.get(id); if (!e) return "something"; const l = labelOf.get(id) ?? e.text ?? e.name ?? e.image?.name; return l ? `"${one(l)}"` : `a ${kindOf(e)} with no label`; };
  // one entry per thing changed in a burst: a second change to it within 15 s updates the same entry
  const entry = (t, key, init) => {
    const last = [...out].reverse().find((x) => x.key === key);
    if (last && t - last.t2 < 15) { last.t2 = t; return last; }
    const e = { t, t2: t, key, ...init }; out.push(e); return e;
  };
  // what a moved thing is next to now: the nearest shape, and on which side
  const near = (id) => {
    let best = null, d = Infinity; const me = state.get(id), cx = me.x + (me.w || 0) / 2, cy = me.y + (me.h || 0) / 2;
    for (const [oid, o] of state) { if (oid === id || o.deleted || !SHAPES.has(o.kind) || o.x == null) continue; const ox = o.x + (o.w || 0) / 2, oy = o.y + (o.h || 0) / 2, dd = Math.hypot(ox - cx, oy - cy); if (dd < d) { d = dd; best = { o: oid, dx: cx - ox, dy: cy - oy }; } }
    if (!best) return "";
    const rel = Math.abs(best.dx) > Math.abs(best.dy) ? (best.dx < 0 ? "left of" : "right of") : (best.dy < 0 ? "above" : "below");
    return ` (now ${rel} ${label(best.o)})`;
  };
  for (let ev of s.events || []) {
    if (ev.tagFor || state.get(ev.id)?.tagFor) { state.set(ev.id, { ...state.get(ev.id), ...ev }); continue; }   // a status tag: told as its thing's mark
    // a Mermaid diagram put in: said once (its source is in sketch.md's own section); its boxes come as adds
    if (ev.type === "mermaid") { entry(ev.t, `mm:${ev.t}`, { text: `inserted a Mermaid diagram (\`${one(ev.source).split(" / ")[0]}\`, ${ev.source.split("\n").length - 1 === 1 ? "1 line" : `${ev.source.split("\n").length - 1} lines`}; its source is under **Inserted from Mermaid**)` }); continue; }
    // an icon: its label's words are its name (a rename told as the icon's), and one part stands for the rest
    if (ev.icon || iconOf.has(ev.id)) {
      const g = ev.iconGroup || iconOf.get(ev.id), prevPart = state.get(ev.id); iconOf.set(ev.id, g);
      if ((ev.kind || prevPart?.kind) === "text") {
        const was = iconText.get(g);
        // (its first 6 s: naming the icon just taken from the library, not renaming it)
        if (ev.type === "update" && ev.text != null && was != null && one(was) !== one(ev.text) && (ev.until ?? ev.t) - (state.get(iconRep.get(g))?.addedAt ?? -1e9) > 6) { const e = entry(ev.until ?? ev.t, `ren:${g}`, { was: one(was), what: `the ${state.get(iconRep.get(g))?.icon || "icon"}` }); e.now = one(ev.text); }
        if (ev.text != null && ev.type !== "delete") iconText.set(g, ev.text);
        state.set(ev.id, { ...prevPart, ...ev }); continue;
      }
      if (!iconRep.has(g) || state.get(iconRep.get(g))?.deleted && ev.type === "add") iconRep.set(g, ev.id);
      if (iconRep.get(g) !== ev.id) { state.set(ev.id, { ...prevPart, ...ev, ...(ev.type === "delete" && { deleted: true }) }); continue; }
      if (ev.type !== "delete") ev = { ...ev, kind: "icon" };
    }
    const prev = state.get(ev.id), t = ev.until ?? ev.t;
    if (ev.type === "add") {
      state.set(ev.id, { ...ev, addedAt: ev.t });
      if (ev.in && ev.text != null) {
        // a label given to something drawn a while before: named after the fact ("this arrow is the async one")
        const host = state.get(ev.in);
        if (host && !labelOf.has(ev.in) && ev.t - (host.addedAt ?? ev.t) > 2) entry(ev.t, `lab:${ev.in}`, { text: `labeled ${host.kind === "arrow" ? `the arrow ${arrowName(host)}` : `the ${host.kind}`} "${one(ev.text)}"` });
        labelOf.set(ev.in, ev.text);
      } else if (!(ev.kind === "text" && ev.in)) adds.push({ t: ev.t, id: ev.id, kind: ev.kind });
      if (ev.kind === "frame" && ev.inside) entry(ev.t, `in:${ev.id}`, { text: `opened up ${label(ev.inside)} into a frame to draw what is inside it` });
      continue;
    }
    if (ev.type === "delete") {
      if (!prev) continue;
      const what = prev.kind === "arrow" ? `the arrow ${arrowName(prev)}` : prev.kind === "freedraw" ? "a freehand stroke" : `the ${kindOf(prev)} ${label(ev.id)}`;
      // drawn moments ago: an undo, or a quick change of mind; else an erase of something that stood a while
      if (!(prev.kind === "text" && prev.in)) Object.assign(entry(ev.t, `del:${ev.id}`, { text: ev.t - (prev.addedAt ?? -1e9) <= 15 ? `took back ${what}, drawn moments before` : `erased ${what}` }), { erased: prev.kind, at: ev.t });
      state.set(ev.id, { ...prev, deleted: true }); continue;
    }
    if (ev.type === "restore") { if (!(prev?.kind === "text" && prev.in) && !(ev.kind === "text" && ev.in)) entry(ev.t, `res:${ev.id}`, { text: `brought back ${label(ev.id)} (undo or redo)` }); state.set(ev.id, { ...prev, ...ev, deleted: false }); continue; }
    if (ev.type !== "update" || !prev) continue;
    const cur = { ...prev, ...ev };
    // renamed: a label (text in a container) or a free text whose words changed; first words → last words
    if (ev.text != null && prev.text != null && one(ev.text) !== one(prev.text)) {
      const target = prev.in || ev.id, host = prev.in && state.get(prev.in);
      const what = host ? (host.kind === "arrow" ? "the arrow label" : `the ${host.kind}`) : "the text";
      const e = entry(t, `ren:${target}`, { was: one(prev.text), what }); e.now = one(ev.text);
      if (prev.in) labelOf.set(prev.in, ev.text);
    }
    if ((ev.status || null) !== (prev.status || null) && !ev.tagFor) entry(t, `st:${ev.id}`, { text: ev.status ? `marked ${label(ev.id)} as ${STATUS[ev.status]}` : `took the today/new/going mark off ${label(ev.id)}` });
    if ((ev.link || null) !== (prev.link || null)) entry(t, `ln:${ev.id}`, { text: ev.link ? `linked ${label(ev.id)} to \`${ev.link}\`` : `unlinked ${label(ev.id)}` });
    if (ev.name != null && prev.name != null && ev.name !== prev.name) { const e = entry(t, `fren:${ev.id}`, { was: one(prev.name), what: "the frame" }); e.now = one(ev.name); }
    // rerouted: an arrow's ends now on other things
    if ((prev.kind === "arrow" || prev.kind === "line") && (("from" in ev && ev.from !== prev.from) || ("to" in ev && ev.to !== prev.to) || (!("from" in ev) && prev.from) || (!("to" in ev) && prev.to))) {
      const e = entry(t, `rr:${ev.id}`, { rr: true, was: arrowName(prev) }); e.target = ev.id; state.set(ev.id, cur); e.nowName = arrowName(cur);
    }
    // restyled: dashed, colour, fill
    const sb = styleOf(prev), sa = styleOf(cur);
    if (sa !== sb && prev.kind !== "text") { const e = entry(t, `sty:${ev.id}`, { sty: true, target: ev.id, was: sb || "plain", name: label(ev.id) }); e.now = sa || "plain"; }
    // moved: a shape that went somewhere else (60 px or more), said by what it is next to where it ends up
    // (not in its first 5 s: that is putting it in place, as after a paste or a Mermaid insert, not a change of mind)
    if (SHAPES.has(prev.kind) && ev.x != null && prev.x != null && Math.hypot(ev.x - prev.x, ev.y - prev.y) >= 30 && ev.t - (prev.addedAt ?? -1e9) > 5) {
      const e = entry(t, `mv:${ev.id}`, { mv: true, target: ev.id, name: label(ev.id) });
      state.set(ev.id, cur); e.where = near(ev.id);
    }
    state.set(ev.id, cur);
  }
  // an erase followed soon by a new one of the same kind: a replacement, said on the erase
  const used = new Set();
  for (const x of out.filter((x) => x.erased)) {
    const n = adds.find((a) => a.kind === x.erased && a.t >= x.at && a.t - x.at <= 15 && !used.has(a.id));
    if (n) { used.add(n.id); x.text += `, replaced by a new ${kindOf(state.get(n.id))} ${n.kind === "arrow" ? arrowName(state.get(n.id)) : label(n.id)}`; }
  }
  return out.map((x) => {
    if (x.text) return { t: x.t, text: x.text };
    if (x.rr) return x.was === x.nowName ? null : { t: x.t, text: `rerouted the arrow ${x.was} → now ${x.nowName}` };
    if (x.sty) return x.was === x.now ? null : { t: x.t, text: `restyled ${x.name}: ${x.was} → ${x.now}` };
    if (x.mv) return { t: x.t, text: `moved ${x.name}${x.where}` };
    if (x.was != null) return x.was === x.now ? null : { t: x.t, text: `renamed ${x.what} "${x.was}" → "${x.now}"` };
    return null;
  }).filter(Boolean);

  function arrowName(a) {
    const end = (id) => id && state.get(id) && !state.get(id).deleted ? label(id) : "nothing";
    const l = labelOf.get(a.id);
    return `${l ? `"${one(l)}" ` : ""}(${end(a.from)} → ${end(a.to)})`;
  }
}
export { mmss };
