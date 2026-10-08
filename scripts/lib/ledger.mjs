// What a decision in the log is to a new plan (D-306): a rule it is bound by, or history.
//
//   rules     the owner's answers to a plan's questions, their own words, and their edits: binding. `reel check`
//             asks a plan touching their component to cite each one (or the spec.md section it is folded into).
//   history   the agent's calls a walkthrough accepted (`kind: "autonomy"`): still in the log, in the guides and the
//             walkthroughs, but never asked for by component. One comes back only when a change touches the lines
//             its plan's commits wrote (lib/call-lines.mjs).
//   folded    a rule whose words now live in a section of spec.md (`status: "folded"`, `foldedInto: "spec.md#<anchor>"`,
//             `foldedOn`): in force as before, cited by that section instead of its id (`reel fold`).
//
//   inForce(d)      active or folded: the log still holds the plan to it
//   isCall(d)       an agent's call, whatever its verdict
//   isRule(d)       in force and not an agent's call: binding
//   isHistory(d)    an accepted call in force: history
//   specCites(text) the spec.md sections a plan's text names ("spec.md#rules-player")
//   FOLDED_INTO     the anchor a component's rules get in spec.md
export const inForce = (d) => d?.status === "active" || d?.status === "folded";
export const isCall = (d) => d?.kind === "autonomy";
export const isRule = (d) => inForce(d) && !isCall(d);
export const isHistory = (d) => inForce(d) && isCall(d);
export const specCites = (text) => [...new Set([...String(text || "").matchAll(/\bspec\.md#([a-z0-9][a-z0-9-]*)/gi)].map((m) => `spec.md#${m[1].toLowerCase()}`))];
export const FOLDED_INTO = (component) => `spec.md#rules-${component}`;
/** Whether spec.md's text has the section `ref` ("spec.md#rules-player") names: an `<a id>` or a heading of that slug. */
export function specHas(spec, ref) {
  const anchor = String(ref).replace(/^spec\.md#/, "");
  if (new RegExp(`id="${anchor}"`).test(spec)) return true;
  const slug = (h) => h.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
  return [...String(spec).matchAll(/^#{1,6}\s+(.+)$/gm)].some((m) => slug(m[1]) === anchor);
}
