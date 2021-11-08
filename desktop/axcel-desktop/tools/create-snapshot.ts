import {
  copySnapshot,
  createEntryFile,
  createSnapshot,
  getElectronPath,
  SnapshotModule,
} from "@pownthep/electron-sdk/lib/cjs/snapshot";
import * as path from "path";

const modules: SnapshotModule[] = [
  {
    modulePath: require.resolve("@pownthep/axcel-web/dist/download-dialog/download-dialog.html"),
    name: "download-dialog",
    type: "string",
  },
];

const baseDirPath = path.resolve("./snapshot");
const electronPath = getElectronPath("electron");

createEntryFile(path.resolve(baseDirPath, "snapshot.js"), modules);
createSnapshot(baseDirPath).then(() => {
  copySnapshot(baseDirPath, electronPath);
});
