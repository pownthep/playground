import http from "http";
import { Server } from "socket.io";
import getPort from "get-port";

export default class WebsocketServer {
  private static httpServer: http.Server;
  private static io: Server;

  static async init() {
    const port = await getPort({
      port: getPort.makeRange(8000, 9000),
    });
    this.httpServer = http.createServer();
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      socket.on("/publish", (channel: string, data: unknown) => {
        if (channel) {
          socket.broadcast.emit(channel, data);
        }
      });
    });
    this.httpServer.listen(port);
    return port;
  }
}
