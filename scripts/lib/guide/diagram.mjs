// The guide's diagrams (D-265: "big thing we are missing is more diagrams"): a small text format an author writes in
// plan.md or walkthrough.md as a fenced ```diagram block, drawn here, at build time, as static SVG: no library at run
// time, no picture file. The labels are real <text> (selectable, so a note can be left on them), coloured by the page's
// own tokens through classes (guide.css), so light and dark come free. Each diagram is drawn twice: `wide` for the
// column under the video (up to about 760 px) and `narrow` for a phone (about 340 px), and the page shows the one that
// fits. The same data gives the diagram in words (its text alternative) and its stages, which the page steps through.
//
//   ```diagram
//   flow: How a guide is built                        the kind and the title: flow, sequence, state or compare
//   plan.md (file) -> model: its steps and cases      an edge: from -> to, then ": " and a short label
//   model -> page: one JSON block | the page is drawn from it in the browser   after " | ", a sentence for the stage
//   git (store) --> built: blame, cached              --> a dashed edge (later, sometimes, optional)
//   reel check -x build: a missing block              -x an edge that stops: the thing is refused there
//   model = The model | scripts/lib/guide/model.mjs   a node's label, and where a click on it goes: a place on the
//   page = The page | #step-1                            page (#id), a file of the change, or a step (step-2)
//   // a comment
//   ```
//
// A node is named by its words; `(file)`, `(store)`, `(person)`, `(check)` or `(page)` after them gives its kind (a
// file's name is set in the code face). In a sequence, each line is a message in order, and `note A: …` (or
// `note A, B: …`) a note over one or two; in a state diagram `[*]` is the start (as a source) or the end (as a target).
// `compare:` holds two flows, each opened by `before: <caption>` and `after: <caption>`: the page toggles them.

const KINDS = new Set(["flow", "sequence", "state", "compare"]);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clean = (s) => String(s || "").replace(/\s+/g, " ").trim();
const plainText = (s) => clean(String(s || "").replace(/`([^`]*)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1"));

// ── text: Inter's widths, roughly (em), a little generous so a label never spills out of its box ──
const NARROW = { " ": 0.27, i: 0.25, l: 0.25, j: 0.27, f: 0.34, t: 0.36, r: 0.38, I: 0.3, ".": 0.27, ",": 0.27, ":": 0.28, ";": 0.28, "'": 0.22, '"': 0.38, "!": 0.3, "|": 0.3, "(": 0.36, ")": 0.36, "[": 0.35, "]": 0.35, "-": 0.44, "/": 0.4, "`": 0.3, "·": 0.3 };
const WIDE = { m: 0.87, w: 0.8, M: 0.9, W: 1.0, "@": 0.95, "%": 0.85, "—": 0.9, "→": 0.9 };
export function textWidth(s, size = 14, { mono = false, bold = false } = {}) {
  const t = String(s); if (mono) return t.length * 0.61 * size;
  let w = 0; for (const c of t) w += NARROW[c] ?? WIDE[c] ?? (/[A-Z]/.test(c) ? 0.7 : /\d/.test(c) ? 0.6 : 0.56);
  return w * size * (bold ? 1.06 : 1.03);
}
/** Words into lines no wider than `max`: a word too long on its own is cut at a slash, a dot or anywhere. */
export function wrap(s, max, size, opt = {}) {
  const words = plainText(s).split(" ").filter(Boolean), lines = []; let cur = "";
  const fits = (x) => textWidth(x, size, opt) <= max;
  const push = (w) => { if (fits(w)) return w; let rest = w; while (!fits(rest)) { let k = rest.length - 1; while (k > 1 && !fits(rest.slice(0, k))) k--; const cut = Math.max(rest.lastIndexOf("/", k), rest.lastIndexOf(".", k), rest.lastIndexOf("-", k)); const at = cut > k / 2 ? cut + 1 : k; lines.push(rest.slice(0, at)); rest = rest.slice(at); } return rest; };
  for (const w of words) { const next = cur ? `${cur} ${w}` : w; if (fits(next)) { cur = next; continue; } if (cur) lines.push(cur); cur = push(w); }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}
/** The widest single word of some words: a node's box is never narrower, so a name (a file's, a command's) is never
 *  cut in two ("walkthrough./md"). */
const widestWord = (s, size, opt = {}) => Math.max(0, ...plainText(s).split(" ").filter(Boolean).map((w) => textWidth(w, size, opt)));
/** As `wrap`, then balanced: the same number of lines at the narrowest width that
 *  keeps it, so the lines are near the same length, and no word left alone on the last line where one more fits there. */
export function balance(s, max, size, opt = {}) {
  const g = wrap(s, max, size, opt); if (g.length < 2) return g;
  const words = plainText(s).split(" ").filter(Boolean);
  // never narrower than the widest word (a word cut in two to balance a line is worse than a ragged edge)
  let lo = Math.min(max, Math.max(...words.map((w) => textWidth(w, size, opt)))) - 0.01, hi = max;
  if (wrap(s, lo, size, opt).length <= g.length) hi = lo;
  else for (let k = 0; k < 16; k++) { const mid = (lo + hi) / 2; if (wrap(s, mid, size, opt).length <= g.length) hi = mid; else lo = mid; }
  let out = wrap(s, hi + 0.01, size, opt);
  const alone = (L) => L.length >= 2 && !L.at(-1).includes(" ") && L.at(-2).includes(" ");
  if (alone(out) && words.length >= 3) {
    // a little wider, the same number of lines, where the last one keeps two words; else one word moved down, when
    // that leaves the line above it at least a quarter as long
    for (let w = hi + 2; w <= max; w += 2) { const L = wrap(s, w, size, opt); if (L.length === out.length && !alone(L)) { out = L; break; } }
    if (alone(out)) {
      const prev = out.at(-2), cut = prev.lastIndexOf(" "), moved = `${prev.slice(cut + 1)} ${out.at(-1)}`, rest = prev.slice(0, cut);
      if (textWidth(moved, size, opt) <= max && textWidth(rest, size, opt) >= textWidth(moved, size, opt) / 4) { out[out.length - 2] = rest; out[out.length - 1] = moved; }
    }
  }
  return out;
}

// ── the format ──
const ARROW = /^(.+?)\s+(-->|->|-x)\s+(.+?)(?:\s*:\s+(.*))?$/;
function nodeRef(raw) {
  let t = clean(raw), shape = null;
  const m = /^(.*?)\s*\((file|store|person|check|page|step)\)$/.exec(t); if (m) { t = m[1].trim(); shape = m[2]; }
  return { id: t, shape };
}
/** A diagram's text → { kind, title, nodes: [{ id, label, shape, link }], edges: [{ from, to, label, text, style, line }], notes, panels, errors } */
export function parseDiagram(src) {
  const lines = String(src || "").replace(/\r\n/g, "\n").split("\n");
  const out = { kind: null, title: "", nodes: [], edges: [], notes: [], panels: null, errors: [] };
  const nodes = new Map();
  const node = (ref, { declared = false } = {}) => {
    const r = typeof ref === "string" ? nodeRef(ref) : ref;
    let n = nodes.get(r.id);
    if (!n) { n = { id: r.id, label: r.id, shape: r.shape, link: null, order: nodes.size, declared }; nodes.set(r.id, n); }
    if (r.shape && !n.shape) n.shape = r.shape;
    return n;
  };
  let panel = null, seq = 0;
  const target = () => panel || out;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i], line = raw.trim();
    if (!line || line.startsWith("//")) continue;
    const head = /^(flow|sequence|state|compare|before|after)\s*:\s*(.*)$/i.exec(line);
    if (head && !out.kind && KINDS.has(head[1].toLowerCase())) { out.kind = head[1].toLowerCase(); out.title = clean(head[2]); if (out.kind === "compare") out.panels = []; continue; }
    if (head && out.kind === "compare" && /^(before|after)$/i.test(head[1])) {
      panel = { side: head[1].toLowerCase(), caption: clean(head[2]), kind: "flow", nodes: [], edges: [], notes: [], _nodes: new Map() };
      out.panels.push(panel); continue;
    }
    if (!out.kind) { out.kind = "flow"; }
    const P = target();
    const nodeIn = (ref, o) => { if (!panel) return node(ref, o); const r = typeof ref === "string" ? nodeRef(ref) : ref; let n = panel._nodes.get(r.id); if (!n) { n = { id: r.id, label: r.id, shape: r.shape, link: null, order: panel._nodes.size }; panel._nodes.set(r.id, n); } if (r.shape && !n.shape) n.shape = r.shape; return n; };
    const def = /^(.+?)\s+=\s+(.+)$/.exec(line);
    if (def && !ARROW.test(def[1])) {
      const n = nodeIn(def[1], { declared: true }); const [label, link] = def[2].split(/\s+\|\s+/);
      const lr = nodeRef(label); n.label = lr.id; if (lr.shape) n.shape = lr.shape; if (link) n.link = link.trim();
      continue;
    }
    const note = /^note\s+(.+?)\s*:\s+(.+)$/i.exec(line);
    if (note && out.kind === "sequence") { const over = note[1].split(/\s*,\s*/).map((x) => nodeIn(x).id); P.notes.push({ over, text: clean(note[2]), at: seq++, line: i + 1 }); continue; }
    const m = ARROW.exec(line);
    if (m) {
      const [lab, text] = String(m[4] || "").split(/\s+\|\s+/);
      const from = nodeIn(m[1]), to = nodeIn(m[3]);
      P.edges.push({ from: from.id, to: to.id, label: clean(lab), text: clean(text), style: m[2] === "-->" ? "dash" : m[2] === "-x" ? "stop" : "solid", at: seq++, line: i + 1 });
      continue;
    }
    out.errors.push(`line ${i + 1}: "${line.slice(0, 60)}" is not an edge (a -> b: label), a node (id = label | link) or a note`);
  }
  out.nodes = [...nodes.values()];
  if (out.panels) for (const p of out.panels) { p.nodes = [...p._nodes.values()]; delete p._nodes; }
  if (!out.kind) out.kind = "flow";
  if (out.kind === "compare" && (!out.panels || out.panels.length < 2)) out.errors.push("compare: needs a `before:` and an `after:`");
  if (out.kind !== "compare" && !out.edges.length && !out.notes.length) out.errors.push("no edges: write one per line, `a -> b: what passes`");
  return out;
}

