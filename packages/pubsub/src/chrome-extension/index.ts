type Listener = { [key: string]: Array<(data: any) => void> };

export default class PubSubXT {
  private static listeners: Listener = {};

  public static init() {
    chrome.runtime.onMessage.addListener(
      (msg: { channel: string; data: any }) => {
        if (this.listeners[msg.channel])
          this.listeners[msg.channel].forEach((cb) => cb(msg.data));
      }
    );
  }

  public static publish(channel: string, data: any) {
    chrome.runtime.sendMessage({ channel, data });
  }

  public static subscribe(channel: string, callback: (data: any) => void) {
    if (this.listeners[channel]) this.listeners[channel].push(callback);
    else this.listeners[channel] = [callback];
  }
}
