import Value from "../src/Value";

describe("Value", () => {
  it("changes value", () => {
    const val = new Value({ a: 1 });
    expect(val.value.a).toBe(1);
    val.set({ a: 2 });
    expect(val.value.a).toBe(2);
  });

  it("updates value", () => {
    const val = new Value({ a: 1 });
    expect(val.value.a).toBe(1);
    val.update((val) => ({ a: val.a + 1 }));
    expect(val.value.a).toBe(2);
  });

  it("listens for changes", () => {
    const val = new Value({ a: 1 });
    const listener = jest.fn();
    val.addKeyListener("a", listener);
    val.set({ a: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("can have more than one listener", () => {
    const val = new Value({ a: 1 });
    const listener = jest.fn();
    const listener2 = jest.fn();
    val.addKeyListener("a", listener);
    val.addKeyListener("a", listener2);
    val.set({ a: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it("marks for removal", () => {
    const val = new Value({ a: 1 });
    const listener = jest.fn();
    val.addKeyListener("a", listener);
    val.markRemoved();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("can remove listener", () => {
    const val = new Value({ a: 1 });
    const listener = jest.fn();
    const remove = val.addKeyListener("a", listener);
    remove();
    val.set({ a: 2 });
    expect(listener).toHaveBeenCalledTimes(0);
  });
});
