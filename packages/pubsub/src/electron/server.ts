import { BrowserWindow, ipcMain, WebContents } from "electron";
import type { ChildProcess } from "child_process";
import type { Worker } from "worker_threads";
import type { IPCPayload, PublishPayload } from "./interface";

type Sender = ChildProcess | Worker | WebContents | NodeJS.Process;

export class ElectronIPCServer {
  static listeners: Map<string, (payload: PublishPayload) => void>;
  static childProcesses: ChildProcess[] = [];
  static workerThreads: Worker[] = [];
  static rendererProcesses: BrowserWindow[] = [];

  static registerProcess(cp: ChildProcess) {
    this.childProcesses.push(cp);
    cp.on("message", ({ channel, data }: IPCPayload) => {
      this.broadcast(channel, data, cp);
    });
  }

  static registerWorker(worker: Worker) {
    this.workerThreads.push(worker);
    worker.on("message", ({ channel, data }: IPCPayload) => {
      this.broadcast(channel, data, worker);
    });
  }

  static registerBrowserWindow(window: BrowserWindow) {
    this.rendererProcesses.push(window);
  }

  static broadcast(channel: string, data: PublishPayload, sender: Sender) {
    this.publishRenderer(channel, data, <WebContents>sender);
    this.publishProcess(channel, data, <ChildProcess>sender);
    this.publishThread(channel, data, <Worker>sender);
    this.publishMain(channel, data, <NodeJS.Process>sender);
  }

  /**
   * Initialize module in the main process
   *
   * @remarks
   *
   * This function must be call first before any publishing and subscribing can be call.
   */
  static init = () => {
    this.listeners = new Map();
    ipcMain.on("/publish", (evt, channel, data) => {
      const mainListeners = ipcMain.listeners(channel);
      if (mainListeners.length > 0) {
        mainListeners.forEach((listener) => listener(evt, data));
      } else this.broadcast(channel, data, evt.sender);
    });
  };

  static publishRenderer(channel: string, data: PublishPayload, sender?: WebContents) {
    this.rendererProcesses = this.rendererProcesses.filter((p) => !p.isDestroyed());
    this.rendererProcesses.forEach(({ webContents }) => {
      if ("id" in sender && webContents.id === sender.id) return;
      else webContents.send(channel, data);
      console.log(channel, data);
    });
  }

  static publishProcess(channel: string, data: PublishPayload, sender?: ChildProcess) {
    this.childProcesses = this.childProcesses.filter((p) => p);
    this.childProcesses.forEach((cp) => {
      if ("pid" in cp && cp.pid === sender.pid) return;
      else cp.send({ channel, data });
    });
  }

  static publishThread(channel: string, data: PublishPayload, sender?: Worker) {
    this.workerThreads = this.workerThreads.filter((p) => p);
    this.workerThreads.forEach((thread) => {
      if ("threadId" in thread && thread.threadId === sender.threadId) return;
      else thread.postMessage({ channel, data });
    });
  }

  static publishMain(channel: string, data: PublishPayload, sender: NodeJS.Process) {
    if (sender.pid !== process.pid) {
      const cb = this.listeners.get(channel);
      if (cb) cb(data);
    }
  }

  /**
   * Listen to a specific channel and perform task in the callback
   *
   * @param channel Channel name
   * @param cb Callback function
   *
   * @remarks
   *
   * This is a main process specific listener
   */
  static subscribe(channel: string, cb: (response: PublishPayload) => void) {
    this.listeners.set(channel, cb);
  }

  static Ok(response?: any) {
    return { isSuccess: true, output: response };
  }

  static Err(err?: any) {
    return { isSuccess: false, output: err };
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
    this.broadcast(channel, data, process);
    return new Promise<T>((resolve, reject) =>
      this.subscribe(channel, (response) => {
        this.unsubscribe(channel);
        if (response.isSuccess) resolve(response.output);
        else reject(response.output);
      })
    );
  }
}
