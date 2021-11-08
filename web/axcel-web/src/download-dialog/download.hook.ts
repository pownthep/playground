import { StateUpdater, useEffect, useState } from "preact/hooks";
import { AppendPayload, Data } from "./interface";
import { createRange, DownloadResult, getFileSize, getRanges } from "./utils";
import * as fs from "fs/promises";
import * as path from "path";

export const enum DL_STATE {
  IDLE = "idle",
  STARTED = "started",
  PAUSED = "paused",
  CANCELLED = "cancelled",
  APPENDING = "appending",
  FINISHED = "finished",
}

export interface Progress {
  sum: number;
  total: number;
  percentage: number;
}

const get_worker = (name: string) => {
  const workerScript = document.getElementById(name);
  if (workerScript && workerScript.textContent) {
    const blob = new Blob([workerScript.textContent], { type: "text/javascript" });
    return window.URL.createObjectURL(blob);
  }
  return "";
};

export class CustomWorker extends Worker {
  private _listeners = {};

  constructor(scriptURL: string) {
    super(get_worker(scriptURL));
    this.onmessage = (ev) => this._listeners[ev.data.channel](ev.data.payload);
  }

  public publish = (channel: string, payload?: any) => {
    this.postMessage({ channel, payload });
  };

  public subscribe = (channel: string, callback: (payload?: any) => void) => {
    this._listeners[channel] = callback;
  };
}
let workers: CustomWorker[] = [];

export const useDownload = (data: Data) => {
  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: Progress }>({});
  const [state, setState] = useState(DL_STATE.IDLE);
  const [results, setResults] = useState<{ [key: number]: DownloadResult }>({});
  const [appendProgress, setAppendProgress] = useState(0);
  const ranges = getRanges(data.fileSize, data.concurrency);

  if (data.mime.includes("application")) {
    fetch(data.url).then((res) => {
      res.text().then(console.log);
    });
  }

  const setUp = () => {
    const temp: CustomWorker[] = [];
    ranges.forEach(() => {
      const worker = new CustomWorker("download.worker");
      worker.subscribe("download-progress", (progress) => {
        setDownloadProgress((prev) => ({ ...prev, ...progress }));
      });
      worker.subscribe("download-finish", (result) => setResults((prev) => ({ ...prev, ...result })));
      temp.push(worker);
    });
    workers = temp;
  };

  const terminateWorkers = () => {
    workers.forEach((w) => w.terminate());
    workers = [];
  };

  const append = () => {
    if (Object.keys(results).length === ranges.length) {
      terminateWorkers();
      setState(DL_STATE.APPENDING);
      const worker = new CustomWorker("append.worker");
      worker.subscribe("append-progress", (progress) => {
        setAppendProgress(Math.round((progress / data.fileSize) * 100));
      });
      worker.subscribe("append-finish", () => {
        setState(DL_STATE.FINISHED);
        worker.terminate();
      });
      const appendPayload: AppendPayload = {
        data,
        files: ranges.map((_, idx) => results[idx].filePath),
      };
      worker.publish("append", appendPayload);
    }
  };

  useEffect(() => {
    append();
    return () => {};
  }, [results]);

  const start = () => {
    setUp();
    ranges.forEach((range, idx) =>
      workers[idx].publish("download-start", { url: data.url, range, headers: data.headers, idx })
    );
    setState(DL_STATE.STARTED);
  };
  const pause = () => {
    workers.forEach((worker) => worker.publish("download-pause"));
    setState(DL_STATE.PAUSED);
  };
  const cancel = () => {
    workers.forEach((worker) => worker.terminate());
    setState(DL_STATE.CANCELLED);
  };

  return {
    downloadProgress,
    appendProgress,
    state,
    start,
    pause,
    cancel,
  };
};

let singleWorker: CustomWorker | undefined;