// ── a layered layout (flow, state): ranks by longest path, a point per rank for a long edge, crossings cut by
//    ordering each rank by its neighbours' places, then placed left to right (LR) or top to bottom (TB) ──
function layered(g, { dir, font, maxW, labelMax, labelFont, fanMax = 140, rankGap = 64, nodeGap = 16 }) {
  const used = new Set(g.edges.flatMap((e) => [e.from, e.to]));
  const N = g.nodes.filter((n) => used.has(n.id)).map((n) => ({ ...n })), byId = new Map(N.map((n) => [n.id, n]));
  const isStart = (n) => n.id === "[*]" && g.edges.some((e) => e.from === "[*]");
  const E0 = [];
  for (const e of g.edges.filter((x) => x.from !== x.to)) {
    const same = E0.find((x) => x.from === e.from && x.to === e.to && x.style === e.style);
    if (same) { same.ats.push(e.at); if (e.label) same.label = same.label ? `${same.label}; ${e.label}` : e.label; } else E0.push({ ...e, ats: [e.at] });
  }
  // a state diagram's [*]: the start where it is a source, a second node, the end, where it is a target
  if (byId.has("[*]") && E0.some((e) => e.to === "[*]")) {
    const end = { id: "[*]end", label: "", shape: "end", order: N.length }; N.push(end); byId.set(end.id, end);
    for (const e of E0) if (e.to === "[*]") e.to = "[*]end";
  }
  for (const n of N) { if (n.id === "[*]") n.shape = "start"; if (n.id === "[*]" && !isStart(n) && !g.edges.some((e) => e.from === "[*]")) n.shape = "end"; }
  const mono = (n) => n.shape === "file";
  for (const n of N) {
    if (n.shape === "start" || n.shape === "end") { n.w = n.h = 18; n.lines = []; continue; }
    const f = mono(n) ? font - 0.5 : font, opt = { mono: mono(n), bold: false };
    n.lines = balance(n.label, Math.max(maxW - 24, widestWord(n.label, f, opt) + 0.5), f, opt); n.font = f;
    // a node that opens something carries a small ↗ after its words (never an underline)
    const lk = n.link ? textWidth("↗", f * 0.8) + 4 : 0;
    n.w = Math.max(64, Math.ceil(Math.max(...n.lines.map((l, i) => textWidth(l, f, opt) + (i === n.lines.length - 1 ? lk : 0))) + 26));
    n.h = Math.ceil(n.lines.length * f * 1.28 + 18);
  }
  // cycles: a depth-first walk in the order written; an edge back to a node on the walk is drawn backwards
  const out = new Map(N.map((n) => [n.id, []])); E0.forEach((e, k) => out.get(e.from)?.push(k));
  const state = new Map(), back = new Set();
  const walk = (id) => { state.set(id, 1); for (const k of out.get(id) || []) { const t = E0[k].to; if (state.get(t) === 1) back.add(k); else if (!state.get(t)) walk(t); } state.set(id, 2); };
  for (const n of [...N].sort((a, b) => a.order - b.order)) if (!state.get(n.id)) walk(n.id);
  const dag = E0.map((e, k) => (back.has(k) ? { from: e.to, to: e.from, k, rev: true } : { from: e.from, to: e.to, k, rev: false }));
  // ranks: the longest path to each node
  const rank = new Map(N.map((n) => [n.id, 0]));
  for (let pass = 0; pass < N.length + 1; pass++) { let moved = false; for (const e of dag) { const r = rank.get(e.from) + 1; if (rank.get(e.to) < r) { rank.set(e.to, r); moved = true; } } if (!moved) break; }
  // a node with only outgoing edges sits just before its first target, not at rank 0 far away
  for (const n of N) { const outs = dag.filter((e) => e.from === n.id), ins = dag.filter((e) => e.to === n.id); if (!ins.length && outs.length) rank.set(n.id, Math.max(rank.get(n.id), Math.min(...outs.map((e) => rank.get(e.to))) - 1)); }
  const R = Math.max(0, ...rank.values()) + 1, layers = Array.from({ length: R }, () => []);
  for (const n of [...N].sort((a, b) => a.order - b.order)) layers[rank.get(n.id)].push(n);
  // long edges: a point in each rank they cross. An edge drawn backwards (a loop back, a feedback) takes no point: it goes
  // round the outside of everything it spans (below), not through the ranks
  const chains = dag.filter((e) => !e.rev).map((e) => {
    const pts = [byId.get(e.from)]; for (let r = rank.get(e.from) + 1; r < rank.get(e.to); r++) { const d = { id: `·${e.k}·${r}`, dummy: true, w: 0, h: 10, order: 1e6 + e.k }; layers[r].push(d); byId.set(d.id, d); pts.push(d); }
    pts.push(byId.get(e.to)); return { ...e, pts };
  });
  const pos = () => { for (const L of layers) L.forEach((n, i) => (n.ix = i)); };
  pos();
  const nbr = (n, up) => chains.flatMap((c) => c.pts.flatMap((p, i) => (p === n ? [c.pts[i + (up ? -1 : 1)]] : []))).filter(Boolean);
  for (let it = 0; it < 6; it++) {
    const down = it % 2 === 0, order = down ? layers.slice(1) : layers.slice(0, -1).reverse();
    for (const L of order) {
      for (const n of L) { const ns = nbr(n, down); n.bc = ns.length ? ns.reduce((a, x) => a + x.ix, 0) / ns.length : n.ix; }
      L.sort((a, b) => a.bc - b.bc || a.ix - b.ix); L.forEach((n, i) => (n.ix = i));
    }
  }
  // edge labels: wrapped, and the gap after a rank as wide as its widest label
  const labs = E0.map((e) => (e.label ? { lines: balance(e.label, labelMax, labelFont), font: labelFont } : null));
  const labW = (l) => (l ? Math.max(...l.lines.map((x) => textWidth(x, l.font))) : 0);
  const LR = dir === "LR";
  const along = (n) => (LR ? n.w : n.h), across = (n) => (LR ? n.h : n.w);
  const size = layers.map((L) => Math.max(0, ...L.map(along)));
  const gap = layers.map((_, r) => {
    const here = chains.filter((c) => rank.get(c.from) === r);
    const need = Math.max(0, ...here.map((c) => (LR ? labW(labs[c.k]) + 40 : (labs[c.k] ? labs[c.k].lines.length * labelFont * 1.25 + 34 : 0))));
    return Math.max(rankGap, Math.min(LR ? labelMax + 44 : 150, need));
  });
  // (left to right, rows with labels between them further apart: a label above one line clears the one over it)
  const crossGap = LR ? (labs.some(Boolean) ? 30 : 18) : nodeGap;
  // top to bottom, a label sits beside its edge, to the right: the node takes that room in its rank; a loop's label too
  const loops = g.edges.filter((e) => e.from === e.to);
  const loopLab = (n) => Math.max(0, ...loops.filter((e) => e.from === n.id && e.label).map((e) => Math.max(...balance(e.label, labelMax, labelFont).map((x) => textWidth(x, labelFont))) + 40));
  // one of a fan (a node out to several, each alone into its target): its label sits just above its target, beside the
  // line's end, on the side the line does not come from (the targets left of the fan's middle, on their left): the
  // target keeps that room, so the fan's labels share one baseline
  for (const n of N) { n.padL = 0; n.padR = 0; }
  if (!LR) {
    const fanOf = new Map();
    for (const c of chains) { const src = c.pts[0], dst = c.pts.at(-1); if (c.pts.length !== 2 || !labs[c.k] || dst.dummy) continue;
      if (chains.filter((x) => x.pts[0] === src).length > 1 && chains.filter((x) => x.pts.at(-1) === dst).length === 1) (fanOf.get(src) || fanOf.set(src, []).get(src)).push(c); }
    for (const list of fanOf.values()) {
      if (list.length < 2) continue;
      list.sort((p, q) => p.pts[1].ix - q.pts[1].ix);
      // (side by side, a fan's labels wrap narrower: two short lines over a target, not one long one across its neighbour)
      for (const c of list) { const l = balance(E0[c.k].label, Math.min(labelMax, fanMax), labelFont); labs[c.k] = { ...labs[c.k], lines: l.length > 1 && !l.at(-1).includes(" ") ? balance(E0[c.k].label, labelMax, labelFont) : l }; }
      list.forEach((c, i) => { const dst = c.pts[1], room = Math.max(0, labW(labs[c.k]) + 14 - dst.w / 2); c.fanSide = i < (list.length - 1) / 2 ? "left" : "right";
        if (c.fanSide === "left") dst.padL = Math.max(dst.padL, room); else dst.padR = Math.max(dst.padR, room); });
    }
  }
  // (a label beside a line out of a node that is no fan's: room for it right of the node)
  for (const n of N) {
    if (n.dummy) continue;
    if (!LR) { const outs = chains.filter((c) => c.pts[0] === n && labs[c.k] && !c.fanSide); n.padR = Math.max(n.padR, 0, ...outs.map((c) => 10 + labW(labs[c.k]) - n.w / 2 + (outs.length > 1 ? n.w * 0.3 : 0))); }
    n.padR = Math.max(n.padR, loopLab(n) ? (LR ? 0 : loopLab(n)) : 0);
  }
  if (LR) layers.forEach((L, r) => { const need = Math.max(0, ...L.map(loopLab)); if (need) gap[r] = Math.max(gap[r], need + 20); });
  const before = (n) => (LR ? 0 : n.padL || 0), after = (n) => (LR ? 0 : n.padR || 0);
  const foot = (n) => before(n) + across(n) + after(n);
  // place: each rank along the main axis; within it, its nodes centred on the widest rank
  const spans = layers.map((L) => L.reduce((a, n) => a + foot(n), 0) + crossGap * Math.max(0, L.length - 1));
  const span = Math.max(...spans, 0);
  let t = 12;
  layers.forEach((L, r) => {
    let c = (span - spans[r]) / 2 + 12;
    for (const n of L) {
      const a = t + (size[r] - along(n)) / 2;
      if (LR) { n.x = a; n.y = c; } else { n.x = c + before(n); n.y = a; }
      c += foot(n) + crossGap;
    }
    t += size[r] + (r < R - 1 ? gap[r] : 0);
  });
  // pull each node toward its neighbours where the rank has room (a light straightening pass)
  for (let it = 0; it < 4; it++) for (const L of layers) {
    const want = L.map((n) => { const ns = [...nbr(n, true), ...nbr(n, false)]; if (!ns.length) return null; const m = ns.reduce((a, x) => a + (LR ? x.y + x.h / 2 : x.x + x.w / 2), 0) / ns.length; return m - (LR ? n.h / 2 : n.w / 2); });
    L.forEach((n, i) => { if (want[i] == null) return; const key = LR ? "y" : "x"; const lo = i ? L[i - 1][key] + across(L[i - 1]) + after(L[i - 1]) + crossGap + before(n) : 12 + before(n), hi = i < L.length - 1 ? L[i + 1][key] - before(L[i + 1]) - crossGap - after(n) - across(n) : 12 + span - after(n) - across(n); n[key] = Math.max(lo, Math.min(hi, (n[key] + want[i]) / 2)); });
  }
  // an edge that travels far across between two ranks gets a deeper gap, so it does not run flat under its label
  for (let r = 0; r < R - 1; r++) {
    const cr = (n) => (LR ? n.y + n.h / 2 : n.x + n.w / 2);
    const far = Math.max(0, ...chains.filter((c) => rank.get(c.from) <= r && rank.get(c.to) > r).map((c) => { const i = r - rank.get(c.from); return Math.abs(cr(c.pts[i + 1]) - cr(c.pts[i])); }));
    const lab = LR ? 0 : Math.max(0, ...chains.filter((c) => rank.get(c.from) === r && labs[c.k]).map((c) => labs[c.k].lines.length * labelFont * 1.25));
    const fanH = LR ? 0 : Math.max(0, ...chains.filter((c) => rank.get(c.from) === r && c.fanSide).map((c) => labs[c.k].lines.length * labelFont * 1.25));
    // (a fan's labels sit just above its targets, beside lines that must have come straight by then: room for that)
    const need = Math.max(Math.min(LR ? 160 : 130, far * 0.32 + lab), fanH ? Math.min(190, fanH * 2.6 + 70) : 0);
    if (need > gap[r]) { const dd = need - gap[r]; gap[r] = need; for (let k = r + 1; k < R; k++) for (const n of layers[k]) { if (LR) n.x += dd; else n.y += dd; } t += dd; }
  }
  const W = Math.ceil((LR ? t : span + 12) + 12), H = Math.ceil((LR ? span + 12 : t) + 12);
  // routes: from the side facing the next rank, spread over it when several leave or arrive, through the points
  const ports = new Map();
  const port = (n, side, c) => { const k = `${n.id}:${side}`; (ports.get(k) || ports.set(k, []).get(k)).push(c); };
  for (const c of chains) { const [a, b] = [c.pts[0], c.pts.at(-1)]; port(a, "out", c); port(b, "in", c); }
  const other = (c, side) => (side === "out" ? c.pts[1] : c.pts.at(-2));
  for (const [k, list] of ports) { const side = k.endsWith(":out") ? "out" : "in"; list.sort((p, q) => (LR ? other(p, side).y - other(q, side).y : other(p, side).x - other(q, side).x)); list.forEach((c, i) => (c[`${side}Ix`] = [i, list.length])); }
  const bez = ([p, c1, c2, q], t) => { const u = 1 - t; return { x: u * u * u * p.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * q.x, y: u * u * u * p.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * q.y }; };
  const edges = chains.map((c) => {
    const e = E0[c.k], [a, b] = [c.pts[0], c.pts.at(-1)];
    const at = (n, side, [i, k]) => {
      if (n.shape === "start" || n.shape === "end") return LR ? { x: side === "out" ? n.x + n.w : n.x, y: n.y + n.h / 2 } : { x: n.x + n.w / 2, y: side === "out" ? n.y + n.h : n.y };
      const f = (i + 1) / (k + 1), spread = (LR ? n.h : n.w) * 0.6;
      return LR ? { x: side === "out" ? n.x + n.w : n.x, y: n.y + n.h / 2 + (f - 0.5) * spread } : { x: n.x + n.w / 2 + (f - 0.5) * spread, y: side === "out" ? n.y + n.h : n.y };
    };
    const pts = [at(a, "out", c.outIx), ...c.pts.slice(1, -1).map((d) => (LR ? { x: d.x, y: d.y + d.h / 2 } : { x: d.x, y: d.y + d.h / 2 })), at(b, "in", c.inIx)];
    let d = `M${f1(pts[0].x)},${f1(pts[0].y)}`; const segs = [];
    for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i]; const c1 = LR ? { x: p.x + (q.x - p.x) / 2, y: p.y } : { x: p.x, y: p.y + (q.y - p.y) / 2 }, c2 = LR ? { x: q.x - (q.x - p.x) / 2, y: q.y } : { x: q.x, y: q.y - (q.y - p.y) / 2 }; segs.push([p, c1, c2, q]); d += ` C${f1(c1.x)},${f1(c1.y)} ${f1(c2.x)},${f1(c2.y)} ${f1(q.x)},${f1(q.y)}`; }
    const poly = [pts[0]]; for (const sg of segs) for (let j = 1; j <= 24; j++) poly.push(bez(sg, j / 24));
    const tip = LR ? { x: pts.at(-1).x, y: pts.at(-1).y, dx: 1, dy: 0 } : { x: pts.at(-1).x, y: pts.at(-1).y, dx: 0, dy: 1 };
    return { k: c.k, i: e.ats.join(" "), from: e.from, to: e.to === "[*]end" ? "[*]" : e.to, style: e.style, d, tip, poly, src: a, dst: b, outIx: c.outIx || [0, 1], inIx: c.inIx || [0, 1], fanSide: c.fanSide || null };
  });
  // an edge back (a feedback, a loop to an earlier stage): round the outside of every rank it spans, with room from
  // them, from its source's side to its target's (to the right top to bottom, below left to right), never through them
  const real = (n) => !n.dummy;
  dag.filter((c) => c.rev).forEach((c, j) => {
    const e = E0[c.k], s = byId.get(e.from), t = byId.get(e.to); if (!s || !t) return;
    const lo = Math.min(rank.get(s.id), rank.get(t.id)), hi = Math.max(rank.get(s.id), rank.get(t.id));
    const span = layers.slice(lo, hi + 1).flat();
    // out of its source's outer side where nothing of its rank is beyond it, else out of its edge facing the rank
    // before, round, and in at its target the same way
    const outer = (n) => { const L = layers[rank.get(n.id)].filter(real); return LR ? L.every((m) => m === n || m.y + m.h <= n.y + 1) : L.every((m) => m === n || m.x + m.w <= n.x + 1); };
    // (top to bottom, the side where its ends are outermost: round the left when the source is the left-most of its rank
    // and not the right-most, so the line never runs along the top of a neighbour to reach the far side)
    const outerL = (n) => layers[rank.get(n.id)].filter(real).every((m) => m === n || m.x >= n.x + n.w - 1);
    let pts, tip, far, side = "right";
    if (!LR) {
      const onLeft = (outerL(s) ? 1 : 0) + (outerL(t) ? 1 : 0) > (outer(s) ? 1 : 0) + (outer(t) ? 1 : 0);
      if (onLeft) {
        side = "left";
        const X = (far = Math.min(...span.map((n) => n.x - (real(n) ? n.padL || 0 : 8))) - 32 - 20 * j);
        const a0 = outerL(s) ? [[s.x, s.y + s.h / 2], [X, s.y + s.h / 2]] : [[s.x + s.w * 0.2, s.y], [s.x + s.w * 0.2, s.y - 16], [X, s.y - 16]];
        const b0 = outerL(t) ? [[X, t.y + t.h / 2], [t.x - 1, t.y + t.h / 2]] : [[X, t.y + t.h + 16], [t.x + t.w * 0.2, t.y + t.h + 16], [t.x + t.w * 0.2, t.y + t.h + 1]];
        pts = [...a0, ...b0];
      } else {
        const X = (far = Math.max(...span.map((n) => n.x + (n.w || 0) + (real(n) ? n.padR || 0 : 8))) + 32 + 20 * j);
        const a0 = outer(s) ? [[s.x + s.w, s.y + s.h / 2], [X, s.y + s.h / 2]] : [[s.x + s.w * 0.8, s.y], [s.x + s.w * 0.8, s.y - 16], [X, s.y - 16]];
        const b0 = outer(t) ? [[X, t.y + t.h / 2], [t.x + t.w + 1, t.y + t.h / 2]] : [[X, t.y + t.h + 16], [t.x + t.w * 0.8, t.y + t.h + 16], [t.x + t.w * 0.8, t.y + t.h + 1]];
        pts = [...a0, ...b0];
      }
      const [p, q] = [pts.at(-2), pts.at(-1)]; tip = { x: q[0], y: q[1], dx: Math.sign(q[0] - p[0]), dy: Math.sign(q[1] - p[1]) };
    } else {
      const Y = (far = Math.max(...span.map((n) => n.y + (n.h || 0))) + 32 + 20 * j);
      const a0 = outer(s) ? [[s.x + s.w / 2, s.y + s.h], [s.x + s.w / 2, Y]] : [[s.x, s.y + s.h * 0.8], [s.x - 16, s.y + s.h * 0.8], [s.x - 16, Y]];
      const b0 = outer(t) ? [[t.x + t.w / 2, Y], [t.x + t.w / 2, t.y + t.h + 1]] : [[t.x + t.w + 16, Y], [t.x + t.w + 16, t.y + t.h * 0.8], [t.x + t.w + 1, t.y + t.h * 0.8]];
      pts = [...a0, ...b0]; const [p, q] = [pts.at(-2), pts.at(-1)]; tip = { x: q[0], y: q[1], dx: Math.sign(q[0] - p[0]), dy: Math.sign(q[1] - p[1]) };
    }
    const d = rounded(pts, 9), poly = line(pts);
    edges.push({ k: c.k, i: e.ats.join(" "), from: e.from, to: e.to === "[*]end" ? "[*]" : e.to, style: e.style, d, tip, poly, rev: true, src: s, dst: t, far, side });
  });
  // self loops: an arc on the node's right side
  for (const e of loops) {
    const n = byId.get(e.from); if (!n) continue; const x = n.x + n.w, y1 = n.y + n.h * 0.28, y2 = n.y + n.h * 0.72;
    const sg = [{ x, y: y1 }, { x: x + 30, y: y1 - 12 }, { x: x + 30, y: y2 + 12 }, { x: x + 1, y: y2 }];
    const d = `M${f1(x)},${f1(y1)} C${f1(x + 30)},${f1(y1 - 12)} ${f1(x + 30)},${f1(y2 + 12)} ${f1(x + 1)},${f1(y2)}`;
    const poly = Array.from({ length: 17 }, (_, j) => bez(sg, j / 16));
    edges.push({ k: null, i: String(e.at), from: e.from, to: e.to, style: e.style, d, tip: { x: x + 1, y: y2, dx: -0.94, dy: -0.34 }, poly, self: true, src: n, dst: n, lab0: e.label ? { lines: balance(e.label, labelMax, labelFont), font: labelFont } : null });
  }
  const nodeBox = N.filter(real).map((n) => ({ x0: n.x, x1: n.x + n.w, y0: n.y, y1: n.y + n.h }));
  // a refused edge's × at the middle of its line, never on its arrowhead nor within 24 px of a box
  const lens = (P) => { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y)); return L; };
  const alongP = (P, f) => { const L = lens(P), want = L.at(-1) * f; let i = 1; while (i < P.length - 1 && L[i] < want) i++; const u = (want - L[i - 1]) / ((L[i] - L[i - 1]) || 1); const a = P[i - 1], b = P[i]; return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, dx: b.x - a.x, dy: b.y - a.y }; };
  const distBox = (p, B) => Math.hypot(Math.max(B.x0 - p.x, 0, p.x - B.x1), Math.max(B.y0 - p.y, 0, p.y - B.y1));
  const stops = [];
  for (const e of edges) if (e.style === "stop") {
    let best = null, bd = -1;
    // (a line back: on its long outer stretch, a third of the way along, never on a corner nor on a box's edge)
    if (e.rev) { const st = e.poly.filter((p) => Math.abs((LR ? p.y : p.x) - e.far) < 0.5); if (st.length > 4) { const p = st[Math.floor(st.length / 3)]; e.stop = { x: p.x, y: p.y }; stops.push({ x0: p.x - 7, x1: p.x + 7, y0: p.y - 7, y1: p.y + 7 }); continue; } }
    for (const f of [0.5, 0.45, 0.55, 0.4, 0.6, 0.35, 0.65, 0.3, 0.7, 0.25]) { const p = alongP(e.poly, f), dd = Math.min(...nodeBox.map((B) => distBox(p, B))); if (dd >= 24) { best = p; break; } if (dd > bd) { bd = dd; best = p; } }
    e.stop = { x: best.x, y: best.y }; stops.push({ x0: best.x - 7, x1: best.x + 7, y0: best.y - 7, y1: best.y + 7 });
  }
  // the labels: each beside its own line (never on it), where no line, box, × or other label is; a line's paper halo
  // (guide.css) is only for what is left. Tried along the line from its middle out, on either side.
  const boxOf = (L) => { const w = Math.max(...L.lines.map((x) => textWidth(x, L.font))) + 2, h = L.lines.length * L.font * 1.25, a = L.anchor || "middle", x0 = a === "start" ? L.x - 1 : a === "end" ? L.x - w + 1 : L.x - w / 2; return { x0, x1: x0 + w, y0: L.y - h / 2, y1: L.y + h / 2 }; };
  const hit = (A, B, m = 2) => A.x0 < B.x1 + m && B.x0 < A.x1 + m && A.y0 < B.y1 + m && B.y0 < A.y1 + m;
  const cross = (B, P, m = 3) => { for (let i = 1; i < P.length; i++) if (segHitsBox(P[i - 1], P[i], { x0: B.x0 - m, x1: B.x1 + m, y0: B.y0 - m, y1: B.y1 + m })) return true; return false; };
  const placed = [];
  const cost = (B, skip = null) => {
    let s = 0;
    for (const T of nodeBox) if (hit(B, T, 4)) s += 1000;
    for (const T of placed) if (T !== skip && hit(B, T.box, 8)) s += 1000;   // (two labels never read as one ragged block)
    for (const T of stops) if (hit(B, T, 2)) s += 1000;
    for (const e of edges) if (cross(B, e.poly)) s += 500;
    s += Math.max(0, -B.x0) + Math.max(0, B.x1 - W) + Math.max(0, -B.y0) + Math.max(0, B.y1 - H);
    return s;
  };
  // beside a line at a point: the label's box pushed off the line along its normal, on one side or the other, 9 px clear
  const beside = (L0, p, side, slide = 0) => {
    const w = Math.max(...L0.lines.map((x) => textWidth(x, L0.font))) + 2, h = L0.lines.length * L0.font * 1.25, len = Math.hypot(p.dx, p.dy) || 1;
    const tx = p.dx / len, ty = p.dy / len; let nx = -ty, ny = tx; if (!side) { nx = -nx; ny = -ny; }
    const off = 9 + Math.abs(nx) * (w / 2) + Math.abs(ny) * (h / 2), along = slide * (Math.abs(tx) * (w / 2) + Math.abs(ty) * (h / 2));
    return { ...L0, x: p.x + nx * off + tx * along, y: p.y + ny * off + ty * along, anchor: "middle" };
  };
  const FR = [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.2, 0.8, 0.14, 0.86, 0.08, 0.92];
  // A label is its own line's: within 12 px of it, and nearer it than any other line by a clear margin, on the side away
  // from its neighbours (the outer side), as near its middle as that allows (a label between two lines, or over
  // another line's box, reads as that line's). What is not, costs.
  const polyDist = (P, B) => { let d = Infinity; for (const p of P) { const x = distBox(p, B); if (x < d) d = x; } return d; };
  const cx = W / 2, cy = H / 2;
  const owned = (e, B, p) => {
    const own = polyDist(e.poly, B); let other = Infinity;
    for (const o of edges) if (o !== e && !(o.from === e.from && o.to === e.to)) { const d = polyDist(o.poly, B); if (d < other) other = d; }
    let s = 0;
    if (own > 12) s += (own - 12) * 40;
    if (other < own + 14) s += 300 + (own + 14 - other) * 10;
    // (nor nearer a box its line does not join than its line: it would read as that box's)
    for (const n of nodeBox) if (![e.src, e.dst].some((m) => m && Math.abs(m.x - n.x0) < 0.5 && Math.abs(m.y - n.y0) < 0.5)) { const d = Math.max(n.x0 - B.x1, B.x0 - n.x1, n.y0 - B.y1, B.y0 - n.y1, 0); if (d < own + 10) s += 200 + (own + 10 - d) * 10; }
    // (outer: the label's middle further from the drawing's middle than its line's point)
    const mx = (B.x0 + B.x1) / 2, my = (B.y0 + B.y1) / 2; if (Math.hypot(mx - cx, my - cy) < Math.hypot(p.x - cx, p.y - cy)) s += 12;
    return s;
  };
  for (const e of edges) {
    const L0 = e.self ? e.lab0 : labs[e.k]; if (!L0) continue;
    const cands = [];
    if (e.self) cands.push({ ...L0, x: e.src.x + e.src.w + 34, y: e.src.y + e.src.h / 2, anchor: "start" });
    // a line back: beside its long outer stretch, on the outside
    if (e.rev) { const ys = e.poly.filter((p) => Math.abs((LR ? p.y : p.x) - e.far) < 0.5), m = ys[Math.floor(ys.length / 2)] || e.poly[0];
      cands.push(LR ? { ...L0, x: m.x, y: e.far + (L0.lines.length * L0.font * 1.25) / 2 + 7, anchor: "middle" } : e.side === "left" ? { ...L0, x: e.far - 9, y: m.y, anchor: "end" } : { ...L0, x: e.far + 9, y: m.y, anchor: "start" }); }
    // an edge left to right reads its label above its middle; top to bottom, to its right (to its left when it bends
    // that way and nothing of its rank is to the left)
    // (the normal of a line going down points left, going right points down: so, top to bottom, side 0 is the right)
    // (and slid along the line by half its length, forward and back: near a box, the label clears it)
    const at = [];
    for (const slide of [0, 1, -1]) for (const f of FR) { const p = alongP(e.poly, f), first = LR ? 0 : e.dst.x + e.dst.w / 2 < e.src.x + e.src.w / 2 - 20 ? 1 : 0; cands.push(beside(L0, p, first, slide), beside(L0, p, 1 - first, slide)); at.push(p, p); }
    let best = null, bc = Infinity;
    const off = cands.length - at.length;
    cands.forEach((L, i) => { const B = boxOf(L), p = at[i - off]; const c = cost(B) + i * 0.8 + (p ? owned(e, B, p) : 0); if (c < bc) { bc = c; best = L; } });
    e.label = best; placed.push({ e, box: boxOf(best) });
  }
  // the labels of a fan (one node out to several, top to bottom) on one baseline: just above the targets, beside each
  // line's end on the side its target kept room for; else the first height up from there where every one sits clear
  if (!LR) {
    const fans = new Map(); for (const e of edges) if (e.label && e.fanSide) (fans.get(e.from) || fans.set(e.from, []).get(e.from)).push(e);
    const xAt = (P, y) => { for (let i = P.length - 1; i > 0; i--) { const a = P[i - 1], b = P[i]; if ((a.y - y) * (b.y - y) <= 0 && a.y !== b.y) { const u = (y - a.y) / (b.y - a.y); return { x: a.x + (b.x - a.x) * u, y }; } } return null; };
    for (const grp of fans.values()) {
      if (grp.length < 2) continue;
      const mine = placed.filter((p) => grp.includes(p.e)), top = Math.max(...grp.map((e) => e.poly[0].y)), bot = Math.min(...grp.map((e) => e.dst.y));
      for (let yb = bot - 5; yb >= top + 14; yb -= 2) {
        const got = [], saved = placed.filter((p) => !mine.includes(p)), keep = placed.slice(); let tot = 0, ok = true;
        placed.length = 0; placed.push(...saved);
        for (const e of grp) {
          const L0 = labs[e.k], h = L0.lines.length * L0.font * 1.25, p = xAt(e.poly, yb - h / 2); if (!p) { ok = false; break; }
          const want = e.fanSide === "left" ? 1 : 0;
          const opts = [beside(L0, { ...p, dx: 0, dy: 1 }, want), beside(L0, { ...p, dx: 0, dy: 1 }, 1 - want)].map((L) => ({ L, c: cost(boxOf(L)) }));
          const pick = opts[0].c <= opts[1].c ? opts[0] : opts[1]; tot += pick.c; placed.push({ e, box: boxOf(pick.L) }); got.push([e, pick.L]);
        }
        placed.length = 0; placed.push(...keep);
        if (ok && tot < 1) { for (const [e, L] of got) { e.label = L; placed.find((p) => p.e === e).box = boxOf(L); } break; }
      }
    }
  }
  const nodes = N.filter(real).map((n) => ({ ...n }));
  // the drawing's bounds: every box, line and label, and a margin
  let minX = 0, minY = 0, maxX = W, maxY = H;
  const grow = (B) => { minX = Math.min(minX, B.x0 - 4); minY = Math.min(minY, B.y0 - 4); maxX = Math.max(maxX, B.x1 + 4); maxY = Math.max(maxY, B.y1 + 4); };
  for (const p of placed) grow(p.box);
  for (const e of edges) for (const p of e.poly) grow({ x0: p.x - 6, x1: p.x + 6, y0: p.y - 6, y1: p.y + 6 });
  const clash = placed.filter((p) => cost(p.box, p) >= 400).length;
  const geo = { clash, labelMax, labelFont, labels: placed.map((p) => ({ box: p.box, lines: p.e.label.lines, edge: p.e.i })), polys: edges.map((e) => e.poly.map((p) => ({ x: p.x, y: p.y }))), nodes: nodeBox };
  for (const e of edges) { delete e.poly; delete e.src; delete e.dst; delete e.lab0; delete e.far; delete e.side; delete e.fanSide; delete e.outIx; delete e.inIx; delete e.k; }
  return { W: Math.ceil(maxX - minX), H: Math.ceil(maxY - minY), ox: -minX, oy: -minY, nodes, edges, geo, clash };
}
// a path through corners, each corner rounded
function rounded(pts, r) {
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [cx, cy] = pts[i + 1], l1 = Math.hypot(bx - ax, by - ay) || 1, l2 = Math.hypot(cx - bx, cy - by) || 1, k = Math.min(r, l1 / 2, l2 / 2);
    d += ` L${f1(bx - ((bx - ax) / l1) * k)},${f1(by - ((by - ay) / l1) * k)} Q${f1(bx)},${f1(by)} ${f1(bx + ((cx - bx) / l2) * k)},${f1(by + ((cy - by) / l2) * k)}`;
  }
  return `${d} L${f1(pts.at(-1)[0])},${f1(pts.at(-1)[1])}`;
}
// a polyline through corners, a point every few pixels (what a label is kept off)
function line(pts) { const out = [{ x: pts[0][0], y: pts[0][1] }]; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 6)); for (let j = 1; j <= n; j++) out.push({ x: ax + ((bx - ax) * j) / n, y: ay + ((by - ay) * j) / n }); } return out; }
/** Whether the segment a–b crosses (or lies in) the box {x0, x1, y0, y1}. */
export function segHitsBox(a, b, B) {
  let t0 = 0, t1 = 1; const dx = b.x - a.x, dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - B.x0], [dx, B.x1 - a.x], [-dy, a.y - B.y0], [dy, B.y1 - a.y]]) {
    if (p === 0) { if (q < 0) return false; continue; }
    const r = q / p; if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return t0 <= t1;
}
const f1 = (v) => Math.round(v * 10) / 10;

