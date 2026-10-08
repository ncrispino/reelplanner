# A Style Guide for AI-Generated "Plan Videos": Evidence-Based Design for 60–120s Educational Explainers of Implementation Plans

> The research brief the style guide started from. Its lengths are no longer the rule: a plan video is now a
> series of parts of about a minute, 3–5 minutes in all ([style guide §1](../skills/plan-to-video/references/style-guide.md);
> why it changed: [design notes](design-notes.md#length-from-one-video-to-a-series-of-parts)).

## Key Numbers Summary Table

| Metric | Value | Source |
|---|---|---|
| Median engagement time for any MOOC video length | ≤6 minutes | Guo, Kim & Rubin 2014 (6.9M sessions) |
| Engagement for videos <6 min | ~100% watched (median) | Guo et al. 2014 |
| Engagement for 9–12 min videos | ~50% watched (median) | Guo et al. 2014 (via Brame 2016) |
| Engagement for 12–40 min videos | ~20% watched (median) | Brame 2016 |
| Speaking rate range studied | 48–254 wpm (mean 156, sd 31) | Guo et al. 2014 |
| Engagement effect of speaking rate | Up to 2× higher for fastest speakers | Guo et al. 2014 |
| Recommended conversational-style speaking range | 185–254 wpm | Brame 2016 |
| Problem-attempt rate: talking-head vs other (6.00x) | 46% vs 33% | Guo et al. 2014 |
| Problem-attempt rate: Khan-style vs other tutorials | 40% vs 31% | Guo et al. 2014 |
| Temporal contiguity effect size | g = 0.74 (large) | Noetel et al. 2022 |
| Signaling/cueing effect size | g = 0.38 (medium); g < 0.2 pooled meta-meta | Alpizar 2020 / Noetel 2022 |
| Segmentation effect size | g = 0.32–0.36 | Rey et al. 2019 |
| Coherence / seductive-details effect | g = −0.37 to −0.41 (harmful) | Sundararajan & Adesope 2020 |
| Voice principle effect | d = 0.23 | Castro-Alonso 2021 |
| ReelsEd short-form vs long-form quiz score | 93.85% vs 79.72% (p=0.0001) | Stavrinou et al. 2025 |
| Fireship "100 Seconds" spoken pace | ~210–220 wpm (channel target 200–250) | Transcript word-count |
| Code-review defect-detection cliff | 200–400 LOC; 87% detection <100 lines vs 28% >1,000 lines | SmartBear/Cisco (2,500 reviews, 3.2M LOC) |
| Reviewer focus-fatigue onset | ~60 minutes | SmartBear/Cisco 2006 |

---

## TL;DR

- **Cap the video at 60–90 seconds, segment it into one-idea beats of 5–15 seconds each, and let the voice explain *why* while the visuals show *what* — never duplicate the narration as on-screen paragraphs.** These three moves are the most strongly evidenced levers: shorter videos massively increase completion (Guo et al. 2014), segmentation and temporal contiguity carry medium-to-large learning effect sizes (Noetel et al. 2022), and redundant on-screen text overloads the visual channel (Mayer's redundancy principle).
- **Structure the plan video like the best explainers do: open with a curiosity-gap or misconception hook, show why the obvious approach fails, build the plan one step per beat with signaling/highlighting, callback to the hook, then end on an explicit open question that invites the reviewer to annotate.** This mirrors Veritasium's evidence-based "misconception-first" method, 3Blue1Brown's "concrete example before abstraction," and Loewenstein's information-gap theory of curiosity.
- **Distinguish strong evidence from folklore.** Length, segmentation, contiguity, conversational tone, and signaling are backed by meta-analyses and a 6.9M-session study. Claims like "3 scene changes in 3 seconds," specific "dopamine" stats, and the "8-second attention span" are creator folklore or debunked marketing claims — usable at most as loose heuristics and flagged as such.

---

## Part 1 — Literature Review

### 1.1 Guo, Kim & Rubin (2014): "How Video Production Affects Student Engagement"

This is the single largest empirical study of educational-video engagement: **6.9 million video-watching sessions across four edX MOOCs** (MIT 6.00x Intro CS, Harvard PH207x Statistics, Berkeley CS188.1x AI, MIT 3.091x Chemistry), 862 videos, 127,839 students, Fall 2012. Engagement was measured two ways: (1) how long students watched (session length), and (2) whether they attempted a post-video assessment problem. The seven main findings:

1. **Shorter videos are much more engaging — the dominant factor.** "Video length was by far the most significant indicator of engagement." Median engagement time was **at most 6 minutes regardless of total length.** For the shortest videos (0–3 min), 75% of sessions lasted over three-quarters of the video; students often made it less than halfway through videos longer than 9 minutes. Problem-attempt rates fell monotonically with length across five length buckets: **56%, 48%, 43%, 41%, 31%.** Recommendation: segment into chunks under 6 minutes; the effect of length otherwise overwhelms all other production factors.

2. **Talking head interspersed with slides/code beats slides alone.** Videos alternating the instructor's face with content were significantly more engaging (p ≪ 0.001, Mann-Whitney U). In 6.00x, students attempted **46% of problems after talking-head videos vs 33% for other videos.**

3. **High production value may not matter; personal feel does.** 6.00x (filmed informally at the instructor's office desk) got roughly **2× engagement on 6–12 min videos and ~3× on >12 min videos** compared to PH207x (multi-million-dollar TV studio). Producers attributed this to "personalization" — the student feeling the video is aimed directly at them.

4. **Khan-style tablet drawing beats PowerPoint/code screencasts for tutorials.** Students engaged **1.5×–2× as long** with Khan-style tutorials; **40% problem-attempt vs 31%** for other tutorials. The continuous drawing motion and "bar napkin" informality mattered.

5. **Pre-production planning matters.** Lectures planned for the online format (CS188.1x) outperformed chopped-up pre-existing classroom recordings (3.091x): **55% vs 41% problem-attempt.**

6. **Faster speaking + enthusiasm increases engagement.** Speaking rates ranged **48–254 wpm (mean 156, sd 31).** Within a length band, engagement usually increased — up to 2× — with speaking rate. The fastest speakers (254 wpm) were still fully comprehensible because visuals carried the same info. Crucially, speaking rate is "merely a surface feature that correlates with enthusiasm" — the recommendation is to bring out enthusiasm and edit out filler/pauses, not to force artificial speed.

7. **Students engage differently with lectures vs tutorials.** Students watched only 2–3 minutes of tutorials regardless of length, and re-watched/paused tutorials far more than lectures (tutorials contain discrete step-by-step landmarks). Recommendation: optimize lectures for first-watch; support skimming/re-watching in tutorials with signposts. **Highly relevant to plan videos**, which are hybrid lecture-tutorials — a reviewer will treat them like tutorials, jumping to specific steps.

**Limitations the authors flag:** retrospective (not controlled); all four courses were math/science; engagement proxies can't detect background/multitasking playback; engagement is necessary but not sufficient for learning.

### 1.2 Brame (2016): "Effective Educational Videos"

Brame synthesizes the literature into three levers with concrete guidelines:

**(A) Manage cognitive load** (Sweller; Mayer & Moreno's dual-channel theory — separate visual/pictorial and auditory/verbal channels, each limited). Four practices:
- **Signaling** (cueing): on-screen text/symbols/color/contrast/arrows to highlight key info; reduces extraneous load and increases germane load (Mayer & Moreno 2003; deKoning 2009; Ibrahim 2012).
- **Segmenting**: chunk into short videos and click-forward pauses; manages intrinsic load.
- **Weeding**: eliminate extraneous music, complex backgrounds, decorative features. What is "extraneous" depends on learner expertise.
- **Matching modality**: use both channels with *complementary* information (animation + narration), not redundant. A "talking head" explaining a complex process uses only the verbal channel; a Khan-style sketch uses both.

**(B) Maximize engagement:**
- **Keep it brief** (cites Guo: near-100% for <6 min, ~50% at 9–12 min, ~20% at 12–40 min; max median engagement = 6 min).
- **Conversational language** (Mayer's personalization principle — "large effect on learning"): use "you" and "I."
- **Speak fairly fast with enthusiasm** — Brame explicitly cites the **185–254 wpm** range.
- **Emphasize relevance** to the learner's specific context.

**(C) Promote active learning:** interpolated questions (Szpunar 2013 — reduced mind-wandering, better test performance), interactive controls/chapters (Zhang 2006), guiding questions (Lawson 2006 — students given guiding questions scored significantly higher), and embedding video in a larger assignment.

### 1.3 Mayer's multimedia principles & Noetel meta-analyses (effect sizes)

Noetel et al. (2022), "Multimedia Design for Learning: An Overview of Reviews with Meta-Meta-Analysis" (*Review of Educational Research*), synthesized **29 reviews, 1,189 studies, 78,177 participants.** They found **11 design principles with significant positive learning effects** and 5 that improved cognitive-load management. "The largest benefits were for captioning second-language videos, temporal/spatial contiguity, and signaling." Effect sizes compiled across the recent meta-analyses:

- **Temporal/spatial contiguity: g = 0.74 (large)** — present corresponding words and pictures at the same time and place.
- **Multimedia principle (text + diagrams): g = 0.39.**
- **Signaling/cueing: g = 0.38** (Alpizar et al. 2020) — but the pooled meta-meta estimate was small (**g < 0.2**), so signaling helps but is context-dependent.
- **Segmentation: g = 0.32–0.36** (Rey et al. 2019).
- **Coherence / seductive details: g = −0.37 to −0.41** — adding interesting-but-irrelevant material *harms* learning. This is the strongest caution against "motion for its own sake" and decorative flourishes.
- **Emotional design: g = 0.27–0.35.**
- **Voice principle: d = 0.23** — human/natural voice beats machine voice (modestly).
- **Embodiment: g = −0.30 to 0.09; immersion: d = 0.12** (small/unreliable).

The key principles for plan videos: **modality** (narrate animations, don't caption them), **redundancy** (don't put the narration script on screen as text), **signaling** (highlight the active element), **segmenting** (one idea per beat), **coherence** (cut anything decorative), **personalization/conversational tone**, **temporal contiguity** (sync the highlight to the word), **pre-training** (name the key components before explaining how they interact), and **voice**. Noetel et al. (2021), "Video Improves Learning in Higher Education," separately confirms via meta-analysis that video reliably improves learning versus text/no-video, especially as a supplement.

### 1.4 "The Reel Deal" (Stavrinou et al. 2025, arXiv 2509.05962)

This CHI-Greece 2025 paper directly tests LLM-generated short-form educational video. The authors built **ReelsEd**, a system using GPT-4 to convert 10–15 min lecture videos into **5–6 AI-identified "key moments" of ~30–60 seconds each**, preserving instructor-authored material. Between-subjects study, **62 university students**, long-form vs AI-generated reels, on intro programming topics (Python, C, Java, ML).

**Findings:**
- **Quiz scores: 93.85% (LLM) vs 79.72% (long-form), p=0.0001** — a large, significant advantage.
- **Quiz completion time: 328.8s vs 446.2s, p=0.0002** — faster.
- **Video revisits: 2.90 vs 3.52, not significant** — the benefit came from clarity, not re-watching ("not about watching more, but learning better").
- **No increase in cognitive load** (NASA-TLX showed no significant differences; LLM group trended slightly lower on effort/strain).
- **Perceived learning effectiveness strongly favored short-form**: understanding the topic (6.29 vs 4.71, p<0.0001), retaining key info (6.29 vs 4.81, p<0.0001), breaking topic into manageable parts (6.45 vs 4.45, p<0.0001), ease of revisiting concepts (6.55 vs 4.00, p<0.0001), engagement (6.06 vs 4.13, p=0.0002).
- **Trust in AI content was high**: "trustworthy" 6.29/7, "accurate" 6.32/7, "I can trust the system" 6.03/7, with low distrust — but moderate residual skepticism (3.13/7), so **transparency about how content is generated is recommended.**

**Design recommendations from the paper:** segment content into coherent one-task units ("Each reel did only a specific task and I could understand it better before watching the next one" — P1); enable easy navigation (gallery/grid view, thumbnails); support note-taking, subtitles; keep instructor oversight/editing in the loop because AI summaries "can oversimplify, miss key context, or include errors." One critical qualitative finding for hooks: a long-form participant complained the video "should explain better what it is all about and not jump into the process directly" (P4) — **openings need framing/context, not a cold jump into steps.**

**Related — Netland et al. (2025, *Computers & Education* 224:105164):** an online experiment with **447 participants** comparing human-made vs AI-generated (LLM script + generative graphics + avatar) teaching videos in a management course found **equivalent learning outcomes (no significant exam-score difference), but participants slightly preferred human-made videos on learning experience.** Headline: "students enjoyed them less but learned the same." Implication: AI-generated plan videos can be pedagogically effective, but perceived engagement/credibility is a known weak spot to design against.

### 1.5 Short-form video & learning: benefits and downsides

**Benefits (microlearning):** Taylor & Hung (2022), "The Effects of Microlearning: A Scoping Review" (*ETR&D*), found microlearning (units generally ≤15 min) associated with positive effects on knowledge, confidence, retention, and engagement, while noting downsides: "balancing brevity with depth, managing content fragmentation," pedagogical discomfort, and technology inequalities. A health-professions scoping review (De Gagne et al. 2019) found 82% of studies showed knowledge/skill acquisition gains.

**Downsides — the critical caution for a review tool:** Chiossi et al. (2023), "Short-Form Videos Degrade Our Capacity to Retain Intentions: Effect of Context Switching on Prospective Memory" (arXiv 2302.03714; CHI 2023, N=60). A between-subjects experiment found that the **TikTok short-form-feed condition significantly degraded prospective-memory performance** (remembering to execute a previously planned action), while Twitter, YouTube, and no-activity conditions did not. The mechanism is "the combination of short videos and rapid context-switching." **Direct implication for plan videos: rapid, fragmented, scroll-feed-style cutting can undermine exactly the faculty a reviewer needs — remembering to act on what they just saw.** This is a strong, peer-reviewed reason to avoid frantic pacing and to end with an explicit, anchored call to action rather than relying on the reviewer to remember intentions.

**Weakly sourced claims to flag:** Popular creator/marketing blogs assert things like "you have 3 seconds to hook," "make 3 scene changes in 3 seconds," and cite "dopamine" statistics about attention spans. These are **folklore or marketing claims, not peer-reviewed findings.** The frequently cited "8-second attention span" statistic is specifically debunked: it traces to a 2015 Microsoft Canada report citing "Statistic Brain," and BBC's Simon Maybin (2017) found none of the listed sources supported it. Per the *Wall Street Journal* (McGinty, Feb 17 2017), University of Chicago neuroscientist Edward Vogel said, "I've been measuring college students for the past 20 years… It's been remarkably stable across decades," and Michael Posner noted "there is no real evidence that it's changed since it was first reported in the late 1800s." Use hooks and brisk pacing (which *are* supported), but do not treat numeric attention-span folklore as evidence.

### 1.6 Curiosity, the curiosity gap, and hooks

**Loewenstein's information-gap theory (1994):** curiosity is an aversive state triggered when we become aware of a gap between what we know and what we want to know. It is strongest when three conditions hold: (1) the person already knows enough to sense something is missing, (2) the missing information feels specific (not vague), and (3) the gap feels bridgeable (the answer feels within reach). This directly informs hook design: **pose a specific, answerable question the reviewer can't yet answer** ("Why can't we just add the column to the existing table?"). Related: the **Zeigarnik effect** (unfinished tasks are remembered more vividly / create cognitive tension).

**Expectation violation / prediction error:** A body of cognitive-neuroscience work (e.g., Sinclair & Barense; Bein et al. in PNAS 2018/2021) shows that surprise/prediction-error engages hippocampal encoding and can enhance memory, and that **explicitly predicting an outcome before seeing it boosts memory for expectancy-violating information** (Brod et al. — a U-shaped relationship between expectedness and memory). Caveat: the effect is not universal — some studies find null effects, so "moderate expectancy violation" is the defensible claim. Application: framing the "obvious approach" and then showing it fails is a prediction-error structure.

**Veritasium's misconception-first method (empirically grounded):** Derek Muller's University of Sydney PhD, "Designing Effective Multimedia for Physics Education," found that videos that *don't* challenge viewers' preconceptions leave misconceptions intact — viewers with a prior belief tend not to attend to a straightforward explanation. The effective structure: **surface the common wrong belief first, demonstrate why it's wrong, then present the correct model.** His published work (e.g., "Saying the wrong thing: Improving learning with multimedia by including misconceptions," *J. Computer Assisted Learning* 2008; "Raising cognitive load with linear multimedia to promote conceptual change," *Science Education* 2008) shows this can *raise* productive cognitive load and promote conceptual change.

### 1.7 Human review of AI plans, code-review fatigue, and long-text comprehension

Empirical code-review research consistently finds **comprehension and defect-detection degrade sharply past a few hundred lines.** SmartBear's widely cited guidance derives from a Cisco Systems study of **2,500 reviews across 3.2 million lines of code**: "developers should review no more than 200 to 400 lines of code (LOC) at a time… beyond 400 LOC, the ability to find defects diminishes. In practice, a review of 200–400 LOC over 60 to 90 minutes should yield 70–90% defect discovery." The same study found reviewers slower than 400 lines/hour were above average at uncovering defects, but faster than ~450–500 lines/hour, defect density dropped below average in 87% of cases. Detection rates fall from roughly **87% for small PRs (<100 lines) to ~28% for PRs over 1,000 lines** (analyses of large PR corpora building on the SmartBear/Cisco baseline). And on fatigue: after **about 60 minutes, "reviewers simply wear out and stop finding additional defects."** Google's engineering practices recommend small changes for the same reasons; Kononenko et al.'s study of 28,127 Mozilla reviews found 54% of reviewed changes still introduced bugs, with reviewer workload a contributing factor. Working-memory limits (the classic 7±2) mean a 1,000-line diff exceeds capacity and reviewers "shift from deep analysis to shallow pattern-matching," yielding rubber-stamp "LGTM" approvals.

**Implication for plan videos:** the *entire value proposition* is compressing a long, fatiguing text plan into a segmented, dual-channel, ~90-second artifact that fits within working-memory limits and front-loads the highest-stakes decisions before fatigue sets in. This is precisely the regime where Guo's length findings, Brame's segmentation, and ReelsEd's results converge.

### 1.8 HCI research on video annotation and time-anchored feedback

The product will let users draw on the video to comment, so the relevant HCI pattern is **time-anchored / frame-anchored annotation**: reviewers pause on a frame, draw (arrows, circles, freehand, shapes) or type, and the comment stays pinned to that exact timecode (and ideally to the moving object). Industry systems establishing the pattern include Frame.io, Filestage, Dropbox Replay, Ziflow, and PlayPause — all converging on: comments anchored to a precise second/frame (not "around the middle"), visual markers on the timeline color-coded by reviewer, freehand drawing directly on the frame, anchored comments that follow moving elements, range-based commenting, and persistence across versions. The academic/patent literature (e.g., transcript-synced annotation systems) adds **transcript-anchored** commenting: selecting words in a synced transcript to attach feedback.

**Design implications for the plan video's ending and structure:** (1) because feedback is time-anchored, **each plan step should occupy a distinct, clearly bounded beat with a stable on-screen anchor** (a labeled box/step the reviewer can point at); (2) **pauses/landmarks between steps** (Guo showed tutorials are paused selectively at step boundaries) are exactly where annotations will cluster — design explicit "beat boundaries"; (3) the ending should **name the specific decision points** so the reviewer knows where to draw.

---

## Part 2 — Beat-by-Beat Deconstruction of Reference Videos

*Sourcing note: verbatim wording and beat order are transcript-sourced; per-second timestamps are reconstructed from transcript + runtime + measured pace and should be spot-checked. Two figures (Fireship "10–15 cuts/min," "200–250 wpm") come from an AI-aggregated wiki and are flagged; the wpm figure is corroborated by an independent transcript word-count (~210–220 wpm).*

### 2.1 Fireship — "TypeScript in 100 Seconds" (most relevant format)

The single most relevant reference for a plan video: technical, ~100 seconds, LLM-friendly structure. Beat map:

- **0:00–0:05 — HOOK / DEFINITION** (cold open, no intro): *"TypeScript — validate your JavaScript ahead of time with static type checking."* The topic name is literally the first word; a one-sentence functional definition follows in the same breath.
- **0:05–0:20 — PROBLEM / TENSION:** JavaScript lets you reference variables that don't exist or use unknown object shapes, "but if your code is broken you won't catch it until runtime."
- **0:20–0:32 — SOLUTION + HUMOR:** TypeScript extends JS with types; the trademark hyperbolic joke — fix errors now "instead of… after the company has lost millions of dollars."
- **0:32–0:55 — HOW IT WORKS:** compiler/`tsc`, transpile target, `tsconfig`.
- **0:55–1:30 — CODE EXAMPLES (densest section):** explicit types, the type error, inference, `any`, arrays, interfaces — screen-synced code, each sentence mapped to a visual.
- **1:30–1:40 — PAYOFF:** autocomplete everywhere, no jumping to docs/stack traces.
- **1:40–1:55 — OUTRO:** brief self-promo → *"Thanks for watching and I will see you in the next one."*

**Pace:** ~370 words in ~100–105s → **≈210–220 wpm** — roughly 1.5× normal presentation pace, at the top of Brame's 185–254 range. The reverse-engineered template (definition → problem → how it works → application) maps cleanly onto a plan video. Narration carries the logic; the code panel is the visual channel showing "what," while the voice says "why." Humor and a single memorable exaggeration aid retention (emotional design, g≈0.27–0.35).

### 2.2 3Blue1Brown — "Vectors | Chapter 1, Essence of Linear Algebra"

- **0:00 — HOOK (visual/text card, no narration):** an epigraph — *"The introduction of numbers as coordinates is an act of violence." — Hermann Weyl.* A provocative quote reframes something mundane (coordinates) as dramatic, priming curiosity before any teaching.
- **~0:05–0:30 — THESIS (narration):** *"The fundamental, root-of-it-all building block for linear algebra is the vector, so it's worth making sure that we're all on the same page about what exactly a vector is."*
- **~0:30–1:15 — FRAMEWORK/ANALOGY (narration):** the "three perspectives" (physics / CS / mathematician) — the organizing analogy that structures the whole video (a form of **pre-training**: name the components before combining them).
- **~1:15+ — DEMONSTRATION (visual-led):** arrows appear, root at origin, coordinates introduced. **Animation does the explaining; the voice only annotates.**

Sanderson's stated philosophy (MIT talk "Communicating math online"; Stanford talk): **"resist the temptation to start with the general abstract thing and then populate it with examples" — invert it: start with a concrete motivating example, then abstract.** And from his site: "Every movement on the screen should be deliberate, with an identifiable purpose… each visual and movement should communicate the same point that the narration is, so they reinforce one another, rather than competing" — a plain-language statement of the **coherence + temporal-contiguity + redundancy-avoidance principles.** Pace is deliberate (~130–150 wpm feel), the opposite of Fireship — appropriate for high-intrinsic-load conceptual content.

### 2.3 Kurzgesagt — surprising-claim opening

"Alcohol is AMAZING" opening: *"Alcohol is the most harmful substance on Earth. Every year it kills more people than terrorism, wars, homicides and car accidents combined… and yet, more than 2 billion people drink."* Then the **paradox hook:** *"Alcohol is kind of a paradox. Why do we cling so much to the thing that harms us the most?"* Template: **counterintuitive superlative → escalating concrete stakes → a "why?" question** that converts the topic into a mystery. Creator philosophy (founder Philipp Dettmer, Forbes 2024): "Storytelling is incredibly important… if we discuss a topic honestly and fairly you will realize the conclusion by yourself." They deliberately use "lies-to-children" (useful oversimplification) as an on-ramp — a caution flag for accuracy in a plan-review context. Scripts go through ~a dozen drafts to "cut away unnecessary bits," and a full ~10-min video takes 1,200+ hours (illustration alone: 2–3 illustrators, 8–12 weeks). The transferable lesson is the *script discipline*, not the production budget.

### 2.4 Veritasium — misconception hook

Opening pattern: **pose a question the viewer will likely get wrong / surface a misconception, predict they're wrong, promise resolution** (often via man-on-the-street wrong answers). Grounded in Muller's PhD (§1.6). Titles reflect it: "The SAT Question Everyone Got Wrong," "The Smarter You Are, The More Likely You Are To Get This Question Wrong." For a plan video, the analog is: *"The obvious fix is to add a retry loop. That's exactly what will take the system down."*

### 2.5 CGP Grey — dense scripted narration

Grey's model: unadorned animation (stick figures, simple shapes, white backgrounds) with **dense, meticulously scripted narration** — famously rewriting a script for up to a year, ~20 hours of work per finished minute. Videos "debunk common misconceptions or answer everyday questions." Takeaway for plan videos: **the script is the product**; visuals are minimalist and subordinate, directing attention rather than decorating. This is a strong model for an LLM writing HTML, where elaborate animation is costly but tight scripting is cheap.

### 2.6 Two Minute Papers

Károly Zsolnai-Fehér's format: a tight ~3–6 min arc — name the paper/problem, show the prior state of the art, reveal the new result with visual before/after comparisons, express enthusiasm ("What a time to be alive!"), and note limitations. Relevant pattern: **before/after contrast** as the core payload — directly applicable to showing "current code state → state after the plan."

### 2.7 Cross-creator synthesis

| Function | Fireship | 3Blue1Brown | Kurzgesagt | Veritasium |
|---|---|---|---|---|
| Hook | Name + 1-line definition | Provocative quote card | Shock superlative + paradox Q | Misconception / "you're wrong" |
| First words | "TypeScript — validate your JS…" | "…an act of violence" (text) | "the most harmful substance on Earth" | Poses a question viewer gets wrong |
| Pace | 200–250 wpm | Slow, visuals-led | Measured | Conversational |
| Visuals | Synced code panels | Deliberate animation carries meaning | Metaphor-rich illustration | Interviews + demos + before/after |
| Ending | Self-promo + "next one" | Leads to next chapter | Reframed conclusion | Resolution |

Common denominators across all seven: **(1)** an opening that creates a gap/tension before delivering answers; **(2)** concrete-before-abstract; **(3)** visuals and narration doing *different* jobs, not repeating each other; **(4)** deliberate (not decorative) motion; **(5)** a payoff that resolves the opening tension.

---

## Part 3 — The Prompt-Ready Style Guide

*This section is written to be pasted (in whole or in part) into the agent's system prompt. Each rule is tagged **[STRONG]** (meta-analysis / large-N study), **[MODERATE]** (single good study / well-supported theory), or **[FOLKLORE]** (creator heuristic; use but don't over-trust).*

### 3.1 Length and per-beat seconds budget

**Target 60–90 seconds; hard cap 120s.** [STRONG — Guo, ReelsEd] Shorter is safer: completion and comprehension both rise. Use one idea per beat, 5–15 seconds each.

**60-second plan video (≈7–9 beats):**
| Beat | Function | Budget |
|---|---|---|
| 1 | Hook / the goal + curiosity gap | 6–8s |
| 2 | Tension: why the obvious approach fails | 8–10s |
| 3–5 | Progressive build: one plan step per beat | 3 × 10s = 30s |
| 6 | Callback: how steps resolve the tension | 6–8s |
| 7 | Open questions for the reviewer | 6–8s |

**120-second plan video (≈10–13 beats):**
| Beat | Function | Budget |
|---|---|---|
| 1 | Hook / goal | 8–10s |
| 2 | Tension / misconception | 10–12s |
| 3 | Pre-training: name the key components | 8–10s |
| 4–8 | Progressive build: one step per beat | 5 × 12s = 60s |
| 9 | Callback + before/after contrast | 10s |
| 10 | Risks / trade-offs | 8–10s |
| 11 | Open questions + explicit annotation prompt | 10–12s |

**Keep the intro under ~8 seconds.** [FOLKLORE but consistent with STRONG evidence] Cold-open like Fireship — no "in this video I will." ReelsEd participants complained when videos "jump into the process directly" without framing, so the hook must *frame*, not merely decorate.

### 3.2 Canonical beat structure for an implementation plan

1. **HOOK (goal + curiosity gap).** State the objective as a specific, bridgeable question. *"We need uploads to survive a server crash. The obvious fix won't work — here's why."* [MODERATE — Loewenstein; Veritasium]
2. **TENSION (why the obvious approach fails).** Surface the naive/expected approach, then show it breaks. This is prediction-error + misconception-first. [MODERATE — Muller PhD; prediction-error literature]
3. **(120s only) PRE-TRAINING.** Name the key components/actors before showing interactions. [STRONG — Mayer pre-training]
4. **PROGRESSIVE BUILD (one step per beat).** Each plan step = one segmented beat with a stable, labeled on-screen anchor. Build the diagram incrementally; don't reveal the whole architecture at once. [STRONG — segmentation g≈0.32–0.36; Guo tutorial findings]
5. **CALLBACK + BEFORE/AFTER.** Return to the hook's tension and show the plan resolves it; contrast current vs post-plan state. [MODERATE — narrative closure; Two Minute Papers pattern]
6. **RISKS / TRADE-OFFS (120s).** Name what could go wrong — this builds trust (ReelsEd: transparency reduces residual skepticism). [MODERATE]
7. **OPEN QUESTIONS → ANNOTATION.** End on 1–3 explicit, specific decisions the reviewer must make, each tied to a named on-screen step. [STRONG rationale — Chiossi prospective-memory; guiding-questions effect]

### 3.3 Narration vs on-screen content (division of labor)

- **Visuals show WHAT; voice says WHY.** [STRONG — modality principle] The screen shows the code/diagram/step; narration explains rationale and trade-offs.
- **Never put the narration script on screen as text.** [STRONG — redundancy principle] Identical spoken + written text overloads the visual channel and *reduces* learning. Exception: 2–3 keyword labels or a step title (that *is* signaling, and is beneficial).
- **Sync highlight to word (temporal contiguity).** [STRONG — g=0.74] When the narration mentions a component, highlight it at that instant; never describe something before or after it appears.
- **Complementary, not redundant, channels.** Avoid "talking-head reads bullet points." [STRONG]

### 3.4 Signaling / highlighting rules

- Use signaling to direct attention: color/contrast change, arrows, a glowing border, or 2–3 keywords appearing. [STRONG for use; g=0.38 / pooled <0.2 — real but modest]
- **One signal at a time.** Highlight only the currently active element; dim or de-emphasize the rest. This exploits the tutorial "landmark" behavior Guo observed (viewers pause at step boundaries).
- Give each plan step a **persistent labeled anchor** (e.g., "Step 2: Write-ahead log") so time-anchored annotations have a stable target.
- Use consistent visual encoding (same color = same subsystem throughout).

### 3.5 Conversational-tone rules

- Use **"you" and "we" and "I"** (personalization principle — "large effect," per Mayer/Brame). [STRONG] *"Here's where we have a choice…"*
- **Enthusiastic, brisk delivery; target 185–254 wpm** for narration timing/word budget. [STRONG — Brame/Guo] For a 90s video that's ~280–380 words. Don't pad; edit out filler.
- Warmth + a light, non-distracting touch of personality aids engagement, but avoid jokes that add extraneous load. [MODERATE — emotional design g≈0.27–0.35; coherence caution]
- Because AI narration is slightly less liked than human (Netland; voice principle d=0.23), **compensate with clarity, structure, and a natural voice**, and disclose AI generation for trust.

### 3.6 Visual metaphor / analogy guidance

- **Concrete before abstract** (Sanderson): open with a specific example or the actual code, then generalize. [MODERATE — creator-validated; conceptual-change literature]
- Use **one carrying metaphor** per video where helpful (Kurzgesagt's visual-metaphor approach), but keep it accurate — avoid "lies-to-children" oversimplifications that would mislead a technical reviewer making a real decision.
- Prefer **incrementally built diagrams** (nodes/edges appearing as narrated) over static complex schematics — motion that reveals structure is germane; motion for its own sake is extraneous (coherence, g=−0.37 to −0.41). [STRONG]
- **Before/after contrast** is a high-value visual for plans (current architecture → proposed).

### 3.7 What to avoid

- **Fragmentation / frantic cutting.** [STRONG caution — Chiossi 2023] Rapid context-switching degrades prospective memory — the exact faculty a reviewer needs. Reject "3 cuts in 3 seconds" folklore; use deliberate, motivated transitions.
- **Motion, music, and decoration for their own sake** (seductive details, g=−0.37 to −0.41). [STRONG] Weed complex backgrounds and background music.
- **On-screen text that duplicates narration.** [STRONG — redundancy]
- **Overlong intros / cold jumps.** Frame in ≤8s but don't skip framing. [MODERATE]
- **Dumping the whole plan at once.** Build incrementally. [STRONG — segmentation]
- **Overclaiming / hiding trade-offs.** Erodes trust (ReelsEd). State uncertainty and that content is AI-generated.
- **Speaking too slowly / hedging.** [MODERATE — Guo]

### 3.8 Designing the ending to invite annotation

The ending is the product's conversion moment — the reviewer approves, annotates, or revises. Design it around **time-anchored feedback** (§1.8) and **prospective-memory protection** (§1.5):

1. **End on 1–3 explicit open questions**, each naming a specific step/decision: *"Two open calls for you: Step 3 — is Postgres the right store, or should we use S3? Step 5 — do we need idempotency keys now or later?"* [STRONG rationale — guiding questions improve engagement/learning; Loewenstein specificity]
2. **Pin each question to its on-screen anchor** so drawing on that region is the obvious next action. Because Guo showed viewers pause at step boundaries, and annotation clusters there, make those boundaries the invitation points.
3. **Give an explicit, immediate call to action** rather than relying on the reviewer to remember to act later (prospective-memory degradation). *"Draw on any step to leave a note, or hit approve."*
4. **Leave a beat of low-motion "dwell time"** at the end (a calm final frame showing the full labeled plan) so the reviewer can scrub back and annotate without fighting motion.
5. Provide a **navigable structure** (chapter markers / a step gallery) — ReelsEd's top requested feature — so reviewers can jump to the step they want to annotate.

### 3.9 Evidence tiering summary

**Strongly evidenced (meta-analysis or large-N):** keep it short (≤~2 min, one-idea beats); segmentation; temporal contiguity (sync highlight to word); avoid redundant on-screen text; avoid seductive details/decoration; conversational/personalized tone; brisk enthusiastic pace (185–254 wpm); modality (visuals=what, voice=why); short-form beats long-form for comprehension (ReelsEd); large PRs/plans degrade review — compression helps.

**Moderately evidenced (single good study / solid theory):** misconception-first / prediction-error hooks (Muller PhD); curiosity-gap openings (Loewenstein); concrete-before-abstract (Sanderson); before/after contrast; signaling (real but modest, g≈0.38/pooled<0.2); voice principle (d=0.23); trust/transparency effects (ReelsEd, Netland).

**Creator folklore (use as heuristics, don't over-trust):** "hook in the first 3–8 seconds"; exact cuts-per-minute targets (Fireship "10–15/min" is from an AI-aggregated wiki); "dopamine"/8-second-attention-span statistics (the latter is specifically debunked — see §1.5); "3 scene changes in 3 seconds." These are motivational rules of thumb, not evidence — and some (frantic cutting) actively conflict with the strong evidence.

---

## Recommendations (staged, with thresholds)

**Stage 1 — Ship the evidence-backed core (do first).** Configure the agent to: cap at 90s; one idea per 5–15s beat; hook → tension → per-step build → callback → open questions; visuals show what / voice says why with zero redundant paragraph text; sync highlights to narration; brisk conversational narration at ~200 wpm; end on 1–3 anchored open questions + explicit CTA. These are all [STRONG]. **Threshold to revisit:** if analytics show reviewers drop off before the callback, shorten to 60s and cut a build step.

**Stage 2 — Layer moderate-evidence enhancements.** Add misconception/prediction-error framing in the tension beat; concrete-before-abstract openings; before/after architecture contrast; a risks/trade-offs beat in 120s versions; disclose AI generation. **Threshold:** A/B test misconception-hook vs plain-goal hook; keep whichever wins on annotation rate and approval accuracy.

**Stage 3 — Instrument and calibrate against the annotation product.** Because feedback is time-anchored, measure *where* reviewers pause/draw. If annotations cluster mid-beat rather than at boundaries, your segmentation is off — re-chunk. Track prospective-memory proxy: do reviewers who watch actually act (approve/annotate/revise) vs abandon? If abandonment is high, strengthen the explicit CTA and reduce cutting speed.

**Metrics that would change the guidance:** (a) if completion is high but annotation rate is low → the ending isn't inviting action; strengthen §3.8. (b) If comprehension (measured by revision quality) is low despite completion → intrinsic load too high; add pre-training and cut steps per video. (c) If trust scores lag → increase transparency and add a risks beat.

---

## Caveats

- **Most core evidence comes from MOOC/classroom learning, not plan-review.** Guo, Brame, Noetel, and ReelsEd studied students learning course content, not engineers reviewing AI plans. The transfer is well-motivated (both are dual-channel comprehension under time pressure) but not directly validated. The code-review-fatigue literature supports the *problem* framing but doesn't test video as the solution.
- **Guo's engagement ≠ learning.** Engagement time is a necessary-not-sufficient proxy; the authors stress this.
- **ReelsEd (N=62) and Netland (N=447) are single studies** with short-term outcomes; ReelsEd's benefits may partly reflect novelty, and both used university students on programming/management topics. Long-term retention is untested.
- **Signaling's effect is modest and context-dependent** (g=0.38 in one meta-analysis but <0.2 pooled) — use it, but it's not a silver bullet.
- **Prediction-error/surprise memory effects are real but not universal** — some studies find null effects; use "moderate expectancy violation," not shock tactics.
- **Part 2 timestamps are reconstructed** from transcripts + runtime, not lifted from caption files; verbatim wording and beat order are reliable, exact seconds are approximate. The Fireship "10–15 cuts/min" figure is from an AI-generated wiki and is uncorroborated; the ~200–250 wpm figure is corroborated by transcript word-count.
- **Creator advice is partly survivorship-biased folklore.** These creators are outliers; their heuristics correlate with success but aren't controlled evidence. Where folklore conflicts with meta-analytic evidence (e.g., frantic cutting vs coherence/prospective-memory findings), defer to the evidence.
- **AI-generated narration is slightly less liked than human** (Netland) even when learning is equal — manage this with clarity, natural voice, and transparency rather than assuming parity of experience.
- **The code-review numbers come from the SmartBear/Cisco study of 2,500 reviews (3.2M LOC), industry-standard but from 2006 open/enterprise codebases;** the "87% vs 28% detection" split is from later corpus analyses building on that baseline and should be treated as indicative rather than exact.