// The icons the sketch page puts in Excalidraw's library (the Library button, top right): the parts people draw
// over and over on a whiteboard (a database, a queue, a user, a phone, a server, a cloud), each a few of Excalidraw's
// own shapes grouped with a label under it. Native shapes, not pictures: they draw at once, take a colour, a dash or
// an arrow like any box, and every part carries customData.icon, so sketch.md says `database "Orders DB"` rather
// than an ellipse and two lines. Rename one by double-clicking its label.
window.reelIcons = (convertToExcalidrawElements) => {
  const R = (x, y, width, height, more = {}) => ({ type: "rectangle", x, y, width, height, ...more });
  const E = (x, y, width, height, more = {}) => ({ type: "ellipse", x, y, width, height, ...more });
  const L = (points, more = {}) => { const xs = points.map((q) => q[0]), ys = points.map((q) => q[1]);   // its size given: else a line is 100 wide
    return { type: "line", x: points[0][0], y: points[0][1], width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys), points: points.map(([x, y]) => [x - points[0][0], y - points[0][1]]), ...more }; };
  const round = { roundness: { type: 2 } };
  const ICONS = [
    ["database", "Database", [E(0, 0, 70, 20), L([[0, 10], [0, 60]]), L([[70, 10], [70, 60]]), E(0, 50, 70, 20)]],
    ["queue", "Queue", [R(0, 15, 100, 40), L([[25, 15], [25, 55]]), L([[50, 15], [50, 55]]), L([[75, 15], [75, 55]])]],
    ["user", "User", [E(25, 0, 30, 30), L([[5, 72], [8, 50], [22, 38], [58, 38], [72, 50], [75, 72]], round)]],
    ["browser", "Web app", [R(0, 0, 90, 65), L([[0, 16], [90, 16]]), E(6, 5, 6, 6), E(15, 5, 6, 6), E(24, 5, 6, 6)]],
    ["phone", "Mobile app", [R(20, 0, 44, 76, round), L([[34, 67], [50, 67]])]],
    ["server", "Service", [R(0, 0, 80, 22), R(0, 26, 80, 22), R(0, 52, 80, 22), E(64, 8, 6, 6), E(64, 34, 6, 6), E(64, 60, 6, 6)]],
    ["cloud", "Cloud", [E(0, 25, 42, 36), E(20, 8, 48, 44), E(48, 22, 42, 38), L([[12, 60], [80, 60]])]],
    ["cache", "Cache", [R(0, 8, 80, 58), L([[46, 14], [30, 40], [48, 40], [34, 62]])]],
    ["lock", "Auth", [R(10, 32, 60, 40), L([[22, 32], [22, 16], [32, 6], [48, 6], [58, 16], [58, 32]], round)]],
    ["file", "File", [L([[0, 0], [50, 0], [70, 20], [70, 78], [0, 78], [0, 0]]), L([[50, 0], [50, 20], [70, 20]])]],
    ["clock", "Scheduled job", [E(0, 0, 72, 72), L([[36, 36], [36, 12]]), L([[36, 36], [54, 44]])]],
    ["mail", "Email", [R(0, 8, 86, 56), L([[0, 8], [43, 40], [86, 8]])]],
    ["external", "External API", [E(0, 0, 72, 72), E(20, 0, 32, 72), L([[0, 36], [72, 36]])]],
  ];
  return ICONS.map(([icon, label, parts], n) => {
    const glyph = convertToExcalidrawElements(parts);
    const right = (e) => e.points ? e.x + Math.max(...e.points.map((q) => q[0])) : e.x + e.width, bottom = (e) => e.points ? e.y + Math.max(...e.points.map((q) => q[1])) : e.y + e.height;
    const w = Math.max(...glyph.map(right)), h = Math.max(...glyph.map(bottom));
    const [text] = convertToExcalidrawElements([{ type: "text", x: 0, y: h + 8, text: label, fontSize: 16 }]);
    const group = `reel-icon-${icon}`;
    const elements = [...glyph, { ...text, x: Math.round(w / 2 - text.width / 2) }]
      .map((e) => ({ ...e, groupIds: [group], customData: { icon } }));
    return { id: `reel-icon-${icon}`, status: "published", created: 1760000000000 + n, name: label, elements };
  });
};
