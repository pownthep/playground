import util from "util";
import vm from "vm";
import path from "path";
import fs from "fs-extra";
import child_process from "child_process";

const exec = util.promisify(child_process.exec);

const electronLink = require("electron-link");
const snapshotFileName = "snapshot_blob.bin";
const v8ContextFileName = getV8ContextFileName();

function getV8ContextFileName() {
  if (process.platform === "darwin") {
    return `v8_context_snapshot${process.arch.startsWith("arm") ? ".arm64" : ".x86_64"}.bin`;
  } else {
    return `v8_context_snapshot.bin`;
  }
}

const electronPaths: { [key: string]: string } = {
  darwin: "dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources",
  win32: "dist",
  linux: "dist",
};

type electronType = "electron" | "electron-nightly";

export const getElectronPath = (type: electronType = "electron") => {
  return path.resolve(require.resolve(type), "..", electronPaths[process.platform]);
};

export const copySnapshot = (baseDirPath: string, electronPath?: string) => {
  const pathToBlob = path.resolve(baseDirPath, snapshotFileName);
  const pathToBlobV8 = path.resolve(baseDirPath, v8ContextFileName);
  fs.copyFileSync(pathToBlob, path.join(electronPath, snapshotFileName));
  fs.copyFileSync(pathToBlobV8, path.join(electronPath, v8ContextFileName));
};

export const createSnapshot = async (baseDirPath: string, excludedModules: Object = {}) => {
  console.log("Creating a linked script..");
  const result = await electronLink({
    baseDirPath: baseDirPath,
    mainPath: `${baseDirPath}/snapshot.js`,
    cachePath: `${baseDirPath}/cache`,
    shouldExcludeModule: (modulePath: string) => excludedModules.hasOwnProperty(modulePath),
  });

  const snapshotScriptPath = `${baseDirPath}/cache/snapshot.js`;
  fs.writeFileSync(snapshotScriptPath, result.snapshotScript);

  // Verify if we will be able to use this in `mksnapshot`
  vm.runInNewContext(result.snapshotScript, undefined, {
    filename: snapshotScriptPath,
    displayErrors: true,
  });

  const outputBlobPath = baseDirPath;
  console.log(`Generating startup blob in "${outputBlobPath}"`);
  return exec(
    `node ${require.resolve("electron-mksnapshot/mksnapshot.js")} ${snapshotScriptPath} --output_dir ${outputBlobPath}`
  );
};

export interface SnapshotModule {
  modulePath: string;
  name: string;
  type: "string" | "module";
}

export const createEntryFile = (entryFilePath: string, modules: SnapshotModule[]) => {
  modules.forEach((module, idx) => {
    if (module.type === "string") writeStringExport(entryFilePath, module, idx);
    else writeRequire(entryFilePath, module, idx);
  });
};

const writeStringExport = (entryFilePath: string, module: SnapshotModule, idx: number) => {
  if (idx === 0) {
    fs.outputFileSync(
      entryFilePath,
      `module.exports["${module.name}"] = ${JSON.stringify(fs.readFileSync(module.modulePath, "utf-8"))};`
    );
  } else {
    fs.appendFileSync(
      entryFilePath,
      `module.exports["${module.name}"] = ${JSON.stringify(fs.readFileSync(module.modulePath, "utf-8"))};`
    );
  }
};

const writeRequire = (entryFilePath: string, module: SnapshotModule, idx: number) => {
  if (idx === 0) {
    fs.outputFileSync(entryFilePath, `require("${module.modulePath}");`);
  } else {
    fs.appendFileSync(entryFilePath, `require("${module.modulePath}");`);
  }
};
