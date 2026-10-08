#!/usr/bin/env node
// The review player after the richer-review plan and the owner's requests on it:
//   parts you can see and jump between (N / P, Shift+arrows, the numbered part markers),
//   questions answered from the keyboard (A–D, O, Enter), a note on any answer,
//   sound reset once (rp:muted -> rp:muted:v2), up to four options, pick all that apply with one
//   summary frame (D-004), words typed on a mark, and the rewind / slow-down moments (D-005).
// Runs on L2 with a fixture map: q1 has four options (c and d without a branch), q2 is pick-all
// with a summary frame, plus the quick check and the agent's call from the quiz fixture.
// usage: node packages/player/test/review-keys.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, when, frames, seeked, still, settled, asked, loaded, flush, now, movedOn, pageHold } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-richer.json";
const port = testPort(8877);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`;
const ready = (p) => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
const open = async (w = 1440, h = 1000, before = null) => {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
  await p.goto(url);
  await p.evaluate((before) => { try { localStorage.clear(); if (before) for (const [k, v] of Object.entries(before)) localStorage.setItem(k, v); } catch {} }, before);
  await p.reload(); await loaded(p);
  return p;
};
const T = (p) => p.evaluate(() => { const pl = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return { t: pl.currentTime, paused: pl.paused }; });
const sheetOn = (p) => p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"));
const seekPause = (p, t) => p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, t);
// play into a question the way a reviewer does: from a moment before it, with the Play button
const playInto = async (p, at) => {
  await seekPause(p, at - 1.2); await seeked(p, at - 1.2); await still(p);
  await p.locator("#rp").locator('[data-act="play"]').click();
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
  await settled(p);
};
// a seek by the player (a key, a click) has landed: the video's time has moved from t0, and it is drawn there
const moved = async (p, t0) => { await until(p, (t0) => Math.abs(document.querySelector("#rp").player.currentTime - t0) > 0.3, t0); await frames(p); };
// press, and wait for the seek it makes to land
const seekBy = async (p, press) => { const t0 = await now(p); await press(); await moved(p, t0); };
const sheetGone = (p) => until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"));

// ---- 5. sound: the old remembered mute is ignored once; the new key is the one that sticks
{
  const p = await open(1440, 1000, { "rp:muted": "1" });
  const m = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { muted: r.querySelector("hyperframes-player").muted, pressed: r.querySelector('[data-act="mute"]').getAttribute("aria-pressed") }; });
  ok(!m.muted && m.pressed === "false", "a viewer muted under the old rp:muted key starts with sound");
  await p.locator("#rp").locator('[data-act="mute"]').click(); await until(p, () => localStorage.getItem("rp:muted:v2") != null);
  const keys = await p.evaluate(() => ({ v2: localStorage.getItem("rp:muted:v2"), old: localStorage.getItem("rp:muted") }));
  ok(keys.v2 === "1" && keys.old === "1", `muting now writes rp:muted:v2 and never touches the old key — ${JSON.stringify(keys)}`);
  await p.reload(); await ready(p);
  ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").muted), "and the new key survives a reload");
  await p.close();
}

// ---- 2 + 9. parts: numbered markers under the bars, N / P / Shift+arrows, and which jumps are rewinds
{
  const p = await open();
  const pm = await p.evaluate(() => document.querySelector("#rp").planMap);
  const chs = pm.chapters;
  const parts = () => p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".labels .part")].map((x) => { const pt = x.querySelector(".pt"); return { n: x.querySelector(".pn").textContent, cur: x.getAttribute("aria-current"), title: x.title, full: pt.scrollWidth <= pt.clientWidth + 1 && getComputedStyle(pt).display !== "none", text: pt.textContent }; }));
  let ps = await parts();
  ok(ps.length === chs.length && ps.map((x) => x.n).join() === chs.map((_, i) => i + 1).join(), `one numbered marker per part — ${ps.map((x) => x.n).join(" ")}`);
  ok(ps.every((x) => /N next chapter, P previous/.test(x.title) && /Shift\+→/.test(x.title)), "each marker's tooltip names the keys (D-127: chapter, not part)");
  await seekPause(p, 95); await seeked(p, 95); await frames(p);
  ps = await parts();
  ok(ps[1].cur === "true" && ps.filter((x) => x.cur === "true").length === 1 && ps[1].full && ps[1].text === chs[1].title, `the part you are in is marked, and named in full — "${ps[1].text}"`);
  const chip = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; const a = getComputedStyle(r.querySelector('.labels .part[aria-current="true"] .pn')).backgroundColor, o = getComputedStyle(r.querySelector('.labels .part[aria-current="false"] .pn')).backgroundColor; return { a, o }; });
  ok(chip.a === "rgb(20, 20, 19)" && chip.o !== chip.a, `the current part's number is the ink one (current is ink; coral is for what waits on you) — ${chip.a}`);
  await p.locator("#rp").focus();
  await seekBy(p, () => p.keyboard.press("n"));
  let t = (await T(p)).t;
  ok(Math.abs(t - chs[2].start) < 0.5, `N goes to the start of the next part — ${t.toFixed(2)} (part 3 starts ${chs[2].start})`);
  ok(!(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".chend").classList.contains("on"))), "and does not stop there as if the part before had just ended");
  ok((await p.evaluate(() => document.querySelector("#rp").moments.length)) === 0, "going forward is not a rewind");
  // P, then Shift+← as soon as P has landed: two quick jumps back (the page takes them as one trip back when the
  // second comes within 1.5 s of the first, so nothing slow goes between them: where P landed is read as it lands)
  const tn = await now(p);
  await p.keyboard.press("p");
  t = (await when(p, (t0) => { const x = document.querySelector("#rp").player.currentTime; return Math.abs(x - t0) > 0.3 && { t: x }; }, tn))?.t ?? (await T(p)).t;
  const tp = await now(p); await p.keyboard.press("Shift+ArrowLeft");
  ok(Math.abs(t - chs[1].start) < 0.5, `P goes to the start of the previous part — ${t.toFixed(2)}`);
  await moved(p, tp);
  t = (await T(p)).t;
  ok(t < 0.5, `Shift+← does the same — ${t.toFixed(2)}`);
  let mo = await p.evaluate(() => document.querySelector("#rp").moments);
  ok(mo.length === 1 && mo[0].kind === "rewind" && mo[0].t < 0.5 && Math.abs(mo[0].from - chs[2].start) < 0.6, `two quick part jumps back are one rewind, from where it started to where it ended — ${JSON.stringify(mo)}`);
  await pageHold(p, 1600);   // a while by the page's clock: the next jump is not one quick run with these
  await seekBy(p, () => p.keyboard.press("Shift+ArrowRight"));
  t = (await T(p)).t;
  ok(Math.abs(t - chs[1].start) < 0.5, `Shift+→ goes to the next part — ${t.toFixed(2)}`);
  // a marker is a button to its part's start; going back more than 2 s by it is a rewind
  // the other parts show (and take clicks) once the pointer is on the parts row
  await p.locator("#rp").locator(".labels").hover(); await flush(p);
  await seekBy(p, () => p.locator("#rp").locator('.labels .part[data-part="0"]').click());
  t = (await T(p)).t;
  mo = await p.evaluate(() => document.querySelector("#rp").moments);
  ok(t < 0.5 && mo.length === 2 && mo[1].kind === "rewind" && mo[1].frameIndex === 1, `clicking part 1's marker jumps to its start, and counts as a rewind — ${JSON.stringify(mo[1])}`);
  // the scrub: a click back more than 2 s is a rewind; a click back less than that, or forward, is not
  const sc = await p.locator("#rp").locator(".scrub").boundingBox(); const dur = pm.totalSeconds;
  const clickAt = async (s) => { await seekBy(p, () => p.locator("#rp").locator(".scrub").click({ position: { x: (s / dur) * sc.width, y: sc.height / 2 } })); await p.evaluate(() => document.querySelector("#rp").player.pause()); await still(p); };
  await clickAt(100); await clickAt(99); await clickAt(80);
  mo = await p.evaluate(() => document.querySelector("#rp").moments);
  const f80 = pm.frames.find((f) => 80 >= f.start && 80 < f.start + f.durationSeconds);
  ok(mo.length === 3 && mo[2].kind === "rewind" && Math.abs(mo[2].t - 80) < 1.5 && Math.abs(mo[2].from - 99) < 1.5 && mo[2].planStep === f80.planStep && mo[2].frameIndex === f80.index,
    `a scrub click 19 s back is a rewind at its frame and step, the 1 s one is not — ${JSON.stringify(mo.slice(2))}`);
  // slowing down: below 1x is a moment, one per change (a quick second step down refines it), speeding up is not
  await p.locator("#rp").focus();
  await p.keyboard.press("["); await p.keyboard.press("["); await flush(p); await p.keyboard.press("]"); await flush(p);
  mo = await p.evaluate(() => document.querySelector("#rp").moments);
  const slow = mo.filter((m) => m.kind === "slow");
  ok(slow.length === 1 && slow[0].rate === 0.5 && slow[0].planStep === f80.planStep && typeof slow[0].t === "number", `slowing to 0.5x is one slow moment — ${JSON.stringify(slow)}`);
  const ex = await p.evaluate(() => document.querySelector("#rp").exportPayload().watch.moments);
  ok(ex.length === 4 && ex.every((m) => "planStep" in m && "frameIndex" in m && typeof m.t === "number"), `the review carries them as watch.moments — ${ex.map((m) => m.kind).join(", ")}`);
  await p.reload(); await ready(p);
  ok((await p.evaluate(() => document.querySelector("#rp").moments.length)) === 4, "and they survive a reload");
  await p.evaluate(() => document.querySelector("#rp").setSpeed(1));
  await p.close();
}

