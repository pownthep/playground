import { io, Socket } from "socket.io-client";

export default class WSClient {
  private static socket: Socket;

  static init(port: string) {
    this.socket = io(`http://localhost:${port}`);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.on("connect", () => {
        resolve(true);
      });
      this.socket.on("error", () => {
        reject(false);
      });
    });
  }

  /**
   * Send data to the specified channel
   *
   * @param channel Channel name
   * @param payload Data to be processed
   *
   */
  static publish(channel: string, payload: unknown) {
    this.socket.emit(`/publish`, channel, payload);
  }

  /**
   * Subscribe to the specified channel and run callback function when there is new data.
   *
   * @param channel Channel name
   * @param cb Callback function
   *
   * @returns A function to unsubscribe to the channel
   */
  static subscribe(channel: string, cb: (payload: unknown) => void) {
    this.socket.on(channel, cb);
  }

  /**
   * Send data to the specified channel and return the results if any.
   *
   * @param channel Channel name
   * @param payload Data to be processed
   *
   * @returns Output of the data that was process
   */
  static pubSub<T = unknown>(channel: string, payload?: unknown): Promise<T> {
    this.publish(channel, payload);
    return new Promise<T>((resolve) =>
      this.socket.once(channel, (response: T) => resolve(response))
    );
  }
}
