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
  // choose the non-recommended option b
  await page.locator("#rp").locator('.decision .opt[data-choose="b"]').click();
  const b = dec.options.find((o) => o.id === "b");
  // where it went, read the moment the sheet is gone and the video plays again (not a while after, when it has played on)
  const inBranch = (await when(page, () => { const p = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"), on = document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"); return !on && !p.paused && { t: p.currentTime, playing: !p.paused, overlay: on }; })) || await page.evaluate(() => { const p = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return { t: p.currentTime, playing: !p.paused, overlay: document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on") }; });
  check("jumped into branch b and resumed", !inBranch.overlay && Math.abs(inBranch.t - b.branch.start) < 1.0, JSON.stringify(inBranch));
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
  const panel = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decisions").textContent);
  check("decisions panel shows the call", panel.includes(b.label), b.label);
  check("no page errors", errors.length === 0, errors.join(" | "));
} catch (e) { ok = false; console.error("✗", e.message); }
await browser.close(); server.kill(); process.exit(ok ? 0 : 1);
