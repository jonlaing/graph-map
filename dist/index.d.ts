declare class Value<T extends object> {
    value: T;
    private listeners;
    constructor(val: T);
    private onChange;
    addKeyListener(key: keyof T, callback: (val: T) => void): () => void;
    update(f: (val: T) => NonNullable<T>): void;
    set(val: NonNullable<T>): void;
    clone(): T;
    markRemoved(): void;
}

declare class PropSet<T extends object> {
    private data;
    get size(): number;
    first(): Value<T> | undefined;
    add(val: Value<T>): void;
    remove(val: Value<T>, markRemoved?: boolean): void;
    clear(): void;
    get values(): Set<Value<T>>;
    toArray(): T[];
}

declare class PropValueMap<T extends object> {
    key: keyof T;
    private props;
    constructor(key: keyof T);
    has(propVal: T[keyof T]): boolean;
    getAll(propVal: T[keyof T]): PropSet<T> | undefined;
    getFirst(propVal: T[keyof T]): Value<T> | undefined;
    getFirstValue(propVal: T[keyof T]): T | undefined;
    add(val: Value<T>): void;
    remove(propVal: T[keyof T]): void;
    removeValue(val: Value<T>, prop?: T[keyof T], markRemoved?: boolean): void;
    entries(): IterableIterator<[T[keyof T], PropSet<T>]>;
    toRecord(): Record<string, T[]>;
}

declare class GraphMap<T extends object> {
    private data;
    constructor(indices: (keyof T)[], values: T[]);
    keys(): IterableIterator<keyof T>;
    hasKey(key: keyof T): boolean;
    concat(vals: T[]): void;
    append(val: T): void;
    getByPropValue(key: keyof T, value: T[keyof T]): PropSet<T> | undefined;
    groupBy(key: keyof T): PropValueMap<T> | undefined;
    update(key: keyof T, value: T[keyof T], f: (val: T) => NonNullable<T>): void;
    updateMany(key: keyof T, values: T[keyof T][], f: (val: T) => NonNullable<T>): void;
    set(key: keyof T, value: T[keyof T], val: T): void;
    remove(key: keyof T, value: T[keyof T]): void;
    toRecord(): Record<string, Record<string, T[]>>;
}

export { GraphMap as default };
