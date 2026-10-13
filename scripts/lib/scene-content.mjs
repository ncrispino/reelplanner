import { headingSource } from "./markdown-source.mjs";
import { storyboardFrames } from "./terms.mjs";

/** The same intended screen evidence and narration for reviewer and frame author. */
export function sceneContent(storyboard, script = "") {
  const source = headingSource(script), heads = [...source.matchAll(/^## Line .*\(Frame (\d+)\)[^\n]*$/gm)], said = {};
  for (let i = 0; i < heads.length; i++) {
    const h = heads[i], block = source.slice(h.index + h[0].length, heads[i + 1]?.index ?? source.length);
    said[Number(h[1])] = block.split("\n").filter((l) => /^ {4}\S/.test(l)).map((l) => l.trim()).join(" ");
  }
  return storyboardFrames(storyboard).sort((a, b) => a.index - b.index).map((f) => ({ ...f,
    narration: said[f.index] || String(f.meta.voiceover || "").replace(/^"|"$/g, "") }));
}

export function visibleContent(f) {
  return `${f.meta.scene ? `_Shows:_ ${f.meta.scene}\n\n` : ""}${f.visible ? `**Intended visible content**\n\n${f.visible}\n\n` : ""}_Says:_ ${f.narration}`;
}