// ── a sequence: one column a participant, one row a message, in order ──
function sequenceLayout(g, { font, labelMax, labelFont, headMax }) {
  const used = new Set([...g.edges.flatMap((e) => [e.from, e.to]), ...(g.notes || []).flatMap((n) => n.over)]);
  const P = g.nodes.filter((n) => used.has(n.id)).map((n) => { const lines = balance(n.label, Math.max(headMax - 20, widestWord(n.label, font, { mono: n.shape === "file" }) + 0.5), font, { mono: n.shape === "file" }), lk = n.link ? textWidth("↗", font * 0.8) + 4 : 0; return { ...n, lines, font, w: Math.max(72, Math.ceil(Math.max(...lines.map((l, i) => textWidth(l, font, { mono: n.shape === "file" }) + (i === lines.length - 1 ? lk : 0))) + 22)), h: Math.ceil(lines.length * font * 1.28 + 16) }; });
  const ix = new Map(P.map((p, i) => [p.id, i]));
  const gaps = P.slice(1).map((p, i) => P[i].w / 2 + p.w / 2 + 22);
  const items = [...g.edges.map((e) => ({ ...e, type: "msg" })), ...g.notes.map((n) => ({ ...n, type: "note" }))].sort((a, b) => a.at - b.at);
  for (const it of items) { it.lines = balance(it.type === "msg" ? it.label || "" : it.text, labelMax, labelFont); it.lw = Math.max(0, ...it.lines.map((l) => textWidth(l, labelFont))); }
  const spanOf = (a, b) => { let s = 0; for (let k = Math.min(a, b); k < Math.max(a, b); k++) s += gaps[k]; return s; };
  for (const it of [...items].filter((x) => x.type === "msg" && x.from !== x.to).sort((a, b) => Math.abs(ix.get(a.from) - ix.get(a.to)) - Math.abs(ix.get(b.from) - ix.get(b.to)))) {
    const a = ix.get(it.from), b = ix.get(it.to), need = it.lw + 28, have = spanOf(a, b);
    if (have < need) { const k = Math.abs(a - b); for (let j = Math.min(a, b); j < Math.max(a, b); j++) gaps[j] += (need - have) / k; }
  }
  // a self message's label sits to the right of its column: room for it before the next one
  for (const it of items.filter((x) => x.type === "msg" && x.from === x.to)) { const a = ix.get(it.from); if (a < gaps.length) gaps[a] = Math.max(gaps[a], it.lw + 60); }
  const xs = [P[0] ? P[0].w / 2 + 10 : 10]; for (let k = 0; k < gaps.length; k++) xs.push(xs[k] + gaps[k]);
  const headH = Math.max(0, ...P.map((p) => p.h));
  let y = headH + 26;
  const rows = [];
  for (const it of items) {
    const lh = it.lines.length * labelFont * 1.25;
    if (it.type === "note") {
      const cols = it.over.map((id) => ix.get(id)).filter((v) => v != null), lo = Math.min(...cols), hi = Math.max(...cols);
      const w = Math.max(it.lw + 20, xs[hi] - xs[lo] + 60), cx = (xs[lo] + xs[hi]) / 2;
      rows.push({ ...it, box: { x: cx - w / 2, y, w, h: lh + 12 }, ty: y + 6 + labelFont }); y += lh + 12 + 16; continue;
    }
    const a = ix.get(it.from), b = ix.get(it.to);
    if (a === b) { const x = xs[a]; rows.push({ ...it, self: true, lx: x + 34, ly: y + labelFont, d: `M${f1(x)},${f1(y + lh * 0 + 2)} C${f1(x + 40)},${f1(y)} ${f1(x + 40)},${f1(y + 26)} ${f1(x + 2)},${f1(y + 26)}`, tip: { x: x + 2, y: y + 26, dx: -1, dy: 0 } }); y += Math.max(lh, 26) + 18; continue; }
    // (a refused message's × sits at the middle of its line, under its label: the line a little lower to leave it room)
    const ly = y + labelFont * 0.9, ay = y + lh + (it.style === "stop" ? 12 : 6);
    rows.push({ ...it, lx: (xs[a] + xs[b]) / 2, ly, d: `M${f1(xs[a])},${f1(ay)} L${f1(xs[b])},${f1(ay)}`, tip: { x: xs[b], y: ay, dx: b > a ? 1 : -1, dy: 0 }, mid: { x: (xs[a] + xs[b]) / 2, y: ay } });
    y += lh + (it.style === "stop" ? 12 : 6) + 20;
  }
  const W = Math.ceil(Math.max(xs.at(-1) + (P.at(-1)?.w || 0) / 2 + 10, ...rows.filter((r) => r.self).map((r) => r.lx + r.lw + 12), ...rows.filter((r) => r.box).map((r) => r.box.x + r.box.w + 6)));
  const minX = Math.min(0, ...rows.filter((r) => r.box).map((r) => r.box.x - 6));
  return { W: Math.ceil(W - minX), H: Math.ceil(y + 4), ox: -minX, oy: 0, P, xs, headH, rows };
}

