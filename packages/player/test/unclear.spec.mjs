#!/usr/bin/env node
// "Explain this more" (?): a way to say "I can't answer this yet, explain it better" that is never
// treated as an answer. Plan decisions only. Recorded as option "unclear" with the sheet's note as
// what is unclear; the video goes on at resumeAt; nothing counts it as decided; Finish offers
// Request changes; "change" reopens it like any answer.
// Runs on L2 with the richer fixture map, like review-keys.spec.mjs.
// usage: node packages/player/test/unclear.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked, still, settled, asked, loaded, pageHold } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-richer.json";
const port = testPort(8879);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`;
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
await p.goto(url);
await p.evaluate(() => { try { localStorage.clear(); } catch {} });
await p.reload(); await loaded(p);
const rp = p.locator("#rp");
const sheetOn = () => p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"));
const playInto = async (at) => {
  await p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, at - 1.2); await seeked(p, at - 1.2); await still(p);
  await rp.locator('[data-act="play"]').click();
  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
  await settled(p);
};
const pm = await p.evaluate(() => document.querySelector("#rp").planMap);
const q1 = pm.decisions[0];

// ---- the button is on a plan question, with its key
await playInto(q1.at);
const btn = await p.evaluate(() => { const b = document.querySelector("#rp").shadowRoot.querySelector('.decision [data-act="unclear"]'); return { shown: !b.hidden && b.getBoundingClientRect().width > 0, text: b.textContent.trim(), key: b.querySelector("kbd")?.textContent }; });
ok(btn.shown && /^Explain this more/.test(btn.text) && btn.key === "?", `a plan question offers "Explain this more", on ? — ${JSON.stringify(btn)}`);

// ---- ? in the note is typing; Enter hands the keys back; ? records it, with the note
await rp.locator("[data-note]").click();
await p.keyboard.type("confused by this? need more information and examples");
ok(await p.evaluate(() => !document.querySelector("#rp").decisions.q1) && await sheetOn(), "typing ? (and a–d) in the note records nothing");
await p.keyboard.press("Enter"); await until(p, () => { const r = document.querySelector("#rp").shadowRoot; return r.activeElement !== r.querySelector("[data-note]"); });
// where the video goes on from: its time the moment it plays again (a look a while later is that much further on,
// and on a loaded machine the while is long)
await p.keyboard.press("Shift+Slash");
const goesOn = await p.waitForFunction(() => { const el = document.querySelector("#rp"); return !el.shadowRoot.querySelector(".decision").classList.contains("on") && !el.player.paused ? { t: el.player.currentTime } : null; }, null, { timeout: 20000, polling: 50 }).then((h) => h.jsonValue()).catch(() => null);
const rec = await p.evaluate(() => document.querySelector("#rp").decisions.q1);
ok(rec?.option === "unclear" && rec.label === "Explain this more" && rec.recommended === false && rec.planStep === q1.planStep && rec.t === q1.at && typeof rec.decidedAt === "string" && rec.note === "confused by this? need more information and examples",
  `? records option "unclear" with the note as what is unclear — ${JSON.stringify(rec)}`);
const ex = await p.evaluate(() => document.querySelector("#rp").exportPayload().decisions.find((d) => d.id === "q1"));
ok(ex?.id === "q1" && ex.option === "unclear" && ex.note === rec.note, "the export carries it in the same shape as any answer, with its id");
const after = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { t: el.player.currentTime, on: r.querySelector(".decision").classList.contains("on"), tool: el.tool, composer: r.activeElement === r.querySelector(".composer textarea"), comments: el.annotations.length }; });
if (goesOn) after.t = goesOn.t;
ok(!after.on && Math.abs(after.t - q1.resumeAt) < 1.2, `the video goes on at resumeAt — ${after.t.toFixed(2)} (resumeAt ${q1.resumeAt})`);
ok(after.tool === null && !after.composer && after.comments === 0, "and ? did not also focus the comment box (/), start a tool, or add a comment");
await p.evaluate(() => document.querySelector("#rp").player.pause());

// ---- not decided: the counts, the record, Copy text
const counts = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { count: r.querySelector(".decs .count").textContent, peek: r.querySelector(".grab span").textContent, row: r.querySelector(".decisions .dec[data-unclear] .a b")?.textContent, note: r.querySelector('.decisions textarea[data-dnote="q1"]')?.value }; });
ok(/0 of 3/.test(counts.count) && /0\/3 decided/.test(counts.peek), `it does not count as decided — "${counts.count.trim()}", "${counts.peek}"`);
ok(counts.row === "Asked to explain more" && counts.note === rec.note, `the record shows "Asked to explain more" with the note — ${JSON.stringify(counts)}`);
ok(/→ not answered: explain this more\n\s+What is unclear: confused by this\?/.test(await p.evaluate(() => document.querySelector("#rp").reviewText())), "Copy text says it was not answered, and what is unclear");

// ---- Finish offers Request changes
await rp.locator('[data-act="finish"]').click(); await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden); await frames(p);
const fin = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { verdict: el.verdict, pressed: r.querySelector('.handoff [data-review="changes"]')?.getAttribute("aria-pressed"), open: r.querySelector(".handoff .open")?.textContent || "" }; });
ok(fin.verdict === "changes" && fin.pressed === "true", `with nothing else said, Finish offers Request changes — ${JSON.stringify(fin)}`);
ok(/3 choices still open/.test(fin.open), `and counts the question as still open — "${fin.open}"`);
await p.keyboard.press("Escape"); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden);

// ---- "change" answers it in the record, the note kept (answer-on-the-video step 3); the button records it too
await p.evaluate(() => { localStorage.removeItem(Object.keys(localStorage).find((k) => k.endsWith(":verdict"))); });
// resumeAt is part 1's last moment, so the end-of-part card may be up; "Stay here" puts it away
await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; if (r.querySelector(".chend").classList.contains("on")) r.querySelector('[data-act="ch-stay"]').click(); });
await p.evaluate(() => document.querySelector("#rp").openPull()); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(p);
await rp.locator('[data-redit="q1"]').click(); await until(p, () => !!document.querySelector("#rp").shadowRoot.querySelector('.redit [data-set="q1:b"]'));
await rp.locator('.redit [data-set="q1:b"]').click(); await until(p, () => document.querySelector("#rp").decisions.q1?.option === "b"); await frames(p);
const re = await p.evaluate(() => { const el = document.querySelector("#rp"); return { d: el.decisions.q1, on: el.shadowRoot.querySelector(".decision").classList.contains("on") }; });
ok(re.d?.option === "b" && re.d.note === rec.note && !re.on, `"change" answers it in the record like any answer, the note still there — ${JSON.stringify(re)}`);
// opened again from its time in the record, the question's own button asks for more again
await rp.locator('.tm[data-point="choice:q1"]').click();
await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
await rp.locator('.decision [data-act="unclear"]').click(); await until(p, () => document.querySelector("#rp").decisions.q1?.option === "unclear");
ok(await p.evaluate(() => document.querySelector("#rp").decisions.q1?.option === "unclear"), "the button records it the same way");
await p.evaluate(() => document.querySelector("#rp").player.pause());

// ---- not on a quick check, nor on the agent's calls
await p.evaluate(() => { const el = document.querySelector("#rp"); el.askQuiz(el.planMap.quizzes[0]); });
await asked(p, pm.quizzes[0].id); await settled(p); await rp.focus();
const quiz = await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.decision [data-act="unclear"]').hidden);
await p.keyboard.press("Shift+Slash"); await pageHold(p, 200);
ok(quiz && await p.evaluate(() => !document.querySelector("#rp").quizzes.ktest && document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on")), "a quick check has no such button, and ? does nothing there");
await p.evaluate(() => { const el = document.querySelector("#rp"); el.closeCard(); el.askAutonomy(el.planMap.autonomy[0]); });
await asked(p, pm.autonomy[0].id); await settled(p);
ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.decision [data-act="unclear"]').hidden), "nor does the agent's Accept / Flag call");

ok(!fails.some((f) => /^page error/.test(f)), "no page errors");
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
