#!/usr/bin/env node
// Deep dives (plan 2026-09-23, contract §4): the Open chip on a beat with a detail, the page (over the
// frame since details-in-the-frame, D-195) that pauses the video and resumes it, comments on a part of the page through the bridge (and only
// from the panel's own frame), Accept / Flag for a walkthrough call from the panel, the plan's own
// text beside the video with the current step lit, and watch.details in the export.
// Details in the frame (plan 2026-09-27): a thing the frame marks (data-detail) is the button: over its box
// once it lands; quiet, so the video comes first (the owner: "the click area should be a bit more subtle"): nothing on
// the frame while it plays, a faint glyph just above the thing while paused, and under the pointer or focus a thin
// coral ring and the small label "More in the guide ↓" (a touch: the first tap shows them, the second opens); after Play
// in the tab order, there while a question is up (D-246: a click opens the part over the frame, the question folds
// and comes back as it was left; O is your own words) and hidden while a mark tool is on, following the picture past Fit; a click pauses and opens the page over the frame grown from it
// (D-195), an ink ring on it while open, closing plays on with focus back on it; each opening logged with
// from: frame | chip | list; the chip only where nothing is marked or, on a phone, the thing is under 44 px (D-196).
// The plan guide: what opens is a part of the guide ("Guide · <kind> · step N", "Open the guide: …"); its
// header links the full guide page beside the video, at its section; words selected in it (bridge v2 "select") open the
// note box on them: a comment, a suggested edit on plan text, or a question kept with the review's questions; a part
// can open another part ("open") or play its moment ("seek").
// Runs on L2 with a fixture map that carries `details` and `plan`, two fixture detail pages and a fixture guide page.
// usage: node packages/player/test/details.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { pageHold } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-details.json";
const port = testPort(8885);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`;
const ready = (p) => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
await p.goto(url);
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload(); await ready(p); await p.waitForTimeout(600);
const rp = p.locator("#rp");
const E = (fn, arg) => p.evaluate(fn, arg);
const seek = async (t) => { await E((x) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(x); }, t); await p.waitForTimeout(450); };
const chip = () => E(() => { const c = document.querySelector("#rp").shadowRoot.querySelector(".dchip"); return { shown: !c.hidden && c.getBoundingClientRect().width > 0, name: c.dataset.name, text: c.textContent.trim(), title: c.title }; });
const panel = () => E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, P = r.querySelector(".dpanel"), fr = P.querySelector("iframe"), w = r.querySelector(".wrap"); return { open: !P.hidden, src: fr.getAttribute("src") || "", sandbox: fr.getAttribute("sandbox"), paused: el.player.paused, t: el.player.currentTime, dopen: w.classList.contains("dopen") || w.classList.contains("dover"), over: P.classList.contains("over") && P.parentElement === r.querySelector(".stage") }; });
const detailFrame = async (name) => { for (let i = 0; i < 40; i++) { const f = p.frames().find((x) => x.url().includes(`/details/${name}.html`)); if (f) { await f.waitForLoadState("load"); return f; } await p.waitForTimeout(150); } return null; };
const pm = await E(() => document.querySelector("#rp").planMap);
const [runs, code] = pm.details;

// ---- the chip comes and goes with the frame
await seek(60);
ok(!(await chip()).shown, "no chip on a frame without a detail (60 s)");
await seek(runs.start + 3);
let c = await chip();
ok(c.shown && c.name === "parts-runs" && c.text.includes(runs.title) && /O$/.test(c.text) && c.title.includes(runs.why), `the chip shows on the detail's frame, with its title, key O and the why as its tooltip — ${JSON.stringify(c)}`);
await seek(code.start + 2);
c = await chip();
ok(c.shown && c.name === "complete-409", `the next frame's detail replaces it — ${c.name}`);
await seek(code.end + 3);
ok(!(await chip()).shown, "and it goes when the frame ends");

// ---- opening pauses; closing resumes at the same moment
await seek(runs.start + 1);
await rp.locator('[data-act="play"]').click();
await p.waitForTimeout(1200);
ok(!(await panel()).paused, "playing before the detail opens");
await rp.locator(".dchip").click(); await p.waitForTimeout(300);
let pn = await panel();
ok(pn.open && pn.dopen && pn.over && pn.paused, `opening shows the page over the frame and pauses the video — ${JSON.stringify(pn)}`);
ok(pn.sandbox === "allow-scripts" && /\/packages\/player\/test\/fixtures\/details\/parts-runs\.html\?theme=light$/.test(pn.src), `the page is in a sandboxed frame, with the theme — ${pn.sandbox} ${pn.src}`);
ok(!(await chip()).shown, "the chip steps aside while its detail is open");
const t0 = pn.t;
await p.waitForTimeout(1500);
ok(Math.abs((await panel()).t - t0) < 0.05, "the video stays where it was while the page is open");
await p.waitForTimeout(300);   // the grow from the chip has ended
const overBox = await E(() => { const r = document.querySelector("#rp").shadowRoot, s = r.querySelector(".stage").getBoundingClientRect(), P = r.querySelector(".dpanel").getBoundingClientRect(); return { s: [s.left, s.top, s.width, s.height].map(Math.round), P: [P.left, P.top, P.width, P.height].map(Math.round), pad: getComputedStyle(r.querySelector(".wrap")).paddingRight }; });
ok(overBox.s.join() === overBox.P.join() && overBox.s[2] > 1000 && overBox.pad === "0px", `D-195: the page takes the video's box, over the frame, and the stage keeps its size — ${JSON.stringify(overBox)}`);
// where it plays on from: the time when the player is told to play (a look once it plays is later by however long
// the page took to get there, and on a loaded machine that is long); then the page closed
const armPlay = () => E(() => { const pl = document.querySelector("#rp").player; window.__rpPlayAt = null; if (!pl.__rpArmed) { const o = pl.play.bind(pl); pl.play = (...a) => { if (window.__rpPlayAt == null) window.__rpPlayAt = pl.currentTime; return o(...a); }; pl.__rpArmed = true; } });
const playsOn = async () => { await p.waitForFunction(() => !document.querySelector("#rp").player.paused && window.__rpPlayAt != null, null, { timeout: 20000, polling: 50 }).catch(() => {});
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".dpanel").hidden, null, { timeout: 20000 }).catch(() => {}); return E(() => window.__rpPlayAt); };
await armPlay();
await p.keyboard.press("Escape");
let tOn = await playsOn();
pn = await panel(); if (tOn != null) pn.t = tOn;
ok(!pn.open && !pn.dopen && !pn.paused && Math.abs(pn.t - t0) < 0.6, `Esc closes it and the video plays on from ${t0.toFixed(2)} — now ${pn.t.toFixed(2)}, playing ${!pn.paused}`);
await E(() => document.querySelector("#rp").player.pause());
const moments = await E(() => document.querySelector("#rp").moments.length);
ok(moments === 0, "opening and closing a detail is not a rewind (D-005)");