// ---- the arrows alone scrub 5 s, the way a click on the timeline does
{
  const p = await open();
  const rp = p.locator("#rp");
  const pm = await p.evaluate(() => document.querySelector("#rp").planMap);
  ok(/← \/ → 5 s/.test(await rp.locator(".scrub").getAttribute("title")), "the timeline's tooltip names ← / → as 5 s");
  await seekPause(p, 30); await seeked(p, 30); await frames(p);
  await rp.focus();
  await seekBy(p, () => p.keyboard.press("ArrowRight"));
  let s = await T(p);
  ok(Math.abs(s.t - 35) < 0.4 && s.paused, `→ goes 5 s on, still paused — ${s.t.toFixed(2)}`);
  const t35 = await now(p); await p.evaluate(() => document.querySelector("#rp").player.play()); await movedOn(p, t35);
  // where it was as ← was pressed (the page's own look, as the key arrives: the video plays on while the key is on its
  // way), and where ← lands, read the moment it has gone back and plays on from there (the play after the seek reaches
  // the frame's page a moment after the seek does)
  await p.evaluate(() => window.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") window.__tKey = document.querySelector("#rp").player.currentTime; }, { capture: true, once: true }));
  await p.keyboard.press("ArrowLeft");
  const before = await p.evaluate(() => window.__tKey);
  s = (await when(p, (b) => { const pl = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return pl.currentTime < b - 1 && !pl.paused && { t: pl.currentTime, paused: pl.paused }; }, before)) || await T(p);
  const mo = await p.evaluate(() => document.querySelector("#rp").moments);
  ok(s.t < before - 4 && s.t > before - 5.8 && !s.paused, `← goes 5 s back, and playing it plays on — ${before.toFixed(2)} → ${s.t.toFixed(2)}`);
  ok(mo.length === 1 && mo[0].kind === "rewind", `going back 5 s is a rewind, as a scrub back is — ${JSON.stringify(mo)}`);
  await p.evaluate(() => document.querySelector("#rp").player.pause());
  // typing is not scrubbing
  await rp.locator(".composer textarea").fill("left and right move the caret");
  const at = (await T(p)).t;
  await p.keyboard.press("ArrowLeft"); await p.keyboard.press("ArrowRight"); await flush(p);
  ok(Math.abs((await T(p)).t - at) < 0.1, "in the comment box the arrows move the caret, not the video");
  await rp.locator(".composer textarea").fill(""); await rp.focus();
  // a quick check waiting stays up over the frame, as under a scrub; the playhead moves beneath it
  const q = pm.quizzes[0];
  await playInto(p, q.at);
  await seekBy(p, () => p.keyboard.press("ArrowLeft"));
  s = await T(p);
  ok(await sheetOn(p) && s.paused && s.t < q.at - 4, `with a quick check waiting, ← moves the frame under it and the question stays — ${s.t.toFixed(2)}`);
  ok(await p.evaluate(() => !document.querySelector("#rp").quizzes.ktest), "and answers nothing");
  // answered, it is not waiting any more: the arrow takes it away, as a scrub does
  await p.keyboard.press("b"); await until(p, () => !!document.querySelector("#rp").quizzes.ktest);
  await seekBy(p, () => p.keyboard.press("ArrowLeft"));
  ok(!(await sheetOn(p)) && (await p.evaluate(() => !document.querySelector("#rp")._pendingDecision)), "once answered, ← closes it");
  await p.close();
}

// ---- 3 + 4 + 6. a four-option question answered from the keyboard, with a note
{
  const p = await open();
  const rp = p.locator("#rp");
  const q1 = await p.evaluate(() => document.querySelector("#rp").planMap.decisions[0]);
  await playInto(p, q1.at);
  const card = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { keys: [...r.querySelectorAll(".decision .opt .key")].map((k) => k.textContent), own: r.querySelector(".ownbtn").title, note: !r.querySelector(".decision .note").hidden }; });
  ok(card.keys.join("") === "ABCD", `each option carries its letter — ${card.keys.join(" ")}`);
  ok(/\(O\)/.test(card.own) && card.note, "the own-words button names O, and the note field is offered");
  // O opens the own-words box without typing an "o" into it; Esc closes it again
  await p.keyboard.press("o"); await until(p, () => { const r = document.querySelector("#rp").shadowRoot; return r.querySelector(".own").classList.contains("open") && r.activeElement === r.querySelector(".own textarea"); });
  const own = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { open: r.querySelector(".own").classList.contains("open"), focused: r.activeElement === r.querySelector(".own textarea"), value: r.querySelector(".own textarea").value }; });
  ok(own.open && own.focused && own.value === "", "O opens 'answer in my own words', focused and empty");
  await p.keyboard.press("Escape"); await flush(p);
  // the note: typed in the sheet, Enter hands the keys back, the letter picks
  await rp.locator("[data-note]").click();
  await p.keyboard.type("only if Redis is already run by the platform team");
  await p.keyboard.press("Enter"); await until(p, () => { const r = document.querySelector("#rp").shadowRoot; return r.activeElement !== r.querySelector("[data-note]"); });
  ok(await p.evaluate(() => !document.querySelector("#rp").decisions.q1), "typing the note (letters a–d included) answers nothing");
  await p.keyboard.press("c");
  // where it goes on from: its time the moment it plays again (a look a while later is that much further on)
  const goesOn = await when(p, () => { const el = document.querySelector("#rp"); return !!el.decisions.q1 && !el.shadowRoot.querySelector(".decision").classList.contains("on") && !el.player.paused && { t: el.player.currentTime }; });
  const rec = await p.evaluate(() => { const el = document.querySelector("#rp"); return { d: el.decisions.q1, tool: el.tool, marking: el.shadowRoot.querySelector(".toolbar").classList.contains("marking"), on: el.shadowRoot.querySelector(".decision").classList.contains("on") }; });
  ok(rec.d?.option === "c" && rec.d.label === "Redis with a TTL" && !rec.on, `C picks the third option — ${JSON.stringify(rec.d)}`);
  ok(rec.tool === null && !rec.marking, "and the letters did not turn on a drawing tool");
  ok(rec.d?.note === "only if Redis is already run by the platform team", "the note is saved on that decision");
  const t = goesOn ? goesOn.t : (await T(p)).t;
  ok(Math.abs(t - q1.resumeAt) < 1.2, `an option without a branch goes on at resumeAt — ${t.toFixed(2)} (resumeAt ${q1.resumeAt})`);
  // record, reload, copy, export
  await p.reload(); await ready(p);
  const after = await p.evaluate(() => { const el = document.querySelector("#rp"); return { note: el.decisions.q1?.note, field: el.shadowRoot.querySelector('textarea[data-dnote="q1"]')?.value, text: el.reviewText(), ex: el.exportPayload().decisions.find((d) => d.id === "q1") }; });
  ok(after.note && after.field === after.note, "the note survives a reload and shows under the answer in the record");
  ok(/Redis with a TTL\n\s+Note: only if Redis/.test(after.text), "Copy text carries it under the answer");
  ok(after.ex?.note === after.note, "and the review sends it as note on the decision");
  await rp.locator(".grab").click(); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(p);
  await rp.locator('textarea[data-dnote="q1"]').fill("only if the platform team runs Redis");
  await rp.locator('textarea[data-dnote="q1"]').blur(); await until(p, () => /platform team runs Redis/.test(localStorage.getItem(Object.keys(localStorage).find((k) => k.endsWith(":decisions"))) || ""));
  const edited = await p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.endsWith(":decisions")))).q1.note);
  ok(edited === "only if the platform team runs Redis", "and it can be edited there afterwards");
  await p.close();
}

