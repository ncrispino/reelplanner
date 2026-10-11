// Read-only setup prerequisites. Checking CLI help proves available features, never a completed model run.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, pkgDir, dependencyFix } from "./env.mjs";

export function missingDependencies() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  return Object.keys(pkg.dependencies || {}).filter((name) => !pkgDir(name));
}

export async function agentDiagnostics({ repo = process.cwd(), env = process.env, executable } = {}) {
  const { detectAgent, getHarness } = await import("./agents.mjs");
  const selected = detectAgent(env), probe = await getHarness(selected.agent).probe({ repo, env, executable });
  const lines = [`→ coding agent: ${selected.agent} (${selected.why})`];
  if (probe.available) {
    const labels = { headless: "headless runs", automaticReview: "automatic approval review", queue: "session queue", plugins: "plugins", mcp: "MCP", sessionExport: "session export" };
    const features = Object.entries(labels).filter(([key]) => probe.capabilities[key]).map(([, label]) => label);
    lines.push(`✓ ${selected.agent}${probe.version ? ` ${probe.version}` : ""}: ${features.join(", ") || "no supported CLI features detected"}`);
  }
  for (const limit of probe.limitations || []) lines.push(`→ ${limit}`);
  lines.push("→ setup checks CLI features; model-driven plan, review and walkthrough runs are not checked here.");
  return { selected, probe, lines };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--dependencies")) {
    const missing = missingDependencies();
    if (missing.length) {
      console.error(`✗ reelplanner npm dependencies missing: ${missing.join(", ")}`);
      console.error(`    ${dependencyFix()}; then run setup again.`);
      process.exitCode = 1;
    } else console.log("✓ reelplanner npm dependencies");
  } else {
    try { for (const line of (await agentDiagnostics()).lines) console.log(line); }
    catch (e) { console.error(`✗ coding agent check: ${e.message}`); process.exitCode = 1; }
  }
}