// a sequence too wide for a phone: one row a message, "from → to" in two small boxes, what passes under them
function sequenceList(g, V) {
  const font = 13, labelFont = 13, W = 336, box = (id) => { const n = g.nodes.find((x) => x.id === id) || { id, label: id }; const lk = n.link ? textWidth("↗", font * 0.8) + 4 : 0, lines = balance(n.label, Math.min(146 - lk, Math.max(128 - lk, widestWord(n.label, font, { mono: n.shape === "file" }) + 0.5)), font, { mono: n.shape === "file" }); return { ...n, lines, font, w: Math.min(166, Math.ceil(Math.max(...lines.map((l, i) => textWidth(l, font, { mono: n.shape === "file" }) + (i === lines.length - 1 ? lk : 0))) + 20)), h: Math.ceil(lines.length * font * 1.28 + 12) }; };
  const items = [...g.edges.map((e) => ({ ...e, type: "msg" })), ...(g.notes || []).map((n) => ({ ...n, type: "note" }))].sort((a, b) => a.at - b.at);
  let y = 6; const rows = [];
  items.forEach((it, k) => {
    const lines = wrap(it.type === "msg" ? it.label || "" : it.text, W - 34, labelFont), lh = lines.length * labelFont * 1.25;
    if (it.type === "note") { rows.push({ type: "note", at: it.at, box: { x: 24, y, w: W - 28, h: lh + 12 }, lines, font: labelFont }); y += lh + 12 + 14; return; }
    const a = box(it.from), b = box(it.to), h = Math.max(a.h, b.h);
    a.x = 24; a.y = y + (h - a.h) / 2; b.x = W - b.w - 4; b.y = y + (h - b.h) / 2;
    const ay = y + h / 2, d = it.from === it.to ? "" : `M${f1(a.x + a.w + 4)},${f1(ay)} L${f1(b.x - 4)},${f1(ay)}`;
    rows.push({ type: "msg", at: it.at, n: k + 1, from: it.from, to: it.to, style: it.style, a, b: it.from === it.to ? null : b, d, tip: { x: b.x - 4, y: ay, dx: 1, dy: 0 }, mid: { x: (a.x + a.w + b.x) / 2, y: ay }, label: lines[0] ? { x: 24, y: y + h + 6 + lh / 2, lines, font: labelFont, anchor: "start" } : null, ny: ay });
    y += h + (lines[0] ? lh + 8 : 0) + 16;
  });
  return { W, H: Math.ceil(y), ox: 0, oy: 0, rows };
}

