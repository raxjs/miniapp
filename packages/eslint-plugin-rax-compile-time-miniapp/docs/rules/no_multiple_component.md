# no-multiple-component
Rax 小程序目前不支持在同一个文件中定义两个组件

## Rule Details

Examples of **incorrect** code for this rule:

```js

function Child() {
  return <View>Child</View>;
}

function NewsItem(props) {
  const { content } = props;
  return <View><Child /></View>;
}

```

## More
https://rax.alibaba-inc.com/docs/guide/compile-miniapp-syntax-constraints#%E6%99%AE%E9%80%9A%E5%87%BD%E6%95%B0%E7%BB%84%E4%BB%B6