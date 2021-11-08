import { useEffect, useState } from "preact/hooks";
import { Observable } from "./state";

type UseObservable<T> = [T | undefined, (callback: (prev: T) => T) => void];

export function useObservable<T = any>(initialValue: T | Observable<T>): UseObservable<T> {
  const [state, setState] = useState<T>();
  let observable: Observable;

  useEffect(() => {
    if (initialValue instanceof Observable) {
      observable = initialValue;
      setState(observable.value);
    } else {
      observable = new Observable<T>(initialValue);
      setState(initialValue);
    }
    observable.subscribe((nv) => setState(nv));

    return () => {};
  }, []);

  const update = (callback: (prev: T) => T) => observable.update(callback);

  return [state, update];
}
