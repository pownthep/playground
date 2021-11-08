import { BrowserWindow } from "electron";

export default class Loader {
  private static window: BrowserWindow;

  public static show() {
    this.window = new BrowserWindow({
      width: 300,
      height: 300,
      frame: false,
      show: true,
      alwaysOnTop: true,
      transparent: true,
      center: true,
    });
  }

  public static close() {
    if (this.window) this.window.close();
    this.window = null;
  }
}
