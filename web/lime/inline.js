const fs = require("fs");

const styles = fs.readFileSync("./dist/style.css", "utf-8");
const script = fs
  .readFileSync("./dist/index.js", "utf-8")
  // .replace(
  //   `import * as ReactDOM from "react-dom";`,
  //   `const ReactDOM = snapshotResult.customRequire.cache["../../../node_modules/react-dom/index.js"].exports;`
  // )
  // .replace(
  //   `import ReactDOM__default from "react-dom";`,
  //   `const ReactDOM__default = snapshotResult.customRequire.cache["../../../node_modules/react-dom/index.js"].exports;`
  // )
  // .replace(
  //   `import React__default, { createContext, forwardRef, useContext as useContext$2, useRef as useRef$3, useLayoutEffect, createElement, Children, isValidElement, cloneElement, memo, useCallback as useCallback$2, PureComponent, Component, useState as useState$2, useEffect as useEffect$2, useMemo as useMemo$3 } from "react";`,
  //   `const React__default = snapshotResult.customRequire.cache["../../../node_modules/react/index.js"].exports;
  //    const { createContext, forwardRef, useContext: useContext$2, useRef: useRef$3, useLayoutEffect, createElement, Children, isValidElement, cloneElement, memo, useCallback: useCallback$2, PureComponent, Component, useState: useState$2, useEffect: useEffect$2, useMemo: useMemo$3 } = snapshotResult.customRequire.cache["../../../node_modules/react/index.js"].exports;
  //   `
  // )
  // .replace(
  //   `import * as React$1 from "react";`,
  //   `const React$1 = snapshotResult.customRequire.cache["../../../node_modules/react/index.js"].exports;`
  // );

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
