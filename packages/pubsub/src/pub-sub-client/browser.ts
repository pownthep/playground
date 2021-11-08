interface PubSubMesage {
  channel: string;
  payload: any;
}

type SubscribeCallback = (data: any) => void;

interface QueueTask {
  type: "subscribe" | "publish";
  args: any[];
}

export class PubSub {
  private static ws: WebSocket;
  private static callbacks: { [key: string]: SubscribeCallback[] } = {};
  private static queue: QueueTask[] = [];
  private static open: boolean = false;

  static init(endpoint: string = `ws://127.0.0.1:8080/ws`) {
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(endpoint);
      this.ws.addEventListener("open", () => {
        this.open = true;
        this.queue.forEach((task) => {
          if (task.type === "publish") this.publish(task.args[0], task.args[1]);
          else this.subscribe(task.args[0], task.args[1]);
        });
        this.queue = [];
        resolve();
      });
      this.ws.addEventListener("error", reject);
      this.ws.addEventListener("message", (ev) => {
        const { channel, payload }: PubSubMesage = JSON.parse(ev.data);
        const channelCallbacks = this.callbacks[channel];
        if (channelCallbacks) channelCallbacks.forEach((cb) => cb(payload));
      });
    });
  }

  static send(data: any) {
    this.ws.send(JSON.stringify(data));
  }

  static publish(channel: string, payload: any) {
    if (this.open) {
      this.send({
        action: "publish",
        channel,
        message: JSON.stringify({
          channel,
          payload,
        }),
      });
    } else this.queue.push({ args: [channel, payload], type: "publish" });
  }

  static subscribe(channel: string, cb: SubscribeCallback) {
    if (this.open) {
      if (this.callbacks[channel]) this.callbacks[channel].push(cb);
      else this.callbacks[channel] = [cb];
      this.send({
        action: "subscribe",
        channel,
        message: "",
      });
    } else this.queue.push({ args: [channel, cb], type: "subscribe" });
  }
}
