import WebSocket, { WebSocketServer } from "ws";
import getPort from "get-port";
import { ports } from "./ports";

type Listener = { [key: string]: Array<(data: any) => void> };
export default class WSServer {
  private static wss: WebSocketServer;
  public static onerror: (ev: WebSocket.ErrorEvent) => void;
  public static onclose: (ev: WebSocket.CloseEvent) => void;
  public static listeners: Listener = {};

  public static async init() {
    const port = await getPort({ exclusive: true, port: ports });
    return new Promise<number>((resolve, reject) => {
      this.wss = new WebSocketServer({ port,  }, () => resolve(port));
      this.wss.on("error", () => reject("Error starting PubSub server"));
      this.wss.on("connection", (ws, req) => {
        console.log("PubSubServer: ", req.url, "connected");
        ws.on("message", (payload) => {
          this.wss.clients.forEach((client) => {
            try {
              const { channel, data } = JSON.parse(payload.toString());
              if (this.listeners[channel])
                this.listeners[channel].forEach((cb) => cb(data));
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(payload.toString());
              }
            } catch (error) {
              console.error(error);
            }
          });
        });
        ws.onclose = (ev) => {
          console.log("PubSubServer: ", ev.target.url, "disconnected");
          if (this.onclose) this.onclose(ev);
        };
        ws.onerror = (ev) => {
          console.error("PubSubServer: ", ev.target.url, "error", ev);
          if (this.onerror) this.onerror(ev);
        };
      });
    });
  }

  public static subscribe(channel: string, callback: (data: any) => void) {
    if (this.listeners[channel]) this.listeners[channel].push(callback);
    else this.listeners[channel] = [callback];
  }

  public static publish(channel: string, data: any) {
    if (this.wss) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ channel, data }));
        }
      });
    }
  }
}
