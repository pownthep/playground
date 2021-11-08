import * as path from "path";
import { BuildOptions, build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import copy from "esbuild-plugin-copy";

const entryPoints = [
  path.resolve("src/background.ts"),
  path.resolve("src/content.ts"),
  path.resolve("src/lib/popup.tsx"),
];

const options: BuildOptions = {
  platform: "browser",
  entryPoints,
  bundle: true,
  target: "chrome96",
  sourcemap: false,
  legalComments: "none",
  outdir: `dist`,
  minify: true,
  treeShaking: true,
  plugins: [
    <any>sassPlugin(),
    copy({
      assets: {
        from: ["./public/*"],
        to: ["./"],
      },
    }),
  ],
  logLevel: "info",
  publicPath: path.resolve("public"),
};

build(options);
