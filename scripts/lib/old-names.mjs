// The names from before reelplanning became reelplanner (D-312), read for a while yet: a setting under its old
// name, REELPLANNING_X, is copied to REELPLANNER_X when that is unset, so the code reads only the new names.
// Imported by scripts/lib/node-check.mjs (first in bin/reelplanner.mjs and bin/reel.mjs, so a command's children
// inherit the copies) and by scripts/lib/env.mjs (every script run on its own). The old folders, .reelplanning/ in a
// repo and ~/.reelplanning, are found by rpDirOf() and machineDir() in env.mjs; a .env file's old names, by
// narrator.mjs's loadEnvFile.
export const OLD_PREFIX = "REELPLANNING_", NEW_PREFIX = "REELPLANNER_";

/** A setting's name now: REELPLANNING_X → REELPLANNER_X; any other name as it is. */
export const newName = (k) => (k.startsWith(OLD_PREFIX) ? NEW_PREFIX + k.slice(OLD_PREFIX.length) : k);

/** Copy each old-named setting in `env` to its new name, where that is unset. → the old names it copied */
export function adoptOldSettings(env = process.env) {
  const copied = [];
  for (const k of Object.keys(env)) {
    if (!k.startsWith(OLD_PREFIX)) continue;
    const n = newName(k);
    if (env[n] === undefined) { env[n] = env[k]; copied.push(k); }
  }
  return copied;
}

adoptOldSettings();
