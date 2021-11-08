interface PortMessage {
  channel: string;
  payload?: any;
}

export class PubSubContent {
  private static port: chrome.runtime.Port;
  private static listeners: { [key: string]: (payload?: any) => void };

  public static init() {
    this.listeners = {};
    this.port = chrome.runtime.connect();
    this.port.onMessage.addListener((msg: PortMessage) => {
      const { channel, payload } = msg;
      if (this.listeners[channel]) this.listeners[channel](payload);
    });
  }

  public static publish(channel: string, payload?: any) {
    this.port.postMessage({ channel, payload });
  }

  public static subscribe(channel: string, callback: (payload?: any) => void) {
    this.listeners[channel] = callback;
  }
}

export class PubSubBackground {
  private static port: chrome.runtime.Port;
  private static listeners: { [key: string]: (payload?: any) => void };

  public static init() {
    this.listeners = {};
    chrome.runtime.onConnect.addListener((port) => {
      this.port = port;
      this.port.onMessage.addListener((msg: PortMessage) => {
        const { channel, payload } = msg;
        if (this.listeners[channel]) this.listeners[channel](payload);
      });
    });
  }

  public static publish(channel: string, payload?: any) {
    this.port.postMessage({ channel, payload });
  }

  public static subscribe(channel: string, callback: (payload?: any) => void) {
    this.listeners[channel] = callback;
  }
}
