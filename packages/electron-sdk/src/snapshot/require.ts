interface Snapshot {
  customRequire: {
    cache: {
      [module: string]: {
        exports: { [module: string]: any };
      };
    };
  };
}

declare global {
  let snapshotResult: Snapshot;
}

const customRequire = (moduleName: string) => {
  if (snapshotResult) {
    const module =
      snapshotResult.customRequire.cache["./snapshot.js"].exports[moduleName];
    if (module)
      return snapshotResult.customRequire.cache["./snapshot.js"].exports[
        moduleName
      ];
    throw new Error(`Module "${moduleName}" not found in snapshot`);
  }
  throw new Error("V8 Snapshot is not loaded");
};

export const snapshot = {
  require: customRequire,
};
