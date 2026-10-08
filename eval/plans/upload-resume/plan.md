# Plan: Make uploads survive a server restart

**Repo:** `media-service` · **Author:** agent · **Estimated size:** 6 steps, ~400 LOC

## Goal

A file upload that is interrupted by a server restart, deploy, or crash resumes from where it left off instead of failing and forcing the client to start over. Today a 2 GB upload that dies at 90% restarts from zero, and if the client's retry happens to succeed twice we bill the customer for two uploads.

## Why not the obvious fix

The obvious fix is a retry loop in the client SDK: on a 5xx, re-send the file. We rejected it because:

1. It loses partial state. The bytes already on the server are thrown away, so a 90%-done upload costs 190% of the bandwidth.
2. It double-charges. The billing hook fires on `POST /uploads` completion, and a retried upload that races the original's late completion produces two billing events for one file.
3. It hides the failure. Nothing on the server knows an upload was interrupted, so we can't sweep orphaned blobs.

The fix has to live on the server, and it has to be write-ahead: we record the intent to upload before the first byte lands.

## Components touched

- **Upload API** (`src/upload/`): the `POST /uploads` and `PUT /uploads/:id/parts/:n` handlers.
- **Manifest store**: new. Where in-flight upload state lives.
- **Blob store** (`src/blob/`): S3-compatible object storage where parts land.
- **Billing hook** (`src/billing/onUploadComplete.ts`).
- **Sweeper** (`src/jobs/`): the cron-style job runner.
- **Client SDK** (`packages/sdk/`).

## Steps

### Step 1 — Write-ahead upload manifest

**What:** Add a `upload_manifests` table (Postgres) with columns `id`, `file_size`, `part_size`, `parts_done` (bitmap), `created_at`, `completed_at`. `POST /uploads` inserts a manifest row **before** returning the upload id to the client, and before any byte is accepted.

**Why:** A crash at any later point leaves a durable record we can resume from. If we wrote the manifest after the first part, a crash during the first part would be invisible.

**Alternatives considered:** write the manifest after the first part lands (simpler, but a crash during part 1 is invisible); keep upload state only in the client (loses it on app restart).

**Files:** `src/upload/manifest.ts`, `migrations/0042_upload_manifests.sql`

**Risk:** low. **Depends on:** nothing.

### Step 2 — Chunked parts with idempotent PUT

**What:** Replace the single-stream `POST` body with `PUT /uploads/:id/parts/:n`. Each part is written to the blob store under `uploads/<id>/<n>` and the manifest's `parts_done` bit is set in the same transaction. A repeated PUT for a part already marked done returns 200 without rewriting.

**Why:** Parts are the unit of resumption. Idempotent PUT means the client can blindly re-send any part after a reconnect and never corrupt state.

**Alternatives considered:** keep a single streaming POST with HTTP Range resume (S3 multipart cannot append to a stream, and range semantics on a live object are undefined); smaller 1 MB parts (below the 5 MB S3 minimum, and 2,000 manifest bits per 2 GB file).

**Files:** `src/upload/parts.ts`, `src/blob/put.ts`

**Risk:** medium. The part size (8 MB default) interacts with S3 multipart minimums; below 5 MB S3 rejects the part.

**Depends on:** Step 1.

### Step 3 — Resume endpoint

**What:** `GET /uploads/:id` returns the manifest's `parts_done` so a reconnecting client knows which parts to skip. `POST /uploads/:id/complete` verifies all bits set, issues the S3 CompleteMultipartUpload, and stamps `completed_at`.

**Why:** Resumption is a client-side decision informed by server-side truth. The server never guesses which parts arrived.

**Alternatives considered:** let the client track its own sent parts (drifts from server truth after a crash); infer completion server-side on the last PUT (races when parts arrive out of order).

**Files:** `src/upload/resume.ts`, `src/upload/complete.ts`

**Risk:** low. **Depends on:** Steps 1, 2.

### Step 4 — Move billing to manifest completion

**What:** The billing hook moves from the `POST /uploads` handler to the `complete` handler, keyed on the manifest id. A `completed_at` that is already set makes `complete` a no-op and emits no billing event.

**Why:** This is what kills the double-charge. Billing fires exactly once per manifest, and the manifest id is the idempotency key.

**Alternatives considered:** dedupe in the billing service by file hash (needs the whole file hashed twice, and legitimate duplicate uploads would be dropped); keep billing on POST and refund duplicates (customer sees two charges first).

**Files:** `src/billing/onUploadComplete.ts`

**Risk:** medium. There is a window between the S3 complete call and the `completed_at` write; if we crash inside it, a second `complete` would re-issue the S3 call, which S3 rejects with `NoSuchUpload`. We treat that error as success.

**Depends on:** Step 3.

### Step 5 — Sweeper for abandoned manifests

**What:** A job in `src/jobs/sweepUploads.ts` runs hourly, finds manifests older than 24h with no `completed_at`, aborts the S3 multipart upload, deletes the parts, and marks the manifest `abandoned`.

**Why:** Without it, every interrupted upload that never resumes leaks blob storage forever and the manifests table grows without bound.

**Alternatives considered:** S3 lifecycle rules on the parts prefix (cleans blobs but never the manifest rows, and the window is per-bucket not per-upload); sweep on the next resume attempt (never runs for clients that never come back).

**Files:** `src/jobs/sweepUploads.ts`

**Risk:** low. **Depends on:** Steps 1, 2.

### Step 6 — SDK resume support

**What:** `packages/sdk/upload.ts` persists the upload id locally, calls `GET /uploads/:id` on reconnect, and re-sends only the missing parts.

**Why:** Nothing above helps if the client throws away the upload id.

**Alternatives considered:** server-issued resume tokens in a cookie (breaks for non-browser clients); no SDK change and document the endpoints (nobody resumes in practice).

**Files:** `packages/sdk/upload.ts`

**Risk:** low. **Depends on:** Step 3.

## After this lands

A crash at any point leaves a manifest. The client reconnects, asks which parts are missing, sends only those, and `complete` fires billing exactly once. Abandoned uploads are cleaned up within a day.

## Risks

- Manifest table growth is bounded only by the sweeper (Step 5). If the sweeper is disabled, growth is unbounded.
- The S3 multipart abort in Step 5 is eventually consistent; a part written after the abort is orphaned. Rare, but real.
- Client SDK upgrade is required for resumption; old clients keep working but never resume.

## Open questions for the reviewer

Each one is a real fork. The plan above assumes the recommended option; choosing the other changes the steps noted.

1. **Step 1 — where does the manifest live?**
   - **Postgres (recommended).** `parts_done` flips inside the same transaction as the part write, so step 2's idempotency is free. Cost: one more table to migrate and back up.
   - **S3 JSON object next to the parts.** All upload state in one system, no migration. Cost: each part write becomes a conditional PUT on the manifest object (ETag match) with a retry loop, and step 2 grows by roughly a day.
2. **Step 4 — who owns the idempotency key?**
   - **Server manifest id (recommended for v1).** No SDK change beyond step 6; a client that loses the id starts a new upload and pays once for each file it actually completes.
   - **Client-generated key now.** Protects against a client that retries `POST /uploads` itself. Cost: a `(customer, key)` unique index and a 409 path in the API, plus SDK changes in every language we ship.
3. **Step 5 — how long before a manifest is abandoned?**
   - **24 hours (recommended).** Bounds blob storage at one day of interrupted uploads; mobile clients on flaky networks almost always retry within hours.
   - **7 days.** Safer for very large uploads over bad links. Cost: up to a week of orphaned parts per abandoned upload, and the sweeper's table scan grows with it.
