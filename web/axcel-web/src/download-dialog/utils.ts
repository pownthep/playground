export const getFileSize = async (url: string, headers: any) => {
  try {
    const res = await fetch(url, { method: "HEAD", headers });
    return Number(res.headers.get("content-length") ?? res.headers.get("Content-Length") ?? 0);
  } catch (error) {
    const res = await fetch(url, { method: "GET", headers });
    return Number(res.headers.get("content-length") ?? res.headers.get("Content-Length") ?? 0);
  }
};

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

export const sleep = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

export interface DownloadOptions {
  url: string;
  fileName: string;
  filePath: string;
  headers: any;
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
