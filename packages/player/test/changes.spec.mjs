#!/usr/bin/env node
// The "just the changes" mode: the default after a rebuild, one toggle to the whole video and back
// (remembered per video), it starts at the first changed beat and skips the rest as it plays, and a
// seek to an unchanged beat still plays that beat. A question still open is never skipped, and a video
// never reviewed opens on the whole video. A quick check at the end of a skipped beat is passed over while
// just the changes play, and asked when reached in the whole video.
// usage: node packages/player/test/changes.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { existsSync } from "node:fs";
import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, when, frames, seeked, loaded } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const port = testPort(8861);
const srv = staticServer(port);
await serverUp(port, { child: srv });
// every question answered, each with the option whose branch holds a changed beat when it has one: an
// answer routes out of the branches it did not choose (a seek), so a changed beat in an unchosen branch
// would never play through (the fixture's changed beats 6 and 13 are branches 1a and 2b)
const answerAll = () => { window.__answerAll = (rp, pick) => {
  const fr = rp.planMap.frames.filter((f) => pick.includes(f.index));
  for (const d of rp.planMap.decisions || []) {
    const o = (d.options || []).find((o) => o.branch && fr.some((f) => f.start >= o.branch.start - 0.1 && f.start < o.branch.end - 0.1)) || (d.options || [])[0];
    rp.decisions[d.id] = { option: o?.id || "a", label: o?.label || "a" };
  }
}; };
const b = await chromium.launch(launchOpts());
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); await p.addInitScript(answerAll);
const fails = [];
const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload();
await loaded(p);

// force a known set of changed beats, so the test does not depend on git history (`at` is the build's
// signature: the same value after a reload is the same build)
const force = () => p.evaluate(() => {
  const rp = document.querySelector("#rp");
  const fr = rp.planMap.frames;
  const pick = [fr[5].index, fr[12].index];
  rp.planMap.changes = { at: "test-build-1", changedFrames: pick, restyled: 0, changedSeconds: fr[5].durationSeconds + fr[12].durationSeconds, totalSeconds: rp.planMap.totalSeconds };
  for (const f of fr) f.change = pick.includes(f.index) ? { status: "edited", shown: true } : { status: "same" };
  // a review of an earlier build was sent (newRoundIfRebuilt archived it) and its questions answered
  rp._newRound = true; rp._onlyFor = null; window.__answerAll(rp, pick);
  rp.renderChanges(); rp.renderGallery();
  return { first: fr[5].start, firstIdx: fr[5].index, secondIdx: fr[12].index, between: fr[8].start, betweenIdx: fr[8].index };
});
const line = () => p.evaluate(() => { const rp = document.querySelector("#rp"), r = rp.shadowRoot, box = r.querySelector(".revised"); return { only: !!rp._only, shown: !box.hidden, text: box.querySelector(".what").textContent, mode: box.querySelector(".mode").textContent, btn: box.querySelector(".onlybtn").textContent, rec: r.querySelector("section.changed .onlybtn").textContent, poster: r.querySelector(".idle .meta")?.textContent || "", stripes: [...r.querySelectorAll(".scrub .chg")].filter((x) => x.getBoundingClientRect().width > 2).length }; });
// where the video is the moment it plays on from t0: its time as it first moves while playing (a look a while later
// is that much further on, and on a loaded machine the while is long)
const playsFrom = (pg, t0) => when(pg, (t0) => { const pl = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return !pl.paused && pl.currentTime !== t0 && { t: pl.currentTime }; }, t0).then((x) => x?.t ?? null);
const nowT = (pg) => pg.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").currentTime);
const target = await force();
ok(!(await p.locator("#rp").locator("section.changed").isHidden()), "the changes panel appears when a build has changes");
ok((await p.locator("#rp").locator(".gallery button[data-changed]").count()) === 2, "changed beats are tagged in the rail");
// A rebuild since the reviewer's last round: just the changes is the default, and the line says so
const rev = await line();
ok(rev.shown && /2 of \d+ scenes changed/.test(rev.text), `a line above the video says what changed — "${rev.text}"`);
ok(rev.only && /Plays just the changes/.test(rev.mode) && rev.btn === "Play the whole video" && rev.rec === rev.btn, `a rebuilt video defaults to just the changes, said beside its one toggle — "${rev.mode}" · [${rev.btn}]`);
ok(/of changes/.test(rev.poster), `the poster says it will play the changes — "${rev.poster}"`);
ok(rev.stripes === 2, `the timeline still shows every beat, the changed ones marked — ${rev.stripes} marks`);

