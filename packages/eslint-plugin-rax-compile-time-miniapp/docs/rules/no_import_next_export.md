# no-import-next-export
Rax 小程序目前不支持 import 一个组件后直接 export。

## Rule Details

Examples of **incorrect** code for this rule:

```jsx

// Child.jsx
export default function Child() {
  return <View>Child</View>;
}

// index.jsx
import Child from './Child';
export default Child;

```

## More
https://rax.alibaba-inc.com/docs/guide/compile-miniapp-syntax-constraints#%E6%99%AE%E9%80%9A%E5%87%BD%E6%95%B0%E7%BB%84%E4%BB%B6