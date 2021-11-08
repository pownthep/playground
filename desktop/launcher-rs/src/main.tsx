import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { appWindow } from "@tauri-apps/api/window";
import {
  register,
  isRegistered,
  unregisterAll,
} from "@tauri-apps/api/globalShortcut";

unregisterAll().then(() => {
  register("CmdOrControl+L", async () => {
    const isVisible = await appWindow.isVisible();
    if (isVisible) appWindow.hide();
    else {
      appWindow.show();
      appWindow.setFocus();
    }
  })
    .then(async () => console.log(await isRegistered("CmdOrControl+L")))
    .catch(console.error);
});

appWindow.listen("tauri://blur", () => appWindow.hide());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
