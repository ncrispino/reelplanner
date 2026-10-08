// hyperframes-skills.mjs --check must name the file an installed skill imports but does not have —
// the shape of heygen-com/hyperframes#4230, where media-use re-exported a monorepo-only path and
// finish-project.sh died at assemble-index with the error filtered out.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import { brokenImports, pinnedRef, ENTRIES } from "../hyperframes-skills.mjs";

const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "hyperframes-skills.mjs");
const dir = mkdtempSync(join(tmpdir(), "hf-skills-"));
const put = (rel, src) => { mkdirSync(dirname(join(dir, rel)), { recursive: true }); writeFileSync(join(dir, rel), src); };
let failed = 0;
const test = (name, fn) => { try { fn(); console.log(`✓ ${name}`); } catch (e) { failed++; console.error(`✗ ${name}\n  ${e.message}`); } };

try {
  // every entry present and loading
  for (const e of ENTRIES) put(e, `import { x } from "node:fs";\nexport const ok = 1;\n`);
  put("faceless-explainer/scripts/lib/util.mjs", "export const u = 1;\n");
  put("faceless-explainer/scripts/assemble-index.mjs", `import { u } from "./lib/util.mjs";\nimport { bgm } from "../../media-use/audio/scripts/lib/bgm.mjs";\n`);
  put("media-use/audio/scripts/lib/bgm.mjs", `// import { gone } from "./commented-out.mjs";\nimport { fetchMedia } from "../../../scripts/lib/media-fetch.mjs";\nexport const bgm = 1;\n`);
  put("media-use/scripts/lib/media-fetch.mjs", "export async function fetchMedia() {}\n");

  test("a clean install has no broken imports", () => assert.deepEqual(brokenImports(dir, ENTRIES), []));

  test("the upstream shim is reported with the file, the missing target and the chain", () => {
    put("media-use/scripts/lib/media-fetch.mjs", `export {\n  fetchMedia,\n} from "../../../../packages/cli/src/media-use/lib/media-fetch.mjs";\n`);
    const [b, ...rest] = brokenImports(dir, ENTRIES);
    assert.equal(rest.length, 0);
    assert.equal(b.importer, join(dir, "media-use/scripts/lib/media-fetch.mjs"));
    assert.equal(b.spec, "../../../../packages/cli/src/media-use/lib/media-fetch.mjs");
    assert.equal(b.target, join(dirname(dir), "packages/cli/src/media-use/lib/media-fetch.mjs"));
    assert.deepEqual(b.chain.map((f) => f.slice(dir.length + 1)),
      ["faceless-explainer/scripts/assemble-index.mjs", "media-use/audio/scripts/lib/bgm.mjs", "media-use/scripts/lib/media-fetch.mjs"]);
  });

  test("a skill that is not installed at all is reported", () => {
    rmSync(join(dir, "faceless-explainer/scripts/captions.mjs"));
    assert.ok(brokenImports(dir, ENTRIES).some((b) => b.importer === null && b.spec === "faceless-explainer/scripts/captions.mjs"));
  });

  test("--check exits 1 and prints the missing file and the fix", () => {
    let out = "", code = 0;
    try { execFileSync(process.execPath, [SCRIPT, "--check"], { env: { ...process.env, REELPLANNING_SKILLS_DIR: dir }, stdio: "pipe" }); }
    catch (e) { code = e.status; out = String(e.stderr); }
    assert.equal(code, 1);
    assert.match(out, /media-fetch\.mjs imports "\.\.\/\.\.\/\.\.\/\.\.\/packages\/cli\/src\/media-use\/lib\/media-fetch\.mjs"/);
    assert.match(out, /does not exist/);
    assert.match(out, /fix: reelplanning hyperframes-skills/);
  });

  test("the skills pin follows the exact hyperframes version in package.json", () => assert.match(pinnedRef(), /^v\d+\.\d+\.\d+$/));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
if (failed) process.exit(1);
