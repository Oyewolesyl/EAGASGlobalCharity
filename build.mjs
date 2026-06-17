import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const staticExtensions = new Set([".html", ".css", ".js"]);

if (existsSync(dist)) {
  rmSync(dist, { recursive: true, force: true });
}

mkdirSync(dist, { recursive: true });

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.name === "dist" || entry.name === ".git" || entry.name === "node_modules") continue;

  const source = join(root, entry.name);
  const target = join(dist, entry.name);

  if (entry.isDirectory() && entry.name === "public") {
    cpSync(source, target, { recursive: true });
  }

  if (entry.isFile() && staticExtensions.has(extname(entry.name))) {
    cpSync(source, target);
  }
}
