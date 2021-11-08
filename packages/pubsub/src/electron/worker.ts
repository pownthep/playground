import { parentPort } from "worker_threads";
import type { IPCPayload, PublishPayload } from "./interface";

export default class WorkerClient {
  private static listeners: Map<string, (data: PublishPayload) => void>;

  static init() {
    this.listeners = new Map();
    parentPort.on("message", ({ channel, data }: IPCPayload) => {
      const cb = this.listeners.get(channel);
      if (cb) cb(data);
    });
  }

  /**
   * Send data to the specified channel
   *
   * @param channel Channel name
   * @param data Data to be processed
   *
   */
  static publish(channel: string, data?: PublishPayload) {
    parentPort.postMessage({ channel, data });
  }

  /**
   * Subscribe to the specified channel and run callback function when there is new data.
   *
   * @param channel Channel name
   * @param cb Callback function
   *
   * @returns A function to unsubscribe to the channel
   */
  static subscribe(channel: string, cb: (data: PublishPayload) => void) {
    this.listeners.set(channel, cb);
  }

  static unsubscribe(channel: string) {
    this.listeners.delete(channel);
  }

  /**
   * Send data to the specified channel and return the results if any.
   *
   * @param channel Channel name
   * @param payload Data to be processed
   *
   * @returns Output of the data that was process
   */
  static pubSub<T = any>(channel: string, data?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.subscribe(channel, (response: PublishPayload) => {
        this.unsubscribe(channel);
        if (response.success) resolve(response.data);
        else reject(response.data);
      });
      this.publish(channel, data);
    });
  }
}
