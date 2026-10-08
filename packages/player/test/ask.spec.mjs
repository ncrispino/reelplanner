#!/usr/bin/env node
// Ask about this (videos-that-make-sense step 3, D-226): paused on a scene, a question in your own words, answered from
// the plan, the glossary and the scene, each answer saying where it came from. On L2 with a synthetic map
// (fixtures/l2-access.json, each frame given its narration here, as plan-map now writes it).
//   - nothing to answer here (a static page, no `window.claude`): Ask (Q) opens in the side panel about the scene on
//     screen; the question goes with the review (`questions`, answered: false), and the page says so
//   - hosted, with a stub of the page's `sample` capability: called only on a click (never at load); its input has the
//     instructions, the question, the scene's narration, its plan step and the glossary rows; the answer streams in and
//     its last line, "From: …", shows under it; the review keeps both
//   - the capability's refusals: not_granted hides the hosted path for the rest of the view (the next question goes
//     with the review); rate_limited says so and is never retried by the page
//   - an underlined word's card: "Still unclear? Ask about this" opens Ask with the word in the box
//   - the local page (a stand-in for `reelplanning review`'s /api/ask): a session waiting answers, the page asks
//     until it has, and shows where the answer came from; with none waiting it says so, and it goes with the review
// usage: node packages/player/test/ask.spec.mjs
import { chromium } from "playwright-core"; import { readFileSync, existsSync, statSync } from "node:fs"; import { join, normalize, extname } from "node:path"; import { createServer } from "node:http";
import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked, pageHold } from "./wait.mjs";

const project = "videos/l2-upload-resume", MAP = "packages/player/test/fixtures/l2-access.json";
const map = JSON.parse(readFileSync(join(ROOT, MAP), "utf8"));
for (const f of map.frames) f.narration = `Narration of scene ${f.index}: ${f.title}.`;
const port = testPort(8911);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m, x = "") => { console.log(`${c ? "✓" : "✗"} ${m}${!c && x ? ` — ${String(x).slice(0, 500)}` : ""}`); if (!c) fails.push(m); };
// stub: undefined (no window.claude), or { reply, reject } for the page's `sample` capability
const open = async (stub) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
  await p.route((u) => u.pathname.endsWith("l2-access.json"), (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(map) }));
  if (stub) await p.addInitScript((s) => {
    window.__calls = [];
    const sample = (input, opts = {}) => { window.__calls.push({ input, tier: opts.modelTier || null }); const i = window.__calls.length - 1;
      const r = s.replies[Math.min(i, s.replies.length - 1)];
      return new Promise((ok, no) => setTimeout(() => { if (r.reject) return no({ code: r.reject, message: r.reject }); opts.onText?.({ text: r.text.slice(0, 20), delta: r.text.slice(0, 20) }); setTimeout(() => { opts.onText?.({ text: r.text, delta: r.text.slice(20) }); ok({ text: r.text, truncated: false, modelTierApplied: "quick" }); }, 60); }, 60)); };
    window.claude = { use: async (name) => (name === "sample" ? sample : null) };
  }, stub);
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${MAP}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el.stage?.dataset.ready; }, null, { timeout: 90000 });
  const to = await p.evaluate(() => { const el = document.querySelector("#rp"); el.start?.(); el.player.pause(); el.player.seek(el.planMap.frames[2].start + 1); return el.planMap.frames[2].start + 1; });
  await seeked(p, to); await heard(p); await frames(p);
  return p;
};
// the page has heard who can answer here: the host's `sample` capability, and the local review server (each asked once, at load)
const heard = (p) => p.evaluate(async () => { const el = document.querySelector("#rp"); await el._sampleReady; await el._localReady; });
// the Ask panel open (or closed), drawn
const askOpen = async (p, on = true) => { await until(p, (on) => { const P = document.querySelector("#rp").shadowRoot.querySelector(".dpanel"); return (!P.hidden && P.dataset.ask != null) === on; }, on); await frames(p); };
// the question just asked has its answer, or has gone with the review: the page is no longer asking
const answered = async (p, n) => { await until(p, (n) => { const el = document.querySelector("#rp"); return (el.questions || []).length >= n && !el._asking; }, n); await frames(p); };
const R = (p, fn, arg) => p.evaluate(fn, arg);
const panel = (p) => R(p, () => { const el = document.querySelector("#rp"), P = el.shadowRoot.querySelector(".dpanel"), A = P.querySelector(".ask");
  return { open: !P.hidden && P.dataset.ask != null, h: P.querySelector("h5").textContent, about: A.querySelector(".askabout").textContent, how: A.querySelector(".askhow").textContent, box: A.querySelector("textarea").value,
    items: [...A.querySelectorAll(".asklist li")].map((li) => ({ q: li.querySelector(".aq")?.textContent, a: li.querySelector(".aa")?.textContent, f: [...li.querySelectorAll(".af")].map((x) => x.textContent).join(" | ") })), paused: el.player.paused }; });
