export class Observable<T = any> extends EventTarget {
  private _internalState: T;

  constructor(initialValue: T) {
    super();
    this._internalState = initialValue;
  }

  public update(callback: (prev: T) => T) {
    this._internalState = callback(this._internalState);
    const event = new Event("state_change");
    this.dispatchEvent(event);
  }

  public subscribe(callback: (newState: T) => void) {
    this.addEventListener("state_change", () => {
      callback(this._internalState);
    });
  }

  get value() {
    return this._internalState;
  }
}
