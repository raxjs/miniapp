import mock from '../../renderMock';
import { toDash, toCamel, getId } from '../../src/utils/tool';

test('tool: toDash', () => {
  expect(toDash('abcD12kKD;saS')).toBe('abc-d12k-k-d;sa-s');
  expect(toDash('ABC')).toBe('-a-b-c');
});

test('tool: toCamel', () => {
  expect(toCamel('abc-d12k-k-d;sa-s')).toBe('abcD12kKD;saS');
  expect(toCamel('-a-b-c')).toBe('ABC');
});

test('tool: getId', () => {
  expect(getId().toString()).toEqual('0');
  expect(getId().toString()).toEqual('1');
  expect(getId().toString()).toEqual('2');
});
