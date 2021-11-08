import WebSocket from "ws";

export default class WSClient {
  private static socket: WebSocket;
  private static handlers: { [key: string]: (data: any) => void } = {};

  public static connect(port: number = 8080, timeoutDelay: number = 60_000) {
    try {
      this.socket = new WebSocket(`ws://localhost:${port}`);
      this.socket.on("message", (event: MessageEvent<string>) => {
        try {
          const { channel, data } = JSON.parse(event.toString());
          if (channel && data && this.handlers[channel])
            return this.handlers[channel](data);
        } catch (error) {}
      });
      return new Promise<boolean>((resolve, reject) => {
        const id = setTimeout(
          () =>
            reject(
              `Could not connect to websocket server after ${timeoutDelay}s`
            ),
          timeoutDelay
        );
        this.socket.on("open", () => {
          clearTimeout(id);
          resolve(true);
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static publish(channel: string, data: any): Promise<void> {
    try {
      this.socket.send(JSON.stringify({ channel, data }));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static subscribe(channel: string, cb: (data: any) => void) {
    try {
      this.handlers[channel] = cb;
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static unsubscribe(channel: string) {
    try {
      delete this.handlers[channel];
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async pubSub<T>(
    channel: string,
    data: any,
    timeoutDelay: number = 60_000
  ) {
    try {
      await this.publish(channel, data);
      return new Promise<T>((resolve, reject) => {
        const id = setTimeout(
          () => reject(`pubSub timeout: ${channel}`),
          timeoutDelay
        );
        this.subscribe(channel, (data: T) => {
          clearTimeout(id);
          this.unsubscribe(channel).then(() => resolve(data));
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
