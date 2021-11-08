import fs, { ReadStream, WriteStream } from "fs";
import prettyBytes from "pretty-bytes";

export const CHUNK_SIZE = 50_000_000; // 50MB

function readBytes(fd: number, sharedBuffer: any) {
  return new Promise<void>((resolve, reject) => {
    fs.read(fd, sharedBuffer, 0, sharedBuffer.length, null, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export async function* generateChunks(filePath: string, size: number) {
  const sharedBuffer = Buffer.alloc(size);
  const stats = fs.statSync(filePath); // file details
  const fd = fs.openSync(filePath, "r"); // file descriptor
  let bytesRead = 0; // how many bytes were read
  let end = size;

  for (let i = 0; i < Math.ceil(stats.size / size); i++) {
    await readBytes(fd, sharedBuffer);
    bytesRead = (i + 1) * size;
    if (bytesRead > stats.size) {
      // When we reach the end of file,
      // we have to calculate how many bytes were actually read
      end = size - (bytesRead - stats.size);
    }
    yield sharedBuffer.slice(0, end);
  }
}

export async function* concatStreams(readables: ReadStream[]) {
  const startTime = new Date().getTime();
  for (const readable of readables) {
    for await (const chunk of readable) {
      yield chunk;
    }
  }
}

const sleep = (ms: number = 100) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getSeconds = (startTime: number) => (new Date().getTime() - startTime) / 1000;

export const createEmptyFileOfSize = (fileName: string, size: number) => {
  return new Promise<WriteStream>((resolve, reject) => {
    // Check size
    if (size < 0) {
      reject("Error: a negative size doesn't make any sense");
      return;
    }

    // Will do the processing asynchronously
    setTimeout(() => {
      try {
        // Open the file for writing; 'w' creates the file
        // (if it doesn't exist) or truncates it (if it exists)
        const fd = fs.openSync(fileName, "w");
        if (size > 0) {
          // Write one byte (with code 0) at the desired offset
          // This forces the expanding of the file and fills the gap
          // with characters with code 0
          fs.writeSync(fd, Buffer.alloc(1), 0, 1, size - 1);
        }
        // Close the file to commit the changes to the file system
        fs.closeSync(fd);

        // Promise fulfilled
        resolve(fs.createWriteStream(fileName));
      } catch (error) {
        // Promise rejected
        reject(error);
      }
      // Create the file after the processing of the current JavaScript event loop
    }, 0);
  });
};
