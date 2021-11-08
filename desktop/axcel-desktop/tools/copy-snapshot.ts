import { copySnapshot, getElectronPath } from "@pownthep/electron-sdk/lib/cjs/snapshot";
import * as path from "path";
import * as fs from "fs";

const baseDirPath = path.resolve("./snapshot");
const electronPath = getElectronPath("electron");

// console.log(process.cwd(), __dirname);

// console.log(fs.statSync(path.join(process.cwd(), "snapshot_blob.bin")));

// fs.renameSync(path.join(process.cwd(), "snapshot_blob.bin"), path.join(process.cwd(), "snaphot", "snapshot_blob.bin"));
// fs.renameSync(
//   path.join(process.cwd(), "v8_context_snapshot.bin"),
//   path.join(process.cwd(), "snaphot", "v8_context_snapshot.bin")
// );

copySnapshot(baseDirPath, electronPath);
