import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "nprogress/nprogress.css";
import "./index.css";
import "./css/animation.css";
import "./css/nprogress.css";
import "./css/seekbar.css";
import "./css/utils.css";
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);
