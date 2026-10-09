// Play a sketch scenario (README.md) against the real page: `reelplanner sketch --once` in a scratch repo, the live
// caption stood in by the scenario's sentences (a partial when each starts, the final when it ends, as Chrome's does),
// every edit made as Excalidraw's own UI makes it (bound arrows, labels measured by Excalidraw, a real mouse for pen
// strokes and pointing, real Ctrl+Z), then Finish and Send. The folder it saved is copied to <out>/<id>/.
//
//   play(file, { out, port, partner: "off" | "openrouter" | "local", speed })   → { id, code, errors, asks, log, saved }
//   check(scenario, folder)   → [{ ok, what }]: the final drawing against expect (labels, absent labels, arrows)
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, mkdtempSync } from "node:fs";
import { join, basename } from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { chromium } from "playwright-core";
import { launchOpts, serverUp, ROOT } from "../../lib/env.mjs";

// ---------- in the page: the edit operations, as the UI would make them ----------
const OPS = () => {
  const K = () => window.ExcalidrawKit, api = () => window.reelSketch.api;
  const all = () => api().getSceneElementsIncludingDeleted();
  const byId = (id) => all().find((e) => e.id === id && !e.isDeleted);
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
      for (const s of list) {
        const style = {}; for (const k of ["strokeColor", "backgroundColor", "strokeStyle", "fontSize", "endArrowhead", "startArrowhead"]) if (s[k] !== undefined) style[k] = s[k];
        if (s.backgroundColor) style.fillStyle = "solid";
        if (SHAPES.has(s.type)) added.push(...K().convertToExcalidrawElements([{ type: s.type, id: s.id, x: s.x, y: s.y, width: s.width, height: s.height, ...style, ...(s.label ? { label: { text: s.label } } : {}) }], { regenerateIds: false }));
        else if (s.type === "text") added.push(...K().convertToExcalidrawElements([{ type: "text", id: s.id, x: s.x, y: s.y, text: s.text, ...style }], { regenerateIds: false }));
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
      cur.set(id, bump(e, { x, y })); const l = labelOf(id); if (l) cur.set(l.id, bump(l, { x: l.x + dx, y: l.y + dy }));
      if (e.type === "frame") for (const c of all().filter((c) => c.frameId === id && !c.isDeleted)) { cur.set(c.id, bump(c, { x: c.x + dx, y: c.y + dy })); const cl = labelOf(c.id); if (cl) cur.set(cl.id, bump(cl, { x: cl.x + dx, y: cl.y + dy })); }
      rebindArrows(cur, [id, ...[...cur.keys()]]); commit(cur);
    },
    resize({ id, width, height }) {
      const e = byId(id); if (!e) throw new Error(`resize: no ${id}`); const cur = new Map(), n = bump(e, { width: width ?? e.width, height: height ?? e.height }); cur.set(id, n);
      const l = labelOf(id); if (l) { const m = measuredLabel(n, l.text); cur.set(l.id, bump(l, { x: m.x, y: m.y, width: m.width, height: m.height })); }
      rebindArrows(cur, [id]); commit(cur);
    },
    relabel({ id, label }) {
      const e = byId(id); if (!e) throw new Error(`relabel: no ${id}`); const cur = new Map();
      if (e.type === "text") { const [m] = K().convertToExcalidrawElements([{ type: "text", x: e.x, y: e.y, text: label, fontSize: e.fontSize }]); cur.set(id, bump(e, { text: label, originalText: label, width: m.width, height: m.height })); }
      else if (e.type === "frame") cur.set(id, bump(e, { name: label }));
      else { const l = labelOf(id), m = measuredLabel(e, label);
        if (l) cur.set(l.id, bump(l, { text: m.text, originalText: label, x: m.x, y: m.y, width: m.width, height: m.height }));
        else { const t = { ...m, containerId: id }; cur.set(id, bump(e, { boundElements: [...(e.boundElements || []), { id: t.id, type: "text" }] })); commit(cur, [t]); return; } }
      commit(cur);
    },
    restyle({ id, ...style }) { const e = byId(id); if (!e) throw new Error(`restyle: no ${id}`); if (style.backgroundColor) style.fillStyle = "solid"; commit(new Map([[id, bump(e, style)]])); },
    reroute({ id, from, to }) {
      const a = byId(id); if (!a) throw new Error(`reroute: no ${id}`); const cur = new Map();
      const sb = from === undefined ? a.startBinding : from ? { elementId: from, focus: 0, gap: 6 } : null, eb = to === undefined ? a.endBinding : to ? { elementId: to, focus: 0, gap: 6 } : null;
      for (const old of [a.startBinding?.elementId, a.endBinding?.elementId]) { const o = old && byId(old); if (o && ![sb?.elementId, eb?.elementId].includes(old)) cur.set(old, bump(o, { boundElements: (o.boundElements || []).filter((b) => b.id !== id) })); }
      for (const nw of [sb?.elementId, eb?.elementId]) { const o = nw && (cur.get(nw) || byId(nw)); if (o && !(o.boundElements || []).some((b) => b.id === id)) cur.set(nw, bump(o, { boundElements: [...(o.boundElements || []), { id, type: "arrow" }] })); }
      const n = { ...a, startBinding: sb, endBinding: eb }; cur.set(id, bump(a, { startBinding: sb, endBinding: eb, ...geometry(n, cur) }));
      const l = labelOf(id); if (l) { const m = measuredLabel({ ...a, ...cur.get(id) }, l.text); cur.set(l.id, bump(l, { x: m.x, y: m.y })); }
      commit(cur);
    },
    delete(ids) {
      const cur = new Map();
      for (const id of ids) { const e = byId(id); if (!e) throw new Error(`delete: no ${id}`); cur.set(id, bump(e, { isDeleted: true })); const l = labelOf(id); if (l) cur.set(l.id, bump(l, { isDeleted: true }));
        for (const a of all().filter((x) => x.type === "arrow" && !x.isDeleted && (x.startBinding?.elementId === id || x.endBinding?.elementId === id))) {
          const p = cur.get(a.id) || a; cur.set(a.id, bump(p, { startBinding: p.startBinding?.elementId === id ? null : p.startBinding, endBinding: p.endBinding?.elementId === id ? null : p.endBinding })); } }
      commit(cur);
    },
    group({ ids }) { const g = "g" + Math.random().toString(36).slice(2, 8), cur = new Map();
      for (const id of ids) { const e = byId(id); if (!e) throw new Error(`group: no ${id}`); cur.set(id, bump(e, { groupIds: [...(e.groupIds || []), g] })); const l = labelOf(id); if (l) cur.set(l.id, bump(l, { groupIds: [...(l.groupIds || []), g] })); }
      commit(cur); },
    frame({ id, name, children }) {
      const els = children.map(byId).filter(Boolean); if (!els.length) throw new Error(`frame: no children`);
      const x0 = Math.min(...els.map((e) => e.x)) - 24, y0 = Math.min(...els.map((e) => e.y)) - 36, x1 = Math.max(...els.map((e) => e.x + e.width)) + 24, y1 = Math.max(...els.map((e) => e.y + e.height)) + 24;
      const [f] = K().convertToExcalidrawElements([{ type: "frame", id, x: x0, y: y0, width: x1 - x0, height: y1 - y0, name, children: [] }], { regenerateIds: false });
      const cur = new Map(); for (const e of els) { cur.set(e.id, bump(e, { frameId: id })); const l = labelOf(e.id); if (l) cur.set(l.id, bump(l, { frameId: id })); }
      api().updateScene({ elements: [f, ...all().map((e) => cur.get(e.id) || e)], captureUpdate: K().CaptureUpdateAction.IMMEDIATELY });
    },
    tool(type) { api().setActiveTool({ type }); },
  };
};

