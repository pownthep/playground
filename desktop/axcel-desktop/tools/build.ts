import * as path from "path";
import { BuildOptions, build } from "esbuild";
import copy from "esbuild-plugin-copy";

const entryPoints = [path.resolve("src/main.ts")];
const external = ["electron"];

const options: BuildOptions = {
  platform: "node",
  entryPoints,
  bundle: true,
  target: "node16.9.1",
  sourcemap: true,
  legalComments: "none",
  outdir: "dist/main",
  external,
  minify: false,
  treeShaking: true,
  plugins: [
    copy({
      assets: {
        from: ["./resources/*"],
        to: ["./"],
      },
    }),
  ],
};

build(options);
