import { findUp } from "find-up";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { x } from "tinyexec";

const [base, ...args] = process.argv.slice(2);

const cwd = process.cwd();
const root = path.dirname(await findUp("pnpm-workspace.yaml", { cwd }));

const dirStale = path.join(root, "dist-stale", `.${base}`);
const dirDist = path.join(root, "dist", `.${base}`);

// console.log({
//   cwd,
//   base,
//   args,
//   root,
//   dirStale,
//   dirDist,
// })

if (existsSync(dirStale)) {
  console.log("Stale directory found, copying to dist");
  await (existsSync(dirDist)
    ? fs.rm(dirDist, { recursive: true })
    : fs.mkdir(path.dirname(dirDist), { recursive: true }));
  await fs.cp(dirStale, dirDist, { recursive: true });
} else {
  console.log("No stale directory found, building");

  const command = [
    "slidev",
    "build",
    "--base",
    base,
    "--out",
    `../../dist${base}`,
    ...args,
  ];

  console.log("Building", command.join(" "));

  await x("npx", command, {
    nodeOptions: {
      cwd,
      stdio: "inherit",
    },
  });
}
