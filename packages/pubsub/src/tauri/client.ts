import { Event, listen, once } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

export default class TauriClient {
  static init() {}
  /**
   * Send data to the specified channel
   *
   * @param channel Channel name
   * @param payload Data to be processed
   *
   */
  static publish(channel: string, payload?: unknown) {
    invoke("publish", { channel, data: JSON.stringify(payload) });
  }

  /**
   * Subscribe to the specified channel and run callback function when there is new data.
   *
   * @param channel Channel name
   * @param cb Callback function
   *
   * @returns A function to unsubscribe to the channel
   */
  static subscribe(channel: string, cb: (event: Event<string>) => void) {
    listen(`/subscribe/${channel}`, cb);
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
    invoke("publish", { channel, data: JSON.stringify(payload) });
    return new Promise<T>((resolve) =>
      once(`/subscribe/${channel}`, (event: any) => resolve(event))
    );
  }
}
