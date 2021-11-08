import EventEmitter from "events";
import * as fs from "fs";
import { WriteStream } from "fs";
import { concatStreams } from "./multistream";
import stream from "stream";

export class Piper extends EventEmitter {
  private files: string[];
  private writer: WriteStream;
  constructor(files: string[], writer: WriteStream) {
    super();
    this.files = files;
    this.writer = writer;
  }

  public async combine() {
    const fileStreams = this.files.map((file) => fs.createReadStream(file));
    const streamIterator = await concatStreams(fileStreams);
    const mergedStream = stream.Readable.from(streamIterator);
    return this._pipe(mergedStream, this.writer);
  } 

  private _pipe(reader: stream.Readable, writer: WriteStream) {
    return new Promise<void>((resolve, reject) => {
      reader.on("data", (chunk) => this.emit("progress", chunk.length));
      reader.pipe(writer);
      writer.on("finish", () => resolve());
      writer.on("error", (e) => reject(e));
    });
  }
}
