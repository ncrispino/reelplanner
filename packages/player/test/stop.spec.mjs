#!/usr/bin/env node
// A step's calls that stop share one beat (fewer-better-stops step 1): `- autonomy: a5, a6, a7`.
//   - the video pauses once, at the beat's end; the band lists each call, what it chose and instead of
//     what, each with its own Accept, Flag and own words; there is no Accept all
//   - a verdict on one call leaves the band up, the rest still waiting; the video goes on once each has one
//   - A and B judge the first call still waiting (its row carries the keys); O puts it in your own words,
//     a change the agent will make, and the band stays for the others
//   - the verdicts are the per-call records a call's own beat makes: the record, the flag's note on its
//     step, the export; met again, each can still be changed, and Continue goes on
//   - `plan-map` reads `- autonomy: a5, a6, a7` as this beat (stop: true, its calls from walkthrough.md's
//     rows), and one id as a call's own beat, as before
// Runs on L2 with the stop fixture: the group fixture's beat (a5, a6, a7) made a stop beat.
// usage: node packages/player/test/stop.spec.mjs
import { chromium } from "playwright-core"; import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked, still, settled, asked, loaded, flush, now, movedOn } from "./wait.mjs";
import { tmpdir } from "node:os"; import { join } from "node:path";
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };

// ---- plan-map: a stop beat from the storyboard
{
  const tmp = mkdtempSync(join(tmpdir(), "rp-stop-")), pd = join(tmp, ".reelplanning", "plans", "2099-01-01-x"), vd = join(pd, "walkthrough-video");
  mkdirSync(vd, { recursive: true });
  writeFileSync(join(pd, "plan.md"), "# X\n\n## The problem\n\nx\n\n### Step 1 — One\n\nx\n");
  writeFileSync(join(pd, "walkthrough.md"), "# W\n\n| id | Step | Chose | Instead of | Why | Check |\n|---|---|---|---|---|---|\n| A1 | 1 | Retry three times [close] | five | enough | src/a.ts |\n| A2 | 1 | Hex bitmap [visible] | an array | small | src/b.ts |\n| D1 | 1 | No sweep [deviation] | a sweep | later | src/c.ts |\n");
  writeFileSync(join(vd, "STORYBOARD.md"), "---\nplan_dir: .reelplanning/plans/2099-01-01-x\n---\n\n## Frame 1 — Calls\n- src: compositions/frames/01-calls.html\n- duration: 6\n- plan_step: 1\n- autonomy: a1, A2\n\n## Frame 2 — Deviation\n- src: compositions/frames/02-dev.html\n- duration: 5\n- plan_step: 1\n- autonomy: d1\n");
  execFileSync("git", ["init", "-q"], { cwd: tmp });
  execFileSync("node", [join(ROOT, "scripts", "plan-map.mjs"), vd], { cwd: tmp, stdio: "ignore" });
  const m = JSON.parse(readFileSync(join(vd, "plan-map.json"), "utf8")), g = (m.autonomyGroups || [])[0];
  ok(g?.stop === true && g.id === "stop-1" && g.ids.join() === "a1,a2" && g.calls.map((c) => c.chose).join(" | ") === "Retry three times | Hex bitmap" && g.calls[0].insteadOf === "five" && g.calls[1].check === "src/b.ts" && Math.abs(g.at - 5.95) < 0.01, `plan-map: "- autonomy: a1, A2" is one stop beat, its calls' words from their rows — ${JSON.stringify(g)}`);
  ok(m.autonomy.length === 1 && m.autonomy[0].id === "d1" && m.autonomy[0].chose === "No sweep" && m.autonomy[0].insteadOf === "a sweep", `plan-map: one id is a beat of its own, as before, its words from its row where the beat has none — ${JSON.stringify(m.autonomy)}`);
  rmSync(tmp, { recursive: true, force: true });
}