// ---- 6. four options at four widths: a grid, never smaller text, nothing clipped; phones stack
for (const [w, h, cols] of [[1440, 900, 2], [955, 800, 2], [760, 900, 2], [430, 932, 1]]) {
  const p = await open(w, h);
  await p.evaluate(() => { const el = document.querySelector("#rp"); el.start(); el.askDecision(el.planMap.decisions[0]); });
  await asked(p); await settled(p);
  const g = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; const os = [...r.querySelectorAll(".decision .opt")];
    const rs = os.map((o) => o.getBoundingClientRect());
    const overlap = rs.some((a, i) => rs.some((c, j) => j > i && a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1));
    return { n: os.length, cols: new Set(rs.map((x) => Math.round(x.left))).size, font: getComputedStyle(os[0].querySelector("b")).fontSize, why: getComputedStyle(os[0].querySelector("span")).fontSize, overlap,
      clipped: os.filter((o) => o.scrollHeight > o.clientHeight + 1 || o.scrollWidth > o.clientWidth + 1).length, hscroll: document.documentElement.scrollWidth > innerWidth }; });
  ok(g.n === 4 && g.cols === cols && !g.overlap && g.clipped === 0 && !g.hscroll && g.font === "15px" && g.why === "13px",
    `${w}px: four options in ${g.cols} column${g.cols === 1 ? "" : "s"}, 15/13 px text, none clipped or overlapping — ${JSON.stringify(g)}`);
  if (w === 1440) {
    await p.evaluate(() => { const el = document.querySelector("#rp"); el.closeCard(); const d = el.planMap.decisions[0]; el.askDecision({ ...d, options: d.options.slice(0, 3) }); });
    await asked(p); await until(p, () => document.querySelector("#rp").shadowRoot.querySelectorAll(".decision .opt").length === 3); await settled(p);
    const three = await p.evaluate(() => new Set([...document.querySelector("#rp").shadowRoot.querySelectorAll(".decision .opt")].map((o) => Math.round(o.getBoundingClientRect().top))).size);
    ok(three === 1, "three options sit in one row");
  }
  await p.close();
}