const ask = async (p, text) => { await R(p, (t) => { const ta = document.querySelector("#rp").shadowRoot.querySelector(".ask textarea"); ta.value = t; }, text); await R(p, () => document.querySelector("#rp").shadowRoot.querySelector(".ask textarea").focus()); await p.keyboard.press("Enter"); };

try {
  // 1. nothing to answer here: it goes with the review
  {
    const p = await open();
    await R(p, () => document.querySelector("#rp").focus()); await p.keyboard.press("q"); await askOpen(p);
    const s0 = await panel(p);
    ok(s0.open && s0.h === "Ask about this" && /^About scene 3, .+, at \d:\d\d\.$/.test(s0.about) && s0.paused, "Q opens Ask about this in the side panel, about the scene on screen, the video paused", JSON.stringify(s0));
    ok(/goes with your review/.test(s0.how), "with nobody to answer (no window.claude, no review server), the page says the question goes with the review", s0.how);
    await ask(p, "what's the saved review file?"); await answered(p, 1);
    const s1 = await panel(p), exp = await R(p, () => document.querySelector("#rp").exportPayload().questions);
    ok(s1.items.length === 1 && s1.items[0].q === "what's the saved review file?" && /Goes with your review/.test(s1.items[0].a), "the question is listed, going with the review", JSON.stringify(s1.items));
    ok(exp.length === 1 && exp[0].question === "what's the saved review file?" && exp[0].answered === false && exp[0].frame?.index === 3 && !("status" in exp[0]), "the review keeps it: questions[{ question, t, frame, answered: false }]", JSON.stringify(exp));
    await p.keyboard.press("Escape"); await askOpen(p, false);
    ok(!(await panel(p)).open, "Esc closes it");
    await p.close();
  }
  // 2. hosted: the page's `sample` capability answers
  {
    const p = await open({ replies: [{ text: "It is the file the review page writes into the repo when you press Send: your answers, marks and comments.\nFrom: the plan, step 3" }] });
    await pageHold(p, 300);
    ok((await R(p, () => window.__calls.length)) === 0, "hosted: nothing is asked of Claude at load, only on a click");
    await R(p, () => document.querySelector("#rp").shadowRoot.querySelector('[data-act="ask"]').click()); await askOpen(p);
    ok(/Claude answers from the plan, the glossary and this scene/.test((await panel(p)).how), "hosted: the page says Claude answers, on your account, asking the first time", (await panel(p)).how);
    await ask(p, "what's the saved review file?");
    await p.waitForFunction(() => /press Send/.test(document.querySelector("#rp").shadowRoot.querySelector(".asklist .aa")?.textContent || ""), null, { timeout: 5000 }).catch(() => {});
    const s = await panel(p), calls = await R(p, () => window.__calls), inp = calls[0]?.input || "";
    ok(calls.length === 1 && calls[0].tier === "quick", "hosted: one call, on the click, on the quick tier", JSON.stringify(calls.map((c) => c.tier)));
    ok(/Answer only from the material below/.test(inp) && /## The question\nwhat's the saved review file\?/.test(inp) && /Narration: Narration of scene 3/.test(inp) && /## The plan/.test(inp) && /## The glossary\n- /.test(inp) && /From: </.test(inp),
      "hosted: its input carries the instructions, the question, the scene's narration, its plan section and the glossary rows (it remembers nothing)", inp.slice(0, 900));
    ok(s.items[0]?.a.startsWith("It is the file the review page writes") && !/From:/.test(s.items[0].a) && /From: the plan, step 3/.test(s.items[0].f), "hosted: the answer shows, and where it came from under it", JSON.stringify(s.items));
    const exp = await R(p, () => document.querySelector("#rp").exportPayload().questions);
    ok(exp[0]?.via === "claude" && exp[0].from === "the plan, step 3" && /press Send/.test(exp[0].answer) && !("answered" in exp[0]), "hosted: the review keeps the answer, who gave it and where it came from", JSON.stringify(exp));
    // an underlined word's card: Ask about this, with the word in the box
    const hadTerm = await R(p, () => { const el = document.querySelector("#rp"), x = el.termList()[0]; if (!x) return false; el.closeTerms(); el.showTerm({ term: x.key }, { left: 200, top: 300, right: 260, bottom: 320 }); const btn = el.shadowRoot.querySelector('.tpop [data-act="ask-term"]'); if (!btn) return false; btn.click(); return el.termTitle(x); });
    await askOpen(p); await until(p, () => !!document.querySelector("#rp").shadowRoot.querySelector(".dpanel .ask textarea").value);
    const t = await panel(p);
    ok(hadTerm && t.open && t.box === `What does "${hadTerm}" mean here?`, "a word's card: “Still unclear? Ask about this” opens Ask with the word in the box", JSON.stringify({ hadTerm, box: t.box }));
    await p.close();
  }
  // 3. the capability's refusals
  {
    const p = await open({ replies: [{ reject: "not_granted" }, { text: "never\nFrom: x" }] });
    await R(p, () => document.querySelector("#rp").openAsk());
    await ask(p, "first?"); await answered(p, 1);
    const s = await panel(p);
    ok(/isn't allowed to answer on this page/.test(s.items[0]?.a || "") && /goes with your review/.test(s.how), "not_granted: the question goes with the review, and the hosted path is gone for this view", JSON.stringify(s));
    await ask(p, "second?"); await answered(p, 2);
    ok((await R(p, () => window.__calls.length)) === 1, "…the next question is not sent to Claude");
    await p.close();
    const q = await open({ replies: [{ reject: "rate_limited" }] });
    await R(q, () => document.querySelector("#rp").openAsk());
    await ask(q, "again?"); await answered(q, 1); await pageHold(q, 1500);   // and a while after it: never retried
    const r = await panel(q);
    ok(/Too many questions just now/.test(r.items[0]?.a || "") && (await R(q, () => window.__calls.length)) === 1 && /Claude answers/.test(r.how), "rate_limited: said, kept for the review, never retried by the page; the viewer may ask again", JSON.stringify(r));
    await q.close();
  }
  // 4. the local page: the agent session waiting on it answers (a stand-in for the review server's /api/ask)
  {
    const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
    const st = { waiting: true, asked: [], polls: 0 };
    const lport = testPort(8912, 1);
    const lsrv = createServer((req, res) => {
      const u = new URL(req.url, "http://x"), J = (o) => res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(o));
      if (u.pathname === "/api/review") return J({ ok: true, sessionWaiting: st.waiting, agentCommand: null, inbox: 0 });
      if (u.pathname === "/api/ask" && req.method === "POST") { let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => { const q = JSON.parse(body); st.asked.push(q); J(st.waiting ? { ok: true, id: q.id, handledBy: "session", message: "the waiting session has it" } : { ok: true, handledBy: "review", message: "no session" }); }); return; }
      if (u.pathname === "/api/ask") { st.polls++; return J(st.polls < 2 ? { ok: true, answered: false } : { ok: true, answered: true, answer: "The file your review is saved in.", from: "the glossary, \"saved review\"" }); }
      if (u.pathname.endsWith("l2-access.json")) return res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(map));
      const file = join(ROOT, normalize(decodeURIComponent(u.pathname)));
      if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) { const idx = join(file, "index.html"); if (existsSync(idx)) return res.writeHead(200, { "content-type": "text/html" }).end(readFileSync(idx, "utf8").replace(/<head>/i, '<head><meta name="reelplanning-review-server" content="1">')); return res.writeHead(404).end(); }
      res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
    }).listen(lport, "127.0.0.1");
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
    await p.goto(`http://127.0.0.1:${lport}/packages/player/?project=${project}&map=${MAP}`);
    await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
    await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el.stage?.dataset.ready; }, null, { timeout: 90000 });
    const to = await R(p, () => { const el = document.querySelector("#rp"); el.start?.(); el.player.pause(); el.player.seek(el.planMap.frames[2].start + 1); return el.planMap.frames[2].start + 1; });
    await seeked(p, to); await heard(p);
    await R(p, () => document.querySelector("#rp").openAsk()); await askOpen(p);
    ok(/agent session waiting on this page answers/.test((await panel(p)).how), "local: with a session waiting, the page says it answers in a few seconds", (await panel(p)).how);
    await ask(p, "what's the saved review file?");
    await p.waitForFunction(() => /saved in/.test(document.querySelector("#rp").shadowRoot.querySelector(".asklist .aa")?.textContent || ""), null, { timeout: 12000 }).catch(() => {});
    const s = await panel(p), exp = await R(p, () => document.querySelector("#rp").exportPayload().questions);
    ok(st.asked[0]?.question === "what's the saved review file?" && st.asked[0].frame?.index === 3 && /Narration of scene 3/.test(st.asked[0].narration || ""), "local: the question goes to /api/ask with its scene and narration", JSON.stringify(st.asked[0]));
    ok(s.items[0]?.a === "The file your review is saved in." && /From: the glossary/.test(s.items[0].f) && /answered by the agent session/.test(s.items[0].f) && exp[0]?.via === "session", "local: the session's answer shows, with where it came from, and the review keeps it", JSON.stringify({ items: s.items, exp }));
    st.waiting = false;
    await ask(p, "and the list?"); await answered(p, 2);
    const s2 = await panel(p);
    ok(/No agent session is waiting on this page/.test(s2.items[0]?.a || "") && /goes with your review/.test(s2.how), "local: with none waiting, the page says so and the question goes with the review", JSON.stringify(s2));
    await p.close(); lsrv.close();
  }
} finally { await b.close(); srv.kill(); }
console.log(fails.length ? `\n✗ ${fails.length} failed: ${fails.join("; ")}` : "\n✓ ask: all passed");
process.exit(fails.length ? 1 : 0);
