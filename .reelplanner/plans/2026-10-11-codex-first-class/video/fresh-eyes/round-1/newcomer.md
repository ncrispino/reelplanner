# Fresh eyes: newcomer · round 1 · stamp 3b80cbf24861

- N1 · scene 2 · "A hosted Claude page has extra services": I guessed these are the services that deliver reviews and answer scene questions, but the scene does not name them or say which review actions the browser alone cannot provide; I need that distinction to understand what has no proven Codex replacement.
  - Answer: fixed: the researched-options scene now names saved reviews, reviewer identity and question answering as the additional hosted services.

- N2 · scene 8 · "Fix signing, then retry from that work": I understand that the failed commit leaves the review unfinished, but I cannot tell who fixes signing, where I see Stopped before commit, or how I restart the saved work; I guessed the owner fixes the key and asks Codex to continue, and need the recovery handoff to follow this failure case.
  - Answer: plan: step 2 now names the owner restoring signing, the page stopped/log state and guarded inbox retry preserving edits and checking ownership/completion. The failure scene now says this plainly.

- N3 · scene 12 · "A missing active source requires an explicit transcript path": I guessed someone supplies the saved conversation file manually, but the scene does not say who supplies it or how they identify the correct file when automatic discovery failed; I need to understand that fallback without accidentally choosing the newer conversation the rule forbids.
  - Answer: plan: step 4 now tries a supported read-only export first, then requests a readable copy/path of this specific conversation from the owner only if needed; the session-source scene says this and verifies session/project.