// ---- a comment inside the detail, through the bridge
await seek(runs.start + 2);
await rp.focus(); await p.keyboard.press("o"); await p.waitForTimeout(300);
pn = await panel();
ok(pn.open && pn.paused, "O opens the detail under the playhead");
const tOpen = pn.t;
const f1 = await detailFrame("parts-runs");
ok(!!f1, "the detail page loaded in the panel's frame");
await f1.click('tr[data-anchor="row: 16 MB"]'); await p.waitForTimeout(300);
const box = await E(() => { const r = document.querySelector("#rp").shadowRoot, bx = r.querySelector(".dcomment"); return { shown: !bx.hidden, k: bx.querySelector(".k").textContent, quote: bx.querySelector(".quote").textContent, focused: r.activeElement === bx.querySelector("textarea") }; });
ok(box.shown && box.k === "Comment on row: 16 MB" && /16 MB\s*40\s*5 m 58 s/.test(box.quote) && box.focused, `an anchor opens the comment box, named and quoted, with the cursor in it — ${JSON.stringify(box)}`);
await p.keyboard.type("Why is 16 MB slower than 8 MB here?");
await p.keyboard.press("Enter"); await p.waitForTimeout(300);
const ann = await E(() => document.querySelector("#rp").annotations.at(-1));
ok(ann?.kind === "note" && ann.comment === "Why is 16 MB slower than 8 MB here?" && ann.detail?.name === "parts-runs" && ann.detail.anchor === "row: 16 MB" && /^16 MB/.test(ann.detail.text),
  `the saved annotation carries detail {name, anchor, text} — ${JSON.stringify(ann?.detail)}`);
ok(Math.abs(ann.t - tOpen) < 0.02 && ann.plan?.step === 2 && ann.frame?.index === runs.frameIndex, `its moment is when the detail opened, its step the detail's — t ${ann.t} (opened ${tOpen.toFixed(2)}), step ${ann.plan?.step}`);
const row = await E(() => { const r = document.querySelector("#rp").shadowRoot, a = r.querySelector(".list .ann"); return { k: a.querySelector(".hd .k")?.textContent, t: a.querySelector(".hd .t")?.textContent, code: a.querySelector(".hd .t code")?.textContent }; });
ok(row.code === "row: 16 MB" && row.t === `row: 16 MB in ${runs.title}` && row.k === "step 2", `the record shows where it points — ${JSON.stringify(row)}`);
ok(/step 2 · in detail parts-runs at row: 16 MB — Why is 16 MB/.test(await E((id) => document.querySelector("#rp").lineFor(`ann:${id}`), ann.id)), "and copying it says where it points too");
const saved = await E(() => { const s = document.querySelector("#rp").shadowRoot.querySelector(".dsaved"); return !s.hidden && s.textContent; });
ok(/Saved to the record, step 2/.test(saved || ""), `the panel says it was saved — "${saved}"`);

// ---- the plan guide: a part of the guide, over the frame
const hdr = await E(() => { const r = document.querySelector("#rp").shadowRoot, P = r.querySelector(".dpanel"), a = P.querySelector(".dfull"); return { k: P.querySelector(".k").textContent, label: P.getAttribute("aria-label"), shown: !a.hidden, href: a.getAttribute("href") || "", text: a.textContent }; });
ok(hdr.k === "Guide · Evidence · step 2" && hdr.label === "Guide", `the panel names it a part of the guide, with its kind and step — ${JSON.stringify(hdr.k)}`);
const fullUrl = hdr.shown ? new URL(hdr.href) : null;
ok(fullUrl && /\/packages\/player\/test\/fixtures\/guide\/index\.html$/.test(fullUrl.pathname) && fullUrl.hash === "#parts-runs" && fullUrl.searchParams.get("src") && new URL(fullUrl.searchParams.get("review")).searchParams.get("project") === "videos/l2-upload-resume" && !new URL(fullUrl.searchParams.get("review")).searchParams.has("t") && Math.abs(Number(fullUrl.searchParams.get("from")) - tOpen) < 0.02 && /Open the full guide/.test(hdr.text),
  `"Open the full guide" goes to the guide page beside the video, at this part's section, with the way back — ${hdr.href}`);
