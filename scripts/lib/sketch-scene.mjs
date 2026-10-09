// A sketch's picture and its changes, in words, for sketch.md and for the partner. The drawing is the person's
// thinking, and much of it is not in boxes and arrows: what a frame holds, what is dashed or red, what a freehand
// stroke circles, what sits beside what, and above all what they changed their mind about (renamed, rerouted,
// erased, moved, restyled). An agent that reads only the final boxes loses all of that.
//
//   describeScene(elements) → markdown lines: frames, shapes, arrows, text, groups, marks, layout
//   sceneChanges(session)   → [{ t, text }]: renames, reroutes, erasures, restorations, restyles, moves

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
const nameOf = (e) => e ? one(e.label || e.text || e.name) : "";
const quoted = (e) => nameOf(e) ? `"${nameOf(e)}"` : `a ${e?.kind || "shape"}${e?.kind === "freedraw" ? " stroke" : ""} with no label`;
const SHAPES = new Set(["rectangle", "ellipse", "diamond", "image"]);
const box = (e) => ({ x0: e.x, y0: e.y, x1: e.x + (e.w || 0), y1: e.y + (e.h || 0), cx: e.x + (e.w || 0) / 2, cy: e.y + (e.h || 0) / 2 });

// ---------- the picture ----------
export function describeScene(els = []) {
  const byId = new Map(els.map((e) => [e.id, e])), lines = [];
  const shapes = els.filter((e) => SHAPES.has(e.kind)), frames = els.filter((e) => e.kind === "frame");
  const arrows = els.filter((e) => e.kind === "arrow" || (e.kind === "line" && (e.from || e.to)));
  const texts = els.filter((e) => e.kind === "text"), strokes = els.filter((e) => e.kind === "freedraw" || (e.kind === "line" && !e.from && !e.to));
  const st = (e) => { const s = styleOf(e); return s ? ` (${s})` : ""; };
  if (frames.length) {
    lines.push("**Frames** (an area they drew around things, with its name)", "");
    for (const f of frames) { const kids = els.filter((e) => e.frame === f.id && e.kind !== "freedraw"); lines.push(`- frame ${quoted(f)}: ${kids.length ? kids.map(quoted).join(", ") : "empty"}`); }
    lines.push("");
  }
  if (shapes.length) {
    lines.push("**Boxes and shapes**", "");
    for (const e of shapes) lines.push(`- ${e.kind} ${quoted(e)}${st(e)}`);
    lines.push("");
  }
  if (arrows.length) {
    lines.push("**Arrows**", "");
    for (const a of arrows) {
      const end = (id) => id && byId.get(id) ? quoted(byId.get(id)) : "(nothing: a loose end)";
      lines.push(`- ${a.kind === "line" ? "line " : ""}${end(a.from)} → ${end(a.to)}${a.label ? ` (labeled "${one(a.label)}")` : ""}${st(a)}`);
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
  // groups: things they tied together
  const groups = new Map(); for (const e of els) for (const g of e.groups || []) groups.set(g, [...(groups.get(g) || []), e]);
  const gl = [...groups.values()].filter((g) => g.length > 1);
  if (gl.length) { lines.push("**Grouped together**", ""); for (const g of gl) lines.push(`- ${g.map(quoted).join(", ")}`); lines.push(""); }
  // freehand marks: what they go around, across or under
  const named = [...shapes, ...texts, ...arrows.filter((a) => a.label)];
  if (strokes.length) {
    lines.push("**Freehand marks** (circles, underlines, cross-outs: what each is drawn on)", "");
    for (const s of strokes) {
      const b = box(s), flat = (s.h || 0) < 30 && (s.w || 0) > 40;
      const under = flat ? named.filter((e) => { const x = box(e); return x.y1 <= b.cy + 6 && b.cy - x.y1 < 40 && x.x1 > b.x0 && x.x0 < b.x1; }) : [];
      const over = named.filter((e) => { const x = box(e); return x.cx >= b.x0 && x.cx <= b.x1 && x.cy >= b.y0 && x.cy <= b.y1; });
      lines.push(`- a ${s.kind === "line" ? "line" : "freehand stroke"}${s.label ? ` "${one(s.label)}"` : ""}${st(s)}${under.length ? `: under ${under.map(quoted).join(", ")}` : over.length ? `: around or across ${over.map(quoted).join(", ")}` : ": on empty space (see the pictures)"}`);
    }
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
  const state = new Map(), labelOf = new Map(), out = [];
  const label = (id) => { const e = state.get(id); if (!e) return "something"; const l = labelOf.get(id) ?? e.text ?? e.name; return l ? `"${one(l)}"` : `a ${e.kind || "shape"} with no label`; };
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
  for (const ev of s.events || []) {
    const prev = state.get(ev.id), t = ev.until ?? ev.t;
    if (ev.type === "add") { state.set(ev.id, { ...ev }); if (ev.in && ev.text != null) labelOf.set(ev.in, ev.text); continue; }
    if (ev.type === "delete") {
      if (!prev) continue;
      if (!(prev.kind === "text" && prev.in)) entry(ev.t, `del:${ev.id}`, { text: `erased ${prev.kind === "arrow" ? `the arrow ${arrowName(prev)}` : prev.kind === "freedraw" ? "a freehand stroke" : `the ${prev.kind} ${label(ev.id)}`}` });
      state.set(ev.id, { ...prev, deleted: true }); continue;
    }
    if (ev.type === "restore") { if (!(prev?.kind === "text" && prev.in) && !(ev.kind === "text" && ev.in)) entry(ev.t, `res:${ev.id}`, { text: `brought back ${label(ev.id)} (undo)` }); state.set(ev.id, { ...prev, ...ev, deleted: false }); continue; }
    if (ev.type !== "update" || !prev) continue;
    const cur = { ...prev, ...ev };
    // renamed: a label (text in a container) or a free text whose words changed; first words → last words
    if (ev.text != null && prev.text != null && one(ev.text) !== one(prev.text)) {
      const target = prev.in || ev.id, host = prev.in && state.get(prev.in);
      const what = host ? (host.kind === "arrow" ? "the arrow label" : `the ${host.kind}`) : "the text";
      const e = entry(t, `ren:${target}`, { was: one(prev.text), what }); e.now = one(ev.text);
      if (prev.in) labelOf.set(prev.in, ev.text);
    }
    if (ev.name != null && prev.name != null && ev.name !== prev.name) { const e = entry(t, `fren:${ev.id}`, { was: one(prev.name), what: "the frame" }); e.now = one(ev.name); }
    // rerouted: an arrow's ends now on other things
    if ((prev.kind === "arrow" || prev.kind === "line") && (("from" in ev && ev.from !== prev.from) || ("to" in ev && ev.to !== prev.to) || (!("from" in ev) && prev.from) || (!("to" in ev) && prev.to))) {
      const e = entry(t, `rr:${ev.id}`, { rr: true, was: arrowName(prev) }); e.target = ev.id; state.set(ev.id, cur); e.nowName = arrowName(cur);
    }
    // restyled: dashed, colour, fill
    const sb = styleOf(prev), sa = styleOf(cur);
    if (sa !== sb && prev.kind !== "text") { const e = entry(t, `sty:${ev.id}`, { sty: true, target: ev.id, was: sb || "plain", name: label(ev.id) }); e.now = sa || "plain"; }
    // moved: a shape that went somewhere else (60 px or more), said by what it is next to where it ends up
    if (SHAPES.has(prev.kind) && ev.x != null && prev.x != null && Math.hypot(ev.x - prev.x, ev.y - prev.y) >= 60) {
      const e = entry(t, `mv:${ev.id}`, { mv: true, target: ev.id, name: label(ev.id) });
      state.set(ev.id, cur); e.where = near(ev.id);
    }
    state.set(ev.id, cur);
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
