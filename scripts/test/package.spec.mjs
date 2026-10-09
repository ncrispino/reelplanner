// What `npm publish` ships (package.json "files"): everything the CLI needs and nothing else. A user who
// runs `npx -y reelplanner@<version>` gets only these files, so a script that imports or reads a file left
// out of "files" works in this checkout and fails for everyone else; and a video, a test or a plan in the
// package makes every install larger for nothing. The publish workflow runs this in the full suite.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { ROOT } from "../lib/env.mjs";

let failed = 0;
const test = (name, fn) => { try { fn(); console.log(`✓ ${name}`); } catch (e) { failed++; console.error(`✗ ${name}\n  ${e.message}`); } };

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const [pack] = JSON.parse(execFileSync(npm, ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
const files = pack.files.map((f) => f.path), shipped = new Set(files);
const has = (p) => shipped.has(p) || files.some((f) => f.startsWith(p.replace(/\/$/, "") + "/"));
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

test(`the package holds files (${files.length}, ${Math.round(pack.size / 1e3)} kB packed)`, () => assert.ok(files.length > 50, String(files.length)));

test("no media, tests, videos, plans or example projects", () => {
  const bad = files.filter((f) => /\.(mp4|webm|wav|mp3|gif|png|jpe?g)$/i.test(f)
    || /^(videos|media|docs|\.reelplanner|\.github)\//.test(f) || /(^|\/)test\//.test(f) || /^scripts\/release\//.test(f)
    || (/^eval\//.test(f) && !/^eval\/case-studies\/(TEMPLATE\.md|REPLICATE\.md|kit\/)/.test(f)));
  assert.deepEqual(bad, []);
});

test("both commands and the licence are in it", () => {
  for (const b of Object.values(pkg.bin)) assert.ok(shipped.has(b.replace(/^\.\//, "")), `bin ${b} is not shipped`);
  for (const f of ["LICENSE", "NOTICE", "README.md", "package.json"]) assert.ok(shipped.has(f), `${f} is not shipped`);
});

// Every shipped script's relative imports, and every repo path it names in quotes, are shipped too.
const code = files.filter((f) => /\.(mjs|js|sh)$/.test(f));
test(`every relative import in the ${code.length} shipped scripts is shipped`, () => {
  const missing = [];
  for (const f of code) {
    const src = readFileSync(join(ROOT, f), "utf8");
    const specs = [...src.matchAll(/^\s*(?:import|export)\b[^;"'`]*?(?:\bfrom\s*)?["'](\.\.?\/[^"']+)["']/gm), ...src.matchAll(/\bimport\(\s*["'](\.\.?\/[^"']+)["']\s*\)/g)];
    for (const [, spec] of specs) {
      if (spec.includes("node_modules/")) continue; // a dependency: beside reelplanner under npx (bundle-player rewrites it)
      if (!shipped.has(posix.normalize(posix.join(dirname(f), spec)))) missing.push(`${f} imports ${spec}`);
    }
  }
  assert.deepEqual(missing, []);
});
test("every package path a shipped script names in quotes is shipped", () => {
  const missing = [];
  for (const f of code) {
    // not a comment, nor a file inside a dependency (depFile("hyperframes", "bin/…"))
    const src = readFileSync(join(ROOT, f), "utf8").split("\n").filter((l) => !/^\s*(\/\/|#|\*)/.test(l) && !/depFile\(/.test(l)).join("\n");
    for (const m of src.matchAll(/["'`]((?:\$ROOT\/)?(?:scripts|templates|packages\/player|skills|bin|eval\/case-studies)\/[\w./-]*[\w/])["'`]/g)) {
      const p = m[1].replace(/^\$ROOT\//, "");
      if (!has(p)) missing.push(`${f}: ${m[1]}`);
    }
  }
  assert.deepEqual([...new Set(missing)], []);
});
test("the player's typefaces and their licences are shipped", () => {
  const faces = JSON.parse(readFileSync(join(ROOT, "packages/player/fonts/faces.json"), "utf8")).faces;
  for (const x of faces) for (const f of [x.file, x.licence]) assert.ok(shipped.has(`packages/player/fonts/${f}`), f);
});

if (failed) process.exit(1);
