import cp, { ForkOptions, ChildProcess } from "child_process";
import { Worker, WorkerOptions } from "worker_threads";
import { BrowserWindow } from "electron";
import { ElectronIPCServer } from "@pownthep/pubsub/src/electron/server";

export class PM {
  static async createRenderer(modulePath: string, args: readonly string[] = [], show: boolean = true) {
    const win = new BrowserWindow({
      show: show,
      paintWhenInitiallyHidden: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        contextIsolation: false,
        additionalArguments: Array.from(args),
      },
    });
    ElectronIPCServer.registerBrowserWindow(win);
    win.loadURL("data:text/html;charset=utf-8,<YOUR HTML/>");
    win.webContents.openDevTools({ mode: "right" });
    try {
      await win.webContents.executeJavaScript(`require("${modulePath}");`);
    } catch (error) {
      console.error(error);
    }
    return win;
  }

  static createChild(modulePath: string, args: readonly string[] = [], options: ForkOptions = {}) {
    return new Promise<ChildProcess>((resolve, reject) => {
      const child = cp.fork(modulePath, args, options);
      ElectronIPCServer.registerProcess(child);
      child.on("spawn", () => resolve(child));
      child.on("error", reject);
    });
  }

  static createThread(filename: string | URL, options: WorkerOptions = {}) {
    return new Promise<Worker>((resolve, reject) => {
      const worker = new Worker(filename, options);
      ElectronIPCServer.registerWorker(worker);
      worker.on("online", () => resolve(worker));
      worker.on("error", reject);
    });
  }
}
