// Discover built videos without changing the owning repository or its records.
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { realPath, repoRoot, rpDirOf, rpInitialized } from "./env.mjs";

export function discoverReviewProjects(from = process.cwd()) {
  const seen = new Set(), projects = [];
  const add = (path) => {
    if (!existsSync(join(path, "index.html"))) return;
    const real = realPath(path); if (seen.has(real)) return;
    seen.add(real); projects.push({ path: real, repo: realPath(repoRoot(real)) });
  };
  const directories = (path) => existsSync(path) ? readdirSync(path).filter((name) => statSync(join(path, name)).isDirectory()).sort().reverse() : [];
  for (let dir = realPath(resolve(from)), depth = 0; depth < 12; depth++, dir = dirname(dir)) {
    // Source projects beside the current/ancestor folder, plus its initialized library.
    if (existsSync(join(dir, "plan-map.json"))) add(dir);
    for (const name of directories(join(dir, "videos"))) add(join(dir, "videos", name));
    const rp = rpDirOf(dir);
    if (rpInitialized(rp)) {
      add(join(rp, "system-video"));
      for (const name of directories(join(rp, "plans"))) {
        add(join(rp, "plans", name, "video")); add(join(rp, "plans", name, "walkthrough-video"));
      }
      for (const name of directories(join(rp, "explainers"))) add(join(rp, "explainers", name, "video"));
    }
    if (dirname(dir) === dir) break;
  }
  return projects;
}
