#!/usr/bin/env node
// The list (walkthroughs-that-help step 2, D-221): the choices that do not pause share one sheet at the end
// of the walkthrough video.
//   - one row per choice: what it chose and instead of what, in words, each with its own Flag; no Accept
//   - one flagged stays flagged; Go on (A) takes the rest as listed, not judged, and the video goes on
//   - the record says "Listed, not judged"; the export carries `listed` as their verdict
//   - met again, it says what was given, and a flag can be taken back
//   - on a frame that draws a card per choice (`data-call`), each row's Flag hangs from its card
// Runs on L2 with the list fixture: the group fixture with its grouped beat (a5, a6, a7) made the list.
// usage: node packages/player/test/list.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked, still, settled, loaded, now, movedOn } from "./wait.mjs";
import { tmpdir } from "node:os"; import { join } from "node:path";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-autonomy-list.json";
const port = testPort(8887);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
const ready = () => loaded(p);
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`); await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload(); await ready();
const rp = p.locator("#rp");
const E = (f, a) => p.evaluate(f, a);
const sheet = () => E(() => { const el = document.querySelector("#rp"), d = el.shadowRoot.querySelector(".decision");
  return { on: d.classList.contains("on"), k: d.querySelector(".k").textContent, q: d.querySelector(".q").textContent, own: !d.querySelector(".own").hidden,
    rows: [...d.querySelectorAll(".crow")].map((r) => ({ id: r.dataset.call, words: r.querySelector(".cw")?.textContent || "", flag: r.querySelector("[data-gflag]")?.getAttribute("aria-pressed"), accept: !!r.querySelector('[data-sverdict$=":accept"]') })),
    go: d.querySelector(".opts [data-gaccept]")?.textContent || "", fb: d.querySelector(".feedback").style.display === "block" ? d.querySelector(".feedback").textContent : "", pending: el._pendingDecision?.kind || null, list: !!el._pendingDecision?.g?.list }; });
const playInto = async (at) => { await E((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, at - 1.2); await seeked(p, at - 1.2); await still(p); await rp.locator('[data-act="play"]').click(); await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 }); await settled(p); };
// a row's Flag: pressed (true) or taken back (false), and the sheet redrawn
const flagged = async (id, on) => { await until(p, ([id, on]) => (document.querySelector("#rp").autonomy[id]?.verdict === "flag") === on, [id, on]); await frames(p); };
// every choice of the list given a verdict
const judged = (ids) => until(p, (ids) => ids.every((id) => !!document.querySelector("#rp").autonomy[id]), ids);
const g = (await E(() => document.querySelector("#rp").planMap)).autonomyGroups[0];

try {
  await playInto(g.at);
  let s = await sheet();
  ok(s.on && s.list && /the list · 3/.test(s.k) && /listed, not judged/.test(s.q) && s.rows.map((r) => r.id).join() === "a5,a6,a7", `the list stops the video once, a row per choice — ${JSON.stringify({ k: s.k, q: s.q, rows: s.rows.map((r) => r.id) })}`);
  ok(s.rows.every((r, i) => r.words.includes(g.calls[i].chose) && r.words.includes(`instead of ${g.calls[i].insteadOf}`)), "each row says what it chose and instead of what, in one line");
  ok(s.rows.every((r) => r.flag === "false" && !r.accept) && /Go on/.test(s.go) && !s.own, `each row has its own Flag and no Accept; one Go on; no own-words box — ${JSON.stringify(s.rows.map((r) => [r.flag, r.accept]))}`);
  await p.screenshot({ path: join(tmpdir(), "list-light.png") });

  await rp.locator('.decision [data-gflag="a6"]').click(); await flagged("a6", true);
  s = await sheet();
  ok(s.on && s.rows.find((r) => r.id === "a6").flag === "true", "Flag on one row marks it, and the sheet stays up");
  ok(await E(() => document.querySelector("#rp").annotations.some((a) => a.kind === "flag" && /Flagged: the manifest keeps/.test(a.comment))), "the flag is a note on its step, as a flag on a pause is");
  let t0 = await now(p); await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("a");
  await judged(["a5", "a6", "a7"]); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on")); await movedOn(p, t0);
  const v = await E(() => { const el = document.querySelector("#rp"); return { a: Object.fromEntries(["a5", "a6", "a7"].map((id) => [id, el.autonomy[id]?.verdict])), on: el.shadowRoot.querySelector(".decision").classList.contains("on"), playing: !el.player.paused, log: el.shadowRoot.querySelector(".autolog").textContent }; });
  ok(v.a.a5 === "listed" && v.a.a6 === "flag" && v.a.a7 === "listed", `Go on (A) takes the rest as listed, not judged; the flagged one stays flagged — ${JSON.stringify(v.a)}`);
  ok(!v.on && v.playing, "and the video goes on");
  ok(/Listed, not judged/.test(v.log) && /Flagged/.test(v.log), "the record says which were listed and which flagged");
  const ex = await E(() => { const el = document.querySelector("#rp"); return { rows: el.exportPayload().autonomy, line: el.lineFor("call:a5") }; });
  const by = Object.fromEntries(ex.rows.map((r) => [r.id, r]));
  ok(by.a5?.verdict === "listed" && by.a6?.verdict === "flag" && by.a7?.verdict === "listed" && /→ listed, not judged/.test(ex.line), `the export carries each verdict — ${JSON.stringify(ex.rows.map((r) => [r.id, r.verdict]))}`);
  // walkthroughs-that-help step 6: each choice says when its pause began, beside when it was judged
  ok(ex.rows.every((r) => r.shownAt && r.judgedAt && Date.parse(r.shownAt) <= Date.parse(r.judgedAt) && Date.parse(r.judgedAt) - Date.parse(r.shownAt) < 60000), `each verdict carries shownAt, when its pause began, before its judgedAt — ${JSON.stringify(ex.rows.map((r) => [r.id, r.shownAt, r.judgedAt]))}`);
  await E(() => document.querySelector("#rp").player.pause());

  await playInto(g.at);
  s = await sheet();
  ok(/seen/.test(s.k) && /You flagged 1; the rest are listed/.test(s.fb), `met again, it says what was given — ${JSON.stringify({ k: s.k, fb: s.fb })}`);
  await rp.locator('.decision [data-gflag="a6"]').click(); await flagged("a6", false);
  const back = await E(() => { const el = document.querySelector("#rp"); return { a6: el.autonomy.a6, flags: el.annotations.filter((a) => a.kind === "flag").length }; });
  ok(!back.a6 && back.flags === 0, `a flag taken back leaves the choice to Go on, and its note goes — ${JSON.stringify(back)}`);
  await p.keyboard.press("a"); await judged(["a6"]);
  ok(await E(() => document.querySelector("#rp").autonomy.a6?.verdict === "listed"), "and Go on lists it");
  await E(() => { const el = document.querySelector("#rp"); el.giveWay(); el.player.pause(); });

  // on the frame: a card per choice (`data-call`)
  await p.reload(); await ready();
  await E(() => { const el = document.querySelector("#rp"); for (const k of Object.keys(el.autonomy)) delete el.autonomy[k]; el.annotations = []; try { localStorage.clear(); } catch {} });
  const cid = (await E(() => document.querySelector("#rp").planMap)).frames.find((f) => f.index === g.frameIndex).compositionId;
  await E(({ cid, calls }) => { const doc = document.querySelector("#rp").player.iframeElement.contentDocument, host = [...doc.querySelectorAll("[data-composition-id]")].find((x) => x.dataset.compositionId === cid);
    const box = doc.createElement("div"); box.style.cssText = "position:absolute;inset:0;z-index:50;background:#FAF9F5";
    box.innerHTML = calls.map((c, i) => `<div data-call="${c.id}" style="position:absolute;left:180px;top:${120 + i * 250}px;width:1560px;height:200px;box-sizing:border-box;padding:36px 40px;border-radius:12px;background:#EFE9DE;font:400 44px/1.2 Georgia,serif;color:#141413">${c.id.toUpperCase()} · ${c.chose}</div>`).join("");
    host.appendChild(box); }, { cid, calls: g.calls });
  await playInto(g.at);
  const f = await E(() => { const el = document.querySelector("#rp"), d = el.shadowRoot.querySelector(".decision"), doc = el.player.iframeElement.contentDocument, ifr = el.player.iframeElement.getBoundingClientRect(), sx = ifr.width / doc.defaultView.innerWidth;
    const card = (id) => { const c = doc.querySelector(`[data-call="${id}"]`).getBoundingClientRect(); return { l: ifr.left + c.left * sx, r: ifr.left + c.right * sx, t: ifr.top + c.top * sx, b: ifr.top + c.bottom * sx }; };
    const go = d.querySelector(".opts [data-gaccept]").getBoundingClientRect(), low = Math.max(...["a5", "a6", "a7"].map((id) => card(id).b));
    return { onframe: d.classList.contains("onframe"), flags: [...d.querySelectorAll("[data-gflag]")].map((x) => { const bb = x.getBoundingClientRect(), c = card(x.dataset.gflag); return { id: x.dataset.gflag, inside: bb.left >= c.l - 2 && bb.right <= c.r + 2, near: bb.top >= c.t && bb.top - c.b <= 16, w: Math.round(bb.width) }; }), go: Math.round(go.top - low), gw: Math.round(go.width) }; });
  // (as a stop's rows: under its card's corner, or inside at its bottom right where the next card is close)
  ok(f.onframe && f.flags.length === 3 && f.flags.every((x) => x.inside && x.near && x.w > 0) && f.gw > 0 && f.go > 0, `on the frame: each Flag at its own card, Go on under the cards — ${JSON.stringify(f)}`);
  await p.screenshot({ path: join(tmpdir(), "list-frame.png") });
  await rp.locator('.decision [data-gflag="a7"]').click(); await flagged("a7", true);
  await E(() => document.querySelector("#rp").focus()); await p.keyboard.press("a"); await judged(["a5", "a6", "a7"]);
  const vf = await E(() => { const el = document.querySelector("#rp"); return ["a5", "a6", "a7"].map((id) => el.autonomy[id]?.verdict).join(); });
  ok(vf === "listed,listed,flag", `a Flag on A7's card, then A: the rest listed — ${vf}`);

  // walkthroughs-that-help step 3: a walkthrough ends on one open question, with room for your words, where the
  // review is finished; the words go with the review as a note on no step (`open: true`)
  await E(() => { const el = document.querySelector("#rp"); el.player.pause(); el.giveWay?.(); el.planMap = { ...el.planMap, project: "walkthrough-video", openQuestion: { question: "Seeing it run, anything you'd change?", frameIndex: 12, at: 150 } }; el.showHandoff({ finishing: true }); });
  await until(p, () => !!document.querySelector("#rp").shadowRoot.querySelector(".handoff .openq textarea[data-openq]")); await frames(p);
  const oq = await E(() => { const r = document.querySelector("#rp").shadowRoot, q = r.querySelector(".handoff .openq"); return q && { label: q.querySelector("label").textContent, box: !!q.querySelector("textarea[data-openq]"), first: r.querySelector(".handoff .openq").compareDocumentPosition(r.querySelector(".handoff .verdict") || r.querySelector(".handoff .lede")) & 4 }; });
  ok(oq && oq.label === "Seeing it run, anything you'd change?" && oq.box && oq.first, `Finish asks the open question first, with a box for your words — ${JSON.stringify(oq)}`);
  await rp.locator(".handoff [data-openq]").fill("the list should sit before the tests line"); await rp.locator(".handoff [data-openq]").blur(); await until(p, () => document.querySelector("#rp").annotations.some((x) => x.open));
  const on = await E(() => { const el = document.querySelector("#rp"), a = el.annotations.filter((x) => x.open); return { n: a.length, a: a[0] && { comment: a[0].comment, about: a[0].about, step: a[0].plan?.step ?? null, kind: a[0].kind }, kept: el.shadowRoot.querySelector(".handoff [data-openq]")?.value, ex: el.exportPayload().annotations.filter((x) => x.open).length }; });
  ok(on.n === 1 && on.a.comment === "the list should sit before the tests line" && on.a.about === "Seeing it run, anything you'd change?" && on.a.step == null && on.a.kind === "note" && on.kept === on.a.comment && on.ex === 1, `your words are one note on no step, sent with the review, and the box keeps them — ${JSON.stringify(on)}`);
  await rp.locator(".handoff [data-openq]").fill(""); await rp.locator(".handoff [data-openq]").blur(); await until(p, () => !document.querySelector("#rp").annotations.some((x) => x.open));
  ok(await E(() => !document.querySelector("#rp").annotations.some((x) => x.open)), "emptied, the note goes");
  await E(() => { const el = document.querySelector("#rp"); el.planMap = { ...el.planMap, project: "video", openQuestion: undefined }; el.showHandoff({ finishing: true }); });
  ok(await E(() => !document.querySelector("#rp").shadowRoot.querySelector(".handoff .openq")), "a plan video's Finish has no open question");
} finally {
  await b.close(); srv.kill();
}
console.log(fails.length ? `✗ ${fails.length} failed` : "✓ list: all passed");
process.exit(fails.length ? 1 : 0);
