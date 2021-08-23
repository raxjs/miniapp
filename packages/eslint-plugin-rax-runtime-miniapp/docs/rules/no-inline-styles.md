# 不推荐使用内联样式 (no-inline-style)

在运行时小程序中，内联样式会导致 `setData` 传输的数据体积变大。本规则会检测元素的内联样式，当内联样式的每一项属性或属性值均为变量时，不会报错。

## Rule Details


Examples of **incorrect** code for this rule:

```js
function Hello() {
  return (
    <Text style={{ backgroundColor: '#fff' }}>Hello</Text>
  );
}
```

```js
function Hello(props) {
  return (
    <Text style={{ height: props.height, backgroundColor: '#fff' }}>Hello</Text>
  );
}
```

Examples of **correct** code for this rule:

```js
function Hello(props) {
  return (
    <Text style={{ height: props.height }}>Hello</Text>
  );
}
```
