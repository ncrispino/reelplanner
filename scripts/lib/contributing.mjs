// Several people, one repo (the contributing plan): who is a maintainer, what a PR carries, and the
// decision log written the one way `reel record` and `reel renumber` both write it.
//
//   maintainersOf(rp)          config.json's `maintainers`: each "id:<id>", the hosted page's viewer id as
//                              `reel record` writes it, or an email (git's user.email, a review sent from
//                              the local page). "owner" still reads, with a warning: see maintainerOf. []
//                              when unset: a repo with one person, where every review counts as today.
//   maintainerOf(review, list) whether a filed review is by one of them, and by what (the id, the email, or
//                              the "owner" fallback, with its warning)
//   isMaintainer(who, list)    whether a recorded reviewer string is one of them (an email in any case)
//   roleOf(review, list)       "maintainer", "contributor", or "anyone" in a repo that lists no maintainers
//   writeLedger(rp, ledger)    decisions.json, and decisions.md regenerated from it
//   MEDIA                      the files no plan folder may add (a voice file, an image, a video)
//   issueRule(configText)      config.json's `pr.issue`: "required" (every PR links an issue) or "off" (the default)
//   linkedIssues(body)         the issues a PR's text links: "#12", "owner/repo#12" or an issues URL, with or
//                              without "Closes"/"Fixes"/"Refs"; not inside a comment or code, as GitHub reads it
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./env.mjs";

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };

/** The maintainers listed in <rp>/config.json, trimmed; [] when there are none. */
export function maintainersOf(rp) {
  const m = readJson(join(rp, "config.json"))?.maintainers;
  return Array.isArray(m) ? m.map((x) => String(x).trim()).filter(Boolean) : [];
}

/** A recorded reviewer ("owner", "id:…", an email) is one of `list`. An email matches in any case. */
export function isMaintainer(who, list) {
  const w = String(who || "").trim();
  if (!w) return false;
  return list.some((m) => m === w || (m.includes("@") && m.toLowerCase() === w.toLowerCase()));
}

/** Who a filed review is by, for `maintainers`: `who` as recorded ("owner", "id:…", an email) and `id`, the
 *  hosted page's viewer id ("id:…"), which `reel record` keeps for the page's owner too (lib/reviews.mjs recordedBy). */
export function identityOf(review) {
  const r = review?.recorded || {}, who = String(r.reviewer || "").trim();
  return { who, id: String(r.id || (who.startsWith("id:") ? who : "")).trim() };
}

/**
 * Whether a filed review is by one of `list`: { is, by, warn }. `by` is "id" (the viewer id the hosted page
 * sent: one person in the organization, whichever page they review on), "email" (git's user.email, a review
 * sent from the local page; any case), or "owner". "owner" is who published the page the review was sent
 * from: every person reviewing on a page of their own is its owner, so it cannot tell two people apart. It
 * still matches a review recorded as "owner", so a repo that lists it keeps working, with `warn` saying to
 * list the id instead (the review's own, when it carries one). Listed beside an id, "owner" matches only
 * reviews that carry no id (recorded before reelplanner kept the owner's), with no warning.
 */
