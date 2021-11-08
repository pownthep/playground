const fs = require("fs");

const styles = fs.readFileSync("./dist/style.css", "utf-8");
const script = fs
  .readFileSync("./dist/index.js", "utf-8")
  .replaceAll(`require`, `window.snapshot`);

const htmlFile = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <style>${styles}</style>
    <body>
      <div id="root"></div>
      <script>
        snapshotResult.setGlobals({},{ env: { NODE_ENV: "production" } },window,document,console);
      </script>
      <script>
        ${script}
      </script>
    </body>
  </html>
  `;

fs.writeFileSync("./dist/index.html", htmlFile, "utf-8");
