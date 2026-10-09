// End-to-end check of <reelplanner-player> against a built project, in headless Chromium.
// usage: node packages/player/test/player.spec.mjs [videos/<project>]
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { launchOpts, testPort, serverUp, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked } from "./wait.mjs";

const project = process.argv[2] || "videos/l1-upload-resume";
const root = resolve(new URL("../../..", import.meta.url).pathname);
if (!existsSync(resolve(root, project, "index.html"))) { console.error(`no ${project}/index.html`); process.exit(1); }

const port = testPort(8791);
const server = staticServer(port, { dir: root });
await serverUp(port, { child: server });
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
let ok = true;
const check = (name, cond, extra = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${extra ? " — " + extra : ""}`); if (!cond) ok = false; };
try {
  await page.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.reload();
  await page.waitForFunction(() => customElements.get("reelplanner-player") && document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player"));
  const rp = page.locator("#rp");
  // 1. hyperframes-player becomes ready with the composition's duration
  const duration = await page.evaluate(() => new Promise((res, rej) => {
    const p = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player");
    if (p.ready) return res(p.duration);
    p.addEventListener("ready", (e) => res(e.detail?.duration ?? p.duration), { once: true });
    p.addEventListener("error", (e) => rej(new Error(e.detail?.message || "player error")), { once: true });
    setTimeout(() => rej(new Error("ready timeout")), 60000);
  }));
  check("composition ready", duration > 10, `duration ${duration.toFixed(1)}s`);
  // 2. plan-map loaded → step gallery rendered
  const gallery = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelectorAll(".gallery button").length);
  check("step gallery from plan-map.json", gallery >= 5, `${gallery} tiles`);
  // 3. seek to a mid frame via the gallery, then draw a stroke → annotation with frame + plan anchors
  const to = await page.evaluate(() => { const b = document.querySelector("#rp").shadowRoot.querySelectorAll(".gallery button")[3]; b.click(); return Number(b.dataset.jump); });
  await seeked(page, to); await frames(page);
  await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-tool="stroke"]').click());
  const box = await page.evaluate(() => { const c = document.querySelector("#rp").shadowRoot.querySelector("canvas.overlay").getBoundingClientRect(); return { x: c.x, y: c.y, w: c.width, h: c.height }; });
  await page.mouse.move(box.x + box.w * 0.15, box.y + box.h * 0.45);
  await page.mouse.down();
  await page.mouse.move(box.x + box.w * 0.25, box.y + box.h * 0.5, { steps: 8 });
  await page.mouse.move(box.x + box.w * 0.3, box.y + box.h * 0.42, { steps: 8 });
  await page.mouse.up();
  const dbg = await page.evaluate(() => { const rp = document.querySelector("#rp"); const r = rp.shadowRoot; const c = r.querySelector("canvas.overlay"); return { tool: rp.tool, stageTool: r.querySelector(".stage").dataset.tool, pe: getComputedStyle(c).pointerEvents, drawing: !!rp._drawing, n: rp.annotations.length }; });
  console.log("  debug:", JSON.stringify(dbg));
  await page.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; const ta = r.querySelector(".composer textarea"); ta.value = "the empty band here reads as a hole"; r.querySelector('[data-act="post"]').click(); });
  // let the deferred anchor re-test land (frame DOM mounts after the seek): both marks in, the stroke anchored to the plan
  await until(page, () => { const a = document.querySelector("#rp").annotations; return a.length === 2 && (a[0].plan?.step != null || a[0].plan?.component != null); });
  const anns = await page.evaluate(() => document.querySelector("#rp").annotations);
  check("stroke recorded with time + frame anchor", anns.length === 2 && anns[0].kind === "stroke" && anns[0].frame?.compositionId && anns[0].path.length > 5, JSON.stringify({ n: anns.length, kinds: anns.map((a) => a.kind), pathLen: anns[0]?.path?.length, t: anns[0]?.t, frame: anns[0]?.frame?.compositionId, plan: anns[0]?.plan }));
  const tagged = await page.evaluate(() => (document.querySelector("#rp").planMap?.frames || []).some((f) => f.planStep));
  if (tagged) check("stroke resolved to a plan step via data-plan-step hit-test", anns[0]?.plan?.step != null, `step ${anns[0]?.plan?.step}`);
  check("note recorded, with its reason", anns[1]?.kind === "note" && anns[1].comment === "the empty band here reads as a hole" && anns[1].frame?.compositionId);
  // Clear takes the drawings and nothing else, and puts them back
  // The real path — clicking Clear, then pressing U — not just the two methods called directly.
  // Hiding the Clear button once it has nothing left to clear used to drop keyboard focus to
  // <body>, which sits outside this component and silently ate every shortcut after it, U included.
  // A real mouse click — not the synthetic .click() used elsewhere in this file — because it is
  // what actually focuses the button, and it is that focus this test exists to check the handling of.
  await page.locator("#rp").locator('[data-act="clear"]').click();
  await until(page, () => !document.querySelector("#rp").annotations.some((a) => a.kind === "stroke")); await frames(page);
  const cleared = await page.evaluate(() => document.querySelector("#rp").annotations.map((a) => a.kind));
  check("clear removes the drawings and leaves the note", cleared.length === 1 && cleared[0] === "note", JSON.stringify(cleared));
  const clearHidden = await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="clear"]').hidden);
  check("and Clear itself disappears once there is nothing left", clearHidden === true);
  await page.keyboard.press("u");
  await until(page, () => document.querySelector("#rp").annotations.length === 2);
  const restored = await page.evaluate(() => document.querySelector("#rp").annotations.map((a) => a.kind));
  check("and a real U keypress puts them back — not just the method, the shortcut", restored.length === 2 && restored.includes("stroke") && restored.includes("note"), JSON.stringify(restored));
  // 4. export produces annotations.json with watch stats
  const exported = await page.evaluate(() => new Promise((res) => { const el = document.querySelector("#rp"); el.addEventListener("annotations", (e) => res(e.detail), { once: true }); el.export(); }));
  check("export has annotations + watch stats", exported.annotations.length === anns.length && typeof exported.watch?.completion === "number", `${exported.annotations.length} annotations, completion ${exported.watch?.completion}`);
  check("no page errors", errors.length === 0, errors.join(" | "));
  await page.screenshot({ path: resolve(root, "packages/player/test/last-run.png") });
} catch (e) { ok = false; console.error("✗", e.message, errors.slice(0, 3)); }
await browser.close(); server.kill();
process.exit(ok ? 0 : 1);
