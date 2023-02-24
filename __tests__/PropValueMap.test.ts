import PropValueMap from "../src/PropValueMap";
import Value from "../src/Value";

describe("PropValueMap", () => {
  const mockVal = { a: 1 };
  it("gets all of a prop value", () => {
    const valueMap = new PropValueMap<typeof mockVal>("a");
    const newValue = new Value(mockVal);
    valueMap.add(newValue);
    expect(valueMap.getAll(1)?.first()).toBe(newValue);
  });

  it("gets first of a prop value", () => {
    const valueMap = new PropValueMap<typeof mockVal>("a");
    const newValue = new Value(mockVal);
    valueMap.add(newValue);
    valueMap.add(new Value({ a: 1 }));
    expect(valueMap.getFirst(1)).toBe(newValue);
  });

  it("gets first first value of a prop value", () => {
    const valueMap = new PropValueMap<typeof mockVal>("a");
    const newValue = new Value(mockVal);
    valueMap.add(newValue);
    valueMap.add(new Value({ a: 1 }));
    expect(valueMap.getFirstValue(1)).toBe(mockVal);
  });

  it("removes a prop value", () => {
    const valueMap = new PropValueMap<typeof mockVal>("a");
    const newValue = new Value(mockVal);
    const newValue2 = new Value({ a: 1 });
    const listener = jest.fn();
    const listener2 = jest.fn();
    newValue.addKeyListener("a", listener);
    newValue2.addKeyListener("a", listener2);
    valueMap.add(newValue);
    valueMap.add(newValue2);
    valueMap.remove(1);
    expect(valueMap.getFirst(1)).toBeUndefined();
    expect(listener).toBeCalledTimes(1);
    expect(listener2).toBeCalledTimes(1);
  });

  it("removes a specific value", () => {
    const valueMap = new PropValueMap<typeof mockVal>("a");
    const newValue = new Value(mockVal);
    const newValue2 = new Value({ a: 1 });
    const listener = jest.fn();
    const listener2 = jest.fn();
    newValue.addKeyListener("a", listener);
    newValue2.addKeyListener("a", listener2);
    valueMap.add(newValue);
    valueMap.add(newValue2);
    valueMap.removeValue(newValue);
    expect(valueMap.getFirst(1)).toBe(newValue2);
    expect(listener).toBeCalledTimes(1);
    expect(listener2).toBeCalledTimes(0);
    valueMap.removeValue(newValue2);
    expect(valueMap.getFirst(1)).toBeUndefined();
    expect(listener2).toBeCalledTimes(1);
  });

  it("turns into a record", () => {
    const valueMap = new PropValueMap<typeof mockVal>("a");
    const newValue = new Value(mockVal);
    valueMap.add(newValue);
    valueMap.add(new Value({ a: 1 }));
    expect(valueMap.toRecord()).toStrictEqual({
      "1": [newValue.value, { a: 1 }],
    });
  });

  it("checks existance of key", () => {
    const valueMap = new PropValueMap<typeof mockVal>("a");
    const newValue = new Value(mockVal);
    valueMap.add(newValue);
    valueMap.add(new Value({ a: 1 }));
    expect(valueMap.has(1)).toBeTruthy();
  });
});