// ── SVG ──
const SHAPE_CLASS = (n) => `dg-n${n.shape ? ` k-${n.shape}` : ""}${n.link ? " has-link" : ""}`;
function nodeSvg(n, { anchor }) {
  const name = n.shape === "start" ? "start" : n.shape === "end" ? "end" : plainText(n.label || n.id);
  const attrs = `class="${SHAPE_CLASS(n)}" data-n="${esc(n.id)}"${n.link ? ` data-link="${esc(n.link)}" tabindex="0" role="link" aria-label="${esc(name)}: open ${esc(n.link)}"` : ` aria-label="${esc(name)}"`} data-anchor="${esc(anchor)} · ${esc(name)}"`;
  if (n.shape === "start") return `<g ${attrs}><circle class="dg-dot" cx="${f1(n.x + 9)}" cy="${f1(n.y + 9)}" r="7"/></g>`;
  if (n.shape === "end") return `<g ${attrs}><circle class="dg-ring" cx="${f1(n.x + 9)}" cy="${f1(n.y + 9)}" r="8"/><circle class="dg-dot" cx="${f1(n.x + 9)}" cy="${f1(n.y + 9)}" r="4.5"/></g>`;
  const r = n.shape === "person" || n.state ? n.h / 2 : n.shape === "step" ? 10 : 7;
  const lh = n.font * 1.28, top = n.y + n.h / 2 - (n.lines.length * lh) / 2 + n.font * 0.95;
  const lk = n.link ? `<tspan class="dg-lk" dx="4" aria-hidden="true">↗</tspan>` : "";
  const text = `<text class="dg-t${n.shape === "file" ? " mono" : ""}" x="${f1(n.x + n.w / 2)}" y="${f1(top)}" text-anchor="middle" style="font-size:${n.font}px">${n.lines.map((l, i) => `<tspan x="${f1(n.x + n.w / 2)}"${i ? ` dy="${f1(lh)}"` : ""}>${esc(l)}</tspan>${i === n.lines.length - 1 ? lk : ""}`).join("")}</text>`;
  const extra = n.shape === "store" ? `<path class="dg-sx" d="M${f1(n.x)},${f1(n.y + 6)} h${f1(n.w)}"/>` : n.shape === "check" ? `<path class="dg-sx" d="M${f1(n.x + 3)},${f1(n.y + 4)} v${f1(n.h - 8)}"/>` : n.shape === "file" ? `<path class="dg-sx" d="M${f1(n.x + n.w - 11)},${f1(n.y)} v11 h11"/>` : "";
  return `<g ${attrs}><rect x="${f1(n.x)}" y="${f1(n.y)}" width="${f1(n.w)}" height="${f1(n.h)}" rx="${f1(r)}"/>${extra}${text}</g>`;
}
const arrowHead = (t, cls = "") => { const L = 8, W2 = 4.2, bx = t.x - t.dx * L, by = t.y - t.dy * L, px = -t.dy, py = t.dx; return `<path class="dg-ah${cls}" d="M${f1(t.x)},${f1(t.y)} L${f1(bx + px * W2)},${f1(by + py * W2)} L${f1(bx - px * W2)},${f1(by - py * W2)} Z"/>`; };
// a refused edge's ×: at a point (the middle of its line), else 16 px back from its tip
const stopMark = (t) => { const x = t.dx == null ? t.x : t.x - t.dx * 16, y = t.dy == null ? t.y : t.y - t.dy * 16; return `<path class="dg-stop" d="M${f1(x - 5)},${f1(y - 5)} L${f1(x + 5)},${f1(y + 5)} M${f1(x + 5)},${f1(y - 5)} L${f1(x - 5)},${f1(y + 5)}"/>`; };
// a label: its words with a halo of paper (guide.css .dg-el, paint-order: stroke), laid beside its line, never on it
const labelSvg = (L, anchor, { chip = false } = {}) => { anchor = anchor || "middle"; if (!L) return ""; const lh = L.font * 1.25, y0 = L.y - ((L.lines.length - 1) * lh) / 2 + L.font * 0.35;
  const w = Math.max(...L.lines.map((x) => textWidth(x, L.font))) + 8, h = L.lines.length * lh + 3, x0 = anchor === "start" ? L.x - 4 : anchor === "end" ? L.x - w + 4 : L.x - w / 2;
  return `${chip ? `<rect class="dg-lb" x="${f1(x0)}" y="${f1(L.y - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="3"/>` : ""}<text class="dg-el" x="${f1(L.x)}" y="${f1(y0)}" text-anchor="${anchor}" style="font-size:${L.font}px">${L.lines.map((l, i) => `<tspan x="${f1(L.x)}"${i ? ` dy="${f1(lh)}"` : ""}>${esc(l)}</tspan>`).join("")}</text>`; };

function svgOf(g, lay, { variant, uid, title, anchor, kind }) {
  const head = `<svg class="dg-svg dg-${variant}" viewBox="0 0 ${lay.W} ${lay.H}" width="${lay.W}" height="${lay.H}" style="max-width:${lay.W}px${variant === "narrow" && lay.W > 350 ? `;min-width:${Math.ceil(lay.W * MIN_SCALE)}px` : ""}" role="group" aria-labelledby="${uid}-${variant}-t" data-kind="${kind}"><title id="${uid}-${variant}-t">${esc(title || "A diagram")}</title><g transform="translate(${f1(lay.ox)},${f1(lay.oy)})">`;
  if (kind === "seqlist") {
    return `${head}${lay.rows.map((r) => r.type === "note" ? `<g class="dg-e dg-note" data-i="${r.at}"><rect x="${f1(r.box.x)}" y="${f1(r.box.y)}" width="${f1(r.box.w)}" height="${f1(r.box.h)}" rx="6"/>${labelSvg({ x: r.box.x + r.box.w / 2, y: r.box.y + r.box.h / 2, lines: r.lines, font: r.font })}</g>`
      : `<g class="dg-e${r.style === "dash" ? " dash" : r.style === "stop" ? " stop" : ""}" data-i="${r.at}" data-from="${esc(r.from)}" data-to="${esc(r.to)}"><text class="dg-num" x="4" y="${f1(r.ny + 4)}">${r.n}</text>${nodeSvg(r.a, { anchor })}${r.b ? `<path class="dg-l" d="${r.d}"/>${arrowHead(r.tip)}${r.style === "stop" ? stopMark(r.mid || r.tip) : ""}${nodeSvg(r.b, { anchor })}` : ""}${labelSvg(r.label, "start")}</g>`).join("")}</g></svg>`;
  }
  if (kind === "sequence") {
    const life = lay.P.map((p, i) => `<path class="dg-life" d="M${f1(lay.xs[i])},${f1(lay.headH + 8)} V${f1(lay.H - 4)}"/>`).join("");
    const heads = lay.P.map((p, i) => nodeSvg({ ...p, x: lay.xs[i] - p.w / 2, y: 4 + (lay.headH - p.h), lines: p.lines, font: p.font }, { anchor })).join("");
    const rows = lay.rows.map((r) => r.type === "note"
      ? `<g class="dg-e dg-note" data-i="${r.at}"><rect x="${f1(r.box.x)}" y="${f1(r.box.y)}" width="${f1(r.box.w)}" height="${f1(r.box.h)}" rx="6"/>${labelSvg({ x: r.box.x + r.box.w / 2, y: r.box.y + r.box.h / 2, lines: r.lines, font: r.font || 12.5 })}</g>`
      : `<g class="dg-e${r.style === "dash" ? " dash" : r.style === "stop" ? " stop" : ""}" data-i="${r.at}" data-from="${esc(r.from)}" data-to="${esc(r.to)}"><path class="dg-l" d="${r.d}"/>${arrowHead(r.tip)}${r.style === "stop" ? stopMark(r.mid || r.tip) : ""}${labelSvg({ x: r.lx, y: r.self ? r.ly : r.ly + ((r.lines.length - 1) * (r.font || 12.5) * 1.25) / 2, lines: r.lines, font: r.font || 12.5 }, r.self ? "start" : "middle")}</g>`).join("");
    return `${head}${life}${heads}${rows}</g></svg>`;
  }
  // the lines first, then every label over all of them (so no later line is drawn across an earlier label), then the boxes
  const edges = lay.edges.map((e) => `<g class="dg-e${e.style === "dash" ? " dash" : e.style === "stop" ? " stop" : ""}${e.rev ? " back" : ""}" data-i="${e.i}" data-from="${esc(e.from)}" data-to="${esc(e.to)}"><path class="dg-l" d="${e.d}"/>${arrowHead(e.tip)}${e.style === "stop" ? stopMark(e.stop || e.tip) : ""}</g>`).join("");
  const labels = lay.edges.filter((e) => e.label).map((e) => `<g class="dg-la" data-i="${e.i}" data-from="${esc(e.from)}" data-to="${esc(e.to)}">${labelSvg(e.label, e.label.anchor)}</g>`).join("");
  const nodes = lay.nodes.map((n) => nodeSvg({ ...n, state: kind === "state" && !["start", "end"].includes(n.shape) }, { anchor })).join("");
  return `${head}${edges}${labels}${nodes}</g></svg>`;
}

/** The smallest a drawing is shown at on a phone (guide.js's fitDiagrams keeps the same rule). */
const MIN_SCALE = 0.85;
const VARIANTS = {
  // a label is at most 200 px wide, its lines balanced; on a phone the diagram is drawn top to bottom at 14 / 13
  wide: { font: 15, labelFont: 14, maxW: 184, labelMax: 200, headMax: 170, fit: 760 },
  narrow: { font: 14, labelFont: 13, maxW: 130, labelMax: 120, fanMax: 96, headMax: 112, fit: 358 },
};
function drawOne(g, variant, { uid, anchor }) {
  const V = VARIANTS[variant], title = g.title;
  if (g.kind === "sequence") {
    const s = V;
    let lay = sequenceLayout(g, s);
    if (variant === "narrow" && lay.W > V.fit) { const L = sequenceList(g, V); return { svg: svgOf(g, L, { variant, uid, title, anchor, kind: "seqlist" }), w: L.W, h: L.H }; }
    lay.rows.forEach((r) => (r.font = V.labelFont));
    return { svg: svgOf(g, lay, { variant, uid, title, anchor, kind: "sequence" }), w: lay.W, h: lay.H };
  }
  // flow and state: left to right where it fits the column, else top to bottom
  const opts = (dir) => ({ dir, font: V.font, maxW: dir === "TB" && variant === "wide" ? 200 : V.maxW, labelMax: V.labelMax, labelFont: V.labelFont, fanMax: V.fanMax });
  let cands = (variant === "wide" ? ["LR", "TB"] : ["TB", "LR"]).map((dir) => ({ dir, lay: layered(g, opts(dir)) }));
  const scale = (c) => Math.min(1, V.fit / c.lay.W);
  // a layout with a label on a line loses to one without, where that one still reads (drawn at 70 % or more)
  if (cands[0].lay.clash !== cands[1].lay.clash) { const clean = cands.filter((c) => !c.lay.clash && scale(c) >= (variant === "wide" ? 0.7 : 0.5)); if (clean.length === 1) cands = [clean[0], clean[0]]; }
  // left to right reads best while it keeps its size; else whichever is shrunk least (top to bottom on a tie)
  // a node that fans out to three or more, labelled, reads better top to bottom: its targets side by side, each label
  // above its own
  const outs = {}, ins = {}; for (const e of g.edges) if (e.label && e.from !== e.to) { outs[e.from] = (outs[e.from] || 0) + 1; ins[e.to] = (ins[e.to] || 0) + 1; }
  const fans = Math.max(0, ...Object.values(outs), ...Object.values(ins)) >= 3;
  let pick = variant === "wide" ? (fans ? (scale(cands[1]) >= Math.min(0.9, scale(cands[0])) ? cands[1] : cands[0]) : scale(cands[0]) >= 0.94 ? cands[0] : scale(cands[1]) >= scale(cands[0]) - 0.02 ? cands[1] : cands[0]) : (scale(cands[0]) >= scale(cands[1]) * 0.9 ? cands[0] : cands[1]);
  // on a phone a drawing is never shown below 85 % (a label at 13 px stays 11 px or more): top to bottom,
  // else left to right, else top to bottom drawn tighter (narrower labels, ranks 48 apart, neighbours 24), where one
  // reads at 85 % with no label on a line; failing all, the narrowest, which scrolls sideways with "Open larger"
  if (variant === "narrow" && scale(pick) < MIN_SCALE) {
    const tight = { dir: "TB", lay: layered(g, { ...opts("TB"), maxW: 118, labelMax: 96, fanMax: 80, rankGap: 48, nodeGap: 24 }) };
    const all = [...new Set([cands[0], cands[1]])].concat(tight);
    const narrowest = (L) => L.reduce((a, c) => (c.lay.W < a.lay.W ? c : a));
    pick = all.find((c) => !c.lay.clash && scale(c) >= MIN_SCALE) || all.find((c) => scale(c) >= MIN_SCALE) || narrowest(all.some((c) => !c.lay.clash) ? all.filter((c) => !c.lay.clash) : all);
  }
  return { svg: svgOf(g, pick.lay, { variant, uid, title, anchor, kind: g.kind }), w: pick.lay.W, h: pick.lay.H, dir: pick.dir, geo: pick.lay.geo };
}
/** Where a flow's or a state diagram's labels, lines and boxes landed, each layout the page would show (wide and on a
 *  phone; each panel of a compare): { variant, dir, labels: [{ box, lines }], polys: [[{x, y}]], nodes: [box] }. For
 *  the specs: no label on a line, no word left alone on a label's last line. */
export function diagramGeometry(src) {
  const g = typeof src === "string" ? parseDiagram(src) : src;
  const gs = g.kind === "compare" ? g.panels || [] : [g], out = [];
  for (const x of gs) { if (x.kind === "sequence" || !x.edges?.length) continue; for (const v of ["wide", "narrow"]) { const r = drawOne(x, v, { uid: "geo", anchor: "geo" }); if (r.geo) out.push({ variant: v, dir: r.dir, ...r.geo }); } }
  return out;
}

/** The diagram in words: one line a stage, the text alternative and what the page steps through. */
function stagesOf(g) {
  const L = new Map(g.nodes.map((n) => [n.id, plainText(n.label || n.id)]));
  const name = (id) => (id === "[*]" ? null : L.get(id) || id);
  const items = [...g.edges.map((e) => ({ ...e, type: "edge" })), ...(g.notes || []).map((n) => ({ ...n, type: "note" }))].sort((a, b) => a.at - b.at);
  return items.map((e) => {
    if (e.type === "note") return { i: e.at, from: null, to: null, label: "", text: e.text, words: `${e.over.map(name).join(" and ")}: ${plainText(e.text)}`, caption: `${e.over.map(name).join(" and ")}: ${endStop(plainText(e.text))}` };
    const from = name(e.from), to = name(e.to);
    const verb = g.kind === "state" ? (!from ? `It starts at ${to}` : !to ? `From ${from}, it ends` : `From ${from} to ${to}`) : e.style === "stop" ? `${from} stops at ${to}` : `${from} → ${to}`;
    return { i: e.at, from: e.from, to: e.to, label: plainText(e.label), text: plainText(e.text), words: `${verb}${e.label ? `: ${plainText(e.label)}` : ""}${e.style === "dash" && g.kind !== "sequence" ? " (sometimes)" : ""}${e.text ? `. ${plainText(e.text)}` : ""}`, caption: captionOf(g, e, from, to) };
  });
}
// a word a sentence may start with, capitalised; a name written in lower case on purpose (a file, a command, a flag) kept
const capWord = (t) => { const x = String(t || ""); return /^(?!(?:reel|reelplanning|git|npm|npx|node|gh)\b)[a-z][a-z']*(?:-[a-z]+)*(?=[\s,;:?!]|$)/.test(x) ? x[0].toUpperCase() + x.slice(1) : x; };
const endStop = (t) => (/[.!?…:]$/.test(t) ? t : `${t}.`);
/** A stage said as a sentence for the caption under the drawing: what passes and where
 *  from and to, then the author's own sentence for it (the why), when the diagram has one. Composed only from the edge's
 *  label and its two nodes' names: nothing added that the diagram does not say. */
function captionOf(g, e, from, to) {
  const lab = plainText(e.label), text = plainText(e.text), sometimes = e.style === "dash" && g.kind !== "sequence";
  const why = text ? ` ${endStop(capWord(text))}` : "";
  if (e.type === "note") return endStop(capWord(text));
  let first;
  if (g.kind === "state") first = !from ? `It starts at ${to}${lab ? `, with ${lab}` : ""}` : !to ? `From ${from}, it ends${lab ? `: ${lab}` : ""}` : `${lab ? `${capWord(lab)}: ` : ""}from ${from} it goes to ${to}`;
  else if (e.from === e.to) first = `${lab ? `${capWord(lab)}, ` : ""}within ${from}`;
  else if (/\?$/.test(from)) first = `${capWord(from)} ${lab ? `${capWord(lab)}: ` : ""}on to ${to}`;
  else if (e.style === "stop") first = `${lab ? `${capWord(lab)}: ` : ""}from ${from}, it stops at ${to}`;
  else first = lab ? `${capWord(lab)}, from ${from} to ${to}` : `From ${from} to ${to}`;
  if (g.kind === "state" && lab && from && to) first = `${capWord(lab)}: from ${from} to ${to}`;
  return `${endStop(capWord(first))}${sometimes ? " Sometimes, not always." : ""}${why}`.replace(/\.\.$/, ".");
}

let UID = 0;
/** A diagram's text, drawn for the page: { id, kind, title, wide, narrow, stages, nodes, panels?, errors, src }. */
export function drawDiagram(src, { id = null, anchor = null } = {}) {
  const g = typeof src === "string" ? parseDiagram(src) : src;
  const uid = id || `dg${++UID}`, A = anchor || `diagram · ${g.title || uid}`;
  const base = { id: uid, kind: g.kind, title: g.title, errors: g.errors || [], src: typeof src === "string" ? src : null, auto: !!g.auto, caption: g.caption || null };
  if (g.kind === "compare") {
    const panels = (g.panels || []).map((p, k) => { const pg = { ...p, title: `${g.title}: ${p.side}${p.caption ? `, ${p.caption}` : ""}` }; const w = drawOne(pg, "wide", { uid: `${uid}-${p.side}`, anchor: `${A} · ${p.side}` }), n = drawOne(pg, "narrow", { uid: `${uid}-${p.side}`, anchor: `${A} · ${p.side}` });
      return { side: p.side, caption: p.caption, wide: w.svg, narrow: n.svg, stages: stagesOf(pg), nodes: p.nodes.map(({ id: nid, label, link }) => ({ id: nid, label: plainText(label), link })) }; });
    return { ...base, panels, stages: [], nodes: [] };
  }
  if (base.errors.length && !g.edges.length && !(g.notes || []).length) return { ...base, wide: null, narrow: null, stages: [], nodes: [] };
  const w = drawOne(g, "wide", { uid, anchor: A }), n = drawOne(g, "narrow", { uid, anchor: A });
  return { ...base, wide: w.svg, narrow: n.svg, size: { wide: [w.w, w.h], narrow: [n.w, n.h] }, stages: stagesOf(g), nodes: g.nodes.filter((x) => x.id !== "[*]").map(({ id: nid, label, link }) => ({ id: nid, label: plainText(label), link })), steppable: g.steppable !== false && g.edges.length > 1 };
}

/** Every ```diagram block in some Markdown: [{ src, at }] (the text around them is left as it was). */
export function diagramBlocks(md) {
  return [...String(md || "").replace(/\r\n/g, "\n").matchAll(/^```diagram[^\n]*\n([\s\S]*?)^```\s*$/gm)].map((m) => ({ src: m[1], at: m.index }));
}
export const withoutDiagrams = (md) => String(md || "").replace(/\r\n/g, "\n").replace(/^```diagram[^\n]*\n[\s\S]*?^```\s*$\n?/gm, "");

// ── diagrams made from structure, never written: the steps and what each needs; the files of a part of the change and
//    which imports which; how the parts of the change use each other ──
/** The steps and the steps each needs ("*Needs step 1.*"), when at least one needs another. */
export function stepsDiagram(steps) {
  const needs = (s) => { const t = String(s.deps || ""); if (!/need/i.test(t)) return []; return [...t.matchAll(/\d+/g)].map((m) => +m[0]).filter((n) => n !== s.n && steps.some((x) => x.n === n)); };
  const edges = steps.flatMap((s) => needs(s).map((n) => ({ from: `s${n}`, to: `s${s.n}` })));
  if (!edges.length || steps.length < 2) return null;
  const short = (t) => { let x = String(t || "").replace(/\s*\((?:questions?|and question)[^)]*\)\s*$/i, "").replace(/\s*[✅⏳❌✗].*$/, ""); const c = x.split(/:\s/)[0]; if (x.length > 40 && c !== x && c.split(" ").length >= 2) x = c; return x.length > 46 ? x.slice(0, x.lastIndexOf(" ", 44)).replace(/[,;:]$/, "") + " …" : x; };
  const g = { kind: "flow", title: "The steps, and which each needs first", nodes: steps.map((s, i) => ({ id: `s${s.n}`, label: `${s.n}. ${short(s.title)}`, shape: "step", link: `#step-${s.n}`, order: i })), edges: edges.map((e, i) => ({ ...e, label: "", text: "", style: "solid", at: i })), notes: [], errors: [], auto: true, steppable: false,
    caption: "Made from each step's \"Needs step …\" line in plan.md: an arrow goes from a step to one that needs it. Click a step to go to it." };
  return drawDiagram(g, { id: "dg-steps", anchor: "diagram · the steps" });
}

const IMPORT = /(?:^|\n)\s*(?:import|export)\s[^;]*?\bfrom\s*["'](\.{1,2}\/[^"']+)["']|(?:^|[^\w.])import\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)|require\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g;
const SCRIPT_SRC = /\bjoin\(\s*ROOT\s*,\s*["']([^"']+\.(?:m?js|css|html))["']\s*\)|read\(\s*["']([^"']+\.(?:m?js|css|html))["']\s*\)/g;
/** The imports each file of a set makes of another in the set: [{ from, to }] (paths from the repo's top). */
export function importsAmong(files, textOf) {
  const set = new Set(files), out = [];
  const norm = (p) => { const parts = []; for (const s of p.split("/")) { if (s === "..") parts.pop(); else if (s && s !== ".") parts.push(s); } return parts.join("/"); };
  for (const f of files) {
    const text = textOf(f); if (!text) continue; const dir = f.split("/").slice(0, -1).join("/");
    const seen = new Set();
    for (const m of text.matchAll(IMPORT)) { const rel = m[1] || m[2] || m[3]; let to = norm(`${dir}/${rel}`); if (!/\.[a-z]+$/.test(to)) to += ".mjs"; if (set.has(to) && to !== f && !seen.has(to)) { seen.add(to); out.push({ from: f, to, how: "imports" }); } }
    // a file read by path from the repo's top (the page reads its templates so)
    for (const m of text.matchAll(SCRIPT_SRC)) { const to = m[1] || m[2]; if (set.has(to) && to !== f && !seen.has(to)) { seen.add(to); out.push({ from: f, to, how: "reads" }); } }
  }
  return out;
}
/** A part of the change: its files, and which uses which (from their text at the plan's last commit). */
export function filesDiagram(cat, textOf, { id }) {
  const files = cat.files.filter((f) => !f.generated).map((f) => f.path).filter((p) => /\.(m?js|cjs|sh)$/.test(p));
  if (files.length < 2) return null;
  const links = importsAmong(cat.files.filter((f) => !f.generated).map((f) => f.path), textOf).filter((e) => files.includes(e.from));
  if (!links.length) return null;
  const used = new Set(links.flatMap((e) => [e.from, e.to]));
  if (used.size < 3 || links.length < 2) return null;   // two files and one import is a sentence, not a diagram
  const base = (p) => p.split("/").pop(), twice = new Set([...used].map(base).filter((b, i, a) => a.indexOf(b) !== i));
  const nodes = [...used].map((p, i) => ({ id: p, label: twice.has(base(p)) ? p.split("/").slice(-2).join("/") : base(p), shape: "file", link: p, order: i }));
  const g = { kind: "flow", title: `${String(cat.name).replace(/`/g, "")}: which file uses which`, nodes, edges: links.map((e, i) => ({ from: e.from, to: e.to, label: e.how === "reads" ? "reads" : "", text: "", style: e.how === "reads" ? "dash" : "solid", at: i })), notes: [], errors: [], auto: true, steppable: false,
    caption: `Made from the files' own import lines, as they are at the plan's last commit: an arrow goes from a file to one it imports${links.some((e) => e.how === "reads") ? " (dashed: one it reads as text)" : ""}. Click a file to see its diff.` };
  return drawDiagram(g, { id, anchor: `diagram · ${String(cat.name).replace(/`/g, "")} · files` });
}
/** The parts of the change, and which part's files use another's: the map of the whole change. */
export function changeMap(cats, textOf) {
  const hand = cats.filter((c) => c.id !== "everything-else" && c.id !== "tests").map((c) => ({ c, files: c.files.filter((f) => !f.generated).map((f) => f.path) })).filter((x) => x.files.length);
  const all = hand.flatMap((x) => x.files), owner = new Map(hand.flatMap((x) => x.files.map((f) => [f, x.c.id])));
  const links = importsAmong(all, textOf), pair = new Map();
  for (const e of links) { const a = owner.get(e.from), b = owner.get(e.to); if (!a || !b || a === b) continue; const k = `${a}>${b}`; const p = pair.get(k) || { from: a, to: b, n: 0, files: new Set() }; p.n++; p.files.add(e.to.split("/").pop()); pair.set(k, p); }
  if (pair.size < 1 || hand.length < 2) return null;
  const used = new Set([...pair.values()].flatMap((p) => [p.from, p.to]));
  const nodes = hand.filter((x) => used.has(x.c.id)).map((x, i) => ({ id: x.c.id, label: String(x.c.name).replace(/`/g, ""), link: `#${x.c.id}`, order: i }));
  const g = { kind: "flow", title: "How the parts of the change use each other", nodes, edges: [...pair.values()].map((p, i) => ({ from: p.from, to: p.to, label: "", text: `through ${[...p.files].join(", ")}`, style: "solid", at: i })), notes: [], errors: [], auto: true, steppable: false,
    caption: "Made from the import lines of the change's own files: an arrow goes from a part to a part whose files it uses (the files are named in words, below). Click a part to go to its code." };
  return drawDiagram(g, { id: "dg-change", anchor: "diagram · the parts of the change" });
}
