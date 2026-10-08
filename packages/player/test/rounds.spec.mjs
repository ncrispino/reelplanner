#!/usr/bin/env node
// A review is a round. Once it has been sent, a rebuilt video (a revise) starts the next round clean:
// the old marks, answers and verdict are archived, not shown again and not sent again. Saved answers
// that no longer fit the video (a question reworded under the same id, a mark on a frame that is gone)
// are treated the same way, even without a record of the send.
// usage: node packages/player/test/rounds.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { frames } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const port = testPort(8874);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 140)));
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}`;
// loaded: the map read (the round is decided, and the saved review read, in the same step as it lands) and the video ready
const load = async () => { await p.reload(); await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.planMap && el._mapTried && el.stage?.dataset.ready; }, null, { timeout: 90000 }); await frames(p); };
const state = () => p.evaluate(() => { const el = document.querySelector("#rp"); return { dec: Object.keys(el.decisions), ann: el.annotations.length, verdict: el.verdict, archives: Object.keys(localStorage).filter((k) => k.includes(":archive:")).length }; });
await p.goto(url); await p.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 90000 });
const info = await p.evaluate(() => { const el = document.querySelector("#rp"); const q = el.planMap.decisions[0]; return { key: "reelplanning:annotations:" + el.src, q: q.id, a: q.options[0], frame: el.planMap.frames[0].compositionId }; });
const seed = (extra) => p.evaluate(({ info, extra }) => { localStorage.clear(); const k = info.key;
  localStorage.setItem(k + ":decisions", JSON.stringify({ [info.q]: { option: "a", label: extra.label ?? info.a.label, planStep: 1 } }));
  localStorage.setItem(k, JSON.stringify([{ id: "m1", kind: "note", t: 1, comment: "old comment", frame: { compositionId: extra.frame ?? info.frame } }]));
  localStorage.setItem(k + ":verdict", "changes");
  if (extra.round) localStorage.setItem(k + ":round", JSON.stringify(extra.round)); }, { info, extra });

// 1. nothing sent, nothing stale: the review in progress is kept
await seed({}); await load();
let s = await state();
ok(s.dec.length === 1 && s.ann === 1 && s.verdict === "changes" && s.archives === 0, `a review in progress survives a reload — ${JSON.stringify(s)}`);
// 2. sent, and the same build: still that round (the reviewer can see what they sent)
const sig = await p.evaluate(() => document.querySelector("#rp").buildSig());
await seed({ round: { sentAt: "2026-09-23T00:00:00Z", id: "r1", sig } }); await load();
s = await state();
ok(s.dec.length === 1 && s.ann === 1 && s.archives === 0, `sent, same build: the round is kept — ${JSON.stringify(s)}`);
// 3. sent, then the video was rebuilt: a new round, the old one archived
await seed({ round: { sentAt: "2026-09-23T00:00:00Z", id: "r1", sig: "an older build" } }); await load();
s = await state();
ok(s.dec.length === 0 && s.ann === 0 && !s.verdict && s.archives === 1, `sent, then rebuilt: starts clean, the old round archived — ${JSON.stringify(s)}`);
// 4. no record of a send, but a question was reworded under the same id: stale, archived
await seed({ label: "an option this question no longer has" }); await load();
s = await state();
ok(s.dec.length === 0 && s.ann === 0 && s.archives === 1, `an answer to a reworded question is not shown as the answer — ${JSON.stringify(s)}`);
// 5. a mark on a frame that no longer exists: stale, archived
await seed({ frame: "a-frame-that-was-removed" }); await load();
s = await state();
ok(s.ann === 0 && s.archives === 1, `a mark on a removed frame starts a new round — ${JSON.stringify(s)}`);

console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
