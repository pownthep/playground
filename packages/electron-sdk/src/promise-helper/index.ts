import log from 'electron-log';

export async function $<T>(prom: Promise<T>): Promise<[T | null, any]> {
  try {
    return [await prom, null];
  } catch (error) {
    log.error(error);
    return [null, error];
  }
}
