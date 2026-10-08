# HTML plan baseline: the prompt

Claude Code has no "HTML plan" setting, so this baseline is a prompt asking for one. It follows
[The Unreasonable Effectiveness of HTML](https://thariqs.github.io/html-effectiveness/): ask the agent
for a self-contained `.html` file instead of Markdown, so the plan is laid out in space rather than
read as a wall of text. Its implementation-plan example
([16-implementation-plan.html](https://thariqs.github.io/html-effectiveness/16-implementation-plan.html))
is "milestones on a timeline, a data-flow diagram, inline mockups, the risky code, and a risk table —
the plan you hand off", made from this prompt (verbatim from that page):

> Create a thorough implementation plan for adding threaded comments to task cards. Include mockups,
> the data flow from client to persistence, the key code I'll need to write, and a risk table. Make it
> easy to skim on a phone — I'm going to pass this to the implementer as-is.

The prompt below is [`../prompt.md`](../prompt.md) unchanged, then one paragraph in that example's
words. It produced [`html-plan.html`](html-plan.html), kept as written but for one line: its footer named the
reviewer by their email address, which now reads "the plan's owner".

## The prompt, exactly as sent

```text
Build an interactive website about Bob Dylan. I want someone to be able to explore his life and music — the different eras, the albums, the songs and how they connect — in a way that's more engaging than reading a Wikipedia article, and it should work well on a phone. Start from scratch in this empty folder.

Before writing any code, create a thorough implementation plan for this as a single self-contained HTML file, plan.html, instead of markdown. Include milestones on a timeline, a diagram of how the pieces fit together and how data flows through them, inline mockups of the main screens, the key code I'll need to write, and a risk table. Make it easy to skim on a phone — I'm going to review it in a browser and pass it to the implementer as-is. Don't build the site yet: plan.html is the only file to write.
```

## How it was run

```sh
P="$(cat eval/bob-dylan-site/prompt.md)

<the second paragraph above>"
cd "$(mktemp -d)" &&
  claude -p --permission-mode acceptEdits --no-session-persistence --output-format stream-json --verbose "$P"
```

- **Date:** 2026-09-25 (00:49 UTC). **CLI:** Claude Code 2.1.282, model claude-sonnet-5 (the CLI default
  in the cloud container it ran in). An empty directory with no CLAUDE.md above it.
- `acceptEdits`, not plan mode: plan mode can only write its own Markdown plan file, and the article's
  workflow is an ordinary session that writes the `.html`. It wrote `plan.html` only (no scripts, no
  external requests), checked its tags balance, and stopped. 7 turns, ~5 min, $0.58.
- Seen on a 390 px viewport: it renders, but the page is 416 px wide (a 26 px sideways scroll). Kept as is.
- What it printed at the end, verbatim:

  > All tags balance correctly. The plan is written to `plan.html` in the project folder — ready to open in a browser.
  >
  > It covers: goals/principles, the era→album→song→connections exploration model, an architecture diagram (data.js → router/state → 5 view renderers → DOM, with a feedback loop), a data-flow diagram (6-step loop), an 8-phase/16-day milestone timeline with expandable deliverables, four phone-mockup screens (Home/Timeline, Song sheet, Connections web, Search), the four key code pieces (data schema, router, graph layout, mobile CSS), a proposed file tree, a responsive risk table (cards on mobile), and an open-questions list for you to weigh in on before Phase 1 (hosting target, inline vs. link-out audio, exact song/era picks). No other files were created — the actual site build hasn't started.
