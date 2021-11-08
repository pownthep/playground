import { ipcRenderer, IpcRendererEvent } from "electron";
import type { PublishPayload } from "./interface";

export default class RendererClient {
  static init() {}

  /**
   * Send data to the specified channel
   *
   * @param channel Channel name
   * @param payload Data to be processed
   *
   */
  static publish(channel: string, payload?: PublishPayload) {
    ipcRenderer.send(`/publish`, channel, payload);
  }

  /**
   * Subscribe to the specified channel and run callback function when there is new data.
   *
   * @param channel Channel name
   * @param cb Callback function
   *
   * @returns A function to unsubscribe to the channel
   */
  static subscribe(
    channel: string,
    cb: (payload: PublishPayload, event: IpcRendererEvent) => void
  ) {
    ipcRenderer.on(channel, (e, data) => cb(data, e));
  }

  /**
   * Send data to the specified channel and return the results if any.
   *
   * @param channel Channel name
   * @param payload Data to be processed
   *
   * @returns Output of the data that was process
   */
  static pubSub<T = any>(channel: string, payload?: any): Promise<T> {
    this.publish(channel, payload);
    return new Promise<T>((resolve, reject) =>
      ipcRenderer.once(channel, (_, response: PublishPayload) => {
        if (response.isSuccess) resolve(response.output);
        else reject(response.output);
      })
    );
  }
}
