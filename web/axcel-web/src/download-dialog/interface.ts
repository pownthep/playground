export interface DownloadPayload {
  fileName: string;
  fileSize: number;
  savedFolder: string;
  headers: any;
  url: string;
}

export interface DownloadHLSPayload {
  urls: string[];
  headers: any;
  idx: number;
  savedFolder: string;
  fileName: string;
}

export interface ProgressPayload {
  success: boolean;
  data?: { part: number; progress: number; fileSize: number };
}

export interface Data {
  concurrency: number;
  fileName: string;
  fileSize: number;
  headers: any;
  savedFolder: string;
  url: string;
  mime: string;
}

export interface AppendPayload {
  files: string[];
  data: Data;
}
