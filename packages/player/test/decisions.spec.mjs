// Decision engine e2e: pause at the decision point, show options, choose the non-recommended one,
// play only that branch, skip to resumeAt, export the decision. Uses a synthetic plan-map over L1.
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { launchOpts, testPort, serverUp, staticServer } from "../../../scripts/lib/env.mjs";
import { when } from "./wait.mjs";
const root = resolve(new URL("../../..", import.meta.url).pathname);
const project = process.argv[2] || "videos/l1-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l1-synthetic-decisions.json";
const port = testPort(8795);
const server = staticServer(port, { dir: root });
await serverUp(port, { child: server });
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
let ok = true; const check = (n, c, x = "") => { console.log(`${c ? "✓" : "✗"} ${n}${x ? " — " + x : ""}`); if (!c) ok = false; };
try {
  await page.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`);
  await page.evaluate(() => { try { localStorage.clear(); } catch {} }); await page.reload();
  await page.waitForFunction(() => { const p = document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player"); return p && p.ready && document.querySelector("#rp").planMap; }, null, { timeout: 60000 });
  const dec = await page.evaluate(() => document.querySelector("#rp").planMap.decisions[0]);
  check("decision loaded from plan-map", !!dec && dec.options.length === 2, `at ${dec.at}s`);
  // seek just before the decision point and play
  // seek, then press the player's own play button (a trusted gesture, like a reviewer would)
  await page.evaluate((t) => { const p = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); p.seek(t); }, dec.at - 1.5);
  await page.locator("#rp").locator('[data-act="play"]').click();
  await page.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 15000 });
  const paused = await page.evaluate(() => { const rp = document.querySelector("#rp"); const p = rp.shadowRoot.querySelector("hyperframes-player"); return { paused: p.paused, t: p.currentTime, opts: rp.shadowRoot.querySelectorAll(".decision .opt").length, rec: rp.shadowRoot.querySelector('.decision .opt[data-rec="true"]')?.textContent.slice(0, 20) }; });
  check("paused at the decision with two options", paused.paused && paused.opts === 2 && Math.abs(paused.t - dec.at) < 0.8, JSON.stringify(paused));
  // Capture entry and an advancing runtime tick before choosing. The branch lasts only three seconds;
  // a loaded runner may not start its polling until the video already reached resumeAt. A play event
  // alone is insufficient: a stale pre-seek tick could skip the branch before it actually plays.
  await page.evaluate(() => {
    const el = document.querySelector("#rp"), p = el.player;
    const branch = el.planMap.decisions[0].options.find((o) => o.id === "b").branch;
    const stale = p.currentTime;
    const seen = window.__rpDecisionPlayback = { entry: null, progressed: null, stale: null };
    p.addEventListener("play", () => {
      seen.entry = { t: p.currentTime, playing: !p.paused, overlay: el.shadowRoot.querySelector(".decision").classList.contains("on") };
      // The iframe can deliver its old decision-time state after this backward seek. Deliver that
      // packet after choose() has set up playback, before a genuine branch tick can arrive. It must
      // not be mistaken for having played through this three-second branch to its end.
      queueMicrotask(() => {
        p.dispatchEvent(new CustomEvent("timeupdate", { detail: { currentTime: stale } }));
        seen.stale = { t: stale, after: p.currentTime, pendingEnd: el._skipUntil?.from ?? null };
      });
    }, { once: true });
    const advancing = (e) => { const t = e.detail?.currentTime ?? p.currentTime;
      if (!p.paused && t > branch.start + 0.05 && t < branch.end - 0.05) { seen.progressed = t; p.removeEventListener("timeupdate", advancing); } };
    p.addEventListener("timeupdate", advancing);
  });
  // choose the non-recommended option b
  await page.locator("#rp").locator('.decision .opt[data-choose="b"]').click();
  const b = dec.options.find((o) => o.id === "b");
  const stale = await page.evaluate(() => window.__rpDecisionPlayback.stale);
  check("stale pre-seek packet does not skip the chosen branch", stale?.t > b.branch.end && Math.abs(stale.after - b.branch.start) < 0.05 && stale.pendingEnd === b.branch.end, JSON.stringify(stale));
  const inBranch = (await when(page, () => { const seen = window.__rpDecisionPlayback; return seen?.entry && seen.progressed != null && { ...seen.entry, progressed: seen.progressed }; })) || await page.evaluate(() => window.__rpDecisionPlayback);
  check("jumped into branch b and resumed", !!inBranch.playing && !inBranch.overlay && Math.abs(inBranch.t - b.branch.start) < 1.0 && inBranch.progressed > b.branch.start + 0.05 && inBranch.progressed < b.branch.end, JSON.stringify(inBranch));
  // wait until the branch ends: the player must skip to resumeAt (past the unchosen branch a)
  await page.waitForFunction((r) => { const p = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return p.currentTime >= r - 0.3; }, dec.resumeAt, { timeout: 20000 });
  const after = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").currentTime);
  check("skipped the unchosen branch to resumeAt", after >= dec.resumeAt - 0.3 && after < dec.resumeAt + 2.5, `t=${after.toFixed(2)} resumeAt=${dec.resumeAt}`);
  const exported = await page.evaluate(() => new Promise((res) => { const el = document.querySelector("#rp"); el.addEventListener("annotations", (e) => res(e.detail), { once: true }); el.export(); }));
  check("export carries the decision", exported.decisions?.length === 1 && exported.decisions[0].option === "b" && exported.decisions[0].recommended === false, JSON.stringify(exported.decisions));
  const chs = await page.evaluate(() => document.querySelector("#rp").planMap.chapters || []);
  if (chs.length > 1) {
    await page.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".chend").classList.contains("on"), null, { timeout: 30000 }).catch(() => {});
    const shown = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".chend").classList.contains("on"));
    check("chapter-end pause shown", shown);
    if (shown) {
      const t0 = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").currentTime);
      await page.locator("#rp").locator('[data-act="ch-next"]').click();
      // the time the moment the sheet is gone and the video plays on from where it went
      const t2 = (await when(page, (t0) => { const el = document.querySelector("#rp"), p = el.shadowRoot.querySelector("hyperframes-player"); return !el.shadowRoot.querySelector(".chend").classList.contains("on") && !p.paused && p.currentTime !== t0 && p.currentTime; }, t0)) ?? await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").currentTime);
      check("Continue jumps to the next chapter", Math.abs(t2 - chs[1].start) < 2.5, `t=${t2.toFixed(2)} ch2 start ${chs[1].start}`); }
  }
  // An explicit seek is still a reviewer move, not an implausible playback packet. Landing in the
  // recorded decision's unchosen branch must route past it, and preserve the paused play state.
  await page.evaluate(() => document.querySelector("#rp").player.pause());
  await page.waitForFunction(() => { const el = document.querySelector("#rp"); return el.player.paused && !el._run; });
  const a = dec.options.find((o) => o.id === "a");
  await page.evaluate((t) => document.querySelector("#rp").player.seek(t), a.branch.start + 1);
  await page.waitForFunction((r) => document.querySelector("#rp").player.currentTime >= r - 0.3, dec.resumeAt, { timeout: 15000 });
  const sought = await page.evaluate(() => { const el = document.querySelector("#rp"); return { t: el.player.currentTime, paused: el.player.paused, overlay: el.shadowRoot.querySelector(".decision").classList.contains("on") }; });
  check("explicit paused seek still routes past the unchosen branch", sought.paused && !sought.overlay && sought.t >= dec.resumeAt - 0.3 && sought.t < dec.resumeAt + 0.3, JSON.stringify(sought));
  // Public navigation while playing starts a new playback run at its requested destination. The
  // old run's clock must not reject this intentional forward jump across the question into A.
  for (const method of ["jump", "seekBy"]) {
    await page.evaluate((t) => { const el = document.querySelector("#rp"); el.player.seek(t); el.player.play(); }, b.branch.start + 0.1);
    await page.waitForFunction((t) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime > t + 0.05 && el._run?.last > t + 0.05; }, b.branch.start + 0.1, { timeout: 15000 });
    const navigation = await page.evaluate(({ method, target }) => {
      const el = document.querySelector("#rp"), from = el.player.currentTime;
      if (method === "jump") el.jump(target); else el.seekBy(target - el.watchedT());
      return { from, t: el.player.currentTime, playing: !el.player.paused, run: el._run?.t };
    }, { method, target: a.branch.start + 1 });
    check(`${method} while playing resets the run at the requested destination`, navigation.from < dec.at && navigation.playing && Math.abs(navigation.t - (a.branch.start + 1.05)) < 0.05 && Math.abs(navigation.run - navigation.t) < 0.05, JSON.stringify(navigation));
    await page.waitForFunction((r) => document.querySelector("#rp").player.currentTime >= r - 0.3, dec.resumeAt, { timeout: 15000 });
    const routed = await page.evaluate(() => { const el = document.querySelector("#rp"); return { t: el.player.currentTime, overlay: el.shadowRoot.querySelector(".decision").classList.contains("on") }; });
    check(`${method} while playing still routes past the unchosen branch`, !routed.overlay && routed.t >= dec.resumeAt - 0.3 && routed.t < dec.resumeAt + 0.3, JSON.stringify(routed));
  }
  const panel = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decisions").textContent);
  check("decisions panel shows the call", panel.includes(b.label), b.label);
  check("no page errors", errors.length === 0, errors.join(" | "));
} catch (e) { ok = false; console.error("✗", e.message); }
await browser.close(); server.kill(); process.exit(ok ? 0 : 1);
