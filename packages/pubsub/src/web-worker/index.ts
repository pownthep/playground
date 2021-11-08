export class PubSub {
  private static listeners: { [key: string]: (payload?: any) => void };

  public static init() {
    this.listeners = {};
    onmessage = (event) => {
      try {
        const { channel, payload } = event.data;
        if (this.listeners[channel]) this.listeners[channel](payload);
      } catch (error) {
        console.error(error);
      }
    };
  }

  public static subscribe(channel: string, callback: (payload?: any) => void) {
    this.listeners[channel] = callback;
  }

  public static publish(channel: string, payload?: any) {
    postMessage({ channel, payload });
  }
}
