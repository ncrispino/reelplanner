// Play a sketch scenario (README.md) against the real page: `reelplanner sketch --once` in a scratch repo, the live
// caption stood in by the scenario's sentences (a partial when each starts, the final when it ends, as Chrome's does),
// every edit made as Excalidraw's own UI makes it (bound arrows, labels measured by Excalidraw, a real mouse for pen
// strokes and pointing, real Ctrl+Z), then Finish and Send. The folder it saved is copied to <out>/<id>/.
//
//   play(file, { out, port, partner: "off" | "openrouter" | "local", speed })   → { id, code, errors, asks, log, saved }
//   check(scenario, folder)   → [{ ok, what }]: the final drawing against expect (labels, absent labels, arrows)
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, mkdtempSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { chromium } from "playwright-core";
import { launchOpts, serverUp, ROOT } from "../../lib/env.mjs";

// ---------- in the page: the edit operations, as the UI would make them ----------
const OPS = () => {
  const K = () => window.ExcalidrawKit, api = () => window.reelSketch.api;
  const all = () => api().getSceneElementsIncludingDeleted();
  // a frame made by Open up, an icon, a picture: named by the scenario's own id; "@Checkout": the thing labeled so
  // (what a Mermaid insert drew)
  const real = (id) => {
    if (window.__alias?.[id]) return window.__alias[id];
    if (typeof id === "string" && id.startsWith("@")) { const t = all().find((e) => !e.isDeleted && e.type === "text" && e.containerId && (e.originalText ?? e.text).replace(/\s+/g, " ").trim() === id.slice(1)); if (t) return t.containerId; }
    return id;
  };
  const byId = (id) => all().find((e) => e.id === real(id) && !e.isDeleted);
  const bump = (e, patch) => ({ ...e, ...patch, version: e.version + 1, versionNonce: Math.floor(Math.random() * 2 ** 31), updated: Date.now() });
  const commit = (changed, added = []) => api().updateScene({ elements: [...all().map((e) => changed.get(e.id) || e), ...added], captureUpdate: K().CaptureUpdateAction.IMMEDIATELY });
  const center = (e) => ({ x: e.x + e.width / 2, y: e.y + e.height / 2 });
  // where a ray from e's centre towards p leaves e's box (+gap)
  const edge = (e, p, gap = 6) => { const c = center(e), dx = p.x - c.x, dy = p.y - c.y; if (!dx && !dy) return c;
    const t = Math.min(dx ? (e.width / 2 + gap) / Math.abs(dx) : Infinity, dy ? (e.height / 2 + gap) / Math.abs(dy) : Infinity); return { x: c.x + dx * t, y: c.y + dy * t }; };
  // an arrow's geometry from its bindings (and its own free end)
  function geometry(a, cur) {
    const S = a.startBinding && (cur.get(a.startBinding.elementId) || byId(a.startBinding.elementId));
    const E = a.endBinding && (cur.get(a.endBinding.elementId) || byId(a.endBinding.elementId));
    const last = a.points[a.points.length - 1], freeEnd = { x: a.x + last[0], y: a.y + last[1] }, freeStart = { x: a.x, y: a.y };
    const s = S ? edge(S, E ? center(E) : freeEnd) : freeStart, e = E ? edge(E, S ? center(S) : freeStart) : freeEnd;
    return { x: s.x, y: s.y, points: [[0, 0], [e.x - s.x, e.y - s.y]], width: Math.abs(e.x - s.x), height: Math.abs(e.y - s.y) };
  }
  // a label measured by Excalidraw itself: convert a throwaway container with it, keep the text's measured fields
  function measuredLabel(container, text) {
    const sk = container.type === "arrow" || container.type === "line"
      ? { type: "arrow", x: container.x, y: container.y, points: container.points, label: { text } }
      : { type: "rectangle", x: container.x, y: container.y, width: container.width, height: container.height, label: { text } };
    return K().convertToExcalidrawElements([sk]).find((e) => e.type === "text");
  }
  const labelOf = (id) => all().find((e) => e.containerId === id && !e.isDeleted);
  function rebindArrows(cur, ids) {
    for (const a of all().filter((e) => e.type === "arrow" && !e.isDeleted && (ids.includes(e.startBinding?.elementId) || ids.includes(e.endBinding?.elementId)))) {
      const prev = cur.get(a.id) || a, g = geometry(prev, cur); cur.set(a.id, bump(prev, g));
      const l = labelOf(a.id); if (l) { const m = measuredLabel({ ...prev, ...g }, l.text); cur.set(l.id, bump(cur.get(l.id) || l, { x: m.x, y: m.y })); }
    }
  }
  const SHAPES = new Set(["rectangle", "ellipse", "diamond"]);
  return {
    add(list) {
      const cur = new Map(), added = [];
      for (const s0 of list) {
        const F = s0.in && byId(s0.in), s = F ? { ...s0, x: F.x + (s0.x ?? 0), y: F.y + (s0.y ?? 0) } : s0;
        const style = {}; for (const k of ["strokeColor", "backgroundColor", "strokeStyle", "fontSize", "endArrowhead", "startArrowhead"]) if (s[k] !== undefined) style[k] = s[k];
        if (s.backgroundColor) style.fillStyle = "solid";
        const inF = (els) => F ? els.map((e) => ({ ...e, frameId: F.id })) : els;
        if (SHAPES.has(s.type)) added.push(...inF(K().convertToExcalidrawElements([{ type: s.type, id: s.id, x: s.x, y: s.y, width: s.width, height: s.height, ...style, ...(s.label ? { label: { text: s.label } } : {}) }], { regenerateIds: false })));
        else if (s.type === "text") added.push(...inF(K().convertToExcalidrawElements([{ type: "text", id: s.id, x: s.x, y: s.y, text: s.text, ...style }], { regenerateIds: false })));
        else if (s.type === "frame") {
          const [f] = K().convertToExcalidrawElements([{ type: "frame", id: s.id, x: s.x, y: s.y, width: s.width, height: s.height, name: s.name, children: [] }], { regenerateIds: false });
          added.unshift(f); for (const c of s.children || []) { const e = cur.get(c) || added.find((x) => x.id === c) || byId(c); if (e) cur.set(c, bump(e, { frameId: s.id })); }
        } else if (s.type === "arrow" || s.type === "line") {
          const pool = (id) => added.find((x) => x.id === id) || byId(id);
          const A = s.from && pool(s.from), B = s.to && pool(s.to);
          let x = s.x ?? 0, y = s.y ?? 0, points = s.points || [[0, 0], [100, 0]];
          if (A || B) {
            const tmp = { x, y, points, startBinding: A ? { elementId: A.id } : null, endBinding: B ? { elementId: B.id } : null };
            if (A && !B) { const last = points[points.length - 1], c = center(A), dir = { x: c.x + last[0], y: c.y + last[1] }, st = edge(A, dir); tmp.x = st.x; tmp.y = st.y; }
            const m = new Map([[A?.id, A], [B?.id, B]].filter(([k]) => k)); Object.assign(tmp, geometry(tmp, m)); ({ x, y, points } = tmp);
          }
          const els = K().convertToExcalidrawElements([{ type: s.type, id: s.id, x, y, points, ...style, ...(s.label ? { label: { text: s.label } } : {}) }], { regenerateIds: false });
          const arrow = els.find((e) => e.id === s.id) || els[0];
          const bound = { ...arrow, startBinding: A ? { elementId: A.id, focus: 0, gap: 6 } : null, endBinding: B ? { elementId: B.id, focus: 0, gap: 6 } : null };
          added.push(bound, ...els.filter((e) => e !== arrow));
          for (const T of [A, B].filter(Boolean)) { const base = cur.get(T.id) || T; const be = [...(base.boundElements || []), { id: arrow.id, type: "arrow" }];
            const inAdded = added.findIndex((x) => x.id === T.id); if (inAdded >= 0) added[inAdded] = { ...added[inAdded], boundElements: be }; else cur.set(T.id, bump(base, { boundElements: be })); }
        }
      }
      commit(cur, added);
    },
    move({ id, x, y }) {
      const e = byId(id); if (!e) throw new Error(`move: no ${id}`); const dx = x - e.x, dy = y - e.y, cur = new Map();
      cur.set(e.id, bump(e, { x, y })); const l = labelOf(e.id); if (l) cur.set(l.id, bump(l, { x: l.x + dx, y: l.y + dy }));
      if (e.type === "frame") for (const c of all().filter((c) => c.frameId === e.id && !c.isDeleted)) { cur.set(c.id, bump(c, { x: c.x + dx, y: c.y + dy })); const cl = labelOf(c.id); if (cl) cur.set(cl.id, bump(cl, { x: cl.x + dx, y: cl.y + dy })); }
      rebindArrows(cur, [e.id, ...[...cur.keys()]]); commit(cur);
    },
    resize({ id, width, height }) {
      const e = byId(id); if (!e) throw new Error(`resize: no ${id}`); const cur = new Map(), n = bump(e, { width: width ?? e.width, height: height ?? e.height }); cur.set(e.id, n);
      const l = labelOf(e.id); if (l) { const m = measuredLabel(n, l.text); cur.set(l.id, bump(l, { x: m.x, y: m.y, width: m.width, height: m.height })); }
      rebindArrows(cur, [e.id]); commit(cur);
    },
    relabel({ id, label }) {
      const e = byId(id); if (!e) throw new Error(`relabel: no ${id}`); const cur = new Map();
      if (e.type === "text") { const [m] = K().convertToExcalidrawElements([{ type: "text", x: e.x, y: e.y, text: label, fontSize: e.fontSize }]); cur.set(e.id, bump(e, { text: label, originalText: label, width: m.width, height: m.height })); }
      else if (e.type === "frame") cur.set(e.id, bump(e, { name: label }));
      else { const l = labelOf(e.id), m = measuredLabel(e, label);
        if (l) cur.set(l.id, bump(l, { text: m.text, originalText: label, x: m.x, y: m.y, width: m.width, height: m.height }));
        else { const t = { ...m, containerId: e.id }; cur.set(e.id, bump(e, { boundElements: [...(e.boundElements || []), { id: t.id, type: "text" }] })); commit(cur, [t]); return; } }
      commit(cur);
    },
    restyle({ id, ...style }) { const e = byId(id); if (!e) throw new Error(`restyle: no ${id}`); if (style.backgroundColor) style.fillStyle = "solid"; commit(new Map([[e.id, bump(e, style)]])); },
    reroute({ id, from, to }) {
      const a = byId(id); from = from && real(from); to = to && real(to); if (!a) throw new Error(`reroute: no ${id}`); const cur = new Map();
      const sb = from === undefined ? a.startBinding : from ? { elementId: from, focus: 0, gap: 6 } : null, eb = to === undefined ? a.endBinding : to ? { elementId: to, focus: 0, gap: 6 } : null;
      for (const old of [a.startBinding?.elementId, a.endBinding?.elementId]) { const o = old && byId(old); if (o && ![sb?.elementId, eb?.elementId].includes(old)) cur.set(old, bump(o, { boundElements: (o.boundElements || []).filter((b) => b.id !== a.id) })); }
      for (const nw of [sb?.elementId, eb?.elementId]) { const o = nw && (cur.get(nw) || byId(nw)); if (o && !(o.boundElements || []).some((b) => b.id === a.id)) cur.set(nw, bump(o, { boundElements: [...(o.boundElements || []), { id: a.id, type: "arrow" }] })); }
      const n = { ...a, startBinding: sb, endBinding: eb }; cur.set(a.id, bump(a, { startBinding: sb, endBinding: eb, ...geometry(n, cur) }));
      const l = labelOf(a.id); if (l) { const m = measuredLabel({ ...a, ...cur.get(a.id) }, l.text); cur.set(l.id, bump(l, { x: m.x, y: m.y })); }
      commit(cur);
    },
    delete(ids) {
      const cur = new Map();
      for (const id of ids) { const e = byId(id); if (!e) throw new Error(`delete: no ${id}`); cur.set(e.id, bump(e, { isDeleted: true })); const l = labelOf(e.id); if (l) cur.set(l.id, bump(l, { isDeleted: true }));
        for (const a of all().filter((x) => x.type === "arrow" && !x.isDeleted && (x.startBinding?.elementId === e.id || x.endBinding?.elementId === e.id))) {
          const p = cur.get(a.id) || a; cur.set(a.id, bump(p, { startBinding: p.startBinding?.elementId === e.id ? null : p.startBinding, endBinding: p.endBinding?.elementId === e.id ? null : p.endBinding })); } }
      commit(cur);
    },
    group({ ids }) { const g = "g" + Math.random().toString(36).slice(2, 8), cur = new Map();
      for (const id of ids) { const e = byId(id); if (!e) throw new Error(`group: no ${id}`); cur.set(e.id, bump(e, { groupIds: [...(e.groupIds || []), g] })); const l = labelOf(e.id); if (l) cur.set(l.id, bump(l, { groupIds: [...(l.groupIds || []), g] })); }
      commit(cur); },
    frame({ id, name, children }) {
      const els = children.map(byId).filter(Boolean); if (!els.length) throw new Error(`frame: no children`);
      const x0 = Math.min(...els.map((e) => e.x)) - 24, y0 = Math.min(...els.map((e) => e.y)) - 36, x1 = Math.max(...els.map((e) => e.x + e.width)) + 24, y1 = Math.max(...els.map((e) => e.y + e.height)) + 24;
      const [f] = K().convertToExcalidrawElements([{ type: "frame", id, x: x0, y: y0, width: x1 - x0, height: y1 - y0, name, children: [] }], { regenerateIds: false });
      const cur = new Map(); for (const e of els) { cur.set(e.id, bump(e, { frameId: id })); const l = labelOf(e.id); if (l) cur.set(l.id, bump(l, { frameId: id })); }
      api().updateScene({ elements: [f, ...all().map((e) => cur.get(e.id) || e)], captureUpdate: K().CaptureUpdateAction.IMMEDIATELY });
    },
    // what one step just put on the canvas (a library icon, a Mermaid diagram, a picture), moved so its top left is at
    // x, y (scene), and named for later steps: an icon by its biggest part, its label as <id>:label
    placeNew({ before, x, y, id, label }) {
      const had = new Set(before), fresh = all().filter((e) => !e.isDeleted && !had.has(e.id));
      if (!fresh.length) throw new Error("nothing new on the canvas");
      const x0 = Math.min(...fresh.map((e) => e.x)), y0 = Math.min(...fresh.map((e) => e.y)), cur = new Map();
      if (x != null) for (const e of fresh) cur.set(e.id, bump(e, { x: e.x - x0 + x, y: e.y - y0 + y }));
      commit(cur);
      if (id) {
        const area = (e) => ["rectangle", "ellipse", "diamond", "image"].includes(e.type) ? e.width * e.height : -1;
        const main = [...fresh].sort((a, b) => area(b) - area(a))[0], text = fresh.find((e) => e.type === "text" && !e.containerId);
        (window.__alias ??= {})[id] = main.id; if (text) window.__alias[`${id}:label`] = text.id;
        if (label && text) this.relabel({ id: text.id, label });
      }
      api().updateScene({ appState: { selectedElementIds: {} } });
      return fresh.length;
    },
    ids() { return all().map((e) => e.id); },
    // a place on screen with nothing drawn under a line of text: below the drawing where it fits, else beside it
    emptySpot() {
      const s = api().getAppState(), z = s.zoom.value, scr = (x, y) => [(x + s.scrollX) * z, (y + s.scrollY) * z];
      const boxes = all().filter((e) => !e.isDeleted).map((e) => { const [x0, y0] = scr(e.x, e.y), [x1, y1] = scr(e.x + Math.abs(e.width), e.y + Math.abs(e.height)); return { x0, y0, x1, y1 }; });
      for (let y = 140; y <= 660; y += 30) for (let x = 230; x <= 560; x += 30)
        if (!boxes.some((b) => b.x0 < x + 340 && b.x1 > x - 10 && b.y0 < y + 40 && b.y1 > y - 15)) return [x, y];
      return [240, 660];
    },
    realId: (id) => real(id),
    tool(type) { api().setActiveTool({ type }); },
    select(ids) { api().updateScene({ appState: { selectedElementIds: Object.fromEntries(ids.map((i) => [real(i), true])) } }); },
    screen([x, y]) { const s = api().getAppState(), z = s.zoom.value; return [(x + s.scrollX) * z + (s.offsetLeft || 0), (y + s.scrollY) * z + (s.offsetTop || 0)]; },
    newest(type) { return all().filter((e) => e.type === type && !e.isDeleted).sort((a, b) => b.updated - a.updated)[0]?.id; },
  };
};