// words selected in the part (bridge v2): the box opens on them; Suggest an edit where the words are plan text
await f1.evaluate(() => parent.postMessage({ type: "rp-detail", event: "select", anchor: "run: 16 MB", text: "16 MB 40 5 m 58 s", rect: { x: 60, y: 120, w: 180, h: 18 }, editable: true }, "*"));
await p.waitForTimeout(300);
const sel = await E(() => { const r = document.querySelector("#rp").shadowRoot, bx = r.querySelector(".dcomment"), P = r.querySelector(".dpanel").getBoundingClientRect(), fr = r.querySelector(".dpanel iframe").getBoundingClientRect(), b = bx.getBoundingClientRect(); return { shown: !bx.hidden, float: bx.classList.contains("float"), k: bx.querySelector(".k").textContent, quote: bx.querySelector(".quote").textContent, edit: !bx.querySelector('[data-act="dc-edit"]').hidden, ask: !!bx.querySelector('[data-act="dc-ask"]'), top: Math.round(b.top - fr.top), left: Math.round(b.left - fr.left), focused: r.activeElement === bx.querySelector("textarea") }; });
ok(sel.shown && sel.float && sel.k === "On run: 16 MB" && sel.quote === "“16 MB 40 5 m 58 s”" && sel.edit && sel.ask && sel.top >= 138 && sel.top <= 160 && sel.focused, `words selected in the part: the box opens under them, quoted, with Comment, Suggest an edit and Ask — ${JSON.stringify(sel)}`);
await rp.locator('[data-act="dc-edit"]').click(); await p.waitForTimeout(150);
ok(await E(() => document.querySelector("#rp").shadowRoot.querySelector("[data-dcomment]").value) === "16 MB 40 5 m 58 s", "Suggest an edit puts the words in the box to change");
await E(() => { const t = document.querySelector("#rp").shadowRoot.querySelector("[data-dcomment]"); t.value = "16 MB 40 6 m 02 s"; });
await rp.locator('[data-act="dc-save"]').click(); await p.waitForTimeout(250);
const ed = await E(() => document.querySelector("#rp").annotations.at(-1));
ok(ed?.edit?.before === "16 MB 40 5 m 58 s" && ed.edit.after === "16 MB 40 6 m 02 s" && ed.detail?.name === "parts-runs" && ed.detail.anchor === "run: 16 MB" && /^Suggested edit: “16 MB 40 5 m 58 s” → “16 MB 40 6 m 02 s”$/.test(ed.comment), `a suggested edit keeps what it said and what you would have it say — ${JSON.stringify({ edit: ed?.edit, comment: ed?.comment })}`);
// Ask about the words: the same question as Ask about this, answered in the box (here nobody answers: it goes with the review)
await f1.evaluate(() => parent.postMessage({ type: "rp-detail", event: "select", anchor: "run: 32 MB", text: "32 MB 45 5 m 25 s", rect: { x: 60, y: 160, w: 180, h: 18 } }, "*"));
await p.waitForTimeout(250);
ok(await E(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="dc-edit"]').hidden), "words that are not plan text: no Suggest an edit");
await E(() => { document.querySelector("#rp").shadowRoot.querySelector("[data-dcomment]").value = "Why is 32 MB faster?"; });
await rp.locator('[data-act="dc-ask"]').click(); await p.waitForTimeout(500);
const aq = await E(() => { const el = document.querySelector("#rp"), q = el.questions.at(-1), a = el.shadowRoot.querySelector(".dcomment .dans"); return { q, shown: !a.hidden, text: a.textContent, exp: el.exportPayload().questions?.at(-1) }; });
ok(aq.q?.question === "Why is 32 MB faster?" && aq.q.quote === "32 MB 45 5 m 25 s" && aq.q.detail?.name === "parts-runs" && aq.q.detail.anchor === "run: 32 MB" && aq.q.planStep === 2 && aq.q.status === "review" && aq.shown && /Why is 32 MB faster\?/.test(aq.text) && /goes with your review/i.test(aq.text) && aq.exp?.question === "Why is 32 MB faster?",
  `Ask keeps the question with the review's questions (the words as its quote, the part named) and says in the box who answers — ${JSON.stringify({ q: aq.q, text: aq.text })}`);
ok(/In the guide, /.test(await E(() => { const el = document.querySelector("#rp"); return el.askItemHtml(el.questions.at(-1)); })), "in Ask about this, the question says it was asked in the guide");
await rp.locator('[data-act="dc-discard"]').click(); await p.waitForTimeout(150);
// a part asks for another part, and for its moment
await f1.evaluate(() => parent.postMessage({ type: "rp-detail", event: "open", name: "complete-409" }, "*")); await p.waitForTimeout(400);
ok(await E(() => document.querySelector("#rp")._dopen?.d.name === "complete-409"), "a part can open another part of the guide (\"open\")");
const f2 = await detailFrame("complete-409");
await f2.evaluate((t) => parent.postMessage({ type: "rp-detail", event: "seek", t }, "*"), runs.start + 2); await p.waitForTimeout(500);
const sk = await panel();
ok(!sk.open && sk.paused && Math.abs(sk.t - (runs.start + 2)) < 0.3, `…and play its moment ("seek"): the part closes, the video waits there — ${JSON.stringify({ open: sk.open, t: sk.t })}`);
await rp.focus(); await p.keyboard.press("o"); await p.waitForTimeout(300); await detailFrame("parts-runs");

// ---- messages from any other window are ignored
const before = await E(() => document.querySelector("#rp").annotations.length);
await E(() => window.postMessage({ type: "rp-detail", event: "anchor", anchor: "forged", text: "from the page itself" }, "*"));
await E(() => { const f = document.createElement("iframe"); f.id = "intruder"; f.srcdoc = '<script>parent.postMessage({type:"rp-detail",event:"anchor",anchor:"intruder",text:"from another frame"},"*")<\/script>'; document.body.append(f); });
await p.waitForTimeout(600);
const ign = await E(() => { const r = document.querySelector("#rp").shadowRoot, bx = r.querySelector(".dcomment"); return { shown: !bx.hidden, k: bx.querySelector(".k").textContent }; });
ok(!ign.shown && await E(() => document.querySelector("#rp").annotations.length) === before, `a message from the page or another frame opens nothing — ${JSON.stringify(ign)}`);
await E(() => document.getElementById("intruder")?.remove());
// the × discards; Esc keeps
await (await detailFrame("parts-runs")).click('tr[data-anchor="row: 5 MB"]'); await p.waitForTimeout(250);
await p.keyboard.type("throw this away");
await rp.locator('[data-act="dc-discard"]').click(); await p.waitForTimeout(200);
ok(await E(() => document.querySelector("#rp").annotations.length) === before, "the × throws a comment away");
await (await detailFrame("parts-runs")).click('tr[data-anchor="row: 32 MB"]'); await p.waitForTimeout(250);
await p.keyboard.type("kept by Esc");
await p.keyboard.press("Escape"); await p.waitForTimeout(200);
ok(await E(() => { const el = document.querySelector("#rp"); return el.annotations.at(-1)?.detail?.anchor === "row: 32 MB" && !!el._dopen; }), "Esc keeps the words, and leaves the panel open");
await p.keyboard.press("Escape"); await p.waitForTimeout(250);
ok(!(await panel()).open, "a second Esc closes the panel");
// opened away from its beat (the plan text's "Open:", the record), a comment points at the detail's beat
await seek(60);
await E(() => { const el = document.querySelector("#rp"); el.openDetail(el.detailNamed("parts-runs")); }); await p.waitForTimeout(300);
const f1b = await detailFrame("parts-runs");
await f1b.click('tr[data-anchor="row: 8 MB"]'); await p.waitForTimeout(250);
await p.keyboard.type("opened from the text"); await p.keyboard.press("Enter"); await p.waitForTimeout(250);
const away = await E(() => document.querySelector("#rp").annotations.at(-1));
ok(away?.detail?.anchor === "row: 8 MB" && Math.abs(away.t - runs.start) < 0.02 && away.frame?.index === runs.frameIndex && away.plan?.step === 2, `opened away from its beat, the comment's moment is the beat's start — t ${away?.t}, frame ${away?.frame?.index}`);
await E(() => document.querySelector("#rp").closeDetail()); await p.waitForTimeout(200);

// ---- watch.details: each opening, with how long; not watching time
const exp = await E(() => document.querySelector("#rp").exportPayload().watch);
ok(Array.isArray(exp.details) && exp.details.length === 5 && exp.details.every((d) => typeof d.openedAt === "string" && !Number.isNaN(Date.parse(d.openedAt)) && d.seconds >= 0) && exp.details[0].seconds >= 1.4,
  `watch.details records each opening — ${JSON.stringify(exp.details)}`);
ok(exp.details.map((d) => `${d.name}:${d.from}`).join() === "parts-runs:chip,parts-runs:chip,complete-409:list,parts-runs:chip,parts-runs:list", `each says where it was opened from: the chip, O on a scene with only the chip, another part ("open"), and a list — ${exp.details.map((d) => `${d.name}:${d.from}`)}`);
ok(!exp.moments.length, "and none of it shows up as a rewind in watch.moments");

// ---- details in the frame (plan 2026-09-27): the thing the page explains is the button ---------------------
// The fixture's frames predate the attribute, so the spec marks one: the Upload API node on the parts-runs
// scene (it lands, from 72 % to full ink, about 3 s into the scene). complete-409's scene marks nothing: an
// older video's scene, which keeps the chip.
const mark = () => E(() => { const el = document.querySelector("#rp"), doc = el.player.iframeElement.contentDocument; const root = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === "08-step-2"); const n = root?.querySelector("#f08-step-2-node-api"); if (!n) return false; n.dataset.detail = "parts-runs"; el.syncDetailChip(); return true; });
const seekMarked = async (t) => { await seek(t); for (let i = 0; i < 20 && !(await mark()); i++) await p.waitForTimeout(150); await p.waitForTimeout(150); };
const btn = () => E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, L = r.querySelector(".dmark"), b = L.querySelector(".dhit"), tab = b.querySelector(".dtab"), st = r.querySelector(".stage").getBoundingClientRect(), pic = el.picRect();
  const doc = el.player.iframeElement.contentDocument, n = doc.querySelector('[data-detail="parts-runs"]'), fr = el.player.iframeElement.getBoundingClientRect(), vw = doc.defaultView.innerWidth, vh = doc.defaultView.innerHeight;
  const nr = n?.getBoundingClientRect(), k = [fr.width / vw, fr.height / vh], thing = nr ? [fr.left + nr.left * k[0], fr.top + nr.top * k[1], nr.width * k[0], nr.height * k[1]] : null;
  const br = b.getBoundingClientRect(), tr = tab.getBoundingClientRect(), shown = !L.hidden && getComputedStyle(L).display !== "none" && br.width > 0;
  return { shown, name: b.dataset.name, tab: tab.textContent, tabOp: +getComputedStyle(tab).opacity, words: tab.querySelector(".dtl").getBoundingClientRect().width, playing: L.hasAttribute("data-playing"), armed: b.hasAttribute("data-armed"), label: b.getAttribute("aria-label"), box: [br.left, br.top, br.width, br.height], thing, tabBox: [tr.left, tr.top, tr.right, tr.bottom], stage: [st.left, st.top, st.right, st.bottom], pic: [pic.left, pic.top, pic.width, pic.height], open: b.hasAttribute("data-open"), ring: getComputedStyle(b).boxShadow, focused: r.activeElement === b }; });
