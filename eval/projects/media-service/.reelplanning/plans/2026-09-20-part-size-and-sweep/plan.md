# Plan: Larger parts and a faster sweep

## Decisions in force

- D-001 the manifest lives in Postgres: the sweep problem is an index, not a location.
- D-002 the server manifest id is the idempotency key: unchanged; the part size is read from the same manifest.

## Supersedes

- D-003 (24 hours before a manifest is abandoned) — with 16 MB parts an interrupted upload holds twice the orphaned bytes per part; six hours still covers 99 % of observed retries on mobile (staging, last 30 days) and halves the sweeper's working set.

## Goal

Cut the number of PUTs per upload and the sweeper's hourly scan time. Mobile clients on the test network lose fewer parts per disconnect with 16 MB parts than with 8 MB, and the sweeper's scan of `upload_manifests` has grown to 9 s.

## Why not the obvious fix

Raising the part size alone changes the manifest's `parts_done` width for in-flight uploads; the sweeper's scan needs an index, not a smaller table.

## Components touched

- **Upload API** (`src/upload/parts.ts`): default part size.
- **Manifest store**: a partial index on `completed_at IS NULL`.
- **Sweeper** (`src/jobs/sweep.ts`): batch deletes.
- **Client SDK**: reads the part size from the manifest instead of a constant.

## Steps

### Step 1 — Part size from the manifest

**What:** `POST /uploads` stores `part_size` (default 16 MB); the SDK reads it from `GET /uploads/:id` instead of a constant.

**Why:** In-flight uploads keep their own part size; new ones get the larger default.

**Alternatives considered:** a global constant bump (breaks resumes in flight).

**Files:** `src/upload/parts.ts`, `packages/sdk/src/upload.ts`

**Risk:** low. **Depends on:** nothing.

### Step 2 — Index for the sweep

**What:** Partial index on `upload_manifests (created_at) WHERE completed_at IS NULL`; the sweeper deletes in batches of 500 with a 200 ms pause.

**Why:** The scan touches only abandoned rows; batches keep lock time under 50 ms.

**Alternatives considered:** move the manifest to an S3 JSON object so there is no table to scan (all upload state in one system; every part write becomes a conditional PUT).

**Files:** `migrations/0047_manifest_sweep_index.sql`, `src/jobs/sweep.ts`

**Risk:** low. **Depends on:** nothing.

## Open questions for the reviewer

1. **Step 2 — how long before a manifest is abandoned? (supersedes D-003)**
   - **6 hours (recommended).** Covers 99 % of observed retries; halves the sweeper's working set.
   - **Keep 24 hours.** Safer for very large uploads over bad links; the sweep index alone may be enough.
