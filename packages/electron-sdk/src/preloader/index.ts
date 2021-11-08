import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  port: process.env.PORT,
  platform: process.platform,
  ipc: ipcRenderer,
});
