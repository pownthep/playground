import http from "http";
import EventEmitter from "events";
import getPort from "get-port";
import { ports } from "./ports";
import { RequestPayload } from "./interface";

export class HttpNativeHost extends EventEmitter {
  private server: http.Server;
  private port: number;

  constructor() {
    super();
  }

  public start() {
    this.server = this._createServer();
    getPort({ exclusive: true, port: ports }).then((port) => {
      this.port = port;
      this.server.listen(port, () => {
        console.log("HTTP Native Host running at http://localhost:" + port);
      });
    });
  }

  private _createServer() {
    return http.createServer((req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Request-Method", "*");
      res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
      res.setHeader("Access-Control-Allow-Headers", "*");

      if (req.method !== "POST") {
        res.statusCode = 200;
        res.end(`axcel`);
        return;
      }
      let body = "";

      req.on("error", (err) => console.error(err));
      req.on("data", (data) => {
        body += data;
      });
      req.on("end", () => {
        try {
          const { eventName, payload }: RequestPayload = JSON.parse(body);
          console.log(eventName, payload);
          this.emit(eventName, payload);
          res.end(
            JSON.stringify({
              error: false,
            })
          );
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "CANNOT_PARSE" }));
        }
      });
    });
  }
}