// play from the poster: it starts at the first changed beat
let t0 = await nowT(p);
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="play"]').click());
const t1 = (await playsFrom(p, t0)) ?? await nowT(p);
ok(Math.abs(t1 - target.first) < 3.5, `play starts at the first changed beat (t=${t1.toFixed(1)}, beat starts ${target.first.toFixed(1)})`);

// let it run past the end of that beat: it must jump to the second changed beat, not play what is between
const landed = await p.evaluate(async (idx) => {
  const rp = document.querySelector("#rp");
  for (let i = 0; i < 480; i++) {
    await new Promise(r => setTimeout(r, 250));
    const f = rp.frameAt(rp.shadowRoot.querySelector("hyperframes-player").currentTime);
    if (f && f.index === idx) return true;
    if (!rp._only) return false;          // mode ended early
  }
  return false;
}, target.secondIdx);
ok(landed, "it skips the unchanged beats as it plays and lands on the next changed one");

// a seek to an unchanged beat plays that beat: the mode only decides what plays through
await p.evaluate((at) => {
  const rp = document.querySelector("#rp"), pl = rp.shadowRoot.querySelector("hyperframes-player");
  rp._byHand = true; rp.jump(at + 0.5); if (pl.paused) pl.play();
}, target.between);
// two seconds of it played (by the video's own clock), still on that beat, playing, in the same mode. Not "stop at the
// first look that reads paused": right after a seek and a play, `paused` reads true for a moment and then false again,
// with the video going on. The seek pauses the frame's runtime at once; the runtime's word that it is paused can reach
// the player after the play was sent and before the frame has it, and the runtime's next word, once it plays, says so.
// On a loaded machine that moment is long enough to be looked at. A pause that stays is still caught: its time never
// gets there, nor does a beat skipped or a mode left, and the wait runs out.
const played = await when(p, ({ at, idx }) => {
  const rp = document.querySelector("#rp"), pl = rp.shadowRoot.querySelector("hyperframes-player"), f = rp.frameAt(pl.currentTime);
  return !pl.paused && pl.currentTime >= at + 2.5 && f?.index === idx && rp._only && { t: pl.currentTime };
}, { at: target.between, idx: target.betweenIdx }, 30000);
const stayed = { ok: !!played, t: played?.t ?? await nowT(p) };
ok(stayed.ok, `a seek to an unchanged beat plays it, in the same mode (t=${stayed.t.toFixed(1)})`);

// past the last changed beat it stops, and the mode stays as the reviewer set it
const stop = await p.evaluate(async (idx) => {
  const rp = document.querySelector("#rp"), pl = rp.shadowRoot.querySelector("hyperframes-player"), f = rp.planMap.frames.find((x) => x.index === idx);
  rp._byHand = true; rp.jump(f.start + f.durationSeconds - 1.2); if (pl.paused) pl.play();
  for (let i = 0; i < 120 && !pl.paused; i++) await new Promise(r => setTimeout(r, 250));
  return { paused: pl.paused, only: rp._only, at: rp.frameAt(pl.currentTime)?.index, end: f.index };
}, target.secondIdx);
ok(stop.paused && stop.only && stop.at === stop.end + 1, `after the last changed beat it pauses, still in changes mode (${JSON.stringify(stop)})`);

