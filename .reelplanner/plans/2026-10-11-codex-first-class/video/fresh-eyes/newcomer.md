# Fresh eyes: newcomer · round 2 · stamp 6bc78a8c71c1

- N1 · scene 7 · "reelplanner inbox retry <id>": I guess <id> identifies the stopped review, but the scene does not say where Codex or I get that identifier. I would need to know how the displayed failure and log identify the item to retry, so the recovery command refers to the right unfinished work.
  - Answer: fixed: the failure trace now says retry saved work, removing the technical review-ID placeholder from the main scene. The exact guarded command and inbox item identifier remain in the guide.

- N2 · scene 9 · "Save question → live session": I understand that a disconnected question stays saved, but I cannot tell how its eventual answer reaches me. I guess Codex sends a reply back to the review page; does it appear there automatically, or do I return to the agent conversation to read it? This matters when I leave a question and wait for a reply.
  - Answer: fixed: the delivery scene now says and shows that the question reply appears on this review page, while disconnected questions stay saved.

- N3 [plan] · scene 11 · "asks you for a readable copy or path for this specific conversation": I understand why a newer conversation is the wrong substitute, but what happens if I also cannot supply a readable copy after the active file and export both fail? I guess the explainer must stop and report the missing source; I need to know the outcome of this remaining failure case.
  - Answer: plan: step 4 now explicitly stops with a clear error naming the missing conversation when the active file, supported export and owner copy are all unavailable; it remains unfinished and never substitutes or fabricates evidence. The source scene mirrors that outcome.
