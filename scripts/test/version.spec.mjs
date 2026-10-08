// The skill runs its tooling as `npx -y reelplanning@<version>`, so the version it names has to be
// the version package.json publishes — a skill pinned to an older release silently runs old code, and
// one pinned to a newer release than exists fails on every command. Same for the plugin manifests,
// scripts/release/install.sh and the docs. `npm version` keeps them together (scripts/release/sync-version.mjs); this
// catches a hand edit that did not.
//
// The commands people are shown run reelplanning one way, RP_COMMAND in scripts/lib/env.mjs: `reelplanning`
// while the package is not on npm (installed from GitHub), `npx -y reelplanning@<version>` once it is. The
// player's after-export lines keep a copy (they run in a browser); sync-version.mjs carries it there.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { VERSION, PINNED_FILES, RP_FILES, stale } from "../release/sync-version.mjs";
import { ROOT, ON_NPM, RP_COMMAND, RP_INSTALL, rpCommand } from "../lib/env.mjs";
import { describe } from "../hyperframes-skills.mjs";
import { agentBlock } from "../lib/agents.mjs";

let failed = 0;
const test = (name, fn) => { try { fn(); console.log(`✓ ${name}`); } catch (e) { failed++; console.error(`✗ ${name}\n  ${e.message}`); } };

test("package.json has a semver version", () => assert.match(VERSION, /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/));
test(`SKILL.md runs the tooling as npx -y reelplanning@${VERSION}`, () => {
  const skill = readFileSync(join(ROOT, "skills/plan-to-video/SKILL.md"), "utf8");
  assert.ok(skill.includes(`\`npx -y reelplanning@${VERSION}\``), "SKILL.md does not define $RP as the pinned package");
});
test("the files that pin the version were all found (the curl installer among them)", () => assert.ok(PINNED_FILES.length >= 5 && PINNED_FILES.includes("scripts/release/install.sh"), PINNED_FILES.join(", ")));
test("every pinned version and plugin manifest matches package.json", () => {
  const s = stale();
  assert.deepEqual(s, [], s.map((x) => `${x.file}: ${x.found}`).join("; ") + " — run: node scripts/release/sync-version.mjs");
});
test("RP_COMMAND is `reelplanning` before npm and the pinned npx package after", () => {
  assert.equal(rpCommand("1.2.3", false), "reelplanning");
  assert.equal(rpCommand("1.2.3", true), "npx -y reelplanning@1.2.3");
  assert.equal(RP_COMMAND, rpCommand(VERSION, ON_NPM));
  assert.equal(RP_INSTALL, ON_NPM ? "npm i -g reelplanning" : "npm i -g github:ncrispino/reelplanning");
});
test("the player's after-export lines and the guide's export run RP_COMMAND", () => {
  for (const f of RP_FILES) {
    const src = readFileSync(join(ROOT, f), "utf8");
    assert.ok(src.includes(`const RP_COMMAND = ${JSON.stringify(RP_COMMAND)};`), `${f} does not copy RP_COMMAND (${RP_COMMAND})`);
    assert.ok(/\$\{RP_COMMAND\} (reel record|system-review)/.test(src), `${f}: its export line does not use RP_COMMAND`);
  }
});
test("the hints people see say RP_COMMAND (--help, the skills check's fix, setup, the Codex note)", () => {
  const help = spawnSync(process.execPath, [join(ROOT, "bin/reelplanning.mjs"), "--help"], { encoding: "utf8" }).stdout;
  const fix = describe([{ importer: null, spec: "x", target: "/x", chain: [] }], "v0.0.0");
  assert.ok(fix.includes(`fix: ${RP_COMMAND} hyperframes-skills`), fix);
  const setup = readFileSync(join(ROOT, "scripts/setup.sh"), "utf8");
  assert.ok(setup.includes('RP="$(node "$ROOT/scripts/lib/env.mjs" rp') && /run: \$RP hyperframes-skills/.test(setup), "setup.sh's hints do not use RP_COMMAND");
  const codex = agentBlock("codex")["//"];
  assert.ok(codex.includes(RP_INSTALL), codex);
  if (ON_NPM) assert.ok(help.includes(`(or: ${RP_COMMAND} <command>`), help.split("\n")[2]);
  else for (const [what, text] of [["--help", help], ["the skills fix", fix], ["setup.sh", setup], ["the Codex note", codex],
    ...RP_FILES.map((f) => [f, readFileSync(join(ROOT, f), "utf8")])])
    assert.ok(!/npx -y reelplanning@/.test(text), `${what} shows npx -y reelplanning@…, and the package is not on npm`);
});
// The Node it needs, the same way: package.json's engines, what the CLI refuses below (scripts/lib/node-check.mjs),
// what setup and the curl installer check, and what the docs tell people to install (they said 18 long after it was 22).
test("the Node package.json's engines names is the one the CLI, setup, the installer and the docs say", () => {
  const need = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).engines.node.replace(/^>=\s*/, "");
  const [maj, min] = need.split(".").map(Number), short = `${maj}.${min}`;
  for (const f of ["scripts/setup.sh", "scripts/release/install.sh"])
    assert.ok(readFileSync(join(ROOT, f), "utf8").includes(`a > ${maj} || (a === ${maj} && b >= ${min})`), `${f} does not check Node ${short}`);
  for (const f of ["README.md", "AGENTS.md", ".github/CONTRIBUTING.md", "docs/agents.md", "scripts/setup.sh", "scripts/release/install.sh", "eval/case-studies/kit/arm.sh"]) {
    const said = [...readFileSync(join(ROOT, f), "utf8").matchAll(/\b[Nn]ode (\d+(?:\.\d+)?)(?:\+| or (?:later|newer))/g)].map((m) => m[1]);
    assert.ok(said.length && said.every((v) => v === short), `${f} says Node ${said.join(", ") || "nothing"}, not ${short}`);
  }
  const as = (v) => spawnSync(process.execPath, ["--import", `data:text/javascript,Object.defineProperty(process.versions,"node",{value:"${v}"})`,
    join(ROOT, "bin/reelplanning.mjs"), "--version"], { encoding: "utf8" });
  const older = as(`${maj - 1}.99.0`), same = as(need);
  assert.ok(older.status === 1 && older.stderr.includes(`needs Node ${need} or later`), `Node ${maj - 1}.99.0: ${older.status} ${older.stderr}`);
  assert.ok(same.status === 0 && same.stdout.trim() === VERSION, `Node ${need}: ${same.status} ${same.stderr}`);
});
if (failed) process.exit(1);
