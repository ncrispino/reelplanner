// `reelplanner guide --check` (the plan guide, step 2): the page as built drops nothing plan.md says, every fold can be
// opened by a visible control, nothing is only in motion or only by dragging, nothing is made up, nothing says the
// video again, every place the video stops for you is on its timeline as what it is (a pause, the list, choices shown
// without a pause) and every choice it stops on links to that moment, no Markdown fence is left as text, and it neither
// errors, nor loads from the network, nor scrolls sideways on a phone. It fails only on
// those; every gap (a case with no trace, an interface part with no meaning…) is listed, and shown on the page.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { launchOpts } from "../env.mjs";
import { withoutForGuide } from "./depth.mjs";
import { planBaseline, compareParts } from "./revised.mjs";

const alnum = (s) => String(s).toLowerCase().replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[^a-z0-9]+/g, "");
// every heading and paragraph of plan.md, one entry each (a list item, a table row, a quote, a code block's lines)
export function paragraphsOf(md) {
  const out = []; let para = [];
  const flush = () => { if (para.length) out.push(para.join(" ")); para = []; };
  let code = false, diagram = false;
  for (const raw of withoutForGuide(String(md).replace(/\r\n/g, "\n")).split("\n")) {
    // a diagram's text is drawn, not shown: its words are the diagram's labels and its "in words" list
    if (/^\s*```diagram/.test(raw) && !code) { flush(); diagram = true; continue; }
    if (diagram) { if (/^\s*```/.test(raw)) diagram = false; continue; }
    if (/^\s*```/.test(raw)) { flush(); code = !code; continue; }
    if (code) { if (raw.trim()) out.push(raw); continue; }
    if (!raw.trim()) { flush(); continue; }
    if (/^#{1,6} /.test(raw)) { flush(); if (!/^# /.test(raw)) out.push(raw.replace(/^#+ /, "")); continue; }
    if (/^\s*\|/.test(raw)) { flush(); if (!/^\s*\|[\s:|-]+\|\s*$/.test(raw)) out.push(raw.replace(/\|/g, " ")); continue; }
    if (/^\s*(?:[-*]|\d+\.) /.test(raw)) { flush(); para.push(raw.replace(/^\s*(?:[-*]|\d+\.) /, "")); continue; }
    para.push(raw.replace(/^> ?/, ""));
  }
  flush();
  return out.filter((p) => alnum(p).length > 3);
}
const sentencesOf = (t) => String(t || "").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 8);

/** Check a built guide: { fails: [..], oks: [..], gaps: [..] }. */
export async function checkGuide({ model, outDir, full = join(outDir, "index.html"), partFiles = [], browser = true }) {
  const G = model.data, fails = [], oks = [];
  for (const g of G.gaps.filter((g) => g.fail)) fails.push(`${g.where}: ${g.what}`);
  const gaps = G.gaps.filter((g) => !g.fail);
  // the moments point at sections that exist
  const names = new Set(model.parts.map((p) => p.name));
  const frames = [];
  for (const v of Object.values(G.videos || {})) if (v) for (const f of v.scenes) frames.push({ ...f, video: v.slug });
  const pointed = frames.filter((f) => f.guide);
  for (const f of pointed) { const [p] = String(f.guide).split("#"); if (!names.has(p)) fails.push(`scene ${f.n} of ${f.video} opens the guide at "${f.guide}", a part the guide does not have (${[...names].join(", ")})`); }
  if (!browser) { oks.push(`${model.parts.length} parts; ${pointed.length} scenes open a part (not opened in a browser)`); return { fails, oks, gaps }; }
  let chromium; try { ({ chromium } = await import("playwright-core")); } catch { return { fails, oks, gaps, unopened: "not opened in a browser: playwright-core is not installed, so the layers, the 375 px page and the parts were not checked (npm install playwright-core)" }; }
  const b = await chromium.launch(launchOpts());
  const open = async (file, { width = 1440, height = 900, reduced = false } = {}) => {
    const page = await b.newPage({ viewport: { width, height }, reducedMotion: reduced ? "reduce" : "no-preference" });
    const errs = [], asked = new Set();
    page.on("pageerror", (e) => errs.push(String(e.message || e).split("\n")[0]));
    page.on("request", (r) => { const u = r.url(); if (!/^(data|blob|about):/.test(u) && !u.startsWith("file:")) asked.add(u); });
    await page.route(/^(https?|wss?):/, (route) => route.abort());
    await page.goto(pathToFileURL(file).href, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(150);
    return { page, errs, asked };
  };
  try {
    // desktop, then a phone: no error, nothing from the network, nothing sideways
    for (const [w, hgt] of [[1440, 900], [375, 812]]) {
      const { page, errs, asked } = await open(full, { width: w, height: hgt });
      for (const e of new Set(errs)) fails.push(`the page errors at ${w} px: ${e}`);
      for (const u of asked) fails.push(`the page asks the network for ${u.slice(0, 100)}`);
      if (w === 375) { await page.evaluate(() => window.RPGuide?.expandAll(true, { everything: true })); await page.waitForTimeout(100); const sw = await page.evaluate(() => document.documentElement.scrollWidth); if (sw > 376) fails.push(`the page scrolls sideways at 375 px (${sw} px wide)`); }
      await page.close();
    }
    // Open everything (the reference folds too: the decisions and the plan's own words), with reduced motion: every
    // layer open, every thing under its beat
    const { page } = await open(full, { reduced: true });
    if (!(await page.evaluate(() => !!window.RPGuide))) { fails.push("the page did not start (its script stopped before it drew the page)"); await page.close(); return { fails, oks, gaps }; }
    await page.evaluate(() => window.RPGuide.expandAll(true, { everything: true }));
    await page.waitForTimeout(200);
    const got = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const details = [...document.querySelectorAll("details")];
      return {
        text: document.body.innerText,
        closed: details.filter((d) => !d.open).length,
        noSummary: details.filter((d) => !d.querySelector(":scope > summary") || !vis(d.querySelector(":scope > summary"))).map((d) => d.id || d.className).slice(0, 5),
        cases: document.querySelectorAll("details.case").length, traced: document.querySelectorAll("details.case .trace").length,
        iface: document.querySelectorAll("details.ip").length, words: document.querySelectorAll("details.words").length,
        decs: [...new Set([...document.querySelectorAll("details.dec")].map((d) => d.id))],
        diffs: document.querySelectorAll(".dv").length,
        drags: [...document.querySelectorAll(".dnd, .ord")].map((d) => ({ show: !!d.querySelector("[data-show]"), cards: [...d.querySelectorAll(".card, .beatc")].every((c) => c.tagName === "BUTTON") })),
        real: [...document.querySelectorAll("[data-real]")].map((e) => e.dataset.real),
        // what changed since the review: each part's mark, each "What changed", the toggle
        chg: [...document.querySelectorAll("main [data-chg]")].map((e) => e.dataset.chg), chgd: [...document.querySelectorAll("main details.chgd")].map((d) => d.dataset.chgd), only: !!document.querySelector("[data-only]"),
        // the video's stops as the page draws them, and each choice's card with its link to its moment
        tl: [...document.querySelectorAll(".tl-list li.tl-i")].map((li) => ({ kind: li.dataset.kind, ids: (li.dataset.ids || "").split(" ").filter(Boolean) })),
        cards: [...document.querySelectorAll("li.call[id^='choice-']")].map((c) => ({ id: c.id.slice(7), wm: !!c.querySelector(".xl .wm"), lead: (c.querySelector(".chose")?.textContent || "").trim() })),
        // the words as read, code and whole files and runs left out: a Markdown fence here was not drawn as code
        fences: (() => { const c = document.querySelector("main").cloneNode(true); c.querySelectorAll("pre, code, .L, .term, .cmdline, svg, .dv, textarea, .wd, .wd-gone").forEach((x) => x.remove()); c.style.cssText = "position:absolute;left:-99999px;width:900px"; document.body.appendChild(c); const t = c.innerText; c.remove(); return [...t.matchAll(/.{0,50}```.{0,30}/g)].map((m) => m[0]); })(),
        ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
        // the first layer: what the page says before anything is opened (its folds' insides and the real things left out)
        first: (() => { const c = document.querySelector("main").cloneNode(true); c.querySelectorAll("details > :not(summary), figure.shot, .run, pre, .cmdline").forEach((x) => x.remove()); c.style.cssText = "position:absolute;left:-99999px;width:900px"; document.body.appendChild(c); const t = c.innerText; c.remove(); return t; })(),
      };
    });
    await page.close();
    const text = alnum(got.text);
    if (G.kind === "plan") {
      const pm = readFileSync(join(model.target.planDir, "plan.md"), "utf8"), paras = paragraphsOf(pm);
      const missing = paras.filter((p) => !text.includes(alnum(p)));
      if (missing.length) fails.push(`${missing.length} of plan.md's ${paras.length} headings and paragraphs are not in the page: ${missing.slice(0, 3).map((m) => `"${m.slice(0, 60)}…"`).join("; ")}`);
      const nCases = G.steps.reduce((a, s) => a + (s.cases?.rows.length || 0), 0), nIf = G.steps.reduce((a, s) => a + (s.iface?.parts.length || 0), 0);
      const want = new Set(Object.keys(G.ledger || {}));
      const layered = [got.cases === nCases && got.traced === nCases, got.iface === nIf, [...want].every((id) => got.decs.includes(id)), got.words === G.steps.filter((s) => s.text).length];
      if (!layered[0]) fails.push(`${nCases} cases, but ${got.cases} rows open a layer (${got.traced} with their trace or its gap)`);
      if (!layered[1]) fails.push(`${nIf} interface parts, but ${got.iface} open their spec`);
      if (!layered[2]) fails.push(`decisions with no ledger entry to open: ${[...want].filter((id) => !got.decs.includes(id)).slice(0, 6).join(", ")}`);
      if (!layered[3]) fails.push(`${G.steps.length} steps, but ${got.words} open "The step as the plan wrote it"`);
      if (G.built) { const withFiles = G.built.cats.filter((c) => c.files.length).length; if (got.diffs < withFiles) fails.push(`${withFiles} categories of change with files, but ${got.diffs} open their full diff`); }
      if (!missing.length) oks.push(`${G.steps.length} steps, every heading and paragraph of plan.md in the page (${paras.length}); ${frames.length} scenes, ${pointed.length} opening a part`);
      if (layered.every(Boolean)) oks.push(`${nCases} cases, ${nIf} interface parts, ${want.size} decisions${G.built ? `, ${got.diffs} full diffs` : ""}: each opens its layer, each by a visible control`);
    } else oks.push(`${G.sources.length} sources, ${G.sources.filter((s) => s.part).length} with a part`);
    if (got.closed) fails.push(`Open everything left ${got.closed} layer(s) closed`);
    // the video's stops: each on the timeline as what it is, and each choice it stops on a link from its card
    const own = (G.videos || {})[G.own], stopsSeen = got.tl.map((x) => `${x.kind}:${x.ids.join(",")}`);
    if (G.kind === "plan" && own) {
      for (const st of own.stops || []) if (["choices", "list", "shown"].includes(st.kind) && !stopsSeen.includes(`${st.kind}:${st.ids.join(",")}`)) fails.push(`the video stops at scene ${st.n} (${st.kind === "choices" ? "a pause on" : st.kind === "list" ? "its list of" : "a sheet of"} ${st.ids.join(", ")}), and the page's timeline does not say so`);
      // the choices counted as pauses are the walkthrough video's: held against its timeline, on its own page
      const pauses = G.own === "built" ? G.reader?.counts?.pause || [] : [];
      for (const id of pauses) if (!got.tl.some((x) => x.kind === "choices" && x.ids.includes(id))) fails.push(`the page counts ${id} as a choice the video pauses on, and its timeline has no pause on it`);
      if (G.own === "built") for (const x of got.tl) if (x.kind === "choices" && x.ids.some((id) => !pauses.includes(id) && (G.built?.calls || []).some((c) => c.id === id))) fails.push(`the timeline shows a pause on ${x.ids.join(", ")} the page's count of pauses leaves out`);
    }
    const stopped = new Set(Object.values(G.videos || {}).filter(Boolean).filter((v) => v === (G.videos || {}).built).flatMap((v) => (v.stops || []).filter((x) => ["choices", "list", "shown"].includes(x.kind)).flatMap((x) => x.ids)));
    const unlinked = got.cards.filter((c) => stopped.has(c.id) && !c.wm).map((c) => c.id);
    if (unlinked.length) fails.push(`${unlinked.length} choice card(s) the video stops on with no link to that moment: ${unlinked.slice(0, 8).join(", ")}`);
    // each choice leads with what it chose, in words: never an empty lead (a title cut to nothing, or to a label)
    const empty = got.cards.filter((c) => !/[A-Za-z]{2,}.*\s+\S*[A-Za-z]{2,}/.test(c.lead)).map((c) => c.id);
    if (empty.length) fails.push(`${empty.length} choice card(s) with no lead in words, only a label or nothing: ${empty.slice(0, 8).join(", ")}`);
    // what changed since the review (lib/guide/revised.mjs): every part whose words changed is marked, with its "What
    // changed", and nothing else is: held against the two versions of plan.md compared again here, not the page's own list
    if (G.kind === "plan" && G.revised) {
      const R = G.revised, base = planBaseline(model.target.planDir, model.repo);
      const again = base ? compareParts(base.text, readFileSync(join(model.target.planDir, "plan.md"), "utf8")) : null;
      const changed = new Set([...(again?.parts || []).filter((x) => x.status !== "same").map((x) => x.key), ...Object.keys(R.units).filter((k) => R.units[k].gone?.length)]);
      const marked = new Set(got.chg), label = (k) => R.units[k]?.label || again?.parts.find((x) => x.key === k)?.label || k;
      if (!base) fails.push(`the page compares plan.md with ${R.against.commit}, and git no longer has that version`);
      for (const k of changed) if (!marked.has(k)) fails.push(`${label(k)} changed ${R.words}, and the page does not mark it`);
      for (const k of marked) if (!changed.has(k)) fails.push(`the page marks ${label(k)} as changed ${R.words}, and its words are the same as then`);
      for (const k of marked) if (!got.chgd.includes(k)) fails.push(`${label(k)} is marked as changed, with no "What changed" to open`);
      if (changed.size && !got.only) fails.push(`${changed.size} part(s) changed ${R.words}, and the page has no "Show only the changes"`);
      if (!fails.some((f) => / changed | as changed |Show only the changes/.test(f))) oks.push(changed.size ? `${changed.size} of ${R.total} parts of plan.md changed ${R.words} (against ${R.against.commit}), each marked with its "What changed"; none of the other ${R.total - changed.size} marked` : `nothing in plan.md changed ${R.words} (against ${R.against.commit}), and nothing is marked`);
    }
    if (got.tl.length || got.cards.length) oks.push(`${got.tl.length} stops on the video's timeline, ${got.cards.filter((c) => c.wm).length} of ${got.cards.length} choice cards linked to their moment in the video`);
    // a Markdown fence left as text: the block was not drawn as code
    for (const f of got.fences.slice(0, 3)) fails.push(`a Markdown fence left as text, not drawn as code: "${f.replace(/\s+/g, " ").trim()}"`);
    if (got.noSummary.length) fails.push(`a layer with no visible control: ${got.noSummary.join(", ")}`);
    for (const d of got.drags) if (!d.show || !d.cards) { fails.push("something to drag with no \"Show me\", or a card that is not a button (keyboard)"); break; }
    // nothing made up: an output shown as real is a saved run
    for (const r of got.real) if (!existsSync(join(model.target.planDir || "", r))) fails.push(`${r} is shown as a real run, and runs/ does not hold it`);
    // the moments' sections exist, as ids in the page
    for (const f of pointed) { const [p, a] = String(f.guide).split("#"); const id = a ? `${p}-${a}` : p; if (!got.ids.includes(id) && !got.ids.includes(p)) fails.push(`scene ${f.n} opens "${f.guide}", and the page has no #${id}`); }
    // nothing restates the video: no sentence of the narration on the first layer
    const first = alnum(got.first);
    const said = [];
    for (const v of Object.values(G.videos || {})) if (v) { let map = {}; try { map = JSON.parse(readFileSync(join(model.repo, v.dir, "plan-map.json"), "utf8")); } catch {} for (const f of map.frames || []) for (const s of sentencesOf(f.narration)) if (first.includes(alnum(s))) said.push({ n: f.index, s }); }
    for (const x of said.slice(0, 5)) fails.push(`the first layer says scene ${x.n}'s sentence again: "${x.s.slice(0, 80)}"`);
    if (!got.closed && !got.noSummary.length) oks.push(`with reduced motion and Open everything, every layer open; ${got.drags.length} thing(s) to drag or order, each with the keyboard and "Show me"`);
    // each part opens on its own, in a panel's width, and says it is ready
    let partsOk = 0;
    for (const f of partFiles) {
      const { page, errs, asked } = await open(f, { width: 560, height: 800 });
      for (const e of new Set(errs)) fails.push(`${f.split("/").pop()}: page error: ${e}`);
      for (const u of asked) fails.push(`${f.split("/").pop()}: asks the network for ${u.slice(0, 100)}`);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth); if (sw > 561) fails.push(`${f.split("/").pop()}: scrolls sideways in a 560 px panel (${sw} px)`);
      if (!errs.length) partsOk++;
      await page.close();
    }
    if (partFiles.length) oks.push(`${partsOk} of ${partFiles.length} parts open without an error in a 560 px panel`);
  } finally { await b.close(); }
  return { fails, oks, gaps };
}
