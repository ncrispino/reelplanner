#!/bin/sh
# provenance: what an arm ran on, so it can be run again the same way. Run it with the arm's environment
# (its env.sh sourced), after the preflight, and keep what it prints as the arm's provenance.json:
#
#   sh provenance.sh <arm> <model> [<more claude arguments>] | tee arms/<arm>/provenance.json
#
# It prints one JSON object: the date and time zone; the machine (OS, kernel, CPU, memory); node, npm,
# python3, git, ffmpeg and Claude Code; how the arm's Claude Code starts and the settings that change what it
# does; for ours, reelplanning (its version, and the head of the branch REELPLANNING_BRANCH names, since npm
# keeps no commit for a git install), HyperFrames, the skills in the arm's config and the voice and
# transcription models on disk. A tool that is missing reads
# "not found": it never stops. No token, key or email goes in: settings are read key by key, env values only
# for names that are not a secret. After the arm, `reel case-study provenance` adds what the transcript says ran.
# POSIX sh, for macOS and Linux.
arm=${1:-}; model=${2:-}
[ -n "$arm" ] && [ -n "$model" ] || { echo "usage: sh provenance.sh <arm> <model> [<more claude arguments>]" >&2; exit 2; }
shift 2; more="$*"
cc=${CLAUDE_CONFIG_DIR:-$HOME/.claude}
export GIT_TERMINAL_PROMPT=0 HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1

