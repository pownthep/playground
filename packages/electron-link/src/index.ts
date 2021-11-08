import TransformCache from "./transform-cache";
import generateSnapshotScript from "./generate-snapshot-script";

interface Options {
  shouldExcludeModule: Object;
  cachePath: string;
  mainPath: string;
}

export default async function (options: Options) {
  const cacheInvalidationKey =
    options.shouldExcludeModule.toString() + require("../package.json").version;
  const cache = new TransformCache(options.cachePath, cacheInvalidationKey);
  await cache.loadOrCreate();
  delete options.cachePath;

  const result = await generateSnapshotScript(cache, options);
  await cache.dispose();
  return result;
}
