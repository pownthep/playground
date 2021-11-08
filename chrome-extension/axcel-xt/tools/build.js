"use strict";
exports.__esModule = true;
var path = require("path");
var esbuild_1 = require("esbuild");
var esbuild_sass_plugin_1 = require("esbuild-sass-plugin");
var esbuild_plugin_copy_1 = require("esbuild-plugin-copy");
var entryPoints = [
    path.resolve("src/background.ts"),
    path.resolve("src/content.ts"),
    path.resolve("src/lib/popup.tsx"),
];
var options = {
    platform: "browser",
    entryPoints: entryPoints,
    bundle: true,
    target: "chrome96",
    sourcemap: false,
    legalComments: "none",
    outdir: "dist",
    minify: true,
    treeShaking: true,
    plugins: [
        (0, esbuild_sass_plugin_1.sassPlugin)(),
        (0, esbuild_plugin_copy_1["default"])({
            assets: {
                from: ["./public/*"],
                to: ["./"]
            }
        }),
    ],
    logLevel: "info",
    publicPath: path.resolve("public")
};
(0, esbuild_1.build)(options);
