# no-multiple-return
一个渲染函数中只能存在一个 `return`

## Rule Details

Examples of **incorrect** code for this rule:

```js

function App() {
  if (false) {
    return <View>b</View>;
  }
  return <View>a</View>;
}

```

## More
https://rax.js.org/docs/guide/compile-miniapp-syntax-constraints#%E5%A4%9A%E4%B8%AA%20return