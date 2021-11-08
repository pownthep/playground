import { BrowserWindow, IpcMainEvent, ipcMain, dialog, shell } from "electron";

export const enum Window {
  MINIMIZE = `/main/window/minimize`,
  MAXIMIZE = "/main/window/toggle-maximize",
  UNMAXIMIZE = "/main/window/unmaximize",
  TOGGLE_PIP = "/main/window/toggle-pip",
  SET_AR = "/main/window/set-aspect-ratio",
  SHOW = "/main/window/show",
  HIDE = "/main/window/hide",
  FOLDER = "/main/window/folder/select",
  FILE_OPEN = "/main/window/open/file",
}

export default class BrowserWindowHandler {
  public static init() {
    ipcMain.on(Window.MINIMIZE, (evt: IpcMainEvent) => {
      BrowserWindow.fromWebContents(evt.sender)?.minimize();
    });
    ipcMain.on(Window.UNMAXIMIZE, (evt: IpcMainEvent) => BrowserWindow.fromWebContents(evt.sender)?.unmaximize());
    ipcMain.on(Window.SET_AR, (evt: IpcMainEvent, payload: number) =>
      BrowserWindow.fromWebContents(evt.sender)?.setAspectRatio(payload)
    );
    ipcMain.on(Window.SHOW, (evt: IpcMainEvent) => {
      BrowserWindow.fromWebContents(evt.sender)?.show();
    });
    ipcMain.on(Window.HIDE, (evt: IpcMainEvent) => {
      BrowserWindow.fromWebContents(evt.sender)?.hide();
    });
    ipcMain.on(Window.TOGGLE_PIP, (evt: IpcMainEvent, flag: boolean) =>
      BrowserWindow.fromWebContents(evt.sender)?.setAlwaysOnTop(flag, "screen-saver")
    );
    ipcMain.on(Window.MAXIMIZE, (evt: IpcMainEvent) => {
      const window = BrowserWindow.fromWebContents(evt.sender);
      window?.isMaximized() ? window.unmaximize() : window.maximize();
      evt.sender.send(Window.MAXIMIZE, window?.isMaximized());
    });

    ipcMain.handle(Window.FOLDER, async (_, defaultPath) => {
      const result = await dialog.showSaveDialog({ defaultPath });
      if (!result.canceled) {
        return result.filePath;
      }
      return defaultPath;
    });
    ipcMain.handle(Window.FILE_OPEN, async (ev, path) => {
      shell.openPath(path);
    });
  }
}
