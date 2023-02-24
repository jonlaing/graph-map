// src/PropSet.ts
var PropSet = class {
  constructor() {
    this.data = /* @__PURE__ */ new Set();
  }
  get size() {
    return this.data.size;
  }
  first() {
    for (const val of this.data) {
      return val;
    }
  }
  add(val) {
    this.data.add(val);
  }
  remove(val, markRemoved = true) {
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
  toArray() {
    const arr = [];
    for (const val of this.values) {
      arr.push(val.value);
    }
    return arr;
  }
};

// src/PropValueMap.ts
var PropValueMap = class {
  constructor(key) {
    this.props = /* @__PURE__ */ new Map();
    this.key = key;
  }
  has(propVal) {
    return this.props.has(propVal);
  }
  getAll(propVal) {
    return this.props.get(propVal);
  }
  getFirst(propVal) {
    var _a;
    return (_a = this.getAll(propVal)) == null ? void 0 : _a.first();
  }
  getFirstValue(propVal) {
    var _a;
    return (_a = this.getFirst(propVal)) == null ? void 0 : _a.value;
  }
  add(val) {
    var _a;
    const propVal = val.value[this.key];
    if (this.props.has(propVal)) {
      (_a = this.props.get(propVal)) == null ? void 0 : _a.add(val);
    } else {
      const props = new PropSet();
      props.add(val);
      this.props.set(propVal, props);
    }
  }
  remove(propVal) {
    var _a;
    (_a = this.props.get(propVal)) == null ? void 0 : _a.clear();
    this.props.delete(propVal);
  }
  removeValue(val, prop, markRemoved = true) {
    var _a, _b;
    const propVal = prop ?? val.value[this.key];
    (_a = this.props.get(propVal)) == null ? void 0 : _a.remove(val, markRemoved);
    if (((_b = this.props.get(propVal)) == null ? void 0 : _b.size) === 0) {
      this.props.delete(propVal);
    }
  }
  entries() {
    return this.props.entries();
  }
  toRecord() {
    const obj = {};
    for (const [key, val] of this.props) {
      obj[`${key}`] = val.toArray();
    }
    return obj;
  }
};

// src/Value.ts
var Value = class {
  constructor(val) {
    this.listeners = /* @__PURE__ */ new Map();
    this.value = val;
  }
  onChange(key) {
    if (this.listeners.has(key)) {
      for (const callback of this.listeners.get(key)) {
        callback(this.value);
      }
    }
  }
  addKeyListener(key, callback) {
    var _a;
    if (this.listeners.has(key)) {
      (_a = this.listeners.get(key)) == null ? void 0 : _a.add(callback);
    } else {
      this.listeners.set(key, /* @__PURE__ */ new Set([callback]));
    }
    return () => {
      var _a2;
      return (_a2 = this.listeners.get(key)) == null ? void 0 : _a2.delete(callback);
    };
  }
  update(f) {
    const newVal = f({ ...this.value });
    for (const k in newVal) {
      if (this.value[k] !== newVal[k]) {
        this.value[k] = newVal[k];
        this.onChange(k);
      }
    }
  }
  set(val) {
    this.update(() => val);
  }
  clone() {
    return { ...this.value };
  }
  markRemoved() {
    for (const set of this.listeners.values()) {
      for (const cb of set) {
        cb({});
      }
    }
  }
};

// src/GraphMap.ts
var GraphMap = class {
  constructor(indices, values) {
    this.data = /* @__PURE__ */ new Map();
    indices.forEach((key) => this.data.set(key, new PropValueMap(key)));
    this.concat(values);
  }
  keys() {
    return this.data.keys();
  }
  hasKey(key) {
    return this.data.has(key);
  }
  concat(vals) {
    vals.forEach((val) => {
      const nodeValue = new Value({ ...val });
      for (const [key, nodeKey] of this.data.entries()) {
        nodeValue.addKeyListener(key, (newVal) => {
          var _a, _b, _c;
          if (!newVal[key]) {
            (_a = this.data.get(key)) == null ? void 0 : _a.removeValue(nodeValue, val[key], false);
            return;
          }
          if (newVal[key] !== val[key]) {
            (_b = this.data.get(key)) == null ? void 0 : _b.removeValue(nodeValue, val[key], false);
            (_c = this.data.get(key)) == null ? void 0 : _c.add(nodeValue);
          }
        });
        nodeKey.add(nodeValue);
      }
    });
  }
  append(val) {
    this.concat([val]);
  }
  getByPropValue(key, value) {
    var _a;
    return (_a = this.data.get(key)) == null ? void 0 : _a.getAll(value);
  }
  groupBy(key) {
    return this.data.get(key);
  }
  update(key, value, f) {
    var _a, _b;
    const set = (_b = (_a = this.data.get(key)) == null ? void 0 : _a.getAll(value)) == null ? void 0 : _b.values;
    if (!set)
      return;
    for (const node of set) {
      node.update(f);
    }
  }
  updateMany(key, values, f) {
    if (!this.data.has(key))
      return;
    const map = this.data.get(key);
    for (const [val, set] of map.entries()) {
      if (values.includes(val)) {
        for (const node of set.values) {
          node.update(f);
        }
      }
    }
  }
  set(key, value, val) {
    this.update(key, value, () => val);
  }
  remove(key, value) {
    var _a;
    (_a = this.data.get(key)) == null ? void 0 : _a.remove(value);
  }
  toRecord() {
    const obj = {};
    for (const [key, val] of this.data) {
      obj[String(key)] = val.toRecord();
    }
    return obj;
  }
};

// src/index.ts
var src_default = GraphMap;
export {
  src_default as default
};
//# sourceMappingURL=index.js.map