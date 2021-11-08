import * as path from "path";
import { BuildOptions, build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import * as fs from "fs";
import builtinModules = require("builtin-modules");

const apps = JSON.parse(fs.readFileSync("apps.json", "utf-8"));

const external = ["electron", ...builtinModules];

apps.forEach((app) => {
  const optionsBrowser: BuildOptions = {
    platform: "browser",
    entryPoints: [path.resolve(`src/${app.name}/${app.entry}`)],
    bundle: true,
    target: "chrome96",
    sourcemap: false,
    legalComments: "none",
    outdir: `dist/${app.name}`,
    external,
    minify: true,
    treeShaking: true,
    plugins: [<any>sassPlugin()],
    logLevel: "info",
  };

  const optionsNode: BuildOptions = {
    platform: "node",
    entryPoints: app.workers.map((worker) => path.resolve(`src/${app.name}/${worker.entry}`)),
    bundle: true,
    target: "node16",
    sourcemap: false,
    legalComments: "none",
    outdir: `dist/${app.name}`,
    external,
    minify: true,
    treeShaking: true,
    logLevel: "info",
  };

  build(optionsNode).then(() => {
    const workers = app.workers.reduce((prev, curr) => {
      prev += `<script type="text/js-worker" id="${curr.name}">${fs.readFileSync(
        path.join(process.cwd(), `dist/${app.name}/${curr.name}.js`),
        "utf-8"
      )}</script>`;
      return prev;
    }, "");

    build(optionsBrowser).then(() => {
      const styles = fs.readFileSync(`./dist/${app.name}/${app.name}.css`, "utf-8");
      const script = fs.readFileSync(`./dist/${app.name}/${app.name}.js`, "utf-8");
      const htmlFile = `<!DOCTYPE html>
      <html lang="en" data-theme="dark">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Axcel</title>
          ${workers}
        </head>
        <style>${styles}</style>
        <body>
          <div id="root"></div>
          <script type="module">
            ${script}
          </script>
        </body>
      </html>
      `;
      fs.writeFileSync(`./dist/${app.name}/${app.name}.html`, htmlFile, "utf-8");
    });
  });
});
