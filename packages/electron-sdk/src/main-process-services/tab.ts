import {
  app,
  BrowserView,
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from "electron";
import { ipcMain } from "electron";
import path from "path";

export const enum TAB {
  GET_STATE = "/main/tab-service/get/state",
  ADD = "/main/tab-service/add",
  SWITCH = "/main/tab-service/switch",
  CLOSE = "/main/tab-service/close",
  UPDATE_STATE = "/main/tab-service/update/state",
}

const hiddenBounds = { x: 0, y: 0, height: 0, width: 0 };

interface TabInfo {
  title: string;
  isActive: boolean;
  id: number;
  favicon: string;
}
export class TabWindow extends BrowserWindow {
  private _tabs: BrowserView[] = [];
  private _tabManagerView: BrowserView;
  private _activeTabId: number;
  private _offsetY: number = 52;
  private static _tabWindows: TabWindow[] = [];
  private _favicons: any = {};

  constructor(
    url: string,
    options: BrowserWindowConstructorOptions = {
      frame: false,
      show: true,
      resizable: true,
      webPreferences: {
        preload: path.join(app.getAppPath(), "preload.js"),
        contextIsolation: false,
        nodeIntegration: true,
      },
    }
  ) {
    super(options);
    this._createTabManager(url);
    this._registerEventHandlers();
    TabWindow._tabWindows.push(this);
  }

  public get state(): TabInfo[] {
    return this._tabs.map((tab) => {
      return {
        title: tab.webContents.getTitle(),
        isActive: tab.webContents.id === this._activeTabId,
        id: tab.webContents.id,
        favicon:
          this._favicons[tab.webContents.id] ??
          `http://www.google.com/s2/favicons?domain=${tab.webContents.getURL()}`,
      };
    });
  }

  public get activeTab(): BrowserView | undefined {
    return this._tabs.find((tab) => tab.webContents.id === this._activeTabId);
  }

  public updateState(startIndex: number, endIndex: number): void {
    const newState = Array.from(this._tabs);
    const [removed] = newState.splice(startIndex, 1);
    newState.splice(endIndex, 0, removed);
    this._tabs = newState;
  }

  public hideTab(tab: BrowserView): void {
    if (tab) tab.setBounds(hiddenBounds);
  }

  public setActiveTab(tab: BrowserView): void {
    if (tab) {
      this._tabs.forEach(this.hideTab);
      tab.setBounds(this._showBounds);
      this._activeTabId = tab.webContents.id;
    }
  }

  public openTab(url?: string) {
    const tabView = new BrowserView({
      webPreferences: {
        preload: path.join(app.getAppPath(), "preload.js"),
        plugins: true,
        contextIsolation: false,
        sandbox: false,
      },
    });
    this.setActiveTab(tabView);
    this.addBrowserView(tabView);
    if (url) tabView.webContents.loadURL(url);
    this._tabs.push(tabView);
    this.show();
    tabView.webContents.addListener("did-finish-load", async () => {
      try {
        const favicon = await tabView.webContents.executeJavaScript(
          `document.querySelector("link[rel*='icon']").href`
        );
        this._favicons[tabView.webContents.id] = favicon;
      } catch (error) {
      } finally {
        this.publishState();
      }
    });
  }

  public switchTab(tabId: number) {
    const tab = this._tabs.find((tab) => tab.webContents.id === tabId);
    if (tab) {
      this.setActiveTab(tab);
      this.show();
    }
  }

  public closeTab(tabId: number) {
    if (this._tabs.length === 1) this.close();
    else {
      const tabIndex = this._tabs.findIndex(
        (tab) => tab.webContents.id === tabId
      );
      if (tabId === this._activeTabId) {
        const nextTab = this._tabs[tabIndex + 1] ?? this._tabs[0];
        this.switchTab(nextTab.webContents.id);
      }
      this.removeBrowserView(this._tabs[tabIndex]);
      this._tabs[tabIndex].webContents.removeAllListeners();
      (<any>this._tabs[tabIndex].webContents).destroy();
      this._tabs[tabIndex] = null;
      this._tabs = this._tabs.filter((tab) => tab !== null);
      this.show();
    }
  }

  public static getTabWindow(webContentId: number) {
    return TabWindow._tabWindows.find(
      ({ webContents }) => webContents.id === webContentId
    );
  }

  private get _showBounds() {
    const { height, width } = this.getBounds();
    return { x: 0, y: this._offsetY, height: height - this._offsetY, width };
  }

  private _registerEventHandlers() {
    this.on("resize", () => {
      const tab = this.activeTab;
      if (tab) tab.setBounds(this._showBounds);
    });
    this.on("maximize", () =>
      this.webContents.send("/main/tab-service/on-maximize")
    );
    this.on("unmaximize", () =>
      this.webContents.send("/main/tab-service/on-unmaximize")
    );
  }

  public publishState() {
    if (this.webContents) this.webContents.send(TAB.GET_STATE, this.state);
  }

  private _createTabManager(url: string) {
    this.loadURL(url);
    this.webContents.once("did-finish-load", () => this.show());
  }
}

export class TabWindowHandler {
  public static init() {
    ipcMain.on(TAB.GET_STATE, (evt) => {
      const tabWindow = TabWindow.getTabWindow(evt.sender.id);
      tabWindow.publishState();
    });
    ipcMain.on(TAB.ADD, (evt, url: string) => {
      const tabWindow = TabWindow.getTabWindow(evt.sender.id);
      tabWindow.openTab(url);
      tabWindow.publishState();
    });
    ipcMain.on(TAB.SWITCH, (evt, id: number) => {
      const tabWindow = TabWindow.getTabWindow(evt.sender.id);
      tabWindow.switchTab(id);
      tabWindow.publishState();
    });
    ipcMain.on(TAB.CLOSE, (evt, id: number) => {
      const tabWindow = TabWindow.getTabWindow(evt.sender.id);
      tabWindow.closeTab(id);
      try {
        tabWindow.publishState();
      } catch (error) {
        console.error(error);
      }
    });
    ipcMain.on(TAB.UPDATE_STATE, (evt, { startIndex, endIndex }) => {
      const tabWindow = TabWindow.getTabWindow(evt.sender.id);
      tabWindow.updateState(startIndex, endIndex);
    });
  }
}
