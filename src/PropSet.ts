import Value from "./Value";

export default class PropSet<T extends object> {
  private data: Set<Value<T>> = new Set();

  get size() {
    return this.data.size;
  }

  first(): Value<T> | undefined {
    for (const val of this.data) {
      return val;
    }
  }

  add(val: Value<T>) {
    this.data.add(val);
  }

  remove(val: Value<T>, markRemoved = true) {
    this.data.delete(val) && markRemoved && val.markRemoved();
  }

  clear() {
    for (const val of this.values) {
      this.remove(val);
    }
  }

  get values() {
    return this.data;
  }

  toArray(): T[] {
    const arr: T[] = [];
    for (const val of this.values) {
      arr.push(val.value);
    }
    return arr;
  }
}