// ---- 7. pick all that apply: letters toggle, Enter confirms, one summary frame, routed past on replay, "change" edits it in the record
{
  const p = await open();
  const rp = p.locator("#rp");
  const q2 = await p.evaluate(() => document.querySelector("#rp").planMap.decisions[1]);
  await playInto(p, q2.at);
  let s = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, c = r.querySelector(".decision .confirm"); return { picks: r.querySelectorAll(".decision .opt[data-pick]").length, confirm: !c.hidden, disabled: c.disabled, k: r.querySelector(".decision .k").textContent }; });
  ok(s.picks === 4 && s.confirm && s.disabled && /pick all that apply/.test(s.k), `a pick-all question shows ticks and a Confirm that waits for one — ${JSON.stringify(s)}`);
  await p.keyboard.press("Enter"); await flush(p);
  ok(await sheetOn(p), "Enter with nothing ticked confirms nothing");
  await p.keyboard.press("a"); await p.keyboard.press("d"); await p.keyboard.press("c"); await p.keyboard.press("d"); await flush(p);
  s = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { on: [...r.querySelectorAll('.decision .opt[aria-pressed="true"]')].map((x) => x.dataset.pick), tool: el.tool, confirm: r.querySelector(".decision .confirm").textContent }; });
  ok(s.on.join() === "a,c" && s.tool === null, `letters toggle the ticks (D twice is off again) and never pick a drawing tool — ${s.on.join(",")}`);
  // the summary frame's composition marks where the picks go
  await p.evaluate(() => { const doc = document.querySelector("#rp").player.iframeElement.contentDocument; const host = doc.querySelector('[data-composition-id="13-branch-2b"]') || doc.body;
    const ul = doc.createElement("ul"); ul.setAttribute("data-plan-picks", "q2"); ul.id = "rp-test-picks"; host.appendChild(ul);
    const span = doc.createElement("span"); span.setAttribute("data-plan-picks", "q2"); span.id = "rp-test-picks-inline"; host.appendChild(span); });
  await p.keyboard.press("Enter");
  // where it goes on from: its time the moment it plays again; then the picks written into the frame it plays
  const goesOn = await when(p, () => { const el = document.querySelector("#rp"); return !!el.decisions.q2 && !el.shadowRoot.querySelector(".decision").classList.contains("on") && !el.player.paused && { t: el.player.currentTime, paused: false }; });
  await until(p, () => !!document.querySelector("#rp").player.iframeElement.contentDocument.querySelector("#rp-test-picks li"));
  const rec = await p.evaluate(() => document.querySelector("#rp").decisions.q2);
  ok(rec?.option === "multi" && rec.options.join() === "a,c" && rec.labels.join("|") === "Web uploader|Android app" && rec.label === "Web uploader, Android app" && rec.recommended === false, `recorded as the contract says — ${JSON.stringify(rec)}`);
  const t = goesOn || await T(p);
  ok(!(await sheetOn(p)) && t.t >= q2.summary.start - 0.2 && t.t < q2.summary.start + 2.5, `it plays the one summary frame — ${t.t.toFixed(2)} (summary at ${q2.summary.start})`);
  const written = await p.evaluate(() => { const doc = document.querySelector("#rp").player.iframeElement.contentDocument; return { li: [...(doc.querySelector("#rp-test-picks")?.querySelectorAll("li") || [])].map((x) => x.textContent), inline: doc.querySelector("#rp-test-picks-inline")?.textContent }; });
  ok(written.li.join("|") === "Web uploader|Android app" && written.inline === "Web uploader, Android app", `the picks are written into the summary frame's data-plan-picks — ${JSON.stringify(written)}`);
  ok(/Web uploader, Android app \(all that apply\)/.test(await p.evaluate(() => document.querySelector("#rp").reviewText())), "Copy text lists the picks");
  const moments = await p.evaluate(() => document.querySelector("#rp").moments.length);
  // replay: the question comes back answered, with its picks ticked; going on, the frames between
  // the question and its summary are skipped
  await seekPause(p, q2.at - 1.2); await seeked(p, q2.at - 1.2); await still(p);
  await rp.locator('[data-act="play"]').click();
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
  const shown = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { k: r.querySelector(".decision .k").textContent, on: [...r.querySelectorAll('.decision .opt[aria-pressed="true"]')].map((x) => x.dataset.pick).join(), confirm: !r.querySelector(".decision .confirm").hidden, go: r.activeElement?.dataset?.act }; });
  ok(/answered/.test(shown.k) && shown.on === "a,c" && !shown.confirm && shown.go === "quiz-go", `played again, an answered pick-all comes back answered, its picks ticked, Continue focused — ${JSON.stringify(shown)}`);
  await p.keyboard.press(" ");
  // it goes on, and the next tick routes it past the frames between to the summary
  await until(p, (at) => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on") && document.querySelector("#rp").player.currentTime >= at, q2.summary.start - 0.2);
  const re = await T(p);
  ok(!(await sheetOn(p)) && re.t >= q2.summary.start - 0.2, `and going on routes past it to the summary — ${re.t.toFixed(2)}`);
  // "change" edits it where it is listed (answer-on-the-video step 3): the picks as they were, ticked; a
  // new set saved there, without going back into the video
  await p.evaluate(() => document.querySelector("#rp").player.pause());
  await still(p);
  await rp.locator(".grab").click(); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(p);
  const t0 = await p.evaluate(() => document.querySelector("#rp").player.currentTime);
  await rp.locator('[data-redit="q2"]').click(); await until(p, () => !!document.querySelector("#rp").shadowRoot.querySelector('.redit [data-set="q2:c"]'));
  const again = await p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll('.redit .ropt[aria-pressed="true"]')].map((x) => x.dataset.set.split(":")[1]));
  ok(again.join() === "a,c", `"change" opens it in the record with the earlier picks ticked — ${again.join(",")}`);
  await rp.locator('.redit [data-set="q2:c"]').click(); await rp.locator('.redit [data-setmulti="q2"]').click(); await until(p, () => document.querySelector("#rp").decisions.q2?.options?.join() !== "a,c"); await frames(p);
  const after = await p.evaluate(() => { const el = document.querySelector("#rp"); return { o: el.decisions.q2?.options?.join(), label: el.decisions.q2?.label, t: el.player.currentTime, on: el.shadowRoot.querySelector(".decision").classList.contains("on") }; });
  ok(after.o === "a" && after.label === "Web uploader" && !after.on && Math.abs(after.t - t0) < 0.3, `and a new set is saved there, the video left where it was — ${JSON.stringify(after)}`);
  ok((await p.evaluate(() => document.querySelector("#rp").moments.length)) === moments, "the player's own seeks (the answer, the replay routing) are not rewinds");
  await p.close();
}