export async function play(file, { R = ROOT, out: outDir, port, partner = "off", speed = 1, env: extraEnv = {}, video = null, mic = null }) {
  const sc = JSON.parse(readFileSync(file, "utf8")), id = sc.id || basename(file, ".json");
  const dir = join(outDir, id); mkdirSync(dir, { recursive: true });
  const k = speed;   // every time in the scenario, scaled
  const log = []; const T0 = { v: Date.now() }; const say = (...a) => { const l = `[${((Date.now() - T0.v) / 1000).toFixed(1)}s] ${a.join(" ")}`; log.push(l); };
  const repo = mkdtempSync(join(tmpdir(), `scn-${id}-`));
  execFileSync("git", ["init", "-q"], { cwd: repo }); writeFileSync(join(repo, "README.md"), `# ${sc.title}\n`);
  for (const f of sc.repo || []) { mkdirSync(join(repo, f, ".."), { recursive: true }); writeFileSync(join(repo, f), `// ${f}\n`); }   // files to link boxes to
  mkdirSync(join(repo, ".reelplanner")); writeFileSync(join(repo, ".reelplanner/decisions.json"), "[]\n");
  execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "add", "."], { cwd: repo }); execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "init"], { cwd: repo });
  const env = { ...process.env, REELPLANNER_SKETCH_PARTNER: partner, ...extraEnv };
  const srv = spawn(process.execPath, [R + "/bin/reelplanner.mjs", "sketch", sc.topic || sc.title, "--once", "--port", String(port), "--no-open"], { cwd: repo, env, stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; srv.stdout.on("data", (c) => (out += c)); srv.stderr.on("data", (c) => (out += c));
  const exited = new Promise((r) => srv.on("exit", (c) => r(c)));
  await serverUp(port, { child: srv, timeout: 120000 });
  await new Promise((r) => setTimeout(r, 300));
  if (srv.exitCode != null) throw new Error(`its own server did not start: ${out.trim().split("\n").pop()}`);   // never drive another run's page
  const b = await chromium.launch(launchOpts({ args: [...launchOpts().args, "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", ...(mic ? [`--use-file-for-fake-audio-capture=${mic}%noloop`] : [])] }));
  const errors = [], asks = [];
  try {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, ...(video ? { recordVideo: { dir: video, size: { width: 1280, height: 800 } } } : {}) });
    const pageT0 = Date.now();
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error" && !/ERR_CONNECTION_REFUSED|ERR_INCOMPLETE_CHUNKED/.test(m.text())) errors.push(m.text()); });
    const lines = sc.steps.filter((s) => s.say).map((s) => ({ t: s.t * k, text: s.say }));
    await page.addInitScript((L) => {
      // the live caption, standing in: each sentence heard when the scenario says it ends (wall time from Record)
      window.SpeechRecognition = class { start() { if (this.on) return; this.on = 1; const t0 = window.__recAt ??= performance.now();
        for (const [i, l] of L.entries()) { const now = (performance.now() - t0) / 1000; if (l.t <= now || window.__heard?.has(i)) continue;
          // as Chrome does: a first partial result when speech starts (~0.33 s a word before the end), the final at the end
          const start = Math.max(now, l.t - Math.min(6, 0.33 * l.text.split(/\s+/).length));
          setTimeout(() => { if (!this.on || window.__heard?.has(i)) return; const x = [{ transcript: l.text.split(" ").slice(0, 2).join(" "), confidence: 0.5 }]; x.isFinal = false; this.onresult?.({ resultIndex: 0, results: [x] }); }, (start - now) * 1000);
          setTimeout(() => { if (!this.on) return; (window.__heard ??= new Set()).add(i); const x = [{ transcript: l.text, confidence: 0.92 }]; x.isFinal = true; this.onresult?.({ resultIndex: 0, results: [x] }); }, (l.t - now) * 1000); } }
        stop() { this.on = 0; } };
    }, lines);
    await page.addInitScript(`window.__ops = (${OPS.toString()})();`);
    await page.goto(`http://127.0.0.1:${port}/`); await page.waitForFunction(() => window.reelSketch?.api, null, { timeout: 60000 });
    await page.click("#rec"); T0.v = Date.now(); say("record");
    let stop = false;
    const watch = (async () => { let last = ""; while (!stop) { const t = await page.evaluate(() => document.querySelector("#ask[data-done]") ? document.querySelector("#ask-text").textContent : "").catch(() => null); if (t === null) return; if (t && t !== last) { last = t; asks.push({ at: (Date.now() - T0.v) / 1000, text: t }); say("ASK:", t); } await page.waitForTimeout(250); } })();
    for (const st of sc.steps) {
      const wait = st.t * k * 1000 - (Date.now() - T0.v); if (wait > 0) await page.waitForTimeout(wait);
      const [act] = Object.keys(st).filter((k) => k !== "t"), arg = st[act];
      try {
        if (act === "say") continue;
        if (act === "note") {
          // as a person writes on the board: the text tool, a click on an empty spot in view, type, Escape
          const [x, y] = await page.evaluate(() => window.__ops.emptySpot());
          await page.evaluate(() => window.__ops.tool("text")); await page.waitForTimeout(150); await page.mouse.click(x, y);
          await page.waitForSelector("textarea.excalidraw-wysiwyg");   // the editor open: else the keys are Excalidraw's shortcuts
          await page.keyboard.type(arg, { delay: 15 }); await page.keyboard.press("Escape"); await page.evaluate(() => window.__ops.tool("selection"));
        }
        else if (act === "pen") {
          await page.evaluate(() => document.activeElement?.blur()); await page.evaluate(() => window.__ops.tool("freedraw"));
          // as a person does: start the stroke beside Excalidraw's style panel (it opens down the left edge, about
          // x 14-190 and y 66-400, when the pen is picked, and a press on it draws nothing): a closed loop from its
          // first point clear of the panel, an open stroke from its other end
          const under = ([x, y]) => x < 200 && y > 60 && y < 405;
          let pts = arg.points;
          if (under(pts[0])) { const closed = Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) < 40, i = pts.findIndex((q) => !under(q));
            pts = closed && i > 0 ? [...pts.slice(i), ...pts.slice(1, i + 1)] : [...pts].reverse(); }
          pts = await page.evaluate((P) => P.map((p) => window.__ops.screen(p)), pts);   // the view may be zoomed or moved (Open up, Back)
          await page.mouse.move(pts[0][0], pts[0][1]); await page.mouse.down();
          for (const [x, y] of pts.slice(1)) await page.mouse.move(x, y, { steps: 3 });
          await page.mouse.up(); await page.evaluate(() => window.__ops.tool("selection"));
        } else if (act === "undo" || act === "redo") {
          // as a person does: click an empty bit of canvas first, so the keys go to the board, not the note box
          await page.evaluate(() => window.__ops.tool("selection")); await page.mouse.click(1240, 690);
          for (let i = 0; i < arg; i++) { await page.keyboard.press(act === "undo" ? "Control+z" : "Control+Shift+z"); await page.waitForTimeout(150); }
        } else if (act === "link") {
          // Link to code: select it, the button, type part of a path in the note box, Enter (the first file listed)
          await page.evaluate((i) => window.__ops.select([i]), arg.id); await page.waitForSelector("#sel.show"); await page.click("#sel-link");
          await page.keyboard.type(arg.type, { delay: 40 }); await page.waitForTimeout(500); await page.keyboard.press("Enter");
        } else if (act === "mark") {
          await page.evaluate((ids) => window.__ops.select(ids), arg.ids); await page.waitForSelector("#sel.show"); await page.click(`[data-status="${arg.as}"]`);
        } else if (act === "openup") {
          await page.evaluate((i) => window.__ops.select([i]), arg.id); await page.waitForSelector("#sel.show"); await page.click("#sel-open"); await page.waitForTimeout(900);
          if (arg.as) await page.evaluate((a) => { (window.__alias ??= {})[a] = window.__ops.newest("frame"); }, arg.as);
        } else if (act === "back") {
          await page.evaluate((i) => window.__ops.select([i]), arg.from); await page.waitForSelector("#sel.show"); await page.click("#sel-open"); await page.waitForTimeout(900);
          await page.evaluate(() => window.__ops.select([]));
        } else if (act === "icon") {
          // from the page's library, as a person takes one: Library, click it (it lands mid-view), close, then placed
          const before = await page.evaluate(() => window.__ops.ids());
          if (!(await page.isVisible(".library-unit"))) await page.locator(".sidebar-trigger").first().click();
          await page.waitForSelector(".library-unit");
          const n = await page.evaluate((name) => (window.reelIcons?.(window.ExcalidrawKit.convertToExcalidrawElements) || []).findIndex((i) => i.id === `reel-icon-${name}`), arg.icon);
          if (n < 0) throw new Error(`no icon "${arg.icon}" in the library`);
          await page.locator(".library-unit").nth(n).click(); await page.waitForTimeout(300);
          await page.evaluate(() => window.reelSketch.api.toggleSidebar({ name: "default", force: false })); await page.waitForTimeout(200);
          await page.evaluate((a) => window.__ops.placeNew(a), { before, x: arg.x, y: arg.y, id: arg.id, label: arg.label });
        } else if (act === "mermaid") {
          // More tools → Mermaid to Excalidraw, the source typed in, Insert; its boxes are "@<label>" to later steps
          const before = await page.evaluate(() => window.__ops.ids());
          await page.click('[title="More tools"]'); await page.locator(".dropdown-menu").getByText("Mermaid to Excalidraw").click();   // (the help card names it too)
          await page.fill(".ttd-dialog textarea", arg.source); await page.waitForTimeout(900);
          await page.locator(".ttd-dialog button", { hasText: /insert/i }).click(); await page.waitForTimeout(400);
          await page.evaluate((a) => window.__ops.placeNew(a), { before, x: arg.x, y: arg.y });
        } else if (act === "image") {
          // a picture dropped on the canvas where it should go, as a file from the desktop
          const before = await page.evaluate(() => window.__ops.ids());
          const src = arg.svg ?? readFileSync(join(dirname(file), arg.file), "utf8");
          const [sx, sy] = await page.evaluate((p) => window.__ops.screen(p), [arg.x + (arg.width || 200) / 2, arg.y + (arg.height || 120) / 2]);
          await page.evaluate(({ src, name, sx, sy }) => { const dt = new DataTransfer(); dt.items.add(new File([src], name, { type: "image/svg+xml" }));
            const c = document.querySelector(".excalidraw__canvas.interactive"); for (const type of ["dragenter", "dragover", "drop"]) c.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, clientX: sx, clientY: sy, dataTransfer: dt })); }, { src, name: arg.name || "picture.svg", sx, sy });
          await page.waitForFunction((b) => window.reelSketch.api.getSceneElements().some((e) => e.type === "image" && !b.includes(e.id)), before, { timeout: 10000 });
          await page.waitForTimeout(300);
          await page.evaluate((a) => window.__ops.placeNew(a), { before, x: arg.x, y: arg.y, id: arg.id });
        } else if (act === "point") {
          // the pointer rests on each element in turn, as a person points while talking
          await page.evaluate(() => document.activeElement?.blur());
          for (const pid of arg.ids) {
            const c = await page.evaluate((i) => { const e = window.reelSketch.api.getSceneElements().find((x) => x.id === window.__ops.realId(i)); if (!e) return null; const [x, y] = window.__ops.screen([e.x + e.width / 2, e.y + e.height / 2]); return { x, y }; }, pid);
            if (!c) throw new Error(`point: no ${pid}`);
            await page.mouse.move(c.x, c.y, { steps: 8 }); await page.waitForTimeout((arg.seconds || 1.5) * k * 1000 / arg.ids.length);
          }
        } else if (act === "pause") { await page.click("#rec"); await page.waitForTimeout(arg * k * 1000); await page.click("#rec"); }
        else await page.evaluate(([a, x]) => window.__ops[a](x), [act, arg]);
        say(act, JSON.stringify(arg).slice(0, 90));
      } catch (e) { errors.push(`step t=${st.t} ${act}: ${e.message.split("\n")[0]}`); say("STEP FAILED", act, e.message.split("\n")[0]); }
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: join(dir, "page-end.png") });
    await page.click("#finish"); await page.waitForSelector("#review.open"); await page.waitForTimeout(600);
    await page.click("#send"); await page.waitForFunction(() => document.querySelector("#sent").style.display === "block", null, { timeout: 120000 });
    stop = true; await watch;
    const code = await Promise.race([exited, new Promise((r) => setTimeout(() => r("still running"), 60000))]);
    const last = out.trim().split("\n").pop(), folder = last.startsWith("sketch: ") ? join(repo, last.slice(8)) : null;
    if (folder && existsSync(folder)) for (const f of readdirSync(folder)) cpSync(join(folder, f), join(dir, f), { recursive: true });
    const videoFile = video ? await page.video()?.path() : null;   // written when the browser closes
    return { id, title: sc.title, file, code, errors, asks, log, saved: !!folder, out, videoFile, recordAt: (T0.v - pageT0) / 1000 };
  } finally { await b.close(); if (srv.exitCode == null) srv.kill(); }
}

