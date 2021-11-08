import { RequestPayload } from "./interface";
import { ports } from "./ports";

export class NativeHost {
  private static activePort: number;

  static async init() {
    this.activePort = await getAxcelPort(ports[0]);
  }

  static async heartbeat() {
    try {
      if (!this.activePort) return Promise.reject("Axcel service is not running");
      const res = await fetch(`http://localhost:${this.activePort}`);
      const text = await res.text();
      if (text === "axcel") return this.activePort;
      else return Promise.reject("Axcel service is not running");
    } catch (error) {
      return Promise.reject("Axcel service is not running");
    }
  }

  static async publish(payload: RequestPayload) {
    if (!this.activePort) await this.init();
    return fetch(`http://localhost:${this.activePort}`, { body: JSON.stringify(payload), method: "POST" });
  }

  static sniff(url: string, ms: number = 50) {
    const response = fetch(url, { method: "HEAD" });
    const timeout = new Promise((_, reject) => setTimeout(() => reject("timeout"), ms));
    return Promise.race([response, timeout]);
  }
}

export const getAxcelPort = async (port: number): Promise<number> => {
  try {
    if (port > ports[ports.length - 1]) return Promise.reject("Axcel is not running");
    const res = await fetch(`http://localhost:${port}`);
    const text = await res.text();
    if (text === "axcel") return port;
    else return getAxcelPort(port + 1);
  } catch (error) {
    return getAxcelPort(port + 1);
  }
};
