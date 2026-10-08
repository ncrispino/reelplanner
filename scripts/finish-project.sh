#!/usr/bin/env bash
# After the frame workers have written compositions/frames/*.html and the narration is final:
# captions (sentence-level) → index → transitions (zoom-through scale-only) → clip-duration fix → local gsap → final voice slot → plan map → terms index → guide → details → check.
# usage: reelplanning finish-project <project-dir>   (or any HyperFrames project dir)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; P="${1:?usage: reelplanning finish-project <project-dir>}"
. "$ROOT/scripts/lib/project-dir.sh"; P_DIR="$(resolve_project "${P}")"
# HyperFrames' skills: ~/.agents/skills when `npx skills` installed them (every agent links there), else ~/.claude/skills
SK="$(hf_skills_dir)"; S="$SK/faceless-explainer/scripts"
export HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1 HYPERFRAMES_SKIP_SKILLS=1
# Every step below that is not ours runs a HyperFrames skill script out of the installed skills ($SK), and an
# upstream refresh (`hyperframes init`, `skills update`) can leave one importing a file that does not
# exist. Check them all before touching the project: the alternative is dying at step four, after the
# captions have already been rewritten, with the reason filtered out by a `| tail`.
node "$ROOT/scripts/hyperframes-skills.mjs" --check >/dev/null || { echo "✗ finish-project: not started — the HyperFrames skills above cannot load" >&2; exit 1; }
# Most steps pipe through grep/tail to keep the log short, which also swallows a crash. Name the
# step that failed so a stop is never just "Node.js v22" and an exit code.
# ($BASH_COMMAND would say only "tail -2" for a pipeline, so print the script's own line.)
trap 'echo "✗ finish-project stopped at line $LINENO: $(sed -n "${LINENO}p" "${BASH_SOURCE[0]}")" >&2' ERR
cd "$P_DIR"
node $S/captions.mjs build --storyboard ./STORYBOARD.md --audio-meta ./audio_meta.json --hyperframes . --out ./caption_groups.json | tail -1
node "$ROOT/scripts/captions-sentences.mjs" .
# captions.mjs build rewrites compositions/captions.html from scratch, so the fade fix is re-applied
# every time, or two captions overlap on nearly every boundary
node "$ROOT/scripts/caption-fades.mjs" .
node $S/assemble-index.mjs --storyboard ./STORYBOARD.md --hyperframes . 2>&1 | grep -v "injected data-width" | tail -2
node $S/transitions.mjs inject --storyboard ./STORYBOARD.md --hyperframes . | tail -1
# the theme bans blur, so a zoom-through is scale and opacity only (the motion language)
node "$ROOT/scripts/scale-only-zoom.mjs" . | tail -1
node "$ROOT/scripts/fix-clip-durations.mjs" .
# paper, so no black line shows at a sub-pixel gap in the player (node, not `sed -i`: macOS's sed reads -i differently)
node -e 'const fs=require("node:fs"),p="index.html",s=fs.readFileSync(p,"utf8"),n=s.replace(/^([ \t]*)background: #000;/gm,"$1background: #FAF9F5; /* paper, so no black line shows at a sub-pixel gap in the player */");if(n!==s)fs.writeFileSync(p,n)'
node "$ROOT/scripts/inject-theme.mjs" .
node $S/transitions.mjs verify --storyboard ./STORYBOARD.md --index ./index.html | tail -1
bash "$ROOT/scripts/vendor-gsap.sh" "$P_DIR"
node -e '
const fs=require("fs"); const meta=JSON.parse(fs.readFileSync("audio_meta.json","utf8")); const last=meta.voices[meta.voices.length-1];
let s=fs.readFileSync("index.html","utf8");
const re=new RegExp("(<audio[^>]*src=\"assets/voice/"+String(last.frame).padStart(2,"0")+"\\.wav\"[^>]*data-duration=\")[^\"]*(\")","s");
if(re.test(s)){ s=s.replace(re,"$1"+last.duration_s+"$2"); fs.writeFileSync("index.html",s); console.log("final voice slot →",last.duration_s+"s"); }
'
node "$ROOT/scripts/plan-map.mjs" "$P_DIR"
# which video explains each word, repo-wide (.reelplanning/terms-index.json): every storyboard's `- defines:`
node "$ROOT/scripts/terms-index.mjs" "$P_DIR"
# what moved since the last committed build, so the player can offer to play just those beats
# (`build --against <ref>` sets RP_PLAN_DIFF_AGAINST: another build to compare against than the last commit)
node "$ROOT/scripts/plan-diff.mjs" "$P_DIR" ${RP_PLAN_DIFF_AGAINST:+--against "$RP_PLAN_DIFF_AGAINST"}
# the video's guide (the plan guide, step 1): the page behind the video and the parts its scenes open over the frame,
# from plan.md (or an explainer's sources), after the plan map so it knows each scene's time; `build` checks it after
# verify has taken the scenes' pictures. A video with no plan or sources beside it has none.
node "$ROOT/scripts/guide.mjs" "$P_DIR" --quiet
# every page a beat opens (a `detail:` tag) exists, loads nothing from the network, carries the bridge
# and opens without an error; a video with no details passes without starting a browser
node "$ROOT/scripts/check-details.mjs" "$P_DIR"
cd "$P_DIR" && hf check 2>&1 | grep -v "✗ div >\|id_requires\|Fix:" | grep "^Lint\|^Runtime\|^Layout\|^Motion\|^Contrast\|error(s)\|◇\|✗" | head -40
