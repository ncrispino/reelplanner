// Can an agent tell the story from what the sketch gave it? For each scenario played (sketch-scenarios.spec.mjs with
// SKETCH_SCENARIOS_OUT), its sketch.md and final picture go to a judge model with the scenario's expect.story, and
// each statement is judged clear / partly / missing, with brief evidence. A measure, not a pass or fail: run it before
// and after a change to what the page records or how sketch.md tells it.
//   node scripts/test/sketch-scenarios/judge.mjs <out dir> [scenario.json ...]   (default: every scenario)
//   OPENROUTER_API_KEY (the shell, or ~/.reelplanner/.env); JUDGE_MODEL, default anthropic/claude-sonnet-5.5
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { readdirSync } from "node:fs";
import { loadEnvFile } from "../../lib/narrator.mjs";
import { ROOT } from "../../lib/env.mjs";
const [OUT, ...given] = process.argv.slice(2);
if (!OUT) { console.error("usage: node scripts/test/sketch-scenarios/judge.mjs <out dir> [scenario.json ...]"); process.exit(1); }
const DIR = new URL("./scenarios/", import.meta.url).pathname;
const files = given.length ? given : readdirSync(DIR).filter((f) => f.endsWith(".json")).sort().map((f) => join(DIR, f));
loadEnvFile(ROOT);
if (!process.env.OPENROUTER_API_KEY) { console.error("✗ judge: needs OPENROUTER_API_KEY"); process.exit(1); }
const MODEL = process.env.JUDGE_MODEL || "anthropic/claude-sonnet-5.5";
let total = { clear: 0, partly: 0, missing: 0 };
const rows = [];
for (const f of files) {
  const sc = JSON.parse(readFileSync(f, "utf8")), id = sc.id || basename(f, ".json"), dir = join(OUT, id);
  if (!existsSync(join(dir, "sketch.md"))) { console.log(`· ${id}: no sketch.md`); continue; }
  const md = readFileSync(join(dir, "sketch.md"), "utf8"), items = sc.expect?.story || [];
  const png = existsSync(join(dir, "final.png")) ? "data:image/png;base64," + readFileSync(join(dir, "final.png")).toString("base64") : null;
  const prompt = `You are an AI agent about to explain some code to an engineer. They first sketched how THEY think it works; all you are given is their sketch.md (below) and the final picture. For each statement, say whether you could tell it from what you were given: "clear" (stated or plainly shown), "partly" (you could guess, but not be sure), or "missing" (not recoverable). Give brief evidence in your own words (at most 25 words, no double quotes inside it). Answer only with JSON: {"items":[{"n":1,"verdict":"clear|partly|missing","evidence":"..."}]}

Statements:
${items.map((s, i) => `${i + 1}. ${s}`).join("\n")}

sketch.md:
${md}`;
  let v;
  for (let attempt = 0; attempt < 2 && !v; attempt++) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST",
    headers: { authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "content-type": "application/json", "x-title": "reelplanner sketch judge" },
    body: JSON.stringify({ model: MODEL, max_tokens: 8000, messages: [{ role: "user", content: [{ type: "text", text: prompt }, ...(png ? [{ type: "image_url", image_url: { url: png } }] : [])] }] }) });
  const j = await r.json(); let txt = j.choices?.[0]?.message?.content || "";
  if (Array.isArray(txt)) txt = txt.map((c) => c.text || "").join("");
  try { v = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1)).items; } catch { console.log(`· ${id}: judge answer did not parse (attempt ${attempt + 1})`); }
  }
  if (!v) continue;
  const count = { clear: 0, partly: 0, missing: 0 }; for (const x of v) count[x.verdict] = (count[x.verdict] || 0) + 1;
  for (const k of Object.keys(total)) total[k] += count[k] || 0;
  rows.push({ id, items, v });
  console.log(`\n=== ${id}: ${count.clear} clear, ${count.partly} partly, ${count.missing} missing`);
  for (const x of v) if (x.verdict !== "clear") console.log(`  ${x.verdict.padEnd(7)} ${items[x.n - 1]}\n          ↳ ${x.evidence}`);
}
writeFileSync(join(OUT, "judge.json"), JSON.stringify({ model: MODEL, total, rows }, null, 2));
const n = total.clear + total.partly + total.missing;
console.log(`\nALL: ${total.clear}/${n} clear, ${total.partly} partly, ${total.missing} missing`);