export const useDownloadSingle = (data: Data) => {
  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: Progress }>({});
  const [state, setState] = useState(DL_STATE.IDLE);
  const [appendProgress, setAppendProgress] = useState(0);

  useEffect(() => {
    singleWorker = new CustomWorker("download.worker");
    singleWorker.subscribe("download-progress", (progress) => {
      setDownloadProgress((prev) => ({ ...prev, ...progress }));
    });
    singleWorker.subscribe("download-finish", (result: { [key: number]: DownloadResult }) => {
      setState(DL_STATE.APPENDING);
      fs.rename(result[0].filePath, path.join(data.savedFolder, data.fileName)).then(() => {
        setAppendProgress(100);
        setState(DL_STATE.FINISHED);
        singleWorker?.terminate();
        singleWorker = undefined;
      });
    });
    return () => {};
  }, []);

  const start = () => {
    setState(DL_STATE.STARTED);
    singleWorker?.publish("download-start", {
      url: data.url,
      range: createRange(0, data.fileSize - 1),
      headers: data.headers,
      idx: 0,
    });
  };
  const pause = () => {
    workers.forEach((worker) => worker.publish("download-pause"));
    setState(DL_STATE.PAUSED);
  };
  const cancel = () => {
    workers.forEach((worker) => worker.terminate());
    setState(DL_STATE.CANCELLED);
  };

  return {
    downloadProgress,
    appendProgress,
    state,
    start,
    pause,
    cancel,
  };
};

let hlsWorkers: CustomWorker[] = [];
let hlsUrls: string[][];

export const useDownloadHLS = (data: Data, setData: StateUpdater<Data>) => {
  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: Progress }>({});
  const [state, setState] = useState(DL_STATE.IDLE);
  const [results, setResults] = useState<{ [key: number]: { filePaths: string[] } }>({});
  const [appendProgress, setAppendProgress] = useState(0);

  const setup = async () => {
    const res = await fetch(data.url, { headers: data.headers });
    const text = await res.text();
    const urls = text
      .split("\n")
      .filter((line) => line.includes("/"))
      .map((link) => {
        if (link.includes("http")) return link;
        else return `${new URL(data.url).origin}${link}`;
      });

    getFileSize(urls[0], data.headers).then((fileSize) => {
      setData((prev) => ({ ...prev, fileSize: fileSize * urls.length }));
    });

    const chunk = Math.round(urls.length / 8);

    hlsUrls = new Array(data.concurrency).fill(1).map((_, idx) => {
      const start = idx * chunk;
      const end = start + (idx === data.concurrency - 1 ? urls.length : chunk);
      return urls.slice(start, end);
    });

    hlsUrls.forEach(() => {
      const worker = new CustomWorker("download.hls.worker");
      worker.subscribe("download-hls-progress", (progress) => {
        setDownloadProgress((prev) => ({ ...prev, ...progress }));
      });
      worker.subscribe("download-hls-finish", (result) => setResults((prev) => ({ ...prev, ...result })));
      hlsWorkers.push(worker);
    });
  };

  const terminateWorkers = () => {
    hlsWorkers.forEach((w) => w.terminate());
    hlsWorkers = [];
  };

  const append = async () => {
    if (Object.keys(results).length === data.concurrency) {
      terminateWorkers();
      setState(DL_STATE.APPENDING);
      const res = await fetch(data.url, { headers: data.headers });
      const text = await res.text();
      const urls = text.split("\n").filter((line) => line.includes("/"));
      const downloadedUrl = Object.values(results).reduce<string[]>((ts, curr, idx) => {
        return [...ts, ...results[idx].filePaths];
      }, []);

      const hlsFile = downloadedUrl.reduce((prev, curr, idx) => {
        return prev.replace(urls[idx], curr);
      }, text);

      fs.writeFile(path.join(data.savedFolder, data.fileName), hlsFile, "utf-8").then(() => {
        setAppendProgress(100);
        setState(DL_STATE.FINISHED);
      });
    }
  };

  const start = () => {
    const tsSavedFolder = path.join(data.savedFolder, data.fileName.split(".")[0]);
    fs.mkdir(tsSavedFolder).finally(() => {
      hlsWorkers.forEach((worker, idx) =>
        worker.publish("download-hls-start", {
          urls: hlsUrls[idx],
          headers: data.headers,
          idx,
          savedFolder: tsSavedFolder,
        })
      );
      setState(DL_STATE.STARTED);
    });
  };
  const pause = () => {
    hlsWorkers.forEach((worker) => worker.publish("download-hls-pause"));
    setState(DL_STATE.PAUSED);
  };
  const cancel = () => {
    hlsWorkers.forEach((worker) => worker.terminate());
    setState(DL_STATE.CANCELLED);
  };

  useEffect(() => {
    append();
    return () => {};
  }, [results]);

  useEffect(() => {
    setup();
    return () => {};
  }, []);

  return {
    downloadProgress,
    appendProgress,
    state,
    start,
    pause,
    cancel,
  };
};
