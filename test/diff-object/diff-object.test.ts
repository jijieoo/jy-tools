import { diffObject } from "../../src/diff-object/diff-object";
import { describe, expect, it } from "vitest";

describe("diffObject", () => {
  it("对象相同", () => {
    const obj1 = { a: 1, b: "test" };
    const obj2 = { a: 1, b: "test" };
    const result = diffObject(obj1, obj2);

    expect(result).toEqual({
      a: { type: "UNCHANGED", beforeValue: 1, afterValue: 1 },
      b: { type: "UNCHANGED", beforeValue: "test", afterValue: "test" },
    });
  });

  it("对象属性值修改", () => {
    const obj1 = { a: 1, b: "test" };
    const obj2 = { a: 2, b: "test" };
    const result = diffObject(obj1, obj2);

    expect(result).toEqual({
      a: { type: "CHANGE", beforeValue: 1, afterValue: 2 },
      b: { type: "UNCHANGED", beforeValue: "test", afterValue: "test" },
    });
  });

  it("对象属性值新增", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1, b: "new" };
    const result = diffObject(obj1, obj2);

    expect(result).toEqual({
      a: { type: "UNCHANGED", beforeValue: 1, afterValue: 1 },
      b: { type: "ADD", beforeValue: undefined, afterValue: "new" },
    });
  });

  it("对象属性值删除", () => {
    const obj1 = { a: 1, b: "deleted" };
    const obj2 = { a: 1 };
    const result = diffObject(obj1, obj2);

    expect(result).toEqual({
      a: { type: "UNCHANGED", beforeValue: 1, afterValue: 1 },
      b: { type: "DELETE", beforeValue: "deleted", afterValue: undefined },
    });
  });

  it("对象属性值null和undefined前后相当于未修改", () => {
    const obj1 = { a: null, b: undefined, c: 0 };
    const obj2 = { a: undefined, b: null, c: 0 };
    const result = diffObject(obj1, obj2);

    expect(result).toEqual({
      a: { type: "UNCHANGED", beforeValue: null, afterValue: undefined },
      b: { type: "UNCHANGED", beforeValue: undefined, afterValue: null },
      c: { type: "UNCHANGED", beforeValue: 0, afterValue: 0 },
    });
  });

  it("两个属性完全不同的对象", () => {
    const obj1 = { a: 1, b: "old" };
    const obj2 = { c: "new", d: 2 };
    const result = diffObject(obj1, obj2);

    expect(result).toEqual({
      a: { type: "DELETE", beforeValue: 1, afterValue: undefined },
      b: { type: "DELETE", beforeValue: "old", afterValue: undefined },
      c: { type: "ADD", beforeValue: undefined, afterValue: "new" },
      d: { type: "ADD", beforeValue: undefined, afterValue: 2 },
    });
  });
});