// ---- 3. the quick check and the agent's call answer from the keyboard too
{
  const p = await open();
  const pm = await p.evaluate(() => document.querySelector("#rp").planMap);
  await playInto(p, pm.quizzes[0].at);
  await p.keyboard.press("d"); await flush(p);
  ok(await p.evaluate(() => !document.querySelector("#rp").quizzes.ktest && document.querySelector("#rp").tool === null), "D on a three-option check answers nothing and draws nothing");
  await p.keyboard.press("b"); await until(p, () => !!document.querySelector("#rp").quizzes.ktest); await flush(p);
  ok(await p.evaluate(() => document.querySelector("#rp").quizzes.ktest?.answer === "b"), "B answers the quick check");
  await p.keyboard.press("a"); await flush(p);
  ok(await p.evaluate(() => document.querySelector("#rp").quizzes.ktest?.answer === "b" && document.querySelector("#rp").tool === null), "a letter after the answer changes nothing and draws nothing");
  const tq = await now(p); await p.keyboard.press(" "); await sheetGone(p); await movedOn(p, tq);
  await p.evaluate(() => document.querySelector("#rp").player.pause()); await still(p);
  await playInto(p, pm.autonomy[0].at);
  const keys = await p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".decision .opt .key")].map((k) => k.textContent).join(""));
  ok(keys === "AB", `the agent's call shows A (accept) and B (flag) — ${keys}`);
  await p.keyboard.press("b"); await until(p, () => !!document.querySelector("#rp").autonomy.atest);
  ok(await p.evaluate(() => document.querySelector("#rp").autonomy.atest?.verdict === "flag" && document.querySelector("#rp").tool === null), "B flags it");
  await p.close();
}

