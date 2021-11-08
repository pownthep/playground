export class DLM {
  private static port: chrome.runtime.Port;
  private static connected: boolean;

  public static init() {
    this.port = chrome.runtime.connectNative("com.pownthep.axcel");
    this.port.onMessage.addListener((msg) => {
      console.log("Received", msg);
      if (!msg.success) this.port.disconnect();
    });
    this.port.onDisconnect.addListener(() => {
      console.log("Disconnected");
      this.connected = false;
    });
    this.connected = true;
  }

  public static async download(url: string, fileName: string, fileSize: number, mime: string) {
    if (!this.connected) {
      this.init();
    }
    return this.port.postMessage({
      url,
      fileName,
      fileSize,
      headers: { Cookie: await this.getCookie(url) },
      mime,
    });
  }

  public static async getCookie(url: string) {
    try {
      const stores = await chrome.cookies.getAllCookieStores();
      const ids = stores.map(({ id }) => id);
      const cookiesStore = await Promise.all(ids.map((id) => chrome.cookies.getAll({ storeId: id, url: url })));
      const cookies = cookiesStore.reduce((prev, curr) => {
        return [...prev, ...curr];
      }, []);

      return cookies.reduce<string>((prev, curr, idx) => {
        return idx === 0 ? `${curr.name}=${curr.value};` : `${prev}${curr.name}=${curr.value};`;
      }, "");
    } catch (error) {
      return "";
    }
  }
}
