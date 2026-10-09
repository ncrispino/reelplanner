// The sketch page (`reelplanner sketch`): one full-screen Excalidraw canvas where someone draws, says and types how
// they think something works. Nothing here interprets the sketch; it records it faithfully, on one clock, for the
// step after it (an agent, a model) to read:
//
//   recording.webm   the canvas as it was drawn, with the voice (the pointer drawn in, so "this one" can be seen)
//   keyframes/       a picture of the canvas each time a thought ends (a pause in speech, a typed note, a lull
//                    in drawing), with what was said since the one before: the same story for a model that takes
//                    images but not video
//   final.png        the finished drawing, and final.excalidraw, the scene itself (exact labels, which arrow joins
//                    which box: what a model could misread from pixels)
//   session.json     all of it on the recording's clock: the transcript, the notes, the keyframes, every edit
//
// Every time is in seconds on the recording's clock, so a time in session.json is a moment in recording.webm.
// Served by scripts/sketch.mjs, which saves what Send posts; opened on its own (no server), Download gives a .zip.
(() => {
  "use strict";
  const { React, createRoot, Excalidraw, exportToBlob, serializeAsJSON, convertToExcalidrawElements, CaptureUpdateAction } = window.ExcalidrawKit || {};
  const $ = (id) => document.getElementById(id);
  if (!Excalidraw) { $("status").textContent = "Excalidraw did not load (run `reelplanner vendor-excalidraw`)."; return; }

  // ---------- the clock: seconds of recording, paused while the Finish panel is open ----------
  let t0 = null, pausedAt = null, pausedTotal = 0;
  const now = () => performance.now();
  const clock = () => (t0 == null ? null : +(((pausedAt ?? now()) - t0 - pausedTotal) / 1000).toFixed(2));
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const session = {
    format: "reelplanner-sketch/1",
    id: new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z"),
    question: "", context: null,
    transcript: { source: "none", lang: navigator.language || "en-US", segments: [] },
    notes: [], keyframes: [], events: [], pauses: [], pointer: [],
    before_recording: 0,
  };
  const files = new Map(); // path in the bundle → Blob (keyframes; the rest is made at the end)

  // ---------- context from the server, if there is one ----------
  let server = false;
  // held open while the page is: an agent waiting on `sketch --once` learns when the page is closed without Send
  let live$ = null;
  try { if (location.protocol.startsWith("http")) live$ = new EventSource("api/sketch/live"); } catch {}
  fetch("api/sketch/context").then((r) => r.ok ? r.json() : null).then((c) => {
    if (!c || !c.ok) return;
    server = true; session.context = c.context;
    if (c.question && !$("question").value) $("question").value = c.question;
    const x = c.context;
    $("ctx").textContent = `${x.repoName} · ${x.branch || "detached"} @ ${(x.commit || "no commit").slice(0, 7)}${x.dirty ? " (uncommitted changes)" : ""}`;
    $("ctx").title = `Saved to ${c.saveTo}`;
    if (c.partner) {
      partner = c.partner;
      session.partner = { provider: c.partner.provider, model: c.partner.model, on: partnerOn(), questions: [] };
      $("partner-label").textContent = `Ask me questions (${c.partner.label})`;
      $("partner").title = c.partner.provider === "local" ? "A model on this machine looks at each picture and what you said, and may ask one short question. Nothing leaves this machine."
        : `At each picture, the drawing and what you said so far go to ${c.partner.where} (${c.partner.model}), which may ask one short question.`;
      $("partner-on").checked = partnerOn(); $("partner").hidden = false;
    }
  }).catch(() => {}).finally(() => { if (!server) $("send").hidden = true; });

  // ---------- the canvas ----------
  let api = null;
  const known = new Map();      // element id → { version, isDeleted }
  const lastLogged = new Map(); // element id → the update event to fold quick repeats into
  // a picture put on the canvas (dropped, pasted or picked with Insert image): Excalidraw keeps its pixels, not its
  // name, so the file is noted as it comes in and given to the next image that appears. An SVG's words (its <text>,
  // <title>, <desc>) are read out of it, so sketch.md can say what a diagram someone dropped in says
  const images = new Map(), pendingFiles = [];
  function noteFiles(list) {
    for (const f of list || []) {
      if (!/^image\//.test(f.type)) continue;
      const im = { name: f.name || null, type: f.type, kb: Math.round(f.size / 1024) };
      pendingFiles.push(im);
      if (f.type === "image/svg+xml") {
        if (f.size > 2e6) status(`That SVG is ${(f.size / 1e6).toFixed(1)} MB: it may slow the page down. A PNG of it draws faster.`);
        f.text().then((src) => {
          const doc = new DOMParser().parseFromString(src, "image/svg+xml");
          const said = [...doc.querySelectorAll("title, desc, text")].map((n) => n.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
          const words = [...new Set(said)].join(" · ").split(" ");
          if (words.length && words[0]) im.words = words.slice(0, 60).join(" ") + (words.length > 60 ? " …" : "");
        }).catch(() => {});
      }
    }
  }
  addEventListener("drop", (e) => noteFiles(e.dataTransfer?.files), true);
  addEventListener("paste", (e) => noteFiles(e.clipboardData?.files), true);
  addEventListener("change", (e) => { if (e.target?.type === "file") noteFiles(e.target.files); }, true);
  if (window.showOpenFilePicker) {
    const pick = window.showOpenFilePicker.bind(window);
    window.showOpenFilePicker = async (...a) => { const hs = await pick(...a); noteFiles(await Promise.all(hs.map((h) => h.getFile()))); return hs; };
  }
  // a Mermaid diagram (More tools → Mermaid to Excalidraw): its source is kept, the diagram's own words
  function noteMermaid() {
    const src = document.querySelector(".ttd-dialog textarea")?.value?.trim();
    if (src && t0 != null) { session.events.push({ t: clock(), type: "mermaid", source: src.slice(0, 4000) }); sceneChanged(); }
  }
  addEventListener("click", (e) => { const b = e.target.closest?.(".ttd-dialog button"); if (b && /insert/i.test(b.textContent)) noteMermaid(); }, true);
  addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && e.target.closest?.(".ttd-dialog")) noteMermaid(); }, true);
  // where an element really is: a freehand stroke, line or arrow is anchored at its first point, and its other points
  // can run left of it or above it, so its box comes from its points, not from x, y
  const boxOf = (el) => {
    if (!el.points?.length) return { x: el.x, y: el.y, w: el.width, h: el.height };
    const xs = el.points.map((p) => p[0]), ys = el.points.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    return { x: el.x + x0, y: el.y + y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
  };
  // how a person sees an element, beyond its words: dashed or dotted, its colours (a choice of meaning: "red is where
  // it breaks", "dashed is a guess"), a frame's name, which frame it sits in; only what differs from a plain one
  const looks = (el, b) => {
    if (el.strokeStyle && el.strokeStyle !== "solid") b.strokeStyle = el.strokeStyle;
    if (el.strokeColor && el.strokeColor !== "#1e1e1e") b.strokeColor = el.strokeColor;
    if (el.backgroundColor && el.backgroundColor !== "transparent") b.backgroundColor = el.backgroundColor;
    if (el.name) b.name = el.name; if (el.frameId) b.frame = el.frameId; if (el.link) b.link = el.link;
    const cd = el.customData || {}; if (cd.status) b.status = cd.status; if (cd.inside) b.inside = cd.inside; if (cd.tagFor) b.tagFor = cd.tagFor;
    // a part of an icon from the library (icons.js): which icon, and which one of them (its own group)
    if (cd.icon) { b.icon = cd.icon; b.iconGroup = el.groupIds?.[0] || el.id; }
    if (el.type === "image") { const im = images.get(el.id) || {}, f = el.fileId && api?.getFiles()[el.fileId]; if (!im.type && f?.mimeType) im.type = f.mimeType; images.set(el.id, im); b.image = im; }
    if (el.type === "embeddable" || el.type === "iframe") b.embed = el.link || null;
    return b;
  };
  const brief = (el) => {
    const bx = boxOf(el), b = { id: el.id, kind: el.type, x: Math.round(bx.x), y: Math.round(bx.y), w: Math.round(bx.w), h: Math.round(bx.h) };
    const typed = el.originalText ?? el.text;   // as typed: Excalidraw wraps a label to its box ("PaymentServic\ne")
    if (typed) b.text = typed.slice(0, 300);
    if (el.containerId) b.in = el.containerId;
    b.from = el.startBinding?.elementId || null; b.to = el.endBinding?.elementId || null;
    if (el.type !== "arrow" && el.type !== "line") { delete b.from; delete b.to; }
    looks(el, b);
    // a restyle back to plain is a change too: say so in the event
    if (prevLooks.has(el.id)) for (const k of ["strokeStyle", "strokeColor", "backgroundColor"]) if (prevLooks.get(el.id)[k] && !b[k]) b[k] = k === "strokeStyle" ? "solid" : k === "strokeColor" ? "#1e1e1e" : "transparent";
    prevLooks.set(el.id, { strokeStyle: b.strokeStyle, strokeColor: b.strokeColor, backgroundColor: b.backgroundColor });
    return b;
  };
  const prevLooks = new Map();
  function onScene(elements) {
    // an element can also leave the scene outright (a scene replaced, a library cleared) rather than be marked deleted
    if (elements.length < known.size) {
      const here = new Set(elements.map((e) => e.id));
      for (const [id, k] of known) if (!here.has(id)) {
        known.delete(id);
        if (t0 != null && !k.isDeleted) { session.events.push({ t: clock(), type: "delete", id }); sceneChanged(); }
      }
    }
    for (const el of elements) {
      const prev = known.get(el.id);
      if (prev && prev.version === el.version) continue;
      known.set(el.id, { version: el.version, isDeleted: el.isDeleted });
      if (!prev && el.type === "image" && !images.has(el.id)) images.set(el.id, pendingFiles.shift() || {});
      if (t0 == null) { if (!prev && !el.isDeleted) session.before_recording++; continue; }
      const t = clock();
      if (!prev) { if (!el.isDeleted) session.events.push({ t, type: "add", ...brief(el) }); }
      else if (el.isDeleted && !prev.isDeleted) session.events.push({ t, type: "delete", id: el.id, kind: el.type });
      else if (!el.isDeleted && prev.isDeleted) session.events.push({ t, type: "restore", ...brief(el) });
      else if (!el.isDeleted) {
        // a drag or a stroke changes an element dozens of times a second: one event per burst, with when it ended
        const last = lastLogged.get(el.id);
        if (last && t - (last.until ?? last.t) < 0.6) { last.until = t; Object.assign(last, brief(el)); }
        else { const ev = { t, type: "update", ...brief(el) }; session.events.push(ev); lastLogged.set(el.id, ev); }
      } else continue;
      sceneChanged();
    }
  }
  createRoot($("canvas")).render(React.createElement(Excalidraw, {
    excalidrawAPI: (a) => { api = a; setTimeout(() => a.updateLibrary({ libraryItems: window.reelIcons?.(convertToExcalidrawElements) || [], merge: true }).catch(() => {}), 0); },
    onChange: (elements, appState) => { onScene(elements); onSelect(appState); },
    initialData: { appState: { viewBackgroundColor: "#ffffff", currentItemFontFamily: 5 } },
    UIOptions: { canvasActions: { export: false, saveToActiveFile: false, loadScene: true, toggleTheme: false } },
  }));

  // where the pointer is, drawn into the recording, so "this goes here" has a here
  const pointer = { x: -1, y: -1, down: false };
  addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });

  // what the pointer rests on while they talk: "this one" has a referent. Every 100 ms while recording, the element
  // under the pointer (in the drawing's own coordinates); a rest of 0.4 s or more is kept as { t0, t1, id }
  let resting = null;
  function under() {
    if (!api || pointer.x < 0) return null;
    const s = api.getAppState(), z = s.zoom?.value || 1, x = (pointer.x - (s.offsetLeft || 0)) / z - s.scrollX, y = (pointer.y - (s.offsetTop || 0)) / z - s.scrollY;
    let best = null, area = Infinity;
    for (const e of live()) {
      const id = e.containerId || e.id, pad = e.type === "arrow" || e.type === "line" ? 12 : 4, bx = boxOf(e);
      const x0 = bx.x - pad, x1 = bx.x + bx.w + pad, y0 = bx.y - pad, y1 = bx.y + bx.h + pad;
      if (x < x0 || x > x1 || y < y0 || y > y1 || e.type === "freedraw") continue;
      const a = e.type === "frame" ? Infinity - 1 : (x1 - x0) * (y1 - y0);   // a frame only when nothing in it is under
      if (a < area) { area = a; best = id; }
    }
    return best;
  }
  // a rest of 0.4 s or more is a gesture; one much longer is a gesture and then a mouse left lying there: its first
  // 8 s are kept (the pointing), not the rest of the time it lay there
  function restEnd(t) { if (resting && t - resting.t0 >= 0.4 && session.pointer.length < 3000) session.pointer.push({ t0: resting.t0, t1: +Math.min(t, resting.t0 + 8).toFixed(2), id: resting.id }); resting = null; }
  setInterval(() => {
    if (t0 == null || pausedAt != null) return restEnd(clock() ?? 0);
    // not while drawing (the pointer is on what it draws) or typing a note (the mouse just lies there)
    const id = pointer.down || document.activeElement?.id === "note" ? null : under(), t = clock();
    if (resting?.id === id) return;
    restEnd(t); if (id) resting = { id, t0: t };
  }, 100);
  addEventListener("pointerdown", () => { pointer.down = true; }, { passive: true });
  addEventListener("pointerup", () => { pointer.down = false; }, { passive: true });

  // ---------- the partner: at a picture, maybe one short question (scripts/lib/sketch-partner.mjs) ----------
  let asking$ = null;   // the question in flight, dropped at Finish
  let partner = null, asking = false, lastAsk = -Infinity, heardSinceAsk = true;
  const remember = (on) => { try { localStorage.setItem("reelplanner.sketch.partner", on ? "on" : "off"); } catch {} };
  function partnerOn() { try { return localStorage.getItem("reelplanner.sketch.partner") !== "off"; } catch { return true; } }
  $("partner-on").addEventListener("change", (e) => { remember(e.target.checked); if (session.partner) session.partner.on = e.target.checked; if (!e.target.checked) { $("ask").classList.remove("show"); thinking(null); } });
  $("ask-close").addEventListener("click", () => $("ask").classList.remove("show"));
  const toDataUrl = (blob) => new Promise((r) => { const f = new FileReader(); f.onload = () => r(f.result); f.onerror = () => r(null); f.readAsDataURL(blob); });
  // the partner deciding, shown as it comes: a pulsing line with what it is looking at (and its thinking, where the
  // model shows it), then the question typed out in the card; when it holds back, the line says so and fades
  let thinkFade = null;
  function thinking(html, done) {
    clearTimeout(thinkFade); const t = $("think");
    if (html == null) { t.classList.remove("show", "fade", "done"); return; }
    $("think-text").innerHTML = html; t.classList.add("show"); t.classList.remove("fade"); t.classList.toggle("done", !!done);
    if (done) thinkFade = setTimeout(() => { t.classList.add("fade"); thinkFade = setTimeout(() => thinking(null), 700); }, 4500);
  }
  const tail = (x, n = 160) => (x = x.replace(/\s+/g, " ").trim()).length > n ? "…" + x.slice(-n) : x;
  async function ask(kf, blob) {
    const P = session.partner;
    // not while paused or at Finish: they are not sketching then, and a question would arrive after they have sent
    if (!partner || !P || !$("partner-on").checked || asking || !blob || !heardSinceAsk || pausedAt != null || $("review").classList.contains("open")) return;
    if (P.questions.length >= partner.max || clock() - lastAsk < partner.gap_s) return;
    asking = true; lastAsk = clock(); heardSinceAsk = false;
    const sentAt = performance.now(), at = clock(), late = () => (performance.now() - sentAt) / 1000 > partner.stale_s;
    let shown = false, a = {};
    try {
      const said = [...session.transcript.segments.map((x) => ({ t: x.t0, text: x.text })), ...session.notes.filter((n) => n.t != null).map((n) => ({ t: n.t, text: `(typed) ${n.text}` }))].sort((a, b) => a.t - b.t);
      asking$ = new AbortController();
      thinking(`${esc(partner.label.split(" ")[0])} is looking at your picture…`);
      const r = await fetch("api/sketch/partner", { method: "POST", headers: { "content-type": "application/json", accept: "application/x-ndjson" }, signal: asking$.signal,
        body: JSON.stringify({ question: $("question").value.trim(), elements: drawn(), said, asked: P.questions.map((q) => ({ t: q.t, text: q.text })), png: await toDataUrl(blob) }) });
      if (!r.ok || !r.body) { const j = await r.json().catch(() => ({})); throw new Error(j.error || r.status); }
      const reader = r.body.getReader(), dec = new TextDecoder(); let buf = "";
      for (;;) {
        const { value, done } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true }); let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i); buf = buf.slice(i + 1); if (!line.trim()) continue;
          a = JSON.parse(line);
          if (!a.ok) throw new Error(a.error);
          if (a.done || late() || !$("partner-on").checked) continue;
          // as it comes: its thinking, what it is looking at, then the question
          if (a.text) {
            if (!shown) { shown = true; thinking(null); $("ask").removeAttribute("data-done"); $("ask-who").textContent = `A question · ${partner.label}`; $("ask").classList.add("show"); }
            $("ask-text").textContent = a.text; $("ask-about").textContent = a.looking ? `looking at: ${a.looking}` : "";
          } else if (a.looking || a.thinking) thinking(`${a.looking ? `Looking at: ${esc(a.looking)}` : ""}${a.thinking ? `${a.looking ? "<br>" : ""}<i>${esc(tail(a.thinking))}</i>` : ""}`);
        }
      }
      if (!a.done) throw new Error("the answer stopped short");
      const took = (performance.now() - sentAt) / 1000;
      if (a.text && took > partner.stale_s) {
        // about a picture they have moved on from: not shown. A model this slow here (a CPU busy recording) only
        // gets in the way, so after two it stops for this sketch
        P.late = (P.late || 0) + 1; heardSinceAsk = true; thinking(null); if (shown) $("ask").classList.remove("show");
        if (P.late >= 2) { P.stopped = "too slow here"; $("partner-on").checked = false; status(`${partner.label} takes ${Math.round(took)} s to ask here, too late to help: questions are off for this sketch.`); }
        else status(`${partner.label} took ${Math.round(took)} s to ask (about an earlier picture): not shown.`);
        return;
      }
      if (!a.text || !$("partner-on").checked) {
        // held back: what it looked at, kept, and said for a moment
        heardSinceAsk = true; (P.held ??= []).push({ t: at, after_picture: kf.n, looking: a.looking || null });
        if ($("partner-on").checked) thinking(`Nothing to ask yet${a.looking ? ` · looked at: ${esc(a.looking)}` : ""}`, true); else thinking(null);
        return;
      }
      P.questions.push({ t: clock(), after_picture: kf.n, text: a.text, ...(a.looking ? { looking: a.looking } : {}) });
      thinking(null);
      $("ask-who").textContent = `A question · ${partner.label}`; $("ask-text").textContent = a.text; $("ask-about").textContent = a.looking ? `looking at: ${a.looking}` : "";
      $("ask").setAttribute("data-done", ""); $("ask").classList.add("show");
    } catch (e) {
      heardSinceAsk = true; thinking(null); if (shown) $("ask").classList.remove("show");
      if (e.name !== "AbortError") status(`The question partner did not answer (${e.message}); keep going.`);
    } finally { asking = false; }
  }

  // ---------- keyframes: a picture each time a thought ends ----------
  let said = [], dirty = false, kfTimer = null, hearing = false;
  function sceneChanged() { dirty = true; if (!hearing) schedule(2500); }
  function schedule(ms) { clearTimeout(kfTimer); kfTimer = setTimeout(keyframe, ms); }
  const live = () => api ? api.getSceneElements().filter((e) => !e.isDeleted) : [];
  // the scene as the record keeps it: each element by kind, a box's label, an arrow's two ends
  function drawn() {
    const elements = live(), byId = new Map(elements.map((e) => [e.id, e]));
    return elements.filter((e) => !e.containerId).map((e) => {
      const bx = boxOf(e), b = { id: e.id, kind: e.type, x: Math.round(bx.x), y: Math.round(bx.y), w: Math.round(bx.w), h: Math.round(bx.h) };
      const label = e.boundElements?.map((x) => byId.get(x.id)).find((x) => x?.type === "text");
      if (e.text) b.text = e.originalText ?? e.text; if (label) b.label = label.originalText ?? label.text;
      if (e.startBinding?.elementId) b.from = e.startBinding.elementId; if (e.endBinding?.elementId) b.to = e.endBinding.elementId;
      if (e.groupIds?.length) b.groups = e.groupIds;
      if ((e.type === "arrow" || e.type === "line") && e.points?.length) { const p0 = e.points[0], p = e.points[e.points.length - 1]; b.start = [Math.round(e.x + p0[0]), Math.round(e.y + p0[1])]; b.end = [Math.round(e.x + p[0]), Math.round(e.y + p[1])]; }
      return looks(e, b);
    });
  }
  async function snapshot() {
    const elements = live();
    if (!elements.length) return null;
    return exportToBlob({ elements, appState: { ...api.getAppState(), exportBackground: true, exportWithDarkMode: false, viewBackgroundColor: "#ffffff" },
      files: api.getFiles(), mimeType: "image/png", exportPadding: 24 });
  }
  async function keyframe() {
    clearTimeout(kfTimer);
    if (t0 == null || pausedAt != null || (!dirty && !said.length)) return;
    const t = clock(), n = session.keyframes.length + 1, text = said.join(" ").trim();
    said = []; dirty = false;
    const blob = await snapshot().catch(() => null);
    const file = blob ? `keyframes/kf-${String(n).padStart(3, "0")}.png` : null;
    if (blob) files.set(file, blob);
    const kf = { n, t, said: text, file, elements: live().length };
    session.keyframes.push(kf);
    if (text) heardSinceAsk = true;
    ask(kf, blob);
  }

  // ---------- recording: the canvas layers composed into one picture, with the mic ----------
  let recorder = null, chunks = [], mic = null, draw = 0, mime = "", out = null;
  function compose() {
    const ctx = out.getContext("2d"), W = out.width, H = out.height;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
    for (const c of document.querySelectorAll("#canvas canvas")) if (c.width && c.height) ctx.drawImage(c, 0, 0, W, H);
    if (pointer.x >= 0) {
      const sx = W / innerWidth, r = (pointer.down ? 9 : 7) * sx;
      ctx.beginPath(); ctx.arc(pointer.x * sx, pointer.y * sx, r, 0, Math.PI * 2);
      ctx.fillStyle = pointer.down ? "rgba(184,85,46,.55)" : "rgba(184,85,46,.35)"; ctx.fill();
    }
    draw = requestAnimationFrame(compose);
  }
  async function startRecording() {
    const scale = Math.min(devicePixelRatio || 1, 2, 1920 / innerWidth);
    out = document.createElement("canvas");
    out.width = Math.round(innerWidth * scale / 2) * 2; out.height = Math.round(innerHeight * scale / 2) * 2;
    try { mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
    catch { mic = null; status("No microphone: recording the drawing only. Type notes instead."); }
    compose();
    const stream = out.captureStream(30);
    if (mic) for (const tr of mic.getAudioTracks()) stream.addTrack(tr);
    mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"].find((m) => window.MediaRecorder?.isTypeSupported(m)) || "";
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 2_500_000 } : undefined);
    mime = recorder.mimeType || mime || "video/webm";
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.start(1000);
    t0 = now();
    if (mic) startSpeech();
  }

  // ---------- speech: the browser's own recognizer, live; the audio is kept either way ----------
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let sr = null, segStart = null, listening = false;
  function startSpeech() {
    if (!SR) { status("No live transcript in this browser. Your voice is still recorded and can be transcribed afterwards."); return; }
    sr = new SR(); sr.continuous = true; sr.interimResults = true; sr.lang = navigator.language || "en-US";
    session.transcript.source = "browser-speech"; session.transcript.lang = sr.lang;
    sr.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i], text = r[0].transcript.trim();
        if (segStart == null) segStart = clock();
        if (r.isFinal) {
          if (text) {
            session.transcript.segments.push({ t0: segStart, t1: clock(), text, confidence: +(r[0].confidence || 0).toFixed(2) });
            said.push(text); caption(text, "");
          }
          segStart = null; hearing = false; schedule(700);
        } else { interim += text + " "; hearing = true; }
      }
      if (interim) caption("", interim.trim());
    };
    sr.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") { session.transcript.source = "none"; status("Live transcript is blocked here; your voice is still recorded."); } };
    sr.onend = () => { if (listening) try { sr.start(); } catch {} };
    listening = true; try { sr.start(); } catch {}
  }
  function stopSpeech() { listening = false; try { sr?.stop(); } catch {} }
  let capTimer = 0;
  function caption(final, interim) {
    const c = $("caption"); c.innerHTML = "";
    if (final) c.append(final + " ");
    if (interim) { const s = document.createElement("span"); s.className = "interim"; s.textContent = interim; c.append(s); }
    c.classList.add("show"); clearTimeout(capTimer); capTimer = setTimeout(() => c.classList.remove("show"), 3500);
  }
  function status(text) { $("status").textContent = text; }

  // ---------- what a whiteboard cannot do: link to code, open a box up, today vs proposed ----------
  // When something is selected a small bar offers: Link to code (then "@" and part of a path in the note box, a file
  // of the repo picked from a list: the element's link), Open up (a named frame beside it for its insides, an arrow
  // from it, and the view goes there; Back returns), and Today / New / Going (a small tag on it, and in the record).
  let selected = [], linkFor = null, fileList = [], fileOn = 0;
  const kin = () => api.getSceneElementsIncludingDeleted();
  const bumped = (e, patch) => ({ ...e, ...patch, version: e.version + 1, versionNonce: Math.floor(Math.random() * 2 ** 31), updated: Date.now() });
  const commit = (changed, added = []) => api.updateScene({ elements: [...kin().map((e) => changed.get(e.id) || e), ...added], captureUpdate: CaptureUpdateAction.IMMEDIATELY });
  // an icon's part stands for the icon (its label, the text in its group); a picture goes by its file's name
  const iconText = (el) => el.customData?.icon && kin().find((t) => t.type === "text" && !t.isDeleted && t.customData?.icon && t.groupIds?.[0] === el.groupIds?.[0]);
  const words = (el) => { const l = kin().find((t) => t.containerId === el.id && !t.isDeleted) || iconText(el); return String(l?.originalText ?? l?.text ?? el.originalText ?? el.text ?? el.name ?? images.get(el.id)?.name ?? el.type).replace(/\s+/g, " ").trim(); };
  function onSelect(appState) {
    if (!api) return;
    document.body.classList.toggle("sidebar-open", !!appState.openSidebar);   // the library open: the side column moves left of it
    const ids = Object.keys(appState.selectedElementIds || {}).filter((id) => appState.selectedElementIds[id]);
    // an icon selected is its parts: one of them (not its label) stands for it, so it gets one tag, one link
    const seen = new Set();
    const els = api.getSceneElements().filter((e) => ids.includes(e.id) && !e.containerId && e.type !== "freedraw" && !e.customData?.tagFor)
      .filter((e) => { if (!e.customData?.icon) return true; const g = e.groupIds?.[0]; if (e.type === "text" || seen.has(g)) return false; seen.add(g); return true; });
    const key = els.map((e) => `${e.id}:${e.version}`).join();
    if (key === selected.key) return;
    selected = Object.assign(els, { key }); renderSel();
  }
  function renderSel() {
    const bar = $("sel"), one = selected.length === 1 ? selected[0] : null;
    bar.classList.toggle("show", selected.length > 0 && !$("review").classList.contains("open"));
    if (!selected.length) return;
    const what = $("sel-what"); what.textContent = one ? `"${words(one)}"` : `${selected.length} things`;
    if (one?.link) { const c = document.createElement("code"); c.textContent = ` → ${one.link}`; what.append(c); }
    $("sel-link").hidden = !one || one.type === "frame";
    $("sel-link").textContent = one?.link ? "Change link" : "Link to code";
    const opened = one && kin().find((f) => f.type === "frame" && !f.isDeleted && f.customData?.inside === one.id);
    $("sel-open").hidden = !one || !(one.customData?.inside || one.customData?.icon || ["rectangle", "ellipse", "diamond", "image"].includes(one.type));
    $("sel-open").textContent = one?.customData?.inside ? "Back" : opened ? "Go inside" : "Open up";
    const st = new Set(selected.map((e) => e.customData?.status || ""));
    for (const b of bar.querySelectorAll("[data-status]")) b.setAttribute("aria-pressed", String(st.size === 1 && st.has(b.dataset.status)));
  }
  // link: the note box becomes a file picker until Enter (link it) or Escape
  $("sel-link").addEventListener("click", () => { linkFor = selected[0]?.id; const n = $("note"); n.value = "@"; n.focus(); suggest(); });
  async function suggest() {
    const n = $("note"), box = $("files");
    if (!linkFor || !n.value.startsWith("@")) { box.classList.remove("show"); return; }
    const q = n.value.slice(1);
    try { const r = await fetch(`api/sketch/files?q=${encodeURIComponent(q)}`); fileList = (await r.json()).files || []; } catch { fileList = []; }
    fileOn = 0; box.innerHTML = "";
    const hint = document.createElement("li"); hint.className = "hint";
    hint.textContent = `Link "${words(kin().find((e) => e.id === linkFor) || {})}" to a file: type part of its path; :line or #name after it to point inside. Enter links, Esc leaves.`;
    box.append(hint);
    fileList.forEach((f, i) => { const li = document.createElement("li"); li.textContent = f; li.setAttribute("role", "option"); if (!i) li.className = "on"; li.onmousedown = (e) => { e.preventDefault(); link(f + (q.match(/[:#].*$/)?.[0] || "")); }; box.append(li); });
    box.classList.add("show");
  }
  function link(target) {
    const el = kin().find((e) => e.id === linkFor && !e.isDeleted); linkFor = null; $("files").classList.remove("show"); $("note").value = "";
    if (!el || !target) return;
    commit(new Map([[el.id, bumped(el, { link: target })]]));
    status(`Linked "${words(el)}" to ${target}.`);
  }
  $("note").addEventListener("input", () => { if (linkFor) suggest(); });
  $("note").addEventListener("keydown", (e) => {
    if (!linkFor) return;
    const items = [...$("files").querySelectorAll("li[role=option]")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); fileOn = (fileOn + (e.key === "ArrowDown" ? 1 : -1) + items.length) % Math.max(1, items.length); items.forEach((li, i) => li.classList.toggle("on", i === fileOn)); return; }
    if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); linkFor = null; $("files").classList.remove("show"); $("note").value = ""; return; }
    if (e.key === "Enter") {
      e.preventDefault(); e.stopImmediatePropagation();   // not a note
      const typed = $("note").value.slice(1).trim(), at = typed.match(/[:#].*$/)?.[0] || "";
      link(fileList[fileOn] ? fileList[fileOn] + at : typed);
    }
  });
  // the view on some things, fitted into the part of the window nothing covers: right of Excalidraw's style panel,
  // left of the topic and question column, below the toolbar, above the selection and note bars. (Excalidraw's own
  // scrollToContent centres on the whole window, which put an opened-up frame half under the question card.)
  function fitView(els, maxZoom) {
    if (!els.length) return;
    const bs = els.map(boxOf), x0 = Math.min(...bs.map((b) => b.x)), y0 = Math.min(...bs.map((b) => b.y));
    const w = Math.max(1, Math.max(...bs.map((b) => b.x + b.w)) - x0), h = Math.max(1, Math.max(...bs.map((b) => b.y + b.h)) - y0);
    const wide = innerWidth >= 900, side = $("side").getBoundingClientRect();
    const left = wide ? 210 : 16, right = wide && side.width ? side.left - 16 : innerWidth - 16, top = 72, bottom = innerHeight - (wide ? 170 : 220);
    const zoom = Math.max(0.1, Math.min((right - left - 48) / w, (bottom - top - 48) / h, maxZoom));
    api.updateScene({ appState: { zoom: { value: zoom }, scrollX: (left + right) / 2 / zoom - (x0 + w / 2), scrollY: (top + bottom) / 2 / zoom - (y0 + h / 2) } });
  }
  // open up: a frame beside the thing for its insides (to the right of everything, level with it), an arrow to it
  $("sel-open").addEventListener("click", () => {
    const el = selected[0]; if (!el) return;
    if (el.customData?.inside) { fitView(api.getSceneElements(), 1); return; }
    const opened = kin().find((f) => f.type === "frame" && !f.isDeleted && f.customData?.inside === el.id);
    if (opened) { fitView([opened], 1.5); return; }
    const live2 = api.getSceneElements(), right = Math.max(...live2.map((e) => e.x + Math.max(e.width, 0)));
    const W = 620, H = 400, x = right + 160, y = el.y + el.height / 2 - H / 2;
    const [f] = convertToExcalidrawElements([{ type: "frame", x, y, width: W, height: H, name: `inside ${words(el)}`, children: [] }]);
    const sx = el.x + el.width + 6, sy = el.y + el.height / 2;
    const arrowEls = convertToExcalidrawElements([{ type: "arrow", x: sx, y: sy, points: [[0, 0], [x - 12 - sx, y + H / 2 - sy]], strokeStyle: "dashed", label: { text: "inside" } }]);
    const a = arrowEls.find((e) => e.type === "arrow");
    const arrow = { ...a, startBinding: { elementId: el.id, focus: 0, gap: 6 }, customData: { inside: el.id } };
    commit(new Map([[el.id, bumped(el, { boundElements: [...(el.boundElements || []), { id: a.id, type: "arrow" }] })]]),
      [{ ...f, customData: { inside: el.id } }, arrow, ...arrowEls.filter((e) => e !== a)]);
    api.updateScene({ appState: { selectedElementIds: { [f.id]: true } } });
    fitView([f], 1.5);
    status(`Draw what is inside "${words(el)}" in the frame; Back returns to the whole picture.`);
  });
  // today / new / going: a tag on the thing (grouped with it, so they move together), and its status in the record
  const TAG = { today: ["today", "#868e96"], new: ["+ new", "#2f9e44"], going: ["− going", "#e03131"] };
  for (const b of $("sel").querySelectorAll("[data-status]")) b.addEventListener("click", () => {
    const want = b.dataset.status, changed = new Map(), added = [];
    const clear = selected.every((e) => e.customData?.status === want);   // pressed again: unmark
    for (const el0 of selected) {
      const el = kin().find((e) => e.id === el0.id); if (!el) continue;
      const old = el.customData?.tag && kin().find((e) => e.id === el.customData.tag && !e.isDeleted);
      if (old) changed.set(old.id, bumped(old, { isDeleted: true }));
      if (clear) { changed.set(el.id, bumped(el, { customData: { ...el.customData, status: undefined, tag: undefined } })); continue; }
      const g = (el.groupIds || [])[0] || `tag-${el.id}`, [t] = convertToExcalidrawElements([{ type: "text", x: 0, y: 0, text: TAG[want][0], fontSize: 14, strokeColor: TAG[want][1] }]);
      const pts = el.points?.length ? el.points.map((p) => [el.x + p[0], el.y + p[1]]) : null;
      const at = pts ? { x: (pts[0][0] + pts.at(-1)[0]) / 2 + 8, y: (pts[0][1] + pts.at(-1)[1]) / 2 - 26 } : { x: el.x + el.width - t.width, y: el.y - t.height - 4 };
      added.push({ ...t, ...at, groupIds: [g], customData: { tagFor: el.id } });
      changed.set(el.id, bumped(el, { groupIds: el.groupIds?.length ? el.groupIds : [g], customData: { ...el.customData, status: want, tag: t.id } }));
    }
    commit(changed, added); renderSel();
  });

  // ---------- notes: typed, timestamped, and put on the canvas where you're looking ----------
  $("note").addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !e.target.value.trim()) return;
    e.preventDefault();
    const text = e.target.value.trim(); e.target.value = "";
    const note = { t: clock(), text, elementId: null };
    if (api) {
      // under what is already drawn, so a note never lands on top of a box; on an empty canvas, near the middle
      const s = api.getAppState(), z = s.zoom?.value || 1, els = live();
      let x = -s.scrollX + (s.width / 2 - 160) / z, y = -s.scrollY + (s.height / 3) / z;
      if (els.length) { x = Math.min(...els.map((e) => e.x + Math.min(e.width, 0))); y = Math.max(...els.map((e) => e.y + Math.max(e.height, 0))) + 40; }
      const [el] = convertToExcalidrawElements([{ type: "text", x, y, text, fontSize: 20, strokeColor: "#9C4524" }]);
      api.updateScene({ elements: [...api.getSceneElementsIncludingDeleted(), el], captureUpdate: CaptureUpdateAction?.IMMEDIATELY });
      note.elementId = el.id;
    }
    session.notes.push(note);
    if (t0 != null) { said.push(`(typed) ${text}`); schedule(400); }
  });

  // ---------- the bar ----------
  const recBtn = $("rec"), finBtn = $("finish");
  setInterval(() => { const s = clock(); if (s != null) $("clock").textContent = fmt(s); }, 250);
  recBtn.addEventListener("click", async () => {
    if (t0 == null) {
      recBtn.disabled = true; await startRecording(); recBtn.disabled = false;
      recBtn.classList.add("on"); recBtn.querySelector(".label").textContent = "Pause";
      finBtn.disabled = false; if (!$("status").textContent.startsWith("No")) status("");
    } else if (pausedAt == null) pause(); else resume();
  });
  function pause() { restEnd(clock()); keyframe(); recorder?.pause(); stopSpeech(); pausedAt = now(); recBtn.classList.remove("on"); recBtn.querySelector(".label").textContent = "Resume"; }
  // a pause is a thought too: kept with how long it lasted, though the recording's clock stands still through it
  function resume() { session.pauses.push({ t: clock(), seconds: +((now() - pausedAt) / 1000).toFixed(1) }); pausedTotal += now() - pausedAt; pausedAt = null; recorder?.resume(); if (mic) startSpeech(); recBtn.classList.add("on"); recBtn.querySelector(".label").textContent = "Pause"; }

  // ---------- finish: show exactly what will be sent ----------
  let previewUrl = null;
  finBtn.addEventListener("click", async () => {
    asking$?.abort();
    if (pausedAt == null) pause();
    await keyframe();
    await new Promise((r) => { if (recorder?.state === "paused" || recorder?.state === "recording") { recorder.addEventListener("dataavailable", r, { once: true }); recorder.requestData(); } else r(); });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(new Blob(chunks, { type: mime }));
    $("playback").src = previewUrl;
    const tr = $("transcript"); tr.innerHTML = "";
    const lines = [...session.transcript.segments.map((s) => ({ t: s.t0, text: s.text })), ...session.notes.filter((n) => n.t != null).map((n) => ({ t: n.t, text: `(typed) ${n.text}` })),
      ...(session.partner?.questions || []).map((q) => ({ t: q.t, text: `(asked) ${q.text}`, asked: true }))].sort((a, b) => a.t - b.t);
    if (!lines.length) tr.innerHTML = `<p style="color:var(--ink-3)">${session.transcript.source === "none" ? "No live transcript; the audio is in the recording." : "Nothing said yet."}</p>`;
    for (const l of lines) { const p = document.createElement("p"); if (l.asked) p.className = "asked"; const tm = document.createElement("time"); tm.textContent = fmt(l.t); p.append(tm, l.text); p.onclick = () => { $("playback").currentTime = l.t; }; tr.append(p); }
    const fr = $("frames"); fr.innerHTML = "";
    for (const k of session.keyframes) {
      const d = document.createElement("div"); d.className = "kf";
      if (k.file) { const img = document.createElement("img"); img.src = URL.createObjectURL(files.get(k.file)); img.alt = `Canvas at ${fmt(k.t)}`; d.append(img); }
      const tm = document.createElement("time"); tm.textContent = fmt(k.t); d.append(tm, k.said || "(drawing)"); fr.append(d);
    }
    $("counts").textContent = `${session.keyframes.length} pictures · ${session.events.length} edits · ${fmt(clock() || 0)}`;
    $("sent").style.display = "none";
    $("review").classList.add("open"); $("sel").classList.remove("show"); $("files").classList.remove("show");
  });
  $("keep").addEventListener("click", () => { $("review").classList.remove("open"); resume(); });

  // ---------- the bundle ----------
  async function bundle() {
    await new Promise((r) => { if (!recorder || recorder.state === "inactive") return r(); recorder.addEventListener("stop", r, { once: true }); recorder.stop(); });
    cancelAnimationFrame(draw); mic?.getTracks().forEach((t) => t.stop());
    const ext = mime.includes("mp4") ? "mp4" : "webm";
    const finalEls = drawn();
    const finalPng = await snapshot().catch(() => null);
    const body = {
      ...session, question: $("question").value.trim(), created: new Date().toISOString(),
      duration_s: clock(), feedback: $("feedback").value.trim(),
      recording: { file: `recording.${ext}`, mime, has_audio: !!mic, width: out?.width, height: out?.height, pointer_drawn: true },
      final: { png: finalPng ? "final.png" : null, scene: "final.excalidraw", elements: finalEls },
    };
    const out_ = new Map(files);
    out_.set("session.json", new Blob([JSON.stringify(body, null, 2)], { type: "application/json" }));
    out_.set(`recording.${ext}`, new Blob(chunks, { type: mime }));
    if (finalPng) out_.set("final.png", finalPng);
    out_.set("final.excalidraw", new Blob([serializeAsJSON(api.getSceneElements(), api.getAppState(), api.getFiles(), "local")], { type: "application/json" }));
    return out_;
  }
  let done = false;
  $("send").addEventListener("click", async () => {
    if (done) return; done = true;
    const b = $("send"); b.disabled = true; b.textContent = "Sending…";
    try {
      const fd = new FormData(); for (const [path, blob] of await bundle()) fd.append(path, blob, path.split("/").pop());
      const r = await fetch("api/sketch", { method: "POST", body: fd }), j = await r.json();
      if (!j.ok) throw new Error(j.error || r.statusText);
      if (j.closing) live$?.close();   // the command is done with this page: no reconnecting to it
      const tx = j.transcribing ? ` Your voice is being transcribed on this machine (${esc(j.transcribing)}).` : "";
      sent(j.closing ? `Saved to <code>${esc(j.dir)}</code>.${tx} Your agent has it now; you can close this tab.`
        : `Saved to <code>${esc(j.dir)}</code>.${tx} ${esc(j.next || "")}`);
      b.textContent = "Sent";
    } catch (e) { sent(`Could not send (${esc(e.message)}). Use Download instead.`); b.textContent = "Send failed"; done = false; b.disabled = false; }
  });
  $("download").addEventListener("click", async () => {
    const z = zip(await bundle()); done = true;
    const a = document.createElement("a"); a.href = URL.createObjectURL(await z); a.download = `sketch-${session.id}.zip`; a.click();
    sent("Downloaded. Give the .zip to your agent, or unzip it next to the code it's about.");
  });
  function sent(html) { const s = $("sent"); s.innerHTML = html; s.style.display = "block"; $("keep").disabled = true; }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // a zip with no compression (the video and pictures are compressed already): enough to hand over one file
  const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc32 = (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  async function zip(entries) {
    const enc = new TextEncoder(), parts = [], central = []; let off = 0;
    for (const [path, blob] of entries) {
      const data = new Uint8Array(await blob.arrayBuffer()), name = enc.encode(`sketch-${session.id}/${path}`), crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30)); [[0, 0x04034b50, 4], [4, 20, 2], [8, 0, 2], [14, crc, 4], [18, data.length, 4], [22, data.length, 4], [26, name.length, 2]].forEach(([o, v, n]) => n === 4 ? h.setUint32(o, v, true) : h.setUint16(o, v, true));
      parts.push(h.buffer, name, data);
      const c = new DataView(new ArrayBuffer(46)); [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [16, crc, 4], [20, data.length, 4], [24, data.length, 4], [28, name.length, 2], [42, off, 4]].forEach(([o, v, n]) => n === 4 ? c.setUint32(o, v, true) : c.setUint16(o, v, true));
      central.push(c.buffer, name); off += 30 + name.length + data.length;
    }
    const size = central.reduce((s, p) => s + p.byteLength, 0), e = new DataView(new ArrayBuffer(22));
    [[0, 0x06054b50, 4], [8, entries.size, 2], [10, entries.size, 2], [12, size, 4], [16, off, 4]].forEach(([o, v, n]) => n === 4 ? e.setUint32(o, v, true) : e.setUint16(o, v, true));
    return new Blob([...parts, ...central, e.buffer], { type: "application/zip" });
  }

  // a hook for tests and for the step after this one
  window.reelSketch = { session, get api() { return api; }, keyframe, clock, selected: () => selected.map((e) => e.id), pointing: () => ({ under: under(), pointer: { ...pointer }, resting, active: document.activeElement?.id || document.activeElement?.tagName }) };
})();
