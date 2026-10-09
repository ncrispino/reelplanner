// Each frame's thumbnail in plan-map.json (`frames[].thumb`): one of the pictures in the video's snapshots/,
// which `reelplanner snapshot` (verify's step 5) takes at every frame's midpoint, named frame-NN-at-<t>s.png.
//
// plan-map writes the map in finish-project, before verify takes the pictures, so the map a build first writes
// names the last build's pictures (none, on a first build) and every one that moved was a missing file once
// the new ones replaced them. snapshot.sh therefore ends with `plan-map --thumbs`, which sets the thumbnails
// again from the pictures just taken and leaves the rest of the map (and plan-diff's `changes`) as it is.
//
// snapshots/ is kept out of git (.reelplanner/.gitignore: rebuilt by the pipeline), so a thumb names a file
// only where the video was built or snapshotted.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** The pictures in `<dir>/snapshots`, with the second each was taken at: [{ file, t }], in time order. */
export function snapshotsIn(dir) {
  const snapDir = join(dir, "snapshots");
  if (!existsSync(snapDir)) return [];
  return readdirSync(snapDir).map((f) => { const m = f.match(/^frame-\d+-at-([\d.]+)s\.png$/); return m ? { file: f, t: parseFloat(m[1]) } : null; })
    .filter(Boolean).sort((a, b) => a.t - b.t);
}

/**
 * Set each frame's `thumb` from `snaps`: of the pictures taken while the frame is on screen, the one nearest its
 * midpoint; with none inside it, the nearest to the midpoint within one frame length of it; else no thumb (a
 * thumb left from an earlier set of pictures is removed). Returns how many frames have one.
 */
export function attachThumbs(frames, snaps) {
  let n = 0;
  for (const f of frames) {
    const len = f.durationSeconds || 0, mid = f.start + len / 2, off = (s) => Math.abs(s.t - mid);
    const nearest = (list) => list.reduce((best, s) => (!best || off(s) < off(best) ? s : best), null);
    const pick = nearest(snaps.filter((s) => s.t >= f.start && s.t < f.start + len)) || nearest(snaps);
    if (pick && off(pick) < len) { f.thumb = `snapshots/${pick.file}`; n++; }
    else delete f.thumb;
  }
  return n;
}
