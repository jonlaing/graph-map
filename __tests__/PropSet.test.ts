import PropSet from "../src/PropSet";
import Value from "../src/Value";

describe("PropSet", () => {
  it("can get size", () => {
    const set = new PropSet<any>();
    expect(set.size).toBe(0);
    set.add(new Value({}));
    expect(set.size).toBe(1);
  });

  it("can get first element", () => {
    const set = new PropSet<any>();
    const newVal = new Value({});
    set.add(newVal);
    set.add(new Value({})); // add a second one for good measure
    expect(set.first()).toBe(newVal);
  });

  it("can remove an element", () => {
    const set = new PropSet<any>();
    const newVal = new Value({ a: 1 });
    const newVal2 = new Value({ a: 2 });
    const listener = jest.fn();
    newVal.addKeyListener("a", listener);
    set.add(newVal);
    set.add(newVal2); // add a second one for good measure
    set.remove(newVal);
    expect(listener).toBeCalledTimes(1);
    expect(set.first()).toBe(newVal2);
  });

  it("can clear", () => {
    const set = new PropSet<any>();
    const newVal = new Value({ a: 1 });
    const newVal2 = new Value({ a: 2 });
    const listener = jest.fn();
    newVal.addKeyListener("a", listener);
    set.add(newVal);
    set.add(newVal2); // add a second one for good measure
    set.clear();
    expect(listener).toBeCalledTimes(1);
    expect(set.size).toBe(0);
  });

  it("can turn into an array", () => {
    const set = new PropSet<any>();
    const newVal = new Value({ a: 1 });
    const newVal2 = new Value({ a: 2 });
    set.add(newVal);
    set.add(newVal2); // add a second one for good measure
    expect(set.toArray()).toStrictEqual([newVal.value, newVal2.value]);
  });
});
