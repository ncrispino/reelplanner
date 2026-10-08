# Glossary

One name per thing. A plan, a script or a storyboard uses these words and no synonyms. Add a row when a plan introduces a part; never rename a row (add the old name under "also called", then stop using it).

| Term | id (`system.json`) | Meaning | Also called (do not use) |
|---|---|---|---|
| Client SDK | `sdk` | the library apps use to upload; TypeScript, Python, Go | client library |
| Upload API | `api` | the HTTP handlers under `src/upload/` | upload service, uploader |
| Manifest store | `manifest` | the durable record of an in-flight upload: size, part size, `parts_done` bitmap, timestamps (Postgres, D-001) | upload record, session |
| part | — | one fixed-size slice of a file, written with `PUT /uploads/:id/parts/:n` | chunk, segment |
| Blob store | `blob` | S3-compatible object storage where parts land | S3, bucket |
| Billing | `billing` | the hook that charges a customer once per completed upload | charge job |
| Sweeper | `sweeper` | the hourly job that deletes abandoned manifests and their parts | cleaner, GC |
| complete | — | `POST /uploads/:id/complete`: all bits set → CompleteMultipartUpload, `completed_at` stamped | finalize |
