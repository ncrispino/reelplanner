#!/bin/sh
# arm.sh: one arm of the Bob Dylan case study on your own machine, with as little typed as we can
# (eval/case-studies/bob-dylan-site/RUNBOOK.md, "Locally"). Run it from your reelplanning checkout:
#
#   sh eval/case-studies/kit/arm.sh <arm>                      set up the arm (S1 to S5) and start its Claude Code here
#   sh eval/case-studies/kit/arm.sh <arm> stage <stage> start|end   from another terminal: a stage starts or ends
#   sh eval/case-studies/kit/arm.sh <arm> note "<text>"        from another terminal: anything else, with the time
#   sh eval/case-studies/kit/arm.sh <arm> done                 the arm is over: E1, E2, the transcript step, then a
#                                                              Claude Code session of your own that does the rest
#   sh eval/case-studies/kit/arm.sh ours snapshot              before a revise: keep ours's videos as they are now
#   sh eval/case-studies/kit/arm.sh status                     where each arm is
#   sh eval/case-studies/kit/arm.sh publish                    after the write-up: the study, its sites and review pages
#                                                              into the public case-study repo, served on GitHub Pages
#
# <arm> is text, html or ours. Each step is run again safely: a second run picks up where the first stopped.
# Any failure stops it with what failed. POSIX sh, for macOS and Linux.
#
# Test only: REEL_CS_SKIP_INSTALL=1 skips ours's install (S4); REEL_CS_RP_SRC is where npm installs
# reelplanning from; REEL_CS_WORKTREE is where the case-study worktree goes (default ../ReelPlanning-results), and
# when it is a checkout on a case-study branch already, the one used.
set -u

