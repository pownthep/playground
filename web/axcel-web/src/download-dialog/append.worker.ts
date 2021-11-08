import { Piper } from "@pownthep/axcel-core/lib/cjs/pipe";
import { PubSub } from "@pownthep/pubsub/lib/es/web-worker";
import * as fs from "fs";
import * as path from "path";
import { AppendPayload } from "./interface";

PubSub.init();

let progress = 0;
let interval: NodeJS.Timer;

PubSub.subscribe("append", async ({ files, data }: AppendPayload) => {
  try {
    const filePath = path.join(data.savedFolder, data.fileName);
    const writer = fs.createWriteStream(filePath);
    const piper = new Piper(files, writer);
    piper.on("progress", (length) => (progress += length));

    interval = setInterval(() => {
      PubSub.publish("append-progress", progress);
    }, 1000);

    await piper.combine();

    clearInterval(interval);
    files.forEach((file) => fs.rmSync(file));
    PubSub.publish("append-progress", progress);
    PubSub.publish("append-finish");
  } catch (error) {}
});
