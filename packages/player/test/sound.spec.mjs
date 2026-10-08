#!/usr/bin/env node
// Sound in the Claude desktop app. HyperFrames mutes and locks all audio when its user agent says it
// is inside the app (`Claude/<n>` + `Electron`), so a review there played in silence while the mute
// button said the sound was on. The player turns that lock off; this checks, under the app's user
// agent and a plain browser's, that the narration plays unmuted and that M still mutes and unmutes it.
// The last case slows the narration down so Play lands before it has loaded: the <audio> elements hold
// back the frame's load event, and when that event arrived after the player said it was ready,
// HyperFrames reset and dropped the queued Play, so a reviewer on a slow link got a still, silent frame.
// usage: node packages/player/test/sound.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const port = testPort(8793);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}`;
const APP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.3.9 Chrome/134.0.0.0 Electron/35.1.0 Safari/537.36";
try {
  for (const [name, ua, slow] of [["a browser", null], ["the Claude desktop app", APP], ["the Claude desktop app, with Play pressed while the narration is still loading", APP, 3000]]) {
    const ctx = await b.newContext(ua ? { userAgent: ua } : {}); const p = await ctx.newPage();
    p.on("pageerror", (e) => fails.push(`${name}: page error: ${String(e).slice(0, 160)}`));
    await p.goto(url); await p.evaluate(() => { try { localStorage.clear(); } catch {} });
    if (slow) await ctx.route(/\.(?:wav|mp3)(\?|$)/, async (r) => { await new Promise((w) => setTimeout(w, slow)); await r.continue().catch(() => {}); });
    await p.reload();
    await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
    if (slow) ok(await p.evaluate(() => !document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").assetsReady), `in ${name}, Play is pressed before the narration has loaded`);
    await p.locator("#rp").locator('[data-act="play"]').click();
    // The runtime holds a Play until the narration has loaded, so wait for it to start (bounded) rather
    // than sampling once after a fixed 2 s, which a busy machine can miss; then for it to run: a narration's
    // time moving on, not just asked to play
    await p.waitForFunction(() => { const hp = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return [...hp.iframeElement.contentDocument.querySelectorAll("audio")].some((a) => !a.paused); }, null, { timeout: 20000 }).catch(() => {});
    await until(p, () => { const hp = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return [...hp.iframeElement.contentDocument.querySelectorAll("audio")].some((a) => !a.paused && a.currentTime > 0.1); });
    const s = () => p.evaluate(() => { const el = document.querySelector("#rp"), hp = el.shadowRoot.querySelector("hyperframes-player"); const au = [...hp.iframeElement.contentDocument.querySelectorAll("audio")].filter((a) => !a.paused); return { muted: el.muted, hpMuted: hp.muted, audible: au.some((a) => !a.muted), playing: au.length }; });
    let st = await s();
    ok(!st.muted && !st.hpMuted && st.playing > 0 && st.audible, `in ${name}, the narration plays with sound — ${JSON.stringify(st)}`);
    await p.keyboard.press("m"); await until(p, () => { const el = document.querySelector("#rp"), hp = el.shadowRoot.querySelector("hyperframes-player"); return el.muted && hp.muted && ![...hp.iframeElement.contentDocument.querySelectorAll("audio")].some((a) => !a.paused && !a.muted); }); st = await s();
    ok(st.muted && st.hpMuted && !st.audible, `M mutes it — ${JSON.stringify(st)}`);
    await p.keyboard.press("m"); await until(p, () => { const el = document.querySelector("#rp"), hp = el.shadowRoot.querySelector("hyperframes-player"); return !el.muted && !hp.muted && [...hp.iframeElement.contentDocument.querySelectorAll("audio")].some((a) => !a.paused && !a.muted); }); st = await s();
    ok(!st.muted && !st.hpMuted && st.audible, `M again brings the sound back — ${JSON.stringify(st)}`);
    await ctx.close();
  }
} catch (e) { fails.push(String(e.message || e)); console.error("✗", e.message); }
await b.close(); srv.kill();
if (fails.length) { console.log(`\n${fails.length} failing:\n${fails.join("\n")}`); process.exit(1); }
console.log("\nall checks pass");