// ---- 8. type on the mark
{
  const p = await open();
  const rp = p.locator("#rp");
  await seekPause(p, 30); await seeked(p, 30); await frames(p);
  await rp.focus(); await p.keyboard.press("b");
  const draw = async (x0, y0, x1, y1) => { const st = await rp.locator(".stage").boundingBox(); await p.mouse.move(st.x + st.width * x0, st.y + st.height * y0); await p.mouse.down(); await p.mouse.move(st.x + st.width * x1, st.y + st.height * y1, { steps: 5 }); await p.mouse.up(); await flush(p); return st; };
  const st = await draw(0.2, 0.3, 0.4, 0.5);
  const box = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, mb = r.querySelector(".markbox"), bb = mb.getBoundingClientRect(), s = r.querySelector(".stage").getBoundingClientRect();
    return { shown: !mb.hidden, focused: r.activeElement === mb.querySelector("[data-markword]"), paused: el.player.paused, left: bb.left - s.left, top: bb.top - s.top, right: bb.right - s.left, bottom: bb.bottom - s.top, w: s.width, h: s.height, theme: el.getAttribute("theme"), n: el.annotations.length }; });
  ok(box.shown && box.focused && box.paused, "a finished mark opens a focused text box, and the video stays paused");
  ok(box.left >= 0.4 * box.w && box.right <= box.w && box.top >= 0 && box.bottom <= box.h, `the box sits beside the mark, inside the frame — at ${Math.round(box.left)},${Math.round(box.top)}`);
  await p.keyboard.type("the demo zebra: mark it, then type");
  const typed = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { theme: el.getAttribute("theme"), tool: el.tool, n: el.annotations.length, muted: r.querySelector("hyperframes-player").muted, handoff: !r.querySelector(".handoff").hidden, t: el.player.currentTime }; });
  ok(typed.theme === box.theme && typed.tool === "box" && typed.n === box.n && !typed.muted && !typed.handoff, "typing in it fires no shortcut — not t, m, d, z, e or the rest");
  const markboxShut = () => until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".markbox").hidden).then(() => flush(p));
  await p.keyboard.press("Enter"); await markboxShut();
  const saved = await p.evaluate(() => { const el = document.querySelector("#rp"); const a = el.annotations.at(-1); return { kind: a.kind, comment: a.comment, hidden: el.shadowRoot.querySelector(".markbox").hidden, listed: [...el.shadowRoot.querySelectorAll(".list textarea[data-comment]")].some((x) => x.value === a.comment) }; });
  ok(saved.kind === "box" && saved.comment === "the demo zebra: mark it, then type" && saved.hidden && saved.listed, "Enter saves the words as that mark's comment, and the record shows them under it");
  await draw(0.6, 0.2, 0.7, 0.35);
  await p.keyboard.type("keep this too"); await p.keyboard.press("Escape"); await markboxShut();
  const kept = await p.evaluate(() => { const el = document.querySelector("#rp"); const a = el.annotations.at(-1); return { n: el.annotations.length, comment: a.comment, hidden: el.shadowRoot.querySelector(".markbox").hidden, tool: el.tool }; });
  ok(kept.n === box.n + 1 && kept.comment === "keep this too" && kept.hidden && kept.tool === "box", "Escape keeps the words too, and only closes the box (A10, as reviewed)");
  await draw(0.62, 0.55, 0.72, 0.7);
  await p.keyboard.type("never mind"); await rp.locator("[data-markdiscard]").click(); await markboxShut();
  const skipped = await p.evaluate(() => { const el = document.querySelector("#rp"); const a = el.annotations.at(-1); return { n: el.annotations.length, comment: a.comment, hidden: el.shadowRoot.querySelector(".markbox").hidden, tool: el.tool }; });
  ok(skipped.n === box.n + 2 && skipped.comment === "" && skipped.hidden && skipped.tool === "box", "the × discards the words; the mark stays, without words");
  await p.keyboard.press("Escape"); await flush(p);
  ok(await p.evaluate(() => document.querySelector("#rp").tool === null), "a second Escape puts the pen down, as before");
  await p.close();
}

console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