const near = (a, b2, d = 2) => !!a && !!b2 && a.every((x, i) => Math.abs(x - b2[i]) <= d);
const runsFrame = pm.frames.find((f) => f.index === runs.frameIndex);

// the thing has not landed yet (the node still at 72 %): neither the button nor the chip (D-196: the chip goes
// where a thing is marked)
await seekMarked(runs.start + 1);
let bt = await btn();
ok(!bt.shown && !(await chip()).shown, `marked, before the thing lands: no button yet, and no chip — ${JSON.stringify({ button: bt.shown, chip: (await chip()).shown })}`);
// landed: a clear button over its box; paused, only a faint glyph on its top edge, inside the frame and above its lowest eighth
await seekMarked(runs.start + 4.5);
bt = await btn();
ok(bt.shown && near(bt.box, bt.thing, 1.5), `landed, the button lies over the thing's box — ${JSON.stringify({ box: bt.box.map(Math.round), thing: bt.thing?.map(Math.round) })}`);
ok(bt.tab === "More in the guide↓" && bt.label === `Open the guide: ${runs.title} (O)`, `its label reads "More in the guide ↓", its name for a screen reader the detail's title — ${JSON.stringify({ tab: bt.tab, label: bt.label })}`);
ok(bt.words < 1 && bt.tabOp > 0 && bt.tabOp < 0.8, `paused, at rest: only the glyph shows, faint (no words, no pill) — ${JSON.stringify({ words: bt.words, opacity: bt.tabOp })}`);
ok(bt.tabBox[3] <= bt.box[1] && bt.tabBox[3] >= bt.box[1] - 8 && bt.tabBox[1] >= bt.stage[1] && bt.tabBox[3] <= bt.stage[1] + (bt.stage[3] - bt.stage[1]) * 0.875, `the glyph sits just above the thing, on its top edge (in the room rule 5 keeps clear), inside the frame, above its lowest eighth — ${JSON.stringify({ tab: bt.tabBox.map(Math.round), thing: Math.round(bt.box[1]) })}`);
ok(!(await chip()).shown, "the corner chip is gone from a scene that marks its thing (D-196)");
ok(!/184, 85, 46/.test(bt.ring), "no ring at rest");
// the pointer on it: a thin coral ring and the label opened, and no more (round 3's finding 1: resting on the thing
// brought up a card over the frame); the pill itself hovered a moment: the detail's why, beside the pill, never over it
const hovState = () => E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, pop = r.querySelector(".fpop"), b = r.querySelector(".dmark .dhit").getBoundingClientRect(), q = pop.getBoundingClientRect(), P = el.picRect(); const tab = r.querySelector(".dmark .dtab"), t = tab.getBoundingClientRect(); return { inPic: q.left >= P.left - 0.5 && q.right <= P.right + 0.5 && q.top >= P.top - 0.5 && q.bottom <= P.bottom - 12 + 0.5, fill: getComputedStyle(r.querySelector(".dmark .dhit")).backgroundColor, words: tab.querySelector(".dtl").getBoundingClientRect().width, tabOp: +getComputedStyle(tab).opacity, tabBottom: t.bottom, top: b.top, ring: getComputedStyle(r.querySelector(".dmark .dhit")).boxShadow, pop: !pop.hidden, text: pop.textContent, w: q.width, clear: q.right <= t.left + 1 || q.left >= t.right - 1 || q.bottom <= t.top + 1 || q.top >= t.bottom - 1, near: Math.max(0, q.left - t.right, t.left - q.right) + Math.max(0, q.top - t.bottom, t.top - q.bottom) <= 12, pill: [t.left + t.width / 2, t.top + t.height / 2] }; });
await p.mouse.move(bt.box[0] + bt.box[2] / 2, bt.box[1] + bt.box[3] / 2); await pageHold(p, 1000);
let hov = await hovState();
ok(/184, 85, 46/.test(hov.ring) && /\b1px\b/.test(hov.ring), `hovered, it is ringed in coral, thinly — ${hov.ring}`);
ok(hov.words > 40 && hov.tabOp === 1 && hov.tabBottom <= hov.top, `and "More in the guide ↓" opens above it, not over it — ${JSON.stringify({ words: hov.words, opacity: hov.tabOp })}`);
ok(!hov.pop, `resting on the thing brings up no card: only the ring and the pill (round 3's finding 1) — ${JSON.stringify(hov)}`);
await p.mouse.move(hov.pill[0], hov.pill[1], { steps: 3 });
await p.waitForFunction(() => !document.querySelector("#rp").shadowRoot.querySelector(".fpop").hidden, null, { timeout: 10000 }).catch(() => null);
hov = await hovState();
ok(hov.pop && hov.text.includes(runs.why) && hov.text.includes(runs.title) && hov.clear && hov.near && hov.w <= 360.5, `the pill hovered: its why in a card beside the pill (never over it), at most 360 px wide — ${JSON.stringify(hov)}`);
ok(hov.inPic, `…inside the picture, 12 px or more above its foot: never over the scrubber or the controls (round 2's finding 2) — ${JSON.stringify(hov)}`);
await p.mouse.move(5, 5); await p.waitForTimeout(500);
ok(await E(() => document.querySelector("#rp").shadowRoot.querySelector(".fpop").hidden), "the why goes when the pointer leaves");
// a thing that is most of the picture (over 40 % of it): hovered, a 1 px ring and its pill, no coral over the video; its why
// still inside the picture (the scene's whole block marked, for this check, then the node again)
{
  const bigMark = (on) => E((on) => { const el = document.querySelector("#rp"), doc = el.player.iframeElement.contentDocument, root = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === "08-step-2");
    const n = root?.querySelector("#f08-step-2-node-api"); if (!n) return false;
    const area = (x) => { const r = x.getBoundingClientRect(); return r.width * r.height; }, blk = [...root.querySelectorAll("*")].filter((x) => x.getClientRects().length).sort((a, b) => area(b) - area(a))[0];
    if (on) { delete n.dataset.detail; blk.dataset.detail = "parts-runs"; blk.dataset.rpBig = "1"; } else { const x = root.querySelector("[data-rp-big]"); if (x) { delete x.dataset.detail; delete x.dataset.rpBig; } n.dataset.detail = "parts-runs"; } el.syncDetailChip(); return true; }, on);
  // (late in the scene: the block holds parts that draw in until 12.5 s, and a thing is live once all of it has drawn)
  await seek(runs.start + 14);
  await bigMark(true);
  await p.waitForFunction(() => { const b = document.querySelector("#rp").shadowRoot.querySelector(".dmark:not([hidden]) .dhit"); return !!b && b.hasAttribute("data-big"); }, null, { timeout: 10000 }).catch(() => null);
  const bb = await btn();
  await p.mouse.move(bb.box[0] + bb.box[2] * 0.6, bb.box[1] + bb.box[3] * 0.6); await pageHold(p, 800);
  const noCard = await E(() => document.querySelector("#rp").shadowRoot.querySelector(".fpop").hidden);
  ok(noCard, "a thing over 40 % of the picture, rested on: no card over the video");
  const pl = await E(() => { const t = document.querySelector("#rp").shadowRoot.querySelector(".dmark .dtab").getBoundingClientRect(); return [t.left + t.width / 2, t.top + t.height / 2]; });
  await p.mouse.move(pl[0], pl[1], { steps: 3 });
  await p.waitForFunction(() => !document.querySelector("#rp").shadowRoot.querySelector(".fpop").hidden, null, { timeout: 10000 }).catch(() => null);
  const big = await E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, b = r.querySelector(".dmark .dhit"), cs = getComputedStyle(b), q = r.querySelector(".fpop").getBoundingClientRect(), P = el.picRect(), sc = r.querySelector(".scrub").getBoundingClientRect(), tab = b.querySelector(".dtab");
    return { big: b.hasAttribute("data-big"), area: (b.offsetWidth * b.offsetHeight) / (P.width * P.height), fill: cs.backgroundColor, ring: cs.boxShadow, pill: +getComputedStyle(tab).opacity, pop: !r.querySelector(".fpop").hidden, inPic: q.left >= P.left - 0.5 && q.right <= P.right + 0.5 && q.top >= P.top - 0.5 && q.bottom <= P.bottom - 12 + 0.5, overScrub: q.bottom > sc.top && q.top < sc.bottom }; });
  ok(big.big && big.area > 0.4 && /rgba\(0, 0, 0, 0\)|transparent/.test(big.fill) && /184, 85, 46/.test(big.ring) && /\b1px\b/.test(big.ring) && big.pill === 1, `a thing over 40 % of the picture: hovered, a 1 px coral ring and the pill, no fill — ${JSON.stringify(big)}`);
  ok(big.pop && big.inPic && !big.overScrub, `…its why inside the picture, clear of the scrubber — ${JSON.stringify(big)}`);
  await p.mouse.move(5, 5); await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".fpop").hidden, null, { timeout: 10000 }).catch(() => null);
  await bigMark(false);
  await p.waitForFunction(() => { const b = document.querySelector("#rp").shadowRoot.querySelector(".dmark:not([hidden]) .dhit"); return !!b && !b.hasAttribute("data-big"); }, null, { timeout: 10000 }).catch(() => null);
  await seekMarked(runs.start + 4.5);
}
// the keyboard: after Play in the tab order, focus rings it, Enter opens it
await E(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="play"]').focus());
await p.keyboard.press("Tab"); await p.waitForTimeout(150);
bt = await btn();
ok(bt.focused && /184, 85, 46/.test(bt.ring), `Tab from Play reaches the thing's button, ringed in coral — ${JSON.stringify({ focused: bt.focused, ring: bt.ring })}`);
await p.keyboard.press("Tab"); await p.waitForTimeout(100);
const nextAfter = await E(() => { const r = document.querySelector("#rp").shadowRoot, a = r.activeElement; return a ? a.className || a.dataset.act || a.tagName : null; });
ok(nextAfter && !/dhit/.test(nextAfter) && nextAfter !== "play", `Tab from it goes on past Play — ${nextAfter}`);
await p.keyboard.press("Shift+Tab"); await p.waitForTimeout(100);
ok((await btn()).focused, "Shift+Tab comes back to it");
await p.keyboard.press("Shift+Tab"); await p.waitForTimeout(100);
ok(await E(() => document.querySelector("#rp").shadowRoot.activeElement?.dataset.act === "play"), "and once more to Play");
await p.keyboard.press("Tab"); await p.waitForTimeout(100);
await p.keyboard.press("Enter"); await p.waitForTimeout(450);
pn = await panel(); bt = await btn();
ok(pn.open && pn.over && pn.paused && /parts-runs\.html/.test(pn.src), `Enter opens the page over the frame (D-195) — ${JSON.stringify(pn)}`);
ok(bt.shown && bt.open && /20, 20, 19/.test(bt.ring), `while it is open, the thing keeps an ink ring — ${bt.ring}`);
await p.keyboard.press("Escape"); await p.waitForTimeout(400);
ok(!(await panel()).open && (await btn()).focused, "Esc closes it, and focus is back on the thing");
// a click while playing: pauses, grows the page out of the thing, and closing plays on from the same moment
await seekMarked(runs.start + 4);
await rp.locator('[data-act="play"]').click(); await p.waitForTimeout(700);
bt = await btn();
ok(bt.shown && bt.playing && bt.tabOp === 0 && !/184, 85, 46/.test(bt.ring), `playing: nothing is drawn over the frame (no glyph, no ring), the button is still there — ${JSON.stringify({ shown: bt.shown, playing: bt.playing, opacity: bt.tabOp, ring: bt.ring })}`);
// the grow, counted by the page as it starts (a look after the click can come after it has ended, on a loaded machine)
await E(() => { const P = document.querySelector("#rp").shadowRoot.querySelector(".dpanel"); window.__rpGrow = 0; if (!P.__rpArmed) { const o = P.animate.bind(P); P.animate = (...a) => { window.__rpGrow++; return o(...a); }; P.__rpArmed = true; } });
await p.mouse.click(bt.box[0] + bt.box[2] / 2, bt.box[1] + bt.box[3] / 2);
const grow = await E(() => window.__rpGrow + document.querySelector("#rp").shadowRoot.querySelector(".dpanel").getAnimations().length);
await p.waitForFunction(() => { const P = document.querySelector("#rp").shadowRoot.querySelector(".dpanel"); return !P.hidden && P.getAnimations().every((a) => a.playState === "finished"); }, null, { timeout: 20000 }).catch(() => {});   // the grow has ended
pn = await panel();
ok(pn.open && pn.over && pn.paused && grow > 0, `a click on the thing pauses the video and grows the page out of it — ${JSON.stringify({ ...pn, grow })}`);
const tClick = pn.t;
await armPlay();
// the ghost is laid as the page closes, and goes once it lands: seen by the page as it is laid (a look after the click
// can come after it has landed, on a loaded machine)
await E(() => { const st = document.querySelector("#rp").shadowRoot.querySelector(".stage"); window.__rpGhost = false; const mo = new MutationObserver((ms) => { if (ms.some((m) => [...m.addedNodes].some((n) => n.classList?.contains("dghost")))) { window.__rpGhost = true; mo.disconnect(); } }); mo.observe(st, { childList: true }); });
await rp.locator('[data-act="detail-close"]').click();
const ghost = await E(() => window.__rpGhost || !!document.querySelector("#rp").shadowRoot.querySelector(".dghost"));
tOn = await playsOn();
await p.waitForFunction(() => !document.querySelector("#rp").shadowRoot.querySelector(".dghost"), null, { timeout: 20000 }).catch(() => {});   // the shrink back into the thing has ended
pn = await panel(); if (tOn != null) pn.t = tOn;
ok(!pn.open && !pn.paused && Math.abs(pn.t - tClick) < 1 && (await btn()).focused, `closing plays on from ${tClick.toFixed(2)}, focus on the thing — now ${pn.t.toFixed(2)}, playing ${!pn.paused}`);
ok(ghost && !(await E(() => !!document.querySelector("#rp").shadowRoot.querySelector(".dghost"))), "the page shrinks back into the thing (a ghost of it, gone once it lands)");
await E(() => document.querySelector("#rp").player.pause());
// a touch has no hover: the first tap shows the ring and the label, the second opens
await seekMarked(runs.start + 5);
const tap = () => E(() => { const h = document.querySelector("#rp").shadowRoot.querySelector(".dmark .dhit"); h.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "touch", bubbles: true, composed: true })); h.click(); });
await tap(); await p.waitForTimeout(300);
bt = await btn();
ok(!(await panel()).open && bt.armed && bt.words > 40 && bt.tabOp === 1, `a first tap opens nothing: it shows the ring and "More in the guide ↓" — ${JSON.stringify({ armed: bt.armed, words: bt.words, opacity: bt.tabOp })}`);
await tap(); await p.waitForTimeout(400);
ok((await panel()).open, "a second tap opens the part");
await p.keyboard.press("Escape"); await p.waitForTimeout(400);
ok(!(await btn()).armed, "and closing it leaves the thing quiet again");
// O on a scene that marks its thing opens it, from the frame
await seekMarked(runs.start + 5);
await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("o"); await p.waitForTimeout(350);
ok((await panel()).open, "O opens the scene's detail");
await p.keyboard.press("o"); await p.waitForTimeout(300);
ok(!(await panel()).open, "and O closes it");
const froms = (await E(() => document.querySelector("#rp").detailsLog())).slice(-3).map((d) => d.from);
ok(froms.join() === "frame,frame,frame", `each opening from the thing, by key, click or O, is logged from: "frame" — ${froms}`);
// zoomed past Fit, the button moves with the picture (D-182)
await E(() => document.querySelector("#rp").setSize(200)); await p.waitForTimeout(500);
await E(() => { const r = document.querySelector("#rp").shadowRoot, zp = r.querySelector(".zport"); zp.scrollTo({ left: zp.scrollWidth * 0.45, top: zp.scrollHeight * 0.3, behavior: "instant" }); }); await p.waitForTimeout(300);
bt = await btn();
ok(bt.shown && near(bt.box, bt.thing, 2) && bt.pic[2] > (bt.stage[2] - bt.stage[0]) * 1.9, `zoomed to 200%, the button is still over the thing — ${JSON.stringify({ box: bt.box.map(Math.round), thing: bt.thing?.map(Math.round) })}`);
await E(() => document.querySelector("#rp").shadowRoot.querySelector(".zport").scrollBy({ left: 120, top: 60, behavior: "instant" })); await p.waitForTimeout(200);
const bt2 = await btn();
ok(near(bt2.box, bt2.thing, 2) && bt.box[0] - bt2.box[0] > 50 && bt.box[1] - bt2.box[1] > 30, `and moves with the picture as the view scrolls — ${JSON.stringify({ before: bt.box.map(Math.round), after: bt2.box.map(Math.round) })}`);
await E(() => document.querySelector("#rp").setSize(100)); await p.waitForTimeout(400);
// a mark tool that is on takes the frame
await E(() => document.querySelector("#rp").setTool("stroke")); await p.waitForTimeout(150);
ok(!(await btn()).shown, "a mark tool on takes the frame: the button is not there");
await E(() => document.querySelector("#rp").setTool(null)); await p.waitForTimeout(150);
ok((await btn()).shown, "and it is back when the tool is off");
// while a question is up the thing stays a button (D-246, superseding D-206): a click opens its part over the frame, the
// question folds, and closing the part brings it back as it was left (the words typed in your own words and the note); O is
// still your own words (D-046)
const qz = pm.quizzes[0];
await seekMarked(qz.at - 1.2);
await rp.locator('[data-act="play"]').click();
await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 }); await p.waitForTimeout(300);
await mark();
bt = await btn();
ok(bt.shown && near(bt.box, bt.thing, 2) && !(await chip()).shown, `a question up: the button is still over the thing — ${JSON.stringify({ shown: bt.shown, box: bt.box.map(Math.round) })}`);
await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("o"); await p.waitForTimeout(250);
ok(!(await panel()).open && await E(() => document.querySelector("#rp").shadowRoot.querySelector(".own").classList.contains("open")), "O answers in your own words, not the part");
await E(() => { const r = document.querySelector("#rp").shadowRoot, own = r.querySelector(".own textarea"), note = r.querySelector(".decision [data-note]"); if (own) own.value = "half typed, my own"; if (note) note.value = "a note on it"; });
const kept0 = await E(() => { const r = document.querySelector("#rp").shadowRoot; return { own: r.querySelector(".own textarea")?.value, ownOpen: r.querySelector(".own").classList.contains("open"), note: r.querySelector(".decision [data-note]")?.value }; });
await rp.locator(".dmark .dhit").click(); await p.waitForTimeout(400);
const qopen = await E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { open: !r.querySelector(".dpanel").hidden, folded: r.querySelector(".decision").classList.contains("folded"), pending: !!el._pendingDecision }; });
ok(qopen.open && qopen.folded && qopen.pending, `a click on the thing opens its part over the frame, the question folded and still waiting — ${JSON.stringify(qopen)}`);
await p.keyboard.press("Escape"); await p.waitForTimeout(400);
const qback = await E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { open: !r.querySelector(".dpanel").hidden, on: r.querySelector(".decision").classList.contains("on"), folded: r.querySelector(".decision").classList.contains("folded"), own: r.querySelector(".own textarea")?.value, ownOpen: r.querySelector(".own").classList.contains("open"), note: r.querySelector(".decision [data-note]")?.value, paused: el.player.paused, answered: !!el.quizzes[el._pendingDecision?.q?.id] }; });
ok(!qback.open && qback.on && !qback.folded && qback.paused && !qback.answered && qback.own === kept0.own && qback.ownOpen === kept0.ownOpen && qback.note === kept0.note, `closing it brings the question back as it was left — ${JSON.stringify({ qback, before: kept0 })}`);
await p.keyboard.press("Escape"); await p.waitForTimeout(150);
await E((a) => { const el = document.querySelector("#rp"); el.answerQuiz(a); el.skipWait(); el.player.pause(); }, qz.answer); await p.waitForTimeout(400);
await mark();
ok((await btn()).shown, "answered, the button is there as before");

