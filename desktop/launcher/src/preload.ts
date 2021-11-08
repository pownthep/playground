import { IpcRenderer, ipcRenderer } from "electron";
import { snapshot } from "@pownthep/electron-sdk/lib/es/snapshot/require";

declare global {
  interface Window {
    electron: {
      platform: NodeJS.Platform;
      ipc: IpcRenderer;
    };
    snapshot: (url: string) => any;
  }
}

window.electron = {
  platform: process.platform,
  ipc: ipcRenderer,
};
window.snapshot = snapshot.require;