export function maintainerOf(review, list) {
  const { who, id } = identityOf(review);
  if (id && list.includes(id)) return { is: true, by: "id", warn: "" };
  if (who && who !== "owner" && isMaintainer(who, list)) return { is: true, by: who.includes("@") ? "email" : "id", warn: "" };
  // Listed beside ids, "owner" covers only reviews recorded before the owner's id was kept: one with an id is judged by it.
  if (who === "owner" && list.includes("owner") && list.some((m) => m.startsWith("id:")))
    return id ? { is: false, by: null, warn: "" } : { is: true, by: "owner", warn: "" };
  if (who === "owner" && list.includes("owner"))
    return { is: true, by: "owner", warn: `counted as a maintainer's because config.json's maintainers lists "owner", which names whoever published the review page, on anyone's page: ${id ? `list this reviewer as "${id}" in its place` : `this review carries no viewer id (recorded before reelplanner kept the owner's); the next one sent from the hosted page does, and \`reel record\` names it to list in "owner"'s place`}` };
  return { is: false, by: null, warn: "" };
}

/** Whose a filed review is: "maintainer", "contributor", or "anyone" in a repo that lists no maintainers. */
export function roleOf(review, list) {
  if (!list.length) return "anyone";
  return maintainerOf(review, list).is ? "maintainer" : "contributor";
}

/** config.json's `pr.issue` from its text: "required" when it says so, else "off". */
export function issueRule(configText) {
  try { return JSON.parse(configText)?.pr?.issue === "required" ? "required" : "off"; } catch { return "off"; }
}

/** The issues a PR's text links, as written ("#12", "owner/repo#12", an issues URL), in order, once each.
 *  An HTML comment (the template's hints), a code block and inline code are left out, as GitHub links none of them. */
export function linkedIssues(body) {
  const text = String(body || "").replace(/<!--[\s\S]*?(?:-->|$)/g, " ").replace(/^(```|~~~)[^\n]*\n[\s\S]*?(?:^\1[^\n]*$|(?![\s\S]))/gm, " ").replace(/`[^`\n]*`/g, " ");
  const re = /\bhttps?:\/\/[^\s/]+\/[\w.-]+\/[\w.-]+\/issues\/\d+\b|(?<![\w/&.-])(?:[\w.-]+\/[\w.-]+)?#\d+\b/g;
  return [...new Set(text.match(re) || [])];
}

// A voice file, an image or a video: never under .reelplanner/plans/ in a PR (D-213); fonts and text are fine.
export const MEDIA = /\.(wav|mp3|m4a|aac|ogg|oga|opus|flac|png|jpe?g|gif|webp|avif|bmp|tiff?|mp4|m4v|webm|mov|mkv|avi)$/i;

/** decisions.json as given, and decisions.md regenerated from it (the table, then each entry). */
export function writeLedger(rp, ledger) {
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(ledger, null, 2) + "\n");
  // A decision made in conversation has no recommendation on record (`recommended: null`): not flagged as against it.
  const rows = ledger.decisions.map((d) => `| ${d.id} | ${d.date} | ${d.plan} | ${d.step ?? ""} | ${d.question} | **${d.chosen}**${d.recommended === false ? " (not the recommendation)" : ""}${d.tags?.length ? ` [${d.tags.join(", ")}]` : ""} | ${d.status}${d.supersededBy ? ` by ${d.supersededBy}` : d.supersededByPlan ? ` by the plan ${d.supersededByPlan}` : d.foldedInto ? ` into ${d.foldedInto}` : ""}${d.supersedes?.length ? `, supersedes ${d.supersedes.join(", ")}` : ""} |`);
  const details = ledger.decisions.map((d) => `### ${d.id} — ${d.question}\n\n- **Chosen:** ${d.chosen}${d.why ? ` — ${d.why}` : ""}\n- **Not chosen:** ${(d.options || []).filter((o) => o.id !== d.chosenId && !(d.chosenIds || []).includes(o.id)).map((o) => `${o.label}${o.why ? ` (${o.why})` : ""}`).join("; ") || "—"}${d.note ? `\n- **Note:** ${d.note}` : ""}${d.own ? `\n- **The reviewer's words:** ${d.own}` : ""}\n- **Where:** ${d.plan}, step ${d.step ?? "?"}${d.stepTitle ? ` (${d.stepTitle})` : ""}; components: ${(d.components || []).join(", ") || "—"}\n- **Status:** ${d.status}${d.supersededBy ? `, superseded by ${d.supersededBy} on ${d.supersededOn}` : d.supersededByPlan ? `, superseded by the plan ${d.supersededByPlan} as a whole on ${d.supersededOn}` : d.foldedInto ? `, folded into ${d.foldedInto} on ${d.foldedOn}` : ""}${d.supersedes?.length ? `; supersedes ${d.supersedes.join(", ")}` : ""}\n`);
  const head = readFileSync(join(ROOT, "templates", "reelplanner", "decisions.md"), "utf8").trim();
  writeFileSync(join(rp, "decisions.md"), `${head}\n${rows.join("\n")}\n\n${details.join("\n")}`);
}

/** The same entry, whatever its id and status: what it decided, where, when. */
export const entryKey = (d) => JSON.stringify([d.plan, d.questionId, d.date, d.question, d.chosen, d.verdict || null]);

