// Details: the pages of a video's guide that a beat opens (`- detail: <name>` in STORYBOARD.md; the guide
// sits under the video, D-264). The templates a page starts from, and the tags a storyboard carries.
// Shared by detail.mjs (starts a page) and check-details.mjs (fails the build on a broken one).

/** The templates a detail can start from, and what each is for (style guide §10): templates/details/<kind>.html.
 *  A beat's `detail_kind` is a free word (D-085): these are starting points, and any other kind starts from `fresh`. */
export const KINDS = {
  explore: "the frame's diagram, live: click a part, step through a run and watch the state fill in",
  try: "a working prototype, variants as tabs: things the reviewer uses instead of pictures",
  evidence: "the runs or data behind a number or a claim the video makes",
  table: "anything with more than four rows, sortable, each cell copies",
  code: "only when the code itself is what is judged: an API contract, a tricky function, a migration (D-023)",
  fresh: "none of the above fits: a blank page with the theme and the bridge (D-024)",
};

/** A detail's name is its file name and its tag: lower-case letters, digits and dashes. */
export const NAME = /^[a-z0-9][a-z0-9-]*$/;

/** Every beat in STORYBOARD.md that carries a detail tag: [{ frame, title, name, kind, detailTitle, why, count }]. */
export function storyboardDetails(sb) {
  const out = [];
  for (const b of sb.split(/\n(?=## Frame )/).slice(1)) {
    const head = b.match(/^## Frame (\d+) — (.+)$/m);
    const tags = [...b.matchAll(/^- (detail(?:_[a-z]+)?):\s*(.*)$/gm)];
    const names = tags.filter((m) => m[1] === "detail").map((m) => m[2].trim());
    if (!tags.length) continue;
    const get = (k) => (tags.find((m) => m[1] === k) || [])[2]?.trim() || null;
    out.push({ frame: head ? Number(head[1]) : null, title: head ? head[2].trim() : null, name: names[names.length - 1] || null, names, kind: get("detail_kind"), detailTitle: get("detail_title"), why: get("detail_why") });
  }
  return out;
}
