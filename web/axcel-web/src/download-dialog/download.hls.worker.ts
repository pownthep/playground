import { PubSub } from "@pownthep/pubsub/lib/es/web-worker";
import { DownloadHLSPayload } from "./interface";
import { httpClient } from "@pownthep/axcel-core/lib/cjs/http-client";
import * as fs from "fs";
import stringHash from "string-hash";
import * as path from "path";

PubSub.init();

let paused = true;
let progress = 0;
let index = 0;
let results: string[] = [];

PubSub.subscribe("download-hls-start", async ({ urls, headers, idx, savedFolder }: DownloadHLSPayload) => {
  paused = false;
  for (const url of urls) {
    if (paused) break;
    const { fileSize, filePath } = await asyncDownload(url, headers, path.join(savedFolder, `${stringHash(url)}.ts`));
    results.push(filePath);
    progress += fileSize;
    PubSub.publish("download-hls-progress", {
      [idx]: {
        sum: progress,
      },
    });
    index++;
  }
  console.log("download finished");
  PubSub.publish("download-hls-finish", { [idx]: { filePaths: results } });
});

PubSub.subscribe("download-hls-pause", () => {
  console.log("Pausing");
  paused = true;
});

const asyncDownload = (url: string, headers: any, filePath: string) => {
  return new Promise<{ fileSize: number; filePath: string }>((resolve, reject) => {
    httpClient({ url, headers, responseType: "stream" })
      .then((res) => {
        let prog = 0;
        // const writer = fs.createWriteStream(filePath, { start, flags: start === 0 ? undefined : "r+" });
        const writer = fs.createWriteStream(filePath);
        writer.on("finish", () => resolve({ fileSize: prog, filePath }));
        writer.on("error", (err) => reject(err));
        res.data.on("error", (err) => reject(err));
        res.data.on("data", (chunk) => (prog += chunk.length));
        res.data.pipe(writer);
      })
      .catch((err) => reject(err));
  });
};