// the one toggle: the whole video, then back; both buttons agree, and the line says which
await p.locator("#rp").locator(".revised .onlybtn").click(); await until(p, () => !document.querySelector("#rp")._only); await frames(p);
const off = await line();
ok(!off.only && off.mode === "Plays the whole video" && off.btn === "Play just the changes" && off.rec === off.btn, `the toggle switches to the whole video — "${off.mode}" · [${off.btn}]`);
// remembered for this video: a reload of the same build keeps the reviewer's choice
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").pause());
await p.reload();
await loaded(p); await force();
ok(!(await line()).only, "the choice is remembered for this video after a reload");
await p.locator("#rp").locator(".revised .onlybtn").click(); await until(p, () => !!document.querySelector("#rp")._only); await frames(p);
const back = await line();
ok(back.only && back.btn === "Play the whole video", "and the toggle switches back to just the changes");
await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").pause());
// the next rebuild defaults to just the changes again, whatever was chosen for the last one
await p.evaluate(() => { const rp = document.querySelector("#rp"); rp._only = false; localStorage.setItem(`reelplanning:annotations:${rp.src}:only`, JSON.stringify({ sig: "test-build-1", only: false })); rp.planMap.changes.at = "test-build-2"; rp.renderChanges(); });
ok((await line()).only, "a new rebuild defaults to just the changes again");
// the very build the reviewer already sent a review of: nothing new since their round, so the whole video
// (even with an earlier round archived when this page loaded, as force() set: the round sent is this build's)
await p.evaluate(() => { const rp = document.querySelector("#rp"); localStorage.removeItem(`reelplanning:annotations:${rp.src}:only`); localStorage.setItem(`reelplanning:annotations:${rp.src}:round`, JSON.stringify({ sentAt: "2026-09-24T00:00:00Z", sig: "test-build-3" })); rp.planMap.changes.at = "test-build-3"; rp.renderChanges(); });
ok(!(await line()).only, "a build the reviewer already sent a review of opens on the whole video");

// a first build (every beat new) shows no line: there is nothing to skip
await p.evaluate(() => { const rp = document.querySelector("#rp"); rp.planMap.changes = { at: "first", changedFrames: rp.planMap.frames.map((f) => f.index), restyled: 0, changedSeconds: rp.planMap.totalSeconds, totalSeconds: rp.planMap.totalSeconds }; rp.renderChanges(); rp.renderScrub(); });
ok(await p.evaluate(() => { const rp = document.querySelector("#rp"), r = rp.shadowRoot; return r.querySelector(".revised").hidden && !r.querySelectorAll(".scrub .chg").length && !rp._only; }), "a first build shows no revised line, no marks, and plays the whole video");

// a question still open in an unchanged beat is not skipped: just the changes plays its beat and asks it
// (a plan never reviewed has every question open), and a video never reviewed opens on the whole video
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload();
await loaded(p);
const open = await p.evaluate(async () => {
  const rp = document.querySelector("#rp"), pl = rp.shadowRoot.querySelector("hyperframes-player"), fr = rp.planMap.frames;
  const q = (rp.planMap.decisions || [])[0]; if (!q) return { none: true };
  const after = fr.find((f) => f.index > q.frameIndex + 1) || fr[fr.length - 1];
  rp.planMap.changes = { at: "test-open", changedFrames: [after.index], restyled: 0, changedSeconds: after.durationSeconds, totalSeconds: rp.planMap.totalSeconds };
  rp._onlyFor = null; rp.renderChanges();
  const never = !rp._only;                                  // never reviewed: the whole video
  rp._newRound = true; rp._onlyFor = null; rp.renderChanges();   // now as after a review of an earlier build
  const pending = () => rp._pendingDecision && (rp._pendingDecision.id || rp._pendingDecision.q?.id);
  rp._byHand = true; rp.jump(Math.max(0, q.at - 2)); pl.play();
  for (let i = 0; i < 120 && pending() !== q.id; i++) await new Promise((r) => setTimeout(r, 250));
  pl.pause();
  return { id: q.id, never, only: rp._only, plays: rp.plays(q.frameIndex), asked: pending() === q.id };
});
ok(!open.none && open.never, `a video never reviewed opens on the whole video, though the build has changes (${JSON.stringify(open)})`);
ok(open.only && open.plays && open.asked, `an open question in an unchanged beat plays and is asked in just the changes (${open.id})`);

