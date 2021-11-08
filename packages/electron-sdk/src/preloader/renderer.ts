import { IpcRenderer } from "electron";

declare global {
  interface Window {
    electron: {
      port: string;
      platform: NodeJS.Platform;
      ipc: IpcRenderer;
    };
  }
}

const not_electron = console.log("not electron!");

const ipc = window.electron ? window.electron.ipc : not_electron;
const platform = window.electron ? window.electron.platform : not_electron;
const port = window.electron ? window.electron.port : not_electron;

export { ipc, platform, port };
