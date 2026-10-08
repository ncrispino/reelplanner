# The blind judge

A fresh agent scores the three finished sites on the rubric without knowing which arm made which. The
prompt it gets is at the end of this page. It sees only the three sites, as X, Y and Z.

## Getting the three sites ready (you, or an agent that is not the judge)

1. Pick the order at random, and write the key down where the judge can't see it:

   ```bash
   printf '%s\n' text html ours | sort -R | awk '{ print substr("XYZ", NR, 1), $0 }' > ~/case-study-key.txt
   ```

2. From the folder you ran `reel case-study` in, copy each site, take out everything that names an arm, and
   squash its history to one commit:

   ```bash
   mkdir -p ~/judge && while read letter arm; do
     cp -R "{{dir}}/arms/$arm/site" ~/judge/$letter
     cd ~/judge/$letter
     rm -rf .git .reelplanning plan.html report.html CLAUDE.md AGENTS.md
     find . -iname '*plan*.md' -delete        # the plan files, of any arm
     git init -q && git add -A && git commit -qm "the site"
     cd - >/dev/null
   done < ~/case-study-key.txt
   ```

3. Look through the three folders by eye (`grep -ri "plan\|reelplanning\|review" ~/judge`) for anything
   left that names an arm, and take it out.
4. Start the judge in a fresh session that holds only `~/judge` (the arm's container, with `~/judge`
   mounted instead of `site/`, does this; on your own machine, a Claude Code config of its own, as for an
   arm: `cd ~/judge && CLAUDE_CONFIG_DIR=~/judge-claude claude --model claude-opus-5-5`), and give it the
   prompt below, with `RUBRIC.md` pasted in.
5. When its scores are in, save its answer as `data/judge.json`, then write the key into `data/key.json`.
   Write your own ranking into `data/ranking.json` before you read the judge's.

## The prompt

```text
Three folders, X, Y and Z, each hold a website built from the same request:

<paste prompt.md here>

For each site, in turn:
1. Run it (read its files to see how) and open it in a browser.
2. Take screenshots at 390 px wide (a phone) and at 1440 px wide (a desktop): the first screen, and two
   more that show what the site is for. Save them as judge-shots/<X|Y|Z>-phone-1.png and so on.
3. Score it on each of the five measures of the rubric below, 1 to 5, with one line of evidence per
   score: what you did and what you saw. For "facts right", list the ten facts and the source for each.

Then rank the three, best first, with your reasons in a few lines.

Judge only what is in the folders. Don't guess how a site was made.

Answer with this JSON and nothing else:
{"measures": ["asked", "engaging", "phone", "facts", "change"],
 "sites": {"X": {"scores": {"asked": {"score": 1-5, "evidence": "..."}, ...}}, "Y": {...}, "Z": {...}},
 "ranking": ["X", "Y", "Z"],
 "reasons": "..."}

The rubric:

<paste RUBRIC.md here>
```