MODEL=${REEL_CS_MODEL:-claude-opus-5-5}        # the model every arm runs
BASE=claude/clever-knuth-b5gtcf                 # reelplanning's branch: ours installs it, the results branch starts from it
PREFIX=case-study/bob-dylan-                    # the results branch, with the first arm's date
STUDY=bob-dylan-site
# The repo $BASE lives in. For the case study already running, the private development repo, under its name today.
# Once the public ncrispino/reelplanning exists, all work happens there (D-310): a new case study uses
# DEV_REPO=ncrispino/reelplanning and BASE=main. A run in progress after the rename sets REEL_CS_DEV_REPO to the private
# repo's new name, since GitHub names ignore case and the old name then reaches the public repo, which has no $BASE.
DEV_REPO=${REEL_CS_DEV_REPO:-ncrispino/ReelPlanning}
RP_SRC=${REEL_CS_RP_SRC:-github:$DEV_REPO#$BASE}
ARMS_HOME=$HOME/reel-case-study                 # each arm's folder: ~/reel-case-study/<arm>
PUB_REPO=https://github.com/ncrispino/reelplanning-case-studies.git   # the public home: the study, its sites, its videos
PUB_SLUG=bob-dylan                              # its pages: <Pages URL>/bob-dylan/
STAGES="plan review revise build check-the-result fix done"

say() { printf '%s\n' "$*"; }
die() { printf '✗ %s\n' "$*" >&2; exit 1; }
has() { command -v "$1" >/dev/null 2>&1; }
now() { date '+%Y-%m-%d %H:%M:%S %z'; }
me="sh eval/case-studies/kit/arm.sh"

usage() {
  cat <<EOF
arm.sh: one arm of the Bob Dylan case study, on this machine (RUNBOOK.md, "Locally")

  $me <arm>                          set up the arm and start its Claude Code in this terminal
  $me <arm> stage <stage> start|end  a stage starts or ends (from another terminal)
  $me <arm> note "<text>"            a note with the time: your minutes, what you raised, /cost
  $me <arm> done                     the arm is over: keep the site, then a session that fills the sheet and pushes
  $me ours snapshot                  before each revise: keep ours's videos as they are now (their voice is not in git)
  $me status                         where each arm is
  $me publish                        after the write-up: everything into the public case-study repo, on GitHub Pages

<arm>: text, html or ours. <stage>: $STAGES.
EOF
}

# ---- where things are: this checkout, its case-study worktree, the arm's folder
kit=$(cd "$(dirname "$0")" && pwd) || die "cannot find the folder arm.sh is in"
has git || die "git is not installed"
common=$(cd "$kit" && cd "$(git rev-parse --git-common-dir 2>/dev/null)" 2>/dev/null && pwd) || die "arm.sh is not in a git checkout: run it from your reelplanning checkout"
main=$(dirname "$common")
[ -d "$main/eval/case-studies" ] || die "$main is not a reelplanning checkout"
WT_DEFAULT=${REEL_CS_WORKTREE:-$(dirname "$main")/ReelPlanning-results}

# the case-study worktree this checkout has, as "<branch>\t<path>" (the newest case-study branch), or REEL_CS_WORKTREE's
find_wt() {
  if [ -n "${REEL_CS_WORKTREE:-}" ] && [ -d "$REEL_CS_WORKTREE" ]; then
    b=$(git -C "$REEL_CS_WORKTREE" symbolic-ref -q --short HEAD 2>/dev/null)
    case $b in "$PREFIX"*) printf '%s\t%s\n' "$b" "$(cd "$REEL_CS_WORKTREE" && pwd)"; return ;; esac
  fi
  git -C "$main" worktree list --porcelain 2>/dev/null | awk -v p="refs/heads/$PREFIX" '
    /^worktree / { w = substr($0, 10) } /^branch / { b = substr($0, 8); if (index(b, p) == 1) print substr(b, 12) "\t" w }' | sort | tail -n 1
}
use_wt() {   # sets WT, BR and CS, or dies
  x=$(find_wt)
  [ -n "$x" ] || die "no case-study worktree yet: run \`$me <arm>\` first"
  BR=$(printf '%s' "$x" | cut -f1); WT=$(printf '%s' "$x" | cut -f2-)
  CS="$WT/eval/case-studies/$STUDY"
}
arm_paths() {
  case $1 in text|html|ours) ;; *) usage >&2; die "the arm is text, html or ours, not \"$1\"" ;; esac
  arm=$1; A="$ARMS_HOME/$arm"; SITE="$A/dylan-site"; STATE="$A/state"
  EXTRA=""; [ "$arm" = text ] && EXTRA="--permission-mode plan"
}
mark() { mkdir -p "$A" && printf '%s %s\n' "$1" "$(now)" >> "$STATE"; }
marked() { [ -f "$STATE" ] && grep -q "^$1 " "$STATE"; }
# the arm has started when its Claude Code has a transcript: a session was typed into
started() { [ -n "$(find "$A/claude/projects" -name '*.jsonl' 2>/dev/null | head -n 1)" ]; }
notes_file() { printf '%s' "$CS/arms/$arm/notes.md"; }
add_note() {
  f=$(notes_file); [ -d "$(dirname "$f")" ] || die "no $(dirname "$f"): is the worktree on the case-study branch?"
  [ -f "$f" ] || printf '# The %s arm: notes\n\nWhat happened as the arm ran, a line each with the time (`arm.sh %s stage …` and `arm.sh %s note …` add them).\nThe sheet (SHEET.md) is filled from these and the arm'"'"'s transcript when the arm is over.\n\n' "$arm" "$arm" "$arm" > "$f"
  printf '%s\n' "- $(now) · $*" >> "$f"
}
# run <what> <command…>: its output into the arm's setup.log; on failure, the end of it and stop
run() {
  what=$1; shift
  printf '%s\n$ %s\n' "== $what ($(now))" "$*" >> "$A/setup.log"
  if "$@" >> "$A/setup.log" 2>&1; then return 0; fi
  tail -n 20 "$A/setup.log" | sed 's/^/    /' >&2
  die "$what failed (all of it: $A/setup.log). Fix that, then run \`$me $arm\` again: it picks up here."
}

# ---- S1: the case-study worktree, on case-study/bob-dylan-<date> (reused by every arm)
s1() {
  say "S1. the case-study worktree"
  git -C "$main" fetch -q origin || die "git fetch origin failed in $main (your GitHub login?)"
  x=$(find_wt)
  if [ -n "$x" ]; then
    BR=$(printf '%s' "$x" | cut -f1); WT=$(printf '%s' "$x" | cut -f2-)
  else
    WT=$WT_DEFAULT
    [ -e "$WT" ] && die "$WT is there but is not this checkout's case-study worktree: move it away, then run this again"
    BR=$(git -C "$main" for-each-ref --format='%(refname:strip=2)' "refs/heads/$PREFIX*" | sort | tail -n 1)
    rb=$(git -C "$main" for-each-ref --format='%(refname:strip=3)' "refs/remotes/origin/$PREFIX*" | sort | tail -n 1)
    if [ -n "$BR" ]; then git -C "$main" worktree add -q "$WT" "$BR" || die "git worktree add $WT $BR failed"
    elif [ -n "$rb" ]; then BR=$rb; git -C "$main" worktree add -q --track -b "$BR" "$WT" "origin/$BR" || die "git worktree add for $BR failed"
    else
      git -C "$main" rev-parse -q --verify "refs/remotes/origin/$BASE" >/dev/null || die "no origin/$BASE in $main: is origin the reelplanning development repo ($DEV_REPO)?"
      BR="$PREFIX$(date +%F)"
      git -C "$main" worktree add -q -b "$BR" "$WT" "origin/$BASE" || die "git worktree add -b $BR failed"
    fi
  fi
  if git -C "$WT" rev-parse -q --verify '@{u}' >/dev/null 2>&1; then
    git -C "$WT" pull -q --ff-only || die "git pull in $WT failed: the branch $BR has moved on in a way that needs a merge; merge it there, then run this again"
  fi
  CS="$WT/eval/case-studies/$STUDY"
  [ -f "$CS/arms/$arm/prompt.txt" ] || die "no $CS/arms/$arm/prompt.txt: the worktree is not on a case-study branch made from $BASE"
  say "  ✓ $WT, on $BR"
}

