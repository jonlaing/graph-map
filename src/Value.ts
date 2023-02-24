type CallbackSet<T> = Set<(val: T) => void>;

export default class Value<T extends object> {
  value: T;
  private listeners: Map<keyof T, CallbackSet<T>> = new Map();

  constructor(val: T) {
    this.value = val;
  }

  private onChange(key: keyof T) {
    if (this.listeners.has(key)) {
      for (const callback of this.listeners.get(key) as CallbackSet<T>) {
        callback(this.value);
      }
    }
  }

  addKeyListener(key: keyof T, callback: (val: T) => void): () => void {
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.add(callback);
    } else {
      this.listeners.set(key, new Set([callback]));
    }

    return () => this.listeners.get(key)?.delete(callback);
  }

  update(f: (val: T) => NonNullable<T>): void {
    const newVal = f({ ...this.value }) as T;
    for (const k in newVal) {
      if (this.value[k] !== newVal[k]) {
        this.value[k] = newVal[k];
        this.onChange(k);
      }
    }
  }

  set(val: NonNullable<T>): void {
    this.update(() => val);
  }

  clone(): T {
    return { ...this.value };
  }

  markRemoved() {
    for (const set of this.listeners.values()) {
      for (const cb of set) {
        cb({} as T);
      }
    }
  }
}
