import { chromium } from "playwright-core"; import { existsSync } from "node:fs";
import { launchOpts, testPort, serverUp, staticServer } from "../../../scripts/lib/env.mjs";
import { until, seeked, now, movedOn, still } from "./wait.mjs";
const root = process.argv[2]; const port = testPort(8819);
const server = staticServer(port, { dir: root });
await serverUp(port, { child: server });
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
// requestfailed also fires for requests the browser ABORTED — the runtime prefetches the later
// voice files and cancels them when the page tears down, which is not a missing file. Verified by
// serving the same bundle and curling them: HTTP 200. Only count real failures.
page.on("requestfailed", (r) => {
  const why = r.failure()?.errorText || "";
  if (/ERR_ABORTED/.test(why)) return;
  errs.push(`${why || "failed"}: ` + r.url().split("/").slice(-2).join("/"));
});
let ok = true; const check = (n, c, x = "") => { console.log(`${c ? "✓" : "✗"} ${n}${x ? " — " + x : ""}`); if (!c) ok = false; };
try {
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForFunction(() => { const p = document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player"); return p && p.ready && document.querySelector("#rp").planMap; }, null, { timeout: 60000 });
  let m = await page.evaluate(() => document.querySelector("#rp").planMap);
  check("loads with no repo paths", true, `${m.title} · ${m.frames.length} frames · ${Math.round(m.totalSeconds)}s`);
  check("page title from the plan", (await page.title()).includes(m.title.slice(0, 12)));
  // the page opens on what needs the reviewer, and says what to do in the video that is open
  const todo = await page.evaluate(() => ({ items: document.querySelectorAll("#todo a.chip2").length, here: !!document.querySelector("#todo a[data-here]"), line: document.getElementById("here").textContent }));
  check("the page lists what needs you, and says what to do here", /What to do here|Done here/.test(todo.line) && (true), `${todo.items} item(s) · "${todo.line.slice(0, 70)}"`);
  // the player is not width-capped: a detail panel or the plan text needs the page's width beside the
  // stage; the page tells it the room its header takes (--rp-above) and the controls still fit the window
  const fit = await page.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, fin = R.querySelector('[data-act="finish"]').getBoundingClientRect(); return { w: Math.round(el.getBoundingClientRect().width), finish: Math.round(fin.bottom), h: innerHeight }; });
  check("the player spans the page, and Finish stays in the window", fit.w > 1300 && fit.finish <= fit.h, JSON.stringify(fit));
  // the decision checks need a video with a question: open the first bundled one that has one
  if (!m.decisions?.length) {
    const slugs = await page.evaluate(async () => (await (await fetch("library.json")).json()).slugs);
    for (const s of slugs) { const pm = await page.evaluate(async (s) => { try { return await (await fetch(s + "/plan-map.json")).json(); } catch { return null; } }, s); if (pm?.decisions?.length) { await page.goto(`http://127.0.0.1:${port}/?project=${encodeURIComponent(s)}`); break; } }
    await page.waitForFunction(() => { const p = document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player"); return p && p.ready && document.querySelector("#rp").planMap; }, null, { timeout: 60000 });
    m = await page.evaluate(() => document.querySelector("#rp").planMap);
  }
  // play into the first decision (no bundled video may have one left: every question answered)
  if (!m.decisions?.length) console.log("· no bundled video has a question left; the decision checks are skipped here (decisions.spec covers them)");
  else {
  const d = m.decisions[0];
  await page.evaluate((t) => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").seek(t), d.at - 1.2);
  await page.locator("#rp").locator('[data-act="play"]').click();
  await page.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
  check("pauses at the decision", true, d.question);
  // Answer with the key: where the frame's cards take the answer the sheet's buttons are hidden (the
  // strip holds only what the frame can't), and B answers either way.
  // answered, and the video on again: playing, not just asked to (a pause sent while that play is still on its way into
  // the frame's page is overtaken by it); then paused, and still
  const t0 = await now(page);
  await page.evaluate(() => document.querySelector("#rp").focus()); await page.keyboard.press("b");
  await until(page, (id) => !!document.querySelector("#rp").decisions[id] && !document.querySelector("#rp").pendingId(), d.id); await movedOn(page, t0);
  await page.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").pause()); await still(page);
  // draw a stroke, then export
  const st = await page.locator("#rp").locator(".stage").boundingBox();
  await page.locator("#rp").locator('[data-act="mark"]').click();   // Mark turns drawing on with the last shape
  await page.mouse.move(st.x + st.width * 0.5, st.y + st.height * 0.4); await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(st.x + st.width * (0.5 + i * 0.015), st.y + st.height * 0.4);
  await page.mouse.up();
  const ex = await page.evaluate(() => new Promise((res) => { const el = document.querySelector("#rp"); el.addEventListener("annotations", (e) => res(e.detail), { once: true }); el.export(); }));
  check("annotation + decision export", ex.annotations.length === 1 && ex.decisions.length === 1, `${ex.annotations[0].kind} on step ${ex.annotations[0].plan?.step}, decision ${ex.decisions[0].label}`);
  }
  // audio actually resolves (mp3 swap)
  const au = await page.evaluate(() => { const f = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").iframeElement; return [...f.contentDocument.querySelectorAll("audio")].map((a) => ({ src: a.getAttribute("src"), dur: a.duration })).slice(0, 2); });
  check("voice audio loads as mp3", au.every((a) => a.src.endsWith(".mp3") && a.dur > 0), JSON.stringify(au));
  // the library: every bundled video is one click away, and the one playing is marked
  if (existsSync(`${root}/library.json`)) {
    const lib = JSON.parse((await import("node:fs")).readFileSync(`${root}/library.json`, "utf8"));
    const seen = await page.evaluate(() => ({ hrefs: [...document.querySelectorAll("#videos a")].map((a) => new URLSearchParams(a.getAttribute("href").slice(1)).get("project")), current: document.querySelector("#videos a[aria-current]") ? new URLSearchParams(document.querySelector("#videos a[aria-current]").getAttribute("href").slice(1)).get("project") : null, sw: !document.getElementById("switch").hidden }));
    check("the library links every bundled video", lib.slugs.every((s) => seen.hrefs.includes(s)), `${seen.hrefs.length} link(s) for ${lib.slugs.length} video(s)`);
    const playing = new URLSearchParams(new URL(page.url()).search).get("project") || await page.evaluate(() => document.querySelector("#rp").getAttribute("src").replace(/\/index\.html$/, ""));
    check("and marks the one playing", seen.current === playing, `${seen.current || "none"} (playing ${playing})`);
    if (lib.slugs.length > 1 || lib.plans.length > 1) check("with an All videos button to reach it", seen.sw);
    // walkthroughs-that-help step 5 (D-224): one row per plan; the Plan | Built switch only where both videos are on
    // this page, one link where one is, "not on this page" where none is; the rest folded
    const rows = await page.evaluate(() => [...document.querySelectorAll("#videos .prow[data-plan]")].map((r) => ({ plan: r.dataset.plan, seg: [...r.querySelectorAll(".seg > a")].map((x) => x.textContent), off: !!r.querySelector(".off"), word: r.querySelector(".ps").textContent, need: r.querySelector(".ps").hasAttribute("data-need"), inTodo: !!r.closest("#todo"), here: r.hasAttribute("data-here"), folded: !!r.closest("details:not([open])"), lines: Math.round(r.querySelector(".pn").getBoundingClientRect().height / parseFloat(getComputedStyle(r.querySelector(".pn")).lineHeight)), clipped: r.querySelector(".pn").scrollHeight > r.querySelector(".pn").clientHeight + 1 })));
    const byPlan = Object.fromEntries(lib.plans.map((p) => [p.plan, p]));
    check("one row per plan, each with what it can open: both videos a switch, one a link, none \"not on this page\"", rows.length === lib.plans.length && new Set(rows.map((r) => r.plan)).size === rows.length && rows.every((r) => { const p = byPlan[r.plan]; return r.seg.join() === [p.video && "Plan", p.walkthrough && "Built"].filter(Boolean).join() && r.off === (!p.video && !p.walkthrough); }) && rows.filter((r) => r.here).length === (lib.plans.some((p) => [p.video, p.walkthrough].includes(playing)) ? 1 : 0), JSON.stringify(rows.map((r) => [r.plan.slice(11), r.seg.join("|") || (r.off ? "off" : "?")])));
    // the plan guide: a plan whose video has a guide has its guide page beside the video, shown under the video on this
    // page (D-264); its row's Guide, beside Plan | Built, opens that video with the page down at its
    // guide. The guide page still opens on its own (a fallback), its "Watch this moment" back to this page's player
    const withGuide = lib.plans.filter((p) => p.guide);
    // a guide's folder is its page and its pictures, never its part pages (round 1, A11: a part is read in the guide
    // under the video; they were a third of a bundle), and no video keeps a details/ page its frames no longer open
    { const { readdirSync, readFileSync: rf } = await import("node:fs"), extra = [];
      for (const sl of lib.slugs) { const g = `${root}/${sl}/guide`; if (existsSync(g)) extra.push(...readdirSync(g).filter((f) => /\.html$/.test(f) && f !== "index.html").map((f) => `${sl}/guide/${f}`));
        const pm = (() => { try { return JSON.parse(rf(`${root}/${sl}/plan-map.json`, "utf8")); } catch { return null; } })(), want = new Set((pm?.details || []).filter((d) => !d.guide).map((d) => `${d.name}.html`));
        if (existsSync(`${root}/${sl}/details`)) extra.push(...readdirSync(`${root}/${sl}/details`).filter((f) => f.endsWith(".html") && !want.has(f)).map((f) => `${sl}/details/${f}`)); }
      check("no guide part pages and no unopened detail pages in the bundle", !extra.length, extra.slice(0, 4).join(", ")); }
    // the agent's choices counted once (round 1, N3), as the guide counts them: the line under the title, the poster and
    // the record bar say the same numbers, from the plan map (a walkthrough's packed with its total and the guide-only ones)
    { const w = await page.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, c = el.choiceCounts(); return { c, packed: el.planMap.choiceCounts || null, here: document.getElementById("here").textContent, meta: R.querySelector(".idle .meta").textContent, rec: [...R.querySelectorAll(".side *")].map((x) => x.textContent).find((t) => /^Record/.test(t)) || "" }; });
      const n = w.c.pause + w.c.list + w.c.shown;
      if (n) check("the choices counted once: the page's line, the poster and the record say the same breakdown as the guide", (w.c.pause ? w.meta.includes(`${w.c.pause} stop`) : true) && (w.c.list ? w.meta.includes(`${w.c.list} ${w.c.pause ? "more at the end" : "on the list"}`) : true) && w.rec.includes(`0/${n} judged`) && !/calls? to judge/.test(w.here) && (!w.packed || (w.packed.total === w.c.total && w.packed.pause === w.c.pause && (!w.packed.only || w.here.includes(`${w.packed.only} smaller`)))), JSON.stringify(w)); }
    // the record bar's steps and the chapters in plain words (round 2's N12): a scene titled "…, and choices A8 and A9"
    // reads "…, and two choices", as the guide says it; no bare choice number
    { const t = await page.evaluate(() => { const el = document.querySelector("#rp"), R = el.shadowRoot, ids = /\bchoices? [ADm]\d/;
        const shown = [...R.querySelectorAll(".gallery .t, .labels .pt, .labels .part")].map((x) => x.textContent.trim()).concat((el.planMap.chapters || []).map((c) => R.querySelector(`.labels .part[data-part="${el.planMap.chapters.indexOf(c)}"]`)?.getAttribute("aria-label") || ""));
        return { raw: (el.planMap.frames || []).filter((f) => ids.test(f.title)).length, bare: shown.filter((x) => ids.test(x)), counted: shown.filter((x) => /\b(?:a|two|three|four|five|six|\d+) choices?\b/.test(x)).slice(0, 3) }; });
      check("the record's step titles and the chapters say the choices in words, never their numbers", !t.bare.length && (!t.raw || t.counted.length > 0), JSON.stringify(t)); }
    const gl = await page.evaluate(() => [...document.querySelectorAll("#videos .prow[data-plan]")].map((r) => ({ plan: r.dataset.plan, href: r.querySelector(".gl")?.getAttribute("href") || null })));
    check("a plan with a guide has Guide on its row, beside Plan | Built, opening that video with its guide under it; one without has none", gl.every((r) => { const p = byPlan[r.plan]; return p.guide ? r.href === `?project=${encodeURIComponent(p.guide)}#guide` : !r.href; }), JSON.stringify(gl.filter((r) => r.href)));
    if (withGuide.length) {
      const p = withGuide[0], gp = await browser.newPage({ viewport: { width: 1440, height: 900 } }), gerrs = []; gp.on("pageerror", (e) => gerrs.push(String(e)));
      await gp.goto(`http://127.0.0.1:${port}/${gl.find((r) => r.plan === p.plan).href}`);
      await until(gp, () => { const el = document.querySelector("#rp"), g = document.querySelector("#rp-guide"); return el?.planMap && g?.ready && g.atGuide() && el._mini; }, null, 60000);
      const u = await gp.evaluate(() => { const g = document.querySelector("#rp-guide"), fr = g.shadowRoot.querySelector("iframe"), el = document.querySelector("#rp"); return { src: fr.getAttribute("src"), top: Math.round(fr.getBoundingClientRect().top), under: el.getBoundingClientRect().bottom <= g.getBoundingClientRect().top + 1, mini: !!el._mini, project: new URLSearchParams(location.search).get("project") }; });
      const fu = u.src ? new URL(u.src, gp.url()) : null;
      check(`${p.plan}: its row's Guide opens its video with the guide under it, the page down at the guide and the video small in the corner`, !gerrs.length && u.project === p.guide && u.under && u.mini && Math.abs(u.top) <= 2 && fu?.pathname === `/${encodeURIComponent(p.guide)}/guide/index.html` && fu.searchParams.get("embed") === "1", JSON.stringify({ ...u, errs: gerrs.slice(0, 2) }));
      await gp.close();
    }
    // the built guide covers both of a plan's videos (its Plan | Built switch), so a link may go to either: each goes to a
    // video on this page, and at least one to the video whose row links the guide
    const ours = new Set(lib.plans.flatMap((p) => [p.video, p.walkthrough]).filter(Boolean));
    for (const p of withGuide.slice(0, 3)) {
      const gp = await browser.newPage({ viewport: { width: 1280, height: 860 } }); const gerrs = []; gp.on("pageerror", (e) => gerrs.push(String(e)));
      const res = await gp.goto(`http://127.0.0.1:${port}/${encodeURIComponent(p.guide)}/guide/index.html`); await until(gp, () => document.readyState === "complete" && document.querySelectorAll("section[id]").length > 0 && document.querySelectorAll("a[data-watch], a.go[href*='t='], a.wm[href*='t=']").length > 0 && (!document.querySelector("a.wm") || !!document.documentElement.dataset.onpage));
      const g = await gp.evaluate(() => ({ watch: [...document.querySelectorAll("a[data-watch], a.go[href*='t='], a.wm[href*='t=']")].map((a) => a.href).filter(Boolean), sections: document.querySelectorAll("section[id]").length, net: performance.getEntriesByType("resource").filter((e) => !e.name.startsWith(location.origin) && !/^(data|blob):/.test(e.name)).map((e) => e.name) }));
      const w = g.watch.map((h) => new URL(h)).filter((u) => u.searchParams.has("t"));
      check(`${p.plan}: its guide page opens, loads nothing from the network, and its "Watch this moment" goes to this page's player at a time`, res.ok() && !gerrs.length && !g.net.length && g.sections > 0 && w.length > 0 && w.some((u) => u.searchParams.get("project") === p.guide) && w.every((u) => u.pathname === "/index.html" && ours.has(u.searchParams.get("project")) && Number(u.searchParams.get("t")) >= 0), JSON.stringify({ status: res.status(), errs: gerrs.slice(0, 2), net: g.net.slice(0, 2), watch: w.length, first: w[0]?.search, elsewhere: w.filter((u) => !ours.has(u.searchParams.get("project"))).map((u) => u.search).slice(0, 2) }));
      // a step's picture that is a page drawn in the video (a capture: pic.show, its width as captured) is that page, drawn
      // at 0.8 of its size or more (its words readable, round 3's finding 4), and its dark picture is dark
      const nest = await gp.evaluate(async () => { const G = window.RPGuide?.G, v = G?.videos?.[G.own]; const out = [];
        const lum = async (src) => { const i = new Image(); i.src = new URL(src, location.href).href; await i.decode(); const c = document.createElement("canvas"); c.width = 64; c.height = Math.max(1, Math.round((64 * i.naturalHeight) / i.naturalWidth)); const x = c.getContext("2d"); x.drawImage(i, 0, 0, c.width, c.height); const d = x.getImageData(0, 0, c.width, c.height).data; let t = 0; for (let k = 0; k < d.length; k += 4) t += (0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 255; return +(t / (d.length / 4)).toFixed(2); };
        for (const f of (v?.scenes || []).filter((x) => x.pic?.show)) { const img = [...document.querySelectorAll("a.zoom img")].find((x) => x.getAttribute("src") === f.pic.src); if (!img) continue; img.scrollIntoView({ block: "center" }); const w = img.getBoundingClientRect().width;
          out.push({ n: f.n, show: f.pic.show, k: +(w / f.pic.show).toFixed(2), light: await lum(f.pic.src), dark: f.pic.dark ? await lum(f.pic.dark.src) : null }); }
        return out; });
      // (a capture wider than 950 px that no empty column lets be cut is shown whole, at the column's width: the lightbox
      // has it at its own size)
      if (nest.length) check(`${p.plan}: a step's picture of a page in the video is that page at 0.8 of its size or more (one too wide to cut, whole), dark in the dark theme`, nest.every((x) => (x.k >= 0.8 || x.show > 950) && x.light > 0.6 && x.dark != null && x.dark < 0.35), JSON.stringify(nest));
      await gp.close();
    }
    // the top agrees with the rows: every row waiting on you is under "Needs you", none elsewhere, and "Nothing needs you" only with none
    const top = await page.evaluate(() => document.querySelector("#todo h2")?.textContent || "");
    check("\"Needs you\" agrees with the rows: a row that waits on you is there, no other row is, and it says whose turn", rows.every((r) => r.need === r.inTodo) && rows.filter((r) => r.need).every((r) => /to review|to answer/.test(r.word)) && rows.filter((r) => !r.need).every((r) => !/to review|to answer/.test(r.word)) && (top === "Nothing needs you") === !rows.some((r) => r.need), JSON.stringify({ top, rows: rows.map((r) => [r.plan.slice(11), r.word, r.inTodo]) }));
    check("a plan's name wraps to two lines, never cut", rows.every((r) => !r.clipped && r.lines <= 2), JSON.stringify(rows.filter((r) => r.clipped || r.lines > 2).map((r) => r.plan)));
    const listed = rows.filter((r) => !r.inTodo).length;
    if (listed > 5) check("older plans folded behind one \"Earlier plans (N)\"", await page.evaluate(() => /^Earlier plans \(\d+\)$/.test(document.querySelector("#videos details.earlier > summary")?.textContent || "")) && rows.some((r) => r.folded));
    // the page's own switch, by the title: on a plan video with a walkthrough, "Built" goes to the same step, running
    const pair = lib.plans.find((p) => p.video && p.walkthrough && p.steps);
    if (!pair) console.log("· no bundled plan has both videos; the switch's checks are skipped here");
    else {
      await page.goto(`http://127.0.0.1:${port}/?project=${encodeURIComponent(pair.video)}`);
      await page.waitForFunction(() => { const p = document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player"); return p && p.ready && document.querySelector("#rp").planMap; }, null, { timeout: 60000 });
      const step = Object.keys(pair.steps.plan).map(Number).find((n) => pair.steps.built[n] != null) ?? null;
      await page.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.seek(t); el.player.pause(); }, pair.steps.plan[step] + 1);
      // the seek landed, and the switch (it looks every 500 ms) has caught up with the step it is on
      await seeked(page, pair.steps.plan[step] + 1); await until(page, (step) => new RegExp(`: step ${step}\\b`).test(document.querySelector("#pb .seg > a:not([aria-current])")?.title || ""), step);
      const pb = await page.evaluate(() => { const n = document.getElementById("pb"); return { shown: !n.hidden, segs: [...n.querySelectorAll(".seg > a")].map((a) => ({ t: a.textContent, cur: a.getAttribute("aria-current"), href: a.getAttribute("href"), title: a.title })), note: n.querySelector(".pbnote").textContent }; });
      const built = pb.segs.find((x) => x.t === "Built");
      check("the header's Plan | Built switch: Plan is the one open, Built goes to the same step, running", pb.shown && pb.segs.find((x) => x.t === "Plan")?.cur === "page" && built && new URLSearchParams(built.href.slice(1)).get("project") === pair.walkthrough && Math.abs(Number(new URLSearchParams(built.href.slice(1)).get("t")) - pair.steps.built[step] - 0.1) < 0.01 && new RegExp(`See it built: step ${step}, running`).test(built.title) && !pb.note, JSON.stringify(pb));
      await page.click('#pb .seg > a:not([aria-current])');
      await page.waitForFunction(() => { const p = document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player"); return p && p.ready && document.querySelector("#rp").planMap; }, null, { timeout: 60000 });
      // landed at the link's time (?t=), and the switch caught up: it now goes back to the plan's step
      await until(page, () => { const want = Number(new URLSearchParams(location.search).get("t")); return document.querySelector("#rp").player.currentTime >= want - 0.1 && /^See the plan: step/.test(document.querySelector("#pb .seg > a:not([aria-current])")?.title || ""); });
      const there = await page.evaluate(() => { const el = document.querySelector("#rp"), t = el.player.currentTime, f = el.planMap.frames.find((x) => t >= x.start && t < x.start + x.durationSeconds); return { project: new URLSearchParams(location.search).get("project"), step: f?.planStep ?? null, t, back: document.querySelector("#pb .seg > a:not([aria-current])")?.title }; });
      check("…and it lands there: the walkthrough, at that step's running scene; the switch now goes back to the plan's step", there.project === pair.walkthrough && there.step === step && new RegExp(`See the plan: step ${step}`).test(there.back || ""), JSON.stringify(there));
      const none = Object.keys(pair.steps.plan).map(Number).find((n) => pair.steps.built[n] == null);
      if (none != null) {
        await page.goto(`http://127.0.0.1:${port}/?project=${encodeURIComponent(pair.video)}&t=${pair.steps.plan[none] + 1}`);
        await page.waitForFunction(() => document.querySelector("#rp")?.planMap, null, { timeout: 60000 });
        // landed at ?t=, and the switch (every 500 ms) has looked since
        await until(page, () => { const el = document.querySelector("#rp"), want = Number(new URLSearchParams(location.search).get("t")); return el.player?.currentTime >= want - 0.1 && !!document.querySelector("#pb .pbnote")?.textContent; });
        check("a step with nothing running says so by the switch", await page.evaluate(() => document.querySelector("#pb .pbnote").textContent === "Nothing to run for this step"));
      }
    }
  }
  // shared/: the fonts and gsap every video carries, written once; each video's pages point at it
  if (existsSync(`${root}/shared`)) {
    const fs = await import("node:fs"), path = await import("node:path"), { createHash } = await import("node:crypto");
    const R = path.resolve(root), files = (d) => fs.readdirSync(d, { recursive: true }).map(String).filter((f) => fs.statSync(path.join(d, f)).isFile());
    const hash = (p) => createHash("sha256").update(fs.readFileSync(p)).digest("hex");
    const shared = files(path.join(R, "shared")), sharedHashes = new Set(shared.map((f) => hash(path.join(R, "shared", f))));
    const lib = JSON.parse(fs.readFileSync(`${R}/library.json`, "utf8"));
    const copies = lib.slugs.flatMap((s) => files(path.join(R, s)).filter((f) => /^assets\/(fonts|vendor)\//.test(f)).map((f) => path.join(s, f))).filter((f) => sharedHashes.has(hash(path.join(R, f))));
    check("each shared asset is in the bundle once", copies.length === 0, `${shared.length} in shared/${copies.length ? `; also copied at ${copies.slice(0, 3).join(", ")}` : ""}`);
    // every rewritten path is relative to its own file (the runtime rebases a composition's "../")
    const used = new Set(), broken = [];
    for (const s of lib.slugs) for (const f of files(path.join(R, s)).filter((f) => f === "index.html" || /^compositions\/.*\.html$/.test(f))) {
      const at = path.join(R, s, f);
      for (const [, ref] of fs.readFileSync(at, "utf8").matchAll(/["'(]\s*((?:\.\.\/)+shared\/[^"'()\s?#]+)/g)) {
        const to = path.resolve(path.dirname(at), ref);
        if (fs.existsSync(to) && to.startsWith(path.join(R, "shared") + path.sep)) used.add(path.relative(path.join(R, "shared"), to)); else broken.push(`${s}/${f} → ${ref}`);
      }
    }
    const unused = shared.filter((f) => !/\.txt$/.test(f) && !used.has(f));   // (licences sit beside the fonts; nothing loads them)
    check("the pages reference the shared copies, at the right depth", broken.length === 0 && unused.length === 0, broken.length ? `broken: ${broken.slice(0, 3).join(" | ")}` : unused.length ? `unreferenced: ${unused.join(", ")}` : `${used.size} shared file(s) referenced`);
  }
  // the page's own faces (packages/player/fonts/faces.json): shipped in the bundle with their licences, declared
  // in the page's head from the list inlined there (no fetch of it), preloaded, and loaded from the bundle, not the system
  {
    const fs = await import("node:fs"), path = await import("node:path");
    const faces = JSON.parse(fs.readFileSync(path.join(root, "fonts/faces.json"), "utf8"));
    const missing = faces.faces.flatMap((f) => [f.file, f.licence]).filter((f) => !fs.existsSync(path.join(root, "fonts", f)) || !fs.statSync(path.join(root, "fonts", f)).size);
    check("the page's faces and their licences are in the bundle (fonts/)", !missing.length && faces.faces.every((f) => /\.txt$/.test(f.licence)), missing.length ? `missing: ${missing.join(", ")}` : faces.faces.map((f) => f.file).join(", "));
    const f = await page.evaluate(async (fam) => {
      await Promise.all(fam.map((x) => document.fonts.load(`16px "${x}"`))); await document.fonts.ready;
      const loaded = [...document.fonts].filter((x) => x.status === "loaded").map((x) => x.family.replace(/"/g, ""));
      const got = performance.getEntriesByType("resource").map((e) => new URL(e.name)).filter((u) => u.origin === location.origin);
      return { loaded, woff2: got.filter((u) => /^\/fonts\/[^/]+\.woff2$/.test(u.pathname)).map((u) => u.pathname), listFetched: got.some((u) => /faces\.json$/.test(u.pathname)),
        decl: !!document.head.querySelector("style[data-rp-fonts]"), inline: !!document.getElementById("rp-faces"), preload: document.head.querySelectorAll('link[rel="preload"][as="font"]').length,
        sans: getComputedStyle(document.querySelector("#rp")).getPropertyValue("--sans").trim(), bodyFont: getComputedStyle(document.body).fontFamily };
    }, [...new Set(faces.faces.map((x) => x.family))]);
    const fams = [...new Set(faces.faces.map((x) => x.family))];
    check("each face loads from the bundle's fonts/, not the system", fams.every((x) => f.loaded.includes(x)) && f.woff2.length >= faces.faces.length, JSON.stringify({ loaded: f.loaded, woff2: f.woff2 }));
    check("declared in the page's head from the list inlined there, each file preloaded", f.decl && f.inline && !f.listFetched && f.preload === faces.faces.length, JSON.stringify({ decl: f.decl, inline: f.inline, listFetched: f.listFetched, preload: f.preload }));
    check("the player's --sans and the page's text are the list's sans", f.sans.includes(faces.roles.sans.family) && f.bodyFont.includes(faces.roles.sans.family), `${f.sans} · ${f.bodyFont}`);
  }
  check("no page errors / missing files", errs.length === 0, errs.slice(0, 3).join(" | "));
} catch (e) { ok = false; console.error("✗", e.message); }
await browser.close(); server.kill(); process.exit(ok ? 0 : 1);