# ---- S2: the arm's folder and its environment
s2() {
  say "S2. the arm's folder and its environment"
  mkdir -p "$A/claude" "$A/reelplanning" "$SITE" || die "cannot make $A"
  cat > "$A/env.sh" <<EOF
# The $arm arm's environment. Source it in every terminal for this arm: . $A/env.sh
export CLAUDE_CONFIG_DIR="$A/claude"               # its own Claude Code: login, settings, skills, transcripts
export REELPLANNING_HOME="$A/reelplanning"         # its own reviewer memory, empty
export REELPLANNING_SKILLS_DIR="$A/claude/skills"  # HyperFrames' skills, where this arm's Claude Code loads them
export REELPLANNING_SKILLS_AGENTS=claude-code
export DISABLE_AUTOUPDATER=1                       # the same Claude Code in every arm
cd "$A/dylan-site"
EOF
  say "  ✓ $A/env.sh"
}

# ---- S3: the empty folder: git init, the videos' media kept out of its history, the agent's git identity
s3() {
  say "S3. the empty folder"
  [ -d "$SITE/.git" ] || git -C "$SITE" init -q -b main 2>/dev/null || { git -C "$SITE" init -q && git -C "$SITE" symbolic-ref HEAD refs/heads/main; } || die "git init in $SITE failed"
  grep -q '^# reel case-study' "$SITE/.git/info/exclude" 2>/dev/null || cat "$CS/arms/$arm/site.exclude" >> "$SITE/.git/info/exclude" || die "cannot write $SITE/.git/info/exclude"
  git -C "$SITE" config user.name agent && git -C "$SITE" config user.email agent@localhost || die "git config in $SITE failed"
  say "  ✓ $SITE: git init, site.exclude, git identity agent <agent@localhost>"
}

# ---- S4, ours only: reelplanning, its skill and its tools, as a new user installs them
s4() {
  [ "$arm" = ours ] || return 0
  say "S4. reelplanning, its skill and its tools (10 to 20 minutes the first time)"
  if [ "${REEL_CS_SKIP_INSTALL:-}" = 1 ]; then say "  △ skipped (REEL_CS_SKIP_INSTALL=1: for testing arm.sh only)"; return 0; fi
  has npm || die "npm is not installed (Node 18 or later: nodejs.org, or brew install node)"
  # each part once: a second run skips what is marked done in $STATE
  ( . "$A/env.sh" && cd "$HOME" || exit 1
    if ! marked installed || ! has reelplanning; then
      from=$RP_SRC
      if ! npm i -g "$RP_SRC" >> "$A/setup.log" 2>&1; then
        # npm cannot reach the repo: clone it, install from the clone, delete the clone (no agent may find its .reelplanning/)
        say "  △ npm i -g $RP_SRC failed: installing from a clone instead"
        tmp=$(mktemp -d "${TMPDIR:-/tmp}/reelplanning-src-XXXXXX") || exit 1
        from="a clone of $BASE from $(git -C "$main" remote get-url origin)"
        git clone -q --depth 1 -b "$BASE" "$(git -C "$main" remote get-url origin)" "$tmp/reelplanning" >> "$A/setup.log" 2>&1 \
          && npm i -g --install-links "$tmp/reelplanning" >> "$A/setup.log" 2>&1; rc=$?; rm -rf "$tmp"
        [ $rc -eq 0 ] || { tail -n 20 "$A/setup.log" | sed 's/^/    /' >&2; die "npm i -g failed (all of it: $A/setup.log). If npm's global folder needs root, use sudo or a prefix of your own (docs/reference.md, Install); then run this again"; }
      fi
      has reelplanning || die "reelplanning is installed but not on PATH (npm's global bin: $(npm prefix -g)/bin): add it to PATH, then run this again"
      mark installed; say "  ✓ reelplanning $(reelplanning --version 2>/dev/null | head -n 1), from $from"
    fi
    if ! marked skill; then run "the skill (npx skills add)" npx -y skills add "$(npm root -g)/reelplanning" --skill plan-to-video -g -y -a claude-code; mark skill; say "  ✓ the plan-to-video skill"; fi
    if ! marked tools; then run "reelplanning setup" reelplanning setup; mark tools; say "  ✓ reelplanning setup"; fi
    if ! marked smoke; then
      sh "$CS/../kit/smoke.sh" > "$A/smoke.txt" 2>&1 || { sed 's/^/    /' "$A/smoke.txt" >&2; die "the smoke check failed: fix what it says, then run this again"; }
      mark smoke
    fi
    { say "\$ reelplanning --version"; reelplanning --version 2>&1 | head -n 1
      say "\$ sh smoke.sh"; cat "$A/smoke.txt"
      say "\$ ls \$CLAUDE_CONFIG_DIR/skills"; ls "$CLAUDE_CONFIG_DIR/skills"
      say "\$ git ls-remote origin $BASE"; git -C "$main" ls-remote origin "$BASE"; } > "$A/s4.txt" 2>&1
    sed 's/^/  /' "$A/s4.txt"
    for s in plan-to-video faceless-explainer media-use; do [ -e "$CLAUDE_CONFIG_DIR/skills/$s" ] || die "the skill $s is not in $CLAUDE_CONFIG_DIR/skills"; done
  ) || exit 1
}