// ---- a walkthrough detail: Accept / Flag in the panel header
const call = pm.autonomy.find((a) => a.id === code.autonomy);
await seek(call.at - 1.2);
await rp.locator('[data-act="play"]').click();
await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
await p.waitForTimeout(250);
ok((await chip()).shown, "the chip stays reachable while the call's sheet waits");
await rp.locator(".dchip").click(); await p.waitForTimeout(300);
const hd = await E(() => { const r = document.querySelector("#rp").shadowRoot, d = r.querySelector(".dcall"); return { shown: !d.hidden, what: d.querySelector(".what").textContent, k: r.querySelector(".dhd .k").textContent }; });
ok(hd.shown && hd.what.includes(call.chose) && /^Guide · Code · step 3/.test(hd.k), `the header names the agent's call — ${JSON.stringify(hd)}`);
await rp.locator('.dcall [data-dverdict="flag"]').click(); await p.waitForTimeout(250);
const fl = await E(() => { const el = document.querySelector("#rp"); return { v: el.autonomy.atest, sheet: el.shadowRoot.querySelector(".decision").classList.contains("on"), flag: el.annotations.find((a) => a.kind === "flag") }; });
ok(fl.v?.verdict === "flag" && fl.v.planStep === 3 && !fl.sheet && fl.flag?.comment === `Flagged: ${call.chose}` && fl.flag.plan.step === 3, `Flag records the verdict the sheet would, and answers the waiting sheet — ${JSON.stringify(fl.v)}`);
await rp.locator('[data-act="detail-close"]').click(); await p.waitForTimeout(400);
ok(!(await panel()).paused, "closing then plays on, the call answered");
await E(() => document.querySelector("#rp").player.pause());
// again, fresh: Accept from the panel with no sheet up
await E(() => { const el = document.querySelector("#rp"); el.autonomy = {}; el.annotations = el.annotations.filter((a) => a.kind !== "flag"); el.persist(); el._askedOnce = {}; el.renderAutonomy(); });
await seek(code.start + 1);
await rp.locator(".dchip").click(); await p.waitForTimeout(300);
await rp.locator('.dcall [data-dverdict="accept"]').click(); await p.waitForTimeout(250);
const ac = await E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { v: el.autonomy.atest, pressed: r.querySelector('.dcall [data-dverdict="accept"]').getAttribute("aria-pressed"), dis: [...r.querySelectorAll(".dcall [data-dverdict]")].every((x) => x.disabled), exp: el.exportPayload().autonomy.find((a) => a.id === "atest"), log: r.querySelector(".autolog").textContent }; });
ok(ac.v?.verdict === "accept" && ac.exp?.verdict === "accept" && ac.pressed === "true" && ac.dis && /Accepted/.test(ac.log), `Accept in the panel records the verdict, shows it, and it is in the export and the record — ${JSON.stringify(ac.v)}`);
await p.keyboard.press("Escape"); await p.waitForTimeout(250);
await seek(call.at - 0.8); await rp.locator('[data-act="play"]').click(); await p.waitForTimeout(1600);
ok(await E(() => { const r = document.querySelector("#rp").shadowRoot, d = r.querySelector(".decision"); return d.classList.contains("on") && /answered/.test(d.querySelector(".k").textContent) && /You accepted it/.test(d.querySelector(".feedback").textContent); }), "judged in the panel, the call's sheet comes back answered (Accepted), not asking again");
await E(() => document.querySelector("#rp").skipWait());
await E(() => document.querySelector("#rp").player.pause());

