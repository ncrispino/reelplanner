# Shared by the shell scripts: where the caller's project is, and how to run the pinned HyperFrames.
#
# A project directory argument is relative to the CALLER's working directory, never to wherever
# reelplanning is installed: under `npx` $ROOT is a package in the npm cache, which holds no projects and
# must not be written to.
resolve_project() {
  local p="$1"
  if [ -d "$p" ]; then (cd "$p" && pwd)
  else echo "✗ no such project directory: $p (paths are relative to your working directory, $(pwd))" >&2; return 1; fi
}

# `hf <args>` runs the HyperFrames CLI version package.json pins. Not `npx hyperframes`: from a user's
# repo npx has no local install to find, so it fetches the newest release instead of the pin (and
# `npx --no-install hyperframes` fails outright). Needs $ROOT set by the caller.
hf() {
  if [ -z "${_RP_HF_BIN:-}" ]; then _RP_HF_BIN="$(node "$ROOT/scripts/lib/env.mjs" hf-bin)" || return 1; fi
  node "$_RP_HF_BIN" "$@"
}

# Where HyperFrames' skills are installed (see scripts/hyperframes-skills.mjs --dir).
hf_skills_dir() { node "$ROOT/scripts/hyperframes-skills.mjs" --dir; }
