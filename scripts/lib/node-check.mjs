// The Node this package needs, checked before any command runs: the version in package.json's engines
// (HyperFrames needs 22, and the `skills` installer 22.20). npm only warns about engines at install, and an
// older Node fails later on an import it does not have yet (`styleText`, `zlib.crc32`), which says nothing
// about the fix. Imported first by bin/reelplanning.mjs and bin/reel.mjs, so it runs before anything else.
import { readFileSync } from "node:fs";

const { engines } = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
const need = engines.node.replace(/^>=\s*/, "");
const [have, want] = [process.versions.node, need].map((v) => v.split(".").map(Number));
if ((have[0] - want[0] || have[1] - want[1] || have[2] - want[2]) < 0) {
  console.error(`✗ reelplanning needs Node ${need} or later; this is Node ${process.versions.node}.
    Update Node, then run the command again: https://nodejs.org/en/download (nvm, or Homebrew's node@22).
    On Ubuntu and Debian, apt's own nodejs is older: use nvm, or NodeSource's apt repository.`);
  process.exit(1);
}
