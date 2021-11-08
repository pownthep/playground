import {
  createEntryFile,
  createSnapshot,
  copySnapshot,
  getElectronPath,
  SnapshotModule,
} from "@pownthep/electron-sdk/lib/cjs/snapshot";
import * as path from "path";

const modules: SnapshotModule[] = [
  {
    modulePath: require.resolve("@pownthep/lime/dist/index.html"),
    name: "lime",
    type: "string",
  },
  {
    modulePath: require.resolve("@pownthep/tab-manager/dist/tab-manager.html"),
    name: "tab-manager",
    type: "string",
  },
  {
    modulePath: require.resolve("@pownthep/lime/src/store/shows.json"),
    name: "shows",
    type: "string",
  },
];

const baseDirPath = path.resolve("./snapshot");
const electronPath = getElectronPath("electron");

createEntryFile(path.resolve(baseDirPath, "snapshot.js"), modules);
createSnapshot(baseDirPath).then(() => {
  copySnapshot(baseDirPath, electronPath);
});
