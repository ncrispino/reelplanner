# SCRIPT — w1-upload-resume (walkthrough, three parts)

**Voice:** am_michael (Kokoro, local; sped x1.25 after synthesis)
**Voice settings:** default
**Voice direction:** Plain and even, reporting. An engineer walking a reviewer through what they built: one idea per sentence, a real number for every claim, no selling.

---

## Line 1 — It shipped (Frame 1)

**Time:** 0.0 – 8.0s
**Delivery:** Plain.

    The plan is implemented. All six steps landed, a two gigabyte upload survives three disconnects, and a file is charged once. I also made four calls the plan did not specify. Here they are.

## Line 2 — Step 1 landed as planned (Frame 2)

**Time:** 8.0 – 17.0s
**Delivery:** Plain.

    Step one, the write-ahead manifest, landed as written. The table has six columns and one index; the migration ran in forty milliseconds on staging.

## Line 3 — Step 2, with one change (Frame 3)

**Time:** 17.0 – 29.0s
**Delivery:** Plain.

    Step two, chunked parts. A repeated PUT still returns two hundred without rewriting. One change: the default part size is sixteen megabytes, not the eight the plan named. A two gigabyte file is a hundred and twenty-eight parts instead of two hundred and fifty-six.

## Line 4 — Why sixteen megabytes (Frame 4)

**Time:** 29.0 – 42.0s
**Delivery:** Plain.

    I chose sixteen over the plan's eight because mobile clients on the test network lost fewer parts per disconnect, and sixteen is still far under the five gigabyte limit. The plan's warning about the five megabyte minimum still holds. Accept this, or flag it?

## Line 5 — Quick check (Frame 5)

**Time:** 42.0 – 49.0s
**Delivery:** Plain.

    Quick check. The client sends part four twice. Does the second PUT store it again, see the bit and do nothing, or fail the upload?

## Line 6 — Next: steps 3 and 4 (Frame 6)

**Time:** 49.0 – 53.0s
**Delivery:** Plain.

    Next, part two: resume and billing.

## Line 7 — Part two of three (Frame 7)

**Time:** 53.0 – 57.0s
**Delivery:** Plain.

    Part two of three: resume, and billing once.

## Line 8 — Step 3: resume (Frame 8)

**Time:** 57.0 – 67.0s
**Delivery:** Plain.

    Step three, resume. A reconnecting client asks which bits are set, gets one one one zero one one, and sends part four only. Staging cut the network at forty, seventy and ninety-five percent; every one resumed.

## Line 9 — Why 409, not 400 (Frame 9)

**Time:** 67.0 – 78.0s
**Delivery:** Plain.

    Complete returns four-oh-nine when parts are missing. The plan did not say which code. I picked four-oh-nine because it reads as a state conflict, which it is: the client can ask for the bitmap and carry on. Four hundred would say the request was malformed. Accept, or flag?

## Line 10 — Step 4: billed once (Frame 10)

**Time:** 78.0 – 87.0s
**Delivery:** Plain.

    Step four. The charge job now runs from completed at, keyed on the manifest id. The staging upload that survived three disconnects produced exactly one charge.

## Line 11 — The old charge path is gone (Frame 11)

**Time:** 87.0 – 99.0s
**Delivery:** Plain.

    I deleted the old per-post charge path rather than putting it behind a flag. Two charge paths for one upload is the bug this plan exists to remove, and a flag keeps it possible. That also means no quick way back if something depended on it. Accept, or flag?

## Line 12 — Quick check (Frame 12)

**Time:** 99.0 – 108.0s
**Delivery:** Plain.

    Second check. A client crashes at ninety-five percent and starts a new upload of the same file. How many charges: one, two, or none?

## Line 13 — Next: steps 5 and 6 (Frame 13)

**Time:** 108.0 – 112.0s
**Delivery:** Plain.

    Next, part three: the sweeper, the SDK, and what is not done.

## Line 14 — Part three of three (Frame 14)

**Time:** 112.0 – 116.0s
**Delivery:** Plain.

    Part three of three: the sweeper, the SDK, and what is not done.

## Line 15 — Step 5: the sweeper (Frame 15)

**Time:** 116.0 – 126.0s
**Delivery:** Plain.

    Step five, the sweeper. It runs hourly and removes manifests older than twenty-four hours with no completed at. On the staging copy it cleared twelve thousand abandoned manifests in six minutes.

## Line 16 — Why it deletes in batches (Frame 16)

**Time:** 126.0 – 136.0s
**Delivery:** Plain.

    It deletes in batches of five hundred with a two hundred millisecond pause. A single delete of a week of rows locked the table for nine seconds on the staging copy. Accept, or flag?

## Line 17 — Step 6: two SDKs of three (Frame 17)

**Time:** 136.0 – 145.0s
**Delivery:** Plain.

    Step six. The TypeScript and Python clients resume after a reconnect. The Go client does not: it still starts a fresh upload. That is the one part of the plan that is not finished.

## Line 18 — What is not tested (Frame 18)

**Time:** 145.0 – 153.0s
**Delivery:** Plain.

    Two things are untested. The Go client's resume, because it is not written. And load above two hundred concurrent uploads, because staging will not take it.

## Line 19 — What ran (Frame 19)

**Time:** 153.0 – 163.0s
**Delivery:** Plain.

    What ran: two hundred and twelve tests, forty-one of them new. A two gigabyte upload through three disconnects, charged once. And twelve thousand abandoned manifests swept in six minutes, with no lock wait over fifty milliseconds.

## Line 20 — Flag a step, or merge (Frame 20)

**Time:** 163.0 – 173.0s
**Delivery:** Plain.

    That is what landed, with the four calls marked. Flag any of them, draw on a step to ask for a change, or merge it.
