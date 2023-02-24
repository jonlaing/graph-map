import GraphMap from "../src/GraphMap";

interface Val {
  a: number;
  b: number;
  c: number;
}

describe("GraphMap", () => {
  let graphMap = new GraphMap<Val>(
    ["a", "b"],
    [
      { a: 1, b: 2, c: 3 },
      { a: 2, b: 3, c: 4 },
    ]
  );

  afterEach(() => {
    graphMap = new GraphMap<Val>(
      ["a", "b"],
      [
        { a: 1, b: 2, c: 3 },
        { a: 2, b: 3, c: 4 },
      ]
    );
  });
  it("has key", () => {
    expect(graphMap.hasKey("a")).toBe(true);
    expect(graphMap.hasKey("c")).toBe(false);
  });

  it("concats new values", () => {
    graphMap.concat([{ a: 3, b: 4, c: 5 }]);
    expect(graphMap.getByPropValue("a", 3)?.size).toBe(1);
    graphMap.concat([{ a: 3, b: 5, c: 6 }]);
    expect(graphMap.getByPropValue("a", 3)?.size).toBe(2);
  });

  it("appends a new value", () => {
    graphMap.append({ a: 4, b: 5, c: 6 });
    expect(graphMap.getByPropValue("a", 4)?.size).toBe(1);
  });

  it("updates a value", () => {
    graphMap.update("a", 1, (val) => ({ ...val, b: 4 }));
    expect(graphMap.getByPropValue("a", 1)?.first()?.value.b).toBe(4);
    graphMap.update("a", 1, (val) => ({ ...val, a: 100 }));
    expect(graphMap.getByPropValue("a", 100)?.first()?.value.b).toBe(4);
  });

  it("updates many", () => {
    graphMap.concat([
      { a: 3, b: 4, c: 5 },
      { a: 4, b: 5, c: 6 },
    ]);
    graphMap.updateMany("a", [3, 4], (val) => ({ ...val, a: -1 }));
    expect(graphMap.getByPropValue("a", -1)?.size).toBe(2);
  });

  it("sets a value", () => {
    graphMap.set("a", 1, { a: -1, b: 100, c: 1 });
    expect(graphMap.getByPropValue("a", -1)?.first()?.value.b).toBe(100);
    expect(graphMap.getByPropValue("b", 100)?.first()?.value.c).toBe(1);
    expect(graphMap.getByPropValue("a", 1)).toBeUndefined();
    expect(graphMap.getByPropValue("b", 2)).toBeUndefined();
  });

  it("removes", () => {
    graphMap.remove("a", 1);
    expect(graphMap.getByPropValue("a", 1)).toBeUndefined();
    expect(graphMap.getByPropValue("b", 2)).toBeUndefined();
  });

  it("turns into record", () => {
    expect(graphMap.toRecord()).toStrictEqual({
      a: {
        "1": [{ a: 1, b: 2, c: 3 }],
        "2": [{ a: 2, b: 3, c: 4 }],
      },
      b: {
        "2": [{ a: 1, b: 2, c: 3 }],
        "3": [{ a: 2, b: 3, c: 4 }],
      },
    });
  });
});