// ---- the player
const project = "videos/l2-upload-resume", map = "packages/player/test/fixtures/l2-autonomy-stop.json", port = testPort(8884);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`); await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
await loaded(p);
const rp = p.locator("#rp"), E = (f, a) => p.evaluate(f, a);
const band = () => E(() => { const el = document.querySelector("#rp"), d = el.shadowRoot.querySelector(".decision");
  return { on: d.classList.contains("on"), band: d.classList.contains("band"), k: d.querySelector(".k").textContent, q: d.querySelector(".q").textContent, pending: el._pendingDecision?.kind || null, stop: !!el._pendingDecision?.g?.stop,
    accAll: !!d.querySelector("[data-gaccept]"), own: !d.querySelector(".own").hidden, fb: d.querySelector(".feedback").style.display === "block" ? d.querySelector(".feedback").textContent : "",
    rows: [...d.querySelectorAll(".crow")].map((r) => ({ id: r.dataset.call, v: r.dataset.verdict, cur: r.hasAttribute("data-current"), text: r.querySelector(".cw").textContent, acts: [...r.querySelectorAll("button")].map((x) => x.textContent.trim()) })),
    playing: !el.player.paused }; });
const into = async (at) => { await E((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, at - 1.2); await seeked(p, at - 1.2); await still(p); await rp.locator('[data-act="play"]').click(); await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 }); await settled(p); };
// a call's verdict given (or changed to v), and the band redrawn
const verdict = async (id, v = null) => { await until(p, ([id, v]) => { const a = document.querySelector("#rp").autonomy[id]; return v ? a?.verdict === v : !!a; }, [id, v]); await flush(p); };
// own words open for a call, shown
const ownOpen = async () => { await until(p, () => { const o = document.querySelector("#rp").shadowRoot.querySelector(".decision .own"), t = o?.querySelector("textarea"); return !!o && !o.hidden && !!t && t.getClientRects().length > 0; }); await settled(p); };
// every call judged, the band gone, and the video on: playing (its time moving), not just asked to
const goneOn = async (t0) => { await until(p, () => ["a5", "a6", "a7"].every((id) => !!document.querySelector("#rp").autonomy[id]) && !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on")); await movedOn(p, t0); };
// "More"'s popover open on the key given, or put away
const popIs = (on, key = null) => until(p, ([on, key]) => { const el = document.querySelector("#rp"), shown = !el.shadowRoot.querySelector(".fpop").hidden; return on ? shown && (!key || el._more?.key === key) : !shown; }, [on, key]);
const g = (await E(() => document.querySelector("#rp").planMap)).autonomyGroups[0];
try {
  await into(g.at);
  let s = await band();
  ok(s.on && s.band && s.pending === "group" && s.stop && /step 4 · 3 choices/.test(s.k), `one pause for the step's three choices (D-127: choice, not call), in the band — ${s.k}`);
  ok(s.rows.map((r) => r.id).join() === "a5,a6,a7" && s.rows.every((r, i) => r.text.includes(g.calls[i].chose) && r.text.includes(`instead of ${g.calls[i].insteadOf}`)), `each call listed with what it chose and instead of what — ${JSON.stringify(s.rows.map((r) => r.text))}`);
  ok(s.rows.every((r) => /^Accept/.test(r.acts[0]) && /^Flag/.test(r.acts[1]) && /^Own words/.test(r.acts[2])) && !s.accAll && !s.own, `each with its own Accept, Flag and own words, and no Accept all — ${JSON.stringify(s.rows.map((r) => r.acts))}`);
  ok(s.rows[0].cur && !s.rows[1].cur, "the first call still waiting carries the keys");

  // one verdict by click: the band stays, the next call carries the keys
  await rp.locator('.decision [data-sverdict="a6:flag"]').click(); await verdict("a6", "flag");
  s = await band();
  ok(s.on && !s.playing && s.rows[1].v === "flag" && s.rows[0].cur, `Flag on a6: the band stays up, the others still waiting — ${JSON.stringify(s.rows.map((r) => [r.id, r.v, r.cur]))}`);
  ok(await E(() => document.querySelector("#rp").annotations.some((a) => a.kind === "flag" && /Flagged: the manifest keeps/.test(a.comment))), "the flag is a note on its step, as a call's own Flag is");
  // A judges the first still waiting
  await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("a"); await verdict("a5");
  s = await band();
  ok(s.on && s.rows[0].v === "accept" && s.rows[2].cur, `A accepts the first call still waiting (a5), and a7 carries the keys now — ${JSON.stringify(s.rows.map((r) => [r.id, r.v, r.cur]))}`);
  // O on the last: own words, a change; that is its verdict, and the video goes on
  await p.keyboard.press("o"); await ownOpen();
  s = await band();
  ok(s.own && /a7|A7/.test(await E(() => document.querySelector("#rp").shadowRoot.querySelector(".own textarea").placeholder)), "O opens own words for the call carrying the keys (A7)");
  let t0 = await now(p);
  await p.keyboard.type("keep it for 30 days"); await p.keyboard.press("Enter"); await goneOn(t0);
  s = await band();
  const v = await E(() => { const el = document.querySelector("#rp"); return { a: Object.fromEntries(["a5", "a6", "a7"].map((id) => [id, el.autonomy[id]])), count: el.shadowRoot.querySelector(".autosec .count").textContent, tick: el.shadowRoot.querySelector('.scrub .tick[data-kind="group"]').dataset.answered, comments: el.annotations.filter((a) => /keep it for 30 days/.test(a.comment)).length, rows: el.exportPayload().autonomy }; });
  ok(v.a.a5.verdict === "accept" && v.a.a6.verdict === "flag" && v.a.a7.verdict === "own" && v.a.a7.own === "keep it for 30 days" && v.comments === 1, `each call has its own verdict; own words are a change, with its comment — ${JSON.stringify(Object.values(v.a).map((x) => x.verdict))}`);
  ok(!s.on && s.playing, "once each has a verdict, the video goes on");
  ok(v.count === " · 3 of 4" && v.tick === "true" && v.rows.filter((r) => ["a5", "a6", "a7"].includes(r.id)).every((r) => Math.abs(r.t - g.at) < 0.01 && r.planStep === 4), `the record counts each call, the mark reads answered, the export carries each — ${JSON.stringify({ count: v.count, tick: v.tick })}`);
  await E(() => document.querySelector("#rp").player.pause());

  // met again: each can still be changed; Continue goes on
  await into(g.at);
  s = await band();
  ok(/answered/.test(s.k) && /You accepted 1, flagged 1, sent 1 as a change/.test(s.fb) && s.rows.map((r) => r.v).join() === "accept,flag,own", `met again, it shows what was given — ${s.fb}`);
  await rp.locator('.decision [data-sverdict="a6:accept"]').click(); await verdict("a6", "accept");
  s = await band();
  const back = await E(() => { const el = document.querySelector("#rp"); return { a6: el.autonomy.a6?.verdict, flags: el.annotations.filter((a) => a.kind === "flag").length }; });
  ok(s.on && back.a6 === "accept" && back.flags === 0 && /You accepted 2, sent 1 as a change/.test(s.fb), `a verdict changed there replaces the other, and the flag's note goes — ${JSON.stringify(back)}`);
  await rp.locator(".decision .gobtn").click(); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"));
  ok(!(await band()).on, "Continue goes on");
  // the call's time in the record opens its stop beat
  await E(() => document.querySelector("#rp").player.pause());
  await E(() => document.querySelector("#rp").openPoint("call", "a7")); await asked(p, g.id); await settled(p);
  s = await band();
  ok(s.on && s.stop, "a call's time in the record opens its stop beat");
  await E(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); });

  // ---- answer in the frame (plan 2026-09-25): a frame that draws a card per choice (`data-call="a5"`) is
  // answered on it. Each choice's Accept, Flag and own words hang from its own card; a verdict rings the card;
  // own words open under that card; "More" on a card shows instead of what, why and where to check; A / B / O
  // still work; the video keeps its size; no bar is used for it.
  await p.reload(); await loaded(p);
  await E(() => { const el = document.querySelector("#rp"); for (const k of Object.keys(el.autonomy)) delete el.autonomy[k]; try { localStorage.clear(); } catch {} el.annotations = []; });
  const cid = (await E(() => document.querySelector("#rp").planMap)).frames.find((f) => f.index === g.frameIndex).compositionId;
  await E(({ cid, calls }) => { const doc = document.querySelector("#rp").player.iframeElement.contentDocument, host = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === cid);
    const box = doc.createElement("div"); box.style.cssText = "position:absolute;inset:0;z-index:50;background:#FAF9F5";
    box.innerHTML = calls.map((c, i) => `<div data-call="${c.id}" style="position:absolute;left:180px;top:${120 + i * 250}px;width:1560px;height:200px;box-sizing:border-box;padding:36px 40px;border-radius:12px;background:#EFE9DE;font:400 44px/1.2 Georgia,serif;color:#141413">${c.id.toUpperCase()} · ${c.chose}</div>`).join("");
    host.appendChild(box); }, { cid, calls: g.calls });
  const size0 = await E(() => { const b = document.querySelector("#rp").shadowRoot.querySelector(".stage").getBoundingClientRect(); return [b.width, b.height]; });
  await into(g.at);
  const onf = () => E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), sb = r.querySelector(".stage").getBoundingClientRect();
    const doc = el.player.iframeElement.contentDocument, ifr = el.player.iframeElement.getBoundingClientRect(), sx = ifr.width / doc.defaultView.innerWidth;
    const card = (id) => { const c = doc.querySelector(`[data-call="${id}"]`).getBoundingClientRect(); return { l: ifr.left + c.left * sx, t: ifr.top + c.top * sx, r: ifr.left + c.right * sx, b: ifr.top + c.bottom * sx }; };
    return { onframe: d.classList.contains("onframe"), band: d.classList.contains("band"), stage: [sb.width, sb.height],
      rows: [...d.querySelectorAll(".crow")].map((x) => { const bb = x.getBoundingClientRect(), c = card(x.dataset.call); return { id: x.dataset.call, v: x.dataset.verdict, right: Math.round(c.r - bb.right), below: Math.round(bb.top - c.b), inside: bb.top >= c.t && bb.bottom <= c.b + 1, acts: [...x.querySelectorAll("button")].filter((y) => y.getBoundingClientRect().height > 0).map((y) => y.textContent.replace(/\s+/g, " ").trim()) }; }),
      rings: [...r.querySelectorAll(".hits .cring")].map((x) => ({ id: x.dataset.call, v: x.dataset.verdict || "", tag: x.textContent })), more: r.querySelectorAll(".hits .cmore:not([hidden])").length,
      own: (() => { const o = d.querySelector(".own"); if (!o.classList.contains("open") || o.hidden) return null; const bb = o.getBoundingClientRect(), c = card(el._ownFor); return { for: el._ownFor, below: Math.round(bb.top - c.b), over: bb.left < c.r && bb.right > c.l }; })(), playing: !el.player.paused }; });
  let f = await onf();
  ok(f.onframe && !f.band && f.rows.length === 3 && f.rows.every((x) => (x.inside ? x.right >= 0 : Math.abs(x.right) <= 2 && x.below >= -1 && x.below <= 14) && /^Accept/.test(x.acts[0]) && /^Flag/.test(x.acts[1]) && /^Own words/.test(x.acts[2])), `on the frame: each choice's Accept, Flag and own words hang from its own card: under its corner, or inside at its top right where the next card is close — ${JSON.stringify(f.rows.map((x) => [x.id, x.right, x.below, x.inside]))}`);
  ok(f.rings.length === 3 && f.more === 3 && f.rings.every((x) => !x.v), `each card carries a ring for its verdict and a "More" — ${f.more} More`);
  await rp.locator('.hits .cmore[data-more="call:a6"]').click(); await popIs(true, "call:a6"); await frames(p);
  const pop = await E(() => { const r = document.querySelector("#rp").shadowRoot, x = r.querySelector(".fpop"); return { shown: !x.hidden, text: x.textContent }; });
  ok(pop.shown && pop.text.includes(g.calls[1].chose) && pop.text.includes(g.calls[1].insteadOf) && /Why/.test(pop.text), `"More" on a choice's card shows it in full: what it chose, instead of what, why — "${pop.text.slice(0, 90)}…"`);
  await p.keyboard.press("Escape"); await popIs(false);
  ok(await E(() => document.querySelector("#rp").shadowRoot.querySelector(".fpop").hidden), "Esc puts it away");
  // "More" never covers a choice's Accept, Flag and own words (the owner's review: under A10's card it did), here on
  // cards as wide as the frame, where there is no room beside them: for each card, hovered and from its chip, at
  // 1440 and 1024, the popover meets no control and not its card, and a click at each control's centre lands on it
  const clear = () => E(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, d = r.querySelector(".decision"), pop = r.querySelector(".fpop"), sb = r.querySelector(".stage").getBoundingClientRect();
    const seen = (x) => x.getClientRects().length > 0 && getComputedStyle(x).visibility !== "hidden" && x.getBoundingClientRect().width > 0, meet = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const name = (x) => x.dataset.more ? `More ${x.dataset.more}` : x.dataset.sverdict || x.textContent.replace(/\s+/g, " ").trim().slice(0, 20);
    const ctrls = [...d.querySelectorAll("button, input, textarea, select, .own.open"), ...r.querySelectorAll(".hits .cmore")].filter(seen), pb = pop.getBoundingClientRect(), key = el._more?.key, cb = key && el._callCards?.[key.slice(5)];
    const card = cb && { left: sb.left + (cb.l / 100) * sb.width, top: sb.top + (cb.t / 100) * sb.height, right: sb.left + ((cb.l + cb.w) / 100) * sb.width, bottom: sb.top + ((cb.t + cb.h) / 100) * sb.height };
    return { shown: !pop.hidden, key, n: ctrls.length, onCard: !!card && meet(pb, card), inWindow: pb.left >= 0 && pb.top >= 0 && pb.right <= innerWidth && pb.bottom <= innerHeight,
      over: ctrls.filter((x) => meet(pb, x.getBoundingClientRect())).map(name),
      blocked: ctrls.filter((x) => { const b = x.getBoundingClientRect(), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2; if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return false; const at = r.elementFromPoint(cx, cy); return !(at && (at === x || x.contains(at))); }).map(name) }; });
  for (const [w, h] of [[1440, 1000], [1024, 800]]) {
    await p.setViewportSize({ width: w, height: h }); await frames(p); await settled(p);   // laid out again at the new size (and the frame looked at again)
    for (const c of g.calls) {
      const at = await E((id) => { const el = document.querySelector("#rp"), b = el._callCards?.[id], sb = el.shadowRoot.querySelector(".stage").getBoundingClientRect(); return b && { x: sb.left + ((b.l + b.w / 2) / 100) * sb.width, y: sb.top + ((b.t + b.h / 2) / 100) * sb.height }; }, c.id);
      await p.mouse.move(5, 5); await popIs(false); await p.mouse.move(at.x, at.y); await popIs(true, `call:${c.id}`); await frames(p);
      let m = await clear();
      ok(m.shown && m.key === `call:${c.id}` && !m.over.length && !m.blocked.length && !m.onCard && m.inWindow, `${w}px: "More" on ${c.id.toUpperCase()}, hovered: clear of every control (${m.n}) and of its card — over ${JSON.stringify(m.over)}, blocked ${JSON.stringify(m.blocked)}`);
      // on to the card's own Accept: the hover-opened "More" goes at once
      const acc = await E((id) => { const b = document.querySelector("#rp").shadowRoot.querySelector(`.decision [data-sverdict="${id}:accept"]`).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, c.id);
      await p.mouse.move(acc.x, acc.y, { steps: 6 }); await frames(p);   // "at once": the pointer reaching a control closes it as it arrives
      ok(!(await clear()).shown, `${w}px: from ${c.id.toUpperCase()}'s card on to its Accept, the hovered "More" goes`);
      await p.mouse.move(5, 5); await popIs(false);
      await rp.locator(`.hits .cmore[data-more="call:${c.id}"]`).click(); await popIs(true, `call:${c.id}`); await frames(p);
      m = await clear();
      ok(m.shown && m.key === `call:${c.id}` && !m.over.length && !m.blocked.length && !m.onCard && m.inWindow, `${w}px: "More" on ${c.id.toUpperCase()}, from its chip: clear of every control (${m.n}) and of its card — over ${JSON.stringify(m.over)}, blocked ${JSON.stringify(m.blocked)}`);
      await p.keyboard.press("Escape"); await popIs(false);
    }
  }
  await p.setViewportSize({ width: 1440, height: 1000 }); await frames(p); await settled(p);
  await rp.locator('.decision [data-sverdict="a6:flag"]').click(); await verdict("a6", "flag");
  await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("a"); await verdict("a5"); await settled(p);
  f = await onf();
  ok(f.rings.find((x) => x.id === "a6").v === "flag" && f.rings.find((x) => x.id === "a5").v === "accept" && /Flagged/.test(f.rings.find((x) => x.id === "a6").tag) && !f.playing, `a click flags A6 on its card, A accepts A5: each card is ringed with its verdict, the others still wait — ${JSON.stringify(f.rings)}`);
  await p.keyboard.press("o"); await ownOpen();
  f = await onf();
  ok(f.own && f.own.for === "a7" && f.own.over && f.own.below >= 0, `O opens own words under A7's own card — ${JSON.stringify(f.own)}`);
  t0 = await now(p);
  await p.keyboard.type("keep it for 30 days"); await p.keyboard.press("Enter"); await goneOn(t0);
  f = await onf();
  const vv = await E(() => { const el = document.querySelector("#rp"); return ["a5", "a6", "a7"].map((id) => el.autonomy[id]?.verdict).join(); });
  ok(vv === "accept,flag,own" && f.playing, `each has its verdict from the frame, and the video goes on — ${vv}`);
  ok(f.stage[0] === size0[0] && f.stage[1] === size0[1], `the video keeps its size — ${size0.map(Math.round).join("×")}`);
} catch (e) { fails.push("threw: " + String(e?.stack || e).slice(0, 400)); console.log(e); }
finally { await b.close(); srv.kill(); }
console.log(fails.length ? `✗ ${fails.length} failed` : "✓ stop: all passed");
process.exit(fails.length ? 1 : 0);
