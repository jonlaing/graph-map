import PropSet from "./PropSet";
import Value from "./Value";

export default class PropValueMap<T extends object> {
  key: keyof T;
  private props: Map<T[keyof T], PropSet<T>> = new Map();

  constructor(key: keyof T) {
    this.key = key;
  }

  has(propVal: T[keyof T]): boolean {
    return this.props.has(propVal);
  }

  getAll(propVal: T[keyof T]): PropSet<T> | undefined {
    return this.props.get(propVal);
  }

  getFirst(propVal: T[keyof T]): Value<T> | undefined {
    return this.getAll(propVal)?.first();
  }

  getFirstValue(propVal: T[keyof T]): T | undefined {
    return this.getFirst(propVal)?.value;
  }

  add(val: Value<T>) {
    const propVal = val.value[this.key];
    if (this.props.has(propVal)) {
      this.props.get(propVal)?.add(val);
    } else {
      const props = new PropSet<T>();
      props.add(val);
      this.props.set(propVal, props);
    }
  }

  remove(propVal: T[keyof T]) {
    this.props.get(propVal)?.clear();
    this.props.delete(propVal);
  }

  removeValue(val: Value<T>, prop?: T[keyof T], markRemoved = true) {
    const propVal = prop ?? val.value[this.key];

    this.props.get(propVal)?.remove(val, markRemoved);

    if (this.props.get(propVal)?.size === 0) {
      this.props.delete(propVal);
    }
  }

  entries() {
    return this.props.entries();
  }

  toRecord(): Record<string, T[]> {
    const obj: Record<string, T[]> = {};

    for (const [key, val] of this.props) {
      obj[`${key}`] = val.toArray();
    }

    return obj;
  }
}