// a quick check at the very end of an unchanged beat (a synthetic one here: the fixture has none) is
// passed over on landing on the changed beat after it while just the changes play, and asked when the
// reviewer switches to the whole video and reaches it
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload();
await loaded(p);
const edge = await p.evaluate(async () => {
  const rp = document.querySelector("#rp"), pl = rp.shadowRoot.querySelector("hyperframes-player"), fr = rp.planMap.frames;
  const dec = new Set((rp.planMap.decisions || []).map((d) => d.frameIndex));
  const before = fr.find((f, i) => i > 0 && fr[i + 1] && !dec.has(f.index) && !dec.has(fr[i + 1].index));
  const after = fr[fr.indexOf(before) + 1];
  const q = { id: "k-edge", frameIndex: before.index, question: "Which beat is this?", options: [{ id: "a", label: "This one" }, { id: "b", label: "The next" }], answer: "a", explain: "it is asked at the end of its own beat", at: after.start - 0.2 };
  rp.planMap.quizzes = [q];
  rp.planMap.changes = { at: "test-edge", changedFrames: [after.index], restyled: 0, changedSeconds: after.durationSeconds, totalSeconds: rp.planMap.totalSeconds };
  for (const f of fr) f.change = f.index === after.index ? { status: "edited", shown: true } : { status: "same" };
  rp._newRound = true; rp._onlyFor = null; rp.renderChanges(); rp.renderGallery();
  const pending = () => rp._pendingDecision && rp.pendingId();
  rp.start(); rp.jumpToChanged(after); pl.play();
  // a second of the changed beat played (by the video's own clock), or the check asked
  for (let i = 0; i < 600 && !(pl.currentTime >= after.start + 1) && !pending(); i++) await new Promise((r) => setTimeout(r, 50));
  const skipped = { only: rp._only, asked: pending() === q.id, at: rp.frameAt(pl.currentTime)?.index };
  pl.pause();
  // the whole video, from just before the check: now it is asked when reached
  rp.toggleOnly(); pl.pause();
  rp._byHand = true; rp.jump(Math.max(0, q.at - 1.2)); pl.play();
  for (let i = 0; i < 120 && pending() !== q.id; i++) await new Promise((r) => setTimeout(r, 250));
  pl.pause();
  return { beat: before.index, skipped, whole: !rp._only, asked: pending() === q.id };
});
ok(edge.skipped.only && !edge.skipped.asked && edge.skipped.at === edge.beat + 1, `a quick check at the end of a skipped beat is not asked on landing on the changed beat after it (${JSON.stringify(edge.skipped)})`);
ok(edge.whole && edge.asked, `…but switched to the whole video, it is asked when reached (${JSON.stringify(edge)})`);

// the playhead moved before the first Play: just the changes starts from there, not from the first changed
// beat (the reviewer scrubbed to a place on purpose); on an unchanged beat it goes to the next changed one
for (const [where, expect] of [["second", "second"], ["between", "second"]]) {
  const q = await b.newPage({ viewport: { width: 1440, height: 1000 } }); await q.addInitScript(answerAll);
  await q.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
  await q.evaluate(() => { try { localStorage.clear(); } catch {} }); await q.reload();
  await loaded(q);
  const r = await q.evaluate((where) => {
    const rp = document.querySelector("#rp"), fr = rp.planMap.frames, pick = [fr[5].index, fr[12].index];
    rp.planMap.changes = { at: "test-build-1", changedFrames: pick, restyled: 0, changedSeconds: 1, totalSeconds: rp.planMap.totalSeconds };
    for (const f of fr) f.change = pick.includes(f.index) ? { status: "edited", shown: true } : { status: "same" };
    rp._newRound = true; rp._onlyFor = null; window.__answerAll(rp, pick);
    rp.renderChanges(); rp.renderGallery();
    rp.shadowRoot.querySelector("hyperframes-player").seek((where === "second" ? fr[12] : fr[8]).start + 1);
    return { second: fr[12].start, to: (where === "second" ? fr[12] : fr[8]).start + 1 };
  }, where);
  await seeked(q, r.to); await frames(q);
  const t0 = await nowT(q);
  await q.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="play"]').click());
  const t = (await playsFrom(q, t0)) ?? await nowT(q);
  ok(t >= r.second - 0.5 && t < r.second + 4, `moved to the ${where} beat before the first Play: just the changes plays from the ${expect} changed beat (t=${t.toFixed(1)}, it starts ${r.second.toFixed(1)})`);
  await q.close();
}

await b.close(); srv.kill();
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
