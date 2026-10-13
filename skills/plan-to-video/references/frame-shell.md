# Reuse a checked frame shell

Reuse the mechanics of a frame after checking them once. Each scene still chooses its own visual form,
populated evidence, reading order and motion. A table, a before-and-after comparison and an event trace can
share this shell without sharing their layout. Do not copy a finished scene's empty cards or substitute
format titles for actual inputs and results.

Before drawing, write a short visible-content contract beside each storyboard scene: the source input,
the result the evidence establishes, exact values and field names, qualifiers such as Unclear or
Hypothetical, and the relationship the viewer should see. The frame packet carries that storyboard block.
The script review checks the intended meaning; the assembled frame review checks that the visible content
kept it. Keep hypothetical examples separate from observed counts.

## The mechanics to keep

The existing HyperFrames project initialization stages GSAP and fonts. Its generated `frame.md` records
the local font faces. Start from the template below, adapting the composition ID, letter-prefixed element
IDs, duration and local font declarations to the packet and project. The three paths here are the bundled
code-editorial preset's files; use the actual declarations in the project's `frame.md` for another preset.
Do not fetch fonts or assume a family name alone loaded its file.

```html
<template>
  <style>
    @font-face { font-family: "Inter"; src: url("assets/fonts/Inter-400.woff2") format("woff2"); font-weight: 400; }
    @font-face { font-family: "EB Garamond"; src: url("assets/fonts/EBGaramond-400.woff2") format("woff2"); font-weight: 400; }
    @font-face { font-family: "JetBrains Mono"; src: url("assets/fonts/JetBrainsMono-400.woff2") format("woff2"); font-weight: 400; }
    #root {
      position: relative; width: 100%; height: 100%; overflow: hidden;
      container-type: size; background: var(--rp-paper); color: var(--rp-ink);
      font: 400 1.67cqw/1.4 "Inter";
    }
    .f17-content { position: absolute; inset: 0 0 16.666667%; }
    /* Add this scene's own styles, prefixed with f17-. */
  </style>
  <div id="root" data-composition-id="17-evidence" data-width="1920" data-height="1080"
       data-duration="8" data-band="bottom">
    <div class="f17-content" id="f17-content">
      <!-- Add this scene's populated artifact or explanation. -->
    </div>
  </div>
  <script src="assets/vendor/gsap.min.js"></script>
  <script>
    (function () {
      var ID = "17-evidence";
      var root = document.querySelector('[data-composition-id="' + ID + '"]');
      var q = function (selector) { return root.querySelector(selector); };
      var DUR = 8;
      var tl = gsap.timeline({ paused: true });
      // Add seek-safe cues on this scene's elements, at their spoken words.
      // For example, q("#f17-content") selects a letter-prefixed DOM ID.
      tl.to({}, { duration: 0.001 }, DUR - 0.001);
      window.__timelines = window.__timelines || {};
      window.__timelines[ID] = tl;
    })();
  </script>
</template>
```

The shell has no camera or question layout. Its content region ends at y 900, leaving room for captions
and the lowest eighth's controls. Keep actual content inside it; the region does not clip overflow for
you. Retain `#root` styling and percentage root dimensions. Prefix element IDs with a letter and the scene
number (`f17-result`); numeric composition IDs are fine, numeric CSS selectors such as `#17-result` are not.
Keep selectors scoped to the scene, and register exactly one paused timeline under its composition ID.

Add the packet's `data-question`, `data-option`, `data-call`, `data-artifact`, `data-gloss` and `data-detail`
marks where needed. Keep question cards at rest at scale 1; a detail needs its own clearance and final
three-second rest. A camera needs a view clipped at y 900 and text that meets the theme's floor at its
smallest scale. Theme colors remain tokens; motion cues are plain seconds from the scene start.

## Check before repeating it

Check the first populated frame batch with the pinned package, before copying its shell to more scenes:

```sh
reelplanner hyperframes lint <video-dir> --json
reelplanner frame-check <video-dir> <frame> [<frame>…]
```

Lint checks the framework contract even before final assembly. Assemble the first batch before trusting
its browser layout check or picture; a missing picture or skipped browser check is not validation.
Inspect both a populated evidence scene and a choice/check scene when the video has them. Fix a shared
root, selector, font or safe-area mistake in the shell before it spreads. Save the check output and one
representative frame path in the stage handoff, then reuse mechanics while designing each scene for its
own conclusion. Check later frames as they land, passing several frame numbers in one command to share
the browser checks and snapshots without dropping any frame's samples or picture.

Keep final assembled verification, guide checks and independent script/frame reviewers. A shell check
does not prove source fidelity, populated alternatives, readable answer feedback or actual visual variety.


### Intended visible content

Use the canonical [`### Visible content` convention](frames.md#intended-visible-content) in each
storyboard frame for exact inputs, results, reasoning, qualifications and relationships intended on screen.
`fresh-eyes --script` and `frame-packet` share that section, scene summary and narration. Keep private notes
and guide-only text outside it. Repair missing reasoning and obtain an independent rereview after meaning
changes; the versioned script stamp detects stale reviewer-visible input. Preserve the final independent
screenshot reviews and count brief preparation, extra tokens and repairs in measured authoring cost.

For an optional populated frame with bounded header, body and conclusion regions, see
[`frame-scaffold.md`](frame-scaffold.md). Keep custom HTML when none of its forms fits the explanation.
