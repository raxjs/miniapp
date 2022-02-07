const { diffData } = require('../diff');

describe('Array diff', () => {
  it('add item to array', () => {
    expect(
      diffData({ list: [{ a: 1 }, { a: 2 }] }, { list: [{ a: 1 }] })
    ).toStrictEqual({
      'list[1]': { a: 2 },
    });
  });

  it('diff with null/undefined', () => {
    expect(diffData({ list: [{ a: 1 }, { a: 2 }] }, null)).toStrictEqual({
      list: [{ a: 1 }, { a: 2 }],
    });
  });

  it('delete item from array', () => {
    expect(
      diffData({ list: [{ a: 1 }] }, { list: [{ a: 1 }, { a: 2 }] })
    ).toStrictEqual({
      list: [{ a: 1 }],
    });
  });

  it('modify item of array', () => {
    expect(diffData({ list: [{ a: 1 }] }, { list: [{ a: 2 }] })).toStrictEqual({
      'list[0].a': 1,
    });
  });

  it('modify item of array', () => {
    expect(diffData({ list: [{ a: 1 }] }, { list: [{ a: 2 }] })).toStrictEqual({
      'list[0].a': 1,
    });
  });

  it('modify item of array & update props', () => {
    expect(
      diffData({ list: [{ a: 1 }], a: 1 }, { list: [{ a: 2 }], a: 2 })
    ).toStrictEqual({
      'list[0].a': 1,
      a: 1,
    });
  });

  it('complex ', () => {
    expect(
      diffData(
        {
          a: 1,
          b: 2,
          c: 'str',
          d: { e: [2, { a: 4 }, 5] },
          f: true,
          h: [1],
          g: { a: [1, 2], j: 111 },
        },
        {
          a: [],
          b: 'aa',
          c: 3,
          d: { e: [3, { a: 3 }] },
          f: false,
          h: [1, 2],
          g: { a: [1, 1, 1], i: 'delete' },
          k: 'del',
        }
      )
    ).toStrictEqual({
      a: 1,
      b: 2,
      c: 'str',
      'd.e[0]': 2,
      'd.e[1].a': 4,
      'd.e[2]': 5,
      f: true,
      h: [1],
      'g.a': [1, 2],
      'g.j': 111,
      'g.i': null,
      k: null,
    });
  });
});
