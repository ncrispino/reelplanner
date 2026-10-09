# Two runs of the draft preflight (2026-09-26)

The draft `preflight.sh` beside this file, run twice on the machine this plan was written on. Step 1
builds the real one from it; the plan video's scene 5 shows these two runs.

**Only a fresh home folder** (an empty `~/dylan-site` with `git init`, `HOME` set to a new folder):

```
$ HOME=$(realpath ..) sh ../preflight.sh
✓ folder ~/dylan-site: empty (git init only)
✓ no CLAUDE.md or AGENTS.md above it
✓ no ~/.claude/CLAUDE.md
✓ no ~/.reelplanning/you.jsonl: memory starts empty
✓ no past sessions
✗ 9 other repos or plans on disk: /home/user/ReelPlanning/.git /home/user/ReelPlanning/.reelplanning …
✗ preflight: stop, and start this arm again
```

**An isolated run** (`bwrap`: the system folders read-only, a new empty home at `/home/agent`, and only the
empty `~/dylan-site` mounted; the stand-in for the arm's container, since this machine has no Docker
daemon):

```
$ sh /opt/preflight.sh
✓ folder ~/dylan-site: empty (git init only)
✓ no CLAUDE.md or AGENTS.md above it
✓ no ~/.claude/CLAUDE.md
✓ no ~/.reelplanning/you.jsonl: memory starts empty
✓ no past sessions
✓ no other repos, plans or plan pages on disk
✓ preflight: nothing to read but the prompt
```

The isolated run, in full:

```
bwrap --ro-bind /usr /usr --symlink usr/bin /bin --symlink usr/lib /lib --symlink usr/lib64 /lib64 \
  --symlink usr/sbin /sbin --ro-bind /etc /etc --proc /proc --dev /dev --tmpfs /tmp --tmpfs /home/agent \
  --bind "$PWD/site" /home/agent/dylan-site --ro-bind "$PWD/preflight.sh" /opt/preflight.sh \
  --chdir /home/agent/dylan-site --setenv HOME /home/agent --unshare-all --uid 1000 --gid 1000 \
  sh /opt/preflight.sh
```
