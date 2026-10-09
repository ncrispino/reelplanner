// The Node this package needs, checked before any command runs. package.json's engines name 22.20, what the
// `skills` installer asks for; the commands themselves run on any Node 22 (HyperFrames needs 22), so only an older
// major is refused here, and `setup` and the curl installer say when this Node is below 22.20. npm only warns about
// engines at install, and an older Node fails later on an import it does not have yet (`styleText`, `zlib.crc32`),
// which says nothing about the fix. Imported first by bin/reelplanner.mjs and bin/reel.mjs, so it runs before
// anything else.
import { readFileSync } from "node:fs";
import "./old-names.mjs"; // a setting's old name (REELPLANNING_*) read as its new one, before anything reads it

const { engines } = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
const need = engines.node.replace(/^>=\s*/, "");
if (+process.versions.node.split(".")[0] < +need.split(".")[0]) {
  console.error(`✗ reelplanner needs Node ${need} or later; this is Node ${process.versions.node}.
    Update Node, then run the command again: https://nodejs.org/en/download (nvm, or Homebrew's node@22).
    On Ubuntu and Debian, apt's own nodejs is older: use nvm, or NodeSource's apt repository.`);
  process.exit(1);
}