export async function play(file, { R = ROOT, out: outDir, port, partner = "off", speed = 1, env: extraEnv = {} }) {
  const sc = JSON.parse(readFileSync(file, "utf8")), id = sc.id || basename(file, ".json");
  const dir = join(outDir, id); mkdirSync(dir, { recursive: true });
  const k = speed;   // every time in the scenario, scaled
  const log = []; const T0 = { v: Date.now() }; const say = (...a) => { const l = `[${((Date.now() - T0.v) / 1000).toFixed(1)}s] ${a.join(" ")}`; log.push(l); };
  const repo = mkdtempSync(join(tmpdir(), `scn-${id}-`));
  execFileSync("git", ["init", "-q"], { cwd: repo }); writeFileSync(join(repo, "README.md"), `# ${sc.title}\n`); mkdirSync(join(repo, ".reelplanner")); writeFileSync(join(repo, ".reelplanner/decisions.json"), "[]\n");
  execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "add", "."], { cwd: repo }); execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "init"], { cwd: repo });
  const env = { ...process.env, REELPLANNER_SKETCH_PARTNER: partner, ...extraEnv };
  const srv = spawn(process.execPath, [R + "/bin/reelplanner.mjs", "sketch", sc.topic || sc.title, "--once", "--port", String(port), "--no-open"], { cwd: repo, env, stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; srv.stdout.on("data", (c) => (out += c)); srv.stderr.on("data", (c) => (out += c));
  const exited = new Promise((r) => srv.on("exit", (c) => r(c)));
  await serverUp(port, { child: srv, timeout: 120000 });
  await new Promise((r) => setTimeout(r, 300));
  if (srv.exitCode != null) throw new Error(`its own server did not start: ${out.trim().split("\n").pop()}`);   // never drive another run's page
  const b = await chromium.launch(launchOpts({ args: [...launchOpts().args, "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] }));
  const errors = [], asks = [];
  try {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
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
    const watch = (async () => { let last = ""; while (!stop) { const t = await page.textContent("#ask-text").catch(() => null); if (t === null) return; if (t && t !== last) { last = t; asks.push({ at: (Date.now() - T0.v) / 1000, text: t }); say("ASK:", t); } await page.waitForTimeout(250); } })();
    for (const st of sc.steps) {
      const wait = st.t * k * 1000 - (Date.now() - T0.v); if (wait > 0) await page.waitForTimeout(wait);
      const [act] = Object.keys(st).filter((k) => k !== "t"), arg = st[act];
      try {
        if (act === "say") continue;
        if (act === "note") { await page.fill("#note", arg); await page.press("#note", "Enter"); await page.evaluate(() => document.activeElement?.blur()); }
        else if (act === "pen") {
          await page.evaluate(() => document.activeElement?.blur()); await page.evaluate(() => window.__ops.tool("freedraw"));
          const pts = arg.points; await page.mouse.move(pts[0][0], pts[0][1]); await page.mouse.down();
          for (const [x, y] of pts.slice(1)) await page.mouse.move(x, y, { steps: 3 });
          await page.mouse.up(); await page.evaluate(() => window.__ops.tool("selection"));
        } else if (act === "undo" || act === "redo") {
          // as a person does: click an empty bit of canvas first, so the keys go to the board, not the note box
          await page.evaluate(() => window.__ops.tool("selection")); await page.mouse.click(1240, 690);
          for (let i = 0; i < arg; i++) { await page.keyboard.press(act === "undo" ? "Control+z" : "Control+Shift+z"); await page.waitForTimeout(150); }
        } else if (act === "point") {
          // the pointer rests on each element in turn, as a person points while talking
          await page.evaluate(() => document.activeElement?.blur());
          for (const pid of arg.ids) {
            const c = await page.evaluate((i) => { const e = window.reelSketch.api.getSceneElements().find((x) => x.id === i); return e && { x: e.x + e.width / 2, y: e.y + e.height / 2 }; }, pid);
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
    return { id, title: sc.title, file, code, errors, asks, log, saved: !!folder, out };
  } finally { await b.close(); if (srv.exitCode == null) srv.kill(); }
}

// ---------- mechanical checks: the final drawing against the scenario's expectations ----------
export function check(sc, dir) {
  const res = [];
  const s = existsSync(join(dir, "session.json")) ? JSON.parse(readFileSync(join(dir, "session.json"), "utf8")) : null;
  if (!s) return [{ ok: false, what: "session.json saved" }];
  const els = s.final?.elements || [], byId = new Map(els.map((e) => [e.id, e]));
  const norm = (t) => String(t || "").replace(/\s+/g, " ").trim().toLowerCase();
  const labels = new Set(els.flatMap((e) => [e.label, e.text, e.name].filter(Boolean).map(norm)));
  for (const l of sc.expect?.final_labels || []) res.push({ ok: labels.has(norm(l)), what: `final has "${l}"` });
  for (const l of sc.expect?.absent_labels || []) res.push({ ok: !labels.has(norm(l)), what: `final lacks "${l}"` });
  const name = (id) => { const e = byId.get(id); return e ? norm(e.label || e.text || e.name) : null; };
  const arrows = els.filter((e) => e.kind === "arrow" || e.kind === "line").map((a) => [name(a.from), name(a.to), norm(a.label)]);
  for (const [f, t, l] of sc.expect?.arrows || []) res.push({ ok: arrows.some(([af, at, al]) => af === norm(f) && at === norm(t) && (!l || al === norm(l))), what: `arrow "${f}" → "${t}"${l ? ` ("${l}")` : ""}` });
  return res;
}

