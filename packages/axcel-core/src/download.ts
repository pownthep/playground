import axios, { AxiosRequestHeaders, CancelTokenStatic, CancelTokenSource } from "axios";
import fs, { WriteStream, ReadStream } from "fs";
import EventEmitter from "events";
import { httpClient } from "./http-client";
import fsp from "fs/promises";
import { createEmptyFileOfSize } from "./multistream";
import { pipeline } from "stream/promises";

export interface DownloadOptions {
  url: string;
  fileName: string;
  filePath: string;
  headers: AxiosRequestHeaders;
  start?: boolean;
}

export type DownloadResult = DownloadOptions & { status: number };

const enum State {
  PAUSED = "paused",
  STARTED = "started",
  IDLE = "idle",
}

export interface Range {
  start: number;
  end: number;
  size: number;
  header: string;
}

export default class Download extends EventEmitter {
  private CancelToken: CancelTokenStatic;
  private source: CancelTokenSource;
  private options: DownloadOptions;
  private progress: number;
  private result: Promise<DownloadResult>;
  private state: State;
  private writer: WriteStream;
  private reader: ReadStream;

  constructor(options: DownloadOptions) {
    super();
    this.options = { start: false, ...options };
    this.CancelToken = axios.CancelToken;
    this.source = this.CancelToken.source();
    this.progress = 0;
    this.state = State.IDLE;
    if (this.options.start) {
      this.start();
    }
  }

  get response() {
    return this.result;
  }

  get paused() {
    return this.state === "paused";
  }

  get startByte() {
    if (!this.options.headers.Range) return undefined;
    else {
      return Number(this.options.headers.Range.replace("bytes=", "").split("-").shift());
    }
  }

  private _resumeOptions(start: number) {
    return { flags: "r+", start };
  }

  public async start(options = {}) {
    const res = await httpClient({
      cancelToken: this.source.token,
      url: this.options.url,
      method: "GET",
      responseType: "stream",
      headers: this.options.headers,
    });

    this.writer = fs.createWriteStream(this.options.filePath, options);
    this.reader = res.data;
    this.reader.on("data", (chunk) => this._ondata(chunk));
    this.writer.on("finish", () => {
      this.emit("finish", { ...this.options, status: res.status });
    });
    this.writer.on("error", (err) => {});
    this.reader.pipe(this.writer);
  }

  public pause() {
    this.source.cancel();
    this.reader.pause();
    this.emit("paused", { ...this.options, progress: this.progress });
  }

  public resume() {
    this.reader.resume();
    this.emit("resumed");
  }

  public cancel() {
    this.source.cancel();
    this.reader.close();
    this.reader.destroy();
    return fsp.rm(this.options.filePath);
  }

  private _ondata(chunk: Buffer | string) {
    this.progress += chunk.length;
    this.emit("progress", chunk.length);
  }
}

export const getRanges = (length: number, concurrency: number) => {
  const chunkSize = Math.floor(length / concurrency);
  if (chunkSize === 0) return [createRange(0, length - 1)];

  const chunkDelta = length % concurrency;
  const ranges = new Array(concurrency).fill(chunkSize);
  return ranges.map((chunk, idx) => {
    const start = idx * chunk;
    const end = start + chunk - 1;
    if (idx !== ranges.length - 1) {
      return createRange(start, end);
    } else return createRange(start, end + chunkDelta);
  });
};

export const createRange = (start: number, end: number): Range => {
  return {
    start,
    end,
    size: end - start + 1,
    header: `bytes=${start}-${end}`,
  };
};

export async function merge(
  files: DownloadResult[],
  ranges: Range[],
  filePath: string,
  fileSize: number,
  fileName: string
) {
  try {
    await createEmptyFileOfSize(filePath, fileSize);
    files.forEach(async (file, idx) => {
      const reader = fs.createReadStream(file.filePath);
      const writer = fs.createWriteStream(filePath, { start: ranges[idx].start });
      await pipeline(reader, writer);
    });
  } catch (error) {
    await fsp.rm(filePath);
    throw new Error(error);
  }
}

export async function clean(files: DownloadResult[]) {
  console.time(`Clean up: ${files}`);
  await Promise.allSettled(files.map(({ filePath }) => fsp.rm(filePath)));
  console.timeEnd(`Clean up: ${files}`);
}
