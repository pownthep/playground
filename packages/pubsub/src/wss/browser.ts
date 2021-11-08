import { ports } from "./ports";

interface PublishTask {
  channel: string;
  data: any;
}
export default class WSClient {
  private static socket: WebSocket;
  private static handlers: { [key: string]: (data: any) => void };
  private static queue: PublishTask[] = [];
  private static port: number = 8080;
  private static timeoutDelay: number = 60_000;

  public static async getPort() {
    return new Promise<number>((resolve, reject) => {
      Promise.allSettled(
        ports.map((port) => {
          return fetch("http://localhost:" + port).then((res) => {
            if (res.status === 426) {
              resolve(port);
              return port;
            } else throw new Error("Not a WebSocket server");
          });
        })
      ).then((results) => {
        if (!results.some((result) => result.status === "fulfilled")) reject("No WebSocket server available");
      });
    });
  }

  private static config(port: number, timeoutDelay: number = 60_000) {
    this.port = port;
    this.timeoutDelay = timeoutDelay;
  }

  private static clearQueue() {
    this.queue.forEach(({ channel, data }) => this.publish(channel, data));
    this.queue = [];
  }

  public static connect() {
    try {
      this.handlers = {};
      this.socket = new WebSocket(`ws://localhost:${this.port}`);
      this.socket.addEventListener("message", (event: MessageEvent<string>) => {
        try {
          const { channel, data } = JSON.parse(event.data);
          if (channel && data && this.handlers[channel]) return this.handlers[channel](data);
        } catch (error) {}
      });
      return new Promise<boolean>((resolve, reject) => {
        const id = setTimeout(
          () => reject(`Could not connect to websocket server after ${this.timeoutDelay}s`),
          this.timeoutDelay
        );
        this.socket.onopen = () => {
          clearTimeout(id);
          this.clearQueue();
          resolve(true);
        };
        this.socket.onclose = () => {
          this.socket = null;
        };
        this.socket.onerror = () => {
          this.socket = null;
        };
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async publish(channel: string, data: any): Promise<void> {
    try {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify({ channel, data }));
      else {
        this.queue.push({ channel, data });
        if (!this.socket) {
          ports.forEach((port) => {
            this.port = port;
            this.connect();
          });
        }
      }
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

  public static async pubSub<T>(channel: string, data: any, timeoutDelay: number = 60_000) {
    try {
      await this.publish(channel, data);
      return new Promise<T>((resolve, reject) => {
        const id = setTimeout(() => reject(`pubSub timeout: ${channel}`), timeoutDelay);
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
