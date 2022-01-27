const { diffData } = require("../diff");

describe("Props diff", () => {
  it("same props", () => {
    expect(diffData({ a: 1 }, { a: 1 })).toStrictEqual({});
  });

  it("update props", () => {
    expect(diffData({ a: 1 }, { a: 2 })).toStrictEqual({
      a: 1,
    });
  });

  it("delete props", () => {
    expect(diffData({ a: 1 }, { a: 1, b: 2 })).toStrictEqual({
      b: null,
    });
  });

  it("add props", () => {
    expect(diffData({ a: 1, b: 2 }, { a: 1 })).toStrictEqual({
      b: 2,
    });
  });

  it("update deep props", () => {
    expect(
      diffData(
        { user: { name: "dnt", age: 18 } },
        { user: { name: "dnt", age: 20 } }
      )
    ).toStrictEqual({
      "user.age": 18,
    });
  });

  it("update deep props", () => {
    expect(
      diffData(
        { user: { name: "dnt2", age: 18 } },
        { user: { name: "dnt", age: 20 } }
      )
    ).toStrictEqual({
      "user.age": 18,
      "user.name": "dnt2",
    });
  });

  it("add deep props", () => {
    expect(
      diffData({ user: { name: "dnt", age: 18 } }, { user: { name: "dnt" } })
    ).toStrictEqual({
      "user.age": 18,
    });
  });

  it("add deep props", () => {
    expect(
      diffData(
        { user: { name: "dnt", age: 18, sex: 1 } },
        { user: { name: "dnt" } }
      )
    ).toStrictEqual({
      "user.age": 18,
      "user.sex": 1,
    });
  });

  it("delete deep props", () => {
    expect(
      diffData(
        { user: { name: "dnt" } },
        { user: { name: "dnt", age: 18, sex: 1 } }
      )
    ).toStrictEqual({
      "user.age": null,
      "user.sex": null,
    });
  });
});
