// Mask fenced code without changing UTF-16 offsets or line endings.
export function headingSource(md) {
  let fence = null;
  return String(md).split("\n").map((line) => {
    if (fence) {
      const close = /^ {0,3}(`+|~+)[ \t\r]*$/.exec(line);
      if (close && close[1][0] === fence.marker && close[1].length >= fence.length) fence = null;
      return line.replace(/[^\r]/g, " ");
    }
    const open = /^ {0,3}(`{3,}|~{3,})([^\r]*)\r?$/.exec(line);
    if (open && (open[1][0] === "~" || !open[2].includes("`"))) {
      fence = { marker: open[1][0], length: open[1].length };
      return line.replace(/[^\r]/g, " ");
    }
    return line;
  }).join("\n");
}
