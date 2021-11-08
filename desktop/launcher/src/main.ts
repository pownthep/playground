import { app, BrowserWindow } from "electron";
import Bootstrapper from "@pownthep/electron-sdk/src/bootstrap";
import { MainProcessServices } from "@pownthep/electron-sdk/src/main-process-services";
import { ElectronIPCServer } from "@pownthep/pubsub/src/electron/server";
import path from "path";
import { PM } from "@pownthep/pm/src";
// import { startService } from "@pownthep/electron-sdk/src/background-process-services/torrent";

Bootstrapper.init();

app.whenReady().then(() => {
  startApp();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) startApp();
  });
});

function startApp() {
  ElectronIPCServer.init();
  MainProcessServices.start(["google", "tab", "window"]);
  const win = new BrowserWindow({
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      sandbox: false,
      plugins: true,
      preload: path.resolve(app.getAppPath(), "preload.js"),
    },
  });

  win.loadFile(path.join(app.getAppPath(), "app", "svp", "index.html"));
  // win.loadURL("http://localhost:3001");
  // PM.createRenderer(path.resolve(app.getAppPath(), "torrent.js"));
}