// ---- a page from today's templates in the panel takes the review page's look (D-167): the faces the player
// posts once it is ready (its frame cannot load them), the darker coral (D-142) and the solid inks, light and dark
for (const theme of ["light", "dark"]) {
  await E((th) => { const el = document.querySelector("#rp"); el.setTheme(th); el.openDetail({ name: "tpl-table", src: "/templates/details/table.html", title: "Table", kind: "table" }); }, theme);
  let tf = null; for (let i = 0; i < 40 && !tf; i++) { tf = p.frames().find((x) => x.url().includes("/templates/details/table.html")) || null; if (!tf) await p.waitForTimeout(150); }
  const look = tf && await tf.waitForFunction(() => ["Inter", "EB Garamond", "JetBrains Mono"].every((fam) => [...document.fonts].some((f) => f.family.replace(/"/g, "") === fam && f.status === "loaded")), null, { timeout: 8000 })
    .then(() => tf.evaluate(() => { const cs = getComputedStyle(document.documentElement); return { accent: cs.getPropertyValue("--accent").trim(), ink2: cs.getPropertyValue("--ink-2").trim(), sans: getComputedStyle(document.body).fontFamily, framed: document.documentElement.hasAttribute("data-framed"), inter: document.fonts.check('15px "Inter"') }; }))
    .catch((e) => ({ error: String(e.message).split("\n")[0] }));
  const want = theme === "dark" ? ["#D2693F", "#CFCAC1"] : ["#B8552E", "#3D3B37"];
  ok(look && look.accent === want[0] && look.ink2 === want[1] && /^"?Inter"?,/.test(look.sans) && look.inter && look.framed, `${theme}: a template page in the panel takes the player's faces, coral and inks — ${JSON.stringify(look)}`);
  await E(() => document.querySelector("#rp").closeDetail()); await p.waitForTimeout(200);
}
await E(() => document.querySelector("#rp").setTheme("light"));

// ---- the plan beside the video: off until the reviewer turns it on, then beside where there is room
const off = await E(() => { const r = document.querySelector("#rp").shadowRoot, x = r.querySelector(".plantext"); return { home: x.parentElement === r.querySelector(".col-plan"), beside: r.querySelector(".wrap").classList.contains("beside"), open: x.hasAttribute("data-open") }; });
ok(off.home && !off.beside && !off.open, `by default the plan text is off: folded in the record, nothing beside the video — ${JSON.stringify(off)}`);
const cbtn = () => E(() => { const b = document.querySelector("#rp").shadowRoot.querySelector('.transport [data-act="plantext"]'); return b && !b.hidden && getComputedStyle(b).display !== "none" ? b.getAttribute("aria-pressed") : null; });
ok((await cbtn()) === "false", "a Plan switch sits in the controls, off");
await E(() => document.querySelector("#rp").shadowRoot.querySelector('.transport [data-act="plantext"]').click()); await p.waitForTimeout(300);
const pl = await E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, x = r.querySelector(".plantext"); return { hidden: x.hidden, inWrap: x.parentElement === r.querySelector(".wrap"), beside: r.querySelector(".wrap").classList.contains("beside"), steps: [...x.querySelectorAll(".pstep")].map((s) => s.dataset.step), code: x.querySelectorAll('.pstep[data-step="1"] .md code').length, bold: x.querySelectorAll('.pstep[data-step="1"] .md b').length, sel: getComputedStyle(x.querySelector(".md")).userSelect, title: x.querySelector(".ptitle")?.textContent }; });
ok(!pl.hidden && pl.inWrap && pl.beside, `turned on at 1440×900, the plan sits beside the video — ${JSON.stringify({ inWrap: pl.inWrap, beside: pl.beside })}`);
ok(await E(() => { const b = document.querySelector("#rp").shadowRoot.querySelector('.wrap.beside > .plantext > .ptoggle'); const r = b?.getBoundingClientRect(); return !!r && r.height > 20 && getComputedStyle(b).display !== "none"; }), "beside the video, its head is showing, to turn it off");
ok(pl.steps.join(",") === "0,1,2,3,4,5,6" && pl.title === pm.plan.title && pl.code >= 2 && pl.bold >= 3, `one section per step (and the problem), Markdown rendered — ${JSON.stringify(pl)}`);
ok(pl.sel !== "none", "its text is selectable");
const fit = await E(() => { const r = document.querySelector("#rp").shadowRoot, q = (s) => r.querySelector(s).getBoundingClientRect(); return { finish: q('[data-act="finish"]').bottom, play: q('[data-act="play"]').bottom, plan: q(".plantext").bottom, h: innerHeight, sx: document.documentElement.scrollWidth, w: innerWidth }; });
ok(fit.finish <= fit.h && fit.play <= fit.h && fit.plan <= fit.h && fit.sx <= fit.w, `the controls, Finish and the plan column fit the window — ${JSON.stringify(fit)}`);
await seek(pm.frames.find((f) => f.planStep === 3).start + 2);
const lit = await E(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll('.pstep[aria-current="true"]')].map((s) => s.dataset.step));
ok(lit.join() === "3", `the step the video is on is lit — ${lit}`);
await seek(3);
ok((await E(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll('.pstep[aria-current="true"]')].map((s) => s.dataset.step))).join() === "0", "before step 1, the problem is lit");
await rp.locator('.pstep[data-step="5"] h6 .tt').click(); await p.waitForTimeout(500);
const s5 = pm.frames.find((f) => f.planStep === 5).start;
const jumped = await E(() => ({ t: document.querySelector("#rp").player.currentTime, lit: [...document.querySelector("#rp").shadowRoot.querySelectorAll('.pstep[aria-current="true"]')].map((s) => s.dataset.step).join() }));
ok(Math.abs(jumped.t - s5) < 0.3 && jumped.lit === "5", `a click on step 5 seeks to its first frame (${s5}) and lights it — ${JSON.stringify(jumped)}`);
await rp.locator('.pstep[data-step="2"] .ts').click(); await p.waitForTimeout(500);
const back = await E(() => ({ t: document.querySelector("#rp").player.currentTime, m: document.querySelector("#rp").moments.at(-1) }));
ok(Math.abs(back.t - pm.frames.find((f) => f.planStep === 2).start) < 0.3 && back.m?.kind === "rewind", `its time jumps too, and going back is a rewind (D-005) — ${JSON.stringify(back)}`);
await rp.locator('.pstep[data-step="2"] .pdets [data-open-detail="parts-runs"]').click(); await p.waitForTimeout(300);
ok((await panel()).open, "a step's detail opens from the plan text");
await p.keyboard.press("Escape"); await p.waitForTimeout(200);
// the renderer escapes first
await E(() => { const el = document.querySelector("#rp"); el.planMap.plan.steps[0].text = 'x <img src=x onerror="window.__pwned=1"> **b** `<i>c</i>`\n\n- one\n- **two**'; el.renderPlanText(); });
await p.waitForTimeout(200);
const safe = await E(() => { const r = document.querySelector("#rp").shadowRoot, md = r.querySelector('.pstep[data-step="1"] .md'); return { img: md.querySelectorAll("img, i").length, text: md.textContent, li: md.querySelectorAll("li").length, pwned: !!window.__pwned }; });
ok(!safe.img && !safe.pwned && safe.text.includes('<img src=x onerror="window.__pwned=1">') && safe.text.includes("<i>c</i>") && safe.li === 2, `the Markdown renderer escapes before it formats — ${JSON.stringify(safe)}`);
// a step opens with an italic line saying what it needs; asterisks inside words and code stay as they are
await E(() => { const el = document.querySelector("#rp"); el.planMap.plan.steps[0].text = '*Needs step 2 (it notifies).*\n\n2*3 is `a*b` and **bold**'; el.renderPlanText(); });
await p.waitForTimeout(200);
const it = await E(() => { const md = document.querySelector("#rp").shadowRoot.querySelector('.pstep[data-step="1"] .md'); return { i: [...md.querySelectorAll("i")].map((x) => x.textContent), text: md.textContent }; });
ok(it.i.join() === "Needs step 2 (it notifies)." && it.text.includes("2*3 is a*b") && !it.text.includes("*Needs"), `*italic* renders, and a lone * stays — ${JSON.stringify(it)}`);

