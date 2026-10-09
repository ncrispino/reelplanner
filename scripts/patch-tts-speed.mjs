#!/usr/bin/env node
// Make Kokoro honour the speed we ask it for.
//
// The whole chain carries a speed: audio_request.json has one, the engine reads it (`request.speed`)
// and forwards it to HeyGen. The Kokoro branch of media-use's lib/tts.mjs builds its CLI args without
// it, though `hyperframes tts` takes `-s, --speed`, so Kokoro speaks at ~150 wpm against a style guide
// that wants 185+. Asking Kokoro for the speed gives really faster speech, not a stretched file, and
// leaves the player's speed control as the only stretch in the chain.
//
// This patches a file outside the repo (media-use's lib/tts.mjs in the installed HyperFrames skills),
// which every skills reinstall overwrites (`hyperframes skills update`, `hyperframes init`, and our
// own hyperframes-skills.mjs) — so hyperframes-skills.mjs re-applies it after each install it does,
// and running it again changes nothing. If the upstream file no longer looks the way this expects, it
// fails rather than quietly doing nothing, which would put the pace back to 150 wpm unseen.
//
// Which file: `npx skills` keeps one real copy in ~/.agents/skills and links every agent's skills
// directory to it, so patching that copy patches every agent. An older install may also hold a copy
// of its own in ~/.claude/skills; every distinct copy found is patched, and --check checks the one
// the pipeline runs (hyperframes-skills.mjs --dir).
//
// usage: reelplanner patch-tts-speed [--check]
import { readFileSync, writeFileSync, existsSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { skillsDir, CANDIDATE_DIRS } from "./hyperframes-skills.mjs";

const CHECK = process.argv.includes("--check");
const REL = join("media-use", "audio", "scripts", "lib", "tts.mjs");
const TTS = join(skillsDir(), REL);

// the exact args line the Kokoro branch builds, and the line we add under it
const ANCHOR = `  const args = ["hyperframes", "tts", writeTmpText(text), "--voice", voiceId, "--output", wavRel];`;
const ADDED = `  if (speed && speed !== 1) args.push("--speed", String(speed));   // reelplanning: patch-tts-speed.mjs`;

if (!existsSync(TTS)) {
  console.error(`✗ ${TTS} not found — run \`reelplanner hyperframes-skills\` first`);
  process.exit(1);
}

if (CHECK) {
  if (readFileSync(TTS, "utf8").includes(ADDED.trim())) { console.log(`✓ tts.mjs already forwards --speed to Kokoro`); process.exit(0); }
  console.error("✗ tts.mjs does NOT forward --speed to Kokoro — narration would come out at ~150 wpm");
  console.error("  fix: reelplanner patch-tts-speed");
  process.exit(1);
}

// every distinct copy an agent could run: the one the pipeline uses first, then any other
const seen = new Set(), copies = [];
for (const d of [skillsDir(), ...(process.env.REELPLANNER_SKILLS_DIR ? [] : CANDIDATE_DIRS)]) {
  const f = join(d, REL);
  if (!existsSync(f)) continue;
  const real = realpathSync(f);
  if (!seen.has(real)) { seen.add(real); copies.push(f); }
}

let failed = 0;
for (const f of copies) {
  const src = readFileSync(f, "utf8");
  if (src.includes(ADDED.trim())) { console.log(`✓ tts.mjs already forwards --speed to Kokoro (${f})`); continue; }
  if (!src.includes(ANCHOR)) {
    // upstream moved: a no-op here would look like success and slow every video back to ~150 wpm
    console.error("✗ could not find the Kokoro args line in tts.mjs — upstream has changed shape.");
    console.error(`  expected: ${ANCHOR.trim()}`);
    console.error(`  in:       ${f}`);
    console.error("  Re-check the Kokoro branch of synthesize() and update ANCHOR in this script.");
    failed++; continue;
  }
  // `speed` is already destructured by the enclosing synthesize({ ..., speed = 1.0, ... }), so it is
  // in scope here; the HeyGen branch a few lines up uses the same binding.
  writeFileSync(f, src.replace(ANCHOR, `${ANCHOR}\n${ADDED}`));
  console.log(`✓ patched ${f}\n  Kokoro now receives --speed, so narration is synthesised at its final pace`);
}
if (failed) process.exit(1);