// ---------- mechanical checks: the final drawing against the scenario's expectations ----------
export function check(sc, dir) {
  const res = [];
  const s = existsSync(join(dir, "session.json")) ? JSON.parse(readFileSync(join(dir, "session.json"), "utf8")) : null;
  if (!s) return [{ ok: false, what: "session.json saved" }];
  const els = s.final?.elements || [], byId = new Map(els.map((e) => [e.id, e]));
  const norm = (t) => String(t || "").replace(/\s+/g, " ").trim().toLowerCase();
  const labels = new Set(els.flatMap((e) => [e.label, e.text, e.name, e.image?.name].filter(Boolean).map(norm)));
  for (const l of sc.expect?.final_labels || []) res.push({ ok: labels.has(norm(l)), what: `final has "${l}"` });
  for (const l of sc.expect?.absent_labels || []) res.push({ ok: !labels.has(norm(l)), what: `final lacks "${l}"` });
  const name = (id) => { const e = byId.get(id); if (!e) return null;   // an icon's part: the icon's label
    if (e.icon) return norm(els.find((x) => x.icon && x.iconGroup === e.iconGroup && x.kind === "text")?.text);
    return norm(e.label || e.text || e.name || e.image?.name); };
  const arrows = els.filter((e) => e.kind === "arrow" || e.kind === "line").map((a) => [name(a.from), name(a.to), norm(a.label)]);
  for (const [f, t, l] of sc.expect?.arrows || []) res.push({ ok: arrows.some(([af, at, al]) => af === norm(f) && at === norm(t) && (!l || al === norm(l))), what: `arrow "${f}" → "${t}"${l ? ` ("${l}")` : ""}` });
  return res;
}

