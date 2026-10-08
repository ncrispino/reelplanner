# SCRIPT — l1-upload-resume

**Voice:** am_michael (Kokoro, local)
**Voice settings:** default
**Voice direction:** Brisk, plain, confident. An engineer walking a peer through a plan. Say step numbers clearly.

---

## Line 1 — Hook (Frame 1)

**Time:** 0.0 – 7.0s
**Delivery:** Matter-of-fact; sting on "twice".

    A two-gigabyte upload dies at ninety percent. Today it restarts from zero — and a racing retry bills the customer twice.

## Line 2 — Tension (Frame 2)

**Time:** 7.0 – 16.0s
**Delivery:** "You'd reach for" is the reviewer's own instinct; land the three failures as beats.

    The fix you'd reach for is a client retry loop. But that throws away the bytes already on the server, double-charges, and hides the failure.

## Line 3 — Six pieces (Frame 3)

**Time:** 16.0 – 23.0s
**Delivery:** Even list cadence, one name per beat.

    Six pieces: the client SDK, the upload API, a new manifest store, the blob store, the billing hook, and a sweeper.

## Line 4 — Step 1 (Frame 4)

**Time:** 23.0 – 32.0s
**Delivery:** Signpost.

    Step one — the manifest. Before the API accepts a single byte, it writes a manifest row. A crash anywhere later leaves a record.

## Line 5 — Step 2 (Frame 5)

**Time:** 32.0 – 42.0s
**Delivery:** Signpost; shrug on "changes nothing".

    Step two — parts. Each PUT lands one chunk in the blob store and flips one bit in the manifest, same transaction. Re-sending a done part changes nothing.

## Line 6 — Step 3 (Frame 6)

**Time:** 42.0 – 51.0s
**Delivery:** Signpost.

    Step three — resume. The client asks the API which bits are set; complete verifies them all and closes the multipart upload.

## Line 7 — Step 4 (Frame 7)

**Time:** 51.0 – 61.0s
**Delivery:** Signpost; the last sentence is the payoff.

    Step four — billing moves to complete, keyed on the manifest id. A second call sees completed at and does nothing. That's the double-charge gone.

## Line 8 — Step 5 (Frame 8)

**Time:** 61.0 – 70.0s
**Delivery:** Signpost.

    Step five — the sweeper. Manifests a day old with no completion get aborted, their parts deleted. That's the storage leak closed.

## Line 9 — Step 6 (Frame 9)

**Time:** 70.0 – 77.0s
**Delivery:** Signpost; quick.

    Step six — the SDK keeps its upload id, asks what's missing, and sends only those parts.

## Line 10 — Callback (Frame 10)

**Time:** 77.0 – 84.0s
**Delivery:** Warm.

    Same crash at ninety percent. Now the client resumes from ninety, and billing fires once.

## Line 11 — Risks (Frame 11)

**Time:** 84.0 – 91.0s
**Delivery:** Level, honest.

    Two things to watch: the sweeper is the only bound on manifest growth, and old SDKs work but never resume.

## Line 12 — Open questions (Frame 12)

**Time:** 91.0 – 104.0s
**Delivery:** Direct address; each question its own beat; the CTA plain.

    Three calls for you. Step one: Postgres or S3 for the manifest? Step four: client idempotency keys now, or later? Step five: is twenty-four hours right? Draw on any step to leave a note, or approve.
