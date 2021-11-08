import type { AxiosRequestHeaders } from "axios";
import os from "os";
import { app, BrowserWindow } from "electron";

interface AxcelConfig {
  concurrency?: number;
  fileName?: string;
  fileSize?: number;
  savedFolder?: string;
  headers?: AxiosRequestHeaders;
  mime: string;
  url: string;
}

export class DownloadDialog extends BrowserWindow {
  private config: Required<AxcelConfig>;

  constructor(config: AxcelConfig) {
    super({
      width: 400,
      height: 200,
      resizable: false,
      show: false,
      frame: false,
      alwaysOnTop: true,
      transparent: true,
      center: true,
      maximizable: false,
      webPreferences: {
        devTools: true,
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        sandbox: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        additionalArguments: [
          `data=${Buffer.from(
            JSON.stringify({
              savedFolder: app.getPath("downloads"),
              concurrency: os.cpus().length,
              fileName: "untitled",
              headers: {},
              fileSize: 0,
              ...config,
            })
          ).toString("base64")}`,
        ],
      },
    });
    this.config = {
      savedFolder: app.getPath("downloads"),
      concurrency: os.cpus().length,
      fileName: "untitled",
      headers: {},
      fileSize: 0,
      ...config,
    };
    this._init();
  }

  private _init() {
    this.loadURL("snapshot://download-dialog");
    this.on("maximize", () => {
      this.webContents.send("/main/tab-service/on-maximize", true);
    });
    this.on("unmaximize", () => {
      this.webContents.send("/main/tab-service/on-unmaximize", false);
    });
    this.once("ready-to-show", () => {
      this.show();
      this.setAlwaysOnTop(false);
    });
  }
}