# ---- S5: the preflight, the provenance, and the preflight's lines into the sheet
s5() {
  say "S5. the preflight and the provenance"
  pre=$( . "$A/env.sh" && sh "$CS/../kit/preflight.sh" 2>&1 )
  printf '%s\n' "$pre" | sed 's/^/  /'
  printf '%s\n' "$pre" | grep -q 'preflight:' || die "the preflight did not run (above)"
  bad=$(printf '%s\n' "$pre" | grep '^✗' | grep -v 'other repos or plans on disk' | grep -v '^✗ preflight:')
  [ -z "$bad" ] || die "the preflight has a ✗ line other than the repos on disk ($(printf '%s' "$bad" | head -n 1)): fix it (RUNBOOK.md, S5), then run this again"
  printf '%s\n' "$pre" > "$A/preflight.txt"
  prov="$CS/arms/$arm/provenance.json"
  # shellcheck disable=SC2086 # EXTRA is words
  ( . "$A/env.sh" && REELPLANNING_BRANCH=$BASE REELPLANNING_REPO=https://github.com/$DEV_REPO sh "$CS/../kit/provenance.sh" "$arm" "$MODEL" $EXTRA ) > "$prov.new" 2>> "$A/setup.log" \
    && node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$prov.new" 2>/dev/null \
    || { rm -f "$prov.new"; die "provenance.sh did not print JSON (see $A/setup.log)"; }
  mv "$prov.new" "$prov"
  sed 's/^/  /' "$prov"
  # the sheet: the preflight's lines in the first block under "Preflight", and for ours S4's in a second
  s4f=""; [ -f "$A/s4.txt" ] && s4f="$A/s4.txt"
  node -e '
const fs = require("fs"), [f, pre, s4] = process.argv.slice(1);
let t = fs.readFileSync(f, "utf8");
const i = t.indexOf("## Preflight"); if (i < 0) process.exit(3);
let j = t.indexOf("\n## ", i + 1); if (j < 0) j = t.length;
const block = (s) => "```text\n" + fs.readFileSync(s, "utf8").trim() + "\n```\n";
const intro = t.slice(i, j).replace(/```[a-z]*\n[\s\S]*?```\n*/g, "").trimEnd();
fs.writeFileSync(f, t.slice(0, i) + intro + "\n\n" + block(pre) + (s4 ? "\n" + block(s4) : "") + t.slice(j));
' "$CS/arms/$arm/SHEET.md" "$A/preflight.txt" "$s4f" || die "cannot write the preflight into $CS/arms/$arm/SHEET.md"
  say "  ✓ $prov, and the preflight's lines in arms/$arm/SHEET.md"
}

# ---- the arm's Claude Code, with its environment, in this terminal (exec: arm.sh ends here)
start_claude() {
  has claude || die "Claude Code is not installed (npm i -g @anthropic-ai/claude-code)"
  . "$A/env.sh" || die "cannot source $A/env.sh"
  # shellcheck disable=SC2086 # EXTRA and $1 are words
  exec claude --model "$MODEL" $EXTRA "$@"
}
# the first start: the prompt onto the clipboard (or printed), two lines on what to do, then Claude Code
start_arm() {
  has claude || die "Claude Code is not installed (npm i -g @anthropic-ai/claude-code)"
  p="$CS/arms/$arm/prompt.txt"
  if has pbcopy && pbcopy < "$p" 2>/dev/null; then where="on your clipboard"
  elif [ -n "${WAYLAND_DISPLAY:-}" ] && has wl-copy && wl-copy < "$p" >/dev/null 2>&1; then where="on your clipboard"
  elif [ -n "${DISPLAY:-}" ] && has xclip && xclip -selection clipboard < "$p" >/dev/null 2>&1; then where="on your clipboard"
  else
    where="printed above"
    say ""; say "---------- the prompt to paste (arms/$arm/prompt.txt) ----------"; cat "$p"; say "---------- end of the prompt ----------"
  fi
  mark started; add_note "Claude Code started (arm.sh)"
  say ""
  say "Next, in Claude Code: log in with your account, then trust this folder."
  say "Then paste the prompt ($where) and press Enter. Notes, from another terminal: sh $kit/arm.sh $arm note \"…\""
  [ "$where" = "printed above" ] && { printf 'Copy it, then press Enter to start Claude Code. '; read -r _ || true; }
  start_claude
}

setup() {
  marked done && die "the $arm arm is over (\`$me $arm done\` ran). To open its session again by hand: . $A/env.sh && claude --continue"
  if started; then
    use_wt
    say "The $arm arm has started already: its Claude Code starts again on its last session (--continue)."
    [ "$arm" = text ] && say "It starts in plan mode: shift+tab leaves it, if the plan was approved."
    add_note "Claude Code started again (arm.sh, --continue)"
    start_claude --continue
  fi
  say "Setting up the $arm arm (RUNBOOK.md, S1 to S5)"
  mkdir -p "$A" || die "cannot make $A"
  s1
  [ -f "$CS/arms/$arm/site.bundle" ] && die "the $arm arm has run already: its site is kept in $CS/arms/$arm/ (site.bundle). Nothing to set up; to finish it, \`$me $arm done\`"
  s2; s3; s4; s5
  marked setup || mark setup
  start_arm
}

# ---- the arm is over: E1, E2 and the transcript step, then a session of the owner's own for the rest
done_arm() {
  marked setup || die "the $arm arm was never set up: \`$me $arm\` first"
  use_wt
  [ -d "$SITE/.git" ] || die "$SITE has no .git: nothing to keep"
  ls "$A"/claude/projects/*/*.jsonl >/dev/null 2>&1 || die "no transcript in $A/claude/projects: did the arm's Claude Code run?"
  has node || die "node is not installed"
  say "E1. the site's last commit"
  if [ -n "$(git -C "$SITE" status --porcelain)" ]; then
    n=$(git -C "$SITE" status --porcelain | wc -l | tr -d ' ')
    git -C "$SITE" add -A && git -C "$SITE" commit -qm "The site at the end of the arm" || die "git commit in $SITE failed"
    add_note "E1: arm.sh committed what was left in the site ($n path(s)): \"The site at the end of the arm\""
    say "  ✓ committed $n path(s) left in the site"
  else say "  ✓ nothing left to commit"; fi
  git -C "$SITE" rev-parse -q --verify HEAD >/dev/null || die "$SITE has no commit: nothing to keep"
  say "E2. keep the site"
  head=$(git -C "$SITE" rev-parse HEAD); bundle="$CS/arms/$arm/site.bundle"
  if [ -f "$bundle" ] && git -C "$SITE" bundle list-heads "$bundle" 2>/dev/null | grep -q "^$head HEAD\$"; then
    say "  ✓ kept already, at $(printf '%.12s' "$head")"
  else
    mkdir -p "$CS/arms/$arm/site"
    rep=""; [ -n "$(ls -A "$CS/arms/$arm/site" 2>/dev/null)" ] && rep=--replace
    # shellcheck disable=SC2086
    ( cd "$WT" && node bin/reelplanning.mjs reel case-study keep "$STUDY" "$arm" "$SITE" $rep ) || die "reel case-study keep refused (above). Do what it says in $SITE, then run \`$me $arm done\` again"
  fi
  ( cd "$WT" && node bin/reelplanning.mjs reel case-study keep "$STUDY" --check ) || die "reel case-study keep --check failed (above)"
  say "E3. what the transcript says ran, into provenance.json"
  ( cd "$WT" && node bin/reelplanning.mjs reel case-study provenance "$STUDY" "$arm" "$A/claude/projects" --site "$SITE" ) || die "reel case-study provenance failed (above)"
  marked done || { mark done; add_note "the arm is over: arm.sh done (E1, E2, the transcript step)"; }

  others=$(for a in text html ours; do [ "$a" = "$arm" ] || printf '%s\n' "$a"; done | paste -sd ' ' - | sed 's/ / and /')
  prompt=$(cat <<EOF
You are finishing the $arm arm of reelplanning's Bob Dylan case study. You are a helper with the owner's own Claude Code, not the agent under test. You are in the case-study worktree ($WT), on the branch $BR. The steps are E3 to E6 of eval/case-studies/$STUDY/RUNBOOK.md, "When the arm is over": read that section and "The arms" for the $arm arm first. arm.sh has done E1 (the site's last commit), E2 (the site kept in arms/$arm/site/ and site.bundle, keep --check passed) and E3's transcript step (arms/$arm/provenance.json).

1. Read eval/case-studies/$STUDY/arms/$arm/notes.md: my notes, a line each with its time. Ask me in one message for what they lack: each of the seven stages' start and end (say which ones the transcript's timestamps would give, and ask me to confirm), my own minutes at each stage, what I raised at each stage and how, and what /cost showed. Wait for my answer, and add it to notes.md as lines of their own.
2. E3, the sheet (arms/$arm/SHEET.md; its preflight block is filled already): the table, from provenance.json and the notes, and each stage: the clock, my minutes and what I raised from the notes; the questions the agent asked and my answers, word for word, from the arm's transcript ($A/claude/projects/*/*.jsonl, one JSON line per message with its timestamp). From the transcript take only its metadata and the agent's questions and my answers.
3. E4, the site's screenshots (the same three screens at 390 x 844 and 1440 x 900, into arms/$arm/shots/site-phone-1.png ... site-desktop-3.png), and how to run the site into data/sites.json, the arm's "run". Run the site from a clone ("git clone $SITE <a temp folder>"), so nothing is added to $SITE; delete the clone afterwards. Screens that need a tap or a scroll first: ask me.
4. E5, the links in data/links.json under the arm, each { "kind", "label", "href" }: the commit on the branch (after step 5)$( [ "$arm" = ours ] && printf ', and the review page once it has a link' ).
5. E6: commit the arm's folder and the data files with the message "Bob Dylan case study, $arm: the finished site", then "git push -u origin HEAD". Then add the commit's link to data/links.json, commit that and push again. Tell me the commit you pushed.

Rules:
- Read only this arm: never read arms/ of another arm ($others), ~/reel-case-study/ of another arm, eval/case-studies/$STUDY/FEEDBACK.md, or the repo's .reelplanning/.
- Change only eval/case-studies/$STUDY/arms/$arm/ and the $arm entries in eval/case-studies/$STUDY/data/. Leave $A/ as it is (it stays on disk until the write-up).
- Commit and push only to $BR, never with force. Never touch $BASE: no push, merge, rebase or checkout of it, and no change in the checkout at $main.
- If a step fails, stop and tell me what failed and what it printed; don't work around it.
EOF
)
  printf '%s\n' "$prompt" > "$A/done-prompt.txt"
  has claude || die "Claude Code is not installed; the prompt for the rest is in $A/done-prompt.txt"
  # your own Claude Code, not the arm's: drop the arm's environment if this terminal has it
  case ${CLAUDE_CONFIG_DIR:-} in "$ARMS_HOME"/*) unset CLAUDE_CONFIG_DIR REELPLANNING_HOME REELPLANNING_SKILLS_DIR REELPLANNING_SKILLS_AGENTS DISABLE_AUTOUPDATER ;; esac
  say ""
  say "Now a Claude Code session of your own, in the worktree, does E3 to E6 (its prompt: $A/done-prompt.txt)."
  say "It asks you first for what your notes lack: your minutes, what you raised, what /cost showed."
  cd "$WT" || die "cannot cd to $WT"
  exec claude "$prompt"
}

# ---- notes from another terminal
note() {
  [ $# -gt 0 ] && [ -n "$*" ] || die "usage: $me $arm note \"<text>\""
  use_wt; add_note "$*"; say "✓ $(tail -n 1 "$(notes_file)")"
}
stage() {
  name=$(printf '%s' "${1:-}" | tr ' ' '-'); what=${2:-}
  [ "$name" = check ] && name=check-the-result
  case " $STAGES " in *" $name "*) ;; *) die "usage: $me $arm stage <stage> start|end   (<stage>: $STAGES)" ;; esac
  case $what in start|end) ;; *) die "usage: $me $arm stage $name start|end" ;; esac
  n=$(printf '%s\n' $STAGES | grep -nx "$name" | cut -d: -f1)
  use_wt; add_note "stage $n, $(printf '%s' "$name" | tr '-' ' '): $what"; say "✓ $(tail -n 1 "$(notes_file)")"
}

status() {
  x=$(find_wt)
  if [ -n "$x" ]; then BR=$(printf '%s' "$x" | cut -f1); WT=$(printf '%s' "$x" | cut -f2-); CS="$WT/eval/case-studies/$STUDY"
    say "The Bob Dylan case study: $WT, on $BR"
  else BR=""; WT=""; CS=""; say "The Bob Dylan case study: no case-study worktree yet"; fi
  for a in text html ours; do
    arm_paths "$a"
    pushed=""; [ -n "$BR" ] && pushed=$(git -C "$WT" log -1 --format=%h --fixed-strings --grep="Bob Dylan case study, $a: the finished site" "refs/remotes/origin/$BR" 2>/dev/null)
    if [ -n "$pushed" ]; then s="pushed ($pushed)"
    elif marked done; then s="done (not pushed yet)"
    elif started; then s=running
    elif marked setup; then s="set up"
    elif [ -d "$A" ]; then s="not started (set up halfway: run \`$me $a\` again)"
    else s="not started"; fi
    last=""; [ -n "$CS" ] && [ -f "$CS/arms/$a/notes.md" ] && last=$(grep '^- ' "$CS/arms/$a/notes.md" | tail -n 1 | sed 's/^- //')
    printf '  %-5s %s%s\n' "$a" "$s" "${last:+   (last note: $last)}"
  done
}

# ---- ours's videos as they are now. A revise rebuilds them in place, and their voice is kept out of git (D-305),
# so a version not snapshotted cannot be played again as it was. Each snapshot is v1, v2 … in ~/reel-case-study/ours/
# snapshots/: the video folders and .reelplanning's own files (the decision log at that time), and the site's commit.
snapshot() {
  [ "$arm" = ours ] || die "only the ours arm makes videos: \`$me ours snapshot\`"
  [ -d "$SITE/.reelplanning" ] || die "no $SITE/.reelplanning yet: nothing to snapshot"
  n=1; while [ -e "$A/snapshots/v$n" ]; do n=$((n + 1)); done
  d="$A/snapshots/v$n"; mkdir -p "$d/.reelplanning" || die "cannot make $d"
  found=0
  for v in "$SITE"/.reelplanning/plans/*/video "$SITE"/.reelplanning/plans/*/walkthrough-video "$SITE"/.reelplanning/system-video; do
    [ -f "$v/index.html" ] || continue
    rel=${v#"$SITE"/}; mkdir -p "$d/$(dirname "$rel")" && cp -R "$v" "$d/$rel" || die "cannot copy $v"
    found=$((found + 1))
  done
  [ "$found" -gt 0 ] || { rm -r "${d:?}"; die "no built video in $SITE/.reelplanning yet: nothing to snapshot"; }
  for f in "$SITE"/.reelplanning/*; do [ -f "$f" ] && cp "$f" "$d/.reelplanning/"; done
  git -C "$SITE" rev-parse HEAD > "$d/site-commit" 2>/dev/null || true
  use_wt; add_note "snapshot v$n of ours's videos ($found video(s)): ~/reel-case-study/ours/snapshots/v$n"
  say "✓ v$n: $found video(s) in $d"
}

# ---- after the write-up: the study into the public case-study repo, and its pages (GitHub Pages, from main's docs/):
# P1 the study folder as committed on the results branch → <repo>/bob-dylan-site/; P2 ours's review pages, the last
# build and each snapshot, with their voice → docs/bob-dylan/review/ and review-v1/ …; then a Claude Code session of
# your own builds each arm's site into docs/bob-dylan/<arm>/, writes the landing pages, commits and pushes.
publish() {
  use_wt
  PUB=${REEL_CS_PUBLIC:-$(dirname "$main")/reelplanning-case-studies}
  if [ ! -d "$PUB/.git" ]; then git clone -q "$PUB_REPO" "$PUB" || die "cannot clone $PUB_REPO into $PUB (does the repo exist?)"; fi
  [ -z "$(git -C "$PUB" status --porcelain)" ] || die "$PUB has changes not committed: commit or drop them first"
  git -C "$PUB" pull -q --ff-only 2>/dev/null || true
  # a new, empty repo has no branch yet: start main, the branch Pages serves
  git -C "$PUB" rev-parse -q --verify HEAD >/dev/null || git -C "$PUB" checkout -q -B main || die "cannot start main in $PUB"
  [ "$(git -C "$PUB" symbolic-ref -q --short HEAD)" = main ] || die "$PUB is not on main: git -C $PUB checkout main"
  has tar || die "tar is not installed"

  say "P1. the study, as committed on $BR"
  [ -z "$(git -C "$WT" status --porcelain -- "eval/case-studies/$STUDY")" ] || die "$CS has changes not committed: commit and push them on $BR first"
  rm -rf "${PUB:?}/${STUDY:?}"
  git -C "$WT" archive HEAD "eval/case-studies/$STUDY" | tar -x -C "$PUB" --strip-components=2 || die "cannot copy the study into $PUB"
  say "  ✓ $PUB/$STUDY ($(git -C "$WT" rev-parse --short HEAD) on $BR)"

  say "P2. ours's review pages"
  O="$ARMS_HOME/ours/dylan-site"; pages=""
  if [ -d "$O/.reelplanning" ]; then
    for src in "$O" "$ARMS_HOME"/ours/snapshots/v*; do
      [ -d "$src/.reelplanning" ] || continue
      case $src in "$O") name=review ;; *) name=review-$(basename "$src") ;; esac
      set --; for v in "$src"/.reelplanning/plans/*/video "$src"/.reelplanning/plans/*/walkthrough-video "$src"/.reelplanning/system-video; do [ -f "$v/index.html" ] && set -- "$@" "$v"; done
      [ $# -gt 0 ] || continue
      ( cd "$WT" && node bin/reelplanning.mjs bundle-player "$PUB/docs/$PUB_SLUG/$name" "$@" --reelplanning "$src/.reelplanning" ) >/dev/null || die "bundle-player failed for $src"
      pages="$pages $name"; say "  ✓ docs/$PUB_SLUG/$name ($# video(s), from ${src#"$ARMS_HOME"/})"
    done
  else say "  - ours's site is not on this machine ($O): its review pages are skipped; run publish again where ours ran"; fi
  mkdir -p "$PUB/docs" && : > "$PUB/docs/.nojekyll" || die "cannot write $PUB/docs"

  prompt=$(cat <<EOF
You are publishing reelplanning's Bob Dylan case study. You are a helper with the owner's own Claude Code. You are in $PUB, a clone of $PUB_REPO, whose GitHub Pages serves main's docs/ folder. arm.sh has copied the study into $STUDY/ (as committed on $BR of the reelplanning repo) and packed ours's review pages into docs/$PUB_SLUG/:${pages:- none}.

1. Each arm's finished site into docs/$PUB_SLUG/<arm>/ (text, html, ours; skip an arm with no $STUDY/arms/<arm>/site/ and say so): clone $STUDY/arms/<arm>/site.bundle into a temp folder, build it as $STUDY/data/sites.json's "run" for that arm says, and copy only the static output (built files, or the site's own files when it has no build) into docs/$PUB_SLUG/<arm>/. It must work under that path: fix absolute asset paths with the build tool's base-path option (e.g. Vite's --base), never by editing the site's source. Open each built copy in a browser at 390 x 844 and 1440 x 900 from a local static server rooted at docs/, and check the first screens load with no console errors. Delete the temp folders.
2. docs/$PUB_SLUG/index.html: $STUDY/case-study.html when it exists (rewrite its links so they work from there); otherwise a short plain page: one paragraph on the study from $STUDY/README.md, and links to the three sites and the review pages, each with one line on what it is. docs/index.html: a plain list of the case studies (only this one for now), linking docs/$PUB_SLUG/.
3. README.md at the root: what this repo is (case studies for reelplanning, https://github.com/ncrispino/reelplanning), the Pages links, and the folder layout. Plain words; "reelplanning" is lowercase.
4. Commit with the message "Bob Dylan case study: the study, its sites and review pages" and push: "git push -u origin main" (no force). If it is the repo's first push, tell me to turn on Pages: Settings → Pages → Deploy from a branch, main, /docs. Tell me the Pages URLs (https://ncrispino.github.io/reelplanning-case-studies/ and /$PUB_SLUG/…), and anything that did not build.

Rules: change only $STUDY/'s case-study.html links (if any), docs/ and README.md; never edit the sites' source or the study's data. No secrets, keys, emails or transcripts in what you commit: check git diff --cached for them before the commit. If a step fails, stop and tell me what failed and what it printed.
EOF
)
  printf '%s\n' "$prompt" > "$ARMS_HOME/publish-prompt.txt"
  has claude || die "Claude Code is not installed; the prompt for the rest is in $ARMS_HOME/publish-prompt.txt"
  case ${CLAUDE_CONFIG_DIR:-} in "$ARMS_HOME"/*) unset CLAUDE_CONFIG_DIR REELPLANNING_HOME REELPLANNING_SKILLS_DIR REELPLANNING_SKILLS_AGENTS DISABLE_AUTOUPDATER ;; esac
  say ""
  say "Now a Claude Code session of your own, in $PUB, builds the sites and pushes (its prompt: $ARMS_HOME/publish-prompt.txt)."
  cd "$PUB" || die "cannot cd to $PUB"
  exec claude "$prompt"
}

case ${1:-} in
  "") usage; exit 2 ;;
  -h|--help|help) usage ;;
  status) status ;;
  publish) publish ;;
  *) arm_paths "$1"; shift
     case ${1:-} in
       "") setup ;;
       note) shift; note "$@" ;;
       stage) shift; stage "$@" ;;
       done) done_arm ;;
       snapshot) snapshot ;;
       *) usage >&2; die "unknown: $1" ;;
     esac ;;
esac