has() { command -v "$1" >/dev/null 2>&1; }
tilde() { sed "s|$HOME|~|g"; }
# what may not leave the machine: a URL's user and password, and anything shaped like an email
scrub() { sed -E 's#//[^/@[:space:]]+@#//#g; s/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/<email>/g'; }
# a JSON string: escaped, control characters dropped, lines joined with \n
js() { printf '%s\n' "$1" | tr -d '\000-\010\013\014\016-\037' | awk 'BEGIN { ORS = ""; print "\"" }
  { gsub(/\\/, "\\\\"); gsub(/"/, "\\\""); gsub(/\t/, "\\t"); gsub(/\r/, ""); if (NR > 1) print "\\n"; print } END { print "\"" }'; }
# lines → a JSON array of strings
jsa() { printf '['; first=1; printf '%s\n' "$1" | while IFS= read -r l; do [ -z "$l" ] && continue
  [ "$first" = 1 ] && first=0 || printf ', '; printf '%s' "$(js "$l")"; done; printf ']'; }
# the first line a command prints, or "not found"
v() { has "$1" || { echo "not found"; return; }; out=$("$@" 2>&1 </dev/null | head -n 1); [ -n "$out" ] && echo "$out" | tilde | scrub || echo "not found"; }
# JSON from node, or "not found" when node or the input is missing
nodejs() { has node || { echo '"not found"'; return; }; out=$(node -e "$@" 2>/dev/null); [ -n "$out" ] && echo "$out" || echo '"not found"'; }

# ---- the machine
case $(uname -s 2>/dev/null) in
  Darwin)
    os="$(sw_vers -productName 2>/dev/null) $(sw_vers -productVersion 2>/dev/null) ($(sw_vers -buildVersion 2>/dev/null))"
    cpu=$(sysctl -n machdep.cpu.brand_string 2>/dev/null); cpus=$(sysctl -n hw.ncpu 2>/dev/null)
    ram=$(sysctl -n hw.memsize 2>/dev/null | awk '{ printf "%.0f GB", $1 / 1073741824 }') ;;
  *)
    os=$( (. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME") )
    cpu=$(grep -m1 'model name' /proc/cpuinfo 2>/dev/null | cut -d: -f2- | sed 's/^ *//')
    [ -n "$cpu" ] || cpu=$(lscpu 2>/dev/null | grep -m1 'Model name' | cut -d: -f2- | sed 's/^ *//')
    cpus=$(getconf _NPROCESSORS_ONLN 2>/dev/null || nproc 2>/dev/null)
    ram=$(awk '/^MemTotal/ { printf "%.0f GB", $2 / 1048576 }' /proc/meminfo 2>/dev/null) ;;
esac
or_nf() { [ -n "$1" ] && echo "$1" || echo "not found"; }

# ---- Claude Code: the settings that change what it does, key by key (never env values of a secret, never the account)
settings=$(nodejs '
const fs = require("fs"), [cc, home] = process.argv.slice(1);
const read = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } };
const secret = /key|token|secret|pass|auth|credential|cookie/i;
const clean = (s) => String(s).split(home).join("~").replace(/\/\/[^/@\s]+@/g, "//").replace(/[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "<email>");
const pick = (o) => {
  if (!o) return "not found";
  const out = {};
  for (const k of ["model", "autoUpdates", "autoUpdatesChannel", "alwaysThinkingEnabled", "effortLevel", "outputStyle", "includeCoAuthoredBy", "cleanupPeriodDays", "forceLoginMethod"])
    if (k in o) out[k] = typeof o[k] === "string" ? clean(o[k]) : o[k];
  if (o.permissions) out.permissions = { defaultMode: o.permissions.defaultMode ?? null,
    allow: (o.permissions.allow || []).map(clean), deny: (o.permissions.deny || []).map(clean), ask: (o.permissions.ask || []).map(clean) };
  if (o.env) out.env = Object.fromEntries(Object.entries(o.env).map(([k, x]) => [k, secret.test(k) ? "(set)" : clean(x)]));
  if (o.hooks) out.hooks = Object.keys(o.hooks);
  if (o.enabledPlugins) out.enabledPlugins = Object.keys(o.enabledPlugins);
  return out;
};
const app = read(cc + "/.claude.json") || {};
const managed = ["/Library/Application Support/ClaudeCode/managed-settings.json", "/etc/claude-code/managed-settings.json"].filter((p) => fs.existsSync(p));
console.log(JSON.stringify({ config_dir: clean(cc), settings: pick(read(cc + "/settings.json")),
  installMethod: app.installMethod ?? "not found", autoUpdates: app.autoUpdates ?? "not set",
  managed_settings: managed.length ? Object.fromEntries(managed.map((p) => [p, pick(read(p))])) : "none" }));
' "$cc" "$HOME")
# the arm's environment (env.sh): only these names, since whoever runs this script may have more of their own
envs=$(for n in CLAUDE_CONFIG_DIR DISABLE_AUTOUPDATER REELPLANNING_HOME REELPLANNING_SKILLS_DIR REELPLANNING_SKILLS_AGENTS; do
  eval "val=\${$n-}"; [ -n "$val" ] && printf '%s=%s\n' "$n" "$(printf '%s' "$val" | tilde | scrub)"; done)

# ---- ours: reelplanning, HyperFrames, the skills, the models
ours='"not used by this arm"'
if [ "$arm" = ours ]; then
  # npm keeps no commit for a package installed from git: the commit is the head of the branch it came from
  npmls=$(has npm && npm ls -g reelplanning --json 2>/dev/null | sed -n 's/.*"version": *"\([^"]*\)".*/reelplanning@\1/p' | head -n 1)
  branch=${REELPLANNING_BRANCH:-}
  head=$( [ -n "$branch" ] && has git && git ls-remote "${REELPLANNING_REPO:-https://github.com/ncrispino/ReelPlanning}" "$branch" 2>/dev/null | cut -f1 | head -n 1)
  skills=$(nodejs '
const fs = require("fs"), [dir, home] = process.argv.slice(1);
const locks = [home + "/.agents/.skill-lock.json", dir + "/../.skill-lock.json"].map((p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")).skills || {}; } catch { return {}; } });
let names = []; try { names = fs.readdirSync(dir).filter((n) => fs.existsSync(dir + "/" + n + "/SKILL.md")).sort(); } catch {}
console.log(JSON.stringify(Object.fromEntries(names.map((n) => { const l = locks.map((x) => x[n]).find(Boolean);
  return [n, l ? [l.source && !String(l.source).startsWith("/") ? l.source : l.sourceType, l.ref].filter(Boolean).join(" @ ") || "installed" : "installed"]; }))));
' "$cc/skills" "$HOME")
  models=$(ls "$HOME/.cache/hyperframes/tts/models" "$HOME/.cache/hyperframes/tts/voices" "$HOME/.cache/hyperframes/whisper/models" 2>/dev/null | grep -E '\.(onnx|bin)$')
  kokoro=$(has python3 && python3 -c 'import importlib.metadata as m; print(m.version("kokoro-onnx"))' 2>/dev/null)
  ours=$(printf '{"version": %s, "path": %s, "npm_ls": %s, "branch": %s, "branch_head": %s, "hyperframes": %s, "hyperframes_skills": %s, "skills": %s, "kokoro_onnx": %s, "models_on_disk": %s, "setup_dry_run": %s}' \
    "$(js "$(v reelplanning --version)")" "$(js "$( (command -v reelplanning || echo 'not found') | tilde)")" "$(js "$(or_nf "$npmls")")" \
    "$(js "${branch:-not given (REELPLANNING_BRANCH)}")" "$(js "$(or_nf "$head")")" "$(js "$(v reelplanning hyperframes --version)")" \
    "$(js "$(v reelplanning hyperframes-skills --dry-run)")" "$skills" "$(js "$(or_nf "$kokoro")")" "$(jsa "$models")" \
    "$(jsa "$(has reelplanning && reelplanning setup --dry-run 2>&1 </dev/null | tilde | scrub)")")
fi

printf '{\n'
printf '  "about": %s,\n' "$(js "What the $arm arm ran on (eval/case-studies/kit/provenance.sh), before it started; \"transcript\" is what its Claude Code transcripts say ran (reel case-study provenance).")"
printf '  "arm": %s,\n' "$(js "$arm")"
printf '  "recorded": %s,\n' "$(js "$(date '+%Y-%m-%dT%H:%M:%S%z' | sed -E 's/([+-][0-9]{2})([0-9]{2})$/\1:\2/')")"
printf '  "time_zone": %s,\n' "$(js "$(date '+%Z')")"
printf '  "machine": {"os": %s, "kernel": %s, "cpu": %s, "cpus": %s, "memory": %s},\n' "$(js "$(or_nf "$os")")" "$(js "$(v uname -srm)")" \
  "$(js "$(or_nf "$cpu")")" "$(js "$(or_nf "$cpus")")" "$(js "$(or_nf "$ram")")"
printf '  "tools": {"node": %s, "npm": %s, "python3": %s, "git": %s, "ffmpeg": %s},\n' "$(js "$(v node --version)")" "$(js "$(v npm --version)")" \
  "$(js "$(v python3 --version)")" "$(js "$(v git --version)")" "$(js "$(v ffmpeg -version)")"
printf '  "claude_code": {"version": %s, "path": %s, "started_with": %s, "model": %s, "config": %s, "env": %s},\n' \
  "$(js "$(v claude --version)")" "$(js "$( (command -v claude || echo 'not found') | tilde)")" "$(js "claude --model $model${more:+ $more}")" \
  "$(js "$model")" "$settings" "$(jsa "$envs")"
printf '  "reelplanning": %s\n' "$ours"
printf '}\n'
