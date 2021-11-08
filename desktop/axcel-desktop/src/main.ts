import { app, BrowserWindow, ipcMain, Menu, protocol, Tray, net } from "electron";
import { MainProcessServices } from "@pownthep/electron-sdk/lib/es/main-process-services";
import { DownloadDialog } from "@pownthep/axcel-core/lib/cjs";
import { URL } from "url";
import { snapshot } from "@pownthep/electron-sdk/lib/es/snapshot/require";
import path from "path";
import { is } from "electron-util";
import * as fs from "fs/promises";
import { Deeplink } from "electron-deeplink";
import { Worker } from "worker_threads";

// Static lifetime variables
let tray = null;
let downloadDialogs: BrowserWindow[] = [];
let mainWindow: BrowserWindow;

const deeplink = new Deeplink({ app, mainWindow: null, protocol: "axcel", isDev: is.development });

deeplink.on("received", (link) => {
  try {
    const base64 = link.replace("\\/", "").replace("axcel://\\", "");
    const { channel, payload } = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));

    messageHandler(channel, payload);
  } catch (error) {
    console.log(error);
  }
});

protocol.registerSchemesAsPrivileged([{ scheme: "snapshot", privileges: { standard: true, secure: true } }]);

app.whenReady().then(() => {
  protocol.registerStringProtocol("snapshot", (req, cb) => {
    const moduleName = new URL(req.url).hostname;
    if (moduleName === "download-dialog" && is.development) {
      const htmlPath = require.resolve("@pownthep/axcel-web/dist/download-dialog/download-dialog.html");
      fs.readFile(htmlPath, "utf-8").then(cb);
    } else if (moduleName === "test") {
      cb(`<html><head></head><body></body></html>`);
    } else cb(snapshot.require(moduleName));
  });
  startApp();
});

app.on("activate", () => {
  if (app.isReady()) {
    startApp();
  }
});
app.on("window-all-closed", () => {});

function startApp() {
  setupTray();
  MainProcessServices.start(["window"]);
  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    center: true,
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });
  argvHandler(process.argv);
}

function setupTray() {
  tray = new Tray(path.join(app.getAppPath(), "app.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      type: "normal",
      click: () => app.quit(),
    },
  ]);
  tray.setToolTip("Axcel");
  tray.setContextMenu(contextMenu);
}

function argvHandler(argv: string[]) {
  const msg = argv.find((arg) => arg.includes("axcel://"));
  if (msg) {
    try {
      const { channel, payload } = JSON.parse(atob(msg.replace("\\/", "").replace("axcel://\\", "")));
      messageHandler(channel, payload);
    } catch (error) {
      console.error(error);
    }
  }
}

function messageHandler(channel: string, payload: any) {
  switch (channel) {
    case "download":
      handleDownload(payload);
      break;
    default:
      console.log("No handler for: ", channel);
      break;
  }
}

function handleDownload(payload: any) {
  try {
    console.log(payload);
    const dialog = new DownloadDialog(payload);
    dialog.webContents.openDevTools();
    downloadDialogs.push(dialog);
  } catch (error) {
    console.error(error);
  }
}

ipcMain.handle("download", (event, data) => {
  const request = net.request("https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4");
  request.on("response", (res) => {});
});
