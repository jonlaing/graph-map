import PropSet from "./PropSet";
import PropValueMap from "./PropValueMap";
import Value from "./Value";

export default class GraphMap<T extends object> {
  private data: Map<keyof T, PropValueMap<T>> = new Map();

  constructor(indices: (keyof T)[], values: T[]) {
    indices.forEach((key) => this.data.set(key, new PropValueMap<T>(key)));
    this.concat(values);
  }

  keys() {
    return this.data.keys();
  }

  hasKey(key: keyof T): boolean {
    return this.data.has(key);
  }

  concat(vals: T[]): void {
    vals.forEach((val) => {
      const nodeValue = new Value({ ...val });

      for (const [key, nodeKey] of this.data.entries()) {
        nodeValue.addKeyListener(key, (newVal) => {
          if (!newVal[key]) {
            this.data.get(key)?.removeValue(nodeValue, val[key], false);
            return;
          }

          if (newVal[key] !== val[key]) {
            this.data.get(key)?.removeValue(nodeValue, val[key], false);
            this.data.get(key)?.add(nodeValue);
          }
        });

        nodeKey.add(nodeValue);
      }
    });
  }

  append(val: T): void {
    this.concat([val]);
  }

  getByPropValue(key: keyof T, value: T[keyof T]): PropSet<T> | undefined {
    return this.data.get(key)?.getAll(value);
  }

  groupBy(key: keyof T): PropValueMap<T> | undefined {
    return this.data.get(key);
  }

  update(key: keyof T, value: T[keyof T], f: (val: T) => NonNullable<T>): void {
    const set = this.data.get(key)?.getAll(value)?.values;

    if (!set) return;

    for (const node of set) {
      node.update(f);
    }
  }

  updateMany(
    key: keyof T,
    values: T[keyof T][],
    f: (val: T) => NonNullable<T>
  ): void {
    if (!this.data.has(key)) return;

    const map = this.data.get(key) as PropValueMap<T>;

    for (const [val, set] of map.entries()) {
      if (values.includes(val)) {
        for (const node of set.values) {
          node.update(f);
        }
      }
    }
  }

  set(key: keyof T, value: T[keyof T], val: T): void {
    this.update(key, value, () => val as NonNullable<T>);
  }

  remove(key: keyof T, value: T[keyof T]): void {
    this.data.get(key)?.remove(value);
  }

  toRecord(): Record<string, Record<string, T[]>> {
    const obj: Record<string, Record<string, T[]>> = {};
    for (const [key, val] of this.data) {
      obj[String(key)] = val.toRecord();
    }
    return obj;
  }
}
