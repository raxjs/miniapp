# no-return-arrays
渲染函数暂不支持返回一个 JSX Element array。如有需要，可使用 Fragment 进行包裹。

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
function App() {
  return [
  <View>a</View>,
  <View>b</View>
  ]
}
```

Examples of **correct** code for this rule:

```jsx
function App() {
  return (
  <>
    <View>a</View>
    <View>b</View>
  </>
  )
}
```

## More
https://rax.js.org/docs/guide/compile-miniapp-syntax-constraints#return%20array