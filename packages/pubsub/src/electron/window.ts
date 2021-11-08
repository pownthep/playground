import type { IpcRenderer, IpcRendererEvent } from "electron";
import React from "react";
import ReactDOM from "react-dom";
import { PublishPayload } from "./interface";

declare global {
  interface Window {
    electron: {
      platform: NodeJS.Platform;
      ipc: IpcRenderer;
      React: typeof React;
      ReactDOM: typeof ReactDOM;
      argv: string[];
    };
  }
}

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
    try {
      window.electron.ipc.send(`/publish`, channel, payload);
    } catch (error) {}
  }

  /**
   * Subscribe to the specified channel and run callback function when there is new data.
   *
   * @param channel Channel name
   * @param cb Callback function
   *
   * @returns A function to unsubscribe to the channel
   */
  static subscribe(channel: string, cb: (payload: PublishPayload, event: IpcRendererEvent) => void) {
    try {
      window.electron.ipc.on(channel, (e, data) => cb(data, e));
    } catch (error) {}
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
    return new Promise<T>((resolve, reject) => {
      try {
        window.electron.ipc.once(channel, (_, response: PublishPayload) => {
          if (response.isSuccess) resolve(response.output);
          else reject(response.output);
        });
        window.electron.ipc.send(`/publish`, channel, { isSuccess: true, output: payload });
      } catch (error) {
        reject(error);
      }
    });
  }
}
