import * as path from "path";
import { BuildOptions, buildSync } from "esbuild";

const entryPoints = [path.resolve("src/main.ts"), path.resolve("src/preload.ts"), path.resolve("src/torrent.ts")];
const external = ["electron"];

const options: BuildOptions = {
  platform: "node",
  entryPoints,
  bundle: true,
  target: "node16.13.0",
  sourcemap: false,
  legalComments: "none",
  outdir: "dist/main",
  external,
  minify: true,
  treeShaking: true,
};

buildSync(options);