// turned off again (L, as the switch's title says), it leaves the side of the video and folds back into the record
ok((await cbtn()) === "true", "the controls' switch shows it is on");
await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("l"); await p.waitForTimeout(300);
ok(await E(() => { const r = document.querySelector("#rp").shadowRoot; return r.querySelector(".plantext").parentElement === r.querySelector(".col-plan") && !r.querySelector(".wrap").classList.contains("beside"); }), "turned off, it folds back into the record and the video has the width");
await E(() => document.querySelector("#rp").shadowRoot.querySelector('.plantext [data-act="plantext"]').click()); await p.waitForTimeout(300);
// ---- narrower windows: the plan in the record; on a phone the panel covers the video
await p.setViewportSize({ width: 955, height: 900 }); await p.waitForTimeout(400);
ok(await E(() => { const r = document.querySelector("#rp").shadowRoot; return r.querySelector(".plantext").parentElement === r.querySelector(".col-plan") && !r.querySelector(".wrap").classList.contains("beside"); }), "at 955 wide the plan text is in the record, under Steps");
await p.setViewportSize({ width: 430, height: 932 }); await p.waitForTimeout(400);
await seekMarked(runs.start + 4.5);
const small = await E(() => { const el = document.querySelector("#rp"), m = el.detailMark(el.detailNamed("parts-runs")); return { size: el.stage.dataset.size, h: m?.box ? (m.box.h / 100) * el.picRect().height : null, tooSmall: m?.tooSmall }; });
ok(small.size === "narrow" && small.h < 44 && small.tooSmall && !(await btn()).shown && (await chip()).shown, `on a phone, a marked thing under 44 px tall is no button: the scene shows the chip (D-196) — ${JSON.stringify(small)}`);
await rp.locator(".dchip").click(); await p.waitForTimeout(300);
const ph = await E(() => { const r = document.querySelector("#rp").shadowRoot.querySelector(".dpanel").getBoundingClientRect(); return { l: r.left, w: r.width, h: r.height, sx: document.documentElement.scrollWidth }; });
ok(ph.l === 0 && ph.w === 430 && ph.h === 932 && ph.sx <= 430, `on a phone the panel covers the video — ${JSON.stringify(ph)}`);
ok((await E(() => document.querySelector("#rp").detailsLog().at(-1).from)) === "chip", "opened from the chip, and logged so");
await rp.locator('[data-act="detail-close"]').click(); await p.waitForTimeout(200);

ok(!fails.some((f) => /^page error/.test(f)), "no page errors");
console.log(fails.length ? `\n${fails.length} failing:\n${fails.join("\n")}` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
