import Download, { Range, DownloadResult } from "@pownthep/axcel-core/lib/cjs/download";
import { PubSub } from "@pownthep/pubsub/lib/es/web-worker";
import stringHash from "string-hash";
import * as path from "path";

PubSub.init();

let sum = 0;
let interval: NodeJS.Timer;
let download: Download;

PubSub.subscribe(
  "download-start",
  ({ url, range, headers, idx }: { url: string; range: Range; headers: any; idx: number }) => {
    if (!download) {
      const fileName = `${stringHash(url)}-${range.start}-${range.end}`;
      const filePath = path.join(fileName);
      download = new Download({
        fileName,
        filePath,
        url,
        headers: { ...headers, Range: range.header },
        start: false,
      });
      download.on("progress", (length: number) => (sum += length));
      download.once("finish", (result: DownloadResult) => {
        clearInterval(interval);
        PubSub.publish("download-progress", {
          [range.start]: {
            sum: range.size,
            total: range.size,
            percentage: 100,
          },
        });
        PubSub.publish("download-finish", { [idx]: result });
      });
      download.on("error", (e: any) => PubSub.publish("error", e));
      download.start();
    } else download.resume();

    interval = setInterval(() => {
      PubSub.publish("download-progress", {
        [range.start]: {
          sum,
          total: range.size,
          percentage: Math.round((sum / range.size) * 100),
        },
      });
    }, 1000);
  }
);

PubSub.subscribe("download-pause", () => {
  console.log("Pausing");
  if (download) download.pause();
  if (interval) clearInterval(interval);
});
